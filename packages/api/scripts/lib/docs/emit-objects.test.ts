import { describe, expect, it } from 'vitest'

import type { Schema } from '../schema-types'

import { emitObjectsPage } from './emit-objects'

const schema: Schema = {
  version: { major: 10, minor: 0, patch: 0 },
  recentChanges: { year: 2025, month: 1, day: 1 },
  source: { core: '', fetchedAt: '' },
  methods: [],
  objects: [
    {
      kind: 'object',
      name: 'User',
      description: 'a telegram user',
      documentationLink: 'https://core.telegram.org/bots/api#user',
      fields: [
        { name: 'id', description: 'unique id', required: true, type: { kind: 'integer' } },
        { name: 'username', description: 'the | handle', required: false, type: { kind: 'string' } }
      ]
    },
    {
      kind: 'union',
      name: 'MessageOrigin',
      description: 'origin of a message',
      members: [
        { kind: 'reference', name: 'MessageOriginUser' },
        { kind: 'reference', name: 'MessageOriginChat' }
      ]
    },
    {
      kind: 'enum',
      name: 'ChatType',
      description: 'type of chat',
      values: ['private', 'group']
    }
  ]
}

describe('emitObjectsPage', () => {
  it('opens with the generated banner', () => {
    expect(emitObjectsPage(schema)).toMatch(/^<!-- generated/)
  })

  it('renders an object as a field table with escaped descriptions', () => {
    const page = emitObjectsPage(schema)

    expect(page).toContain('## User')
    expect(page).toContain('| `username` | string |  | the \\| handle |')
  })

  it('renders a union as a member list', () => {
    expect(emitObjectsPage(schema)).toContain(
      'one of: [MessageOriginUser](/api/objects#messageoriginuser), [MessageOriginChat](/api/objects#messageoriginchat)'
    )
  })

  it('renders an enum as a value list', () => {
    expect(emitObjectsPage(schema)).toContain('one of: `private`, `group`')
  })

  it('escapes angle brackets in descriptions', () => {
    const page = emitObjectsPage({
      ...schema,
      objects: [{
        kind: 'object',
        name: 'Foo',
        description: 'wrap <x> please',
        fields: [
          { name: 'bar', description: 'value <y>', required: false, type: { kind: 'string' } }
        ]
      }]
    })

    expect(page).toContain('wrap &lt;x&gt; please')
    expect(page).toContain('value &lt;y&gt;')
    expect(page).not.toContain('<x>')
  })
})
