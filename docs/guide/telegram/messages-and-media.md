---
title: messages & media
description: sending text, photos, videos, documents, and albums — MediaSource, InputMedia, and MediaGroup factories
---

# messages & media

sending a message is one function call. sending a photo, video, document, or a full album takes one more line. this page covers the building blocks: `MediaSource`, `InputMedia`, and `MediaGroup`

```ts
import { Telegram, MediaSource, InputMedia, MediaGroup } from 'puregram'

const tg = Telegram.fromToken(process.env.TOKEN!)

tg.onMessage(async (message) => {
  await message.sendPhoto(MediaSource.path('./cat.png'), { caption: 'cute' })
})
```

## MediaSource — wrapping your media

`MediaSource` is a factory for the various forms of media a method can accept. every `sendPhoto` / `sendDocument` / etc. parameter that takes an upload accepts a `MediaSource` envelope

| factory | what it wraps |
|---|---|
| `MediaSource.path(path)` | local file path — puregram reads and uploads it |
| `MediaSource.url(url)` | https url — telegram fetches it server-side |
| `MediaSource.fileId(id)` | already-uploaded `file_id` — no re-upload |
| `MediaSource.buffer(buf)` | `Buffer` in memory |
| `MediaSource.stream(readable)` | node `Readable` |
| `MediaSource.file(file)` | WHATWG `File` object |
| `MediaSource.arrayBuffer(ab)` | `ArrayBuffer` / `SharedArrayBuffer` |
| `MediaSource.bytes(view)` | any `ArrayBufferView` (`Uint8Array`, `DataView`, …) |
| `MediaSource.base64(str)` | base64 string — decoded to `Buffer` before upload |
| `MediaSource.text(str)` | utf-8 string uploaded as a text file |
| `MediaSource.json(value)` | any value serialized as JSON and uploaded as a file |
| `MediaSource.local(path)` | path the **local bot api server** reads off disk — no upload |

every factory accepts an optional second argument `{ filename?: string }`. for `MediaSource.url` there is also `{ forceUpload?: boolean }` — set it when telegram's server-side fetch does not work for your url (it only works for gif/pdf/zip on `sendDocument`)

