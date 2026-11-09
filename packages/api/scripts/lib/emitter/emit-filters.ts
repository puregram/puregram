import ts from 'typescript'

import type { Schema, SchemaField, SchemaObject, SchemaTypeRef } from '../schema-types'

import { getterNameFor } from './field-names'
import { formatModule } from './format'
import { versionString } from './load-schema'
import { hasWrapperClass } from './structures-config'
import { importNamed, importTypeNamed, jsDoc, typeRefToTs } from './ts-factory'
import { buildUpdateKinds, type UpdateKindSpec } from './updates-config'

export function emitFilters (schema: Schema) {
  const kinds = buildUpdateKinds(schema)
  const objectsByName = new Map<string, SchemaObject>(schema.objects.map(o => [o.name, o]))

  // accumulate (camelGetter -> kinds where the optional field exists). skip required fields,
  // skip already-`has`/`is` named getters, skip names that would collide with `extras`
  const presence = new Map<string, { kinds: string[], cls: string[], field: SchemaField }>()

  for (const k of kinds) {
    const obj = objectsByName.get(k.payloadType.replace(/^Telegram/, ''))

    if (obj?.kind !== 'object') {
      continue
    }

    const extrasNames = new Set((k.extras ?? []).map(e => e.name))

    for (const f of obj.fields) {
      if (f.required) {
        continue
      }

      const camelName = getterNameFor(f.name, obj.fields)

      if (/^(has|is)[A-Z]/.test(camelName)) {
        continue
      }

      const hasName = `has${camelName[0]!.toUpperCase()}${camelName.slice(1)}`

      if (extrasNames.has(hasName)) {
        continue
      }

      let entry = presence.get(camelName)

      if (!entry) {
        entry = { kinds: [], cls: [], field: f }
        presence.set(camelName, entry)
      }

      entry.kinds.push(k.kindName)
      entry.cls.push(k.className)
    }
  }

  const nodes: ts.Node[] = []

  const presenceNames = [...presence.keys()].sort()

  for (const camelName of presenceNames) {
    const entry = presence.get(camelName)

    if (!entry) {
      continue
    }

    const hasName = `has${camelName[0]!.toUpperCase()}${camelName.slice(1)}`

    nodes.push(emitPresenceFilter(hasName, camelName, entry.kinds, entry.field, objectsByName))
  }

  nodes.push(emitKindCallable())
  nodes.push(emitKindShorthand(kinds))

  for (const node of emitActionCallable(kinds)) {
    nodes.push(node)
  }

  nodes.push(emitActionShorthand(kinds))

  // wrapper-class refs go through `./structures`, raw `Telegram*` refs through `./types`
  const wrapperRefs = new Set<string>()
  const rawRefs = new Set<string>()

  for (const entry of presence.values()) {
    collectRefs(entry.field.type, objectsByName, wrapperRefs, rawRefs)
  }

  const imports = [
    importNamed(['defineFilter'], '../filter-runtime'),
    importTypeNamed(['Filter'], '../filter-runtime'),
    importTypeNamed(['AnyUpdate'], '../custom-update'),
    importTypeNamed(['UpdateKind', 'UpdateKindMap'], './updates'),
    ...(wrapperRefs.size > 0 ? [importTypeNamed([...wrapperRefs].sort(), './structures')] : []),
    ...(rawRefs.size > 0 ? [importTypeNamed([...rawRefs].sort(), './types')] : [])
  ]

  return formatModule({
    nodes,
    imports,
    botApiVersion: versionString(schema),
    sourceUrl: schema.source.core,
    generatedAt: schema.source.fetchedAt
  })
}

// type ref → wrapper-getter return type, non-nullable (presence filters narrow via `field != null`)
function wrapperType (ref: SchemaTypeRef, objectsByName: Map<string, SchemaObject>): ts.TypeNode {
  if (ref.kind === 'reference' && isObjectWrapper(ref.name, objectsByName)) {
    return ts.factory.createTypeReferenceNode(ref.name)
  }

  if (ref.kind === 'array') {
    return ts.factory.createArrayTypeNode(wrapperType(ref.of, objectsByName))
  }

  return typeRefToTs(ref)
}

function isObjectWrapper (name: string, objectsByName: Map<string, SchemaObject>) {
  return hasWrapperClass(name, objectsByName.get(name)?.kind)
}

function collectRefs (
  ref: SchemaTypeRef,
  objectsByName: Map<string, SchemaObject>,
  wrapperRefs: Set<string>,
  rawRefs: Set<string>
): void {
  if (ref.kind === 'reference') {
    if (isObjectWrapper(ref.name, objectsByName)) {
      wrapperRefs.add(ref.name)
    } else {
      rawRefs.add(`Telegram${ref.name}`)
    }

    return
  }

  if (ref.kind === 'array') {
    collectRefs(ref.of, objectsByName, wrapperRefs, rawRefs)
  } else if (ref.kind === 'union') {
    ref.of.forEach(t => collectRefs(t, objectsByName, wrapperRefs, rawRefs))
  }
}

