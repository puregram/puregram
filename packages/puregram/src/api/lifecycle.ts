import { inspect } from 'node:util'

import type { TelegramResponseParameters } from '@puregram/api'
import { METHOD_PARAMS, WEBHOOK_REPLY_SAFE_METHODS } from '@puregram/api'

import { createDebug } from '../debug'
import type { HookRegistry, RequestContext } from '../dispatch/hooks'
import { ApiError } from '../errors'
import type { HttpClient } from '../http/client'
import { needsMultipart, buildSimpleMultipart, buildMediaGroupMultipart, rewriteRichMessage } from '../http/multipart'
import type { ResolvedTelegramOptions, RetryOnFloodWaitOptions } from '../options'
import { replyAls } from '../transport/webhook/reply'

import { mergeDefaultParams } from './default-params'

const debug = createDebug('puregram:api')
// full request params + raw response body — noisy, lives on its own child namespace
// `puregram:*` / `puregram:api:raw` switch it on; plain `puregram:api` stays terse
const debugRaw = debug.extend('raw')

export interface RunRequestDeps {
  options: ResolvedTelegramOptions
  hooks: HookRegistry
  httpClient: HttpClient
}

interface ApiResponseOk {
  ok: true
  result: unknown
}
interface ApiResponseErr {
  ok: false
  error_code: number
  description: string
  parameters?: TelegramResponseParameters
}
type ApiResponseUnion = ApiResponseOk | ApiResponseErr

export async function runRequest (
  deps: RunRequestDeps,
  method: string,
  rawParams: Record<string, unknown> | undefined
) {
  const params = mergeDefaultParams(deps.options.defaultParams, method, rawParams, METHOD_PARAMS[method])
  const retry = resolveRetry(deps.options.retryOnFloodWait)
  let attempt = 0

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await runOnce(deps, method, params)
    } catch (error) {
      if (retry === undefined || attempt >= retry.max) {
        throw error
      }

      const waitMs = retryWaitMs(error, retry, attempt)

      if (waitMs === undefined) {
        throw error
      }

      attempt += 1

      debug('retry %d for %s in %dms', attempt, method, waitMs)
      await sleep(waitMs)
    }
  }
}

function resolveRetry (input: ResolvedTelegramOptions['retryOnFloodWait']) {
  if (input === false || input === undefined) {
    return undefined
  }

  const config: RetryOnFloodWaitOptions = input === true ? {} : input
  const reasons = config.on ?? ['flood']

  return {
    max: config.max ?? 1,
    maxWaitMs: config.maxWaitMs ?? Infinity,
    flood: reasons.includes('flood'),
    server: reasons.includes('server'),
    network: reasons.includes('network'),
    backoffBase: config.backoff?.base ?? 3000,
    backoffMax: config.backoff?.max ?? 3_600_000
  }
}

type ResolvedRetry = NonNullable<ReturnType<typeof resolveRetry>>

// exponential backoff for server/network retries — base, 2×base, 4×base, … capped at backoffMax
function backoffMs (retry: ResolvedRetry, attempt: number) {
  return Math.min(retry.backoffBase * 2 ** attempt, retry.backoffMax)
}

function retryWaitMs (error: unknown, retry: ResolvedRetry, attempt: number) {
  if (error instanceof ApiError && error.code === 429) {
    if (!retry.flood) {
      return undefined
    }

    const retryAfter = error.parameters?.retry_after

    if (typeof retryAfter !== 'number') {
      return undefined
    }

    const waitMs = retryAfter * 1000

    return waitMs > retry.maxWaitMs ? undefined : waitMs
  }

  if (error instanceof ApiError) {
    return error.code >= 500 && retry.server ? backoffMs(retry, attempt) : undefined
  }

  return retry.network ? backoffMs(retry, attempt) : undefined
}

