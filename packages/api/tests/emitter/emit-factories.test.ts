import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, it, expect } from 'vitest'

import { emitFactories } from '../../scripts/lib/emitter/emit-factories'
import type { Schema } from '../../scripts/lib/schema-types'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('emitFactories', () => {
  it('emits classes only for families with matching schema entries', async () => {
    const schema = JSON.parse(
      await readFile(resolve(__dirname, '../fixtures/small-schema.json'), 'utf8')
    ) as Schema

    const out = emitFactories(schema)

    expect(out).toContain('AUTO-GENERATED')
    expect(out).not.toContain('export class InputMedia')
  })

  it('emits factory class with one method per variant when families match', () => {
    const schema: Schema = {
      version: { major: 8, minor: 0, patch: 0 },
      recentChanges: { year: 2026, month: 4, day: 1 },
      source: { core: '', fetchedAt: '2026-04-26T00:00:00.000Z' },
      methods: [],
      objects: [
        {
          kind: 'object',
          name: 'InputMediaPhoto',
          description: 'A photo to be sent.',
          fields: [
            { name: 'type', description: '', required: true, type: { kind: 'string', enumeration: ['photo'] } },
            { name: 'media', description: '', required: true, type: { kind: 'string' } },
            { name: 'caption', description: '', required: false, type: { kind: 'string' } }
          ]
        },
        {
          kind: 'object',
          name: 'InputMediaVideo',
          description: 'A video to be sent.',
          fields: [
            { name: 'type', description: '', required: true, type: { kind: 'string', enumeration: ['video'] } },
            { name: 'media', description: '', required: true, type: { kind: 'string' } }
          ]
        }
      ]
    }

    const out = emitFactories(schema)

    expect(out).toContain('export class InputMedia')
    expect(out).toContain('static photo(')
    expect(out).toContain('static video(')
    expect(out).toContain('type: "photo"')
    expect(out).toContain('type: "video"')
  })
})
