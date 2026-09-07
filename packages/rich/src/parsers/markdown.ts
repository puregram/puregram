import type { TelegramInputRichBlock, TelegramInputRichBlockListItem, TelegramRichText } from '@puregram/api'

import { MAX_NESTING_DEPTH, TABLE_CELL_VALIGN } from '../constants'
import { RichParseError } from '../error'
import { inferMediaKind } from '../media'

import { NAMED_ENTITIES } from './entities'
import { type HostParsers, parseHtmlFragment } from './html'

interface ParseOptions {
  lenient?: boolean
}

// markdown specials that a backslash escapes into literal text
const ESCAPABLE = new Set(['\\', '`', '*', '_', '~', '|', '[', ']', '(', ')', '>', '=', '#', '!', '+', '-', '$', '<'])

const ENTITY_RE = /^&(?:#(\d+)|#x([0-9a-fA-F]+)|([a-zA-Z]+));/

const HEADING_RE = /^(#{1,6})\s+(.*)$/
const FENCE_RE = /^```([^`]*)$/
const DIVIDER_RE = /^---+\s*$/
const BULLET_RE = /^[-*+]\s+(.*)$/
const TASK_RE = /^[-*+]\s+\[( |x|X)\]\s+(.*)$/
const ORDERED_RE = /^(\d+)\.\s+(.*)$/
const TABLE_SEPARATOR_RE = /^\|(?:\s*:?-+:?\s*\|)+\s*$/
const FOOTNOTE_DEF_RE = /^\[\^([^\]\s]+)\]:\s+(.*)$/
const MEDIA_LINE_RE = /^!\[([^\]]*)\]\(((?:[^)\\\s]|\\.)+)(?:\s+"((?:[^"\\]|\\.)*)")?\)\s*$/
const BLOCK_MATH_OPEN_RE = /^\$\$\s*(.*)$/

// block-level html tags interrupt a paragraph; inline tags (<u>, <tg-emoji>, …) keep flowing in it
const BLOCK_TAG_RE = /^<(?:details|footer|aside|blockquote|table|figure|img|video|audio|ul|ol|pre|p|h[1-6]|hr|tg-map|tg-collage|tg-slideshow|tg-thinking|tg-math-block|tg-document|tg-button-row)\b/i

// a media line interrupts only when the dispatcher will actually take it (tg:// images are inline)
function isMediaLine (line: string) {
  const media = MEDIA_LINE_RE.exec(line)

  return media !== null && !media[2]!.startsWith('tg://')
}

// one place decides what interrupts a paragraph — keep in sync with the block dispatcher's branches
function startsBlock (next: string, after: string) {
  return next.trim() === '' || HEADING_RE.test(next) || FENCE_RE.test(next) || DIVIDER_RE.test(next) ||
    next.startsWith('>') || TASK_RE.test(next) || BULLET_RE.test(next) || ORDERED_RE.test(next) ||
    BLOCK_MATH_OPEN_RE.test(next) || FOOTNOTE_DEF_RE.test(next) || isMediaLine(next) ||
    BLOCK_TAG_RE.test(next) || (next.startsWith('|') && TABLE_SEPARATOR_RE.test(after))
}

// inverts the backslash escapes the serializer (and authors) apply inside urls and labels
function unescape (s: string) {
  return s.replace(/\\(.)/g, '$1')
}

// a `$` opens inline math only when the delimiters hug non-whitespace on the inside;
// bare dollars in prose ("costs $5") stay literal
function findMathClose (text: string, open: number) {
  if (open + 1 >= text.length || /\s/.test(text[open + 1]!)) {
    return -1
  }

  let i = open + 1

  while (i < text.length) {
    const ch = text[i]!

    if (ch === '\\') {
      i += 2
      continue
    }

    if (ch === '$') {
      return /\s/.test(text[i - 1]!) ? -1 : i
    }

    i += 1
  }

  return -1
}

// split a table row on unescaped pipes; a lookbehind can't tell `\\|` (escaped backslash
// before a delimiter) from `\|` (escaped pipe), so escapes are consumed pairwise
function splitRow (row: string) {
  const cells: string[] = []
  let current = ''

  for (let i = 0; i < row.length; i++) {
    const ch = row[i]!

    if (ch === '\\' && i + 1 < row.length) {
      current += ch + row[i + 1]!
      i += 1
      continue
    }

    if (ch === '|') {
      cells.push(current)
      current = ''
      continue
    }

    current += ch
  }

  cells.push(current)

  return cells
}

