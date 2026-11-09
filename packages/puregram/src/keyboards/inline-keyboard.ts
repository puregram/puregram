import type * as Interfaces from '@puregram/api'

import type { ButtonStyleParams, InlineButtonParams, CallbackData } from './types'
import { cloneButtons, decorateInlineButton, normalizeCallbackData } from './types'

interface TextButtonParams {
  text: string
  payload: CallbackData
}

interface UrlButtonParams {
  text: string
  url: string
}

interface WebAppButtonParams {
  text: string
  url: string
}

interface SwitchToCurrentChatButtonParams {
  text: string
  query: string
}

interface SwitchToChatButtonParams {
  text: string
  query: string
}

interface SwitchToChosenChatButtonParams {
  text: string
  query?: string
  allowUserChats?: boolean
  allowBotChats?: boolean
  allowGroupChats?: boolean
  allowChannelChats?: boolean
}

interface CopyButtonParams {
  text: string
  copy: string
}

interface GameButtonParams {
  text: string
  game: Interfaces.TelegramCallbackGame
}

interface PayButtonParams {
  text: string
}

interface LoginButtonParams {
  text: string
  loginUrl: Interfaces.TelegramLoginUrl
}

type TextButtonParamsWithStyle = TextButtonParams & InlineButtonParams
type UrlButtonParamsWithStyle = UrlButtonParams & InlineButtonParams
type WebAppButtonParamsWithStyle = WebAppButtonParams & InlineButtonParams
type SwitchToCurrentChatButtonParamsWithStyle = SwitchToCurrentChatButtonParams & InlineButtonParams
type SwitchToChatButtonParamsWithStyle = SwitchToChatButtonParams & InlineButtonParams
type SwitchToChosenChatButtonParamsWithStyle = SwitchToChosenChatButtonParams & InlineButtonParams
type CopyButtonParamsWithStyle = CopyButtonParams & InlineButtonParams
type GameButtonParamsWithStyle = GameButtonParams & InlineButtonParams
type PayButtonParamsWithStyle = PayButtonParams & InlineButtonParams
type LoginButtonParamsWithStyle = LoginButtonParams & InlineButtonParams
type DisabledButtonParams = { text: string } & ButtonStyleParams

/** inline keyboard */
export class InlineKeyboard {
  /** empty inline keyboard. That's literally it */
  static empty = new InlineKeyboard()

  private buttons: Interfaces.TelegramInlineKeyboardButton[][] = []
  private isForceReply = false

  constructor (rows: (Interfaces.TelegramInlineKeyboardButton | Interfaces.TelegramInlineKeyboardButton[])[] = []) {
    for (const row of rows) {
      this.addRow(row)
    }
  }

  /** whether the keyboard has no buttons */
  get isEmpty () {
    return this.buttons.length === 0
  }

  /** number of rows in the keyboard */
  get rowCount () {
    return this.buttons.length
  }

  /** total number of buttons across all rows */
  get length () {
    let count = 0

    for (const row of this.buttons) {
      count += row.length
    }

    return count
  }

  /** assemble a builder of buttons */
  static keyboard (
    rows: (Interfaces.TelegramInlineKeyboardButton | Interfaces.TelegramInlineKeyboardButton[])[]
  ) {
    return new InlineKeyboard(rows)
  }

  /** construct an `InlineKeyboard` from an existing `InlineKeyboardMarkup` JSON */
  static from (markup: Interfaces.TelegramInlineKeyboardMarkup) {
    const keyboard = new InlineKeyboard()

    keyboard.buttons = cloneButtons(markup.inline_keyboard)
    keyboard.isForceReply = markup.force_reply ?? false

    return keyboard
  }

  /** generate text button */
  static textButton (params: TextButtonParamsWithStyle) {
    return decorateInlineButton({
      text: params.text,
      callback_data: normalizeCallbackData(params.payload)
    }, params)
  }

  /** an alias for `textButton` */
  static text (params: TextButtonParamsWithStyle) {
    return InlineKeyboard.textButton(params)
  }

  /** generate URL button */
  static urlButton (params: UrlButtonParamsWithStyle) {
    return decorateInlineButton({
      text: params.text,
      url: params.url
    }, params)
  }

  /** an alias for `urlButton` */
  static url (params: UrlButtonParamsWithStyle) {
    return InlineKeyboard.urlButton(params)
  }

  /** generate Web App button */
  static webAppButton (params: WebAppButtonParamsWithStyle) {
    return decorateInlineButton({
      text: params.text,
      web_app: { url: params.url }
    }, params)
  }

  /** an alias for `webAppButton` */
  static webApp (params: WebAppButtonParamsWithStyle) {
    return InlineKeyboard.webAppButton(params)
  }

  /** generate button that will switch to current chat and type the query */
  static switchToCurrentChatButton (
    params: SwitchToCurrentChatButtonParamsWithStyle
  ) {
    return decorateInlineButton({
      text: params.text,
      switch_inline_query_current_chat: params.query
    }, params)
  }

  /** an alias for `switchToCurrentChatButton` */
  static switchToCurrentChat (params: SwitchToCurrentChatButtonParamsWithStyle) {
    return InlineKeyboard.switchToCurrentChatButton(params)
  }

