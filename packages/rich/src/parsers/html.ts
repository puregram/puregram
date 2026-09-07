import type {
  TelegramInputRichBlock,
  TelegramInputRichBlockListItem,
  TelegramRichBlockCaption,
  TelegramRichBlockTableCell,
  TelegramRichMessageButton,
  TelegramRichText
} from '@puregram/api'

import {
  DEFAULT_MAP_HEIGHT, DEFAULT_MAP_WIDTH, DEFAULT_MAP_ZOOM, MAX_BUTTON_ROW_BUTTONS,
  MAX_NESTING_DEPTH, TABLE_CELL_VALIGN
} from '../constants'
import { RichParseError } from '../error'

import { NAMED_ENTITIES } from './entities'
import { lookupTable } from './table'

/** the dialect-native content parsers a fragment delegates inner content to */
export interface HostParsers {
  inline: (source: string) => TelegramRichText
  blocks: (source: string) => TelegramInputRichBlock[]
}

/** one parsed html element — its level, emitted value, and the index just past it */
export interface HtmlFragmentResult {
  level: 'inline' | 'block'
  value: TelegramRichText | TelegramInputRichBlock | TelegramInputRichBlock[]
  end: number
}

// one lexed tag occurrence; `opens` marks openings that deepen matching (non-void, non-self-closing)
interface TagToken {
  pos: number
  end: number
  name: string
  close: boolean
  opens: boolean
  match: number
}

interface ParseOpts {
  lenient?: boolean
}

type InlineWrapType =
  | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'spoiler'
  | 'code' | 'marked' | 'subscript' | 'superscript'

const INLINE_WRAPS = lookupTable<InlineWrapType>({
  b: 'bold',
  strong: 'bold',
  i: 'italic',
  em: 'italic',
  u: 'underline',
  ins: 'underline',
  s: 'strikethrough',
  strike: 'strikethrough',
  del: 'strikethrough',
  code: 'code',
  mark: 'marked',
  sub: 'subscript',
  sup: 'superscript',
  'tg-spoiler': 'spoiler'
})

const HEADING_SIZES = lookupTable<number>({ h1: 1, h2: 2, h3: 3, h4: 4, h5: 5, h6: 6 })

const SUPPORTED_TAGS = lookupTable<true>(Object.fromEntries([
  ...Object.keys(INLINE_WRAPS),
  ...Object.keys(HEADING_SIZES),
  'a', 'tg-reference', 'tg-emoji', 'tg-time', 'tg-math', 'br', 'tg-button',
  'p', 'pre', 'footer', 'hr', 'ul', 'ol', 'blockquote', 'aside',
  'img', 'video', 'audio', 'tg-document', 'figure', 'tg-map', 'tg-collage', 'tg-slideshow',
  'table', 'details', 'tg-math-block', 'tg-thinking', 'tg-button-row'
].map(name => [name, true])))

// elements that never take a closing tag; a redundant immediate close is still consumed
const VOID_TAGS = lookupTable<true>({ br: true, hr: true, img: true, 'tg-map': true })

function isWs (ch: string) {
  return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || ch === '\f'
}

function abort (opts: ParseOpts, message: string, pos: number, source: string) {
  if (opts.lenient === true) {
    return null
  }

  throw new RichParseError(message, pos, source)
}

interface OpenTagScan {
  kind: 'tag'
  close: boolean
  name: string
  attrSrc: string
  selfClosing: boolean
  end: number
}

const TAG_NAME_RE = /[a-zA-Z][a-zA-Z0-9-]*/y

function scanTag (source: string, pos: number) {
  let i = pos + 1
  const close = source[i] === '/'

  if (close) {
    i += 1
  }

  TAG_NAME_RE.lastIndex = i

  const nameMatch = TAG_NAME_RE.exec(source)

  if (nameMatch === null) {
    return { kind: 'text' as const }
  }

  const name = nameMatch[0].toLowerCase()

  i += nameMatch[0].length

  const attrStart = i

  while (i < source.length) {
    const ch = source[i] as string

    if (ch === '"' || ch === "'") {
      const quoteEnd = source.indexOf(ch, i + 1)

      if (quoteEnd === -1) {
        return { kind: 'unterminated' as const, name }
      }

      i = quoteEnd + 1
      continue
    }

    if (ch === '>') {
      let attrSrc = source.slice(attrStart, i)
      const trimmed = attrSrc.trimEnd()
      // html5 keeps '/' inside an unquoted attribute value — only a slash after
      // whitespace, a quote, or the bare tag name is a self-closing marker
      const before = trimmed[trimmed.length - 2]
      const selfClosing = trimmed.endsWith('/') &&
        (before === undefined || before === '"' || before === "'" || isWs(before))

      if (selfClosing) {
        attrSrc = trimmed.slice(0, -1)
      }

      return { kind: 'tag' as const, close, name, attrSrc, selfClosing, end: i + 1 }
    }

    if (ch === '<') {
      return { kind: 'text' as const }
    }

    i += 1
  }

  return { kind: 'unterminated' as const, name }
}

const ENTITY_BODY_RE = /(#[xX][0-9a-fA-F]+|#[0-9]+|[a-zA-Z][a-zA-Z0-9]*);/y

// returns null for a bare ampersand (both modes) or an undecodable entity in lenient mode
function decodeEntityAt (
  text: string,
  pos: number,
  opts: ParseOpts,
  errSource: string,
  errPos: number
) {
  ENTITY_BODY_RE.lastIndex = pos + 1

  const match = ENTITY_BODY_RE.exec(text)

  if (match === null) {
    return null
  }

  const body = match[1] as string
  const end = pos + 1 + match[0].length

  if (body.startsWith('#')) {
    const hex = body[1] === 'x' || body[1] === 'X'
    const code = parseInt(body.slice(hex ? 2 : 1), hex ? 16 : 10)
    const control = code < 0x20 && code !== 0x09 && code !== 0x0a

    if (control || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff)) {
      return abort(opts, `malformed numeric entity &${body};`, errPos, errSource)
    }

    return { value: String.fromCodePoint(code), end }
  }

  const named = NAMED_ENTITIES[body]

  if (named === undefined) {
    return abort(opts, `unknown named entity &${body};`, errPos, errSource)
  }

  return { value: named, end }
}

