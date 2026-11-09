import {
  BusinessMessageUpdate, ChannelPostUpdate, EditedBusinessMessageUpdate,
  EditedChannelPostUpdate, EditedMessageUpdate, MessageUpdate
} from '@puregram/api'
import type { TelegramMessage } from '@puregram/api'
import { createPlugin, type TelegramCore } from 'puregram/runtime'

import { DRAFT_IDS_PER_RUN } from './constants'
import { runStream, type RichDialect, type StreamApi, type StreamResult, type StreamStopController } from './core'
import type { ParseMode } from './formatted'
import { normalize, type StreamSource } from './normalize'

/** the two rich wire methods this plugin reaches for; `tg.api` satisfies it structurally */
interface RichApi {
  sendRichMessage: (params: Record<string, unknown>) => Promise<TelegramMessage>
  sendRichMessageDraft: (params: Record<string, unknown>) => Promise<unknown>
}

/** options accepted by both `tg.stream` and `update.stream` */
export interface StreamCallOptions {
  parseMode?: ParseMode
  rich?: boolean | RichDialect
  editIntervalMs?: number
  maxEditBackoff?: number
  thinkingPlaceholder?: boolean
  canStop?: boolean
  keepOnStop?: boolean
  draftIdOffset?: number
  signal?: AbortSignal
  message_thread_id?: number
  reply_parameters?: unknown
  link_preview_options?: unknown
  disable_notification?: boolean
  protect_content?: boolean
  reply_markup?: unknown
  onPiece?: (piece: { text: string }, draftId: number) => void
  onDraftFinalized?: (msg: TelegramMessage) => void
  onError?: (err: unknown) => void | Promise<void>
}

/** params passed to `tg.stream` — same as `StreamCallOptions` plus the chat id and source */
export interface StreamTgParams extends StreamCallOptions {
  chat_id: number
  source: StreamSource
}

/** snapshot of one in-flight run, as reported by `tg.stream.active` */
export interface ActiveStream {
  readonly chatId: number
  readonly drafts: number
  readonly canStop: boolean
  readonly stopped: boolean
}

/** `tg.stream` extension shape — exposed on the `Telegram` instance after the plugin is installed */
export interface StreamExtension {
  (params: StreamTgParams): Promise<StreamResult>
  readonly active: readonly ActiveStream[]
  stop: (chatId: number) => number
  stopAll: () => number
}

type StreamRun = (params: StreamTgParams) => Promise<StreamResult>

declare module '@puregram/api' {
  interface MessageUpdate {
    stream: (source: StreamSource, options?: StreamCallOptions) => Promise<StreamResult>
  }

  interface EditedMessageUpdate {
    stream: (source: StreamSource, options?: StreamCallOptions) => Promise<StreamResult>
  }

  interface ChannelPostUpdate {
    stream: (source: StreamSource, options?: StreamCallOptions) => Promise<StreamResult>
  }

  interface EditedChannelPostUpdate {
    stream: (source: StreamSource, options?: StreamCallOptions) => Promise<StreamResult>
  }

  interface BusinessMessageUpdate {
    stream: (source: StreamSource, options?: StreamCallOptions) => Promise<StreamResult>
  }

  interface EditedBusinessMessageUpdate {
    stream: (source: StreamSource, options?: StreamCallOptions) => Promise<StreamResult>
  }
}

interface PrivateGuardSource {
  raw: { chat: { id: number, type: string }, message_id: number }
}

function assertPrivate (chatType: string, chatId: number) {
  if (chatType !== 'private') {
    throw new Error(
      '[@puregram/stream] streaming relies on sendMessageDraft, which telegram only supports in private chats ' +
      `(got '${chatType}' for chat ${chatId}). send a regular message with tg.send / update.send in groups and channels`
    )
  }
}

function deriveOffsetFromMessage (raw: { message_id: number }) {
  return ((raw.message_id * DRAFT_IDS_PER_RUN) >>> 0)
}

interface StopUpdateLike {
  chat: { id: number }
  draftId: number
}

interface LiveRun extends StreamStopController {
  canStop: boolean
}

// dispatch hands hooks an UnsupportedUpdate for unknown kinds, and that class has no is()
function isStopUpdate (update: unknown): update is StopUpdateLike {
  if (typeof update !== 'object' || update === null || !('kind' in update)) {
    return false
  }

  return update.kind === 'stopped_message_generation'
}

