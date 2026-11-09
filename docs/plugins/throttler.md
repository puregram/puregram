---
title: '@puregram/throttler'
description: outbound rate-limiting plugin for puregram — queue api calls to keep your bot inside telegram's global and per-chat send limits
---

# `@puregram/throttler`

telegram enforces soft limits on outbound traffic: roughly **30 requests/second globally**, **1 message/second per private chat**, and **20 messages/minute per group/supergroup**. cross them and you get `429 Too Many Requests`, then tighter ban windows

`@puregram/throttler` keeps your bot on the right side of the line by queuing outbound requests before they reach the bot api lifecycle. it never drops payloads on its own — by default it sleeps the caller until a slot frees up

each bucket is a **sliding window**: timestamps go in on acquire, expired ones drop off on every check, the caller sleeps until the oldest in-window stamp leaves

## when to use

whenever you send messages at scale — broadcast scripts, notification pipelines, any bot that can receive bursts and needs to fan out replies without getting flood-banned. pair with `retryOnFloodWait` for full resilience

## install

::: code-group

```sh [yarn]
yarn add @puregram/throttler
```

```sh [npm]
npm i -S @puregram/throttler
```

```sh [pnpm]
pnpm add @puregram/throttler
```

:::

## quick start

```ts
import { Telegram } from 'puregram'
import { throttler } from '@puregram/throttler'

const telegram = Telegram.fromToken(process.env.TOKEN!)
  .extend(throttler())

// send to as many chats as you want — the throttler queues for you
for (const id of userIds) {
  void telegram.api.sendMessage({ chat_id: id, text: 'hi' })
}

await telegram.startPolling()
```

## how it works

`throttler()` registers a single `onBeforeRequest` hook at `'high'` priority. for every outbound api call:

1. the **global** bucket is acquired (`globalPerSec` slots per second across the whole bot)
2. if the call targets a chat (`params.chat_id`), either the **per-chat** (private) or **per-group** bucket is acquired next
3. each acquire is serialised behind a per-bucket fifo mutex — concurrent callers get fair, deterministic ordering
4. on acquire, a timestamp is recorded; expired stamps are pruned on every check

methods in `excludeMethods` skip the whole pipeline. the default set covers control-plane calls that don't count toward send budgets: `getMe`, `getUpdates`, `getWebhookInfo`, `logOut`, `close`

bot api 10.4 callback-only ephemeral replies still use the global bucket, but the default extractor skips per-chat/per-group buckets because telegram ignores `chat_id` when the ephemeral receiver is omitted.

## pair with auto-retry

`@puregram/throttler` is the **proactive** half of flood management — prevent the 429 in the first place. `retryOnFloodWait` is the **reactive** half — handle the rare 429 that still gets through. they compose cleanly:

```ts
import { Telegram } from 'puregram'
import { throttler } from '@puregram/throttler'

const telegram = Telegram.fromToken(process.env.TOKEN!, {
  // reactive: if a 429 still arrives, retry up to 3 times with a max wait of 30s
  retryOnFloodWait: { max: 3, maxWaitMs: 30_000 }
}).extend(
  // proactive: keep under per-chat / per-group limits
  throttler({
    globalPerSec: 25,      // a little below telegram's nominal 30 for headroom
    perChatPerSec: 1,
    perGroupPerMin: 20
  })
)

await telegram.startPolling()
```

when a retry fires it re-enters the lifecycle and re-acquires throttler slots — the second attempt is also rate-limited

## per-method overrides

different methods have different real-world costs. `perMethod` gives each listed method its own isolated chat/group bucket:

```ts
import { throttler } from '@puregram/throttler'

telegram.extend(throttler({
  perChatPerSec: 1,
  perGroupPerMin: 20,

  perMethod: {
    sendVideo:       { perChatPerSec: 0.2 },   // 1 video every 5 seconds per chat
    sendMediaGroup:  { perChatPerSec: 0.5 },   // 1 album every 2 seconds per chat
    forwardMessage:  { perChatPerSec: 5 },     // looser than the default
    sendChatAction:  { perChatPerSec: 10 }     // 'typing' can pulse fast
  }
}))
```

semantics:

