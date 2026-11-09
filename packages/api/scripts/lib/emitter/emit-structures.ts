import ts from 'typescript'

import type { Schema, SchemaField, SchemaObject, SchemaTypeRef } from '../schema-types'

import { camelCase, getterNameFor } from './field-names'
import { formatModule } from './format'
import { versionString } from './load-schema'
import { ARRAY_WRAPPER_NAMES, arrayWrapperFor, hasWrapperClass } from './structures-config'
import { renderStructureExtras } from './structures-extras'
import { jsDoc, importTypeNamed, importNamed, typeRefToTs } from './ts-factory'

interface WrapperInfo {
  name: string
  isArray: boolean
}

export function emitStructures (schema: Schema) {
  // object wrappers map straight through; designated union wrappers (ChatMember) have no schema
  // fields, so they emit as a fieldless wrapper — just `raw` + handcrafted helpers + inspect
  const wrappedObjects: Extract<SchemaObject, { kind: 'object' }>[] = []

  for (const o of schema.objects) {
    if (!hasWrapperClass(o.name, o.kind)) {
      continue
    }

    wrappedObjects.push(o.kind === 'object'
      ? o
      : { kind: 'object', name: o.name, description: o.description, fields: [] })
  }

  const wrappedClassNames = new Set(wrappedObjects.map(o => o.name))

  const nodes: ts.Node[] = []

  for (const obj of wrappedObjects) {
    nodes.push(emitClass(obj, wrappedClassNames))
    nodes.push(...emitSubtypeAliases(obj))
  }

  const referencedTypes = new Set<string>()

  for (const obj of wrappedObjects) {
    referencedTypes.add(`Telegram${obj.name}`)

    for (const f of obj.fields) {
      collectReferencedTypeNames(f.type, referencedTypes)
    }
  }

  const usesHas = wrappedObjects.some(o =>
    o.fields.some(f => !f.required && !/^(has|is)[A-Z]/.test(getterNameFor(f.name)))
  )

  const usedArrayWrappers = collectUsedArrayWrappers(wrappedObjects)

  const imports = [
    importTypeNamed([...referencedTypes].sort(), './types'),
    ...(usesHas ? [importTypeNamed(['Has'], '../util-types')] : []),
    importNamed(['INSPECT', 'makeInspect'], './inspect'),
    ...(usedArrayWrappers.length > 0
      ? [importNamed(usedArrayWrappers, '../structures-handcrafted')]
      : [])
  ]

  const printed = formatModule({
    nodes,
    imports,
    botApiVersion: versionString(schema),
    sourceUrl: schema.source.core,
    generatedAt: schema.source.fetchedAt
  })

  return spliceExtrasIntoPrinted(printed, wrappedObjects.map(o => o.name))
}

// extras stay as raw text — TS printer drops literal text from cross-source-file ast nodes,
// so splice post-print instead
function spliceExtrasIntoPrinted (printed: string, classNames: string[]) {
  let out = printed

  for (const className of classNames) {
    const extrasText = renderStructureExtras(className)

    if (!extrasText) {
      continue
    }

    // anchor on this class's inspect tail (4-space body indent + computed name)
    const classOpen = new RegExp(`^export class ${className} \\{`, 'm')
    const openMatch = classOpen.exec(out)

    if (!openMatch) {
      continue
    }

    const inspectAnchor = '    [INSPECT]('
    const inspectIndex = out.indexOf(inspectAnchor, openMatch.index)

    if (inspectIndex === -1) {
      continue
    }

    out = out.slice(0, inspectIndex) + extrasText + out.slice(inspectIndex)
  }

  return out
}

function collectReferencedTypeNames (ref: SchemaTypeRef, into: Set<string>): void {
  if (ref.kind === 'reference') {
    into.add(`Telegram${ref.name}`)
  } else if (ref.kind === 'array') {
    collectReferencedTypeNames(ref.of, into)
  } else if (ref.kind === 'union') {
    ref.of.forEach(t => collectReferencedTypeNames(t, into))
  }
}

