---
title: '@puregram/session'
description: per-user state that persists across messages — transparent proxy, auto-flush, lazy loading, composite keys, and pluggable storage backends
---

# `@puregram/session`

keep a bag of state for each user and read/write it from any handler — counters, half-filled forms, last-seen timestamps, whatever the bot needs. by default it lives in memory and vanishes on restart, but you can drop in any redis / sqlite / file-on-disk backend that satisfies [`KVStorage<V>`](/plugins/storage)

every update gets `update.session` attached as a transparent proxy — assignments persist when the handler returns, no `save()` calls, no manual flushing

## when to use

reach for `@puregram/session` any time you need state that spans multiple updates from the same user. it's also required by [`@puregram/scenes`](/plugins/scenes) and optionally by [`@puregram/flow`](/plugins/flow/) for persistent flows

## install

::: code-group

```sh [yarn]
yarn add @puregram/session
```

```sh [npm]
npm i -S @puregram/session
```

```sh [pnpm]
pnpm add @puregram/session
```

:::

## quick start

```ts
import { Telegram } from 'puregram'
import { session } from '@puregram/session'

const telegram = Telegram.fromToken(process.env.TOKEN!)
  .extend(session())

telegram.onMessage(async (message) => {
  const counter = (message.session.counter as number ?? 0) + 1

  message.session.counter = counter

  await message.send(`you sent ${counter} messages!`)
})

await telegram.startPolling()
```

`.extend(session())` does three things at install time:

- registers a high-priority `onUpdate` hook that loads the user's data from storage, wraps it in a proxy, and attaches it as `update.session`
- flushes any changes back to storage when the handler chain returns
- exposes session values as `tg.session` for out-of-handler access

## core api

### `update.session`

a transparent proxy over the stored session object. read and write it like a plain object — the plugin handles load and flush transparently

```ts
message.session.counter = 1
message.session.user = { name: 'alex' }

delete message.session.draft
```

nested plain objects and arrays are proxied recursively. class instances, `Map`, `Set`, `Date`, and other built-ins are stored by reference and not proxied — serialize them yourself if you need them to survive

### `update.session.$forceUpdate()`

writes the current session state to storage immediately, mid-handler. useful for long-running tasks or branches that might not return cleanly:

```ts
telegram.onMessage(async (message) => {
  message.session.startedAt = Date.now()

  await message.session.$forceUpdate()

  await runLongTask(message)
})
```

idempotent — safe to call multiple times

### `tg.session`

access without the auto-flushing proxy. `get` decodes persisted TTL records and removes expired fields before returning ordinary values; the raw backing `KVStorage` may contain an internal envelope. use it from cron jobs, webhooks from other services, or admin tooling:

```ts
await tg.session.set('promo:flag', { active: true })

const flag = await tg.session.get('promo:flag')

await tg.session.delete('promo:flag')

const exists = await tg.session.has('promo:flag')
```

### `ttl(value, t?)`

mark a session value to expire `t` ms after it was last set. the proxy checks per-access — no backend support required:

```ts
import { ttl } from '@puregram/session'

message.session.user = ttl(user, 300_000)
```

every subsequent assignment resets the timer:

```ts
message.session.user = newUser
```

clear ttl by re-assigning with `t = 0`:

```ts
message.session.user = ttl(user, 0)
```

if your backend supports sliding-window expiry, `isTtlStorage` detects it and unchanged sessions are `touch()`-d after access. that renews the backend's whole-session timer, not individual field deadlines

field deadlines persist across serialized storage and cold invocations. TTL-bearing records use a versioned outer envelope without reserving user-object property names. older plain records remain readable, but lost deadlines from older versions cannot be reconstructed. upgrade all processes sharing a session store together before writing the new format — older session versions cannot read it

## options

`session(options?)`:

| option | type | default | description |
|---|---|---|---|
| `storage` | `KVStorage<unknown>` | `new MemoryStorage()` | backing store. swap in any `KVStorage` — including `LruMemoryStorage`, `@puregram/storage-redis`, `@puregram/storage-sqlite`, or a custom adapter. `TtlStorage` (sliding-window expiry) is auto-detected via `isTtlStorage` |
| `getStorageKey` | `(update) => string \| StorageKeyDescriptor \| undefined` | `(u) => ({ chat: u.chat?.id, user: u.from?.id })` | how to derive the per-update storage key. `undefined` → skip session for that update |
| `initial` | `(update) => SessionData` | `() => ({})` | initial value when the storage entry is missing |
| `lazy` | `boolean` | `false` | when `true`, defers `storage.get` until `update.session` is accessed inside the handler — saves a get+set pair when the handler doesn't need session. **do not enable when `@puregram/scenes` is loaded** |

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

