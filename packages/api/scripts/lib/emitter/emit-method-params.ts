import ts from 'typescript'

import type { Schema } from '../schema-types'

import { formatModule } from './format'
import { versionString } from './load-schema'

// per-method param-name sets. core uses these to gate `'*'` default params so a
// global default (e.g. parse_mode) only lands on methods that actually accept it
export function emitMethodParams (schema: Schema) {
  const entries = [...schema.methods]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(method =>
      ts.factory.createPropertyAssignment(
        ts.factory.createStringLiteral(method.name),
        ts.factory.createArrayLiteralExpression(
          method.arguments.map(arg => ts.factory.createStringLiteral(arg.name)),
          false
        )
      )
    )

  const decl = ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [ts.factory.createVariableDeclaration(
        ts.factory.createIdentifier('METHOD_PARAMS'),
        undefined,
        ts.factory.createTypeReferenceNode('Record', [
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
          ts.factory.createTypeOperatorNode(
            ts.SyntaxKind.ReadonlyKeyword,
            ts.factory.createArrayTypeNode(
              ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
            )
          )
        ]),
        ts.factory.createObjectLiteralExpression(entries, true)
      )],
      ts.NodeFlags.Const
    )
  )

  return formatModule({
    nodes: [decl],
    botApiVersion: versionString(schema),
    sourceUrl: schema.source.core,
    generatedAt: schema.source.fetchedAt
  })
}
