import type { AdminRight, AttachChooseTarget, WebAppMode } from './deep-link'
import { toBotApiId } from './peer-id'

/** telegram domains that serve `t.me` deep-links */
const TG_HOSTS: Record<string, true> = {
  't.me': true,
  'telegram.me': true,
  'telegram.dog': true
}

/**
 * first path segments telegram reserves for features this parser does not model
 * (proxies, login, theme/language imports, …). matching one yields `undefined`
 * rather than a bogus `profile` result
 */
const RESERVED: Record<string, true> = {
  proxy: true,
  socks: true,
  login: true,
  confirmphone: true,
  setlanguage: true,
  addtheme: true,
  addlist: true,
  contact: true,
  boost: true
}

const USERNAME_RE = /^[A-Za-z][A-Za-z0-9_]{4,31}$/
const NUMERIC_RE = /^[0-9]+$/

/** a telegram chat addressed either by public `username` or by resolved bot api `id` (private `c/` links) */
export type DeepLinkChat = { username: string } | { id: number }

/** discriminated result of {@link parseDeepLink} — the inverse of the {@link deepLink} builders */
export type ParsedDeepLink =
  | { type: 'profile', username: string }
  | { type: 'message', chat: DeepLinkChat, messageId: number, threadId?: number, commentId?: number }
  | { type: 'bot-start', bot: string, payload?: string }
  | { type: 'group-start', bot: string, payload?: string, admin?: AdminRight[] }
  | { type: 'channel-start', bot: string, admin?: AdminRight[] }
  | { type: 'mini-app', bot: string, app?: string, payload?: string, mode?: WebAppMode }
  | { type: 'attach', bot: string, payload?: string, choose?: AttachChooseTarget[] }
  | { type: 'game', bot: string, name: string }
  | { type: 'video-chat', username: string, hash?: string, live: boolean }
  | { type: 'share', url: string, text?: string }
  | { type: 'sticker-set', name: string }
  | { type: 'emoji-set', name: string }
  | { type: 'invite', hash: string }

function isNumeric (value: string) {
  return NUMERIC_RE.test(value)
}

function nonEmpty (value: string | undefined) {
  return value !== undefined && value.length > 0 ? value : undefined
}

function toPositiveInt (value: string | undefined) {
  if (value === undefined) {
    return undefined
  }

  const parsed = Number(value)

  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined
}

// telegram joins list params with `+`, which query decoding turns into a space
function splitList<T extends string> (value: string | undefined) {
  if (value === undefined || value.length === 0) {
    return undefined
  }

  const parts = value.split(/[+\s]+/).filter(Boolean) as T[]

  return parts.length > 0 ? parts : undefined
}

const utf8Encoder = new TextEncoder()
const utf8Decoder = new TextDecoder('utf-8', { ignoreBOM: true })

function decodeQueryComponent (value: string) {
  const spaced = value.replaceAll('+', ' ')

  if (!spaced.includes('%')) {
    return spaced
  }

  const input = utf8Encoder.encode(spaced)
  const output = new Uint8Array(input.length)
  let length = 0

  for (let i = 0; i < input.length; i++) {
    const escape = input[i] === 0x25 ? String.fromCharCode(input[i + 1] ?? 0, input[i + 2] ?? 0) : ''

    if (/^[0-9a-f]{2}$/i.test(escape)) {
      output[length++] = Number.parseInt(escape, 16)
      i += 2
    } else {
      output[length++] = input[i]!
    }
  }

  return utf8Decoder.decode(output.subarray(0, length))
}

function parseQuery (query: string) {
  const params = new Map<string, string>()

  for (const pair of query.split('&')) {
    if (pair.length === 0) {
      continue
    }

    const separator = pair.indexOf('=')
    const name = decodeQueryComponent(separator === -1 ? pair : pair.slice(0, separator))

    if (!params.has(name)) {
      params.set(name, decodeQueryComponent(separator === -1 ? '' : pair.slice(separator + 1)))
    }
  }

  return params
}

/**
 * parse a telegram `t.me` link into a typed, discriminated descriptor — the inverse of {@link deepLink}.
 *
 * accepts links with or without a scheme (`https://t.me/…`, `t.me/…`) on the `t.me`, `telegram.me`, and
 * `telegram.dog` domains. returns `undefined` for non-telegram, unparseable, or unmodeled links.
 *
 * private `c/<id>/<msg>` links resolve the bare channel id to its bot api `-100…` form so it lines up with
 * `chat.id` on updates. note: `t.me/+<hash>` is read as a chat invite — a `+<phone>` profile link would be
 * misread as an invite. `admin`/`choose` values are returned verbatim from the link.
 *
 * @example
 * ```ts
 * parseDeepLink('https://t.me/durov')
 * // → { type: 'profile', username: 'durov' }
 *
 * parseDeepLink('t.me/c/1380524958/187')
 * // → { type: 'message', chat: { id: -1001380524958 }, messageId: 187 }
 *
 * parseDeepLink('https://t.me/my_bot?start=ref_42')
 * // → { type: 'bot-start', bot: 'my_bot', payload: 'ref_42' }
 *
 * parseDeepLink('https://t.me/my_bot/tictactoe?startapp=room_7&mode=fullscreen')
 * // → { type: 'mini-app', bot: 'my_bot', app: 'tictactoe', payload: 'room_7', mode: 'fullscreen' }
 * ```
 */
