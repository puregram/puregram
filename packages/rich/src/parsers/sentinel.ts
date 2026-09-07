import type {
  TelegramInputRichBlock, TelegramInputRichBlockListItem, TelegramRichBlockCaption,
  TelegramRichBlockTableCell, TelegramRichMessageButton, TelegramRichText
} from '@puregram/api'

import { type RichContent, emitBlocks, emitText } from '../emit'
import { RichError } from '../error'
import { isRichNode } from '../node'
import { Rich } from '../rich'

// SOH (0x01) is parsed verbatim by both dialect lexers (it is neither whitespace nor any
// special syntax char), so it delimits interpolation slot indices inside the source string
const SENTINEL_DELIM = '\u0001'

const SENTINEL_RE = new RegExp(`${SENTINEL_DELIM}(\\d+)${SENTINEL_DELIM}`, 'g')

export function isTemplateStringsArray (value: unknown): value is TemplateStringsArray {
  return Array.isArray(value) && Array.isArray((value as unknown as { raw?: unknown }).raw)
}

/** builds a sentinel-laden source string from a tagged-template invocation */
export function composeWithSentinels (strings: TemplateStringsArray, values: readonly RichContent[]) {
  let out = strings[0] ?? ''

  for (let i = 0; i < values.length; i++) {
    out += `${SENTINEL_DELIM}${i}${SENTINEL_DELIM}${strings[i + 1] ?? ''}`
  }

  return out
}

// a slot that must occupy its own block position rather than splice into inline text
function isBlockSlot (value: RichContent): boolean {
  if (Array.isArray(value)) {
    return value.some(v => isBlockSlot(v))
  }

  return (isRichNode(value) && value.level === 'block') || value instanceof Rich
}

/** resolves sentinels inside a plain-string field (code text, latex) — text-only slots allowed */
export function expandString (source: string, slots: readonly RichContent[]) {
  return source.replace(SENTINEL_RE, (_, index: string) => {
    const emitted = emitText(slots[Number(index)])

    if (typeof emitted !== 'string') {
      throw new RichError('only plain text can interpolate into code or math content')
    }

    return emitted
  })
}

/** resolves sentinels inside a `RichText` tree, splicing interpolated inline values */
export function expandText (text: TelegramRichText, slots: readonly RichContent[]): TelegramRichText {
  if (typeof text === 'string') {
    const parts: TelegramRichText[] = []
    let last = 0
    let matched = false

    SENTINEL_RE.lastIndex = 0

    for (let match = SENTINEL_RE.exec(text); match !== null; match = SENTINEL_RE.exec(text)) {
      matched = true

      if (match.index > last) {
        parts.push(text.slice(last, match.index))
      }

      const slot = slots[Number(match[1])]

      if (isBlockSlot(slot)) {
        throw new RichError('a block value can only interpolate as its own block, not inside inline text')
      }

      const emitted = emitText(slot)

      if (emitted !== '') {
        parts.push(emitted)
      }

      last = match.index + match[0].length
    }

    if (!matched) {
      return text
    }

    if (last < text.length) {
      parts.push(text.slice(last))
    }

    if (parts.length === 0) {
      return ''
    }

    return parts.length === 1 ? parts[0]! : parts
  }

  if (Array.isArray(text)) {
    return text.map(t => expandText(t, slots))
  }

  return expandNode(text, slots)
}

// every plain-string field a rich text node can carry — sentinels in urls, anchor names,
// emoji ids, … must resolve to text, or interpolation would leak \u0001N\u0001 to the wire
const NODE_STRING_FIELDS = [
  'url', 'anchor_name', 'name', 'custom_emoji_id', 'alternative_text', 'date_time_format',
  'reference_name', 'username', 'hashtag', 'cashtag', 'bot_command', 'email_address',
  'phone_number', 'bank_card_number'
] as const

