import ts from 'typescript'

import type { Schema, SchemaField, SchemaObject, SchemaTypeRef } from '../schema-types'

import { camelCase, getterNameFor } from './field-names'
import { formatModule } from './format'
import { detectWidenedMethodArgs, isRichMessageRef } from './formattable-detect'
import { versionString } from './load-schema'
import { analyzeShortcuts, analyzeThreadShortcuts, type BoundShortcut } from './shortcut-analyzer'
import { METHOD_POSITIONALS } from './shortcuts-config'
import { ARRAY_WRAPPER_NAMES, arrayWrapperFor, hasWrapperClass, isWrappedStructure } from './structures-config'
import { jsDoc, importTypeNamed, importNamed, typeRefToTs } from './ts-factory'
import { buildUpdateKinds, shortcutNameFor, type UpdateExtra, type UpdateKindSpec } from './updates-config'

interface WrapperInfo {
  name: string
  isArray: boolean
}

export function verbFor (sc: BoundShortcut) {
  return sc.verbOverride ?? (sc.reply ? sc.reply.verb : shortcutNameFor(sc.method))
}

export function emitUpdates (schema: Schema) {
  const kinds = buildUpdateKinds(schema)
  const analysis = analyzeShortcuts(schema, kinds)
  const threadAnalysis = analyzeThreadShortcuts(schema, kinds)
  const objectsByName = new Map<string, SchemaObject>(schema.objects.map(o => [o.name, o]))
  const widenedArgs = detectWidenedMethodArgs(schema)

  // partition kinds by (payloadType, behavioral fingerprint). kinds in a partition of
  // size >= 2 share a generated base class (memo fields, getters, hasField(), extras,
  // shortcuts, is(), INSPECT) and emit as thin subclasses on top. singletons keep the
  // standalone emission path. this collapses the ~95k-line duplication where 38 message
  // -shape kinds each re-emit the full TelegramMessage getter set, dropping tsc heap from
  // ~1.8 GB to ~0.3 GB on cold `import { Telegram } from 'puregram'`
  const baseKeyByKind = new Map<string, string>()
  const groupedByBase = new Map<string, UpdateKindSpec[]>()

  {
    const byPayloadAndFingerprint = new Map<string, Map<string, UpdateKindSpec[]>>()

    for (const k of kinds) {
      const fingerprint = behaviorFingerprint(k, analysis.byKind[k.kindName] ?? [])
      let inner = byPayloadAndFingerprint.get(k.payloadType)

      if (!inner) {
        inner = new Map()
        byPayloadAndFingerprint.set(k.payloadType, inner)
      }

      const arr = inner.get(fingerprint) ?? []

      arr.push(k)
      inner.set(fingerprint, arr)
    }

    for (const [payloadType, inner] of byPayloadAndFingerprint) {
      // shared cohorts only (size >= 2); singletons keep standalone emission
      const sharedFingerprints = [...inner.keys()].filter(fp => (inner.get(fp)?.length ?? 0) >= 2)

      for (const fingerprint of sharedFingerprints) {
        const group = inner.get(fingerprint) ?? []
        // suffix only when one payloadType produces multiple shared cohorts (rare)
        const baseName = sharedFingerprints.length === 1
          ? sharedBaseName(payloadType)
          : `${sharedBaseName(payloadType)}${sharedFingerprints.indexOf(fingerprint) + 1}`

        groupedByBase.set(baseName, group)

        for (const k of group) {
          baseKeyByKind.set(k.kindName, baseName)
        }
      }
    }
  }

  const nodes: ts.Node[] = []
  const emittedBases = new Set<string>()

  // one thread companion per payload type that carries message_thread_id (just TelegramMessage
  // today). all message-shape kinds share the same thread surface, so one class backs them all
  const threadCompanionByPayload = new Map<string, string>()

  for (const kind of kinds) {
    const list = threadAnalysis.byKind[kind.kindName] ?? []

    if (list.length === 0 || threadCompanionByPayload.has(kind.payloadType)) {
      continue
    }

    const companionName = `${kind.payloadType.replace(/^Telegram/, '')}ThreadShortcuts`

    threadCompanionByPayload.set(kind.payloadType, companionName)
    nodes.push(emitThreadCompanion(companionName, kind.payloadType, list, widenedArgs))
  }

  for (const kind of kinds) {
    const baseName = baseKeyByKind.get(kind.kindName)

    if (baseName === undefined) {
      nodes.push(emitUpdateClass(
        kind,
        objectsByName,
        analysis.byKind[kind.kindName] ?? [],
        widenedArgs,
        threadCompanionByPayload.get(kind.payloadType)
      ))
      continue
    }

    if (!emittedBases.has(baseName)) {
      emittedBases.add(baseName)

      const group = groupedByBase.get(baseName) ?? []
      const head = group[0] ?? kind

      nodes.push(emitSharedBase(
        baseName,
        head,
        objectsByName,
        analysis.byKind[head.kindName] ?? [],
        widenedArgs,
        threadCompanionByPayload.get(head.payloadType)
      ))
    }

    nodes.push(emitVariantSubclass(kind, baseName))
  }

  nodes.push(emitUpdateKindUnion())
  nodes.push(emitUpdateKindMap(kinds))
  nodes.push(emitUpdateUnion(kinds))
  nodes.push(emitUpdateKindsConst(kinds))
  nodes.push(emitUpdateClassesConst(kinds))

  const referencedTypes = new Set<string>()

  for (const k of kinds) {
    referencedTypes.add(k.payloadType)
  }

  // sweep only non-wrapped fields into the import set — wrapped fields go through `./structures`,
  // adding them here would just produce unused imports
  for (const k of kinds) {
    const obj = objectsByName.get(k.payloadType.replace(/^Telegram/, ''))

    if (obj?.kind === 'object') {
      for (const f of obj.fields) {
        if (refToObjectClassName(f.type, objectsByName) !== undefined) {
          continue
        }

        collectReferencedTypeNames(f.type, referencedTypes, name => `Telegram${name}`)
      }
    }
  }

  // shortcut signatures inline both positional args AND the params object shape, so every
  // referenced Telegram* (across all userArgs) needs an import too. previously the params
  // type was `Omit<XxxParams, …>` which pulled imports transitively via XxxParams; now
  // that we inline literals we collect them explicitly
  for (const list of Object.values(analysis.byKind)) {
    for (const sc of list) {
      for (const arg of sc.userArgs) {
        collectReferencedTypeNames(arg.type, referencedTypes, name => `Telegram${name}`)
      }
    }
  }

  // keep only names emit-structures actually emits a class for — wrapped objects and the
  // designated union wrappers (ChatMember); plain unions (MessageOrigin, …) get no class
  const wrappedNames = new Set<string>()

  for (const k of kinds) {
    const obj = objectsByName.get(k.payloadType.replace(/^Telegram/, ''))

    if (obj?.kind === 'object') {
      for (const f of obj.fields) {
        collectWrapperNames(f.type, wrappedNames)
      }
    }
  }

  for (const name of [...wrappedNames]) {
    if (!hasWrapperClass(name, objectsByName.get(name)?.kind)) {
      wrappedNames.delete(name)
    }
  }

  const usesHas = kinds.some((k) => {
    if (k.extras?.some(e => e.returnType.includes('Has<'))) {
      return true
    }

    const obj = objectsByName.get(k.payloadType.replace(/^Telegram/, ''))

    if (obj?.kind !== 'object') {
      return false
    }

    return obj.fields.some(f => !f.required && !/^(has|is)[A-Z]/.test(getterNameFor(f.name)))
  })
  // shortcuts now inline their params type, so `Formattable` is needed iff any inlined
  // arg references it (i.e. the method has a widened arg AND that arg is among `userArgs`)
  const usesFormattable = Object.entries(analysis.byKind).some(([, list]) => list.some((sc) => {
    const widened = widenedArgs.get(sc.method)

    if (!widened || widened.size === 0) {
      return false
    }

    return sc.userArgs.some(a => widened.has(a.name))
  }))

  // RichLike is referenced by any inlined rich_message arg (sendRich) and by the editRich extra
  const usesRichLike = Object.entries(analysis.byKind).some(([, list]) =>
    list.some(sc => sc.userArgs.some(a => isRichMessageRef(a.type))))

  // ephemeral helpers back the send-injection / twin-routing / callback opt-in shortcut flags
  const usesEphemeral = Object.values(analysis.byKind).some(list =>
    list.some(sc => sc.ephemeralSend === true || sc.ephemeralTwin !== undefined || sc.callbackEphemeral === true))

  const usedArrayWrappers = collectUsedArrayWrappers(kinds, objectsByName)

  // extras reference schema-derived `<Method>Params` types (plus a few fixed helpers) by
  // bare name — hoist type-only imports for whatever the final extras set mentions
  const extrasText = kinds
    .flatMap(k => k.extras ?? [])
    .map(e => [
      e.returnType,
      'params' in e ? e.params ?? '' : '',
      'typeParams' in e ? e.typeParams ?? '' : '',
      'expression' in e ? e.expression : e.body
    ].join(' '))
    .join('\n')

  const methodParamNames = new Set(schema.methods.map(m => m.name.charAt(0).toUpperCase() + m.name.slice(1) + 'Params'))
  const usedMethodParams = new Set<string>()

  for (const match of extrasText.matchAll(/\b[A-Z][A-Za-z0-9]*Params\b/g)) {
    if (methodParamNames.has(match[0])) {
      usedMethodParams.add(match[0])
    }
  }

  const telegramLikeNames = ['ActionControllerLike', 'ActionControllerParams', 'TelegramLike']
    .filter(n => n === 'TelegramLike' || new RegExp(`\\b${n}\\b`).test(extrasText))

  const imports = [
    ...(/\bReadable\b/.test(extrasText) ? [importTypeNamed(['Readable'], 'node:stream')] : []),
    importTypeNamed([...referencedTypes].sort(), './types'),
    ...(usedMethodParams.size > 0 ? [importTypeNamed([...usedMethodParams].sort(), './methods')] : []),
    importTypeNamed(telegramLikeNames, '../telegram-like'),
    ...(usesHas ? [importTypeNamed(['Has'], '../util-types')] : []),
    ...(usesFormattable ? [importTypeNamed(['Formattable'], '../formattable')] : []),
    ...(usesRichLike ? [importTypeNamed(['RichLike'], '../rich-like')] : []),
    ...(wrappedNames.size > 0 ? [importNamed([...wrappedNames].sort(), './structures')] : []),
    ...(usedArrayWrappers.length > 0
      ? [importNamed(usedArrayWrappers, '../structures-handcrafted')]
      : []),
    ...(usesEphemeral ? [importNamed(['callbackEphemeralParams', 'ephemeralSendParams', 'ephemeralTarget'], '../ephemeral')] : []),
    importNamed(['INSPECT', 'makeInspect'], './inspect')
  ]

  return formatModule({
    nodes,
    imports,
    botApiVersion: versionString(schema),
    sourceUrl: schema.source.core,
    generatedAt: schema.source.fetchedAt
  })
}

