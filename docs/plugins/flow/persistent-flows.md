---
title: persistent flows — @puregram/flow
description: restart-safe waitFor and prompt backed by KVStorage — conversation state that survives bot restarts
---

# persistent flows

ephemeral `waitFor`/`prompt` lives entirely in memory. a bot restart drops every pending waiter. for conversations that must survive restarts — registration wizards, multi-day purchase flows, anything where "user comes back tomorrow" is a real scenario — use the persistent variant

the persistent path uses the same `waitFor`/`prompt` API surface but writes the conversation state to a `KVStorage` backend. when the bot restarts and the user eventually replies, the stored record is matched and the registered handler fires

## setup

```ts
import { Telegram } from 'puregram'
import { MemoryStorage } from '@puregram/storage'
import { flow, type PersistedFlow } from '@puregram/flow'

const tg = Telegram.fromToken(process.env.TOKEN!)
  .extend(flow({
    storage: new MemoryStorage<PersistedFlow>(),  // swap for redis/sqlite in prod
    defaultTtl: 24 * 60 * 60 * 1000               // 24h default expiry
  }))
```

::: tip storage backends
`MemoryStorage` is fine for development and single-process deployments. for production use `@puregram/storage-redis` or `@puregram/storage-sqlite` — or any object satisfying the `KVStorage<PersistedFlow>` interface
:::

## `flow.handle(id, config)` — the resume body

register the handler at module scope (once at bot startup). when a persisted record matching `id` is found on a future incoming update — even after a restart — the config fires:

```ts
tg.flow.handle('register:age', {
  kind: 'message',
  validate: (m) => {
    const n = Number.parseInt(m.text ?? '', 10)

    return Number.isFinite(n) ? true : 'please send a number'
  },
  transform: m => Number.parseInt(m.text ?? '0', 10),
  onAnswer: async (age, ctx) => {
    const { name } = ctx.payload as { name: string }

    await ctx.send(ctx.chatId, `${name}, age ${age} ✓`)
  },
  onTimeout: async (ctx) => {
    await ctx.send(ctx.chatId, 'signup expired')
  }
})
```

`flow.handle` config fields:

| field | type | required | description |
|---|---|---|---|
| `kind` | `keyof UpdateKindMap` | no (default `'message'`) | which update kind closes this prompt. mismatch with the call-site `kind` throws `FlowKindMismatch` |
| `validate` | `(update) => boolean \| string` | no | post-filter check. `false` = silent re-wait; a string = send feedback and re-wait |
| `transform` | `(update) => T` | no | shape the matched update into the value `onAnswer` receives |
| `onAnswer` | `(value, ctx) => Promise<void> \| void` | **yes** | the resume body — runs after a successful match |
| `onTimeout` | `(ctx) => Promise<void> \| void` | no | runs once when the record's TTL elapses |
| `filter` | `(update) => boolean` | no | optional secondary filter, AND-composed with the call-site filter |

## opening a persistent flow

call `tg.flow.prompt({ id })` or `tg.flow.waitFor({ id })`. these calls write a record to storage and **return immediately** — the registered handler resolves it on a future matching update:

```ts
tg.command('signup', async (message) => {
  if (message.from === undefined) {
    return
  }

  await tg.flow.prompt(message.chat.id, 'how old are you?', {
    id: 'register:age',
    payload: { name: message.from.firstName },
    ttl: 60 * 60 * 1000    // 1h — falls back to defaultTtl if omitted
  })
})
```

`tg.flow.waitFor({ id })` is the no-prompt variant — for "press the button below" flows where you've already sent the message:

```ts
tg.flow.handle('confirm:purchase', {
  kind: 'callback_query',
  onAnswer: async (q) => {
    await q.answer({ text: 'confirmed' })
  }
})

tg.command('buy', async (message) => {
  if (message.from === undefined) {
    return
  }

  await tg.flow.waitFor('callback_query', {
    id: 'confirm:purchase',
    chatId: message.chat.id,
    fromId: message.from.id
  })
})
```

::: warning persistent open = returns immediately
`flow.prompt({ id })` and `flow.waitFor({ id })` only **open** the prompt — they return `null` right after writing the storage record. the actual answer is delivered asynchronously to `onAnswer`, which may run on a totally different process, hour, or day
:::

## `FlowHandleContext` — what `onAnswer` and `onTimeout` receive

```ts
interface FlowHandleContext {
  id: string                 // the registered handle id
  chatId: number             // the chat the prompt was opened in
  fromId: number | undefined // scoped user id; undefined when accepting any user in chat
  payload: unknown           // verbatim from the prompt call site
  update: UpdateKindMap[K]   // the matched update (onTimeout: the trigger update)

  // chain into another persistent prompt — same bot can be shut down between steps
  open: (id: string, options?: PersistentOpenOptions) => Promise<void>

  // explicit early termination — deletes the record, onAnswer never fires
  close: () => Promise<void>

  // proxy onto tg.send — NOT pre-bound to chatId, pass it explicitly
  send: Telegram['send']
}
```

### chaining steps with `ctx.open`

`ctx.open(id, opts?)` advances to the next step. the user can close the app and come back days later — the next step's handler picks up when they do:

