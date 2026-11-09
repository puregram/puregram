/// AUTO-GENERATED FILE — do not edit by hand
/// Bot API 10.4
/// source: https://core.telegram.org/bots/api
/// generated at: 2026-11-09T13:32:34.299Z
/// see scripts/emit.ts in @puregram/api

import type { TelegramAnimation, TelegramAreaPosition, TelegramAudio, TelegramCallbackGame, TelegramChat, TelegramChatBackground, TelegramChatBoost, TelegramChatBoostAdded, TelegramChatBoostRemoved, TelegramChatBoostSource, TelegramChatBoostUpdated, TelegramChatInviteLink, TelegramChatJoinRequest, TelegramChatLocation, TelegramChatMember, TelegramChatMemberUpdated, TelegramChatOwnerChanged, TelegramChatOwnerLeft, TelegramChatPermissions, TelegramChatPhoto, TelegramChatShareThemeBackdrop, TelegramChatShareThemeBackdrops, TelegramChatShared, TelegramChecklist, TelegramChecklistTasksAdded, TelegramChecklistTasksDone, TelegramChosenInlineResult, TelegramCommunityChatAdded, TelegramCommunityChatJoined, TelegramCommunityChatRemoved, TelegramContact, TelegramCopyTextButton, TelegramDice, TelegramDirectMessagePriceChanged, TelegramDirectMessagesTopic, TelegramDisabledButton, TelegramDocument, TelegramEncryptedCredentials, TelegramEncryptedPassportElement, TelegramExternalReplyInfo, TelegramFile, TelegramForumTopicClosed, TelegramForumTopicCreated, TelegramForumTopicEdited, TelegramForumTopicReopened, TelegramGame, TelegramGeneralForumTopicHidden, TelegramGeneralForumTopicUnhidden, TelegramGiftInfo, TelegramGiveaway, TelegramGiveawayCompleted, TelegramGiveawayCreated, TelegramGiveawayWinners, TelegramInlineKeyboardButton, TelegramInlineKeyboardMarkup, TelegramInlineQuery, TelegramInvoice, TelegramLink, TelegramLinkPreviewOptions, TelegramLivePhoto, TelegramLocation, TelegramLoginUrl, TelegramManagedBotCreated, TelegramMaskPosition, TelegramMaybeInaccessibleMessage, TelegramMessage, TelegramMessageAutoDeleteTimerChanged, TelegramMessageEntity, TelegramMessageId, TelegramMessageOrigin, TelegramMessageReactionCountUpdated, TelegramMessageReactionUpdated, TelegramOrderInfo, TelegramPaidMediaInfo, TelegramPaidMessagePriceChanged, TelegramPaidMessagesWaived, TelegramPassportData, TelegramPhotoSize, TelegramPoll, TelegramPollAnswer, TelegramPollMedia, TelegramPollOption, TelegramPollOptionAdded, TelegramPollOptionDeleted, TelegramPreCheckoutQuery, TelegramProximityAlertTriggered, TelegramReactionCount, TelegramReactionType, TelegramRefundedPayment, TelegramRichMessage, TelegramRichText, TelegramSharedUser, TelegramShippingAddress, TelegramShippingQuery, TelegramSticker, TelegramStickerSet, TelegramStory, TelegramSuccessfulPayment, TelegramSuggestedPostApprovalFailed, TelegramSuggestedPostApproved, TelegramSuggestedPostDeclined, TelegramSuggestedPostInfo, TelegramSuggestedPostPaid, TelegramSuggestedPostRefunded, TelegramSwitchInlineQueryChosenChat, TelegramTextQuote, TelegramTonNft, TelegramTonNftAttribute, TelegramTonWalletCard, TelegramTonWalletCardSticker, TelegramTonWalletTransfer, TelegramUniqueGift, TelegramUniqueGiftBackdropColors, TelegramUniqueGiftInfo, TelegramUser, TelegramUserProfilePhotos, TelegramUsersShared, TelegramVenue, TelegramVideo, TelegramVideoChatEnded, TelegramVideoChatParticipantsInvited, TelegramVideoChatScheduled, TelegramVideoChatStarted, TelegramVideoNote, TelegramVideoQuality, TelegramVoice, TelegramWebAppData, TelegramWebAppInfo, TelegramWidget, TelegramWidgetQueryWallet, TelegramWriteAccessAllowed } from "./types";
import type { Has } from "../util-types";
import { INSPECT, makeInspect } from "./inspect";
import { Photo, PollOptions, ReactionCounts, Reactions, VideoQualities } from "../structures-handcrafted";
/**
 * This object represents an animation file (GIF or H.264/MPEG-4 AVC video without sound).
 */
export class Animation {
    private _thumbnail?: PhotoSize | undefined;
    constructor(public raw: TelegramAnimation) { }
    static fromPayload(raw: TelegramAnimation): Animation {
        return new Animation(raw);
    }
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    get fileId(): string {
        return this.raw.file_id;
    }
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    get fileUniqueId(): string {
        return this.raw.file_unique_id;
    }
    /**
     * Video width as defined by the sender
     */
    get width(): number {
        return this.raw.width;
    }
    /**
     * Video height as defined by the sender
     */
    get height(): number {
        return this.raw.height;
    }
    /**
     * Duration of the video in seconds as defined by the sender
     */
    get duration(): number {
        return this.raw.duration;
    }
    /**
     * Optional. Animation thumbnail as defined by the sender
     */
    get thumbnail(): PhotoSize | undefined {
        if (this._thumbnail === undefined) {
            this._thumbnail = this.raw.thumbnail ? new PhotoSize(this.raw.thumbnail) : undefined;
        }
        return this._thumbnail;
    }
    /**
     * Optional. Original animation filename as defined by the sender
     */
    get fileName(): string | undefined {
        return this.raw.file_name;
    }
    /**
     * Optional. MIME type of the file as defined by the sender
     */
    get mimeType(): string | undefined {
        return this.raw.mime_type;
    }
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     */
    get fileSize(): number | undefined {
        return this.raw.file_size;
    }
    /**
     * true if `thumbnail` is set
     */
    hasThumbnail(): this is this & {
        thumbnail: PhotoSize;
    } {
        return this.raw.thumbnail != null;
    }
    /**
     * true if `file_name` is set
     */
    hasFileName(): this is this & {
        fileName: string;
    } {
        return this.raw.file_name != null;
    }
    /**
     * true if `mime_type` is set
     */
    hasMimeType(): this is this & {
        mimeType: string;
    } {
        return this.raw.mime_type != null;
    }
    /**
     * true if `file_size` is set
     */
    hasFileSize(): this is this & {
        fileSize: number;
    } {
        return this.raw.file_size != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("Animation", this, depth, options, inspect);
    }
}

/**
 * Describes the position of a rectangle area on a story media or a TON wallet card.
 */
export class AreaPosition {
    constructor(public raw: TelegramAreaPosition) { }
    static fromPayload(raw: TelegramAreaPosition): AreaPosition {
        return new AreaPosition(raw);
    }
    /**
     * The abscissa of the area's center, as a percentage of the media or the card width
     */
    get xPercentage(): number {
        return this.raw.x_percentage;
    }
    /**
     * The ordinate of the area's center, as a percentage of the media or the card height
     */
    get yPercentage(): number {
        return this.raw.y_percentage;
    }
    /**
     * The width of the area's rectangle, as a percentage of the media or the card width
     */
    get widthPercentage(): number {
        return this.raw.width_percentage;
    }
    /**
     * The height of the area's rectangle, as a percentage of the media or the card height
     */
    get heightPercentage(): number {
        return this.raw.height_percentage;
    }
    /**
     * The clockwise rotation angle of the rectangle, in degrees; 0-360
     */
    get rotationAngle(): number {
        return this.raw.rotation_angle;
    }
    /**
     * The radius of the rectangle corner rounding, as a percentage of the media or the card width
     */
    get cornerRadiusPercentage(): number {
        return this.raw.corner_radius_percentage;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("AreaPosition", this, depth, options, inspect);
    }
}

/**
 * This object represents an audio file to be treated as music by the Telegram clients.
 */
export class Audio {
    private _thumbnail?: PhotoSize | undefined;
    constructor(public raw: TelegramAudio) { }
    static fromPayload(raw: TelegramAudio): Audio {
        return new Audio(raw);
    }
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    get fileId(): string {
        return this.raw.file_id;
    }
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    get fileUniqueId(): string {
        return this.raw.file_unique_id;
    }
    /**
     * Duration of the audio in seconds as defined by the sender
     */
    get duration(): number {
        return this.raw.duration;
    }
    /**
     * Optional. Performer of the audio as defined by the sender or by audio tags
     */
    get performer(): string | undefined {
        return this.raw.performer;
    }
    /**
     * Optional. Title of the audio as defined by the sender or by audio tags
     */
    get title(): string | undefined {
        return this.raw.title;
    }
    /**
     * Optional. Original filename as defined by the sender
     */
    get fileName(): string | undefined {
        return this.raw.file_name;
    }
    /**
     * Optional. MIME type of the file as defined by the sender
     */
    get mimeType(): string | undefined {
        return this.raw.mime_type;
    }
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     */
    get fileSize(): number | undefined {
        return this.raw.file_size;
    }
    /**
     * Optional. Thumbnail of the album cover to which the music file belongs
     */
    get thumbnail(): PhotoSize | undefined {
        if (this._thumbnail === undefined) {
            this._thumbnail = this.raw.thumbnail ? new PhotoSize(this.raw.thumbnail) : undefined;
        }
        return this._thumbnail;
    }
    /**
     * true if `performer` is set
     */
    hasPerformer(): this is this & {
        performer: string;
    } {
        return this.raw.performer != null;
    }
    /**
     * true if `title` is set
     */
    hasTitle(): this is this & {
        title: string;
    } {
        return this.raw.title != null;
    }
    /**
     * true if `file_name` is set
     */
    hasFileName(): this is this & {
        fileName: string;
    } {
        return this.raw.file_name != null;
    }
    /**
     * true if `mime_type` is set
     */
    hasMimeType(): this is this & {
        mimeType: string;
    } {
        return this.raw.mime_type != null;
    }
    /**
     * true if `file_size` is set
     */
    hasFileSize(): this is this & {
        fileSize: number;
    } {
        return this.raw.file_size != null;
    }
    /**
     * true if `thumbnail` is set
     */
    hasThumbnail(): this is this & {
        thumbnail: PhotoSize;
    } {
        return this.raw.thumbnail != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("Audio", this, depth, options, inspect);
    }
}

/**
 * This object represents a chat.
 */
export class Chat {
    constructor(public raw: TelegramChat) { }
    static fromPayload(raw: TelegramChat): Chat {
        return new Chat(raw);
    }
    /**
     * Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
     */
    get id(): number {
        return this.raw.id;
    }
    /**
     * Type of the chat, can be either “private”, “group”, “supergroup” or “channel”
     */
    get type(): "private" | "group" | "supergroup" | "channel" {
        return this.raw.type;
    }
    /**
     * Optional. Title, for supergroups, channels and group chats
     */
    get title(): string | undefined {
        return this.raw.title;
    }
    /**
     * Optional. Username, for private chats, supergroups and channels if available
     */
    get username(): string | undefined {
        return this.raw.username;
    }
    /**
     * Optional. First name of the other party in a private chat
     */
    get firstName(): string | undefined {
        return this.raw.first_name;
    }
    /**
     * Optional. Last name of the other party in a private chat
     */
    get lastName(): string | undefined {
        return this.raw.last_name;
    }
    /**
     * Optional. True, if the supergroup chat is a forum (has topics enabled)
     */
    get isForum(): true | undefined {
        return this.raw.is_forum;
    }
    /**
     * Optional. True, if the chat is the direct messages chat of a channel
     */
    get isDirectMessages(): true | undefined {
        return this.raw.is_direct_messages;
    }
    /**
     * true if `title` is set
     */
    hasTitle(): this is this & {
        title: string;
    } {
        return this.raw.title != null;
    }
    /**
     * true if `username` is set
     */
    hasUsername(): this is this & {
        username: string;
    } {
        return this.raw.username != null;
    }
    /**
     * true if `first_name` is set
     */
    hasFirstName(): this is this & {
        firstName: string;
    } {
        return this.raw.first_name != null;
    }
    /**
     * true if `last_name` is set
     */
    hasLastName(): this is this & {
        lastName: string;
    } {
        return this.raw.last_name != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("Chat", this, depth, options, inspect);
    }
}

export type PrivateChat = Omit<Chat, "type"> & {
    type: "private";
};

export type GroupChat = Omit<Chat, "type"> & {
    type: "group";
};

export type SupergroupChat = Omit<Chat, "type"> & {
    type: "supergroup";
};

export type ChannelChat = Omit<Chat, "type"> & {
    type: "channel";
};

/**
 * This object contains information about a chat boost.
 */
export class ChatBoost {
    constructor(public raw: TelegramChatBoost) { }
    static fromPayload(raw: TelegramChatBoost): ChatBoost {
        return new ChatBoost(raw);
    }
    /**
     * Unique identifier of the boost
     */
    get boostId(): string {
        return this.raw.boost_id;
    }
    /**
     * Point in time (Unix timestamp) when the chat was boosted
     */
    get addDate(): number {
        return this.raw.add_date;
    }
    /**
     * Point in time (Unix timestamp) when the boost will automatically expire, unless the booster's Telegram Premium subscription is prolonged
     */
    get expirationDate(): number {
        return this.raw.expiration_date;
    }
    /**
     * Source of the added boost
     */
    get source(): TelegramChatBoostSource {
        return this.raw.source;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ChatBoost", this, depth, options, inspect);
    }
}

/**
 * This object represents a boost removed from a chat.
 */
export class ChatBoostRemoved {
    private _chat?: Chat;
    constructor(public raw: TelegramChatBoostRemoved) { }
    static fromPayload(raw: TelegramChatBoostRemoved): ChatBoostRemoved {
        return new ChatBoostRemoved(raw);
    }
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
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ChatBoostRemoved", this, depth, options, inspect);
    }
}

/**
 * This object represents a boost added to a chat or changed.
 */
export class ChatBoostUpdated {
    private _chat?: Chat;
    private _boost?: ChatBoost;
    constructor(public raw: TelegramChatBoostUpdated) { }
    static fromPayload(raw: TelegramChatBoostUpdated): ChatBoostUpdated {
        return new ChatBoostUpdated(raw);
    }
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
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ChatBoostUpdated", this, depth, options, inspect);
    }
}

/**
 * Represents an invite link for a chat.
 */
export class ChatInviteLink {
    private _creator?: User;
    constructor(public raw: TelegramChatInviteLink) { }
    static fromPayload(raw: TelegramChatInviteLink): ChatInviteLink {
        return new ChatInviteLink(raw);
    }
    /**
     * The invite link. If the link was created by another chat administrator, then the second part of the link will be replaced with “…”.
     */
    get inviteLink(): string {
        return this.raw.invite_link;
    }
    /**
     * Creator of the link
     */
    get creator(): User {
        return this._creator ??= new User(this.raw.creator);
    }
    /**
     * True, if users joining the chat via the link need to be approved by chat administrators
     */
    get createsJoinRequest(): boolean {
        return this.raw.creates_join_request;
    }
    /**
     * True, if the link is primary
     */
    get isPrimary(): boolean {
        return this.raw.is_primary;
    }
    /**
     * True, if the link is revoked
     */
    get isRevoked(): boolean {
        return this.raw.is_revoked;
    }
    /**
     * Optional. Invite link name
     */
    get name(): string | undefined {
        return this.raw.name;
    }
    /**
     * Optional. Point in time (Unix timestamp) when the link will expire or has been expired
     */
    get expireDate(): number | undefined {
        return this.raw.expire_date;
    }
    /**
     * Optional. The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999
     */
    get memberLimit(): number | undefined {
        return this.raw.member_limit;
    }
    /**
     * Optional. Number of pending join requests created using this link
     */
    get pendingJoinRequestCount(): number | undefined {
        return this.raw.pending_join_request_count;
    }
    /**
     * Optional. The number of seconds the subscription will be active for before the next payment
     */
    get subscriptionPeriod(): number | undefined {
        return this.raw.subscription_period;
    }
    /**
     * Optional. The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat using the link
     */
    get subscriptionPrice(): number | undefined {
        return this.raw.subscription_price;
    }
    /**
     * true if `name` is set
     */
    hasName(): this is this & {
        name: string;
    } {
        return this.raw.name != null;
    }
    /**
     * true if `expire_date` is set
     */
    hasExpireDate(): this is this & {
        expireDate: number;
    } {
        return this.raw.expire_date != null;
    }
    /**
     * true if `member_limit` is set
     */
    hasMemberLimit(): this is this & {
        memberLimit: number;
    } {
        return this.raw.member_limit != null;
    }
    /**
     * true if `pending_join_request_count` is set
     */
    hasPendingJoinRequestCount(): this is this & {
        pendingJoinRequestCount: number;
    } {
        return this.raw.pending_join_request_count != null;
    }
    /**
     * true if `subscription_period` is set
     */
    hasSubscriptionPeriod(): this is this & {
        subscriptionPeriod: number;
    } {
        return this.raw.subscription_period != null;
    }
    /**
     * true if `subscription_price` is set
     */
    hasSubscriptionPrice(): this is this & {
        subscriptionPrice: number;
    } {
        return this.raw.subscription_price != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ChatInviteLink", this, depth, options, inspect);
    }
}

/**
 * Represents a join request sent to a chat.
 */
export class ChatJoinRequest {
    private _chat?: Chat;
    private _from?: User;
    private _inviteLink?: ChatInviteLink | undefined;
    constructor(public raw: TelegramChatJoinRequest) { }
    static fromPayload(raw: TelegramChatJoinRequest): ChatJoinRequest {
        return new ChatJoinRequest(raw);
    }
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
        if (this._inviteLink === undefined) {
            this._inviteLink = this.raw.invite_link ? new ChatInviteLink(this.raw.invite_link) : undefined;
        }
        return this._inviteLink;
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
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ChatJoinRequest", this, depth, options, inspect);
    }
}

/**
 * Represents a location to which a chat is connected.
 */
export class ChatLocation {
    private _location?: Location;
    constructor(public raw: TelegramChatLocation) { }
    static fromPayload(raw: TelegramChatLocation): ChatLocation {
        return new ChatLocation(raw);
    }
    /**
     * The location to which the supergroup is connected. Can't be a live location.
     */
    get location(): Location {
        return this._location ??= new Location(this.raw.location);
    }
    /**
     * Location address; 1-64 characters, as defined by the chat owner
     */
    get address(): string {
        return this.raw.address;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ChatLocation", this, depth, options, inspect);
    }
}

/**
 * This object contains information about one member of a chat. Currently, the following 6 types of chat members are supported:
 */
export class ChatMember {
    constructor(public raw: TelegramChatMember) { }
    static fromPayload(raw: TelegramChatMember): ChatMember {
        return new ChatMember(raw);
    }
    /**
     * true when the member's status is 'administrator'
     */
    isAdmin(): boolean {
        return (this.raw as { status?: string }).status === 'administrator';
    }
    /**
     * true when the member's status is 'creator' (chat owner)
     */
    isCreator(): boolean {
        return (this.raw as { status?: string }).status === 'creator';
    }
    /**
     * true when the member's status is 'member' (regular non-admin participant)
     */
    isMember(): boolean {
        return (this.raw as { status?: string }).status === 'member';
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ChatMember", this, depth, options, inspect);
    }
}