function decodeEntities (text: string, opts: ParseOpts, errSource: string, baseOffset: number) {
  if (!text.includes('&')) {
    return text
  }

  let out = ''
  let i = 0

  while (i < text.length) {
    if (text[i] === '&') {
      const decoded = decodeEntityAt(text, i, opts, errSource, baseOffset + i)

      if (decoded !== null) {
        out += decoded.value
        i = decoded.end
        continue
      }
    }

    out += text[i]
    i += 1
  }

  return out
}

const ATTR_RE = /\s*([a-zA-Z][a-zA-Z0-9-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g

// attribute values always decode leniently — telegram strips unknown attributes before
// validating them, so an undecodable entity in an ignored attribute must not abort the parse
function parseAttrs (attrSrc: string) {
  const attrs: Record<string, string> = {}

  ATTR_RE.lastIndex = 0

  let match: RegExpExecArray | null

  while ((match = ATTR_RE.exec(attrSrc)) !== null) {
    const name = (match[1] ?? '').toLowerCase()
    const raw = match[2] ?? match[3] ?? match[4]

    attrs[name] = raw === undefined ? '' : decodeEntities(raw, { lenient: true }, raw, 0)
  }

  return attrs
}

function numAttr (value: string | undefined) {
  if (value === undefined || value.trim() === '') {
    return null
  }

  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : null
}

function intAttr (value: string | undefined) {
  const parsed = numAttr(value)

  return parsed !== null && Number.isInteger(parsed) ? parsed : null
}

function listItemType (raw: string | undefined) {
  return raw === 'a' || raw === 'A' || raw === 'i' || raw === 'I' || raw === '1' ? raw : null
}

// bounds the token cache when one opts object is reused across many parses
const MAX_TAG_INDEX_SOURCES = 64

// lexes every tag the top-to-bottom walk would see and pairs each opening with its
// matching close (per-name stack), so unclosed-tag recovery stops re-scanning the tail;
// pairing from any opening equals a depth walk from its end, so one pass answers all
function buildTagTokens (source: string) {
  const tokens: TagToken[] = []
  let i = 0

  while (i < source.length) {
    const lt = source.indexOf('<', i)

    if (lt === -1) {
      break
    }

    const scan = scanTag(source, lt)

    if (scan.kind !== 'tag') {
      i = lt + 1
      continue
    }

    tokens.push({
      pos: lt,
      end: scan.end,
      name: scan.name,
      close: scan.close,
      opens: !scan.close && !scan.selfClosing && !(scan.name in VOID_TAGS),
      match: -1
    })
    i = scan.end
  }

  const stacks = new Map<string, number[]>()

  for (let t = 0; t < tokens.length; t++) {
    const token = tokens[t] as TagToken

    if (token.close) {
      const open = stacks.get(token.name)?.pop()

      if (open !== undefined) {
        (tokens[open] as TagToken).match = t
      }

      continue
    }

    if (token.opens) {
      let stack = stacks.get(token.name)

      if (stack === undefined) {
        stack = []
        stacks.set(token.name, stack)
      }

      stack.push(t)
    }
  }

  return tokens
}

// token caches live off-object so a frozen `{ lenient }` opts literal stays valid; keying
// by opts identity scopes each cache to one parse session (markdown reuses one opts object)
const TAG_TOKEN_CACHES = new WeakMap<ParseOpts, Map<string, TagToken[]>>()

function tagTokensFor (source: string, opts: ParseOpts) {
  let cache = TAG_TOKEN_CACHES.get(opts)

  if (cache === undefined) {
    cache = new Map()
    TAG_TOKEN_CACHES.set(opts, cache)
  }

  let tokens = cache.get(source)

  if (tokens === undefined) {
    if (cache.size >= MAX_TAG_INDEX_SOURCES) {
      cache.clear()
    }

    tokens = buildTagTokens(source)
    cache.set(source, tokens)
  }

  return tokens
}

// first token starting at or after `from`
function tokenIndexAt (tokens: TagToken[], from: number) {
  let lo = 0
  let hi = tokens.length

  while (lo < hi) {
    const mid = (lo + hi) >>> 1

    if ((tokens[mid] as TagToken).pos < from) {
      lo = mid + 1
    } else {
      hi = mid
    }
  }

  return lo
}

// the pre-index scan; still needed when `from` sits inside an indexed token — a '<' inside
// a quoted attribute starts a walk whose tokenization the from-0 lex cannot represent
function scanMatchingClose (source: string, name: string, from: number) {
  let depth = 1
  let i = from

  while (i < source.length) {
    const lt = source.indexOf('<', i)

    if (lt === -1) {
      return null
    }

    const scan = scanTag(source, lt)

    if (scan.kind !== 'tag') {
      i = lt + 1
      continue
    }

    if (scan.close && scan.name === name) {
      depth -= 1

      if (depth === 0) {
        return { innerEnd: lt, end: scan.end }
      }
    } else if (!scan.close && scan.name === name && !scan.selfClosing && !(name in VOID_TAGS)) {
      depth += 1
    }

    i = scan.end
  }

  return null
}

function findMatchingClose (source: string, name: string, from: number, opts: ParseOpts) {
  const tokens = tagTokensFor(source, opts)
  const at = tokenIndexAt(tokens, from)
  const prev = at > 0 ? tokens[at - 1] as TagToken : undefined

  // callers pass the end of an opening tag they just scanned; when it is an indexed token
  // the precomputed pairing answers in o(1)
  if (prev !== undefined && prev.end === from && prev.name === name && prev.opens) {
    if (prev.match === -1) {
      return null
    }

    const close = tokens[prev.match] as TagToken

    return { innerEnd: close.pos, end: close.end }
  }

  if (prev !== undefined && prev.end > from) {
    return scanMatchingClose(source, name, from)
  }

  let depth = 1

  for (let t = at; t < tokens.length; t++) {
    const token = tokens[t] as TagToken

    if (token.name !== name) {
      continue
    }

    if (token.close) {
      depth -= 1

      if (depth === 0) {
        return { innerEnd: token.pos, end: token.end }
      }

      continue
    }

    if (token.opens) {
      depth += 1
    }
  }

  return null
}

// resolves the content span of a container element; self-closing form yields an empty span
function containerSpan (
  scan: OpenTagScan,
  source: string,
  pos: number,
  opts: ParseOpts
) {
  if (scan.selfClosing) {
    return { start: scan.end, innerEnd: scan.end, end: scan.end }
  }

  const close = findMatchingClose(source, scan.name, scan.end, opts)

  if (close === null) {
    return abort(opts, `unclosed tag <${scan.name}>`, pos, source)
  }

  return { start: scan.end, innerEnd: close.innerEnd, end: close.end }
}

function consumeOptionalClose (source: string, end: number, name: string) {
  if (source[end] === '<' && source[end + 1] === '/') {
    const scan = scanTag(source, end)

    if (scan.kind === 'tag' && scan.close && scan.name === name) {
      return scan.end
    }
  }

  return end
}

// finds the element that closes the range (only trailing whitespace after it), if any
function lastTopLevelElement (
  source: string,
  from: number,
  to: number,
  opts: ParseOpts
) {
  const tokens = tagTokensFor(source, opts)
  let last: { name: string, pos: number, contentStart: number, contentEnd: number } | null = null
  let i = from

  while (i < to) {
    const ch = source[i] as string

    if (isWs(ch)) {
      i += 1
      continue
    }

    if (ch === '<') {
      const at = tokenIndexAt(tokens, i)
      const token = at < tokens.length ? tokens[at] as TagToken : undefined

      if (token !== undefined && token.pos === i && !token.close) {
        let contentStart = token.end
        let contentEnd = token.end
        let end = token.end

        if (token.opens) {
          const close = token.match === -1 ? undefined : tokens[token.match] as TagToken

          if (close === undefined || close.end > to) {
            last = null
            i += 1
            continue
          }

          contentStart = token.end
          contentEnd = close.pos
          end = close.end
        }

        last = { name: token.name, pos: i, contentStart, contentEnd }
        i = end
        continue
      }

      const prev = at > 0 ? tokens[at - 1] as TagToken : undefined

      // inside an indexed token the from-0 lex diverges from a scan starting here, so a
      // quoted-attribute '<' keeps the direct-scan behavior of the old walk
      if (prev !== undefined && prev.end > i) {
        const scan = scanTag(source, i)

        if (scan.kind === 'tag' && !scan.close) {
          let contentStart = scan.end
          let contentEnd = scan.end
          let end = scan.end

          if (!scan.selfClosing && !(scan.name in VOID_TAGS)) {
            const close = findMatchingClose(source, scan.name, scan.end, opts)

            if (close === null || close.end > to) {
              last = null
              i += 1
              continue
            }

            contentStart = scan.end
            contentEnd = close.innerEnd
            end = close.end
          }

          last = { name: scan.name, pos: i, contentStart, contentEnd }
          i = end
          continue
        }
      }
    }

    last = null
    i += 1
  }

  return last
}

const LEADING_WS_RE = /^[ \t\n\r\f]+/

// an end-anchored /ws+$/ regex backtracks quadratically on long interior whitespace runs
// (entity-decoded spaces bypass the sink's collapsing), so the trailing edge trims by index
function trimTrailingWs (value: string) {
  let end = value.length

  while (end > 0 && isWs(value[end - 1] as string)) {
    end -= 1
  }

  return end === value.length ? value : value.slice(0, end)
}

// trims plain-whitespace edges of block-level text; nbsp and interpolation sentinels survive
function trimText (text: TelegramRichText) {
  if (typeof text === 'string') {
    return trimTrailingWs(text.replace(LEADING_WS_RE, ''))
  }

  if (!Array.isArray(text)) {
    return text
  }

  const parts = [...text]

  while (parts.length > 0) {
    const first = parts[0]

    if (typeof first !== 'string') {
      break
    }

    const stripped = first.replace(LEADING_WS_RE, '')

    if (stripped !== '') {
      parts[0] = stripped
      break
    }

    parts.shift()
  }

  while (parts.length > 0) {
    const lastPart = parts[parts.length - 1]

    if (typeof lastPart !== 'string') {
      break
    }

    const stripped = trimTrailingWs(lastPart)

    if (stripped !== '') {
      parts[parts.length - 1] = stripped
      break
    }

    parts.pop()
  }

  if (parts.length === 0) {
    return ''
  }

  return parts.length === 1 ? (parts[0] as TelegramRichText) : parts
}

/** accumulates inline pieces, collapsing whitespace runs like html rendering does */
class InlineSink {
  private readonly pieces: TelegramRichText[] = []
  private buf = ''
  private started = false
  private lastSpace = false

  space () {
    if (!this.started || this.lastSpace) {
      return
    }

    this.buf += ' '
    this.lastSpace = true
  }

  raw (chunk: string) {
    this.buf += chunk
    this.started = true
    this.lastSpace = false
  }

  newline () {
    if (this.buf.endsWith(' ')) {
      this.buf = this.buf.slice(0, -1)
    }

    this.buf += '\n'
    this.started = true
    this.lastSpace = true
  }

  node (piece: TelegramRichText) {
    this.flushBuf()
    this.pieces.push(piece)
    this.started = true
    this.lastSpace = false
  }

  finish () {
    this.flushBuf()

    if (this.pieces.length === 0) {
      return ''
    }

    return this.pieces.length === 1 ? (this.pieces[0] as TelegramRichText) : this.pieces
  }

  private flushBuf () {
    if (this.buf !== '') {
      this.pieces.push(this.buf)
      this.buf = ''
    }
  }
}

interface BlockSink {
  flush: () => void
  push: (block: TelegramInputRichBlock) => void
}

// handles one '<' during a walk; returns the index to continue scanning from
function consumeTag (
  source: string,
  pos: number,
  opts: ParseOpts,
  host: HostParsers,
  sink: InlineSink,
  blockSink: BlockSink | null
) {
  const fragment = parseHtmlFragment(source, pos, opts, host)

  if (fragment !== null) {
    if (fragment.level === 'inline') {
      const value = fragment.value as TelegramRichText

      if (value === '\n') {
        sink.newline()
      } else if (value !== '') {
        sink.node(value)
      }

      return fragment.end
    }

    if (blockSink === null) {
      if (opts.lenient !== true) {
        const scan = scanTag(source, pos)

        throw new RichParseError(`block tag <${scan.kind === 'tag' ? scan.name : '?'}> in inline context`, pos, source)
      }

      sink.raw('<')

      return pos + 1
    }

    blockSink.flush()

    const value = fragment.value as TelegramInputRichBlock | TelegramInputRichBlock[]

    if (Array.isArray(value)) {
      for (const block of value) {
        blockSink.push(block)
      }
    } else {
      blockSink.push(value)
    }

    return fragment.end
  }

  if (opts.lenient !== true) {
    const scan = scanTag(source, pos)

    if (scan.kind === 'tag') {
      throw new RichParseError(
        scan.close ? `stray closing tag </${scan.name}>` : `unknown tag <${scan.name}>`,
        pos,
        source
      )
    }

    if (scan.kind === 'unterminated') {
      throw new RichParseError(`unclosed tag <${scan.name}>`, pos, source)
    }
  }

  sink.raw('<')

  return pos + 1
}

function parseInlineSource (source: string, opts: ParseOpts, host: HostParsers) {
  const sink = new InlineSink()
  let i = 0

  while (i < source.length) {
    const ch = source[i] as string

    if (ch === '<') {
      i = consumeTag(source, i, opts, host, sink, null)
      continue
    }

    if (ch === '&') {
      const decoded = decodeEntityAt(source, i, opts, source, i)

      if (decoded !== null) {
        sink.raw(decoded.value)
        i = decoded.end
        continue
      }

      sink.raw('&')
      i += 1
      continue
    }

    if (isWs(ch)) {
      sink.space()
      i += 1
      continue
    }

    sink.raw(ch)
    i += 1
  }

  return sink.finish()
}

function parseBlocksSource (source: string, opts: ParseOpts, host: HostParsers) {
  const blocks: TelegramInputRichBlock[] = []
  let sink = new InlineSink()

  const blockSink: BlockSink = {
    flush: () => {
      const text = trimText(sink.finish())

      if (text !== '') {
        blocks.push({ type: 'paragraph', text })
      }

      sink = new InlineSink()
    },
    push: block => blocks.push(block)
  }

  let i = 0

  while (i < source.length) {
    const ch = source[i] as string

    if (ch === '<') {
      i = consumeTag(source, i, opts, host, sink, blockSink)
      continue
    }

    if (ch === '&') {
      const decoded = decodeEntityAt(source, i, opts, source, i)

      if (decoded !== null) {
        sink.raw(decoded.value)
        i = decoded.end
        continue
      }

      sink.raw('&')
      i += 1
      continue
    }

    if (isWs(ch)) {
      sink.space()
      i += 1
      continue
    }

    sink.raw(ch)
    i += 1
  }

  blockSink.flush()

  return blocks
}

function makeHtmlHost (opts: ParseOpts) {
  let depth = 0

  const host: HostParsers = {
    inline: (source) => {
      if (depth >= MAX_NESTING_DEPTH) {
        if (opts.lenient !== true) {
          throw new RichParseError('nesting exceeds the supported depth', 0, source)
        }

        return source
      }

      depth += 1

      try {
        return parseInlineSource(source, opts, host)
      } finally {
        depth -= 1
      }
    },
    blocks: (source) => {
      if (depth >= MAX_NESTING_DEPTH) {
        if (opts.lenient !== true) {
          throw new RichParseError('nesting exceeds the supported depth', 0, source)
        }

        const text = trimText(source)

        return text === '' ? [] : [{ type: 'paragraph', text }]
      }

      depth += 1

      try {
        return parseBlocksSource(source, opts, host)
      } finally {
        depth -= 1
      }
    }
  }

  return host
}

function splitCredit (
  source: string,
  from: number,
  to: number,
  host: HostParsers,
  opts: ParseOpts
) {
  const last = lastTopLevelElement(source, from, to, opts)

  if (last === null || last.name !== 'cite') {
    return { restEnd: to, credit: undefined }
  }

  const credit = trimText(host.inline(source.slice(last.contentStart, last.contentEnd)))

  return { restEnd: last.pos, credit: credit === '' ? undefined : credit }
}

function buildCaption (source: string, from: number, to: number, host: HostParsers, opts: ParseOpts) {
  const { restEnd, credit } = splitCredit(source, from, to, host, opts)
  const text = trimText(host.inline(source.slice(from, restEnd)))

  return { text, ...(credit === undefined ? {} : { credit }) }
}

interface ChildElement {
  name: string
  attrSrc: string
  pos: number
  contentStart: number
  contentEnd: number
}

function childElements (
  source: string,
  from: number,
  to: number,
  allowed: Readonly<Record<string, true>>,
  context: string,
  opts: ParseOpts
) {
  const children: ChildElement[] = []
  let i = from

  while (i < to) {
    const ch = source[i] as string

    if (isWs(ch)) {
      i += 1
      continue
    }

    if (ch === '<') {
      const scan = scanTag(source, i)

      if (scan.kind === 'tag' && !scan.close && scan.name in allowed) {
        const span = containerSpan(scan, source, i, opts)

        if (span === null) {
          return null
        }

        if (span.end > to) {
          return abort(opts, `unclosed tag <${scan.name}>`, i, source)
        }

        children.push({
          name: scan.name,
          attrSrc: scan.attrSrc,
          pos: i,
          contentStart: span.start,
          contentEnd: span.innerEnd
        })
        i = span.end
        continue
      }
    }

    if (opts.lenient !== true) {
      throw new RichParseError(`unexpected content in <${context}>`, i, source)
    }

    i += 1
  }

  return children
}

const LIST_CHILD_TAGS = lookupTable<true>({ li: true })
const TABLE_CHILD_TAGS = lookupTable<true>({ caption: true, tr: true })
const ROW_CHILD_TAGS = lookupTable<true>({ th: true, td: true })
const BUTTON_ROW_CHILD_TAGS = lookupTable<true>({ 'tg-button': true })
const LANGUAGE_CLASS_RE = /(?:^|\s)language-(\S+)/

const mediaBlockOf: (kind: 'photo' | 'video' | 'audio' | 'document', src: string, spoiler: boolean) => TelegramInputRichBlock = (kind, src, spoiler) => {
  if (kind === 'photo') {
    return { type: 'photo', photo: { type: 'photo', media: src, ...(spoiler ? { has_spoiler: true } : {}) } }
  }

  if (kind === 'video') {
    return { type: 'video', video: { type: 'video', media: src, ...(spoiler ? { has_spoiler: true } : {}) } }
  }

  if (kind === 'document') {
    return { type: 'document', document: { type: 'document', media: src } }
  }

  return { type: 'audio', audio: { type: 'audio', media: src } }
}

function withCaption (block: TelegramInputRichBlock, caption: TelegramRichBlockCaption) {
  switch (block.type) {
    case 'photo':
    case 'video':
    case 'audio':
    case 'animation':
    case 'voice_note':
    case 'document':
    case 'map':
    case 'collage':
    case 'slideshow':
      return { ...block, caption }

    default:
      return null
  }
}

function buildCell (child: ChildElement, source: string, opts: ParseOpts, host: HostParsers) {
  const attrs = parseAttrs(child.attrSrc)
  const text = trimText(host.inline(source.slice(child.contentStart, child.contentEnd)))
  const colspan = intAttr(attrs.colspan)
  const rowspan = intAttr(attrs.rowspan)
  const align: TelegramRichBlockTableCell['align'] = attrs.align === 'center' || attrs.align === 'right' ? attrs.align : 'left'
  const valign: TelegramRichBlockTableCell['valign'] = attrs.valign === 'top' || attrs.valign === 'bottom' ? attrs.valign : TABLE_CELL_VALIGN

  return {
    ...(text === '' ? {} : { text }),
    ...(child.name === 'th' ? { is_header: true as const } : {}),
    ...(colspan !== null && colspan > 1 ? { colspan } : {}),
    ...(rowspan !== null && rowspan > 1 ? { rowspan } : {}),
    align,
    valign
  }
}

const BUTTON_STYLES = lookupTable<TelegramRichMessageButton['style']>({
  danger: 'danger',
  success: 'success',
  primary: 'primary',
  link: 'link'
})

const buildButton: (
  attrs: Record<string, string>,
  text: TelegramRichText,
  source: string,
  pos: number,
  opts: ParseOpts
) => TelegramRichMessageButton | null = (attrs, text, source, pos, opts) => {
  const style = BUTTON_STYLES[attrs.style ?? '']
  const base = { text, ...(style === undefined ? {} : { style }) }
  const type = attrs.type

  switch (type) {
    case 'url':
    case 'web_app':
    case 'login_url': {
      const url = attrs.url

      if (url === undefined || url === '') {
        return abort(opts, `<tg-button type="${type}"> requires a url attribute`, pos, source)
      }

      if (type === 'url') {
        return { ...base, url }
      }

      if (type === 'web_app') {
        return { ...base, web_app: { url } }
      }

      return {
        ...base,
        login_url: {
          url,
          ...(attrs['forward-text'] === undefined ? {} : { forward_text: attrs['forward-text'] }),
          ...('request-write-access' in attrs ? { request_write_access: true } : {})
        }
      }
    }

    case 'callback_data': {
      if (attrs.data === undefined) {
        return abort(opts, '<tg-button type="callback_data"> requires a data attribute', pos, source)
      }

      return { ...base, callback_data: attrs.data }
    }

    case 'switch_inline_query':
      return { ...base, switch_inline_query: attrs.query ?? '' }

    case 'switch_inline_query_current_chat':
      return { ...base, switch_inline_query_current_chat: attrs.query ?? '' }

    case 'switch_inline_query_chosen_chat':
      return {
        ...base,
        switch_inline_query_chosen_chat: {
          ...(attrs.query === undefined ? {} : { query: attrs.query }),
          ...('allow-user-chats' in attrs ? { allow_user_chats: true } : {}),
          ...('allow-bot-chats' in attrs ? { allow_bot_chats: true } : {}),
          ...('allow-group-chats' in attrs ? { allow_group_chats: true } : {}),
          ...('allow-channel-chats' in attrs ? { allow_channel_chats: true } : {})
        }
      }

    case 'copy_text': {
      if (attrs.text === undefined) {
        return abort(opts, '<tg-button type="copy_text"> requires a text attribute', pos, source)
      }

      return { ...base, copy_text: { text: attrs.text } }
    }

    case 'disabled':
      return { ...base, disabled: {} }

    default:
      return abort(opts, `<tg-button> requires a known type attribute, got ${type === undefined ? 'none' : `"${type}"`}`, pos, source)
  }
}

// an annotated const (not a return annotation) so every payload below is contextually
// checked against the wire types and the fragment level stays a literal union
const buildFragment: (
  scan: OpenTagScan,
  source: string,
  pos: number,
  opts: ParseOpts,
  host: HostParsers
) => HtmlFragmentResult | null = (scan, source, pos, opts, host) => {
  const name = scan.name
  const wrap = INLINE_WRAPS[name]

  if (wrap !== undefined) {
    const span = containerSpan(scan, source, pos, opts)

    if (span === null) {
      return null
    }

    const value = { type: wrap, text: host.inline(source.slice(span.start, span.innerEnd)) } as TelegramRichText

    return { level: 'inline', value, end: span.end }
  }

  const headingSize = HEADING_SIZES[name]

  if (headingSize !== undefined) {
    const span = containerSpan(scan, source, pos, opts)

    if (span === null) {
      return null
    }

    const text = trimText(host.inline(source.slice(span.start, span.innerEnd)))

    return { level: 'block', value: { type: 'heading', text, size: headingSize }, end: span.end }
  }

  switch (name) {
    case 'a': {
      const attrs = parseAttrs(scan.attrSrc)
      const span = containerSpan(scan, source, pos, opts)

      if (span === null) {
        return null
      }

      const inner = source.slice(span.start, span.innerEnd)
      const href = attrs.href

      if (href !== undefined) {
        const value: TelegramRichText = href.startsWith('#')
          ? { type: 'anchor_link', text: host.inline(inner), anchor_name: href.slice(1) }
          : { type: 'url', text: host.inline(inner), url: href }

        return { level: 'inline', value, end: span.end }
      }

      if (attrs.name !== undefined) {
        return { level: 'inline', value: { type: 'anchor', name: attrs.name }, end: span.end }
      }

      return abort(opts, '<a> requires an href or name attribute', pos, source)
    }

    case 'tg-reference': {
      const attrs = parseAttrs(scan.attrSrc)

      if (attrs.name === undefined) {
        return abort(opts, '<tg-reference> requires a name attribute', pos, source)
      }

      const span = containerSpan(scan, source, pos, opts)

      if (span === null) {
        return null
      }

      const value: TelegramRichText = {
        type: 'reference',
        text: host.inline(source.slice(span.start, span.innerEnd)),
        name: attrs.name
      }

      return { level: 'inline', value, end: span.end }
    }

    case 'tg-emoji': {
      const attrs = parseAttrs(scan.attrSrc)
      const id = attrs['emoji-id']

      if (id === undefined || id === '') {
        return abort(opts, '<tg-emoji> requires an emoji-id attribute', pos, source)
      }

      const span = containerSpan(scan, source, pos, opts)

      if (span === null) {
        return null
      }

      const alt = decodeEntities(source.slice(span.start, span.innerEnd), opts, source, span.start)

      return {
        level: 'inline',
        value: { type: 'custom_emoji', custom_emoji_id: id, alternative_text: alt },
        end: span.end
      }
    }

    case 'tg-time': {
      const attrs = parseAttrs(scan.attrSrc)
      const unix = numAttr(attrs.unix)

      if (unix === null) {
        return abort(opts, '<tg-time> requires a numeric unix attribute', pos, source)
      }

      const span = containerSpan(scan, source, pos, opts)

      if (span === null) {
        return null
      }

      const value: TelegramRichText = {
        type: 'date_time',
        text: host.inline(source.slice(span.start, span.innerEnd)),
        unix_time: unix,
        date_time_format: attrs.format ?? ''
      }

      return { level: 'inline', value, end: span.end }
    }

    case 'tg-button': {
      const attrs = parseAttrs(scan.attrSrc)
      const span = containerSpan(scan, source, pos, opts)

      if (span === null) {
        return null
      }

      const label = trimText(host.inline(source.slice(span.start, span.innerEnd)))
      const built = buildButton(attrs, label, source, pos, opts)

      if (built === null) {
        return null
      }

      return { level: 'inline', value: { type: 'button', button: built }, end: span.end }
    }

    case 'tg-math':
    case 'tg-math-block': {
      const span = containerSpan(scan, source, pos, opts)

      if (span === null) {
        return null
      }

      const expression = source.slice(span.start, span.innerEnd).trim()

      return {
        level: name === 'tg-math' ? 'inline' : 'block',
        value: { type: 'mathematical_expression', expression },
        end: span.end
      }
    }

    case 'br':
      return { level: 'inline', value: '\n', end: consumeOptionalClose(source, scan.end, 'br') }

    case 'hr':
      return { level: 'block', value: { type: 'divider' }, end: consumeOptionalClose(source, scan.end, 'hr') }

    case 'p':
    case 'footer':
    case 'tg-thinking': {
      const span = containerSpan(scan, source, pos, opts)

      if (span === null) {
        return null
      }

      const text = trimText(host.inline(source.slice(span.start, span.innerEnd)))
      const value: TelegramInputRichBlock = name === 'p'
        ? { type: 'paragraph', text }
        : name === 'footer' ? { type: 'footer', text } : { type: 'thinking', text }

      return { level: 'block', value, end: span.end }
    }

    case 'pre': {
      const span = containerSpan(scan, source, pos, opts)

      if (span === null) {
        return null
      }

      let contentStart = span.start
      let contentEnd = span.innerEnd
      let language: string | undefined
      let j = span.start

      while (j < span.innerEnd && isWs(source[j] as string)) {
        j += 1
      }

      if (j < span.innerEnd && source[j] === '<') {
        const codeScan = scanTag(source, j)

        if (codeScan.kind === 'tag' && !codeScan.close && codeScan.name === 'code') {
          const codeSpan = containerSpan(codeScan, source, j, opts)

          if (codeSpan !== null && codeSpan.end <= span.innerEnd) {
            let k = codeSpan.end

            while (k < span.innerEnd && isWs(source[k] as string)) {
              k += 1
            }

            if (k >= span.innerEnd) {
              contentStart = codeSpan.start
              contentEnd = codeSpan.innerEnd

              const codeAttrs = parseAttrs(codeScan.attrSrc)

              language = LANGUAGE_CLASS_RE.exec(codeAttrs.class ?? '')?.[1]
            }
          }
        }
      }

      let text = source.slice(contentStart, contentEnd)

      // html discards a single newline right after the opening tag
      if (text.startsWith('\r\n')) {
        text = text.slice(2)
      } else if (text.startsWith('\n')) {
        text = text.slice(1)
      }

      text = decodeEntities(text, opts, source, contentStart)

      return {
        level: 'block',
        value: { type: 'pre', text, ...(language === undefined || language === '' ? {} : { language }) },
        end: span.end
      }
    }

    case 'blockquote': {
      const attrs = parseAttrs(scan.attrSrc)
      const span = containerSpan(scan, source, pos, opts)

      if (span === null) {
        return null
      }

      const { restEnd, credit } = splitCredit(source, span.start, span.innerEnd, host, opts)

      // telegram's object docs spelled this attribute `collapsed` until bot api 10.3.2
      if ('expandable' in attrs || 'collapsed' in attrs) {
        return {
          level: 'block',
          value: {
            type: 'expandable_blockquote',
            text: trimText(host.inline(source.slice(span.start, restEnd))),
            ...(credit === undefined ? {} : { credit })
          },
          end: span.end
        }
      }

      return {
        level: 'block',
        value: {
          type: 'blockquote',
          blocks: host.blocks(source.slice(span.start, restEnd)),
          ...(credit === undefined ? {} : { credit })
        },
        end: span.end
      }
    }

    case 'aside': {
      const span = containerSpan(scan, source, pos, opts)

      if (span === null) {
        return null
      }

      const { restEnd, credit } = splitCredit(source, span.start, span.innerEnd, host, opts)
      const text = trimText(host.inline(source.slice(span.start, restEnd)))

      return {
        level: 'block',
        value: { type: 'pullquote', text, ...(credit === undefined ? {} : { credit }) },
        end: span.end
      }
    }

    case 'ul':
    case 'ol': {
      const span = containerSpan(scan, source, pos, opts)

      if (span === null) {
        return null
      }

      const children = childElements(source, span.start, span.innerEnd, LIST_CHILD_TAGS, name, opts)

      if (children === null) {
        return null
      }

      let items: TelegramInputRichBlockListItem[]

      if (name === 'ul') {
        items = children.map(li => ({ blocks: host.blocks(source.slice(li.contentStart, li.contentEnd)) }))
      } else {
        const attrs = parseAttrs(scan.attrSrc)
        const step = 'reversed' in attrs ? -1 : 1
        const defaultType = listItemType(attrs.type) ?? '1'
        // a reversed list without an explicit start counts down from the item count (html spec)
        let counter = intAttr(attrs.start) ?? (step === -1 ? children.length : 1)

        items = children.map((li) => {
          const liAttrs = parseAttrs(li.attrSrc)
          const value = intAttr(liAttrs.value) ?? counter

          counter = value + step

          return {
            blocks: host.blocks(source.slice(li.contentStart, li.contentEnd)),
            value,
            type: listItemType(liAttrs.type) ?? defaultType
          }
        })
      }

      return { level: 'block', value: { type: 'list', items }, end: span.end }
    }

    case 'img': {
      const attrs = parseAttrs(scan.attrSrc)
      const src = attrs.src

      if (src === undefined || src === '') {
        return abort(opts, '<img> requires a src attribute', pos, source)
      }

      const end = consumeOptionalClose(source, scan.end, 'img')

      if (src.startsWith('tg://emoji')) {
        const id = /[?&]id=([^&#\s]+)/.exec(src)?.[1]

        if (id === undefined) {
          return abort(opts, 'tg://emoji src requires an id parameter', pos, source)
        }

        return {
          level: 'inline',
          value: { type: 'custom_emoji', custom_emoji_id: id, alternative_text: attrs.alt ?? '' },
          end
        }
      }

      if (src.startsWith('tg://') && opts.lenient !== true) {
        throw new RichParseError('tg:// media links only work in raw dialect with media entries', pos, source)
      }

      return { level: 'block', value: mediaBlockOf('photo', src, 'tg-spoiler' in attrs), end }
    }

    case 'video':
    case 'audio':
    case 'tg-document': {
      const attrs = parseAttrs(scan.attrSrc)
      const src = attrs.src

      if (src === undefined || src === '') {
        return abort(opts, `<${name}> requires a src attribute`, pos, source)
      }

      const span = containerSpan(scan, source, pos, opts)

      if (span === null) {
        return null
      }

      if (src.startsWith('tg://') && opts.lenient !== true) {
        throw new RichParseError('tg:// media links only work in raw dialect with media entries', pos, source)
      }

      const kind = name === 'tg-document' ? 'document' : name
      const value = mediaBlockOf(kind, src, name === 'video' && 'tg-spoiler' in attrs)

      return { level: 'block', value, end: span.end }
    }

    case 'figure': {
      const span = containerSpan(scan, source, pos, opts)

      if (span === null) {
        return null
      }

      const capEl = lastTopLevelElement(source, span.start, span.innerEnd, opts)
      let caption: TelegramRichBlockCaption | undefined
      let restEnd = span.innerEnd

      if (capEl !== null && capEl.name === 'figcaption') {
        caption = buildCaption(source, capEl.contentStart, capEl.contentEnd, host, opts)
        restEnd = capEl.pos
      }

      const inner = host.blocks(source.slice(span.start, restEnd))

      if (caption === undefined) {
        return { level: 'block', value: inner.length === 1 ? (inner[0] as TelegramInputRichBlock) : inner, end: span.end }
      }

      if (inner.length === 1) {
        const captioned = withCaption(inner[0] as TelegramInputRichBlock, caption)

        if (captioned !== null) {
          return { level: 'block', value: captioned, end: span.end }
        }
      }

      if (opts.lenient !== true) {
        throw new RichParseError('<figure> must wrap a single media element', pos, source)
      }

      return { level: 'block', value: inner, end: span.end }
    }

    case 'tg-map': {
      const attrs = parseAttrs(scan.attrSrc)
      const lat = numAttr(attrs.lat)
      const long = numAttr(attrs.long)

      if (lat === null || long === null) {
        return abort(opts, '<tg-map> requires numeric lat and long attributes', pos, source)
      }

      return {
        level: 'block',
        value: {
          type: 'map',
          location: { latitude: lat, longitude: long },
          zoom: numAttr(attrs.zoom) ?? DEFAULT_MAP_ZOOM,
          width: numAttr(attrs.width) ?? DEFAULT_MAP_WIDTH,
          height: numAttr(attrs.height) ?? DEFAULT_MAP_HEIGHT
        },
        end: consumeOptionalClose(source, scan.end, 'tg-map')
      }
    }

    case 'tg-collage':
    case 'tg-slideshow': {
      const span = containerSpan(scan, source, pos, opts)

      if (span === null) {
        return null
      }

      const capEl = lastTopLevelElement(source, span.start, span.innerEnd, opts)
      let caption: TelegramRichBlockCaption | undefined
      let restEnd = span.innerEnd

      if (capEl !== null && capEl.name === 'figcaption') {
        caption = buildCaption(source, capEl.contentStart, capEl.contentEnd, host, opts)
        restEnd = capEl.pos
      }

      const blocks = host.blocks(source.slice(span.start, restEnd))
      const value: TelegramInputRichBlock = name === 'tg-collage'
        ? { type: 'collage', blocks, ...(caption === undefined ? {} : { caption }) }
        : { type: 'slideshow', blocks, ...(caption === undefined ? {} : { caption }) }

      return { level: 'block', value, end: span.end }
    }

    case 'table': {
      const attrs = parseAttrs(scan.attrSrc)
      const span = containerSpan(scan, source, pos, opts)

      if (span === null) {
        return null
      }

      const children = childElements(source, span.start, span.innerEnd, TABLE_CHILD_TAGS, 'table', opts)

      if (children === null) {
        return null
      }

      let caption: TelegramRichText | undefined
      const cells: TelegramRichBlockTableCell[][] = []

      for (const child of children) {
        if (child.name === 'caption') {
          caption ??= trimText(host.inline(source.slice(child.contentStart, child.contentEnd)))
          continue
        }

        const rowChildren = childElements(source, child.contentStart, child.contentEnd, ROW_CHILD_TAGS, 'tr', opts)

        if (rowChildren === null) {
          return null
        }

        cells.push(rowChildren.map(cell => buildCell(cell, source, opts, host)))
      }

      return {
        level: 'block',
        value: {
          type: 'table',
          cells,
          ...('bordered' in attrs ? { is_bordered: true as const } : {}),
          ...('striped' in attrs ? { is_striped: true as const } : {}),
          ...('compact' in attrs ? { is_compact: true as const } : {}),
          ...(caption === undefined || caption === '' ? {} : { caption })
        },
        end: span.end
      }
    }

    case 'tg-button-row': {
      const attrs = parseAttrs(scan.attrSrc)
      const span = containerSpan(scan, source, pos, opts)

      if (span === null) {
        return null
      }

      const children = childElements(source, span.start, span.innerEnd, BUTTON_ROW_CHILD_TAGS, 'tg-button-row', opts)

      if (children === null) {
        return null
      }

      const buttons: TelegramRichMessageButton[] = []

      for (const child of children) {
        const label = trimText(host.inline(source.slice(child.contentStart, child.contentEnd)))
        const built = buildButton(parseAttrs(child.attrSrc), label, source, child.pos, opts)

        if (built === null) {
          return null
        }

        buttons.push(built)
      }

      if (buttons.length === 0 || buttons.length > MAX_BUTTON_ROW_BUTTONS) {
        return abort(opts, `a button row takes 1-${MAX_BUTTON_ROW_BUTTONS} buttons, got ${buttons.length}`, pos, source)
      }

      const align = attrs.align === 'left' || attrs.align === 'center' || attrs.align === 'right' ? attrs.align : undefined

      return {
        level: 'block',
        value: { type: 'buttons', buttons, ...(align === undefined ? {} : { align }) },
        end: span.end
      }
    }

    case 'details': {
      const attrs = parseAttrs(scan.attrSrc)
      const span = containerSpan(scan, source, pos, opts)

      if (span === null) {
        return null
      }

      let summary: TelegramRichText = ''
      let bodyStart = span.start
      let j = span.start

      while (j < span.innerEnd && isWs(source[j] as string)) {
        j += 1
      }

      let summaryFound = false

      if (j < span.innerEnd && source[j] === '<') {
        const summaryScan = scanTag(source, j)

        if (summaryScan.kind === 'tag' && !summaryScan.close && summaryScan.name === 'summary') {
          const summarySpan = containerSpan(summaryScan, source, j, opts)

          if (summarySpan === null) {
            return null
          }

          summary = trimText(host.inline(source.slice(summarySpan.start, summarySpan.innerEnd)))
          bodyStart = summarySpan.end
          summaryFound = true
        }
      }

      if (!summaryFound && opts.lenient !== true) {
        throw new RichParseError('<details> requires a leading <summary>', pos, source)
      }

      return {
        level: 'block',
        value: {
          type: 'details',
          summary,
          blocks: host.blocks(source.slice(bodyStart, span.innerEnd)),
          ...('open' in attrs ? { is_open: true as const } : {})
        },
        end: span.end
      }
    }

    default:
      return null
  }
}

/**
 * parses one supported html element starting at `source[pos]` (guaranteed `<` by the caller),
 * delegating inner content to `host`; returns null when it is not a supported-tag opening
 */
export function parseHtmlFragment (
  source: string,
  pos: number,
  opts: { lenient?: boolean },
  host: HostParsers
) {
  const scan = scanTag(source, pos)

  if (scan.kind === 'unterminated') {
    if (scan.name in SUPPORTED_TAGS) {
      return abort(opts, `unclosed tag <${scan.name}>`, pos, source)
    }

    return null
  }

  if (scan.kind !== 'tag' || scan.close) {
    return null
  }

  if (!(scan.name in SUPPORTED_TAGS)) {
    return null
  }

  return buildFragment(scan, source, pos, opts, host)
}

/** parses a whole html-dialect document into native rich blocks */
export function parseHtml (source: string, opts: { lenient?: boolean } = {}) {
  return parseBlocksSource(source, opts, makeHtmlHost(opts))
}
