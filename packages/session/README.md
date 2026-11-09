<div align='center'>
  <img src='https://i.imgur.com/ZzjmE8i.png' />
</div>

<br />

<div align='center'>
  <a href='https://github.com/puregram/puregram'><b><code>puregram</code></b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#typescript-usage'><b>typescript usage</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#options'><b>options</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='https://t.me/pureforum'><b>telegram forum</b></a>
</div>

## @puregram/session

_simple implementation of sessions for `puregram` package_. shortly, `puregram` sessions available to everyone!

### introduction

with `@puregram/session` you can keep a tiny bag of state for each active user and read/write to it from any handler — counters, half-filled forms, last-seen timestamps, whatever the bot needs. by default it lives in memory and disappears on restart, but you can swap in any redis / sqlite / file-on-disk / cloudflare-kv backend that implements the [`KVStorage<V>`](../storage) interface

every update gets `update.session` attached as a transparent proxy — assignments persist when the handler returns, no `save()` calls, no manual flushing

### example

```ts
import { Telegram } from 'puregram'
import { session } from '@puregram/session'

const telegram = Telegram.fromToken(process.env.TOKEN!)
  .extend(session()) // plug the plugin in

telegram.onMessage(async (message) => {
  const counter = (message.session.counter as number ?? 0) + 1

  message.session.counter = counter

  await message.send(`you sent ${counter} messages!`)
})

await telegram.startPolling()
```

`.extend(session())` does three things at install time:
- registers a high-priority `onUpdate` middleware that loads the user's data from storage, wraps it in a proxy, and attaches it as `update.session`;
- flushes any changes back to storage when the handler chain returns;
- exposes session values as `telegram.session` so you can read or evict keys outside an update context

### installation

```sh
$ yarn add @puregram/session
$ npm i -S @puregram/session
```

`@puregram/session` re-exports `MemoryStorage`, `LruMemoryStorage`, `isTtlStorage`, `KVStorage`, `TtlStorage`, and `LruMemoryStorageOptions` from [`@puregram/storage`](../storage) — you don't need to install `@puregram/storage` separately unless you want to share one storage instance across multiple plugins

---

## `ttl`

mark a session value as expiring after `t` ms — telegram will see it as gone once the timeout elapses, regardless of whether your storage backend supports ttl natively (the proxy checks per access):

```ts
import { ttl } from '@puregram/session'

message.session.user = ttl(user, 300_000)
// `message.session.user` will be deleted in 5 minutes if it isn't updated
```

once a key is marked ttl, you can mutate it like any normal value — every assignment **resets** the timer:

```ts
message.session.user = newUser
// key updated, ttl reset to the original 5 minutes
```

clear ttl by re-wrapping with `0`:

```ts
message.session.user = ttl(user, 0)
// becomes a regular non-expiring value
```

practical demo:

```ts
message.session.counter = ttl(0, 5_000)                    // counter = 0, expires in 5s
message.session.counter += 1                               // counter = 1, ttl reset to 5s
setTimeout(() => (message.session.counter += 1), 3_000)    // counter = 2, ttl reset to 5s
setTimeout(() => (message.session.counter += 1), 10_000)   // counter = NaN — value expired before the +1, undefined + 1 = NaN
```

```ts
message.session.counter = ttl(0, 5_000)                          // counter = 0
message.session.counter += 1                                     // counter = 1
message.session.counter = ttl(2, 0)                              // counter = 2 (ttl cleared)
message.session.counter += 1                                     // counter = 3
setTimeout(() => console.log(message.session.counter), 50_000)   // logs: 3
```

if your backend supports sliding-window expiry, `isTtlStorage(storage)` detects it and unchanged sessions are `touch()`'d after access. that renews the backend's whole-session timer, not individual field deadlines

field deadlines persist with the session across serialized storage and cold invocations. TTL-bearing records use a versioned outer envelope; user-object property names are not reserved, and `telegram.session.get` returns ordinary session data with expired fields removed. older plain records remain readable, but lost deadlines from older versions cannot be reconstructed. upgrade all processes sharing a session store together before writing the new TTL format — older session versions cannot read it

---

## `$forceUpdate`

`update.session` writes are flushed automatically when your handler returns. occasionally you'll want to persist mid-handler — long-running jobs, branches that may not return cleanly, sub-tasks dispatched to other workers. `update.session.$forceUpdate()` writes the current state to storage immediately:

```ts
telegram.onMessage(async (message) => {
  message.session.startedAt = Date.now()

  // persist now in case the long task below crashes or never returns
  await message.session.$forceUpdate()

  await runLongTask(message)
})
```

idempotent — you can call it as many times as you want

---

## direct storage access (`telegram.session`)

outside an update handler, `telegram.session` provides access without the auto-flushing proxy. it decodes persisted TTL records and removes expired fields before returning ordinary values; the raw backing store may contain the internal envelope:

```ts
await telegram.session.set('promo:flag', { active: true, until: Date.now() + 86_400_000 })

const flag = await telegram.session.get('promo:flag')

await telegram.session.delete('promo:flag')

const exists = await telegram.session.has('promo:flag')
```

bypasses the proxy and the ttl-marker layer — what you write is what you get when you read

---

<a name='typescript-usage'></a>
## typescript usage

`@puregram/session` extends every update kind with a `session: SessionContext` property by default, so you don't need to do anything special if you're fine with `Record<string, unknown>`:

```ts
import { session } from '@puregram/session'

const telegram = Telegram.fromToken(TOKEN).extend(session())

telegram.onMessage((message) => {
  // `message.session` is available — magic, isnt it?
  message.session.meaningOfLife = 42 // shower thoughts
})
```

