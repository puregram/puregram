import * as filters from './filters'

export { Telegram } from './telegram'
export type { EphemeralScopeOptions } from './telegram'
export type { TelegramOptions } from './options'
export { TelegramError, ApiError } from './errors'
export type { ApiResponseError } from './errors'
export { MediaSource, MediaSourceType, type MediaInput } from './media-source'
export { UpdatesFilter } from './updates-filter'

export { createPlugin } from './plugins/plugin'
export type { Plugin } from './plugins/plugin'
export { PluginConflict, PluginCycle, PluginMissingDep } from './plugins/installer'

export type { HttpClient, HttpDownloadResponse, HttpRequestInput, HttpResponse } from './http/client'
export type { DownloadTarget } from './api/download'
export { ChatActionController } from './api/chat-action'
export { resolveDownloadTarget } from './api/download'
export type {
  DispatchErrorContext,
  DispatchErrorHandler,
  ErrorContext,
  ErrorHandler,
  HookPriority,
  Middleware,
  RequestContext
} from './dispatch/hooks'
export type { UpdatePredicate } from './dispatch/on'
export type { StartPollingOptions } from './transport/polling'
export type {
  NodeWebhookCallback,
  ParsedRequest,
  WebhookHandler,
  WebhookOptions,
  WebhookResponse
} from './transport/webhook'
export type { DeleteWebhookOptions, SetWebhookOptions } from './transport/webhook/helpers'
export type { StartWebhookOptions, StartWebhookResult } from './transport/webhook/listener'

export { UnsupportedUpdate } from './dispatch/update-builder'
export { attach } from './dispatch/attach'
export { randomId } from './random-id'

export * from './keyboards'
export * from './parse-mode'

export { filters }

// the wildcard re-export below intentionally exposes generated InputMedia and
// InlineQueryResult so the named export beneath it can shadow them with
// hand-crafted versions (extra statics for sticker/videoNote/voice +
// .button/.cached). ts resolves the shadow correctly; import/export plugin
// doesn't model named-over-wildcard, hence the disables
/* eslint-disable import/export */
export * from '@puregram/api'

export { InputMedia, MediaGroup, RichMedia, InlineQueryResult, InlineQueryResultCached, InputMessageContent } from './factories'
export { ReplyParameters, LinkPreview, Reaction } from './factories'
export { ChatPermissions, ChatAdministratorRights } from './factories'
export {
  BotCommands,
  InputPollOption,
  InputSticker,
  Invoice,
  LabeledPrice,
  MenuButton,
  ShippingOption
} from './factories'
export type { InputMediaSticker, InputMediaVideoNote, InputMediaVoice, RichMediaLinkKind } from './factories'
/* eslint-enable import/export */
