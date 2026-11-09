import { type KVStorage, MemoryStorage } from '@puregram/storage'
import { createPlugin } from 'puregram/runtime'

import { hit as coreHit, reset as coreReset } from './core'
import { composeKey, defaultGetStorageKey } from './key'
import type {
  AnyUpdate, RateLimitCallback, RateLimitCheckOptions, RateLimitEntry, RateLimitOptions, RateLimitOutcome
} from './types'

/**
 * `tg.rateLimit` extension. `check` gates an update on a per-call budget; `hit`
 * is the raw bucket primitive for custom keys (e.g. a global counter).
 * both return `null` when allowed, retry-after seconds when blocked
 */
export interface RateLimitExtension {
  /** gate an update on a per-call budget. doesn't invoke `onLimitExceeded` — imperative callers handle the response */
  check: (update: AnyUpdate, opts: RateLimitCheckOptions) => Promise<number | null>
  /** raw bucket access for custom keys outside the per-user model */
  hit: (key: string, limit: number, window: number) => Promise<number | null>
  /** drop the bucket for `key` */
  reset: (key: string) => Promise<void>
  /** the configured `KVStorage<RateLimitEntry>` instance */
  storage: KVStorage<RateLimitEntry>
  /** same key `check` would derive — for filter/middleware shims gating on the same key */
  resolveKey: (update: AnyUpdate, bucket?: string) => string | undefined
  /** plugin-level fallback callback — filter/middleware shims call it on block */
  onLimitExceeded: RateLimitCallback | undefined
}

const toRetryAfter = (outcome: RateLimitOutcome) =>
  outcome.allowed ? null : outcome.retryAfter

/**
 * per-user fixed-window rate limiting plugin. attaches `tg.rateLimit` but
 * registers no global middleware — gating is opt-in via `rateLimitFilter` /
 * `rateLimitMiddleware` shims or the imperative `tg.rateLimit.check(update, opts)`
 */
export function rateLimit (options: RateLimitOptions = {}) {
  const storage: KVStorage<RateLimitEntry> = options.storage ?? new MemoryStorage<RateLimitEntry>()
  const getStorageKey = options.getStorageKey ?? defaultGetStorageKey
  const onLimitExceeded = options.onLimitExceeded

  return createPlugin({
    name: 'rateLimit',
    install: () => {
      const hit = async (key: string, limit: number, window: number) =>
        toRetryAfter(await coreHit(storage, key, limit, window, Date.now()))

      const ext: RateLimitExtension = {
        check: async (update, opts) => {
          const userKey = getStorageKey(update)

          if (userKey === undefined) {
            return null
          }

          return hit(composeKey(userKey, opts.bucket), opts.limit, opts.window)
        },
        hit,
        reset: (key: string) => coreReset(storage, key),
        storage,
        resolveKey: (update, bucket) => {
          const userKey = getStorageKey(update)

          return userKey === undefined ? undefined : composeKey(userKey, bucket)
        },
        onLimitExceeded
      }

      return ext
    }
  })
}
