import type { TelegramRichMessageButton, TelegramRichText } from '@puregram/api'

import { MAX_BUTTON_ROW_BUTTONS } from '../constants'
import { type RichContent, emitText } from '../emit'
import { RichError } from '../error'
import { type RichNode, isRichNode, makeNode } from '../node'

import type { Align } from './block'

/** the accent a rich-message button is rendered with; omitted means the app default */
export type RichButtonStyle = 'danger' | 'success' | 'primary' | 'link'

/** the `loginUrl` action in full form — a bare string is shorthand for `{ url }` */
export interface ButtonLoginUrl {
  url: string
  forwardText?: string
  botUsername?: string
  requestWriteAccess?: boolean
}

/** the chat picker of a `switchInlineQueryChosenChat` action */
export interface ButtonChosenChat {
  query?: string
  allowUserChats?: boolean
  allowBotChats?: boolean
  allowGroupChats?: boolean
  allowChannelChats?: boolean
}

/** button options — exactly one action must be set, the rest of the fields are decoration */
export interface ButtonOptions {
  style?: RichButtonStyle
  url?: string
  callbackData?: string
  webApp?: string
  loginUrl?: string | ButtonLoginUrl
  switchInlineQuery?: string
  switchInlineQueryCurrentChat?: string
  switchInlineQueryChosenChat?: ButtonChosenChat
  copyText?: string
  disabled?: boolean
}

const ACTION_NAMES = [
  'url', 'callbackData', 'webApp', 'loginUrl', 'switchInlineQuery',
  'switchInlineQueryCurrentChat', 'switchInlineQueryChosenChat', 'copyText', 'disabled'
].join(', ')

function loginUrlOf (value: string | ButtonLoginUrl) {
  if (typeof value === 'string') {
    return { url: value }
  }

  return {
    url: value.url,
    ...(value.forwardText === undefined ? {} : { forward_text: value.forwardText }),
    ...(value.botUsername === undefined ? {} : { bot_username: value.botUsername }),
    ...(value.requestWriteAccess === undefined ? {} : { request_write_access: value.requestWriteAccess })
  }
}

function chosenChatOf (value: ButtonChosenChat) {
  return {
    ...(value.query === undefined ? {} : { query: value.query }),
    ...(value.allowUserChats === undefined ? {} : { allow_user_chats: value.allowUserChats }),
    ...(value.allowBotChats === undefined ? {} : { allow_bot_chats: value.allowBotChats }),
    ...(value.allowGroupChats === undefined ? {} : { allow_group_chats: value.allowGroupChats }),
    ...(value.allowChannelChats === undefined ? {} : { allow_channel_chats: value.allowChannelChats })
  }
}

function actionsOf (options: ButtonOptions) {
  const {
    url, callbackData, webApp, loginUrl, switchInlineQuery,
    switchInlineQueryCurrentChat, switchInlineQueryChosenChat, copyText, disabled
  } = options

  const actions: (Partial<TelegramRichMessageButton> | undefined)[] = [
    url === undefined ? undefined : { url },
    callbackData === undefined ? undefined : { callback_data: callbackData },
    webApp === undefined ? undefined : { web_app: { url: webApp } },
    loginUrl === undefined ? undefined : { login_url: loginUrlOf(loginUrl) },
    switchInlineQuery === undefined ? undefined : { switch_inline_query: switchInlineQuery },
    switchInlineQueryCurrentChat === undefined
      ? undefined
      : { switch_inline_query_current_chat: switchInlineQueryCurrentChat },
    switchInlineQueryChosenChat === undefined
      ? undefined
      : { switch_inline_query_chosen_chat: chosenChatOf(switchInlineQueryChosenChat) },
    copyText === undefined ? undefined : { copy_text: { text: copyText } },
    disabled === true ? { disabled: {} } : undefined
  ]

  return actions.filter(action => action !== undefined)
}

function buttonText (text: TelegramRichText): TelegramRichText {
  if (typeof text === 'string') {
    return text
  }

  if (Array.isArray(text)) {
    return text.map(part => buttonText(part))
  }

  if (text.type !== 'custom_emoji' && text.type !== 'date_time') {
    throw new RichError(`a button label takes only plain text, customEmoji and time nodes, got ${text.type}`)
  }

  return text
}

function makeButton (label: RichContent, options: ButtonOptions) {
  const [action, extra] = actionsOf(options)

  if (action === undefined || extra !== undefined) {
    throw new RichError(`a button takes exactly one action of ${ACTION_NAMES}`)
  }

  if (options.style === 'link' && action.callback_data === undefined) {
    throw new RichError('the link button style is only allowed on a callbackData button')
  }

  return {
    text: buttonText(emitText(label)),
    ...(options.style === undefined ? {} : { style: options.style }),
    ...action
  }
}

function rowButton (node: RichNode) {
  const emitted = isRichNode(node) && node.level === 'inline' ? node.emit() : undefined

  if (typeof emitted !== 'object' || emitted === null || Array.isArray(emitted) || emitted.type !== 'button') {
    throw new RichError('buttonRow takes button(...) nodes only')
  }

  return emitted.button
}

/** inline button, rendered inside the surrounding text run */
export function button (label: RichContent, options: ButtonOptions) {
  return makeNode('inline', () => ({ type: 'button', button: makeButton(label, options) }))
}

/** a standalone row of `button(...)`s, optionally aligned within the message */
export function buttonRow (buttons: readonly RichNode[], options: { align?: Align } = {}) {
  return makeNode('block', () => {
    if (buttons.length === 0 || buttons.length > MAX_BUTTON_ROW_BUTTONS) {
      throw new RichError(`a button row takes 1-${MAX_BUTTON_ROW_BUTTONS} buttons, got ${buttons.length}`)
    }

    return {
      type: 'buttons',
      buttons: buttons.map(node => rowButton(node)),
      ...(options.align === undefined ? {} : { align: options.align })
    }
  })
}
