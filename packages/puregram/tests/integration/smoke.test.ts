import { describe, it, expect } from 'vitest'

import { Telegram, createPlugin } from '../../src'
import { MockTelegram } from '../helpers/mock-telegram'

describe('integration smoke', () => {
  it('end-to-end: extend plugin, start, dispatch one update via getUpdates', async () => {
    const mock = new MockTelegram()
    const baseUrl = await mock.start()

    try {
      mock.expect('getMe', { ok: true, result: { id: 1, is_bot: true, first_name: 'bot', username: 'testbot' } })

      let pulls = 0

      mock.expect('getUpdates', () => {
        pulls++

        if (pulls === 1) {
          return {
            ok: true,
            result: [
              { update_id: 1, message: { message_id: 1, date: 0, chat: { id: 100, type: 'private' }, text: '/start' } }
            ]
          }
        }

        return { ok: true, result: [] }
      })

      const session = createPlugin({
        name: 'session',
        install: () => ({ greetings: 0 })
      })

      const tg = new Telegram({ token: 'TEST', apiBaseUrl: baseUrl })
        .extend(session)

      const received: unknown[] = []

      const dispatched = new Promise<void>((resolve) => {
        tg.onMessage((u) => {
          received.push(u)
          ;(tg as any).session.greetings++
          tg.stopPolling()
          resolve()
        })
      })

      await tg.startPolling()
      await dispatched

      expect(received).toHaveLength(1)
      expect((tg as any).session.greetings).toBe(1)
    } finally {
      await mock.stop()
    }
  })

  it('end-to-end: tg.send returns an editable message through the lifecycle', async () => {
    const mock = new MockTelegram()
    const baseUrl = await mock.start()

    try {
      mock.expect('sendMessage', params => ({
        ok: true,
        result: { message_id: 42, date: 0, chat: { id: params.chat_id, type: 'private' }, text: params.text }
      }))
      mock.expect('editMessageText', params => ({
        ok: true,
        result: { message_id: 42, date: 0, chat: { id: params.chat_id, type: 'private' }, text: params.text }
      }))

      const tg = new Telegram({ token: 'TEST', apiBaseUrl: baseUrl })
      const sent = await tg.send(100, 'hello')

      expect(sent.id).toBe(42)
      expect(sent.raw.message_id).toBe(42)

      const edited = await sent.edit('done')

      expect(edited).toMatchObject({ id: 42, text: 'done' })

      const raw = await tg.api.sendMessage({ chat_id: 100, text: 'raw' })

      expect(raw.message_id).toBe(42)
      expect(raw).not.toHaveProperty('edit')
    } finally {
      await mock.stop()
    }
  })

  it('end-to-end: update.reply fills reply_parameters with the source message id', async () => {
    const mock = new MockTelegram()
    const baseUrl = await mock.start()

    try {
      mock.expect('getMe', { ok: true, result: { id: 1, is_bot: true, first_name: 'bot', username: 'testbot' } })

      let pulls = 0

      mock.expect('getUpdates', () => {
        pulls++

        if (pulls === 1) {
          return {
            ok: true,
            result: [
              { update_id: 1, message: { message_id: 7, date: 0, chat: { id: 100, type: 'private' }, text: 'ping' } }
            ]
          }
        }

        return { ok: true, result: [] }
      })

      let captured: Record<string, unknown> | undefined
      let resolveCaptured: () => void
      const captureHit = new Promise<void>((resolve) => {
        resolveCaptured = resolve
      })

      mock.expect('sendMessage', (params) => {
        captured = params
        resolveCaptured()

        return { ok: true, result: { message_id: 42, date: 0, chat: { id: params.chat_id, type: 'private' }, text: params.text } }
      })

      const tg = new Telegram({ token: 'TEST', apiBaseUrl: baseUrl })

      tg.onMessage(async (u) => {
        await u.reply('pong')
        tg.stopPolling()
      })

      await tg.startPolling()
      await captureHit

      expect(captured?.chat_id).toBe(100)
      expect(captured?.text).toBe('pong')
      expect(captured?.reply_parameters).toEqual({ message_id: 7 })
    } finally {
      await mock.stop()
    }
  })

  it('end-to-end: suppress: true returns ApiResponseError', async () => {
    const mock = new MockTelegram()
    const baseUrl = await mock.start()

    try {
      mock.expect('sendMessage', { ok: false, error_code: 403, description: 'forbidden' })

      const tg = new Telegram({ token: 'TEST', apiBaseUrl: baseUrl })
      const result = await (tg.api as any).sendMessage({ chat_id: 1, text: 'x', suppress: true })

      expect(Telegram.isErrorResponse(result)).toBe(true)
      expect((result).error_code).toBe(403)
    } finally {
      await mock.stop()
    }
  })
})
