import { describe, it, expect } from 'vitest'

import { makeModifier, MODIFIER_NAMES } from '../src/builders/chain'
import {
  bold, italic, underline, strikethrough, spoiler,
  blockquote, expandableBlockquote, code, tonAddress, bankCardNumber
} from '../src/builders/modifier'

describe('makeModifier (primitive)', () => {
  it('exposes a function that accepts a string and emits one entity per chain entry', () => {
    const m = makeModifier(['bold'])

    expect(m('foo').text).toBe('foo')
    expect(m('foo').entities).toEqual([{ type: 'bold', offset: 0, length: 3 }])
  })

  it('property access for known modifier names extends the chain', () => {
    const m = makeModifier(['bold'])
    const out = (m as unknown as { italic: (s: string) => { entities: unknown[] } }).italic('foo')

    expect(out.entities).toEqual([
      { type: 'bold', offset: 0, length: 3 },
      { type: 'italic', offset: 0, length: 3 }
    ])
  })

  it('MODIFIER_NAMES includes all modifier types', () => {
    expect(MODIFIER_NAMES.has('bold')).toBe(true)
    expect(MODIFIER_NAMES.has('italic')).toBe(true)
    expect(MODIFIER_NAMES.has('expandableBlockquote')).toBe(true)
    expect(MODIFIER_NAMES.has('code')).toBe(true)
    expect(MODIFIER_NAMES.has('tonAddress')).toBe(true)
    expect(MODIFIER_NAMES.has('bankCardNumber')).toBe(true)
    expect(MODIFIER_NAMES.size).toBe(10)
  })
})

describe('modifier exports', () => {
  it('bold("foo") emits one bold entity', () => {
    expect(bold('foo').entities).toEqual([{ type: 'bold', offset: 0, length: 3 }])
  })

  it('bold`foo` (tagged template) is equivalent to bold("foo")', () => {
    expect(bold`foo`.entities).toEqual([{ type: 'bold', offset: 0, length: 3 }])
  })

  // eslint-disable-next-line no-template-curly-in-string -- example string literal in test name
  it('bold`foo ${italic("bar")}` nests entities — bold[0,7] + italic[4,3]', () => {
    const out = bold`foo ${italic('bar')}`

    expect(out.text).toBe('foo bar')
    expect(out.entities).toEqual([
      { type: 'bold', offset: 0, length: 7 },
      { type: 'italic', offset: 4, length: 3 }
    ])
  })

  it('bold.italic("foo") emits both, bold first', () => {
    expect(bold.italic('foo').entities).toEqual([
      { type: 'bold', offset: 0, length: 3 },
      { type: 'italic', offset: 0, length: 3 }
    ])
  })

  it('italic.bold("foo") preserves chain order — italic first', () => {
    expect(italic.bold('foo').entities).toEqual([
      { type: 'italic', offset: 0, length: 3 },
      { type: 'bold', offset: 0, length: 3 }
    ])
  })

  // eslint-disable-next-line no-template-curly-in-string -- example string literal in test name
  it('bold.italic`foo ${underline("bar")}` — outer chain spans whole, inner only on bar', () => {
    const out = bold.italic`foo ${underline('bar')}`

    expect(out.text).toBe('foo bar')
    expect(out.entities).toEqual([
      { type: 'bold', offset: 0, length: 7 },
      { type: 'italic', offset: 0, length: 7 },
      { type: 'underline', offset: 4, length: 3 }
    ])
  })

  it('bold(formatted) wraps existing Formatted, preserving inner entities', () => {
    const f = italic('inner')
    const wrapped = bold(f)

    expect(wrapped.text).toBe('inner')
    expect(wrapped.entities).toEqual([
      { type: 'bold', offset: 0, length: 5 },
      { type: 'italic', offset: 0, length: 5 }
    ])
  })

  it('expandableBlockquote maps to expandable_blockquote entity type', () => {
    expect(expandableBlockquote('x').entities).toEqual([
      { type: 'expandable_blockquote', offset: 0, length: 1 }
    ])
  })

  it('all modifiers are exported', () => {
    const exports = {
      bold, italic, underline, strikethrough, spoiler, blockquote, expandableBlockquote, code,
      tonAddress, bankCardNumber
    }

    for (const m of Object.values(exports)) {
      expect(typeof m).toBe('function')
    }
  })
})
