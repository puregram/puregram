import { MemoryStorage } from '@puregram/storage'
import { MediaSource, MediaSourceType, type RequestContext, type Telegram } from 'puregram'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { mediaCacher, type MediaCacherExtension } from '../src/cacher'

type Hook = (ctx: unknown, next: () => Promise<void>) => unknown

interface HookBuckets {
  onBeforeRequest: Hook[]
  onResponseIntercept: Hook[]
}

type Transport = (params: Record<string, unknown>) => unknown

/**
 * a richer mock that simulates `runRequest` end-to-end: runs the cache hooks,
 * then resolves the request via a user-supplied `transport` per method call
 */
function makeHarness () {
  const hooks: HookBuckets = { onBeforeRequest: [], onResponseIntercept: [] }
  const transports: Record<string, Transport[]> = {}

  const tg = {
    useHook (name: string, fn: Hook) {
      const bucket = (hooks as Record<string, Hook[]>)[name]

      if (bucket !== undefined) {
        bucket.push(fn)
      }

      return tg
    },
    api: new Proxy({}, {
      get (_target, prop: string) {
        return (params: Record<string, unknown>) => runMethod(prop, params)
      }
    })
  } as unknown as Telegram & { api: Record<string, (p: Record<string, unknown>) => Promise<unknown>> }

  async function runMethod (method: string, params: Record<string, unknown>) {
    const ctx: RequestContext = { method, params: { ...params } }

    await runChain(hooks.onBeforeRequest, ctx)

    const queue = transports[method]
    const next = queue?.shift()

    if (next === undefined) {
      throw new Error(`no transport response queued for ${method}`)
    }

    const json = await next(ctx.params ?? {})

    ctx.json = json
    ctx.response = { status: 200 }

    await runChain(hooks.onResponseIntercept, ctx)

    const final = ctx.json as { ok?: boolean, result?: unknown, description?: string } | undefined

    if (final?.ok !== true) {
      throw new Error(final?.description ?? 'mock-failure')
    }

    return final.result
  }

  return {
    tg,
    queue (method: string, fn: Transport) {
      transports[method] ??= []
      transports[method].push(fn)
    }
  }
}

async function runChain (chain: Hook[], ctx: unknown) {
  let i = 0
  const next = async (): Promise<void> => {
    if (i >= chain.length) {
      return
    }

    const fn = chain[i++]

    if (fn) {
      await fn(ctx, next)
    }
  }

  await next()
}

function setup () {
  const harness = makeHarness()
  const storage = new MemoryStorage<string>()
  const ext = mediaCacher({ storage }).install(harness.tg) as MediaCacherExtension

  return { ...harness, storage, ext }
}

