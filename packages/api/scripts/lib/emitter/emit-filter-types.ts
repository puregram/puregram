import ts from 'typescript'

import type { Schema } from '../schema-types'

import { formatModule } from './format'
import { versionString } from './load-schema'
import { importTypeNamed, jsDoc } from './ts-factory'
import { buildUpdateKinds } from './updates-config'

export function emitFilterTypes (schema: Schema) {
  const kinds = buildUpdateKinds(schema)
  const nodes: ts.Node[] = kinds.map(k =>
    jsDoc(
      `pre-bound \`Filter\` for \`${k.className}\`. compose via \`.and()\` / \`.or()\` to layer Mod refinements`,
      ts.factory.createTypeAliasDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier(filterAliasName(k.className)),
        [ts.factory.createTypeParameterDeclaration(
          undefined,
          ts.factory.createIdentifier('Mod'),
          undefined,
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
        )],
        ts.factory.createTypeReferenceNode('Filter', [
          ts.factory.createTypeReferenceNode(k.className),
          ts.factory.createTypeReferenceNode('Mod')
        ])
      )
    )
  )

  nodes.push(jsDoc(
    'cross-kind filter. used by `tg.onUpdate(filter, h)` for predicates that span update kinds',
    ts.factory.createTypeAliasDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier('AnyUpdateFilter'),
      [ts.factory.createTypeParameterDeclaration(
        undefined,
        ts.factory.createIdentifier('Mod'),
        undefined,
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
      )],
      ts.factory.createTypeReferenceNode('Filter', [
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
        ts.factory.createTypeReferenceNode('Mod')
      ])
    )
  ))

  const imports = [
    importTypeNamed(['Filter'], '../filter-runtime'),
    importTypeNamed(kinds.map(k => k.className).sort(), './updates')
  ]

  return formatModule({
    nodes,
    imports,
    botApiVersion: versionString(schema),
    sourceUrl: schema.source.core,
    generatedAt: schema.source.fetchedAt
  })
}

// `MessageUpdate` → `MessageFilter`, `CallbackQueryUpdate` → `CallbackQueryFilter`
export function filterAliasName (className: string) {
  const stem = className.endsWith('Update') ? className.slice(0, -'Update'.length) : className

  return `${stem}Filter`
}
