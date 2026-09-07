import type {
  TelegramInputRichBlock,
  TelegramInputRichBlockListItem,
  TelegramRichBlockCaption,
  TelegramRichBlockTableCell,
  TelegramRichText
} from '@puregram/api'

import { DEFAULT_MAP_HEIGHT, DEFAULT_MAP_WIDTH } from '../constants'
import { RichError } from '../error'
import { escapeHtml, escapeMarkdown, escapeMarkdownAttr, escapeMarkdownUrl } from '../escape'

import { buttonAttrs, footnoteReference, mediaPayload, plainText } from './shared'

const ALIGN_MD: Record<'left' | 'center' | 'right', string> = { left: ':--', center: ':-:', right: '--:' }
const SIMPLE_NAME_RE = /^[\w-]+$/

/** render rich text as markdown-dialect source */
export function serializeMarkdownText (text: TelegramRichText): string {
  if (typeof text === 'string') {
    return escapeMarkdown(text)
  }

  if (Array.isArray(text)) {
    return text.map(t => serializeMarkdownText(t)).join('')
  }

  switch (text.type) {
    case 'bold': return `**${serializeMarkdownText(text.text)}**`
    case 'italic': return `*${serializeMarkdownText(text.text)}*`
    case 'underline': return `<u>${serializeMarkdownText(text.text)}</u>`
    case 'strikethrough': return `~~${serializeMarkdownText(text.text)}~~`
    case 'spoiler': return `||${serializeMarkdownText(text.text)}||`
    case 'code': {
      const body = plainText(text.text)

      return body.includes('`')
        ? `<code>${escapeHtml(body).replace(/`/g, '&#96;')}</code>`
        : `\`${body}\``
    }
    case 'marked': return `==${serializeMarkdownText(text.text)}==`
    case 'subscript': return `<sub>${serializeMarkdownText(text.text)}</sub>`
    case 'superscript': return `<sup>${serializeMarkdownText(text.text)}</sup>`
    case 'url': return `[${serializeMarkdownText(text.text)}](${escapeMarkdownUrl(text.url)})`
    case 'text_mention': return `[${serializeMarkdownText(text.text)}](${escapeMarkdownUrl(`tg://user?id=${text.user.id}`)})`
    case 'custom_emoji': return `![${escapeMarkdown(text.alternative_text)}](${escapeMarkdownUrl(`tg://emoji?id=${text.custom_emoji_id}`)})`
    case 'date_time': return `![${serializeMarkdownText(text.text)}](${escapeMarkdownUrl(`tg://time?unix=${text.unix_time}${text.date_time_format ? `&format=${encodeURIComponent(text.date_time_format)}` : ''}`)})`
    case 'mathematical_expression': return /[$\n]|^\s|\s$/.test(text.expression)
      ? `<tg-math>${text.expression}</tg-math>`
      : `$${text.expression}$`
    case 'anchor': return `<a name="${escapeMarkdownAttr(text.name)}"></a>`
    case 'anchor_link': return SIMPLE_NAME_RE.test(text.anchor_name)
      ? `[${serializeMarkdownText(text.text)}](#${text.anchor_name})`
      : `<a href="#${escapeMarkdownAttr(text.anchor_name)}">${serializeMarkdownText(text.text)}</a>`
    case 'reference': return `<tg-reference name="${escapeMarkdownAttr(text.name)}">${serializeMarkdownText(text.text)}</tg-reference>`
    case 'reference_link': {
      if (!SIMPLE_NAME_RE.test(text.reference_name)) {
        return `<a href="#${escapeMarkdownAttr(text.reference_name)}">${serializeMarkdownText(text.text)}</a>`
      }

      return text.text === text.reference_name
        ? `[^${text.reference_name}]`
        : `[${serializeMarkdownText(text.text)}](#${text.reference_name})`
    }
    case 'button': return `<tg-button${buttonAttrs(text.button, escapeMarkdownAttr)}>${serializeMarkdownText(text.button.text)}</tg-button>`
    // telegram auto-detects these from the plain characters
    case 'mention':
    case 'hashtag':
    case 'cashtag':
    case 'bot_command':
    case 'email_address':
    case 'phone_number':
    case 'bank_card_number':
      return serializeMarkdownText(text.text)
    default:
      throw new RichError(`cannot serialize rich text node: ${JSON.stringify(text)}`)
  }
}

// a literal newline would escape a single-line construct; the numeric entity decodes back on parse
function singleLine (text: TelegramRichText) {
  return serializeMarkdownText(text).replace(/\n/g, '&#10;')
}

function captionInner (caption: TelegramRichBlockCaption) {
  const credit = caption.credit === undefined ? '' : `<cite>${serializeMarkdownText(caption.credit)}</cite>`

  return `${serializeMarkdownText(caption.text)}${credit}`
}

function itemMarker (item: TelegramInputRichBlockListItem) {
  if (item.has_checkbox) {
    return `- [${item.is_checked ? 'x' : ' '}] `
  }

  // letter/roman label types have no markdown token — the numeric value is the best effort
  return item.value === undefined ? '- ' : `${item.value}. `
}

function tableRow (cells: TelegramRichBlockTableCell[]) {
  return `| ${cells.map(c => (c.text === undefined ? '' : singleLine(c.text))).join(' | ')} |`
}

// a lone paragraph inside a list item renders as bare inline text kept on the marker line
function itemBlock (block: TelegramInputRichBlock) {
  return block.type === 'paragraph' && footnoteReference(block.text) === null
    ? singleLine(block.text)
    : serializeBlock(block)
}

