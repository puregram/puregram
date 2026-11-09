/** telegram chat admin right identifier — see https://core.telegram.org/api/links */
export type AdminRight =
  | 'change_info'
  | 'post_messages'
  | 'edit_messages'
  | 'delete_messages'
  | 'restrict_members'
  | 'invite_users'
  | 'pin_messages'
  | 'manage_topics'
  | 'promote_members'
  | 'manage_video_chats'
  | 'anonymous'
  | 'manage_chat'
  | 'post_stories'
  | 'edit_stories'
  | 'delete_stories'
  | 'manage_direct_messages'

/** mini-app launch mode for `startapp` links */
export type WebAppMode = 'compact' | 'fullscreen'

/** filter target types for `startattach&choose=` */
export type AttachChooseTarget = 'users' | 'bots' | 'groups' | 'channels'

/** target chat for an attachment-menu link opened in a third-party chat */
export type AttachChatTarget = { username: string } | { phone: string }

/** options for {@link deepLink.start} */
export interface StartOpts {
  /** bot username, without leading `@` */
  bot: string
  /** start payload — 1-64 chars from `[A-Za-z0-9_-]`. omit for a bare `https://t.me/<bot>` link */
  payload?: string
}

export interface TopicOpts {
  bot: string
  messageThreadId: number
}

/** options for {@link deepLink.startGroup} */
export interface StartGroupOpts {
  bot: string
  /** optional start payload — 1-64 chars from `[A-Za-z0-9_-]` */
  payload?: string
  /** admin rights to request when the bot is added to the group */
  admin?: AdminRight[]
}

/** options for {@link deepLink.startChannel} */
export interface StartChannelOpts {
  bot: string
  /** admin rights to request — required for channels, must be non-empty */
  admin: AdminRight[]
}

/** options for {@link deepLink.startApp} */
export interface StartAppOpts {
  bot: string
  /** named mini-app short name; omit for the bot's main mini-app */
  app?: string
  /** start payload — 1-64 chars from `[A-Za-z0-9_-]` */
  payload?: string
  /** launch mode — `compact` or `fullscreen` */
  mode?: WebAppMode
}

/** options for {@link deepLink.startAttach} */
export interface StartAttachOpts {
  bot: string
  payload?: string
  /** restrict the chat picker to these target types */
  choose?: AttachChooseTarget[]
}

/** options for {@link deepLink.attachInChat} */
export interface AttachInChatOpts {
  /** target chat — addressed by `username` or by `phone` (digits only, no `+` prefix) */
  chat: AttachChatTarget
  /** bot whose attachment menu to open inside the chat */
  bot: string
  payload?: string
}

/** options for {@link deepLink.game} */
export interface GameOpts {
  bot: string
  /** game short name */
  name: string
}

/** options for {@link deepLink.share} */
export interface ShareOpts {
  /** url to share — will be url-encoded */
  url: string
  /** optional accompanying message text — will be url-encoded */
  text?: string
}

/** options for {@link deepLink.videoChat} */
export interface VideoChatOpts {
  /** chat username (channel, group, or user) hosting the call */
  username: string
  /** invite hash from `phone.exportGroupCallInvite` */
  hash?: string
  /** open as livestream rather than regular video chat */
  live?: boolean
}

const USERNAME_RE = /^[A-Za-z][A-Za-z0-9_]{4,31}$/
const PAYLOAD_RE = /^[A-Za-z0-9_-]{1,64}$/
const APP_NAME_RE = /^[A-Za-z][A-Za-z0-9_]{2,31}$/
const GAME_NAME_RE = /^[A-Za-z][A-Za-z0-9_]{2,63}$/
const PHONE_RE = /^[0-9]+$/

const ADMIN_RIGHTS = new Set<AdminRight>([
  'change_info',
  'post_messages',
  'edit_messages',
  'delete_messages',
  'restrict_members',
  'invite_users',
  'pin_messages',
  'manage_topics',
  'promote_members',
  'manage_video_chats',
  'anonymous',
  'manage_chat',
  'post_stories',
  'edit_stories',
  'delete_stories',
  'manage_direct_messages'
])

