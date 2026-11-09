import ts from 'typescript'

import type { Schema } from '../schema-types'

import { formatModule } from './format'
import { versionString } from './load-schema'
import { buildUpdateKinds } from './updates-config'

export function emitServiceEvents (schema: Schema) {
  const derived = buildUpdateKinds(schema).filter(k => k.source.kind === 'derived')

  const mapEntries = derived.map((k) => {
    const messageField = (k.source as { kind: 'derived', messageField: string }).messageField

    return ts.factory.createPropertyAssignment(
      ts.factory.createStringLiteral(messageField),
      ts.factory.createStringLiteral(k.kindName)
    )
  })

  const mapDecl = ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [ts.factory.createVariableDeclaration(
        ts.factory.createIdentifier('SERVICE_EVENT_FIELDS'),
        undefined,
        undefined,
        ts.factory.createAsExpression(
          ts.factory.createObjectLiteralExpression(mapEntries, true),
          ts.factory.createTypeReferenceNode('const')
        )
      )],
      ts.NodeFlags.Const
    )
  )

  const orderDecl = ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [ts.factory.createVariableDeclaration(
        ts.factory.createIdentifier('SERVICE_EVENT_ORDER'),
        undefined,
        undefined,
        ts.factory.createAsExpression(
          ts.factory.createArrayLiteralExpression(
            derived.map((k) => {
              const messageField = (k.source as { kind: 'derived', messageField: string }).messageField

              return ts.factory.createStringLiteral(messageField)
            }),
            false
          ),
          ts.factory.createTypeReferenceNode('const')
        )
      )],
      ts.NodeFlags.Const
    )
  )

  return formatModule({
    nodes: [mapDecl, orderDecl],
    botApiVersion: versionString(schema),
    sourceUrl: schema.source.core,
    generatedAt: schema.source.fetchedAt
  })
}
