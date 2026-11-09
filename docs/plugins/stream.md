---
title: '@puregram/stream'
description: stream LLM output to telegram via sendMessageDraft — animated token-by-token previews that finalize as real messages once the window fills or the stream ends
---

# `@puregram/stream`

stream LLM output to telegram via `sendMessageDraft` + a terminal `sendMessage`. any `AsyncIterable<string>` (or a known LLM SDK stream) is turned into repeated animated draft previews that finalize as real messages once each 4096-char window fills or the source exhausts

this is a **runtime plugin** — install it via `tg.extend(stream())`

## when to use

- piping an LLM response token-by-token into a private telegram chat as it generates
- showing a thinking animation before the answer arrives (`thinkingPlaceholder: true`)
- streaming output from OpenAI, Anthropic, Vercel AI SDK, Ollama, LangChain, or any `AsyncIterable<string>`

::: warning
drafts are **private-chat only** — it's a telegram api constraint. the plugin throws synchronously before consuming the source if you target a group or channel. send a regular message with `tg.send` / `update.send` in those chats instead
:::

## install

::: code-group

```sh [yarn]
yarn add @puregram/stream
```

```sh [npm]
npm i -S @puregram/stream
```

```sh [pnpm]
pnpm add @puregram/stream
```

:::

optionally, add [`@puregram/markup`](/plugins/markup/) if you want `parseMode` support:

```sh
yarn add @puregram/markup
```

## quick start

```ts
import { Telegram } from 'puregram'
import { stream } from '@puregram/stream'
import OpenAI from 'openai'

const tg = Telegram.fromToken(process.env.TOKEN!).extend(stream())
const openai = new OpenAI()

tg.onMessage(async (message) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    stream: true,
    messages: [{ role: 'user', content: message.text ?? 'tell me a joke' }]
  })

  await message.stream(completion)
})

await tg.startPolling()
```

## two call shapes

```ts
// inside an update handler — chat_id is inferred from the message
await message.stream(source, options?)

// out-of-context — pass chat_id explicitly
await tg.stream({ chat_id: 12345, source, ...options })
```

both return a `Promise<StreamResult>` with accounting for how the stream went

## sources

`@puregram/stream` duck-types the source automatically. you can also call a named adapter for better type inference:

### openai

```ts
import { fromOpenAI } from '@puregram/stream'

const completion = await openai.chat.completions.create({ model: 'gpt-4o-mini', stream: true, messages: [...] })

await message.stream(completion)             // auto-detect
await message.stream(fromOpenAI(completion)) // explicit
```

### anthropic

```ts
import { fromAnthropic } from '@puregram/stream'

const result = client.messages.stream({ model: 'claude-sonnet-4-5', max_tokens: 1024, messages: [...] })

await message.stream(fromAnthropic(result))
```

### vercel ai sdk

```ts
import { fromVercelAI } from '@puregram/stream'
import { streamText } from 'ai'

const result = await streamText({ model: openai('gpt-4o'), prompt: 'tell me a joke' })

await message.stream(result)              // duck-typed via .textStream
await message.stream(fromVercelAI(result)) // explicit
```

### ollama

```ts
import { fromOllama } from '@puregram/stream'

const res = await ollama.chat({ model: 'llama3', messages: [...], stream: true })

await message.stream(fromOllama(res))
```

### langchain

```ts
import { fromLangChain } from '@puregram/stream'

const result = await chain.stream({ input: 'tell me a joke' })

await message.stream(fromLangChain(result))
```

### raw `AsyncIterable<string>`

```ts
async function * generate () {
  for (const word of ['hello', ' ', 'world']) {
    yield word
    await new Promise(r => setTimeout(r, 50))
  }
}

await message.stream(generate())
```

### other adapters

| adapter | accepts |
|---|---|
| `fromTextStream` | web `ReadableStream<string>` |
| `fromBytes` | `AsyncIterable<Uint8Array>` (utf-8 decoded) |
| `fromSSE` | raw `text/event-stream` bytes — yields each event's `data` parsed as JSON, skipping `[DONE]` |
| `fromEventEmitter` | node `EventEmitter` — listens on `'text'` events by default |

### telegram serverless

[telegram serverless](/guide/deployment/serverless) has no LLM SDKs, timers, or global `fetch`. call the HTTP API through the platform's `fetch` and parse the event stream with `fromSSE`; parsed anthropic/openai events are auto-detected:

```ts
import { fromSSE } from '@puregram/stream'
import { fetch } from 'sdk'

const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
  body: JSON.stringify({ model, max_tokens: 1024, stream: true, messages })
})

await message.stream(fromSSE(res.body))
```

