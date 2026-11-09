import { flow } from '@puregram/flow'
import { rateLimit } from '@puregram/rate-limit'
import { scenes, StepScene } from '@puregram/scenes'
import { session } from '@puregram/session'
import { Telegram, type SharedWidgetQueryUpdate, type WidgetQueryUpdate } from 'puregram'
import { afterEach, describe, expect, it } from 'vitest'

import { buildSharedWidgetQuery, buildUpdate, buildWidgetQuery, createTestEnv } from '../src'

const BOT = { id: 1, is_bot: true, first_name: 'bot', username: 'testbot' }

describe('widget queries', () => {
  let cleanup: (() => Promise<void>) | undefined

  afterEach(async () => {
    await cleanup?.()
    cleanup = undefined
  })

  it('dispatches actor widget queries with their exact message and string shared id', async () => {
    const tg = new Telegram({ token: 'TEST', bot: BOT })
    const env = createTestEnv(tg, { strictApi: true })

    cleanup = () => env.shutdown()

    const alice = env.createUser()
    const message = await alice.sendMessage('widget carrier')
    const seen: unknown[] = []

    tg.onWidgetQuery(async (query) => {
      seen.push(query.raw)
      await query.answer({ data: 'ok' })
    })
    tg.onSharedWidgetQuery(async (query) => {
      seen.push(query.raw)
      await query.answer()
    })

    await alice.on(message).sendWidgetQuery('clicked', { widget_id: '9007199254740993' })
    await alice.sendSharedWidgetQuery('9007199254740993', 'forwarded')

    expect(seen[0]).toMatchObject({
      from: { id: alice.id }, chat: { id: message.chat.id }, message_id: message.message_id,
      type: { type: 'data' }, data: 'clicked', widget_id: '9007199254740993'
    })
    expect(seen[1]).toMatchObject({ from: { id: alice.id }, data: 'forwarded', widget_id: '9007199254740993' })
    expect(seen[1]).not.toHaveProperty('chat')
    expect(env.callsTo('answerWidgetQuery')).toHaveLength(2)
  })

  it('scopes chatless widget flow waits to their sender, not every user', async () => {
    const tg = new Telegram({ token: 'TEST', bot: BOT }).extend(flow())
    const env = createTestEnv(tg)

    cleanup = () => env.shutdown()

    let waiting: Promise<SharedWidgetQueryUpdate | null> | undefined

    tg.onSharedWidgetQuery((query) => {
      if (query.data === 'start') {
        waiting = query.flow.waitFor('shared_widget_query')
      }
    })

    const alice = env.createUser()
    const bob = env.createUser()

    await alice.sendSharedWidgetQuery('widget', 'start')
    expect(waiting).toBeDefined()
    await bob.sendSharedWidgetQuery('widget', 'not-alice')
    await alice.sendSharedWidgetQuery('widget', 'alice')
    await expect(waiting).resolves.toMatchObject({ raw: { data: 'alice', from: { id: alice.id } } })
  })

  it('scopes message widget flow waits by both chat and sender', async () => {
    const tg = new Telegram({ token: 'TEST', bot: BOT }).extend(flow())
    const env = createTestEnv(tg)

    cleanup = () => env.shutdown()

    let waiting: Promise<WidgetQueryUpdate | null> | undefined

    tg.onWidgetQuery((query) => {
      if (query.data === 'start') {
        waiting = query.flow.waitFor('widget_query')
      }
    })

    const alice = env.createUser()
    const bob = env.createUser()
    const message = await alice.sendMessage('first')
    const otherMessage = await bob.sendMessage('other chat')

    await alice.sendWidgetQuery('start', message)
    await bob.sendWidgetQuery('wrong user', message)
    await alice.sendWidgetQuery('wrong chat', otherMessage)
    await alice.sendWidgetQuery('correct', message)

    await expect(waiting).resolves.toMatchObject({ raw: { data: 'correct' } })
  })

  it('maintains independent per-user/per-chat sessions for both widget kinds', async () => {
    const tg = new Telegram({ token: 'TEST', bot: BOT }).extend(session())
    const env = createTestEnv(tg)

    cleanup = () => env.shutdown()

    const seen: number[] = []
    const increment = (query: WidgetQueryUpdate | SharedWidgetQueryUpdate) => {
      query.session.widgetCount = (query.session.widgetCount as number | undefined ?? 0) + 1
      seen.push(query.session.widgetCount as number)
    }

    tg.onWidgetQuery(increment)
    tg.onSharedWidgetQuery(increment)

    const alice = env.createUser()
    const bob = env.createUser()
    const message = await alice.sendMessage('carrier')

    await alice.sendWidgetQuery('one', message)
    await alice.sendWidgetQuery('two', message)
    await alice.sendSharedWidgetQuery('widget', 'one')
    await alice.sendSharedWidgetQuery('widget', 'two')
    await bob.sendSharedWidgetQuery('widget', 'one')

    expect(seen).toEqual([1, 2, 1, 2, 1])
  })

  it('rates widget kinds by the authoring user with a shared budget', async () => {
    const tg = new Telegram({ token: 'TEST', bot: BOT }).extend(rateLimit())
    const env = createTestEnv(tg)

    cleanup = () => env.shutdown()

    const seen: (number | null)[] = []
    const check = async (query: WidgetQueryUpdate | SharedWidgetQueryUpdate) => {
      seen.push(await tg.rateLimit.check(query, { limit: 1, window: 60 }))
    }

    tg.onWidgetQuery(check)
    tg.onSharedWidgetQuery(check)

    const alice = env.createUser()
    const bob = env.createUser()
    const message = await alice.sendMessage('carrier')

    await alice.sendWidgetQuery('one', message)
    await alice.sendSharedWidgetQuery('widget', 'two')
    await bob.sendSharedWidgetQuery('widget', 'one')

    expect(seen[0]).toBeNull()
    expect(seen[1]).toBeGreaterThan(0)
    expect(seen[2]).toBeNull()
  })

  it('attaches scenes and resumes a chatless shared-widget scene', async () => {
    const seen: string[] = []
    const scene = new StepScene<Record<string, never>, SharedWidgetQueryUpdate>('widgets', [
      (query) => {
        seen.push(query.data)
      }
    ])
    const tg = new Telegram({ token: 'TEST', bot: BOT }).extend(session()).extend(scenes({ scenes: [scene] }))
    const env = createTestEnv(tg)

    cleanup = () => env.shutdown()

    tg.onSharedWidgetQuery(query => query.scene.enter('widgets'))

    const alice = env.createUser()

    await alice.sendSharedWidgetQuery('widget', 'enter')
    await alice.sendSharedWidgetQuery('widget', 'resume')

    expect(seen).toEqual(['enter', 'resume'])
  })

  it('supports inline widget fixtures without a fabricated chat', async () => {
    const tg = new Telegram({ token: 'TEST', bot: BOT })
    const env = createTestEnv(tg)

    cleanup = () => env.shutdown()

    const seen: unknown[] = []

    tg.onWidgetQuery(query => { seen.push(query.raw) })
    tg.onSharedWidgetQuery(query => { seen.push(query.raw) })

    await env.inject(buildUpdate('widget_query', buildWidgetQuery({ inline_message_id: 'inline-id' })))
    await env.inject(buildUpdate('shared_widget_query', buildSharedWidgetQuery()))

    expect(seen).toHaveLength(2)
    expect(seen[0]).toMatchObject({ inline_message_id: 'inline-id' })
    expect(seen[0]).not.toHaveProperty('chat')
    expect(seen[1]).not.toHaveProperty('chat')
  })
})
