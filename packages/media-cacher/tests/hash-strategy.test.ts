import { createHash } from 'node:crypto'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { MemoryStorage } from '@puregram/storage'
import { MediaSource, type RequestContext, type Telegram } from 'puregram'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { mediaCacher } from '../src/cacher'
import { hashBytes, hashMediaInput } from '../src/hash'

type Hook = (ctx: unknown, next: () => Promise<void>) => unknown

function makeHarness () {
  const hooks: Record<string, Hook[]> = { onBeforeRequest: [], onResponseIntercept: [] }
  const tg = {
    useHook (name: string, fn: Hook) {
      hooks[name]?.push(fn)

      return tg
    }
  } as unknown as Telegram

  return {
    tg,
    async run (name: string, ctx: unknown) {
      const chain = hooks[name] ?? []
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
  }
}

describe('hashBytes / hashMediaInput', () => {
  it('hashBytes is stable across Buffer/Uint8Array/ArrayBuffer of identical content', () => {
    const buf = Buffer.from('hello world')
    const u8 = new Uint8Array(buf)
    const ab = u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength)
    const expected = createHash('sha256').update(buf).digest('hex')

    expect(hashBytes(buf)).toBe(expected)
    expect(hashBytes(u8)).toBe(expected)
    expect(hashBytes(ab)).toBe(expected)
  })

  it('hashes only the selected bytes of a DataView', () => {
    const backing = new Uint8Array([99, 1, 2, 3, 99])
    const view = new DataView(backing.buffer, 1, 3)
    const expected = createHash('sha256').update(new Uint8Array([1, 2, 3])).digest('hex')

    expect(hashBytes(view)).toBe(expected)
  })

  it('hashMediaInput hashes Buffer sources directly', async () => {
    const buf = Buffer.from('some bytes')
    const media = MediaSource.buffer(buf)
    const expected = createHash('sha256').update(buf).digest('hex')

    expect(await hashMediaInput(media)).toBe(expected)
  })

  it('hashMediaInput reads files for Path sources', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'media-hash-'))
    const path = join(dir, 'a.bin')
    const bytes = Buffer.from('contents')

    await writeFile(path, bytes)

    const media = MediaSource.path(path)
    const expected = createHash('sha256').update(bytes).digest('hex')

    expect(await hashMediaInput(media)).toBe(expected)
  })

  it('hashMediaInput fetches Url sources', async () => {
    const bytes = Buffer.from('remote payload')
    const fetchImpl = vi.fn(() => Promise.resolve(new Response(bytes, { status: 200 })))

    const expected = createHash('sha256').update(bytes).digest('hex')

    expect(await hashMediaInput(MediaSource.url('https://example/x.bin'), fetchImpl as unknown as typeof fetch)).toBe(expected)
    expect(fetchImpl).toHaveBeenCalledOnce()
  })

  it('hashMediaInput rejects unsupported source types', async () => {
    const { Readable } = await import('node:stream')
    const stream = MediaSource.stream(Readable.from(['x']))

    await expect(hashMediaInput(stream)).rejects.toThrow(/cannot hash/i)
  })
})

