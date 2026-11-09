import type { ActionControllerParams, SendChatActionParams } from '@puregram/api'

import { ChatActionController } from './api/chat-action'
import type { DownloadTarget } from './api/download'
import {
  download as downloadHelper,
  downloadIterable as downloadIterableHelper,
  downloadStream as downloadStreamHelper,
  downloadToFile as downloadToFileHelper,
  getFileURL as getFileURLHelper
} from './api/download'
import { runRequest } from './api/lifecycle'
import { TelegramCore } from './core'
import { createDebug } from './debug'
import type { HttpClient } from './http/client'
import { defaultHttpClient } from './http/client'
import type { TelegramOptions, ResolvedTelegramOptions } from './options'
import { resolveOptions } from './options'
import { PollingTransport, type StartPollingOptions } from './transport/polling'
import type { WebhookOptions } from './transport/webhook'
import { nodeAdapter } from './transport/webhook/adapters/node'
import { createHandler as createWebhookHandler } from './transport/webhook/handler'
import {
  deleteWebhook as deleteWebhookHelper,
  type DeleteWebhookOptions,
  getWebhookInfo as getWebhookInfoHelper,
  setWebhook as setWebhookHelper,
  type SetWebhookOptions
} from './transport/webhook/helpers'
import type { StartWebhookOptions } from './transport/webhook/listener'
import { resolveWebhookOptions } from './transport/webhook/options'

export type { EphemeralScopeOptions } from './core'

const dispatchDebug = createDebug('puregram:dispatch')

export class Telegram<Ext = unknown> extends TelegramCore<Ext> {
  declare readonly options: ResolvedTelegramOptions
  protected readonly httpClient: HttpClient
  protected readonly seenUpdates = new Set<number>()
  protected polling: PollingTransport | undefined

  constructor (input: TelegramOptions) {
    const options = resolveOptions(input)

    super(options, dispatchDebug)
    this.httpClient = options.httpClient ?? defaultHttpClient
  }

  static fromToken (token: string, options: Partial<TelegramOptions> = {}) {
    return new Telegram({ token, ...options })
  }

  async shutdown () {
    if (!this.started && this.cleanups.length === 0) {
      return
    }

    this.polling?.stop()

    for (const cleanup of this.cleanups.splice(0)) {
      try {
        await cleanup()
      } catch (error) {
        dispatchDebug('cleanup threw during shutdown: %O', error)
      }
    }

    await this.hooks.run('onShutdown', { tg: this })
    await this.drainInFlight()
    this.started = false
    this.startPromise = undefined
  }

  async startPolling (options: StartPollingOptions = {}) {
    await this.start()

    this.polling ??= new PollingTransport({
      tg: this as Telegram,
      buildAndDispatch: rawUpdate => this.handleIncoming(rawUpdate),
      trackInFlight: (p) => {
        this.trackInFlight(p)
      },
      onError: (error, raw) => {
        this.reportDispatchError(error, raw)
      }
    })

    await this.polling.start(options)
  }

  stopPolling () {
    this.polling?.stop()
  }

  /**
   * framework-agnostic webhook handler consumed by `puregram/webhook/<framework>`
   * adapters. for raw `node:http` use `getWebhookCallback`
   */
  webhookHandler (options: WebhookOptions = {}) {
    return createWebhookHandler(resolveWebhookOptions(options), {
      dispatch: raw => this.handleIncoming(raw),
      trackInFlight: (p) => {
        this.trackInFlight(p)
      },
      ensureStarted: () => this.start(),
      reportError: (error, raw) => {
        this.reportDispatchError(error, raw)
      }
    })
  }

  /**
   * node `http`/`https` callback. for express/koa/fastify/hono/h3/elysia,
   * import the matching adapter from `puregram/webhook/<framework>`
   */
  getWebhookCallback (options: WebhookOptions = {}) {
    return nodeAdapter(this.webhookHandler(options), {
      ...(options.maxBodyBytes !== undefined && { maxBodyBytes: options.maxBodyBytes })
    })
  }

  /**
   * one-shot — starts the bot, calls `setWebhook`, and (when `port` is given)
   * spins up a built-in node `http` listener. `secretToken` is used both to
   * register the webhook and to validate incoming requests
   */
  async startWebhook (options: StartWebhookOptions) {
    await this.start()

    const { startWebhookListener } = await import('./transport/webhook/listener')
    const startup = await startWebhookListener(this as Telegram, options)

    if (startup.server !== undefined) {
      this.registerCleanup(startup.stop)
    }

    return startup
  }

  async setWebhook (options: SetWebhookOptions) {
    return setWebhookHelper(this as Telegram, options)
  }

  async deleteWebhook (options: DeleteWebhookOptions = {}) {
    return deleteWebhookHelper(this as Telegram, options)
  }

  async getWebhookInfo () {
    return getWebhookInfoHelper(this as Telegram)
  }

  /**
   * download a telegram file into a `Buffer`. accepts a raw `file_id`, any
   * `MediaSource.fileId(...)`, any wrapper or raw payload, plus `Photo` /
   * `TelegramPhotoSize[]` (largest auto-picked). other upload variants throw `TypeError`
   *
   * @example
   * ```ts
   * const bytes = await tg.download(update.document)
   * ```
   */
  async download (target: DownloadTarget) {
    return downloadHelper(this.downloadDeps(), target)
  }

