import type { InspectOptionsStylized } from 'node:util'

import { INSPECT, makeInspect } from '../generated/inspect'
import { PhotoSize } from '../generated/structures'
import type { TelegramPhotoSize } from '../generated/types'

type InspectFn = (value: unknown, options: InspectOptionsStylized) => string

/**
 * a photo at multiple sizes
 *
 * wraps the `PhotoSize[]` payload as a single ergonomic object exposing the largest /
 * smallest / minimum-width size without the `at(-1)!` dance. iterating yields
 * `PhotoSize` wrappers in payload order
 */
export class Photo {
  readonly attachmentType = 'photo'
  raw: TelegramPhotoSize[]
  // memo-cache convention shared with codegen'd structures
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private _sizes?: PhotoSize[]

  constructor (raw: TelegramPhotoSize[]) {
    this.raw = raw
  }

  /** lazily-wrapped `PhotoSize` instances for every available size */
  get sizes () {
    this._sizes ??= this.raw.map(x => new PhotoSize(x))

    return this._sizes
  }

  /** number of available sizes */
  get length () {
    return this.raw.length
  }

  /** largest size by file_size, falling back to width × height */
  get biggest () {
    return this.sizes.reduce((acc, cur) => (sizeKey(cur.raw) > sizeKey(acc.raw) ? cur : acc))
  }

  /** smallest size by file_size, falling back to width × height */
  get smallest () {
    return this.sizes.reduce((acc, cur) => (sizeKey(cur.raw) < sizeKey(acc.raw) ? cur : acc))
  }

  /** wrap a raw `PhotoSize[]` payload in a `Photo` */
  static fromPayload (raw: TelegramPhotoSize[]) {
    return new Photo(raw)
  }

  /** smallest size with width ≥ minWidth, falling back to `biggest` if none qualify */
  byMin (minWidth: number) {
    let match: PhotoSize | undefined

    for (const size of this.sizes) {
      if (size.width < minWidth) {
        continue
      }

      if (match === undefined || size.width < match.width) {
        match = size
      }
    }

    return match ?? this.biggest
  }

  [Symbol.iterator] () {
    return this.sizes[Symbol.iterator]()
  }

  [INSPECT] (depth: number, options: InspectOptionsStylized, inspect: InspectFn) {
    return makeInspect('Photo', this, depth, options, inspect)
  }
}

function sizeKey (raw: TelegramPhotoSize) {
  return raw.file_size ?? raw.width * raw.height
}
