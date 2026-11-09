import { describe, expect, it } from 'vitest'

import { callbackEphemeralParams } from '../src/ephemeral'
import { MessageUpdate, CallbackQueryUpdate } from '../src/generated/updates'
import type { TelegramLike } from '../src/telegram-like'

function recordingTg () {
  const calls: { method: string, params: Record<string, unknown> }[] = []
  const api = new Proxy({}, {
    get: (_target, method: string) => (params: Record<string, unknown>) => {
      calls.push({ method, params })

      return Promise.resolve(true)
    }
  })

  return { tg: { api } as unknown as TelegramLike, calls }
}

const EPHEMERAL_RAW = {
  message_id: 10,
  ephemeral_message_id: 77,
  date: 0,
  chat: { id: -100, type: 'supergroup' as const },
  from: { id: 5, is_bot: false, first_name: 'u' },
  text: '/whisper'
}

const REGULAR_RAW = {
  message_id: 10,
  date: 0,
  chat: { id: -100, type: 'supergroup' as const },
  from: { id: 5, is_bot: false, first_name: 'u' },
  text: 'hi'
}

describe('ephemeral send injection', () => {
  it('fills ephemeral_message_parameters and the reply anchor on sends from an ephemeral message', async () => {
    const { tg, calls } = recordingTg()
    const update = new MessageUpdate(EPHEMERAL_RAW as never, tg)

    await update.send('psst')

    expect(calls[0]!.params).toMatchObject({
      chat_id: -100,
      text: 'psst',
      ephemeral_message_parameters: { receiver_user_id: 5 },
      reply_parameters: { ephemeral_message_id: 77 }
    })
    expect(calls[0]!.params).not.toHaveProperty('message_id')
  })

  it('targets the human even when receiver_user is set (incoming commands carry the bot there)', async () => {
    const { tg, calls } = recordingTg()
    const raw = { ...EPHEMERAL_RAW, receiver_user: { id: 999, is_bot: true, first_name: 'bot' } }
    const update = new MessageUpdate(raw as never, tg)

    await update.send('psst')

    expect(calls[0]!.params.ephemeral_message_parameters).toEqual({ receiver_user_id: 5 })
  })

  it('falls back to receiver_user when from is a bot (own sent messages)', async () => {
    const { tg, calls } = recordingTg()
    const raw = {
      ...EPHEMERAL_RAW,
      from: { id: 999, is_bot: true, first_name: 'me' },
      receiver_user: { id: 9, is_bot: false, first_name: 'human' }
    }
    const update = new MessageUpdate(raw as never, tg)

    await update.delete()

    expect(calls[0]).toMatchObject({
      method: 'deleteEphemeralMessage',
      params: { receiver_user_id: 9, ephemeral_message_id: 77 }
    })
  })

  it('replies anchor to ephemeral_message_id instead of message_id', async () => {
    const { tg, calls } = recordingTg()
    const update = new MessageUpdate(EPHEMERAL_RAW as never, tg)

    await update.reply('back at you')

    expect(calls[0]!.params.reply_parameters).toEqual({ ephemeral_message_id: 77 })
  })

  it('lets explicit call-site values win', async () => {
    const { tg, calls } = recordingTg()
    const update = new MessageUpdate(EPHEMERAL_RAW as never, tg)

    await update.send('psst', {
      ephemeral_message_parameters: { receiver_user_id: 42 },
      reply_parameters: { quote: 'q' }
    })

    expect(calls[0]!.params.ephemeral_message_parameters).toEqual({ receiver_user_id: 42 })
    expect(calls[0]!.params.reply_parameters).toEqual({ ephemeral_message_id: 77, quote: 'q' })
  })

  it('keeps call-site ephemeral parameters the injection does not own', async () => {
    const { tg, calls } = recordingTg()
    const update = new MessageUpdate(EPHEMERAL_RAW as never, tg)

    await update.send('psst', { ephemeral_message_parameters: { replace_callback_query_message: true } as never })

    expect(calls[0]!.params.ephemeral_message_parameters).toEqual({
      receiver_user_id: 5,
      replace_callback_query_message: true
    })
  })

  it('contributes nothing on regular messages', async () => {
    const { tg, calls } = recordingTg()
    const update = new MessageUpdate(REGULAR_RAW as never, tg)

    await update.send('hello')

    expect(calls[0]!.params).not.toHaveProperty('ephemeral_message_parameters')
    expect(calls[0]!.params).not.toHaveProperty('reply_parameters')
  })

  it('regular replies still anchor to message_id', async () => {
    const { tg, calls } = recordingTg()
    const update = new MessageUpdate(REGULAR_RAW as never, tg)

    await update.reply('normal')

    expect(calls[0]!.params.reply_parameters).toEqual({ message_id: 10 })
  })

  it('skips injection and scrubs the flag with ephemeral: false', async () => {
    const { tg, calls } = recordingTg()
    const update = new MessageUpdate(EPHEMERAL_RAW as never, tg)

    await update.send('public response', { ephemeral: false })

    expect(calls[0]!.params).not.toHaveProperty('ephemeral_message_parameters')
    expect(calls[0]!.params).not.toHaveProperty('reply_parameters')
    expect(calls[0]!.params.ephemeral).toBeUndefined()
  })

  it('refuses ephemeral: true outside an ephemeral context', () => {
    const { tg, calls } = recordingTg()
    const update = new MessageUpdate(REGULAR_RAW as never, tg)

    expect(() => update.send('secret', { ephemeral: true })).toThrow(TypeError)
    expect(calls).toHaveLength(0)
  })

  it('exposes isEphemeral()', () => {
    const { tg } = recordingTg()

    expect(new MessageUpdate(EPHEMERAL_RAW as never, tg).isEphemeral()).toBe(true)
    expect(new MessageUpdate(REGULAR_RAW as never, tg).isEphemeral()).toBe(false)
  })
})