function emitPresenceFilter (
  hasName: string,
  camelName: string,
  kinds: string[],
  field: SchemaField,
  objectsByName: Map<string, SchemaObject>
) {
  // Base = `unknown` so `kind.X.and(hasField)` resolves to `kind.X`'s narrow Base
  // (`MessageUpdate & unknown` = `MessageUpdate`) without union distribution. Mod stamps
  // the field with its wrapper-getter type, so `Modify` collapses `text: string | undefined` to `string`
  const presentMarker = wrapperType(field.type, objectsByName)

  const filterType = ts.factory.createTypeReferenceNode('Filter', [
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
    ts.factory.createTypeLiteralNode([
      ts.factory.createPropertySignature(
        undefined,
        ts.factory.createIdentifier(camelName),
        undefined,
        presentMarker
      )
    ])
  ])

  const predicate = ts.factory.createArrowFunction(
    undefined,
    undefined,
    [ts.factory.createParameterDeclaration(
      undefined, undefined, ts.factory.createIdentifier('u'), undefined,
      ts.factory.createTypeReferenceNode('AnyUpdate'), undefined
    )],
    ts.factory.createTypePredicateNode(
      undefined,
      ts.factory.createIdentifier('u'),
      ts.factory.createTypeReferenceNode('AnyUpdate')
    ),
    ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
    ts.factory.createParenthesizedExpression(
      // (u as { camelName?: unknown }).camelName != null
      ts.factory.createBinaryExpression(
        ts.factory.createPropertyAccessExpression(
          ts.factory.createParenthesizedExpression(
            ts.factory.createAsExpression(
              ts.factory.createIdentifier('u'),
              ts.factory.createTypeLiteralNode([
                ts.factory.createPropertySignature(
                  undefined,
                  ts.factory.createIdentifier(camelName),
                  ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                  ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
                )
              ])
            )
          ),
          camelName
        ),
        ts.SyntaxKind.ExclamationEqualsToken,
        ts.factory.createNull()
      )
    )
  )

  const meta = ts.factory.createObjectLiteralExpression([
    ts.factory.createPropertyAssignment(
      ts.factory.createIdentifier('kinds'),
      ts.factory.createArrayLiteralExpression(
        kinds.map(k => ts.factory.createStringLiteral(k)),
        false
      )
    )
  ], false)

  const call = ts.factory.createCallExpression(
    ts.factory.createIdentifier('defineFilter'),
    undefined,
    [
      ts.factory.createStringLiteral(hasName),
      predicate,
      meta
    ]
  )

  const decl = ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [ts.factory.createVariableDeclaration(
        ts.factory.createIdentifier(hasName),
        undefined,
        filterType,
        pure(call)
      )],
      ts.NodeFlags.Const
    )
  )

  return jsDoc(`filter — true if the update has \`${camelName}\` set`, decl)
}

function camelizeKind (snake: string) {
  return snake.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}

function emitKindCallable () {
  const decl = ts.factory.createFunctionDeclaration(
    undefined,
    undefined,
    ts.factory.createIdentifier('_kind'),
    [ts.factory.createTypeParameterDeclaration(
      undefined,
      ts.factory.createIdentifier('K'),
      ts.factory.createTypeReferenceNode('UpdateKind')
    )],
    [ts.factory.createParameterDeclaration(
      undefined, undefined,
      ts.factory.createIdentifier('k'),
      undefined,
      ts.factory.createTypeReferenceNode('K'),
      undefined
    )],
    ts.factory.createTypeReferenceNode('Filter', [
      ts.factory.createIndexedAccessTypeNode(
        ts.factory.createTypeReferenceNode('UpdateKindMap'),
        ts.factory.createTypeReferenceNode('K')
      )
    ]),
    ts.factory.createBlock([
      ts.factory.createReturnStatement(
        ts.factory.createCallExpression(
          ts.factory.createIdentifier('defineFilter'),
          undefined,
          [
            ts.factory.createTemplateExpression(
              ts.factory.createTemplateHead('kind.'),
              [ts.factory.createTemplateSpan(
                ts.factory.createIdentifier('k'),
                ts.factory.createTemplateTail('')
              )]
            ),
            ts.factory.createArrowFunction(
              undefined, undefined,
              [ts.factory.createParameterDeclaration(
                undefined, undefined, ts.factory.createIdentifier('u'), undefined,
                ts.factory.createTypeReferenceNode('AnyUpdate'), undefined
              )],
              ts.factory.createTypePredicateNode(
                undefined,
                ts.factory.createIdentifier('u'),
                ts.factory.createIndexedAccessTypeNode(
                  ts.factory.createTypeReferenceNode('UpdateKindMap'),
                  ts.factory.createTypeReferenceNode('K')
                )
              ),
              ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
              ts.factory.createBinaryExpression(
                ts.factory.createPropertyAccessExpression(
                  ts.factory.createParenthesizedExpression(
                    ts.factory.createAsExpression(
                      ts.factory.createIdentifier('u'),
                      ts.factory.createTypeLiteralNode([
                        ts.factory.createPropertySignature(
                          undefined,
                          ts.factory.createIdentifier('kind'),
                          ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                          ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
                        )
                      ])
                    )
                  ),
                  'kind'
                ),
                ts.SyntaxKind.EqualsEqualsEqualsToken,
                ts.factory.createIdentifier('k')
              )
            ),
            ts.factory.createObjectLiteralExpression([
              ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier('kinds'),
                ts.factory.createArrayLiteralExpression(
                  [ts.factory.createIdentifier('k')],
                  false
                )
              )
            ], false)
          ]
        )
      )
    ], true)
  )

  return decl
}

