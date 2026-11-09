---
title: '@puregram/media-cacher'
description: transparent file_id caching for puregram — first send uploads, every later send reuses the cached id without re-uploading
---

# `@puregram/media-cacher`

heavy files are slow to upload — `sendPhoto` on a 5 MB image takes real seconds, every single time. `@puregram/media-cacher` fixes that transparently: the first send uploads as usual and stores the resulting `file_id`. every later send to the same chat silently swaps the path or url for the cached `MediaSource.fileId(...)` before the request leaves your bot — telegram never sees the file twice

## when to use

whenever you send the same `MediaSource.path(...)` or `MediaSource.url(...)` files repeatedly — static assets, fixed thumbnails, sticker packs, announcement images. buffers, streams, and base64 are typically one-off and not cached by default

## install

::: code-group

```sh [yarn]
yarn add @puregram/media-cacher
```

```sh [npm]
npm i -S @puregram/media-cacher
```

```sh [pnpm]
pnpm add @puregram/media-cacher
```

:::

`@puregram/media-cacher` re-exports `MemoryStorage` and `KVStorage` from [`@puregram/storage`](/plugins/storage) — install `@puregram/storage` separately only if you need `LruMemoryStorage` / `TtlStorage` or want to share one storage instance across multiple plugins

## quick start

```ts
import { Telegram, MediaSource } from 'puregram'
import { mediaCacher } from '@puregram/media-cacher'

const telegram = Telegram.fromToken(process.env.TOKEN!)
  .extend(mediaCacher())

telegram.onMessage((message) => {
  return telegram.api.sendPhoto({
    chat_id: message.chat.id,
    photo: MediaSource.path('./cat.png')
  })
})

await telegram.startPolling()
```

the first send to each chat uploads `./cat.png` and caches the `file_id`. every subsequent send to that chat is instantaneous

## core api

### `mediaCacher(options?)`

installs a `tg.extend(...)` plugin that hooks `onBeforeRequest` (before send) and `onResponseIntercept` (after response, to persist the fresh `file_id`). attaches `tg.mediaCacher` for manual inspection

### what gets cached

| method | media field |
|---|---|
| `sendPhoto` | `photo` |
| `sendVideo` | `video` |
| `sendAnimation` | `animation` |
| `sendVideoNote` | `video_note` |
| `sendAudio` | `audio` |
| `sendDocument` | `document` |
| `sendSticker` | `sticker` |

`MediaSource.path(...)` and `MediaSource.url(...)` inputs trigger caching; with `keyStrategy: 'hash'`, so do `MediaSource.bytes(...)` / `.buffer(...)` / `.arrayBuffer(...)`. all other methods pass through untouched

### `tg.mediaCacher` — manual inspection

```ts
// look up the cached file_id for (storageKey, sourceValue)
const fileId = await telegram.mediaCacher.get('100', './cat.png')

if (fileId !== undefined) {
  console.log('already cached:', fileId)
}

// drop a single entry — next send re-uploads
await telegram.mediaCacher.invalidate('100', './cat.png')

// direct access to the underlying KVStorage<string>
await telegram.mediaCacher.storage.set('whatever:key', 'AgADAQA…')
```

`storageKey` is what `getStorageKey(ctx)` returned (default: `String(ctx.params.chat_id)`). `sourceValue` is the raw string the `MediaSource` carried — `'./cat.png'` for path, `'https://…'` for url

### custom storage

by default the plugin uses an in-memory `MemoryStorage` — fine for development but lost on restart. swap in any `KVStorage<string>` for persistence:

```ts
import { mediaCacher } from '@puregram/media-cacher'

telegram.extend(mediaCacher({
  storage: new RedisStorage({ /* … */ })
}))
```

for a bounded in-memory cache (evicts the least-recently-used entry when the cap is hit):

```ts
import { LruMemoryStorage } from '@puregram/storage'

telegram.extend(mediaCacher({
  storage: new LruMemoryStorage<string>({ max: 5_000 })
}))
```

see [storage plugin](/plugins/storage) for the full `KVStorage<V>` contract and backends

### `getStorageKey`

by default entries are keyed by `chat_id`, so the same `./cat.png` cached for chat A doesn't leak into chat B:

```ts
mediaCacher({
  // share one global cache across every chat — fine for fully public assets
  getStorageKey: () => 'global'
})
```

throws `TypeError` at request time if no `chat_id` can be found and you haven't supplied a custom `getStorageKey`

### content-hash key strategy

flip to `keyStrategy: 'hash'` to key by `sha-256(bytes)` instead of the raw path/url string. distinct sources that resolve to identical content share one cached `file_id`:

```ts
telegram.extend(mediaCacher({ keyStrategy: 'hash' }))
```

