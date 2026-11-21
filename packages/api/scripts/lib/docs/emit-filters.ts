import { wrapperInfoFor } from '../emitter/emit-updates'
import { getterNameFor } from '../emitter/field-names'
import { buildUpdateKinds, type UpdateKindSpec } from '../emitter/updates-config'
import type { Schema, SchemaObject, SchemaTypeRef } from '../schema-types'

import { renderType } from './render-type'
import { cell, GENERATED_BANNER } from './shared'

interface PresenceEntry {
  kinds: string[]
  types: Set<SchemaTypeRef>
}

function collectPresenceFilters (kinds: UpdateKindSpec[], objectsByName: Map<string, SchemaObject>) {
  const presence = new Map<string, PresenceEntry>()

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
        entry = { kinds: [], types: new Set() }
        presence.set(camelName, entry)
      }

      entry.kinds.push(k.kindName)
      entry.types.add(f.type)
    }
  }

  return presence
}

function renderRawType (ref: SchemaTypeRef): string {
  switch (ref.kind) {
    case 'integer':
    case 'float':
      return 'number'
    case 'reference':
      return `[Telegram${ref.name}](/api/objects#${ref.name.toLowerCase()})`
    case 'union':
      return ref.of.map(renderRawType).join(' | ')
    case 'array': {
      const item = renderRawType(ref.of)

      return ref.of.kind === 'union' ? `(${item})[]` : `${item}[]`
    }
    default:
      return renderType(ref)
  }
}

function renderGetterType (ref: SchemaTypeRef, objectsByName: Map<string, SchemaObject>) {
  const wrapper = wrapperInfoFor(ref, objectsByName)

  if (!wrapper) {
    return renderRawType(ref)
  }

  if (wrapper.inaccessible) {
    return '[MessageUpdate](/api/updates#message) | [TelegramInaccessibleMessage](/api/objects#inaccessiblemessage)'
  }

  const name = objectsByName.has(wrapper.name)
    ? `[${wrapper.name}](/api/objects#${wrapper.name.toLowerCase()})`
    : `\`${wrapper.name}\``

  return wrapper.isArray ? `${name}[]` : name
}

function sameSet (a: Set<string>, b: string[]) {
  return a.size === b.length && b.every(x => a.has(x))
}

export function emitFiltersPage (schema: Schema) {
  const kinds = buildUpdateKinds(schema)
  const messageFamily = new Set(kinds.filter(k => k.payloadType === 'TelegramMessage').map(k => k.kindName))
  const objectsByName = new Map(schema.objects.map(o => [o.name, o]))
  const presence = collectPresenceFilters(kinds, objectsByName)

  const head = [
    GENERATED_BANNER,
    '',
    '# filters',
    '',
    `the codegen'd \`hasX\` presence filters (bot api ${schema.version.major}.${schema.version.minor}). all are re-exported from the top-level \`filters\` namespace and carry \`kinds\` metadata for the dispatcher fast-path. for usage, combinators (\`.and()\` / \`.or()\` / \`.not()\`), handcrafted filters and \`defineFilter\`, see [dispatch & filters](/guide/handling-updates/dispatch-and-filters)`,
    '',
    '```ts',
    "import { filters } from 'puregram'",
    '',
    'tg.onMessage(filters.hasText, (message) => {',
    '  // message.text is narrowed to string',
    '  return message.send(message.text)',
    '})',
    '```',
    '',
    '## presence filters',
    '',
    '`message-family` in the **kinds** column means every message-shaped update kind (`message`, `edited_message`, `channel_post`, … and the service events that derive from a `Message` payload)',
    '',
    '| filter | narrows | kinds |',
    '| --- | --- | --- |'
  ]

  const camelNames = [...presence.keys()].sort()
  const rows: string[] = []

  for (const camelName of camelNames) {
    const entry = presence.get(camelName)!
    const hasName = `has${camelName[0]!.toUpperCase()}${camelName.slice(1)}`

    const kindsCell = sameSet(messageFamily, entry.kinds)
      ? '`message-family`'
      : entry.kinds.map(k => `\`${k}\``).join(', ')

    const types = new Set([...entry.types].map(ref => renderGetterType(ref, objectsByName)))

    rows.push(`| \`filters.${hasName}\` | \`${camelName}\`: ${cell([...types].join(' | '))} | ${kindsCell} |`)
  }

  const tail = [
    '',
    '## kind filters',
    '',
    'match a specific update kind. callable `filters.kind(k)` or a shorthand property like `filters.kind.message` / `filters.kind.editedMessage`. `filters.action` is the same restricted to service-event kinds. the per-kind `<Kind>Filter` types (one for every kind on the [updates](/api/updates) page) are the pre-bound shape these produce',
    ''
  ]

  return `${head.join('\n')}\n${rows.join('\n')}\n${tail.join('\n')}`
}
