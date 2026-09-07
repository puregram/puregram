import { describe, expect, it } from 'vitest'

import { bold, heading, photo } from '../../src/builders'
import { RichParseError } from '../../src/error'
import { rich } from '../../src/namespace'
import { parseMarkdown } from '../../src/parsers/markdown'

describe('parseMarkdown — blocks', () => {
  it('parses headings of every size', () => {
    expect(parseMarkdown('# one')).toEqual([{ type: 'heading', text: 'one', size: 1 }])
    expect(parseMarkdown('###### six')).toEqual([{ type: 'heading', text: 'six', size: 6 }])
  })

  it('parses paragraphs and keeps adjacent lines together', () => {
    expect(parseMarkdown('a\nb\n\nc')).toEqual([
      { type: 'paragraph', text: 'a\nb' },
      { type: 'paragraph', text: 'c' }
    ])
  })

  it('parses code fences with and without language', () => {
    expect(parseMarkdown('```ts\nconst x = 1\n```')).toEqual([{ type: 'pre', text: 'const x = 1', language: 'ts' }])
    expect(parseMarkdown('```\nplain\n```')).toEqual([{ type: 'pre', text: 'plain' }])
  })

  it('keeps markdown tokens literal inside fences', () => {
    expect(parseMarkdown('```\n**not bold**\n```')).toEqual([{ type: 'pre', text: '**not bold**' }])
  })

  it('parses a math fence into a mathematical expression', () => {
    expect(parseMarkdown('```math\nE = mc^2\n```')).toEqual([{ type: 'mathematical_expression', expression: 'E = mc^2' }])
  })

  it('parses block math in single-line and multi-line form', () => {
    expect(parseMarkdown('$$ E = mc^2 $$')).toEqual([{ type: 'mathematical_expression', expression: 'E = mc^2' }])
    expect(parseMarkdown('$$\nE = mc^2\n$$')).toEqual([{ type: 'mathematical_expression', expression: 'E = mc^2' }])
  })

  it('keeps content that shares the opening line of a math fence', () => {
    expect(parseMarkdown('$$a\nb$$')).toEqual([{ type: 'mathematical_expression', expression: 'a\nb' }])
    expect(parseMarkdown(rich([rich.mathBlock('a\nb')]).toMarkdown())).toEqual([
      { type: 'mathematical_expression', expression: 'a\nb' }
    ])
  })

  it('parses dividers', () => {
    expect(parseMarkdown('---')).toEqual([{ type: 'divider' }])
  })

  it('parses blockquotes recursively', () => {
    expect(parseMarkdown('> quoted\n> # deep')).toEqual([{
      type: 'blockquote',
      blocks: [
        { type: 'paragraph', text: 'quoted' },
        { type: 'heading', text: 'deep', size: 1 }
      ]
    }])
  })

  it('parses bullet lists', () => {
    expect(parseMarkdown('- a\n- b')).toEqual([{
      type: 'list',
      items: [
        { blocks: [{ type: 'paragraph', text: 'a' }] },
        { blocks: [{ type: 'paragraph', text: 'b' }] }
      ]
    }])
  })

  it('parses ordered lists seeding values from the written numbers', () => {
    expect(parseMarkdown('3. a\n4. b')).toEqual([{
      type: 'list',
      items: [
        { blocks: [{ type: 'paragraph', text: 'a' }], value: 3, type: '1' },
        { blocks: [{ type: 'paragraph', text: 'b' }], value: 4, type: '1' }
      ]
    }])
  })

  it('parses task lists with checked state', () => {
    expect(parseMarkdown('- [ ] todo\n- [x] done')).toEqual([{
      type: 'list',
      items: [
        { blocks: [{ type: 'paragraph', text: 'todo' }], has_checkbox: true },
        { blocks: [{ type: 'paragraph', text: 'done' }], has_checkbox: true, is_checked: true }
      ]
    }])
  })

  it('parses gfm tables with alignment and a header row', () => {
    const [table] = parseMarkdown('| a | b |\n|:-:|--:|\n| c | d |')

    expect(table).toEqual({
      type: 'table',
      cells: [
        [
          { text: 'a', is_header: true, align: 'center', valign: 'middle' },
          { text: 'b', is_header: true, align: 'right', valign: 'middle' }
        ],
        [
          { text: 'c', align: 'center', valign: 'middle' },
          { text: 'd', align: 'right', valign: 'middle' }
        ]
      ]
    })
  })

  it('parses footnote definitions into reference paragraphs', () => {
    expect(parseMarkdown('[^note]: the definition')).toEqual([{
      type: 'paragraph',
      text: { type: 'reference', text: 'the definition', name: 'note' }
    }])
  })

  it('parses lone media lines into media blocks by extension', () => {
    expect(parseMarkdown('![](https://x.test/a.jpg)')).toEqual([
      { type: 'photo', photo: { type: 'photo', media: 'https://x.test/a.jpg' } }
    ])
    expect(parseMarkdown('![](https://x.test/a.mp4 "clip")')).toEqual([
      { type: 'video', video: { type: 'video', media: 'https://x.test/a.mp4' }, caption: { text: 'clip' } }
    ])
    expect(parseMarkdown('![](https://x.test/a.mp3)')).toEqual([
      { type: 'audio', audio: { type: 'audio', media: 'https://x.test/a.mp3' } }
    ])
    expect(parseMarkdown('![](https://x.test/a.zip "files")')).toEqual([
      { type: 'document', document: { type: 'document', media: 'https://x.test/a.zip' }, caption: { text: 'files' } }
    ])
  })

  it('parses a button row through the html fallback', () => {
    expect(parseMarkdown('<tg-button-row align="center"><tg-button type="callback_data" data="cb">go</tg-button></tg-button-row>'))
      .toEqual([{ type: 'buttons', align: 'center', buttons: [{ text: 'go', callback_data: 'cb' }] }])
  })

  it('keeps an inline button inside a markdown paragraph', () => {
    expect(parseMarkdown('press <tg-button type="url" url="https://t.me">**me**</tg-button>')).toEqual([{
      type: 'paragraph',
      text: [
        'press ',
        { type: 'button', button: { text: { type: 'bold', text: 'me' }, url: 'https://t.me' } }
      ]
    }])
  })
})

