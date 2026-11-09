import { fetch, InputFile } from 'sdk'

import { isMediaInput, MediaSourceType } from 'puregram/runtime'
import type { MediaInput } from 'puregram/runtime'

function bytes (value: ArrayBufferLike | ArrayBufferView) {
  return ArrayBuffer.isView(value)
    ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength)
    : new Uint8Array(value)
}

async function download (url: string, filename: string) {
  if (!/^https?:\/\//i.test(url)) {
    throw new TypeError(`'${url}' is not a valid URL`)
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new TypeError(`MediaSource.url download of '${url}' failed with HTTP ${response.status}`)
  }

  const chunks: Uint8Array[] = []
  let size = 0

  for await (const chunk of response.body) {
    chunks.push(chunk)
    size += chunk.byteLength
  }

  const contents = new Uint8Array(size)
  let offset = 0

  for (const chunk of chunks) {
    contents.set(chunk, offset)
    offset += chunk.byteLength
  }

  const type = response.headers.get('content-type')

  return new InputFile(contents, filename, type === null ? undefined : { type })
}

async function resolveMedia (input: MediaInput) {
  switch (input.type) {
    case MediaSourceType.FileId:
      return input.value
    case MediaSourceType.Url:
      return input.forceUpload ? download(input.value, input.filename ?? 'file.dat') : input.value
    case MediaSourceType.Buffer:
    case MediaSourceType.ArrayBuffer:
      return new InputFile(bytes(input.value), input.filename ?? 'file.dat')
    case MediaSourceType.File:
      return new InputFile(
        new Uint8Array(await input.value.arrayBuffer()), input.filename ?? input.value.name,
        { type: input.value.type }
      )
    case MediaSourceType.Path:
    case MediaSourceType.Local:
    case MediaSourceType.Stream:
      throw new TypeError(`MediaSource.${input.type} is unavailable in Telegram Serverless; supply bytes, a file_id, or a URL instead`)
  }
}

export async function normalizeParams (params: Record<string, unknown> | undefined) {
  return await walk(params, new WeakSet()) as Record<string, unknown> | undefined
}

async function walk (value: unknown, path: WeakSet<object>): Promise<unknown> {
  if (typeof value !== 'object' || value === null || value instanceof InputFile || ArrayBuffer.isView(value)) {
    return value
  }

  if ('value' in value && isMediaInput(value)) {
    return resolveMedia(value)
  }

  if ('pipe' in value && typeof value.pipe === 'function') {
    throw new TypeError('Node streams are unavailable in Telegram Serverless; supply bytes instead')
  }

  if (path.has(value)) {
    throw new TypeError('Bot API parameters contain a circular reference')
  }

  path.add(value)

  try {
    if ('toInputRichMessage' in value && typeof value.toInputRichMessage === 'function') {
      return await walk(value.toInputRichMessage(), path)
    }

    if ('toJSON' in value && typeof value.toJSON === 'function') {
      return await walk(value.toJSON(), path)
    }

    if (Array.isArray(value)) {
      const items: unknown[] = value
      let result: unknown[] | undefined

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const normalized = await walk(item, path)

        if (normalized !== item) {
          result ??= items.slice()
          result[i] = normalized
        }
      }

      return result ?? items
    }

    const record = value as Record<string, unknown>
    let result: Record<string, unknown> | undefined

    for (const key of Object.keys(record)) {
      const item = record[key]
      const normalized = await walk(item, path)

      if (normalized !== item) {
        result ??= { ...record }
        result[key] = normalized
      }
    }

    return result ?? value
  } finally {
    path.delete(value)
  }
}
