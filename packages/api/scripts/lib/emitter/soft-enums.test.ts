import { describe, expect, it } from 'vitest'

import type { Schema, SchemaField } from '../schema-types'

import { applySoftEnums } from './soft-enums'

const stringField = (name: string) => {
  const field: SchemaField = { name, description: '', required: false, type: { kind: 'string' } }

  return field
}

const schemaWith = (args: SchemaField[], fields: SchemaField[]) => {
  const schema: Schema = {
    version: { major: 10, minor: 0, patch: 0 },
    recentChanges: { year: 2025, month: 1, day: 1 },
    source: { core: '', fetchedAt: '' },
    methods: [{ name: 'sendMessage', description: '', multipartOnly: false, arguments: args, returnType: { kind: 'true' } }],
    objects: [{ kind: 'object', name: 'InputMedia', description: '', fields }]
  }

  return schema
}

describe('applySoftEnums', () => {
  it('tags parse_mode with the soft-enum values and the open flag', () => {
    const schema = schemaWith([stringField('parse_mode')], [])

    applySoftEnums(schema)

    expect(schema.methods[0]!.arguments[0]!.type).toEqual({
      kind: 'string',
      enumeration: ['HTML', 'Markdown', 'MarkdownV2'],
      open: true
    })
  })

  it('tags the *_parse_mode family on both args and object fields', () => {
    const schema = schemaWith([stringField('explanation_parse_mode')], [stringField('quote_parse_mode')])

    applySoftEnums(schema)

    const argType = schema.methods[0]!.arguments[0]!.type
    const fieldType = (schema.objects[0]! as { fields: SchemaField[] }).fields[0]!.type

    expect(argType).toMatchObject({ open: true, enumeration: ['HTML', 'Markdown', 'MarkdownV2'] })
    expect(fieldType).toMatchObject({ open: true, enumeration: ['HTML', 'Markdown', 'MarkdownV2'] })
  })

  it('leaves unrelated string fields untouched', () => {
    const schema = schemaWith([stringField('text')], [])

    applySoftEnums(schema)

    expect(schema.methods[0]!.arguments[0]!.type).toEqual({ kind: 'string' })
  })
})
