/// AUTO-GENERATED FILE — do not edit by hand
/// Bot API 10.4
/// source: https://core.telegram.org/bots/api
/// generated at: 2026-11-09T13:32:34.299Z
/// see scripts/emit.ts in @puregram/api

import { defineFilter } from "../filter-runtime";
import type { Filter } from "../filter-runtime";
import type { AnyUpdate } from "../custom-update";
import type { UpdateKind, UpdateKindMap } from "./updates";
import type { Animation, Audio, Chat, ChatInviteLink, ChatShared, Contact, Dice, Document, ExternalReplyInfo, ForumTopicCreated, ForumTopicEdited, Game, Giveaway, GiveawayCompleted, GiveawayWinners, InlineKeyboardMarkup, Invoice, LinkPreviewOptions, LivePhoto, Location, MessageEntity, OrderInfo, PaidMessagesWaived, PassportData, PhotoSize, Poll, PollMedia, ProximityAlertTriggered, Sticker, Story, SuccessfulPayment, TextQuote, TonWalletTransfer, User, UsersShared, Venue, Video, VideoChatEnded, VideoChatParticipantsInvited, VideoChatScheduled, VideoNote, Voice, WebAppData, Widget, WriteAccessAllowed } from "./structures";
import type { TelegramBusinessBotRights, TelegramChatBackground, TelegramChatBoostAdded, TelegramChatOwnerChanged, TelegramChatOwnerLeft, TelegramChecklist, TelegramChecklistTasksAdded, TelegramChecklistTasksDone, TelegramCommunityChatAdded, TelegramCommunityChatJoined, TelegramCommunityChatRemoved, TelegramDirectMessagePriceChanged, TelegramDirectMessagesTopic, TelegramForumTopicClosed, TelegramForumTopicReopened, TelegramGeneralForumTopicHidden, TelegramGeneralForumTopicUnhidden, TelegramGiftInfo, TelegramGiveawayCreated, TelegramManagedBotCreated, TelegramMaybeInaccessibleMessage, TelegramMessageAutoDeleteTimerChanged, TelegramMessageOrigin, TelegramPaidMediaInfo, TelegramPaidMessagePriceChanged, TelegramPollOptionAdded, TelegramPollOptionDeleted, TelegramRefundedPayment, TelegramRichMessage, TelegramSuggestedPostApprovalFailed, TelegramSuggestedPostApproved, TelegramSuggestedPostDeclined, TelegramSuggestedPostInfo, TelegramSuggestedPostPaid, TelegramSuggestedPostRefunded, TelegramUniqueGiftInfo, TelegramVideoChatStarted } from "./types";
/**
 * filter — true if the update has `actorChat` set
 */
export const hasActorChat: Filter<unknown, {
    actorChat: Chat;
}> = /*#__PURE__*/ defineFilter("hasActorChat", (u: AnyUpdate): u is AnyUpdate => ((u as {
    actorChat?: unknown;
}).actorChat != null), { kinds: ["message_reaction"] });

/**
 * filter — true if the update has `animation` set
 */
