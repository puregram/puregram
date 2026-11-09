/// AUTO-GENERATED FILE — do not edit by hand
/// Bot API 10.4
/// source: https://core.telegram.org/bots/api
/// generated at: 2026-11-09T13:32:34.299Z
/// see scripts/emit.ts in @puregram/api

import type { Filter } from "../filter-runtime";
import type { BoostAddedUpdate, BusinessConnectionUpdate, BusinessMessageUpdate, CallbackQueryUpdate, ChannelPostUpdate, ChatBoostUpdate, ChatJoinRequestUpdate, ChatMemberUpdate, ChatSharedUpdate, ChosenInlineResultUpdate, CommunityChatAddedUpdate, CommunityChatRemovedUpdate, DeleteChatPhotoUpdate, DeletedBusinessMessagesUpdate, EditedBusinessMessageUpdate, EditedChannelPostUpdate, EditedMessageUpdate, ForumTopicClosedUpdate, ForumTopicCreatedUpdate, ForumTopicEditedUpdate, ForumTopicReopenedUpdate, GeneralForumTopicHiddenUpdate, GeneralForumTopicUnhiddenUpdate, GiveawayCompletedUpdate, GiveawayCreatedUpdate, GiveawayWinnersUpdate, GroupChatCreatedUpdate, GuestMessageUpdate, InlineQueryUpdate, InvoiceUpdate, LeftChatMemberUpdate, ManagedBotUpdate, MessageAutoDeleteTimerChangedUpdate, MessageReactionCountUpdate, MessageReactionUpdate, MessageUpdate, MigrateFromChatIdUpdate, MigrateToChatIdUpdate, MyChatMemberUpdate, NewChatMembersUpdate, NewChatPhotoUpdate, NewChatTitleUpdate, PaidMessagesWaivedUpdate, PassportDataUpdate, PinnedMessageUpdate, PollAnswerUpdate, PollUpdate, PreCheckoutQueryUpdate, ProximityAlertTriggeredUpdate, PurchasedPaidMediaUpdate, RemovedChatBoostUpdate, SharedWidgetQueryUpdate, ShippingQueryUpdate, StoppedMessageGenerationUpdate, SubscriptionUpdate, SuccessfulPaymentUpdate, TonWalletTransferUpdate, UsersSharedUpdate, VideoChatEndedUpdate, VideoChatParticipantsInvitedUpdate, VideoChatScheduledUpdate, VideoChatStartedUpdate, WebAppDataUpdate, WidgetQueryUpdate, WriteAccessAllowedUpdate } from "./updates";
/**
 * pre-bound `Filter` for `MessageUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type MessageFilter<Mod = unknown> = Filter<MessageUpdate, Mod>;

/**
 * pre-bound `Filter` for `EditedMessageUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type EditedMessageFilter<Mod = unknown> = Filter<EditedMessageUpdate, Mod>;

/**
 * pre-bound `Filter` for `ChannelPostUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type ChannelPostFilter<Mod = unknown> = Filter<ChannelPostUpdate, Mod>;

/**
 * pre-bound `Filter` for `EditedChannelPostUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type EditedChannelPostFilter<Mod = unknown> = Filter<EditedChannelPostUpdate, Mod>;

/**
 * pre-bound `Filter` for `BusinessConnectionUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type BusinessConnectionFilter<Mod = unknown> = Filter<BusinessConnectionUpdate, Mod>;

/**
 * pre-bound `Filter` for `BusinessMessageUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type BusinessMessageFilter<Mod = unknown> = Filter<BusinessMessageUpdate, Mod>;

/**
 * pre-bound `Filter` for `EditedBusinessMessageUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type EditedBusinessMessageFilter<Mod = unknown> = Filter<EditedBusinessMessageUpdate, Mod>;

/**
 * pre-bound `Filter` for `DeletedBusinessMessagesUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type DeletedBusinessMessagesFilter<Mod = unknown> = Filter<DeletedBusinessMessagesUpdate, Mod>;

/**
 * pre-bound `Filter` for `GuestMessageUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type GuestMessageFilter<Mod = unknown> = Filter<GuestMessageUpdate, Mod>;

/**
 * pre-bound `Filter` for `MessageReactionUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type MessageReactionFilter<Mod = unknown> = Filter<MessageReactionUpdate, Mod>;

/**
 * pre-bound `Filter` for `MessageReactionCountUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type MessageReactionCountFilter<Mod = unknown> = Filter<MessageReactionCountUpdate, Mod>;

/**
 * pre-bound `Filter` for `InlineQueryUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type InlineQueryFilter<Mod = unknown> = Filter<InlineQueryUpdate, Mod>;

/**
 * pre-bound `Filter` for `ChosenInlineResultUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type ChosenInlineResultFilter<Mod = unknown> = Filter<ChosenInlineResultUpdate, Mod>;

/**
 * pre-bound `Filter` for `CallbackQueryUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type CallbackQueryFilter<Mod = unknown> = Filter<CallbackQueryUpdate, Mod>;

/**
 * pre-bound `Filter` for `WidgetQueryUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type WidgetQueryFilter<Mod = unknown> = Filter<WidgetQueryUpdate, Mod>;

/**
 * pre-bound `Filter` for `SharedWidgetQueryUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type SharedWidgetQueryFilter<Mod = unknown> = Filter<SharedWidgetQueryUpdate, Mod>;

/**
 * pre-bound `Filter` for `ShippingQueryUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type ShippingQueryFilter<Mod = unknown> = Filter<ShippingQueryUpdate, Mod>;

/**
 * pre-bound `Filter` for `PreCheckoutQueryUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type PreCheckoutQueryFilter<Mod = unknown> = Filter<PreCheckoutQueryUpdate, Mod>;

/**
 * pre-bound `Filter` for `PurchasedPaidMediaUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type PurchasedPaidMediaFilter<Mod = unknown> = Filter<PurchasedPaidMediaUpdate, Mod>;

/**
 * pre-bound `Filter` for `PollUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type PollFilter<Mod = unknown> = Filter<PollUpdate, Mod>;

/**
 * pre-bound `Filter` for `PollAnswerUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type PollAnswerFilter<Mod = unknown> = Filter<PollAnswerUpdate, Mod>;

/**
 * pre-bound `Filter` for `MyChatMemberUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type MyChatMemberFilter<Mod = unknown> = Filter<MyChatMemberUpdate, Mod>;

/**
 * pre-bound `Filter` for `ChatMemberUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type ChatMemberFilter<Mod = unknown> = Filter<ChatMemberUpdate, Mod>;

/**
 * pre-bound `Filter` for `ChatJoinRequestUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type ChatJoinRequestFilter<Mod = unknown> = Filter<ChatJoinRequestUpdate, Mod>;

/**
 * pre-bound `Filter` for `ChatBoostUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type ChatBoostFilter<Mod = unknown> = Filter<ChatBoostUpdate, Mod>;

/**
 * pre-bound `Filter` for `RemovedChatBoostUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type RemovedChatBoostFilter<Mod = unknown> = Filter<RemovedChatBoostUpdate, Mod>;

/**
 * pre-bound `Filter` for `ManagedBotUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type ManagedBotFilter<Mod = unknown> = Filter<ManagedBotUpdate, Mod>;

/**
 * pre-bound `Filter` for `SubscriptionUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type SubscriptionFilter<Mod = unknown> = Filter<SubscriptionUpdate, Mod>;

/**
 * pre-bound `Filter` for `StoppedMessageGenerationUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type StoppedMessageGenerationFilter<Mod = unknown> = Filter<StoppedMessageGenerationUpdate, Mod>;

/**
 * pre-bound `Filter` for `NewChatMembersUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type NewChatMembersFilter<Mod = unknown> = Filter<NewChatMembersUpdate, Mod>;

/**
 * pre-bound `Filter` for `LeftChatMemberUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type LeftChatMemberFilter<Mod = unknown> = Filter<LeftChatMemberUpdate, Mod>;

/**
 * pre-bound `Filter` for `NewChatTitleUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type NewChatTitleFilter<Mod = unknown> = Filter<NewChatTitleUpdate, Mod>;

/**
 * pre-bound `Filter` for `NewChatPhotoUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type NewChatPhotoFilter<Mod = unknown> = Filter<NewChatPhotoUpdate, Mod>;

/**
 * pre-bound `Filter` for `DeleteChatPhotoUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type DeleteChatPhotoFilter<Mod = unknown> = Filter<DeleteChatPhotoUpdate, Mod>;

/**
 * pre-bound `Filter` for `GroupChatCreatedUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type GroupChatCreatedFilter<Mod = unknown> = Filter<GroupChatCreatedUpdate, Mod>;

/**
 * pre-bound `Filter` for `PinnedMessageUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type PinnedMessageFilter<Mod = unknown> = Filter<PinnedMessageUpdate, Mod>;

/**
 * pre-bound `Filter` for `InvoiceUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type InvoiceFilter<Mod = unknown> = Filter<InvoiceUpdate, Mod>;

/**
 * pre-bound `Filter` for `SuccessfulPaymentUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type SuccessfulPaymentFilter<Mod = unknown> = Filter<SuccessfulPaymentUpdate, Mod>;

/**
 * pre-bound `Filter` for `UsersSharedUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type UsersSharedFilter<Mod = unknown> = Filter<UsersSharedUpdate, Mod>;

/**
 * pre-bound `Filter` for `ChatSharedUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type ChatSharedFilter<Mod = unknown> = Filter<ChatSharedUpdate, Mod>;

/**
 * pre-bound `Filter` for `WebAppDataUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type WebAppDataFilter<Mod = unknown> = Filter<WebAppDataUpdate, Mod>;

/**
 * pre-bound `Filter` for `VideoChatScheduledUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type VideoChatScheduledFilter<Mod = unknown> = Filter<VideoChatScheduledUpdate, Mod>;

/**
 * pre-bound `Filter` for `VideoChatStartedUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type VideoChatStartedFilter<Mod = unknown> = Filter<VideoChatStartedUpdate, Mod>;

/**
 * pre-bound `Filter` for `VideoChatEndedUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type VideoChatEndedFilter<Mod = unknown> = Filter<VideoChatEndedUpdate, Mod>;

/**
 * pre-bound `Filter` for `VideoChatParticipantsInvitedUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type VideoChatParticipantsInvitedFilter<Mod = unknown> = Filter<VideoChatParticipantsInvitedUpdate, Mod>;

/**
 * pre-bound `Filter` for `ForumTopicCreatedUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type ForumTopicCreatedFilter<Mod = unknown> = Filter<ForumTopicCreatedUpdate, Mod>;

/**
 * pre-bound `Filter` for `ForumTopicEditedUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type ForumTopicEditedFilter<Mod = unknown> = Filter<ForumTopicEditedUpdate, Mod>;

/**
 * pre-bound `Filter` for `ForumTopicClosedUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type ForumTopicClosedFilter<Mod = unknown> = Filter<ForumTopicClosedUpdate, Mod>;

/**
 * pre-bound `Filter` for `ForumTopicReopenedUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type ForumTopicReopenedFilter<Mod = unknown> = Filter<ForumTopicReopenedUpdate, Mod>;

/**
 * pre-bound `Filter` for `GeneralForumTopicHiddenUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type GeneralForumTopicHiddenFilter<Mod = unknown> = Filter<GeneralForumTopicHiddenUpdate, Mod>;

/**
 * pre-bound `Filter` for `GeneralForumTopicUnhiddenUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type GeneralForumTopicUnhiddenFilter<Mod = unknown> = Filter<GeneralForumTopicUnhiddenUpdate, Mod>;

/**
 * pre-bound `Filter` for `GiveawayCreatedUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type GiveawayCreatedFilter<Mod = unknown> = Filter<GiveawayCreatedUpdate, Mod>;

/**
 * pre-bound `Filter` for `GiveawayCompletedUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type GiveawayCompletedFilter<Mod = unknown> = Filter<GiveawayCompletedUpdate, Mod>;

/**
 * pre-bound `Filter` for `GiveawayWinnersUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type GiveawayWinnersFilter<Mod = unknown> = Filter<GiveawayWinnersUpdate, Mod>;

/**
 * pre-bound `Filter` for `BoostAddedUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type BoostAddedFilter<Mod = unknown> = Filter<BoostAddedUpdate, Mod>;

/**
 * pre-bound `Filter` for `MessageAutoDeleteTimerChangedUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type MessageAutoDeleteTimerChangedFilter<Mod = unknown> = Filter<MessageAutoDeleteTimerChangedUpdate, Mod>;

/**
 * pre-bound `Filter` for `MigrateToChatIdUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type MigrateToChatIdFilter<Mod = unknown> = Filter<MigrateToChatIdUpdate, Mod>;

/**
 * pre-bound `Filter` for `MigrateFromChatIdUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type MigrateFromChatIdFilter<Mod = unknown> = Filter<MigrateFromChatIdUpdate, Mod>;

/**
 * pre-bound `Filter` for `PassportDataUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type PassportDataFilter<Mod = unknown> = Filter<PassportDataUpdate, Mod>;

/**
 * pre-bound `Filter` for `ProximityAlertTriggeredUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type ProximityAlertTriggeredFilter<Mod = unknown> = Filter<ProximityAlertTriggeredUpdate, Mod>;

/**
 * pre-bound `Filter` for `WriteAccessAllowedUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type WriteAccessAllowedFilter<Mod = unknown> = Filter<WriteAccessAllowedUpdate, Mod>;

/**
 * pre-bound `Filter` for `CommunityChatAddedUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type CommunityChatAddedFilter<Mod = unknown> = Filter<CommunityChatAddedUpdate, Mod>;

/**
 * pre-bound `Filter` for `CommunityChatRemovedUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type CommunityChatRemovedFilter<Mod = unknown> = Filter<CommunityChatRemovedUpdate, Mod>;

/**
 * pre-bound `Filter` for `PaidMessagesWaivedUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type PaidMessagesWaivedFilter<Mod = unknown> = Filter<PaidMessagesWaivedUpdate, Mod>;

/**
 * pre-bound `Filter` for `TonWalletTransferUpdate`. compose via `.and()` / `.or()` to layer Mod refinements
 */
export type TonWalletTransferFilter<Mod = unknown> = Filter<TonWalletTransferUpdate, Mod>;

/**
 * cross-kind filter. used by `tg.onUpdate(filter, h)` for predicates that span update kinds
 */
export type AnyUpdateFilter<Mod = unknown> = Filter<unknown, Mod>;