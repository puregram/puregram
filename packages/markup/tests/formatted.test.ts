import { describe, it, expect } from 'vitest'

import { Formatted } from '../src/formatted'

describe('Formatted', () => {
  it('exposes text and entities as readonly fields', () => {
    const f = new Formatted('hi', [{ type: 'bold', offset: 0, length: 2 }])

    expect(f.text).toBe('hi')
    expect(f.entities).toEqual([{ type: 'bold', offset: 0, length: 2 }])
  })

  it('owns its entities — mutating the caller array cannot corrupt it', () => {
    const entities = [{ type: 'bold' as const, offset: 0, length: 2 }]
    const f = new Formatted('hi', entities)

    entities.push({ type: 'bold', offset: 99, length: 50 })
    entities[0]!.offset = 42

    expect(f.entities).toEqual([{ type: 'bold', offset: 0, length: 2 }])
  })

  it('drops zero-length entities, which designate nothing on the wire', () => {
    expect(new Formatted('', [{ type: 'bold', offset: 0, length: 0 }]).entities).toEqual([])
    expect(new Formatted('ab', [
      { type: 'bold', offset: 0, length: 0 },
      { type: 'italic', offset: 0, length: 2 }
    ]).entities).toEqual([{ type: 'italic', offset: 0, length: 2 }])
  })

  it('toString returns the plain text', () => {
    const f = new Formatted('hello', [])

    expect(f.toString()).toBe('hello')
    expect(String(f)).toBe('hello')
  })

  it('Formatted.from returns the same instance for a Formatted', () => {
    const f = new Formatted('a', [])

    expect(Formatted.from(f)).toBe(f)
  })

  it('Formatted.from wraps a raw {text, entities} object', () => {
    const f = Formatted.from({ text: 'b', entities: [{ type: 'italic', offset: 0, length: 1 }] })

    expect(f).toBeInstanceOf(Formatted)
    expect(f.text).toBe('b')
    expect(f.entities).toEqual([{ type: 'italic', offset: 0, length: 1 }])
  })

  it('Formatted.from defaults entities to empty array', () => {
    const f = Formatted.from({ text: 'c' })

    expect(f.entities).toEqual([])
  })
})