/**
 * This object represents changes in the status of a chat member.
 */
export class ChatMemberUpdated {
    private _chat?: Chat;
    private _from?: User;
    private _oldChatMember?: ChatMember;
    private _newChatMember?: ChatMember;
    private _inviteLink?: ChatInviteLink | undefined;
    constructor(public raw: TelegramChatMemberUpdated) { }
    static fromPayload(raw: TelegramChatMemberUpdated): ChatMemberUpdated {
        return new ChatMemberUpdated(raw);
    }
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
        if (this._inviteLink === undefined) {
            this._inviteLink = this.raw.invite_link ? new ChatInviteLink(this.raw.invite_link) : undefined;
        }
        return this._inviteLink;
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
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ChatMemberUpdated", this, depth, options, inspect);
    }
}

/**
 * Describes actions that a non-administrator user is allowed to take in a chat.
 */
export class ChatPermissions {
    constructor(public raw: TelegramChatPermissions) { }
    static fromPayload(raw: TelegramChatPermissions): ChatPermissions {
        return new ChatPermissions(raw);
    }
    /**
     * Optional. True, if the user is allowed to send text messages, rich messages, contacts, giveaways, giveaway winners, invoices, locations and venues
     */
    get canSendMessages(): boolean | undefined {
        return this.raw.can_send_messages;
    }
    /**
     * Optional. True, if the user is allowed to send audios
     */
    get canSendAudios(): boolean | undefined {
        return this.raw.can_send_audios;
    }
    /**
     * Optional. True, if the user is allowed to send documents
     */
    get canSendDocuments(): boolean | undefined {
        return this.raw.can_send_documents;
    }
    /**
     * Optional. True, if the user is allowed to send photos
     */
    get canSendPhotos(): boolean | undefined {
        return this.raw.can_send_photos;
    }
    /**
     * Optional. True, if the user is allowed to send videos
     */
    get canSendVideos(): boolean | undefined {
        return this.raw.can_send_videos;
    }
    /**
     * Optional. True, if the user is allowed to send video notes
     */
    get canSendVideoNotes(): boolean | undefined {
        return this.raw.can_send_video_notes;
    }
    /**
     * Optional. True, if the user is allowed to send voice notes
     */
    get canSendVoiceNotes(): boolean | undefined {
        return this.raw.can_send_voice_notes;
    }
    /**
     * Optional. True, if the user is allowed to send polls and checklists
     */
    get canSendPolls(): boolean | undefined {
        return this.raw.can_send_polls;
    }
    /**
     * Optional. True, if the user is allowed to send animations, games, stickers, widgets and use inline bots
     */
    get canSendOtherMessages(): boolean | undefined {
        return this.raw.can_send_other_messages;
    }
    /**
     * Optional. True, if the user is allowed to add web page previews to their messages
     */
    get canAddWebPagePreviews(): boolean | undefined {
        return this.raw.can_add_web_page_previews;
    }
    /**
     * Optional. True, if the user is allowed to react to messages. If omitted, defaults to the value of can_send_messages.
     */
    get canReactToMessages(): boolean | undefined {
        return this.raw.can_react_to_messages;
    }
    /**
     * Optional. True, if the user is allowed to edit their own tag. If omitted, defaults to the value of can_pin_messages.
     */
    get canEditTag(): boolean | undefined {
        return this.raw.can_edit_tag;
    }
    /**
     * Optional. True, if the user is allowed to change the chat title, photo and other settings. Ignored in public supergroups.
     */
    get canChangeInfo(): boolean | undefined {
        return this.raw.can_change_info;
    }
    /**
     * Optional. True, if the user is allowed to invite new users to the chat
     */
    get canInviteUsers(): boolean | undefined {
        return this.raw.can_invite_users;
    }
    /**
     * Optional. True, if the user is allowed to pin messages. Ignored in public supergroups.
     */
    get canPinMessages(): boolean | undefined {
        return this.raw.can_pin_messages;
    }
    /**
     * Optional. True, if the user is allowed to create forum topics. If omitted, defaults to the value of can_pin_messages.
     */
    get canManageTopics(): boolean | undefined {
        return this.raw.can_manage_topics;
    }
    /**
     * true if `can_send_messages` is set
     */
    hasCanSendMessages(): this is this & {
        canSendMessages: boolean;
    } {
        return this.raw.can_send_messages != null;
    }
    /**
     * true if `can_send_audios` is set
     */
    hasCanSendAudios(): this is this & {
        canSendAudios: boolean;
    } {
        return this.raw.can_send_audios != null;
    }
    /**
     * true if `can_send_documents` is set
     */
    hasCanSendDocuments(): this is this & {
        canSendDocuments: boolean;
    } {
        return this.raw.can_send_documents != null;
    }
    /**
     * true if `can_send_photos` is set
     */
    hasCanSendPhotos(): this is this & {
        canSendPhotos: boolean;
    } {
        return this.raw.can_send_photos != null;
    }
    /**
     * true if `can_send_videos` is set
     */
    hasCanSendVideos(): this is this & {
        canSendVideos: boolean;
    } {
        return this.raw.can_send_videos != null;
    }
    /**
     * true if `can_send_video_notes` is set
     */
    hasCanSendVideoNotes(): this is this & {
        canSendVideoNotes: boolean;
    } {
        return this.raw.can_send_video_notes != null;
    }
    /**
     * true if `can_send_voice_notes` is set
     */
    hasCanSendVoiceNotes(): this is this & {
        canSendVoiceNotes: boolean;
    } {
        return this.raw.can_send_voice_notes != null;
    }
    /**
     * true if `can_send_polls` is set
     */
    hasCanSendPolls(): this is this & {
        canSendPolls: boolean;
    } {
        return this.raw.can_send_polls != null;
    }
    /**
     * true if `can_send_other_messages` is set
     */
    hasCanSendOtherMessages(): this is this & {
        canSendOtherMessages: boolean;
    } {
        return this.raw.can_send_other_messages != null;
    }
    /**
     * true if `can_add_web_page_previews` is set
     */
    hasCanAddWebPagePreviews(): this is this & {
        canAddWebPagePreviews: boolean;
    } {
        return this.raw.can_add_web_page_previews != null;
    }
    /**
     * true if `can_react_to_messages` is set
     */
    hasCanReactToMessages(): this is this & {
        canReactToMessages: boolean;
    } {
        return this.raw.can_react_to_messages != null;
    }
    /**
     * true if `can_edit_tag` is set
     */
    hasCanEditTag(): this is this & {
        canEditTag: boolean;
    } {
        return this.raw.can_edit_tag != null;
    }
    /**
     * true if `can_change_info` is set
     */
    hasCanChangeInfo(): this is this & {
        canChangeInfo: boolean;
    } {
        return this.raw.can_change_info != null;
    }
    /**
     * true if `can_invite_users` is set
     */
    hasCanInviteUsers(): this is this & {
        canInviteUsers: boolean;
    } {
        return this.raw.can_invite_users != null;
    }
    /**
     * true if `can_pin_messages` is set
     */
    hasCanPinMessages(): this is this & {
        canPinMessages: boolean;
    } {
        return this.raw.can_pin_messages != null;
    }
    /**
     * true if `can_manage_topics` is set
     */
    hasCanManageTopics(): this is this & {
        canManageTopics: boolean;
    } {
        return this.raw.can_manage_topics != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ChatPermissions", this, depth, options, inspect);
    }
}

/**
 * This object represents a chat photo.
 */
export class ChatPhoto {
    constructor(public raw: TelegramChatPhoto) { }
    static fromPayload(raw: TelegramChatPhoto): ChatPhoto {
        return new ChatPhoto(raw);
    }
    /**
     * File identifier of small (160x160) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed.
     */
    get smallFileId(): string {
        return this.raw.small_file_id;
    }
    /**
     * Unique file identifier of small (160x160) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    get smallFileUniqueId(): string {
        return this.raw.small_file_unique_id;
    }
    /**
     * File identifier of big (640x640) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed.
     */
    get bigFileId(): string {
        return this.raw.big_file_id;
    }
    /**
     * Unique file identifier of big (640x640) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    get bigFileUniqueId(): string {
        return this.raw.big_file_unique_id;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ChatPhoto", this, depth, options, inspect);
    }
}

/**
 * This object contains information about a chat that was shared with the bot using a KeyboardButtonRequestChat button.
 */
export class ChatShared {
    private _photo?: Photo | undefined;
    constructor(public raw: TelegramChatShared) { }
    static fromPayload(raw: TelegramChatShared): ChatShared {
        return new ChatShared(raw);
    }
    /**
     * Identifier of the request
     */
    get requestId(): number {
        return this.raw.request_id;
    }
    /**
     * Identifier of the shared chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. The bot may not have access to the chat and could be unable to use this identifier, unless the chat is already known to the bot by some other means.
     */
    get chatId(): number {
        return this.raw.chat_id;
    }
    /**
     * Optional. Title of the chat, if the title was requested by the bot
     */
    get title(): string | undefined {
        return this.raw.title;
    }
    /**
     * Optional. Username of the chat, if the username was requested by the bot and available
     */
    get username(): string | undefined {
        return this.raw.username;
    }
    /**
     * Optional. Available sizes of the chat photo, if the photo was requested by the bot
     */
    get photo(): Photo | undefined {
        if (this._photo === undefined) {
            this._photo = this.raw.photo ? new Photo(this.raw.photo) : undefined;
        }
        return this._photo;
    }
    /**
     * true if `title` is set
     */
    hasTitle(): this is this & {
        title: string;
    } {
        return this.raw.title != null;
    }
    /**
     * true if `username` is set
     */
    hasUsername(): this is this & {
        username: string;
    } {
        return this.raw.username != null;
    }
    /**
     * true if `photo` has at least one item
     */
    hasPhoto(): this is this & {
        photo: Photo;
    } {
        return this.raw.photo != null && this.raw.photo.length > 0;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ChatShared", this, depth, options, inspect);
    }
}

/**
 * This object describes a backdrop, which can be used as the background of a theme of the screen for sharing a link to a user or a chat.
 */
export class ChatShareThemeBackdrop {
    constructor(public raw: TelegramChatShareThemeBackdrop) { }
    static fromPayload(raw: TelegramChatShareThemeBackdrop): ChatShareThemeBackdrop {
        return new ChatShareThemeBackdrop(raw);
    }
    /**
     * Unique identifier of the backdrop
     */
    get id(): number {
        return this.raw.id;
    }
    /**
     * Name of the backdrop
     */
    get name(): string {
        return this.raw.name;
    }
    /**
     * Colors of the backdrop
     */
    get colors(): TelegramUniqueGiftBackdropColors {
        return this.raw.colors;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ChatShareThemeBackdrop", this, depth, options, inspect);
    }
}

/**
 * This object contains a list of backdrops, which can be used as the background of a theme of the screen for sharing a link to a user or a chat.
 */
export class ChatShareThemeBackdrops {
    private _backdrops?: ChatShareThemeBackdrop[];
    constructor(public raw: TelegramChatShareThemeBackdrops) { }
    static fromPayload(raw: TelegramChatShareThemeBackdrops): ChatShareThemeBackdrops {
        return new ChatShareThemeBackdrops(raw);
    }
    /**
     * The list of backdrops
     */
    get backdrops(): ChatShareThemeBackdrop[] {
        return this._backdrops ??= this.raw.backdrops.map(x => new ChatShareThemeBackdrop(x));
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ChatShareThemeBackdrops", this, depth, options, inspect);
    }
}

/**
 * Represents a result of an inline query that was chosen by the user and sent to their chat partner.
 */
export class ChosenInlineResult {
    private _from?: User;
    private _location?: Location | undefined;
    constructor(public raw: TelegramChosenInlineResult) { }
    static fromPayload(raw: TelegramChosenInlineResult): ChosenInlineResult {
        return new ChosenInlineResult(raw);
    }
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
        if (this._location === undefined) {
            this._location = this.raw.location ? new Location(this.raw.location) : undefined;
        }
        return this._location;
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
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ChosenInlineResult", this, depth, options, inspect);
    }
}

/**
 * This object represents a phone contact.
 */
export class Contact {
    constructor(public raw: TelegramContact) { }
    static fromPayload(raw: TelegramContact): Contact {
        return new Contact(raw);
    }
    /**
     * Contact's phone number
     */
    get phoneNumber(): string {
        return this.raw.phone_number;
    }
    /**
     * Contact's first name
     */
    get firstName(): string {
        return this.raw.first_name;
    }
    /**
     * Optional. Contact's last name
     */
    get lastName(): string | undefined {
        return this.raw.last_name;
    }
    /**
     * Optional. Contact's user identifier in Telegram. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.
     */
    get userId(): number | undefined {
        return this.raw.user_id;
    }
    /**
     * Optional. Additional data about the contact in the form of a vCard
     */
    get vcard(): string | undefined {
        return this.raw.vcard;
    }
    /**
     * true if `last_name` is set
     */
    hasLastName(): this is this & {
        lastName: string;
    } {
        return this.raw.last_name != null;
    }
    /**
     * true if `user_id` is set
     */
    hasUserId(): this is this & {
        userId: number;
    } {
        return this.raw.user_id != null;
    }
    /**
     * true if `vcard` is set
     */
    hasVcard(): this is this & {
        vcard: string;
    } {
        return this.raw.vcard != null;
    }
    /**
     * display name; first name plus last name when present, otherwise just first name
     */
    get displayName(): string {
        return this.raw.last_name ? `${this.raw.first_name} ${this.raw.last_name}` : this.raw.first_name;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("Contact", this, depth, options, inspect);
    }
}

/**
 * This object represents an animated emoji that displays a random value.
 */
export class Dice {
    constructor(public raw: TelegramDice) { }
    static fromPayload(raw: TelegramDice): Dice {
        return new Dice(raw);
    }
    /**
     * Emoji on which the dice throw animation is based
     */
    get emoji(): string {
        return this.raw.emoji;
    }
    /**
     * Value of the dice, 1-6 for “”, “” and “” base emoji, 1-5 for “” and “” base emoji, 1-64 for “” base emoji
     */
    get value(): number {
        return this.raw.value;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("Dice", this, depth, options, inspect);
    }
}

/**
 * This object represents a general file (as opposed to photos, voice messages and audio files).
 */
export class Document {
    private _thumbnail?: PhotoSize | undefined;
    constructor(public raw: TelegramDocument) { }
    static fromPayload(raw: TelegramDocument): Document {
        return new Document(raw);
    }
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    get fileId(): string {
        return this.raw.file_id;
    }
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    get fileUniqueId(): string {
        return this.raw.file_unique_id;
    }
    /**
     * Optional. Document thumbnail as defined by the sender
     */
    get thumbnail(): PhotoSize | undefined {
        if (this._thumbnail === undefined) {
            this._thumbnail = this.raw.thumbnail ? new PhotoSize(this.raw.thumbnail) : undefined;
        }
        return this._thumbnail;
    }
    /**
     * Optional. Original filename as defined by the sender
     */
    get fileName(): string | undefined {
        return this.raw.file_name;
    }
    /**
     * Optional. MIME type of the file as defined by the sender
     */
    get mimeType(): string | undefined {
        return this.raw.mime_type;
    }
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     */
    get fileSize(): number | undefined {
        return this.raw.file_size;
    }
    /**
     * true if `thumbnail` is set
     */
    hasThumbnail(): this is this & {
        thumbnail: PhotoSize;
    } {
        return this.raw.thumbnail != null;
    }
    /**
     * true if `file_name` is set
     */
    hasFileName(): this is this & {
        fileName: string;
    } {
        return this.raw.file_name != null;
    }
    /**
     * true if `mime_type` is set
     */
    hasMimeType(): this is this & {
        mimeType: string;
    } {
        return this.raw.mime_type != null;
    }
    /**
     * true if `file_size` is set
     */
    hasFileSize(): this is this & {
        fileSize: number;
    } {
        return this.raw.file_size != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("Document", this, depth, options, inspect);
    }
}

/**
 * This object contains information about a message that is being replied to, which may come from another chat or forum topic.
 */
