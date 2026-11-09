import type { SchemaObject, SchemaTypeRef } from '../schema-types'

// objects that get wrapper classes — those reached through update payloads or method
// return values. keep alphabetical for clean diffs
export const WRAPPED_STRUCTURES = [
  'Animation',
  'AreaPosition',
  'Audio',
  'Chat',
  'ChatBoost',
  'ChatBoostRemoved',
  'ChatBoostSource',
  'ChatBoostUpdated',
  'ChatInviteLink',
  'ChatJoinRequest',
  'ChatLocation',
  'ChatMember',
  'ChatMemberUpdated',
  'ChatPermissions',
  'ChatPhoto',
  'ChatShared',
  'ChatShareThemeBackdrop',
  'ChatShareThemeBackdrops',
  'ChosenInlineResult',
  'Contact',
  'Dice',
  'Document',
  'ExternalReplyInfo',
  'File',
  'ForumTopicCreated',
  'ForumTopicEdited',
  'ForwardedMessage',
  'Game',
  'Giveaway',
  'GiveawayCompleted',
  'GiveawayWinners',
  'InlineKeyboardButton',
  'InlineKeyboardMarkup',
  'InlineQuery',
  'Invoice',
  'LinkPreviewOptions',
  'LivePhoto',
  'Location',
  'MaskPosition',
  'Message',
  'MessageEntity',
  'MessageId',
  'MessageOrigin',
  'MessageReactionCountUpdated',
  'MessageReactionUpdated',
  'OrderInfo',
  'PaidMessagesWaived',
  'PassportData',
  'PhotoSize',
  'Poll',
  'PollAnswer',
  'PollMedia',
  'PollOption',
  'PreCheckoutQuery',
  'ProximityAlertTriggered',
  'ReactionCount',
  'ShippingAddress',
  'ShippingQuery',
  'Sticker',
  'StickerSet',
  'Story',
  'SuccessfulPayment',
  'TextQuote',
  'TonNft',
  'TonNftAttribute',
  'TonWalletCard',
  'TonWalletCardSticker',
  'TonWalletTransfer',
  'User',
  'UserProfilePhotos',
  'UsersShared',
  'Venue',
  'Video',
  'VideoChatEnded',
  'VideoChatParticipantsInvited',
  'VideoChatScheduled',
  'VideoNote',
  'VideoQuality',
  'Voice',
  'WebAppData',
  'WebAppInfo',
  'Widget',
  'WidgetQueryWallet',
  'WriteAccessAllowed'
] as const

export type WrappedStructureName = typeof WRAPPED_STRUCTURES[number]

// union-kind structures that still get a wrapper class. most unions get none (MessageOrigin,
// ChatBoostSource, …), but ChatMember exposes status helpers (isAdmin/isCreator/isMember) and is
// reached through ChatMemberUpdated + getChatAdministrators, so it keeps a (fieldless) wrapper
export const UNION_WRAPPERS = new Set<string>(['ChatMember'])

export function isWrappedStructure (name: string) {
  return (WRAPPED_STRUCTURES as readonly string[]).includes(name)
}

// whether `name` gets a generated wrapper class: a wrapped object always does; a wrapped union
// only when it's a designated union wrapper
export function hasWrapperClass (name: string, kind: SchemaObject['kind'] | undefined) {
  if (!isWrappedStructure(name)) {
    return false
  }

  return kind === 'object' || (kind === 'union' && UNION_WRAPPERS.has(name))
}

// synthetic collection wrappers — `T[]` fields emit as a handcrafted wrapper class
// (e.g. `Photo` for `PhotoSize[]`). sources live in `packages/api/src/structures-handcrafted/`
export const ARRAY_WRAPPER_FOR: Record<string, string> = {
  PhotoSize: 'Photo',
  PollOption: 'PollOptions',
  ReactionCount: 'ReactionCounts',
  ReactionType: 'Reactions',
  VideoQuality: 'VideoQualities'
}

export const ARRAY_WRAPPER_NAMES = Object.values(ARRAY_WRAPPER_FOR)

/** if `ref` is `T[]` where `T` has a synthetic collection wrapper, return its name */
export function arrayWrapperFor (ref: SchemaTypeRef) {
  if (ref.kind !== 'array') {
    return undefined
  }

  if (ref.of.kind !== 'reference') {
    return undefined
  }

  return ARRAY_WRAPPER_FOR[ref.of.name]
}
