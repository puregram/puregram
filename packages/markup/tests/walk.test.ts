import { describe, it, expect } from 'vitest'

import { Formatted } from '../src/formatted'
import { unwrapFormatted, type FormattableFields } from '../src/walk'

const FIELDS: FormattableFields = {
  sendMessage: [{ path: ['text'], textKey: 'text', entitiesKey: 'entities' }],
  sendMediaGroup: [{ path: ['media', '*', 'caption'], textKey: 'caption', entitiesKey: 'caption_entities' }]
}

describe('unwrapFormatted', () => {
  it('replaces Formatted text with plain string and writes entities', () => {
    const params: Record<string, unknown> = {
      chat_id: 1,
      text: new Formatted('hi', [{ type: 'bold', offset: 0, length: 2 }])
    }

    const out = unwrapFormatted('sendMessage', params, FIELDS)!

    expect(out.text).toBe('hi')
    expect(out.entities).toEqual([{ type: 'bold', offset: 0, length: 2 }])
  })

  it('leaves the caller params object untouched', () => {
    const params: Record<string, unknown> = {
      chat_id: 1,
      text: new Formatted('hi', [{ type: 'bold', offset: 0, length: 2 }])
    }

    unwrapFormatted('sendMessage', params, FIELDS)

    expect(params.text).toBeInstanceOf(Formatted)
    expect(params.entities).toBeUndefined()
  })

  it('leaves plain-string params untouched', () => {
    const params: Record<string, unknown> = { chat_id: 1, text: 'plain' }
    const out = unwrapFormatted('sendMessage', params, FIELDS)!

    expect(out).toBe(params)
    expect(out.entities).toBeUndefined()
  })

  it('walks array paths with `*` without rewriting the caller array', () => {
    const media = [
      { type: 'photo', media: 'file_id_1', caption: new Formatted('cap1', [{ type: 'bold', offset: 0, length: 4 }]) },
      { type: 'photo', media: 'file_id_2', caption: 'plain cap' }
    ]
    const params: Record<string, unknown> = { chat_id: 1, media }
    const out = unwrapFormatted('sendMediaGroup', params, FIELDS)!
    const rewritten = out.media as Record<string, unknown>[]

    expect(rewritten[0]!.caption).toBe('cap1')
    expect(rewritten[0]!.caption_entities).toEqual([{ type: 'bold', offset: 0, length: 4 }])
    expect(rewritten[1]!).toBe(media[1])
    expect(media[0]!.caption).toBeInstanceOf(Formatted)
  })

  it('walks a single object where the descriptor expects an array', () => {
    const params: Record<string, unknown> = {
      media: { type: 'photo', media: 'file_id_1', caption: new Formatted('c', [{ type: 'bold', offset: 0, length: 1 }]) }
    }
    const out = unwrapFormatted('sendMediaGroup', params, FIELDS)!

    expect((out.media as Record<string, unknown>).caption).toBe('c')
    expect((out.media as Record<string, unknown>).caption_entities).toEqual([{ type: 'bold', offset: 0, length: 1 }])
  })

  it('does nothing when method has no descriptor', () => {
    const params: Record<string, unknown> = { whatever: 1 }

    expect(unwrapFormatted('getMe', params, FIELDS)).toBe(params)
  })

  it('coerces raw {text, entities} objects', () => {
    const params: Record<string, unknown> = {
      text: { text: 'x', entities: [{ type: 'italic', offset: 0, length: 1 }] }
    }
    const out = unwrapFormatted('sendMessage', params, FIELDS)!

    expect(out.text).toBe('x')
    expect(out.entities).toEqual([{ type: 'italic', offset: 0, length: 1 }])
  })

  it('leaves a shape it cannot format alone', () => {
    for (const value of [{ text: 'hi', foo: 1 }, { text: 'hi', entities: 'abc' }, { text: 'hi', entities: 5 }]) {
      const params: Record<string, unknown> = { text: value }
      const out = unwrapFormatted('sendMessage', params, FIELDS)!

      expect(out.text).toBe(value)
      expect(out.entities).toBeUndefined()
    }
  })

  it('keeps caller entities when the Formatted carries none', () => {
    const params: Record<string, unknown> = {
      text: new Formatted('hello world'),
      entities: [{ type: 'bold', offset: 0, length: 5 }]
    }
    const out = unwrapFormatted('sendMessage', params, FIELDS)!

    expect(out.text).toBe('hello world')
    expect(out.entities).toEqual([{ type: 'bold', offset: 0, length: 5 }])
  })
})
