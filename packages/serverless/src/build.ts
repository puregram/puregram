import { execFile } from 'node:child_process'
import { realpath, stat } from 'node:fs/promises'
import { builtinModules } from 'node:module'
import { dirname, join, resolve } from 'node:path'

import { SERVICE_EVENT_FIELDS, UPDATE_KINDS } from '@puregram/api'
import { build as bundle, type Plugin } from 'esbuild'

import { publishOutput } from './build-output'

export interface BuildOptions {
  entry: string
  updates?: readonly string[] | 'auto'
  endpoints?: readonly string[] | 'auto'
  root?: string
  schema?: string
  minify?: boolean
}

export interface BuildResultInfo {
  root: string
  outDir: string
  files: string[]
  updates: string[]
  endpoints: string[]
  manifest: string
  minify: boolean
}

export const SERVERLESS_UPDATE_KINDS: readonly string[] = UPDATE_KINDS.filter(
  kind => !Object.hasOwn(SERVICE_EVENT_FIELDS, kind)
)

const nodeModules = new Set(builtinModules.map(name => name.replace(/^node:/, '')))

const sdkImport = /^sdk(?:\/|$)/

const unavailableNode = 'puregram-unavailable-node'

const maxModuleBytes = 1_048_576

function dependencies (schema: string | undefined): Plugin {
  return {
    name: 'puregram-serverless-dependencies',
    setup (builder) {
      builder.onResolve({ filter: /.*/ }, async (args) => {
        if (args.pluginData === 'puregram-resolving') {
          return
        }

        if (args.path.startsWith('node:') || nodeModules.has(args.path)) {
          return args.kind === 'dynamic-import'
            ? { path: args.path, namespace: unavailableNode }
            : { errors: [{ text: `Node module "${args.path}" is unavailable in Telegram Serverless. Use a portable dependency or the SDK instead.` }] }
        }

        if (sdkImport.test(args.path)) {
          return { path: args.path, external: true }
        }

        if (args.path === 'schema') {
          return schema === undefined
            ? { errors: [{ text: 'An import from "schema" requires the schema option (--schema <path>).' }] }
            : { path: '../schema.js', external: true }
        }

        if (schema === undefined || args.kind === 'entry-point') {
          return
        }

        const resolved = await builder.resolve(args.path, {
          importer: args.importer,
          namespace: args.namespace,
          resolveDir: args.resolveDir,
          kind: args.kind,
          pluginData: 'puregram-resolving'
        })

        if (resolved.errors.length > 0) {
          return { errors: resolved.errors, warnings: resolved.warnings }
        }

        if (resolved.namespace === 'file' && await realpath(resolved.path) === schema) {
          return { path: '../schema.js', external: true }
        }

        return resolved
      })

      builder.onLoad({ filter: /.*/, namespace: unavailableNode }, args => ({
        contents: `throw new Error(${JSON.stringify(`Node module "${args.path}" is unavailable in Telegram Serverless`)})`,
        loader: 'js'
      }))
    }
  }
}

async function compile (entry: string, outfile: string, minify: boolean, schema?: string) {
  const result = await bundle({
    entryPoints: [entry],
    outfile,
    bundle: true,
    minify,
    platform: 'neutral',
    format: 'esm',
    target: 'es2022',
    mainFields: ['module', 'main'],
    conditions: ['import'],
    write: false,
    metafile: true,
    legalComments: 'none',
    logLevel: 'silent',
    logOverride: {
      'unsupported-dynamic-import': 'error',
      'unsupported-require-call': 'error',
      'ignored-dynamic-import': 'error',
      'require-resolve-not-external': 'error'
    },
    plugins: [dependencies(schema)]
  })

  for (const output of Object.values(result.metafile.outputs)) {
    for (const dependency of output.imports) {
      if (dependency.external && (dependency.kind === 'require-call' || dependency.kind === 'require-resolve')) {
        throw new Error(`External dependency "${dependency.path}" must use an ES module import. Telegram Serverless does not provide require().`)
      }

      if (dependency.external && !sdkImport.test(dependency.path) && !(schema !== undefined && dependency.path === '../schema.js')) {
        throw new Error(`Unbundled dependency "${dependency.path}" is unavailable in Telegram Serverless. Only sdk imports and the emitted schema module may remain external.`)
      }
    }
  }

  if (result.outputFiles.length !== 1 || !result.outputFiles[0]?.path.endsWith('.js')) {
    throw new Error('Telegram Serverless requires a single JavaScript bundle per module; imported CSS and emitted assets are not supported.')
  }

  return result
}

