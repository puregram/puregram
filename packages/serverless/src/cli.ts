#!/usr/bin/env node

import { parseArgs } from 'node:util'

import { build, SERVERLESS_UPDATE_KINDS } from './build'

const usage = `Usage: puregram-serverless build <entry> [--root <directory>] [--updates auto|none|<kinds>] [--endpoints auto|none|<names>] [--schema <path>] [--minify]

Bundle a default-exported createBot() instance for Telegram Serverless.

Options:
  --root <directory>     tgcloud project root; modules are written to <root>/tgcloud/
                         (default: nearest directory with .tgcloud/, else the current directory)
  --updates <kinds>      auto (default), none, or comma-separated incoming update kinds
  --endpoints <names>    Mini App endpoints registered with tg.endpoint(): auto, none, or
                         comma-separated names (default: auto with --updates auto, else none)
  --schema <path>        Bundle a shared schema source to tgcloud/schema.js
  --minify               Minify bundles (default: readable JavaScript)
  --help, -h              Show this help

Update kinds:
  ${SERVERLESS_UPDATE_KINDS.join(', ')}

The builder writes tgcloud/lib/bot.js, tgcloud/handlers/*.js, and tgcloud/endpoints/*.js,
not a listener or polling loop. Deploy the output separately with tgcloud push.
This command does not deploy.

Auto discovery executes trusted application top-level code; it is not a security
sandbox. Runtime API/database/HTTP calls are blocked. Register handlers and
endpoints at module top level; opaque predicates or runtime-dependent registration
require explicit lists. Explicit --updates and --endpoints skip build-time execution.
`

function parseList (value: string | undefined) {
  if (value === undefined) {
    return undefined
  }

  const trimmed = value.trim()

  if (trimmed === 'auto') {
    return 'auto'
  }

  return trimmed === 'none' ? [] : trimmed.split(',').map(name => name.trim())
}

async function main () {
  const { values, positionals } = parseArgs({
    options: {
      updates: { type: 'string' },
      endpoints: { type: 'string' },
      root: { type: 'string' },
      schema: { type: 'string' },
      minify: { type: 'boolean' },
      help: { type: 'boolean', short: 'h' }
    },
    allowPositionals: true,
    strict: true
  })

  if (values.help === true) {
    console.log(usage)

    return
  }

  if (positionals[0] !== 'build' || positionals.length !== 2) {
    throw new Error('Expected build <entry>. Run puregram-serverless --help for usage.')
  }

  const updates = parseList(values.updates)
  const endpoints = parseList(values.endpoints)
  const result = await build({
    entry: positionals[1]!,
    minify: values.minify ?? false,
    ...(updates === undefined ? {} : { updates }),
    ...(endpoints === undefined ? {} : { endpoints }),
    ...(values.root === undefined ? {} : { root: values.root }),
    ...(values.schema === undefined ? {} : { schema: values.schema })
  })

  console.log(`Built ${result.files.length} modules in ${result.outDir} (${result.minify ? 'minified' : 'readable'})`)
  console.log(`Updates: ${result.updates.join(', ') || '(none)'}`)
  console.log(`Endpoints: ${result.endpoints.join(', ') || '(none)'}`)

  for (const file of result.files) {
    console.log(`  ${file}`)
  }
}

main().catch((error: unknown) => {
  console.error(`puregram-serverless: ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
})
