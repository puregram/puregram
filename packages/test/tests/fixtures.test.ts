import { describe, expect, it } from 'vitest'

import {
  buildCallbackQuery,
  buildChat,
  buildInlineQuery,
  buildMessage,
  buildSharedWidgetQuery,
  buildUpdate,
  buildUser,
  buildWidgetQuery
} from '../src/fixtures'

describe('fixtures', () => {
  it('buildUser fills realistic defaults and applies overrides', () => {
    const a = buildUser()
    const b = buildUser({ first_name: 'Alice', is_bot: false })

    expect(a).toMatchObject({
      id: expect.any(Number),
      is_bot: false,
      first_name: 'Test',
      last_name: 'User',
      username: 'test-user',
      language_code: 'en'
    })
    expect(b.first_name).toBe('Alice')
    expect(b.username).toBe('test-user')
    // sequential ids
    expect(b.id).toBeGreaterThan(a.id)
  })

  it('buildChat defaults to private and respects overrides', () => {
    const pm = buildChat()
    const group = buildChat({ type: 'group', title: 'devs', id: -1001 })

    expect(pm.type).toBe('private')
    expect(pm.id).toEqual(expect.any(Number))
    expect(group).toMatchObject({ id: -1001, type: 'group', title: 'devs' })
  })

  it('buildMessage assembles from default user + chat and stamps current time', () => {
    const before = Math.floor(Date.now() / 1000)
    const msg = buildMessage({ text: 'hi' })

    expect(msg.text).toBe('hi')
    expect(msg.from?.first_name).toBe('Test')
    expect(msg.chat.type).toBe('private')
    // date is unix seconds and within a generous window
    expect(msg.date).toBeGreaterThanOrEqual(before - 1)
  })

  it('buildMessage deep-merges from / chat overrides', () => {
    const msg = buildMessage({
      from: { id: 42, first_name: 'Bob' },
      chat: { id: -100, type: 'group', title: 'team' }
    })

    expect(msg.from).toMatchObject({ id: 42, first_name: 'Bob', is_bot: false })
    expect(msg.chat).toMatchObject({ id: -100, type: 'group', title: 'team' })
  })

  it('buildCallbackQuery applies defaults', () => {
    const cb = buildCallbackQuery({ data: 'opt:1' })

    expect(cb.id).toMatch(/^cbq_fx_/)
    expect(cb.data).toBe('opt:1')
    expect(cb.from.first_name).toBe('Test')
    expect(cb.chat_instance).toBe('inst-fx')
  })

  it('buildInlineQuery applies defaults', () => {
    const iq = buildInlineQuery({ query: 'cats' })

    expect(iq.id).toMatch(/^iq_fx_/)
    expect(iq.query).toBe('cats')
    expect(iq.offset).toBe('')
  })

  it('buildUpdate wraps a payload under the chosen kind', () => {
    const msg = buildMessage({ text: 'wrap me' })
    const update = buildUpdate('message', msg)

    expect(update.update_id).toEqual(expect.any(Number))
    expect(update.message).toBe(msg)
    expect(update.callback_query).toBeUndefined()

    const cb = buildCallbackQuery({ data: 'x' })
    const cbUpdate = buildUpdate('callback_query', cb)

    expect(cbUpdate.callback_query).toBe(cb)
  })

  it('builds widget query variants without fabricating a shared query chat', () => {
    const regular = buildWidgetQuery({ from: buildUser({ id: 7 }) })
    const inline = buildWidgetQuery({ inline_message_id: 'inline-id' })
    const shared = buildSharedWidgetQuery({ widget_id: '9007199254740993' })

    expect(regular.chat).toBeDefined()
    expect(regular.message_id).toEqual(expect.any(Number))
    expect(regular.from.id).toBe(7)
    expect(inline.chat).toBeUndefined()
    expect(inline.message_id).toBeUndefined()
    expect(inline.inline_message_id).toBe('inline-id')
    expect(shared).toMatchObject({ widget_id: '9007199254740993', type: { type: 'data' } })
    expect(shared).not.toHaveProperty('chat')
    expect(buildUpdate('widget_query', regular).widget_query).toBe(regular)
    expect(buildUpdate('shared_widget_query', shared).shared_widget_query).toBe(shared)
  })
})