  /** generate button that will prompt user to select one of their chats */
  static switchToChatButton (
    params: SwitchToChatButtonParamsWithStyle
  ) {
    return decorateInlineButton({
      text: params.text,
      switch_inline_query: params.query
    }, params)
  }

  /** an alias for `switchToChatButton` */
  static switchToChat (params: SwitchToChatButtonParamsWithStyle) {
    return InlineKeyboard.switchToChatButton(params)
  }

  /**
   * generate button that will prompt user to select one of their chats of the
   * specified type, open that chat and insert the bot's username and the
   * specified inline query in the input field
   */
  static switchToChosenChatButton (
    params: SwitchToChosenChatButtonParamsWithStyle
  ) {
    const chosenChat: Interfaces.TelegramSwitchInlineQueryChosenChat = {}

    if (params.query !== undefined) {
      chosenChat.query = params.query
    }

    if (params.allowBotChats !== undefined) {
      chosenChat.allow_bot_chats = params.allowBotChats
    }

    if (params.allowChannelChats !== undefined) {
      chosenChat.allow_channel_chats = params.allowChannelChats
    }

    if (params.allowGroupChats !== undefined) {
      chosenChat.allow_group_chats = params.allowGroupChats
    }

    if (params.allowUserChats !== undefined) {
      chosenChat.allow_user_chats = params.allowUserChats
    }

    return decorateInlineButton({
      text: params.text,
      switch_inline_query_chosen_chat: chosenChat
    }, params)
  }

  /** an alias for `switchToChosenChatButton` */
  static switchToChosenChat (params: SwitchToChosenChatButtonParamsWithStyle) {
    return InlineKeyboard.switchToChosenChatButton(params)
  }

  /** description of the button that copies the specified text to the clipboard */
  static copyButton (params: CopyButtonParamsWithStyle) {
    return decorateInlineButton({
      text: params.text,
      copy_text: {
        text: params.copy
      }
    }, params)
  }

  /** an alias for `copyButton` */
  static copy (params: CopyButtonParamsWithStyle) {
    return InlineKeyboard.copyButton(params)
  }

  /** generate game button */
  static gameButton (params: GameButtonParamsWithStyle) {
    return decorateInlineButton({
      text: params.text,
      callback_game: params.game
    }, params)
  }

  /** an alias for `gameButton` */
  static game (params: GameButtonParamsWithStyle) {
    return InlineKeyboard.gameButton(params)
  }

  /** generate pay button */
  static payButton (params: PayButtonParamsWithStyle) {
    return decorateInlineButton({
      pay: true,
      text: params.text
    }, params)
  }

  /** an alias for `payButton` */
  static pay (params: PayButtonParamsWithStyle) {
    return InlineKeyboard.payButton(params)
  }

  /** generate login button */
  static loginButton (params: LoginButtonParamsWithStyle) {
    return decorateInlineButton({
      login_url: params.loginUrl,
      text: params.text
    }, params)
  }

  /** an alias for `loginButton` */
  static login (params: LoginButtonParamsWithStyle) {
    return InlineKeyboard.loginButton(params)
  }

  /** generate a disabled button — it renders but does nothing, and takes no action of its own */
  static disabledButton (params: DisabledButtonParams) {
    return decorateInlineButton({ text: params.text }, { ...params, disabled: true })
  }

  /** an alias for `disabledButton` */
  static disabled (params: DisabledButtonParams) {
    return InlineKeyboard.disabledButton(params)
  }

  /**
   * requests clients to show a reply interface to the user together with the keyboard, as if the
   * user had selected the bot's message and tapped 'reply'
   */
  forceReply (forceReply = true) {
    this.isForceReply = forceReply

    return this
  }

  /** conditionally apply a chain of mutations to the keyboard */
  if (condition: boolean, then: (keyboard: this) => void, otherwise?: (keyboard: this) => void) {
    if (condition) {
      then(this)
    } else if (otherwise) {
      otherwise(this)
    }

    return this
  }

  /** returns JSON which is compatible with Telegram's `InlineKeyboardMarkup` interface */
  toJSON () {
    const json: Interfaces.TelegramInlineKeyboardMarkup = {
      inline_keyboard: this.buttons
    }

    if (this.isForceReply) {
      json.force_reply = true
    }

    return json
  }

  /** clones the keyboard (creates a new one with the same set of buttons) */
  clone () {
    const cloned = new InlineKeyboard()

    cloned.buttons = cloneButtons(this.buttons)
    cloned.isForceReply = this.isForceReply

    return cloned
  }

  /** deletes a button with the specified payload */
  delete (payload: string) {
    const rowIndex = this.buttons.findIndex(row => row.findIndex(button => button.callback_data === payload) !== -1)

    if (rowIndex === -1) {
      return this
    }

    const row = this.buttons[rowIndex]

    if (!row) {
      return this
    }

    const buttonIndex = row.findIndex(button => button.callback_data === payload)

    row.splice(buttonIndex, 1)

    if (row.length === 0) {
      this.buttons.splice(rowIndex, 1)
    }

    return this
  }

  toString () {
    return JSON.stringify(this)
  }

  private addRow (row: Interfaces.TelegramInlineKeyboardButton[] | Interfaces.TelegramInlineKeyboardButton) {
    if (!Array.isArray(row)) {
      row = [row]
    }

    this.buttons.push(row)

    return this
  }
}