// eslint-disable-next-line local-rules/no-redundant-return-type -- annotation keeps the `type` discriminants narrow
export function parseDeepLink (input: string): ParsedDeepLink | undefined {
  if (typeof input !== 'string') {
    return undefined
  }

  const trimmed = input.trim()

  if (trimmed.length === 0) {
    return undefined
  }

  const parts = /^(?:[a-z][a-z0-9+.-]*:\/\/)?([^/?#\\]*)([^?#]*)(?:\?([^#]*))?/i.exec(trimmed)!
  const host = parts[1]!.replace(/^.*@/, '').replace(/:\d*$/, '').toLowerCase().replace(/^www\./, '')

  if (!Object.hasOwn(TG_HOSTS, host)) {
    return undefined
  }

  const segments = parts[2]!.split(/[/\\]/).filter(Boolean)
  const query = parseQuery(parts[3] ?? '')

  const first = segments[0]
  const second = segments[1]
  const third = segments[2]

  if (first === undefined) {
    return undefined
  }

  if (first === 'share') {
    const shareUrl = query.get('url')

    if (shareUrl === undefined) {
      return undefined
    }

    const text = nonEmpty(query.get('text'))

    return { type: 'share', url: shareUrl, ...(text !== undefined && { text }) }
  }

  if (first === 'addstickers') {
    return second === undefined ? undefined : { type: 'sticker-set', name: second }
  }

  if (first === 'addemoji') {
    return second === undefined ? undefined : { type: 'emoji-set', name: second }
  }

  if (first === 'joinchat') {
    return second === undefined ? undefined : { type: 'invite', hash: second }
  }

  if (first.startsWith('+')) {
    const hash = first.slice(1)

    return hash.length === 0 ? undefined : { type: 'invite', hash }
  }

  if (first === 'c') {
    const channelId = toPositiveInt(second)
    const a = toPositiveInt(third)

    if (channelId === undefined || a === undefined) {
      return undefined
    }

    const chat: DeepLinkChat = { id: toBotApiId(channelId, 'channel') }
    const fourth = segments[3]

    if (fourth === undefined) {
      return { type: 'message', chat, messageId: a }
    }

    const b = toPositiveInt(fourth)

    return b === undefined ? undefined : { type: 'message', chat, threadId: a, messageId: b }
  }

  if (Object.hasOwn(RESERVED, first) || !USERNAME_RE.test(first)) {
    return undefined
  }

  const bot = first

  if (query.has('startapp')) {
    const payload = nonEmpty(query.get('startapp'))
    const app = second !== undefined && !isNumeric(second) ? second : undefined
    const modeParam = query.get('mode')
    const mode = modeParam === 'compact' || modeParam === 'fullscreen' ? modeParam : undefined

    return {
      type: 'mini-app',
      bot,
      ...(app !== undefined && { app }),
      ...(payload !== undefined && { payload }),
      ...(mode !== undefined && { mode })
    }
  }

  if (query.has('start')) {
    const payload = nonEmpty(query.get('start'))

    return { type: 'bot-start', bot, ...(payload !== undefined && { payload }) }
  }

  if (query.has('startgroup')) {
    const payload = nonEmpty(query.get('startgroup'))
    const admin = splitList<AdminRight>(query.get('admin'))

    return { type: 'group-start', bot, ...(payload !== undefined && { payload }), ...(admin !== undefined && { admin }) }
  }

  if (query.has('startchannel')) {
    const admin = splitList<AdminRight>(query.get('admin'))

    return { type: 'channel-start', bot, ...(admin !== undefined && { admin }) }
  }

  if (query.has('startattach')) {
    const payload = nonEmpty(query.get('startattach'))
    const choose = splitList<AttachChooseTarget>(query.get('choose'))

    return { type: 'attach', bot, ...(payload !== undefined && { payload }), ...(choose !== undefined && { choose }) }
  }

  if (query.has('game')) {
    const name = nonEmpty(query.get('game'))

    return name === undefined ? undefined : { type: 'game', bot, name }
  }

  if (query.has('videochat') || query.has('livestream')) {
    const live = query.has('livestream')
    const hash = nonEmpty(query.get('videochat') ?? query.get('livestream'))

    return { type: 'video-chat', username: bot, live, ...(hash !== undefined && { hash }) }
  }

  if (second !== undefined && isNumeric(second)) {
    const chat: DeepLinkChat = { username: bot }

    if (third !== undefined && isNumeric(third)) {
      return { type: 'message', chat, threadId: Number(second), messageId: Number(third) }
    }

    const thread = toPositiveInt(query.get('thread'))
    const comment = toPositiveInt(query.get('comment'))

    return {
      type: 'message',
      chat,
      messageId: Number(second),
      ...(thread !== undefined && { threadId: thread }),
      ...(comment !== undefined && { commentId: comment })
    }
  }

  if (second !== undefined) {
    return { type: 'mini-app', bot, app: second }
  }

  return { type: 'profile', username: bot }
}
