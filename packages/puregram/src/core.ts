import type {
  Filter, GetBusinessAccountGiftsParams, GetChatGiftsParams, GetUserGiftsParams,
  MessageUpdate, TelegramDispatchers, TelegramEphemeralMessageParameters,
  TelegramShortcuts, TelegramUser
} from '@puregram/api'
import { and, CallbackQueryUpdate, defineFilter, isFilter, METHOD_PARAMS } from '@puregram/api'

import { cursorPaginator, offsetPaginator } from './api/paginate'
import type { ApiCaller, EphemeralScopedApi, TelegramApi } from './api/proxy'
import { createApiProxy } from './api/proxy'
import { installShortcuts, type ManualShortcuts } from './api/shortcuts'
import { CustomUpdateRegistry } from './dispatch/custom-updates'
import type { DispatchErrorHandler, ErrorHandler, HookOptions, Middleware, RequestContext, RequestHookName } from './dispatch/hooks'
import { HookRegistry } from './dispatch/hooks'
import { installDispatchers } from './dispatch/install-dispatchers'
import type { AnyUpdate, OnOptions, UpdateHandler, UpdatePredicate } from './dispatch/on'
import { Dispatcher } from './dispatch/on'
import { buildUpdate } from './dispatch/update-builder'
import type { ApiResponseError } from './errors'
import { callbackData as callbackQueryFilter } from './filters/callback'
import { command as commandFilter } from './filters/content'
import { when } from './filters/when'
import type { TelegramOptions } from './options'
import { resolveInstallOrder } from './plugins/installer'
import type { Plugin } from './plugins/plugin'
import { PluginRegistry } from './plugins/registry'

const CREATES_MESSAGE = /^(send|copy|forward)/

export type CoreOptions = Pick<TelegramOptions, 'bot' | 'defaultParams' | 'autoAnswerCallbackQuery'>

/** the ephemeral target `tg.ephemeral(…)` binds to every call */
export interface EphemeralScopeOptions {
  callbackQueryId?: string
  replaceCallbackQueryMessage?: boolean
}
export interface TelegramCore<Ext = unknown> extends TelegramShortcuts, TelegramDispatchers, ManualShortcuts {}

export abstract class TelegramCore<Ext = unknown> {
  readonly api: TelegramApi
  bot!: TelegramUser

  protected readonly hooks = new HookRegistry()
  protected readonly dispatcher = new Dispatcher()
  protected readonly customUpdates = new CustomUpdateRegistry()
  protected readonly plugins = new PluginRegistry()
  protected readonly pendingPlugins: Plugin<string, unknown, never>[] = []
  protected readonly rawUpdateHandlers: ((raw: Record<string, unknown>) => void | Promise<void>)[] = []
  protected readonly inFlight = new Set<Promise<void>>()
  protected readonly cleanups: (() => Promise<void>)[] = []
  protected started = false
  protected startPromise: Promise<void> | undefined
  private installingPlugins = false
  private readonly apiCaller: ApiCaller

  protected constructor (readonly options: CoreOptions = {}, debug?: (template: string, ...args: unknown[]) => void) {
    this.apiCaller = async (method, params) => {
      await this.settlePlugins()

      return this.callApi(method, params)
    }
    this.api = createApiProxy(this.apiCaller)

    if (options.bot) {
      this.bot = options.bot
    }

    installShortcuts(this)
    installDispatchers(this, this.dispatcher, debug)
  }

  // eslint-disable-next-line local-rules/no-redundant-return-type -- type predicate is needed for narrowing
  static isErrorResponse (value: unknown): value is ApiResponseError {
    return typeof value === 'object' && value !== null &&
      'ok' in value && (value as { ok: unknown }).ok === false &&
      'error_code' in value
  }

