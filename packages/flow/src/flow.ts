import type { CallbackQueryUpdate, MessageUpdate, UpdateKindMap } from '@puregram/api'
import type { KVStorage } from '@puregram/storage'
import type { Telegram } from 'puregram'
import { createPlugin } from 'puregram/runtime'

import { createAugmentMiddleware } from './augment/middleware'
import { FlowPersistenceUnconfigured } from './errors'
import { MediaGroupBuffer } from './media-group/buffer'
import {
  persistentPrompt,
  persistentWaitFor,
  type PersistentPromptOptions,
  type PersistentWaitForOptions
} from './persistent/dispatch'
import { HandlerRegistry } from './persistent/handlers'
import { createPersistentMiddleware } from './persistent/middleware'
import type { FlowHandleConfig, PersistedFlow } from './persistent/types'
import { createPrompt, type PromptOptions } from './prompt'
import {
  createWaitForAny,
  type AnyWaiterSpec,
  type WaitForAnyOptions,
  type WaitForAnyResult,
  type WaitForAnyValueOf
} from './wait-for/any'
import { createWaitForMiddleware } from './wait-for/middleware'
import { WaiterRegistry } from './wait-for/registry'
import {
  buildCommandFilter,
  composeCallbackPredicate,
  composeMessageFilter,
  withFilter
} from './wait-for/sugar'
import type { WaitForOptions } from './wait-for/types'
import { Waiter } from './wait-for/waiter'

export interface FlowOptions {
  /** sliding window in ms used by `collectMediaGroup` to wait for further album messages (default 1000) */
  mediaGroupWindow?: number
  /** required for any flow.prompt({ id }) / flow.waitFor({ id }) usage */
  storage?: KVStorage<PersistedFlow>
  /** ms; applied if a call site does not pass `ttl`. absent + no per-call ttl = no expiry */
  defaultTtl?: number
}

export interface CollectMediaGroupOptions {
  /** override the plugin-level window for this call only */
  window?: number
}

/** options for `flow.waitForCallbackQuery` */
export interface WaitForCallbackQueryOptions
  extends Omit<WaitForOptions<'callback_query'>, 'filter'> {
  /** optional secondary predicate; AND-composed with the user-supplied predicate */
  filter?: (q: CallbackQueryUpdate) => boolean
}

/** options for `flow.waitForCommand` */
export interface WaitForCommandOptions
  extends Omit<WaitForOptions<'message'>, 'filter'> {
  /** optional secondary predicate; AND-composed with the command match */
  filter?: (m: MessageUpdate) => boolean
}

export interface FlowExtension {
  waitFor: <K extends keyof UpdateKindMap, T = UpdateKindMap[K]> (
    kind: K,
    options?: WaitForOptions<K, T> & { id?: string, payload?: unknown, ttl?: number, chatId?: number, fromId?: number }
  ) => Promise<T | null>
  /**
   * sugar over `waitFor('callback_query', { filter })`. `predicate` is matched
   * against the wrapped callback query; defaults to "any callback query".
   * accepts every `WaitForOptions` field via `opts` including `signal`
   */
  waitForCallbackQuery: (
    predicate?: (q: CallbackQueryUpdate) => boolean,
    options?: WaitForCallbackQueryOptions
  ) => Promise<CallbackQueryUpdate | null>
  /**
   * sugar over `waitFor('message', { filter })`. `name` is either a string
   * (matches messages whose text is `/name`, `/name@bot`, or `/name <args>`)
   * or a RegExp tested against the full message text
   */
  waitForCommand: (
    name: string | RegExp,
    options?: WaitForCommandOptions
  ) => Promise<MessageUpdate | null>
  /**
   * race a list of waiter specs; the first to match wins, the rest are
   * cancelled. `options.signal` cancels every waiter at once (use
   * `AbortSignal.timeout(ms)` for a shared deadline)
   */
  waitForAny: <S extends readonly AnyWaiterSpec[]> (
    specs: S,
    options?: WaitForAnyOptions
  ) => Promise<WaitForAnyResult<WaitForAnyValueOf<S[number]>>>
  prompt: <K extends keyof UpdateKindMap = 'message', T = UpdateKindMap[K]> (
    chat: number | string,
    text: string,
    options?: PromptOptions<K, T> & { id?: string, payload?: unknown, ttl?: number }
  ) => Promise<T | null>
  /**
   * collect every message that shares a `media_group_id` with `message` into one array.
   * resolves once a sliding window of inactivity passes (default 1000ms; override via
   * `flow({ mediaGroupWindow })` or per-call). resolves immediately with `[message]` when
   * `media_group_id` is absent
   */
  collectMediaGroup: (
    message: MessageUpdate,
    options?: CollectMediaGroupOptions
  ) => Promise<MessageUpdate[]>
  /** register a persistent flow handler — matched by `id` against persisted records on incoming updates */
  handle: <K extends keyof UpdateKindMap = 'message', T = UpdateKindMap[K]> (
    id: string,
    config: FlowHandleConfig<K, T>
  ) => void
  cancelAll: () => void
}

