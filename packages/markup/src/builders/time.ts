import { type Entity, Formatted } from '../formatted'

import { makeWrap, type WrapFn } from './wrap'

/** named-flag form for the telegram date_time format string `r|w?[dD]?[tT]?` */
export interface TimeFormat {
  /** displays the time relative to the current time. cannot combine with any other flag */
  relative?: boolean
  /** displays the day of the week in the user's localized language */
  weekday?: boolean
  /** displays the date in short (`'short'`, e.g. "17.03.22") or long (`'long'`, e.g. "March 17, 2022") form */
  dateStyle?: 'short' | 'long'
  /** displays the time in short (`'short'`, e.g. "22:45") or long (`'long'`, e.g. "22:45:00") form */
  timeStyle?: 'short' | 'long'
}

/** composes a {@link TimeFormat} into the wire format string. throws on invalid combinations */
export function composeTimeFormat (opts: TimeFormat) {
  if (opts.relative === true) {
    if (opts.weekday === true || opts.dateStyle !== undefined || opts.timeStyle !== undefined) {
      throw new RangeError('time: `relative` cannot combine with weekday/dateStyle/timeStyle')
    }

    return 'r'
  }

  let out = ''

  if (opts.weekday === true) {
    out += 'w'
  }

  if (opts.dateStyle === 'short') {
    out += 'd'
  } else if (opts.dateStyle === 'long') {
    out += 'D'
  }

  if (opts.timeStyle === 'short') {
    out += 't'
  } else if (opts.timeStyle === 'long') {
    out += 'T'
  }

  return out
}

function unixOf (when: number | Date) {
  const seconds = when instanceof Date ? when.getTime() / 1000 : when

  if (!Number.isFinite(seconds)) {
    throw new RangeError('time: `when` must be a finite unix timestamp (seconds) or a valid Date')
  }

  return Math.floor(seconds)
}

function buildTimeEntity (when: number | Date, format: TimeFormat | undefined, length: number) {
  const entity: Entity = { type: 'date_time', offset: 0, length, unix_time: unixOf(when) }

  if (format !== undefined) {
    const composed = composeTimeFormat(format)

    if (composed !== '') {
      entity.date_time_format = composed
    }
  }

  return entity
}

/**
 * wraps text in a `date_time` entity. accepts a unix timestamp (seconds) or a `Date`.
 * dual-form: legacy `time(text, when, format?)` or curried `time(when, format?)(text)`
 */
export function time (text: string, when: number | Date, format?: TimeFormat): Formatted
export function time (when: number | Date, format?: TimeFormat): WrapFn
export function time (...args: unknown[]): Formatted | WrapFn {
  if (args.length === 0) {
    throw new TypeError('time expected (text, when, format?) or (when, format?)')
  }

  const first = args[0]

  if (typeof first === 'string') {
    if (args.length < 2 || (typeof args[1] !== 'number' && !(args[1] instanceof Date))) {
      throw new TypeError('time(text, when, format?): when must be number or Date')
    }

    const text = first
    const when = args[1]
    const format = args[2] as TimeFormat | undefined

    return new Formatted(text, [buildTimeEntity(when, format, text.length)])
  }

  if (typeof first === 'number' || first instanceof Date) {
    const when = first
    const format = args[1] as TimeFormat | undefined

    return makeWrap(text => buildTimeEntity(when, format, text.length))
  }

  throw new TypeError('time expected (text, when, format?) or (when, format?)')
}