function expandNode (node: Exclude<TelegramRichText, string | TelegramRichText[]>, slots: readonly RichContent[]) {
  // the union's variants are field-wise disjoint; a keyed copy is the only way to touch them generically
  const out = { ...node } as Record<string, unknown>
  let changed = false

  for (const field of NODE_STRING_FIELDS) {
    const value = out[field]

    if (typeof value === 'string') {
      const expanded = expandString(value, slots)

      if (expanded !== value) {
        out[field] = expanded
        changed = true
      }
    }
  }

  if ('expression' in node) {
    out.expression = expandString(node.expression, slots)
    changed = true
  }

  if (node.type === 'button') {
    out.button = expandButton(node.button, slots)
    changed = true
  }

  if ('text' in node && node.text !== undefined) {
    out.text = expandText(node.text, slots)
    changed = true
  }

  return (changed ? out : node) as TelegramRichText
}

const BUTTON_STRING_FIELDS = [
  'url', 'callback_data', 'switch_inline_query', 'switch_inline_query_current_chat'
] as const

function expandButton (button: TelegramRichMessageButton, slots: readonly RichContent[]) {
  const out: Record<string, unknown> = { ...button, text: expandText(button.text, slots) }

  for (const field of BUTTON_STRING_FIELDS) {
    const value = out[field]

    if (typeof value === 'string') {
      out[field] = expandString(value, slots)
    }
  }

  if (button.web_app !== undefined) {
    out.web_app = { ...button.web_app, url: expandString(button.web_app.url, slots) }
  }

  if (button.login_url !== undefined) {
    out.login_url = {
      ...button.login_url,
      url: expandString(button.login_url.url, slots),
      ...(button.login_url.forward_text === undefined
        ? {}
        : { forward_text: expandString(button.login_url.forward_text, slots) })
    }
  }

  if (button.switch_inline_query_chosen_chat?.query !== undefined) {
    out.switch_inline_query_chosen_chat = {
      ...button.switch_inline_query_chosen_chat,
      query: expandString(button.switch_inline_query_chosen_chat.query, slots)
    }
  }

  if (button.copy_text !== undefined) {
    out.copy_text = { text: expandString(button.copy_text.text, slots) }
  }

  return out as unknown as TelegramRichMessageButton
}

function expandCaption (caption: TelegramRichBlockCaption, slots: readonly RichContent[]) {
  return {
    text: expandText(caption.text, slots),
    ...(caption.credit === undefined ? {} : { credit: expandText(caption.credit, slots) })
  }
}

function expandCaptionField (caption: TelegramRichBlockCaption | undefined, slots: readonly RichContent[]) {
  return caption === undefined ? {} : { caption: expandCaption(caption, slots) }
}

// media may hold a MediaSource envelope instead of a string — only string urls carry sentinels
function expandMedia<T extends { media: string }> (input: T, slots: readonly RichContent[]) {
  return typeof input.media === 'string' ? { ...input, media: expandString(input.media, slots) } : input
}

function expandListItem (item: TelegramInputRichBlockListItem, slots: readonly RichContent[]) {
  return { ...item, blocks: expandBlocks(item.blocks, slots) }
}

function expandCell (cell: TelegramRichBlockTableCell, slots: readonly RichContent[]) {
  return cell.text === undefined ? cell : { ...cell, text: expandText(cell.text, slots) }
}

// a paragraph string may interleave prose with block-slot sentinels (adjacent block
// interpolations coalesce into one text run in the html dialect) — segment it: block
// slots splice as their own blocks, the prose chunks between become paragraphs
function expandParagraph (text: string, slots: readonly RichContent[]) {
  const cuts: { start: number, end: number, slot: RichContent }[] = []

  SENTINEL_RE.lastIndex = 0

  for (let match = SENTINEL_RE.exec(text); match !== null; match = SENTINEL_RE.exec(text)) {
    const slot = slots[Number(match[1])]

    if (isBlockSlot(slot)) {
      cuts.push({ start: match.index, end: match.index + match[0].length, slot })
    }
  }

  if (cuts.length === 0) {
    const expanded = expandText(text, slots)

    return expanded === '' ? [] : [{ type: 'paragraph' as const, text: expanded }]
  }

  const blocks: TelegramInputRichBlock[] = []

  const pushChunk = (chunk: string) => {
    if (chunk === '') {
      return
    }

    const expanded = expandText(chunk, slots)

    if (typeof expanded !== 'string' || expanded.trim() !== '') {
      blocks.push({ type: 'paragraph', text: expanded })
    }
  }

  let prev = 0

  for (const cut of cuts) {
    pushChunk(text.slice(prev, cut.start))
    blocks.push(...emitBlocks(cut.slot))
    prev = cut.end
  }

  pushChunk(text.slice(prev))

  return blocks
}

