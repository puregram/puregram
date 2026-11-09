import { api, BotApiError } from 'sdk'

import { METHOD_PARAMS } from '@puregram/api'
import { ApiError, mergeDefaultParams } from 'puregram/runtime'
import type { ApiResponseError, DefaultParams, HookRegistry, RequestContext } from 'puregram/runtime'

import { normalizeParams } from './media'

type ApiResponse = { ok: true, result: unknown } | ApiResponseError

export function normalizeError (error: unknown) {
  if (!(error instanceof BotApiError)) {
    return error
  }

  return new ApiError({
    ok: false,
    error_code: error.code,
    description: error.description,
    ...(error.parameters === undefined ? {} : { parameters: error.parameters })
  })
}

export async function runRequest (
  hooks: HookRegistry,
  defaults: DefaultParams | undefined,
  method: string,
  rawParams?: Record<string, unknown>,
  debug?: (template: string, ...args: unknown[]) => void
) {
  const params = { ...mergeDefaultParams(defaults, method, rawParams, METHOD_PARAMS[method]) }
  const suppress = params.suppress === true

  delete params.suppress

  const ctx: RequestContext = { method, params }

  try {
    await hooks.run('onBeforeRequest', ctx)
    await hooks.run('onRequestIntercept', ctx)

    debug?.('-> %s', ctx.method)

    return await hooks.runApiCall(ctx, async () => {
      const normalized = await normalizeParams(ctx.params)
      let response: ApiResponse

      try {
        const call = api[ctx.method]

        if (typeof call !== 'function') {
          throw new TypeError(`SDK has no Bot API method '${ctx.method}'`)
        }

        response = { ok: true, result: await call.call(api, normalized) }
      } catch (error) {
        if (!(error instanceof BotApiError)) {
          throw error
        }

        response = {
          ok: false,
          error_code: error.code,
          description: error.description,
          ...(error.parameters === undefined ? {} : { parameters: error.parameters })
        }
      }

      ctx.json = response
      await hooks.run('onResponseIntercept', ctx)
      response = ctx.json as ApiResponse

      if (response.ok) {
        debug?.('<- %s ok=true', ctx.method)
      } else {
        debug?.('<- %s ok=false error_code=%s description=%s', ctx.method, response.error_code, response.description)
      }

      if (!response.ok) {
        if (suppress) {
          return response
        }

        throw new ApiError(response)
      }

      await hooks.run('onAfterRequest', ctx)

      return response.result
    })
  } catch (error) {
    throw await hooks.runError(normalizeError(error) as Error, ctx)
  }
}
