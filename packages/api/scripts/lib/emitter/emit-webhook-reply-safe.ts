import ts from 'typescript'

import type { Schema, SchemaTypeRef } from '../schema-types'

import { formatModule } from './format'
import { versionString } from './load-schema'

// methods whose return type is literal `true` are safe to pipe into the webhook 200 body —
// `await tg.api.X(...)` resolves to `true` either way, so the optimization is transparent
export function emitWebhookReplySafe (schema: Schema) {
  const safe = schema.methods
    .filter(m => returnsTrue(m.returnType))
    .map(m => m.name)
    .sort()

  const literal = ts.factory.createArrayLiteralExpression(
    safe.map(name => ts.factory.createStringLiteral(name)),
    true
  )

  const decl = ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [ts.factory.createVariableDeclaration(
        ts.factory.createIdentifier('WEBHOOK_REPLY_SAFE_METHODS'),
        undefined,
        ts.factory.createTypeReferenceNode('ReadonlySet', [
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
        ]),
        ts.factory.createNewExpression(
          ts.factory.createIdentifier('Set'),
          [ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)],
          [literal]
        )
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

function returnsTrue (ref: SchemaTypeRef) {
  return ref.kind === 'true'
}
