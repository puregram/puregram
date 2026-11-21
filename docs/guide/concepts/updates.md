---
title: updates
description: the wrapped Update class — kind discriminant, raw payload, update.is() type predicate, and the class-per-kind model
---

# updates

an **update** (capital `U`) is everything telegram pushes at your bot — a new message, an edited message, a callback query press, an inline query, a poll-vote, a chat-member change, and so on. puregram wraps each one in a dedicated class codegen'd from the bot api schema

```ts
tg.onMessage((message) => {
  // wrapped accessor — camelCase, memoized
  console.log(message.text, message.from?.username)

  // raw bot-api payload — always available
  console.log(message.raw.message_id, message.raw.chat.id)

  return message.send('got it')
})
```

::: tip it's not a "context"
puregram uses the name `Update` for these objects, not `Context`. there is no `ctx` — the argument is the update itself
:::

## the kind discriminant

every update carries a `kind` string that identifies what it is. it is literal-typed, so TypeScript knows the exact class:

```ts
tg.onUpdate((update) => {
  console.log(update.kind) // e.g. "message", "callback_query", "poll"
})
```

## `update.is(kind)` — type predicate

`update.is(kind)` is a type guard. when it returns `true`, TypeScript narrows the update to the matching class:

```ts
tg.onUpdate((update) => {
  if (update.is('message')) {
    // narrowed to MessageUpdate — update.text, update.from, update.send(...) available
    return update.send(`echo: ${update.text}`)
  }

  if (update.is('callback_query')) {
    // narrowed to CallbackQueryUpdate
    return update.answer({ text: 'got it' })
  }
})
```

## `update.raw`

every update exposes the original bot-api payload as `update.raw`. use it when you need a field that the wrapper doesn't (yet) expose, or when you want to pass the raw shape to a third-party library:

```ts
tg.onMessage((message) => {
  const raw = message.raw  // TelegramMessage — the exact shape the bot api sent
  console.log(raw.date, raw.forward_origin)
})
```

`update.raw` is the payload for that kind. when telegram delivers an update, `update.update` is the full bot-api envelope and `update.updateId` reads its `update_id`. a `MessageUpdate` returned by a send shortcut has no incoming envelope or update id.

`query.hasAccessibleMessage()` narrows a callback's `query.message` to a `MessageUpdate` you can reply to. an inaccessible message (`date === 0`) carries only its raw coordinates; an inline callback has no `message`.

## collection wrappers

most `T[]` fields stay plain arrays. a handful surface as a **collection wrapper** instead — an object that iterates like the array it replaced, keeps the array on `.raw`, and adds the query you actually wanted:

| accessor | wrapper | what it adds |
| --- | --- | --- |
| `message.photo`, `video.cover` | `Photo` | `biggest`, `smallest`, `byMin(width)` |
| `video.qualities` | `VideoQualities` | the same, plus `byCodec('h264')` |
| `oldReaction`, `newReaction`, `added`, `removed` | `Reactions` | `emojis`, `customEmojiIds`, `has(emoji)`, `hasCustomEmoji(id)`, `hasPaid()` |
| `reactions` (on `message_reaction_count`) | `ReactionCounts` | `total`, `top`, `countOf(emoji)`, `countOfCustomEmoji(id)`, `countOfPaid()` |
| `poll.options` | `PollOptions` | `winner`, `totalVotes`, `byId(persistentId)` |

```ts
tg.onMessage((message) => {
  message.photo?.biggest.fileId     // largest size, no `.at(-1)!` dance
  message.photo?.byMin(320).width   // smallest size at least 320px wide
})

tg.onMessageReaction((update) => {
  update.added.emojis               // ['🔥'] — only the emoji reactions
  update.added.customEmojiIds       // ids to feed getCustomEmojiStickers
  update.newReaction.has('👍')      // no hand-narrowing of the ReactionType union
})
```

the wrapped element type is unchanged — iterating `Photo` yields `PhotoSize` instances, and `.raw` is still `TelegramPhotoSize[]`. `Reactions` is the exception: `ReactionType` is a bare union with no wrapper class, so iterating yields the raw entries

`message.entities` and `message.captionEntities`, when present, are `MessageEntities` arrays of wrapped entities. use `.only(type)` to filter by entity type, or `.where(properties)` to match raw bot-api properties. for example, `message.entities?.only('pre').where({ language: 'ts' }).first` finds the first TypeScript code block. `.with(index, value)` is the native array replacement method, not a filter.

`message.attachment` selects one wrapped attachment. use `message.hasAttachmentType('animation')` to narrow it; an animation takes precedence over its backwards-compatible `document` field.

## the class-per-kind model

each update kind is its own class — `MessageUpdate`, `CallbackQueryUpdate`, `InlineQueryUpdate`, etc. they're all codegen'd from the bot api schema. the codegen attaches:

- **getters** for every field (`message.text`, `message.from`, `message.chat`)
- **per-kind shortcuts** as methods (`message.send(...)`, `message.edit(...)`, `message.delete()`, `callbackQuery.answer(...)`)
- **`update.is(kind)`** as a type predicate
- **`update.api`** as a shortcut to `tg.api` so you can call any bot api method directly from an update handler

## common update kinds

| kind | class | description |
| --- | --- | --- |
| `message` | `MessageUpdate` | new message in any chat |
| `edited_message` | `EditedMessageUpdate` | an existing message was edited |
| `channel_post` | `ChannelPostUpdate` | new post in a channel |
| `edited_channel_post` | `EditedChannelPostUpdate` | a channel post was edited |
| `callback_query` | `CallbackQueryUpdate` | inline keyboard button press |
| `inline_query` | `InlineQueryUpdate` | inline mode query |
| `chosen_inline_result` | `ChosenInlineResultUpdate` | user picked an inline result |
| `shipping_query` | `ShippingQueryUpdate` | shipping address provided for an invoice |
| `pre_checkout_query` | `PreCheckoutQueryUpdate` | final confirmation before a payment |
| `poll` | `PollUpdate` | poll state changed |
| `poll_answer` | `PollAnswerUpdate` | user answered a poll |
| `my_chat_member` | `MyChatMemberUpdate` | bot's own membership changed |
| `chat_member` | `ChatMemberUpdate` | a chat member's status changed |
| `chat_join_request` | `ChatJoinRequestUpdate` | join request in a private channel/group |
| `message_reaction` | `MessageReactionUpdate` | user reacted to a message |

there are ~50 kinds in total including [service events](/guide/handling-updates/service-events) (derived from `TelegramMessage` payloads like `new_chat_members`, `pinned_message`). the full map lives in `UpdateKindMap` in `@puregram/api`

## dispatcher shortcuts

every kind has a matching `tg.on<Kind>(handler)` on the `Telegram` class:

```ts
tg.onMessage((message) => { /* ... */ })
tg.onCallbackQuery((callbackQuery) => { /* ... */ })
tg.onInlineQuery((inlineQuery) => { /* ... */ })
tg.onChatMember((update) => { /* ... */ })

// catch-all for any update kind
tg.onUpdate((update) => { /* ... */ })
```

the dispatcher accepts an optional filter as the first argument — details are in the [dispatch & filters guide](/guide/handling-updates/dispatch-and-filters)

## see also

- [the three-layer api](/guide/concepts/three-layer-api) — how to call api methods from an update
- [shortcuts](/guide/concepts/shortcuts) — per-kind methods and the anchor concept
- [the Telegram client](/guide/concepts/the-telegram-client) — registering update handlers
