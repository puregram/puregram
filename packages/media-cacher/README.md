<div align='center'>
  <img src='https://i.imgur.com/ZzjmE8i.png' />
</div>

<br />

<div align='center'>
  <a href='https://github.com/puregram/puregram'><b><code>puregram</code></b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#options'><b>options</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='https://t.me/pureforum'><b>telegram forum</b></a>
</div>

## @puregram/media-cacher

_cache sent media `file_id`s with ease for `puregram` package_

### introduction

if you send a lot of similar `MediaSource.path` or `MediaSource.url` files you've probably noticed how slow that gets. heavy files take real seconds to upload, every single time, and it's not like you actually *want* to wait those extra times. that's why you probably need `@puregram/media-cacher`

it sits as an `onBeforeRequest` hook on every cacheable upload method (`sendPhoto`, `sendVideo`, `sendAnimation`, `sendVideoNote`, `sendAudio`, `sendDocument`, `sendSticker`). first call uploads as normal and stores the resulting `file_id` keyed by `(chatId, sourceValue)`. every later call swaps the path/url for the cached `MediaSource.fileId(...)` before the request leaves your bot — telegram never sees the file twice

### example

```ts
import { Telegram, MediaSource } from 'puregram'
import { mediaCacher } from '@puregram/media-cacher'

const telegram = Telegram.fromToken(process.env.TOKEN!)
  .extend(mediaCacher()) // <-- !

telegram.onMessage((message) => {
  return telegram.api.sendPhoto({
    chat_id: message.chat.id,
    photo: MediaSource.path('./cat.png')
  })
})

await telegram.startPolling()
```

if `./cat.png` is heavy, the first send takes the upload time. every next send to the same chat is instantaneous — `MediaSource.path('./cat.png')` quietly becomes the cached `file_id` before the request fires

### installation

```sh
$ yarn add @puregram/media-cacher
$ npm i -S @puregram/media-cacher
```

`@puregram/media-cacher` re-exports `MemoryStorage` and `KVStorage` from [`@puregram/storage`](../storage) — install `@puregram/storage` separately only if you want to share one storage instance across multiple plugins or import the additional `LruMemoryStorage` / `TtlStorage` types

---

## what gets cached

| method | media field | cached? |
|---|---|---|
| `sendPhoto` | `photo` | ✅ |
| `sendVideo` | `video` | ✅ |
| `sendAnimation` | `animation` | ✅ |
| `sendVideoNote` | `video_note` | ✅ |
| `sendAudio` | `audio` | ✅ |
| `sendDocument` | `document` | ✅ |
| `sendSticker` | `sticker` | ✅ |
| every other api method | — | ❌ untouched |

cache fires for `MediaSource.path(...)` and `MediaSource.url(...)` inputs. with `keyStrategy: 'hash'` it also fires for `MediaSource.bytes(...)` / `.buffer(...)` / `.arrayBuffer(...)`, keyed by content. streams and files are never cached

the live list lives at `MEDIA_METHOD_TO_KEY_MAP` and `ALLOWED_MEDIA_TYPES` if you need to introspect

---

## custom storage

internally `@puregram/media-cacher` uses [`MemoryStorage`](../storage) — fine for development but lost on restart. swap in any `KVStorage<string>` for persistence. classic case is reaching for redis:

```ts
import { mediaCacher } from '@puregram/media-cacher'
import { RedisStorage } from 'some-redis-storage-implementation-i-guess'

telegram.extend(mediaCacher({
  storage: new RedisStorage({ /* ... */ })
}))
```

bounded in-memory works too — useful when you don't care about cross-restart persistence but want a hard ceiling on memory:

```ts
import { LruMemoryStorage } from '@puregram/storage'

telegram.extend(mediaCacher({
  storage: new LruMemoryStorage<string>({ max: 5_000 })
}))
```

see [`@puregram/storage`](../storage) for the full `KVStorage<V>` contract and a redis-flavored example

---

## `getStorageKey`

every storage-using satellite in puregram exposes a `getStorageKey` hook so you can decide what counts as the same "user" / "scope" for cache purposes. the default keys cache entries by `chat_id` — so the same `./cat.png` cached for chat A doesn't leak into chat B (different chats might have different access permissions, especially for stickers / documents in private vs. group contexts)

```ts
mediaCacher({
  // share a single global cache across every chat — risky for permission-sensitive media,
  // but fine for fully public assets
  getStorageKey: () => 'global'
})
```

requests without a usable chat scope bypass caching. this includes bot api 10.4 callback-only ephemeral replies: telegram ignores `chat_id` when `receiver_user_id` is omitted. a custom `getStorageKey` may return `undefined` to bypass caching, or supply a stable application-specific scope.

---

## manual inspection — `telegram.mediaCacher`

the plugin attaches a small handle for direct cache reads / evictions:

```ts
// look up the cached file_id for (storageKey, sourceValue)
const fileId = await telegram.mediaCacher.get('100', './cat.png')

if (fileId !== undefined) {
  console.log('already cached:', fileId)
}

// drop a single entry — next send will re-upload
await telegram.mediaCacher.invalidate('100', './cat.png')

// the raw KVStorage<string>, in case you need it
await telegram.mediaCacher.storage.set('whatever:key', 'AgADAQA…')
```

`storageKey` is what `getStorageKey(ctx)` returned (default: `String(ctx.params.chat_id)`). `sourceValue` is the raw string the `MediaSource` carried — `'./cat.png'` for path, `'https://…'` for url

---

<a name='options'></a>
## options

`mediaCacher(options?)`:

