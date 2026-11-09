import { MessageUpdate } from '@puregram/api'
import { Telegram } from 'puregram'
import { describe, expect, it } from 'vitest'

import { defineWidget, html, json, raw, text, WidgetStateTooLargeError, WidgetTooLargeError } from '../src'

function client() {
  const calls: Record<string, string>[] = []
  const tg = new Telegram({
    token: 'test',
    httpClient: {
      async request({ url, init }) {
        const request = new Request(url, init)
        const params = init.body == null
          ? Object.fromEntries(new URL(url).searchParams)
          : request.headers.get('content-type')?.includes('application/json') === true
            ? await request.json() as Record<string, string>
            : Object.fromEntries(await request.formData()) as Record<string, string>

        calls.push(params)

        return { status: 200, json: async () => ({ ok: true, result: { message_id: calls.length } }) }
      }
    }
  })

  return { tg, calls }
}

const Counter = defineWidget({
  html: html`<p>${'<counter>'}</p>`,
  chat: json<{ count: number }>(),
  public: text()
})

describe('contextual widget sending', () => {
  it('encodes typed state and flags through client and message shortcuts without leaking local options', async () => {
    const { tg, calls } = client()
    const message = new MessageUpdate({ message_id: 12, date: 0, chat: { id: 42, type: 'private' } }, tg)

    await tg.sendWidget(42, Counter, { chat: { count: 1 }, public: 'hello', shared: true, allowQueries: true })
    await message.sendWidget(Counter, { chat: { count: 2 }, public: null, caption: 'counter' })

    expect(calls[0]).toMatchObject({
      chat_id: '42', html: '<p>&lt;counter&gt;</p>', chat_data: '{"count":1}', public_data: 'hello',
      is_shared: 'true', allow_queries: 'true'
    })
    expect(calls[1]).toMatchObject({
      chat_id: '42', html: '<p>&lt;counter&gt;</p>', chat_data: '{"count":2}', public_data: '', caption: 'counter'
    })

    for (const params of calls) {
      for (const key of ['chat', 'public', 'shared', 'allowQueries']) expect(params).not.toHaveProperty(key)
    }
  })

  it('preserves topic and reply anchors while encoding widget state', async () => {
    const { tg, calls } = client()
    const message = new MessageUpdate({
      message_id: 12, date: 0, chat: { id: 42, type: 'private' }, message_thread_id: 7
    }, tg)

    const thread = message.thread

    if (thread === undefined) throw new Error('expected a topic-scoped message')

    await thread.replyWithWidget(Counter, { chat: { count: 3 }, reply_parameters: { quote: 'original' } })

    expect(calls[0]).toMatchObject({ chat_id: '42', message_thread_id: '7', chat_data: '{"count":3}' })
    expect(JSON.parse(calls[0]!.reply_parameters!)).toEqual({ message_id: 12, quote: 'original' })
  })

  it('rejects oversized state or html before any request is sent', () => {
    const { tg, calls } = client()
    const message = new MessageUpdate({ message_id: 12, date: 0, chat: { id: 42, type: 'private' } }, tg)
    const large = defineWidget({ html: raw('x'.repeat(32769)) })

    expect(() => tg.sendWidget(42, Counter, { public: 'x'.repeat(1025) })).toThrow(WidgetStateTooLargeError)
    expect(() => message.sendWidget(large)).toThrow(WidgetTooLargeError)
    expect(calls).toEqual([])
  })
})
