<div align='center'>
  <img src='https://i.imgur.com/ZzjmE8i.png' />
</div>

<br />

<div align='center'>
  <a href='https://github.com/puregram/puregram'><b><code>puregram</code></b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#list-of-utilities'><b>list of utilities</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='https://t.me/pureforum'><b>telegram forum</b></a>
</div>

## @puregram/utils

_a small grab-bag of standalone helpers for `puregram` package_

### introduction

`puregram` core stays lean — anything that's useful but not essential lives out here. right now that's exactly two things: a slot-machine dice decoder, and a telegram web app `initData` validator. zero plugin glue, no `Telegram` instance required, both work as plain functions you can drop anywhere

### example

```ts
import { Telegram } from 'puregram'
import { getCasinoValues } from '@puregram/utils'

const telegram = Telegram.fromToken(process.env.TOKEN!)

telegram.onMessage((message) => {
  if (message.hasDice() && message.dice.emoji === '🎰') {
    const [a, b, c] = getCasinoValues(message.dice.value)

    return message.send(`you got ${a}, ${b}, ${c}!`)
  }
})

await telegram.startPolling()
```

### installation

```sh
$ yarn add @puregram/utils
$ npm i -S @puregram/utils
```

---

<a name='list-of-utilities'></a>
## list of utilities

<a name='get-casino-values'></a>
### `getCasinoValues(source)` — slot machine dice decoder

when telegram delivers a 🎰 dice, `dice.value` is an integer in `1..64` that encodes the three symbols on the wheels. `getCasinoValues(value)` decodes it into the actual `[left, middle, right]` symbol triple

```ts
import { getCasinoValues, CasinoValue } from '@puregram/utils'

telegram.onMessage((message) => {
  if (!message.hasDice() || message.dice.emoji !== '🎰') {
    return
  }

  const symbols = getCasinoValues(message.dice.value)
  // → readonly [CasinoValue, CasinoValue, CasinoValue]

  if (symbols.every(s => s === CasinoValue.Seven)) {
    return message.send('🎉 jackpot — three sevens!')
  }

  return message.send(`you got ${symbols.join(', ')}`)
})
```

`source` accepts either a `number` or a numeric string. the return is a typed 3-tuple of `CasinoValue` — one of:

| `CasinoValue` member | string value |
|---|---|
| `CasinoValue.Bar` | `'bar'` |
| `CasinoValue.Grapes` | `'grapes'` |
| `CasinoValue.Lemon` | `'lemon'` |
| `CasinoValue.Seven` | `'seven'` |

<a name='web-app'></a>
### `WebApp` — telegram web app initData validation

