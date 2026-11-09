---
title: webhook
description: receive telegram updates via webhook — mount on your existing server or spin up a built-in listener
---

# webhook

polling is fine for development and small bots. for anything serious you want webhooks — telegram pushes updates to your server over HTTPS, no long-polling loop needed. there are three ways to wire them up

for telegram-hosted handlers without an HTTP server, see [telegram serverless](/guide/deployment/serverless)

## the easiest path — `tg.startWebhook(...)`

one call: registers the webhook with telegram and optionally spins up a built-in `node:http` listener. perfect for a "bot in a single process" deployment:

```ts
import { Telegram } from 'puregram'

const tg = Telegram.fromToken(process.env.TOKEN!)

tg.onMessage(async (m) => {
  await m.reply('got it via webhook')
})

const { stop } = await tg.startWebhook({
  url: 'https://example.com/webhook',   // public HTTPS url telegram will POST to
  port: 8080,                           // local port to bind the listener to
  secretToken: 'my-secret',            // shared secret — echoed on every delivery
  dropPendingUpdates: true             // drain queued backlog before subscribing
})

process.on('SIGTERM', async () => {
  await stop()
  await tg.shutdown()
})
```

omit `port` to skip the built-in listener and just register the webhook — useful when you bring your own server

### `StartWebhookOptions`

`StartWebhookOptions` extends `WebhookOptions` and `SetWebhookOptions`. all fields:

| field | type | description |
|---|---|---|
| `url` | `string` | *(required)* HTTPS url telegram delivers updates to |
| `port` | `number` | local port for the built-in `node:http` listener. omit to skip the listener |
| `host` | `string` | bind address for the listener. defaults to `0.0.0.0` |
| `path` | `string` | url path the listener answers on. defaults to `/` |
| `secretToken` | `string` | shared secret echoed in `x-telegram-bot-api-secret-token`; mismatched requests get 401 |
| `certificate` | `TelegramInputFile` | public-key cert for self-signed setups |
| `ipAddress` | `string` | fixed IP, bypasses telegram's DNS resolution |
| `maxConnections` | `number` | simultaneous connections cap, 1–100. defaults to 40 |
| `allowedUpdates` | `string[]` | explicit list of update kinds to subscribe to |
| `dropPendingUpdates` | `boolean` | drop the queued backlog before subscribing |
| `webhookReply` | `boolean` | webhook-reply optimization (default `true`) — see below |
| `timeoutMilliseconds` | `number` | max wait before the 200 response. default `25000` |
| `maxBodyBytes` | `number` | body-size cap for the node adapter. default 1 MB |

## bring your own framework

if you already have an express / fastify / koa / hono / h3 / elysia app running, mount puregram on a route in your existing server. every adapter lives at `puregram/webhook`:

```ts
import express from 'express'
import { Telegram } from 'puregram'
import { expressAdapter } from 'puregram/webhook'

const tg = Telegram.fromToken(process.env.TOKEN!)
const app = express()

app.use(express.json())
app.post('/webhook', expressAdapter(tg.webhookHandler({ secretToken: 'my-secret' })))

app.listen(8080)

await tg.setWebhook({ url: 'https://example.com/webhook', secretToken: 'my-secret' })
```

all supported frameworks:

| framework | adapter | mount |
|---|---|---|
| express | `expressAdapter` | `app.post('/webhook', expressAdapter(tg.webhookHandler()))` |
| fastify | `fastifyAdapter` | `fastify.post('/webhook', fastifyAdapter(tg.webhookHandler()))` |
| koa | `koaAdapter` | `router.post('/webhook', koaAdapter(tg.webhookHandler()))` |
| hono | `honoAdapter` | `app.post('/webhook', honoAdapter(tg.webhookHandler()))` |
| h3 | `h3Adapter` | `app.use('/webhook', h3Adapter(tg.webhookHandler()))` |
| elysia | `elysiaAdapter` | `app.post('/webhook', elysiaAdapter(tg.webhookHandler()))` |
| web fetch (workers / deno / bun / edge) | `webAdapter` | `req => webAdapter(tg.webhookHandler(), req)` |
| raw `node:http` | `nodeAdapter` | `createServer(nodeAdapter(tg.webhookHandler()))` |

::: tip body parsing
express and koa adapters expect `req.body` to already be parsed JSON — register `express.json()` / `koa-bodyparser` before the route. fastify, hono, h3, elysia, and the web adapter all auto-parse
:::

## bare `node:http`

if you're not using any framework, `tg.getWebhookCallback()` is `nodeAdapter(webhookHandler())` rolled into one:

```ts
import { createServer } from 'node:http'
import { Telegram } from 'puregram'

const tg = Telegram.fromToken(process.env.TOKEN!)

tg.onMessage(async (m) => {
  await m.reply('got it via webhook')
})

const callback = tg.getWebhookCallback({ secretToken: 'my-secret' })

createServer(callback).listen(8080)

await tg.setWebhook({
  url: 'https://example.com/webhook',
  secretToken: 'my-secret'
})
```

## managing the webhook

`tg.setWebhook` and `tg.deleteWebhook` are typed camelCase wrappers around the bot api methods:

```ts
await tg.setWebhook({
  url: 'https://example.com/webhook',
  secretToken: 'my-secret',
  allowedUpdates: ['message', 'callback_query'],
  maxConnections: 100,
  dropPendingUpdates: true
})

// inspect what telegram has registered
const info = await tg.getWebhookInfo()

// unsubscribe
await tg.deleteWebhook({ dropPendingUpdates: true })
```

## webhook-reply optimization

when `webhookReply` is `true` (the default), api calls that return `true` (chat actions, reactions, deletions, etc.) ride the 200 response body instead of making a separate outbound request. this saves a round-trip per update for those calls. data-returning methods (`sendMessage`, `getChat`, etc.) still make a normal round-trip. the behavior is invisible to your code — `await tg.api.X(...)` resolves the same either way

disable it only when a proxy or firewall strips non-empty 200 bodies:

```ts
tg.webhookHandler({ webhookReply: false })
```

## see also

- [polling](/guide/deployment/polling) — simpler transport, no public URL needed
- [resilience](/guide/deployment/resilience) — flood-wait retries, error handling
- [examples](https://github.com/puregram/puregram/tree/v3/examples/webhooks) — runnable fastify and raw http webhook examples
