import { describe, expect, it, vi } from 'vitest'

import {
  CallbackQueryUpdate, hasEntities, hasMessage, hasPinnedMessage, MessageEntities, MessageUpdate,
  type TelegramLike, type TelegramMessage
} from '../src'

function message (extra: Partial<TelegramMessage> = {}): TelegramMessage {
  return { message_id: 7, date: 1, chat: { id: -100, type: 'supergroup' }, ...extra }
}

function transferFixture () {
  const sourceText: Record<string, string> = { '-100:7': 'original', '-200:7': 'unrelated' }
  const copies: { chat: number, text: string | undefined }[] = []
  const api = {
    forwardMessage: vi.fn(async (params: { chat_id: number, from_chat_id: number, message_id: number }) => message({
      message_id: 90,
      chat: { id: params.chat_id, type: 'supergroup' },
      text: sourceText[`${params.from_chat_id}:${params.message_id}`]!
    })),
    copyMessage: vi.fn(async (params: { chat_id: number, from_chat_id: number, message_id: number }) => {
      copies.push({ chat: params.chat_id, text: sourceText[`${params.from_chat_id}:${params.message_id}`] })

      return { message_id: 91 }
    })
  }
  const tg = { api } as unknown as TelegramLike

  return { api, copies, source: new MessageUpdate(message({ text: 'original', message_thread_id: 12 }), tg) }
}

