import type { TelegramInputRichBlock, TelegramRichText } from '@puregram/api'
import { describe, expect, it } from 'vitest'

import { RichError } from '../src/error'
import { parseHtml } from '../src/parsers/html'
import { parseMarkdown } from '../src/parsers/markdown'
import { serializeBlocks } from '../src/serializers'

const doc: TelegramInputRichBlock[] = [
  { type: 'heading', text: 'Title', size: 1 },
  {
    type: 'paragraph',
    text: [
      'plain ',
      { type: 'bold', text: ['loud ', { type: 'italic', text: 'soft' }] },
      ' ',
      { type: 'spoiler', text: 'hidden' },
      ' ',
      { type: 'marked', text: 'hot' },
      ' ',
      { type: 'code', text: 'x' },
      { type: 'underline', text: 'low' },
      { type: 'strikethrough', text: 'gone' }
    ]
  },
  {
    type: 'paragraph',
    text: [
      { type: 'text_mention', text: 'steve', user: { id: 1, is_bot: false, first_name: 'steve' } },
      ' ',
      { type: 'custom_emoji', custom_emoji_id: '5368324170671202286', alternative_text: '👍' },
      ' ',
      { type: 'date_time', text: 'today', unix_time: 1700000000, date_time_format: 'd.m.Y' },
      ' ',
      { type: 'mathematical_expression', expression: 'x^2' }
    ]
  },
  {
    type: 'list',
    items: [
      { blocks: [{ type: 'paragraph', text: 'todo' }], has_checkbox: true },
      { blocks: [{ type: 'paragraph', text: 'done' }], has_checkbox: true, is_checked: true }
    ]
  },
  {
    type: 'list',
    items: [
      { blocks: [{ type: 'paragraph', text: 'third' }], value: 3, type: '1' },
      { blocks: [{ type: 'paragraph', text: 'fourth' }], value: 4, type: '1' }
    ]
  },
  {
    type: 'table',
    cells: [
      [
        { text: 'A', is_header: true, align: 'left', valign: 'middle' },
        { text: 'B', is_header: true, align: 'center', valign: 'middle' },
        { text: 'C', is_header: true, align: 'right', valign: 'middle' }
      ],
      [
        { text: 'a', align: 'left', valign: 'middle' },
        { text: 'b', align: 'center', valign: 'middle' },
        { text: 'c', align: 'right', valign: 'middle' }
      ]
    ],
    is_bordered: true
  },
  { type: 'blockquote', blocks: [{ type: 'paragraph', text: 'wisdom' }], credit: 'sage' },
  { type: 'pullquote', text: 'pulled', credit: 'src' },
  { type: 'details', summary: 'More', blocks: [{ type: 'paragraph', text: 'inside' }], is_open: true },
  {
    type: 'photo',
    photo: { type: 'photo', media: 'https://cdn.example.com/pic.jpg', has_spoiler: true },
    caption: { text: 'a pic', credit: 'ansel' }
  },
  { type: 'map', location: { latitude: 43.65, longitude: -79.38 }, zoom: 15, width: 900, height: 450 },
  { type: 'mathematical_expression', expression: 'E = mc^2' },
  { type: 'paragraph', text: ['see', { type: 'reference_link', text: '1', reference_name: '1' }] },
  { type: 'paragraph', text: { type: 'reference', text: 'the definition', name: '1' } }
]

