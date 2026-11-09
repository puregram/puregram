---
title: plugins
description: opt-in satellite packages — flow, scenes, session, storage, markup, and more — installed via tg.extend(plugin)
---

# plugins

puregram core is a thin wrapper. everything beyond the bot api — state, wizards, formatting, rate limiting, file-id parsing — lives in opt-in **satellite packages**. runtime plugins attach with `tg.extend(plugin)` (see [plugins & .extend](/guide/concepts/plugins)); a few are plain import-only utilities

## state

- [session](/plugins/session) — per-user / per-chat state, auto-flushed on each update
- [storage](/plugins/storage) — the `KVStorage` contract + redis / sqlite adapters

## flows & wizards

- [flow](/plugins/flow/) — pause a handler and wait for the next update (`waitFor`, `prompt`, persistent flows)
- [scenes](/plugins/scenes) — multi-step wizards

## text & data

- [markup](/plugins/markup/) — entity-aware text formatting, no `parse_mode`
- [rich](/plugins/rich) — safe rich-message emitter (headings, lists, code blocks, formulas, and more)
  - [rich grammar for LLMs](/plugins/rich-llm-grammar) — a system prompt that keeps a model's output inside telegram's rich grammar
- [callback-data](/plugins/callback-data) — typed, packed `callback_data`
- [widgets](/plugins/widgets) — typed HTML templates and data updates for widget messages

## rate limiting

- [rate-limit](/plugins/rate-limit) — inbound per-user limiting
- [throttler](/plugins/throttler) — outbound limiting, keeps you under telegram's send limits

## files & ids

- [media-cacher](/plugins/media-cacher) — transparent `file_id` caching, upload once and reuse
- [file-id](/plugins/file-id) — parse / inspect / serialize `file_id` and `file_unique_id`
- [inline-message-id](/plugins/inline-message-id) — decode the `inline_message_id` blob

## more

- [stream](/plugins/stream) — stream model output to telegram via live message edits
- [utils](/plugins/utils) — casino-value decoder, web-app `initData` validation, deep-link helpers
- [test](/plugins/test) — in-process fake telegram for testing your bot
