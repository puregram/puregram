import { describe, expect, it } from 'vitest'

import { composeTimeFormat, time } from '../src/builders/time'

describe('time builder', () => {
  it('emits date_time entity with unix_time', () => {
    const f = time('22:45 tomorrow', 1647531900)

    expect(f.text).toBe('22:45 tomorrow')
    expect(f.entities).toEqual([
      { type: 'date_time', offset: 0, length: 14, unix_time: 1647531900 }
    ])
  })

  it('accepts a Date and converts to unix seconds', () => {
    const date = new Date('2022-03-17T22:45:00.123Z')
    const expected = Math.floor(date.getTime() / 1000)
    const f = time('22:45 tomorrow', date)

    expect(f.entities[0].unix_time).toBe(expected)
  })

  it('composes named flags into the format string', () => {
    const f = time('22:45 tomorrow', 1647531900, { weekday: true, dateStyle: 'long', timeStyle: 'long' })

    expect(f.entities[0].date_time_format).toBe('wDT')
  })

  it('emits "r" for relative', () => {
    const f = time('in 5m', 1647531900, { relative: true })

    expect(f.entities[0].date_time_format).toBe('r')
  })

  it('omits date_time_format when no flags supplied', () => {
    const f = time('label', 1647531900, {})

    expect(f.entities[0].date_time_format).toBeUndefined()
  })

  it('throws when relative is combined with another flag', () => {
    expect(() => time('x', 1, { relative: true, weekday: true })).toThrow(RangeError)
    expect(() => time('x', 1, { relative: true, dateStyle: 'short' })).toThrow(RangeError)
    expect(() => time('x', 1, { relative: true, timeStyle: 'long' })).toThrow(RangeError)
  })
})

describe('time builder — curried form', () => {
  it('time(unix)(text) emits date_time', () => {
    const f = time(1647531900)('22:45 tomorrow')

    expect(f.text).toBe('22:45 tomorrow')
    expect(f.entities).toEqual([
      { type: 'date_time', offset: 0, length: 14, unix_time: 1647531900 }
    ])
  })

  it('time(date, format)(text) accepts a Date and named flags', () => {
    const date = new Date('2022-03-17T22:45:00Z')
    const expected = Math.floor(date.getTime() / 1000)
    const f = time(date, { weekday: true, dateStyle: 'long', timeStyle: 'long' })('22:45 tomorrow')

    expect(f.entities[0]).toMatchObject({
      type: 'date_time',
      unix_time: expected,
      date_time_format: 'wDT'
    })
  })

  it('time(unix, { relative: true })`text` works as tagged template', () => {
    const f = time(1647531900, { relative: true })`in 5m`

    expect(f.text).toBe('in 5m')
    expect(f.entities[0]).toMatchObject({ type: 'date_time', date_time_format: 'r' })
  })

  it('throws on bad arg shapes', () => {
    // @ts-expect-error -- runtime check, intentionally no args
    expect(() => time()).toThrow(TypeError)
    // @ts-expect-error -- runtime check, first arg must be string|number|Date
    expect(() => time({ weekday: true })).toThrow(TypeError)
  })

  it('rejects a timestamp telegram cannot read', () => {
    expect(() => time('soon', new Date('not a date'))).toThrow(RangeError)
    expect(() => time('soon', Number.NaN)).toThrow(RangeError)
    expect(() => time('soon', Number.POSITIVE_INFINITY)).toThrow(RangeError)
    expect(time('soon', 1700000000.7).entities[0].unix_time).toBe(1700000000)
  })
})

describe('composeTimeFormat', () => {
  it('maps each flag combination to telegram chars', () => {
    expect(composeTimeFormat({})).toBe('')
    expect(composeTimeFormat({ weekday: true })).toBe('w')
    expect(composeTimeFormat({ dateStyle: 'short' })).toBe('d')
    expect(composeTimeFormat({ dateStyle: 'long' })).toBe('D')
    expect(composeTimeFormat({ timeStyle: 'short' })).toBe('t')
    expect(composeTimeFormat({ timeStyle: 'long' })).toBe('T')
    expect(composeTimeFormat({ weekday: true, dateStyle: 'short', timeStyle: 'long' })).toBe('wdT')
    expect(composeTimeFormat({ relative: true })).toBe('r')
  })
})
