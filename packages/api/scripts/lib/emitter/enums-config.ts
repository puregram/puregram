export interface EnumSpec {
  exportName: string
  source:
    | { kind: 'object-field', object: string, field: string }
    | { kind: 'literal', values: string[] }
}

export const ENUMS: EnumSpec[] = [
  {
    exportName: 'AttachmentType',
    source: {
      kind: 'literal',
      values: [
        'animation', 'audio', 'contact', 'document', 'live_photo', 'location', 'photo', 'poll',
        'sticker', 'story', 'venue', 'video_note', 'video', 'voice'
      ]
    }
  },
  { exportName: 'ChatType', source: { kind: 'object-field', object: 'Chat', field: 'type' } },
  { exportName: 'MessageEntityType', source: { kind: 'object-field', object: 'MessageEntity', field: 'type' } },
  { exportName: 'PollType', source: { kind: 'object-field', object: 'Poll', field: 'type' } },
  { exportName: 'StickerFormat', source: { kind: 'object-field', object: 'Sticker', field: 'format' } },
  { exportName: 'StickerType', source: { kind: 'object-field', object: 'Sticker', field: 'type' } },
  { exportName: 'ParseMode', source: { kind: 'literal', values: ['Markdown', 'MarkdownV2', 'HTML'] } },
  {
    exportName: 'ChatAction',
    source: {
      kind: 'literal',
      values: [
        'typing', 'upload_photo', 'record_video', 'upload_video', 'record_voice',
        'upload_voice', 'record_video_note', 'upload_video_note', 'upload_document',
        'choose_sticker', 'find_location'
      ]
    }
  },
  {
    exportName: 'ChatMemberStatus',
    source: {
      kind: 'literal',
      values: [
        'creator', 'administrator', 'member', 'restricted', 'left', 'kicked'
      ]
    }
  },
  {
    exportName: 'BotCommandScopeType',
    source: {
      kind: 'literal',
      values: [
        'default', 'all_private_chats', 'all_group_chats', 'all_chat_administrators',
        'chat', 'chat_administrators', 'chat_member'
      ]
    }
  },
  { exportName: 'DiceEmoji', source: { kind: 'literal', values: ['🎲', '🎯', '🏀', '⚽', '🎰', '🎳'] } }
]
