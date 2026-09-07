import type { TelegramInputRichBlock } from '@puregram/api'
import { describe, expect, it } from 'vitest'

import { DEFAULT_MAP_HEIGHT, DEFAULT_MAP_WIDTH, DEFAULT_MAP_ZOOM } from '../../src/constants'
import { RichParseError } from '../../src/error'
import { type HostParsers, parseHtml, parseHtmlFragment } from '../../src/parsers/html'

const stubHost: HostParsers = {
  inline: () => 'HOSTED',
  blocks: () => [{ type: 'divider' }]
}

function firstBlock (source: string, opts?: { lenient?: boolean }) {
  const blocks = parseHtml(source, opts)

  expect(blocks).toHaveLength(1)

  return blocks[0]!
}

function paragraphText (source: string, opts?: { lenient?: boolean }) {
  const block = firstBlock(source, opts)

  expect(block.type).toBe('paragraph')

  return (block as Extract<TelegramInputRichBlock, { type: 'paragraph' }>).text
}

function caught (fn: () => unknown) {
  try {
    fn()
  } catch (error) {
    return error as RichParseError
  }

  throw new Error('expected a parse error')
}

describe('inline mappings', () => {
  const wraps = [
    ['b', 'bold'], ['strong', 'bold'],
    ['i', 'italic'], ['em', 'italic'],
    ['u', 'underline'], ['ins', 'underline'],
    ['s', 'strikethrough'], ['strike', 'strikethrough'], ['del', 'strikethrough'],
    ['code', 'code'], ['mark', 'marked'],
    ['sub', 'subscript'], ['sup', 'superscript'],
    ['tg-spoiler', 'spoiler']
  ] as const

  it.each(wraps)('<%s> maps to %s', (tag, type) => {
    expect(paragraphText(`<${tag}>x</${tag}>`)).toEqual({ type, text: 'x' })
  })

  it('maps <a href> to url', () => {
    expect(paragraphText('<a href="https://example.com">go</a>')).toEqual({
      type: 'url',
      text: 'go',
      url: 'https://example.com'
    })
  })

  it('maps <a href="#name"> to anchor_link', () => {
    expect(paragraphText('<a href="#top">up</a>')).toEqual({ type: 'anchor_link', text: 'up', anchor_name: 'top' })
  })

  it('maps <a name> to anchor', () => {
    expect(paragraphText('<a name="top"></a>')).toEqual({ type: 'anchor', name: 'top' })
  })

  it('maps <tg-reference> to reference', () => {
    expect(paragraphText('<tg-reference name="fn1">noted</tg-reference>')).toEqual({
      type: 'reference',
      text: 'noted',
      name: 'fn1'
    })
  })

  it('maps <tg-emoji> to custom_emoji with inner alt text', () => {
    expect(paragraphText('<tg-emoji emoji-id="5368">&#128077;</tg-emoji>')).toEqual({
      type: 'custom_emoji',
      custom_emoji_id: '5368',
      alternative_text: '\u{1f44d}'
    })
  })

  it('maps <img src="tg://emoji?id=…"> to custom_emoji', () => {
    expect(paragraphText('<img src="tg://emoji?id=5368" alt="ok"/>')).toEqual({
      type: 'custom_emoji',
      custom_emoji_id: '5368',
      alternative_text: 'ok'
    })
  })

  it('maps <tg-time> to date_time, format defaults to empty', () => {
    expect(paragraphText('<tg-time unix="1700000000" format="R">soon</tg-time>')).toEqual({
      type: 'date_time',
      text: 'soon',
      unix_time: 1700000000,
      date_time_format: 'R'
    })
    expect(paragraphText('<tg-time unix="1">t</tg-time>')).toEqual({
      type: 'date_time',
      text: 't',
      unix_time: 1,
      date_time_format: ''
    })
  })

  it('keeps <tg-math> content raw without entity decoding', () => {
    expect(paragraphText('<tg-math>x &lt; y</tg-math>')).toEqual({
      type: 'mathematical_expression',
      expression: 'x &lt; y'
    })
  })
})

