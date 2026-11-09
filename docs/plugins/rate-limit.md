---
title: '@puregram/rate-limit'
description: per-user fixed-window inbound rate limiting for puregram — cap how many times a user can hit a command or handler within a sliding window
---

# `@puregram/rate-limit`

one user sending `/buy` 200 times a second is not a normal usage pattern. `@puregram/rate-limit` caps inbound traffic per user with a fixed-window counter — declaratively, with three opt-in shapes to fit whatever your handler needs

it registers **no global middleware on install**. instead it attaches `tg.rateLimit` and gives you three ways to gate: a filter, a middleware, or a direct imperative `check`. you decide what gets rate-limited and what doesn't

## when to use

- throttling specific commands (`/buy`, `/redeem`, `/search`) to prevent abuse
- capping per-user message volume in a particular handler
- applying different budgets to different action types from the same user
- raw-key counters for non-user gates (global resource locks, per-provider caps)

## install

::: code-group

```sh [yarn]
yarn add @puregram/rate-limit
```

```sh [npm]
npm i -S @puregram/rate-limit
```

```sh [pnpm]
pnpm add @puregram/rate-limit
```

:::

`@puregram/rate-limit` re-exports `MemoryStorage`, `LruMemoryStorage`, `KVStorage`, and `LruMemoryStorageOptions` from [`@puregram/storage`](/plugins/storage) — no separate install needed

## quick start

```ts
import { Telegram, and, filters } from 'puregram'
import { rateLimit, rateLimitFilter } from '@puregram/rate-limit'

const { command } = filters

const telegram = Telegram.fromToken(process.env.TOKEN!)
  .extend(rateLimit({
    onLimitExceeded: async (update, retryAfter) => {
      const u = update as { send?: (text: string) => Promise<unknown> }

      if (typeof u.send === 'function') {
        await u.send(`slow down — try again in ${retryAfter}s`)
      }
    }
  }))

// gate /buy to 5 hits per 60 seconds per user
telegram.onMessage(
  and(command('buy'), rateLimitFilter(telegram, { limit: 5, window: 60, bucket: 'buy' })),
  async (message) => {
    await message.send('purchase confirmed')
  }
)

await telegram.startPolling()
```

## three call shapes

### filter form — `rateLimitFilter(tg, opts)`

returns an async filter you compose with other filters. matches when the user is **under** budget; on block returns `false` and fires `onLimitExceeded` (per-call override > plugin-level > silent no-op):

```ts
import { and, filters } from 'puregram'
import { rateLimitFilter } from '@puregram/rate-limit'

const { command, hasText } = filters

telegram.onMessage(
  and(command('buy'), rateLimitFilter(telegram, { limit: 5, window: 60, bucket: 'buy' })),
  message => message.send('bought!')
)

telegram.onMessage(
  and(hasText, rateLimitFilter(telegram, { limit: 30, window: 60 })),
  message => message.send(`got: ${message.text}`)
)
```

::: warning
`rateLimitFilter` is a **side-effecting filter** — it writes to storage and may invoke user callbacks. compose it **last** in `and(...)` chains so cheaper structural filters short-circuit first. running the rate-limit check before confirming the update even matches the command wastes counter budget
:::

### middleware form — `rateLimitMiddleware(tg, opts)`

returns an `onUpdate` middleware that gates everything downstream. on block the update is swallowed after `onLimitExceeded` (if set):

```ts
import { filters } from 'puregram'
import { rateLimitMiddleware } from '@puregram/rate-limit'

// every message-kind update: 30 per minute per user
telegram.use(
  filters.kind.message,
  rateLimitMiddleware(telegram, { limit: 30, window: 60 })
)

telegram.onMessage(message => message.send('through!'))
```

unkeyable updates (no `from` / `senderChat` / `chat`) pass through untouched

### imperative form — `tg.rateLimit.check(update, opts)`

returns `Promise<number | null>` — `null` when allowed, retry-after seconds when blocked. does **not** fire `onLimitExceeded` — caller handles the response:

```ts
telegram.onMessage(async (message) => {
  if (!message.text?.startsWith('/buy ')) {
    return
  }

  const sku = message.text.slice('/buy '.length)
  const expensive = sku.startsWith('premium-')

  const wait = expensive
    ? await telegram.rateLimit.check(message, { limit: 1, window: 60, bucket: 'buy:premium' })
    : await telegram.rateLimit.check(message, { limit: 5, window: 60, bucket: 'buy' })

  if (wait !== null) {
    return message.send(`please wait ${wait}s`)
  }

  await message.send(`bought ${sku}`)
})
```

## buckets

every check takes an optional `bucket` string. counters are stored per `(userId, bucket)`, so one user can have independent budgets for different actions:

