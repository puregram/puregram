/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion, local-rules/no-redundant-return-type */
import { MarkupParseError } from '../error'
import { type Entity, Formatted } from '../formatted'
import { interpolate, type Piece } from '../interpolate'

// SOH (0x01) is parsed verbatim by both html and markdown lexers (it is neither
// whitespace nor any special syntax char), so we use it to delimit slot indices
const SENTINEL_DELIM = '\u0001'

export const SENTINEL_PREFIX = SENTINEL_DELIM
export const SENTINEL_SUFFIX = SENTINEL_DELIM

const SENTINEL_RE = new RegExp(`${SENTINEL_DELIM}(\\d+)${SENTINEL_DELIM}`, 'g')

export function guardSentinelSource (source: string) {
  const at = source.indexOf(SENTINEL_DELIM)

  if (at !== -1) {
    throw new MarkupParseError('source contains U+0001, reserved for interpolation', at, source)
  }

  return source
}

export function isTemplateStringsArray (value: unknown): value is TemplateStringsArray {
  return Array.isArray(value) && Array.isArray((value as unknown as { raw?: unknown }).raw)
}

export function pieceFromInterp (value: unknown): Piece {
  if (value === null || value === undefined || value === false) {
    return { kind: 'skip' }
  }

  if (typeof value === 'string') {
    return { kind: 'text', value }
  }

  if (typeof value === 'number') {
    return { kind: 'text', value: String(value) }
  }

  return { kind: 'formatted', value: Formatted.from(value as Formatted | { text: string, entities?: readonly Entity[] }) }
}

interface SentinelHit {
  start: number // start offset in parsed text
  length: number // length of the sentinel in parsed text
  slot: Piece // resolved slot
  newStart: number // start offset in output text (computed during build)
  newLength: number // length in output text
}

/**
 * resolves sentinels embedded in parsed `Formatted` back into their interpolated
 * values. each entity's offset/length is shifted to account for the size delta
 * between sentinel placeholder and emitted text
 */