function collectReferencedTypeNames (
  ref: SchemaTypeRef,
  into: Set<string>,
  format: (name: string) => string
): void {
  if (ref.kind === 'reference') {
    into.add(format(ref.name))
  } else if (ref.kind === 'array') {
    collectReferencedTypeNames(ref.of, into, format)
  } else if (ref.kind === 'union') {
    ref.of.forEach(t => collectReferencedTypeNames(t, into, format))
  }
}

function collectWrapperNames (ref: SchemaTypeRef, into: Set<string>): void {
  if (ref.kind === 'reference' && isWrappedStructure(ref.name)) {
    into.add(ref.name)
  } else if (ref.kind === 'array') {
    collectWrapperNames(ref.of, into)
  } else if (ref.kind === 'union') {
    ref.of.forEach(t => collectWrapperNames(t, into))
  }
}

function isWrappedObjectClass (objectsByName: Map<string, SchemaObject>, name: string) {
  return hasWrapperClass(name, objectsByName.get(name)?.kind)
}

function refToObjectClassName (ref: SchemaTypeRef, objectsByName: Map<string, SchemaObject>) {
  if (ref.kind === 'reference' && isWrappedObjectClass(objectsByName, ref.name)) {
    return ref.name
  }

  if (ref.kind === 'array' && ref.of.kind === 'reference' && isWrappedObjectClass(objectsByName, ref.of.name)) {
    return ref.of.name
  }

  return undefined
}

// field type → wrapper-class output shape. handles synthetic collection wrappers
// (PhotoSize[] → Photo, PhotoSize[][] → Photo[]); undefined for primitives and unwrapped refs
function wrapperInfoFor (
  ref: SchemaTypeRef,
  objectsByName: Map<string, SchemaObject>
) {
  const directSynth = arrayWrapperFor(ref)

  if (directSynth) {
    return { name: directSynth, isArray: false }
  }

  if (ref.kind === 'array') {
    const innerSynth = arrayWrapperFor(ref.of)

    if (innerSynth) {
      return { name: innerSynth, isArray: true }
    }
  }

  if (ref.kind === 'reference' && isWrappedObjectClass(objectsByName, ref.name)) {
    return { name: ref.name, isArray: false }
  }

  if (ref.kind === 'array' && ref.of.kind === 'reference' && isWrappedObjectClass(objectsByName, ref.of.name)) {
    return { name: ref.of.name, isArray: true }
  }

  return undefined
}

