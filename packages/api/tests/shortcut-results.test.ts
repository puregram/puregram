import { describe, expect, it, vi } from 'vitest'

import { TELEGRAM_SHORTCUTS } from '../src/generated/shortcuts'
import { CallbackQueryUpdate, MessageUpdate, wrapMessageResult } from '../src/generated/updates'
import type { TelegramMessage } from '../src/generated/types'
import type { TelegramLike } from '../src/telegram-like'
import type { WidgetLike } from '../src/widget-like'

function message (id: number, extra: Partial<TelegramMessage> = {}): TelegramMessage {
  return { message_id: id, date: 1, chat: { id: -100, type: 'supergroup' }, ...extra }
}

function fixture (sent: TelegramMessage = message(42)) {
  const api = {
    sendMessage: vi.fn().mockResolvedValue(sent),
    sendPhoto: vi.fn().mockResolvedValue(sent),
    sendWidget: vi.fn().mockResolvedValue(sent),
    sendSharedWidget: vi.fn().mockResolvedValue(sent),
    sendMediaGroup: vi.fn().mockResolvedValue([sent, message(43)]),
    editMessageText: vi.fn().mockResolvedValue({ ...sent, text: 'done' }),
    editMessageCaption: vi.fn().mockResolvedValue(sent),
    editEphemeralMessageText: vi.fn().mockResolvedValue(true),
    deleteMessage: vi.fn().mockResolvedValue(true)
  }
  const tg = { api } as unknown as TelegramLike

  return { api, tg, source: new MessageUpdate(message(7), tg) }
}

describe('editable shortcut results', () => {
  it('edits and deletes the returned reply rather than the incoming message', async () => {
    const raw = message(42, { business_connection_id: 'business' })
    const { api, tg, source } = fixture(raw)
    const sent = await source.reply('working')

    expect(sent).toBeInstanceOf(MessageUpdate)
    expect(sent.raw).toBe(raw)
    expect(sent.tg).toBe(tg)
    expect(sent.id).toBe(42)

    const edited = await sent.edit('done')

    expect(api.editMessageText).toHaveBeenCalledWith({
      chat_id: -100,
      message_id: 42,
      business_connection_id: 'business',
      text: 'done'
    })
    expect(edited).toBeInstanceOf(MessageUpdate)
    expect(edited).toMatchObject({ text: 'done' })
    await sent.delete()
    expect(api.deleteMessage).toHaveBeenCalledWith({ chat_id: -100, message_id: 42 })
  })

  it('returns editable media from thread-scoped replies', async () => {
    const { api, source } = fixture()

    source.raw.message_thread_id = 12

    const sent = await source.thread!.replyWithPhoto('file-id')

    await sent.editCaption({ caption: 'done' })
    expect(api.sendPhoto).toHaveBeenCalledWith({
      chat_id: -100,
      message_thread_id: 12,
      photo: 'file-id',
      reply_parameters: { message_id: 7 }
    })
    expect(api.editMessageCaption).toHaveBeenCalledWith({ chat_id: -100, message_id: 42, caption: 'done' })
  })

  it('wraps each album message so individual items can be edited', async () => {
    const { api, source } = fixture()
    const album = await source.sendMediaGroup([{ type: 'photo', media: 'file-id' }, { type: 'photo', media: 'other-id' }])

    await album[1]!.editCaption({ caption: 'second' })
    expect(album.map(item => item.id)).toEqual([42, 43])
    expect(api.editMessageCaption).toHaveBeenCalledWith({ chat_id: -100, message_id: 43, caption: 'second' })
  })

  it('wraps widget sends after encoding and retains the reply and thread anchors', async () => {
    const raw = message(42, { widget: { id: 'shared', html: '<p>counter</p>' } })
    const { source, api } = fixture(raw)
    const widget: WidgetLike<number, string> = {
      content: options => ({ html: '<p>counter</p>', chat_data: String(options?.chat) })
    }

    source.raw.message_thread_id = 12

    const sent = await source.thread!.replyWithWidget(widget, { chat: 3 })

    expect(api.sendWidget).toHaveBeenCalledWith({
      chat_id: -100, message_thread_id: 12, html: '<p>counter</p>',
      chat_data: '3', reply_parameters: { message_id: 7 }
    })
    expect(sent).toBeInstanceOf(MessageUpdate)
    expect(sent.raw).toBe(raw)
    expect(sent.widget?.id).toBe('shared')

    const shared = await source.sendSharedWidget(sent.widget!.id!)

    expect(api.sendSharedWidget).toHaveBeenCalledWith({ chat_id: -100, widget_id: 'shared' })
    expect(shared).toBeInstanceOf(MessageUpdate)
    expect(shared.raw).toBe(raw)
  })

  it('installs only shared-widget sending via the generic shortcut registry', () => {
    expect(TELEGRAM_SHORTCUTS.map(sc => sc.verb)).not.toContain('sendWidget')
    expect(TELEGRAM_SHORTCUTS).toContainEqual({
      verb: 'sendSharedWidget', method: 'sendSharedWidget', args: ['chat_id', 'widget_id'], wrapsMessage: true
    })
  })

  it('leaves suppressed errors, non-message hook results and message IDs untouched', () => {
    const { tg } = fixture()

    for (const value of [true, null, { ok: false, error_code: 400 }, { message_id: 5 }, [{ message_id: 5 }]]) {
      expect(wrapMessageResult(value, tg)).toBe(value)
    }
  })

  it('edits callback-only ephemeral replies through the true-returning twin', async () => {
    const sentRaw = message(0, {
      ephemeral_message_id: 77,
      from: { id: 1, is_bot: true, first_name: 'bot' },
      receiver_user: { id: 5, is_bot: false, first_name: 'user' }
    })
    const { api, tg } = fixture(sentRaw)
    const callback = new CallbackQueryUpdate({
      id: 'query', from: { id: 5, is_bot: false, first_name: 'user' },
      inline_message_id: 'inline', chat_instance: 'chat'
    }, tg)
    const sent = await callback.send('private', { ephemeral: true })

    expect(api.sendMessage).toHaveBeenCalledWith({
      text: 'private', ephemeral_message_parameters: { callback_query_id: 'query' }
    })
    expect(sent.raw).toBe(sentRaw)
    expect(await sent.edit('done')).toBe(true)
    expect(api.editEphemeralMessageText).toHaveBeenCalledWith({
      chat_id: -100,
      receiver_user_id: 5,
      ephemeral_message_id: 77,
      text: 'done'
    })
    expect(api.editMessageText).not.toHaveBeenCalled()
  })

  it('wraps callback edits but preserves the inline true result', async () => {
    const { api, tg } = fixture()
    const query = { id: 'query', from: { id: 5, is_bot: false, first_name: 'user' }, chat_instance: 'chat' }
    const callback = new CallbackQueryUpdate({ ...query, message: message(42) }, tg)
    const edited = await callback.edit('done')

    expect(edited).toBeInstanceOf(MessageUpdate)

    api.editMessageText.mockResolvedValueOnce(true)

    const inline = new CallbackQueryUpdate({ ...query, inline_message_id: 'inline' }, tg)

    expect(await inline.edit('done')).toBe(true)
    expect(api.editMessageText).toHaveBeenLastCalledWith({ inline_message_id: 'inline', text: 'done' })
  })
})
