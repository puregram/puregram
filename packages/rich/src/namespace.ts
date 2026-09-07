import type { TelegramInputRichBlock, TelegramInputRichMessageMedia } from '@puregram/api'

import * as builders from './builders'
import { MAX_RICH_PARSE_LENGTH } from './constants'
import { type RichContent, emitBlocks, emitText } from './emit'
import { RichError } from './error'
import { type Dialect, isRichNode } from './node'
import { parseHtml } from './parsers/html'
import { parseMarkdown } from './parsers/markdown'
import { composeWithSentinels, expandBlocks, isTemplateStringsArray } from './parsers/sentinel'
import { Rich } from './rich'

// strip the common leading indentation shared by the literal skeleton, then trim blank edges
function dedent (skeleton: string) {
  const lines = skeleton.split('\n')
  let min = Infinity

  for (const line of lines) {
    if (line.trim() === '') {
      continue
    }

    const indent = (/^[ \t]*/.exec(line) as RegExpExecArray)[0].length

    min = Math.min(min, indent)
  }

  if (!Number.isFinite(min)) {
    min = 0
  }

  return lines.map(line => line.slice(min)).join('\n').replace(/^\n+/, '').trimEnd()
}

/** a dialect parse tag — call with a source string, a builder array, or as a tagged template */
export interface RichParseTag {
  (source: string): Rich
  (content: readonly RichContent[]): Rich
  (strings: TemplateStringsArray, ...values: RichContent[]): Rich
  /** permissive parse — unsupported constructs degrade to literal text instead of throwing */
  lenient: {
    (source: string): Rich
    (strings: TemplateStringsArray, ...values: RichContent[]): Rich
  }
}

function makeParseTag (
  parse: (source: string, opts: { lenient?: boolean }) => TelegramInputRichBlock[],
  dedentTemplates: boolean
) {
  const guarded = (source: string, lenient: boolean) => {
    if (source.length > MAX_RICH_PARSE_LENGTH) {
      throw new RichError(`rich source exceeds ${MAX_RICH_PARSE_LENGTH} characters`)
    }

    return parse(source, { lenient })
  }

  const impl = (lenient: boolean) =>
    (first: string | readonly RichContent[] | TemplateStringsArray, ...values: RichContent[]) => {
      if (typeof first === 'string') {
        return new Rich('blocks', guarded(first, lenient))
      }

      if (!isTemplateStringsArray(first)) {
        return new Rich('blocks', emitBlocks(first as RichContent))
      }

      const composed = composeWithSentinels(first, values)
      const source = dedentTemplates ? dedent(composed) : composed

      return new Rich('blocks', expandBlocks(guarded(source, lenient), values))
    }

  return Object.assign(impl(false), { lenient: impl(true) }) as RichParseTag
}

export interface RawOptions {
  /** `InputRichMessageMedia` entries the string's `tg://…?id=` links refer to */
  media?: TelegramInputRichMessageMedia[]
}

function makeRawTag (dialect: Dialect) {
  return (source: string, options: RawOptions = {}) => new Rich(dialect, source, options.media)
}

const md = makeParseTag(parseMarkdown, true)
const html = makeParseTag(parseHtml, false)
const rawMd = makeRawTag('markdown')
const rawHtml = makeRawTag('html')

// values that must occupy their own block position when spliced into a template
function isBlockValue (value: RichContent): boolean {
  if (Array.isArray(value)) {
    return value.some(v => isBlockValue(v))
  }

  return (isRichNode(value) && value.level === 'block') || value instanceof Rich
}

// the root template: no parsing — literal text stays literal, blank lines separate
// paragraphs, inline values splice into the surrounding run, block values stand alone
function composeTemplate (strings: TemplateStringsArray, values: readonly RichContent[]) {
  // \0 seams keep interpolated values out of the dedent (only the literal skeleton dedents)
  const literals = dedent(strings.join('\u0000')).split('\u0000')
  const blocks: TelegramInputRichBlock[] = []
  let run: RichContent[] = []

  const flush = () => {
    if (run.length === 0) {
      return
    }

    const text = emitText(run)

    run = []

    if (text !== '') {
      blocks.push({ type: 'paragraph', text })
    }
  }

  for (let i = 0; i < literals.length; i++) {
    const chunks = literals[i]!.split(/\n{2,}/)

    for (let j = 0; j < chunks.length; j++) {
      if (j > 0) {
        flush()
      }

      if (chunks[j] !== '') {
        run.push(chunks[j])
      }
    }

    if (i < values.length) {
      const value = values[i]

      if (isBlockValue(value)) {
        flush()
        blocks.push(...emitBlocks(value))
      } else {
        run.push(value)
      }
    }
  }

  flush()

  return new Rich('blocks', blocks)
}

/** compose builders / content into a native-blocks rich message */
function compose (first: RichContent | readonly RichContent[] | TemplateStringsArray, ...values: RichContent[]) {
  if (isTemplateStringsArray(first)) {
    return composeTemplate(first, values)
  }

  return new Rich('blocks', emitBlocks(first as RichContent))
}

/** the rich authoring namespace — blocks composition, dialect parsers, raw passthrough, every builder */
export const rich = Object.assign(compose, {
  md,
  markdown: md,
  html,
  raw: {
    md: rawMd,
    markdown: rawMd,
    html: rawHtml
  },
  ...builders
})
