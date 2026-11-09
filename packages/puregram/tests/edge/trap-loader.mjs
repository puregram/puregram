// resolution hook for the edge-readiness test — throws if a node builtin that
// edge runtimes lack is pulled in eagerly (at import time). lazy `await import(...)`
// runs at call-time and never reaches this hook, so a clean import proves the
// core entry doesn't *statically* depend on these
const FORBIDDEN = new Set([
  'node:fs', 'fs',
  'node:fs/promises', 'fs/promises',
  'node:http', 'http',
  'node:https', 'https',
  'node:string_decoder', 'string_decoder',
  'formdata-node/file-from-path'
])

export async function resolve (specifier, context, nextResolve) {
  if (FORBIDDEN.has(specifier)) {
    throw new Error(`eager import of edge-forbidden module: ${specifier}`)
  }

  return nextResolve(specifier, context)
}
