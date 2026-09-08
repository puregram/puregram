import { describe, it, expect } from 'vitest'

import { bold } from '../src/builders/modifier'
import { format, formatDedent } from '../src/compose'
import { Formatted } from '../src/formatted'

describe('format', () => {
  it('strips the first indent (preserves nested staircase)', () => {
    const f = format`
      foo bar baz
      quix hello
        oppa!
    `

    expect(f.text).toBe('foo bar baz\nquix hello\n  oppa!')
  })

  it('inserts plain string interpolations literally (no escape, no parse)', () => {
    const f = format`hello, ${'**world**'}!`

    expect(f.text).toBe('hello, **world**!')
    expect(f.entities).toEqual([])
  })

  it('coerces numbers via String()', () => {
    const f = format`count: ${42}`

    expect(f.text).toBe('count: 42')
  })

  it('merges Formatted interpolations with shifted offsets', () => {
    const inner = new Formatted('bold', [{ type: 'bold', offset: 0, length: 4 }])
    const f = format`${inner} text`

    expect(f.text).toBe('bold text')
    expect(f.entities).toEqual([{ type: 'bold', offset: 0, length: 4 }])
  })

  it('coerces raw {text, entities} interpolations via Formatted.from', () => {
    const f = format`hi ${{ text: 'X', entities: [{ type: 'italic', offset: 0, length: 1 }] }}`

    expect(f.text).toBe('hi X')
    expect(f.entities).toEqual([{ type: 'italic', offset: 3, length: 1 }])
  })

  it('skips null, undefined, and false interpolations', () => {
    const f = format`a${null}b${undefined}c${false}d`

    expect(f.text).toBe('abcd')
  })

  it('returns a Formatted', () => {
    expect(format`x`).toBeInstanceOf(Formatted)
  })
})

describe('formatDedent', () => {
  it('strips every leading whitespace run', () => {
    const f = formatDedent`
      Welcome!
        not a staircase
          third
    `

    expect(f.text).toBe('Welcome!\nnot a staircase\nthird')
  })

  it('keeps spacing that follows an interpolation', () => {
    expect(formatDedent`hello ${bold('world')} welcome`.text).toBe('hello world welcome')
    expect(formatDedent`x  ${'y'}  z`.text).toBe('x  y  z')
  })

  it('stringifies primitives and rejects objects it cannot format', () => {
    expect(format`flag: ${true as never}`.text).toBe('flag: true')
    expect(format`n: ${42}`.text).toBe('n: 42')
    expect(() => format`items: ${['a', 'b'] as never}`).toThrow(TypeError)
    expect(() => format`d: ${new Date(0) as never}`).toThrow(TypeError)
  })
})