  /** download a Telegram file as a node `Readable` */
  async downloadStream (target: DownloadTarget) {
    return downloadStreamHelper(this.downloadDeps(), target)
  }

  /** download a Telegram file as an async-iterable byte stream */
  async downloadIterable (target: DownloadTarget) {
    return downloadIterableHelper(this.downloadDeps(), target)
  }

  /** download a Telegram file straight to disk */
  async downloadToFile (path: string, target: DownloadTarget) {
    return downloadToFileHelper(this.downloadDeps(), path, target)
  }

  /** resolve the public download URL. calls `getFile` if needed — pass a resolved `File` to skip the round-trip */
  async getFileURL (target: DownloadTarget) {
    return getFileURLHelper(this.downloadDeps(), target)
  }

  /**
   * create a controller that re-sends `sendChatAction(action)` every `interval`
   * ms (default `5000`) until `stop()` is called — telegram clears the action
   * after ~5 seconds, so a long task needs it refreshed
   *
   * @example
   * ```ts
   * const controller = tg.createActionController(chatId, 'typing')
   * controller.start()
   * // ... long task ...
   * controller.stop()
   * ```
   */
  createActionController (chatId: number | string, action: SendChatActionParams['action'], options?: ActionControllerParams) {
    return new ChatActionController(this, chatId, action, options)
  }

  /**
   * run `fn` while continuously sending `sendChatAction(action)`. the action
   * auto-stops when `fn` settles — even if it throws — and `fn`'s result is
   * returned
   *
   * @example
   * ```ts
   * const photo = await tg.withChatAction(chatId, 'upload_photo', () => buildPhoto())
   * ```
   */
  async withChatAction <T> (chatId: number | string, action: SendChatActionParams['action'], fn: () => Promise<T> | T, options?: ActionControllerParams) {
    const controller = this.createActionController(chatId, action, options)

    controller.start()

    try {
      return await fn()
    } finally {
      controller.stop()
    }
  }

  async dropPendingUpdates (value?: boolean | string[]) {
    this.polling ??= new PollingTransport({
      tg: this as Telegram,
      buildAndDispatch: async () => {},
      trackInFlight: () => {},
      onError: (error, raw) => {
        this.reportDispatchError(error, raw)
      }
    })

    return this.polling.drop(value)
  }

  protected override async handleIncoming (raw: Record<string, unknown>) {
    if (this.options.dedupeUpdates !== false && this.isDuplicateUpdate(raw)) {
      return
    }

    await super.handleIncoming(raw)
  }

  protected isDuplicateUpdate (raw: Record<string, unknown>) {
    const id = raw.update_id

    if (typeof id !== 'number') {
      return false
    }

    if (this.seenUpdates.has(id)) {
      return true
    }

    // keep a bounded window of recent ids — evict oldest (insertion order) past the cap
    const configured = typeof this.options.dedupeUpdates === 'object' ? this.options.dedupeUpdates.max : undefined
    const max = configured ?? 1000

    this.seenUpdates.add(id)

    while (this.seenUpdates.size > max) {
      // Set.values() iterator-result `value` is typed `any` by the lib; the oldest key is always a number
      const oldest = this.seenUpdates.values().next().value as number | undefined

      if (oldest === undefined) {
        break
      }

      this.seenUpdates.delete(oldest)
    }

    return false
  }

  protected callApi (method: string, params?: Record<string, unknown>) {
    return runRequest({ options: this.options, hooks: this.hooks, httpClient: this.httpClient }, method, params)
  }

  protected override async bootstrap () {
    await super.bootstrap()

    if (!this.options.swallowDispatchErrors && !this.hooks.hasDispatchErrorHandler) {
      process.emitWarning(
        'no dispatch error handler registered — an error thrown inside an update handler will crash the process. register tg.catch(handler) or set swallowDispatchErrors: true',
        { code: 'PUREGRAM_NO_DISPATCH_ERROR_HANDLER' }
      )
    }
  }

  protected override async runRawUpdateHandlers (raw: Record<string, unknown>) {
    if (this.rawUpdateHandlers.length === 0) {
      return
    }

    for (const handler of this.rawUpdateHandlers) {
      try {
        await handler(raw)
      } catch (error) {
        this.reportDispatchError(error as Error, raw)
      }
    }
  }

  // with no onDispatchError handler: log via debug and rethrow on a microtask so node's
  // uncaughtException kicks in. `swallowDispatchErrors` suppresses that fallback
  protected reportDispatchError (error: Error, raw: Record<string, unknown>) {
    this.hooks.runDispatchError(error, { raw })
      .then((handled) => {
        if (!handled) {
          dispatchDebug('handler threw: %O', error)

          if (!this.options.swallowDispatchErrors) {
            rethrowAsync(error)
          }
        }
      })
      .catch((handlerError: unknown) => {
        if (!this.options.swallowDispatchErrors) {
          rethrowAsync(handlerError as Error)
        }
      })
  }

  private downloadDeps () {
    return {
      options: this.options,
      httpClient: this.httpClient,
      getFile: async (fileId: string) => this.api.getFile({ file_id: fileId })
    }
  }
}

function rethrowAsync (error: Error) {
  queueMicrotask(() => {
    throw error
  })
}