cap how many sessions live in memory — once the cap is hit, the least-recently-used entry gets evicted:

```ts
import { LruMemoryStorage } from '@puregram/session'

session({
  storage: new LruMemoryStorage({ max: 10_000 })
})
```

### persistent backend

```ts
import { session, type KVStorage } from '@puregram/session'

class JsonFileStorage<V> implements KVStorage<V> {
  async get (key: string): Promise<V | undefined> { return undefined }
  async set (key: string, value: V): Promise<void> {}
  async delete (key: string): Promise<void> {}
  async has (key: string): Promise<boolean> { return false }
}

const telegram = Telegram.fromToken(TOKEN).extend(session({
  storage: new JsonFileStorage('./sessions.json')
}))
```

### lazy loading

defer the `storage.get` until `update.session` is accessed:

```ts
session({ lazy: true })
```

in lazy mode, `update.session` is a thenable on first access — `await` it to get the proxy:

```ts
telegram.onMessage(async (message) => {
  if (!message.text?.startsWith('/')) {
    return
  }

  const session = await message.session

  session.counter = (session.counter as number ?? 0) + 1
})
```

| scenario | `storage.get` | `storage.set` |
|---|---|---|
| never accesses `update.session` | 0 | 0 |
| reads `update.session.x` only | 1 | 0 |
| writes `update.session.x = ...` | 1 | 1 |

::: warning lazy + scenes
do not enable `lazy: true` when `@puregram/scenes` is also loaded — scenes relies on synchronous `update.session.<key>` access inside its hook
:::

### composite keys

`getStorageKey` can return a `StorageKeyDescriptor` instead of a raw string. segments are joined as `user:<id>:chat:<id>:thread:<id>:key:<value>`, with undefined parts omitted:

```ts
session({
  getStorageKey: update => ({
    chat: update.chatId,
    user: update.from?.id,
    thread: update.messageThreadId
  })
})
```

| field | serializes as |
|---|---|
| `user` | `user:<id>` |
| `chat` | `chat:<id>` |
| `thread` | `thread:<id>` — forum-topic-scoped sessions |
| `key` | `key:<value>` — free-form trailing segment |

the default keyer produces `user:<id>:chat:<id>` — same user gets independent sessions in different chats. pass a custom `getStorageKey` to revert to v2-style per-user-regardless-of-chat behavior

bot api 10.4 message widget queries use the same composite key. inline and shared-widget queries have a sender but no chat, so their default session key is `user:<id>`.

## typescript

`@puregram/session` attaches `session: SessionContext` to every update kind via codegen — no setup needed if `Record<string, unknown>` is fine:

```ts
telegram.onMessage((message) => {
  message.session.anything = 42
})
```

declare-merge `SessionData` to get typed session fields:

```ts
declare module '@puregram/session' {
  interface SessionData {
    counter: number
    user?: { name: string }
  }
}
```

`message.session` is then typed as `SessionData & { $forceUpdate: () => Promise<void> } & { [key: string]: unknown }`

plugins like `@puregram/scenes` merge their own fields (e.g. `__scene`) into `SessionData` automatically — no conflicts

## errors

session itself throws no custom errors. storage adapters may throw on network/io failures — those propagate as-is. if `initial` throws, the error propagates from the `onUpdate` hook

## exported types

```ts
import type {
  AnyUpdate,
  KVStorage,
  LruMemoryStorageOptions,
  SessionContext,
  SessionData,
  SessionExtension,
  SessionOptions,
  StorageKeyDescriptor,
  TtlData,
  TtlStorage,
  TtlWrapped
} from '@puregram/session'
```

## see also

- [storage plugin](/plugins/storage) — the storage contract, built-in adapters, writing your own
- [scenes plugin](/plugins/scenes) — step-by-step wizards built on top of session
- [flow plugin](/plugins/flow/) — persistent flows also consume session storage
- [plugins & .extend](/guide/concepts/plugins) — how `.extend(plugin)` works
