export interface MethodPositional {
  name: string
  schemaArg: string
}

export const METHOD_POSITIONALS: Record<string, MethodPositional[]> = {
  sendMessage: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'text', schemaArg: 'text' }],
  sendMessageDraft: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'draftId', schemaArg: 'draft_id' }, { name: 'text', schemaArg: 'text' }],
  sendRichMessageDraft: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'draftId', schemaArg: 'draft_id' }, { name: 'richMessage', schemaArg: 'rich_message' }],
  sendRichMessage: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'richMessage', schemaArg: 'rich_message' }],
  sendPhoto: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'photo', schemaArg: 'photo' }],
  sendAudio: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'audio', schemaArg: 'audio' }],
  sendDocument: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'document', schemaArg: 'document' }],
  sendVideo: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'video', schemaArg: 'video' }],
  sendAnimation: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'animation', schemaArg: 'animation' }],
  sendVoice: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'voice', schemaArg: 'voice' }],
  sendVideoNote: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'videoNote', schemaArg: 'video_note' }],
  sendLivePhoto: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'livePhoto', schemaArg: 'live_photo' }, { name: 'photo', schemaArg: 'photo' }],
  sendSticker: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'sticker', schemaArg: 'sticker' }],
  sendWidget: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'widget', schemaArg: 'html' }],
  sendSharedWidget: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'widgetId', schemaArg: 'widget_id' }],
  sendLocation: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'latitude', schemaArg: 'latitude' }, { name: 'longitude', schemaArg: 'longitude' }],
  sendVenue: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'latitude', schemaArg: 'latitude' }, { name: 'longitude', schemaArg: 'longitude' }, { name: 'title', schemaArg: 'title' }, { name: 'address', schemaArg: 'address' }],
  sendContact: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'phoneNumber', schemaArg: 'phone_number' }, { name: 'firstName', schemaArg: 'first_name' }],
  sendDice: [{ name: 'chat', schemaArg: 'chat_id' }],
  sendChatAction: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'action', schemaArg: 'action' }],
  sendPoll: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'question', schemaArg: 'question' }, { name: 'options', schemaArg: 'options' }],
  sendChecklist: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'checklist', schemaArg: 'checklist' }],
  sendMediaGroup: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'media', schemaArg: 'media' }],
  sendPaidMedia: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'starCount', schemaArg: 'star_count' }, { name: 'media', schemaArg: 'media' }],
  sendGame: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'gameShortName', schemaArg: 'game_short_name' }],

  forwardMessage: [{ name: 'from', schemaArg: 'from_chat_id' }, { name: 'to', schemaArg: 'chat_id' }, { name: 'messageId', schemaArg: 'message_id' }],
  forwardMessages: [{ name: 'from', schemaArg: 'from_chat_id' }, { name: 'to', schemaArg: 'chat_id' }, { name: 'messageIds', schemaArg: 'message_ids' }],
  copyMessage: [{ name: 'from', schemaArg: 'from_chat_id' }, { name: 'to', schemaArg: 'chat_id' }, { name: 'messageId', schemaArg: 'message_id' }],
  copyMessages: [{ name: 'from', schemaArg: 'from_chat_id' }, { name: 'to', schemaArg: 'chat_id' }, { name: 'messageIds', schemaArg: 'message_ids' }],

  deleteMessage: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'messageId', schemaArg: 'message_id' }],
  deleteMessages: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'messageIds', schemaArg: 'message_ids' }],
  pinChatMessage: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'messageId', schemaArg: 'message_id' }],
  unpinChatMessage: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'messageId', schemaArg: 'message_id' }],
  setMessageReaction: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'messageId', schemaArg: 'message_id' }, { name: 'reactions', schemaArg: 'reaction' }],

  banChatMember: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'user', schemaArg: 'user_id' }],
  unbanChatMember: [{ name: 'chat', schemaArg: 'chat_id' }, { name: 'user', schemaArg: 'user_id' }],

  // edits — only `text`/`media`/coords positional at telegram level; per-update fills `chat`/`messageId` via anchors
  editMessageText: [{ name: 'text', schemaArg: 'text' }],
  editMessageMedia: [{ name: 'media', schemaArg: 'media' }],
  editMessageLiveLocation: [{ name: 'latitude', schemaArg: 'latitude' }, { name: 'longitude', schemaArg: 'longitude' }],

  editMessageChecklist: [{ name: 'messageId', schemaArg: 'message_id' }, { name: 'checklist', schemaArg: 'checklist' }],

  answerGuestQuery: [{ name: 'result', schemaArg: 'result' }],
  answerChatJoinRequestQuery: [{ name: 'result', schemaArg: 'result' }],
  answerInlineQuery: [{ name: 'results', schemaArg: 'results' }],
  answerShippingQuery: [{ name: 'ok', schemaArg: 'ok' }],
  answerPreCheckoutQuery: [{ name: 'ok', schemaArg: 'ok' }],

  setChatTitle: [{ name: 'title', schemaArg: 'title' }],
  setChatPhoto: [{ name: 'photo', schemaArg: 'photo' }],
  setChatStickerSet: [{ name: 'stickerSetName', schemaArg: 'sticker_set_name' }],
  setChatPermissions: [{ name: 'permissions', schemaArg: 'permissions' }],
  setChatAdministratorCustomTitle: [{ name: 'user', schemaArg: 'user_id' }, { name: 'customTitle', schemaArg: 'custom_title' }],
  setChatMemberTag: [{ name: 'user', schemaArg: 'user_id' }],
  banChatSenderChat: [{ name: 'senderChat', schemaArg: 'sender_chat_id' }],
  unbanChatSenderChat: [{ name: 'senderChat', schemaArg: 'sender_chat_id' }],
  restrictChatMember: [{ name: 'user', schemaArg: 'user_id' }, { name: 'permissions', schemaArg: 'permissions' }],
  promoteChatMember: [{ name: 'user', schemaArg: 'user_id' }],
  getChatMember: [{ name: 'user', schemaArg: 'user_id' }],
  getUserChatBoosts: [{ name: 'user', schemaArg: 'user_id' }],
  approveChatJoinRequest: [{ name: 'user', schemaArg: 'user_id' }],
  declineChatJoinRequest: [{ name: 'user', schemaArg: 'user_id' }],
  sendChatJoinRequestWebApp: [{ name: 'webAppUrl', schemaArg: 'web_app_url' }],

  editChatInviteLink: [{ name: 'inviteLink', schemaArg: 'invite_link' }],
  editChatSubscriptionInviteLink: [{ name: 'inviteLink', schemaArg: 'invite_link' }],
  revokeChatInviteLink: [{ name: 'inviteLink', schemaArg: 'invite_link' }],
  createChatSubscriptionInviteLink: [{ name: 'subscriptionPeriod', schemaArg: 'subscription_period' }, { name: 'subscriptionPrice', schemaArg: 'subscription_price' }],

  createForumTopic: [{ name: 'name', schemaArg: 'name' }],
  editForumTopic: [{ name: 'threadId', schemaArg: 'message_thread_id' }],
  closeForumTopic: [{ name: 'threadId', schemaArg: 'message_thread_id' }],
  reopenForumTopic: [{ name: 'threadId', schemaArg: 'message_thread_id' }],
  deleteForumTopic: [{ name: 'threadId', schemaArg: 'message_thread_id' }],
  unpinAllForumTopicMessages: [{ name: 'threadId', schemaArg: 'message_thread_id' }],
  editGeneralForumTopic: [{ name: 'name', schemaArg: 'name' }],

  setGameScore: [{ name: 'user', schemaArg: 'user_id' }, { name: 'score', schemaArg: 'score' }],
  getGameHighScores: [{ name: 'user', schemaArg: 'user_id' }],

  sendGift: [{ name: 'giftId', schemaArg: 'gift_id' }],
  stopPoll: [{ name: 'messageId', schemaArg: 'message_id' }],
  deleteMessageReaction: [{ name: 'messageId', schemaArg: 'message_id' }],
  approveSuggestedPost: [{ name: 'messageId', schemaArg: 'message_id' }],
  declineSuggestedPost: [{ name: 'messageId', schemaArg: 'message_id' }],
  readBusinessMessage: [{ name: 'messageId', schemaArg: 'message_id' }]
}

