---
title: '@puregram/utils'
description: standalone utility helpers for puregram — slot-machine decoder, web app initData validation, deep-link builder, and command parser
---

# `@puregram/utils`

a small grab-bag of standalone helpers that are useful alongside `puregram` but don't belong in core. zero plugin glue, no `Telegram` instance required — just import and call

currently exports:

- `getCasinoValues` — decode the 🎰 dice value into its three slot-machine symbols
- `WebApp` — validate telegram mini-app `initData`
- `parseCommand` — parse `/command[@bot] [args...]` strings
- `deepLink` — typed builder for `https://t.me/...` deep-links
- `parseDeepLink` — parse an inbound `t.me` link into a typed descriptor

## when to use

- your bot handles 🎰 dice and you want to show users which symbols they got
- you run a mini-app (web app) and need to verify the `initData` signature server-side
- you're parsing raw message text for bot commands with arguments
- you need to generate `t.me` start links, mini-app links, attachment-menu invites, or game links with validated inputs

## install

::: code-group

```sh [yarn]
yarn add @puregram/utils
```

```sh [npm]
npm i -S @puregram/utils
```

```sh [pnpm]
pnpm add @puregram/utils
```

:::

## `getCasinoValues(source)` — slot machine decoder

when telegram delivers a 🎰 dice, `dice.value` is an integer in `1..64` that encodes the three symbols on the wheels. `getCasinoValues` decodes it into the `[left, middle, right]` symbol triple:

```ts
import { Telegram } from 'puregram'
import { getCasinoValues, CasinoValue } from '@puregram/utils'

const tg = Telegram.fromToken(process.env.TOKEN!)

tg.onMessage((message) => {
  if (!message.hasDice() || message.dice.emoji !== '🎰') {
    return
  }

  const [a, b, c] = getCasinoValues(message.dice.value)

  if ([a, b, c].every(s => s === CasinoValue.Seven)) {
    return message.send('🎉 jackpot!')
  }

  return message.send(`you got ${a}, ${b}, ${c}`)
})

await tg.startPolling()
```

`source` accepts either a `number` or a numeric string. the four possible symbol values:

| `CasinoValue` | string |
|---|---|
| `CasinoValue.Bar` | `'bar'` |
| `CasinoValue.Grapes` | `'grapes'` |
| `CasinoValue.Lemon` | `'lemon'` |
| `CasinoValue.Seven` | `'seven'` |

return type is `readonly [CasinoValue, CasinoValue, CasinoValue]` (`SlotMachineValue`)

## `WebApp` — mini-app initData validation

