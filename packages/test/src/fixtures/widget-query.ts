import type { TelegramSharedWidgetQuery, TelegramWidgetQuery } from '@puregram/api'

import { buildChat } from './chat'
import { nextFixtureMessageId, nextFixtureWidgetQueryId } from './counter'
import { buildUser } from './user'

export function buildWidgetQuery (overrides: Partial<TelegramWidgetQuery> = {}) {
  const from = { ...buildUser(), ...overrides.from }
  const base: TelegramWidgetQuery = {
    id: nextFixtureWidgetQueryId(),
    from,
    chat_instance: 'inst-fx',
    type: { type: 'data' },
    data: 'widget-data'
  }

  if (overrides.inline_message_id === undefined) {
    base.chat = buildChat()
    base.message_id = nextFixtureMessageId()
  }

  return { ...base, ...overrides, from }
}

export function buildSharedWidgetQuery (overrides: Partial<TelegramSharedWidgetQuery> = {}) {
  const from = { ...buildUser(), ...overrides.from }
  const base: TelegramSharedWidgetQuery = {
    id: nextFixtureWidgetQueryId(),
    from,
    widget_id: 'shared-widget-fx',
    type: { type: 'data' },
    data: 'widget-data'
  }

  return { ...base, ...overrides, from }
}
