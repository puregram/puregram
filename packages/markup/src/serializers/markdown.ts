import type { Entity, Formatted } from '../formatted'

import { layout, type TagNode } from './layout'

// chars MarkdownV2 treats as significant — telegram's documented set: _ * [ ] ( ) ~ ` > # + - = | { } . !
const MD_ESCAPE_RE = /[_*[\]()~`>#+\-=|{}.!\\]/g

function escapeMd (text: string) {
  return text.replace(MD_ESCAPE_RE, ch => `\\${ch}`)
}

// inside `code` spans only backticks and backslashes are significant; everything else is verbatim
const MD_CODE_ESCAPE_RE = /[`\\]/g

function escapeMdCode (text: string) {
  return text.replace(MD_CODE_ESCAPE_RE, ch => `\\${ch}`)
}

const MD_TARGET_ESCAPE_RE = /[)\\]/g

function escapeMdTarget (text: string) {
  return text.replace(MD_TARGET_ESCAPE_RE, ch => `\\${ch}`)
}

function wrap (entity: Entity) {
  switch (entity.type) {
    case 'bold': return { open: '*', close: '*' }
    case 'italic': return { open: '_', close: '_' }
    case 'underline': return { open: '__', close: '__' }
    case 'strikethrough': return { open: '~', close: '~' }
    case 'spoiler': return { open: '||', close: '||' }
    case 'text_link': return { open: '[', close: `](${escapeMdTarget(entity.url ?? '')})` }
    case 'text_mention': return { open: '[', close: `](tg://user?id=${entity.user?.id ?? 0})` }
    case 'custom_emoji': return { open: '![', close: `](tg://emoji?id=${escapeMdTarget(entity.custom_emoji_id ?? '')})` }
    case 'date_time': {
      const unix = entity.unix_time ?? 0
      const fmt = entity.date_time_format

      if (fmt !== undefined && fmt !== '') {
        return { open: '![', close: `](tg://time?unix=${unix}&format=${escapeMdTarget(fmt)})` }
      }

      return { open: '![', close: `](tg://time?unix=${unix})` }
    }
    default: return null
  }
}

function isRaw (entity: Entity) {
  return entity.type === 'code' || entity.type === 'pre'
}

function renderQuoteBody (body: string, marker: string) {
  const trailingNl = body.endsWith('\n')
  const trimmed = trailingNl ? body.slice(0, -1) : body
  const prefixed = trimmed.split('\n').map(line => `${marker} ${line}`).join('\n')

  return trailingNl ? `${prefixed}\n` : prefixed
}

function renderRange (text: string, start: number, end: number, nodes: TagNode[], rawMode: boolean) {
  let out = ''
  let cursor = start
  const esc = rawMode ? escapeMdCode : escapeMd

  for (const node of nodes) {
    if (node.start > cursor) {
      out += esc(text.slice(cursor, node.start))
    }

    const entity = node.entity

    if (entity.type === 'code') {
      const slice = text.slice(node.start, node.end)

      out += '`'
      out += escapeMdCode(slice)
      out += '`'
      cursor = node.end
      continue
    }

    if (entity.type === 'pre') {
      const slice = text.slice(node.start, node.end)
      const lang = entity.language !== undefined && entity.language !== '' ? entity.language : ''

      out += `\`\`\`${lang}\n`
      out += slice.replace(/```/g, '\\`\\`\\`')
      out += '\n```'
      cursor = node.end
      continue
    }

    if (entity.type === 'blockquote' || entity.type === 'expandable_blockquote') {
      const inner = node.children.length === 0
        ? escapeMd(text.slice(node.start, node.end))
        : renderRange(text, node.start, node.end, node.children, rawMode)
      const marker = entity.type === 'expandable_blockquote' ? '>>' : '>'

      out += renderQuoteBody(inner, marker)
      cursor = node.end
      continue
    }

    const w = wrap(entity)

    if (w === null) {
      // unsupported in MarkdownV2 (mention/hashtag/etc — client-detected, no source syntax)
      if (node.children.length === 0) {
        out += esc(text.slice(node.start, node.end))
      } else {
        out += renderRange(text, node.start, node.end, node.children, rawMode)
      }

      cursor = node.end
      continue
    }

    const innerRaw = rawMode || isRaw(entity)

    out += w.open

    if (node.children.length === 0) {
      const innerEsc = innerRaw ? escapeMdCode : escapeMd

      out += innerEsc(text.slice(node.start, node.end))
    } else {
      out += renderRange(text, node.start, node.end, node.children, innerRaw)
    }

    out += w.close
    cursor = node.end
  }

  if (cursor < end) {
    out += esc(text.slice(cursor, end))
  }

  return out
}

/** serializes a {@link Formatted} (or `{text, entities}` shape) into telegram MarkdownV2 source */
export function toMarkdown (source: Formatted | { text: string, entities?: readonly Entity[] }) {
  const text = source.text
  const entities = source.entities ?? []
  const roots = layout(text, entities)

  return renderRange(text, 0, text.length, roots, false)
}