  extend<N extends string, Ext2> (
    plugin: Plugin<N, Ext2, this>
  ): this & Ext & { [K in N]: Awaited<Ext2> } {
    if (this.started || this.startPromise !== undefined) {
      throw new Error('cannot extend after .start() — plugins must be queued before start')
    }

    this.pendingPlugins.push(plugin)

    return this as this & Ext & { [K in N]: Awaited<Ext2> }
  }

  has (pluginName: string): boolean {
    return this.plugins.has(pluginName)
  }

  async start () {
    if (this.started) {
      return
    }

    // coalesce concurrent boots (webhook adapters fire start() per request)
    // clear the slot on failure so a later call can retry — one bad getMe shouldn't brick the bot
    if (this.startPromise === undefined) {
      this.startPromise = this.bootstrap().catch((error: unknown) => {
        this.startPromise = undefined

        throw error
      })
    }

    await this.startPromise
  }

  async shutdown () {
    if (!this.started && this.cleanups.length === 0) {
      return
    }

    for (const cleanup of this.cleanups.splice(0)) {
      await cleanup()
    }

    await this.hooks.run('onShutdown', { tg: this })
    await this.drainInFlight()
    this.started = false
    this.startPromise = undefined
  }

  /** register a cleanup callback to run on `shutdown()`. userland can hook teardown onto the bot's lifecycle */
  registerCleanup (fn: () => Promise<void>) {
    this.cleanups.push(fn)
  }

  /**
   * register a handler for a specific update kind by name. the typed `on*` dispatchers
   * (`onMessage`, `onCallbackQuery`, …) cover the bot-api's curated kind list with full
   * type narrowing; this method also routes to custom kinds registered via `defineUpdate`
   */
  on (kind: string, handler: UpdateHandler<AnyUpdate>, options?: OnOptions) {
    this.dispatcher.on(kind, handler as UpdateHandler, options?.priority ?? 'normal')

    return this
  }

  /**
   * register a cross-kind handler — fires for every supported update. the bare form
   * receives `AnyUpdate`; the filter form narrows via `Modify<AnyUpdate, Mod>`. use
   * this for multi-kind handlers or custom predicates that don't fit per-kind dispatchers
   *
   * @example
   * ```ts
   * tg.onUpdate((update) => console.log('[any]', update.kind))
   *
   * tg.onUpdate(
   *   (u): u is MessageUpdate => u.is('message') && u.hasText(),
   *   (m) => m.send(`echo: ${m.text}`)
   * )
   * ```
   */
  onUpdate (handler: UpdateHandler<AnyUpdate>, options?: OnOptions): this

  onUpdate<Base, Mod> (
    filter: Filter<Base, Mod>,
    handler: UpdateHandler<Base & Mod>,
    options?: OnOptions
  ): this

  onUpdate<T extends AnyUpdate> (
    predicate: (update: AnyUpdate) => update is T,
    handler: UpdateHandler<T>,
    options?: OnOptions
  ): this

  onUpdate (
    predicate: (update: AnyUpdate) => boolean | Promise<boolean>,
    handler: UpdateHandler<AnyUpdate>,
    options?: OnOptions
  ): this

  onUpdate (
    first: UpdateHandler<AnyUpdate> | UpdatePredicate,
    secondOrOptions?: UpdateHandler<AnyUpdate> | OnOptions,
    maybeOptions?: OnOptions
  ): this {
    if (typeof secondOrOptions === 'function') {
      const predicate = first as UpdatePredicate
      const handler = secondOrOptions
      const priority = maybeOptions?.priority ?? 'normal'

      this.dispatcher.add({
        type: 'predicate',
        predicate,
        handler: handler as UpdateHandler,
        priority
      })

      return this
    }

    const handler = first
    const priority = secondOrOptions?.priority ?? 'normal'

    this.dispatcher.add({
      type: 'predicate',
      predicate: () => true,
      handler: handler as UpdateHandler,
      priority
    })

    return this
  }

