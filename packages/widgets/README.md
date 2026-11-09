<div align='center'>
  <img src='https://i.imgur.com/ZzjmE8i.png' />
</div>

<br />

<div align='center'>
  <a href='https://github.com/puregram/puregram'><b><code>puregram</code></b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#limits'><b>limits</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#auto-answering'><b>auto-answering</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='https://t.me/pureforum'><b>telegram forum</b></a>
</div>

## @puregram/widgets

_html widgets (bot api 10.4) for `puregram`_

### introduction

a widget is a small self-contained html document (inline `<style>` and `<script>`) that the bot sends as a message and every telegram client draws inside the chat bubble. the widget's code reads its state (`chatData`, `publicData`) through `window.TelegramWidget`, and asks the bot for things with `TelegramWidget.request(data)`, which reaches the bot as a `widget_query` update

`@puregram/widgets` keeps the bot side boring:

- an `html` tagged template that escapes everything you interpolate for the context it lands in and measures the result against the server's limits before sending
- typed state codecs, so `chat_data` / `public_data` are values, not hand-built strings
- `defineWidget(...)` values accepted by `message.sendWidget(Widget, options)` and `tg.sendWidget(chatId, Widget, options)`, with state-editing and inline-content helpers
- `queryData(prefix)`, a filter for the `data` a widget sends
- a `widgets()` plugin that answers the queries no handler answered

