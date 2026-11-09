import ts from 'typescript'

import type { Schema } from '../schema-types'

import { filterAliasName } from './emit-filter-types'
import { formatModule } from './format'
import { versionString } from './load-schema'
import { importTypeNamed, jsDoc } from './ts-factory'
import { buildUpdateKinds } from './updates-config'

export function emitDispatch (schema: Schema) {
  const kinds = buildUpdateKinds(schema)
  const members: ts.TypeElement[] = []

  for (const k of kinds) {
    const dispatcherName = dispatcherMethodName(k.kindName)
    const filterAlias = filterAliasName(k.className)

    members.push(jsDoc(
      `register a handler for every \`${k.kindName}\` update`,
      buildHandlerOnlySignature(dispatcherName, k.className)
    ))

    members.push(jsDoc(
      `register a filter-gated handler for \`${k.kindName}\` updates. handler arg narrows via \`Modify<${k.className}, Mod>\``,
      buildFilterAndHandlerSignature(dispatcherName, k.className, filterAlias)
    ))
  }

  const dispatchersInterface = ts.factory.createInterfaceDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier('TelegramDispatchers'),
    undefined,
    undefined,
    members
  )

  const imports = [
    importTypeNamed(['Filter'], '../filter-runtime'),
    importTypeNamed(['Modify'], '../util-types'),
    importTypeNamed(['OnOptions', 'UpdateHandler'], '../dispatch-runtime'),
    importTypeNamed(kinds.map(k => k.className).sort(), './updates')
  ]

  return formatModule({
    nodes: [dispatchersInterface],
    imports,
    botApiVersion: versionString(schema),
    sourceUrl: schema.source.core,
    generatedAt: schema.source.fetchedAt
  })
}

// `message` → `onMessage`, `chat_member` → `onChatMember`, `proximity_alert_triggered` → `onProximityAlertTriggered`
function dispatcherMethodName (kindName: string) {
  const camel = kindName.split('_').map(s => s[0]!.toUpperCase() + s.slice(1)).join('')

  return `on${camel}`
}

function buildHandlerOnlySignature (methodName: string, className: string) {
  return ts.factory.createMethodSignature(
    undefined,
    ts.factory.createIdentifier(methodName),
    undefined,
    undefined,
    [
      ts.factory.createParameterDeclaration(
        undefined, undefined,
        ts.factory.createIdentifier('handler'),
        undefined,
        ts.factory.createTypeReferenceNode('UpdateHandler', [
          ts.factory.createTypeReferenceNode(className)
        ]),
        undefined
      ),
      ts.factory.createParameterDeclaration(
        undefined, undefined,
        ts.factory.createIdentifier('options'),
        ts.factory.createToken(ts.SyntaxKind.QuestionToken),
        ts.factory.createTypeReferenceNode('OnOptions'),
        undefined
      )
    ],
    ts.factory.createThisTypeNode()
  )
}

// filter pinned to `Filter<unknown, Mod>` — only `Mod` is inferred. dropping the
// Base generic cuts one type param × 53 dispatcher methods, big LSP win on overload resolution
function buildFilterAndHandlerSignature (methodName: string, className: string, _filterAlias: string) {
  return ts.factory.createMethodSignature(
    undefined,
    ts.factory.createIdentifier(methodName),
    undefined,
    [
      ts.factory.createTypeParameterDeclaration(undefined, ts.factory.createIdentifier('Mod'), undefined, undefined)
    ],
    [
      ts.factory.createParameterDeclaration(
        undefined, undefined,
        ts.factory.createIdentifier('filter'),
        undefined,
        ts.factory.createTypeReferenceNode('Filter', [
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
          ts.factory.createTypeReferenceNode('Mod')
        ]),
        undefined
      ),
      ts.factory.createParameterDeclaration(
        undefined, undefined,
        ts.factory.createIdentifier('handler'),
        undefined,
        ts.factory.createTypeReferenceNode('UpdateHandler', [
          ts.factory.createTypeReferenceNode('Modify', [
            ts.factory.createTypeReferenceNode(className),
            ts.factory.createTypeReferenceNode('Mod')
          ])
        ]),
        undefined
      ),
      ts.factory.createParameterDeclaration(
        undefined, undefined,
        ts.factory.createIdentifier('options'),
        ts.factory.createToken(ts.SyntaxKind.QuestionToken),
        ts.factory.createTypeReferenceNode('OnOptions'),
        undefined
      )
    ],
    ts.factory.createThisTypeNode()
  )
}

export { dispatcherMethodName }
