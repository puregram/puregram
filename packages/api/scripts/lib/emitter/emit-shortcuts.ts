import ts from 'typescript'

import type { Schema, SchemaMethod, SchemaTypeRef } from '../schema-types'

import { formatModule } from './format'
import { detectWidenedMethodArgs } from './formattable-detect'
import { versionString } from './load-schema'
import { hasMessageResult, shortcutResultType } from './shortcut-results'
import { METHOD_POSITIONALS, SHORTCUTS, type ShortcutSpec } from './shortcuts-config'
import { typeRefToTs, jsDoc, importTypeNamed } from './ts-factory'

export function emitShortcuts (schema: Schema) {
  const methodsByName = new Map<string, SchemaMethod>(schema.methods.map(m => [m.name, m]))
  const widenedArgs = detectWidenedMethodArgs(schema)
  const referencedTypes = new Set<string>()
  let usesFormattable = false

  const memberSigs: ts.TypeElement[] = []

  const messageShortcuts = SHORTCUTS.filter((sc) => {
    const method = methodsByName.get(sc.method)

    return method !== undefined && hasMessageResult(method.returnType)
  })
  const runtimeShortcuts = SHORTCUTS.filter(sc => sc.method !== 'sendWidget' && methodsByName.has(sc.method))

  for (const sc of SHORTCUTS) {
    const method = methodsByName.get(sc.method)

    if (!method) {
      continue
    }

    const widened = widenedArgs.get(sc.method) ?? new Set<string>()

    if (widened.size > 0 && (METHOD_POSITIONALS[sc.method] ?? []).some(p => widened.has(p.schemaArg))) {
      usesFormattable = true
    }

    memberSigs.push(buildShortcutSignature(sc, method, referencedTypes, widened))
  }

  const iface = ts.factory.createInterfaceDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier('TelegramShortcuts'),
    undefined,
    undefined,
    memberSigs
  )

  const paramsImports = runtimeShortcuts.map(s => `${pascal(s.method)}Params`)

  const imports = [
    ...(referencedTypes.size > 0 ? [importTypeNamed([...referencedTypes].sort(), './types')] : []),
    ...(paramsImports.length > 0 ? [importTypeNamed([...new Set(paramsImports)].sort(), './methods')] : []),
    ...(methodsByName.has('sendWidget') ? [importTypeNamed(['WidgetInput', 'WidgetSendOptions'], '../widget-like')] : []),
    ...(usesFormattable ? [importTypeNamed(['Formattable'], '../formattable')] : []),
    ...(messageShortcuts.length > 0 ? [importTypeNamed(['MessageUpdate'], './updates')] : [])
  ]

  return formatModule({
    nodes: [iface, ts.factory.createVariableStatement(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createVariableDeclarationList([
        ts.factory.createVariableDeclaration(
          'TELEGRAM_SHORTCUTS',
          undefined,
          undefined,
          ts.factory.createAsExpression(
            ts.factory.createArrayLiteralExpression(
              runtimeShortcuts.map(sc => ts.factory.createObjectLiteralExpression([
                ts.factory.createPropertyAssignment('verb', ts.factory.createStringLiteral(sc.verb)),
                ts.factory.createPropertyAssignment('method', ts.factory.createStringLiteral(sc.method)),
                ts.factory.createPropertyAssignment(
                  'wrapsMessage',
                  messageShortcuts.includes(sc) ? ts.factory.createTrue() : ts.factory.createFalse()
                ),
                ts.factory.createPropertyAssignment('args', ts.factory.createArrayLiteralExpression(
                  (METHOD_POSITIONALS[sc.method] ?? []).map(p => ts.factory.createStringLiteral(p.schemaArg))
                ))
              ], false)),
              true
            ),
            ts.factory.createTypeReferenceNode('const')
          )
        )
      ], ts.NodeFlags.Const)
    )],
    imports,
    botApiVersion: versionString(schema),
    sourceUrl: schema.source.core,
    generatedAt: schema.source.fetchedAt
  })
}

function buildShortcutSignature (
  sc: ShortcutSpec,
  method: SchemaMethod,
  referencedTypes: Set<string>,
  widened: ReadonlySet<string>
) {
  const positionals = METHOD_POSITIONALS[sc.method] ?? []
  const isWidget = sc.method === 'sendWidget'

  const positionalParams: ts.ParameterDeclaration[] = positionals.map((p) => {
    const schemaArg = method.arguments.find(a => a.name === p.schemaArg)

    if (!schemaArg) {
      throw new Error(`shortcut ${sc.verb}: schema arg ${p.schemaArg} not found on ${method.name}`)
    }

    collectRefs(schemaArg.type, referencedTypes)

    let type = typeRefToTs(schemaArg.type)

    if (isWidget && p.schemaArg === 'html') {
      type = ts.factory.createTypeReferenceNode('W')
    } else if (widened.has(p.schemaArg)) {
      type = ts.factory.createUnionTypeNode([
        type,
        ts.factory.createTypeReferenceNode('Formattable')
      ])
    }

    return ts.factory.createParameterDeclaration(
      undefined, undefined,
      ts.factory.createIdentifier(p.name),
      undefined,
      type,
      undefined
    )
  })

  const filledNames = positionals.map(p => p.schemaArg)
  const omitType = ts.factory.createTypeReferenceNode('Omit', [
    ts.factory.createTypeReferenceNode(`${pascal(sc.method)}Params`),
    ts.factory.createUnionTypeNode(
      filledNames.map(n => ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(n)))
    )
  ])

  const optionalParam = ts.factory.createParameterDeclaration(
    undefined, undefined,
    ts.factory.createIdentifier('params'),
    ts.factory.createToken(ts.SyntaxKind.QuestionToken),
    isWidget
      ? ts.factory.createTypeReferenceNode('WidgetSendOptions', [ts.factory.createTypeReferenceNode('W')])
      : omitType,
    undefined
  )

  collectRefs(method.returnType, referencedTypes, true)
  const returnType = ts.factory.createTypeReferenceNode('Promise', [shortcutResultType(method.returnType)])

  return jsDoc(
    `Shortcut for \`tg.api.${method.name}\`. ${method.description}`,
    ts.factory.createMethodSignature(
      undefined,
      ts.factory.createIdentifier(sc.verb),
      undefined,
      isWidget
        ? [ts.factory.createTypeParameterDeclaration(
            undefined, 'W', ts.factory.createTypeReferenceNode('WidgetInput')
          )]
        : undefined,
      [...positionalParams, optionalParam],
      returnType
    )
  )
}

function pascal (s: string) {
  return s[0]!.toUpperCase() + s.slice(1)
}

function collectRefs (ref: SchemaTypeRef, into: Set<string>, wrapped = false): void {
  if (ref.kind === 'reference') {
    if (!wrapped || ref.name !== 'Message') {
      into.add(`Telegram${ref.name}`)
    }
  } else if (ref.kind === 'array') {
    collectRefs(ref.of, into, wrapped)
  } else if (ref.kind === 'union') {
    ref.of.forEach(t => collectRefs(t, into, wrapped))
  }
}