when your bot opens a [web app](https://core.telegram.org/bots/webapps), the page receives an `initData` query string containing the user identity, auth date, and a `hash` that proves it came from telegram (signed with your bot token). before you trust *any* of those fields server-side, you have to verify the hash. that's what `WebApp` does

```ts
import { WebApp } from '@puregram/utils'

// the simple case — pass the bot token, get back true/false
const valid = WebApp.validate({
  initData: req.body.initData,
  token: process.env.TOKEN!
})

if (!valid) {
  res.status(401).end()
  return
}
```

#### `WebApp.generateSecretKey(token)` — derive the HMAC key once

`validate` does the same derivation internally on every call. for hot paths (validating per-request), derive once at boot and pass `key` instead — the HMAC step is the expensive part:

```ts
import { WebApp } from '@puregram/utils'

const KEY = WebApp.generateSecretKey(process.env.TOKEN!)

app.post('/api/me', (req, res) => {
  if (!WebApp.validate({ initData: req.body.initData, key: KEY })) {
    return res.status(401).end()
  }

  // safe to use req.body.initData fields now
})
```

returns the native `Buffer` on Node, or the portable `buffer` implementation where Node globals are unavailable. the return type reflects both implementations; common methods such as `.toString('hex')` remain available without promising Node-only methods. cache the key rather than deriving it on every request

#### `WebApp.parseInitData(initData)` — split the query string into fields

```ts
import { WebApp } from '@puregram/utils'

const fields = WebApp.parseInitData('query_id=q&auth_date=1700000000&user=%7B%22id%22%3A1%7D&hash=abcd')
// → { query_id: 'q', auth_date: '1700000000', user: '{"id":1}', hash: 'abcd' }
```

useful when you want to inspect specific fields without going through `validate`.

**note**: don't trust the values until you've called `validate` — `parseInitData` is just a `URLSearchParams` shortcut

#### `WebApp.generateInitDataHash(initData, key)` — recompute the hash by hand

if you're rolling your own validation flow (caching, rate limiting, custom error reporting), use this to compute the expected hash and compare it yourself:

```ts
import { WebApp } from '@puregram/utils'

const KEY = WebApp.generateSecretKey(process.env.TOKEN!)
const expected = WebApp.generateInitDataHash(initData, KEY)
const actual = WebApp.parseInitData(initData).hash

if (expected !== actual) {
  // not from telegram, or initData was tampered with
}
```

#### `WebApp.validate(params)` — the full check

```ts
WebApp.validate({
  initData: '...',
  token: process.env.TOKEN!,    // OR…
  key: derivedKey,              // …pre-derived key (mutually exclusive)
  throwError: false             // default — return false on mismatch
})
```

| field | type | description |
|---|---|---|
| `initData` | `string` | the raw query string from `Telegram.WebApp.initData` (not `initDataUnsafe`) |
| `key` | `Uint8Array` | pre-derived HMAC key, including native or portable Buffer. mutually exclusive with `token` |
| `token` | `string` | bot token; derives the key on every call. supply `key` instead on hot paths |
| `throwError` | `boolean` | when `true`, throws on mismatch instead of returning `false`. default `false` |

returns `true` when the hash matches, `false` otherwise (or throws, with `throwError: true`). always throws synchronously when `initData` is missing the `hash` field — that's a malformed input, not a hash mismatch

---

<a name='parse-command'></a>
### `parseCommand(text)` — parse `/command[@bot] [args...]`

returns a structured breakdown of a telegram bot command string, or `null` when the input isn't a valid command

```ts
import { parseCommand } from '@puregram/utils'

parseCommand('/buy')
// → { command: 'buy', bot: undefined, args: [], rest: '' }

parseCommand('/buy@my_bot')
// → { command: 'buy', bot: 'my_bot', args: [], rest: '' }

parseCommand('/buy@my_bot apples 5 fresh')
// → { command: 'buy', bot: 'my_bot', args: ['apples', '5', 'fresh'], rest: 'apples 5 fresh' }

parseCommand('/buy@my_bot   foo')
// → { command: 'buy', bot: 'my_bot', args: ['foo'], rest: 'foo' }

parseCommand('/start ref_abc123_with_underscores')
// → { command: 'start', bot: undefined, args: ['ref_abc123_with_underscores'], rest: 'ref_abc123_with_underscores' }

parseCommand('hello')   // → null
parseCommand('/')       // → null (no command name)
parseCommand('  /buy')  // → null (telegram commands never have leading whitespace)
```

`args` is `rest.split(/\s+/).filter(Boolean)`; `rest` is everything after the command (and optional `@bot`) with leading whitespace trimmed. bot usernames are validated against the telegram rule `[a-zA-Z0-9_]{5,32}`

<a name='deep-link'></a>
### `deepLink` — build `https://t.me/...` deep-links

a namespace of strict, typed builders for every t.me deep-link the bot api recognizes — see [core.telegram.org/api/links](https://core.telegram.org/api/links). each helper validates inputs (username format, payload charset and length, admin-rights enum, etc.) and **throws** on invalid input rather than silently emitting a link the telegram client would reject

```ts
import { deepLink } from '@puregram/utils'

// bot starts
deepLink.start({ bot: 'my_bot' })
// → 'https://t.me/my_bot'

deepLink.start({ bot: 'my_bot', payload: 'ref_42' })
// → 'https://t.me/my_bot?start=ref_42'

// add bot to a group (optionally as admin)
deepLink.startGroup({ bot: 'my_bot', payload: 'invite' })
// → 'https://t.me/my_bot?startgroup=invite'

deepLink.startGroup({ bot: 'my_bot', admin: ['post_messages'] })
// → 'https://t.me/my_bot?startgroup&admin=post_messages'

// channels require admin rights
deepLink.startChannel({ bot: 'my_bot', admin: ['post_messages', 'edit_messages'] })
// → 'https://t.me/my_bot?startchannel&admin=post_messages+edit_messages'

// mini-app — main or named, with optional launch mode
deepLink.startApp({ bot: 'my_bot', payload: 'page_42', mode: 'fullscreen' })
// → 'https://t.me/my_bot?startapp=page_42&mode=fullscreen'

deepLink.startApp({ bot: 'my_bot', app: 'tictactoe', payload: 'room_7' })
// → 'https://t.me/my_bot/tictactoe?startapp=room_7'

// attachment menu — in the bot's own chat or in a chosen one
deepLink.startAttach({ bot: 'my_bot', choose: ['users', 'groups'] })
// → 'https://t.me/my_bot?startattach&choose=users+groups'

deepLink.attachInChat({ chat: { username: 'durov' }, bot: 'my_bot', payload: 'p' })
// → 'https://t.me/durov?attach=my_bot&startattach=p'

// games, share dialogs, video chats / livestreams
deepLink.game({ bot: 'my_bot', name: 'tetris' })
// → 'https://t.me/my_bot?game=tetris'

deepLink.share({ url: 'https://example.com', text: 'check this!' })
// → 'https://t.me/share?url=https%3A%2F%2Fexample.com&text=check%20this!'

deepLink.videoChat({ username: 'mychannel', hash: 'abc123', live: true })
// → 'https://t.me/mychannel?livestream=abc123'
```

`deepLink.topic({ bot: 'my_bot', messageThreadId: 42 })` builds `https://t.me/my_bot/42`, opening a topic in the bot's private chat (bot api 10.4). `messageThreadId` must be a positive safe integer. `parseDeepLink` keeps the structural `message` result for this URL shape because a URL alone cannot distinguish a bot topic from a public chat message.

#### validation rules

- **bot username** — `[A-Za-z][A-Za-z0-9_]{4,31}` (telegram's 5-32 char rule)
- **start / startgroup / startapp / startattach payload** — 1-64 chars of `[A-Za-z0-9_-]` (base64url). these are **not url-encoded** — they must already be in the allowed charset
- **admin rights** — must be from the closed set: `change_info`, `post_messages`, `edit_messages`, `delete_messages`, `restrict_members`, `invite_users`, `pin_messages`, `manage_topics`, `promote_members`, `manage_video_chats`, `anonymous`, `manage_chat`, `post_stories`, `edit_stories`, `delete_stories`, `manage_direct_messages`
- **mini-app mode** — `'compact'` or `'fullscreen'`
- **choose targets** — subset of `'users'`, `'bots'`, `'groups'`, `'channels'`
- **phone** (for `attachInChat`) — digits only, no `+` prefix
- **share url / text** — free-form; these *are* `encodeURIComponent`-escaped

<a name='parse-deep-link'></a>
### `parseDeepLink(url)` — parse `t.me/...` links

the inverse of [`deepLink`](#deep-link): turn an inbound `t.me` link into a typed, discriminated descriptor. accepts links with or without a scheme on the `t.me`, `telegram.me`, and `telegram.dog` domains; returns `undefined` for non-telegram, unparseable, or unmodeled links

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

the `type` field discriminates the union: `profile`, `message`, `bot-start`, `group-start`, `channel-start`, `mini-app`, `attach`, `game`, `video-chat`, `share`, `sticker-set`, `emoji-set`, `invite`. private `c/<id>/<msg>` links resolve the bare channel id to its bot api `-100…` form (so `chat.id` lines up with updates) via the same math as [`toBotApiId`](#peer-id)

> **note** `t.me/+<hash>` is read as a chat invite — a `+<phone>` profile link would be misread as an invite. `admin` / `choose` values are returned verbatim from the link

<a name='peer-id'></a>
### `parsePeerId` / `toMtprotoId` / `toBotApiId` — bot api ↔ mtproto ids

telegram clients, `t.me/c/…` links, and mtproto libraries (mtcute, gramjs) speak *bare* mtproto ids. the bot api hands out *marked* ids where the sign / `-100…` prefix encodes the peer kind. these helpers convert between the two and classify a marked id without a `getChat` round-trip

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

mapping: user `id` (positive) ↔ bare `id`; basic group `-id` ↔ bare `id`; supergroup/channel `-1000000000000 - id` ↔ bare `id`. `type` is coarse — `'channel'` covers **both** supergroups and broadcast channels, since they share the `-100…` marking and can't be told apart from the id alone

the converting helpers (`parsePeerId`, `toMtprotoId`, `getPeerType`, `toBotApiId`) throw `PeerIdError` on structurally-impossible input — `0`, `-1000000000000`, non-integers, unsafe integers; `toBotApiId` also rejects a non-positive bare id. the `isXId` guards return `false` instead. ranges are lenient (no upper-bound check), so a future telegram id-ceiling bump keeps working

---

## typescript usage

`@puregram/utils` ships its own `.d.ts`. the types you'll most likely import:

```ts
import type {
  AdminRight,
  AttachChatTarget,
  AttachChooseTarget,
  CasinoValue,
  DeepLinkChat,
  ParsedCommand,
  ParsedDeepLink,
  ParsedPeerId,
  PeerType,
  SlotMachineValue,
  StartAppOpts,
  StartOpts,
  WebAppMode,
  WebAppValidateParams
} from '@puregram/utils'
```

- **`CasinoValue`** — string-literal union of the four slot-machine symbols
- **`SlotMachineValue`** — `readonly [CasinoValue, CasinoValue, CasinoValue]`, the return type of `getCasinoValues`
- **`WebAppValidateParams`** — params object shape for `WebApp.validate`
- **`ParsedCommand`** — return shape of `parseCommand`
- **`ParsedDeepLink`** — discriminated return of `parseDeepLink` (`type` selects the variant)
- **`DeepLinkChat`** — `{ username }` or `{ id }`, the chat addressing inside a parsed `message` link
- **`ParsedPeerId`** — `{ type, id }`, the return shape of `parsePeerId` (`id` is the bare mtproto id)
- **`PeerType`** — `'user' | 'chat' | 'channel'`, the coarse peer kind (`'channel'` = supergroup or broadcast channel)
- **`AdminRight`** — closed enum of telegram admin right identifiers
- **`WebAppMode`** — `'compact' | 'fullscreen'`, for `deepLink.startApp`
- **`AttachChooseTarget`** — `'users' | 'bots' | 'groups' | 'channels'`, for `deepLink.startAttach`
- **`AttachChatTarget`** — discriminated target (`{ username }` or `{ phone }`) for `deepLink.attachInChat`
- **`StartOpts`**, **`StartGroupOpts`**, **`StartChannelOpts`**, **`StartAppOpts`**, **`StartAttachOpts`**, **`AttachInChatOpts`**, **`GameOpts`**, **`ShareOpts`**, **`VideoChatOpts`** — per-method option shapes for the `deepLink` builders
