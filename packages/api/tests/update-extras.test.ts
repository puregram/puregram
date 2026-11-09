import { describe, expect, it, vi } from 'vitest'

import type { TelegramLike } from '../src'
import {
  CallbackQueryUpdate,
  InlineQueryUpdate,
  MessageUpdate,
  PollAnswerUpdate,
  PreCheckoutQueryUpdate,
  WidgetQueryUpdate
} from '../src/generated/updates'

const noTg = {} as TelegramLike
const myBotTg = { bot: { id: 1, is_bot: true, first_name: 'b', username: 'MyBot' } } as TelegramLike

function messageWith (text: string, entities: { type: string, offset: number, length: number }[] | undefined, tg = noTg) {
  return new MessageUpdate({
    message_id: 1,
    date: 0,
    chat: { id: 100, type: 'private' },
    text,
    entities: entities as never
  }, tg)
}

function startCommand (text: string, entityLength: number, tg = noTg) {
  return messageWith(text, [{ type: 'bot_command', offset: 0, length: entityLength }], tg)
}

describe('startPayload', () => {
  it('extracts the deep-link payload after /start', () => {
    const update = startCommand('/start ref-42', 6)

    expect(update.startPayload).toBe('ref-42')
    expect(update.hasStartPayload()).toBe(true)
  })

  it('accepts a /start@bot mention addressed to this bot, case-insensitively', () => {
    const update = startCommand('/start@mybot ref-42', 12, myBotTg)

    expect(update.startPayload).toBe('ref-42')
  })

  it('rejects a mention addressed to a different bot', () => {
    const update = startCommand('/start@otherbot ref-42', 15, myBotTg)

    expect(update.startPayload).toBeUndefined()
  })

  it('rejects a mention when the bot identity is unknown', () => {
    const update = startCommand('/start@mybot ref-42', 12)

    expect(update.startPayload).toBeUndefined()
  })

  it('is undefined for a bare /start', () => {
    const update = startCommand('/start', 6)

    expect(update.startPayload).toBeUndefined()
    expect(update.hasStartPayload()).toBe(false)
  })

  it('is undefined for commands other than /start', () => {
    const update = startCommand('/started xyz', 8)

    expect(update.startPayload).toBeUndefined()
  })

  it('requires the bot_command entity at offset 0 — quoted commands do not match', () => {
    const update = messageWith('try /start abc', [{ type: 'bot_command', offset: 4, length: 6 }])

    expect(update.startPayload).toBeUndefined()
  })

  it('finds the bot_command even when another entity is ordered first', () => {
    const update = messageWith('/start ref-42', [
      { type: 'bold', offset: 0, length: 13 },
      { type: 'bot_command', offset: 0, length: 6 }
    ])

    expect(update.startPayload).toBe('ref-42')
  })

  it('fails safe on a malformed entity length', () => {
    const update = messageWith('/startXXX /start tail', [{ type: 'bot_command', offset: 0, length: -15 }])

    expect(update.startPayload).toBeUndefined()
  })

  it('is undefined without a bot_command entity', () => {
    const update = messageWith('/start abc', undefined)

    expect(update.startPayload).toBeUndefined()
  })
})