describe('block mappings', () => {
  it.each([[1], [2], [3], [4], [5], [6]])('maps <h%i> to heading with size', (size) => {
    expect(firstBlock(`<h${size}> Title </h${size}>`)).toEqual({ type: 'heading', text: 'Title', size })
  })

  it('maps <p> to paragraph', () => {
    expect(firstBlock('<p>text</p>')).toEqual({ type: 'paragraph', text: 'text' })
  })

  it('maps <pre> to pre with raw text', () => {
    expect(firstBlock('<pre>\nline1\n  line2</pre>')).toEqual({ type: 'pre', text: 'line1\n  line2' })
  })

  it('unwraps <pre><code class="language-…"> into language', () => {
    expect(firstBlock('<pre><code class="language-python">print(1 &#60; 2)</code></pre>')).toEqual({
      type: 'pre',
      text: 'print(1 < 2)',
      language: 'python'
    })
  })

  it('maps <footer> and <tg-thinking>', () => {
    expect(firstBlock('<footer>fin</footer>')).toEqual({ type: 'footer', text: 'fin' })
    expect(firstBlock('<tg-thinking>hmm</tg-thinking>')).toEqual({ type: 'thinking', text: 'hmm' })
  })

  it('maps <hr/> and <hr> to divider', () => {
    expect(firstBlock('<hr/>')).toEqual({ type: 'divider' })
    expect(firstBlock('<hr>')).toEqual({ type: 'divider' })
  })

  it('maps <ul> items to blocks', () => {
    expect(firstBlock('<ul><li>a</li><li>b</li></ul>')).toEqual({
      type: 'list',
      items: [
        { blocks: [{ type: 'paragraph', text: 'a' }] },
        { blocks: [{ type: 'paragraph', text: 'b' }] }
      ]
    })
  })

  it('numbers <ol> items from start, li value overrides, type maps through', () => {
    const block = firstBlock('<ol start="3" type="a"><li>a</li><li value="10" type="I">b</li><li>c</li></ol>')

    expect(block).toEqual({
      type: 'list',
      items: [
        { blocks: [{ type: 'paragraph', text: 'a' }], value: 3, type: 'a' },
        { blocks: [{ type: 'paragraph', text: 'b' }], value: 10, type: 'I' },
        { blocks: [{ type: 'paragraph', text: 'c' }], value: 11, type: 'a' }
      ]
    })
  })

  it('counts <ol reversed> down from the item count by default', () => {
    const block = firstBlock('<ol reversed><li>a</li><li>b</li><li>c</li></ol>')

    expect(block).toEqual({
      type: 'list',
      items: [
        { blocks: [{ type: 'paragraph', text: 'a' }], value: 3, type: '1' },
        { blocks: [{ type: 'paragraph', text: 'b' }], value: 2, type: '1' },
        { blocks: [{ type: 'paragraph', text: 'c' }], value: 1, type: '1' }
      ]
    })
  })

  it('maps <blockquote> with <br> newlines and trailing <cite> credit', () => {
    expect(firstBlock('<blockquote>line one<br>line two<cite>A</cite></blockquote>')).toEqual({
      type: 'blockquote',
      blocks: [{ type: 'paragraph', text: 'line one\nline two' }],
      credit: 'A'
    })
  })

  it('maps <aside> to pullquote with credit', () => {
    expect(firstBlock('<aside>Q<cite>B</cite></aside>')).toEqual({ type: 'pullquote', text: 'Q', credit: 'B' })
  })

  it('maps media tags to media blocks, tg-spoiler attr sets has_spoiler', () => {
    expect(firstBlock('<img src="https://x/p.jpg" tg-spoiler/>')).toEqual({
      type: 'photo',
      photo: { type: 'photo', media: 'https://x/p.jpg', has_spoiler: true }
    })
    expect(firstBlock('<video src="https://x/v.mp4" tg-spoiler></video>')).toEqual({
      type: 'video',
      video: { type: 'video', media: 'https://x/v.mp4', has_spoiler: true }
    })
    expect(firstBlock('<audio src="https://x/a.mp3"></audio>')).toEqual({
      type: 'audio',
      audio: { type: 'audio', media: 'https://x/a.mp3' }
    })
  })

  it('attaches <figcaption> (with <cite> credit) to the wrapped media', () => {
    const source = '<figure><img src="https://x/p.jpg" tg-spoiler/><figcaption>Cap <cite>Author</cite></figcaption></figure>'

    expect(firstBlock(source)).toEqual({
      type: 'photo',
      photo: { type: 'photo', media: 'https://x/p.jpg', has_spoiler: true },
      caption: { text: 'Cap', credit: 'Author' }
    })
  })

  it('maps <tg-map> with defaults from constants', () => {
    expect(firstBlock('<tg-map lat="55.75" long="37.62"/>')).toEqual({
      type: 'map',
      location: { latitude: 55.75, longitude: 37.62 },
      zoom: DEFAULT_MAP_ZOOM,
      width: DEFAULT_MAP_WIDTH,
      height: DEFAULT_MAP_HEIGHT
    })
    expect(firstBlock('<tg-map lat="1" long="2" zoom="10" width="600" height="300"/>')).toEqual({
      type: 'map',
      location: { latitude: 1, longitude: 2 },
      zoom: 10,
      width: 600,
      height: 300
    })
  })

  it('parses <tg-collage> children as blocks with figcaption caption', () => {
    const source = '<tg-collage><img src="https://a/1.jpg"/><img src="https://a/2.jpg"/><figcaption>c</figcaption></tg-collage>'

    expect(firstBlock(source)).toEqual({
      type: 'collage',
      blocks: [
        { type: 'photo', photo: { type: 'photo', media: 'https://a/1.jpg' } },
        { type: 'photo', photo: { type: 'photo', media: 'https://a/2.jpg' } }
      ],
      caption: { text: 'c' }
    })
  })

  it('maps <tg-slideshow> to slideshow', () => {
    expect(firstBlock('<tg-slideshow><img src="https://a/1.jpg"/></tg-slideshow>')).toEqual({
      type: 'slideshow',
      blocks: [{ type: 'photo', photo: { type: 'photo', media: 'https://a/1.jpg' } }]
    })
  })

  it('parses <table> with caption, header cells, spans, and alignment defaults', () => {
    const source = '<table bordered striped><caption>Cap</caption>' +
      '<tr><th>H</th></tr>' +
      '<tr><td colspan="2" rowspan="3" align="right" valign="top">c</td><td></td></tr></table>'

    expect(firstBlock(source)).toEqual({
      type: 'table',
      cells: [
        [{ text: 'H', is_header: true, align: 'left', valign: 'middle' }],
        [
          { text: 'c', colspan: 2, rowspan: 3, align: 'right', valign: 'top' },
          { align: 'left', valign: 'middle' }
        ]
      ],
      is_bordered: true,
      is_striped: true,
      caption: 'Cap'
    })
  })

  it('maps <details> with open attr and summary', () => {
    expect(firstBlock('<details open><summary><b>S</b></summary><p>Body</p></details>')).toEqual({
      type: 'details',
      summary: { type: 'bold', text: 'S' },
      blocks: [{ type: 'paragraph', text: 'Body' }],
      is_open: true
    })
    expect(firstBlock('<details><summary>S</summary>b</details>')).toEqual({
      type: 'details',
      summary: 'S',
      blocks: [{ type: 'paragraph', text: 'b' }]
    })
  })

  it('requires a summary in strict mode', () => {
    expect(() => parseHtml('<details>b</details>')).toThrow(RichParseError)
  })

  it('maps <tg-math-block> to a block mathematical_expression', () => {
    expect(firstBlock('<tg-math-block>E = mc^2</tg-math-block>')).toEqual({
      type: 'mathematical_expression',
      expression: 'E = mc^2'
    })
  })

  it('maps <blockquote expandable> to an expandable_blockquote with inline text', () => {
    expect(firstBlock('<blockquote expandable>long<cite>sage</cite></blockquote>')).toEqual({
      type: 'expandable_blockquote',
      text: 'long',
      credit: 'sage'
    })
  })

  it('accepts the collapsed spelling the object docs used before 10.3.2', () => {
    expect(firstBlock('<blockquote collapsed>long</blockquote>')).toEqual({
      type: 'expandable_blockquote',
      text: 'long'
    })
  })

  it('keeps a plain <blockquote> block-nested', () => {
    expect(firstBlock('<blockquote>long</blockquote>')).toEqual({
      type: 'blockquote',
      blocks: [{ type: 'paragraph', text: 'long' }]
    })
  })

  it('maps <tg-document> to a document block', () => {
    expect(firstBlock('<tg-document src="https://x/d.zip"></tg-document>')).toEqual({
      type: 'document',
      document: { type: 'document', media: 'https://x/d.zip' }
    })
  })

  it('captions a <tg-document> through <figure>', () => {
    expect(firstBlock('<figure><tg-document src="https://x/d.zip"></tg-document><figcaption>files</figcaption></figure>')).toEqual({
      type: 'document',
      document: { type: 'document', media: 'https://x/d.zip' },
      caption: { text: 'files' }
    })
  })

  it('requires a src on <tg-document>', () => {
    expect(() => parseHtml('<tg-document></tg-document>')).toThrow(RichParseError)
  })

  it('reads the compact table attribute', () => {
    expect(firstBlock('<table compact><tr><td>x</td></tr></table>')).toMatchObject({ is_compact: true })
    expect(firstBlock('<table><tr><td>x</td></tr></table>')).not.toHaveProperty('is_compact')
  })
})