| source | how the hash is computed |
|---|---|
| `MediaSource.path(...)` | `fs.readFile`, sha-256 of the bytes |
| `MediaSource.url(...)` | `fetch(url)`, sha-256 of the streamed response body |
| `MediaSource.buffer(...)` | sha-256 of the buffer directly |
| `MediaSource.arrayBuffer(...)` | sha-256 of the arraybuffer directly |
| `MediaSource.stream(...)` / `MediaSource.file(...)` | not supported — use `'sourceValue'` |

::: warning
with `keyStrategy: 'hash'` and a url source, the cache-miss path fetches the url twice: once for the digest, once for the actual upload. for high-frequency senders on url sources, the default `'sourceValue'` strategy avoids the extra fetch
:::

for manual inspection with `hash` mode, pass the hash as the `sourceValue` argument:

```ts
import { hashMediaInput } from '@puregram/media-cacher'
import { MediaSource } from 'puregram'

const hash = await hashMediaInput(MediaSource.path('./cat.png'))
const fileId = await telegram.mediaCacher.get(String(chatId), hash)
```

### telegram serverless

each [serverless](/guide/deployment/serverless) invocation starts empty, so pair the cache with a persistent table and the platform's `fetch`:

```ts
import { mediaCacher } from '@puregram/media-cacher'
import { TelegramStorage } from '@puregram/serverless/storage'
import { fetch } from 'sdk'

const tg = createBot().extend(mediaCacher({
  storage: new TelegramStorage({ table: 'media' }),
  keyStrategy: 'hash',
  fetch
}))
```

repeat uploads of identical bytes then reuse one `file_id` across invocations. `MediaSource.path` is unavailable there

### auto-evict + retry on stale `file_id`

telegram occasionally rotates `file_id`s and returns one of these 400 errors:

- `Bad Request: wrong file identifier/HTTP URL specified`
- `Bad Request: wrong file_id`
- `Bad Request: file is temporarily unavailable`

when the plugin detects one on a request that used a cached id, it:

1. evicts the stale entry from storage
2. re-issues the request once with the original `MediaSource.path(...)` / `MediaSource.url(...)`
3. persists the fresh `file_id` from the retry
4. returns the retry's result to the caller — as if the first send had worked

if the retry itself fails the original error propagates — no second retry, no infinite loop

**concurrent stale ids** — if multiple in-flight sends are using the same stale `file_id`, only one re-upload happens. the first failure becomes the leader; everyone else waits for the fresh id and then dispatches with it

customize which descriptions trigger eviction:

```ts
mediaCacher({
  staleFileIdPatterns: [
    'wrong file_id',
    'file is temporarily unavailable',
    'file no longer exists'   // custom
  ]
})
```

## options

`mediaCacher(options?)`:

| option | type | default | description |
|---|---|---|---|
| `storage` | `KVStorage<string>` | fresh `MemoryStorage<string>` | backing store |
| `getStorageKey` | `(ctx: RequestContext) => string` | `String(ctx.params.chat_id)` | derive the cache scope key from an outgoing request |
| `keyStrategy` | `'sourceValue' \| 'hash'` | `'sourceValue'` | second half of the cache key — raw path/url or sha-256 of bytes (also caches byte uploads) |
| `fetch` | `(url) => Promise<{ ok, status, body }>` | global `fetch` | used to hash url sources under `'hash'` |
| `staleFileIdPatterns` | `readonly string[]` | three built-in patterns | substrings that trigger auto-evict + retry on a 400 response |

## exported surface

```ts
import { mediaCacher } from '@puregram/media-cacher'

import type {
  AllowedMediaMethod,       // 'sendPhoto' | 'sendVideo' | …
  KeyStrategy,              // 'sourceValue' | 'hash'
  KVStorage,                // re-exported from @puregram/storage
  MediaCacherExtension,     // shape of tg.mediaCacher
  MediaCacherOptions
} from '@puregram/media-cacher'

import {
  ALLOWED_MEDIA_TYPES,      // [MediaSourceType.Path, MediaSourceType.Url]
  hashBytes,                // sha-256 of arbitrary bytes as hex string
  hashMediaInput,           // sha-256 of the bytes a MediaInput resolves to
  MEDIA_METHOD_TO_KEY_MAP,  // { sendPhoto: 'photo', sendVideo: 'video', … }
  MemoryStorage             // re-exported from @puregram/storage
} from '@puregram/media-cacher'
```

## see also

- [storage plugin](/plugins/storage) — `KVStorage<V>` contract, redis/sqlite backends, `LruMemoryStorage`
- [plugins & .extend](/guide/concepts/plugins) — how `.extend(plugin)` works
- [messages & media](/guide/telegram/messages-and-media) — `MediaSource.*` factory methods
- [/api/methods](/api/methods) — raw `sendPhoto` / `sendVideo` / etc signatures
