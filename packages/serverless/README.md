# @puregram/serverless

puregram on [telegram's hosted serverless runtime](https://core.telegram.org/bots/serverless). write a bot with the usual handlers, plugins, and shortcuts; build it into the platform's `tgcloud/handlers/`, `tgcloud/endpoints/`, `tgcloud/lib/`, and optional `tgcloud/schema.js` modules

**experimental.** verified on the hosted runtime (`tgcloud` 0.2.0): dispatch, markup, keyboards, sessions, scenes, rate limits, callback data, uploads (including files inside rich-message `blocks[]`), downloads, and endpoints. BotFather serverless access is required for deployment and `tgcloud run`. no bot API token, HTTP listener, or polling loop is needed in the deployed code

## usage

```sh
npm install @puregram/serverless
npm install --save-dev typescript @tgcloud/cli
```

`src/bot.ts`:

```ts
import { createBot } from '@puregram/serverless'

const tg = createBot({ debug: true })

tg.onMessage(message => message.send(message.text ?? 'hello'))

export default tg
```

from the project root:

```sh
npx puregram-serverless build src/bot.ts
npx tgcloud login
npx tgcloud push
npx tgcloud run handlers/message '{ chat: { id: 1 }, text: "hello" }'
```

`tgcloud run` executes local modules **on the platform**, without publishing. payload-only calls use a synthetic `update_id: 0`; normal delivery preserves `ctx.update` and its real id

## build options

| option | behavior |
| --- | --- |
| `--updates auto` | default; evaluate the bundled bot and infer registered subscriptions |
| `--updates message,callback_query` | explicit top-level Bot API kinds; use when subscriptions cannot be inferred. `none` emits no handlers |
| `--endpoints auto` | Mini App endpoints from `tg.endpoint()`; the default with `--updates auto`, otherwise `none`. also accepts a comma-separated list |
| `--root <directory>` | project root; output always goes to `<root>/tgcloud/`. defaults to the nearest ancestor with `.tgcloud/`, else the current directory. roots nested in another `tgcloud` project are refused |
| `--schema src/schema.js` | bundle a database schema as `schema.js` |
| `--minify` | smaller bundles; the default keeps readable stacks and file/line logs. the platform rejects modules over 1 MiB, and readable bundles that cross it fail the build |

automatic discovery executes trusted application module initialization, not bot startup or plugin installation. runtime SDK operations are rejected during discovery. service-event subscriptions map to their parent update kind. opaque predicates require an explicit update list

the builder neither reads deployment credentials nor publishes. keep `tgcloud/` and the root's `.tgcloud.puregram-serverless.json` ownership manifest together and out of version control. unmanaged files such as hand-written `tgcloud/endpoints/` modules are preserved; hand-edited generated files are not overwritten. source files must not occupy generated destinations

## endpoints

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

the Mini App calls it with `Telegram.WebApp.Serverless.call('getProfile', input, callback)`. `ctx.initData` arrives verified by the platform. the return value goes back as one JSON response. `EndpointError` is the platform's class; other errors reach the client as a generic internal error

## storage

`schema.js`:

```js
import { kvTable } from '@puregram/serverless/schema'

export const sessions = kvTable('sessions')
```

the `/schema` entry imports only `sdk/db`. keep runtime storage imports (`/storage`, which needs `sdk`) in bot code, not schema modules

bot setup, with `@puregram/session` installed:

```ts
import { createBot } from '@puregram/serverless'
import { TelegramStorage } from '@puregram/serverless/storage'
import { session } from '@puregram/session'

const tg = createBot().extend(session({
  storage: new TelegramStorage({ table: 'sessions', ttlMs: 86_400_000 })
}))
```

build with `--schema schema.js`, then push and run `npx tgcloud migrate`. `kvTable` supplies the key/value/expiry columns and expiry index. existing key/value-only tables need the reviewed schema migration before using the new adapter. storage construction never migrates the database

`TelegramStorage` implements `TtlStorage`. optional `ttlMs` expires whole rows; omitted or `0` means no row expiry. `touch` renews live rows. expired rows are absent to `get`/`has` and swept in bounded batches during writes; `sweepIntervalMs` defaults to `60_000`, with `0` disabling automatic sweeping. no background timer is used. independent isolates may each sweep on their first write

values follow JSON serialization rules, including support for top-level `undefined`. use distinct tables for independent stores. persistent storage does not serialize concurrent handlers or make read–modify–write operations atomic

## portable surface

import factories/media from `puregram/runtime`, keyboards from `puregram/keyboards`. `markup`, `rich`, `session`, `scenes`, `rate-limit`, and `callback-data` support the portable core; use persistent storage for cross-invocation state. `utils` provides portable synchronous WebApp cryptography. `stream` throttles drafts by incoming pieces when timers are absent and `fromSSE` parses LLM event streams from `sdk.fetch`. `media-cacher` caches across invocations with `TelegramStorage`, `keyStrategy: 'hash'`, and `sdk`'s `fetch`. `flow` waiters and `throttler` remain Node-only: their timers and process-local state do not survive isolates

static Node imports fail the build; lazy `await import('node:…')` paths build into a stub that throws only when reached

`utils.parseDeepLink` and the WebApp verification path need no `URL` global

`createBot({ bot })` accepts a known Bot API `User` to avoid `getMe` on each fresh instance. `debug: true` logs through `console.debug`, pre-formatted because the platform console ignores `%s` placeholders; `debug` can instead be a custom `(template, ...args) => void` sink. request summaries do not log request parameters

`download` and generated update download helpers return `Uint8Array` on serverless; `downloadIterable` resolves to an async byte iterable. `MediaSource.url(url, { forceUpload: true })` downloads through `sdk.fetch`. filesystem/Node-stream downloads, recurring chat actions, and automatic flood-wait retries are unavailable. HTTP-only request-context fields are absent rather than throwing when inspected

await all invocation work: promises still running after the handler returns never complete. the runtime has no timers, `queueMicrotask`, `URL`, `structuredClone`, or `AbortController`. a busy invocation was terminated after about 3 seconds of CPU (`CPU timer exceeded`); time awaiting `sdk` calls does not count toward it. `sdk.d.ts`, shipped with the package, types the `sdk` module for code that imports it directly

## delivery guarantees

a handler that throws is not retried: deliberately failed updates ran once and were dropped. no automatic durable deduplication is claimed, and concurrent delivery is not established. marking an update before a handler can lose work; marking it afterwards cannot guarantee exactly-once Telegram sends. use transactional constraints for database-local operations and application-level idempotency where supported. synthetic update id `0` is not a durable identity

see the [deployment guide](https://puregram.cool/guide/deployment/serverless) and [complete recipe](https://github.com/puregram/puregram/tree/v3/examples/recipes/serverless-bot)