function collectUsedArrayWrappers (
  kinds: UpdateKindSpec[],
  objectsByName: Map<string, SchemaObject>
) {
  const used = new Set<string>()

  for (const k of kinds) {
    const obj = objectsByName.get(k.payloadType.replace(/^Telegram/, ''))

    if (obj?.kind !== 'object') {
      continue
    }

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

function sharedBaseName (payloadType: string) {
  return `${payloadType.replace(/^Telegram/, '')}Shared`
}

// kinds that share a (payloadType, fingerprint) pair can share a generated base class
// without behavior divergence. fingerprint covers anchors (drive shortcut binding),
// extras (hand-curated members), and bound shortcuts (what tg.api.* shortcuts the kind
// exposes). guest_message has its own anchor (`guest_query_id`) so it falls out of the
// 37-kind message cohort automatically and emits standalone
function behaviorFingerprint (kind: UpdateKindSpec, shortcuts: BoundShortcut[]) {
  return JSON.stringify([kind.anchors, kind.extras ?? [], shortcuts])
}

// payload-driven members (memo fields, getters, hasField()) — identical across every
// kind that shares the same payload type. extracted so emitUpdateClass (standalone) and
// emitSharedBase (multi-kind base) build them the same way
function buildPayloadMembers (
  payloadObject: SchemaObject | undefined,
  reservedNames: Set<string>,
  extrasNames: Set<string>,
  objectsByName: Map<string, SchemaObject>,
  threadCompanion?: string
) {
  const members: ts.ClassElement[] = []

  if (payloadObject?.kind === 'object') {
    for (const f of payloadObject.fields) {
      const info = wrapperInfoFor(f.type, objectsByName)

      if (info) {
        const memoType: ts.TypeNode = info.isArray
          ? ts.factory.createArrayTypeNode(ts.factory.createTypeReferenceNode(info.name))
          : ts.factory.createTypeReferenceNode(info.name)

        members.push(ts.factory.createPropertyDeclaration(
          [ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword)],
          ts.factory.createIdentifier(`_${camelCase(f.name)}`),
          ts.factory.createToken(ts.SyntaxKind.QuestionToken),
          memoType,
          undefined
        ))
      }
    }
  }

  return {
    memoMembers: members,
    getterMembers: buildGetterMembers(payloadObject, reservedNames, objectsByName),
    hasMembers: buildAutoHasMembers(payloadObject, reservedNames, extrasNames, objectsByName, threadCompanion)
  }
}

function buildGetterMembers (
  payloadObject: SchemaObject | undefined,
  reservedNames: Set<string>,
  objectsByName: Map<string, SchemaObject>
) {
  const members: ts.ClassElement[] = []

  if (payloadObject?.kind !== 'object') {
    return members
  }

  for (const f of payloadObject.fields) {
    const camelName = getterNameFor(f.name)

    if (reservedNames.has(camelName)) {
      continue
    }

    reservedNames.add(camelName)

    const info = wrapperInfoFor(f.type, objectsByName)

    if (info) {
      members.push(emitWrapperGetter(f, camelName, info))
    } else {
      members.push(emitPrimitiveGetter(f, camelName))
    }
  }

  return members
}

function buildAutoHasMembers (
  payloadObject: SchemaObject | undefined,
  reservedNames: Set<string>,
  extrasNames: Set<string>,
  objectsByName: Map<string, SchemaObject>,
  threadCompanion?: string
) {
  const members: ts.ClassElement[] = []

  if (payloadObject?.kind !== 'object') {
    return members
  }

  for (const f of payloadObject.fields) {
    if (f.required) {
      continue
    }

    const camelName = getterNameFor(f.name)

    if (/^(has|is)[A-Z]/.test(camelName)) {
      continue
    }

    const hasName = `has${camelName[0]!.toUpperCase()}${camelName.slice(1)}`

    if (reservedNames.has(hasName) || extrasNames.has(hasName)) {
      continue
    }

    reservedNames.add(hasName)
    members.push(emitAutoHasMethod(f, camelName, hasName, objectsByName, threadCompanion))
  }

  return members
}

function emitConstructor (payloadType: string) {
  // `tg` stays `public readonly` so handler code can call `this.tg.api.*`. nominal class
  // brand comes from the private memo fields (`_from`, `_chat`, …) declared on the owning
  // class; when those move to a shared base, each subclass adds its own `private __brand!`
  // marker to keep `AnyUpdate & X` narrowing fast (see emitVariantSubclass)
  return ts.factory.createConstructorDeclaration(
    undefined,
    [
      ts.factory.createParameterDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.PublicKeyword)],
        undefined,
        ts.factory.createIdentifier('raw'),
        undefined,
        ts.factory.createTypeReferenceNode(payloadType),
        undefined
      ),
      ts.factory.createParameterDeclaration(
        [
          ts.factory.createModifier(ts.SyntaxKind.PublicKeyword),
          ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)
        ],
        undefined,
        ts.factory.createIdentifier('tg'),
        undefined,
        ts.factory.createTypeReferenceNode('TelegramLike'),
        undefined
      )
    ],
    ts.factory.createBlock([], false)
  )
}

function emitIsMethod () {
  return ts.factory.createMethodDeclaration(
    undefined,
    undefined,
    ts.factory.createIdentifier('is'),
    undefined,
    [ts.factory.createTypeParameterDeclaration(
      undefined,
      ts.factory.createIdentifier('K'),
      ts.factory.createTypeReferenceNode('UpdateKind')
    )],
    [ts.factory.createParameterDeclaration(
      undefined, undefined,
      ts.factory.createIdentifier('kind'),
      undefined,
      ts.factory.createTypeReferenceNode('K'),
      undefined
    )],
    ts.factory.createTypePredicateNode(
      undefined,
      ts.factory.createThisTypeNode(),
      ts.factory.createIndexedAccessTypeNode(
        ts.factory.createTypeReferenceNode('UpdateKindMap'),
        ts.factory.createTypeReferenceNode('K')
      )
    ),
    ts.factory.createBlock([
      ts.factory.createReturnStatement(
        ts.factory.createBinaryExpression(
          ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'kind'),
          ts.SyntaxKind.EqualsEqualsEqualsToken,
          ts.factory.createAsExpression(
            ts.factory.createIdentifier('kind'),
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
          )
        )
      )
    ], true)
  )
}