without timers, draft throttling follows incoming pieces instead of sleeping: a draft goes out on the first piece after `editIntervalMs`, and the final message is always sent. a stop button press arrives as its own invocation, so its in-memory stop signal is not guaranteed to reach a running stream

## rich-message streaming

pass `rich` to stream into a telegram **rich message** instead of flat `parse_mode` text. rich markdown renders headings, lists, code blocks, tables and math, and the per-message limit jumps from 4096 to 32768 — far fewer mid-stream rollovers

```ts
await message.stream(fromOpenAI(completion), { rich: true })     // markdown (default)
await message.stream(fromOpenAI(completion), { rich: 'html' })   // telegram rich html

await telegram.stream({ chat_id: 12345, source, rich: 'markdown' })
```

`rich` accepts:

| value | dialect |
|---|---|
| `true` | markdown (LLM-native) |
| `'markdown'` | markdown |
| `'html'` | telegram rich html |

the engine is identical — same adapters, pacing, callbacks, `draft_id`, abort and reply/thread forwarding — only the wire calls swap to `sendRichMessageDraft` / `sendRichMessage` and the content ships as `rich_message: { markdown }` (or `{ html }`)

- **private chats only** — same as text streaming (drafts are private-only)
- **`rich` and `parseMode` are mutually exclusive** — rich owns its dialect; setting both throws
- **`link_preview_options` is ignored** in rich mode — `sendRichMessage` has no such param

## letting the user stop

`canStop: true` puts telegram's stop button on every draft. when the user presses it telegram sends a `stopped_message_generation` update; the plugin matches it to the running stream by chat and draft id, stops pulling the source, and returns with `result.stopped === true`. the update is only observed — your own `stopped_message_generation` handlers still fire

```ts
const result = await message.stream(fromOpenAI(completion), { canStop: true, keepOnStop: true })

if (result.stopped) {
  await message.send('stopped there')
}
```

`keepOnStop: true` forwards `keep_on_stop` to every draft, which asks telegram to leave the draft on screen after the press — but only briefly: it disappears after a short while, or as soon as the bot sends anything. persisting the partial is the plugin's half of the option — with it the accumulated tail goes out through the normal terminal `sendMessage`, without it the tail is dropped and `result.messages` holds only the windows already committed before the stop. it only matters alongside `canStop`, since nothing can be stopped without the button

### stopping from the bot side

`canStop` controls telegram's button — it does not gate the bot's own ability to stop a run. `tg.stream.stop(chatId)` ends every live run in that chat, `tg.stream.stopAll()` ends all of them, and both return how many they stopped:

```ts
tg.stream.stop(100)  // -> 1
tg.stream.stopAll()  // -> 3
```

a bot-side stop is indistinguishable from a user press: the run stops pulling, honours `keepOnStop` the same way, and resolves with `result.stopped === true`. it works on runs started without `canStop` too — those simply never showed a button to press

`tg.stream.active` lists what is in flight right now, including runs started by `update.stream(...)`:

```ts
for (const run of tg.stream.active) {
  console.log(run.chatId, run.drafts, run.canStop, run.stopped)
}
```

| field | type | what it is |
|---|---|---|
| `chatId` | `number` | private chat the run is streaming into |
| `drafts` | `number` | draft ids the run has put on the wire so far |
| `canStop` | `boolean` | whether the run rendered telegram's stop button |
| `stopped` | `boolean` | a stop has been requested — by the user, or by `stop` / `stopAll` |

entries disappear as soon as a run settles, so a completed stream never lingers in `active`. a graceful shutdown reads:

```ts
tg.useHook('onShutdown', (_ctx, next) => {
  tg.stream.stopAll()

  return next()
})
```

## options

`StreamCallOptions` — passed as the second argument to `update.stream(source, options?)` or spread into `tg.stream({ chat_id, source, ...options })`:

