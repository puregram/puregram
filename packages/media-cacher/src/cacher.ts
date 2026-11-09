import { type KVStorage, MemoryStorage } from '@puregram/storage'
import {
  createPlugin, type MediaInput, MediaSource, MediaSourceType, type RequestContext, type TelegramCore
} from 'puregram/runtime'

import { type HashFetch, hashMediaInput } from './hash'
import { type AllowedMediaMethod, MEDIA_METHOD_TO_KEY_MAP } from './method-map'

type GetStorageKey = (ctx: RequestContext) => string | undefined

const defaultGetStorageKey = (ctx: RequestContext) => {
  const params = ctx.params
  const ephemeral = params?.ephemeral_message_parameters as
    { receiver_user_id?: number, callback_query_id?: string } | undefined

  if (ephemeral?.callback_query_id !== undefined && ephemeral.receiver_user_id === undefined) {
    return undefined
  }

  const chatId = params?.chat_id

  return chatId === undefined ? undefined : String(chatId)
}

/** strategy for deriving the second half of the cache key */
export type KeyStrategy = 'sourceValue' | 'hash'

export interface MediaCacherOptions {
  /** override the storage key derivation. default: `String(ctx.params.chat_id)` */
  getStorageKey?: GetStorageKey
  /** backing store. default: `MemoryStorage<string>` from `@puregram/storage` */
  storage?: KVStorage<string>
  /**
   * how the second half of the cache key is derived
   *
   * - `'sourceValue'` (default): the raw string the `MediaSource` carries (path/url)
   * - `'hash'`: sha-256 of the bytes the source resolves to — collapses distinct paths/urls
   *   that point at identical content to one entry, and also caches `MediaSource.bytes`/`.buffer`
   *   uploads. note that url-keyed-by-hash uploads fetch the source twice (once for the digest,
   *   once for the actual upload)
   */
  keyStrategy?: KeyStrategy
  /**
   * which descriptions trigger auto-evict + one retry. case-insensitive substring match
   * against `description`. defaults cover the known stale-file-id paths
   */
  staleFileIdPatterns?: readonly string[]
  /** fetch used to hash url sources with `keyStrategy: 'hash'`. default: global `fetch` */
  fetch?: HashFetch
}

/** handle attached as `tg.mediaCacher` for manual cache inspection and eviction */
export interface MediaCacherExtension {
  /** look up the cached `file_id` for `(storageKey, sourceValue)`, or undefined if absent */
  get: (storageKey: string, sourceValue: string) => Promise<string | undefined>
  /** drop the cache entry for `(storageKey, sourceValue)` */
  invalidate: (storageKey: string, sourceValue: string) => Promise<void>
  /** the configured `KVStorage<string>` instance */
  storage: KVStorage<string>
}

interface PendingMark {
  cacheKey: string
  responseKey: string
  /** stored when the request originated from a cache hit — lets the retry path restore the source */
  hit?: { originalMedia: MediaInput, mediaKey: string, fileId: string }
}

/** default substrings that flag a "the cached file_id is no longer valid" 400 */
const DEFAULT_STALE_PATTERNS: readonly string[] = [
  'wrong file identifier/http url specified',
  'wrong file_id',
  'file is temporarily unavailable'
]

type ApiCallable = (params: Record<string, unknown>) => Promise<unknown>

interface ReuploadOutcome {
  fileId: string | undefined
  result: unknown
}

// eslint-disable-next-line local-rules/no-redundant-return-type -- type predicate is needed for narrowing
function isMediaInput (value: unknown): value is MediaInput {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const v = value as { type?: unknown, value?: unknown }

  return typeof v.type === 'string' && v.value !== undefined
}

function pickFileId (mediaKey: string, result: Record<string, unknown>) {
  // animation comes back under `document` instead of `animation`
  let key = mediaKey

  if (mediaKey === 'animation' && !(mediaKey in result) && 'document' in result) {
    key = 'document'
  }

  const slot = result[key]

  // photos return an array of size variants — telegram convention picks largest (last)
  if (Array.isArray(slot)) {
    const last = slot[slot.length - 1] as { file_id?: unknown } | undefined

    return typeof last?.file_id === 'string' ? last.file_id : undefined
  }

  if (slot !== null && typeof slot === 'object') {
    const fileId = (slot as { file_id?: unknown }).file_id

    return typeof fileId === 'string' ? fileId : undefined
  }

  return undefined
}

