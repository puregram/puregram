import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { emitApiMethods } from './lib/emitter/emit-api-methods'
import { emitDispatch } from './lib/emitter/emit-dispatch'
import { emitEnums } from './lib/emitter/emit-enums'
import { emitFactories } from './lib/emitter/emit-factories'
import { emitFilterTypes } from './lib/emitter/emit-filter-types'
import { emitFilters } from './lib/emitter/emit-filters'
import { emitFormattableFields } from './lib/emitter/emit-formattable-fields'
import { emitInspect } from './lib/emitter/emit-inspect'
import { emitMethodParams } from './lib/emitter/emit-method-params'
import { emitMethods } from './lib/emitter/emit-methods'
import { emitServiceEvents } from './lib/emitter/emit-service-events'
import { emitShortcuts } from './lib/emitter/emit-shortcuts'
import { emitStructures } from './lib/emitter/emit-structures'
import { emitTypes } from './lib/emitter/emit-types'
import { emitUpdates } from './lib/emitter/emit-updates'
import { emitWebhookReplySafe } from './lib/emitter/emit-webhook-reply-safe'
import { loadLatestSchema } from './lib/emitter/load-schema'
import { applyMethodReturnOverrides } from './lib/emitter/method-overrides'
import { applySoftEnums } from './lib/emitter/soft-enums'

async function main () {
  const schema = await loadLatestSchema()

  applySoftEnums(schema)
  applyMethodReturnOverrides(schema)

  const expected: [string, string][] = [
    ['inspect.ts', emitInspect(schema)],
    ['types.ts', emitTypes(schema)],
    ['methods.ts', emitMethods(schema)],
    ['method-params.ts', emitMethodParams(schema)],
    ['api-methods.ts', emitApiMethods(schema)],
    ['enums.ts', emitEnums(schema)],
    ['structures.ts', emitStructures(schema)],
    ['updates.ts', emitUpdates(schema)],
    ['shortcuts.ts', emitShortcuts(schema)],
    ['service-events.ts', emitServiceEvents(schema)],
    ['factories.ts', emitFactories(schema)],
    ['formattable-fields.ts', emitFormattableFields(schema)],
    ['filters.ts', emitFilters(schema)],
    ['filter-types.ts', emitFilterTypes(schema)],
    ['dispatch.ts', emitDispatch(schema)],
    ['webhook-reply-safe.ts', emitWebhookReplySafe(schema)]
  ]

  const here = dirname(fileURLToPath(import.meta.url))
  const generatedDir = resolve(here, '..', 'src', 'generated')

  let drifted = 0

  for (const [name, content] of expected) {
    const path = resolve(generatedDir, name)
    let onDisk: string

    try {
      onDisk = await readFile(path, 'utf8')
    } catch {
      console.error(`[verify] missing: ${name}`)
      drifted++
      continue
    }

    if (onDisk !== content) {
      console.error(`[verify] drift detected: ${name}`)
      drifted++
    }
  }

  if (drifted > 0) {
    console.error(`[verify] ${drifted} file(s) drifted. run "yarn emit" to regenerate, then commit.`)
    process.exit(1)
  }

  console.log('[verify] ok — generated/ matches schema')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
