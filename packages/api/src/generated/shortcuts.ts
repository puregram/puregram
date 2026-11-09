/// AUTO-GENERATED FILE — do not edit by hand
/// Bot API 10.4
/// source: https://core.telegram.org/bots/api
/// generated at: 2026-11-09T13:32:34.299Z
/// see scripts/emit.ts in @puregram/api

import type { TelegramInputFile, TelegramInputMediaAudio, TelegramInputMediaDocument, TelegramInputMediaLivePhoto, TelegramInputMediaPhoto, TelegramInputMediaVideo, TelegramInputPollOption, TelegramMessage, TelegramMessageId, TelegramReactionType } from "./types";
import type { BanChatMemberParams, CopyMessageParams, CopyMessagesParams, DeleteMessageParams, DeleteMessagesParams, ForwardMessageParams, ForwardMessagesParams, PinChatMessageParams, SendAnimationParams, SendAudioParams, SendChatActionParams, SendContactParams, SendDiceParams, SendDocumentParams, SendLivePhotoParams, SendLocationParams, SendMediaGroupParams, SendMessageParams, SendPhotoParams, SendPollParams, SendSharedWidgetParams, SendStickerParams, SendVenueParams, SendVideoNoteParams, SendVideoParams, SendVoiceParams, SetMessageReactionParams, UnbanChatMemberParams, UnpinChatMessageParams } from "./methods";
import type { WidgetInput, WidgetSendOptions } from "../widget-like";
import type { Formattable } from "../formattable";
export interface TelegramShortcuts {
    /**
     * Shortcut for `tg.api.sendMessage`. Use this method to send text messages. On success, the sent Message is returned.
     */
    send(chat: number | string, text: string | Formattable, params?: Omit<SendMessageParams, "chat_id" | "text">): Promise<TelegramMessage>;
    /**
     * Shortcut for `tg.api.sendPhoto`. Use this method to send photos. On success, the sent Message is returned.
     */
    sendPhoto(chat: number | string, photo: TelegramInputFile | string, params?: Omit<SendPhotoParams, "chat_id" | "photo">): Promise<TelegramMessage>;
    /**
     * Shortcut for `tg.api.sendAudio`. Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent Message is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
     * For sending voice messages, use the sendVoice method instead.
     */
    sendAudio(chat: number | string, audio: TelegramInputFile | string, params?: Omit<SendAudioParams, "chat_id" | "audio">): Promise<TelegramMessage>;
    /**
     * Shortcut for `tg.api.sendDocument`. Use this method to send general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
     */
    sendDocument(chat: number | string, document: TelegramInputFile | string, params?: Omit<SendDocumentParams, "chat_id" | "document">): Promise<TelegramMessage>;
    /**
     * Shortcut for `tg.api.sendVideo`. Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as Document). On success, the sent Message is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
     */
    sendVideo(chat: number | string, video: TelegramInputFile | string, params?: Omit<SendVideoParams, "chat_id" | "video">): Promise<TelegramMessage>;
    /**
     * Shortcut for `tg.api.sendAnimation`. Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent Message is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
     */
    sendAnimation(chat: number | string, animation: TelegramInputFile | string, params?: Omit<SendAnimationParams, "chat_id" | "animation">): Promise<TelegramMessage>;
    /**
     * Shortcut for `tg.api.sendVoice`. Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS, or in .MP3 format, or in .M4A format (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
     */
    sendVoice(chat: number | string, voice: TelegramInputFile | string, params?: Omit<SendVoiceParams, "chat_id" | "voice">): Promise<TelegramMessage>;
    /**
     * Shortcut for `tg.api.sendVideoNote`. Use this method to send a rounded square MPEG4 video of up to 1 minute long. On success, the sent Message is returned.
     */
    sendVideoNote(chat: number | string, videoNote: TelegramInputFile | string, params?: Omit<SendVideoNoteParams, "chat_id" | "video_note">): Promise<TelegramMessage>;
    /**
     * Shortcut for `tg.api.sendLivePhoto`. Use this method to send live photos. On success, the sent Message is returned.
     */
    sendLivePhoto(chat: number | string, livePhoto: TelegramInputFile | string, photo: TelegramInputFile | string, params?: Omit<SendLivePhotoParams, "chat_id" | "live_photo" | "photo">): Promise<TelegramMessage>;
    /**
     * Shortcut for `tg.api.sendSticker`. Use this method to send static .WEBP, animated .TGS, or video .WEBM stickers. On success, the sent Message is returned.
     */
    sendSticker(chat: number | string, sticker: TelegramInputFile | string, params?: Omit<SendStickerParams, "chat_id" | "sticker">): Promise<TelegramMessage>;
    /**
     * Shortcut for `tg.api.sendWidget`. Use this method to send a message with an HTML widget. Currently, in the production environment, widgets can be sent only to private chats, and sent widgets automatically have protected content and therefore can't be forwarded. On success, the sent Message is returned.
     */
    sendWidget<W extends WidgetInput>(chat: number | string, widget: W, params?: WidgetSendOptions<W>): Promise<TelegramMessage>;
    /**
     * Shortcut for `tg.api.sendSharedWidget`. Use this method to send again a shared widget created by the bot. Currently, in the production environment, widgets can be sent only to private chats, and sent widgets automatically have protected content and therefore can't be forwarded. On success, the sent Message is returned.
     */
    sendSharedWidget(chat: number | string, widgetId: string, params?: Omit<SendSharedWidgetParams, "chat_id" | "widget_id">): Promise<TelegramMessage>;
    /**
     * Shortcut for `tg.api.sendLocation`. Use this method to send point on the map. On success, the sent Message is returned.
     */
    sendLocation(chat: number | string, latitude: number, longitude: number, params?: Omit<SendLocationParams, "chat_id" | "latitude" | "longitude">): Promise<TelegramMessage>;
    /**
     * Shortcut for `tg.api.sendVenue`. Use this method to send information about a venue. On success, the sent Message is returned.
     */
    sendVenue(chat: number | string, latitude: number, longitude: number, title: string, address: string, params?: Omit<SendVenueParams, "chat_id" | "latitude" | "longitude" | "title" | "address">): Promise<TelegramMessage>;
    /**
     * Shortcut for `tg.api.sendContact`. Use this method to send phone contacts. On success, the sent Message is returned.
     */
    sendContact(chat: number | string, phoneNumber: string, firstName: string, params?: Omit<SendContactParams, "chat_id" | "phone_number" | "first_name">): Promise<TelegramMessage>;
    /**
     * Shortcut for `tg.api.sendDice`. Use this method to send an animated emoji that will display a random value. On success, the sent Message is returned.
     */
    sendDice(chat: number | string, params?: Omit<SendDiceParams, "chat_id">): Promise<TelegramMessage>;
    /**
     * Shortcut for `tg.api.sendChatAction`. Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns True on success.
     * We only recommend using this method when a response from the bot will take a noticeable amount of time to arrive.
     */
    sendChatAction(chat: number | string, action: string, params?: Omit<SendChatActionParams, "chat_id" | "action">): Promise<true>;
    /**
     * Shortcut for `tg.api.sendPoll`. Use this method to send a native poll. On success, the sent Message is returned.
     */
    sendPoll(chat: number | string, question: string | Formattable, options: TelegramInputPollOption[], params?: Omit<SendPollParams, "chat_id" | "question" | "options">): Promise<TelegramMessage>;
    /**
     * Shortcut for `tg.api.sendMediaGroup`. Use this method to send a group of photos, live photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an Array of Message objects that were sent is returned.
     */
    sendMediaGroup(chat: number | string, media: (TelegramInputMediaAudio | TelegramInputMediaDocument | TelegramInputMediaLivePhoto | TelegramInputMediaPhoto | TelegramInputMediaVideo)[], params?: Omit<SendMediaGroupParams, "chat_id" | "media">): Promise<TelegramMessage[]>;
    /**
     * Shortcut for `tg.api.forwardMessage`. Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent Message is returned.
     */
    forward(from: number | string, to: number | string, messageId: number, params?: Omit<ForwardMessageParams, "from_chat_id" | "chat_id" | "message_id">): Promise<TelegramMessage>;
    /**
     * Shortcut for `tg.api.forwardMessages`. Use this method to forward multiple messages of any kind. If some of the specified messages can't be found or forwarded, they are skipped. Service messages and messages with protected content can't be forwarded. Album grouping is kept for forwarded messages. On success, an Array of MessageId of the sent messages is returned.
     */
    forwardMany(from: number | string, to: number | string, messageIds: number[], params?: Omit<ForwardMessagesParams, "from_chat_id" | "chat_id" | "message_ids">): Promise<TelegramMessageId[]>;
    /**
     * Shortcut for `tg.api.copyMessage`. Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, invoice messages, and widget messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_ids is known to the bot. The method is analogous to the method forwardMessage, but the copied message doesn't have a link to the original message. Returns the MessageId of the sent message on success.
     */
    copy(from: number | string, to: number | string, messageId: number, params?: Omit<CopyMessageParams, "from_chat_id" | "chat_id" | "message_id">): Promise<TelegramMessageId>;
    /**
     * Shortcut for `tg.api.copyMessages`. Use this method to copy messages of any kind. If some of the specified messages can't be found or copied, they are skipped. Service messages, paid media messages, giveaway messages, giveaway winners messages, invoice messages, and widget messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_ids is known to the bot. The method is analogous to the method forwardMessages, but the copied messages don't have a link to the original message. Album grouping is kept for copied messages. On success, an Array of MessageId of the sent messages is returned.
     */
    copyMany(from: number | string, to: number | string, messageIds: number[], params?: Omit<CopyMessagesParams, "from_chat_id" | "chat_id" | "message_ids">): Promise<TelegramMessageId[]>;
    /**
     * Shortcut for `tg.api.deleteMessage`. Use this method to delete a message, including service messages, with the following limitations:- A message can only be deleted if it was sent less than 48 hours ago.- Service messages about a supergroup, channel, or forum topic creation can't be deleted.- A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.- Bots can delete outgoing messages in private chats, groups, and supergroups.- Bots can delete incoming messages in private chats.- Bots granted can_post_messages permissions can delete outgoing messages in channels.- If the bot is an administrator of a group, it can delete any message there.- If the bot has can_delete_messages administrator right in a supergroup or a channel, it can delete any message there.- If the bot has can_manage_direct_messages administrator right in a channel, it can delete any message in the corresponding direct messages chat.Returns True on success.
     */
    delete(chat: number | string, messageId: number, params?: Omit<DeleteMessageParams, "chat_id" | "message_id">): Promise<true>;
    /**
     * Shortcut for `tg.api.deleteMessages`. Use this method to delete multiple messages simultaneously. If some of the specified messages can't be found, they are skipped. Returns True on success.
     */
    deleteMany(chat: number | string, messageIds: number[], params?: Omit<DeleteMessagesParams, "chat_id" | "message_ids">): Promise<true>;
    /**
     * Shortcut for `tg.api.pinChatMessage`. Use this method to add a message to the list of pinned messages in a chat. In private chats and channel direct messages chats, all non-service messages can be pinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to pin messages in groups and channels respectively. Returns True on success.
     */
    pin(chat: number | string, messageId: number, params?: Omit<PinChatMessageParams, "chat_id" | "message_id">): Promise<true>;
    /**
     * Shortcut for `tg.api.unpinChatMessage`. Use this method to remove a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin messages in groups and channels respectively. Returns True on success.
     */
    unpin(chat: number | string, messageId: number, params?: Omit<UnpinChatMessageParams, "chat_id" | "message_id">): Promise<true>;
    /**
     * Shortcut for `tg.api.banChatMember`. Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     */
    kick(chat: number | string, user: number, params?: Omit<BanChatMemberParams, "chat_id" | "user_id">): Promise<true>;
    /**
     * Shortcut for `tg.api.banChatMember`. Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     */
    ban(chat: number | string, user: number, params?: Omit<BanChatMemberParams, "chat_id" | "user_id">): Promise<true>;
    /**
     * Shortcut for `tg.api.unbanChatMember`. Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be removed from the chat. If you don't want this, use the parameter only_if_banned. Returns True on success.
     */
    unban(chat: number | string, user: number, params?: Omit<UnbanChatMemberParams, "chat_id" | "user_id">): Promise<true>;
    /**
     * Shortcut for `tg.api.setMessageReaction`. Use this method to change the chosen reactions on a message. Service messages of some types can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can't use paid reactions. Returns True on success.
     */
    react(chat: number | string, messageId: number, reactions: TelegramReactionType[], params?: Omit<SetMessageReactionParams, "chat_id" | "message_id" | "reaction">): Promise<true>;
}