describe('uniform senderId', () => {
  it('callback_query exposes senderId alongside the userId alias', () => {
    const update = new CallbackQueryUpdate({
      id: 'q1',
      from: { id: 42, is_bot: false, first_name: 'u' },
      chat_instance: 'ci'
    }, noTg)

    expect(update.senderId).toBe(42)
    expect(update.userId).toBe(42)
  })

  it('inline_query and pre_checkout_query expose senderId', () => {
    const inline = new InlineQueryUpdate({
      id: 'i1',
      from: { id: 7, is_bot: false, first_name: 'u' },
      query: '',
      offset: ''
    }, noTg)
    const preCheckout = new PreCheckoutQueryUpdate({
      id: 'p1',
      from: { id: 9, is_bot: false, first_name: 'u' },
      currency: 'XTR',
      total_amount: 1,
      invoice_payload: 'x'
    }, noTg)

    expect(inline.senderId).toBe(7)
    expect(preCheckout.senderId).toBe(9)
  })

  it('poll_answer falls back from user to voter_chat', () => {
    const byUser = new PollAnswerUpdate({
      poll_id: 'p',
      option_ids: [0],
      option_persistent_ids: ['0'],
      user: { id: 5, is_bot: false, first_name: 'u' }
    }, noTg)
    const byChat = new PollAnswerUpdate({
      poll_id: 'p',
      option_ids: [0],
      option_persistent_ids: ['0'],
      voter_chat: { id: -100123, type: 'channel' }
    }, noTg)

    expect(byUser.senderId).toBe(5)
    expect(byChat.senderId).toBe(-100123)
  })
})

describe('callback query edit family', () => {
  const from = { id: 42, is_bot: false, first_name: 'u' }

  function chatQuery (api: Record<string, unknown>) {
    return new CallbackQueryUpdate({
      id: 'q1',
      from,
      chat_instance: 'ci',
      message: { message_id: 7, date: 1, chat: { id: 100, type: 'private' } }
    }, { api } as unknown as TelegramLike)
  }

  function inlineQuery (api: Record<string, unknown>) {
    return new CallbackQueryUpdate({
      id: 'q1',
      from,
      chat_instance: 'ci',
      inline_message_id: 'IM1'
    }, { api } as unknown as TelegramLike)
  }

  it('edit fills chat_id + message_id from the originating message', async () => {
    const editMessageText = vi.fn().mockResolvedValue({})

    await chatQuery({ editMessageText }).edit('next page', { reply_markup: { inline_keyboard: [] } })

    expect(editMessageText).toHaveBeenCalledWith({
      chat_id: 100,
      message_id: 7,
      text: 'next page',
      reply_markup: { inline_keyboard: [] }
    })
  })

  it('edit falls back to inline_message_id for inline-mode messages', async () => {
    const editMessageText = vi.fn().mockResolvedValue({})

    await inlineQuery({ editMessageText }).edit('next page')

    expect(editMessageText).toHaveBeenCalledWith({
      inline_message_id: 'IM1',
      text: 'next page'
    })
  })

  it('editReplyMarkup swaps the keyboard in place', async () => {
    const editMessageReplyMarkup = vi.fn().mockResolvedValue({})

    await chatQuery({ editMessageReplyMarkup }).editReplyMarkup({ reply_markup: { inline_keyboard: [] } })

    expect(editMessageReplyMarkup).toHaveBeenCalledWith({
      chat_id: 100,
      message_id: 7,
      reply_markup: { inline_keyboard: [] }
    })
  })

  it('delete targets the originating message and rejects inline-mode messages', async () => {
    const deleteMessage = vi.fn().mockResolvedValue(true)

    await chatQuery({ deleteMessage }).delete()

    expect(deleteMessage).toHaveBeenCalledWith({ chat_id: 100, message_id: 7 })
    expect(() => inlineQuery({ deleteMessage }).delete()).toThrow(TypeError)
  })
})

describe('widget query message ids', () => {
  it.each([undefined, 42])('keeps the query id distinct from message id %s', (messageId) => {
    const query = new WidgetQueryUpdate({
      id: 'widget-query-1',
      from: { id: 1, is_bot: false, first_name: 'ann' },
      chat_instance: 'chat-instance',
      type: { type: 'data' },
      data: 'tap',
      ...messageId === undefined ? {} : { message_id: messageId }
    }, noTg)

    expect(query.hasMessageId()).toBe(messageId !== undefined)
    expect(query.messageId).toBe(messageId)
    expect(query.id).toBe('widget-query-1')

    if (query.hasMessageId()) {
      const id: number = query.messageId
      const queryId: string = query.id

      expect(id).toBe(messageId)
      expect(queryId.toUpperCase()).toBe('WIDGET-QUERY-1')
    }
  })
})