| option | type | description |
|---|---|---|
| `storage` | `KVStorage<string>` | backing store. default: a fresh `MemoryStorage<string>`. swap for redis/sqlite/`LruMemoryStorage`/etc to persist or bound the cache |
| `getStorageKey` | `(ctx: RequestContext) => string \| undefined` | derive the cache scope key. defaults to `String(ctx.params.chat_id)` when the chat is usable; `undefined` bypasses caching |
| `keyStrategy` | `'sourceValue' \| 'hash'` | how the second half of the cache key is derived. default `'sourceValue'` (raw path/url). `'hash'` keys by sha-256 of the bytes so distinct sources with identical content share one entry, and caches in-memory byte uploads too |
| `fetch` | `(url) => Promise<{ ok, status, body }>` | fetch used to hash url sources under `'hash'`. default: the global `fetch`. pass the platform's `fetch` on telegram serverless |
| `staleFileIdPatterns` | `readonly string[]` | substrings that trigger the auto-evict + retry path on a 400 response, matched case-insensitively against `description`. defaults cover the three known telegram messages |

---

## `telegram.mediaCacher` interface reference

```ts
interface MediaCacherExtension {
  /** look up the cached file_id for (storageKey, sourceValue), or undefined */
  get: (storageKey: string, sourceValue: string) => Promise<string | undefined>

  /** drop the entry for (storageKey, sourceValue) */
  invalidate: (storageKey: string, sourceValue: string) => Promise<void>

  /** the configured KVStorage<string> instance — direct access if you need it */
  storage: KVStorage<string>
}
```

---

## auto-evict + retry on stale `file_id`

cached `file_id`s mostly live forever, but telegram occasionally rotates them — usually with one of these 400s:

- `Bad Request: wrong file identifier/HTTP URL specified`
- `Bad Request: wrong file_id`
- `Bad Request: file is temporarily unavailable`

when the plugin spots one of those on a request that used a cached `file_id`, it:

1. evicts the stale entry from storage
2. re-issues the same request once, with the original `MediaSource.path(...)` / `MediaSource.url(...)`
3. lets the normal cache hook persist the fresh `file_id` from the retry response
4. returns the retry's result to the caller — exactly as if the first send had worked

if the retry itself fails (e.g. the local file was deleted, or the url 404s), the original error propagates — there is no second retry, no infinite loop

### concurrency: one re-upload per stale id

if multiple in-flight sends are using the same stale `file_id` and they all 400 around the same time, only **one** re-upload happens. the first failure becomes the "leader" and performs the actual upload; everyone else waits until the cache is refreshed and then dispatches with the fresh `file_id`. for a heavy file in a popular chat, that's one upload instead of N

### customizing the trigger

the match is a case-insensitive substring against `description`. if your bot api proxy returns different wording, pass your own list:

```ts
mediaCacher({
  staleFileIdPatterns: [
    'wrong file_id',
    'file is temporarily unavailable',
    'file no longer exists' // <- custom
  ]
})
```

---

## content-hash key strategy

by default the cache is keyed by `(chatId, sourceValue)` — the literal path or url string. two distinct paths pointing at the exact same bytes get two distinct cache entries

flip to `keyStrategy: 'hash'` to key by `(chatId, sha256(bytes))` instead. distinct sources that resolve to identical content share one cached `file_id`

```ts
telegram.extend(mediaCacher({ keyStrategy: 'hash' }))
```

what the hash is computed over, per source type:

| source | how |
|---|---|
| `MediaSource.path(...)` | `fs.readFile` once, sha-256 of the bytes |
| `MediaSource.url(...)` | `fetch(url)`, sha-256 of the streamed response body |
| `MediaSource.buffer(...)` | sha-256 of the buffer directly |
| `MediaSource.arrayBuffer(...)` | sha-256 of the arraybuffer directly |
| `MediaSource.stream(...)` / `MediaSource.file(...)` | not supported — streams aren't replayable. use `'sourceValue'` for these |

**tradeoff** — on `MediaSource.url(...)` with the `hash` strategy, the cache miss path fetches the url twice: once to compute the digest, once to actually upload (telegram fetches the url itself). for paths it's a single `readFile`, then the upload re-reads it; in practice the kernel page cache makes the second read free

manual inspection still works the same — pass the hash as `sourceValue`:

```ts
const hash = await hashMediaInput(MediaSource.path('./cat.png'))
const fileId = await telegram.mediaCacher.get(String(chatId), hash)
```

`hashBytes` and `hashMediaInput` are exported for direct use

### telegram serverless

on [telegram serverless](https://puregram.cool/guide/deployment/serverless) every invocation starts empty, so give the cache a persistent table and the platform's `fetch`:

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

repeat uploads of the same bytes then reuse the cached `file_id` across invocations. `MediaSource.path` is unavailable there

---

## exported types

```ts
import type {
  AllowedMediaMethod,         // 'sendPhoto' | 'sendVideo' | … (the seven cached methods)
  KeyStrategy,                 // 'sourceValue' | 'hash'
  KVStorage,                   // re-exported from @puregram/storage
  MediaCacherExtension,        // shape of telegram.mediaCacher
  MediaCacherOptions           // options to mediaCacher({...})
} from '@puregram/media-cacher'

import {
  ALLOWED_MEDIA_TYPES,         // [MediaSourceType.Path, MediaSourceType.Url]
  hashBytes,                   // sha-256 of arbitrary bytes as hex
  hashMediaInput,              // sha-256 of the bytes a MediaInput resolves to
  MEDIA_METHOD_TO_KEY_MAP,     // { sendPhoto: 'photo', sendVideo: 'video', … }
  MemoryStorage                // re-exported from @puregram/storage
} from '@puregram/media-cacher'
```