// find the closing delimiter token, skipping backslash pairs and inline code spans so
// `**a \** b**` and `**a ` + '`x**`' + ` b**` close at the right position
function findDelimClose (text: string, from: number, token: string) {
  let i = from

  while (i < text.length) {
    const ch = text[i]!

    if (ch === '\\') {
      i += 2
      continue
    }

    if (ch === '`') {
      const end = text.indexOf('`', i + 1)

      if (end === -1) {
        return -1
      }

      i = end + 1
      continue
    }

    if (text.startsWith(token, i)) {
      return i
    }

    i += 1
  }

  return -1
}

// ordered longest-first so ** wins over *, __ over _
const DELIMITERS = [
  { token: '**', type: 'bold' as const },
  { token: '__', type: 'bold' as const },
  { token: '~~', type: 'strikethrough' as const },
  { token: '||', type: 'spoiler' as const },
  { token: '==', type: 'marked' as const },
  { token: '*', type: 'italic' as const },
  { token: '_', type: 'italic' as const }
]

/** parses the rich-markdown dialect into native blocks */
export function parseMarkdown (source: string, opts: ParseOptions = {}) {
  return new MarkdownParser(source.replace(/\r\n?/g, '\n'), opts).parseDocument()
}

class MarkdownParser {
  private readonly lenient: boolean
  private readonly host: HostParsers
  // one stable opts object so the html parser's per-session tag-token cache survives
  // across fragment calls into the same string
  private readonly htmlOpts: { lenient: boolean }

  constructor (private readonly source: string, opts: ParseOptions, private depth = 0) {
    this.lenient = opts.lenient === true
    this.htmlOpts = { lenient: this.lenient }
    this.host = {
      inline: s => this.parseInlineSource(s),
      blocks: s => new MarkdownParser(s, opts, this.depth + 1).parseDocument()
    }
  }

  parseDocument () {
    return this.parseBlocksFrom(this.source, 0)
  }

  private fail (message: string, position: number) {
    throw new RichParseError(message, position, this.source)
  }

  // depth spans emphasis nesting, blockquote recursion, and html-fragment host round-trips
  private guardDepth (position: number) {
    if (this.depth < MAX_NESTING_DEPTH) {
      return true
    }

    if (!this.lenient) {
      this.fail('nesting exceeds the supported depth', position)
    }

    return false
  }

  // `base` keeps error positions absolute when parsing an extracted region (blockquote body)
  private parseBlocksFrom (region: string, base: number) {
    if (!this.guardDepth(base)) {
      return region.trim() === '' ? [] : [{ type: 'paragraph' as const, text: region }]
    }

    this.depth += 1

    try {
      return this.scanBlocks(region, base)
    } finally {
      this.depth -= 1
    }
  }

