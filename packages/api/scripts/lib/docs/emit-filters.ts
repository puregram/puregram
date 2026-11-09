import { getterNameFor } from '../emitter/field-names'
import { buildUpdateKinds } from '../emitter/updates-config'
import type { Schema, SchemaField, SchemaObject } from '../schema-types'

import { renderType } from './render-type'
import { cell, GENERATED_BANNER } from './shared'

interface PresenceEntry {
  kinds: string[]
  field: SchemaField
}

function collectPresenceFilters (schema: Schema) {
  const kinds = buildUpdateKinds(schema)
  const objectsByName = new Map<string, SchemaObject>(schema.objects.map(o => [o.name, o]))
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
        entry = { kinds: [], field: f }
        presence.set(camelName, entry)
      }

      entry.kinds.push(k.kindName)
    }
  }

  return presence
}

function sameSet (a: Set<string>, b: string[]) {
  return a.size === b.length && b.every(x => a.has(x))
}

export function emitFiltersPage (schema: Schema) {
  const kinds = buildUpdateKinds(schema)
  const messageFamily = new Set(kinds.filter(k => k.payloadType === 'TelegramMessage').map(k => k.kindName))
  const presence = collectPresenceFilters(schema)

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

    rows.push(`| \`filters.${hasName}\` | \`${camelName}\`: ${cell(renderType(entry.field.type))} | ${kindsCell} |`)
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