export function flow (options: FlowOptions = {}) {
  const defaultWindow = options.mediaGroupWindow ?? 1000
  const storage = options.storage
  const defaultTtl = options.defaultTtl

  return createPlugin({
    name: 'flow',
    install: (tg: Telegram) => {
      const registry = new WaiterRegistry()
      const buffer = new MediaGroupBuffer()
      const handlerRegistry = new HandlerRegistry()

      const inMemoryPrompt = createPrompt(tg, registry)
      const waitForAnyImpl = createWaitForAny(registry)

      const ext: FlowExtension = {
        waitFor: async <K extends keyof UpdateKindMap, T = UpdateKindMap[K]> (
          kind: K,
          opts: WaitForOptions<K, T> & {
            id?: string
            payload?: unknown
            ttl?: number
            chatId?: number
            fromId?: number
          } = {}
        ) => {
          if (opts.id !== undefined) {
            if (storage === undefined) {
              throw new FlowPersistenceUnconfigured()
            }

            const waitForOpts: PersistentWaitForOptions = { id: opts.id }

            if (opts.payload !== undefined) {
              waitForOpts.payload = opts.payload
            }

            if (opts.ttl !== undefined) {
              waitForOpts.ttl = opts.ttl
            }

            if (opts.chatId !== undefined) {
              waitForOpts.chatId = opts.chatId
            }

            if (opts.fromId !== undefined) {
              waitForOpts.fromId = opts.fromId
            }

            await persistentWaitFor(
              { storage, handlers: handlerRegistry, defaultTtl },
              kind,
              waitForOpts
            )

            return null
          }

          const waiter = new Waiter<K, T>(kind, opts)

          registry.register(waiter)

          return waiter.promise
        },
        waitForCallbackQuery: (predicate, sugarOpts = {}) => {
          const filter = composeCallbackPredicate(predicate, sugarOpts.filter)
          const waiter = new Waiter<'callback_query'>(
            'callback_query',
            withFilter<'callback_query'>(sugarOpts, filter)
          )

          registry.register(waiter)

          return waiter.promise
        },
        waitForCommand: (name, sugarOpts = {}) => {
          const filter = composeMessageFilter(buildCommandFilter(name), sugarOpts.filter)
          const waiter = new Waiter<'message'>(
            'message',
            withFilter<'message'>(sugarOpts, filter)
          )

          registry.register(waiter)

          return waiter.promise
        },
        waitForAny: waitForAnyImpl,
        prompt: async <K extends keyof UpdateKindMap = 'message', T = UpdateKindMap[K]> (
          chat: number | string,
          text: string,
          opts: PromptOptions<K, T> & { id?: string, payload?: unknown, ttl?: number } = {}
        ) => {
          if (opts.id !== undefined) {
            if (storage === undefined) {
              throw new FlowPersistenceUnconfigured()
            }

            const promptOpts: PersistentPromptOptions<K> = { id: opts.id }

            if (opts.payload !== undefined) {
              promptOpts.payload = opts.payload
            }

            if (opts.ttl !== undefined) {
              promptOpts.ttl = opts.ttl
            }

            if (opts.kind !== undefined) {
              promptOpts.kind = opts.kind
            }

            if (opts.from !== undefined) {
              promptOpts.from = opts.from
            }

            if (opts.reply_markup !== undefined) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              promptOpts.reply_markup = opts.reply_markup
            }

            await persistentPrompt<K>(
              tg,
              { storage, handlers: handlerRegistry, defaultTtl },
              chat,
              text,
              promptOpts
            )

            return null
          }

          return inMemoryPrompt<K, T>(chat, text, opts)
        },
        collectMediaGroup: (message, opts = {}) => {
          const id = message.raw.media_group_id

          if (id === undefined) {
            return Promise.resolve([message])
          }

          return buffer.collect(id, message, opts.window ?? defaultWindow)
        },
        handle: (id, config) => {
          handlerRegistry.register(id, config)
        },
        cancelAll: () => {
          registry.cancelAll()
        }
      }

      // augment must register before wait-for so an `update.flow.waitFor(...)` from inside
      // a high-priority handler still sees a fully-augmented update
      tg.useHook('onUpdate', createAugmentMiddleware(ext), { priority: 'high' })

      // persistent matcher runs before in-memory wait-for — persisted record wins over a
      // freshly-armed in-memory waiter for the same (chat, user, kind) triple
      if (storage !== undefined) {
        tg.useHook('onUpdate', createPersistentMiddleware({
          storage,
          handlers: handlerRegistry,
          tg,
          defaultTtl
        }), { priority: 'high' })
      }

      tg.useHook('onUpdate', createWaitForMiddleware(registry, tg), { priority: 'high' })
      tg.useHook('onShutdown', () => {
        registry.cancelAll()
        buffer.flushAll()
      })

      return ext
    }
  })
}
