import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'
import { expect, it } from 'vitest'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '../../..')

it('returns editable messages from shortcuts while preserving raw API result types', () => {
  const config = ts.readConfigFile(resolve(root, 'tsconfig.json'), ts.sys.readFile)
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
  const program = ts.createProgram([resolve(here, 'fixtures/shortcut-result-types.ts')], {
    ...parsed.options,
    target: ts.ScriptTarget.ES2023,
    noEmit: true
  })
  const diagnostics = ts.getPreEmitDiagnostics(program)
  const formatted = ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: path => path,
    getCurrentDirectory: () => root,
    getNewLine: () => '\n'
  })

  expect(formatted).toBe('')
}, 30_000)