function handler (kind: string) {
  return `import bot from '../lib/bot.js'

export default async function (payload, ctx) {
  if (bot == null || typeof bot.handleUpdate !== 'function') {
    throw new TypeError('The bot entry must default-export a bot returned by createBot() from @puregram/serverless.')
  }

  await bot.handleUpdate(ctx?.update === undefined
    ? { update_id: 0, [${JSON.stringify(kind)}]: payload }
    : ctx.update)
}
`
}

function endpoint (name: string) {
  return `import bot from '../lib/bot.js'

export default async function (input, ctx) {
  if (bot == null || typeof bot.handleEndpoint !== 'function') {
    throw new TypeError('The bot entry must default-export a bot returned by createBot() from @puregram/serverless.')
  }

  return await bot.handleEndpoint(${JSON.stringify(name)}, input, ctx)
}
`
}

const endpointName = /^[A-Za-z_][A-Za-z0-9_]*$/

const discoveryScript = String.raw`
import { readFileSync } from 'node:fs'
import { Console } from 'node:console'
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm'

try {
  const { bot: source, schema } = JSON.parse(readFileSync(0, 'utf8'))
  let forbidden
  const block = name => (..._args) => {
    forbidden ??= name
    throw new Error(name + ' is unavailable during update discovery')
  }
  const runtime = name => new Proxy({}, {
    get: (_, method) => block(name + '.' + String(method))
  })
  const api = runtime('sdk.api')
  const db = runtime('sdk.db')
  const fetch = Object.assign(block('sdk.fetch'), { body: runtime('sdk.fetch.body') })
  class InputFile {
    constructor(source, filename, options) { Object.assign(this, { source, filename, type: options?.type }) }
  }
  class BotApiError extends Error {}
  class EndpointError extends Error {
    constructor(description, parameters) { super(description); Object.assign(this, { name: 'EndpointError', description, parameters }) }
  }
  const FormData = block('sdk.FormData')
  const declaration = (...args) => {
    const value = { args }
    for (const method of ['primaryKey', 'notNull', 'unique', 'default', 'generatedAlwaysAs', 'deprecated', 'on', 'where', 'strict', 'withoutRowid', 'as']) {
      value[method] = (...args) => { value[method + 'Args'] = args; return value }
    }
    return value
  }
  const database = { db }
  for (const name of ['text', 'integer', 'real', 'float', 'numeric', 'blob', 'boolean', 'json', 'index', 'uniqueIndex', 'unique', 'primaryKey', 'check', 'foreignKey', 'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'notLike', 'isNull', 'isNotNull', 'and', 'or', 'not', 'between', 'notBetween', 'inArray', 'notInArray', 'count', 'sum', 'avg', 'min', 'max', 'asc', 'desc']) {
    database[name] = declaration
  }
  database.sql = Object.assign((...args) => declaration(...args), { raw: declaration, join: declaration, empty: declaration })
  database.table = (name, columns, extras) => {
    const value = Object.assign(declaration(name), columns)
    extras?.(value)
    return value
  }
  database.isTable = value => typeof value === 'object' && value !== null && Array.isArray(value.args)
  database.default = database
  const surface = {
    sdk: { api, db, fetch, InputFile, BotApiError, EndpointError, FormData },
    'sdk/api': { api, InputFile, BotApiError },
    'sdk/db': database,
    'sdk/fetch': { fetch, default: fetch, InputFile, FormData }
  }
  for (const text of [source, schema ?? '']) {
    for (const [, clause, specifier] of text.matchAll(/^import\s+([^;]+?)\s+from\s*["'](sdk(?:\/[\w-]+)?)["']/gm)) {
      const exports = surface[specifier] ??= {}
      const named = /\{([^}]*)\}/.exec(clause)
      const names = (named?.[1] ?? '').split(',').map(part => part.trim().split(/\s+as\s+/)[0]).filter(Boolean)
      if (/^[\w$]/.test(clause)) names.push('default')
      for (const name of names) {
        if (!(name in exports)) exports[name] = block(specifier + '.' + name)
      }
    }
  }
  const context = createContext({ console: new Console(process.stderr), TextEncoder, TextDecoder, crypto: globalThis.crypto })
  const modules = new Map()
  for (const [name, exports] of Object.entries(surface)) {
    modules.set(name, new SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value)
    }, { context, identifier: name }))
  }
  const load = (name, source) => {
    const module = new SourceTextModule(source, {
      context,
      identifier: name,
      importModuleDynamically: async specifier => {
        const dependency = resolve(specifier)
        if (dependency.status === 'unlinked') await dependency.link(resolve)
        if (dependency.status === 'linked') await dependency.evaluate({ timeout: 5000 })
        return dependency
      }
    })
    modules.set(name, module)
    return module
  }
  const resolve = name => {
    const module = modules.get(name)
    if (module === undefined) throw new Error('Unsupported discovery import "' + name + '"; select explicit updates if it requires a runtime SDK capability')
    return module
  }
  if (schema !== undefined) load('../schema.js', schema)
  const module = load('lib/bot', source)
  await module.link(resolve)
  await module.evaluate({ timeout: 5000 })
  if (forbidden !== undefined) throw new Error(forbidden + ' was called during update discovery, even though application code caught its error')
  const bot = module.namespace.default
  if (bot == null || typeof bot.handleUpdate !== 'function' || typeof bot.describeSubscriptions !== 'function') {
    throw new TypeError('Automatic discovery requires a default-exported createBot() instance')
  }
  const { updates, opaque, endpoints } = bot.describeSubscriptions()
  if (forbidden !== undefined) throw new Error(forbidden + ' was called during update discovery')
  if (opaque) {
    throw new Error('Update subscriptions cannot be inferred from opaque predicates or custom update kinds')
  }
  if (updates.length === 0 && endpoints.length === 0) {
    throw new Error('The bot registers no update handlers or endpoints')
  }
  process.stdout.write(JSON.stringify({ updates, endpoints }))
} catch (error) {
  process.stderr.write((error instanceof Error ? error.message : String(error)) + '\n')
  process.exitCode = 1
}
`

