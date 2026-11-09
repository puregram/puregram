import { describe, it, expect, vi } from 'vitest'

import { runRequest } from '../../src/api/lifecycle'
import { HookRegistry } from '../../src/dispatch/hooks'
import { defaultHttpClient } from '../../src/http/client'
import type { HttpClient } from '../../src/http/client'

const baseDeps = (httpClient: HttpClient = defaultHttpClient) => ({
  options: {
    token: 'TEST',
    httpClient: undefined,
    apiBaseUrl: 'https://api.telegram.org/bot',
    apiTimeout: 5000,
    apiWait: 1000,
    apiRetryLimit: 0,
    apiHeaders: {},
    useTestDc: false,
    useLocal: false,
    allowedUpdates: []
  },
  hooks: new HookRegistry(),
  httpClient
})

describe('runRequest', () => {
  it('returns result for ok responses', async () => {
    const httpClient: HttpClient = {
      request: vi.fn().mockResolvedValue({
        status: 200,
        json: () => Promise.resolve({ ok: true, result: { id: 1 } })
      })
    }
    const deps = baseDeps(httpClient)

    const result = await runRequest(deps, 'getMe', undefined)

    expect(result).toEqual({ id: 1 })
  })

  it('throws ApiError on non-ok when suppress is not set', async () => {
    const httpClient: HttpClient = {
      request: vi.fn().mockResolvedValue({
        status: 200,
        json: () => Promise.resolve({ ok: false, error_code: 401, description: 'unauthorized' })
      })
    }
    const deps = baseDeps(httpClient)

    await expect(runRequest(deps, 'getMe', undefined)).rejects.toMatchObject({
      code: 401,
      message: 'unauthorized'
    })
  })

  it('returns the raw response object on non-ok when suppress is true', async () => {
    const httpClient: HttpClient = {
      request: vi.fn().mockResolvedValue({
        status: 200,
        json: () => Promise.resolve({ ok: false, error_code: 400, description: 'bad' })
      })
    }
    const deps = baseDeps(httpClient)

    const out = await runRequest(deps, 'sendMessage', { chat_id: 1, text: 'hi', suppress: true })

    expect(out).toEqual({ ok: false, error_code: 400, description: 'bad' })
  })

  it('uses a replacement response from an interceptor', async () => {
    const deps = baseDeps({
      request: async () => ({
        status: 200,
        json: async () => ({ ok: false, error_code: 401, description: 'unauthorized' })
      })
    })

    deps.hooks.add('onResponseIntercept', async (ctx, next) => {
      ctx.json = { ok: true, result: { id: 42 } }
      await next()
    })

    await expect(runRequest(deps, 'getMe', undefined)).resolves.toEqual({ id: 42 })
  })

  it('applies suppression to an interceptor replacement error', async () => {
    const deps = baseDeps({
      request: async () => ({
        status: 200,
        json: async () => ({ ok: true, result: { id: 1 } })
      })
    })
    const error = { ok: false, error_code: 403, description: 'blocked by policy' }

    deps.hooks.add('onResponseIntercept', async (ctx, next) => {
      ctx.json = error
      await next()
    })

    await expect(runRequest(deps, 'getMe', undefined)).rejects.toMatchObject({ code: 403 })
    await expect(runRequest(deps, 'getMe', { suppress: true })).resolves.toEqual(error)
  })

  it('runs hook chain stages in order', async () => {
    const httpClient: HttpClient = {
      request: vi.fn().mockResolvedValue({
        status: 200,
        json: () => Promise.resolve({ ok: true, result: 'ok' })
      })
    }
    const deps = baseDeps(httpClient)
    const trace: string[] = []

    deps.hooks.add('onBeforeRequest', async (_ctx, next) => {
      trace.push('before'); await next()
    })
    deps.hooks.add('onRequestIntercept', async (_ctx, next) => {
      trace.push('intercept-req'); await next()
    })
    deps.hooks.add('onResponseIntercept', async (_ctx, next) => {
      trace.push('intercept-res'); await next()
    })
    deps.hooks.add('onAfterRequest', async (_ctx, next) => {
      trace.push('after'); await next()
    })

    await runRequest(deps, 'getMe', undefined)
    expect(trace).toEqual(['before', 'intercept-req', 'intercept-res', 'after'])
  })
})
