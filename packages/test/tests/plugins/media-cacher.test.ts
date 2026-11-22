import { mediaCacher } from '@puregram/media-cacher'
import { MediaSource, Telegram } from 'puregram'
import { afterEach, describe, expect, it } from 'vitest'

import { createTestEnv } from '../../src'

// side-effect import: makes env.mediaCache available
import '../../src/plugins/media-cacher'

const STUB_BOT = { id: 1, is_bot: true, first_name: 'stub', username: 'stubbot' } as never

describe('@puregram/test/media-cacher', () => {
  let cleanup: (() => Promise<void>) | undefined

  afterEach(async () => {
    await cleanup?.()
    cleanup = undefined
  })

  it('entries() is empty before any uploads', () => {
    const tg = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(mediaCacher())
    const env = createTestEnv(tg)

    cleanup = () => env.shutdown()

    expect(env.mediaCache!.entries().size).toBe(0)
  })

  it('caches file_id after a successful sendPhoto', async () => {
    const tg = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(mediaCacher())
    const env = createTestEnv(tg)

    cleanup = () => env.shutdown()

    await tg.api.sendPhoto({ chat_id: 42, photo: MediaSource.url('https://x/a.jpg') })

    const entries = env.mediaCache!.entries()

    expect(entries.size).toBe(1)
    expect(typeof entries.get('["sendPhoto","42","https://x/a.jpg"]')).toBe('string')
  })

  it('second sendPhoto with the same source hits the cache (no extra entry)', async () => {
    const tg = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(mediaCacher())
    const env = createTestEnv(tg)

    cleanup = () => env.shutdown()

    await tg.api.sendPhoto({ chat_id: 42, photo: MediaSource.url('https://x/a.jpg') })
    await tg.api.sendPhoto({ chat_id: 42, photo: MediaSource.url('https://x/a.jpg') })

    const entries = env.mediaCache!.entries()

    expect(entries.size).toBe(1)
    expect(env.mediaCache!.hits).toBe(1)
    expect(env.mediaCache!.misses).toBe(1)
  })

  it('seed(key, fileId) pre-populates the cache', async () => {
    const tg = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(mediaCacher())
    const env = createTestEnv(tg)

    cleanup = () => env.shutdown()

    const key = '["sendPhoto","42","https://x/seeded.jpg"]'

    env.mediaCache!.seed(key, 'pre_fid')

    const entries = env.mediaCache!.entries()

    expect(entries.get(key)).toBe('pre_fid')

    await tg.api.sendPhoto({ chat_id: 42, photo: MediaSource.url('https://x/seeded.jpg') })

    expect(env.mediaCache!.hits).toBe(1)
    expect(env.mediaCache!.misses).toBe(0)
    expect(env.mediaCache!.entries().get(key)).toBe('pre_fid')
  })

  it('clear() empties the cache', () => {
    const tg = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(mediaCacher())
    const env = createTestEnv(tg)

    cleanup = () => env.shutdown()

    env.mediaCache!.seed('a:1', 'fid_a')
    env.mediaCache!.seed('b:2', 'fid_b')

    expect(env.mediaCache!.entries().size).toBe(2)

    env.mediaCache!.clear()

    expect(env.mediaCache!.entries().size).toBe(0)
  })

  it('hits/misses counters reflect access patterns', async () => {
    const tg = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(mediaCacher())
    const env = createTestEnv(tg)

    cleanup = () => env.shutdown()

    expect(env.mediaCache!.hits).toBe(0)
    expect(env.mediaCache!.misses).toBe(0)

    // first send: miss
    await tg.api.sendPhoto({ chat_id: 1, photo: MediaSource.url('https://x/one.jpg') })

    expect(env.mediaCache!.misses).toBe(1)
    expect(env.mediaCache!.hits).toBe(0)

    // second send same source: hit
    await tg.api.sendPhoto({ chat_id: 1, photo: MediaSource.url('https://x/one.jpg') })

    expect(env.mediaCache!.misses).toBe(1)
    expect(env.mediaCache!.hits).toBe(1)

    // different source: miss
    await tg.api.sendPhoto({ chat_id: 1, photo: MediaSource.url('https://x/two.jpg') })

    expect(env.mediaCache!.misses).toBe(2)
    expect(env.mediaCache!.hits).toBe(1)
  })
})
