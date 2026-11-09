<div align='center'>
  <img src='https://i.imgur.com/ZzjmE8i.png' />
</div>

<br />

<div align='center'>
  <a href='https://github.com/puregram/puregram'><b><code>puregram</code></b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#waitfor'><b>waitFor</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#waitfor-sugar'><b>callback/command sugar</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#waitforany'><b>waitForAny</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#prompt'><b>prompt</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#collectmediagroup'><b>media groups</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#persistent-flows'><b>persistent flows</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='https://t.me/pureforum'><b>telegram forum</b></a>
</div>

## @puregram/flow

_conversational primitives for `puregram` package — `waitFor`, `prompt`, `collectMediaGroup`, plus restart-safe persistent flows_

### introduction

four building blocks for "the bot has to wait for something to happen" use cases:

- **`waitFor(kind, opts)`** — pause your handler until a matching update arrives. timeout-aware, filterable, optionally consuming
- **`prompt(chat, text, opts)`** — send a question, wait for the answer. shorthand over `waitFor` with chat/from binding
- **`collectMediaGroup(message, opts)`** — gather every message in an album into one array. saves you the manual buffer + sliding-window logic
- **persistent flows** (`flow.handle(id, ...)` + `flow.prompt({ id })` / `flow.waitFor({ id })`) — same `prompt`/`waitFor` shape, but the conversation state survives bot restarts. backed by any [`KVStorage`](../storage)

