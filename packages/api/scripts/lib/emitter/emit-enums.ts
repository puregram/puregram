import ts from 'typescript'

import type { Schema } from '../schema-types'

import { ENUMS, type EnumSpec } from './enums-config'
import { formatModule } from './format'
import { versionString } from './load-schema'

export function emitEnums (schema: Schema) {
  const nodes: ts.Node[] = []

  for (const spec of ENUMS) {
    const values = resolveValues(spec, schema)

    if (values.length === 0) {
      continue
    }

    nodes.push(emitEnum(spec.exportName, values))
  }

  return formatModule({
    nodes,
    botApiVersion: versionString(schema),
    sourceUrl: schema.source.core,
    generatedAt: schema.source.fetchedAt
  })
}

function resolveValues (spec: EnumSpec, schema: Schema) {
  const source = spec.source

  if (source.kind === 'literal') {
    return source.values
  }

  const obj = schema.objects.find(o => o.kind === 'object' && o.name === source.object)

  if (!obj || obj.kind !== 'object') {
    return []
  }

  const field = obj.fields.find(f => f.name === source.field)

  if (!field || field.type.kind !== 'string' || !field.type.enumeration) {
    return []
  }

  return field.type.enumeration
}

// 'private' → 'Private', 'all_private_chats' → 'AllPrivateChats', '🎲' → 'Dice'
function memberName (value: string) {
  const emojiMap: Record<string, string> = {
    '🎲': 'Dice',
    '🎯': 'Dart',
    '🏀': 'Basketball',
    '⚽': 'Football',
    '🎰': 'SlotMachine',
    '🎳': 'Bowling'
  }

  const mapped = emojiMap[value]

  if (mapped) {
    return mapped
  }

  return value
    .split(/[_-]/)
    .map(s => s[0]!.toUpperCase() + s.slice(1))
    .join('')
}

function emitEnum (name: string, values: string[]) {
  const members = values.map(v =>
    ts.factory.createEnumMember(
      ts.factory.createIdentifier(memberName(v)),
      ts.factory.createStringLiteral(v)
    )
  )

  return ts.factory.createEnumDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(name),
    members
  )
}
