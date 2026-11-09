import type {
  TelegramInputRichBlock,
  TelegramInputRichBlockListItem,
  TelegramRichBlockCaption,
  TelegramRichBlockTableCell,
  TelegramRichText
} from '@puregram/api'

import { DEFAULT_MAP_HEIGHT, DEFAULT_MAP_WIDTH, TABLE_CELL_VALIGN } from '../constants'
import { RichError } from '../error'
import { escapeHtml, escapeHtmlText } from '../escape'
import type { RichMediaKind } from '../media'

import { buttonAttrs, footnoteReference, mediaPayload, plainText } from './shared'

// telegram never decodes entities inside <tg-math>, so a closing tag in the expression can only be refused
function rawMath (expression: string) {
  if (/<\/tg-math/i.test(expression)) {
    throw new RichError('cannot serialize a math expression containing </tg-math to html — send blocks natively')
  }

  return expression
}

/** render rich text as html-dialect source */
export function serializeHtmlText (text: TelegramRichText): string {
  if (typeof text === 'string') {
    return escapeHtmlText(text)
  }

  if (Array.isArray(text)) {
    return text.map(t => serializeHtmlText(t)).join('')
  }

  switch (text.type) {
    case 'bold': return `<b>${serializeHtmlText(text.text)}</b>`
    case 'italic': return `<i>${serializeHtmlText(text.text)}</i>`
    case 'underline': return `<u>${serializeHtmlText(text.text)}</u>`
    case 'strikethrough': return `<s>${serializeHtmlText(text.text)}</s>`
    case 'spoiler': return `<tg-spoiler>${serializeHtmlText(text.text)}</tg-spoiler>`
    case 'code': return `<code>${serializeHtmlText(text.text)}</code>`
    case 'marked': return `<mark>${serializeHtmlText(text.text)}</mark>`
    case 'subscript': return `<sub>${serializeHtmlText(text.text)}</sub>`
    case 'superscript': return `<sup>${serializeHtmlText(text.text)}</sup>`
    case 'url': return `<a href="${escapeHtml(text.url)}">${serializeHtmlText(text.text)}</a>`
    case 'text_mention': return `<a href="tg://user?id=${text.user.id}">${serializeHtmlText(text.text)}</a>`
    case 'custom_emoji': return `<tg-emoji emoji-id="${escapeHtml(text.custom_emoji_id)}">${escapeHtml(text.alternative_text)}</tg-emoji>`
    case 'date_time': return `<tg-time unix="${text.unix_time}"${text.date_time_format ? ` format="${escapeHtml(text.date_time_format)}"` : ''}>${serializeHtmlText(text.text)}</tg-time>`
    case 'mathematical_expression': return `<tg-math>${rawMath(text.expression)}</tg-math>`
    case 'anchor': return `<a name="${escapeHtml(text.name)}"></a>`
    case 'anchor_link': return `<a href="#${escapeHtml(text.anchor_name)}">${serializeHtmlText(text.text)}</a>`
    case 'reference': return `<tg-reference name="${escapeHtml(text.name)}">${serializeHtmlText(text.text)}</tg-reference>`
    case 'reference_link': return `<a href="#${escapeHtml(text.reference_name)}">${serializeHtmlText(text.text)}</a>`
    case 'button': return `<tg-button${buttonAttrs(text.button)}>${serializeHtmlText(text.button.text)}</tg-button>`
    // telegram auto-detects these from the plain characters
    case 'mention':
    case 'hashtag':
    case 'cashtag':
    case 'bot_command':
    case 'email_address':
    case 'phone_number':
    case 'bank_card_number':
    case 'ton_address':
      return serializeHtmlText(text.text)
    default:
      throw new RichError(`cannot serialize rich text node: ${JSON.stringify(text)}`)
  }
}

function captionInner (caption: TelegramRichBlockCaption) {
  const credit = caption.credit === undefined ? '' : `<cite>${serializeHtmlText(caption.credit)}</cite>`

  return `${serializeHtmlText(caption.text)}${credit}`
}

// a lone paragraph inside a container renders as bare inline text, matching the parsed shape
function containedBlock (block: TelegramInputRichBlock) {
  return block.type === 'paragraph' && footnoteReference(block.text) === null
    ? serializeHtmlText(block.text)
    : serializeBlock(block)
}

function listItem (item: TelegramInputRichBlockListItem) {
  const prefix = item.has_checkbox ? `<input type="checkbox"${item.is_checked ? ' checked' : ''}>` : ''

  return `<li>${prefix}${item.blocks.map(b => containedBlock(b)).join('')}</li>`
}

function tableCell (cell: TelegramRichBlockTableCell) {
  const tag = cell.is_header ? 'th' : 'td'
  const colspan = cell.colspan !== undefined && cell.colspan > 1 ? ` colspan="${cell.colspan}"` : ''
  const rowspan = cell.rowspan !== undefined && cell.rowspan > 1 ? ` rowspan="${cell.rowspan}"` : ''
  const align = cell.align === 'left' ? '' : ` align="${cell.align}"`
  const valign = cell.valign === TABLE_CELL_VALIGN ? '' : ` valign="${cell.valign}"`

  return `<${tag}${colspan}${rowspan}${align}${valign}>${cell.text === undefined ? '' : serializeHtmlText(cell.text)}</${tag}>`
}

