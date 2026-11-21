import { describe, it, expect, expectTypeOf, vi } from 'vitest'

import { InputMedia, MediaSource, MessageUpdate, type ApiResponseError, type WidgetLike } from '../../src'
import { Telegram } from '../../src/telegram'

const stubApi = (tg: Telegram, method: string, returns: unknown = undefined) => {
  const fn = vi.fn().mockResolvedValue(returns)

  Object.defineProperty(tg, 'api', {
    value: { [method]: fn },
    configurable: true
  })

  return fn
}

describe('tg.<verb> shortcuts', () => {
  it('tg.send returns a message that edits the sent target', async () => {
    const tg = new Telegram({ token: 'X' })
    const raw = { message_id: 42, date: 0, chat: { id: 123, type: 'private' }, text: 'hi' }
    const fn = stubApi(tg, 'sendMessage', raw)
    const edit = vi.fn().mockResolvedValue({ ...raw, text: 'done' })

    Object.assign(tg.api, { editMessageText: edit })

    const sent = await tg.send(123, 'hi')

    expect(sent).toBeInstanceOf(MessageUpdate)
    expect(sent.raw).toBe(raw)
    await sent.edit('done')
    expect(fn).toHaveBeenCalledWith({ chat_id: 123, text: 'hi' })
    expect(edit).toHaveBeenCalledWith({ chat_id: 123, message_id: 42, text: 'done' })
  })

  it('tg.send merges optional params', async () => {
    const tg = new Telegram({ token: 'X' })
    const fn = stubApi(tg, 'sendMessage', { id: 1 })

    await tg.send(456, 'hi', { parse_mode: 'HTML' })
    expect(fn).toHaveBeenCalledWith({ chat_id: 456, text: 'hi', parse_mode: 'HTML' })
  })

  it('tg.forward returns a wrapper bound to the destination message', async () => {
    const tg = new Telegram({ token: 'X' })
    const raw = { message_id: 42, date: 0, chat: { id: 200, type: 'private' } }
    const fn = stubApi(tg, 'forwardMessage', raw)

    const sent = await tg.forward(100, 200, 1)

    expect(sent).toBeInstanceOf(MessageUpdate)
    expect(sent.id).toBe(42)
    expect(sent.chat.id).toBe(200)
    expect(fn).toHaveBeenCalledWith({ from_chat_id: 100, chat_id: 200, message_id: 1 })
  })

  it('tg.delete delegates to deleteMessage', async () => {
    const tg = new Telegram({ token: 'X' })
    const fn = stubApi(tg, 'deleteMessage', true)

    await tg.delete(123, 456)
    expect(fn).toHaveBeenCalledWith({ chat_id: 123, message_id: 456 })
  })

  it('tg.sendMedia returns editable photo messages', async () => {
    const tg = new Telegram({ token: 'X' })
    const raw = { message_id: 9, date: 0, chat: { id: 123, type: 'private' } }
    const fn = stubApi(tg, 'sendPhoto', raw)
    const edit = vi.fn().mockResolvedValue(raw)

    Object.assign(tg.api, { editMessageCaption: edit })

    const sent = await tg.sendMedia(123, InputMedia.photo('attach://x', { caption: 'c' }))

    await sent.editCaption({ caption: 'done' })
    expectTypeOf(sent).toEqualTypeOf<MessageUpdate>()
    expect(sent.raw).toBe(raw)
    expect(fn).toHaveBeenCalledWith({ chat_id: 123, photo: 'attach://x', caption: 'c' })
    expect(edit).toHaveBeenCalledWith({ chat_id: 123, message_id: 9, caption: 'done' })
  })

  it('tg.sendMedia routes a synthetic sticker to api.sendSticker', async () => {
    const tg = new Telegram({ token: 'X' })
    const fn = stubApi(tg, 'sendSticker', { id: 10 })
    const m = MediaSource.fileId('cat')

    await tg.sendMedia(456, InputMedia.sticker(m))
    expect(fn).toHaveBeenCalledWith({ chat_id: 456, sticker: m })
  })

  it('returns suppressed media errors unchanged and throws without suppression', async () => {
    const error = { ok: false, error_code: 403, description: 'Forbidden' }
    const tg = new Telegram({
      token: 'X',
      httpClient: { request: async () => ({ status: 403, json: async () => error }) }
    })
    const media = InputMedia.sticker(MediaSource.fileId('cat'))
    const result = await tg.sendMedia(456, media, { suppress: true })

    expectTypeOf(result).toEqualTypeOf<MessageUpdate | ApiResponseError>()
    expect(result).toBe(error)
    expect(Telegram.isErrorResponse(result)).toBe(true)

    const unsuppressed = tg.sendMedia(456, media, { suppress: false })

    expectTypeOf(unsuppressed).toEqualTypeOf<Promise<MessageUpdate>>()
    await expect(unsuppressed).rejects.toMatchObject({ code: 403 })

    const raw = { message_id: 9, date: 1, chat: { id: 456, type: 'private' } }

    stubApi(tg, 'sendSticker', raw)

    const sent = await tg.sendMedia(456, media, { suppress: true })

    if (Telegram.isErrorResponse(sent)) {
      throw new Error(sent.description)
    }

    expect(sent).toBeInstanceOf(MessageUpdate)
    expect(sent.raw).toBe(raw)
  })

  it('preserves non-message results supplied by response hooks', async () => {
    const raw = { message_id: 9, date: 1, chat: { id: 123, type: 'private' } }
    const tg = new Telegram({
      token: 'X',
      httpClient: { request: async () => ({ status: 200, json: async () => ({ ok: true, result: raw }) }) }
    })
    const intercepted = { queued: true }

    tg.useHook('onResponseIntercept', async (ctx, next) => {
      ctx.json = { ok: true, result: intercepted }
      await next()
    })

    expect(await tg.send(123, 'hi')).toBe(intercepted)
    expect(await tg.sendMedia(123, InputMedia.photo('cat'))).toBe(intercepted)
  })

  it('wraps rendered, raw HTML and shared widget sends while preserving their wire params', async () => {
    const tg = new Telegram({ token: 'X' })
    const raw = { message_id: 42, date: 1, chat: { id: 123, type: 'private' }, widget: { id: 'score' } }
    const send = stubApi(tg, 'sendWidget', raw)
    const sendShared = vi.fn().mockResolvedValue(raw)
    const wire = { html: '<p>score</p>', chat_data: '{"count":1}', public_data: '', is_shared: true }
    const content = vi.fn().mockReturnValue(wire)
    const widget: WidgetLike<{ count: number }, string> = { content }
    const options = { chat: { count: 1 }, public: null, shared: true }

    Object.assign(tg.api, { sendSharedWidget: sendShared })

    const rendered = await tg.sendWidget(123, widget, options)
    const html = await tg.sendWidget(123, '<p>plain</p>', { public_data: 'raw' })
    const shared = await tg.sendSharedWidget(123, 'score', { chat_data: 'value' })

    expect(content).toHaveBeenCalledWith(options)
    expect(send).toHaveBeenNthCalledWith(1, { chat_id: 123, ...wire })
    expect(send).toHaveBeenNthCalledWith(2, { chat_id: 123, html: '<p>plain</p>', public_data: 'raw' })
    expect(sendShared).toHaveBeenCalledWith({ chat_id: 123, widget_id: 'score', chat_data: 'value' })

    for (const sent of [rendered, html, shared]) {
      expect(sent).toBeInstanceOf(MessageUpdate)
      expect(sent.raw).toBe(raw)
      expect(sent.widget?.id).toBe('score')
    }
  })

  it('wraps positional photo and album shortcuts consistently', async () => {
    const tg = new Telegram({ token: 'X' })
    const raw = { message_id: 42, date: 0, chat: { id: 123, type: 'private' } }

    stubApi(tg, 'sendPhoto', raw)
    Object.assign(tg.api, { sendMediaGroup: vi.fn().mockResolvedValue([raw, { ...raw, message_id: 43 }]) })

    const photo = await tg.sendPhoto(123, MediaSource.fileId('photo-id'))
    const album = await tg.sendMediaGroup(123, [InputMedia.photo('photo-id'), InputMedia.photo('other-id')])

    expect(photo).toBeInstanceOf(MessageUpdate)
    expect(photo.raw).toBe(raw)
    expect(album.every(item => item instanceof MessageUpdate)).toBe(true)
    expect(album.map(item => item.id)).toEqual([42, 43])
  })

  it('tg.sendMedia throws on unknown media type', () => {
    const tg = new Telegram({ token: 'X' })

    expect(
      () => tg.sendMedia(1, { type: 'bogus' as 'photo', media: 'x' })
    ).toThrow(/unsupported media type/)
  })

  it('sends chat actions through the advertised client method', async () => {
    const tg = new Telegram({ token: 'X' })
    const action = stubApi(tg, 'sendChatAction', true)

    expect(await tg.sendChatAction(123, 'typing')).toBe(true)
    expect(action).toHaveBeenCalledWith({ chat_id: 123, action: 'typing' })
  })

  it('supports bulk forwarding, copying and deletion with honest raw results', async () => {
    const tg = new Telegram({ token: 'X' })
    const ids = [{ message_id: 40 }, { message_id: 41 }]
    const forward = stubApi(tg, 'forwardMessages', ids)
    const copy = vi.fn().mockResolvedValue(ids)
    const remove = vi.fn().mockResolvedValue(true)

    Object.assign(tg.api, { copyMessages: copy, deleteMessages: remove })

    expect(await tg.forwardMany(100, 200, [7, 8])).toBe(ids)
    expect(await tg.copyMany(100, 200, [7, 8], { remove_caption: true })).toBe(ids)
    expect(await tg.deleteMany(200, [40, 41])).toBe(true)
    expect(forward).toHaveBeenCalledWith({ from_chat_id: 100, chat_id: 200, message_ids: [7, 8] })
    expect(copy).toHaveBeenCalledWith({ from_chat_id: 100, chat_id: 200, message_ids: [7, 8], remove_caption: true })
    expect(remove).toHaveBeenCalledWith({ chat_id: 200, message_ids: [40, 41] })
  })
})