describe('mediaCacher — auto-evict + retry on stale file_id', () => {
  let env: ReturnType<typeof setup>

  beforeEach(() => {
    env = setup()
  })

  it('on stale-id 400, evicts the entry and retries once with the original source', async () => {
    await env.storage.set('["sendPhoto","42","/tmp/x.jpg"]', 'stale_id')

    const seen: unknown[] = []

    env.queue('sendPhoto', (params) => {
      seen.push(params.photo)

      // first call: telegram rejects the cached file_id
      return { ok: false, error_code: 400, description: 'Bad Request: wrong file identifier/HTTP URL specified' }
    })

    env.queue('sendPhoto', (params) => {
      seen.push(params.photo)

      // retry: re-upload yields a fresh file_id
      return { ok: true, result: { photo: [{ file_id: 'fresh_id' }] } }
    })

    const result = await env.tg.api.sendPhoto({
      chat_id: 42,
      photo: MediaSource.path('/tmp/x.jpg')
    })

    expect(result).toEqual({ photo: [{ file_id: 'fresh_id' }] })
    expect(await env.storage.get('["sendPhoto","42","/tmp/x.jpg"]')).toBe('fresh_id')

    // first attempt used the cached fileId, retry used the original path
    expect(seen[0]).toMatchObject({ type: MediaSourceType.FileId, value: 'stale_id' })
    expect(seen[1]).toMatchObject({ type: MediaSourceType.Path, value: '/tmp/x.jpg' })
  })

  it('matches all three stale-id descriptions case-insensitively', async () => {
    const variants = [
      'Bad Request: wrong file identifier/HTTP URL specified',
      'Bad Request: wrong file_id',
      'Bad Request: FILE IS TEMPORARILY UNAVAILABLE'
    ]

    for (const description of variants) {
      const local = setup()

      await local.storage.set('["sendVideo","1","/v.mp4"]', 'stale')

      local.queue('sendVideo', () => ({ ok: false, error_code: 400, description }))
      local.queue('sendVideo', () => ({ ok: true, result: { video: { file_id: 'new' } } }))

      const result = await local.tg.api.sendVideo({
        chat_id: 1,
        video: MediaSource.path('/v.mp4')
      })

      expect(result).toEqual({ video: { file_id: 'new' } })
    }
  })

  it('non-matching 400s pass through unchanged and the entry stays cached', async () => {
    await env.storage.set('["sendPhoto","3","/p.jpg"]', 'fid')

    env.queue('sendPhoto', () => ({
      ok: false, error_code: 400, description: 'Bad Request: chat not found'
    }))

    await expect(env.tg.api.sendPhoto({
      chat_id: 3,
      photo: MediaSource.path('/p.jpg')
    })).rejects.toThrow('Bad Request: chat not found')

    // unrelated failure — entry must remain
    expect(await env.storage.get('["sendPhoto","3","/p.jpg"]')).toBe('fid')
  })

  it('if the retry also fails, propagates the original error without looping', async () => {
    await env.storage.set('["sendPhoto","7","/g.jpg"]', 'stale')

    let calls = 0

    env.queue('sendPhoto', () => {
      calls++

      return { ok: false, error_code: 400, description: 'Bad Request: wrong file_id' }
    })

    env.queue('sendPhoto', () => {
      calls++

      // retry: source is gone too
      return { ok: false, error_code: 400, description: 'Bad Request: file not found on disk' }
    })

    await expect(env.tg.api.sendPhoto({
      chat_id: 7,
      photo: MediaSource.path('/g.jpg')
    })).rejects.toBeTruthy()

    // exactly two calls — original + one retry, no infinite loop
    expect(calls).toBe(2)
  })

  it('coalesces concurrent stale failures: exactly one re-upload, both callers resolve', async () => {
    await env.storage.set('["sendPhoto","9","/c.jpg"]', 'stale')

    let reupload = 0
    let cachedSend = 0

    env.queue('sendPhoto', () => ({
      ok: false, error_code: 400, description: 'Bad Request: wrong file_id'
    }))

    env.queue('sendPhoto', () => ({
      ok: false, error_code: 400, description: 'Bad Request: wrong file_id'
    }))

    const reuploadDeferred = createDeferred<void>()

    env.queue('sendPhoto', async (params) => {
      reupload++

      // confirm leader uses the original path
      expect(params.photo).toMatchObject({ type: MediaSourceType.Path, value: '/c.jpg' })
      await reuploadDeferred.promise

      return { ok: true, result: { photo: [{ file_id: 'fresh' }] } }
    })

    env.queue('sendPhoto', (params) => {
      cachedSend++

      // follower sends with the freshly-cached file_id
      expect(params.photo).toMatchObject({ type: MediaSourceType.FileId, value: 'fresh' })

      return { ok: true, result: { photo: [{ file_id: 'fresh' }] } }
    })

    const a = env.tg.api.sendPhoto({ chat_id: 9, photo: MediaSource.path('/c.jpg') })
    const b = env.tg.api.sendPhoto({ chat_id: 9, photo: MediaSource.path('/c.jpg') })

    // let both reach the stale-detection point and claim leader/follower
    await new Promise(resolve => setTimeout(resolve, 0))
    reuploadDeferred.resolve()

    const [r1, r2] = await Promise.all([a, b])

    expect(r1).toBeTruthy()
    expect(r2).toBeTruthy()
    expect(reupload).toBe(1)
    expect(cachedSend).toBe(1)
  })

  it('skips retry when the failing send did not originate from a cache hit', async () => {
    // no entry in storage — first send is a cache miss (uploads); if it fails, no retry
    const fn = vi.fn(() => ({
      ok: false, error_code: 400, description: 'Bad Request: wrong file_id'
    }))

    env.queue('sendPhoto', fn)

    await expect(env.tg.api.sendPhoto({
      chat_id: 11,
      photo: MediaSource.path('/m.jpg')
    })).rejects.toBeTruthy()

    expect(fn).toHaveBeenCalledTimes(1)
  })
})

function createDeferred<T> () {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  return { promise, resolve, reject }
}
