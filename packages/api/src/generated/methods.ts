/// AUTO-GENERATED FILE — do not edit by hand
/// Bot API 10.4
/// source: https://core.telegram.org/bots/api
/// generated at: 2026-11-09T13:32:34.299Z
/// see scripts/emit.ts in @puregram/api

import type { TelegramAcceptedGiftTypes, TelegramBotAccessSettings, TelegramBotCommand, TelegramBotCommandScope, TelegramBotDescription, TelegramBotName, TelegramBotShortDescription, TelegramBusinessConnection, TelegramChatAdministratorRights, TelegramChatFullInfo, TelegramChatInviteLink, TelegramChatMember, TelegramChatMemberAdministrator, TelegramChatMemberOwner, TelegramChatPermissions, TelegramChatShareThemeBackdrops, TelegramEphemeralMessageParameters, TelegramFile, TelegramForceReply, TelegramForumTopic, TelegramGameHighScore, TelegramGifts, TelegramInlineKeyboardMarkup, TelegramInlineQueryResult, TelegramInlineQueryResultsButton, TelegramInputChecklist, TelegramInputFile, TelegramInputMedia, TelegramInputMediaAudio, TelegramInputMediaDocument, TelegramInputMediaLivePhoto, TelegramInputMediaPhoto, TelegramInputMediaVideo, TelegramInputPaidMedia, TelegramInputPollMedia, TelegramInputPollOption, TelegramInputProfilePhoto, TelegramInputRichMessage, TelegramInputSticker, TelegramInputStoryContent, TelegramKeyboardButton, TelegramLabeledPrice, TelegramLinkPreviewOptions, TelegramMaskPosition, TelegramMenuButton, TelegramMessage, TelegramMessageEntity, TelegramMessageId, TelegramOwnedGifts, TelegramPassportElementError, TelegramPoll, TelegramPreparedInlineMessage, TelegramPreparedKeyboardButton, TelegramReactionType, TelegramReplyKeyboardMarkup, TelegramReplyKeyboardRemove, TelegramReplyParameters, TelegramSentGuestMessage, TelegramSentWebAppMessage, TelegramShippingOption, TelegramStarAmount, TelegramStarTransactions, TelegramSticker, TelegramStickerSet, TelegramStory, TelegramStoryArea, TelegramSuggestedPostParameters, TelegramUniqueGift, TelegramUpdate, TelegramUser, TelegramUserChatBoosts, TelegramUserProfileAudios, TelegramUserProfilePhotos, TelegramWebhookInfo } from "./types";
import type { Formattable } from "../formattable";
import type { RichLike } from "../rich-like";
/**
 * Use this method to add a new sticker to a set created by the bot. Emoji sticker sets can have up to 200 stickers. Other sticker sets can have up to 120 stickers. Returns True on success.
 */
export interface AddStickerToSetParams {
    /**
     * User identifier of sticker set owner
     */
    user_id: number;
    /**
     * Sticker set name
     */
    name: string;
    /**
     * A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set isn't changed.
     */
    sticker: TelegramInputSticker;
}

/**
 * Use this method to add a new sticker to a set created by the bot. Emoji sticker sets can have up to 200 stickers. Other sticker sets can have up to 120 stickers. Returns True on success.
 */
export type addStickerToSet = (params: AddStickerToSetParams) => Promise<true>;

/**
 * Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned.
 */
export interface AnswerCallbackQueryParams {
    /**
     * Unique identifier for the query to be answered
     */
    callback_query_id: string;
    /**
     * Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters.
     */
    text?: string;
    /**
     * If True, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to False.
     */
    show_alert?: boolean;
    /**
     * URL that will be opened by the user's client. If you have created a Game and accepted the conditions via @BotFather, specify the URL that opens your game - note that this will only work if the query comes from a callback_game button.Otherwise, you may use links like t.me/your_bot?start=XXXX that open your bot with a parameter.
     */
    url?: string;
    /**
     * The maximum amount of time in seconds that the result of the callback query may be cached client-side. Defaults to 0.
     */
    cache_time?: number;
}

/**
 * Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned.
 */
export type answerCallbackQuery = (params: AnswerCallbackQueryParams) => Promise<true>;

/**
 * Use this method to process a received chat join request query. Returns True on success.
 */
export interface AnswerChatJoinRequestQueryParams {
    /**
     * Unique identifier of the join request query
     */
    chat_join_request_query_id: string;
    /**
     * Result of the query. Must be either “approve” to allow the user to join the chat, “decline” to disallow the user to join the chat, or “queue” to leave the decision to other administrators.
     */
    result: "approve" | "decline" | "queue";
}

/**
 * Use this method to process a received chat join request query. Returns True on success.
 */
export type answerChatJoinRequestQuery = (params: AnswerChatJoinRequestQueryParams) => Promise<true>;

/**
 * Use this method to reply to a received guest message. On success, a SentGuestMessage object is returned.
 */
export interface AnswerGuestQueryParams {
    /**
     * Unique identifier for the query to be answered
     */
    guest_query_id: string;
    /**
     * A JSON-serialized object describing the message to be sent
     */
    result: TelegramInlineQueryResult;
}

/**
 * Use this method to reply to a received guest message. On success, a SentGuestMessage object is returned.
 */
export type answerGuestQuery = (params: AnswerGuestQueryParams) => Promise<TelegramSentGuestMessage>;

/**
 * Use this method to send answers to an inline query. On success, True is returned.No more than 50 results per query are allowed.
 */
export interface AnswerInlineQueryParams {
    /**
     * Unique identifier for the answered query
     */
    inline_query_id: string;
    /**
     * A JSON-serialized Array of results for the inline query
     */
    results: TelegramInlineQueryResult[];
    /**
     * The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300.
     */
    cache_time?: number;
    /**
     * Pass True if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query.
     */
    is_personal?: boolean;
    /**
     * Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don't support pagination. Offset length can't exceed 64 bytes.
     */
    next_offset?: string;
    /**
     * A JSON-serialized object describing a button to be shown above inline query results
     */
    button?: TelegramInlineQueryResultsButton;
}

/**
 * Use this method to send answers to an inline query. On success, True is returned.No more than 50 results per query are allowed.
 */
export type answerInlineQuery = (params: AnswerInlineQueryParams) => Promise<true>;

/**
 * Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an Update with the field pre_checkout_query. Use this method to respond to such pre-checkout queries. On success, True is returned. Note: The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
 */
export interface AnswerPreCheckoutQueryParams {
    /**
     * Unique identifier for the query to be answered
     */
    pre_checkout_query_id: string;
    /**
     * Specify True if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use False if there are any problems.
     */
    ok: boolean;
    /**
     * Required if ok is False. Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. "Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!"). Telegram will display this message to the user.
     */
    error_message?: string;
}

/**
 * Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an Update with the field pre_checkout_query. Use this method to respond to such pre-checkout queries. On success, True is returned. Note: The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
 */
export type answerPreCheckoutQuery = (params: AnswerPreCheckoutQueryParams) => Promise<true>;

/**
 * If you sent an invoice requesting a shipping address and the parameter is_flexible was specified, the Bot API will send an Update with a shipping_query field to the bot. Use this method to reply to shipping queries. On success, True is returned.
 */
export interface AnswerShippingQueryParams {
    /**
     * Unique identifier for the query to be answered
     */
    shipping_query_id: string;
    /**
     * Pass True if delivery to the specified address is possible and False if there are any problems (for example, if delivery to the specified address is not possible)
     */
    ok: boolean;
    /**
     * Required if ok is True. A JSON-serialized Array of available shipping options.
     */
    shipping_options?: TelegramShippingOption[];
    /**
     * Required if ok is False. Error message in human readable form that explains why it is impossible to complete the order (e.g. “Sorry, delivery to your desired address is unavailable”). Telegram will display this message to the user.
     */
    error_message?: string;
}

/**
 * If you sent an invoice requesting a shipping address and the parameter is_flexible was specified, the Bot API will send an Update with a shipping_query field to the bot. Use this method to reply to shipping queries. On success, True is returned.
 */
export type answerShippingQuery = (params: AnswerShippingQueryParams) => Promise<true>;

/**
 * Use this method to set the result of an interaction with a Web App and send a corresponding message on behalf of the user to the chat from which the query originated. On success, a SentWebAppMessage object is returned.
 */
export interface AnswerWebAppQueryParams {
    /**
     * Unique identifier for the query to be answered
     */
    web_app_query_id: string;
    /**
     * A JSON-serialized object describing the message to be sent
     */
    result: TelegramInlineQueryResult;
}

/**
 * Use this method to set the result of an interaction with a Web App and send a corresponding message on behalf of the user to the chat from which the query originated. On success, a SentWebAppMessage object is returned.
 */
export type answerWebAppQuery = (params: AnswerWebAppQueryParams) => Promise<TelegramSentWebAppMessage>;

/**
 * Use this method to send an answer to a query from a widget. The query must be answered within 15 seconds. The answer is received only by the widget that sent the query and doesn't change data of the widget; use editMessageWidgetData or editSharedWidgetData to change it. On success, True is returned.
 */
export interface AnswerWidgetQueryParams {
    /**
     * Unique identifier for the query to be answered
     */
    widget_query_id: string;
    /**
     * Data to be returned to the widget, 0-1024 bytes
     */
    data?: string;
}

/**
 * Use this method to send an answer to a query from a widget. The query must be answered within 15 seconds. The answer is received only by the widget that sent the query and doesn't change data of the widget; use editMessageWidgetData or editSharedWidgetData to change it. On success, True is returned.
 */
export type answerWidgetQuery = (params: AnswerWidgetQueryParams) => Promise<true>;

/**
 * Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.
 */
export interface ApproveChatJoinRequestParams {
    /**
     * Unique identifier for the target chat or username of the target channel in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     */
    user_id: number;
}

/**
 * Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.
 */
export type approveChatJoinRequest = (params: ApproveChatJoinRequestParams) => Promise<true>;

/**
 * Use this method to approve a suggested post in a direct messages chat. The bot must have the 'can_post_messages' administrator right in the corresponding channel chat. Returns True on success.
 */
export interface ApproveSuggestedPostParams {
    /**
     * Unique identifier for the target direct messages chat
     */
    chat_id: number;
    /**
     * Identifier of a suggested post message to approve
     */
    message_id: number;
    /**
     * Point in time (Unix timestamp) when the post is expected to be published; omit if the date has already been specified when the suggested post was created. If specified, then the date must be not more than 2678400 seconds (30 days) in the future.
     */
    send_date?: number;
}

/**
 * Use this method to approve a suggested post in a direct messages chat. The bot must have the 'can_post_messages' administrator right in the corresponding channel chat. Returns True on success.
 */
export type approveSuggestedPost = (params: ApproveSuggestedPostParams) => Promise<true>;

/**
 * Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
 */
export interface BanChatMemberParams {
    /**
     * Unique identifier for the target group or username of the target supergroup or channel in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     */
    user_id: number;
    /**
     * Date when the user will be unbanned; Unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever. Applied for supergroups and channels only.
     */
    until_date?: number;
    /**
     * Pass True to delete all messages from the chat for the user that is being removed. If False, the user will be able to see messages in the group that were sent before the user was removed. Always True for supergroups and channels.
     */
    revoke_messages?: boolean;
}

/**
 * Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
 */
export type banChatMember = (params: BanChatMemberParams) => Promise<true>;

/**
 * Use this method to ban a channel chat in a supergroup or a channel. Until the chat is unbanned, the owner of the banned chat won't be able to send messages on behalf of any of their channels. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns True on success.
 */
export interface BanChatSenderChatParams {
    /**
     * Unique identifier for the target chat or username of the target channel in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier of the target sender chat
     */
    sender_chat_id: number;
}

/**
 * Use this method to ban a channel chat in a supergroup or a channel. Until the chat is unbanned, the owner of the banned chat won't be able to send messages on behalf of any of their channels. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns True on success.
 */
export type banChatSenderChat = (params: BanChatSenderChatParams) => Promise<true>;

/**
 * Use this method to close the bot instance before moving it from one local server to another. You need to delete the webhook before calling this method to ensure that the bot isn't launched again after server restart. The method will return error 429 in the first 10 minutes after the bot is launched. Returns True on success. Requires no parameters.
 */
export type close = () => Promise<true>;

/**
 * Use this method to close an open topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.
 */
export interface CloseForumTopicParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier for the target message thread of the forum topic
     */
    message_thread_id: number;
}

/**
 * Use this method to close an open topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.
 */
export type closeForumTopic = (params: CloseForumTopicParams) => Promise<true>;

/**
 * Use this method to close an open 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.
 */
export interface CloseGeneralForumTopicParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
}

/**
 * Use this method to close an open 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.
 */
export type closeGeneralForumTopic = (params: CloseGeneralForumTopicParams) => Promise<true>;

/**
 * Converts a given regular gift to Telegram Stars. Requires the can_convert_gifts_to_stars business bot right. Returns True on success.
 */
export interface ConvertGiftToStarsParams {
    /**
     * Unique identifier of the business connection
     */
    business_connection_id: string;
    /**
     * Unique identifier of the regular gift that should be converted to Telegram Stars
     */
    owned_gift_id: string;
}

/**
 * Converts a given regular gift to Telegram Stars. Requires the can_convert_gifts_to_stars business bot right. Returns True on success.
 */
export type convertGiftToStars = (params: ConvertGiftToStarsParams) => Promise<true>;

/**
 * Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, invoice messages, and widget messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_ids is known to the bot. The method is analogous to the method forwardMessage, but the copied message doesn't have a link to the original message. Returns the MessageId of the sent message on success.
 */
export interface CopyMessageParams {
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * Unique identifier for the chat where the original message was sent (or username of the target bot, supergroup, or channel in the format @username)
     */
    from_chat_id: number | string;
    /**
     * Message identifier in the chat specified in from_chat_id
     */
    message_id: number;
    /**
     * New start timestamp for the copied video in the message
     */
    video_start_timestamp?: number;
    /**
     * New caption for media, 0-1024 characters after entities parsing. If not specified, the original caption is kept.
     */
    caption?: string | Formattable;
    /**
     * Mode for parsing entities in the new caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the new caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Pass True if the caption must be shown above the message media. Ignored if a new caption isn't specified.
     */
    show_caption_above_media?: boolean;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; only available when copying to private chats
     */
    message_effect_id?: string;
    /**
     * A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.
     */
    suggested_post_parameters?: TelegramSuggestedPostParameters;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, invoice messages, and widget messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_ids is known to the bot. The method is analogous to the method forwardMessage, but the copied message doesn't have a link to the original message. Returns the MessageId of the sent message on success.
 */
export type copyMessage = (params: CopyMessageParams) => Promise<TelegramMessageId>;

/**
 * Use this method to copy messages of any kind. If some of the specified messages can't be found or copied, they are skipped. Service messages, paid media messages, giveaway messages, giveaway winners messages, invoice messages, and widget messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_ids is known to the bot. The method is analogous to the method forwardMessages, but the copied messages don't have a link to the original message. Album grouping is kept for copied messages. On success, an Array of MessageId of the sent messages is returned.
 */
export interface CopyMessagesParams {
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * Unique identifier for the chat where the original messages were sent (or username of the target bot, supergroup, or channel in the format @username)
     */
    from_chat_id: number | string;
    /**
     * A JSON-serialized list of 1-100 identifiers of messages in the chat from_chat_id to copy. The identifiers must be specified in a strictly increasing order.
     */
    message_ids: number[];
    /**
     * Sends the messages silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent messages from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to copy the messages without their captions
     */
    remove_caption?: boolean;
}

/**
 * Use this method to copy messages of any kind. If some of the specified messages can't be found or copied, they are skipped. Service messages, paid media messages, giveaway messages, giveaway winners messages, invoice messages, and widget messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_ids is known to the bot. The method is analogous to the method forwardMessages, but the copied messages don't have a link to the original message. Album grouping is kept for copied messages. On success, an Array of MessageId of the sent messages is returned.
 */
export type copyMessages = (params: CopyMessagesParams) => Promise<TelegramMessageId[]>;

/**
 * Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method revokeChatInviteLink. Returns the new invite link as ChatInviteLink object.
 */
export interface CreateChatInviteLinkParams {
    /**
     * Unique identifier for the target chat or username of the target channel in the format @username
     */
    chat_id: number | string;
    /**
     * Invite link name; 0-32 characters
     */
    name?: string;
    /**
     * Point in time (Unix timestamp) when the link will expire
     */
    expire_date?: number;
    /**
     * The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999
     */
    member_limit?: number;
    /**
     * True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified.
     */
    creates_join_request?: boolean;
}

/**
 * Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method revokeChatInviteLink. Returns the new invite link as ChatInviteLink object.
 */
export type createChatInviteLink = (params: CreateChatInviteLinkParams) => Promise<TelegramChatInviteLink>;

/**
 * Use this method to create a subscription invite link for a channel chat. The bot must have the can_invite_users administrator rights. The link can be edited using the method editChatSubscriptionInviteLink or revoked using the method revokeChatInviteLink. Returns the new invite link as a ChatInviteLink object.
 */
export interface CreateChatSubscriptionInviteLinkParams {
    /**
     * Unique identifier for the target channel chat or username of the target channel in the format @username
     */
    chat_id: number | string;
    /**
     * Invite link name; 0-32 characters
     */
    name?: string;
    /**
     * The number of seconds the subscription will be active for before the next payment. Currently, it must always be 2592000 (30 days).
     */
    subscription_period: number;
    /**
     * The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat; 1-10000
     */
    subscription_price: number;
}

/**
 * Use this method to create a subscription invite link for a channel chat. The bot must have the can_invite_users administrator rights. The link can be edited using the method editChatSubscriptionInviteLink or revoked using the method revokeChatInviteLink. Returns the new invite link as a ChatInviteLink object.
 */
export type createChatSubscriptionInviteLink = (params: CreateChatSubscriptionInviteLinkParams) => Promise<TelegramChatInviteLink>;

/**
 * Use this method to create a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator right. In the case of a private chat, a link to the topic can be created in the format https://t.me/<bot_username>/<message_thread_id>; the link opens the topic only for the user. Returns information about the created topic as a ForumTopic object.
 */
export interface CreateForumTopicParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * Topic name, 1-128 characters
     */
    name: string;
    /**
     * Color of the topic icon in RGB format. Currently, must be one of 7322096 (0x6FB9F0), 16766590 (0xFFD67E), 13338331 (0xCB86DB), 9367192 (0x8EEE98), 16749490 (0xFF93B2), or 16478047 (0xFB6F5F).
     */
    icon_color?: number;
    /**
     * Unique identifier of the custom emoji shown as the topic icon. Use getForumTopicIconStickers to get all allowed custom emoji identifiers.
     */
    icon_custom_emoji_id?: string;
}