export class ExternalReplyInfo {
    private _chat?: Chat | undefined;
    private _linkPreviewOptions?: LinkPreviewOptions | undefined;
    private _animation?: Animation | undefined;
    private _audio?: Audio | undefined;
    private _document?: Document | undefined;
    private _livePhoto?: LivePhoto | undefined;
    private _photo?: Photo | undefined;
    private _sticker?: Sticker | undefined;
    private _story?: Story | undefined;
    private _video?: Video | undefined;
    private _videoNote?: VideoNote | undefined;
    private _voice?: Voice | undefined;
    private _widget?: Widget | undefined;
    private _contact?: Contact | undefined;
    private _dice?: Dice | undefined;
    private _game?: Game | undefined;
    private _giveaway?: Giveaway | undefined;
    private _giveawayWinners?: GiveawayWinners | undefined;
    private _invoice?: Invoice | undefined;
    private _location?: Location | undefined;
    private _poll?: Poll | undefined;
    private _venue?: Venue | undefined;
    constructor(public raw: TelegramExternalReplyInfo) { }
    static fromPayload(raw: TelegramExternalReplyInfo): ExternalReplyInfo {
        return new ExternalReplyInfo(raw);
    }
    /**
     * Origin of the message replied to by the given message
     */
    get origin(): TelegramMessageOrigin {
        return this.raw.origin;
    }
    /**
     * Optional. Chat the original message belongs to. Available only if the chat is a supergroup or a channel.
     */
    get chat(): Chat | undefined {
        if (this._chat === undefined) {
            this._chat = this.raw.chat ? new Chat(this.raw.chat) : undefined;
        }
        return this._chat;
    }
    /**
     * Optional. Unique message identifier inside the original chat. Available only if the original chat is a supergroup or a channel.
     */
    get id(): number | undefined {
        return this.raw.message_id;
    }
    /**
     * Optional. Options used for link preview generation for the original message, if it is a text message
     */
    get linkPreviewOptions(): LinkPreviewOptions | undefined {
        if (this._linkPreviewOptions === undefined) {
            this._linkPreviewOptions = this.raw.link_preview_options ? new LinkPreviewOptions(this.raw.link_preview_options) : undefined;
        }
        return this._linkPreviewOptions;
    }
    /**
     * Optional. Message is an animation, information about the animation
     */
    get animation(): Animation | undefined {
        if (this._animation === undefined) {
            this._animation = this.raw.animation ? new Animation(this.raw.animation) : undefined;
        }
        return this._animation;
    }
    /**
     * Optional. Message is an audio file, information about the file
     */
    get audio(): Audio | undefined {
        if (this._audio === undefined) {
            this._audio = this.raw.audio ? new Audio(this.raw.audio) : undefined;
        }
        return this._audio;
    }
    /**
     * Optional. Message is a general file, information about the file
     */
    get document(): Document | undefined {
        if (this._document === undefined) {
            this._document = this.raw.document ? new Document(this.raw.document) : undefined;
        }
        return this._document;
    }
    /**
     * Optional. Message is a live photo, information about the live photo
     */
    get livePhoto(): LivePhoto | undefined {
        if (this._livePhoto === undefined) {
            this._livePhoto = this.raw.live_photo ? new LivePhoto(this.raw.live_photo) : undefined;
        }
        return this._livePhoto;
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
        if (this._photo === undefined) {
            this._photo = this.raw.photo ? new Photo(this.raw.photo) : undefined;
        }
        return this._photo;
    }
    /**
     * Optional. Message is a sticker, information about the sticker
     */
    get sticker(): Sticker | undefined {
        if (this._sticker === undefined) {
            this._sticker = this.raw.sticker ? new Sticker(this.raw.sticker) : undefined;
        }
        return this._sticker;
    }
    /**
     * Optional. Message is a forwarded story
     */
    get story(): Story | undefined {
        if (this._story === undefined) {
            this._story = this.raw.story ? new Story(this.raw.story) : undefined;
        }
        return this._story;
    }
    /**
     * Optional. Message is a video, information about the video
     */
    get video(): Video | undefined {
        if (this._video === undefined) {
            this._video = this.raw.video ? new Video(this.raw.video) : undefined;
        }
        return this._video;
    }
    /**
     * Optional. Message is a video note, information about the video message
     */
    get videoNote(): VideoNote | undefined {
        if (this._videoNote === undefined) {
            this._videoNote = this.raw.video_note ? new VideoNote(this.raw.video_note) : undefined;
        }
        return this._videoNote;
    }
    /**
     * Optional. Message is a voice message, information about the file
     */
    get voice(): Voice | undefined {
        if (this._voice === undefined) {
            this._voice = this.raw.voice ? new Voice(this.raw.voice) : undefined;
        }
        return this._voice;
    }
    /**
     * Optional. Message is an HTML widget, information about the widget
     */
    get widget(): Widget | undefined {
        if (this._widget === undefined) {
            this._widget = this.raw.widget ? new Widget(this.raw.widget) : undefined;
        }
        return this._widget;
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
        if (this._contact === undefined) {
            this._contact = this.raw.contact ? new Contact(this.raw.contact) : undefined;
        }
        return this._contact;
    }
    /**
     * Optional. Message is a dice with random value
     */
    get dice(): Dice | undefined {
        if (this._dice === undefined) {
            this._dice = this.raw.dice ? new Dice(this.raw.dice) : undefined;
        }
        return this._dice;
    }
    /**
     * Optional. Message is a game, information about the game. More about games »
     */
    get game(): Game | undefined {
        if (this._game === undefined) {
            this._game = this.raw.game ? new Game(this.raw.game) : undefined;
        }
        return this._game;
    }
    /**
     * Optional. Message is a scheduled giveaway, information about the giveaway
     */
    get giveaway(): Giveaway | undefined {
        if (this._giveaway === undefined) {
            this._giveaway = this.raw.giveaway ? new Giveaway(this.raw.giveaway) : undefined;
        }
        return this._giveaway;
    }
    /**
     * Optional. A giveaway with public winners was completed
     */
    get giveawayWinners(): GiveawayWinners | undefined {
        if (this._giveawayWinners === undefined) {
            this._giveawayWinners = this.raw.giveaway_winners ? new GiveawayWinners(this.raw.giveaway_winners) : undefined;
        }
        return this._giveawayWinners;
    }
    /**
     * Optional. Message is an invoice for a payment, information about the invoice. More about payments »
     */
    get invoice(): Invoice | undefined {
        if (this._invoice === undefined) {
            this._invoice = this.raw.invoice ? new Invoice(this.raw.invoice) : undefined;
        }
        return this._invoice;
    }
    /**
     * Optional. Message is a shared location, information about the location
     */
    get location(): Location | undefined {
        if (this._location === undefined) {
            this._location = this.raw.location ? new Location(this.raw.location) : undefined;
        }
        return this._location;
    }
    /**
     * Optional. Message is a native poll, information about the poll
     */
    get poll(): Poll | undefined {
        if (this._poll === undefined) {
            this._poll = this.raw.poll ? new Poll(this.raw.poll) : undefined;
        }
        return this._poll;
    }
    /**
     * Optional. Message is a venue, information about the venue
     */
    get venue(): Venue | undefined {
        if (this._venue === undefined) {
            this._venue = this.raw.venue ? new Venue(this.raw.venue) : undefined;
        }
        return this._venue;
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
     * true if `link_preview_options` is set
     */
    hasLinkPreviewOptions(): this is this & {
        linkPreviewOptions: LinkPreviewOptions;
    } {
        return this.raw.link_preview_options != null;
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
     * true if `invoice` is set
     */
    hasInvoice(): this is this & {
        invoice: Invoice;
    } {
        return this.raw.invoice != null;
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
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ExternalReplyInfo", this, depth, options, inspect);
    }
}

/**
 * This object represents a file ready to be downloaded. The file can be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile.
 */
export class File {
    constructor(public raw: TelegramFile) { }
    static fromPayload(raw: TelegramFile): File {
        return new File(raw);
    }
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    get fileId(): string {
        return this.raw.file_id;
    }
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    get fileUniqueId(): string {
        return this.raw.file_unique_id;
    }
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     */
    get fileSize(): number | undefined {
        return this.raw.file_size;
    }
    /**
     * Optional. File path. Use https://api.telegram.org/file/bot<token>/<file_path> to get the file.
     */
    get filePath(): string | undefined {
        return this.raw.file_path;
    }
    /**
     * true if `file_size` is set
     */
    hasFileSize(): this is this & {
        fileSize: number;
    } {
        return this.raw.file_size != null;
    }
    /**
     * true if `file_path` is set
     */
    hasFilePath(): this is this & {
        filePath: string;
    } {
        return this.raw.file_path != null;
    }
    /**
     * full download url for this file using the given bot token; undefined when file_path is missing
     */
    link(token: string): string | undefined {
        return this.raw.file_path ? `https://api.telegram.org/file/bot${token}/${this.raw.file_path}` : undefined;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("File", this, depth, options, inspect);
    }
}

/**
 * This object represents a service message about a new forum topic created in the chat.
 */
export class ForumTopicCreated {
    constructor(public raw: TelegramForumTopicCreated) { }
    static fromPayload(raw: TelegramForumTopicCreated): ForumTopicCreated {
        return new ForumTopicCreated(raw);
    }
    /**
     * Name of the topic
     */
    get name(): string {
        return this.raw.name;
    }
    /**
     * Color of the topic icon in RGB format
     */
    get iconColor(): number {
        return this.raw.icon_color;
    }
    /**
     * Optional. Unique identifier of the custom emoji shown as the topic icon
     */
    get iconCustomEmojiId(): string | undefined {
        return this.raw.icon_custom_emoji_id;
    }
    /**
     * Optional. True, if the name of the topic wasn't specified explicitly by its creator and likely needs to be changed by the bot
     */
    get isNameImplicit(): true | undefined {
        return this.raw.is_name_implicit;
    }
    /**
     * true if `icon_custom_emoji_id` is set
     */
    hasIconCustomEmojiId(): this is this & {
        iconCustomEmojiId: string;
    } {
        return this.raw.icon_custom_emoji_id != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ForumTopicCreated", this, depth, options, inspect);
    }
}

/**
 * This object represents a service message about an edited forum topic.
 */
export class ForumTopicEdited {
    constructor(public raw: TelegramForumTopicEdited) { }
    static fromPayload(raw: TelegramForumTopicEdited): ForumTopicEdited {
        return new ForumTopicEdited(raw);
    }
    /**
     * Optional. New name of the topic, if it was edited
     */
    get name(): string | undefined {
        return this.raw.name;
    }
    /**
     * Optional. New identifier of the custom emoji shown as the topic icon, if it was edited; an empty string if the icon was removed
     */
    get iconCustomEmojiId(): string | undefined {
        return this.raw.icon_custom_emoji_id;
    }
    /**
     * true if `name` is set
     */
    hasName(): this is this & {
        name: string;
    } {
        return this.raw.name != null;
    }
    /**
     * true if `icon_custom_emoji_id` is set
     */
    hasIconCustomEmojiId(): this is this & {
        iconCustomEmojiId: string;
    } {
        return this.raw.icon_custom_emoji_id != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ForumTopicEdited", this, depth, options, inspect);
    }
}

/**
 * This object represents a game. Use BotFather to create and edit games, their short names will act as unique identifiers.
 */
export class Game {
    private _photo?: Photo;
    private _textEntities?: MessageEntity[] | undefined;
    private _animation?: Animation | undefined;
    constructor(public raw: TelegramGame) { }
    static fromPayload(raw: TelegramGame): Game {
        return new Game(raw);
    }
    /**
     * Title of the game
     */
    get title(): string {
        return this.raw.title;
    }
    /**
     * Description of the game
     */
    get description(): string {
        return this.raw.description;
    }
    /**
     * Photo that will be displayed in the game message in chats
     */
    get photo(): Photo {
        return this._photo ??= new Photo(this.raw.photo);
    }
    /**
     * Optional. Brief description of the game or high scores included in the game message. Can be automatically edited to include current high scores for the game when the bot calls setGameScore, or manually edited using editMessageText. 0-4096 characters.
     */
    get text(): string | undefined {
        return this.raw.text;
    }
    /**
     * Optional. Special entities that appear in text, such as usernames, URLs, bot commands, etc.
     */
    get textEntities(): MessageEntity[] | undefined {
        return this.raw.text_entities ? (this._textEntities ??= this.raw.text_entities.map(x => new MessageEntity(x))) : undefined;
    }
    /**
     * Optional. Animation that will be displayed in the game message in chats. Upload via BotFather.
     */
    get animation(): Animation | undefined {
        if (this._animation === undefined) {
            this._animation = this.raw.animation ? new Animation(this.raw.animation) : undefined;
        }
        return this._animation;
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
     * true if `text_entities` has at least one item
     */
    hasTextEntities(): this is this & {
        textEntities: MessageEntity[];
    } {
        return this.raw.text_entities != null && this.raw.text_entities.length > 0;
    }
    /**
     * true if `animation` is set
     */
    hasAnimation(): this is this & {
        animation: Animation;
    } {
        return this.raw.animation != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("Game", this, depth, options, inspect);
    }
}

/**
 * This object represents a message about a scheduled giveaway.
 */
export class Giveaway {
    private _chats?: Chat[];
    constructor(public raw: TelegramGiveaway) { }
    static fromPayload(raw: TelegramGiveaway): Giveaway {
        return new Giveaway(raw);
    }
    /**
     * The list of chats which the user must join to participate in the giveaway
     */
    get chats(): Chat[] {
        return this._chats ??= this.raw.chats.map(x => new Chat(x));
    }
    /**
     * Point in time (Unix timestamp) when winners of the giveaway will be selected
     */
    get winnersSelectionDate(): number {
        return this.raw.winners_selection_date;
    }
    /**
     * The number of users which are supposed to be selected as winners of the giveaway
     */
    get winnerCount(): number {
        return this.raw.winner_count;
    }
    /**
     * Optional. True, if only users who join the chats after the giveaway started should be eligible to win
     */
    get onlyNewMembers(): true | undefined {
        return this.raw.only_new_members;
    }
    /**
     * Optional. True, if the list of giveaway winners will be visible to everyone
     */
    get hasPublicWinners(): true | undefined {
        return this.raw.has_public_winners;
    }
    /**
     * Optional. Description of additional giveaway prize
     */
    get prizeDescription(): string | undefined {
        return this.raw.prize_description;
    }
    /**
     * Optional. A list of two-letter ISO 3166-1 alpha-2 country codes indicating the countries from which eligible users for the giveaway must come. If empty, then all users can participate in the giveaway. Users with a phone number that was bought on Fragment can always participate in giveaways.
     */
    get countryCodes(): string[] | undefined {
        return this.raw.country_codes;
    }
    /**
     * Optional. The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only
     */
    get prizeStarCount(): number | undefined {
        return this.raw.prize_star_count;
    }
    /**
     * Optional. The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only
     */
    get premiumSubscriptionMonthCount(): number | undefined {
        return this.raw.premium_subscription_month_count;
    }
    /**
     * true if `only_new_members` is set
     */
    hasOnlyNewMembers(): this is this & {
        onlyNewMembers: true;
    } {
        return this.raw.only_new_members != null;
    }
    /**
     * true if `prize_description` is set
     */
    hasPrizeDescription(): this is this & {
        prizeDescription: string;
    } {
        return this.raw.prize_description != null;
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
     * true if `prize_star_count` is set
     */
    hasPrizeStarCount(): this is this & {
        prizeStarCount: number;
    } {
        return this.raw.prize_star_count != null;
    }
    /**
     * true if `premium_subscription_month_count` is set
     */
    hasPremiumSubscriptionMonthCount(): this is this & {
        premiumSubscriptionMonthCount: number;
    } {
        return this.raw.premium_subscription_month_count != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("Giveaway", this, depth, options, inspect);
    }
}

/**
 * This object represents a service message about the completion of a giveaway without public winners.
 */
export class GiveawayCompleted {
    private _giveawayMessage?: Message | undefined;
    constructor(public raw: TelegramGiveawayCompleted) { }
    static fromPayload(raw: TelegramGiveawayCompleted): GiveawayCompleted {
        return new GiveawayCompleted(raw);
    }
    /**
     * Number of winners in the giveaway
     */
    get winnerCount(): number {
        return this.raw.winner_count;
    }
    /**
     * Optional. Number of undistributed prizes
     */
    get unclaimedPrizeCount(): number | undefined {
        return this.raw.unclaimed_prize_count;
    }
    /**
     * Optional. Message with the giveaway that was completed, if it wasn't deleted
     */
    get giveawayMessage(): Message | undefined {
        if (this._giveawayMessage === undefined) {
            this._giveawayMessage = this.raw.giveaway_message ? new Message(this.raw.giveaway_message) : undefined;
        }
        return this._giveawayMessage;
    }
    /**
     * Optional. True, if the giveaway is a Telegram Star giveaway. Otherwise, currently, the giveaway is a Telegram Premium giveaway.
     */
    get isStarGiveaway(): true | undefined {
        return this.raw.is_star_giveaway;
    }
    /**
     * true if `unclaimed_prize_count` is set
     */
    hasUnclaimedPrizeCount(): this is this & {
        unclaimedPrizeCount: number;
    } {
        return this.raw.unclaimed_prize_count != null;
    }
    /**
     * true if `giveaway_message` is set
     */
    hasGiveawayMessage(): this is this & {
        giveawayMessage: Message;
    } {
        return this.raw.giveaway_message != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("GiveawayCompleted", this, depth, options, inspect);
    }
}

/**
 * This object represents a message about the completion of a giveaway with public winners.
 */
export class GiveawayWinners {
    private _chat?: Chat;
    private _winners?: User[];
    constructor(public raw: TelegramGiveawayWinners) { }
    static fromPayload(raw: TelegramGiveawayWinners): GiveawayWinners {
        return new GiveawayWinners(raw);
    }
    /**
     * The chat that created the giveaway
     */
    get chat(): Chat {
        return this._chat ??= new Chat(this.raw.chat);
    }
    /**
     * Identifier of the message with the giveaway in the chat
     */
    get giveawayMessageId(): number {
        return this.raw.giveaway_message_id;
    }
    /**
     * Point in time (Unix timestamp) when winners of the giveaway were selected
     */
    get winnersSelectionDate(): number {
        return this.raw.winners_selection_date;
    }
    /**
     * Total number of winners in the giveaway
     */
    get winnerCount(): number {
        return this.raw.winner_count;
    }
    /**
     * List of up to 100 winners of the giveaway
     */
    get winners(): User[] {
        return this._winners ??= this.raw.winners.map(x => new User(x));
    }
    /**
     * Optional. The number of other chats the user had to join in order to be eligible for the giveaway
     */
    get additionalChatCount(): number | undefined {
        return this.raw.additional_chat_count;
    }
    /**
     * Optional. The number of Telegram Stars that were split between giveaway winners; for Telegram Star giveaways only
     */
    get prizeStarCount(): number | undefined {
        return this.raw.prize_star_count;
    }
    /**
     * Optional. The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only
     */
    get premiumSubscriptionMonthCount(): number | undefined {
        return this.raw.premium_subscription_month_count;
    }
    /**
     * Optional. Number of undistributed prizes
     */
    get unclaimedPrizeCount(): number | undefined {
        return this.raw.unclaimed_prize_count;
    }
    /**
     * Optional. True, if only users who had joined the chats after the giveaway started were eligible to win
     */
    get onlyNewMembers(): true | undefined {
        return this.raw.only_new_members;
    }
    /**
     * Optional. True, if the giveaway was canceled because the payment for it was refunded
     */
    get wasRefunded(): true | undefined {
        return this.raw.was_refunded;
    }
    /**
     * Optional. Description of additional giveaway prize
     */
    get prizeDescription(): string | undefined {
        return this.raw.prize_description;
    }
    /**
     * true if `additional_chat_count` is set
     */
    hasAdditionalChatCount(): this is this & {
        additionalChatCount: number;
    } {
        return this.raw.additional_chat_count != null;
    }
    /**
     * true if `prize_star_count` is set
     */
    hasPrizeStarCount(): this is this & {
        prizeStarCount: number;
    } {
        return this.raw.prize_star_count != null;
    }
    /**
     * true if `premium_subscription_month_count` is set
     */
    hasPremiumSubscriptionMonthCount(): this is this & {
        premiumSubscriptionMonthCount: number;
    } {
        return this.raw.premium_subscription_month_count != null;
    }
    /**
     * true if `unclaimed_prize_count` is set
     */
    hasUnclaimedPrizeCount(): this is this & {
        unclaimedPrizeCount: number;
    } {
        return this.raw.unclaimed_prize_count != null;
    }
    /**
     * true if `only_new_members` is set
     */
    hasOnlyNewMembers(): this is this & {
        onlyNewMembers: true;
    } {
        return this.raw.only_new_members != null;
    }
    /**
     * true if `was_refunded` is set
     */
    hasWasRefunded(): this is this & {
        wasRefunded: true;
    } {
        return this.raw.was_refunded != null;
    }
    /**
     * true if `prize_description` is set
     */
    hasPrizeDescription(): this is this & {
        prizeDescription: string;
    } {
        return this.raw.prize_description != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("GiveawayWinners", this, depth, options, inspect);
    }
}

/**
 * This object represents one button of an inline keyboard. Exactly one of the fields other than text, icon_custom_emoji_id, and style must be used to specify the type of the button.
 */
export class InlineKeyboardButton {
    private _webApp?: WebAppInfo | undefined;
    constructor(public raw: TelegramInlineKeyboardButton) { }
    static fromPayload(raw: TelegramInlineKeyboardButton): InlineKeyboardButton {
        return new InlineKeyboardButton(raw);
    }
    /**
     * Label text on the button
     */
    get text(): string {
        return this.raw.text;
    }
    /**
     * Optional. Unique identifier of the custom emoji shown before the text of the button. Can only be used by bots that purchased additional usernames on Fragment or in the messages directly sent by the bot to private, group and supergroup chats if the owner of the bot has a Telegram Premium subscription.
     */
    get iconCustomEmojiId(): string | undefined {
        return this.raw.icon_custom_emoji_id;
    }
    /**
     * Optional. Style of the button. Must be one of “danger” (red), “success” (green) or “primary” (blue). If omitted, then an app-specific style is used.
     */
    get style(): ("danger" | "success" | "primary") | undefined {
        return this.raw.style;
    }
    /**
     * Optional. HTTP or tg:// URL to be opened when the button is pressed. Links tg://user?id=<user_id> can be used to mention a user by their identifier without using a username, if this is allowed by their privacy settings.
     */
    get url(): string | undefined {
        return this.raw.url;
    }
    /**
     * Optional. Data to be sent in a callback query to the bot when the button is pressed, 1-64 bytes
     */
    get callbackData(): string | undefined {
        return this.raw.callback_data;
    }
    /**
     * Optional. Description of the Web App that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method answerWebAppQuery. Available only in private chats between a user and the bot. Not supported for messages sent on behalf of a business account and ephemeral messages.
     */
    get webApp(): WebAppInfo | undefined {
        if (this._webApp === undefined) {
            this._webApp = this.raw.web_app ? new WebAppInfo(this.raw.web_app) : undefined;
        }
        return this._webApp;
    }
    /**
     * Optional. An HTTPS URL used to automatically authorize the user. Can be used as a replacement for the Telegram Login Widget. Not supported for ephemeral messages.
     */
    get loginUrl(): TelegramLoginUrl | undefined {
        return this.raw.login_url;
    }
    /**
     * Optional. If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot's username and the specified inline query in the input field. May be empty, in which case just the bot's username will be inserted. Not supported for messages sent in channel direct messages chats and on behalf of a business account.
     */
    get switchInlineQuery(): string | undefined {
        return this.raw.switch_inline_query;
    }
    /**
     * Optional. If set, pressing the button will insert the bot's username and the specified inline query in the current chat's input field. May be empty, in which case only the bot's username will be inserted.This offers a quick way for the user to open your bot in inline mode in the same chat - good for selecting something from multiple options. Not supported in channels and for messages sent in channel direct messages chats and on behalf of a business account.
     */
    get switchInlineQueryCurrentChat(): string | undefined {
        return this.raw.switch_inline_query_current_chat;
    }
    /**
     * Optional. If set, pressing the button will prompt the user to select one of their chats of the specified type, open that chat and insert the bot's username and the specified inline query in the input field. Not supported for messages sent in channel direct messages chats and on behalf of a business account.
     */
    get switchInlineQueryChosenChat(): TelegramSwitchInlineQueryChosenChat | undefined {
        return this.raw.switch_inline_query_chosen_chat;
    }
    /**
     * Optional. Description of the button that copies the specified text to the clipboard
     */
    get copyText(): TelegramCopyTextButton | undefined {
        return this.raw.copy_text;
    }
    /**
     * Optional. Description of the game that will be launched when the user presses the button.NOTE: This type of button must always be the first button in the first row.
     */
    get callbackGame(): TelegramCallbackGame | undefined {
        return this.raw.callback_game;
    }
    /**
     * Optional. Specify True, to send a Pay button. Substrings “” and “XTR” in the buttons's text will be replaced with a Telegram Star icon.NOTE: This type of button must always be the first button in the first row and can only be used in invoice messages.
     */
    get pay(): boolean | undefined {
        return this.raw.pay;
    }
    /**
     * Optional. If set, then the button is disabled and does nothing
     */
    get disabled(): TelegramDisabledButton | undefined {
        return this.raw.disabled;
    }
    /**
     * true if `icon_custom_emoji_id` is set
     */
    hasIconCustomEmojiId(): this is this & {
        iconCustomEmojiId: string;
    } {
        return this.raw.icon_custom_emoji_id != null;
    }
    /**
     * true if `style` is set
     */
    hasStyle(): this is this & {
        style: "danger" | "success" | "primary";
    } {
        return this.raw.style != null;
    }
    /**
     * true if `url` is set
     */
    hasUrl(): this is this & {
        url: string;
    } {
        return this.raw.url != null;
    }
    /**
     * true if `callback_data` is set
     */
    hasCallbackData(): this is this & {
        callbackData: string;
    } {
        return this.raw.callback_data != null;
    }
    /**
     * true if `web_app` is set
     */
    hasWebApp(): this is this & {
        webApp: WebAppInfo;
    } {
        return this.raw.web_app != null;
    }
    /**
     * true if `login_url` is set
     */
    hasLoginUrl(): this is this & {
        loginUrl: TelegramLoginUrl;
    } {
        return this.raw.login_url != null;
    }
    /**
     * true if `switch_inline_query` is set
     */
    hasSwitchInlineQuery(): this is this & {
        switchInlineQuery: string;
    } {
        return this.raw.switch_inline_query != null;
    }
    /**
     * true if `switch_inline_query_current_chat` is set
     */
    hasSwitchInlineQueryCurrentChat(): this is this & {
        switchInlineQueryCurrentChat: string;
    } {
        return this.raw.switch_inline_query_current_chat != null;
    }
    /**
     * true if `switch_inline_query_chosen_chat` is set
     */
    hasSwitchInlineQueryChosenChat(): this is this & {
        switchInlineQueryChosenChat: TelegramSwitchInlineQueryChosenChat;
    } {
        return this.raw.switch_inline_query_chosen_chat != null;
    }
    /**
     * true if `copy_text` is set
     */
    hasCopyText(): this is this & {
        copyText: TelegramCopyTextButton;
    } {
        return this.raw.copy_text != null;
    }
    /**
     * true if `callback_game` is set
     */
    hasCallbackGame(): this is this & {
        callbackGame: TelegramCallbackGame;
    } {
        return this.raw.callback_game != null;
    }
    /**
     * true if `pay` is set
     */
    hasPay(): this is this & {
        pay: boolean;
    } {
        return this.raw.pay != null;
    }
    /**
     * true if `disabled` is set
     */
    hasDisabled(): this is this & {
        disabled: TelegramDisabledButton;
    } {
        return this.raw.disabled != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("InlineKeyboardButton", this, depth, options, inspect);
    }
}

export type DangerInlineKeyboardButton = Omit<InlineKeyboardButton, "style"> & {
    style: "danger";
};

export type SuccessInlineKeyboardButton = Omit<InlineKeyboardButton, "style"> & {
    style: "success";
};

export type PrimaryInlineKeyboardButton = Omit<InlineKeyboardButton, "style"> & {
    style: "primary";
};

/**
 * This object represents an inline keyboard that appears right next to the message it belongs to.
 */
export class InlineKeyboardMarkup {
    constructor(public raw: TelegramInlineKeyboardMarkup) { }
    static fromPayload(raw: TelegramInlineKeyboardMarkup): InlineKeyboardMarkup {
        return new InlineKeyboardMarkup(raw);
    }
    /**
     * Array of button rows, each represented by an Array of InlineKeyboardButton objects
     */
    get inlineKeyboard(): TelegramInlineKeyboardButton[][] {
        return this.raw.inline_keyboard;
    }
    /**
     * Optional. Pass True if the reply interface must be shown to the user, as if they had manually selected the bot's message and tapped 'Reply'. The value of the field can't be changed when the inline keyboard is edited.
     */
    get forceReply(): boolean | undefined {
        return this.raw.force_reply;
    }
    /**
     * true if `force_reply` is set
     */
    hasForceReply(): this is this & {
        forceReply: boolean;
    } {
        return this.raw.force_reply != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("InlineKeyboardMarkup", this, depth, options, inspect);
    }
}

/**
 * This object represents an incoming inline query. When the user sends an empty query, your bot could return some default or trending results.
 */
export class InlineQuery {
    private _from?: User;
    private _location?: Location | undefined;
    constructor(public raw: TelegramInlineQuery) { }
    static fromPayload(raw: TelegramInlineQuery): InlineQuery {
        return new InlineQuery(raw);
    }
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
        if (this._location === undefined) {
            this._location = this.raw.location ? new Location(this.raw.location) : undefined;
        }
        return this._location;
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
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("InlineQuery", this, depth, options, inspect);
    }
}

export type SenderInlineQuery = Omit<InlineQuery, "chatType"> & {
    chatType: "sender";
};

export type PrivateInlineQuery = Omit<InlineQuery, "chatType"> & {
    chatType: "private";
};

export type GroupInlineQuery = Omit<InlineQuery, "chatType"> & {
    chatType: "group";
};

export type SupergroupInlineQuery = Omit<InlineQuery, "chatType"> & {
    chatType: "supergroup";
};

export type ChannelInlineQuery = Omit<InlineQuery, "chatType"> & {
    chatType: "channel";
};

/**
 * This object contains basic information about an invoice.
 */
export class Invoice {
    constructor(public raw: TelegramInvoice) { }
    static fromPayload(raw: TelegramInvoice): Invoice {
        return new Invoice(raw);
    }
    /**
     * Product name
     */
    get title(): string {
        return this.raw.title;
    }
    /**
     * Product description
     */
    get description(): string {
        return this.raw.description;
    }
    /**
     * Unique bot deep-linking parameter that can be used to generate this invoice
     */
    get startParameter(): string {
        return this.raw.start_parameter;
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
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("Invoice", this, depth, options, inspect);
    }
}

/**
 * Describes the options used for link preview generation.
 */
export class LinkPreviewOptions {
    constructor(public raw: TelegramLinkPreviewOptions) { }
    static fromPayload(raw: TelegramLinkPreviewOptions): LinkPreviewOptions {
        return new LinkPreviewOptions(raw);
    }
    /**
     * Optional. True, if the link preview is disabled
     */
    get isDisabled(): boolean | undefined {
        return this.raw.is_disabled;
    }
    /**
     * Optional. URL to use for the link preview. If empty, then the first URL found in the message text will be used.
     */
    get url(): string | undefined {
        return this.raw.url;
    }
    /**
     * Optional. True, if the media in the link preview is supposed to be shrunk; ignored if the URL isn't explicitly specified or media size change isn't supported for the preview
     */
    get preferSmallMedia(): boolean | undefined {
        return this.raw.prefer_small_media;
    }
    /**
     * Optional. True, if the media in the link preview is supposed to be enlarged; ignored if the URL isn't explicitly specified or media size change isn't supported for the preview
     */
    get preferLargeMedia(): boolean | undefined {
        return this.raw.prefer_large_media;
    }
    /**
     * Optional. True, if the link preview must be shown above the message text; otherwise, the link preview will be shown below the message text
     */
    get showAboveText(): boolean | undefined {
        return this.raw.show_above_text;
    }
    /**
     * true if `url` is set
     */
    hasUrl(): this is this & {
        url: string;
    } {
        return this.raw.url != null;
    }
    /**
     * true if `prefer_small_media` is set
     */
    hasPreferSmallMedia(): this is this & {
        preferSmallMedia: boolean;
    } {
        return this.raw.prefer_small_media != null;
    }
    /**
     * true if `prefer_large_media` is set
     */
    hasPreferLargeMedia(): this is this & {
        preferLargeMedia: boolean;
    } {
        return this.raw.prefer_large_media != null;
    }
    /**
     * true if `show_above_text` is set
     */
    hasShowAboveText(): this is this & {
        showAboveText: boolean;
    } {
        return this.raw.show_above_text != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("LinkPreviewOptions", this, depth, options, inspect);
    }
}

/**
 * This object represents a live photo.
 */
export class LivePhoto {
    private _photo?: Photo | undefined;
    constructor(public raw: TelegramLivePhoto) { }
    static fromPayload(raw: TelegramLivePhoto): LivePhoto {
        return new LivePhoto(raw);
    }
    /**
     * Optional. Available sizes of the corresponding static photo
     */
    get photo(): Photo | undefined {
        if (this._photo === undefined) {
            this._photo = this.raw.photo ? new Photo(this.raw.photo) : undefined;
        }
        return this._photo;
    }
    /**
     * Identifier for the video file which can be used to download or reuse the file
     */
    get fileId(): string {
        return this.raw.file_id;
    }
    /**
     * Unique identifier for the video file which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    get fileUniqueId(): string {
        return this.raw.file_unique_id;
    }
    /**
     * Video width as defined by the sender
     */
    get width(): number {
        return this.raw.width;
    }
    /**
     * Video height as defined by the sender
     */
    get height(): number {
        return this.raw.height;
    }
    /**
     * Duration of the video in seconds as defined by the sender
     */
    get duration(): number {
        return this.raw.duration;
    }
    /**
     * Optional. MIME type of the file as defined by the sender
     */
    get mimeType(): string | undefined {
        return this.raw.mime_type;
    }
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     */
    get fileSize(): number | undefined {
        return this.raw.file_size;
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
     * true if `mime_type` is set
     */
    hasMimeType(): this is this & {
        mimeType: string;
    } {
        return this.raw.mime_type != null;
    }
    /**
     * true if `file_size` is set
     */
    hasFileSize(): this is this & {
        fileSize: number;
    } {
        return this.raw.file_size != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("LivePhoto", this, depth, options, inspect);
    }
}

/**
 * This object represents a point on the map.
 */
export class Location {
    constructor(public raw: TelegramLocation) { }
    static fromPayload(raw: TelegramLocation): Location {
        return new Location(raw);
    }
    /**
     * Latitude as defined by the sender
     */
    get latitude(): number {
        return this.raw.latitude;
    }
    /**
     * Longitude as defined by the sender
     */
    get longitude(): number {
        return this.raw.longitude;
    }
    /**
     * Optional. The radius of uncertainty for the location, measured in meters; 0-1500
     */
    get horizontalAccuracy(): number | undefined {
        return this.raw.horizontal_accuracy;
    }
    /**
     * Optional. Time relative to the message sending date, during which the location can be updated; in seconds. For active live locations only.
     */
    get livePeriod(): number | undefined {
        return this.raw.live_period;
    }
    /**
     * Optional. The direction in which user is moving, in degrees; 1-360. For active live locations only.
     */
    get heading(): number | undefined {
        return this.raw.heading;
    }
    /**
     * Optional. The maximum distance for proximity alerts about approaching another chat member, in meters. For sent live locations only.
     */
    get proximityAlertRadius(): number | undefined {
        return this.raw.proximity_alert_radius;
    }
    /**
     * true if `horizontal_accuracy` is set
     */
    hasHorizontalAccuracy(): this is this & {
        horizontalAccuracy: number;
    } {
        return this.raw.horizontal_accuracy != null;
    }
    /**
     * true if `live_period` is set
     */
    hasLivePeriod(): this is this & {
        livePeriod: number;
    } {
        return this.raw.live_period != null;
    }
    /**
     * true if `heading` is set
     */
    hasHeading(): this is this & {
        heading: number;
    } {
        return this.raw.heading != null;
    }
    /**
     * true if `proximity_alert_radius` is set
     */
    hasProximityAlertRadius(): this is this & {
        proximityAlertRadius: number;
    } {
        return this.raw.proximity_alert_radius != null;
    }
    /**
     * tuple of [latitude, longitude]
     */
    get coordinates(): [number, number] {
        return [this.raw.latitude, this.raw.longitude];
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("Location", this, depth, options, inspect);
    }
}

/**
 * This object describes the position on faces where a mask should be placed by default.
 */
export class MaskPosition {
    constructor(public raw: TelegramMaskPosition) { }
    static fromPayload(raw: TelegramMaskPosition): MaskPosition {
        return new MaskPosition(raw);
    }
    /**
     * The part of the face relative to which the mask should be placed. One of “forehead”, “eyes”, “mouth”, or “chin”.
     */
    get point(): "forehead" | "eyes" | "mouth" | "chin" {
        return this.raw.point;
    }
    /**
     * Shift by X-axis measured in widths of the mask scaled to the face size, from left to right. For example, choosing -1.0 will place mask just to the left of the default mask position.
     */
    get xShift(): number {
        return this.raw.x_shift;
    }
    /**
     * Shift by Y-axis measured in heights of the mask scaled to the face size, from top to bottom. For example, 1.0 will place the mask just below the default mask position.
     */
    get yShift(): number {
        return this.raw.y_shift;
    }
    /**
     * Mask scaling coefficient. For example, 2.0 means double size.
     */
    get scale(): number {
        return this.raw.scale;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("MaskPosition", this, depth, options, inspect);
    }
}

export type ForeheadMaskPosition = Omit<MaskPosition, "point"> & {
    point: "forehead";
};

export type EyesMaskPosition = Omit<MaskPosition, "point"> & {
    point: "eyes";
};

export type MouthMaskPosition = Omit<MaskPosition, "point"> & {
    point: "mouth";
};

export type ChinMaskPosition = Omit<MaskPosition, "point"> & {
    point: "chin";
};

/**
 * This object represents a message.
 */
export class Message {
    private _from?: User | undefined;
    private _senderChat?: Chat | undefined;
    private _senderBusinessBot?: User | undefined;
    private _receiverUser?: User | undefined;
    private _chat?: Chat;
    private _replyToMessage?: Message | undefined;
    private _externalReply?: ExternalReplyInfo | undefined;
    private _quote?: TextQuote | undefined;
    private _replyToStory?: Story | undefined;
    private _viaBot?: User | undefined;
    private _guestBotCallerUser?: User | undefined;
    private _guestBotCallerChat?: Chat | undefined;
    private _entities?: MessageEntity[] | undefined;
    private _linkPreviewOptions?: LinkPreviewOptions | undefined;
    private _animation?: Animation | undefined;
    private _audio?: Audio | undefined;
    private _document?: Document | undefined;
    private _livePhoto?: LivePhoto | undefined;
    private _photo?: Photo | undefined;
    private _sticker?: Sticker | undefined;
    private _story?: Story | undefined;
    private _video?: Video | undefined;
    private _videoNote?: VideoNote | undefined;
    private _voice?: Voice | undefined;
    private _widget?: Widget | undefined;
    private _captionEntities?: MessageEntity[] | undefined;
    private _contact?: Contact | undefined;
    private _dice?: Dice | undefined;
    private _game?: Game | undefined;
    private _poll?: Poll | undefined;
    private _venue?: Venue | undefined;
    private _location?: Location | undefined;
    private _newChatMembers?: User[] | undefined;
    private _leftChatMember?: User | undefined;
    private _newChatPhoto?: Photo | undefined;
    private _invoice?: Invoice | undefined;
    private _successfulPayment?: SuccessfulPayment | undefined;
    private _usersShared?: UsersShared | undefined;
    private _chatShared?: ChatShared | undefined;
    private _writeAccessAllowed?: WriteAccessAllowed | undefined;
    private _passportData?: PassportData | undefined;
    private _proximityAlertTriggered?: ProximityAlertTriggered | undefined;
    private _forumTopicCreated?: ForumTopicCreated | undefined;
    private _forumTopicEdited?: ForumTopicEdited | undefined;
    private _giveaway?: Giveaway | undefined;
    private _giveawayWinners?: GiveawayWinners | undefined;
    private _giveawayCompleted?: GiveawayCompleted | undefined;
    private _paidMessagesWaived?: PaidMessagesWaived | undefined;
    private _tonWalletTransfer?: TonWalletTransfer | undefined;
    private _videoChatScheduled?: VideoChatScheduled | undefined;
    private _videoChatEnded?: VideoChatEnded | undefined;
    private _videoChatParticipantsInvited?: VideoChatParticipantsInvited | undefined;
    private _webAppData?: WebAppData | undefined;
    private _replyMarkup?: InlineKeyboardMarkup | undefined;
    constructor(public raw: TelegramMessage) { }
    static fromPayload(raw: TelegramMessage): Message {
        return new Message(raw);
    }
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
        if (this._from === undefined) {
            this._from = this.raw.from ? new User(this.raw.from) : undefined;
        }
        return this._from;
    }
    /**
     * Optional. Sender of the message when sent on behalf of a chat. For example, the supergroup itself for messages sent by its anonymous administrators or a linked channel for messages automatically forwarded to the channel's discussion group. For backward compatibility, if the message was sent on behalf of a chat, the field from contains a fake sender user in non-channel chats.
     */
    get senderChat(): Chat | undefined {
        if (this._senderChat === undefined) {
            this._senderChat = this.raw.sender_chat ? new Chat(this.raw.sender_chat) : undefined;
        }
        return this._senderChat;
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
        if (this._senderBusinessBot === undefined) {
            this._senderBusinessBot = this.raw.sender_business_bot ? new User(this.raw.sender_business_bot) : undefined;
        }
        return this._senderBusinessBot;
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
        if (this._receiverUser === undefined) {
            this._receiverUser = this.raw.receiver_user ? new User(this.raw.receiver_user) : undefined;
        }
        return this._receiverUser;
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
        if (this._replyToMessage === undefined) {
            this._replyToMessage = this.raw.reply_to_message ? new Message(this.raw.reply_to_message) : undefined;
        }
        return this._replyToMessage;
    }
    /**
     * Optional. Information about the message that is being replied to, which may come from another chat or forum topic
     */
    get externalReply(): ExternalReplyInfo | undefined {
        if (this._externalReply === undefined) {
            this._externalReply = this.raw.external_reply ? new ExternalReplyInfo(this.raw.external_reply) : undefined;
        }
        return this._externalReply;
    }
    /**
     * Optional. For replies that quote part of the original message, the quoted part of the message
     */
    get quote(): TextQuote | undefined {
        if (this._quote === undefined) {
            this._quote = this.raw.quote ? new TextQuote(this.raw.quote) : undefined;
        }
        return this._quote;
    }
    /**
     * Optional. For replies to a story, the original story
     */
    get replyToStory(): Story | undefined {
        if (this._replyToStory === undefined) {
            this._replyToStory = this.raw.reply_to_story ? new Story(this.raw.reply_to_story) : undefined;
        }
        return this._replyToStory;
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
        if (this._viaBot === undefined) {
            this._viaBot = this.raw.via_bot ? new User(this.raw.via_bot) : undefined;
        }
        return this._viaBot;
    }
    /**
     * Optional. For a message sent by a guest bot, this is the user whose original message triggered the bot's response
     */
    get guestBotCallerUser(): User | undefined {
        if (this._guestBotCallerUser === undefined) {
            this._guestBotCallerUser = this.raw.guest_bot_caller_user ? new User(this.raw.guest_bot_caller_user) : undefined;
        }
        return this._guestBotCallerUser;
    }
    /**
     * Optional. For a message sent by a guest bot, this is the chat whose original message triggered the bot's response
     */
    get guestBotCallerChat(): Chat | undefined {
        if (this._guestBotCallerChat === undefined) {
            this._guestBotCallerChat = this.raw.guest_bot_caller_chat ? new Chat(this.raw.guest_bot_caller_chat) : undefined;
        }
        return this._guestBotCallerChat;
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
        if (this._linkPreviewOptions === undefined) {
            this._linkPreviewOptions = this.raw.link_preview_options ? new LinkPreviewOptions(this.raw.link_preview_options) : undefined;
        }
        return this._linkPreviewOptions;
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
        if (this._animation === undefined) {
            this._animation = this.raw.animation ? new Animation(this.raw.animation) : undefined;
        }
        return this._animation;
    }
    /**
     * Optional. Message is an audio file, information about the file
     */
    get audio(): Audio | undefined {
        if (this._audio === undefined) {
            this._audio = this.raw.audio ? new Audio(this.raw.audio) : undefined;
        }
        return this._audio;
    }
    /**
     * Optional. Message is a general file, information about the file
     */
    get document(): Document | undefined {
        if (this._document === undefined) {
            this._document = this.raw.document ? new Document(this.raw.document) : undefined;
        }
        return this._document;
    }
    /**
     * Optional. Message is a live photo, information about the live photo. For backward compatibility, when this field is set, the photo field will also be set.
     */
    get livePhoto(): LivePhoto | undefined {
        if (this._livePhoto === undefined) {
            this._livePhoto = this.raw.live_photo ? new LivePhoto(this.raw.live_photo) : undefined;
        }
        return this._livePhoto;
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
        if (this._photo === undefined) {
            this._photo = this.raw.photo ? new Photo(this.raw.photo) : undefined;
        }
        return this._photo;
    }
    /**
     * Optional. Message is a sticker, information about the sticker
     */
    get sticker(): Sticker | undefined {
        if (this._sticker === undefined) {
            this._sticker = this.raw.sticker ? new Sticker(this.raw.sticker) : undefined;
        }
        return this._sticker;
    }
    /**
     * Optional. Message is a forwarded story
     */
    get story(): Story | undefined {
        if (this._story === undefined) {
            this._story = this.raw.story ? new Story(this.raw.story) : undefined;
        }
        return this._story;
    }
    /**
     * Optional. Message is a video, information about the video
     */
    get video(): Video | undefined {
        if (this._video === undefined) {
            this._video = this.raw.video ? new Video(this.raw.video) : undefined;
        }
        return this._video;
    }
    /**
     * Optional. Message is a video note, information about the video message
     */
    get videoNote(): VideoNote | undefined {
        if (this._videoNote === undefined) {
            this._videoNote = this.raw.video_note ? new VideoNote(this.raw.video_note) : undefined;
        }
        return this._videoNote;
    }
    /**
     * Optional. Message is a voice message, information about the file
     */
    get voice(): Voice | undefined {
        if (this._voice === undefined) {
            this._voice = this.raw.voice ? new Voice(this.raw.voice) : undefined;
        }
        return this._voice;
    }
    /**
     * Optional. Message is an HTML widget, information about the widget
     */
    get widget(): Widget | undefined {
        if (this._widget === undefined) {
            this._widget = this.raw.widget ? new Widget(this.raw.widget) : undefined;
        }
        return this._widget;
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
        if (this._contact === undefined) {
            this._contact = this.raw.contact ? new Contact(this.raw.contact) : undefined;
        }
        return this._contact;
    }
    /**
     * Optional. Message is a dice with random value
     */
    get dice(): Dice | undefined {
        if (this._dice === undefined) {
            this._dice = this.raw.dice ? new Dice(this.raw.dice) : undefined;
        }
        return this._dice;
    }
    /**
     * Optional. Message is a game, information about the game. More about games »
     */
    get game(): Game | undefined {
        if (this._game === undefined) {
            this._game = this.raw.game ? new Game(this.raw.game) : undefined;
        }
        return this._game;
    }
    /**
     * Optional. Message is a native poll, information about the poll
     */
    get poll(): Poll | undefined {
        if (this._poll === undefined) {
            this._poll = this.raw.poll ? new Poll(this.raw.poll) : undefined;
        }
        return this._poll;
    }
    /**
     * Optional. Message is a venue, information about the venue. For backward compatibility, when this field is set, the location field will also be set.
     */
    get venue(): Venue | undefined {
        if (this._venue === undefined) {
            this._venue = this.raw.venue ? new Venue(this.raw.venue) : undefined;
        }
        return this._venue;
    }
    /**
     * Optional. Message is a shared location, information about the location
     */
    get location(): Location | undefined {
        if (this._location === undefined) {
            this._location = this.raw.location ? new Location(this.raw.location) : undefined;
        }
        return this._location;
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
        if (this._leftChatMember === undefined) {
            this._leftChatMember = this.raw.left_chat_member ? new User(this.raw.left_chat_member) : undefined;
        }
        return this._leftChatMember;
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
        if (this._newChatPhoto === undefined) {
            this._newChatPhoto = this.raw.new_chat_photo ? new Photo(this.raw.new_chat_photo) : undefined;
        }
        return this._newChatPhoto;
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
        if (this._invoice === undefined) {
            this._invoice = this.raw.invoice ? new Invoice(this.raw.invoice) : undefined;
        }
        return this._invoice;
    }
    /**
     * Optional. Message is a service message about a successful payment, information about the payment. More about payments »
     */
    get successfulPayment(): SuccessfulPayment | undefined {
        if (this._successfulPayment === undefined) {
            this._successfulPayment = this.raw.successful_payment ? new SuccessfulPayment(this.raw.successful_payment) : undefined;
        }
        return this._successfulPayment;
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
        if (this._usersShared === undefined) {
            this._usersShared = this.raw.users_shared ? new UsersShared(this.raw.users_shared) : undefined;
        }
        return this._usersShared;
    }
    /**
     * Optional. Service message: a chat was shared with the bot
     */
    get chatShared(): ChatShared | undefined {
        if (this._chatShared === undefined) {
            this._chatShared = this.raw.chat_shared ? new ChatShared(this.raw.chat_shared) : undefined;
        }
        return this._chatShared;
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
        if (this._writeAccessAllowed === undefined) {
            this._writeAccessAllowed = this.raw.write_access_allowed ? new WriteAccessAllowed(this.raw.write_access_allowed) : undefined;
        }
        return this._writeAccessAllowed;
    }
    /**
     * Optional. Telegram Passport data
     */
    get passportData(): PassportData | undefined {
        if (this._passportData === undefined) {
            this._passportData = this.raw.passport_data ? new PassportData(this.raw.passport_data) : undefined;
        }
        return this._passportData;
    }
    /**
     * Optional. Service message: a user in the chat triggered another user's proximity alert while sharing Live Location
     */
    get proximityAlertTriggered(): ProximityAlertTriggered | undefined {
        if (this._proximityAlertTriggered === undefined) {
            this._proximityAlertTriggered = this.raw.proximity_alert_triggered ? new ProximityAlertTriggered(this.raw.proximity_alert_triggered) : undefined;
        }
        return this._proximityAlertTriggered;
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
        if (this._forumTopicCreated === undefined) {
            this._forumTopicCreated = this.raw.forum_topic_created ? new ForumTopicCreated(this.raw.forum_topic_created) : undefined;
        }
        return this._forumTopicCreated;
    }
    /**
     * Optional. Service message: forum topic edited
     */
    get forumTopicEdited(): ForumTopicEdited | undefined {
        if (this._forumTopicEdited === undefined) {
            this._forumTopicEdited = this.raw.forum_topic_edited ? new ForumTopicEdited(this.raw.forum_topic_edited) : undefined;
        }
        return this._forumTopicEdited;
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
        if (this._giveaway === undefined) {
            this._giveaway = this.raw.giveaway ? new Giveaway(this.raw.giveaway) : undefined;
        }
        return this._giveaway;
    }
    /**
     * Optional. A giveaway with public winners was completed
     */
    get giveawayWinners(): GiveawayWinners | undefined {
        if (this._giveawayWinners === undefined) {
            this._giveawayWinners = this.raw.giveaway_winners ? new GiveawayWinners(this.raw.giveaway_winners) : undefined;
        }
        return this._giveawayWinners;
    }
    /**
     * Optional. Service message: a giveaway without public winners was completed
     */
    get giveawayCompleted(): GiveawayCompleted | undefined {
        if (this._giveawayCompleted === undefined) {
            this._giveawayCompleted = this.raw.giveaway_completed ? new GiveawayCompleted(this.raw.giveaway_completed) : undefined;
        }
        return this._giveawayCompleted;
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
        if (this._paidMessagesWaived === undefined) {
            this._paidMessagesWaived = this.raw.paid_messages_waived ? new PaidMessagesWaived(this.raw.paid_messages_waived) : undefined;
        }
        return this._paidMessagesWaived;
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
        if (this._tonWalletTransfer === undefined) {
            this._tonWalletTransfer = this.raw.ton_wallet_transfer ? new TonWalletTransfer(this.raw.ton_wallet_transfer) : undefined;
        }
        return this._tonWalletTransfer;
    }
    /**
     * Optional. Service message: video chat scheduled
     */
    get videoChatScheduled(): VideoChatScheduled | undefined {
        if (this._videoChatScheduled === undefined) {
            this._videoChatScheduled = this.raw.video_chat_scheduled ? new VideoChatScheduled(this.raw.video_chat_scheduled) : undefined;
        }
        return this._videoChatScheduled;
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
        if (this._videoChatEnded === undefined) {
            this._videoChatEnded = this.raw.video_chat_ended ? new VideoChatEnded(this.raw.video_chat_ended) : undefined;
        }
        return this._videoChatEnded;
    }
    /**
     * Optional. Service message: new participants invited to a video chat
     */
    get videoChatParticipantsInvited(): VideoChatParticipantsInvited | undefined {
        if (this._videoChatParticipantsInvited === undefined) {
            this._videoChatParticipantsInvited = this.raw.video_chat_participants_invited ? new VideoChatParticipantsInvited(this.raw.video_chat_participants_invited) : undefined;
        }
        return this._videoChatParticipantsInvited;
    }
    /**
     * Optional. Service message: data sent by a Web App
     */
    get webAppData(): WebAppData | undefined {
        if (this._webAppData === undefined) {
            this._webAppData = this.raw.web_app_data ? new WebAppData(this.raw.web_app_data) : undefined;
        }
        return this._webAppData;
    }
    /**
     * Optional. Inline keyboard attached to the message. login_url buttons are represented as ordinary url buttons.
     */
    get replyMarkup(): InlineKeyboardMarkup | undefined {
        if (this._replyMarkup === undefined) {
            this._replyMarkup = this.raw.reply_markup ? new InlineKeyboardMarkup(this.raw.reply_markup) : undefined;
        }
        return this._replyMarkup;
    }
    /**
     * true if `message_thread_id` is set
     */
    hasMessageThreadId(): this is this & {
        messageThreadId: number;
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
     * true if `reply_to_message` is set
     */
    hasReplyToMessage(): this is this & {
        replyToMessage: Message;
    } {
        return this.raw.reply_to_message != null;
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
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("Message", this, depth, options, inspect);
    }
}

/**
 * This object represents one special entity in a text message. For example, hashtags, usernames, URLs, etc.
 */
export class MessageEntity {
    private _user?: User | undefined;
    constructor(public raw: TelegramMessageEntity) { }
    static fromPayload(raw: TelegramMessageEntity): MessageEntity {
        return new MessageEntity(raw);
    }
    /**
     * Type of the entity. Currently, can be “mention” (@username), “hashtag” (#hashtag or #hashtag@chatusername), “cashtag” ($USD or $USD@chatusername), “bot_command” (/start@jobs_bot), “url” (https://telegram.org), “email” (do-not-reply@telegram.org), “phone_number” (+1-212-555-0123), “bank_card_number” (bank card number), “ton_address” (address in the TON blockchain), “bold” (bold text), “italic” (italic text), “underline” (underlined text), “strikethrough” (strikethrough text), “spoiler” (spoiler message), “blockquote” (block quotation), “expandable_blockquote” (collapsed-by-default block quotation), “code” (monowidth string), “pre” (monowidth block), “text_link” (for clickable text URLs), “text_mention” (for users without usernames), “custom_emoji” (for inline custom emoji stickers), or “date_time” (for formatted date and time).
     */
    get type(): "mention" | "hashtag" | "cashtag" | "bot_command" | "url" | "email" | "phone_number" | "bank_card_number" | "ton_address" | "bold" | "italic" | "underline" | "strikethrough" | "spoiler" | "blockquote" | "expandable_blockquote" | "code" | "pre" | "text_link" | "text_mention" | "custom_emoji" | "date_time" {
        return this.raw.type;
    }
    /**
     * Offset in UTF-16 code units to the start of the entity
     */
    get offset(): number {
        return this.raw.offset;
    }
    /**
     * Length of the entity in UTF-16 code units
     */
    get length(): number {
        return this.raw.length;
    }
    /**
     * Optional. For “text_link” only, URL that will be opened after user taps on the text
     */
    get url(): string | undefined {
        return this.raw.url;
    }
    /**
     * Optional. For “text_mention” only, the mentioned user
     */
    get user(): User | undefined {
        if (this._user === undefined) {
            this._user = this.raw.user ? new User(this.raw.user) : undefined;
        }
        return this._user;
    }
    /**
     * Optional. For “pre” only, the programming language of the entity text
     */
    get language(): string | undefined {
        return this.raw.language;
    }
    /**
     * Optional. For “custom_emoji” only, unique identifier of the custom emoji. Use getCustomEmojiStickers to get full information about the sticker.
     */
    get customEmojiId(): string | undefined {
        return this.raw.custom_emoji_id;
    }
    /**
     * Optional. For “date_time” only, the Unix time associated with the entity
     */
    get unixTime(): number | undefined {
        return this.raw.unix_time;
    }
    /**
     * Optional. For “date_time” only, the string that defines the formatting of the date and time. See date-time entity formatting for more details.
     */
    get dateTimeFormat(): string | undefined {
        return this.raw.date_time_format;
    }
    /**
     * true if `url` is set
     */
    hasUrl(): this is this & {
        url: string;
    } {
        return this.raw.url != null;
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
     * true if `language` is set
     */
    hasLanguage(): this is this & {
        language: string;
    } {
        return this.raw.language != null;
    }
    /**
     * true if `custom_emoji_id` is set
     */
    hasCustomEmojiId(): this is this & {
        customEmojiId: string;
    } {
        return this.raw.custom_emoji_id != null;
    }
    /**
     * true if `unix_time` is set
     */
    hasUnixTime(): this is this & {
        unixTime: number;
    } {
        return this.raw.unix_time != null;
    }
    /**
     * true if `date_time_format` is set
     */
    hasDateTimeFormat(): this is this & {
        dateTimeFormat: string;
    } {
        return this.raw.date_time_format != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("MessageEntity", this, depth, options, inspect);
    }
}

export type MentionMessageEntity = Omit<MessageEntity, "type"> & {
    type: "mention";
};

export type HashtagMessageEntity = Omit<MessageEntity, "type"> & {
    type: "hashtag";
};

export type CashtagMessageEntity = Omit<MessageEntity, "type"> & {
    type: "cashtag";
};

export type BotCommandMessageEntity = Omit<MessageEntity, "type"> & {
    type: "bot_command";
};

export type UrlMessageEntity = Omit<MessageEntity, "type"> & {
    type: "url";
};

export type EmailMessageEntity = Omit<MessageEntity, "type"> & {
    type: "email";
};

export type PhoneNumberMessageEntity = Omit<MessageEntity, "type"> & {
    type: "phone_number";
};

export type BankCardNumberMessageEntity = Omit<MessageEntity, "type"> & {
    type: "bank_card_number";
};

export type TonAddressMessageEntity = Omit<MessageEntity, "type"> & {
    type: "ton_address";
};

export type BoldMessageEntity = Omit<MessageEntity, "type"> & {
    type: "bold";
};

export type ItalicMessageEntity = Omit<MessageEntity, "type"> & {
    type: "italic";
};

export type UnderlineMessageEntity = Omit<MessageEntity, "type"> & {
    type: "underline";
};

export type StrikethroughMessageEntity = Omit<MessageEntity, "type"> & {
    type: "strikethrough";
};

export type SpoilerMessageEntity = Omit<MessageEntity, "type"> & {
    type: "spoiler";
};

export type BlockquoteMessageEntity = Omit<MessageEntity, "type"> & {
    type: "blockquote";
};

export type ExpandableBlockquoteMessageEntity = Omit<MessageEntity, "type"> & {
    type: "expandable_blockquote";
};

export type CodeMessageEntity = Omit<MessageEntity, "type"> & {
    type: "code";
};

export type PreMessageEntity = Omit<MessageEntity, "type"> & {
    type: "pre";
};

export type TextLinkMessageEntity = Omit<MessageEntity, "type"> & {
    type: "text_link";
};

export type TextMentionMessageEntity = Omit<MessageEntity, "type"> & {
    type: "text_mention";
};

export type CustomEmojiMessageEntity = Omit<MessageEntity, "type"> & {
    type: "custom_emoji";
};

export type DateTimeMessageEntity = Omit<MessageEntity, "type"> & {
    type: "date_time";
};

/**
 * This object represents a unique message identifier.
 */
export class MessageId {
    constructor(public raw: TelegramMessageId) { }
    static fromPayload(raw: TelegramMessageId): MessageId {
        return new MessageId(raw);
    }
    /**
     * Unique message identifier. In specific instances (e.g., message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent.
     */
    get id(): number {
        return this.raw.message_id;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("MessageId", this, depth, options, inspect);
    }
}

/**
 * This object represents reaction changes on a message with anonymous reactions.
 */
export class MessageReactionCountUpdated {
    private _chat?: Chat;
    private _reactions?: ReactionCounts;
    constructor(public raw: TelegramMessageReactionCountUpdated) { }
    static fromPayload(raw: TelegramMessageReactionCountUpdated): MessageReactionCountUpdated {
        return new MessageReactionCountUpdated(raw);
    }
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
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("MessageReactionCountUpdated", this, depth, options, inspect);
    }
}

/**
 * This object represents a change of a reaction on a message performed by a user.
 */
export class MessageReactionUpdated {
    private _chat?: Chat;
    private _user?: User | undefined;
    private _actorChat?: Chat | undefined;
    private _oldReaction?: Reactions;
    private _newReaction?: Reactions;
    constructor(public raw: TelegramMessageReactionUpdated) { }
    static fromPayload(raw: TelegramMessageReactionUpdated): MessageReactionUpdated {
        return new MessageReactionUpdated(raw);
    }
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
        if (this._user === undefined) {
            this._user = this.raw.user ? new User(this.raw.user) : undefined;
        }
        return this._user;
    }
    /**
     * Optional. The chat on behalf of which the reaction was changed, if the user is anonymous
     */
    get actorChat(): Chat | undefined {
        if (this._actorChat === undefined) {
            this._actorChat = this.raw.actor_chat ? new Chat(this.raw.actor_chat) : undefined;
        }
        return this._actorChat;
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
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("MessageReactionUpdated", this, depth, options, inspect);
    }
}

/**
 * This object represents information about an order.
 */
export class OrderInfo {
    private _shippingAddress?: ShippingAddress | undefined;
    constructor(public raw: TelegramOrderInfo) { }
    static fromPayload(raw: TelegramOrderInfo): OrderInfo {
        return new OrderInfo(raw);
    }
    /**
     * Optional. User name
     */
    get name(): string | undefined {
        return this.raw.name;
    }
    /**
     * Optional. User's phone number
     */
    get phoneNumber(): string | undefined {
        return this.raw.phone_number;
    }
    /**
     * Optional. User email
     */
    get email(): string | undefined {
        return this.raw.email;
    }
    /**
     * Optional. User shipping address
     */
    get shippingAddress(): ShippingAddress | undefined {
        if (this._shippingAddress === undefined) {
            this._shippingAddress = this.raw.shipping_address ? new ShippingAddress(this.raw.shipping_address) : undefined;
        }
        return this._shippingAddress;
    }
    /**
     * true if `name` is set
     */
    hasName(): this is this & {
        name: string;
    } {
        return this.raw.name != null;
    }
    /**
     * true if `phone_number` is set
     */
    hasPhoneNumber(): this is this & {
        phoneNumber: string;
    } {
        return this.raw.phone_number != null;
    }
    /**
     * true if `email` is set
     */
    hasEmail(): this is this & {
        email: string;
    } {
        return this.raw.email != null;
    }
    /**
     * true if `shipping_address` is set
     */
    hasShippingAddress(): this is this & {
        shippingAddress: ShippingAddress;
    } {
        return this.raw.shipping_address != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("OrderInfo", this, depth, options, inspect);
    }
}

/**
 * Describes a service message about the sender of the message using a link of the other user, which allows sending messages to the user without paying Telegram Stars. Currently holds no information.
 */
export class PaidMessagesWaived {
    constructor(public raw: TelegramPaidMessagesWaived) { }
    static fromPayload(raw: TelegramPaidMessagesWaived): PaidMessagesWaived {
        return new PaidMessagesWaived(raw);
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("PaidMessagesWaived", this, depth, options, inspect);
    }
}

/**
 * Describes Telegram Passport data shared with the bot by the user.
 */
export class PassportData {
    constructor(public raw: TelegramPassportData) { }
    static fromPayload(raw: TelegramPassportData): PassportData {
        return new PassportData(raw);
    }
    /**
     * Array with information about documents and other Telegram Passport elements that was shared with the bot
     */
    get data(): TelegramEncryptedPassportElement[] {
        return this.raw.data;
    }
    /**
     * Encrypted credentials required to decrypt the data
     */
    get credentials(): TelegramEncryptedCredentials {
        return this.raw.credentials;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("PassportData", this, depth, options, inspect);
    }
}

/**
 * This object represents one size of a photo or a file / sticker thumbnail.
 */
export class PhotoSize {
    constructor(public raw: TelegramPhotoSize) { }
    static fromPayload(raw: TelegramPhotoSize): PhotoSize {
        return new PhotoSize(raw);
    }
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    get fileId(): string {
        return this.raw.file_id;
    }
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    get fileUniqueId(): string {
        return this.raw.file_unique_id;
    }
    /**
     * Photo width
     */
    get width(): number {
        return this.raw.width;
    }
    /**
     * Photo height
     */
    get height(): number {
        return this.raw.height;
    }
    /**
     * Optional. File size in bytes
     */
    get fileSize(): number | undefined {
        return this.raw.file_size;
    }
    /**
     * true if `file_size` is set
     */
    hasFileSize(): this is this & {
        fileSize: number;
    } {
        return this.raw.file_size != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("PhotoSize", this, depth, options, inspect);
    }
}

/**
 * This object contains information about a poll.
 */
export class Poll {
    private _questionEntities?: MessageEntity[] | undefined;
    private _options?: PollOptions;
    private _explanationEntities?: MessageEntity[] | undefined;
    private _explanationMedia?: PollMedia | undefined;
    private _descriptionEntities?: MessageEntity[] | undefined;
    private _media?: PollMedia | undefined;
    constructor(public raw: TelegramPoll) { }
    static fromPayload(raw: TelegramPoll): Poll {
        return new Poll(raw);
    }
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
        if (this._explanationMedia === undefined) {
            this._explanationMedia = this.raw.explanation_media ? new PollMedia(this.raw.explanation_media) : undefined;
        }
        return this._explanationMedia;
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
        if (this._media === undefined) {
            this._media = this.raw.media ? new PollMedia(this.raw.media) : undefined;
        }
        return this._media;
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
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("Poll", this, depth, options, inspect);
    }
}

export type RegularPoll = Omit<Poll, "type"> & {
    type: "regular";
};

export type QuizPoll = Omit<Poll, "type"> & {
    type: "quiz";
};

/**
 * This object represents an answer of a user in a non-anonymous poll.
 */
export class PollAnswer {
    private _voterChat?: Chat | undefined;
    private _user?: User | undefined;
    constructor(public raw: TelegramPollAnswer) { }
    static fromPayload(raw: TelegramPollAnswer): PollAnswer {
        return new PollAnswer(raw);
    }
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
        if (this._voterChat === undefined) {
            this._voterChat = this.raw.voter_chat ? new Chat(this.raw.voter_chat) : undefined;
        }
        return this._voterChat;
    }
    /**
     * Optional. The user that changed the answer to the poll, if the voter isn't anonymous
     */
    get user(): User | undefined {
        if (this._user === undefined) {
            this._user = this.raw.user ? new User(this.raw.user) : undefined;
        }
        return this._user;
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
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("PollAnswer", this, depth, options, inspect);
    }
}

/**
 * At most one of the optional fields can be present in any given object.
 */
export class PollMedia {
    private _animation?: Animation | undefined;
    private _audio?: Audio | undefined;
    private _document?: Document | undefined;
    private _livePhoto?: LivePhoto | undefined;
    private _location?: Location | undefined;
    private _photo?: Photo | undefined;
    private _sticker?: Sticker | undefined;
    private _venue?: Venue | undefined;
    private _video?: Video | undefined;
    constructor(public raw: TelegramPollMedia) { }
    static fromPayload(raw: TelegramPollMedia): PollMedia {
        return new PollMedia(raw);
    }
    /**
     * Optional. Media is an animation, information about the animation
     */
    get animation(): Animation | undefined {
        if (this._animation === undefined) {
            this._animation = this.raw.animation ? new Animation(this.raw.animation) : undefined;
        }
        return this._animation;
    }
    /**
     * Optional. Media is an audio file, information about the file; currently, can't be received in a poll option
     */
    get audio(): Audio | undefined {
        if (this._audio === undefined) {
            this._audio = this.raw.audio ? new Audio(this.raw.audio) : undefined;
        }
        return this._audio;
    }
    /**
     * Optional. Media is a general file, information about the file; currently, can't be received in a poll option
     */
    get document(): Document | undefined {
        if (this._document === undefined) {
            this._document = this.raw.document ? new Document(this.raw.document) : undefined;
        }
        return this._document;
    }
    /**
     * Optional. The HTTP link attached to the poll option
     */
    get link(): TelegramLink | undefined {
        return this.raw.link;
    }
    /**
     * Optional. Media is a live photo, information about the live photo
     */
    get livePhoto(): LivePhoto | undefined {
        if (this._livePhoto === undefined) {
            this._livePhoto = this.raw.live_photo ? new LivePhoto(this.raw.live_photo) : undefined;
        }
        return this._livePhoto;
    }
    /**
     * Optional. Media is a shared location, information about the location
     */
    get location(): Location | undefined {
        if (this._location === undefined) {
            this._location = this.raw.location ? new Location(this.raw.location) : undefined;
        }
        return this._location;
    }
    /**
     * Optional. Media is a photo, available sizes of the photo
     */
    get photo(): Photo | undefined {
        if (this._photo === undefined) {
            this._photo = this.raw.photo ? new Photo(this.raw.photo) : undefined;
        }
        return this._photo;
    }
    /**
     * Optional. Media is a sticker, information about the sticker; currently, for poll options only
     */
    get sticker(): Sticker | undefined {
        if (this._sticker === undefined) {
            this._sticker = this.raw.sticker ? new Sticker(this.raw.sticker) : undefined;
        }
        return this._sticker;
    }
    /**
     * Optional. Media is a venue, information about the venue
     */
    get venue(): Venue | undefined {
        if (this._venue === undefined) {
            this._venue = this.raw.venue ? new Venue(this.raw.venue) : undefined;
        }
        return this._venue;
    }
    /**
     * Optional. Media is a video, information about the video
     */
    get video(): Video | undefined {
        if (this._video === undefined) {
            this._video = this.raw.video ? new Video(this.raw.video) : undefined;
        }
        return this._video;
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
     * true if `link` is set
     */
    hasLink(): this is this & {
        link: TelegramLink;
    } {
        return this.raw.link != null;
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
     * true if `location` is set
     */
    hasLocation(): this is this & {
        location: Location;
    } {
        return this.raw.location != null;
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
     * true if `venue` is set
     */
    hasVenue(): this is this & {
        venue: Venue;
    } {
        return this.raw.venue != null;
    }
    /**
     * true if `video` is set
     */
    hasVideo(): this is this & {
        video: Video;
    } {
        return this.raw.video != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("PollMedia", this, depth, options, inspect);
    }
}

/**
 * This object contains information about one answer option in a poll.
 */
export class PollOption {
    private _textEntities?: MessageEntity[] | undefined;
    private _media?: PollMedia | undefined;
    private _addedByUser?: User | undefined;
    private _addedByChat?: Chat | undefined;
    constructor(public raw: TelegramPollOption) { }
    static fromPayload(raw: TelegramPollOption): PollOption {
        return new PollOption(raw);
    }
    /**
     * Unique identifier of the option, persistent on option addition and deletion
     */
    get persistentId(): string {
        return this.raw.persistent_id;
    }
    /**
     * Option text, 1-100 characters
     */
    get text(): string {
        return this.raw.text;
    }
    /**
     * Optional. Special entities that appear in the option text. Currently, only custom emoji entities are allowed in poll option texts
     */
    get textEntities(): MessageEntity[] | undefined {
        return this.raw.text_entities ? (this._textEntities ??= this.raw.text_entities.map(x => new MessageEntity(x))) : undefined;
    }
    /**
     * Optional. Media added to the poll option
     */
    get media(): PollMedia | undefined {
        if (this._media === undefined) {
            this._media = this.raw.media ? new PollMedia(this.raw.media) : undefined;
        }
        return this._media;
    }
    /**
     * Number of users who voted for this option; may be 0 if unknown
     */
    get voterCount(): number {
        return this.raw.voter_count;
    }
    /**
     * Optional. User who added the option; omitted if the option wasn't added by a user after poll creation
     */
    get addedByUser(): User | undefined {
        if (this._addedByUser === undefined) {
            this._addedByUser = this.raw.added_by_user ? new User(this.raw.added_by_user) : undefined;
        }
        return this._addedByUser;
    }
    /**
     * Optional. Chat that added the option; omitted if the option wasn't added by a chat after poll creation
     */
    get addedByChat(): Chat | undefined {
        if (this._addedByChat === undefined) {
            this._addedByChat = this.raw.added_by_chat ? new Chat(this.raw.added_by_chat) : undefined;
        }
        return this._addedByChat;
    }
    /**
     * Optional. Point in time (Unix timestamp) when the option was added; omitted if the option existed in the original poll
     */
    get additionDate(): number | undefined {
        return this.raw.addition_date;
    }
    /**
     * true if `text_entities` has at least one item
     */
    hasTextEntities(): this is this & {
        textEntities: MessageEntity[];
    } {
        return this.raw.text_entities != null && this.raw.text_entities.length > 0;
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
     * true if `added_by_user` is set
     */
    hasAddedByUser(): this is this & {
        addedByUser: User;
    } {
        return this.raw.added_by_user != null;
    }
    /**
     * true if `added_by_chat` is set
     */
    hasAddedByChat(): this is this & {
        addedByChat: Chat;
    } {
        return this.raw.added_by_chat != null;
    }
    /**
     * true if `addition_date` is set
     */
    hasAdditionDate(): this is this & {
        additionDate: number;
    } {
        return this.raw.addition_date != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("PollOption", this, depth, options, inspect);
    }
}

/**
 * This object contains information about an incoming pre-checkout query.
 */
export class PreCheckoutQuery {
    private _from?: User;
    private _orderInfo?: OrderInfo | undefined;
    constructor(public raw: TelegramPreCheckoutQuery) { }
    static fromPayload(raw: TelegramPreCheckoutQuery): PreCheckoutQuery {
        return new PreCheckoutQuery(raw);
    }
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
        if (this._orderInfo === undefined) {
            this._orderInfo = this.raw.order_info ? new OrderInfo(this.raw.order_info) : undefined;
        }
        return this._orderInfo;
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
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("PreCheckoutQuery", this, depth, options, inspect);
    }
}

/**
 * This object represents the content of a service message, sent whenever a user in the chat triggers a proximity alert set by another user.
 */
export class ProximityAlertTriggered {
    private _traveler?: User;
    private _watcher?: User;
    constructor(public raw: TelegramProximityAlertTriggered) { }
    static fromPayload(raw: TelegramProximityAlertTriggered): ProximityAlertTriggered {
        return new ProximityAlertTriggered(raw);
    }
    /**
     * User that triggered the alert
     */
    get traveler(): User {
        return this._traveler ??= new User(this.raw.traveler);
    }
    /**
     * User that set the alert
     */
    get watcher(): User {
        return this._watcher ??= new User(this.raw.watcher);
    }
    /**
     * The distance between the users
     */
    get distance(): number {
        return this.raw.distance;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ProximityAlertTriggered", this, depth, options, inspect);
    }
}

/**
 * Represents a reaction added to a message along with the number of times it was added.
 */
export class ReactionCount {
    constructor(public raw: TelegramReactionCount) { }
    static fromPayload(raw: TelegramReactionCount): ReactionCount {
        return new ReactionCount(raw);
    }
    /**
     * Type of the reaction
     */
    get type(): TelegramReactionType {
        return this.raw.type;
    }
    /**
     * Number of times the reaction was added
     */
    get totalCount(): number {
        return this.raw.total_count;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ReactionCount", this, depth, options, inspect);
    }
}

/**
 * This object represents a shipping address.
 */
export class ShippingAddress {
    constructor(public raw: TelegramShippingAddress) { }
    static fromPayload(raw: TelegramShippingAddress): ShippingAddress {
        return new ShippingAddress(raw);
    }
    /**
     * Two-letter ISO 3166-1 alpha-2 country code
     */
    get countryCode(): string {
        return this.raw.country_code;
    }
    /**
     * State, if applicable
     */
    get state(): string {
        return this.raw.state;
    }
    /**
     * City
     */
    get city(): string {
        return this.raw.city;
    }
    /**
     * First line for the address
     */
    get streetLine1(): string {
        return this.raw.street_line1;
    }
    /**
     * Second line for the address
     */
    get streetLine2(): string {
        return this.raw.street_line2;
    }
    /**
     * Address post code
     */
    get postCode(): string {
        return this.raw.post_code;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ShippingAddress", this, depth, options, inspect);
    }
}

/**
 * This object contains information about an incoming shipping query.
 */
export class ShippingQuery {
    private _from?: User;
    private _shippingAddress?: ShippingAddress;
    constructor(public raw: TelegramShippingQuery) { }
    static fromPayload(raw: TelegramShippingQuery): ShippingQuery {
        return new ShippingQuery(raw);
    }
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
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("ShippingQuery", this, depth, options, inspect);
    }
}

/**
 * This object represents a sticker.
 */
export class Sticker {
    private _thumbnail?: PhotoSize | undefined;
    private _premiumAnimation?: File | undefined;
    private _maskPosition?: MaskPosition | undefined;
    constructor(public raw: TelegramSticker) { }
    static fromPayload(raw: TelegramSticker): Sticker {
        return new Sticker(raw);
    }
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    get fileId(): string {
        return this.raw.file_id;
    }
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    get fileUniqueId(): string {
        return this.raw.file_unique_id;
    }
    /**
     * Type of the sticker, currently one of “regular”, “mask”, “custom_emoji”. The type of the sticker is independent from its format, which is determined by the fields is_animated and is_video.
     */
    get type(): "regular" | "mask" | "custom_emoji" {
        return this.raw.type;
    }
    /**
     * Sticker width
     */
    get width(): number {
        return this.raw.width;
    }
    /**
     * Sticker height
     */
    get height(): number {
        return this.raw.height;
    }
    /**
     * True, if the sticker is animated
     */
    get isAnimated(): boolean {
        return this.raw.is_animated;
    }
    /**
     * True, if the sticker is a video sticker
     */
    get isVideo(): boolean {
        return this.raw.is_video;
    }
    /**
     * Optional. Sticker thumbnail in the .WEBP or .JPG format
     */
    get thumbnail(): PhotoSize | undefined {
        if (this._thumbnail === undefined) {
            this._thumbnail = this.raw.thumbnail ? new PhotoSize(this.raw.thumbnail) : undefined;
        }
        return this._thumbnail;
    }
    /**
     * Optional. Emoji associated with the sticker
     */
    get emoji(): string | undefined {
        return this.raw.emoji;
    }
    /**
     * Optional. Name of the sticker set to which the sticker belongs
     */
    get setName(): string | undefined {
        return this.raw.set_name;
    }
    /**
     * Optional. For premium regular stickers, premium animation for the sticker
     */
    get premiumAnimation(): File | undefined {
        if (this._premiumAnimation === undefined) {
            this._premiumAnimation = this.raw.premium_animation ? new File(this.raw.premium_animation) : undefined;
        }
        return this._premiumAnimation;
    }
    /**
     * Optional. For mask stickers, the position where the mask should be placed
     */
    get maskPosition(): MaskPosition | undefined {
        if (this._maskPosition === undefined) {
            this._maskPosition = this.raw.mask_position ? new MaskPosition(this.raw.mask_position) : undefined;
        }
        return this._maskPosition;
    }
    /**
     * Optional. For custom emoji stickers, unique identifier of the custom emoji
     */
    get customEmojiId(): string | undefined {
        return this.raw.custom_emoji_id;
    }
    /**
     * Optional. True, if the sticker must be repainted to a text color in messages, the color of the Telegram Premium badge in emoji status, white color on chat photos, or another appropriate color in other places
     */
    get needsRepainting(): true | undefined {
        return this.raw.needs_repainting;
    }
    /**
     * Optional. File size in bytes
     */
    get fileSize(): number | undefined {
        return this.raw.file_size;
    }
    /**
     * true if `thumbnail` is set
     */
    hasThumbnail(): this is this & {
        thumbnail: PhotoSize;
    } {
        return this.raw.thumbnail != null;
    }
    /**
     * true if `emoji` is set
     */
    hasEmoji(): this is this & {
        emoji: string;
    } {
        return this.raw.emoji != null;
    }
    /**
     * true if `set_name` is set
     */
    hasSetName(): this is this & {
        setName: string;
    } {
        return this.raw.set_name != null;
    }
    /**
     * true if `premium_animation` is set
     */
    hasPremiumAnimation(): this is this & {
        premiumAnimation: File;
    } {
        return this.raw.premium_animation != null;
    }
    /**
     * true if `mask_position` is set
     */
    hasMaskPosition(): this is this & {
        maskPosition: MaskPosition;
    } {
        return this.raw.mask_position != null;
    }
    /**
     * true if `custom_emoji_id` is set
     */
    hasCustomEmojiId(): this is this & {
        customEmojiId: string;
    } {
        return this.raw.custom_emoji_id != null;
    }
    /**
     * true if `needs_repainting` is set
     */
    hasNeedsRepainting(): this is this & {
        needsRepainting: true;
    } {
        return this.raw.needs_repainting != null;
    }
    /**
     * true if `file_size` is set
     */
    hasFileSize(): this is this & {
        fileSize: number;
    } {
        return this.raw.file_size != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("Sticker", this, depth, options, inspect);
    }
}

export type RegularSticker = Omit<Sticker, "type"> & {
    type: "regular";
};

export type MaskSticker = Omit<Sticker, "type"> & {
    type: "mask";
};

export type CustomEmojiSticker = Omit<Sticker, "type"> & {
    type: "custom_emoji";
};

/**
 * This object represents a sticker set.
 */
export class StickerSet {
    private _stickers?: Sticker[];
    private _thumbnail?: PhotoSize | undefined;
    constructor(public raw: TelegramStickerSet) { }
    static fromPayload(raw: TelegramStickerSet): StickerSet {
        return new StickerSet(raw);
    }
    /**
     * Sticker set name
     */
    get name(): string {
        return this.raw.name;
    }
    /**
     * Sticker set title
     */
    get title(): string {
        return this.raw.title;
    }
    /**
     * Type of stickers in the set, currently one of “regular”, “mask”, “custom_emoji”
     */
    get stickerType(): "regular" | "mask" | "custom_emoji" {
        return this.raw.sticker_type;
    }
    /**
     * List of all set stickers
     */
    get stickers(): Sticker[] {
        return this._stickers ??= this.raw.stickers.map(x => new Sticker(x));
    }
    /**
     * Optional. Sticker set thumbnail in the .WEBP, .TGS, or .WEBM format
     */
    get thumbnail(): PhotoSize | undefined {
        if (this._thumbnail === undefined) {
            this._thumbnail = this.raw.thumbnail ? new PhotoSize(this.raw.thumbnail) : undefined;
        }
        return this._thumbnail;
    }
    /**
     * true if `thumbnail` is set
     */
    hasThumbnail(): this is this & {
        thumbnail: PhotoSize;
    } {
        return this.raw.thumbnail != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("StickerSet", this, depth, options, inspect);
    }
}

export type RegularStickerSet = Omit<StickerSet, "stickerType"> & {
    stickerType: "regular";
};

export type MaskStickerSet = Omit<StickerSet, "stickerType"> & {
    stickerType: "mask";
};

export type CustomEmojiStickerSet = Omit<StickerSet, "stickerType"> & {
    stickerType: "custom_emoji";
};

/**
 * This object represents a story.
 */
export class Story {
    private _chat?: Chat;
    constructor(public raw: TelegramStory) { }
    static fromPayload(raw: TelegramStory): Story {
        return new Story(raw);
    }
    /**
     * Chat that posted the story
     */
    get chat(): Chat {
        return this._chat ??= new Chat(this.raw.chat);
    }
    /**
     * Unique identifier for the story in the chat
     */
    get id(): number {
        return this.raw.id;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("Story", this, depth, options, inspect);
    }
}

/**
 * This object contains basic information about a successful payment. Note that if the buyer initiates a chargeback with the relevant payment provider following this transaction, the funds may be debited from your balance. This is outside of Telegram's control.
 */
export class SuccessfulPayment {
    private _orderInfo?: OrderInfo | undefined;
    constructor(public raw: TelegramSuccessfulPayment) { }
    static fromPayload(raw: TelegramSuccessfulPayment): SuccessfulPayment {
        return new SuccessfulPayment(raw);
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
     * Optional. Expiration date of the subscription, in Unix time; for recurring payments only
     */
    get subscriptionExpirationDate(): number | undefined {
        return this.raw.subscription_expiration_date;
    }
    /**
     * Optional. True, if the payment is a recurring payment for a subscription
     */
    get isRecurring(): true | undefined {
        return this.raw.is_recurring;
    }
    /**
     * Optional. True, if the payment is the first payment for a subscription
     */
    get isFirstRecurring(): true | undefined {
        return this.raw.is_first_recurring;
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
        if (this._orderInfo === undefined) {
            this._orderInfo = this.raw.order_info ? new OrderInfo(this.raw.order_info) : undefined;
        }
        return this._orderInfo;
    }
    /**
     * Telegram payment identifier
     */
    get telegramPaymentChargeId(): string {
        return this.raw.telegram_payment_charge_id;
    }
    /**
     * Provider payment identifier
     */
    get providerPaymentChargeId(): string {
        return this.raw.provider_payment_charge_id;
    }
    /**
     * true if `subscription_expiration_date` is set
     */
    hasSubscriptionExpirationDate(): this is this & {
        subscriptionExpirationDate: number;
    } {
        return this.raw.subscription_expiration_date != null;
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
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("SuccessfulPayment", this, depth, options, inspect);
    }
}

/**
 * This object contains information about the quoted part of a message that is replied to by the given message.
 */
export class TextQuote {
    private _entities?: MessageEntity[] | undefined;
    constructor(public raw: TelegramTextQuote) { }
    static fromPayload(raw: TelegramTextQuote): TextQuote {
        return new TextQuote(raw);
    }
    /**
     * Text of the quoted part of a message that is replied to by the given message; may be empty if the quote was chosen from a rich message
     */
    get text(): string {
        return this.raw.text;
    }
    /**
     * Optional. Special entities that appear in the quote. Currently, only bold, italic, underline, strikethrough, spoiler, custom_emoji, and date_time entities are kept in quotes.
     */
    get entities(): MessageEntity[] | undefined {
        return this.raw.entities ? (this._entities ??= this.raw.entities.map(x => new MessageEntity(x))) : undefined;
    }
    /**
     * Optional. Rich text of the quote if it was chosen from a rich message. May contain only plain text, RichTextBold, RichTextItalic, RichTextUnderline, RichTextStrikethrough, RichTextSpoiler, RichTextSubscript, RichTextSuperscript, RichTextDateTime, RichTextCustomEmoji, RichTextMathematicalExpression, and arrays of them.
     */
    get richTexts(): TelegramRichText[] | undefined {
        return this.raw.rich_texts;
    }
    /**
     * Approximate quote position in the original message in UTF-16 code units as specified by the sender. For quotes from rich messages, it is the position in the text formed by joining plain texts of all quotable texts of the message, separated by line feeds.
     */
    get position(): number {
        return this.raw.position;
    }
    /**
     * Optional. True, if the quote was chosen manually by the message sender. Otherwise, the quote was added automatically by the server.
     */
    get isManual(): true | undefined {
        return this.raw.is_manual;
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
     * true if `rich_texts` has at least one item
     */
    hasRichTexts(): this is this & {
        richTexts: TelegramRichText[];
    } {
        return this.raw.rich_texts != null && this.raw.rich_texts.length > 0;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("TextQuote", this, depth, options, inspect);
    }
}

/**
 * This object represents an NFT in the TON blockchain.
 */
export class TonNft {
    private _attributes?: TonNftAttribute[] | undefined;
    constructor(public raw: TelegramTonNft) { }
    static fromPayload(raw: TelegramTonNft): TonNft {
        return new TonNft(raw);
    }
    /**
     * Address of the NFT
     */
    get address(): string {
        return this.raw.address;
    }
    /**
     * Optional. Address of the collection to which the NFT belongs; omitted if unknown
     */
    get collectionAddress(): string | undefined {
        return this.raw.collection_address;
    }
    /**
     * Index of the NFT among all NFTs from the collection as a decimal number
     */
    get index(): string {
        return this.raw.index;
    }
    /**
     * Name of the NFT
     */
    get name(): string {
        return this.raw.name;
    }
    /**
     * Description of the NFT
     */
    get description(): string {
        return this.raw.description;
    }
    /**
     * Optional. Attributes of the NFT
     */
    get attributes(): TonNftAttribute[] | undefined {
        return this.raw.attributes ? (this._attributes ??= this.raw.attributes.map(x => new TonNftAttribute(x))) : undefined;
    }
    /**
     * Optional. The unique gift corresponding to the NFT
     */
    get gift(): TelegramUniqueGift | undefined {
        return this.raw.gift;
    }
    /**
     * true if `collection_address` is set
     */
    hasCollectionAddress(): this is this & {
        collectionAddress: string;
    } {
        return this.raw.collection_address != null;
    }
    /**
     * true if `attributes` has at least one item
     */
    hasAttributes(): this is this & {
        attributes: TonNftAttribute[];
    } {
        return this.raw.attributes != null && this.raw.attributes.length > 0;
    }
    /**
     * true if `gift` is set
     */
    hasGift(): this is this & {
        gift: TelegramUniqueGift;
    } {
        return this.raw.gift != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("TonNft", this, depth, options, inspect);
    }
}

/**
 * This object represents an attribute of an NFT in the TON blockchain.
 */
export class TonNftAttribute {
    constructor(public raw: TelegramTonNftAttribute) { }
    static fromPayload(raw: TelegramTonNftAttribute): TonNftAttribute {
        return new TonNftAttribute(raw);
    }
    /**
     * Trait type of the attribute
     */
    get traitType(): string {
        return this.raw.trait_type;
    }
    /**
     * Value of the attribute
     */
    get value(): string {
        return this.raw.value;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("TonNftAttribute", this, depth, options, inspect);
    }
}

/**
 * This object describes a TON wallet card, which is shown on the profile page of a user to everyone.
 */
export class TonWalletCard {
    private _stickers?: TonWalletCardSticker[];
    constructor(public raw: TelegramTonWalletCard) { }
    static fromPayload(raw: TelegramTonWalletCard): TonWalletCard {
        return new TonWalletCard(raw);
    }
    /**
     * Address of the wallet
     */
    get address(): string {
        return this.raw.address;
    }
    /**
     * Balance of the wallet, in the smallest units of the cryptocurrency, as a decimal number
     */
    get amount(): string {
        return this.raw.amount;
    }
    /**
     * Stickers placed on the card
     */
    get stickers(): TonWalletCardSticker[] {
        return this._stickers ??= this.raw.stickers.map(x => new TonWalletCardSticker(x));
    }
    /**
     * Optional. Address of the NFT of one of the stickers, whose colors must be used for the card background; omitted if the default background must be used
     */
    get backgroundNftAddress(): string | undefined {
        return this.raw.background_nft_address;
    }
    /**
     * true if `background_nft_address` is set
     */
    hasBackgroundNftAddress(): this is this & {
        backgroundNftAddress: string;
    } {
        return this.raw.background_nft_address != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("TonWalletCard", this, depth, options, inspect);
    }
}

/**
 * This object describes a sticker on a TON wallet card.
 */
export class TonWalletCardSticker {
    private _position?: AreaPosition;
    private _nft?: TonNft;
    constructor(public raw: TelegramTonWalletCardSticker) { }
    static fromPayload(raw: TelegramTonWalletCardSticker): TonWalletCardSticker {
        return new TonWalletCardSticker(raw);
    }
    /**
     * Position of the sticker on the card
     */
    get position(): AreaPosition {
        return this._position ??= new AreaPosition(this.raw.position);
    }
    /**
     * The NFT shown as the sticker
     */
    get nft(): TonNft {
        return this._nft ??= new TonNft(this.raw.nft);
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("TonWalletCardSticker", this, depth, options, inspect);
    }
}

/**
 * Describes a service message about a transfer with a TON wallet.
 */
export class TonWalletTransfer {
    constructor(public raw: TelegramTonWalletTransfer) { }
    static fromPayload(raw: TelegramTonWalletTransfer): TonWalletTransfer {
        return new TonWalletTransfer(raw);
    }
    /**
     * Unique identifier of the transaction; may be empty if the transfer hasn't been sent yet
     */
    get transactionId(): string {
        return this.raw.transaction_id;
    }
    /**
     * Address of the transfer peer in the TON blockchain
     */
    get peerAddress(): string {
        return this.raw.peer_address;
    }
    /**
     * The amount of transferred cryptocurrency, in the smallest units of the cryptocurrency, as a decimal number; negative for outgoing transfers
     */
    get amount(): string {
        return this.raw.amount;
    }
    /**
     * Optional. Comment added to the transfer; omitted if the comment is encrypted
     */
    get comment(): string | undefined {
        return this.raw.comment;
    }
    /**
     * true if `comment` is set
     */
    hasComment(): this is this & {
        comment: string;
    } {
        return this.raw.comment != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("TonWalletTransfer", this, depth, options, inspect);
    }
}

/**
 * This object represents a Telegram user or bot.
 */
export class User {
    constructor(public raw: TelegramUser) { }
    static fromPayload(raw: TelegramUser): User {
        return new User(raw);
    }
    /**
     * Unique identifier for this user or bot. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.
     */
    get id(): number {
        return this.raw.id;
    }
    /**
     * True, if this user is a bot
     */
    get isBot(): boolean {
        return this.raw.is_bot;
    }
    /**
     * User's or bot's first name
     */
    get firstName(): string {
        return this.raw.first_name;
    }
    /**
     * Optional. User's or bot's last name
     */
    get lastName(): string | undefined {
        return this.raw.last_name;
    }
    /**
     * Optional. User's or bot's username
     */
    get username(): string | undefined {
        return this.raw.username;
    }
    /**
     * Optional. IETF language tag of the user's language
     */
    get languageCode(): string | undefined {
        return this.raw.language_code;
    }
    /**
     * Optional. True, if this user is a Telegram Premium user
     */
    get isPremium(): true | undefined {
        return this.raw.is_premium;
    }
    /**
     * Optional. True, if this user added the bot to the attachment menu
     */
    get addedToAttachmentMenu(): true | undefined {
        return this.raw.added_to_attachment_menu;
    }
    /**
     * Optional. True, if the bot can be invited to groups. Returned only in getMe.
     */
    get canJoinGroups(): boolean | undefined {
        return this.raw.can_join_groups;
    }
    /**
     * Optional. True, if privacy mode is disabled for the bot. Returned only in getMe.
     */
    get canReadAllGroupMessages(): boolean | undefined {
        return this.raw.can_read_all_group_messages;
    }
    /**
     * Optional. True, if the bot supports guest queries from chats it is not a member of. Returned only in getMe.
     */
    get supportsGuestQueries(): boolean | undefined {
        return this.raw.supports_guest_queries;
    }
    /**
     * Optional. True, if the bot supports inline queries. Returned only in getMe.
     */
    get supportsInlineQueries(): boolean | undefined {
        return this.raw.supports_inline_queries;
    }
    /**
     * Optional. True, if the bot can be connected to a user account to manage it. Returned only in getMe.
     */
    get canConnectToBusiness(): boolean | undefined {
        return this.raw.can_connect_to_business;
    }
    /**
     * Optional. True, if the bot has a main Web App. Returned only in getMe.
     */
    get hasMainWebApp(): boolean | undefined {
        return this.raw.has_main_web_app;
    }
    /**
     * Optional. True, if the bot has forum topic mode enabled in private chats. Returned only in getMe.
     */
    get hasTopicsEnabled(): boolean | undefined {
        return this.raw.has_topics_enabled;
    }
    /**
     * Optional. True, if the bot allows users to create and delete topics in private chats. Returned only in getMe.
     */
    get allowsUsersToCreateTopics(): boolean | undefined {
        return this.raw.allows_users_to_create_topics;
    }
    /**
     * Optional. True, if other bots can be created to be controlled by the bot. Returned only in getMe.
     */
    get canManageBots(): boolean | undefined {
        return this.raw.can_manage_bots;
    }
    /**
     * Optional. True, if the bot supports join request queries and can be assigned to process them. Returned only in getMe.
     */
    get supportsJoinRequestQueries(): boolean | undefined {
        return this.raw.supports_join_request_queries;
    }
    /**
     * true if `last_name` is set
     */
    hasLastName(): this is this & {
        lastName: string;
    } {
        return this.raw.last_name != null;
    }
    /**
     * true if `username` is set
     */
    hasUsername(): this is this & {
        username: string;
    } {
        return this.raw.username != null;
    }
    /**
     * true if `language_code` is set
     */
    hasLanguageCode(): this is this & {
        languageCode: string;
    } {
        return this.raw.language_code != null;
    }
    /**
     * true if `added_to_attachment_menu` is set
     */
    hasAddedToAttachmentMenu(): this is this & {
        addedToAttachmentMenu: true;
    } {
        return this.raw.added_to_attachment_menu != null;
    }
    /**
     * true if `can_join_groups` is set
     */
    hasCanJoinGroups(): this is this & {
        canJoinGroups: boolean;
    } {
        return this.raw.can_join_groups != null;
    }
    /**
     * true if `can_read_all_group_messages` is set
     */
    hasCanReadAllGroupMessages(): this is this & {
        canReadAllGroupMessages: boolean;
    } {
        return this.raw.can_read_all_group_messages != null;
    }
    /**
     * true if `supports_guest_queries` is set
     */
    hasSupportsGuestQueries(): this is this & {
        supportsGuestQueries: boolean;
    } {
        return this.raw.supports_guest_queries != null;
    }
    /**
     * true if `supports_inline_queries` is set
     */
    hasSupportsInlineQueries(): this is this & {
        supportsInlineQueries: boolean;
    } {
        return this.raw.supports_inline_queries != null;
    }
    /**
     * true if `can_connect_to_business` is set
     */
    hasCanConnectToBusiness(): this is this & {
        canConnectToBusiness: boolean;
    } {
        return this.raw.can_connect_to_business != null;
    }
    /**
     * true if `allows_users_to_create_topics` is set
     */
    hasAllowsUsersToCreateTopics(): this is this & {
        allowsUsersToCreateTopics: boolean;
    } {
        return this.raw.allows_users_to_create_topics != null;
    }
    /**
     * true if `can_manage_bots` is set
     */
    hasCanManageBots(): this is this & {
        canManageBots: boolean;
    } {
        return this.raw.can_manage_bots != null;
    }
    /**
     * true if `supports_join_request_queries` is set
     */
    hasSupportsJoinRequestQueries(): this is this & {
        supportsJoinRequestQueries: boolean;
    } {
        return this.raw.supports_join_request_queries != null;
    }
    /**
     * display name; first name plus last name when present, otherwise just first name
     */
    get displayName(): string {
        return this.raw.last_name ? `${this.raw.first_name} ${this.raw.last_name}` : this.raw.first_name;
    }
    /**
     * render a clickable mention pointing at this user; defaults to 'html'
     */
    mention(parseMode?: 'html' | 'markdown' | 'markdownv2'): string {
        const mode = parseMode ?? 'html';
        const name = this.raw.last_name
            ? `${this.raw.first_name} ${this.raw.last_name}`
            : this.raw.first_name;
        const id = this.raw.id;
        if (mode === 'html') {
            const escaped = name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return `<a href="tg://user?id=${id}">${escaped}</a>`;
        }
        if (mode === 'markdownv2') {
            const escaped = name.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
            return `[${escaped}](tg://user?id=${id})`;
        }
        const escaped = name.replace(/[[\]\\]/g, '\\$&');
        return `[${escaped}](tg://user?id=${id})`;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("User", this, depth, options, inspect);
    }
}

/**
 * This object represent a user's profile pictures.
 */
export class UserProfilePhotos {
    private _photos?: Photo[];
    constructor(public raw: TelegramUserProfilePhotos) { }
    static fromPayload(raw: TelegramUserProfilePhotos): UserProfilePhotos {
        return new UserProfilePhotos(raw);
    }
    /**
     * Total number of profile pictures the target user has
     */
    get totalCount(): number {
        return this.raw.total_count;
    }
    /**
     * Requested profile pictures (in up to 4 sizes each)
     */
    get photos(): Photo[] {
        return this._photos ??= this.raw.photos.map(x => new Photo(x));
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("UserProfilePhotos", this, depth, options, inspect);
    }
}

/**
 * This object contains information about the users whose identifiers were shared with the bot using a KeyboardButtonRequestUsers button.
 */
export class UsersShared {
    constructor(public raw: TelegramUsersShared) { }
    static fromPayload(raw: TelegramUsersShared): UsersShared {
        return new UsersShared(raw);
    }
    /**
     * Identifier of the request
     */
    get requestId(): number {
        return this.raw.request_id;
    }
    /**
     * Information about users shared with the bot
     */
    get users(): TelegramSharedUser[] {
        return this.raw.users;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("UsersShared", this, depth, options, inspect);
    }
}

/**
 * This object represents a venue.
 */
export class Venue {
    private _location?: Location;
    constructor(public raw: TelegramVenue) { }
    static fromPayload(raw: TelegramVenue): Venue {
        return new Venue(raw);
    }
    /**
     * Venue location. Can't be a live location.
     */
    get location(): Location {
        return this._location ??= new Location(this.raw.location);
    }
    /**
     * Name of the venue
     */
    get title(): string {
        return this.raw.title;
    }
    /**
     * Address of the venue
     */
    get address(): string {
        return this.raw.address;
    }
    /**
     * Optional. Foursquare identifier of the venue
     */
    get foursquareId(): string | undefined {
        return this.raw.foursquare_id;
    }
    /**
     * Optional. Foursquare type of the venue. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)
     */
    get foursquareType(): string | undefined {
        return this.raw.foursquare_type;
    }
    /**
     * Optional. Google Places identifier of the venue
     */
    get googlePlaceId(): string | undefined {
        return this.raw.google_place_id;
    }
    /**
     * Optional. Google Places type of the venue. (See supported types.)
     */
    get googlePlaceType(): string | undefined {
        return this.raw.google_place_type;
    }
    /**
     * true if `foursquare_id` is set
     */
    hasFoursquareId(): this is this & {
        foursquareId: string;
    } {
        return this.raw.foursquare_id != null;
    }
    /**
     * true if `foursquare_type` is set
     */
    hasFoursquareType(): this is this & {
        foursquareType: string;
    } {
        return this.raw.foursquare_type != null;
    }
    /**
     * true if `google_place_id` is set
     */
    hasGooglePlaceId(): this is this & {
        googlePlaceId: string;
    } {
        return this.raw.google_place_id != null;
    }
    /**
     * true if `google_place_type` is set
     */
    hasGooglePlaceType(): this is this & {
        googlePlaceType: string;
    } {
        return this.raw.google_place_type != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("Venue", this, depth, options, inspect);
    }
}

/**
 * This object represents a video file.
 */
export class Video {
    private _thumbnail?: PhotoSize | undefined;
    private _cover?: Photo | undefined;
    private _qualities?: VideoQualities | undefined;
    constructor(public raw: TelegramVideo) { }
    static fromPayload(raw: TelegramVideo): Video {
        return new Video(raw);
    }
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    get fileId(): string {
        return this.raw.file_id;
    }
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    get fileUniqueId(): string {
        return this.raw.file_unique_id;
    }
    /**
     * Video width as defined by the sender
     */
    get width(): number {
        return this.raw.width;
    }
    /**
     * Video height as defined by the sender
     */
    get height(): number {
        return this.raw.height;
    }
    /**
     * Duration of the video in seconds as defined by the sender
     */
    get duration(): number {
        return this.raw.duration;
    }
    /**
     * Optional. Video thumbnail
     */
    get thumbnail(): PhotoSize | undefined {
        if (this._thumbnail === undefined) {
            this._thumbnail = this.raw.thumbnail ? new PhotoSize(this.raw.thumbnail) : undefined;
        }
        return this._thumbnail;
    }
    /**
     * Optional. Available sizes of the cover of the video in the message
     */
    get cover(): Photo | undefined {
        if (this._cover === undefined) {
            this._cover = this.raw.cover ? new Photo(this.raw.cover) : undefined;
        }
        return this._cover;
    }
    /**
     * Optional. Timestamp in seconds from which the video will play in the message
     */
    get startTimestamp(): number | undefined {
        return this.raw.start_timestamp;
    }
    /**
     * Optional. List of available qualities of the video
     */
    get qualities(): VideoQualities | undefined {
        if (this._qualities === undefined) {
            this._qualities = this.raw.qualities ? new VideoQualities(this.raw.qualities) : undefined;
        }
        return this._qualities;
    }
    /**
     * Optional. Original filename as defined by the sender
     */
    get fileName(): string | undefined {
        return this.raw.file_name;
    }
    /**
     * Optional. MIME type of the file as defined by the sender
     */
    get mimeType(): string | undefined {
        return this.raw.mime_type;
    }
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     */
    get fileSize(): number | undefined {
        return this.raw.file_size;
    }
    /**
     * true if `thumbnail` is set
     */
    hasThumbnail(): this is this & {
        thumbnail: PhotoSize;
    } {
        return this.raw.thumbnail != null;
    }
    /**
     * true if `cover` has at least one item
     */
    hasCover(): this is this & {
        cover: Photo;
    } {
        return this.raw.cover != null && this.raw.cover.length > 0;
    }
    /**
     * true if `start_timestamp` is set
     */
    hasStartTimestamp(): this is this & {
        startTimestamp: number;
    } {
        return this.raw.start_timestamp != null;
    }
    /**
     * true if `qualities` has at least one item
     */
    hasQualities(): this is this & {
        qualities: VideoQualities;
    } {
        return this.raw.qualities != null && this.raw.qualities.length > 0;
    }
    /**
     * true if `file_name` is set
     */
    hasFileName(): this is this & {
        fileName: string;
    } {
        return this.raw.file_name != null;
    }
    /**
     * true if `mime_type` is set
     */
    hasMimeType(): this is this & {
        mimeType: string;
    } {
        return this.raw.mime_type != null;
    }
    /**
     * true if `file_size` is set
     */
    hasFileSize(): this is this & {
        fileSize: number;
    } {
        return this.raw.file_size != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("Video", this, depth, options, inspect);
    }
}

/**
 * This object represents a service message about a video chat ended in the chat.
 */
export class VideoChatEnded {
    constructor(public raw: TelegramVideoChatEnded) { }
    static fromPayload(raw: TelegramVideoChatEnded): VideoChatEnded {
        return new VideoChatEnded(raw);
    }
    /**
     * Video chat duration in seconds
     */
    get duration(): number {
        return this.raw.duration;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("VideoChatEnded", this, depth, options, inspect);
    }
}

/**
 * This object represents a service message about new members invited to a video chat.
 */
export class VideoChatParticipantsInvited {
    private _users?: User[];
    constructor(public raw: TelegramVideoChatParticipantsInvited) { }
    static fromPayload(raw: TelegramVideoChatParticipantsInvited): VideoChatParticipantsInvited {
        return new VideoChatParticipantsInvited(raw);
    }
    /**
     * New members that were invited to the video chat
     */
    get users(): User[] {
        return this._users ??= this.raw.users.map(x => new User(x));
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("VideoChatParticipantsInvited", this, depth, options, inspect);
    }
}

/**
 * This object represents a service message about a video chat scheduled in the chat.
 */
export class VideoChatScheduled {
    constructor(public raw: TelegramVideoChatScheduled) { }
    static fromPayload(raw: TelegramVideoChatScheduled): VideoChatScheduled {
        return new VideoChatScheduled(raw);
    }
    /**
     * Point in time (Unix timestamp) when the video chat is supposed to be started by a chat administrator
     */
    get startDate(): number {
        return this.raw.start_date;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("VideoChatScheduled", this, depth, options, inspect);
    }
}

/**
 * This object represents a video message.
 */
export class VideoNote {
    private _thumbnail?: PhotoSize | undefined;
    constructor(public raw: TelegramVideoNote) { }
    static fromPayload(raw: TelegramVideoNote): VideoNote {
        return new VideoNote(raw);
    }
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    get fileId(): string {
        return this.raw.file_id;
    }
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    get fileUniqueId(): string {
        return this.raw.file_unique_id;
    }
    /**
     * Video width and height (diameter of the video message) as defined by the sender
     */
    get length(): number {
        return this.raw.length;
    }
    /**
     * Duration of the video in seconds as defined by the sender
     */
    get duration(): number {
        return this.raw.duration;
    }
    /**
     * Optional. Video thumbnail
     */
    get thumbnail(): PhotoSize | undefined {
        if (this._thumbnail === undefined) {
            this._thumbnail = this.raw.thumbnail ? new PhotoSize(this.raw.thumbnail) : undefined;
        }
        return this._thumbnail;
    }
    /**
     * Optional. File size in bytes
     */
    get fileSize(): number | undefined {
        return this.raw.file_size;
    }
    /**
     * true if `thumbnail` is set
     */
    hasThumbnail(): this is this & {
        thumbnail: PhotoSize;
    } {
        return this.raw.thumbnail != null;
    }
    /**
     * true if `file_size` is set
     */
    hasFileSize(): this is this & {
        fileSize: number;
    } {
        return this.raw.file_size != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("VideoNote", this, depth, options, inspect);
    }
}

/**
 * This object represents a video file of a specific quality.
 */
export class VideoQuality {
    constructor(public raw: TelegramVideoQuality) { }
    static fromPayload(raw: TelegramVideoQuality): VideoQuality {
        return new VideoQuality(raw);
    }
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    get fileId(): string {
        return this.raw.file_id;
    }
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    get fileUniqueId(): string {
        return this.raw.file_unique_id;
    }
    /**
     * Video width
     */
    get width(): number {
        return this.raw.width;
    }
    /**
     * Video height
     */
    get height(): number {
        return this.raw.height;
    }
    /**
     * Codec that was used to encode the video, for example, “h264”, “h265”, or “av01”
     */
    get codec(): string {
        return this.raw.codec;
    }
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     */
    get fileSize(): number | undefined {
        return this.raw.file_size;
    }
    /**
     * true if `file_size` is set
     */
    hasFileSize(): this is this & {
        fileSize: number;
    } {
        return this.raw.file_size != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("VideoQuality", this, depth, options, inspect);
    }
}

/**
 * This object represents a voice note.
 */
export class Voice {
    constructor(public raw: TelegramVoice) { }
    static fromPayload(raw: TelegramVoice): Voice {
        return new Voice(raw);
    }
    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    get fileId(): string {
        return this.raw.file_id;
    }
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    get fileUniqueId(): string {
        return this.raw.file_unique_id;
    }
    /**
     * Duration of the audio in seconds as defined by the sender
     */
    get duration(): number {
        return this.raw.duration;
    }
    /**
     * Optional. MIME type of the file as defined by the sender
     */
    get mimeType(): string | undefined {
        return this.raw.mime_type;
    }
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     */
    get fileSize(): number | undefined {
        return this.raw.file_size;
    }
    /**
     * true if `mime_type` is set
     */
    hasMimeType(): this is this & {
        mimeType: string;
    } {
        return this.raw.mime_type != null;
    }
    /**
     * true if `file_size` is set
     */
    hasFileSize(): this is this & {
        fileSize: number;
    } {
        return this.raw.file_size != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("Voice", this, depth, options, inspect);
    }
}

/**
 * Describes data sent from a Web App to the bot.
 */
export class WebAppData {
    constructor(public raw: TelegramWebAppData) { }
    static fromPayload(raw: TelegramWebAppData): WebAppData {
        return new WebAppData(raw);
    }
    /**
     * The data. Be aware that a bad client can send arbitrary data in this field.
     */
    get data(): string {
        return this.raw.data;
    }
    /**
     * Text of the web_app keyboard button from which the Web App was opened. Be aware that a bad client can send arbitrary data in this field.
     */
    get buttonText(): string {
        return this.raw.button_text;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("WebAppData", this, depth, options, inspect);
    }
}

/**
 * Describes a Web App.
 */
export class WebAppInfo {
    constructor(public raw: TelegramWebAppInfo) { }
    static fromPayload(raw: TelegramWebAppInfo): WebAppInfo {
        return new WebAppInfo(raw);
    }
    /**
     * An HTTPS URL of a Web App to be opened with additional data as specified in Initializing Web Apps
     */
    get url(): string {
        return this.raw.url;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("WebAppInfo", this, depth, options, inspect);
    }
}

/**
 * This object describes an HTML widget.
 */
export class Widget {
    constructor(public raw: TelegramWidget) { }
    static fromPayload(raw: TelegramWidget): Widget {
        return new Widget(raw);
    }
    /**
     * Optional. Unique identifier of the shared widget, which can be used to send the widget again using the method sendSharedWidget; omitted if the widget isn't shared
     */
    get id(): string | undefined {
        return this.raw.id;
    }
    /**
     * Optional. Width of the widget in logical pixels; omitted if the widget must occupy the whole width of the message bubble
     */
    get width(): number | undefined {
        return this.raw.width;
    }
    /**
     * Optional. Height of the widget in logical pixels; omitted if the height of the widget isn't fixed
     */
    get height(): number | undefined {
        return this.raw.height;
    }
    /**
     * HTML code of the widget
     */
    get html(): string {
        return this.raw.html;
    }
    /**
     * Optional. Public data of the widget, which is available wherever the widget is shown. All messages with a shared widget have the same public data.
     */
    get publicData(): string | undefined {
        return this.raw.public_data;
    }
    /**
     * Optional. Data of the widget, which is specific to the message
     */
    get chatData(): string | undefined {
        return this.raw.chat_data;
    }
    /**
     * true if `id` is set
     */
    hasId(): this is this & {
        id: string;
    } {
        return this.raw.id != null;
    }
    /**
     * true if `width` is set
     */
    hasWidth(): this is this & {
        width: number;
    } {
        return this.raw.width != null;
    }
    /**
     * true if `height` is set
     */
    hasHeight(): this is this & {
        height: number;
    } {
        return this.raw.height != null;
    }
    /**
     * true if `public_data` is set
     */
    hasPublicData(): this is this & {
        publicData: string;
    } {
        return this.raw.public_data != null;
    }
    /**
     * true if `chat_data` is set
     */
    hasChatData(): this is this & {
        chatData: string;
    } {
        return this.raw.chat_data != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("Widget", this, depth, options, inspect);
    }
}

/**
 * This object describes a TON wallet of the user, which is used in a query from a widget.
 */
export class WidgetQueryWallet {
    constructor(public raw: TelegramWidgetQueryWallet) { }
    static fromPayload(raw: TelegramWidgetQueryWallet): WidgetQueryWallet {
        return new WidgetQueryWallet(raw);
    }
    /**
     * Address of the wallet
     */
    get address(): string {
        return this.raw.address;
    }
    /**
     * Balance of the wallet, in the smallest units of the cryptocurrency, as a decimal number
     */
    get amount(): string {
        return this.raw.amount;
    }
    /**
     * Optional. Hex-encoded public key of the wallet; omitted if unknown
     */
    get publicKey(): string | undefined {
        return this.raw.public_key;
    }
    /**
     * Optional. Base64-encoded serialized StateInit of the wallet contract; omitted if and only if public_key is omitted
     */
    get stateInit(): string | undefined {
        return this.raw.state_init;
    }
    /**
     * true if `public_key` is set
     */
    hasPublicKey(): this is this & {
        publicKey: string;
    } {
        return this.raw.public_key != null;
    }
    /**
     * true if `state_init` is set
     */
    hasStateInit(): this is this & {
        stateInit: string;
    } {
        return this.raw.state_init != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("WidgetQueryWallet", this, depth, options, inspect);
    }
}

/**
 * This object represents a service message about a user allowing a bot to write messages after adding it to the attachment menu, launching a Web App from a link, or accepting an explicit request from a Web App sent by the method requestWriteAccess.
 */
export class WriteAccessAllowed {
    constructor(public raw: TelegramWriteAccessAllowed) { }
    static fromPayload(raw: TelegramWriteAccessAllowed): WriteAccessAllowed {
        return new WriteAccessAllowed(raw);
    }
    /**
     * Optional. True, if the access was granted after the user accepted an explicit request from a Web App sent by the method requestWriteAccess
     */
    get fromRequest(): boolean | undefined {
        return this.raw.from_request;
    }
    /**
     * Optional. Name of the Web App, if the access was granted when the Web App was launched from a link
     */
    get webAppName(): string | undefined {
        return this.raw.web_app_name;
    }
    /**
     * Optional. True, if the access was granted when the bot was added to the attachment or side menu
     */
    get fromAttachmentMenu(): boolean | undefined {
        return this.raw.from_attachment_menu;
    }
    /**
     * true if `from_request` is set
     */
    hasFromRequest(): this is this & {
        fromRequest: boolean;
    } {
        return this.raw.from_request != null;
    }
    /**
     * true if `web_app_name` is set
     */
    hasWebAppName(): this is this & {
        webAppName: string;
    } {
        return this.raw.web_app_name != null;
    }
    /**
     * true if `from_attachment_menu` is set
     */
    hasFromAttachmentMenu(): this is this & {
        fromAttachmentMenu: boolean;
    } {
        return this.raw.from_attachment_menu != null;
    }
    [INSPECT](depth: any, options: any, inspect: any) {
        return makeInspect("WriteAccessAllowed", this, depth, options, inspect);
    }
}