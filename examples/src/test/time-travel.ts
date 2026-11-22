// vitest-style snippet — `env.advanceTime(ms)` fast-forwards `Date.now` + timers for ttl/timeout tests
import { buildMessage, createTestEnv } from '@puregram/test'
import { Telegram } from 'puregram'

declare const describe: (name: string, fn: () => void) => void
declare const it: (name: string, fn: () => Promise<void> | void) => void
declare const expect: (value: unknown) => { toBe: (expected: unknown) => void }

describe('virtual clock', () => {
  it('flushes timers without real sleeps', async () => {
    const tg = Telegram.fromToken('TEST')
    const env = createTestEnv(tg)

    let fired = false

    tg.onMessage(() => {
      setTimeout(() => {
        fired = true
      }, 30_000)
    })

    await env.inject({ message: buildMessage({ text: '/start' }) })
    expect(fired).toBe(false)

    // first `advanceTime` installs the virtual clock — `Date.now`/`setTimeout` are overridden
    // pending timers whose deadline falls inside the window fire synchronously
    await env.advanceTime(30_000)
    expect(fired).toBe(true)

    await env.shutdown()
  })
})