/**
 * Use this method to create a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator right. In the case of a private chat, a link to the topic can be created in the format https://t.me/<bot_username>/<message_thread_id>; the link opens the topic only for the user. Returns information about the created topic as a ForumTopic object.
 */
export type createForumTopic = (params: CreateForumTopicParams) => Promise<TelegramForumTopic>;

/**
 * Use this method to create a link for an invoice. Returns the created invoice link as String on success.
 */
export interface CreateInvoiceLinkParams {
    /**
     * Unique identifier of the business connection on behalf of which the link will be created. For payments in Telegram Stars only.
     */
    business_connection_id?: string;
    /**
     * Product name, 1-32 characters
     */
    title: string;
    /**
     * Product description, 1-255 characters
     */
    description: string;
    /**
     * Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.
     */
    payload: string;
    /**
     * Payment provider token, obtained via @BotFather. Pass an empty string for payments in Telegram Stars.
     */
    provider_token?: string;
    /**
     * Three-letter ISO 4217 currency code, see more on currencies. Pass “XTR” for payments in Telegram Stars.
     */
    currency: string;
    /**
     * Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in Telegram Stars.
     */
    prices: TelegramLabeledPrice[];
    /**
     * The number of seconds the subscription will be active for before the next payment. The currency must be set to “XTR” (Telegram Stars) if the parameter is used. Currently, it must always be 2592000 (30 days) if specified. Any number of subscriptions can be active for a given bot at the same time, including multiple concurrent subscriptions from the same user. Subscription price must no exceed 10000 Telegram Stars.
     */
    subscription_period?: number;
    /**
     * The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in Telegram Stars.
     */
    max_tip_amount?: number;
    /**
     * A JSON-serialized Array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount.
     */
    suggested_tip_amounts?: number[];
    /**
     * JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider.
     */
    provider_data?: string;
    /**
     * URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service.
     */
    photo_url?: string;
    /**
     * Photo size in bytes
     */
    photo_size?: number;
    /**
     * Photo width
     */
    photo_width?: number;
    /**
     * Photo height
     */
    photo_height?: number;
    /**
     * Pass True if you require the user's full name to complete the order. Ignored for payments in Telegram Stars.
     */
    need_name?: boolean;
    /**
     * Pass True if you require the user's phone number to complete the order. Ignored for payments in Telegram Stars.
     */
    need_phone_number?: boolean;
    /**
     * Pass True if you require the user's email address to complete the order. Ignored for payments in Telegram Stars.
     */
    need_email?: boolean;
    /**
     * Pass True if you require the user's shipping address to complete the order. Ignored for payments in Telegram Stars.
     */
    need_shipping_address?: boolean;
    /**
     * Pass True if the user's phone number should be sent to the provider. Ignored for payments in Telegram Stars.
     */
    send_phone_number_to_provider?: boolean;
    /**
     * Pass True if the user's email address should be sent to the provider. Ignored for payments in Telegram Stars.
     */
    send_email_to_provider?: boolean;
    /**
     * Pass True if the final price depends on the shipping method. Ignored for payments in Telegram Stars.
     */
    is_flexible?: boolean;
}

/**
 * Use this method to create a link for an invoice. Returns the created invoice link as String on success.
 */
export type createInvoiceLink = (params: CreateInvoiceLinkParams) => Promise<string>;

/**
 * Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. Returns True on success.
 */
export interface CreateNewStickerSetParams {
    /**
     * User identifier of created sticker set owner
     */
    user_id: number;
    /**
     * Short name of sticker set, to be used in t.me/addstickers/ URLs (e.g., animals). Can contain only English letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in "_by_<bot_username>". <bot_username> is case insensitive. 1-64 characters.
     */
    name: string;
    /**
     * Sticker set title, 1-64 characters
     */
    title: string;
    /**
     * A JSON-serialized list of 1-50 initial stickers to be added to the sticker set
     */
    stickers: TelegramInputSticker[];
    /**
     * Type of stickers in the set, pass “regular”, “mask”, or “custom_emoji”. By default, a regular sticker set is created.
     */
    sticker_type?: string;
    /**
     * Pass True if stickers in the sticker set must be repainted to the color of text when used in messages, the accent color if used as emoji status, white on chat photos, or another appropriate color based on context; for custom emoji sticker sets only
     */
    needs_repainting?: boolean;
}

/**
 * Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. Returns True on success.
 */
export type createNewStickerSet = (params: CreateNewStickerSetParams) => Promise<true>;

/**
 * Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.
 */
export interface DeclineChatJoinRequestParams {
    /**
     * Unique identifier for the target chat or username of the target channel in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     */
    user_id: number;
}

/**
 * Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.
 */
export type declineChatJoinRequest = (params: DeclineChatJoinRequestParams) => Promise<true>;

/**
 * Use this method to decline a suggested post in a direct messages chat. The bot must have the 'can_manage_direct_messages' administrator right in the corresponding channel chat. Returns True on success.
 */
export interface DeclineSuggestedPostParams {
    /**
     * Unique identifier for the target direct messages chat
     */
    chat_id: number;
    /**
     * Identifier of a suggested post message to decline
     */
    message_id: number;
    /**
     * Comment for the creator of the suggested post; 0-128 characters
     */
    comment?: string;
}

/**
 * Use this method to decline a suggested post in a direct messages chat. The bot must have the 'can_manage_direct_messages' administrator right in the corresponding channel chat. Returns True on success.
 */
export type declineSuggestedPost = (params: DeclineSuggestedPostParams) => Promise<true>;

/**
 * Use this method to remove up to 10000 recent reactions in a group or a supergroup chat added by a given user or chat. The bot must have the 'can_delete_messages' administrator right in the chat. Returns True on success.
 */
export interface DeleteAllMessageReactionsParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * Identifier of the user whose reactions will be removed, if the reactions were added by a user
     */
    user_id?: number;
    /**
     * Identifier of the chat whose reactions will be removed, if the reactions were added by a chat
     */
    actor_chat_id?: number;
}

/**
 * Use this method to remove up to 10000 recent reactions in a group or a supergroup chat added by a given user or chat. The bot must have the 'can_delete_messages' administrator right in the chat. Returns True on success.
 */
export type deleteAllMessageReactions = (params: DeleteAllMessageReactionsParams) => Promise<true>;

/**
 * Deletes a regular gift owned by a managed business account without receiving Telegram Stars for it. Requires the can_convert_gifts_to_stars business bot right. The gift can be deleted only if it isn't limited (the field total_count of the Gift is omitted) and wasn't refunded. Returns True on success.
 */
export interface DeleteBusinessAccountGiftParams {
    /**
     * Unique identifier of the business connection
     */
    business_connection_id: string;
    /**
     * Unique identifier of the regular gift that should be deleted
     */
    owned_gift_id: string;
}

/**
 * Deletes a regular gift owned by a managed business account without receiving Telegram Stars for it. Requires the can_convert_gifts_to_stars business bot right. The gift can be deleted only if it isn't limited (the field total_count of the Gift is omitted) and wasn't refunded. Returns True on success.
 */
export type deleteBusinessAccountGift = (params: DeleteBusinessAccountGiftParams) => Promise<true>;

/**
 * Delete messages on behalf of a business account. Requires the can_delete_sent_messages business bot right to delete messages sent by the bot itself, or the can_delete_all_messages business bot right to delete any message. Returns True on success.
 */
export interface DeleteBusinessMessagesParams {
    /**
     * Unique identifier of the business connection on behalf of which to delete the messages
     */
    business_connection_id: string;
    /**
     * A JSON-serialized list of 1-100 identifiers of messages to delete. All messages must be from the same chat. See deleteMessage for limitations on which messages can be deleted.
     */
    message_ids: number[];
}

/**
 * Delete messages on behalf of a business account. Requires the can_delete_sent_messages business bot right to delete messages sent by the bot itself, or the can_delete_all_messages business bot right to delete any message. Returns True on success.
 */
export type deleteBusinessMessages = (params: DeleteBusinessMessagesParams) => Promise<true>;

/**
 * Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
 */
export interface DeleteChatPhotoParams {
    /**
     * Unique identifier for the target chat or username of the target channel in the format @username
     */
    chat_id: number | string;
}

/**
 * Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
 */
export type deleteChatPhoto = (params: DeleteChatPhotoParams) => Promise<true>;

/**
 * Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method. Returns True on success.
 */
export interface DeleteChatStickerSetParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
}

/**
 * Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method. Returns True on success.
 */
export type deleteChatStickerSet = (params: DeleteChatStickerSetParams) => Promise<true>;

/**
 * Use this method to delete an ephemeral message. Note that it is not guaranteed that the user will receive the message deletion event, especially if they are offline. Returns True on success.
 */
export interface DeleteEphemeralMessageParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * Identifier of the user who received the message
     */
    receiver_user_id: number;
    /**
     * Identifier of the ephemeral message to delete
     */
    ephemeral_message_id: number;
}

/**
 * Use this method to delete an ephemeral message. Note that it is not guaranteed that the user will receive the message deletion event, especially if they are offline. Returns True on success.
 */
export type deleteEphemeralMessage = (params: DeleteEphemeralMessageParams) => Promise<true>;

/**
 * Use this method to delete a forum topic along with all its messages in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_delete_messages administrator rights. Returns True on success.
 */
export interface DeleteForumTopicParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier for the target message thread of the forum topic
     */
    message_thread_id: number;
}

/**
 * Use this method to delete a forum topic along with all its messages in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_delete_messages administrator rights. Returns True on success.
 */
export type deleteForumTopic = (params: DeleteForumTopicParams) => Promise<true>;

/**
 * Use this method to delete a message, including service messages, with the following limitations:- A message can only be deleted if it was sent less than 48 hours ago.- Service messages about a supergroup, channel, or forum topic creation can't be deleted.- A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.- Bots can delete outgoing messages in private chats, groups, and supergroups.- Bots can delete incoming messages in private chats.- Bots granted can_post_messages permissions can delete outgoing messages in channels.- If the bot is an administrator of a group, it can delete any message there.- If the bot has can_delete_messages administrator right in a supergroup or a channel, it can delete any message there.- If the bot has can_manage_direct_messages administrator right in a channel, it can delete any message in the corresponding direct messages chat.Returns True on success.
 */
export interface DeleteMessageParams {
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username
     */
    chat_id: number | string;
    /**
     * Identifier of the message to delete
     */
    message_id: number;
}

/**
 * Use this method to delete a message, including service messages, with the following limitations:- A message can only be deleted if it was sent less than 48 hours ago.- Service messages about a supergroup, channel, or forum topic creation can't be deleted.- A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.- Bots can delete outgoing messages in private chats, groups, and supergroups.- Bots can delete incoming messages in private chats.- Bots granted can_post_messages permissions can delete outgoing messages in channels.- If the bot is an administrator of a group, it can delete any message there.- If the bot has can_delete_messages administrator right in a supergroup or a channel, it can delete any message there.- If the bot has can_manage_direct_messages administrator right in a channel, it can delete any message in the corresponding direct messages chat.Returns True on success.
 */
export type deleteMessage = (params: DeleteMessageParams) => Promise<true>;

/**
 * Use this method to remove a reaction from a message in a group or a supergroup chat. The bot must have the 'can_delete_messages' administrator right in the chat. Returns True on success.
 */
export interface DeleteMessageReactionParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * Identifier of the target message
     */
    message_id: number;
    /**
     * Identifier of the user whose reaction will be removed, if the reaction was added by a user
     */
    user_id?: number;
    /**
     * Identifier of the chat whose reaction will be removed, if the reaction was added by a chat
     */
    actor_chat_id?: number;
}

/**
 * Use this method to remove a reaction from a message in a group or a supergroup chat. The bot must have the 'can_delete_messages' administrator right in the chat. Returns True on success.
 */
export type deleteMessageReaction = (params: DeleteMessageReactionParams) => Promise<true>;

/**
 * Use this method to delete multiple messages simultaneously. If some of the specified messages can't be found, they are skipped. Returns True on success.
 */
export interface DeleteMessagesParams {
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username
     */
    chat_id: number | string;
    /**
     * A JSON-serialized list of 1-100 identifiers of messages to delete. See deleteMessage for limitations on which messages can be deleted.
     */
    message_ids: number[];
}

/**
 * Use this method to delete multiple messages simultaneously. If some of the specified messages can't be found, they are skipped. Returns True on success.
 */
export type deleteMessages = (params: DeleteMessagesParams) => Promise<true>;

/**
 * Use this method to delete the list of the bot's commands for the given scope and user language. After deletion, higher level commands will be shown to affected users. Returns True on success.
 */
export interface DeleteMyCommandsParams {
    /**
     * A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault.
     */
    scope?: TelegramBotCommandScope;
    /**
     * A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands.
     */
    language_code?: string;
}

/**
 * Use this method to delete the list of the bot's commands for the given scope and user language. After deletion, higher level commands will be shown to affected users. Returns True on success.
 */
export type deleteMyCommands = (params: DeleteMyCommandsParams) => Promise<true>;

/**
 * Use this method to delete a sticker from a set created by the bot. Returns True on success.
 */
export interface DeleteStickerFromSetParams {
    /**
     * File identifier of the sticker
     */
    sticker: string;
}

/**
 * Use this method to delete a sticker from a set created by the bot. Returns True on success.
 */
export type deleteStickerFromSet = (params: DeleteStickerFromSetParams) => Promise<true>;

/**
 * Use this method to delete a sticker set that was created by the bot. Returns True on success.
 */
export interface DeleteStickerSetParams {
    /**
     * Sticker set name
     */
    name: string;
}

/**
 * Use this method to delete a sticker set that was created by the bot. Returns True on success.
 */
export type deleteStickerSet = (params: DeleteStickerSetParams) => Promise<true>;

/**
 * Deletes a story previously posted by the bot on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns True on success.
 */
export interface DeleteStoryParams {
    /**
     * Unique identifier of the business connection
     */
    business_connection_id: string;
    /**
     * Unique identifier of the story to delete
     */
    story_id: number;
}

/**
 * Deletes a story previously posted by the bot on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns True on success.
 */
export type deleteStory = (params: DeleteStoryParams) => Promise<true>;

/**
 * Use this method to remove webhook integration if you decide to switch back to getUpdates. Returns True on success.
 */
export interface DeleteWebhookParams {
    /**
     * Pass True to drop all pending updates
     */
    drop_pending_updates?: boolean;
}

/**
 * Use this method to remove webhook integration if you decide to switch back to getUpdates. Returns True on success.
 */
export type deleteWebhook = (params: DeleteWebhookParams) => Promise<true>;

/**
 * Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a ChatInviteLink object.
 */
export interface EditChatInviteLinkParams {
    /**
     * Unique identifier for the target chat or username of the target channel in the format @username
     */
    chat_id: number | string;
    /**
     * The invite link to edit
     */
    invite_link: string;
    /**
     * Invite link name; 0-32 characters
     */
    name?: string;
    /**
     * Point in time (Unix timestamp) when the link will expire
     */
    expire_date?: number;
    /**
     * The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999
     */
    member_limit?: number;
    /**
     * True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified.
     */
    creates_join_request?: boolean;
}

/**
 * Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a ChatInviteLink object.
 */
export type editChatInviteLink = (params: EditChatInviteLinkParams) => Promise<TelegramChatInviteLink>;

/**
 * Use this method to edit a subscription invite link created by the bot. The bot must have the can_invite_users administrator rights. Returns the edited invite link as a ChatInviteLink object.
 */
export interface EditChatSubscriptionInviteLinkParams {
    /**
     * Unique identifier for the target chat or username of the target channel in the format @username
     */
    chat_id: number | string;
    /**
     * The invite link to edit
     */
    invite_link: string;
    /**
     * Invite link name; 0-32 characters
     */
    name?: string;
}

/**
 * Use this method to edit a subscription invite link created by the bot. The bot must have the can_invite_users administrator rights. Returns the edited invite link as a ChatInviteLink object.
 */
export type editChatSubscriptionInviteLink = (params: EditChatSubscriptionInviteLinkParams) => Promise<TelegramChatInviteLink>;

/**
 * Use this method to edit the caption of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.
 */
export interface EditEphemeralMessageCaptionParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * Identifier of the user who received the message
     */
    receiver_user_id: number;
    /**
     * Identifier of the ephemeral message to edit
     */
    ephemeral_message_id: number;
    /**
     * New caption of the message, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Mode for parsing entities in the message caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Pass True if the caption must be shown above the message media. Supported only for animation, photo and video messages.
     */
    show_caption_above_media?: boolean;
    /**
     * A JSON-serialized object for an inline keyboard
     */
    reply_markup?: TelegramInlineKeyboardMarkup | {
        toJSON: () => TelegramInlineKeyboardMarkup;
    };
}

/**
 * Use this method to edit the caption of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.
 */
export type editEphemeralMessageCaption = (params: EditEphemeralMessageCaptionParams) => Promise<true>;

/**
 * Use this method to edit the media of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.
 */
export interface EditEphemeralMessageMediaParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * Identifier of the user who received the message
     */
    receiver_user_id: number;
    /**
     * Identifier of the ephemeral message to edit
     */
    ephemeral_message_id: number;
    /**
     * A JSON-serialized object for the new media content of the message
     */
    media: TelegramInputMedia;
    /**
     * A JSON-serialized object for an inline keyboard
     */
    reply_markup?: TelegramInlineKeyboardMarkup | {
        toJSON: () => TelegramInlineKeyboardMarkup;
    };
}

/**
 * Use this method to edit the media of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.
 */
export type editEphemeralMessageMedia = (params: EditEphemeralMessageMediaParams) => Promise<true>;

/**
 * Use this method to edit only the reply markup of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.
 */
export interface EditEphemeralMessageReplyMarkupParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * Identifier of the user who received the message
     */
    receiver_user_id: number;
    /**
     * Identifier of the ephemeral message to edit
     */
    ephemeral_message_id: number;
    /**
     * A JSON-serialized object for an inline keyboard
     */
    reply_markup?: TelegramInlineKeyboardMarkup | {
        toJSON: () => TelegramInlineKeyboardMarkup;
    };
}

/**
 * Use this method to edit only the reply markup of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.
 */
export type editEphemeralMessageReplyMarkup = (params: EditEphemeralMessageReplyMarkupParams) => Promise<true>;

/**
 * Use this method to edit an ephemeral text or rich message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.
 */
export interface EditEphemeralMessageTextParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * Identifier of the user who received the message
     */
    receiver_user_id: number;
    /**
     * Identifier of the ephemeral message to edit
     */
    ephemeral_message_id: number;
    /**
     * New text of the message, 1-4096 characters after entity parsing; required if rich_message isn't specified
     */
    text?: string | Formattable;
    /**
     * Mode for parsing entities in the message text. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
     */
    entities?: TelegramMessageEntity[];
    /**
     * New rich content of the message; required if text isn't specified
     */
    rich_message?: TelegramInputRichMessage | RichLike;
    /**
     * Link preview generation options for the message
     */
    link_preview_options?: TelegramLinkPreviewOptions;
    /**
     * A JSON-serialized object for an inline keyboard
     */
    reply_markup?: TelegramInlineKeyboardMarkup | {
        toJSON: () => TelegramInlineKeyboardMarkup;
    };
}