async function discover (bot: string, schema: string | undefined) {
  try {
    const output = await new Promise<string>((resolve, reject) => {
      const child = execFile(process.execPath, [
        '--experimental-vm-modules', '--input-type=module', '--eval', discoveryScript
      ], { encoding: 'utf8', timeout: 10_000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
        if (error !== null) {
          reject(new Error(error.killed ? 'Top-level evaluation exceeded 10 seconds' : stderr.trim() || error.message))
        } else {
          resolve(stdout)
        }
      })

      child.stdin!.on('error', reject)
      child.stdin!.end(JSON.stringify({ bot, schema }))
    })

    return JSON.parse(output) as { updates: string[], endpoints: string[] }
  } catch (error) {
    throw new Error(`Automatic discovery failed: ${error instanceof Error ? error.message : String(error)}. Register handlers and endpoints at module top level without starting the bot or calling runtime API/database/HTTP methods, or list them explicitly (--updates message,callback_query --endpoints getProfile).`, { cause: error })
  }
}

async function isDirectory (path: string) {
  try {
    return (await stat(path)).isDirectory()
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false
    }

    throw error
  }
}

async function findProjectRoot (start: string) {
  for (let dir = start; ; dir = dirname(dir)) {
    if (await isDirectory(join(dir, '.tgcloud'))) {
      return dir
    }

    if (dirname(dir) === dir) {
      return undefined
    }
  }
}

async function resolveRoot (root: string | undefined) {
  if (root === undefined) {
    const cwd = await realpath(process.cwd())

    return await findProjectRoot(cwd) ?? cwd
  }

  const resolved = await realpath(resolve(root))
  const project = await findProjectRoot(resolved)

  if (project !== undefined && project !== resolved) {
    throw new Error(`${resolved} is inside the tgcloud project ${project}; tgcloud would deploy ${join(project, 'tgcloud')} instead. Build with --root ${project}.`)
  }

  return resolved
}