- methods listed in `perMethod` use **isolated** per-(method, chat) and per-(method, group) buckets — `sendVideo` stamps don't share a window with `sendMessage` even when targeting the same chat
- unspecified fields fall back to the top-level defaults: `perMethod: { sendDocument: {} }` isolates `sendDocument`'s buckets but with `perChatPerSec: 1` / `perGroupPerMin: 20`
- the global cap always applies on top of per-method caps
- methods not listed share the default per-chat / per-group buckets

::: tip
telegram's actual per-chat throttle is method-agnostic — it counts every outbound message toward the same 1/sec/chat budget. `perMethod` gives you stricter or looser pacing per method, but it doesn't replicate telegram's enforcement model exactly. for a faithful 1/sec/chat, leave the default `perChatPerSec: 1` in place for `sendMessage` and only loosen `perMethod` for methods you know are exempt from the message budget
:::

## drop mode

by default the throttler is patient — it queues forever. if you'd rather fail fast when downstream is hopelessly behind (e.g. a broadcast script that should bail out instead of accumulating gigabytes of pending payloads), use `drop`:

```ts
import { throttler, ThrottlerDroppedError } from '@puregram/throttler'

telegram.extend(throttler({
  mode: 'drop',
  maxQueueDepth: 1_000
}))

for (const id of userIds) {
  try {
    await telegram.api.sendMessage({ chat_id: id, text: 'hi' })
  } catch (err) {
    if (err instanceof ThrottlerDroppedError) {
      console.warn('dropped', err.method, 'on', err.bucket)
      continue
    }

    throw err
  }
}
```

`ThrottlerDroppedError` carries `err.method` (the bot api method) and `err.bucket` (`'global'`, `'chat:<id>'`, or `'group:<id>'`)

## options

`throttler(options?)`:

| option | type | default | description |
|---|---|---|---|
| `globalPerSec` | `number` | `30` | global cap, requests/second across the whole bot |
| `perChatPerSec` | `number` | `1` | per-private-chat cap, messages/second |
| `perGroupPerMin` | `number` | `20` | per-group cap, messages/minute |
| `perMethod` | `Record<string, { perChatPerSec?, perGroupPerMin? }>` | `{}` | per-method overrides — methods listed here get isolated buckets |
| `extractChatId` | `(method, params) => number \| undefined` | tries `params.chat_id` | derive the target chat id. return `undefined` to skip per-chat / per-group bucketing |
| `extractIsGroup` | `(chatId: number) => boolean` | `chatId < 0` | classify a chat as a group/supergroup (telegram convention: negative ids) |
| `maxQueueDepth` | `number` | `Infinity` | per-bucket queue depth before backpressure — counted independently per bucket |
| `mode` | `'queue' \| 'drop'` | `'queue'` | what to do when `maxQueueDepth` is reached |
| `excludeMethods` | `readonly string[]` | `['getMe', 'getUpdates', 'getWebhookInfo', 'logOut', 'close']` | methods that bypass throttling entirely |

## `tg.throttler` — observability

```ts
interface ThrottlerExtension {
  readonly pending: number      // callers currently parked across all buckets
  readonly chatWindows: number  // distinct per-chat windows tracked
  readonly groupWindows: number // distinct per-group windows tracked
  sweep: () => void             // drop expired buckets (runs implicitly on acquire)
}
```

```ts
setInterval(() => {
  console.log('throttler pending:', telegram.throttler.pending)
}, 5_000)
```

## errors

| error | when |
|---|---|
| `ThrottlerDroppedError` | `mode: 'drop'` and `maxQueueDepth` is reached for a bucket |

```ts
import { ThrottlerDroppedError } from '@puregram/throttler'
```

`err.method` — the bot api method that was dropped
`err.bucket` — which bucket overflowed (`'global'`, `'chat:<id>'`, or `'group:<id>'`)

## exported surface

```ts
import {
  throttler,
  ThrottlerDroppedError,
  // sliding-window primitives — for advanced integrations or custom plugins
  createWindow,
  BucketRegistry
} from '@puregram/throttler'

import type {
  ThrottlerExtension,     // shape of tg.throttler
  ThrottlerOptions,
  SlidingWindow
} from '@puregram/throttler'
```

## see also

- [plugins & .extend](/guide/concepts/plugins) — how `.extend(plugin)` works
- [rate-limit plugin](/plugins/rate-limit) — inbound per-user rate limiting (cap how often users can trigger handlers)
- [/api/methods](/api/methods) — the raw method names that flow through the throttler
