---
title: shortcuts
description: what a shortcut is, the anchor concept, and how curated per-kind helpers differ from raw tg.api.X
---

# shortcuts

a **shortcut** is a curated or codegen'd helper method that wraps a raw `tg.api.X` call and fills in one or more arguments automatically. shortcuts exist at two levels: on the `Telegram` client (`tg.send`, `tg.sendPhoto`, ...) and on each update class (`message.send`, `callbackQuery.answer`, ...)

```ts
// raw — you supply everything
await tg.api.sendMessage({ chat_id: 100, text: 'hi' })

// shortcut — chat is positional, chat_id is gone
await tg.send(100, 'hi')

// per-kind shortcut — chat_id comes from the update itself
tg.onMessage(message => message.send('hi'))
```

## migrating to puregram 3.10.0 / api 10.3.3

**this is a breaking shortcut release within v3.** primary arguments move out of the options object into positional arguments. the raw `tg.api.*` methods keep their existing all-object signatures.

| shortcut | before | after |
|---|---|---|
| inline-query answer | `query.answer({ results, cache_time: 0 })` | `query.answer(results, { cache_time: 0 })` |
| shipping / pre-checkout answer | `query.answer({ ok: false, error_message: reason })` | `query.answer(false, { error_message: reason })` |
| text draft | `message.sendDraft(text, { draft_id: id })` | `message.sendDraft(id, text)` |
| rich draft | `message.sendRichDraft({ draft_id: id, rich_message: content })` | `message.sendRichDraft(id, content)` |
| chat title | `message.setChatTitle({ title })` | `message.setChatTitle(title)` |
| member promotion | `message.promoteChatMember({ user_id: user, can_pin_messages: true })` | `message.promoteChatMember(user, { can_pin_messages: true })` |
| custom admin title | `message.setChatAdministratorCustomTitle({ user_id: user, custom_title: title })` | `message.setChatAdministratorCustomTitle(user, title)` |
| forum topic creation | `message.createForumTopic({ name })` | `message.createForumTopic(name)` |
| invite-link revocation | `message.revokeChatInviteLink({ invite_link: link })` | `message.revokeChatInviteLink(link)` |

the same convention applies to chat photos, sticker sets, permissions, member restrictions/tags/lookups, sender-chat bans, join-request actions, subscription invite links, forum-topic management, game scores, gifts, checklist edits, and message-targeted poll/reaction/suggested-post/business-read helpers. required primary values become positional; optional settings remain in the trailing object.

anchors still take precedence when determining the signature: if the update already supplies an argument, do not pass it positionally. for example, `message.stopPoll()` still targets that message, while `chatMember.stopPoll(messageId)` needs an explicit message id. thread-scoped helpers likewise omit ids supplied by the current thread. callback-query `answer({ text: 'done' })` and optional clearing calls such as `message.editCaption()` retain their existing forms.

**older core installations are also affected when their API dependency updates.** published core versions such as `puregram@3.9.1` accept `@puregram/api ~10.3.1`, which includes `10.3.3`. to postpone migration on those older core versions, keep the existing lockfile or override the API dependency to `10.3.2`. core `3.10.0` pins API `10.3.3` exactly in its published package; do not override that dependency back to `10.3.2`.

## the anchor concept

an **anchor** is a schema argument that a specific update kind can fill from its own payload. the most common anchor is `chat_id` — every message-bearing update has `update.raw.chat.id`, so every message shortcut can fill `chat_id` for you automatically

```ts
// without anchor: you carry the chat id around
tg.onMessage((message) => {
  const chatId = message.raw.chat.id
  return tg.api.sendMessage({ chat_id: chatId, text: 'response' })
})

// with anchor: message.send fills chat_id from message.raw.chat.id
tg.onMessage(message => message.send('response'))
```

some updates anchor more than one field. `callbackQuery.answer(...)` fills `callback_query_id` from `callbackQuery.raw.id`. `inlineQuery.answer(...)` fills `inline_query_id`. the generated update classes handle this per-kind

## shortcuts on `Telegram`

these live on the `Telegram` class and are available anywhere you have a `tg` reference. they take a positional `chat` argument (filling `chat_id`) and drop optional args you don't need:

```ts
// send a text message
await tg.send(chatId, 'hello')
await tg.send(chatId, 'hello', { parse_mode: 'HTML', disable_notification: true })

// send media
await tg.sendPhoto(chatId, MediaSource.path('./cat.png'))
await tg.sendDocument(chatId, MediaSource.url('https://example.com/file.pdf'), { caption: 'here' })
await tg.sendVideo(chatId, MediaSource.fileId('BQACAgI...'))

// forward, copy, delete
await tg.forward(fromChatId, toChatId, messageId)
await tg.copy(fromChatId, toChatId, messageId)
await tg.delete(chatId, messageId)
```

