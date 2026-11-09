import { defineFilter } from '@puregram/api'
import { describe, it, expect } from 'vitest'

import { Dispatcher } from '../../src/dispatch/on'
import { command } from '../../src/filters/content'
import { Telegram } from '../../src/telegram'

describe('resolveAllowedUpdates', () => {
  it('returns an explicit list unchanged', () => {
    const tg = new Telegram({ token: 'X' })

    expect(tg.resolveAllowedUpdates(['message', 'poll'])).toEqual(['message', 'poll'])
  })

  it('derives kinds from registered handlers', () => {
    const tg = new Telegram({ token: 'X' })

    tg.onMessage(() => {})
    tg.onCallbackQuery(() => {})

    expect(tg.resolveAllowedUpdates('auto').sort()).toEqual(['callback_query', 'message'])
  })

  it('includes opt-in kinds like chat_member when handled', () => {
    const tg = new Telegram({ token: 'X' })

    tg.onChatMember(() => {})

    expect(tg.resolveAllowedUpdates('auto')).toEqual(['chat_member'])
  })

  it('subscribes to every service-event parent without duplicate message fields', () => {
    const tg = new Telegram({ token: 'X' })

    tg.onMessage(() => {})
    tg.onNewChatMembers(() => {})
    tg.onPinnedMessage(() => {})

    expect(tg.resolveAllowedUpdates('auto').sort()).toEqual([
      'channel_post', 'edited_channel_post', 'edited_message', 'message'
    ])
  })

  it('maps service kinds in predicate metadata and preserves independent fields', () => {
    const tg = new Telegram({ token: 'X' })

    tg.onUpdate(defineFilter(
      'service-or-reaction',
      (_update: unknown): _update is object => true,
      { kinds: ['new_chat_members', 'message_reaction'] }
    ), () => {})

    expect(tg.resolveAllowedUpdates('auto').sort()).toEqual([
      'channel_post', 'edited_channel_post', 'edited_message', 'message', 'message_reaction'
    ])
  })

  it('falls back for custom kinds rather than sending invalid Bot API fields', () => {
    const tg = new Telegram({ token: 'X' })

    tg.defineUpdate('job_done')
    tg.on('job_done', () => {})
    tg.onMessage(() => {})

    expect(tg.resolveAllowedUpdates('auto')).toEqual([])
  })

  it('does not trust unknown filter kinds as Bot API subscriptions', () => {
    const tg = new Telegram({ token: 'X' })

    tg.onUpdate(defineFilter(
      'custom-kind',
      (_update: unknown): _update is object => true,
      { kinds: ['job_done'] }
    ), () => {})
    tg.onMessage(() => {})

    expect(tg.resolveAllowedUpdates('auto')).toEqual([])
  })

  it('falls back to the default when an opaque predicate is present', () => {
    const tg = new Telegram({ token: 'X' })

    tg.onMessage(() => {})
    tg.onUpdate(() => true, () => {})

    expect(tg.resolveAllowedUpdates('auto')).toEqual([])
  })

  it('falls back to the default when no handlers are registered', () => {
    const tg = new Telegram({ token: 'X' })

    expect(tg.resolveAllowedUpdates('auto')).toEqual([])
  })
})

describe('Dispatcher.collectAllowedKinds', () => {
  it('collects kinds from kind entries', () => {
    const dispatcher = new Dispatcher()

    dispatcher.on('message', () => {})
    dispatcher.on('poll', () => {})

    const { kinds, opaque } = dispatcher.collectAllowedKinds()

    expect(opaque).toBe(false)
    expect([...kinds].sort()).toEqual(['message', 'poll'])
  })

  it('reads kinds metadata from a filter predicate', () => {
    const dispatcher = new Dispatcher()

    dispatcher.add({ type: 'predicate', predicate: command('start'), handler: () => {}, priority: 'normal' })

    const { kinds, opaque } = dispatcher.collectAllowedKinds()

    expect(opaque).toBe(false)
    expect([...kinds]).toEqual(['message'])
  })

  it('reports opaque for a raw predicate', () => {
    const dispatcher = new Dispatcher()

    dispatcher.add({ type: 'predicate', predicate: () => true, handler: () => {}, priority: 'normal' })

    const { kinds, opaque } = dispatcher.collectAllowedKinds()

    expect(opaque).toBe(true)
    expect(kinds.size).toBe(0)
  })
})
