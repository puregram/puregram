---
title: '@puregram/test'
description: actor-driven in-process test harness for puregram bots — drive fake users and chats, assert on api calls, stub responses, travel time
---

# `@puregram/test`

an in-process fake telegram. you write a real `Telegram` client, hand it to `createTestEnv`, and then pretend users send updates at your bot. the env records every outgoing api call so you can assert on what the bot did — no real http, no live bot account, runner-agnostic

## when to use

whenever you want to test bot logic in-process — handler dispatch, session/scene state, keyboard flows, rate-limit behavior. works with vitest, mocha, `node:test`, or anything else. `@puregram/test` is just a runtime; bring your own assertion library

## install

::: code-group

```sh [yarn]
yarn add -D @puregram/test
```

```sh [npm]
npm i -D @puregram/test
```

```sh [pnpm]
pnpm add -D @puregram/test
```

:::

usually a dev-only dep — tests need it, the bundle doesn't

## quick start

```ts
import { describe, expect, it } from 'vitest'
import { Telegram } from 'puregram'
import { createTestEnv } from '@puregram/test'

describe('echo bot', () => {
  it('replies with echo: <text>', async () => {
    const tg = new Telegram({ token: 'TEST' })
    const env = createTestEnv(tg)

    tg.onMessage(async (message) => {
      await tg.api.sendMessage({ chat_id: message.chat.id, text: `echo: ${message.text ?? ''}` })
    })

    const alice = env.createUser({ first_name: 'Alice' })

    await alice.sendMessage('hello')

    const last = env.lastApiCall('sendMessage')

    expect(last?.params).toMatchObject({
      chat_id: alice.pmChat.id,
      text: 'echo: hello'
    })

    await env.shutdown()
  })
})
```

::: tip
`'TEST'` is a valid token for test purposes — no validation happens against telegram's servers. all api calls are intercepted in-process
:::

## core api

### `createTestEnv(tg, options?)`

swaps in an intercepting http client on the provided `Telegram` instance and returns a `TestEnv`. the original http client is restored on `env.shutdown()`

```ts
import { Telegram } from 'puregram'
import { createTestEnv } from '@puregram/test'

const tg = new Telegram({ token: 'TEST' })
const env = createTestEnv(tg)
```

### actors

actors are the things that send updates to your bot

#### `env.createUser(options?)`

```ts
const alice = env.createUser({
  first_name: 'Alice',
  last_name: 'Smith',    // optional
  username: 'alice',     // optional
  language_code: 'en'    // optional
})
```

returns a `TestUser`. every user gets an auto-allocated id and a private-message chat at `alice.pmChat`

**sending updates as the user** — all methods dispatch into the matching `tg.on*` handler:

```ts
await alice.sendMessage('hello')
await alice.sendPhoto(buffer, { caption: 'cat' })
await alice.sendDocument(buffer)
await alice.sendVideo(buffer)
await alice.sendAudio(buffer)
await alice.sendVoice(buffer)
await alice.sendAnimation(buffer)
await alice.sendVideoNote(buffer)
await alice.sendSticker(stickerFileId)
await alice.sendLocation({ latitude: 55.75, longitude: 37.61 })
await alice.sendVenue({ latitude: 55.75, longitude: 37.61, title: 'Red Square', address: 'Moscow' })
await alice.sendContact({ phone_number: '+1234567890', first_name: 'Bob' })
await alice.sendPoll({ question: 'pick one', options: ['a', 'b'] })
await alice.sendDice('🎰')
```

without a chat argument each of these sends in the user's private-message chat (`alice.pmChat`)

**sending in a specific chat** — `alice.in(chat)` pre-binds to that chat:

```ts
const group = env.createChat({ type: 'group', title: 'devs' })

await alice.in(group).sendMessage('morning team')
await alice.in(group).sendPhoto(buffer, { caption: 'lunch' })
```

**tapping inline keyboard buttons** — `alice.on(message)` scopes callback-query taps to a specific message:

```ts
const reply = await alice.sendMessage('show me a button')

// the bot replied with an inline keyboard; alice taps "yes"
await alice.on(reply).tapButton('yes')

// or by raw callback_data
await alice.on(reply).tapInlineKeyboard('some:data')
```

#### `env.createChat(options)`

```ts
const group = env.createChat({ type: 'group', title: 'devs' })
const supergroup = env.createChat({ type: 'supergroup', title: 'big devs' })
const channel = env.createChat({ type: 'channel', title: 'News' })
```