## per-kind shortcuts on update classes

these live on the generated update classes and are only available inside an update handler. they auto-fill the anchor from the update's payload:

```ts
tg.onMessage(async (message) => {
  // send to the same chat — chat_id auto-filled
  await message.send('got your message')

  // send with markup
  await message.sendPhoto(MediaSource.path('./photo.png'), { caption: 'here' })

  // delete this message
  await message.delete()

  // pin this message in the chat
  await message.pin()
})

tg.onCallbackQuery(async (callbackQuery) => {
  // answer the callback query — callback_query_id auto-filled
  await callbackQuery.answer({ text: 'done!' })

  // edit the message the button was on
  await callbackQuery.editText('updated text')
})

tg.onInlineQuery(async (inlineQuery) => {
  // answer — inline_query_id auto-filled
  await inlineQuery.answer([])
})
```

## reply variants

on message-bearing kinds every `send`-family shortcut has a **reply twin** that fills one extra anchor — `reply_parameters.message_id` from the current message. `reply` mirrors `send` (text), and each `sendX` gets a `replyWithX`:

```ts
tg.onMessage(async (message) => {
  // a text reply to this message
  await message.reply('quoting you')

  // media replies — same args as sendPhoto / sendDocument, but as a reply
  await message.replyWithPhoto(MediaSource.path('./cat.png'), { caption: 'as a reply' })
  await message.replyWithDocument(MediaSource.url('https://example.com/file.pdf'))
})
```

the whole family is covered — `replyWithVideo`, `replyWithAudio`, `replyWithVoice`, `replyWithAnimation`, `replyWithVideoNote`, `replyWithSticker`, `replyWithMediaGroup`, `replyWithLocation`, `replyWithVenue`, `replyWithContact`, `replyWithPoll`, `replyWithDice`, ... — anything whose `tg.api.sendX` accepts `reply_parameters`

you can still pass `reply_parameters` yourself to quote, allow sending without a reply, or reply across chats — your fields merge over the injected `message_id` (and override it if you set your own):

```ts
import { ReplyParameters } from 'puregram'

tg.onMessage(message =>
  message.reply('with a quote', {
    reply_parameters: ReplyParameters.quote(message.messageId, 'why?')
  })
)
```

## `update.thread` — staying in a forum topic

forum-topic (and discussion-thread) messages carry a `message_thread_id`. to keep your replies in the same topic you'd otherwise repeat it on every call. `update.thread` is an opt-in namespace that mirrors every thread-capable shortcut and auto-fills `message_thread_id` for you — alongside the usual `chat_id`, and `reply_parameters.message_id` on the reply twins:

```ts
tg.onMessage(async (message) => {
  // both stay inside the topic this message came from
  await message.thread?.send('still in this topic')
  await message.thread?.sendPhoto(MediaSource.path('./photo.png'))

  // reply twins work here too
  await message.thread?.reply('threaded reply')

  // a typing indicator scoped to the topic
  await message.thread?.sendChatAction('typing')
})
```

`thread` is `undefined` when the message isn't in a thread — a normal group message, a channel post, the forum's *General* topic — so reach for it with `?.`. or narrow with `hasMessageThreadId()` to drop the `?.`:

```ts
tg.onMessage(async (message) => {
  if (message.hasMessageThreadId()) {
    await message.thread.send('no ?. needed past the guard')
  }
})
```

the namespace covers everything that accepts a `message_thread_id` — the `send` / `reply` families, `copy` / `forward`, and even forum-topic management like `editForumTopic` / `closeForumTopic` — all with the ids pre-filled

plain `update.send(...)` never threads on its own; it's deliberately hands-off. and because `thread` pins you to the *current* topic it doesn't take a `message_thread_id` of its own — to target a **different** thread, use the top-level shortcut where `message_thread_id` is just a param:

```ts
tg.onMessage(message =>
  message.send('over in another topic', { message_thread_id: 1234 })
)
```

## business connections

messages from a business account (the `business_message` / `edited_business_message` updates) carry a `business_connection_id`. it's anchored just like `chat_id` — every update shortcut that accepts it (`send`, `reply`, `edit*`, `pin`, `sendChatAction`, `createActionController` / `withChatAction`, the `thread` namespace, …) fills it for you, so your reply goes back out on the same connection:

```ts
tg.onBusinessMessage(message => message.reply('handled on the business connection'))
```

it's filled only when the message actually has one, and it's dropped from the shortcut's params — so to act as the bot itself rather than the business account, drop to `tg.api`:

```ts
tg.onBusinessMessage(message =>
  tg.api.sendMessage({ chat_id: message.chat.id, text: 'from the bot, not the business' })
)
```

## ephemeral messages

