import { describe, expect, it } from 'vitest'

import { EXTRACTORS } from '../../src/augment/extractors'

describe('EXTRACTORS', () => {
  it('message: pulls chat + from from raw', () => {
    const ext = EXTRACTORS.message!
    const update = { kind: 'message', raw: { chat: { id: 100 }, from: { id: 7 } } }

    expect(ext(update as never)).toEqual({ chat: 100, from: 7 })
  })

  it('message: from absent → from is undefined', () => {
    const ext = EXTRACTORS.message!
    const update = { kind: 'message', raw: { chat: { id: 100 } } }

    expect(ext(update as never)).toEqual({ chat: 100, from: undefined })
  })

  it('channel_post: chat from raw, from is always undefined', () => {
    const ext = EXTRACTORS.channel_post!
    const update = { kind: 'channel_post', raw: { chat: { id: -1001 } } }

    expect(ext(update as never)).toEqual({ chat: -1001, from: undefined })
  })

  it('callback_query: chat from raw.message?.chat.id, from from raw.from.id', () => {
    const ext = EXTRACTORS.callback_query!
    const update = { kind: 'callback_query', raw: { from: { id: 7 }, message: { chat: { id: 100 } } } }

    expect(ext(update as never)).toEqual({ chat: 100, from: 7 })
  })

  it('callback_query: inline-mode (no message) returns chat undefined', () => {
    const ext = EXTRACTORS.callback_query!
    const update = { kind: 'callback_query', raw: { from: { id: 7 } } }

    expect(ext(update as never)).toEqual({ chat: undefined, from: 7 })
  })

  it('chat_member: chat from raw.chat.id, from from raw.from.id', () => {
    const ext = EXTRACTORS.chat_member!
    const update = { kind: 'chat_member', raw: { chat: { id: -100 }, from: { id: 7 } } }

    expect(ext(update as never)).toEqual({ chat: -100, from: 7 })
  })

  it('chat_join_request: chat + from', () => {
    const ext = EXTRACTORS.chat_join_request!
    const update = { kind: 'chat_join_request', raw: { chat: { id: -100 }, from: { id: 7 } } }

    expect(ext(update as never)).toEqual({ chat: -100, from: 7 })
  })

  it('service-event kinds (new_chat_members, successful_payment) share the message-shaped extractor', () => {
    const newMembers = EXTRACTORS.new_chat_members!
    const payment = EXTRACTORS.successful_payment!

    expect(newMembers({ kind: 'new_chat_members', raw: { chat: { id: 100 }, from: { id: 7 } } } as never))
      .toEqual({ chat: 100, from: 7 })
    expect(payment({ kind: 'successful_payment', raw: { chat: { id: 100 }, from: { id: 7 } } } as never))
      .toEqual({ chat: 100, from: 7 })
  })

  it('service-event derived from channel_post (no from) → from undefined', () => {
    const ext = EXTRACTORS.pinned_message!
    const update = { kind: 'pinned_message', raw: { chat: { id: -1001 } } }

    expect(ext(update as never)).toEqual({ chat: -1001, from: undefined })
  })

  it('inline_query: not in EXTRACTORS', () => {
    expect(EXTRACTORS.inline_query).toBeUndefined()
  })

  it('shipping_query: not in EXTRACTORS', () => {
    expect(EXTRACTORS.shipping_query).toBeUndefined()
  })

  it('poll: not in EXTRACTORS', () => {
    expect(EXTRACTORS.poll).toBeUndefined()
  })

  it.each(['widget_query', 'shared_widget_query'])('%s extracts its optional chat and sender', (kind) => {
    const extract = EXTRACTORS[kind]!

    expect(extract({ kind, raw: { chat: { id: 100 }, from: { id: 7 } } }))
      .toEqual({ chat: 100, from: 7 })
    expect(extract({ kind, raw: { from: { id: 7 } } }))
      .toEqual({ chat: undefined, from: 7 })
  })

  it.each(['paid_messages_waived', 'ton_wallet_transfer'])('%s uses its message envelope scope', (kind) => {
    expect(EXTRACTORS[kind]!({ kind, raw: { chat: { id: 100 }, from: { id: 7 } } }))
      .toEqual({ chat: 100, from: 7 })
  })

  it('contains every scoped base and service update kind', () => {
    const keys = Object.keys(EXTRACTORS).sort()

    expect(keys).toContain('message')
    expect(keys).toContain('callback_query')
    expect(keys).toContain('chat_join_request')

    expect(keys).toContain('new_chat_members')
    expect(keys).toContain('successful_payment')
    expect(keys).toContain('pinned_message')
    expect(keys).toContain('forum_topic_created')

    expect(keys).not.toContain('inline_query')
    expect(keys).not.toContain('shipping_query')
    expect(keys).not.toContain('poll')

    expect(keys.length).toBe(46)
  })
})
