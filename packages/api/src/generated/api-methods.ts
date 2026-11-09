/// AUTO-GENERATED FILE — do not edit by hand
/// Bot API 10.4
/// source: https://core.telegram.org/bots/api
/// generated at: 2026-11-09T13:32:34.299Z
/// see scripts/emit.ts in @puregram/api

import * as api from "./methods";
export interface ApiMethods {
    /**
     * Use this method to add a new sticker to a set created by the bot. Emoji sticker sets can have up to 200 stickers. Other sticker sets can have up to 120 stickers. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#addstickertoset)
     */
    addStickerToSet: api.addStickerToSet;
    /**
     * Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#answercallbackquery)
     */
    answerCallbackQuery: api.answerCallbackQuery;
    /**
     * Use this method to process a received chat join request query. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#answerchatjoinrequestquery)
     */
    answerChatJoinRequestQuery: api.answerChatJoinRequestQuery;
    /**
     * Use this method to reply to a received guest message. On success, a SentGuestMessage object is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#answerguestquery)
     */
    answerGuestQuery: api.answerGuestQuery;
    /**
     * Use this method to send answers to an inline query. On success, True is returned.No more than 50 results per query are allowed.
     *
     * [bot api docs](https://core.telegram.org/bots/api#answerinlinequery)
     */
    answerInlineQuery: api.answerInlineQuery;
    /**
     * Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an Update with the field pre_checkout_query. Use this method to respond to such pre-checkout queries. On success, True is returned. Note: The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
     *
     * [bot api docs](https://core.telegram.org/bots/api#answerprecheckoutquery)
     */
    answerPreCheckoutQuery: api.answerPreCheckoutQuery;
    /**
     * If you sent an invoice requesting a shipping address and the parameter is_flexible was specified, the Bot API will send an Update with a shipping_query field to the bot. Use this method to reply to shipping queries. On success, True is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#answershippingquery)
     */
    answerShippingQuery: api.answerShippingQuery;
    /**
     * Use this method to set the result of an interaction with a Web App and send a corresponding message on behalf of the user to the chat from which the query originated. On success, a SentWebAppMessage object is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#answerwebappquery)
     */
    answerWebAppQuery: api.answerWebAppQuery;
    /**
     * Use this method to send an answer to a query from a widget. The query must be answered within 15 seconds. The answer is received only by the widget that sent the query and doesn't change data of the widget; use editMessageWidgetData or editSharedWidgetData to change it. On success, True is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#answerwidgetquery)
     */
    answerWidgetQuery: api.answerWidgetQuery;
    /**
     * Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#approvechatjoinrequest)
     */
    approveChatJoinRequest: api.approveChatJoinRequest;
    /**
     * Use this method to approve a suggested post in a direct messages chat. The bot must have the 'can_post_messages' administrator right in the corresponding channel chat. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#approvesuggestedpost)
     */
    approveSuggestedPost: api.approveSuggestedPost;
    /**
     * Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#banchatmember)
     */
    banChatMember: api.banChatMember;
    /**
     * Use this method to ban a channel chat in a supergroup or a channel. Until the chat is unbanned, the owner of the banned chat won't be able to send messages on behalf of any of their channels. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#banchatsenderchat)
     */
    banChatSenderChat: api.banChatSenderChat;
    /**
     * Use this method to close the bot instance before moving it from one local server to another. You need to delete the webhook before calling this method to ensure that the bot isn't launched again after server restart. The method will return error 429 in the first 10 minutes after the bot is launched. Returns True on success. Requires no parameters.
     *
     * [bot api docs](https://core.telegram.org/bots/api#close)
     */
    close: api.close;
    /**
     * Use this method to close an open topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#closeforumtopic)
     */
    closeForumTopic: api.closeForumTopic;
    /**
     * Use this method to close an open 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#closegeneralforumtopic)
     */
    closeGeneralForumTopic: api.closeGeneralForumTopic;
    /**
     * Converts a given regular gift to Telegram Stars. Requires the can_convert_gifts_to_stars business bot right. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#convertgifttostars)
     */
    convertGiftToStars: api.convertGiftToStars;
    /**
     * Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, invoice messages, and widget messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_ids is known to the bot. The method is analogous to the method forwardMessage, but the copied message doesn't have a link to the original message. Returns the MessageId of the sent message on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#copymessage)
     */
    copyMessage: api.copyMessage;
    /**
     * Use this method to copy messages of any kind. If some of the specified messages can't be found or copied, they are skipped. Service messages, paid media messages, giveaway messages, giveaway winners messages, invoice messages, and widget messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_ids is known to the bot. The method is analogous to the method forwardMessages, but the copied messages don't have a link to the original message. Album grouping is kept for copied messages. On success, an Array of MessageId of the sent messages is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#copymessages)
     */
    copyMessages: api.copyMessages;
    /**
     * Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method revokeChatInviteLink. Returns the new invite link as ChatInviteLink object.
     *
     * [bot api docs](https://core.telegram.org/bots/api#createchatinvitelink)
     */
    createChatInviteLink: api.createChatInviteLink;
    /**
     * Use this method to create a subscription invite link for a channel chat. The bot must have the can_invite_users administrator rights. The link can be edited using the method editChatSubscriptionInviteLink or revoked using the method revokeChatInviteLink. Returns the new invite link as a ChatInviteLink object.
     *
     * [bot api docs](https://core.telegram.org/bots/api#createchatsubscriptioninvitelink)
     */
    createChatSubscriptionInviteLink: api.createChatSubscriptionInviteLink;
    /**
     * Use this method to create a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator right. In the case of a private chat, a link to the topic can be created in the format https://t.me/<bot_username>/<message_thread_id>; the link opens the topic only for the user. Returns information about the created topic as a ForumTopic object.
     *
     * [bot api docs](https://core.telegram.org/bots/api#createforumtopic)
     */
    createForumTopic: api.createForumTopic;
    /**
     * Use this method to create a link for an invoice. Returns the created invoice link as String on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#createinvoicelink)
     */
    createInvoiceLink: api.createInvoiceLink;
    /**
     * Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#createnewstickerset)
     */
    createNewStickerSet: api.createNewStickerSet;
    /**
     * Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#declinechatjoinrequest)
     */
    declineChatJoinRequest: api.declineChatJoinRequest;
    /**
     * Use this method to decline a suggested post in a direct messages chat. The bot must have the 'can_manage_direct_messages' administrator right in the corresponding channel chat. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#declinesuggestedpost)
     */
    declineSuggestedPost: api.declineSuggestedPost;
    /**
     * Use this method to remove up to 10000 recent reactions in a group or a supergroup chat added by a given user or chat. The bot must have the 'can_delete_messages' administrator right in the chat. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#deleteallmessagereactions)
     */
    deleteAllMessageReactions: api.deleteAllMessageReactions;
    /**
     * Deletes a regular gift owned by a managed business account without receiving Telegram Stars for it. Requires the can_convert_gifts_to_stars business bot right. The gift can be deleted only if it isn't limited (the field total_count of the Gift is omitted) and wasn't refunded. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#deletebusinessaccountgift)
     */
    deleteBusinessAccountGift: api.deleteBusinessAccountGift;
    /**
     * Delete messages on behalf of a business account. Requires the can_delete_sent_messages business bot right to delete messages sent by the bot itself, or the can_delete_all_messages business bot right to delete any message. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#deletebusinessmessages)
     */
    deleteBusinessMessages: api.deleteBusinessMessages;
    /**
     * Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#deletechatphoto)
     */
    deleteChatPhoto: api.deleteChatPhoto;
    /**
     * Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#deletechatstickerset)
     */
    deleteChatStickerSet: api.deleteChatStickerSet;
    /**
     * Use this method to delete an ephemeral message. Note that it is not guaranteed that the user will receive the message deletion event, especially if they are offline. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#deleteephemeralmessage)
     */
    deleteEphemeralMessage: api.deleteEphemeralMessage;
    /**
     * Use this method to delete a forum topic along with all its messages in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_delete_messages administrator rights. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#deleteforumtopic)
     */
    deleteForumTopic: api.deleteForumTopic;
    /**
     * Use this method to delete a message, including service messages, with the following limitations:- A message can only be deleted if it was sent less than 48 hours ago.- Service messages about a supergroup, channel, or forum topic creation can't be deleted.- A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.- Bots can delete outgoing messages in private chats, groups, and supergroups.- Bots can delete incoming messages in private chats.- Bots granted can_post_messages permissions can delete outgoing messages in channels.- If the bot is an administrator of a group, it can delete any message there.- If the bot has can_delete_messages administrator right in a supergroup or a channel, it can delete any message there.- If the bot has can_manage_direct_messages administrator right in a channel, it can delete any message in the corresponding direct messages chat.Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#deletemessage)
     */
    deleteMessage: api.deleteMessage;
    /**
     * Use this method to remove a reaction from a message in a group or a supergroup chat. The bot must have the 'can_delete_messages' administrator right in the chat. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#deletemessagereaction)
     */
    deleteMessageReaction: api.deleteMessageReaction;
    /**
     * Use this method to delete multiple messages simultaneously. If some of the specified messages can't be found, they are skipped. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#deletemessages)
     */
    deleteMessages: api.deleteMessages;
    /**
     * Use this method to delete the list of the bot's commands for the given scope and user language. After deletion, higher level commands will be shown to affected users. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#deletemycommands)
     */
    deleteMyCommands: api.deleteMyCommands;
    /**
     * Use this method to delete a sticker from a set created by the bot. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#deletestickerfromset)
     */
    deleteStickerFromSet: api.deleteStickerFromSet;
    /**
     * Use this method to delete a sticker set that was created by the bot. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#deletestickerset)
     */
    deleteStickerSet: api.deleteStickerSet;
    /**
     * Deletes a story previously posted by the bot on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#deletestory)
     */
    deleteStory: api.deleteStory;
    /**
     * Use this method to remove webhook integration if you decide to switch back to getUpdates. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#deletewebhook)
     */
    deleteWebhook: api.deleteWebhook;
    /**
     * Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a ChatInviteLink object.
     *
     * [bot api docs](https://core.telegram.org/bots/api#editchatinvitelink)
     */
    editChatInviteLink: api.editChatInviteLink;
    /**
     * Use this method to edit a subscription invite link created by the bot. The bot must have the can_invite_users administrator rights. Returns the edited invite link as a ChatInviteLink object.
     *
     * [bot api docs](https://core.telegram.org/bots/api#editchatsubscriptioninvitelink)
     */
    editChatSubscriptionInviteLink: api.editChatSubscriptionInviteLink;
    /**
     * Use this method to edit the caption of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#editephemeralmessagecaption)
     */
    editEphemeralMessageCaption: api.editEphemeralMessageCaption;
    /**
     * Use this method to edit the media of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#editephemeralmessagemedia)
     */
    editEphemeralMessageMedia: api.editEphemeralMessageMedia;
    /**
     * Use this method to edit only the reply markup of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#editephemeralmessagereplymarkup)
     */
    editEphemeralMessageReplyMarkup: api.editEphemeralMessageReplyMarkup;
    /**
     * Use this method to edit an ephemeral text or rich message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#editephemeralmessagetext)
     */
    editEphemeralMessageText: api.editEphemeralMessageText;
    /**
     * Use this method to edit name and icon of a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#editforumtopic)
     */
    editForumTopic: api.editForumTopic;
    /**
     * Use this method to edit the name of the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#editgeneralforumtopic)
     */
    editGeneralForumTopic: api.editGeneralForumTopic;
    /**
     * Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * [bot api docs](https://core.telegram.org/bots/api#editmessagecaption)
     */
    editMessageCaption: api.editMessageCaption;
    /**
     * Use this method to edit a checklist on behalf of a connected business account. On success, the edited Message is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#editmessagechecklist)
     */
    editMessageChecklist: api.editMessageChecklist;
    /**
     * Use this method to edit live location messages. A location can be edited until its live_period expires or editing is explicitly disabled by a call to stopMessageLiveLocation. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#editmessagelivelocation)
     */
    editMessageLiveLocation: api.editMessageLiveLocation;
    /**
     * Use this method to edit animation, audio, document, live photo, photo, or video messages, or to replace a text or a rich message with a media. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo, a live photo, or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * [bot api docs](https://core.telegram.org/bots/api#editmessagemedia)
     */
    editMessageMedia: api.editMessageMedia;
    /**
     * Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * [bot api docs](https://core.telegram.org/bots/api#editmessagereplymarkup)
     */
    editMessageReplyMarkup: api.editMessageReplyMarkup;
    /**
     * Use this method to edit text, rich and game messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * [bot api docs](https://core.telegram.org/bots/api#editmessagetext)
     */
    editMessageText: api.editMessageText;
    /**
     * Use this method to edit data of a widget in a message sent by the bot or via the bot (for inline bots). Public data of a shared widget can be changed at most once per second. On success, True is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#editmessagewidgetdata)
     */
    editMessageWidgetData: api.editMessageWidgetData;
    /**
     * Use this method to edit public data of a shared widget created by the bot. A shared widget can be edited at most once per second. On success, True is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#editsharedwidgetdata)
     */
    editSharedWidgetData: api.editSharedWidgetData;
    /**
     * Edits a story previously posted by the bot on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns Story on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#editstory)
     */
    editStory: api.editStory;
    /**
     * Allows the bot to cancel or re-enable extension of a subscription paid in Telegram Stars. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#edituserstarsubscription)
     */
    editUserStarSubscription: api.editUserStarSubscription;
    /**
     * Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as String on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#exportchatinvitelink)
     */
    exportChatInviteLink: api.exportChatInviteLink;
    /**
     * Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent Message is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#forwardmessage)
     */
    forwardMessage: api.forwardMessage;
    /**
     * Use this method to forward multiple messages of any kind. If some of the specified messages can't be found or forwarded, they are skipped. Service messages and messages with protected content can't be forwarded. Album grouping is kept for forwarded messages. On success, an Array of MessageId of the sent messages is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#forwardmessages)
     */
    forwardMessages: api.forwardMessages;
    /**
     * Returns the list of gifts that can be sent by the bot to users and channel chats. Requires no parameters. Returns a Gifts object.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getavailablegifts)
     */
    getAvailableGifts: api.getAvailableGifts;
    /**
     * Returns the gifts received and owned by a managed business account. Requires the can_view_gifts_and_stars business bot right. Returns OwnedGifts on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getbusinessaccountgifts)
     */
    getBusinessAccountGifts: api.getBusinessAccountGifts;
    /**
     * Returns the amount of Telegram Stars owned by a managed business account. Requires the can_view_gifts_and_stars business bot right. Returns StarAmount on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getbusinessaccountstarbalance)
     */
    getBusinessAccountStarBalance: api.getBusinessAccountStarBalance;
    /**
     * Use this method to get information about the connection of the bot with a business account. Returns a BusinessConnection object on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getbusinessconnection)
     */
    getBusinessConnection: api.getBusinessConnection;
    /**
     * Use this method to get up-to-date information about the chat. Returns a ChatFullInfo object on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getchat)
     */
    getChat: api.getChat;
    /**
     * Use this method to get a list of administrators in a chat. Returns an Array of ChatMember objects.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getchatadministrators)
     */
    getChatAdministrators: api.getChatAdministrators;
    /**
     * Returns the gifts owned by a chat. Returns OwnedGifts on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getchatgifts)
     */
    getChatGifts: api.getChatGifts;
    /**
     * Use this method to get information about a member of a chat. The method is only guaranteed to work for other users if the bot is an administrator in the chat. Returns a ChatMember object on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getchatmember)
     */
    getChatMember: api.getChatMember;
    /**
     * Use this method to get the number of members in a chat. Returns Integer on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getchatmembercount)
     */
    getChatMemberCount: api.getChatMemberCount;
    /**
     * Use this method to get the current value of the bot's menu button in a private chat, or the default menu button. Returns MenuButton on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getchatmenubutton)
     */
    getChatMenuButton: api.getChatMenuButton;
    /**
     * Use this method to get the list of backdrops, which can be used as the background of a theme of the screen for sharing a link to a user or a chat. Requires no parameters. Returns a ChatShareThemeBackdrops object.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getchatsharethemebackdrops)
     */
    getChatShareThemeBackdrops: api.getChatShareThemeBackdrops;
    /**
     * Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of Sticker objects.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getcustomemojistickers)
     */
    getCustomEmojiStickers: api.getCustomEmojiStickers;
    /**
     * Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a File object is returned. The file can then be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>, where <file_path> is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getfile)
     */
    getFile: api.getFile;
    /**
     * Use this method to get custom emoji stickers, which can be used as a forum topic icon by any user. Requires no parameters. Returns an Array of Sticker objects.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getforumtopiciconstickers)
     */
    getForumTopicIconStickers: api.getForumTopicIconStickers;
    /**
     * Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. Returns an Array of GameHighScore objects.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getgamehighscores)
     */
    getGameHighScores: api.getGameHighScores;
    /**
     * Use this method to get the access settings of a managed bot. Returns a BotAccessSettings object on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getmanagedbotaccesssettings)
     */
    getManagedBotAccessSettings: api.getManagedBotAccessSettings;
    /**
     * Use this method to get the token of a managed bot. Returns the token as String on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getmanagedbottoken)
     */
    getManagedBotToken: api.getManagedBotToken;
    /**
     * A simple method for testing your bot's authentication token. Requires no parameters. Returns basic information about the bot in form of a User object.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getme)
     */
    getMe: api.getMe;
    /**
     * Use this method to get the current list of the bot's commands for the given scope and user language. Returns an Array of BotCommand objects. If commands aren't set, an empty list is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getmycommands)
     */
    getMyCommands: api.getMyCommands;
    /**
     * Use this method to get the current default administrator rights of the bot. Returns ChatAdministratorRights on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getmydefaultadministratorrights)
     */
    getMyDefaultAdministratorRights: api.getMyDefaultAdministratorRights;
    /**
     * Use this method to get the current bot description for the given user language. Returns BotDescription on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getmydescription)
     */
    getMyDescription: api.getMyDescription;
    /**
     * Use this method to get the current bot name for the given user language. Returns BotName on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getmyname)
     */
    getMyName: api.getMyName;
    /**
     * Use this method to get the current bot short description for the given user language. Returns BotShortDescription on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getmyshortdescription)
     */
    getMyShortDescription: api.getMyShortDescription;
    /**
     * A method to get the current Telegram Stars balance of the bot. Requires no parameters. On success, returns a StarAmount object.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getmystarbalance)
     */
    getMyStarBalance: api.getMyStarBalance;
    /**
     * Returns the bot's Telegram Star transactions in chronological order. On success, returns a StarTransactions object.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getstartransactions)
     */
    getStarTransactions: api.getStarTransactions;
    /**
     * Use this method to get a sticker set. On success, a StickerSet object is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getstickerset)
     */
    getStickerSet: api.getStickerSet;
    /**
     * Use this method to get information about a unique gift by its name. Returns a UniqueGift object on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getuniquegift)
     */
    getUniqueGift: api.getUniqueGift;
    /**
     * Use this method to receive incoming updates using long polling (wiki). Returns an Array of Update objects.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getupdates)
     */
    getUpdates: api.getUpdates;
    /**
     * Use this method to get the list of boosts added to a chat by a user. Requires administrator rights in the chat. Returns a UserChatBoosts object.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getuserchatboosts)
     */
    getUserChatBoosts: api.getUserChatBoosts;
    /**
     * Returns the gifts owned and hosted by a user. Returns OwnedGifts on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getusergifts)
     */
    getUserGifts: api.getUserGifts;
    /**
     * Use this method to get the last messages from the personal chat (i.e., the chat currently added to their profile) of a given user. On success, an Array of Message objects is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getuserpersonalchatmessages)
     */
    getUserPersonalChatMessages: api.getUserPersonalChatMessages;
    /**
     * Use this method to get a list of profile audios for a user. Returns a UserProfileAudios object.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getuserprofileaudios)
     */
    getUserProfileAudios: api.getUserProfileAudios;
    /**
     * Use this method to get a list of profile pictures for a user. Returns a UserProfilePhotos object.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getuserprofilephotos)
     */
    getUserProfilePhotos: api.getUserProfilePhotos;
    /**
     * Use this method to get current webhook status. Requires no parameters. On success, returns a WebhookInfo object. If the bot is using getUpdates, will return an object with the url field empty.
     *
     * [bot api docs](https://core.telegram.org/bots/api#getwebhookinfo)
     */
    getWebhookInfo: api.getWebhookInfo;
    /**
     * Gifts a Telegram Premium subscription to the given user. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#giftpremiumsubscription)
     */
    giftPremiumSubscription: api.giftPremiumSubscription;
    /**
     * Use this method to hide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically closed if it was open. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#hidegeneralforumtopic)
     */
    hideGeneralForumTopic: api.hideGeneralForumTopic;
    /**
     * Use this method for your bot to leave a group, supergroup or channel. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#leavechat)
     */
    leaveChat: api.leaveChat;
    /**
     * Use this method to log out from the cloud Bot API server before launching the bot locally. You must log out the bot before running it locally, otherwise there is no guarantee that the bot will receive updates. After a successful call, you can immediately log in on a local server, but will not be able to log in back to the cloud Bot API server for 10 minutes. Returns True on success. Requires no parameters.
     *
     * [bot api docs](https://core.telegram.org/bots/api#logout)
     */
    logOut: api.logOut;
    /**
     * Use this method to add a message to the list of pinned messages in a chat. In private chats and channel direct messages chats, all non-service messages can be pinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to pin messages in groups and channels respectively. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#pinchatmessage)
     */
    pinChatMessage: api.pinChatMessage;
    /**
     * Posts a story on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns Story on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#poststory)
     */
    postStory: api.postStory;
    /**
     * Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass False for all boolean parameters to demote a user. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#promotechatmember)
     */
    promoteChatMember: api.promoteChatMember;
    /**
     * Marks incoming message as read on behalf of a business account. Requires the can_read_messages business bot right. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#readbusinessmessage)
     */
    readBusinessMessage: api.readBusinessMessage;
    /**
     * Refunds a successful payment in Telegram Stars. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#refundstarpayment)
     */
    refundStarPayment: api.refundStarPayment;
    /**
     * Removes the current profile photo of a managed business account. Requires the can_edit_profile_photo business bot right. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#removebusinessaccountprofilephoto)
     */
    removeBusinessAccountProfilePhoto: api.removeBusinessAccountProfilePhoto;
    /**
     * Removes verification from a chat that is currently verified on behalf of the organization represented by the bot. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#removechatverification)
     */
    removeChatVerification: api.removeChatVerification;
    /**
     * Removes the profile photo of the bot. Requires no parameters. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#removemyprofilephoto)
     */
    removeMyProfilePhoto: api.removeMyProfilePhoto;
    /**
     * Removes verification from a user who is currently verified on behalf of the organization represented by the bot. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#removeuserverification)
     */
    removeUserVerification: api.removeUserVerification;
    /**
     * Use this method to reopen a closed topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#reopenforumtopic)
     */
    reopenForumTopic: api.reopenForumTopic;
    /**
     * Use this method to reopen a closed 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically unhidden if it was hidden. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#reopengeneralforumtopic)
     */
    reopenGeneralForumTopic: api.reopenGeneralForumTopic;
    /**
     * Use this method to revoke the current token of a managed bot and generate a new one. Returns the new token as String on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#replacemanagedbottoken)
     */
    replaceManagedBotToken: api.replaceManagedBotToken;
    /**
     * Use this method to replace an existing sticker in a sticker set with a new one. The method is equivalent to calling deleteStickerFromSet, then addStickerToSet, then setStickerPositionInSet. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#replacestickerinset)
     */
    replaceStickerInSet: api.replaceStickerInSet;
    /**
     * Reposts a story on behalf of a business account from another business account. Both business accounts must be managed by the same bot, and the story on the source account must have been posted (or reposted) by the bot. Requires the can_manage_stories business bot right for both business accounts. Returns Story on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#repoststory)
     */
    repostStory: api.repostStory;
    /**
     * Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass True for all permissions to lift restrictions from a user. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#restrictchatmember)
     */
    restrictChatMember: api.restrictChatMember;
    /**
     * Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as ChatInviteLink object.
     *
     * [bot api docs](https://core.telegram.org/bots/api#revokechatinvitelink)
     */
    revokeChatInviteLink: api.revokeChatInviteLink;
    /**
     * Stores a message that can be sent by a user of a Mini App. Returns a PreparedInlineMessage object.
     *
     * [bot api docs](https://core.telegram.org/bots/api#savepreparedinlinemessage)
     */
    savePreparedInlineMessage: api.savePreparedInlineMessage;
    /**
     * Stores a keyboard button that can be used by a user within a Mini App. Returns a PreparedKeyboardButton object.
     *
     * [bot api docs](https://core.telegram.org/bots/api#savepreparedkeyboardbutton)
     */
    savePreparedKeyboardButton: api.savePreparedKeyboardButton;
    /**
     * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent Message is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendanimation)
     */
    sendAnimation: api.sendAnimation;
    /**
     * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent Message is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
     * For sending voice messages, use the sendVoice method instead.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendaudio)
     */
    sendAudio: api.sendAudio;
    /**
     * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns True on success.
     * We only recommend using this method when a response from the bot will take a noticeable amount of time to arrive.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendchataction)
     */
    sendChatAction: api.sendChatAction;
    /**
     * Use this method to process a received chat join request query by showing a Mini App to the user before deciding the outcome. Call answerChatJoinRequestQuery to resolve the join request query based on the user interaction with the Mini App. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendchatjoinrequestwebapp)
     */
    sendChatJoinRequestWebApp: api.sendChatJoinRequestWebApp;
    /**
     * Use this method to send a checklist on behalf of a connected business account. On success, the sent Message is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendchecklist)
     */
    sendChecklist: api.sendChecklist;
    /**
     * Use this method to send phone contacts. On success, the sent Message is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendcontact)
     */
    sendContact: api.sendContact;
    /**
     * Use this method to send an animated emoji that will display a random value. On success, the sent Message is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#senddice)
     */
    sendDice: api.sendDice;
    /**
     * Use this method to send general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
     *
     * [bot api docs](https://core.telegram.org/bots/api#senddocument)
     */
    sendDocument: api.sendDocument;
    /**
     * Use this method to send a game. On success, the sent Message is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendgame)
     */
    sendGame: api.sendGame;
    /**
     * Sends a gift to the given user or channel chat. The gift can't be converted to Telegram Stars by the receiver. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendgift)
     */
    sendGift: api.sendGift;
    /**
     * Use this method to send invoices. On success, the sent Message is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendinvoice)
     */
    sendInvoice: api.sendInvoice;
    /**
     * Use this method to send live photos. On success, the sent Message is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendlivephoto)
     */
    sendLivePhoto: api.sendLivePhoto;
    /**
     * Use this method to send point on the map. On success, the sent Message is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendlocation)
     */
    sendLocation: api.sendLocation;
    /**
     * Use this method to send a group of photos, live photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an Array of Message objects that were sent is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendmediagroup)
     */
    sendMediaGroup: api.sendMediaGroup;
    /**
     * Use this method to send text messages. On success, the sent Message is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendmessage)
     */
    sendMessage: api.sendMessage;
    /**
     * Use this method to stream a partial message to a user while the message is being generated. Note that the streamed draft is ephemeral and acts as a temporary 30-second preview - once the output is finalized, you must call sendMessage with the complete message to persist it in the user's chat. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendmessagedraft)
     */
    sendMessageDraft: api.sendMessageDraft;
    /**
     * Use this method to send paid media. On success, the sent Message is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendpaidmedia)
     */
    sendPaidMedia: api.sendPaidMedia;
    /**
     * Use this method to send photos. On success, the sent Message is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendphoto)
     */
    sendPhoto: api.sendPhoto;
    /**
     * Use this method to send a native poll. On success, the sent Message is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendpoll)
     */
    sendPoll: api.sendPoll;
    /**
     * Use this method to send rich messages. If the message contains a block with a media element, then the bot must have the right to send the media to the chat. On success, the sent Message is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendrichmessage)
     */
    sendRichMessage: api.sendRichMessage;
    /**
     * Use this method to stream a partial rich message to a user while the message is being generated. Note that the streamed draft is ephemeral and acts as a temporary 30-second preview - once the output is finalized, you must call sendRichMessage with the complete message to persist it in the user's chat. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendrichmessagedraft)
     */
    sendRichMessageDraft: api.sendRichMessageDraft;
    /**
     * Use this method to send again a shared widget created by the bot. Currently, in the production environment, widgets can be sent only to private chats, and sent widgets automatically have protected content and therefore can't be forwarded. On success, the sent Message is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendsharedwidget)
     */
    sendSharedWidget: api.sendSharedWidget;
    /**
     * Use this method to send static .WEBP, animated .TGS, or video .WEBM stickers. On success, the sent Message is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendsticker)
     */
    sendSticker: api.sendSticker;
    /**
     * Use this method to send information about a venue. On success, the sent Message is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendvenue)
     */
    sendVenue: api.sendVenue;
    /**
     * Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as Document). On success, the sent Message is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendvideo)
     */
    sendVideo: api.sendVideo;
    /**
     * Use this method to send a rounded square MPEG4 video of up to 1 minute long. On success, the sent Message is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendvideonote)
     */
    sendVideoNote: api.sendVideoNote;
    /**
     * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS, or in .MP3 format, or in .M4A format (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendvoice)
     */
    sendVoice: api.sendVoice;
    /**
     * Use this method to send a message with an HTML widget. Currently, in the production environment, widgets can be sent only to private chats, and sent widgets automatically have protected content and therefore can't be forwarded. On success, the sent Message is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#sendwidget)
     */
    sendWidget: api.sendWidget;
    /**
     * Changes the bio of a managed business account. Requires the can_change_bio business bot right. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setbusinessaccountbio)
     */
    setBusinessAccountBio: api.setBusinessAccountBio;
    /**
     * Changes the privacy settings pertaining to incoming gifts in a managed business account. Requires the can_change_gift_settings business bot right. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setbusinessaccountgiftsettings)
     */
    setBusinessAccountGiftSettings: api.setBusinessAccountGiftSettings;
    /**
     * Changes the first and last name of a managed business account. Requires the can_change_name business bot right. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setbusinessaccountname)
     */
    setBusinessAccountName: api.setBusinessAccountName;
    /**
     * Changes the profile photo of a managed business account. Requires the can_edit_profile_photo business bot right. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setbusinessaccountprofilephoto)
     */
    setBusinessAccountProfilePhoto: api.setBusinessAccountProfilePhoto;
    /**
     * Changes the username of a managed business account. Requires the can_change_username business bot right. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setbusinessaccountusername)
     */
    setBusinessAccountUsername: api.setBusinessAccountUsername;
    /**
     * Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setchatadministratorcustomtitle)
     */
    setChatAdministratorCustomTitle: api.setChatAdministratorCustomTitle;
    /**
     * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setchatdescription)
     */
    setChatDescription: api.setChatDescription;
    /**
     * Use this method to set a tag for a regular member in a group or a supergroup. The bot must be an administrator in the chat for this to work and must have the can_manage_tags administrator right. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setchatmembertag)
     */
    setChatMemberTag: api.setChatMemberTag;
    /**
     * Use this method to change the bot's menu button in a private chat, or the default menu button. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setchatmenubutton)
     */
    setChatMenuButton: api.setChatMenuButton;
    /**
     * Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members administrator rights. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setchatpermissions)
     */
    setChatPermissions: api.setChatPermissions;
    /**
     * Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setchatphoto)
     */
    setChatPhoto: api.setChatPhoto;
    /**
     * Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setchatstickerset)
     */
    setChatStickerSet: api.setChatStickerSet;
    /**
     * Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setchattitle)
     */
    setChatTitle: api.setChatTitle;
    /**
     * Use this method to set the thumbnail of a custom emoji sticker set. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setcustomemojistickersetthumbnail)
     */
    setCustomEmojiStickerSetThumbnail: api.setCustomEmojiStickerSetThumbnail;
    /**
     * Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the Message is returned, otherwise True is returned. Returns an error, if the new score is not greater than the user's current score in the chat and force is False.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setgamescore)
     */
    setGameScore: api.setGameScore;
    /**
     * Use this method to change the access settings of a managed bot. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setmanagedbotaccesssettings)
     */
    setManagedBotAccessSettings: api.setManagedBotAccessSettings;
    /**
     * Use this method to change the chosen reactions on a message. Service messages of some types can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can't use paid reactions. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setmessagereaction)
     */
    setMessageReaction: api.setMessageReaction;
    /**
     * Use this method to change the list of the bot's commands. See this manual for more details about bot commands. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setmycommands)
     */
    setMyCommands: api.setMyCommands;
    /**
     * Use this method to change the default administrator rights requested by the bot when it's added as an administrator to groups or channels. These rights will be suggested to users, but they are free to modify the list before adding the bot. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setmydefaultadministratorrights)
     */
    setMyDefaultAdministratorRights: api.setMyDefaultAdministratorRights;
    /**
     * Use this method to change the bot's description, which is shown in the chat with the bot if the chat is empty. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setmydescription)
     */
    setMyDescription: api.setMyDescription;
    /**
     * Use this method to change the bot's name. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setmyname)
     */
    setMyName: api.setMyName;
    /**
     * Changes the profile photo of the bot. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setmyprofilephoto)
     */
    setMyProfilePhoto: api.setMyProfilePhoto;
    /**
     * Use this method to change the bot's short description, which is shown on the bot's profile page and is sent together with the link when users share the bot. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setmyshortdescription)
     */
    setMyShortDescription: api.setMyShortDescription;
    /**
     * Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns True on success.
     * Use this if the data submitted by the user doesn't satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setpassportdataerrors)
     */
    setPassportDataErrors: api.setPassportDataErrors;
    /**
     * Use this method to change the list of emoji assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setstickeremojilist)
     */
    setStickerEmojiList: api.setStickerEmojiList;
    /**
     * Use this method to change search keywords assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setstickerkeywords)
     */
    setStickerKeywords: api.setStickerKeywords;
    /**
     * Use this method to change the mask position of a mask sticker. The sticker must belong to a sticker set that was created by the bot. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setstickermaskposition)
     */
    setStickerMaskPosition: api.setStickerMaskPosition;
    /**
     * Use this method to move a sticker in a set created by the bot to a specific position. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setstickerpositioninset)
     */
    setStickerPositionInSet: api.setStickerPositionInSet;
    /**
     * Use this method to set the thumbnail of a regular or mask sticker set. The format of the thumbnail file must match the format of the stickers in the set. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setstickersetthumbnail)
     */
    setStickerSetThumbnail: api.setStickerSetThumbnail;
    /**
     * Use this method to set the title of a created sticker set. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setstickersettitle)
     */
    setStickerSetTitle: api.setStickerSetTitle;
    /**
     * Changes the emoji status for a given user that previously allowed the bot to manage their emoji status via the Mini App method requestEmojiStatusAccess. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setuseremojistatus)
     */
    setUserEmojiStatus: api.setUserEmojiStatus;
    /**
     * Use this method to specify a URL and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified URL, containing a JSON-serialized Update. In case of an unsuccessful request (a request with response HTTP status code different from 2XY), we will repeat the request and give up after a reasonable amount of attempts. Returns True on success.
     * If you'd like to make sure that the webhook was set by you, you can specify secret data in the parameter secret_token. If specified, the request will contain a header “X-Telegram-Bot-Api-Secret-Token” with the secret token as content.
     *
     * [bot api docs](https://core.telegram.org/bots/api#setwebhook)
     */
    setWebhook: api.setWebhook;
    /**
     * Use this method to stop updating a live location message before live_period expires. On success, if the message is not an inline message, the edited Message is returned, otherwise True is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#stopmessagelivelocation)
     */
    stopMessageLiveLocation: api.stopMessageLiveLocation;
    /**
     * Use this method to stop a poll which was sent by the bot. On success, the stopped Poll is returned.
     *
     * [bot api docs](https://core.telegram.org/bots/api#stoppoll)
     */
    stopPoll: api.stopPoll;
    /**
     * Transfers Telegram Stars from the business account balance to the bot's balance. Requires the can_transfer_stars business bot right. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#transferbusinessaccountstars)
     */
    transferBusinessAccountStars: api.transferBusinessAccountStars;
    /**
     * Transfers an owned unique gift to another user. Requires the can_transfer_and_upgrade_gifts business bot right. Requires can_transfer_stars business bot right if the transfer is paid. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#transfergift)
     */
    transferGift: api.transferGift;
    /**
     * Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be removed from the chat. If you don't want this, use the parameter only_if_banned. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#unbanchatmember)
     */
    unbanChatMember: api.unbanChatMember;
    /**
     * Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#unbanchatsenderchat)
     */
    unbanChatSenderChat: api.unbanChatSenderChat;
    /**
     * Use this method to unhide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#unhidegeneralforumtopic)
     */
    unhideGeneralForumTopic: api.unhideGeneralForumTopic;
    /**
     * Use this method to clear the list of pinned messages in a chat. In private chats and channel direct messages chats, no additional rights are required to unpin all pinned messages. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin all pinned messages in groups and channels respectively. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#unpinallchatmessages)
     */
    unpinAllChatMessages: api.unpinAllChatMessages;
    /**
     * Use this method to clear the list of pinned messages in a forum topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#unpinallforumtopicmessages)
     */
    unpinAllForumTopicMessages: api.unpinAllForumTopicMessages;
    /**
     * Use this method to clear the list of pinned messages in a General forum topic. The bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#unpinallgeneralforumtopicmessages)
     */
    unpinAllGeneralForumTopicMessages: api.unpinAllGeneralForumTopicMessages;
    /**
     * Use this method to remove a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin messages in groups and channels respectively. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#unpinchatmessage)
     */
    unpinChatMessage: api.unpinChatMessage;
    /**
     * Upgrades a given regular gift to a unique gift. Requires the can_transfer_and_upgrade_gifts business bot right. Additionally requires the can_transfer_stars business bot right if the upgrade is paid. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#upgradegift)
     */
    upgradeGift: api.upgradeGift;
    /**
     * Use this method to upload a file with a sticker for later use in the createNewStickerSet, addStickerToSet, or replaceStickerInSet methods (the file can be used multiple times). Returns the uploaded File on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#uploadstickerfile)
     */
    uploadStickerFile: api.uploadStickerFile;
    /**
     * Verifies a chat on behalf of the organization which is represented by the bot. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#verifychat)
     */
    verifyChat: api.verifyChat;
    /**
     * Verifies a user on behalf of the organization which is represented by the bot. Returns True on success.
     *
     * [bot api docs](https://core.telegram.org/bots/api#verifyuser)
     */
    verifyUser: api.verifyUser;
}