widgets use the regular bot api endpoint. in production, they work only in private chats with the bot and are automatically protected: they cannot be forwarded or copied. groups, inline widgets and forwards work on telegram's test server only. widgets cannot be posted directly in channels; copying widgets is unsupported in either environment. see [telegram's availability table](https://core.telegram.org/bots/widgets#availability).

### example

a counter (per-message chat state) and a shared poll (one public state for every copy):

```ts
import { Telegram } from 'puregram'
import { defineWidget, html, js, json, queryData, widgets } from '@puregram/widgets'

const tg = Telegram.fromToken(process.env.TOKEN!).extend(widgets({ autoAnswer: true }))

const Inc = queryData('inc')
const counts = new Map<string, number>()

const Counter = defineWidget({
  chat: json<{ count: number }>(),
  html: html`<b id="n">0</b> <button id="inc">+1</button>
<script>
const TW = window.TelegramWidget
const draw = () => { n.textContent = String(JSON.parse(TW.chatData || '{"count":0}').count) }
TW.onEvent('chatDataChanged', draw); draw()
inc.onclick = () => TW.request(${js(Inc.encode('next'))}).catch(error => { n.textContent = error.code })
</script>`
})

tg.command('counter', async (message) => {
  if (message.chat.type !== 'private') return
  const sent = await message.sendWidget(Counter, {
    chat: { count: 0 }, allowQueries: true, caption: 'interactive counter'
  })
  counts.set(`${message.chat.id}:${sent.message_id}`, 0)
})

tg.onWidgetQuery(Inc.filter, async (query) => {
  const key = `${query.chat?.id}:${query.raw.message_id}`
  const previous = counts.get(key)
  if (query.type.type !== 'data' || query.payload !== 'next' || previous === undefined) {
    return query.answer({ data: 'counter unavailable' })
  }
  const count = previous + 1

  await Counter.editState(tg, query, { chat: { count } })
  counts.set(key, count)
  await query.answer({ data: String(count) })
})

const Vote = queryData('vote')
const OPTIONS = ['pizza', 'sushi']

const Poll = defineWidget({
  public: json<number[]>(),
  html: html`${OPTIONS.map((name, i) => html`<button data-i="${i}">${name} <span></span></button>`)}
<p id="msg"></p>
<script>
const TW = window.TelegramWidget
const draw = () => {
  const tally = JSON.parse(TW.publicData || '[]')
  document.querySelectorAll('span').forEach((span, i) => { span.textContent = tally[i] || 0 })
}
TW.onEvent('publicDataChanged', draw); TW.watchPublicData(); draw()
document.querySelectorAll('button').forEach((button) => {
  button.onclick = () => TW.request(${js(Vote.prefix)} + ':' + button.dataset.i).then((answer) => { msg.textContent = answer.result })
})
</script>`
})

const tallies = new Map<string, number[]>()

tg.command('poll', async (message) => {
  if (message.chat.type !== 'private') return
  const sent = await message.sendWidget(Poll, {
    shared: true, allowQueries: true, public: [0, 0], caption: 'pizza or sushi?'
  })

  tallies.set(sent.widget!.id!, [0, 0])
})

tg.onWidgetQuery(Vote.filter, async (query) => {
  const tally = tallies.get(query.widgetId ?? '')
  const option = Number(query.payload)

  if (query.type.type !== 'data' || tally === undefined || OPTIONS[option] === undefined) {
    return query.answer({ data: 'this poll is closed' })
  }

  const next = [...tally]
  next[option] = (next[option] ?? 0) + 1
  await Poll.editShared(tg, query.widgetId!, next)
  tallies.set(query.widgetId!, next)
  await query.answer({ data: `you voted ${OPTIONS[option]}` })
})

await tg.startPolling({
  allowedUpdates: 'auto',
  sequentializeBy: raw => raw.widget_query?.widget_id ?? (
    raw.widget_query === undefined ? undefined : `${raw.widget_query.chat?.id}:${raw.widget_query.message_id}`
  )
})
```

this example stores state in memory and serializes updates per widget. coalesce shared edits to at most one per second for busy polls. forwards and inline mode remain test-server-only.

### installation

```sh
yarn add @puregram/widgets
```

inside this repository, use `workspace:^`. the package supports `Telegram` and `TelegramCore`: its runtime imports use `puregram/runtime`, and size checks use portable javascript zlib and `TextEncoder`, not node builtins or `Buffer`.

### html is immutable, state is not

the html is fixed the moment the bot sends it: there is no way to edit it. everything that changes (a score, whose turn it is, a tally, the user's name) goes into the state, and the widget redraws itself on `chatDataChanged` / `publicDataChanged`. one `defineWidget({ html })` is one html document shared by every message you send with it; [a template](#templates) renders one per message from what never changes after sending (a poll's question, an event's date)

| state | where | who sees it | |
|---|---|---|---|
| `chat` (`chat_data`) | per message | that message's chat only; forwards never carry it | `chatDataChanged` |
| `public` (`public_data`) | static widget: per message. shared widget: one object for every message and forward | everyone the widget is shown to | `publicDataChanged`; `watchPublicData()` polls it live |

### `html`

```ts
import { html, js, raw } from '@puregram/widgets'

const name = '<script>alert(1)</script>'

html`<p title="${name}">hi, ${name}</p>`.source
// <p title="&lt;script&gt;alert(1)&lt;/script&gt;">hi, &lt;script&gt;alert(1)&lt;/script&gt;</p>
```

- strings are escaped for text and attribute context (`& < > " '`), numbers and booleans are stringified, `null` / `undefined` render nothing, arrays are joined
- a nested `html\`...\`` or `raw(string)` is inserted as is: use `raw` for markup you trust (a file you ship, a prebuilt svg)
- the tag tracks whether an interpolation sits inside a `<script>` or `<style>` element (case-insensitive, until its closing tag). browsers don't decode entities there, so escaping would corrupt the value:
  - inside `<script>`, wrap data in `js(value)`: `JSON.stringify` with `<`, `>`, `&`, U+2028 and U+2029 written as `\u003c`-style escapes, so it round-trips any json value and a `</script>` in it can't close the element
  - inside `<style>`, only `raw()` is accepted
  - anything else there (a plain value, a nested `html`) throws `WidgetHtmlContextError`, and so does `js()` outside a `<script>`
- the html is fixed once rendered: `js()` is for values known when it is built (the example's `Inc.prefix`, a [template](#templates)'s arguments); whatever changes later goes through state

```ts
html`<script>const greeting = ${js("O'Brien & co")}</script>`.source
// <script>const greeting = "O'Brien \u0026 co"</script>

html`<script>const n = '${name}'</script>`   // throws WidgetHtmlContextError: wrap it in js(value)
```

the result is a `WidgetHtml`:

| member | |
|---|---|
| `.source` | the html string |
| `.bytes` | utf-8 length |
| `.compressedBytes` | RFC1950 zlib level 9 length from pako (computed once, cached), not gzip or raw deflate |
| `.check()` | `{ ok, bytes, compressedBytes, problems }`: errors for empty / NUL-containing HTML and the size limits; warnings above 3800 compressed bytes and for remote resources clients never load (a remote `src=`, `<link rel=stylesheet>`, `@import`, a remote css `url()`) |
| `.assertFits()` | throws `WidgetTooLargeError` (with `.check`) unless `check().ok` |

`sendWidget` serializes the definition through `content`, which checks the HTML limits before any request

compression builds may differ near the limit. the server is authoritative; [telegram recommends Python's `zlib.compress(html, 9)`](https://core.telegram.org/bots/widgets#counting-the-size) for an exact count. aim below 3800 bytes. pass plain HTML to the API: compression is only a local preflight, not a payload to upload. interpolate only into text or quoted attributes, not tag names, event handlers or URLs you have not validated.

### state codecs

```ts
import { codec, json, text } from '@puregram/widgets'

json<{ count: number }>()       // JSON.stringify / JSON.parse, the default for both states
text()                          // the string as is
codec<number>(String, Number)   // your own
```

`encode(value)` throws `WidgetStateTooLargeError` past 1024 utf-8 bytes, and `TypeError` for a serializer returning a non-string or text containing NUL. `null` encodes as `''`, which clears the state (the widget sees `null`); `decode('')` and `decode(undefined)` give `null`

### `defineWidget`

```ts
const Counter = defineWidget({ html, chat?: StateCodec<C>, public?: StateCodec<P> })
```

send through the current message or client; `chat` and `public` are inferred from the definition's codecs. no plugin is required for sending: `widgets()` adds query auto-answering. state-editing helpers still take the client explicitly.

| method | |
|---|---|
| `message.sendWidget(Counter, options?)` / `tg.sendWidget(chatId, Counter, options?)` | sends the widget with typed `chat` / `public` state, `allowQueries`, `shared`, and ordinary `sendWidget` parameters |
| `sendShared(tg, chatId, widgetId, { chat?, ...sendSharedWidget params })` | another message of an existing shared widget, with its own chat state |
| `content({ chat?, public?, allowQueries?, shared?, ...InputWidgetMessageContent fields })` | an `InputWidgetMessageContent` (`width`, `height`, `caption`, `parse_mode`, …) for an inline `article` result (refused on prod for now, see above) |
| `sharedContent(widgetId, { chat?, ...InputSharedWidgetMessageContent fields })` | reuse an existing shared widget in an inline `article` (test server only) |
| `editState(tg, target, { chat?, public? })` | `editMessageWidgetData`. `target` is `{ chat_id, message_id }`, `{ inline_message_id }` or a `WidgetQueryUpdate`. resolves `true` when the state changed and `false` on `message is not modified`; every other error is rethrown |
| `editShared(tg, widgetId, value, { cacheTime? })` | `editSharedWidgetData`; public state is required (`null` clears it). `cacheTime` must be an integer at least 5 (`RangeError` otherwise); the server clamps values above 3600. to change only the refresh period, resend the current public state |
| `decode(message)` | `{ chat, public }` from a message's `widget` (raw or structure) |

in `editState` and `sendWidget`, a state key that is `undefined` is left alone and `null` clears it. raw HTML remains supported as `tg.sendWidget(chatId, htmlString, rawApiOptions)`; `tg.api.sendWidget` keeps the Bot API's all-object form.

<a name='templates'></a>
#### templates: html per message

when part of the html is per message but never changes (a poll's question, a countdown's date), pass `html` as a function. the definition then has every state method (`sendShared`, `sharedContent`, `editState`, `editShared`, `decode`) and `render(args)`, which builds that message's html and returns a plain definition with `send` / `content`. each rendered html is checked once, before its first send

```ts
const Poll = defineWidget({
  public: json<number[]>(),
  html: (poll: { question: string, options: string[] }) => html`<h3>${poll.question}</h3>
${poll.options.map((option, i) => html`<button data-i="${i}">${option}</button>`)}
<script>const OPTIONS = ${js(poll.options)}</script>`
})

await tg.sendWidget(chatId, Poll.render({ question: 'lunch?', options: ['pizza', 'sushi'] }), { shared: true, public: [0, 0] })
await Poll.editShared(tg, widgetId, [1, 0])   // no render: edits never touch the html
```

### `queryData`

```ts
const Vote = queryData('vote')

Vote.encode('2')   // 'vote:2', throws WidgetQueryDataTooLargeError past 64 utf-8 bytes
tg.onWidgetQuery(Vote.filter, query => query.payload)   // payload: string, the part after 'vote:'
```

the widget builds the same string itself (`TelegramWidget.request('vote:' + i)`), so the format stays plain text a script can write in a few bytes. the filter matches `widget_query` and `shared_widget_query`

<a name='auto-answering'></a>
### auto-answering

```ts
tg.extend(widgets({ autoAnswer: true }))                // answers with no data
tg.extend(widgets({ autoAnswer: { data: 'busy' } }))    // or with a fallback
```

after dispatch, the plugin answers every `widget_query` / `shared_widget_query` whose `.answer()` no handler called (including queries no handler matched, and after a handler threw). off by default like core's `autoAnswerCallbackQuery`, but recommended: in the private chat a widget's script may ask in the background, without a tap (once when it appears on screen, then at most every 5 s), and an unanswered query leaves the widget waiting 15 s for a `TIMEOUT`. answering through `tg.api.answerWidgetQuery` directly is not tracked: use `query.answer()`

<a name='limits'></a>
### limits

| what | limit | enforced by |
|---|---|---|
| html | 1–32768 utf-8 bytes, no NUL | `check()` / `assertFits()` |
| html after zlib level 9 | 4096 bytes; warns above 3800 | `check()` / `assertFits()`; server authoritative |
| `chat_data`, `public_data` | 1024 utf-8 bytes, `''` clears | state codecs |
| query `data` (widget → bot) | 1–64 utf-8 bytes | `queryData().encode` |
| answer `data` (bot → widget) | 1024 bytes, within 15 s | server |
| `cache_time` | 5..3600 seconds; above 3600 is clamped by the server | `editShared` / server |

### requests, wallet and state

`WidgetQuery.type` and `SharedWidgetQuery.type` use the official `WidgetQueryType` union: `data` (with an optional wallet card), `sign_data` or `sent_transaction`. `queryData` matches the request's `data` prefix for all three; inspect `query.type` before handling a wallet outcome. the package never verifies signatures or payments for you. follow [telegram's wallet guide](https://core.telegram.org/bots/widgets#payments-with-the-wallet): validate signatures and wallet addresses, and check transactions on-chain before fulfilling an order.

the query contains no state. keep authoritative state on the bot side, validate every query's data and commit local mutations only after the API edit succeeds. answers carry only `data`, not state changes: use `editState` or `editShared` separately. shared widgets accept at most one edit per second; coalesce frequent changes in your application. the showcase is an in-memory demonstration, not durable storage.