/**
 * Use this method to edit an ephemeral text or rich message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.
 */
export type editEphemeralMessageText = (params: EditEphemeralMessageTextParams) => Promise<true>;

/**
 * Use this method to edit name and icon of a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.
 */
export interface EditForumTopicParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier for the target message thread of the forum topic
     */
    message_thread_id: number;
    /**
     * New topic name, 0-128 characters. If not specified or empty, the current name of the topic will be kept.
     */
    name?: string;
    /**
     * New unique identifier of the custom emoji shown as the topic icon. Use getForumTopicIconStickers to get all allowed custom emoji identifiers. Pass an empty string to remove the icon. If not specified, the current icon will be kept.
     */
    icon_custom_emoji_id?: string;
}

/**
 * Use this method to edit name and icon of a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.
 */
export type editForumTopic = (params: EditForumTopicParams) => Promise<true>;

/**
 * Use this method to edit the name of the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.
 */
export interface EditGeneralForumTopicParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * New topic name, 1-128 characters
     */
    name: string;
}

/**
 * Use this method to edit the name of the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.
 */
export type editGeneralForumTopic = (params: EditGeneralForumTopicParams) => Promise<true>;

/**
 * Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
 */
export interface EditMessageCaptionParams {
    /**
     * Unique identifier of the business connection on behalf of which the message to be edited was sent
     */
    business_connection_id?: string;
    /**
     * Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username.
     */
    chat_id?: number | string;
    /**
     * Required if inline_message_id is not specified. Identifier of the message to edit.
     */
    message_id?: number;
    /**
     * Required if chat_id and message_id are not specified. Identifier of the inline message.
     */
    inline_message_id?: string;
    /**
     * New caption of the message, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Mode for parsing entities in the message caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Pass True if the caption must be shown above the message media. Supported only for animation, photo and video messages.
     */
    show_caption_above_media?: boolean;
    /**
     * A JSON-serialized object for an inline keyboard
     */
    reply_markup?: TelegramInlineKeyboardMarkup | {
        toJSON: () => TelegramInlineKeyboardMarkup;
    };
}

/**
 * Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
 */
export type editMessageCaption = (params: EditMessageCaptionParams) => Promise<TelegramMessage>;

/**
 * Use this method to edit a checklist on behalf of a connected business account. On success, the edited Message is returned.
 */
export interface EditMessageChecklistParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id: string;
    /**
     * Unique identifier for the target chat or username of the target bot in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier for the target message
     */
    message_id: number;
    /**
     * A JSON-serialized object for the new checklist
     */
    checklist: TelegramInputChecklist;
    /**
     * A JSON-serialized object for the new inline keyboard for the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup | {
        toJSON: () => TelegramInlineKeyboardMarkup;
    };
}

/**
 * Use this method to edit a checklist on behalf of a connected business account. On success, the edited Message is returned.
 */
export type editMessageChecklist = (params: EditMessageChecklistParams) => Promise<TelegramMessage>;

/**
 * Use this method to edit live location messages. A location can be edited until its live_period expires or editing is explicitly disabled by a call to stopMessageLiveLocation. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
 */
export interface EditMessageLiveLocationParams {
    /**
     * Unique identifier of the business connection on behalf of which the message to be edited was sent
     */
    business_connection_id?: string;
    /**
     * Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username.
     */
    chat_id?: number | string;
    /**
     * Required if inline_message_id is not specified. Identifier of the message to edit.
     */
    message_id?: number;
    /**
     * Required if chat_id and message_id are not specified. Identifier of the inline message.
     */
    inline_message_id?: string;
    /**
     * Latitude of new location
     */
    latitude: number;
    /**
     * Longitude of new location
     */
    longitude: number;
    /**
     * New period in seconds during which the location can be updated, starting from the message send date. If 0x7FFFFFFF is specified, then the location can be updated forever. Otherwise, the new value must not exceed the current live_period by more than a day, and the live location expiration date must remain within the next 90 days. If not specified, then live_period remains unchanged.
     */
    live_period?: number;
    /**
     * The radius of uncertainty for the location, measured in meters; 0-1500
     */
    horizontal_accuracy?: number;
    /**
     * Direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.
     */
    heading?: number;
    /**
     * The maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.
     */
    proximity_alert_radius?: number;
    /**
     * A JSON-serialized object for a new inline keyboard
     */
    reply_markup?: TelegramInlineKeyboardMarkup | {
        toJSON: () => TelegramInlineKeyboardMarkup;
    };
}

/**
 * Use this method to edit live location messages. A location can be edited until its live_period expires or editing is explicitly disabled by a call to stopMessageLiveLocation. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
 */
export type editMessageLiveLocation = (params: EditMessageLiveLocationParams) => Promise<TelegramMessage>;

/**
 * Use this method to edit animation, audio, document, live photo, photo, or video messages, or to replace a text or a rich message with a media. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo, a live photo, or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
 */
export interface EditMessageMediaParams {
    /**
     * Unique identifier of the business connection on behalf of which the message to be edited was sent
     */
    business_connection_id?: string;
    /**
     * Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username.
     */
    chat_id?: number | string;
    /**
     * Required if inline_message_id is not specified. Identifier of the message to edit.
     */
    message_id?: number;
    /**
     * Required if chat_id and message_id are not specified. Identifier of the inline message.
     */
    inline_message_id?: string;
    /**
     * A JSON-serialized object for the new media content of the message
     */
    media: TelegramInputMedia;
    /**
     * A JSON-serialized object for a new inline keyboard
     */
    reply_markup?: TelegramInlineKeyboardMarkup | {
        toJSON: () => TelegramInlineKeyboardMarkup;
    };
}

/**
 * Use this method to edit animation, audio, document, live photo, photo, or video messages, or to replace a text or a rich message with a media. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo, a live photo, or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
 */
export type editMessageMedia = (params: EditMessageMediaParams) => Promise<TelegramMessage>;

/**
 * Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
 */
export interface EditMessageReplyMarkupParams {
    /**
     * Unique identifier of the business connection on behalf of which the message to be edited was sent
     */
    business_connection_id?: string;
    /**
     * Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username.
     */
    chat_id?: number | string;
    /**
     * Required if inline_message_id is not specified. Identifier of the message to edit.
     */
    message_id?: number;
    /**
     * Required if chat_id and message_id are not specified. Identifier of the inline message.
     */
    inline_message_id?: string;
    /**
     * A JSON-serialized object for an inline keyboard
     */
    reply_markup?: TelegramInlineKeyboardMarkup | {
        toJSON: () => TelegramInlineKeyboardMarkup;
    };
}

/**
 * Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
 */
export type editMessageReplyMarkup = (params: EditMessageReplyMarkupParams) => Promise<TelegramMessage>;

/**
 * Use this method to edit text, rich and game messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
 */
export interface EditMessageTextParams {
    /**
     * Unique identifier of the business connection on behalf of which the message to be edited was sent
     */
    business_connection_id?: string;
    /**
     * Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username.
     */
    chat_id?: number | string;
    /**
     * Required if inline_message_id is not specified. Identifier of the message to edit.
     */
    message_id?: number;
    /**
     * Required if chat_id and message_id are not specified. Identifier of the inline message.
     */
    inline_message_id?: string;
    /**
     * New text of the message, 1-4096 characters after entity parsing; required if rich_message isn't specified
     */
    text?: string | Formattable;
    /**
     * Mode for parsing entities in the message text. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
     */
    entities?: TelegramMessageEntity[];
    /**
     * Link preview generation options for the message
     */
    link_preview_options?: TelegramLinkPreviewOptions;
    /**
     * New rich content of the message; required if text isn't specified. Direct upload of new files and explicit upload of files by a URL isn't supported when an inline message is edited.
     */
    rich_message?: TelegramInputRichMessage | RichLike;
    /**
     * A JSON-serialized object for an inline keyboard
     */
    reply_markup?: TelegramInlineKeyboardMarkup | {
        toJSON: () => TelegramInlineKeyboardMarkup;
    };
}

/**
 * Use this method to edit text, rich and game messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
 */
export type editMessageText = (params: EditMessageTextParams) => Promise<TelegramMessage>;

/**
 * Use this method to edit data of a widget in a message sent by the bot or via the bot (for inline bots). Public data of a shared widget can be changed at most once per second. On success, True is returned.
 */
export interface EditMessageWidgetDataParams {
    /**
     * Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target supergroup in the format @username.
     */
    chat_id?: number | string;
    /**
     * Required if inline_message_id is not specified. Identifier of the message with the widget.
     */
    message_id?: number;
    /**
     * Required if chat_id and message_id are not specified. Identifier of the inline message.
     */
    inline_message_id?: string;
    /**
     * New public data of the widget, 0-1024 bytes; pass an empty string to remove the public data. If omitted, then the public data isn't changed.
     */
    public_data?: string;
    /**
     * New data of the widget, which is specific to the message, 0-1024 bytes; pass an empty string to remove the data. If omitted, then the data isn't changed.
     */
    chat_data?: string;
}

/**
 * Use this method to edit data of a widget in a message sent by the bot or via the bot (for inline bots). Public data of a shared widget can be changed at most once per second. On success, True is returned.
 */
export type editMessageWidgetData = (params: EditMessageWidgetDataParams) => Promise<true>;

/**
 * Use this method to edit public data of a shared widget created by the bot. A shared widget can be edited at most once per second. On success, True is returned.
 */
export interface EditSharedWidgetDataParams {
    /**
     * Unique identifier of the shared widget
     */
    widget_id: string;
    /**
     * New public data of the widget, 0-1024 bytes; pass an empty string to remove the public data
     */
    public_data: string;
    /**
     * The maximum amount of time in seconds that the public data of the widget may be cached client-side; 5-3600. If omitted, then the current value is kept, which is 30 by default.
     */
    cache_time?: number;
}

/**
 * Use this method to edit public data of a shared widget created by the bot. A shared widget can be edited at most once per second. On success, True is returned.
 */
export type editSharedWidgetData = (params: EditSharedWidgetDataParams) => Promise<true>;

/**
 * Edits a story previously posted by the bot on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns Story on success.
 */
export interface EditStoryParams {
    /**
     * Unique identifier of the business connection
     */
    business_connection_id: string;
    /**
     * Unique identifier of the story to edit
     */
    story_id: number;
    /**
     * Content of the story
     */
    content: TelegramInputStoryContent;
    /**
     * Caption of the story, 0-2048 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Mode for parsing entities in the story caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * A JSON-serialized list of clickable areas to be shown on the story
     */
    areas?: TelegramStoryArea[];
}

/**
 * Edits a story previously posted by the bot on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns Story on success.
 */
export type editStory = (params: EditStoryParams) => Promise<TelegramStory>;

/**
 * Allows the bot to cancel or re-enable extension of a subscription paid in Telegram Stars. Returns True on success.
 */
export interface EditUserStarSubscriptionParams {
    /**
     * Identifier of the user whose subscription will be edited
     */
    user_id: number;
    /**
     * Telegram payment identifier for the subscription
     */
    telegram_payment_charge_id: string;
    /**
     * Pass True to cancel extension of the user subscription; the subscription must be active up to the end of the current subscription period. Pass False to allow the user to re-enable a subscription that was previously canceled by the bot.
     */
    is_canceled: boolean;
}

/**
 * Allows the bot to cancel or re-enable extension of a subscription paid in Telegram Stars. Returns True on success.
 */
export type editUserStarSubscription = (params: EditUserStarSubscriptionParams) => Promise<true>;

/**
 * Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as String on success.
 */
export interface ExportChatInviteLinkParams {
    /**
     * Unique identifier for the target chat or username of the target channel in the format @username
     */
    chat_id: number | string;
}

/**
 * Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as String on success.
 */
export type exportChatInviteLink = (params: ExportChatInviteLinkParams) => Promise<string>;

/**
 * Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent Message is returned.
 */
export interface ForwardMessageParams {
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the message will be forwarded; required if the message is forwarded to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * Unique identifier for the chat where the original message was sent (or username of the target bot, supergroup, or channel in the format @username)
     */
    from_chat_id: number | string;
    /**
     * New start timestamp for the forwarded video in the message
     */
    video_start_timestamp?: number;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the forwarded message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; only available when forwarding to private chats
     */
    message_effect_id?: string;
    /**
     * A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only
     */
    suggested_post_parameters?: TelegramSuggestedPostParameters;
    /**
     * Message identifier in the chat specified in from_chat_id
     */
    message_id: number;
}

/**
 * Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent Message is returned.
 */
export type forwardMessage = (params: ForwardMessageParams) => Promise<TelegramMessage>;

/**
 * Use this method to forward multiple messages of any kind. If some of the specified messages can't be found or forwarded, they are skipped. Service messages and messages with protected content can't be forwarded. Album grouping is kept for forwarded messages. On success, an Array of MessageId of the sent messages is returned.
 */
export interface ForwardMessagesParams {
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the messages will be forwarded; required if the messages are forwarded to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * Unique identifier for the chat where the original messages were sent (or username of the target bot, supergroup, or channel in the format @username)
     */
    from_chat_id: number | string;
    /**
     * A JSON-serialized list of 1-100 identifiers of messages in the chat from_chat_id to forward. The identifiers must be specified in a strictly increasing order.
     */
    message_ids: number[];
    /**
     * Sends the messages silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the forwarded messages from forwarding and saving
     */
    protect_content?: boolean;
}

/**
 * Use this method to forward multiple messages of any kind. If some of the specified messages can't be found or forwarded, they are skipped. Service messages and messages with protected content can't be forwarded. Album grouping is kept for forwarded messages. On success, an Array of MessageId of the sent messages is returned.
 */
export type forwardMessages = (params: ForwardMessagesParams) => Promise<TelegramMessageId[]>;

/**
 * Returns the list of gifts that can be sent by the bot to users and channel chats. Requires no parameters. Returns a Gifts object.
 */
export type getAvailableGifts = () => Promise<TelegramGifts>;

/**
 * Returns the gifts received and owned by a managed business account. Requires the can_view_gifts_and_stars business bot right. Returns OwnedGifts on success.
 */
export interface GetBusinessAccountGiftsParams {
    /**
     * Unique identifier of the business connection
     */
    business_connection_id: string;
    /**
     * Pass True to exclude gifts that aren't saved to the account's profile page
     */
    exclude_unsaved?: boolean;
    /**
     * Pass True to exclude gifts that are saved to the account's profile page
     */
    exclude_saved?: boolean;
    /**
     * Pass True to exclude gifts that can be purchased an unlimited number of times
     */
    exclude_unlimited?: boolean;
    /**
     * Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique
     */
    exclude_limited_upgradable?: boolean;
    /**
     * Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique
     */
    exclude_limited_non_upgradable?: boolean;
    /**
     * Pass True to exclude unique gifts
     */
    exclude_unique?: boolean;
    /**
     * Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram
     */
    exclude_from_blockchain?: boolean;
    /**
     * Pass True to sort results by gift price instead of send date. Sorting is applied before pagination.
     */
    sort_by_price?: boolean;
    /**
     * Offset of the first entry to return as received from the previous request; use empty string to get the first chunk of results
     */
    offset?: string;
    /**
     * The maximum number of gifts to be returned; 1-100. Defaults to 100.
     */
    limit?: number;
}

/**
 * Returns the gifts received and owned by a managed business account. Requires the can_view_gifts_and_stars business bot right. Returns OwnedGifts on success.
 */
export type getBusinessAccountGifts = (params: GetBusinessAccountGiftsParams) => Promise<TelegramOwnedGifts>;

/**
 * Returns the amount of Telegram Stars owned by a managed business account. Requires the can_view_gifts_and_stars business bot right. Returns StarAmount on success.
 */
export interface GetBusinessAccountStarBalanceParams {
    /**
     * Unique identifier of the business connection
     */
    business_connection_id: string;
}

/**
 * Returns the amount of Telegram Stars owned by a managed business account. Requires the can_view_gifts_and_stars business bot right. Returns StarAmount on success.
 */
export type getBusinessAccountStarBalance = (params: GetBusinessAccountStarBalanceParams) => Promise<TelegramStarAmount>;

/**
 * Use this method to get information about the connection of the bot with a business account. Returns a BusinessConnection object on success.
 */
export interface GetBusinessConnectionParams {
    /**
     * Unique identifier of the business connection
     */
    business_connection_id: string;
}

/**
 * Use this method to get information about the connection of the bot with a business account. Returns a BusinessConnection object on success.
 */
export type getBusinessConnection = (params: GetBusinessConnectionParams) => Promise<TelegramBusinessConnection>;

/**
 * Use this method to get up-to-date information about the chat. Returns a ChatFullInfo object on success.
 */
export interface GetChatParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup or channel in the format @username
     */
    chat_id: number | string;
}

/**
 * Use this method to get up-to-date information about the chat. Returns a ChatFullInfo object on success.
 */
export type getChat = (params: GetChatParams) => Promise<TelegramChatFullInfo>;

/**
 * Use this method to get a list of administrators in a chat. Returns an Array of ChatMember objects.
 */
export interface GetChatAdministratorsParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup or channel in the format @username
     */
    chat_id: number | string;
    /**
     * Pass True to additionally receive all bots that are administrators of the chat. By default, bots other than the current bot are omitted.
     */
    return_bots?: boolean;
}

/**
 * Use this method to get a list of administrators in a chat. Returns an Array of ChatMember objects.
 */
export type getChatAdministrators = (params: GetChatAdministratorsParams) => Promise<(TelegramChatMemberOwner | TelegramChatMemberAdministrator)[]>;

/**
 * Returns the gifts owned by a chat. Returns OwnedGifts on success.
 */
export interface GetChatGiftsParams {
    /**
     * Unique identifier for the target chat or username of the target channel in the format @username
     */
    chat_id: number | string;
    /**
     * Pass True to exclude gifts that aren't saved to the chat's profile page. Always True, unless the bot has the can_post_messages administrator right in the channel.
     */
    exclude_unsaved?: boolean;
    /**
     * Pass True to exclude gifts that are saved to the chat's profile page. Always False, unless the bot has the can_post_messages administrator right in the channel.
     */
    exclude_saved?: boolean;
    /**
     * Pass True to exclude gifts that can be purchased an unlimited number of times
     */
    exclude_unlimited?: boolean;
    /**
     * Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique
     */
    exclude_limited_upgradable?: boolean;
    /**
     * Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique
     */
    exclude_limited_non_upgradable?: boolean;
    /**
     * Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram
     */
    exclude_from_blockchain?: boolean;
    /**
     * Pass True to exclude unique gifts
     */
    exclude_unique?: boolean;
    /**
     * Pass True to sort results by gift price instead of send date. Sorting is applied before pagination.
     */
    sort_by_price?: boolean;
    /**
     * Offset of the first entry to return as received from the previous request; use an empty string to get the first chunk of results
     */
    offset?: string;
    /**
     * The maximum number of gifts to be returned; 1-100. Defaults to 100.
     */
    limit?: number;
}

