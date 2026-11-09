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

  payload?: CallbackData
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
type GameButtonParamsWithStyle = GameButtonParams & InlineButtonParams
type PayButtonParamsWithStyle = PayButtonParams & InlineButtonParams
type LoginButtonParamsWithStyle = LoginButtonParams & InlineButtonParams
type DisabledButtonParams = { text: string } & ButtonStyleParams

export class InlineKeyboardBuilder {
  private rows: Interfaces.TelegramInlineKeyboardButton[][] = []
  private currentRow: Interfaces.TelegramInlineKeyboardButton[] = []
  private isForceReply = false

  /** whether the builder has no buttons (committed rows + current row) */
  get isEmpty () {
    return this.rows.length === 0 && this.currentRow.length === 0
  }

  /** number of rows that will be emitted (committed rows + current row if non-empty) */
  get rowCount () {
    return this.rows.length + (this.currentRow.length === 0 ? 0 : 1)
  }

  /** total number of buttons across all rows including the in-progress row */
  get length () {
    let count = this.currentRow.length

    for (const row of this.rows) {
      count += row.length
    }

    return count
  }

  /** construct an `InlineKeyboardBuilder` from an existing `InlineKeyboardMarkup` JSON */
  static from (markup: Interfaces.TelegramInlineKeyboardMarkup) {
    const builder = new InlineKeyboardBuilder()

    builder.rows = cloneButtons(markup.inline_keyboard)
    builder.isForceReply = markup.force_reply ?? false

    return builder
  }

  /** generate text button */
  textButton (params: TextButtonParamsWithStyle) {
    return this.addButton(decorateInlineButton({
      text: params.text,
      callback_data: normalizeCallbackData(params.payload)
    }, params))
  }

  /** generate URL button */
  urlButton (params: UrlButtonParamsWithStyle) {
    const button: Interfaces.TelegramInlineKeyboardButton = {
      text: params.text,
      url: params.url
    }

    if (params.payload !== undefined) {
      button.callback_data = normalizeCallbackData(params.payload)
    }

    return this.addButton(decorateInlineButton(button, params))
  }

  /** generate Web App button */
  webAppButton (params: WebAppButtonParamsWithStyle) {
    return this.addButton(decorateInlineButton({
      text: params.text,
      web_app: { url: params.url }
    }, params))
  }

  /** generate button that will switch to current chat and type the query */
  switchToCurrentChatButton (params: SwitchToCurrentChatButtonParamsWithStyle) {
    return this.addButton(decorateInlineButton({
      text: params.text,
      switch_inline_query_current_chat: params.query
    }, params))
  }

  /** generate button that will prompt user to select one of their chats */
  switchToChatButton (params: SwitchToChatButtonParamsWithStyle) {
    return this.addButton(decorateInlineButton({
      text: params.text,
      switch_inline_query: params.query
    }, params))
  }

  /**
   * generate button that will prompt user to select one of their chats of the
   * specified type, open that chat and insert the bot's username and the
   * specified inline query in the input field
   */
  switchToChosenChatButton (params: SwitchToChosenChatButtonParamsWithStyle) {
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

    return this.addButton(decorateInlineButton({
      text: params.text,
      switch_inline_query_chosen_chat: chosenChat
    }, params))
  }

  /** generate game button */
  gameButton (params: GameButtonParamsWithStyle) {
    return this.addWideButton(decorateInlineButton({
      text: params.text,
      callback_game: params.game
    }, params))
  }

  /** generate pay button */
  payButton (params: PayButtonParamsWithStyle) {
    return this.addWideButton(decorateInlineButton({
      pay: true,
      text: params.text
    }, params))
  }

  /** generate login button */
  loginButton (params: LoginButtonParamsWithStyle) {
    return this.addWideButton(decorateInlineButton({
      login_url: params.loginUrl,
      text: params.text
    }, params))
  }

  /** generate a disabled button — it renders but does nothing, and takes no action of its own */
  disabledButton (params: DisabledButtonParams) {
    return this.addButton(decorateInlineButton({ text: params.text }, { ...params, disabled: true }))
  }

  /**
   * requests clients to show a reply interface to the user together with the keyboard, as if the
   * user had selected the bot's message and tapped 'reply'
   */
  forceReply (forceReply = true) {
    this.isForceReply = forceReply

    return this
  }

  /** save current row of buttons in the general rows */
  row () {
    if (this.currentRow.length === 0) {
      return this
    }

    this.rows.push(this.currentRow)
    this.currentRow = []

    return this
  }

  /** conditionally apply a chain of mutations to the builder */
  if (condition: boolean, then: (builder: this) => void, otherwise?: (builder: this) => void) {
    if (condition) {
      then(this)
    } else if (otherwise) {
      otherwise(this)
    }

    return this
  }

  /** clone current builder to new instance */
  clone () {
    const builder = new InlineKeyboardBuilder()

    builder.rows = cloneButtons(this.rows)
    builder.currentRow = cloneButtons(this.currentRow)

    return builder
  }

  /** returns JSON which is compatible with Telegram's `InlineKeyboardMarkup` interface */
  toJSON () {
    const buttons = this.currentRow.length !== 0
      ? [...this.rows, this.currentRow]
      : this.rows

    const json: Interfaces.TelegramInlineKeyboardMarkup = {
      inline_keyboard: buttons
    }

    if (this.isForceReply) {
      json.force_reply = true
    }

    return json
  }

  toString () {
    return JSON.stringify(this)
  }

  private addButton (button: Interfaces.TelegramInlineKeyboardButton) {
    this.currentRow.push(button)

    return this
  }

  private addWideButton (button: Interfaces.TelegramInlineKeyboardButton) {
    if (this.currentRow.length !== 0) {
      this.row()
    }

    this.addButton(button)

    return this.row()
  }
}
