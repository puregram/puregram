/// AUTO-GENERATED FILE — do not edit by hand
/// Bot API 10.4
/// source: https://core.telegram.org/bots/api
/// generated at: 2026-11-09T13:32:34.299Z
/// see scripts/emit.ts in @puregram/api

import type { Filter } from "../filter-runtime";
import type { Modify } from "../util-types";
import type { OnOptions, UpdateHandler } from "../dispatch-runtime";
import type { BoostAddedUpdate, BusinessConnectionUpdate, BusinessMessageUpdate, CallbackQueryUpdate, ChannelPostUpdate, ChatBoostUpdate, ChatJoinRequestUpdate, ChatMemberUpdate, ChatSharedUpdate, ChosenInlineResultUpdate, CommunityChatAddedUpdate, CommunityChatRemovedUpdate, DeleteChatPhotoUpdate, DeletedBusinessMessagesUpdate, EditedBusinessMessageUpdate, EditedChannelPostUpdate, EditedMessageUpdate, ForumTopicClosedUpdate, ForumTopicCreatedUpdate, ForumTopicEditedUpdate, ForumTopicReopenedUpdate, GeneralForumTopicHiddenUpdate, GeneralForumTopicUnhiddenUpdate, GiveawayCompletedUpdate, GiveawayCreatedUpdate, GiveawayWinnersUpdate, GroupChatCreatedUpdate, GuestMessageUpdate, InlineQueryUpdate, InvoiceUpdate, LeftChatMemberUpdate, ManagedBotUpdate, MessageAutoDeleteTimerChangedUpdate, MessageReactionCountUpdate, MessageReactionUpdate, MessageUpdate, MigrateFromChatIdUpdate, MigrateToChatIdUpdate, MyChatMemberUpdate, NewChatMembersUpdate, NewChatPhotoUpdate, NewChatTitleUpdate, PaidMessagesWaivedUpdate, PassportDataUpdate, PinnedMessageUpdate, PollAnswerUpdate, PollUpdate, PreCheckoutQueryUpdate, ProximityAlertTriggeredUpdate, PurchasedPaidMediaUpdate, RemovedChatBoostUpdate, SharedWidgetQueryUpdate, ShippingQueryUpdate, StoppedMessageGenerationUpdate, SubscriptionUpdate, SuccessfulPaymentUpdate, TonWalletTransferUpdate, UsersSharedUpdate, VideoChatEndedUpdate, VideoChatParticipantsInvitedUpdate, VideoChatScheduledUpdate, VideoChatStartedUpdate, WebAppDataUpdate, WidgetQueryUpdate, WriteAccessAllowedUpdate } from "./updates";
export interface TelegramDispatchers {
    /**
     * register a handler for every `message` update
     */
    onMessage(handler: UpdateHandler<MessageUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `message` updates. handler arg narrows via `Modify<MessageUpdate, Mod>`
     */
    onMessage<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<MessageUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `edited_message` update
     */
    onEditedMessage(handler: UpdateHandler<EditedMessageUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `edited_message` updates. handler arg narrows via `Modify<EditedMessageUpdate, Mod>`
     */
    onEditedMessage<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<EditedMessageUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `channel_post` update
     */
    onChannelPost(handler: UpdateHandler<ChannelPostUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `channel_post` updates. handler arg narrows via `Modify<ChannelPostUpdate, Mod>`
     */
    onChannelPost<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<ChannelPostUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `edited_channel_post` update
     */
    onEditedChannelPost(handler: UpdateHandler<EditedChannelPostUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `edited_channel_post` updates. handler arg narrows via `Modify<EditedChannelPostUpdate, Mod>`
     */
    onEditedChannelPost<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<EditedChannelPostUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `business_connection` update
     */
    onBusinessConnection(handler: UpdateHandler<BusinessConnectionUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `business_connection` updates. handler arg narrows via `Modify<BusinessConnectionUpdate, Mod>`
     */
    onBusinessConnection<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<BusinessConnectionUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `business_message` update
     */
    onBusinessMessage(handler: UpdateHandler<BusinessMessageUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `business_message` updates. handler arg narrows via `Modify<BusinessMessageUpdate, Mod>`
     */
    onBusinessMessage<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<BusinessMessageUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `edited_business_message` update
     */
    onEditedBusinessMessage(handler: UpdateHandler<EditedBusinessMessageUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `edited_business_message` updates. handler arg narrows via `Modify<EditedBusinessMessageUpdate, Mod>`
     */
    onEditedBusinessMessage<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<EditedBusinessMessageUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `deleted_business_messages` update
     */
    onDeletedBusinessMessages(handler: UpdateHandler<DeletedBusinessMessagesUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `deleted_business_messages` updates. handler arg narrows via `Modify<DeletedBusinessMessagesUpdate, Mod>`
     */
    onDeletedBusinessMessages<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<DeletedBusinessMessagesUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `guest_message` update
     */
    onGuestMessage(handler: UpdateHandler<GuestMessageUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `guest_message` updates. handler arg narrows via `Modify<GuestMessageUpdate, Mod>`
     */
    onGuestMessage<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<GuestMessageUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `message_reaction` update
     */
    onMessageReaction(handler: UpdateHandler<MessageReactionUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `message_reaction` updates. handler arg narrows via `Modify<MessageReactionUpdate, Mod>`
     */
    onMessageReaction<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<MessageReactionUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `message_reaction_count` update
     */
    onMessageReactionCount(handler: UpdateHandler<MessageReactionCountUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `message_reaction_count` updates. handler arg narrows via `Modify<MessageReactionCountUpdate, Mod>`
     */
    onMessageReactionCount<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<MessageReactionCountUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `inline_query` update
     */
    onInlineQuery(handler: UpdateHandler<InlineQueryUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `inline_query` updates. handler arg narrows via `Modify<InlineQueryUpdate, Mod>`
     */
    onInlineQuery<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<InlineQueryUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `chosen_inline_result` update
     */
    onChosenInlineResult(handler: UpdateHandler<ChosenInlineResultUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `chosen_inline_result` updates. handler arg narrows via `Modify<ChosenInlineResultUpdate, Mod>`
     */
    onChosenInlineResult<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<ChosenInlineResultUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `callback_query` update
     */
    onCallbackQuery(handler: UpdateHandler<CallbackQueryUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `callback_query` updates. handler arg narrows via `Modify<CallbackQueryUpdate, Mod>`
     */
    onCallbackQuery<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<CallbackQueryUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `widget_query` update
     */
    onWidgetQuery(handler: UpdateHandler<WidgetQueryUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `widget_query` updates. handler arg narrows via `Modify<WidgetQueryUpdate, Mod>`
     */
    onWidgetQuery<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<WidgetQueryUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `shared_widget_query` update
     */
    onSharedWidgetQuery(handler: UpdateHandler<SharedWidgetQueryUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `shared_widget_query` updates. handler arg narrows via `Modify<SharedWidgetQueryUpdate, Mod>`
     */
    onSharedWidgetQuery<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<SharedWidgetQueryUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `shipping_query` update
     */
    onShippingQuery(handler: UpdateHandler<ShippingQueryUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `shipping_query` updates. handler arg narrows via `Modify<ShippingQueryUpdate, Mod>`
     */
    onShippingQuery<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<ShippingQueryUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `pre_checkout_query` update
     */
    onPreCheckoutQuery(handler: UpdateHandler<PreCheckoutQueryUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `pre_checkout_query` updates. handler arg narrows via `Modify<PreCheckoutQueryUpdate, Mod>`
     */
    onPreCheckoutQuery<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<PreCheckoutQueryUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `purchased_paid_media` update
     */
    onPurchasedPaidMedia(handler: UpdateHandler<PurchasedPaidMediaUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `purchased_paid_media` updates. handler arg narrows via `Modify<PurchasedPaidMediaUpdate, Mod>`
     */
    onPurchasedPaidMedia<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<PurchasedPaidMediaUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `poll` update
     */
    onPoll(handler: UpdateHandler<PollUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `poll` updates. handler arg narrows via `Modify<PollUpdate, Mod>`
     */
    onPoll<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<PollUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `poll_answer` update
     */
    onPollAnswer(handler: UpdateHandler<PollAnswerUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `poll_answer` updates. handler arg narrows via `Modify<PollAnswerUpdate, Mod>`
     */
    onPollAnswer<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<PollAnswerUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `my_chat_member` update
     */
    onMyChatMember(handler: UpdateHandler<MyChatMemberUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `my_chat_member` updates. handler arg narrows via `Modify<MyChatMemberUpdate, Mod>`
     */
    onMyChatMember<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<MyChatMemberUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `chat_member` update
     */
    onChatMember(handler: UpdateHandler<ChatMemberUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `chat_member` updates. handler arg narrows via `Modify<ChatMemberUpdate, Mod>`
     */
    onChatMember<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<ChatMemberUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `chat_join_request` update
     */
    onChatJoinRequest(handler: UpdateHandler<ChatJoinRequestUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `chat_join_request` updates. handler arg narrows via `Modify<ChatJoinRequestUpdate, Mod>`
     */
    onChatJoinRequest<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<ChatJoinRequestUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `chat_boost` update
     */
    onChatBoost(handler: UpdateHandler<ChatBoostUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `chat_boost` updates. handler arg narrows via `Modify<ChatBoostUpdate, Mod>`
     */
    onChatBoost<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<ChatBoostUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `removed_chat_boost` update
     */
    onRemovedChatBoost(handler: UpdateHandler<RemovedChatBoostUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `removed_chat_boost` updates. handler arg narrows via `Modify<RemovedChatBoostUpdate, Mod>`
     */
    onRemovedChatBoost<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<RemovedChatBoostUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `managed_bot` update
     */
    onManagedBot(handler: UpdateHandler<ManagedBotUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `managed_bot` updates. handler arg narrows via `Modify<ManagedBotUpdate, Mod>`
     */
    onManagedBot<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<ManagedBotUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `subscription` update
     */
    onSubscription(handler: UpdateHandler<SubscriptionUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `subscription` updates. handler arg narrows via `Modify<SubscriptionUpdate, Mod>`
     */
    onSubscription<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<SubscriptionUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `stopped_message_generation` update
     */
    onStoppedMessageGeneration(handler: UpdateHandler<StoppedMessageGenerationUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `stopped_message_generation` updates. handler arg narrows via `Modify<StoppedMessageGenerationUpdate, Mod>`
     */
    onStoppedMessageGeneration<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<StoppedMessageGenerationUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `new_chat_members` update
     */
    onNewChatMembers(handler: UpdateHandler<NewChatMembersUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `new_chat_members` updates. handler arg narrows via `Modify<NewChatMembersUpdate, Mod>`
     */
    onNewChatMembers<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<NewChatMembersUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `left_chat_member` update
     */
    onLeftChatMember(handler: UpdateHandler<LeftChatMemberUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `left_chat_member` updates. handler arg narrows via `Modify<LeftChatMemberUpdate, Mod>`
     */
    onLeftChatMember<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<LeftChatMemberUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `new_chat_title` update
     */
    onNewChatTitle(handler: UpdateHandler<NewChatTitleUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `new_chat_title` updates. handler arg narrows via `Modify<NewChatTitleUpdate, Mod>`
     */
    onNewChatTitle<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<NewChatTitleUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `new_chat_photo` update
     */
    onNewChatPhoto(handler: UpdateHandler<NewChatPhotoUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `new_chat_photo` updates. handler arg narrows via `Modify<NewChatPhotoUpdate, Mod>`
     */
    onNewChatPhoto<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<NewChatPhotoUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `delete_chat_photo` update
     */
    onDeleteChatPhoto(handler: UpdateHandler<DeleteChatPhotoUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `delete_chat_photo` updates. handler arg narrows via `Modify<DeleteChatPhotoUpdate, Mod>`
     */
    onDeleteChatPhoto<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<DeleteChatPhotoUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `group_chat_created` update
     */
    onGroupChatCreated(handler: UpdateHandler<GroupChatCreatedUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `group_chat_created` updates. handler arg narrows via `Modify<GroupChatCreatedUpdate, Mod>`
     */
    onGroupChatCreated<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<GroupChatCreatedUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `pinned_message` update
     */
    onPinnedMessage(handler: UpdateHandler<PinnedMessageUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `pinned_message` updates. handler arg narrows via `Modify<PinnedMessageUpdate, Mod>`
     */
    onPinnedMessage<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<PinnedMessageUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `invoice` update
     */
    onInvoice(handler: UpdateHandler<InvoiceUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `invoice` updates. handler arg narrows via `Modify<InvoiceUpdate, Mod>`
     */
    onInvoice<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<InvoiceUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `successful_payment` update
     */
    onSuccessfulPayment(handler: UpdateHandler<SuccessfulPaymentUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `successful_payment` updates. handler arg narrows via `Modify<SuccessfulPaymentUpdate, Mod>`
     */
    onSuccessfulPayment<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<SuccessfulPaymentUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `users_shared` update
     */
    onUsersShared(handler: UpdateHandler<UsersSharedUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `users_shared` updates. handler arg narrows via `Modify<UsersSharedUpdate, Mod>`
     */
    onUsersShared<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<UsersSharedUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `chat_shared` update
     */
    onChatShared(handler: UpdateHandler<ChatSharedUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `chat_shared` updates. handler arg narrows via `Modify<ChatSharedUpdate, Mod>`
     */
    onChatShared<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<ChatSharedUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `web_app_data` update
     */
    onWebAppData(handler: UpdateHandler<WebAppDataUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `web_app_data` updates. handler arg narrows via `Modify<WebAppDataUpdate, Mod>`
     */
    onWebAppData<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<WebAppDataUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `video_chat_scheduled` update
     */
    onVideoChatScheduled(handler: UpdateHandler<VideoChatScheduledUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `video_chat_scheduled` updates. handler arg narrows via `Modify<VideoChatScheduledUpdate, Mod>`
     */
    onVideoChatScheduled<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<VideoChatScheduledUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `video_chat_started` update
     */
    onVideoChatStarted(handler: UpdateHandler<VideoChatStartedUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `video_chat_started` updates. handler arg narrows via `Modify<VideoChatStartedUpdate, Mod>`
     */
    onVideoChatStarted<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<VideoChatStartedUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `video_chat_ended` update
     */
    onVideoChatEnded(handler: UpdateHandler<VideoChatEndedUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `video_chat_ended` updates. handler arg narrows via `Modify<VideoChatEndedUpdate, Mod>`
     */
    onVideoChatEnded<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<VideoChatEndedUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `video_chat_participants_invited` update
     */
    onVideoChatParticipantsInvited(handler: UpdateHandler<VideoChatParticipantsInvitedUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `video_chat_participants_invited` updates. handler arg narrows via `Modify<VideoChatParticipantsInvitedUpdate, Mod>`
     */
    onVideoChatParticipantsInvited<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<VideoChatParticipantsInvitedUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `forum_topic_created` update
     */
    onForumTopicCreated(handler: UpdateHandler<ForumTopicCreatedUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `forum_topic_created` updates. handler arg narrows via `Modify<ForumTopicCreatedUpdate, Mod>`
     */
    onForumTopicCreated<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<ForumTopicCreatedUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `forum_topic_edited` update
     */
    onForumTopicEdited(handler: UpdateHandler<ForumTopicEditedUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `forum_topic_edited` updates. handler arg narrows via `Modify<ForumTopicEditedUpdate, Mod>`
     */
    onForumTopicEdited<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<ForumTopicEditedUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `forum_topic_closed` update
     */
    onForumTopicClosed(handler: UpdateHandler<ForumTopicClosedUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `forum_topic_closed` updates. handler arg narrows via `Modify<ForumTopicClosedUpdate, Mod>`
     */
    onForumTopicClosed<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<ForumTopicClosedUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `forum_topic_reopened` update
     */
    onForumTopicReopened(handler: UpdateHandler<ForumTopicReopenedUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `forum_topic_reopened` updates. handler arg narrows via `Modify<ForumTopicReopenedUpdate, Mod>`
     */
    onForumTopicReopened<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<ForumTopicReopenedUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `general_forum_topic_hidden` update
     */
    onGeneralForumTopicHidden(handler: UpdateHandler<GeneralForumTopicHiddenUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `general_forum_topic_hidden` updates. handler arg narrows via `Modify<GeneralForumTopicHiddenUpdate, Mod>`
     */
    onGeneralForumTopicHidden<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<GeneralForumTopicHiddenUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `general_forum_topic_unhidden` update
     */
    onGeneralForumTopicUnhidden(handler: UpdateHandler<GeneralForumTopicUnhiddenUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `general_forum_topic_unhidden` updates. handler arg narrows via `Modify<GeneralForumTopicUnhiddenUpdate, Mod>`
     */
    onGeneralForumTopicUnhidden<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<GeneralForumTopicUnhiddenUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `giveaway_created` update
     */
    onGiveawayCreated(handler: UpdateHandler<GiveawayCreatedUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `giveaway_created` updates. handler arg narrows via `Modify<GiveawayCreatedUpdate, Mod>`
     */
    onGiveawayCreated<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<GiveawayCreatedUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `giveaway_completed` update
     */
    onGiveawayCompleted(handler: UpdateHandler<GiveawayCompletedUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `giveaway_completed` updates. handler arg narrows via `Modify<GiveawayCompletedUpdate, Mod>`
     */
    onGiveawayCompleted<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<GiveawayCompletedUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `giveaway_winners` update
     */
    onGiveawayWinners(handler: UpdateHandler<GiveawayWinnersUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `giveaway_winners` updates. handler arg narrows via `Modify<GiveawayWinnersUpdate, Mod>`
     */
    onGiveawayWinners<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<GiveawayWinnersUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `boost_added` update
     */
    onBoostAdded(handler: UpdateHandler<BoostAddedUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `boost_added` updates. handler arg narrows via `Modify<BoostAddedUpdate, Mod>`
     */
    onBoostAdded<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<BoostAddedUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `message_auto_delete_timer_changed` update
     */
    onMessageAutoDeleteTimerChanged(handler: UpdateHandler<MessageAutoDeleteTimerChangedUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `message_auto_delete_timer_changed` updates. handler arg narrows via `Modify<MessageAutoDeleteTimerChangedUpdate, Mod>`
     */
    onMessageAutoDeleteTimerChanged<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<MessageAutoDeleteTimerChangedUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `migrate_to_chat_id` update
     */
    onMigrateToChatId(handler: UpdateHandler<MigrateToChatIdUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `migrate_to_chat_id` updates. handler arg narrows via `Modify<MigrateToChatIdUpdate, Mod>`
     */
    onMigrateToChatId<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<MigrateToChatIdUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `migrate_from_chat_id` update
     */
    onMigrateFromChatId(handler: UpdateHandler<MigrateFromChatIdUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `migrate_from_chat_id` updates. handler arg narrows via `Modify<MigrateFromChatIdUpdate, Mod>`
     */
    onMigrateFromChatId<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<MigrateFromChatIdUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `passport_data` update
     */
    onPassportData(handler: UpdateHandler<PassportDataUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `passport_data` updates. handler arg narrows via `Modify<PassportDataUpdate, Mod>`
     */
    onPassportData<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<PassportDataUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `proximity_alert_triggered` update
     */
    onProximityAlertTriggered(handler: UpdateHandler<ProximityAlertTriggeredUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `proximity_alert_triggered` updates. handler arg narrows via `Modify<ProximityAlertTriggeredUpdate, Mod>`
     */
    onProximityAlertTriggered<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<ProximityAlertTriggeredUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `write_access_allowed` update
     */
    onWriteAccessAllowed(handler: UpdateHandler<WriteAccessAllowedUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `write_access_allowed` updates. handler arg narrows via `Modify<WriteAccessAllowedUpdate, Mod>`
     */
    onWriteAccessAllowed<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<WriteAccessAllowedUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `community_chat_added` update
     */
    onCommunityChatAdded(handler: UpdateHandler<CommunityChatAddedUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `community_chat_added` updates. handler arg narrows via `Modify<CommunityChatAddedUpdate, Mod>`
     */
    onCommunityChatAdded<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<CommunityChatAddedUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `community_chat_removed` update
     */
    onCommunityChatRemoved(handler: UpdateHandler<CommunityChatRemovedUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `community_chat_removed` updates. handler arg narrows via `Modify<CommunityChatRemovedUpdate, Mod>`
     */
    onCommunityChatRemoved<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<CommunityChatRemovedUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `paid_messages_waived` update
     */
    onPaidMessagesWaived(handler: UpdateHandler<PaidMessagesWaivedUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `paid_messages_waived` updates. handler arg narrows via `Modify<PaidMessagesWaivedUpdate, Mod>`
     */
    onPaidMessagesWaived<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<PaidMessagesWaivedUpdate, Mod>>, options?: OnOptions): this;
    /**
     * register a handler for every `ton_wallet_transfer` update
     */
    onTonWalletTransfer(handler: UpdateHandler<TonWalletTransferUpdate>, options?: OnOptions): this;
    /**
     * register a filter-gated handler for `ton_wallet_transfer` updates. handler arg narrows via `Modify<TonWalletTransferUpdate, Mod>`
     */
    onTonWalletTransfer<Mod>(filter: Filter<unknown, Mod>, handler: UpdateHandler<Modify<TonWalletTransferUpdate, Mod>>, options?: OnOptions): this;
}