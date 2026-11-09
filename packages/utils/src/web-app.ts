import { hmac } from '@noble/hashes/hmac.js'
import { sha256 } from '@noble/hashes/sha2.js'
import { bytesToHex } from '@noble/hashes/utils.js'
import { UTF8Decoder } from '@zxing/text-encoding/cjs/coders/utf-8/UTF8Decoder.js'
import { Stream } from '@zxing/text-encoding/cjs/common/Stream.js'
import { finished } from '@zxing/text-encoding/cjs/encoding/finished.js'
import { Buffer as PortableBuffer } from 'buffer/index.js'

const ByteBuffer: typeof globalThis.Buffer | typeof PortableBuffer = globalThis.Buffer ?? PortableBuffer
const WEB_APP_DATA = ByteBuffer.from('WebAppData', 'utf8')

function decodeFormComponent (value: string) {
  const bytes = ByteBuffer.from(value.replace(/\+/g, ' '), 'utf8')
  let length = 0

  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i] === 0x25 && i + 2 < bytes.length) {
      const hex = String.fromCharCode(bytes[i + 1]!, bytes[i + 2]!)

      if (/^[\da-f]{2}$/i.test(hex)) {
        bytes[length++] = parseInt(hex, 16)
        i += 2
        continue
      }
    }

    bytes[length++] = bytes[i]!
  }

  const decoder = new UTF8Decoder({ fatal: false })
  const stream = new Stream(bytes.subarray(0, length))
  let result = ''

  for (;;) {
    const codePoint = decoder.handler(stream, stream.read())

    if (codePoint === finished) {
      return result
    }

    if (typeof codePoint === 'number') {
      result += String.fromCodePoint(codePoint)
    }
  }
}

export interface WebAppValidateParams {
  /** `initData` (not `initDataUnsafe`) received from `Telegram.WebApp.initData` */
  initData: string
  /** secret key generated via {@link WebApp.generateSecretKey}. mutually exclusive with `token` */
  key?: Uint8Array
  /** bot token; used to derive the secret key when `key` is not supplied */
  token?: string
  /** if `true`, throws on invalid initData instead of returning `false` (default `false`) */
  throwError?: boolean
}

/**
 * telegram web app initData validation helpers
 * — see https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app
 *
 * @example
 * ```ts
 * const key = WebApp.generateSecretKey(BOT_TOKEN)
 * const valid = WebApp.validate({ initData, key })
 * ```
 */
export class WebApp {
  /** derives the HMAC SHA256 secret key from a bot token. cache the result; do not regenerate per request */
  static generateSecretKey (token: string) {
    const key = ByteBuffer.alloc(sha256.outputLen)

    hmac.create(sha256, WEB_APP_DATA).update(ByteBuffer.from(token, 'utf8')).digestInto(key)

    return key
  }

  static parseInitData (initData: string) {
    const query = initData.startsWith('?') ? initData.slice(1) : initData
    const entries: [string, string][] = []

    for (const field of query.split('&')) {
      if (field.length === 0) {
        continue
      }

      const separator = field.indexOf('=')
      const name = separator === -1 ? field : field.slice(0, separator)
      const value = separator === -1 ? '' : field.slice(separator + 1)

      entries.push([decodeFormComponent(name), decodeFormComponent(value)])
    }

    return Object.fromEntries(entries)
  }

  /** computes the HMAC SHA256 hex digest of an `initData` against the given secret key */
  static generateInitDataHash (initData: string, key: Uint8Array) {
    const data = WebApp.parseInitData(initData)
    const dataCheckString = Object.keys(data)
      .filter(k => k !== 'hash')
      .sort()
      .map(k => `${k}=${data[k] ?? ''}`)
      .join('\n')

    return bytesToHex(hmac(sha256, key, ByteBuffer.from(dataCheckString, 'utf8')))
  }

  /** validates `initData` against the bot's secret key (or token). returns `true` when the hash matches */
  static validate (params: WebAppValidateParams) {
    const { initData, throwError = false } = params

    if (params.key === undefined && params.token === undefined) {
      throw new TypeError('WebApp.validate: either `key` or `token` must be provided')
    }

    const data = WebApp.parseInitData(initData)
    const hash = data.hash

    if (hash === undefined) {
      throw new TypeError('WebApp.validate: initData has no `hash` field')
    }

    const key = params.key ?? WebApp.generateSecretKey(params.token as string)
    const expected = WebApp.generateInitDataHash(initData, key)
    let mismatch = hash.length === expected.length ? 0 : 1

    for (let i = 0; i < expected.length; i++) {
      mismatch |= expected.charCodeAt(i) ^ hash.charCodeAt(i)
    }

    const valid = mismatch === 0

    if (!valid && throwError) {
      throw new Error('WebApp.validate: initData hash mismatch')
    }

    return valid
  }
}