returns a `TestChat`. four chat types: `'private'`, `'group'`, `'supergroup'`, `'channel'`

**channel posts** — channels send updates without a `from` user; use `chat.post(text)`:

```ts
const channel = env.createChat({ type: 'channel', title: 'News' })

await channel.post('breaking news')
// fires tg.onChannelPost — update.from is undefined
```

throws if called on a non-channel chat

**chat membership** — track who's in a chat for `getChatMember`-style tests:

```ts
group.setMembership(alice.id, { status: 'member', since: Date.now() })

const m = group.membershipOf(alice)
// m.status === 'member'
```

### assertions

every outgoing `tg.api.*` call is recorded as an `ApiCallRecord`

#### `env.apiCalls`

all calls in order:

```ts
env.apiCalls
// [
//   { method: 'sendMessage', params: { chat_id: 1, text: 'hi' }, at: 1717000000 },
//   …
// ]
```

#### `env.lastApiCall(method?)`

newest call, optionally filtered by method name:

```ts
const last = env.lastApiCall('sendMessage')
expect(last?.params).toMatchObject({ chat_id: alice.pmChat.id, text: 'echo: hello' })
```

#### `env.callsTo(method)`

every call to a specific method, oldest first:

```ts
expect(env.callsTo('sendMessage')).toHaveLength(1)
expect(env.callsTo('sendPhoto')).toHaveLength(0)
```

#### `env.clearApiCalls()`

drop the recording — useful between scenarios in a long-running test:

```ts
await alice.sendMessage('warmup')
env.clearApiCalls()

await alice.sendMessage('the actual case')
expect(env.callsTo('sendMessage')).toHaveLength(1)
```

### stubbing the api

without overrides the env returns plausible auto-stubs:

| method | auto-stub |
|---|---|
| `getMe` | a synthetic bot user (`{ id: <auto>, is_bot: true, first_name: 'TestBot', username: 'test_bot' }`) |
| `sendMessage` (and `sendX` siblings) | a plausible `Message` echoing back `chat_id` + relevant content |
| `answerCallbackQuery` / `answerShippingQuery` / `answerPreCheckoutQuery` | `true` |
| anything else | `STRICT_FALLBACK` — falls through to user override or (with `strictApi: true`) throws |

#### `env.onApi(method, reply, opts?)`

override a method's return value:

```ts
env.onApi('getMe', { id: 7, is_bot: true, first_name: 'MyBot', username: 'my_bot' })
```

`opts.times = 1` makes it one-shot — fires once, then falls back:

```ts
env.onApi('sendMessage', apiError(429, 'Too Many Requests', { retry_after: 1 }), { times: 1 })
env.onApi('sendMessage', { message_id: 1, date: 0, chat: { id: 1, type: 'private' } })
```

#### `apiError(code, description, parameters?)`

returns an error sentinel that makes the bot see a real bot-api error response:

```ts
import { apiError } from '@puregram/test'

env.onApi('sendMessage', apiError(403, 'Forbidden: bot was blocked by the user'))
```

`apiError(429, 'Too Many Requests', { retry_after: 30 })` for flood-wait responses with `parameters`

#### `env.offApi(method?)`

drop overrides for a method (or all methods):

```ts
env.offApi('sendMessage')   // drop sendMessage overrides
env.offApi()                // drop all overrides
```

### raw injection

`env.inject(raw)` ships an arbitrary bot-api update payload directly into the dispatcher — useful for exotic update shapes not yet covered by actor methods:

```ts
await env.inject({
  update_id: 1,
  message: {
    message_id: 1,
    date: 0,
    chat: { id: 100, type: 'private' },
    from: { id: 1, is_bot: false, first_name: 'Alice' },
    text: 'raw injection'
  }
})
```

### fixture builders

when you want to feed a raw payload into `env.inject(...)` without typing every required field, the fixture builders give you minimal-but-realistic shapes you can override field-by-field:

bot api 10.4 adds `buildWidgetQuery(overrides?)` and `buildSharedWidgetQuery(overrides?)`, plus actor methods `user.sendWidgetQuery(data, message, options?)`, `user.on(message).sendWidgetQuery(data, options?)`, and `user.sendSharedWidgetQuery(widgetId, data, options?)`. `options.type` accepts any official widget query type. inline/shared queries do not fabricate a chat; `answerWidgetQuery` auto-stubs to `true`.

