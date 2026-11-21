import { describe, expect, it } from 'vitest'

import { MessageEntity } from '../src/generated/structures'
import type { TelegramMessageEntity } from '../src/generated/types'
import { MessageEntities } from '../src/structures-handcrafted/message-entities'

const USER = { id: 42, is_bot: false, first_name: 'alice' }
const RAW = [
  { type: 'bold', offset: 0, length: 4 },
  { type: 'italic', offset: 0, length: 4 },
  { type: 'pre', offset: 5, length: 6, language: 'js' },
  { type: 'pre', offset: 12, length: 6, language: 'ts' },
  { type: 'pre', offset: 19, length: 6 },
  { type: 'text_link', offset: 26, length: 4, url: 'https://example.com' },
  { type: 'text_mention', offset: 31, length: 5, user: USER },
  { type: 'custom_emoji', offset: 37, length: 2, custom_emoji_id: 'emoji-1' },
  { type: 'date_time', offset: 40, length: 8, unix_time: 1_700_000_000, date_time_format: 'd' }
] as const satisfies readonly TelegramMessageEntity[]

describe('MessageEntities', () => {
  it('wraps readonly payloads once and preserves array access and iteration', () => {
    const entities = new MessageEntities(RAW)

    expect(Array.isArray(entities)).toBe(true)
    expect(entities.length).toBe(RAW.length)
    expect(entities[0]).toBeInstanceOf(MessageEntity)
    expect(entities[0]?.type).toBe('bold')
    expect(entities.at(-1)?.unixTime).toBe(1_700_000_000)
    expect([...entities].map(entity => entity.type)).toEqual(RAW.map(entity => entity.type))

    for (const [index, entity] of entities.entries()) {
      expect(entity.raw).toBe(RAW[index])
      expect([...entities][index]).toBe(entity)
    }
  })

  it('supports sparse lengths and inherited array factories without rewrapping', () => {
    const entity = new MessageEntity(RAW[0])
    const sparse = new MessageEntities(3)

    expect(sparse.length).toBe(3)
    expect(0 in sparse).toBe(false)
    sparse[2] = entity
    expect(sparse.only('bold').first).toBe(entity)
    expect(() => new MessageEntities(-1)).toThrow(RangeError)

    for (const entities of [
      MessageEntities.of(entity),
      MessageEntities.from([entity]),
      MessageEntities.from({ 0: entity, length: 1 })
    ]) {
      expect(entities).toBeInstanceOf(MessageEntities)
      expect(entities).toHaveLength(1)
      expect(entities[0]).toBe(entity)
    }
  })

  it('finds any requested type, including readonly alternatives', () => {
    const entities = new MessageEntities(RAW)

    expect(entities.has('pre')).toBe(true)
    expect(entities.has('code')).toBe(false)
    expect(entities.has(['code', 'italic'] as const)).toBe(true)
    expect(entities.has(['code', 'url'] as const)).toBe(false)
    expect(entities.has([])).toBe(false)
  })

  it('chains type and property queries without rewrapping matching entities', () => {
    const entities = new MessageEntities(RAW)
    const matches = entities.only('pre').where({ language: 'js' }).atOffset(5)

    expect(matches.toJSON()).toEqual([RAW[2]])
    expect(matches.first).toBe(entities[2])
    expect(matches.first?.language).toBe('js')
    expect(matches.except('bold').without({ language: 'ts' }).last).toBe(entities[2])
    expect(entities.where({ type: 'pre', language: ['js', 'ts'] }).toJSON()).toEqual([RAW[2], RAW[3]])
  })

  it('selects and excludes one or several types in their original order', () => {
    const entities = new MessageEntities(RAW)

    expect(entities.only(['bold', 'italic'] as const).toJSON()).toEqual([RAW[0], RAW[1]])
    expect(entities.except('pre').map(entity => entity.offset)).toEqual([0, 0, 26, 31, 37, 40])
    expect(entities.except(['pre', 'bold'] as const).first).toBe(entities[1])
    expect(entities.only([]).isEmpty()).toBe(true)
    expect(entities.except([]).toJSON()).toEqual(RAW)
  })

  it('matches raw field names and object identity rather than wrapper properties or deep equality', () => {
    const entities = new MessageEntities(RAW)

    expect(entities.where({ user: USER }).first?.user?.id).toBe(42)
    expect(entities.where({ user: { ...USER } }).isEmpty()).toBe(true)
    expect(entities.where({ user: [USER] }).first).toBe(entities[6])
    expect(entities.where({ url: 'https://example.com' }).first).toBe(entities[5])
    expect(entities.where({ custom_emoji_id: 'emoji-1' }).first?.customEmojiId).toBe('emoji-1')
    expect(entities.where({ unix_time: 1_700_000_000, date_time_format: 'd' }).first).toBe(entities[8])
    expect(entities.where({ offset: 0, length: 4 }).toJSON()).toEqual([RAW[0], RAW[1]])
    expect(entities.where({ language: undefined }).isEmpty()).toBe(true)
  })

  it('excludes each matching property and retains entities with absent properties', () => {
    const entities = new MessageEntities(RAW)

    expect(entities.only('pre').without({ language: 'js' }).toJSON()).toEqual([RAW[3], RAW[4]])
    expect(entities.only('pre').without({ language: ['js', 'ts'] }).toJSON()).toEqual([RAW[4]])
    expect(entities.without({ type: 'pre', offset: 0 }).toJSON()).toEqual(RAW.slice(5))
    expect(entities.without({ custom_emoji_id: 'emoji-1' }).has('custom_emoji')).toBe(false)
    expect(entities.where({}).toJSON()).toEqual(RAW)
    expect(entities.without({}).toJSON()).toEqual(RAW)
  })

  it('selects entities starting at an offset rather than spanning it', () => {
    const entities = new MessageEntities(RAW)

    expect(entities.atOffset(0).toJSON()).toEqual([RAW[0], RAW[1]])
    expect(entities.atOffset(5).first).toBe(entities[2])
    expect(entities.atOffset(6).isEmpty()).toBe(true)
    expect(entities.atOffset(-1).isEmpty()).toBe(true)
  })

  it('handles empty collections and exposes first and last entities', () => {
    const entities = new MessageEntities(RAW)

    expect(entities.isEmpty()).toBe(false)
    expect(entities.first).toBe(entities[0])
    expect(entities.last).toBe(entities[8])

    for (const empty of [new MessageEntities(), new MessageEntities([]), entities.only('code')]) {
      expect(empty.isEmpty()).toBe(true)
      expect(empty.first).toBeUndefined()
      expect(empty.last).toBeUndefined()
      expect(empty.toJSON()).toEqual([])
      expect(empty.only('pre').without({ language: 'js' }).isEmpty()).toBe(true)
    }
  })

  it('serializes raw entities without copying their payloads', () => {
    const entities = new MessageEntities(RAW)
    const json = entities.toJSON()

    expect(Object.getPrototypeOf(json)).toBe(Array.prototype)
    expect(json).toEqual(RAW)
    expect(JSON.stringify(entities)).toBe(JSON.stringify(RAW))

    for (const [index, raw] of json.entries()) {
      expect(raw).toBe(RAW[index])
    }
  })

  it('keeps ordinary array transformations ordinary arrays', () => {
    const entities = new MessageEntities(RAW)
    const types = entities.map(entity => entity.type)
    const filtered = entities.filter(entity => entity.offset === 0)
    const sliced = entities.slice(2, 4)

    expect(Object.getPrototypeOf(types)).toBe(Array.prototype)
    expect(types).toEqual(RAW.map(entity => entity.type))
    expect(Object.getPrototypeOf(filtered)).toBe(Array.prototype)
    expect(filtered).toEqual([entities[0], entities[1]])
    expect(Object.getPrototypeOf(sliced)).toBe(Array.prototype)
    expect(sliced).toEqual([entities[2], entities[3]])

    const replaced = entities.with(-1, entities[0]!)

    expect(Object.getPrototypeOf(replaced)).toBe(Array.prototype)
    expect(replaced.at(-1)).toBe(entities[0])
    expect(entities.last).not.toBe(entities[0])
    expect(() => entities.with(entities.length, entities[0]!)).toThrow(RangeError)
  })

  it('leaves original and input collections unchanged when querying or mutating results', () => {
    const entities = new MessageEntities(RAW)
    const original = [...entities]
    const selected = entities.only('pre').where({ language: ['js', 'ts'] })

    expect(selected.pop()).toBe(entities[3])
    expect(selected.toJSON()).toEqual([RAW[2]])
    expect([...entities]).toEqual(original)
    expect(entities.length).toBe(RAW.length)
    expect(entities[3]).toBe(original[3])
    expect(entities.toJSON()).toEqual(RAW)
  })
})