an ephemeral message is visible to one user. an incoming ephemeral command carries an `ephemeral_message_id`; send shortcuts on that update auto-fill `ephemeral_message_parameters.receiver_user_id` (the non-bot party) plus the `reply_parameters.ephemeral_message_id` that authorizes the reply:

```ts
tg.onMessage(message => message.send('only the sender sees this'))
```

pass `ephemeral: false` to answer with a regular message instead — the flag is consumed by the shortcut and never reaches telegram. `edit` / `editCaption` / `editMedia` / `editReplyMarkup` / `delete` on an ephemeral message route to the `editEphemeralMessage*` / `deleteEphemeralMessage` twins, which address it by `receiver_user_id` rather than `message_id`

bot api 10.4 also supports ephemeral replies identified **only by a callback query**. omit `receiver_user_id`; `chat_id` is then unnecessary and ignored if supplied. this works for private, group, channel, inline and non-member chats, except channel direct messages. the callback must still be answered separately:

```ts
tg.onCallbackQuery(async (query) => {
  await tg.ephemeral({ callbackQueryId: query.id })
    .sendMessage({ text: 'just for you' })
  await query.answer()
})
```

the existing positional shortcut is unchanged: `query.send(chatId, text, params)` is public by default. passing `ephemeral_message_parameters: {}` opts in and auto-fills the query id without inventing a receiver. when you explicitly supply `receiver_user_id`, telegram requires it to be the user who pressed the button.

the chatless shortcut is `query.send(text, { ephemeral: true })`, or the equivalent `query.send(text, { ephemeral_message_parameters: {} })`. media shortcuts use the same opt-in shape, e.g. `query.sendPhoto(photo, { ephemeral: true })`. omitting the opt-in options is a type error, not an implicit public send.

outside a handler, `tg.ephemeral(userId)` still binds a receiver for administrator-initiated group messages and incoming ephemeral replies — see [the three-layer api](/guide/concepts/three-layer-api#sending-an-ephemeral-message).

`replaceCallbackQueryMessage: true` shows the ephemeral **in place of** the message the button belonged to, for that user:

```ts
tg.onCallbackQuery(async (query) => {
  await tg.ephemeral({ callbackQueryId: query.id, replaceCallbackQueryMessage: true })
    .sendMessage({ text: 'this takes the place of the original' })
  await query.answer()
})
```

the old bot api 10.3 measurements that rejected receiver-targeted ephemeral sends in private chats do not describe this new callback-only path.

::: warning the flag must be off for buttons on an ephemeral message
the spec says `replace_callback_query_message` must be `False` for callback queries that came
**from** an ephemeral message, and telegram does enforce it — but it reports the violation as
`Bad Request: query is too old and response timeout expired or query ID is invalid`, which reads
like an expired query and is not one. measured against bot api 10.3: the same `callback_query_id`
that fails with the flag succeeds without it, immediately afterwards. edit such a message with the
`editEphemeralMessage…` family instead
:::

::: warning `editEphemeralMessageMedia` is rejected server-side
telegram answers every call to it with `Bad Request: MESSAGE_EMPTY`, measured against bot api 10.3
with a `file_id`, an http url and a fresh upload, on both text and photo ephemerals. passing a
`message_id` instead gives `MESSAGE_ID_INVALID`, so the ephemeral is found and it is the media leg
that fails. `editEphemeralMessageText` and `editEphemeralMessageCaption` work on the same target
:::

## `update.api` — the raw layer from inside a handler

every update also exposes `update.api`, which is a direct reference to `tg.api`. this gives you access to any raw method without needing to close over `tg`:

```ts
tg.onMessage(async (message) => {
  // same as tg.api.sendMessage(...)
  await message.api.sendMessage({ chat_id: message.chatId, text: 'via api' })
})
```

## how shortcuts differ from `tg.api.X`

| | `tg.api.X(params)` | `tg.send(chat, text, params?)` | `message.send(text, params?)` |
| --- | --- | --- | --- |
| argument style | named params object | positional `chat` + `text` | positional `text`, no `chat` |
| `chat_id` | you provide it | you provide it (as first arg) | auto-filled from update |
| available | everywhere | everywhere | only inside a handler |
| coverage | every method | common send methods | per-kind set |
| return type | raw `TelegramX` | raw `TelegramMessage` | raw `TelegramMessage` |

::: tip all roads lead to tg.api
every shortcut is ultimately a thin wrapper over `tg.api.X`. there is no magic — if a shortcut doesn't cover a parameter you need, you can always drop down to `tg.api.X` or pass the extra field via the trailing `params` object
:::

## see also

- [the three-layer api](/guide/concepts/three-layer-api) — the full picture with side-by-side examples
- [updates](/guide/concepts/updates) — the update classes that carry these shortcuts
