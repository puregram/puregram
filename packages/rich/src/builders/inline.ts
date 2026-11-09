import type { TelegramUser } from '@puregram/api'

import { type RichContent, emitText } from '../emit'
import { makeNode } from '../node'

type WrapType =
  | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'spoiler'
  | 'code' | 'marked' | 'subscript' | 'superscript'

function wrap (type: WrapType) {
  return (content: RichContent) => makeNode('inline', () => ({ type, text: emitText(content) }))
}

/** bold text */
export const bold = wrap('bold')
/** italic text */
export const italic = wrap('italic')
/** underlined text */
export const underline = wrap('underline')
/** strikethrough text */
export const strikethrough = wrap('strikethrough')
/** spoiler text */
export const spoiler = wrap('spoiler')
/** inline fixed-width code */
export const code = wrap('code')
/** marked / highlighted text */
export const marked = wrap('marked')
/** subscript text */
export const subscript = wrap('subscript')
/** superscript text */
export const superscript = wrap('superscript')

/** inline link */
export function link (text: RichContent, href: string) {
  return makeNode('inline', () => ({ type: 'url', text: emitText(text), url: href }))
}

export function tonAddress (text: RichContent, address: string) {
  return makeNode('inline', () => ({ type: 'ton_address', text: emitText(text), address }))
}

/** the optional identity fields a `text_mention` user can carry */
export interface MentionUserOptions {
  firstName?: string
  lastName?: string
  username?: string
  isBot?: boolean
}

/** inline mention of a user by id (works even without a username) */
export function mentionUser (text: RichContent, userId: number, options: MentionUserOptions = {}) {
  const user: TelegramUser = {
    id: userId,
    is_bot: options.isBot ?? false,
    first_name: options.firstName ?? '',
    ...(options.lastName !== undefined ? { last_name: options.lastName } : {}),
    ...(options.username !== undefined ? { username: options.username } : {})
  }

  return makeNode('inline', () => ({ type: 'text_mention', text: emitText(text), user }))
}

/** inline LaTeX formula (raw latex) */
export function math (latex: string) {
  return makeNode('inline', () => ({ type: 'mathematical_expression', expression: latex }))
}

/** custom emoji by document id, with alternative text */
export function customEmoji (id: string, alt: string) {
  return makeNode('inline', () => ({ type: 'custom_emoji', custom_emoji_id: id, alternative_text: alt }))
}

/** auto-formatted date-time (see telegram's date-time entity formatting for `format`) */
export function time (label: RichContent, unix: number, format = '') {
  return makeNode('inline', () => ({ type: 'date_time', text: emitText(label), unix_time: unix, date_time_format: format }))
}

/** in-document link to an `anchor(name)` target */
export function reference (text: RichContent, name: string) {
  return makeNode('inline', () => ({ type: 'anchor_link', text: emitText(text), anchor_name: name }))
}

/** an in-document anchor target, linkable via `reference(..., name)` */
export function anchor (name: string) {
  return makeNode('inline', () => ({ type: 'anchor', name }))
}

/** footnote reference marker — pairs with a `footnote(id, …)` definition */
export function footnoteRef (id: string, label?: RichContent) {
  return makeNode('inline', () => ({ type: 'reference_link', text: label === undefined ? id : emitText(label), reference_name: id }))
}

/** alias for `strikethrough` */
export const strike = strikethrough
/** alias for `subscript` */
export const sub = subscript
/** alias for `superscript` */
export const sup = superscript
/** alias for `mentionUser` */
export const mention = mentionUser
/** alias for `customEmoji` */
export const emoji = customEmoji
/** alias for `footnoteRef` */
export const fnRef = footnoteRef
