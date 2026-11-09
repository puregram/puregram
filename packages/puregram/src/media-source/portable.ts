import type { Readable } from 'node:stream'

import type { File } from 'formdata-node'

/** discriminator for `MediaInput` envelopes */
export enum MediaSourceType {
  Path = 'path',
  Url = 'url',
  FileId = 'file_id',
  Buffer = 'buffer',
  Stream = 'stream',
  File = 'file',
  ArrayBuffer = 'array_buffer',
  Local = 'local'
}

/** options shared by every `MediaSource.X(...)` factory */
export interface MediaInputOptions {
  filename?: string
}

/** url-only options — `forceUpload` makes puregram fetch the url and upload its bytes directly */
export interface MediaInputUrlOptions {
  forceUpload?: boolean
}

interface Base extends MediaInputOptions {
  type: MediaSourceType
}

/** local-file upload envelope */
export interface MediaSourcePath extends Base {
  type: MediaSourceType.Path
  value: string
}
/** url upload envelope (telegram fetches it, unless `forceUpload` is set) */
export interface MediaSourceUrl extends Base, MediaInputUrlOptions {
  type: MediaSourceType.Url
  value: string
}
/** existing-on-server reference envelope */
export interface MediaSourceFileId extends Base {
  type: MediaSourceType.FileId
  value: string
}
/** in-memory bytes envelope */
export interface MediaSourceBuffer extends Base {
  type: MediaSourceType.Buffer
  value: Buffer
}
/** stream upload envelope */
export interface MediaSourceStream extends Base {
  type: MediaSourceType.Stream
  value: Readable
}
/** WHATWG `File` envelope */
export interface MediaSourceFile extends Base {
  type: MediaSourceType.File
  value: File
}
/** raw `ArrayBuffer` envelope */
export interface MediaSourceArrayBuffer extends Base {
  type: MediaSourceType.ArrayBuffer
  value: ArrayBufferLike | ArrayBufferView
}
/** local-server on-disk reference envelope — the server reads the path itself, no upload */
export interface MediaSourceLocal extends Base {
  type: MediaSourceType.Local
  value: string
}

/** discriminated union of every `MediaSource.X(...)` return value */
export type MediaInput =
  | MediaSourcePath | MediaSourceUrl | MediaSourceFileId
  | MediaSourceBuffer | MediaSourceStream | MediaSourceFile | MediaSourceArrayBuffer
  | MediaSourceLocal

function typeError (field: string, expected: string, value: unknown) {
  return new TypeError(`expected '${field}' to be ${expected}, found ${typeof value}`)
}

export class PortableMediaSource {
  /**
   * upload a local file by absolute or relative path
   *
   * @example
   * ```ts
   * update.sendPhoto(MediaSource.path('./cat.png'))
   * ```
   */
  static path (path: string, opts: MediaInputOptions = {}): MediaSourcePath {
    if (typeof path !== 'string') {
      throw typeError('path', 'string', path)
    }

    return { type: MediaSourceType.Path, value: path, ...opts }
  }

  /**
   * reference a file the *local bot api server* reads directly off disk, skipping
   * the multipart upload entirely. requires `useLocal: true` and a filesystem the
   * server can see (same host/container). prefer an absolute path; relative paths
   * resolve against the bot process cwd. resolved to a `file://` uri at request time
   *
   * @example
   * ```ts
   * // tg built with { useLocal: true, apiBaseUrl: 'http://localhost:8081/bot' }
   * update.sendVideo(MediaSource.local('/srv/media/clip.mp4'))
   * ```
   */
  static local (path: string, opts: MediaInputOptions = {}) {
    if (typeof path !== 'string') {
      throw typeError('path', 'string', path)
    }

    return { type: MediaSourceType.Local, value: path, ...opts }
  }

  /**
   * upload from a url. by default telegram fetches the url itself, which only
   * works for gif/pdf/zip on `sendDocument`. set `forceUpload: true` to make
   * puregram fetch the bytes and upload them as multipart instead
   *
   * @example
   * ```ts
   * update.sendDocument(MediaSource.url(catUrl), { forceUpload: true, filename: 'cat.png' })
   * ```
   */
  static url (url: string, opts: MediaInputOptions & MediaInputUrlOptions = {}): MediaSourceUrl {
    if (typeof url !== 'string') {
      throw typeError('url', 'string', url)
    }

    return { type: MediaSourceType.Url, value: url, ...opts }
  }

  /**
   * reference an already-uploaded file by `file_id`
   *
   * @example
   * ```ts
   * update.sendPhoto(MediaSource.fileId(savedFileId))
   * ```
   */
  static fileId (id: string, opts: MediaInputOptions = {}): MediaSourceFileId {
    if (typeof id !== 'string') {
      throw typeError('fileId', 'string', id)
    }

    return { type: MediaSourceType.FileId, value: id, ...opts }
  }

  /**
   * upload from an `ArrayBuffer`/`SharedArrayBuffer`
   *
   * @example
   * ```ts
   * const ab = await response.arrayBuffer()
   * update.sendPhoto(MediaSource.arrayBuffer(ab))
   * ```
   */
  static arrayBuffer (buffer: ArrayBufferLike, opts: MediaInputOptions = {}) {
    if (!(buffer instanceof ArrayBuffer) && !(typeof SharedArrayBuffer !== 'undefined' && buffer instanceof SharedArrayBuffer)) {
      throw typeError('buffer', 'ArrayBuffer or SharedArrayBuffer', buffer)
    }

    return { type: MediaSourceType.ArrayBuffer, value: buffer, ...opts }
  }

  static bytes (view: ArrayBufferView, opts: MediaInputOptions = {}) {
    if (!ArrayBuffer.isView(view)) {
      throw typeError('view', 'ArrayBufferView', view)
    }

    return { type: MediaSourceType.ArrayBuffer, value: view, ...opts }
  }
}

/** narrowing predicate for "is this a `MediaSource.X(...)` envelope" */
// eslint-disable-next-line local-rules/no-redundant-return-type -- type predicate is needed for narrowing
export function isMediaInput (value: unknown): value is MediaInput {
  return typeof value === 'object' && value !== null && 'type' in value &&
    Object.values(MediaSourceType).includes((value as { type: MediaSourceType }).type)
}
