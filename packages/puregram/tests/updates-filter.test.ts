import { SERVICE_EVENT_ORDER } from '@puregram/api'
import { describe, expect, it } from 'vitest'

import { UpdatesFilter } from '../src/updates-filter'

describe('UpdatesFilter', () => {
  it('subscribes to message parents and opt-in fields, never service event kinds', () => {
    const all = UpdatesFilter.all()

    expect(all).toEqual(expect.arrayContaining([
      'message', 'edited_message', 'channel_post', 'edited_channel_post',
      'chat_member', 'message_reaction', 'message_reaction_count'
    ]))

    for (const service of SERVICE_EVENT_ORDER) {
      expect(all).not.toContain(service)
    }
  })

  it('keeps later subscriptions isolated from mutations to previous results', () => {
    const before = UpdatesFilter.all()
    const mutable = UpdatesFilter.all()

    mutable.splice(0, mutable.length)

    expect(UpdatesFilter.all()).toEqual(before)
  })

  it('except(kind) drops a single kind', () => {
    const out = UpdatesFilter.except('chat_member')

    expect(out).not.toContain('chat_member')
    expect(out).toContain('message')
  })

  it('excludes the selected fields while retaining other valid subscriptions', () => {
    const out = UpdatesFilter.except(['business_connection', 'business_message'])

    expect(out).not.toContain('business_connection')
    expect(out).not.toContain('business_message')
    expect(out).toContain('edited_business_message')
    expect(out).toContain('message')

    for (const service of SERVICE_EVENT_ORDER) {
      expect(out).not.toContain(service)
    }
  })

})
