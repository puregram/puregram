import { describe, expect, it } from 'vitest'

import {
  blockquote, codeBlock, details, divider, expandableBlockquote, expandableQuote, fn, footer, footnote,
  h1, h2, h3, h4, h5, h6, heading, hr, list, mathBlock, orderedList, paragraph, pre, pullQuote, quote,
  taskList, thinking
} from '../src/builders/block'
import { bold } from '../src/builders/inline'

describe('heading', () => {
  it('tags the size', () => {
    expect(heading(2, 'x').emit()).toEqual({ type: 'heading', text: 'x', size: 2 })
  })

  it('h1..h6 pin their level', () => {
    const shortcuts = [h1, h2, h3, h4, h5, h6]

    shortcuts.forEach((h, i) => {
      expect(h('x').emit()).toEqual({ type: 'heading', text: 'x', size: i + 1 })
    })
  })
})

describe('paragraph / codeBlock', () => {
  it('paragraph wraps inline content', () => {
    expect(paragraph('x').emit()).toEqual({ type: 'paragraph', text: 'x' })
    expect(paragraph(bold('x')).emit()).toEqual({ type: 'paragraph', text: { type: 'bold', text: 'x' } })
  })

  it('codeBlock includes the language only when given', () => {
    expect(codeBlock('const a = 1').emit()).toEqual({ type: 'pre', text: 'const a = 1' })
    expect(codeBlock('const a = 1', 'ts').emit()).toEqual({ type: 'pre', text: 'const a = 1', language: 'ts' })
  })
})

describe('blockquote / pullQuote', () => {
  it('blockquote nests blocks and includes the credit only when given', () => {
    expect(blockquote('q').emit()).toEqual({ type: 'blockquote', blocks: [{ type: 'paragraph', text: 'q' }] })
    expect(blockquote('q', 'me').emit()).toEqual({
      type: 'blockquote',
      blocks: [{ type: 'paragraph', text: 'q' }],
      credit: 'me'
    })
  })

  it('expandableBlockquote nests blocks and includes an optional credit', () => {
    expect(expandableBlockquote('q').emit()).toEqual({
      type: 'expandable_blockquote',
      blocks: [{ type: 'paragraph', text: 'q' }]
    })
    expect(expandableBlockquote([h2('q'), paragraph('body')], 'me').emit()).toEqual({
      type: 'expandable_blockquote',
      blocks: [{ type: 'heading', text: 'q', size: 2 }, { type: 'paragraph', text: 'body' }],
      credit: 'me'
    })
    expect(expandableQuote).toBe(expandableBlockquote)
  })

  it('pullQuote keeps inline text and an optional credit', () => {
    expect(pullQuote('q').emit()).toEqual({ type: 'pullquote', text: 'q' })
    expect(pullQuote('q', 'me').emit()).toEqual({ type: 'pullquote', text: 'q', credit: 'me' })
  })
})

describe('lists', () => {
  it('list wraps each item in blocks', () => {
    expect(list(['a', 'b']).emit()).toEqual({
      type: 'list',
      items: [
        { blocks: [{ type: 'paragraph', text: 'a' }] },
        { blocks: [{ type: 'paragraph', text: 'b' }] }
      ]
    })
  })

  it('orderedList seeds the values from start and tags type 1', () => {
    expect(orderedList(['a', 'b']).emit()).toEqual({
      type: 'list',
      items: [
        { blocks: [{ type: 'paragraph', text: 'a' }], value: 1, type: '1' },
        { blocks: [{ type: 'paragraph', text: 'b' }], value: 2, type: '1' }
      ]
    })
    expect(orderedList(['a', 'b'], { start: 3 }).emit()).toEqual({
      type: 'list',
      items: [
        { blocks: [{ type: 'paragraph', text: 'a' }], value: 3, type: '1' },
        { blocks: [{ type: 'paragraph', text: 'b' }], value: 4, type: '1' }
      ]
    })
  })

  it('taskList checks the done items', () => {
    expect(taskList([{ text: 'a' }, { text: 'b', done: true }]).emit()).toEqual({
      type: 'list',
      items: [
        { blocks: [{ type: 'paragraph', text: 'a' }], has_checkbox: true },
        { blocks: [{ type: 'paragraph', text: 'b' }], has_checkbox: true, is_checked: true }
      ]
    })
  })
})

describe('details', () => {
  it('includes is_open only when opted in', () => {
    expect(details('s', 'b').emit()).toEqual({
      type: 'details',
      summary: 's',
      blocks: [{ type: 'paragraph', text: 'b' }]
    })
    expect(details('s', 'b', { open: true }).emit()).toEqual({
      type: 'details',
      summary: 's',
      blocks: [{ type: 'paragraph', text: 'b' }],
      is_open: true
    })
  })
})

describe('mathBlock / footer / thinking / divider', () => {
  it('mathBlock emits a block-level expression', () => {
    const node = mathBlock('E=mc^2')

    expect(node.level).toBe('block')
    expect(node.emit()).toEqual({ type: 'mathematical_expression', expression: 'E=mc^2' })
  })

  it('footer and thinking wrap inline text', () => {
    expect(footer('f').emit()).toEqual({ type: 'footer', text: 'f' })
    expect(thinking('hmm').emit()).toEqual({ type: 'thinking', text: 'hmm' })
  })

  it('divider emits a bare block', () => {
    expect(divider().emit()).toEqual({ type: 'divider' })
  })
})

describe('footnote', () => {
  it('emits a paragraph wrapping a named reference', () => {
    expect(footnote('1', 'the definition').emit()).toEqual({
      type: 'paragraph',
      text: { type: 'reference', text: 'the definition', name: '1' }
    })
  })
})

describe('aliases', () => {
  it('re-point at the originals', () => {
    expect(quote).toBe(blockquote)
    expect(pre).toBe(codeBlock)
    expect(hr).toBe(divider)
    expect(fn).toBe(footnote)
  })
})
