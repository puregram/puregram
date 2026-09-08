import { describe, it, expect } from 'vitest'

import { MarkupParseError } from '../src/error'
import { Formatted } from '../src/formatted'
import { html } from '../src/parsers/html'

describe('html() function form', () => {
  it('parses <b> as bold', () => {
    const f = html('<b>hi</b>')

    expect(f.text).toBe('hi')
    expect(f.entities).toEqual([{ type: 'bold', offset: 0, length: 2 }])
  })

  it('accepts <strong> as alias for <b>', () => {
    expect(html('<strong>x</strong>').entities[0].type).toBe('bold')
  })

  it('accepts <em>, <italic> as aliases for <i>', () => {
    expect(html('<em>x</em>').entities[0].type).toBe('italic')
    expect(html('<italic>x</italic>').entities[0].type).toBe('italic')
  })

  it('accepts <ins> as alias for <u> and <strike>/<del> as aliases for <s>', () => {
    expect(html('<ins>x</ins>').entities[0].type).toBe('underline')
    expect(html('<strike>x</strike>').entities[0].type).toBe('strikethrough')
    expect(html('<del>x</del>').entities[0].type).toBe('strikethrough')
  })

  it('accepts <spoiler>, <tg-spoiler>, and <span class="tg-spoiler"> as spoiler', () => {
    expect(html('<spoiler>x</spoiler>').entities[0].type).toBe('spoiler')
    expect(html('<tg-spoiler>x</tg-spoiler>').entities[0].type).toBe('spoiler')
    expect(html('<span class="tg-spoiler">x</span>').entities[0].type).toBe('spoiler')
  })

  it('parses <a href="…"> as text_link', () => {
    const f = html('<a href="https://x.com">hi</a>')

    expect(f.entities).toEqual([{ type: 'text_link', offset: 0, length: 2, url: 'https://x.com' }])
  })

  it('parses <code> as code', () => {
    expect(html('<code>x</code>').entities[0].type).toBe('code')
  })

  it('parses <pre> as pre', () => {
    expect(html('<pre>x</pre>').entities[0].type).toBe('pre')
  })

  it('parses <pre><code class="language-js"> as pre with language', () => {
    const f = html('<pre><code class="language-js">x</code></pre>')

    expect(f.entities[0]).toMatchObject({ type: 'pre', language: 'js' })
  })

  it('parses <blockquote> as blockquote and <blockquote expandable> as expandable_blockquote', () => {
    expect(html('<blockquote>x</blockquote>').entities[0].type).toBe('blockquote')
    expect(html('<blockquote expandable>x</blockquote>').entities[0].type).toBe('expandable_blockquote')
  })

  it('parses <tg-emoji emoji-id="…"> and <emoji id="…">', () => {
    expect(html('<tg-emoji emoji-id="42">x</tg-emoji>').entities[0]).toMatchObject({ type: 'custom_emoji', custom_emoji_id: '42' })
    expect(html('<emoji id="99">x</emoji>').entities[0]).toMatchObject({ type: 'custom_emoji', custom_emoji_id: '99' })
  })

  it('parses <tg-time unix="…"> as date_time', () => {
    const f = html('<tg-time unix="1647531900">22:45 tomorrow</tg-time>')

    expect(f.text).toBe('22:45 tomorrow')
    expect(f.entities[0]).toMatchObject({ type: 'date_time', unix_time: 1647531900 })
    expect(f.entities[0].date_time_format).toBeUndefined()
  })

  it('parses <tg-time unix="…" format="wDT">', () => {
    const f = html('<tg-time unix="1647531900" format="wDT">22:45 tomorrow</tg-time>')

    expect(f.entities[0]).toMatchObject({
      type: 'date_time',
      unix_time: 1647531900,
      date_time_format: 'wDT'
    })
  })

  it('throws on <tg-time> with named-flag attr (extended-form attrs not allowed)', () => {
    expect(() => html('<tg-time unix="1" relative>x</tg-time>')).toThrow(MarkupParseError)
    expect(() => html('<tg-time unix="1" weekday>x</tg-time>')).toThrow(MarkupParseError)
    expect(() => html('<tg-time unix="1" date-style="long">x</tg-time>')).toThrow(MarkupParseError)
  })

  it('throws on <tg-time> without unix', () => {
    expect(() => html('<tg-time>x</tg-time>')).toThrow(MarkupParseError)
  })

  it('parses <time unix="…" format="…"> (extended form, format passthrough)', () => {
    const f = html('<time unix="1647531900" format="r">in 5m</time>')

    expect(f.entities[0]).toMatchObject({
      type: 'date_time',
      unix_time: 1647531900,
      date_time_format: 'r'
    })
  })

  it('parses <time unix="…" weekday date-style="long" time-style="long">', () => {
    const f = html('<time unix="1647531900" weekday date-style="long" time-style="long">22:45 tomorrow</time>')

    expect(f.entities[0]).toMatchObject({
      type: 'date_time',
      unix_time: 1647531900,
      date_time_format: 'wDT'
    })
  })

  it('parses <time unix="…" relative>', () => {
    const f = html('<time unix="1647531900" relative>in 5m</time>')

    expect(f.entities[0]).toMatchObject({ type: 'date_time', date_time_format: 'r' })
  })

  it('throws on <time> with both format and named flags', () => {
    expect(() => html('<time unix="1" format="r" weekday>x</time>')).toThrow(MarkupParseError)
  })

  it('throws on <time> with relative + another named flag', () => {
    expect(() => html('<time unix="1" relative weekday>x</time>')).toThrow(MarkupParseError)
  })

  it('throws on <time> with bad date-style/time-style values', () => {
    expect(() => html('<time unix="1" date-style="huge">x</time>')).toThrow(MarkupParseError)
    expect(() => html('<time unix="1" time-style="huge">x</time>')).toThrow(MarkupParseError)
  })

  it('throws on <time>/<tg-time> with non-numeric unix', () => {
    expect(() => html('<time unix="abc">x</time>')).toThrow(MarkupParseError)
    expect(() => html('<tg-time unix="abc">x</tg-time>')).toThrow(MarkupParseError)
  })

  it('handles nested entities — <b>foo <i>bar</i></b>', () => {
    const f = html('<b>foo <i>bar</i></b>')

    expect(f.text).toBe('foo bar')
    expect(f.entities).toEqual([
      { type: 'bold', offset: 0, length: 7 },
      { type: 'italic', offset: 4, length: 3 }
    ])
  })

  it('decodes core HTML entities — &amp;, &lt;, &gt;, &quot;, &#NNN;', () => {
    expect(html('a &amp; b').text).toBe('a & b')
    expect(html('&lt;tag&gt;').text).toBe('<tag>')
    expect(html('&#65;').text).toBe('A')
  })

  it('collapses horizontal whitespace runs to a single space, preserves newlines', () => {
    expect(html('foo   bar  baz').text).toBe('foo bar baz')
    expect(html('foo\nbar').text).toBe('foo\nbar')
    expect(html('foo \n  bar').text).toBe('foo\nbar')
    expect(html('foo\n\nbar').text).toBe('foo\n\nbar')
  })

  it('strips leading/trailing whitespace', () => {
    expect(html('  hello  ').text).toBe('hello')
  })

  it('keeps entity ranges inside the text when whitespace is dropped', () => {
    expect(html('<b>bold </b>')).toEqual(new Formatted('bold', [{ type: 'bold', offset: 0, length: 4 }]))
    expect(html('hi <b>there </b>  ')).toEqual(new Formatted('hi there', [{ type: 'bold', offset: 3, length: 5 }]))
    expect(html('<b>x </b>\n<i>y</i>')).toEqual(new Formatted('x\ny', [
      { type: 'bold', offset: 0, length: 1 },
      { type: 'italic', offset: 2, length: 1 }
    ]))
  })

  it('drops an entity left empty by whitespace handling', () => {
    expect(html('<b></b>x').entities).toEqual([])
    expect(html('<b> </b>x').entities).toEqual([])
  })

  it('rejects numeric references outside the scalar range', () => {
    expect(() => html('x&#x110000;y')).toThrow(MarkupParseError)
    expect(() => html('x&#-1;y')).toThrow(MarkupParseError)
    expect(() => html('x&#xD800;y')).toThrow(MarkupParseError)
    expect(() => html('x&#1;y')).toThrow(MarkupParseError)
    expect(html('x&#9;y').text).toBe('x y')
    expect(html('&#128512;').text).toBe('😀')
  })

  it('never throws from the lenient variant', () => {
    expect(html.lenient('x&#x110000;y')).toEqual(new Formatted('x&#x110000;y', []))
    expect(html.lenient('<b>'.repeat(3000))).toBeInstanceOf(Formatted)
  })

  it('returns a Formatted', () => {
    expect(html('plain')).toBeInstanceOf(Formatted)
  })

  it('throws MarkupParseError on unknown tag', () => {
    expect(() => html('<wat>x</wat>')).toThrow(MarkupParseError)
  })

  it('throws MarkupParseError on unclosed tag', () => {
    expect(() => html('<b>oops')).toThrow(MarkupParseError)
  })

  it('throws MarkupParseError on mismatched closing tag', () => {
    expect(() => html('<b>x</i>')).toThrow(MarkupParseError)
  })

  it('throws MarkupParseError on <a> without href', () => {
    expect(() => html('<a>x</a>')).toThrow(MarkupParseError)
  })
})

