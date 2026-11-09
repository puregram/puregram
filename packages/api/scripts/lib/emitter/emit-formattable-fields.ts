import ts from 'typescript'

import type { Schema } from '../schema-types'

import { formatModule } from './format'
import { detectFormattableFields, type FormattableSlot } from './formattable-detect'
import { versionString } from './load-schema'

function slotLiteral (slot: FormattableSlot) {
  return ts.factory.createObjectLiteralExpression([
    ts.factory.createPropertyAssignment(
      'path',
      ts.factory.createArrayLiteralExpression(slot.path.map(p => ts.factory.createStringLiteral(p)))
    ),
    ts.factory.createPropertyAssignment('textKey', ts.factory.createStringLiteral(slot.textKey)),
    ts.factory.createPropertyAssignment('entitiesKey', ts.factory.createStringLiteral(slot.entitiesKey))
  ], true)
}

export function emitFormattableFields (schema: Schema) {
  const detected = detectFormattableFields(schema)
  const entries = [...detected.entries()].sort(([a], [b]) => a.localeCompare(b))

  const objectLiteral = ts.factory.createObjectLiteralExpression(
    entries.map(([method, slots]) =>
      ts.factory.createPropertyAssignment(
        ts.factory.createStringLiteral(method),
        ts.factory.createArrayLiteralExpression(slots.map(slotLiteral), true)
      )
    ),
    true
  )

  const decl = ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [ts.factory.createVariableDeclaration(
        'FORMATTABLE_FIELDS',
        undefined,
        undefined,
        ts.factory.createAsExpression(objectLiteral, ts.factory.createTypeReferenceNode('const'))
      )],
      ts.NodeFlags.Const
    )
  )

  return formatModule({
    nodes: [decl],
    imports: [],
    botApiVersion: versionString(schema),
    sourceUrl: schema.source.core,
    generatedAt: schema.source.fetchedAt
  })
}
