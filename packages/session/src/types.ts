import type { UpdateKindMap } from '@puregram/api'
import type { KVStorage } from '@puregram/storage'
import type { CustomUpdate } from 'puregram/runtime'

/**
 * user-augmentable session shape. widen the typed surface of `update.session`
 * by declaration-merging fields onto SessionData:
 *
 * @example
 * ```ts
 * declare module '@puregram/session' {
 *   interface SessionData {
 *     counter: number
 *     user: { name: string }
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface -- user-augmentable
export interface SessionData {}

/** proxied session value handed to user code as `update.session` (resolved via await) */
export type SessionContext = SessionData & {
  $forceUpdate: () => Promise<void>
} & {
  [key: string]: unknown
}

export type AnyUpdate = UpdateKindMap[keyof UpdateKindMap] | CustomUpdate

/**
 * composite-key descriptor returned from {@link SessionOptions.getStorageKey}.
 * undefined segments are omitted, ordering is `user`, `chat`, `thread`, `key`
 *
 * @example
 * ```ts
 * session({ getStorageKey: (u) => ({ chat: u.chatId, thread: u.messageThreadId }) })
 * // → "chat:123:thread:7"
 * ```
 */
export interface StorageKeyDescriptor {
  /** user-scoped segment, prefixed `user:<id>` */
  user?: number | string | undefined
  /** chat-scoped segment, prefixed `chat:<id>` */
  chat?: number | string | undefined
  /** message-thread / forum-topic segment, prefixed `thread:<id>` */
  thread?: number | string | undefined
  /** free-form trailing segment, prefixed `key:<value>` */
  key?: number | string | undefined
}

export interface SessionOptions {
  /**
   * persistent backend; defaults to a fresh `MemoryStorage`. swap in
   * redis/sql/etc via any `KVStorage<unknown>` (or `TtlStorage` for sliding-window expiry)
   */
  storage?: KVStorage<unknown>
  /**
   * how to derive the storage key per update. returns either a raw string
   * (legacy mode), a {@link StorageKeyDescriptor} (composite key), or `undefined`
   * to skip session for that update
   *
   * default: `(u) => ({ chat: u.chat?.id, user: u.from?.id })` — chat-scoped per user
   */
  getStorageKey?: (update: AnyUpdate) => string | StorageKeyDescriptor | undefined
  /** initial session value when storage is empty (default: `() => ({})`) */
  initial?: (update: AnyUpdate) => SessionData
  /**
   * when `true` (default), `storage.get` is deferred until `update.session` is
   * accessed inside the handler. consumers `await update.session` to receive the
   * proxy. set `false` to keep the legacy eager-preload behavior (sync access
   * inside handlers) — required when plugins like `@puregram/scenes` rely on
   * synchronous `update.session.<key>` reads
   */
  lazy?: boolean
}
