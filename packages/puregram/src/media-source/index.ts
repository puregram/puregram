import { Readable } from 'node:stream'

import { File } from 'formdata-node'

import { PortableMediaSource, MediaSourceType } from './portable'
import type { MediaInputOptions, MediaSourceBuffer, MediaSourceStream, MediaSourceFile } from './portable'

export * from './portable'

function typeError (field: string, expected: string, value: unknown) {
  return new TypeError(`expected '${field}' to be ${expected}, found ${typeof value}`)
}

export class MediaSource extends PortableMediaSource {
  /**
   * upload an in-memory buffer
   *
   * @example
   * ```ts
   * update.sendMediaGroup(buffers.map(b => InputMedia.photo({ media: MediaSource.buffer(b) })))
   * ```
   */
  static buffer (buffer: Buffer, opts: MediaInputOptions = {}): MediaSourceBuffer {
    if (!Buffer.isBuffer(buffer)) {
      throw typeError('buffer', 'Buffer', buffer)
    }

    return { type: MediaSourceType.Buffer, value: buffer, ...opts }
  }

  /**
   * upload from a node `Readable` stream
   *
   * @example
   * ```ts
   * update.sendDocument(MediaSource.stream(createReadStream('./big-file.bin')))
   * ```
   */
  static stream (stream: Readable, opts: MediaInputOptions = {}): MediaSourceStream {
    if (!(stream instanceof Readable)) {
      throw typeError('stream', 'Readable', stream)
    }

    return { type: MediaSourceType.Stream, value: stream, ...opts }
  }

  /**
   * upload a WHATWG `File`
   *
   * @example
   * ```ts
   * const ab = await response.arrayBuffer()
   * update.sendDocument(MediaSource.file(new File([ab], 'cat.png')))
   * ```
   */
  static file (file: File, opts: MediaInputOptions = {}): MediaSourceFile {
    if (!(file instanceof File)) {
      throw typeError('file', 'File', file)
    }

    return { type: MediaSourceType.File, value: file, ...opts }
  }

  /**
   * upload from any `ArrayBufferView` (`Uint8Array`, other typed arrays, `DataView`).
   * convenient for bytes coming back from web apis where you'd otherwise wrap the
   * value with `Buffer.from(...)` yourself
   *
   * @example
   * ```ts
   * const bytes = new Uint8Array(await response.arrayBuffer())
   * update.sendDocument(MediaSource.bytes(bytes, { filename: 'cat.png' }))
   * ```
   */
  static bytes (view: ArrayBufferView, opts: MediaInputOptions = {}) {
    if (!ArrayBuffer.isView(view)) {
      throw typeError('view', 'ArrayBufferView', view)
    }

    return MediaSource.buffer(Buffer.from(view.buffer, view.byteOffset, view.byteLength), opts)
  }

  /**
   * upload from a base64 string. internally decoded to a `Buffer` since the bot
   * api has no native base64 upload form
   *
   * @example
   * ```ts
   * update.sendDocument(MediaSource.base64(await getBase64()))
   * ```
   */
  static base64 (b64: string, opts: MediaInputOptions = {}): MediaSourceBuffer {
    if (typeof b64 !== 'string') {
      throw typeError('b64', 'string', b64)
    }

    return MediaSource.buffer(Buffer.from(b64, 'base64'), opts)
  }

  /**
   * upload a utf-8 string as a file. shortcut for `MediaSource.buffer(Buffer.from(text))`
   *
   * @example
   * ```ts
   * update.sendDocument(MediaSource.text('hello world', { filename: 'note.txt' }))
   * ```
   */
  static text (text: string, opts: MediaInputOptions = {}): MediaSourceBuffer {
    if (typeof text !== 'string') {
      throw typeError('text', 'string', text)
    }

    return MediaSource.buffer(Buffer.from(text, 'utf8'), opts)
  }

  /**
   * upload a value serialized as json. accepts an optional `space` for pretty-printing,
   * mirroring `JSON.stringify`'s third argument
   *
   * @example
   * ```ts
   * update.sendDocument(MediaSource.json({ ok: true }, { filename: 'state.json', space: 2 }))
   * ```
   */
  static json (value: unknown, opts: MediaInputOptions & { space?: number | string } = {}) {
    const { space, ...rest } = opts

    return MediaSource.buffer(Buffer.from(JSON.stringify(value, null, space), 'utf8'), rest)
  }
}