  private scanBlocks (region: string, base: number) {
    const blocks: TelegramInputRichBlock[] = []
    const lines = region.split('\n')
    const offsets: number[] = []
    let acc = base

    for (const line of lines) {
      offsets.push(acc)
      acc += line.length + 1
    }

    let i = 0
    // when an html fragment ends mid-line its trimmed tail is requeued as that line;
    // `patched` marks it so the next fragment parse restarts at the right region offset
    let patched = -1
    let patchedStart = 0

    const lineAt = (n: number) => lines[n] ?? ''

    while (i < lines.length) {
      const line = lineAt(i)

      if (line.trim() === '') {
        i += 1
        continue
      }

      const fence = FENCE_RE.exec(line)

      if (fence !== null) {
        const language = fence[1]!.trim()
        const body: string[] = []
        let j = i + 1

        while (j < lines.length && lineAt(j).trimEnd() !== '```') {
          body.push(lineAt(j))
          j += 1
        }

        if (j >= lines.length && !this.lenient) {
          this.fail('unclosed code fence', offsets[i]!)
        }

        const text = body.join('\n')

        blocks.push(language === 'math'
          ? { type: 'mathematical_expression', expression: text }
          : { type: 'pre', text, ...(language ? { language } : {}) })

        i = j + 1
        continue
      }

      const heading = HEADING_RE.exec(line)

      if (heading !== null) {
        blocks.push({
          type: 'heading',
          text: this.parseInline(heading[2]!, offsets[i]! + heading[1]!.length + 1),
          size: heading[1]!.length as 1 | 2 | 3 | 4 | 5 | 6
        })
        i += 1
        continue
      }

      if (DIVIDER_RE.test(line)) {
        blocks.push({ type: 'divider' })
        i += 1
        continue
      }

      if (line.startsWith('>')) {
        const body: string[] = []
        let j = i

        while (j < lines.length && lineAt(j).startsWith('>')) {
          body.push(lineAt(j).replace(/^> ?/, ''))
          j += 1
        }

        blocks.push({ type: 'blockquote', blocks: this.parseBlocksFrom(body.join('\n'), offsets[i]! + 1) })
        i = j
        continue
      }

      const mathOpen = BLOCK_MATH_OPEN_RE.exec(line)

      if (mathOpen !== null) {
        const inlineClose = /^(.*?)\$\$\s*$/.exec(mathOpen[1]!)

        if (inlineClose !== null && mathOpen[1]!.trim() !== '') {
          blocks.push({ type: 'mathematical_expression', expression: inlineClose[1]!.trim() })
          i += 1
          continue
        }

        const body: string[] = mathOpen[1]!.trim() === '' ? [] : [mathOpen[1]!]
        let j = i + 1

        while (j < lines.length && !/\$\$\s*$/.test(lineAt(j))) {
          body.push(lineAt(j))
          j += 1
        }

        if (j >= lines.length) {
          if (!this.lenient) {
            this.fail('unclosed block math', offsets[i]!)
          }

          blocks.push({ type: 'paragraph', text: line })
          i += 1
          continue
        }

        body.push(lineAt(j).replace(/\$\$\s*$/, ''))
        blocks.push({ type: 'mathematical_expression', expression: body.join('\n').trim() })
        i = j + 1
        continue
      }

      if (TASK_RE.test(line) || BULLET_RE.test(line)) {
        const items: TelegramInputRichBlockListItem[] = []
        let j = i

        while (j < lines.length) {
          const current = lineAt(j)
          const task = TASK_RE.exec(current)
          const bullet = task === null ? BULLET_RE.exec(current) : null

          if (task !== null) {
            items.push({
              blocks: [{ type: 'paragraph', text: this.parseInline(task[2]!, offsets[j]!) }],
              has_checkbox: true,
              ...(task[1] !== ' ' ? { is_checked: true as const } : {})
            })
          } else if (bullet !== null) {
            items.push({ blocks: [{ type: 'paragraph', text: this.parseInline(bullet[1]!, offsets[j]!) }] })
          } else {
            break
          }

          j += 1
        }

        blocks.push({ type: 'list', items })
        i = j
        continue
      }

      if (ORDERED_RE.test(line)) {
        const items: TelegramInputRichBlockListItem[] = []
        let j = i

        while (j < lines.length) {
          const ordered = ORDERED_RE.exec(lineAt(j))

          if (ordered === null) {
            break
          }

          items.push({
            blocks: [{ type: 'paragraph', text: this.parseInline(ordered[2]!, offsets[j]!) }],
            value: Number(ordered[1]),
            type: '1'
          })
          j += 1
        }

        blocks.push({ type: 'list', items })
        i = j
        continue
      }

      if (line.startsWith('|') && TABLE_SEPARATOR_RE.test(lineAt(i + 1))) {
        const aligns = lineAt(i + 1)
          .split('|')
          .slice(1, -1)
          .map((cell) => {
            const c = cell.trim()

            if (c.startsWith(':') && c.endsWith(':')) {
              return 'center' as const
            }

            return c.endsWith(':') ? 'right' as const : 'left' as const
          })

        // gfm allows omitting the trailing pipe — only drop the last segment when it is
        // the empty remainder after a closing `|`
        const rowCells = (row: string) => {
          const segments = splitRow(row).slice(1)

          if (segments.length > 1 && segments[segments.length - 1]!.trim() === '') {
            segments.pop()
          }

          return segments
        }

        const parseRow = (row: string, n: number, header: boolean) =>
          rowCells(row)
            .map((cell, ci) => {
              const text = this.parseInline(cell.trim(), offsets[n]!)

              return {
                ...(text === '' ? {} : { text }),
                ...(header ? { is_header: true as const } : {}),
                align: aligns[ci] ?? 'left',
                valign: TABLE_CELL_VALIGN
              }
            })

        const cells = [parseRow(line, i, true)]
        let j = i + 2

        while (j < lines.length && lineAt(j).startsWith('|')) {
          cells.push(parseRow(lineAt(j), j, false))
          j += 1
        }

        blocks.push({ type: 'table', cells })
        i = j
        continue
      }

      const footnote = FOOTNOTE_DEF_RE.exec(line)

      if (footnote !== null) {
        blocks.push({
          type: 'paragraph',
          text: { type: 'reference', text: this.parseInline(footnote[2]!, offsets[i]!), name: footnote[1]! }
        })
        i += 1
        continue
      }

      const media = MEDIA_LINE_RE.exec(line)

      if (media !== null && !media[2]!.startsWith('tg://')) {
        const url = unescape(media[2]!)
        const kind = inferMediaKind(url)
        const title = media[3]

        blocks.push({
          type: kind,
          [kind]: { type: kind, media: url },
          ...(title === undefined || title === '' ? {} : { caption: { text: this.parseInline(title, offsets[i]!) } })
        } as unknown as TelegramInputRichBlock)
        i += 1
        continue
      }

      if (/^<[a-zA-Z]/.test(line)) {
        // parsing in place keeps one string identity for the whole region, so the html
        // parser's tag-token index is built once instead of per html line
        const start = i === patched ? patchedStart : offsets[i]! - base
        const fragment = parseHtmlFragment(region, start, this.htmlOpts, this.host)

        if (fragment !== null && fragment.level === 'block') {
          const value = fragment.value as TelegramInputRichBlock | TelegramInputRichBlock[]

          if (Array.isArray(value)) {
            blocks.push(...value)
          } else {
            blocks.push(value)
          }

          let j = i

          while (j + 1 < lines.length && offsets[j + 1]! - base <= fragment.end) {
            j += 1
          }

          const lineEnd = j + 1 < lines.length ? offsets[j + 1]! - base - 1 : region.length
          // the fragment may end mid-line; requeue the rest of that line
          const tail = region.slice(fragment.end, lineEnd)
          const trimmed = tail.trim()

          if (trimmed === '') {
            i = j + 1
          } else {
            lines[j] = trimmed
            patched = j
            patchedStart = fragment.end + (tail.length - tail.trimStart().length)
            i = j
          }

          continue
        }
      }

      // paragraph — accumulate until a blank line or the start of another block construct
      const body: string[] = [line]
      let j = i + 1

      while (j < lines.length) {
        const next = lineAt(j)

        if (startsBlock(next, lineAt(j + 1))) {
          break
        }

        body.push(next)
        j += 1
      }

      blocks.push({ type: 'paragraph', text: this.parseInline(body.join('\n'), offsets[i]!) })
      i = j
    }

    return blocks
  }

