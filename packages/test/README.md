<div align='center'>
  <img src='https://i.imgur.com/ZzjmE8i.png' />
</div>

<br />

<div align='center'>
  <a href='https://github.com/puregram/puregram'><b><code>puregram</code></b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#actors'><b>actors</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#assertions'><b>assertions</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#stubbing-the-api'><b>stubs</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='https://t.me/pureforum'><b>telegram forum</b></a>
</div>

## @puregram/test

_actor-driven test framework for `puregram` package — pretend users / chats / channels send updates to your bot, assert on the api calls it makes back_

### introduction

writing real tests for a telegram bot used to mean either mocking the http transport by hand, or wiring an entire integration suite against a real bot account. `@puregram/test` is the third option: **a fake telegram in-process**

- you instantiate a real `Telegram` client (no token magic — `'TEST'` is fine)
- `createTestEnv(tg)` swaps in an intercepting http client and returns an env you can poke at
- `env.createUser({ first_name: 'Alice' })` and `env.createChat({ type: 'group', title: 'devs' })` give you actors that *send updates to your bot* the same way real users would
- when the bot calls `tg.api.X(...)`, the env records every call (`env.apiCalls`, `env.lastApiCall(method)`, `env.callsTo(method)`) and replies with sensible auto-stubs (`getMe` returns a synthetic bot, `sendMessage` returns a plausible `Message`, etc)
- `env.onApi(method, reply)` overrides specific replies — including `apiError(403, 'Forbidden')` for error cases

works with `vitest`, `mocha`, `node:test`, anything. `@puregram/test` is just a runtime — bring your own assertion library

### example

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

### installation

```sh
$ yarn add -D @puregram/test
$ npm i -D @puregram/test
```

usually a dev-only dep — your tests need it, your bundle doesn't

---

<a name='actors'></a>
## actors

actors are the things that send updates **to your bot**. think of them as the cast of a play — your `tg.onMessage(...)` handlers are the bot reacting to whatever the cast does

### users — `env.createUser(options?)`

```ts
const alice = env.createUser({
  first_name: 'Alice',
  last_name: 'Smith',          // optional
  username: 'alice',           // optional
  language_code: 'en'          // optional
})
```

`alice` is a `TestUser`. every user gets an auto-allocated id (or pass `id` if you need a specific one) and a private-message chat exposed as `alice.pmChat`

#### sending updates as the user

every shape of incoming update has a corresponding actor method. these all dispatch into `tg.onMessage` / `tg.onCallbackQuery` / `tg.onInlineQuery` etc:

```ts
// PM (auto-uses alice.pmChat)
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

#### sending in a specific chat

`alice.in(chat)` returns a `TestUserInChat` scope that pre-binds every send method to that chat:

```ts
const group = env.createChat({ type: 'group', title: 'devs' })

await alice.in(group).sendMessage('morning team')
await alice.in(group).sendPhoto(buffer, { caption: 'lunch' })
```

#### callback queries on a specific message

`alice.on(message)` scopes callback-query taps to a specific message — typically the message that carried the inline keyboard:

```ts
const reply = await alice.sendMessage('show me a button')

// the bot replied with a message that has an inline keyboard;
// alice taps "yes" on it
await alice.on(reply).tapButton('yes')
```

`alice.on(message)` also exposes `tapInlineKeyboard(callbackData)` for raw callback_data taps

### chats — `env.createChat(options)`

```ts
const group = env.createChat({ type: 'group', title: 'devs' })
const supergroup = env.createChat({ type: 'supergroup', title: 'big devs', username: 'big_devs' })
const channel = env.createChat({ type: 'channel', title: 'News', username: 'news' })
```

a `TestChat` is just a passive container — actors send into it. four chat types: `'private'`, `'group'`, `'supergroup'`, `'channel'`

#### channel posts — `chat.post(text)`

channels send updates **without a `from` user** — that's the bot api's `channel_post` semantic. `chat.post(...)` dispatches one:

```ts
const channel = env.createChat({ type: 'channel', title: 'News' })