function serializeBlock (block: TelegramInputRichBlock): string {
  switch (block.type) {
    case 'paragraph': {
      const ref = footnoteReference(block.text)

      if (ref !== null) {
        return SIMPLE_NAME_RE.test(ref.name)
          ? `[^${ref.name}]: ${singleLine(ref.text)}`
          : serializeMarkdownText(ref)
      }

      // a leading "N. " re-parses as an ordered list; '.' is not backslash-escapable, use the entity
      return serializeMarkdownText(block.text)
        .replace(/^(\d+)\.(?=\s)/, '$1&#46;')
        .replace(/^\n|\n(?=\n)|\n$/g, '&#10;')
    }
    case 'heading': return `${'#'.repeat(block.size)} ${singleLine(block.text)}`
    case 'pre': {
      const body = plainText(block.text)
      const language = block.language ?? ''

      if (!body.includes('```') && !/[`\n]/.test(language)) {
        return `\`\`\`${language}\n${body}\n\`\`\``
      }

      if (/<\/(?:code|pre)/i.test(body)) {
        throw new RichError('cannot serialize a fenced body that closes its own tag to markdown — send blocks natively')
      }

      const cls = language === '' ? '' : ` class="language-${escapeMarkdownAttr(language)}"`

      return `<pre><code${cls}>${body}</code></pre>`
    }
    case 'footer': return `<footer>${serializeMarkdownText(block.text)}</footer>`
    case 'divider': return '---'
    case 'mathematical_expression': return block.expression.includes('$')
      ? `<tg-math-block>${block.expression}</tg-math-block>`
      : `$$${block.expression}$$`
    case 'anchor': return `<a name="${escapeMarkdownAttr(block.name)}"></a>`
    case 'list':
      // multi-block items join with a bare newline — markdown has no indented-continuation emitter
      return block.items
        .map(item => `${itemMarker(item)}${item.blocks.map(b => itemBlock(b)).join('\n')}`)
        .join('\n')
    case 'blockquote': {
      // the `>` grammar has no credit slot — fall back to the html tag, valid inside markdown;
      // the inner slice re-parses as line-oriented markdown, so blocks need blank-line separation
      if (block.credit !== undefined) {
        const inner = block.blocks.map(b => serializeBlock(b)).join('\n\n')

        return `<blockquote>${inner}<cite>${serializeMarkdownText(block.credit)}</cite></blockquote>`
      }

      return block.blocks
        .map(b => serializeBlock(b).split('\n').map(line => `>${line}`).join('\n'))
        .join('\n>\n')
    }
    case 'expandable_blockquote': {
      const credit = block.credit === undefined ? '' : `<cite>${serializeMarkdownText(block.credit)}</cite>`

      return `<blockquote expandable>${serializeMarkdownText(block.text)}${credit}</blockquote>`
    }
    case 'pullquote': {
      const credit = block.credit === undefined ? '' : `<cite>${serializeMarkdownText(block.credit)}</cite>`

      return `<aside>${serializeMarkdownText(block.text)}${credit}</aside>`
    }
    case 'collage':
    case 'slideshow': {
      // items sit on their own lines; blank lines isolate them from the surrounding tags
      const cap = block.caption === undefined ? '' : `<figcaption>${captionInner(block.caption)}</figcaption>`
      const items = block.blocks.map(b => serializeBlock(b)).join('\n')

      return `<tg-${block.type}>\n\n${items}\n\n${cap}</tg-${block.type}>`
    }
    case 'table': {
      if (block.cells.length === 0) {
        return ''
      }

      // gfm: the first row is always the header row; table captions have no markdown slot
      const head = block.cells[0] ?? []
      const separator = `| ${head.map(c => ALIGN_MD[c.align]).join(' | ')} |`

      return [tableRow(head), separator, ...block.cells.slice(1).map(r => tableRow(r))].join('\n')
    }
    case 'details': {
      // a markdown body must be blank-line-separated or telegram renders it as literal html content
      const open = block.is_open ? ' open' : ''

      return `<details${open}><summary>${serializeMarkdownText(block.summary)}</summary>\n\n${serializeMarkdownBlocks(block.blocks)}\n\n</details>`
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
      // `![](url "caption")` carries no spoiler/credit slot — both drop in markdown
      const { url } = mediaPayload(block)
      const title = block.caption === undefined
        ? ''
        : ` "${singleLine(block.caption.text).replace(/"/g, '&#34;')}"`

      return `![](${escapeMarkdownUrl(url)}${title})`
    }
    case 'buttons': {
      const align = block.align === undefined ? '' : ` align="${block.align}"`
      const body = block.buttons
        .map(b => `<tg-button${buttonAttrs(b, escapeMarkdownAttr)}>${serializeMarkdownText(b.text)}</tg-button>`)
        .join('')

      return `<tg-button-row${align}>${body}</tg-button-row>`
    }
    case 'thinking': return `<tg-thinking>${serializeMarkdownText(block.text)}</tg-thinking>`
    default:
      throw new RichError(`cannot serialize block: ${JSON.stringify(block)}`)
  }
}

/** render native blocks as markdown-dialect source — blocks separate with blank lines */
export function serializeMarkdownBlocks (blocks: readonly TelegramInputRichBlock[]) {
  return blocks.map(block => serializeBlock(block)).filter(source => source !== '').join('\n\n')
}