describe('parseMarkdown — inline', () => {
  it('parses every delimiter pair', () => {
    expect(parseMarkdown('**b**')).toEqual([{ type: 'paragraph', text: { type: 'bold', text: 'b' } }])
    expect(parseMarkdown('__b__')).toEqual([{ type: 'paragraph', text: { type: 'bold', text: 'b' } }])
    expect(parseMarkdown('*i*')).toEqual([{ type: 'paragraph', text: { type: 'italic', text: 'i' } }])
    expect(parseMarkdown('~~s~~')).toEqual([{ type: 'paragraph', text: { type: 'strikethrough', text: 's' } }])
    expect(parseMarkdown('||sp||')).toEqual([{ type: 'paragraph', text: { type: 'spoiler', text: 'sp' } }])
    expect(parseMarkdown('==m==')).toEqual([{ type: 'paragraph', text: { type: 'marked', text: 'm' } }])
  })

  it('parses nested emphasis', () => {
    expect(parseMarkdown('**a *b* c**')).toEqual([{
      type: 'paragraph',
      text: { type: 'bold', text: ['a ', { type: 'italic', text: 'b' }, ' c'] }
    }])
  })

  it('keeps inline code raw', () => {
    expect(parseMarkdown('`**x**`')).toEqual([{ type: 'paragraph', text: { type: 'code', text: '**x**' } }])
  })

  it('parses inline math raw', () => {
    expect(parseMarkdown('$x^2$')).toEqual([{ type: 'paragraph', text: { type: 'mathematical_expression', expression: 'x^2' } }])
  })

  it('parses links and in-document anchor links', () => {
    expect(parseMarkdown('[text](https://x.test)')).toEqual([{
      type: 'paragraph',
      text: { type: 'url', text: 'text', url: 'https://x.test' }
    }])
    expect(parseMarkdown('[up](#top)')).toEqual([{
      type: 'paragraph',
      text: { type: 'anchor_link', text: 'up', anchor_name: 'top' }
    }])
  })

  it('parses custom emoji and date-time images inline', () => {
    expect(parseMarkdown('a ![😀](tg://emoji?id=5100) b')).toEqual([{
      type: 'paragraph',
      text: ['a ', { type: 'custom_emoji', custom_emoji_id: '5100', alternative_text: '😀' }, ' b']
    }])
    expect(parseMarkdown('at ![then](tg://time?unix=1700000000&format=d.m.Y)')).toEqual([{
      type: 'paragraph',
      text: ['at ', { type: 'date_time', text: 'then', unix_time: 1700000000, date_time_format: 'd.m.Y' }]
    }])
  })

  it('parses footnote reference markers', () => {
    expect(parseMarkdown('fact[^1]')).toEqual([{
      type: 'paragraph',
      text: ['fact', { type: 'reference_link', text: '1', reference_name: '1' }]
    }])
  })

  it('honors backslash escapes', () => {
    expect(parseMarkdown('\\*literal\\*')).toEqual([{ type: 'paragraph', text: '*literal*' }])
  })

  it('decodes numeric and known named entities', () => {
    expect(parseMarkdown('5 &#60; 10 &amp; more&#x21;')).toEqual([{ type: 'paragraph', text: '5 < 10 & more!' }])
  })

  it('throws on unknown named entities in strict mode, keeps them in lenient', () => {
    expect(() => parseMarkdown('&copy;')).toThrow(RichParseError)
    expect(parseMarkdown('&copy;', { lenient: true })).toEqual([{ type: 'paragraph', text: '&copy;' }])
  })

  it('throws on unclosed delimiters in strict mode, degrades in lenient', () => {
    expect(() => parseMarkdown('**oops')).toThrow(RichParseError)
    expect(parseMarkdown('**oops', { lenient: true })).toEqual([{ type: 'paragraph', text: '**oops' }])
  })

  it('rejects mid-paragraph http media in strict mode', () => {
    expect(() => parseMarkdown('see ![](https://x.test/a.jpg) here')).toThrow(RichParseError)
  })

  it('reports error positions', () => {
    try {
      parseMarkdown('ok\n**oops')
      expect.unreachable()
    } catch (error) {
      expect(error).toBeInstanceOf(RichParseError)
      expect((error as RichParseError).position).toBe(3)
    }
  })
})

