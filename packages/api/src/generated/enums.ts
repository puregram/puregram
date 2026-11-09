/// AUTO-GENERATED FILE — do not edit by hand
/// Bot API 10.4
/// source: https://core.telegram.org/bots/api
/// generated at: 2026-11-09T13:32:34.299Z
/// see scripts/emit.ts in @puregram/api

export enum AttachmentType {
    Animation = "animation",
    Audio = "audio",
    Contact = "contact",
    Document = "document",
    Location = "location",
    Photo = "photo",
    Poll = "poll",
    Sticker = "sticker",
    Story = "story",
    Venue = "venue",
    VideoNote = "video_note",
    Video = "video",
    Voice = "voice"
}

export enum ChatType {
    Private = "private",
    Group = "group",
    Supergroup = "supergroup",
    Channel = "channel"
}

export enum MessageEntityType {
    Mention = "mention",
    Hashtag = "hashtag",
    Cashtag = "cashtag",
    BotCommand = "bot_command",
    Url = "url",
    Email = "email",
    PhoneNumber = "phone_number",
    BankCardNumber = "bank_card_number",
    TonAddress = "ton_address",
    Bold = "bold",
    Italic = "italic",
    Underline = "underline",
    Strikethrough = "strikethrough",
    Spoiler = "spoiler",
    Blockquote = "blockquote",
    ExpandableBlockquote = "expandable_blockquote",
    Code = "code",
    Pre = "pre",
    TextLink = "text_link",
    TextMention = "text_mention",
    CustomEmoji = "custom_emoji",
    DateTime = "date_time"
}

export enum PollType {
    Regular = "regular",
    Quiz = "quiz"
}

export enum StickerType {
    Regular = "regular",
    Mask = "mask",
    CustomEmoji = "custom_emoji"
}

export enum ParseMode {
    Markdown = "Markdown",
    MarkdownV2 = "MarkdownV2",
    HTML = "HTML"
}

export enum ChatAction {
    Typing = "typing",
    UploadPhoto = "upload_photo",
    RecordVideo = "record_video",
    UploadVideo = "upload_video",
    RecordVoice = "record_voice",
    UploadVoice = "upload_voice",
    RecordVideoNote = "record_video_note",
    UploadVideoNote = "upload_video_note",
    UploadDocument = "upload_document",
    ChooseSticker = "choose_sticker",
    FindLocation = "find_location"
}

export enum ChatMemberStatus {
    Creator = "creator",
    Administrator = "administrator",
    Member = "member",
    Restricted = "restricted",
    Left = "left",
    Kicked = "kicked"
}

export enum BotCommandScopeType {
    Default = "default",
    AllPrivateChats = "all_private_chats",
    AllGroupChats = "all_group_chats",
    AllChatAdministrators = "all_chat_administrators",
    Chat = "chat",
    ChatAdministrators = "chat_administrators",
    ChatMember = "chat_member"
}

export enum DiceEmoji {
    Dice = "\uD83C\uDFB2",
    Dart = "\uD83C\uDFAF",
    Basketball = "\uD83C\uDFC0",
    Football = "\u26BD",
    SlotMachine = "\uD83C\uDFB0",
    Bowling = "\uD83C\uDFB3"
}