/**
 * Returns the gifts owned by a chat. Returns OwnedGifts on success.
 */
export type getChatGifts = (params: GetChatGiftsParams) => Promise<TelegramOwnedGifts>;

/**
 * Use this method to get information about a member of a chat. The method is only guaranteed to work for other users if the bot is an administrator in the chat. Returns a ChatMember object on success.
 */
export interface GetChatMemberParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup or channel in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     */
    user_id: number;
}

/**
 * Use this method to get information about a member of a chat. The method is only guaranteed to work for other users if the bot is an administrator in the chat. Returns a ChatMember object on success.
 */
export type getChatMember = (params: GetChatMemberParams) => Promise<TelegramChatMember>;

/**
 * Use this method to get the number of members in a chat. Returns Integer on success.
 */
export interface GetChatMemberCountParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup or channel in the format @username
     */
    chat_id: number | string;
}

/**
 * Use this method to get the number of members in a chat. Returns Integer on success.
 */
export type getChatMemberCount = (params: GetChatMemberCountParams) => Promise<number>;

/**
 * Use this method to get the current value of the bot's menu button in a private chat, or the default menu button. Returns MenuButton on success.
 */
export interface GetChatMenuButtonParams {
    /**
     * Unique identifier for the target private chat. If not specified, the bot's default menu button will be returned.
     */
    chat_id?: number;
}

/**
 * Use this method to get the current value of the bot's menu button in a private chat, or the default menu button. Returns MenuButton on success.
 */
export type getChatMenuButton = (params: GetChatMenuButtonParams) => Promise<TelegramMenuButton>;

/**
 * Use this method to get the list of backdrops, which can be used as the background of a theme of the screen for sharing a link to a user or a chat. Requires no parameters. Returns a ChatShareThemeBackdrops object.
 */
export type getChatShareThemeBackdrops = () => Promise<TelegramChatShareThemeBackdrops>;

/**
 * Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of Sticker objects.
 */
export interface GetCustomEmojiStickersParams {
    /**
     * A JSON-serialized list of custom emoji identifiers. At most 200 custom emoji identifiers can be specified.
     */
    custom_emoji_ids: string[];
}

/**
 * Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of Sticker objects.
 */
export type getCustomEmojiStickers = (params: GetCustomEmojiStickersParams) => Promise<TelegramSticker[]>;

/**
 * Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a File object is returned. The file can then be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>, where <file_path> is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again.
 */
export interface GetFileParams {
    /**
     * File identifier to get information about
     */
    file_id: string;
}

/**
 * Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a File object is returned. The file can then be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>, where <file_path> is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again.
 */
export type getFile = (params: GetFileParams) => Promise<TelegramFile>;

/**
 * Use this method to get custom emoji stickers, which can be used as a forum topic icon by any user. Requires no parameters. Returns an Array of Sticker objects.
 */
export type getForumTopicIconStickers = () => Promise<TelegramSticker[]>;

/**
 * Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. Returns an Array of GameHighScore objects.
 */
export interface GetGameHighScoresParams {
    /**
     * Target user id
     */
    user_id: number;
    /**
     * Required if inline_message_id is not specified. Unique identifier for the target chat.
     */
    chat_id?: number;
    /**
     * Required if inline_message_id is not specified. Identifier of the sent message.
     */
    message_id?: number;
    /**
     * Required if chat_id and message_id are not specified. Identifier of the inline message.
     */
    inline_message_id?: string;
}

/**
 * Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. Returns an Array of GameHighScore objects.
 */
export type getGameHighScores = (params: GetGameHighScoresParams) => Promise<TelegramGameHighScore[]>;

/**
 * Use this method to get the access settings of a managed bot. Returns a BotAccessSettings object on success.
 */
export interface GetManagedBotAccessSettingsParams {
    /**
     * User identifier of the managed bot whose access settings will be returned
     */
    user_id: number;
}

/**
 * Use this method to get the access settings of a managed bot. Returns a BotAccessSettings object on success.
 */
export type getManagedBotAccessSettings = (params: GetManagedBotAccessSettingsParams) => Promise<TelegramBotAccessSettings>;

/**
 * Use this method to get the token of a managed bot. Returns the token as String on success.
 */
export interface GetManagedBotTokenParams {
    /**
     * User identifier of the managed bot whose token will be returned
     */
    user_id: number;
}

/**
 * Use this method to get the token of a managed bot. Returns the token as String on success.
 */
export type getManagedBotToken = (params: GetManagedBotTokenParams) => Promise<string>;

/**
 * A simple method for testing your bot's authentication token. Requires no parameters. Returns basic information about the bot in form of a User object.
 */
export type getMe = () => Promise<TelegramUser>;

/**
 * Use this method to get the current list of the bot's commands for the given scope and user language. Returns an Array of BotCommand objects. If commands aren't set, an empty list is returned.
 */
export interface GetMyCommandsParams {
    /**
     * A JSON-serialized object, describing scope of users. Defaults to BotCommandScopeDefault.
     */
    scope?: TelegramBotCommandScope;
    /**
     * A two-letter ISO 639-1 language code or an empty string
     */
    language_code?: string;
}

/**
 * Use this method to get the current list of the bot's commands for the given scope and user language. Returns an Array of BotCommand objects. If commands aren't set, an empty list is returned.
 */
export type getMyCommands = (params: GetMyCommandsParams) => Promise<TelegramBotCommand[]>;

/**
 * Use this method to get the current default administrator rights of the bot. Returns ChatAdministratorRights on success.
 */
export interface GetMyDefaultAdministratorRightsParams {
    /**
     * Pass True to get default administrator rights of the bot in channels. Otherwise, default administrator rights of the bot for groups and supergroups will be returned.
     */
    for_channels?: boolean;
}

/**
 * Use this method to get the current default administrator rights of the bot. Returns ChatAdministratorRights on success.
 */
export type getMyDefaultAdministratorRights = (params: GetMyDefaultAdministratorRightsParams) => Promise<TelegramChatAdministratorRights>;

/**
 * Use this method to get the current bot description for the given user language. Returns BotDescription on success.
 */
export interface GetMyDescriptionParams {
    /**
     * A two-letter ISO 639-1 language code or an empty string
     */
    language_code?: string;
}

/**
 * Use this method to get the current bot description for the given user language. Returns BotDescription on success.
 */
export type getMyDescription = (params: GetMyDescriptionParams) => Promise<TelegramBotDescription>;

/**
 * Use this method to get the current bot name for the given user language. Returns BotName on success.
 */
export interface GetMyNameParams {
    /**
     * A two-letter ISO 639-1 language code or an empty string
     */
    language_code?: string;
}

/**
 * Use this method to get the current bot name for the given user language. Returns BotName on success.
 */
export type getMyName = (params: GetMyNameParams) => Promise<TelegramBotName>;

/**
 * Use this method to get the current bot short description for the given user language. Returns BotShortDescription on success.
 */
export interface GetMyShortDescriptionParams {
    /**
     * A two-letter ISO 639-1 language code or an empty string
     */
    language_code?: string;
}

/**
 * Use this method to get the current bot short description for the given user language. Returns BotShortDescription on success.
 */
export type getMyShortDescription = (params: GetMyShortDescriptionParams) => Promise<TelegramBotShortDescription>;

/**
 * A method to get the current Telegram Stars balance of the bot. Requires no parameters. On success, returns a StarAmount object.
 */
export type getMyStarBalance = () => Promise<TelegramStarAmount>;

/**
 * Returns the bot's Telegram Star transactions in chronological order. On success, returns a StarTransactions object.
 */
export interface GetStarTransactionsParams {
    /**
     * Number of transactions to skip in the response
     */
    offset?: number;
    /**
     * The maximum number of transactions to be retrieved. Values between 1-100 are accepted. Defaults to 100.
     */
    limit?: number;
}

/**
 * Returns the bot's Telegram Star transactions in chronological order. On success, returns a StarTransactions object.
 */
export type getStarTransactions = (params: GetStarTransactionsParams) => Promise<TelegramStarTransactions>;

/**
 * Use this method to get a sticker set. On success, a StickerSet object is returned.
 */
export interface GetStickerSetParams {
    /**
     * Name of the sticker set
     */
    name: string;
}

/**
 * Use this method to get a sticker set. On success, a StickerSet object is returned.
 */
export type getStickerSet = (params: GetStickerSetParams) => Promise<TelegramStickerSet>;

/**
 * Use this method to get information about a unique gift by its name. Returns a UniqueGift object on success.
 */
export interface GetUniqueGiftParams {
    /**
     * Unique name of the gift
     */
    name: string;
}

/**
 * Use this method to get information about a unique gift by its name. Returns a UniqueGift object on success.
 */
export type getUniqueGift = (params: GetUniqueGiftParams) => Promise<TelegramUniqueGift>;

/**
 * Use this method to receive incoming updates using long polling (wiki). Returns an Array of Update objects.
 */
export interface GetUpdatesParams {
    /**
     * Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as getUpdates is called with an offset higher than its update_id. The negative offset can be specified to retrieve updates starting from -offset update from the end of the updates queue. All previous updates will be forgotten.
     */
    offset?: number;
    /**
     * Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100.
     */
    limit?: number;
    /**
     * Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only.
     */
    timeout?: number;
    /**
     * A JSON-serialized list of the update types you want your bot to receive. For example, specify ["message", "edited_channel_post", "callback_query"] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member, message_reaction, and message_reaction_count (default). If not specified, the previous setting will be used.Please note that this parameter doesn't affect updates created before the call to getUpdates, so unwanted updates may be received for a short period of time.
     */
    allowed_updates?: string[];
}

/**
 * Use this method to receive incoming updates using long polling (wiki). Returns an Array of Update objects.
 */
export type getUpdates = (params: GetUpdatesParams) => Promise<TelegramUpdate[]>;

/**
 * Use this method to get the list of boosts added to a chat by a user. Requires administrator rights in the chat. Returns a UserChatBoosts object.
 */
export interface GetUserChatBoostsParams {
    /**
     * Unique identifier for the chat or username of the channel in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     */
    user_id: number;
}

/**
 * Use this method to get the list of boosts added to a chat by a user. Requires administrator rights in the chat. Returns a UserChatBoosts object.
 */
export type getUserChatBoosts = (params: GetUserChatBoostsParams) => Promise<TelegramUserChatBoosts>;

/**
 * Returns the gifts owned and hosted by a user. Returns OwnedGifts on success.
 */
export interface GetUserGiftsParams {
    /**
     * Unique identifier of the user
     */
    user_id: number;
    /**
     * Pass True to exclude gifts that can be purchased an unlimited number of times
     */
    exclude_unlimited?: boolean;
    /**
     * Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique
     */
    exclude_limited_upgradable?: boolean;
    /**
     * Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique
     */
    exclude_limited_non_upgradable?: boolean;
    /**
     * Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram
     */
    exclude_from_blockchain?: boolean;
    /**
     * Pass True to exclude unique gifts
     */
    exclude_unique?: boolean;
    /**
     * Pass True to sort results by gift price instead of send date. Sorting is applied before pagination.
     */
    sort_by_price?: boolean;
    /**
     * Offset of the first entry to return as received from the previous request; use an empty string to get the first chunk of results
     */
    offset?: string;
    /**
     * The maximum number of gifts to be returned; 1-100. Defaults to 100.
     */
    limit?: number;
}

/**
 * Returns the gifts owned and hosted by a user. Returns OwnedGifts on success.
 */
export type getUserGifts = (params: GetUserGiftsParams) => Promise<TelegramOwnedGifts>;

/**
 * Use this method to get the last messages from the personal chat (i.e., the chat currently added to their profile) of a given user. On success, an Array of Message objects is returned.
 */
export interface GetUserPersonalChatMessagesParams {
    /**
     * Unique identifier for the target user
     */
    user_id: number;
    /**
     * The maximum number of messages to return; 1-20
     */
    limit: number;
}

/**
 * Use this method to get the last messages from the personal chat (i.e., the chat currently added to their profile) of a given user. On success, an Array of Message objects is returned.
 */
export type getUserPersonalChatMessages = (params: GetUserPersonalChatMessagesParams) => Promise<TelegramMessage[]>;

/**
 * Use this method to get a list of profile audios for a user. Returns a UserProfileAudios object.
 */
export interface GetUserProfileAudiosParams {
    /**
     * Unique identifier of the target user
     */
    user_id: number;
    /**
     * Sequential number of the first audio to be returned. By default, all audios are returned.
     */
    offset?: number;
    /**
     * Limits the number of audios to be retrieved. Values between 1-100 are accepted. Defaults to 100.
     */
    limit?: number;
}

/**
 * Use this method to get a list of profile audios for a user. Returns a UserProfileAudios object.
 */
export type getUserProfileAudios = (params: GetUserProfileAudiosParams) => Promise<TelegramUserProfileAudios>;

/**
 * Use this method to get a list of profile pictures for a user. Returns a UserProfilePhotos object.
 */
export interface GetUserProfilePhotosParams {
    /**
     * Unique identifier of the target user
     */
    user_id: number;
    /**
     * Sequential number of the first photo to be returned. By default, all photos are returned.
     */
    offset?: number;
    /**
     * Limits the number of photos to be retrieved. Values between 1-100 are accepted. Defaults to 100.
     */
    limit?: number;
}

/**
 * Use this method to get a list of profile pictures for a user. Returns a UserProfilePhotos object.
 */
export type getUserProfilePhotos = (params: GetUserProfilePhotosParams) => Promise<TelegramUserProfilePhotos>;

/**
 * Use this method to get current webhook status. Requires no parameters. On success, returns a WebhookInfo object. If the bot is using getUpdates, will return an object with the url field empty.
 */
export type getWebhookInfo = () => Promise<TelegramWebhookInfo>;

/**
 * Gifts a Telegram Premium subscription to the given user. Returns True on success.
 */
export interface GiftPremiumSubscriptionParams {
    /**
     * Unique identifier of the target user who will receive a Telegram Premium subscription
     */
    user_id: number;
    /**
     * Number of months the Telegram Premium subscription will be active for the user; must be one of 3, 6, or 12
     */
    month_count: number;
    /**
     * Number of Telegram Stars to pay for the Telegram Premium subscription; must be 1000 for 3 months, 1500 for 6 months, and 2500 for 12 months
     */
    star_count: number;
    /**
     * Text that will be shown along with the service message about the subscription; 0-128 characters
     */
    text?: string | Formattable;
    /**
     * Mode for parsing entities in the text. See formatting options for more details. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, “custom_emoji”, and “date_time” are ignored.
     */
    text_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of text_parse_mode. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, “custom_emoji”, and “date_time” are ignored.
     */
    text_entities?: TelegramMessageEntity[];
}

/**
 * Gifts a Telegram Premium subscription to the given user. Returns True on success.
 */
export type giftPremiumSubscription = (params: GiftPremiumSubscriptionParams) => Promise<true>;

/**
 * Use this method to hide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically closed if it was open. Returns True on success.
 */
export interface HideGeneralForumTopicParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
}

/**
 * Use this method to hide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically closed if it was open. Returns True on success.
 */
export type hideGeneralForumTopic = (params: HideGeneralForumTopicParams) => Promise<true>;

/**
 * Use this method for your bot to leave a group, supergroup or channel. Returns True on success.
 */
export interface LeaveChatParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup or channel in the format @username. Channel direct messages chats aren't supported; leave the corresponding channel instead.
     */
    chat_id: number | string;
}

/**
 * Use this method for your bot to leave a group, supergroup or channel. Returns True on success.
 */
export type leaveChat = (params: LeaveChatParams) => Promise<true>;

/**
 * Use this method to log out from the cloud Bot API server before launching the bot locally. You must log out the bot before running it locally, otherwise there is no guarantee that the bot will receive updates. After a successful call, you can immediately log in on a local server, but will not be able to log in back to the cloud Bot API server for 10 minutes. Returns True on success. Requires no parameters.
 */
export type logOut = () => Promise<true>;

/**
 * Use this method to add a message to the list of pinned messages in a chat. In private chats and channel direct messages chats, all non-service messages can be pinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to pin messages in groups and channels respectively. Returns True on success.
 */
export interface PinChatMessageParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be pinned
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target channel in the format @username
     */
    chat_id: number | string;
    /**
     * Identifier of a message to pin
     */
    message_id: number;
    /**
     * Pass True if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels and private chats.
     */
    disable_notification?: boolean;
}

/**
 * Use this method to add a message to the list of pinned messages in a chat. In private chats and channel direct messages chats, all non-service messages can be pinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to pin messages in groups and channels respectively. Returns True on success.
 */
export type pinChatMessage = (params: PinChatMessageParams) => Promise<true>;

/**
 * Posts a story on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns Story on success.
 */
export interface PostStoryParams {
    /**
     * Unique identifier of the business connection
     */
    business_connection_id: string;
    /**
     * Content of the story
     */
    content: TelegramInputStoryContent;
    /**
     * Period after which the story is moved to the archive, in seconds; must be one of 6 * 3600, 12 * 3600, 86400, or 2 * 86400
     */
    active_period: number;
    /**
     * Caption of the story, 0-2048 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Mode for parsing entities in the story caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * A JSON-serialized list of clickable areas to be shown on the story
     */
    areas?: TelegramStoryArea[];
    /**
     * Pass True to keep the story accessible after it expires
     */
    post_to_chat_page?: boolean;
    /**
     * Pass True if the content of the story must be protected from forwarding and screenshotting
     */
    protect_content?: boolean;
}

/**
 * Posts a story on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns Story on success.
 */
export type postStory = (params: PostStoryParams) => Promise<TelegramStory>;

/**
 * Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass False for all boolean parameters to demote a user. Returns True on success.
 */
