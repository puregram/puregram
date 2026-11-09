import { mkdir, readdir, rename, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parseCore } from './lib/parser/core'
import { fetchHtml } from './lib/parser/fetch'
import type { Schema } from './lib/schema-types'

const CORE_URL = 'https://core.telegram.org/bots/api'

async function main () {
  console.log('[parse] fetching core…')
  const coreHtml = await fetchHtml(CORE_URL)

  console.log('[parse] parsing…')
  const fragment = parseCore(coreHtml)

  const schema: Schema = {
    ...fragment,
    source: {
      core: CORE_URL,
      fetchedAt: new Date().toISOString()
    }
  }

  const versionString = `${schema.version.major}.${schema.version.minor}`
  const here = dirname(fileURLToPath(import.meta.url))
  const outDir = resolve(here, '..', 'schema')
  const archiveDir = resolve(outDir, 'archive')
  const outFile = resolve(outDir, `${versionString}.json`)

  await mkdir(outDir, { recursive: true })

  // shelve any superseded top-level checkpoint so npm ships only the current one
  const present = await readdir(outDir).catch(() => [])
  const stale = present.filter(f => /^\d+\.\d+\.json$/.test(f) && f !== `${versionString}.json`)

  if (stale.length > 0) {
    await mkdir(archiveDir, { recursive: true })

    for (const file of stale) {
      await rename(resolve(outDir, file), resolve(archiveDir, file))
    }
  }

  await writeFile(outFile, JSON.stringify(schema, null, 2) + '\n', 'utf8')

  console.log(`[parse] wrote ${outFile}`)

  if (stale.length > 0) {
    console.log(`[parse]   archived ${stale.join(', ')}`)
  }

  console.log(`[parse]   ${schema.methods.length} methods, ${schema.objects.length} objects`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
