import type {
  TelegramInputMediaAnimation,
  TelegramInputMediaAudio,
  TelegramInputMediaDocument,
  TelegramInputMediaPhoto,
  TelegramInputMediaVideo,
  TelegramMessage,
  WidgetInput,
  WidgetSendOptions
} from '@puregram/api'
import { widgetSendParams } from '@puregram/api'

import type { TelegramCore } from '../core'
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

/** declarations for the handcrafted shortcuts that aren't in the codegen'd `TelegramShortcuts` */
export interface ManualShortcuts {
  /**
   * polymorphic shortcut — dispatches to `sendPhoto`/`sendVideo`/`sendSticker`/…
   * based on `type`. accepts both real `InputMedia*` shapes and synthetic
   * sticker/video_note/voice shapes from `InputMedia.{sticker,videoNote,voice}(...)`
   *
   * @example
   * ```ts
   * tg.sendMedia(chat, InputMedia.photo({ media: MediaSource.path('cat.png'), caption: 'cat' }))
   * tg.sendMedia(chat, InputMedia.sticker({ media: MediaSource.fileId(stickerId) }))
   * ```
   */
  sendMedia: (
    chat: number | string,
    media: SendMediaQuery,
    params?: Record<string, unknown>
  ) => Promise<TelegramMessage>
}

/** copy `obj` excluding the named keys; preserves the typed `Omit` projection */
function omit<T extends object, K extends keyof T> (obj: T, keys: readonly K[]) {
  const result = { ...obj }

  for (const key of keys) {
    delete result[key]
  }

  return result
}

export function installShortcuts (tg: TelegramCore) {
  define(tg, 'send', function (this: TelegramCore, chat: number | string, text: string, params: Record<string, unknown> = {}) {
    return (this.api as any).sendMessage({ chat_id: chat, text, ...params })
  })

  define(tg, 'sendWidget', function<W extends WidgetInput> (
    this: TelegramCore,
    chat: number | string,
    widget: W,
    params?: WidgetSendOptions<W>
  ) {
    return this.api.sendWidget({ chat_id: chat, ...widgetSendParams(widget, params) })
  })

  define(tg, 'sendMedia', function (this: TelegramCore, chat: number | string, media: SendMediaQuery, params: Record<string, unknown> = {}) {
    // each branch narrows `media` to a single variant — surrogate `media` field
    // and discriminating `type` are stripped per branch
    switch (media.type) {
      case 'photo':
        return this.api.sendPhoto({ chat_id: chat, photo: media.media, ...omit(media, ['type', 'media']), ...params })
      case 'video':
        return this.api.sendVideo({ chat_id: chat, video: media.media, ...omit(media, ['type', 'media']), ...params })
      case 'document':
        return this.api.sendDocument({ chat_id: chat, document: media.media, ...omit(media, ['type', 'media']), ...params })
      case 'animation':
        return this.api.sendAnimation({ chat_id: chat, animation: media.media, ...omit(media, ['type', 'media']), ...params })
      case 'audio':
        return this.api.sendAudio({ chat_id: chat, audio: media.media, ...omit(media, ['type', 'media']), ...params })
      case 'sticker':
        return this.api.sendSticker({ chat_id: chat, sticker: media.media, ...omit(media, ['type', 'media']), ...params })
      case 'video_note':
        return this.api.sendVideoNote({ chat_id: chat, video_note: media.media, ...omit(media, ['type', 'media']), ...params })
      case 'voice':
        return this.api.sendVoice({ chat_id: chat, voice: media.media, ...omit(media, ['type', 'media']), ...params })
      default: {
        const exhaustive: never = media

        throw new TypeError(`tg.sendMedia: unsupported media type '${(exhaustive as { type: string }).type}'`)
      }
    }
  })

  define(tg, 'forward', function (this: TelegramCore, from: number | string, to: number | string, messageId: number, params: Record<string, unknown> = {}) {
    return (this.api as any).forwardMessage({ from_chat_id: from, chat_id: to, message_id: messageId, ...params })
  })

  define(tg, 'copy', function (this: TelegramCore, from: number | string, to: number | string, messageId: number, params: Record<string, unknown> = {}) {
    return (this.api as any).copyMessage({ from_chat_id: from, chat_id: to, message_id: messageId, ...params })
  })

  define(tg, 'delete', function (this: TelegramCore, chat: number | string, messageId: number) {
    return (this.api as any).deleteMessage({ chat_id: chat, message_id: messageId })
  })

  define(tg, 'pin', function (this: TelegramCore, chat: number | string, messageId: number, params: Record<string, unknown> = {}) {
    return (this.api as any).pinChatMessage({ chat_id: chat, message_id: messageId, ...params })
  })

  define(tg, 'unpin', function (this: TelegramCore, chat: number | string, messageId: number) {
    return (this.api as any).unpinChatMessage({ chat_id: chat, message_id: messageId })
  })

  define(tg, 'kick', function (this: TelegramCore, chat: number | string, user: number, params: Record<string, unknown> = {}) {
    return (this.api as any).banChatMember({ chat_id: chat, user_id: user, ...params })
  })

  define(tg, 'ban', function (this: TelegramCore, chat: number | string, user: number, params: Record<string, unknown> = {}) {
    return (this.api as any).banChatMember({ chat_id: chat, user_id: user, ...params })
  })

  define(tg, 'unban', function (this: TelegramCore, chat: number | string, user: number, params: Record<string, unknown> = {}) {
    return (this.api as any).unbanChatMember({ chat_id: chat, user_id: user, ...params })
  })

  define(tg, 'react', function (
    this: TelegramCore,
    chat: number | string,
    messageId: number,
    reactions: unknown,
    params: Record<string, unknown> = {}
  ) {
    return (this.api as any).setMessageReaction({
      chat_id: chat,
      message_id: messageId,
      reaction: reactions,
      ...params
    })
  })
}

function define (target: TelegramCore, name: string, fn: (...args: any[]) => unknown) {
  Object.defineProperty(Object.getPrototypeOf(target), name, {
    value: fn,
    writable: true,
    configurable: true,
    enumerable: false
  })
}