  /**
   * register a raw-update handler — fires before kind discrimination, so it sees
   * even unknown kinds that landed in bot-api ahead of our schema regen. handler
   * arg is the raw payload from polling/webhook. handy for forward-compat logging
   * or ingestion pipelines that want every update before wrapper allocation
   */
  onRawUpdate (handler: (raw: Record<string, unknown>) => void | Promise<void>) {
    this.rawUpdateHandlers.push(handler)

    return this
  }

  /**
   * register a command handler. string form matches `/hello`, `/hello arg`,
   * `/hello@bot`, or `/hello`-prefixed line break (Telegram conventions); regex form
   * runs against `message.text` directly. non-matching messages call `next()`.
   * matching messages get `match: RegExpMatchArray` attached for named captures
   *
   * @example
   * ```ts
   * tg.command(/^\/say(?:\s+(?<text>.+))?$/i, async (m) => {
   *   await m.send(m.match?.groups?.text ?? 'silence')
   * })
   * ```
   */
  command (
    nameOrPattern: string | RegExp,
    handler: UpdateHandler<MessageUpdate & { match?: RegExpMatchArray }>
  ) {
    // string form layers in a `@botname` mention check; regex form leaves @-validation to the caller
    const filter = typeof nameOrPattern === 'string'
      ? and(commandFilter(nameOrPattern), botMentionFilter(this))
      : commandFilter(nameOrPattern)

    return this.onMessage(filter, handler as never)
  }

  /**
   * register a handler against callback queries with matching data. string form is
   * equality on `update.raw.data`; regex form attaches `match: RegExpMatchArray` on success.
   * shorthand for `tg.onCallbackQuery(callbackData(value), handler)`
   *
   * @example
   * ```ts
   * tg.callbackQuery(/^buy:(?<sku>.+)$/, async (q) => {
   *   await q.answer({ text: `bought ${q.match?.groups?.sku}` })
   * })
   * ```
   */
  callbackQuery (
    value: string | RegExp,
    handler: UpdateHandler<CallbackQueryUpdate & { match?: RegExpMatchArray }>
  ) {
    const filter = callbackQueryFilter(value)

    return this.onCallbackQuery(filter, handler as never)
  }

  off (kind: string, handler: UpdateHandler): this {
    this.dispatcher.off(kind, handler)

    return this
  }

  /**
   * register a handler for errors thrown by dispatched update handlers — alias
   * for `useHook('onDispatchError', fn)`. when `swallowDispatchErrors` is true
   * in options, registered catch handlers are the only escape hatch (otherwise
   * unhandled errors rethrow on a microtask and trip `uncaughtException`)
   *
   * @example
   * ```ts
   * tg.catch((err, ctx) => {
   *   console.error('handler threw on update', ctx.raw.update_id, err)
   * })
   * ```
   */
  catch (handler: DispatchErrorHandler) {
    this.hooks.add('onDispatchError', handler)

    return this
  }

  useHook (name: RequestHookName, fn: Middleware<RequestContext>, options?: HookOptions): this
  useHook (name: 'onApiCall', fn: Middleware<RequestContext>, options?: HookOptions): this
  useHook (name: 'onUpdate', fn: Middleware<AnyUpdate>, options?: HookOptions): this
  useHook (name: 'onInit' | 'onShutdown', fn: Middleware<{ tg: unknown }>): this
  useHook (name: 'onError', fn: ErrorHandler): this
  useHook (name: 'onDispatchError', fn: DispatchErrorHandler): this
  /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */
  useHook (name: string, fn: any, options?: HookOptions): this {
    this.hooks.add(name as never, fn, options)

    return this
  }
  /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */

