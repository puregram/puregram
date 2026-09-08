import { describe, it, expect } from 'vitest'

import { Formatted } from '../src/formatted'
import { md } from '../src/parsers/markdown'
import { toMarkdown } from '../src/serializers/markdown'

describe('toMarkdown', () => {
  it('serializes plain text with no entities (and escapes specials)', () => {
    expect(toMarkdown(new Formatted('hi', []))).toBe('hi')
    expect(toMarkdown(new Formatted('1.0', []))).toBe('1\\.0')
  })

  it('emits the markdownv2 delimiters telegram parses', () => {
    expect(toMarkdown(new Formatted('hi', [{ type: 'bold', offset: 0, length: 2 }]))).toBe('*hi*')
    expect(toMarkdown(new Formatted('x', [{ type: 'italic', offset: 0, length: 1 }]))).toBe('_x_')
    expect(toMarkdown(new Formatted('x', [{ type: 'underline', offset: 0, length: 1 }]))).toBe('__x__')
    expect(toMarkdown(new Formatted('x', [{ type: 'strikethrough', offset: 0, length: 1 }]))).toBe('~x~')
    expect(toMarkdown(new Formatted('x', [{ type: 'spoiler', offset: 0, length: 1 }]))).toBe('||x||')
  })

  it('emits [text](url) for text_link', () => {
    const f = new Formatted('site', [{ type: 'text_link', offset: 0, length: 4, url: 'https://x.com' }])

    expect(toMarkdown(f)).toBe('[site](https://x.com)')
  })

  it('emits [text](tg://user?id=N) for text_mention', () => {
    const f = new Formatted('Alice', [{
      type: 'text_mention', offset: 0, length: 5, user: { id: 42, is_bot: false, first_name: 'Alice' }
    }])

    expect(toMarkdown(f)).toBe('[Alice](tg://user?id=42)')
  })

  it('emits `code` and ```pre``` fenced blocks', () => {
    expect(toMarkdown(new Formatted('x', [{ type: 'code', offset: 0, length: 1 }]))).toBe('`x`')

    const p = new Formatted('console.log(1)', [{ type: 'pre', offset: 0, length: 14, language: 'js' }])

    expect(toMarkdown(p)).toBe('```js\nconsole.log(1)\n```')
  })

  it('emits a blockquote with leading > on each line', () => {
    const f = new Formatted('a\nb', [{ type: 'blockquote', offset: 0, length: 3 }])

    expect(toMarkdown(f)).toBe('> a\n> b')
  })

  it('emits an expandable blockquote with >>', () => {
    const f = new Formatted('a\nb', [{ type: 'expandable_blockquote', offset: 0, length: 3 }])

    expect(toMarkdown(f)).toBe('>> a\n>> b')
  })

  it('emits ![X](tg://emoji?id=…) for custom_emoji', () => {
    const f = new Formatted('X', [{ type: 'custom_emoji', offset: 0, length: 1, custom_emoji_id: '5448' }])

    expect(toMarkdown(f)).toBe('![X](tg://emoji?id=5448)')
  })

  it('round-trips md`*hi*` → toMarkdown()', () => {
    const f = md('*hi*')

    expect(toMarkdown(f)).toBe('*hi*')
    expect(md(toMarkdown(f)).entities).toEqual(f.entities)
  })

  it('round-trips nested bold-inside-italic (re-parsing matches)', () => {
    const f = md('_**hi**_')
    const serialized = toMarkdown(f)
    const reparsed = md(serialized)

    expect(reparsed.text).toBe(f.text)
    expect([...reparsed.entities].sort((a, b) => a.offset - b.offset || a.type.localeCompare(b.type))).toEqual(
      [...f.entities].sort((a, b) => a.offset - b.offset || a.type.localeCompare(b.type))
    )
  })

  it('round-trips a text_link', () => {
    const f = md('[site](https://x.com)')

    expect(toMarkdown(f)).toBe('[site](https://x.com)')
  })

  it('round-trips a pre with language', () => {
    const f = md('```js\nconsole.log(1)\n```')

    expect(toMarkdown(f)).toBe('```js\nconsole.log(1)\n```')
  })

  it('escapes specials inside code as backtick + backslash only', () => {
    // a code span containing "*" should NOT have the * escaped — only ` and \
    const f = new Formatted('a*b', [{ type: 'code', offset: 0, length: 3 }])

    expect(toMarkdown(f)).toBe('`a*b`')
  })

  it('formatted.toMarkdown() is a method shortcut', () => {
    const f = new Formatted('hi', [{ type: 'bold', offset: 0, length: 2 }])

    expect(f.toMarkdown()).toBe('*hi*')
  })
})