export async function build (options: BuildOptions) {
  if (typeof options.entry !== 'string' || options.entry.trim() === '') {
    throw new Error('A bot entry path is required.')
  }

  if (options.root !== undefined && (typeof options.root !== 'string' || options.root.trim() === '')) {
    throw new Error('The root option must be a project directory path.')
  }

  const selectedUpdates = options.updates ?? 'auto'
  const selectedEndpoints = options.endpoints ?? (selectedUpdates === 'auto' ? 'auto' : [])

  for (const [option, selected] of [['updates', selectedUpdates], ['endpoints', selectedEndpoints]] as const) {
    if (selected !== 'auto' && (!Array.isArray(selected) || !selected.every((value: unknown) => typeof value === 'string'))) {
      throw new Error(`The ${option} option must be 'auto' or a list of names.`)
    }
  }

  if (options.schema !== undefined && (typeof options.schema !== 'string' || options.schema.trim() === '')) {
    throw new Error('The schema option must be a source file path.')
  }

  if (options.minify !== undefined && typeof options.minify !== 'boolean') {
    throw new Error('The minify option must be a boolean.')
  }

  const minify = options.minify ?? false

  const entry = await realpath(resolve(options.entry))
  const root = await resolveRoot(options.root)
  const outDir = join(root, 'tgcloud')
  const schema = options.schema === undefined ? undefined : await realpath(resolve(options.schema))

  if (entry === schema) {
    throw new Error('The bot entry and schema must be different source files.')
  }

  const [botBundle, schemaBundle] = await Promise.all([
    compile(entry, resolve(outDir, 'lib/bot.js'), minify, schema),
    schema === undefined ? undefined : compile(schema, resolve(outDir, 'schema.js'), minify)
  ])

  if (!Object.values(botBundle.metafile.outputs).some(output => output.exports.includes('default'))) {
    throw new Error('The bot entry must default-export a bot returned by createBot() from @puregram/serverless.')
  }

  const discovered = selectedUpdates === 'auto' || selectedEndpoints === 'auto'
    ? await discover(botBundle.outputFiles[0]!.text, schemaBundle?.outputFiles[0]!.text)
    : undefined
  const updates = [...new Set(selectedUpdates === 'auto' ? discovered!.updates : selectedUpdates)]
  const endpoints = [...new Set(selectedEndpoints === 'auto' ? discovered!.endpoints : selectedEndpoints)]
  const unknown = updates.filter(kind => !SERVERLESS_UPDATE_KINDS.includes(kind))
  const invalidEndpoints = endpoints.filter(name => !endpointName.test(name))

  if (unknown.length > 0) {
    throw new Error(`Unknown update kind(s): ${unknown.join(', ')}. Allowed kinds: ${SERVERLESS_UPDATE_KINDS.join(', ')}. Subscribe to message for message service events.`)
  }

  if (invalidEndpoints.length > 0) {
    throw new Error(`Invalid endpoint name(s): ${invalidEndpoints.join(', ')}. Use letters, digits, and _, not starting with a digit.`)
  }

  if (updates.length === 0 && endpoints.length === 0) {
    throw new Error('Select at least one update kind or endpoint (--updates message,callback_query or --endpoints getProfile).')
  }

  const files = new Map<string, Uint8Array>([['lib/bot.js', botBundle.outputFiles[0]!.contents]])

  for (const kind of updates) {
    files.set(`handlers/${kind}.js`, new TextEncoder().encode(handler(kind)))
  }

  for (const name of endpoints) {
    files.set(`endpoints/${name}.js`, new TextEncoder().encode(endpoint(name)))
  }

  if (schemaBundle !== undefined) {
    files.set('schema.js', schemaBundle.outputFiles[0]!.contents)
  }

  for (const [path, contents] of files) {
    if (contents.byteLength > maxModuleBytes) {
      throw new Error(`${path} is ${contents.byteLength} bytes; Telegram Serverless rejects modules over ${maxModuleBytes} bytes.${minify ? '' : ' Rebuild with --minify.'}`)
    }
  }

  const inputs = new Set([entry, ...(schema === undefined ? [] : [schema])])

  for (const result of [botBundle, schemaBundle]) {
    if (result === undefined) {
      continue
    }

    for (const input of Object.keys(result.metafile.inputs)) {
      if (!input.startsWith(`${unavailableNode}:`)) {
        inputs.add(await realpath(resolve(input)))
      }
    }
  }

  const manifest = await publishOutput(outDir, files, inputs)

  return { root, outDir, files: [...files.keys()], updates, endpoints, manifest, minify }
}
