import { describe, expect, it } from 'vitest'

import { codec, json, text, WidgetStateTooLargeError } from '../src'

describe('state codecs', () => {
  it('json round-trips', () => {
    const state = json<{ count: number, names: string[] }>()
    const data = state.encode({ count: 4, names: ['ann'] })

    expect(data).toBe('{"count":4,"names":["ann"]}')
    expect(state.decode(data)).toEqual({ count: 4, names: ['ann'] })
  })

  it('text passes the string through', () => {
    expect(text().encode('hi')).toBe('hi')
    expect(text().decode('hi')).toBe('hi')
  })

  it('rejects NUL in text state and allows its JSON escape', () => {
    expect(() => text().encode('a\0b')).toThrow(TypeError)
    expect(json<string>().encode('a\0b')).toBe('"a\\u0000b"')
  })

  it('rejects values a serializer cannot encode as text', () => {
    expect(() => json<unknown>().encode(() => {})).toThrow(TypeError)
  })

  it('encodes null and undefined as the empty string that clears the state', () => {
    expect(json<number>().encode(null)).toBe('')
    expect(json<number>().encode(undefined)).toBe('')
    expect(text().encode(null)).toBe('')
  })

  it('decodes the empty string and a missing value as null', () => {
    expect(json<number>().decode('')).toBeNull()
    expect(json<number>().decode(undefined)).toBeNull()
    expect(json<number>().decode(null)).toBeNull()
    expect(text().decode('')).toBeNull()
  })

  it('accepts exactly 1024 utf-8 bytes of multi-byte text and rejects 1025', () => {
    const fits = 'я'.repeat(512)
    const over = 'я'.repeat(512) + 'a'

    expect(text().encode(fits)).toBe(fits)
    expect(() => text().encode(over)).toThrow(WidgetStateTooLargeError)
  })

  it('counts bytes after serialization', () => {
    expect(json<string>().encode('a'.repeat(1022))).toHaveLength(1024)
    expect(() => json<string>().encode('a'.repeat(1023))).toThrow('widget state is 1025 bytes, max is 1024')
    expect(() => json<string>().encode('😀'.repeat(256))).toThrow('widget state is 1026 bytes, max is 1024')
  })

  it('builds custom codecs', () => {
    const counter = codec<number>(String, Number)

    expect(counter.encode(7)).toBe('7')
    expect(counter.decode('7')).toBe(7)
    expect(counter.decode('')).toBeNull()
  })
})