const MARKDOWN = [
  '# Title',
  'plain **loud *soft*** ||hidden|| ==hot== `x`<u>low</u>~~gone~~',
  '[steve](tg://user?id=1) ![👍](tg://emoji?id=5368324170671202286) ![today](tg://time?unix=1700000000&format=d.m.Y) $x^2$',
  '- [ ] todo\n- [x] done',
  '3. third\n4. fourth',
  '| A | B | C |\n| :-- | :-: | --: |\n| a | b | c |',
  // the `>` grammar has no credit slot, so a credited blockquote falls back to the html tag
  '<blockquote>wisdom<cite>sage</cite></blockquote>',
  '<aside>pulled<cite>src</cite></aside>',
  '<details open><summary>More</summary>\n\ninside\n\n</details>',
  // `![](url "caption")` has no spoiler/credit slot — both drop in markdown
  '![](https://cdn.example.com/pic.jpg "a pic")',
  '<tg-map lat="43.65" long="-79.38" zoom="15"/>',
  '$$E = mc^2$$',
  'see[^1]',
  '[^1]: the definition'
].join('\n\n')

const HTML = [
  '<h1>Title</h1>',
  '<p>plain <b>loud <i>soft</i></b> <tg-spoiler>hidden</tg-spoiler> <mark>hot</mark> <code>x</code><u>low</u><s>gone</s></p>',
  '<p><a href="tg://user?id=1">steve</a> <tg-emoji emoji-id="5368324170671202286">👍</tg-emoji> <tg-time unix="1700000000" format="d.m.Y">today</tg-time> <tg-math>x^2</tg-math></p>',
  '<ul><li>☐ todo</li><li>☑ done</li></ul>',
  '<ol start="3"><li>third</li><li>fourth</li></ol>',
  '<table bordered><tr><th>A</th><th align="center">B</th><th align="right">C</th></tr><tr><td>a</td><td align="center">b</td><td align="right">c</td></tr></table>',
  '<blockquote>wisdom<cite>sage</cite></blockquote>',
  '<aside>pulled<cite>src</cite></aside>',
  '<details open><summary>More</summary><p>inside</p></details>',
  '<figure><img src="https://cdn.example.com/pic.jpg" tg-spoiler/><figcaption>a pic<cite>ansel</cite></figcaption></figure>',
  '<tg-map lat="43.65" long="-79.38" zoom="15"/>',
  '<tg-math-block>E = mc^2</tg-math-block>',
  '<p>see<a href="#1">1</a></p>',
  '<tg-reference name="1">the definition</tg-reference>'
].join('')

