import { Telegram } from 'puregram'
import { afterEach, describe, expect, it } from 'vitest'

import { createTestEnv } from '../src'

describe('auto-stubs (no override)', () => {
  let cleanup: (() => Promise<void>) | undefined

  afterEach(async () => {
    await cleanup?.()
    cleanup = undefined
  })

  it('sendMessage returns a plausible Message', async () => {
    const tg = new Telegram({ token: 'TEST', apiBaseUrl: 'http://unused/bot' })
    const env = createTestEnv(tg)

    cleanup = () => env.shutdown()

    const r = await tg.api.sendMessage({ chat_id: 100, text: 'hi' }) as {
      message_id: number
      date: number
      chat: { id: number, type: string }
      text: string
    }

    expect(r.chat.id).toBe(100)
    expect(r.chat.type).toBe('private')
    expect(r.text).toBe('hi')
    expect(typeof r.message_id).toBe('number')
    expect(r.message_id).toBeGreaterThan(0)
  })

  it('getMe returns the synthetic bot identity', async () => {
    const tg = new Telegram({ token: 'TEST', apiBaseUrl: 'http://unused/bot' })
    const env = createTestEnv(tg)

    cleanup = () => env.shutdown()

    const me = await tg.api.getMe()

    expect(me.is_bot).toBe(true)
    expect(typeof me.id).toBe('number')
    expect(me.first_name).toBeTruthy()
    expect(me.can_join_groups).toBe(true)
    expect(me.has_topic_sidebar).toBe(false)
  })

  it('answerCallbackQuery returns true', async () => {
    const tg = new Telegram({ token: 'TEST', apiBaseUrl: 'http://unused/bot' })
    const env = createTestEnv(tg)

    cleanup = () => env.shutdown()

    const r = await tg.api.answerCallbackQuery({ callback_query_id: 'cbq_1' })

    expect(r).toBe(true)
  })

  it('an unknown method returns true (fallback)', async () => {
    const tg = new Telegram({ token: 'TEST', apiBaseUrl: 'http://unused/bot' })
    const env = createTestEnv(tg)

    cleanup = () => env.shutdown()

    const r = await tg.api.call('hypotheticalNewMethod', { foo: 'bar' })

    expect(r).toBe(true)
  })
})