describe('ephemeral edit/delete routing', () => {
  it('routes edit and delete to the ephemeral twins', async () => {
    const { tg, calls } = recordingTg()
    const update = new MessageUpdate(EPHEMERAL_RAW as never, tg)

    await update.edit('new text')
    await update.delete()

    expect(calls[0]).toMatchObject({
      method: 'editEphemeralMessageText',
      params: { chat_id: -100, receiver_user_id: 5, ephemeral_message_id: 77, text: 'new text' }
    })
    expect(calls[1]).toMatchObject({
      method: 'deleteEphemeralMessage',
      params: { chat_id: -100, receiver_user_id: 5, ephemeral_message_id: 77 }
    })
    expect(calls[0]!.params).not.toHaveProperty('message_id')
  })

  it('keeps the regular variants for regular messages', async () => {
    const { tg, calls } = recordingTg()
    const update = new MessageUpdate(REGULAR_RAW as never, tg)

    await update.edit('new text')
    await update.delete()

    expect(calls[0]!.method).toBe('editMessageText')
    expect(calls[1]!.method).toBe('deleteMessage')
  })
})

describe('callback-query opt-in injection', () => {
  const CBQ_RAW = {
    id: 'q1',
    from: { id: 5, is_bot: false, first_name: 'u' },
    chat_instance: 'ci',
    message: { message_id: 10, date: 0, chat: { id: -100, type: 'supergroup' as const } }
  }

  it('fills the query id only when ephemeral parameters are passed', async () => {
    const { tg, calls } = recordingTg()
    const update = new CallbackQueryUpdate(CBQ_RAW as never, tg)

    await update.send(-100, 'public response')
    await update.send(-100, 'whisper', { ephemeral_message_parameters: { receiver_user_id: 5 } })

    expect(calls[0]!.params).not.toHaveProperty('ephemeral_message_parameters')
    expect(calls[1]!.params.ephemeral_message_parameters).toEqual({
      receiver_user_id: 5,
      callback_query_id: 'q1'
    })
  })

  it('never overrides an explicit callback_query_id', async () => {
    const { tg, calls } = recordingTg()
    const update = new CallbackQueryUpdate(CBQ_RAW as never, tg)

    await update.send(-100, 'whisper', {
      ephemeral_message_parameters: { receiver_user_id: 5, callback_query_id: 'other' }
    })

    expect(calls[0]!.params.ephemeral_message_parameters).toMatchObject({ callback_query_id: 'other' })
  })

  it('replaces the original message when the caller asks for it', async () => {
    const { tg, calls } = recordingTg()
    const update = new CallbackQueryUpdate(CBQ_RAW as never, tg)

    await update.send(-100, 'in place', {
      ephemeral_message_parameters: { receiver_user_id: 5, replace_callback_query_message: true }
    })

    expect(calls[0]!.params.ephemeral_message_parameters).toEqual({
      receiver_user_id: 5,
      replace_callback_query_message: true,
      callback_query_id: 'q1'
    })
  })
})

describe('callback-only ephemeral parameters', () => {
  it('opts in without a receiver and strips the local flag', () => {
    expect(callbackEphemeralParams('inline_q', { ephemeral: true })).toEqual({
      ephemeral: undefined,
      ephemeral_message_parameters: { callback_query_id: 'inline_q' }
    })
  })

  it('accepts an empty parameters bag without inferring a receiver', () => {
    expect(callbackEphemeralParams('q', { ephemeral_message_parameters: {} })).toEqual({
      ephemeral_message_parameters: { callback_query_id: 'q' }
    })
  })

  it('preserves explicit query ids and replacement options', () => {
    expect(callbackEphemeralParams('q', {
      ephemeral_message_parameters: { callback_query_id: 'other', replace_callback_query_message: true }
    })).toEqual({
      ephemeral_message_parameters: { callback_query_id: 'other', replace_callback_query_message: true }
    })
  })

  it('fills an explicitly undefined query id', () => {
    expect(callbackEphemeralParams('q', { ephemeral_message_parameters: { callback_query_id: undefined } })).toEqual({
      ephemeral_message_parameters: { callback_query_id: 'q' }
    })
  })

  it('leaves public sends public and consumes an explicit opt-out', () => {
    expect(callbackEphemeralParams('q', {})).toEqual({})
    expect(callbackEphemeralParams('q', { ephemeral: false })).toEqual({ ephemeral: undefined })
  })
})
