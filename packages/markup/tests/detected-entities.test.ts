import { describe, expect, it } from 'vitest'

import { bankCardNumber, bold, format, Formatted, html, md, tonAddress } from '../src'

const address = 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c'
const card = '4242 4242 4242 4242'

describe('TON address and bank card entities', () => {
  it('emits UTF-16 ranges in composed text, including an astral prefix', () => {
    const value = format`💎 ${tonAddress(address)} ${bankCardNumber(card)}`

    expect(value.toPayload()).toEqual({
      text: `💎 ${address} ${card}`,
      entities: [
        { type: 'ton_address', offset: 3, length: address.length },
        { type: 'bank_card_number', offset: 4 + address.length, length: card.length }
      ]
    })
  })

  it('supports tagged templates and chains with allowed text styles', () => {
    expect(tonAddress`${address}`.entities).toEqual([
      { type: 'ton_address', offset: 0, length: address.length }
    ])
    expect(bankCardNumber.bold`${card}`.entities).toEqual([
      { type: 'bank_card_number', offset: 0, length: card.length },
      { type: 'bold', offset: 0, length: card.length }
    ])
    expect(bold.tonAddress(address).entities).toEqual([
      { type: 'bold', offset: 0, length: address.length },
      { type: 'ton_address', offset: 0, length: address.length }
    ])
  })

  it('round-trips received raw message and caption entities without extra fields', () => {
    const value = format`${tonAddress(address)} ${bankCardNumber(card)}`
    const payload = value.toPayload()

    expect(Formatted.fromMessage(payload).toPayload()).toEqual(payload)
    expect(Formatted.fromMessage({
      raw: { caption: payload.text, caption_entities: payload.entities }
    }).toPayload()).toEqual(payload)
  })

  it('uses escaped visible text in HTML/Markdown rather than unsupported entity syntax', () => {
    const value = bold.tonAddress('wallet <one> & *two*')
    const visible = bold('wallet <one> & *two*').toPayload()

    expect(html(value.toHtml()).toPayload()).toEqual(visible)
    expect(md(value.toMarkdown()).toPayload()).toEqual(visible)
    expect(bankCardNumber(card).toHtml()).toBe(card)
    expect(bankCardNumber(card).toMarkdown()).toBe(card)
  })

  it('does not guess detected entities when parsing plain text', () => {
    const source = `${address} ${card}`

    expect(html(source).toPayload()).toEqual({ text: source, entities: [] })
    expect(md(source).toPayload()).toEqual({ text: source, entities: [] })
  })
})
