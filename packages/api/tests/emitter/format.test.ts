import ts from 'typescript'
import { describe, it, expect } from 'vitest'

import { formatModule } from '../../scripts/lib/emitter/format'

describe('formatModule', () => {
  it('emits a leading banner and joins nodes', () => {
    const nodes = [
      ts.factory.createTypeAliasDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier('Foo'),
        undefined,
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
      )
    ]

    const out = formatModule({
      nodes,
      botApiVersion: '8.0.0',
      sourceUrl: 'https://core.telegram.org/bots/api',
      generatedAt: '2026-04-26T00:00:00.000Z'
    })

    expect(out).toContain('AUTO-GENERATED')
    expect(out).toContain('do not edit')
    expect(out).toContain('Bot API 8.0.0')
    expect(out).toContain('export type Foo = string')
  })
})
