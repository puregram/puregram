import { MarkupParseError } from '../error'
import { Formatted } from '../formatted'
import type { Piece } from '../interpolate'

import { parseAttrs, parseHtml } from './html'
import { canonicalTag, BUILT_IN_TAG_NAMES } from './html-tags'
import { SENTINEL_PREFIX, SENTINEL_SUFFIX, expandSentinels, guardSentinelSource, resolveSentinelString } from './sentinel'

/** maximum number of nested handler invocations before we throw to break a cycle */
export const MAX_DEPTH = 32

/** valid custom-tag names: lowercase, must start with a letter, may contain digits and dashes */
export const TAG_NAME_RE = /^[a-z][a-z0-9-]*$/

export interface TagInfo {
  tag: string
  attrs: Readonly<Record<string, string>>
  parent: string | null
  ancestors: readonly string[]
  index: number
  siblingCount: number
}

export type TagHandler = (content: Formatted, info: TagInfo) => Formatted

export type TagDefinitions = Readonly<Record<string, TagHandler>>

/**
 * applies `tags` onto `registry` in place. throws on:
 * - name collision with a built-in (`MarkupParseError`)
 * - invalid name shape (`MarkupParseError`)
 * - non-function handler (`TypeError`)
 *
 * second registration of the same custom name silently overwrites — useful for tests
 */
export function validateAndMerge (registry: Map<string, TagHandler>, tags: TagDefinitions) {
  for (const [name, handler] of Object.entries(tags)) {
    if (typeof handler !== 'function') {
      throw new TypeError(`custom-tag handler for <${name}> must be a function`)
    }

    if (BUILT_IN_TAG_NAMES.has(name)) {
      throw new MarkupParseError(`cannot redefine built-in tag <${name}>`, 0, `<${name}>`)
    }

    if (!TAG_NAME_RE.test(name)) {
      throw new MarkupParseError(`invalid custom-tag name '${name}'`, 0, `<${name}>`)
    }

    registry.set(name, handler)
  }
}

export interface CustomTagSpan {
  tag: string
  attrs: Readonly<Record<string, string>>
  openStart: number
  contentStart: number
  closeStart: number
  closeEnd: number
  selfClosing: boolean
}

// module-level counter; single-threaded by design (node event loop is single-threaded for sync code)
let handlerDepth = 0

/**
 * runs `handler` with depth tracking + error wrapping — throws before invoking
 * when `handlerDepth >= MAX_DEPTH`, catching direct and indirect cycles
 * (`<h1>` → `<h1>` or `<a>` → `<b>` → `<a>`)
 */
export function invokeHandler (handler: TagHandler, content: Formatted, info: TagInfo) {
  if (handlerDepth >= MAX_DEPTH) {
    throw new MarkupParseError(
      `custom-tag expansion depth exceeded (${MAX_DEPTH}); possible cycle in <${info.tag}>`,
      0,
      ''
    )
  }

  handlerDepth += 1

  try {
    return handler(content, info)
  } catch (err) {
    if (err instanceof MarkupParseError) {
      throw err
    }

    const message = err instanceof Error ? err.message : String(err)

    throw new MarkupParseError(
      `custom-tag <${info.tag}> handler threw: ${message}`,
      0,
      '',
      { cause: err }
    )
  } finally {
    handlerDepth -= 1
  }
}

/**
 * scans `source` for top-level custom-tag spans (registry-named). nested spans
 * are discovered when their parent's inner content is recursively scanned;
 * built-in tags and sentinels are skipped
 */