function matchesStalePattern (description: string, patterns: readonly string[]) {
  const lower = description.toLowerCase()

  for (const p of patterns) {
    if (lower.includes(p.toLowerCase())) {
      return true
    }
  }

  return false
}

function filenameOptsFor (media: MediaInput) {
  return media.filename !== undefined ? { filename: media.filename } : {}
}

/** transparent file_id caching plugin. on cache hit, swaps cacheable media for `MediaSource.fileId` */
export function mediaCacher (options: MediaCacherOptions = {}) {
  const storage = options.storage ?? new MemoryStorage<string>()
  const getStorageKey = options.getStorageKey ?? defaultGetStorageKey
  const keyStrategy: KeyStrategy = options.keyStrategy ?? 'sourceValue'
  const stalePatterns = options.staleFileIdPatterns ?? DEFAULT_STALE_PATTERNS
  const pending = new WeakMap<RequestContext, PendingMark>()
  // per-cacheKey mutex coalescing concurrent re-uploads of the same stale entry
  const inFlightReupload = new Map<string, Promise<string | undefined>>()
  // guarantees "at most once" retry per params object
  const retried = new WeakSet<Record<string, unknown>>()

  const cacheableTypes = new Set<MediaSourceType>(keyStrategy === 'hash'
    ? [MediaSourceType.Path, MediaSourceType.Url, MediaSourceType.Buffer, MediaSourceType.ArrayBuffer]
    : [MediaSourceType.Path, MediaSourceType.Url])

  const deriveSecondHalf = async (media: MediaInput) => {
    if (keyStrategy === 'hash') {
      return hashMediaInput(media, options.fetch)
    }

    return typeof media.value === 'string' ? media.value : undefined
  }

  return createPlugin({
    name: 'mediaCacher',
    install: (tg: TelegramCore) => {
      tg.useHook('onBeforeRequest', async (raw, next) => {
        const ctx = raw

        if (!(ctx.method in MEDIA_METHOD_TO_KEY_MAP)) {
          await next()

          return
        }

        const mediaKey = MEDIA_METHOD_TO_KEY_MAP[ctx.method as AllowedMediaMethod]
        const params = ctx.params

        if (params === undefined) {
          await next()

          return
        }

        const media = params[mediaKey]

        if (!isMediaInput(media)) {
          throw new TypeError(`mediaCacher: ${ctx.method}.${mediaKey} must be created via MediaSource.*`)
        }

        if (!cacheableTypes.has(media.type)) {
          await next()

          return
        }

        const storageKey = getStorageKey(ctx)

        if (storageKey === undefined) {
          await next()

          return
        }

        const secondHalf = await deriveSecondHalf(media)

        if (secondHalf === undefined) {
          await next()

          return
        }

        const cacheKey = `${storageKey}:${secondHalf}`
        const cached = await storage.get(cacheKey)

        if (cached !== undefined) {
          // remember original input so the retry path can restore it after eviction
          pending.set(ctx, {
            cacheKey,
            responseKey: mediaKey,
            hit: { originalMedia: media, mediaKey, fileId: cached }
          })

          params[mediaKey] = MediaSource.fileId(cached, filenameOptsFor(media))
          await next()

          return
        }

        pending.set(ctx, { cacheKey, responseKey: mediaKey })
        await next()
      }, { priority: 'high' })

      tg.useHook('onResponseIntercept', async (raw, next) => {
        const ctx = raw
        const mark = pending.get(ctx)

        if (mark === undefined) {
          await next()

          return
        }

        pending.delete(ctx)

        const json = ctx.json as
          | { ok: true, result: unknown }
          | { ok: false, error_code: number, description: string }
          | undefined

        if (json === undefined) {
          await next()

          return
        }

        // persist the file_id only on cache miss — overwriting on hit churns the
        // entry every successful send and wipes test seed/fixture values
        if (json.ok === true) {
          if (mark.hit === undefined && typeof json.result === 'object' && json.result !== null) {
            const fileId = pickFileId(mark.responseKey, json.result as Record<string, unknown>)

            if (fileId !== undefined) {
              await storage.set(mark.cacheKey, fileId)
            }
          }

          await next()

          return
        }

        // only intervene when this request used a cached file_id and the description
        // matches a stale-id pattern — one retry per request, refreshes cache,
        // mutates ctx.json so the lifecycle sees success
        const params = ctx.params

        if (
          mark.hit === undefined ||
          params === undefined ||
          retried.has(params) ||
          typeof json.description !== 'string' ||
          !matchesStalePattern(json.description, stalePatterns)
        ) {
          await next()

          return
        }

        retried.add(params)

        const hit = mark.hit
        // sync check-and-set: claim leadership before any await so concurrent failures become followers
        const existing = inFlightReupload.get(mark.cacheKey)
        const isLeader = existing === undefined
        let leaderOutcome: Promise<ReuploadOutcome> | undefined

        if (isLeader) {
          leaderOutcome = (async () => {
            const stored = await storage.get(mark.cacheKey)

            if (stored === hit.fileId) {
              await storage.delete(mark.cacheKey)
            }

            return doReupload(tg, ctx.method, params, hit.mediaKey, hit.originalMedia)
          })()

          inFlightReupload.set(
            mark.cacheKey,
            leaderOutcome
              .then(o => o.fileId, () => undefined)
              .finally(() => {
                inFlightReupload.delete(mark.cacheKey)
              })
          )
        }

        try {
          let retryResult: unknown

          if (isLeader && leaderOutcome !== undefined) {
            const outcome = await leaderOutcome

            retryResult = outcome.result
          } else if (existing !== undefined) {
            // follower waits for the leader's fresh file_id, then sends without re-uploading
            const newFileId = await existing

            if (newFileId === undefined) {
              await next()

              return
            }

            retryResult = await sendWithFileId(
              tg, ctx.method, params, hit.mediaKey, newFileId, hit.originalMedia.filename
            )
          }

          if (typeof retryResult !== 'object' || retryResult === null) {
            await next()

            return
          }

          ctx.json = { ok: true, result: retryResult }

          if (ctx.response !== undefined) {
            ctx.response = { status: 200 }
          }
        } catch {
          // retry failed — leave the original error in place for the lifecycle
        }

        await next()
      })

      const ext: MediaCacherExtension = {
        get: (storageKey, sourceValue) => storage.get(`${storageKey}:${sourceValue}`),
        invalidate: (storageKey, sourceValue) => storage.delete(`${storageKey}:${sourceValue}`),
        storage
      }

      return ext
    }
  })
}

function resolveApi (tg: TelegramCore) {
  return (tg as unknown as { api: Record<string, ApiCallable | undefined> }).api
}

async function doReupload (
  tg: TelegramCore,
  method: string,
  originalParams: Record<string, unknown>,
  mediaKey: string,
  originalMedia: MediaInput
) {
  // re-issue through the public api so the cache hook records a fresh file_id
  const retryParams = { ...originalParams, [mediaKey]: originalMedia }
  const callable = resolveApi(tg)[method]

  if (callable === undefined) {
    return { fileId: undefined, result: undefined }
  }

  const result = await callable(retryParams)

  if (typeof result !== 'object' || result === null) {
    return { fileId: undefined, result }
  }

  return { fileId: pickFileId(mediaKey, result as Record<string, unknown>), result }
}

async function sendWithFileId (
  tg: TelegramCore,
  method: string,
  originalParams: Record<string, unknown>,
  mediaKey: string,
  fileId: string,
  filename: string | undefined
) {
  const opts = filename !== undefined ? { filename } : {}
  const retryParams = { ...originalParams, [mediaKey]: MediaSource.fileId(fileId, opts) }
  const callable = resolveApi(tg)[method]

  if (callable === undefined) {
    return undefined
  }

  return callable(retryParams)
}
