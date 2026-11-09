import type { Telegram } from 'puregram'

import { TestEnv } from './env'
import type { TestEnvOptions } from './options'

export function createTestEnv<TG extends Telegram> (tg: TG, options?: TestEnvOptions) {
  return new TestEnv(tg, options)
}

export { TestChat } from './actors/chat'
export type { ChatMembership, ChatType } from './actors/chat'
export type { ActorMediaInput, ResolvedMedia } from './actors/media-input'
export { TestMessage } from './actors/message'
export { TestUserInChat, TestUserOnMessage } from './actors/scopes'
export { TestUser } from './actors/user'
export type { CreateUserOptions } from './actors/user'
export { installTestClock } from './clock'
export type { TestClock } from './clock'
export { TestEnv } from './env'
export type { ApiCallRecord } from './env'
export { MembershipRequired } from './errors'
export {
  buildCallbackQuery,
  buildChat,
  buildInlineQuery,
  buildMessage,
  buildSharedWidgetQuery,
  buildUpdate,
  buildUser,
  buildWidgetQuery,
  resetFixtureCounters
} from './fixtures'
export type { UpdateKind } from './fixtures'
export type { TestEnvOptions } from './options'
export { apiError, isApiErrorSentinel } from './stubs/api-error'
export type { ApiErrorSentinel } from './stubs/api-error'
export type { PackFactory } from './plugins/registry'
export { registerPack } from './plugins/registry'
export { FileStore } from './world/files'
export type { FileHandle } from './world/files'
