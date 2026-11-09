<div align='center'>
  <img src='https://i.imgur.com/ZzjmE8i.png' />
</div>

<br />

<div align='center'>
  <a href='https://github.com/puregram/puregram'><b><code>puregram</code></b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#options'><b>options</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#combine-with-auto-retry'><b>combine with auto-retry</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='https://t.me/pureforum'><b>telegram forum</b></a>
</div>

## @puregram/throttler

_outbound rate-limit middleware for the `puregram` package — keeps your bot inside telegram's bot api limits_

### introduction

telegram enforces a few soft limits on outbound traffic:

- about **30 requests/second globally** per bot
- about **1 message/second per private chat**
- about **20 messages/minute per group/supergroup**

cross those and you get `429 Too Many Requests` with a `retry_after`, then eventually a tighter ban window. `@puregram/throttler` keeps you on the right side of the line by queuing outbound requests in front of the bot api lifecycle. it never drops payloads on its own — by default it just sleeps the caller until a slot frees up

each bucket is a **sliding window**: timestamps go in on acquire, expired ones drop off on every check, and the caller sleeps until the oldest in-window stamp leaves

### example

```ts
import { Telegram } from 'puregram'
import { throttler } from '@puregram/throttler'

const telegram = Telegram.fromToken(process.env.TOKEN!)
  .extend(throttler())

// hammer this however you want — the throttler queues for you
for (const id of userIds) {
  void telegram.api.sendMessage({ chat_id: id, text: 'hi' })
}

await telegram.startPolling()
```

### installation

```sh
$ yarn add @puregram/throttler
$ npm i -S @puregram/throttler
```

---

<a name='how-it-works'></a>
## how it works

`throttler()` registers a single `onBeforeRequest` hook at `'high'` priority. for every outbound bot api call:

1. the **global** bucket is acquired (`globalPerSec` per `1s`)
2. if the request targets a chat (`params.chat_id`), either the **per-chat** (private) or **per-group** bucket is acquired next
3. each acquire is serialised behind a per-bucket fifo mutex so concurrent callers get fair, deterministic ordering — no thundering-herd
4. on acquire, a timestamp is recorded; expired stamps are pruned on every check

methods in `excludeMethods` skip the whole pipeline. by default that's `getMe`, `getUpdates`, `getWebhookInfo`, `logOut`, `close` — control-plane calls that don't count toward send budgets

bot api 10.4 callback-only ephemeral replies still acquire the global bucket, but skip per-chat/per-group buckets: telegram ignores `chat_id` when the ephemeral receiver is omitted. a custom `extractChatId` can apply application-specific pacing.

---

<a name='combine-with-auto-retry'></a>
## combine with auto-retry

`puregram` core already has a flood-wait retry built in via the `retryOnFloodWait` option — on `429`, it sleeps for `retry_after` and retries the call. `@puregram/throttler` is the **proactive** half of the same problem: prevent the 429 in the first place. they compose cleanly:

```ts
import { Telegram } from 'puregram'
import { throttler } from '@puregram/throttler'

const telegram = Telegram.fromToken(process.env.TOKEN!, {
  // reactive — if we still get a 429, retry up to 3 times with a max wait of 30s
  retryOnFloodWait: { max: 3, maxWaitMs: 30_000 }
}).extend(
  // proactive — keep us under the per-chat / per-group limits to begin with
  throttler({
    globalPerSec: 25,        // pad below telegram's nominal 30 to leave headroom
    perChatPerSec: 1,
    perGroupPerMin: 20
  })
)

// the result: outbound bursts get smoothed by the throttler, and the rare
// 429 (e.g. on api-side bookkeeping drift) is caught by the core retry
await telegram.startPolling()
```

throttler's `onBeforeRequest` runs **before** the request is dispatched; the core retry loop runs **around** the dispatch itself. when a retry fires, it re-enters the lifecycle and re-acquires throttler slots, so the second attempt is also rate-limited

---

<a name='options'></a>
## options

```ts
throttler(options?: ThrottlerOptions)
```

