import ts from 'typescript'

import type { Schema, SchemaMethod, SchemaTypeRef } from '../schema-types'

import { formatModule } from './format'
import { detectWidenedMethodArgs, isRichMessageRef } from './formattable-detect'
import { versionString } from './load-schema'
import { typeRefToTs, tsExportInterface, tsExportTypeAlias, importTypeNamed } from './ts-factory'

export function emitMethods (schema: Schema) {
  const nodes: ts.Node[] = []

  const widenedArgs = detectWidenedMethodArgs(schema)
  const referencedNames = collectReferencedTypeNames(schema)
  const imports: ts.ImportDeclaration[] = []

  if (referencedNames.length > 0) {
    imports.push(importTypeNamed(referencedNames.map(n => `Telegram${n}`), './types'))
  }

  if (widenedArgs.size > 0) {
    imports.push(importTypeNamed(['Formattable'], '../formattable'))
  }

  if (schema.methods.some(m => m.arguments.some(a => isRichMessageRef(a.type)))) {
    imports.push(importTypeNamed(['RichLike'], '../rich-like'))
  }

  for (const method of schema.methods) {
    if (method.arguments.length > 0) {
      nodes.push(emitParamsInterface(method, widenedArgs.get(method.name) ?? new Set()))
    }

    nodes.push(emitMethodAlias(method))
  }

  return formatModule({
    nodes,
    imports,
    botApiVersion: versionString(schema),
    sourceUrl: schema.source.core,
    generatedAt: schema.source.fetchedAt
  })
}

function collectReferencedTypeNames (schema: Schema) {
  const names = new Set<string>()
  const walk = (ref: SchemaTypeRef): void => {
    if (ref.kind === 'reference') {
      names.add(ref.name)
    } else if (ref.kind === 'array') {
      walk(ref.of)
    } else if (ref.kind === 'union') {
      ref.of.forEach(walk)
    }
  }

  for (const m of schema.methods) {
    walk(m.returnType)

    for (const a of m.arguments) {
      walk(a.type)
    }
  }

  return [...names].sort()
}

function pascalCase (name: string) {
  return name[0]!.toUpperCase() + name.slice(1)
}

function emitParamsInterface (method: SchemaMethod, widened: ReadonlySet<string>) {
  return tsExportInterface(
    `${pascalCase(method.name)}Params`,
    method.arguments.map((a) => {
      let type = typeRefToTs(a.type)

      if (a.name === 'reply_markup') {
        // accept either the bot-api shape or any class with matching toJSON() —
        // covers Keyboard / InlineKeyboard / ForceReply / RemoveKeyboard at the call site
        type = wrapWithToJSON(type)
      } else if (isRichMessageRef(a.type)) {
        // accept a @puregram/rich `Rich` (or any RichLike) — its toJSON unwraps on serialize
        type = ts.factory.createUnionTypeNode([
          type,
          ts.factory.createTypeReferenceNode('RichLike')
        ])
      } else if (widened.has(a.name)) {
        type = ts.factory.createUnionTypeNode([
          type,
          ts.factory.createTypeReferenceNode('Formattable')
        ])
      }

      return {
        name: a.name,
        type,
        optional: !a.required,
        doc: a.description
      }
    }),
    method.description
  )
}

function wrapWithToJSON (inner: ts.TypeNode) {
  const toJSONShape = ts.factory.createTypeLiteralNode([
    ts.factory.createPropertySignature(
      undefined,
      ts.factory.createIdentifier('toJSON'),
      undefined,
      ts.factory.createFunctionTypeNode(undefined, [], inner)
    )
  ])

  return ts.factory.createUnionTypeNode([inner, toJSONShape])
}

function emitMethodAlias (method: SchemaMethod) {
  const returnType = typeRefToTs(method.returnType)

  const paramSig: ts.ParameterDeclaration[] = method.arguments.length > 0
    ? [ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        ts.factory.createIdentifier('params'),
        undefined,
        ts.factory.createTypeReferenceNode(`${pascalCase(method.name)}Params`),
        undefined
      )]
    : []

  const fnType = ts.factory.createFunctionTypeNode(
    undefined,
    paramSig,
    ts.factory.createTypeReferenceNode('Promise', [returnType])
  )

  return tsExportTypeAlias(method.name, fnType, method.description)
}
