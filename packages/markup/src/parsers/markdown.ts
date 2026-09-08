/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { MarkupParseError } from '../error'
import { type Entity, Formatted } from '../formatted'

import { composeWithSentinels, expandSentinels, isTemplateStringsArray } from './sentinel'

const ESCAPABLE = new Set(['\\', '`', '*', '_', '~', '|', '[', ']', '(', ')', '>'])

interface State {
  src: string
  pos: number
  text: string
  entities: Entity[]
}

function fail (s: State, msg: string, at = s.pos) {
  throw new MarkupParseError(msg, at, s.src)
}

function startsWith (s: State, str: string): boolean {
  return s.src.startsWith(str, s.pos)
}

// charAt always returns string ('' for OOB), avoiding noUncheckedIndexedAccess non-null assertions
function peek (s: State, offset = 0) {
  return s.src.charAt(s.pos + offset)
}

interface Delim {
  open: string
  type: Entity['type']
}

// ordered: longer delimiters first so we match ** before *, __ before _, etc
const DELIMITERS: readonly Delim[] = [
  { open: '**', type: 'bold' },
  { open: '__', type: 'underline' },
  { open: '~~', type: 'strikethrough' },
  { open: '||', type: 'spoiler' },
  { open: '_', type: 'italic' },
  { open: '*', type: 'bold' },
  { open: '~', type: 'strikethrough' }
]

function matchDelim (s: State) {
  for (const d of DELIMITERS) {
    if (startsWith(s, d.open)) {
      return d
    }
  }

  return null
}

function parseInline (s: State, stopAt: string | null) {
  while (s.pos < s.src.length) {
    if (stopAt !== null && startsWith(s, stopAt)) {
      return
    }

    const ch = peek(s)

    if (ch === '\n' && stopAt === null) {
      return
    }

    if (ch === '\\') {
      const next = peek(s, 1)

      if (next !== '' && ESCAPABLE.has(next)) {
        s.text += next
        s.pos += 2
        continue
      }

      s.text += '\\'
      s.pos += 1
      continue
    }

    if (ch === '`') {
      parseInlineCode(s)
      continue
    }

    if (ch === '[') {
      parseLink(s, false)
      continue
    }

    if (ch === '!' && peek(s, 1) === '[') {
      s.pos += 1
      parseLink(s, true)
      continue
    }

    const delim = matchDelim(s)

    if (delim !== null) {
      parseFramed(s, delim)
      continue
    }

    s.text += ch
    s.pos += 1
  }
}

function parseFramed (s: State, delim: Delim) {
  const start = s.text.length
  const openPos = s.pos

  s.pos += delim.open.length
  parseInline(s, delim.open)

  if (!startsWith(s, delim.open)) {
    fail(s, `unmatched ${delim.open}`, openPos)
  }

  s.pos += delim.open.length
  s.entities.push({ type: delim.type, offset: start, length: s.text.length - start })
}

function parseInlineCode (s: State) {
  const openPos = s.pos
  const start = s.text.length

  s.pos += 1

  while (s.pos < s.src.length && peek(s) !== '`') {
    if (peek(s) === '\\' && peek(s, 1) !== '') {
      const next = peek(s, 1)

      if (next === '`' || next === '\\') {
        s.text += next
        s.pos += 2
        continue
      }
    }

    s.text += peek(s)
    s.pos += 1
  }

  if (peek(s) !== '`') {
    fail(s, 'unmatched `', openPos)
  }

  s.pos += 1
  s.entities.push({ type: 'code', offset: start, length: s.text.length - start })
}