function mediaElement (kind: RichMediaKind, src: string, spoilerAttr: string) {
  switch (kind) {
    case 'photo': return `<img src="${src}"${spoilerAttr}/>`
    case 'audio':
    case 'voice_note': return `<audio src="${src}"></audio>`
    case 'document': return `<tg-document src="${src}"></tg-document>`
    case 'video':
    case 'animation': return `<video src="${src}"${spoilerAttr}></video>`
  }
}

function serializeBlock (block: TelegramInputRichBlock): string {
  switch (block.type) {
    case 'paragraph': {
      const ref = footnoteReference(block.text)

      return ref === null
        ? `<p>${serializeHtmlText(block.text)}</p>`
        : `<tg-reference name="${escapeHtml(ref.name)}">${serializeHtmlText(ref.text)}</tg-reference>`
    }
    case 'heading': return `<h${block.size}>${serializeHtmlText(block.text)}</h${block.size}>`
    case 'pre': {
      const cls = block.language ? ` class="language-${escapeHtml(block.language)}"` : ''

      return `<pre><code${cls}>${escapeHtml(plainText(block.text))}</code></pre>`
    }
    case 'footer': return `<footer>${serializeHtmlText(block.text)}</footer>`
    case 'divider': return '<hr/>'
    case 'mathematical_expression': return `<tg-math-block>${rawMath(block.expression)}</tg-math-block>`
    case 'anchor': return `<a name="${escapeHtml(block.name)}"></a>`
    case 'list': {
      const body = block.items.map(item => listItem(item)).join('')
      const first = block.items[0]

      if (first === undefined || (first.value === undefined && first.type === undefined)) {
        return `<ul>${body}</ul>`
      }

      // per-item value/type deviations collapse into the <ol> attributes — best effort
      const start = first.value !== undefined && first.value !== 1 ? ` start="${first.value}"` : ''
      const type = first.type !== undefined && first.type !== '1' ? ` type="${first.type}"` : ''

      return `<ol${start}${type}>${body}</ol>`
    }
    case 'blockquote': {
      const inner = block.blocks.map(b => containedBlock(b)).join('<br>')
      const credit = block.credit === undefined ? '' : `<cite>${serializeHtmlText(block.credit)}</cite>`

      return `<blockquote>${inner}${credit}</blockquote>`
    }
    case 'expandable_blockquote': {
      const credit = block.credit === undefined ? '' : `<cite>${serializeHtmlText(block.credit)}</cite>`

      return `<blockquote expandable>${serializeHtmlText(block.text)}${credit}</blockquote>`
    }
    case 'pullquote': {
      const credit = block.credit === undefined ? '' : `<cite>${serializeHtmlText(block.credit)}</cite>`

      return `<aside>${serializeHtmlText(block.text)}${credit}</aside>`
    }
    case 'collage':
    case 'slideshow': {
      const cap = block.caption === undefined ? '' : `<figcaption>${captionInner(block.caption)}</figcaption>`

      return `<tg-${block.type}>${block.blocks.map(b => serializeBlock(b)).join('')}${cap}</tg-${block.type}>`
    }
    case 'table': {
      const attrs = `${block.is_bordered ? ' bordered' : ''}${block.is_striped ? ' striped' : ''}${block.is_compact ? ' compact' : ''}`
      const cap = block.caption === undefined ? '' : `<caption>${serializeHtmlText(block.caption)}</caption>`
      const body = block.cells.map(row => `<tr>${row.map(c => tableCell(c)).join('')}</tr>`).join('')

      return `<table${attrs}>${cap}${body}</table>`
    }
    case 'details': {
      const open = block.is_open ? ' open' : ''

      return `<details${open}><summary>${serializeHtmlText(block.summary)}</summary>${serializeHtmlBlocks(block.blocks)}</details>`
    }
    case 'map': {
      const zoom = block.zoom === undefined ? '' : ` zoom="${block.zoom}"`
      const width = block.width ?? DEFAULT_MAP_WIDTH
      const height = block.height ?? DEFAULT_MAP_HEIGHT
      const size = width === DEFAULT_MAP_WIDTH && height === DEFAULT_MAP_HEIGHT
        ? ''
        : ` width="${width}" height="${height}"`
      const element = `<tg-map lat="${block.location.latitude}" long="${block.location.longitude}"${zoom}${size}/>`

      return block.caption === undefined
        ? element
        : `<figure>${element}<figcaption>${captionInner(block.caption)}</figcaption></figure>`
    }
    case 'photo':
    case 'video':
    case 'audio':
    case 'animation':
    case 'voice_note':
    case 'document': {
      const { url, spoiler } = mediaPayload(block)
      const src = escapeHtml(url)
      const element = mediaElement(block.type, src, spoiler ? ' tg-spoiler' : '')

      return block.caption === undefined
        ? element
        : `<figure>${element}<figcaption>${captionInner(block.caption)}</figcaption></figure>`
    }
    case 'buttons': {
      const align = block.align === undefined ? '' : ` align="${block.align}"`
      const body = block.buttons
        .map(b => `<tg-button${buttonAttrs(b)}>${serializeHtmlText(b.text)}</tg-button>`)
        .join('')

      return `<tg-button-row${align}>${body}</tg-button-row>`
    }
    case 'thinking': return `<tg-thinking>${serializeHtmlText(block.text)}</tg-thinking>`
    default:
      throw new RichError(`cannot serialize block: ${JSON.stringify(block)}`)
  }
}

/** render native blocks as html-dialect source — blocks concatenate with no separator */
export function serializeHtmlBlocks (blocks: readonly TelegramInputRichBlock[]) {
  return blocks.map(block => serializeBlock(block)).join('')
}
