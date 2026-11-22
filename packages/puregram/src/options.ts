import type { AnswerCallbackQueryParams, TelegramBotFullInfo } from '@puregram/api'

import type { DefaultParams } from './api/default-params'
import type { HttpClient } from './http/client'

/** failure classes the retry logic may act on — `flood` = 429+retry_after, `server` = api 5xx, `network` = transport */
export type RetryReason = 'flood' | 'server' | 'network'

/** opt-in auto-retry config — `true` => one retry on flood waits, no wait cap. object form overrides the knobs */
export interface RetryOnFloodWaitOptions {
  /** maximum number of retries on a single api call (default 1) */
  max?: number
  /** if `retry_after × 1000` exceeds this, propagate the error instead of sleeping (default Infinity) */
  maxWaitMs?: number
  /** which failure classes to retry. defaults to `['flood']`, preserving the original 429-only behavior */
  on?: RetryReason[]
  /** exponential backoff for `server`/`network` retries — `base × 2 ** attempt`, capped at `max` */
  backoff?: {
    /** first-retry delay in ms (default 3000) */
    base?: number
    /** maximum backoff delay in ms (default 3_600_000, one hour) */
    max?: number
  }
}

export interface TelegramOptions {
  token: string
  httpClient?: HttpClient
  /** pre-populate `tg.bot` and skip the start-time getMe call */
  bot?: TelegramBotFullInfo
  /** update kinds to subscribe to, or `'auto'` to derive the minimal set from registered handlers */
  allowedUpdates?: string[] | 'auto'
  apiBaseUrl?: string
  apiTimeout?: number
  apiWait?: number
  apiRetryLimit?: number
  apiHeaders?: Record<string, string>
  useTestDc?: boolean
  useLocal?: boolean
  /**
   * per-call params merged into every outgoing api call. `'*'` applies to any method
   * that accepts the param; a per-method key overrides `'*'`; an explicit call-site
   * value wins over both. set once here — there is no runtime setter
   */
  defaultParams?: DefaultParams
  /**
   * when the bot api answers with 429 + `parameters.retry_after`, sleep that many
   * seconds and retry the same call. defaults to `false` — opt-in to preserve
   * existing error propagation. pass an object to bound retries or wait time
   */
  retryOnFloodWait?: boolean | RetryOnFloodWaitOptions
  /**
   * when a dispatched update handler throws, the default behavior is to rethrow
   * on a microtask so node's `uncaughtException` kicks in. set to `true` to
   * suppress that fallback — errors only reach handlers registered via `tg.catch`
   */
  swallowDispatchErrors?: boolean
  /**
   * auto-answer `callback_query` updates after dispatch when no handler called `update.answer(...)`.
   * `true` answers with no params; an object answers with those params. defaults to `false`
   */
  autoAnswerCallbackQuery?: boolean | Omit<AnswerCallbackQueryParams, 'callback_query_id'>
  /**
   * drop updates whose `update_id` was seen recently (webhook retries, polling overlap). `true` keeps
   * the last 1000 ids; pass `{ max }` to size the window. defaults to `false`
   */
  dedupeUpdates?: boolean | { max?: number }
}

export interface ResolvedTelegramOptions extends Required<Omit<TelegramOptions, 'httpClient' | 'bot' | 'retryOnFloodWait' | 'swallowDispatchErrors'>> {
  httpClient: HttpClient | undefined
  bot?: TelegramBotFullInfo
  retryOnFloodWait: boolean | RetryOnFloodWaitOptions
  swallowDispatchErrors: boolean
}

// sourced from package.json so the user-agent never drifts from the published version.
// `getBuiltinModule` keeps node:fs off the import graph (core stays loadable on edge
// runtimes, degrading to an unversioned user-agent) without the top-level await that
// would make the whole graph un-require()able
let version = ''

try {
  const fs = process.getBuiltinModule?.('node:fs')

  if (fs) {
    const pkg: unknown = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

    if (pkg !== null && typeof pkg === 'object' && 'version' in pkg && typeof pkg.version === 'string') {
      version = pkg.version
    }
  }
} catch {
  // unreadable package.json — leave the version out of the user-agent
}

const USER_AGENT = version
  ? `puregram/${version} (+https://github.com/puregram/puregram)`
  : 'puregram (+https://github.com/puregram/puregram)'

export const DEFAULT_OPTIONS: Omit<ResolvedTelegramOptions, 'token' | 'httpClient'> = {
  allowedUpdates: [],
  apiBaseUrl: 'https://api.telegram.org/bot',
  apiTimeout: 30_000,
  apiWait: 3000,
  apiRetryLimit: -1,
  apiHeaders: {
    connection: 'keep-alive',
    'user-agent': USER_AGENT
  },
  useTestDc: false,
  useLocal: false,
  defaultParams: {},
  retryOnFloodWait: false,
  swallowDispatchErrors: false,
  autoAnswerCallbackQuery: false,
  dedupeUpdates: false
}

export function resolveOptions (input: TelegramOptions) {
  return {
    ...DEFAULT_OPTIONS,
    ...input,
    apiHeaders: { ...DEFAULT_OPTIONS.apiHeaders, ...(input.apiHeaders ?? {}) },
    httpClient: input.httpClient,
    bot: input.bot
  } as ResolvedTelegramOptions
}
