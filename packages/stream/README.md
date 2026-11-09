# `@puregram/stream`

stream LLM output to telegram via `sendMessageDraft` + a terminal `sendMessage`. a thin bridge from any `AsyncIterable<string>` (or a known LLM SDK stream) to repeated animated draft previews, finalized as real messages once each 4096-char window fills or the stream ends.

```
npm i @puregram/stream
# optional, for parseMode: 'MarkdownV2' | 'HTML'
npm i @puregram/markup
```

## quickstart

```ts
import { Telegram } from 'puregram'
import { stream } from '@puregram/stream'

const tg = Telegram.fromToken(process.env.TOKEN!).extend(stream())

tg.onMessage(async (message) => {
  await message.stream(openAIStream)
})
```

both call sites are supported:

```ts
// inside an update handler — chat_id, message_thread_id inferred
await message.stream(source, options?)

// raw — call out of context, pass the chat_id yourself
await tg.stream({ chat_id: 12345, source, ...options })
```

drafts are **private-chat only** (it's a telegram limitation). the plugin throws synchronously *before consuming the source* if you target a group / channel. a streamEdit-based fallback for groups is planned.

## supported sources

every modern LLM client already exposes an `AsyncIterable` (or trivially adapts to one). `m.stream(...)` duck-types the source — but you can also call a named adapter explicitly for better type inference.

### openai

```ts
import OpenAI from 'openai'
import { fromOpenAI } from '@puregram/stream'

const openai = new OpenAI()
const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  stream: true,
  messages: [{ role: 'user', content: 'tell me a joke' }]
})

// implicit (auto-detect)
await message.stream(completion)

// explicit (typed)
await message.stream(fromOpenAI(completion))
```

### anthropic

```ts
import Anthropic from '@anthropic-ai/sdk'
import { fromAnthropic } from '@puregram/stream'

const client = new Anthropic()
const stream = client.messages.stream({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'tell me a joke' }]
})

await message.stream(fromAnthropic(stream))
```

### vercel ai sdk

```ts
import { streamText } from 'ai'
import { fromVercelAI } from '@puregram/stream'

const result = await streamText({ model: openai('gpt-4o'), prompt: 'tell me a joke' })

await message.stream(result)             // duck-typed via .textStream
await message.stream(fromVercelAI(result)) // explicit
```

### ollama

```ts
import { Ollama } from 'ollama'
import { fromOllama } from '@puregram/stream'

const ollama = new Ollama()
const res = await ollama.chat({ model: 'llama3', messages: [...], stream: true })

await message.stream(fromOllama(res))
```

### langchain

```ts
import { fromLangChain } from '@puregram/stream'

const stream = await chain.stream({ input: 'tell me a joke' })

await message.stream(fromLangChain(stream))
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

### other shapes

| adapter             | accepts                                |
|---------------------|----------------------------------------|
| `fromTextStream`    | web `ReadableStream<string>`           |
| `fromBytes`         | `AsyncIterable<Uint8Array>` (utf-8)    |
| `fromSSE`           | raw `text/event-stream` bytes → each event's `data` parsed as JSON (`[DONE]` skipped) |
| `fromEventEmitter`  | node `EventEmitter` (default `'text'`) |

### telegram serverless

there are no LLM SDKs on telegram serverless, so call the HTTP API with the platform's `fetch` and parse the event stream yourself. the parsed anthropic/openai events are auto-detected:

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

the platform has no timers, so draft throttling follows incoming pieces instead of sleeping: a draft goes out on the first piece after `editIntervalMs`, and the final message is always sent. a stop button press arrives as its own invocation, so its in-memory stop signal is not guaranteed to reach a running stream

## rich-message streaming

pass `rich` to stream into a telegram **rich message** (`sendRichMessageDraft` + `sendRichMessage`) instead of flat `parse_mode` text. rich markdown renders headings, lists, code blocks, tables and math, and the limit is 32768 (vs 4096) so rollovers are rarer

```ts
await message.stream(openAIStream, { rich: true })     // markdown (default)
await message.stream(openAIStream, { rich: 'html' })   // telegram rich html
await telegram.stream({ chat_id, source, rich: 'markdown' })
```

same engine — adapters, pacing, callbacks, abort, reply/thread forwarding all reused. only the wire calls and content field swap (`rich_message: { markdown }` / `{ html }`)

- **private chats only** (drafts are private-only)
- **`rich` and `parseMode` are mutually exclusive** — setting both throws
- **`link_preview_options` is ignored** in rich mode (`sendRichMessage` has no such param)
- `is_rtl` / `skip_entity_detection` are not exposed

## letting the user stop

`canStop: true` puts telegram's stop button on every draft. when the user presses it telegram sends a `stopped_message_generation` update; the plugin matches it to the running stream by chat and draft id, stops pulling the source, and returns with `result.stopped === true`. the update is only observed — your own `stopped_message_generation` handlers still fire

```ts
const result = await message.stream(openAIStream, { canStop: true, keepOnStop: true })

if (result.stopped) {
  await message.send('stopped there')
}
```

`keepOnStop: true` forwards `keep_on_stop` to every draft, which asks telegram to leave the draft on screen after the press — but only briefly: it disappears after a short while, or as soon as the bot sends anything. persisting the partial is the plugin's half of the option — with it the accumulated tail goes out through the normal terminal `sendMessage`, without it the tail is dropped and `result.messages` holds only the windows already committed before the stop. it only matters alongside `canStop`, since nothing can be stopped without the button

### stopping from the bot side

`canStop` controls telegram's button, not the bot's own ability to stop a run. `tg.stream.stop(chatId)` stops every live run in that chat, `tg.stream.stopAll()` stops all of them, and both return how many they stopped. a bot-side stop behaves exactly like a user press — it honours `keepOnStop` and resolves with `result.stopped === true` — and works on runs started without `canStop`

`tg.stream.active` lists the runs in flight right now, `update.stream(...)` ones included, each carrying `{ chatId, drafts, canStop, stopped }`. entries drop as soon as a run settles

```ts
tg.useHook('onShutdown', (_ctx, next) => {
  tg.stream.stopAll()

  return next()
})
```

## options

| option                | type                                    | default | notes                                                              |
|-----------------------|-----------------------------------------|---------|--------------------------------------------------------------------|
| `parseMode`           | `'MarkdownV2' \| 'HTML'`                | plain   | lenient per-tick, strict on finalize. needs `@puregram/markup`     |
| `rich`                | `boolean \| 'markdown' \| 'html'`       | off     | rich message — `true`=markdown, mutually exclusive with `parseMode` |
| `editIntervalMs`      | `number`                                | `250`   | soft floor between `sendMessageDraft` calls                        |
| `maxEditBackoff`      | `number`                                | `4000`  | drop a draft tick if local backoff exceeds this                    |
| `thinkingPlaceholder` | `boolean`                               | `true`  | emit an empty draft eagerly on start                               |
| `canStop`             | `boolean`                               | off     | show telegram's stop button on every draft                         |
| `keepOnStop`          | `boolean`                               | off     | keep the draft up after a stop, and persist the partial            |
| `draftIdOffset`       | `number`                                | hybrid  | derived from `message_id << 8` on `update.stream`; counter for tg  |
| `signal`              | `AbortSignal`                           | —       | aborts mid-stream, finalizes last-good                             |
| `message_thread_id`   | `number`                                | —       | forwarded                                                          |
| `reply_parameters`    | `ReplyParameters`                       | —       | forwarded                                                          |
| `link_preview_options`| `LinkPreviewOptions`                    | —       | forwarded; ignored in rich mode                                    |
| `disable_notification`| `boolean`                               | —       | forwarded                                                          |
| `protect_content`     | `boolean`                               | —       | forwarded                                                          |
| `reply_markup`        | `ReplyMarkup`                           | —       | only attached to the terminal `sendMessage`                        |
| `onPiece`             | `(piece, draftId) => void`              | —       | called per source yield                                            |
| `onDraftFinalized`    | `(msg) => void`                         | —       | called per terminal `sendMessage`                                  |
| `onError`             | `(err) => void \| Promise<void>`        | —       | called for source / draft / parse errors                           |

## return value

```ts
interface StreamResult {
  messages: TelegramMessage[]    // committed sendMessage results, in order
  drafts: number                 // distinct sendMessageDraft calls issued
  pieces: number                 // chunks pulled from source
  bytes: number                  // total text bytes streamed
  skipped: number                // draft ticks coalesced or dropped under back-pressure
  aborted: boolean               // true iff AbortSignal triggered
  stopped: boolean               // true iff the user pressed the stop button
}
```

## error handling

| failure                                   | behavior                                                                                  |
|-------------------------------------------|-------------------------------------------------------------------------------------------|
| source throws mid-stream                  | stop pulling, finalize last-good via `sendMessage`, call `onError`, rethrow               |
| `AbortSignal.abort()`                     | stop pulling, finalize last-good, set `result.aborted = true`, no rethrow                 |
| user presses the stop button              | stop pulling, set `result.stopped = true`, finalize the partial only under `keepOnStop`   |
| chat is not private                       | throws synchronously **before** consuming the source                                      |
| `maxEditBackoff` exceeded on a draft      | drop the draft, `skipped` += 1, continue                                                  |
| terminal `sendMessage` fails              | never dropped — bubbles up                                                                |
| strict-parse failure on finalize          | falls back to raw text, `onError` called                                                  |

## auto-detect vs named adapters

| approach                                              | when to use                                                                   |
|-------------------------------------------------------|-------------------------------------------------------------------------------|
| `m.stream(openaiCompletion)` — auto-detect            | quick prototyping; common-case happy path                                     |
| `m.stream(fromOpenAI(openaiCompletion))` — explicit   | better intellisense, narrower types, future-proof against shape collisions    |

## comparison vs `@grammyjs/stream`

| feature                          | `@puregram/stream`                                  | `@grammyjs/stream`                          |
|----------------------------------|-----------------------------------------------------|---------------------------------------------|
| transport                        | `sendMessageDraft` + `sendMessage` (bot api 10.0)   | `editMessageText` polling                   |
| group chats                      | not supported (private-only — bot-api constraint)   | supported                                   |
| 4096 rollover                    | automatic; multi-message finalize                   | manual                                      |
| LLM source detection             | duck-typed + named adapters for 6+ SDKs             | one adapter form                            |
| parseMode handling               | lenient per-tick / strict on finalize               | strict only                                 |
| abort                            | `AbortSignal`                                       | `AbortSignal`                               |
| backoff                          | core auto-retry + local `maxEditBackoff`            | per-call                                    |

## throttling

`@puregram/stream` does not implement throttling. it leans on `puregram`'s built-in `retryOnFloodWait` for 429s and on the `maxEditBackoff` local cap to drop stale ticks. for strict per-chat pacing, layer `@puregram/throttler` (when available) over the top — its filter / middleware shape is independent of the plugin.