function emitInspectMethod (classNameExpr: ts.Expression) {
  const anyType = ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
  const inspectParam = (name: string) => ts.factory.createParameterDeclaration(
    undefined, undefined, ts.factory.createIdentifier(name), undefined, anyType, undefined
  )

  return ts.factory.createMethodDeclaration(
    undefined, undefined,
    ts.factory.createComputedPropertyName(ts.factory.createIdentifier('INSPECT')),
    undefined, undefined,
    [inspectParam('depth'), inspectParam('options'), inspectParam('inspect')],
    undefined,
    ts.factory.createBlock([
      ts.factory.createReturnStatement(
        ts.factory.createCallExpression(
          ts.factory.createIdentifier('makeInspect'),
          undefined,
          [
            classNameExpr,
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

function emitSharedBase (
  baseName: string,
  kind: UpdateKindSpec,
  objectsByName: Map<string, SchemaObject>,
  shortcuts: BoundShortcut[],
  widenedArgs: Map<string, Set<string>>,
  threadCompanion?: string
) {
  const members: ts.ClassElement[] = []

  // `declare readonly kind: string` — type-only stub; concrete literal lives on each subclass.
  // base never gets instantiated directly so the abstract-ish declaration is safe
  members.push(ts.factory.createPropertyDeclaration(
    [
      ts.factory.createModifier(ts.SyntaxKind.DeclareKeyword),
      ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)
    ],
    ts.factory.createIdentifier('kind'),
    undefined,
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    undefined
  ))

  const payloadObjectName = kind.payloadType.replace(/^Telegram/, '')
  const payloadObject = objectsByName.get(payloadObjectName)

  const reservedNames = new Set<string>(['kind', 'raw', 'tg', 'is'])

  for (const sc of shortcuts) {
    reservedNames.add(verbFor(sc))
  }

  if (threadCompanion) {
    reservedNames.add('thread')
  }

  const extrasNames = new Set((kind.extras ?? []).map(e => e.name))

  const { memoMembers, getterMembers, hasMembers } = buildPayloadMembers(
    payloadObject,
    reservedNames,
    extrasNames,
    objectsByName,
    threadCompanion
  )

  members.push(...memoMembers)
  members.push(emitConstructor(kind.payloadType))
  members.push(...getterMembers)
  members.push(...hasMembers)

  for (const extra of kind.extras ?? []) {
    if (reservedNames.has(extra.name)) {
      throw new Error(`extras collision: ${baseName}.${extra.name} clashes with a generated member`)
    }

    reservedNames.add(extra.name)
    members.push(emitExtra(extra))
  }

  members.push(emitIsMethod())

  for (const sc of shortcuts) {
    members.push(emitShortcutMethod(sc, widenedArgs))
  }

  if (threadCompanion) {
    members.push(emitThreadGetter(threadCompanion))
  }

  // base uses `this.constructor.name` so each subclass prints its own name in node's
  // util.inspect output without needing to override [INSPECT]
  members.push(emitInspectMethod(
    ts.factory.createPropertyAccessExpression(
      ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'constructor'),
      'name'
    )
  ))

  return jsDoc(
    `shared base for every update built from \`${kind.payloadType}\` — implementation detail, not exported`,
    ts.factory.createClassDeclaration(
      undefined,
      ts.factory.createIdentifier(baseName),
      undefined,
      undefined,
      members
    )
  )
}

function emitVariantSubclass (kind: UpdateKindSpec, baseName: string) {
  const members: ts.ClassElement[] = []

  members.push(ts.factory.createPropertyDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
    ts.factory.createIdentifier('kind'),
    undefined,
    undefined,
    ts.factory.createAsExpression(
      ts.factory.createStringLiteral(kind.kindName),
      ts.factory.createTypeReferenceNode('const')
    )
  ))

  // per-subclass private brand so `AnyUpdate & PinnedMessageUpdate`-style intersections
  // short-circuit on incompatibility rather than distributing structurally across the union
  // (sibling subclasses inherit the same base memo fields, so they'd otherwise be
  // structurally indistinguishable except by the `kind` literal)
  members.push(ts.factory.createPropertyDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword)],
    ts.factory.createIdentifier('__brand'),
    ts.factory.createToken(ts.SyntaxKind.ExclamationToken),
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword),
    undefined
  ))

  return jsDoc(
    `update for the \`${kind.kindName}\` event`,
    ts.factory.createClassDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(kind.className),
      undefined,
      [ts.factory.createHeritageClause(
        ts.SyntaxKind.ExtendsKeyword,
        [ts.factory.createExpressionWithTypeArguments(
          ts.factory.createIdentifier(baseName),
          undefined
        )]
      )],
      members
    )
  )
}

function emitUpdateClass (
  kind: UpdateKindSpec,
  objectsByName: Map<string, SchemaObject>,
  shortcuts: BoundShortcut[],
  widenedArgs: Map<string, Set<string>>,
  threadCompanion?: string
) {
  const members: ts.ClassElement[] = []

  members.push(ts.factory.createPropertyDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
    ts.factory.createIdentifier('kind'),
    undefined,
    undefined,
    ts.factory.createAsExpression(
      ts.factory.createStringLiteral(kind.kindName),
      ts.factory.createTypeReferenceNode('const')
    )
  ))

  const payloadObjectName = kind.payloadType.replace(/^Telegram/, '')
  const payloadObject = objectsByName.get(payloadObjectName)

  if (payloadObject?.kind === 'object') {
    for (const f of payloadObject.fields) {
      const info = wrapperInfoFor(f.type, objectsByName)

      if (info) {
        const memoType: ts.TypeNode = info.isArray
          ? ts.factory.createArrayTypeNode(ts.factory.createTypeReferenceNode(info.name))
          : ts.factory.createTypeReferenceNode(info.name)

        members.push(ts.factory.createPropertyDeclaration(
          [ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword)],
          ts.factory.createIdentifier(`_${camelCase(f.name)}`),
          ts.factory.createToken(ts.SyntaxKind.QuestionToken),
          memoType,
          undefined
        ))
      }
    }
  }

  // `tg` stays `private` so each update class carries a TS class brand. without it,
  // `AnyUpdate & MessageUpdate` structurally distributes across all 50 union members
  // and `update.is('message')` blows up LSP (measured ~9s on one deferred check).
  // tradeoff: `Modify<…>` drops the brand (Omit can't see private fields), so a modded
  // handler arg passed into a function wanting the raw class needs an `AnyUpdate` cast
  members.push(ts.factory.createConstructorDeclaration(
    undefined,
    [
      ts.factory.createParameterDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.PublicKeyword)],
        undefined,
        ts.factory.createIdentifier('raw'),
        undefined,
        ts.factory.createTypeReferenceNode(kind.payloadType),
        undefined
      ),
      ts.factory.createParameterDeclaration(
        [
          ts.factory.createModifier(ts.SyntaxKind.PublicKeyword),
          ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)
        ],
        undefined,
        ts.factory.createIdentifier('tg'),
        undefined,
        ts.factory.createTypeReferenceNode('TelegramLike'),
        undefined
      )
    ],
    ts.factory.createBlock([], false)
  ))

  // names already taken — suppresses schema-driven getters that would collide
  const reservedNames = new Set<string>(['kind', 'raw', 'tg', 'is'])

  for (const sc of shortcuts) {
    reservedNames.add(verbFor(sc))
  }

  if (threadCompanion) {
    reservedNames.add('thread')
  }

  // extras win over auto-emitted has*() — pre-compute names for the skip check below
  const extrasNames = new Set((kind.extras ?? []).map(e => e.name))

  if (payloadObject?.kind === 'object') {
    for (const f of payloadObject.fields) {
      const camelName = getterNameFor(f.name)

      if (reservedNames.has(camelName)) {
        continue
      }

      reservedNames.add(camelName)

      const info = wrapperInfoFor(f.type, objectsByName)

      if (info) {
        members.push(emitWrapperGetter(f, camelName, info))
      } else {
        members.push(emitPrimitiveGetter(f, camelName))
      }
    }
  }

  // hasField() for every optional payload field; skip has_*/is_* — flag-style true|undefined narrows on its own
  if (payloadObject?.kind === 'object') {
    for (const f of payloadObject.fields) {
      if (f.required) {
        continue
      }

      const camelName = getterNameFor(f.name)

      if (/^(has|is)[A-Z]/.test(camelName)) {
        continue
      }

      const hasName = `has${camelName[0]!.toUpperCase()}${camelName.slice(1)}`

      if (reservedNames.has(hasName) || extrasNames.has(hasName)) {
        continue
      }

      reservedNames.add(hasName)
      members.push(emitAutoHasMethod(f, camelName, hasName, objectsByName, threadCompanion))
    }
  }

  // hand-curated helpers from updates-config (`chatId`, `senderId`, `isReply()`).
  // emitted last; a clash with a generated member aborts codegen so the conflict
  // surfaces at emit time instead of silently shadowing either side
  for (const extra of kind.extras ?? []) {
    if (reservedNames.has(extra.name)) {
      throw new Error(`extras collision: ${kind.className}.${extra.name} clashes with a generated member`)
    }

    reservedNames.add(extra.name)
    members.push(emitExtra(extra))
  }

  members.push(ts.factory.createMethodDeclaration(
    undefined,
    undefined,
    ts.factory.createIdentifier('is'),
    undefined,
    [ts.factory.createTypeParameterDeclaration(
      undefined,
      ts.factory.createIdentifier('K'),
      ts.factory.createTypeReferenceNode('UpdateKind')
    )],
    [ts.factory.createParameterDeclaration(
      undefined, undefined,
      ts.factory.createIdentifier('kind'),
      undefined,
      ts.factory.createTypeReferenceNode('K'),
      undefined
    )],
    ts.factory.createTypePredicateNode(
      undefined,
      ts.factory.createThisTypeNode(),
      ts.factory.createIndexedAccessTypeNode(
        ts.factory.createTypeReferenceNode('UpdateKindMap'),
        ts.factory.createTypeReferenceNode('K')
      )
    ),
    ts.factory.createBlock([
      ts.factory.createReturnStatement(
        ts.factory.createBinaryExpression(
          ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'kind'),
          ts.SyntaxKind.EqualsEqualsEqualsToken,
          ts.factory.createAsExpression(
            ts.factory.createIdentifier('kind'),
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
          )
        )
      )
    ], true)
  ))

  for (const sc of shortcuts) {
    members.push(emitShortcutMethod(sc, widenedArgs))
  }

  if (threadCompanion) {
    members.push(emitThreadGetter(threadCompanion))
  }

  const anyType = ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
  const inspectParam = (name: string) => ts.factory.createParameterDeclaration(
    undefined, undefined, ts.factory.createIdentifier(name), undefined, anyType, undefined
  )

  members.push(ts.factory.createMethodDeclaration(
    undefined, undefined,
    ts.factory.createComputedPropertyName(ts.factory.createIdentifier('INSPECT')),
    undefined, undefined,
    [inspectParam('depth'), inspectParam('options'), inspectParam('inspect')],
    undefined,
    ts.factory.createBlock([
      ts.factory.createReturnStatement(
        ts.factory.createCallExpression(
          ts.factory.createIdentifier('makeInspect'),
          undefined,
          [
            ts.factory.createStringLiteral(kind.className),
            ts.factory.createThis(),
            ts.factory.createIdentifier('depth'),
            ts.factory.createIdentifier('options'),
            ts.factory.createIdentifier('inspect')
          ]
        )
      )
    ], true)
  ))

  return jsDoc(
    `update for the \`${kind.kindName}\` event`,
    ts.factory.createClassDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(kind.className),
      undefined,
      undefined,
      members
    )
  )
}

