---
title: '@puregram/widgets'
description: build HTML widgets with typed state, safe interpolation and widget-query handling
---

# `@puregram/widgets`

widgets are self-contained HTML documents rendered inside Telegram message bubbles. their HTML is immutable; only the bot can change their message-local `chat_data` and shared `public_data`. JavaScript runs in Telegram's QuickJS sandbox, without network access or keyboard input.

Bot API 10.4 uses the regular API endpoint. **production supports only private chats with the bot**, and automatically protects widget messages: users cannot forward them. widgets cannot be copied. groups, inline mode and forwards are test-server features; direct channel posts are unsupported. see [Telegram's availability table](https://core.telegram.org/bots/widgets#availability).

## install

```sh
yarn add @puregram/widgets
```

## a counter

keep authoritative state on the bot side: queries do not contain the current state, and their `data` is untrusted input.

```ts
import { Telegram } from 'puregram'
import { defineWidget, html, js, json, queryData, widgets } from '@puregram/widgets'

const tg = Telegram.fromToken(process.env.TOKEN!).extend(widgets({ autoAnswer: true }))
const Increment = queryData('inc')
const counts = new Map<string, number>()

const Counter = defineWidget({
  chat: json<{ count: number }>(),
  html: html`<p id="count"></p><button id="increment">+1</button>
<script>
const W = window.TelegramWidget
const output = document.getElementById('count')
const draw = () => {
  const state = JSON.parse(W.chatData || '{"count":0}')
  output.textContent = String(state.count)
}
W.onEvent('chatDataChanged', draw)
draw()
document.getElementById('increment').onclick = () => {
  W.request(${js(Increment.encode('next'))}).catch((error) => {
    output.textContent = 'request failed: ' + error.code
  })
}
</script>`
})

tg.command('counter', async (message) => {
  if (message.chat.type !== 'private') return
  const sent = await Counter.send(tg, message.chat.id, {
    chat: { count: 0 }, allowQueries: true, caption: 'interactive counter'
  })
  counts.set(`${message.chat.id}:${sent.message_id}`, 0)
})

tg.onWidgetQuery(Increment.filter, async (query) => {
  const key = `${query.chat?.id}:${query.raw.message_id}`
  const previous = counts.get(key)
  if (query.type.type !== 'data' || query.payload !== 'next' || previous === undefined) {
    return query.answer({ data: 'counter unavailable' })
  }
  const count = previous + 1
  await Counter.editState(query, query, { chat: { count } })
  counts.set(key, count)
  await query.answer({ data: String(count) })
})

await tg.startPolling({
  allowedUpdates: 'auto',
  sequentializeBy: raw => {
    const query = raw.widget_query
    return query === undefined ? undefined : `${query.chat?.id}:${query.message_id}`
  }
})
```

this example keeps counters in memory; persist them for use across restarts. an answer reaches only the widget that asked and **does not change its state**. `editState` changes state separately, and a running widget redraws on `chatDataChanged` / `publicDataChanged`.

## HTML and limits

`html` escapes text and quoted attribute values. nested `html` composes markup, and `raw(source)` inserts trusted HTML or CSS. inside `<script>`, use `js(value)` for JSON-serializable data; inside `<style>`, only `raw()` is accepted. do not interpolate untrusted code, tag names, event handlers or unchecked URLs.

```ts
import { html, js, raw } from '@puregram/widgets'

const card = html`<style>${raw('b{color:var(--tg-theme-text-color)}')}</style>
<b>${'<escaped text>'}</b><script>const label = ${js('</script>')}</script>`

card.source
card.bytes
card.compressedBytes
card.check()
card.assertFits()
```

- HTML: 1–32768 UTF-8 bytes, no NUL characters.
- compressed HTML: at most 4096 bytes of **RFC1950 zlib at level 9**, not gzip or raw deflate. `.compressedBytes` is cached; `.check()` warns above 3800. compression builds can differ near the limit: [Telegram recommends Python's zlib for an exact count](https://core.telegram.org/bots/widgets#counting-the-size). the server is authoritative.
- each state: at most 1024 UTF-8 bytes, no NUL characters. `null` encodes as `''` to clear it; `undefined` omits a state field in sends and message edits.
- request data: 1–64 UTF-8 bytes. answer data: at most 1024 bytes, within 15 seconds.

`send()` and `content()` check the HTML once per definition before use. send **plain HTML** to the API; local compression measures it only. the package uses portable JavaScript zlib, `TextEncoder` and `puregram/runtime`, with no eager Node builtins or `Buffer` requirement.

## typed state and templates

```ts
import { codec, json, text } from '@puregram/widgets'

json<{ count: number }>()
text()
codec<number>(String, Number)

const Greeting = defineWidget({
  html: (name: string) => html`<h3>${name}</h3>`,
  chat: json<{ count: number }>()
})

await Greeting.render('Alice').send(tg, chatId, { chat: { count: 0 } })
```

use a template for content fixed at send time. changing a layout requires a new widget message, not a state edit. captions remain editable through `editMessageCaption`.

## static and shared widgets

| helper | result |
|---|---|
| `Widget.send(tg, chatId, options?)` | sends HTML, typed `chat` / `public` state, `allowQueries`, `shared`, and ordinary `sendWidget` options |
| `Widget.sendShared(tg, chatId, widgetId, options?)` | reuses an existing shared widget, with this message's chat state and caption |
| `Widget.content(options?)` | new inline widget content; **test server only** |
| `Widget.sharedContent(widgetId, options?)` | existing shared widget inline content; **test server only** |
| `Widget.editState(tg, target, state)` | edits by `{ chat_id, message_id }`, `{ inline_message_id }` or `WidgetQueryUpdate`; returns `false` on “message is not modified” |
| `Widget.editShared(tg, widgetId, publicState, options?)` | edits a shared widget's public state by its string identifier; `null` clears it |
| `Widget.decode(message)` | typed `{ chat, public }` from a raw or wrapped widget |

`send(..., { shared: true })` creates the shared widget; read its `widget.id` from the returned message. all messages showing it share the same HTML and public state. each message still has its own chat state. a static widget's forwarded copy is a snapshot without chat state; only shared forwards can request the bot. forwards are test-server-only today.

call `TelegramWidget.watchPublicData()` in a shared widget to receive live public-state changes while it is visible. the initial refresh period is 30 seconds. `editShared(..., publicState, { cacheTime: 10 })` changes it; values below 5 are rejected and the server clamps values above 3600. public state is required even when changing only `cacheTime`. shared widgets accept at most one edit per second; coalesce frequent changes in application code.

## queries and wallet outcomes

`queryData('vote')` encodes `vote:<payload>`, checks the request size, and attaches a typed string `query.payload` when its filter matches either widget-query update kind. register handlers with `onWidgetQuery` and, for shared forwards on the test server, `onSharedWidgetQuery`. inspect `query.type.type`: the official variants are `data`, `sign_data` and `sent_transaction`.

`widgets({ autoAnswer: true })` answers queries left unanswered by handlers, including shared queries and handler failures. it is off by default; `{ autoAnswer: { data: 'unavailable' } }` sets a fallback result. use `query.answer()` so the plugin tracks the answer; direct API calls are not tracked.

wallet requests and outcomes use the official API objects without a package-specific wire format. **a wallet outcome is not proof of payment.** verify signatures and transactions against the wallet and blockchain before fulfilling anything. see [Telegram's wallet guide](https://core.telegram.org/bots/widgets#payments-with-the-wallet).

## see also

- [official widget guide and sandbox profile](https://core.telegram.org/bots/widgets)
- [showcase recipe](https://github.com/puregram/puregram/tree/v3/examples/recipes/widgets-showcase)