function sleep (ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

async function runOnce (
  deps: RunRequestDeps,
  method: string,
  rawParams: Record<string, unknown> | undefined
) {
  let params = { ...(rawParams ?? {}) }
  const suppress = params.suppress === true

  delete params.suppress

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), deps.options.apiTimeout)

  const ctx: RequestContext = { method, params, init: { method: 'GET', signal: controller.signal } }

  try {
    await deps.hooks.run('onBeforeRequest', ctx)

    params = ctx.params ?? {}

    let richFiles: Map<string, unknown> | undefined

    if ('rich_message' in params) {
      const rewrite = await rewriteRichMessage(params, deps.options.useLocal)

      params = rewrite.params
      ctx.params = params
      richFiles = rewrite.files.size > 0 ? rewrite.files : undefined
    }

    // webhook-reply optimization — methods returning `true` ride the 200 body, invisible to callers
    // skip when `suppress` (needs real error shape) or multipart (can't serialize as json)
    const slot = replyAls.getStore()

    if (slot !== undefined && !slot.consumed && !suppress &&
        WEBHOOK_REPLY_SAFE_METHODS.has(method) &&
        richFiles === undefined && !('media' in params) && !needsMultipart(params)) {
      if (slot.tryClaim(method, params)) {
        return true
      }
    }

    if ('media' in params) {
      const { body, headers } = await buildMediaGroupMultipart(params, deps.options.useLocal, richFiles)

      ctx.init = { method: 'POST', body, signal: controller.signal, headers, duplex: 'half' } as unknown as RequestInit
    } else if (richFiles !== undefined || needsMultipart(params)) {
      const { body, headers } = await buildSimpleMultipart(params, deps.options.useLocal, richFiles)

      ctx.init = { method: 'POST', body, signal: controller.signal, headers, duplex: 'half' } as unknown as RequestInit
    }

    const url = buildUrl(deps.options, method, ctx.init?.method === 'POST' ? undefined : params)

    ctx.url = url

    await deps.hooks.run('onRequestIntercept', ctx)

    debug('-> %s', method)

    if (debugRaw.enabled) {
      debugRaw('-> %s %s', method, inspect(params, { depth: null }))
    }

    return await deps.hooks.runApiCall(ctx, async () => {
      const response = await deps.httpClient.request({ url, init: ctx.init ?? {} })
      let json = await response.json() as ApiResponseUnion

      ctx.response = { status: response.status }
      ctx.json = json

      await deps.hooks.run('onResponseIntercept', ctx)
      json = ctx.json as ApiResponseUnion

      if (json.ok) {
        debug('<- %s ok=true', method)
      } else {
        debug('<- %s ok=false error_code=%s description=%s', method, json.error_code, json.description)
      }

      if (debugRaw.enabled) {
        debugRaw('<- %s %s', method, inspect(json, { depth: null }))
      }

      if (!json.ok) {
        if (suppress) {
          return json
        }

        throw new ApiError(json)
      }

      await deps.hooks.run('onAfterRequest', ctx)

      return json.result
    })
  } catch (error) {
    const wrapped = await deps.hooks.runError(error as Error, ctx)

    throw wrapped
  } finally {
    clearTimeout(timeout)
  }
}

function buildUrl (
  options: ResolvedTelegramOptions,
  method: string,
  paramsForQuery: Record<string, unknown> | undefined
) {
  const path = options.useTestDc ? 'test/' + method : method
  const base = `${options.apiBaseUrl}${options.token}/${path}`

  if (!paramsForQuery) {
    return base
  }

  const flat: Record<string, string> = {}

  for (const [key, value] of Object.entries(paramsForQuery)) {
    if (value === undefined || value === null) {
      continue
    }

    if (typeof value === 'object' && !Buffer.isBuffer(value)) {
      flat[key] = JSON.stringify(value)
    } else {
      flat[key] = String(value)
    }
  }

  const qs = new URLSearchParams(flat).toString()

  return qs ? `${base}?${qs}` : base
}
