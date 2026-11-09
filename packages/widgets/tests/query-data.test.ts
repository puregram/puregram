import { SharedWidgetQueryUpdate, WidgetQueryUpdate } from '@puregram/api'
import { Telegram } from 'puregram'
import { describe, expect, expectTypeOf, it } from 'vitest'

import { queryData, WidgetQueryDataTooLargeError } from '../src'

const from = { id: 1, is_bot: false, first_name: 'ann' }
const tg = new Telegram({ token: 'X' })

const widgetQuery = (data: string) =>
  new WidgetQueryUpdate({ id: 'q', from, chat_instance: 'ci', type: { type: 'data' }, data }, tg)

describe('queryData', () => {
  it('encodes prefix:payload', () => {
    expect(queryData('vote').encode('2')).toBe('vote:2')
  })

  it('accepts exactly 64 utf-8 bytes and rejects 65', () => {
    const vote = queryData('v')

    expect(vote.encode('ж'.repeat(31))).toBe(`v:${'ж'.repeat(31)}`)
    expect(() => vote.encode('ж'.repeat(31) + 'a')).toThrow(WidgetQueryDataTooLargeError)
  })

  it('refuses ambiguous prefixes', () => {
    expect(() => queryData('')).toThrow(TypeError)
    expect(() => queryData('a:b')).toThrow(TypeError)
  })

  it('filters by prefix and attaches the payload', () => {
    const vote = queryData('vote')
    const match = widgetQuery('vote:2')
    const shared = new SharedWidgetQueryUpdate({ id: 'q', from, type: { type: 'data' }, data: 'vote:', widget_id: 'w' }, tg)

    expect(vote.filter(match)).toBe(true)
    expect(match).toHaveProperty('payload', '2')
    expect(vote.filter(shared)).toBe(true)
    expect(shared).toHaveProperty('payload', '')
    expect(vote.filter(widgetQuery('voter:2'))).toBe(false)
    expect(vote.filter(widgetQuery('tap'))).toBe(false)
    expect(vote.filter.kinds).toEqual(['widget_query', 'shared_widget_query'])
  })

  it('narrows payload in onWidgetQuery', () => {
    const vote = queryData('vote')

    tg.onWidgetQuery(vote.filter, (query) => {
      expectTypeOf(query.payload).toEqualTypeOf<string>()
      expectTypeOf(query).toMatchTypeOf<WidgetQueryUpdate>()
    })
  })
})
