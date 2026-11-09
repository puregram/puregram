import type { TelegramFile } from '@puregram/api'

import type { HttpClient, HttpDownloadResponse } from '../http/client'
import type { ResolvedTelegramOptions } from '../options'

import { resolveDownloadTarget, type DownloadTarget } from './download-target'

export { resolveDownloadTarget, type DownloadTarget } from './download-target'

interface DownloadDeps {
  options: ResolvedTelegramOptions
  httpClient: HttpClient
  getFile: (fileId: string) => Promise<TelegramFile>
}

/** build the public download URL — resolves `file_path` via `getFile` when the target didn't carry one */
export async function getFileURL (deps: DownloadDeps, target: DownloadTarget) {
  const resolved = resolveDownloadTarget(target)
  const filePath = resolved.filePath ?? (await deps.getFile(resolved.fileId)).file_path

  if (filePath === undefined) {
    throw new TypeError(`bot api returned no file_path for file_id "${resolved.fileId}"`)
  }

  if (deps.options.useLocal) {
    // local bot-api server returns absolute on-disk paths in `file_path`
    return filePath
  }

  // strip trailing `/bot` from `apiBaseUrl` and rebuild as the file endpoint
  const base = deps.options.apiBaseUrl.replace(/\/bot$/, '')

  return `${base}/file/bot${deps.options.token}/${filePath}`
}

async function fetchBody (deps: DownloadDeps, url: string) {
  const client = deps.httpClient
  const fn = client.download?.bind(client) ?? defaultDownload

  return fn(url)
}

async function defaultDownload (url: string) {
  const response = await fetch(url)

  return { status: response.status, body: response.body }
}

function ensureBody (response: HttpDownloadResponse, url: string) {
  if (response.status >= 400) {
    throw new Error(`download failed: GET ${url} → ${response.status}`)
  }

  if (response.body === null) {
    throw new Error(`download failed: GET ${url} → empty body`)
  }

  return response.body
}

/** download into a `Buffer` (most common case) */
export async function download (deps: DownloadDeps, target: DownloadTarget) {
  const url = await getFileURL(deps, target)

  if (deps.options.useLocal) {
    const { readFile } = await import('node:fs/promises')

    return readFile(url)
  }

  const response = await fetchBody(deps, url)
  const body = ensureBody(response, url)
  const chunks: Uint8Array[] = []

  for await (const chunk of body as AsyncIterable<Uint8Array>) {
    chunks.push(chunk)
  }

  return Buffer.concat(chunks)
}

/** download as a node `Readable` stream */
export async function downloadStream (deps: DownloadDeps, target: DownloadTarget) {
  const url = await getFileURL(deps, target)

  if (deps.options.useLocal) {
    const { createReadStream } = await import('node:fs')

    return createReadStream(url)
  }

  const response = await fetchBody(deps, url)
  const body = ensureBody(response, url)
  const stream = await import('node:stream')

  return stream.Readable.fromWeb(body as never)
}

/** download as an async-iterable byte stream (zero buffering) */
export async function downloadIterable (deps: DownloadDeps, target: DownloadTarget) {
  const stream = await downloadStream(deps, target)

  return stream as AsyncIterable<Uint8Array>
}

/** download and write straight to disk */
export async function downloadToFile (deps: DownloadDeps, path: string, target: DownloadTarget) {
  const stream = await downloadStream(deps, target)
  const { createWriteStream } = await import('node:fs')
  const { pipeline } = await import('node:stream/promises')

  await pipeline(stream, createWriteStream(path))
}