`MediaSource.local(path)` only applies when you run a [local bot api server](/guide/concepts/the-telegram-client#local-bot-api-server) with `useLocal: true` — it hands the server a `file://` path to read itself instead of uploading the bytes, and throws otherwise

```ts
// local file
message.sendPhoto(MediaSource.path('./photo.jpg'))

// url — telegram fetches it
message.sendDocument(MediaSource.url('https://example.com/file.pdf'))

// force puregram to fetch and re-upload
message.sendDocument(MediaSource.url(pdfUrl, { forceUpload: true, filename: 'report.pdf' }))

// reuse a file already on telegram's servers
message.sendPhoto(MediaSource.fileId(savedFileId))

// in-memory buffer
const buf = await fs.readFile('./image.png')
message.sendPhoto(MediaSource.buffer(buf, { filename: 'image.png' }))

// text as a document
message.sendDocument(MediaSource.text('hello', { filename: 'note.txt' }))
```

::: tip which source to use?
`fileId` is the fastest — no upload traffic, instant. use it whenever you've already received the file from telegram and stored its `file_id`. `path` is the simplest for local files. `buffer` and `stream` are useful when the bytes are already in memory or coming from another stream
:::

## sending individual media

each media kind has its own per-kind shortcut on `message`, and a matching shortcut on `tg`:

```ts
// on the update (chat_id filled automatically)
message.sendPhoto(MediaSource.path('./cat.png'), { caption: 'cat' })
message.sendVideo(MediaSource.url('https://example.com/clip.mp4'))
message.sendDocument(MediaSource.buffer(buf, { filename: 'file.bin' }))
message.sendAudio(MediaSource.path('./track.mp3'))
message.sendVoice(MediaSource.path('./voice.ogg'))
message.sendAnimation(MediaSource.path('./anim.gif'))
message.sendVideoNote(MediaSource.path('./note.mp4'))
message.sendSticker(MediaSource.fileId(stickerId))

// on tg (chat_id passed explicitly)
tg.sendPhoto(CHAT_ID, MediaSource.path('./cat.png'), { caption: 'cat' })

// raw bot-api call (all fields explicit)
tg.api.sendPhoto({ chat_id: CHAT_ID, photo: MediaSource.path('./cat.png'), caption: 'cat' })
```

the `message.sendX` forms fill `chat_id` from the incoming message's chat. individual media sends resolve to a `MessageUpdate`; use `sent.raw` or call `tg.api.sendPhoto` directly for the raw `TelegramMessage`.

## reply twins — `replyWith<Media>`

every `sendX` shortcut on message-bearing updates has a **reply twin** that pre-fills `reply_parameters.message_id` so the bot's response shows as a reply to the triggering message:

| send shortcut | reply twin |
|---|---|
| `message.send(text)` | `message.reply(text)` |
| `message.sendPhoto(src)` | `message.replyWithPhoto(src)` |
| `message.sendVideo(src)` | `message.replyWithVideo(src)` |
| `message.sendDocument(src)` | `message.replyWithDocument(src)` |
| `message.sendAudio(src)` | `message.replyWithAudio(src)` |
| `message.sendVoice(src)` | `message.replyWithVoice(src)` |
| `message.sendAnimation(src)` | `message.replyWithAnimation(src)` |
| `message.sendVideoNote(src)` | `message.replyWithVideoNote(src)` |
| `message.sendSticker(src)` | `message.replyWithSticker(src)` |
| `message.sendLocation(lat, lng)` | `message.replyWithLocation(lat, lng)` |
| `message.sendVenue(lat, lng, title, addr)` | `message.replyWithVenue(lat, lng, title, addr)` |
| `message.sendContact(phone, firstName)` | `message.replyWithContact(phone, firstName)` |
| `message.sendPoll(question, options)` | `message.replyWithPoll(question, options)` |
| `message.sendDice()` | `message.replyWithDice()` |
| `message.sendMediaGroup(media)` | `message.replyWithMediaGroup(media)` |

```ts
tg.onMessage(async (message) => {
  // replies to the message that triggered the handler
  await message.replyWithPhoto(MediaSource.path('./cat.png'), { caption: 'here you go' })
})
```

if you also pass `reply_parameters` in the options, it merges with the auto-filled one — the user-supplied fields win

::: tip
`reply` and `replyWith<Media>` are the most natural way to respond inside a handler. only use `message.send` (no reply) when you explicitly want to send without a reply thread
:::

## InputMedia — per-item media descriptors

`InputMedia` builds the per-item objects that `sendMediaGroup` and `editMessageMedia` expect. each factory takes a `media` as the first argument (either a `MediaSource` envelope or a raw `file_id` string), and an optional second argument with extra per-item fields like `caption` or `parseMode`

```ts
import { InputMedia, MediaSource } from 'puregram'

// photo with a caption on the second item
const album = [
  InputMedia.photo(MediaSource.path('a.png')),
  InputMedia.photo(MediaSource.path('b.png'), { caption: 'pair', parseMode: 'HTML' })
]

// mixed photo + video album
const mixed = [
  InputMedia.photo(MediaSource.path('cover.jpg'), { caption: 'a short clip' }),
  InputMedia.video(MediaSource.path('clip.mp4'))
]
```

| factory | valid in `sendMediaGroup` | valid in `editMessageMedia` | valid in `tg.sendMedia` |
|---|---|---|---|
| `InputMedia.photo` | yes | yes | no |
| `InputMedia.video` | yes | yes | no |
| `InputMedia.document` | yes | yes | no |
| `InputMedia.audio` | yes | yes | no |
| `InputMedia.animation` | no | yes | no |
| `InputMedia.sticker` | no | no | yes |
| `InputMedia.videoNote` | no | no | yes |
| `InputMedia.voice` | no | no | yes |

::: warning animation in groups
telegram does not allow animations in `sendMediaGroup`. use `InputMedia.animation` only with `editMessageMedia` or `tg.sendMedia`
:::

### `tg.sendMedia` — polymorphic single dispatch

`tg.sendMedia(chat, media)` dispatches to the right `tg.api.sendX` call based on the `type` field:

```ts
tg.sendMedia(CHAT_ID, InputMedia.photo(MediaSource.path('cat.png'), { caption: 'cat' }))
tg.sendMedia(CHAT_ID, InputMedia.sticker(MediaSource.fileId(stickerId)))
tg.sendMedia(CHAT_ID, InputMedia.voice(MediaSource.path('voice.ogg')))
```

## MediaGroup — shortcut for uniform albums

`MediaGroup` wraps the common case where every item in an album is the same type. it takes a list of media inputs (each a `MediaSource` envelope or a raw string) and returns the correctly-shaped array

```ts
import { MediaGroup, MediaSource } from 'puregram'

// three photos as an album
await tg.api.sendMediaGroup({
  chat_id: CHAT_ID,
  media: MediaGroup.photos([
    MediaSource.path('a.png'),
    MediaSource.path('b.png'),
    MediaSource.path('c.png')
  ], { caption: 'three photos' })
})

// attach caption to a non-first item
await tg.api.sendMediaGroup({
  chat_id: CHAT_ID,
  media: MediaGroup.videos([videoA, videoB, videoC], { caption: 'b', captionIndex: 1 })
})
```

| factory | telegram type |
|---|---|
| `MediaGroup.photos(items, opts?)` | photo album |
| `MediaGroup.videos(items, opts?)` | video album (can be mixed with photos) |
| `MediaGroup.documents(items, opts?)` | document group — must be uniform |
| `MediaGroup.audios(items, opts?)` | audio group — must be uniform |

the optional `opts` object accepts:
- `caption` — caption string to attach to one item
- `captionIndex` — which item index gets the caption (default `0` — telegram shows the first item's caption as the album-level caption)

### mixing photos and videos

telegram allows mixing photos and videos in a single album. to do that, build the array manually with `InputMedia` rather than `MediaGroup`:

```ts
const album = [
  ...MediaGroup.photos([photoSrc], { caption: 'look at this' }),
  ...MediaGroup.videos([videoSrc])
]

await tg.api.sendMediaGroup({ chat_id: CHAT_ID, media: album })
```

or use `InputMedia` directly for full per-item control:

```ts
await tg.api.sendMediaGroup({
  chat_id: CHAT_ID,
  media: [
    InputMedia.photo(MediaSource.path('cover.jpg'), { caption: 'album title' }),
    InputMedia.video(MediaSource.path('clip.mp4'))
  ]
})
```

## chat actions — `typing`, `upload_photo`, …

telegram clears a chat action (the "typing…" / "sending photo…" hint) after ~5 seconds, so a long task needs it refreshed. two helpers run that loop for you — on `tg` for any chat, and on an update with `chat_id` auto-filled.

`withChatAction` is the safe default: it runs your callback with the action on, stops it the moment the callback settles — even if it throws — and returns the callback's result:

```ts
tg.onMessage(async (message) => {
  const answer = await message.withChatAction('typing', () => generateReply(message.text))

  await message.reply(answer)
})

// off an update, anywhere — pass the chat id yourself:
const photo = await tg.withChatAction(chatId, 'upload_photo', () => buildPhoto())
```

for manual control, `createActionController` returns a controller you `start()` and `stop()` yourself:

```ts
const controller = message.createActionController('typing')

controller.start()

try {
  await longTask()
} finally {
  controller.stop() // don't forget this
}
```

tune the loop with `interval` (default `5000` ms), `wait` (initial delay, default `0`), and `timeout` (auto-stop after N ms; `0` disables it). any extra `sendChatAction` params pass straight through, so you can scope the action to a forum topic:

```ts
message.createActionController('typing', { interval: 4000, message_thread_id: 42 })
```

the loop also stops on its own if a `sendChatAction` call errors — chat gone, bot kicked, and so on

## see also

- [keyboards](/guide/telegram/keyboards) — attaching `reply_markup` to any message
- [formatting text](/guide/telegram/formatting-text) — `parse_mode` and entities
- [message extras](/guide/telegram/message-extras) — `ReplyParameters`, `LinkPreview`
- [methods](/api/methods) — full generated method list
