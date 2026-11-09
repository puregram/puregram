import type { Telegram } from 'puregram'
import { createPlugin, type RequestContext } from 'puregram/runtime'

import { BucketRegistry, createWindow, type SlidingWindow } from './buckets'
import {
  DEFAULT_EXCLUDED_METHODS,
  DEFAULT_GLOBAL_PER_SEC,
  DEFAULT_PER_CHAT_PER_SEC,
  DEFAULT_PER_GROUP_PER_MIN,
  GLOBAL_WINDOW_MS,
  PER_CHAT_WINDOW_MS,
  PER_GROUP_WINDOW_MS
} from './constants'

/** error raised when `mode: 'drop'` rejects a queued request because the bucket queue is full */
export class ThrottlerDroppedError extends Error {
  /** the bot api method whose request was dropped */
  public readonly method: string
  /** which bucket overflowed — `global`, `chat:<id>`, or `group:<id>` */
  public readonly bucket: string

  constructor (method: string, bucket: string) {
    super(`throttler: dropped ${method} — queue full on ${bucket}`)
    this.name = 'ThrottlerDroppedError'
    this.method = method
    this.bucket = bucket
  }
}

/**
 * per-method override of the per-chat / per-group caps. unspecified fields fall back
 * to the top-level defaults. methods listed here get isolated buckets — `sendVideo`
 * stamps don't share a window with `sendMessage` even when both target the same chat
 */
export interface ThrottlerMethodLimits {
  /** per-private-chat cap for this method, in req/s. defaults to top-level `perChatPerSec` */
  perChatPerSec?: number
  /** per-group cap for this method, in req/min. defaults to top-level `perGroupPerMin` */
  perGroupPerMin?: number
}

/** options for the `throttler()` plugin factory */
export interface ThrottlerOptions {
  /** global cap across the bot — telegram tolerates roughly 30 req/s. default 30 */
  globalPerSec?: number
  /** per-private-chat cap — telegram tolerates ~1 message/s per private chat. default 1 */
  perChatPerSec?: number
  /** per-group cap — telegram tolerates ~20 msg/min per group/supergroup. default 20 */
  perGroupPerMin?: number
  /**
   * per-method overrides. methods listed here use isolated chat/group buckets with
   * the specified limits (unspecified fields fall back to the top-level defaults).
   * useful when a method needs stricter or looser pacing than the catch-all — e.g.
   * `sendVideo` at 0.2 req/s/chat vs `sendMessage` at 1 req/s/chat, or `forwardMessage`
   * at 5 req/s/chat. the global cap always applies on top
   */
  perMethod?: Record<string, ThrottlerMethodLimits>
  /** derive the chat id this request targets. default tries `params.chat_id` (number-shaped) */
  extractChatId?: (method: string, params: Record<string, unknown> | undefined) => number | undefined
  /** group detector — default treats `chatId < 0` as group (telegram convention) */
  extractIsGroup?: (chatId: number) => boolean
  /**
   * how many requests may be queued behind a single bucket before backpressure kicks in.
   * default `Infinity` — queue everything. counted independently per bucket
   */
  maxQueueDepth?: number
  /**
   * when `maxQueueDepth` is reached:
   * - `'queue'` (default): keep queuing anyway, depth grows past the cap
   * - `'drop'`: throw `ThrottlerDroppedError` synchronously from `onBeforeRequest`
   */
  mode?: 'queue' | 'drop'
  /** bot api methods that bypass throttling entirely. default covers control-plane calls */
  excludeMethods?: readonly string[]
}

/** handle attached as `tg.throttler` — observability into queue depth + manual sweep */
export interface ThrottlerExtension {
  /** count of pending acquires waiting on any bucket, for instrumentation */
  readonly pending: number
  /** number of distinct per-chat windows currently tracked */
  readonly chatWindows: number
  /** number of distinct per-group windows currently tracked */
  readonly groupWindows: number
  /** drop expired buckets — runs implicitly on every acquire; exposed for tests/observability */
  sweep: () => void
}

const defaultExtractChatId = (
  _method: string,
  params: Record<string, unknown> | undefined
) => {
  const ephemeral = params?.ephemeral_message_parameters as
    { receiver_user_id?: number, callback_query_id?: string } | undefined

  if (ephemeral?.callback_query_id !== undefined && ephemeral.receiver_user_id === undefined) {
    return undefined
  }

  const raw = params?.chat_id

  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw
  }

  if (typeof raw === 'string') {
    const n = Number(raw)

    return Number.isFinite(n) ? n : undefined
  }

  return undefined
}

const defaultExtractIsGroup = (chatId: number) => chatId < 0

const sleep = (ms: number) =>
  ms <= 0 ? Promise.resolve() : new Promise<void>(resolve => setTimeout(resolve, ms))

interface BucketHandle {
  readonly key: string
  readonly window: SlidingWindow
}

/**
 * outbound rate-limiting plugin. attaches an `onBeforeRequest` hook that
 * sleeps the caller until every relevant sliding-window bucket has a free slot
 *
 * sliding window per bucket — global, per-chat (private), per-group. each
 * bucket keeps recent acquire timestamps, drops expired ones, and either
 * sleeps until the oldest leaves the window or (in `drop` mode) throws
 * `ThrottlerDroppedError` when its queue cap is reached
 */
