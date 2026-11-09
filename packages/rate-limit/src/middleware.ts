import type { Middleware, TelegramCore } from 'puregram/runtime'

import type { AnyUpdate, RateLimitCheckOptions } from './types'

interface TgWithRateLimit {
  rateLimit: {
    resolveKey: (update: unknown, bucket?: string) => string | undefined
    hit: (key: string, limit: number, window: number) => Promise<number | null>
    onLimitExceeded: ((update: unknown, retryAfter: number) => void | Promise<void>) | undefined
  }
}

/**
 * `onUpdate` middleware gating downstream handlers on a per-user budget.
 * on block, returns without calling `next()` — the update is silently swallowed.
 * `onLimitExceeded` (per-call > plugin-level) fires for side-effects.
 * unkeyable updates pass through; pair with `when(filter, …)` to scope the gate
 *
 * @example
 * ```ts
 * tg.use(when(kind.message, rateLimitMiddleware(tg, { limit: 5, window: 60 })))
 * ```
 */
export function rateLimitMiddleware (tg: TelegramCore, opts: RateLimitCheckOptions) {
  const target = tg as unknown as TgWithRateLimit

  const middleware: Middleware<AnyUpdate> = async (update, next) => {
    const key = target.rateLimit.resolveKey(update, opts.bucket)

    if (key === undefined) {
      await next()

      return
    }

    const retryAfter = await target.rateLimit.hit(key, opts.limit, opts.window)

    if (retryAfter === null) {
      await next()

      return
    }

    const onLimitExceeded = opts.onLimitExceeded ?? target.rateLimit.onLimitExceeded

    if (onLimitExceeded !== undefined) {
      await onLimitExceeded(update, retryAfter)
    }
  }

  return middleware
}
