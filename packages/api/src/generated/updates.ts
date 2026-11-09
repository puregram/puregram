/// AUTO-GENERATED FILE — do not edit by hand
/// Bot API 10.4
/// source: https://core.telegram.org/bots/api
/// generated at: 2026-11-09T13:32:34.299Z
/// see scripts/emit.ts in @puregram/api

import type { Readable } from "node:stream";
import type { TelegramBotSubscriptionUpdated, TelegramBusinessBotRights, TelegramBusinessConnection, TelegramBusinessMessagesDeleted, TelegramCallbackQuery, TelegramChatBackground, TelegramChatBoostAdded, TelegramChatBoostRemoved, TelegramChatBoostSource, TelegramChatBoostUpdated, TelegramChatJoinRequest, TelegramChatMemberUpdated, TelegramChatOwnerChanged, TelegramChatOwnerLeft, TelegramChatPermissions, TelegramChecklist, TelegramChecklistTasksAdded, TelegramChecklistTasksDone, TelegramChosenInlineResult, TelegramCommunityChatAdded, TelegramCommunityChatJoined, TelegramCommunityChatRemoved, TelegramDirectMessagePriceChanged, TelegramDirectMessagesTopic, TelegramEphemeralMessageParameters, TelegramForceReply, TelegramForumTopicClosed, TelegramForumTopicReopened, TelegramGeneralForumTopicHidden, TelegramGeneralForumTopicUnhidden, TelegramGiftInfo, TelegramGiveawayCreated, TelegramInlineKeyboardMarkup, TelegramInlineQuery, TelegramInlineQueryResult, TelegramInlineQueryResultsButton, TelegramInputChecklist, TelegramInputFile, TelegramInputMedia, TelegramInputMediaAudio, TelegramInputMediaDocument, TelegramInputMediaLivePhoto, TelegramInputMediaPhoto, TelegramInputMediaVideo, TelegramInputPaidMedia, TelegramInputPollMedia, TelegramInputPollOption, TelegramInputRichMessage, TelegramLabeledPrice, TelegramLinkPreviewOptions, TelegramManagedBotCreated, TelegramManagedBotUpdated, TelegramMaybeInaccessibleMessage, TelegramMenuButton, TelegramMessage, TelegramMessageAutoDeleteTimerChanged, TelegramMessageEntity, TelegramMessageGenerationStopped, TelegramMessageOrigin, TelegramMessageReactionCountUpdated, TelegramMessageReactionUpdated, TelegramPaidMediaInfo, TelegramPaidMediaPurchased, TelegramPaidMessagePriceChanged, TelegramPoll, TelegramPollAnswer, TelegramPollOptionAdded, TelegramPollOptionDeleted, TelegramPreCheckoutQuery, TelegramReactionType, TelegramRefundedPayment, TelegramReplyKeyboardMarkup, TelegramReplyKeyboardRemove, TelegramReplyParameters, TelegramRichMessage, TelegramSharedWidgetQuery, TelegramShippingOption, TelegramShippingQuery, TelegramSuggestedPostApprovalFailed, TelegramSuggestedPostApproved, TelegramSuggestedPostDeclined, TelegramSuggestedPostInfo, TelegramSuggestedPostPaid, TelegramSuggestedPostParameters, TelegramSuggestedPostRefunded, TelegramUniqueGiftInfo, TelegramVideoChatStarted, TelegramWidgetQuery, TelegramWidgetQueryType } from "./types";
import type { DeleteMessageParams, EditMessageCaptionParams, EditMessageMediaParams, EditMessageReplyMarkupParams, EditMessageTextParams, EditMessageWidgetDataParams, SetMessageReactionParams } from "./methods";
import type { ActionControllerLike, ActionControllerParams, TelegramLike } from "../telegram-like";
import type { Has } from "../util-types";
import type { Formattable } from "../formattable";
import type { RichLike } from "../rich-like";
import { Animation, Audio, Chat, ChatBoost, ChatInviteLink, ChatMember, ChatShared, Contact, Dice, Document, ExternalReplyInfo, ForumTopicCreated, ForumTopicEdited, Game, Giveaway, GiveawayCompleted, GiveawayWinners, InlineKeyboardMarkup, Invoice, LinkPreviewOptions, LivePhoto, Location, Message, MessageEntity, OrderInfo, PaidMessagesWaived, PassportData, PhotoSize, Poll, PollMedia, PollOption, ProximityAlertTriggered, ReactionCount, ShippingAddress, Sticker, Story, SuccessfulPayment, TextQuote, TonWalletTransfer, User, UsersShared, Venue, Video, VideoChatEnded, VideoChatParticipantsInvited, VideoChatScheduled, VideoNote, Voice, WebAppData, Widget, WriteAccessAllowed } from "./structures";
import { Photo, PollOptions, ReactionCounts, Reactions } from "../structures-handcrafted";
import { callbackEphemeralParams, ephemeralSendParams, ephemeralTarget } from "../ephemeral";
import { INSPECT, makeInspect } from "./inspect";
/**
 * thread-scoped shortcuts for `TelegramMessage` — every call auto-fills `message_thread_id`. returned by `update.thread`
 */
export class MessageThreadShortcuts {
    constructor(public raw: TelegramMessage, public readonly tg: TelegramLike) { }
    /**
     * shortcut for `tg.api.closeForumTopic`
     */
    closeForumTopic(params: {} = {}) {
        return this.tg.api.closeForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.copyMessage`
     */
    copy(from: number | string, params: {
        direct_messages_topic_id?: number;
        video_start_timestamp?: number;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.copyMessage({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            message_id: this.raw.message_id,
            from_chat_id: from,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.copyMessages`
     */
    copyMany(from: number | string, messageIds: number[], params: {
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        remove_caption?: boolean;
    } = {}) {
        return this.tg.api.copyMessages({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            from_chat_id: from,
            message_ids: messageIds,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteForumTopic`
     */
    deleteForumTopic(params: {} = {}) {
        return this.tg.api.deleteForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editForumTopic`
     */
    editForumTopic(params: {
        name?: string;
        icon_custom_emoji_id?: string;
    } = {}) {
        return this.tg.api.editForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.forwardMessage`
     */
    forward(from: number | string, params: {
        direct_messages_topic_id?: number;
        video_start_timestamp?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
    } = {}) {
        return this.tg.api.forwardMessage({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            message_id: this.raw.message_id,
            from_chat_id: from,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.forwardMessages`
     */
    forwardMany(from: number | string, messageIds: number[], params: {
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
    } = {}) {
        return this.tg.api.forwardMessages({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            from_chat_id: from,
            message_ids: messageIds,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.reopenForumTopic`
     */
    reopenForumTopic(params: {} = {}) {
        return this.tg.api.reopenForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendAnimation`
     */
    sendAnimation(animation: TelegramInputFile | string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        width?: number;
        height?: number;
        thumbnail?: TelegramInputFile | string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendAnimation({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            animation: animation,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendAnimation` — sets `reply_parameters` to this message
     */
    replyWithAnimation(animation: TelegramInputFile | string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        width?: number;
        height?: number;
        thumbnail?: TelegramInputFile | string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendAnimation({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            animation: animation,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendAudio`
     */
    sendAudio(audio: TelegramInputFile | string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        duration?: number;
        performer?: string;
        title?: string;
        thumbnail?: TelegramInputFile | string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendAudio({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            audio: audio,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendAudio` — sets `reply_parameters` to this message
     */
    replyWithAudio(audio: TelegramInputFile | string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        duration?: number;
        performer?: string;
        title?: string;
        thumbnail?: TelegramInputFile | string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendAudio({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            audio: audio,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendChatAction`
     */
    sendChatAction(action: string, params: {} = {}) {
        return this.tg.api.sendChatAction({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            action: action,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendContact`
     */
    sendContact(phoneNumber: string, firstName: string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        last_name?: string;
        vcard?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendContact({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            phone_number: phoneNumber,
            first_name: firstName,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendContact` — sets `reply_parameters` to this message
     */
    replyWithContact(phoneNumber: string, firstName: string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        last_name?: string;
        vcard?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendContact({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            phone_number: phoneNumber,
            first_name: firstName,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendDice`
     */
    sendDice(params: {
        direct_messages_topic_id?: number;
        emoji?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendDice({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendDice` — sets `reply_parameters` to this message
     */
    replyWithDice(params: {
        direct_messages_topic_id?: number;
        emoji?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendDice({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendDocument`
     */
    sendDocument(document: TelegramInputFile | string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        thumbnail?: TelegramInputFile | string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        disable_content_type_detection?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendDocument({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            document: document,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendDocument` — sets `reply_parameters` to this message
     */
    replyWithDocument(document: TelegramInputFile | string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        thumbnail?: TelegramInputFile | string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        disable_content_type_detection?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendDocument({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            document: document,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendGame`
     */
    sendGame(gameShortName: string, params: {
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.sendGame({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            game_short_name: gameShortName,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendGame` — sets `reply_parameters` to this message
     */
    replyWithGame(gameShortName: string, params: {
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.sendGame({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            game_short_name: gameShortName,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendInvoice`
     */
    sendInvoice(params: {
        direct_messages_topic_id?: number;
        title: string;
        description: string;
        payload: string;
        provider_token?: string;
        currency: string;
        prices: TelegramLabeledPrice[];
        max_tip_amount?: number;
        suggested_tip_amounts?: number[];
        start_parameter?: string;
        provider_data?: string;
        photo_url?: string;
        photo_size?: number;
        photo_width?: number;
        photo_height?: number;
        need_name?: boolean;
        need_phone_number?: boolean;
        need_email?: boolean;
        need_shipping_address?: boolean;
        send_phone_number_to_provider?: boolean;
        send_email_to_provider?: boolean;
        is_flexible?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.sendInvoice({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendInvoice` — sets `reply_parameters` to this message
     */
    replyWithInvoice(params: {
        direct_messages_topic_id?: number;
        title: string;
        description: string;
        payload: string;
        provider_token?: string;
        currency: string;
        prices: TelegramLabeledPrice[];
        max_tip_amount?: number;
        suggested_tip_amounts?: number[];
        start_parameter?: string;
        provider_data?: string;
        photo_url?: string;
        photo_size?: number;
        photo_width?: number;
        photo_height?: number;
        need_name?: boolean;
        need_phone_number?: boolean;
        need_email?: boolean;
        need_shipping_address?: boolean;
        send_phone_number_to_provider?: boolean;
        send_email_to_provider?: boolean;
        is_flexible?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.sendInvoice({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendLivePhoto`
     */
    sendLivePhoto(livePhoto: TelegramInputFile | string, photo: TelegramInputFile | string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendLivePhoto({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            live_photo: livePhoto,
            photo: photo,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendLivePhoto` — sets `reply_parameters` to this message
     */
    replyWithLivePhoto(livePhoto: TelegramInputFile | string, photo: TelegramInputFile | string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendLivePhoto({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            live_photo: livePhoto,
            photo: photo,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendLocation`
     */
    sendLocation(latitude: number, longitude: number, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        horizontal_accuracy?: number;
        live_period?: number;
        heading?: number;
        proximity_alert_radius?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendLocation({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            latitude: latitude,
            longitude: longitude,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendLocation` — sets `reply_parameters` to this message
     */
    replyWithLocation(latitude: number, longitude: number, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        horizontal_accuracy?: number;
        live_period?: number;
        heading?: number;
        proximity_alert_radius?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendLocation({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            latitude: latitude,
            longitude: longitude,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendMediaGroup`
     */
    sendMediaGroup(media: (TelegramInputMediaAudio | TelegramInputMediaDocument | TelegramInputMediaLivePhoto | TelegramInputMediaPhoto | TelegramInputMediaVideo)[], params: {
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
    } = {}) {
        return this.tg.api.sendMediaGroup({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            media: media,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendMediaGroup` — sets `reply_parameters` to this message
     */
    replyWithMediaGroup(media: (TelegramInputMediaAudio | TelegramInputMediaDocument | TelegramInputMediaLivePhoto | TelegramInputMediaPhoto | TelegramInputMediaVideo)[], params: {
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
    } = {}) {
        return this.tg.api.sendMediaGroup({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            media: media,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendMessage`
     */
    send(text: string | Formattable, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        link_preview_options?: TelegramLinkPreviewOptions;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendMessage({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            text: text,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendMessage` — sets `reply_parameters` to this message
     */
    reply(text: string | Formattable, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        link_preview_options?: TelegramLinkPreviewOptions;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendMessage({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            text: text,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendMessageDraft`
     */
    sendMessageDraft(draftId: number, text: string | Formattable, params: {
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendMessageDraft({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            draft_id: draftId,
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendPaidMedia`
     */
    sendPaidMedia(starCount: number, media: TelegramInputPaidMedia[], params: {
        direct_messages_topic_id?: number;
        payload?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPaidMedia({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            star_count: starCount,
            media: media,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendPaidMedia` — sets `reply_parameters` to this message
     */
    replyWithPaidMedia(starCount: number, media: TelegramInputPaidMedia[], params: {
        direct_messages_topic_id?: number;
        payload?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPaidMedia({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            star_count: starCount,
            media: media,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendPhoto`
     */
    sendPhoto(photo: TelegramInputFile | string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPhoto({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            photo: photo,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendPhoto` — sets `reply_parameters` to this message
     */
    replyWithPhoto(photo: TelegramInputFile | string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPhoto({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            photo: photo,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendPoll`
     */
    sendPoll(question: string | Formattable, options: TelegramInputPollOption[], params: {
        question_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        question_entities?: TelegramMessageEntity[];
        is_anonymous?: boolean;
        type?: string;
        allows_multiple_answers?: boolean;
        allows_revoting?: boolean;
        shuffle_options?: boolean;
        allow_adding_options?: boolean;
        hide_results_until_closes?: boolean;
        members_only?: boolean;
        country_codes?: string[];
        correct_option_ids?: number[];
        explanation?: string | Formattable;
        explanation_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        explanation_entities?: TelegramMessageEntity[];
        explanation_media?: TelegramInputPollMedia;
        open_period?: number;
        close_date?: number;
        is_closed?: boolean;
        description?: string | Formattable;
        description_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        description_entities?: TelegramMessageEntity[];
        media?: TelegramInputPollMedia;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPoll({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            question: question,
            options: options,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendPoll` — sets `reply_parameters` to this message
     */
    replyWithPoll(question: string | Formattable, options: TelegramInputPollOption[], params: {
        question_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        question_entities?: TelegramMessageEntity[];
        is_anonymous?: boolean;
        type?: string;
        allows_multiple_answers?: boolean;
        allows_revoting?: boolean;
        shuffle_options?: boolean;
        allow_adding_options?: boolean;
        hide_results_until_closes?: boolean;
        members_only?: boolean;
        country_codes?: string[];
        correct_option_ids?: number[];
        explanation?: string | Formattable;
        explanation_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        explanation_entities?: TelegramMessageEntity[];
        explanation_media?: TelegramInputPollMedia;
        open_period?: number;
        close_date?: number;
        is_closed?: boolean;
        description?: string | Formattable;
        description_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        description_entities?: TelegramMessageEntity[];
        media?: TelegramInputPollMedia;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPoll({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            question: question,
            options: options,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessage`
     */
    sendRichMessage(richMessage: TelegramInputRichMessage | RichLike, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendRichMessage({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            rich_message: richMessage,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendRichMessage` — sets `reply_parameters` to this message
     */
    replyWithRichMessage(richMessage: TelegramInputRichMessage | RichLike, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendRichMessage({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            rich_message: richMessage,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessageDraft`
     */
    sendRichMessageDraft(draftId: number, richMessage: TelegramInputRichMessage | RichLike, params: {
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendRichMessageDraft({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            draft_id: draftId,
            rich_message: richMessage,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendSharedWidget`
     */
    sendSharedWidget(widgetId: string, params: {
        chat_data?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendSharedWidget({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            widget_id: widgetId,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendSharedWidget` — sets `reply_parameters` to this message
     */
    replyWithSharedWidget(widgetId: string, params: {
        chat_data?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendSharedWidget({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            widget_id: widgetId,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendSticker`
     */
    sendSticker(sticker: TelegramInputFile | string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        emoji?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendSticker({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            sticker: sticker,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendSticker` — sets `reply_parameters` to this message
     */
    replyWithSticker(sticker: TelegramInputFile | string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        emoji?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendSticker({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            sticker: sticker,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendVenue`
     */
    sendVenue(latitude: number, longitude: number, title: string, address: string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        foursquare_id?: string;
        foursquare_type?: string;
        google_place_id?: string;
        google_place_type?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVenue({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            latitude: latitude,
            longitude: longitude,
            title: title,
            address: address,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendVenue` — sets `reply_parameters` to this message
     */
    replyWithVenue(latitude: number, longitude: number, title: string, address: string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        foursquare_id?: string;
        foursquare_type?: string;
        google_place_id?: string;
        google_place_type?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVenue({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            latitude: latitude,
            longitude: longitude,
            title: title,
            address: address,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendVideo`
     */
    sendVideo(video: TelegramInputFile | string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        width?: number;
        height?: number;
        thumbnail?: TelegramInputFile | string;
        cover?: TelegramInputFile | string;
        start_timestamp?: number;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        supports_streaming?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVideo({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            video: video,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendVideo` — sets `reply_parameters` to this message
     */
    replyWithVideo(video: TelegramInputFile | string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        width?: number;
        height?: number;
        thumbnail?: TelegramInputFile | string;
        cover?: TelegramInputFile | string;
        start_timestamp?: number;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        supports_streaming?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVideo({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            video: video,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendVideoNote`
     */
    sendVideoNote(videoNote: TelegramInputFile | string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        length?: number;
        thumbnail?: TelegramInputFile | string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVideoNote({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            video_note: videoNote,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendVideoNote` — sets `reply_parameters` to this message
     */
    replyWithVideoNote(videoNote: TelegramInputFile | string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        length?: number;
        thumbnail?: TelegramInputFile | string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVideoNote({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            video_note: videoNote,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendVoice`
     */
    sendVoice(voice: TelegramInputFile | string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        duration?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVoice({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            voice: voice,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendVoice` — sets `reply_parameters` to this message
     */
    replyWithVoice(voice: TelegramInputFile | string, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        duration?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVoice({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            voice: voice,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendWidget`
     */
    sendWidget(html: string, params: {
        width?: number;
        height?: number;
        public_data?: string;
        chat_data?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        allow_queries?: boolean;
        is_shared?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendWidget({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            html: html,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendWidget` — sets `reply_parameters` to this message
     */
    replyWithWidget(html: string, params: {
        width?: number;
        height?: number;
        public_data?: string;
        chat_data?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        allow_queries?: boolean;
        is_shared?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendWidget({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            html: html,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.unpinAllForumTopicMessages`
     */
    unpinAllForumTopicMessages(params: {} = {}) {
        return this.tg.api.unpinAllForumTopicMessages({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendMessageDraft`
     */
    sendDraft(draftId: number, text: string | Formattable, params: {
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendMessageDraft({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            draft_id: draftId,
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessage`
     */
    sendRich(richMessage: TelegramInputRichMessage | RichLike, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendRichMessage({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            rich_message: richMessage,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendRichMessage` — sets `reply_parameters` to this message
     */
    replyWithRich(richMessage: TelegramInputRichMessage | RichLike, params: {
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendRichMessage({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            rich_message: richMessage,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessageDraft`
     */
    sendRichDraft(draftId: number, richMessage: TelegramInputRichMessage | RichLike, params: {
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendRichMessageDraft({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            draft_id: draftId,
            rich_message: richMessage,
            ...params
        });
    }
}

/**
 * thread-scoped shortcuts for `TelegramMessageGenerationStopped` — every call auto-fills `message_thread_id`. returned by `update.thread`
 */
export class MessageGenerationStoppedThreadShortcuts {
    constructor(public raw: TelegramMessageGenerationStopped, public readonly tg: TelegramLike) { }
    /**
     * shortcut for `tg.api.closeForumTopic`
     */
    closeForumTopic(params: {} = {}) {
        return this.tg.api.closeForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.copyMessage`
     */
    copy(from: number | string, messageId: number, params: {
        direct_messages_topic_id?: number;
        video_start_timestamp?: number;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.copyMessage({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            from_chat_id: from,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.copyMessages`
     */
    copyMany(from: number | string, messageIds: number[], params: {
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        remove_caption?: boolean;
    } = {}) {
        return this.tg.api.copyMessages({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            from_chat_id: from,
            message_ids: messageIds,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteForumTopic`
     */
    deleteForumTopic(params: {} = {}) {
        return this.tg.api.deleteForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editForumTopic`
     */
    editForumTopic(params: {
        name?: string;
        icon_custom_emoji_id?: string;
    } = {}) {
        return this.tg.api.editForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.forwardMessage`
     */
    forward(from: number | string, messageId: number, params: {
        direct_messages_topic_id?: number;
        video_start_timestamp?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
    } = {}) {
        return this.tg.api.forwardMessage({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            from_chat_id: from,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.forwardMessages`
     */
    forwardMany(from: number | string, messageIds: number[], params: {
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
    } = {}) {
        return this.tg.api.forwardMessages({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            from_chat_id: from,
            message_ids: messageIds,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.reopenForumTopic`
     */
    reopenForumTopic(params: {} = {}) {
        return this.tg.api.reopenForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendAnimation`
     */
    sendAnimation(animation: TelegramInputFile | string, params: {
        business_connection_id?: string;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        width?: number;
        height?: number;
        thumbnail?: TelegramInputFile | string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendAnimation({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            animation: animation,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendAudio`
     */
    sendAudio(audio: TelegramInputFile | string, params: {
        business_connection_id?: string;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        duration?: number;
        performer?: string;
        title?: string;
        thumbnail?: TelegramInputFile | string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendAudio({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            audio: audio,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendChatAction`
     */
    sendChatAction(action: string, params: {
        business_connection_id?: string;
    } = {}) {
        return this.tg.api.sendChatAction({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            action: action,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendContact`
     */
    sendContact(phoneNumber: string, firstName: string, params: {
        business_connection_id?: string;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        last_name?: string;
        vcard?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendContact({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            phone_number: phoneNumber,
            first_name: firstName,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendDice`
     */
    sendDice(params: {
        business_connection_id?: string;
        direct_messages_topic_id?: number;
        emoji?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendDice({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendDocument`
     */
    sendDocument(document: TelegramInputFile | string, params: {
        business_connection_id?: string;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        thumbnail?: TelegramInputFile | string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        disable_content_type_detection?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendDocument({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            document: document,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendGame`
     */
    sendGame(gameShortName: string, params: {
        business_connection_id?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.sendGame({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            game_short_name: gameShortName,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendInvoice`
     */
    sendInvoice(params: {
        direct_messages_topic_id?: number;
        title: string;
        description: string;
        payload: string;
        provider_token?: string;
        currency: string;
        prices: TelegramLabeledPrice[];
        max_tip_amount?: number;
        suggested_tip_amounts?: number[];
        start_parameter?: string;
        provider_data?: string;
        photo_url?: string;
        photo_size?: number;
        photo_width?: number;
        photo_height?: number;
        need_name?: boolean;
        need_phone_number?: boolean;
        need_email?: boolean;
        need_shipping_address?: boolean;
        send_phone_number_to_provider?: boolean;
        send_email_to_provider?: boolean;
        is_flexible?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.sendInvoice({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendLivePhoto`
     */
    sendLivePhoto(livePhoto: TelegramInputFile | string, photo: TelegramInputFile | string, params: {
        business_connection_id?: string;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendLivePhoto({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            live_photo: livePhoto,
            photo: photo,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendLocation`
     */
    sendLocation(latitude: number, longitude: number, params: {
        business_connection_id?: string;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        horizontal_accuracy?: number;
        live_period?: number;
        heading?: number;
        proximity_alert_radius?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendLocation({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            latitude: latitude,
            longitude: longitude,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendMediaGroup`
     */
    sendMediaGroup(media: (TelegramInputMediaAudio | TelegramInputMediaDocument | TelegramInputMediaLivePhoto | TelegramInputMediaPhoto | TelegramInputMediaVideo)[], params: {
        business_connection_id?: string;
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
    } = {}) {
        return this.tg.api.sendMediaGroup({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            media: media,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendMessage`
     */
    send(text: string | Formattable, params: {
        business_connection_id?: string;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        link_preview_options?: TelegramLinkPreviewOptions;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendMessage({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendMessageDraft`
     */
    sendMessageDraft(draftId: number, text: string | Formattable, params: {
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendMessageDraft({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            draft_id: draftId,
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendPaidMedia`
     */
    sendPaidMedia(starCount: number, media: TelegramInputPaidMedia[], params: {
        business_connection_id?: string;
        direct_messages_topic_id?: number;
        payload?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPaidMedia({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            star_count: starCount,
            media: media,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendPhoto`
     */
    sendPhoto(photo: TelegramInputFile | string, params: {
        business_connection_id?: string;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPhoto({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            photo: photo,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendPoll`
     */
    sendPoll(question: string | Formattable, options: TelegramInputPollOption[], params: {
        business_connection_id?: string;
        question_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        question_entities?: TelegramMessageEntity[];
        is_anonymous?: boolean;
        type?: string;
        allows_multiple_answers?: boolean;
        allows_revoting?: boolean;
        shuffle_options?: boolean;
        allow_adding_options?: boolean;
        hide_results_until_closes?: boolean;
        members_only?: boolean;
        country_codes?: string[];
        correct_option_ids?: number[];
        explanation?: string | Formattable;
        explanation_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        explanation_entities?: TelegramMessageEntity[];
        explanation_media?: TelegramInputPollMedia;
        open_period?: number;
        close_date?: number;
        is_closed?: boolean;
        description?: string | Formattable;
        description_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        description_entities?: TelegramMessageEntity[];
        media?: TelegramInputPollMedia;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPoll({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            question: question,
            options: options,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessage`
     */
    sendRichMessage(richMessage: TelegramInputRichMessage | RichLike, params: {
        business_connection_id?: string;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendRichMessage({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            rich_message: richMessage,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessageDraft`
     */
    sendRichMessageDraft(draftId: number, richMessage: TelegramInputRichMessage | RichLike, params: {
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendRichMessageDraft({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            draft_id: draftId,
            rich_message: richMessage,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendSharedWidget`
     */
    sendSharedWidget(widgetId: string, params: {
        chat_data?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendSharedWidget({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            widget_id: widgetId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendSticker`
     */
    sendSticker(sticker: TelegramInputFile | string, params: {
        business_connection_id?: string;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        emoji?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendSticker({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            sticker: sticker,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendVenue`
     */
    sendVenue(latitude: number, longitude: number, title: string, address: string, params: {
        business_connection_id?: string;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        foursquare_id?: string;
        foursquare_type?: string;
        google_place_id?: string;
        google_place_type?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVenue({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            latitude: latitude,
            longitude: longitude,
            title: title,
            address: address,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendVideo`
     */
    sendVideo(video: TelegramInputFile | string, params: {
        business_connection_id?: string;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        width?: number;
        height?: number;
        thumbnail?: TelegramInputFile | string;
        cover?: TelegramInputFile | string;
        start_timestamp?: number;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        supports_streaming?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVideo({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            video: video,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendVideoNote`
     */
    sendVideoNote(videoNote: TelegramInputFile | string, params: {
        business_connection_id?: string;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        length?: number;
        thumbnail?: TelegramInputFile | string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVideoNote({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            video_note: videoNote,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendVoice`
     */
    sendVoice(voice: TelegramInputFile | string, params: {
        business_connection_id?: string;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        duration?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVoice({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            voice: voice,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendWidget`
     */
    sendWidget(html: string, params: {
        width?: number;
        height?: number;
        public_data?: string;
        chat_data?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        allow_queries?: boolean;
        is_shared?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendWidget({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            html: html,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unpinAllForumTopicMessages`
     */
    unpinAllForumTopicMessages(params: {} = {}) {
        return this.tg.api.unpinAllForumTopicMessages({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendMessageDraft`
     */
    sendDraft(draftId: number, text: string | Formattable, params: {
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendMessageDraft({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            draft_id: draftId,
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessage`
     */
    sendRich(richMessage: TelegramInputRichMessage | RichLike, params: {
        business_connection_id?: string;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendRichMessage({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            rich_message: richMessage,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessageDraft`
     */
    sendRichDraft(draftId: number, richMessage: TelegramInputRichMessage | RichLike, params: {
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendRichMessageDraft({
            chat_id: this.raw.chat.id,
            message_thread_id: this.raw.message_thread_id as NonNullable<typeof this.raw.message_thread_id>,
            draft_id: draftId,
            rich_message: richMessage,
            ...params
        });
    }
}

/**
 * shared base for every update built from `TelegramMessage` — implementation detail, not exported
 */
class MessageShared {
    declare readonly kind: string;
    private _from?: User;
    private _senderChat?: Chat;
    private _senderBusinessBot?: User;
    private _receiverUser?: User;
    private _chat?: Chat;
    private _replyToMessage?: Message;
    private _externalReply?: ExternalReplyInfo;
    private _quote?: TextQuote;
    private _replyToStory?: Story;
    private _viaBot?: User;
    private _guestBotCallerUser?: User;
    private _guestBotCallerChat?: Chat;
    private _entities?: MessageEntity[];
    private _linkPreviewOptions?: LinkPreviewOptions;
    private _animation?: Animation;
    private _audio?: Audio;
    private _document?: Document;
    private _livePhoto?: LivePhoto;
    private _photo?: Photo;
    private _sticker?: Sticker;
    private _story?: Story;
    private _video?: Video;
    private _videoNote?: VideoNote;
    private _voice?: Voice;
    private _widget?: Widget;
    private _captionEntities?: MessageEntity[];
    private _contact?: Contact;
    private _dice?: Dice;
    private _game?: Game;
    private _poll?: Poll;
    private _venue?: Venue;
    private _location?: Location;
    private _newChatMembers?: User[];
    private _leftChatMember?: User;
    private _newChatPhoto?: Photo;
    private _invoice?: Invoice;
    private _successfulPayment?: SuccessfulPayment;
    private _usersShared?: UsersShared;
    private _chatShared?: ChatShared;
    private _writeAccessAllowed?: WriteAccessAllowed;
    private _passportData?: PassportData;
    private _proximityAlertTriggered?: ProximityAlertTriggered;
    private _forumTopicCreated?: ForumTopicCreated;
    private _forumTopicEdited?: ForumTopicEdited;
    private _giveaway?: Giveaway;
    private _giveawayWinners?: GiveawayWinners;
    private _giveawayCompleted?: GiveawayCompleted;
    private _paidMessagesWaived?: PaidMessagesWaived;
    private _tonWalletTransfer?: TonWalletTransfer;
    private _videoChatScheduled?: VideoChatScheduled;
    private _videoChatEnded?: VideoChatEnded;
    private _videoChatParticipantsInvited?: VideoChatParticipantsInvited;
    private _webAppData?: WebAppData;
    private _replyMarkup?: InlineKeyboardMarkup;
    constructor(public raw: TelegramMessage, public readonly tg: TelegramLike) { }
    /**
     * Unique message identifier inside this chat; 0 for ephemeral messages. In specific instances (e.g., a message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent.
     */
    get id(): number {
        return this.raw.message_id;
    }
    /**
     * Optional. Unique identifier of a message thread or forum topic to which the message belongs; for supergroups and private chats only
     */
    get messageThreadId(): number | undefined {
        return this.raw.message_thread_id;
    }
    /**
     * Optional. Information about the direct messages chat topic that contains the message
     */
    get directMessagesTopic(): TelegramDirectMessagesTopic | undefined {
        return this.raw.direct_messages_topic;
    }
    /**
     * Optional. Sender of the message; may be empty for messages sent to channels. For backward compatibility, if the message was sent on behalf of a chat, the field contains a fake sender user in non-channel chats.
     */
    get from(): User | undefined {
        return this.raw.from ? (this._from ??= new User(this.raw.from)) : undefined;
    }
    /**
     * Optional. Sender of the message when sent on behalf of a chat. For example, the supergroup itself for messages sent by its anonymous administrators or a linked channel for messages automatically forwarded to the channel's discussion group. For backward compatibility, if the message was sent on behalf of a chat, the field from contains a fake sender user in non-channel chats.
     */
    get senderChat(): Chat | undefined {
        return this.raw.sender_chat ? (this._senderChat ??= new Chat(this.raw.sender_chat)) : undefined;
    }
    /**
     * Optional. If the sender of the message boosted the chat, the number of boosts added by the user
     */
    get senderBoostCount(): number | undefined {
        return this.raw.sender_boost_count;
    }
    /**
     * Optional. The bot that actually sent the message on behalf of the business account. Available only for outgoing messages sent on behalf of the connected business account.
     */
    get senderBusinessBot(): User | undefined {
        return this.raw.sender_business_bot ? (this._senderBusinessBot ??= new User(this.raw.sender_business_bot)) : undefined;
    }
    /**
     * Optional. Tag or custom title of the sender of the message; for supergroups only
     */
    get senderTag(): string | undefined {
        return this.raw.sender_tag;
    }
    /**
     * Optional. For ephemeral messages, the user who received the message
     */
    get receiverUser(): User | undefined {
        return this.raw.receiver_user ? (this._receiverUser ??= new User(this.raw.receiver_user)) : undefined;
    }
    /**
     * Optional. For ephemeral messages, identifier of the ephemeral message inside this chat. The identifier may be reused for another ephemeral message after the message is deleted or expires.
     */
    get ephemeralMessageId(): number | undefined {
        return this.raw.ephemeral_message_id;
    }
    /**
     * Date the message was sent in Unix time. It is always a positive number, representing a valid date.
     */
    get date(): number {
        return this.raw.date;
    }
    /**
     * Optional. The unique identifier for the guest query. Use this identifier with the method answerGuestQuery to send a response message. If non-empty, the message belongs to the chat where the guest bot was summoned, which may not coincide with other existing bot chats sharing the same identifier.
     */
    get guestQueryId(): string | undefined {
        return this.raw.guest_query_id;
    }
    /**
     * Optional. Unique identifier of the business connection from which the message was received. If non-empty, the message belongs to a chat of the corresponding business account that is independent from any potential bot chat which might share the same identifier.
     */
    get businessConnectionId(): string | undefined {
        return this.raw.business_connection_id;
    }
    /**
     * Chat the message belongs to
     */
    get chat(): Chat {
        return this._chat ??= new Chat(this.raw.chat);
    }
    /**
     * Optional. Information about the original message for forwarded messages
     */
    get forwardOrigin(): TelegramMessageOrigin | undefined {
        return this.raw.forward_origin;
    }
    /**
     * Optional. True, if the message is sent to a topic in a forum supergroup or a private chat with the bot
     */
    get isTopicMessage(): true | undefined {
        return this.raw.is_topic_message;
    }
    /**
     * Optional. True, if the message is a channel post that was automatically forwarded to the connected discussion group
     */
    get isAutomaticForward(): true | undefined {
        return this.raw.is_automatic_forward;
    }
    /**
     * Optional. For replies in the same chat and message thread, the original message. Note that the Message object in this field will not contain further reply_to_message fields even if it itself is a reply. If the message is a reply to an ephemeral message, then this field may be omitted.
     */
    get replyToMessage(): Message | undefined {
        return this.raw.reply_to_message ? (this._replyToMessage ??= new Message(this.raw.reply_to_message)) : undefined;
    }
    /**
     * Optional. Information about the message that is being replied to, which may come from another chat or forum topic
     */
    get externalReply(): ExternalReplyInfo | undefined {
        return this.raw.external_reply ? (this._externalReply ??= new ExternalReplyInfo(this.raw.external_reply)) : undefined;
    }
    /**
     * Optional. For replies that quote part of the original message, the quoted part of the message
     */
    get quote(): TextQuote | undefined {
        return this.raw.quote ? (this._quote ??= new TextQuote(this.raw.quote)) : undefined;
    }
    /**
     * Optional. For replies to a story, the original story
     */
    get replyToStory(): Story | undefined {
        return this.raw.reply_to_story ? (this._replyToStory ??= new Story(this.raw.reply_to_story)) : undefined;
    }
    /**
     * Optional. Identifier of the specific checklist task that is being replied to
     */
    get replyToChecklistTaskId(): number | undefined {
        return this.raw.reply_to_checklist_task_id;
    }
    /**
     * Optional. Persistent identifier of the specific poll option that is being replied to
     */
    get replyToPollOptionId(): string | undefined {
        return this.raw.reply_to_poll_option_id;
    }
    /**
     * Optional. Bot through which the message was sent
     */
    get viaBot(): User | undefined {
        return this.raw.via_bot ? (this._viaBot ??= new User(this.raw.via_bot)) : undefined;
    }
    /**
     * Optional. For a message sent by a guest bot, this is the user whose original message triggered the bot's response
     */
    get guestBotCallerUser(): User | undefined {
        return this.raw.guest_bot_caller_user ? (this._guestBotCallerUser ??= new User(this.raw.guest_bot_caller_user)) : undefined;
    }
    /**
     * Optional. For a message sent by a guest bot, this is the chat whose original message triggered the bot's response
     */
    get guestBotCallerChat(): Chat | undefined {
        return this.raw.guest_bot_caller_chat ? (this._guestBotCallerChat ??= new Chat(this.raw.guest_bot_caller_chat)) : undefined;
    }
    /**
     * Optional. Date the message was last edited in Unix time
     */
    get editDate(): number | undefined {
        return this.raw.edit_date;
    }
    /**
     * Optional. True, if the message can't be forwarded
     */
    get hasProtectedContent(): true | undefined {
        return this.raw.has_protected_content;
    }
    /**
     * Optional. True, if the message was sent by an implicit action, for example, as an away or a greeting business message, or as a scheduled message
     */
    get isFromOffline(): true | undefined {
        return this.raw.is_from_offline;
    }
    /**
     * Optional. True, if the message is a paid post. Note that such posts must not be deleted for 24 hours to receive the payment and can't be edited.
     */
    get isPaidPost(): true | undefined {
        return this.raw.is_paid_post;
    }
    /**
     * Optional. The unique identifier inside this chat of a media message group this message belongs to
     */
    get mediaGroupId(): string | undefined {
        return this.raw.media_group_id;
    }
    /**
     * Optional. Signature of the post author for messages in channels, or the custom title of an anonymous group administrator
     */
    get authorSignature(): string | undefined {
        return this.raw.author_signature;
    }
    /**
     * Optional. The number of Telegram Stars that were paid by the sender of the message to send it
     */
    get paidStarCount(): number | undefined {
        return this.raw.paid_star_count;
    }
    /**
     * Optional. For text messages, the actual UTF-8 text of the message
     */
    get text(): string | undefined {
        return this.raw.text;
    }
    /**
     * Optional. For text messages, special entities like usernames, URLs, bot commands, etc. that appear in the text
     */
    get entities(): MessageEntity[] | undefined {
        return this.raw.entities ? (this._entities ??= this.raw.entities.map(x => new MessageEntity(x))) : undefined;
    }
    /**
     * Optional. Options used for link preview generation for the message, if it is a text message and link preview options were changed
     */
    get linkPreviewOptions(): LinkPreviewOptions | undefined {
        return this.raw.link_preview_options ? (this._linkPreviewOptions ??= new LinkPreviewOptions(this.raw.link_preview_options)) : undefined;
    }
    /**
     * Optional. Information about suggested post parameters if the message is a suggested post in a channel direct messages chat. If the message is an approved or declined suggested post, then it can't be edited.
     */
    get suggestedPostInfo(): TelegramSuggestedPostInfo | undefined {
        return this.raw.suggested_post_info;
    }
    /**
     * Optional. Unique identifier of the message effect added to the message
     */
    get effectId(): string | undefined {
        return this.raw.effect_id;
    }
    /**
     * Optional. Message is a rich formatted message
     */
    get richMessage(): TelegramRichMessage | undefined {
        return this.raw.rich_message;
    }
    /**
     * Optional. Message is an animation, information about the animation. For backward compatibility, when this field is set, the document field will also be set.
     */
    get animation(): Animation | undefined {
        return this.raw.animation ? (this._animation ??= new Animation(this.raw.animation)) : undefined;
    }
    /**
     * Optional. Message is an audio file, information about the file
     */
    get audio(): Audio | undefined {
        return this.raw.audio ? (this._audio ??= new Audio(this.raw.audio)) : undefined;
    }
    /**
     * Optional. Message is a general file, information about the file
     */
    get document(): Document | undefined {
        return this.raw.document ? (this._document ??= new Document(this.raw.document)) : undefined;
    }
    /**
     * Optional. Message is a live photo, information about the live photo. For backward compatibility, when this field is set, the photo field will also be set.
     */
    get livePhoto(): LivePhoto | undefined {
        return this.raw.live_photo ? (this._livePhoto ??= new LivePhoto(this.raw.live_photo)) : undefined;
    }
    /**
     * Optional. Message contains paid media; information about the paid media
     */
    get paidMedia(): TelegramPaidMediaInfo | undefined {
        return this.raw.paid_media;
    }
    /**
     * Optional. Message is a photo, available sizes of the photo
     */
    get photo(): Photo | undefined {
        return this.raw.photo ? (this._photo ??= new Photo(this.raw.photo)) : undefined;
    }
    /**
     * Optional. Message is a sticker, information about the sticker
     */
    get sticker(): Sticker | undefined {
        return this.raw.sticker ? (this._sticker ??= new Sticker(this.raw.sticker)) : undefined;
    }
    /**
     * Optional. Message is a forwarded story
     */
    get story(): Story | undefined {
        return this.raw.story ? (this._story ??= new Story(this.raw.story)) : undefined;
    }
    /**
     * Optional. Message is a video, information about the video
     */
    get video(): Video | undefined {
        return this.raw.video ? (this._video ??= new Video(this.raw.video)) : undefined;
    }
    /**
     * Optional. Message is a video note, information about the video message
     */
    get videoNote(): VideoNote | undefined {
        return this.raw.video_note ? (this._videoNote ??= new VideoNote(this.raw.video_note)) : undefined;
    }
    /**
     * Optional. Message is a voice message, information about the file
     */
    get voice(): Voice | undefined {
        return this.raw.voice ? (this._voice ??= new Voice(this.raw.voice)) : undefined;
    }
    /**
     * Optional. Message is an HTML widget, information about the widget
     */
    get widget(): Widget | undefined {
        return this.raw.widget ? (this._widget ??= new Widget(this.raw.widget)) : undefined;
    }
    /**
     * Optional. Caption for the animation, audio, document, live photo, paid media, photo, video, voice, or widget
     */
    get caption(): string | undefined {
        return this.raw.caption;
    }
    /**
     * Optional. For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption
     */
    get captionEntities(): MessageEntity[] | undefined {
        return this.raw.caption_entities ? (this._captionEntities ??= this.raw.caption_entities.map(x => new MessageEntity(x))) : undefined;
    }
    /**
     * Optional. True, if the caption must be shown above the message media or the widget
     */
    get showCaptionAboveMedia(): true | undefined {
        return this.raw.show_caption_above_media;
    }
    /**
     * Optional. True, if the message media is covered by a spoiler animation
     */
    get hasMediaSpoiler(): true | undefined {
        return this.raw.has_media_spoiler;
    }
    /**
     * Optional. Message is a checklist
     */
    get checklist(): TelegramChecklist | undefined {
        return this.raw.checklist;
    }
    /**
     * Optional. Message is a shared contact, information about the contact
     */
    get contact(): Contact | undefined {
        return this.raw.contact ? (this._contact ??= new Contact(this.raw.contact)) : undefined;
    }
    /**
     * Optional. Message is a dice with random value
     */
    get dice(): Dice | undefined {
        return this.raw.dice ? (this._dice ??= new Dice(this.raw.dice)) : undefined;
    }
    /**
     * Optional. Message is a game, information about the game. More about games »
     */
    get game(): Game | undefined {
        return this.raw.game ? (this._game ??= new Game(this.raw.game)) : undefined;
    }
    /**
     * Optional. Message is a native poll, information about the poll
     */
    get poll(): Poll | undefined {
        return this.raw.poll ? (this._poll ??= new Poll(this.raw.poll)) : undefined;
    }
    /**
     * Optional. Message is a venue, information about the venue. For backward compatibility, when this field is set, the location field will also be set.
     */
    get venue(): Venue | undefined {
        return this.raw.venue ? (this._venue ??= new Venue(this.raw.venue)) : undefined;
    }
    /**
     * Optional. Message is a shared location, information about the location
     */
    get location(): Location | undefined {
        return this.raw.location ? (this._location ??= new Location(this.raw.location)) : undefined;
    }
    /**
     * Optional. New members that were added to the group or supergroup and information about them (the bot itself may be one of these members)
     */
    get newChatMembers(): User[] | undefined {
        return this.raw.new_chat_members ? (this._newChatMembers ??= this.raw.new_chat_members.map(x => new User(x))) : undefined;
    }
    /**
     * Optional. A member was removed from the group, information about them (this member may be the bot itself)
     */
    get leftChatMember(): User | undefined {
        return this.raw.left_chat_member ? (this._leftChatMember ??= new User(this.raw.left_chat_member)) : undefined;
    }
    /**
     * Optional. Service message: chat owner has left
     */
    get chatOwnerLeft(): TelegramChatOwnerLeft | undefined {
        return this.raw.chat_owner_left;
    }
    /**
     * Optional. Service message: chat owner has changed
     */
    get chatOwnerChanged(): TelegramChatOwnerChanged | undefined {
        return this.raw.chat_owner_changed;
    }
    /**
     * Optional. A chat title was changed to this value
     */
    get newChatTitle(): string | undefined {
        return this.raw.new_chat_title;
    }
    /**
     * Optional. A chat photo was change to this value
     */
    get newChatPhoto(): Photo | undefined {
        return this.raw.new_chat_photo ? (this._newChatPhoto ??= new Photo(this.raw.new_chat_photo)) : undefined;
    }
    /**
     * Optional. Service message: the group has been created
     */
    get groupChatCreated(): true | undefined {
        return this.raw.group_chat_created;
    }
    /**
     * Optional. Service message: the supergroup has been created. This field can't be received in a message coming through updates, because bot can't be a member of a supergroup when it is created. It can only be found in reply_to_message if someone replies to a very first message in a directly created supergroup.
     */
    get supergroupChatCreated(): true | undefined {
        return this.raw.supergroup_chat_created;
    }
    /**
     * Optional. Service message: the channel has been created. This field can't be received in a message coming through updates, because bot can't be a member of a channel when it is created. It can only be found in reply_to_message if someone replies to a very first message in a channel.
     */
    get channelChatCreated(): true | undefined {
        return this.raw.channel_chat_created;
    }
    /**
     * Optional. Service message: auto-delete timer settings changed in the chat
     */
    get messageAutoDeleteTimerChanged(): TelegramMessageAutoDeleteTimerChanged | undefined {
        return this.raw.message_auto_delete_timer_changed;
    }
    /**
     * Optional. The group has been migrated to a supergroup with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
     */
    get migrateToChatId(): number | undefined {
        return this.raw.migrate_to_chat_id;
    }
    /**
     * Optional. The supergroup has been migrated from a group with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
     */
    get migrateFromChatId(): number | undefined {
        return this.raw.migrate_from_chat_id;
    }
    /**
     * Optional. Specified message was pinned. Note that the Message object in this field will not contain further reply_to_message fields even if it itself is a reply.
     */
    get pinnedMessage(): TelegramMaybeInaccessibleMessage | undefined {
        return this.raw.pinned_message;
    }
    /**
     * Optional. Message is an invoice for a payment, information about the invoice. More about payments »
     */
    get invoice(): Invoice | undefined {
        return this.raw.invoice ? (this._invoice ??= new Invoice(this.raw.invoice)) : undefined;
    }
    /**
     * Optional. Message is a service message about a successful payment, information about the payment. More about payments »
     */
    get successfulPayment(): SuccessfulPayment | undefined {
        return this.raw.successful_payment ? (this._successfulPayment ??= new SuccessfulPayment(this.raw.successful_payment)) : undefined;
    }
    /**
     * Optional. Message is a service message about a refunded payment, information about the payment. More about payments »
     */
    get refundedPayment(): TelegramRefundedPayment | undefined {
        return this.raw.refunded_payment;
    }
    /**
     * Optional. Service message: users were shared with the bot
     */
    get usersShared(): UsersShared | undefined {
        return this.raw.users_shared ? (this._usersShared ??= new UsersShared(this.raw.users_shared)) : undefined;
    }
    /**
     * Optional. Service message: a chat was shared with the bot
     */
    get chatShared(): ChatShared | undefined {
        return this.raw.chat_shared ? (this._chatShared ??= new ChatShared(this.raw.chat_shared)) : undefined;
    }
    /**
     * Optional. Service message: a regular gift was sent or received
     */
    get gift(): TelegramGiftInfo | undefined {
        return this.raw.gift;
    }
    /**
     * Optional. Service message: a unique gift was sent or received
     */
    get uniqueGift(): TelegramUniqueGiftInfo | undefined {
        return this.raw.unique_gift;
    }
    /**
     * Optional. Service message: upgrade of a gift was purchased after the gift was sent
     */
    get giftUpgradeSent(): TelegramGiftInfo | undefined {
        return this.raw.gift_upgrade_sent;
    }
    /**
     * Optional. The domain name of the website on which the user has logged in. More about Telegram Login »
     */
    get connectedWebsite(): string | undefined {
        return this.raw.connected_website;
    }
    /**
     * Optional. Service message: the user allowed the bot to write messages after adding it to the attachment or side menu, launching a Web App from a link, or accepting an explicit request from a Web App sent by the method requestWriteAccess
     */
    get writeAccessAllowed(): WriteAccessAllowed | undefined {
        return this.raw.write_access_allowed ? (this._writeAccessAllowed ??= new WriteAccessAllowed(this.raw.write_access_allowed)) : undefined;
    }
    /**
     * Optional. Telegram Passport data
     */
    get passportData(): PassportData | undefined {
        return this.raw.passport_data ? (this._passportData ??= new PassportData(this.raw.passport_data)) : undefined;
    }
    /**
     * Optional. Service message: a user in the chat triggered another user's proximity alert while sharing Live Location
     */
    get proximityAlertTriggered(): ProximityAlertTriggered | undefined {
        return this.raw.proximity_alert_triggered ? (this._proximityAlertTriggered ??= new ProximityAlertTriggered(this.raw.proximity_alert_triggered)) : undefined;
    }
    /**
     * Optional. Service message: user boosted the chat
     */
    get boostAdded(): TelegramChatBoostAdded | undefined {
        return this.raw.boost_added;
    }
    /**
     * Optional. Service message: chat background set
     */
    get chatBackgroundSet(): TelegramChatBackground | undefined {
        return this.raw.chat_background_set;
    }
    /**
     * Optional. Service message: some tasks in a checklist were marked as done or not done
     */
    get checklistTasksDone(): TelegramChecklistTasksDone | undefined {
        return this.raw.checklist_tasks_done;
    }
    /**
     * Optional. Service message: tasks were added to a checklist
     */
    get checklistTasksAdded(): TelegramChecklistTasksAdded | undefined {
        return this.raw.checklist_tasks_added;
    }
    /**
     * Optional. Service message: chat or bot added to a Community
     */
    get communityChatAdded(): TelegramCommunityChatAdded | undefined {
        return this.raw.community_chat_added;
    }
    /**
     * Optional. Service message: chat was joined by a user from a Community
     */
    get communityChatJoined(): TelegramCommunityChatJoined | undefined {
        return this.raw.community_chat_joined;
    }
    /**
     * Optional. Service message: chat or bot removed from a Community
     */
    get communityChatRemoved(): TelegramCommunityChatRemoved | undefined {
        return this.raw.community_chat_removed;
    }
    /**
     * Optional. Service message: the price for paid messages in the corresponding direct messages chat of a channel has changed
     */
    get directMessagePriceChanged(): TelegramDirectMessagePriceChanged | undefined {
        return this.raw.direct_message_price_changed;
    }
    /**
     * Optional. Service message: forum topic created
     */
    get forumTopicCreated(): ForumTopicCreated | undefined {
        return this.raw.forum_topic_created ? (this._forumTopicCreated ??= new ForumTopicCreated(this.raw.forum_topic_created)) : undefined;
    }
    /**
     * Optional. Service message: forum topic edited
     */
    get forumTopicEdited(): ForumTopicEdited | undefined {
        return this.raw.forum_topic_edited ? (this._forumTopicEdited ??= new ForumTopicEdited(this.raw.forum_topic_edited)) : undefined;
    }
    /**
     * Optional. Service message: forum topic closed
     */
    get forumTopicClosed(): TelegramForumTopicClosed | undefined {
        return this.raw.forum_topic_closed;
    }
    /**
     * Optional. Service message: forum topic reopened
     */
    get forumTopicReopened(): TelegramForumTopicReopened | undefined {
        return this.raw.forum_topic_reopened;
    }
    /**
     * Optional. Service message: the 'General' forum topic hidden
     */
    get generalForumTopicHidden(): TelegramGeneralForumTopicHidden | undefined {
        return this.raw.general_forum_topic_hidden;
    }
    /**
     * Optional. Service message: the 'General' forum topic unhidden
     */
    get generalForumTopicUnhidden(): TelegramGeneralForumTopicUnhidden | undefined {
        return this.raw.general_forum_topic_unhidden;
    }
    /**
     * Optional. Service message: a scheduled giveaway was created
     */
    get giveawayCreated(): TelegramGiveawayCreated | undefined {
        return this.raw.giveaway_created;
    }
    /**
     * Optional. The message is a scheduled giveaway message
     */
    get giveaway(): Giveaway | undefined {
        return this.raw.giveaway ? (this._giveaway ??= new Giveaway(this.raw.giveaway)) : undefined;
    }
    /**
     * Optional. A giveaway with public winners was completed
     */
    get giveawayWinners(): GiveawayWinners | undefined {
        return this.raw.giveaway_winners ? (this._giveawayWinners ??= new GiveawayWinners(this.raw.giveaway_winners)) : undefined;
    }
    /**
     * Optional. Service message: a giveaway without public winners was completed
     */
    get giveawayCompleted(): GiveawayCompleted | undefined {
        return this.raw.giveaway_completed ? (this._giveawayCompleted ??= new GiveawayCompleted(this.raw.giveaway_completed)) : undefined;
    }
    /**
     * Optional. Service message: user created a bot that will be managed by the current bot
     */
    get managedBotCreated(): TelegramManagedBotCreated | undefined {
        return this.raw.managed_bot_created;
    }
    /**
     * Optional. Service message: the price for paid messages has changed in the chat
     */
    get paidMessagePriceChanged(): TelegramPaidMessagePriceChanged | undefined {
        return this.raw.paid_message_price_changed;
    }
    /**
     * Optional. Service message: the sender of the message used a link of the other user, which allows sending messages to the user without paying Telegram Stars
     */
    get paidMessagesWaived(): PaidMessagesWaived | undefined {
        return this.raw.paid_messages_waived ? (this._paidMessagesWaived ??= new PaidMessagesWaived(this.raw.paid_messages_waived)) : undefined;
    }
    /**
     * Optional. Service message: answer option was added to a poll
     */
    get pollOptionAdded(): TelegramPollOptionAdded | undefined {
        return this.raw.poll_option_added;
    }
    /**
     * Optional. Service message: answer option was deleted from a poll
     */
    get pollOptionDeleted(): TelegramPollOptionDeleted | undefined {
        return this.raw.poll_option_deleted;
    }
    /**
     * Optional. Service message: a suggested post was approved
     */
    get suggestedPostApproved(): TelegramSuggestedPostApproved | undefined {
        return this.raw.suggested_post_approved;
    }
    /**
     * Optional. Service message: approval of a suggested post has failed
     */
    get suggestedPostApprovalFailed(): TelegramSuggestedPostApprovalFailed | undefined {
        return this.raw.suggested_post_approval_failed;
    }
    /**
     * Optional. Service message: a suggested post was declined
     */
    get suggestedPostDeclined(): TelegramSuggestedPostDeclined | undefined {
        return this.raw.suggested_post_declined;
    }
    /**
     * Optional. Service message: payment for a suggested post was received
     */
    get suggestedPostPaid(): TelegramSuggestedPostPaid | undefined {
        return this.raw.suggested_post_paid;
    }
    /**
     * Optional. Service message: payment for a suggested post was refunded
     */
    get suggestedPostRefunded(): TelegramSuggestedPostRefunded | undefined {
        return this.raw.suggested_post_refunded;
    }
    /**
     * Optional. Service message: a transfer with a TON wallet
     */
    get tonWalletTransfer(): TonWalletTransfer | undefined {
        return this.raw.ton_wallet_transfer ? (this._tonWalletTransfer ??= new TonWalletTransfer(this.raw.ton_wallet_transfer)) : undefined;
    }
    /**
     * Optional. Service message: video chat scheduled
     */
    get videoChatScheduled(): VideoChatScheduled | undefined {
        return this.raw.video_chat_scheduled ? (this._videoChatScheduled ??= new VideoChatScheduled(this.raw.video_chat_scheduled)) : undefined;
    }
    /**
     * Optional. Service message: video chat started
     */
    get videoChatStarted(): TelegramVideoChatStarted | undefined {
        return this.raw.video_chat_started;
    }
    /**
     * Optional. Service message: video chat ended
     */
    get videoChatEnded(): VideoChatEnded | undefined {
        return this.raw.video_chat_ended ? (this._videoChatEnded ??= new VideoChatEnded(this.raw.video_chat_ended)) : undefined;
    }
    /**
     * Optional. Service message: new participants invited to a video chat
     */
    get videoChatParticipantsInvited(): VideoChatParticipantsInvited | undefined {
        return this.raw.video_chat_participants_invited ? (this._videoChatParticipantsInvited ??= new VideoChatParticipantsInvited(this.raw.video_chat_participants_invited)) : undefined;
    }
    /**
     * Optional. Service message: data sent by a Web App
     */
    get webAppData(): WebAppData | undefined {
        return this.raw.web_app_data ? (this._webAppData ??= new WebAppData(this.raw.web_app_data)) : undefined;
    }
    /**
     * Optional. Inline keyboard attached to the message. login_url buttons are represented as ordinary url buttons.
     */
    get replyMarkup(): InlineKeyboardMarkup | undefined {
        return this.raw.reply_markup ? (this._replyMarkup ??= new InlineKeyboardMarkup(this.raw.reply_markup)) : undefined;
    }
    /**
     * true if `message_thread_id` is set
     */
    hasMessageThreadId(): this is this & {
        messageThreadId: number;
        thread: MessageThreadShortcuts;
    } {
        return this.raw.message_thread_id != null;
    }
    /**
     * true if `direct_messages_topic` is set
     */
    hasDirectMessagesTopic(): this is this & {
        directMessagesTopic: TelegramDirectMessagesTopic;
    } {
        return this.raw.direct_messages_topic != null;
    }
    /**
     * true if `from` is set
     */
    hasFrom(): this is this & {
        from: User;
    } {
        return this.raw.from != null;
    }
    /**
     * true if `sender_chat` is set
     */
    hasSenderChat(): this is this & {
        senderChat: Chat;
    } {
        return this.raw.sender_chat != null;
    }
    /**
     * true if `sender_boost_count` is set
     */
    hasSenderBoostCount(): this is this & {
        senderBoostCount: number;
    } {
        return this.raw.sender_boost_count != null;
    }
    /**
     * true if `sender_business_bot` is set
     */
    hasSenderBusinessBot(): this is this & {
        senderBusinessBot: User;
    } {
        return this.raw.sender_business_bot != null;
    }
    /**
     * true if `sender_tag` is set
     */
    hasSenderTag(): this is this & {
        senderTag: string;
    } {
        return this.raw.sender_tag != null;
    }
    /**
     * true if `receiver_user` is set
     */
    hasReceiverUser(): this is this & {
        receiverUser: User;
    } {
        return this.raw.receiver_user != null;
    }
    /**
     * true if `ephemeral_message_id` is set
     */
    hasEphemeralMessageId(): this is this & {
        ephemeralMessageId: number;
    } {
        return this.raw.ephemeral_message_id != null;
    }
    /**
     * true if `guest_query_id` is set
     */
    hasGuestQueryId(): this is this & {
        guestQueryId: string;
    } {
        return this.raw.guest_query_id != null;
    }
    /**
     * true if `business_connection_id` is set
     */
    hasBusinessConnectionId(): this is this & {
        businessConnectionId: string;
    } {
        return this.raw.business_connection_id != null;
    }
    /**
     * true if `forward_origin` is set
     */
    hasForwardOrigin(): this is this & {
        forwardOrigin: TelegramMessageOrigin;
    } {
        return this.raw.forward_origin != null;
    }
    /**
     * true if `external_reply` is set
     */
    hasExternalReply(): this is this & {
        externalReply: ExternalReplyInfo;
    } {
        return this.raw.external_reply != null;
    }
    /**
     * true if `quote` is set
     */
    hasQuote(): this is this & {
        quote: TextQuote;
    } {
        return this.raw.quote != null;
    }
    /**
     * true if `reply_to_story` is set
     */
    hasReplyToStory(): this is this & {
        replyToStory: Story;
    } {
        return this.raw.reply_to_story != null;
    }
    /**
     * true if `reply_to_checklist_task_id` is set
     */
    hasReplyToChecklistTaskId(): this is this & {
        replyToChecklistTaskId: number;
    } {
        return this.raw.reply_to_checklist_task_id != null;
    }
    /**
     * true if `reply_to_poll_option_id` is set
     */
    hasReplyToPollOptionId(): this is this & {
        replyToPollOptionId: string;
    } {
        return this.raw.reply_to_poll_option_id != null;
    }
    /**
     * true if `via_bot` is set
     */
    hasViaBot(): this is this & {
        viaBot: User;
    } {
        return this.raw.via_bot != null;
    }
    /**
     * true if `guest_bot_caller_user` is set
     */
    hasGuestBotCallerUser(): this is this & {
        guestBotCallerUser: User;
    } {
        return this.raw.guest_bot_caller_user != null;
    }
    /**
     * true if `guest_bot_caller_chat` is set
     */
    hasGuestBotCallerChat(): this is this & {
        guestBotCallerChat: Chat;
    } {
        return this.raw.guest_bot_caller_chat != null;
    }
    /**
     * true if `edit_date` is set
     */
    hasEditDate(): this is this & {
        editDate: number;
    } {
        return this.raw.edit_date != null;
    }
    /**
     * true if `media_group_id` is set
     */
    hasMediaGroupId(): this is this & {
        mediaGroupId: string;
    } {
        return this.raw.media_group_id != null;
    }
    /**
     * true if `author_signature` is set
     */
    hasAuthorSignature(): this is this & {
        authorSignature: string;
    } {
        return this.raw.author_signature != null;
    }
    /**
     * true if `paid_star_count` is set
     */
    hasPaidStarCount(): this is this & {
        paidStarCount: number;
    } {
        return this.raw.paid_star_count != null;
    }
    /**
     * true if `text` is set
     */
    hasText(): this is this & {
        text: string;
    } {
        return this.raw.text != null;
    }
    /**
     * true if `entities` has at least one item
     */
    hasEntities(): this is this & {
        entities: MessageEntity[];
    } {
        return this.raw.entities != null && this.raw.entities.length > 0;
    }
    /**
     * true if `link_preview_options` is set
     */
    hasLinkPreviewOptions(): this is this & {
        linkPreviewOptions: LinkPreviewOptions;
    } {
        return this.raw.link_preview_options != null;
    }
    /**
     * true if `suggested_post_info` is set
     */
    hasSuggestedPostInfo(): this is this & {
        suggestedPostInfo: TelegramSuggestedPostInfo;
    } {
        return this.raw.suggested_post_info != null;
    }
    /**
     * true if `effect_id` is set
     */
    hasEffectId(): this is this & {
        effectId: string;
    } {
        return this.raw.effect_id != null;
    }
    /**
     * true if `rich_message` is set
     */
    hasRichMessage(): this is this & {
        richMessage: TelegramRichMessage;
    } {
        return this.raw.rich_message != null;
    }
    /**
     * true if `animation` is set
     */
    hasAnimation(): this is this & {
        animation: Animation;
    } {
        return this.raw.animation != null;
    }
    /**
     * true if `audio` is set
     */
    hasAudio(): this is this & {
        audio: Audio;
    } {
        return this.raw.audio != null;
    }
    /**
     * true if `document` is set
     */
    hasDocument(): this is this & {
        document: Document;
    } {
        return this.raw.document != null;
    }
    /**
     * true if `live_photo` is set
     */
    hasLivePhoto(): this is this & {
        livePhoto: LivePhoto;
    } {
        return this.raw.live_photo != null;
    }
    /**
     * true if `paid_media` is set
     */
    hasPaidMedia(): this is this & {
        paidMedia: TelegramPaidMediaInfo;
    } {
        return this.raw.paid_media != null;
    }
    /**
     * true if `photo` has at least one item
     */
    hasPhoto(): this is this & {
        photo: Photo;
    } {
        return this.raw.photo != null && this.raw.photo.length > 0;
    }
    /**
     * true if `sticker` is set
     */
    hasSticker(): this is this & {
        sticker: Sticker;
    } {
        return this.raw.sticker != null;
    }
    /**
     * true if `story` is set
     */
    hasStory(): this is this & {
        story: Story;
    } {
        return this.raw.story != null;
    }
    /**
     * true if `video` is set
     */
    hasVideo(): this is this & {
        video: Video;
    } {
        return this.raw.video != null;
    }
    /**
     * true if `video_note` is set
     */
    hasVideoNote(): this is this & {
        videoNote: VideoNote;
    } {
        return this.raw.video_note != null;
    }
    /**
     * true if `voice` is set
     */
    hasVoice(): this is this & {
        voice: Voice;
    } {
        return this.raw.voice != null;
    }
    /**
     * true if `widget` is set
     */
    hasWidget(): this is this & {
        widget: Widget;
    } {
        return this.raw.widget != null;
    }
    /**
     * true if `caption` is set
     */
    hasCaption(): this is this & {
        caption: string;
    } {
        return this.raw.caption != null;
    }
    /**
     * true if `caption_entities` has at least one item
     */
    hasCaptionEntities(): this is this & {
        captionEntities: MessageEntity[];
    } {
        return this.raw.caption_entities != null && this.raw.caption_entities.length > 0;
    }
    /**
     * true if `show_caption_above_media` is set
     */
    hasShowCaptionAboveMedia(): this is this & {
        showCaptionAboveMedia: true;
    } {
        return this.raw.show_caption_above_media != null;
    }
    /**
     * true if `checklist` is set
     */
    hasChecklist(): this is this & {
        checklist: TelegramChecklist;
    } {
        return this.raw.checklist != null;
    }
    /**
     * true if `contact` is set
     */
    hasContact(): this is this & {
        contact: Contact;
    } {
        return this.raw.contact != null;
    }
    /**
     * true if `dice` is set
     */
    hasDice(): this is this & {
        dice: Dice;
    } {
        return this.raw.dice != null;
    }
    /**
     * true if `game` is set
     */
    hasGame(): this is this & {
        game: Game;
    } {
        return this.raw.game != null;
    }
    /**
     * true if `poll` is set
     */
    hasPoll(): this is this & {
        poll: Poll;
    } {
        return this.raw.poll != null;
    }
    /**
     * true if `venue` is set
     */
    hasVenue(): this is this & {
        venue: Venue;
    } {
        return this.raw.venue != null;
    }
    /**
     * true if `location` is set
     */
    hasLocation(): this is this & {
        location: Location;
    } {
        return this.raw.location != null;
    }
    /**
     * true if `new_chat_members` has at least one item
     */
    hasNewChatMembers(): this is this & {
        newChatMembers: User[];
    } {
        return this.raw.new_chat_members != null && this.raw.new_chat_members.length > 0;
    }
    /**
     * true if `left_chat_member` is set
     */
    hasLeftChatMember(): this is this & {
        leftChatMember: User;
    } {
        return this.raw.left_chat_member != null;
    }
    /**
     * true if `chat_owner_left` is set
     */
    hasChatOwnerLeft(): this is this & {
        chatOwnerLeft: TelegramChatOwnerLeft;
    } {
        return this.raw.chat_owner_left != null;
    }
    /**
     * true if `chat_owner_changed` is set
     */
    hasChatOwnerChanged(): this is this & {
        chatOwnerChanged: TelegramChatOwnerChanged;
    } {
        return this.raw.chat_owner_changed != null;
    }
    /**
     * true if `new_chat_title` is set
     */
    hasNewChatTitle(): this is this & {
        newChatTitle: string;
    } {
        return this.raw.new_chat_title != null;
    }
    /**
     * true if `new_chat_photo` has at least one item
     */
    hasNewChatPhoto(): this is this & {
        newChatPhoto: Photo;
    } {
        return this.raw.new_chat_photo != null && this.raw.new_chat_photo.length > 0;
    }
    /**
     * true if `delete_chat_photo` is set
     */
    hasDeleteChatPhoto(): this is this & {
        deleteChatPhoto: true;
    } {
        return this.raw.delete_chat_photo != null;
    }
    /**
     * true if `group_chat_created` is set
     */
    hasGroupChatCreated(): this is this & {
        groupChatCreated: true;
    } {
        return this.raw.group_chat_created != null;
    }
    /**
     * true if `supergroup_chat_created` is set
     */
    hasSupergroupChatCreated(): this is this & {
        supergroupChatCreated: true;
    } {
        return this.raw.supergroup_chat_created != null;
    }
    /**
     * true if `channel_chat_created` is set
     */
    hasChannelChatCreated(): this is this & {
        channelChatCreated: true;
    } {
        return this.raw.channel_chat_created != null;
    }
    /**
     * true if `message_auto_delete_timer_changed` is set
     */
    hasMessageAutoDeleteTimerChanged(): this is this & {
        messageAutoDeleteTimerChanged: TelegramMessageAutoDeleteTimerChanged;
    } {
        return this.raw.message_auto_delete_timer_changed != null;
    }
    /**
     * true if `migrate_to_chat_id` is set
     */
    hasMigrateToChatId(): this is this & {
        migrateToChatId: number;
    } {
        return this.raw.migrate_to_chat_id != null;
    }
    /**
     * true if `migrate_from_chat_id` is set
     */
    hasMigrateFromChatId(): this is this & {
        migrateFromChatId: number;
    } {
        return this.raw.migrate_from_chat_id != null;
    }
    /**
     * true if `pinned_message` is set
     */
    hasPinnedMessage(): this is this & {
        pinnedMessage: TelegramMaybeInaccessibleMessage;
    } {
        return this.raw.pinned_message != null;
    }
    /**
     * true if `invoice` is set
     */
    hasInvoice(): this is this & {
        invoice: Invoice;
    } {
        return this.raw.invoice != null;
    }
    /**
     * true if `successful_payment` is set
     */
    hasSuccessfulPayment(): this is this & {
        successfulPayment: SuccessfulPayment;
    } {
        return this.raw.successful_payment != null;
    }
    /**
     * true if `refunded_payment` is set
     */
    hasRefundedPayment(): this is this & {
        refundedPayment: TelegramRefundedPayment;
    } {
        return this.raw.refunded_payment != null;
    }
    /**
     * true if `users_shared` is set
     */
    hasUsersShared(): this is this & {
        usersShared: UsersShared;
    } {
        return this.raw.users_shared != null;
    }
    /**
     * true if `chat_shared` is set
     */
    hasChatShared(): this is this & {
        chatShared: ChatShared;
    } {
        return this.raw.chat_shared != null;
    }
    /**
     * true if `gift` is set
     */
    hasGift(): this is this & {
        gift: TelegramGiftInfo;
    } {
        return this.raw.gift != null;
    }
    /**
     * true if `unique_gift` is set
     */
    hasUniqueGift(): this is this & {
        uniqueGift: TelegramUniqueGiftInfo;
    } {
        return this.raw.unique_gift != null;
    }
    /**
     * true if `gift_upgrade_sent` is set
     */
    hasGiftUpgradeSent(): this is this & {
        giftUpgradeSent: TelegramGiftInfo;
    } {
        return this.raw.gift_upgrade_sent != null;
    }
    /**
     * true if `connected_website` is set
     */
    hasConnectedWebsite(): this is this & {
        connectedWebsite: string;
    } {
        return this.raw.connected_website != null;
    }
    /**
     * true if `write_access_allowed` is set
     */
    hasWriteAccessAllowed(): this is this & {
        writeAccessAllowed: WriteAccessAllowed;
    } {
        return this.raw.write_access_allowed != null;
    }
    /**
     * true if `passport_data` is set
     */
    hasPassportData(): this is this & {
        passportData: PassportData;
    } {
        return this.raw.passport_data != null;
    }
    /**
     * true if `proximity_alert_triggered` is set
     */
    hasProximityAlertTriggered(): this is this & {
        proximityAlertTriggered: ProximityAlertTriggered;
    } {
        return this.raw.proximity_alert_triggered != null;
    }
    /**
     * true if `boost_added` is set
     */
    hasBoostAdded(): this is this & {
        boostAdded: TelegramChatBoostAdded;
    } {
        return this.raw.boost_added != null;
    }
    /**
     * true if `chat_background_set` is set
     */
    hasChatBackgroundSet(): this is this & {
        chatBackgroundSet: TelegramChatBackground;
    } {
        return this.raw.chat_background_set != null;
    }
    /**
     * true if `checklist_tasks_done` is set
     */
    hasChecklistTasksDone(): this is this & {
        checklistTasksDone: TelegramChecklistTasksDone;
    } {
        return this.raw.checklist_tasks_done != null;
    }
    /**
     * true if `checklist_tasks_added` is set
     */
    hasChecklistTasksAdded(): this is this & {
        checklistTasksAdded: TelegramChecklistTasksAdded;
    } {
        return this.raw.checklist_tasks_added != null;
    }
    /**
     * true if `community_chat_added` is set
     */
    hasCommunityChatAdded(): this is this & {
        communityChatAdded: TelegramCommunityChatAdded;
    } {
        return this.raw.community_chat_added != null;
    }
    /**
     * true if `community_chat_joined` is set
     */
    hasCommunityChatJoined(): this is this & {
        communityChatJoined: TelegramCommunityChatJoined;
    } {
        return this.raw.community_chat_joined != null;
    }
    /**
     * true if `community_chat_removed` is set
     */
    hasCommunityChatRemoved(): this is this & {
        communityChatRemoved: TelegramCommunityChatRemoved;
    } {
        return this.raw.community_chat_removed != null;
    }
    /**
     * true if `direct_message_price_changed` is set
     */
    hasDirectMessagePriceChanged(): this is this & {
        directMessagePriceChanged: TelegramDirectMessagePriceChanged;
    } {
        return this.raw.direct_message_price_changed != null;
    }
    /**
     * true if `forum_topic_created` is set
     */
    hasForumTopicCreated(): this is this & {
        forumTopicCreated: ForumTopicCreated;
    } {
        return this.raw.forum_topic_created != null;
    }
    /**
     * true if `forum_topic_edited` is set
     */
    hasForumTopicEdited(): this is this & {
        forumTopicEdited: ForumTopicEdited;
    } {
        return this.raw.forum_topic_edited != null;
    }
    /**
     * true if `forum_topic_closed` is set
     */
    hasForumTopicClosed(): this is this & {
        forumTopicClosed: TelegramForumTopicClosed;
    } {
        return this.raw.forum_topic_closed != null;
    }
    /**
     * true if `forum_topic_reopened` is set
     */
    hasForumTopicReopened(): this is this & {
        forumTopicReopened: TelegramForumTopicReopened;
    } {
        return this.raw.forum_topic_reopened != null;
    }
    /**
     * true if `general_forum_topic_hidden` is set
     */
    hasGeneralForumTopicHidden(): this is this & {
        generalForumTopicHidden: TelegramGeneralForumTopicHidden;
    } {
        return this.raw.general_forum_topic_hidden != null;
    }
    /**
     * true if `general_forum_topic_unhidden` is set
     */
    hasGeneralForumTopicUnhidden(): this is this & {
        generalForumTopicUnhidden: TelegramGeneralForumTopicUnhidden;
    } {
        return this.raw.general_forum_topic_unhidden != null;
    }
    /**
     * true if `giveaway_created` is set
     */
    hasGiveawayCreated(): this is this & {
        giveawayCreated: TelegramGiveawayCreated;
    } {
        return this.raw.giveaway_created != null;
    }
    /**
     * true if `giveaway` is set
     */
    hasGiveaway(): this is this & {
        giveaway: Giveaway;
    } {
        return this.raw.giveaway != null;
    }
    /**
     * true if `giveaway_winners` is set
     */
    hasGiveawayWinners(): this is this & {
        giveawayWinners: GiveawayWinners;
    } {
        return this.raw.giveaway_winners != null;
    }
    /**
     * true if `giveaway_completed` is set
     */
    hasGiveawayCompleted(): this is this & {
        giveawayCompleted: GiveawayCompleted;
    } {
        return this.raw.giveaway_completed != null;
    }
    /**
     * true if `managed_bot_created` is set
     */
    hasManagedBotCreated(): this is this & {
        managedBotCreated: TelegramManagedBotCreated;
    } {
        return this.raw.managed_bot_created != null;
    }
    /**
     * true if `paid_message_price_changed` is set
     */
    hasPaidMessagePriceChanged(): this is this & {
        paidMessagePriceChanged: TelegramPaidMessagePriceChanged;
    } {
        return this.raw.paid_message_price_changed != null;
    }
    /**
     * true if `paid_messages_waived` is set
     */
    hasPaidMessagesWaived(): this is this & {
        paidMessagesWaived: PaidMessagesWaived;
    } {
        return this.raw.paid_messages_waived != null;
    }
    /**
     * true if `poll_option_added` is set
     */
    hasPollOptionAdded(): this is this & {
        pollOptionAdded: TelegramPollOptionAdded;
    } {
        return this.raw.poll_option_added != null;
    }
    /**
     * true if `poll_option_deleted` is set
     */
    hasPollOptionDeleted(): this is this & {
        pollOptionDeleted: TelegramPollOptionDeleted;
    } {
        return this.raw.poll_option_deleted != null;
    }
    /**
     * true if `suggested_post_approved` is set
     */
    hasSuggestedPostApproved(): this is this & {
        suggestedPostApproved: TelegramSuggestedPostApproved;
    } {
        return this.raw.suggested_post_approved != null;
    }
    /**
     * true if `suggested_post_approval_failed` is set
     */
    hasSuggestedPostApprovalFailed(): this is this & {
        suggestedPostApprovalFailed: TelegramSuggestedPostApprovalFailed;
    } {
        return this.raw.suggested_post_approval_failed != null;
    }
    /**
     * true if `suggested_post_declined` is set
     */
    hasSuggestedPostDeclined(): this is this & {
        suggestedPostDeclined: TelegramSuggestedPostDeclined;
    } {
        return this.raw.suggested_post_declined != null;
    }
    /**
     * true if `suggested_post_paid` is set
     */
    hasSuggestedPostPaid(): this is this & {
        suggestedPostPaid: TelegramSuggestedPostPaid;
    } {
        return this.raw.suggested_post_paid != null;
    }
    /**
     * true if `suggested_post_refunded` is set
     */
    hasSuggestedPostRefunded(): this is this & {
        suggestedPostRefunded: TelegramSuggestedPostRefunded;
    } {
        return this.raw.suggested_post_refunded != null;
    }
    /**
     * true if `ton_wallet_transfer` is set
     */
    hasTonWalletTransfer(): this is this & {
        tonWalletTransfer: TonWalletTransfer;
    } {
        return this.raw.ton_wallet_transfer != null;
    }
    /**
     * true if `video_chat_scheduled` is set
     */
    hasVideoChatScheduled(): this is this & {
        videoChatScheduled: VideoChatScheduled;
    } {
        return this.raw.video_chat_scheduled != null;
    }
    /**
     * true if `video_chat_started` is set
     */
    hasVideoChatStarted(): this is this & {
        videoChatStarted: TelegramVideoChatStarted;
    } {
        return this.raw.video_chat_started != null;
    }
    /**
     * true if `video_chat_ended` is set
     */
    hasVideoChatEnded(): this is this & {
        videoChatEnded: VideoChatEnded;
    } {
        return this.raw.video_chat_ended != null;
    }
    /**
     * true if `video_chat_participants_invited` is set
     */
    hasVideoChatParticipantsInvited(): this is this & {
        videoChatParticipantsInvited: VideoChatParticipantsInvited;
    } {
        return this.raw.video_chat_participants_invited != null;
    }
    /**
     * true if `web_app_data` is set
     */
    hasWebAppData(): this is this & {
        webAppData: WebAppData;
    } {
        return this.raw.web_app_data != null;
    }
    /**
     * true if `reply_markup` is set
     */
    hasReplyMarkup(): this is this & {
        replyMarkup: InlineKeyboardMarkup;
    } {
        return this.raw.reply_markup != null;
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    /**
     * shortcut for `chat.id`
     */
    get chatId(): number {
        return this.raw.chat.id;
    }
    /**
     * best-effort sender id: `from.id` → `sender_chat.id` → `chat.id`
     */
    get senderId(): number {
        return this.raw.from?.id ?? this.raw.sender_chat?.id ?? this.raw.chat.id;
    }
    /**
     * shortcut for `reply_to_message?.message_id`
     */
    get replyToMessageId(): number | undefined {
        return this.raw.reply_to_message?.message_id;
    }
    /**
     * deep-link payload after `/start` (`t.me/<bot>?start=<payload>`) — grounded in the `bot_command` entity telegram parsed, so text that merely looks like a command never matches, and a `/start@other_bot` addressed to a different bot yields `undefined` (mentions are checked against `tg.bot.username`). `undefined` when this is not a `/start` command or no payload was sent. see also `filters.start` (regex-based and mention-agnostic by design)
     */
    get startPayload(): string | undefined {
        const text = this.raw.text;
        const entity = this.raw.entities?.find(e => e.type === "bot_command" && e.offset === 0);
        if (text == null || entity == null || !Number.isInteger(entity.length) || entity.length <= 0) {
            return undefined;
        }
        const parts = text.slice(1, entity.length).split("@");
        if ((parts[0] ?? "").toLowerCase() !== "start") {
            return undefined;
        }
        const mention = parts[1];
        if (mention !== undefined) {
            const ours = this.tg.bot?.username;
            if (ours === undefined || mention.toLowerCase() !== ours.toLowerCase()) {
                return undefined;
            }
        }
        const payload = text.slice(entity.length).trim();
        return payload.length > 0 ? payload : undefined;
    }
    /**
     * true if this message has `reply_to_message`
     */
    hasReplyToMessage(): this is Has<this, "replyToMessage" | "replyToMessageId"> {
        return this.raw.reply_to_message != null;
    }
    /**
     * true if this message is a `/start` command carrying a deep-link payload
     */
    hasStartPayload(): this is Has<this, "startPayload"> {
        return this.startPayload !== undefined;
    }
    /**
     * true if any `entities` item has the given `type`
     */
    hasEntitiesOf(type: string): boolean {
        return this.raw.entities?.some(e => e.type === type) ?? false;
    }
    /**
     * true if any `caption_entities` item has the given `type`
     */
    hasCaptionEntitiesOf(type: string): boolean {
        return this.raw.caption_entities?.some(e => e.type === type) ?? false;
    }
    /**
     * alias for `hasForwardOrigin()`
     */
    isForwarded(): this is Has<this, "forwardOrigin"> {
        return this.raw.forward_origin != null;
    }
    /**
     * true if this message is a reply
     */
    isReply(): this is Has<this, "replyToMessage" | "replyToMessageId"> {
        return this.raw.reply_to_message != null;
    }
    /**
     * true if this message is ephemeral (visible only to one user and the bot). sends/replies from an ephemeral context auto-fill the ephemeral params — pass `ephemeral: false` to send a regular message instead
     */
    isEphemeral(): this is Has<this, "ephemeralMessageId"> {
        return this.raw.ephemeral_message_id != null;
    }
    /**
     * true if this message is part of a media group (album). use `await update.collectMediaGroup()` from `@puregram/flow` to fetch the full album
     */
    isMediaGroup(): boolean {
        return this.raw.media_group_id != null;
    }
    /**
     * true if `chat.type === "private"`
     */
    isPrivate(): boolean {
        return this.raw.chat.type === "private";
    }
    /**
     * true if `chat.type === "group"` (strict — supergroups excluded)
     */
    isGroup(): boolean {
        return this.raw.chat.type === "group";
    }
    /**
     * true if `chat.type === "supergroup"`
     */
    isSupergroup(): boolean {
        return this.raw.chat.type === "supergroup";
    }
    /**
     * true if `chat.type === "channel"`
     */
    isChannel(): boolean {
        return this.raw.chat.type === "channel";
    }
    /**
     * download the message attachment as a `Uint8Array`. returns `null` if the message has no media. auto-picks with priority `document > video > audio > voice > video_note > animation > live_photo > photo[largest] > sticker`
     */
    download(): Promise<Uint8Array | null> {
        const t = this.raw.document ?? this.raw.video ?? this.raw.audio ?? this.raw.voice ?? this.raw.video_note ?? this.raw.animation ?? this.raw.live_photo ?? this.raw.photo ?? this.raw.sticker;
        return t == null ? Promise.resolve(null) : this.tg.download(t);
    }
    /**
     * download the message attachment as a node `Readable`. returns `null` if no media
     */
    downloadStream(): Promise<Readable | null> {
        const t = this.raw.document ?? this.raw.video ?? this.raw.audio ?? this.raw.voice ?? this.raw.video_note ?? this.raw.animation ?? this.raw.live_photo ?? this.raw.photo ?? this.raw.sticker;
        return t == null ? Promise.resolve(null) : this.tg.downloadStream(t);
    }
    /**
     * download the message attachment as an async-iterable byte stream. returns `null` if no media
     */
    downloadIterable(): Promise<AsyncIterable<Uint8Array> | null> {
        const t = this.raw.document ?? this.raw.video ?? this.raw.audio ?? this.raw.voice ?? this.raw.video_note ?? this.raw.animation ?? this.raw.live_photo ?? this.raw.photo ?? this.raw.sticker;
        return t == null ? Promise.resolve(null) : this.tg.downloadIterable(t);
    }
    /**
     * download the message attachment to disk. returns `null` if no media; otherwise resolves once the file is fully written
     */
    downloadToFile(path: string): Promise<void | null> {
        const t = this.raw.document ?? this.raw.video ?? this.raw.audio ?? this.raw.voice ?? this.raw.video_note ?? this.raw.animation ?? this.raw.live_photo ?? this.raw.photo ?? this.raw.sticker;
        return t == null ? Promise.resolve(null) : this.tg.downloadToFile(path, t).then(() => undefined as void | null);
    }
    /**
     * create a controller that re-sends `sendChatAction(action)` every `interval` ms (default 5000) until `stop()` is called — telegram clears the action after ~5 seconds, so a long task needs it refreshed
     */
    createActionController(action: ActionControllerLike["action"], options?: ActionControllerParams): ActionControllerLike {
        return this.tg.createActionController(this.raw.chat.id, action, { ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }), ...options });
    }
    /**
     * run `fn` while continuously sending `sendChatAction(action)`. the action auto-stops when `fn` settles — even if it throws — and `fn`'s result is returned
     */
    withChatAction<T>(action: ActionControllerLike["action"], fn: () => Promise<T> | T, options?: ActionControllerParams): Promise<T> {
        return this.tg.withChatAction(this.raw.chat.id, action, fn, { ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }), ...options });
    }
    /**
     * react to this message — an emoji string for the common case, or a reaction array for custom / multiple
     */
    react(reaction: string | TelegramReactionType[], params?: Omit<SetMessageReactionParams, "chat_id" | "message_id" | "reaction">): Promise<true> {
        return this.tg.api.setMessageReaction({ chat_id: this.raw.chat.id, message_id: this.raw.message_id, reaction: typeof reaction === "string" ? [{ type: "emoji", emoji: reaction }] : reaction, ...params });
    }
    /**
     * edit this message to rich content (build it with @puregram/rich)
     */
    editRich(richMessage: TelegramInputRichMessage | RichLike, params?: Omit<EditMessageTextParams, "chat_id" | "message_id" | "rich_message" | "text">): Promise<TelegramMessage> {
        return this.tg.api.editMessageText({ chat_id: this.raw.chat.id, message_id: this.raw.message_id, rich_message: richMessage, ...params });
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    /**
     * shortcut for `tg.api.approveChatJoinRequest`
     */
    approveChatJoinRequest(user: number, params: {} = {}) {
        return this.tg.api.approveChatJoinRequest({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.approveSuggestedPost`
     */
    approveSuggestedPost(params: {
        send_date?: number;
    } = {}) {
        return this.tg.api.approveSuggestedPost({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.banChatMember`
     */
    banChatMember(user: number, params: {
        until_date?: number;
        revoke_messages?: boolean;
    } = {}) {
        return this.tg.api.banChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.banChatSenderChat`
     */
    banChatSenderChat(senderChat: number, params: {} = {}) {
        return this.tg.api.banChatSenderChat({
            chat_id: this.raw.chat.id,
            sender_chat_id: senderChat,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.closeForumTopic`
     */
    closeForumTopic(threadId: number, params: {} = {}) {
        return this.tg.api.closeForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.closeGeneralForumTopic`
     */
    closeGeneralForumTopic(params: {} = {}) {
        return this.tg.api.closeGeneralForumTopic({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.copyMessage`
     */
    copy(from: number | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        video_start_timestamp?: number;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.copyMessage({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            from_chat_id: from,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.copyMessages`
     */
    copyMany(from: number | string, messageIds: number[], params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        remove_caption?: boolean;
    } = {}) {
        return this.tg.api.copyMessages({
            chat_id: this.raw.chat.id,
            from_chat_id: from,
            message_ids: messageIds,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.createChatInviteLink`
     */
    createChatInviteLink(params: {
        name?: string;
        expire_date?: number;
        member_limit?: number;
        creates_join_request?: boolean;
    } = {}) {
        return this.tg.api.createChatInviteLink({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.createChatSubscriptionInviteLink`
     */
    createChatSubscriptionInviteLink(subscriptionPeriod: number, subscriptionPrice: number, params: {
        name?: string;
    } = {}) {
        return this.tg.api.createChatSubscriptionInviteLink({
            chat_id: this.raw.chat.id,
            subscription_period: subscriptionPeriod,
            subscription_price: subscriptionPrice,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.createForumTopic`
     */
    createForumTopic(name: string, params: {
        icon_color?: number;
        icon_custom_emoji_id?: string;
    } = {}) {
        return this.tg.api.createForumTopic({
            chat_id: this.raw.chat.id,
            name: name,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.declineChatJoinRequest`
     */
    declineChatJoinRequest(user: number, params: {} = {}) {
        return this.tg.api.declineChatJoinRequest({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.declineSuggestedPost`
     */
    declineSuggestedPost(params: {
        comment?: string;
    } = {}) {
        return this.tg.api.declineSuggestedPost({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteAllMessageReactions`
     */
    deleteAllMessageReactions(params: {
        user_id?: number;
        actor_chat_id?: number;
    } = {}) {
        return this.tg.api.deleteAllMessageReactions({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteChatPhoto`
     */
    deleteChatPhoto(params: {} = {}) {
        return this.tg.api.deleteChatPhoto({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteChatStickerSet`
     */
    deleteChatStickerSet(params: {} = {}) {
        return this.tg.api.deleteChatStickerSet({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteEphemeralMessage`
     */
    deleteEphemeralMessage(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
    }) {
        return this.tg.api.deleteEphemeralMessage({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteForumTopic`
     */
    deleteForumTopic(threadId: number, params: {} = {}) {
        return this.tg.api.deleteForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteMessage` — routes to `tg.api.deleteEphemeralMessage` when this message is ephemeral
     */
    delete(params: {} = {}) {
        const ephemeral = ephemeralTarget(this.raw);
        if (ephemeral != null) {
            return this.tg.api.deleteEphemeralMessage({
                ...ephemeral,
                ...params
            });
        }
        return this.tg.api.deleteMessage({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteMessageReaction`
     */
    deleteMessageReaction(params: {
        user_id?: number;
        actor_chat_id?: number;
    } = {}) {
        return this.tg.api.deleteMessageReaction({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteMessages`
     */
    deleteMany(messageIds: number[], params: {} = {}) {
        return this.tg.api.deleteMessages({
            chat_id: this.raw.chat.id,
            message_ids: messageIds,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editChatInviteLink`
     */
    editChatInviteLink(inviteLink: string, params: {
        name?: string;
        expire_date?: number;
        member_limit?: number;
        creates_join_request?: boolean;
    } = {}) {
        return this.tg.api.editChatInviteLink({
            chat_id: this.raw.chat.id,
            invite_link: inviteLink,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editChatSubscriptionInviteLink`
     */
    editChatSubscriptionInviteLink(inviteLink: string, params: {
        name?: string;
    } = {}) {
        return this.tg.api.editChatSubscriptionInviteLink({
            chat_id: this.raw.chat.id,
            invite_link: inviteLink,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editEphemeralMessageCaption`
     */
    editEphemeralMessageCaption(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.editEphemeralMessageCaption({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editEphemeralMessageMedia`
     */
    editEphemeralMessageMedia(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
        media: TelegramInputMedia;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.editEphemeralMessageMedia({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editEphemeralMessageReplyMarkup`
     */
    editEphemeralMessageReplyMarkup(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.editEphemeralMessageReplyMarkup({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editEphemeralMessageText`
     */
    editEphemeralMessageText(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
        text?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        rich_message?: TelegramInputRichMessage;
        link_preview_options?: TelegramLinkPreviewOptions;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.editEphemeralMessageText({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editForumTopic`
     */
    editForumTopic(threadId: number, params: {
        name?: string;
        icon_custom_emoji_id?: string;
    } = {}) {
        return this.tg.api.editForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editGeneralForumTopic`
     */
    editGeneralForumTopic(name: string, params: {} = {}) {
        return this.tg.api.editGeneralForumTopic({
            chat_id: this.raw.chat.id,
            name: name,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageCaption` — routes to `tg.api.editEphemeralMessageCaption` when this message is ephemeral
     */
    editCaption(params: {
        inline_message_id?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        const ephemeral = ephemeralTarget(this.raw);
        if (ephemeral != null) {
            return this.tg.api.editEphemeralMessageCaption({
                ...ephemeral,
                ...params
            });
        }
        return this.tg.api.editMessageCaption({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageChecklist`
     */
    editMessageChecklist(checklist: TelegramInputChecklist, params: {
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.editMessageChecklist({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            business_connection_id: this.raw.business_connection_id as NonNullable<typeof this.raw.business_connection_id>,
            checklist: checklist,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageLiveLocation`
     */
    editLiveLocation(latitude: number, longitude: number, params: {
        inline_message_id?: string;
        live_period?: number;
        horizontal_accuracy?: number;
        heading?: number;
        proximity_alert_radius?: number;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.editMessageLiveLocation({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            latitude: latitude,
            longitude: longitude,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageMedia` — routes to `tg.api.editEphemeralMessageMedia` when this message is ephemeral
     */
    editMedia(media: TelegramInputMedia, params: {
        inline_message_id?: string;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        const ephemeral = ephemeralTarget(this.raw);
        if (ephemeral != null) {
            return this.tg.api.editEphemeralMessageMedia({
                ...ephemeral,
                media: media,
                ...params
            });
        }
        return this.tg.api.editMessageMedia({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            media: media,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageReplyMarkup` — routes to `tg.api.editEphemeralMessageReplyMarkup` when this message is ephemeral
     */
    editReplyMarkup(params: {
        inline_message_id?: string;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        const ephemeral = ephemeralTarget(this.raw);
        if (ephemeral != null) {
            return this.tg.api.editEphemeralMessageReplyMarkup({
                ...ephemeral,
                ...params
            });
        }
        return this.tg.api.editMessageReplyMarkup({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageText` — routes to `tg.api.editEphemeralMessageText` when this message is ephemeral
     */
    edit(text: string | Formattable, params: {
        inline_message_id?: string;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        link_preview_options?: TelegramLinkPreviewOptions;
        rich_message?: TelegramInputRichMessage;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        const ephemeral = ephemeralTarget(this.raw);
        if (ephemeral != null) {
            return this.tg.api.editEphemeralMessageText({
                ...ephemeral,
                text: text,
                ...params
            });
        }
        return this.tg.api.editMessageText({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageWidgetData`
     */
    editWidgetData(params: {
        inline_message_id?: string;
        public_data?: string;
        chat_data?: string;
    } = {}) {
        return this.tg.api.editMessageWidgetData({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.exportChatInviteLink`
     */
    exportChatInviteLink(params: {} = {}) {
        return this.tg.api.exportChatInviteLink({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.forwardMessage`
     */
    forward(from: number | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        video_start_timestamp?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
    } = {}) {
        return this.tg.api.forwardMessage({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            from_chat_id: from,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.forwardMessages`
     */
    forwardMany(from: number | string, messageIds: number[], params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
    } = {}) {
        return this.tg.api.forwardMessages({
            chat_id: this.raw.chat.id,
            from_chat_id: from,
            message_ids: messageIds,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChat`
     */
    getChat(params: {} = {}) {
        return this.tg.api.getChat({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatAdministrators`
     */
    getChatAdministrators(params: {
        return_bots?: boolean;
    } = {}) {
        return this.tg.api.getChatAdministrators({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatGifts`
     */
    getChatGifts(params: {
        exclude_unsaved?: boolean;
        exclude_saved?: boolean;
        exclude_unlimited?: boolean;
        exclude_limited_upgradable?: boolean;
        exclude_limited_non_upgradable?: boolean;
        exclude_from_blockchain?: boolean;
        exclude_unique?: boolean;
        sort_by_price?: boolean;
        offset?: string;
        limit?: number;
    } = {}) {
        return this.tg.api.getChatGifts({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatMember`
     */
    getChatMember(user: number, params: {} = {}) {
        return this.tg.api.getChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatMemberCount`
     */
    getChatMemberCount(params: {} = {}) {
        return this.tg.api.getChatMemberCount({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatMenuButton`
     */
    getChatMenuButton(params: {} = {}) {
        return this.tg.api.getChatMenuButton({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getGameHighScores`
     */
    getGameHighScores(user: number, params: {
        inline_message_id?: string;
    } = {}) {
        return this.tg.api.getGameHighScores({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getUserChatBoosts`
     */
    getUserChatBoosts(user: number, params: {} = {}) {
        return this.tg.api.getUserChatBoosts({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.hideGeneralForumTopic`
     */
    hideGeneralForumTopic(params: {} = {}) {
        return this.tg.api.hideGeneralForumTopic({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.leaveChat`
     */
    leaveChat(params: {} = {}) {
        return this.tg.api.leaveChat({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.pinChatMessage`
     */
    pin(params: {
        disable_notification?: boolean;
    } = {}) {
        return this.tg.api.pinChatMessage({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            ...params
        });
    }
    /**
     * shortcut for `tg.api.promoteChatMember`
     */
    promoteChatMember(user: number, params: {
        is_anonymous?: boolean;
        can_manage_chat?: boolean;
        can_delete_messages?: boolean;
        can_manage_video_chats?: boolean;
        can_restrict_members?: boolean;
        can_promote_members?: boolean;
        can_change_info?: boolean;
        can_invite_users?: boolean;
        can_post_stories?: boolean;
        can_edit_stories?: boolean;
        can_delete_stories?: boolean;
        can_post_messages?: boolean;
        can_edit_messages?: boolean;
        can_pin_messages?: boolean;
        can_manage_topics?: boolean;
        can_manage_direct_messages?: boolean;
        can_manage_tags?: boolean;
        can_send_welcome_messages?: boolean;
    } = {}) {
        return this.tg.api.promoteChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.readBusinessMessage`
     */
    readBusinessMessage(params: {} = {}) {
        return this.tg.api.readBusinessMessage({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            business_connection_id: this.raw.business_connection_id as NonNullable<typeof this.raw.business_connection_id>,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.removeChatVerification`
     */
    removeChatVerification(params: {} = {}) {
        return this.tg.api.removeChatVerification({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.reopenForumTopic`
     */
    reopenForumTopic(threadId: number, params: {} = {}) {
        return this.tg.api.reopenForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.reopenGeneralForumTopic`
     */
    reopenGeneralForumTopic(params: {} = {}) {
        return this.tg.api.reopenGeneralForumTopic({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.restrictChatMember`
     */
    restrictChatMember(user: number, permissions: TelegramChatPermissions, params: {
        use_independent_chat_permissions?: boolean;
        until_date?: number;
    } = {}) {
        return this.tg.api.restrictChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            permissions: permissions,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.revokeChatInviteLink`
     */
    revokeChatInviteLink(inviteLink: string, params: {} = {}) {
        return this.tg.api.revokeChatInviteLink({
            chat_id: this.raw.chat.id,
            invite_link: inviteLink,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendAnimation` — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    sendAnimation(animation: TelegramInputFile | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        width?: number;
        height?: number;
        thumbnail?: TelegramInputFile | string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendAnimation({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            animation: animation,
            ...params,
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * reply shortcut for `tg.api.sendAnimation` — sets `reply_parameters` to this message — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    replyWithAnimation(animation: TelegramInputFile | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        width?: number;
        height?: number;
        thumbnail?: TelegramInputFile | string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendAnimation({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            animation: animation,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters },
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * shortcut for `tg.api.sendAudio` — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    sendAudio(audio: TelegramInputFile | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        duration?: number;
        performer?: string;
        title?: string;
        thumbnail?: TelegramInputFile | string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendAudio({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            audio: audio,
            ...params,
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * reply shortcut for `tg.api.sendAudio` — sets `reply_parameters` to this message — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    replyWithAudio(audio: TelegramInputFile | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        duration?: number;
        performer?: string;
        title?: string;
        thumbnail?: TelegramInputFile | string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendAudio({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            audio: audio,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters },
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * shortcut for `tg.api.sendChatAction`
     */
    sendChatAction(action: string, params: {
        message_thread_id?: number;
    } = {}) {
        return this.tg.api.sendChatAction({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            action: action,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendChecklist`
     */
    sendChecklist(checklist: TelegramInputChecklist, params: {
        disable_notification?: boolean;
        protect_content?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.sendChecklist({
            chat_id: this.raw.chat.id,
            business_connection_id: this.raw.business_connection_id as NonNullable<typeof this.raw.business_connection_id>,
            checklist: checklist,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendChecklist` — sets `reply_parameters` to this message
     */
    replyWithChecklist(checklist: TelegramInputChecklist, params: {
        disable_notification?: boolean;
        protect_content?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.sendChecklist({
            chat_id: this.raw.chat.id,
            business_connection_id: this.raw.business_connection_id as NonNullable<typeof this.raw.business_connection_id>,
            checklist: checklist,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendContact` — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    sendContact(phoneNumber: string, firstName: string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        last_name?: string;
        vcard?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendContact({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            phone_number: phoneNumber,
            first_name: firstName,
            ...params,
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * reply shortcut for `tg.api.sendContact` — sets `reply_parameters` to this message — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    replyWithContact(phoneNumber: string, firstName: string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        last_name?: string;
        vcard?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendContact({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            phone_number: phoneNumber,
            first_name: firstName,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters },
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * shortcut for `tg.api.sendDice`
     */
    sendDice(params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        emoji?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendDice({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendDice` — sets `reply_parameters` to this message
     */
    replyWithDice(params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        emoji?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendDice({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendDocument` — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    sendDocument(document: TelegramInputFile | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        thumbnail?: TelegramInputFile | string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        disable_content_type_detection?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendDocument({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            document: document,
            ...params,
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * reply shortcut for `tg.api.sendDocument` — sets `reply_parameters` to this message — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    replyWithDocument(document: TelegramInputFile | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        thumbnail?: TelegramInputFile | string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        disable_content_type_detection?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendDocument({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            document: document,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters },
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * shortcut for `tg.api.sendGame`
     */
    sendGame(gameShortName: string, params: {
        message_thread_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.sendGame({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            game_short_name: gameShortName,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendGame` — sets `reply_parameters` to this message
     */
    replyWithGame(gameShortName: string, params: {
        message_thread_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.sendGame({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            game_short_name: gameShortName,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendGift`
     */
    sendGift(giftId: string, params: {
        user_id?: number;
        pay_for_upgrade?: boolean;
        text?: string | Formattable;
        text_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        text_entities?: TelegramMessageEntity[];
    } = {}) {
        return this.tg.api.sendGift({
            chat_id: this.raw.chat.id,
            gift_id: giftId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendInvoice`
     */
    sendInvoice(params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        title: string;
        description: string;
        payload: string;
        provider_token?: string;
        currency: string;
        prices: TelegramLabeledPrice[];
        max_tip_amount?: number;
        suggested_tip_amounts?: number[];
        start_parameter?: string;
        provider_data?: string;
        photo_url?: string;
        photo_size?: number;
        photo_width?: number;
        photo_height?: number;
        need_name?: boolean;
        need_phone_number?: boolean;
        need_email?: boolean;
        need_shipping_address?: boolean;
        send_phone_number_to_provider?: boolean;
        send_email_to_provider?: boolean;
        is_flexible?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.sendInvoice({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendInvoice` — sets `reply_parameters` to this message
     */
    replyWithInvoice(params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        title: string;
        description: string;
        payload: string;
        provider_token?: string;
        currency: string;
        prices: TelegramLabeledPrice[];
        max_tip_amount?: number;
        suggested_tip_amounts?: number[];
        start_parameter?: string;
        provider_data?: string;
        photo_url?: string;
        photo_size?: number;
        photo_width?: number;
        photo_height?: number;
        need_name?: boolean;
        need_phone_number?: boolean;
        need_email?: boolean;
        need_shipping_address?: boolean;
        send_phone_number_to_provider?: boolean;
        send_email_to_provider?: boolean;
        is_flexible?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.sendInvoice({
            chat_id: this.raw.chat.id,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendLivePhoto` — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    sendLivePhoto(livePhoto: TelegramInputFile | string, photo: TelegramInputFile | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendLivePhoto({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            live_photo: livePhoto,
            photo: photo,
            ...params,
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * reply shortcut for `tg.api.sendLivePhoto` — sets `reply_parameters` to this message — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    replyWithLivePhoto(livePhoto: TelegramInputFile | string, photo: TelegramInputFile | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendLivePhoto({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            live_photo: livePhoto,
            photo: photo,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters },
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * shortcut for `tg.api.sendLocation` — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    sendLocation(latitude: number, longitude: number, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        horizontal_accuracy?: number;
        live_period?: number;
        heading?: number;
        proximity_alert_radius?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendLocation({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            latitude: latitude,
            longitude: longitude,
            ...params,
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * reply shortcut for `tg.api.sendLocation` — sets `reply_parameters` to this message — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    replyWithLocation(latitude: number, longitude: number, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        horizontal_accuracy?: number;
        live_period?: number;
        heading?: number;
        proximity_alert_radius?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendLocation({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            latitude: latitude,
            longitude: longitude,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters },
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * shortcut for `tg.api.sendMediaGroup`
     */
    sendMediaGroup(media: (TelegramInputMediaAudio | TelegramInputMediaDocument | TelegramInputMediaLivePhoto | TelegramInputMediaPhoto | TelegramInputMediaVideo)[], params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
    } = {}) {
        return this.tg.api.sendMediaGroup({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            media: media,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendMediaGroup` — sets `reply_parameters` to this message
     */
    replyWithMediaGroup(media: (TelegramInputMediaAudio | TelegramInputMediaDocument | TelegramInputMediaLivePhoto | TelegramInputMediaPhoto | TelegramInputMediaVideo)[], params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
    } = {}) {
        return this.tg.api.sendMediaGroup({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            media: media,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendMessage` — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    send(text: string | Formattable, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        link_preview_options?: TelegramLinkPreviewOptions;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendMessage({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            text: text,
            ...params,
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * reply shortcut for `tg.api.sendMessage` — sets `reply_parameters` to this message — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    reply(text: string | Formattable, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        link_preview_options?: TelegramLinkPreviewOptions;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendMessage({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            text: text,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters },
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * shortcut for `tg.api.sendMessageDraft`
     */
    sendMessageDraft(draftId: number, text: string | Formattable, params: {
        message_thread_id?: number;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendMessageDraft({
            chat_id: this.raw.chat.id,
            draft_id: draftId,
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendPaidMedia`
     */
    sendPaidMedia(starCount: number, media: TelegramInputPaidMedia[], params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        payload?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPaidMedia({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            star_count: starCount,
            media: media,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendPaidMedia` — sets `reply_parameters` to this message
     */
    replyWithPaidMedia(starCount: number, media: TelegramInputPaidMedia[], params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        payload?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPaidMedia({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            star_count: starCount,
            media: media,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendPhoto` — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    sendPhoto(photo: TelegramInputFile | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendPhoto({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            photo: photo,
            ...params,
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * reply shortcut for `tg.api.sendPhoto` — sets `reply_parameters` to this message — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    replyWithPhoto(photo: TelegramInputFile | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendPhoto({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            photo: photo,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters },
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * shortcut for `tg.api.sendPoll`
     */
    sendPoll(question: string | Formattable, options: TelegramInputPollOption[], params: {
        message_thread_id?: number;
        question_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        question_entities?: TelegramMessageEntity[];
        is_anonymous?: boolean;
        type?: string;
        allows_multiple_answers?: boolean;
        allows_revoting?: boolean;
        shuffle_options?: boolean;
        allow_adding_options?: boolean;
        hide_results_until_closes?: boolean;
        members_only?: boolean;
        country_codes?: string[];
        correct_option_ids?: number[];
        explanation?: string | Formattable;
        explanation_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        explanation_entities?: TelegramMessageEntity[];
        explanation_media?: TelegramInputPollMedia;
        open_period?: number;
        close_date?: number;
        is_closed?: boolean;
        description?: string | Formattable;
        description_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        description_entities?: TelegramMessageEntity[];
        media?: TelegramInputPollMedia;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPoll({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            question: question,
            options: options,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendPoll` — sets `reply_parameters` to this message
     */
    replyWithPoll(question: string | Formattable, options: TelegramInputPollOption[], params: {
        message_thread_id?: number;
        question_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        question_entities?: TelegramMessageEntity[];
        is_anonymous?: boolean;
        type?: string;
        allows_multiple_answers?: boolean;
        allows_revoting?: boolean;
        shuffle_options?: boolean;
        allow_adding_options?: boolean;
        hide_results_until_closes?: boolean;
        members_only?: boolean;
        country_codes?: string[];
        correct_option_ids?: number[];
        explanation?: string | Formattable;
        explanation_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        explanation_entities?: TelegramMessageEntity[];
        explanation_media?: TelegramInputPollMedia;
        open_period?: number;
        close_date?: number;
        is_closed?: boolean;
        description?: string | Formattable;
        description_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        description_entities?: TelegramMessageEntity[];
        media?: TelegramInputPollMedia;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPoll({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            question: question,
            options: options,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessage` — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    sendRichMessage(richMessage: TelegramInputRichMessage | RichLike, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendRichMessage({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            rich_message: richMessage,
            ...params,
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * reply shortcut for `tg.api.sendRichMessage` — sets `reply_parameters` to this message — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    replyWithRichMessage(richMessage: TelegramInputRichMessage | RichLike, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendRichMessage({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            rich_message: richMessage,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters },
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessageDraft`
     */
    sendRichMessageDraft(draftId: number, richMessage: TelegramInputRichMessage | RichLike, params: {
        message_thread_id?: number;
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendRichMessageDraft({
            chat_id: this.raw.chat.id,
            draft_id: draftId,
            rich_message: richMessage,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendSharedWidget`
     */
    sendSharedWidget(widgetId: string, params: {
        message_thread_id?: number;
        chat_data?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendSharedWidget({
            chat_id: this.raw.chat.id,
            widget_id: widgetId,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendSharedWidget` — sets `reply_parameters` to this message
     */
    replyWithSharedWidget(widgetId: string, params: {
        message_thread_id?: number;
        chat_data?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendSharedWidget({
            chat_id: this.raw.chat.id,
            widget_id: widgetId,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.sendSticker` — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    sendSticker(sticker: TelegramInputFile | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        emoji?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendSticker({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            sticker: sticker,
            ...params,
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * reply shortcut for `tg.api.sendSticker` — sets `reply_parameters` to this message — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    replyWithSticker(sticker: TelegramInputFile | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        emoji?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendSticker({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            sticker: sticker,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters },
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * shortcut for `tg.api.sendVenue` — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    sendVenue(latitude: number, longitude: number, title: string, address: string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        foursquare_id?: string;
        foursquare_type?: string;
        google_place_id?: string;
        google_place_type?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendVenue({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            latitude: latitude,
            longitude: longitude,
            title: title,
            address: address,
            ...params,
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * reply shortcut for `tg.api.sendVenue` — sets `reply_parameters` to this message — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    replyWithVenue(latitude: number, longitude: number, title: string, address: string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        foursquare_id?: string;
        foursquare_type?: string;
        google_place_id?: string;
        google_place_type?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendVenue({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            latitude: latitude,
            longitude: longitude,
            title: title,
            address: address,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters },
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * shortcut for `tg.api.sendVideo` — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    sendVideo(video: TelegramInputFile | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        width?: number;
        height?: number;
        thumbnail?: TelegramInputFile | string;
        cover?: TelegramInputFile | string;
        start_timestamp?: number;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        supports_streaming?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendVideo({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            video: video,
            ...params,
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * reply shortcut for `tg.api.sendVideo` — sets `reply_parameters` to this message — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    replyWithVideo(video: TelegramInputFile | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        width?: number;
        height?: number;
        thumbnail?: TelegramInputFile | string;
        cover?: TelegramInputFile | string;
        start_timestamp?: number;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        supports_streaming?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendVideo({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            video: video,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters },
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * shortcut for `tg.api.sendVideoNote` — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    sendVideoNote(videoNote: TelegramInputFile | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        length?: number;
        thumbnail?: TelegramInputFile | string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendVideoNote({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            video_note: videoNote,
            ...params,
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * reply shortcut for `tg.api.sendVideoNote` — sets `reply_parameters` to this message — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    replyWithVideoNote(videoNote: TelegramInputFile | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        length?: number;
        thumbnail?: TelegramInputFile | string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendVideoNote({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            video_note: videoNote,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters },
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * shortcut for `tg.api.sendVoice` — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    sendVoice(voice: TelegramInputFile | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        duration?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendVoice({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            voice: voice,
            ...params,
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * reply shortcut for `tg.api.sendVoice` — sets `reply_parameters` to this message — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    replyWithVoice(voice: TelegramInputFile | string, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        duration?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendVoice({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            voice: voice,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters },
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * shortcut for `tg.api.sendWidget`
     */
    sendWidget(html: string, params: {
        message_thread_id?: number;
        width?: number;
        height?: number;
        public_data?: string;
        chat_data?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        allow_queries?: boolean;
        is_shared?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendWidget({
            chat_id: this.raw.chat.id,
            html: html,
            ...params
        });
    }
    /**
     * reply shortcut for `tg.api.sendWidget` — sets `reply_parameters` to this message
     */
    replyWithWidget(html: string, params: {
        message_thread_id?: number;
        width?: number;
        height?: number;
        public_data?: string;
        chat_data?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        allow_queries?: boolean;
        is_shared?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendWidget({
            chat_id: this.raw.chat.id,
            html: html,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters }
        });
    }
    /**
     * shortcut for `tg.api.setChatAdministratorCustomTitle`
     */
    setChatAdministratorCustomTitle(user: number, customTitle: string, params: {} = {}) {
        return this.tg.api.setChatAdministratorCustomTitle({
            chat_id: this.raw.chat.id,
            user_id: user,
            custom_title: customTitle,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatDescription`
     */
    setChatDescription(params: {
        description?: string;
    } = {}) {
        return this.tg.api.setChatDescription({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatMemberTag`
     */
    setChatMemberTag(user: number, params: {
        tag?: string;
    } = {}) {
        return this.tg.api.setChatMemberTag({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatMenuButton`
     */
    setChatMenuButton(params: {
        menu_button?: TelegramMenuButton;
    } = {}) {
        return this.tg.api.setChatMenuButton({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatPermissions`
     */
    setChatPermissions(permissions: TelegramChatPermissions, params: {
        use_independent_chat_permissions?: boolean;
    } = {}) {
        return this.tg.api.setChatPermissions({
            chat_id: this.raw.chat.id,
            permissions: permissions,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatPhoto`
     */
    setChatPhoto(photo: TelegramInputFile, params: {} = {}) {
        return this.tg.api.setChatPhoto({
            chat_id: this.raw.chat.id,
            photo: photo,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatStickerSet`
     */
    setChatStickerSet(stickerSetName: string, params: {} = {}) {
        return this.tg.api.setChatStickerSet({
            chat_id: this.raw.chat.id,
            sticker_set_name: stickerSetName,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatTitle`
     */
    setChatTitle(title: string, params: {} = {}) {
        return this.tg.api.setChatTitle({
            chat_id: this.raw.chat.id,
            title: title,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setGameScore`
     */
    setGameScore(user: number, score: number, params: {
        force?: boolean;
        disable_edit_message?: boolean;
        inline_message_id?: string;
    } = {}) {
        return this.tg.api.setGameScore({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            user_id: user,
            score: score,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setMessageReaction`
     */
    setMessageReaction(reactions: TelegramReactionType[], params: {
        is_big?: boolean;
    } = {}) {
        return this.tg.api.setMessageReaction({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            reaction: reactions,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.stopMessageLiveLocation`
     */
    stopLiveLocation(params: {
        inline_message_id?: string;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.stopMessageLiveLocation({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            ...params
        });
    }
    /**
     * shortcut for `tg.api.stopPoll`
     */
    stopPoll(params: {
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.stopPoll({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unbanChatMember`
     */
    unbanChatMember(user: number, params: {
        only_if_banned?: boolean;
    } = {}) {
        return this.tg.api.unbanChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unbanChatSenderChat`
     */
    unbanChatSenderChat(senderChat: number, params: {} = {}) {
        return this.tg.api.unbanChatSenderChat({
            chat_id: this.raw.chat.id,
            sender_chat_id: senderChat,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unhideGeneralForumTopic`
     */
    unhideGeneralForumTopic(params: {} = {}) {
        return this.tg.api.unhideGeneralForumTopic({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unpinAllChatMessages`
     */
    unpinAllChatMessages(params: {} = {}) {
        return this.tg.api.unpinAllChatMessages({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unpinAllForumTopicMessages`
     */
    unpinAllForumTopicMessages(threadId: number, params: {} = {}) {
        return this.tg.api.unpinAllForumTopicMessages({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unpinAllGeneralForumTopicMessages`
     */
    unpinAllGeneralForumTopicMessages(params: {} = {}) {
        return this.tg.api.unpinAllGeneralForumTopicMessages({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unpinChatMessage`
     */
    unpin(params: {} = {}) {
        return this.tg.api.unpinChatMessage({
            chat_id: this.raw.chat.id,
            message_id: this.raw.message_id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            ...params
        });
    }
    /**
     * shortcut for `tg.api.verifyChat`
     */
    verifyChat(params: {
        custom_description?: string | Formattable;
        custom_description_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        custom_description_entities?: TelegramMessageEntity[];
    } = {}) {
        return this.tg.api.verifyChat({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendMessageDraft`
     */
    sendDraft(draftId: number, text: string | Formattable, params: {
        message_thread_id?: number;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendMessageDraft({
            chat_id: this.raw.chat.id,
            draft_id: draftId,
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessage` — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    sendRich(richMessage: TelegramInputRichMessage | RichLike, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendRichMessage({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            rich_message: richMessage,
            ...params,
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * reply shortcut for `tg.api.sendRichMessage` — sets `reply_parameters` to this message — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)
     */
    replyWithRich(richMessage: TelegramInputRichMessage | RichLike, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
        ephemeral?: boolean;
    } = {}) {
        return this.tg.api.sendRichMessage({
            chat_id: this.raw.chat.id,
            ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }),
            rich_message: richMessage,
            ...params,
            reply_parameters: { message_id: this.raw.message_id, ...params.reply_parameters },
            ...ephemeralSendParams(this.raw, params)
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessageDraft`
     */
    sendRichDraft(draftId: number, richMessage: TelegramInputRichMessage | RichLike, params: {
        message_thread_id?: number;
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendRichMessageDraft({
            chat_id: this.raw.chat.id,
            draft_id: draftId,
            rich_message: richMessage,
            ...params
        });
    }
    /**
     * thread-scoped shortcuts — auto-fill `message_thread_id` on every call. `undefined` when this message is not in a thread / forum topic
     */
    get thread(): MessageThreadShortcuts | undefined {
        return this.raw.message_thread_id == null ? undefined : new MessageThreadShortcuts(this.raw, this.tg);
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect(this.constructor.name, this, depth, options, inspect);
    }
}

/**
 * update for the `message` event
 */
export class MessageUpdate extends MessageShared {
    readonly kind = "message" as const;
    private __brand!: never;
}

/**
 * update for the `edited_message` event
 */
export class EditedMessageUpdate extends MessageShared {
    readonly kind = "edited_message" as const;
    private __brand!: never;
}

/**
 * update for the `channel_post` event
 */
export class ChannelPostUpdate extends MessageShared {
    readonly kind = "channel_post" as const;
    private __brand!: never;
}

/**
 * update for the `edited_channel_post` event
 */
export class EditedChannelPostUpdate extends MessageShared {
    readonly kind = "edited_channel_post" as const;
    private __brand!: never;
}

/**
 * update for the `business_connection` event
 */
export class BusinessConnectionUpdate {
    readonly kind = "business_connection" as const;
    private _user?: User;
    constructor(public raw: TelegramBusinessConnection, public readonly tg: TelegramLike) { }
    /**
     * Unique identifier of the business connection
     */
    get id(): string {
        return this.raw.id;
    }
    /**
     * Business account user that created the business connection
     */
    get user(): User {
        return this._user ??= new User(this.raw.user);
    }
    /**
     * Identifier of a private chat with the user who created the business connection. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.
     */
    get userChatId(): number {
        return this.raw.user_chat_id;
    }
    /**
     * Date the connection was established in Unix time
     */
    get date(): number {
        return this.raw.date;
    }
    /**
     * Optional. Rights of the business bot
     */
    get rights(): TelegramBusinessBotRights | undefined {
        return this.raw.rights;
    }
    /**
     * True, if the connection is active
     */
    get isEnabled(): boolean {
        return this.raw.is_enabled;
    }
    /**
     * true if `rights` is set
     */
    hasRights(): this is this & {
        rights: TelegramBusinessBotRights;
    } {
        return this.raw.rights != null;
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    /**
     * shortcut for `user.id` — uniform sender id across update kinds
     */
    get senderId(): number {
        return this.raw.user.id;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("BusinessConnectionUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `business_message` event
 */
export class BusinessMessageUpdate extends MessageShared {
    readonly kind = "business_message" as const;
    private __brand!: never;
}

/**
 * update for the `edited_business_message` event
 */
export class EditedBusinessMessageUpdate extends MessageShared {
    readonly kind = "edited_business_message" as const;
    private __brand!: never;
}

/**
 * update for the `deleted_business_messages` event
 */
export class DeletedBusinessMessagesUpdate {
    readonly kind = "deleted_business_messages" as const;
    private _chat?: Chat;
    constructor(public raw: TelegramBusinessMessagesDeleted, public readonly tg: TelegramLike) { }
    /**
     * Unique identifier of the business connection
     */
    get businessConnectionId(): string {
        return this.raw.business_connection_id;
    }
    /**
     * Information about a chat in the business account. The bot may not have access to the chat or the corresponding user.
     */
    get chat(): Chat {
        return this._chat ??= new Chat(this.raw.chat);
    }
    /**
     * The list of identifiers of deleted messages in the chat of the business account
     */
    get messageIds(): number[] {
        return this.raw.message_ids;
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("DeletedBusinessMessagesUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `guest_message` event
 */
export class GuestMessageUpdate {
    readonly kind = "guest_message" as const;
    private _from?: User;
    private _senderChat?: Chat;
    private _senderBusinessBot?: User;
    private _receiverUser?: User;
    private _chat?: Chat;
    private _replyToMessage?: Message;
    private _externalReply?: ExternalReplyInfo;
    private _quote?: TextQuote;
    private _replyToStory?: Story;
    private _viaBot?: User;
    private _guestBotCallerUser?: User;
    private _guestBotCallerChat?: Chat;
    private _entities?: MessageEntity[];
    private _linkPreviewOptions?: LinkPreviewOptions;
    private _animation?: Animation;
    private _audio?: Audio;
    private _document?: Document;
    private _livePhoto?: LivePhoto;
    private _photo?: Photo;
    private _sticker?: Sticker;
    private _story?: Story;
    private _video?: Video;
    private _videoNote?: VideoNote;
    private _voice?: Voice;
    private _widget?: Widget;
    private _captionEntities?: MessageEntity[];
    private _contact?: Contact;
    private _dice?: Dice;
    private _game?: Game;
    private _poll?: Poll;
    private _venue?: Venue;
    private _location?: Location;
    private _newChatMembers?: User[];
    private _leftChatMember?: User;
    private _newChatPhoto?: Photo;
    private _invoice?: Invoice;
    private _successfulPayment?: SuccessfulPayment;
    private _usersShared?: UsersShared;
    private _chatShared?: ChatShared;
    private _writeAccessAllowed?: WriteAccessAllowed;
    private _passportData?: PassportData;
    private _proximityAlertTriggered?: ProximityAlertTriggered;
    private _forumTopicCreated?: ForumTopicCreated;
    private _forumTopicEdited?: ForumTopicEdited;
    private _giveaway?: Giveaway;
    private _giveawayWinners?: GiveawayWinners;
    private _giveawayCompleted?: GiveawayCompleted;
    private _paidMessagesWaived?: PaidMessagesWaived;
    private _tonWalletTransfer?: TonWalletTransfer;
    private _videoChatScheduled?: VideoChatScheduled;
    private _videoChatEnded?: VideoChatEnded;
    private _videoChatParticipantsInvited?: VideoChatParticipantsInvited;
    private _webAppData?: WebAppData;
    private _replyMarkup?: InlineKeyboardMarkup;
    constructor(public raw: TelegramMessage, public readonly tg: TelegramLike) { }
    /**
     * Unique message identifier inside this chat; 0 for ephemeral messages. In specific instances (e.g., a message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent.
     */
    get id(): number {
        return this.raw.message_id;
    }
    /**
     * Optional. Unique identifier of a message thread or forum topic to which the message belongs; for supergroups and private chats only
     */
    get messageThreadId(): number | undefined {
        return this.raw.message_thread_id;
    }
    /**
     * Optional. Information about the direct messages chat topic that contains the message
     */
    get directMessagesTopic(): TelegramDirectMessagesTopic | undefined {
        return this.raw.direct_messages_topic;
    }
    /**
     * Optional. Sender of the message; may be empty for messages sent to channels. For backward compatibility, if the message was sent on behalf of a chat, the field contains a fake sender user in non-channel chats.
     */
    get from(): User | undefined {
        return this.raw.from ? (this._from ??= new User(this.raw.from)) : undefined;
    }
    /**
     * Optional. Sender of the message when sent on behalf of a chat. For example, the supergroup itself for messages sent by its anonymous administrators or a linked channel for messages automatically forwarded to the channel's discussion group. For backward compatibility, if the message was sent on behalf of a chat, the field from contains a fake sender user in non-channel chats.
     */
    get senderChat(): Chat | undefined {
        return this.raw.sender_chat ? (this._senderChat ??= new Chat(this.raw.sender_chat)) : undefined;
    }
    /**
     * Optional. If the sender of the message boosted the chat, the number of boosts added by the user
     */
    get senderBoostCount(): number | undefined {
        return this.raw.sender_boost_count;
    }
    /**
     * Optional. The bot that actually sent the message on behalf of the business account. Available only for outgoing messages sent on behalf of the connected business account.
     */
    get senderBusinessBot(): User | undefined {
        return this.raw.sender_business_bot ? (this._senderBusinessBot ??= new User(this.raw.sender_business_bot)) : undefined;
    }
    /**
     * Optional. Tag or custom title of the sender of the message; for supergroups only
     */
    get senderTag(): string | undefined {
        return this.raw.sender_tag;
    }
    /**
     * Optional. For ephemeral messages, the user who received the message
     */
    get receiverUser(): User | undefined {
        return this.raw.receiver_user ? (this._receiverUser ??= new User(this.raw.receiver_user)) : undefined;
    }
    /**
     * Optional. For ephemeral messages, identifier of the ephemeral message inside this chat. The identifier may be reused for another ephemeral message after the message is deleted or expires.
     */
    get ephemeralMessageId(): number | undefined {
        return this.raw.ephemeral_message_id;
    }
    /**
     * Date the message was sent in Unix time. It is always a positive number, representing a valid date.
     */
    get date(): number {
        return this.raw.date;
    }
    /**
     * Optional. The unique identifier for the guest query. Use this identifier with the method answerGuestQuery to send a response message. If non-empty, the message belongs to the chat where the guest bot was summoned, which may not coincide with other existing bot chats sharing the same identifier.
     */
    get guestQueryId(): string | undefined {
        return this.raw.guest_query_id;
    }
    /**
     * Optional. Unique identifier of the business connection from which the message was received. If non-empty, the message belongs to a chat of the corresponding business account that is independent from any potential bot chat which might share the same identifier.
     */
    get businessConnectionId(): string | undefined {
        return this.raw.business_connection_id;
    }
    /**
     * Chat the message belongs to
     */
    get chat(): Chat {
        return this._chat ??= new Chat(this.raw.chat);
    }
    /**
     * Optional. Information about the original message for forwarded messages
     */
    get forwardOrigin(): TelegramMessageOrigin | undefined {
        return this.raw.forward_origin;
    }
    /**
     * Optional. True, if the message is sent to a topic in a forum supergroup or a private chat with the bot
     */
    get isTopicMessage(): true | undefined {
        return this.raw.is_topic_message;
    }
    /**
     * Optional. True, if the message is a channel post that was automatically forwarded to the connected discussion group
     */
    get isAutomaticForward(): true | undefined {
        return this.raw.is_automatic_forward;
    }
    /**
     * Optional. For replies in the same chat and message thread, the original message. Note that the Message object in this field will not contain further reply_to_message fields even if it itself is a reply. If the message is a reply to an ephemeral message, then this field may be omitted.
     */
    get replyToMessage(): Message | undefined {
        return this.raw.reply_to_message ? (this._replyToMessage ??= new Message(this.raw.reply_to_message)) : undefined;
    }
    /**
     * Optional. Information about the message that is being replied to, which may come from another chat or forum topic
     */
    get externalReply(): ExternalReplyInfo | undefined {
        return this.raw.external_reply ? (this._externalReply ??= new ExternalReplyInfo(this.raw.external_reply)) : undefined;
    }
    /**
     * Optional. For replies that quote part of the original message, the quoted part of the message
     */
    get quote(): TextQuote | undefined {
        return this.raw.quote ? (this._quote ??= new TextQuote(this.raw.quote)) : undefined;
    }
    /**
     * Optional. For replies to a story, the original story
     */
    get replyToStory(): Story | undefined {
        return this.raw.reply_to_story ? (this._replyToStory ??= new Story(this.raw.reply_to_story)) : undefined;
    }
    /**
     * Optional. Identifier of the specific checklist task that is being replied to
     */
    get replyToChecklistTaskId(): number | undefined {
        return this.raw.reply_to_checklist_task_id;
    }
    /**
     * Optional. Persistent identifier of the specific poll option that is being replied to
     */
    get replyToPollOptionId(): string | undefined {
        return this.raw.reply_to_poll_option_id;
    }
    /**
     * Optional. Bot through which the message was sent
     */
    get viaBot(): User | undefined {
        return this.raw.via_bot ? (this._viaBot ??= new User(this.raw.via_bot)) : undefined;
    }
    /**
     * Optional. For a message sent by a guest bot, this is the user whose original message triggered the bot's response
     */
    get guestBotCallerUser(): User | undefined {
        return this.raw.guest_bot_caller_user ? (this._guestBotCallerUser ??= new User(this.raw.guest_bot_caller_user)) : undefined;
    }
    /**
     * Optional. For a message sent by a guest bot, this is the chat whose original message triggered the bot's response
     */
    get guestBotCallerChat(): Chat | undefined {
        return this.raw.guest_bot_caller_chat ? (this._guestBotCallerChat ??= new Chat(this.raw.guest_bot_caller_chat)) : undefined;
    }
    /**
     * Optional. Date the message was last edited in Unix time
     */
    get editDate(): number | undefined {
        return this.raw.edit_date;
    }
    /**
     * Optional. True, if the message can't be forwarded
     */
    get hasProtectedContent(): true | undefined {
        return this.raw.has_protected_content;
    }
    /**
     * Optional. True, if the message was sent by an implicit action, for example, as an away or a greeting business message, or as a scheduled message
     */
    get isFromOffline(): true | undefined {
        return this.raw.is_from_offline;
    }
    /**
     * Optional. True, if the message is a paid post. Note that such posts must not be deleted for 24 hours to receive the payment and can't be edited.
     */
    get isPaidPost(): true | undefined {
        return this.raw.is_paid_post;
    }
    /**
     * Optional. The unique identifier inside this chat of a media message group this message belongs to
     */
    get mediaGroupId(): string | undefined {
        return this.raw.media_group_id;
    }
    /**
     * Optional. Signature of the post author for messages in channels, or the custom title of an anonymous group administrator
     */
    get authorSignature(): string | undefined {
        return this.raw.author_signature;
    }
    /**
     * Optional. The number of Telegram Stars that were paid by the sender of the message to send it
     */
    get paidStarCount(): number | undefined {
        return this.raw.paid_star_count;
    }
    /**
     * Optional. For text messages, the actual UTF-8 text of the message
     */
    get text(): string | undefined {
        return this.raw.text;
    }
    /**
     * Optional. For text messages, special entities like usernames, URLs, bot commands, etc. that appear in the text
     */
    get entities(): MessageEntity[] | undefined {
        return this.raw.entities ? (this._entities ??= this.raw.entities.map(x => new MessageEntity(x))) : undefined;
    }
    /**
     * Optional. Options used for link preview generation for the message, if it is a text message and link preview options were changed
     */
    get linkPreviewOptions(): LinkPreviewOptions | undefined {
        return this.raw.link_preview_options ? (this._linkPreviewOptions ??= new LinkPreviewOptions(this.raw.link_preview_options)) : undefined;
    }
    /**
     * Optional. Information about suggested post parameters if the message is a suggested post in a channel direct messages chat. If the message is an approved or declined suggested post, then it can't be edited.
     */
    get suggestedPostInfo(): TelegramSuggestedPostInfo | undefined {
        return this.raw.suggested_post_info;
    }
    /**
     * Optional. Unique identifier of the message effect added to the message
     */
    get effectId(): string | undefined {
        return this.raw.effect_id;
    }
    /**
     * Optional. Message is a rich formatted message
     */
    get richMessage(): TelegramRichMessage | undefined {
        return this.raw.rich_message;
    }
    /**
     * Optional. Message is an animation, information about the animation. For backward compatibility, when this field is set, the document field will also be set.
     */
    get animation(): Animation | undefined {
        return this.raw.animation ? (this._animation ??= new Animation(this.raw.animation)) : undefined;
    }
    /**
     * Optional. Message is an audio file, information about the file
     */
    get audio(): Audio | undefined {
        return this.raw.audio ? (this._audio ??= new Audio(this.raw.audio)) : undefined;
    }
    /**
     * Optional. Message is a general file, information about the file
     */
    get document(): Document | undefined {
        return this.raw.document ? (this._document ??= new Document(this.raw.document)) : undefined;
    }
    /**
     * Optional. Message is a live photo, information about the live photo. For backward compatibility, when this field is set, the photo field will also be set.
     */
    get livePhoto(): LivePhoto | undefined {
        return this.raw.live_photo ? (this._livePhoto ??= new LivePhoto(this.raw.live_photo)) : undefined;
    }
    /**
     * Optional. Message contains paid media; information about the paid media
     */
    get paidMedia(): TelegramPaidMediaInfo | undefined {
        return this.raw.paid_media;
    }
    /**
     * Optional. Message is a photo, available sizes of the photo
     */
    get photo(): Photo | undefined {
        return this.raw.photo ? (this._photo ??= new Photo(this.raw.photo)) : undefined;
    }
    /**
     * Optional. Message is a sticker, information about the sticker
     */
    get sticker(): Sticker | undefined {
        return this.raw.sticker ? (this._sticker ??= new Sticker(this.raw.sticker)) : undefined;
    }
    /**
     * Optional. Message is a forwarded story
     */
    get story(): Story | undefined {
        return this.raw.story ? (this._story ??= new Story(this.raw.story)) : undefined;
    }
    /**
     * Optional. Message is a video, information about the video
     */
    get video(): Video | undefined {
        return this.raw.video ? (this._video ??= new Video(this.raw.video)) : undefined;
    }
    /**
     * Optional. Message is a video note, information about the video message
     */
    get videoNote(): VideoNote | undefined {
        return this.raw.video_note ? (this._videoNote ??= new VideoNote(this.raw.video_note)) : undefined;
    }
    /**
     * Optional. Message is a voice message, information about the file
     */
    get voice(): Voice | undefined {
        return this.raw.voice ? (this._voice ??= new Voice(this.raw.voice)) : undefined;
    }
    /**
     * Optional. Message is an HTML widget, information about the widget
     */
    get widget(): Widget | undefined {
        return this.raw.widget ? (this._widget ??= new Widget(this.raw.widget)) : undefined;
    }
    /**
     * Optional. Caption for the animation, audio, document, live photo, paid media, photo, video, voice, or widget
     */
    get caption(): string | undefined {
        return this.raw.caption;
    }
    /**
     * Optional. For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption
     */
    get captionEntities(): MessageEntity[] | undefined {
        return this.raw.caption_entities ? (this._captionEntities ??= this.raw.caption_entities.map(x => new MessageEntity(x))) : undefined;
    }
    /**
     * Optional. True, if the caption must be shown above the message media or the widget
     */
    get showCaptionAboveMedia(): true | undefined {
        return this.raw.show_caption_above_media;
    }
    /**
     * Optional. True, if the message media is covered by a spoiler animation
     */
    get hasMediaSpoiler(): true | undefined {
        return this.raw.has_media_spoiler;
    }
    /**
     * Optional. Message is a checklist
     */
    get checklist(): TelegramChecklist | undefined {
        return this.raw.checklist;
    }
    /**
     * Optional. Message is a shared contact, information about the contact
     */
    get contact(): Contact | undefined {
        return this.raw.contact ? (this._contact ??= new Contact(this.raw.contact)) : undefined;
    }
    /**
     * Optional. Message is a dice with random value
     */
    get dice(): Dice | undefined {
        return this.raw.dice ? (this._dice ??= new Dice(this.raw.dice)) : undefined;
    }
    /**
     * Optional. Message is a game, information about the game. More about games »
     */
    get game(): Game | undefined {
        return this.raw.game ? (this._game ??= new Game(this.raw.game)) : undefined;
    }
    /**
     * Optional. Message is a native poll, information about the poll
     */
    get poll(): Poll | undefined {
        return this.raw.poll ? (this._poll ??= new Poll(this.raw.poll)) : undefined;
    }
    /**
     * Optional. Message is a venue, information about the venue. For backward compatibility, when this field is set, the location field will also be set.
     */
    get venue(): Venue | undefined {
        return this.raw.venue ? (this._venue ??= new Venue(this.raw.venue)) : undefined;
    }
    /**
     * Optional. Message is a shared location, information about the location
     */
    get location(): Location | undefined {
        return this.raw.location ? (this._location ??= new Location(this.raw.location)) : undefined;
    }
    /**
     * Optional. New members that were added to the group or supergroup and information about them (the bot itself may be one of these members)
     */
    get newChatMembers(): User[] | undefined {
        return this.raw.new_chat_members ? (this._newChatMembers ??= this.raw.new_chat_members.map(x => new User(x))) : undefined;
    }
    /**
     * Optional. A member was removed from the group, information about them (this member may be the bot itself)
     */
    get leftChatMember(): User | undefined {
        return this.raw.left_chat_member ? (this._leftChatMember ??= new User(this.raw.left_chat_member)) : undefined;
    }
    /**
     * Optional. Service message: chat owner has left
     */
    get chatOwnerLeft(): TelegramChatOwnerLeft | undefined {
        return this.raw.chat_owner_left;
    }
    /**
     * Optional. Service message: chat owner has changed
     */
    get chatOwnerChanged(): TelegramChatOwnerChanged | undefined {
        return this.raw.chat_owner_changed;
    }
    /**
     * Optional. A chat title was changed to this value
     */
    get newChatTitle(): string | undefined {
        return this.raw.new_chat_title;
    }
    /**
     * Optional. A chat photo was change to this value
     */
    get newChatPhoto(): Photo | undefined {
        return this.raw.new_chat_photo ? (this._newChatPhoto ??= new Photo(this.raw.new_chat_photo)) : undefined;
    }
    /**
     * Optional. Service message: the chat photo was deleted
     */
    get deleteChatPhoto(): true | undefined {
        return this.raw.delete_chat_photo;
    }
    /**
     * Optional. Service message: the group has been created
     */
    get groupChatCreated(): true | undefined {
        return this.raw.group_chat_created;
    }
    /**
     * Optional. Service message: the supergroup has been created. This field can't be received in a message coming through updates, because bot can't be a member of a supergroup when it is created. It can only be found in reply_to_message if someone replies to a very first message in a directly created supergroup.
     */
    get supergroupChatCreated(): true | undefined {
        return this.raw.supergroup_chat_created;
    }
    /**
     * Optional. Service message: the channel has been created. This field can't be received in a message coming through updates, because bot can't be a member of a channel when it is created. It can only be found in reply_to_message if someone replies to a very first message in a channel.
     */
    get channelChatCreated(): true | undefined {
        return this.raw.channel_chat_created;
    }
    /**
     * Optional. Service message: auto-delete timer settings changed in the chat
     */
    get messageAutoDeleteTimerChanged(): TelegramMessageAutoDeleteTimerChanged | undefined {
        return this.raw.message_auto_delete_timer_changed;
    }
    /**
     * Optional. The group has been migrated to a supergroup with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
     */
    get migrateToChatId(): number | undefined {
        return this.raw.migrate_to_chat_id;
    }
    /**
     * Optional. The supergroup has been migrated from a group with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
     */
    get migrateFromChatId(): number | undefined {
        return this.raw.migrate_from_chat_id;
    }
    /**
     * Optional. Specified message was pinned. Note that the Message object in this field will not contain further reply_to_message fields even if it itself is a reply.
     */
    get pinnedMessage(): TelegramMaybeInaccessibleMessage | undefined {
        return this.raw.pinned_message;
    }
    /**
     * Optional. Message is an invoice for a payment, information about the invoice. More about payments »
     */
    get invoice(): Invoice | undefined {
        return this.raw.invoice ? (this._invoice ??= new Invoice(this.raw.invoice)) : undefined;
    }
    /**
     * Optional. Message is a service message about a successful payment, information about the payment. More about payments »
     */
    get successfulPayment(): SuccessfulPayment | undefined {
        return this.raw.successful_payment ? (this._successfulPayment ??= new SuccessfulPayment(this.raw.successful_payment)) : undefined;
    }
    /**
     * Optional. Message is a service message about a refunded payment, information about the payment. More about payments »
     */
    get refundedPayment(): TelegramRefundedPayment | undefined {
        return this.raw.refunded_payment;
    }
    /**
     * Optional. Service message: users were shared with the bot
     */
    get usersShared(): UsersShared | undefined {
        return this.raw.users_shared ? (this._usersShared ??= new UsersShared(this.raw.users_shared)) : undefined;
    }
    /**
     * Optional. Service message: a chat was shared with the bot
     */
    get chatShared(): ChatShared | undefined {
        return this.raw.chat_shared ? (this._chatShared ??= new ChatShared(this.raw.chat_shared)) : undefined;
    }
    /**
     * Optional. Service message: a regular gift was sent or received
     */
    get gift(): TelegramGiftInfo | undefined {
        return this.raw.gift;
    }
    /**
     * Optional. Service message: a unique gift was sent or received
     */
    get uniqueGift(): TelegramUniqueGiftInfo | undefined {
        return this.raw.unique_gift;
    }
    /**
     * Optional. Service message: upgrade of a gift was purchased after the gift was sent
     */
    get giftUpgradeSent(): TelegramGiftInfo | undefined {
        return this.raw.gift_upgrade_sent;
    }
    /**
     * Optional. The domain name of the website on which the user has logged in. More about Telegram Login »
     */
    get connectedWebsite(): string | undefined {
        return this.raw.connected_website;
    }
    /**
     * Optional. Service message: the user allowed the bot to write messages after adding it to the attachment or side menu, launching a Web App from a link, or accepting an explicit request from a Web App sent by the method requestWriteAccess
     */
    get writeAccessAllowed(): WriteAccessAllowed | undefined {
        return this.raw.write_access_allowed ? (this._writeAccessAllowed ??= new WriteAccessAllowed(this.raw.write_access_allowed)) : undefined;
    }
    /**
     * Optional. Telegram Passport data
     */
    get passportData(): PassportData | undefined {
        return this.raw.passport_data ? (this._passportData ??= new PassportData(this.raw.passport_data)) : undefined;
    }
    /**
     * Optional. Service message: a user in the chat triggered another user's proximity alert while sharing Live Location
     */
    get proximityAlertTriggered(): ProximityAlertTriggered | undefined {
        return this.raw.proximity_alert_triggered ? (this._proximityAlertTriggered ??= new ProximityAlertTriggered(this.raw.proximity_alert_triggered)) : undefined;
    }
    /**
     * Optional. Service message: user boosted the chat
     */
    get boostAdded(): TelegramChatBoostAdded | undefined {
        return this.raw.boost_added;
    }
    /**
     * Optional. Service message: chat background set
     */
    get chatBackgroundSet(): TelegramChatBackground | undefined {
        return this.raw.chat_background_set;
    }
    /**
     * Optional. Service message: some tasks in a checklist were marked as done or not done
     */
    get checklistTasksDone(): TelegramChecklistTasksDone | undefined {
        return this.raw.checklist_tasks_done;
    }
    /**
     * Optional. Service message: tasks were added to a checklist
     */
    get checklistTasksAdded(): TelegramChecklistTasksAdded | undefined {
        return this.raw.checklist_tasks_added;
    }
    /**
     * Optional. Service message: chat or bot added to a Community
     */
    get communityChatAdded(): TelegramCommunityChatAdded | undefined {
        return this.raw.community_chat_added;
    }
    /**
     * Optional. Service message: chat was joined by a user from a Community
     */
    get communityChatJoined(): TelegramCommunityChatJoined | undefined {
        return this.raw.community_chat_joined;
    }
    /**
     * Optional. Service message: chat or bot removed from a Community
     */
    get communityChatRemoved(): TelegramCommunityChatRemoved | undefined {
        return this.raw.community_chat_removed;
    }
    /**
     * Optional. Service message: the price for paid messages in the corresponding direct messages chat of a channel has changed
     */
    get directMessagePriceChanged(): TelegramDirectMessagePriceChanged | undefined {
        return this.raw.direct_message_price_changed;
    }
    /**
     * Optional. Service message: forum topic created
     */
    get forumTopicCreated(): ForumTopicCreated | undefined {
        return this.raw.forum_topic_created ? (this._forumTopicCreated ??= new ForumTopicCreated(this.raw.forum_topic_created)) : undefined;
    }
    /**
     * Optional. Service message: forum topic edited
     */
    get forumTopicEdited(): ForumTopicEdited | undefined {
        return this.raw.forum_topic_edited ? (this._forumTopicEdited ??= new ForumTopicEdited(this.raw.forum_topic_edited)) : undefined;
    }
    /**
     * Optional. Service message: forum topic closed
     */
    get forumTopicClosed(): TelegramForumTopicClosed | undefined {
        return this.raw.forum_topic_closed;
    }
    /**
     * Optional. Service message: forum topic reopened
     */
    get forumTopicReopened(): TelegramForumTopicReopened | undefined {
        return this.raw.forum_topic_reopened;
    }
    /**
     * Optional. Service message: the 'General' forum topic hidden
     */
    get generalForumTopicHidden(): TelegramGeneralForumTopicHidden | undefined {
        return this.raw.general_forum_topic_hidden;
    }
    /**
     * Optional. Service message: the 'General' forum topic unhidden
     */
    get generalForumTopicUnhidden(): TelegramGeneralForumTopicUnhidden | undefined {
        return this.raw.general_forum_topic_unhidden;
    }
    /**
     * Optional. Service message: a scheduled giveaway was created
     */
    get giveawayCreated(): TelegramGiveawayCreated | undefined {
        return this.raw.giveaway_created;
    }
    /**
     * Optional. The message is a scheduled giveaway message
     */
    get giveaway(): Giveaway | undefined {
        return this.raw.giveaway ? (this._giveaway ??= new Giveaway(this.raw.giveaway)) : undefined;
    }
    /**
     * Optional. A giveaway with public winners was completed
     */
    get giveawayWinners(): GiveawayWinners | undefined {
        return this.raw.giveaway_winners ? (this._giveawayWinners ??= new GiveawayWinners(this.raw.giveaway_winners)) : undefined;
    }
    /**
     * Optional. Service message: a giveaway without public winners was completed
     */
    get giveawayCompleted(): GiveawayCompleted | undefined {
        return this.raw.giveaway_completed ? (this._giveawayCompleted ??= new GiveawayCompleted(this.raw.giveaway_completed)) : undefined;
    }
    /**
     * Optional. Service message: user created a bot that will be managed by the current bot
     */
    get managedBotCreated(): TelegramManagedBotCreated | undefined {
        return this.raw.managed_bot_created;
    }
    /**
     * Optional. Service message: the price for paid messages has changed in the chat
     */
    get paidMessagePriceChanged(): TelegramPaidMessagePriceChanged | undefined {
        return this.raw.paid_message_price_changed;
    }
    /**
     * Optional. Service message: the sender of the message used a link of the other user, which allows sending messages to the user without paying Telegram Stars
     */
    get paidMessagesWaived(): PaidMessagesWaived | undefined {
        return this.raw.paid_messages_waived ? (this._paidMessagesWaived ??= new PaidMessagesWaived(this.raw.paid_messages_waived)) : undefined;
    }
    /**
     * Optional. Service message: answer option was added to a poll
     */
    get pollOptionAdded(): TelegramPollOptionAdded | undefined {
        return this.raw.poll_option_added;
    }
    /**
     * Optional. Service message: answer option was deleted from a poll
     */
    get pollOptionDeleted(): TelegramPollOptionDeleted | undefined {
        return this.raw.poll_option_deleted;
    }
    /**
     * Optional. Service message: a suggested post was approved
     */
    get suggestedPostApproved(): TelegramSuggestedPostApproved | undefined {
        return this.raw.suggested_post_approved;
    }
    /**
     * Optional. Service message: approval of a suggested post has failed
     */
    get suggestedPostApprovalFailed(): TelegramSuggestedPostApprovalFailed | undefined {
        return this.raw.suggested_post_approval_failed;
    }
    /**
     * Optional. Service message: a suggested post was declined
     */
    get suggestedPostDeclined(): TelegramSuggestedPostDeclined | undefined {
        return this.raw.suggested_post_declined;
    }
    /**
     * Optional. Service message: payment for a suggested post was received
     */
    get suggestedPostPaid(): TelegramSuggestedPostPaid | undefined {
        return this.raw.suggested_post_paid;
    }
    /**
     * Optional. Service message: payment for a suggested post was refunded
     */
    get suggestedPostRefunded(): TelegramSuggestedPostRefunded | undefined {
        return this.raw.suggested_post_refunded;
    }
    /**
     * Optional. Service message: a transfer with a TON wallet
     */
    get tonWalletTransfer(): TonWalletTransfer | undefined {
        return this.raw.ton_wallet_transfer ? (this._tonWalletTransfer ??= new TonWalletTransfer(this.raw.ton_wallet_transfer)) : undefined;
    }
    /**
     * Optional. Service message: video chat scheduled
     */
    get videoChatScheduled(): VideoChatScheduled | undefined {
        return this.raw.video_chat_scheduled ? (this._videoChatScheduled ??= new VideoChatScheduled(this.raw.video_chat_scheduled)) : undefined;
    }
    /**
     * Optional. Service message: video chat started
     */
    get videoChatStarted(): TelegramVideoChatStarted | undefined {
        return this.raw.video_chat_started;
    }
    /**
     * Optional. Service message: video chat ended
     */
    get videoChatEnded(): VideoChatEnded | undefined {
        return this.raw.video_chat_ended ? (this._videoChatEnded ??= new VideoChatEnded(this.raw.video_chat_ended)) : undefined;
    }
    /**
     * Optional. Service message: new participants invited to a video chat
     */
    get videoChatParticipantsInvited(): VideoChatParticipantsInvited | undefined {
        return this.raw.video_chat_participants_invited ? (this._videoChatParticipantsInvited ??= new VideoChatParticipantsInvited(this.raw.video_chat_participants_invited)) : undefined;
    }
    /**
     * Optional. Service message: data sent by a Web App
     */
    get webAppData(): WebAppData | undefined {
        return this.raw.web_app_data ? (this._webAppData ??= new WebAppData(this.raw.web_app_data)) : undefined;
    }
    /**
     * Optional. Inline keyboard attached to the message. login_url buttons are represented as ordinary url buttons.
     */
    get replyMarkup(): InlineKeyboardMarkup | undefined {
        return this.raw.reply_markup ? (this._replyMarkup ??= new InlineKeyboardMarkup(this.raw.reply_markup)) : undefined;
    }
    /**
     * true if `message_thread_id` is set
     */
    hasMessageThreadId(): this is this & {
        messageThreadId: number;
        thread: MessageThreadShortcuts;
    } {
        return this.raw.message_thread_id != null;
    }
    /**
     * true if `direct_messages_topic` is set
     */
    hasDirectMessagesTopic(): this is this & {
        directMessagesTopic: TelegramDirectMessagesTopic;
    } {
        return this.raw.direct_messages_topic != null;
    }
    /**
     * true if `from` is set
     */
    hasFrom(): this is this & {
        from: User;
    } {
        return this.raw.from != null;
    }
    /**
     * true if `sender_chat` is set
     */
    hasSenderChat(): this is this & {
        senderChat: Chat;
    } {
        return this.raw.sender_chat != null;
    }
    /**
     * true if `sender_boost_count` is set
     */
    hasSenderBoostCount(): this is this & {
        senderBoostCount: number;
    } {
        return this.raw.sender_boost_count != null;
    }
    /**
     * true if `sender_business_bot` is set
     */
    hasSenderBusinessBot(): this is this & {
        senderBusinessBot: User;
    } {
        return this.raw.sender_business_bot != null;
    }
    /**
     * true if `sender_tag` is set
     */
    hasSenderTag(): this is this & {
        senderTag: string;
    } {
        return this.raw.sender_tag != null;
    }
    /**
     * true if `receiver_user` is set
     */
    hasReceiverUser(): this is this & {
        receiverUser: User;
    } {
        return this.raw.receiver_user != null;
    }
    /**
     * true if `ephemeral_message_id` is set
     */
    hasEphemeralMessageId(): this is this & {
        ephemeralMessageId: number;
    } {
        return this.raw.ephemeral_message_id != null;
    }
    /**
     * true if `guest_query_id` is set
     */
    hasGuestQueryId(): this is this & {
        guestQueryId: string;
    } {
        return this.raw.guest_query_id != null;
    }
    /**
     * true if `business_connection_id` is set
     */
    hasBusinessConnectionId(): this is this & {
        businessConnectionId: string;
    } {
        return this.raw.business_connection_id != null;
    }
    /**
     * true if `forward_origin` is set
     */
    hasForwardOrigin(): this is this & {
        forwardOrigin: TelegramMessageOrigin;
    } {
        return this.raw.forward_origin != null;
    }
    /**
     * true if `external_reply` is set
     */
    hasExternalReply(): this is this & {
        externalReply: ExternalReplyInfo;
    } {
        return this.raw.external_reply != null;
    }
    /**
     * true if `quote` is set
     */
    hasQuote(): this is this & {
        quote: TextQuote;
    } {
        return this.raw.quote != null;
    }
    /**
     * true if `reply_to_story` is set
     */
    hasReplyToStory(): this is this & {
        replyToStory: Story;
    } {
        return this.raw.reply_to_story != null;
    }
    /**
     * true if `reply_to_checklist_task_id` is set
     */
    hasReplyToChecklistTaskId(): this is this & {
        replyToChecklistTaskId: number;
    } {
        return this.raw.reply_to_checklist_task_id != null;
    }
    /**
     * true if `reply_to_poll_option_id` is set
     */
    hasReplyToPollOptionId(): this is this & {
        replyToPollOptionId: string;
    } {
        return this.raw.reply_to_poll_option_id != null;
    }
    /**
     * true if `via_bot` is set
     */
    hasViaBot(): this is this & {
        viaBot: User;
    } {
        return this.raw.via_bot != null;
    }
    /**
     * true if `guest_bot_caller_user` is set
     */
    hasGuestBotCallerUser(): this is this & {
        guestBotCallerUser: User;
    } {
        return this.raw.guest_bot_caller_user != null;
    }
    /**
     * true if `guest_bot_caller_chat` is set
     */
    hasGuestBotCallerChat(): this is this & {
        guestBotCallerChat: Chat;
    } {
        return this.raw.guest_bot_caller_chat != null;
    }
    /**
     * true if `edit_date` is set
     */
    hasEditDate(): this is this & {
        editDate: number;
    } {
        return this.raw.edit_date != null;
    }
    /**
     * true if `media_group_id` is set
     */
    hasMediaGroupId(): this is this & {
        mediaGroupId: string;
    } {
        return this.raw.media_group_id != null;
    }
    /**
     * true if `author_signature` is set
     */
    hasAuthorSignature(): this is this & {
        authorSignature: string;
    } {
        return this.raw.author_signature != null;
    }
    /**
     * true if `paid_star_count` is set
     */
    hasPaidStarCount(): this is this & {
        paidStarCount: number;
    } {
        return this.raw.paid_star_count != null;
    }
    /**
     * true if `text` is set
     */
    hasText(): this is this & {
        text: string;
    } {
        return this.raw.text != null;
    }
    /**
     * true if `entities` has at least one item
     */
    hasEntities(): this is this & {
        entities: MessageEntity[];
    } {
        return this.raw.entities != null && this.raw.entities.length > 0;
    }
    /**
     * true if `link_preview_options` is set
     */
    hasLinkPreviewOptions(): this is this & {
        linkPreviewOptions: LinkPreviewOptions;
    } {
        return this.raw.link_preview_options != null;
    }
    /**
     * true if `suggested_post_info` is set
     */
    hasSuggestedPostInfo(): this is this & {
        suggestedPostInfo: TelegramSuggestedPostInfo;
    } {
        return this.raw.suggested_post_info != null;
    }
    /**
     * true if `effect_id` is set
     */
    hasEffectId(): this is this & {
        effectId: string;
    } {
        return this.raw.effect_id != null;
    }
    /**
     * true if `rich_message` is set
     */
    hasRichMessage(): this is this & {
        richMessage: TelegramRichMessage;
    } {
        return this.raw.rich_message != null;
    }
    /**
     * true if `animation` is set
     */
    hasAnimation(): this is this & {
        animation: Animation;
    } {
        return this.raw.animation != null;
    }
    /**
     * true if `audio` is set
     */
    hasAudio(): this is this & {
        audio: Audio;
    } {
        return this.raw.audio != null;
    }
    /**
     * true if `document` is set
     */
    hasDocument(): this is this & {
        document: Document;
    } {
        return this.raw.document != null;
    }
    /**
     * true if `live_photo` is set
     */
    hasLivePhoto(): this is this & {
        livePhoto: LivePhoto;
    } {
        return this.raw.live_photo != null;
    }
    /**
     * true if `paid_media` is set
     */
    hasPaidMedia(): this is this & {
        paidMedia: TelegramPaidMediaInfo;
    } {
        return this.raw.paid_media != null;
    }
    /**
     * true if `photo` has at least one item
     */
    hasPhoto(): this is this & {
        photo: Photo;
    } {
        return this.raw.photo != null && this.raw.photo.length > 0;
    }
    /**
     * true if `sticker` is set
     */
    hasSticker(): this is this & {
        sticker: Sticker;
    } {
        return this.raw.sticker != null;
    }
    /**
     * true if `story` is set
     */
    hasStory(): this is this & {
        story: Story;
    } {
        return this.raw.story != null;
    }
    /**
     * true if `video` is set
     */
    hasVideo(): this is this & {
        video: Video;
    } {
        return this.raw.video != null;
    }
    /**
     * true if `video_note` is set
     */
    hasVideoNote(): this is this & {
        videoNote: VideoNote;
    } {
        return this.raw.video_note != null;
    }
    /**
     * true if `voice` is set
     */
    hasVoice(): this is this & {
        voice: Voice;
    } {
        return this.raw.voice != null;
    }
    /**
     * true if `widget` is set
     */
    hasWidget(): this is this & {
        widget: Widget;
    } {
        return this.raw.widget != null;
    }
    /**
     * true if `caption` is set
     */
    hasCaption(): this is this & {
        caption: string;
    } {
        return this.raw.caption != null;
    }
    /**
     * true if `caption_entities` has at least one item
     */
    hasCaptionEntities(): this is this & {
        captionEntities: MessageEntity[];
    } {
        return this.raw.caption_entities != null && this.raw.caption_entities.length > 0;
    }
    /**
     * true if `show_caption_above_media` is set
     */
    hasShowCaptionAboveMedia(): this is this & {
        showCaptionAboveMedia: true;
    } {
        return this.raw.show_caption_above_media != null;
    }
    /**
     * true if `checklist` is set
     */
    hasChecklist(): this is this & {
        checklist: TelegramChecklist;
    } {
        return this.raw.checklist != null;
    }
    /**
     * true if `contact` is set
     */
    hasContact(): this is this & {
        contact: Contact;
    } {
        return this.raw.contact != null;
    }
    /**
     * true if `dice` is set
     */
    hasDice(): this is this & {
        dice: Dice;
    } {
        return this.raw.dice != null;
    }
    /**
     * true if `game` is set
     */
    hasGame(): this is this & {
        game: Game;
    } {
        return this.raw.game != null;
    }
    /**
     * true if `poll` is set
     */
    hasPoll(): this is this & {
        poll: Poll;
    } {
        return this.raw.poll != null;
    }
    /**
     * true if `venue` is set
     */
    hasVenue(): this is this & {
        venue: Venue;
    } {
        return this.raw.venue != null;
    }
    /**
     * true if `location` is set
     */
    hasLocation(): this is this & {
        location: Location;
    } {
        return this.raw.location != null;
    }
    /**
     * true if `new_chat_members` has at least one item
     */
    hasNewChatMembers(): this is this & {
        newChatMembers: User[];
    } {
        return this.raw.new_chat_members != null && this.raw.new_chat_members.length > 0;
    }
    /**
     * true if `left_chat_member` is set
     */
    hasLeftChatMember(): this is this & {
        leftChatMember: User;
    } {
        return this.raw.left_chat_member != null;
    }
    /**
     * true if `chat_owner_left` is set
     */
    hasChatOwnerLeft(): this is this & {
        chatOwnerLeft: TelegramChatOwnerLeft;
    } {
        return this.raw.chat_owner_left != null;
    }
    /**
     * true if `chat_owner_changed` is set
     */
    hasChatOwnerChanged(): this is this & {
        chatOwnerChanged: TelegramChatOwnerChanged;
    } {
        return this.raw.chat_owner_changed != null;
    }
    /**
     * true if `new_chat_title` is set
     */
    hasNewChatTitle(): this is this & {
        newChatTitle: string;
    } {
        return this.raw.new_chat_title != null;
    }
    /**
     * true if `new_chat_photo` has at least one item
     */
    hasNewChatPhoto(): this is this & {
        newChatPhoto: Photo;
    } {
        return this.raw.new_chat_photo != null && this.raw.new_chat_photo.length > 0;
    }
    /**
     * true if `delete_chat_photo` is set
     */
    hasDeleteChatPhoto(): this is this & {
        deleteChatPhoto: true;
    } {
        return this.raw.delete_chat_photo != null;
    }
    /**
     * true if `group_chat_created` is set
     */
    hasGroupChatCreated(): this is this & {
        groupChatCreated: true;
    } {
        return this.raw.group_chat_created != null;
    }
    /**
     * true if `supergroup_chat_created` is set
     */
    hasSupergroupChatCreated(): this is this & {
        supergroupChatCreated: true;
    } {
        return this.raw.supergroup_chat_created != null;
    }
    /**
     * true if `channel_chat_created` is set
     */
    hasChannelChatCreated(): this is this & {
        channelChatCreated: true;
    } {
        return this.raw.channel_chat_created != null;
    }
    /**
     * true if `message_auto_delete_timer_changed` is set
     */
    hasMessageAutoDeleteTimerChanged(): this is this & {
        messageAutoDeleteTimerChanged: TelegramMessageAutoDeleteTimerChanged;
    } {
        return this.raw.message_auto_delete_timer_changed != null;
    }
    /**
     * true if `migrate_to_chat_id` is set
     */
    hasMigrateToChatId(): this is this & {
        migrateToChatId: number;
    } {
        return this.raw.migrate_to_chat_id != null;
    }
    /**
     * true if `migrate_from_chat_id` is set
     */
    hasMigrateFromChatId(): this is this & {
        migrateFromChatId: number;
    } {
        return this.raw.migrate_from_chat_id != null;
    }
    /**
     * true if `pinned_message` is set
     */
    hasPinnedMessage(): this is this & {
        pinnedMessage: TelegramMaybeInaccessibleMessage;
    } {
        return this.raw.pinned_message != null;
    }
    /**
     * true if `invoice` is set
     */
    hasInvoice(): this is this & {
        invoice: Invoice;
    } {
        return this.raw.invoice != null;
    }
    /**
     * true if `successful_payment` is set
     */
    hasSuccessfulPayment(): this is this & {
        successfulPayment: SuccessfulPayment;
    } {
        return this.raw.successful_payment != null;
    }
    /**
     * true if `refunded_payment` is set
     */
    hasRefundedPayment(): this is this & {
        refundedPayment: TelegramRefundedPayment;
    } {
        return this.raw.refunded_payment != null;
    }
    /**
     * true if `users_shared` is set
     */
    hasUsersShared(): this is this & {
        usersShared: UsersShared;
    } {
        return this.raw.users_shared != null;
    }
    /**
     * true if `chat_shared` is set
     */
    hasChatShared(): this is this & {
        chatShared: ChatShared;
    } {
        return this.raw.chat_shared != null;
    }
    /**
     * true if `gift` is set
     */
    hasGift(): this is this & {
        gift: TelegramGiftInfo;
    } {
        return this.raw.gift != null;
    }
    /**
     * true if `unique_gift` is set
     */
    hasUniqueGift(): this is this & {
        uniqueGift: TelegramUniqueGiftInfo;
    } {
        return this.raw.unique_gift != null;
    }
    /**
     * true if `gift_upgrade_sent` is set
     */
    hasGiftUpgradeSent(): this is this & {
        giftUpgradeSent: TelegramGiftInfo;
    } {
        return this.raw.gift_upgrade_sent != null;
    }
    /**
     * true if `connected_website` is set
     */
    hasConnectedWebsite(): this is this & {
        connectedWebsite: string;
    } {
        return this.raw.connected_website != null;
    }
    /**
     * true if `write_access_allowed` is set
     */
    hasWriteAccessAllowed(): this is this & {
        writeAccessAllowed: WriteAccessAllowed;
    } {
        return this.raw.write_access_allowed != null;
    }
    /**
     * true if `passport_data` is set
     */
    hasPassportData(): this is this & {
        passportData: PassportData;
    } {
        return this.raw.passport_data != null;
    }
    /**
     * true if `proximity_alert_triggered` is set
     */
    hasProximityAlertTriggered(): this is this & {
        proximityAlertTriggered: ProximityAlertTriggered;
    } {
        return this.raw.proximity_alert_triggered != null;
    }
    /**
     * true if `boost_added` is set
     */
    hasBoostAdded(): this is this & {
        boostAdded: TelegramChatBoostAdded;
    } {
        return this.raw.boost_added != null;
    }
    /**
     * true if `chat_background_set` is set
     */
    hasChatBackgroundSet(): this is this & {
        chatBackgroundSet: TelegramChatBackground;
    } {
        return this.raw.chat_background_set != null;
    }
    /**
     * true if `checklist_tasks_done` is set
     */
    hasChecklistTasksDone(): this is this & {
        checklistTasksDone: TelegramChecklistTasksDone;
    } {
        return this.raw.checklist_tasks_done != null;
    }
    /**
     * true if `checklist_tasks_added` is set
     */
    hasChecklistTasksAdded(): this is this & {
        checklistTasksAdded: TelegramChecklistTasksAdded;
    } {
        return this.raw.checklist_tasks_added != null;
    }
    /**
     * true if `community_chat_added` is set
     */
    hasCommunityChatAdded(): this is this & {
        communityChatAdded: TelegramCommunityChatAdded;
    } {
        return this.raw.community_chat_added != null;
    }
    /**
     * true if `community_chat_joined` is set
     */
    hasCommunityChatJoined(): this is this & {
        communityChatJoined: TelegramCommunityChatJoined;
    } {
        return this.raw.community_chat_joined != null;
    }
    /**
     * true if `community_chat_removed` is set
     */
    hasCommunityChatRemoved(): this is this & {
        communityChatRemoved: TelegramCommunityChatRemoved;
    } {
        return this.raw.community_chat_removed != null;
    }
    /**
     * true if `direct_message_price_changed` is set
     */
    hasDirectMessagePriceChanged(): this is this & {
        directMessagePriceChanged: TelegramDirectMessagePriceChanged;
    } {
        return this.raw.direct_message_price_changed != null;
    }
    /**
     * true if `forum_topic_created` is set
     */
    hasForumTopicCreated(): this is this & {
        forumTopicCreated: ForumTopicCreated;
    } {
        return this.raw.forum_topic_created != null;
    }
    /**
     * true if `forum_topic_edited` is set
     */
    hasForumTopicEdited(): this is this & {
        forumTopicEdited: ForumTopicEdited;
    } {
        return this.raw.forum_topic_edited != null;
    }
    /**
     * true if `forum_topic_closed` is set
     */
    hasForumTopicClosed(): this is this & {
        forumTopicClosed: TelegramForumTopicClosed;
    } {
        return this.raw.forum_topic_closed != null;
    }
    /**
     * true if `forum_topic_reopened` is set
     */
    hasForumTopicReopened(): this is this & {
        forumTopicReopened: TelegramForumTopicReopened;
    } {
        return this.raw.forum_topic_reopened != null;
    }
    /**
     * true if `general_forum_topic_hidden` is set
     */
    hasGeneralForumTopicHidden(): this is this & {
        generalForumTopicHidden: TelegramGeneralForumTopicHidden;
    } {
        return this.raw.general_forum_topic_hidden != null;
    }
    /**
     * true if `general_forum_topic_unhidden` is set
     */
    hasGeneralForumTopicUnhidden(): this is this & {
        generalForumTopicUnhidden: TelegramGeneralForumTopicUnhidden;
    } {
        return this.raw.general_forum_topic_unhidden != null;
    }
    /**
     * true if `giveaway_created` is set
     */
    hasGiveawayCreated(): this is this & {
        giveawayCreated: TelegramGiveawayCreated;
    } {
        return this.raw.giveaway_created != null;
    }
    /**
     * true if `giveaway` is set
     */
    hasGiveaway(): this is this & {
        giveaway: Giveaway;
    } {
        return this.raw.giveaway != null;
    }
    /**
     * true if `giveaway_winners` is set
     */
    hasGiveawayWinners(): this is this & {
        giveawayWinners: GiveawayWinners;
    } {
        return this.raw.giveaway_winners != null;
    }
    /**
     * true if `giveaway_completed` is set
     */
    hasGiveawayCompleted(): this is this & {
        giveawayCompleted: GiveawayCompleted;
    } {
        return this.raw.giveaway_completed != null;
    }
    /**
     * true if `managed_bot_created` is set
     */
    hasManagedBotCreated(): this is this & {
        managedBotCreated: TelegramManagedBotCreated;
    } {
        return this.raw.managed_bot_created != null;
    }
    /**
     * true if `paid_message_price_changed` is set
     */
    hasPaidMessagePriceChanged(): this is this & {
        paidMessagePriceChanged: TelegramPaidMessagePriceChanged;
    } {
        return this.raw.paid_message_price_changed != null;
    }
    /**
     * true if `paid_messages_waived` is set
     */
    hasPaidMessagesWaived(): this is this & {
        paidMessagesWaived: PaidMessagesWaived;
    } {
        return this.raw.paid_messages_waived != null;
    }
    /**
     * true if `poll_option_added` is set
     */
    hasPollOptionAdded(): this is this & {
        pollOptionAdded: TelegramPollOptionAdded;
    } {
        return this.raw.poll_option_added != null;
    }
    /**
     * true if `poll_option_deleted` is set
     */
    hasPollOptionDeleted(): this is this & {
        pollOptionDeleted: TelegramPollOptionDeleted;
    } {
        return this.raw.poll_option_deleted != null;
    }
    /**
     * true if `suggested_post_approved` is set
     */
    hasSuggestedPostApproved(): this is this & {
        suggestedPostApproved: TelegramSuggestedPostApproved;
    } {
        return this.raw.suggested_post_approved != null;
    }
    /**
     * true if `suggested_post_approval_failed` is set
     */
    hasSuggestedPostApprovalFailed(): this is this & {
        suggestedPostApprovalFailed: TelegramSuggestedPostApprovalFailed;
    } {
        return this.raw.suggested_post_approval_failed != null;
    }
    /**
     * true if `suggested_post_declined` is set
     */
    hasSuggestedPostDeclined(): this is this & {
        suggestedPostDeclined: TelegramSuggestedPostDeclined;
    } {
        return this.raw.suggested_post_declined != null;
    }
    /**
     * true if `suggested_post_paid` is set
     */
    hasSuggestedPostPaid(): this is this & {
        suggestedPostPaid: TelegramSuggestedPostPaid;
    } {
        return this.raw.suggested_post_paid != null;
    }
    /**
     * true if `suggested_post_refunded` is set
     */
    hasSuggestedPostRefunded(): this is this & {
        suggestedPostRefunded: TelegramSuggestedPostRefunded;
    } {
        return this.raw.suggested_post_refunded != null;
    }
    /**
     * true if `ton_wallet_transfer` is set
     */
    hasTonWalletTransfer(): this is this & {
        tonWalletTransfer: TonWalletTransfer;
    } {
        return this.raw.ton_wallet_transfer != null;
    }
    /**
     * true if `video_chat_scheduled` is set
     */
    hasVideoChatScheduled(): this is this & {
        videoChatScheduled: VideoChatScheduled;
    } {
        return this.raw.video_chat_scheduled != null;
    }
    /**
     * true if `video_chat_started` is set
     */
    hasVideoChatStarted(): this is this & {
        videoChatStarted: TelegramVideoChatStarted;
    } {
        return this.raw.video_chat_started != null;
    }
    /**
     * true if `video_chat_ended` is set
     */
    hasVideoChatEnded(): this is this & {
        videoChatEnded: VideoChatEnded;
    } {
        return this.raw.video_chat_ended != null;
    }
    /**
     * true if `video_chat_participants_invited` is set
     */
    hasVideoChatParticipantsInvited(): this is this & {
        videoChatParticipantsInvited: VideoChatParticipantsInvited;
    } {
        return this.raw.video_chat_participants_invited != null;
    }
    /**
     * true if `web_app_data` is set
     */
    hasWebAppData(): this is this & {
        webAppData: WebAppData;
    } {
        return this.raw.web_app_data != null;
    }
    /**
     * true if `reply_markup` is set
     */
    hasReplyMarkup(): this is this & {
        replyMarkup: InlineKeyboardMarkup;
    } {
        return this.raw.reply_markup != null;
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    /**
     * shortcut for `chat.id`
     */
    get chatId(): number {
        return this.raw.chat.id;
    }
    /**
     * best-effort sender id: `from.id` → `sender_chat.id` → `chat.id`
     */
    get senderId(): number {
        return this.raw.from?.id ?? this.raw.sender_chat?.id ?? this.raw.chat.id;
    }
    /**
     * shortcut for `reply_to_message?.message_id`
     */
    get replyToMessageId(): number | undefined {
        return this.raw.reply_to_message?.message_id;
    }
    /**
     * deep-link payload after `/start` (`t.me/<bot>?start=<payload>`) — grounded in the `bot_command` entity telegram parsed, so text that merely looks like a command never matches, and a `/start@other_bot` addressed to a different bot yields `undefined` (mentions are checked against `tg.bot.username`). `undefined` when this is not a `/start` command or no payload was sent. see also `filters.start` (regex-based and mention-agnostic by design)
     */
    get startPayload(): string | undefined {
        const text = this.raw.text;
        const entity = this.raw.entities?.find(e => e.type === "bot_command" && e.offset === 0);
        if (text == null || entity == null || !Number.isInteger(entity.length) || entity.length <= 0) {
            return undefined;
        }
        const parts = text.slice(1, entity.length).split("@");
        if ((parts[0] ?? "").toLowerCase() !== "start") {
            return undefined;
        }
        const mention = parts[1];
        if (mention !== undefined) {
            const ours = this.tg.bot?.username;
            if (ours === undefined || mention.toLowerCase() !== ours.toLowerCase()) {
                return undefined;
            }
        }
        const payload = text.slice(entity.length).trim();
        return payload.length > 0 ? payload : undefined;
    }
    /**
     * true if this message has `reply_to_message`
     */
    hasReplyToMessage(): this is Has<this, "replyToMessage" | "replyToMessageId"> {
        return this.raw.reply_to_message != null;
    }
    /**
     * true if this message is a `/start` command carrying a deep-link payload
     */
    hasStartPayload(): this is Has<this, "startPayload"> {
        return this.startPayload !== undefined;
    }
    /**
     * true if any `entities` item has the given `type`
     */
    hasEntitiesOf(type: string): boolean {
        return this.raw.entities?.some(e => e.type === type) ?? false;
    }
    /**
     * true if any `caption_entities` item has the given `type`
     */
    hasCaptionEntitiesOf(type: string): boolean {
        return this.raw.caption_entities?.some(e => e.type === type) ?? false;
    }
    /**
     * alias for `hasForwardOrigin()`
     */
    isForwarded(): this is Has<this, "forwardOrigin"> {
        return this.raw.forward_origin != null;
    }
    /**
     * true if this message is a reply
     */
    isReply(): this is Has<this, "replyToMessage" | "replyToMessageId"> {
        return this.raw.reply_to_message != null;
    }
    /**
     * true if this message is ephemeral (visible only to one user and the bot). sends/replies from an ephemeral context auto-fill the ephemeral params — pass `ephemeral: false` to send a regular message instead
     */
    isEphemeral(): this is Has<this, "ephemeralMessageId"> {
        return this.raw.ephemeral_message_id != null;
    }
    /**
     * true if this message is part of a media group (album). use `await update.collectMediaGroup()` from `@puregram/flow` to fetch the full album
     */
    isMediaGroup(): boolean {
        return this.raw.media_group_id != null;
    }
    /**
     * true if `chat.type === "private"`
     */
    isPrivate(): boolean {
        return this.raw.chat.type === "private";
    }
    /**
     * true if `chat.type === "group"` (strict — supergroups excluded)
     */
    isGroup(): boolean {
        return this.raw.chat.type === "group";
    }
    /**
     * true if `chat.type === "supergroup"`
     */
    isSupergroup(): boolean {
        return this.raw.chat.type === "supergroup";
    }
    /**
     * true if `chat.type === "channel"`
     */
    isChannel(): boolean {
        return this.raw.chat.type === "channel";
    }
    /**
     * download the message attachment as a `Uint8Array`. returns `null` if the message has no media. auto-picks with priority `document > video > audio > voice > video_note > animation > live_photo > photo[largest] > sticker`
     */
    download(): Promise<Uint8Array | null> {
        const t = this.raw.document ?? this.raw.video ?? this.raw.audio ?? this.raw.voice ?? this.raw.video_note ?? this.raw.animation ?? this.raw.live_photo ?? this.raw.photo ?? this.raw.sticker;
        return t == null ? Promise.resolve(null) : this.tg.download(t);
    }
    /**
     * download the message attachment as a node `Readable`. returns `null` if no media
     */
    downloadStream(): Promise<Readable | null> {
        const t = this.raw.document ?? this.raw.video ?? this.raw.audio ?? this.raw.voice ?? this.raw.video_note ?? this.raw.animation ?? this.raw.live_photo ?? this.raw.photo ?? this.raw.sticker;
        return t == null ? Promise.resolve(null) : this.tg.downloadStream(t);
    }
    /**
     * download the message attachment as an async-iterable byte stream. returns `null` if no media
     */
    downloadIterable(): Promise<AsyncIterable<Uint8Array> | null> {
        const t = this.raw.document ?? this.raw.video ?? this.raw.audio ?? this.raw.voice ?? this.raw.video_note ?? this.raw.animation ?? this.raw.live_photo ?? this.raw.photo ?? this.raw.sticker;
        return t == null ? Promise.resolve(null) : this.tg.downloadIterable(t);
    }
    /**
     * download the message attachment to disk. returns `null` if no media; otherwise resolves once the file is fully written
     */
    downloadToFile(path: string): Promise<void | null> {
        const t = this.raw.document ?? this.raw.video ?? this.raw.audio ?? this.raw.voice ?? this.raw.video_note ?? this.raw.animation ?? this.raw.live_photo ?? this.raw.photo ?? this.raw.sticker;
        return t == null ? Promise.resolve(null) : this.tg.downloadToFile(path, t).then(() => undefined as void | null);
    }
    /**
     * create a controller that re-sends `sendChatAction(action)` every `interval` ms (default 5000) until `stop()` is called — telegram clears the action after ~5 seconds, so a long task needs it refreshed
     */
    createActionController(action: ActionControllerLike["action"], options?: ActionControllerParams): ActionControllerLike {
        return this.tg.createActionController(this.raw.chat.id, action, { ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }), ...options });
    }
    /**
     * run `fn` while continuously sending `sendChatAction(action)`. the action auto-stops when `fn` settles — even if it throws — and `fn`'s result is returned
     */
    withChatAction<T>(action: ActionControllerLike["action"], fn: () => Promise<T> | T, options?: ActionControllerParams): Promise<T> {
        return this.tg.withChatAction(this.raw.chat.id, action, fn, { ...(this.raw.business_connection_id != null && { business_connection_id: this.raw.business_connection_id }), ...options });
    }
    /**
     * react to this message — an emoji string for the common case, or a reaction array for custom / multiple
     */
    react(reaction: string | TelegramReactionType[], params?: Omit<SetMessageReactionParams, "chat_id" | "message_id" | "reaction">): Promise<true> {
        return this.tg.api.setMessageReaction({ chat_id: this.raw.chat.id, message_id: this.raw.message_id, reaction: typeof reaction === "string" ? [{ type: "emoji", emoji: reaction }] : reaction, ...params });
    }
    /**
     * edit this message to rich content (build it with @puregram/rich)
     */
    editRich(richMessage: TelegramInputRichMessage | RichLike, params?: Omit<EditMessageTextParams, "chat_id" | "message_id" | "rich_message" | "text">): Promise<TelegramMessage> {
        return this.tg.api.editMessageText({ chat_id: this.raw.chat.id, message_id: this.raw.message_id, rich_message: richMessage, ...params });
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    /**
     * shortcut for `tg.api.answerGuestQuery`
     */
    answer(result: TelegramInlineQueryResult, params: {} = {}) {
        return this.tg.api.answerGuestQuery({
            guest_query_id: this.raw.guest_query_id as NonNullable<typeof this.raw.guest_query_id>,
            result: result,
            ...params
        });
    }
    /**
     * thread-scoped shortcuts — auto-fill `message_thread_id` on every call. `undefined` when this message is not in a thread / forum topic
     */
    get thread(): MessageThreadShortcuts | undefined {
        return this.raw.message_thread_id == null ? undefined : new MessageThreadShortcuts(this.raw, this.tg);
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("GuestMessageUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `message_reaction` event
 */
export class MessageReactionUpdate {
    readonly kind = "message_reaction" as const;
    private _chat?: Chat;
    private _user?: User;
    private _actorChat?: Chat;
    private _oldReaction?: Reactions;
    private _newReaction?: Reactions;
    constructor(public raw: TelegramMessageReactionUpdated, public readonly tg: TelegramLike) { }
    /**
     * The chat containing the message the user reacted to
     */
    get chat(): Chat {
        return this._chat ??= new Chat(this.raw.chat);
    }
    /**
     * Unique identifier of the message inside the chat
     */
    get id(): number {
        return this.raw.message_id;
    }
    /**
     * Optional. The user that changed the reaction, if the user isn't anonymous
     */
    get user(): User | undefined {
        return this.raw.user ? (this._user ??= new User(this.raw.user)) : undefined;
    }
    /**
     * Optional. The chat on behalf of which the reaction was changed, if the user is anonymous
     */
    get actorChat(): Chat | undefined {
        return this.raw.actor_chat ? (this._actorChat ??= new Chat(this.raw.actor_chat)) : undefined;
    }
    /**
     * Date of the change in Unix time
     */
    get date(): number {
        return this.raw.date;
    }
    /**
     * Previous list of reaction types that were set by the user
     */
    get oldReaction(): Reactions {
        return this._oldReaction ??= new Reactions(this.raw.old_reaction);
    }
    /**
     * New list of reaction types that have been set by the user
     */
    get newReaction(): Reactions {
        return this._newReaction ??= new Reactions(this.raw.new_reaction);
    }
    /**
     * true if `user` is set
     */
    hasUser(): this is this & {
        user: User;
    } {
        return this.raw.user != null;
    }
    /**
     * true if `actor_chat` is set
     */
    hasActorChat(): this is this & {
        actorChat: Chat;
    } {
        return this.raw.actor_chat != null;
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    /**
     * reactions present in `newReaction` but not in `oldReaction`
     */
    get added(): Reactions {
        return new Reactions(this.raw.new_reaction.filter(r => !this.oldReaction.includes(r)));
    }
    /**
     * reactions present in `oldReaction` but not in `newReaction`
     */
    get removed(): Reactions {
        return new Reactions(this.raw.old_reaction.filter(r => !this.newReaction.includes(r)));
    }
    /**
     * best-effort sender id: `user.id` → `actor_chat.id`
     */
    get senderId(): number | undefined {
        return this.raw.user?.id ?? this.raw.actor_chat?.id;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("MessageReactionUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `message_reaction_count` event
 */
export class MessageReactionCountUpdate {
    readonly kind = "message_reaction_count" as const;
    private _chat?: Chat;
    private _reactions?: ReactionCounts;
    constructor(public raw: TelegramMessageReactionCountUpdated, public readonly tg: TelegramLike) { }
    /**
     * The chat containing the message
     */
    get chat(): Chat {
        return this._chat ??= new Chat(this.raw.chat);
    }
    /**
     * Unique message identifier inside the chat
     */
    get id(): number {
        return this.raw.message_id;
    }
    /**
     * Date of the change in Unix time
     */
    get date(): number {
        return this.raw.date;
    }
    /**
     * List of reactions that are present on the message
     */
    get reactions(): ReactionCounts {
        return this._reactions ??= new ReactionCounts(this.raw.reactions);
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("MessageReactionCountUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `inline_query` event
 */
export class InlineQueryUpdate {
    readonly kind = "inline_query" as const;
    private _from?: User;
    private _location?: Location;
    constructor(public raw: TelegramInlineQuery, public readonly tg: TelegramLike) { }
    /**
     * Unique identifier for this query
     */
    get id(): string {
        return this.raw.id;
    }
    /**
     * Sender
     */
    get from(): User {
        return this._from ??= new User(this.raw.from);
    }
    /**
     * Text of the query (up to 256 characters)
     */
    get query(): string {
        return this.raw.query;
    }
    /**
     * Offset of the results to be returned, can be controlled by the bot
     */
    get offset(): string {
        return this.raw.offset;
    }
    /**
     * Optional. Type of the chat from which the inline query was sent. Can be either “sender” for a private chat with the inline query sender, “private”, “group”, “supergroup”, or “channel”. The chat type should be always known for requests sent from official clients and most third-party clients, unless the request was sent from a secret chat.
     */
    get chatType(): ("sender" | "private" | "group" | "supergroup" | "channel") | undefined {
        return this.raw.chat_type;
    }
    /**
     * Optional. Sender location, only for bots that request user location
     */
    get location(): Location | undefined {
        return this.raw.location ? (this._location ??= new Location(this.raw.location)) : undefined;
    }
    /**
     * true if `chat_type` is set
     */
    hasChatType(): this is this & {
        chatType: "sender" | "private" | "group" | "supergroup" | "channel";
    } {
        return this.raw.chat_type != null;
    }
    /**
     * true if `location` is set
     */
    hasLocation(): this is this & {
        location: Location;
    } {
        return this.raw.location != null;
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    /**
     * shortcut for `from.id` — uniform sender id across update kinds
     */
    get senderId(): number {
        return this.raw.from.id;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    /**
     * shortcut for `tg.api.answerInlineQuery`
     */
    answer(results: TelegramInlineQueryResult[], params: {
        cache_time?: number;
        is_personal?: boolean;
        next_offset?: string;
        button?: TelegramInlineQueryResultsButton;
    } = {}) {
        return this.tg.api.answerInlineQuery({
            inline_query_id: this.raw.id,
            results: results,
            ...params
        });
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("InlineQueryUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `chosen_inline_result` event
 */
export class ChosenInlineResultUpdate {
    readonly kind = "chosen_inline_result" as const;
    private _from?: User;
    private _location?: Location;
    constructor(public raw: TelegramChosenInlineResult, public readonly tg: TelegramLike) { }
    /**
     * The unique identifier for the result that was chosen
     */
    get resultId(): string {
        return this.raw.result_id;
    }
    /**
     * The user that chose the result
     */
    get from(): User {
        return this._from ??= new User(this.raw.from);
    }
    /**
     * Optional. Sender location, only for bots that require user location
     */
    get location(): Location | undefined {
        return this.raw.location ? (this._location ??= new Location(this.raw.location)) : undefined;
    }
    /**
     * Optional. Identifier of the sent inline message. Available only if there is an inline keyboard attached to the message. Will be also received in callback queries and can be used to edit the message.
     */
    get inlineMessageId(): string | undefined {
        return this.raw.inline_message_id;
    }
    /**
     * The query that was used to obtain the result
     */
    get query(): string {
        return this.raw.query;
    }
    /**
     * true if `location` is set
     */
    hasLocation(): this is this & {
        location: Location;
    } {
        return this.raw.location != null;
    }
    /**
     * true if `inline_message_id` is set
     */
    hasInlineMessageId(): this is this & {
        inlineMessageId: string;
    } {
        return this.raw.inline_message_id != null;
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    /**
     * shortcut for `from.id` — uniform sender id across update kinds
     */
    get senderId(): number {
        return this.raw.from.id;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ChosenInlineResultUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `callback_query` event
 */
export class CallbackQueryUpdate {
    readonly kind = "callback_query" as const;
    private _from?: User;
    constructor(public raw: TelegramCallbackQuery, public readonly tg: TelegramLike) { }
    /**
     * Unique identifier for this query
     */
    get id(): string {
        return this.raw.id;
    }
    /**
     * Sender
     */
    get from(): User {
        return this._from ??= new User(this.raw.from);
    }
    /**
     * Optional. Message sent by the bot with the callback button that originated the query
     */
    get message(): TelegramMaybeInaccessibleMessage | undefined {
        return this.raw.message;
    }
    /**
     * Optional. Identifier of the message sent via the bot in inline mode, that originated the query
     */
    get inlineMessageId(): string | undefined {
        return this.raw.inline_message_id;
    }
    /**
     * Global identifier, uniquely corresponding to the chat to which the message with the callback button was sent. Useful for high scores in games.
     */
    get chatInstance(): string {
        return this.raw.chat_instance;
    }
    /**
     * Optional. Data associated with the callback button. Be aware that the message originated the query can contain no callback buttons with this data.
     */
    get data(): string | undefined {
        return this.raw.data;
    }
    /**
     * Optional. Short name of a Game to be returned, serves as the unique identifier for the game
     */
    get gameShortName(): string | undefined {
        return this.raw.game_short_name;
    }
    /**
     * true if `message` is set
     */
    hasMessage(): this is this & {
        message: TelegramMaybeInaccessibleMessage;
    } {
        return this.raw.message != null;
    }
    /**
     * true if `inline_message_id` is set
     */
    hasInlineMessageId(): this is this & {
        inlineMessageId: string;
    } {
        return this.raw.inline_message_id != null;
    }
    /**
     * true if `data` is set
     */
    hasData(): this is this & {
        data: string;
    } {
        return this.raw.data != null;
    }
    /**
     * true if `game_short_name` is set
     */
    hasGameShortName(): this is this & {
        gameShortName: string;
    } {
        return this.raw.game_short_name != null;
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    /**
     * shortcut for `message?.chat.id`
     */
    get chatId(): number | undefined {
        return this.raw.message?.chat.id;
    }
    /**
     * shortcut for `message?.message_id`
     */
    get messageId(): number | undefined {
        return this.raw.message?.message_id;
    }
    /**
     * shortcut for `from.id` — alias of `senderId`
     */
    get userId(): number {
        return this.raw.from.id;
    }
    /**
     * shortcut for `tg.api.editMessageText` on the message this callback query came from — auto-fills `chat_id` + `message_id`, or `inline_message_id` for inline-mode messages (those resolve `true` instead of the edited message)
     */
    edit(text: string | Formattable, params?: Omit<EditMessageTextParams, "chat_id" | "message_id" | "inline_message_id" | "text">): Promise<TelegramMessage | true> {
        const m = this.raw.message;
        const ref = this.raw.inline_message_id != null ? { inline_message_id: this.raw.inline_message_id } : m != null ? { chat_id: m.chat.id, message_id: m.message_id } : undefined;
        if (ref == null) {
            throw new TypeError("callback query carries neither message nor inline_message_id");
        }
        return this.tg.api.editMessageText({ ...ref, text, ...params });
    }
    /**
     * shortcut for `tg.api.editMessageCaption` on the message this callback query came from — inline-mode edits resolve `true`
     */
    editCaption(params?: Omit<EditMessageCaptionParams, "chat_id" | "message_id" | "inline_message_id">): Promise<TelegramMessage | true> {
        const m = this.raw.message;
        const ref = this.raw.inline_message_id != null ? { inline_message_id: this.raw.inline_message_id } : m != null ? { chat_id: m.chat.id, message_id: m.message_id } : undefined;
        if (ref == null) {
            throw new TypeError("callback query carries neither message nor inline_message_id");
        }
        return this.tg.api.editMessageCaption({ ...ref, ...params });
    }
    /**
     * shortcut for `tg.api.editMessageMedia` on the message this callback query came from — inline-mode edits resolve `true`
     */
    editMedia(media: EditMessageMediaParams["media"], params?: Omit<EditMessageMediaParams, "chat_id" | "message_id" | "inline_message_id" | "media">): Promise<TelegramMessage | true> {
        const m = this.raw.message;
        const ref = this.raw.inline_message_id != null ? { inline_message_id: this.raw.inline_message_id } : m != null ? { chat_id: m.chat.id, message_id: m.message_id } : undefined;
        if (ref == null) {
            throw new TypeError("callback query carries neither message nor inline_message_id");
        }
        return this.tg.api.editMessageMedia({ ...ref, media, ...params });
    }
    /**
     * shortcut for `tg.api.editMessageReplyMarkup` on the message this callback query came from — the pager pattern: swap the keyboard in place. inline-mode edits resolve `true`
     */
    editReplyMarkup(params?: Omit<EditMessageReplyMarkupParams, "chat_id" | "message_id" | "inline_message_id">): Promise<TelegramMessage | true> {
        const m = this.raw.message;
        const ref = this.raw.inline_message_id != null ? { inline_message_id: this.raw.inline_message_id } : m != null ? { chat_id: m.chat.id, message_id: m.message_id } : undefined;
        if (ref == null) {
            throw new TypeError("callback query carries neither message nor inline_message_id");
        }
        return this.tg.api.editMessageReplyMarkup({ ...ref, ...params });
    }
    /**
     * edit the message this callback query came from to rich content (build it with @puregram/rich) — inline-mode edits resolve `true`
     */
    editRich(richMessage: TelegramInputRichMessage | RichLike, params?: Omit<EditMessageTextParams, "chat_id" | "message_id" | "inline_message_id" | "rich_message" | "text">): Promise<TelegramMessage | true> {
        const m = this.raw.message;
        const ref = this.raw.inline_message_id != null ? { inline_message_id: this.raw.inline_message_id } : m != null ? { chat_id: m.chat.id, message_id: m.message_id } : undefined;
        if (ref == null) {
            throw new TypeError("callback query carries neither message nor inline_message_id");
        }
        return this.tg.api.editMessageText({ ...ref, rich_message: richMessage, ...params });
    }
    /**
     * shortcut for `tg.api.deleteMessage` on the message this callback query came from. throws for inline-mode messages — there is nothing to delete
     */
    delete(params?: Omit<DeleteMessageParams, "chat_id" | "message_id">): Promise<true> {
        const m = this.raw.message;
        if (m == null) {
            throw new TypeError("cannot delete an inline-mode message \u2014 deleteMessage needs chat_id + message_id");
        }
        return this.tg.api.deleteMessage({ chat_id: m.chat.id, message_id: m.message_id, ...params });
    }
    /**
     * shortcut for `from.id` — uniform sender id across update kinds
     */
    get senderId(): number {
        return this.raw.from.id;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    /**
     * shortcut for `tg.api.answerCallbackQuery`
     */
    answer(params: {
        text?: string;
        show_alert?: boolean;
        url?: string;
        cache_time?: number;
    } = {}) {
        return this.tg.api.answerCallbackQuery({
            callback_query_id: this.raw.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendAnimation` — pass `ephemeral: true` or `ephemeral_message_parameters` to send an ephemeral response; callback-only sends may omit the chat argument
     */
    sendAnimation(...args: [
        chat: number | string,
        animation: TelegramInputFile | string,
        params?: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            duration?: number;
            width?: number;
            height?: number;
            thumbnail?: TelegramInputFile | string;
            caption?: string | Formattable;
            parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
            caption_entities?: TelegramMessageEntity[];
            show_caption_above_media?: boolean;
            has_spoiler?: boolean;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        }
    ] | [
        animation: TelegramInputFile | string,
        params: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            duration?: number;
            width?: number;
            height?: number;
            thumbnail?: TelegramInputFile | string;
            caption?: string | Formattable;
            parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
            caption_entities?: TelegramMessageEntity[];
            show_caption_above_media?: boolean;
            has_spoiler?: boolean;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        } & ({
            ephemeral: true;
        } | {
            ephemeral_message_parameters: TelegramEphemeralMessageParameters;
        })
    ]) {
        const options = args[1];
        const callbackOnly = args.length === 2 && options != null && typeof options === "object" && ("ephemeral" in options || "ephemeral_message_parameters" in options);
        const [chat, animation, params = {}] = (callbackOnly ? [undefined, ...args] : args) as [
            chat: (number | string) | undefined,
            animation: TelegramInputFile | string,
            params?: {
                business_connection_id?: string;
                message_thread_id?: number;
                direct_messages_topic_id?: number;
                ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
                duration?: number;
                width?: number;
                height?: number;
                thumbnail?: TelegramInputFile | string;
                caption?: string | Formattable;
                parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
                caption_entities?: TelegramMessageEntity[];
                show_caption_above_media?: boolean;
                has_spoiler?: boolean;
                disable_notification?: boolean;
                protect_content?: boolean;
                allow_paid_broadcast?: boolean;
                message_effect_id?: string;
                suggested_post_parameters?: TelegramSuggestedPostParameters;
                reply_parameters?: TelegramReplyParameters;
                reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                    toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
                };
                ephemeral?: boolean;
            }
        ];
        return this.tg.api.sendAnimation({
            ...chat == null ? {} : { chat_id: chat },
            animation: animation,
            ...params,
            ...callbackEphemeralParams(this.raw.id, params)
        });
    }
    /**
     * shortcut for `tg.api.sendAudio` — pass `ephemeral: true` or `ephemeral_message_parameters` to send an ephemeral response; callback-only sends may omit the chat argument
     */
    sendAudio(...args: [
        chat: number | string,
        audio: TelegramInputFile | string,
        params?: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            caption?: string | Formattable;
            parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
            caption_entities?: TelegramMessageEntity[];
            duration?: number;
            performer?: string;
            title?: string;
            thumbnail?: TelegramInputFile | string;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        }
    ] | [
        audio: TelegramInputFile | string,
        params: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            caption?: string | Formattable;
            parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
            caption_entities?: TelegramMessageEntity[];
            duration?: number;
            performer?: string;
            title?: string;
            thumbnail?: TelegramInputFile | string;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        } & ({
            ephemeral: true;
        } | {
            ephemeral_message_parameters: TelegramEphemeralMessageParameters;
        })
    ]) {
        const options = args[1];
        const callbackOnly = args.length === 2 && options != null && typeof options === "object" && ("ephemeral" in options || "ephemeral_message_parameters" in options);
        const [chat, audio, params = {}] = (callbackOnly ? [undefined, ...args] : args) as [
            chat: (number | string) | undefined,
            audio: TelegramInputFile | string,
            params?: {
                business_connection_id?: string;
                message_thread_id?: number;
                direct_messages_topic_id?: number;
                ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
                caption?: string | Formattable;
                parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
                caption_entities?: TelegramMessageEntity[];
                duration?: number;
                performer?: string;
                title?: string;
                thumbnail?: TelegramInputFile | string;
                disable_notification?: boolean;
                protect_content?: boolean;
                allow_paid_broadcast?: boolean;
                message_effect_id?: string;
                suggested_post_parameters?: TelegramSuggestedPostParameters;
                reply_parameters?: TelegramReplyParameters;
                reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                    toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
                };
                ephemeral?: boolean;
            }
        ];
        return this.tg.api.sendAudio({
            ...chat == null ? {} : { chat_id: chat },
            audio: audio,
            ...params,
            ...callbackEphemeralParams(this.raw.id, params)
        });
    }
    /**
     * shortcut for `tg.api.sendContact` — pass `ephemeral: true` or `ephemeral_message_parameters` to send an ephemeral response; callback-only sends may omit the chat argument
     */
    sendContact(...args: [
        chat: number | string,
        phoneNumber: string,
        firstName: string,
        params?: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            last_name?: string;
            vcard?: string;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        }
    ] | [
        phoneNumber: string,
        firstName: string,
        params: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            last_name?: string;
            vcard?: string;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        } & ({
            ephemeral: true;
        } | {
            ephemeral_message_parameters: TelegramEphemeralMessageParameters;
        })
    ]) {
        const options = args[2];
        const callbackOnly = args.length === 3 && options != null && typeof options === "object" && ("ephemeral" in options || "ephemeral_message_parameters" in options);
        const [chat, phoneNumber, firstName, params = {}] = (callbackOnly ? [undefined, ...args] : args) as [
            chat: (number | string) | undefined,
            phoneNumber: string,
            firstName: string,
            params?: {
                business_connection_id?: string;
                message_thread_id?: number;
                direct_messages_topic_id?: number;
                ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
                last_name?: string;
                vcard?: string;
                disable_notification?: boolean;
                protect_content?: boolean;
                allow_paid_broadcast?: boolean;
                message_effect_id?: string;
                suggested_post_parameters?: TelegramSuggestedPostParameters;
                reply_parameters?: TelegramReplyParameters;
                reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                    toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
                };
                ephemeral?: boolean;
            }
        ];
        return this.tg.api.sendContact({
            ...chat == null ? {} : { chat_id: chat },
            phone_number: phoneNumber,
            first_name: firstName,
            ...params,
            ...callbackEphemeralParams(this.raw.id, params)
        });
    }
    /**
     * shortcut for `tg.api.sendDocument` — pass `ephemeral: true` or `ephemeral_message_parameters` to send an ephemeral response; callback-only sends may omit the chat argument
     */
    sendDocument(...args: [
        chat: number | string,
        document: TelegramInputFile | string,
        params?: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            thumbnail?: TelegramInputFile | string;
            caption?: string | Formattable;
            parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
            caption_entities?: TelegramMessageEntity[];
            disable_content_type_detection?: boolean;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        }
    ] | [
        document: TelegramInputFile | string,
        params: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            thumbnail?: TelegramInputFile | string;
            caption?: string | Formattable;
            parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
            caption_entities?: TelegramMessageEntity[];
            disable_content_type_detection?: boolean;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        } & ({
            ephemeral: true;
        } | {
            ephemeral_message_parameters: TelegramEphemeralMessageParameters;
        })
    ]) {
        const options = args[1];
        const callbackOnly = args.length === 2 && options != null && typeof options === "object" && ("ephemeral" in options || "ephemeral_message_parameters" in options);
        const [chat, document, params = {}] = (callbackOnly ? [undefined, ...args] : args) as [
            chat: (number | string) | undefined,
            document: TelegramInputFile | string,
            params?: {
                business_connection_id?: string;
                message_thread_id?: number;
                direct_messages_topic_id?: number;
                ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
                thumbnail?: TelegramInputFile | string;
                caption?: string | Formattable;
                parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
                caption_entities?: TelegramMessageEntity[];
                disable_content_type_detection?: boolean;
                disable_notification?: boolean;
                protect_content?: boolean;
                allow_paid_broadcast?: boolean;
                message_effect_id?: string;
                suggested_post_parameters?: TelegramSuggestedPostParameters;
                reply_parameters?: TelegramReplyParameters;
                reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                    toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
                };
                ephemeral?: boolean;
            }
        ];
        return this.tg.api.sendDocument({
            ...chat == null ? {} : { chat_id: chat },
            document: document,
            ...params,
            ...callbackEphemeralParams(this.raw.id, params)
        });
    }
    /**
     * shortcut for `tg.api.sendLivePhoto` — pass `ephemeral: true` or `ephemeral_message_parameters` to send an ephemeral response; callback-only sends may omit the chat argument
     */
    sendLivePhoto(...args: [
        chat: number | string,
        livePhoto: TelegramInputFile | string,
        photo: TelegramInputFile | string,
        params?: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            caption?: string | Formattable;
            parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
            caption_entities?: TelegramMessageEntity[];
            show_caption_above_media?: boolean;
            has_spoiler?: boolean;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        }
    ] | [
        livePhoto: TelegramInputFile | string,
        photo: TelegramInputFile | string,
        params: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            caption?: string | Formattable;
            parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
            caption_entities?: TelegramMessageEntity[];
            show_caption_above_media?: boolean;
            has_spoiler?: boolean;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        } & ({
            ephemeral: true;
        } | {
            ephemeral_message_parameters: TelegramEphemeralMessageParameters;
        })
    ]) {
        const options = args[2];
        const callbackOnly = args.length === 3 && options != null && typeof options === "object" && ("ephemeral" in options || "ephemeral_message_parameters" in options);
        const [chat, livePhoto, photo, params = {}] = (callbackOnly ? [undefined, ...args] : args) as [
            chat: (number | string) | undefined,
            livePhoto: TelegramInputFile | string,
            photo: TelegramInputFile | string,
            params?: {
                business_connection_id?: string;
                message_thread_id?: number;
                direct_messages_topic_id?: number;
                ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
                caption?: string | Formattable;
                parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
                caption_entities?: TelegramMessageEntity[];
                show_caption_above_media?: boolean;
                has_spoiler?: boolean;
                disable_notification?: boolean;
                protect_content?: boolean;
                allow_paid_broadcast?: boolean;
                message_effect_id?: string;
                suggested_post_parameters?: TelegramSuggestedPostParameters;
                reply_parameters?: TelegramReplyParameters;
                reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                    toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
                };
                ephemeral?: boolean;
            }
        ];
        return this.tg.api.sendLivePhoto({
            ...chat == null ? {} : { chat_id: chat },
            live_photo: livePhoto,
            photo: photo,
            ...params,
            ...callbackEphemeralParams(this.raw.id, params)
        });
    }
    /**
     * shortcut for `tg.api.sendLocation` — pass `ephemeral: true` or `ephemeral_message_parameters` to send an ephemeral response; callback-only sends may omit the chat argument
     */
    sendLocation(...args: [
        chat: number | string,
        latitude: number,
        longitude: number,
        params?: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            horizontal_accuracy?: number;
            live_period?: number;
            heading?: number;
            proximity_alert_radius?: number;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        }
    ] | [
        latitude: number,
        longitude: number,
        params: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            horizontal_accuracy?: number;
            live_period?: number;
            heading?: number;
            proximity_alert_radius?: number;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        } & ({
            ephemeral: true;
        } | {
            ephemeral_message_parameters: TelegramEphemeralMessageParameters;
        })
    ]) {
        const options = args[2];
        const callbackOnly = args.length === 3 && options != null && typeof options === "object" && ("ephemeral" in options || "ephemeral_message_parameters" in options);
        const [chat, latitude, longitude, params = {}] = (callbackOnly ? [undefined, ...args] : args) as [
            chat: (number | string) | undefined,
            latitude: number,
            longitude: number,
            params?: {
                business_connection_id?: string;
                message_thread_id?: number;
                direct_messages_topic_id?: number;
                ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
                horizontal_accuracy?: number;
                live_period?: number;
                heading?: number;
                proximity_alert_radius?: number;
                disable_notification?: boolean;
                protect_content?: boolean;
                allow_paid_broadcast?: boolean;
                message_effect_id?: string;
                suggested_post_parameters?: TelegramSuggestedPostParameters;
                reply_parameters?: TelegramReplyParameters;
                reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                    toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
                };
                ephemeral?: boolean;
            }
        ];
        return this.tg.api.sendLocation({
            ...chat == null ? {} : { chat_id: chat },
            latitude: latitude,
            longitude: longitude,
            ...params,
            ...callbackEphemeralParams(this.raw.id, params)
        });
    }
    /**
     * shortcut for `tg.api.sendMessage` — pass `ephemeral: true` or `ephemeral_message_parameters` to send an ephemeral response; callback-only sends may omit the chat argument
     */
    send(...args: [
        chat: number | string,
        text: string | Formattable,
        params?: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
            entities?: TelegramMessageEntity[];
            link_preview_options?: TelegramLinkPreviewOptions;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        }
    ] | [
        text: string | Formattable,
        params: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
            entities?: TelegramMessageEntity[];
            link_preview_options?: TelegramLinkPreviewOptions;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        } & ({
            ephemeral: true;
        } | {
            ephemeral_message_parameters: TelegramEphemeralMessageParameters;
        })
    ]) {
        const options = args[1];
        const callbackOnly = args.length === 2 && options != null && typeof options === "object" && ("ephemeral" in options || "ephemeral_message_parameters" in options);
        const [chat, text, params = {}] = (callbackOnly ? [undefined, ...args] : args) as [
            chat: (number | string) | undefined,
            text: string | Formattable,
            params?: {
                business_connection_id?: string;
                message_thread_id?: number;
                direct_messages_topic_id?: number;
                ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
                parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
                entities?: TelegramMessageEntity[];
                link_preview_options?: TelegramLinkPreviewOptions;
                disable_notification?: boolean;
                protect_content?: boolean;
                allow_paid_broadcast?: boolean;
                message_effect_id?: string;
                suggested_post_parameters?: TelegramSuggestedPostParameters;
                reply_parameters?: TelegramReplyParameters;
                reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                    toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
                };
                ephemeral?: boolean;
            }
        ];
        return this.tg.api.sendMessage({
            ...chat == null ? {} : { chat_id: chat },
            text: text,
            ...params,
            ...callbackEphemeralParams(this.raw.id, params)
        });
    }
    /**
     * shortcut for `tg.api.sendPhoto` — pass `ephemeral: true` or `ephemeral_message_parameters` to send an ephemeral response; callback-only sends may omit the chat argument
     */
    sendPhoto(...args: [
        chat: number | string,
        photo: TelegramInputFile | string,
        params?: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            caption?: string | Formattable;
            parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
            caption_entities?: TelegramMessageEntity[];
            show_caption_above_media?: boolean;
            has_spoiler?: boolean;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        }
    ] | [
        photo: TelegramInputFile | string,
        params: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            caption?: string | Formattable;
            parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
            caption_entities?: TelegramMessageEntity[];
            show_caption_above_media?: boolean;
            has_spoiler?: boolean;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        } & ({
            ephemeral: true;
        } | {
            ephemeral_message_parameters: TelegramEphemeralMessageParameters;
        })
    ]) {
        const options = args[1];
        const callbackOnly = args.length === 2 && options != null && typeof options === "object" && ("ephemeral" in options || "ephemeral_message_parameters" in options);
        const [chat, photo, params = {}] = (callbackOnly ? [undefined, ...args] : args) as [
            chat: (number | string) | undefined,
            photo: TelegramInputFile | string,
            params?: {
                business_connection_id?: string;
                message_thread_id?: number;
                direct_messages_topic_id?: number;
                ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
                caption?: string | Formattable;
                parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
                caption_entities?: TelegramMessageEntity[];
                show_caption_above_media?: boolean;
                has_spoiler?: boolean;
                disable_notification?: boolean;
                protect_content?: boolean;
                allow_paid_broadcast?: boolean;
                message_effect_id?: string;
                suggested_post_parameters?: TelegramSuggestedPostParameters;
                reply_parameters?: TelegramReplyParameters;
                reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                    toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
                };
                ephemeral?: boolean;
            }
        ];
        return this.tg.api.sendPhoto({
            ...chat == null ? {} : { chat_id: chat },
            photo: photo,
            ...params,
            ...callbackEphemeralParams(this.raw.id, params)
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessage` — pass `ephemeral: true` or `ephemeral_message_parameters` to send an ephemeral response; callback-only sends may omit the chat argument
     */
    sendRichMessage(...args: [
        chat: number | string,
        richMessage: TelegramInputRichMessage | RichLike,
        params?: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        }
    ] | [
        richMessage: TelegramInputRichMessage | RichLike,
        params: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        } & ({
            ephemeral: true;
        } | {
            ephemeral_message_parameters: TelegramEphemeralMessageParameters;
        })
    ]) {
        const options = args[1];
        const callbackOnly = args.length === 2 && options != null && typeof options === "object" && ("ephemeral" in options || "ephemeral_message_parameters" in options);
        const [chat, richMessage, params = {}] = (callbackOnly ? [undefined, ...args] : args) as [
            chat: (number | string) | undefined,
            richMessage: TelegramInputRichMessage | RichLike,
            params?: {
                business_connection_id?: string;
                message_thread_id?: number;
                direct_messages_topic_id?: number;
                ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
                disable_notification?: boolean;
                protect_content?: boolean;
                allow_paid_broadcast?: boolean;
                message_effect_id?: string;
                suggested_post_parameters?: TelegramSuggestedPostParameters;
                reply_parameters?: TelegramReplyParameters;
                reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                    toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
                };
                ephemeral?: boolean;
            }
        ];
        return this.tg.api.sendRichMessage({
            ...chat == null ? {} : { chat_id: chat },
            rich_message: richMessage,
            ...params,
            ...callbackEphemeralParams(this.raw.id, params)
        });
    }
    /**
     * shortcut for `tg.api.sendSticker` — pass `ephemeral: true` or `ephemeral_message_parameters` to send an ephemeral response; callback-only sends may omit the chat argument
     */
    sendSticker(...args: [
        chat: number | string,
        sticker: TelegramInputFile | string,
        params?: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            emoji?: string;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        }
    ] | [
        sticker: TelegramInputFile | string,
        params: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            emoji?: string;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        } & ({
            ephemeral: true;
        } | {
            ephemeral_message_parameters: TelegramEphemeralMessageParameters;
        })
    ]) {
        const options = args[1];
        const callbackOnly = args.length === 2 && options != null && typeof options === "object" && ("ephemeral" in options || "ephemeral_message_parameters" in options);
        const [chat, sticker, params = {}] = (callbackOnly ? [undefined, ...args] : args) as [
            chat: (number | string) | undefined,
            sticker: TelegramInputFile | string,
            params?: {
                business_connection_id?: string;
                message_thread_id?: number;
                direct_messages_topic_id?: number;
                ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
                emoji?: string;
                disable_notification?: boolean;
                protect_content?: boolean;
                allow_paid_broadcast?: boolean;
                message_effect_id?: string;
                suggested_post_parameters?: TelegramSuggestedPostParameters;
                reply_parameters?: TelegramReplyParameters;
                reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                    toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
                };
                ephemeral?: boolean;
            }
        ];
        return this.tg.api.sendSticker({
            ...chat == null ? {} : { chat_id: chat },
            sticker: sticker,
            ...params,
            ...callbackEphemeralParams(this.raw.id, params)
        });
    }
    /**
     * shortcut for `tg.api.sendVenue` — pass `ephemeral: true` or `ephemeral_message_parameters` to send an ephemeral response; callback-only sends may omit the chat argument
     */
    sendVenue(...args: [
        chat: number | string,
        latitude: number,
        longitude: number,
        title: string,
        address: string,
        params?: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            foursquare_id?: string;
            foursquare_type?: string;
            google_place_id?: string;
            google_place_type?: string;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        }
    ] | [
        latitude: number,
        longitude: number,
        title: string,
        address: string,
        params: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            foursquare_id?: string;
            foursquare_type?: string;
            google_place_id?: string;
            google_place_type?: string;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        } & ({
            ephemeral: true;
        } | {
            ephemeral_message_parameters: TelegramEphemeralMessageParameters;
        })
    ]) {
        const options = args[4];
        const callbackOnly = args.length === 5 && options != null && typeof options === "object" && ("ephemeral" in options || "ephemeral_message_parameters" in options);
        const [chat, latitude, longitude, title, address, params = {}] = (callbackOnly ? [undefined, ...args] : args) as [
            chat: (number | string) | undefined,
            latitude: number,
            longitude: number,
            title: string,
            address: string,
            params?: {
                business_connection_id?: string;
                message_thread_id?: number;
                direct_messages_topic_id?: number;
                ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
                foursquare_id?: string;
                foursquare_type?: string;
                google_place_id?: string;
                google_place_type?: string;
                disable_notification?: boolean;
                protect_content?: boolean;
                allow_paid_broadcast?: boolean;
                message_effect_id?: string;
                suggested_post_parameters?: TelegramSuggestedPostParameters;
                reply_parameters?: TelegramReplyParameters;
                reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                    toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
                };
                ephemeral?: boolean;
            }
        ];
        return this.tg.api.sendVenue({
            ...chat == null ? {} : { chat_id: chat },
            latitude: latitude,
            longitude: longitude,
            title: title,
            address: address,
            ...params,
            ...callbackEphemeralParams(this.raw.id, params)
        });
    }
    /**
     * shortcut for `tg.api.sendVideo` — pass `ephemeral: true` or `ephemeral_message_parameters` to send an ephemeral response; callback-only sends may omit the chat argument
     */
    sendVideo(...args: [
        chat: number | string,
        video: TelegramInputFile | string,
        params?: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            duration?: number;
            width?: number;
            height?: number;
            thumbnail?: TelegramInputFile | string;
            cover?: TelegramInputFile | string;
            start_timestamp?: number;
            caption?: string | Formattable;
            parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
            caption_entities?: TelegramMessageEntity[];
            show_caption_above_media?: boolean;
            has_spoiler?: boolean;
            supports_streaming?: boolean;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        }
    ] | [
        video: TelegramInputFile | string,
        params: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            duration?: number;
            width?: number;
            height?: number;
            thumbnail?: TelegramInputFile | string;
            cover?: TelegramInputFile | string;
            start_timestamp?: number;
            caption?: string | Formattable;
            parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
            caption_entities?: TelegramMessageEntity[];
            show_caption_above_media?: boolean;
            has_spoiler?: boolean;
            supports_streaming?: boolean;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        } & ({
            ephemeral: true;
        } | {
            ephemeral_message_parameters: TelegramEphemeralMessageParameters;
        })
    ]) {
        const options = args[1];
        const callbackOnly = args.length === 2 && options != null && typeof options === "object" && ("ephemeral" in options || "ephemeral_message_parameters" in options);
        const [chat, video, params = {}] = (callbackOnly ? [undefined, ...args] : args) as [
            chat: (number | string) | undefined,
            video: TelegramInputFile | string,
            params?: {
                business_connection_id?: string;
                message_thread_id?: number;
                direct_messages_topic_id?: number;
                ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
                duration?: number;
                width?: number;
                height?: number;
                thumbnail?: TelegramInputFile | string;
                cover?: TelegramInputFile | string;
                start_timestamp?: number;
                caption?: string | Formattable;
                parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
                caption_entities?: TelegramMessageEntity[];
                show_caption_above_media?: boolean;
                has_spoiler?: boolean;
                supports_streaming?: boolean;
                disable_notification?: boolean;
                protect_content?: boolean;
                allow_paid_broadcast?: boolean;
                message_effect_id?: string;
                suggested_post_parameters?: TelegramSuggestedPostParameters;
                reply_parameters?: TelegramReplyParameters;
                reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                    toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
                };
                ephemeral?: boolean;
            }
        ];
        return this.tg.api.sendVideo({
            ...chat == null ? {} : { chat_id: chat },
            video: video,
            ...params,
            ...callbackEphemeralParams(this.raw.id, params)
        });
    }
    /**
     * shortcut for `tg.api.sendVideoNote` — pass `ephemeral: true` or `ephemeral_message_parameters` to send an ephemeral response; callback-only sends may omit the chat argument
     */
    sendVideoNote(...args: [
        chat: number | string,
        videoNote: TelegramInputFile | string,
        params?: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            duration?: number;
            length?: number;
            thumbnail?: TelegramInputFile | string;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        }
    ] | [
        videoNote: TelegramInputFile | string,
        params: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            duration?: number;
            length?: number;
            thumbnail?: TelegramInputFile | string;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        } & ({
            ephemeral: true;
        } | {
            ephemeral_message_parameters: TelegramEphemeralMessageParameters;
        })
    ]) {
        const options = args[1];
        const callbackOnly = args.length === 2 && options != null && typeof options === "object" && ("ephemeral" in options || "ephemeral_message_parameters" in options);
        const [chat, videoNote, params = {}] = (callbackOnly ? [undefined, ...args] : args) as [
            chat: (number | string) | undefined,
            videoNote: TelegramInputFile | string,
            params?: {
                business_connection_id?: string;
                message_thread_id?: number;
                direct_messages_topic_id?: number;
                ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
                duration?: number;
                length?: number;
                thumbnail?: TelegramInputFile | string;
                disable_notification?: boolean;
                protect_content?: boolean;
                allow_paid_broadcast?: boolean;
                message_effect_id?: string;
                suggested_post_parameters?: TelegramSuggestedPostParameters;
                reply_parameters?: TelegramReplyParameters;
                reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                    toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
                };
                ephemeral?: boolean;
            }
        ];
        return this.tg.api.sendVideoNote({
            ...chat == null ? {} : { chat_id: chat },
            video_note: videoNote,
            ...params,
            ...callbackEphemeralParams(this.raw.id, params)
        });
    }
    /**
     * shortcut for `tg.api.sendVoice` — pass `ephemeral: true` or `ephemeral_message_parameters` to send an ephemeral response; callback-only sends may omit the chat argument
     */
    sendVoice(...args: [
        chat: number | string,
        voice: TelegramInputFile | string,
        params?: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            caption?: string | Formattable;
            parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
            caption_entities?: TelegramMessageEntity[];
            duration?: number;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        }
    ] | [
        voice: TelegramInputFile | string,
        params: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            caption?: string | Formattable;
            parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
            caption_entities?: TelegramMessageEntity[];
            duration?: number;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        } & ({
            ephemeral: true;
        } | {
            ephemeral_message_parameters: TelegramEphemeralMessageParameters;
        })
    ]) {
        const options = args[1];
        const callbackOnly = args.length === 2 && options != null && typeof options === "object" && ("ephemeral" in options || "ephemeral_message_parameters" in options);
        const [chat, voice, params = {}] = (callbackOnly ? [undefined, ...args] : args) as [
            chat: (number | string) | undefined,
            voice: TelegramInputFile | string,
            params?: {
                business_connection_id?: string;
                message_thread_id?: number;
                direct_messages_topic_id?: number;
                ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
                caption?: string | Formattable;
                parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
                caption_entities?: TelegramMessageEntity[];
                duration?: number;
                disable_notification?: boolean;
                protect_content?: boolean;
                allow_paid_broadcast?: boolean;
                message_effect_id?: string;
                suggested_post_parameters?: TelegramSuggestedPostParameters;
                reply_parameters?: TelegramReplyParameters;
                reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                    toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
                };
                ephemeral?: boolean;
            }
        ];
        return this.tg.api.sendVoice({
            ...chat == null ? {} : { chat_id: chat },
            voice: voice,
            ...params,
            ...callbackEphemeralParams(this.raw.id, params)
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessage` — pass `ephemeral: true` or `ephemeral_message_parameters` to send an ephemeral response; callback-only sends may omit the chat argument
     */
    sendRich(...args: [
        chat: number | string,
        richMessage: TelegramInputRichMessage | RichLike,
        params?: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        }
    ] | [
        richMessage: TelegramInputRichMessage | RichLike,
        params: {
            business_connection_id?: string;
            message_thread_id?: number;
            direct_messages_topic_id?: number;
            ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
            disable_notification?: boolean;
            protect_content?: boolean;
            allow_paid_broadcast?: boolean;
            message_effect_id?: string;
            suggested_post_parameters?: TelegramSuggestedPostParameters;
            reply_parameters?: TelegramReplyParameters;
            reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
            };
            ephemeral?: boolean;
        } & ({
            ephemeral: true;
        } | {
            ephemeral_message_parameters: TelegramEphemeralMessageParameters;
        })
    ]) {
        const options = args[1];
        const callbackOnly = args.length === 2 && options != null && typeof options === "object" && ("ephemeral" in options || "ephemeral_message_parameters" in options);
        const [chat, richMessage, params = {}] = (callbackOnly ? [undefined, ...args] : args) as [
            chat: (number | string) | undefined,
            richMessage: TelegramInputRichMessage | RichLike,
            params?: {
                business_connection_id?: string;
                message_thread_id?: number;
                direct_messages_topic_id?: number;
                ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
                disable_notification?: boolean;
                protect_content?: boolean;
                allow_paid_broadcast?: boolean;
                message_effect_id?: string;
                suggested_post_parameters?: TelegramSuggestedPostParameters;
                reply_parameters?: TelegramReplyParameters;
                reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
                    toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
                };
                ephemeral?: boolean;
            }
        ];
        return this.tg.api.sendRichMessage({
            ...chat == null ? {} : { chat_id: chat },
            rich_message: richMessage,
            ...params,
            ...callbackEphemeralParams(this.raw.id, params)
        });
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("CallbackQueryUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `widget_query` event
 */
export class WidgetQueryUpdate {
    readonly kind = "widget_query" as const;
    private _from?: User;
    private _chat?: Chat;
    constructor(public raw: TelegramWidgetQuery, public readonly tg: TelegramLike) { }
    /**
     * Unique identifier for this query
     */
    get id(): string {
        return this.raw.id;
    }
    /**
     * Sender
     */
    get from(): User {
        return this._from ??= new User(this.raw.from);
    }
    /**
     * Optional. Chat with the message containing the widget; omitted if the widget is in an inline message
     */
    get chat(): Chat | undefined {
        return this.raw.chat ? (this._chat ??= new Chat(this.raw.chat)) : undefined;
    }
    /**
     * Optional. Identifier of the inline message containing the widget
     */
    get inlineMessageId(): string | undefined {
        return this.raw.inline_message_id;
    }
    /**
     * Global identifier, uniquely corresponding to the chat to which the message with the widget was sent
     */
    get chatInstance(): string {
        return this.raw.chat_instance;
    }
    /**
     * Optional. For widgets in inline messages, type of the chat to which the message was sent. Can be either “sender” for a private chat with the inline query sender, “private”, “group”, “supergroup”, or “channel”.
     */
    get chatType(): ("sender" | "private" | "group" | "supergroup" | "channel") | undefined {
        return this.raw.chat_type;
    }
    /**
     * Type of the query
     */
    get type(): TelegramWidgetQueryType {
        return this.raw.type;
    }
    /**
     * Data of the query, 1-64 bytes
     */
    get data(): string {
        return this.raw.data;
    }
    /**
     * Optional. Unique identifier of the shared widget, which sent the query; omitted if the widget isn't shared
     */
    get widgetId(): string | undefined {
        return this.raw.widget_id;
    }
    /**
     * true if `chat` is set
     */
    hasChat(): this is this & {
        chat: Chat;
    } {
        return this.raw.chat != null;
    }
    /**
     * true if `message_id` is set
     */
    hasId(): this is this & {
        id: number;
    } {
        return this.raw.message_id != null;
    }
    /**
     * true if `inline_message_id` is set
     */
    hasInlineMessageId(): this is this & {
        inlineMessageId: string;
    } {
        return this.raw.inline_message_id != null;
    }
    /**
     * true if `chat_type` is set
     */
    hasChatType(): this is this & {
        chatType: "sender" | "private" | "group" | "supergroup" | "channel";
    } {
        return this.raw.chat_type != null;
    }
    /**
     * true if `widget_id` is set
     */
    hasWidgetId(): this is this & {
        widgetId: string;
    } {
        return this.raw.widget_id != null;
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    editWidgetData(params?: Omit<EditMessageWidgetDataParams, "chat_id" | "message_id" | "inline_message_id">): Promise<true> {
        const ref = this.raw.inline_message_id != null ? { inline_message_id: this.raw.inline_message_id } : this.raw.chat != null && this.raw.message_id != null ? { chat_id: this.raw.chat.id, message_id: this.raw.message_id } : undefined;
        if (ref == null) {
            throw new TypeError("widget query carries neither message nor inline_message_id");
        }
        return this.tg.api.editMessageWidgetData({ ...ref, ...params });
    }
    /**
     * shortcut for `from.id` — uniform sender id across update kinds
     */
    get senderId(): number {
        return this.raw.from.id;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    /**
     * shortcut for `tg.api.answerWidgetQuery`
     */
    answer(params: {
        data?: string;
    } = {}) {
        return this.tg.api.answerWidgetQuery({
            widget_query_id: this.raw.id,
            ...params
        });
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("WidgetQueryUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `shared_widget_query` event
 */
export class SharedWidgetQueryUpdate {
    readonly kind = "shared_widget_query" as const;
    private _from?: User;
    constructor(public raw: TelegramSharedWidgetQuery, public readonly tg: TelegramLike) { }
    /**
     * Unique identifier for this query
     */
    get id(): string {
        return this.raw.id;
    }
    /**
     * Sender
     */
    get from(): User {
        return this._from ??= new User(this.raw.from);
    }
    /**
     * Type of the query
     */
    get type(): TelegramWidgetQueryType {
        return this.raw.type;
    }
    /**
     * Data of the query, 1-64 bytes
     */
    get data(): string {
        return this.raw.data;
    }
    /**
     * Unique identifier of the shared widget, which sent the query
     */
    get widgetId(): string {
        return this.raw.widget_id;
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    /**
     * shortcut for `from.id` — uniform sender id across update kinds
     */
    get senderId(): number {
        return this.raw.from.id;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    /**
     * shortcut for `tg.api.answerWidgetQuery`
     */
    answer(params: {
        data?: string;
    } = {}) {
        return this.tg.api.answerWidgetQuery({
            widget_query_id: this.raw.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editSharedWidgetData`
     */
    editSharedWidgetData(params: {
        public_data: string;
        cache_time?: number;
    }) {
        return this.tg.api.editSharedWidgetData({
            widget_id: this.raw.widget_id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendSharedWidget`
     */
    sendSharedWidget(chat: number | string, params: {
        message_thread_id?: number;
        chat_data?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendSharedWidget({
            widget_id: this.raw.widget_id,
            chat_id: chat,
            ...params
        });
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("SharedWidgetQueryUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `shipping_query` event
 */
export class ShippingQueryUpdate {
    readonly kind = "shipping_query" as const;
    private _from?: User;
    private _shippingAddress?: ShippingAddress;
    constructor(public raw: TelegramShippingQuery, public readonly tg: TelegramLike) { }
    /**
     * Unique query identifier
     */
    get id(): string {
        return this.raw.id;
    }
    /**
     * User who sent the query
     */
    get from(): User {
        return this._from ??= new User(this.raw.from);
    }
    /**
     * Bot-specified invoice payload
     */
    get invoicePayload(): string {
        return this.raw.invoice_payload;
    }
    /**
     * User specified shipping address
     */
    get shippingAddress(): ShippingAddress {
        return this._shippingAddress ??= new ShippingAddress(this.raw.shipping_address);
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    /**
     * shortcut for `from.id` — uniform sender id across update kinds
     */
    get senderId(): number {
        return this.raw.from.id;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    /**
     * shortcut for `tg.api.answerShippingQuery`
     */
    answer(ok: boolean, params: {
        shipping_options?: TelegramShippingOption[];
        error_message?: string;
    } = {}) {
        return this.tg.api.answerShippingQuery({
            shipping_query_id: this.raw.id,
            ok: ok,
            ...params
        });
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ShippingQueryUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `pre_checkout_query` event
 */
export class PreCheckoutQueryUpdate {
    readonly kind = "pre_checkout_query" as const;
    private _from?: User;
    private _orderInfo?: OrderInfo;
    constructor(public raw: TelegramPreCheckoutQuery, public readonly tg: TelegramLike) { }
    /**
     * Unique query identifier
     */
    get id(): string {
        return this.raw.id;
    }
    /**
     * User who sent the query
     */
    get from(): User {
        return this._from ??= new User(this.raw.from);
    }
    /**
     * Three-letter ISO 4217 currency code, or “XTR” for payments in Telegram Stars
     */
    get currency(): string {
        return this.raw.currency;
    }
    /**
     * Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).
     */
    get totalAmount(): number {
        return this.raw.total_amount;
    }
    /**
     * Bot-specified invoice payload
     */
    get invoicePayload(): string {
        return this.raw.invoice_payload;
    }
    /**
     * Optional. Identifier of the shipping option chosen by the user
     */
    get shippingOptionId(): string | undefined {
        return this.raw.shipping_option_id;
    }
    /**
     * Optional. Order information provided by the user
     */
    get orderInfo(): OrderInfo | undefined {
        return this.raw.order_info ? (this._orderInfo ??= new OrderInfo(this.raw.order_info)) : undefined;
    }
    /**
     * true if `shipping_option_id` is set
     */
    hasShippingOptionId(): this is this & {
        shippingOptionId: string;
    } {
        return this.raw.shipping_option_id != null;
    }
    /**
     * true if `order_info` is set
     */
    hasOrderInfo(): this is this & {
        orderInfo: OrderInfo;
    } {
        return this.raw.order_info != null;
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    /**
     * shortcut for `from.id` — uniform sender id across update kinds
     */
    get senderId(): number {
        return this.raw.from.id;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    /**
     * shortcut for `tg.api.answerPreCheckoutQuery`
     */
    answer(ok: boolean, params: {
        error_message?: string;
    } = {}) {
        return this.tg.api.answerPreCheckoutQuery({
            pre_checkout_query_id: this.raw.id,
            ok: ok,
            ...params
        });
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("PreCheckoutQueryUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `purchased_paid_media` event
 */
export class PurchasedPaidMediaUpdate {
    readonly kind = "purchased_paid_media" as const;
    private _from?: User;
    constructor(public raw: TelegramPaidMediaPurchased, public readonly tg: TelegramLike) { }
    /**
     * User who purchased the media
     */
    get from(): User {
        return this._from ??= new User(this.raw.from);
    }
    /**
     * Bot-specified paid media payload
     */
    get paidMediaPayload(): string {
        return this.raw.paid_media_payload;
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    /**
     * shortcut for `from.id` — uniform sender id across update kinds
     */
    get senderId(): number {
        return this.raw.from.id;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("PurchasedPaidMediaUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `poll` event
 */
export class PollUpdate {
    readonly kind = "poll" as const;
    private _questionEntities?: MessageEntity[];
    private _options?: PollOptions;
    private _explanationEntities?: MessageEntity[];
    private _explanationMedia?: PollMedia;
    private _descriptionEntities?: MessageEntity[];
    private _media?: PollMedia;
    constructor(public raw: TelegramPoll, public readonly tg: TelegramLike) { }
    /**
     * Unique poll identifier
     */
    get id(): string {
        return this.raw.id;
    }
    /**
     * Poll question, 1-300 characters
     */
    get question(): string {
        return this.raw.question;
    }
    /**
     * Optional. Special entities that appear in the question. Currently, only custom emoji entities are allowed in poll questions
     */
    get questionEntities(): MessageEntity[] | undefined {
        return this.raw.question_entities ? (this._questionEntities ??= this.raw.question_entities.map(x => new MessageEntity(x))) : undefined;
    }
    /**
     * List of poll options
     */
    get options(): PollOptions {
        return this._options ??= new PollOptions(this.raw.options);
    }
    /**
     * Total number of users that voted in the poll
     */
    get totalVoterCount(): number {
        return this.raw.total_voter_count;
    }
    /**
     * True, if the poll is closed
     */
    get isClosed(): boolean {
        return this.raw.is_closed;
    }
    /**
     * True, if the poll is anonymous
     */
    get isAnonymous(): boolean {
        return this.raw.is_anonymous;
    }
    /**
     * Poll type, currently can be “regular” or “quiz”
     */
    get type(): "regular" | "quiz" {
        return this.raw.type;
    }
    /**
     * True, if the poll allows multiple answers
     */
    get allowsMultipleAnswers(): boolean {
        return this.raw.allows_multiple_answers;
    }
    /**
     * True, if the poll allows to change the chosen answer options
     */
    get allowsRevoting(): boolean {
        return this.raw.allows_revoting;
    }
    /**
     * True if voting is limited to users who have been members of the chat where the poll was originally sent for more than 24 hours
     */
    get membersOnly(): boolean {
        return this.raw.members_only;
    }
    /**
     * Optional. A list of two-letter ISO 3166-1 alpha-2 country codes indicating the countries from which users can vote in the poll. The country code “FT” is used for users with anonymous numbers. If omitted, then users from any country can participate in the poll.
     */
    get countryCodes(): string[] | undefined {
        return this.raw.country_codes;
    }
    /**
     * Optional. Array of 0-based identifiers of the correct answer options. Available only for polls in quiz mode which are closed or were sent (not forwarded) by the bot or to the private chat with the bot.
     */
    get correctOptionIds(): number[] | undefined {
        return this.raw.correct_option_ids;
    }
    /**
     * Optional. Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters
     */
    get explanation(): string | undefined {
        return this.raw.explanation;
    }
    /**
     * Optional. Special entities like usernames, URLs, bot commands, etc. that appear in the explanation
     */
    get explanationEntities(): MessageEntity[] | undefined {
        return this.raw.explanation_entities ? (this._explanationEntities ??= this.raw.explanation_entities.map(x => new MessageEntity(x))) : undefined;
    }
    /**
     * Optional. Media added to the quiz explanation
     */
    get explanationMedia(): PollMedia | undefined {
        return this.raw.explanation_media ? (this._explanationMedia ??= new PollMedia(this.raw.explanation_media)) : undefined;
    }
    /**
     * Optional. Amount of time in seconds the poll will be active after creation
     */
    get openPeriod(): number | undefined {
        return this.raw.open_period;
    }
    /**
     * Optional. Point in time (Unix timestamp) when the poll will be automatically closed
     */
    get closeDate(): number | undefined {
        return this.raw.close_date;
    }
    /**
     * Optional. Description of the poll; for polls inside the Message object only
     */
    get description(): string | undefined {
        return this.raw.description;
    }
    /**
     * Optional. Special entities like usernames, URLs, bot commands, etc. that appear in the description
     */
    get descriptionEntities(): MessageEntity[] | undefined {
        return this.raw.description_entities ? (this._descriptionEntities ??= this.raw.description_entities.map(x => new MessageEntity(x))) : undefined;
    }
    /**
     * Optional. Media added to the poll description; for polls inside the Message object only
     */
    get media(): PollMedia | undefined {
        return this.raw.media ? (this._media ??= new PollMedia(this.raw.media)) : undefined;
    }
    /**
     * true if `question_entities` has at least one item
     */
    hasQuestionEntities(): this is this & {
        questionEntities: MessageEntity[];
    } {
        return this.raw.question_entities != null && this.raw.question_entities.length > 0;
    }
    /**
     * true if `country_codes` has at least one item
     */
    hasCountryCodes(): this is this & {
        countryCodes: string[];
    } {
        return this.raw.country_codes != null && this.raw.country_codes.length > 0;
    }
    /**
     * true if `correct_option_ids` has at least one item
     */
    hasCorrectOptionIds(): this is this & {
        correctOptionIds: number[];
    } {
        return this.raw.correct_option_ids != null && this.raw.correct_option_ids.length > 0;
    }
    /**
     * true if `explanation` is set
     */
    hasExplanation(): this is this & {
        explanation: string;
    } {
        return this.raw.explanation != null;
    }
    /**
     * true if `explanation_entities` has at least one item
     */
    hasExplanationEntities(): this is this & {
        explanationEntities: MessageEntity[];
    } {
        return this.raw.explanation_entities != null && this.raw.explanation_entities.length > 0;
    }
    /**
     * true if `explanation_media` is set
     */
    hasExplanationMedia(): this is this & {
        explanationMedia: PollMedia;
    } {
        return this.raw.explanation_media != null;
    }
    /**
     * true if `open_period` is set
     */
    hasOpenPeriod(): this is this & {
        openPeriod: number;
    } {
        return this.raw.open_period != null;
    }
    /**
     * true if `close_date` is set
     */
    hasCloseDate(): this is this & {
        closeDate: number;
    } {
        return this.raw.close_date != null;
    }
    /**
     * true if `description` is set
     */
    hasDescription(): this is this & {
        description: string;
    } {
        return this.raw.description != null;
    }
    /**
     * true if `description_entities` has at least one item
     */
    hasDescriptionEntities(): this is this & {
        descriptionEntities: MessageEntity[];
    } {
        return this.raw.description_entities != null && this.raw.description_entities.length > 0;
    }
    /**
     * true if `media` is set
     */
    hasMedia(): this is this & {
        media: PollMedia;
    } {
        return this.raw.media != null;
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("PollUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `poll_answer` event
 */
export class PollAnswerUpdate {
    readonly kind = "poll_answer" as const;
    private _voterChat?: Chat;
    private _user?: User;
    constructor(public raw: TelegramPollAnswer, public readonly tg: TelegramLike) { }
    /**
     * Unique poll identifier
     */
    get pollId(): string {
        return this.raw.poll_id;
    }
    /**
     * Optional. The chat that changed the answer to the poll, if the voter is anonymous
     */
    get voterChat(): Chat | undefined {
        return this.raw.voter_chat ? (this._voterChat ??= new Chat(this.raw.voter_chat)) : undefined;
    }
    /**
     * Optional. The user that changed the answer to the poll, if the voter isn't anonymous
     */
    get user(): User | undefined {
        return this.raw.user ? (this._user ??= new User(this.raw.user)) : undefined;
    }
    /**
     * 0-based identifiers of chosen answer options. May be empty if the vote was retracted.
     */
    get optionIds(): number[] {
        return this.raw.option_ids;
    }
    /**
     * Persistent identifiers of the chosen answer options. May be empty if the vote was retracted.
     */
    get optionPersistentIds(): string[] {
        return this.raw.option_persistent_ids;
    }
    /**
     * true if `voter_chat` is set
     */
    hasVoterChat(): this is this & {
        voterChat: Chat;
    } {
        return this.raw.voter_chat != null;
    }
    /**
     * true if `user` is set
     */
    hasUser(): this is this & {
        user: User;
    } {
        return this.raw.user != null;
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    /**
     * best-effort sender id: `user.id` → `voter_chat.id`
     */
    get senderId(): number | undefined {
        return this.raw.user?.id ?? this.raw.voter_chat?.id;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("PollAnswerUpdate", this, depth, options, inspect);
    }
}

/**
 * shared base for every update built from `TelegramChatMemberUpdated` — implementation detail, not exported
 */
class ChatMemberUpdatedShared {
    declare readonly kind: string;
    private _chat?: Chat;
    private _from?: User;
    private _oldChatMember?: ChatMember;
    private _newChatMember?: ChatMember;
    private _inviteLink?: ChatInviteLink;
    constructor(public raw: TelegramChatMemberUpdated, public readonly tg: TelegramLike) { }
    /**
     * Chat the user belongs to
     */
    get chat(): Chat {
        return this._chat ??= new Chat(this.raw.chat);
    }
    /**
     * Performer of the action, which resulted in the change
     */
    get from(): User {
        return this._from ??= new User(this.raw.from);
    }
    /**
     * Date the change was done in Unix time
     */
    get date(): number {
        return this.raw.date;
    }
    /**
     * Previous information about the chat member
     */
    get oldChatMember(): ChatMember {
        return this._oldChatMember ??= new ChatMember(this.raw.old_chat_member);
    }
    /**
     * New information about the chat member
     */
    get newChatMember(): ChatMember {
        return this._newChatMember ??= new ChatMember(this.raw.new_chat_member);
    }
    /**
     * Optional. Chat invite link, which was used by the user to join the chat; for joining by invite link events only
     */
    get inviteLink(): ChatInviteLink | undefined {
        return this.raw.invite_link ? (this._inviteLink ??= new ChatInviteLink(this.raw.invite_link)) : undefined;
    }
    /**
     * Optional. True, if the user joined the chat after sending a direct join request without using an invite link and being approved by an administrator
     */
    get viaJoinRequest(): boolean | undefined {
        return this.raw.via_join_request;
    }
    /**
     * Optional. True, if the user joined the chat via a chat folder invite link
     */
    get viaChatFolderInviteLink(): boolean | undefined {
        return this.raw.via_chat_folder_invite_link;
    }
    /**
     * true if `invite_link` is set
     */
    hasInviteLink(): this is this & {
        inviteLink: ChatInviteLink;
    } {
        return this.raw.invite_link != null;
    }
    /**
     * true if `via_join_request` is set
     */
    hasViaJoinRequest(): this is this & {
        viaJoinRequest: boolean;
    } {
        return this.raw.via_join_request != null;
    }
    /**
     * true if `via_chat_folder_invite_link` is set
     */
    hasViaChatFolderInviteLink(): this is this & {
        viaChatFolderInviteLink: boolean;
    } {
        return this.raw.via_chat_folder_invite_link != null;
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    /**
     * shortcut for `old_chat_member.status`
     */
    get oldStatus(): string {
        return (this.raw.old_chat_member as {
            status: string;
        }).status;
    }
    /**
     * shortcut for `new_chat_member.status`
     */
    get newStatus(): string {
        return (this.raw.new_chat_member as {
            status: string;
        }).status;
    }
    /**
     * true if old status is `creator`
     */
    wasCreator(): boolean {
        return (this.raw.old_chat_member as {
            status: string;
        }).status === "creator";
    }
    /**
     * true if new status is `creator`
     */
    isNowCreator(): boolean {
        return (this.raw.new_chat_member as {
            status: string;
        }).status === "creator";
    }
    /**
     * true if old status is `administrator`
     */
    wasAdmin(): boolean {
        return (this.raw.old_chat_member as {
            status: string;
        }).status === "administrator";
    }
    /**
     * true if new status is `administrator`
     */
    isNowAdmin(): boolean {
        return (this.raw.new_chat_member as {
            status: string;
        }).status === "administrator";
    }
    /**
     * true if old status is `member`
     */
    wasMember(): boolean {
        return (this.raw.old_chat_member as {
            status: string;
        }).status === "member";
    }
    /**
     * true if new status is `member`
     */
    isNowMember(): boolean {
        return (this.raw.new_chat_member as {
            status: string;
        }).status === "member";
    }
    /**
     * true if old status is `restricted`
     */
    wasRestricted(): boolean {
        return (this.raw.old_chat_member as {
            status: string;
        }).status === "restricted";
    }
    /**
     * true if new status is `restricted`
     */
    isNowRestricted(): boolean {
        return (this.raw.new_chat_member as {
            status: string;
        }).status === "restricted";
    }
    /**
     * true if old status is `left`
     */
    wasLeft(): boolean {
        return (this.raw.old_chat_member as {
            status: string;
        }).status === "left";
    }
    /**
     * true if new status is `left`
     */
    isNowLeft(): boolean {
        return (this.raw.new_chat_member as {
            status: string;
        }).status === "left";
    }
    /**
     * true if old status is `kicked` (banned)
     */
    wasKicked(): boolean {
        return (this.raw.old_chat_member as {
            status: string;
        }).status === "kicked";
    }
    /**
     * true if new status is `kicked` (banned)
     */
    isNowKicked(): boolean {
        return (this.raw.new_chat_member as {
            status: string;
        }).status === "kicked";
    }
    /**
     * true if the user was outside the chat (`left`/`kicked`) and is now in it
     */
    didJoinChat(): boolean {
        const o = (this.raw.old_chat_member as {
            status: string;
        }).status;
        const n = (this.raw.new_chat_member as {
            status: string;
        }).status;
        return (o === "left" || o === "kicked") && n !== "left" && n !== "kicked";
    }
    /**
     * true if the user was in the chat and is now outside it (`left`/`kicked`)
     */
    didLeaveChat(): boolean {
        const o = (this.raw.old_chat_member as {
            status: string;
        }).status;
        const n = (this.raw.new_chat_member as {
            status: string;
        }).status;
        return o !== "left" && o !== "kicked" && (n === "left" || n === "kicked");
    }
    /**
     * true if the user gained `creator` or `administrator` status
     */
    wasPromoted(): boolean {
        const o = (this.raw.old_chat_member as {
            status: string;
        }).status;
        const n = (this.raw.new_chat_member as {
            status: string;
        }).status;
        return o !== "creator" && o !== "administrator" && (n === "creator" || n === "administrator");
    }
    /**
     * true if the user lost `creator` or `administrator` status
     */
    wasDemoted(): boolean {
        const o = (this.raw.old_chat_member as {
            status: string;
        }).status;
        const n = (this.raw.new_chat_member as {
            status: string;
        }).status;
        return (o === "creator" || o === "administrator") && n !== "creator" && n !== "administrator";
    }
    /**
     * true if the user was just kicked (banned)
     */
    wasBanned(): boolean {
        return (this.raw.old_chat_member as {
            status: string;
        }).status !== "kicked" && (this.raw.new_chat_member as {
            status: string;
        }).status === "kicked";
    }
    /**
     * true if the user was kicked and no longer is
     */
    wasUnbanned(): boolean {
        return (this.raw.old_chat_member as {
            status: string;
        }).status === "kicked" && (this.raw.new_chat_member as {
            status: string;
        }).status !== "kicked";
    }
    /**
     * shortcut for `from.id` — uniform sender id across update kinds
     */
    get senderId(): number {
        return this.raw.from.id;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    /**
     * shortcut for `tg.api.approveChatJoinRequest`
     */
    approveChatJoinRequest(user: number, params: {} = {}) {
        return this.tg.api.approveChatJoinRequest({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.approveSuggestedPost`
     */
    approveSuggestedPost(messageId: number, params: {
        send_date?: number;
    } = {}) {
        return this.tg.api.approveSuggestedPost({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.banChatMember`
     */
    banChatMember(user: number, params: {
        until_date?: number;
        revoke_messages?: boolean;
    } = {}) {
        return this.tg.api.banChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.banChatSenderChat`
     */
    banChatSenderChat(senderChat: number, params: {} = {}) {
        return this.tg.api.banChatSenderChat({
            chat_id: this.raw.chat.id,
            sender_chat_id: senderChat,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.closeForumTopic`
     */
    closeForumTopic(threadId: number, params: {} = {}) {
        return this.tg.api.closeForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.closeGeneralForumTopic`
     */
    closeGeneralForumTopic(params: {} = {}) {
        return this.tg.api.closeGeneralForumTopic({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.copyMessage`
     */
    copy(from: number | string, messageId: number, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        video_start_timestamp?: number;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.copyMessage({
            chat_id: this.raw.chat.id,
            from_chat_id: from,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.copyMessages`
     */
    copyMany(from: number | string, messageIds: number[], params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        remove_caption?: boolean;
    } = {}) {
        return this.tg.api.copyMessages({
            chat_id: this.raw.chat.id,
            from_chat_id: from,
            message_ids: messageIds,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.createChatInviteLink`
     */
    createChatInviteLink(params: {
        name?: string;
        expire_date?: number;
        member_limit?: number;
        creates_join_request?: boolean;
    } = {}) {
        return this.tg.api.createChatInviteLink({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.createChatSubscriptionInviteLink`
     */
    createChatSubscriptionInviteLink(subscriptionPeriod: number, subscriptionPrice: number, params: {
        name?: string;
    } = {}) {
        return this.tg.api.createChatSubscriptionInviteLink({
            chat_id: this.raw.chat.id,
            subscription_period: subscriptionPeriod,
            subscription_price: subscriptionPrice,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.createForumTopic`
     */
    createForumTopic(name: string, params: {
        icon_color?: number;
        icon_custom_emoji_id?: string;
    } = {}) {
        return this.tg.api.createForumTopic({
            chat_id: this.raw.chat.id,
            name: name,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.declineChatJoinRequest`
     */
    declineChatJoinRequest(user: number, params: {} = {}) {
        return this.tg.api.declineChatJoinRequest({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.declineSuggestedPost`
     */
    declineSuggestedPost(messageId: number, params: {
        comment?: string;
    } = {}) {
        return this.tg.api.declineSuggestedPost({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteAllMessageReactions`
     */
    deleteAllMessageReactions(params: {
        user_id?: number;
        actor_chat_id?: number;
    } = {}) {
        return this.tg.api.deleteAllMessageReactions({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteChatPhoto`
     */
    deleteChatPhoto(params: {} = {}) {
        return this.tg.api.deleteChatPhoto({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteChatStickerSet`
     */
    deleteChatStickerSet(params: {} = {}) {
        return this.tg.api.deleteChatStickerSet({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteEphemeralMessage`
     */
    deleteEphemeralMessage(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
    }) {
        return this.tg.api.deleteEphemeralMessage({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteForumTopic`
     */
    deleteForumTopic(threadId: number, params: {} = {}) {
        return this.tg.api.deleteForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteMessage`
     */
    delete(messageId: number, params: {} = {}) {
        return this.tg.api.deleteMessage({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteMessageReaction`
     */
    deleteMessageReaction(messageId: number, params: {
        user_id?: number;
        actor_chat_id?: number;
    } = {}) {
        return this.tg.api.deleteMessageReaction({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteMessages`
     */
    deleteMany(messageIds: number[], params: {} = {}) {
        return this.tg.api.deleteMessages({
            chat_id: this.raw.chat.id,
            message_ids: messageIds,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editChatInviteLink`
     */
    editChatInviteLink(inviteLink: string, params: {
        name?: string;
        expire_date?: number;
        member_limit?: number;
        creates_join_request?: boolean;
    } = {}) {
        return this.tg.api.editChatInviteLink({
            chat_id: this.raw.chat.id,
            invite_link: inviteLink,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editChatSubscriptionInviteLink`
     */
    editChatSubscriptionInviteLink(inviteLink: string, params: {
        name?: string;
    } = {}) {
        return this.tg.api.editChatSubscriptionInviteLink({
            chat_id: this.raw.chat.id,
            invite_link: inviteLink,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editEphemeralMessageCaption`
     */
    editEphemeralMessageCaption(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.editEphemeralMessageCaption({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editEphemeralMessageMedia`
     */
    editEphemeralMessageMedia(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
        media: TelegramInputMedia;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.editEphemeralMessageMedia({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editEphemeralMessageReplyMarkup`
     */
    editEphemeralMessageReplyMarkup(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.editEphemeralMessageReplyMarkup({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editEphemeralMessageText`
     */
    editEphemeralMessageText(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
        text?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        rich_message?: TelegramInputRichMessage;
        link_preview_options?: TelegramLinkPreviewOptions;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.editEphemeralMessageText({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editForumTopic`
     */
    editForumTopic(threadId: number, params: {
        name?: string;
        icon_custom_emoji_id?: string;
    } = {}) {
        return this.tg.api.editForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editGeneralForumTopic`
     */
    editGeneralForumTopic(name: string, params: {} = {}) {
        return this.tg.api.editGeneralForumTopic({
            chat_id: this.raw.chat.id,
            name: name,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageCaption`
     */
    editCaption(params: {
        business_connection_id?: string;
        message_id?: number;
        inline_message_id?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.editMessageCaption({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageChecklist`
     */
    editMessageChecklist(messageId: number, checklist: TelegramInputChecklist, params: {
        business_connection_id: string;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.editMessageChecklist({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            checklist: checklist,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageLiveLocation`
     */
    editLiveLocation(latitude: number, longitude: number, params: {
        business_connection_id?: string;
        message_id?: number;
        inline_message_id?: string;
        live_period?: number;
        horizontal_accuracy?: number;
        heading?: number;
        proximity_alert_radius?: number;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.editMessageLiveLocation({
            chat_id: this.raw.chat.id,
            latitude: latitude,
            longitude: longitude,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageMedia`
     */
    editMedia(media: TelegramInputMedia, params: {
        business_connection_id?: string;
        message_id?: number;
        inline_message_id?: string;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.editMessageMedia({
            chat_id: this.raw.chat.id,
            media: media,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageReplyMarkup`
     */
    editReplyMarkup(params: {
        business_connection_id?: string;
        message_id?: number;
        inline_message_id?: string;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.editMessageReplyMarkup({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageText`
     */
    edit(text: string | Formattable, params: {
        business_connection_id?: string;
        message_id?: number;
        inline_message_id?: string;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        link_preview_options?: TelegramLinkPreviewOptions;
        rich_message?: TelegramInputRichMessage;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.editMessageText({
            chat_id: this.raw.chat.id,
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageWidgetData`
     */
    editWidgetData(params: {
        message_id?: number;
        inline_message_id?: string;
        public_data?: string;
        chat_data?: string;
    } = {}) {
        return this.tg.api.editMessageWidgetData({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.exportChatInviteLink`
     */
    exportChatInviteLink(params: {} = {}) {
        return this.tg.api.exportChatInviteLink({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.forwardMessage`
     */
    forward(from: number | string, messageId: number, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        video_start_timestamp?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
    } = {}) {
        return this.tg.api.forwardMessage({
            chat_id: this.raw.chat.id,
            from_chat_id: from,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.forwardMessages`
     */
    forwardMany(from: number | string, messageIds: number[], params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
    } = {}) {
        return this.tg.api.forwardMessages({
            chat_id: this.raw.chat.id,
            from_chat_id: from,
            message_ids: messageIds,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChat`
     */
    getChat(params: {} = {}) {
        return this.tg.api.getChat({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatAdministrators`
     */
    getChatAdministrators(params: {
        return_bots?: boolean;
    } = {}) {
        return this.tg.api.getChatAdministrators({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatGifts`
     */
    getChatGifts(params: {
        exclude_unsaved?: boolean;
        exclude_saved?: boolean;
        exclude_unlimited?: boolean;
        exclude_limited_upgradable?: boolean;
        exclude_limited_non_upgradable?: boolean;
        exclude_from_blockchain?: boolean;
        exclude_unique?: boolean;
        sort_by_price?: boolean;
        offset?: string;
        limit?: number;
    } = {}) {
        return this.tg.api.getChatGifts({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatMember`
     */
    getChatMember(user: number, params: {} = {}) {
        return this.tg.api.getChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatMemberCount`
     */
    getChatMemberCount(params: {} = {}) {
        return this.tg.api.getChatMemberCount({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatMenuButton`
     */
    getChatMenuButton(params: {} = {}) {
        return this.tg.api.getChatMenuButton({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getGameHighScores`
     */
    getGameHighScores(user: number, params: {
        message_id?: number;
        inline_message_id?: string;
    } = {}) {
        return this.tg.api.getGameHighScores({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getUserChatBoosts`
     */
    getUserChatBoosts(user: number, params: {} = {}) {
        return this.tg.api.getUserChatBoosts({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.hideGeneralForumTopic`
     */
    hideGeneralForumTopic(params: {} = {}) {
        return this.tg.api.hideGeneralForumTopic({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.leaveChat`
     */
    leaveChat(params: {} = {}) {
        return this.tg.api.leaveChat({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.pinChatMessage`
     */
    pin(messageId: number, params: {
        business_connection_id?: string;
        disable_notification?: boolean;
    } = {}) {
        return this.tg.api.pinChatMessage({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.promoteChatMember`
     */
    promoteChatMember(user: number, params: {
        is_anonymous?: boolean;
        can_manage_chat?: boolean;
        can_delete_messages?: boolean;
        can_manage_video_chats?: boolean;
        can_restrict_members?: boolean;
        can_promote_members?: boolean;
        can_change_info?: boolean;
        can_invite_users?: boolean;
        can_post_stories?: boolean;
        can_edit_stories?: boolean;
        can_delete_stories?: boolean;
        can_post_messages?: boolean;
        can_edit_messages?: boolean;
        can_pin_messages?: boolean;
        can_manage_topics?: boolean;
        can_manage_direct_messages?: boolean;
        can_manage_tags?: boolean;
        can_send_welcome_messages?: boolean;
    } = {}) {
        return this.tg.api.promoteChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.readBusinessMessage`
     */
    readBusinessMessage(messageId: number, params: {
        business_connection_id: string;
    }) {
        return this.tg.api.readBusinessMessage({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.removeChatVerification`
     */
    removeChatVerification(params: {} = {}) {
        return this.tg.api.removeChatVerification({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.reopenForumTopic`
     */
    reopenForumTopic(threadId: number, params: {} = {}) {
        return this.tg.api.reopenForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.reopenGeneralForumTopic`
     */
    reopenGeneralForumTopic(params: {} = {}) {
        return this.tg.api.reopenGeneralForumTopic({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.restrictChatMember`
     */
    restrictChatMember(user: number, permissions: TelegramChatPermissions, params: {
        use_independent_chat_permissions?: boolean;
        until_date?: number;
    } = {}) {
        return this.tg.api.restrictChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            permissions: permissions,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.revokeChatInviteLink`
     */
    revokeChatInviteLink(inviteLink: string, params: {} = {}) {
        return this.tg.api.revokeChatInviteLink({
            chat_id: this.raw.chat.id,
            invite_link: inviteLink,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendAnimation`
     */
    sendAnimation(animation: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        width?: number;
        height?: number;
        thumbnail?: TelegramInputFile | string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendAnimation({
            chat_id: this.raw.chat.id,
            animation: animation,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendAudio`
     */
    sendAudio(audio: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        duration?: number;
        performer?: string;
        title?: string;
        thumbnail?: TelegramInputFile | string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendAudio({
            chat_id: this.raw.chat.id,
            audio: audio,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendChatAction`
     */
    sendChatAction(action: string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
    } = {}) {
        return this.tg.api.sendChatAction({
            chat_id: this.raw.chat.id,
            action: action,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendChecklist`
     */
    sendChecklist(checklist: TelegramInputChecklist, params: {
        business_connection_id: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.sendChecklist({
            chat_id: this.raw.chat.id,
            checklist: checklist,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendContact`
     */
    sendContact(phoneNumber: string, firstName: string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        last_name?: string;
        vcard?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendContact({
            chat_id: this.raw.chat.id,
            phone_number: phoneNumber,
            first_name: firstName,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendDice`
     */
    sendDice(params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        emoji?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendDice({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendDocument`
     */
    sendDocument(document: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        thumbnail?: TelegramInputFile | string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        disable_content_type_detection?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendDocument({
            chat_id: this.raw.chat.id,
            document: document,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendGame`
     */
    sendGame(gameShortName: string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.sendGame({
            chat_id: this.raw.chat.id,
            game_short_name: gameShortName,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendGift`
     */
    sendGift(giftId: string, params: {
        user_id?: number;
        pay_for_upgrade?: boolean;
        text?: string | Formattable;
        text_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        text_entities?: TelegramMessageEntity[];
    } = {}) {
        return this.tg.api.sendGift({
            chat_id: this.raw.chat.id,
            gift_id: giftId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendInvoice`
     */
    sendInvoice(params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        title: string;
        description: string;
        payload: string;
        provider_token?: string;
        currency: string;
        prices: TelegramLabeledPrice[];
        max_tip_amount?: number;
        suggested_tip_amounts?: number[];
        start_parameter?: string;
        provider_data?: string;
        photo_url?: string;
        photo_size?: number;
        photo_width?: number;
        photo_height?: number;
        need_name?: boolean;
        need_phone_number?: boolean;
        need_email?: boolean;
        need_shipping_address?: boolean;
        send_phone_number_to_provider?: boolean;
        send_email_to_provider?: boolean;
        is_flexible?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.sendInvoice({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendLivePhoto`
     */
    sendLivePhoto(livePhoto: TelegramInputFile | string, photo: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendLivePhoto({
            chat_id: this.raw.chat.id,
            live_photo: livePhoto,
            photo: photo,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendLocation`
     */
    sendLocation(latitude: number, longitude: number, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        horizontal_accuracy?: number;
        live_period?: number;
        heading?: number;
        proximity_alert_radius?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendLocation({
            chat_id: this.raw.chat.id,
            latitude: latitude,
            longitude: longitude,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendMediaGroup`
     */
    sendMediaGroup(media: (TelegramInputMediaAudio | TelegramInputMediaDocument | TelegramInputMediaLivePhoto | TelegramInputMediaPhoto | TelegramInputMediaVideo)[], params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
    } = {}) {
        return this.tg.api.sendMediaGroup({
            chat_id: this.raw.chat.id,
            media: media,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendMessage`
     */
    send(text: string | Formattable, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        link_preview_options?: TelegramLinkPreviewOptions;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendMessage({
            chat_id: this.raw.chat.id,
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendMessageDraft`
     */
    sendMessageDraft(draftId: number, text: string | Formattable, params: {
        message_thread_id?: number;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendMessageDraft({
            chat_id: this.raw.chat.id,
            draft_id: draftId,
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendPaidMedia`
     */
    sendPaidMedia(starCount: number, media: TelegramInputPaidMedia[], params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        payload?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPaidMedia({
            chat_id: this.raw.chat.id,
            star_count: starCount,
            media: media,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendPhoto`
     */
    sendPhoto(photo: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPhoto({
            chat_id: this.raw.chat.id,
            photo: photo,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendPoll`
     */
    sendPoll(question: string | Formattable, options: TelegramInputPollOption[], params: {
        business_connection_id?: string;
        message_thread_id?: number;
        question_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        question_entities?: TelegramMessageEntity[];
        is_anonymous?: boolean;
        type?: string;
        allows_multiple_answers?: boolean;
        allows_revoting?: boolean;
        shuffle_options?: boolean;
        allow_adding_options?: boolean;
        hide_results_until_closes?: boolean;
        members_only?: boolean;
        country_codes?: string[];
        correct_option_ids?: number[];
        explanation?: string | Formattable;
        explanation_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        explanation_entities?: TelegramMessageEntity[];
        explanation_media?: TelegramInputPollMedia;
        open_period?: number;
        close_date?: number;
        is_closed?: boolean;
        description?: string | Formattable;
        description_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        description_entities?: TelegramMessageEntity[];
        media?: TelegramInputPollMedia;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPoll({
            chat_id: this.raw.chat.id,
            question: question,
            options: options,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessage`
     */
    sendRichMessage(richMessage: TelegramInputRichMessage | RichLike, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendRichMessage({
            chat_id: this.raw.chat.id,
            rich_message: richMessage,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessageDraft`
     */
    sendRichMessageDraft(draftId: number, richMessage: TelegramInputRichMessage | RichLike, params: {
        message_thread_id?: number;
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendRichMessageDraft({
            chat_id: this.raw.chat.id,
            draft_id: draftId,
            rich_message: richMessage,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendSharedWidget`
     */
    sendSharedWidget(widgetId: string, params: {
        message_thread_id?: number;
        chat_data?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendSharedWidget({
            chat_id: this.raw.chat.id,
            widget_id: widgetId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendSticker`
     */
    sendSticker(sticker: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        emoji?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendSticker({
            chat_id: this.raw.chat.id,
            sticker: sticker,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendVenue`
     */
    sendVenue(latitude: number, longitude: number, title: string, address: string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        foursquare_id?: string;
        foursquare_type?: string;
        google_place_id?: string;
        google_place_type?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVenue({
            chat_id: this.raw.chat.id,
            latitude: latitude,
            longitude: longitude,
            title: title,
            address: address,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendVideo`
     */
    sendVideo(video: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        width?: number;
        height?: number;
        thumbnail?: TelegramInputFile | string;
        cover?: TelegramInputFile | string;
        start_timestamp?: number;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        supports_streaming?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVideo({
            chat_id: this.raw.chat.id,
            video: video,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendVideoNote`
     */
    sendVideoNote(videoNote: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        length?: number;
        thumbnail?: TelegramInputFile | string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVideoNote({
            chat_id: this.raw.chat.id,
            video_note: videoNote,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendVoice`
     */
    sendVoice(voice: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        duration?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVoice({
            chat_id: this.raw.chat.id,
            voice: voice,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendWidget`
     */
    sendWidget(html: string, params: {
        message_thread_id?: number;
        width?: number;
        height?: number;
        public_data?: string;
        chat_data?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        allow_queries?: boolean;
        is_shared?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendWidget({
            chat_id: this.raw.chat.id,
            html: html,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatAdministratorCustomTitle`
     */
    setChatAdministratorCustomTitle(user: number, customTitle: string, params: {} = {}) {
        return this.tg.api.setChatAdministratorCustomTitle({
            chat_id: this.raw.chat.id,
            user_id: user,
            custom_title: customTitle,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatDescription`
     */
    setChatDescription(params: {
        description?: string;
    } = {}) {
        return this.tg.api.setChatDescription({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatMemberTag`
     */
    setChatMemberTag(user: number, params: {
        tag?: string;
    } = {}) {
        return this.tg.api.setChatMemberTag({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatMenuButton`
     */
    setChatMenuButton(params: {
        menu_button?: TelegramMenuButton;
    } = {}) {
        return this.tg.api.setChatMenuButton({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatPermissions`
     */
    setChatPermissions(permissions: TelegramChatPermissions, params: {
        use_independent_chat_permissions?: boolean;
    } = {}) {
        return this.tg.api.setChatPermissions({
            chat_id: this.raw.chat.id,
            permissions: permissions,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatPhoto`
     */
    setChatPhoto(photo: TelegramInputFile, params: {} = {}) {
        return this.tg.api.setChatPhoto({
            chat_id: this.raw.chat.id,
            photo: photo,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatStickerSet`
     */
    setChatStickerSet(stickerSetName: string, params: {} = {}) {
        return this.tg.api.setChatStickerSet({
            chat_id: this.raw.chat.id,
            sticker_set_name: stickerSetName,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatTitle`
     */
    setChatTitle(title: string, params: {} = {}) {
        return this.tg.api.setChatTitle({
            chat_id: this.raw.chat.id,
            title: title,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setGameScore`
     */
    setGameScore(user: number, score: number, params: {
        force?: boolean;
        disable_edit_message?: boolean;
        message_id?: number;
        inline_message_id?: string;
    } = {}) {
        return this.tg.api.setGameScore({
            chat_id: this.raw.chat.id,
            user_id: user,
            score: score,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setMessageReaction`
     */
    setMessageReaction(messageId: number, reactions: TelegramReactionType[], params: {
        is_big?: boolean;
    } = {}) {
        return this.tg.api.setMessageReaction({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            reaction: reactions,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.stopMessageLiveLocation`
     */
    stopLiveLocation(params: {
        business_connection_id?: string;
        message_id?: number;
        inline_message_id?: string;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.stopMessageLiveLocation({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.stopPoll`
     */
    stopPoll(messageId: number, params: {
        business_connection_id?: string;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.stopPoll({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unbanChatMember`
     */
    unbanChatMember(user: number, params: {
        only_if_banned?: boolean;
    } = {}) {
        return this.tg.api.unbanChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unbanChatSenderChat`
     */
    unbanChatSenderChat(senderChat: number, params: {} = {}) {
        return this.tg.api.unbanChatSenderChat({
            chat_id: this.raw.chat.id,
            sender_chat_id: senderChat,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unhideGeneralForumTopic`
     */
    unhideGeneralForumTopic(params: {} = {}) {
        return this.tg.api.unhideGeneralForumTopic({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unpinAllChatMessages`
     */
    unpinAllChatMessages(params: {} = {}) {
        return this.tg.api.unpinAllChatMessages({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unpinAllForumTopicMessages`
     */
    unpinAllForumTopicMessages(threadId: number, params: {} = {}) {
        return this.tg.api.unpinAllForumTopicMessages({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unpinAllGeneralForumTopicMessages`
     */
    unpinAllGeneralForumTopicMessages(params: {} = {}) {
        return this.tg.api.unpinAllGeneralForumTopicMessages({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unpinChatMessage`
     */
    unpin(messageId: number, params: {
        business_connection_id?: string;
    } = {}) {
        return this.tg.api.unpinChatMessage({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.verifyChat`
     */
    verifyChat(params: {
        custom_description?: string | Formattable;
        custom_description_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        custom_description_entities?: TelegramMessageEntity[];
    } = {}) {
        return this.tg.api.verifyChat({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendMessageDraft`
     */
    sendDraft(draftId: number, text: string | Formattable, params: {
        message_thread_id?: number;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendMessageDraft({
            chat_id: this.raw.chat.id,
            draft_id: draftId,
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessage`
     */
    sendRich(richMessage: TelegramInputRichMessage | RichLike, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendRichMessage({
            chat_id: this.raw.chat.id,
            rich_message: richMessage,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessageDraft`
     */
    sendRichDraft(draftId: number, richMessage: TelegramInputRichMessage | RichLike, params: {
        message_thread_id?: number;
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendRichMessageDraft({
            chat_id: this.raw.chat.id,
            draft_id: draftId,
            rich_message: richMessage,
            ...params
        });
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect(this.constructor.name, this, depth, options, inspect);
    }
}

/**
 * update for the `my_chat_member` event
 */
export class MyChatMemberUpdate extends ChatMemberUpdatedShared {
    readonly kind = "my_chat_member" as const;
    private __brand!: never;
}

/**
 * update for the `chat_member` event
 */
export class ChatMemberUpdate extends ChatMemberUpdatedShared {
    readonly kind = "chat_member" as const;
    private __brand!: never;
}

/**
 * update for the `chat_join_request` event
 */
export class ChatJoinRequestUpdate {
    readonly kind = "chat_join_request" as const;
    private _chat?: Chat;
    private _from?: User;
    private _inviteLink?: ChatInviteLink;
    constructor(public raw: TelegramChatJoinRequest, public readonly tg: TelegramLike) { }
    /**
     * Chat to which the request was sent
     */
    get chat(): Chat {
        return this._chat ??= new Chat(this.raw.chat);
    }
    /**
     * User that sent the join request
     */
    get from(): User {
        return this._from ??= new User(this.raw.from);
    }
    /**
     * Identifier of a private chat with the user who sent the join request. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. The bot can use this identifier for 5 minutes to send messages until the join request is processed, assuming no other administrator contacted the user.
     */
    get userChatId(): number {
        return this.raw.user_chat_id;
    }
    /**
     * Date the request was sent in Unix time
     */
    get date(): number {
        return this.raw.date;
    }
    /**
     * Optional. Bio of the user
     */
    get bio(): string | undefined {
        return this.raw.bio;
    }
    /**
     * Optional. Chat invite link that was used by the user to send the join request
     */
    get inviteLink(): ChatInviteLink | undefined {
        return this.raw.invite_link ? (this._inviteLink ??= new ChatInviteLink(this.raw.invite_link)) : undefined;
    }
    /**
     * Optional. Identifier of the join request query; for bots assigned to process join requests only. If present, then the bot must call sendChatJoinRequestWebApp or directly call answerChatJoinRequestQuery within 10 seconds.
     */
    get queryId(): string | undefined {
        return this.raw.query_id;
    }
    /**
     * true if `bio` is set
     */
    hasBio(): this is this & {
        bio: string;
    } {
        return this.raw.bio != null;
    }
    /**
     * true if `invite_link` is set
     */
    hasInviteLink(): this is this & {
        inviteLink: ChatInviteLink;
    } {
        return this.raw.invite_link != null;
    }
    /**
     * true if `query_id` is set
     */
    hasQueryId(): this is this & {
        queryId: string;
    } {
        return this.raw.query_id != null;
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    /**
     * approve this join request
     */
    approve(): Promise<true> {
        return this.tg.api.approveChatJoinRequest({ chat_id: this.raw.chat.id, user_id: this.raw.from.id });
    }
    /**
     * decline this join request
     */
    decline(): Promise<true> {
        return this.tg.api.declineChatJoinRequest({ chat_id: this.raw.chat.id, user_id: this.raw.from.id });
    }
    /**
     * shortcut for `from.id` — uniform sender id across update kinds
     */
    get senderId(): number {
        return this.raw.from.id;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    /**
     * shortcut for `tg.api.answerChatJoinRequestQuery`
     */
    answer(result: "approve" | "decline" | "queue", params: {} = {}) {
        return this.tg.api.answerChatJoinRequestQuery({
            chat_join_request_query_id: this.raw.query_id as NonNullable<typeof this.raw.query_id>,
            result: result,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.approveChatJoinRequest`
     */
    approveChatJoinRequest(user: number, params: {} = {}) {
        return this.tg.api.approveChatJoinRequest({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.approveSuggestedPost`
     */
    approveSuggestedPost(messageId: number, params: {
        send_date?: number;
    } = {}) {
        return this.tg.api.approveSuggestedPost({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.banChatMember`
     */
    banChatMember(user: number, params: {
        until_date?: number;
        revoke_messages?: boolean;
    } = {}) {
        return this.tg.api.banChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.banChatSenderChat`
     */
    banChatSenderChat(senderChat: number, params: {} = {}) {
        return this.tg.api.banChatSenderChat({
            chat_id: this.raw.chat.id,
            sender_chat_id: senderChat,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.closeForumTopic`
     */
    closeForumTopic(threadId: number, params: {} = {}) {
        return this.tg.api.closeForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.closeGeneralForumTopic`
     */
    closeGeneralForumTopic(params: {} = {}) {
        return this.tg.api.closeGeneralForumTopic({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.copyMessage`
     */
    copy(from: number | string, messageId: number, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        video_start_timestamp?: number;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.copyMessage({
            chat_id: this.raw.chat.id,
            from_chat_id: from,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.copyMessages`
     */
    copyMany(from: number | string, messageIds: number[], params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        remove_caption?: boolean;
    } = {}) {
        return this.tg.api.copyMessages({
            chat_id: this.raw.chat.id,
            from_chat_id: from,
            message_ids: messageIds,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.createChatInviteLink`
     */
    createChatInviteLink(params: {
        name?: string;
        expire_date?: number;
        member_limit?: number;
        creates_join_request?: boolean;
    } = {}) {
        return this.tg.api.createChatInviteLink({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.createChatSubscriptionInviteLink`
     */
    createChatSubscriptionInviteLink(subscriptionPeriod: number, subscriptionPrice: number, params: {
        name?: string;
    } = {}) {
        return this.tg.api.createChatSubscriptionInviteLink({
            chat_id: this.raw.chat.id,
            subscription_period: subscriptionPeriod,
            subscription_price: subscriptionPrice,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.createForumTopic`
     */
    createForumTopic(name: string, params: {
        icon_color?: number;
        icon_custom_emoji_id?: string;
    } = {}) {
        return this.tg.api.createForumTopic({
            chat_id: this.raw.chat.id,
            name: name,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.declineChatJoinRequest`
     */
    declineChatJoinRequest(user: number, params: {} = {}) {
        return this.tg.api.declineChatJoinRequest({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.declineSuggestedPost`
     */
    declineSuggestedPost(messageId: number, params: {
        comment?: string;
    } = {}) {
        return this.tg.api.declineSuggestedPost({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteAllMessageReactions`
     */
    deleteAllMessageReactions(params: {
        user_id?: number;
        actor_chat_id?: number;
    } = {}) {
        return this.tg.api.deleteAllMessageReactions({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteChatPhoto`
     */
    deleteChatPhoto(params: {} = {}) {
        return this.tg.api.deleteChatPhoto({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteChatStickerSet`
     */
    deleteChatStickerSet(params: {} = {}) {
        return this.tg.api.deleteChatStickerSet({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteEphemeralMessage`
     */
    deleteEphemeralMessage(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
    }) {
        return this.tg.api.deleteEphemeralMessage({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteForumTopic`
     */
    deleteForumTopic(threadId: number, params: {} = {}) {
        return this.tg.api.deleteForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteMessage`
     */
    delete(messageId: number, params: {} = {}) {
        return this.tg.api.deleteMessage({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteMessageReaction`
     */
    deleteMessageReaction(messageId: number, params: {
        user_id?: number;
        actor_chat_id?: number;
    } = {}) {
        return this.tg.api.deleteMessageReaction({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteMessages`
     */
    deleteMany(messageIds: number[], params: {} = {}) {
        return this.tg.api.deleteMessages({
            chat_id: this.raw.chat.id,
            message_ids: messageIds,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editChatInviteLink`
     */
    editChatInviteLink(inviteLink: string, params: {
        name?: string;
        expire_date?: number;
        member_limit?: number;
        creates_join_request?: boolean;
    } = {}) {
        return this.tg.api.editChatInviteLink({
            chat_id: this.raw.chat.id,
            invite_link: inviteLink,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editChatSubscriptionInviteLink`
     */
    editChatSubscriptionInviteLink(inviteLink: string, params: {
        name?: string;
    } = {}) {
        return this.tg.api.editChatSubscriptionInviteLink({
            chat_id: this.raw.chat.id,
            invite_link: inviteLink,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editEphemeralMessageCaption`
     */
    editEphemeralMessageCaption(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.editEphemeralMessageCaption({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editEphemeralMessageMedia`
     */
    editEphemeralMessageMedia(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
        media: TelegramInputMedia;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.editEphemeralMessageMedia({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editEphemeralMessageReplyMarkup`
     */
    editEphemeralMessageReplyMarkup(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.editEphemeralMessageReplyMarkup({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editEphemeralMessageText`
     */
    editEphemeralMessageText(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
        text?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        rich_message?: TelegramInputRichMessage;
        link_preview_options?: TelegramLinkPreviewOptions;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.editEphemeralMessageText({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editForumTopic`
     */
    editForumTopic(threadId: number, params: {
        name?: string;
        icon_custom_emoji_id?: string;
    } = {}) {
        return this.tg.api.editForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editGeneralForumTopic`
     */
    editGeneralForumTopic(name: string, params: {} = {}) {
        return this.tg.api.editGeneralForumTopic({
            chat_id: this.raw.chat.id,
            name: name,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageCaption`
     */
    editCaption(params: {
        business_connection_id?: string;
        message_id?: number;
        inline_message_id?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.editMessageCaption({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageChecklist`
     */
    editMessageChecklist(messageId: number, checklist: TelegramInputChecklist, params: {
        business_connection_id: string;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.editMessageChecklist({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            checklist: checklist,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageLiveLocation`
     */
    editLiveLocation(latitude: number, longitude: number, params: {
        business_connection_id?: string;
        message_id?: number;
        inline_message_id?: string;
        live_period?: number;
        horizontal_accuracy?: number;
        heading?: number;
        proximity_alert_radius?: number;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.editMessageLiveLocation({
            chat_id: this.raw.chat.id,
            latitude: latitude,
            longitude: longitude,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageMedia`
     */
    editMedia(media: TelegramInputMedia, params: {
        business_connection_id?: string;
        message_id?: number;
        inline_message_id?: string;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.editMessageMedia({
            chat_id: this.raw.chat.id,
            media: media,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageReplyMarkup`
     */
    editReplyMarkup(params: {
        business_connection_id?: string;
        message_id?: number;
        inline_message_id?: string;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.editMessageReplyMarkup({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageText`
     */
    edit(text: string | Formattable, params: {
        business_connection_id?: string;
        message_id?: number;
        inline_message_id?: string;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        link_preview_options?: TelegramLinkPreviewOptions;
        rich_message?: TelegramInputRichMessage;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.editMessageText({
            chat_id: this.raw.chat.id,
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageWidgetData`
     */
    editWidgetData(params: {
        message_id?: number;
        inline_message_id?: string;
        public_data?: string;
        chat_data?: string;
    } = {}) {
        return this.tg.api.editMessageWidgetData({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.exportChatInviteLink`
     */
    exportChatInviteLink(params: {} = {}) {
        return this.tg.api.exportChatInviteLink({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.forwardMessage`
     */
    forward(from: number | string, messageId: number, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        video_start_timestamp?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
    } = {}) {
        return this.tg.api.forwardMessage({
            chat_id: this.raw.chat.id,
            from_chat_id: from,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.forwardMessages`
     */
    forwardMany(from: number | string, messageIds: number[], params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
    } = {}) {
        return this.tg.api.forwardMessages({
            chat_id: this.raw.chat.id,
            from_chat_id: from,
            message_ids: messageIds,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChat`
     */
    getChat(params: {} = {}) {
        return this.tg.api.getChat({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatAdministrators`
     */
    getChatAdministrators(params: {
        return_bots?: boolean;
    } = {}) {
        return this.tg.api.getChatAdministrators({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatGifts`
     */
    getChatGifts(params: {
        exclude_unsaved?: boolean;
        exclude_saved?: boolean;
        exclude_unlimited?: boolean;
        exclude_limited_upgradable?: boolean;
        exclude_limited_non_upgradable?: boolean;
        exclude_from_blockchain?: boolean;
        exclude_unique?: boolean;
        sort_by_price?: boolean;
        offset?: string;
        limit?: number;
    } = {}) {
        return this.tg.api.getChatGifts({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatMember`
     */
    getChatMember(user: number, params: {} = {}) {
        return this.tg.api.getChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatMemberCount`
     */
    getChatMemberCount(params: {} = {}) {
        return this.tg.api.getChatMemberCount({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatMenuButton`
     */
    getChatMenuButton(params: {} = {}) {
        return this.tg.api.getChatMenuButton({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getGameHighScores`
     */
    getGameHighScores(user: number, params: {
        message_id?: number;
        inline_message_id?: string;
    } = {}) {
        return this.tg.api.getGameHighScores({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getUserChatBoosts`
     */
    getUserChatBoosts(user: number, params: {} = {}) {
        return this.tg.api.getUserChatBoosts({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.hideGeneralForumTopic`
     */
    hideGeneralForumTopic(params: {} = {}) {
        return this.tg.api.hideGeneralForumTopic({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.leaveChat`
     */
    leaveChat(params: {} = {}) {
        return this.tg.api.leaveChat({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.pinChatMessage`
     */
    pin(messageId: number, params: {
        business_connection_id?: string;
        disable_notification?: boolean;
    } = {}) {
        return this.tg.api.pinChatMessage({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.promoteChatMember`
     */
    promoteChatMember(user: number, params: {
        is_anonymous?: boolean;
        can_manage_chat?: boolean;
        can_delete_messages?: boolean;
        can_manage_video_chats?: boolean;
        can_restrict_members?: boolean;
        can_promote_members?: boolean;
        can_change_info?: boolean;
        can_invite_users?: boolean;
        can_post_stories?: boolean;
        can_edit_stories?: boolean;
        can_delete_stories?: boolean;
        can_post_messages?: boolean;
        can_edit_messages?: boolean;
        can_pin_messages?: boolean;
        can_manage_topics?: boolean;
        can_manage_direct_messages?: boolean;
        can_manage_tags?: boolean;
        can_send_welcome_messages?: boolean;
    } = {}) {
        return this.tg.api.promoteChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.readBusinessMessage`
     */
    readBusinessMessage(messageId: number, params: {
        business_connection_id: string;
    }) {
        return this.tg.api.readBusinessMessage({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.removeChatVerification`
     */
    removeChatVerification(params: {} = {}) {
        return this.tg.api.removeChatVerification({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.reopenForumTopic`
     */
    reopenForumTopic(threadId: number, params: {} = {}) {
        return this.tg.api.reopenForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.reopenGeneralForumTopic`
     */
    reopenGeneralForumTopic(params: {} = {}) {
        return this.tg.api.reopenGeneralForumTopic({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.restrictChatMember`
     */
    restrictChatMember(user: number, permissions: TelegramChatPermissions, params: {
        use_independent_chat_permissions?: boolean;
        until_date?: number;
    } = {}) {
        return this.tg.api.restrictChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            permissions: permissions,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.revokeChatInviteLink`
     */
    revokeChatInviteLink(inviteLink: string, params: {} = {}) {
        return this.tg.api.revokeChatInviteLink({
            chat_id: this.raw.chat.id,
            invite_link: inviteLink,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendAnimation`
     */
    sendAnimation(animation: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        width?: number;
        height?: number;
        thumbnail?: TelegramInputFile | string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendAnimation({
            chat_id: this.raw.chat.id,
            animation: animation,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendAudio`
     */
    sendAudio(audio: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        duration?: number;
        performer?: string;
        title?: string;
        thumbnail?: TelegramInputFile | string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendAudio({
            chat_id: this.raw.chat.id,
            audio: audio,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendChatAction`
     */
    sendChatAction(action: string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
    } = {}) {
        return this.tg.api.sendChatAction({
            chat_id: this.raw.chat.id,
            action: action,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendChatJoinRequestWebApp`
     */
    sendChatJoinRequestWebApp(webAppUrl: string, params: {} = {}) {
        return this.tg.api.sendChatJoinRequestWebApp({
            chat_join_request_query_id: this.raw.query_id as NonNullable<typeof this.raw.query_id>,
            web_app_url: webAppUrl,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendChecklist`
     */
    sendChecklist(checklist: TelegramInputChecklist, params: {
        business_connection_id: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.sendChecklist({
            chat_id: this.raw.chat.id,
            checklist: checklist,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendContact`
     */
    sendContact(phoneNumber: string, firstName: string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        last_name?: string;
        vcard?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendContact({
            chat_id: this.raw.chat.id,
            phone_number: phoneNumber,
            first_name: firstName,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendDice`
     */
    sendDice(params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        emoji?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendDice({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendDocument`
     */
    sendDocument(document: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        thumbnail?: TelegramInputFile | string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        disable_content_type_detection?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendDocument({
            chat_id: this.raw.chat.id,
            document: document,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendGame`
     */
    sendGame(gameShortName: string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.sendGame({
            chat_id: this.raw.chat.id,
            game_short_name: gameShortName,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendGift`
     */
    sendGift(giftId: string, params: {
        user_id?: number;
        pay_for_upgrade?: boolean;
        text?: string | Formattable;
        text_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        text_entities?: TelegramMessageEntity[];
    } = {}) {
        return this.tg.api.sendGift({
            chat_id: this.raw.chat.id,
            gift_id: giftId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendInvoice`
     */
    sendInvoice(params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        title: string;
        description: string;
        payload: string;
        provider_token?: string;
        currency: string;
        prices: TelegramLabeledPrice[];
        max_tip_amount?: number;
        suggested_tip_amounts?: number[];
        start_parameter?: string;
        provider_data?: string;
        photo_url?: string;
        photo_size?: number;
        photo_width?: number;
        photo_height?: number;
        need_name?: boolean;
        need_phone_number?: boolean;
        need_email?: boolean;
        need_shipping_address?: boolean;
        send_phone_number_to_provider?: boolean;
        send_email_to_provider?: boolean;
        is_flexible?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.sendInvoice({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendLivePhoto`
     */
    sendLivePhoto(livePhoto: TelegramInputFile | string, photo: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendLivePhoto({
            chat_id: this.raw.chat.id,
            live_photo: livePhoto,
            photo: photo,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendLocation`
     */
    sendLocation(latitude: number, longitude: number, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        horizontal_accuracy?: number;
        live_period?: number;
        heading?: number;
        proximity_alert_radius?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendLocation({
            chat_id: this.raw.chat.id,
            latitude: latitude,
            longitude: longitude,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendMediaGroup`
     */
    sendMediaGroup(media: (TelegramInputMediaAudio | TelegramInputMediaDocument | TelegramInputMediaLivePhoto | TelegramInputMediaPhoto | TelegramInputMediaVideo)[], params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
    } = {}) {
        return this.tg.api.sendMediaGroup({
            chat_id: this.raw.chat.id,
            media: media,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendMessage`
     */
    send(text: string | Formattable, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        link_preview_options?: TelegramLinkPreviewOptions;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendMessage({
            chat_id: this.raw.chat.id,
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendMessageDraft`
     */
    sendMessageDraft(draftId: number, text: string | Formattable, params: {
        message_thread_id?: number;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendMessageDraft({
            chat_id: this.raw.chat.id,
            draft_id: draftId,
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendPaidMedia`
     */
    sendPaidMedia(starCount: number, media: TelegramInputPaidMedia[], params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        payload?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPaidMedia({
            chat_id: this.raw.chat.id,
            star_count: starCount,
            media: media,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendPhoto`
     */
    sendPhoto(photo: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPhoto({
            chat_id: this.raw.chat.id,
            photo: photo,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendPoll`
     */
    sendPoll(question: string | Formattable, options: TelegramInputPollOption[], params: {
        business_connection_id?: string;
        message_thread_id?: number;
        question_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        question_entities?: TelegramMessageEntity[];
        is_anonymous?: boolean;
        type?: string;
        allows_multiple_answers?: boolean;
        allows_revoting?: boolean;
        shuffle_options?: boolean;
        allow_adding_options?: boolean;
        hide_results_until_closes?: boolean;
        members_only?: boolean;
        country_codes?: string[];
        correct_option_ids?: number[];
        explanation?: string | Formattable;
        explanation_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        explanation_entities?: TelegramMessageEntity[];
        explanation_media?: TelegramInputPollMedia;
        open_period?: number;
        close_date?: number;
        is_closed?: boolean;
        description?: string | Formattable;
        description_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        description_entities?: TelegramMessageEntity[];
        media?: TelegramInputPollMedia;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPoll({
            chat_id: this.raw.chat.id,
            question: question,
            options: options,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessage`
     */
    sendRichMessage(richMessage: TelegramInputRichMessage | RichLike, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendRichMessage({
            chat_id: this.raw.chat.id,
            rich_message: richMessage,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessageDraft`
     */
    sendRichMessageDraft(draftId: number, richMessage: TelegramInputRichMessage | RichLike, params: {
        message_thread_id?: number;
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendRichMessageDraft({
            chat_id: this.raw.chat.id,
            draft_id: draftId,
            rich_message: richMessage,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendSharedWidget`
     */
    sendSharedWidget(widgetId: string, params: {
        message_thread_id?: number;
        chat_data?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendSharedWidget({
            chat_id: this.raw.chat.id,
            widget_id: widgetId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendSticker`
     */
    sendSticker(sticker: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        emoji?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendSticker({
            chat_id: this.raw.chat.id,
            sticker: sticker,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendVenue`
     */
    sendVenue(latitude: number, longitude: number, title: string, address: string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        foursquare_id?: string;
        foursquare_type?: string;
        google_place_id?: string;
        google_place_type?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVenue({
            chat_id: this.raw.chat.id,
            latitude: latitude,
            longitude: longitude,
            title: title,
            address: address,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendVideo`
     */
    sendVideo(video: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        width?: number;
        height?: number;
        thumbnail?: TelegramInputFile | string;
        cover?: TelegramInputFile | string;
        start_timestamp?: number;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        supports_streaming?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVideo({
            chat_id: this.raw.chat.id,
            video: video,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendVideoNote`
     */
    sendVideoNote(videoNote: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        length?: number;
        thumbnail?: TelegramInputFile | string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVideoNote({
            chat_id: this.raw.chat.id,
            video_note: videoNote,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendVoice`
     */
    sendVoice(voice: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        duration?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVoice({
            chat_id: this.raw.chat.id,
            voice: voice,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendWidget`
     */
    sendWidget(html: string, params: {
        message_thread_id?: number;
        width?: number;
        height?: number;
        public_data?: string;
        chat_data?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        allow_queries?: boolean;
        is_shared?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendWidget({
            chat_id: this.raw.chat.id,
            html: html,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatAdministratorCustomTitle`
     */
    setChatAdministratorCustomTitle(user: number, customTitle: string, params: {} = {}) {
        return this.tg.api.setChatAdministratorCustomTitle({
            chat_id: this.raw.chat.id,
            user_id: user,
            custom_title: customTitle,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatDescription`
     */
    setChatDescription(params: {
        description?: string;
    } = {}) {
        return this.tg.api.setChatDescription({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatMemberTag`
     */
    setChatMemberTag(user: number, params: {
        tag?: string;
    } = {}) {
        return this.tg.api.setChatMemberTag({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatMenuButton`
     */
    setChatMenuButton(params: {
        menu_button?: TelegramMenuButton;
    } = {}) {
        return this.tg.api.setChatMenuButton({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatPermissions`
     */
    setChatPermissions(permissions: TelegramChatPermissions, params: {
        use_independent_chat_permissions?: boolean;
    } = {}) {
        return this.tg.api.setChatPermissions({
            chat_id: this.raw.chat.id,
            permissions: permissions,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatPhoto`
     */
    setChatPhoto(photo: TelegramInputFile, params: {} = {}) {
        return this.tg.api.setChatPhoto({
            chat_id: this.raw.chat.id,
            photo: photo,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatStickerSet`
     */
    setChatStickerSet(stickerSetName: string, params: {} = {}) {
        return this.tg.api.setChatStickerSet({
            chat_id: this.raw.chat.id,
            sticker_set_name: stickerSetName,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatTitle`
     */
    setChatTitle(title: string, params: {} = {}) {
        return this.tg.api.setChatTitle({
            chat_id: this.raw.chat.id,
            title: title,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setGameScore`
     */
    setGameScore(user: number, score: number, params: {
        force?: boolean;
        disable_edit_message?: boolean;
        message_id?: number;
        inline_message_id?: string;
    } = {}) {
        return this.tg.api.setGameScore({
            chat_id: this.raw.chat.id,
            user_id: user,
            score: score,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setMessageReaction`
     */
    setMessageReaction(messageId: number, reactions: TelegramReactionType[], params: {
        is_big?: boolean;
    } = {}) {
        return this.tg.api.setMessageReaction({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            reaction: reactions,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.stopMessageLiveLocation`
     */
    stopLiveLocation(params: {
        business_connection_id?: string;
        message_id?: number;
        inline_message_id?: string;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.stopMessageLiveLocation({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.stopPoll`
     */
    stopPoll(messageId: number, params: {
        business_connection_id?: string;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.stopPoll({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unbanChatMember`
     */
    unbanChatMember(user: number, params: {
        only_if_banned?: boolean;
    } = {}) {
        return this.tg.api.unbanChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unbanChatSenderChat`
     */
    unbanChatSenderChat(senderChat: number, params: {} = {}) {
        return this.tg.api.unbanChatSenderChat({
            chat_id: this.raw.chat.id,
            sender_chat_id: senderChat,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unhideGeneralForumTopic`
     */
    unhideGeneralForumTopic(params: {} = {}) {
        return this.tg.api.unhideGeneralForumTopic({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unpinAllChatMessages`
     */
    unpinAllChatMessages(params: {} = {}) {
        return this.tg.api.unpinAllChatMessages({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unpinAllForumTopicMessages`
     */
    unpinAllForumTopicMessages(threadId: number, params: {} = {}) {
        return this.tg.api.unpinAllForumTopicMessages({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unpinAllGeneralForumTopicMessages`
     */
    unpinAllGeneralForumTopicMessages(params: {} = {}) {
        return this.tg.api.unpinAllGeneralForumTopicMessages({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unpinChatMessage`
     */
    unpin(messageId: number, params: {
        business_connection_id?: string;
    } = {}) {
        return this.tg.api.unpinChatMessage({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.verifyChat`
     */
    verifyChat(params: {
        custom_description?: string | Formattable;
        custom_description_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        custom_description_entities?: TelegramMessageEntity[];
    } = {}) {
        return this.tg.api.verifyChat({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendMessageDraft`
     */
    sendDraft(draftId: number, text: string | Formattable, params: {
        message_thread_id?: number;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendMessageDraft({
            chat_id: this.raw.chat.id,
            draft_id: draftId,
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessage`
     */
    sendRich(richMessage: TelegramInputRichMessage | RichLike, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendRichMessage({
            chat_id: this.raw.chat.id,
            rich_message: richMessage,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessageDraft`
     */
    sendRichDraft(draftId: number, richMessage: TelegramInputRichMessage | RichLike, params: {
        message_thread_id?: number;
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendRichMessageDraft({
            chat_id: this.raw.chat.id,
            draft_id: draftId,
            rich_message: richMessage,
            ...params
        });
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ChatJoinRequestUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `chat_boost` event
 */
export class ChatBoostUpdate {
    readonly kind = "chat_boost" as const;
    private _chat?: Chat;
    private _boost?: ChatBoost;
    constructor(public raw: TelegramChatBoostUpdated, public readonly tg: TelegramLike) { }
    /**
     * Chat which was boosted
     */
    get chat(): Chat {
        return this._chat ??= new Chat(this.raw.chat);
    }
    /**
     * Information about the chat boost
     */
    get boost(): ChatBoost {
        return this._boost ??= new ChatBoost(this.raw.boost);
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ChatBoostUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `removed_chat_boost` event
 */
export class RemovedChatBoostUpdate {
    readonly kind = "removed_chat_boost" as const;
    private _chat?: Chat;
    constructor(public raw: TelegramChatBoostRemoved, public readonly tg: TelegramLike) { }
    /**
     * Chat which was boosted
     */
    get chat(): Chat {
        return this._chat ??= new Chat(this.raw.chat);
    }
    /**
     * Unique identifier of the boost
     */
    get boostId(): string {
        return this.raw.boost_id;
    }
    /**
     * Point in time (Unix timestamp) when the boost was removed
     */
    get removeDate(): number {
        return this.raw.remove_date;
    }
    /**
     * Source of the removed boost
     */
    get source(): TelegramChatBoostSource {
        return this.raw.source;
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("RemovedChatBoostUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `managed_bot` event
 */
export class ManagedBotUpdate {
    readonly kind = "managed_bot" as const;
    private _user?: User;
    private _bot?: User;
    constructor(public raw: TelegramManagedBotUpdated, public readonly tg: TelegramLike) { }
    /**
     * User that created the bot
     */
    get user(): User {
        return this._user ??= new User(this.raw.user);
    }
    /**
     * Information about the bot. Token of the bot can be fetched using the method getManagedBotToken.
     */
    get bot(): User {
        return this._bot ??= new User(this.raw.bot);
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    /**
     * shortcut for `user.id` — uniform sender id across update kinds
     */
    get senderId(): number {
        return this.raw.user.id;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ManagedBotUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `subscription` event
 */
export class SubscriptionUpdate {
    readonly kind = "subscription" as const;
    private _user?: User;
    constructor(public raw: TelegramBotSubscriptionUpdated, public readonly tg: TelegramLike) { }
    /**
     * User who subscribed for payments toward the bot
     */
    get user(): User {
        return this._user ??= new User(this.raw.user);
    }
    /**
     * Bot-specified invoice payload
     */
    get invoicePayload(): string {
        return this.raw.invoice_payload;
    }
    /**
     * The new state of the subscription. Currently, it can be one of “canceled” if the user canceled the subscription, “active” if the user re-enabled a previously canceled subscription, or “failed” if payment for the subscription failed.
     */
    get state(): "canceled" | "active" | "failed" {
        return this.raw.state;
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    /**
     * shortcut for `user.id` — uniform sender id across update kinds
     */
    get senderId(): number {
        return this.raw.user.id;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("SubscriptionUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `stopped_message_generation` event
 */
export class StoppedMessageGenerationUpdate {
    readonly kind = "stopped_message_generation" as const;
    private _chat?: Chat;
    constructor(public raw: TelegramMessageGenerationStopped, public readonly tg: TelegramLike) { }
    /**
     * Chat in which the message is generated
     */
    get chat(): Chat {
        return this._chat ??= new Chat(this.raw.chat);
    }
    /**
     * Optional. Unique identifier of the message thread in which the message is generated
     */
    get messageThreadId(): number | undefined {
        return this.raw.message_thread_id;
    }
    /**
     * Unique identifier of the message draft which was stopped
     */
    get draftId(): number {
        return this.raw.draft_id;
    }
    /**
     * true if `message_thread_id` is set
     */
    hasMessageThreadId(): this is this & {
        messageThreadId: number;
        thread: MessageGenerationStoppedThreadShortcuts;
    } {
        return this.raw.message_thread_id != null;
    }
    /**
     * shortcut for `tg.api` — call any bot api method directly from the wrapped update
     */
    get api(): TelegramLike["api"] {
        return this.tg.api;
    }
    is<K extends UpdateKind>(kind: K): this is UpdateKindMap[K] {
        return this.kind === kind as unknown;
    }
    /**
     * shortcut for `tg.api.approveChatJoinRequest`
     */
    approveChatJoinRequest(user: number, params: {} = {}) {
        return this.tg.api.approveChatJoinRequest({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.approveSuggestedPost`
     */
    approveSuggestedPost(messageId: number, params: {
        send_date?: number;
    } = {}) {
        return this.tg.api.approveSuggestedPost({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.banChatMember`
     */
    banChatMember(user: number, params: {
        until_date?: number;
        revoke_messages?: boolean;
    } = {}) {
        return this.tg.api.banChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.banChatSenderChat`
     */
    banChatSenderChat(senderChat: number, params: {} = {}) {
        return this.tg.api.banChatSenderChat({
            chat_id: this.raw.chat.id,
            sender_chat_id: senderChat,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.closeForumTopic`
     */
    closeForumTopic(threadId: number, params: {} = {}) {
        return this.tg.api.closeForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.closeGeneralForumTopic`
     */
    closeGeneralForumTopic(params: {} = {}) {
        return this.tg.api.closeGeneralForumTopic({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.copyMessage`
     */
    copy(from: number | string, messageId: number, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        video_start_timestamp?: number;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.copyMessage({
            chat_id: this.raw.chat.id,
            from_chat_id: from,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.copyMessages`
     */
    copyMany(from: number | string, messageIds: number[], params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        remove_caption?: boolean;
    } = {}) {
        return this.tg.api.copyMessages({
            chat_id: this.raw.chat.id,
            from_chat_id: from,
            message_ids: messageIds,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.createChatInviteLink`
     */
    createChatInviteLink(params: {
        name?: string;
        expire_date?: number;
        member_limit?: number;
        creates_join_request?: boolean;
    } = {}) {
        return this.tg.api.createChatInviteLink({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.createChatSubscriptionInviteLink`
     */
    createChatSubscriptionInviteLink(subscriptionPeriod: number, subscriptionPrice: number, params: {
        name?: string;
    } = {}) {
        return this.tg.api.createChatSubscriptionInviteLink({
            chat_id: this.raw.chat.id,
            subscription_period: subscriptionPeriod,
            subscription_price: subscriptionPrice,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.createForumTopic`
     */
    createForumTopic(name: string, params: {
        icon_color?: number;
        icon_custom_emoji_id?: string;
    } = {}) {
        return this.tg.api.createForumTopic({
            chat_id: this.raw.chat.id,
            name: name,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.declineChatJoinRequest`
     */
    declineChatJoinRequest(user: number, params: {} = {}) {
        return this.tg.api.declineChatJoinRequest({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.declineSuggestedPost`
     */
    declineSuggestedPost(messageId: number, params: {
        comment?: string;
    } = {}) {
        return this.tg.api.declineSuggestedPost({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteAllMessageReactions`
     */
    deleteAllMessageReactions(params: {
        user_id?: number;
        actor_chat_id?: number;
    } = {}) {
        return this.tg.api.deleteAllMessageReactions({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteChatPhoto`
     */
    deleteChatPhoto(params: {} = {}) {
        return this.tg.api.deleteChatPhoto({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteChatStickerSet`
     */
    deleteChatStickerSet(params: {} = {}) {
        return this.tg.api.deleteChatStickerSet({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteEphemeralMessage`
     */
    deleteEphemeralMessage(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
    }) {
        return this.tg.api.deleteEphemeralMessage({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteForumTopic`
     */
    deleteForumTopic(threadId: number, params: {} = {}) {
        return this.tg.api.deleteForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteMessage`
     */
    delete(messageId: number, params: {} = {}) {
        return this.tg.api.deleteMessage({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteMessageReaction`
     */
    deleteMessageReaction(messageId: number, params: {
        user_id?: number;
        actor_chat_id?: number;
    } = {}) {
        return this.tg.api.deleteMessageReaction({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.deleteMessages`
     */
    deleteMany(messageIds: number[], params: {} = {}) {
        return this.tg.api.deleteMessages({
            chat_id: this.raw.chat.id,
            message_ids: messageIds,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editChatInviteLink`
     */
    editChatInviteLink(inviteLink: string, params: {
        name?: string;
        expire_date?: number;
        member_limit?: number;
        creates_join_request?: boolean;
    } = {}) {
        return this.tg.api.editChatInviteLink({
            chat_id: this.raw.chat.id,
            invite_link: inviteLink,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editChatSubscriptionInviteLink`
     */
    editChatSubscriptionInviteLink(inviteLink: string, params: {
        name?: string;
    } = {}) {
        return this.tg.api.editChatSubscriptionInviteLink({
            chat_id: this.raw.chat.id,
            invite_link: inviteLink,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editEphemeralMessageCaption`
     */
    editEphemeralMessageCaption(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.editEphemeralMessageCaption({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editEphemeralMessageMedia`
     */
    editEphemeralMessageMedia(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
        media: TelegramInputMedia;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.editEphemeralMessageMedia({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editEphemeralMessageReplyMarkup`
     */
    editEphemeralMessageReplyMarkup(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.editEphemeralMessageReplyMarkup({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editEphemeralMessageText`
     */
    editEphemeralMessageText(params: {
        receiver_user_id: number;
        ephemeral_message_id: number;
        text?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        rich_message?: TelegramInputRichMessage;
        link_preview_options?: TelegramLinkPreviewOptions;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.editEphemeralMessageText({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editForumTopic`
     */
    editForumTopic(threadId: number, params: {
        name?: string;
        icon_custom_emoji_id?: string;
    } = {}) {
        return this.tg.api.editForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editGeneralForumTopic`
     */
    editGeneralForumTopic(name: string, params: {} = {}) {
        return this.tg.api.editGeneralForumTopic({
            chat_id: this.raw.chat.id,
            name: name,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageCaption`
     */
    editCaption(params: {
        business_connection_id?: string;
        message_id?: number;
        inline_message_id?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.editMessageCaption({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageChecklist`
     */
    editMessageChecklist(messageId: number, checklist: TelegramInputChecklist, params: {
        business_connection_id: string;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.editMessageChecklist({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            checklist: checklist,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageLiveLocation`
     */
    editLiveLocation(latitude: number, longitude: number, params: {
        business_connection_id?: string;
        message_id?: number;
        inline_message_id?: string;
        live_period?: number;
        horizontal_accuracy?: number;
        heading?: number;
        proximity_alert_radius?: number;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.editMessageLiveLocation({
            chat_id: this.raw.chat.id,
            latitude: latitude,
            longitude: longitude,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageMedia`
     */
    editMedia(media: TelegramInputMedia, params: {
        business_connection_id?: string;
        message_id?: number;
        inline_message_id?: string;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.editMessageMedia({
            chat_id: this.raw.chat.id,
            media: media,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageReplyMarkup`
     */
    editReplyMarkup(params: {
        business_connection_id?: string;
        message_id?: number;
        inline_message_id?: string;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.editMessageReplyMarkup({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageText`
     */
    edit(text: string | Formattable, params: {
        business_connection_id?: string;
        message_id?: number;
        inline_message_id?: string;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        link_preview_options?: TelegramLinkPreviewOptions;
        rich_message?: TelegramInputRichMessage;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.editMessageText({
            chat_id: this.raw.chat.id,
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.editMessageWidgetData`
     */
    editWidgetData(params: {
        message_id?: number;
        inline_message_id?: string;
        public_data?: string;
        chat_data?: string;
    } = {}) {
        return this.tg.api.editMessageWidgetData({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.exportChatInviteLink`
     */
    exportChatInviteLink(params: {} = {}) {
        return this.tg.api.exportChatInviteLink({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.forwardMessage`
     */
    forward(from: number | string, messageId: number, params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        video_start_timestamp?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
    } = {}) {
        return this.tg.api.forwardMessage({
            chat_id: this.raw.chat.id,
            from_chat_id: from,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.forwardMessages`
     */
    forwardMany(from: number | string, messageIds: number[], params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
    } = {}) {
        return this.tg.api.forwardMessages({
            chat_id: this.raw.chat.id,
            from_chat_id: from,
            message_ids: messageIds,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChat`
     */
    getChat(params: {} = {}) {
        return this.tg.api.getChat({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatAdministrators`
     */
    getChatAdministrators(params: {
        return_bots?: boolean;
    } = {}) {
        return this.tg.api.getChatAdministrators({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatGifts`
     */
    getChatGifts(params: {
        exclude_unsaved?: boolean;
        exclude_saved?: boolean;
        exclude_unlimited?: boolean;
        exclude_limited_upgradable?: boolean;
        exclude_limited_non_upgradable?: boolean;
        exclude_from_blockchain?: boolean;
        exclude_unique?: boolean;
        sort_by_price?: boolean;
        offset?: string;
        limit?: number;
    } = {}) {
        return this.tg.api.getChatGifts({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatMember`
     */
    getChatMember(user: number, params: {} = {}) {
        return this.tg.api.getChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatMemberCount`
     */
    getChatMemberCount(params: {} = {}) {
        return this.tg.api.getChatMemberCount({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getChatMenuButton`
     */
    getChatMenuButton(params: {} = {}) {
        return this.tg.api.getChatMenuButton({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getGameHighScores`
     */
    getGameHighScores(user: number, params: {
        message_id?: number;
        inline_message_id?: string;
    } = {}) {
        return this.tg.api.getGameHighScores({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.getUserChatBoosts`
     */
    getUserChatBoosts(user: number, params: {} = {}) {
        return this.tg.api.getUserChatBoosts({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.hideGeneralForumTopic`
     */
    hideGeneralForumTopic(params: {} = {}) {
        return this.tg.api.hideGeneralForumTopic({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.leaveChat`
     */
    leaveChat(params: {} = {}) {
        return this.tg.api.leaveChat({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.pinChatMessage`
     */
    pin(messageId: number, params: {
        business_connection_id?: string;
        disable_notification?: boolean;
    } = {}) {
        return this.tg.api.pinChatMessage({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.promoteChatMember`
     */
    promoteChatMember(user: number, params: {
        is_anonymous?: boolean;
        can_manage_chat?: boolean;
        can_delete_messages?: boolean;
        can_manage_video_chats?: boolean;
        can_restrict_members?: boolean;
        can_promote_members?: boolean;
        can_change_info?: boolean;
        can_invite_users?: boolean;
        can_post_stories?: boolean;
        can_edit_stories?: boolean;
        can_delete_stories?: boolean;
        can_post_messages?: boolean;
        can_edit_messages?: boolean;
        can_pin_messages?: boolean;
        can_manage_topics?: boolean;
        can_manage_direct_messages?: boolean;
        can_manage_tags?: boolean;
        can_send_welcome_messages?: boolean;
    } = {}) {
        return this.tg.api.promoteChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.readBusinessMessage`
     */
    readBusinessMessage(messageId: number, params: {
        business_connection_id: string;
    }) {
        return this.tg.api.readBusinessMessage({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.removeChatVerification`
     */
    removeChatVerification(params: {} = {}) {
        return this.tg.api.removeChatVerification({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.reopenForumTopic`
     */
    reopenForumTopic(threadId: number, params: {} = {}) {
        return this.tg.api.reopenForumTopic({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.reopenGeneralForumTopic`
     */
    reopenGeneralForumTopic(params: {} = {}) {
        return this.tg.api.reopenGeneralForumTopic({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.restrictChatMember`
     */
    restrictChatMember(user: number, permissions: TelegramChatPermissions, params: {
        use_independent_chat_permissions?: boolean;
        until_date?: number;
    } = {}) {
        return this.tg.api.restrictChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            permissions: permissions,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.revokeChatInviteLink`
     */
    revokeChatInviteLink(inviteLink: string, params: {} = {}) {
        return this.tg.api.revokeChatInviteLink({
            chat_id: this.raw.chat.id,
            invite_link: inviteLink,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendAnimation`
     */
    sendAnimation(animation: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        width?: number;
        height?: number;
        thumbnail?: TelegramInputFile | string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendAnimation({
            chat_id: this.raw.chat.id,
            animation: animation,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendAudio`
     */
    sendAudio(audio: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        duration?: number;
        performer?: string;
        title?: string;
        thumbnail?: TelegramInputFile | string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendAudio({
            chat_id: this.raw.chat.id,
            audio: audio,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendChatAction`
     */
    sendChatAction(action: string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
    } = {}) {
        return this.tg.api.sendChatAction({
            chat_id: this.raw.chat.id,
            action: action,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendChecklist`
     */
    sendChecklist(checklist: TelegramInputChecklist, params: {
        business_connection_id: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.sendChecklist({
            chat_id: this.raw.chat.id,
            checklist: checklist,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendContact`
     */
    sendContact(phoneNumber: string, firstName: string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        last_name?: string;
        vcard?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendContact({
            chat_id: this.raw.chat.id,
            phone_number: phoneNumber,
            first_name: firstName,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendDice`
     */
    sendDice(params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        emoji?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendDice({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendDocument`
     */
    sendDocument(document: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        thumbnail?: TelegramInputFile | string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        disable_content_type_detection?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendDocument({
            chat_id: this.raw.chat.id,
            document: document,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendGame`
     */
    sendGame(gameShortName: string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.sendGame({
            chat_id: this.raw.chat.id,
            game_short_name: gameShortName,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendGift`
     */
    sendGift(giftId: string, params: {
        user_id?: number;
        pay_for_upgrade?: boolean;
        text?: string | Formattable;
        text_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        text_entities?: TelegramMessageEntity[];
    } = {}) {
        return this.tg.api.sendGift({
            chat_id: this.raw.chat.id,
            gift_id: giftId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendInvoice`
     */
    sendInvoice(params: {
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        title: string;
        description: string;
        payload: string;
        provider_token?: string;
        currency: string;
        prices: TelegramLabeledPrice[];
        max_tip_amount?: number;
        suggested_tip_amounts?: number[];
        start_parameter?: string;
        provider_data?: string;
        photo_url?: string;
        photo_size?: number;
        photo_width?: number;
        photo_height?: number;
        need_name?: boolean;
        need_phone_number?: boolean;
        need_email?: boolean;
        need_shipping_address?: boolean;
        send_phone_number_to_provider?: boolean;
        send_email_to_provider?: boolean;
        is_flexible?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    }) {
        return this.tg.api.sendInvoice({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendLivePhoto`
     */
    sendLivePhoto(livePhoto: TelegramInputFile | string, photo: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendLivePhoto({
            chat_id: this.raw.chat.id,
            live_photo: livePhoto,
            photo: photo,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendLocation`
     */
    sendLocation(latitude: number, longitude: number, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        horizontal_accuracy?: number;
        live_period?: number;
        heading?: number;
        proximity_alert_radius?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendLocation({
            chat_id: this.raw.chat.id,
            latitude: latitude,
            longitude: longitude,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendMediaGroup`
     */
    sendMediaGroup(media: (TelegramInputMediaAudio | TelegramInputMediaDocument | TelegramInputMediaLivePhoto | TelegramInputMediaPhoto | TelegramInputMediaVideo)[], params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
    } = {}) {
        return this.tg.api.sendMediaGroup({
            chat_id: this.raw.chat.id,
            media: media,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendMessage`
     */
    send(text: string | Formattable, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        link_preview_options?: TelegramLinkPreviewOptions;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendMessage({
            chat_id: this.raw.chat.id,
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendMessageDraft`
     */
    sendMessageDraft(draftId: number, text: string | Formattable, params: {
        message_thread_id?: number;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendMessageDraft({
            chat_id: this.raw.chat.id,
            draft_id: draftId,
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendPaidMedia`
     */
    sendPaidMedia(starCount: number, media: TelegramInputPaidMedia[], params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        payload?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPaidMedia({
            chat_id: this.raw.chat.id,
            star_count: starCount,
            media: media,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendPhoto`
     */
    sendPhoto(photo: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPhoto({
            chat_id: this.raw.chat.id,
            photo: photo,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendPoll`
     */
    sendPoll(question: string | Formattable, options: TelegramInputPollOption[], params: {
        business_connection_id?: string;
        message_thread_id?: number;
        question_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        question_entities?: TelegramMessageEntity[];
        is_anonymous?: boolean;
        type?: string;
        allows_multiple_answers?: boolean;
        allows_revoting?: boolean;
        shuffle_options?: boolean;
        allow_adding_options?: boolean;
        hide_results_until_closes?: boolean;
        members_only?: boolean;
        country_codes?: string[];
        correct_option_ids?: number[];
        explanation?: string | Formattable;
        explanation_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        explanation_entities?: TelegramMessageEntity[];
        explanation_media?: TelegramInputPollMedia;
        open_period?: number;
        close_date?: number;
        is_closed?: boolean;
        description?: string | Formattable;
        description_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        description_entities?: TelegramMessageEntity[];
        media?: TelegramInputPollMedia;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendPoll({
            chat_id: this.raw.chat.id,
            question: question,
            options: options,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessage`
     */
    sendRichMessage(richMessage: TelegramInputRichMessage | RichLike, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendRichMessage({
            chat_id: this.raw.chat.id,
            rich_message: richMessage,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessageDraft`
     */
    sendRichMessageDraft(draftId: number, richMessage: TelegramInputRichMessage | RichLike, params: {
        message_thread_id?: number;
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendRichMessageDraft({
            chat_id: this.raw.chat.id,
            draft_id: draftId,
            rich_message: richMessage,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendSharedWidget`
     */
    sendSharedWidget(widgetId: string, params: {
        message_thread_id?: number;
        chat_data?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendSharedWidget({
            chat_id: this.raw.chat.id,
            widget_id: widgetId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendSticker`
     */
    sendSticker(sticker: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        emoji?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendSticker({
            chat_id: this.raw.chat.id,
            sticker: sticker,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendVenue`
     */
    sendVenue(latitude: number, longitude: number, title: string, address: string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        foursquare_id?: string;
        foursquare_type?: string;
        google_place_id?: string;
        google_place_type?: string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVenue({
            chat_id: this.raw.chat.id,
            latitude: latitude,
            longitude: longitude,
            title: title,
            address: address,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendVideo`
     */
    sendVideo(video: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        width?: number;
        height?: number;
        thumbnail?: TelegramInputFile | string;
        cover?: TelegramInputFile | string;
        start_timestamp?: number;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        has_spoiler?: boolean;
        supports_streaming?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVideo({
            chat_id: this.raw.chat.id,
            video: video,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendVideoNote`
     */
    sendVideoNote(videoNote: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        duration?: number;
        length?: number;
        thumbnail?: TelegramInputFile | string;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVideoNote({
            chat_id: this.raw.chat.id,
            video_note: videoNote,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendVoice`
     */
    sendVoice(voice: TelegramInputFile | string, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        duration?: number;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendVoice({
            chat_id: this.raw.chat.id,
            voice: voice,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendWidget`
     */
    sendWidget(html: string, params: {
        message_thread_id?: number;
        width?: number;
        height?: number;
        public_data?: string;
        chat_data?: string;
        caption?: string | Formattable;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        caption_entities?: TelegramMessageEntity[];
        show_caption_above_media?: boolean;
        allow_queries?: boolean;
        is_shared?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendWidget({
            chat_id: this.raw.chat.id,
            html: html,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatAdministratorCustomTitle`
     */
    setChatAdministratorCustomTitle(user: number, customTitle: string, params: {} = {}) {
        return this.tg.api.setChatAdministratorCustomTitle({
            chat_id: this.raw.chat.id,
            user_id: user,
            custom_title: customTitle,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatDescription`
     */
    setChatDescription(params: {
        description?: string;
    } = {}) {
        return this.tg.api.setChatDescription({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatMemberTag`
     */
    setChatMemberTag(user: number, params: {
        tag?: string;
    } = {}) {
        return this.tg.api.setChatMemberTag({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatMenuButton`
     */
    setChatMenuButton(params: {
        menu_button?: TelegramMenuButton;
    } = {}) {
        return this.tg.api.setChatMenuButton({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatPermissions`
     */
    setChatPermissions(permissions: TelegramChatPermissions, params: {
        use_independent_chat_permissions?: boolean;
    } = {}) {
        return this.tg.api.setChatPermissions({
            chat_id: this.raw.chat.id,
            permissions: permissions,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatPhoto`
     */
    setChatPhoto(photo: TelegramInputFile, params: {} = {}) {
        return this.tg.api.setChatPhoto({
            chat_id: this.raw.chat.id,
            photo: photo,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatStickerSet`
     */
    setChatStickerSet(stickerSetName: string, params: {} = {}) {
        return this.tg.api.setChatStickerSet({
            chat_id: this.raw.chat.id,
            sticker_set_name: stickerSetName,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setChatTitle`
     */
    setChatTitle(title: string, params: {} = {}) {
        return this.tg.api.setChatTitle({
            chat_id: this.raw.chat.id,
            title: title,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setGameScore`
     */
    setGameScore(user: number, score: number, params: {
        force?: boolean;
        disable_edit_message?: boolean;
        message_id?: number;
        inline_message_id?: string;
    } = {}) {
        return this.tg.api.setGameScore({
            chat_id: this.raw.chat.id,
            user_id: user,
            score: score,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.setMessageReaction`
     */
    setMessageReaction(messageId: number, reactions: TelegramReactionType[], params: {
        is_big?: boolean;
    } = {}) {
        return this.tg.api.setMessageReaction({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            reaction: reactions,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.stopMessageLiveLocation`
     */
    stopLiveLocation(params: {
        business_connection_id?: string;
        message_id?: number;
        inline_message_id?: string;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.stopMessageLiveLocation({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.stopPoll`
     */
    stopPoll(messageId: number, params: {
        business_connection_id?: string;
        reply_markup?: TelegramInlineKeyboardMarkup | {
            toJSON: () => TelegramInlineKeyboardMarkup;
        };
    } = {}) {
        return this.tg.api.stopPoll({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unbanChatMember`
     */
    unbanChatMember(user: number, params: {
        only_if_banned?: boolean;
    } = {}) {
        return this.tg.api.unbanChatMember({
            chat_id: this.raw.chat.id,
            user_id: user,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unbanChatSenderChat`
     */
    unbanChatSenderChat(senderChat: number, params: {} = {}) {
        return this.tg.api.unbanChatSenderChat({
            chat_id: this.raw.chat.id,
            sender_chat_id: senderChat,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unhideGeneralForumTopic`
     */
    unhideGeneralForumTopic(params: {} = {}) {
        return this.tg.api.unhideGeneralForumTopic({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unpinAllChatMessages`
     */
    unpinAllChatMessages(params: {} = {}) {
        return this.tg.api.unpinAllChatMessages({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unpinAllForumTopicMessages`
     */
    unpinAllForumTopicMessages(threadId: number, params: {} = {}) {
        return this.tg.api.unpinAllForumTopicMessages({
            chat_id: this.raw.chat.id,
            message_thread_id: threadId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unpinAllGeneralForumTopicMessages`
     */
    unpinAllGeneralForumTopicMessages(params: {} = {}) {
        return this.tg.api.unpinAllGeneralForumTopicMessages({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.unpinChatMessage`
     */
    unpin(messageId: number, params: {
        business_connection_id?: string;
    } = {}) {
        return this.tg.api.unpinChatMessage({
            chat_id: this.raw.chat.id,
            message_id: messageId,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.verifyChat`
     */
    verifyChat(params: {
        custom_description?: string | Formattable;
        custom_description_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        custom_description_entities?: TelegramMessageEntity[];
    } = {}) {
        return this.tg.api.verifyChat({
            chat_id: this.raw.chat.id,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendMessageDraft`
     */
    sendDraft(draftId: number, text: string | Formattable, params: {
        message_thread_id?: number;
        parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
        entities?: TelegramMessageEntity[];
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendMessageDraft({
            chat_id: this.raw.chat.id,
            draft_id: draftId,
            text: text,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessage`
     */
    sendRich(richMessage: TelegramInputRichMessage | RichLike, params: {
        business_connection_id?: string;
        message_thread_id?: number;
        direct_messages_topic_id?: number;
        ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
        disable_notification?: boolean;
        protect_content?: boolean;
        allow_paid_broadcast?: boolean;
        message_effect_id?: string;
        suggested_post_parameters?: TelegramSuggestedPostParameters;
        reply_parameters?: TelegramReplyParameters;
        reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
            toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
        };
    } = {}) {
        return this.tg.api.sendRichMessage({
            chat_id: this.raw.chat.id,
            rich_message: richMessage,
            ...params
        });
    }
    /**
     * shortcut for `tg.api.sendRichMessageDraft`
     */
    sendRichDraft(draftId: number, richMessage: TelegramInputRichMessage | RichLike, params: {
        message_thread_id?: number;
        can_stop?: boolean;
        keep_on_stop?: boolean;
    } = {}) {
        return this.tg.api.sendRichMessageDraft({
            chat_id: this.raw.chat.id,
            draft_id: draftId,
            rich_message: richMessage,
            ...params
        });
    }
    /**
     * thread-scoped shortcuts — auto-fill `message_thread_id` on every call. `undefined` when this message is not in a thread / forum topic
     */
    get thread(): MessageGenerationStoppedThreadShortcuts | undefined {
        return this.raw.message_thread_id == null ? undefined : new MessageGenerationStoppedThreadShortcuts(this.raw, this.tg);
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("StoppedMessageGenerationUpdate", this, depth, options, inspect);
    }
}

/**
 * update for the `new_chat_members` event
 */
export class NewChatMembersUpdate extends MessageShared {
    readonly kind = "new_chat_members" as const;
    private __brand!: never;
}

/**
 * update for the `left_chat_member` event
 */
export class LeftChatMemberUpdate extends MessageShared {
    readonly kind = "left_chat_member" as const;
    private __brand!: never;
}

/**
 * update for the `new_chat_title` event
 */
export class NewChatTitleUpdate extends MessageShared {
    readonly kind = "new_chat_title" as const;
    private __brand!: never;
}

/**
 * update for the `new_chat_photo` event
 */
export class NewChatPhotoUpdate extends MessageShared {
    readonly kind = "new_chat_photo" as const;
    private __brand!: never;
}

/**
 * update for the `delete_chat_photo` event
 */
export class DeleteChatPhotoUpdate extends MessageShared {
    readonly kind = "delete_chat_photo" as const;
    private __brand!: never;
}

/**
 * update for the `group_chat_created` event
 */
export class GroupChatCreatedUpdate extends MessageShared {
    readonly kind = "group_chat_created" as const;
    private __brand!: never;
}

/**
 * update for the `pinned_message` event
 */
export class PinnedMessageUpdate extends MessageShared {
    readonly kind = "pinned_message" as const;
    private __brand!: never;
}

/**
 * update for the `invoice` event
 */
export class InvoiceUpdate extends MessageShared {
    readonly kind = "invoice" as const;
    private __brand!: never;
}

/**
 * update for the `successful_payment` event
 */
export class SuccessfulPaymentUpdate extends MessageShared {
    readonly kind = "successful_payment" as const;
    private __brand!: never;
}

/**
 * update for the `users_shared` event
 */
export class UsersSharedUpdate extends MessageShared {
    readonly kind = "users_shared" as const;
    private __brand!: never;
}

/**
 * update for the `chat_shared` event
 */
export class ChatSharedUpdate extends MessageShared {
    readonly kind = "chat_shared" as const;
    private __brand!: never;
}

/**
 * update for the `web_app_data` event
 */
export class WebAppDataUpdate extends MessageShared {
    readonly kind = "web_app_data" as const;
    private __brand!: never;
}

/**
 * update for the `video_chat_scheduled` event
 */
export class VideoChatScheduledUpdate extends MessageShared {
    readonly kind = "video_chat_scheduled" as const;
    private __brand!: never;
}

/**
 * update for the `video_chat_started` event
 */
export class VideoChatStartedUpdate extends MessageShared {
    readonly kind = "video_chat_started" as const;
    private __brand!: never;
}

/**
 * update for the `video_chat_ended` event
 */
export class VideoChatEndedUpdate extends MessageShared {
    readonly kind = "video_chat_ended" as const;
    private __brand!: never;
}

/**
 * update for the `video_chat_participants_invited` event
 */
export class VideoChatParticipantsInvitedUpdate extends MessageShared {
    readonly kind = "video_chat_participants_invited" as const;
    private __brand!: never;
}

/**
 * update for the `forum_topic_created` event
 */
export class ForumTopicCreatedUpdate extends MessageShared {
    readonly kind = "forum_topic_created" as const;
    private __brand!: never;
}

/**
 * update for the `forum_topic_edited` event
 */
export class ForumTopicEditedUpdate extends MessageShared {
    readonly kind = "forum_topic_edited" as const;
    private __brand!: never;
}

/**
 * update for the `forum_topic_closed` event
 */
export class ForumTopicClosedUpdate extends MessageShared {
    readonly kind = "forum_topic_closed" as const;
    private __brand!: never;
}

/**
 * update for the `forum_topic_reopened` event
 */
export class ForumTopicReopenedUpdate extends MessageShared {
    readonly kind = "forum_topic_reopened" as const;
    private __brand!: never;
}

/**
 * update for the `general_forum_topic_hidden` event
 */
export class GeneralForumTopicHiddenUpdate extends MessageShared {
    readonly kind = "general_forum_topic_hidden" as const;
    private __brand!: never;
}

/**
 * update for the `general_forum_topic_unhidden` event
 */
export class GeneralForumTopicUnhiddenUpdate extends MessageShared {
    readonly kind = "general_forum_topic_unhidden" as const;
    private __brand!: never;
}

/**
 * update for the `giveaway_created` event
 */
export class GiveawayCreatedUpdate extends MessageShared {
    readonly kind = "giveaway_created" as const;
    private __brand!: never;
}

/**
 * update for the `giveaway_completed` event
 */
export class GiveawayCompletedUpdate extends MessageShared {
    readonly kind = "giveaway_completed" as const;
    private __brand!: never;
}

/**
 * update for the `giveaway_winners` event
 */
export class GiveawayWinnersUpdate extends MessageShared {
    readonly kind = "giveaway_winners" as const;
    private __brand!: never;
}

/**
 * update for the `boost_added` event
 */
export class BoostAddedUpdate extends MessageShared {
    readonly kind = "boost_added" as const;
    private __brand!: never;
}

/**
 * update for the `message_auto_delete_timer_changed` event
 */
export class MessageAutoDeleteTimerChangedUpdate extends MessageShared {
    readonly kind = "message_auto_delete_timer_changed" as const;
    private __brand!: never;
}

/**
 * update for the `migrate_to_chat_id` event
 */
export class MigrateToChatIdUpdate extends MessageShared {
    readonly kind = "migrate_to_chat_id" as const;
    private __brand!: never;
}

/**
 * update for the `migrate_from_chat_id` event
 */
export class MigrateFromChatIdUpdate extends MessageShared {
    readonly kind = "migrate_from_chat_id" as const;
    private __brand!: never;
}

/**
 * update for the `passport_data` event
 */
export class PassportDataUpdate extends MessageShared {
    readonly kind = "passport_data" as const;
    private __brand!: never;
}

/**
 * update for the `proximity_alert_triggered` event
 */
export class ProximityAlertTriggeredUpdate extends MessageShared {
    readonly kind = "proximity_alert_triggered" as const;
    private __brand!: never;
}

/**
 * update for the `write_access_allowed` event
 */
export class WriteAccessAllowedUpdate extends MessageShared {
    readonly kind = "write_access_allowed" as const;
    private __brand!: never;
}

/**
 * update for the `community_chat_added` event
 */
export class CommunityChatAddedUpdate extends MessageShared {
    readonly kind = "community_chat_added" as const;
    private __brand!: never;
}

/**
 * update for the `community_chat_removed` event
 */
export class CommunityChatRemovedUpdate extends MessageShared {
    readonly kind = "community_chat_removed" as const;
    private __brand!: never;
}

/**
 * update for the `paid_messages_waived` event
 */
export class PaidMessagesWaivedUpdate extends MessageShared {
    readonly kind = "paid_messages_waived" as const;
    private __brand!: never;
}

/**
 * update for the `ton_wallet_transfer` event
 */
export class TonWalletTransferUpdate extends MessageShared {
    readonly kind = "ton_wallet_transfer" as const;
    private __brand!: never;
}

export type UpdateKind = keyof UpdateKindMap;

export interface UpdateKindMap {
    "message": MessageUpdate;
    "edited_message": EditedMessageUpdate;
    "channel_post": ChannelPostUpdate;
    "edited_channel_post": EditedChannelPostUpdate;
    "business_connection": BusinessConnectionUpdate;
    "business_message": BusinessMessageUpdate;
    "edited_business_message": EditedBusinessMessageUpdate;
    "deleted_business_messages": DeletedBusinessMessagesUpdate;
    "guest_message": GuestMessageUpdate;
    "message_reaction": MessageReactionUpdate;
    "message_reaction_count": MessageReactionCountUpdate;
    "inline_query": InlineQueryUpdate;
    "chosen_inline_result": ChosenInlineResultUpdate;
    "callback_query": CallbackQueryUpdate;
    "widget_query": WidgetQueryUpdate;
    "shared_widget_query": SharedWidgetQueryUpdate;
    "shipping_query": ShippingQueryUpdate;
    "pre_checkout_query": PreCheckoutQueryUpdate;
    "purchased_paid_media": PurchasedPaidMediaUpdate;
    "poll": PollUpdate;
    "poll_answer": PollAnswerUpdate;
    "my_chat_member": MyChatMemberUpdate;
    "chat_member": ChatMemberUpdate;
    "chat_join_request": ChatJoinRequestUpdate;
    "chat_boost": ChatBoostUpdate;
    "removed_chat_boost": RemovedChatBoostUpdate;
    "managed_bot": ManagedBotUpdate;
    "subscription": SubscriptionUpdate;
    "stopped_message_generation": StoppedMessageGenerationUpdate;
    "new_chat_members": NewChatMembersUpdate;
    "left_chat_member": LeftChatMemberUpdate;
    "new_chat_title": NewChatTitleUpdate;
    "new_chat_photo": NewChatPhotoUpdate;
    "delete_chat_photo": DeleteChatPhotoUpdate;
    "group_chat_created": GroupChatCreatedUpdate;
    "pinned_message": PinnedMessageUpdate;
    "invoice": InvoiceUpdate;
    "successful_payment": SuccessfulPaymentUpdate;
    "users_shared": UsersSharedUpdate;
    "chat_shared": ChatSharedUpdate;
    "web_app_data": WebAppDataUpdate;
    "video_chat_scheduled": VideoChatScheduledUpdate;
    "video_chat_started": VideoChatStartedUpdate;
    "video_chat_ended": VideoChatEndedUpdate;
    "video_chat_participants_invited": VideoChatParticipantsInvitedUpdate;
    "forum_topic_created": ForumTopicCreatedUpdate;
    "forum_topic_edited": ForumTopicEditedUpdate;
    "forum_topic_closed": ForumTopicClosedUpdate;
    "forum_topic_reopened": ForumTopicReopenedUpdate;
    "general_forum_topic_hidden": GeneralForumTopicHiddenUpdate;
    "general_forum_topic_unhidden": GeneralForumTopicUnhiddenUpdate;
    "giveaway_created": GiveawayCreatedUpdate;
    "giveaway_completed": GiveawayCompletedUpdate;
    "giveaway_winners": GiveawayWinnersUpdate;
    "boost_added": BoostAddedUpdate;
    "message_auto_delete_timer_changed": MessageAutoDeleteTimerChangedUpdate;
    "migrate_to_chat_id": MigrateToChatIdUpdate;
    "migrate_from_chat_id": MigrateFromChatIdUpdate;
    "passport_data": PassportDataUpdate;
    "proximity_alert_triggered": ProximityAlertTriggeredUpdate;
    "write_access_allowed": WriteAccessAllowedUpdate;
    "community_chat_added": CommunityChatAddedUpdate;
    "community_chat_removed": CommunityChatRemovedUpdate;
    "paid_messages_waived": PaidMessagesWaivedUpdate;
    "ton_wallet_transfer": TonWalletTransferUpdate;
}

export type Update = MessageUpdate | EditedMessageUpdate | ChannelPostUpdate | EditedChannelPostUpdate | BusinessConnectionUpdate | BusinessMessageUpdate | EditedBusinessMessageUpdate | DeletedBusinessMessagesUpdate | GuestMessageUpdate | MessageReactionUpdate | MessageReactionCountUpdate | InlineQueryUpdate | ChosenInlineResultUpdate | CallbackQueryUpdate | WidgetQueryUpdate | SharedWidgetQueryUpdate | ShippingQueryUpdate | PreCheckoutQueryUpdate | PurchasedPaidMediaUpdate | PollUpdate | PollAnswerUpdate | MyChatMemberUpdate | ChatMemberUpdate | ChatJoinRequestUpdate | ChatBoostUpdate | RemovedChatBoostUpdate | ManagedBotUpdate | SubscriptionUpdate | StoppedMessageGenerationUpdate | NewChatMembersUpdate | LeftChatMemberUpdate | NewChatTitleUpdate | NewChatPhotoUpdate | DeleteChatPhotoUpdate | GroupChatCreatedUpdate | PinnedMessageUpdate | InvoiceUpdate | SuccessfulPaymentUpdate | UsersSharedUpdate | ChatSharedUpdate | WebAppDataUpdate | VideoChatScheduledUpdate | VideoChatStartedUpdate | VideoChatEndedUpdate | VideoChatParticipantsInvitedUpdate | ForumTopicCreatedUpdate | ForumTopicEditedUpdate | ForumTopicClosedUpdate | ForumTopicReopenedUpdate | GeneralForumTopicHiddenUpdate | GeneralForumTopicUnhiddenUpdate | GiveawayCreatedUpdate | GiveawayCompletedUpdate | GiveawayWinnersUpdate | BoostAddedUpdate | MessageAutoDeleteTimerChangedUpdate | MigrateToChatIdUpdate | MigrateFromChatIdUpdate | PassportDataUpdate | ProximityAlertTriggeredUpdate | WriteAccessAllowedUpdate | CommunityChatAddedUpdate | CommunityChatRemovedUpdate | PaidMessagesWaivedUpdate | TonWalletTransferUpdate;

export const UPDATE_KINDS: readonly UpdateKind[] = [
    "message",
    "edited_message",
    "channel_post",
    "edited_channel_post",
    "business_connection",
    "business_message",
    "edited_business_message",
    "deleted_business_messages",
    "guest_message",
    "message_reaction",
    "message_reaction_count",
    "inline_query",
    "chosen_inline_result",
    "callback_query",
    "widget_query",
    "shared_widget_query",
    "shipping_query",
    "pre_checkout_query",
    "purchased_paid_media",
    "poll",
    "poll_answer",
    "my_chat_member",
    "chat_member",
    "chat_join_request",
    "chat_boost",
    "removed_chat_boost",
    "managed_bot",
    "subscription",
    "stopped_message_generation",
    "new_chat_members",
    "left_chat_member",
    "new_chat_title",
    "new_chat_photo",
    "delete_chat_photo",
    "group_chat_created",
    "pinned_message",
    "invoice",
    "successful_payment",
    "users_shared",
    "chat_shared",
    "web_app_data",
    "video_chat_scheduled",
    "video_chat_started",
    "video_chat_ended",
    "video_chat_participants_invited",
    "forum_topic_created",
    "forum_topic_edited",
    "forum_topic_closed",
    "forum_topic_reopened",
    "general_forum_topic_hidden",
    "general_forum_topic_unhidden",
    "giveaway_created",
    "giveaway_completed",
    "giveaway_winners",
    "boost_added",
    "message_auto_delete_timer_changed",
    "migrate_to_chat_id",
    "migrate_from_chat_id",
    "passport_data",
    "proximity_alert_triggered",
    "write_access_allowed",
    "community_chat_added",
    "community_chat_removed",
    "paid_messages_waived",
    "ton_wallet_transfer"
];

export const UPDATE_CLASSES = {
    "message": MessageUpdate,
    "edited_message": EditedMessageUpdate,
    "channel_post": ChannelPostUpdate,
    "edited_channel_post": EditedChannelPostUpdate,
    "business_connection": BusinessConnectionUpdate,
    "business_message": BusinessMessageUpdate,
    "edited_business_message": EditedBusinessMessageUpdate,
    "deleted_business_messages": DeletedBusinessMessagesUpdate,
    "guest_message": GuestMessageUpdate,
    "message_reaction": MessageReactionUpdate,
    "message_reaction_count": MessageReactionCountUpdate,
    "inline_query": InlineQueryUpdate,
    "chosen_inline_result": ChosenInlineResultUpdate,
    "callback_query": CallbackQueryUpdate,
    "widget_query": WidgetQueryUpdate,
    "shared_widget_query": SharedWidgetQueryUpdate,
    "shipping_query": ShippingQueryUpdate,
    "pre_checkout_query": PreCheckoutQueryUpdate,
    "purchased_paid_media": PurchasedPaidMediaUpdate,
    "poll": PollUpdate,
    "poll_answer": PollAnswerUpdate,
    "my_chat_member": MyChatMemberUpdate,
    "chat_member": ChatMemberUpdate,
    "chat_join_request": ChatJoinRequestUpdate,
    "chat_boost": ChatBoostUpdate,
    "removed_chat_boost": RemovedChatBoostUpdate,
    "managed_bot": ManagedBotUpdate,
    "subscription": SubscriptionUpdate,
    "stopped_message_generation": StoppedMessageGenerationUpdate,
    "new_chat_members": NewChatMembersUpdate,
    "left_chat_member": LeftChatMemberUpdate,
    "new_chat_title": NewChatTitleUpdate,
    "new_chat_photo": NewChatPhotoUpdate,
    "delete_chat_photo": DeleteChatPhotoUpdate,
    "group_chat_created": GroupChatCreatedUpdate,
    "pinned_message": PinnedMessageUpdate,
    "invoice": InvoiceUpdate,
    "successful_payment": SuccessfulPaymentUpdate,
    "users_shared": UsersSharedUpdate,
    "chat_shared": ChatSharedUpdate,
    "web_app_data": WebAppDataUpdate,
    "video_chat_scheduled": VideoChatScheduledUpdate,
    "video_chat_started": VideoChatStartedUpdate,
    "video_chat_ended": VideoChatEndedUpdate,
    "video_chat_participants_invited": VideoChatParticipantsInvitedUpdate,
    "forum_topic_created": ForumTopicCreatedUpdate,
    "forum_topic_edited": ForumTopicEditedUpdate,
    "forum_topic_closed": ForumTopicClosedUpdate,
    "forum_topic_reopened": ForumTopicReopenedUpdate,
    "general_forum_topic_hidden": GeneralForumTopicHiddenUpdate,
    "general_forum_topic_unhidden": GeneralForumTopicUnhiddenUpdate,
    "giveaway_created": GiveawayCreatedUpdate,
    "giveaway_completed": GiveawayCompletedUpdate,
    "giveaway_winners": GiveawayWinnersUpdate,
    "boost_added": BoostAddedUpdate,
    "message_auto_delete_timer_changed": MessageAutoDeleteTimerChangedUpdate,
    "migrate_to_chat_id": MigrateToChatIdUpdate,
    "migrate_from_chat_id": MigrateFromChatIdUpdate,
    "passport_data": PassportDataUpdate,
    "proximity_alert_triggered": ProximityAlertTriggeredUpdate,
    "write_access_allowed": WriteAccessAllowedUpdate,
    "community_chat_added": CommunityChatAddedUpdate,
    "community_chat_removed": CommunityChatRemovedUpdate,
    "paid_messages_waived": PaidMessagesWaivedUpdate,
    "ton_wallet_transfer": TonWalletTransferUpdate
};