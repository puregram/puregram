import { describe, expect, it } from 'vitest'

import { heading, photo } from '../src/builders/block'
import { br, join } from '../src/builders/compose'
import { bold } from '../src/builders/inline'
import { emitBlocks, emitText } from '../src/emit'
import { RichError } from '../src/error'
import { rich } from '../src/namespace'
import { Rich } from '../src/rich'

describe('emitText', () => {
  it('keeps strings raw and stringifies numbers', () => {
    expect(emitText('**not bold**<b>')).toBe('**not bold**<b>')
    expect(emitText(42)).toBe('42')
  })

  it('blanks out empty values and maps arrays recursively', () => {
    expect(emitText(null)).toBe('')
    expect(emitText(undefined)).toBe('')
    expect(emitText(false)).toBe('')
    expect(emitText([null, false])).toBe('')
    expect(emitText(['a', ['b', 1]])).toEqual(['a', ['b', '1']])
  })

  it('emits inline nodes and rejects block builders', () => {
    expect(emitText(bold('x'))).toEqual({ type: 'bold', text: 'x' })
    expect(() => emitText(heading(1, 'x'))).toThrow(RichError)
  })

  it('rejects Rich envelopes and unknown content', () => {
    expect(() => emitText(new Rich('blocks', []))).toThrow(RichError)
    expect(() => emitText({} as never)).toThrow(RichError)
  })
})

describe('emitBlocks', () => {
  it('coalesces adjacent inline content into one paragraph', () => {
    expect(emitBlocks(['a', bold('b')])).toEqual([
      { type: 'paragraph', text: ['a', { type: 'bold', text: 'b' }] }
    ])
  })

  it('unwraps a single-item run', () => {
    expect(emitBlocks('a')).toEqual([{ type: 'paragraph', text: 'a' }])
  })

  it('splits runs at block builders', () => {
    expect(emitBlocks(['a', heading(1, 'B'), 'c'])).toEqual([
      { type: 'paragraph', text: 'a' },
      { type: 'heading', text: 'B', size: 1 },
      { type: 'paragraph', text: 'c' }
    ])
  })

  it('splices a blocks envelope', () => {
    const env = new Rich('blocks', [{ type: 'divider' }])

    expect(emitBlocks(['a', env])).toEqual([
      { type: 'paragraph', text: 'a' },
      { type: 'divider' }
    ])
  })

  it('throws on a raw-dialect envelope', () => {
    expect(() => emitBlocks(new Rich('markdown', '# x'))).toThrow(RichError)
  })

  it('drops empty values', () => {
    expect(emitBlocks([null, undefined, false, ''])).toEqual([])
  })
})

describe('br', () => {
  it('emits an inline line break', () => {
    expect(br().level).toBe('inline')
    expect(br().emit()).toBe('\n')
  })
})

describe('join', () => {
  it('interleaves the separator between inline items', () => {
    expect(join(['a', bold('b')], ', ').emit()).toEqual(['a', ', ', { type: 'bold', text: 'b' }])
    expect(join(['a', 'b']).emit()).toEqual(['a', 'b'])
  })

  it('goes block-level when any item is a block', () => {
    const joined = join(['a', heading(1, 'B')])

    expect(joined.level).toBe('block')
    expect(joined.emit()).toEqual([
      { type: 'paragraph', text: 'a' },
      { type: 'heading', text: 'B', size: 1 }
    ])
  })
})

describe('rich`…` — the compose template tag', () => {
  it('keeps literal text literal — no parsing', () => {
    expect(rich`**not bold** <b>nope</b>`.blocks).toEqual([
      { type: 'paragraph', text: '**not bold** <b>nope</b>' }
    ])
  })

  it('splices inline values into the surrounding run', () => {
    expect(rich`hello ${bold('world')}!`.blocks).toEqual([
      { type: 'paragraph', text: ['hello ', { type: 'bold', text: 'world' }, '!'] }
    ])
  })

  it('separates paragraphs on blank lines and dedents', () => {
    const message = rich`
      first paragraph

      second ${bold('styled')}
    `

    expect(message.blocks).toEqual([
      { type: 'paragraph', text: 'first paragraph' },
      { type: 'paragraph', text: ['second ', { type: 'bold', text: 'styled' }] }
    ])
  })

  it('gives block values their own block position', () => {
    expect(rich`before ${photo('https://x.test/a.jpg')} after`.blocks).toEqual([
      { type: 'paragraph', text: 'before ' },
      { type: 'photo', photo: { type: 'photo', media: 'https://x.test/a.jpg' } },
      { type: 'paragraph', text: ' after' }
    ])
  })

  it('splices blocks Rich fragments', () => {
    const fragment = rich`fragment ${bold('text')}`

    expect(rich`${fragment}`.blocks).toEqual([
      { type: 'paragraph', text: ['fragment ', { type: 'bold', text: 'text' }] }
    ])
  })

  it('drops a run that emits nothing', () => {
    expect(rich`${false}`.blocks).toEqual([])
    expect(rich`kept ${null}`.blocks).toEqual([{ type: 'paragraph', text: 'kept ' }])
  })
})
