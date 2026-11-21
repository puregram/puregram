---
title: api reference
description: auto-generated reference for every telegram bot api method and object, pinned to the schema version puregram ships with
---

# api reference

the api reference is auto-generated from the pinned telegram bot api schema that ships with `@puregram/api`. it reflects exactly what the running version supports — no manual curation, no drift

## the three-layer api

puregram exposes the bot api at three levels of abstraction (see [the three-layer api](/guide/concepts/three-layer-api)):

- **`tg.api.X(params)`** — raw layer. calls the bot api directly and returns the raw bot-api type. use this when you need full control or the method isn't covered by a curated shortcut
- **`tg.send(args)`** — curated layer. message-returning helpers wrap the result as a `MessageUpdate` (or `MessageUpdate[]` for an album). access the bot-api payload through each wrapper's `.raw`
- **`update.send(args)` / `update.reply(args)`** — per-kind shortcuts. the same curated helpers, but with "anchors" pre-filled from the current update's payload (e.g. `chat_id` is taken from `update.raw.chat.id`). this is what you reach for in most handlers

## reference pages

generated from the pinned schema:

- [methods](/api/methods) — every telegram bot api method with parameter tables and return types
- [objects](/api/objects) — every telegram bot api object (types, interfaces, enums)
- [updates](/api/updates) — every wrapped update kind, its handler, shortcuts and helpers
- [filters](/api/filters) — the codegen'd `hasX` presence filters and what each narrows

hand-maintained:

- [errors](/reference/errors) — the error classes puregram throws
- [Telegram client](/reference/client) — the public method index for the `Telegram` class
