import type { TelegramRichText } from '@puregram/api'

import { type RichContent, emitBlocks, emitText } from '../emit'
import { isRichNode, makeNode } from '../node'

/** hard line break inside inline content */
export function br () {
  return makeNode('inline', () => '\n')
}

/** join an array of content with a separator; any block item makes the result a block list */
export function join (items: RichContent[], separator: RichContent = '') {
  const block = items.some(item => isRichNode(item) && item.level === 'block')

  if (block) {
    return makeNode('block', () => {
      const spaced: RichContent[] = []

      for (let i = 0; i < items.length; i++) {
        if (i > 0) {
          spaced.push(separator)
        }

        spaced.push(items[i])
      }

      return emitBlocks(spaced)
    })
  }

  return makeNode('inline', () => {
    const out: TelegramRichText[] = []

    for (let i = 0; i < items.length; i++) {
      if (i > 0) {
        const sep = emitText(separator)

        if (sep !== '') {
          out.push(sep)
        }
      }

      out.push(emitText(items[i]))
    }

    return out
  })
}