function parseTypeNode (src: string) {
  const file = ts.createSourceFile('extra.ts', `let _: ${src}`, ts.ScriptTarget.ES2022, false, ts.ScriptKind.TS)
  const stmt = file.statements[0] as ts.VariableStatement
  const type = stmt.declarationList.declarations[0]!.type

  if (!type) {
    throw new Error(`failed to parse extras returnType: ${src}`)
  }

  return type
}

function parseStatements (src: string) {
  const file = ts.createSourceFile('extra.ts', `(()=>{${src}})()`, ts.ScriptTarget.ES2022, false, ts.ScriptKind.TS)
  const stmt = file.statements[0] as ts.ExpressionStatement
  const callee = (stmt.expression as ts.CallExpression).expression as ts.ParenthesizedExpression
  const fn = callee.expression as ts.ArrowFunction

  if (!ts.isBlock(fn.body)) {
    throw new Error(`failed to parse extras body: ${src}`)
  }

  return [...fn.body.statements]
}

function parseExpression (src: string) {
  const file = ts.createSourceFile('extra.ts', `(${src})`, ts.ScriptTarget.ES2022, false, ts.ScriptKind.TS)
  const stmt = file.statements[0]

  if (!stmt || !ts.isExpressionStatement(stmt) || !ts.isParenthesizedExpression(stmt.expression)) {
    throw new Error(`failed to parse extras expression: ${src}`)
  }

  return stmt.expression.expression
}

function emitExtra (extra: UpdateExtra) {
  const returnType = parseTypeNode(extra.returnType)
  const doc = extra.jsdoc

  if (extra.kind === 'getter') {
    const body = 'expression' in extra
      ? ts.factory.createBlock([ts.factory.createReturnStatement(parseExpression(extra.expression))], true)
      : ts.factory.createBlock(parseStatements(extra.body), true)
    const node = ts.factory.createGetAccessorDeclaration(
      undefined,
      ts.factory.createIdentifier(extra.name),
      [],
      returnType,
      body
    )

    return doc ? jsDoc(doc, node) : node
  }

  const body = ts.factory.createBlock(parseStatements(extra.body), true)
  const params = extra.params ? parseParams(extra.params) : []
  const typeParameters = extra.typeParams ? parseTypeParams(extra.typeParams) : undefined
  const node = ts.factory.createMethodDeclaration(
    undefined, undefined,
    ts.factory.createIdentifier(extra.name),
    undefined, typeParameters, params,
    returnType,
    body
  )

  return doc ? jsDoc(doc, node) : node
}

function parseTypeParams (src: string) {
  const file = ts.createSourceFile('extra.ts', `function _${src}() {}`, ts.ScriptTarget.ES2022, false, ts.ScriptKind.TS)
  const stmt = file.statements[0] as ts.FunctionDeclaration

  if (!stmt || !ts.isFunctionDeclaration(stmt) || !stmt.typeParameters) {
    throw new Error(`failed to parse extras typeParams: ${src}`)
  }

  return stmt.typeParameters.map(tp => ts.factory.createTypeParameterDeclaration(
    tp.modifiers, tp.name, tp.constraint, tp.default
  ))
}

function parseParams (src: string) {
  const file = ts.createSourceFile('extra.ts', `function _(${src}) {}`, ts.ScriptTarget.ES2022, false, ts.ScriptKind.TS)
  const stmt = file.statements[0] as ts.FunctionDeclaration

  if (!stmt || !ts.isFunctionDeclaration(stmt)) {
    throw new Error(`failed to parse extras params: ${src}`)
  }

  return stmt.parameters.map(p => ts.factory.createParameterDeclaration(
    undefined, undefined, p.name, p.questionToken, p.type, p.initializer
  ))
}

function buildWrapperReturnType (info: WrapperInfo, optional: boolean) {
  const baseReturn: ts.TypeNode = info.isArray
    ? ts.factory.createArrayTypeNode(ts.factory.createTypeReferenceNode(info.name))
    : ts.factory.createTypeReferenceNode(info.name)

  return optional
    ? ts.factory.createUnionTypeNode([
      baseReturn,
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword)
    ])
    : baseReturn
}