export interface PromoteChatMemberParams {
    /**
     * Unique identifier for the target chat or username of the target channel in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     */
    user_id: number;
    /**
     * Pass True if the administrator's presence in the chat is hidden
     */
    is_anonymous?: boolean;
    /**
     * Pass True if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege.
     */
    can_manage_chat?: boolean;
    /**
     * Pass True if the administrator can delete messages of other users
     */
    can_delete_messages?: boolean;
    /**
     * Pass True if the administrator can manage video chats
     */
    can_manage_video_chats?: boolean;
    /**
     * Pass True if the administrator can restrict, ban or unban chat members, or access supergroup statistics. For backward compatibility, defaults to True for promotions of channel administrators.
     */
    can_restrict_members?: boolean;
    /**
     * Pass True if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by him)
     */
    can_promote_members?: boolean;
    /**
     * Pass True if the administrator can change chat title, photo and other settings
     */
    can_change_info?: boolean;
    /**
     * Pass True if the administrator can invite new users to the chat
     */
    can_invite_users?: boolean;
    /**
     * Pass True if the administrator can post stories to the chat
     */
    can_post_stories?: boolean;
    /**
     * Pass True if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive
     */
    can_edit_stories?: boolean;
    /**
     * Pass True if the administrator can delete stories posted by other users
     */
    can_delete_stories?: boolean;
    /**
     * Pass True if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only
     */
    can_post_messages?: boolean;
    /**
     * Pass True if the administrator can edit messages of other users and can pin messages; for channels only
     */
    can_edit_messages?: boolean;
    /**
     * Pass True if the administrator can pin messages; for supergroups only
     */
    can_pin_messages?: boolean;
    /**
     * Pass True if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only
     */
    can_manage_topics?: boolean;
    /**
     * Pass True if the administrator can manage direct messages within the channel and decline suggested posts; for channels only
     */
    can_manage_direct_messages?: boolean;
    /**
     * Pass True if the administrator can edit the tags of regular members; for groups and supergroups only
     */
    can_manage_tags?: boolean;
    /**
     * Pass True if the administrator can manage chat welcome messages or directly send them in the case of bots
     */
    can_send_welcome_messages?: boolean;
}

/**
 * Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass False for all boolean parameters to demote a user. Returns True on success.
 */
export type promoteChatMember = (params: PromoteChatMemberParams) => Promise<true>;

/**
 * Marks incoming message as read on behalf of a business account. Requires the can_read_messages business bot right. Returns True on success.
 */
export interface ReadBusinessMessageParams {
    /**
     * Unique identifier of the business connection on behalf of which to read the message
     */
    business_connection_id: string;
    /**
     * Unique identifier of the chat in which the message was received. The chat must have been active in the last 24 hours.
     */
    chat_id: number;
    /**
     * Unique identifier of the message to mark as read
     */
    message_id: number;
}

/**
 * Marks incoming message as read on behalf of a business account. Requires the can_read_messages business bot right. Returns True on success.
 */
export type readBusinessMessage = (params: ReadBusinessMessageParams) => Promise<true>;

/**
 * Refunds a successful payment in Telegram Stars. Returns True on success.
 */
export interface RefundStarPaymentParams {
    /**
     * Identifier of the user whose payment will be refunded
     */
    user_id: number;
    /**
     * Telegram payment identifier
     */
    telegram_payment_charge_id: string;
}

/**
 * Refunds a successful payment in Telegram Stars. Returns True on success.
 */
export type refundStarPayment = (params: RefundStarPaymentParams) => Promise<true>;

/**
 * Removes the current profile photo of a managed business account. Requires the can_edit_profile_photo business bot right. Returns True on success.
 */
export interface RemoveBusinessAccountProfilePhotoParams {
    /**
     * Unique identifier of the business connection
     */
    business_connection_id: string;
    /**
     * Pass True to remove the public photo, which is visible even if the main photo is hidden by the business account's privacy settings. After the main photo is removed, the previous profile photo (if present) becomes the main photo.
     */
    is_public?: boolean;
}

/**
 * Removes the current profile photo of a managed business account. Requires the can_edit_profile_photo business bot right. Returns True on success.
 */
export type removeBusinessAccountProfilePhoto = (params: RemoveBusinessAccountProfilePhotoParams) => Promise<true>;

/**
 * Removes verification from a chat that is currently verified on behalf of the organization represented by the bot. Returns True on success.
 */
export interface RemoveChatVerificationParams {
    /**
     * Unique identifier for the target chat or username of the target bot or channel in the format @username
     */
    chat_id: number | string;
}

/**
 * Removes verification from a chat that is currently verified on behalf of the organization represented by the bot. Returns True on success.
 */
export type removeChatVerification = (params: RemoveChatVerificationParams) => Promise<true>;

/**
 * Removes the profile photo of the bot. Requires no parameters. Returns True on success.
 */
export type removeMyProfilePhoto = () => Promise<true>;

/**
 * Removes verification from a user who is currently verified on behalf of the organization represented by the bot. Returns True on success.
 */
export interface RemoveUserVerificationParams {
    /**
     * Unique identifier of the target user
     */
    user_id: number;
}

/**
 * Removes verification from a user who is currently verified on behalf of the organization represented by the bot. Returns True on success.
 */
export type removeUserVerification = (params: RemoveUserVerificationParams) => Promise<true>;

/**
 * Use this method to reopen a closed topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.
 */
export interface ReopenForumTopicParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier for the target message thread of the forum topic
     */
    message_thread_id: number;
}

/**
 * Use this method to reopen a closed topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.
 */
export type reopenForumTopic = (params: ReopenForumTopicParams) => Promise<true>;

/**
 * Use this method to reopen a closed 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically unhidden if it was hidden. Returns True on success.
 */
export interface ReopenGeneralForumTopicParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
}

/**
 * Use this method to reopen a closed 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically unhidden if it was hidden. Returns True on success.
 */
export type reopenGeneralForumTopic = (params: ReopenGeneralForumTopicParams) => Promise<true>;

/**
 * Use this method to revoke the current token of a managed bot and generate a new one. Returns the new token as String on success.
 */
export interface ReplaceManagedBotTokenParams {
    /**
     * User identifier of the managed bot whose token will be replaced
     */
    user_id: number;
}

/**
 * Use this method to revoke the current token of a managed bot and generate a new one. Returns the new token as String on success.
 */
export type replaceManagedBotToken = (params: ReplaceManagedBotTokenParams) => Promise<string>;

/**
 * Use this method to replace an existing sticker in a sticker set with a new one. The method is equivalent to calling deleteStickerFromSet, then addStickerToSet, then setStickerPositionInSet. Returns True on success.
 */
export interface ReplaceStickerInSetParams {
    /**
     * User identifier of the sticker set owner
     */
    user_id: number;
    /**
     * Sticker set name
     */
    name: string;
    /**
     * File identifier of the replaced sticker
     */
    old_sticker: string;
    /**
     * A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set remains unchanged.
     */
    sticker: TelegramInputSticker;
}

/**
 * Use this method to replace an existing sticker in a sticker set with a new one. The method is equivalent to calling deleteStickerFromSet, then addStickerToSet, then setStickerPositionInSet. Returns True on success.
 */
export type replaceStickerInSet = (params: ReplaceStickerInSetParams) => Promise<true>;

/**
 * Reposts a story on behalf of a business account from another business account. Both business accounts must be managed by the same bot, and the story on the source account must have been posted (or reposted) by the bot. Requires the can_manage_stories business bot right for both business accounts. Returns Story on success.
 */
export interface RepostStoryParams {
    /**
     * Unique identifier of the business connection
     */
    business_connection_id: string;
    /**
     * Unique identifier of the chat which posted the story that should be reposted
     */
    from_chat_id: number;
    /**
     * Unique identifier of the story that should be reposted
     */
    from_story_id: number;
    /**
     * Period after which the story is moved to the archive, in seconds; must be one of 6 * 3600, 12 * 3600, 86400, or 2 * 86400
     */
    active_period: number;
    /**
     * Pass True to keep the story accessible after it expires
     */
    post_to_chat_page?: boolean;
    /**
     * Pass True if the content of the story must be protected from forwarding and screenshotting
     */
    protect_content?: boolean;
}

/**
 * Reposts a story on behalf of a business account from another business account. Both business accounts must be managed by the same bot, and the story on the source account must have been posted (or reposted) by the bot. Requires the can_manage_stories business bot right for both business accounts. Returns Story on success.
 */
export type repostStory = (params: RepostStoryParams) => Promise<TelegramStory>;

/**
 * Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass True for all permissions to lift restrictions from a user. Returns True on success.
 */
export interface RestrictChatMemberParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     */
    user_id: number;
    /**
     * A JSON-serialized object for new user permissions
     */
    permissions: TelegramChatPermissions;
    /**
     * Pass True if chat permissions are set independently. Otherwise, the can_send_other_messages and can_add_web_page_previews permissions will imply the can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, and can_send_voice_notes permissions; the can_send_polls permission will imply the can_send_messages permission.
     */
    use_independent_chat_permissions?: boolean;
    /**
     * Date when restrictions will be lifted for the user; Unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever.
     */
    until_date?: number;
}

/**
 * Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass True for all permissions to lift restrictions from a user. Returns True on success.
 */
export type restrictChatMember = (params: RestrictChatMemberParams) => Promise<true>;

/**
 * Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as ChatInviteLink object.
 */
export interface RevokeChatInviteLinkParams {
    /**
     * Unique identifier of the target chat or username of the target channel in the format @username
     */
    chat_id: number | string;
    /**
     * The invite link to revoke
     */
    invite_link: string;
}

/**
 * Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as ChatInviteLink object.
 */
export type revokeChatInviteLink = (params: RevokeChatInviteLinkParams) => Promise<TelegramChatInviteLink>;

/**
 * Stores a message that can be sent by a user of a Mini App. Returns a PreparedInlineMessage object.
 */
export interface SavePreparedInlineMessageParams {
    /**
     * Unique identifier of the target user that can use the prepared message
     */
    user_id: number;
    /**
     * A JSON-serialized object describing the message to be sent
     */
    result: TelegramInlineQueryResult;
    /**
     * Pass True if the message can be sent to private chats with users
     */
    allow_user_chats?: boolean;
    /**
     * Pass True if the message can be sent to private chats with bots
     */
    allow_bot_chats?: boolean;
    /**
     * Pass True if the message can be sent to group and supergroup chats
     */
    allow_group_chats?: boolean;
    /**
     * Pass True if the message can be sent to channel chats
     */
    allow_channel_chats?: boolean;
}

/**
 * Stores a message that can be sent by a user of a Mini App. Returns a PreparedInlineMessage object.
 */
export type savePreparedInlineMessage = (params: SavePreparedInlineMessageParams) => Promise<TelegramPreparedInlineMessage>;

/**
 * Stores a keyboard button that can be used by a user within a Mini App. Returns a PreparedKeyboardButton object.
 */
export interface SavePreparedKeyboardButtonParams {
    /**
     * Unique identifier of the target user that can use the button
     */
    user_id: number;
    /**
     * A JSON-serialized object describing the button to be saved. The button must be of the type request_users, request_chat, or request_managed_bot.
     */
    button: TelegramKeyboardButton;
}

/**
 * Stores a keyboard button that can be used by a user within a Mini App. Returns a PreparedKeyboardButton object.
 */
export type savePreparedKeyboardButton = (params: SavePreparedKeyboardButtonParams) => Promise<TelegramPreparedKeyboardButton>;

/**
 * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent Message is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
 */
export interface SendAnimationParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username; required unless the message is sent as an ephemeral reply to a callback query
     */
    chat_id?: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * A JSON-serialized object containing the parameters of the ephemeral message to send
     */
    ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
    /**
     * Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. More information on Sending Files »
     */
    animation: TelegramInputFile | string;
    /**
     * Duration of sent animation in seconds
     */
    duration?: number;
    /**
     * Animation width
     */
    width?: number;
    /**
     * Animation height
     */
    height?: number;
    /**
     * Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files »
     */
    thumbnail?: TelegramInputFile | string;
    /**
     * Animation caption (may also be used when resending animation by file_id), 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Mode for parsing entities in the animation caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Pass True if the caption must be shown above the message media
     */
    show_caption_above_media?: boolean;
    /**
     * Pass True if the animation needs to be covered with a spoiler animation
     */
    has_spoiler?: boolean;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.
     */
    suggested_post_parameters?: TelegramSuggestedPostParameters;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent Message is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
 */
export type sendAnimation = (params: SendAnimationParams) => Promise<TelegramMessage>;

/**
 * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent Message is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
 * For sending voice messages, use the sendVoice method instead.
 */
export interface SendAudioParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username; required unless the message is sent as an ephemeral reply to a callback query
     */
    chat_id?: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * A JSON-serialized object containing the parameters of the ephemeral message to send
     */
    ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
    /**
     * Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files »
     */
    audio: TelegramInputFile | string;
    /**
     * Audio caption, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Mode for parsing entities in the audio caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Duration of the audio in seconds
     */
    duration?: number;
    /**
     * Performer
     */
    performer?: string;
    /**
     * Track name
     */
    title?: string;
    /**
     * Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files »
     */
    thumbnail?: TelegramInputFile | string;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.
     */
    suggested_post_parameters?: TelegramSuggestedPostParameters;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent Message is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
 * For sending voice messages, use the sendVoice method instead.
 */
export type sendAudio = (params: SendAudioParams) => Promise<TelegramMessage>;

/**
 * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns True on success.
 * We only recommend using this method when a response from the bot will take a noticeable amount of time to arrive.
 */
export interface SendChatActionParams {
    /**
     * Unique identifier of the business connection on behalf of which the action will be sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot or supergroup in the format @username. Channel chats and channel direct messages chats aren't supported.
     */
    chat_id: number | string;
    /**
     * Unique identifier for the target message thread or topic of a forum; for supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Type of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_voice or upload_voice for voice notes, upload_document for general files, choose_sticker for stickers, find_location for location data, record_video_note or upload_video_note for video notes.
     */
    action: string;
}

/**
 * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns True on success.
 * We only recommend using this method when a response from the bot will take a noticeable amount of time to arrive.
 */
export type sendChatAction = (params: SendChatActionParams) => Promise<true>;

/**
 * Use this method to process a received chat join request query by showing a Mini App to the user before deciding the outcome. Call answerChatJoinRequestQuery to resolve the join request query based on the user interaction with the Mini App. Returns True on success.
 */
export interface SendChatJoinRequestWebAppParams {
    /**
     * Unique identifier of the join request query
     */
    chat_join_request_query_id: string;
    /**
     * An HTTPS URL of a Web App to be opened with additional data as specified in Initializing Web Apps
     */
    web_app_url: string;
}

/**
 * Use this method to process a received chat join request query by showing a Mini App to the user before deciding the outcome. Call answerChatJoinRequestQuery to resolve the join request query based on the user interaction with the Mini App. Returns True on success.
 */
export type sendChatJoinRequestWebApp = (params: SendChatJoinRequestWebAppParams) => Promise<true>;

/**
 * Use this method to send a checklist on behalf of a connected business account. On success, the sent Message is returned.
 */
export interface SendChecklistParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id: string;
    /**
     * Unique identifier for the target chat or username of the target bot in the format @username
     */
    chat_id: number | string;
    /**
     * A JSON-serialized object for the checklist to send
     */
    checklist: TelegramInputChecklist;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message
     */
    message_effect_id?: string;
    /**
     * A JSON-serialized object for description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * A JSON-serialized object for an inline keyboard
     */
    reply_markup?: TelegramInlineKeyboardMarkup | {
        toJSON: () => TelegramInlineKeyboardMarkup;
    };
}

/**
 * Use this method to send a checklist on behalf of a connected business account. On success, the sent Message is returned.
 */
export type sendChecklist = (params: SendChecklistParams) => Promise<TelegramMessage>;

/**
 * Use this method to send phone contacts. On success, the sent Message is returned.
 */
export interface SendContactParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username; required unless the message is sent as an ephemeral reply to a callback query
     */
    chat_id?: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * A JSON-serialized object containing the parameters of the ephemeral message to send
     */
    ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
    /**
     * Contact's phone number
     */
    phone_number: string;
    /**
     * Contact's first name
     */
    first_name: string;
    /**
     * Contact's last name
     */
    last_name?: string;
    /**
     * Additional data about the contact in the form of a vCard, 0-2048 bytes
     */
    vcard?: string;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.
     */
    suggested_post_parameters?: TelegramSuggestedPostParameters;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to send phone contacts. On success, the sent Message is returned.
 */
export type sendContact = (params: SendContactParams) => Promise<TelegramMessage>;

/**
 * Use this method to send an animated emoji that will display a random value. On success, the sent Message is returned.
 */
export interface SendDiceParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * Emoji on which the dice throw animation is based. Currently, must be one of “”, “”, “”, “”, “”, or “”. Dice can have values 1-6 for “”, “” and “”, values 1-5 for “” and “”, and values 1-64 for “”. Defaults to “”.
     */
    emoji?: string;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.
     */
    suggested_post_parameters?: TelegramSuggestedPostParameters;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to send an animated emoji that will display a random value. On success, the sent Message is returned.
 */
export type sendDice = (params: SendDiceParams) => Promise<TelegramMessage>;

/**
 * Use this method to send general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
 */
export interface SendDocumentParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username; required unless the message is sent as an ephemeral reply to a callback query
     */
    chat_id?: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * A JSON-serialized object containing the parameters of the ephemeral message to send
     */
    ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
    /**
     * File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files »
     */
    document: TelegramInputFile | string;
    /**
     * Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files »
     */
    thumbnail?: TelegramInputFile | string;
    /**
     * Document caption (may also be used when resending documents by file_id), 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Mode for parsing entities in the document caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Disables automatic server-side content type detection for files uploaded using multipart/form-data
     */
    disable_content_type_detection?: boolean;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.
     */
    suggested_post_parameters?: TelegramSuggestedPostParameters;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to send general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
 */
export type sendDocument = (params: SendDocumentParams) => Promise<TelegramMessage>;

/**
 * Use this method to send a game. On success, the sent Message is returned.
 */
export interface SendGameParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot in the format @username. Games can't be sent to channel direct messages chats and channel chats.
     */
    chat_id: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Short name of the game, serves as the unique identifier for the game. Set up your games via @BotFather.
     */
    game_short_name: string;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * A JSON-serialized object for an inline keyboard. If empty, one 'Play game_title' button will be shown. If not empty, the first button must launch the game.
     */
    reply_markup?: TelegramInlineKeyboardMarkup | {
        toJSON: () => TelegramInlineKeyboardMarkup;
    };
}

/**
 * Use this method to send a game. On success, the sent Message is returned.
 */
export type sendGame = (params: SendGameParams) => Promise<TelegramMessage>;

/**
 * Sends a gift to the given user or channel chat. The gift can't be converted to Telegram Stars by the receiver. Returns True on success.
 */
export interface SendGiftParams {
    /**
     * Required if chat_id is not specified. Unique identifier of the target user who will receive the gift.
     */
    user_id?: number;
    /**
     * Required if user_id is not specified. Unique identifier for the chat that will receive the gift or username of the channel in the format @username.
     */
    chat_id?: number | string;
    /**
     * Identifier of the gift; limited gifts can't be sent to channel chats
     */
    gift_id: string;
    /**
     * Pass True to pay for the gift upgrade from the bot's balance, thereby making the upgrade free for the receiver
     */
    pay_for_upgrade?: boolean;
    /**
     * Text that will be shown along with the gift; 0-128 characters
     */
    text?: string | Formattable;
    /**
     * Mode for parsing entities in the text. See formatting options for more details. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, “custom_emoji”, and “date_time” are ignored.
     */
    text_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of text_parse_mode. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, “custom_emoji”, and “date_time” are ignored.
     */
    text_entities?: TelegramMessageEntity[];
}