function parseLink (s: State, bang: boolean) {
  const openPos = s.pos
  const start = s.text.length

  s.pos += 1
  parseInline(s, ']')

  if (peek(s) !== ']' || peek(s, 1) !== '(') {
    fail(s, 'malformed link — expected ](', openPos)
  }

  s.pos += 2

  let close = s.pos
  let target = ''

  while (close < s.src.length && s.src.charAt(close) !== ')') {
    if (s.src.charAt(close) === '\\' && close + 1 < s.src.length) {
      target += s.src.charAt(close + 1)
      close += 2
      continue
    }

    target += s.src.charAt(close)
    close += 1
  }

  if (close >= s.src.length) {
    fail(s, 'malformed link — missing )', openPos)
  }

  const url = target
  const length = s.text.length - start

  s.pos = close + 1

  if (url.startsWith('tg://user?id=')) {
    if (bang) {
      fail(s, '! prefix is only valid for tg://time and tg://emoji urls', openPos)
    }

    const id = parseInt(url.slice('tg://user?id='.length), 10)

    // sentinel-laden interpolation makes parseInt return NaN — emit text_link
    // and let post-expansion reclassify any tg://user?id=N url into text_mention
    if (!Number.isNaN(id)) {
      s.entities.push({
        type: 'text_mention',
        offset: start,
        length,
        user: { id, first_name: s.text.slice(start), is_bot: false }
      })

      return
    }

    s.entities.push({ type: 'text_link', offset: start, length, url })

    return
  }

  if (url.startsWith('tg://emoji?')) {
    const id = readQuery(url.slice('tg://emoji?'.length), 'id')

    if (id !== undefined) {
      s.entities.push({ type: 'custom_emoji', offset: start, length, custom_emoji_id: id })

      return
    }

    // unresolved (sentinel-laden interpolation) — keep as text_link, post-expand reclassifies
    s.entities.push({ type: 'text_link', offset: start, length, url })

    return
  }

  if (url.startsWith('tg://time?')) {
    const query = url.slice('tg://time?'.length)
    const unixRaw = readQuery(query, 'unix')

    if (unixRaw !== undefined) {
      const unix = parseInt(unixRaw, 10)

      if (!Number.isNaN(unix)) {
        const entity: Entity = { type: 'date_time', offset: start, length, unix_time: unix }
        const format = readQuery(query, 'format')

        if (format !== undefined && format !== '') {
          entity.date_time_format = format
        }

        s.entities.push(entity)

        return
      }
    }

    // unresolved (sentinel-laden interpolation) — keep as text_link for post-expansion
    s.entities.push({ type: 'text_link', offset: start, length, url })

    return
  }

  if (bang) {
    fail(s, '! prefix is only valid for tg://time and tg://emoji urls', openPos)
  }

  s.entities.push({ type: 'text_link', offset: start, length, url })
}

function readQuery (query: string, key: string) {
  for (const part of query.split('&')) {
    const eq = part.indexOf('=')

    if (eq === -1) {
      continue
    }

    if (part.slice(0, eq) === key) {
      return part.slice(eq + 1)
    }
  }

  return undefined
}

function emitQuote (s: State, innerLines: readonly string[], type: 'blockquote' | 'expandable_blockquote') {
  if (s.text.length > 0 && !s.text.endsWith('\n')) {
    s.text += '\n'
  }

  const start = s.text.length
  const innerState: State = { src: innerLines.join('\n'), pos: 0, text: '', entities: [] }

  parseBlockContent(innerState)

  s.text += innerState.text

  for (const e of innerState.entities) {
    s.entities.push({ ...e, offset: e.offset + start })
  }

  s.entities.push({ type, offset: start, length: s.text.length - start })
}

