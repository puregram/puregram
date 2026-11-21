---
title: collectMediaGroup — @puregram/flow
description: buffer every message in a Telegram album and resolve with the full set in one call
---

# `collectMediaGroup`

telegram delivers each album item as a separate update with the same `media_group_id`. `collectMediaGroup` buffers items for that id within one client, chat and business connection (if any). it resolves after a window of inactivity.

use it on messages, channel posts, business messages, their edited variants, or message-derived service updates. queries (including callback and widget queries) cannot collect albums, even if they refer to a message. guest messages are also excluded: their ids cannot address the guest chat through the bulk methods.

```ts
tg.onMessage(async (message) => {
  if (!message.hasMediaGroupId()) {
    return
  }

  const all = await message.flow.collectMediaGroup()

  if (all[0] === message) {
    await message.send(`got ${all.length} items in this album`)
  }
})
```

each caller in the same window receives the same `CollectedMediaGroup`. it keeps the first update for each `message_id` in arrival order, so `all[0] === message` lets only the first item's handler act on the album. `.contexts` is the collection itself. without `media_group_id`, collection resolves immediately with just the source message.

bulk operations send unique message ids in ascending order without reordering the collection. empty collections and collections mixing clients, chats or business connections are rejected before any request.

- `await all.forward(destination)` and `await all.copy(destination)` return `TelegramMessageId[]`, not editable messages. both reject business albums because the bulk methods cannot specify a source business connection.
- `await all.delete()` deletes the originals with `deleteMessages` for bot chats or `deleteBusinessMessages` for a business connection.

## the lower-level form

`tg.flow.collectMediaGroup(message, options?)` takes an eligible source update explicitly:

```ts
const all = await tg.flow.collectMediaGroup(sourceMessage, { window: 500 })
```

## tuning the window

the window is **sliding**: each new `message_id` resets the timer; a duplicate does not. the default is `1000` ms

you can change it at two levels:

```ts
// plugin-level default — applies to every call without a per-call override
const tg = Telegram.fromToken(TOKEN)
  .extend(flow({ mediaGroupWindow: 2_000 }))

// per-call override
const all = await message.flow.collectMediaGroup({ window: 500 })
```

| option | type | default | description |
|---|---|---|---|
| `window` | `number` (ms) | plugin `mediaGroupWindow` (default `1000`) | inactivity window after the last album item before resolving |

::: tip choosing a window
larger windows tolerate slow telegram delivery; smaller windows resolve faster but risk truncating a late-arriving item. `1000` ms is fine for most deployments. raise it to `2000`–`3000` ms if you see albums arriving incomplete on slower connections
:::

## see also

- [@puregram/flow overview](/plugins/flow/) — install and plugin options
- [waiters](/plugins/flow/waiters) — `waitFor` for other use cases
