import { describe, it, expect } from 'vitest'

import { InlineKeyboard, InlineKeyboardBuilder } from '../../src/keyboards'

describe('InlineKeyboard', () => {
  it('builds an inline keyboard from rows', () => {
    const kb = InlineKeyboard.keyboard([
      [
        InlineKeyboard.urlButton({ text: 'site', url: 'https://example.com' }),
        InlineKeyboard.textButton({ text: 'click', payload: 'foo' })
      ]
    ])
    const json = kb.toJSON()

    expect(json.inline_keyboard).toHaveLength(1)
    expect(json.inline_keyboard[0]).toHaveLength(2)
    expect(json.inline_keyboard[0][0].url).toBe('https://example.com')
    expect(json.inline_keyboard[0][1].callback_data).toBe('foo')
  })

  it('coerces numeric callback_data to string', () => {
    const button = InlineKeyboard.textButton({ text: 'x', payload: 42 })

    expect(button.callback_data).toBe('42')
  })

  it('rejects callback_data over 64 bytes', () => {
    expect(() =>
      InlineKeyboard.textButton({ text: 'x', payload: 'a'.repeat(65) })
    ).toThrow(RangeError)
  })

  it('rejects empty callback_data', () => {
    expect(() => InlineKeyboard.textButton({ text: 'x', payload: '' })).toThrow(RangeError)
  })

  it('counts UTF-8 bytes for surrogate pairs and unpaired surrogates', () => {
    const paired = '\uD83D\uDE00'.repeat(16)
    const unpaired = '\uD800'.repeat(21) + 'a'

    expect(InlineKeyboard.textButton({ text: 'x', payload: paired }).callback_data).toBe(paired)
    expect(InlineKeyboard.textButton({ text: 'x', payload: unpaired }).callback_data).toBe(unpaired)
    expect(() => InlineKeyboard.textButton({ text: 'x', payload: paired + 'a' })).toThrow(RangeError)
    expect(() => InlineKeyboard.textButton({ text: 'x', payload: unpaired + 'a' })).toThrow(RangeError)
  })

  it('button styles propagate', () => {
    const button = InlineKeyboard.textButton({ text: 'x', payload: 'y', style: 'success' })

    expect(button.style).toBe('success')
  })

  it('introspection getters', () => {
    const empty = new InlineKeyboard()

    expect(empty.isEmpty).toBe(true)
    expect(empty.rowCount).toBe(0)
    expect(empty.length).toBe(0)

    const kb = InlineKeyboard.keyboard([
      [InlineKeyboard.textButton({ text: 'a', payload: '1' }), InlineKeyboard.textButton({ text: 'b', payload: '2' })],
      [InlineKeyboard.textButton({ text: 'c', payload: '3' })]
    ])

    expect(kb.rowCount).toBe(2)
    expect(kb.length).toBe(3)
  })

  it('if applies the matching branch and returns the keyboard', () => {
    const kb = new InlineKeyboard()

    const result = kb.if(true, k => k.delete('nope'))

    expect(result).toBe(kb)
  })

  it('from(markup) round-trips an inline markup', () => {
    const original = InlineKeyboard.keyboard([
      [InlineKeyboard.textButton({ text: 'a', payload: '1' })]
    ]).toJSON()

    const restored = InlineKeyboard.from(original)

    expect(restored.toJSON()).toEqual(original)
  })

  it('clone deep-copies the buttons matrix', () => {
    const original = InlineKeyboard.keyboard([
      [InlineKeyboard.textButton({ text: 'a', payload: 'p' })]
    ])
    const cloned = original.clone()

    cloned.delete('p')

    expect(original.length).toBe(1)
    expect(cloned.length).toBe(0)
  })
})