/** parses our MarkdownV2-flavored dialect into a Formatted */
export function parseMarkdown (src: string) {
  const s: State = { src, pos: 0, text: '', entities: [] }
  const lines = src.split('\n')
  let i = 0

  const advanceTo = (lineStart: number) => {
    s.pos = lineStart
  }

  const lineStarts: number[] = [0]

  for (let p = 0; p < src.length; p++) {
    if (src[p] === '\n') {
      lineStarts.push(p + 1)
    }
  }

  while (i < lines.length) {
    const line = lines[i] as string
    const lineStart = lineStarts[i] as number

    advanceTo(lineStart)

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const fenceStart = lineStart

      i += 1

      const buf: string[] = []

      while (i < lines.length && !(lines[i] as string).startsWith('```')) {
        buf.push(lines[i] as string)
        i += 1
      }

      if (i >= lines.length) {
        fail(s, 'unmatched ```', fenceStart)
      }

      i += 1

      const preText = buf.join('\n').replace(/\\([`\\])/g, '$1')

      if (s.text.length > 0 && !s.text.endsWith('\n')) {
        s.text += '\n'
      }

      const preStart = s.text.length

      s.text += preText

      const entity: Entity = { type: 'pre', offset: preStart, length: preText.length }

      if (lang !== '') {
        entity.language = lang
      }

      s.entities.push(entity)
      continue
    }

    if (line.startsWith('>>')) {
      const innerLines: string[] = []

      while (i < lines.length && (lines[i] as string).startsWith('>>')) {
        innerLines.push((lines[i] as string).slice(2).replace(/^ /, ''))
        i += 1
      }

      emitQuote(s, innerLines, 'expandable_blockquote')
      continue
    }

    if (line.startsWith('>')) {
      const innerLines: string[] = []

      while (i < lines.length && (lines[i] as string).startsWith('>') && !(lines[i] as string).startsWith('>>')) {
        innerLines.push((lines[i] as string).slice(1).replace(/^ /, ''))
        i += 1
      }

      emitQuote(s, innerLines, 'blockquote')
      continue
    }

    if (i > 0 && s.text.length > 0 && !s.text.endsWith('\n')) {
      s.text += '\n'
    }

    const lineState: State = { src: line, pos: 0, text: s.text, entities: s.entities }

    parseInline(lineState, null)

    s.text = lineState.text
    s.entities = lineState.entities
    i += 1
  }

  s.entities.sort((a, b) => a.offset - b.offset)

  return new Formatted(s.text, s.entities)
}

function parseBlockContent (s: State) {
  while (s.pos < s.src.length) {
    parseInline(s, null)

    if (peek(s) === '\n') {
      s.text += '\n'
      s.pos += 1
    }
  }
}

const RE_SPECIALS = /[.*+?^${}()|[\]\\]/g

function escapeForRegExp (s: string) {
  return s.replace(RE_SPECIALS, '\\$&')
}

function detectFirstIndent (strings: TemplateStringsArray) {
  const first = strings[0] ?? ''

  if (!first.startsWith('\n')) {
    return null
  }

  const m = first.match(/^\n([ \t]+)/)

  return m === null ? '' : m[1] ?? ''
}

function mdTagged (strings: TemplateStringsArray, rest: readonly unknown[]) {
  const indent = detectFirstIndent(strings)
  let firstSeen = false

  const transform = (s: string) => {
    let out = s

    if (!firstSeen) {
      firstSeen = true

      if (indent !== null) {
        out = out.startsWith('\n') ? out.slice(1) : out

        if (indent !== '' && out.startsWith(indent)) {
          out = out.slice(indent.length)
        }
      }
    }

    if (indent !== null && indent !== '') {
      out = out.replace(new RegExp(`\\n${escapeForRegExp(indent)}`, 'g'), '\n')
    }

    return out
  }

  const segments = Array.from(strings)

  if (indent !== null && segments.length > 0) {
    const last = segments.length - 1

    segments[last] = (segments[last] as string).replace(/\n[ \t]*$/, '')
  }

  // composeWithSentinels only reads .length + integer indices, so plain array works
  const { source, slots } = composeWithSentinels(segments as unknown as TemplateStringsArray, rest, transform)
  const parsed = parseMarkdown(source)

  return expandSentinels(parsed, slots)
}

export interface MdCallable {
  (source: string): Formatted
  (strings: TemplateStringsArray, ...rest: readonly unknown[]): Formatted
  /** permissive parse — returns a plain-text `Formatted` on parse failure instead of throwing */
  lenient: (source: string) => Formatted
}

function mdImpl (first: string | TemplateStringsArray, rest: readonly unknown[]) {
  if (isTemplateStringsArray(first)) {
    return mdTagged(first, rest)
  }

  return parseMarkdown(first)
}

const mdCallable = ((first: string | TemplateStringsArray, ...rest: readonly unknown[]) => {
  return mdImpl(first, rest)
}) as MdCallable

mdCallable.lenient = (source: string) => {
  try {
    return parseMarkdown(source)
  } catch (err) {
    if (err instanceof MarkupParseError) {
      return new Formatted(source, [])
    }

    throw err
  }
}

/** parses our MarkdownV2-flavored dialect. accepts both function-call form and tagged-template form */
export const md: MdCallable = mdCallable

/** alias for {@link md} */
export const markdown: MdCallable = md
