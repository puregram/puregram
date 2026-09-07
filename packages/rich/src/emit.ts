import type { TelegramInputRichBlock, TelegramRichText } from '@puregram/api'

import { RichError } from './error'
import { type RichNode, isRichNode } from './node'
import { Rich } from './rich'

/** anything a builder, composition call, or parser interpolation accepts as content */
export type RichContent = string | number | RichNode | Rich | null | undefined | false | RichContent[]

/** resolve content into `RichText` — strings stay raw, telegram never re-parses blocks */
export function emitText (value: RichContent): TelegramRichText {
  if (value === null || value === undefined || value === false) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number') {
    return String(value)
  }

  if (Array.isArray(value)) {
    const parts = value.map(v => emitText(v)).filter(v => v !== '')

    if (parts.length === 0) {
      return ''
    }

    // a one-element RichText array is wire noise — collapse to the element
    return parts.length === 1 ? parts[0]! : parts
  }

  if (value instanceof Rich) {
    throw new RichError('cannot use a Rich envelope inside inline content')
  }

  if (isRichNode(value)) {
    if (value.level === 'block') {
      throw new RichError('cannot use a block builder inside inline content')
    }

    // level === 'inline' guarantees a RichText emission; RichEmit can't express the pairing
    const emitted = value.emit() as TelegramRichText

    return emitted
  }

  throw new RichError(`unsupported rich content: ${typeof value}`)
}

/** resolve content into a block list — runs of inline content coalesce into paragraphs */
export function emitBlocks (value: RichContent) {
  const blocks: TelegramInputRichBlock[] = []
  let run: TelegramRichText[] = []

  const flush = () => {
    if (run.length > 0) {
      blocks.push({ type: 'paragraph', text: run.length === 1 ? run[0]! : run })
      run = []
    }
  }

  const visit = (v: RichContent) => {
    if (v === null || v === undefined || v === false) {
      return
    }

    if (Array.isArray(v)) {
      for (const item of v) {
        visit(item)
      }

      return
    }

    if (v instanceof Rich) {
      if (v.dialect !== 'blocks') {
        throw new RichError(`cannot compose a raw ${v.dialect} Rich into blocks — parse it or use builders`)
      }

      flush()

      // dialect === 'blocks' guarantees the block-list payload; the class can't express the pair
      const spliced = v.content as TelegramInputRichBlock[]

      blocks.push(...spliced)

      return
    }

    if (isRichNode(v) && v.level === 'block') {
      flush()

      // level === 'block' guarantees a block emission; RichEmit can't express the pairing
      const emitted = v.emit() as TelegramInputRichBlock | TelegramInputRichBlock[]

      if (Array.isArray(emitted)) {
        blocks.push(...emitted)
      } else {
        blocks.push(emitted)
      }

      return
    }

    const text = emitText(v)

    if (text !== '') {
      run.push(text)
    }
  }

  visit(value)
  flush()

  return blocks
}