| option | type | default | notes |
|---|---|---|---|
| `parseMode` | `'MarkdownV2' \| 'HTML'` | plain text | lenient per-tick, strict on finalize. requires `@puregram/markup` |
| `rich` | `boolean \| 'markdown' \| 'html'` | off | stream into a rich message — `true` = markdown, mutually exclusive with `parseMode` |
| `editIntervalMs` | `number` | `250` | soft floor between `sendMessageDraft` calls (ms) |
| `maxEditBackoff` | `number` | `4000` | drop a draft tick when local backoff exceeds this |
| `thinkingPlaceholder` | `boolean` | `true` | emit an empty draft eagerly on start so users see the "typing" animation |
| `canStop` | `boolean` | off | show telegram's stop button on every draft |
| `keepOnStop` | `boolean` | off | keep the draft up after a stop, and persist the partial through the terminal send |
| `draftIdOffset` | `number` | hybrid | derived from `message_id << 8` on `update.stream`; counter-based for `tg.stream` |
| `signal` | `AbortSignal` | — | aborts mid-stream, finalizes last-good text |
| `message_thread_id` | `number` | — | forwarded to `sendMessage` / `sendMessageDraft` |
| `reply_parameters` | `ReplyParameters` | — | forwarded to `sendMessage` |
| `link_preview_options` | `LinkPreviewOptions` | — | forwarded to `sendMessage`; ignored in rich mode |
| `disable_notification` | `boolean` | — | forwarded to `sendMessage` |
| `protect_content` | `boolean` | — | forwarded to `sendMessage` |
| `reply_markup` | `ReplyMarkup` | — | only attached to the terminal `sendMessage`, not to drafts |
| `onPiece` | `(piece, draftId) => void` | — | called per source yield |
| `onDraftFinalized` | `(msg) => void` | — | called per terminal `sendMessage` |
| `onError` | `(err) => void \| Promise<void>` | — | called for source / draft / parse errors |

## return value — `StreamResult`

```ts
interface StreamResult {
  messages: TelegramMessage[] // committed sendMessage results, in order
  drafts: number              // distinct sendMessageDraft calls issued
  pieces: number              // chunks pulled from source
  bytes: number               // total text bytes streamed
  skipped: number             // draft ticks coalesced or dropped under back-pressure
  aborted: boolean            // true when AbortSignal triggered
  stopped: boolean            // true when the user pressed the stop button
}
```

## error handling

| situation | behavior |
|---|---|
| source throws mid-stream | stop pulling, finalize last-good via `sendMessage`, call `onError`, rethrow |
| `AbortSignal.abort()` | stop pulling, finalize last-good, set `result.aborted = true`, no rethrow |
| user presses the stop button | stop pulling, set `result.stopped = true`, finalize the partial only under `keepOnStop`, no rethrow |
| chat is not private | throws synchronously before consuming the source |
| `rich` + `parseMode` both set | throws before consuming the source |
| `maxEditBackoff` exceeded | drop the draft tick, `skipped += 1`, continue |
| terminal `sendMessage` fails | never dropped — bubbles up |
| strict-parse failure on finalize | falls back to raw text, `onError` called |

## using `runStream` directly

when you need the state machine without going through a `Telegram` instance:

```ts
import { runStream, type StreamApi } from '@puregram/stream'

const fakeApi: StreamApi = {
  sendMessage: async (params) => { /* ... */ },
  sendMessageDraft: async (params) => { /* ... */ }
}

const result = await runStream(fakeApi, {
  chatId: 12345,
  source: generate(),
  draftIdOffset: 0
})
```

useful for testing or for embedding the streaming logic in custom transports

## throttling

`@puregram/stream` does not implement its own throttling. it leans on puregram's built-in `retryOnFloodWait` for 429s and on `maxEditBackoff` to drop stale ticks. for strict per-chat pacing, layer [`@puregram/throttler`](/plugins/throttler) on top

## exported surface

```ts
import {
  stream,    // plugin factory
  runStream, // low-level state machine
  normalize, // normalize any StreamSource to AsyncIterable<string>
  // named adapters
  fromOpenAI,
  fromAnthropic,
  fromVercelAI,
  fromOllama,
  fromLangChain,
  fromTextStream,
  fromBytes,
  fromEventEmitter,
  fromSSE,
  // constants
  DRAFT_TTL_MS,
  DRAFT_SAFETY_MS,
  MAX_CHUNK,
  MAX_RICH_CHUNK,
  DRAFT_ID_MAX,
  DEFAULT_EDIT_INTERVAL_MS,
  DEFAULT_MAX_EDIT_BACKOFF
} from '@puregram/stream'

import type {
  StreamCallOptions,
  StreamTgParams,
  StreamExtension,
  ActiveStream,
  StreamSource,
  StreamResult,
  StreamApi,
  RunStreamOptions,
  StreamForwardOptions,
  StreamCallbacks,
  ParseMode,
  ParsedPayload,
  RichDialect
} from '@puregram/stream'
```

## see also

- [plugins & .extend](/guide/concepts/plugins) — how `.extend(plugin)` works
- [rich grammar for LLMs](/plugins/rich-llm-grammar) — keep a streamed model's output inside telegram's rich grammar
- [markup plugin](/plugins/markup/) — parse `MarkdownV2` / `HTML` into entities (required for `parseMode`)
- [throttler plugin](/plugins/throttler) — outbound rate limiting for bots that send at scale
- [/api/methods](/api/methods) — `sendMessage`, `sendMessageDraft` on the wire