await channel.post('breaking news')
// fires tg.onChannelPost — `update.from` is undefined
```

throws if you call it on a non-channel chat

#### chat membership

every chat tracks who's in it — useful for `getChatMember` / `restrictChatMember` style tests:

```ts
group.setMembership(alice.id, { status: 'member', since: Date.now() })

const m = group.membershipOf(alice)
console.log(m?.status)  // 'member'
```

with `strictMembership: true` in `TestEnvOptions`, actors throw `MembershipRequired` if they try to send in a chat they're not a member of — useful for catching scopes you forgot to set up

---

## inject a raw update

sometimes you need to test a corner-case update shape that the actor api doesn't cover yet — a service event, a business connection, anything exotic. `env.inject(raw)` ships an arbitrary bot-api update payload directly into the dispatcher:

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

shapes its way through the same `update_id` dedup, the same dispatch chain, the same `update.session` / `update.scene` / etc augmentations that polled updates would

---

## fixture builders

when you want to feed a raw payload into `env.inject(...)` without typing out every required field, the fixture builders give you minimal-but-realistic shapes you can override field-by-field. each builder takes an optional `overrides` partial and applies it on top of the defaults — sequential ids, current unix time, `'private'` chats, `'test-user'` username, and so on

bot api 10.4 widgets are covered by `buildWidgetQuery(overrides?)` and `buildSharedWidgetQuery(overrides?)`. the inline fixture omits chat/message ids when `inline_message_id` is provided; shared queries never invent a chat. actors expose `user.sendWidgetQuery(data, message, options?)`, `user.on(message).sendWidgetQuery(data, options?)`, and `user.sendSharedWidgetQuery(widgetId, data, options?)`. `options.type` accepts every official widget query type. `answerWidgetQuery` has a `true` auto-stub.

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

// nested overrides are deep-merged with the defaults
const msg = buildMessage({
  text: 'hello',
  from: { id: alice.id, first_name: alice.first_name },
  chat: group
})

await env.inject(buildUpdate('message', msg))
```

`buildUpdate(kind, payload)` is just sugar for `{ update_id, [kind]: payload }` — the `kind` is typed against `TelegramUpdate` so typos surface at compile time

builders are state-light (just module-scoped counters for ids). if you want deterministic ids across tests, call `resetFixtureCounters()` in your suite's `beforeEach`

---

## time-travel — `env.advanceTime(ms)`

testing TTL expirations (session timeouts, flow `waitFor` deadlines, rate-limit windows) shouldn't require real waits. `env.advanceTime(ms)` installs a virtual clock that overrides `Date.now`, `setTimeout`, `setInterval` (and their `clear*` counterparts), then advances by `ms` milliseconds and fires every timer whose deadline falls inside the window

```ts
const env = createTestEnv(tg)

let fired = false

setTimeout(() => {
  fired = true
}, 60 * 60 * 1000)  // 1 hour

await env.advanceTime(3_600_000)
expect(fired).toBe(true)
```

interval timers re-arm and may fire multiple times in a single `advance` call. timers scheduled inside callbacks are picked up by the same call. the clock is uninstalled automatically by `env.shutdown()`, so the next test gets real timers back

for finer control there's also the standalone API:

```ts
import { installTestClock } from '@puregram/test'

const clock = installTestClock(1_700_000_000_000)

setInterval(() => {/* … */}, 1000)
await clock.advance(3500)        // fires 3 times
clock.restore()                  // restore real globals
```

---

<a name='assertions'></a>
## assertions

`@puregram/test` records every outgoing `tg.api.*` call — that's the surface you assert against

### `env.apiCalls`

every recorded call, in order:

```ts
console.log(env.apiCalls)
// → [
//   { method: 'sendMessage', params: { chat_id: 1, text: 'hi' }, at: 1717000000 },
//   { method: 'sendPhoto', params: { chat_id: 1, photo: 'attach://…' }, at: 1717000001 },
//   …
// ]
```

each entry is an `ApiCallRecord`:

```ts
interface ApiCallRecord {
  method: string
  params: Record<string, unknown>
  result?: unknown
  error?: { error_code: number, description: string, parameters?: object }
  at: number
}
```

### `env.lastApiCall(method?)`