describe('v2 context workflow parity', () => {
  it('forwards the current message to the requested destination rather than looking up its id there', async () => {
    const { source } = transferFixture()
    const forwarded = await source.forward(-200)

    expect(forwarded.text).toBe('original')
    expect(forwarded.chat.id).toBe(-200)
    expect(source.chat.id).toBe(-100)
  })

  it('copies from the current chat rather than copying an unrelated same-id message', async () => {
    const { source, copies } = transferFixture()

    expect(await source.copy(-200)).toEqual({ message_id: 91 })
    expect(copies).toEqual([{ chat: -200, text: 'original' }])
  })

  it('does not reuse a source thread id as a destination thread id', async () => {
    const { source, api } = transferFixture()

    await source.thread!.forward(-200)
    expect(api.forwardMessage).toHaveBeenLastCalledWith({ chat_id: -200, from_chat_id: -100, message_id: 7 })
    await source.thread!.forward(-200, { message_thread_id: 90 })
    expect(api.forwardMessage).toHaveBeenLastCalledWith({
      chat_id: -200, from_chat_id: -100, message_id: 7, message_thread_id: 90
    })
  })

  it('lets accessible callback messages reply using the originating message and client', async () => {
    const original = message()
    const raw = {
      update_id: 5,
      callback_query: {
        id: 'callback', from: { id: 2, is_bot: false, first_name: 'user' },
        chat_instance: 'chat', message: original
      }
    }
    const api = { sendMessage: vi.fn().mockResolvedValue(message({ message_id: 88, text: 'reply' })) }
    const tg = { api } as unknown as TelegramLike
    const callback = new CallbackQueryUpdate(raw.callback_query, tg, raw)

    expect(callback.hasAccessibleMessage()).toBe(true)

    if (!callback.hasAccessibleMessage()) {
      throw new Error('expected an accessible callback message')
    }

    const source = callback.message
    const reply = await source.reply('reply')

    expect(source.raw).toBe(original)
    expect(callback.message).toBe(source)
    expect(source.update).toBe(raw)
    expect(source.updateId).toBe(5)
    expect(reply.text).toBe('reply')
    expect(reply.updateId).toBeUndefined()
    expect(api.sendMessage).toHaveBeenCalledWith({
      chat_id: -100, text: 'reply', reply_parameters: { message_id: 7 }
    })
  })

  it('keeps inaccessible and inline callback messages distinct from actionable messages', () => {
    const tg = { api: {} } as unknown as TelegramLike
    const query = { id: 'query', from: { id: 2, is_bot: false, first_name: 'user' }, chat_instance: 'chat' }
    const inaccessible = message({ date: 0 })
    const callback = new CallbackQueryUpdate({ ...query, message: inaccessible }, tg)
    const inline = new CallbackQueryUpdate({ ...query, inline_message_id: 'inline' }, tg)

    expect(callback.hasMessage()).toBe(true)
    expect(hasMessage(callback)).toBe(true)
    expect(hasMessage(inline)).toBe(false)
    expect(callback.hasAccessibleMessage()).toBe(false)
    expect(callback.message).toBe(inaccessible)
    expect(inline.hasAccessibleMessage()).toBe(false)
    expect(inline.message).toBeUndefined()
  })

  it('preserves the accessibility of a pinned message after a presence check', () => {
    const tg = { api: {} } as unknown as TelegramLike
    const inaccessible = message({ date: 0 })
    const unavailable = new MessageUpdate(message({ pinned_message: inaccessible }), tg)
    const available = new MessageUpdate(message({ pinned_message: message() }), tg)

    expect(hasPinnedMessage(unavailable)).toBe(true)
    expect(unavailable.hasPinnedMessage()).toBe(true)
    expect(unavailable.pinnedMessage).toBe(inaccessible)
    expect(hasPinnedMessage(available)).toBe(true)
    expect(available.pinnedMessage).toBeInstanceOf(MessageUpdate)
  })

  it('exposes chainable entity collections on both text and captions', () => {
    const tg = { api: {} } as unknown as TelegramLike
    const text = new MessageUpdate(message({
      text: 'js ts', entities: [
        { type: 'pre', offset: 0, length: 2, language: 'js' },
        { type: 'pre', offset: 3, length: 2, language: 'ts' }
      ]
    }), tg)
    const caption = new MessageUpdate(message({
      caption: 'code', caption_entities: [{ type: 'code', offset: 0, length: 4 }]
    }), tg)

    expect(text.entities).toBeInstanceOf(MessageEntities)
    expect(text.entities?.only('pre').where({ language: 'ts' }).first?.offset).toBe(3)
    expect(text.entities).toBe(text.entities)
    expect(caption.captionEntities?.has('code')).toBe(true)
    expect(text.entities?.toJSON()).toEqual(text.raw.entities)

    const empty = new MessageUpdate(message({ entities: [] }), tg)

    expect(hasEntities(empty)).toBe(true)
    expect(empty.hasEntities()).toBe(false)
    expect(empty.entities?.isEmpty()).toBe(true)
    expect(hasEntities(caption)).toBe(false)
    expect(caption.entities).toBeUndefined()
  })

  it('exposes entity collections on nested structures', () => {
    const tg = { api: {} } as unknown as TelegramLike
    const poll = new MessageUpdate(message({
      poll: {
        id: 'poll', question: 'Pick one', type: 'regular', total_voter_count: 0, is_closed: false,
        is_anonymous: true, allows_multiple_answers: false, allows_revoting: false, members_only: false,
        options: [
          {
            persistent_id: 'first', text: '\u{1F642}',
            text_entities: [{ type: 'custom_emoji', offset: 0, length: 2, custom_emoji_id: 'emoji' }],
            voter_count: 0
          },
          { persistent_id: 'second', text: 'None', voter_count: 0 }
        ]
      }
    }), tg).poll
    const option = poll?.options.byId('first')

    expect(option?.hasTextEntities()).toBe(true)
    expect(option?.textEntities?.only('custom_emoji').first?.customEmojiId).toBe('emoji')
  })

  it('prefers animation and live photo over their compatibility attachments', async () => {
    const download = vi.fn().mockResolvedValue(new Uint8Array())
    const tg = { api: {}, download } as unknown as TelegramLike
    const animation = new MessageUpdate(message({
      animation: { file_id: 'animation', file_unique_id: 'unique', width: 10, height: 20, duration: 1 },
      document: { file_id: 'compatibility', file_unique_id: 'unique' }
    }), tg)
    const photo = new MessageUpdate(message({
      photo: [{ file_id: 'photo', file_unique_id: 'photo-unique', width: 10, height: 20 }]
    }), tg)
    const live = new MessageUpdate(message({
      photo: photo.raw.photo!,
      live_photo: { file_id: 'live', file_unique_id: 'live-unique', width: 10, height: 20, duration: 1 }
    }), tg)
    const plain = new MessageUpdate(message({ text: 'plain' }), tg)

    expect(animation.hasAttachmentType('animation')).toBe(true)
    expect(animation.attachment).toBe(animation.animation)
    expect(animation.hasAttachmentType('document')).toBe(false)
    await animation.download()
    expect(download).toHaveBeenLastCalledWith(animation.raw.animation)
    expect(live.hasAttachmentType('live_photo')).toBe(true)
    expect(live.hasAttachmentType('photo')).toBe(false)
    expect(live.attachment).toBe(live.livePhoto)
    await live.download()
    expect(download).toHaveBeenLastCalledWith(live.raw.live_photo)
    expect(photo.hasAttachmentType('photo')).toBe(true)
    expect(photo.attachment).toBe(photo.photo)
    expect(plain.hasAttachment()).toBe(false)
    expect(plain.attachment).toBeUndefined()
  })
})
