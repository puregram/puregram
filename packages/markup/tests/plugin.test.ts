import { afterEach, describe, expect, it } from 'vitest'

import { bankCardNumber, bold, format, html, markup, tonAddress } from '../src'

import type { MockTelegram } from './helpers/make-tg'
import { makeTg } from './helpers/make-tg'

const sentMessage = {
  message_id: 1,
  date: 0,
  chat: { id: 1, type: 'private' as const }
}

let activeMock: MockTelegram | undefined

afterEach(async () => {
  await activeMock?.stop()
  activeMock = undefined
})

describe('@puregram/markup — plugin e2e', () => {
  it('rewrites text + entities for sendMessage', async () => {
    const { tg, mock } = await makeTg(t => t.extend(markup()))

    activeMock = mock

    await tg.start()

    let captured: Record<string, unknown> | undefined

    mock.expect('sendMessage', (params) => {
      captured = params

      return { ok: true, result: sentMessage }
    })

    await tg.api.sendMessage({ chat_id: 1, text: format`hello ${bold('world')}!` })

    expect(captured!.text).toBe('hello world!')
    expect(captured!.entities).toEqual([{ type: 'bold', offset: 6, length: 5 }])
  })

  it('preserves TON/card entities in text, captions, and nested reply quotes', async () => {
    const { tg, mock } = await makeTg(t => t.extend(markup()))

    activeMock = mock

    const address = 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c'
    const text = format`💎 ${tonAddress(address)} ${bankCardNumber('4242 4242 4242 4242')}`
    const payload = text.toPayload()
    const captured: Record<string, unknown>[] = []

    mock.expect('sendMessage', (params) => {
      captured.push(params)

      return { ok: true, result: sentMessage }
    })
    mock.expect('editMessageCaption', (params) => {
      captured.push(params)

      return { ok: true, result: sentMessage }
    })

    await tg.api.sendMessage({
      chat_id: 1, text, reply_parameters: { message_id: 2, quote: text }
    })
    await tg.api.editMessageCaption({ chat_id: 1, message_id: 1, caption: text })

    expect(captured[0]!.text).toBe(payload.text)
    expect(captured[0]!.entities).toEqual(payload.entities)
    expect(captured[0]!.reply_parameters).toEqual({
      message_id: 2, quote: payload.text, quote_entities: payload.entities
    })
    expect(captured[1]!.caption).toBe(payload.text)
    expect(captured[1]!.caption_entities).toEqual(payload.entities)
    expect(text.toPayload()).toEqual(payload)
  })

  it('rewrites caption + caption_entities for editMessageCaption', async () => {
    const { tg, mock } = await makeTg(t => t.extend(markup()))

    activeMock = mock

    await tg.start()

    let captured: Record<string, unknown> | undefined

    mock.expect('editMessageCaption', (params) => {
      captured = params

      return { ok: true, result: sentMessage }
    })

    await tg.api.editMessageCaption({ chat_id: 1, message_id: 1, caption: html`<b>hi</b>` })

    expect(captured!.caption).toBe('hi')
    expect(captured!.caption_entities).toEqual([{ type: 'bold', offset: 0, length: 2 }])
  })

  it('leaves params untouched when no Formatted is passed', async () => {
    const { tg, mock } = await makeTg(t => t.extend(markup()))

    activeMock = mock

    await tg.start()

    let captured: Record<string, unknown> | undefined

    mock.expect('sendMessage', (params) => {
      captured = params

      return { ok: true, result: sentMessage }
    })

    await tg.api.sendMessage({ chat_id: 1, text: 'plain text' })

    expect(captured!.text).toBe('plain text')
    expect(captured!.entities).toBeUndefined()
  })

  it('rewrites raw {text, entities} object too (not just Formatted instances)', async () => {
    const { tg, mock } = await makeTg(t => t.extend(markup()))

    activeMock = mock

    await tg.start()

    let captured: Record<string, unknown> | undefined

    mock.expect('sendMessage', (params) => {
      captured = params

      return { ok: true, result: sentMessage }
    })

    await tg.api.sendMessage({
      chat_id: 1,
      text: { text: 'raw', entities: [{ type: 'italic', offset: 0, length: 3 }] }
    })

    expect(captured!.text).toBe('raw')
    expect(captured!.entities).toEqual([{ type: 'italic', offset: 0, length: 3 }])
  })

  it('rewrites album captions for sendMediaGroup', async () => {
    const { tg, mock } = await makeTg(t => t.extend(markup()))

    activeMock = mock

    let captured: Record<string, unknown> | undefined

    tg.useHook('onRequestIntercept', (ctx, next) => {
      captured = ctx.params

      return next()
    })

    await tg.start()

    mock.expect('sendMediaGroup', () => ({ ok: true, result: [sentMessage] }))

    await tg.api.sendMediaGroup({
      chat_id: 1,
      media: [
        { type: 'photo', media: 'file_1', caption: format`album ${bold('caption')}` },
        { type: 'photo', media: 'file_2', caption: 'plain' }
      ]
    })

    const media = captured!.media as Record<string, unknown>[]

    expect(media[0]!.caption).toBe('album caption')
    expect(media[0]!.caption_entities).toEqual([{ type: 'bold', offset: 6, length: 7 }])
    expect(media[1]!.caption).toBe('plain')
  })

  it('unwraps a Formatted on a direct api call made before start()', async () => {
    const { tg, mock } = await makeTg(t => t.extend(markup()))

    activeMock = mock

    let captured: Record<string, unknown> | undefined

    mock.expect('sendMessage', (params) => {
      captured = params

      return { ok: true, result: sentMessage }
    })

    await tg.api.sendMessage({ chat_id: 1, text: format`hi ${bold('there')}` })

    expect(captured!.text).toBe('hi there')
    expect(captured!.entities).toEqual([{ type: 'bold', offset: 3, length: 5 }])
  })
})