/**
 * Sends a gift to the given user or channel chat. The gift can't be converted to Telegram Stars by the receiver. Returns True on success.
 */
export type sendGift = (params: SendGiftParams) => Promise<true>;

/**
 * Use this method to send invoices. On success, the sent Message is returned.
 */
export interface SendInvoiceParams {
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * Product name, 1-32 characters
     */
    title: string;
    /**
     * Product description, 1-255 characters
     */
    description: string;
    /**
     * Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.
     */
    payload: string;
    /**
     * Payment provider token, obtained via @BotFather. Pass an empty string for payments in Telegram Stars.
     */
    provider_token?: string;
    /**
     * Three-letter ISO 4217 currency code, see more on currencies. Pass “XTR” for payments in Telegram Stars.
     */
    currency: string;
    /**
     * Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in Telegram Stars.
     */
    prices: TelegramLabeledPrice[];
    /**
     * The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in Telegram Stars.
     */
    max_tip_amount?: number;
    /**
     * A JSON-serialized Array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount.
     */
    suggested_tip_amounts?: number[];
    /**
     * Unique deep-linking parameter. If left empty, forwarded copies of the sent message will have a Pay button, allowing multiple users to pay directly from the forwarded message, using the same invoice. If non-empty, forwarded copies of the sent message will have a URL button with a deep link to the bot (instead of a Pay button), with the value used as the start parameter.
     */
    start_parameter?: string;
    /**
     * JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider.
     */
    provider_data?: string;
    /**
     * URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for.
     */
    photo_url?: string;
    /**
     * Photo size in bytes
     */
    photo_size?: number;
    /**
     * Photo width
     */
    photo_width?: number;
    /**
     * Photo height
     */
    photo_height?: number;
    /**
     * Pass True if you require the user's full name to complete the order. Ignored for payments in Telegram Stars.
     */
    need_name?: boolean;
    /**
     * Pass True if you require the user's phone number to complete the order. Ignored for payments in Telegram Stars.
     */
    need_phone_number?: boolean;
    /**
     * Pass True if you require the user's email address to complete the order. Ignored for payments in Telegram Stars.
     */
    need_email?: boolean;
    /**
     * Pass True if you require the user's shipping address to complete the order. Ignored for payments in Telegram Stars.
     */
    need_shipping_address?: boolean;
    /**
     * Pass True if the user's phone number should be sent to the provider. Ignored for payments in Telegram Stars.
     */
    send_phone_number_to_provider?: boolean;
    /**
     * Pass True if the user's email address should be sent to the provider. Ignored for payments in Telegram Stars.
     */
    send_email_to_provider?: boolean;
    /**
     * Pass True if the final price depends on the shipping method. Ignored for payments in Telegram Stars.
     */
    is_flexible?: boolean;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.
     */
    suggested_post_parameters?: TelegramSuggestedPostParameters;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * A JSON-serialized object for an inline keyboard. If empty, one 'Pay total price' button will be shown. If not empty, the first button must be a Pay button.
     */
    reply_markup?: TelegramInlineKeyboardMarkup | {
        toJSON: () => TelegramInlineKeyboardMarkup;
    };
}

/**
 * Use this method to send invoices. On success, the sent Message is returned.
 */
export type sendInvoice = (params: SendInvoiceParams) => Promise<TelegramMessage>;

/**
 * Use this method to send live photos. On success, the sent Message is returned.
 */
export interface SendLivePhotoParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username; required unless the message is sent as an ephemeral reply to a callback query
     */
    chat_id?: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * A JSON-serialized object containing the parameters of the ephemeral message to send
     */
    ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
    /**
     * Live photo video to send. The video must be no longer than 10 seconds and must not exceed 10 MB in size. Pass a file_id as String to send a video that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. More information on Sending Files ». Sending live photos by a URL is currently unsupported.
     */
    live_photo: TelegramInputFile | string;
    /**
     * The static photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. More information on Sending Files ». Sending live photos by a URL is currently unsupported.
     */
    photo: TelegramInputFile | string;
    /**
     * Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Mode for parsing entities in the video caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Pass True if the caption must be shown above the message media
     */
    show_caption_above_media?: boolean;
    /**
     * Pass True if the video needs to be covered with a spoiler animation
     */
    has_spoiler?: boolean;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.
     */
    suggested_post_parameters?: TelegramSuggestedPostParameters;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to send live photos. On success, the sent Message is returned.
 */
export type sendLivePhoto = (params: SendLivePhotoParams) => Promise<TelegramMessage>;

/**
 * Use this method to send point on the map. On success, the sent Message is returned.
 */
export interface SendLocationParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username; required unless the message is sent as an ephemeral reply to a callback query
     */
    chat_id?: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * A JSON-serialized object containing the parameters of the ephemeral message to send
     */
    ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
    /**
     * Latitude of the location
     */
    latitude: number;
    /**
     * Longitude of the location
     */
    longitude: number;
    /**
     * The radius of uncertainty for the location, measured in meters; 0-1500
     */
    horizontal_accuracy?: number;
    /**
     * Period in seconds during which the location will be updated (see Live Locations), must be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely. Must be 0 for ephemeral messages.
     */
    live_period?: number;
    /**
     * For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.
     */
    heading?: number;
    /**
     * For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.
     */
    proximity_alert_radius?: number;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.
     */
    suggested_post_parameters?: TelegramSuggestedPostParameters;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to send point on the map. On success, the sent Message is returned.
 */
export type sendLocation = (params: SendLocationParams) => Promise<TelegramMessage>;

/**
 * Use this method to send a group of photos, live photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an Array of Message objects that were sent is returned.
 */
export interface SendMediaGroupParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * A JSON-serialized Array describing messages to be sent, must include 2-10 items
     */
    media: (TelegramInputMediaAudio | TelegramInputMediaDocument | TelegramInputMediaLivePhoto | TelegramInputMediaPhoto | TelegramInputMediaVideo)[];
    /**
     * Sends messages silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent messages from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
}

/**
 * Use this method to send a group of photos, live photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an Array of Message objects that were sent is returned.
 */
export type sendMediaGroup = (params: SendMediaGroupParams) => Promise<TelegramMessage[]>;

/**
 * Use this method to send text messages. On success, the sent Message is returned.
 */
export interface SendMessageParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username; required unless the message is sent as an ephemeral reply to a callback query
     */
    chat_id?: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * A JSON-serialized object containing the parameters of the ephemeral message to send
     */
    ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
    /**
     * Text of the message to be sent, 1-4096 characters after entities parsing
     */
    text: string | Formattable;
    /**
     * Mode for parsing entities in the message text. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
     */
    entities?: TelegramMessageEntity[];
    /**
     * Link preview generation options for the message
     */
    link_preview_options?: TelegramLinkPreviewOptions;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.
     */
    suggested_post_parameters?: TelegramSuggestedPostParameters;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to send text messages. On success, the sent Message is returned.
 */
export type sendMessage = (params: SendMessageParams) => Promise<TelegramMessage>;

/**
 * Use this method to stream a partial message to a user while the message is being generated. Note that the streamed draft is ephemeral and acts as a temporary 30-second preview - once the output is finalized, you must call sendMessage with the complete message to persist it in the user's chat. Returns True on success.
 */
export interface SendMessageDraftParams {
    /**
     * Unique identifier for the target private chat
     */
    chat_id: number;
    /**
     * Unique identifier for the target message thread
     */
    message_thread_id?: number;
    /**
     * Unique identifier of the message draft; must be non-zero. Changes to drafts with the same identifier are animated. Otherwise, the draft is replaced without animation.
     */
    draft_id: number;
    /**
     * Text of the message to be sent, 0-4096 characters after entities parsing. Pass an empty text to show a “Thinking…” placeholder.
     */
    text?: string | Formattable;
    /**
     * Mode for parsing entities in the message text. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
     */
    entities?: TelegramMessageEntity[];
    /**
     * Pass True to show the user a button to stop further drafts. The bot will receive an Update “stopped_message_generation” if the user presses the button.
     */
    can_stop?: boolean;
    /**
     * Pass True to keep the draft in the chat when the button is pressed. The draft will still disappear after a short time or if the bot sends a message. To fully preserve the partial draft, the bot should send it as a new message.
     */
    keep_on_stop?: boolean;
}

/**
 * Use this method to stream a partial message to a user while the message is being generated. Note that the streamed draft is ephemeral and acts as a temporary 30-second preview - once the output is finalized, you must call sendMessage with the complete message to persist it in the user's chat. Returns True on success.
 */
export type sendMessageDraft = (params: SendMessageDraftParams) => Promise<true>;

/**
 * Use this method to send paid media. On success, the sent Message is returned.
 */
export interface SendPaidMediaParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username. If the chat is a channel, all Telegram Star proceeds from this media will be credited to the chat's balance. Otherwise, they will be credited to the bot's balance.
     */
    chat_id: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * The number of Telegram Stars that must be paid to buy access to the media; 1-25000
     */
    star_count: number;
    /**
     * A JSON-serialized Array describing the media to be sent; up to 10 items
     */
    media: TelegramInputPaidMedia[];
    /**
     * Bot-defined paid media payload, 0-128 bytes. This will not be displayed to the user, use it for your internal processes.
     */
    payload?: string;
    /**
     * Media caption, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Mode for parsing entities in the media caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Pass True if the caption must be shown above the message media
     */
    show_caption_above_media?: boolean;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.
     */
    suggested_post_parameters?: TelegramSuggestedPostParameters;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to send paid media. On success, the sent Message is returned.
 */
export type sendPaidMedia = (params: SendPaidMediaParams) => Promise<TelegramMessage>;

/**
 * Use this method to send photos. On success, the sent Message is returned.
 */
export interface SendPhotoParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username; required unless the message is sent as an ephemeral reply to a callback query
     */
    chat_id?: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * A JSON-serialized object containing the parameters of the ephemeral message to send
     */
    ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
    /**
     * Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20. More information on Sending Files »
     */
    photo: TelegramInputFile | string;
    /**
     * Photo caption (may also be used when resending photos by file_id), 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Mode for parsing entities in the photo caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Pass True if the caption must be shown above the message media
     */
    show_caption_above_media?: boolean;
    /**
     * Pass True if the photo needs to be covered with a spoiler animation
     */
    has_spoiler?: boolean;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.
     */
    suggested_post_parameters?: TelegramSuggestedPostParameters;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to send photos. On success, the sent Message is returned.
 */
export type sendPhoto = (params: SendPhotoParams) => Promise<TelegramMessage>;

/**
 * Use this method to send a native poll. On success, the sent Message is returned.
 */
export interface SendPollParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username. Polls can't be sent to channel direct messages chats.
     */
    chat_id: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Poll question, 1-300 characters
     */
    question: string | Formattable;
    /**
     * Mode for parsing entities in the question. See formatting options for more details. Currently, only custom emoji entities are allowed.
     */
    question_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the poll question. It can be specified instead of question_parse_mode.
     */
    question_entities?: TelegramMessageEntity[];
    /**
     * A JSON-serialized list of 1-12 answer options
     */
    options: TelegramInputPollOption[];
    /**
     * True, if the poll needs to be anonymous, defaults to True
     */
    is_anonymous?: boolean;
    /**
     * Poll type, “quiz” or “regular”, defaults to “regular”
     */
    type?: string;
    /**
     * Pass True if the poll allows multiple answers, defaults to False
     */
    allows_multiple_answers?: boolean;
    /**
     * Pass True if the poll allows to change chosen answer options, defaults to False for quizzes and to True for regular polls
     */
    allows_revoting?: boolean;
    /**
     * Pass True if the poll options must be shown in random order
     */
    shuffle_options?: boolean;
    /**
     * Pass True if answer options can be added to the poll after creation; not supported for anonymous polls and quizzes
     */
    allow_adding_options?: boolean;
    /**
     * Pass True if poll results must be shown only after the poll closes
     */
    hide_results_until_closes?: boolean;
    /**
     * Pass True if voting is limited to users who have been members of the chat where the poll is being sent for more than 24 hours; for channel chats only
     */
    members_only?: boolean;
    /**
     * A JSON-serialized list of 0-12 two-letter ISO 3166-1 alpha-2 country codes indicating the countries from which users can vote in the poll; for channel chats only. Use “FT” as a country code to allow users with anonymous numbers to vote. If omitted or empty, then users from any country can participate in the poll.
     */
    country_codes?: string[];
    /**
     * A JSON-serialized list of monotonically increasing 0-based identifiers of the correct answer options, required for polls in quiz mode
     */
    correct_option_ids?: number[];
    /**
     * Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing
     */
    explanation?: string | Formattable;
    /**
     * Mode for parsing entities in the explanation. See formatting options for more details.
     */
    explanation_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the poll explanation. It can be specified instead of explanation_parse_mode.
     */
    explanation_entities?: TelegramMessageEntity[];
    /**
     * Media added to the quiz explanation
     */
    explanation_media?: TelegramInputPollMedia;
    /**
     * Amount of time in seconds the poll will be active after creation, 5-2628000. Can't be used together with close_date.
     */
    open_period?: number;
    /**
     * Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 2628000 seconds in the future. Can't be used together with open_period.
     */
    close_date?: number;
    /**
     * Pass True if the poll needs to be immediately closed. This can be useful for poll preview.
     */
    is_closed?: boolean;
    /**
     * Description of the poll to be sent, 0-1024 characters after entities parsing
     */
    description?: string | Formattable;
    /**
     * Mode for parsing entities in the poll description. See formatting options for more details.
     */
    description_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the poll description, which can be specified instead of description_parse_mode
     */
    description_entities?: TelegramMessageEntity[];
    /**
     * Media added to the poll description
     */
    media?: TelegramInputPollMedia;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to send a native poll. On success, the sent Message is returned.
 */
export type sendPoll = (params: SendPollParams) => Promise<TelegramMessage>;

/**
 * Use this method to send rich messages. If the message contains a block with a media element, then the bot must have the right to send the media to the chat. On success, the sent Message is returned.
 */
export interface SendRichMessageParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent. Bot can send rich messages on behalf of a business account only if the corresponding user can send rich messages.
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username; required unless the message is sent as an ephemeral reply to a callback query
     */
    chat_id?: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * A JSON-serialized object containing the parameters of the ephemeral message to send
     */
    ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
    /**
     * The message to be sent
     */
    rich_message: TelegramInputRichMessage | RichLike;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.
     */
    suggested_post_parameters?: TelegramSuggestedPostParameters;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to send rich messages. If the message contains a block with a media element, then the bot must have the right to send the media to the chat. On success, the sent Message is returned.
 */
export type sendRichMessage = (params: SendRichMessageParams) => Promise<TelegramMessage>;

/**
 * Use this method to stream a partial rich message to a user while the message is being generated. Note that the streamed draft is ephemeral and acts as a temporary 30-second preview - once the output is finalized, you must call sendRichMessage with the complete message to persist it in the user's chat. Returns True on success.
 */
export interface SendRichMessageDraftParams {
    /**
     * Unique identifier for the target private chat
     */
    chat_id: number;
    /**
     * Unique identifier for the target message thread
     */
    message_thread_id?: number;
    /**
     * Unique identifier of the message draft; must be non-zero. Changes to drafts with the same identifier are animated. Otherwise, the draft is replaced without animation.
     */
    draft_id: number;
    /**
     * The partial message to be streamed. Direct upload of new files and explicit upload of files by a URL isn't supported.
     */
    rich_message: TelegramInputRichMessage | RichLike;
    /**
     * Pass True to show the user a button to stop further drafts. The bot will receive an Update “stopped_message_generation” if the user presses the button.
     */
    can_stop?: boolean;
    /**
     * Pass True to keep the draft in the chat when the button is pressed. The draft will still disappear after a short time or if the bot sends a message. To fully preserve the partial draft, the bot should send it as a new message.
     */
    keep_on_stop?: boolean;
}

/**
 * Use this method to stream a partial rich message to a user while the message is being generated. Note that the streamed draft is ephemeral and acts as a temporary 30-second preview - once the output is finalized, you must call sendRichMessage with the complete message to persist it in the user's chat. Returns True on success.
 */
export type sendRichMessageDraft = (params: SendRichMessageDraftParams) => Promise<true>;

/**
 * Use this method to send again a shared widget created by the bot. Currently, in the production environment, widgets can be sent only to private chats, and sent widgets automatically have protected content and therefore can't be forwarded. On success, the sent Message is returned.
 */
export interface SendSharedWidgetParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Unique identifier of the shared widget
     */
    widget_id: string;
    /**
     * Data of the widget, which is specific to the message, 0-1024 bytes
     */
    chat_data?: string;
    /**
     * Widget caption, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Mode for parsing entities in the widget caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Pass True if the caption must be shown above the widget
     */
    show_caption_above_media?: boolean;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to send again a shared widget created by the bot. Currently, in the production environment, widgets can be sent only to private chats, and sent widgets automatically have protected content and therefore can't be forwarded. On success, the sent Message is returned.
 */
export type sendSharedWidget = (params: SendSharedWidgetParams) => Promise<TelegramMessage>;

/**
 * Use this method to send static .WEBP, animated .TGS, or video .WEBM stickers. On success, the sent Message is returned.
 */
export interface SendStickerParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username; required unless the message is sent as an ephemeral reply to a callback query
     */
    chat_id?: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * A JSON-serialized object containing the parameters of the ephemeral message to send
     */
    ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
    /**
     * Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet, or upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data. More information on Sending Files ». Video and animated stickers can't be sent via an HTTP URL.
     */
    sticker: TelegramInputFile | string;
    /**
     * Emoji associated with the sticker; only for just uploaded stickers
     */
    emoji?: string;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.
     */
    suggested_post_parameters?: TelegramSuggestedPostParameters;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to send static .WEBP, animated .TGS, or video .WEBM stickers. On success, the sent Message is returned.
 */
export type sendSticker = (params: SendStickerParams) => Promise<TelegramMessage>;

/**
 * Use this method to send information about a venue. On success, the sent Message is returned.
 */
export interface SendVenueParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username; required unless the message is sent as an ephemeral reply to a callback query
     */
    chat_id?: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * A JSON-serialized object containing the parameters of the ephemeral message to send
     */
    ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
    /**
     * Latitude of the venue
     */
    latitude: number;
    /**
     * Longitude of the venue
     */
    longitude: number;
    /**
     * Name of the venue
     */
    title: string;
    /**
     * Address of the venue
     */
    address: string;
    /**
     * Foursquare identifier of the venue
     */
    foursquare_id?: string;
    /**
     * Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)
     */
    foursquare_type?: string;
    /**
     * Google Places identifier of the venue
     */
    google_place_id?: string;
    /**
     * Google Places type of the venue. (See supported types.)
     */
    google_place_type?: string;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.
     */
    suggested_post_parameters?: TelegramSuggestedPostParameters;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to send information about a venue. On success, the sent Message is returned.
 */
