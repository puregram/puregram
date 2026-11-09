---
title: waiters — @puregram/flow
description: waitFor, match auto-scope, waitForCallbackQuery, waitForCommand, and waitForAny with AbortSignal deadlines
---

# waiters

`waitFor` is the core building block of `@puregram/flow`. it pauses your handler until a matching update arrives, then resolves with that update

## `waitFor`

```ts
// inside a handler — auto-scoped to same chat + same sender
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
```

by default `waitFor` throws `WaitForTimeout` when the timeout elapses. pass `nullOnTimeout: true` to get `null` instead — easier to work with in most flows

### `match` — auto-scope control

`update.flow.waitFor` applies an automatic scope so you don't accidentally capture another user's message. the `match` field controls how strict that scope is:

| `match` value | when applied by default | meaning |
|---|---|---|
| `'chat+from'` | when both chat and sender are extractable (e.g. `message`, `callback_query`) | wait for an update from the same chat AND the same sender |
| `'chat'` | when only chat is extractable (e.g. `channel_post`) | wait for any update in the same chat |
| `'from'` | when only sender is extractable (e.g. shared widget queries) | wait for an update from the same user, across chats |
| `'none'` | when neither is extractable | no auto-scope — only your `filter` runs |

```ts
// "anyone in this chat can reply"
const anyReply = await message.flow.waitFor('message', { match: 'chat' })

// no scope at all — manual filter only
const specific = await message.flow.waitFor('message', {
  match: 'none',
  filter: m => m.chat.id === someChatId && m.from?.id === someUserId
})
```

### the lower-level form

`tg.flow.waitFor(kind, options?)` is the un-bound version. use it when you're outside a handler or need cross-chat behavior:

```ts
const wait = await tg.flow.waitFor('message', {
  filter: m => m.chat.id === someChatId && m.from?.id === someUserId,
  timeout: 30_000,
  nullOnTimeout: true
})
```

### options

| field | type | default | description |
|---|---|---|---|
| `filter` | `(update) => boolean` | `() => true` | extra predicate. on `update.flow.waitFor` AND-composed with the auto-scope; on `tg.flow.waitFor` it's the only gate |
| `timeout` | `number` (ms) | `Infinity` | when to give up |
| `nullOnTimeout` | `boolean` | `false` | return `null` instead of throwing on timeout |
| `consume` | `boolean` | `true` | swallow the update so other handlers don't see it. set `false` to let it keep flowing |
| `validate` | `(update) => boolean \| string` | none | post-filter check — return `false` to silently re-wait, return a string to send it as feedback and re-wait |
| `transform` | `(update) => T` | identity | shape the matched update before resolving. the promise type follows what you return |
| `signal` | `AbortSignal` | none | external cancellation. when fired, rejects with `WaiterAbortedError` and unregisters listeners. compose with `AbortSignal.timeout(...)` / `AbortSignal.any([...])` for shared deadlines |
| `match` | `'chat+from' \| 'chat' \| 'from' \| 'none'` | auto-derived | `update.flow.waitFor` only — override the auto-scope strategy |

### multiple waiters on the same update

if more than one pending `waitFor` matches the same incoming update, **first registered wins** — the others keep waiting. FIFO semantics, same as v2

## `waitForCallbackQuery`

a thin wrapper over `waitFor('callback_query')` that builds the predicate for you. accepts a `predicate` function to match the callback data, plus all `WaitForOptions` knobs:

```ts
tg.command('confirm', async (message) => {
  await message.send('press the button', {
    reply_markup: {
      inline_keyboard: [[{ text: 'confirm', callback_data: 'confirm:yes' }]]
    }
  })

  const tap = await message.flow.waitForCallbackQuery(
    q => q.data === 'confirm:yes',
    { timeout: 30_000, nullOnTimeout: true }
  )

  if (tap === null) {
    return message.send('timed out')
  }

  await tap.answer()
  await message.send('confirmed')
})
```

omit `predicate` to match any callback query. `update.flow.waitForCallbackQuery` applies the same auto-scope as `waitFor` by default — pass `match: 'chat'` for "anyone in this chat can tap"

## `waitForCommand`