  private parseInlineSource (s: string) {
    return this.parseInline(s, 0)
  }

  private parseInline (text: string, base: number) {
    if (!this.guardDepth(base)) {
      return text
    }

    this.depth += 1

    try {
      return this.scanInline(text, base)
    } finally {
      this.depth -= 1
    }
  }

  private scanInline (text: string, base: number) {
    const parts: TelegramRichText[] = []
    let literal = ''
    let pos = 0

    const flush = () => {
      if (literal !== '') {
        parts.push(literal)
        literal = ''
      }
    }

    const push = (value: TelegramRichText) => {
      flush()
      parts.push(value)
    }

    while (pos < text.length) {
      const ch = text[pos]!

      if (ch === '\\' && pos + 1 < text.length && ESCAPABLE.has(text[pos + 1]!)) {
        literal += text[pos + 1]!
        pos += 2
        continue
      }

      if (ch === '&') {
        const entity = ENTITY_RE.exec(text.slice(pos))

        if (entity !== null) {
          if (entity[3] !== undefined) {
            const named = NAMED_ENTITIES[entity[3]]

            if (named === undefined) {
              if (!this.lenient) {
                this.fail(`unknown entity &${entity[3]};`, base + pos)
              }

              literal += entity[0]
            } else {
              literal += named
            }
          } else {
            const code = entity[1] !== undefined ? Number(entity[1]) : Number.parseInt(entity[2]!, 16)

            if (code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff)) {
              if (!this.lenient) {
                this.fail(`malformed numeric entity ${entity[0]}`, base + pos)
              }

              literal += entity[0]
            } else {
              literal += String.fromCodePoint(code)
            }
          }

          pos += entity[0].length
          continue
        }

        literal += ch
        pos += 1
        continue
      }

      const delim = DELIMITERS.find(d => text.startsWith(d.token, pos))

      if (delim !== undefined) {
        const close = findDelimClose(text, pos + delim.token.length, delim.token)

        if (close === -1) {
          if (!this.lenient) {
            this.fail(`unclosed ${delim.token}`, base + pos)
          }

          literal += delim.token
          pos += delim.token.length
          continue
        }

        const inner = text.slice(pos + delim.token.length, close)

        push({ type: delim.type, text: this.parseInline(inner, base + pos + delim.token.length) })
        pos = close + delim.token.length
        continue
      }

      if (ch === '`') {
        const close = text.indexOf('`', pos + 1)

        if (close === -1) {
          if (!this.lenient) {
            this.fail('unclosed `', base + pos)
          }

          literal += ch
          pos += 1
          continue
        }

        push({ type: 'code', text: text.slice(pos + 1, close) })
        pos = close + 1
        continue
      }

      if (ch === '$') {
        const close = findMathClose(text, pos)

        if (close === -1) {
          literal += ch
          pos += 1
          continue
        }

        push({ type: 'mathematical_expression', expression: text.slice(pos + 1, close) })
        pos = close + 1
        continue
      }

      if (text.startsWith('![', pos)) {
        const rest = text.slice(pos)
        const image = /^!\[((?:[^\]\\]|\\.)*)\]\(((?:[^)\\\s]|\\.)+)(?:\s+"(?:[^"\\]|\\.)*")?\)/.exec(rest)