export type sendVenue = (params: SendVenueParams) => Promise<TelegramMessage>;

/**
 * Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as Document). On success, the sent Message is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
 */
export interface SendVideoParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username; required unless the message is sent as an ephemeral reply to a callback query
     */
    chat_id?: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * A JSON-serialized object containing the parameters of the ephemeral message to send
     */
    ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
    /**
     * Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data. More information on Sending Files »
     */
    video: TelegramInputFile | string;
    /**
     * Duration of sent video in seconds
     */
    duration?: number;
    /**
     * Video width
     */
    width?: number;
    /**
     * Video height
     */
    height?: number;
    /**
     * Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files »
     */
    thumbnail?: TelegramInputFile | string;
    /**
     * Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files »
     */
    cover?: TelegramInputFile | string;
    /**
     * Start timestamp for the video in the message
     */
    start_timestamp?: number;
    /**
     * Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Mode for parsing entities in the video caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Pass True if the caption must be shown above the message media
     */
    show_caption_above_media?: boolean;
    /**
     * Pass True if the video needs to be covered with a spoiler animation
     */
    has_spoiler?: boolean;
    /**
     * Pass True if the uploaded video is suitable for streaming
     */
    supports_streaming?: boolean;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.
     */
    suggested_post_parameters?: TelegramSuggestedPostParameters;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as Document). On success, the sent Message is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
 */
export type sendVideo = (params: SendVideoParams) => Promise<TelegramMessage>;

/**
 * Use this method to send a rounded square MPEG4 video of up to 1 minute long. On success, the sent Message is returned.
 */
export interface SendVideoNoteParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username; required unless the message is sent as an ephemeral reply to a callback query
     */
    chat_id?: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * A JSON-serialized object containing the parameters of the ephemeral message to send
     */
    ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
    /**
     * Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. More information on Sending Files ». Sending video notes by a URL is currently unsupported.
     */
    video_note: TelegramInputFile | string;
    /**
     * Duration of sent video in seconds
     */
    duration?: number;
    /**
     * Video width and height, i.e. diameter of the video message
     */
    length?: number;
    /**
     * Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files »
     */
    thumbnail?: TelegramInputFile | string;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.
     */
    suggested_post_parameters?: TelegramSuggestedPostParameters;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to send a rounded square MPEG4 video of up to 1 minute long. On success, the sent Message is returned.
 */
export type sendVideoNote = (params: SendVideoNoteParams) => Promise<TelegramMessage>;

/**
 * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS, or in .MP3 format, or in .M4A format (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
 */
export interface SendVoiceParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username; required unless the message is sent as an ephemeral reply to a callback query
     */
    chat_id?: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat
     */
    direct_messages_topic_id?: number;
    /**
     * A JSON-serialized object containing the parameters of the ephemeral message to send
     */
    ephemeral_message_parameters?: TelegramEphemeralMessageParameters;
    /**
     * Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files »
     */
    voice: TelegramInputFile | string;
    /**
     * Voice message caption, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Mode for parsing entities in the voice message caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Duration of the voice message in seconds
     */
    duration?: number;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.
     */
    suggested_post_parameters?: TelegramSuggestedPostParameters;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS, or in .MP3 format, or in .M4A format (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
 */
export type sendVoice = (params: SendVoiceParams) => Promise<TelegramMessage>;

/**
 * Use this method to send a message with an HTML widget. Currently, in the production environment, widgets can be sent only to private chats, and sent widgets automatically have protected content and therefore can't be forwarded. On success, the sent Message is returned.
 */
export interface SendWidgetParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only
     */
    message_thread_id?: number;
    /**
     * HTML code of the widget, 1-32768 bytes. The code must not exceed 4096 bytes when compressed by zlib with the maximum compression level.
     */
    html: string;
    /**
     * Width of the widget in logical pixels; omit if the widget must occupy the whole width of the message bubble. The width is clamped by the app to the range from 200 to the maximum width of the message bubble.
     */
    width?: number;
    /**
     * Height of the widget in logical pixels; omit if the height of the widget isn't fixed. The height is clamped by the app to the range 50-600.
     */
    height?: number;
    /**
     * Public data of the widget, 0-1024 bytes, which will be available wherever the widget is shown. If the widget is shared, then all messages with it will have the same public data.
     */
    public_data?: string;
    /**
     * Data of the widget, which is specific to the message, 0-1024 bytes
     */
    chat_data?: string;
    /**
     * Widget caption, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Mode for parsing entities in the widget caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Pass True if the caption must be shown above the widget
     */
    show_caption_above_media?: boolean;
    /**
     * Pass True to allow the widget to send queries to the bot
     */
    allow_queries?: boolean;
    /**
     * Pass True to create a shared widget, which can be sent again using the method sendSharedWidget
     */
    is_shared?: boolean;
    /**
     * Sends the message silently. Users will receive a notification with no sound.
     */
    disable_notification?: boolean;
    /**
     * Protects the contents of the sent message from forwarding and saving
     */
    protect_content?: boolean;
    /**
     * Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.
     */
    allow_paid_broadcast?: boolean;
    /**
     * Unique identifier of the message effect to be added to the message; for private chats only
     */
    message_effect_id?: string;
    /**
     * Description of the message to reply to
     */
    reply_parameters?: TelegramReplyParameters;
    /**
     * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.
     */
    reply_markup?: (TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply) | {
        toJSON: () => TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup | TelegramReplyKeyboardRemove | TelegramForceReply;
    };
}

/**
 * Use this method to send a message with an HTML widget. Currently, in the production environment, widgets can be sent only to private chats, and sent widgets automatically have protected content and therefore can't be forwarded. On success, the sent Message is returned.
 */
export type sendWidget = (params: SendWidgetParams) => Promise<TelegramMessage>;

/**
 * Changes the bio of a managed business account. Requires the can_change_bio business bot right. Returns True on success.
 */
export interface SetBusinessAccountBioParams {
    /**
     * Unique identifier of the business connection
     */
    business_connection_id: string;
    /**
     * The new value of the bio for the business account; 0-140 characters
     */
    bio?: string;
}

/**
 * Changes the bio of a managed business account. Requires the can_change_bio business bot right. Returns True on success.
 */
export type setBusinessAccountBio = (params: SetBusinessAccountBioParams) => Promise<true>;

/**
 * Changes the privacy settings pertaining to incoming gifts in a managed business account. Requires the can_change_gift_settings business bot right. Returns True on success.
 */
export interface SetBusinessAccountGiftSettingsParams {
    /**
     * Unique identifier of the business connection
     */
    business_connection_id: string;
    /**
     * Pass True if a button for sending a gift to the user or by the business account must always be shown in the input field
     */
    show_gift_button: boolean;
    /**
     * Types of gifts accepted by the business account
     */
    accepted_gift_types: TelegramAcceptedGiftTypes;
}

/**
 * Changes the privacy settings pertaining to incoming gifts in a managed business account. Requires the can_change_gift_settings business bot right. Returns True on success.
 */
export type setBusinessAccountGiftSettings = (params: SetBusinessAccountGiftSettingsParams) => Promise<true>;

/**
 * Changes the first and last name of a managed business account. Requires the can_change_name business bot right. Returns True on success.
 */
export interface SetBusinessAccountNameParams {
    /**
     * Unique identifier of the business connection
     */
    business_connection_id: string;
    /**
     * The new value of the first name for the business account; 1-64 characters
     */
    first_name: string;
    /**
     * The new value of the last name for the business account; 0-64 characters
     */
    last_name?: string;
}

/**
 * Changes the first and last name of a managed business account. Requires the can_change_name business bot right. Returns True on success.
 */
export type setBusinessAccountName = (params: SetBusinessAccountNameParams) => Promise<true>;

/**
 * Changes the profile photo of a managed business account. Requires the can_edit_profile_photo business bot right. Returns True on success.
 */
export interface SetBusinessAccountProfilePhotoParams {
    /**
     * Unique identifier of the business connection
     */
    business_connection_id: string;
    /**
     * The new profile photo to set
     */
    photo: TelegramInputProfilePhoto;
    /**
     * Pass True to set the public photo, which will be visible even if the main photo is hidden by the business account's privacy settings. An account can have only one public photo.
     */
    is_public?: boolean;
}

/**
 * Changes the profile photo of a managed business account. Requires the can_edit_profile_photo business bot right. Returns True on success.
 */
export type setBusinessAccountProfilePhoto = (params: SetBusinessAccountProfilePhotoParams) => Promise<true>;

/**
 * Changes the username of a managed business account. Requires the can_change_username business bot right. Returns True on success.
 */
export interface SetBusinessAccountUsernameParams {
    /**
     * Unique identifier of the business connection
     */
    business_connection_id: string;
    /**
     * The new value of the username for the business account; 0-32 characters
     */
    username?: string;
}

/**
 * Changes the username of a managed business account. Requires the can_change_username business bot right. Returns True on success.
 */
export type setBusinessAccountUsername = (params: SetBusinessAccountUsernameParams) => Promise<true>;

/**
 * Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns True on success.
 */
export interface SetChatAdministratorCustomTitleParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     */
    user_id: number;
    /**
     * New custom title for the administrator; 0-16 characters, emoji are not allowed
     */
    custom_title: string;
}

/**
 * Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns True on success.
 */
export type setChatAdministratorCustomTitle = (params: SetChatAdministratorCustomTitleParams) => Promise<true>;

/**
 * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
 */
export interface SetChatDescriptionParams {
    /**
     * Unique identifier for the target chat or username of the target channel in the format @username
     */
    chat_id: number | string;
    /**
     * New chat description, 0-255 characters
     */
    description?: string;
}

/**
 * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
 */
export type setChatDescription = (params: SetChatDescriptionParams) => Promise<true>;

/**
 * Use this method to set a tag for a regular member in a group or a supergroup. The bot must be an administrator in the chat for this to work and must have the can_manage_tags administrator right. Returns True on success.
 */
export interface SetChatMemberTagParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     */
    user_id: number;
    /**
     * New tag for the member; 0-16 characters, emoji are not allowed
     */
    tag?: string;
}

/**
 * Use this method to set a tag for a regular member in a group or a supergroup. The bot must be an administrator in the chat for this to work and must have the can_manage_tags administrator right. Returns True on success.
 */
export type setChatMemberTag = (params: SetChatMemberTagParams) => Promise<true>;

/**
 * Use this method to change the bot's menu button in a private chat, or the default menu button. Returns True on success.
 */
export interface SetChatMenuButtonParams {
    /**
     * Unique identifier for the target private chat. If not specified, the bot's default menu button will be changed.
     */
    chat_id?: number;
    /**
     * A JSON-serialized object for the bot's new menu button. Defaults to MenuButtonDefault.
     */
    menu_button?: TelegramMenuButton;
}

/**
 * Use this method to change the bot's menu button in a private chat, or the default menu button. Returns True on success.
 */
export type setChatMenuButton = (params: SetChatMenuButtonParams) => Promise<true>;

/**
 * Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members administrator rights. Returns True on success.
 */
export interface SetChatPermissionsParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * A JSON-serialized object for new default chat permissions
     */
    permissions: TelegramChatPermissions;
    /**
     * Pass True if chat permissions are set independently. Otherwise, the can_send_other_messages and can_add_web_page_previews permissions will imply the can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, and can_send_voice_notes permissions; the can_send_polls permission will imply the can_send_messages permission.
     */
    use_independent_chat_permissions?: boolean;
}

/**
 * Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members administrator rights. Returns True on success.
 */
export type setChatPermissions = (params: SetChatPermissionsParams) => Promise<true>;

/**
 * Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
 */
export interface SetChatPhotoParams {
    /**
     * Unique identifier for the target chat or username of the target channel in the format @username
     */
    chat_id: number | string;
    /**
     * New chat photo, uploaded using multipart/form-data
     */
    photo: TelegramInputFile;
}

/**
 * Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
 */
export type setChatPhoto = (params: SetChatPhotoParams) => Promise<true>;

/**
 * Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method. Returns True on success.
 */
export interface SetChatStickerSetParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * Name of the sticker set to be set as the group sticker set
     */
    sticker_set_name: string;
}

/**
 * Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method. Returns True on success.
 */
export type setChatStickerSet = (params: SetChatStickerSetParams) => Promise<true>;

/**
 * Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
 */
export interface SetChatTitleParams {
    /**
     * Unique identifier for the target chat or username of the target channel in the format @username
     */
    chat_id: number | string;
    /**
     * New chat title, 1-128 characters
     */
    title: string;
}

/**
 * Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
 */
export type setChatTitle = (params: SetChatTitleParams) => Promise<true>;

/**
 * Use this method to set the thumbnail of a custom emoji sticker set. Returns True on success.
 */
export interface SetCustomEmojiStickerSetThumbnailParams {
    /**
     * Sticker set name
     */
    name: string;
    /**
     * Custom emoji identifier of a sticker from the sticker set; pass an empty string to drop the thumbnail and use the first sticker as the thumbnail
     */
    custom_emoji_id?: string;
}

/**
 * Use this method to set the thumbnail of a custom emoji sticker set. Returns True on success.
 */
export type setCustomEmojiStickerSetThumbnail = (params: SetCustomEmojiStickerSetThumbnailParams) => Promise<true>;

/**
 * Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the Message is returned, otherwise True is returned. Returns an error, if the new score is not greater than the user's current score in the chat and force is False.
 */
export interface SetGameScoreParams {
    /**
     * User identifier
     */
    user_id: number;
    /**
     * New score, must be non-negative
     */
    score: number;
    /**
     * Pass True if the high score is allowed to decrease. This can be useful when fixing mistakes or banning cheaters.
     */
    force?: boolean;
    /**
     * Pass True if the game message should not be automatically edited to include the current scoreboard
     */
    disable_edit_message?: boolean;
    /**
     * Required if inline_message_id is not specified. Unique identifier for the target chat.
     */
    chat_id?: number;
    /**
     * Required if inline_message_id is not specified. Identifier of the sent message.
     */
    message_id?: number;
    /**
     * Required if chat_id and message_id are not specified. Identifier of the inline message.
     */
    inline_message_id?: string;
}

/**
 * Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the Message is returned, otherwise True is returned. Returns an error, if the new score is not greater than the user's current score in the chat and force is False.
 */
export type setGameScore = (params: SetGameScoreParams) => Promise<TelegramMessage>;

/**
 * Use this method to change the access settings of a managed bot. Returns True on success.
 */
export interface SetManagedBotAccessSettingsParams {
    /**
     * User identifier of the managed bot whose access settings will be changed
     */
    user_id: number;
    /**
     * Pass True if only selected users can access the bot. The bot's owner can always access it.
     */
    is_access_restricted: boolean;
    /**
     * A JSON-serialized list of up to 10 identifiers of users who will have access to the bot in addition to its owner. Ignored if is_access_restricted is False.
     */
    added_user_ids?: number[];
}

/**
 * Use this method to change the access settings of a managed bot. Returns True on success.
 */
export type setManagedBotAccessSettings = (params: SetManagedBotAccessSettingsParams) => Promise<true>;

/**
 * Use this method to change the chosen reactions on a message. Service messages of some types can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can't use paid reactions. Returns True on success.
 */
export interface SetMessageReactionParams {
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username
     */
    chat_id: number | string;
    /**
     * Identifier of the target message. If the message belongs to a media group, the reaction is set to the first non-deleted message in the group instead.
     */
    message_id: number;
    /**
     * A JSON-serialized list of reaction types to set on the message. Currently, as non-premium users, bots can set up to one reaction per message. A custom emoji reaction can be used if it is either already present on the message or explicitly allowed by chat administrators. Paid reactions can't be used by bots.
     */
    reaction?: TelegramReactionType[];
    /**
     * Pass True to set the reaction with a big animation
     */
    is_big?: boolean;
}

/**
 * Use this method to change the chosen reactions on a message. Service messages of some types can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can't use paid reactions. Returns True on success.
 */
export type setMessageReaction = (params: SetMessageReactionParams) => Promise<true>;

/**
 * Use this method to change the list of the bot's commands. See this manual for more details about bot commands. Returns True on success.
 */
export interface SetMyCommandsParams {
    /**
     * A JSON-serialized list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified.
     */
    commands: TelegramBotCommand[];
    /**
     * A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault.
     */
    scope?: TelegramBotCommandScope;
    /**
     * A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands.
     */
    language_code?: string;
}

/**
 * Use this method to change the list of the bot's commands. See this manual for more details about bot commands. Returns True on success.
 */
export type setMyCommands = (params: SetMyCommandsParams) => Promise<true>;

/**
 * Use this method to change the default administrator rights requested by the bot when it's added as an administrator to groups or channels. These rights will be suggested to users, but they are free to modify the list before adding the bot. Returns True on success.
 */
export interface SetMyDefaultAdministratorRightsParams {
    /**
     * A JSON-serialized object describing new default administrator rights. If not specified, the default administrator rights will be cleared.
     */
    rights?: TelegramChatAdministratorRights;
    /**
     * Pass True to change the default administrator rights of the bot in channels. Otherwise, the default administrator rights of the bot for groups and supergroups will be changed.
     */
    for_channels?: boolean;
}

/**
 * Use this method to change the default administrator rights requested by the bot when it's added as an administrator to groups or channels. These rights will be suggested to users, but they are free to modify the list before adding the bot. Returns True on success.
 */
export type setMyDefaultAdministratorRights = (params: SetMyDefaultAdministratorRightsParams) => Promise<true>;

/**
 * Use this method to change the bot's description, which is shown in the chat with the bot if the chat is empty. Returns True on success.
 */
export interface SetMyDescriptionParams {
    /**
     * New bot description; 0-512 characters. Pass an empty string to remove the dedicated description for the given language.
     */
    description?: string;
    /**
     * A two-letter ISO 639-1 language code. If empty, the description will be applied to all users for whose language there is no dedicated description.
     */
    language_code?: string;
}

/**
 * Use this method to change the bot's description, which is shown in the chat with the bot if the chat is empty. Returns True on success.
 */
export type setMyDescription = (params: SetMyDescriptionParams) => Promise<true>;

/**
 * Use this method to change the bot's name. Returns True on success.
 */
export interface SetMyNameParams {
    /**
     * New bot name; 0-64 characters. Pass an empty string to remove the dedicated name for the given language.
     */
    name?: string;
    /**
     * A two-letter ISO 639-1 language code. If empty, the name will be shown to all users for whose language there is no dedicated name.
     */
    language_code?: string;
}

/**
 * Use this method to change the bot's name. Returns True on success.
 */
export type setMyName = (params: SetMyNameParams) => Promise<true>;

/**
 * Changes the profile photo of the bot. Returns True on success.
 */