```ts
import {
  buildCallbackQuery,
  buildChat,
  buildInlineQuery,
  buildMessage,
  buildUpdate,
  buildUser
} from '@puregram/test'

const alice = buildUser({ first_name: 'Alice' })
const group = buildChat({ type: 'group', title: 'devs', id: -1001 })

const msg = buildMessage({
  text: 'hello',
  from: { id: alice.id, first_name: alice.first_name },
  chat: group
})

await env.inject(buildUpdate('message', msg))
```

`buildUpdate(kind, payload)` is sugar for `{ update_id, [kind]: payload }` — the `kind` is typed against `TelegramUpdate` so typos surface at compile time

for deterministic ids across tests, call `resetFixtureCounters()` in `beforeEach`

### time travel — `env.advanceTime(ms)`

testing TTL expirations, flow deadlines, or rate-limit windows without real waits:

```ts
const env = createTestEnv(tg)

let fired = false

setTimeout(() => {
  fired = true
}, 60 * 60 * 1000)  // 1 hour

await env.advanceTime(3_600_000)
// fired === true
```

the clock is uninstalled automatically by `env.shutdown()`. for standalone use:

```ts
import { installTestClock } from '@puregram/test'

const clock = installTestClock(1_700_000_000_000)

setInterval(() => { /* … */ }, 1000)
await clock.advance(3500)    // fires 3 times
clock.restore()              // restore real globals
```

### hooks and teardown

`env.onPostInject(fn)` fires after every actor-driven update finishes dispatching:

```ts
env.onPostInject((rawUpdate) => {
  console.log('bot just finished processing:', rawUpdate)
})
```

`env.shutdown()` restores the original http client, runs `tg.shutdown()` (so plugin lifecycle hooks fire), and drains in-flight tasks. always call it in your test teardown:

```ts
afterEach(async () => {
  await env.shutdown()
})
```

## options

`createTestEnv(tg, options?)`:

| option | type | default | description |
|---|---|---|---|
| `strictMembership` | `boolean` | `false` | when `true`, actor methods throw `MembershipRequired` if the actor isn't a member of the target chat |
| `strictApi` | `boolean` | `false` | when `true`, an api call with no auto-stub and no override throws instead of returning `true` |
| `strictDispatch` | `boolean` | `false` | when `true`, actor calls fail if no handler matches the dispatched update |

## errors

| error | when |
|---|---|
| `MembershipRequired` | `strictMembership: true` and actor sends in a chat they aren't a member of |

```ts
import { MembershipRequired } from '@puregram/test'
```

## plugin packs

satellites can ship pre-canned test fixtures via `registerPack`:

```ts
import { registerPack, type PackFactory } from '@puregram/test'

const sessionPack: PackFactory = {
  pluginName: 'session',
  apply: (env, tg) => {
    // wire up env.storage, stub replies for session-touching methods, etc
  }
}

registerPack(sessionPack)
```

packs run once for every `createTestEnv(...)` whose `tg` has the matching plugin installed. `@puregram/test` ships subpath exports for the official plugin packs

## exported surface

```ts
import {
  apiError,               // (code, description, params?) => ApiErrorSentinel
  buildCallbackQuery,
  buildChat,
  buildInlineQuery,
  buildMessage,
  buildUpdate,
  buildUser,
  createTestEnv,          // (tg, opts?) => TestEnv
  FileStore,              // file-handle bookkeeping for custom actor methods
  installTestClock,       // standalone virtual clock
  isApiErrorSentinel,     // typeguard
  MembershipRequired,
  registerPack,
  resetFixtureCounters,
  TestChat,
  TestEnv,
  TestMessage,
  TestUser,
  TestUserInChat,
  TestUserOnMessage
} from '@puregram/test'

import type {
  ActorMediaInput,
  ApiCallRecord,
  ApiErrorSentinel,
  ChatMembership,
  ChatType,
  CreateUserOptions,
  FileHandle,
  PackFactory,
  ResolvedMedia,
  TestClock,
  TestEnvOptions,
  UpdateKind
} from '@puregram/test'
```

## see also

- [plugins & .extend](/guide/concepts/plugins) — how runtime plugins install; `@puregram/test` is **not** a `.extend(...)` plugin — it replaces the http transport directly
- [/api/methods](/api/methods) — the raw method names you pass to `env.lastApiCall` and `env.callsTo`
- [/examples](/examples) — runnable bot examples to adapt into test scenarios