describe('rich.md — templates and interpolation', () => {
  it('parses a template into a blocks envelope', () => {
    const message = rich.md`# hello`

    expect(message.dialect).toBe('blocks')
    expect(message.blocks).toEqual([{ type: 'heading', text: 'hello', size: 1 }])
  })

  it('dedents template skeletons', () => {
    const message = rich.md`
      # title

      body
    `

    expect(message.blocks).toEqual([
      { type: 'heading', text: 'title', size: 1 },
      { type: 'paragraph', text: 'body' }
    ])
  })

  it('splices interpolated strings as literal text, never as syntax', () => {
    const evil = '**not bold** <b>nope</b>'
    const message = rich.md`hello ${evil}`

    expect(message.blocks).toEqual([{ type: 'paragraph', text: ['hello ', evil] }])
  })

  it('splices inline builders into surrounding text', () => {
    const message = rich.md`hello ${bold('world')}!`

    expect(message.blocks).toEqual([{ type: 'paragraph', text: ['hello ', { type: 'bold', text: 'world' }, '!'] }])
  })

  it('splices block values as their own blocks', () => {
    const message = rich.md`intro

${heading(2, 'section')}

outro`

    expect(message.blocks).toEqual([
      { type: 'paragraph', text: 'intro' },
      { type: 'heading', text: 'section', size: 2 },
      { type: 'paragraph', text: 'outro' }
    ])
  })

  it('splices a parsed Rich fragment at block level', () => {
    const fragment = rich.md`**bold** fragment`
    const message = rich.md`before

${fragment}`

    expect(message.blocks).toEqual([
      { type: 'paragraph', text: 'before' },
      { type: 'paragraph', text: [{ type: 'bold', text: 'bold' }, ' fragment'] }
    ])
  })

  it('hoists block values out of paragraph prose as their own blocks', () => {
    expect(rich.md`text ${photo('https://x.test/a.jpg')} more`.blocks).toEqual([
      { type: 'paragraph', text: 'text ' },
      { type: 'photo', photo: { type: 'photo', media: 'https://x.test/a.jpg' } },
      { type: 'paragraph', text: ' more' }
    ])
  })

  it('rejects block values inside non-paragraph inline content', () => {
    expect(() => rich.md`# ${photo('https://x.test/a.jpg')}`).toThrow()
  })

  it('interpolates plain text into fences and rejects rich values inside math', () => {
    const lang = 'ts'
    const message = rich.md`\`\`\`${lang}
const x = ${'1'}
\`\`\``

    expect(message.blocks).toEqual([{ type: 'pre', text: 'const x = 1', language: 'ts' }])
    expect(() => rich.md`$${bold('nope')}$`).toThrow()
  })

  it('splices rich values into inline code — the wire type allows nested rich text', () => {
    expect(rich.md`\`${bold('kept')}\``.blocks).toEqual([{
      type: 'paragraph',
      text: { type: 'code', text: { type: 'bold', text: 'kept' } }
    }])
  })

  it('parses the string call form', () => {
    expect(rich.md('# from a string').blocks).toEqual([{ type: 'heading', text: 'from a string', size: 1 }])
  })

  it('emits builder arrays without parsing', () => {
    expect(rich.md([heading(1, 'x')]).blocks).toEqual([{ type: 'heading', text: 'x', size: 1 }])
  })

  it('exposes a lenient variant', () => {
    expect(rich.md.lenient('**oops').blocks).toEqual([{ type: 'paragraph', text: '**oops' }])
  })

  it('drops a paragraph whose only value is falsy instead of leaking the sentinel', () => {
    expect(rich.md`${false}`.blocks).toEqual([])
    expect(rich.md`${undefined} trailing`.blocks).toEqual([{ type: 'paragraph', text: ' trailing' }])
  })

  it('blanks a falsy value inside a heading or a table cell', () => {
    expect(rich.md`# ${false}`.blocks).toEqual([{ type: 'heading', text: '', size: 1 }])
    expect(rich.md`
      | a | b |
      | - | - |
      | ${false} | x |
    `.blocks).toEqual([{
      type: 'table',
      cells: [
        [
          { text: 'a', is_header: true, align: 'left', valign: 'middle' },
          { text: 'b', is_header: true, align: 'left', valign: 'middle' }
        ],
        [
          { text: '', align: 'left', valign: 'middle' },
          { text: 'x', align: 'left', valign: 'middle' }
        ]
      ]
    }])
  })
})