        if (image !== null) {
          const url = unescape(image[2]!)

          if (url.startsWith('tg://emoji?id=')) {
            push({
              type: 'custom_emoji',
              custom_emoji_id: url.slice('tg://emoji?id='.length),
              alternative_text: this.plainText(image[1]!, base + pos + 2)
            })
            pos += image[0].length
            continue
          }

          if (url.startsWith('tg://time?')) {
            const unix = /[?&]unix=(\d+)/.exec(url)
            const format = /[?&]format=([^&]*)/.exec(url)

            if (unix === null) {
              if (!this.lenient) {
                this.fail('tg://time link without unix', base + pos)
              }
            } else {
              push({
                type: 'date_time',
                text: this.parseInline(image[1]!, base + pos + 2),
                unix_time: Number(unix[1]),
                date_time_format: format === null ? '' : decodeURIComponent(format[1]!)
              })
              pos += image[0].length
              continue
            }
          }

          if (!this.lenient) {
            this.fail('media must be its own block (a paragraph containing only the image)', base + pos)
          }

          literal += image[0]
          pos += image[0].length
          continue
        }
      }

      if (text.startsWith('[^', pos)) {
        const ref = /^\[\^([^\]\s]+)\]/.exec(text.slice(pos))

        if (ref !== null) {
          push({ type: 'reference_link', text: ref[1]!, reference_name: ref[1]! })
          pos += ref[0].length
          continue
        }
      }

      if (ch === '[') {
        const link = this.parseLink(text, pos, base)

        if (link !== null) {
          push(link.value)
          pos = link.end
          continue
        }

        if (!this.lenient) {
          this.fail('unclosed link', base + pos)
        }

        literal += ch
        pos += 1
        continue
      }

      if (ch === '<' && /^<[a-zA-Z]/.test(text.slice(pos))) {
        const fragment = parseHtmlFragment(text, pos, this.htmlOpts, this.host)

        if (fragment !== null) {
          if (fragment.level === 'inline') {
            push(fragment.value as TelegramRichText)
            pos = fragment.end
            continue
          }

          if (!this.lenient) {
            this.fail('block tag inside inline content', base + pos)
          }
        } else if (!this.lenient) {
          this.fail('unsupported html tag', base + pos)
        }

        literal += ch
        pos += 1
        continue
      }

      literal += ch
      pos += 1
    }

    flush()

    if (parts.length === 0) {
      return ''
    }

    return parts.length === 1 ? parts[0]! : parts
  }

  // spans that must stay plain text (image alt) still get escape + entity decoding
  private plainText (span: string, base: number) {
    const parsed = this.parseInline(span, base)

    if (typeof parsed === 'string') {
      return parsed
    }

    if (!this.lenient) {
      this.fail('expected plain text', base)
    }

    return span
  }

  private parseLink (text: string, pos: number, base: number) {
    // label may contain escaped brackets; url ends at an unescaped `)`
    const match = /^\[((?:[^\]\\]|\\.)*)\]\(((?:[^)\\\s]|\\.)+)\)/.exec(text.slice(pos))

    if (match === null) {
      return null
    }

    const label = this.parseInline(match[1]!, base + pos + 1)
    const url = unescape(match[2]!)
    const value: TelegramRichText = url.startsWith('#')
      ? { type: 'anchor_link', text: label, anchor_name: url.slice(1) }
      : { type: 'url', text: label, url }

    return { value, end: pos + match[0].length }
  }
}