describe('InlineKeyboardBuilder', () => {
  it('builds rows with chained buttons', () => {
    const kb = new InlineKeyboardBuilder()
      .textButton({ text: 'a', payload: '1' })
      .textButton({ text: 'b', payload: '2' })
      .row()
      .textButton({ text: 'c', payload: '3' })

    const json = kb.toJSON()

    expect(json.inline_keyboard).toHaveLength(2)
    expect(json.inline_keyboard[0]).toHaveLength(2)
    expect(json.inline_keyboard[1]).toHaveLength(1)
  })

  it('coerces numeric callback_data on text and url buttons', () => {
    const kb = new InlineKeyboardBuilder()
      .textButton({ text: 'a', payload: 1 })
      .urlButton({ text: 'b', url: 'https://example.com', payload: 2 })

    const json = kb.toJSON()

    expect(json.inline_keyboard[0][0].callback_data).toBe('1')
    expect(json.inline_keyboard[0][1].callback_data).toBe('2')
  })

  it('rejects callback_data over 64 bytes', () => {
    expect(() =>
      new InlineKeyboardBuilder().textButton({ text: 'x', payload: 'a'.repeat(65) })
    ).toThrow(RangeError)
  })

  it('introspection counts include the in-progress row', () => {
    const kb = new InlineKeyboardBuilder()
      .textButton({ text: 'a', payload: '1' })
      .row()
      .textButton({ text: 'b', payload: '2' })

    expect(kb.rowCount).toBe(2)
    expect(kb.length).toBe(2)
  })

  it('if applies the matching branch and returns the builder', () => {
    const kb = new InlineKeyboardBuilder()
      .if(true, b => b.textButton({ text: 'yes', payload: 'y' }))
      .if(false,
        b => b.textButton({ text: 'no', payload: 'n' }),
        b => b.textButton({ text: 'else', payload: 'e' }))

    const json = kb.toJSON()

    expect(json.inline_keyboard[0]).toHaveLength(2)
    expect(json.inline_keyboard[0][0].callback_data).toBe('y')
    expect(json.inline_keyboard[0][1].callback_data).toBe('e')
  })

  it('from(markup) restores rows', () => {
    const original = new InlineKeyboardBuilder()
      .textButton({ text: 'a', payload: '1' })
      .row()
      .textButton({ text: 'b', payload: '2' })
      .toJSON()

    const restored = InlineKeyboardBuilder.from(original)

    expect(restored.toJSON()).toEqual(original)
  })

  it('clone deep-copies committed and in-progress rows', () => {
    const original = new InlineKeyboardBuilder()
      .textButton({ text: 'a', payload: '1' })
      .row()
      .textButton({ text: 'b', payload: '2' })
    const cloned = original.clone()

    cloned.textButton({ text: 'c', payload: '3' })

    expect(original.length).toBe(2)
    expect(cloned.length).toBe(3)
  })
})

describe('bot api 10.3 reply markup', () => {
  it('marks a button disabled', () => {
    expect(InlineKeyboard.textButton({ text: 'x', payload: 'y', disabled: true }).disabled).toEqual({})
    expect(InlineKeyboard.textButton({ text: 'x', payload: 'y' })).not.toHaveProperty('disabled')
    expect(InlineKeyboard.textButton({ text: 'x', payload: 'y', disabled: false })).not.toHaveProperty('disabled')
  })

  it('marks a builder button disabled', () => {
    const json = new InlineKeyboardBuilder()
      .urlButton({ text: 'x', url: 'https://example.com', disabled: true })
      .toJSON()

    expect(json.inline_keyboard[0]![0]!.disabled).toEqual({})
  })

  it('keeps disabled alongside the other decorations', () => {
    const button = InlineKeyboard.urlButton({
      text: 'x',
      url: 'https://example.com',
      style: 'danger',
      iconCustomEmojiId: '5368324170671202286',
      disabled: true
    })

    expect(button).toMatchObject({
      style: 'danger',
      icon_custom_emoji_id: '5368324170671202286',
      disabled: {}
    })
  })

  it('sets force_reply only when requested', () => {
    const kb = InlineKeyboard.keyboard([InlineKeyboard.textButton({ text: 'x', payload: 'y' })])

    expect(kb.toJSON()).not.toHaveProperty('force_reply')
    expect(kb.forceReply().toJSON().force_reply).toBe(true)
    expect(kb.forceReply(false).toJSON()).not.toHaveProperty('force_reply')
  })

  it('carries force_reply through from() and clone()', () => {
    const kb = InlineKeyboard.from({
      inline_keyboard: [[{ text: 'x', callback_data: 'y' }]],
      force_reply: true
    })

    expect(kb.toJSON().force_reply).toBe(true)
    expect(kb.clone().toJSON().force_reply).toBe(true)
  })

  it('sets force_reply on a builder', () => {
    const json = new InlineKeyboardBuilder()
      .textButton({ text: 'x', payload: 'y' })
      .forceReply()
      .toJSON()

    expect(json.force_reply).toBe(true)
  })
})
