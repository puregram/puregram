import {
  TELEGRAM_SHORTCUTS,
  widgetSendParams,
  wrapMessageResult,
  type MessageUpdate,
  type TelegramInputMediaAnimation,
  type TelegramInputMediaAudio,
  type TelegramInputMediaDocument,
  type TelegramInputMediaPhoto,
  type TelegramInputMediaVideo,
  type TelegramLike,
  type TelegramShortcuts,
  type WidgetInput,
  type WidgetSendOptions
} from '@puregram/api'

import type { ApiResponseError } from '../errors'
import type { InputMediaSticker, InputMediaVideoNote, InputMediaVoice } from '../factories'

/**
 * polymorphic media query for `tg.sendMedia(chat, media)` — dispatches to
 * `tg.api.sendX` based on `type`. real bot-api `InputMedia*` variants carry
 * `media`; synthetic sticker/video_note/voice variants reuse the same field name
 */
export type SendMediaQuery =
  | TelegramInputMediaPhoto
  | TelegramInputMediaVideo
  | TelegramInputMediaDocument
  | TelegramInputMediaAnimation
  | TelegramInputMediaAudio
  | InputMediaSticker
  | InputMediaVideoNote
  | InputMediaVoice

type SendMediaParams<S extends boolean> = Record<string, unknown> & { suppress?: S | undefined }

/** declarations for the handcrafted shortcuts that aren't in the codegen'd `TelegramShortcuts` */
export interface ManualShortcuts {
  /**
   * polymorphic shortcut — dispatches to `sendPhoto`/`sendVideo`/`sendSticker`/…
   * based on `type`. accepts both real `InputMedia*` shapes and synthetic
   * sticker/video_note/voice shapes from `InputMedia.{sticker,videoNote,voice}(...)`
   */
  sendMedia: {
    (chat: number | string, media: SendMediaQuery, params?: SendMediaParams<false>): Promise<MessageUpdate>
    (
      chat: number | string, media: SendMediaQuery, params?: SendMediaParams<boolean>
    ): Promise<MessageUpdate | ApiResponseError>
  }
}

function sendMedia (tg: TelegramLike, chat: number | string, media: SendMediaQuery, params?: Record<string, unknown>) {
  const { type, media: file, ...fields } = media

  switch (type) {
    case 'photo':
      return tg.api.sendPhoto({ chat_id: chat, photo: file, ...fields, ...params })
    case 'video':
      return tg.api.sendVideo({ chat_id: chat, video: file, ...fields, ...params })
    case 'document':
      return tg.api.sendDocument({ chat_id: chat, document: file, ...fields, ...params })
    case 'animation':
      return tg.api.sendAnimation({ chat_id: chat, animation: file, ...fields, ...params })
    case 'audio':
      return tg.api.sendAudio({ chat_id: chat, audio: file, ...fields, ...params })
    case 'sticker':
      return tg.api.sendSticker({ chat_id: chat, sticker: file, ...fields, ...params })
    case 'video_note':
      return tg.api.sendVideoNote({ chat_id: chat, video_note: file, ...fields, ...params })
    case 'voice':
      return tg.api.sendVoice({ chat_id: chat, voice: file, ...fields, ...params })
    default:
      throw new TypeError(`tg.sendMedia: unsupported media type '${String(type satisfies never)}'`)
  }
}

export function installShortcuts (tg: object) {
  for (const shortcut of TELEGRAM_SHORTCUTS) {
    define(tg, shortcut.verb, function (this: TelegramLike, ...args: unknown[]) {
      const params: Record<string, unknown> = {}

      for (const [index, name] of shortcut.args.entries()) {
        params[name] = args[index]
      }

      Object.assign(params, args[shortcut.args.length])

      const call = this.api[shortcut.method] as unknown as (
        params: Record<string, unknown>
      ) => Promise<unknown>

      const result = call(params)

      return shortcut.wrapsMessage ? result.then(raw => wrapMessageResult(raw, this)) : result
    })
  }

  define(tg, 'sendWidget', function<W extends WidgetInput> (
    this: TelegramLike, chat: number | string, widget: W, params?: WidgetSendOptions<W>
  ) {
    return this.api.sendWidget({ chat_id: chat, ...widgetSendParams(widget, params) })
      .then(result => wrapMessageResult(result, this))
  })

  define(tg, 'sendMedia', function (
    this: TelegramLike, chat: number | string, media: SendMediaQuery, params?: Record<string, unknown>
  ) {
    return sendMedia(this, chat, media, params).then(result => wrapMessageResult(result, this))
  })
}

function define<Args extends unknown[]> (
  target: object, name: keyof (TelegramShortcuts & ManualShortcuts), fn: (...args: Args) => unknown
) {
  Object.defineProperty(Object.getPrototypeOf(target), name, {
    value: fn,
    writable: true,
    configurable: true,
    enumerable: false
  })
}
