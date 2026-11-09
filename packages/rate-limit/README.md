<div align='center'>
  <img src='https://i.imgur.com/ZzjmE8i.png' />
</div>

<br />

<div align='center'>
  <a href='https://github.com/puregram/puregram'><b><code>puregram</code></b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#three-shapes'><b>three shapes</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#options'><b>options</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='https://t.me/pureforum'><b>telegram forum</b></a>
</div>

## @puregram/rate-limit

_per-user fixed-window rate limiting for `puregram` package_

### introduction

your bot ships, hits the front page, and ten seconds later one user is sending `/buy` 200 times a second. `@puregram/rate-limit` caps that — declaratively, per-user, with a key derivation that just works for messages, callback queries, channel posts, business bots, etc

it's a **fixed-window counter**: each user has a bucket that allows `limit` hits within `window` seconds. one bucket per `(userId, bucketName)` pair, so the same user can have independent limits for `/buy`, `/sell`, etc

bot api 10.4 widget and shared-widget queries use `from.id`, so their checks share the same user's bucket even when a query has no chat. limits remain opt-in; installing the plugin alone does not gate widget queries.

unlike many rate-limit plugins, `@puregram/rate-limit` registers **no global middleware on install**. instead it attaches `telegram.rateLimit` and gives you three opt-in ways to gate: a filter, a middleware, or a direct imperative `check`. you decide where the gate lives — what gets rate-limited and what doesn't is your call

### example

```ts
import { Telegram, and, filters } from 'puregram'
import { rateLimit, rateLimitFilter } from '@puregram/rate-limit'

const { command } = filters

const telegram = Telegram.fromToken(process.env.TOKEN!)
  .extend(rateLimit({
    onLimitExceeded: async (update, retryAfter) => {
      // the wrapped update has .send(...) on every kind that has a chat
      const u = update as { send?: (text: string) => Promise<unknown> }

      if (typeof u.send === 'function') {
        await u.send(`slow down — try again in ${retryAfter}s`)
      }
    }
  }))

// gate /buy to 5 hits per 60s per user
telegram.onMessage(
  and(command('buy'), rateLimitFilter(telegram, { limit: 5, window: 60, bucket: 'buy' })),
  async (message) => {
    await message.send('purchase confirmed')
  }
)

await telegram.startPolling()
```

### installation

```sh
$ yarn add @puregram/rate-limit
$ npm i -S @puregram/rate-limit
```

> `@puregram/rate-limit` re-exports `MemoryStorage`, `LruMemoryStorage`, `KVStorage`, and `LruMemoryStorageOptions` from [`@puregram/storage`](../storage) — you don't need to install `@puregram/storage` separately

---

<a name='three-shapes'></a>
## three call shapes — pick the right one

### filter form — `rateLimitFilter(tg, opts)`

returns an async filter you compose with structural filters. matches when **under** budget; on block returns false and fires `onLimitExceeded` (per-call > plugin-level > silent no-op). use this when the gate is part of a handler's match condition:

```ts
import { and, filters } from 'puregram'
import { rateLimitFilter } from '@puregram/rate-limit'

const { command, hasText } = filters

telegram.onMessage(
  and(command('buy'), rateLimitFilter(telegram, { limit: 5, window: 60, bucket: 'buy' })),
  (message) => message.send('bought!')
)

telegram.onMessage(
  and(hasText, rateLimitFilter(telegram, { limit: 30, window: 60 })),
  (message) => message.send(`got: ${message.text}`)
)
```

⚠ **side-effecting filter** — writes to storage and may invoke user callbacks. compose it **last** in `and(...)` chains so cheaper structural filters short-circuit first. running `rateLimitFilter` against every update before checking the command match wastes counter space

### middleware form — `rateLimitMiddleware(tg, opts)`

returns an `onUpdate` middleware that gates everything **downstream**. on block, the update is silently swallowed (after `onLimitExceeded` if set). use this when you want one global cap on a whole class of updates:

