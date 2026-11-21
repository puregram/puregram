import { MessageUpdate, type TelegramLike } from '@puregram/api'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { MediaGroupBuffer } from '../../src/media-group/buffer'
import { CollectedMediaGroup } from '../../src/media-group/collected-media-group'

const client = {} as TelegramLike

function message (messageId: number, album = 'a', chat = 1, connection?: string, tg = client) {
  return new MessageUpdate({
    message_id: messageId,
    media_group_id: album,
    date: 0,
    chat: { id: chat, first_name: 'test', type: 'private' },
    ...(connection === undefined ? {} : { business_connection_id: connection })
  }, tg)
}

describe('MediaGroupBuffer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('resolves with the public collection in arrival order', async () => {
    const buf = new MediaGroupBuffer()
    const first = message(2)
    const second = message(1)
    const pending = buf.collect('a', first, 1000)

    expect(buf.collect('a', second, 1000)).toBe(pending)
    vi.advanceTimersByTime(1000)

    const group = await pending

    expect(group).toBeInstanceOf(CollectedMediaGroup)
    expect([...group]).toEqual([first, second])
  })

  it('resets the timer on each subsequent collect (sliding window)', async () => {
    const buf = new MediaGroupBuffer()
    const m1 = message(1)
    const m2 = message(2)

    const p = buf.collect('a', m1, 1000)

    let resolved: any[] | null = null

    p.then((m) => {
      resolved = m
    })

    vi.advanceTimersByTime(800)
    buf.collect('a', m2, 1000)
    vi.advanceTimersByTime(800)
    await Promise.resolve()

    // total elapsed: 1600ms, but timer was reset at 800ms — still pending
    expect(resolved).toBeNull()

    vi.advanceTimersByTime(200)
    await Promise.resolve()
    await Promise.resolve()

    expect(resolved).toEqual([m1, m2])
  })

  it('returns the same promise for repeated collects on the same id', () => {
    const buf = new MediaGroupBuffer()
    const m = message(1)

    const a = buf.collect('a', m, 1000)
    const b = buf.collect('a', m, 1000)

    expect(a).toBe(b)
  })

  it('keeps separate buckets per id and resolves them independently', async () => {
    const buf = new MediaGroupBuffer()

    const pa = buf.collect('a', message(1), 1000)
    const pb = buf.collect('b', message(1, 'b'), 1000)

    let aDone = false
    let bDone = false

    pa.then(() => {
      aDone = true
    })
    pb.then(() => {
      bDone = true
    })

    vi.advanceTimersByTime(1000)
    await Promise.resolve()
    await Promise.resolve()

    expect(aDone).toBe(true)
    expect(bDone).toBe(true)
  })

  it('flushAll resolves every pending bucket immediately', async () => {
    const buf = new MediaGroupBuffer()

    const pa = buf.collect('a', message(1), 60_000)
    const pb = buf.collect('b', message(1, 'b'), 60_000)

    buf.flushAll()

    await expect(pa).resolves.toHaveLength(1)
    await expect(pb).resolves.toHaveLength(1)
  })

  it('isolates equal album and message ids across clients, chats and business connections', async () => {
    const buf = new MediaGroupBuffer()
    const messages = [
      message(1), message(1, 'b'), message(1, 'a', 2), message(1, 'a', 1, 'business'),
      message(1, 'a', 1, 'another'), message(1, 'a', 1, undefined, {} as TelegramLike)
    ]
    const pending = messages.map(item => buf.collect(item.raw.media_group_id!, item, 1000))

    expect(new Set(pending).size).toBe(messages.length)
    buf.flushAll()

    for (const [index, group] of (await Promise.all(pending)).entries()) {
      expect(group).toHaveLength(1)
      expect(group[0]).toBe(messages[index])
    }
  })

  it('ignores redelivery of a message id without postponing the window', async () => {
    const buf = new MediaGroupBuffer()
    const first = message(1)
    const pending = buf.collect('a', first, 1000)

    vi.advanceTimersByTime(800)
    expect(buf.collect('a', message(1), 1000)).toBe(pending)
    vi.advanceTimersByTime(200)

    const group = await pending

    expect(group).toHaveLength(1)
    expect(group[0]).toBe(first)
  })
})