function emitAutoHasMethod (
  f: SchemaField,
  camelName: string,
  hasName: string,
  objectsByName: Map<string, SchemaObject>,
  threadCompanion?: string
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
  const info = wrapperInfoFor(f.type, objectsByName)
  const concreteFieldType = info
    ? buildWrapperReturnType(info, false)
    : typeRefToTs(f.type)

  const predicateProps = [
    ts.factory.createPropertySignature(
      undefined,
      ts.factory.createIdentifier(camelName),
      undefined,
      concreteFieldType
    )
  ]

  if (threadCompanion && f.name === 'message_thread_id') {
    predicateProps.push(ts.factory.createPropertySignature(
      undefined,
      ts.factory.createIdentifier('thread'),
      undefined,
      ts.factory.createTypeReferenceNode(threadCompanion)
    ))
  }

  const returnType = ts.factory.createTypePredicateNode(
    undefined,
    ts.factory.createThisTypeNode(),
    ts.factory.createIntersectionTypeNode([
      ts.factory.createThisTypeNode(),
      ts.factory.createTypeLiteralNode(predicateProps)
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

function emitWrapperGetter (f: SchemaField, camelName: string, info: WrapperInfo) {
  const baseReturn: ts.TypeNode = info.isArray
    ? ts.factory.createArrayTypeNode(ts.factory.createTypeReferenceNode(info.name))
    : ts.factory.createTypeReferenceNode(info.name)

  const returnType: ts.TypeNode = f.required
    ? baseReturn
    : ts.factory.createUnionTypeNode([
      baseReturn,
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword)
    ])

  const rawAccess = ts.factory.createPropertyAccessExpression(
    ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'raw'),
    f.name
  )

  const wrapExpr: ts.Expression = info.isArray
    ? ts.factory.createCallExpression(
      ts.factory.createPropertyAccessExpression(rawAccess, 'map'),
      undefined,
      [ts.factory.createArrowFunction(
        undefined, undefined,
        [ts.factory.createParameterDeclaration(
          undefined, undefined,
          ts.factory.createIdentifier('x'),
          undefined, undefined, undefined
        )],
        undefined,
        ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        ts.factory.createNewExpression(
          ts.factory.createIdentifier(info.name),
          undefined,
          [ts.factory.createIdentifier('x')]
        )
      )]
    )
    : ts.factory.createNewExpression(
      ts.factory.createIdentifier(info.name),
      undefined,
      [rawAccess]
    )

  const memoAssign = ts.factory.createBinaryExpression(
    ts.factory.createPropertyAccessExpression(ts.factory.createThis(), `_${camelName}`),
    ts.SyntaxKind.QuestionQuestionEqualsToken,
    wrapExpr
  )

  const body: ts.Statement[] = f.required
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

  return jsDoc(f.description, ts.factory.createGetAccessorDeclaration(
    undefined,
    ts.factory.createIdentifier(camelName),
    [],
    returnType,
    ts.factory.createBlock(body, true)
  ))
}

function emitPrimitiveGetter (f: SchemaField, camelName: string) {
  const baseReturn = typeRefToTs(f.type)
  const returnType: ts.TypeNode = f.required
    ? baseReturn
    : ts.factory.createUnionTypeNode([
      baseReturn,
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword)
    ])

  const rawAccess = ts.factory.createPropertyAccessExpression(
    ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'raw'),
    f.name
  )

  return jsDoc(f.description, ts.factory.createGetAccessorDeclaration(
    undefined,
    ts.factory.createIdentifier(camelName),
    [],
    returnType,
    ts.factory.createBlock([ts.factory.createReturnStatement(rawAccess)], true)
  ))
}

