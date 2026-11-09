import type { RequestContext, Telegram } from 'puregram'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { throttler, ThrottlerDroppedError, type ThrottlerExtension } from '../src/throttler'

type Hook = (ctx: RequestContext, next: () => Promise<void>) => unknown

function mockTg () {
  const beforeHooks: Hook[] = []
  const tg = {
    useHook (name: string, fn: Hook) {
      if (name === 'onBeforeRequest') {
        beforeHooks.push(fn)
      }

      return tg
    }
  } as unknown as Telegram

  const noop = () => Promise.resolve()

  return {
    tg,
    run: async (ctx: RequestContext) => {
      for (const h of beforeHooks) {
        await h(ctx, noop)
      }
    }
  }
}

function setup (opts: Parameters<typeof throttler>[0] = {}) {
  const fixture = mockTg()
  const ext = throttler(opts).install(fixture.tg) as ThrottlerExtension

  return { ...fixture, ext }
}

describe('callback-only ephemeral replies', () => {
  it.each([undefined, -100])('does not allocate a bucket for ignored chat id %s', async (chatId) => {
    const env = setup({ globalPerSec: 100 })

    await env.run({
      method: 'sendMessage',
      params: {
        ...(chatId === undefined ? {} : { chat_id: chatId }),
        text: 'private reply',
        ephemeral_message_parameters: { callback_query_id: 'inline_q' }
      }
    })

    expect(env.ext.chatWindows).toBe(0)
    expect(env.ext.groupWindows).toBe(0)
  })
})

const ctx = (method: string, params: Record<string, unknown> | undefined = undefined) =>
  ({ method, params } satisfies RequestContext)

describe('throttler — global limit', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('allows the first `globalPerSec` calls without sleeping', async () => {
    const env = setup({ globalPerSec: 3, perChatPerSec: 100, perGroupPerMin: 100 })

    const started = Date.now()

    await env.run(ctx('sendMessage', { chat_id: 1, text: 'a' }))
    await env.run(ctx('sendMessage', { chat_id: 2, text: 'b' }))
    await env.run(ctx('sendMessage', { chat_id: 3, text: 'c' }))

    expect(Date.now() - started).toBe(0)
  })

  it('sleeps the (limit+1)-th call until the global window rolls', async () => {
    const env = setup({ globalPerSec: 2, perChatPerSec: 100, perGroupPerMin: 100 })

    await env.run(ctx('sendMessage', { chat_id: 1, text: 'a' }))
    await env.run(ctx('sendMessage', { chat_id: 2, text: 'b' }))

    let finished = false
    const p = env.run(ctx('sendMessage', { chat_id: 3, text: 'c' })).then(() => {
      finished = true
    })

    // immediately the third call is parked
    await vi.advanceTimersByTimeAsync(0)
    expect(finished).toBe(false)

    // just before the window expires it's still parked
    await vi.advanceTimersByTimeAsync(999)
    expect(finished).toBe(false)

    // crossing the 1_000ms mark frees the oldest slot
    await vi.advanceTimersByTimeAsync(1)
    await p
    expect(finished).toBe(true)
  })
})

describe('throttler — per-chat (private) limit', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('1 message/sec per private chat — second to same chat sleeps for ~1s', async () => {
    const env = setup({ globalPerSec: 100, perChatPerSec: 1, perGroupPerMin: 100 })

    await env.run(ctx('sendMessage', { chat_id: 42, text: 'a' }))

    let finished = false
    const p = env.run(ctx('sendMessage', { chat_id: 42, text: 'b' })).then(() => {
      finished = true
    })

    await vi.advanceTimersByTimeAsync(999)
    expect(finished).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    await p
    expect(finished).toBe(true)
  })

  it('different private chats run independently', async () => {
    const env = setup({ globalPerSec: 100, perChatPerSec: 1, perGroupPerMin: 100 })

    await env.run(ctx('sendMessage', { chat_id: 1, text: 'a' }))
    await env.run(ctx('sendMessage', { chat_id: 2, text: 'b' }))
    await env.run(ctx('sendMessage', { chat_id: 3, text: 'c' }))

    expect(Date.now()).toBe(0)
  })
})

describe('throttler — per-group limit', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('20 msg/min cap — 21st call waits until the oldest leaves the 60s window', async () => {
    const env = setup({ globalPerSec: 1_000, perChatPerSec: 1_000, perGroupPerMin: 2 })

    const group = -100

    await env.run(ctx('sendMessage', { chat_id: group, text: 'a' }))
    await env.run(ctx('sendMessage', { chat_id: group, text: 'b' }))

    let finished = false
    const p = env.run(ctx('sendMessage', { chat_id: group, text: 'c' })).then(() => {
      finished = true
    })

    await vi.advanceTimersByTimeAsync(59_999)
    expect(finished).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    await p
    expect(finished).toBe(true)
  })

  it('default extractIsGroup treats negative chat_id as a group', async () => {
    const env = setup({ globalPerSec: 100, perChatPerSec: 1, perGroupPerMin: 1_000 })

    // negative chat_id — would block on per-group, but the per-chat (private) cap doesn't apply
    await env.run(ctx('sendMessage', { chat_id: -7, text: 'a' }))

    let finished = false
    const p = env.run(ctx('sendMessage', { chat_id: -7, text: 'b' })).then(() => {
      finished = true
    })

    // per-chat doesn't apply to groups; per-group has plenty of room — no wait
    await vi.advanceTimersByTimeAsync(0)
    await p
    expect(finished).toBe(true)
  })
})

