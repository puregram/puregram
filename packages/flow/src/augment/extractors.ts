export interface ExtractedScope {
  chat: number | string | undefined
  from: number | undefined
}

export type Extractor = (update: { kind: string, raw: unknown }) => ExtractedScope

interface ChatRaw {
 chat?: { id?: number | string }
}
interface FromRaw {
 from?: { id?: number }
}
interface CallbackRaw {
 message?: { chat?: { id?: number | string } }, from?: { id?: number }
}

const chatFromRaw = (raw: unknown) =>
  (raw as ChatRaw).chat?.id

const fromFromRaw = (raw: unknown) =>
  (raw as FromRaw).from?.id

// shared extractor for kinds whose raw payload is TelegramMessage-shaped
// (`message`, `edited_message`, `business_message`, message-derived service events)
const messageShapedExtractor: Extractor = u => ({
  chat: chatFromRaw(u.raw),
  from: fromFromRaw(u.raw)
})

const channelPostExtractor: Extractor = u => ({
  chat: chatFromRaw(u.raw),
  from: undefined
})

const callbackQueryExtractor: Extractor = (u) => {
  const raw = u.raw as CallbackRaw

  return { chat: raw.message?.chat?.id, from: raw.from?.id }
}

// service-event kinds — mirror `SERVICE_FIELD_TO_CLASS` in
// `packages/puregram/src/dispatch/update-builder.ts`. all wrap TelegramMessage payloads;
// channel_post-derived events naturally yield undefined `from` via `fromFromRaw`
const SERVICE_EVENT_KINDS = [
  'new_chat_members',
  'left_chat_member',
  'new_chat_title',
  'new_chat_photo',
  'delete_chat_photo',
  'group_chat_created',
  'pinned_message',
  'invoice',
  'successful_payment',
  'users_shared',
  'chat_shared',
  'web_app_data',
  'video_chat_scheduled',
  'video_chat_started',
  'video_chat_ended',
  'video_chat_participants_invited',
  'forum_topic_created',
  'forum_topic_edited',
  'forum_topic_closed',
  'forum_topic_reopened',
  'general_forum_topic_hidden',
  'general_forum_topic_unhidden',
  'giveaway_created',
  'giveaway_completed',
  'giveaway_winners',
  'boost_added',
  'message_auto_delete_timer_changed',
  'migrate_to_chat_id',
  'migrate_from_chat_id',
  'passport_data',
  'proximity_alert_triggered',
  'write_access_allowed',
  'paid_messages_waived',
  'ton_wallet_transfer'
] as const

const serviceEventEntries: [string, Extractor][] = SERVICE_EVENT_KINDS.map(
  kind => [kind, messageShapedExtractor]
)

export const EXTRACTORS: Partial<Record<string, Extractor>> = {
  message: messageShapedExtractor,
  edited_message: messageShapedExtractor,
  channel_post: channelPostExtractor,
  edited_channel_post: channelPostExtractor,
  business_message: messageShapedExtractor,
  edited_business_message: messageShapedExtractor,
  callback_query: callbackQueryExtractor,
  widget_query: messageShapedExtractor,
  shared_widget_query: messageShapedExtractor,
  chat_member: messageShapedExtractor,
  my_chat_member: messageShapedExtractor,
  chat_join_request: messageShapedExtractor,
  ...Object.fromEntries(serviceEventEntries)
}
