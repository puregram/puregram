import { type UpdateKind, SERVICE_EVENT_ORDER, UPDATE_KINDS } from '@puregram/api'

const BOT_API_UPDATE_KINDS = UPDATE_KINDS.filter(
  kind => !(SERVICE_EVENT_ORDER as readonly string[]).includes(kind)
)

type MaybeArray<T> = T | readonly T[]

/**
 * helper for bot-api `allowed_updates`. telegram's default subscription
 * excludes opt-in kinds like `chat_member` and `business_message` — to receive
 * them you must list every desired kind explicitly. `UpdatesFilter.all()` returns
 * every kind; `UpdatesFilter.except(...)` returns everything-but-N
 *
 * @example
 * ```ts
 * const telegram = new Telegram({
 *   token: process.env.TOKEN,
 *   allowedUpdates: UpdatesFilter.all()
 * })
 *
 * await telegram.startPolling({
 *   allowedUpdates: UpdatesFilter.except(['business_connection', 'business_message'])
 * })
 * ```
 */
export class UpdatesFilter {
  /** every Bot API update field, including the opt-in ones */
  static all () {
    return [...BOT_API_UPDATE_KINDS]
  }

  /** every update kind except the listed ones */
  static except (kinds: MaybeArray<UpdateKind>) {
    const skip = new Set(Array.isArray(kinds) ? kinds : [kinds])

    return BOT_API_UPDATE_KINDS.filter(k => !skip.has(k))
  }
}
