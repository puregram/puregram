/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { composeTimeFormat, type TimeFormat } from '../builders/time'
import { MarkupParseError } from '../error'
import { type Entity, Formatted } from '../formatted'

import type { TagDefinitions, TagHandler } from './custom-tags'
import { parseHtmlInternal, preprocessCustomTags, validateAndMerge } from './custom-tags'
import { TAG_TO_ENTITY, canonicalTag } from './html-tags'
import { composeWithSentinels, expandSentinels, isTemplateStringsArray, SENTINEL_PREFIX } from './sentinel'

const TIME_NAMED_ATTRS = ['weekday', 'date-style', 'time-style', 'relative'] as const

// sentinel-laden attribute values from tagged-template interpolation defer the
// numeric parse to expandSentinels by storing the raw string
function parseTimeUnix (raw: string | undefined, sourceOffset: number, source: string) {
  if (raw === undefined) {
    throw new MarkupParseError('<tg-time>/<time> requires a unix attribute', sourceOffset, source)
  }

  if (raw.includes(SENTINEL_PREFIX)) {
    return raw
  }

  const unix = parseInt(raw, 10)

  if (Number.isNaN(unix)) {
    throw new MarkupParseError(`<tg-time>/<time> unix="${raw}" is not a valid integer`, sourceOffset, source)
  }

  return unix
}

function namedTimeFormat (attrs: Record<string, string>, tag: string, sourceOffset: number, source: string) {
  const opts: TimeFormat = {}

  if ('relative' in attrs) {
    opts.relative = true
  }

  if ('weekday' in attrs) {
    opts.weekday = true
  }

  const dateStyle = attrs['date-style']

  if (dateStyle !== undefined) {
    if (dateStyle !== 'short' && dateStyle !== 'long') {
      throw new MarkupParseError(`<${tag}> date-style must be "short" or "long"`, sourceOffset, source)
    }

    opts.dateStyle = dateStyle
  }

  const timeStyle = attrs['time-style']

  if (timeStyle !== undefined) {
    if (timeStyle !== 'short' && timeStyle !== 'long') {
      throw new MarkupParseError(`<${tag}> time-style must be "short" or "long"`, sourceOffset, source)
    }

    opts.timeStyle = timeStyle
  }

  try {
    return composeTimeFormat(opts)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)

    throw new MarkupParseError(`<${tag}>: ${message}`, sourceOffset, source)
  }
}

interface OpenTag {
  canonical: string
  attrs: Record<string, string>
  startOffset: number
  sourceOffset: number
}

const ENTITY_REFS: Readonly<Record<string, string>> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' '
}

function fromCodePoint (code: number, raw: string, sourceOffset: number, source: string) {
  const control = code < 0x20 && code !== 0x09 && code !== 0x0a

  if (!Number.isInteger(code) || code < 0 || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff) || control) {
    throw new MarkupParseError(`malformed numeric entity &${raw};`, sourceOffset, source)
  }

  return String.fromCodePoint(code)
}

function decodeEntity (raw: string, sourceOffset: number, source: string) {
  if (raw.startsWith('#x') || raw.startsWith('#X')) {
    return fromCodePoint(parseInt(raw.slice(2), 16), raw, sourceOffset, source)
  }

  if (raw.startsWith('#')) {
    return fromCodePoint(parseInt(raw.slice(1), 10), raw, sourceOffset, source)
  }

  const value = ENTITY_REFS[raw]

  if (value === undefined) {
    throw new MarkupParseError(`unknown HTML entity &${raw};`, sourceOffset, source)
  }

  return value
}

