import ts from 'typescript'

import type { Schema, SchemaObject } from '../schema-types'

import { formatModule } from './format'
import { detectOutgoingObjectNames, detectWidenedFieldsByObject } from './formattable-detect'
import { versionString } from './load-schema'
import { importTypeNamed, typeRefToTs, tsExportInterface, tsExportTypeAlias } from './ts-factory'

export function emitTypes (schema: Schema) {
  const nodes: ts.Node[] = []
  const widenedByObject = detectWidenedFieldsByObject(schema)
  const outgoing = detectOutgoingObjectNames(schema)

  // only widen outbound objects (referenced by method args); incoming-only like TelegramMessage stay narrow
  let needsFormattableImport = false

  for (const [name, fields] of widenedByObject) {
    if (!outgoing.has(name)) {
      widenedByObject.delete(name)
    } else if (fields.size > 0) {
      needsFormattableImport = true
    }
  }

  for (const obj of schema.objects) {
    nodes.push(emitObject(obj, widenedByObject.get(obj.name) ?? new Set()))
  }

  const imports = needsFormattableImport
    ? [importTypeNamed(['Formattable'], '../formattable')]
    : []

  return formatModule({
    nodes,
    imports,
    botApiVersion: versionString(schema),
    sourceUrl: schema.source.core,
    generatedAt: schema.source.fetchedAt
  })
}

function emitObject (obj: SchemaObject, widened: ReadonlySet<string>) {
  const name = `Telegram${obj.name}`

  if (obj.kind === 'object') {
    return tsExportInterface(
      name,
      obj.fields.map((f) => {
        let type = typeRefToTs(f.type)

        if (widened.has(f.name)) {
          type = ts.factory.createUnionTypeNode([
            type,
            ts.factory.createTypeReferenceNode('Formattable')
          ])
        }

        return {
          name: f.name,
          type,
          optional: !f.required,
          doc: f.description
        }
      }),
      obj.description
    )
  }

  if (obj.kind === 'union') {
    return tsExportTypeAlias(
      name,
      ts.factory.createUnionTypeNode(obj.members.map(typeRefToTs)),
      obj.description
    )
  }

  return tsExportTypeAlias(
    name,
    ts.factory.createUnionTypeNode(
      obj.values.map(v =>
        ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(v))
      )
    ),
    obj.description
  )
}
