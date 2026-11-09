---
title: '@puregram/flow'
description: conversational primitives for puregram — waitFor, prompt, collectMediaGroup, and persistent flows
---

# `@puregram/flow`

four primitives for "the bot needs to wait for something" use cases:

- **`waitFor(kind, opts)`** — pause your handler until a matching update arrives. timeout-aware, filterable, cancellable
- **`prompt(text, opts)`** — send a question and wait for the reply in one call
- **`collectMediaGroup(opts)`** — gather every message in an album before continuing
- **persistent flows** — same `prompt`/`waitFor` shape but the conversation state survives bot restarts, backed by any `KVStorage`

`@puregram/flow` supersedes `@puregram/prompt` from v2 and replaces the old `mergeMediaEvents` option

## install

::: code-group

```sh [yarn]
yarn add @puregram/flow
```

```sh [npm]
npm i -S @puregram/flow
```

```sh [pnpm]
pnpm add @puregram/flow
```

:::

then extend your `Telegram` instance once at startup:

```ts
import { Telegram } from 'puregram'
import { flow } from '@puregram/flow'

const tg = Telegram.fromToken(process.env.TOKEN!)
  .extend(flow())
```

`flow()` accepts an options object — see [options](#options) below

## quick start

```ts
import { Telegram } from 'puregram'
import { flow } from '@puregram/flow'

const tg = Telegram.fromToken(process.env.TOKEN!)
  .extend(flow())

tg.command('echo', async (message) => {
  await message.send('send me anything')

  const reply = await message.flow.waitFor('message', {
    timeout: 30_000,
    nullOnTimeout: true
  })

  if (reply === null) {
    return message.send('timed out')
  }

  return message.send(`you said: ${reply.text}`)
})

await tg.startPolling()
```

## two surfaces — `update.flow` and `tg.flow`

the plugin exposes every primitive in **two places**:

| surface | how to access | when to use |
|---|---|---|
| `update.flow` | `message.flow`, `callbackQuery.flow`, etc. | inside handlers — chat and sender are auto-derived from the incoming update |
| `tg.flow` | `telegram.flow` | outside handlers — cron jobs, webhook endpoints, or when you want to override the auto-derived scope |

`update.flow` is the form you want almost always. it auto-scopes `waitFor` and `prompt` to the same chat and the same sender so you never have to thread `chatId` / `userId` through the call:

```ts
// inside a handler
await message.flow.prompt("what's your name?")   // auto-scoped to this chat + this sender

// outside a handler (or explicit override)
await tg.flow.prompt(chatId, "what's your name?", { from: userId })
```

`update.flow` is attached to every update kind that carries a chat id in its payload: `message`, `edited_message`, `channel_post`, `edited_channel_post`, `business_message`, `edited_business_message`, `callback_query`, `chat_member`, `my_chat_member`, `chat_join_request`, and all message-derived service events (`new_chat_members`, `pinned_message`, `boost_added`, and many more)

`widget_query` and `shared_widget_query` also receive `flow`. message widget queries default to chat + sender; inline and shared-widget queries have no chat and default to sender-only matching. `prompt` on a chatless query requires an explicit `chat` override.

::: tip quick summary
every section below shows `update.flow` first, then the `tg.flow` equivalent. for handler code, always reach for `update.flow`
:::

## options

pass options to the `flow()` factory call:

```ts
tg.extend(flow({
  mediaGroupWindow: 1_500,           // ms; default 1000
  storage: new RedisStorage(...),    // required for persistent flows
  defaultTtl: 24 * 60 * 60 * 1000   // ms; default: no expiry
}))
```

| option | type | default | description |
|---|---|---|---|
| `mediaGroupWindow` | `number` (ms) | `1000` | sliding-window timeout used by `collectMediaGroup` |
| `storage` | `KVStorage<PersistedFlow>` | none | required for any persistent `waitFor`/`prompt` call. omit for ephemeral-only use |
| `defaultTtl` | `number` (ms) | none | TTL applied to persistent records when the call site doesn't pass `ttl`. absent and no per-call `ttl` means no expiry |

## see also

- [waiters](/plugins/flow/waiters) — `waitFor`, `match`, `waitForCallbackQuery`, `waitForCommand`, `waitForAny`
- [prompt](/plugins/flow/prompt) — send + waitFor in one call, chained multi-step flows
- [collect media group](/plugins/flow/collect-media-group) — album buffering
- [persistent flows](/plugins/flow/persistent-flows) — restart-safe flows backed by storage
- [plugins & .extend](/guide/concepts/plugins) — how `tg.extend` works in general
