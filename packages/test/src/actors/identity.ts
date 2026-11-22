import type { TelegramBotFullInfo } from '@puregram/api'

let nextUserId = 100_000_000

export function allocateUserId () {
  nextUserId += 1

  return nextUserId
}

let nextChatId = -100_000_000

export function allocateChatId (type: 'private' | 'group' | 'supergroup' | 'channel') {
  if (type === 'private') {
    return allocateUserId()
  }

  nextChatId -= 1

  return nextChatId
}

export function defaultBotIdentity () {
  const bot: TelegramBotFullInfo = {
    id: 12345,
    is_bot: true,
    first_name: 'TestBot',
    username: 'testbot',
    can_join_groups: true,
    can_read_all_group_messages: false,
    supports_guest_queries: false,
    supports_inline_queries: false,
    needs_inline_query_location: false,
    can_connect_to_business: false,
    has_main_web_app: false,
    has_topics_enabled: false,
    allows_users_to_create_topics: false,
    has_topic_sidebar: false,
    can_manage_bots: false,
    supports_join_request_queries: false
  }

  return bot
}
