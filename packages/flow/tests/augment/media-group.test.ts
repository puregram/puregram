import {
  BusinessMessageUpdate,
  CallbackQueryUpdate,
  ChannelPostUpdate,
  EditedMessageUpdate,
  PinnedMessageUpdate,
  SharedWidgetQueryUpdate,
  WidgetQueryUpdate
} from '@puregram/api'
import { describe, expect, expectTypeOf, it, onTestFinished } from 'vitest'

import { CollectedMediaGroup, flow } from '../../src'
import { createAugmentMiddleware } from '../../src/augment/middleware'
import { makeTg } from '../helpers/make-tg'

const chat = { id: 30, type: 'private', first_name: 'reader' } as const
const from = { id: 7, is_bot: false, first_name: 'reader' }
const raw = { message_id: 1, date: 0, chat, from }

async function setup () {
  const { tg, mock } = await makeTg(t => t.extend(flow()))

  onTestFinished(() => mock.stop())
  await tg.start()

  return { tg, augment: createAugmentMiddleware(tg.flow) }
}

describe('collectMediaGroup eligibility', () => {
  it('keeps the source update intact for channel, business, edited and service messages', async () => {
    const { tg, augment } = await setup()
    const updates = [
      new ChannelPostUpdate(raw, tg),
      new BusinessMessageUpdate({ ...raw, business_connection_id: 'bc' }, tg),
      new EditedMessageUpdate(raw, tg),
      new PinnedMessageUpdate({ ...raw, pinned_message: raw }, tg)
    ]

    for (const update of updates) {
      await augment(update, async () => {})

      const explicit = await tg.flow.collectMediaGroup(update)
      const bound = await update.flow.collectMediaGroup()

      expectTypeOf(bound).toEqualTypeOf<CollectedMediaGroup>()
      expect(explicit).toBeInstanceOf(CollectedMediaGroup)
      expect(bound).toBeInstanceOf(CollectedMediaGroup)
      expect(bound[0]).toBe(update)
      expect(explicit[0]).toBe(update)
    }
  })

  it('keeps ordinary flow methods on queries without mistaking message anchors for messages', async () => {
    const { tg, augment } = await setup()
    const query = { from, id: 'q', type: { type: 'data' }, data: 'x' } as const
    const updates = [
      new WidgetQueryUpdate({ ...query, chat, chat_instance: 'c', message_id: 1 }, tg),
      new SharedWidgetQueryUpdate({ ...query, widget_id: 'widget' }, tg),
      new CallbackQueryUpdate({ from, id: 'q', chat_instance: 'c', message: raw }, tg)
    ]

    for (const update of updates) {
      await augment(update, async () => {})

      expect(update.flow.waitFor).toBeTypeOf('function')
      expect(update.flow).not.toHaveProperty('collectMediaGroup')
      expectTypeOf(update.flow).not.toHaveProperty('collectMediaGroup')
      expectTypeOf(update).not.toMatchTypeOf<Parameters<typeof tg.flow.collectMediaGroup>[0]>()
      expect(() => tg.flow.collectMediaGroup(update as never)).toThrow(TypeError)
    }
  })
})
