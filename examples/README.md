# puregram examples

> standalone runnable examples for puregram v3. each is copy-paste-ready

## how to run

```sh
cp .env.example .env
# fill in TOKEN= with a token from @BotFather
yarn install                              # from repo root
yarn workspace examples dev <path>        # e.g. core/getting-started/hello-world
```

bundled examples (`examples/src/...`) run via `tsx watch --env-file=.env`. node 22.6+ users can also run them with `node --experimental-strip-types --env-file=.env` directly

standalone folders under `webhooks/` and `recipes/` are their own workspaces — each ships its own `README.md` with run instructions

## getting started

- [hello world](src/core/getting-started/hello-world.ts) — token, one handler, polling
- [polling vs webhook](src/core/getting-started/polling-vs-webhook.ts)
- [error handling basics](src/core/getting-started/error-handling-basics.ts)

## update kinds

- [message](src/core/updates/message-basics.ts)
- [callback query](src/core/updates/callback-query-basics.ts)
- [inline query](src/core/updates/inline-query-basics.ts)
- [message reaction](src/core/updates/message-reaction-basics.ts)

## keyboards

- [inline basics](src/core/keyboards/inline-basics.ts)
- [inline — all button types](src/core/keyboards/inline-all-button-types.ts)
- [reply basics](src/core/keyboards/reply-basics.ts)
- [builder vs class](src/core/keyboards/builder-vs-class.ts)

## parse mode

- [html](src/core/parse-mode/html.ts)
- [markdown v2](src/core/parse-mode/markdown-v2.ts)

## media

- [photo basics](src/core/media/photo-basics.ts)
- [all media sources](src/core/media/media-source-all-sources.ts)
- [media group with mixed sources](src/core/media/media-group-mixed.ts)

## plugins

- [single plugin](src/core/plugins/single-plugin.ts)
- [plugin with deps](src/core/plugins/plugin-with-deps.ts)
- [custom update](src/core/plugins/custom-update.ts)
- [all hooks](src/core/plugins/all-hooks.ts)

## resilience (core)

- [retry on flood_wait (429)](src/core/resilience/retry-on-flood-wait.ts)
- [catch dispatch errors + swallowDispatchErrors](src/core/resilience/catch-errors.ts)
- [polling concurrency + sequentializeBy](src/core/resilience/polling-concurrency.ts)

## ephemeral messages (10.2)

- [basics — ephemeral command, auto-injection, isEphemeral(), opt-out](src/core/ephemeral/basics.ts)
- [callback — receiver_user_id opt-in on a button press](src/core/ephemeral/callback.ts)
- [proactive — tg.ephemeral(id) admin whisper](src/core/ephemeral/proactive.ts)
- [explicit params — ephemeral_message_parameters by hand + tg.ephemeral(id, { callbackQueryId })](src/core/ephemeral/explicit-params.ts)

## @puregram/markup

- [markup basics](src/markup/basics.ts)
- [Formatted.fromMessage — quote with original entities](src/markup/from-message.ts)
- [toHtml / toMarkdown — serialize a Formatted](src/markup/to-html-markdown.ts)
- [md.lenient / html.lenient — permissive parsing for llm output](src/markup/lenient-parse.ts)

## @puregram/rich

- [basics — rich.md template → sendRich](src/rich/basics.ts)
- [builders — compose native blocks from data](src/rich/builders.ts)
- [parse vs raw — rich.md / .lenient / rich.raw.md](src/rich/parse-vs-raw.ts)
- [media — MediaSource uploads inside blocks](src/rich/media.ts)
- [buttons — inline button(...) + buttonRow(...) with a callback handler](src/rich/buttons.ts)
- [document / expandable quote / compact table](src/rich/document-quote-table.ts)

## @puregram/widgets

- [widgets showcase](recipes/widgets-showcase) — HTML templates, private-chat widget messages, and query handling

## @puregram/flow

- [waitFor basics](src/flow/wait-for-basics.ts)
- [waitForCallbackQuery + waitForCommand sugar](src/flow/wait-for-callback-and-command.ts)
- [waitForAny — race specs with AbortSignal](src/flow/race-with-abort.ts)