function emitClass (obj: Extract<SchemaObject, { kind: 'object' }>, wrappedClassNames: Set<string>) {
  const className = obj.name
  const rawTypeName = `Telegram${obj.name}`

  const members: ts.ClassElement[] = []

  for (const f of obj.fields) {
    const info = wrapperInfoFor(f.type, wrappedClassNames)

    if (info) {
      members.push(ts.factory.createPropertyDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword)],
        ts.factory.createIdentifier(`_${camelCase(f.name)}`),
        ts.factory.createToken(ts.SyntaxKind.QuestionToken),
        wrapperReturnType(info, !f.required),
        undefined
      ))
    }
  }

  members.push(ts.factory.createConstructorDeclaration(
    undefined,
    [ts.factory.createParameterDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.PublicKeyword)],
      undefined,
      ts.factory.createIdentifier('raw'),
      undefined,
      ts.factory.createTypeReferenceNode(rawTypeName),
      undefined
    )],
    ts.factory.createBlock([], false)
  ))

  members.push(ts.factory.createMethodDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)],
    undefined,
    ts.factory.createIdentifier('fromPayload'),
    undefined,
    undefined,
    [ts.factory.createParameterDeclaration(
      undefined,
      undefined,
      ts.factory.createIdentifier('raw'),
      undefined,
      ts.factory.createTypeReferenceNode(rawTypeName),
      undefined
    )],
    ts.factory.createTypeReferenceNode(className),
    ts.factory.createBlock([
      ts.factory.createReturnStatement(
        ts.factory.createNewExpression(
          ts.factory.createIdentifier(className),
          undefined,
          [ts.factory.createIdentifier('raw')]
        )
      )
    ], true)
  ))

  for (const f of obj.fields) {
    members.push(emitGetter(f, wrappedClassNames))
  }

  for (const f of obj.fields) {
    if (f.required) {
      continue
    }

    const getterName = getterNameFor(f.name)

    if (/^(has|is)[A-Z]/.test(getterName)) {
      continue
    }

    const hasName = `has${getterName[0]!.toUpperCase()}${getterName.slice(1)}`

    members.push(emitAutoHasMethod(f, getterName, hasName, wrappedClassNames))
  }

  members.push(emitInspectMethod(obj))

  return jsDoc(
    obj.description,
    ts.factory.createClassDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(className),
      undefined,
      undefined,
      members
    )
  )
}

// field type → wrapper-class output shape. handles synthetic collection wrappers
// (PhotoSize[] → Photo, PhotoSize[][] → Photo[]); undefined for primitives and unwrapped refs
function wrapperInfoFor (ref: SchemaTypeRef, wrappedClassNames: Set<string>) {
  // T[] with a synthetic collection wrapper — wrapper IS the collection (singleton)
  const directSynth = arrayWrapperFor(ref)

  if (directSynth) {
    return { name: directSynth, isArray: false }
  }

  // T[][] with synthetic inner — array of synth wrappers
  if (ref.kind === 'array') {
    const innerSynth = arrayWrapperFor(ref.of)

    if (innerSynth) {
      return { name: innerSynth, isArray: true }
    }
  }

  if (ref.kind === 'reference' && wrappedClassNames.has(ref.name)) {
    return { name: ref.name, isArray: false }
  }

  if (ref.kind === 'array' && ref.of.kind === 'reference' && wrappedClassNames.has(ref.of.name)) {
    return { name: ref.of.name, isArray: true }
  }

  return undefined
}

function wrapperReturnType (info: WrapperInfo, optional: boolean) {
  let inner: ts.TypeNode = ts.factory.createTypeReferenceNode(info.name)

  if (info.isArray) {
    inner = ts.factory.createArrayTypeNode(inner)
  }

  if (optional) {
    return ts.factory.createUnionTypeNode([
      inner,
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword)
    ])
  }

  return inner
}

function collectUsedArrayWrappers (
  objs: Extract<SchemaObject, { kind: 'object' }>[]
) {
  const used = new Set<string>()

  for (const obj of objs) {
    for (const f of obj.fields) {
      const direct = arrayWrapperFor(f.type)

      if (direct) {
        used.add(direct)
      }

      if (f.type.kind === 'array') {
        const inner = arrayWrapperFor(f.type.of)

        if (inner) {
          used.add(inner)
        }
      }
    }
  }

  return ARRAY_WRAPPER_NAMES.filter(n => used.has(n))
}