function emitShortcutMethod (sc: BoundShortcut, widenedArgs: Map<string, Set<string>>) {
  const filledProps = sc.filledArgs.map((anchor) => {
    const buildAccess = () => {
      let access: ts.Expression = ts.factory.createThis()

      for (const part of anchor.accessPath) {
        access = ts.factory.createPropertyAccessExpression(access, part)
      }

      return access
    }

    if (anchor.optional) {
      return ts.factory.createSpreadAssignment(
        ts.factory.createParenthesizedExpression(
          ts.factory.createBinaryExpression(
            ts.factory.createBinaryExpression(
              buildAccess(),
              ts.SyntaxKind.ExclamationEqualsToken,
              ts.factory.createNull()
            ),
            ts.SyntaxKind.AmpersandAmpersandToken,
            ts.factory.createObjectLiteralExpression(
              [ts.factory.createPropertyAssignment(anchor.schemaArg, buildAccess())],
              false
            )
          )
        )
      )
    }

    let access = buildAccess()

    if (anchor.nonNull) {
      access = ts.factory.createAsExpression(
        access,
        ts.factory.createTypeReferenceNode('NonNullable', [
          ts.factory.createTypeQueryNode(
            ts.factory.createQualifiedName(
              anchor.accessPath.slice(0, -1).reduce<ts.EntityName>(
                (acc, part) => ts.factory.createQualifiedName(acc, part),
                ts.factory.createIdentifier('this')
              ),
              anchor.accessPath[anchor.accessPath.length - 1]!
            )
          )
        ])
      )
    }

    return ts.factory.createPropertyAssignment(anchor.schemaArg, access)
  })

  // primary positional args (e.g. `text` for sendMessage). drop ones already covered by
  // the update's anchor map; remaining become positional params + forwarded as named props
  const anchorArgs = new Set(sc.filledArgs.map(a => a.schemaArg))
  const positionals = (METHOD_POSITIONALS[sc.method] ?? [])
    .filter(p => !anchorArgs.has(p.schemaArg))
    .flatMap((p) => {
      const arg = sc.userArgs.find(a => a.name === p.schemaArg)

      return arg ? [{ ...p, arg }] : []
    })

  // positionals are required at the call site even when the schema marks them optional —
  // `exactOptionalPropertyTypes` rejects explicit `undefined`, and primaries like
  // `setMessageReaction.reaction` are conventionally always supplied (pass `[]` to clear)
  const widened = widenedArgs.get(sc.method) ?? new Set<string>()
  const positionalParams = positionals.map((p) => {
    let type = typeRefToTs(p.arg.type)

    if (isRichMessageRef(p.arg.type)) {
      type = ts.factory.createUnionTypeNode([
        type,
        ts.factory.createTypeReferenceNode('RichLike')
      ])
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

  const positionalProps = positionals.map(p =>
    sc.callbackEphemeral === true && p.schemaArg === 'chat_id'
      ? ts.factory.createSpreadAssignment(parseExpression(`${p.name} == null ? {} : { chat_id: ${p.name} }`))
      : ts.factory.createPropertyAssignment(p.schemaArg, ts.factory.createIdentifier(p.name))
  )

  // reply twins fill `reply_parameters.message_id` from the update and merge any
  // user-supplied reply_parameters on top (so quote / allow_sending_without_reply survive,
  // and an explicit message_id still wins). placed after the spread so it can't be clobbered
  const replyProps: ts.ObjectLiteralElementLike[] = sc.reply
    ? [ts.factory.createPropertyAssignment(
        'reply_parameters',
        ts.factory.createObjectLiteralExpression([
          ts.factory.createPropertyAssignment(
            'message_id',
            sc.reply.messageId.accessPath.reduce<ts.Expression>(
              (acc, part) => ts.factory.createPropertyAccessExpression(acc, part),
              ts.factory.createThis()
            )
          ),
          ts.factory.createSpreadAssignment(
            ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('params'), 'reply_parameters')
          )
        ], false)
      )]
    : []

  // ephemeral injections ride after the spread so a non-ephemeral context contributes nothing
  // and the helpers control the merge (explicit call-site values win inside them)
  const ephemeralProps: ts.ObjectLiteralElementLike[] = []

  if (sc.ephemeralSend === true) {
    ephemeralProps.push(ts.factory.createSpreadAssignment(
      ts.factory.createCallExpression(ts.factory.createIdentifier('ephemeralSendParams'), undefined, [
        ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'raw'),
        ts.factory.createIdentifier('params')
      ])
    ))
  }

  if (sc.callbackEphemeral === true) {
    ephemeralProps.push(ts.factory.createSpreadAssignment(
      ts.factory.createCallExpression(ts.factory.createIdentifier('callbackEphemeralParams'), undefined, [
        ts.factory.createPropertyAccessExpression(
          ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'raw'),
          'id'
        ),
        ts.factory.createIdentifier('params')
      ])
    ))
  }

  // an ephemeral message routes edit/delete to the ephemeral twin — the regular variant
  // targets message_id, which does not address ephemeral messages
  const twinStatements: ts.Statement[] = sc.ephemeralTwin === undefined
    ? []
    : [
        ts.factory.createVariableStatement(undefined, ts.factory.createVariableDeclarationList([
          ts.factory.createVariableDeclaration(
            'ephemeral',
            undefined,
            undefined,
            ts.factory.createCallExpression(ts.factory.createIdentifier('ephemeralTarget'), undefined, [
              ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'raw')
            ])
          )
        ], ts.NodeFlags.Const)),
        ts.factory.createIfStatement(
          ts.factory.createBinaryExpression(
            ts.factory.createIdentifier('ephemeral'),
            ts.SyntaxKind.ExclamationEqualsToken,
            ts.factory.createNull()
          ),
          ts.factory.createBlock([
            ts.factory.createReturnStatement(
              ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                  ts.factory.createPropertyAccessExpression(
                    ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'tg'),
                    'api'
                  ),
                  sc.ephemeralTwin
                ),
                undefined,
                [
                  ts.factory.createObjectLiteralExpression([
                    ts.factory.createSpreadAssignment(ts.factory.createIdentifier('ephemeral')),
                    ...positionalProps,
                    ts.factory.createSpreadAssignment(ts.factory.createIdentifier('params'))
                  ], true)
                ]
              )
            )
          ], true)
        )
      ]

  const body = ts.factory.createBlock([
    ...twinStatements,
    ts.factory.createReturnStatement(
      ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'tg'),
            'api'
          ),
          sc.method
        ),
        undefined,
        [
          ts.factory.createObjectLiteralExpression([
            ...filledProps,
            ...positionalProps,
            ts.factory.createSpreadAssignment(ts.factory.createIdentifier('params')),
            ...replyProps,
            ...ephemeralProps
          ], true)
        ]
      )
    )
  ], true)

  const positionalArgs = new Set(positionals.map(p => p.schemaArg))
  const restArgs = sc.userArgs.filter(a => !positionalArgs.has(a.name))

  // inline the remaining params as a literal object type instead of `Omit<XxxParams, …>`.
  // `Omit` desugars to `Pick<T, Exclude<keyof T, K>>` — each shortcut signature was
  // forcing tsc to materialize a fresh Exclude per kind × per call site, which dominated
  // the trace (`Exclude` was 13.5k of 145k total instantiated types on a bare Telegram
  // import). emitting the shape inline lets tsc reuse a flat object type with zero
  // generic resolution cost
  const paramsTypeNode = ts.factory.createTypeLiteralNode([
    ...restArgs.map((arg) => {
      let type = typeRefToTs(arg.type)

      if (widenedArgs.get(sc.method)?.has(arg.name)) {
        type = ts.factory.createUnionTypeNode([
          type,
          ts.factory.createTypeReferenceNode('Formattable')
        ])
      }

      if (arg.name === 'reply_markup') {
        // accept either the bot-api shape or any class with matching toJSON() (mirrors
        // emit-methods' wrapWithToJSON so InlineKeyboard / Keyboard etc. still bind)
        const inner = type

        type = ts.factory.createUnionTypeNode([
          inner,
          ts.factory.createTypeLiteralNode([
            ts.factory.createPropertySignature(
              undefined,
              ts.factory.createIdentifier('toJSON'),
              undefined,
              ts.factory.createFunctionTypeNode(undefined, [], inner)
            )
          ])
        ])
      }

      return ts.factory.createPropertySignature(
        undefined,
        ts.factory.createIdentifier(arg.name),
        arg.required ? undefined : ts.factory.createToken(ts.SyntaxKind.QuestionToken),
        type
      )
    }),
    // opt-out switch for the ephemeral auto-injection — consumed by ephemeralSendParams,
    // never sent to telegram
    ...(sc.ephemeralSend === true || sc.callbackEphemeral === true
      ? [ts.factory.createPropertySignature(
          undefined,
          ts.factory.createIdentifier('ephemeral'),
          ts.factory.createToken(ts.SyntaxKind.QuestionToken),
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)
        )]
      : [])
  ])

  // default `params` to `{}` only when all remaining user args are optional —
  // otherwise `update.send(text)` should error at the call site, not at runtime
  const allRestOptional = restArgs.every(a => !a.required)
  const defaultInit = allRestOptional
    ? ts.factory.createObjectLiteralExpression([], false)
    : undefined

  const paramsParam = ts.factory.createParameterDeclaration(
    undefined, undefined,
    ts.factory.createIdentifier('params'),
    undefined,
    paramsTypeNode,
    defaultInit
  )

  let methodParams = [...positionalParams, paramsParam]
  let methodBody = body

  if (sc.callbackEphemeral === true && positionals[0]?.schemaArg === 'chat_id') {
    const tupleMember = (param: ts.ParameterDeclaration, optional = false, type = param.type!) =>
      ts.factory.createNamedTupleMember(undefined, param.name as ts.Identifier, optional ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined, type)
    const fullTuple = ts.factory.createTupleTypeNode([
      ...positionalParams.map(p => tupleMember(p)),
      tupleMember(paramsParam, allRestOptional)
    ])
    const optIn = parseTypeNode('{ ephemeral: true } | { ephemeral_message_parameters: TelegramEphemeralMessageParameters }')
    const shortTuple = ts.factory.createTupleTypeNode([
      ...positionalParams.slice(1).map(p => tupleMember(p)),
      tupleMember(paramsParam, false, ts.factory.createIntersectionTypeNode([paramsTypeNode, optIn]))
    ])
    const normalizedTuple = ts.factory.createTupleTypeNode([
      tupleMember(positionalParams[0]!, false, ts.factory.createUnionTypeNode([positionalParams[0]!.type!, ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword)])),
      ...positionalParams.slice(1).map(p => tupleMember(p)),
      tupleMember(paramsParam, allRestOptional)
    ])
    const names = [...positionals.map(p => p.name), 'params = {}'].join(', ')
    const declaration = parseStatements(`const [${names}] = args`)[0] as ts.VariableStatement
    const binding = declaration.declarationList.declarations[0]!.name
    const normalized = ts.factory.createVariableStatement(undefined, ts.factory.createVariableDeclarationList([
      ts.factory.createVariableDeclaration(binding, undefined, undefined, ts.factory.createAsExpression(
        parseExpression('callbackOnly ? [undefined, ...args] : args'),
        normalizedTuple
      ))
    ], ts.NodeFlags.Const))

    methodParams = [ts.factory.createParameterDeclaration(
      undefined, ts.factory.createToken(ts.SyntaxKind.DotDotDotToken), 'args', undefined,
      ts.factory.createUnionTypeNode([fullTuple, shortTuple]), undefined
    )]
    methodBody = ts.factory.createBlock([
      ...parseStatements(`const options = args[${positionals.length - 1}]; const callbackOnly = args.length === ${positionals.length} && options != null && typeof options === "object" && ("ephemeral" in options || "ephemeral_message_parameters" in options);`),
      normalized,
      ...body.statements
    ], true)
  }

  const method = ts.factory.createMethodDeclaration(
    undefined, undefined,
    ts.factory.createIdentifier(verbFor(sc)),
    undefined, undefined,
    methodParams,
    undefined,
    methodBody
  )

  const ephemeralNote = sc.ephemeralTwin !== undefined
    ? ` — routes to \`tg.api.${sc.ephemeralTwin}\` when this message is ephemeral`
    : sc.ephemeralSend === true
      ? ' — replying to an ephemeral message auto-fills `ephemeral_message_parameters.receiver_user_id` + `reply_parameters.ephemeral_message_id` (ephemeral responses only reach the receiver)'
      : sc.callbackEphemeral === true
        ? ' — pass `ephemeral: true` or `ephemeral_message_parameters` to send an ephemeral response; callback-only sends may omit the chat argument'
        : ''

  const doc = sc.reply
    ? `reply shortcut for \`tg.api.${sc.method}\` — sets \`reply_parameters\` to this message${ephemeralNote}`
    : `shortcut for \`tg.api.${sc.method}\`${ephemeralNote}`

  return jsDoc(doc, method)
}