function emitKindShorthand (kinds: UpdateKindSpec[]) {
  const props = kinds.map((k) => {
    const propName = camelizeKind(k.kindName)

    return ts.factory.createPropertyAssignment(
      ts.factory.createIdentifier(propName),
      pure(ts.factory.createCallExpression(
        ts.factory.createIdentifier('_kind'),
        undefined,
        [ts.factory.createStringLiteral(k.kindName)]
      ))
    )
  })

  const decl = ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [ts.factory.createVariableDeclaration(
        ts.factory.createIdentifier('kind'),
        undefined,
        undefined,
        pure(ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier('Object'),
            'assign'
          ),
          undefined,
          [
            ts.factory.createIdentifier('_kind'),
            ts.factory.createObjectLiteralExpression(props, true)
          ]
        ))
      )],
      ts.NodeFlags.Const
    )
  )

  return jsDoc('filter — match a specific update kind. callable form `kind(k)` plus shorthand properties (`kind.message`, `kind.editedMessage`)', decl)
}

function emitActionCallable (kinds: UpdateKindSpec[]) {
  // ServiceActionKind = `source: 'derived'` subset of UpdateKind (service events)
  const derived = kinds.filter(k => k.source.kind === 'derived')

  const typeAlias = ts.factory.createTypeAliasDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier('ServiceActionKind'),
    undefined,
    ts.factory.createUnionTypeNode(
      derived.map(k => ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(k.kindName)))
    )
  )

  const fnDecl = ts.factory.createFunctionDeclaration(
    undefined,
    undefined,
    ts.factory.createIdentifier('_action'),
    [ts.factory.createTypeParameterDeclaration(
      undefined,
      ts.factory.createIdentifier('K'),
      ts.factory.createTypeReferenceNode('ServiceActionKind')
    )],
    [ts.factory.createParameterDeclaration(
      undefined, undefined,
      ts.factory.createIdentifier('k'),
      undefined,
      ts.factory.createTypeReferenceNode('K'),
      undefined
    )],
    ts.factory.createTypeReferenceNode('Filter', [
      ts.factory.createIndexedAccessTypeNode(
        ts.factory.createTypeReferenceNode('UpdateKindMap'),
        ts.factory.createTypeReferenceNode('K')
      )
    ]),
    ts.factory.createBlock([
      ts.factory.createReturnStatement(
        ts.factory.createCallExpression(
          ts.factory.createIdentifier('_kind'),
          undefined,
          [ts.factory.createIdentifier('k')]
        )
      )
    ], true)
  )

  return [typeAlias, fnDecl]
}

function emitActionShorthand (kinds: UpdateKindSpec[]) {
  const derived = kinds.filter(k => k.source.kind === 'derived')

  const props = derived.map((k) => {
    const propName = camelizeKind(k.kindName)

    return ts.factory.createPropertyAssignment(
      ts.factory.createIdentifier(propName),
      pure(ts.factory.createCallExpression(
        ts.factory.createIdentifier('_action'),
        undefined,
        [ts.factory.createStringLiteral(k.kindName)]
      ))
    )
  })

  const decl = ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [ts.factory.createVariableDeclaration(
        ts.factory.createIdentifier('action'),
        undefined,
        undefined,
        pure(ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier('Object'),
            'assign'
          ),
          undefined,
          [
            ts.factory.createIdentifier('_action'),
            ts.factory.createObjectLiteralExpression(props, true)
          ]
        ))
      )],
      ts.NodeFlags.Const
    )
  )

  return jsDoc('filter — match a service-event update kind. shorthand for `kind` restricted to derived (Message-payload) events', decl)
}

function pure (call: ts.CallExpression) {
  return ts.addSyntheticLeadingComment(call, ts.SyntaxKind.MultiLineCommentTrivia, '#__PURE__', false)
}
