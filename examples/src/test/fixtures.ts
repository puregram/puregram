// vitest-style snippet — illustrates fixture builders for unit-testing handlers
// run with `vitest` after adding it as a devDependency
import { buildCallbackQuery, buildMessage, buildUser, createTestEnv } from '@puregram/test'
import { Telegram } from 'puregram'

declare const describe: (name: string, fn: () => void) => void
declare const it: (name: string, fn: () => Promise<void> | void) => void
declare const expect: (value: unknown) => { toBe: (expected: unknown) => void }

describe('fixture builders', () => {
  it('typed payloads with sensible defaults', async () => {
    const tg = Telegram.fromToken('TEST')
    const env = createTestEnv(tg)

    // fixture builders return ready-to-inject raw payloads — override only what the test cares about
    const alice = buildUser({ id: 100, first_name: 'alice' })
    const message = buildMessage({ text: '/ping', from: alice })

    let seenText: string | undefined

    tg.onMessage((m) => {
      seenText = m.text
    })

    await env.inject({ message })
    expect(seenText).toBe('/ping')

    // build callback queries with `from` + `data` defaults wired up
    const callback = buildCallbackQuery({ data: 'vote:yes', from: alice })

    await env.inject({ callback_query: callback })

    await env.shutdown()
  })
})