describe('serializeBlocks', () => {
  it('serializes a composite document to markdown', () => {
    expect(serializeBlocks(doc, 'markdown')).toBe(MARKDOWN)
  })

  it('serializes a composite document to html', () => {
    expect(serializeBlocks(doc, 'html')).toBe(HTML)
  })

  it('escapes literal specials per dialect', () => {
    const blocks: TelegramInputRichBlock[] = [{ type: 'paragraph', text: 'a *b* _c_ [d] <e> & "f"' }]

    expect(serializeBlocks(blocks, 'markdown')).toBe('a \\*b\\* \\_c\\_ \\[d\\] &#60;e&#62; &#38; "f"')
    expect(serializeBlocks(blocks, 'html')).toBe('<p>a *b* _c_ [d] &#60;e&#62; &#38; &#34;f&#34;</p>')
  })

  it('passes interpolation sentinels through unescaped', () => {
    const blocks: TelegramInputRichBlock[] = [{ type: 'paragraph', text: '\u00010\u0001 and *x*' }]

    expect(serializeBlocks(blocks, 'markdown')).toBe('\u00010\u0001 and \\*x\\*')
    expect(serializeBlocks(blocks, 'html')).toBe('<p>\u00010\u0001 and *x*</p>')
  })

  it('throws on MediaSource envelope media', () => {
    // an envelope violates the string-typed `media` field on purpose — that is the case under test
    const envelope = { type: 'url', value: 'https://cdn.example.com/pic.jpg' } as unknown as string
    const blocks: TelegramInputRichBlock[] = [{ type: 'photo', photo: { type: 'photo', media: envelope } }]

    expect(() => serializeBlocks(blocks, 'markdown')).toThrow(RichError)
    expect(() => serializeBlocks(blocks, 'html')).toThrow('cannot serialize MediaSource media')
  })

  it('joins multi-block list items with a single newline in markdown', () => {
    // chosen shape: item blocks stack line-by-line under one marker, no indented continuation
    const blocks: TelegramInputRichBlock[] = [{
      type: 'list',
      items: [{ blocks: [{ type: 'paragraph', text: 'first' }, { type: 'paragraph', text: 'second' }] }]
    }]

    expect(serializeBlocks(blocks, 'markdown')).toBe('- first\nsecond')
    expect(serializeBlocks(blocks, 'html')).toBe('<ul><li>firstsecond</li></ul>')
  })

  it('prefixes every blockquote line with > and separates inner blocks with a lone >', () => {
    const blocks: TelegramInputRichBlock[] = [{
      type: 'blockquote',
      blocks: [{ type: 'paragraph', text: 'one' }, { type: 'paragraph', text: 'two' }]
    }]

    expect(serializeBlocks(blocks, 'markdown')).toBe('>one\n>\n>two')
    expect(serializeBlocks(blocks, 'html')).toBe('<blockquote>one<br>two</blockquote>')
  })

  it('serializes code fences and remaining media kinds', () => {
    const pre: TelegramInputRichBlock[] = [{ type: 'pre', text: 'const x = 1', language: 'ts' }]

    expect(serializeBlocks(pre, 'markdown')).toBe('```ts\nconst x = 1\n```')
    expect(serializeBlocks(pre, 'html')).toBe('<pre><code class="language-ts">const x = 1</code></pre>')

    const rest: TelegramInputRichBlock[] = [
      { type: 'animation', animation: { type: 'animation', media: 'https://x.example/a.gif' } },
      { type: 'voice_note', voice_note: { type: 'voice_note', media: 'https://x.example/v.ogg' } },
      { type: 'divider' },
      { type: 'thinking', text: 'hmm' }
    ]

    expect(serializeBlocks(rest, 'markdown')).toBe([
      '![](https://x.example/a.gif)',
      '![](https://x.example/v.ogg)',
      '---',
      '<tg-thinking>hmm</tg-thinking>'
    ].join('\n\n'))
    expect(serializeBlocks(rest, 'html')).toBe('<video src="https://x.example/a.gif"></video><audio src="https://x.example/v.ogg"></audio><hr/><tg-thinking>hmm</tg-thinking>')
  })

  it('serializes collage media on their own lines, blank lines isolating them from the tags', () => {
    const blocks: TelegramInputRichBlock[] = [{
      type: 'collage',
      blocks: [
        { type: 'photo', photo: { type: 'photo', media: 'https://x.example/a.jpg' } },
        { type: 'photo', photo: { type: 'photo', media: 'https://x.example/b.jpg' } }
      ],
      caption: { text: 'two' }
    }]

    expect(serializeBlocks(blocks, 'markdown')).toBe('<tg-collage>\n\n![](https://x.example/a.jpg)\n![](https://x.example/b.jpg)\n\n<figcaption>two</figcaption></tg-collage>')
    expect(serializeBlocks(blocks, 'html')).toBe('<tg-collage><img src="https://x.example/a.jpg"/><img src="https://x.example/b.jpg"/><figcaption>two</figcaption></tg-collage>')
  })

  it('emits map width/height only when they differ from the defaults', () => {
    const custom: TelegramInputRichBlock[] = [
      { type: 'map', location: { latitude: 1, longitude: 2 }, zoom: 10, width: 600, height: 300 }
    ]

    expect(serializeBlocks(custom, 'markdown')).toBe('<tg-map lat="1" long="2" zoom="10" width="600" height="300"/>')
    expect(serializeBlocks(custom, 'html')).toBe('<tg-map lat="1" long="2" zoom="10" width="600" height="300"/>')
  })

  it('uri-encodes the date_time format in markdown urls', () => {
    const blocks: TelegramInputRichBlock[] = [
      { type: 'paragraph', text: { type: 'date_time', text: 't', unix_time: 1, date_time_format: 'd&m 100%' } }
    ]

    expect(serializeBlocks(blocks, 'markdown')).toBe('![t](tg://time?unix=1&format=d%26m%20100%25)')
  })

  it('neutralizes a leading ordered-list lookalike in paragraphs', () => {
    const blocks: TelegramInputRichBlock[] = [{ type: 'paragraph', text: '1. not a list' }]

    expect(serializeBlocks(blocks, 'markdown')).toBe('1&#46; not a list')
    expect(serializeBlocks(blocks, 'html')).toBe('<p>1. not a list</p>')
  })

  it('entity-encodes literal newlines inside single-line markdown constructs', () => {
    const blocks: TelegramInputRichBlock[] = [
      { type: 'heading', text: 'a\nb', size: 2 },
      { type: 'table', cells: [[{ text: 'x\ny', align: 'left', valign: 'middle' }]] },
      { type: 'paragraph', text: { type: 'reference', text: 'c\nd', name: 'n' } },
      { type: 'photo', photo: { type: 'photo', media: 'https://x.example/p.jpg' }, caption: { text: 'e\nf' } }
    ]

    expect(serializeBlocks(blocks, 'markdown')).toBe([
      '## a&#10;b',
      '| x&#10;y |\n| :-- |',
      '[^n]: c&#10;d',
      '![](https://x.example/p.jpg "e&#10;f")'
    ].join('\n\n'))
  })

  it('entity-encodes whitespace in html text but keeps pre bodies raw', () => {
    const inline: TelegramInputRichBlock[] = [{ type: 'paragraph', text: ['a', '\n', 'b\tc'] }]
    const pre: TelegramInputRichBlock[] = [{ type: 'pre', text: 'line1\nline2' }]

    expect(serializeBlocks(inline, 'html')).toBe('<p>a&#10;b&#9;c</p>')
    expect(parseHtml(serializeBlocks(inline, 'html'))).toEqual([{ type: 'paragraph', text: 'a\nb\tc' }])
    expect(serializeBlocks(pre, 'html')).toBe('<pre><code>line1\nline2</code></pre>')
    expect(parseHtml(serializeBlocks(pre, 'html'))).toEqual(pre)
  })

  it('keeps a markdown paragraph whole when its text holds blank lines', () => {
    const blocks: TelegramInputRichBlock[] = [{ type: 'paragraph', text: 'a\n\nb' }]
    const styled: TelegramInputRichBlock[] = [{ type: 'paragraph', text: { type: 'bold', text: 'a\n\nb' } }]

    expect(serializeBlocks(blocks, 'markdown')).toBe('a&#10;\nb')
    expect(parseMarkdown(serializeBlocks(blocks, 'markdown'))).toEqual(blocks)
    expect(parseMarkdown(serializeBlocks(styled, 'markdown'))).toEqual(styled)
    expect(serializeBlocks([{ type: 'paragraph', text: 'a\nb' }], 'markdown')).toBe('a\nb')
  })

  it('emits math through the tag form when the dollar delimiters cannot carry it', () => {
    const inline: TelegramInputRichBlock[] = [
      { type: 'paragraph', text: { type: 'mathematical_expression', expression: 'a $ b' } }
    ]
    const block: TelegramInputRichBlock[] = [{ type: 'mathematical_expression', expression: 'a $$ b' }]

    expect(serializeBlocks(inline, 'markdown')).toBe('<tg-math>a $ b</tg-math>')
    expect(parseMarkdown(serializeBlocks(inline, 'markdown'))).toEqual(inline)
    expect(serializeBlocks(block, 'markdown')).toBe('<tg-math-block>a $$ b</tg-math-block>')
    expect(parseMarkdown(serializeBlocks(block, 'markdown'))).toEqual(block)
    expect(serializeBlocks([{ type: 'paragraph', text: { type: 'mathematical_expression', expression: 'x^2' } }], 'markdown')).toBe('$x^2$')
  })

  it('refuses to serialize a math expression that closes its own html tag', () => {
    const blocks: TelegramInputRichBlock[] = [
      { type: 'paragraph', text: { type: 'mathematical_expression', expression: 'a </tg-math> b' } }
    ]

    expect(() => serializeBlocks(blocks, 'html')).toThrow(RichError)
    expect(() => serializeBlocks([{ type: 'mathematical_expression', expression: '</tg-math-block>' }], 'html')).toThrow(RichError)
  })

  it('separates credited-blockquote inner blocks with blank lines in markdown', () => {
    const blocks: TelegramInputRichBlock[] = [{
      type: 'blockquote',
      blocks: [{ type: 'paragraph', text: 'one' }, { type: 'paragraph', text: 'two' }],
      credit: 'sage'
    }]

    expect(serializeBlocks(blocks, 'markdown')).toBe('<blockquote>one\n\ntwo<cite>sage</cite></blockquote>')
    expect(serializeBlocks(blocks, 'html')).toBe('<blockquote>one<br>two<cite>sage</cite></blockquote>')
  })

  it('serializes an expandable blockquote through the html tag in both dialects', () => {
    const blocks: TelegramInputRichBlock[] = [
      { type: 'expandable_blockquote', text: 'long', credit: 'sage' }
    ]

    expect(serializeBlocks(blocks, 'html')).toBe('<blockquote expandable>long<cite>sage</cite></blockquote>')
    expect(serializeBlocks(blocks, 'markdown')).toBe('<blockquote expandable>long<cite>sage</cite></blockquote>')
  })

  it('serializes a document block and its caption', () => {
    const blocks: TelegramInputRichBlock[] = [{
      type: 'document',
      document: { type: 'document', media: 'https://x.example/d.zip' },
      caption: { text: 'files' }
    }]

    expect(serializeBlocks(blocks, 'html'))
      .toBe('<figure><tg-document src="https://x.example/d.zip"></tg-document><figcaption>files</figcaption></figure>')
    expect(serializeBlocks(blocks, 'markdown')).toBe('![](https://x.example/d.zip "files")')
  })

  it('emits the compact table attribute in html only', () => {
    const blocks: TelegramInputRichBlock[] = [{
      type: 'table',
      cells: [[{ text: 'x', align: 'left', valign: 'middle' }]],
      is_compact: true
    }]

    expect(serializeBlocks(blocks, 'html')).toBe('<table compact><tr><td>x</td></tr></table>')
    expect(serializeBlocks(blocks, 'markdown')).toBe('| x |\n| :-- |')
  })

  it('keeps markdown code spans literal and falls back to the tag for a backtick', () => {
    const literal: TelegramInputRichBlock[] = [{ type: 'paragraph', text: { type: 'code', text: 'x[0] && y & z' } }]
    const ticked: TelegramInputRichBlock[] = [{ type: 'paragraph', text: { type: 'code', text: 'a`b' } }]

    expect(serializeBlocks(literal, 'markdown')).toBe('`x[0] && y & z`')
    expect(parseMarkdown(serializeBlocks(literal, 'markdown'))).toEqual(literal)
    expect(serializeBlocks(ticked, 'markdown')).toBe('<code>a&#96;b</code>')
    expect(parseMarkdown(serializeBlocks(ticked, 'markdown'))).toEqual(ticked)
  })

  it('throws RichError on unknown nodes', () => {
    // runtime data outside the closed union — that is the case under test
    const bogus = { type: 'wat' } as unknown as TelegramInputRichBlock
    const bogusText = { type: 'wat' } as unknown as TelegramRichText

    expect(() => serializeBlocks([bogus], 'markdown')).toThrow(RichError)
    expect(() => serializeBlocks([{ type: 'paragraph', text: bogusText }], 'html')).toThrow(RichError)
  })
})