describe('entities', () => {
  it('decodes numeric entities, decimal and hex', () => {
    expect(paragraphText('<p>&#60;&#x3C;&#X3c;</p>')).toBe('<<<')
  })

  it('decodes the full named set', () => {
    const source = '&lt;&gt;&amp;&quot;&apos;&nbsp;&hellip;&mdash;&ndash;&lsquo;&rsquo;&ldquo;&rdquo;'

    expect(paragraphText(source)).toBe('<>&"\'\u00a0\u2026\u2014\u2013\u2018\u2019\u201c\u201d')
  })

  it('decodes entities in attribute values', () => {
    expect(paragraphText('<a href="https://e.com/?a=1&amp;b=2">x</a>')).toEqual({
      type: 'url',
      text: 'x',
      url: 'https://e.com/?a=1&b=2'
    })
  })

  it('throws on unknown named entities in strict mode, with position', () => {
    const error = caught(() => parseHtml('ab &copy;'))

    expect(error).toBeInstanceOf(RichParseError)
    expect(error.message).toContain('unknown named entity &copy;')
    expect(error.position).toBe(3)
    expect(error.source).toBe('ab &copy;')
  })

  it('keeps unknown entities literal in lenient mode', () => {
    expect(paragraphText('&copy;', { lenient: true })).toBe('&copy;')
  })

  it('rejects numeric entities that decode to c0 controls', () => {
    const error = caught(() => parseHtml('<p>x &#1;0&#1; y</p>'))

    expect(error).toBeInstanceOf(RichParseError)
    expect(error.message).toContain('malformed numeric entity &#1;')
    expect(paragraphText('<p>x &#1;0&#1; y</p>', { lenient: true })).toBe('x &#1;0&#1; y')
    expect(paragraphText('<p>a&#10;b&#9;c</p>')).toBe('a\nb\tc')
  })

  it('keeps a bare ampersand literal in both modes', () => {
    expect(paragraphText('a & b')).toBe('a & b')
  })

  it('does not re-parse decoded angle brackets as tags', () => {
    expect(paragraphText('&lt;b&gt;x&lt;/b&gt;')).toBe('<b>x</b>')
  })

  it('decodes attribute values leniently even in strict mode', () => {
    expect(paragraphText('<a href="https://e.com" style="&copy;">x</a>')).toEqual({
      type: 'url',
      text: 'x',
      url: 'https://e.com'
    })
  })
})

