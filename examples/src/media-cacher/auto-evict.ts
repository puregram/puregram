import { mediaCacher } from '@puregram/media-cacher'
import { Telegram, MediaSource } from 'puregram'

const PHOTO = 'https://placehold.co/600x400.png'

// media-cacher remembers the file_id telegram returns the first time a path/url is
// uploaded, then reuses it — repeated sends of the same source skip the upload
const telegram = Telegram
  .fromToken(process.env.TOKEN!)
  .extend(mediaCacher())

telegram.onMessage(async (message) => {
  // first send uploads the bytes; every send after is a cache hit (no upload)
  await message.sendPhoto(MediaSource.url(PHOTO))
})

// if telegram later rejects a cached file_id as stale, media-cacher drops the entry
// and retries the upload once — transparent to your handler. you can also evict by
// hand through the `tg.mediaCacher` handle
telegram.command('flush', async (message) => {
  await telegram.mediaCacher.invalidate('sendPhoto', String(message.chatId), PHOTO)

  await message.send('cache entry dropped — next send re-uploads')
})

await telegram.startPolling()
