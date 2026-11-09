import type { TelegramRichText } from '@puregram/api'
import { describe, expect, it } from 'vitest'

import { rich, tonAddress } from '../src'
import { expandText } from '../src/parsers/sentinel'

const address = 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c'

describe('TON addresses', () => {
  it('exports a native inline builder with independent address and nested label', () => {
    const node = tonAddress(['wallet ', rich.bold('owner')], address)

    expect(node.level).toBe('inline')
    expect(node.emit()).toEqual({
      type: 'ton_address',
      text: ['wallet ', { type: 'bold', text: 'owner' }],
      address
    })
    expect(rich.tonAddress).toBe(tonAddress)
    expect(rich(node).noEntityDetection().toInputRichMessage()).toEqual({
      blocks: [{ type: 'paragraph', text: node.emit() }],
      skip_entity_detection: true
    })
  })

  it('preserves explicit nodes interpolated in either local parser', () => {
    const node = rich.tonAddress(rich.italic('wallet'), address)
    const expected = [{ type: 'paragraph', text: ['pay ', node.emit()] }]

    expect(rich.md`pay ${node}`.blocks).toEqual(expected)
    expect(rich.html`<p>pay ${node}</p>`.blocks).toEqual(expected)
  })

  it('expands plain address fields and nested text without mutating the source', () => {
    const node: TelegramRichText = {
      type: 'ton_address', address: '\u00010\u0001', text: { type: 'bold', text: '\u00011\u0001' }
    }

    expect(expandText(node, [address, 'wallet'])).toEqual({
      type: 'ton_address', address, text: { type: 'bold', text: 'wallet' }
    })
    expect(node.address).toBe('\u00010\u0001')
  })

  it('serializes visible text and nested formatting without inventing dialect syntax', () => {
    const value = rich(rich.tonAddress(rich.bold('wallet <one> & *two*'), address))
    const expected = [{ type: 'paragraph', text: { type: 'bold', text: 'wallet <one> & *two*' } }]

    expect(rich.html(value.toHtml()).blocks).toEqual(expected)
    expect(rich.md(value.toMarkdown()).blocks).toEqual(expected)
    expect(value.toHtml()).not.toContain(address)
    expect(value.toMarkdown()).not.toContain(address)
  })

  it('leaves bare addresses as text locally and raw envelopes server-parsed', () => {
    const card = '4242 4242 4242 4242'
    const source = `${address} ${card}`

    expect(rich.md(source).blocks).toEqual([{ type: 'paragraph', text: source }])
    expect(rich.html(`<p>${source}</p>`).blocks).toEqual([{ type: 'paragraph', text: source }])
    expect(rich.raw.md(source).toInputRichMessage()).toEqual({ markdown: source })
    expect(rich.raw.html(`<p>${source}</p>`).toInputRichMessage()).toEqual({ html: `<p>${source}</p>` })
  })
})