export function throttler (options: ThrottlerOptions = {}) {
  const globalPerSec = options.globalPerSec ?? DEFAULT_GLOBAL_PER_SEC
  const perChatPerSec = options.perChatPerSec ?? DEFAULT_PER_CHAT_PER_SEC
  const perGroupPerMin = options.perGroupPerMin ?? DEFAULT_PER_GROUP_PER_MIN
  const perMethod = options.perMethod ?? {}
  const extractChatId = options.extractChatId ?? defaultExtractChatId
  const extractIsGroup = options.extractIsGroup ?? defaultExtractIsGroup
  const maxQueueDepth = options.maxQueueDepth ?? Infinity
  const mode = options.mode ?? 'queue'
  const excluded = new Set(options.excludeMethods ?? DEFAULT_EXCLUDED_METHODS)

  const globalWindow = createWindow(globalPerSec, GLOBAL_WINDOW_MS)
  const chatRegistry = new BucketRegistry(perChatPerSec, PER_CHAT_WINDOW_MS)
  const groupRegistry = new BucketRegistry(perGroupPerMin, PER_GROUP_WINDOW_MS)

  // built lazily for methods listed in `perMethod`; sibling to the default registries
  // so methods with overrides don't share windows with the default buckets
  const methodChatRegistries = new Map<string, BucketRegistry>()
  const methodGroupRegistries = new Map<string, BucketRegistry>()

  const getMethodChatRegistry = (method: string) => {
    let reg = methodChatRegistries.get(method)

    if (reg === undefined) {
      const limit = perMethod[method]?.perChatPerSec ?? perChatPerSec

      reg = new BucketRegistry(limit, PER_CHAT_WINDOW_MS)
      methodChatRegistries.set(method, reg)
    }

    return reg
  }

  const getMethodGroupRegistry = (method: string) => {
    let reg = methodGroupRegistries.get(method)

    if (reg === undefined) {
      const limit = perMethod[method]?.perGroupPerMin ?? perGroupPerMin

      reg = new BucketRegistry(limit, PER_GROUP_WINDOW_MS)
      methodGroupRegistries.set(method, reg)
    }

    return reg
  }

  const queueDepth = new Map<string, number>()
  // per-bucket fifo mutex chain — head is the request holding the bucket
  const tail = new Map<string, Promise<void>>()

  let pending = 0

  const incQueue = (key: string) => {
    const d = (queueDepth.get(key) ?? 0) + 1

    queueDepth.set(key, d)

    return d
  }

  const decQueue = (key: string) => {
    const d = (queueDepth.get(key) ?? 1) - 1

    if (d <= 0) {
      queueDepth.delete(key)
    } else {
      queueDepth.set(key, d)
    }
  }

  /**
   * serialize callers behind `key`. each caller awaits the previous tail, runs
   * `body`, and chains its own resolver as the new tail. ensures sliding-window
   * decisions are made one-at-a-time per bucket
   */
  const withMutex = async <T>(key: string, body: () => Promise<T>) => {
    const prev = tail.get(key) ?? Promise.resolve()
    let release: () => void = () => {}
    const next = new Promise<void>((resolve) => {
      release = resolve
    })

    tail.set(key, next)

    try {
      await prev
    } catch {
      // previous body's failure must not poison the chain
    }

    try {
      return await body()
    } finally {
      release()

      if (tail.get(key) === next) {
        tail.delete(key)
      }
    }
  }

  /** acquire a slot on every bucket in order. returns once all windows have room and have recorded our hit */
  const acquire = async (method: string, handles: BucketHandle[]) => {
    for (const handle of handles) {
      if (mode === 'drop') {
        const depth = queueDepth.get(handle.key) ?? 0

        if (depth >= maxQueueDepth) {
          throw new ThrottlerDroppedError(method, handle.key)
        }
      }

      incQueue(handle.key)
      pending++

      try {
        await withMutex(handle.key, async () => {
          while (true) {
            const wait = handle.window.msUntilSlot(Date.now())

            if (wait === 0) {
              handle.window.record(Date.now())

              return
            }

            await sleep(wait)
          }
        })
      } finally {
        decQueue(handle.key)
        pending--
      }
    }
  }

  return createPlugin({
    name: 'throttler',
    install: (tg: Telegram) => {
      tg.useHook('onBeforeRequest', async (ctx: RequestContext, next) => {
        if (excluded.has(ctx.method)) {
          await next()

          return
        }

        const handles: BucketHandle[] = [
          { key: 'global', window: globalWindow }
        ]

        const chatId = extractChatId(ctx.method, ctx.params)

        if (chatId !== undefined) {
          const hasOverride = ctx.method in perMethod

          if (extractIsGroup(chatId)) {
            const registry = hasOverride ? getMethodGroupRegistry(ctx.method) : groupRegistry
            const key = hasOverride ? `${ctx.method}:group:${chatId}` : `group:${chatId}`

            handles.push({ key, window: registry.get(`group:${chatId}`) })
          } else {
            const registry = hasOverride ? getMethodChatRegistry(ctx.method) : chatRegistry
            const key = hasOverride ? `${ctx.method}:chat:${chatId}` : `chat:${chatId}`

            handles.push({ key, window: registry.get(`chat:${chatId}`) })
          }
        }

        await acquire(ctx.method, handles)
        await next()
      }, { priority: 'high' })

      const ext: ThrottlerExtension = {
        get pending () {
          return pending
        },
        get chatWindows () {
          let total = chatRegistry.count

          for (const reg of methodChatRegistries.values()) {
            total += reg.count
          }

          return total
        },
        get groupWindows () {
          let total = groupRegistry.count

          for (const reg of methodGroupRegistries.values()) {
            total += reg.count
          }

          return total
        },
        sweep: () => {
          const now = Date.now()

          chatRegistry.sweep(now)
          groupRegistry.sweep(now)

          for (const reg of methodChatRegistries.values()) {
            reg.sweep(now)
          }

          for (const reg of methodGroupRegistries.values()) {
            reg.sweep(now)
          }
        }
      }

      return ext
    }
  })
}