  /**
   * register a dispatch middleware — shorthand for `useHook('onUpdate', fn, options)`.
   * default priority `'normal'` runs before `tg.on(...)` handlers and after `'high'` middleware
   * (waitFor/session). the 2-arg form gates on a `Filter` (equivalent to `when(filter, mw)`)
   * and benefits from the same `kinds` fast-path as `tg.on(filter, …)`
   *
   * @example
   * ```ts
   * tg.use(async (update, next) => {
   *   const start = Date.now()
   *   await next()
   *   console.log(`update took ${Date.now() - start}ms`)
   * })
   *
   * tg.use(f.chat.private, async (u, next) => {
   *   console.log('[private]', u.kind)
   *   await next()
   * }, { priority: 'high' })
   * ```
   */
  use (fn: Middleware<AnyUpdate>, options?: HookOptions): this
  use<Base, Mod> (
    filter: Filter<Base, Mod>,
    mw: Middleware<Base & Mod>,
    options?: HookOptions
  ): this

  use (
    filterOrMw: Filter | Middleware<unknown>,
    mwOrOptions?: Middleware<unknown> | HookOptions,
    maybeOptions?: HookOptions
  ): this {
    if (isFilter(filterOrMw)) {
      const mw = mwOrOptions as Middleware<unknown>

      return this.useHook('onUpdate', when(filterOrMw, mw), maybeOptions)
    }

    return this.useHook('onUpdate', filterOrMw, mwOrOptions as HookOptions | undefined)
  }

  defineUpdate<N extends string> (kind: N) {
    this.customUpdates.define(kind)

    return this
  }

  async emit (kind: string, payload: Record<string, unknown>) {
    const update = this.customUpdates.build(kind, payload)

    try {
      await this.dispatch(update)
    } catch (error) {
      await this.reportDispatchError(error as Error, payload)
    }
  }

  resolveAllowedUpdates (value: string[] | 'auto') {
    if (value !== 'auto') {
      return value
    }

    const { kinds, opaque } = this.dispatcher.collectAllowedKinds()

    // can't confidently narrow (opaque predicate or no handlers) → telegram default subscription
    if (opaque || kinds.size === 0) {
      return []
    }

    return [...kinds]
  }

  iterUserProfilePhotos (userId: number, params: { offset?: number, limit?: number } = {}) {
    return offsetPaginator(async (offset, limit) => {
      const result = await this.api.getUserProfilePhotos({ user_id: userId, offset, limit })

      return { items: result.photos, total: result.total_count }
    }, params.offset, params.limit)
  }

  iterUserProfileAudios (userId: number, params: { offset?: number, limit?: number } = {}) {
    return offsetPaginator(async (offset, limit) => {
      const result = await this.api.getUserProfileAudios({ user_id: userId, offset, limit })

      return { items: result.audios, total: result.total_count }
    }, params.offset, params.limit)
  }

  iterStarTransactions (params: { offset?: number, limit?: number } = {}) {
    return offsetPaginator(async (offset, limit) => {
      const result = await this.api.getStarTransactions({ offset, limit })

      return { items: result.transactions, total: undefined }
    }, params.offset, params.limit)
  }

  iterUserGifts (userId: number, params: Omit<GetUserGiftsParams, 'user_id' | 'offset'> = {}) {
    return cursorPaginator(async (offset, limit) => {
      const result = await this.api.getUserGifts({ ...params, user_id: userId, offset, limit })

      return { items: result.gifts, total: result.total_count, next: result.next_offset }
    }, '', params.limit)
  }

  iterChatGifts (chatId: number | string, params: Omit<GetChatGiftsParams, 'chat_id' | 'offset'> = {}) {
    return cursorPaginator(async (offset, limit) => {
      const result = await this.api.getChatGifts({ ...params, chat_id: chatId, offset, limit })

      return { items: result.gifts, total: result.total_count, next: result.next_offset }
    }, '', params.limit)
  }

  iterBusinessAccountGifts (
    businessConnectionId: string,
    params: Omit<GetBusinessAccountGiftsParams, 'business_connection_id' | 'offset'> = {}
  ) {
    return cursorPaginator(async (offset, limit) => {
      const result = await this.api.getBusinessAccountGifts({
        ...params,
        business_connection_id: businessConnectionId,
        offset,
        limit
      })

      return { items: result.gifts, total: result.total_count, next: result.next_offset }
    }, '', params.limit)
  }

