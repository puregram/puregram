import type * as Interfaces from '@puregram/api'

import type { ButtonStyleParams } from './types'
import { cloneButtons } from './types'

/** keyboard builder */
export class KeyboardBuilder {
  private rows: Interfaces.TelegramKeyboardButton[][] = []
  private currentRow: Interfaces.TelegramKeyboardButton[] = []
  private isOneTime = false
  private isResized = false
  private isSelective = false
  private isPersistent = false
  private placeholder?: string

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

  /** construct a `KeyboardBuilder` from an existing `ReplyKeyboardMarkup` JSON */
  static from (markup: Interfaces.TelegramReplyKeyboardMarkup) {
    const builder = new KeyboardBuilder()

    builder.rows = cloneButtons(markup.keyboard)
    builder.isResized = markup.resize_keyboard ?? false
    builder.isOneTime = markup.one_time_keyboard ?? false
    builder.isSelective = markup.selective ?? false
    builder.isPersistent = markup.is_persistent ?? false

    if (markup.input_field_placeholder !== undefined) {
      builder.placeholder = markup.input_field_placeholder
    }

    return builder
  }

  /**
   * generate text button
   * if none of the optional fields are used,
   * it will be sent as a message when the button is pressed
   */
  textButton (text: string, params?: ButtonStyleParams) {
    const button: Interfaces.TelegramKeyboardButton = { text }

    if (params?.style) {
      button.style = params.style
    }

    if (params?.iconCustomEmojiId) {
      button.icon_custom_emoji_id = params.iconCustomEmojiId
    }

    return this.addButton(button)
  }

  /**
   * if specified, pressing the button will open a list of suitable users
   * tapping on any user will send their identifier to the bot in a "user_shared"
   * service message. Available in private chats only
   */
  requestUsersButton (text: string, params: Interfaces.TelegramKeyboardButtonRequestUsers & ButtonStyleParams) {
    const button: Interfaces.TelegramKeyboardButton = {
      text,
      request_users: params
    }

    if (params.style) {
      button.style = params.style
    }

    if (params.iconCustomEmojiId) {
      button.icon_custom_emoji_id = params.iconCustomEmojiId
    }

    return this.addWideButton(button)
  }

  /**
   * if specified, pressing the button will open a list of suitable chats
   * tapping on a chat will send its identifier to the bot in a "chat_shared"
   * service message. Available in private chats only
   */
  requestChatButton (text: string, params: Interfaces.TelegramKeyboardButtonRequestChat & ButtonStyleParams) {
    const button: Interfaces.TelegramKeyboardButton = {
      text,
      request_chat: params
    }

    if (params.style) {
      button.style = params.style
    }

    if (params.iconCustomEmojiId) {
      button.icon_custom_emoji_id = params.iconCustomEmojiId
    }

    return this.addWideButton(button)
  }

  /**
   * the user's current location will be sent when the button is pressed
   *
   * available in private chats only
   */
  requestLocationButton (text: string, params?: ButtonStyleParams) {
    const button: Interfaces.TelegramKeyboardButton = {
      text,
      request_location: true
    }

    if (params?.style) {
      button.style = params.style
    }

    if (params?.iconCustomEmojiId) {
      button.icon_custom_emoji_id = params.iconCustomEmojiId
    }

    return this.addWideButton(button)
  }

  /**
   * the user will be asked to create a poll and send it to the bot
   * when the button is pressed
   *
   * available in private chats only
   */
  requestPollButton (text: string, params?: (Interfaces.TelegramPoll['type'] | { type?: Interfaces.TelegramPoll['type'] } & ButtonStyleParams)) {
    let type: Interfaces.TelegramPoll['type'] | undefined
    let styleParams: ButtonStyleParams | undefined

    if (typeof params === 'string') {
      type = params
    } else if (params) {
      type = params.type
      styleParams = params
    }

    const button: Interfaces.TelegramKeyboardButton = {
      text,
      request_poll: type === undefined ? {} : { type }
    }

    if (styleParams?.style) {
      button.style = styleParams.style
    }

    if (styleParams?.iconCustomEmojiId) {
      button.icon_custom_emoji_id = styleParams.iconCustomEmojiId
    }

    return this.addWideButton(button)
  }