describe('throttler — excludeMethods', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('excluded methods bypass every bucket', async () => {
    const env = setup({ globalPerSec: 1 })

    // burn the global slot
    await env.run(ctx('sendMessage', { chat_id: 1, text: 'a' }))

    let finished = false
    const p = env.run(ctx('getMe', undefined)).then(() => {
      finished = true
    })

    await vi.advanceTimersByTimeAsync(0)
    await p
    expect(finished).toBe(true)
    expect(Date.now()).toBe(0)
  })

  it('custom excludeMethods replaces the default list', async () => {
    const env = setup({ globalPerSec: 1, excludeMethods: ['answerCallbackQuery'] })

    await env.run(ctx('sendMessage', { chat_id: 1, text: 'a' }))

    let getMeFinished = false
    const p = env.run(ctx('getMe', undefined)).then(() => {
      getMeFinished = true
    })

    // getMe is no longer excluded — it must wait for the global window
    await vi.advanceTimersByTimeAsync(0)
    expect(getMeFinished).toBe(false)

    await vi.advanceTimersByTimeAsync(1_000)
    await p
    expect(getMeFinished).toBe(true)
  })
})

describe('throttler — drop mode', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('throws ThrottlerDroppedError when queue depth would exceed maxQueueDepth', async () => {
    const env = setup({
      globalPerSec: 1,
      perChatPerSec: 100,
      perGroupPerMin: 100,
      mode: 'drop',
      maxQueueDepth: 1
    })

    // first call takes the slot — never parked
    await env.run(ctx('sendMessage', { chat_id: 1, text: 'a' }))

    // second call is parked behind the global mutex (queue depth = 1)
    const p2 = env.run(ctx('sendMessage', { chat_id: 2, text: 'b' }))

    // give the second call a tick to enter the mutex queue
    await vi.advanceTimersByTimeAsync(0)

    // third call should be rejected synchronously — queue is full
    await expect(env.run(ctx('sendMessage', { chat_id: 3, text: 'c' }))).rejects.toBeInstanceOf(
      ThrottlerDroppedError
    )

    // drain the parked one
    await vi.advanceTimersByTimeAsync(1_000)
    await p2
  })

  it('queue mode (default) keeps queuing past nominal depth', async () => {
    const env = setup({
      globalPerSec: 1,
      perChatPerSec: 100,
      perGroupPerMin: 100,
      maxQueueDepth: 1
    })

    await env.run(ctx('sendMessage', { chat_id: 1, text: 'a' }))

    const p2 = env.run(ctx('sendMessage', { chat_id: 2, text: 'b' }))
    const p3 = env.run(ctx('sendMessage', { chat_id: 3, text: 'c' }))

    await vi.advanceTimersByTimeAsync(1_000)
    await p2
    await vi.advanceTimersByTimeAsync(1_000)
    await p3
  })
})

describe('throttler — custom extractors', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('uses custom extractChatId for non-standard params', async () => {
    const seen: number[] = []

    const env = setup({
      globalPerSec: 100,
      perChatPerSec: 1,
      extractChatId: (_method, params) => {
        const id = (params as { user_chat_id?: number } | undefined)?.user_chat_id

        if (id !== undefined) {
          seen.push(id)
        }

        return id
      }
    })

    await env.run(ctx('myMethod', { user_chat_id: 7 }))
    await env.run(ctx('myMethod', { user_chat_id: 8 }))

    expect(seen).toEqual([7, 8])
  })

  it('extractChatId returning undefined → no per-chat / per-group bucketing', async () => {
    const env = setup({
      globalPerSec: 100,
      perChatPerSec: 1,
      extractChatId: () => undefined
    })

    // both target the same logical chat but the throttler can't see it — both fly
    await env.run(ctx('sendMessage', { chat_id: 1, text: 'a' }))
    await env.run(ctx('sendMessage', { chat_id: 1, text: 'b' }))

    expect(Date.now()).toBe(0)
  })

  it('custom extractIsGroup overrides the negative-id heuristic', async () => {
    const env = setup({
      globalPerSec: 100,
      perChatPerSec: 1_000,
      perGroupPerMin: 1,
      // treat every chat as a group
      extractIsGroup: () => true
    })

    await env.run(ctx('sendMessage', { chat_id: 5, text: 'a' }))

    let finished = false
    const p = env.run(ctx('sendMessage', { chat_id: 5, text: 'b' })).then(() => {
      finished = true
    })

    await vi.advanceTimersByTimeAsync(59_999)
    expect(finished).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    await p
    expect(finished).toBe(true)
  })
})

