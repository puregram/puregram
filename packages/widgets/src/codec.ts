import { WidgetStateTooLargeError } from './errors'
import { utf8Length, WIDGET_LIMITS } from './limits'

export interface StateCodec<T> {
  encode: (value: T | null | undefined) => string
  decode: (data: string | null | undefined) => T | null
}

export function codec<T> (serialize: (value: T) => string, parse: (data: string) => T) {
  const stateCodec: StateCodec<T> = {
    encode: (value) => {
      if (value === null || value === undefined) {
        return ''
      }

      const data = serialize(value)

      if (typeof data !== 'string' || data.includes('\0')) {
        throw new TypeError('widget state must serialize to a string without NUL characters')
      }

      const bytes = utf8Length(data)

      if (bytes > WIDGET_LIMITS.stateBytes) {
        throw new WidgetStateTooLargeError(bytes, WIDGET_LIMITS.stateBytes)
      }

      return data
    },
    decode: data => data === null || data === undefined || data === '' ? null : parse(data)
  }

  return stateCodec
}

export const json = <T>() => codec<T>(value => JSON.stringify(value), data => JSON.parse(data) as T)

export const text = () => codec<string>(value => value, data => data)