```ts
import { filters } from 'puregram'
import { rateLimitMiddleware } from '@puregram/rate-limit'

// every message-kind update: 30/min/user
telegram.use(
  filters.kind.message,
  rateLimitMiddleware(telegram, { limit: 30, window: 60 })
)

telegram.onMessage((message) => message.send('through!'))
```

unkeyable updates (no `from`/`senderChat`/`chat`) pass through untouched

### imperative form — `telegram.rateLimit.check(update, opts)`

returns `Promise<number | null>` — `null` when allowed, retry-after seconds when blocked. doesn't fire `onLimitExceeded`; you write the response yourself. use this when the gate decision is conditional on something only the handler knows:

```ts
telegram.onMessage(async (message) => {
  if (!message.text?.startsWith('/buy ')) {
    return
  }

  const sku = message.text.slice('/buy '.length)
  const expensive = sku.startsWith('premium-')

  // tighter bucket for premium SKUs
  const wait = expensive
    ? await telegram.rateLimit.check(message, { limit: 1, window: 60, bucket: 'buy:premium' })
    : await telegram.rateLimit.check(message, { limit: 5, window: 60, bucket: 'buy' })

  if (wait !== null) {
    return message.send(`please wait ${wait}s`)
  }

  await message.send(`bought ${sku}`)
})
```

---

## buckets — independent counters per command

every check takes an optional `bucket` string. `@puregram/rate-limit` stores `(userId, bucket)` pairs as separate counters, so the same user can have independent budgets:

```ts
telegram.onMessage(async (message) => {
  if (message.text === '/buy') {
    const wait = await telegram.rateLimit.check(message, { limit: 5, window: 60, bucket: 'buy' })
    if (wait !== null) return
    // …
  }

  if (message.text === '/sell') {
    const wait = await telegram.rateLimit.check(message, { limit: 5, window: 60, bucket: 'sell' })
    if (wait !== null) return
    // …
  }
})
```

`bucket` defaults to `'default'`. omit it for "one budget per user across everything"

---

## global counters — `tg.rateLimit.hit(key, limit, window)`

sometimes the gate isn't per-user — it's per-app, per-resource, per-anything. `hit` is the raw bucket primitive: pass any string key, get back `null` when allowed or retry-after seconds when blocked:

```ts
// app-wide cap: 1000 ops per 60s, regardless of user
const wait = await telegram.rateLimit.hit('global', 1000, 60)

if (wait !== null) {
  console.warn(`global limit hit, retry in ${wait}s`)
}

// per-resource cap, on top of the per-user one
await telegram.rateLimit.hit(`payment-provider:${providerId}`, 100, 60)
```

`hit` is what `check` and the filter/middleware shims use under the hood — they just compose a `userKey:bucket` string and call into it

---

## resetting a bucket

drop a counter explicitly — useful after a successful flow, refunds, etc:

```ts
// clear after a legit purchase so retry budget resets
await telegram.rateLimit.reset('buy:12345')

// keys are `<bucket>:<userKey>`. derive the same key the gate uses:
const key = telegram.rateLimit.resolveKey(message, 'buy')

if (key !== undefined) {
  await telegram.rateLimit.reset(key)
}
```

---

## `onLimitExceeded`