`@puregram/flow` is `@puregram/prompt` + the v2 `mergeMediaEvents` option + `waitFor` (which v2 didn't have at all) — all rolled into one plugin

### example

```ts
import { Telegram } from 'puregram'
import { flow } from '@puregram/flow'

const telegram = Telegram.fromToken(process.env.TOKEN!)
  .extend(flow()) // don't forget

telegram.command('signup', async (message) => {
  if (message.from === undefined) {
    return
  }

  const name = await message.flow.prompt("what's your name?", {
    timeout: 60_000,
    nullOnTimeout: true
  })

  if (name === null) {
    return message.send('cancelled')
  }

  await message.send(`hi, ${name.text}`)
})

await telegram.startPolling()
```

### installation

```sh
$ yarn add @puregram/flow
$ npm i -S @puregram/flow
```

---

## two surfaces — `update.flow` and `telegram.flow`

`@puregram/flow` exposes the same three primitives in **two places**:

- **`update.flow.*`** — context-bound, attached to every incoming update by the plugin's `onUpdate` middleware. chat is auto-derived from the update; sender is auto-derived too (so prompts default to "wait for the same user who triggered the handler"). this is the form you want **inside handlers** — it's shorter and gets the binding right by default
- **`telegram.flow.*`** — the lower-level form that takes explicit `chat` / `from` arguments. use it **outside handlers** (cron jobs, webhook endpoints, anywhere there's no incoming update to bind to), or when you need to override the auto-derived scope

| inside a handler | outside a handler |
|---|---|
| `await message.flow.prompt('name?')` | `await telegram.flow.prompt(chatId, 'name?', { from })` |
| `await message.flow.waitFor('callback_query')` | `await telegram.flow.waitFor('callback_query', { filter: …, timeout })` |
| `await message.flow.collectMediaGroup()` | `await telegram.flow.collectMediaGroup(message)` |

`update.flow` is auto-attached on every update kind that has a chat in the payload — `message`, `edited_message`, `channel_post`, `edited_channel_post`, `business_message`, `edited_business_message`, `callback_query`, `chat_member`, `my_chat_member`, `chat_join_request`, plus all the message-derived service events (`new_chat_members`, `pinned_message`, `boost_added`, …)

bot api 10.4 widget queries also carry `flow`: `widget_query` uses its optional chat and sender, while `shared_widget_query` has only a sender. chatless queries default to sender-only matching; `prompt` still needs a chat override when no chat is available.

every section below leads with the `update.flow` form. the `telegram.flow` equivalent is shown next to it

---

<a name='waitfor'></a>
## `waitFor` — pause your handler

resolves with the next matching wrapped update of `kind`. by default throws `WaitForTimeout` on expiry; pass `nullOnTimeout: true` to get `null` instead

```ts
// inside a handler — auto-scoped to the same chat + same sender
telegram.command('echo', async (message) => {
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
```

### `match` — control the auto-scope

`update.flow.waitFor` accepts a `match` field that controls what the waiter gates on:

| `match` | meaning |
|---|---|
| `'chat+from'` (default when both extracted) | wait for an update from the same chat AND the same sender |
| `'chat'` (default when only chat extracted, e.g. channel posts) | wait for any update in the same chat |
| `'from'` (default when only sender extracted, e.g. shared widget queries) | wait for an update from the same user, across chats |
| `'none'` | no auto-scoping — only your `filter` runs |

```ts
// "anyone in this chat can reply" — drop the sender pin
const anyReply = await message.flow.waitFor('message', { match: 'chat' })

// strict pinning is the default; combine with your own filter for extra checks
const yes = await message.flow.waitFor('callback_query', {
  filter: (q) => q.data === 'yes'
})
```

### the lower-level form

`telegram.flow.waitFor(kind, options?)` is the un-bound version. use it from cron jobs, webhook endpoints, or when you want the cross-chat behavior auto-scope blocks:

```ts
const wait = await telegram.flow.waitFor('message', {
  filter: (m) => m.chat.id === someChatId && m.from?.id === someUserId,
  timeout: 30_000,
  nullOnTimeout: true
})
```

### options (apply to both forms)

| field | type | default | description |
|---|---|---|---|
| `filter` | `(update) => boolean` | `() => true` | extra predicate. on `update.flow.waitFor` it's AND-composed with the auto-scope; on `telegram.flow.waitFor` it's the only gate |
| `timeout` | `number` (ms) | `Infinity` | when to give up |
| `nullOnTimeout` | `boolean` | `false` | return `null` instead of throwing on timeout |
| `consume` | `boolean` | `true` | when matched, swallow the update so other handlers don't see it. set `false` if you want it to keep flowing |
| `validate` | `(update) => boolean \| string` | none | post-filter check. return `false` to silently re-wait, return a string to send that as feedback and re-wait |
| `transform` | `(update) => T` | identity | shape the matched update before resolving. promise type follows what you return |
| `signal` | `AbortSignal` | none | external cancellation channel. when fired, the waiter rejects with `WaiterAbortedError` and unregisters its listeners. pairs with `AbortSignal.timeout(...)` / `AbortSignal.any([...])` for shared deadlines |

### multiple waiters on the same update

if more than one `waitFor` matches the same update, **first registered wins** — others keep waiting (FIFO). locked semantics inherited from v2's prompt/waitFor

### errors

```ts
import { WaitForTimeout, WaitForCancelled } from '@puregram/flow'

try {
  const reply = await message.flow.waitFor('message', { timeout: 5_000 })

  void reply
} catch (error) {
  if (error instanceof WaitForTimeout) {
    console.log(`gave up after ${error.timeout}ms`)
  } else if (error instanceof WaitForCancelled) {
    console.log('cancelled by telegram.flow.cancelAll()')
  }
}
```

`telegram.flow.cancelAll()` rejects every pending waiter with `WaitForCancelled` — useful in shutdown / hot-reload paths

---

<a name='waitfor-sugar'></a>
## `waitForCallbackQuery` / `waitForCommand` — common-case shortcuts

two thin wrappers over `waitFor` that build the predicate for you. both accept every `WaitForOptions` knob (`timeout`, `nullOnTimeout`, `signal`, `consume`, `validate`, `transform`) via a second argument

### `waitForCallbackQuery(predicate?, options?)`

wait for the next callback query whose data matches `predicate`. omit `predicate` to match any callback query

```ts
telegram.command('confirm', async (message) => {
  await message.send('press the button', {
    reply_markup: {
      inline_keyboard: [[{ text: 'confirm', callback_data: 'confirm:yes' }]]
    }
  })

  const tap = await message.flow.waitForCallbackQuery(
    (q) => q.data === 'confirm:yes',
    { timeout: 30_000, nullOnTimeout: true }
  )

  if (tap === null) {
    return message.send('timed out')
  }

  await tap.answer()
  await message.send('confirmed')
})
```

`update.flow.waitForCallbackQuery` applies the same auto-scope (`'chat+from'` by default) as `update.flow.waitFor`. pass `match: 'chat'` for "anyone in this chat can tap"

### `waitForCommand(name, options?)`

wait for the next message whose text matches `/name`, `/name@bot`, or `/name <args>`. pass a RegExp to match arbitrary patterns:

```ts
telegram.command('start', async (message) => {
  await message.send('send /done when ready')

  const done = await message.flow.waitForCommand('done', {
    timeout: 60_000,
    nullOnTimeout: true
  })

  if (done === null) {
    return message.send('gave up on you')
  }

  await message.send('great!')
})

// regex form
const cancel = await message.flow.waitForCommand(/^\/(cancel|stop|abort)$/, {
  timeout: 30_000,
  nullOnTimeout: true
})
```

falls back to `caption` when `text` is undefined, so commands sent under media attachments still match

---

<a name='waitforany'></a>
## `waitForAny` — race multiple waiters

run several waiters in parallel and resolve on the **first** one to match. losers are cancelled (their listeners unregister so the registry stays clean — no memory leak):

```ts
import { spec } from '@puregram/flow'

const winner = await telegram.flow.waitForAny([
  spec('callback_query', { filter: (q) => q.data === 'confirm' }),
  spec('message', { filter: (m) => m.text === 'cancel' })
])

if (winner.index === 0) {
  // they tapped confirm — winner.value is the callback_query
  await winner.value.answer({ text: 'confirmed' })
} else {
  // they sent /cancel as a message
  await telegram.send(winner.value.chat.id, 'cancelled')
}
```

`{ index, value }` shape — `index` is the position in the input array, `value` is the matched (transform-aware) update for that spec

`spec(kind, options?)` is a small helper that preserves the literal `kind` so each spec's `filter` callback gets the precise `UpdateKindMap[K]` parameter type. plain object literals work too, you just have to type the filter parameters yourself

### combine with `AbortSignal` for a shared deadline

every waiter accepts `signal` so you can give the whole race a single timeout:

```ts
import { WaiterAbortedError } from '@puregram/flow'

const deadline = AbortSignal.timeout(30_000)

try {
  const winner = await message.flow.waitForAny(
    [
      { kind: 'callback_query', options: { filter: (q) => q.data === 'confirm' } },
      { kind: 'message' }
    ],
    { signal: deadline }
  )

  // …handle winner
} catch (error) {
  if (error instanceof WaiterAbortedError) {
    await message.send('took too long — try again')
  } else {
    throw error
  }
}
```

`waitForAny`'s top-level `signal` cancels every waiter at once. each spec may also carry its own per-waiter `signal` if you want finer control (e.g. one of them cancels itself after a shorter window). use `AbortSignal.any([signalA, signalB])` to combine

### error contract

| error | thrown when |
|---|---|
| `WaiterAbortedError` | a waiter's `signal` aborted, or the `waitForAny` signal aborted before any winner was decided |
| `WaitForCancelled` | losers of a `waitForAny` race; also fired by `telegram.flow.cancelAll()` |
| `WaitForTimeout` | a per-waiter `timeout` elapsed first (the others get cancelled) |

`WaiterAbortedError` carries the original `AbortController.abort(reason)` value under `error.cause`, mirroring the standard contract

---

<a name='prompt'></a>
## `prompt` — send + waitFor in one

```ts
telegram.command('signup', async (message) => {
  const reply = await message.flow.prompt("what's your name?", {
    timeout: 60_000,
    nullOnTimeout: true
  })

  if (reply === null) {
    return message.send('cancelled')
  }

  await message.send(`hi, ${reply.text}`)
})
```

`message.flow.prompt(text, options?)` does three things:
1. sends `text` to the same chat the message came from
2. opens a `waitFor` auto-scoped to that chat + the same sender
3. resolves with the matched reply (or `null` on timeout if `nullOnTimeout: true`)

### overriding the binding

```ts
// "anyone in chat" — drop the sender pin by setting `from: undefined` explicitly
await message.flow.prompt('react below', { from: undefined })

// reply in a different chat
await message.flow.prompt('reply over there', { chat: otherChatId })
```

> `from: undefined` set explicitly opts out. omitting `from` keeps the default sender pin

### the lower-level form

```ts
await telegram.flow.prompt(chatId, 'name?', { from: userId, timeout: 60_000, nullOnTimeout: true })
```

use this when you don't have an `update` to bind to — webhook endpoints, scheduled prompts triggered by something other than a telegram message, etc

### options (apply to both forms)

extends `WaitForOptions` with three prompt-specific knobs:

| field | type | default | description |
|---|---|---|---|
| `kind` | `keyof UpdateKindMap` | `'message'` | which update kind closes this prompt. set to `'callback_query'` to wait for a button tap |
| `from` | `number` | sender of the source update (auto-derived) | restrict to replies from a specific user id |
| `reply_markup` | `InlineKeyboardMarkup \| ...` | none | keyboard attached to the prompt message |

### chained prompts (multi-step)

```ts
telegram.command('signup', async (message) => {
  const name = await message.flow.prompt('name?', { nullOnTimeout: true })
  if (name === null) return

  const age = await message.flow.prompt('age?', { nullOnTimeout: true })
  if (age === null) return

  await message.send(`${name.text}, ${age.text}`)
})
```

each prompt's filter is composed independently — you don't accidentally "leak" the first answer into the second waiter

---

<a name='collectmediagroup'></a>
## `collectMediaGroup` — albums in one call

when a user sends an album, telegram delivers each item as a separate `MessageUpdate` with the same `media_group_id`. `collectMediaGroup` buffers them on a sliding-window basis and resolves with the full set:

```ts
telegram.onMessage(async (message) => {
  if (!message.hasMediaGroupId()) {
    return
  }

  const all = await message.flow.collectMediaGroup()

  await message.send(`got ${all.length} items in this album`)
})
```

resolves immediately with `[message]` if `media_group_id` is absent — safe to call defensively

### the lower-level form

`telegram.flow.collectMediaGroup(message, options?)` takes the source message explicitly — useful when you're handling a `MessageUpdate` you got from somewhere other than the dispatcher (e.g. injected via `tg.flow` from a worker)

### tuning the window

```ts
// plugin-level default — applies to every collectMediaGroup call without a per-call override
const telegram = Telegram.fromToken(TOKEN).extend(flow({ mediaGroupWindow: 2_000 }))

// per-call override
const all = await message.flow.collectMediaGroup({ window: 500 })
```

window is **sliding** — every new item resets the timer. defaults to `1000` ms. larger windows tolerate slower telegram backends; smaller windows resolve faster but risk truncating a slow-arriving album

---

<a name='persistent-flows'></a>
## persistent flows

ephemeral `prompt` / `waitFor` lives in memory — perfect for snappy single-handler flows, but a bot restart drops every pending prompt. for flows that must **survive restarts** (registration wizards, two-step purchases, anything where "user closes the app and comes back tomorrow" is a real path), use the persistent variant

setup:

```ts
import { Telegram } from 'puregram'
import { MemoryStorage } from '@puregram/storage'
import { flow, type PersistedFlow } from '@puregram/flow'

const telegram = Telegram.fromToken(process.env.TOKEN!)
  .extend(flow({
    storage: new MemoryStorage<PersistedFlow>(),  // swap for redis/sqlite/file in prod
    defaultTtl: 24 * 60 * 60 * 1000               // 24h default expiry
  }))
```

### `flow.handle(id, config)` — the resume body

declare the handler at module scope (or inside `install`, anywhere that runs once at bot startup). when a persisted record matching `id` resolves on a future update — *even after a restart* — the registered config fires:

```ts
telegram.flow.handle('register:age', {
  kind: 'message',
  validate: (m) => {
    const n = Number.parseInt(m.text ?? '', 10)

    return Number.isFinite(n) ? true : 'please send a number'
  },
  transform: (m) => Number.parseInt(m.text ?? '0', 10),
  onAnswer: async (age, ctx) => {
    const payload = ctx.payload as { name: string }

    await ctx.send(ctx.chatId, `${payload.name}, age ${age} ✓`)
  },
  onTimeout: async (ctx) => {
    await ctx.send(ctx.chatId, 'signup expired')
  }
})
```

`config` fields:

| field | type | description |
|---|---|---|
| `kind` | `keyof UpdateKindMap` | update kind that closes this prompt. defaults to `'message'`. mismatch with the call-site `kind` throws `FlowKindMismatch` |
| `validate` | `(update) => boolean \| string` | post-filter check; return `false` for silent re-wait, string for re-wait with feedback message |
| `transform` | `(update) => T` | shape the matched update into the value `onAnswer` receives |
| `onAnswer` | `(value, ctx) => Promise<void>` | **required** — the resume body |
| `onTimeout` | `(ctx) => Promise<void>` | runs once on `ttl` expiry |
| `filter` | `(update) => boolean` | optional secondary filter, AND-composed with the call-site filter |

### opening the persistent flow

call `flow.prompt({ id, payload, ttl })` or `flow.waitFor({ id, chatId, fromId, payload, ttl })`. the open call writes a record to storage and returns immediately — the registered handler resolves it on a future matching update:

```ts
telegram.command('signup', async (message) => {
  if (message.from === undefined) {
    return
  }

  await telegram.flow.prompt(message.chat.id, 'how old are you?', {
    id: 'register:age',
    payload: { name: message.from.firstName },
    ttl: 60 * 60 * 1000
  })
})
```

`flow.waitFor({ id })` is the no-prompt variant — useful for "press the button below" flows where you've already sent the message:

```ts
telegram.flow.handle('confirm:purchase', {
  kind: 'callback_query',
  onAnswer: async (q) => {
    await q.answer({ text: 'confirmed' })
  }
})

telegram.command('buy', async (message) => {
  if (message.from === undefined) {
    return
  }

  await telegram.flow.waitFor('callback_query', {
    id: 'confirm:purchase',
    chatId: message.chat.id,
    fromId: message.from.id
  })
})
```

### `FlowHandleContext` — what `onAnswer` and `onTimeout` get

```ts
interface FlowHandleContext {
  id: string                           // the registered handle id
  chatId: number                       // the chat the prompt was opened in
  fromId: number | undefined           // scoped user id, undefined when accepting any user in chat
  payload: unknown                     // verbatim from the prompt call site
  update: UpdateKindMap[K]             // the raw matched update (or the trigger update on timeout)

  open: (id, options?) => Promise<void> // chain into another persistent prompt — same shape as flow.prompt
  close: () => Promise<void>            // explicit early termination — drops the record, no onAnswer fires
  send: telegram.send                   // proxy onto telegram.send (NOT pre-bound to chatId — pass it explicitly)
}
```

`ctx.open(id, opts?)` is how you chain — registration step 1 calls `ctx.open('register:step2', { payload: { name } })` to advance, and **the bot can shut down between steps**. a year later, when the user replies, step 2's handler picks up

### typing the handler payloads

declare-merge `FlowHandlers` to type `payload` end-to-end:

```ts
declare module '@puregram/flow' {
  interface FlowHandlers {
    'register:age': { kind: 'message', payload: { name: string }, result: number }
    'register:step2': { kind: 'message', payload: { name: string, age: number }, result: void }
  }
}
```

### errors

| error | thrown when |
|---|---|
| `FlowPersistenceUnconfigured` | calling `flow.prompt({ id })` / `flow.waitFor({ id })` without `flow({ storage })` configured |
| `FlowHandlerMissing` | a persisted record resolves but no `flow.handle(id, ...)` was registered for that id |
| `FlowKindMismatch` | the `kind` in the call site differs from the kind registered on `flow.handle(...)` |
| `WaitForTimeout` | ephemeral `waitFor`/`prompt` exceeded `timeout` and `nullOnTimeout` is false |
| `WaitForCancelled` | `tg.flow.cancelAll()` was called |
| `WaiterAbortedError` | a waiter's `signal` (or `waitForAny`'s top-level `signal`) aborted before a match |

---

<a name='full-bots'></a>
## three full bots

every example below is self-contained — drop it in a file, set `BOT_TOKEN`, run

### bot 1 — three prompts in a row, no persistence

classic linear sign-up flow. each prompt waits on the same chat + same sender automatically; we never spell out chat/from. cancellation propagates by way of `nullOnTimeout`

```ts
import { Telegram } from 'puregram'
import { flow } from '@puregram/flow'

const telegram = Telegram.fromToken(process.env.BOT_TOKEN!)
  .extend(flow())

telegram.command('signup', async (message) => {
  const name = await message.flow.prompt("what's your name?", { nullOnTimeout: true, timeout: 60_000 })

  if (name === null) {
    return message.send('cancelled')
  }

  const age = await message.flow.prompt('how old are you?', { nullOnTimeout: true, timeout: 60_000 })

  if (age === null) {
    return message.send('cancelled')
  }

  const email = await message.flow.prompt('your email?', { nullOnTimeout: true, timeout: 60_000 })

  if (email === null) {
    return message.send('cancelled')
  }

  await message.send(`signed up: ${name.text}, ${age.text}, ${email.text}`)
})

await telegram.startPolling()
```

### bot 2 — persistent registration, survives restart

three steps chained via `ctx.open(...)`. handlers are registered at module scope (run once at boot); the actual conversation state lives in storage. **kill the bot between steps and it picks up where it left off**

```ts
import { Telegram } from 'puregram'
import { MemoryStorage } from '@puregram/storage'
import { flow } from '@puregram/flow'

const telegram = Telegram.fromToken(process.env.BOT_TOKEN!)
  .extend(flow({
    storage: new MemoryStorage(),         // swap for redis / sqlite / file in prod
    defaultTtl: 24 * 60 * 60 * 1000       // 24h default expiry
  }))

telegram.flow.handle('register:name', {
  onAnswer: async (msg, ctx) => {
    await ctx.open('register:age', { payload: { name: msg.text } })
  }
})

telegram.flow.handle('register:age', {
  validate: (m) => Number.isFinite(Number.parseInt(m.text ?? '', 10)) ? true : 'send a number',
  transform: (m) => Number.parseInt(m.text ?? '0', 10),
  onAnswer: async (age, ctx) => {
    const { name } = ctx.payload as { name: string }

    await ctx.open('register:email', { payload: { name, age } })
  }
})

telegram.flow.handle('register:email', {
  onAnswer: async (msg, ctx) => {
    const { name, age } = ctx.payload as { name: string, age: number }

    await ctx.send(ctx.chatId, `welcome, ${name} (${age}, ${msg.text})!`)
  },
  onTimeout: async (ctx) => {
    await ctx.send(ctx.chatId, 'sign-up expired — try /register again')
  }
})

telegram.command('register', async (message) => {
  await telegram.flow.prompt(message.chat.id, "what's your name?", {
    id: 'register:name',
    ttl: 60 * 60 * 1000
  })
})

await telegram.startPolling()
```

> **note**: `flow.prompt({ id })` only **opens** the prompt — it returns immediately after writing the storage record. the actual answer is delivered to the handler registered at `flow.handle(id, ...)`, which can run on a totally different process / hour / day. that's the whole point

### bot 3 — `waitFor` on inline buttons, no persistence

a rock-paper-scissors prompt that replies to whichever button the user taps. the keyboard goes out, the handler pauses on `waitFor('callback_query')` until any of the three buttons is tapped, then announces the choice

```ts
import { Telegram } from 'puregram'
import { flow } from '@puregram/flow'

const telegram = Telegram.fromToken(process.env.BOT_TOKEN!)
  .extend(flow())

telegram.command('poll', async (message) => {
  await message.send('rock, paper, or scissors?', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'rock', callback_data: 'rps:rock' },
          { text: 'paper', callback_data: 'rps:paper' },
          { text: 'scissors', callback_data: 'rps:scissors' }
        ]
      ]
    }
  })

  const tap = await message.flow.waitFor('callback_query', {
    filter: (q) => q.data?.startsWith('rps:') ?? false,
    timeout: 30_000,
    nullOnTimeout: true
  })

  if (tap === null) {
    return message.send('no choice — game over')
  }

  const choice = tap.data?.slice('rps:'.length)

  await tap.answer({ text: `you picked ${choice}` })
  await message.send(`you went with ${choice}`)
})

await telegram.startPolling()
```

`message.flow.waitFor` auto-scopes to the same chat **and** the same sender, so a third user clicking the buttons in a group chat doesn't hijack alice's poll. extra `filter: q.data?.startsWith('rps:')` rejects unrelated callback queries (other inline keyboards floating around the chat)

---

## options

`flow(options?)`:

| option | type | description |
|---|---|---|
| `mediaGroupWindow` | `number` (ms) | sliding-window timeout for `collectMediaGroup`. default `1000` |
| `storage` | `KVStorage<PersistedFlow>` | required for any `flow.prompt({ id })` / `flow.waitFor({ id })` usage. omit for ephemeral-only |
| `defaultTtl` | `number` (ms) | applied if a persistent call site doesn't pass `ttl`. absent + no per-call ttl = no expiry |

---

## `telegram.flow` interface reference

```ts
interface FlowExtension {
  /** ephemeral when called without `id`, persistent when called with `id` (requires storage) */
  waitFor: <K extends keyof UpdateKindMap, T = UpdateKindMap[K]> (
    kind: K,
    options?: WaitForOptions<K, T> & { id?: string, payload?, ttl?, chatId?, fromId? }
  ) => Promise<T | null>

  /** sugar: wait for the next callback_query matching `predicate` (default: any) */
  waitForCallbackQuery: (
    predicate?: (q: CallbackQueryUpdate) => boolean,
    options?: WaitForCallbackQueryOptions
  ) => Promise<CallbackQueryUpdate | null>

  /** sugar: wait for the next `/name` message (or a RegExp match against the text) */
  waitForCommand: (
    name: string | RegExp,
    options?: WaitForCommandOptions
  ) => Promise<MessageUpdate | null>

  /** race a list of waiter specs; first match wins, losers are cancelled */
  waitForAny: <S extends readonly WaiterSpec[]> (
    specs: S,
    options?: { signal?: AbortSignal }
  ) => Promise<{ index: number, value: /* matched spec result */ }>

  /** send a question, wait for the reply. ephemeral or persistent depending on `id` */
  prompt: <K extends keyof UpdateKindMap = 'message', T = UpdateKindMap[K]> (
    chat: number | string,
    text: string,
    options?: PromptOptions<K, T> & { id?: string, payload?, ttl? }
  ) => Promise<T | null>

  /** gather every message that shares a `media_group_id` with `message` */
  collectMediaGroup: (
    message: MessageUpdate,
    options?: CollectMediaGroupOptions
  ) => Promise<MessageUpdate[]>

  /** register a persistent flow handler — required before opening any persistent prompt */
  handle: <K extends keyof UpdateKindMap = 'message', T = UpdateKindMap[K]> (
    id: string,
    config: FlowHandleConfig<K, T>
  ) => void

  /** reject every pending in-memory waiter with WaitForCancelled. persistent records untouched */
  cancelAll: () => void
}
```

---

## exported types

```ts
import type {
  CollectMediaGroupOptions,    // options for collectMediaGroup
  FlowExtension,               // shape of telegram.flow
  FlowHandleConfig,            // arg to flow.handle()
  FlowHandleContext,           // ctx passed to onAnswer / onTimeout
  FlowHandlers,                // user-augmentable map for typed payloads
  FlowOptions,                 // options to flow({...})
  PersistedFlow,               // raw record stored under PersistentOpenOptions.id
  PersistentOpenOptions,       // options for ctx.open(...)
  PersistentPromptOptions,     // options for the persistent path of flow.prompt
  PersistentWaitForOptions,    // options for the persistent path of flow.waitFor
  PromptOptions,               // ephemeral flow.prompt options
  ValidateResult,              // validate() return contract: boolean | string
  WaitForOptions,              // ephemeral flow.waitFor options
  WaitForResult,               // mapped return type of waitFor based on nullOnTimeout
  WaitForCallbackQueryOptions, // options for flow.waitForCallbackQuery
  WaitForCommandOptions,       // options for flow.waitForCommand
  WaitForAnyOptions,           // options for flow.waitForAny ({ signal? })
  WaitForAnyResult,            // { index, value } shape returned by waitForAny
  WaiterSpec,                  // one entry of the waitForAny([...]) array

  Filter,                      // (update: U) => boolean — bare predicate (not the puregram Filter shape)
} from '@puregram/flow'
```