want type precision? use **declaration merging** to widen the global `SessionData` interface:

```ts
import { session } from '@puregram/session'
import type { Telegram } from 'puregram'

declare module '@puregram/session' {
  interface SessionData {
    counter: number
    user?: { name: string }
  }
}

const telegram = Telegram.fromToken(TOKEN).extend(session({
  initial: () => ({ counter: 0 })
}))

telegram.onMessage((message) => {
  // message.session is now typed as SessionData & { $forceUpdate, [key: string]: unknown }
  message.session.counter++
  message.session.user = { name: 'alex' }
})
```

every plugin that augments `SessionData` (e.g. `@puregram/scenes` adds `__scene`) merges into the same global interface — your declaration sits next to theirs, no conflicts

---

<a name='options'></a>
## options

`session(options?)` accepts:

| option | type | description |
|---|---|---|
| `storage` | `KVStorage<unknown>` | backing store. default: a fresh `MemoryStorage<unknown>` (in-process, lost on restart). pass any [`KVStorage`](../storage) — including [`LruMemoryStorage`](../storage), redis adapter, sqlite, custom. `TtlStorage` (slide-window expiry) is auto-detected via `isTtlStorage` |
| `getStorageKey` | `(update) => string \| StorageKeyDescriptor \| undefined` | derives a composite key from the available chat and sender. return `undefined` to skip session attachment for an unkeyable update |
| `initial` | `(update) => SessionData` | initial value when the storage entry is missing. default: `() => ({})` |

### scoping by chat instead of by user

```ts
session({
  getStorageKey: (update) => {
    if ('chat' in update && update.chat !== undefined) {
      return `chat:${update.chat.id}`
    }

    return undefined
  }
})
```

### bounded in-memory cache

cap how many sessions live in memory at once — once the cap is hit, the least-recently-used user gets evicted:

```ts
import { LruMemoryStorage } from '@puregram/session'

session({
  storage: new LruMemoryStorage<unknown>({ max: 10_000 })
})
```

### persistent backend

```ts
import { session, type KVStorage } from '@puregram/session'

class JsonFileStorage<V> implements KVStorage<V> {
  // get/set/delete/has — read or write a json file
  // …
  async get (key: string): Promise<V | undefined> { /* … */ return undefined }
  async set (key: string, value: V) { /* … */ void value }
  async delete (key: string) { /* … */ void key }
  async has (key: string) { return false }
}

const telegram = Telegram.fromToken(TOKEN).extend(session({
  storage: new JsonFileStorage<unknown>('./sessions.json')
}))
```

> see [`@puregram/storage`](../storage) for the full `KVStorage<V>` / `TtlStorage<V>` contract and a redis-flavored example

---

## lazy loading

by default the middleware runs `storage.get` for every keyable update — fine for most bots, wasteful when most updates don't touch session. pass `lazy: true` to defer the load until `update.session` is actually accessed inside a handler:

```ts
session({ lazy: true })
```

in lazy mode `update.session` resolves to a thenable on first access — `await` it to receive the proxy:

```ts
telegram.onMessage(async (message) => {
  // 0 get, 0 set — early-return without touching session
  if (!message.text?.startsWith('/')) {
    return
  }

  const session = await message.session

  // 1 get; 1 set only if you actually mutate
  session.counter = (session.counter as number ?? 0) + 1
})
```

| handler | `storage.get` | `storage.set` |
|---|---|---|
| never accesses `update.session` | 0 | 0 |
| reads `update.session.<x>` only | 1 | 0 |
| writes `update.session.<x> = ...` | 1 | 1 |

note: lazy mode is opt-in because downstream plugins (e.g. `@puregram/scenes`) rely on synchronous `update.session.<key>` reads. when those plugins are loaded, leave `lazy` at its default (`false`)

---

## composite keys

`getStorageKey` can return a structured descriptor instead of a raw string. segments are normalised into `user:<id>:chat:<id>:thread:<id>:key:<value>`, omitting undefined parts:

```ts
session({
  getStorageKey: (update) => ({
    chat: update.chatId,
    user: update.from?.id,
    thread: update.messageThreadId
  })
})
```

| field | format |
|---|---|
| `user` | `user:<id>` |
| `chat` | `chat:<id>` |
| `thread` | `thread:<id>` — useful for forum-topic-scoped sessions |
| `key` | `key:<value>` — free-form trailing segment (workflow id, locale, etc) |

returning a raw `string` keeps the legacy behavior — used verbatim. returning `undefined` skips session attachment for that update

the default keyer is now `(u) => ({ chat: u.chatId, user: u.from?.id })`. when both segments are present, the storage key reads `user:<id>:chat:<id>` so the same user gets independent sessions across chats — pass a custom `getStorageKey` if you want the v2-style "session-per-user, regardless of chat" semantics

bot api 10.4 `widget_query` and `shared_widget_query` receive sessions too. a message widget query uses `user:<id>:chat:<id>`; inline and shared-widget queries have no chat, so their default key is `user:<id>`.

---

## exported types

```ts
import type {
  AnyUpdate,         // discriminated union of every wrapped update kind (bot-api + custom)
  KVStorage,         // re-exported from @puregram/storage
  SessionContext,    // shape of `update.session` — `SessionData & { $forceUpdate, [key: string]: unknown }`
  SessionData,       // user-augmentable interface (declare-merge to widen)
  SessionExtension,  // shape of `telegram.session`
  SessionOptions,    // options object accepted by `session({ … })`
  TtlData,           // internal ttl envelope (mostly for advanced use)
  TtlStorage,        // re-exported from @puregram/storage
  TtlWrapped         // return type of ttl(value)
} from '@puregram/session'
```