function emitGetter (f: SchemaField, wrappedClassNames: Set<string>) {
  const camelName = getterNameFor(f.name)
  const info = wrapperInfoFor(f.type, wrappedClassNames)

  const returnType = info
    ? wrapperReturnType(info, !f.required)
    : (() => {
        const t = typeRefToTs(f.type)

        return f.required
          ? t
          : ts.factory.createUnionTypeNode([t, ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword)])
      })()

  let body: ts.Statement[]

  if (info) {
    if (info.isArray) {
      // lazy map raw → wrapped; optional arrays guard map() against undefined
      const memoAssign = ts.factory.createBinaryExpression(
        ts.factory.createPropertyAccessExpression(ts.factory.createThis(), `_${camelName}`),
        ts.SyntaxKind.QuestionQuestionEqualsToken,
        buildArrayMap(f.name, info.name)
      )
      const rawAccess = ts.factory.createPropertyAccessExpression(
        ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'raw'),
        f.name
      )

      body = f.required
        ? [ts.factory.createReturnStatement(memoAssign)]
        : [
            ts.factory.createReturnStatement(
              ts.factory.createConditionalExpression(
                rawAccess,
                undefined,
                ts.factory.createParenthesizedExpression(memoAssign),
                undefined,
                ts.factory.createIdentifier('undefined')
              )
            )
          ]
    } else if (!f.required) {
      body = [
        ts.factory.createIfStatement(
          ts.factory.createStrictEquality(
            ts.factory.createPropertyAccessExpression(ts.factory.createThis(), `_${camelName}`),
            ts.factory.createIdentifier('undefined')
          ),
          ts.factory.createBlock([
            ts.factory.createExpressionStatement(
              ts.factory.createAssignment(
                ts.factory.createPropertyAccessExpression(ts.factory.createThis(), `_${camelName}`),
                ts.factory.createConditionalExpression(
                  ts.factory.createPropertyAccessExpression(
                    ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'raw'),
                    f.name
                  ),
                  undefined,
                  ts.factory.createNewExpression(
                    ts.factory.createIdentifier(info.name),
                    undefined,
                    [ts.factory.createPropertyAccessExpression(
                      ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'raw'),
                      f.name
                    )]
                  ),
                  undefined,
                  ts.factory.createIdentifier('undefined')
                )
              )
            )
          ], true)
        ),
        ts.factory.createReturnStatement(
          ts.factory.createPropertyAccessExpression(ts.factory.createThis(), `_${camelName}`)
        )
      ]
    } else {
      body = [
        ts.factory.createReturnStatement(
          ts.factory.createBinaryExpression(
            ts.factory.createPropertyAccessExpression(ts.factory.createThis(), `_${camelName}`),
            ts.SyntaxKind.QuestionQuestionEqualsToken,
            ts.factory.createNewExpression(
              ts.factory.createIdentifier(info.name),
              undefined,
              [ts.factory.createPropertyAccessExpression(
                ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'raw'),
                f.name
              )]
            )
          )
        )
      ]
    }
  } else {
    body = [
      ts.factory.createReturnStatement(
        ts.factory.createPropertyAccessExpression(
          ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'raw'),
          f.name
        )
      )
    ]
  }

  const getter = ts.factory.createGetAccessorDeclaration(
    undefined,
    ts.factory.createIdentifier(camelName),
    [],
    returnType,
    ts.factory.createBlock(body, true)
  )

  return jsDoc(f.description, getter)
}

function emitAutoHasMethod (
  f: SchemaField,
  camelName: string,
  hasName: string,
  wrappedClassNames: Set<string>
) {
  const isArray = f.type.kind === 'array'

  const rawAccess = ts.factory.createPropertyAccessExpression(
    ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'raw'),
    f.name
  )

  const notNull = ts.factory.createBinaryExpression(
    rawAccess,
    ts.SyntaxKind.ExclamationEqualsToken,
    ts.factory.createNull()
  )

  const expression: ts.Expression = isArray
    ? ts.factory.createBinaryExpression(
      notNull,
      ts.SyntaxKind.AmpersandAmpersandToken,
      ts.factory.createBinaryExpression(
        ts.factory.createPropertyAccessExpression(rawAccess, 'length'),
        ts.SyntaxKind.GreaterThanToken,
        ts.factory.createNumericLiteral('0')
      )
    )
    : notNull

  // inline `this is this & { camelName: NonNullType }` instead of `Has<this, K>` —
  // chained `hasX() && hasY()` would otherwise nest `Has<Has<…, 'x'>, 'y'>` and re-do
  // `keyof T + T[K] + Exclude<…, undefined>` per layer. flat intersection = ~9× speedup
  const info = wrapperInfoFor(f.type, wrappedClassNames)
  const concreteFieldType = info
    ? wrapperReturnType(info, false)
    : typeRefToTs(f.type)

  const returnType = ts.factory.createTypePredicateNode(
    undefined,
    ts.factory.createThisTypeNode(),
    ts.factory.createIntersectionTypeNode([
      ts.factory.createThisTypeNode(),
      ts.factory.createTypeLiteralNode([
        ts.factory.createPropertySignature(
          undefined,
          ts.factory.createIdentifier(camelName),
          undefined,
          concreteFieldType
        )
      ])
    ])
  )

  const method = ts.factory.createMethodDeclaration(
    undefined, undefined,
    ts.factory.createIdentifier(hasName),
    undefined, undefined, [],
    returnType,
    ts.factory.createBlock([ts.factory.createReturnStatement(expression)], true)
  )

  const doc = isArray
    ? `true if \`${f.name}\` has at least one item`
    : `true if \`${f.name}\` is set`

  return jsDoc(doc, method)
}