| option | type | default | description |
|---|---|---|---|
| `globalPerSec` | `number` | `30` | global cap, requests/sec across the whole bot |
| `perChatPerSec` | `number` | `1` | per-private-chat cap, messages/sec |
| `perGroupPerMin` | `number` | `20` | per-group cap, messages/min |
| `perMethod` | `Record<string, { perChatPerSec?, perGroupPerMin? }>` | `{}` | per-method overrides of the per-chat / per-group caps. methods listed here get isolated buckets — see [per-method overrides](#per-method-overrides) |
| `extractChatId` | `(method, params) => number \| undefined` | tries `params.chat_id` | derive the chat id this call targets. return `undefined` to skip per-chat / per-group bucketing |
| `extractIsGroup` | `(chatId: number) => boolean` | `chatId < 0` | classify a chat id as a group/supergroup. telegram's convention is negative ids |
| `maxQueueDepth` | `number` | `Infinity` | per-bucket queue depth before backpressure |
| `mode` | `'queue' \| 'drop'` | `'queue'` | what to do when `maxQueueDepth` is reached. `'drop'` throws `ThrottlerDroppedError` |
| `excludeMethods` | `string[]` | `['getMe', 'getUpdates', 'getWebhookInfo', 'logOut', 'close']` | methods that bypass the throttler entirely |

---

<a name='per-method-overrides'></a>
## per-method overrides

different bot api methods have different real-world costs. `sendVideo` competes for upload bandwidth and you may want to pace it slower than `sendMessage`; `forwardMessage` is cheap on the bot side and can run faster than the default 1 msg/s/chat. pass a `perMethod` map to override the per-chat / per-group caps per method:

```ts
import { throttler } from '@puregram/throttler'

const telegram = Telegram.fromToken(TOKEN).extend(throttler({
  perChatPerSec: 1,              // catch-all for messages
  perGroupPerMin: 20,

  perMethod: {
    sendVideo: { perChatPerSec: 0.2 },          // 1 video every 5 seconds per chat
    sendMediaGroup: { perChatPerSec: 0.5 },     // 1 album every 2 seconds per chat
    forwardMessage: { perChatPerSec: 5 },       // looser than the default
    sendChatAction: { perChatPerSec: 10 }       // 'typing' indicator can pulse fast
  }
}))
```

semantics:

- methods listed in `perMethod` use **isolated** per-(method, chat) and per-(method, group) buckets — `sendVideo` stamps don't share a window with `sendMessage` even when both target the same chat
- unspecified fields fall back to the top-level defaults: `perMethod: { sendDocument: {} }` still isolates `sendDocument`'s buckets but with `perChatPerSec: 1` / `perGroupPerMin: 20`
- the global cap (`globalPerSec`) always applies on top of every method
- methods not listed continue to share the default per-chat / per-group buckets

caveat: telegram's actual per-chat throttle is method-agnostic — it counts every outbound message toward the same `1/sec/chat` budget. `perMethod` gives you stricter or looser pacing per method, but it doesn't *replicate* telegram's enforcement model exactly. for accurate enforcement of the bot api's 1/sec/chat, leave the default `perChatPerSec: 1` in place for `sendMessage` and only loosen `perMethod` for methods that are demonstrably exempt from the message budget.

---

## drop mode for backpressure

by default the throttler is patient — it'll queue forever. if you'd rather fail fast when downstream is hopelessly behind (e.g. a broadcast script that should bail out instead of holding gigabytes of pending payloads in memory), switch to `drop`:

```ts
import { throttler, ThrottlerDroppedError } from '@puregram/throttler'

const telegram = Telegram.fromToken(TOKEN).extend(throttler({
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

---

## tg.throttler — observability handle

```ts
interface ThrottlerExtension {
  /** count of callers currently parked across all buckets */
  readonly pending: number
  /** number of distinct per-chat windows currently tracked */
  readonly chatWindows: number
  /** number of distinct per-group windows currently tracked */
  readonly groupWindows: number
  /** drop expired buckets — happens implicitly on every acquire; useful in long-running tests */
  sweep: () => void
}
```

```ts
setInterval(() => {
  console.log('throttler pending:', telegram.throttler.pending)
}, 5_000)
```

---

## exported types

```ts
import {
  throttler,
  ThrottlerDroppedError,
  type ThrottlerExtension,
  type ThrottlerOptions,
  // sliding-window primitives, exported for advanced integrations / custom plugins
  createWindow,
  BucketRegistry,
  type SlidingWindow
} from '@puregram/throttler'
```