export function scanCustomTags (
  source: string,
  registry: ReadonlyMap<string, TagHandler>
) {
  const spans: CustomTagSpan[] = []
  let i = 0

  while (i < source.length) {
    const ch = source[i]

    if (ch !== '<') {
      i += 1
      continue
    }

    // close tags at this scan level cannot belong to a top-level span we own,
    // so we skip past them and let parseHtml emit any stray-close error later
    if (source[i + 1] === '/') {
      const end = source.indexOf('>', i)

      if (end === -1) {
        i += 1
        continue
      }

      i = end + 1
      continue
    }

    const end = source.indexOf('>', i)

    if (end === -1) {
      // unclosed angle — let parseHtml emit its own error later
      i += 1
      continue
    }

    const inner = source.slice(i + 1, end).trim()
    const selfClosing = inner.endsWith('/')
    const innerNoSlash = selfClosing ? inner.slice(0, -1).trim() : inner
    const spaceIdx = innerNoSlash.search(/\s/)
    const rawName = (spaceIdx === -1 ? innerNoSlash : innerNoSlash.slice(0, spaceIdx)).toLowerCase()
    const canonical = canonicalTag(rawName)

    if (!registry.has(canonical)) {
      // not custom — skip past this open tag and keep scanning
      i = end + 1
      continue
    }

    const attrs = spaceIdx === -1 ? {} : parseAttrs(innerNoSlash.slice(spaceIdx))
    const openStart = i

    if (selfClosing) {
      spans.push({
        tag: canonical,
        attrs,
        openStart,
        contentStart: end + 1,
        closeStart: end + 1,
        closeEnd: end + 1,
        selfClosing: true
      })
      i = end + 1
      continue
    }

    // walk forward to find matching close, accounting for nested same-name opens
    const contentStart = end + 1
    let depth = 1
    let j = contentStart
    let matched = false

    while (j < source.length && depth > 0) {
      if (source[j] !== '<') {
        j += 1
        continue
      }

      const tagEnd = source.indexOf('>', j)

      if (tagEnd === -1) {
        break
      }

      const tagInner = source.slice(j + 1, tagEnd).trim()
      const isClose = tagInner.startsWith('/')
      const body = isClose ? tagInner.slice(1).trim() : tagInner
      const sp = body.search(/[\s/]/)
      const innerName = (sp === -1 ? body : body.slice(0, sp)).toLowerCase()
      const innerCanonical = canonicalTag(innerName)

      if (innerCanonical === canonical) {
        if (isClose) {
          depth -= 1

          if (depth === 0) {
            spans.push({
              tag: canonical,
              attrs,
              openStart,
              contentStart,
              closeStart: j,
              closeEnd: tagEnd + 1,
              selfClosing: false
            })
            i = tagEnd + 1
            matched = true
            break
          }
        } else if (!body.endsWith('/')) {
          // nested open of the same custom tag (skip self-closes — they don't add depth)
          depth += 1
        }
      }

      j = tagEnd + 1
    }

    if (!matched) {
      throw new MarkupParseError(`unclosed custom tag <${canonical}>`, openStart, source)
    }
  }

  return spans
}

/**
 * counts top-level tag siblings (open tags only — closes not counted; self-closes count
 * as one). nested tags inside other top-level tags are not counted. text and sentinels
 * are skipped
 *
 * `endOffset` (default end of source) limits the scan to `[0, endOffset)`. used by
 * `indexOfSpan` to count tag siblings strictly before a given span
 */
export function countTagSiblings (source: string, endOffset: number = source.length) {
  let count = 0
  let i = 0
  let depth = 0

  while (i < endOffset) {
    if (source[i] !== '<') {
      i += 1
      continue
    }

    const end = source.indexOf('>', i)

    if (end === -1 || end >= endOffset) {
      break
    }

    const inner = source.slice(i + 1, end).trim()
    const isClose = inner.startsWith('/')
    const isSelfClose = !isClose && inner.endsWith('/')

    if (isClose) {
      if (depth > 0) {
        depth -= 1
      }
    } else if (depth === 0) {
      count += 1

      if (!isSelfClose) {
        depth += 1
      }
    } else if (!isSelfClose) {
      depth += 1
    }

    i = end + 1
  }

  return count
}

/** index of the tag sibling whose open is at `openStart` (i.e. count of preceding tag-sibling opens) */
export function indexOfSpan (source: string, openStart: number) {
  return countTagSiblings(source, openStart)
}

