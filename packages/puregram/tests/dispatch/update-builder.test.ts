import { describe, it, expect } from 'vitest'

import { buildUpdate } from '../../src/dispatch/update-builder'

const fakeTg = { api: {} }

describe('buildUpdate', () => {
  it('preserves the original update and id without mixing metadata into the message payload', () => {
    const raw = { update_id: 1, message: { message_id: 7, date: 1, chat: { id: 100, type: 'private' } } }
    const update = buildUpdate(raw, fakeTg)

    expect(update.kind).toBe('message')
    expect(update.updateId).toBe(1)
    expect(update.update).toBe(raw)
    expect(update.raw).toBe(raw.message)
  })

  it('retains callback metadata on the accessible originating message wrapper', () => {
    const raw = {
      update_id: 2,
      callback_query: {
        id: 'q1', from: { id: 1, is_bot: false, first_name: 'a' }, chat_instance: 'x',
        message: { message_id: 7, date: 1, chat: { id: 100, type: 'private' } }
      }
    }
    const update = buildUpdate(raw, fakeTg)

    if (update.kind !== 'callback_query' || !update.hasAccessibleMessage()) {
      throw new Error('expected an accessible callback message')
    }

    expect(update.updateId).toBe(2)
    expect(update.message.update).toBe(raw)
    expect(update.message.updateId).toBe(2)
    expect(update.message.raw).toBe(raw.callback_query.message)
  })

  it('preserves the message envelope when dispatching a derived service event', () => {
    const raw = {
      update_id: 3,
      message: {
        message_id: 7, date: 1, chat: { id: 100, type: 'group' },
        new_chat_members: [{ id: 1, is_bot: false, first_name: 'a' }]
      }
    }
    const update = buildUpdate(raw, fakeTg)

    expect(update.kind).toBe('new_chat_members')
    expect(update.updateId).toBe(3)
    expect(update.update).toBe(raw)
    expect(update.raw).toBe(raw.message)
  })

  it('preserves the envelope and id for unsupported future updates', () => {
    const raw = { update_id: 99, future_unknown_kind: { foo: 'bar' } }
    const update = buildUpdate(raw, fakeTg)

    if (update.kind !== 'unknown') {
      throw new Error('expected an unsupported update')
    }

    expect(update.rawKey).toBe('future_unknown_kind')
    expect(update.raw).toBe(raw.future_unknown_kind)
    expect(update.update).toBe(raw)
    expect(update.updateId).toBe(99)
  })

  it('does not dispatch inherited registry keys', () => {
    const raw = { update_id: 12, constructor: { id: 'not an update kind' } }
    const update = buildUpdate(raw, fakeTg)

    expect(update.kind).toBe('unknown')
    expect(update.raw).toBe(raw.constructor)
    expect(update.update).toBe(raw)
    expect(update.updateId).toBe(12)
  })

  it('preserves an envelope without a payload', () => {
    const raw = { update_id: 13 }
    const update = buildUpdate(raw, fakeTg)

    expect(update.kind).toBe('unknown')
    expect(update.raw).toBe(raw)
    expect(update.update).toBe(raw)
    expect(update.updateId).toBe(13)
  })
})