describe('mediaCacher — keyStrategy: hash', () => {
  let tmp: string

  beforeEach(async () => {
    tmp = await mkdtemp(join(tmpdir(), 'media-cacher-hash-'))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('keys by content hash so two distinct paths with identical bytes share one cache entry', async () => {
    const bytes = Buffer.from('shared content')
    const pathA = join(tmp, 'a.jpg')
    const pathB = join(tmp, 'b.jpg')

    await writeFile(pathA, bytes)
    await writeFile(pathB, bytes)

    const storage = new MemoryStorage<string>()
    const harness = makeHarness()

    mediaCacher({ storage, keyStrategy: 'hash' }).install(harness.tg)

    const hash = createHash('sha256').update(bytes).digest('hex')

    // first send — uploads, caches by hash
    const ctx1: RequestContext = {
      method: 'sendPhoto',
      params: { chat_id: 1, photo: MediaSource.path(pathA) }
    }

    await harness.run('onBeforeRequest', ctx1)
    ctx1.json = { ok: true, result: { photo: [{ file_id: 'cached_by_hash' }] } }
    await harness.run('onResponseIntercept', ctx1)

    expect(await storage.get(`1:${hash}`)).toBe('cached_by_hash')

    // second send — distinct path, identical bytes — should hit the cache
    const ctx2: RequestContext = {
      method: 'sendPhoto',
      params: { chat_id: 1, photo: MediaSource.path(pathB) }
    }

    await harness.run('onBeforeRequest', ctx2)

    expect(ctx2.params!.photo).toMatchObject({ type: 'file_id', value: 'cached_by_hash' })
  })

  it('defaults to sourceValue strategy (existing behavior)', async () => {
    const storage = new MemoryStorage<string>()
    const harness = makeHarness()

    mediaCacher({ storage }).install(harness.tg)

    const ctx: RequestContext = {
      method: 'sendPhoto',
      params: { chat_id: 5, photo: MediaSource.path('/tmp/whatever.jpg') }
    }

    await harness.run('onBeforeRequest', ctx)
    ctx.json = { ok: true, result: { photo: [{ file_id: 'fid' }] } }
    await harness.run('onResponseIntercept', ctx)

    // keyed by raw value, not by hash
    expect(await storage.get('5:/tmp/whatever.jpg')).toBe('fid')
  })

  it('hash strategy for Url sources fetches the body once for hashing', async () => {
    const bytes = Buffer.from('url payload')
    const expectedHash = createHash('sha256').update(bytes).digest('hex')

    const originalFetch = globalThis.fetch
    const fetchSpy = vi.fn(() => Promise.resolve(new Response(bytes, { status: 200 })))

    globalThis.fetch = fetchSpy as unknown as typeof fetch

    try {
      const storage = new MemoryStorage<string>()
      const harness = makeHarness()

      mediaCacher({ storage, keyStrategy: 'hash' }).install(harness.tg)

      const ctx: RequestContext = {
        method: 'sendPhoto',
        params: { chat_id: 2, photo: MediaSource.url('https://example/x.jpg') }
      }

      await harness.run('onBeforeRequest', ctx)
      ctx.json = { ok: true, result: { photo: [{ file_id: 'url_fid' }] } }
      await harness.run('onResponseIntercept', ctx)

      expect(await storage.get(`2:${expectedHash}`)).toBe('url_fid')
      expect(fetchSpy).toHaveBeenCalledOnce()
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('caches byte uploads by content and leaves them uncached under sourceValue', async () => {
    const hashed = new MemoryStorage<string>()
    const plain = new MemoryStorage<string>()
    const harness = makeHarness()
    const raw = makeHarness()

    mediaCacher({ storage: hashed, keyStrategy: 'hash' }).install(harness.tg)
    mediaCacher({ storage: plain }).install(raw.tg)

    const first: RequestContext = { method: 'sendDocument', params: { chat_id: 3, document: MediaSource.bytes(new Uint8Array([1, 2, 3])) } }

    await harness.run('onBeforeRequest', first)
    first.json = { ok: true, result: { document: { file_id: 'bytes_fid' } } }
    await harness.run('onResponseIntercept', first)

    const second: RequestContext = { method: 'sendDocument', params: { chat_id: 3, document: MediaSource.buffer(Buffer.from([1, 2, 3])) } }

    await harness.run('onBeforeRequest', second)

    expect(second.params!.document).toMatchObject({ type: 'file_id', value: 'bytes_fid' })

    const bytesSource = MediaSource.bytes(new Uint8Array([1, 2, 3]))
    const untouched: RequestContext = { method: 'sendDocument', params: { chat_id: 3, document: bytesSource } }

    await raw.run('onBeforeRequest', untouched)
    untouched.json = { ok: true, result: { document: { file_id: 'never_stored' } } }
    await raw.run('onResponseIntercept', untouched)

    expect(untouched.params!.document).toBe(bytesSource)

    const keys: string[] = []

    for await (const key of plain.keys?.() ?? []) {
      keys.push(key)
    }

    expect(keys).toEqual([])
  })

  it('hashes url sources through the fetch option when no global fetch exists', async () => {
    vi.stubGlobal('fetch', undefined)

    try {
      const storage = new MemoryStorage<string>()
      const harness = makeHarness()
      const fetchOption = vi.fn(() => Promise.resolve({
        ok: true,
        status: 200,
        body: ReadableStream.from([new Uint8Array([104, 105]), new Uint8Array([33])])
      }))

      mediaCacher({ storage, keyStrategy: 'hash', fetch: fetchOption }).install(harness.tg)

      const ctx: RequestContext = { method: 'sendPhoto', params: { chat_id: 4, photo: MediaSource.url('https://example/y.jpg') } }

      await harness.run('onBeforeRequest', ctx)
      ctx.json = { ok: true, result: { photo: [{ file_id: 'sdk_fid' }] } }
      await harness.run('onResponseIntercept', ctx)

      expect(await storage.get(`4:${createHash('sha256').update('hi!').digest('hex')}`)).toBe('sdk_fid')
      expect(fetchOption).toHaveBeenCalledWith('https://example/y.jpg')
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