  /**
   * a scoped api proxy that injects `business_connection_id` into every call — act on behalf of a
   * connected business account. a call-site `business_connection_id` overrides the bound one.
   *
   * @example
   * ```ts
   * const biz = tg.business(connectionId)
   * await biz.sendMessage({ chat_id, text: 'on behalf of the account' })
   * ```
   */
  business (businessConnectionId: string) {
    return createApiProxy((method, params) =>
      this.apiCaller(method, { business_connection_id: businessConnectionId, ...params })
    )
  }

  /**
   * a scoped api proxy that injects the ephemeral target into every call — send group messages
   * visible only to one user. send-family methods receive `ephemeral_message_parameters`, the
   * `editEphemeralMessage*` / `deleteEphemeralMessage` family receives a flat `receiver_user_id`.
   * a method that creates a message but accepts neither (`sendDice`, `sendPoll`, `sendMediaGroup`,
   * `copyMessage`, …) throws rather than silently posting to the whole chat; methods that cannot
   * produce a message pass through untouched. call-site params override the bound ones field by
   * field. not chainable with `tg.business(…)` (both return flat api proxies) — pass
   * `business_connection_id` as a call-site param instead.
   *
   * @example
   * ```ts
   * const eph = tg.ephemeral(userId)
   * await eph.sendMessage({ chat_id, text: 'only you can see this' })
   * ```
   */
  ephemeral (options: EphemeralScopeOptions & { callbackQueryId: string }): EphemeralScopedApi<false>
  ephemeral (receiverUserId: number, options?: EphemeralScopeOptions): EphemeralScopedApi
  ephemeral (
    receiverOrOptions: number | (EphemeralScopeOptions & { callbackQueryId: string }),
    options: EphemeralScopeOptions = {}
  ) {
    const receiverUserId = typeof receiverOrOptions === 'number' ? receiverOrOptions : undefined
    const scope = typeof receiverOrOptions === 'number' ? options : receiverOrOptions
    const bound: TelegramEphemeralMessageParameters = {
      ...(receiverUserId === undefined ? {} : { receiver_user_id: receiverUserId }),
      ...(scope.callbackQueryId === undefined ? {} : { callback_query_id: scope.callbackQueryId }),
      ...(scope.replaceCallbackQueryMessage === undefined
        ? {}
        : { replace_callback_query_message: scope.replaceCallbackQueryMessage })
    }

    return createApiProxy((method, params) => {
      const accepted = METHOD_PARAMS[method]

      if (accepted?.includes('ephemeral_message_parameters')) {
        const callSite = params?.ephemeral_message_parameters as TelegramEphemeralMessageParameters | undefined

        return this.apiCaller(method, { ...params, ephemeral_message_parameters: { ...bound, ...callSite } })
      }

      if (receiverUserId !== undefined && accepted?.includes('receiver_user_id')) {
        return this.apiCaller(method, { receiver_user_id: receiverUserId, ...params })
      }

      if (accepted !== undefined && CREATES_MESSAGE.test(method) && accepted.includes('chat_id')) {
        throw new TypeError(
          `tg.ephemeral(…).${method} cannot be scoped — telegram has no ephemeral parameter for it, ` +
          'so the message would be visible to the whole chat. use tg.api.' + method + ' if that is intended'
        )
      }

      return this.apiCaller(method, params)
    }) as unknown as EphemeralScopedApi
  }

  protected async dispatch (update: AnyUpdate) {
    await this.hooks.runUpdate(update, async (_, next) => {
      await this.dispatcher.runUserHandlers(update)
      await next()
    })
  }

  protected async handleIncoming (raw: Record<string, unknown>) {
    await this.runRawUpdateHandlers(raw)

    const update = buildUpdate(raw, this) as AnyUpdate

    if (this.options.autoAnswerCallbackQuery !== undefined &&
        this.options.autoAnswerCallbackQuery !== false && update instanceof CallbackQueryUpdate) {
      await this.dispatchAutoAnswered(update)

      return
    }

    await this.dispatch(update)
  }

