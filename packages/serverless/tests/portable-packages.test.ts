import { execFileSync } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

import { describe, it } from 'vitest'

import { build } from '../src/build'

describe('portable public entry points', () => {
  it.each([
    ['puregram/runtime', 'TelegramCore', 'function'],
    ['@puregram/markup', 'markup', 'function'],
    ['@puregram/session', 'session', 'function'],
    ['@puregram/scenes', 'StepScene', 'function'],
    ['@puregram/rate-limit', 'rateLimit', 'function'],
    ['@puregram/callback-data', 'defineCallbackData', 'function'],
    ['@puregram/utils', 'WebApp', 'function']
  ])('loads every export from %s without Node capabilities', async (specifier, exported, type) => {
    const root = await mkdtemp(join(resolve('tests'), '.portable-'))

    try {
      const entry = join(root, 'bot.ts')
      const outDir = join(root, 'tgcloud')

      await writeFile(entry, `import * as exports from ${JSON.stringify(specifier)}\nexport default { async handleUpdate () { return exports } }\n`)
      await build({ entry, updates: ['message'], root })
      execFileSync(process.execPath, ['--experimental-vm-modules', '--input-type=module', '-e', `
        import assert from 'node:assert/strict'
        import { readFile } from 'node:fs/promises'
        import { createContext, SourceTextModule } from 'node:vm'
        const module = new SourceTextModule(await readFile(process.argv[1], 'utf8'), { context: createContext({ TextEncoder, TextDecoder, crypto }) })
        await module.link(name => { throw new Error('unexpected runtime import: ' + name) })
        await module.evaluate()
        const exports = await module.namespace.default.handleUpdate()
        assert.equal(typeof exports[process.argv[2]], process.argv[3])
      `, join(outDir, 'lib/bot.js'), exported, type], { timeout: 30_000 })
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  }, 60_000)

  it('renders widgets and checks RFC1950 size without Node capabilities', async () => {
    const root = await mkdtemp(join(resolve('tests'), '.portable-widgets-'))

    try {
      const entry = join(root, 'bot.ts')

      await writeFile(entry, `
        import { defineWidget, html } from '@puregram/widgets'
        const template = defineWidget({ html: html\`<b>\${'<x>'}</b>\` })
        export default {
          async handleUpdate () {
            return { content: template.content({ chat: { count: 1 } }), check: template.html.check() }
          }
        }
      `)
      await build({ entry, updates: ['widget_query'], root })
      execFileSync(process.execPath, ['--experimental-vm-modules', '--input-type=module', '-e', `
        import assert from 'node:assert/strict'
        import { readFile } from 'node:fs/promises'
        import { createContext, SourceTextModule } from 'node:vm'
        import { deflateSync } from 'node:zlib'
        const module = new SourceTextModule(await readFile(process.argv[1], 'utf8'), { context: createContext({ TextEncoder, TextDecoder, crypto }) })
        await module.link(name => { throw new Error('unexpected runtime import: ' + name) })
        await module.evaluate()
        const { content, check } = await module.namespace.default.handleUpdate()
        assert.equal(content.html, '<b>&lt;x&gt;</b>')
        assert.deepEqual(JSON.parse(content.chat_data), { count: 1 })
        assert.equal(check.compressedBytes, deflateSync(content.html, { level: 9 }).length)
        assert.equal(check.ok, true)
      `, join(root, 'tgcloud/lib/bot.js')], { timeout: 30_000 })
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  }, 60_000)
})
