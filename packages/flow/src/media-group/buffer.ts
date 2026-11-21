import type { MediaGroupMessage } from '../augment/extractors'

import { CollectedMediaGroup } from './collected-media-group'

interface Bucket {
  messages: CollectedMediaGroup
  seen: Set<number>
  promise: Promise<CollectedMediaGroup>
  resolve: (messages: CollectedMediaGroup) => void
  timer: ReturnType<typeof setTimeout>
}

export class MediaGroupBuffer {
  private readonly clients = new Map<MediaGroupMessage['tg'], Map<string, Bucket>>()

  collect (id: string, message: MediaGroupMessage, window: number) {
    const { tg, raw } = message
    const key = JSON.stringify([raw.business_connection_id, raw.chat.id, id])
    let buckets = this.clients.get(tg)

    if (!buckets) {
      buckets = new Map()
      this.clients.set(tg, buckets)
    }

    let bucket = buckets.get(key)

    if (!bucket) {
      let resolveBucket!: (messages: CollectedMediaGroup) => void
      const promise = new Promise<CollectedMediaGroup>((resolve) => {
        resolveBucket = resolve
      })

      bucket = {
        messages: new CollectedMediaGroup(message),
        seen: new Set([raw.message_id]),
        promise,
        resolve: resolveBucket,
        timer: setTimeout(() => this.flush(tg, key), window)
      }

      buckets.set(key, bucket)
    } else if (!bucket.seen.has(raw.message_id)) {
      bucket.seen.add(raw.message_id)
      bucket.messages.push(message)
      clearTimeout(bucket.timer)
      bucket.timer = setTimeout(() => this.flush(tg, key), window)
    }

    return bucket.promise
  }

  flushAll () {
    for (const [tg, buckets] of this.clients) {
      for (const key of buckets.keys()) {
        this.flush(tg, key)
      }
    }
  }

  private flush (tg: MediaGroupMessage['tg'], key: string) {
    const buckets = this.clients.get(tg)
    const bucket = buckets?.get(key)

    if (!buckets || !bucket) {
      return
    }

    clearTimeout(bucket.timer)
    buckets.delete(key)

    if (buckets.size === 0) {
      this.clients.delete(tg)
    }

    bucket.resolve(bucket.messages)
  }
}