describe('whitespace and paragraph coalescing', () => {
  it('collapses whitespace runs to a single space', () => {
    expect(paragraphText('<p>a\n   b</p>')).toBe('a b')
  })

  it('coalesces top-level inline content into paragraphs around blocks', () => {
    expect(parseHtml('hello <b>w</b>\n<h1>T</h1>\n\n  tail ')).toEqual([
      { type: 'paragraph', text: ['hello ', { type: 'bold', text: 'w' }] },
      { type: 'heading', text: 'T', size: 1 },
      { type: 'paragraph', text: 'tail' }
    ])
  })

  it('drops whitespace-only runs between blocks', () => {
    expect(parseHtml('<h1>a</h1> \n <h2>b</h2>')).toEqual([
      { type: 'heading', text: 'a', size: 1 },
      { type: 'heading', text: 'b', size: 2 }
    ])
  })

  it('does not collapse whitespace inside <pre>', () => {
    expect(firstBlock('<pre>a  b\n\nc</pre>')).toEqual({ type: 'pre', text: 'a  b\n\nc' })
  })
})

describe('sentinel passthrough', () => {
  it('keeps \\u0001-delimited sequences literally in emitted text', () => {
    expect(paragraphText('a \u00010\u0001 b')).toBe('a \u00010\u0001 b')
  })

  it('keeps sentinels inside inline wraps and pre', () => {
    expect(paragraphText('<b>\u00012\u0001</b>')).toEqual({ type: 'bold', text: '\u00012\u0001' })
    expect(firstBlock('<pre>\u00013\u0001</pre>')).toEqual({ type: 'pre', text: '\u00013\u0001' })
  })
})

