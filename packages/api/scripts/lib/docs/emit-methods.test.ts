import { describe, expect, it } from 'vitest'

import type { Schema } from '../schema-types'

import { emitMethodsPage } from './emit-methods'

const schema: Schema = {
  version: { major: 10, minor: 0, patch: 0 },
  recentChanges: { year: 2025, month: 1, day: 1 },
  source: { core: '', fetchedAt: '' },
  objects: [],
  methods: [
    {
      name: 'sendMessage',
      description: 'sends a text message',
      documentationLink: 'https://core.telegram.org/bots/api#sendmessage',
      multipartOnly: false,
      arguments: [
        {
          name: 'chat_id',
          description: 'target chat',
          required: true,
          type: { kind: 'union', of: [{ kind: 'integer' }, { kind: 'string' }] }
        },
        { name: 'text', description: 'message text', required: true, type: { kind: 'string' } }
      ],
      returnType: { kind: 'reference', name: 'Message' }
    }
  ]
}

describe('emitMethodsPage', () => {
  it('opens with the generated banner', () => {
    expect(emitMethodsPage(schema)).toMatch(/^<!-- generated/)
  })

  it('emits a heading per method', () => {
    expect(emitMethodsPage(schema)).toContain('## sendMessage')
  })

  it('renders an argument table with escaped union types', () => {
    expect(emitMethodsPage(schema)).toContain('| `chat_id` | integer \\| string | ✓ | target chat |')
  })

  it('renders the return type as a linked reference', () => {
    expect(emitMethodsPage(schema)).toContain('**returns:** [Message](/api/objects#message)')
  })

  it('links to the bot api reference', () => {
    expect(emitMethodsPage(schema)).toContain('https://core.telegram.org/bots/api#sendmessage')
  })

  it('escapes angle brackets in descriptions so vue does not parse them as tags', () => {
    const page = emitMethodsPage({
      ...schema,
      methods: [{
        name: 'createNewStickerSet',
        description: 'add <bot_username> to the name',
        multipartOnly: false,
        arguments: [
          { name: 'name', description: 'use <bot_username> here', required: true, type: { kind: 'string' } }
        ],
        returnType: { kind: 'true' }
      }]
    })

    expect(page).toContain('add &lt;bot_username&gt; to the name')
    expect(page).toContain('use &lt;bot_username&gt; here')
    expect(page).not.toContain('<bot_username>')
  })
})