describe('throttler — extension surface', () => {
  it('exposes pending / chatWindows / groupWindows / sweep', () => {
    const env = setup()

    expect(env.ext.pending).toBe(0)
    expect(env.ext.chatWindows).toBe(0)
    expect(env.ext.groupWindows).toBe(0)
    expect(typeof env.ext.sweep).toBe('function')
  })

  it('chatWindows / groupWindows grow as new chats/groups are observed', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)

    try {
      const env = setup({ globalPerSec: 100, perChatPerSec: 100, perGroupPerMin: 100 })

      await env.run(ctx('sendMessage', { chat_id: 1, text: 'a' }))
      await env.run(ctx('sendMessage', { chat_id: 2, text: 'b' }))
      await env.run(ctx('sendMessage', { chat_id: -100, text: 'c' }))

      expect(env.ext.chatWindows).toBe(2)
      expect(env.ext.groupWindows).toBe(1)

      vi.setSystemTime(120_000)
      env.ext.sweep()

      expect(env.ext.chatWindows).toBe(0)
      expect(env.ext.groupWindows).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('throttler — per-method overrides', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('methods listed in perMethod use isolated chat buckets', async () => {
    const env = setup({
      globalPerSec: 100,
      perChatPerSec: 1,
      perMethod: {
        sendVideo: { perChatPerSec: 1 }
      }
    })

    // sendMessage and sendVideo to the same chat run back-to-back without blocking
    // each other — they live in separate per-(method, chat) windows
    const t1 = env.run(ctx('sendMessage', { chat_id: 1, text: 'a' }))

    await vi.advanceTimersByTimeAsync(0)
    await t1

    const t2 = env.run(ctx('sendVideo', { chat_id: 1, video: 'x' }))

    await vi.advanceTimersByTimeAsync(0)
    await t2

    // both completed at t=0
    expect(vi.getMockedSystemTime()?.getTime()).toBe(0)
    expect(env.ext.chatWindows).toBe(2)
  })

  it('per-method limit is stricter than the default for that method', async () => {
    const env = setup({
      globalPerSec: 100,
      perChatPerSec: 5,
      perMethod: {
        sendVideo: { perChatPerSec: 1 }
      }
    })

    // first sendVideo records at t=0
    await env.run(ctx('sendVideo', { chat_id: 1, video: 'a' }))

    // second sendVideo to the same chat must wait ~1000ms (per-method limit = 1/sec)
    const start = Date.now()
    const pending = env.run(ctx('sendVideo', { chat_id: 1, video: 'b' }))

    await vi.advanceTimersByTimeAsync(1_000)
    await pending

    expect(Date.now() - start).toBe(1_000)
  })

  it('per-method group overrides are also honored', async () => {
    const env = setup({
      globalPerSec: 100,
      perGroupPerMin: 20,
      perMethod: {
        forwardMessage: { perGroupPerMin: 5 }
      }
    })

    // fill the per-method group window with 5 forwards at t=0
    for (let i = 0; i < 5; i++) {
      await env.run(ctx('forwardMessage', { chat_id: -100, message_id: i }))
    }

    // 6th forward should wait close to a minute (per-method limit = 5/min)
    const start = Date.now()
    const pending = env.run(ctx('forwardMessage', { chat_id: -100, message_id: 6 }))

    await vi.advanceTimersByTimeAsync(60_000)
    await pending

    expect(Date.now() - start).toBe(60_000)
  })

  it('methods without an override still share the default bucket', async () => {
    const env = setup({
      globalPerSec: 100,
      perChatPerSec: 1,
      perMethod: {
        sendVideo: { perChatPerSec: 5 }
      }
    })

    // sendMessage and sendPhoto have no override → they share the default per-chat bucket
    await env.run(ctx('sendMessage', { chat_id: 1, text: 'a' }))

    const start = Date.now()
    const pending = env.run(ctx('sendPhoto', { chat_id: 1, photo: 'x' }))

    await vi.advanceTimersByTimeAsync(1_000)
    await pending

    // sendPhoto blocked for ~1s by the prior sendMessage in the shared default bucket
    expect(Date.now() - start).toBe(1_000)
  })

  it('unspecified per-method fields fall back to top-level defaults', async () => {
    const env = setup({
      globalPerSec: 100,
      perChatPerSec: 1,
      perGroupPerMin: 20,
      perMethod: {
        // empty entry — still gets isolated buckets, but with the default limits
        sendDocument: {}
      }
    })

    // sendDocument and sendMessage to the same chat both complete at t=0 because
    // their windows are isolated (different keys, even with same numeric limit)
    await env.run(ctx('sendMessage', { chat_id: 1, text: 'a' }))
    await env.run(ctx('sendDocument', { chat_id: 1, document: 'd' }))

    expect(Date.now()).toBe(0)
    expect(env.ext.chatWindows).toBe(2)
  })
})