invoked once per blocked update **except** in the imperative `check` form (where you're already controlling the response). resolves order: per-call override > plugin-level fallback > silent no-op:

```ts
// plugin-level fallback
const telegram = Telegram.fromToken(TOKEN).extend(rateLimit({
  onLimitExceeded: async (update, retryAfter) => {
    const u = update as { send?: (text: string) => Promise<unknown> }

    if (typeof u.send === 'function') {
      await u.send(`whoa, slow down — try again in ${retryAfter}s`)
    }
  }
}))

// per-call override
telegram.onMessage(
  rateLimitFilter(telegram, {
    limit: 5,
    window: 60,
    bucket: 'buy',
    onLimitExceeded: (_update, retryAfter) => {
      console.log(`buy gate hit at ${retryAfter}s`)
    }
  }),
  handler
)
```

`update` is typed as `AnyUpdate` — every wrapped update kind plus custom updates. cast or check `'send' in update` if you want to reply

---

<a name='options'></a>
## options

### plugin-level — `rateLimit(options?)`

| option | type | description |
|---|---|---|
| `storage` | `KVStorage<RateLimitEntry>` | backing store. default: a fresh `MemoryStorage<RateLimitEntry>`. swap in `LruMemoryStorage` for bounded memory, redis/sqlite/etc for persistence across restarts |
| `getStorageKey` | `(update) => string \| undefined` | how to derive the per-user key. default: `from.id ?? senderChat.id ?? chat.id`. return `undefined` to leave that update unkeyable (passes through filters/middleware untouched) |
| `onLimitExceeded` | `(update, retryAfter) => void \| Promise<void>` | plugin-level fallback callback. fires once per blocked update from filter/middleware paths |

### per-call — `RateLimitCheckOptions`

passed to `rateLimitFilter(tg, opts)`, `rateLimitMiddleware(tg, opts)`, and `tg.rateLimit.check(update, opts)`:

| field | type | description |
|---|---|---|
| `limit` | `number` | maximum hits permitted in the window |
| `window` | `number` | window length in **seconds** |
| `bucket` | `string` | sub-key. default `'default'`. one user, multiple buckets = multiple independent counters |
| `onLimitExceeded` | `RateLimitCallback` | per-call override of the plugin-level callback. ignored by `tg.rateLimit.check` (imperative caller handles the block) |

### scoping by chat instead of by user

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

cap how many user counters live in memory at once — once the cap is hit, the least-recently-touched user gets evicted (so they regain their budget early, which is the right failure mode for spam-prevention):

```ts
import { LruMemoryStorage, type RateLimitEntry } from '@puregram/rate-limit'

rateLimit({
  storage: new LruMemoryStorage<RateLimitEntry>({ max: 50_000 })
})
```

### persistent backend

```ts
import type { KVStorage, RateLimitEntry } from '@puregram/rate-limit'

class RedisStorage implements KVStorage<RateLimitEntry> {
  // get/set/delete/has — see @puregram/storage
}

rateLimit({ storage: new RedisStorage() })
```

see [`@puregram/storage`](../storage) for the full `KVStorage<V>` contract

---

## `telegram.rateLimit` reference

```ts
interface RateLimitExtension {
  /** gate an update on a per-call budget. doesn't invoke onLimitExceeded — caller writes the response */
  check: (update: AnyUpdate, opts: RateLimitCheckOptions) => Promise<number | null>

  /** raw bucket access for arbitrary keys (global counters, per-resource gates) */
  hit: (key: string, limit: number, window: number) => Promise<number | null>

  /** drop the counter for `key`. no-op if absent */
  reset: (key: string) => Promise<void>

  /** the configured KVStorage<RateLimitEntry> instance — direct read access if you need it */
  storage: KVStorage<RateLimitEntry>

  /** same key check would derive — useful when you want to reset it from outside */
  resolveKey: (update: AnyUpdate, bucket?: string) => string | undefined

  /** plugin-level fallback callback — filter/middleware shims call it on block */
  onLimitExceeded: RateLimitCallback | undefined
}
```

---

## exported types

```ts
import type {
  AnyUpdate,             // wrapped update union (bot-api + custom)
  KVStorage,             // re-exported from @puregram/storage
  LruMemoryStorageOptions, // re-exported from @puregram/storage
  RateLimitCallback,     // (update, retryAfter) => void | Promise<void>
  RateLimitCheckOptions, // per-call options
  RateLimitEntry,        // { hits, resetAt }
  RateLimitExtension,    // shape of telegram.rateLimit
  RateLimitOptions,      // plugin-level options
  RateLimitOutcome       // internal { allowed: boolean, retryAfter? } shape
} from '@puregram/rate-limit'
```