const ATTR_RE = /\s*([a-zA-Z][a-zA-Z0-9-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g

/** internal: parses an html attribute substring. exported for reuse by the custom-tag preprocessor */
export function parseAttrs (attrSrc: string) {
  const attrs: Record<string, string> = {}

  ATTR_RE.lastIndex = 0
  let m: RegExpExecArray | null

  while ((m = ATTR_RE.exec(attrSrc)) !== null) {
    const name = (m[1] ?? '').toLowerCase()
    const value = m[2] ?? m[3] ?? m[4] ?? ''

    attrs[name] = decodeAttrEntities(value)
  }

  return attrs
}

const ATTR_ENTITY_RE = /&(#[xX][0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g

function decodeAttrEntities (value: string) {
  if (!value.includes('&')) {
    return value
  }

  return value.replace(ATTR_ENTITY_RE, (whole, raw: string) => {
    try {
      return decodeEntity(raw, 0, value)
    } catch {
      return whole
    }
  })
}

function findTagEnd (source: string, from: number) {
  let i = from + 1

  while (i < source.length) {
    const ch = source.charAt(i)

    if (ch === '"' || ch === "'") {
      const close = source.indexOf(ch, i + 1)

      if (close === -1) {
        return -1
      }

      i = close + 1
      continue
    }

    if (ch === '>') {
      return i
    }

    i += 1
  }

  return -1
}

function buildEntity (tag: OpenTag, length: number, source: string, label: string) {
  const canonical = tag.canonical
  const type = TAG_TO_ENTITY[canonical]

  if (type === undefined) {
    throw new MarkupParseError(`unknown tag <${canonical}>`, tag.sourceOffset, source)
  }

  const entity: Entity = { type, offset: tag.startOffset, length }

  if (canonical === 'a') {
    const url = tag.attrs.href

    if (url === undefined || url === '') {
      throw new MarkupParseError('<a> requires a non-empty href attribute', tag.sourceOffset, source)
    }

    const mention = /^tg:\/\/user\?id=(\d{1,19})$/.exec(url)

    if (mention !== null) {
      entity.type = 'text_mention'
      entity.user = { id: Number(mention[1]), is_bot: false, first_name: label }
    } else {
      entity.url = url
    }
  }

  if (canonical === 'tg-emoji') {
    const id = tag.attrs['emoji-id'] ?? tag.attrs.id

    if (id === undefined) {
      throw new MarkupParseError('<tg-emoji> requires an emoji-id (or id) attribute', tag.sourceOffset, source)
    }

    entity.custom_emoji_id = id
  }

  if (canonical === 'blockquote' && 'expandable' in tag.attrs) {
    entity.type = 'expandable_blockquote'
  }

  if (canonical === 'pre' && tag.attrs.language !== undefined) {
    entity.language = tag.attrs.language
  }

  if (canonical === 'tg-time') {
    for (const named of TIME_NAMED_ATTRS) {
      if (named in tag.attrs) {
        throw new MarkupParseError(
          `<tg-time> does not accept ${named}; use <time> for the extended form`,
          tag.sourceOffset, source
        )
      }
    }

    entity.unix_time = parseTimeUnix(tag.attrs.unix, tag.sourceOffset, source) as number

    const fmt = tag.attrs.format

    if (fmt !== undefined && fmt !== '') {
      entity.date_time_format = fmt
    }
  }

  if (canonical === 'time') {
    entity.unix_time = parseTimeUnix(tag.attrs.unix, tag.sourceOffset, source) as number

    const fmt = tag.attrs.format
    const hasNamed = TIME_NAMED_ATTRS.some(name => name in tag.attrs)

    if (fmt !== undefined && hasNamed) {
      throw new MarkupParseError(
        '<time> accepts either format="…" or named flags (weekday/date-style/time-style/relative), not both',
        tag.sourceOffset, source
      )
    }

    if (fmt !== undefined) {
      if (fmt !== '') {
        entity.date_time_format = fmt
      }
    } else if (hasNamed) {
      const composed = namedTimeFormat(tag.attrs, 'time', tag.sourceOffset, source)

      if (composed !== '') {
        entity.date_time_format = composed
      }
    }
  }

  return entity
}

function isSpoilerSpan (rawName: string, attrs: Record<string, string>) {
  return rawName === 'span' && (attrs.class ?? '').split(/\s+/).includes('tg-spoiler')
}

/** parses raw HTML source into a Formatted */
export function parseHtml (source: string) {
  let text = ''
  const entities: Entity[] = []
  const stack: OpenTag[] = []
  let i = 0

  const dropLastChar = () => {
    const at = text.length - 1

    text = text.slice(0, -1)

    for (const entity of entities) {
      if (entity.offset + entity.length > at) {
        entity.length -= 1
      }
    }

    for (const open of stack) {
      if (open.startOffset > at) {
        open.startOffset -= 1
      }
    }
  }

  // collapses runs of horizontal whitespace to a single space; preserves newlines
  const appendText = (s: string) => {
    for (const ch of s) {
      if (ch === '\n') {
        if (text.endsWith(' ')) {
          dropLastChar()
        }

        text += '\n'
      } else if (/\s/.test(ch)) {
        if (text !== '' && !text.endsWith(' ') && !text.endsWith('\n')) {
          text += ' '
        }
      } else {
        text += ch
      }
    }
  }

  while (i < source.length) {
    const ch = source[i] as string

    if (ch === '<') {
      if (source[i + 1] === '/') {
        const end = source.indexOf('>', i)

        if (end === -1) {
          throw new MarkupParseError('unclosed </…>', i, source)
        }

        const rawName = source.slice(i + 2, end).trim()
        const canonical = canonicalTag(rawName)
        const open = stack.pop()

        if (open === undefined) {
          throw new MarkupParseError(`stray closing tag </${rawName}>`, i, source)
        }

        // pre>code: transfer language attribute up to the outer <pre> and discard inner <code>
        const top = stack[stack.length - 1]

        if (open.canonical === 'code' && top !== undefined && top.canonical === 'pre') {
          if (open.canonical !== canonical) {
            throw new MarkupParseError(`mismatched closing tag </${rawName}> (expected </${open.canonical}>)`, i, source)
          }

          const cls = open.attrs.class ?? ''

          if (cls.startsWith('language-')) {
            top.attrs.language = cls.slice('language-'.length)
          }

          if (open.startOffset === top.startOffset) {
            i = end + 1
            continue
          }
        }

        const matchAllowed = open.canonical === canonical ||
          (open.canonical === 'tg-spoiler' && (canonical === 'span' || canonical === 'tg-spoiler' || canonical === 'spoiler'))

        if (!matchAllowed) {
          throw new MarkupParseError(`mismatched closing tag </${rawName}> (expected </${open.canonical}>)`, i, source)
        }

        const length = text.length - open.startOffset
        const entity = buildEntity(open, length, source, text.slice(open.startOffset, open.startOffset + length))

        entities.push(entity)

        i = end + 1
        continue
      }

      const end = findTagEnd(source, i)

      if (end === -1) {
        throw new MarkupParseError('unclosed <…>', i, source)
      }

      const inner = source.slice(i + 1, end).trim()
      const spaceIdx = inner.search(/[\s/]/)
      const rawName = (spaceIdx === -1 ? inner : inner.slice(0, spaceIdx)).toLowerCase()
      const attrs = spaceIdx === -1 ? {} : parseAttrs(inner.slice(spaceIdx))
      let canonical = canonicalTag(rawName)

      if (isSpoilerSpan(rawName, attrs)) {
        canonical = 'tg-spoiler'
      }

      stack.push({ canonical, attrs, startOffset: text.length, sourceOffset: i })

      i = end + 1
      continue
    }

    if (ch === '&') {
      const semi = source.indexOf(';', i)

      if (semi === -1 || semi - i > 12) {
        appendText('&')
        i += 1
        continue
      }

      const raw = source.slice(i + 1, semi)

      appendText(decodeEntity(raw, i, source))
      i = semi + 1
      continue
    }

    appendText(ch)
    i += 1
  }

  const unclosed = stack[stack.length - 1]

  if (unclosed !== undefined) {
    throw new MarkupParseError(`unclosed tag <${unclosed.canonical}>`, unclosed.sourceOffset, source)
  }

  const trimmed = text.trimEnd()
  const bounded: Entity[] = []

  for (const entity of entities) {
    const end = Math.min(entity.offset + entity.length, trimmed.length)

    if (end > entity.offset) {
      bounded.push(end - entity.offset === entity.length ? entity : { ...entity, length: end - entity.offset })
    }
  }

  bounded.sort((a, b) => a.offset - b.offset)

  return new Formatted(trimmed, bounded)
}

// 0x02 (STX) survives the html lexer's whitespace collapse and is distinct from the
// sentinel module's 0x01 marker — sub <br> pre-parse, swap back to '\n' post-parse
const BR_PLACEHOLDER = '\u0002'
// anchored on the <br literal with no ambiguous adjacent \s* — the surrounding
// \s* that used to live here was a redos vector, so whitespace around the tag
// gets absorbed by trimming each split boundary instead (linear, backtrack-free)
const BR_TAG_RE = /<br\s*(?:\/\s*)?>/gi

function preprocessHtmlb (source: string) {
  const parts = source.replace(BR_TAG_RE, BR_PLACEHOLDER).split(BR_PLACEHOLDER)

  return parts
    .map((part, index) => {
      let result = part

      if (index > 0) {
        result = result.trimStart()
      }

      if (index < parts.length - 1) {
        result = result.trimEnd()
      }

      return result
    })
    .join(BR_PLACEHOLDER)
}

function postprocessHtmlb (formatted: Formatted) {
  return new Formatted(formatted.text.split(BR_PLACEHOLDER).join('\n'), formatted.entities)
}

function htmlTagged (
  strings: TemplateStringsArray,
  rest: readonly unknown[],
  registry: ReadonlyMap<string, TagHandler>
) {
  const { source, slots } = composeWithSentinels(strings, rest)

  if (registry.size === 0) {
    const parsed = parseHtml(source)

    return expandSentinels(parsed, slots)
  }

  const rewritten = preprocessCustomTags(source, registry, slots, [])
  const parsed = parseHtml(rewritten)

  return expandSentinels(parsed, slots)
}

function htmlbTagged (
  strings: TemplateStringsArray,
  rest: readonly unknown[],
  registry: ReadonlyMap<string, TagHandler>
) {
  const { source, slots } = composeWithSentinels(strings, rest, preprocessHtmlb)

  if (registry.size === 0) {
    const parsed = parseHtml(source)
    const expanded = expandSentinels(parsed, slots)

    return postprocessHtmlb(expanded)
  }

  const rewritten = preprocessCustomTags(source, registry, slots, [])
  const parsed = parseHtml(rewritten)
  const expanded = expandSentinels(parsed, slots)

  return postprocessHtmlb(expanded)
}

const sharedHtmlRegistry = new Map<string, TagHandler>()

export interface HtmlCallable {
  (source: string): Formatted
  (strings: TemplateStringsArray, ...rest: readonly unknown[]): Formatted
  /** mutates this callable's registry; returns self for chaining */
  define: (tags: TagDefinitions) => HtmlCallable
  /** returns a fresh callable cloned from this one's registry, extended with `tags` */
  with: (tags: TagDefinitions) => HtmlCallable
  /** permissive parse — returns a plain-text `Formatted` on parse failure instead of throwing */
  lenient: (source: string) => Formatted
}

function makeHtmlCallable (
  registry: Map<string, TagHandler>,
  flavor: 'html' | 'htmlb'
): HtmlCallable {
  const fn = ((first: string | TemplateStringsArray, ...rest: readonly unknown[]) => {
    if (isTemplateStringsArray(first)) {
      return flavor === 'htmlb'
        ? htmlbTagged(first, rest, registry)
        : htmlTagged(first, rest, registry)
    }

    if (flavor === 'htmlb') {
      return postprocessHtmlb(parseHtmlInternal(preprocessHtmlb(first), registry))
    }

    return parseHtmlInternal(first, registry)
  }) as HtmlCallable

  fn.define = (tags) => {
    validateAndMerge(registry, tags)

    return fn
  }

  fn.with = (tags) => {
    const cloned = new Map(registry)

    validateAndMerge(cloned, tags)

    return makeHtmlCallable(cloned, flavor)
  }

  fn.lenient = (source: string) => {
    try {
      if (flavor === 'htmlb') {
        return postprocessHtmlb(parseHtmlInternal(preprocessHtmlb(source), registry))
      }

      return parseHtmlInternal(source, registry)
    } catch (err) {
      if (err instanceof MarkupParseError || err instanceof RangeError) {
        return new Formatted(source, [])
      }

      throw err
    }
  }

  return fn
}

/** parses telegram html. accepts both function-call form and tagged-template form */
export const html: HtmlCallable = makeHtmlCallable(sharedHtmlRegistry, 'html')

/** parses telegram html with explicit `<br>` for newlines (whitespace otherwise collapses) */
export const htmlb: HtmlCallable = makeHtmlCallable(sharedHtmlRegistry, 'htmlb')

/** test-only: drops every non-built-in tag from the shared html/htmlb registry */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function __resetHtmlRegistryForTests () {
  sharedHtmlRegistry.clear()
}