describe('nesting', () => {
  it('parses bold inside li inside blockquote', () => {
    expect(firstBlock('<blockquote><ul><li><b>bold</b> item</li></ul></blockquote>')).toEqual({
      type: 'blockquote',
      blocks: [{
        type: 'list',
        items: [{ blocks: [{ type: 'paragraph', text: [{ type: 'bold', text: 'bold' }, ' item'] }] }]
      }]
    })
  })
})

describe('strict vs lenient', () => {
  it('throws on unknown tags in strict mode, with position', () => {
    const error = caught(() => parseHtml('ab <blink>x</blink>'))

    expect(error).toBeInstanceOf(RichParseError)
    expect(error.message).toContain('unknown tag <blink>')
    expect(error.position).toBe(3)
  })

  it('degrades unknown tags to literal text in lenient mode', () => {
    expect(paragraphText('<p>a <blink>b</blink></p>', { lenient: true })).toBe('a <blink>b</blink>')
  })

  it('throws on unclosed tags in strict mode, degrades in lenient mode', () => {
    expect(() => parseHtml('<b>x')).toThrow('unclosed tag <b>')
    expect(paragraphText('<b>x', { lenient: true })).toBe('<b>x')
  })

  it('ignores disallowed attributes instead of throwing', () => {
    expect(paragraphText('<b class="x" style="y">z</b>')).toEqual({ type: 'bold', text: 'z' })
  })

  it('treats a non-tag "<" as literal text even in strict mode', () => {
    expect(paragraphText('i <3 u')).toBe('i <3 u')
  })

  it('guards nesting depth: RichParseError in strict mode, no throw in lenient mode', () => {
    const deep = '<b>'.repeat(3000) + 'x' + '</b>'.repeat(3000)

    expect(() => parseHtml(deep)).toThrow(RichParseError)
    expect(() => parseHtml(deep, { lenient: true })).not.toThrow()
  })

  it('keeps a trailing slash of an unquoted attribute value', () => {
    expect(firstBlock('<img src=https://x.com/a/>')).toEqual({
      type: 'photo',
      photo: { type: 'photo', media: 'https://x.com/a/' }
    })
  })

  it('rejects tg:// media links in strict mode, keeps them in lenient mode', () => {
    const error = caught(() => parseHtml('<img src="tg://user?id=1"/>'))

    expect(error.message).toContain('tg:// media links only work in raw dialect with media entries')
    expect(firstBlock('<img src="tg://user?id=1"/>', { lenient: true })).toEqual({
      type: 'photo',
      photo: { type: 'photo', media: 'tg://user?id=1' }
    })
  })

  it('throws on block tags in inline context in strict mode', () => {
    expect(() => parseHtml('<h1><p>x</p></h1>')).toThrow('block tag <p> in inline context')
  })
})

describe('parseHtmlFragment', () => {
  it('returns null for unsupported openings', () => {
    expect(parseHtmlFragment('<unknown>x</unknown>', 0, {}, stubHost)).toBeNull()
    expect(parseHtmlFragment('</b>', 0, {}, stubHost)).toBeNull()
    expect(parseHtmlFragment('<3', 0, {}, stubHost)).toBeNull()
  })

  it('returns correct end offsets', () => {
    expect(parseHtmlFragment('<b>hi</b>tail', 0, {}, stubHost)?.end).toBe(9)
    expect(parseHtmlFragment('<hr/>rest', 0, {}, stubHost)?.end).toBe(5)
  })

  it('delegates inner inline content to the host', () => {
    expect(parseHtmlFragment('<h1>ignored</h1>', 0, {}, stubHost)).toEqual({
      level: 'block',
      value: { type: 'heading', text: 'HOSTED', size: 1 },
      end: 16
    })
    expect(parseHtmlFragment('<b>ignored</b>', 0, {}, stubHost)?.value).toEqual({ type: 'bold', text: 'HOSTED' })
  })

  it('delegates inner block content to the host', () => {
    expect(parseHtmlFragment('<blockquote>x</blockquote>', 0, {}, stubHost)).toEqual({
      level: 'block',
      value: { type: 'blockquote', blocks: [{ type: 'divider' }] },
      end: 26
    })
  })
})
