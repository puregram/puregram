import { createTestEnv, type TestEnv } from '@puregram/test'
import { Telegram } from 'puregram'
import { afterEach, describe, expect, it } from 'vitest'

import { widgets, type WidgetsOptions } from '../src'

const from = { id: 1, is_bot: false, first_name: 'ann' }

const widgetQuery = (id: string, data = 'tap') => ({
  widget_query: {
    id,
    from,
    chat: { id: 1, type: 'private' },
    message_id: 5,
    chat_instance: 'ci',
    type: { type: 'data' },
    data
  }
})

const sharedWidgetQuery = (id: string) => ({
  shared_widget_query: { id, from, type: { type: 'data' }, data: 'vote:a', widget_id: 'w' }
})

let env: TestEnv | undefined

const setup = (options?: WidgetsOptions) => {
  const tg = new Telegram({ token: 'TEST' }).extend(widgets(options))

  env = createTestEnv(tg)
  env.onApi('answerWidgetQuery', true)

  return { tg, env }
}

afterEach(async () => {
  await env?.shutdown()
  env = undefined
})

describe('widgets({ autoAnswer })', () => {
  it('answers a widget query no handler answered', async () => {
    const { tg, env } = setup({ autoAnswer: true })

    tg.onWidgetQuery(() => {})
    await env.inject(widgetQuery('q1'))

    expect(env.callsTo('answerWidgetQuery').map(call => call.params)).toEqual([{ widget_query_id: 'q1' }])
  })

  it('answers queries no handler matched, including shared ones', async () => {
    const { env } = setup({ autoAnswer: { data: 'busy' } })

    await env.inject(widgetQuery('q1'))
    await env.inject(sharedWidgetQuery('q2'))

    expect(env.callsTo('answerWidgetQuery').map(call => call.params)).toEqual([
      { widget_query_id: 'q1', data: 'busy' },
      { widget_query_id: 'q2', data: 'busy' }
    ])
  })

  it('does not double-answer', async () => {
    const { tg, env } = setup({ autoAnswer: true })

    tg.onWidgetQuery(query => query.answer({ data: 'ok' }))
    tg.onSharedWidgetQuery(query => query.answer())
    await env.inject(widgetQuery('q1'))
    await env.inject(sharedWidgetQuery('q2'))

    expect(env.callsTo('answerWidgetQuery').map(call => call.params)).toEqual([
      { widget_query_id: 'q1', data: 'ok' },
      { widget_query_id: 'q2' }
    ])
  })

  it('answers after a handler throws', async () => {
    const { tg, env } = setup({ autoAnswer: true })

    tg.onWidgetQuery(() => {
      throw new Error('boom')
    })
    tg.catch(() => {})
    await env.inject(widgetQuery('q1')).catch(() => {})

    expect(env.callsTo('answerWidgetQuery')).toHaveLength(1)
  })

  it('leaves other updates alone', async () => {
    const { env } = setup({ autoAnswer: true })
    const alice = env.createUser({ first_name: 'alice' })

    await alice.sendMessage('hi')

    expect(env.callsTo('answerWidgetQuery')).toHaveLength(0)
  })

  it('is off by default', async () => {
    const { tg, env } = setup()

    tg.onWidgetQuery(() => {})
    await env.inject(widgetQuery('q1'))

    expect(env.callsTo('answerWidgetQuery')).toHaveLength(0)
  })
})