```ts
const waitBuy = await telegram.rateLimit.check(message, { limit: 5, window: 60, bucket: 'buy' })
const waitSell = await telegram.rateLimit.check(message, { limit: 5, window: 60, bucket: 'sell' })
```

`bucket` defaults to `'default'`. omit it for "one budget per user across everything"

widget and shared-widget queries (bot api 10.4) resolve the authoring user from `from.id`, including chatless inline/shared queries. they share that user's bucket across update kinds.

## raw key counters — `tg.rateLimit.hit(key, limit, window)`

for gates that aren't per-user — per-app, per-resource, per-anything:

```ts
// app-wide cap: 1000 ops per 60s regardless of user
const wait = await telegram.rateLimit.hit('global', 1000, 60)

if (wait !== null) {
  console.warn(`global limit hit, retry in ${wait}s`)
}

// per-resource cap, alongside the per-user one
await telegram.rateLimit.hit(`payment-provider:${providerId}`, 100, 60)
```

`check` and the filter/middleware shims use `hit` under the hood — they compose a `userKey:bucket` key and call through

## resetting a bucket

drop a counter explicitly — useful after a successful flow or a refund:

```ts
await telegram.rateLimit.reset('buy:12345')

// derive the same key the gate uses, then reset it
const key = telegram.rateLimit.resolveKey(message, 'buy')

if (key !== undefined) {
  await telegram.rateLimit.reset(key)
}
```

## options

### plugin-level — `rateLimit(options?)`

| option | type | default | description |
|---|---|---|---|
| `storage` | `KVStorage<RateLimitEntry>` | fresh `MemoryStorage<RateLimitEntry>` | backing store |
| `getStorageKey` | `(update) => string \| undefined` | `from.id ?? senderChat.id ?? chat.id` | derive the per-user key. return `undefined` to leave the update unkeyable (passes through filters/middleware untouched) |
| `onLimitExceeded` | `(update, retryAfter) => void \| Promise<void>` | silent no-op | plugin-level fallback, fires once per blocked update from filter/middleware paths |

### per-call — `RateLimitCheckOptions`

| field | type | default | description |
|---|---|---|---|
| `limit` | `number` | — | maximum hits permitted in the window |
| `window` | `number` | — | window length in **seconds** |
| `bucket` | `string` | `'default'` | sub-key — one user, multiple buckets = multiple independent counters |
| `onLimitExceeded` | `RateLimitCallback` | plugin-level fallback | per-call override. ignored by `tg.rateLimit.check` |

### scoping by chat

```ts
rateLimit({
  getStorageKey: (update) => {
    if ('chat' in update && update.chat !== undefined) {
      return `chat:${update.chat.id}`
    }

    return undefined
  }
})
```

### bounded memory

cap how many user counters live in memory at once. when the cap is hit, the least-recently-touched user is evicted:

```ts
import { LruMemoryStorage, type RateLimitEntry } from '@puregram/rate-limit'

rateLimit({
  storage: new LruMemoryStorage<RateLimitEntry>({ max: 50_000 })
})
```

## `tg.rateLimit` reference

```ts
interface RateLimitExtension {
  check: (update: AnyUpdate, opts: RateLimitCheckOptions) => Promise<number | null>
  hit: (key: string, limit: number, window: number) => Promise<number | null>
  reset: (key: string) => Promise<void>
  storage: KVStorage<RateLimitEntry>
  resolveKey: (update: AnyUpdate, bucket?: string) => string | undefined
  onLimitExceeded: RateLimitCallback | undefined
}
```

## exported surface

```ts
import {
  rateLimit,
  rateLimitFilter,
  rateLimitMiddleware,
  LruMemoryStorage,         // re-exported from @puregram/storage
  MemoryStorage             // re-exported from @puregram/storage
} from '@puregram/rate-limit'

import type {
  AnyUpdate,
  KVStorage,                // re-exported from @puregram/storage
  LruMemoryStorageOptions,  // re-exported from @puregram/storage
  RateLimitCallback,
  RateLimitCheckOptions,
  RateLimitEntry,           // { hits: number, resetAt: number }
  RateLimitExtension,       // shape of tg.rateLimit
  RateLimitOptions,
  RateLimitOutcome          // { allowed: true } | { allowed: false, retryAfter: number }
} from '@puregram/rate-limit'
```

## see also

- [storage plugin](/plugins/storage) — `KVStorage<V>` contract and persistent backends
- [plugins & .extend](/guide/concepts/plugins) — how `.extend(plugin)` works
- [dispatch & filters](/guide/handling-updates/dispatch-and-filters) — composing filters with `and(...)`
- [throttler plugin](/plugins/throttler) — outbound rate limiting (keep your bot inside telegram's send limits)
- [/api/methods](/api/methods) — raw bot api methods
