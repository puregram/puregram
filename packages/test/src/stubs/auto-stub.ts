import type { World } from '../world/world'

import { answerTrue } from './auto/answers'
import { getChat, getMe } from './auto/identity'
import {
  banChatMember,
  getChatAdministrators,
  getChatMember,
  getChatMemberCount,
  promoteChatMember,
  restrictChatMember,
  setChatAdministratorCustomTitle,
  setChatPermissions,
  unbanChatMember
} from './auto/membership'
import {
  copyMessage,
  copyMessages,
  deleteMessage,
  deleteMessages,
  editMessageCaption,
  editMessageLiveLocation,
  editMessageMedia,
  editMessageReplyMarkup,
  editMessageText,
  forwardMessage,
  forwardMessages,
  sendAnimation,
  sendAudio,
  sendContact,
  sendDice,
  sendDocument,
  sendLocation,
  sendMediaGroup,
  sendMessage,
  sendPhoto,
  sendPoll,
  sendSticker,
  sendVenue,
  sendVideo,
  sendVideoNote,
  sendVoice,
  stopMessageLiveLocation
} from './auto/messages'
import { pinChatMessage, unpinAllChatMessages, unpinChatMessage } from './auto/pins'
import { setMessageReaction } from './auto/reactions'

type AutoStubFn = (world: World, params: Record<string, unknown>) => unknown

const TABLE: Record<string, AutoStubFn> = {
  getMe,
  getChat,

  sendMessage,
  sendPhoto,
  sendDocument,
  sendVideo,
  sendAudio,
  sendVoice,
  sendAnimation,
  sendVideoNote,
  sendSticker,
  sendLocation,
  sendVenue,
  sendContact,
  sendPoll,
  sendDice,
  sendMediaGroup,
  forwardMessage,
  forwardMessages,
  copyMessage,
  copyMessages,

  editMessageText,
  editMessageCaption,
  editMessageReplyMarkup,
  editMessageMedia,
  editMessageLiveLocation,
  stopMessageLiveLocation,

  deleteMessage,
  deleteMessages,

  pinChatMessage,
  unpinChatMessage,
  unpinAllChatMessages,

  setMessageReaction,

  banChatMember,
  unbanChatMember,
  restrictChatMember,
  promoteChatMember,
  setChatAdministratorCustomTitle,
  setChatPermissions,
  getChatMember,
  getChatMemberCount,
  getChatAdministrators,

  answerCallbackQuery: answerTrue,
  answerWidgetQuery: answerTrue,
  answerInlineQuery: answerTrue,
  answerWebAppQuery: answerTrue,
  answerShippingQuery: answerTrue,
  answerPreCheckoutQuery: answerTrue
}

export const STRICT_FALLBACK = Symbol.for('puregram.test.strictFallback')

export function runAutoStub (world: World, method: string, params: Record<string, unknown>) {
  const fn = TABLE[method]

  if (fn === undefined) {
    return STRICT_FALLBACK
  }

  return fn(world, params)
}

export { TABLE as AUTO_STUB_TABLE }
