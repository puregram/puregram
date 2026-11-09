import { describe, expect, it } from 'vitest'

import type { Schema } from '../schema-types'

import { emitUpdatesPage } from './emit-updates'

const schema: Schema = {
  version: { major: 10, minor: 0, patch: 0 },
  recentChanges: { year: 2025, month: 1, day: 1 },
  source: { core: '', fetchedAt: '' },
  methods: [
    {
      name: 'sendMessage',
      description: 'send a message',
      multipartOnly: false,
      returnType: { kind: 'reference', name: 'Message' },
      arguments: [
        { name: 'chat_id', description: 'chat', required: true, type: { kind: 'integer' } },
        { name: 'text', description: 'text', required: true, type: { kind: 'string' } },
        { name: 'reply_parameters', description: 'reply', required: false, type: { kind: 'reference', name: 'ReplyParameters' } }
      ]
    },
    {
      name: 'answerCallbackQuery',
      description: 'answer a callback query',
      multipartOnly: false,
      returnType: { kind: 'bool' },
      arguments: [
        { name: 'callback_query_id', description: 'id', required: true, type: { kind: 'string' } },
        { name: 'text', description: 'text', required: false, type: { kind: 'string' } }
      ]
    }
  ],
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
        { name: 'chat', description: 'chat', required: true, type: { kind: 'reference', name: 'Chat' } }
      ]
    },
    {
      kind: 'object',
      name: 'CallbackQuery',
      description: 'a callback query',
      fields: [
        { name: 'id', description: 'id', required: true, type: { kind: 'string' } },
        { name: 'from', description: 'sender', required: true, type: { kind: 'reference', name: 'User' } }
      ]
    }
  ]
}

describe('emitUpdatesPage', () => {
  it('opens with the generated banner', () => {
    expect(emitUpdatesPage(schema)).toMatch(/^<!-- generated/)
  })

  it('lists every kind in the index table with its handler', () => {
    const page = emitUpdatesPage(schema)

    expect(page).toContain('| [`message`](#message) | `MessageUpdate` | `tg.onMessage` | [Message](/api/objects#message) |')
    expect(page).toContain('| [`callback_query`](#callback-query) | `CallbackQueryUpdate` | `tg.onCallbackQuery` | [CallbackQuery](/api/objects#callbackquery) |')
  })

  it('renders a per-kind section with class, handler and filter', () => {
    const page = emitUpdatesPage(schema)

    expect(page).toContain('## message')
    expect(page).toContain('class `MessageUpdate` · handler `tg.onMessage` · filter `MessageFilter`')
  })

  it('renders per-kind shortcuts as method-linked verbs', () => {
    const page = emitUpdatesPage(schema)

    expect(page).toContain('[`send`](/api/methods#sendmessage)')
    expect(page).toContain('[`reply`](/api/methods#sendmessage)')
    expect(page).toContain('[`answer`](/api/methods#answercallbackquery)')
  })

  it('renders the helpers table from kind extras', () => {
    const page = emitUpdatesPage(schema)

    expect(page).toContain('| member | kind | description |')
    expect(page).toContain('| `chatId` | getter |')
    expect(page).toContain('| `userId` | getter |')
  })
})