// companion class backing `update.thread`. holds raw + tg like an update and carries the same
// send/reply/copy methods, each additionally filling message_thread_id (see emitShortcutMethod —
// it reads this.raw / this.tg, satisfied by the shared constructor)
function emitThreadCompanion (
  companionName: string,
  payloadType: string,
  shortcuts: BoundShortcut[],
  widenedArgs: Map<string, Set<string>>
) {
  const members: ts.ClassElement[] = [emitConstructor(payloadType)]

  for (const sc of shortcuts) {
    members.push(emitShortcutMethod(sc, widenedArgs))
  }

  return jsDoc(
    `thread-scoped shortcuts for \`${payloadType}\` — every call auto-fills \`message_thread_id\`. returned by \`update.thread\``,
    ts.factory.createClassDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(companionName),
      undefined,
      undefined,
      members
    )
  )
}

function emitThreadGetter (companionName: string) {
  const threadAccess = ts.factory.createPropertyAccessExpression(
    ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'raw'),
    'message_thread_id'
  )

  const body = ts.factory.createBlock([
    ts.factory.createReturnStatement(
      ts.factory.createConditionalExpression(
        ts.factory.createBinaryExpression(threadAccess, ts.SyntaxKind.EqualsEqualsToken, ts.factory.createNull()),
        ts.factory.createToken(ts.SyntaxKind.QuestionToken),
        ts.factory.createIdentifier('undefined'),
        ts.factory.createToken(ts.SyntaxKind.ColonToken),
        ts.factory.createNewExpression(
          ts.factory.createIdentifier(companionName),
          undefined,
          [
            ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'raw'),
            ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'tg')
          ]
        )
      )
    )
  ], true)

  return jsDoc(
    'thread-scoped shortcuts — auto-fill `message_thread_id` on every call. `undefined` when this message is not in a thread / forum topic',
    ts.factory.createGetAccessorDeclaration(
      undefined,
      ts.factory.createIdentifier('thread'),
      [],
      ts.factory.createUnionTypeNode([
        ts.factory.createTypeReferenceNode(companionName),
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword)
      ]),
      body
    )
  )
}

function emitUpdateKindUnion () {
  return ts.factory.createTypeAliasDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier('UpdateKind'),
    undefined,
    ts.factory.createTypeOperatorNode(
      ts.SyntaxKind.KeyOfKeyword,
      ts.factory.createTypeReferenceNode('UpdateKindMap')
    )
  )
}

function emitUpdateKindMap (kinds: UpdateKindSpec[]) {
  return ts.factory.createInterfaceDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier('UpdateKindMap'),
    undefined,
    undefined,
    kinds.map(k =>
      ts.factory.createPropertySignature(
        undefined,
        ts.factory.createStringLiteral(k.kindName),
        undefined,
        ts.factory.createTypeReferenceNode(k.className)
      )
    )
  )
}

// runtime mirror of UpdateKind — consumed by `installDispatchers(tg)` at boot
function emitUpdateKindsConst (kinds: UpdateKindSpec[]) {
  return ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList([
      ts.factory.createVariableDeclaration(
        ts.factory.createIdentifier('UPDATE_KINDS'),
        undefined,
        ts.factory.createTypeOperatorNode(
          ts.SyntaxKind.ReadonlyKeyword,
          ts.factory.createArrayTypeNode(ts.factory.createTypeReferenceNode('UpdateKind'))
        ),
        ts.factory.createArrayLiteralExpression(
          kinds.map(k => ts.factory.createStringLiteral(k.kindName)),
          true
        )
      )
    ], ts.NodeFlags.Const)
  )
}

function emitUpdateClassesConst (kinds: UpdateKindSpec[]) {
  return ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList([
      ts.factory.createVariableDeclaration(
        ts.factory.createIdentifier('UPDATE_CLASSES'),
        undefined,
        undefined,
        ts.factory.createObjectLiteralExpression(
          kinds.map(k => ts.factory.createPropertyAssignment(
            ts.factory.createStringLiteral(k.kindName),
            ts.factory.createIdentifier(k.className)
          )),
          true
        )
      )
    ], ts.NodeFlags.Const)
  )
}

// explicit union of every wrapped Update class. `UpdateKindMap[keyof …]` is equivalent
// at the tsc level but ts-eslint's type-checked rules resolve it to `any` — so list classes directly
function emitUpdateUnion (kinds: UpdateKindSpec[]) {
  return ts.factory.createTypeAliasDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier('Update'),
    undefined,
    ts.factory.createUnionTypeNode(
      kinds.map(k => ts.factory.createTypeReferenceNode(k.className))
    )
  )
}

