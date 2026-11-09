import type * as Interfaces from '@puregram/api'

import { RemoveKeyboard } from './remove'
import type { ButtonStyleParams, MaybeArray } from './types'
import { cloneButtons } from './types'

/** keyboard */
export class Keyboard {
  /** returns an "empty" keyboard (literally a `RemoveKeyboard` alias) */
  static empty = new RemoveKeyboard()

  private buttons: Interfaces.TelegramKeyboardButton[][] = []
  private isResized = false
  private isOneTime = false
  private isSelective = false
  private isPersistent = false
  private isForceReply = false
  private placeholder?: string

  constructor (rows: MaybeArray<Interfaces.TelegramKeyboardButton | string>[] = []) {
    for (const row of rows) {
      this.addRow(row)
    }
  }

  get [Symbol.toStringTag] () {
    return this.constructor.name
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

  /** "Removes" a keyboard (literally a `RemoveKeyboard` alias) */
  static remove () {
    return Keyboard.empty
  }

  /** assemble a builder of buttons */
  static keyboard (rows: MaybeArray<Interfaces.TelegramKeyboardButton | string>[]) {
    return new Keyboard(rows)
  }

  /** construct a `Keyboard` from an existing `ReplyKeyboardMarkup` JSON */
  static from (markup: Interfaces.TelegramReplyKeyboardMarkup) {
    const keyboard = new Keyboard()

    keyboard.buttons = cloneButtons(markup.keyboard)
    keyboard.isResized = markup.resize_keyboard ?? false
    keyboard.isOneTime = markup.one_time_keyboard ?? false
    keyboard.isSelective = markup.selective ?? false
    keyboard.isPersistent = markup.is_persistent ?? false

    if (markup.input_field_placeholder !== undefined) {
      keyboard.placeholder = markup.input_field_placeholder
    }

    return keyboard
  }

  /**
   * generates text button
   * if none of the optional fields are used,
   * it will be sent as a message when the button is pressed
   */
  static textButton (text: string, params?: ButtonStyleParams) {
    const button: Interfaces.TelegramKeyboardButton = { text }

    if (params?.style) {
      button.style = params.style
    }

    if (params?.iconCustomEmojiId) {
      button.icon_custom_emoji_id = params.iconCustomEmojiId
    }

    return button
  }

  /** an alias for `textButton` */
  static text (text: string, params?: ButtonStyleParams) {
    return Keyboard.textButton(text, params)
  }

  /**
   * if specified, pressing the button will open a list of suitable users
   * tapping on any user will send their identifier to the bot in a "user_shared"
   * service message. Available in private chats only
   */
  static requestUsersButton (text: string, params: Interfaces.TelegramKeyboardButtonRequestUsers & ButtonStyleParams) {
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

    return button
  }

  /** an alias for `requestUsersButton` */
  static requestUsers (text: string, params: Interfaces.TelegramKeyboardButtonRequestUsers & ButtonStyleParams) {
    return Keyboard.requestUsersButton(text, params)
  }

  /**
   * if specified, pressing the button will open a list of suitable chats
   * tapping on a chat will send its identifier to the bot in a "chat_shared"
   * service message. Available in private chats only
   */
  static requestChatButton (text: string, params: Interfaces.TelegramKeyboardButtonRequestChat & ButtonStyleParams) {
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

    return button
  }

  /** an alias for `requestChatButton` */
  static requestChat (text: string, params: Interfaces.TelegramKeyboardButtonRequestChat & ButtonStyleParams) {
    return Keyboard.requestChatButton(text, params)
  }

  /**
   * the user's phone number will be sent as a contact when
   * the button is pressed
   *
   * available in private chats only
   */
  static requestContactButton (text: string, params?: ButtonStyleParams) {
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

    return button
  }

  /** an alias for `requestContactButton` */
  static requestContact (text: string, params?: ButtonStyleParams) {
    return Keyboard.requestContactButton(text, params)
  }

  /**
   * the user's current location will be sent when the button is pressed
   *
   * available in private chats only
   */
  static requestLocationButton (text: string, params?: ButtonStyleParams) {
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

    return button
  }

  /** an alias for `requestLocationButton` */
  static requestLocation (text: string, params?: ButtonStyleParams) {
    return Keyboard.requestLocationButton(text, params)
  }

  /**
   * the user will be asked to create a poll and send it to the bot
   * when the button is pressed
   *
   * available in private chats only
   */
  static requestPollButton (text: string, params?: (Interfaces.TelegramPoll['type'] | { type?: Interfaces.TelegramPoll['type'] } & ButtonStyleParams)) {
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

    return button
  }

  /** an alias for `requestPollButton` */
  static requestPoll (text: string, params?: (Interfaces.TelegramPoll['type'] | { type?: Interfaces.TelegramPoll['type'] } & ButtonStyleParams)) {
    return Keyboard.requestPollButton(text, params)
  }

  /**
   * the described Web App will be launched when the button is pressed
   * the Web App will be able to send a `web_app_data` service message
   *
   * available in private chats only
   */
  static webAppButton (text: string, url: string, params?: ButtonStyleParams) {
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

    return button
  }

  /** an alias for `webAppButton` */
  static webApp (text: string, url: string, params?: ButtonStyleParams) {
    return Keyboard.webAppButton(text, url, params)
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

  /**
   * requests clients to show a reply interface to the user together with the keyboard, as if the
   * user had selected the bot's message and tapped 'reply'
   */
  forceReply (forceReply = true) {
    this.isForceReply = forceReply

    return this
  }

  /** the placeholder to be shown in the input field when the keyboard is active */
  setPlaceholder (placeholder: string) {
    this.placeholder = placeholder

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

  /** returns JSON which is compatible with Telegram's `ReplyKeyboardMarkup` interface */
  toJSON () {
    const json: Interfaces.TelegramReplyKeyboardMarkup = {
      keyboard: this.buttons,
      is_persistent: this.isPersistent,
      resize_keyboard: this.isResized,
      one_time_keyboard: this.isOneTime,
      selective: this.isSelective
    }

    if (this.placeholder !== undefined) {
      json.input_field_placeholder = this.placeholder
    }

    if (this.isForceReply) {
      json.force_reply = true
    }

    return json
  }

  /** deletes a button with the specified payload */
  delete (text: string) {
    const rowIndex = this.buttons.findIndex(row => row.findIndex(button => button.text === text) !== -1)

    if (rowIndex === -1) {
      return this
    }

    const row = this.buttons[rowIndex]

    if (!row) {
      return this
    }

    const buttonIndex = row.findIndex(button => button.text === text)

    row.splice(buttonIndex, 1)

    if (row.length === 0) {
      this.buttons.splice(rowIndex, 1)
    }

    return this
  }

  /** clones the keyboard (creates a new one with the same set of buttons) */
  clone () {
    const cloned = new Keyboard()

    cloned.buttons = cloneButtons(this.buttons)
    cloned.isResized = this.isResized
    cloned.isOneTime = this.isOneTime
    cloned.isSelective = this.isSelective
    cloned.isPersistent = this.isPersistent

    if (this.placeholder !== undefined) {
      cloned.placeholder = this.placeholder
    }

    return cloned
  }

  toString () {
    return JSON.stringify(this)
  }

  private addRow (row: MaybeArray<Interfaces.TelegramKeyboardButton | string>) {
    if (!Array.isArray(row)) {
      row = [row]
    }

    this.buttons.push(row.map(e => typeof e === 'string' ? Keyboard.textButton(e) : e))

    return this
  }
}