when your bot opens a [mini-app (web app)](https://core.telegram.org/bots/webapps), the page receives an `initData` query string with the user identity, auth date, and a `hash` that proves it came from telegram. you must verify this server-side before trusting any of the fields:

```ts
import { WebApp } from '@puregram/utils'

const valid = WebApp.validate({
  initData: req.body.initData,
  token: process.env.TOKEN!
})

if (!valid) {
  res.status(401).end()
  return
}
```

### `WebApp.generateSecretKey(token)` — derive the HMAC key once

`validate` re-derives the key on every call. on hot paths — validating per request — derive once at startup:

```ts
const KEY = WebApp.generateSecretKey(process.env.TOKEN!)

app.post('/api/me', (req, res) => {
  if (!WebApp.validate({ initData: req.body.initData, key: KEY })) {
    return res.status(401).end()
  }

  // safe to use initData fields now
})
```

returns the native `Buffer` on Node, or the portable `buffer` implementation where Node globals are unavailable. the return type reflects both implementations; common methods such as `.toString('hex')` remain available without promising Node-only methods. cache the key rather than deriving it on every request

### `WebApp.validate(params)` — full check

| field | type | description |
|---|---|---|
| `initData` | `string` | raw query string from `Telegram.WebApp.initData` (not `initDataUnsafe`) |
| `key` | `Uint8Array` | pre-derived HMAC key, including native or portable Buffer. mutually exclusive with `token` |
| `token` | `string` | bot token; derives the key on each call. use `key` on hot paths |
| `throwError` | `boolean` | default `false` — when `true`, throws on mismatch instead of returning `false` |

returns `true` when the hash matches. always throws when `initData` is missing its `hash` field — that's malformed input, not a hash mismatch

### `WebApp.parseInitData(initData)` — split into fields

```ts
const fields = WebApp.parseInitData('query_id=q&auth_date=1700000000&hash=abcd')
// → { query_id: 'q', auth_date: '1700000000', hash: 'abcd' }
```

a `URLSearchParams` shortcut — don't trust the values until you've called `validate`

### `WebApp.generateInitDataHash(initData, key)` — recompute the hash manually

for custom validation flows (caching, rate limiting, custom error handling):

```ts
const KEY = WebApp.generateSecretKey(process.env.TOKEN!)
const expected = WebApp.generateInitDataHash(initData, KEY)
const actual = WebApp.parseInitData(initData).hash

if (expected !== actual) {
  // not from telegram, or initData was tampered with
}
```

## `parseCommand(text)` — parse bot commands

parses a `/command[@bot] [args...]` string. returns `null` when the input isn't a valid command:

```ts
import { parseCommand } from '@puregram/utils'

parseCommand('/buy')
// → { command: 'buy', bot: undefined, args: [], rest: '' }

parseCommand('/buy@my_bot apples 5')
// → { command: 'buy', bot: 'my_bot', args: ['apples', '5'], rest: 'apples 5' }

parseCommand('hello')  // → null
parseCommand('/')      // → null (no command name after the slash)
parseCommand('  /buy') // → null (leading whitespace — telegram commands always start at column 0)
```

`args` is `rest.split(/\s+/).filter(Boolean)`. `rest` is everything after the command and optional `@bot`, leading whitespace trimmed. `bot` usernames are validated against the telegram rule `[A-Za-z0-9_]{5,32}`

## `deepLink` — typed `t.me` link builder

a namespace of strict, typed builders for every `t.me` deep-link the bot api supports. each helper validates inputs and **throws** on invalid values rather than silently emitting links the telegram client would reject:

```ts
import { deepLink } from '@puregram/utils'

// private-chat start
deepLink.start({ bot: 'my_bot', payload: 'ref_42' })
// → 'https://t.me/my_bot?start=ref_42'

// add bot to a group, optionally as admin
deepLink.startGroup({ bot: 'my_bot', admin: ['post_messages'] })
// → 'https://t.me/my_bot?startgroup&admin=post_messages'

// add bot to a channel (admin rights required)
deepLink.startChannel({ bot: 'my_bot', admin: ['post_messages', 'edit_messages'] })
// → 'https://t.me/my_bot?startchannel&admin=post_messages+edit_messages'

// launch a mini-app
deepLink.startApp({ bot: 'my_bot', app: 'tictactoe', payload: 'room_7' })
// → 'https://t.me/my_bot/tictactoe?startapp=room_7'

deepLink.startApp({ bot: 'my_bot', payload: 'p', mode: 'fullscreen' })
// → 'https://t.me/my_bot?startapp=p&mode=fullscreen'

// attachment menu
deepLink.startAttach({ bot: 'my_bot', choose: ['users', 'groups'] })
// → 'https://t.me/my_bot?startattach&choose=users+groups'

deepLink.attachInChat({ chat: { username: 'durov' }, bot: 'my_bot', payload: 'p' })
// → 'https://t.me/durov?attach=my_bot&startattach=p'

// game, share, video chat
deepLink.game({ bot: 'my_bot', name: 'tetris' })
// → 'https://t.me/my_bot?game=tetris'

deepLink.share({ url: 'https://example.com', text: 'check this!' })
// → 'https://t.me/share?url=https%3A%2F%2Fexample.com&text=check%20this!'

deepLink.videoChat({ username: 'mychannel', live: true })
// → 'https://t.me/mychannel?livestream'
```

### available builders

| method | link pattern |
|---|---|
| `deepLink.start(opts)` | `t.me/<bot>?start=<payload>` |
| `deepLink.startGroup(opts)` | `t.me/<bot>?startgroup[=<payload>][&admin=<rights>]` |
| `deepLink.startChannel(opts)` | `t.me/<bot>?startchannel&admin=<rights>` |
| `deepLink.startApp(opts)` | `t.me/<bot>[/<app>]?startapp[=<payload>][&mode=<mode>]` |
| `deepLink.startAttach(opts)` | `t.me/<bot>?startattach[=<payload>][&choose=<targets>]` |
| `deepLink.attachInChat(opts)` | `t.me/<chat>?attach=<bot>[&startattach=<payload>]` |
| `deepLink.game(opts)` | `t.me/<bot>?game=<name>` |
| `deepLink.share(opts)` | `t.me/share?url=<url>[&text=<text>]` |
| `deepLink.videoChat(opts)` | `t.me/<username>?videochat[=<hash>]` or `?livestream[=<hash>]` |

### validation rules

- **bot / chat username** — `[A-Za-z][A-Za-z0-9_]{4,31}` (5-32 chars)
- **payloads** (`start`, `startgroup`, `startapp`, `startattach`) — 1-64 chars of `[A-Za-z0-9_-]` (base64url). not url-encoded — must already be in the allowed charset
- **admin rights** — closed set: `change_info`, `post_messages`, `edit_messages`, `delete_messages`, `restrict_members`, `invite_users`, `pin_messages`, `manage_topics`, `promote_members`, `manage_video_chats`, `anonymous`, `manage_chat`, `post_stories`, `edit_stories`, `delete_stories`, `manage_direct_messages`
- **mini-app mode** — `'compact'` or `'fullscreen'`
- **choose targets** — subset of `'users'`, `'bots'`, `'groups'`, `'channels'`
- **phone** (for `attachInChat`) — digits only, no `+` prefix
- **share url / text** — free-form; these are `encodeURIComponent`-escaped

## `parseDeepLink(url)` — parse `t.me` links

the inverse of `deepLink`: turn an inbound `t.me` link into a typed, discriminated descriptor. accepts links with or without a scheme on the `t.me`, `telegram.me`, and `telegram.dog` domains, and returns `undefined` for non-telegram, unparseable, or unmodeled links:

```ts
import { parseDeepLink } from '@puregram/utils'

parseDeepLink('https://t.me/durov')
// → { type: 'profile', username: 'durov' }

parseDeepLink('t.me/durov/123')
// → { type: 'message', chat: { username: 'durov' }, messageId: 123 }

parseDeepLink('t.me/c/1380524958/187')
// → { type: 'message', chat: { id: -1001380524958 }, messageId: 187 }

parseDeepLink('https://t.me/my_bot?start=ref_42')
// → { type: 'bot-start', bot: 'my_bot', payload: 'ref_42' }

parseDeepLink('https://t.me/my_bot/tictactoe?startapp=room_7&mode=fullscreen')
// → { type: 'mini-app', bot: 'my_bot', app: 'tictactoe', payload: 'room_7', mode: 'fullscreen' }

parseDeepLink('https://t.me/addstickers/Animals')
// → { type: 'sticker-set', name: 'Animals' }
```

the `type` field discriminates the union: `profile`, `message`, `bot-start`, `group-start`, `channel-start`, `mini-app`, `attach`, `game`, `video-chat`, `share`, `sticker-set`, `emoji-set`, `invite`. private `c/<id>/<msg>` links resolve the bare channel id to its bot api `-100…` form (so `chat.id` lines up with updates) via the same math as `toBotApiId`

::: warning
`t.me/+<hash>` is read as a chat invite — a `+<phone>` profile link would be misread as an invite. `admin` / `choose` values are returned verbatim from the link
:::

## peer ids — bot api ↔ mtproto

telegram clients (and `t.me/c/…` links, and mtproto libraries like mtcute) speak
*bare* mtproto ids. the bot api hands out *marked* ids where the sign / `-100…`
prefix encodes the peer kind. these helpers convert between the two and classify
a marked id without a `getChat` round-trip

```ts
import {
  parsePeerId, toMtprotoId, toBotApiId,
  getPeerType, isUserId, isChatId, isChannelId
} from '@puregram/utils'

parsePeerId(-1001234567890) // { type: 'channel', id: 1234567890 }
parsePeerId(-987654321)     // { type: 'chat', id: 987654321 }
parsePeerId(123456789)      // { type: 'user', id: 123456789 }

toMtprotoId(-1001234567890)       // 1234567890
toBotApiId(1234567890, 'channel') // -1001234567890

getPeerType(-1001234567890) // 'channel'
isChannelId(-1001234567890) // true
isUserId(0)                 // false — guards never throw
```

`type` is coarse: `'channel'` covers **both** supergroups and broadcast channels,
since they share the `-100…` marking and can't be told apart from the id alone

the converting helpers (`parsePeerId`, `toMtprotoId`, `getPeerType`, `toBotApiId`)
throw `PeerIdError` on structurally-impossible input — `0`, `-1000000000000`,
non-integers, unsafe integers; `toBotApiId` also rejects a non-positive bare id.
the `isXId` guards return `false` instead of throwing. ranges are lenient (no
upper-bound check), so a future telegram id-ceiling bump keeps working

## types

```ts
import type {
  SlotMachineValue,       // readonly [CasinoValue, CasinoValue, CasinoValue]
  ParsedCommand,          // { command, bot, args, rest }
  WebAppValidateParams,
  AdminRight,
  WebAppMode,             // 'compact' | 'fullscreen'
  AttachChooseTarget,     // 'users' | 'bots' | 'groups' | 'channels'
  AttachChatTarget,       // { username: string } | { phone: string }
  ParsedDeepLink,         // discriminated by type
  DeepLinkChat,           // { username } | { id }
  PeerType,               // 'user' | 'chat' | 'channel'
  ParsedPeerId,           // { type, id }
  StartOpts,
  StartGroupOpts,
  StartChannelOpts,
  StartAppOpts,
  StartAttachOpts,
  AttachInChatOpts,
  GameOpts,
  ShareOpts,
  VideoChatOpts
} from '@puregram/utils'

import { CasinoValue, PeerIdError } from '@puregram/utils'
```

## see also

- [/api/methods](/api/methods) — bot api methods for dice, inline queries, games
- [/api/objects](/api/objects) — `Dice`, `Game`, `WebAppInfo` objects
