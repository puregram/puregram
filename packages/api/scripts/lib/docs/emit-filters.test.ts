import { describe, expect, it } from 'vitest'

import type { Schema } from '../schema-types'

import { emitFiltersPage } from './emit-filters'

const schema: Schema = {
  version: { major: 10, minor: 0, patch: 0 },
  recentChanges: { year: 2025, month: 1, day: 1 },
  source: { core: '', fetchedAt: '' },
  methods: [],
  objects: [
    {
      kind: 'object',
      name: 'Update',
      description: 'an incoming update',
      fields: [
        { name: 'update_id', description: 'id', required: true, type: { kind: 'integer' } },
        { name: 'message', description: 'new message', required: false, type: { kind: 'reference', name: 'Message' } },
        { name: 'callback_query', description: 'callback', required: false, type: { kind: 'reference', name: 'CallbackQuery' } }
      ]
    },
    {
      kind: 'object',
      name: 'Message',
      description: 'a message',
      fields: [
        { name: 'message_id', description: 'id', required: true, type: { kind: 'integer' } },
        { name: 'chat', description: 'chat', required: true, type: { kind: 'reference', name: 'Chat' } },
        { name: 'text', description: 'text', required: false, type: { kind: 'string' } },
        { name: 'photo', description: 'photo', required: false, type: { kind: 'array', of: { kind: 'reference', name: 'PhotoSize' } } }
      ]
    },
    {
      kind: 'object',
      name: 'CallbackQuery',
      description: 'a callback query',
      fields: [
        { name: 'id', description: 'id', required: true, type: { kind: 'string' } },
        { name: 'data', description: 'data', required: false, type: { kind: 'string' } }
      ]
    }
  ]
}

describe('emitFiltersPage', () => {
  it('opens with the generated banner', () => {
    expect(emitFiltersPage(schema)).toMatch(/^<!-- generated/)
  })

  it('renders a presence filter with its narrowed type', () => {
    const page = emitFiltersPage(schema)

    expect(page).toContain('| `filters.hasText` | `text`: string |')
    expect(page).toContain('| `filters.hasPhoto` | `photo`: [PhotoSize](/api/objects#photosize)[] |')
  })

  it('collapses the full message family to a single token', () => {
    const page = emitFiltersPage(schema)

    expect(page).toContain('| `filters.hasText` | `text`: string | `message-family` |')
  })

  it('lists explicit kinds for non-message filters', () => {
    const page = emitFiltersPage(schema)

    expect(page).toContain('| `filters.hasData` | `data`: string | `callback_query` |')
  })
})
