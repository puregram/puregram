import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, it, expect } from 'vitest'

import { emitUpdates } from '../../scripts/lib/emitter/emit-updates'
import type { Schema } from '../../scripts/lib/schema-types'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('emitUpdates', () => {
  it('emits MessageUpdate class with kind, raw, lazy getters, shortcuts', async () => {
    const schema = JSON.parse(
      await readFile(resolve(__dirname, '../fixtures/small-schema.json'), 'utf8')
    ) as Schema

    const out = emitUpdates(schema)

    expect(out).toContain('export class MessageUpdate')
    expect(out).toContain('readonly kind = "message" as const')
    expect(out).toContain('public raw: TelegramMessage')
    expect(out).toContain('public readonly tg: TelegramLike')
    expect(out).toContain('get chat(): Chat')
    expect(out).toContain('is<K extends UpdateKind>')

    expect(out).toContain('send(')
    expect(out).toContain('this.tg.api.sendMessage')
    expect(out).toContain('chat_id: this.raw.chat.id')

    expect(out).toContain('import type { ActionControllerLike, ActionControllerParams, TelegramLike } from "../telegram-like"')
    expect(out).toContain('import { INSPECT, makeInspect } from "./inspect"')
  })

  it('emits reply / replyWith<Media> twins that fill and merge reply_parameters', async () => {
    const schema = JSON.parse(
      await readFile(resolve(__dirname, '../fixtures/small-schema.json'), 'utf8')
    ) as Schema

    const replyParam = {
      name: 'reply_parameters',
      description: 'description of the message to reply to',
      required: false,
      type: { kind: 'reference' as const, name: 'ReplyParameters' }
    }

    schema.methods.find(m => m.name === 'sendMessage')!.arguments.push({ ...replyParam })
    schema.methods.push({
      name: 'sendPhoto',
      description: 'Sends a photo.',
      multipartOnly: false,
      arguments: [
        { name: 'chat_id', description: 'Target chat id.', required: true, type: { kind: 'union', of: [{ kind: 'integer' }, { kind: 'string' }] } },
        { name: 'photo', description: 'Photo to send.', required: true, type: { kind: 'string' } },
        { ...replyParam }
      ],
      returnType: { kind: 'reference', name: 'Message' }
    })
    schema.objects.push({
      kind: 'object',
      name: 'ReplyParameters',
      description: 'Reply parameters.',
      fields: [{ name: 'message_id', description: 'Replied message id.', required: true, type: { kind: 'integer' } }]
    })

    const out = emitUpdates(schema)

    expect(out).toContain('reply(text')
    expect(out).toContain('replyWithPhoto(photo')
    expect(out).toContain('message_id: this.raw.message_id')
    expect(out).toContain('...params.reply_parameters')
  })

})
