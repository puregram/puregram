import { CallbackQueryUpdate } from '@puregram/api'
import { describe, it, expect, vi } from 'vitest'

import type { HttpRequestInput } from '../../src/http/client'
import { MediaSource } from '../../src/media-source'
import { Telegram } from '../../src/telegram'

const recordingClient = () => {
  const urls: string[] = []
  const requests: HttpRequestInput[] = []
  const request = vi.fn((input: HttpRequestInput) => {
    urls.push(input.url)
    requests.push(input)

    return Promise.resolve({ status: 200, json: () => Promise.resolve({ ok: true, result: { message_id: 1 } }) })
  })

  return { urls, requests, httpClient: { request } }
}

function ephemeralParams (url: string) {
  const raw = new URL(url).searchParams.get('ephemeral_message_parameters')

  return raw === null ? undefined : JSON.parse(raw) as Record<string, unknown>
}

describe('tg.ephemeral', () => {
  it('injects ephemeral_message_parameters into send-family calls', async () => {
    const { urls, httpClient } = recordingClient()
    const tg = new Telegram({ token: 'X', httpClient })

    await tg.ephemeral(5).sendMessage({ chat_id: 1, text: 'x' })

    expect(urls[0]).toContain('sendMessage')
    expect(ephemeralParams(urls[0]!)).toEqual({ receiver_user_id: 5 })
  })

  it('carries the callback query id and the replace flag when provided', async () => {
    const { urls, httpClient } = recordingClient()
    const tg = new Telegram({ token: 'X', httpClient })

    await tg
      .ephemeral(5, { callbackQueryId: 'cbq_42', replaceCallbackQueryMessage: true })
      .sendMessage({ chat_id: 1, text: 'x' })

    expect(ephemeralParams(urls[0]!)).toEqual({
      receiver_user_id: 5,
      callback_query_id: 'cbq_42',
      replace_callback_query_message: true
    })
  })

  it('sends a callback-only reply without a receiver or chat id', async () => {
    const { urls, httpClient } = recordingClient()
    const tg = new Telegram({ token: 'X', httpClient })

    await tg.ephemeral({ callbackQueryId: 'inline_q', replaceCallbackQueryMessage: true })
      .sendMessage({ text: 'only the person who pressed the button sees this' })

    const params = new URL(urls[0]!).searchParams

    expect(params.has('chat_id')).toBe(false)
    expect(ephemeralParams(urls[0]!)).toEqual({
      callback_query_id: 'inline_q',
      replace_callback_query_message: true
    })
  })

  it('does not invent an edit receiver for a callback-only scope', async () => {
    const { urls, httpClient } = recordingClient()
    const tg = new Telegram({ token: 'X', httpClient })

    await tg.ephemeral({ callbackQueryId: 'q' }).editEphemeralMessageText({
      chat_id: 1, receiver_user_id: 5, ephemeral_message_id: 2, text: 'updated'
    })

    expect(new URL(urls[0]!).searchParams.get('receiver_user_id')).toBe('5')
    expect(urls[0]).not.toContain('ephemeral_message_parameters')
  })

  it('sends callback-only text and media shortcuts without a chat', async () => {
    const { requests, httpClient } = recordingClient()
    const tg = new Telegram({ token: 'X', httpClient })
    const query = new CallbackQueryUpdate({
      id: 'inline_q',
      from: { id: 5, first_name: 'user', is_bot: false },
      inline_message_id: 'inline-message',
      chat_instance: 'instance'
    }, tg)

    await query.send('private text', { ephemeral: true })
    await query.sendPhoto(MediaSource.fileId('photo'), { ephemeral_message_parameters: {} })

    const payloads = await Promise.all(requests.map(async ({ url, init }) => init.body == null
      ? new URL(url).searchParams
      : await new Response(init.body, init).formData()))

    for (const params of payloads) {
      expect(params.has('chat_id')).toBe(false)
      expect(params.has('ephemeral')).toBe(false)
      expect(JSON.parse(String(params.get('ephemeral_message_parameters')))).toEqual({ callback_query_id: 'inline_q' })
    }

    expect(payloads[0]!.get('text')).toBe('private text')
    expect(payloads[1]!.get('photo')).toBe('photo')
  })

  it('merges call-site ephemeral parameters field by field', async () => {
    const { urls, httpClient } = recordingClient()
    const tg = new Telegram({ token: 'X', httpClient })

    await tg.ephemeral(5, { callbackQueryId: 'cbq_42' }).sendMessage({
      chat_id: 1,
      text: 'x',
      ephemeral_message_parameters: { receiver_user_id: 7 }
    })

    expect(ephemeralParams(urls[0]!)).toEqual({ receiver_user_id: 7, callback_query_id: 'cbq_42' })
  })

  it('injects a flat receiver_user_id for the editEphemeral family', async () => {
    const { urls, httpClient } = recordingClient()
    const tg = new Telegram({ token: 'X', httpClient })

    await tg.ephemeral(5).editEphemeralMessageText({ chat_id: 1, ephemeral_message_id: 2, text: 'x' })

    expect(urls[0]).toContain('receiver_user_id=5')
    expect(urls[0]).not.toContain('ephemeral_message_parameters')
  })

  it('leaves methods that accept neither shape alone', async () => {
    const { urls, httpClient } = recordingClient()
    const tg = new Telegram({ token: 'X', httpClient })

    await tg.ephemeral(5).getMe()

    expect(urls[0]).not.toContain('receiver_user_id')
    expect(urls[0]).not.toContain('ephemeral_message_parameters')
  })

  it('does not throw on a method missing from METHOD_PARAMS', async () => {
    const { urls, httpClient } = recordingClient()
    const tg = new Telegram({ token: 'X', httpClient })

    await tg.ephemeral(5).call('someFutureMethod', { chat_id: 1 })

    expect(urls[0]).toContain('someFutureMethod')
    expect(urls[0]).not.toContain('receiver_user_id')
  })

  it('refuses a message-creating method telegram cannot scope', () => {
    const { urls, httpClient } = recordingClient()
    const tg = new Telegram({ token: 'X', httpClient })

    expect(() => tg.ephemeral(5).sendDice({ chat_id: 1 })).toThrow(TypeError)
    expect(() => tg.ephemeral(5).sendMediaGroup({ chat_id: 1, media: [] })).toThrow(/whole chat/)
    expect(urls).toHaveLength(0)
  })

  it('does not affect the unscoped tg.api', async () => {
    const { urls, httpClient } = recordingClient()
    const tg = new Telegram({ token: 'X', httpClient })

    await tg.api.sendMessage({ chat_id: 1, text: 'x' })

    expect(urls[0]).not.toContain('ephemeral_message_parameters')
  })
})