  /**
   * the user's phone number will be sent as a contact when
   * the button is pressed
   *
   * available in private chats only
   */
  requestContactButton (text: string, params?: ButtonStyleParams) {
    const button: Interfaces.TelegramKeyboardButton = {
      text,
      request_contact: true
    }

    if (params?.style) {
      button.style = params.style
    }

    if (params?.iconCustomEmojiId) {
      button.icon_custom_emoji_id = params.iconCustomEmojiId
    }

    return this.addWideButton(button)
  }

  /**
   * the described Web App will be launched when the button is pressed
   * the Web App will be able to send a `web_app_data` service message
   *
   * available in private chats only
   */
  webAppButton (text: string, url: string, params?: ButtonStyleParams) {
    const button: Interfaces.TelegramKeyboardButton = {
      text,
      web_app: { url }
    }

    if (params?.style) {
      button.style = params.style
    }

    if (params?.iconCustomEmojiId) {
      button.icon_custom_emoji_id = params.iconCustomEmojiId
    }

    return this.addWideButton(button)
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

  /**
   * requests clients to hide the keyboard as soon as it's been used. The
   * keyboard will still be available, but clients will automatically display
   * the usual letter-keyboard in the chat — the user can press a special
   * button in the input field to see the custom keyboard again. Defaults to
   * `false`
   */
  oneTime (oneTime = true) {
    this.isOneTime = oneTime

    return this
  }

  /**
   * requests clients to resize the keyboard vertically for optimal fit (e.g.,
   * make the keyboard smaller if there are just two rows of buttons). Defaults
   * to `false`, in which case the custom keyboard is always of the same height
   * as the app's standard keyboard
   */
  resize (resize = true) {
    this.isResized = resize

    return this
  }

  /** use this parameter if you want to show the keyboard to specific users only */
  selective (selective = true) {
    this.isSelective = selective

    return this
  }

  /**
   * requests clients to always show the keyboard when the regular keyboard is
   * hidden. Defaults to `false`, in which case the custom keyboard can be
   * hidden and opened with a keyboard icon
   */
  persistent (persistent = true) {
    this.isPersistent = persistent

    return this
  }

  /** the placeholder to be shown in the input field when the keyboard is active */
  setPlaceholder (placeholder: string) {
    this.placeholder = placeholder

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
    const builder = new KeyboardBuilder()

    builder.rows = cloneButtons(this.rows)
    builder.currentRow = cloneButtons(this.currentRow)
    builder.isOneTime = this.isOneTime
    builder.isResized = this.isResized
    builder.isSelective = this.isSelective
    builder.isPersistent = this.isPersistent

    if (this.placeholder !== undefined) {
      builder.placeholder = this.placeholder
    }

    return builder
  }

  /** returns JSON which is compatible with Telegram's `ReplyKeyboardMarkup` interface */
  toJSON () {
    const buttons = this.currentRow.length !== 0
      ? [...this.rows, this.currentRow]
      : this.rows

    const json: Interfaces.TelegramReplyKeyboardMarkup = {
      keyboard: buttons,
      is_persistent: this.isPersistent,
      resize_keyboard: this.isResized,
      one_time_keyboard: this.isOneTime,
      selective: this.isSelective
    }

    if (this.placeholder !== undefined) {
      json.input_field_placeholder = this.placeholder
    }

    return json
  }

  toString () {
    return JSON.stringify(this)
  }

  private addButton (button: Interfaces.TelegramKeyboardButton) {
    this.currentRow.push(button)

    return this
  }

  private addWideButton (button: Interfaces.TelegramKeyboardButton) {
    if (this.currentRow.length !== 0) {
      this.row()
    }

    this.addButton(button)

    return this.row()
  }
}
