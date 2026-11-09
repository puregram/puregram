---
title: telegram serverless
description: build and deploy puregram handlers on telegram's hosted runtime
---

# telegram serverless

[`@puregram/serverless`](https://github.com/puregram/puregram/tree/v3/packages/serverless) targets [telegram's hosted serverless runtime](https://core.telegram.org/bots/serverless), not an HTTP webhook endpoint. default-export a bot, build the platform modules, and deploy with `tgcloud`. the deployed code needs no bot API token, listener, or polling loop

**experimental.** verified on the hosted runtime with `tgcloud` 0.2.0: update and callback dispatch, markup, keyboards, sessions, scenes, rate limits, and callback data across invocations, WebApp validation, uploads (bytes, `forceUpload` urls, albums, and files inside rich-message `blocks[]`), downloads, error mapping, and endpoints. enable serverless in BotFather before deploying or using `tgcloud run`. that command executes in the cloud, not offline

## create a bot

```sh
npm install @puregram/serverless
npm install --save-dev typescript @tgcloud/cli
```

write `src/bot.ts`:

```ts
import { createBot } from '@puregram/serverless'

const tg = createBot()

tg.onMessage(async (message) => {
  await message.send(`you said: ${message.text ?? '(no text)'}`)
})

tg.onCallbackQuery(async (query) => {
  await query.answer({ text: 'got it!' })
})

export default tg
```

## build and deploy

run from the project root, the directory that holds (or will hold) `.tgcloud/`:

```sh
npx puregram-serverless build src/bot.ts
```

the builder always writes to `<root>/tgcloud/`, the layout `tgcloud` 0.2.0 deploys. `--root <directory>` selects another project root; without it, the nearest ancestor containing `.tgcloud/` is used, falling back to the current directory. a root nested inside another `tgcloud` project is refused, since the CLI would deploy the outer project instead

update selection defaults to `auto`: the builder evaluates the bundled bot and reads its registered subscriptions. service events such as `onNewChatMembers` select the message-family parents (`message`, `edited_message`, `channel_post`, `edited_channel_post`). opaque subscriptions that cannot be inferred require an explicit list:

```sh
npx puregram-serverless build src/bot.ts --updates message,callback_query
```

**automatic discovery executes application module initialization.** build only trusted source. the discovery environment rejects runtime SDK operations; register handlers and endpoints at module scope and perform API/database work inside handlers. plugin installation and bot startup are not run to discover subscriptions. use explicit `--updates` and `--endpoints` when registration depends on runtime initialization

output contains `tgcloud/lib/bot.js`, `tgcloud/handlers/<kind>.js` for each selected top-level Bot API update kind, and `tgcloud/endpoints/<name>.js` for each endpoint, linked by relative `.js` imports. bundles are readable by default so the platform's `[file:line]` logs remain useful; add `--minify` for smaller output. the platform rejects modules over 1 MiB, and the builder fails before writing anything when a bundle crosses that line. a test bot using markup, rich, session, scenes, rate-limit, callback-data, utils, stream, and media-cacher bundled to 1.08 MB readable and 467 KB minified

static Node imports fail the build. lazy `await import('node:…')` calls, as some packages use for Node-only paths, build into a stub that throws only if that path runs

link the project and deploy from the same root:

```sh
npx tgcloud login
npx tgcloud push
```

the CLI access token comes from BotFather's serverless settings and is separate from the bot API token. the builder does not log in or publish anything. after source changes, repeat build → push. a full push mirrors `tgcloud/`, so modules deployed from elsewhere are removed

keep `tgcloud/` and the `.tgcloud.puregram-serverless.json` ownership manifest beside it out of version control. the builder preserves unmanaged files such as hand-written `tgcloud/endpoints/` modules, removes obsolete generated handlers and endpoints, and refuses to replace hand-edited generated files

## mini app endpoints

`tg.endpoint(name, handler)` registers a function your Mini App calls with `Telegram.WebApp.Serverless.call(name, input, callback)`. names follow the platform's rule: letters, digits, and `_`, not starting with a digit

```ts
import { createBot, EndpointError } from '@puregram/serverless'

const tg = createBot()

tg.endpoint('getProfile', async (input, ctx) => {
  const user = ctx.initData.user

  if (user === undefined) {
    throw new EndpointError('no user', { code: 'NO_USER' })
  }

  return { id: user.id, name: user.first_name }
})

export default tg
```

`ctx.initData` is already verified by the platform, so `WebApp.validate` is unnecessary here. the return value is sent back as JSON in one response; endpoints cannot stream. `EndpointError` is the platform's class re-exported unchanged: the Mini App receives its description and parameters. any other error reaches the client as a generic internal error. the bot starts (plugins install, `getMe` unless `bot` is given) before the first endpoint call in an isolate

```sh
npx tgcloud run endpoints/getProfile '{}' --ctx '{ initData: { user: { id: 1, first_name: "Ann" } } }'
```

endpoints are discovered with `--updates auto`. with an explicit `--updates` list, pass `--endpoints getProfile,saveProfile` too, or `--endpoints auto` to evaluate the bot. a Mini App backend with no update handlers builds with `--updates none --endpoints <names>` or plain auto discovery

## run a handler without publishing

from the project root:

```sh
npx tgcloud run handlers/message '{ chat: { id: 1 }, text: "hello" }'
```

normal delivery preserves the full `ctx.update`, including its original `update_id`. payload-only invocations synthesize an envelope with `update_id: 0`. that zero is not a real delivery identifier: do not use it as a durable idempotency key

unknown update fields still reach `onRawUpdate` before typed dispatch. when Telegram adds a new kind, the platform must also support that handler name; the builder's known-kind list comes from the installed API schema

## persistent sessions

install `@puregram/session` and declare a table in a source `schema.js`:

```js
import { kvTable } from '@puregram/serverless/schema'

export const sessions = kvTable('sessions')
```

the `/schema` entry imports only `sdk/db`; the runtime `/storage` entry needs `sdk` and belongs in bot code

use the same table name in the bot:

```ts
import { createBot } from '@puregram/serverless'
import { TelegramStorage } from '@puregram/serverless/storage'
import { session } from '@puregram/session'

const tg = createBot().extend(session({
  storage: new TelegramStorage({ table: 'sessions', ttlMs: 86_400_000 })
}))
```

build with `--schema schema.js`, push, then run `npx tgcloud migrate` to review and apply the schema. constructing storage never creates or migrates tables. existing hand-written key/value tables need the new nullable `expires_at` column and expiry index; review that migration before running the new adapter

`TelegramStorage` implements `TtlStorage`. `ttlMs` is the whole-row sliding expiry; omit it or use `0` for no row expiry. `get` and `has` treat expired rows as absent. `touch` extends a live row's deadline, and sessions call it when an unchanged session is read. expired rows are also removed opportunistically during writes, in bounded batches, without a timer. `sweepIntervalMs` defaults to `60_000`; `0` disables automatic sweeping. the interval is local to an instance, so fresh invocations may each sweep

per-field `ttl(value, ms)` from `@puregram/session` is separate from whole-row expiry. its deadlines persist with session data across invocations. whole-row expiry can still remove the entire session first

values follow JSON serialization rules, with top-level `undefined` also supported. use separate tables for independent stores. persistence does **not** make a session read–modify–write atomic: concurrent writes to the same key remain last-write-wins

## plugin compatibility

- `@puregram/markup`, `@puregram/rich`, `@puregram/session`, `@puregram/scenes`, `@puregram/rate-limit`, and `@puregram/callback-data` use the portable core. configure durable storage wherever state must survive invocation boundaries
- `@puregram/utils` supports portable cryptography without changing its synchronous WebApp verification API. secret-key results retain common Buffer methods; their type accounts for the portable Buffer implementation rather than promising Node-only methods. `parseDeepLink` needs no `URL` global
- `@puregram/stream` works without timers: drafts follow incoming pieces instead of a sleep, and `fromSSE` parses an LLM API's event stream read through `sdk.fetch`. the stop button is not guaranteed to reach a running stream, since its update is a separate invocation
- `@puregram/media-cacher` works with `TelegramStorage`, `keyStrategy: 'hash'`, and `fetch` from `sdk`; repeated byte uploads reuse the cached `file_id` across invocations
- `@puregram/flow` waiters (`waitFor`, `prompt`, `collectMediaGroup`) and `@puregram/throttler` need in-process state and timers that do not exist across isolates. a buildable import is not a supported serverless lifecycle
- a durable rate-limit store does not make concurrent read–modify–write counters atomic. do not treat it as a distributed admission lock

## identity and debugging

`createBot({ debug: true })` sends request method/success/error summaries and dispatcher diagnostics to `console.debug`, formatted before logging because the platform console does not substitute `%s`. a custom `(template, ...args) => void` sink can be supplied instead. request parameters are not included in these summaries. the platform only captures console calls made during an invocation; output from module initialization is dropped

by default, startup calls `getMe` once per bot instance. fresh isolates therefore fetch bot identity again. pass the bot's known complete Bot API `User` object as `createBot({ bot })` to avoid that request; keep its username and other identity fields current

## runtime boundaries

- use `createBot`, not `Telegram.fromToken`. import portable factories and media sources from `puregram/runtime`, or keyboards from `puregram/keyboards`
- API calls use `sdk.api`; outbound HTTP uses `sdk.fetch`. Node builtins, filesystem access, and runtime npm resolution are unavailable
- use `tg.download(target)` or update-level download helpers for `Uint8Array` bytes; use `tg.downloadIterable(target)` for an async byte iterable. the concrete Node client's `tg.download(target)` retains `Buffer`, but shared update helpers are typed as `Uint8Array` on every transport
- filesystem downloads, Node streams, recurring chat-action controllers, and automatic `retryOnFloodWait` are unavailable. a 429 reaches the caller as `ApiError` with `parameters.retry_after`, or as a response when `suppress: true` is used
- `MediaSource.url(url, { forceUpload: true })` downloads through `sdk.fetch` and uploads the bytes, within the platform's 30 MB response cap. a non-2xx response throws instead of uploading the error body
- HTTP-only request-context fields (`url`, `init`, `response`) are absent. hooks can inspect them defensively. response interception honors replacement of `ctx.json` on both transports
- await all work needed by an invocation: a promise left running after the handler returns does not complete. the hosted runtime has no `setTimeout`, `setInterval`, `queueMicrotask`, `URL`, `URLSearchParams`, `AbortController`, `structuredClone`, `atob`/`btoa`, or `performance` globals. it does provide `TextEncoder`/`TextDecoder`, `crypto` (`subtle`, `randomUUID`, `getRandomValues`), `WebAssembly`, and `Intl` (time zone `UTC`)
- a busy loop was terminated after about 3 seconds with `CPU timer exceeded`. six seconds spent awaiting `sdk.api` calls completed normally, so waiting on I/O does not count toward that limit; the wall-clock ceiling is not established

## retries and delivery

a handler that throws is not retried: two deliberately failed updates each ran once, `pending_update_count` stayed 0, and the webhook reported no error. treat a failed invocation as a lost update. `tg.catch` runs before that, and rethrowing from it is what marks the invocation as failed

there is no automatic durable update deduplication, and concurrent-delivery behavior is not established. use atomic database constraints for database-local business operations and explicit idempotency keys where external APIs support them. do not assume a successful database claim makes a Telegram send exactly-once

see the [serverless recipe](https://github.com/puregram/puregram/tree/v3/examples/recipes/serverless-bot) for formatting, callback buttons, and persistent sessions together
