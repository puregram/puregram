import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, readdir, rm, stat, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { build } from '../src/build'

describe('telegram serverless builds', () => {
  it('executes generated handlers across isolated invocations without Node globals', async () => {
    const root = await mkdtemp(join(tmpdir(), 'puregram-serverless-'))

    try {
      const outDir = join(root, 'tgcloud')

      await build({ entry: resolve('tests/fixtures/bot.ts'), updates: ['message', 'callback_query'], endpoints: ['echo', 'refuse'], root })
      execFileSync(process.execPath, [
        '--experimental-vm-modules', resolve('tests/fixtures/run.mjs'), outDir
      ], { encoding: 'utf8', timeout: 30_000 })
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  }, 60_000)

  it('removes obsolete handlers while preserving manual files and the last successful build', async () => {
    const root = await mkdtemp(join(tmpdir(), 'puregram-serverless-'))

    try {
      const entry = join(root, 'bot.ts')
      const outDir = join(root, 'tgcloud')

      await writeFile(entry, 'export default { async handleUpdate () {} }')
      await build({ entry, updates: ['message', 'callback_query'], root })
      await writeFile(join(outDir, 'lib/manual.js'), 'export const value = 1')
      await build({ entry, updates: ['message'], root })

      await expect(readFile(join(outDir, 'handlers/callback_query.js'))).rejects.toMatchObject({ code: 'ENOENT' })
      expect(await readFile(join(outDir, 'lib/manual.js'), 'utf8')).toBe('export const value = 1')
      const previous = await readFile(join(outDir, 'lib/bot.js'), 'utf8')

      await writeFile(entry, 'import { readFile } from "node:fs"; export default readFile')
      await expect(build({ entry, updates: ['message'], root })).rejects.toThrow(Error)
      expect(await readFile(join(outDir, 'lib/bot.js'), 'utf8')).toBe(previous)

      await writeFile(entry, 'export default { async handleUpdate () {} }')
      await writeFile(join(outDir, 'lib/bot.js'), 'hand-edited')
      await expect(build({ entry, updates: ['message'], root })).rejects.toThrow(Error)
      expect(await readFile(join(outDir, 'lib/bot.js'), 'utf8')).toBe('hand-edited')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('defers lazy node imports to a runtime error and refuses modules over the platform cap', async () => {
    const root = await mkdtemp(join(tmpdir(), 'puregram-serverless-'))

    try {
      const entry = join(root, 'bot.ts')

      await writeFile(entry, 'export default { async handleUpdate () { await import("node:fs/promises") } }')
      await build({ entry, updates: ['message'], root })
      execFileSync(process.execPath, ['--experimental-vm-modules', '--input-type=module', '-e', `
        import assert from 'node:assert/strict';
        import { readFile } from 'node:fs/promises';
        import { SourceTextModule, createContext } from 'node:vm';
        const bot = new SourceTextModule(await readFile(process.argv[1] + '/lib/bot.js', 'utf8'), { context: createContext({}) });
        await bot.link(() => { throw new Error('unexpected dependency'); });
        await bot.evaluate();
        await assert.rejects(bot.namespace.default.handleUpdate(), /node:fs\\/promises" is unavailable/);
      `, join(root, 'tgcloud')], { timeout: 30_000 })

      await writeFile(entry, `export const blob = ${JSON.stringify('x'.repeat(1_100_000))}; export default { async handleUpdate () {} }`)
      await expect(build({ entry, updates: ['message'], root })).rejects.toThrow(/over 1048576 bytes/)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  }, 60_000)

  it('keeps schema imports shared and rejects service events as handler kinds', async () => {
    const root = await mkdtemp(join(tmpdir(), 'puregram-serverless-'))

    try {
      const entry = join(root, 'bot.ts')
      const schema = join(root, 'schema.ts')
      const outDir = join(root, 'tgcloud')

      await writeFile(schema, 'export const table = {}')
      await writeFile(entry, 'import { table as a } from "./schema"; import { table as b } from "schema"; export default { async handleUpdate () { if (a !== b) throw new Error("schema identity lost") } }')
      await build({ entry, schema, updates: ['message'], root })
      execFileSync(process.execPath, ['--experimental-vm-modules', '--input-type=module', '-e', `
        import { readFile } from 'node:fs/promises';
        import { SourceTextModule, createContext } from 'node:vm';
        const context = createContext({});
        const schema = new SourceTextModule(await readFile(process.argv[1] + '/schema.js', 'utf8'), { context });
        await schema.link(() => { throw new Error('unexpected schema dependency'); });
        const bot = new SourceTextModule(await readFile(process.argv[1] + '/lib/bot.js', 'utf8'), { context });
        await bot.link(name => { if (name !== '../schema.js') throw new Error(name); return schema; });
        await bot.evaluate();
        await bot.namespace.default.handleUpdate();
      `, outDir], { timeout: 30_000 })
      await expect(build({ entry, schema, updates: ['new_chat_members'], root })).rejects.toThrow(Error)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('supports payload-only invocations and preserves supplied envelopes in readable and minified builds', async () => {
    const root = await mkdtemp(join(tmpdir(), 'puregram-serverless-'))

    try {
      const entry = join(root, 'bot.ts')

      await writeFile(entry, 'export default { async handleUpdate (update) { globalThis.received = update } }')
      await mkdir(join(root, 'readable'))
      await mkdir(join(root, 'minified'))
      const readable = await build({ entry, updates: ['message'], root: join(root, 'readable') })
      const minified = await build({ entry, updates: ['message'], root: join(root, 'minified'), minify: true })

      expect((await readFile(join(minified.outDir, 'lib/bot.js'))).byteLength)
        .toBeLessThan((await readFile(join(readable.outDir, 'lib/bot.js'))).byteLength)

      for (const { outDir } of [readable, minified]) {
        execFileSync(process.execPath, ['--experimental-vm-modules', '--input-type=module', '-e', `
          import assert from 'node:assert/strict';
          import { readFile } from 'node:fs/promises';
          import { SourceTextModule, createContext } from 'node:vm';
          const context = createContext({});
          const bot = new SourceTextModule(await readFile(process.argv[1] + '/lib/bot.js', 'utf8'), { context });
          await bot.link(() => { throw new Error('unexpected dependency'); });
          const handler = new SourceTextModule(await readFile(process.argv[1] + '/handlers/message.js', 'utf8'), { context });
          await handler.link(name => { assert.equal(name, '../lib/bot.js'); return bot; });
          await handler.evaluate();
          const payload = { chat: { id: 1 }, text: 'local run' };
          await handler.namespace.default(payload);
          assert.equal(context.received.update_id, 0);
          assert.equal(context.received.message, payload);
          await handler.namespace.default(payload, {});
          assert.equal(context.received.message, payload);
          const envelope = { update_id: 99, message: payload, future_metadata: true };
          await handler.namespace.default({ text: 'not the original payload' }, { update: envelope });
          assert.equal(context.received, envelope);
          await handler.namespace.default(payload, { update: null });
          assert.equal(context.received, null);
        `, outDir], { timeout: 30_000 })
      }
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('publishes into tgcloud/ without replacing unrelated files and refuses roots nested in another project', async () => {
    const parent = await mkdtemp(join(tmpdir(), 'puregram-serverless-'))

    try {
      const root = join(parent, 'project')
      const entry = join(root, 'bot.ts')

      await mkdir(root)
      await writeFile(entry, 'export default { async handleUpdate () {} }')

      for (const directory of ['.git', '.tgcloud', 'node_modules', 'tgcloud/lib']) {
        await mkdir(join(root, directory), { recursive: true })
        await writeFile(join(root, directory, 'manual'), directory)
      }

      await symlink(join(root, '.git'), join(root, 'unrelated-link'))
      const paths = [root, ...['.git/manual', '.tgcloud/manual', 'node_modules/manual', 'tgcloud/lib/manual'].map(path => join(root, path))]
      const before = await Promise.all(paths.map(path => stat(path)))

      await build({ entry, updates: ['message', 'callback_query'], root })
      const result = await build({ entry, updates: ['message'], root })

      expect(result.manifest).toBe(join(root, '.tgcloud.puregram-serverless.json'))
      expect(await readdir(join(root, 'tgcloud/handlers'))).toEqual(['message.js'])
      expect(await readFile(entry, 'utf8')).toBe('export default { async handleUpdate () {} }')
      expect(await readFile(join(root, 'unrelated-link/manual'), 'utf8')).toBe('.git')

      for (const [index, path] of paths.entries()) {
        expect((await stat(path)).ino).toBe(before[index]!.ino)
      }

      await mkdir(join(root, 'nested'))
      await expect(build({ entry, updates: ['message'], root: join(root, 'nested') })).rejects.toThrow(/inside the tgcloud project/)
    } finally {
      await rm(parent, { recursive: true, force: true })
    }
  })
})