export const hasAnimation: Filter<unknown, {
    animation: Animation;
}> = /*#__PURE__*/ defineFilter("hasAnimation", (u: AnyUpdate): u is AnyUpdate => ((u as {
    animation?: unknown;
}).animation != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `audio` set
 */
export const hasAudio: Filter<unknown, {
    audio: Audio;
}> = /*#__PURE__*/ defineFilter("hasAudio", (u: AnyUpdate): u is AnyUpdate => ((u as {
    audio?: unknown;
}).audio != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `authorSignature` set
 */
export const hasAuthorSignature: Filter<unknown, {
    authorSignature: string;
}> = /*#__PURE__*/ defineFilter("hasAuthorSignature", (u: AnyUpdate): u is AnyUpdate => ((u as {
    authorSignature?: unknown;
}).authorSignature != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `bio` set
 */
export const hasBio: Filter<unknown, {
    bio: string;
}> = /*#__PURE__*/ defineFilter("hasBio", (u: AnyUpdate): u is AnyUpdate => ((u as {
    bio?: unknown;
}).bio != null), { kinds: ["chat_join_request"] });

/**
 * filter — true if the update has `boostAdded` set
 */
export const hasBoostAdded: Filter<unknown, {
    boostAdded: TelegramChatBoostAdded;
}> = /*#__PURE__*/ defineFilter("hasBoostAdded", (u: AnyUpdate): u is AnyUpdate => ((u as {
    boostAdded?: unknown;
}).boostAdded != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `businessConnectionId` set
 */
export const hasBusinessConnectionId: Filter<unknown, {
    businessConnectionId: string;
}> = /*#__PURE__*/ defineFilter("hasBusinessConnectionId", (u: AnyUpdate): u is AnyUpdate => ((u as {
    businessConnectionId?: unknown;
}).businessConnectionId != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `caption` set
 */
export const hasCaption: Filter<unknown, {
    caption: string;
}> = /*#__PURE__*/ defineFilter("hasCaption", (u: AnyUpdate): u is AnyUpdate => ((u as {
    caption?: unknown;
}).caption != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `captionEntities` set
 */
export const hasCaptionEntities: Filter<unknown, {
    captionEntities: MessageEntity[];
}> = /*#__PURE__*/ defineFilter("hasCaptionEntities", (u: AnyUpdate): u is AnyUpdate => ((u as {
    captionEntities?: unknown;
}).captionEntities != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `channelChatCreated` set
 */
export const hasChannelChatCreated: Filter<unknown, {
    channelChatCreated: true;
}> = /*#__PURE__*/ defineFilter("hasChannelChatCreated", (u: AnyUpdate): u is AnyUpdate => ((u as {
    channelChatCreated?: unknown;
}).channelChatCreated != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `chat` set
 */
export const hasChat: Filter<unknown, {
    chat: Chat;
}> = /*#__PURE__*/ defineFilter("hasChat", (u: AnyUpdate): u is AnyUpdate => ((u as {
    chat?: unknown;
}).chat != null), { kinds: ["widget_query"] });

/**
 * filter — true if the update has `chatBackgroundSet` set
 */
export const hasChatBackgroundSet: Filter<unknown, {
    chatBackgroundSet: TelegramChatBackground;
}> = /*#__PURE__*/ defineFilter("hasChatBackgroundSet", (u: AnyUpdate): u is AnyUpdate => ((u as {
    chatBackgroundSet?: unknown;
}).chatBackgroundSet != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `chatOwnerChanged` set
 */
export const hasChatOwnerChanged: Filter<unknown, {
    chatOwnerChanged: TelegramChatOwnerChanged;
}> = /*#__PURE__*/ defineFilter("hasChatOwnerChanged", (u: AnyUpdate): u is AnyUpdate => ((u as {
    chatOwnerChanged?: unknown;
}).chatOwnerChanged != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `chatOwnerLeft` set
 */
export const hasChatOwnerLeft: Filter<unknown, {
    chatOwnerLeft: TelegramChatOwnerLeft;
}> = /*#__PURE__*/ defineFilter("hasChatOwnerLeft", (u: AnyUpdate): u is AnyUpdate => ((u as {
    chatOwnerLeft?: unknown;
}).chatOwnerLeft != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `chatShared` set
 */
export const hasChatShared: Filter<unknown, {
    chatShared: ChatShared;
}> = /*#__PURE__*/ defineFilter("hasChatShared", (u: AnyUpdate): u is AnyUpdate => ((u as {
    chatShared?: unknown;
}).chatShared != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `chatType` set
 */
export const hasChatType: Filter<unknown, {
    chatType: "sender" | "private" | "group" | "supergroup" | "channel";
}> = /*#__PURE__*/ defineFilter("hasChatType", (u: AnyUpdate): u is AnyUpdate => ((u as {
    chatType?: unknown;
}).chatType != null), { kinds: ["inline_query", "widget_query"] });

/**
 * filter — true if the update has `checklist` set
 */
export const hasChecklist: Filter<unknown, {
    checklist: TelegramChecklist;
}> = /*#__PURE__*/ defineFilter("hasChecklist", (u: AnyUpdate): u is AnyUpdate => ((u as {
    checklist?: unknown;
}).checklist != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `checklistTasksAdded` set
 */
export const hasChecklistTasksAdded: Filter<unknown, {
    checklistTasksAdded: TelegramChecklistTasksAdded;
}> = /*#__PURE__*/ defineFilter("hasChecklistTasksAdded", (u: AnyUpdate): u is AnyUpdate => ((u as {
    checklistTasksAdded?: unknown;
}).checklistTasksAdded != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `checklistTasksDone` set
 */
export const hasChecklistTasksDone: Filter<unknown, {
    checklistTasksDone: TelegramChecklistTasksDone;
}> = /*#__PURE__*/ defineFilter("hasChecklistTasksDone", (u: AnyUpdate): u is AnyUpdate => ((u as {
    checklistTasksDone?: unknown;
}).checklistTasksDone != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `closeDate` set
 */
export const hasCloseDate: Filter<unknown, {
    closeDate: number;
}> = /*#__PURE__*/ defineFilter("hasCloseDate", (u: AnyUpdate): u is AnyUpdate => ((u as {
    closeDate?: unknown;
}).closeDate != null), { kinds: ["poll"] });

/**
 * filter — true if the update has `communityChatAdded` set
 */
export const hasCommunityChatAdded: Filter<unknown, {
    communityChatAdded: TelegramCommunityChatAdded;
}> = /*#__PURE__*/ defineFilter("hasCommunityChatAdded", (u: AnyUpdate): u is AnyUpdate => ((u as {
    communityChatAdded?: unknown;
}).communityChatAdded != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `communityChatJoined` set
 */
export const hasCommunityChatJoined: Filter<unknown, {
    communityChatJoined: TelegramCommunityChatJoined;
}> = /*#__PURE__*/ defineFilter("hasCommunityChatJoined", (u: AnyUpdate): u is AnyUpdate => ((u as {
    communityChatJoined?: unknown;
}).communityChatJoined != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `communityChatRemoved` set
 */
export const hasCommunityChatRemoved: Filter<unknown, {
    communityChatRemoved: TelegramCommunityChatRemoved;
}> = /*#__PURE__*/ defineFilter("hasCommunityChatRemoved", (u: AnyUpdate): u is AnyUpdate => ((u as {
    communityChatRemoved?: unknown;
}).communityChatRemoved != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `connectedWebsite` set
 */
export const hasConnectedWebsite: Filter<unknown, {
    connectedWebsite: string;
}> = /*#__PURE__*/ defineFilter("hasConnectedWebsite", (u: AnyUpdate): u is AnyUpdate => ((u as {
    connectedWebsite?: unknown;
}).connectedWebsite != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `contact` set
 */
export const hasContact: Filter<unknown, {
    contact: Contact;
}> = /*#__PURE__*/ defineFilter("hasContact", (u: AnyUpdate): u is AnyUpdate => ((u as {
    contact?: unknown;
}).contact != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `correctOptionIds` set
 */
export const hasCorrectOptionIds: Filter<unknown, {
    correctOptionIds: number[];
}> = /*#__PURE__*/ defineFilter("hasCorrectOptionIds", (u: AnyUpdate): u is AnyUpdate => ((u as {
    correctOptionIds?: unknown;
}).correctOptionIds != null), { kinds: ["poll"] });

/**
 * filter — true if the update has `countryCodes` set
 */
export const hasCountryCodes: Filter<unknown, {
    countryCodes: string[];
}> = /*#__PURE__*/ defineFilter("hasCountryCodes", (u: AnyUpdate): u is AnyUpdate => ((u as {
    countryCodes?: unknown;
}).countryCodes != null), { kinds: ["poll"] });

/**
 * filter — true if the update has `data` set
 */
export const hasData: Filter<unknown, {
    data: string;
}> = /*#__PURE__*/ defineFilter("hasData", (u: AnyUpdate): u is AnyUpdate => ((u as {
    data?: unknown;
}).data != null), { kinds: ["callback_query"] });

/**
 * filter — true if the update has `deleteChatPhoto` set
 */
export const hasDeleteChatPhoto: Filter<unknown, {
    deleteChatPhoto: true;
}> = /*#__PURE__*/ defineFilter("hasDeleteChatPhoto", (u: AnyUpdate): u is AnyUpdate => ((u as {
    deleteChatPhoto?: unknown;
}).deleteChatPhoto != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `description` set
 */
export const hasDescription: Filter<unknown, {
    description: string;
}> = /*#__PURE__*/ defineFilter("hasDescription", (u: AnyUpdate): u is AnyUpdate => ((u as {
    description?: unknown;
}).description != null), { kinds: ["poll"] });

/**
 * filter — true if the update has `descriptionEntities` set
 */
export const hasDescriptionEntities: Filter<unknown, {
    descriptionEntities: MessageEntity[];
}> = /*#__PURE__*/ defineFilter("hasDescriptionEntities", (u: AnyUpdate): u is AnyUpdate => ((u as {
    descriptionEntities?: unknown;
}).descriptionEntities != null), { kinds: ["poll"] });

/**
 * filter — true if the update has `dice` set
 */
export const hasDice: Filter<unknown, {
    dice: Dice;
}> = /*#__PURE__*/ defineFilter("hasDice", (u: AnyUpdate): u is AnyUpdate => ((u as {
    dice?: unknown;
}).dice != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `directMessagePriceChanged` set
 */
export const hasDirectMessagePriceChanged: Filter<unknown, {
    directMessagePriceChanged: TelegramDirectMessagePriceChanged;
}> = /*#__PURE__*/ defineFilter("hasDirectMessagePriceChanged", (u: AnyUpdate): u is AnyUpdate => ((u as {
    directMessagePriceChanged?: unknown;
}).directMessagePriceChanged != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `directMessagesTopic` set
 */
export const hasDirectMessagesTopic: Filter<unknown, {
    directMessagesTopic: TelegramDirectMessagesTopic;
}> = /*#__PURE__*/ defineFilter("hasDirectMessagesTopic", (u: AnyUpdate): u is AnyUpdate => ((u as {
    directMessagesTopic?: unknown;
}).directMessagesTopic != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `document` set
 */
export const hasDocument: Filter<unknown, {
    document: Document;
}> = /*#__PURE__*/ defineFilter("hasDocument", (u: AnyUpdate): u is AnyUpdate => ((u as {
    document?: unknown;
}).document != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `editDate` set
 */
export const hasEditDate: Filter<unknown, {
    editDate: number;
}> = /*#__PURE__*/ defineFilter("hasEditDate", (u: AnyUpdate): u is AnyUpdate => ((u as {
    editDate?: unknown;
}).editDate != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `effectId` set
 */
export const hasEffectId: Filter<unknown, {
    effectId: string;
}> = /*#__PURE__*/ defineFilter("hasEffectId", (u: AnyUpdate): u is AnyUpdate => ((u as {
    effectId?: unknown;
}).effectId != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `entities` set
 */
export const hasEntities: Filter<unknown, {
    entities: MessageEntity[];
}> = /*#__PURE__*/ defineFilter("hasEntities", (u: AnyUpdate): u is AnyUpdate => ((u as {
    entities?: unknown;
}).entities != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `ephemeralMessageId` set
 */
export const hasEphemeralMessageId: Filter<unknown, {
    ephemeralMessageId: number;
}> = /*#__PURE__*/ defineFilter("hasEphemeralMessageId", (u: AnyUpdate): u is AnyUpdate => ((u as {
    ephemeralMessageId?: unknown;
}).ephemeralMessageId != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `explanation` set
 */
export const hasExplanation: Filter<unknown, {
    explanation: string;
}> = /*#__PURE__*/ defineFilter("hasExplanation", (u: AnyUpdate): u is AnyUpdate => ((u as {
    explanation?: unknown;
}).explanation != null), { kinds: ["poll"] });

/**
 * filter — true if the update has `explanationEntities` set
 */
export const hasExplanationEntities: Filter<unknown, {
    explanationEntities: MessageEntity[];
}> = /*#__PURE__*/ defineFilter("hasExplanationEntities", (u: AnyUpdate): u is AnyUpdate => ((u as {
    explanationEntities?: unknown;
}).explanationEntities != null), { kinds: ["poll"] });

/**
 * filter — true if the update has `explanationMedia` set
 */
export const hasExplanationMedia: Filter<unknown, {
    explanationMedia: PollMedia;
}> = /*#__PURE__*/ defineFilter("hasExplanationMedia", (u: AnyUpdate): u is AnyUpdate => ((u as {
    explanationMedia?: unknown;
}).explanationMedia != null), { kinds: ["poll"] });

/**
 * filter — true if the update has `externalReply` set
 */
export const hasExternalReply: Filter<unknown, {
    externalReply: ExternalReplyInfo;
}> = /*#__PURE__*/ defineFilter("hasExternalReply", (u: AnyUpdate): u is AnyUpdate => ((u as {
    externalReply?: unknown;
}).externalReply != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `forumTopicClosed` set
 */
export const hasForumTopicClosed: Filter<unknown, {
    forumTopicClosed: TelegramForumTopicClosed;
}> = /*#__PURE__*/ defineFilter("hasForumTopicClosed", (u: AnyUpdate): u is AnyUpdate => ((u as {
    forumTopicClosed?: unknown;
}).forumTopicClosed != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `forumTopicCreated` set
 */
export const hasForumTopicCreated: Filter<unknown, {
    forumTopicCreated: ForumTopicCreated;
}> = /*#__PURE__*/ defineFilter("hasForumTopicCreated", (u: AnyUpdate): u is AnyUpdate => ((u as {
    forumTopicCreated?: unknown;
}).forumTopicCreated != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `forumTopicEdited` set
 */
export const hasForumTopicEdited: Filter<unknown, {
    forumTopicEdited: ForumTopicEdited;
}> = /*#__PURE__*/ defineFilter("hasForumTopicEdited", (u: AnyUpdate): u is AnyUpdate => ((u as {
    forumTopicEdited?: unknown;
}).forumTopicEdited != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `forumTopicReopened` set
 */
export const hasForumTopicReopened: Filter<unknown, {
    forumTopicReopened: TelegramForumTopicReopened;
}> = /*#__PURE__*/ defineFilter("hasForumTopicReopened", (u: AnyUpdate): u is AnyUpdate => ((u as {
    forumTopicReopened?: unknown;
}).forumTopicReopened != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `forwardOrigin` set
 */
export const hasForwardOrigin: Filter<unknown, {
    forwardOrigin: TelegramMessageOrigin;
}> = /*#__PURE__*/ defineFilter("hasForwardOrigin", (u: AnyUpdate): u is AnyUpdate => ((u as {
    forwardOrigin?: unknown;
}).forwardOrigin != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `from` set
 */
export const hasFrom: Filter<unknown, {
    from: User;
}> = /*#__PURE__*/ defineFilter("hasFrom", (u: AnyUpdate): u is AnyUpdate => ((u as {
    from?: unknown;
}).from != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `game` set
 */
export const hasGame: Filter<unknown, {
    game: Game;
}> = /*#__PURE__*/ defineFilter("hasGame", (u: AnyUpdate): u is AnyUpdate => ((u as {
    game?: unknown;
}).game != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `gameShortName` set
 */
export const hasGameShortName: Filter<unknown, {
    gameShortName: string;
}> = /*#__PURE__*/ defineFilter("hasGameShortName", (u: AnyUpdate): u is AnyUpdate => ((u as {
    gameShortName?: unknown;
}).gameShortName != null), { kinds: ["callback_query"] });

/**
 * filter — true if the update has `generalForumTopicHidden` set
 */
export const hasGeneralForumTopicHidden: Filter<unknown, {
    generalForumTopicHidden: TelegramGeneralForumTopicHidden;
}> = /*#__PURE__*/ defineFilter("hasGeneralForumTopicHidden", (u: AnyUpdate): u is AnyUpdate => ((u as {
    generalForumTopicHidden?: unknown;
}).generalForumTopicHidden != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `generalForumTopicUnhidden` set
 */
export const hasGeneralForumTopicUnhidden: Filter<unknown, {
    generalForumTopicUnhidden: TelegramGeneralForumTopicUnhidden;
}> = /*#__PURE__*/ defineFilter("hasGeneralForumTopicUnhidden", (u: AnyUpdate): u is AnyUpdate => ((u as {
    generalForumTopicUnhidden?: unknown;
}).generalForumTopicUnhidden != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `gift` set
 */
export const hasGift: Filter<unknown, {
    gift: TelegramGiftInfo;
}> = /*#__PURE__*/ defineFilter("hasGift", (u: AnyUpdate): u is AnyUpdate => ((u as {
    gift?: unknown;
}).gift != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `giftUpgradeSent` set
 */
export const hasGiftUpgradeSent: Filter<unknown, {
    giftUpgradeSent: TelegramGiftInfo;
}> = /*#__PURE__*/ defineFilter("hasGiftUpgradeSent", (u: AnyUpdate): u is AnyUpdate => ((u as {
    giftUpgradeSent?: unknown;
}).giftUpgradeSent != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `giveaway` set
 */
export const hasGiveaway: Filter<unknown, {
    giveaway: Giveaway;
}> = /*#__PURE__*/ defineFilter("hasGiveaway", (u: AnyUpdate): u is AnyUpdate => ((u as {
    giveaway?: unknown;
}).giveaway != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `giveawayCompleted` set
 */
export const hasGiveawayCompleted: Filter<unknown, {
    giveawayCompleted: GiveawayCompleted;
}> = /*#__PURE__*/ defineFilter("hasGiveawayCompleted", (u: AnyUpdate): u is AnyUpdate => ((u as {
    giveawayCompleted?: unknown;
}).giveawayCompleted != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `giveawayCreated` set
 */
export const hasGiveawayCreated: Filter<unknown, {
    giveawayCreated: TelegramGiveawayCreated;
}> = /*#__PURE__*/ defineFilter("hasGiveawayCreated", (u: AnyUpdate): u is AnyUpdate => ((u as {
    giveawayCreated?: unknown;
}).giveawayCreated != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `giveawayWinners` set
 */
export const hasGiveawayWinners: Filter<unknown, {
    giveawayWinners: GiveawayWinners;
}> = /*#__PURE__*/ defineFilter("hasGiveawayWinners", (u: AnyUpdate): u is AnyUpdate => ((u as {
    giveawayWinners?: unknown;
}).giveawayWinners != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `groupChatCreated` set
 */
export const hasGroupChatCreated: Filter<unknown, {
    groupChatCreated: true;
}> = /*#__PURE__*/ defineFilter("hasGroupChatCreated", (u: AnyUpdate): u is AnyUpdate => ((u as {
    groupChatCreated?: unknown;
}).groupChatCreated != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `guestBotCallerChat` set
 */
export const hasGuestBotCallerChat: Filter<unknown, {
    guestBotCallerChat: Chat;
}> = /*#__PURE__*/ defineFilter("hasGuestBotCallerChat", (u: AnyUpdate): u is AnyUpdate => ((u as {
    guestBotCallerChat?: unknown;
}).guestBotCallerChat != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `guestBotCallerUser` set
 */
export const hasGuestBotCallerUser: Filter<unknown, {
    guestBotCallerUser: User;
}> = /*#__PURE__*/ defineFilter("hasGuestBotCallerUser", (u: AnyUpdate): u is AnyUpdate => ((u as {
    guestBotCallerUser?: unknown;
}).guestBotCallerUser != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `guestQueryId` set
 */
export const hasGuestQueryId: Filter<unknown, {
    guestQueryId: string;
}> = /*#__PURE__*/ defineFilter("hasGuestQueryId", (u: AnyUpdate): u is AnyUpdate => ((u as {
    guestQueryId?: unknown;
}).guestQueryId != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `id` set
 */
export const hasId: Filter<unknown, {
    id: number;
}> = /*#__PURE__*/ defineFilter("hasId", (u: AnyUpdate): u is AnyUpdate => ((u as {
    id?: unknown;
}).id != null), { kinds: ["widget_query"] });

/**
 * filter — true if the update has `inlineMessageId` set
 */
export const hasInlineMessageId: Filter<unknown, {
    inlineMessageId: string;
}> = /*#__PURE__*/ defineFilter("hasInlineMessageId", (u: AnyUpdate): u is AnyUpdate => ((u as {
    inlineMessageId?: unknown;
}).inlineMessageId != null), { kinds: ["chosen_inline_result", "callback_query", "widget_query"] });

/**
 * filter — true if the update has `inviteLink` set
 */
export const hasInviteLink: Filter<unknown, {
    inviteLink: ChatInviteLink;
}> = /*#__PURE__*/ defineFilter("hasInviteLink", (u: AnyUpdate): u is AnyUpdate => ((u as {
    inviteLink?: unknown;
}).inviteLink != null), { kinds: ["my_chat_member", "chat_member", "chat_join_request"] });

/**
 * filter — true if the update has `invoice` set
 */
export const hasInvoice: Filter<unknown, {
    invoice: Invoice;
}> = /*#__PURE__*/ defineFilter("hasInvoice", (u: AnyUpdate): u is AnyUpdate => ((u as {
    invoice?: unknown;
}).invoice != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `leftChatMember` set
 */
export const hasLeftChatMember: Filter<unknown, {
    leftChatMember: User;
}> = /*#__PURE__*/ defineFilter("hasLeftChatMember", (u: AnyUpdate): u is AnyUpdate => ((u as {
    leftChatMember?: unknown;
}).leftChatMember != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `linkPreviewOptions` set
 */
export const hasLinkPreviewOptions: Filter<unknown, {
    linkPreviewOptions: LinkPreviewOptions;
}> = /*#__PURE__*/ defineFilter("hasLinkPreviewOptions", (u: AnyUpdate): u is AnyUpdate => ((u as {
    linkPreviewOptions?: unknown;
}).linkPreviewOptions != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `livePhoto` set
 */
export const hasLivePhoto: Filter<unknown, {
    livePhoto: LivePhoto;
}> = /*#__PURE__*/ defineFilter("hasLivePhoto", (u: AnyUpdate): u is AnyUpdate => ((u as {
    livePhoto?: unknown;
}).livePhoto != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `location` set
 */
export const hasLocation: Filter<unknown, {
    location: Location;
}> = /*#__PURE__*/ defineFilter("hasLocation", (u: AnyUpdate): u is AnyUpdate => ((u as {
    location?: unknown;
}).location != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "inline_query", "chosen_inline_result", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `managedBotCreated` set
 */
export const hasManagedBotCreated: Filter<unknown, {
    managedBotCreated: TelegramManagedBotCreated;
}> = /*#__PURE__*/ defineFilter("hasManagedBotCreated", (u: AnyUpdate): u is AnyUpdate => ((u as {
    managedBotCreated?: unknown;
}).managedBotCreated != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `media` set
 */
export const hasMedia: Filter<unknown, {
    media: PollMedia;
}> = /*#__PURE__*/ defineFilter("hasMedia", (u: AnyUpdate): u is AnyUpdate => ((u as {
    media?: unknown;
}).media != null), { kinds: ["poll"] });

/**
 * filter — true if the update has `mediaGroupId` set
 */
export const hasMediaGroupId: Filter<unknown, {
    mediaGroupId: string;
}> = /*#__PURE__*/ defineFilter("hasMediaGroupId", (u: AnyUpdate): u is AnyUpdate => ((u as {
    mediaGroupId?: unknown;
}).mediaGroupId != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `message` set
 */
export const hasMessage: Filter<unknown, {
    message: TelegramMaybeInaccessibleMessage;
}> = /*#__PURE__*/ defineFilter("hasMessage", (u: AnyUpdate): u is AnyUpdate => ((u as {
    message?: unknown;
}).message != null), { kinds: ["callback_query"] });

/**
 * filter — true if the update has `messageAutoDeleteTimerChanged` set
 */
export const hasMessageAutoDeleteTimerChanged: Filter<unknown, {
    messageAutoDeleteTimerChanged: TelegramMessageAutoDeleteTimerChanged;
}> = /*#__PURE__*/ defineFilter("hasMessageAutoDeleteTimerChanged", (u: AnyUpdate): u is AnyUpdate => ((u as {
    messageAutoDeleteTimerChanged?: unknown;
}).messageAutoDeleteTimerChanged != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `messageThreadId` set
 */
export const hasMessageThreadId: Filter<unknown, {
    messageThreadId: number;
}> = /*#__PURE__*/ defineFilter("hasMessageThreadId", (u: AnyUpdate): u is AnyUpdate => ((u as {
    messageThreadId?: unknown;
}).messageThreadId != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "stopped_message_generation", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `migrateFromChatId` set
 */
export const hasMigrateFromChatId: Filter<unknown, {
    migrateFromChatId: number;
}> = /*#__PURE__*/ defineFilter("hasMigrateFromChatId", (u: AnyUpdate): u is AnyUpdate => ((u as {
    migrateFromChatId?: unknown;
}).migrateFromChatId != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `migrateToChatId` set
 */
export const hasMigrateToChatId: Filter<unknown, {
    migrateToChatId: number;
}> = /*#__PURE__*/ defineFilter("hasMigrateToChatId", (u: AnyUpdate): u is AnyUpdate => ((u as {
    migrateToChatId?: unknown;
}).migrateToChatId != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `newChatMembers` set
 */
export const hasNewChatMembers: Filter<unknown, {
    newChatMembers: User[];
}> = /*#__PURE__*/ defineFilter("hasNewChatMembers", (u: AnyUpdate): u is AnyUpdate => ((u as {
    newChatMembers?: unknown;
}).newChatMembers != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `newChatPhoto` set
 */
export const hasNewChatPhoto: Filter<unknown, {
    newChatPhoto: PhotoSize[];
}> = /*#__PURE__*/ defineFilter("hasNewChatPhoto", (u: AnyUpdate): u is AnyUpdate => ((u as {
    newChatPhoto?: unknown;
}).newChatPhoto != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `newChatTitle` set
 */
export const hasNewChatTitle: Filter<unknown, {
    newChatTitle: string;
}> = /*#__PURE__*/ defineFilter("hasNewChatTitle", (u: AnyUpdate): u is AnyUpdate => ((u as {
    newChatTitle?: unknown;
}).newChatTitle != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `openPeriod` set
 */
export const hasOpenPeriod: Filter<unknown, {
    openPeriod: number;
}> = /*#__PURE__*/ defineFilter("hasOpenPeriod", (u: AnyUpdate): u is AnyUpdate => ((u as {
    openPeriod?: unknown;
}).openPeriod != null), { kinds: ["poll"] });

/**
 * filter — true if the update has `orderInfo` set
 */
export const hasOrderInfo: Filter<unknown, {
    orderInfo: OrderInfo;
}> = /*#__PURE__*/ defineFilter("hasOrderInfo", (u: AnyUpdate): u is AnyUpdate => ((u as {
    orderInfo?: unknown;
}).orderInfo != null), { kinds: ["pre_checkout_query"] });

/**
 * filter — true if the update has `paidMedia` set
 */
export const hasPaidMedia: Filter<unknown, {
    paidMedia: TelegramPaidMediaInfo;
}> = /*#__PURE__*/ defineFilter("hasPaidMedia", (u: AnyUpdate): u is AnyUpdate => ((u as {
    paidMedia?: unknown;
}).paidMedia != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `paidMessagePriceChanged` set
 */
export const hasPaidMessagePriceChanged: Filter<unknown, {
    paidMessagePriceChanged: TelegramPaidMessagePriceChanged;
}> = /*#__PURE__*/ defineFilter("hasPaidMessagePriceChanged", (u: AnyUpdate): u is AnyUpdate => ((u as {
    paidMessagePriceChanged?: unknown;
}).paidMessagePriceChanged != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `paidMessagesWaived` set
 */
export const hasPaidMessagesWaived: Filter<unknown, {
    paidMessagesWaived: PaidMessagesWaived;
}> = /*#__PURE__*/ defineFilter("hasPaidMessagesWaived", (u: AnyUpdate): u is AnyUpdate => ((u as {
    paidMessagesWaived?: unknown;
}).paidMessagesWaived != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `paidStarCount` set
 */
export const hasPaidStarCount: Filter<unknown, {
    paidStarCount: number;
}> = /*#__PURE__*/ defineFilter("hasPaidStarCount", (u: AnyUpdate): u is AnyUpdate => ((u as {
    paidStarCount?: unknown;
}).paidStarCount != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `passportData` set
 */
export const hasPassportData: Filter<unknown, {
    passportData: PassportData;
}> = /*#__PURE__*/ defineFilter("hasPassportData", (u: AnyUpdate): u is AnyUpdate => ((u as {
    passportData?: unknown;
}).passportData != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `photo` set
 */
export const hasPhoto: Filter<unknown, {
    photo: PhotoSize[];
}> = /*#__PURE__*/ defineFilter("hasPhoto", (u: AnyUpdate): u is AnyUpdate => ((u as {
    photo?: unknown;
}).photo != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `pinnedMessage` set
 */
export const hasPinnedMessage: Filter<unknown, {
    pinnedMessage: TelegramMaybeInaccessibleMessage;
}> = /*#__PURE__*/ defineFilter("hasPinnedMessage", (u: AnyUpdate): u is AnyUpdate => ((u as {
    pinnedMessage?: unknown;
}).pinnedMessage != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `poll` set
 */
export const hasPoll: Filter<unknown, {
    poll: Poll;
}> = /*#__PURE__*/ defineFilter("hasPoll", (u: AnyUpdate): u is AnyUpdate => ((u as {
    poll?: unknown;
}).poll != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `pollOptionAdded` set
 */
export const hasPollOptionAdded: Filter<unknown, {
    pollOptionAdded: TelegramPollOptionAdded;
}> = /*#__PURE__*/ defineFilter("hasPollOptionAdded", (u: AnyUpdate): u is AnyUpdate => ((u as {
    pollOptionAdded?: unknown;
}).pollOptionAdded != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `pollOptionDeleted` set
 */
export const hasPollOptionDeleted: Filter<unknown, {
    pollOptionDeleted: TelegramPollOptionDeleted;
}> = /*#__PURE__*/ defineFilter("hasPollOptionDeleted", (u: AnyUpdate): u is AnyUpdate => ((u as {
    pollOptionDeleted?: unknown;
}).pollOptionDeleted != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `proximityAlertTriggered` set
 */
export const hasProximityAlertTriggered: Filter<unknown, {
    proximityAlertTriggered: ProximityAlertTriggered;
}> = /*#__PURE__*/ defineFilter("hasProximityAlertTriggered", (u: AnyUpdate): u is AnyUpdate => ((u as {
    proximityAlertTriggered?: unknown;
}).proximityAlertTriggered != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `queryId` set
 */
export const hasQueryId: Filter<unknown, {
    queryId: string;
}> = /*#__PURE__*/ defineFilter("hasQueryId", (u: AnyUpdate): u is AnyUpdate => ((u as {
    queryId?: unknown;
}).queryId != null), { kinds: ["chat_join_request"] });

/**
 * filter — true if the update has `questionEntities` set
 */
export const hasQuestionEntities: Filter<unknown, {
    questionEntities: MessageEntity[];
}> = /*#__PURE__*/ defineFilter("hasQuestionEntities", (u: AnyUpdate): u is AnyUpdate => ((u as {
    questionEntities?: unknown;
}).questionEntities != null), { kinds: ["poll"] });

/**
 * filter — true if the update has `quote` set
 */
export const hasQuote: Filter<unknown, {
    quote: TextQuote;
}> = /*#__PURE__*/ defineFilter("hasQuote", (u: AnyUpdate): u is AnyUpdate => ((u as {
    quote?: unknown;
}).quote != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `receiverUser` set
 */
export const hasReceiverUser: Filter<unknown, {
    receiverUser: User;
}> = /*#__PURE__*/ defineFilter("hasReceiverUser", (u: AnyUpdate): u is AnyUpdate => ((u as {
    receiverUser?: unknown;
}).receiverUser != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `refundedPayment` set
 */
export const hasRefundedPayment: Filter<unknown, {
    refundedPayment: TelegramRefundedPayment;
}> = /*#__PURE__*/ defineFilter("hasRefundedPayment", (u: AnyUpdate): u is AnyUpdate => ((u as {
    refundedPayment?: unknown;
}).refundedPayment != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `replyMarkup` set
 */
export const hasReplyMarkup: Filter<unknown, {
    replyMarkup: InlineKeyboardMarkup;
}> = /*#__PURE__*/ defineFilter("hasReplyMarkup", (u: AnyUpdate): u is AnyUpdate => ((u as {
    replyMarkup?: unknown;
}).replyMarkup != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `replyToChecklistTaskId` set
 */
export const hasReplyToChecklistTaskId: Filter<unknown, {
    replyToChecklistTaskId: number;
}> = /*#__PURE__*/ defineFilter("hasReplyToChecklistTaskId", (u: AnyUpdate): u is AnyUpdate => ((u as {
    replyToChecklistTaskId?: unknown;
}).replyToChecklistTaskId != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `replyToPollOptionId` set
 */
export const hasReplyToPollOptionId: Filter<unknown, {
    replyToPollOptionId: string;
}> = /*#__PURE__*/ defineFilter("hasReplyToPollOptionId", (u: AnyUpdate): u is AnyUpdate => ((u as {
    replyToPollOptionId?: unknown;
}).replyToPollOptionId != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `replyToStory` set
 */
export const hasReplyToStory: Filter<unknown, {
    replyToStory: Story;
}> = /*#__PURE__*/ defineFilter("hasReplyToStory", (u: AnyUpdate): u is AnyUpdate => ((u as {
    replyToStory?: unknown;
}).replyToStory != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `richMessage` set
 */
export const hasRichMessage: Filter<unknown, {
    richMessage: TelegramRichMessage;
}> = /*#__PURE__*/ defineFilter("hasRichMessage", (u: AnyUpdate): u is AnyUpdate => ((u as {
    richMessage?: unknown;
}).richMessage != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `rights` set
 */
export const hasRights: Filter<unknown, {
    rights: TelegramBusinessBotRights;
}> = /*#__PURE__*/ defineFilter("hasRights", (u: AnyUpdate): u is AnyUpdate => ((u as {
    rights?: unknown;
}).rights != null), { kinds: ["business_connection"] });

/**
 * filter — true if the update has `senderBoostCount` set
 */
export const hasSenderBoostCount: Filter<unknown, {
    senderBoostCount: number;
}> = /*#__PURE__*/ defineFilter("hasSenderBoostCount", (u: AnyUpdate): u is AnyUpdate => ((u as {
    senderBoostCount?: unknown;
}).senderBoostCount != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `senderBusinessBot` set
 */
export const hasSenderBusinessBot: Filter<unknown, {
    senderBusinessBot: User;
}> = /*#__PURE__*/ defineFilter("hasSenderBusinessBot", (u: AnyUpdate): u is AnyUpdate => ((u as {
    senderBusinessBot?: unknown;
}).senderBusinessBot != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `senderChat` set
 */
export const hasSenderChat: Filter<unknown, {
    senderChat: Chat;
}> = /*#__PURE__*/ defineFilter("hasSenderChat", (u: AnyUpdate): u is AnyUpdate => ((u as {
    senderChat?: unknown;
}).senderChat != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `senderTag` set
 */
export const hasSenderTag: Filter<unknown, {
    senderTag: string;
}> = /*#__PURE__*/ defineFilter("hasSenderTag", (u: AnyUpdate): u is AnyUpdate => ((u as {
    senderTag?: unknown;
}).senderTag != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `shippingOptionId` set
 */
export const hasShippingOptionId: Filter<unknown, {
    shippingOptionId: string;
}> = /*#__PURE__*/ defineFilter("hasShippingOptionId", (u: AnyUpdate): u is AnyUpdate => ((u as {
    shippingOptionId?: unknown;
}).shippingOptionId != null), { kinds: ["pre_checkout_query"] });

/**
 * filter — true if the update has `showCaptionAboveMedia` set
 */
export const hasShowCaptionAboveMedia: Filter<unknown, {
    showCaptionAboveMedia: true;
}> = /*#__PURE__*/ defineFilter("hasShowCaptionAboveMedia", (u: AnyUpdate): u is AnyUpdate => ((u as {
    showCaptionAboveMedia?: unknown;
}).showCaptionAboveMedia != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `sticker` set
 */
export const hasSticker: Filter<unknown, {
    sticker: Sticker;
}> = /*#__PURE__*/ defineFilter("hasSticker", (u: AnyUpdate): u is AnyUpdate => ((u as {
    sticker?: unknown;
}).sticker != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `story` set
 */
export const hasStory: Filter<unknown, {
    story: Story;
}> = /*#__PURE__*/ defineFilter("hasStory", (u: AnyUpdate): u is AnyUpdate => ((u as {
    story?: unknown;
}).story != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `successfulPayment` set
 */
export const hasSuccessfulPayment: Filter<unknown, {
    successfulPayment: SuccessfulPayment;
}> = /*#__PURE__*/ defineFilter("hasSuccessfulPayment", (u: AnyUpdate): u is AnyUpdate => ((u as {
    successfulPayment?: unknown;
}).successfulPayment != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `suggestedPostApprovalFailed` set
 */
export const hasSuggestedPostApprovalFailed: Filter<unknown, {
    suggestedPostApprovalFailed: TelegramSuggestedPostApprovalFailed;
}> = /*#__PURE__*/ defineFilter("hasSuggestedPostApprovalFailed", (u: AnyUpdate): u is AnyUpdate => ((u as {
    suggestedPostApprovalFailed?: unknown;
}).suggestedPostApprovalFailed != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `suggestedPostApproved` set
 */
export const hasSuggestedPostApproved: Filter<unknown, {
    suggestedPostApproved: TelegramSuggestedPostApproved;
}> = /*#__PURE__*/ defineFilter("hasSuggestedPostApproved", (u: AnyUpdate): u is AnyUpdate => ((u as {
    suggestedPostApproved?: unknown;
}).suggestedPostApproved != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `suggestedPostDeclined` set
 */
export const hasSuggestedPostDeclined: Filter<unknown, {
    suggestedPostDeclined: TelegramSuggestedPostDeclined;
}> = /*#__PURE__*/ defineFilter("hasSuggestedPostDeclined", (u: AnyUpdate): u is AnyUpdate => ((u as {
    suggestedPostDeclined?: unknown;
}).suggestedPostDeclined != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `suggestedPostInfo` set
 */
export const hasSuggestedPostInfo: Filter<unknown, {
    suggestedPostInfo: TelegramSuggestedPostInfo;
}> = /*#__PURE__*/ defineFilter("hasSuggestedPostInfo", (u: AnyUpdate): u is AnyUpdate => ((u as {
    suggestedPostInfo?: unknown;
}).suggestedPostInfo != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `suggestedPostPaid` set
 */
export const hasSuggestedPostPaid: Filter<unknown, {
    suggestedPostPaid: TelegramSuggestedPostPaid;
}> = /*#__PURE__*/ defineFilter("hasSuggestedPostPaid", (u: AnyUpdate): u is AnyUpdate => ((u as {
    suggestedPostPaid?: unknown;
}).suggestedPostPaid != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `suggestedPostRefunded` set
 */
export const hasSuggestedPostRefunded: Filter<unknown, {
    suggestedPostRefunded: TelegramSuggestedPostRefunded;
}> = /*#__PURE__*/ defineFilter("hasSuggestedPostRefunded", (u: AnyUpdate): u is AnyUpdate => ((u as {
    suggestedPostRefunded?: unknown;
}).suggestedPostRefunded != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `supergroupChatCreated` set
 */
export const hasSupergroupChatCreated: Filter<unknown, {
    supergroupChatCreated: true;
}> = /*#__PURE__*/ defineFilter("hasSupergroupChatCreated", (u: AnyUpdate): u is AnyUpdate => ((u as {
    supergroupChatCreated?: unknown;
}).supergroupChatCreated != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `text` set
 */
export const hasText: Filter<unknown, {
    text: string;
}> = /*#__PURE__*/ defineFilter("hasText", (u: AnyUpdate): u is AnyUpdate => ((u as {
    text?: unknown;
}).text != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `tonWalletTransfer` set
 */
export const hasTonWalletTransfer: Filter<unknown, {
    tonWalletTransfer: TonWalletTransfer;
}> = /*#__PURE__*/ defineFilter("hasTonWalletTransfer", (u: AnyUpdate): u is AnyUpdate => ((u as {
    tonWalletTransfer?: unknown;
}).tonWalletTransfer != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `uniqueGift` set
 */
export const hasUniqueGift: Filter<unknown, {
    uniqueGift: TelegramUniqueGiftInfo;
}> = /*#__PURE__*/ defineFilter("hasUniqueGift", (u: AnyUpdate): u is AnyUpdate => ((u as {
    uniqueGift?: unknown;
}).uniqueGift != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `user` set
 */
export const hasUser: Filter<unknown, {
    user: User;
}> = /*#__PURE__*/ defineFilter("hasUser", (u: AnyUpdate): u is AnyUpdate => ((u as {
    user?: unknown;
}).user != null), { kinds: ["message_reaction", "poll_answer"] });

/**
 * filter — true if the update has `usersShared` set
 */
export const hasUsersShared: Filter<unknown, {
    usersShared: UsersShared;
}> = /*#__PURE__*/ defineFilter("hasUsersShared", (u: AnyUpdate): u is AnyUpdate => ((u as {
    usersShared?: unknown;
}).usersShared != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `venue` set
 */
export const hasVenue: Filter<unknown, {
    venue: Venue;
}> = /*#__PURE__*/ defineFilter("hasVenue", (u: AnyUpdate): u is AnyUpdate => ((u as {
    venue?: unknown;
}).venue != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `viaBot` set
 */
export const hasViaBot: Filter<unknown, {
    viaBot: User;
}> = /*#__PURE__*/ defineFilter("hasViaBot", (u: AnyUpdate): u is AnyUpdate => ((u as {
    viaBot?: unknown;
}).viaBot != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `viaChatFolderInviteLink` set
 */
export const hasViaChatFolderInviteLink: Filter<unknown, {
    viaChatFolderInviteLink: boolean;
}> = /*#__PURE__*/ defineFilter("hasViaChatFolderInviteLink", (u: AnyUpdate): u is AnyUpdate => ((u as {
    viaChatFolderInviteLink?: unknown;
}).viaChatFolderInviteLink != null), { kinds: ["my_chat_member", "chat_member"] });

/**
 * filter — true if the update has `viaJoinRequest` set
 */
export const hasViaJoinRequest: Filter<unknown, {
    viaJoinRequest: boolean;
}> = /*#__PURE__*/ defineFilter("hasViaJoinRequest", (u: AnyUpdate): u is AnyUpdate => ((u as {
    viaJoinRequest?: unknown;
}).viaJoinRequest != null), { kinds: ["my_chat_member", "chat_member"] });

/**
 * filter — true if the update has `video` set
 */
export const hasVideo: Filter<unknown, {
    video: Video;
}> = /*#__PURE__*/ defineFilter("hasVideo", (u: AnyUpdate): u is AnyUpdate => ((u as {
    video?: unknown;
}).video != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `videoChatEnded` set
 */
export const hasVideoChatEnded: Filter<unknown, {
    videoChatEnded: VideoChatEnded;
}> = /*#__PURE__*/ defineFilter("hasVideoChatEnded", (u: AnyUpdate): u is AnyUpdate => ((u as {
    videoChatEnded?: unknown;
}).videoChatEnded != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `videoChatParticipantsInvited` set
 */
export const hasVideoChatParticipantsInvited: Filter<unknown, {
    videoChatParticipantsInvited: VideoChatParticipantsInvited;
}> = /*#__PURE__*/ defineFilter("hasVideoChatParticipantsInvited", (u: AnyUpdate): u is AnyUpdate => ((u as {
    videoChatParticipantsInvited?: unknown;
}).videoChatParticipantsInvited != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `videoChatScheduled` set
 */
export const hasVideoChatScheduled: Filter<unknown, {
    videoChatScheduled: VideoChatScheduled;
}> = /*#__PURE__*/ defineFilter("hasVideoChatScheduled", (u: AnyUpdate): u is AnyUpdate => ((u as {
    videoChatScheduled?: unknown;
}).videoChatScheduled != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `videoChatStarted` set
 */
export const hasVideoChatStarted: Filter<unknown, {
    videoChatStarted: TelegramVideoChatStarted;
}> = /*#__PURE__*/ defineFilter("hasVideoChatStarted", (u: AnyUpdate): u is AnyUpdate => ((u as {
    videoChatStarted?: unknown;
}).videoChatStarted != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `videoNote` set
 */
export const hasVideoNote: Filter<unknown, {
    videoNote: VideoNote;
}> = /*#__PURE__*/ defineFilter("hasVideoNote", (u: AnyUpdate): u is AnyUpdate => ((u as {
    videoNote?: unknown;
}).videoNote != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `voice` set
 */
export const hasVoice: Filter<unknown, {
    voice: Voice;
}> = /*#__PURE__*/ defineFilter("hasVoice", (u: AnyUpdate): u is AnyUpdate => ((u as {
    voice?: unknown;
}).voice != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `voterChat` set
 */
export const hasVoterChat: Filter<unknown, {
    voterChat: Chat;
}> = /*#__PURE__*/ defineFilter("hasVoterChat", (u: AnyUpdate): u is AnyUpdate => ((u as {
    voterChat?: unknown;
}).voterChat != null), { kinds: ["poll_answer"] });

/**
 * filter — true if the update has `webAppData` set
 */
export const hasWebAppData: Filter<unknown, {
    webAppData: WebAppData;
}> = /*#__PURE__*/ defineFilter("hasWebAppData", (u: AnyUpdate): u is AnyUpdate => ((u as {
    webAppData?: unknown;
}).webAppData != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `widget` set
 */
export const hasWidget: Filter<unknown, {
    widget: Widget;
}> = /*#__PURE__*/ defineFilter("hasWidget", (u: AnyUpdate): u is AnyUpdate => ((u as {
    widget?: unknown;
}).widget != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

/**
 * filter — true if the update has `widgetId` set
 */
export const hasWidgetId: Filter<unknown, {
    widgetId: string;
}> = /*#__PURE__*/ defineFilter("hasWidgetId", (u: AnyUpdate): u is AnyUpdate => ((u as {
    widgetId?: unknown;
}).widgetId != null), { kinds: ["widget_query"] });

/**
 * filter — true if the update has `writeAccessAllowed` set
 */
export const hasWriteAccessAllowed: Filter<unknown, {
    writeAccessAllowed: WriteAccessAllowed;
}> = /*#__PURE__*/ defineFilter("hasWriteAccessAllowed", (u: AnyUpdate): u is AnyUpdate => ((u as {
    writeAccessAllowed?: unknown;
}).writeAccessAllowed != null), { kinds: ["message", "edited_message", "channel_post", "edited_channel_post", "business_message", "edited_business_message", "guest_message", "new_chat_members", "left_chat_member", "new_chat_title", "new_chat_photo", "delete_chat_photo", "group_chat_created", "pinned_message", "invoice", "successful_payment", "users_shared", "chat_shared", "web_app_data", "video_chat_scheduled", "video_chat_started", "video_chat_ended", "video_chat_participants_invited", "forum_topic_created", "forum_topic_edited", "forum_topic_closed", "forum_topic_reopened", "general_forum_topic_hidden", "general_forum_topic_unhidden", "giveaway_created", "giveaway_completed", "giveaway_winners", "boost_added", "message_auto_delete_timer_changed", "migrate_to_chat_id", "migrate_from_chat_id", "passport_data", "proximity_alert_triggered", "write_access_allowed", "community_chat_added", "community_chat_removed", "paid_messages_waived", "ton_wallet_transfer"] });

function _kind<K extends UpdateKind>(k: K): Filter<UpdateKindMap[K]> {
    return defineFilter(`kind.${k}`, (u: AnyUpdate): u is UpdateKindMap[K] => (u as {
        kind?: string;
    }).kind === k, { kinds: [k] });
}

/**
 * filter — match a specific update kind. callable form `kind(k)` plus shorthand properties (`kind.message`, `kind.editedMessage`)
 */
export const kind = /*#__PURE__*/ Object.assign(_kind, {
    message: /*#__PURE__*/ _kind("message"),
    editedMessage: /*#__PURE__*/ _kind("edited_message"),
    channelPost: /*#__PURE__*/ _kind("channel_post"),
    editedChannelPost: /*#__PURE__*/ _kind("edited_channel_post"),
    businessConnection: /*#__PURE__*/ _kind("business_connection"),
    businessMessage: /*#__PURE__*/ _kind("business_message"),
    editedBusinessMessage: /*#__PURE__*/ _kind("edited_business_message"),
    deletedBusinessMessages: /*#__PURE__*/ _kind("deleted_business_messages"),
    guestMessage: /*#__PURE__*/ _kind("guest_message"),
    messageReaction: /*#__PURE__*/ _kind("message_reaction"),
    messageReactionCount: /*#__PURE__*/ _kind("message_reaction_count"),
    inlineQuery: /*#__PURE__*/ _kind("inline_query"),
    chosenInlineResult: /*#__PURE__*/ _kind("chosen_inline_result"),
    callbackQuery: /*#__PURE__*/ _kind("callback_query"),
    widgetQuery: /*#__PURE__*/ _kind("widget_query"),
    sharedWidgetQuery: /*#__PURE__*/ _kind("shared_widget_query"),
    shippingQuery: /*#__PURE__*/ _kind("shipping_query"),
    preCheckoutQuery: /*#__PURE__*/ _kind("pre_checkout_query"),
    purchasedPaidMedia: /*#__PURE__*/ _kind("purchased_paid_media"),
    poll: /*#__PURE__*/ _kind("poll"),
    pollAnswer: /*#__PURE__*/ _kind("poll_answer"),
    myChatMember: /*#__PURE__*/ _kind("my_chat_member"),
    chatMember: /*#__PURE__*/ _kind("chat_member"),
    chatJoinRequest: /*#__PURE__*/ _kind("chat_join_request"),
    chatBoost: /*#__PURE__*/ _kind("chat_boost"),
    removedChatBoost: /*#__PURE__*/ _kind("removed_chat_boost"),
    managedBot: /*#__PURE__*/ _kind("managed_bot"),
    subscription: /*#__PURE__*/ _kind("subscription"),
    stoppedMessageGeneration: /*#__PURE__*/ _kind("stopped_message_generation"),
    newChatMembers: /*#__PURE__*/ _kind("new_chat_members"),
    leftChatMember: /*#__PURE__*/ _kind("left_chat_member"),
    newChatTitle: /*#__PURE__*/ _kind("new_chat_title"),
    newChatPhoto: /*#__PURE__*/ _kind("new_chat_photo"),
    deleteChatPhoto: /*#__PURE__*/ _kind("delete_chat_photo"),
    groupChatCreated: /*#__PURE__*/ _kind("group_chat_created"),
    pinnedMessage: /*#__PURE__*/ _kind("pinned_message"),
    invoice: /*#__PURE__*/ _kind("invoice"),
    successfulPayment: /*#__PURE__*/ _kind("successful_payment"),
    usersShared: /*#__PURE__*/ _kind("users_shared"),
    chatShared: /*#__PURE__*/ _kind("chat_shared"),
    webAppData: /*#__PURE__*/ _kind("web_app_data"),
    videoChatScheduled: /*#__PURE__*/ _kind("video_chat_scheduled"),
    videoChatStarted: /*#__PURE__*/ _kind("video_chat_started"),
    videoChatEnded: /*#__PURE__*/ _kind("video_chat_ended"),
    videoChatParticipantsInvited: /*#__PURE__*/ _kind("video_chat_participants_invited"),
    forumTopicCreated: /*#__PURE__*/ _kind("forum_topic_created"),
    forumTopicEdited: /*#__PURE__*/ _kind("forum_topic_edited"),
    forumTopicClosed: /*#__PURE__*/ _kind("forum_topic_closed"),
    forumTopicReopened: /*#__PURE__*/ _kind("forum_topic_reopened"),
    generalForumTopicHidden: /*#__PURE__*/ _kind("general_forum_topic_hidden"),
    generalForumTopicUnhidden: /*#__PURE__*/ _kind("general_forum_topic_unhidden"),
    giveawayCreated: /*#__PURE__*/ _kind("giveaway_created"),
    giveawayCompleted: /*#__PURE__*/ _kind("giveaway_completed"),
    giveawayWinners: /*#__PURE__*/ _kind("giveaway_winners"),
    boostAdded: /*#__PURE__*/ _kind("boost_added"),
    messageAutoDeleteTimerChanged: /*#__PURE__*/ _kind("message_auto_delete_timer_changed"),
    migrateToChatId: /*#__PURE__*/ _kind("migrate_to_chat_id"),
    migrateFromChatId: /*#__PURE__*/ _kind("migrate_from_chat_id"),
    passportData: /*#__PURE__*/ _kind("passport_data"),
    proximityAlertTriggered: /*#__PURE__*/ _kind("proximity_alert_triggered"),
    writeAccessAllowed: /*#__PURE__*/ _kind("write_access_allowed"),
    communityChatAdded: /*#__PURE__*/ _kind("community_chat_added"),
    communityChatRemoved: /*#__PURE__*/ _kind("community_chat_removed"),
    paidMessagesWaived: /*#__PURE__*/ _kind("paid_messages_waived"),
    tonWalletTransfer: /*#__PURE__*/ _kind("ton_wallet_transfer")
});

export type ServiceActionKind = "new_chat_members" | "left_chat_member" | "new_chat_title" | "new_chat_photo" | "delete_chat_photo" | "group_chat_created" | "pinned_message" | "invoice" | "successful_payment" | "users_shared" | "chat_shared" | "web_app_data" | "video_chat_scheduled" | "video_chat_started" | "video_chat_ended" | "video_chat_participants_invited" | "forum_topic_created" | "forum_topic_edited" | "forum_topic_closed" | "forum_topic_reopened" | "general_forum_topic_hidden" | "general_forum_topic_unhidden" | "giveaway_created" | "giveaway_completed" | "giveaway_winners" | "boost_added" | "message_auto_delete_timer_changed" | "migrate_to_chat_id" | "migrate_from_chat_id" | "passport_data" | "proximity_alert_triggered" | "write_access_allowed" | "community_chat_added" | "community_chat_removed" | "paid_messages_waived" | "ton_wallet_transfer";

function _action<K extends ServiceActionKind>(k: K): Filter<UpdateKindMap[K]> {
    return _kind(k);
}

/**
 * filter — match a service-event update kind. shorthand for `kind` restricted to derived (Message-payload) events
 */
export const action = /*#__PURE__*/ Object.assign(_action, {
    newChatMembers: /*#__PURE__*/ _action("new_chat_members"),
    leftChatMember: /*#__PURE__*/ _action("left_chat_member"),
    newChatTitle: /*#__PURE__*/ _action("new_chat_title"),
    newChatPhoto: /*#__PURE__*/ _action("new_chat_photo"),
    deleteChatPhoto: /*#__PURE__*/ _action("delete_chat_photo"),
    groupChatCreated: /*#__PURE__*/ _action("group_chat_created"),
    pinnedMessage: /*#__PURE__*/ _action("pinned_message"),
    invoice: /*#__PURE__*/ _action("invoice"),
    successfulPayment: /*#__PURE__*/ _action("successful_payment"),
    usersShared: /*#__PURE__*/ _action("users_shared"),
    chatShared: /*#__PURE__*/ _action("chat_shared"),
    webAppData: /*#__PURE__*/ _action("web_app_data"),
    videoChatScheduled: /*#__PURE__*/ _action("video_chat_scheduled"),
    videoChatStarted: /*#__PURE__*/ _action("video_chat_started"),
    videoChatEnded: /*#__PURE__*/ _action("video_chat_ended"),
    videoChatParticipantsInvited: /*#__PURE__*/ _action("video_chat_participants_invited"),
    forumTopicCreated: /*#__PURE__*/ _action("forum_topic_created"),
    forumTopicEdited: /*#__PURE__*/ _action("forum_topic_edited"),
    forumTopicClosed: /*#__PURE__*/ _action("forum_topic_closed"),
    forumTopicReopened: /*#__PURE__*/ _action("forum_topic_reopened"),
    generalForumTopicHidden: /*#__PURE__*/ _action("general_forum_topic_hidden"),
    generalForumTopicUnhidden: /*#__PURE__*/ _action("general_forum_topic_unhidden"),
    giveawayCreated: /*#__PURE__*/ _action("giveaway_created"),
    giveawayCompleted: /*#__PURE__*/ _action("giveaway_completed"),
    giveawayWinners: /*#__PURE__*/ _action("giveaway_winners"),
    boostAdded: /*#__PURE__*/ _action("boost_added"),
    messageAutoDeleteTimerChanged: /*#__PURE__*/ _action("message_auto_delete_timer_changed"),
    migrateToChatId: /*#__PURE__*/ _action("migrate_to_chat_id"),
    migrateFromChatId: /*#__PURE__*/ _action("migrate_from_chat_id"),
    passportData: /*#__PURE__*/ _action("passport_data"),
    proximityAlertTriggered: /*#__PURE__*/ _action("proximity_alert_triggered"),
    writeAccessAllowed: /*#__PURE__*/ _action("write_access_allowed"),
    communityChatAdded: /*#__PURE__*/ _action("community_chat_added"),
    communityChatRemoved: /*#__PURE__*/ _action("community_chat_removed"),
    paidMessagesWaived: /*#__PURE__*/ _action("paid_messages_waived"),
    tonWalletTransfer: /*#__PURE__*/ _action("ton_wallet_transfer")
});