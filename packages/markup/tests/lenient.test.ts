import { describe, it, expect } from 'vitest'

import { MarkupParseError } from '../src/error'
import { html, htmlb } from '../src/parsers/html'
import { md, markdown } from '../src/parsers/markdown'

describe('md.lenient', () => {
  it('parses well-formed input identically to md()', () => {
    const a = md('**hi**')
    const b = md.lenient('**hi**')

    expect(b.text).toBe(a.text)
    expect(b.entities).toEqual(a.entities)
  })

  it('returns plain-text Formatted on malformed input (no throw)', () => {
    const broken = 'broken **bold'
    const f = md.lenient(broken)

    expect(f.text).toBe(broken)
    expect(f.entities).toEqual([])
  })

  it('does not throw on a stray link', () => {
    const broken = '[oops'
    const f = md.lenient(broken)

    expect(f.text).toBe(broken)
    expect(f.entities).toEqual([])
  })

  it('markdown.lenient is exposed as the same callable shape', () => {
    expect(markdown.lenient('**hi**').entities[0]).toMatchObject({ type: 'bold' })
  })

  it('strict md() still throws on the same malformed input', () => {
    expect(() => md('broken **bold')).toThrow()
  })
})

describe('html.lenient', () => {
  it('parses well-formed input identically to html()', () => {
    const a = html('<b>hi</b>')
    const b = html.lenient('<b>hi</b>')

    expect(b.text).toBe(a.text)
    expect(b.entities).toEqual(a.entities)
  })

  it('returns plain-text Formatted on malformed input (no throw)', () => {
    const broken = '<b>unclosed'
    const f = html.lenient(broken)

    expect(f.text).toBe(broken)
    expect(f.entities).toEqual([])
  })

  it('does not throw on mismatched tags', () => {
    const broken = '<b>hi</i>'
    const f = html.lenient(broken)

    expect(f.text).toBe(broken)
    expect(f.entities).toEqual([])
  })

  it('strict html() still throws on the same malformed input', () => {
    expect(() => html('<b>unclosed')).toThrow()
  })
})

describe('htmlb.lenient', () => {
  it('parses well-formed input identically to htmlb()', () => {
    const a = htmlb('a<br>b')
    const b = htmlb.lenient('a<br>b')

    expect(b.text).toBe(a.text)
    expect(b.entities).toEqual(a.entities)
  })

  it('returns plain-text on malformed input', () => {
    const broken = '<b>x'
    const f = htmlb.lenient(broken)

    expect(f.text).toBe(broken)
    expect(f.entities).toEqual([])
  })
})

describe('MarkupParseError', () => {
  it('exposes the source position under both names', () => {
    try {
      md('ok text here **a')
      expect.unreachable()
    } catch (error) {
      expect(error).toBeInstanceOf(MarkupParseError)
      expect((error as MarkupParseError).position).toBe((error as MarkupParseError).offset)
      expect((error as MarkupParseError).position).toBeGreaterThan(0)
    }
  })
})
