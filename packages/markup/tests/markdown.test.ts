import { describe, it, expect } from 'vitest'

import { MarkupParseError } from '../src/error'
import { Formatted } from '../src/formatted'
import { md, markdown } from '../src/parsers/markdown'

describe('md() function form', () => {
  it('parses *bold* and **bold**', () => {
    const f = md('*hi*')

    expect(f.text).toBe('hi')
    expect(f.entities).toEqual([{ type: 'bold', offset: 0, length: 2 }])
    expect(md('**hi**').entities[0].type).toBe('bold')
  })

  it('parses _italic_', () => {
    expect(md('_hi_').entities[0].type).toBe('italic')
  })

  it('parses __underline__', () => {
    expect(md('__hi__').entities[0].type).toBe('underline')
  })

  it('parses ~strike~ and ~~strike~~', () => {
    expect(md('~x~').entities[0].type).toBe('strikethrough')
    expect(md('~~x~~').entities[0].type).toBe('strikethrough')
  })

  it('parses ||spoiler||', () => {
    expect(md('||x||').entities[0].type).toBe('spoiler')
  })

  it('parses [text](url) as text_link', () => {
    expect(md('[hi](https://x.com)').entities[0]).toMatchObject({ type: 'text_link', url: 'https://x.com' })
  })

  it('parses [text](tg://user?id=N) as text_mention', () => {
    expect(md('[Alice](tg://user?id=42)').entities[0]).toMatchObject({
      type: 'text_mention',
      user: { id: 42, first_name: 'Alice', is_bot: false }
    })
  })

  it('parses `code`', () => {
    expect(md('`x`').entities[0].type).toBe('code')
  })

  it('parses ```lang\\n…\\n``` as pre with language', () => {
    const f = md('```js\nconsole.log(1)\n```')

    expect(f.text).toBe('console.log(1)')
    expect(f.entities[0]).toMatchObject({ type: 'pre', language: 'js' })
  })

  it('parses ``` … ``` (no language) as pre without language', () => {
    const f = md('```\nplain code\n```')

    expect(f.entities[0]).toMatchObject({ type: 'pre' })
    expect(f.entities[0].language).toBeUndefined()
  })

  it('starts a blockquote entity at the quote body, not at the preceding newline', () => {
    const f = md('hi\n> quote')

    expect(f.text).toBe('hi\nquote')
    expect(f.entities).toEqual([{ type: 'blockquote', offset: 3, length: 5 }])
  })

  it('keeps blank lines and normalizes crlf', () => {
    expect(md('a\n\nb').text).toBe('a\n\nb')
    expect(md('a\n\n\nb').text).toBe('a\n\n\nb')
    expect(md('a\r\nb').text).toBe('a\nb')
    expect(md('*a*\n\n*b*').entities).toEqual([
      { type: 'bold', offset: 0, length: 1 },
      { type: 'bold', offset: 3, length: 1 }
    ])
  })

  it('parses a long document in linear time', () => {
    const source = Array.from({ length: 32000 }, (_, i) => `line ${i}`).join('\n')
    const startedAt = performance.now()

    expect(md(source).text.split('\n')).toHaveLength(32000)
    expect(performance.now() - startedAt).toBeLessThan(1000)
  })

  it('parses > line as blockquote (consecutive lines merge)', () => {
    const f = md('> a\n> b')

    expect(f.text).toBe('a\nb')
    expect(f.entities[0]).toMatchObject({ type: 'blockquote', offset: 0, length: 3 })
  })

  it('parses >> line as expandable_blockquote', () => {
    const f = md('>> a\n>> b')

    expect(f.entities[0].type).toBe('expandable_blockquote')
  })

  it('honors backslash escapes', () => {
    expect(md('\\*not bold\\*').text).toBe('*not bold*')
    expect(md('\\*not bold\\*').entities).toEqual([])
  })

  it('parses [text](tg://emoji?id=N) as custom_emoji', () => {
    expect(md('[😎](tg://emoji?id=cei_42)').entities[0]).toMatchObject({
      type: 'custom_emoji',
      custom_emoji_id: 'cei_42'
    })
  })

  it('parses [text](tg://time?unix=N&format=F) as date_time', () => {
    const f = md('[22:45 tomorrow](tg://time?unix=1647531900&format=wDT)')

    expect(f.entities[0]).toMatchObject({
      type: 'date_time',
      unix_time: 1647531900,
      date_time_format: 'wDT'
    })
  })

  it('parses [text](tg://time?unix=N) without format', () => {
    const f = md('[22:45 tomorrow](tg://time?unix=1647531900)')

    expect(f.entities[0]).toMatchObject({ type: 'date_time', unix_time: 1647531900 })
    expect(f.entities[0].date_time_format).toBeUndefined()
  })

  it('parses ![text](tg://emoji?id=N) with bang prefix', () => {
    const f = md('![😎](tg://emoji?id=cei_42)')

    expect(f.text).toBe('😎')
    expect(f.entities[0]).toMatchObject({ type: 'custom_emoji', custom_emoji_id: 'cei_42' })
  })

  it('parses ![text](tg://time?unix=N) with bang prefix', () => {
    const f = md('![22:45 tomorrow](tg://time?unix=1647531900&format=r)')

    expect(f.entities[0]).toMatchObject({
      type: 'date_time',
      unix_time: 1647531900,
      date_time_format: 'r'
    })
  })

  it('throws on bang prefix with non-time/non-emoji url', () => {
    expect(() => md('![hi](https://x.com)')).toThrow(MarkupParseError)
    expect(() => md('![Alice](tg://user?id=42)')).toThrow(MarkupParseError)
  })

  it('throws on unmatched delimiter', () => {
    expect(() => md('**oops')).toThrow(MarkupParseError)
  })

  it('throws on malformed link', () => {
    expect(() => md('[oops](not')).toThrow(MarkupParseError)
  })

  it('markdown is an alias for md', () => {
    expect(markdown).toBe(md)
  })
})

describe('md`` tagged-template form', () => {
  it('treats string interpolations as literal text', () => {
    expect(md`Hello, **${'**evil**'}**!`.text).toBe('Hello, **evil**!')
  })

  it('first-indent strip preserves staircase', () => {
    const f = md`
      hello
      world
        deeper
    `

    expect(f.text).toBe('hello\nworld\n  deeper')
  })

  it('merges Formatted interpolations', () => {
    const inner = new Formatted('X', [{ type: 'italic', offset: 0, length: 1 }])
    const f = md`a ${inner} b`

    expect(f.text).toBe('a X b')
    expect(f.entities).toEqual([{ type: 'italic', offset: 2, length: 1 }])
  })
})
