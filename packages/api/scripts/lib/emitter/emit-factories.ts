import ts from 'typescript'

import type { Schema, SchemaObject } from '../schema-types'

import { FACTORY_FAMILIES } from './factories-config'
import { formatModule } from './format'
import { versionString } from './load-schema'
import { jsDoc, importTypeNamed } from './ts-factory'

interface VariantSpec {
  schemaName: string
  variant: string
  obj: Extract<SchemaObject, { kind: 'object' }>
}

export function emitFactories (schema: Schema) {
  const nodes: ts.Node[] = []
  const referencedTypes = new Set<string>()

  for (const fam of FACTORY_FAMILIES) {
    const variants = collectVariants(schema, fam.prefix)

    if (variants.length === 0) {
      continue
    }

    nodes.push(emitFactoryClass(fam.emit, variants))

    for (const v of variants) {
      referencedTypes.add(`Telegram${v.schemaName}`)
    }
  }

  const imports = referencedTypes.size > 0
    ? [importTypeNamed([...referencedTypes].sort(), './types')]
    : []

  return formatModule({
    nodes,
    imports,
    botApiVersion: versionString(schema),
    sourceUrl: schema.source.core,
    generatedAt: schema.source.fetchedAt
  })
}

function collectVariants (schema: Schema, prefix: string) {
  const variants: VariantSpec[] = []

  for (const obj of schema.objects) {
    if (obj.kind !== 'object') {
      continue
    }

    if (!obj.name.startsWith(prefix)) {
      continue
    }

    if (obj.name === prefix) {
      continue
    }

    // `InlineQueryResultCached*` belongs to the separate cached family
    if (prefix === 'InlineQueryResult' && obj.name.startsWith('InlineQueryResultCached')) {
      continue
    }

    const typeField = obj.fields.find(f => f.name === 'type')

    if (!typeField || typeField.type.kind !== 'string' || !typeField.type.enumeration) {
      continue
    }

    variants.push({
      schemaName: obj.name,
      variant: typeField.type.enumeration[0]!,
      obj
    })
  }

  return variants
}

function emitFactoryClass (className: string, variants: VariantSpec[]) {
  const methods = variants.map(v => emitVariantMethod(v))

  return ts.factory.createClassDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(className),
    undefined,
    undefined,
    methods
  )
}

function emitVariantMethod (v: VariantSpec) {
  const camelVariant = v.variant.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())

  const omitTypeNode = ts.factory.createTypeReferenceNode('Omit', [
    ts.factory.createTypeReferenceNode(`Telegram${v.schemaName}`),
    ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral('type'))
  ])

  const body = ts.factory.createBlock([
    ts.factory.createReturnStatement(
      ts.factory.createObjectLiteralExpression([
        ts.factory.createPropertyAssignment('type', ts.factory.createStringLiteral(v.variant)),
        ts.factory.createSpreadAssignment(ts.factory.createIdentifier('params'))
      ], true)
    )
  ], true)

  return jsDoc(
    v.obj.description,
    ts.factory.createMethodDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)],
      undefined,
      ts.factory.createIdentifier(camelVariant),
      undefined,
      undefined,
      [ts.factory.createParameterDeclaration(
        undefined, undefined,
        ts.factory.createIdentifier('params'),
        undefined,
        omitTypeNode,
        undefined
      )],
      ts.factory.createTypeReferenceNode(`Telegram${v.schemaName}`),
      body
    )
  )
}