const CHOOSE_TARGETS = new Set<AttachChooseTarget>(['users', 'bots', 'groups', 'channels'])

function ensureUsername (value: string, label = 'bot') {
  if (!USERNAME_RE.test(value)) {
    throw new Error(`invalid ${label} username: ${JSON.stringify(value)} — must be 5-32 chars, [A-Za-z][A-Za-z0-9_]*`)
  }
}

function ensurePayload (value: string, label: string) {
  if (!PAYLOAD_RE.test(value)) {
    throw new Error(`invalid ${label}: must be 1-64 chars of [A-Za-z0-9_-]`)
  }
}

function ensureAdmin (rights: readonly AdminRight[]) {
  if (rights.length === 0) {
    throw new Error('admin must be a non-empty array')
  }

  for (const right of rights) {
    if (!ADMIN_RIGHTS.has(right)) {
      throw new Error(`invalid admin right: ${JSON.stringify(right)}`)
    }
  }
}

function ensureChoose (targets: readonly AttachChooseTarget[]) {
  if (targets.length === 0) {
    throw new Error('choose must be a non-empty array')
  }

  for (const target of targets) {
    if (!CHOOSE_TARGETS.has(target)) {
      throw new Error(`invalid choose target: ${JSON.stringify(target)}`)
    }
  }
}

function ensureAppName (value: string) {
  if (!APP_NAME_RE.test(value)) {
    throw new Error(`invalid app short name: ${JSON.stringify(value)}`)
  }
}

function ensureGameName (value: string) {
  if (!GAME_NAME_RE.test(value)) {
    throw new Error(`invalid game short name: ${JSON.stringify(value)}`)
  }
}

function ensurePhone (value: string) {
  if (!PHONE_RE.test(value)) {
    throw new Error('invalid phone: must be digits only, no \'+\' prefix')
  }
}

/**
 * builds telegram `t.me` deep-links — bot starts, mini-apps, attachment menus, games, shares, video chats.
 *
 * every helper validates inputs against the rules at https://core.telegram.org/api/links
 * and throws on invalid input rather than silently emitting links the telegram client would reject.
 * payloads are not url-encoded — they must already be in the base64url charset
 *
 * @example
 * ```ts
 * deepLink.start({ bot: 'my_bot', payload: 'ref_42' })
 * // → 'https://t.me/my_bot?start=ref_42'
 *
 * deepLink.startGroup({ bot: 'my_bot', payload: 'invite', admin: ['post_messages'] })
 * // → 'https://t.me/my_bot?startgroup=invite&admin=post_messages'
 *
 * deepLink.startApp({ bot: 'my_bot', app: 'tictactoe', payload: 'room_7', mode: 'fullscreen' })
 * // → 'https://t.me/my_bot/tictactoe?startapp=room_7&mode=fullscreen'
 *
 * deepLink.share({ url: 'https://example.com', text: 'check this!' })
 * // → 'https://t.me/share?url=https%3A%2F%2Fexample.com&text=check%20this!'
 * ```
 */
