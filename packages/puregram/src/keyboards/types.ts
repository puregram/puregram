import type { TelegramInlineKeyboardButton, TelegramKeyboardButton } from '@puregram/api'

export type MaybeArray<T> = T | T[]

export function cloneButtons<T> (buttons: T) {
  return JSON.parse(JSON.stringify(buttons)) as T
}

export type ButtonStyle = NonNullable<TelegramKeyboardButton['style']>

/** named constants for `ButtonStyle` — `ButtonStyle.Primary` and `'primary'` are interchangeable */
export const ButtonStyle = {
  Primary: 'primary',
  Danger: 'danger',
  Success: 'success'
} as const satisfies Record<string, ButtonStyle>

export interface ButtonStyleParams {
  style?: ButtonStyle
  iconCustomEmojiId?: string
}

/** `disabled` exists on `InlineKeyboardButton` only — reply-keyboard buttons have no such field */
export interface InlineButtonParams extends ButtonStyleParams {
  disabled?: boolean
}

export type CallbackData = string | number

export function normalizeCallbackData (data: CallbackData) {
  const str = typeof data === 'number' ? String(data) : data
  let bytes = 0

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i)

    if (code < 0x80) {
      bytes++
    } else if (code < 0x800) {
      bytes += 2
    } else if (code >= 0xd800 && code <= 0xdbff &&
               str.charCodeAt(i + 1) >= 0xdc00 && str.charCodeAt(i + 1) <= 0xdfff) {
      bytes += 4
      i++
    } else {
      bytes += 3
    }
  }

  if (bytes < 1 || bytes > 64) {
    throw new RangeError(`callback_data must be 1-64 bytes (got ${bytes})`)
  }

  return str
}

export function decorateInlineButton (button: TelegramInlineKeyboardButton, params: InlineButtonParams) {
  // telegram discards `disabled` whenever the button also carries an action, so the flag only
  // means anything if it replaces one — verified against the api, which reports a button edited
  // from {callback_data, disabled} to {callback_data} as "not modified"
  const out: TelegramInlineKeyboardButton = params.disabled === true
    ? { text: button.text, disabled: {} }
    : button

  if (params.style) {
    out.style = params.style
  }

  if (params.iconCustomEmojiId) {
    out.icon_custom_emoji_id = params.iconCustomEmojiId
  }

  return out
}