## @puregram/scenes

- [linear wizard](src/scenes/linear-wizard.ts)

## @puregram/session

- [in-memory basics](src/session/in-memory-basics.ts)
- [with lru storage](src/session/with-lru-storage.ts)
- [shared storage across plugins](src/session/with-shared-storage.ts)
- [lazy loading](src/session/lazy.ts)
- [composite storage key (user + chat + thread)](src/session/composite-key.ts)

## @puregram/storage

- [in-memory standalone](src/storage/in-memory.ts)
- [custom adapter (file-on-disk)](src/storage/custom-adapter.ts)
- [enhanceStorage — versioned migrations + millisecond precision](src/storage/enhance.ts)
- [@puregram/storage-redis — redis-backed kv with native ttl](src/storage/redis.ts)
- [@puregram/storage-sqlite — sqlite-backed kv with ttl + sweep](src/storage/sqlite.ts)

## @puregram/throttler

- [outbound rate-limit + flood_wait retry combo](src/throttler/basics.ts)

## @puregram/media-cacher

- [auto-evict on stale file_id](src/media-cacher/auto-evict.ts)
- [content-hash keying](src/media-cacher/content-hash.ts)

## @puregram/callback-data

- [basics](src/callback-data/basics.ts)
- [nested + optional + defaults](src/callback-data/nested.ts)
- [with keyboard](src/callback-data/with-keyboard.ts)

## @puregram/rate-limit

- [global basics](src/rate-limit/global-basics.ts)

## @puregram/utils

- [parseCommand](src/utils/parse-command.ts)
- [deepLink](src/utils/deep-link.ts)

## @puregram/stream

- [basics — plain AsyncIterable<string>](src/stream/basics.ts)
- [openai auto-detect](src/stream/openai-auto.ts)
- [openai explicit (fromOpenAI adapter)](src/stream/openai-explicit.ts)
- [anthropic auto-detect](src/stream/anthropic.ts)
- [vercel ai sdk auto-detect](src/stream/vercel-ai.ts)
- [markdown v2 streaming + AbortSignal.timeout](src/stream/markdown-with-abort.ts)
- [stoppable — canStop + keepOnStop + stopped_message_generation](src/stream/stoppable.ts)

## @puregram/test

- [fixture builders (vitest-style)](src/test/fixtures.ts)
- [virtual clock — advanceTime (vitest-style)](src/test/time-travel.ts)

## webhook adapters (standalone)

- [fastify](webhooks/fastify/)
- [raw http](webhooks/raw-http/)

## recipes (standalone)

- [wizard bot — scenes + session + inline keyboards + callback-data](recipes/wizard-bot/)
- [order wizard — branching scene: hub menu, sub-screens, in-place toggle, per-field edit, submit-to-chat](recipes/order-wizard/)
- [inline-search bot — paginated inline mode + chosen-result analytics](recipes/inline-search-bot/)
- [premium bot — Telegram Stars: one-time + subscription + refund](recipes/premium-bot/)
- [mini-app bot — fastify + initData validation + session-persisted settings](recipes/mini-app-bot/)
- [broadcast bot — admin /broadcast + throttled copyMessage fan-out + blocked-user cleanup](recipes/broadcast-bot/)
- [serverless bot — telegram-hosted handlers + formatting + database sessions](recipes/serverless-bot/)

### serverless bot

experimental; verified on the hosted runtime. unlike the other examples, this needs no `.env` or bot API token. enable serverless in BotFather, then from `examples/recipes/serverless-bot/`:

```sh
yarn build
yarn tgcloud login
yarn tgcloud push
yarn tgcloud migrate
```

edit `src/bot.ts` and `schema.js`, not the generated `tgcloud/` files. rebuild and push after changes (`yarn deploy` does both); review migrations separately. the bot remembers the previous message per user/chat through `TelegramStorage`. concurrent writes to a shared session are last-write-wins, not serialized by this adapter