export const deepLink = {
  /** `t.me/<bot>?start=<payload>` — deep-link a private chat with an optional start payload */
  start ({ bot, payload }: StartOpts): string {
    ensureUsername(bot)

    if (payload === undefined) {
      return `https://t.me/${bot}`
    }

    ensurePayload(payload, 'start payload')

    return `https://t.me/${bot}?start=${payload}`
  },

  topic ({ bot, messageThreadId }: TopicOpts) {
    ensureUsername(bot)

    if (!Number.isSafeInteger(messageThreadId) || messageThreadId <= 0) {
      throw new Error('messageThreadId must be a positive safe integer')
    }

    return `https://t.me/${bot}/${messageThreadId}`
  },

  /** `t.me/<bot>?startgroup[=<payload>][&admin=<rights>]` — add the bot to a group, optionally as admin */
  startGroup ({ bot, payload, admin }: StartGroupOpts) {
    ensureUsername(bot)

    if (payload !== undefined) {
      ensurePayload(payload, 'startgroup payload')
    }

    if (admin !== undefined) {
      ensureAdmin(admin)
    }

    const head = payload === undefined ? '?startgroup' : `?startgroup=${payload}`
    const tail = admin === undefined ? '' : `&admin=${admin.join('+')}`

    return `https://t.me/${bot}${head}${tail}`
  },

  /** `t.me/<bot>?startchannel&admin=<rights>` — add the bot to a channel with admin rights */
  startChannel ({ bot, admin }: StartChannelOpts) {
    ensureUsername(bot)
    ensureAdmin(admin)

    return `https://t.me/${bot}?startchannel&admin=${admin.join('+')}`
  },

  /** `t.me/<bot>[/<app>]?startapp[=<payload>][&mode=<mode>]` — launch a mini-app (main or named) */
  startApp ({ bot, app, payload, mode }: StartAppOpts) {
    ensureUsername(bot)

    if (app !== undefined) {
      ensureAppName(app)
    }

    if (payload !== undefined) {
      ensurePayload(payload, 'startapp payload')
    }

    const base = app === undefined ? `https://t.me/${bot}` : `https://t.me/${bot}/${app}`
    const head = payload === undefined ? '?startapp' : `?startapp=${payload}`
    const tail = mode === undefined ? '' : `&mode=${mode}`

    return `${base}${head}${tail}`
  },

  /** `t.me/<bot>?startattach[=<payload>][&choose=<targets>]` — open the bot's attachment menu */
  startAttach ({ bot, payload, choose }: StartAttachOpts) {
    ensureUsername(bot)

    if (payload !== undefined) {
      ensurePayload(payload, 'startattach payload')
    }

    if (choose !== undefined) {
      ensureChoose(choose)
    }

    const head = payload === undefined ? '?startattach' : `?startattach=${payload}`
    const tail = choose === undefined ? '' : `&choose=${choose.join('+')}`

    return `https://t.me/${bot}${head}${tail}`
  },

  /** open the bot's attachment menu inside a specific chat (by username or phone) */
  attachInChat ({ chat, bot, payload }: AttachInChatOpts) {
    ensureUsername(bot)

    if (payload !== undefined) {
      ensurePayload(payload, 'startattach payload')
    }

    let target: string

    if ('username' in chat) {
      ensureUsername(chat.username, 'chat')
      target = chat.username
    } else {
      ensurePhone(chat.phone)
      target = `+${chat.phone}`
    }

    const tail = payload === undefined ? '' : `&startattach=${payload}`

    return `https://t.me/${target}?attach=${bot}${tail}`
  },

  /** `t.me/<bot>?game=<name>` — open one of the bot's games */
  game ({ bot, name }: GameOpts): string {
    ensureUsername(bot)
    ensureGameName(name)

    return `https://t.me/${bot}?game=${name}`
  },

  /** `t.me/share?url=<url>&text=<text>` — pre-filled share dialog */
  share ({ url, text }: ShareOpts): string {
    if (typeof url !== 'string' || url.length === 0) {
      throw new Error('share url is required')
    }

    const tail = text === undefined ? '' : `&text=${encodeURIComponent(text)}`

    return `https://t.me/share?url=${encodeURIComponent(url)}${tail}`
  },

  /** `t.me/<username>?videochat[=<hash>]` or `?livestream[=<hash>]` — join a video chat or livestream */
  videoChat ({ username, hash, live }: VideoChatOpts) {
    ensureUsername(username, 'chat')

    const key = live === true ? 'livestream' : 'videochat'
    const tail = hash === undefined ? '' : `=${hash}`

    return `https://t.me/${username}?${key}${tail}`
  }
}
