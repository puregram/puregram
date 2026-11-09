<!-- inspired by prisma.io & telegraf docs -->

<div align='center'>
  <img src='https://i.imgur.com/ZzjmE8i.png' />
</div>

<br />

<p align='center'>
  powerful and epic overall,
  <code>puregram</code>
  allows you to
  <b>easily interact</b>
  with
  <a href='https://core.telegram.org/bots/api'>telegram bot api</a>
  via
  <a href='https://nodejs.org'>node.js</a>
  😎👍
</p>

<div align='center'>
  <a href='https://github.com/puregram/puregram/tree/v3/examples'><b>examples</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#typescript-usage'><b>typescript usage</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='https://forum.puregram.cool'><b>telegram forum</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#faq'><b>faq</b></a>
</div>

## introduction

**3.10.0 is a breaking shortcut release within v3.** primary arguments on generated update shortcuts are now positional: for example, `inlineQuery.answer(results, params?)` and `preCheckoutQuery.answer(ok, params?)`. raw `tg.api.*` calls are unchanged. this release pins `@puregram/api` to `10.3.3`; older core versions with a `~10.3.x` API dependency can also receive the changed shortcuts when dependencies update. read the [migration guide](https://github.com/puregram/puregram/blob/v3/docs/guide/concepts/shortcuts.md#migrating-to-puregram-3100--api-1033) before upgrading.

bot api 10.4 adds widget sends and query handlers, TON wallet/gift/theme types, rich quotes, and callback-only ephemeral replies. `tg.ephemeral({ callbackQueryId })` sends without a receiver or chat id; answer the callback separately. the existing `tg.ephemeral(userId, options?)` form remains available.

**first, what are telegram bots?**
[telegram][telegram] has their own [bot accounts][telegram/bots].
**bots** are special telegram accounts that can be only accessed via code
and were designed to handle messages, inline queries and callback queries automatically.
_users can interact with bots by sending them messages, commands and inline requests._

[telegram]: https://t.me
[telegram/bots]: https://core.telegram.org/bots

### example

```ts
import { Telegram } from 'puregram'

const telegram = Telegram.fromToken(process.env.TOKEN!)

telegram.onMessage(message => message.send('hey!'))

await telegram.startPolling()
```

it's that easy!

**note**: you can find more examples [here][examples]

[examples]: https://github.com/puregram/puregram/tree/v3/examples

---

## table of contents

- [why `puregram`?](#why-puregram) _(very important!!)_
- [**getting started**](#getting-started)
  - [getting a token](#getting-token)
  - [installation](#installation)
  - [usage](#usage)
  - [calling api methods](#calling-api-methods)
    - [`suppress`ing api errors](#suppressing-errors)
    - [iterating paginated endpoints](#iterators)
    - [acting as a business account](#business)
  - [sending media (`MediaSource`)](#sending-media)
  - [`InputMedia` and friends](#input-media)
  - [using markdown (`parse_mode`)](#using-markdown)
  - [keyboards (`reply_markup`)](#keyboards)
- [updates](#updates)
- [filters](#filters)
- [middlewares](#middlewares)
- [hooks](#hooks)
- [extending puregram with plugins](#extending-puregram-with-plugins)
- [custom updates](#custom-updates)
- [polling](#polling)
- [webhook](#webhook)
- [local bot api server](#local-bot-api-server)
- [resilience](#resilience)
  - [`retryOnFloodWait` — auto-retry on 429](#retry-on-flood-wait)
  - [`tg.catch` + `swallowDispatchErrors`](#tg-catch)
  - [polling concurrency + per-key sequentialization](#polling-concurrency)
  - [auto-answering + de-duplicating updates](#auto-answer-dedupe)
- [debug logs](#debug-logs)
- [**typescript usage**](#typescript-usage)
- [**faq**](#faq)
- [ecosystem](#ecosystem)

---

<a name='why-puregram'></a>
## why `puregram`?

- written **by [starków](https://github.com/nitreojs)** ⚠
- powered **by [j++team](https://github.com/jppteam)** ⚠
- very **cool** package name ⚠
- package itself is **cool**
- **works** _(at least it should)_
- i **understand** only about **30%** of this **code**
- because **why not**?

---

<a name='getting-started'></a>
## getting started

<a name='getting-token'></a>
### getting token

before you do anything, you'll need a bot token.
talk to [@BotFather][botfather], send `/newbot`, follow the prompts
and copy the token he gives you. that's it — **you're a bot owner now**

[botfather]: https://t.me/BotFather

**note**: never paste your token straight into source.
either read it from `process.env`, or load it from a file you've gitignored.
**anyone with the token controls the bot**

<a name='installation'></a>
### installation

```sh
$ yarn add puregram
$ npm i -S puregram
```

requires node `>=22.0.0`

<a name='usage'></a>
### usage

`Telegram.fromToken(token, options?)` is the shortest path to a bot. it pulls sensible defaults and gets out of your way:

```ts
import { Telegram } from 'puregram'

const telegram = Telegram.fromToken(process.env.TOKEN!)

telegram.onMessage(message => message.send('hi!'))

await telegram.startPolling()
```

if you need full control over options (a custom `apiBaseUrl`, a pluggable `httpClient`, headers, retry budget, etc) the explicit constructor is right there:

```ts
const telegram = new Telegram({
  token: process.env.TOKEN!,
  apiBaseUrl: 'https://api.telegram.org/bot',
  apiTimeout: 30_000,
  apiRetryLimit: -1
})
```

<a name='calling-api-methods'></a>
### calling api methods

`puregram` gives you a few different ways to talk to the bot api. they're equivalent in capability — pick whichever reads best at the call site

```ts
// 1. raw bot api — every method, schema-typed params, fully autogenerated
await telegram.api.sendMessage({ chat_id: 100, text: 'hi' })

// 2. curated shortcut — positional args (chat first, text second)
await telegram.send(100, 'hi')

// 3. per-kind shortcut on the update — chat_id auto-filled from update.chat.id
telegram.onMessage(message => message.send('hi'))

// 4. escape hatch for methods we haven't generated yet (e.g. corefork-only beta methods)
await telegram.api.call('someBetaMethod', { foo: 'bar' })
```

every wrapped accessor keeps `.raw` available — when you want the bare bot-api payload, just reach in:

```ts
telegram.onMessage((message) => {
  const text = message.text          // wrapped accessor
  const rawDate = message.raw.date   // raw payload, always available

  return message.send(`text=${text} date=${rawDate}`)
})
```

<a name='suppressing-errors'></a>
#### `suppress`ing api errors

by default, api errors throw an `ApiError`:

```ts
import { ApiError } from 'puregram'

try {
  await telegram.api.sendMessage({ chat_id: 1, text: 'hi' })
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.code, error.message)
  }
}
```

if you don't want to write `try/catch` every time, pass `suppress: true`. the return type becomes `T | ApiResponseError` — a typed conditional return — and `Telegram.isErrorResponse(value)` narrows it for you:

```ts
const result = await telegram.api.sendMessage({ chat_id: 1, text: 'hi', suppress: true })

if (Telegram.isErrorResponse(result)) {
  console.error(result.description)
} else {
  console.log(result.message_id) // typed as Message
}
```

**note**: `telegram.api.call('method', params)` always throws — there's no `suppress` on the string escape hatch

<a name='iterators'></a>
#### iterating paginated endpoints

some bot api methods return one page at a time. the `iter*` helpers auto-page them — `for await` yields items one by one, or `.collect()` drains the rest into an array carrying the `total` telegram reported:

```ts
// star transactions, gifts, profile photos/audios — paged transparently
for await (const transaction of telegram.iterStarTransactions()) {
  console.log(transaction.amount)
}

const photos = await telegram.iterUserProfilePhotos(userId).collect()
console.log(photos.length, photos.total)
```

covers the six paged endpoints: `iterUserProfilePhotos`, `iterUserProfileAudios`, `iterStarTransactions`, `iterUserGifts`, `iterChatGifts`, `iterBusinessAccountGifts`. each takes the same options as its `get*` method (minus the offset, which the iterator manages); pass `{ limit }` to tune the page size

<a name='business'></a>
#### acting as a business account

`telegram.business(connectionId)` returns a scoped copy of `telegram.api` that injects `business_connection_id` into every call — for when a [business connection](https://core.telegram.org/bots/business) lets your bot act on an account's behalf. a call-site `business_connection_id` still wins:

```ts
telegram.onBusinessMessage(async (message) => {
  const business = telegram.business(message.raw.business_connection_id!)

  await business.sendMessage({ chat_id: message.chat.id, text: 'on behalf of the account' })
})
```

it's the same proxy as `telegram.api` — every method (and `suppress`) works identically, only `business_connection_id` is pre-filled

<a name='sending-media'></a>
### sending media (`MediaSource`)

every method that accepts an upload (photo, video, document, …) takes a `MediaSource`. it's a tiny tagged union so the multipart pipeline knows where the bytes live:

```ts
import { MediaSource } from 'puregram'

await telegram.api.sendPhoto({ chat_id: 1, photo: MediaSource.path('./cat.png') })

await telegram.api.sendDocument({ chat_id: 1, document: MediaSource.url('https://...') })

await telegram.api.sendVideo({ chat_id: 1, video: MediaSource.fileId('AgACAgI...') })
```

the full menu:

| factory | when to use |
|---|---|
| `MediaSource.path(path)` | local file path |
| `MediaSource.url(url, { forceUpload? })` | remote url; telegram fetches it (or you do, with `forceUpload`) |
| `MediaSource.fileId(id)` | reuse an already-uploaded file |
| `MediaSource.buffer(buffer)` | a `Buffer` you already have in memory |
| `MediaSource.stream(readable)` | a node `Readable` stream |
| `MediaSource.file(file)` | an `undici.File` instance |
| `MediaSource.arrayBuffer(ab)` | a raw `ArrayBuffer` |
| `MediaSource.bytes(view)` | any `ArrayBufferView` (`Uint8Array`, typed arrays, `DataView`) |
| `MediaSource.base64(b64)` | a base64-encoded string |
| `MediaSource.text(text)` | a utf-8 string sent as a file (pair with `filename`) |
| `MediaSource.json(value, { space? })` | a value serialized through `JSON.stringify` |
| `MediaSource.local(path)` | a path the [local bot api server](#local-bot-api-server) reads off disk — no upload (requires `useLocal`) |

<a name='input-media'></a>
### `InputMedia` and friends

for methods that take an array of media inputs (`sendMediaGroup`, `editMessageMedia`, `answerInlineQuery`, …) the schema-derived factories are autogenerated:

```ts
import { InputMedia, InlineQueryResult, InputMessageContent } from 'puregram'

await telegram.api.sendMediaGroup({
  chat_id: 1,
  media: [
    InputMedia.photo(MediaSource.path('./a.jpg'), { caption: 'first' }),
    InputMedia.photo(MediaSource.path('./b.jpg'))
  ]
})

await telegram.api.answerInlineQuery({
  inline_query_id: 'q',
  results: [
    InlineQueryResult.article({
      id: '1',
      title: 'hello',
      content: InputMessageContent.text('hi there'),
      thumbnail: { url: 'https://example.com/icon.png', width: 100, height: 100 }
    })
  ]
})
```

`InlineQueryResult.X(...)` factories rename three bot-api fields for ergonomics — these are the **only** factories that diverge from snake_case bot-api naming:

| bot api | puregram |
|---|---|
| `input_message_content` | `content` |
| `reply_markup` | `replyMarkup` |
| `thumbnail_url` / `thumbnail_width` / `thumbnail_height` / `thumbnail_mime_type` | `thumbnail: { url, width?, height?, mimeType? }` |

`replyMarkup` accepts both the raw `{ inline_keyboard: [...] }` shape and any `InlineKeyboard.keyboard(...)` builder — pass whichever's prettier at the call site

`InputMedia` covers every variant the bot api accepts:

| factory | wire `type` |
|---|---|
| `InputMedia.photo(media, params?)` | `'photo'` |
| `InputMedia.video(media, params?)` | `'video'` |
| `InputMedia.document(media, params?)` | `'document'` |
| `InputMedia.animation(media, params?)` | `'animation'` |
| `InputMedia.audio(media, params?)` | `'audio'` |
| `InputMedia.sticker(media, params?)` | `'sticker'` |
| `InputMedia.videoNote(media, params?)` | `'video_note'` |
| `InputMedia.voice(media, params?)` | `'voice'` |

the first arg is anything `MediaSource` can produce (or a raw `attach://name` reference); each call returns the correctly-discriminated `TelegramInputMedia*` shape, so the array passed to `sendMediaGroup` typechecks per-element. the same shape holds for `InlineQueryResult.{article, photo, video, audio, voice, document, gif, mpeg4Gif, location, venue, contact, game}` (with `InlineQueryResult.cached.X` for the cached variants) and `InputMessageContent.{text, location, venue, contact, invoice}`

<a name='media-group'></a>
### `MediaGroup` — full albums for `sendMediaGroup`

`InputMedia.X(...)` builds **one item**. `MediaGroup.X(items, opts?)` builds the **whole array** for `sendMediaGroup`, with `caption` automatically attached to one item (the first by default — telegram displays the first item's caption as the album-level caption)

```ts
import { MediaGroup, MediaSource } from 'puregram'

await telegram.api.sendMediaGroup({
  chat_id: 100,
  media: MediaGroup.photos([
    MediaSource.path('./a.jpg'),
    MediaSource.path('./b.jpg'),
    MediaSource.path('./c.jpg')
  ], { caption: 'three photos' })
})

// pin the caption to a different item
await telegram.api.sendMediaGroup({
  chat_id: 100,
  media: MediaGroup.videos([
    MediaSource.path('./a.mp4'),
    MediaSource.path('./b.mp4')
  ], { caption: 'second video', captionIndex: 1 })
})
```

| factory | wire `type` |
|---|---|
| `MediaGroup.photos(items, opts?)` | `'photo'` |
| `MediaGroup.videos(items, opts?)` | `'video'` |
| `MediaGroup.documents(items, opts?)` | `'document'` |
| `MediaGroup.audios(items, opts?)` | `'audio'` |

`opts: { caption?: string | Formattable, captionIndex?: number }`. items accept anything `MediaSource` can produce, plus raw `attach://name` references. document and audio groups must be uniform; photos and videos can mix freely

<a name='reply-parameters'></a>
### `ReplyParameters` — `reply_parameters`

three intents, three factories:

```ts
import { ReplyParameters } from 'puregram'

// reply to a message in the same chat
await telegram.send(chat, 'reply!', {
  reply_parameters: ReplyParameters.to(42)
})

// cross-chat reply (forwarding-aware reply pointing at another chat's message)
await telegram.send(chat, 'cross-chat reply', {
  reply_parameters: ReplyParameters.cross(-100123, 7)
})

// quote a specific excerpt from the original message
await telegram.send(chat, 'with quote', {
  reply_parameters: ReplyParameters.quote(42, 'the part i am replying to')
})
```

bot api 10.4 rich quotes use the camelCase `quoteRichTexts` extras field on `to`, `cross`, or `quote`; the factory preserves the nested `RichText` values as `quote_rich_texts`.

<a name='link-preview'></a>
### `LinkPreview` — `link_preview_options`

four factories covering every common case. `disabled` shuts off the preview entirely; the others pin a specific url and choose its size hint:

```ts
import { LinkPreview } from 'puregram'

await telegram.send(chat, 'no preview', { link_preview_options: LinkPreview.disabled() })

await telegram.send(chat, 'big preview', {
  link_preview_options: LinkPreview.large('https://example.com')
})

await telegram.send(chat, 'small preview', {
  link_preview_options: LinkPreview.small('https://example.com')
})

await telegram.send(chat, 'just the url', {
  link_preview_options: LinkPreview.url('https://example.com')
})
```

<a name='reaction'></a>
### `Reaction` — `setMessageReaction`

three reaction types: standard emoji, premium custom emoji, paid star reaction (can't be used by bots).
compose them in an array because `setMessageReaction` accepts a list:

```ts
import { Reaction } from 'puregram'

await telegram.api.setMessageReaction({
  chat_id: chat,
  message_id: 1,
  reaction: [Reaction.emoji('👍')]
})

await telegram.api.setMessageReaction({
  chat_id: chat,
  message_id: 1,
  reaction: [Reaction.customEmoji('5448765217123141')]
})
```

<a name='chat-permissions'></a>
### `ChatPermissions` / `ChatAdministratorRights`

both come with two factories: `allowAll(overrides?)` and `denyAll(overrides?)`.
if you want all-but-one, start from the opposite default and pass overrides — this is much shorter
than spelling every flag out by hand

```ts
import { ChatPermissions, ChatAdministratorRights } from 'puregram'

// muted everywhere except text messages
await telegram.api.restrictChatMember({
  chat_id: chat,
  user_id: user,
  permissions: ChatPermissions.denyAll({ canSendMessages: true })
})

// promote with full admin rights
await telegram.api.promoteChatMember({
  chat_id: chat,
  user_id: user,
  ...ChatAdministratorRights.allowAll()
})
```

<a name='input-poll-option'></a>
### `InputPollOption` — `sendPoll(options)`

`text(text, extras?)` — the option text, with optional `parseMode` / `entities` for formatted text and `media` (bot api 10.0) for media-backed options

```ts
import { InputPollOption } from 'puregram'

await telegram.api.sendPoll({
  chat_id: chat,
  question: 'pick one',
  options: [
    InputPollOption.text('a'),
    InputPollOption.text('<b>b</b>', { parseMode: 'HTML' })
  ]
})
```

<a name='input-sticker'></a>
### `InputSticker` — `addStickerToSet`, `createNewStickerSet`

three factories matching the three sticker file formats. emoji list is the second positional arg since you basically always need it:

```ts
import { InputSticker } from 'puregram'

const stickers = [
  InputSticker.static('attach://a.png', ['😀']),
  InputSticker.animated('attach://b.tgs', ['🎉'], { keywords: ['party'] }),
  InputSticker.video('attach://c.webm', ['🐱'])
]
```

<a name='labeled-price'></a>
### `LabeledPrice` + `ShippingOption` — invoices

`LabeledPrice.of(label, amount)` builds one line item (amount in the currency's smallest units — cents, kopecks, etc). `ShippingOption.of(id, title, prices)` bundles a few line items into one named option:

```ts
import { LabeledPrice, ShippingOption } from 'puregram'

const prices = [
  LabeledPrice.of('item', 1500),       // $15.00
  LabeledPrice.of('shipping', 500)     // $5.00
]

const shipping = [
  ShippingOption.of('std', 'standard', prices),
  ShippingOption.of('fast', 'express', [...prices, LabeledPrice.of('rush', 1000)])
]
```

<a name='invoice'></a>
### `Invoice` — `sendInvoice` / `createInvoiceLink` (stars + fiat)

`LabeledPrice` builds the line items; `Invoice` builds the whole invoice body — and encodes telegram's payments split as types. `Invoice.stars(...)` pins `currency` to `'XTR'`, sends an empty `provider_token`, allows `subscriptionPeriod`, and rejects the fiat-only knobs (tips, shipping, `is_flexible`). `Invoice.fiat(...)` requires a `providerToken` + ISO 4217 `currency`, allows tips/shipping/flexible, and rejects `subscriptionPeriod`. pass the wrong field and it's a compile error, not a runtime `400`

```ts
import { Invoice, LabeledPrice } from 'puregram'

// telegram stars — currency is forced to XTR; `providerToken` won't even typecheck here
const link = await telegram.api.createInvoiceLink(Invoice.stars({
  title: 'pro plan', description: 'monthly', payload: 'sub_pro',
  prices: [LabeledPrice.of('1 month', 250)],   // amount = stars
  subscriptionPeriod: 2_592_000                 // 30 days, xtr-only
}))

// fiat — provider token + currency required; spread into sendInvoice with a chat_id
await telegram.api.sendInvoice({
  chat_id,
  ...Invoice.fiat({
    title: 'coffee', description: 'a good cup', payload: 'order_42',
    providerToken: process.env.PROVIDER_TOKEN!,
    currency: 'EUR',
    prices: [LabeledPrice.of('cup', 500), LabeledPrice.of('shipping', 150)],
    isFlexible: true
  })
})
```

the result carries only the invoice-definition fields (no `chat_id`, no delivery options) — spread it into `sendInvoice` or pass it straight to `createInvoiceLink`. add `business_connection_id` at the call site (or use [`telegram.business(...)`](#business))

<a name='bot-commands'></a>
### `BotCommands` (+ `.scope`) — `setMyCommands`

`BotCommands.command(name, description)` for one entry. `BotCommands.scope.X(...)` for the discriminated `BotCommandScope` family (default / private chats / groups / chat / chat admin / specific user):

```ts
import { BotCommands } from 'puregram'

await telegram.api.setMyCommands({
  commands: [
    BotCommands.command('start', 'start the bot'),
    BotCommands.command('help', 'show help')
  ],
  scope: BotCommands.scope.allPrivateChats()
})

// admin-only command in one specific chat
await telegram.api.setMyCommands({
  commands: [BotCommands.command('admin', 'admin panel')],
  scope: BotCommands.scope.chatAdministrators(-100123)
})
```

scope factories: `default()`, `allPrivateChats()`, `allGroupChats()`, `allChatAdministrators()`, `chat(chatId)`, `chatAdministrators(chatId)`, `chatMember(chatId, userId)`

<a name='menu-button'></a>
### `MenuButton` — `setChatMenuButton`

three menu modes — fall back to bot-wide default, show the bot's command list, or launch a web app:

```ts
import { MenuButton } from 'puregram'

// open a web app from the menu button
await telegram.api.setChatMenuButton({
  chat_id: chat,
  menu_button: MenuButton.webApp('open dashboard', 'https://example.com/dash')
})

// show the standard command list
await telegram.api.setChatMenuButton({
  chat_id: chat,
  menu_button: MenuButton.commands()
})

// fall back to the bot-wide default
await telegram.api.setChatMenuButton({
  chat_id: chat,
  menu_button: MenuButton.default()
})
```

<a name='input-message-content'></a>
### `InputMessageContent` — message bodies inside inline query results

passed as the `content` field on `InlineQueryResult.X(...)` (see [inline-media-and-friends](#input-media)).
variants match the bot api's `InputXMessageContent` family — text, location, venue, contact, invoice, rich, widget and shared widget.
positional args for the required fields, params object for the rest:

```ts
import { InputMessageContent } from 'puregram'

InputMessageContent.text('hi there', { parseMode: 'HTML' })
InputMessageContent.location(55.75, 37.61, { livePeriod: 3600 })
InputMessageContent.venue(55.75, 37.61, 'Red Square', 'Moscow, Russia')
InputMessageContent.contact('+1234567890', 'first name', { lastName: 'last' })

// invoice has too many required fields for a positional form — pass the full param object
InputMessageContent.invoice({
  title: 'thing',
  description: 'a thing',
  payload: 'payload-1',
  currency: 'USD',
  prices: [LabeledPrice.of('thing', 1500)]
})
```

`InputMessageContent.widget(html, { width?, height?, publicData?, chatData?, allowQueries?, isShared?, ... })` and `InputMessageContent.sharedWidget(widgetId, { chatData?, caption?, ... })` preserve string widget identifiers and convert extras to their API field names. telegram currently disables inline widget sends in production; regular `sendWidget` / `sendSharedWidget` sends are private-chat-only and automatically protected.

<a name='using-markdown'></a>
### using markdown (`parse_mode`)

three static helper classes — `HTML`, `Markdown`, `MarkdownV2` — wrap each formatting style. they escape user input for you, which matters more than it sounds:

```ts
import { HTML, MarkdownV2 } from 'puregram'

await telegram.send(100, `${HTML.bold('hello!')} ${HTML.italic('world')}`, {
  parse_mode: 'HTML'
})

await telegram.send(100, MarkdownV2.bold('hi'), { parse_mode: 'MarkdownV2' })
```

if you want a tagged-template api with chained styles instead of stringly-typed concat — and
you don't want to think about `parse_mode` at all — look at [`@puregram/markup`](../markup).
it composes message entities directly, so the same `bold(italic\`hi\`)` works regardless of the formatting flavor

<a name='keyboards'></a>
### keyboards (`reply_markup`)

four kinds of keyboards live in core: `Keyboard` (reply), `InlineKeyboard`, `RemoveKeyboard`, `ForceReply`. each one has a static-method builder for the common case, plus a `*Builder` class for fluent chains

```ts
import { InlineKeyboard, Keyboard, RemoveKeyboard, ForceReply } from 'puregram'

// inline keyboard, attached to a message
await telegram.send(100, 'pick one', {
  reply_markup: InlineKeyboard.keyboard([
    [InlineKeyboard.urlButton({ text: 'docs', url: 'https://core.telegram.org/bots/api' })],
    [InlineKeyboard.textButton({ text: 'press me', payload: 'press' })]
  ])
})

// reply keyboard
const replyKeyboard = Keyboard.keyboard([
  [Keyboard.textButton('yes'), Keyboard.textButton('no')]
])

// remove the reply keyboard
const remove = new RemoveKeyboard()

// force the user into a reply, optionally with a placeholder
const force = new ForceReply().setPlaceholder('your answer here')
```

---

<a name='updates'></a>
## updates

an **update** is anything telegram pushes at your bot — a new message, an edited message, a callback-query press, an inline query, a poll-vote, a chat-member change, etc. there are about 30 different kinds, each one a discriminated subclass of the `Update` union

every update class is **codegen'd** from the bot api schema, so:
- primitive fields are direct getters: `message.text`, `message.messageId`, `callbackQuery.data`
- nested-object fields are lazy + memoized wrappers: `message.from` (a `User`), `message.chat` (a `Chat`)
- per-kind shortcuts are attached as methods: `message.send(...)`, `message.edit(...)`, `message.delete()`, `callbackQuery.answer(...)`
- `update.kind` is a literal-typed discriminant, `update.is('message')` narrows the type, `update.raw` is always the bot-api payload as-is

```ts
telegram.onMessage(message => message.send('got it'))
telegram.onCallbackQuery(callbackQuery => callbackQuery.answer({ text: 'thanks' }))
telegram.onInlineQuery(inlineQuery => inlineQuery.answer([]))

// or hook anything via onUpdate
telegram.onUpdate((update) => {
  if (update.is('message') && update.hasText()) {
    return update.send(`echo: ${update.text}`)
  }
})
```

every kind has a matching `telegram.on<Kind>(handler)` — `onMessage`, `onEditedMessage`, `onChannelPost`, `onCallbackQuery`, `onInlineQuery`, `onChatMember`, `onPoll`, … — picking a kind that doesn't exist is a compile error. for cross-kind handlers or custom predicates, `telegram.onUpdate(...)` is the catch-all

<a name='uniform-accessors'></a>
### uniform accessors

a few accessors keep the same name across kinds, so cross-kind code never juggles spellings:

- `update.senderId` — the acting user's id on every kind whose payload identifies one (`callback_query`, `inline_query`, `pre_checkout_query`, `chat_member`, `business_connection`, …). messages fall back `from.id` → `sender_chat.id` → `chat.id`; `poll_answer` / `message_reaction` fall back to their anonymous-chat actor and may be `undefined`
- `update.tg` — the client that dispatched the update; `update.tg.bot` is the bot's own identity (the `getMe` result, resolved before dispatch starts) — handy for mention-stripping, deep links, and self-detection
- shared update download helpers are typed as `Uint8Array` (or `null` where media can be absent), including on Node. the concrete Node client's `telegram.download(target)` still returns `Buffer`; use it or `Buffer.from(bytes)` when you need Buffer-only methods. portable wrappers do not claim a Node Buffer contract
- `message.startPayload` — the deep-link payload after `/start` (`t.me/<bot>?start=ref-42` → `'ref-42'`), grounded in the `bot_command` entity telegram parsed — plain text that merely looks like a command never matches, and a `/start@other_bot` addressed to a different bot yields `undefined`. `filters.start` gates handlers on /start too, but is regex-based and mention-agnostic by design

callback queries also carry the message-scoped edit family — `edit`, `editCaption`, `editMedia`, `editReplyMarkup`, `editRich`, `delete` — auto-filling `chat_id` + `message_id` from the originating message, or `inline_message_id` for inline-mode messages (those resolve `true` instead of the edited message; `delete` throws for them). the pager pattern in one call:

```ts
telegram.onCallbackQuery(async (query) => {
  await query.edit(`page ${page + 1}`, { reply_markup: pagerKeyboard(page + 1) })
  await query.answer()
})
```

---

<a name='filters'></a>
## filters

a **filter** is a named, composable, type-guarded predicate over an update. you compose them, pass them as the first arg of `telegram.on<Kind>(filter, handler)`, and the handler's argument gets narrowed to whatever the filter promises. they replace v2's `UpdatesFilter` / `hasText` / `command` mixins with a single, generic mechanism

most common cases have a one-line shortcut on `Telegram` itself:

```ts
// matches /start, /start@yourbot, /start payload, etc
telegram.command('start', message => message.send('welcome!'))
```

for anything more interesting, compose. `puregram` re-exports a `filters` namespace with the codegen'd presence/kind filters and a few handcrafted ones (`command`, `text`, `regex`, `chat`, `senderChat`, `from`, `callbackData`, `inlineQuery`, …):

```ts
import { filters, and } from 'puregram'

const { kind, hasText } = filters

// pass a filter as the first arg of telegram.onMessage to gate the handler
telegram.onMessage(hasText, message => message.send(`heard: ${message.text}`))

// or compose with `and`/`or`/`not` (and use telegram.onUpdate when the filter spans kinds)
telegram.onUpdate(and(kind.message, hasText), update => update.send('!'))
```

three composition forms are interoperable — pick whichever is prettier at the call site:

```ts
import { kind, hasText, and } from 'puregram'

telegram.onUpdate(and(kind.message, hasText), handler)        // factory form
telegram.onUpdate(kind.message.and(hasText), handler)         // chained method
telegram.onUpdate(update => kind.message(update) && hasText(update), handler) // raw boolean
```

writing your own:

```ts
import { defineFilter, and, kind } from 'puregram'

const isWeekend = defineFilter('isWeekend', _update => {
  const day = new Date().getDay()

  return day === 0 || day === 6
})

telegram.onMessage(isWeekend, message => message.send('chill, it is the weekend'))
```

declaring `kinds: ['message', 'edited_message']` on a custom filter gives the dispatcher a free fast-path — it skips evaluating the predicate when `update.kind` isn't in the set. the codegen'd `hasX` filters already do this

---

<a name='middlewares'></a>
## middlewares

a **middleware** is a function that runs on every incoming update before user handlers fire. it gets `(update, next)` — call `next()` to let the chain continue, *don't* call `next()` to swallow the update. classic pattern for cross-cutting concerns: timing, logging, auth, rate-limit short-circuits, anything that has to wrap *every* handler

```ts
telegram.use(async (update, next) => {
  const start = Date.now()

  await next()

  console.log(`${update.kind} took ${Date.now() - start}ms`)
})

telegram.onMessage(message => message.send('ok'))
```

the 2-arg form gates on a filter and gives you a properly-typed update inside (no cast):

```ts
import { filters } from 'puregram'

telegram.use(filters.kind.message, async (message, next) => {
  console.log(message.kind, message.text)
  await next()
})
```

to hang app state off an update — the `req.user` pattern — use `attach`. it defines a non-enumerable property, and its assertion signature narrows the update right in scope:

```ts
import { attach, filters } from 'puregram'

telegram.use(filters.kind.message, async (message, next) => {
  attach(message, 'user', await db.users.get(message.senderId))

  message.user // typed — no casts
  await next()
})
```

downstream handlers see the property at runtime; to get it typed there too, gate them on a filter whose second type argument declares the shape — `defineFilter<MessageUpdate, { user: DbUser }>('hasUser', u => 'user' in u)` — the same mechanism `filters.regex` uses to type `update.match`

middlewares are prioritised — `'high'` runs first, then `'normal'` (the default), then user `telegram.on<Kind>(...)` handlers, then `'low'`. plugins like `@puregram/flow`'s `waitFor` claim `'high'` to intercept updates before any user handler sees them

```ts
telegram.use(myMiddleware, { priority: 'high' })
```

---

<a name='hooks'></a>
## hooks

if middlewares wrap **incoming updates**, hooks wrap **outgoing api requests**. `puregram` runs every `telegram.api.X(...)` call through a five-stage pipeline, and each stage is a hook you can register middleware on. classic use case: always inject `parse_mode: 'HTML'`, log every api call, transparently retry rate-limited requests, swap a `MediaSource.path` for a cached `file_id`

```ts
import type { RequestContext } from 'puregram'

telegram.useHook('onBeforeRequest', (raw, next) => {
  const context = raw as RequestContext

  if (context.method === 'sendMessage' && context.params !== undefined) {
    context.params.parse_mode ??= 'HTML'
  }

  return next()
})

telegram.useHook('onError', (error, _context) => {
  console.error('api call failed:', error.message)
})
```

the five request-stage hooks, in order:

1. **`onBeforeRequest`** — request just caught, params not yet serialised. mutate `params`, abort early
2. **`onRequestIntercept`** — just before fetch fires. `url`, `init` are populated; this is where you'd swap the http client or rewrite the url
3. **`onApiCall`** — an *around* hook (`(ctx, next) => { … await next() … }`) wrapping the actual fetch. time it, trace it, retry it, or short-circuit. registered separately via `useHook('onApiCall', …)`; with none registered the call runs directly, so there's no cost otherwise
4. **`onResponseIntercept`** — response back, parsed as `json`. inspect or rewrite the response before puregram processes it
5. **`onAfterRequest`** — pipeline done. cleanup time

plus:
- **`onError`** — between intercept and after-request; catches request errors. return a new `Error` to replace it, or nothing to keep it as-is
- **`onUpdate`** — dispatch middleware (priority-aware). `telegram.use(...)` is just a shorthand for `useHook('onUpdate', fn, options)`
- **`onInit`** — after all plugin installs resolve, before dispatch starts
- **`onShutdown`** — graceful teardown, drains in-flight

plugins lean on hooks all the time — `@puregram/markup` uses `onBeforeRequest` to unwrap its tagged-template formatted text into `entities`, `@puregram/media-cacher` uses it to swap upload sources for cached `file_id`s, etc

---

<a name='extending-puregram-with-plugins'></a>
## extending puregram with plugins

a **plugin** is a self-contained piece of behavior that attaches itself to `telegram` under its own namespace. `@puregram/session`, `@puregram/scenes`, `@puregram/markup`, `@puregram/flow`, `@puregram/media-cacher`, `@puregram/rate-limit` — every official satellite is a plugin. the api is `telegram.extend(plugin)`, it's chainable, and every link narrows the type of `telegram` so you don't need `declare module 'puregram'` augmentations

at the simplest level:

```ts
import { Telegram } from 'puregram'
import { session } from '@puregram/session'

const telegram = Telegram.fromToken(process.env.TOKEN!)
  .extend(session())

// session() is now installed; telegram.session is typed and ready
telegram.onMessage(async (message) => {
  message.session.counter = (message.session.counter ?? 0) + 1

  await message.send(`you sent ${message.session.counter} messages`)
})
```

plugins compose freely:

```ts
import { session } from '@puregram/session'
import { scenes } from '@puregram/scenes'
import { flow } from '@puregram/flow'

const telegram = Telegram.fromToken(TOKEN)
  .extend(session())
  .extend(scenes())
  .extend(flow())

// telegram.session, telegram.scenes, telegram.flow — all typed
```

writing your own takes ~5 lines. `createPlugin` returns a typed plugin spec; the install function's return value gets keyed under `plugin.name` and merged onto `telegram`

plugin targets default to portable `TelegramCore`. use `createPlugin` and portable helpers from `puregram/runtime` when a plugin does not need the Node transport. a Node-specific plugin should annotate `install: (telegram: Telegram) => ...` explicitly; it will not typecheck against a serverless client

```ts
import { Telegram } from 'puregram'
import { createPlugin } from 'puregram/runtime'

const greeter = createPlugin({
  name: 'greeter',
  install: telegram => ({
    hello: (chatId: number) => telegram.send(chatId, 'hi!')
  })
})

const telegram = Telegram.fromToken(process.env.TOKEN!).extend(greeter)

await telegram.greeter.hello(100) // typed!
```

a few things to know once you've written a couple:

- **dependencies.** `dependsOn: ['session']` declares a hard dependency. the installer resolves install order topologically, throws `PluginCycle` on a cycle, throws `PluginMissingDep` if the dep isn't installed. for soft deps (adapt-if-present), use the `telegram.has('session')` runtime check — it doesn't widen the type
- **namespace collisions.** two plugins with the same `name` throw `PluginConflict` at start time. plugins can't pollute the root `telegram` namespace; everything they expose lives under `telegram.<plugin name>.X`
- **install timing.** `.extend(plugin)` queues the plugin synchronously. installs are awaited on `telegram.start()` (or implicitly on the first `startPolling()`/`getWebhookCallback()`), in dependency-resolved order. async installs are fine
- **lifecycle hooks.** `useHook('onInit', …)` runs once installs settle; `useHook('onShutdown', …)` runs on `telegram.shutdown()`. that's the canonical place to spin background tasks up or tear them down

---

<a name='custom-updates'></a>
## custom updates

sometimes your bot's logic produces events that don't come from telegram — a webhook from a payment provider, a cron tick, an internal job-completion signal. instead of inventing a parallel event bus, you can teach `telegram` about a custom update kind and emit through the same dispatch pipeline that bot-api updates use:

```ts
type JobDone = { jobId: string, result: unknown }

const telegram = Telegram.fromToken(TOKEN)

telegram.defineUpdate<'job_done', JobDone>('job_done')

setInterval(() => {
  telegram.emit('job_done', { jobId: 'abc', result: { ok: true } })
}, 1000)

telegram.onUpdate((update) => {
  if (update.kind === 'job_done') {
    update.jobId   // string — typed!
    update.result  // unknown
  }
})
```

`telegram.on<custom kind>(...)` is typechecked just like the bot-api ones — `telegram.onUpdate('not_a_real_kind', …)` is a compile error. custom updates flow through the exact same `onUpdate` middleware chain as everything else

---

<a name='polling'></a>
## polling

`telegram.startPolling(options?)` is the simplest transport — long-poll `getUpdates`, dispatch each batch, repeat. great for development and small bots; switch to a webhook for anything production-grade

```ts
await telegram.startPolling({
  allowedUpdates: ['message', 'callback_query', 'chat_member'],
  dropPendingUpdates: true
})
```

### `StartPollingOptions`

| field | type | default | description |
|---|---|---|---|
| `offset` | `number` | none | starting `update_id` offset for the next `getUpdates`. rarely needed — useful for resume-from-checkpoint flows |
| `timeout` | `number` (sec) | telegram default | long-poll timeout |
| `allowedUpdates` | `string[] \| 'auto'` | `telegram.options.allowedUpdates` | restrict the kinds telegram delivers. `[]` = "everything except opt-in kinds"; `'auto'` derives the set from your handlers |
| `dropPendingUpdates` | `boolean \| string[]` | `false` | drain the queued backlog before subscribing. `true` drops everything; pass an array to drop only the listed kinds (`['message', 'callback_query']`) |

`allowedUpdates` can also be set at construction time — convenient default for every `startPolling` / webhook in the same bot:

```ts
const telegram = new Telegram({
  token: process.env.TOKEN!,
  allowedUpdates: ['message', 'callback_query']
})
```

per-call `allowedUpdates` overrides the constructor default

set `allowedUpdates: 'auto'` (constructor or per-call) to have puregram derive the minimal set from your registered handlers — `onMessage` + `onCallbackQuery` becomes `['message', 'callback_query']`, opt-in kinds included only when you actually handle them. handlers gated by opaque predicates (a raw `onUpdate(fn)`) can't be analysed, so `'auto'` safely falls back to telegram's default subscription

### `UpdatesFilter` — opt into every update kind

telegram's default `allowed_updates` excludes opt-in kinds like `chat_member`, `business_message`, `chat_join_request`. to receive them, you have to list every desired kind explicitly. `UpdatesFilter` is a tiny helper that returns the full list (or every kind except the ones you don't want):

```ts
import { Telegram, UpdatesFilter } from 'puregram'

// subscribe to every update kind, including chat_member and friends
const telegram = new Telegram({
  token: process.env.TOKEN!,
  allowedUpdates: UpdatesFilter.all()
})

// every kind except a few — handy when you want admin events but not business updates
await telegram.startPolling({
  allowedUpdates: UpdatesFilter.except(['business_connection', 'business_message', 'edited_business_message'])
})

// pass a single kind without wrapping it in an array
UpdatesFilter.except('chat_member')
```

| method | returns |
|---|---|
| `UpdatesFilter.all()` | `UpdateKind[]` — every top-level Bot API update field, excluding service-event dispatch kinds |
| `UpdatesFilter.except(kind)` | `UpdateKind[]` — every top-level update field except the named one |
| `UpdatesFilter.except([kind1, kind2])` | `UpdateKind[]` — every top-level update field except the listed ones |

want the raw constant? `import { UPDATE_KINDS } from 'puregram'` — readonly tuple of every update kind in dispatch order

### stopping

```ts
telegram.stopPolling()      // halts the loop; in-flight handlers keep running
await telegram.shutdown()   // also fires onShutdown plugin hooks + drains in-flight
```

---

<a name='webhook'></a>
## webhook

polling is fine for development and small bots. for anything serious you want webhooks. there are three ways to wire them up depending on what you've already got running

### the easiest path — `telegram.startWebhook(...)`

one call: registers the webhook with telegram **and** spins up a built-in node `http` listener. perfect for "bot in a single process" deployments

```ts
import { Telegram } from 'puregram'

const telegram = Telegram.fromToken(process.env.TOKEN!)

telegram.onMessage(message => message.send('got it via webhook'))

const { stop } = await telegram.startWebhook({
  url: 'https://example.com/webhook',  // your public https url
  port: 8080,                          // local port to listen on
  secretToken: 'my-secret',            // shared secret — telegram echoes it on every delivery
  dropPendingUpdates: true             // drop the queued backlog before subscribing
})

// graceful shutdown
process.on('SIGTERM', async () => {
  await stop()
  await telegram.shutdown()
})
```

### bring your own http framework

if you already have an express / fastify / koa / hono / h3 / elysia app, mount the webhook on a route in your existing server. one adapter per framework — all live at `puregram/webhook`:

```ts
import express from 'express'
import { Telegram } from 'puregram'
import { expressAdapter } from 'puregram/webhook'

const telegram = Telegram.fromToken(process.env.TOKEN!)
const app = express()

app.use(express.json())
app.post('/webhook', expressAdapter(telegram.webhookHandler({ secretToken: 'my-secret' })))

app.listen(8080)

await telegram.setWebhook({ url: 'https://example.com/webhook', secretToken: 'my-secret' })
```

every adapter is a one-liner. import the matching one and pass it `telegram.webhookHandler(options?)`:

| framework | import | usage |
|---|---|---|
| express | `expressAdapter` | `app.post('/webhook', expressAdapter(telegram.webhookHandler()))` |
| fastify | `fastifyAdapter` | `fastify.post('/webhook', fastifyAdapter(telegram.webhookHandler()))` |
| koa | `koaAdapter` | `router.post('/webhook', koaAdapter(telegram.webhookHandler()))` |
| hono | `honoAdapter` | `app.post('/webhook', honoAdapter(telegram.webhookHandler()))` |
| h3 | `h3Adapter` | `app.use('/webhook', h3Adapter(telegram.webhookHandler()))` |
| elysia | `elysiaAdapter` | `app.post('/webhook', elysiaAdapter(telegram.webhookHandler()))` |
| web fetch (workers/deno/bun/edge) | `webAdapter` | `(req) => webAdapter(telegram.webhookHandler(), req)` |
| raw `node:http` | `nodeAdapter` (or use `getWebhookCallback`) | `createServer(nodeAdapter(telegram.webhookHandler()))` |

express/koa adapters expect `req.body` to already be parsed json — register `express.json()` / `koa-bodyparser` before the route. fastify, hono, h3, elysia, and web all auto-parse

### bare `node:http`

if you're not using a framework at all, `getWebhookCallback` is `nodeAdapter(webhookHandler())` rolled into one and ready to drop into `createServer`:

```ts
import { createServer } from 'node:http'
import { Telegram } from 'puregram'

const telegram = Telegram.fromToken(process.env.TOKEN!)

telegram.onMessage(message => message.send('got it via webhook'))

const callback = telegram.getWebhookCallback({ secretToken: 'my-secret' })

createServer(callback).listen(8080)

await telegram.setWebhook({
  url: 'https://example.com/webhook',
  secretToken: 'my-secret'
})
```

### `telegram.setWebhook(...)` / `telegram.deleteWebhook(...)`

typed wrappers around the bot api methods. easier to read than `tg.api.setWebhook({ secret_token: '...' })` and use camelCase consistently:

```ts
await telegram.setWebhook({
  url: 'https://example.com/webhook',
  secretToken: 'my-secret',
  allowedUpdates: ['message', 'callback_query'],
  maxConnections: 100,
  dropPendingUpdates: true
})

await telegram.deleteWebhook({ dropPendingUpdates: true })
```

### options — `WebhookOptions`

passed to `getWebhookCallback`, `webhookHandler`, and `startWebhook`:

| option | type | default | description |
|---|---|---|---|
| `secretToken` | `string` | none | shared secret echoed in `x-telegram-bot-api-secret-token`. mismatched/missing requests get 401 |
| `webhookReply` | `boolean` | `true` | webhook-reply optimization. methods returning `true` (chat actions, reactions, deletions, …) ride the 200 body, saving a round-trip. data-returning methods (sendMessage, getChat, …) still round-trip. invisible to userland — disable only if a proxy/firewall strips non-empty 200 bodies |
| `timeoutMilliseconds` | `number` | `25_000` | max wait between request arrival and the 200 response. dispatch keeps running after — awaited by `tg.shutdown()`. only active with `webhookReply` |
| `maxBodyBytes` | `number` | `1_048_576` (1 MB) | `nodeAdapter` body-size cap; oversized requests get 413. other adapters honour their framework's own limits |

`startWebhook` takes the union of `WebhookOptions` and `SetWebhookOptions` (`url`, `certificate`, `ipAddress`, `maxConnections`, `allowedUpdates`, `dropPendingUpdates`, `secretToken`) plus three listener-specific knobs:

| option | type | default | description |
|---|---|---|---|
| `port` | `number` | none | local port for the built-in `http` listener. omit for "set the webhook + return the callback, but don't start a server" |
| `host` | `string` | `'0.0.0.0'` | host to bind the listener to |
| `path` | `string` | `'/'` | path the listener responds to. all other paths return 404 |

---

<a name='local-bot-api-server'></a>
## local bot api server

the [official local bot api server](https://github.com/tdlib/telegram-bot-api) speaks the same bot api as `api.telegram.org`, so puregram treats it as a drop-in. point `apiBaseUrl` at it and set `useLocal`:

```ts
const telegram = new Telegram({
  token: process.env.TOKEN!,
  apiBaseUrl: 'http://localhost:8081/bot',
  useLocal: true
})
```

you get **2 GB** uploads/downloads (vs 50 MB / 20 MB), absolute on-disk `file_path`s, http webhooks on any port, and no global rate limit. before moving a live bot over, call `logOut` against the cloud server once so updates route to your instance

`useLocal: true` makes `tg.download(...)` read files straight off disk (the server returns a local path, not a url). for uploads, `MediaSource.local(path)` hands the server a `file://` path to read itself, skipping the multipart upload entirely:

```ts
update.sendVideo(MediaSource.local('/srv/media/clip.mp4'))
```

`useLocal` and `MediaSource.local()` are orthogonal — `useLocal` is about the api endpoint, `local()` is about a file the server can read off a shared disk. they stay separate because the bot and the server don't always share a filesystem (separate containers, different hosts); there a plain `MediaSource.path(...)` still uploads the bytes, and `local()` throws without `useLocal`

---

<a name='resilience'></a>
## resilience

a handful of opt-in knobs for surviving real-world traffic — retries, error handling, concurrency, and update hygiene

<a name='retry-on-flood-wait'></a>
### `retryOnFloodWait` — auto-retry on 429

when telegram answers with `429 Too Many Requests` it also tells you how long to wait (`parameters.retry_after`, seconds). `retryOnFloodWait` makes the api proxy honor that automatically — the same call sleeps the suggested time and retries. defaults to `false` to keep the v2 throw-and-let-the-caller-handle behavior

```ts
// one retry, no wait cap
const telegram = new Telegram({
  token: process.env.TOKEN!,
  retryOnFloodWait: true
})

// bounded: up to 3 retries, but bail if telegram asks for more than 10s
const telegram = new Telegram({
  token: process.env.TOKEN!,
  retryOnFloodWait: { max: 3, maxWaitMs: 10_000 }
})

// also retry 5xx + network errors with exponential backoff (3s, 6s, 12s, … capped at 1h)
const telegram = new Telegram({
  token: process.env.TOKEN!,
  retryOnFloodWait: { max: 3, on: ['flood', 'server', 'network'], backoff: { base: 3000 } }
})
```

| field | type | default | description |
|---|---|---|---|
| `max` | `number` | `1` | max retries per call before propagating the `ApiError` |
| `maxWaitMs` | `number` | `Infinity` | if `retry_after × 1000` exceeds this, give up immediately |
| `on` | `RetryReason[]` | `['flood']` | which failures to retry — `'flood'` (429 + `retry_after`), `'server'` (api 5xx), `'network'` (transport/fetch errors) |
| `backoff` | `{ base?, max? }` | `{ base: 3000, max: 3_600_000 }` | exponential backoff for `server`/`network` retries — `base × 2 ** attempt`, capped at `max` (ms) |

with the default `on: ['flood']`, only `429` with a numeric `retry_after` retries — every other error short-circuits as before. add `'server'` / `'network'` to opt into 5xx and transport-failure retries (exponential `backoff`). `suppress: true` calls keep their semantics (raw error object, no retry)

<a name='tg-catch'></a>
### `tg.catch` + `swallowDispatchErrors`

`tg.catch(fn)` registers an error handler for anything thrown inside a dispatched update handler — it's a thin alias over `useHook('onDispatchError', fn)`. without a catch handler, puregram is loud by default: errors get rethrown on a microtask so node's `uncaughtException` fires. set `swallowDispatchErrors: true` and that fallback goes away — registered `tg.catch` handlers are the only escape hatch

because a routine api rejection (a user blocking the bot mid-send, an expired callback query) shouldn't take the whole process down unnoticed, starting the bot with neither a `tg.catch` handler nor `swallowDispatchErrors` emits a `PUREGRAM_NO_DISPATCH_ERROR_HANDLER` process warning — register a handler to silence it

```ts
const telegram = new Telegram({
  token: process.env.TOKEN!,
  swallowDispatchErrors: true
})

telegram.catch((err, ctx) => {
  console.error('handler threw on update', ctx.raw.update_id, err)
})

telegram.onMessage(async (m) => {
  // throws hit `telegram.catch` above, no uncaughtException
  await doRiskyThing(m)
})
```

inspired by [grammY's `bot.catch`](https://grammy.dev/guide/errors). multiple catch handlers can be registered — they all run, in registration order

<a name='polling-concurrency'></a>
### polling concurrency + per-key sequentialization

`startPolling` defaults to dispatching every update in parallel (no cap). two extra knobs let you ratchet that down for real-world traffic:

| option | type | default | description |
|---|---|---|---|
| `concurrency` | `number` | `Infinity` | maximum number of concurrent dispatches across the bot |
| `sequentializeBy` | `(raw) => string \| undefined` | `undefined` | return a key — updates sharing that key dispatch in FIFO order; different keys still run in parallel (subject to `concurrency`) |

```ts
await telegram.startPolling({
  // never run more than 8 handlers at once
  concurrency: 8,

  // updates from the same chat run serially — handy when a handler mutates per-chat state
  sequentializeBy: (raw) =>
    String(raw.message?.chat.id ?? raw.callback_query?.message?.chat.id ?? '')
})
```

`sequentializeBy` returning `undefined` or `''` opts an update out of per-key queuing entirely. inspired by [grammY's runner](https://grammy.dev/plugins/runner)

<a name='auto-answer-dedupe'></a>
### auto-answering + de-duplicating updates

two constructor knobs for everyday operator hygiene, both off by default:

- **`autoAnswerCallbackQuery`** — if a `callback_query` handler finishes without calling `update.answer(...)`, puregram answers it for you so the client's loading spinner never hangs. pass `true` for an empty answer, or an object (`{ text, show_alert, … }`) for a default answer
- **`dedupeUpdates`** — drop updates whose `update_id` was seen recently (webhook retries, overlapping `getUpdates`). `true` keeps a window of the last 1000 ids; pass `{ max }` to size it

```ts
const telegram = new Telegram({
  token: process.env.TOKEN!,
  autoAnswerCallbackQuery: true,        // or { text: 'done' }
  dedupeUpdates: true                   // or { max: 5000 }
})
```

---

<a name='debug-logs'></a>
## debug logs

`puregram` has its own namespaced logger — no `debug` package dependency, just an env var. enable it by setting `PUREGRAM_DEBUG`:

```sh
# everything
$ PUREGRAM_DEBUG='puregram:*' node index.js

# just the api proxy + dispatch
$ PUREGRAM_DEBUG='puregram:api,puregram:dispatch' node index.js
```

the env var is comma-separated; each entry is either an exact namespace (`puregram:api`) or a wildcard prefix (`puregram:*`). namespaces include `puregram:api`, `puregram:dispatch`, `puregram:hooks`, `puregram:plugin`, `puregram:transport:polling`, `puregram:transport:webhook`, etc

logs go to `stderr` — pipe to `2>` if you want to keep them out of stdout

---

<a name='typescript-usage'></a>
## typescript usage

`puregram` is written in typescript and ships its own `.d.ts` files — there's nothing to install on top, no `@types/puregram`

a few ts-specific things to know:

### `Telegram<Ext>` is generic over its plugins

every `.extend(plugin)` call narrows the type:

```ts
import { Telegram } from 'puregram'
import { session } from '@puregram/session'

const telegram = Telegram.fromToken(TOKEN)
//    ^? Telegram<{}>

const withSession = telegram.extend(session())
//    ^? Telegram<{ session: SessionExtension }>
```

handlers see the right type automatically — `message.session` is typed inside `withSession.onMessage(...)` without you doing anything

### `update.is(kind)` is a type predicate

```ts
telegram.onUpdate((update) => {
  if (update.is('message')) {
    // update is narrowed to MessageUpdate
    update.send('hi')
  }
})
```

same for the codegen'd `hasX` predicates: `if (message.hasText()) { message.text /* string */ }`

### importing bot-api types

raw bot-api types (`TelegramMessage`, `TelegramUser`, `TelegramChat`, …) come from `@puregram/api`. `puregram` re-exports them too, so for most consumers `import type { TelegramMessage } from 'puregram'` is enough

```ts
import type { TelegramMessage } from 'puregram'

function describe(raw: TelegramMessage) {
  return `${raw.chat.id}: ${raw.text ?? '<no text>'}`
}
```

---

<a name='faq'></a>
## faq

### how do i enable debugging?

see the [debug logs](#debug-logs) section. tldr: `PUREGRAM_DEBUG='puregram:*' node index.js`

### how do i migrate from v2?

honestly? by hand. the api shape changed a lot — `Context` is gone, mixins are gone, `telegram.updates.on` became `telegram.onMessage` / `telegram.onCallbackQuery` / etc, plugins are first-class via `.extend()`, sessions/scenes/hear/prompt all live in their own packages with their own redesigned apis. there is no codemod and there will not be one. write the migration by hand, lean on the [examples][examples] and per-package READMEs, file an issue if something is genuinely unclear

the deltas that bite v2 muscle memory the most:

- **dispatch errors crash by default.** v2's composer logged escaped handler errors and kept running; v3 rethrows into `uncaughtException` unless you register `tg.catch(...)` (or set `swallowDispatchErrors: true`). the [startup warning](#tg-catch) points at this, but wire a handler before you ship
- **factory params are camelCase and two spots rename beyond that.** every factory takes required fields positionally and an extras bag mirroring the bot-api field in camelCase (`reply_markup` → `replyMarkup`, `parse_mode` → `parseMode`). `InlineQueryResult.*` additionally flattens `input_message_content` → `content` and the `thumbnail_*` field group → `thumbnail: { url, width?, height?, mimeType? }`
- **`startPayload` is a string.** v2 coerced numeric / json-looking payloads into `any`; v3's `message.startPayload` is `string | undefined`, parsed from the `bot_command` entity — parse it yourself if you need more

### what happens to v2?

v2 is frozen. once v3 is ready, the `lord` branch (currently v2) gets overwritten with v3, and packages that were dropped in v3 (`@puregram/hear`, `@puregram/prompt`) will have their source code removed from the tree. the npm tarballs for v2 stay published forever — your existing `puregram@2.x` install isn't going anywhere — but the repo will be a v3 repo

### can i `require('puregram')` from commonjs?

on node ≥ 22.12 — yes. `puregram` ships esm only, but modern node can `require()` an esm graph directly, so cjs scripts, `tsx -e` one-liners, and the repl all work. on node 22.0–22.11 the same call throws `ERR_REQUIRE_ESM` — that error means "this package is esm-only on your node version": upgrade node, or switch to `import` / `await import('puregram')`

### are there any telegram chats or channels?

yep. [`t.me/pureforum`](https://t.me/pureforum) is the chat. open issues here, but for off-the-cuff "is this the right way to..." questions, the chat is faster

### why is your readme lowercased?

because i felt like it — see the issues:

- https://github.com/puregram/puregram/issues/63
- https://github.com/puregram/puregram/issues/62

---

<a name='ecosystem'></a>
## ecosystem

### official packages

- [`@puregram/api`][@api]: autogenerated bot api types, structures, updates, factories
- [`@puregram/storage`][@storage]: shared `KVStorage` / `TtlStorage` interfaces + in-process implementations
- [`@puregram/session`][@session]: transparent persistent session plugin
- [`@puregram/scenes`][@scenes]: multi-step scene/wizard plugin
- [`@puregram/flow`][@flow]: conversational primitives — `waitFor`, `prompt`, `collectMediaGroup`, persistent flows
- [`@puregram/callback-data`][@callback-data]: typed callback-data builder with binary-packed payloads + dispatch-ready filter
- [`@puregram/markup`][@markup]: tagged-template entity-aware text formatting
- [`@puregram/rich`][@rich]: safe emitter for rich-message html/markdown — templates + block builders, no raw string juggling
- [`@puregram/media-cacher`][@media-cacher]: transparent `file_id` caching, skips re-uploading repeated media
- [`@puregram/rate-limit`][@rate-limit]: per-user fixed-window rate limiting
- [`@puregram/file-id`][@file-id]: parse, inspect and serialize telegram `file_id` and `file_unique_id` strings
- [`@puregram/inline-message-id`][@inline-message-id]: parse and serialize telegram `inline_message_id` strings (TL-encoded dc + chat/owner id + message id + access hash)
- [`@puregram/utils`][@utils]: small standalone utilities — slot-machine value decoder + telegram web app initData validation + deep-link helpers
- [`@puregram/stream`][@stream]: stream LLM output to telegram via `sendMessageDraft` + a terminal `sendMessage` — turn any `AsyncIterable<string>` into animated draft previews
- [`@puregram/throttler`][@throttler]: outbound rate-limit middleware — keeps your bot inside telegram's ~30 rps / per-chat / per-group bot api limits (sliding-window queue)
- [`@puregram/test`][@test]: actor-driven test framework for puregram bots

### dropped

- `@puregram/hear`: gone — userland in v3 (just `if (message.text === '/foo') ...` or compose a `command` / `regex` filter)
- `@puregram/prompt`: gone — folded into [`@puregram/flow`][@flow] as `flow.prompt(...)`

[@api]: ../api
[@storage]: ../storage
[@session]: ../session
[@scenes]: ../scenes
[@flow]: ../flow
[@callback-data]: ../callback-data
[@markup]: ../markup
[@rich]: ../rich
[@media-cacher]: ../media-cacher
[@rate-limit]: ../rate-limit
[@file-id]: ../file-id
[@inline-message-id]: ../inline-message-id
[@utils]: ../utils
[@stream]: ../stream
[@throttler]: ../throttler
[@test]: ../test

---

## thanks to

- [negezor][negezor] ([negezor/vk-io][negezor/vk-io]) — for inspiration, package idea (!) and some code and implementation ideas
- everyone who's filed issues, sent PRs, hung out in the chat, asked dumb questions, and otherwise kept this project alive long enough to reach v3 ❤️

[negezor]: https://github.com/negezor
[negezor/vk-io]: https://github.com/negezor/vk-io