newest call, optionally filtered by method:

```ts
const last = env.lastApiCall('sendMessage')

expect(last?.params).toMatchObject({ chat_id: alice.pmChat.id, text: 'echo: hello' })
```

### `env.callsTo(method)`

every call to a specific method, oldest first. useful for "did this fire exactly once" assertions:

```ts
expect(env.callsTo('sendMessage')).toHaveLength(1)
expect(env.callsTo('sendPhoto')).toHaveLength(0)
```

### `env.clearApiCalls()`

drop the recording — useful between scenarios in a long-running test:

```ts
await alice.sendMessage('warmup')
env.clearApiCalls()

await alice.sendMessage('the actual case')
expect(env.callsTo('sendMessage')).toHaveLength(1)
```

---

<a name='stubbing-the-api'></a>
## stubbing the api

without overrides, `@puregram/test` returns plausible auto-stubs:

| method | auto-stub |
|---|---|
| `getMe` | a synthetic bot user (`{ id: <auto>, is_bot: true, first_name: 'TestBot', username: 'test_bot' }`) |
| `sendMessage` (and `sendX` siblings) | a plausible `Message` echoing back `chat_id` + the relevant content |
| `answerCallbackQuery` / `answerShippingQuery` / `answerPreCheckoutQuery` | `true` |
| anything else | `STRICT_FALLBACK` — falls through to user override or, with `strictApi: true`, throws |

### `env.onApi(method, reply, opts?)` — override with a happy reply

```ts
env.onApi('getMe', { id: 7, is_bot: true, first_name: 'MyBot', username: 'my_bot' })

env.onApi('getChatMember', { user: { id: 1, is_bot: false, first_name: 'A' }, status: 'member' })
```

defaults to "reply with this every time"; `opts.times = 1` makes it one-shot (useful for "first call fails, second call succeeds" tests):

```ts
env.onApi('sendMessage', apiError(429, 'Too Many Requests', { retry_after: 1 }), { times: 1 })
env.onApi('sendMessage', { message_id: 1, date: 0, chat: { id: 1, type: 'private' } })
```

`opts.mutateWorld: true` keeps the world-state mutations (e.g. appending the synthetic message to chat history) even when the reply is overridden

### `apiError(code, description, parameters?)` — error sentinels

returning an `apiError(...)` from a stub makes the bot see a real bot-api error response:

```ts
import { apiError } from '@puregram/test'

env.onApi('sendMessage', apiError(403, 'Forbidden: bot was blocked by the user'))

tg.onMessage(async (m) => {
  try {
    await tg.api.sendMessage({ chat_id: m.chat.id, text: 'hi' })
  } catch (error) {
    // error.code === 403, error.message === 'Forbidden: bot was blocked by the user'
  }
})
```

`apiError(429, 'Too Many Requests', { retry_after: 30 })` for rate-limit responses with `parameters`. `isApiErrorSentinel(value)` is the typeguard if you need to inspect a stored override

### `env.offApi(method?)` — drop overrides

```ts
env.offApi('sendMessage')   // drop sendMessage's overrides
env.offApi()                // drop every override
```

---

## options

`createTestEnv(telegram, options?)`:

| option | type | description |
|---|---|---|
| `strictMembership` | `boolean` | when `true`, actor methods throw `MembershipRequired` if the actor isn't a member of the target chat. forces you to wire chat membership explicitly. default `false` |
| `strictApi` | `boolean` | when `true`, an api call with no auto-stub and no override throws. default `false` (auto-stubs cover the common methods, unmocked rare ones return undefined) |
| `strictDispatch` | `boolean` | when `true`, actor calls fail if no `tg.on*` handler matches the dispatched update — catches "i forgot to register the handler" bugs. default `false` |

---

## plugin packs

if you're testing a satellite plugin and want to ship pre-canned fixtures (typed storage views, stub replies for the methods that plugin always touches), `registerPack(...)` registers a factory that runs once for every `createTestEnv(...)` whose target `tg` has the plugin installed:

