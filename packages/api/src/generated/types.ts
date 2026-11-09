/// AUTO-GENERATED FILE — do not edit by hand
/// Bot API 10.4
/// source: https://core.telegram.org/bots/api
/// generated at: 2026-11-09T13:32:34.299Z
/// see scripts/emit.ts in @puregram/api

import type { Formattable } from "../formattable";
/**
 * This object describes the types of gifts that can be gifted to a user or a chat.
 */
export interface TelegramAcceptedGiftTypes {
    /**
     * True, if unlimited regular gifts are accepted
     */
    unlimited_gifts: boolean;
    /**
     * True, if limited regular gifts are accepted
     */
    limited_gifts: boolean;
    /**
     * True, if unique gifts or gifts that can be upgraded to unique for free are accepted
     */
    unique_gifts: boolean;
    /**
     * True, if a Telegram Premium subscription is accepted
     */
    premium_subscription: boolean;
    /**
     * True, if transfers of unique gifts from channels are accepted
     */
    gifts_from_channels: boolean;
}

/**
 * Contains information about the affiliate that received a commission via this transaction.
 */
export interface TelegramAffiliateInfo {
    /**
     * Optional. The bot or the user that received an affiliate commission if it was received by a bot or a user
     */
    affiliate_user?: TelegramUser;
    /**
     * Optional. The chat that received an affiliate commission if it was received by a chat
     */
    affiliate_chat?: TelegramChat;
    /**
     * The number of Telegram Stars received by the affiliate for each 1000 Telegram Stars received by the bot from referred users
     */
    commission_per_mille: number;
    /**
     * Integer amount of Telegram Stars received by the affiliate from the transaction, rounded to 0; can be negative for refunds
     */
    amount: number;
    /**
     * Optional. The number of 1/1000000000 shares of Telegram Stars received by the affiliate; from -999999999 to 999999999; can be negative for refunds
     */
    nanostar_amount?: number;
}

/**
 * This object represents an animation file (GIF or H.264/MPEG-4 AVC video without sound).
 */
export interface TelegramAnimation {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    file_unique_id: string;
    /**
     * Video width as defined by the sender
     */
    width: number;
    /**
     * Video height as defined by the sender
     */
    height: number;
    /**
     * Duration of the video in seconds as defined by the sender
     */
    duration: number;
    /**
     * Optional. Animation thumbnail as defined by the sender
     */
    thumbnail?: TelegramPhotoSize;
    /**
     * Optional. Original animation filename as defined by the sender
     */
    file_name?: string;
    /**
     * Optional. MIME type of the file as defined by the sender
     */
    mime_type?: string;
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     */
    file_size?: number;
}

/**
 * Describes the position of a rectangle area on a story media or a TON wallet card.
 */
export interface TelegramAreaPosition {
    /**
     * The abscissa of the area's center, as a percentage of the media or the card width
     */
    x_percentage: number;
    /**
     * The ordinate of the area's center, as a percentage of the media or the card height
     */
    y_percentage: number;
    /**
     * The width of the area's rectangle, as a percentage of the media or the card width
     */
    width_percentage: number;
    /**
     * The height of the area's rectangle, as a percentage of the media or the card height
     */
    height_percentage: number;
    /**
     * The clockwise rotation angle of the rectangle, in degrees; 0-360
     */
    rotation_angle: number;
    /**
     * The radius of the rectangle corner rounding, as a percentage of the media or the card width
     */
    corner_radius_percentage: number;
}

/**
 * This object represents an audio file to be treated as music by the Telegram clients.
 */
export interface TelegramAudio {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    file_unique_id: string;
    /**
     * Duration of the audio in seconds as defined by the sender
     */
    duration: number;
    /**
     * Optional. Performer of the audio as defined by the sender or by audio tags
     */
    performer?: string;
    /**
     * Optional. Title of the audio as defined by the sender or by audio tags
     */
    title?: string;
    /**
     * Optional. Original filename as defined by the sender
     */
    file_name?: string;
    /**
     * Optional. MIME type of the file as defined by the sender
     */
    mime_type?: string;
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     */
    file_size?: number;
    /**
     * Optional. Thumbnail of the album cover to which the music file belongs
     */
    thumbnail?: TelegramPhotoSize;
}

/**
 * This object describes the way a background is filled based on the selected colors. Currently, it can be one of
 */
export type TelegramBackgroundFill = TelegramBackgroundFillSolid | TelegramBackgroundFillGradient | TelegramBackgroundFillFreeformGradient;

/**
 * The background is a freeform gradient that rotates after every message in the chat.
 */
export interface TelegramBackgroundFillFreeformGradient {
    /**
     * Type of the background fill, always “freeform_gradient”
     */
    type: "freeform_gradient";
    /**
     * A list of the 3 or 4 base colors that are used to generate the freeform gradient in the RGB24 format
     */
    colors: number[];
}

/**
 * The background is a gradient fill.
 */
export interface TelegramBackgroundFillGradient {
    /**
     * Type of the background fill, always “gradient”
     */
    type: "gradient";
    /**
     * Top color of the gradient in the RGB24 format
     */
    top_color: number;
    /**
     * Bottom color of the gradient in the RGB24 format
     */
    bottom_color: number;
    /**
     * Clockwise rotation angle of the background fill in degrees; 0-359
     */
    rotation_angle: number;
}

/**
 * The background is filled using the selected color.
 */
export interface TelegramBackgroundFillSolid {
    /**
     * Type of the background fill, always “solid”
     */
    type: "solid";
    /**
     * The color of the background fill in the RGB24 format
     */
    color: number;
}

/**
 * This object describes the type of a background. Currently, it can be one of
 */
export type TelegramBackgroundType = TelegramBackgroundTypeFill | TelegramBackgroundTypeWallpaper | TelegramBackgroundTypePattern | TelegramBackgroundTypeChatTheme;

/**
 * The background is taken directly from a built-in chat theme.
 */
export interface TelegramBackgroundTypeChatTheme {
    /**
     * Type of the background, always “chat_theme”
     */
    type: "chat_theme";
    /**
     * Name of the chat theme, which is usually an emoji
     */
    theme_name: string;
}

/**
 * The background is automatically filled based on the selected colors.
 */
export interface TelegramBackgroundTypeFill {
    /**
     * Type of the background, always “fill”
     */
    type: "fill";
    /**
     * The background fill
     */
    fill: TelegramBackgroundFill;
    /**
     * Dimming of the background in dark themes, as a percentage; 0-100
     */
    dark_theme_dimming: number;
}

/**
 * The background is a .PNG or .TGV (gzipped subset of SVG with MIME type “application/x-tgwallpattern”) pattern to be combined with the background fill chosen by the user.
 */
export interface TelegramBackgroundTypePattern {
    /**
     * Type of the background, always “pattern”
     */
    type: "pattern";
    /**
     * Document with the pattern
     */
    document: TelegramDocument;
    /**
     * The background fill that is combined with the pattern
     */
    fill: TelegramBackgroundFill;
    /**
     * Intensity of the pattern when it is shown above the filled background; 0-100
     */
    intensity: number;
    /**
     * Optional. True, if the background fill must be applied only to the pattern itself. All other pixels are black in this case. For dark themes only.
     */
    is_inverted?: true;
    /**
     * Optional. True, if the background moves slightly when the device is tilted
     */
    is_moving?: true;
}

/**
 * The background is a wallpaper in the JPEG format.
 */
export interface TelegramBackgroundTypeWallpaper {
    /**
     * Type of the background, always “wallpaper”
     */
    type: "wallpaper";
    /**
     * Document with the wallpaper
     */
    document: TelegramDocument;
    /**
     * Dimming of the background in dark themes, as a percentage; 0-100
     */
    dark_theme_dimming: number;
    /**
     * Optional. True, if the wallpaper is downscaled to fit in a 450x450 square and then box-blurred with radius 12
     */
    is_blurred?: true;
    /**
     * Optional. True, if the background moves slightly when the device is tilted
     */
    is_moving?: true;
}

/**
 * Describes the birthdate of a user.
 */
export interface TelegramBirthdate {
    /**
     * Day of the user's birth; 1-31
     */
    day: number;
    /**
     * Month of the user's birth; 1-12
     */
    month: number;
    /**
     * Optional. Year of the user's birth
     */
    year?: number;
}

/**
 * This object describes the access settings of a bot.
 */
export interface TelegramBotAccessSettings {
    /**
     * True, if only selected users can access the bot. The bot's owner can always access it.
     */
    is_access_restricted: boolean;
    /**
     * Optional. The list of other users who have access to the bot if the access is restricted
     */
    added_users?: TelegramUser[];
}

/**
 * This object represents a bot command.
 */
export interface TelegramBotCommand {
    /**
     * Text of the command; 1-32 characters. Can contain only lowercase English letters, digits and underscores.
     */
    command: string;
    /**
     * Description of the command; 1-256 characters
     */
    description: string;
    /**
     * Optional. True, if the command sends an ephemeral message, which can be seen only by the sender of the message and the bot
     */
    is_ephemeral?: boolean;
}

/**
 * This object represents the scope to which bot commands are applied. Currently, the following 7 scopes are supported:
 */
export type TelegramBotCommandScope = TelegramBotCommandScopeDefault | TelegramBotCommandScopeAllPrivateChats | TelegramBotCommandScopeAllGroupChats | TelegramBotCommandScopeAllChatAdministrators | TelegramBotCommandScopeChat | TelegramBotCommandScopeChatAdministrators | TelegramBotCommandScopeChatMember;

/**
 * Represents the scope of bot commands, covering all group and supergroup chat administrators.
 */
export interface TelegramBotCommandScopeAllChatAdministrators {
    /**
     * Scope type, must be all_chat_administrators
     */
    type: "all_chat_administrators";
}

/**
 * Represents the scope of bot commands, covering all group and supergroup chats.
 */
export interface TelegramBotCommandScopeAllGroupChats {
    /**
     * Scope type, must be all_group_chats
     */
    type: "all_group_chats";
}

/**
 * Represents the scope of bot commands, covering all private chats.
 */
export interface TelegramBotCommandScopeAllPrivateChats {
    /**
     * Scope type, must be all_private_chats
     */
    type: "all_private_chats";
}

/**
 * Represents the scope of bot commands, covering a specific chat.
 */
export interface TelegramBotCommandScopeChat {
    /**
     * Scope type, must be chat
     */
    type: "chat";
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username. Channel direct messages chats and channel chats aren't supported.
     */
    chat_id: number | string;
}

/**
 * Represents the scope of bot commands, covering all administrators of a specific group or supergroup chat.
 */
export interface TelegramBotCommandScopeChatAdministrators {
    /**
     * Scope type, must be chat_administrators
     */
    type: "chat_administrators";
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username. Channel direct messages chats and channel chats aren't supported.
     */
    chat_id: number | string;
}

/**
 * Represents the scope of bot commands, covering a specific member of a group or supergroup chat.
 */
export interface TelegramBotCommandScopeChatMember {
    /**
     * Scope type, must be chat_member
     */
    type: "chat_member";
    /**
     * Unique identifier for the target chat or username of the target supergroup in the format @username. Channel direct messages chats and channel chats aren't supported.
     */
    chat_id: number | string;
    /**
     * Unique identifier of the target user
     */
    user_id: number;
}

/**
 * Represents the default scope of bot commands. Default commands are used if no commands with a narrower scope are specified for the user.
 */
export interface TelegramBotCommandScopeDefault {
    /**
     * Scope type, must be default
     */
    type: "default";
}

/**
 * This object represents the bot's description.
 */
export interface TelegramBotDescription {
    /**
     * The bot's description
     */
    description: string;
}

/**
 * This object represents the bot's name.
 */
export interface TelegramBotName {
    /**
     * The bot's name
     */
    name: string;
}

/**
 * This object represents the bot's short description.
 */
export interface TelegramBotShortDescription {
    /**
     * The bot's short description
     */
    short_description: string;
}

/**
 * This object contains information about changes to a user payment subscription toward the current bot.
 */
export interface TelegramBotSubscriptionUpdated {
    /**
     * User who subscribed for payments toward the bot
     */
    user: TelegramUser;
    /**
     * Bot-specified invoice payload
     */
    invoice_payload: string;
    /**
     * The new state of the subscription. Currently, it can be one of “canceled” if the user canceled the subscription, “active” if the user re-enabled a previously canceled subscription, or “failed” if payment for the subscription failed.
     */
    state: "canceled" | "active" | "failed";
}

/**
 * Represents the rights of a business bot.
 */
export interface TelegramBusinessBotRights {
    /**
     * Optional. True, if the bot can send and edit messages in the private chats that had incoming messages in the last 24 hours
     */
    can_reply?: true;
    /**
     * Optional. True, if the bot can mark incoming private messages as read
     */
    can_read_messages?: true;
    /**
     * Optional. True, if the bot can delete messages sent by the bot
     */
    can_delete_sent_messages?: true;
    /**
     * Optional. True, if the bot can delete all private messages in managed chats
     */
    can_delete_all_messages?: true;
    /**
     * Optional. True, if the bot can edit the first and last name of the business account
     */
    can_edit_name?: true;
    /**
     * Optional. True, if the bot can edit the bio of the business account
     */
    can_edit_bio?: true;
    /**
     * Optional. True, if the bot can edit the profile photo of the business account
     */
    can_edit_profile_photo?: true;
    /**
     * Optional. True, if the bot can edit the username of the business account
     */
    can_edit_username?: true;
    /**
     * Optional. True, if the bot can change the privacy settings pertaining to gifts for the business account
     */
    can_change_gift_settings?: true;
    /**
     * Optional. True, if the bot can view gifts and the amount of Telegram Stars owned by the business account
     */
    can_view_gifts_and_stars?: true;
    /**
     * Optional. True, if the bot can convert regular gifts owned by the business account to Telegram Stars
     */
    can_convert_gifts_to_stars?: true;
    /**
     * Optional. True, if the bot can transfer and upgrade gifts owned by the business account
     */
    can_transfer_and_upgrade_gifts?: true;
    /**
     * Optional. True, if the bot can transfer Telegram Stars received by the business account to its own account, or use them to upgrade and transfer gifts
     */
    can_transfer_stars?: true;
    /**
     * Optional. True, if the bot can post, edit and delete stories on behalf of the business account
     */
    can_manage_stories?: true;
}

/**
 * Describes the connection of the bot with a business account.
 */
export interface TelegramBusinessConnection {
    /**
     * Unique identifier of the business connection
     */
    id: string;
    /**
     * Business account user that created the business connection
     */
    user: TelegramUser;
    /**
     * Identifier of a private chat with the user who created the business connection. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.
     */
    user_chat_id: number;
    /**
     * Date the connection was established in Unix time
     */
    date: number;
    /**
     * Optional. Rights of the business bot
     */
    rights?: TelegramBusinessBotRights;
    /**
     * True, if the connection is active
     */
    is_enabled: boolean;
}

/**
 * Contains information about the start page settings of a Telegram Business account.
 */
export interface TelegramBusinessIntro {
    /**
     * Optional. Title text of the business intro
     */
    title?: string;
    /**
     * Optional. Message text of the business intro
     */
    message?: string;
    /**
     * Optional. Sticker of the business intro
     */
    sticker?: TelegramSticker;
}

/**
 * Contains information about the location of a Telegram Business account.
 */
export interface TelegramBusinessLocation {
    /**
     * Address of the business
     */
    address: string;
    /**
     * Optional. Location of the business
     */
    location?: TelegramLocation;
}

/**
 * This object is received when messages are deleted from a connected business account.
 */
export interface TelegramBusinessMessagesDeleted {
    /**
     * Unique identifier of the business connection
     */
    business_connection_id: string;
    /**
     * Information about a chat in the business account. The bot may not have access to the chat or the corresponding user.
     */
    chat: TelegramChat;
    /**
     * The list of identifiers of deleted messages in the chat of the business account
     */
    message_ids: number[];
}

/**
 * Describes the opening hours of a business.
 */
export interface TelegramBusinessOpeningHours {
    /**
     * Unique name of the time zone for which the opening hours are defined
     */
    time_zone_name: string;
    /**
     * List of time intervals describing business opening hours
     */
    opening_hours: TelegramBusinessOpeningHoursInterval[];
}

/**
 * Describes an interval of time during which a business is open.
 */
export interface TelegramBusinessOpeningHoursInterval {
    /**
     * The minute's sequence number in a week, starting on Monday, marking the start of the time interval during which the business is open; 0 - 7 * 24 * 60
     */
    opening_minute: number;
    /**
     * The minute's sequence number in a week, starting on Monday, marking the end of the time interval during which the business is open; 0 - 8 * 24 * 60
     */
    closing_minute: number;
}

/**
 * A placeholder, currently holds no information. Use BotFather to set up your game.
 */
export interface TelegramCallbackGame {
}

/**
 * This object represents an incoming callback query from a callback button in an inline keyboard. If the button that originated the query was attached to a message sent by the bot, the field message will be present. If the button was attached to a message sent via the bot (in inline mode), the field inline_message_id will be present. Exactly one of the fields data or game_short_name will be present.
 */
export interface TelegramCallbackQuery {
    /**
     * Unique identifier for this query
     */
    id: string;
    /**
     * Sender
     */
    from: TelegramUser;
    /**
     * Optional. Message sent by the bot with the callback button that originated the query
     */
    message?: TelegramMaybeInaccessibleMessage;
    /**
     * Optional. Identifier of the message sent via the bot in inline mode, that originated the query
     */
    inline_message_id?: string;
    /**
     * Global identifier, uniquely corresponding to the chat to which the message with the callback button was sent. Useful for high scores in games.
     */
    chat_instance: string;
    /**
     * Optional. Data associated with the callback button. Be aware that the message originated the query can contain no callback buttons with this data.
     */
    data?: string;
    /**
     * Optional. Short name of a Game to be returned, serves as the unique identifier for the game
     */
    game_short_name?: string;
}

/**
 * This object represents a chat.
 */
export interface TelegramChat {
    /**
     * Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
     */
    id: number;
    /**
     * Type of the chat, can be either “private”, “group”, “supergroup” or “channel”
     */
    type: "private" | "group" | "supergroup" | "channel";
    /**
     * Optional. Title, for supergroups, channels and group chats
     */
    title?: string;
    /**
     * Optional. Username, for private chats, supergroups and channels if available
     */
    username?: string;
    /**
     * Optional. First name of the other party in a private chat
     */
    first_name?: string;
    /**
     * Optional. Last name of the other party in a private chat
     */
    last_name?: string;
    /**
     * Optional. True, if the supergroup chat is a forum (has topics enabled)
     */
    is_forum?: true;
    /**
     * Optional. True, if the chat is the direct messages chat of a channel
     */
    is_direct_messages?: true;
}

/**
 * Represents the rights of an administrator in a chat.
 */
export interface TelegramChatAdministratorRights {
    /**
     * True, if the user's presence in the chat is hidden
     */
    is_anonymous: boolean;
    /**
     * True, if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege.
     */
    can_manage_chat: boolean;
    /**
     * True, if the administrator can delete messages of other users
     */
    can_delete_messages: boolean;
    /**
     * True, if the administrator can manage video chats
     */
    can_manage_video_chats: boolean;
    /**
     * True, if the administrator can restrict, ban or unban chat members, or access supergroup statistics
     */
    can_restrict_members: boolean;
    /**
     * True, if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by the user)
     */
    can_promote_members: boolean;
    /**
     * True, if the user is allowed to change the chat title, photo and other settings
     */
    can_change_info: boolean;
    /**
     * True, if the user is allowed to invite new users to the chat
     */
    can_invite_users: boolean;
    /**
     * True, if the administrator can post stories to the chat
     */
    can_post_stories: boolean;
    /**
     * True, if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive
     */
    can_edit_stories: boolean;
    /**
     * True, if the administrator can delete stories posted by other users
     */
    can_delete_stories: boolean;
    /**
     * Optional. True, if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only
     */
    can_post_messages?: boolean;
    /**
     * Optional. True, if the administrator can edit messages of other users and can pin messages; for channels only
     */
    can_edit_messages?: boolean;
    /**
     * Optional. True, if the user is allowed to pin messages; for groups and supergroups only
     */
    can_pin_messages?: boolean;
    /**
     * Optional. True, if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only
     */
    can_manage_topics?: boolean;
    /**
     * Optional. True, if the administrator can manage direct messages of the channel and decline suggested posts; for channels only
     */
    can_manage_direct_messages?: boolean;
    /**
     * Optional. True, if the administrator can edit the tags of regular members; for groups and supergroups only
     */
    can_manage_tags?: boolean;
    /**
     * True, if the administrator can manage chat welcome messages or directly send them in the case of bots
     */
    can_send_welcome_messages: boolean;
}

/**
 * This object represents a chat background.
 */
export interface TelegramChatBackground {
    /**
     * Type of the background
     */
    type: TelegramBackgroundType;
}

/**
 * This object contains information about a chat boost.
 */
export interface TelegramChatBoost {
    /**
     * Unique identifier of the boost
     */
    boost_id: string;
    /**
     * Point in time (Unix timestamp) when the chat was boosted
     */
    add_date: number;
    /**
     * Point in time (Unix timestamp) when the boost will automatically expire, unless the booster's Telegram Premium subscription is prolonged
     */
    expiration_date: number;
    /**
     * Source of the added boost
     */
    source: TelegramChatBoostSource;
}

/**
 * This object represents a service message about a user boosting a chat.
 */
export interface TelegramChatBoostAdded {
    /**
     * Number of boosts added by the user
     */
    boost_count: number;
}

/**
 * This object represents a boost removed from a chat.
 */
export interface TelegramChatBoostRemoved {
    /**
     * Chat which was boosted
     */
    chat: TelegramChat;
    /**
     * Unique identifier of the boost
     */
    boost_id: string;
    /**
     * Point in time (Unix timestamp) when the boost was removed
     */
    remove_date: number;
    /**
     * Source of the removed boost
     */
    source: TelegramChatBoostSource;
}

/**
 * This object describes the source of a chat boost. It can be one of
 */
export type TelegramChatBoostSource = TelegramChatBoostSourcePremium | TelegramChatBoostSourceGiftCode | TelegramChatBoostSourceGiveaway;

/**
 * The boost was obtained by the creation of Telegram Premium gift codes to boost a chat. Each such code boosts the chat 4 times for the duration of the corresponding Telegram Premium subscription.
 */
export interface TelegramChatBoostSourceGiftCode {
    /**
     * Source of the boost, always “gift_code”
     */
    source: "gift_code";
    /**
     * User for which the gift code was created
     */
    user: TelegramUser;
}

/**
 * The boost was obtained by the creation of a Telegram Premium or a Telegram Star giveaway. This boosts the chat 4 times for the duration of the corresponding Telegram Premium subscription for Telegram Premium giveaways and prize_star_count / 500 times for one year for Telegram Star giveaways.
 */
export interface TelegramChatBoostSourceGiveaway {
    /**
     * Source of the boost, always “giveaway”
     */
    source: "giveaway";
    /**
     * Identifier of a message in the chat with the giveaway; the message could have been deleted already. May be 0 if the message isn't sent yet.
     */
    giveaway_message_id: number;
    /**
     * Optional. User that won the prize in the giveaway if any; for Telegram Premium giveaways only
     */
    user?: TelegramUser;
    /**
     * Optional. The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only
     */
    prize_star_count?: number;
    /**
     * Optional. True, if the giveaway was completed, but there was no user to win the prize
     */
    is_unclaimed?: true;
}

/**
 * The boost was obtained by subscribing to Telegram Premium or by gifting a Telegram Premium subscription to another user.
 */
export interface TelegramChatBoostSourcePremium {
    /**
     * Source of the boost, always “premium”
     */
    source: "premium";
    /**
     * User that boosted the chat
     */
    user: TelegramUser;
}

/**
 * This object represents a boost added to a chat or changed.
 */
export interface TelegramChatBoostUpdated {
    /**
     * Chat which was boosted
     */
    chat: TelegramChat;
    /**
     * Information about the chat boost
     */
    boost: TelegramChatBoost;
}

/**
 * This object contains full information about a chat.
 */
export interface TelegramChatFullInfo {
    /**
     * Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
     */
    id: number;
    /**
     * Type of the chat, can be either “private”, “group”, “supergroup” or “channel”
     */
    type: "private" | "group" | "supergroup" | "channel";
    /**
     * Optional. Title, for supergroups, channels and group chats
     */
    title?: string;
    /**
     * Optional. Username, for private chats, supergroups and channels if available
     */
    username?: string;
    /**
     * Optional. First name of the other party in a private chat
     */
    first_name?: string;
    /**
     * Optional. Last name of the other party in a private chat
     */
    last_name?: string;
    /**
     * Optional. True, if the supergroup chat is a forum (has topics enabled)
     */
    is_forum?: true;
    /**
     * Optional. True, if the chat is the direct messages chat of a channel
     */
    is_direct_messages?: true;
    /**
     * Identifier of the accent color for the chat name and backgrounds of the chat photo, reply header, and link preview. See accent colors for more details.
     */
    accent_color_id: number;
    /**
     * The maximum number of reactions that can be set on a message in the chat
     */
    max_reaction_count: number;
    /**
     * Optional. Chat photo
     */
    photo?: TelegramChatPhoto;
    /**
     * Optional. If non-empty, the list of all active chat usernames; for private chats, supergroups and channels
     */
    active_usernames?: string[];
    /**
     * Optional. For private chats, the date of birth of the user
     */
    birthdate?: TelegramBirthdate;
    /**
     * Optional. For private chats with business accounts, the intro of the business
     */
    business_intro?: TelegramBusinessIntro;
    /**
     * Optional. For private chats with business accounts, the location of the business
     */
    business_location?: TelegramBusinessLocation;
    /**
     * Optional. For private chats with business accounts, the opening hours of the business
     */
    business_opening_hours?: TelegramBusinessOpeningHours;
    /**
     * Optional. For private chats, the personal channel of the user
     */
    personal_chat?: TelegramChat;
    /**
     * Optional. Information about the corresponding channel chat; for direct messages chats only
     */
    parent_chat?: TelegramChat;
    /**
     * Optional. List of available reactions allowed in the chat. If omitted, then all emoji reactions are allowed.
     */
    available_reactions?: TelegramReactionType[];
    /**
     * Optional. Custom emoji identifier of the emoji chosen by the chat for the reply header and link preview background
     */
    background_custom_emoji_id?: string;
    /**
     * Optional. Identifier of the accent color for the chat's profile background. See profile accent colors for more details.
     */
    profile_accent_color_id?: number;
    /**
     * Optional. Custom emoji identifier of the emoji chosen by the chat for its profile background
     */
    profile_background_custom_emoji_id?: string;
    /**
     * Optional. Custom emoji identifier of the emoji status of the chat or the other party in a private chat
     */
    emoji_status_custom_emoji_id?: string;
    /**
     * Optional. Expiration date of the emoji status of the chat or the other party in a private chat, in Unix time, if any
     */
    emoji_status_expiration_date?: number;
    /**
     * Optional. Bio of the other party in a private chat
     */
    bio?: string;
    /**
     * Optional. True, if privacy settings of the other party in the private chat allows to use tg://user?id=<user_id> links only in chats with the user
     */
    has_private_forwards?: true;
    /**
     * Optional. True, if the privacy settings of the other party restrict sending voice and video note messages in the private chat
     */
    has_restricted_voice_and_video_messages?: true;
    /**
     * Optional. True, if users need to join the supergroup before they can send messages
     */
    join_to_send_messages?: true;
    /**
     * Optional. True, if all users directly joining the supergroup without using an invite link need to be approved by supergroup administrators
     */
    join_by_request?: true;
    /**
     * Optional. Description, for groups, supergroups and channel chats
     */
    description?: string;
    /**
     * Optional. Primary invite link, for groups, supergroups and channel chats
     */
    invite_link?: string;
    /**
     * Optional. The most recent pinned message (by sending date)
     */
    pinned_message?: TelegramMessage;
    /**
     * Optional. Default chat member permissions, for groups and supergroups
     */
    permissions?: TelegramChatPermissions;
    /**
     * Information about types of gifts that are accepted by the chat or by the corresponding user for private chats
     */
    accepted_gift_types: TelegramAcceptedGiftTypes;
    /**
     * Optional. True, if paid media messages can be sent or forwarded to the channel chat. The field is available only for channel chats.
     */
    can_send_paid_media?: true;
    /**
     * Optional. For supergroups, the minimum allowed delay between consecutive messages sent by each unprivileged user; in seconds
     */
    slow_mode_delay?: number;
    /**
     * Optional. For supergroups, the minimum number of boosts that a non-administrator user needs to add in order to ignore slow mode and chat permissions
     */
    unrestrict_boost_count?: number;
    /**
     * Optional. The time after which all messages sent to the chat will be automatically deleted; in seconds
     */
    message_auto_delete_time?: number;
    /**
     * Optional. True, if aggressive anti-spam checks are enabled in the supergroup. The field is only available to chat administrators.
     */
    has_aggressive_anti_spam_enabled?: true;
    /**
     * Optional. True, if non-administrators can only get the list of bots and administrators in the chat
     */
    has_hidden_members?: true;
    /**
     * Optional. True, if messages from the chat can't be forwarded to other chats
     */
    has_protected_content?: true;
    /**
     * Optional. True, if new chat members will have access to old messages; available only to chat administrators
     */
    has_visible_history?: true;
    /**
     * Optional. For supergroups, name of the group sticker set
     */
    sticker_set_name?: string;
    /**
     * Optional. True, if the bot can change the group sticker set
     */
    can_set_sticker_set?: true;
    /**
     * Optional. For supergroups, the name of the group's custom emoji sticker set. Custom emoji from this set can be used by all users and bots in the group.
     */
    custom_emoji_sticker_set_name?: string;
    /**
     * Optional. Unique identifier for the linked chat, i.e. the discussion group identifier for a channel and vice versa; for supergroups and channel chats. This identifier may be greater than 32 bits and some programming languages may have difficulty/silent defects in interpreting it. But it is smaller than 52 bits, so a signed 64 bit integer or double-precision float type are safe for storing this identifier.
     */
    linked_chat_id?: number;
    /**
     * Optional. For supergroups, the location to which the supergroup is connected
     */
    location?: TelegramChatLocation;
    /**
     * Optional. For private chats, the rating of the user if any
     */
    rating?: TelegramUserRating;
    /**
     * Optional. For private chats, the first audio added to the profile of the user
     */
    first_profile_audio?: TelegramAudio;
    /**
     * Optional. The color scheme based on a unique gift that must be used for the chat's name, message replies and link previews
     */
    unique_gift_colors?: TelegramUniqueGiftColors;
    /**
     * Optional. The number of Telegram Stars a general user has to pay to send a message to the chat
     */
    paid_message_star_count?: number;
    /**
     * Optional. The bot that processes join request queries in the chat. The field is only available to chat administrators.
     */
    guard_bot?: TelegramUser;
    /**
     * Optional. The Community to which the chat belongs
     */
    community?: TelegramCommunity;
    /**
     * Optional. For private chats, the TON wallet card of the user, which is shown on their profile page
     */
    ton_wallet_card?: TelegramTonWalletCard;
    /**
     * Optional. For private chats, supergroups and channels, the theme of the screen for sharing a link to the user or the chat; omitted if the default theme is used
     */
    share_theme?: TelegramChatShareTheme;
}

/**
 * Represents an invite link for a chat.
 */
export interface TelegramChatInviteLink {
    /**
     * The invite link. If the link was created by another chat administrator, then the second part of the link will be replaced with “…”.
     */
    invite_link: string;
    /**
     * Creator of the link
     */
    creator: TelegramUser;
    /**
     * True, if users joining the chat via the link need to be approved by chat administrators
     */
    creates_join_request: boolean;
    /**
     * True, if the link is primary
     */
    is_primary: boolean;
    /**
     * True, if the link is revoked
     */
    is_revoked: boolean;
    /**
     * Optional. Invite link name
     */
    name?: string;
    /**
     * Optional. Point in time (Unix timestamp) when the link will expire or has been expired
     */
    expire_date?: number;
    /**
     * Optional. The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999
     */
    member_limit?: number;
    /**
     * Optional. Number of pending join requests created using this link
     */
    pending_join_request_count?: number;
    /**
     * Optional. The number of seconds the subscription will be active for before the next payment
     */
    subscription_period?: number;
    /**
     * Optional. The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat using the link
     */
    subscription_price?: number;
}

/**
 * Represents a join request sent to a chat.
 */
export interface TelegramChatJoinRequest {
    /**
     * Chat to which the request was sent
     */
    chat: TelegramChat;
    /**
     * User that sent the join request
     */
    from: TelegramUser;
    /**
     * Identifier of a private chat with the user who sent the join request. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. The bot can use this identifier for 5 minutes to send messages until the join request is processed, assuming no other administrator contacted the user.
     */
    user_chat_id: number;
    /**
     * Date the request was sent in Unix time
     */
    date: number;
    /**
     * Optional. Bio of the user
     */
    bio?: string;
    /**
     * Optional. Chat invite link that was used by the user to send the join request
     */
    invite_link?: TelegramChatInviteLink;
    /**
     * Optional. Identifier of the join request query; for bots assigned to process join requests only. If present, then the bot must call sendChatJoinRequestWebApp or directly call answerChatJoinRequestQuery within 10 seconds.
     */
    query_id?: string;
}

/**
 * Represents a location to which a chat is connected.
 */