export interface SetMyProfilePhotoParams {
    /**
     * The new profile photo to set
     */
    photo: TelegramInputProfilePhoto;
}

/**
 * Changes the profile photo of the bot. Returns True on success.
 */
export type setMyProfilePhoto = (params: SetMyProfilePhotoParams) => Promise<true>;

/**
 * Use this method to change the bot's short description, which is shown on the bot's profile page and is sent together with the link when users share the bot. Returns True on success.
 */
export interface SetMyShortDescriptionParams {
    /**
     * New short description for the bot; 0-120 characters. Pass an empty string to remove the dedicated short description for the given language.
     */
    short_description?: string;
    /**
     * A two-letter ISO 639-1 language code. If empty, the short description will be applied to all users for whose language there is no dedicated short description.
     */
    language_code?: string;
}

/**
 * Use this method to change the bot's short description, which is shown on the bot's profile page and is sent together with the link when users share the bot. Returns True on success.
 */
export type setMyShortDescription = (params: SetMyShortDescriptionParams) => Promise<true>;

/**
 * Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns True on success.
 * Use this if the data submitted by the user doesn't satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues.
 */
export interface SetPassportDataErrorsParams {
    /**
     * User identifier
     */
    user_id: number;
    /**
     * A JSON-serialized Array describing the errors
     */
    errors: TelegramPassportElementError[];
}

/**
 * Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns True on success.
 * Use this if the data submitted by the user doesn't satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues.
 */
export type setPassportDataErrors = (params: SetPassportDataErrorsParams) => Promise<true>;

/**
 * Use this method to change the list of emoji assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns True on success.
 */
export interface SetStickerEmojiListParams {
    /**
     * File identifier of the sticker
     */
    sticker: string;
    /**
     * A JSON-serialized list of 1-20 emoji associated with the sticker
     */
    emoji_list: string[];
}

/**
 * Use this method to change the list of emoji assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns True on success.
 */
export type setStickerEmojiList = (params: SetStickerEmojiListParams) => Promise<true>;

/**
 * Use this method to change search keywords assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns True on success.
 */
export interface SetStickerKeywordsParams {
    /**
     * File identifier of the sticker
     */
    sticker: string;
    /**
     * A JSON-serialized list of 0-20 search keywords for the sticker with total length of up to 64 characters
     */
    keywords?: string[];
}

/**
 * Use this method to change search keywords assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns True on success.
 */
export type setStickerKeywords = (params: SetStickerKeywordsParams) => Promise<true>;

/**
 * Use this method to change the mask position of a mask sticker. The sticker must belong to a sticker set that was created by the bot. Returns True on success.
 */
export interface SetStickerMaskPositionParams {
    /**
     * File identifier of the sticker
     */
    sticker: string;
    /**
     * A JSON-serialized object with the position where the mask should be placed on faces. Omit the parameter to remove the mask position.
     */
    mask_position?: TelegramMaskPosition;
}

/**
 * Use this method to change the mask position of a mask sticker. The sticker must belong to a sticker set that was created by the bot. Returns True on success.
 */
export type setStickerMaskPosition = (params: SetStickerMaskPositionParams) => Promise<true>;

/**
 * Use this method to move a sticker in a set created by the bot to a specific position. Returns True on success.
 */
export interface SetStickerPositionInSetParams {
    /**
     * File identifier of the sticker
     */
    sticker: string;
    /**
     * New sticker position in the set, zero-based
     */
    position: number;
}

/**
 * Use this method to move a sticker in a set created by the bot to a specific position. Returns True on success.
 */
export type setStickerPositionInSet = (params: SetStickerPositionInSetParams) => Promise<true>;

/**
 * Use this method to set the thumbnail of a regular or mask sticker set. The format of the thumbnail file must match the format of the stickers in the set. Returns True on success.
 */
export interface SetStickerSetThumbnailParams {
    /**
     * Sticker set name
     */
    name: string;
    /**
     * User identifier of the sticker set owner
     */
    user_id: number;
    /**
     * A .WEBP or .PNG image with the thumbnail, must be up to 128 kilobytes in size and have a width and height of exactly 100px, or a .TGS animation with a thumbnail up to 32 kilobytes in size (see https://core.telegram.org/stickers#animation-requirements for animated sticker technical requirements), or a .WEBM video with the thumbnail up to 32 kilobytes in size; see https://core.telegram.org/stickers#video-requirements for video sticker technical requirements. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files ». Animated and video sticker set thumbnails can't be uploaded via HTTP URL. If omitted, then the thumbnail is dropped and the first sticker is used as the thumbnail.
     */
    thumbnail?: TelegramInputFile | string;
    /**
     * Format of the thumbnail, must be one of “static” for a .WEBP or .PNG image, “animated” for a .TGS animation, or “video” for a .WEBM video
     */
    format: "static" | "animated" | "video";
}

/**
 * Use this method to set the thumbnail of a regular or mask sticker set. The format of the thumbnail file must match the format of the stickers in the set. Returns True on success.
 */
export type setStickerSetThumbnail = (params: SetStickerSetThumbnailParams) => Promise<true>;

/**
 * Use this method to set the title of a created sticker set. Returns True on success.
 */
export interface SetStickerSetTitleParams {
    /**
     * Sticker set name
     */
    name: string;
    /**
     * Sticker set title, 1-64 characters
     */
    title: string;
}

/**
 * Use this method to set the title of a created sticker set. Returns True on success.
 */
export type setStickerSetTitle = (params: SetStickerSetTitleParams) => Promise<true>;

/**
 * Changes the emoji status for a given user that previously allowed the bot to manage their emoji status via the Mini App method requestEmojiStatusAccess. Returns True on success.
 */
export interface SetUserEmojiStatusParams {
    /**
     * Unique identifier of the target user
     */
    user_id: number;
    /**
     * Custom emoji identifier of the emoji status to set. Pass an empty string to remove the status.
     */
    emoji_status_custom_emoji_id?: string;
    /**
     * Expiration date of the emoji status, if any
     */
    emoji_status_expiration_date?: number;
}

/**
 * Changes the emoji status for a given user that previously allowed the bot to manage their emoji status via the Mini App method requestEmojiStatusAccess. Returns True on success.
 */
export type setUserEmojiStatus = (params: SetUserEmojiStatusParams) => Promise<true>;

/**
 * Use this method to specify a URL and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified URL, containing a JSON-serialized Update. In case of an unsuccessful request (a request with response HTTP status code different from 2XY), we will repeat the request and give up after a reasonable amount of attempts. Returns True on success.
 * If you'd like to make sure that the webhook was set by you, you can specify secret data in the parameter secret_token. If specified, the request will contain a header “X-Telegram-Bot-Api-Secret-Token” with the secret token as content.
 */
export interface SetWebhookParams {
    /**
     * HTTPS URL to send updates to. Use an empty string to remove webhook integration.
     */
    url: string;
    /**
     * Upload your public key certificate so that the root certificate in use can be checked. See our self-signed guide for details.
     */
    certificate?: TelegramInputFile;
    /**
     * The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS
     */
    ip_address?: string;
    /**
     * The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to 40. Use lower values to limit the load on your bot's server, and higher values to increase your bot's throughput.
     */
    max_connections?: number;
    /**
     * A JSON-serialized list of the update types you want your bot to receive. For example, specify ["message", "edited_channel_post", "callback_query"] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member, message_reaction, and message_reaction_count (default). If not specified, the previous setting will be used.Please note that this parameter doesn't affect updates created before the call to the setWebhook, so unwanted updates may be received for a short period of time.
     */
    allowed_updates?: string[];
    /**
     * Pass True to drop all pending updates
     */
    drop_pending_updates?: boolean;
    /**
     * A secret token to be sent in a header “X-Telegram-Bot-Api-Secret-Token” in every webhook request, 1-256 characters. Only characters A-Z, a-z, 0-9, _ and - are allowed. The header is useful to ensure that the request comes from a webhook set by you.
     */
    secret_token?: string;
}

/**
 * Use this method to specify a URL and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified URL, containing a JSON-serialized Update. In case of an unsuccessful request (a request with response HTTP status code different from 2XY), we will repeat the request and give up after a reasonable amount of attempts. Returns True on success.
 * If you'd like to make sure that the webhook was set by you, you can specify secret data in the parameter secret_token. If specified, the request will contain a header “X-Telegram-Bot-Api-Secret-Token” with the secret token as content.
 */
export type setWebhook = (params: SetWebhookParams) => Promise<true>;

/**
 * Use this method to stop updating a live location message before live_period expires. On success, if the message is not an inline message, the edited Message is returned, otherwise True is returned.
 */
export interface StopMessageLiveLocationParams {
    /**
     * Unique identifier of the business connection on behalf of which the message to be edited was sent
     */
    business_connection_id?: string;
    /**
     * Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username.
     */
    chat_id?: number | string;
    /**
     * Required if inline_message_id is not specified. Identifier of the message with live location to stop.
     */
    message_id?: number;
    /**
     * Required if chat_id and message_id are not specified. Identifier of the inline message.
     */
    inline_message_id?: string;
    /**
     * A JSON-serialized object for a new inline keyboard
     */
    reply_markup?: TelegramInlineKeyboardMarkup | {
        toJSON: () => TelegramInlineKeyboardMarkup;
    };
}

/**
 * Use this method to stop updating a live location message before live_period expires. On success, if the message is not an inline message, the edited Message is returned, otherwise True is returned.
 */
export type stopMessageLiveLocation = (params: StopMessageLiveLocationParams) => Promise<TelegramMessage>;

/**
 * Use this method to stop a poll which was sent by the bot. On success, the stopped Poll is returned.
 */
export interface StopPollParams {
    /**
     * Unique identifier of the business connection on behalf of which the message to be edited was sent
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username
     */
    chat_id: number | string;
    /**
     * Identifier of the original message with the poll
     */
    message_id: number;
    /**
     * A JSON-serialized object for a new message inline keyboard
     */
    reply_markup?: TelegramInlineKeyboardMarkup | {
        toJSON: () => TelegramInlineKeyboardMarkup;
    };
}

/**
 * Use this method to stop a poll which was sent by the bot. On success, the stopped Poll is returned.
 */
export type stopPoll = (params: StopPollParams) => Promise<TelegramPoll>;

/**
 * Transfers Telegram Stars from the business account balance to the bot's balance. Requires the can_transfer_stars business bot right. Returns True on success.
 */
export interface TransferBusinessAccountStarsParams {
    /**
     * Unique identifier of the business connection
     */
    business_connection_id: string;
    /**
     * Number of Telegram Stars to transfer; 1-10000
     */
    star_count: number;
}

/**
 * Transfers Telegram Stars from the business account balance to the bot's balance. Requires the can_transfer_stars business bot right. Returns True on success.
 */
export type transferBusinessAccountStars = (params: TransferBusinessAccountStarsParams) => Promise<true>;

/**
 * Transfers an owned unique gift to another user. Requires the can_transfer_and_upgrade_gifts business bot right. Requires can_transfer_stars business bot right if the transfer is paid. Returns True on success.
 */
export interface TransferGiftParams {
    /**
     * Unique identifier of the business connection
     */
    business_connection_id: string;
    /**
     * Unique identifier of the regular gift that should be transferred
     */
    owned_gift_id: string;
    /**
     * Unique identifier of the chat which will own the gift. The chat must be active in the last 24 hours.
     */
    new_owner_chat_id: number;
    /**
     * The amount of Telegram Stars that will be paid for the transfer from the business account balance. If positive, then the can_transfer_stars business bot right is required.
     */
    star_count?: number;
}

/**
 * Transfers an owned unique gift to another user. Requires the can_transfer_and_upgrade_gifts business bot right. Requires can_transfer_stars business bot right if the transfer is paid. Returns True on success.
 */
export type transferGift = (params: TransferGiftParams) => Promise<true>;

/**
 * Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be removed from the chat. If you don't want this, use the parameter only_if_banned. Returns True on success.
 */
export interface UnbanChatMemberParams {
    /**
     * Unique identifier for the target group or username of the target supergroup or channel in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     */
    user_id: number;
    /**
     * Do nothing if the user is not banned
     */
    only_if_banned?: boolean;
}

/**
 * Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be removed from the chat. If you don't want this, use the parameter only_if_banned. Returns True on success.
 */
export type unbanChatMember = (params: UnbanChatMemberParams) => Promise<true>;

/**
 * Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns True on success.
 */
export interface UnbanChatSenderChatParams {
    /**
     * Unique identifier for the target chat or username of the target channel in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier of the target sender chat
     */
    sender_chat_id: number;
}

/**
 * Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns True on success.
 */
export type unbanChatSenderChat = (params: UnbanChatSenderChatParams) => Promise<true>;

/**
 * Use this method to unhide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.
 */
export interface UnhideGeneralForumTopicParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
}

/**
 * Use this method to unhide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.
 */
export type unhideGeneralForumTopic = (params: UnhideGeneralForumTopicParams) => Promise<true>;

/**
 * Use this method to clear the list of pinned messages in a chat. In private chats and channel direct messages chats, no additional rights are required to unpin all pinned messages. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin all pinned messages in groups and channels respectively. Returns True on success.
 */
export interface UnpinAllChatMessagesParams {
    /**
     * Unique identifier for the target chat or username of the target channel in the format @username
     */
    chat_id: number | string;
}

/**
 * Use this method to clear the list of pinned messages in a chat. In private chats and channel direct messages chats, no additional rights are required to unpin all pinned messages. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin all pinned messages in groups and channels respectively. Returns True on success.
 */
export type unpinAllChatMessages = (params: UnpinAllChatMessagesParams) => Promise<true>;

/**
 * Use this method to clear the list of pinned messages in a forum topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success.
 */
export interface UnpinAllForumTopicMessagesParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
    /**
     * Unique identifier for the target message thread of the forum topic
     */
    message_thread_id: number;
}

/**
 * Use this method to clear the list of pinned messages in a forum topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success.
 */
export type unpinAllForumTopicMessages = (params: UnpinAllForumTopicMessagesParams) => Promise<true>;

/**
 * Use this method to clear the list of pinned messages in a General forum topic. The bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success.
 */
export interface UnpinAllGeneralForumTopicMessagesParams {
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username
     */
    chat_id: number | string;
}

/**
 * Use this method to clear the list of pinned messages in a General forum topic. The bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success.
 */
export type unpinAllGeneralForumTopicMessages = (params: UnpinAllGeneralForumTopicMessagesParams) => Promise<true>;

/**
 * Use this method to remove a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin messages in groups and channels respectively. Returns True on success.
 */
export interface UnpinChatMessageParams {
    /**
     * Unique identifier of the business connection on behalf of which the message will be unpinned
     */
    business_connection_id?: string;
    /**
     * Unique identifier for the target chat or username of the target channel in the format @username
     */
    chat_id: number | string;
    /**
     * Identifier of the message to unpin. Required if business_connection_id is specified. If not specified, the most recent pinned message (by sending date) will be unpinned.
     */
    message_id?: number;
}

/**
 * Use this method to remove a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin messages in groups and channels respectively. Returns True on success.
 */
export type unpinChatMessage = (params: UnpinChatMessageParams) => Promise<true>;

/**
 * Upgrades a given regular gift to a unique gift. Requires the can_transfer_and_upgrade_gifts business bot right. Additionally requires the can_transfer_stars business bot right if the upgrade is paid. Returns True on success.
 */
export interface UpgradeGiftParams {
    /**
     * Unique identifier of the business connection
     */
    business_connection_id: string;
    /**
     * Unique identifier of the regular gift that should be upgraded to a unique one
     */
    owned_gift_id: string;
    /**
     * Pass True to keep the original gift text, sender and receiver in the upgraded gift
     */
    keep_original_details?: boolean;
    /**
     * The amount of Telegram Stars that will be paid for the upgrade from the business account balance. If gift.prepaid_upgrade_star_count > 0, then pass 0, otherwise, the can_transfer_stars business bot right is required and gift.upgrade_star_count must be passed.
     */
    star_count?: number;
}

/**
 * Upgrades a given regular gift to a unique gift. Requires the can_transfer_and_upgrade_gifts business bot right. Additionally requires the can_transfer_stars business bot right if the upgrade is paid. Returns True on success.
 */
export type upgradeGift = (params: UpgradeGiftParams) => Promise<true>;

/**
 * Use this method to upload a file with a sticker for later use in the createNewStickerSet, addStickerToSet, or replaceStickerInSet methods (the file can be used multiple times). Returns the uploaded File on success.
 */
export interface UploadStickerFileParams {
    /**
     * User identifier of sticker file owner
     */
    user_id: number;
    /**
     * A file with the sticker in .WEBP, .PNG, .TGS, or .WEBM format. See https://core.telegram.org/stickers for technical requirements. More information on Sending Files »
     */
    sticker: TelegramInputFile;
    /**
     * Format of the sticker, must be one of “static”, “animated”, “video”
     */
    sticker_format: "static" | "animated" | "video";
}

/**
 * Use this method to upload a file with a sticker for later use in the createNewStickerSet, addStickerToSet, or replaceStickerInSet methods (the file can be used multiple times). Returns the uploaded File on success.
 */
export type uploadStickerFile = (params: UploadStickerFileParams) => Promise<TelegramFile>;

/**
 * Verifies a chat on behalf of the organization which is represented by the bot. Returns True on success.
 */
export interface VerifyChatParams {
    /**
     * Unique identifier for the target chat or username of the target bot, supergroup, or channel in the format @username. Channel direct messages chats can't be verified.
     */
    chat_id: number | string;
    /**
     * Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description.
     */
    custom_description?: string | Formattable;
    /**
     * Mode for parsing entities in the custom description. See formatting options for more details. Only “text_link” entities are supported.
     */
    custom_description_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the custom description, which can be specified instead of custom_description_parse_mode. Only “text_link” entities are supported.
     */
    custom_description_entities?: TelegramMessageEntity[];
}

/**
 * Verifies a chat on behalf of the organization which is represented by the bot. Returns True on success.
 */
export type verifyChat = (params: VerifyChatParams) => Promise<true>;

/**
 * Verifies a user on behalf of the organization which is represented by the bot. Returns True on success.
 */
export interface VerifyUserParams {
    /**
     * Unique identifier of the target user
     */
    user_id: number;
    /**
     * Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description.
     */
    custom_description?: string | Formattable;
    /**
     * Mode for parsing entities in the custom description. See formatting options for more details. Only “text_link” entities are supported.
     */
    custom_description_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * A JSON-serialized list of special entities that appear in the custom description, which can be specified instead of custom_description_parse_mode. Only “text_link” entities are supported.
     */
    custom_description_entities?: TelegramMessageEntity[];
}

/**
 * Verifies a user on behalf of the organization which is represented by the bot. Returns True on success.
 */
export type verifyUser = (params: VerifyUserParams) => Promise<true>;