describe('html`` tagged-template form', () => {
  it('treats string interpolations as literal text', () => {
    const userName = 'A**lice**'
    const f = html`<b>${userName}</b>`

    expect(f.text).toBe('A**lice**')
    expect(f.entities[0].length).toBe('A**lice**'.length)
  })

  it('does not let interpolated strings open or close tags', () => {
    const evil = '</b>'
    const f = html`<b>${evil}</b>`

    expect(f.text).toBe('</b>')
    expect(f.entities[0]).toMatchObject({ type: 'bold', offset: 0, length: 4 })
  })

  it('merges Formatted interpolations with offset shift', () => {
    const inner = new Formatted('x', [{ type: 'italic', offset: 0, length: 1 }])
    const f = html`a ${inner} b`

    expect(f.text).toBe('a x b')
    expect(f.entities).toEqual([{ type: 'italic', offset: 2, length: 1 }])
  })

  it('coerces numbers to literal text', () => {
    expect(html`count=${42}`.text).toBe('count=42')
  })

  it('skips null/undefined/false', () => {
    expect(html`a${null}b${undefined}c${false}d`.text).toBe('abcd')
  })

  it('resolves interpolated attribute values across entity payload fields', () => {
    const unix = 1647531900
    const id = 'cei_42'
    const lang = 'js'
    const fmt = 'wDT'

    expect(html`<tg-time unix="${unix}" format="${fmt}">when</tg-time>`.entities[0]).toMatchObject({
      type: 'date_time',
      unix_time: unix,
      date_time_format: fmt
    })

    expect(html`<time unix="${unix}" relative>when</time>`.entities[0]).toMatchObject({
      type: 'date_time',
      unix_time: unix,
      date_time_format: 'r'
    })

    expect(html`<tg-emoji emoji-id="${id}">x</tg-emoji>`.entities[0]).toMatchObject({
      type: 'custom_emoji',
      custom_emoji_id: id
    })

    expect(html`<pre language="${lang}">x</pre>`.entities[0]).toMatchObject({
      type: 'pre',
      language: lang
    })
  })
})