// curated subset emitted onto `Telegram` itself; `verb` is the public name (rename allowed)
export interface ShortcutSpec {
  verb: string
  method: string
}

export const SHORTCUTS: ShortcutSpec[] = [
  { verb: 'send', method: 'sendMessage' },
  { verb: 'sendPhoto', method: 'sendPhoto' },
  { verb: 'sendAudio', method: 'sendAudio' },
  { verb: 'sendDocument', method: 'sendDocument' },
  { verb: 'sendVideo', method: 'sendVideo' },
  { verb: 'sendAnimation', method: 'sendAnimation' },
  { verb: 'sendVoice', method: 'sendVoice' },
  { verb: 'sendVideoNote', method: 'sendVideoNote' },
  { verb: 'sendLivePhoto', method: 'sendLivePhoto' },
  { verb: 'sendSticker', method: 'sendSticker' },
  { verb: 'sendWidget', method: 'sendWidget' },
  { verb: 'sendSharedWidget', method: 'sendSharedWidget' },
  { verb: 'sendLocation', method: 'sendLocation' },
  { verb: 'sendVenue', method: 'sendVenue' },
  { verb: 'sendContact', method: 'sendContact' },
  { verb: 'sendDice', method: 'sendDice' },
  { verb: 'sendChatAction', method: 'sendChatAction' },
  { verb: 'sendPoll', method: 'sendPoll' },
  { verb: 'sendMediaGroup', method: 'sendMediaGroup' },
  { verb: 'forward', method: 'forwardMessage' },
  { verb: 'forwardMany', method: 'forwardMessages' },
  { verb: 'copy', method: 'copyMessage' },
  { verb: 'copyMany', method: 'copyMessages' },
  { verb: 'delete', method: 'deleteMessage' },
  { verb: 'deleteMany', method: 'deleteMessages' },
  { verb: 'pin', method: 'pinChatMessage' },
  { verb: 'unpin', method: 'unpinChatMessage' },
  { verb: 'kick', method: 'banChatMember' },
  { verb: 'ban', method: 'banChatMember' },
  { verb: 'unban', method: 'unbanChatMember' },
  { verb: 'react', method: 'setMessageReaction' }
]
