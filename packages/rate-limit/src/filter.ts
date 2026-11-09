import { defineAsyncFilter } from '@puregram/api'
import type { TelegramCore } from 'puregram/runtime'

import type { RateLimitCheckOptions } from './types'

interface TgWithRateLimit {
  rateLimit: {
    resolveKey: (update: unknown, bucket?: string) => string | undefined
    hit: (key: string, limit: number, window: number) => Promise<number | null>
    onLimitExceeded: ((update: unknown, retryAfter: number) => void | Promise<void>) | undefined
  }
}

const formatName = (opts: RateLimitCheckOptions) =>
  `rateLimit(${opts.limit}/${opts.window}s${opts.bucket ? `, bucket=${opts.bucket}` : ''})`

/**
 * async filter gating the chain on a per-user budget. matches when under budget;
 * on block returns false and invokes `onLimitExceeded` (per-call > plugin-level > no-op).
 * unkeyable updates pass through — never blocked
 *
 * **side-effecting filter** — writes to storage and may fire user callbacks.
 * compose it *last* in `and(...)` chains so cheaper structural filters short-circuit first
 *
 * @example
 * ```ts
 * tg.onMessage(and(command('/buy'), rateLimitFilter(tg, { limit: 5, window: 60 })), handler)
 * ```
 */
export function rateLimitFilter (tg: TelegramCore, opts: RateLimitCheckOptions) {
  const target = tg as unknown as TgWithRateLimit

  return defineAsyncFilter(formatName(opts), async (update) => {
    const key = target.rateLimit.resolveKey(update, opts.bucket)

    if (key === undefined) {
      return true
    }

    const retryAfter = await target.rateLimit.hit(key, opts.limit, opts.window)

    if (retryAfter === null) {
      return true
    }

    const onLimitExceeded = opts.onLimitExceeded ?? target.rateLimit.onLimitExceeded

    if (onLimitExceeded !== undefined) {
      await onLimitExceeded(update, retryAfter)
    }

    return false
  })
}
