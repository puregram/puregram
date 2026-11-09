import { Photo } from '@puregram/api'
import type { TelegramPhotoSize } from '@puregram/api'

import type { MediaSourceFileId } from '../media-source/portable'
import { MediaSourceType } from '../media-source/portable'

/**
 * any value resolvable to a telegram file URL — raw `file_id`, `MediaSource.fileId(...)`,
 * any wrapper with `fileId`, any payload with `file_id`, or `Photo` / `TelegramPhotoSize[]`
 * (largest auto-picked). other `MediaSource.X(...)` upload variants throw `TypeError`
 */
export type DownloadTarget =
  | string
  | MediaSourceFileId
  | { file_id: string, file_path?: string | undefined }
  | { fileId: string, filePath?: string | undefined }
  | Photo
  | TelegramPhotoSize[]

interface ResolvedTarget {
  fileId: string
  filePath?: string
}

const UPLOAD_ONLY_VARIANTS = new Set<string>([
  MediaSourceType.Path,
  MediaSourceType.Url,
  MediaSourceType.Buffer,
  MediaSourceType.Stream,
  MediaSourceType.File,
  MediaSourceType.ArrayBuffer
])

function pickLargest (sizes: readonly TelegramPhotoSize[]) {
  if (sizes.length === 0) {
    throw new TypeError('cannot download from an empty photo size array')
  }

  return sizes.reduce((acc, cur) => (sizeKey(cur) > sizeKey(acc) ? cur : acc))
}

function sizeKey (raw: TelegramPhotoSize) {
  return raw.file_size ?? raw.width * raw.height
}

/** resolve any supported target shape into `{fileId, filePath?}` */
export function resolveDownloadTarget (target: DownloadTarget): ResolvedTarget {
  if (typeof target === 'string') {
    return { fileId: target }
  }

  if (Array.isArray(target)) {
    return resolveDownloadTarget(pickLargest(target))
  }

  if (target instanceof Photo) {
    return resolveDownloadTarget(target.biggest.raw)
  }

  // only the fileId variant is downloadable; upload-only variants throw
  const envelope = readEnvelope(target)

  if (envelope !== undefined) {
    if (envelope.type === String(MediaSourceType.FileId)) {
      return { fileId: String(envelope.value) }
    }

    throw new TypeError(
      `cannot download from a "${envelope.type}" media source — that variant is for uploads`
    )
  }

  // duck-type both wrapper (camelCase) and raw payload (snake_case) shapes
  const fileId = (target as { fileId?: unknown }).fileId ??
    (target as { file_id?: unknown }).file_id
  const filePath = (target as { filePath?: unknown }).filePath ??
    (target as { file_path?: unknown }).file_path

  if (typeof fileId !== 'string') {
    throw new TypeError('download target has no file_id')
  }

  return typeof filePath === 'string' ? { fileId, filePath } : { fileId }
}

function readEnvelope (value: unknown) {
  if (typeof value !== 'object' || value === null) {
    return undefined
  }

  const type = (value as { type?: unknown }).type

  if (typeof type !== 'string') {
    return undefined
  }

  if (type !== String(MediaSourceType.FileId) && !UPLOAD_ONLY_VARIANTS.has(type)) {
    return undefined
  }

  return { type, value: (value as { value?: unknown }).value }
}
