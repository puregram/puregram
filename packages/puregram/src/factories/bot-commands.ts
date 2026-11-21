import type {
  TelegramBotCommand,
  TelegramBotCommandScopeAllChatAdministrators,
  TelegramBotCommandScopeAllGroupChats,
  TelegramBotCommandScopeAllPrivateChats,
  TelegramBotCommandScopeChat,
  TelegramBotCommandScopeChatAdministrators,
  TelegramBotCommandScopeChatMember,
  TelegramBotCommandScopeDefault
} from '@puregram/api'

/** static factories for the `BotCommandScope` discriminated union */
class BotCommandScope {
  /** default scope — fallback for users without narrower scope match */
  static default (): TelegramBotCommandScopeDefault {
    return { type: 'default' }
  }

  /** all private chats */
  static allPrivateChats (): TelegramBotCommandScopeAllPrivateChats {
    return { type: 'all_private_chats' }
  }

  /** all group and supergroup chats */
  static allGroupChats (): TelegramBotCommandScopeAllGroupChats {
    return { type: 'all_group_chats' }
  }

  /** all admin members of all groups/supergroups */
  static allChatAdministrators (): TelegramBotCommandScopeAllChatAdministrators {
    return { type: 'all_chat_administrators' }
  }

  /** a specific chat */
  static chat (chatId: number | string): TelegramBotCommandScopeChat {
    return { type: 'chat', chat_id: chatId }
  }

  /** all admins of a specific chat */
  static chatAdministrators (chatId: number | string): TelegramBotCommandScopeChatAdministrators {
    return { type: 'chat_administrators', chat_id: chatId }
  }

  /** a specific member of a specific chat */
  static chatMember (chatId: number | string, userId: number): TelegramBotCommandScopeChatMember {
    return { type: 'chat_member', chat_id: chatId, user_id: userId }
  }
}

/**
 * static factories for `BotCommand` and the `BotCommandScope` family — used by
 * `setMyCommands`, `deleteMyCommands`, `getMyCommands`
 *
 * @example
 * ```ts
 * tg.api.setMyCommands({
 *   commands: [
 *     BotCommands.command('start', 'start the bot'),
 *     BotCommands.command('help',  'show help')
 *   ],
 *   scope: BotCommands.scope.allPrivateChats()
 * })
 * ```
 */
export class BotCommands {
  /** scope-builder namespace — use `BotCommands.scope.X(...)` */
  static scope = BotCommandScope

  /** single bot command entry */
  static command (command: string, description: string, options?: { isEphemeral?: boolean }): TelegramBotCommand {
    const isEphemeral = options?.isEphemeral

    return isEphemeral === undefined
      ? { command, description }
      : { command, description, is_ephemeral: isEphemeral }
  }
}