function buildArrayMap (rawField: string, wrapperName: string) {
  return ts.factory.createCallExpression(
    ts.factory.createPropertyAccessExpression(
      ts.factory.createPropertyAccessExpression(
        ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'raw'),
        rawField
      ),
      'map'
    ),
    undefined,
    [ts.factory.createArrowFunction(
      undefined,
      undefined,
      [ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        ts.factory.createIdentifier('x'),
        undefined,
        undefined,
        undefined
      )],
      undefined,
      ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      ts.factory.createNewExpression(
        ts.factory.createIdentifier(wrapperName),
        undefined,
        [ts.factory.createIdentifier('x')]
      )
    )]
  )
}

// one type alias per literal-discriminator value: `PrivateChat = Omit<Chat, 'type'> & { type: 'private' }`.
// only multi-value enumerations qualify. `Omit` is required (not plain `Chat & { type: 'X' }`) —
// otherwise the class accessor signature stays and chained `chat.type` widens back to the literal union
function emitSubtypeAliases (obj: Extract<SchemaObject, { kind: 'object' }>) {
  const aliases: ts.Node[] = []

  for (const f of obj.fields) {
    if (f.type.kind !== 'string' || !f.type.enumeration || f.type.enumeration.length < 2) {
      continue
    }

    const camelName = camelCase(f.name)

    for (const value of f.type.enumeration) {
      const aliasName = `${literalToPascal(value)}${obj.name}`

      const omitNode = ts.factory.createTypeReferenceNode('Omit', [
        ts.factory.createTypeReferenceNode(obj.name),
        ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(camelName))
      ])

      const modNode = ts.factory.createTypeLiteralNode([
        ts.factory.createPropertySignature(
          undefined,
          ts.factory.createIdentifier(camelName),
          undefined,
          ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(value))
        )
      ])

      const aliasType = ts.factory.createIntersectionTypeNode([omitNode, modNode])

      aliases.push(ts.factory.createTypeAliasDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier(aliasName),
        undefined,
        aliasType
      ))
    }
  }

  return aliases
}

// 'private' → 'Private', 'bot_command' → 'BotCommand', 'text_link' → 'TextLink'
function literalToPascal (value: string) {
  return value
    .split(/[_-]/)
    .map(s => s[0]!.toUpperCase() + s.slice(1))
    .join('')
}

function emitInspectMethod (obj: Extract<SchemaObject, { kind: 'object' }>) {
  const anyType = ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
  const param = (name: string) => ts.factory.createParameterDeclaration(
    undefined, undefined, ts.factory.createIdentifier(name), undefined, anyType, undefined
  )

  return ts.factory.createMethodDeclaration(
    undefined,
    undefined,
    ts.factory.createComputedPropertyName(ts.factory.createIdentifier('INSPECT')),
    undefined,
    undefined,
    [param('depth'), param('options'), param('inspect')],
    undefined,
    ts.factory.createBlock([
      ts.factory.createReturnStatement(
        ts.factory.createCallExpression(
          ts.factory.createIdentifier('makeInspect'),
          undefined,
          [
            ts.factory.createStringLiteral(obj.name),
            ts.factory.createThis(),
            ts.factory.createIdentifier('depth'),
            ts.factory.createIdentifier('options'),
            ts.factory.createIdentifier('inspect')
          ]
        )
      )
    ], true)
  )
}