/**
 * preprocessing pass: replaces every custom-tag span in `source` with a sentinel
 * whose slot contains the handler's expanded `Formatted`. built-in tags and
 * upstream sentinels (already in `slots`) are passed through untouched
 *
 * recurses into each span's inner content with `[...ancestors, span.tag]`, which
 * propagates the parent/ancestors tracking required by `TagInfo`
 *
 * `slots` is mutated in place: handler outputs are appended
 */
export function preprocessCustomTags (
  source: string,
  registry: ReadonlyMap<string, TagHandler>,
  slots: Piece[],
  ancestors: readonly string[]
): string {
  const spans = scanCustomTags(source, registry)

  if (spans.length === 0) {
    return source
  }

  const siblingCount = countTagSiblings(source)
  const parent = ancestors.length === 0 ? null : (ancestors[ancestors.length - 1] ?? null)

  // jsx-style structural whitespace rule: inside a custom-tag parent, pure-whitespace
  // text slices between siblings (or at the parent body's edges) are decorative
  // indentation, not content, and get stripped. at the top level (ancestors=[])
  // source whitespace is preserved verbatim
  const insideCustomParent = ancestors.length > 0
  const emitSlice = (slice: string) => {
    if (insideCustomParent && /^\s*$/.test(slice)) {
      return ''
    }

    return slice
  }

  let out = ''
  let cursor = 0

  for (const span of spans) {
    out += emitSlice(source.slice(cursor, span.openStart))

    const innerSrc = span.selfClosing
      ? ''
      : source.slice(span.contentStart, span.closeStart)

    if (ancestors.length >= MAX_DEPTH) {
      throw new MarkupParseError(
        `custom-tag nesting exceeds the supported depth (${MAX_DEPTH}) in <${span.tag}>`,
        span.openStart,
        source
      )
    }

    const innerRewritten = preprocessCustomTags(innerSrc, registry, slots, [...ancestors, span.tag])
    const innerParsed = parseHtml(innerRewritten)
    const innerResolved = expandSentinels(innerParsed, slots)

    const handler = registry.get(span.tag)

    if (handler === undefined) {
      throw new MarkupParseError(`internal: handler missing for <${span.tag}>`, span.openStart, source)
    }

    // flatten any sentinel chars in attribute values back to their interpolated source
    // values, so the handler sees the raw user input (e.g. attrs.label === 'health',
    // not the sentinel marker for 'health')
    const resolvedAttrs: Record<string, string> = {}

    for (const [key, value] of Object.entries(span.attrs)) {
      resolvedAttrs[key] = resolveSentinelString(value, slots)
    }

    const info: TagInfo = {
      tag: span.tag,
      attrs: resolvedAttrs,
      parent,
      ancestors,
      index: indexOfSpan(source, span.openStart),
      siblingCount
    }

    const result = invokeHandler(handler, innerResolved, info)

    if (result === null || typeof result !== 'object' || !('text' in result) || typeof result.text !== 'string') {
      throw new MarkupParseError(
        `custom-tag <${span.tag}> handler must return a Formatted or { text, entities? }`,
        span.openStart,
        source
      )
    }

    const slotIdx = slots.length

    slots.push({ kind: 'formatted', value: Formatted.from(result) })
    out += `${SENTINEL_PREFIX}${slotIdx}${SENTINEL_SUFFIX}`

    cursor = span.closeEnd
  }

  out += emitSlice(source.slice(cursor))

  return out
}

/**
 * top-level entry. when registry is empty, this is exactly `parseHtml(source)` —
 * zero overhead. otherwise: preprocess, parse, expand all sentinels
 */
export function parseHtmlInternal (source: string, registry: ReadonlyMap<string, TagHandler>) {
  guardSentinelSource(source)

  if (registry.size === 0) {
    return parseHtml(source)
  }

  const slots: Piece[] = []
  const rewritten = preprocessCustomTags(source, registry, slots, [])
  const parsed = parseHtml(rewritten)

  return expandSentinels(parsed, slots)
}