```ts
import { registerPack, type PackFactory } from '@puregram/test'

const sessionPack: PackFactory = {
  pluginName: 'session',
  apply: (env, tg) => {
    // wire up `env.storage` with a friendly view, stub a default getMe, etc
  }
}

registerPack(sessionPack)
```

the satellite's package can ship its own pack — `@puregram/test/session`, `@puregram/test/scenes` — and consumers get the fixtures by importing them. `@puregram/test` already ships subpath exports for the official plugin packs

---

## media in tests — `FileStore`

actor methods like `sendPhoto(buffer, ...)` need a `file_id` for the synthetic message they produce. `FileStore` does the bookkeeping — every `Buffer` / `Uint8Array` / pre-existing `file_id` you hand it gets registered as a `FileHandle`:

```ts
import { FileStore } from '@puregram/test'

const store = new FileStore()
const handle = store.registerBuffer(Buffer.from('fake photo'))
// → { file_id: 'sha256-…', file_unique_id: '…' }
```

normally the env owns its own store and you don't touch it — `alice.sendPhoto(Buffer.from('x'))` does this internally. reach for `FileStore` directly when you're building custom actor methods

---

## `env.onPostInject(fn)` — react to dispatched updates

a hook that fires after every actor-driven update finishes dispatching. useful for "the bot processed something — let me snapshot the world state" patterns:

```ts
env.onPostInject((rawUpdate) => {
  console.log('bot just finished processing:', rawUpdate)
})
```

multiple hooks compose; they fire in registration order

---

## tearing down

```ts
await env.shutdown()
```

restores the original http client, runs `tg.shutdown()` (so `onShutdown` plugin hooks fire), drains in-flight tasks. always call this in your test's teardown — `vitest`'s `afterEach`, `mocha`'s `afterEach`, etc

---

## `TestEnv` interface reference

```ts
class TestEnv<TG extends Telegram = Telegram> {
  readonly tg: TG
  readonly options: TestEnvOptions
  readonly apiCalls: ApiCallRecord[]
  storage: StorageViewWithRegister | undefined  // attached by plugin packs

  // actors
  createUser (options?: CreateUserOptions): TestUser
  createChat (options: { type: ChatType, title?: string, username?: string }): TestChat

  // raw injection
  inject (raw: Record<string, unknown>): Promise<void>
  onPostInject (fn: (raw: Record<string, unknown>) => Promise<void> | void): void

  // assertions
  lastApiCall (method?: string): ApiCallRecord | undefined
  callsTo (method: string): ApiCallRecord[]
  clearApiCalls (): void

  // stubs
  onApi (method: string, reply: unknown, opts?: { times?: number, mutateWorld?: boolean }): void
  offApi (method?: string): void

  // teardown
  shutdown (): Promise<void>
}
```

---

## exported types

```ts
import type {
  ActorMediaInput,           // shape accepted by actor sendPhoto/sendVideo/etc
  ApiCallRecord,             // single recorded api call
  ApiErrorSentinel,          // shape of apiError(...) returns
  ChatMembership,            // { status, since, customTitle? }
  ChatType,                  // 'private' | 'group' | 'supergroup' | 'channel'
  CreateUserOptions,         // options to env.createUser
  FileHandle,                // { file_id, file_unique_id }
  PackFactory,               // shape of a plugin pack passed to registerPack
  ResolvedMedia,             // env-internal resolved media descriptor
  TestEnvOptions             // strictMembership / strictApi / strictDispatch
} from '@puregram/test'

import {
  apiError,                  // (code, description, params?) => ApiErrorSentinel
  createTestEnv,             // factory: (tg, opts?) => TestEnv
  FileStore,                 // file-store class for custom actor methods
  isApiErrorSentinel,        // typeguard for stored sentinels
  MembershipRequired,        // thrown when strictMembership rejects a send
  registerPack,              // global plugin pack registration
  TestChat,                  // chat actor class
  TestEnv,                   // env class — you'll usually construct via createTestEnv
  TestMessage,               // synthesised message returned by actor sends
  TestUser,                  // user actor class
  TestUserInChat,            // returned by user.in(chat)
  TestUserOnMessage          // returned by user.on(message)
} from '@puregram/test'
```