export function expandSentinels (parsed: Formatted, slots: readonly Piece[]) {
  const text = parsed.text

  // collect all sentinel hits, in order
  const hits: SentinelHit[] = []

  SENTINEL_RE.lastIndex = 0
  let m: RegExpExecArray | null

  while ((m = SENTINEL_RE.exec(text)) !== null) {
    const slotIdx = parseInt(m[1] ?? '0', 10)
    const slot = slots[slotIdx]

    if (slot === undefined) {
      continue
    }

    const sub = interpolate([slot])

    hits.push({
      start: m.index,
      length: m[0].length,
      slot,
      newStart: 0,
      newLength: sub.text.length
    })
  }

  // build the output text by splicing each slot's text in place of its sentinel
  let outText = ''
  let cursor = 0

  for (const hit of hits) {
    outText += text.slice(cursor, hit.start)
    hit.newStart = outText.length
    const sub = interpolate([hit.slot])

    outText += sub.text
    cursor = hit.start + hit.length
  }

  outText += text.slice(cursor)

  // shift entities from the parsed text
  const outEntities: Entity[] = []

  for (const e of parsed.entities) {
    let newOffset = e.offset
    let newLength = e.length

    for (const hit of hits) {
      const hitEnd = hit.start + hit.length
      const eEnd = e.offset + e.length
      const delta = hit.newLength - hit.length

      if (hitEnd <= e.offset) {
        // sentinel fully before entity → shift entity start
        newOffset += delta
      } else if (hit.start >= eEnd) {
        // sentinel fully after entity → no effect
      } else {
        // sentinel within (or overlapping) entity range → adjust length
        newLength += delta
      }
    }

    const resolveString = (value: string) => {
      if (!value.includes(SENTINEL_PREFIX)) {
        return value
      }

      return value.replace(SENTINEL_RE, (_match, idx: string) => {
        const slot = slots[parseInt(idx, 10)]

        if (slot === undefined) {
          return ''
        }

        return interpolate([slot]).text
      })
    }

    const next: Entity = { ...e, offset: newOffset, length: newLength }

    // resolve sentinels in interpolated entity payloads
    // (e.g. `[Alice](tg://user?id=${id})`, `<tg-emoji emoji-id="${id}">`, `<pre language="${lang}">`)
    if (next.url !== undefined) {
      next.url = resolveString(next.url)
    }

    if (next.custom_emoji_id !== undefined) {
      next.custom_emoji_id = resolveString(next.custom_emoji_id)
    }

    if (next.language !== undefined) {
      next.language = resolveString(next.language)
    }

    if (next.date_time_format !== undefined) {
      next.date_time_format = resolveString(next.date_time_format)
    }

    // unix_time may be a deferred string (sentinel-laden); resolve and parseInt back to number
    if (typeof (next.unix_time as unknown) === 'string') {
      const resolved = resolveString(next.unix_time as unknown as string)
      const num = parseInt(resolved, 10)

      if (Number.isNaN(num)) {
        throw new TypeError(`<tg-time>/<time> unix="${resolved}" is not a valid integer after interpolation`)
      }

      next.unix_time = num
    }

    const newUrl = next.url

    // reclassify text_link → text_mention when url is now a valid tg://user?id=N
    if (next.type === 'text_link' && newUrl !== undefined && newUrl.startsWith('tg://user?id=')) {
      const id = parseInt(newUrl.slice('tg://user?id='.length), 10)

      if (!Number.isNaN(id)) {
        next.type = 'text_mention'
        next.user = { id, first_name: outText.slice(next.offset, next.offset + next.length), is_bot: false }
        delete next.url
      }
    }

    // reclassify text_link → custom_emoji when url is now a valid tg://emoji?id=…
    if (next.type === 'text_link' && newUrl !== undefined && newUrl.startsWith('tg://emoji?')) {
      const id = readQueryParam(newUrl.slice('tg://emoji?'.length), 'id')

      if (id !== undefined && id !== '') {
        next.type = 'custom_emoji'
        next.custom_emoji_id = id
        delete next.url
      }
    }

    // reclassify text_link → date_time when url is now a valid tg://time?unix=N(&format=F)
    if (next.type === 'text_link' && newUrl !== undefined && newUrl.startsWith('tg://time?')) {
      const query = newUrl.slice('tg://time?'.length)
      const unixRaw = readQueryParam(query, 'unix')
      const unix = unixRaw !== undefined ? parseInt(unixRaw, 10) : NaN

      if (!Number.isNaN(unix)) {
        next.type = 'date_time'
        next.unix_time = unix

        const format = readQueryParam(query, 'format')

        if (format !== undefined && format !== '') {
          next.date_time_format = format
        }

        delete next.url
      }
    }

    outEntities.push(next)
  }

  // splice in entities from each slot's Formatted, anchored at its newStart
  for (const hit of hits) {
    if (hit.slot.kind !== 'formatted') {
      continue
    }

    for (const e of hit.slot.value.entities) {
      outEntities.push({ ...e, offset: e.offset + hit.newStart })
    }
  }

  outEntities.sort((a, b) => a.offset - b.offset)

  return new Formatted(outText, outEntities)
}

function readQueryParam (query: string, key: string) {
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

/**
 * resolves any sentinel references inside a string against the given slots.
 * used by consumers (e.g. custom-tag attribute values) that hold raw strings
 * lifted from a sentinel-laden source and need them flattened to user values
 * before the string flows into another `html`/`htmlb` call
 */
export function resolveSentinelString (value: string, slots: readonly Piece[]): string {
  if (!value.includes(SENTINEL_PREFIX)) {
    return value
  }

  return value.replace(SENTINEL_RE, (_match, idx: string) => {
    const slot = slots[parseInt(idx, 10)]

    if (slot === undefined) {
      return ''
    }

    return interpolate([slot]).text
  })
}

/** builds a sentinel-laden source string from a tagged-template invocation */
export function composeWithSentinels (
  strings: TemplateStringsArray,
  rest: readonly unknown[],
  transformLiteral: (s: string) => string = s => s
) {
  const slots = rest.map(pieceFromInterp)
  let source = transformLiteral(guardSentinelSource(strings[0] ?? ''))

  for (let i = 1; i < strings.length; i++) {
    source += `${SENTINEL_PREFIX}${i - 1}${SENTINEL_SUFFIX}`
    source += transformLiteral(guardSentinelSource(strings[i] ?? ''))
  }

  return { source, slots }
}
