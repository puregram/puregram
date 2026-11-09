import { api } from 'sdk'

import { TelegramCore, resolveDownloadTarget } from 'puregram/runtime'
import type { CoreOptions, DownloadTarget } from 'puregram/runtime'

import { normalizeError, runRequest } from './request'

export interface ServerlessBotOptions extends CoreOptions {
  debug?: boolean | ((template: string, ...args: unknown[]) => void)
}

function debugToConsole (template: string, ...args: unknown[]) {
  let index = 0
  const text = template.replace(/%[sdifjoO%]/g, (token) => {
    if (token === '%%' || index >= args.length) {
      return token === '%%' ? '%' : token
    }

    const value = args[index++]

    if (token === '%d' || token === '%i' || token === '%f') {
      const number = Number(value)

      return String(token === '%i' ? Math.trunc(number) : number)
    }

    return typeof value === 'string' && token === '%s' ? value : JSON.stringify(value) ?? String(value)
  })

  console.debug(text, ...args.slice(index))
}

export interface WebAppUser {
  id: number
  is_bot?: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  added_to_attachment_menu?: boolean
  allows_write_to_pm?: boolean
  photo_url?: string
}

export interface WebAppChat {
  id: number
  type: 'group' | 'supergroup' | 'channel'
  title: string
  username?: string
  photo_url?: string
}

export interface WebAppInitData {
  query_id?: string
  user?: WebAppUser
  receiver?: WebAppUser
  chat?: WebAppChat
  chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel'
  chat_instance?: string
  start_param?: string
  can_send_after?: number
  auth_date: number
  hash: string
  signature?: string
}

export interface EndpointContext {
  initData: WebAppInitData
}

export type EndpointHandler = (input: Record<string, unknown>, ctx: EndpointContext) => unknown

export class ServerlessBot<Ext = unknown> extends TelegramCore<Ext> {
  private readonly debug: ((template: string, ...args: unknown[]) => void) | undefined
  private readonly endpoints = new Map<string, EndpointHandler>()

  constructor (options: ServerlessBotOptions = {}) {
    const debug = options.debug === true
      ? debugToConsole
      : typeof options.debug === 'function' ? options.debug : undefined

    super(options, debug)
    this.debug = debug
  }

  describeSubscriptions () {
    const { kinds, opaque } = this.dispatcher.collectAllowedKinds()

    return { updates: [...kinds], opaque, endpoints: [...this.endpoints.keys()] }
  }

  endpoint (name: string, handler: EndpointHandler) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
      throw new TypeError(`Endpoint name '${name}' must contain only letters, digits, and _, and must not start with a digit`)
    }

    if (this.endpoints.has(name)) {
      throw new TypeError(`Endpoint '${name}' is already registered`)
    }

    this.endpoints.set(name, handler)

    return this
  }

  async handleEndpoint (name: string, input: Record<string, unknown>, ctx: EndpointContext) {
    const handler = this.endpoints.get(name)

    if (handler === undefined) {
      throw new TypeError(`Endpoint '${name}' is not registered on this bot; rebuild after changing endpoints`)
    }

    await this.start()

    return await handler(input, ctx)
  }

  async handleUpdate (raw: unknown): Promise<void> {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw) ||
        !('update_id' in raw) || !Number.isSafeInteger(raw.update_id) || Number(raw.update_id) < 0) {
      throw new TypeError('handleUpdate expects an Update object with a non-negative integer update_id')
    }

    const update = raw as Record<string, unknown>

    await this.start()

    try {
      await this.handleIncoming(update)
    } catch (error) {
      await this.reportDispatchError(error as Error, update)
    }
  }

  async download (target: DownloadTarget) {
    try {
      return await api.getFileContent(resolveDownloadTarget(target).fileId)
    } catch (error) {
      throw normalizeError(error)
    }
  }

  async downloadIterable (target: DownloadTarget) {
    try {
      const { body } = await api.getFileStream(resolveDownloadTarget(target).fileId)

      return body
    } catch (error) {
      throw normalizeError(error)
    }
  }

  downloadStream () {
    throw new TypeError('Node streams are unavailable in Telegram Serverless; use downloadIterable instead')
  }

  downloadToFile () {
    throw new TypeError('Filesystem downloads are unavailable in Telegram Serverless; use download or downloadIterable instead')
  }

  getFileURL () {
    throw new TypeError('Telegram Serverless does not expose token-bearing file URLs; use download or downloadIterable instead')
  }

  createActionController () {
    throw new TypeError('Recurring chat actions require timers unavailable in Telegram Serverless; send a single chat action instead')
  }

  withChatAction () {
    throw new TypeError('Recurring chat actions require timers unavailable in Telegram Serverless; send a single chat action instead')
  }

  protected callApi (method: string, params?: Record<string, unknown>) {
    return runRequest(this.hooks, this.options.defaultParams, method, params, this.debug)
  }

  protected async reportDispatchError (error: Error, raw: Record<string, unknown>) {
    if (!await this.hooks.runDispatchError(error, { raw })) {
      throw error
    }
  }
}

export function createBot (options: ServerlessBotOptions = {}) {
  return new ServerlessBot(options)
}