describe('rich.raw', () => {
  it('passes a native markdown string through unparsed', () => {
    const message = rich.raw.md('# raw **stuff**')

    expect(message.dialect).toBe('markdown')
    expect(message.toInputRichMessage()).toEqual({ markdown: '# raw **stuff**' })
  })

  it('carries media entries for tg:// links', () => {
    const media = [{ id: 'm1', media: { type: 'photo' as const, media: 'https://x.test/a.jpg' } }]
    const message = rich.raw.md('![](tg://photo?id=m1)', { media })

    expect(message.toInputRichMessage()).toEqual({ markdown: '![](tg://photo?id=m1)', media })
  })
})

describe('hardening regressions', () => {
  it('splices adjacent block interpolations in an html template', () => {
    const message = rich.html`
      <h1>${'t'}</h1>
      ${rich.divider()}
      ${rich.codeBlock('const x = 1', 'ts')}
    `

    expect(message.blocks).toEqual([
      { type: 'heading', text: 't', size: 1 },
      { type: 'divider' },
      { type: 'pre', text: 'const x = 1', language: 'ts' }
    ])
  })

  it('expands interpolation inside urls, anchors, emoji ids, and media sources', () => {
    const url = 'https://x.test/page'
    const id = '5100'
    const target = 'top'

    expect(rich.md`[docs](${url})`.blocks).toEqual([{
      type: 'paragraph',
      text: { type: 'url', text: 'docs', url }
    }])
    expect(rich.md`[up](#${target})`.blocks).toEqual([{
      type: 'paragraph',
      text: { type: 'anchor_link', text: 'up', anchor_name: target }
    }])
    expect(rich.md`x ![e](tg://emoji?id=${id})`.blocks).toEqual([{
      type: 'paragraph',
      text: ['x ', { type: 'custom_emoji', custom_emoji_id: id, alternative_text: 'e' }]
    }])
    expect(rich.md`![](${'https://x.test/a.jpg'})`.blocks).toEqual([
      { type: 'photo', photo: { type: 'photo', media: 'https://x.test/a.jpg' } }
    ])
  })

  it('keeps the last cell of a table row without a trailing pipe', () => {
    expect(parseMarkdown('| a | b |\n|---|---|\n| c | d')).toEqual([{
      type: 'table',
      cells: [
        [
          { text: 'a', is_header: true, align: 'left', valign: 'middle' },
          { text: 'b', is_header: true, align: 'left', valign: 'middle' }
        ],
        [
          { text: 'c', align: 'left', valign: 'middle' },
          { text: 'd', align: 'left', valign: 'middle' }
        ]
      ]
    }])
  })

  it('closes emphasis past escaped tokens and code spans', () => {
    expect(parseMarkdown('**a \\*\\* b**')).toEqual([{
      type: 'paragraph',
      text: { type: 'bold', text: 'a ** b' }
    }])
    expect(parseMarkdown('**a `x**` b**')).toEqual([{
      type: 'paragraph',
      text: { type: 'bold', text: ['a ', { type: 'code', text: 'x**' }, ' b'] }
    }])
  })

  it('survives a url with a pipe inside a serialized table cell', () => {
    const source = rich([rich.table([[rich.link('x', 'https://x.test/a|b')]], { header: false })]).toMarkdown()
    const [table] = parseMarkdown(source)

    expect(table).toMatchObject({
      type: 'table',
      cells: [[{ text: { type: 'url', text: 'x', url: 'https://x.test/a%7Cb' } }]]
    })
  })

  it('round-trips a date-time format through serialization', () => {
    const source = rich([rich.paragraph(rich.time('then', 1700000000, '(H)'))]).toMarkdown()
    const [paragraph] = parseMarkdown(source)

    expect(paragraph).toEqual({
      type: 'paragraph',
      text: { type: 'date_time', text: 'then', unix_time: 1700000000, date_time_format: '(H)' }
    })
  })

  it('bounds parse input length', () => {
    expect(() => rich.md('a'.repeat(131073))).toThrow('exceeds')
    expect(rich.md('a'.repeat(64)).blocks).toEqual([{ type: 'paragraph', text: 'a'.repeat(64) }])
  })

  it('bounds nesting depth instead of blowing the stack', () => {
    const deep = `${'>'.repeat(600)} x`

    expect(() => parseMarkdown(deep)).toThrow(RichParseError)
    expect(() => parseMarkdown(deep, { lenient: true })).not.toThrow()
  })

  it('parses crlf sources like lf sources', () => {
    expect(parseMarkdown('# h\r\nbody')).toEqual(parseMarkdown('# h\nbody'))
    expect(parseMarkdown('- a\r\n- b')).toEqual(parseMarkdown('- a\n- b'))
    expect(parseMarkdown('[^1]: note\r\n')).toEqual(parseMarkdown('[^1]: note\n'))
    expect(parseMarkdown('- [x] done\r\n')).toEqual([{
      type: 'list',
      items: [{ blocks: [{ type: 'paragraph', text: 'done' }], has_checkbox: true, is_checked: true }]
    }])
    expect(parseMarkdown('# h\r\nbody')).toEqual([
      { type: 'heading', text: 'h', size: 1 },
      { type: 'paragraph', text: 'body' }
    ])
  })

  it('keeps balanced parens inside a link destination', () => {
    expect(parseMarkdown('[a](https://x.test/Foo_(bar))')).toEqual([{
      type: 'paragraph',
      text: { type: 'url', text: 'a', url: 'https://x.test/Foo_(bar)' }
    }])
    expect(parseMarkdown('see [a](https://x.test/f(b)) end')).toEqual([{
      type: 'paragraph',
      text: ['see ', { type: 'url', text: 'a', url: 'https://x.test/f(b)' }, ' end']
    }])
  })

  it('rejects numeric entities that decode to c0 controls', () => {
    expect(() => parseMarkdown('x &#1;0&#1; y')).toThrow('malformed numeric entity &#1;')
    expect(parseMarkdown('x &#1;0&#1; y', { lenient: true })).toEqual([
      { type: 'paragraph', text: 'x &#1;0&#1; y' }
    ])
    expect(() => rich.md`a${'VALUE'}b &#1;0&#1;`).toThrow(RichParseError)
    expect(parseMarkdown('a&#10;b&#9;c')).toEqual([{ type: 'paragraph', text: 'a\nb\tc' }])
  })
})