```ts
tg.flow.handle('register:name', {
  onAnswer: async (msg, ctx) => {
    await ctx.open('register:age', { payload: { name: msg.text } })
  }
})

tg.flow.handle('register:age', {
  validate: m => Number.isFinite(Number.parseInt(m.text ?? '', 10)) ? true : 'send a number',
  transform: m => Number.parseInt(m.text ?? '0', 10),
  onAnswer: async (age, ctx) => {
    const { name } = ctx.payload as { name: string }

    await ctx.send(ctx.chatId, `welcome, ${name} (age ${age})!`)
  }
})

tg.command('register', async (message) => {
  await tg.flow.prompt(message.chat.id, "what's your name?", {
    id: 'register:name',
    ttl: 24 * 60 * 60 * 1000
  })
})
```

## typing handler payloads

declaration-merge `FlowHandlers` to type `payload` end-to-end:

```ts
declare module '@puregram/flow' {
  interface FlowHandlers {
    'register:name': { kind: 'message', payload: undefined, result: void }
    'register:age':  { kind: 'message', payload: { name: string }, result: number }
    'register:email': { kind: 'message', payload: { name: string, age: number }, result: void }
  }
}
```

with this in place, `ctx.payload` in each handler resolves to the declared type and `transform`'s return type is checked against `result`

## errors

| error class | thrown when |
|---|---|
| `FlowPersistenceUnconfigured` | calling `flow.prompt({ id })` or `flow.waitFor({ id })` without `flow({ storage })` configured |
| `FlowHandlerMissing` | a persisted record resolves on an incoming update but no `flow.handle(id, ...)` was registered for that id |
| `FlowKindMismatch` | the `kind` passed at the call site (`flow.prompt({ id, kind })`) differs from the `kind` declared on `flow.handle(id, { kind })` |
| `WaitForTimeout` | ephemeral path only — `timeout` elapsed and `nullOnTimeout` is `false` |
| `WaitForCancelled` | `tg.flow.cancelAll()` was called (in-memory waiters only; persistent records are unaffected) |
| `WaiterAbortedError` | a waiter's `signal` aborted |

## `tg.flow` interface reference

```ts
interface FlowExtension {
  // ephemeral when called without `id`; persistent when called with `id` (requires storage)
  waitFor: <K extends keyof UpdateKindMap, T = UpdateKindMap[K]> (
    kind: K,
    options?: WaitForOptions<K, T> & { id?: string, payload?: unknown, ttl?: number, chatId?: number, fromId?: number }
  ) => Promise<T | null>

  waitForCallbackQuery: (
    predicate?: (q: CallbackQueryUpdate) => boolean,
    options?: WaitForCallbackQueryOptions
  ) => Promise<CallbackQueryUpdate | null>

  waitForCommand: (
    name: string | RegExp,
    options?: WaitForCommandOptions
  ) => Promise<MessageUpdate | null>

  waitForAny: <S extends readonly WaiterSpec[]> (
    specs: S,
    options?: WaitForAnyOptions
  ) => Promise<WaitForAnyResult<WaitForAnyValueOf<S[number]>>>

  // send a question, wait for the reply. ephemeral or persistent depending on `id`
  prompt: <K extends keyof UpdateKindMap = 'message', T = UpdateKindMap[K]> (
    chat: number | string,
    text: string,
    options?: PromptOptions<K, T> & { id?: string, payload?: unknown, ttl?: number }
  ) => Promise<T | null>

  collectMediaGroup: (
    message: MessageUpdate,
    options?: CollectMediaGroupOptions
  ) => Promise<CollectedMediaGroup>

  // register a persistent flow handler — required before opening any persistent prompt
  handle: <K extends keyof UpdateKindMap = 'message', T = UpdateKindMap[K]> (
    id: string,
    config: FlowHandleConfig<K, T>
  ) => void

  // reject every pending in-memory waiter with WaitForCancelled. persistent records untouched
  cancelAll: () => void
}
```

## exported types

```ts
import type {
  CollectedMediaGroup,           // array of messages with bulk forward, copy and delete
  CollectMediaGroupOptions,      // options for collectMediaGroup
  FlowExtension,                 // shape of tg.flow
  FlowHandleConfig,              // arg to flow.handle()
  FlowHandleContext,             // ctx passed to onAnswer / onTimeout
  FlowHandlers,                  // user-augmentable map for typed payloads
  FlowOptions,                   // options to flow({...})
  PersistedFlow,                 // raw record stored in KVStorage
  PersistentOpenOptions,         // options for ctx.open(...)
  PersistentPromptOptions,       // options for the persistent path of flow.prompt
  PersistentWaitForOptions,      // options for the persistent path of flow.waitFor
  PromptOptions,                 // ephemeral flow.prompt options
  ValidateResult,                // validate() return contract: boolean | string
  WaitForOptions,                // ephemeral flow.waitFor options
  WaitForResult,                 // mapped return type of waitFor based on nullOnTimeout
  WaitForCallbackQueryOptions,   // options for flow.waitForCallbackQuery
  WaitForCommandOptions,         // options for flow.waitForCommand
  WaitForAnyOptions,             // options for flow.waitForAny ({ signal? })
  WaitForAnyResult,              // { index, value } shape returned by waitForAny
  WaiterSpec,                    // one entry of the waitForAny([...]) array
  Filter,                        // (update: U) => boolean
} from '@puregram/flow'
```

## see also

- [waiters](/plugins/flow/waiters) — the ephemeral `waitFor` surface
- [@puregram/flow overview](/plugins/flow/) — install, two surfaces, plugin options
- session plugin — for per-user state that lives independently of conversation flows