/** resolves sentinels inside a parsed block tree, splicing interpolated values back in */
export function expandBlocks (blocks: readonly TelegramInputRichBlock[], slots: readonly RichContent[]) {
  const out: TelegramInputRichBlock[] = []

  for (const block of blocks) {
    if (block.type === 'paragraph' && typeof block.text === 'string') {
      out.push(...expandParagraph(block.text, slots))
      continue
    }

    out.push(expandBlock(block, slots))
  }

  return out
}

function expandBlock (block: TelegramInputRichBlock, slots: readonly RichContent[]) {
  switch (block.type) {
    case 'paragraph':
    case 'footer':
    case 'thinking':
    case 'heading':
      return { ...block, text: expandText(block.text, slots) }

    case 'pre':
      return {
        ...block,
        text: expandString(typeof block.text === 'string' ? block.text : '', slots),
        ...(block.language === undefined ? {} : { language: expandString(block.language, slots) })
      }

    case 'mathematical_expression':
      return { ...block, expression: expandString(block.expression, slots) }

    case 'expandable_blockquote':
      return {
        ...block,
        text: expandText(block.text, slots),
        ...(block.credit === undefined ? {} : { credit: expandText(block.credit, slots) })
      }

    case 'buttons':
      return { ...block, buttons: block.buttons.map(button => expandButton(button, slots)) }

    case 'pullquote':
      return {
        ...block,
        text: expandText(block.text, slots),
        ...(block.credit === undefined ? {} : { credit: expandText(block.credit, slots) })
      }

    case 'blockquote':
      return {
        ...block,
        blocks: expandBlocks(block.blocks, slots),
        ...(block.credit === undefined ? {} : { credit: expandText(block.credit, slots) })
      }

    case 'details':
      return { ...block, summary: expandText(block.summary, slots), blocks: expandBlocks(block.blocks, slots) }

    case 'list':
      return { ...block, items: block.items.map(item => expandListItem(item, slots)) }

    case 'collage':
    case 'slideshow':
      return {
        ...block,
        blocks: expandBlocks(block.blocks, slots),
        ...(block.caption === undefined ? {} : { caption: expandCaption(block.caption, slots) })
      }

    case 'table':
      return {
        ...block,
        cells: block.cells.map(row => row.map(cell => expandCell(cell, slots))),
        ...(block.caption === undefined ? {} : { caption: expandText(block.caption, slots) })
      }

    case 'photo':
      return { ...block, photo: expandMedia(block.photo, slots), ...expandCaptionField(block.caption, slots) }

    case 'video':
      return { ...block, video: expandMedia(block.video, slots), ...expandCaptionField(block.caption, slots) }

    case 'audio':
      return { ...block, audio: expandMedia(block.audio, slots), ...expandCaptionField(block.caption, slots) }

    case 'animation':
      return { ...block, animation: expandMedia(block.animation, slots), ...expandCaptionField(block.caption, slots) }

    case 'voice_note':
      return { ...block, voice_note: expandMedia(block.voice_note, slots), ...expandCaptionField(block.caption, slots) }

    case 'document':
      return { ...block, document: expandMedia(block.document, slots), ...expandCaptionField(block.caption, slots) }

    case 'map':
      return block.caption === undefined ? block : { ...block, caption: expandCaption(block.caption, slots) }

    default:
      return block
  }
}