waits for the next message whose text matches `/name`, `/name@bot`, or `/name <args>`. pass a `RegExp` to match arbitrary patterns:

```ts
tg.command('start', async (message) => {
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

// regex form — match any cancel-style command
const cancel = await message.flow.waitForCommand(/^\/(cancel|stop|abort)$/, {
  timeout: 30_000,
  nullOnTimeout: true
})
```

falls back to `caption` when `text` is undefined, so commands attached to media messages still match

both `waitForCallbackQuery` and `waitForCommand` accept every `WaitForOptions` knob (`timeout`, `nullOnTimeout`, `signal`, `consume`, `validate`, `transform`) via a second argument

## `waitForAny` — race multiple waiters

run several waiters in parallel and resolve on the **first** one to match. losers are cancelled and their listeners removed:

```ts
import { spec } from '@puregram/flow'

const winner = await tg.flow.waitForAny([
  spec('callback_query', { filter: q => q.data === 'confirm' }),
  spec('message', { filter: m => m.text === 'cancel' })
])

if (winner.index === 0) {
  // they tapped confirm — winner.value is the callback_query
  await winner.value.answer({ text: 'confirmed' })
} else {
  // they sent cancel as a message
  await tg.send(winner.value.chat.id, 'cancelled')
}
```

`spec(kind, options?)` preserves the literal `kind` so each spec's `filter` callback gets the precise `UpdateKindMap[K]` type. plain object literals work too — you just have to type the filter parameters yourself:

```ts
// plain object form
const winner = await message.flow.waitForAny([
  { kind: 'callback_query', options: { filter: (q: CallbackQueryUpdate) => q.data === 'yes' } },
  { kind: 'message' }
])
```

::: tip note on auto-scope
`update.flow.waitForAny` forwards specs verbatim — auto-scope is NOT applied to individual specs. if you need scoped specs, build them with `spec` and include a filter yourself
:::

### shared deadline with `AbortSignal`

pass a top-level `signal` to cancel every waiter at once:

```ts
import { WaiterAbortedError } from '@puregram/flow'

const deadline = AbortSignal.timeout(30_000)

try {
  const winner = await message.flow.waitForAny(
    [
      spec('callback_query', { filter: q => q.data === 'confirm' }),
      spec('message', { filter: m => m.text === 'cancel' })
    ],
    { signal: deadline }
  )

  // handle winner…
} catch (error) {
  if (error instanceof WaiterAbortedError) {
    await message.send('took too long — try again')
  } else {
    throw error
  }
}
```

each spec may also carry its own per-waiter `signal`. use `AbortSignal.any([signalA, signalB])` to combine signals

## errors

| error class | thrown when |
|---|---|
| `WaitForTimeout` | `timeout` elapsed and `nullOnTimeout` is `false`. carries `.timeout` (ms) and `.kind` |
| `WaitForCancelled` | `tg.flow.cancelAll()` was called while the waiter was pending. also received by losers of a `waitForAny` race |
| `WaiterAbortedError` | a waiter's `signal` (or `waitForAny`'s top-level `signal`) aborted before a match. carries `error.cause` with the abort reason |

```ts
import { WaitForTimeout, WaitForCancelled, WaiterAbortedError } from '@puregram/flow'

try {
  const reply = await message.flow.waitFor('message', { timeout: 5_000 })
  // use reply…
} catch (error) {
  if (error instanceof WaitForTimeout) {
    console.log(`gave up after ${error.timeout}ms`)
  } else if (error instanceof WaitForCancelled) {
    console.log('cancelled — bot is shutting down')
  } else if (error instanceof WaiterAbortedError) {
    console.log('aborted via signal:', error.cause)
  } else {
    throw error
  }
}
```

`tg.flow.cancelAll()` rejects every pending in-memory waiter with `WaitForCancelled` — useful in shutdown or hot-reload paths

## see also

- [prompt](/plugins/flow/prompt) — `prompt` wraps `waitFor` and sends the question for you
- [persistent flows](/plugins/flow/persistent-flows) — restart-safe variant of `waitFor`
- [@puregram/flow overview](/plugins/flow/) — install, `update.flow` vs `tg.flow`, plugin options