/**
 * `@puregram/stream` plugin. installs `tg.stream({ chat_id, source, ... })` and
 * `update.stream(source, options?)` on every message-shaped update wrapper
 *
 * streaming is **private-chat only** — it builds on telegram's `sendMessageDraft`,
 * which telegram does not expose for groups or channels. calling `stream` for a
 * non-private chat throws; use `tg.send` / `update.send` there instead
 */
export function stream () {
  return createPlugin({
    name: 'stream',
    install: (tg: TelegramCore) => {
      const api = tg.api as unknown as StreamApi
      const richSource = tg.api as unknown as RichApi
      const richApi: StreamApi = {
        sendMessage: params => richSource.sendRichMessage(params),
        sendMessageDraft: params => richSource.sendRichMessageDraft(params)
      }
      const pickApi = (rich: boolean | RichDialect | undefined) => rich ? richApi : api

      const live = new Set<LiveRun>()

      const requestStop = (matches: (entry: LiveRun) => boolean) => {
        let stopped = 0

        for (const entry of live) {
          if (!matches(entry) || entry.stopped) {
            continue
          }

          entry.stopped = true
          entry.onStop?.()
          stopped += 1
        }

        return stopped
      }

      tg.useHook('onUpdate', async (update, next) => {
        if (isStopUpdate(update)) {
          const { chat, draftId } = update

          requestStop(entry => entry.canStop && entry.chatId === chat.id && entry.draftIds.has(draftId))
        }

        await next()
      }, { priority: 'high' })

      // `allowedUpdates: 'auto'` derives its subscription from registered handlers, not hooks.
      // a handler that skips next() halts the chain, so this one must pass through or it would
      // swallow the update from the bot's own onStoppedMessageGeneration
      tg.onStoppedMessageGeneration((_update, next) => next())

      const run = async (chatId: number, options: StreamCallOptions, source: StreamSource, offset: number) => {
        const { draftIdOffset, ...rest } = options
        const entry: LiveRun = {
          chatId,
          draftIds: new Set(),
          stopped: false,
          canStop: options.canStop === true
        }

        live.add(entry)

        try {
          return await runStream(pickApi(rest.rich), {
            ...rest,
            chatId,
            source: normalize(source),
            stop: entry,
            draftIdOffset: draftIdOffset ?? offset
          })
        } finally {
          live.delete(entry)
        }
      }

      let counter = 0
      const nextOffset = () => {
        const offset = counter

        // only separates tg.stream calls from each other: the Nth still aliases message_id N
        counter = (counter + DRAFT_IDS_PER_RUN) >>> 0

        return offset
      }

      const runFromTg: StreamRun = async (params) => {
        // tg.stream is out-of-context; caller passes a private chat id
        const { chat_id: chatId, source, ...rest } = params

        return run(chatId, rest, source, nextOffset())
      }

      // eslint-disable-next-line @typescript-eslint/naming-convention -- ctor refs are PascalCase classes
      const patchPrototype = (ctor: { prototype: object }) => {
        Object.defineProperty(ctor.prototype, 'stream', {
          value: function (this: PrivateGuardSource, source: StreamSource, options: StreamCallOptions = {}) {
            assertPrivate(this.raw.chat.type, this.raw.chat.id)

            return run(this.raw.chat.id, options, source, deriveOffsetFromMessage(this.raw))
          },
          writable: true,
          configurable: true,
          enumerable: false
        })
      }

      const targets = [
        MessageUpdate,
        EditedMessageUpdate,
        ChannelPostUpdate,
        EditedChannelPostUpdate,
        BusinessMessageUpdate,
        EditedBusinessMessageUpdate
      ]

      for (const target of targets) {
        patchPrototype(target)
      }

      const ext = Object.assign(runFromTg, {
        stop: (chatId: number) => requestStop(entry => entry.chatId === chatId),
        stopAll: () => requestStop(() => true)
      })

      Object.defineProperty(ext, 'active', {
        get: () => [...live].map(entry => ({
          chatId: entry.chatId,
          drafts: entry.draftIds.size,
          canStop: entry.canStop,
          stopped: entry.stopped
        })),
        enumerable: true
      })

      return ext as StreamExtension
    }
  })
}