export interface TelegramChatLocation {
    /**
     * The location to which the supergroup is connected. Can't be a live location.
     */
    location: TelegramLocation;
    /**
     * Location address; 1-64 characters, as defined by the chat owner
     */
    address: string;
}

/**
 * This object contains information about one member of a chat. Currently, the following 6 types of chat members are supported:
 */
export type TelegramChatMember = TelegramChatMemberOwner | TelegramChatMemberAdministrator | TelegramChatMemberMember | TelegramChatMemberRestricted | TelegramChatMemberLeft | TelegramChatMemberBanned;

/**
 * Represents a chat member that has some additional privileges.
 */
export interface TelegramChatMemberAdministrator {
    /**
     * The member's status in the chat, always “administrator”
     */
    status: "administrator";
    /**
     * Information about the user
     */
    user: TelegramUser;
    /**
     * True, if the bot is allowed to edit administrator privileges of that user
     */
    can_be_edited: boolean;
    /**
     * True, if the user's presence in the chat is hidden
     */
    is_anonymous: boolean;
    /**
     * True, if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege.
     */
    can_manage_chat: boolean;
    /**
     * True, if the administrator can delete messages of other users
     */
    can_delete_messages: boolean;
    /**
     * True, if the administrator can manage video chats
     */
    can_manage_video_chats: boolean;
    /**
     * True, if the administrator can restrict, ban or unban chat members, or access supergroup statistics
     */
    can_restrict_members: boolean;
    /**
     * True, if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by the user)
     */
    can_promote_members: boolean;
    /**
     * True, if the user is allowed to change the chat title, photo and other settings
     */
    can_change_info: boolean;
    /**
     * True, if the user is allowed to invite new users to the chat
     */
    can_invite_users: boolean;
    /**
     * True, if the administrator can post stories to the chat
     */
    can_post_stories: boolean;
    /**
     * True, if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive
     */
    can_edit_stories: boolean;
    /**
     * True, if the administrator can delete stories posted by other users
     */
    can_delete_stories: boolean;
    /**
     * Optional. True, if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only
     */
    can_post_messages?: boolean;
    /**
     * Optional. True, if the administrator can edit messages of other users and can pin messages; for channels only
     */
    can_edit_messages?: boolean;
    /**
     * Optional. True, if the user is allowed to pin messages; for groups and supergroups only
     */
    can_pin_messages?: boolean;
    /**
     * Optional. True, if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only
     */
    can_manage_topics?: boolean;
    /**
     * Optional. True, if the administrator can manage direct messages of the channel and decline suggested posts; for channels only
     */
    can_manage_direct_messages?: boolean;
    /**
     * Optional. True, if the administrator can edit the tags of regular members; for groups and supergroups only
     */
    can_manage_tags?: boolean;
    /**
     * True, if the administrator can manage chat welcome messages or directly send them in the case of bots
     */
    can_send_welcome_messages: boolean;
    /**
     * Optional. Custom title for this user
     */
    custom_title?: string;
}

/**
 * Represents a chat member that was banned in the chat and can't return to the chat or view chat messages.
 */
export interface TelegramChatMemberBanned {
    /**
     * The member's status in the chat, always “kicked”
     */
    status: "kicked";
    /**
     * Information about the user
     */
    user: TelegramUser;
    /**
     * Date when restrictions will be lifted for this user; Unix time. If 0, then the user is banned forever.
     */
    until_date: number;
}

/**
 * Represents a chat member that isn't currently a member of the chat, but may join it themselves.
 */
export interface TelegramChatMemberLeft {
    /**
     * The member's status in the chat, always “left”
     */
    status: "left";
    /**
     * Information about the user
     */
    user: TelegramUser;
}

/**
 * Represents a chat member that has no additional privileges or restrictions.
 */
export interface TelegramChatMemberMember {
    /**
     * The member's status in the chat, always “member”
     */
    status: "member";
    /**
     * Optional. Tag of the member
     */
    tag?: string;
    /**
     * Information about the user
     */
    user: TelegramUser;
    /**
     * Optional. Date when the user's subscription will expire; Unix time
     */
    until_date?: number;
}

/**
 * Represents a chat member that owns the chat and has all administrator privileges.
 */
export interface TelegramChatMemberOwner {
    /**
     * The member's status in the chat, always “creator”
     */
    status: "creator";
    /**
     * Information about the user
     */
    user: TelegramUser;
    /**
     * True, if the user's presence in the chat is hidden
     */
    is_anonymous: boolean;
    /**
     * Optional. Custom title for this user
     */
    custom_title?: string;
}

/**
 * Represents a chat member that is under certain restrictions in the chat. Supergroups only.
 */
export interface TelegramChatMemberRestricted {
    /**
     * The member's status in the chat, always “restricted”
     */
    status: "restricted";
    /**
     * Optional. Tag of the member
     */
    tag?: string;
    /**
     * Information about the user
     */
    user: TelegramUser;
    /**
     * True, if the user is a member of the chat at the moment of the request
     */
    is_member: boolean;
    /**
     * True, if the user is allowed to send text messages, rich messages, contacts, giveaways, giveaway winners, invoices, locations and venues
     */
    can_send_messages: boolean;
    /**
     * True, if the user is allowed to send audios
     */
    can_send_audios: boolean;
    /**
     * True, if the user is allowed to send documents
     */
    can_send_documents: boolean;
    /**
     * True, if the user is allowed to send photos
     */
    can_send_photos: boolean;
    /**
     * True, if the user is allowed to send videos
     */
    can_send_videos: boolean;
    /**
     * True, if the user is allowed to send video notes
     */
    can_send_video_notes: boolean;
    /**
     * True, if the user is allowed to send voice notes
     */
    can_send_voice_notes: boolean;
    /**
     * True, if the user is allowed to send polls and checklists
     */
    can_send_polls: boolean;
    /**
     * True, if the user is allowed to send animations, games, stickers, widgets and use inline bots
     */
    can_send_other_messages: boolean;
    /**
     * True, if the user is allowed to add web page previews to their messages
     */
    can_add_web_page_previews: boolean;
    /**
     * True, if the user is allowed to react to messages
     */
    can_react_to_messages: boolean;
    /**
     * True, if the user is allowed to edit their own tag
     */
    can_edit_tag: boolean;
    /**
     * True, if the user is allowed to change the chat title, photo and other settings
     */
    can_change_info: boolean;
    /**
     * True, if the user is allowed to invite new users to the chat
     */
    can_invite_users: boolean;
    /**
     * True, if the user is allowed to pin messages
     */
    can_pin_messages: boolean;
    /**
     * True, if the user is allowed to create forum topics
     */
    can_manage_topics: boolean;
    /**
     * Date when restrictions will be lifted for this user; Unix time. If 0, then the user is restricted forever.
     */
    until_date: number;
}

/**
 * This object represents changes in the status of a chat member.
 */
export interface TelegramChatMemberUpdated {
    /**
     * Chat the user belongs to
     */
    chat: TelegramChat;
    /**
     * Performer of the action, which resulted in the change
     */
    from: TelegramUser;
    /**
     * Date the change was done in Unix time
     */
    date: number;
    /**
     * Previous information about the chat member
     */
    old_chat_member: TelegramChatMember;
    /**
     * New information about the chat member
     */
    new_chat_member: TelegramChatMember;
    /**
     * Optional. Chat invite link, which was used by the user to join the chat; for joining by invite link events only
     */
    invite_link?: TelegramChatInviteLink;
    /**
     * Optional. True, if the user joined the chat after sending a direct join request without using an invite link and being approved by an administrator
     */
    via_join_request?: boolean;
    /**
     * Optional. True, if the user joined the chat via a chat folder invite link
     */
    via_chat_folder_invite_link?: boolean;
}

/**
 * Describes a service message about an ownership change in the chat.
 */
export interface TelegramChatOwnerChanged {
    /**
     * The new owner of the chat
     */
    new_owner: TelegramUser;
}

/**
 * Describes a service message about the chat owner leaving the chat.
 */
export interface TelegramChatOwnerLeft {
    /**
     * Optional. The user who will become the new owner of the chat if the previous owner does not return to the chat
     */
    new_owner?: TelegramUser;
}

/**
 * Describes actions that a non-administrator user is allowed to take in a chat.
 */
export interface TelegramChatPermissions {
    /**
     * Optional. True, if the user is allowed to send text messages, rich messages, contacts, giveaways, giveaway winners, invoices, locations and venues
     */
    can_send_messages?: boolean;
    /**
     * Optional. True, if the user is allowed to send audios
     */
    can_send_audios?: boolean;
    /**
     * Optional. True, if the user is allowed to send documents
     */
    can_send_documents?: boolean;
    /**
     * Optional. True, if the user is allowed to send photos
     */
    can_send_photos?: boolean;
    /**
     * Optional. True, if the user is allowed to send videos
     */
    can_send_videos?: boolean;
    /**
     * Optional. True, if the user is allowed to send video notes
     */
    can_send_video_notes?: boolean;
    /**
     * Optional. True, if the user is allowed to send voice notes
     */
    can_send_voice_notes?: boolean;
    /**
     * Optional. True, if the user is allowed to send polls and checklists
     */
    can_send_polls?: boolean;
    /**
     * Optional. True, if the user is allowed to send animations, games, stickers, widgets and use inline bots
     */
    can_send_other_messages?: boolean;
    /**
     * Optional. True, if the user is allowed to add web page previews to their messages
     */
    can_add_web_page_previews?: boolean;
    /**
     * Optional. True, if the user is allowed to react to messages. If omitted, defaults to the value of can_send_messages.
     */
    can_react_to_messages?: boolean;
    /**
     * Optional. True, if the user is allowed to edit their own tag. If omitted, defaults to the value of can_pin_messages.
     */
    can_edit_tag?: boolean;
    /**
     * Optional. True, if the user is allowed to change the chat title, photo and other settings. Ignored in public supergroups.
     */
    can_change_info?: boolean;
    /**
     * Optional. True, if the user is allowed to invite new users to the chat
     */
    can_invite_users?: boolean;
    /**
     * Optional. True, if the user is allowed to pin messages. Ignored in public supergroups.
     */
    can_pin_messages?: boolean;
    /**
     * Optional. True, if the user is allowed to create forum topics. If omitted, defaults to the value of can_pin_messages.
     */
    can_manage_topics?: boolean;
}

/**
 * This object represents a chat photo.
 */