  // wrap update.answer so a handler call marks it answered; if none did, answer once after dispatch
  protected async dispatchAutoAnswered (update: CallbackQueryUpdate) {
    const original = update.answer.bind(update)
    let answered = false

    update.answer = (params = {}) => {
      answered = true

      return original(params)
    }

    try {
      await this.dispatch(update)
    } finally {
      if (!answered) {
        const fallback = this.options.autoAnswerCallbackQuery
        const params = typeof fallback === 'object' ? fallback : {}

        await original(params).catch(() => {})
      }
    }
  }

  protected async settlePlugins () {
    if (this.installingPlugins) {
      return
    }

    const order = resolveInstallOrder(this.pendingPlugins)

    this.installingPlugins = true

    try {
      for (const plugin of order) {
        if (this.plugins.has(plugin.name)) {
          continue
        }

        const install = plugin.install as (tg: this) => unknown
        const ext = await install.call(plugin, this)

        this.plugins.set(plugin.name, ext)
        Object.defineProperty(this, plugin.name, {
          value: ext, enumerable: true, configurable: false
        })
      }
    } finally {
      this.installingPlugins = false
    }
  }

  protected async bootstrap () {
    await this.settlePlugins()

    if (!this.bot) {
      this.bot = await this.api.getMe()
    }

    await this.hooks.run('onInit', { tg: this })
    this.started = true
  }

  protected trackInFlight (p: Promise<void>) {
    this.inFlight.add(p)
    // dispatchers wrap rejections themselves before reaching here, so this is purely cleanup
    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- see above
    p.finally(() => this.inFlight.delete(p))
  }

  protected async drainInFlight () {
    if (this.inFlight.size === 0) {
      return
    }

    await Promise.allSettled(this.inFlight)
  }

  protected async runRawUpdateHandlers (raw: Record<string, unknown>) {
    for (const handler of this.rawUpdateHandlers) {
      await handler(raw)
    }
  }

  protected abstract callApi (method: string, params?: Record<string, unknown>): Promise<unknown>
  protected abstract reportDispatchError (error: Error, raw: Record<string, unknown>): void | Promise<void>
}

// closes over `tg.bot.username` so `tg.command('foo')` validates `@bot` suffixes
// no-suffix commands accept any bot; unbound `f.command('foo')` skips this layer
function botMentionFilter (tg: TelegramCore) {
  return defineFilter<MessageUpdate>(
    'botMention',
    (update: unknown): update is MessageUpdate => {
      const mentioned = (update as { match?: RegExpMatchArray }).match?.groups?.mention

      if (mentioned === undefined) {
        return true
      }

      const ours = tg.bot?.username

      return ours !== undefined && mentioned.toLowerCase() === ours.toLowerCase()
    },
    { kinds: ['message'] }
  )
}

// `match` is populated by value/regex variants of content/callback/inline filters
// and by `tg.command(...)` — surfaced so handlers can read `update.match?.groups?.foo`
declare module '@puregram/api' {
  interface MessageUpdate {
    match?: RegExpMatchArray
  }

  interface EditedMessageUpdate {
    match?: RegExpMatchArray
  }

  interface ChannelPostUpdate {
    match?: RegExpMatchArray
  }

  interface EditedChannelPostUpdate {
    match?: RegExpMatchArray
  }

  interface BusinessMessageUpdate {
    match?: RegExpMatchArray
  }

  interface EditedBusinessMessageUpdate {
    match?: RegExpMatchArray
  }

  interface CallbackQueryUpdate {
    match?: RegExpMatchArray
  }

  interface InlineQueryUpdate {
    match?: RegExpMatchArray
  }

  interface ChosenInlineResultUpdate {
    match?: RegExpMatchArray
  }
}
