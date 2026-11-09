import { sha256 } from '@noble/hashes/sha2.js'
import { bytesToHex } from '@noble/hashes/utils.js'
import { type MediaInput, MediaSourceType } from 'puregram/runtime'

export interface HashFetchResponse {
  ok: boolean
  status: number
  body: AsyncIterable<Uint8Array> | null
}

export type HashFetch = (url: string) => Promise<HashFetchResponse>

function toBytes (bytes: ArrayBufferView | ArrayBufferLike) {
  if (bytes instanceof Uint8Array) {
    return bytes
  }

  return ArrayBuffer.isView(bytes)
    ? new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    : new Uint8Array(bytes)
}

/** sha-256 of arbitrary bytes as lowercase hex */
export function hashBytes (bytes: ArrayBufferView | ArrayBufferLike) {
  return bytesToHex(sha256(toBytes(bytes)))
}

/** computes a sha-256 hex digest of the bytes a `MediaInput` resolves to */
export async function hashMediaInput (media: MediaInput, fetchImpl?: HashFetch) {
  if (media.type === MediaSourceType.Buffer || media.type === MediaSourceType.ArrayBuffer) {
    return hashBytes(media.value)
  }

  if (media.type === MediaSourceType.Path) {
    // node:fs is absent on serverless runtimes
    const { readFile } = await import('node:fs/promises')

    return hashBytes(await readFile(media.value))
  }

  if (media.type === MediaSourceType.Url) {
    // the DOM lib types Response.body without the async iterator node provides
    const request = fetchImpl ?? (globalThis.fetch as HashFetch | undefined)

    if (request === undefined) {
      throw new TypeError('mediaCacher: no global fetch to hash url sources — pass `fetch` to mediaCacher()')
    }

    const res = await request(media.value)

    if (!res.ok || res.body === null) {
      throw new Error(`mediaCacher: hash fetch failed for ${media.value} (status ${res.status})`)
    }

    const hasher = sha256.create()

    for await (const chunk of res.body) {
      hasher.update(chunk)
    }

    return bytesToHex(hasher.digest())
  }

  // streams and File are intentionally not supported: they're not deterministically replayable
  throw new TypeError(`mediaCacher: cannot hash MediaSource of type "${media.type}" — use Buffer/Path/Url/ArrayBuffer`)
}