export interface TelegramChatPhoto {
    /**
     * File identifier of small (160x160) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed.
     */
    small_file_id: string;
    /**
     * Unique file identifier of small (160x160) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    small_file_unique_id: string;
    /**
     * File identifier of big (640x640) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed.
     */
    big_file_id: string;
    /**
     * Unique file identifier of big (640x640) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    big_file_unique_id: string;
}

/**
 * This object contains information about a chat that was shared with the bot using a KeyboardButtonRequestChat button.
 */
export interface TelegramChatShared {
    /**
     * Identifier of the request
     */
    request_id: number;
    /**
     * Identifier of the shared chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. The bot may not have access to the chat and could be unable to use this identifier, unless the chat is already known to the bot by some other means.
     */
    chat_id: number;
    /**
     * Optional. Title of the chat, if the title was requested by the bot
     */
    title?: string;
    /**
     * Optional. Username of the chat, if the username was requested by the bot and available
     */
    username?: string;
    /**
     * Optional. Available sizes of the chat photo, if the photo was requested by the bot
     */
    photo?: TelegramPhotoSize[];
}

/**
 * This object describes the theme of the screen for sharing a link to a user or a chat. Currently, it can be one of
 */
export type TelegramChatShareTheme = TelegramChatShareThemeEmoji | TelegramChatShareThemeUniqueGift;

/**
 * This object describes a backdrop, which can be used as the background of a theme of the screen for sharing a link to a user or a chat.
 */
export interface TelegramChatShareThemeBackdrop {
    /**
     * Unique identifier of the backdrop
     */
    id: number;
    /**
     * Name of the backdrop
     */
    name: string;
    /**
     * Colors of the backdrop
     */
    colors: TelegramUniqueGiftBackdropColors;
}

/**
 * This object contains a list of backdrops, which can be used as the background of a theme of the screen for sharing a link to a user or a chat.
 */
export interface TelegramChatShareThemeBackdrops {
    /**
     * The list of backdrops
     */
    backdrops: TelegramChatShareThemeBackdrop[];
}

/**
 * The theme with emoji placed on a background.
 */
export interface TelegramChatShareThemeEmoji {
    /**
     * Type of the theme, always “emoji”
     */
    type: "emoji";
    /**
     * The emoji; 0-6 regular or custom emoji
     */
    emojis: TelegramEmojiType[];
    /**
     * Optional. Identifier of the backdrop used as the background; omitted if the default background is used. Use getChatShareThemeBackdrops to get details about the backdrop.
     */
    background_backdrop_id?: number;
}

/**
 * The theme based on a unique gift owned by the user or the chat.
 */
export interface TelegramChatShareThemeUniqueGift {
    /**
     * Type of the theme, always “unique_gift”
     */
    type: "unique_gift";
    /**
     * The gift
     */
    gift: TelegramUniqueGift;
}

/**
 * Describes a checklist.
 */
export interface TelegramChecklist {
    /**
     * Title of the checklist
     */
    title: string;
    /**
     * Optional. Special entities that appear in the checklist title
     */
    title_entities?: TelegramMessageEntity[];
    /**
     * List of tasks in the checklist
     */
    tasks: TelegramChecklistTask[];
    /**
     * Optional. True, if users other than the creator of the list can add tasks to the list
     */
    others_can_add_tasks?: true;
    /**
     * Optional. True, if users other than the creator of the list can mark tasks as done or not done
     */
    others_can_mark_tasks_as_done?: true;
}

/**
 * Describes a task in a checklist.
 */
export interface TelegramChecklistTask {
    /**
     * Unique identifier of the task
     */
    id: number;
    /**
     * Text of the task
     */
    text: string;
    /**
     * Optional. Special entities that appear in the task text
     */
    text_entities?: TelegramMessageEntity[];
    /**
     * Optional. User that completed the task; omitted if the task wasn't completed by a user
     */
    completed_by_user?: TelegramUser;
    /**
     * Optional. Chat that completed the task; omitted if the task wasn't completed by a chat
     */
    completed_by_chat?: TelegramChat;
    /**
     * Optional. Point in time (Unix timestamp) when the task was completed; 0 if the task wasn't completed
     */
    completion_date?: number;
}

/**
 * Describes a service message about tasks added to a checklist.
 */
export interface TelegramChecklistTasksAdded {
    /**
     * Optional. Message containing the checklist to which the tasks were added. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply.
     */
    checklist_message?: TelegramMessage;
    /**
     * List of tasks added to the checklist
     */
    tasks: TelegramChecklistTask[];
}

/**
 * Describes a service message about checklist tasks marked as done or not done.
 */
export interface TelegramChecklistTasksDone {
    /**
     * Optional. Message containing the checklist whose tasks were marked as done or not done. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply.
     */
    checklist_message?: TelegramMessage;
    /**
     * Optional. Identifiers of the tasks that were marked as done
     */
    marked_as_done_task_ids?: number[];
    /**
     * Optional. Identifiers of the tasks that were marked as not done
     */
    marked_as_not_done_task_ids?: number[];
}

/**
 * Represents a result of an inline query that was chosen by the user and sent to their chat partner.
 */
export interface TelegramChosenInlineResult {
    /**
     * The unique identifier for the result that was chosen
     */
    result_id: string;
    /**
     * The user that chose the result
     */
    from: TelegramUser;
    /**
     * Optional. Sender location, only for bots that require user location
     */
    location?: TelegramLocation;
    /**
     * Optional. Identifier of the sent inline message. Available only if there is an inline keyboard attached to the message. Will be also received in callback queries and can be used to edit the message.
     */
    inline_message_id?: string;
    /**
     * The query that was used to obtain the result
     */
    query: string;
}

/**
 * Represents a community (a group of chats).
 */
export interface TelegramCommunity {
    /**
     * Unique identifier for this community. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
     */
    id: number;
    /**
     * Name of the community
     */
    name: string;
}

/**
 * Describes a service message about a chat or a bot being added to a community.
 */
export interface TelegramCommunityChatAdded {
    /**
     * The new community to which the chat or the bot belongs
     */
    community: TelegramCommunity;
}

/**
 * Describes a service message about a chat being joined by a user from a community.
 */
export interface TelegramCommunityChatJoined {
    /**
     * The community from which the chat was joined
     */
    community: TelegramCommunity;
}

/**
 * Describes a service message about a chat or a bot being removed from a community. Currently holds no information.
 */
export interface TelegramCommunityChatRemoved {
}

/**
 * This object represents a phone contact.
 */
export interface TelegramContact {
    /**
     * Contact's phone number
     */
    phone_number: string;
    /**
     * Contact's first name
     */
    first_name: string;
    /**
     * Optional. Contact's last name
     */
    last_name?: string;
    /**
     * Optional. Contact's user identifier in Telegram. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.
     */
    user_id?: number;
    /**
     * Optional. Additional data about the contact in the form of a vCard
     */
    vcard?: string;
}

/**
 * This object represents an inline keyboard button that copies specified text to the clipboard.
 */
export interface TelegramCopyTextButton {
    /**
     * The text to be copied to the clipboard; 1-256 characters
     */
    text: string;
}

/**
 * This object represents an animated emoji that displays a random value.
 */
export interface TelegramDice {
    /**
     * Emoji on which the dice throw animation is based
     */
    emoji: string;
    /**
     * Value of the dice, 1-6 for “”, “” and “” base emoji, 1-5 for “” and “” base emoji, 1-64 for “” base emoji
     */
    value: number;
}

/**
 * Describes a service message about a change in the price of direct messages sent to a channel chat.
 */
export interface TelegramDirectMessagePriceChanged {
    /**
     * True, if direct messages are enabled for the channel chat; False otherwise
     */
    are_direct_messages_enabled: boolean;
    /**
     * Optional. The new number of Telegram Stars that must be paid by users for each direct message sent to the channel. Does not apply to users who have been exempted by administrators. Defaults to 0.
     */
    direct_message_star_count?: number;
}

/**
 * Describes a topic of a direct messages chat.
 */
export interface TelegramDirectMessagesTopic {
    /**
     * Unique identifier of the topic. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.
     */
    topic_id: number;
    /**
     * Optional. Information about the user that created the topic. Currently, it is always present.
     */
    user?: TelegramUser;
}

/**
 * This object represents a disabled button which does nothing. Currently holds no information.
 */
export interface TelegramDisabledButton {
}

/**
 * This object represents a general file (as opposed to photos, voice messages and audio files).
 */
export interface TelegramDocument {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    file_unique_id: string;
    /**
     * Optional. Document thumbnail as defined by the sender
     */
    thumbnail?: TelegramPhotoSize;
    /**
     * Optional. Original filename as defined by the sender
     */
    file_name?: string;
    /**
     * Optional. MIME type of the file as defined by the sender
     */
    mime_type?: string;
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     */
    file_size?: number;
}

/**
 * This object describes an emoji. Currently, it can be one of
 */
export type TelegramEmojiType = TelegramEmojiTypeEmoji | TelegramEmojiTypeCustomEmoji;

/**
 * A custom emoji.
 */
export interface TelegramEmojiTypeCustomEmoji {
    /**
     * Type of the emoji, always “custom_emoji”
     */
    type: "custom_emoji";
    /**
     * Identifier of the custom emoji. Use getCustomEmojiStickers to get full information about the sticker.
     */
    custom_emoji_id: string;
}

/**
 * A regular emoji.
 */
export interface TelegramEmojiTypeEmoji {
    /**
     * Type of the emoji, always “emoji”
     */
    type: "emoji";
    /**
     * The emoji
     */
    emoji: string;
}

/**
 * Describes data required for decrypting and authenticating EncryptedPassportElement. See the Telegram Passport Documentation for a complete description of the data decryption and authentication processes.
 */
export interface TelegramEncryptedCredentials {
    /**
     * Base64-encoded encrypted JSON-serialized data with unique user's payload, data hashes and secrets required for EncryptedPassportElement decryption and authentication
     */
    data: string;
    /**
     * Base64-encoded data hash for data authentication
     */
    hash: string;
    /**
     * Base64-encoded secret, encrypted with the bot's public RSA key, required for data decryption
     */
    secret: string;
}

/**
 * Describes documents or other Telegram Passport elements shared with the bot by the user.
 */
export interface TelegramEncryptedPassportElement {
    /**
     * Element type. One of “personal_details”, “passport”, “driver_license”, “identity_card”, “internal_passport”, “address”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”, “phone_number”, “email”.
     */
    type: "personal_details" | "passport" | "driver_license" | "identity_card" | "internal_passport" | "address" | "utility_bill" | "bank_statement" | "rental_agreement" | "passport_registration" | "temporary_registration" | "phone_number" | "email";
    /**
     * Optional. Base64-encoded encrypted Telegram Passport element data provided by the user; available only for “personal_details”, “passport”, “driver_license”, “identity_card”, “internal_passport” and “address” types. Can be decrypted and verified using the accompanying EncryptedCredentials.
     */
    data?: string;
    /**
     * Optional. User's verified phone number; available only for “phone_number” type
     */
    phone_number?: string;
    /**
     * Optional. User's verified email address; available only for “email” type
     */
    email?: string;
    /**
     * Optional. Array of encrypted files with documents provided by the user; available only for “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration” and “temporary_registration” types. Files can be decrypted and verified using the accompanying EncryptedCredentials.
     */
    files?: TelegramPassportFile[];
    /**
     * Optional. Encrypted file with the front side of the document, provided by the user; available only for “passport”, “driver_license”, “identity_card” and “internal_passport”. The file can be decrypted and verified using the accompanying EncryptedCredentials.
     */
    front_side?: TelegramPassportFile;
    /**
     * Optional. Encrypted file with the reverse side of the document, provided by the user; available only for “driver_license” and “identity_card”. The file can be decrypted and verified using the accompanying EncryptedCredentials.
     */
    reverse_side?: TelegramPassportFile;
    /**
     * Optional. Encrypted file with the selfie of the user holding a document, provided by the user; available if requested for “passport”, “driver_license”, “identity_card” and “internal_passport”. The file can be decrypted and verified using the accompanying EncryptedCredentials.
     */
    selfie?: TelegramPassportFile;
    /**
     * Optional. Array of encrypted files with translated versions of documents provided by the user; available if requested for “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration” and “temporary_registration” types. Files can be decrypted and verified using the accompanying EncryptedCredentials.
     */
    translation?: TelegramPassportFile[];
    /**
     * Base64-encoded element hash for using in PassportElementErrorUnspecified
     */
    hash: string;
}

export interface TelegramEphemeralMessageParameters {
    /**
     * Optional. Identifier of the user who will receive the message; required unless the message is sent as an ephemeral reply to a callback query. If omitted, then the parameter chat_id of the method is ignored. If specified together with callback_query_id, then it must be the identifier of the user who pressed the button. Must be omitted for messages sent in chats where the bot isn't a member, unless the message is a reply to an ephemeral message. It is not guaranteed that the user will receive the message, especially if they are offline. See here for more details.
     */
    receiver_user_id?: number;
    /**
     * Optional. Identifier of the callback query which triggered the message, if any. If specified and receiver_user_id is omitted, then the message is sent as an ephemeral reply to the callback query and will be shown only to the user who pressed the button. Ephemeral replies can't be sent to callback queries from messages in channel direct messages chats. The bot must still answer the callback query using answerCallbackQuery.
     */
    callback_query_id?: string;
    /**
     * Optional. Pass True if the ephemeral message must be shown in place of the original message. Must be False for callback queries from ephemeral messages, which must be edited using regular editEphemeralMessage… methods.
     */
    replace_callback_query_message?: boolean;
}

/**
 * This object contains information about a message that is being replied to, which may come from another chat or forum topic.
 */
export interface TelegramExternalReplyInfo {
    /**
     * Origin of the message replied to by the given message
     */
    origin: TelegramMessageOrigin;
    /**
     * Optional. Chat the original message belongs to. Available only if the chat is a supergroup or a channel.
     */
    chat?: TelegramChat;
    /**
     * Optional. Unique message identifier inside the original chat. Available only if the original chat is a supergroup or a channel.
     */
    message_id?: number;
    /**
     * Optional. Options used for link preview generation for the original message, if it is a text message
     */
    link_preview_options?: TelegramLinkPreviewOptions;
    /**
     * Optional. Message is an animation, information about the animation
     */
    animation?: TelegramAnimation;
    /**
     * Optional. Message is an audio file, information about the file
     */
    audio?: TelegramAudio;
    /**
     * Optional. Message is a general file, information about the file
     */
    document?: TelegramDocument;
    /**
     * Optional. Message is a live photo, information about the live photo
     */
    live_photo?: TelegramLivePhoto;
    /**
     * Optional. Message contains paid media; information about the paid media
     */
    paid_media?: TelegramPaidMediaInfo;
    /**
     * Optional. Message is a photo, available sizes of the photo
     */
    photo?: TelegramPhotoSize[];
    /**
     * Optional. Message is a sticker, information about the sticker
     */
    sticker?: TelegramSticker;
    /**
     * Optional. Message is a forwarded story
     */
    story?: TelegramStory;
    /**
     * Optional. Message is a video, information about the video
     */
    video?: TelegramVideo;
    /**
     * Optional. Message is a video note, information about the video message
     */
    video_note?: TelegramVideoNote;
    /**
     * Optional. Message is a voice message, information about the file
     */
    voice?: TelegramVoice;
    /**
     * Optional. Message is an HTML widget, information about the widget
     */
    widget?: TelegramWidget;
    /**
     * Optional. True, if the message media is covered by a spoiler animation
     */
    has_media_spoiler?: true;
    /**
     * Optional. Message is a checklist
     */
    checklist?: TelegramChecklist;
    /**
     * Optional. Message is a shared contact, information about the contact
     */
    contact?: TelegramContact;
    /**
     * Optional. Message is a dice with random value
     */
    dice?: TelegramDice;
    /**
     * Optional. Message is a game, information about the game. More about games »
     */
    game?: TelegramGame;
    /**
     * Optional. Message is a scheduled giveaway, information about the giveaway
     */
    giveaway?: TelegramGiveaway;
    /**
     * Optional. A giveaway with public winners was completed
     */
    giveaway_winners?: TelegramGiveawayWinners;
    /**
     * Optional. Message is an invoice for a payment, information about the invoice. More about payments »
     */
    invoice?: TelegramInvoice;
    /**
     * Optional. Message is a shared location, information about the location
     */
    location?: TelegramLocation;
    /**
     * Optional. Message is a native poll, information about the poll
     */
    poll?: TelegramPoll;
    /**
     * Optional. Message is a venue, information about the venue
     */
    venue?: TelegramVenue;
}

/**
 * This object represents a file ready to be downloaded. The file can be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile.
 */
export interface TelegramFile {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    file_unique_id: string;
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     */
    file_size?: number;
    /**
     * Optional. File path. Use https://api.telegram.org/file/bot<token>/<file_path> to get the file.
     */
    file_path?: string;
}

/**
 * Upon receiving a message with this object, Telegram clients will display a reply interface to the user (act as if the user has selected the bot's message and tapped 'Reply'). This can be extremely useful if you want to create user-friendly step-by-step interfaces without having to sacrifice privacy mode. Not supported in channels and for messages sent on behalf of a user account.
 */
export interface TelegramForceReply {
    /**
     * Shows reply interface to the user, as if they had manually selected the bot's message and tapped 'Reply'
     */
    force_reply: true;
    /**
     * Optional. The placeholder to be shown in the input field when the reply is active; 1-64 characters
     */
    input_field_placeholder?: string;
    /**
     * Optional. Use this parameter if you want to force reply from specific users only. Targets: 1) users that are @mentioned in the text of the Message object; 2) if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message.
     */
    selective?: boolean;
}

/**
 * This object represents a forum topic.
 */
export interface TelegramForumTopic {
    /**
     * Unique identifier of the forum topic
     */
    message_thread_id: number;
    /**
     * Name of the topic
     */
    name: string;
    /**
     * Color of the topic icon in RGB format
     */
    icon_color: number;
    /**
     * Optional. Unique identifier of the custom emoji shown as the topic icon
     */
    icon_custom_emoji_id?: string;
    /**
     * Optional. True, if the name of the topic wasn't specified explicitly by its creator and likely needs to be changed by the bot
     */
    is_name_implicit?: true;
}

/**
 * This object represents a service message about a forum topic closed in the chat. Currently holds no information.
 */
export interface TelegramForumTopicClosed {
}

/**
 * This object represents a service message about a new forum topic created in the chat.
 */
export interface TelegramForumTopicCreated {
    /**
     * Name of the topic
     */
    name: string;
    /**
     * Color of the topic icon in RGB format
     */
    icon_color: number;
    /**
     * Optional. Unique identifier of the custom emoji shown as the topic icon
     */
    icon_custom_emoji_id?: string;
    /**
     * Optional. True, if the name of the topic wasn't specified explicitly by its creator and likely needs to be changed by the bot
     */
    is_name_implicit?: true;
}

/**
 * This object represents a service message about an edited forum topic.
 */
export interface TelegramForumTopicEdited {
    /**
     * Optional. New name of the topic, if it was edited
     */
    name?: string;
    /**
     * Optional. New identifier of the custom emoji shown as the topic icon, if it was edited; an empty string if the icon was removed
     */
    icon_custom_emoji_id?: string;
}

/**
 * This object represents a service message about a forum topic reopened in the chat. Currently holds no information.
 */
export interface TelegramForumTopicReopened {
}

/**
 * This object represents a game. Use BotFather to create and edit games, their short names will act as unique identifiers.
 */
export interface TelegramGame {
    /**
     * Title of the game
     */
    title: string;
    /**
     * Description of the game
     */
    description: string;
    /**
     * Photo that will be displayed in the game message in chats
     */
    photo: TelegramPhotoSize[];
    /**
     * Optional. Brief description of the game or high scores included in the game message. Can be automatically edited to include current high scores for the game when the bot calls setGameScore, or manually edited using editMessageText. 0-4096 characters.
     */
    text?: string;
    /**
     * Optional. Special entities that appear in text, such as usernames, URLs, bot commands, etc.
     */
    text_entities?: TelegramMessageEntity[];
    /**
     * Optional. Animation that will be displayed in the game message in chats. Upload via BotFather.
     */
    animation?: TelegramAnimation;
}

/**
 * This object represents one row of the high scores table for a game.
 */
export interface TelegramGameHighScore {
    /**
     * Position in high score table for the game
     */
    position: number;
    /**
     * User
     */
    user: TelegramUser;
    /**
     * Score
     */
    score: number;
}

/**
 * This object represents a service message about General forum topic hidden in the chat. Currently holds no information.
 */
export interface TelegramGeneralForumTopicHidden {
}

/**
 * This object represents a service message about General forum topic unhidden in the chat. Currently holds no information.
 */
export interface TelegramGeneralForumTopicUnhidden {
}

/**
 * This object represents a gift that can be sent by the bot.
 */
export interface TelegramGift {
    /**
     * Unique identifier of the gift
     */
    id: string;
    /**
     * The sticker that represents the gift
     */
    sticker: TelegramSticker;
    /**
     * The number of Telegram Stars that must be paid to send the sticker
     */
    star_count: number;
    /**
     * Optional. The number of Telegram Stars that must be paid to upgrade the gift to a unique one
     */
    upgrade_star_count?: number;
    /**
     * Optional. True, if the gift can only be purchased by Telegram Premium subscribers
     */
    is_premium?: true;
    /**
     * Optional. True, if the gift can be used (after being upgraded) to customize a user's appearance
     */
    has_colors?: true;
    /**
     * Optional. The total number of gifts of this type that can be sent by all users; for limited gifts only
     */
    total_count?: number;
    /**
     * Optional. The number of remaining gifts of this type that can be sent by all users; for limited gifts only
     */
    remaining_count?: number;
    /**
     * Optional. The total number of gifts of this type that can be sent by the bot; for limited gifts only
     */
    personal_total_count?: number;
    /**
     * Optional. The number of remaining gifts of this type that can be sent by the bot; for limited gifts only
     */
    personal_remaining_count?: number;
    /**
     * Optional. Background of the gift
     */
    background?: TelegramGiftBackground;
    /**
     * Optional. The total number of different unique gifts that can be obtained by upgrading the gift
     */
    unique_gift_variant_count?: number;
    /**
     * Optional. Information about the chat that published the gift
     */
    publisher_chat?: TelegramChat;
}

/**
 * This object describes the background of a gift.
 */
export interface TelegramGiftBackground {
    /**
     * Center color of the background in RGB format
     */
    center_color: number;
    /**
     * Edge color of the background in RGB format
     */
    edge_color: number;
    /**
     * Text color of the background in RGB format
     */
    text_color: number;
}

/**
 * Describes a service message about a regular gift that was sent or received.
 */
export interface TelegramGiftInfo {
    /**
     * Information about the gift
     */
    gift: TelegramGift;
    /**
     * Optional. Unique identifier of the received gift for the bot; only present for gifts received on behalf of business accounts
     */
    owned_gift_id?: string;
    /**
     * Optional. Number of Telegram Stars that can be claimed by the receiver by converting the gift; omitted if conversion to Telegram Stars is impossible
     */
    convert_star_count?: number;
    /**
     * Optional. Number of Telegram Stars that were prepaid for the ability to upgrade the gift
     */
    prepaid_upgrade_star_count?: number;
    /**
     * Optional. True, if the gift's upgrade was purchased after the gift was sent
     */
    is_upgrade_separate?: true;
    /**
     * Optional. True, if the gift can be upgraded to a unique gift
     */
    can_be_upgraded?: true;
    /**
     * Optional. Text of the message that was added to the gift
     */
    text?: string;
    /**
     * Optional. Special entities that appear in the text
     */
    entities?: TelegramMessageEntity[];
    /**
     * Optional. True, if the sender and gift text are shown only to the gift receiver; otherwise, everyone will be able to see them
     */
    is_private?: true;
    /**
     * Optional. Unique number reserved for this gift when upgraded. See the number field in UniqueGift.
     */
    unique_gift_number?: number;
}

/**
 * This object represent a list of gifts.
 */
export interface TelegramGifts {
    /**
     * The list of gifts
     */
    gifts: TelegramGift[];
}

/**
 * This object represents a message about a scheduled giveaway.
 */
export interface TelegramGiveaway {
    /**
     * The list of chats which the user must join to participate in the giveaway
     */
    chats: TelegramChat[];
    /**
     * Point in time (Unix timestamp) when winners of the giveaway will be selected
     */
    winners_selection_date: number;
    /**
     * The number of users which are supposed to be selected as winners of the giveaway
     */
    winner_count: number;
    /**
     * Optional. True, if only users who join the chats after the giveaway started should be eligible to win
     */
    only_new_members?: true;
    /**
     * Optional. True, if the list of giveaway winners will be visible to everyone
     */
    has_public_winners?: true;
    /**
     * Optional. Description of additional giveaway prize
     */
    prize_description?: string;
    /**
     * Optional. A list of two-letter ISO 3166-1 alpha-2 country codes indicating the countries from which eligible users for the giveaway must come. If empty, then all users can participate in the giveaway. Users with a phone number that was bought on Fragment can always participate in giveaways.
     */
    country_codes?: string[];
    /**
     * Optional. The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only
     */
    prize_star_count?: number;
    /**
     * Optional. The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only
     */
    premium_subscription_month_count?: number;
}

/**
 * This object represents a service message about the completion of a giveaway without public winners.
 */
export interface TelegramGiveawayCompleted {
    /**
     * Number of winners in the giveaway
     */
    winner_count: number;
    /**
     * Optional. Number of undistributed prizes
     */
    unclaimed_prize_count?: number;
    /**
     * Optional. Message with the giveaway that was completed, if it wasn't deleted
     */
    giveaway_message?: TelegramMessage;
    /**
     * Optional. True, if the giveaway is a Telegram Star giveaway. Otherwise, currently, the giveaway is a Telegram Premium giveaway.
     */
    is_star_giveaway?: true;
}

/**
 * This object represents a service message about the creation of a scheduled giveaway.
 */
export interface TelegramGiveawayCreated {
    /**
     * Optional. The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only
     */
    prize_star_count?: number;
}

/**
 * This object represents a message about the completion of a giveaway with public winners.
 */
export interface TelegramGiveawayWinners {
    /**
     * The chat that created the giveaway
     */
    chat: TelegramChat;
    /**
     * Identifier of the message with the giveaway in the chat
     */
    giveaway_message_id: number;
    /**
     * Point in time (Unix timestamp) when winners of the giveaway were selected
     */
    winners_selection_date: number;
    /**
     * Total number of winners in the giveaway
     */
    winner_count: number;
    /**
     * List of up to 100 winners of the giveaway
     */
    winners: TelegramUser[];
    /**
     * Optional. The number of other chats the user had to join in order to be eligible for the giveaway
     */
    additional_chat_count?: number;
    /**
     * Optional. The number of Telegram Stars that were split between giveaway winners; for Telegram Star giveaways only
     */
    prize_star_count?: number;
    /**
     * Optional. The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only
     */
    premium_subscription_month_count?: number;
    /**
     * Optional. Number of undistributed prizes
     */
    unclaimed_prize_count?: number;
    /**
     * Optional. True, if only users who had joined the chats after the giveaway started were eligible to win
     */
    only_new_members?: true;
    /**
     * Optional. True, if the giveaway was canceled because the payment for it was refunded
     */
    was_refunded?: true;
    /**
     * Optional. Description of additional giveaway prize
     */
    prize_description?: string;
}

/**
 * This object describes a message that was deleted or is otherwise inaccessible to the bot.
 */
export interface TelegramInaccessibleMessage {
    /**
     * Chat the message belonged to
     */
    chat: TelegramChat;
    /**
     * Unique message identifier inside the chat
     */
    message_id: number;
    /**
     * Always 0. The field can be used to differentiate regular and inaccessible messages.
     */
    date: number;
}

/**
 * This object represents one button of an inline keyboard. Exactly one of the fields other than text, icon_custom_emoji_id, and style must be used to specify the type of the button.
 */
export interface TelegramInlineKeyboardButton {
    /**
     * Label text on the button
     */
    text: string;
    /**
     * Optional. Unique identifier of the custom emoji shown before the text of the button. Can only be used by bots that purchased additional usernames on Fragment or in the messages directly sent by the bot to private, group and supergroup chats if the owner of the bot has a Telegram Premium subscription.
     */
    icon_custom_emoji_id?: string;
    /**
     * Optional. Style of the button. Must be one of “danger” (red), “success” (green) or “primary” (blue). If omitted, then an app-specific style is used.
     */
    style?: "danger" | "success" | "primary";
    /**
     * Optional. HTTP or tg:// URL to be opened when the button is pressed. Links tg://user?id=<user_id> can be used to mention a user by their identifier without using a username, if this is allowed by their privacy settings.
     */
    url?: string;
    /**
     * Optional. Data to be sent in a callback query to the bot when the button is pressed, 1-64 bytes
     */
    callback_data?: string;
    /**
     * Optional. Description of the Web App that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method answerWebAppQuery. Available only in private chats between a user and the bot. Not supported for messages sent on behalf of a business account and ephemeral messages.
     */
    web_app?: TelegramWebAppInfo;
    /**
     * Optional. An HTTPS URL used to automatically authorize the user. Can be used as a replacement for the Telegram Login Widget. Not supported for ephemeral messages.
     */
    login_url?: TelegramLoginUrl;
    /**
     * Optional. If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot's username and the specified inline query in the input field. May be empty, in which case just the bot's username will be inserted. Not supported for messages sent in channel direct messages chats and on behalf of a business account.
     */
    switch_inline_query?: string;
    /**
     * Optional. If set, pressing the button will insert the bot's username and the specified inline query in the current chat's input field. May be empty, in which case only the bot's username will be inserted.This offers a quick way for the user to open your bot in inline mode in the same chat - good for selecting something from multiple options. Not supported in channels and for messages sent in channel direct messages chats and on behalf of a business account.
     */
    switch_inline_query_current_chat?: string;
    /**
     * Optional. If set, pressing the button will prompt the user to select one of their chats of the specified type, open that chat and insert the bot's username and the specified inline query in the input field. Not supported for messages sent in channel direct messages chats and on behalf of a business account.
     */
    switch_inline_query_chosen_chat?: TelegramSwitchInlineQueryChosenChat;
    /**
     * Optional. Description of the button that copies the specified text to the clipboard
     */
    copy_text?: TelegramCopyTextButton;
    /**
     * Optional. Description of the game that will be launched when the user presses the button.NOTE: This type of button must always be the first button in the first row.
     */
    callback_game?: TelegramCallbackGame;
    /**
     * Optional. Specify True, to send a Pay button. Substrings “” and “XTR” in the buttons's text will be replaced with a Telegram Star icon.NOTE: This type of button must always be the first button in the first row and can only be used in invoice messages.
     */
    pay?: boolean;
    /**
     * Optional. If set, then the button is disabled and does nothing
     */
    disabled?: TelegramDisabledButton;
}

/**
 * This object represents an inline keyboard that appears right next to the message it belongs to.
 */
export interface TelegramInlineKeyboardMarkup {
    /**
     * Array of button rows, each represented by an Array of InlineKeyboardButton objects
     */
    inline_keyboard: TelegramInlineKeyboardButton[][];
    /**
     * Optional. Pass True if the reply interface must be shown to the user, as if they had manually selected the bot's message and tapped 'Reply'. The value of the field can't be changed when the inline keyboard is edited.
     */
    force_reply?: boolean;
}

/**
 * This object represents an incoming inline query. When the user sends an empty query, your bot could return some default or trending results.
 */
export interface TelegramInlineQuery {
    /**
     * Unique identifier for this query
     */
    id: string;
    /**
     * Sender
     */
    from: TelegramUser;
    /**
     * Text of the query (up to 256 characters)
     */
    query: string;
    /**
     * Offset of the results to be returned, can be controlled by the bot
     */
    offset: string;
    /**
     * Optional. Type of the chat from which the inline query was sent. Can be either “sender” for a private chat with the inline query sender, “private”, “group”, “supergroup”, or “channel”. The chat type should be always known for requests sent from official clients and most third-party clients, unless the request was sent from a secret chat.
     */
    chat_type?: "sender" | "private" | "group" | "supergroup" | "channel";
    /**
     * Optional. Sender location, only for bots that request user location
     */
    location?: TelegramLocation;
}

/**
 * This object represents one result of an inline query. Telegram clients currently support results of the following 20 types:
 * Note: All URLs passed in inline query results will be available to end users and therefore must be assumed to be public.
 */
export type TelegramInlineQueryResult = TelegramInlineQueryResultCachedAudio | TelegramInlineQueryResultCachedDocument | TelegramInlineQueryResultCachedGif | TelegramInlineQueryResultCachedMpeg4Gif | TelegramInlineQueryResultCachedPhoto | TelegramInlineQueryResultCachedSticker | TelegramInlineQueryResultCachedVideo | TelegramInlineQueryResultCachedVoice | TelegramInlineQueryResultArticle | TelegramInlineQueryResultAudio | TelegramInlineQueryResultContact | TelegramInlineQueryResultGame | TelegramInlineQueryResultDocument | TelegramInlineQueryResultGif | TelegramInlineQueryResultLocation | TelegramInlineQueryResultMpeg4Gif | TelegramInlineQueryResultPhoto | TelegramInlineQueryResultVenue | TelegramInlineQueryResultVideo | TelegramInlineQueryResultVoice;

/**
 * Represents a link to an article or web page.
 */
export interface TelegramInlineQueryResultArticle {
    /**
     * Type of the result, must be article
     */
    type: "article";
    /**
     * Unique identifier for this result, 1-64 Bytes
     */
    id: string;
    /**
     * Title of the result
     */
    title: string;
    /**
     * Content of the message to be sent
     */
    input_message_content: TelegramInputMessageContent;
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
    /**
     * Optional. URL of the result
     */
    url?: string;
    /**
     * Optional. Short description of the result
     */
    description?: string;
    /**
     * Optional. Url of the thumbnail for the result
     */
    thumbnail_url?: string;
    /**
     * Optional. Thumbnail width
     */
    thumbnail_width?: number;
    /**
     * Optional. Thumbnail height
     */
    thumbnail_height?: number;
}

/**
 * Represents a link to an MP3 audio file. By default, this audio file will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the audio.
 */
export interface TelegramInlineQueryResultAudio {
    /**
     * Type of the result, must be audio
     */
    type: "audio";
    /**
     * Unique identifier for this result, 1-64 bytes
     */
    id: string;
    /**
     * A valid URL for the audio file
     */
    audio_url: string;
    /**
     * Title
     */
    title: string;
    /**
     * Optional. Caption, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the audio caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Performer
     */
    performer?: string;
    /**
     * Optional. Audio duration in seconds
     */
    audio_duration?: number;
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the audio
     */
    input_message_content?: TelegramInputMessageContent;
}

/**
 * Represents a link to an MP3 audio file stored on the Telegram servers. By default, this audio file will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the audio.
 */
export interface TelegramInlineQueryResultCachedAudio {
    /**
     * Type of the result, must be audio
     */
    type: "audio";
    /**
     * Unique identifier for this result, 1-64 bytes
     */
    id: string;
    /**
     * A valid file identifier for the audio file
     */
    audio_file_id: string;
    /**
     * Optional. Caption, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the audio caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the audio
     */
    input_message_content?: TelegramInputMessageContent;
}

/**
 * Represents a link to a file stored on the Telegram servers. By default, this file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the file.
 */
export interface TelegramInlineQueryResultCachedDocument {
    /**
     * Type of the result, must be document
     */
    type: "document";
    /**
     * Unique identifier for this result, 1-64 bytes
     */
    id: string;
    /**
     * Title for the result
     */
    title: string;
    /**
     * A valid file identifier for the file
     */
    document_file_id: string;
    /**
     * Optional. Short description of the result
     */
    description?: string;
    /**
     * Optional. Caption of the document to be sent, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the document caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the file
     */
    input_message_content?: TelegramInputMessageContent;
}

/**
 * Represents a link to an animated GIF file stored on the Telegram servers. By default, this animated GIF file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with specified content instead of the animation.
 */
export interface TelegramInlineQueryResultCachedGif {
    /**
     * Type of the result, must be gif
     */
    type: "gif";
    /**
     * Unique identifier for this result, 1-64 bytes
     */
    id: string;
    /**
     * A valid file identifier for the GIF file
     */
    gif_file_id: string;
    /**
     * Optional. Title for the result
     */
    title?: string;
    /**
     * Optional. Caption of the GIF file to be sent, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Pass True if the caption must be shown above the message media
     */
    show_caption_above_media?: boolean;
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the GIF animation
     */
    input_message_content?: TelegramInputMessageContent;
}

/**
 * Represents a link to a video animation (H.264/MPEG-4 AVC video without sound) stored on the Telegram servers. By default, this animated MPEG-4 file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation.
 */
export interface TelegramInlineQueryResultCachedMpeg4Gif {
    /**
     * Type of the result, must be mpeg4_gif
     */
    type: "mpeg4_gif";
    /**
     * Unique identifier for this result, 1-64 bytes
     */
    id: string;
    /**
     * A valid file identifier for the MPEG4 file
     */
    mpeg4_file_id: string;
    /**
     * Optional. Title for the result
     */
    title?: string;
    /**
     * Optional. Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Pass True if the caption must be shown above the message media
     */
    show_caption_above_media?: boolean;
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the video animation
     */
    input_message_content?: TelegramInputMessageContent;
}

/**
 * Represents a link to a photo stored on the Telegram servers. By default, this photo will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the photo.
 */
export interface TelegramInlineQueryResultCachedPhoto {
    /**
     * Type of the result, must be photo
     */
    type: "photo";
    /**
     * Unique identifier for this result, 1-64 bytes
     */
    id: string;
    /**
     * A valid file identifier of the photo
     */
    photo_file_id: string;
    /**
     * Optional. Title for the result
     */
    title?: string;
    /**
     * Optional. Short description of the result
     */
    description?: string;
    /**
     * Optional. Caption of the photo to be sent, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the photo caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Pass True if the caption must be shown above the message media
     */
    show_caption_above_media?: boolean;
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the photo
     */
    input_message_content?: TelegramInputMessageContent;
}

/**
 * Represents a link to a sticker stored on the Telegram servers. By default, this sticker will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the sticker.
 */
export interface TelegramInlineQueryResultCachedSticker {
    /**
     * Type of the result, must be sticker
     */
    type: "sticker";
    /**
     * Unique identifier for this result, 1-64 bytes
     */
    id: string;
    /**
     * A valid file identifier of the sticker
     */
    sticker_file_id: string;
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the sticker
     */
    input_message_content?: TelegramInputMessageContent;
}

/**
 * Represents a link to a video file stored on the Telegram servers. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the video.
 */
export interface TelegramInlineQueryResultCachedVideo {
    /**
     * Type of the result, must be video
     */
    type: "video";
    /**
     * Unique identifier for this result, 1-64 bytes
     */
    id: string;
    /**
     * A valid file identifier for the video file
     */
    video_file_id: string;
    /**
     * Title for the result
     */
    title: string;
    /**
     * Optional. Short description of the result
     */
    description?: string;
    /**
     * Optional. Caption of the video to be sent, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the video caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Pass True if the caption must be shown above the message media
     */
    show_caption_above_media?: boolean;
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the video
     */
    input_message_content?: TelegramInputMessageContent;
}

/**
 * Represents a link to a voice message stored on the Telegram servers. By default, this voice message will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the voice message.
 */
export interface TelegramInlineQueryResultCachedVoice {
    /**
     * Type of the result, must be voice
     */
    type: "voice";
    /**
     * Unique identifier for this result, 1-64 bytes
     */
    id: string;
    /**
     * A valid file identifier for the voice message
     */
    voice_file_id: string;
    /**
     * Voice message title
     */
    title: string;
    /**
     * Optional. Caption, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the voice message caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the voice message
     */
    input_message_content?: TelegramInputMessageContent;
}

/**
 * Represents a contact with a phone number. By default, this contact will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the contact.
 */
export interface TelegramInlineQueryResultContact {
    /**
     * Type of the result, must be contact
     */
    type: "contact";
    /**
     * Unique identifier for this result, 1-64 Bytes
     */
    id: string;
    /**
     * Contact's phone number
     */
    phone_number: string;
    /**
     * Contact's first name
     */
    first_name: string;
    /**
     * Optional. Contact's last name
     */
    last_name?: string;
    /**
     * Optional. Additional data about the contact in the form of a vCard, 0-2048 bytes
     */
    vcard?: string;
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the contact
     */
    input_message_content?: TelegramInputMessageContent;
    /**
     * Optional. Url of the thumbnail for the result
     */
    thumbnail_url?: string;
    /**
     * Optional. Thumbnail width
     */
    thumbnail_width?: number;
    /**
     * Optional. Thumbnail height
     */
    thumbnail_height?: number;
}

/**
 * Represents a link to a file. By default, this file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the file. Currently, only .PDF and .ZIP files can be sent using this method.
 */
export interface TelegramInlineQueryResultDocument {
    /**
     * Type of the result, must be document
     */
    type: "document";
    /**
     * Unique identifier for this result, 1-64 bytes
     */
    id: string;
    /**
     * Title for the result
     */
    title: string;
    /**
     * Optional. Caption of the document to be sent, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the document caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * A valid URL for the file
     */
    document_url: string;
    /**
     * MIME type of the content of the file, either “application/pdf” or “application/zip”
     */
    mime_type: "application/pdf" | "application/zip";
    /**
     * Optional. Short description of the result
     */
    description?: string;
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the file
     */
    input_message_content?: TelegramInputMessageContent;
    /**
     * Optional. URL of the thumbnail (JPEG only) for the file
     */
    thumbnail_url?: string;
    /**
     * Optional. Thumbnail width
     */
    thumbnail_width?: number;
    /**
     * Optional. Thumbnail height
     */
    thumbnail_height?: number;
}

/**
 * Represents a Game.
 */
export interface TelegramInlineQueryResultGame {
    /**
     * Type of the result, must be game
     */
    type: "game";
    /**
     * Unique identifier for this result, 1-64 bytes
     */
    id: string;
    /**
     * Short name of the game
     */
    game_short_name: string;
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
}

/**
 * Represents a link to an animated GIF file. By default, this animated GIF file will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation.
 */
export interface TelegramInlineQueryResultGif {
    /**
     * Type of the result, must be gif
     */
    type: "gif";
    /**
     * Unique identifier for this result, 1-64 bytes
     */
    id: string;
    /**
     * A valid URL for the GIF file
     */
    gif_url: string;
    /**
     * Optional. Width of the GIF
     */
    gif_width?: number;
    /**
     * Optional. Height of the GIF
     */
    gif_height?: number;
    /**
     * Optional. Duration of the GIF in seconds
     */
    gif_duration?: number;
    /**
     * URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result
     */
    thumbnail_url: string;
    /**
     * Optional. MIME type of the thumbnail, must be one of “image/jpeg”, “image/gif”, or “video/mp4”. Defaults to “image/jpeg”.
     */
    thumbnail_mime_type?: "image/jpeg" | "image/gif" | "video/mp4";
    /**
     * Optional. Title for the result
     */
    title?: string;
    /**
     * Optional. Caption of the GIF file to be sent, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Pass True if the caption must be shown above the message media
     */
    show_caption_above_media?: boolean;
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the GIF animation
     */
    input_message_content?: TelegramInputMessageContent;
}

/**
 * Represents a location on a map. By default, the location will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the location.
 */
export interface TelegramInlineQueryResultLocation {
    /**
     * Type of the result, must be location
     */
    type: "location";
    /**
     * Unique identifier for this result, 1-64 Bytes
     */
    id: string;
    /**
     * Location latitude in degrees
     */
    latitude: number;
    /**
     * Location longitude in degrees
     */
    longitude: number;
    /**
     * Location title
     */
    title: string;
    /**
     * Optional. The radius of uncertainty for the location, measured in meters; 0-1500
     */
    horizontal_accuracy?: number;
    /**
     * Optional. Period in seconds during which the location can be updated, must be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely
     */
    live_period?: number;
    /**
     * Optional. For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.
     */
    heading?: number;
    /**
     * Optional. For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.
     */
    proximity_alert_radius?: number;
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the location
     */
    input_message_content?: TelegramInputMessageContent;
    /**
     * Optional. Url of the thumbnail for the result
     */
    thumbnail_url?: string;
    /**
     * Optional. Thumbnail width
     */
    thumbnail_width?: number;
    /**
     * Optional. Thumbnail height
     */
    thumbnail_height?: number;
}

/**
 * Represents a link to a video animation (H.264/MPEG-4 AVC video without sound). By default, this animated MPEG-4 file will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation.
 */
export interface TelegramInlineQueryResultMpeg4Gif {
    /**
     * Type of the result, must be mpeg4_gif
     */
    type: "mpeg4_gif";
    /**
     * Unique identifier for this result, 1-64 bytes
     */
    id: string;
    /**
     * A valid URL for the MPEG4 file
     */
    mpeg4_url: string;
    /**
     * Optional. Video width
     */
    mpeg4_width?: number;
    /**
     * Optional. Video height
     */
    mpeg4_height?: number;
    /**
     * Optional. Video duration in seconds
     */
    mpeg4_duration?: number;
    /**
     * URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result
     */
    thumbnail_url: string;
    /**
     * Optional. MIME type of the thumbnail, must be one of “image/jpeg”, “image/gif”, or “video/mp4”. Defaults to “image/jpeg”.
     */
    thumbnail_mime_type?: "image/jpeg" | "image/gif" | "video/mp4";
    /**
     * Optional. Title for the result
     */
    title?: string;
    /**
     * Optional. Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Pass True if the caption must be shown above the message media
     */
    show_caption_above_media?: boolean;
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the video animation
     */
    input_message_content?: TelegramInputMessageContent;
}

/**
 * Represents a link to a photo. By default, this photo will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the photo.
 */
export interface TelegramInlineQueryResultPhoto {
    /**
     * Type of the result, must be photo
     */
    type: "photo";
    /**
     * Unique identifier for this result, 1-64 bytes
     */
    id: string;
    /**
     * A valid URL of the photo. Photo must be in JPEG format. Photo size must not exceed 5MB.
     */
    photo_url: string;
    /**
     * URL of the thumbnail for the photo
     */
    thumbnail_url: string;
    /**
     * Optional. Width of the photo
     */
    photo_width?: number;
    /**
     * Optional. Height of the photo
     */
    photo_height?: number;
    /**
     * Optional. Title for the result
     */
    title?: string;
    /**
     * Optional. Short description of the result
     */
    description?: string;
    /**
     * Optional. Caption of the photo to be sent, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the photo caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Pass True if the caption must be shown above the message media
     */
    show_caption_above_media?: boolean;
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the photo
     */
    input_message_content?: TelegramInputMessageContent;
}

/**
 * This object represents a button to be shown above inline query results. You must use exactly one of the optional fields.
 */
export interface TelegramInlineQueryResultsButton {
    /**
     * Label text on the button
     */
    text: string;
    /**
     * Optional. Description of the Web App that will be launched when the user presses the button. The Web App will be able to switch back to the inline mode using the method switchInlineQuery inside the Web App.
     */
    web_app?: TelegramWebAppInfo;
    /**
     * Optional. Deep-linking parameter for the /start message sent to the bot when a user presses the button. 1-64 characters, only A-Z, a-z, 0-9, _ and - are allowed.Example: An inline bot that sends YouTube videos can ask the user to connect the bot to their YouTube account to adapt search results accordingly. To do this, it displays a 'Connect your YouTube account' button above the results, or even before showing any. The user presses the button, switches to a private chat with the bot and, in doing so, passes a start parameter that instructs the bot to return an OAuth link. Once done, the bot can offer a switch_inline button so that the user can easily return to the chat where they wanted to use the bot's inline capabilities.
     */
    start_parameter?: string;
}

/**
 * Represents a venue. By default, the venue will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the venue.
 */
export interface TelegramInlineQueryResultVenue {
    /**
     * Type of the result, must be venue
     */
    type: "venue";
    /**
     * Unique identifier for this result, 1-64 Bytes
     */
    id: string;
    /**
     * Latitude of the venue location in degrees
     */
    latitude: number;
    /**
     * Longitude of the venue location in degrees
     */
    longitude: number;
    /**
     * Title of the venue
     */
    title: string;
    /**
     * Address of the venue
     */
    address: string;
    /**
     * Optional. Foursquare identifier of the venue if known
     */
    foursquare_id?: string;
    /**
     * Optional. Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)
     */
    foursquare_type?: string;
    /**
     * Optional. Google Places identifier of the venue
     */
    google_place_id?: string;
    /**
     * Optional. Google Places type of the venue. (See supported types.)
     */
    google_place_type?: string;
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the venue
     */
    input_message_content?: TelegramInputMessageContent;
    /**
     * Optional. Url of the thumbnail for the result
     */
    thumbnail_url?: string;
    /**
     * Optional. Thumbnail width
     */
    thumbnail_width?: number;
    /**
     * Optional. Thumbnail height
     */
    thumbnail_height?: number;
}

/**
 * Represents a link to a page containing an embedded video player or a video file. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the video.
 */
export interface TelegramInlineQueryResultVideo {
    /**
     * Type of the result, must be video
     */
    type: "video";
    /**
     * Unique identifier for this result, 1-64 bytes
     */
    id: string;
    /**
     * A valid URL for the embedded video player or video file
     */
    video_url: string;
    /**
     * MIME type of the content of the video URL, “text/html” or “video/mp4”
     */
    mime_type: string;
    /**
     * URL of the thumbnail (JPEG only) for the video
     */
    thumbnail_url: string;
    /**
     * Title for the result
     */
    title: string;
    /**
     * Optional. Caption of the video to be sent, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the video caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Pass True if the caption must be shown above the message media
     */
    show_caption_above_media?: boolean;
    /**
     * Optional. Video width
     */
    video_width?: number;
    /**
     * Optional. Video height
     */
    video_height?: number;
    /**
     * Optional. Video duration in seconds
     */
    video_duration?: number;
    /**
     * Optional. Short description of the result
     */
    description?: string;
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the video. This field is required if InlineQueryResultVideo is used to send an HTML-page as a result (e.g., a YouTube video).
     */
    input_message_content?: TelegramInputMessageContent;
}

/**
 * Represents a link to a voice recording in an .OGG container encoded with OPUS. By default, this voice recording will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the the voice message.
 */
export interface TelegramInlineQueryResultVoice {
    /**
     * Type of the result, must be voice
     */
    type: "voice";
    /**
     * Unique identifier for this result, 1-64 bytes
     */
    id: string;
    /**
     * A valid URL for the voice recording
     */
    voice_url: string;
    /**
     * Recording title
     */
    title: string;
    /**
     * Optional. Caption, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the voice message caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Recording duration in seconds
     */
    voice_duration?: number;
    /**
     * Optional. Inline keyboard attached to the message
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
    /**
     * Optional. Content of the message to be sent instead of the voice recording
     */
    input_message_content?: TelegramInputMessageContent;
}

/**
 * Describes a checklist to create.
 */
export interface TelegramInputChecklist {
    /**
     * Title of the checklist; 1-255 characters after entities parsing
     */
    title: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the title. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the title, which can be specified instead of parse_mode. Currently, only bold, italic, underline, strikethrough, spoiler, custom_emoji, and date_time entities are allowed.
     */
    title_entities?: TelegramMessageEntity[];
    /**
     * List of 1-30 tasks in the checklist
     */
    tasks: TelegramInputChecklistTask[];
    /**
     * Optional. Pass True if other users can add tasks to the checklist
     */
    others_can_add_tasks?: boolean;
    /**
     * Optional. Pass True if other users can mark tasks as done or not done in the checklist
     */
    others_can_mark_tasks_as_done?: boolean;
}

/**
 * Describes a task to add to a checklist.
 */
export interface TelegramInputChecklistTask {
    /**
     * Unique identifier of the task; must be positive and unique among all task identifiers currently present in the checklist
     */
    id: number;
    /**
     * Text of the task; 1-100 characters after entities parsing
     */
    text: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the text. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the text, which can be specified instead of parse_mode. Currently, only bold, italic, underline, strikethrough, spoiler, custom_emoji, and date_time entities are allowed.
     */
    text_entities?: TelegramMessageEntity[];
}

/**
 * Represents the content of a contact message to be sent as the result of an inline query.
 */
export interface TelegramInputContactMessageContent {
    /**
     * Contact's phone number
     */
    phone_number: string;
    /**
     * Contact's first name
     */
    first_name: string;
    /**
     * Optional. Contact's last name
     */
    last_name?: string;
    /**
     * Optional. Additional data about the contact in the form of a vCard, 0-2048 bytes
     */
    vcard?: string;
}

/**
 * This object represents the contents of a file to be uploaded. Must be posted using multipart/form-data in the usual way that files are uploaded via the browser.
 */
export interface TelegramInputFile {
}

/**
 * Represents the content of an invoice message to be sent as the result of an inline query.
 */
export interface TelegramInputInvoiceMessageContent {
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
     * Optional. Payment provider token, obtained via @BotFather. Pass an empty string for payments in Telegram Stars.
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
     * Optional. The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in Telegram Stars.
     */
    max_tip_amount?: number;
    /**
     * Optional. A JSON-serialized Array of suggested amounts of tip in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount.
     */
    suggested_tip_amounts?: number[];
    /**
     * Optional. A JSON-serialized object for data about the invoice, which will be shared with the payment provider. A detailed description of the required fields should be provided by the payment provider.
     */
    provider_data?: string;
    /**
     * Optional. URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service.
     */
    photo_url?: string;
    /**
     * Optional. Photo size in bytes
     */
    photo_size?: number;
    /**
     * Optional. Photo width
     */
    photo_width?: number;
    /**
     * Optional. Photo height
     */
    photo_height?: number;
    /**
     * Optional. Pass True if you require the user's full name to complete the order. Ignored for payments in Telegram Stars.
     */
    need_name?: boolean;
    /**
     * Optional. Pass True if you require the user's phone number to complete the order. Ignored for payments in Telegram Stars.
     */
    need_phone_number?: boolean;
    /**
     * Optional. Pass True if you require the user's email address to complete the order. Ignored for payments in Telegram Stars.
     */
    need_email?: boolean;
    /**
     * Optional. Pass True if you require the user's shipping address to complete the order. Ignored for payments in Telegram Stars.
     */
    need_shipping_address?: boolean;
    /**
     * Optional. Pass True if the user's phone number should be sent to the provider. Ignored for payments in Telegram Stars.
     */
    send_phone_number_to_provider?: boolean;
    /**
     * Optional. Pass True if the user's email address should be sent to the provider. Ignored for payments in Telegram Stars.
     */
    send_email_to_provider?: boolean;
    /**
     * Optional. Pass True if the final price depends on the shipping method. Ignored for payments in Telegram Stars.
     */
    is_flexible?: boolean;
}

/**
 * Represents the content of a location message to be sent as the result of an inline query.
 */
export interface TelegramInputLocationMessageContent {
    /**
     * Latitude of the location in degrees
     */
    latitude: number;
    /**
     * Longitude of the location in degrees
     */
    longitude: number;
    /**
     * Optional. The radius of uncertainty for the location, measured in meters; 0-1500
     */
    horizontal_accuracy?: number;
    /**
     * Optional. Period in seconds during which the location can be updated, must be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely
     */
    live_period?: number;
    /**
     * Optional. For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.
     */
    heading?: number;
    /**
     * Optional. For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.
     */
    proximity_alert_radius?: number;
}

/**
 * This object represents the content of a media message to be sent. It should be one of
 */
export type TelegramInputMedia = TelegramInputMediaAnimation | TelegramInputMediaAudio | TelegramInputMediaDocument | TelegramInputMediaLivePhoto | TelegramInputMediaPhoto | TelegramInputMediaVideo;

/**
 * Represents an animation file (GIF or H.264/MPEG-4 AVC video without sound) to be sent.
 */
export interface TelegramInputMediaAnimation {
    /**
     * Type of the media, must be animation
     */
    type: "animation";
    /**
     * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files »
     */
    media: string;
    /**
     * Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files »
     */
    thumbnail?: string;
    /**
     * Optional. Caption of the animation to be sent, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the animation caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Pass True if the caption must be shown above the message media
     */
    show_caption_above_media?: boolean;
    /**
     * Optional. Animation width
     */
    width?: number;
    /**
     * Optional. Animation height
     */
    height?: number;
    /**
     * Optional. Animation duration in seconds
     */
    duration?: number;
    /**
     * Optional. Pass True if the animation needs to be covered with a spoiler animation
     */
    has_spoiler?: boolean;
}

/**
 * Represents an audio file to be treated as music to be sent.
 */
export interface TelegramInputMediaAudio {
    /**
     * Type of the media, must be audio
     */
    type: "audio";
    /**
     * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files »
     */
    media: string;
    /**
     * Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files »
     */
    thumbnail?: string;
    /**
     * Optional. Caption of the audio to be sent, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the audio caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Duration of the audio in seconds
     */
    duration?: number;
    /**
     * Optional. Performer of the audio
     */
    performer?: string;
    /**
     * Optional. Title of the audio
     */
    title?: string;
}

/**
 * Represents a general file to be sent.
 */
export interface TelegramInputMediaDocument {
    /**
     * Type of the media, must be document
     */
    type: "document";
    /**
     * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files »
     */
    media: string;
    /**
     * Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files »
     */
    thumbnail?: string;
    /**
     * Optional. Caption of the document to be sent, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the document caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Disables automatic server-side content type detection for files uploaded using multipart/form-data. Always True, if the document is sent as part of an album.
     */
    disable_content_type_detection?: boolean;
}

/**
 * Represents an HTTP link to be sent.
 */
export interface TelegramInputMediaLink {
    /**
     * Type of the media, must be link
     */
    type: "link";
    /**
     * HTTP URL of the link
     */
    url: string;
}

/**
 * Represents a live photo to be sent.
 */
export interface TelegramInputMediaLivePhoto {
    /**
     * Type of the media, must be live_photo
     */
    type: "live_photo";
    /**
     * Video of the live photo to send. Pass a file_id to send a file that exists on the Telegram servers (recommended) or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files ». Sending live photos by a URL is currently unsupported.
     */
    media: string;
    /**
     * The static photo to send. Pass a file_id to send a file that exists on the Telegram servers (recommended) or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files ». Sending live photos by a URL is currently unsupported.
     */
    photo: string;
    /**
     * Optional. Caption of the live photo to be sent, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the live photo caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Pass True if the caption must be shown above the message media
     */
    show_caption_above_media?: boolean;
    /**
     * Optional. Pass True if the live photo needs to be covered with a spoiler animation
     */
    has_spoiler?: boolean;
}

/**
 * Represents a location to be sent.
 */
export interface TelegramInputMediaLocation {
    /**
     * Type of the media, must be location
     */
    type: "location";
    /**
     * Latitude of the location
     */
    latitude: number;
    /**
     * Longitude of the location
     */
    longitude: number;
    /**
     * Optional. The radius of uncertainty for the location, measured in meters; 0-1500
     */
    horizontal_accuracy?: number;
}

/**
 * Represents a photo to be sent.
 */
export interface TelegramInputMediaPhoto {
    /**
     * Type of the media, must be photo
     */
    type: "photo";
    /**
     * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files »
     */
    media: string;
    /**
     * Optional. Caption of the photo to be sent, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the photo caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Pass True if the caption must be shown above the message media
     */
    show_caption_above_media?: boolean;
    /**
     * Optional. Pass True if the photo needs to be covered with a spoiler animation
     */
    has_spoiler?: boolean;
}

/**
 * Represents a sticker file to be sent.
 */
export interface TelegramInputMediaSticker {
    /**
     * Type of the media, must be sticker
     */
    type: "sticker";
    /**
     * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a .WEBP sticker from the Internet, or pass “attach://<file_attach_name>” to upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data under <file_attach_name> name. More information on Sending Files »
     */
    media: string;
    /**
     * Optional. Emoji associated with the sticker; only for just uploaded stickers
     */
    emoji?: string;
}

/**
 * Represents a venue to be sent.
 */
export interface TelegramInputMediaVenue {
    /**
     * Type of the media, must be venue
     */
    type: "venue";
    /**
     * Latitude of the location
     */
    latitude: number;
    /**
     * Longitude of the location
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
     * Optional. Foursquare identifier of the venue
     */
    foursquare_id?: string;
    /**
     * Optional. Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)
     */
    foursquare_type?: string;
    /**
     * Optional. Google Places identifier of the venue
     */
    google_place_id?: string;
    /**
     * Optional. Google Places type of the venue. (See supported types.)
     */
    google_place_type?: string;
}

/**
 * Represents a video to be sent.
 */
export interface TelegramInputMediaVideo {
    /**
     * Type of the media, must be video
     */
    type: "video";
    /**
     * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files »
     */
    media: string;
    /**
     * Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files »
     */
    thumbnail?: string;
    /**
     * Optional. Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files »
     */
    cover?: string;
    /**
     * Optional. Start timestamp for the video in the message
     */
    start_timestamp?: number;
    /**
     * Optional. Caption of the video to be sent, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the video caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Pass True if the caption must be shown above the message media
     */
    show_caption_above_media?: boolean;
    /**
     * Optional. Video width
     */
    width?: number;
    /**
     * Optional. Video height
     */
    height?: number;
    /**
     * Optional. Video duration in seconds
     */
    duration?: number;
    /**
     * Optional. Pass True if the uploaded video is suitable for streaming
     */
    supports_streaming?: boolean;
    /**
     * Optional. Pass True if the video needs to be covered with a spoiler animation
     */
    has_spoiler?: boolean;
}

/**
 * Represents a voice message file to be sent.
 */
export interface TelegramInputMediaVoiceNote {
    /**
     * Type of the media, must be voice_note
     */
    type: "voice_note";
    /**
     * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files »
     */
    media: string;
    /**
     * Optional. Caption of the voice message to be sent, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the voice message caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Duration of the voice message in seconds
     */
    duration?: number;
}

/**
 * This object represents the content of a message to be sent as a result of an inline query. Telegram clients currently support the following types:
 */
export type TelegramInputMessageContent = TelegramInputTextMessageContent | TelegramInputRichMessageContent | TelegramInputLocationMessageContent | TelegramInputVenueMessageContent | TelegramInputContactMessageContent | TelegramInputInvoiceMessageContent | TelegramInputWidgetMessageContent | TelegramInputSharedWidgetMessageContent;

/**
 * This object describes the paid media to be sent. Currently, it can be one of
 */
export type TelegramInputPaidMedia = TelegramInputPaidMediaLivePhoto | TelegramInputPaidMediaPhoto | TelegramInputPaidMediaVideo;

/**
 * The paid media to send is a live photo.
 */
export interface TelegramInputPaidMediaLivePhoto {
    /**
     * Type of the media, must be live_photo
     */
    type: "live_photo";
    /**
     * Video of the live photo to send. Pass a file_id to send a file that exists on the Telegram servers (recommended) or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files ». Sending live photos by a URL is currently unsupported.
     */
    media: string;
    /**
     * The static photo to send. Pass a file_id to send a file that exists on the Telegram servers (recommended) or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files ». Sending live photos by a URL is currently unsupported.
     */
    photo: string;
}

/**
 * The paid media to send is a photo.
 */
export interface TelegramInputPaidMediaPhoto {
    /**
     * Type of the media, must be photo
     */
    type: "photo";
    /**
     * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files »
     */
    media: string;
}

/**
 * The paid media to send is a video.
 */
export interface TelegramInputPaidMediaVideo {
    /**
     * Type of the media, must be video
     */
    type: "video";
    /**
     * File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files »
     */
    media: string;
    /**
     * Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files »
     */
    thumbnail?: string;
    /**
     * Optional. Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files »
     */
    cover?: string;
    /**
     * Optional. Start timestamp for the video in the message
     */
    start_timestamp?: number;
    /**
     * Optional. Video width
     */
    width?: number;
    /**
     * Optional. Video height
     */
    height?: number;
    /**
     * Optional. Video duration in seconds
     */
    duration?: number;
    /**
     * Optional. Pass True if the uploaded video is suitable for streaming
     */
    supports_streaming?: boolean;
}

/**
 * This object represents the content of a poll description or a quiz explanation to be sent. It should be one of
 */
export type TelegramInputPollMedia = TelegramInputMediaAnimation | TelegramInputMediaAudio | TelegramInputMediaDocument | TelegramInputMediaLivePhoto | TelegramInputMediaLocation | TelegramInputMediaPhoto | TelegramInputMediaVenue | TelegramInputMediaVideo;

/**
 * This object contains information about one answer option in a poll to be sent.
 */
export interface TelegramInputPollOption {
    /**
     * Option text, 1-100 characters
     */
    text: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the text. See formatting options for more details. Currently, only custom emoji entities are allowed.
     */
    text_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. A JSON-serialized list of special entities that appear in the poll option text. It can be specified instead of text_parse_mode.
     */
    text_entities?: TelegramMessageEntity[];
    /**
     * Optional. Media added to the poll option
     */
    media?: TelegramInputPollOptionMedia;
}

/**
 * This object represents the content of a poll option to be sent. It should be one of
 */
export type TelegramInputPollOptionMedia = TelegramInputMediaAnimation | TelegramInputMediaLink | TelegramInputMediaLivePhoto | TelegramInputMediaLocation | TelegramInputMediaPhoto | TelegramInputMediaSticker | TelegramInputMediaVenue | TelegramInputMediaVideo;

/**
 * This object describes a profile photo to set. Currently, it can be one of
 */
export type TelegramInputProfilePhoto = TelegramInputProfilePhotoStatic | TelegramInputProfilePhotoAnimated;

/**
 * An animated profile photo in the MPEG4 format.
 */
export interface TelegramInputProfilePhotoAnimated {
    /**
     * Type of the profile photo, must be animated
     */
    type: "animated";
    /**
     * The animated profile photo. Profile photos can't be reused and can only be uploaded as a new file, so you can pass “attach://<file_attach_name>” if the photo was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files »
     */
    animation: string;
    /**
     * Optional. Timestamp in seconds of the frame that will be used as the static profile photo. Defaults to 0.0.
     */
    main_frame_timestamp?: number;
}

/**
 * A static profile photo in the .JPG format.
 */
export interface TelegramInputProfilePhotoStatic {
    /**
     * Type of the profile photo, must be static
     */
    type: "static";
    /**
     * The static profile photo. Profile photos can't be reused and can only be uploaded as a new file, so you can pass “attach://<file_attach_name>” if the photo was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files »
     */
    photo: string;
}

/**
 * This object represents a block in a rich formatted message to be sent. Currently, it can be any of the following types:
 */
export type TelegramInputRichBlock = TelegramInputRichBlockParagraph | TelegramInputRichBlockSectionHeading | TelegramInputRichBlockPreformatted | TelegramInputRichBlockFooter | TelegramInputRichBlockDivider | TelegramInputRichBlockMathematicalExpression | TelegramInputRichBlockAnchor | TelegramInputRichBlockList | TelegramInputRichBlockBlockQuotation | TelegramInputRichBlockExpandableBlockQuotation | TelegramInputRichBlockPullQuotation | TelegramInputRichBlockCollage | TelegramInputRichBlockSlideshow | TelegramInputRichBlockTable | TelegramInputRichBlockDetails | TelegramInputRichBlockMap | TelegramInputRichBlockButtons | TelegramInputRichBlockAnimation | TelegramInputRichBlockAudio | TelegramInputRichBlockDocument | TelegramInputRichBlockPhoto | TelegramInputRichBlockVideo | TelegramInputRichBlockVoiceNote | TelegramInputRichBlockThinking;

/**
 * A block with an anchor, corresponding to the HTML tag <a> with the attribute name.
 */
export interface TelegramInputRichBlockAnchor {
    /**
     * Type of the block, always “anchor”
     */
    type: "anchor";
    /**
     * The name of the anchor
     */
    name: string;
}

/**
 * A block with an animation, corresponding to the HTML tag <video>.
 */
export interface TelegramInputRichBlockAnimation {
    /**
     * Type of the block, always “animation”
     */
    type: "animation";
    /**
     * The animation. Caption is ignored.
     */
    animation: TelegramInputMediaAnimation;
    /**
     * Optional. Caption of the block
     */
    caption?: TelegramRichBlockCaption;
}

/**
 * A block with a music file, corresponding to the HTML tag <audio>.
 */
export interface TelegramInputRichBlockAudio {
    /**
     * Type of the block, always “audio”
     */
    type: "audio";
    /**
     * The audio. Caption is ignored.
     */
    audio: TelegramInputMediaAudio;
    /**
     * Optional. Caption of the block
     */
    caption?: TelegramRichBlockCaption;
}

/**
 * A block quotation, corresponding to the HTML tag <blockquote>.
 */
export interface TelegramInputRichBlockBlockQuotation {
    /**
     * Type of the block, always “blockquote”
     */
    type: "blockquote";
    /**
     * Content of the block
     */
    blocks: TelegramInputRichBlock[];
    /**
     * Optional. Credit of the block
     */
    credit?: TelegramRichText;
}

/**
 * A block containing a list of buttons that are shown in one row, corresponding to the custom HTML tag <tg-button-row>.
 */
export interface TelegramInputRichBlockButtons {
    /**
     * Type of the block, always “buttons”
     */
    type: "buttons";
    /**
     * List of 1-8 buttons to send
     */
    buttons: TelegramRichMessageButton[];
    /**
     * Optional. Horizontal alignment of the buttons. Currently, must be one of “left”, “center”, or “right”.
     */
    align?: "left" | "center" | "right";
}

/**
 * A collage, corresponding to the custom HTML tag <tg-collage>.
 */
export interface TelegramInputRichBlockCollage {
    /**
     * Type of the block, always “collage”
     */
    type: "collage";
    /**
     * Elements of the collage
     */
    blocks: TelegramInputRichBlock[];
    /**
     * Optional. Caption of the block
     */
    caption?: TelegramRichBlockCaption;
}

/**
 * An expandable block for details disclosure, corresponding to the HTML tag <details>.
 */
export interface TelegramInputRichBlockDetails {
    /**
     * Type of the block, always “details”
     */
    type: "details";
    /**
     * Always shown summary of the block
     */
    summary: TelegramRichText;
    /**
     * Content of the block
     */
    blocks: TelegramInputRichBlock[];
    /**
     * Optional. Pass True if the content of the block is visible by default
     */
    is_open?: true;
}

/**
 * A divider, corresponding to the HTML tag <hr/>.
 */
export interface TelegramInputRichBlockDivider {
    /**
     * Type of the block, always “divider”
     */
    type: "divider";
}

/**
 * A block with a general file, corresponding to the custom HTML tag <tg-document>.
 */
export interface TelegramInputRichBlockDocument {
    /**
     * Type of the block, always “document”
     */
    type: "document";
    /**
     * The document. Caption is ignored.
     */
    document: TelegramInputMediaDocument;
    /**
     * Optional. Caption of the block
     */
    caption?: TelegramRichBlockCaption;
}

/**
 * A block quotation, corresponding to the HTML tag <blockquote> with custom attribute "expandable".
 */
export interface TelegramInputRichBlockExpandableBlockQuotation {
    /**
     * Type of the block, always “expandable_blockquote”
     */
    type: "expandable_blockquote";
    /**
     * Content of the block
     */
    text: TelegramRichText;
    /**
     * Optional. Credit of the block
     */
    credit?: TelegramRichText;
}

/**
 * A footer, corresponding to the HTML tag <footer>.
 */
export interface TelegramInputRichBlockFooter {
    /**
     * Type of the block, always “footer”
     */
    type: "footer";
    /**
     * Text of the block
     */
    text: TelegramRichText;
}

/**
 * A list of blocks, corresponding to the HTML tag <ul> or <ol> with multiple nested tags <li>.
 */
export interface TelegramInputRichBlockList {
    /**
     * Type of the block, always “list”
     */
    type: "list";
    /**
     * Items of the list
     */
    items: TelegramInputRichBlockListItem[];
}

/**
 * An item of a list to be sent.
 */
export interface TelegramInputRichBlockListItem {
    /**
     * The content of the item
     */
    blocks: TelegramInputRichBlock[];
    /**
     * Optional. Pass True if the item has a checkbox
     */
    has_checkbox?: true;
    /**
     * Optional. Pass True if the item has a checked checkbox
     */
    is_checked?: true;
    /**
     * Optional. For ordered lists, the numeric value of the item label
     */
    value?: number;
    /**
     * Optional. For ordered lists, the type of the item label; must be one of “a” for lowercase letters, “A” for uppercase letters, “i” for lowercase Roman numerals, “I” for uppercase Roman numerals, or “1” for decimal numbers
     */
    type?: "a" | "A" | "i" | "I" | "1";
}

/**
 * A block with a map, corresponding to the custom HTML tag <tg-map>. The map's width and height must not exceed 10000 in total. The width and height ratio must be at most 20.
 */
export interface TelegramInputRichBlockMap {
    /**
     * Type of the block, always “map”
     */
    type: "map";
    /**
     * Location of the center of the map
     */
    location: TelegramLocation;
    /**
     * Optional. Map zoom level; 0-24
     */
    zoom?: number;
    /**
     * Optional. Map width; 0-10000
     */
    width?: number;
    /**
     * Optional. Map height; 0-10000
     */
    height?: number;
    /**
     * Optional. Caption of the block
     */
    caption?: TelegramRichBlockCaption;
}

/**
 * A block with a mathematical expression in LaTeX format, corresponding to the custom HTML tag <tg-math-block>.
 */
export interface TelegramInputRichBlockMathematicalExpression {
    /**
     * Type of the block, always “mathematical_expression”
     */
    type: "mathematical_expression";
    /**
     * The mathematical expression in LaTeX format
     */
    expression: string;
}

/**
 * A text paragraph, corresponding to the HTML tag <p>.
 */
export interface TelegramInputRichBlockParagraph {
    /**
     * Type of the block, always “paragraph”
     */
    type: "paragraph";
    /**
     * Text of the block
     */
    text: TelegramRichText;
}

/**
 * A block with a photo, corresponding to the HTML tag <img>.
 */
export interface TelegramInputRichBlockPhoto {
    /**
     * Type of the block, always “photo”
     */
    type: "photo";
    /**
     * The photo. Caption is ignored.
     */
    photo: TelegramInputMediaPhoto;
    /**
     * Optional. Caption of the block
     */
    caption?: TelegramRichBlockCaption;
}

/**
 * A preformatted text block, corresponding to the nested HTML tags <pre> and <code>.
 */
export interface TelegramInputRichBlockPreformatted {
    /**
     * Type of the block, always “pre”
     */
    type: "pre";
    /**
     * Text of the block
     */
    text: TelegramRichText;
    /**
     * Optional. The programming language of the text
     */
    language?: string;
}

/**
 * A quotation with centered text, loosely corresponding to the HTML tag <aside>.
 */
export interface TelegramInputRichBlockPullQuotation {
    /**
     * Type of the block, always “pullquote”
     */
    type: "pullquote";
    /**
     * Text of the block
     */
    text: TelegramRichText;
    /**
     * Optional. Credit of the block
     */
    credit?: TelegramRichText;
}

/**
 * A section heading, corresponding to the HTML tags <h1>, <h2>, <h3>, <h4>, <h5>, or <h6>.
 */
export interface TelegramInputRichBlockSectionHeading {
    /**
     * Type of the block, always “heading”
     */
    type: "heading";
    /**
     * Text of the block
     */
    text: TelegramRichText;
    /**
     * Relative size of the text font; 1-6, 1 is the largest, 6 is the smallest
     */
    size: number;
}

/**
 * A slideshow, corresponding to the custom HTML tag <tg-slideshow>.
 */
export interface TelegramInputRichBlockSlideshow {
    /**
     * Type of the block, always “slideshow”
     */
    type: "slideshow";
    /**
     * Elements of the slideshow
     */
    blocks: TelegramInputRichBlock[];
    /**
     * Optional. Caption of the block
     */
    caption?: TelegramRichBlockCaption;
}

/**
 * A table, corresponding to the HTML tag <table>.
 */
export interface TelegramInputRichBlockTable {
    /**
     * Type of the block, always “table”
     */
    type: "table";
    /**
     * Cells of the table
     */
    cells: TelegramRichBlockTableCell[][];
    /**
     * Optional. Pass True if the table has borders
     */
    is_bordered?: true;
    /**
     * Optional. Pass True if the table is striped
     */
    is_striped?: true;
    /**
     * Optional. Pass True if table cells must have smaller indents
     */
    is_compact?: true;
    /**
     * Optional. Caption of the table
     */
    caption?: TelegramRichText;
}

/**
 * A block with a “Thinking…” placeholder, corresponding to the custom HTML tag <tg-thinking>. The block may be used only in sendRichMessageDraft, therefore it can't be received in messages. See https://t.me/addemoji/AIActions for examples of custom emoji that are recommended for usage in the block.
 */
export interface TelegramInputRichBlockThinking {
    /**
     * Type of the block, always “thinking”
     */
    type: "thinking";
    /**
     * Text of the block. See https://t.me/addemoji/AIActions for examples of custom emoji that are recommended for usage in the block.
     */
    text: TelegramRichText;
}

/**
 * A block with a video, corresponding to the HTML tag <video>.
 */
export interface TelegramInputRichBlockVideo {
    /**
     * Type of the block, always “video”
     */
    type: "video";
    /**
     * The video. Caption is ignored.
     */
    video: TelegramInputMediaVideo;
    /**
     * Optional. Caption of the block
     */
    caption?: TelegramRichBlockCaption;
}

/**
 * A block with a voice note, corresponding to the HTML tag <audio>.
 */
export interface TelegramInputRichBlockVoiceNote {
    /**
     * Type of the block, always “voice_note”
     */
    type: "voice_note";
    /**
     * The voice note. Caption is ignored.
     */
    voice_note: TelegramInputMediaVoiceNote;
    /**
     * Optional. Caption of the block
     */
    caption?: TelegramRichBlockCaption;
}

/**
 * Describes a rich message to be sent. Exactly one of the fields html, markdown, or blocks must be used.
 */
export interface TelegramInputRichMessage {
    /**
     * Optional. Content of the rich message to send described as a list of blocks
     */
    blocks?: TelegramInputRichBlock[];
    /**
     * Optional. Content of the rich message to send described using HTML formatting. See rich message formatting options for more details. Use media field to specify the media used in the message.
     */
    html?: string;
    /**
     * Optional. Content of the rich message to send described using Markdown formatting. See rich message formatting options for more details. Use media field to specify the media used in the message.
     */
    markdown?: string;
    /**
     * Optional. List of media that are specified in the markdown or html fields using tg://photo?id=, tg://video?id=, tg://document?id=, and tg://audio?id= links
     */
    media?: TelegramInputRichMessageMedia[];
    /**
     * Optional. Pass True if the rich message must be shown right-to-left
     */
    is_rtl?: boolean;
    /**
     * Optional. Pass True to skip automatic detection of entities (e.g., URLs, email addresses, username mentions, hashtags, cashtags, bot commands, or phone numbers) in the text
     */
    skip_entity_detection?: boolean;
}

/**
 * Represents the content of a rich message to be sent as the result of an inline query.
 */
export interface TelegramInputRichMessageContent {
    /**
     * The message to be sent. Only previously uploaded files may be used in the message.
     */
    rich_message: TelegramInputRichMessage;
}

/**
 * Describes a media element embedded in an outgoing rich message.
 */
export interface TelegramInputRichMessageMedia {
    /**
     * Unique identifier of the media used in a tg://photo?id=, tg://video?id=, tg://document?id=, or tg://audio?id= link. 1-64 characters, only A-Z, a-z, 0-9, _ and - are allowed.
     */
    id: string;
    /**
     * The media to be sent. Everything except the media itself and its properties is ignored.
     */
    media: TelegramInputMediaAnimation | TelegramInputMediaAudio | TelegramInputMediaDocument | TelegramInputMediaPhoto | TelegramInputMediaVideo | TelegramInputMediaVoiceNote;
}

/**
 * Represents the content of a message with a shared widget to be sent as the result of an inline query. Currently, widgets can't be sent in response to inline queries in the production environment.
 */
export interface TelegramInputSharedWidgetMessageContent {
    /**
     * Unique identifier of the shared widget created by the bot
     */
    widget_id: string;
    /**
     * Optional. Data of the widget, which is specific to the message, 0-1024 bytes
     */
    chat_data?: string;
    /**
     * Optional. Widget caption, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the widget caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Pass True if the caption must be shown above the widget
     */
    show_caption_above_media?: boolean;
}

/**
 * This object describes a sticker to be added to a sticker set.
 */
export interface TelegramInputSticker {
    /**
     * The added sticker. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new file using multipart/form-data under <file_attach_name> name. Animated and video stickers can't be uploaded via HTTP URL. More information on Sending Files »
     */
    sticker: string;
    /**
     * Format of the added sticker, must be one of “static” for a .WEBP or .PNG image, “animated” for a .TGS animation, “video” for a .WEBM video
     */
    format: "static" | "animated" | "video";
    /**
     * List of 1-20 emoji associated with the sticker
     */
    emoji_list: string[];
    /**
     * Optional. Position where the mask should be placed on faces. For “mask” stickers only.
     */
    mask_position?: TelegramMaskPosition;
    /**
     * Optional. List of 0-20 search keywords for the sticker with total length of up to 64 characters. For “regular” and “custom_emoji” stickers only.
     */
    keywords?: string[];
}

/**
 * This object describes the content of a story to post. Currently, it can be one of
 */
export type TelegramInputStoryContent = TelegramInputStoryContentPhoto | TelegramInputStoryContentVideo;

/**
 * Describes a photo to post as a story.
 */
export interface TelegramInputStoryContentPhoto {
    /**
     * Type of the content, must be photo
     */
    type: "photo";
    /**
     * The photo to post as a story. The photo must be of the size 1080x1920 and must not exceed 10 MB. The photo can't be reused and can only be uploaded as a new file, so you can pass “attach://<file_attach_name>” if the photo was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files »
     */
    photo: string;
}

/**
 * Describes a video to post as a story.
 */
export interface TelegramInputStoryContentVideo {
    /**
     * Type of the content, must be video
     */
    type: "video";
    /**
     * The video to post as a story. The video must be of the size 720x1280, streamable, encoded with H.265 codec, with key frames added each second in the MPEG4 format, and must not exceed 30 MB. The video can't be reused and can only be uploaded as a new file, so you can pass “attach://<file_attach_name>” if the video was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files »
     */
    video: string;
    /**
     * Optional. Precise duration of the video in seconds; 0-60
     */
    duration?: number;
    /**
     * Optional. Timestamp in seconds of the frame that will be used as the static cover for the story. Defaults to 0.0.
     */
    cover_frame_timestamp?: number;
    /**
     * Optional. Pass True if the video has no sound
     */
    is_animation?: boolean;
}

/**
 * Represents the content of a text message to be sent as the result of an inline query.
 */
export interface TelegramInputTextMessageContent {
    /**
     * Text of the message to be sent, 1-4096 characters
     */
    message_text: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the message text. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in message text, which can be specified instead of parse_mode
     */
    entities?: TelegramMessageEntity[];
    /**
     * Optional. Link preview generation options for the message
     */
    link_preview_options?: TelegramLinkPreviewOptions;
}

/**
 * Represents the content of a venue message to be sent as the result of an inline query.
 */
export interface TelegramInputVenueMessageContent {
    /**
     * Latitude of the venue in degrees
     */
    latitude: number;
    /**
     * Longitude of the venue in degrees
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
     * Optional. Foursquare identifier of the venue, if known
     */
    foursquare_id?: string;
    /**
     * Optional. Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)
     */
    foursquare_type?: string;
    /**
     * Optional. Google Places identifier of the venue
     */
    google_place_id?: string;
    /**
     * Optional. Google Places type of the venue. (See supported types.)
     */
    google_place_type?: string;
}

/**
 * Represents the content of a message with an HTML widget to be sent as the result of an inline query. Currently, widgets can't be sent in response to inline queries in the production environment.
 */
export interface TelegramInputWidgetMessageContent {
    /**
     * HTML code of the widget, 1-32768 bytes. The code must not exceed 4096 bytes when compressed by zlib with the maximum compression level.
     */
    html: string;
    /**
     * Optional. Width of the widget in logical pixels; omit if the widget must occupy the whole width of the message bubble. The width is clamped by the app to the range from 200 to the maximum width of the message bubble.
     */
    width?: number;
    /**
     * Optional. Height of the widget in logical pixels; omit if the height of the widget isn't fixed. The height is clamped by the app to the range 50-600.
     */
    height?: number;
    /**
     * Optional. Public data of the widget, 0-1024 bytes, which will be available wherever the widget is shown. If the widget is shared, then all messages with it will have the same public data.
     */
    public_data?: string;
    /**
     * Optional. Data of the widget, which is specific to the message, 0-1024 bytes
     */
    chat_data?: string;
    /**
     * Optional. Widget caption, 0-1024 characters after entities parsing
     */
    caption?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the widget caption. See formatting options for more details.
     */
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. Pass True if the caption must be shown above the widget
     */
    show_caption_above_media?: boolean;
    /**
     * Optional. Pass True to allow the widget to send queries to the bot
     */
    allow_queries?: boolean;
    /**
     * Optional. Pass True to create a shared widget. Each message sent from the result creates a separate shared widget, whose identifier is received by the bot only in the field widget_id of queries from the widget. To send an existing shared widget in response to an inline query, use InputSharedWidgetMessageContent instead.
     */
    is_shared?: boolean;
}

/**
 * This object contains basic information about an invoice.
 */
export interface TelegramInvoice {
    /**
     * Product name
     */
    title: string;
    /**
     * Product description
     */
    description: string;
    /**
     * Unique bot deep-linking parameter that can be used to generate this invoice
     */
    start_parameter: string;
    /**
     * Three-letter ISO 4217 currency code, or “XTR” for payments in Telegram Stars
     */
    currency: string;
    /**
     * Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).
     */
    total_amount: number;
}

/**
 * This object represents one button of the reply keyboard. At most one of the fields other than text, icon_custom_emoji_id, and style must be used to specify the type of the button. For simple text buttons, String can be used instead of this object to specify the button text.
 */
export interface TelegramKeyboardButton {
    /**
     * Text of the button. If none of the fields other than text, icon_custom_emoji_id, and style are used, it will be sent as a message when the button is pressed.
     */
    text: string;
    /**
     * Optional. Unique identifier of the custom emoji shown before the text of the button. Can only be used by bots that purchased additional usernames on Fragment or in the messages directly sent by the bot to private, group and supergroup chats if the owner of the bot has a Telegram Premium subscription.
     */
    icon_custom_emoji_id?: string;
    /**
     * Optional. Style of the button. Must be one of “danger” (red), “success” (green) or “primary” (blue). If omitted, then an app-specific style is used.
     */
    style?: "danger" | "success" | "primary";
    /**
     * Optional. If specified, pressing the button will open a list of suitable users. Identifiers of selected users will be sent to the bot in a “users_shared” service message. Available in private chats only.
     */
    request_users?: TelegramKeyboardButtonRequestUsers;
    /**
     * Optional. If specified, pressing the button will open a list of suitable chats. Tapping on a chat will send its identifier to the bot in a “chat_shared” service message. Available in private chats only.
     */
    request_chat?: TelegramKeyboardButtonRequestChat;
    /**
     * Optional. If specified, pressing the button will ask the user to create and share a bot that will be managed by the current bot. Available for bots that enabled management of other bots in the @BotFather Mini App. Available in private chats only.
     */
    request_managed_bot?: TelegramKeyboardButtonRequestManagedBot;
    /**
     * Optional. If True, the user's phone number will be sent as a contact when the button is pressed. Available in private chats only.
     */
    request_contact?: boolean;
    /**
     * Optional. If True, the user's current location will be sent when the button is pressed. Available in private chats only.
     */
    request_location?: boolean;
    /**
     * Optional. If specified, the user will be asked to create a poll and send it to the bot when the button is pressed. Available in private chats only.
     */
    request_poll?: TelegramKeyboardButtonPollType;
    /**
     * Optional. If specified, the described Web App will be launched when the button is pressed. The Web App will be able to send a “web_app_data” service message. Available in private chats only.
     */
    web_app?: TelegramWebAppInfo;
}

/**
 * This object represents type of a poll, which is allowed to be created and sent when the corresponding button is pressed.
 */
export interface TelegramKeyboardButtonPollType {
    /**
     * Optional. If quiz is passed, the user will be allowed to create only polls in the quiz mode. If regular is passed, only regular polls will be allowed. Otherwise, the user will be allowed to create a poll of any type.
     */
    type?: string;
}

/**
 * This object defines the criteria used to request a suitable chat. Information about the selected chat will be shared with the bot when the corresponding button is pressed. The bot will be granted requested rights in the chat if appropriate. More about requesting chats ».
 */
export interface TelegramKeyboardButtonRequestChat {
    /**
     * Signed 32-bit identifier of the request, which will be received back in the ChatShared object. Must be unique within the message.
     */
    request_id: number;
    /**
     * Pass True to request a channel chat, pass False to request a group or a supergroup chat
     */
    chat_is_channel: boolean;
    /**
     * Optional. Pass True to request a forum supergroup, pass False to request a non-forum chat. If not specified, no additional restrictions are applied.
     */
    chat_is_forum?: boolean;
    /**
     * Optional. Pass True to request a supergroup or a channel with a username, pass False to request a chat without a username. If not specified, no additional restrictions are applied.
     */
    chat_has_username?: boolean;
    /**
     * Optional. Pass True to request a chat owned by the user. Otherwise, no additional restrictions are applied.
     */
    chat_is_created?: boolean;
    /**
     * Optional. A JSON-serialized object listing the required administrator rights of the user in the chat. The rights must be a superset of bot_administrator_rights. If not specified, no additional restrictions are applied.
     */
    user_administrator_rights?: TelegramChatAdministratorRights;
    /**
     * Optional. A JSON-serialized object listing the required administrator rights of the bot in the chat. The rights must be a subset of user_administrator_rights. If not specified, no additional restrictions are applied.
     */
    bot_administrator_rights?: TelegramChatAdministratorRights;
    /**
     * Optional. Pass True to request a chat with the bot as a member. Otherwise, no additional restrictions are applied.
     */
    bot_is_member?: boolean;
    /**
     * Optional. Pass True to request the chat's title
     */
    request_title?: boolean;
    /**
     * Optional. Pass True to request the chat's username
     */
    request_username?: boolean;
    /**
     * Optional. Pass True to request the chat's photo
     */
    request_photo?: boolean;
}

/**
 * This object defines the parameters for the creation of a managed bot. Information about the created bot will be shared with the bot using the update managed_bot and a Message with the field managed_bot_created.
 */
export interface TelegramKeyboardButtonRequestManagedBot {
    /**
     * Signed 32-bit identifier of the request. Must be unique within the message.
     */
    request_id: number;
    /**
     * Optional. Suggested name for the bot
     */
    suggested_name?: string;
    /**
     * Optional. Suggested username for the bot. The username must end with “bot”. If the user creating the bot has a Telegram Premium subscription, then the username can also end with “agent”, “ai”, “app”, “game”, or “gay”; in this case, the username will be assigned to the bot as a secondary username, and a regular username ending with “bot” will be assigned to the bot automatically.
     */
    suggested_username?: string;
}

/**
 * This object defines the criteria used to request suitable users. Information about the selected users will be shared with the bot when the corresponding button is pressed. More about requesting users »
 */
export interface TelegramKeyboardButtonRequestUsers {
    /**
     * Signed 32-bit identifier of the request that will be received back in the UsersShared object. Must be unique within the message.
     */
    request_id: number;
    /**
     * Optional. Pass True to request bots, pass False to request regular users. If not specified, no additional restrictions are applied.
     */
    user_is_bot?: boolean;
    /**
     * Optional. Pass True to request premium users, pass False to request non-premium users. If not specified, no additional restrictions are applied.
     */
    user_is_premium?: boolean;
    /**
     * Optional. The maximum number of users to be selected; 1-10. Defaults to 1.
     */
    max_quantity?: number;
    /**
     * Optional. Pass True to request the users' first and last names
     */
    request_name?: boolean;
    /**
     * Optional. Pass True to request the users' usernames
     */
    request_username?: boolean;
    /**
     * Optional. Pass True to request the users' photos
     */
    request_photo?: boolean;
}

/**
 * This object represents a portion of the price for goods or services.
 */
export interface TelegramLabeledPrice {
    /**
     * Portion label
     */
    label: string;
    /**
     * Price of the product in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).
     */
    amount: number;
}

/**
 * Represents an HTTP link.
 */
export interface TelegramLink {
    /**
     * URL of the link
     */
    url: string;
}

/**
 * Describes the options used for link preview generation.
 */
export interface TelegramLinkPreviewOptions {
    /**
     * Optional. True, if the link preview is disabled
     */
    is_disabled?: boolean;
    /**
     * Optional. URL to use for the link preview. If empty, then the first URL found in the message text will be used.
     */
    url?: string;
    /**
     * Optional. True, if the media in the link preview is supposed to be shrunk; ignored if the URL isn't explicitly specified or media size change isn't supported for the preview
     */
    prefer_small_media?: boolean;
    /**
     * Optional. True, if the media in the link preview is supposed to be enlarged; ignored if the URL isn't explicitly specified or media size change isn't supported for the preview
     */
    prefer_large_media?: boolean;
    /**
     * Optional. True, if the link preview must be shown above the message text; otherwise, the link preview will be shown below the message text
     */
    show_above_text?: boolean;
}

/**
 * This object represents a live photo.
 */
export interface TelegramLivePhoto {
    /**
     * Optional. Available sizes of the corresponding static photo
     */
    photo?: TelegramPhotoSize[];
    /**
     * Identifier for the video file which can be used to download or reuse the file
     */
    file_id: string;
    /**
     * Unique identifier for the video file which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    file_unique_id: string;
    /**
     * Video width as defined by the sender
     */
    width: number;
    /**
     * Video height as defined by the sender
     */
    height: number;
    /**
     * Duration of the video in seconds as defined by the sender
     */
    duration: number;
    /**
     * Optional. MIME type of the file as defined by the sender
     */
    mime_type?: string;
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     */
    file_size?: number;
}

/**
 * This object represents a point on the map.
 */
export interface TelegramLocation {
    /**
     * Latitude as defined by the sender
     */
    latitude: number;
    /**
     * Longitude as defined by the sender
     */
    longitude: number;
    /**
     * Optional. The radius of uncertainty for the location, measured in meters; 0-1500
     */
    horizontal_accuracy?: number;
    /**
     * Optional. Time relative to the message sending date, during which the location can be updated; in seconds. For active live locations only.
     */
    live_period?: number;
    /**
     * Optional. The direction in which user is moving, in degrees; 1-360. For active live locations only.
     */
    heading?: number;
    /**
     * Optional. The maximum distance for proximity alerts about approaching another chat member, in meters. For sent live locations only.
     */
    proximity_alert_radius?: number;
}

/**
 * Describes the physical address of a location.
 */
export interface TelegramLocationAddress {
    /**
     * The two-letter ISO 3166-1 alpha-2 country code of the country where the location is located
     */
    country_code: string;
    /**
     * Optional. State of the location
     */
    state?: string;
    /**
     * Optional. City of the location
     */
    city?: string;
    /**
     * Optional. Street address of the location
     */
    street?: string;
}

/**
 * This object represents a parameter of the inline keyboard button used to automatically authorize a user. It serves as a great replacement for the Telegram Login Widget when the user is coming from Telegram. All the user needs to do is tap/click a button and confirm that they want to log in:
 */
export interface TelegramLoginUrl {
    /**
     * An HTTPS URL to be opened with user authorization data added to the query string when the button is pressed. If the user refuses to provide authorization data, the original URL without information about the user will be opened. The data added is the same as described in Receiving authorization data.NOTE: You must always check the hash of the received data to verify the authentication and the integrity of the data as described in Checking authorization.
     */
    url: string;
    /**
     * Optional. New text of the button in forwarded messages
     */
    forward_text?: string;
    /**
     * Optional. Username of a bot, which will be used for user authorization; not supported in RichMessageButton. See Setting up a bot for more details. If not specified, the current bot's username will be assumed. The url's domain must be the same as the domain linked with the bot. See Linking your domain to the bot for more details.
     */
    bot_username?: string;
    /**
     * Optional. Pass True to request the permission for your bot to send messages to the user
     */
    request_write_access?: boolean;
}

/**
 * This object contains information about the bot that was created to be managed by the current bot.
 */
export interface TelegramManagedBotCreated {
    /**
     * Information about the bot. The bot's token can be fetched using the method getManagedBotToken.
     */
    bot: TelegramUser;
}

/**
 * This object contains information about the creation, token update, or owner update of a bot that is managed by the current bot.
 */
export interface TelegramManagedBotUpdated {
    /**
     * User that created the bot
     */
    user: TelegramUser;
    /**
     * Information about the bot. Token of the bot can be fetched using the method getManagedBotToken.
     */
    bot: TelegramUser;
}

/**
 * This object describes the position on faces where a mask should be placed by default.
 */
export interface TelegramMaskPosition {
    /**
     * The part of the face relative to which the mask should be placed. One of “forehead”, “eyes”, “mouth”, or “chin”.
     */
    point: "forehead" | "eyes" | "mouth" | "chin";
    /**
     * Shift by X-axis measured in widths of the mask scaled to the face size, from left to right. For example, choosing -1.0 will place mask just to the left of the default mask position.
     */
    x_shift: number;
    /**
     * Shift by Y-axis measured in heights of the mask scaled to the face size, from top to bottom. For example, 1.0 will place the mask just below the default mask position.
     */
    y_shift: number;
    /**
     * Mask scaling coefficient. For example, 2.0 means double size.
     */
    scale: number;
}

/**
 * This object describes a message that can be inaccessible to the bot. It can be one of
 */
export type TelegramMaybeInaccessibleMessage = TelegramMessage | TelegramInaccessibleMessage;

/**
 * This object describes the bot's menu button in a private chat. It should be one of
 * If a menu button other than MenuButtonDefault is set for a private chat, then it is applied in the chat. Otherwise the default menu button is applied. By default, the menu button opens the list of bot commands.
 */
export type TelegramMenuButton = TelegramMenuButtonCommands | TelegramMenuButtonWebApp | TelegramMenuButtonDefault;

/**
 * Represents a menu button, which opens the bot's list of commands.
 */
export interface TelegramMenuButtonCommands {
    /**
     * Type of the button, must be commands
     */
    type: "commands";
}

/**
 * Describes that no specific value for the menu button was set.
 */
export interface TelegramMenuButtonDefault {
    /**
     * Type of the button, must be default
     */
    type: "default";
}

/**
 * Represents a menu button, which launches a Web App.
 */
export interface TelegramMenuButtonWebApp {
    /**
     * Type of the button, must be web_app
     */
    type: "web_app";
    /**
     * Text on the button
     */
    text: string;
    /**
     * Description of the Web App that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method answerWebAppQuery. Alternatively, a t.me link to a Web App of the bot can be specified in the object instead of the Web App's URL, in which case the Web App will be opened as if the user pressed the link.
     */
    web_app: TelegramWebAppInfo;
}

/**
 * This object represents a message.
 */
export interface TelegramMessage {
    /**
     * Unique message identifier inside this chat; 0 for ephemeral messages. In specific instances (e.g., a message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent.
     */
    message_id: number;
    /**
     * Optional. Unique identifier of a message thread or forum topic to which the message belongs; for supergroups and private chats only
     */
    message_thread_id?: number;
    /**
     * Optional. Information about the direct messages chat topic that contains the message
     */
    direct_messages_topic?: TelegramDirectMessagesTopic;
    /**
     * Optional. Sender of the message; may be empty for messages sent to channels. For backward compatibility, if the message was sent on behalf of a chat, the field contains a fake sender user in non-channel chats.
     */
    from?: TelegramUser;
    /**
     * Optional. Sender of the message when sent on behalf of a chat. For example, the supergroup itself for messages sent by its anonymous administrators or a linked channel for messages automatically forwarded to the channel's discussion group. For backward compatibility, if the message was sent on behalf of a chat, the field from contains a fake sender user in non-channel chats.
     */
    sender_chat?: TelegramChat;
    /**
     * Optional. If the sender of the message boosted the chat, the number of boosts added by the user
     */
    sender_boost_count?: number;
    /**
     * Optional. The bot that actually sent the message on behalf of the business account. Available only for outgoing messages sent on behalf of the connected business account.
     */
    sender_business_bot?: TelegramUser;
    /**
     * Optional. Tag or custom title of the sender of the message; for supergroups only
     */
    sender_tag?: string;
    /**
     * Optional. For ephemeral messages, the user who received the message
     */
    receiver_user?: TelegramUser;
    /**
     * Optional. For ephemeral messages, identifier of the ephemeral message inside this chat. The identifier may be reused for another ephemeral message after the message is deleted or expires.
     */
    ephemeral_message_id?: number;
    /**
     * Date the message was sent in Unix time. It is always a positive number, representing a valid date.
     */
    date: number;
    /**
     * Optional. The unique identifier for the guest query. Use this identifier with the method answerGuestQuery to send a response message. If non-empty, the message belongs to the chat where the guest bot was summoned, which may not coincide with other existing bot chats sharing the same identifier.
     */
    guest_query_id?: string;
    /**
     * Optional. Unique identifier of the business connection from which the message was received. If non-empty, the message belongs to a chat of the corresponding business account that is independent from any potential bot chat which might share the same identifier.
     */
    business_connection_id?: string;
    /**
     * Chat the message belongs to
     */
    chat: TelegramChat;
    /**
     * Optional. Information about the original message for forwarded messages
     */
    forward_origin?: TelegramMessageOrigin;
    /**
     * Optional. True, if the message is sent to a topic in a forum supergroup or a private chat with the bot
     */
    is_topic_message?: true;
    /**
     * Optional. True, if the message is a channel post that was automatically forwarded to the connected discussion group
     */
    is_automatic_forward?: true;
    /**
     * Optional. For replies in the same chat and message thread, the original message. Note that the Message object in this field will not contain further reply_to_message fields even if it itself is a reply. If the message is a reply to an ephemeral message, then this field may be omitted.
     */
    reply_to_message?: TelegramMessage;
    /**
     * Optional. Information about the message that is being replied to, which may come from another chat or forum topic
     */
    external_reply?: TelegramExternalReplyInfo;
    /**
     * Optional. For replies that quote part of the original message, the quoted part of the message
     */
    quote?: TelegramTextQuote;
    /**
     * Optional. For replies to a story, the original story
     */
    reply_to_story?: TelegramStory;
    /**
     * Optional. Identifier of the specific checklist task that is being replied to
     */
    reply_to_checklist_task_id?: number;
    /**
     * Optional. Persistent identifier of the specific poll option that is being replied to
     */
    reply_to_poll_option_id?: string;
    /**
     * Optional. Bot through which the message was sent
     */
    via_bot?: TelegramUser;
    /**
     * Optional. For a message sent by a guest bot, this is the user whose original message triggered the bot's response
     */
    guest_bot_caller_user?: TelegramUser;
    /**
     * Optional. For a message sent by a guest bot, this is the chat whose original message triggered the bot's response
     */
    guest_bot_caller_chat?: TelegramChat;
    /**
     * Optional. Date the message was last edited in Unix time
     */
    edit_date?: number;
    /**
     * Optional. True, if the message can't be forwarded
     */
    has_protected_content?: true;
    /**
     * Optional. True, if the message was sent by an implicit action, for example, as an away or a greeting business message, or as a scheduled message
     */
    is_from_offline?: true;
    /**
     * Optional. True, if the message is a paid post. Note that such posts must not be deleted for 24 hours to receive the payment and can't be edited.
     */
    is_paid_post?: true;
    /**
     * Optional. The unique identifier inside this chat of a media message group this message belongs to
     */
    media_group_id?: string;
    /**
     * Optional. Signature of the post author for messages in channels, or the custom title of an anonymous group administrator
     */
    author_signature?: string;
    /**
     * Optional. The number of Telegram Stars that were paid by the sender of the message to send it
     */
    paid_star_count?: number;
    /**
     * Optional. For text messages, the actual UTF-8 text of the message
     */
    text?: string;
    /**
     * Optional. For text messages, special entities like usernames, URLs, bot commands, etc. that appear in the text
     */
    entities?: TelegramMessageEntity[];
    /**
     * Optional. Options used for link preview generation for the message, if it is a text message and link preview options were changed
     */
    link_preview_options?: TelegramLinkPreviewOptions;
    /**
     * Optional. Information about suggested post parameters if the message is a suggested post in a channel direct messages chat. If the message is an approved or declined suggested post, then it can't be edited.
     */
    suggested_post_info?: TelegramSuggestedPostInfo;
    /**
     * Optional. Unique identifier of the message effect added to the message
     */
    effect_id?: string;
    /**
     * Optional. Message is a rich formatted message
     */
    rich_message?: TelegramRichMessage;
    /**
     * Optional. Message is an animation, information about the animation. For backward compatibility, when this field is set, the document field will also be set.
     */
    animation?: TelegramAnimation;
    /**
     * Optional. Message is an audio file, information about the file
     */
    audio?: TelegramAudio;
    /**
     * Optional. Message is a general file, information about the file
     */
    document?: TelegramDocument;
    /**
     * Optional. Message is a live photo, information about the live photo. For backward compatibility, when this field is set, the photo field will also be set.
     */
    live_photo?: TelegramLivePhoto;
    /**
     * Optional. Message contains paid media; information about the paid media
     */
    paid_media?: TelegramPaidMediaInfo;
    /**
     * Optional. Message is a photo, available sizes of the photo
     */
    photo?: TelegramPhotoSize[];
    /**
     * Optional. Message is a sticker, information about the sticker
     */
    sticker?: TelegramSticker;
    /**
     * Optional. Message is a forwarded story
     */
    story?: TelegramStory;
    /**
     * Optional. Message is a video, information about the video
     */
    video?: TelegramVideo;
    /**
     * Optional. Message is a video note, information about the video message
     */
    video_note?: TelegramVideoNote;
    /**
     * Optional. Message is a voice message, information about the file
     */
    voice?: TelegramVoice;
    /**
     * Optional. Message is an HTML widget, information about the widget
     */
    widget?: TelegramWidget;
    /**
     * Optional. Caption for the animation, audio, document, live photo, paid media, photo, video, voice, or widget
     */
    caption?: string;
    /**
     * Optional. For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption
     */
    caption_entities?: TelegramMessageEntity[];
    /**
     * Optional. True, if the caption must be shown above the message media or the widget
     */
    show_caption_above_media?: true;
    /**
     * Optional. True, if the message media is covered by a spoiler animation
     */
    has_media_spoiler?: true;
    /**
     * Optional. Message is a checklist
     */
    checklist?: TelegramChecklist;
    /**
     * Optional. Message is a shared contact, information about the contact
     */
    contact?: TelegramContact;
    /**
     * Optional. Message is a dice with random value
     */
    dice?: TelegramDice;
    /**
     * Optional. Message is a game, information about the game. More about games »
     */
    game?: TelegramGame;
    /**
     * Optional. Message is a native poll, information about the poll
     */
    poll?: TelegramPoll;
    /**
     * Optional. Message is a venue, information about the venue. For backward compatibility, when this field is set, the location field will also be set.
     */
    venue?: TelegramVenue;
    /**
     * Optional. Message is a shared location, information about the location
     */
    location?: TelegramLocation;
    /**
     * Optional. New members that were added to the group or supergroup and information about them (the bot itself may be one of these members)
     */
    new_chat_members?: TelegramUser[];
    /**
     * Optional. A member was removed from the group, information about them (this member may be the bot itself)
     */
    left_chat_member?: TelegramUser;
    /**
     * Optional. Service message: chat owner has left
     */
    chat_owner_left?: TelegramChatOwnerLeft;
    /**
     * Optional. Service message: chat owner has changed
     */
    chat_owner_changed?: TelegramChatOwnerChanged;
    /**
     * Optional. A chat title was changed to this value
     */
    new_chat_title?: string;
    /**
     * Optional. A chat photo was change to this value
     */
    new_chat_photo?: TelegramPhotoSize[];
    /**
     * Optional. Service message: the chat photo was deleted
     */
    delete_chat_photo?: true;
    /**
     * Optional. Service message: the group has been created
     */
    group_chat_created?: true;
    /**
     * Optional. Service message: the supergroup has been created. This field can't be received in a message coming through updates, because bot can't be a member of a supergroup when it is created. It can only be found in reply_to_message if someone replies to a very first message in a directly created supergroup.
     */
    supergroup_chat_created?: true;
    /**
     * Optional. Service message: the channel has been created. This field can't be received in a message coming through updates, because bot can't be a member of a channel when it is created. It can only be found in reply_to_message if someone replies to a very first message in a channel.
     */
    channel_chat_created?: true;
    /**
     * Optional. Service message: auto-delete timer settings changed in the chat
     */
    message_auto_delete_timer_changed?: TelegramMessageAutoDeleteTimerChanged;
    /**
     * Optional. The group has been migrated to a supergroup with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
     */
    migrate_to_chat_id?: number;
    /**
     * Optional. The supergroup has been migrated from a group with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
     */
    migrate_from_chat_id?: number;
    /**
     * Optional. Specified message was pinned. Note that the Message object in this field will not contain further reply_to_message fields even if it itself is a reply.
     */
    pinned_message?: TelegramMaybeInaccessibleMessage;
    /**
     * Optional. Message is an invoice for a payment, information about the invoice. More about payments »
     */
    invoice?: TelegramInvoice;
    /**
     * Optional. Message is a service message about a successful payment, information about the payment. More about payments »
     */
    successful_payment?: TelegramSuccessfulPayment;
    /**
     * Optional. Message is a service message about a refunded payment, information about the payment. More about payments »
     */
    refunded_payment?: TelegramRefundedPayment;
    /**
     * Optional. Service message: users were shared with the bot
     */
    users_shared?: TelegramUsersShared;
    /**
     * Optional. Service message: a chat was shared with the bot
     */
    chat_shared?: TelegramChatShared;
    /**
     * Optional. Service message: a regular gift was sent or received
     */
    gift?: TelegramGiftInfo;
    /**
     * Optional. Service message: a unique gift was sent or received
     */
    unique_gift?: TelegramUniqueGiftInfo;
    /**
     * Optional. Service message: upgrade of a gift was purchased after the gift was sent
     */
    gift_upgrade_sent?: TelegramGiftInfo;
    /**
     * Optional. The domain name of the website on which the user has logged in. More about Telegram Login »
     */
    connected_website?: string;
    /**
     * Optional. Service message: the user allowed the bot to write messages after adding it to the attachment or side menu, launching a Web App from a link, or accepting an explicit request from a Web App sent by the method requestWriteAccess
     */
    write_access_allowed?: TelegramWriteAccessAllowed;
    /**
     * Optional. Telegram Passport data
     */
    passport_data?: TelegramPassportData;
    /**
     * Optional. Service message: a user in the chat triggered another user's proximity alert while sharing Live Location
     */
    proximity_alert_triggered?: TelegramProximityAlertTriggered;
    /**
     * Optional. Service message: user boosted the chat
     */
    boost_added?: TelegramChatBoostAdded;
    /**
     * Optional. Service message: chat background set
     */
    chat_background_set?: TelegramChatBackground;
    /**
     * Optional. Service message: some tasks in a checklist were marked as done or not done
     */
    checklist_tasks_done?: TelegramChecklistTasksDone;
    /**
     * Optional. Service message: tasks were added to a checklist
     */
    checklist_tasks_added?: TelegramChecklistTasksAdded;
    /**
     * Optional. Service message: chat or bot added to a Community
     */
    community_chat_added?: TelegramCommunityChatAdded;
    /**
     * Optional. Service message: chat was joined by a user from a Community
     */
    community_chat_joined?: TelegramCommunityChatJoined;
    /**
     * Optional. Service message: chat or bot removed from a Community
     */
    community_chat_removed?: TelegramCommunityChatRemoved;
    /**
     * Optional. Service message: the price for paid messages in the corresponding direct messages chat of a channel has changed
     */
    direct_message_price_changed?: TelegramDirectMessagePriceChanged;
    /**
     * Optional. Service message: forum topic created
     */
    forum_topic_created?: TelegramForumTopicCreated;
    /**
     * Optional. Service message: forum topic edited
     */
    forum_topic_edited?: TelegramForumTopicEdited;
    /**
     * Optional. Service message: forum topic closed
     */
    forum_topic_closed?: TelegramForumTopicClosed;
    /**
     * Optional. Service message: forum topic reopened
     */
    forum_topic_reopened?: TelegramForumTopicReopened;
    /**
     * Optional. Service message: the 'General' forum topic hidden
     */
    general_forum_topic_hidden?: TelegramGeneralForumTopicHidden;
    /**
     * Optional. Service message: the 'General' forum topic unhidden
     */
    general_forum_topic_unhidden?: TelegramGeneralForumTopicUnhidden;
    /**
     * Optional. Service message: a scheduled giveaway was created
     */
    giveaway_created?: TelegramGiveawayCreated;
    /**
     * Optional. The message is a scheduled giveaway message
     */
    giveaway?: TelegramGiveaway;
    /**
     * Optional. A giveaway with public winners was completed
     */
    giveaway_winners?: TelegramGiveawayWinners;
    /**
     * Optional. Service message: a giveaway without public winners was completed
     */
    giveaway_completed?: TelegramGiveawayCompleted;
    /**
     * Optional. Service message: user created a bot that will be managed by the current bot
     */
    managed_bot_created?: TelegramManagedBotCreated;
    /**
     * Optional. Service message: the price for paid messages has changed in the chat
     */
    paid_message_price_changed?: TelegramPaidMessagePriceChanged;
    /**
     * Optional. Service message: the sender of the message used a link of the other user, which allows sending messages to the user without paying Telegram Stars
     */
    paid_messages_waived?: TelegramPaidMessagesWaived;
    /**
     * Optional. Service message: answer option was added to a poll
     */
    poll_option_added?: TelegramPollOptionAdded;
    /**
     * Optional. Service message: answer option was deleted from a poll
     */
    poll_option_deleted?: TelegramPollOptionDeleted;
    /**
     * Optional. Service message: a suggested post was approved
     */
    suggested_post_approved?: TelegramSuggestedPostApproved;
    /**
     * Optional. Service message: approval of a suggested post has failed
     */
    suggested_post_approval_failed?: TelegramSuggestedPostApprovalFailed;
    /**
     * Optional. Service message: a suggested post was declined
     */
    suggested_post_declined?: TelegramSuggestedPostDeclined;
    /**
     * Optional. Service message: payment for a suggested post was received
     */
    suggested_post_paid?: TelegramSuggestedPostPaid;
    /**
     * Optional. Service message: payment for a suggested post was refunded
     */
    suggested_post_refunded?: TelegramSuggestedPostRefunded;
    /**
     * Optional. Service message: a transfer with a TON wallet
     */
    ton_wallet_transfer?: TelegramTonWalletTransfer;
    /**
     * Optional. Service message: video chat scheduled
     */
    video_chat_scheduled?: TelegramVideoChatScheduled;
    /**
     * Optional. Service message: video chat started
     */
    video_chat_started?: TelegramVideoChatStarted;
    /**
     * Optional. Service message: video chat ended
     */
    video_chat_ended?: TelegramVideoChatEnded;
    /**
     * Optional. Service message: new participants invited to a video chat
     */
    video_chat_participants_invited?: TelegramVideoChatParticipantsInvited;
    /**
     * Optional. Service message: data sent by a Web App
     */
    web_app_data?: TelegramWebAppData;
    /**
     * Optional. Inline keyboard attached to the message. login_url buttons are represented as ordinary url buttons.
     */
    reply_markup?: TelegramInlineKeyboardMarkup;
}

/**
 * This object represents a service message about a change in auto-delete timer settings.
 */
export interface TelegramMessageAutoDeleteTimerChanged {
    /**
     * New auto-delete time for messages in the chat; in seconds
     */
    message_auto_delete_time: number;
}

/**
 * This object represents one special entity in a text message. For example, hashtags, usernames, URLs, etc.
 */
export interface TelegramMessageEntity {
    /**
     * Type of the entity. Currently, can be “mention” (@username), “hashtag” (#hashtag or #hashtag@chatusername), “cashtag” ($USD or $USD@chatusername), “bot_command” (/start@jobs_bot), “url” (https://telegram.org), “email” (do-not-reply@telegram.org), “phone_number” (+1-212-555-0123), “bank_card_number” (bank card number), “ton_address” (address in the TON blockchain), “bold” (bold text), “italic” (italic text), “underline” (underlined text), “strikethrough” (strikethrough text), “spoiler” (spoiler message), “blockquote” (block quotation), “expandable_blockquote” (collapsed-by-default block quotation), “code” (monowidth string), “pre” (monowidth block), “text_link” (for clickable text URLs), “text_mention” (for users without usernames), “custom_emoji” (for inline custom emoji stickers), or “date_time” (for formatted date and time).
     */
    type: "mention" | "hashtag" | "cashtag" | "bot_command" | "url" | "email" | "phone_number" | "bank_card_number" | "ton_address" | "bold" | "italic" | "underline" | "strikethrough" | "spoiler" | "blockquote" | "expandable_blockquote" | "code" | "pre" | "text_link" | "text_mention" | "custom_emoji" | "date_time";
    /**
     * Offset in UTF-16 code units to the start of the entity
     */
    offset: number;
    /**
     * Length of the entity in UTF-16 code units
     */
    length: number;
    /**
     * Optional. For “text_link” only, URL that will be opened after user taps on the text
     */
    url?: string;
    /**
     * Optional. For “text_mention” only, the mentioned user
     */
    user?: TelegramUser;
    /**
     * Optional. For “pre” only, the programming language of the entity text
     */
    language?: string;
    /**
     * Optional. For “custom_emoji” only, unique identifier of the custom emoji. Use getCustomEmojiStickers to get full information about the sticker.
     */
    custom_emoji_id?: string;
    /**
     * Optional. For “date_time” only, the Unix time associated with the entity
     */
    unix_time?: number;
    /**
     * Optional. For “date_time” only, the string that defines the formatting of the date and time. See date-time entity formatting for more details.
     */
    date_time_format?: string;
}

/**
 * This object describes an update about a user stopping message generation.
 */
export interface TelegramMessageGenerationStopped {
    /**
     * Chat in which the message is generated
     */
    chat: TelegramChat;
    /**
     * Optional. Unique identifier of the message thread in which the message is generated
     */
    message_thread_id?: number;
    /**
     * Unique identifier of the message draft which was stopped
     */
    draft_id: number;
}

/**
 * This object represents a unique message identifier.
 */
export interface TelegramMessageId {
    /**
     * Unique message identifier. In specific instances (e.g., message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent.
     */
    message_id: number;
}

/**
 * This object describes the origin of a message. It can be one of
 */
export type TelegramMessageOrigin = TelegramMessageOriginUser | TelegramMessageOriginHiddenUser | TelegramMessageOriginChat | TelegramMessageOriginChannel;

/**
 * The message was originally sent to a channel chat.
 */
export interface TelegramMessageOriginChannel {
    /**
     * Type of the message origin, always “channel”
     */
    type: "channel";
    /**
     * Date the message was sent originally in Unix time
     */
    date: number;
    /**
     * Channel chat to which the message was originally sent
     */
    chat: TelegramChat;
    /**
     * Unique message identifier inside the chat
     */
    message_id: number;
    /**
     * Optional. Signature of the original post author
     */
    author_signature?: string;
}

/**
 * The message was originally sent on behalf of a chat to a group chat.
 */
export interface TelegramMessageOriginChat {
    /**
     * Type of the message origin, always “chat”
     */
    type: "chat";
    /**
     * Date the message was sent originally in Unix time
     */
    date: number;
    /**
     * Chat that sent the message originally
     */
    sender_chat: TelegramChat;
    /**
     * Optional. For messages originally sent by an anonymous chat administrator, original message author signature
     */
    author_signature?: string;
}

/**
 * The message was originally sent by an unknown user.
 */
export interface TelegramMessageOriginHiddenUser {
    /**
     * Type of the message origin, always “hidden_user”
     */
    type: "hidden_user";
    /**
     * Date the message was sent originally in Unix time
     */
    date: number;
    /**
     * Name of the user that sent the message originally
     */
    sender_user_name: string;
}

/**
 * The message was originally sent by a known user.
 */
export interface TelegramMessageOriginUser {
    /**
     * Type of the message origin, always “user”
     */
    type: "user";
    /**
     * Date the message was sent originally in Unix time
     */
    date: number;
    /**
     * User that sent the message originally
     */
    sender_user: TelegramUser;
}

/**
 * This object represents reaction changes on a message with anonymous reactions.
 */
export interface TelegramMessageReactionCountUpdated {
    /**
     * The chat containing the message
     */
    chat: TelegramChat;
    /**
     * Unique message identifier inside the chat
     */
    message_id: number;
    /**
     * Date of the change in Unix time
     */
    date: number;
    /**
     * List of reactions that are present on the message
     */
    reactions: TelegramReactionCount[];
}

/**
 * This object represents a change of a reaction on a message performed by a user.
 */
export interface TelegramMessageReactionUpdated {
    /**
     * The chat containing the message the user reacted to
     */
    chat: TelegramChat;
    /**
     * Unique identifier of the message inside the chat
     */
    message_id: number;
    /**
     * Optional. The user that changed the reaction, if the user isn't anonymous
     */
    user?: TelegramUser;
    /**
     * Optional. The chat on behalf of which the reaction was changed, if the user is anonymous
     */
    actor_chat?: TelegramChat;
    /**
     * Date of the change in Unix time
     */
    date: number;
    /**
     * Previous list of reaction types that were set by the user
     */
    old_reaction: TelegramReactionType[];
    /**
     * New list of reaction types that have been set by the user
     */
    new_reaction: TelegramReactionType[];
}

/**
 * This object represents information about an order.
 */
export interface TelegramOrderInfo {
    /**
     * Optional. User name
     */
    name?: string;
    /**
     * Optional. User's phone number
     */
    phone_number?: string;
    /**
     * Optional. User email
     */
    email?: string;
    /**
     * Optional. User shipping address
     */
    shipping_address?: TelegramShippingAddress;
}

/**
 * This object describes a gift received and owned by a user or a chat. Currently, it can be one of
 */
export type TelegramOwnedGift = TelegramOwnedGiftRegular | TelegramOwnedGiftUnique;

/**
 * Describes a regular gift owned by a user or a chat.
 */
export interface TelegramOwnedGiftRegular {
    /**
     * Type of the gift, always “regular”
     */
    type: "regular";
    /**
     * Information about the regular gift
     */
    gift: TelegramGift;
    /**
     * Optional. Unique identifier of the gift for the bot; for gifts received on behalf of business accounts only
     */
    owned_gift_id?: string;
    /**
     * Optional. Sender of the gift if it is a known user
     */
    sender_user?: TelegramUser;
    /**
     * Date the gift was sent in Unix time
     */
    send_date: number;
    /**
     * Optional. Text of the message that was added to the gift
     */
    text?: string;
    /**
     * Optional. Special entities that appear in the text
     */
    entities?: TelegramMessageEntity[];
    /**
     * Optional. True, if the sender and gift text are shown only to the gift receiver; otherwise, everyone will be able to see them
     */
    is_private?: true;
    /**
     * Optional. True, if the gift is displayed on the account's profile page; for gifts received on behalf of business accounts only
     */
    is_saved?: true;
    /**
     * Optional. True, if the gift can be upgraded to a unique gift; for gifts received on behalf of business accounts only
     */
    can_be_upgraded?: true;
    /**
     * Optional. True, if the gift was refunded and isn't available anymore
     */
    was_refunded?: true;
    /**
     * Optional. Number of Telegram Stars that can be claimed by the receiver instead of the gift; omitted if the gift cannot be converted to Telegram Stars; for gifts received on behalf of business accounts only
     */
    convert_star_count?: number;
    /**
     * Optional. Number of Telegram Stars that were paid for the ability to upgrade the gift
     */
    prepaid_upgrade_star_count?: number;
    /**
     * Optional. True, if the gift's upgrade was purchased after the gift was sent; for gifts received on behalf of business accounts only
     */
    is_upgrade_separate?: true;
    /**
     * Optional. Unique number reserved for this gift when upgraded. See the number field in UniqueGift.
     */
    unique_gift_number?: number;
}

/**
 * Contains the list of gifts received and owned by a user or a chat.
 */
export interface TelegramOwnedGifts {
    /**
     * The total number of gifts owned by the user or the chat
     */
    total_count: number;
    /**
     * The list of gifts
     */
    gifts: TelegramOwnedGift[];
    /**
     * Optional. Offset for the next request. If empty, then there are no more results.
     */
    next_offset?: string;
}

/**
 * Describes a unique gift received and owned by a user or a chat.
 */
export interface TelegramOwnedGiftUnique {
    /**
     * Type of the gift, always “unique”
     */
    type: "unique";
    /**
     * Information about the unique gift
     */
    gift: TelegramUniqueGift;
    /**
     * Optional. Unique identifier of the received gift for the bot; for gifts received on behalf of business accounts only
     */
    owned_gift_id?: string;
    /**
     * Optional. Sender of the gift if it is a known user
     */
    sender_user?: TelegramUser;
    /**
     * Date the gift was sent in Unix time
     */
    send_date: number;
    /**
     * Optional. True, if the gift is displayed on the account's profile page; for gifts received on behalf of business accounts only
     */
    is_saved?: true;
    /**
     * Optional. True, if the gift can be transferred to another owner; for gifts received on behalf of business accounts only
     */
    can_be_transferred?: true;
    /**
     * Optional. Number of Telegram Stars that must be paid to transfer the gift; omitted if the bot cannot transfer the gift
     */
    transfer_star_count?: number;
    /**
     * Optional. Point in time (Unix timestamp) when the gift can be transferred. If it is in the past, then the gift can be transferred now.
     */
    next_transfer_date?: number;
}

/**
 * This object describes paid media. Currently, it can be one of
 */
export type TelegramPaidMedia = TelegramPaidMediaLivePhoto | TelegramPaidMediaPhoto | TelegramPaidMediaPreview | TelegramPaidMediaVideo;

/**
 * Describes the paid media added to a message.
 */
export interface TelegramPaidMediaInfo {
    /**
     * The number of Telegram Stars that must be paid to buy access to the media
     */
    star_count: number;
    /**
     * Information about the paid media
     */
    paid_media: TelegramPaidMedia[];
}

/**
 * The paid media is a live photo.
 */
export interface TelegramPaidMediaLivePhoto {
    /**
     * Type of the paid media, always “live_photo”
     */
    type: "live_photo";
    /**
     * The photo
     */
    live_photo: TelegramLivePhoto;
}

/**
 * The paid media is a photo.
 */
export interface TelegramPaidMediaPhoto {
    /**
     * Type of the paid media, always “photo”
     */
    type: "photo";
    /**
     * The photo
     */
    photo: TelegramPhotoSize[];
}

/**
 * The paid media isn't available before the payment.
 */
export interface TelegramPaidMediaPreview {
    /**
     * Type of the paid media, always “preview”
     */
    type: "preview";
    /**
     * Optional. Media width as defined by the sender
     */
    width?: number;
    /**
     * Optional. Media height as defined by the sender
     */
    height?: number;
    /**
     * Optional. Duration of the media in seconds as defined by the sender
     */
    duration?: number;
}

/**
 * This object contains information about a paid media purchase.
 */
export interface TelegramPaidMediaPurchased {
    /**
     * User who purchased the media
     */
    from: TelegramUser;
    /**
     * Bot-specified paid media payload
     */
    paid_media_payload: string;
}

/**
 * The paid media is a video.
 */
export interface TelegramPaidMediaVideo {
    /**
     * Type of the paid media, always “video”
     */
    type: "video";
    /**
     * The video
     */
    video: TelegramVideo;
}

/**
 * Describes a service message about a change in the price of paid messages within a chat.
 */
export interface TelegramPaidMessagePriceChanged {
    /**
     * The new number of Telegram Stars that must be paid by non-administrator users of the supergroup chat for each sent message
     */
    paid_message_star_count: number;
}

/**
 * Describes a service message about the sender of the message using a link of the other user, which allows sending messages to the user without paying Telegram Stars. Currently holds no information.
 */
export interface TelegramPaidMessagesWaived {
}

/**
 * Describes Telegram Passport data shared with the bot by the user.
 */
export interface TelegramPassportData {
    /**
     * Array with information about documents and other Telegram Passport elements that was shared with the bot
     */
    data: TelegramEncryptedPassportElement[];
    /**
     * Encrypted credentials required to decrypt the data
     */
    credentials: TelegramEncryptedCredentials;
}

/**
 * This object represents an error in the Telegram Passport element which was submitted that should be resolved by the user. It should be one of:
 */
export type TelegramPassportElementError = TelegramPassportElementErrorDataField | TelegramPassportElementErrorFrontSide | TelegramPassportElementErrorReverseSide | TelegramPassportElementErrorSelfie | TelegramPassportElementErrorFile | TelegramPassportElementErrorFiles | TelegramPassportElementErrorTranslationFile | TelegramPassportElementErrorTranslationFiles | TelegramPassportElementErrorUnspecified;

/**
 * Represents an issue in one of the data fields that was provided by the user. The error is considered resolved when the field's value changes.
 */
export interface TelegramPassportElementErrorDataField {
    /**
     * Error source, must be data
     */
    source: "data";
    /**
     * The section of the user's Telegram Passport which has the error, one of “personal_details”, “passport”, “driver_license”, “identity_card”, “internal_passport”, “address”
     */
    type: "personal_details" | "passport" | "driver_license" | "identity_card" | "internal_passport" | "address";
    /**
     * Name of the data field which has the error
     */
    field_name: string;
    /**
     * Base64-encoded data hash
     */
    data_hash: string;
    /**
     * Error message
     */
    message: string;
}

/**
 * Represents an issue with a document scan. The error is considered resolved when the file with the document scan changes.
 */
export interface TelegramPassportElementErrorFile {
    /**
     * Error source, must be file
     */
    source: "file";
    /**
     * The section of the user's Telegram Passport which has the issue, one of “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”
     */
    type: "utility_bill" | "bank_statement" | "rental_agreement" | "passport_registration" | "temporary_registration";
    /**
     * Base64-encoded file hash
     */
    file_hash: string;
    /**
     * Error message
     */
    message: string;
}

/**
 * Represents an issue with a list of scans. The error is considered resolved when the list of files containing the scans changes.
 */
export interface TelegramPassportElementErrorFiles {
    /**
     * Error source, must be files
     */
    source: "files";
    /**
     * The section of the user's Telegram Passport which has the issue, one of “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”
     */
    type: "utility_bill" | "bank_statement" | "rental_agreement" | "passport_registration" | "temporary_registration";
    /**
     * List of base64-encoded file hashes
     */
    file_hashes: string[];
    /**
     * Error message
     */
    message: string;
}

/**
 * Represents an issue with the front side of a document. The error is considered resolved when the file with the front side of the document changes.
 */
export interface TelegramPassportElementErrorFrontSide {
    /**
     * Error source, must be front_side
     */
    source: "front_side";
    /**
     * The section of the user's Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”
     */
    type: "passport" | "driver_license" | "identity_card" | "internal_passport";
    /**
     * Base64-encoded hash of the file with the front side of the document
     */
    file_hash: string;
    /**
     * Error message
     */
    message: string;
}

/**
 * Represents an issue with the reverse side of a document. The error is considered resolved when the file with reverse side of the document changes.
 */
export interface TelegramPassportElementErrorReverseSide {
    /**
     * Error source, must be reverse_side
     */
    source: "reverse_side";
    /**
     * The section of the user's Telegram Passport which has the issue, one of “driver_license”, “identity_card”
     */
    type: "driver_license" | "identity_card";
    /**
     * Base64-encoded hash of the file with the reverse side of the document
     */
    file_hash: string;
    /**
     * Error message
     */
    message: string;
}

/**
 * Represents an issue with the selfie with a document. The error is considered resolved when the file with the selfie changes.
 */
export interface TelegramPassportElementErrorSelfie {
    /**
     * Error source, must be selfie
     */
    source: "selfie";
    /**
     * The section of the user's Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”
     */
    type: "passport" | "driver_license" | "identity_card" | "internal_passport";
    /**
     * Base64-encoded hash of the file with the selfie
     */
    file_hash: string;
    /**
     * Error message
     */
    message: string;
}

/**
 * Represents an issue with one of the files that constitute the translation of a document. The error is considered resolved when the file changes.
 */
export interface TelegramPassportElementErrorTranslationFile {
    /**
     * Error source, must be translation_file
     */
    source: "translation_file";
    /**
     * Type of element of the user's Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”
     */
    type: "passport" | "driver_license" | "identity_card" | "internal_passport" | "utility_bill" | "bank_statement" | "rental_agreement" | "passport_registration" | "temporary_registration";
    /**
     * Base64-encoded file hash
     */
    file_hash: string;
    /**
     * Error message
     */
    message: string;
}

/**
 * Represents an issue with the translated version of a document. The error is considered resolved when a file with the document translation change.
 */
export interface TelegramPassportElementErrorTranslationFiles {
    /**
     * Error source, must be translation_files
     */
    source: "translation_files";
    /**
     * Type of element of the user's Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”
     */
    type: "passport" | "driver_license" | "identity_card" | "internal_passport" | "utility_bill" | "bank_statement" | "rental_agreement" | "passport_registration" | "temporary_registration";
    /**
     * List of base64-encoded file hashes
     */
    file_hashes: string[];
    /**
     * Error message
     */
    message: string;
}

/**
 * Represents an issue in an unspecified place. The error is considered resolved when new data is added.
 */
export interface TelegramPassportElementErrorUnspecified {
    /**
     * Error source, must be unspecified
     */
    source: "unspecified";
    /**
     * Type of element of the user's Telegram Passport which has the issue
     */
    type: string;
    /**
     * Base64-encoded element hash
     */
    element_hash: string;
    /**
     * Error message
     */
    message: string;
}

/**
 * This object represents a file uploaded to Telegram Passport. Currently all Telegram Passport files are in JPEG format when decrypted and don't exceed 10MB.
 */
export interface TelegramPassportFile {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    file_unique_id: string;
    /**
     * File size in bytes
     */
    file_size: number;
    /**
     * Unix time when the file was uploaded
     */
    file_date: number;
}

/**
 * This object represents one size of a photo or a file / sticker thumbnail.
 */
export interface TelegramPhotoSize {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    file_unique_id: string;
    /**
     * Photo width
     */
    width: number;
    /**
     * Photo height
     */
    height: number;
    /**
     * Optional. File size in bytes
     */
    file_size?: number;
}

/**
 * This object contains information about a poll.
 */
export interface TelegramPoll {
    /**
     * Unique poll identifier
     */
    id: string;
    /**
     * Poll question, 1-300 characters
     */
    question: string;
    /**
     * Optional. Special entities that appear in the question. Currently, only custom emoji entities are allowed in poll questions
     */
    question_entities?: TelegramMessageEntity[];
    /**
     * List of poll options
     */
    options: TelegramPollOption[];
    /**
     * Total number of users that voted in the poll
     */
    total_voter_count: number;
    /**
     * True, if the poll is closed
     */
    is_closed: boolean;
    /**
     * True, if the poll is anonymous
     */
    is_anonymous: boolean;
    /**
     * Poll type, currently can be “regular” or “quiz”
     */
    type: "regular" | "quiz";
    /**
     * True, if the poll allows multiple answers
     */
    allows_multiple_answers: boolean;
    /**
     * True, if the poll allows to change the chosen answer options
     */
    allows_revoting: boolean;
    /**
     * True if voting is limited to users who have been members of the chat where the poll was originally sent for more than 24 hours
     */
    members_only: boolean;
    /**
     * Optional. A list of two-letter ISO 3166-1 alpha-2 country codes indicating the countries from which users can vote in the poll. The country code “FT” is used for users with anonymous numbers. If omitted, then users from any country can participate in the poll.
     */
    country_codes?: string[];
    /**
     * Optional. Array of 0-based identifiers of the correct answer options. Available only for polls in quiz mode which are closed or were sent (not forwarded) by the bot or to the private chat with the bot.
     */
    correct_option_ids?: number[];
    /**
     * Optional. Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters
     */
    explanation?: string;
    /**
     * Optional. Special entities like usernames, URLs, bot commands, etc. that appear in the explanation
     */
    explanation_entities?: TelegramMessageEntity[];
    /**
     * Optional. Media added to the quiz explanation
     */
    explanation_media?: TelegramPollMedia;
    /**
     * Optional. Amount of time in seconds the poll will be active after creation
     */
    open_period?: number;
    /**
     * Optional. Point in time (Unix timestamp) when the poll will be automatically closed
     */
    close_date?: number;
    /**
     * Optional. Description of the poll; for polls inside the Message object only
     */
    description?: string;
    /**
     * Optional. Special entities like usernames, URLs, bot commands, etc. that appear in the description
     */
    description_entities?: TelegramMessageEntity[];
    /**
     * Optional. Media added to the poll description; for polls inside the Message object only
     */
    media?: TelegramPollMedia;
}

/**
 * This object represents an answer of a user in a non-anonymous poll.
 */
export interface TelegramPollAnswer {
    /**
     * Unique poll identifier
     */
    poll_id: string;
    /**
     * Optional. The chat that changed the answer to the poll, if the voter is anonymous
     */
    voter_chat?: TelegramChat;
    /**
     * Optional. The user that changed the answer to the poll, if the voter isn't anonymous
     */
    user?: TelegramUser;
    /**
     * 0-based identifiers of chosen answer options. May be empty if the vote was retracted.
     */
    option_ids: number[];
    /**
     * Persistent identifiers of the chosen answer options. May be empty if the vote was retracted.
     */
    option_persistent_ids: string[];
}

/**
 * At most one of the optional fields can be present in any given object.
 */
export interface TelegramPollMedia {
    /**
     * Optional. Media is an animation, information about the animation
     */
    animation?: TelegramAnimation;
    /**
     * Optional. Media is an audio file, information about the file; currently, can't be received in a poll option
     */
    audio?: TelegramAudio;
    /**
     * Optional. Media is a general file, information about the file; currently, can't be received in a poll option
     */
    document?: TelegramDocument;
    /**
     * Optional. The HTTP link attached to the poll option
     */
    link?: TelegramLink;
    /**
     * Optional. Media is a live photo, information about the live photo
     */
    live_photo?: TelegramLivePhoto;
    /**
     * Optional. Media is a shared location, information about the location
     */
    location?: TelegramLocation;
    /**
     * Optional. Media is a photo, available sizes of the photo
     */
    photo?: TelegramPhotoSize[];
    /**
     * Optional. Media is a sticker, information about the sticker; currently, for poll options only
     */
    sticker?: TelegramSticker;
    /**
     * Optional. Media is a venue, information about the venue
     */
    venue?: TelegramVenue;
    /**
     * Optional. Media is a video, information about the video
     */
    video?: TelegramVideo;
}

/**
 * This object contains information about one answer option in a poll.
 */
export interface TelegramPollOption {
    /**
     * Unique identifier of the option, persistent on option addition and deletion
     */
    persistent_id: string;
    /**
     * Option text, 1-100 characters
     */
    text: string;
    /**
     * Optional. Special entities that appear in the option text. Currently, only custom emoji entities are allowed in poll option texts
     */
    text_entities?: TelegramMessageEntity[];
    /**
     * Optional. Media added to the poll option
     */
    media?: TelegramPollMedia;
    /**
     * Number of users who voted for this option; may be 0 if unknown
     */
    voter_count: number;
    /**
     * Optional. User who added the option; omitted if the option wasn't added by a user after poll creation
     */
    added_by_user?: TelegramUser;
    /**
     * Optional. Chat that added the option; omitted if the option wasn't added by a chat after poll creation
     */
    added_by_chat?: TelegramChat;
    /**
     * Optional. Point in time (Unix timestamp) when the option was added; omitted if the option existed in the original poll
     */
    addition_date?: number;
}

/**
 * Describes a service message about an option added to a poll.
 */
export interface TelegramPollOptionAdded {
    /**
     * Optional. Message containing the poll to which the option was added, if known. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply.
     */
    poll_message?: TelegramMaybeInaccessibleMessage;
    /**
     * Unique identifier of the added option
     */
    option_persistent_id: string;
    /**
     * Option text
     */
    option_text: string;
    /**
     * Optional. Special entities that appear in the option_text
     */
    option_text_entities?: TelegramMessageEntity[];
}

/**
 * Describes a service message about an option deleted from a poll.
 */
export interface TelegramPollOptionDeleted {
    /**
     * Optional. Message containing the poll from which the option was deleted, if known. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply.
     */
    poll_message?: TelegramMaybeInaccessibleMessage;
    /**
     * Unique identifier of the deleted option
     */
    option_persistent_id: string;
    /**
     * Option text
     */
    option_text: string;
    /**
     * Optional. Special entities that appear in the option_text
     */
    option_text_entities?: TelegramMessageEntity[];
}

/**
 * This object contains information about an incoming pre-checkout query.
 */
export interface TelegramPreCheckoutQuery {
    /**
     * Unique query identifier
     */
    id: string;
    /**
     * User who sent the query
     */
    from: TelegramUser;
    /**
     * Three-letter ISO 4217 currency code, or “XTR” for payments in Telegram Stars
     */
    currency: string;
    /**
     * Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).
     */
    total_amount: number;
    /**
     * Bot-specified invoice payload
     */
    invoice_payload: string;
    /**
     * Optional. Identifier of the shipping option chosen by the user
     */
    shipping_option_id?: string;
    /**
     * Optional. Order information provided by the user
     */
    order_info?: TelegramOrderInfo;
}

/**
 * Describes an inline message to be sent by a user of a Mini App.
 */
export interface TelegramPreparedInlineMessage {
    /**
     * Unique identifier of the prepared message
     */
    id: string;
    /**
     * Expiration date of the prepared message, in Unix time. Expired prepared messages can no longer be used.
     */
    expiration_date: number;
}

/**
 * Describes a keyboard button to be used by a user of a Mini App.
 */
export interface TelegramPreparedKeyboardButton {
    /**
     * Unique identifier of the keyboard button
     */
    id: string;
}

/**
 * This object represents the content of a service message, sent whenever a user in the chat triggers a proximity alert set by another user.
 */
export interface TelegramProximityAlertTriggered {
    /**
     * User that triggered the alert
     */
    traveler: TelegramUser;
    /**
     * User that set the alert
     */
    watcher: TelegramUser;
    /**
     * The distance between the users
     */
    distance: number;
}

/**
 * Represents a reaction added to a message along with the number of times it was added.
 */
export interface TelegramReactionCount {
    /**
     * Type of the reaction
     */
    type: TelegramReactionType;
    /**
     * Number of times the reaction was added
     */
    total_count: number;
}

/**
 * This object describes the type of a reaction. Currently, it can be one of
 */
export type TelegramReactionType = TelegramReactionTypeEmoji | TelegramReactionTypeCustomEmoji | TelegramReactionTypePaid;

/**
 * The reaction is based on a custom emoji.
 */
export interface TelegramReactionTypeCustomEmoji {
    /**
     * Type of the reaction, always “custom_emoji”
     */
    type: "custom_emoji";
    /**
     * Custom emoji identifier
     */
    custom_emoji_id: string;
}

/**
 * The reaction is based on an emoji.
 */
export interface TelegramReactionTypeEmoji {
    /**
     * Type of the reaction, always “emoji”
     */
    type: "emoji";
    /**
     * Reaction emoji. Currently, it can be one of "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "".
     */
    emoji: string;
}

/**
 * The reaction is paid.
 */
export interface TelegramReactionTypePaid {
    /**
     * Type of the reaction, always “paid”
     */
    type: "paid";
}

/**
 * This object contains basic information about a refunded payment.
 */
export interface TelegramRefundedPayment {
    /**
     * Three-letter ISO 4217 currency code, or “XTR” for payments in Telegram Stars. Currently, always “XTR”.
     */
    currency: string;
    /**
     * Total refunded price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45, total_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).
     */
    total_amount: number;
    /**
     * Bot-specified invoice payload
     */
    invoice_payload: string;
    /**
     * Telegram payment identifier
     */
    telegram_payment_charge_id: string;
    /**
     * Optional. Provider payment identifier
     */
    provider_payment_charge_id?: string;
}

/**
 * This object represents a custom keyboard with reply options (see Introduction to bots for details and examples). Not supported in channels and for messages sent on behalf of a business account.
 */
export interface TelegramReplyKeyboardMarkup {
    /**
     * Array of button rows, each represented by an Array of KeyboardButton objects
     */
    keyboard: TelegramKeyboardButton[][];
    /**
     * Optional. Requests clients to always show the keyboard when the regular keyboard is hidden. Defaults to False, in which case the custom keyboard can be hidden and opened with a keyboard icon.
     */
    is_persistent?: boolean;
    /**
     * Optional. Requests clients to resize the keyboard vertically for optimal fit (e.g., make the keyboard smaller if there are just two rows of buttons). Defaults to False, in which case the custom keyboard is always of the same height as the app's standard keyboard.
     */
    resize_keyboard?: boolean;
    /**
     * Optional. Requests clients to hide the keyboard as soon as it's been used. The keyboard will still be available, but clients will automatically display the usual letter-keyboard in the chat - the user can press a special button in the input field to see the custom keyboard again. Defaults to False.
     */
    one_time_keyboard?: boolean;
    /**
     * Optional. The placeholder to be shown in the input field when the keyboard is active; 1-64 characters
     */
    input_field_placeholder?: string;
    /**
     * Optional. Use this parameter if you want to show the keyboard to specific users only. Targets: 1) users that are @mentioned in the text of the Message object; 2) if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message.Example: A user requests to change the bot's language, bot replies to the request with a keyboard to select the new language. Other users in the group don't see the keyboard.
     */
    selective?: boolean;
    /**
     * Optional. Pass True if the reply interface must be shown to the user, as if they had manually selected the bot's message and tapped 'Reply'
     */
    force_reply?: boolean;
}

/**
 * Upon receiving a message with this object, Telegram clients will remove the current custom keyboard and display the default letter-keyboard. By default, custom keyboards are displayed until a new keyboard is sent by a bot. An exception is made for one-time keyboards that are hidden immediately after the user presses a button (see ReplyKeyboardMarkup). Not supported in channels and for messages sent on behalf of a business account.
 */
export interface TelegramReplyKeyboardRemove {
    /**
     * Requests clients to remove the custom keyboard (user will not be able to summon this keyboard; if you want to hide the keyboard from sight but keep it accessible, use one_time_keyboard in ReplyKeyboardMarkup)
     */
    remove_keyboard: true;
    /**
     * Optional. Use this parameter if you want to remove the keyboard for specific users only. Targets: 1) users that are @mentioned in the text of the Message object; 2) if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message.Example: A user votes in a poll, bot returns confirmation message in reply to the vote and removes the keyboard for that user, while still showing the keyboard with poll options to users who haven't voted yet.
     */
    selective?: boolean;
}

/**
 * Describes reply parameters for the message that is being sent.
 */
export interface TelegramReplyParameters {
    /**
     * Optional. Identifier of the message that will be replied to in the current chat, or in the chat chat_id if it is specified. Required if ephemeral_message_id isn't specified.
     */
    message_id?: number;
    /**
     * Optional. If the message to be replied to is from a different chat, unique identifier for the chat or username of the bot, supergroup, or channel in the format @username. Not supported for messages sent on behalf of a business account, messages from channel direct messages chats and ephemeral messages.
     */
    chat_id?: number | string;
    /**
     * Optional. Identifier of the incoming ephemeral message that will be replied to in the current chat. A reply to an ephemeral message must itself be an ephemeral message. An ephemeral message may only be replied to within 15 seconds of being sent. Required if message_id isn't specified.
     */
    ephemeral_message_id?: number;
    /**
     * Optional. Pass True if the message should be sent even if the specified message to be replied to is not found. Always False for replies in another chat or forum topic, and sent ephemeral messages. Always True for messages sent on behalf of a business account.
     */
    allow_sending_without_reply?: boolean;
    /**
     * Optional. Quoted part of the message to be replied to; 0-1024 characters after entities parsing. The quote must be an exact substring of the message to be replied to, including bold, italic, underline, strikethrough, spoiler, custom_emoji, and date_time entities. The message will fail to send if the quote isn't found in the original message. Ignored for ephemeral messages.
     */
    quote?: string | Formattable;
    /**
     * Optional. Mode for parsing entities in the quote. See formatting options for more details.
     */
    quote_parse_mode?: "HTML" | "Markdown" | "MarkdownV2" | (string & {});
    /**
     * Optional. A JSON-serialized list of special entities that appear in the quote. It can be specified instead of quote_parse_mode.
     */
    quote_entities?: TelegramMessageEntity[];
    /**
     * Optional. A JSON-serialized list of quoted parts of the rich message to be replied to. Must contain one element for each quoted text of the message in the order of their appearance. Each of the following is a separate quoted text: the text of a paragraph, a heading, a preformatted block, a footer, or a mathematical expression; the text and the credit of a block quotation or a pull quotation; the summary of a details block; the caption and each cell of a table; the text and the credit of a caption of a media block, a collage, a slideshow, or a map. Texts of blocks nested in lists, block quotations, details, collages, and slideshows are separate quoted texts too. The first and the last elements can contain only a part of the corresponding text; all other elements must contain the whole text. Formatting of the quoted parts must be kept, and rich texts must be nested in the same way as in the message received from the server. Mathematical expressions must be quoted entirely. Buttons in RichBlockButtons, anchors and dividers can't be quoted. Up to 32 quoted texts with total length up to 1024 characters can be specified. Only plain text, RichTextBold, RichTextItalic, RichTextUnderline, RichTextStrikethrough, RichTextSpoiler, RichTextSubscript, RichTextSuperscript, RichTextDateTime, RichTextCustomEmoji, RichTextMathematicalExpression, and arrays of them are kept in the quote; other rich text types are replaced with their text. If non-empty, then quote, quote_parse_mode and quote_entities are ignored.
     */
    quote_rich_texts?: TelegramRichText[];
    /**
     * Optional. Position of the quote in the original message in UTF-16 code units. For quotes from rich messages, it is the position in the text formed by joining plain texts of all quotable texts of the message, separated by line feeds.
     */
    quote_position?: number;
    /**
     * Optional. Identifier of the specific checklist task to be replied to
     */
    checklist_task_id?: number;
    /**
     * Optional. Persistent identifier of the specific poll option to be replied to
     */
    poll_option_id?: string;
}

/**
 * Describes why a request was unsuccessful.
 */
export interface TelegramResponseParameters {
    /**
     * Optional. The group has been migrated to a supergroup with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
     */
    migrate_to_chat_id?: number;
    /**
     * Optional. In case of exceeding flood control, the number of seconds left to wait before the request can be repeated
     */
    retry_after?: number;
}

/**
 * This object describes the state of a revenue withdrawal operation. Currently, it can be one of
 */
export type TelegramRevenueWithdrawalState = TelegramRevenueWithdrawalStatePending | TelegramRevenueWithdrawalStateSucceeded | TelegramRevenueWithdrawalStateFailed;

/**
 * The withdrawal failed and the transaction was refunded.
 */
export interface TelegramRevenueWithdrawalStateFailed {
    /**
     * Type of the state, always “failed”
     */
    type: "failed";
}

/**
 * The withdrawal is in progress.
 */
export interface TelegramRevenueWithdrawalStatePending {
    /**
     * Type of the state, always “pending”
     */
    type: "pending";
}

/**
 * The withdrawal succeeded.
 */
export interface TelegramRevenueWithdrawalStateSucceeded {
    /**
     * Type of the state, always “succeeded”
     */
    type: "succeeded";
    /**
     * Date the withdrawal was completed in Unix time
     */
    date: number;
    /**
     * An HTTPS URL that can be used to see transaction details
     */
    url: string;
}

/**
 * This object represents a block in a rich formatted message. Currently, it can be any of the following types:
 */
export type TelegramRichBlock = TelegramRichBlockParagraph | TelegramRichBlockSectionHeading | TelegramRichBlockPreformatted | TelegramRichBlockFooter | TelegramRichBlockDivider | TelegramRichBlockMathematicalExpression | TelegramRichBlockAnchor | TelegramRichBlockList | TelegramRichBlockBlockQuotation | TelegramRichBlockExpandableBlockQuotation | TelegramRichBlockPullQuotation | TelegramRichBlockCollage | TelegramRichBlockSlideshow | TelegramRichBlockTable | TelegramRichBlockDetails | TelegramRichBlockMap | TelegramRichBlockButtons | TelegramRichBlockAnimation | TelegramRichBlockAudio | TelegramRichBlockDocument | TelegramRichBlockPhoto | TelegramRichBlockVideo | TelegramRichBlockVoiceNote | TelegramRichBlockThinking;

/**
 * A block with an anchor, corresponding to the HTML tag <a> with the attribute name.
 */
export interface TelegramRichBlockAnchor {
    /**
     * Type of the block, always “anchor”
     */
    type: "anchor";
    /**
     * The name of the anchor
     */
    name: string;
}

/**
 * A block with an animation, corresponding to the HTML tag <video>.
 */
export interface TelegramRichBlockAnimation {
    /**
     * Type of the block, always “animation”
     */
    type: "animation";
    /**
     * The animation
     */
    animation: TelegramAnimation;
    /**
     * Optional. True, if the media preview is covered by a spoiler animation
     */
    has_spoiler?: true;
    /**
     * Optional. Caption of the block
     */
    caption?: TelegramRichBlockCaption;
}

/**
 * A block with a music file, corresponding to the HTML tag <audio>.
 */
export interface TelegramRichBlockAudio {
    /**
     * Type of the block, always “audio”
     */
    type: "audio";
    /**
     * The audio
     */
    audio: TelegramAudio;
    /**
     * Optional. Caption of the block
     */
    caption?: TelegramRichBlockCaption;
}

/**
 * A block quotation, corresponding to the HTML tag <blockquote>.
 */
export interface TelegramRichBlockBlockQuotation {
    /**
     * Type of the block, always “blockquote”
     */
    type: "blockquote";
    /**
     * Content of the block
     */
    blocks: TelegramRichBlock[];
    /**
     * Optional. Credit of the block
     */
    credit?: TelegramRichText;
}

/**
 * A block containing a list of buttons that are shown in one row, corresponding to the custom HTML tag <tg-button-row>.
 */
export interface TelegramRichBlockButtons {
    /**
     * Type of the block, always “buttons”
     */
    type: "buttons";
    /**
     * The buttons
     */
    buttons: TelegramRichMessageButton[];
    /**
     * Optional. Horizontal alignment of the buttons. Currently, must be one of “left”, “center”, or “right”.
     */
    align?: "left" | "center" | "right";
}

/**
 * Caption of a rich formatted block.
 */
export interface TelegramRichBlockCaption {
    /**
     * Block caption
     */
    text: TelegramRichText;
    /**
     * Optional. Block credit which corresponds to the HTML tag <cite>
     */
    credit?: TelegramRichText;
}

/**
 * A collage, corresponding to the custom HTML tag <tg-collage>.
 */
export interface TelegramRichBlockCollage {
    /**
     * Type of the block, always “collage”
     */
    type: "collage";
    /**
     * Elements of the collage
     */
    blocks: TelegramRichBlock[];
    /**
     * Optional. Caption of the block
     */
    caption?: TelegramRichBlockCaption;
}

/**
 * An expandable block for details disclosure, corresponding to the HTML tag <details>.
 */
export interface TelegramRichBlockDetails {
    /**
     * Type of the block, always “details”
     */
    type: "details";
    /**
     * Always shown summary of the block
     */
    summary: TelegramRichText;
    /**
     * Content of the block
     */
    blocks: TelegramRichBlock[];
    /**
     * Optional. True, if the content of the block is visible by default
     */
    is_open?: true;
}

/**
 * A divider, corresponding to the HTML tag <hr/>.
 */
export interface TelegramRichBlockDivider {
    /**
     * Type of the block, always “divider”
     */
    type: "divider";
}

/**
 * A block with a general file, corresponding to the custom HTML tag <tg-document>.
 */
export interface TelegramRichBlockDocument {
    /**
     * Type of the block, always “document”
     */
    type: "document";
    /**
     * The document
     */
    document: TelegramDocument;
    /**
     * Optional. Caption of the block
     */
    caption?: TelegramRichBlockCaption;
}

/**
 * A block quotation, corresponding to the HTML tag <blockquote> with custom attribute "expandable".
 */
export interface TelegramRichBlockExpandableBlockQuotation {
    /**
     * Type of the block, always “expandable_blockquote”
     */
    type: "expandable_blockquote";
    /**
     * Content of the block
     */
    text: TelegramRichText;
    /**
     * Optional. Credit of the block
     */
    credit?: TelegramRichText;
}

/**
 * A footer, corresponding to the HTML tag <footer>.
 */
export interface TelegramRichBlockFooter {
    /**
     * Type of the block, always “footer”
     */
    type: "footer";
    /**
     * Text of the block
     */
    text: TelegramRichText;
}

/**
 * A list of blocks, corresponding to the HTML tag <ul> or <ol> with multiple nested tags <li>.
 */
export interface TelegramRichBlockList {
    /**
     * Type of the block, always “list”
     */
    type: "list";
    /**
     * Items of the list
     */
    items: TelegramRichBlockListItem[];
}

/**
 * An item of a list.
 */
export interface TelegramRichBlockListItem {
    /**
     * Label of the item
     */
    label: string;
    /**
     * The content of the item
     */
    blocks: TelegramRichBlock[];
    /**
     * Optional. True, if the item has a checkbox
     */
    has_checkbox?: true;
    /**
     * Optional. True, if the item has a checked checkbox
     */
    is_checked?: true;
    /**
     * Optional. For ordered lists, the numeric value of the item label
     */
    value?: number;
    /**
     * Optional. For ordered lists, the type of the item label; must be one of “a” for lowercase letters, “A” for uppercase letters, “i” for lowercase Roman numerals, “I” for uppercase Roman numerals, or “1” for decimal numbers
     */
    type?: "a" | "A" | "i" | "I" | "1";
}

/**
 * A block with a map, corresponding to the custom HTML tag <tg-map>.
 */
export interface TelegramRichBlockMap {
    /**
     * Type of the block, always “map”
     */
    type: "map";
    /**
     * Location of the center of the map
     */
    location: TelegramLocation;
    /**
     * Map zoom level
     */
    zoom: number;
    /**
     * Expected width of the map
     */
    width: number;
    /**
     * Expected height of the map
     */
    height: number;
    /**
     * Optional. Caption of the block
     */
    caption?: TelegramRichBlockCaption;
}

/**
 * A block with a mathematical expression in LaTeX format, corresponding to the custom HTML tag <tg-math-block>.
 */
export interface TelegramRichBlockMathematicalExpression {
    /**
     * Type of the block, always “mathematical_expression”
     */
    type: "mathematical_expression";
    /**
     * The mathematical expression in LaTeX format
     */
    expression: string;
}

/**
 * A text paragraph, corresponding to the HTML tag <p>.
 */
export interface TelegramRichBlockParagraph {
    /**
     * Type of the block, always “paragraph”
     */
    type: "paragraph";
    /**
     * Text of the block
     */
    text: TelegramRichText;
}

/**
 * A block with a photo, corresponding to the HTML tag <img>.
 */
export interface TelegramRichBlockPhoto {
    /**
     * Type of the block, always “photo”
     */
    type: "photo";
    /**
     * Available sizes of the photo
     */
    photo: TelegramPhotoSize[];
    /**
     * Optional. True, if the media preview is covered by a spoiler animation
     */
    has_spoiler?: true;
    /**
     * Optional. Caption of the block
     */
    caption?: TelegramRichBlockCaption;
}

/**
 * A preformatted text block, corresponding to the nested HTML tags <pre> and <code>.
 */
export interface TelegramRichBlockPreformatted {
    /**
     * Type of the block, always “pre”
     */
    type: "pre";
    /**
     * Text of the block
     */
    text: TelegramRichText;
    /**
     * Optional. The programming language of the text
     */
    language?: string;
}

/**
 * A quotation with centered text, loosely corresponding to the HTML tag <aside>.
 */
export interface TelegramRichBlockPullQuotation {
    /**
     * Type of the block, always “pullquote”
     */
    type: "pullquote";
    /**
     * Text of the block
     */
    text: TelegramRichText;
    /**
     * Optional. Credit of the block
     */
    credit?: TelegramRichText;
}

/**
 * A section heading, corresponding to the HTML tags <h1>, <h2>, <h3>, <h4>, <h5>, or <h6>.
 */
export interface TelegramRichBlockSectionHeading {
    /**
     * Type of the block, always “heading”
     */
    type: "heading";
    /**
     * Text of the block
     */
    text: TelegramRichText;
    /**
     * Relative size of the text font; 1-6, 1 is the largest, 6 is the smallest
     */
    size: number;
}

/**
 * A slideshow, corresponding to the custom HTML tag <tg-slideshow>.
 */
export interface TelegramRichBlockSlideshow {
    /**
     * Type of the block, always “slideshow”
     */
    type: "slideshow";
    /**
     * Elements of the slideshow
     */
    blocks: TelegramRichBlock[];
    /**
     * Optional. Caption of the block
     */
    caption?: TelegramRichBlockCaption;
}

/**
 * A table, corresponding to the HTML tag <table>.
 */
export interface TelegramRichBlockTable {
    /**
     * Type of the block, always “table”
     */
    type: "table";
    /**
     * Cells of the table
     */
    cells: TelegramRichBlockTableCell[][];
    /**
     * Optional. True, if the table has borders
     */
    is_bordered?: true;
    /**
     * Optional. True, if the table is striped
     */
    is_striped?: true;
    /**
     * Optional. True, if table cells have smaller indents
     */
    is_compact?: true;
    /**
     * Optional. Caption of the table
     */
    caption?: TelegramRichText;
}

/**
 * Cell in a table.
 */
export interface TelegramRichBlockTableCell {
    /**
     * Optional. Text in the cell. If omitted, then the cell is invisible.
     */
    text?: TelegramRichText;
    /**
     * Optional. True, if the cell is a header cell
     */
    is_header?: true;
    /**
     * Optional. The number of columns the cell spans if it is bigger than 1
     */
    colspan?: number;
    /**
     * Optional. The number of rows the cell spans if it is bigger than 1
     */
    rowspan?: number;
    /**
     * Horizontal cell content alignment. Currently, must be one of “left”, “center”, or “right”.
     */
    align: "left" | "center" | "right";
    /**
     * Vertical cell content alignment. Currently, must be one of “top”, “middle”, or “bottom”.
     */
    valign: "top" | "middle" | "bottom";
}

/**
 * A block with a “Thinking…” placeholder, corresponding to the custom HTML tag <tg-thinking>. The block may be used only in sendRichMessageDraft, therefore it can't be received in messages. See https://t.me/addemoji/AIActions for examples of custom emoji that are recommended for usage in the block.
 */
export interface TelegramRichBlockThinking {
    /**
     * Type of the block, always “thinking”
     */
    type: "thinking";
    /**
     * Text of the block. See https://t.me/addemoji/AIActions for examples of custom emoji that are recommended for usage in the block.
     */
    text: TelegramRichText;
}

/**
 * A block with a video, corresponding to the HTML tag <video>.
 */
export interface TelegramRichBlockVideo {
    /**
     * Type of the block, always “video”
     */
    type: "video";
    /**
     * The video
     */
    video: TelegramVideo;
    /**
     * Optional. True, if the media preview is covered by a spoiler animation
     */
    has_spoiler?: true;
    /**
     * Optional. Caption of the block
     */
    caption?: TelegramRichBlockCaption;
}

/**
 * A block with a voice note, corresponding to the HTML tag <audio>.
 */
export interface TelegramRichBlockVoiceNote {
    /**
     * Type of the block, always “voice_note”
     */
    type: "voice_note";
    /**
     * The voice note
     */
    voice_note: TelegramVoice;
    /**
     * Optional. Caption of the block
     */
    caption?: TelegramRichBlockCaption;
}

/**
 * Rich formatted message.
 */
export interface TelegramRichMessage {
    /**
     * Content of the message
     */
    blocks: TelegramRichBlock[];
    /**
     * Optional. True, if the rich message must be shown right-to-left
     */
    is_rtl?: boolean;
}

/**
 * This object represents a button in a RichMessage. Exactly one of the fields other than text and style must be used to specify the type of the button.
 */
export interface TelegramRichMessageButton {
    /**
     * Text of the button. May contain only plain text, RichTextCustomEmoji and RichTextDateTime entities.
     */
    text: TelegramRichText;
    /**
     * Optional. Style of the button. Must be one of “danger”, “success”, “primary”, or “link” (the button is shown as a regular link without borders). Apps may use theme-specific colors for the button background and text based on the style. The style “link” is allowed only for callback buttons.
     */
    style?: "danger" | "success" | "primary" | "link";
    /**
     * Optional. HTTP or tg:// URL to be opened when the button is pressed. Links tg://user?id=<user_id> can be used to mention a user by their identifier without using a username, if this is allowed by their privacy settings.
     */
    url?: string;
    /**
     * Optional. Data to be sent in a callback query to the bot when the button is pressed, 1-64 bytes
     */
    callback_data?: string;
    /**
     * Optional. Description of the Web App that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method answerWebAppQuery. Available only in private chats between a user and the bot. Not supported for messages sent on behalf of a business account.
     */
    web_app?: TelegramWebAppInfo;
    /**
     * Optional. An HTTPS URL used to automatically authorize the user. Can be used as a replacement for the Telegram Login Widget. Not supported for ephemeral messages.
     */
    login_url?: TelegramLoginUrl;
    /**
     * Optional. If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot's username and the specified inline query in the input field. May be empty, in which case just the bot's username will be inserted. Not supported for messages sent in channel direct messages chats and on behalf of a business account.
     */
    switch_inline_query?: string;
    /**
     * Optional. If set, pressing the button will insert the bot's username and the specified inline query in the current chat's input field. May be empty, in which case only the bot's username will be inserted. Not supported in channels and for messages sent in channel direct messages chats and on behalf of a business account.
     */
    switch_inline_query_current_chat?: string;
    /**
     * Optional. If set, pressing the button will prompt the user to select one of their chats of the specified type, open that chat and insert the bot's username and the specified inline query in the input field. Not supported for messages sent in channel direct messages chats and on behalf of a business account.
     */
    switch_inline_query_chosen_chat?: TelegramSwitchInlineQueryChosenChat;
    /**
     * Optional. A button that copies the specified text to the clipboard
     */
    copy_text?: TelegramCopyTextButton;
    /**
     * Optional. If set, then the button is disabled and does nothing
     */
    disabled?: TelegramDisabledButton;
}

/**
 * This object represents a rich formatted text. Currently, it can be either a String for plain text, an Array of RichText, or any of the following types:
 */
export type TelegramRichText = string | TelegramRichText[] | TelegramRichTextBold | TelegramRichTextItalic | TelegramRichTextUnderline | TelegramRichTextStrikethrough | TelegramRichTextSpoiler | TelegramRichTextDateTime | TelegramRichTextTextMention | TelegramRichTextSubscript | TelegramRichTextSuperscript | TelegramRichTextMarked | TelegramRichTextCode | TelegramRichTextCustomEmoji | TelegramRichTextMathematicalExpression | TelegramRichTextUrl | TelegramRichTextEmailAddress | TelegramRichTextPhoneNumber | TelegramRichTextBankCardNumber | TelegramRichTextTonAddress | TelegramRichTextMention | TelegramRichTextHashtag | TelegramRichTextCashtag | TelegramRichTextBotCommand | TelegramRichTextButton | TelegramRichTextAnchor | TelegramRichTextAnchorLink | TelegramRichTextReference | TelegramRichTextReferenceLink;

/**
 * An anchor.
 */
export interface TelegramRichTextAnchor {
    /**
     * Type of the rich text, always “anchor”
     */
    type: "anchor";
    /**
     * The name of the anchor
     */
    name: string;
}

/**
 * A link to an anchor.
 */
export interface TelegramRichTextAnchorLink {
    /**
     * Type of the rich text, always “anchor_link”
     */
    type: "anchor_link";
    /**
     * The link text
     */
    text: TelegramRichText;
    /**
     * The name of the anchor. If the name is empty, then the link brings back to the top of the message.
     */
    anchor_name: string;
}

/**
 * A text with a bank card number.
 */
export interface TelegramRichTextBankCardNumber {
    /**
     * Type of the rich text, always “bank_card_number”
     */
    type: "bank_card_number";
    /**
     * The text
     */
    text: TelegramRichText;
    /**
     * The bank card number
     */
    bank_card_number: string;
}

/**
 * A bold text.
 */
export interface TelegramRichTextBold {
    /**
     * Type of the rich text, always “bold”
     */
    type: "bold";
    /**
     * The text
     */
    text: TelegramRichText;
}

/**
 * A bot command.
 */
export interface TelegramRichTextBotCommand {
    /**
     * Type of the rich text, always “bot_command”
     */
    type: "bot_command";
    /**
     * The text
     */
    text: TelegramRichText;
    /**
     * The bot command
     */
    bot_command: string;
}

/**
 * A button.
 */
export interface TelegramRichTextButton {
    /**
     * Type of the rich text, always “button”
     */
    type: "button";
    /**
     * The button
     */
    button: TelegramRichMessageButton;
}

/**
 * A cashtag.
 */
export interface TelegramRichTextCashtag {
    /**
     * Type of the rich text, always “cashtag”
     */
    type: "cashtag";
    /**
     * The text
     */
    text: TelegramRichText;
    /**
     * The cashtag
     */
    cashtag: string;
}

/**
 * A monowidth text.
 */
export interface TelegramRichTextCode {
    /**
     * Type of the rich text, always “code”
     */
    type: "code";
    /**
     * The text
     */
    text: TelegramRichText;
}

/**
 * A custom emoji.
 */
export interface TelegramRichTextCustomEmoji {
    /**
     * Type of the rich text, always “custom_emoji”
     */
    type: "custom_emoji";
    /**
     * Unique identifier of the custom emoji. Use getCustomEmojiStickers to get full information about the sticker.
     */
    custom_emoji_id: string;
    /**
     * Alternative emoji for the custom emoji
     */
    alternative_text: string;
}

/**
 * Formatted date and time.
 */
export interface TelegramRichTextDateTime {
    /**
     * Type of the rich text, always “date_time”
     */
    type: "date_time";
    /**
     * The text
     */
    text: TelegramRichText;
    /**
     * The Unix time associated with the entity
     */
    unix_time: number;
    /**
     * The string that defines the formatting of the date and time. See date-time entity formatting for more details.
     */
    date_time_format: string;
}

/**
 * A text with an email address.
 */
export interface TelegramRichTextEmailAddress {
    /**
     * Type of the rich text, always “email_address”
     */
    type: "email_address";
    /**
     * The text
     */
    text: TelegramRichText;
    /**
     * The email address
     */
    email_address: string;
}

/**
 * A hashtag.
 */
export interface TelegramRichTextHashtag {
    /**
     * Type of the rich text, always “hashtag”
     */
    type: "hashtag";
    /**
     * The text
     */
    text: TelegramRichText;
    /**
     * The hashtag
     */
    hashtag: string;
}

/**
 * An italicized text.
 */
export interface TelegramRichTextItalic {
    /**
     * Type of the rich text, always “italic”
     */
    type: "italic";
    /**
     * The text
     */
    text: TelegramRichText;
}

/**
 * A marked text.
 */
export interface TelegramRichTextMarked {
    /**
     * Type of the rich text, always “marked”
     */
    type: "marked";
    /**
     * The text
     */
    text: TelegramRichText;
}

/**
 * A mathematical expression.
 */
export interface TelegramRichTextMathematicalExpression {
    /**
     * Type of the rich text, always “mathematical_expression”
     */
    type: "mathematical_expression";
    /**
     * The expression in LaTeX format
     */
    expression: string;
}

/**
 * A mention by a username.
 */
export interface TelegramRichTextMention {
    /**
     * Type of the rich text, always “mention”
     */
    type: "mention";
    /**
     * The text
     */
    text: TelegramRichText;
    /**
     * The username
     */
    username: string;
}

/**
 * A text with a phone number.
 */
export interface TelegramRichTextPhoneNumber {
    /**
     * Type of the rich text, always “phone_number”
     */
    type: "phone_number";
    /**
     * The text
     */
    text: TelegramRichText;
    /**
     * The phone number
     */
    phone_number: string;
}

/**
 * A reference.
 */
export interface TelegramRichTextReference {
    /**
     * Type of the rich text, always “reference”
     */
    type: "reference";
    /**
     * Text of the reference
     */
    text: TelegramRichText;
    /**
     * The name of the reference
     */
    name: string;
}

/**
 * A link to a reference.
 */
export interface TelegramRichTextReferenceLink {
    /**
     * Type of the rich text, always “reference_link”
     */
    type: "reference_link";
    /**
     * The link text
     */
    text: TelegramRichText;
    /**
     * The name of the reference
     */
    reference_name: string;
}

/**
 * A text covered by a spoiler.
 */
export interface TelegramRichTextSpoiler {
    /**
     * Type of the rich text, always “spoiler”
     */
    type: "spoiler";
    /**
     * The text
     */
    text: TelegramRichText;
}

/**
 * A strikethrough text.
 */
export interface TelegramRichTextStrikethrough {
    /**
     * Type of the rich text, always “strikethrough”
     */
    type: "strikethrough";
    /**
     * The text
     */
    text: TelegramRichText;
}

/**
 * A subscript text.
 */
export interface TelegramRichTextSubscript {
    /**
     * Type of the rich text, always “subscript”
     */
    type: "subscript";
    /**
     * The text
     */
    text: TelegramRichText;
}

/**
 * A superscript text.
 */
export interface TelegramRichTextSuperscript {
    /**
     * Type of the rich text, always “superscript”
     */
    type: "superscript";
    /**
     * The text
     */
    text: TelegramRichText;
}

/**
 * A mention of a Telegram user by their identifier.
 */
export interface TelegramRichTextTextMention {
    /**
     * Type of the rich text, always “text_mention”
     */
    type: "text_mention";
    /**
     * The text
     */
    text: TelegramRichText;
    /**
     * The mentioned user
     */
    user: TelegramUser;
}

/**
 * An address in the TON blockchain.
 */
export interface TelegramRichTextTonAddress {
    /**
     * Type of the rich text, always “ton_address”
     */
    type: "ton_address";
    /**
     * Text of the address
     */
    text: TelegramRichText;
    /**
     * The address
     */
    address: string;
}

/**
 * An underlined text.
 */
export interface TelegramRichTextUnderline {
    /**
     * Type of the rich text, always “underline”
     */
    type: "underline";
    /**
     * The text
     */
    text: TelegramRichText;
}

/**
 * A text with a link.
 */
export interface TelegramRichTextUrl {
    /**
     * Type of the rich text, always “url”
     */
    type: "url";
    /**
     * The text
     */
    text: TelegramRichText;
    /**
     * URL of the link
     */
    url: string;
}

/**
 * Describes an inline message sent by a guest bot.
 */
export interface TelegramSentGuestMessage {
    /**
     * Identifier of the sent inline message
     */
    inline_message_id: string;
}

/**
 * Describes an inline message sent by a Web App on behalf of a user.
 */
export interface TelegramSentWebAppMessage {
    /**
     * Optional. Identifier of the sent inline message. Available only if there is an inline keyboard attached to the message.
     */
    inline_message_id?: string;
}

/**
 * This object contains information about a user that was shared with the bot using a KeyboardButtonRequestUsers button.
 */
export interface TelegramSharedUser {
    /**
     * Identifier of the shared user. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so 64-bit integers or double-precision float types are safe for storing these identifiers. The bot may not have access to the user and could be unable to use this identifier, unless the user is already known to the bot by some other means.
     */
    user_id: number;
    /**
     * Optional. First name of the user, if the name was requested by the bot
     */
    first_name?: string;
    /**
     * Optional. Last name of the user, if the name was requested by the bot
     */
    last_name?: string;
    /**
     * Optional. Username of the user, if the username was requested by the bot
     */
    username?: string;
    /**
     * Optional. Available sizes of the chat photo, if the photo was requested by the bot
     */
    photo?: TelegramPhotoSize[];
}

/**
 * This object represents an incoming query from a forwarded message with a shared widget created by the bot. Use answerWidgetQuery to answer the query. Each user can send at most 5 queries per 5 seconds to the bot from all its widgets.
 */
export interface TelegramSharedWidgetQuery {
    /**
     * Unique identifier for this query
     */
    id: string;
    /**
     * Sender
     */
    from: TelegramUser;
    /**
     * Type of the query
     */
    type: TelegramWidgetQueryType;
    /**
     * Data of the query, 1-64 bytes
     */
    data: string;
    /**
     * Unique identifier of the shared widget, which sent the query
     */
    widget_id: string;
}

/**
 * This object represents a shipping address.
 */
export interface TelegramShippingAddress {
    /**
     * Two-letter ISO 3166-1 alpha-2 country code
     */
    country_code: string;
    /**
     * State, if applicable
     */
    state: string;
    /**
     * City
     */
    city: string;
    /**
     * First line for the address
     */
    street_line1: string;
    /**
     * Second line for the address
     */
    street_line2: string;
    /**
     * Address post code
     */
    post_code: string;
}

/**
 * This object represents one shipping option.
 */
export interface TelegramShippingOption {
    /**
     * Shipping option identifier
     */
    id: string;
    /**
     * Option title
     */
    title: string;
    /**
     * List of price portions
     */
    prices: TelegramLabeledPrice[];
}

/**
 * This object contains information about an incoming shipping query.
 */
export interface TelegramShippingQuery {
    /**
     * Unique query identifier
     */
    id: string;
    /**
     * User who sent the query
     */
    from: TelegramUser;
    /**
     * Bot-specified invoice payload
     */
    invoice_payload: string;
    /**
     * User specified shipping address
     */
    shipping_address: TelegramShippingAddress;
}

/**
 * Describes an amount of Telegram Stars.
 */
export interface TelegramStarAmount {
    /**
     * Integer amount of Telegram Stars, rounded to 0; can be negative
     */
    amount: number;
    /**
     * Optional. The number of 1/1000000000 shares of Telegram Stars; from -999999999 to 999999999; can be negative if and only if amount is non-positive
     */
    nanostar_amount?: number;
}

/**
 * Describes a Telegram Star transaction. Note that if the buyer initiates a chargeback with the payment provider from whom they acquired Stars (e.g., Apple, Google) following this transaction, the refunded Stars will be deducted from the bot's balance. This is outside of Telegram's control.
 */
export interface TelegramStarTransaction {
    /**
     * Unique identifier of the transaction. Coincides with the identifier of the original transaction for refund transactions. Coincides with SuccessfulPayment.telegram_payment_charge_id for successful incoming payments from users.
     */
    id: string;
    /**
     * Integer amount of Telegram Stars transferred by the transaction
     */
    amount: number;
    /**
     * Optional. The number of 1/1000000000 shares of Telegram Stars transferred by the transaction; from 0 to 999999999
     */
    nanostar_amount?: number;
    /**
     * Date the transaction was created in Unix time
     */
    date: number;
    /**
     * Optional. Source of an incoming transaction (e.g., a user purchasing goods or services, Fragment refunding a failed withdrawal). Only for incoming transactions.
     */
    source?: TelegramTransactionPartner;
    /**
     * Optional. Receiver of an outgoing transaction (e.g., a user for a purchase refund, Fragment for a withdrawal). Only for outgoing transactions.
     */
    receiver?: TelegramTransactionPartner;
}

/**
 * Contains a list of Telegram Star transactions.
 */
export interface TelegramStarTransactions {
    /**
     * The list of transactions
     */
    transactions: TelegramStarTransaction[];
}

/**
 * This object represents a sticker.
 */
export interface TelegramSticker {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    file_unique_id: string;
    /**
     * Type of the sticker, currently one of “regular”, “mask”, “custom_emoji”. The type of the sticker is independent from its format, which is determined by the fields is_animated and is_video.
     */
    type: "regular" | "mask" | "custom_emoji";
    /**
     * Sticker width
     */
    width: number;
    /**
     * Sticker height
     */
    height: number;
    /**
     * True, if the sticker is animated
     */
    is_animated: boolean;
    /**
     * True, if the sticker is a video sticker
     */
    is_video: boolean;
    /**
     * Optional. Sticker thumbnail in the .WEBP or .JPG format
     */
    thumbnail?: TelegramPhotoSize;
    /**
     * Optional. Emoji associated with the sticker
     */
    emoji?: string;
    /**
     * Optional. Name of the sticker set to which the sticker belongs
     */
    set_name?: string;
    /**
     * Optional. For premium regular stickers, premium animation for the sticker
     */
    premium_animation?: TelegramFile;
    /**
     * Optional. For mask stickers, the position where the mask should be placed
     */
    mask_position?: TelegramMaskPosition;
    /**
     * Optional. For custom emoji stickers, unique identifier of the custom emoji
     */
    custom_emoji_id?: string;
    /**
     * Optional. True, if the sticker must be repainted to a text color in messages, the color of the Telegram Premium badge in emoji status, white color on chat photos, or another appropriate color in other places
     */
    needs_repainting?: true;
    /**
     * Optional. File size in bytes
     */
    file_size?: number;
}

/**
 * This object represents a sticker set.
 */
export interface TelegramStickerSet {
    /**
     * Sticker set name
     */
    name: string;
    /**
     * Sticker set title
     */
    title: string;
    /**
     * Type of stickers in the set, currently one of “regular”, “mask”, “custom_emoji”
     */
    sticker_type: "regular" | "mask" | "custom_emoji";
    /**
     * List of all set stickers
     */
    stickers: TelegramSticker[];
    /**
     * Optional. Sticker set thumbnail in the .WEBP, .TGS, or .WEBM format
     */
    thumbnail?: TelegramPhotoSize;
}

/**
 * This object represents a story.
 */
export interface TelegramStory {
    /**
     * Chat that posted the story
     */
    chat: TelegramChat;
    /**
     * Unique identifier for the story in the chat
     */
    id: number;
}

/**
 * Describes a clickable area on a story media.
 */
export interface TelegramStoryArea {
    /**
     * Position of the area
     */
    position: TelegramAreaPosition;
    /**
     * Type of the area
     */
    type: TelegramStoryAreaType;
}

/**
 * Describes the type of a clickable area on a story. Currently, it can be one of
 */
export type TelegramStoryAreaType = TelegramStoryAreaTypeLocation | TelegramStoryAreaTypeSuggestedReaction | TelegramStoryAreaTypeLink | TelegramStoryAreaTypeWeather | TelegramStoryAreaTypeUniqueGift;

/**
 * Describes a story area pointing to an HTTP or tg:// link. Currently, a story can have up to 3 link areas.
 */
export interface TelegramStoryAreaTypeLink {
    /**
     * Type of the area, always “link”
     */
    type: "link";
    /**
     * HTTP or tg:// URL to be opened when the area is clicked
     */
    url: string;
}

/**
 * Describes a story area pointing to a location. Currently, a story can have up to 10 location areas.
 */
export interface TelegramStoryAreaTypeLocation {
    /**
     * Type of the area, always “location”
     */
    type: "location";
    /**
     * Location latitude in degrees
     */
    latitude: number;
    /**
     * Location longitude in degrees
     */
    longitude: number;
    /**
     * Optional. Address of the location
     */
    address?: TelegramLocationAddress;
}

/**
 * Describes a story area pointing to a suggested reaction. Currently, a story can have up to 5 suggested reaction areas.
 */
export interface TelegramStoryAreaTypeSuggestedReaction {
    /**
     * Type of the area, always “suggested_reaction”
     */
    type: "suggested_reaction";
    /**
     * Type of the reaction
     */
    reaction_type: TelegramReactionType;
    /**
     * Optional. Pass True if the reaction area has a dark background
     */
    is_dark?: boolean;
    /**
     * Optional. Pass True if reaction area corner is flipped
     */
    is_flipped?: boolean;
}

/**
 * Describes a story area pointing to a unique gift. Currently, a story can have at most 1 unique gift area.
 */
export interface TelegramStoryAreaTypeUniqueGift {
    /**
     * Type of the area, always “unique_gift”
     */
    type: "unique_gift";
    /**
     * Unique name of the gift
     */
    name: string;
}

/**
 * Describes a story area containing weather information. Currently, a story can have up to 3 weather areas.
 */
export interface TelegramStoryAreaTypeWeather {
    /**
     * Type of the area, always “weather”
     */
    type: "weather";
    /**
     * Temperature, in degree Celsius
     */
    temperature: number;
    /**
     * Emoji representing the weather
     */
    emoji: string;
    /**
     * A color of the area background in the ARGB format
     */
    background_color: number;
}

/**
 * This object contains basic information about a successful payment. Note that if the buyer initiates a chargeback with the relevant payment provider following this transaction, the funds may be debited from your balance. This is outside of Telegram's control.
 */
export interface TelegramSuccessfulPayment {
    /**
     * Three-letter ISO 4217 currency code, or “XTR” for payments in Telegram Stars
     */
    currency: string;
    /**
     * Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).
     */
    total_amount: number;
    /**
     * Bot-specified invoice payload
     */
    invoice_payload: string;
    /**
     * Optional. Expiration date of the subscription, in Unix time; for recurring payments only
     */
    subscription_expiration_date?: number;
    /**
     * Optional. True, if the payment is a recurring payment for a subscription
     */
    is_recurring?: true;
    /**
     * Optional. True, if the payment is the first payment for a subscription
     */
    is_first_recurring?: true;
    /**
     * Optional. Identifier of the shipping option chosen by the user
     */
    shipping_option_id?: string;
    /**
     * Optional. Order information provided by the user
     */
    order_info?: TelegramOrderInfo;
    /**
     * Telegram payment identifier
     */
    telegram_payment_charge_id: string;
    /**
     * Provider payment identifier
     */
    provider_payment_charge_id: string;
}

/**
 * Describes a service message about the failed approval of a suggested post. Currently, only caused by insufficient user funds at the time of approval.
 */
export interface TelegramSuggestedPostApprovalFailed {
    /**
     * Optional. Message containing the suggested post whose approval has failed. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply.
     */
    suggested_post_message?: TelegramMessage;
    /**
     * Expected price of the post
     */
    price: TelegramSuggestedPostPrice;
}

/**
 * Describes a service message about the approval of a suggested post.
 */
export interface TelegramSuggestedPostApproved {
    /**
     * Optional. Message containing the suggested post. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply.
     */
    suggested_post_message?: TelegramMessage;
    /**
     * Optional. Amount paid for the post
     */
    price?: TelegramSuggestedPostPrice;
    /**
     * Date when the post will be published
     */
    send_date: number;
}

/**
 * Describes a service message about the rejection of a suggested post.
 */
export interface TelegramSuggestedPostDeclined {
    /**
     * Optional. Message containing the suggested post. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply.
     */
    suggested_post_message?: TelegramMessage;
    /**
     * Optional. Comment with which the post was declined
     */
    comment?: string;
}

/**
 * Contains information about a suggested post.
 */
export interface TelegramSuggestedPostInfo {
    /**
     * State of the suggested post. Currently, it can be one of “pending”, “approved”, “declined”.
     */
    state: "pending" | "approved" | "declined";
    /**
     * Optional. Proposed price of the post. If the field is omitted, then the post is unpaid.
     */
    price?: TelegramSuggestedPostPrice;
    /**
     * Optional. Proposed send date of the post. If the field is omitted, then the post can be published at any time within 30 days at the sole discretion of the user or administrator who approves it.
     */
    send_date?: number;
}

/**
 * Describes a service message about a successful payment for a suggested post.
 */
export interface TelegramSuggestedPostPaid {
    /**
     * Optional. Message containing the suggested post. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply.
     */
    suggested_post_message?: TelegramMessage;
    /**
     * Currency in which the payment was made. Currently, one of “XTR” for Telegram Stars or “TON” for TON grams.
     */
    currency: string;
    /**
     * Optional. The amount of the currency that was received by the channel in nanograms; for payments in TON grams only
     */
    amount?: number;
    /**
     * Optional. The amount of Telegram Stars that was received by the channel; for payments in Telegram Stars only
     */
    star_amount?: TelegramStarAmount;
}

/**
 * Contains parameters of a post that is being suggested by the bot.
 */
export interface TelegramSuggestedPostParameters {
    /**
     * Optional. Proposed price for the post. If the field is omitted, then the post is unpaid.
     */
    price?: TelegramSuggestedPostPrice;
    /**
     * Optional. Proposed send date of the post. If specified, then the date must be between 300 second and 2678400 seconds (30 days) in the future. If the field is omitted, then the post can be published at any time within 30 days at the sole discretion of the user who approves it.
     */
    send_date?: number;
}

/**
 * Describes the price of a suggested post.
 */
export interface TelegramSuggestedPostPrice {
    /**
     * Currency in which the post will be paid. Currently, must be one of “XTR” for Telegram Stars or “TON” for TON grams.
     */
    currency: string;
    /**
     * The amount of the currency that will be paid for the post in the smallest units of the currency, i.e. Telegram Stars or nanograms. Currently, price in Telegram Stars must be between 5 and 100000, and price in nanograms must be between 10000000 and 10000000000000.
     */
    amount: number;
}

/**
 * Describes a service message about a payment refund for a suggested post.
 */
export interface TelegramSuggestedPostRefunded {
    /**
     * Optional. Message containing the suggested post. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply.
     */
    suggested_post_message?: TelegramMessage;
    /**
     * Reason for the refund. Currently, one of “post_deleted” if the post was deleted within 24 hours of being posted or removed from scheduled messages without being posted, or “payment_refunded” if the payer refunded their payment.
     */
    reason: "post_deleted" | "payment_refunded";
}

/**
 * This object represents an inline button that switches the current user to inline mode in a chosen chat, with an optional default inline query.
 */
export interface TelegramSwitchInlineQueryChosenChat {
    /**
     * Optional. The default inline query to be inserted in the input field. If left empty, only the bot's username will be inserted.
     */
    query?: string;
    /**
     * Optional. True, if private chats with users can be chosen
     */
    allow_user_chats?: boolean;
    /**
     * Optional. True, if private chats with bots can be chosen
     */
    allow_bot_chats?: boolean;
    /**
     * Optional. True, if group and supergroup chats can be chosen
     */
    allow_group_chats?: boolean;
    /**
     * Optional. True, if channel chats can be chosen
     */
    allow_channel_chats?: boolean;
}

/**
 * This object contains information about the quoted part of a message that is replied to by the given message.
 */
export interface TelegramTextQuote {
    /**
     * Text of the quoted part of a message that is replied to by the given message; may be empty if the quote was chosen from a rich message
     */
    text: string;
    /**
     * Optional. Special entities that appear in the quote. Currently, only bold, italic, underline, strikethrough, spoiler, custom_emoji, and date_time entities are kept in quotes.
     */
    entities?: TelegramMessageEntity[];
    /**
     * Optional. Rich text of the quote if it was chosen from a rich message. May contain only plain text, RichTextBold, RichTextItalic, RichTextUnderline, RichTextStrikethrough, RichTextSpoiler, RichTextSubscript, RichTextSuperscript, RichTextDateTime, RichTextCustomEmoji, RichTextMathematicalExpression, and arrays of them.
     */
    rich_texts?: TelegramRichText[];
    /**
     * Approximate quote position in the original message in UTF-16 code units as specified by the sender. For quotes from rich messages, it is the position in the text formed by joining plain texts of all quotable texts of the message, separated by line feeds.
     */
    position: number;
    /**
     * Optional. True, if the quote was chosen manually by the message sender. Otherwise, the quote was added automatically by the server.
     */
    is_manual?: true;
}

/**
 * This object represents an NFT in the TON blockchain.
 */
export interface TelegramTonNft {
    /**
     * Address of the NFT
     */
    address: string;
    /**
     * Optional. Address of the collection to which the NFT belongs; omitted if unknown
     */
    collection_address?: string;
    /**
     * Index of the NFT among all NFTs from the collection as a decimal number
     */
    index: string;
    /**
     * Name of the NFT
     */
    name: string;
    /**
     * Description of the NFT
     */
    description: string;
    /**
     * Optional. Attributes of the NFT
     */
    attributes?: TelegramTonNftAttribute[];
    /**
     * Optional. The unique gift corresponding to the NFT
     */
    gift?: TelegramUniqueGift;
}

/**
 * This object represents an attribute of an NFT in the TON blockchain.
 */
export interface TelegramTonNftAttribute {
    /**
     * Trait type of the attribute
     */
    trait_type: string;
    /**
     * Value of the attribute
     */
    value: string;
}

/**
 * This object describes a TON wallet card, which is shown on the profile page of a user to everyone.
 */
export interface TelegramTonWalletCard {
    /**
     * Address of the wallet
     */
    address: string;
    /**
     * Balance of the wallet, in the smallest units of the cryptocurrency, as a decimal number
     */
    amount: string;
    /**
     * Stickers placed on the card
     */
    stickers: TelegramTonWalletCardSticker[];
    /**
     * Optional. Address of the NFT of one of the stickers, whose colors must be used for the card background; omitted if the default background must be used
     */
    background_nft_address?: string;
}

/**
 * This object describes a sticker on a TON wallet card.
 */
export interface TelegramTonWalletCardSticker {
    /**
     * Position of the sticker on the card
     */
    position: TelegramAreaPosition;
    /**
     * The NFT shown as the sticker
     */
    nft: TelegramTonNft;
}

/**
 * Describes a service message about a transfer with a TON wallet.
 */
export interface TelegramTonWalletTransfer {
    /**
     * Unique identifier of the transaction; may be empty if the transfer hasn't been sent yet
     */
    transaction_id: string;
    /**
     * Address of the transfer peer in the TON blockchain
     */
    peer_address: string;
    /**
     * The amount of transferred cryptocurrency, in the smallest units of the cryptocurrency, as a decimal number; negative for outgoing transfers
     */
    amount: string;
    /**
     * Optional. Comment added to the transfer; omitted if the comment is encrypted
     */
    comment?: string;
}

/**
 * This object describes the source of a transaction, or its recipient for outgoing transactions. Currently, it can be one of
 */
export type TelegramTransactionPartner = TelegramTransactionPartnerUser | TelegramTransactionPartnerChat | TelegramTransactionPartnerAffiliateProgram | TelegramTransactionPartnerFragment | TelegramTransactionPartnerTelegramAds | TelegramTransactionPartnerTelegramApi | TelegramTransactionPartnerOther;

/**
 * Describes the affiliate program that issued the affiliate commission received via this transaction.
 */
export interface TelegramTransactionPartnerAffiliateProgram {
    /**
     * Type of the transaction partner, always “affiliate_program”
     */
    type: "affiliate_program";
    /**
     * Optional. Information about the bot that sponsored the affiliate program
     */
    sponsor_user?: TelegramUser;
    /**
     * The number of Telegram Stars received by the bot for each 1000 Telegram Stars received by the affiliate program sponsor from referred users
     */
    commission_per_mille: number;
}

/**
 * Describes a transaction with a chat.
 */
export interface TelegramTransactionPartnerChat {
    /**
     * Type of the transaction partner, always “chat”
     */
    type: "chat";
    /**
     * Information about the chat
     */
    chat: TelegramChat;
    /**
     * Optional. The gift sent to the chat by the bot
     */
    gift?: TelegramGift;
}

/**
 * Describes a withdrawal transaction with Fragment.
 */
export interface TelegramTransactionPartnerFragment {
    /**
     * Type of the transaction partner, always “fragment”
     */
    type: "fragment";
    /**
     * Optional. State of the transaction if the transaction is outgoing
     */
    withdrawal_state?: TelegramRevenueWithdrawalState;
}

/**
 * Describes a transaction with an unknown source or recipient.
 */
export interface TelegramTransactionPartnerOther {
    /**
     * Type of the transaction partner, always “other”
     */
    type: "other";
}

/**
 * Describes a withdrawal transaction to the Telegram Ads platform.
 */
export interface TelegramTransactionPartnerTelegramAds {
    /**
     * Type of the transaction partner, always “telegram_ads”
     */
    type: "telegram_ads";
}

/**
 * Describes a transaction with payment for paid broadcasting.
 */
export interface TelegramTransactionPartnerTelegramApi {
    /**
     * Type of the transaction partner, always “telegram_api”
     */
    type: "telegram_api";
    /**
     * The number of successful requests that exceeded regular limits and were therefore billed
     */
    request_count: number;
}

/**
 * Describes a transaction with a user.
 */
export interface TelegramTransactionPartnerUser {
    /**
     * Type of the transaction partner, always “user”
     */
    type: "user";
    /**
     * Type of the transaction, currently one of “invoice_payment” for payments via invoices, “paid_media_payment” for payments for paid media, “gift_purchase” for gifts sent by the bot, “premium_purchase” for Telegram Premium subscriptions gifted by the bot, “business_account_transfer” for direct transfers from managed business accounts
     */
    transaction_type: "invoice_payment" | "paid_media_payment" | "gift_purchase" | "premium_purchase" | "business_account_transfer";
    /**
     * Information about the user
     */
    user: TelegramUser;
    /**
     * Optional. Information about the affiliate that received a commission via this transaction. Can be available only for “invoice_payment” and “paid_media_payment” transactions.
     */
    affiliate?: TelegramAffiliateInfo;
    /**
     * Optional. Bot-specified invoice payload. Can be available only for “invoice_payment” transactions.
     */
    invoice_payload?: string;
    /**
     * Optional. The duration of the paid subscription. Can be available only for “invoice_payment” transactions.
     */
    subscription_period?: number;
    /**
     * Optional. Information about the paid media bought by the user; for “paid_media_payment” transactions only
     */
    paid_media?: TelegramPaidMedia[];
    /**
     * Optional. Bot-specified paid media payload. Can be available only for “paid_media_payment” transactions.
     */
    paid_media_payload?: string;
    /**
     * Optional. The gift sent to the user by the bot; for “gift_purchase” transactions only
     */
    gift?: TelegramGift;
    /**
     * Optional. Number of months the gifted Telegram Premium subscription will be active for; for “premium_purchase” transactions only
     */
    premium_subscription_duration?: number;
}

/**
 * This object describes a unique gift that was upgraded from a regular gift.
 */
export interface TelegramUniqueGift {
    /**
     * Identifier of the regular gift from which the gift was upgraded
     */
    gift_id: string;
    /**
     * Human-readable name of the regular gift from which this unique gift was upgraded
     */
    base_name: string;
    /**
     * Unique name of the gift. This name can be used in https://t.me/nft/... links and story areas.
     */
    name: string;
    /**
     * Unique number of the upgraded gift among gifts upgraded from the same regular gift
     */
    number: number;
    /**
     * Model of the gift
     */
    model: TelegramUniqueGiftModel;
    /**
     * Symbol of the gift
     */
    symbol: TelegramUniqueGiftSymbol;
    /**
     * Backdrop of the gift
     */
    backdrop: TelegramUniqueGiftBackdrop;
    /**
     * Optional. True, if the original regular gift was exclusively purchaseable by Telegram Premium subscribers
     */
    is_premium?: true;
    /**
     * Optional. True, if the gift was used to craft another gift and isn't available anymore
     */
    is_burned?: true;
    /**
     * Optional. True, if the gift is assigned from the TON blockchain and can't be resold or transferred in Telegram
     */
    is_from_blockchain?: true;
    /**
     * Optional. The color scheme that can be used by the gift's owner for the chat's name, replies to messages and link previews; for business account gifts and gifts that are currently on sale only
     */
    colors?: TelegramUniqueGiftColors;
    /**
     * Optional. Information about the chat that published the gift
     */
    publisher_chat?: TelegramChat;
}

/**
 * This object describes the backdrop of a unique gift.
 */
export interface TelegramUniqueGiftBackdrop {
    /**
     * Name of the backdrop
     */
    name: string;
    /**
     * Colors of the backdrop
     */
    colors: TelegramUniqueGiftBackdropColors;
    /**
     * The number of unique gifts that receive this backdrop for every 1000 gifts upgraded
     */
    rarity_per_mille: number;
}

/**
 * This object describes the colors of the backdrop of a unique gift.
 */
export interface TelegramUniqueGiftBackdropColors {
    /**
     * The color in the center of the backdrop in RGB format
     */
    center_color: number;
    /**
     * The color on the edges of the backdrop in RGB format
     */
    edge_color: number;
    /**
     * The color to be applied to the symbol in RGB format
     */
    symbol_color: number;
    /**
     * The color for the text on the backdrop in RGB format
     */
    text_color: number;
}

/**
 * This object contains information about the color scheme for a user's name, message replies and link previews based on a unique gift.
 */
export interface TelegramUniqueGiftColors {
    /**
     * Custom emoji identifier of the unique gift's model
     */
    model_custom_emoji_id: string;
    /**
     * Custom emoji identifier of the unique gift's symbol
     */
    symbol_custom_emoji_id: string;
    /**
     * Main color used in light themes; RGB format
     */
    light_theme_main_color: number;
    /**
     * List of 1-3 additional colors used in light themes; RGB format
     */
    light_theme_other_colors: number[];
    /**
     * Main color used in dark themes; RGB format
     */
    dark_theme_main_color: number;
    /**
     * List of 1-3 additional colors used in dark themes; RGB format
     */
    dark_theme_other_colors: number[];
}

/**
 * Describes a service message about a unique gift that was sent or received.
 */
export interface TelegramUniqueGiftInfo {
    /**
     * Information about the gift
     */
    gift: TelegramUniqueGift;
    /**
     * Origin of the gift. Currently, either “upgrade” for gifts upgraded from regular gifts, “transfer” for gifts transferred from other users or channels, “resale” for gifts bought from other users, “gifted_upgrade” for upgrades purchased after the gift was sent, or “offer” for gifts bought or sold through gift purchase offers.
     */
    origin: "upgrade" | "transfer" | "resale" | "gifted_upgrade" | "offer";
    /**
     * Optional. Text of the message that was added to the gift
     */
    text?: string;
    /**
     * Optional. Special entities that appear in the text
     */
    entities?: TelegramMessageEntity[];
    /**
     * Optional. True, if the sender and gift text are shown only to the gift receiver; otherwise, everyone will be able to see them
     */
    is_private?: true;
    /**
     * Optional. For gifts bought from other users, the currency in which the payment for the gift was done. Currently, one of “XTR” for Telegram Stars or “TON” for TON grams.
     */
    last_resale_currency?: string;
    /**
     * Optional. For gifts bought from other users, the price paid for the gift in either Telegram Stars or nanograms
     */
    last_resale_amount?: number;
    /**
     * Optional. Unique identifier of the received gift for the bot; only present for gifts received on behalf of business accounts
     */
    owned_gift_id?: string;
    /**
     * Optional. Number of Telegram Stars that must be paid to transfer the gift; omitted if the bot cannot transfer the gift
     */
    transfer_star_count?: number;
    /**
     * Optional. Point in time (Unix timestamp) when the gift can be transferred. If it is in the past, then the gift can be transferred now.
     */
    next_transfer_date?: number;
}

/**
 * This object describes the model of a unique gift.
 */
export interface TelegramUniqueGiftModel {
    /**
     * Name of the model
     */
    name: string;
    /**
     * The sticker that represents the unique gift
     */
    sticker: TelegramSticker;
    /**
     * The number of unique gifts that receive this model for every 1000 gift upgrades. Always 0 for crafted gifts.
     */
    rarity_per_mille: number;
    /**
     * Optional. Rarity of the model if it is a crafted model. Currently, can be “uncommon”, “rare”, “epic”, or “legendary”.
     */
    rarity?: "uncommon" | "rare" | "epic" | "legendary";
}

/**
 * This object describes the symbol shown on the pattern of a unique gift.
 */
export interface TelegramUniqueGiftSymbol {
    /**
     * Name of the symbol
     */
    name: string;
    /**
     * The sticker that represents the unique gift
     */
    sticker: TelegramSticker;
    /**
     * The number of unique gifts that receive this model for every 1000 gifts upgraded
     */
    rarity_per_mille: number;
}

/**
 * This object represents an incoming update.At most one of the optional fields can be present in any given update.
 */
export interface TelegramUpdate {
    /**
     * The update's unique identifier. Update identifiers start from a certain positive number and increase sequentially. This identifier becomes especially handy if you're using webhooks, since it allows you to ignore repeated updates or to restore the correct update sequence, should they get out of order. If there are no new updates for at least a week, then identifier of the next update will be chosen randomly instead of sequentially.
     */
    update_id: number;
    /**
     * Optional. New incoming message of any kind - text, photo, sticker, etc.
     */
    message?: TelegramMessage;
    /**
     * Optional. New version of a message that is known to the bot and was edited. This update may at times be triggered by changes to message fields that are either unavailable or not actively used by your bot.
     */
    edited_message?: TelegramMessage;
    /**
     * Optional. New incoming channel post of any kind - text, photo, sticker, etc.
     */
    channel_post?: TelegramMessage;
    /**
     * Optional. New version of a channel post that is known to the bot and was edited. This update may at times be triggered by changes to message fields that are either unavailable or not actively used by your bot.
     */
    edited_channel_post?: TelegramMessage;
    /**
     * Optional. The bot was connected to or disconnected from a business account, or a user edited an existing connection with the bot
     */
    business_connection?: TelegramBusinessConnection;
    /**
     * Optional. New message from a connected business account
     */
    business_message?: TelegramMessage;
    /**
     * Optional. New version of a message from a connected business account
     */
    edited_business_message?: TelegramMessage;
    /**
     * Optional. Messages were deleted from a connected business account
     */
    deleted_business_messages?: TelegramBusinessMessagesDeleted;
    /**
     * Optional. New guest message. The bot can use the field Message.guest_query_id and the method answerGuestQuery to send a message in response.
     */
    guest_message?: TelegramMessage;
    /**
     * Optional. A reaction to a message was changed by a user. The bot must be an administrator in the chat and must explicitly specify "message_reaction" in the list of allowed_updates to receive these updates. The update isn't received for reactions set by bots.
     */
    message_reaction?: TelegramMessageReactionUpdated;
    /**
     * Optional. Reactions to a message with anonymous reactions were changed. The bot must be an administrator in the chat and must explicitly specify "message_reaction_count" in the list of allowed_updates to receive these updates. The updates are grouped and can be sent with delay up to a few minutes.
     */
    message_reaction_count?: TelegramMessageReactionCountUpdated;
    /**
     * Optional. New incoming inline query
     */
    inline_query?: TelegramInlineQuery;
    /**
     * Optional. The result of an inline query that was chosen by a user and sent to their chat partner. Please see our documentation on the feedback collecting for details on how to enable these updates for your bot.
     */
    chosen_inline_result?: TelegramChosenInlineResult;
    /**
     * Optional. New incoming callback query
     */
    callback_query?: TelegramCallbackQuery;
    /**
     * Optional. New incoming query from a widget in a message sent by the bot or via the bot
     */
    widget_query?: TelegramWidgetQuery;
    /**
     * Optional. New incoming query from a forwarded message with a shared widget
     */
    shared_widget_query?: TelegramSharedWidgetQuery;
    /**
     * Optional. New incoming shipping query. Only for invoices with flexible price.
     */
    shipping_query?: TelegramShippingQuery;
    /**
     * Optional. New incoming pre-checkout query. Contains full information about checkout.
     */
    pre_checkout_query?: TelegramPreCheckoutQuery;
    /**
     * Optional. A user purchased paid media with a non-empty payload sent by the bot in a non-channel chat
     */
    purchased_paid_media?: TelegramPaidMediaPurchased;
    /**
     * Optional. New poll state. Bots receive only updates about manually stopped polls and polls, which are sent by the bot.
     */
    poll?: TelegramPoll;
    /**
     * Optional. A user changed their answer in a non-anonymous poll. Bots receive new votes only in polls that were sent by the bot itself.
     */
    poll_answer?: TelegramPollAnswer;
    /**
     * Optional. The bot's chat member status was updated in a chat. For private chats, this update is received only when the bot is blocked or unblocked by the user.
     */
    my_chat_member?: TelegramChatMemberUpdated;
    /**
     * Optional. A chat member's status was updated in a chat. The bot must be an administrator in the chat and must explicitly specify "chat_member" in the list of allowed_updates to receive these updates.
     */
    chat_member?: TelegramChatMemberUpdated;
    /**
     * Optional. A request to join the chat has been sent. The bot must have the can_invite_users administrator right in the chat to receive these updates.
     */
    chat_join_request?: TelegramChatJoinRequest;
    /**
     * Optional. A chat boost was added or changed. The bot must be an administrator in the chat to receive these updates.
     */
    chat_boost?: TelegramChatBoostUpdated;
    /**
     * Optional. A boost was removed from a chat. The bot must be an administrator in the chat to receive these updates.
     */
    removed_chat_boost?: TelegramChatBoostRemoved;
    /**
     * Optional. A new bot was created to be managed by the bot, or token or owner of a managed bot was changed
     */
    managed_bot?: TelegramManagedBotUpdated;
    /**
     * Optional. User payment subscription has changed
     */
    subscription?: TelegramBotSubscriptionUpdated;
    /**
     * Optional. A user asked the bot to stop the generation of a message
     */
    stopped_message_generation?: TelegramMessageGenerationStopped;
}

/**
 * This object represents a Telegram user or bot.
 */
export interface TelegramUser {
    /**
     * Unique identifier for this user or bot. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.
     */
    id: number;
    /**
     * True, if this user is a bot
     */
    is_bot: boolean;
    /**
     * User's or bot's first name
     */
    first_name: string;
    /**
     * Optional. User's or bot's last name
     */
    last_name?: string;
    /**
     * Optional. User's or bot's username
     */
    username?: string;
    /**
     * Optional. IETF language tag of the user's language
     */
    language_code?: string;
    /**
     * Optional. True, if this user is a Telegram Premium user
     */
    is_premium?: true;
    /**
     * Optional. True, if this user added the bot to the attachment menu
     */
    added_to_attachment_menu?: true;
    /**
     * Optional. True, if the bot can be invited to groups. Returned only in getMe.
     */
    can_join_groups?: boolean;
    /**
     * Optional. True, if privacy mode is disabled for the bot. Returned only in getMe.
     */
    can_read_all_group_messages?: boolean;
    /**
     * Optional. True, if the bot supports guest queries from chats it is not a member of. Returned only in getMe.
     */
    supports_guest_queries?: boolean;
    /**
     * Optional. True, if the bot supports inline queries. Returned only in getMe.
     */
    supports_inline_queries?: boolean;
    /**
     * Optional. True, if the bot can be connected to a user account to manage it. Returned only in getMe.
     */
    can_connect_to_business?: boolean;
    /**
     * Optional. True, if the bot has a main Web App. Returned only in getMe.
     */
    has_main_web_app?: boolean;
    /**
     * Optional. True, if the bot has forum topic mode enabled in private chats. Returned only in getMe.
     */
    has_topics_enabled?: boolean;
    /**
     * Optional. True, if the bot allows users to create and delete topics in private chats. Returned only in getMe.
     */
    allows_users_to_create_topics?: boolean;
    /**
     * Optional. True, if other bots can be created to be controlled by the bot. Returned only in getMe.
     */
    can_manage_bots?: boolean;
    /**
     * Optional. True, if the bot supports join request queries and can be assigned to process them. Returned only in getMe.
     */
    supports_join_request_queries?: boolean;
}

/**
 * This object represents a list of boosts added to a chat by a user.
 */
export interface TelegramUserChatBoosts {
    /**
     * The list of boosts added to the chat by the user
     */
    boosts: TelegramChatBoost[];
}

/**
 * This object represents the audios displayed on a user's profile.
 */
export interface TelegramUserProfileAudios {
    /**
     * Total number of profile audios for the target user
     */
    total_count: number;
    /**
     * Requested profile audios
     */
    audios: TelegramAudio[];
}

/**
 * This object represent a user's profile pictures.
 */
export interface TelegramUserProfilePhotos {
    /**
     * Total number of profile pictures the target user has
     */
    total_count: number;
    /**
     * Requested profile pictures (in up to 4 sizes each)
     */
    photos: TelegramPhotoSize[][];
}

/**
 * This object describes the rating of a user based on their Telegram Star spendings.
 */
export interface TelegramUserRating {
    /**
     * Current level of the user, indicating their reliability when purchasing digital goods and services. A higher level suggests a more trustworthy customer; a negative level is likely reason for concern.
     */
    level: number;
    /**
     * Numerical value of the user's rating; the higher the rating, the better
     */
    rating: number;
    /**
     * The rating value required to get the current level
     */
    current_level_rating: number;
    /**
     * Optional. The rating value required to get to the next level; omitted if the maximum level was reached
     */
    next_level_rating?: number;
}

/**
 * This object contains information about the users whose identifiers were shared with the bot using a KeyboardButtonRequestUsers button.
 */
export interface TelegramUsersShared {
    /**
     * Identifier of the request
     */
    request_id: number;
    /**
     * Information about users shared with the bot
     */
    users: TelegramSharedUser[];
}

/**
 * This object represents a venue.
 */
export interface TelegramVenue {
    /**
     * Venue location. Can't be a live location.
     */
    location: TelegramLocation;
    /**
     * Name of the venue
     */
    title: string;
    /**
     * Address of the venue
     */
    address: string;
    /**
     * Optional. Foursquare identifier of the venue
     */
    foursquare_id?: string;
    /**
     * Optional. Foursquare type of the venue. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)
     */
    foursquare_type?: string;
    /**
     * Optional. Google Places identifier of the venue
     */
    google_place_id?: string;
    /**
     * Optional. Google Places type of the venue. (See supported types.)
     */
    google_place_type?: string;
}

/**
 * This object represents a video file.
 */
export interface TelegramVideo {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    file_unique_id: string;
    /**
     * Video width as defined by the sender
     */
    width: number;
    /**
     * Video height as defined by the sender
     */
    height: number;
    /**
     * Duration of the video in seconds as defined by the sender
     */
    duration: number;
    /**
     * Optional. Video thumbnail
     */
    thumbnail?: TelegramPhotoSize;
    /**
     * Optional. Available sizes of the cover of the video in the message
     */
    cover?: TelegramPhotoSize[];
    /**
     * Optional. Timestamp in seconds from which the video will play in the message
     */
    start_timestamp?: number;
    /**
     * Optional. List of available qualities of the video
     */
    qualities?: TelegramVideoQuality[];
    /**
     * Optional. Original filename as defined by the sender
     */
    file_name?: string;
    /**
     * Optional. MIME type of the file as defined by the sender
     */
    mime_type?: string;
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     */
    file_size?: number;
}

/**
 * This object represents a service message about a video chat ended in the chat.
 */
export interface TelegramVideoChatEnded {
    /**
     * Video chat duration in seconds
     */
    duration: number;
}

/**
 * This object represents a service message about new members invited to a video chat.
 */
export interface TelegramVideoChatParticipantsInvited {
    /**
     * New members that were invited to the video chat
     */
    users: TelegramUser[];
}

/**
 * This object represents a service message about a video chat scheduled in the chat.
 */
export interface TelegramVideoChatScheduled {
    /**
     * Point in time (Unix timestamp) when the video chat is supposed to be started by a chat administrator
     */
    start_date: number;
}

/**
 * This object represents a service message about a video chat started in the chat. Currently holds no information.
 */
export interface TelegramVideoChatStarted {
}

/**
 * This object represents a video message.
 */
export interface TelegramVideoNote {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    file_unique_id: string;
    /**
     * Video width and height (diameter of the video message) as defined by the sender
     */
    length: number;
    /**
     * Duration of the video in seconds as defined by the sender
     */
    duration: number;
    /**
     * Optional. Video thumbnail
     */
    thumbnail?: TelegramPhotoSize;
    /**
     * Optional. File size in bytes
     */
    file_size?: number;
}

/**
 * This object represents a video file of a specific quality.
 */
export interface TelegramVideoQuality {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    file_unique_id: string;
    /**
     * Video width
     */
    width: number;
    /**
     * Video height
     */
    height: number;
    /**
     * Codec that was used to encode the video, for example, “h264”, “h265”, or “av01”
     */
    codec: string;
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     */
    file_size?: number;
}

/**
 * This object represents a voice note.
 */
export interface TelegramVoice {
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    file_id: string;
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    file_unique_id: string;
    /**
     * Duration of the audio in seconds as defined by the sender
     */
    duration: number;
    /**
     * Optional. MIME type of the file as defined by the sender
     */
    mime_type?: string;
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     */
    file_size?: number;
}

/**
 * Describes data sent from a Web App to the bot.
 */
export interface TelegramWebAppData {
    /**
     * The data. Be aware that a bad client can send arbitrary data in this field.
     */
    data: string;
    /**
     * Text of the web_app keyboard button from which the Web App was opened. Be aware that a bad client can send arbitrary data in this field.
     */
    button_text: string;
}

/**
 * Describes a Web App.
 */
export interface TelegramWebAppInfo {
    /**
     * An HTTPS URL of a Web App to be opened with additional data as specified in Initializing Web Apps
     */
    url: string;
}

/**
 * Describes the current status of a webhook.
 */
export interface TelegramWebhookInfo {
    /**
     * Webhook URL, may be empty if webhook is not set up
     */
    url: string;
    /**
     * True, if a custom certificate was provided for webhook certificate checks
     */
    has_custom_certificate: boolean;
    /**
     * Number of updates awaiting delivery
     */
    pending_update_count: number;
    /**
     * Optional. Currently used webhook IP address
     */
    ip_address?: string;
    /**
     * Optional. Unix time for the most recent error that happened when trying to deliver an update via webhook
     */
    last_error_date?: number;
    /**
     * Optional. Error message in human-readable format for the most recent error that happened when trying to deliver an update via webhook
     */
    last_error_message?: string;
    /**
     * Optional. Unix time of the most recent error that happened when trying to synchronize available updates with Telegram datacenters
     */
    last_synchronization_error_date?: number;
    /**
     * Optional. The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery
     */
    max_connections?: number;
    /**
     * Optional. A list of update types the bot is subscribed to. Defaults to all update types except chat_member, message_reaction, and message_reaction_count.
     */
    allowed_updates?: string[];
}

/**
 * This object describes an HTML widget.
 */
export interface TelegramWidget {
    /**
     * Optional. Unique identifier of the shared widget, which can be used to send the widget again using the method sendSharedWidget; omitted if the widget isn't shared
     */
    id?: string;
    /**
     * Optional. Width of the widget in logical pixels; omitted if the widget must occupy the whole width of the message bubble
     */
    width?: number;
    /**
     * Optional. Height of the widget in logical pixels; omitted if the height of the widget isn't fixed
     */
    height?: number;
    /**
     * HTML code of the widget
     */
    html: string;
    /**
     * Optional. Public data of the widget, which is available wherever the widget is shown. All messages with a shared widget have the same public data.
     */
    public_data?: string;
    /**
     * Optional. Data of the widget, which is specific to the message
     */
    chat_data?: string;
}

/**
 * This object represents an incoming query from a widget in a message sent by the bot or via the bot. Use answerWidgetQuery to answer the query. Each user can send at most 5 queries per 5 seconds to the bot from all its widgets.
 */
export interface TelegramWidgetQuery {
    /**
     * Unique identifier for this query
     */
    id: string;
    /**
     * Sender
     */
    from: TelegramUser;
    /**
     * Optional. Chat with the message containing the widget; omitted if the widget is in an inline message
     */
    chat?: TelegramChat;
    /**
     * Optional. Identifier of the message containing the widget; omitted if the widget is in an inline message
     */
    message_id?: number;
    /**
     * Optional. Identifier of the inline message containing the widget
     */
    inline_message_id?: string;
    /**
     * Global identifier, uniquely corresponding to the chat to which the message with the widget was sent
     */
    chat_instance: string;
    /**
     * Optional. For widgets in inline messages, type of the chat to which the message was sent. Can be either “sender” for a private chat with the inline query sender, “private”, “group”, “supergroup”, or “channel”.
     */
    chat_type?: "sender" | "private" | "group" | "supergroup" | "channel";
    /**
     * Type of the query
     */
    type: TelegramWidgetQueryType;
    /**
     * Data of the query, 1-64 bytes
     */
    data: string;
    /**
     * Optional. Unique identifier of the shared widget, which sent the query; omitted if the widget isn't shared
     */
    widget_id?: string;
}

/**
 * This object describes the type of a query from a widget. Currently, it can be one of
 */
export type TelegramWidgetQueryType = TelegramWidgetQueryTypeData | TelegramWidgetQueryTypeSignData | TelegramWidgetQueryTypeSentTransaction;

/**
 * The query contains data for the bot.
 */
export interface TelegramWidgetQueryTypeData {
    /**
     * Type of the query, always “data”
     */
    type: "data";
    /**
     * Optional. TON wallet card of the user who sent the query, if it was sent to the bot along with the query
     */
    wallet_card?: TelegramTonWalletCard;
}

/**
 * The query notifies the bot about a transaction sent from a TON wallet of the user who sent the query.
 */
export interface TelegramWidgetQueryTypeSentTransaction {
    /**
     * Type of the query, always “sent_transaction”
     */
    type: "sent_transaction";
    /**
     * The wallet from which the transaction was sent
     */
    wallet: TelegramWidgetQueryWallet;
    /**
     * Value of msg_hash of the transaction
     */
    msg_hash: string;
}

/**
 * The query contains data signed by a TON wallet of the user who sent the query. The data is signed for the domain bot<bot_id>, where <bot_id> is the identifier of the bot.
 */
export interface TelegramWidgetQueryTypeSignData {
    /**
     * Type of the query, always “sign_data”
     */
    type: "sign_data";
    /**
     * The wallet that signed the data
     */
    wallet: TelegramWidgetQueryWallet;
    /**
     * JSON-serialized signed data
     */
    sign_data: string;
}

/**
 * This object describes a TON wallet of the user, which is used in a query from a widget.
 */
export interface TelegramWidgetQueryWallet {
    /**
     * Address of the wallet
     */
    address: string;
    /**
     * Balance of the wallet, in the smallest units of the cryptocurrency, as a decimal number
     */
    amount: string;
    /**
     * Optional. Hex-encoded public key of the wallet; omitted if unknown
     */
    public_key?: string;
    /**
     * Optional. Base64-encoded serialized StateInit of the wallet contract; omitted if and only if public_key is omitted
     */
    state_init?: string;
}

/**
 * This object represents a service message about a user allowing a bot to write messages after adding it to the attachment menu, launching a Web App from a link, or accepting an explicit request from a Web App sent by the method requestWriteAccess.
 */
export interface TelegramWriteAccessAllowed {
    /**
     * Optional. True, if the access was granted after the user accepted an explicit request from a Web App sent by the method requestWriteAccess
     */
    from_request?: boolean;
    /**
     * Optional. Name of the Web App, if the access was granted when the Web App was launched from a link
     */
    web_app_name?: string;
    /**
     * Optional. True, if the access was granted when the bot was added to the attachment or side menu
     */
    from_attachment_menu?: boolean;
}