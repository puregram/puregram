import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { build } from '../src/build'

const botImport = JSON.stringify(resolve('src/bot.ts'))
const schemaImport = JSON.stringify(resolve('src/storage-schema.ts'))

describe('serverless update discovery', () => {
  it('infers service-event parents and opt-in kinds from an evaluated bot with a shared schema', async () => {
    const root = await mkdtemp(join(tmpdir(), 'puregram-discovery-'))

    try {
      const entry = join(root, 'bot.ts')
      const schema = join(root, 'schema.ts')
      const outDir = join(root, 'tgcloud')

      await writeFile(schema, `import { kvTable } from ${schemaImport}; export const sessions = kvTable('sessions')`)
      await writeFile(entry, `
        import { createBot } from ${botImport}
        import { sessions as a } from './schema'
        import { sessions as b } from 'schema'
        if (a !== b) throw new Error('schema identity lost')
        const tg = createBot()
        tg.on('new_chat_members', () => {})
        tg.onCallbackQuery(() => {})
        tg.onChatMember(() => {})
        export default tg
      `)

      const result = await build({ entry, schema, root })
      const kinds = ['callback_query', 'channel_post', 'chat_member', 'edited_channel_post', 'edited_message', 'message']

      expect(result.updates.sort()).toEqual(kinds)
      expect((await readdir(join(outDir, 'handlers'))).sort()).toEqual(kinds.map(kind => `${kind}.js`))
      await build({ entry, schema, root, updates: 'auto', minify: true })
      expect((await readdir(join(outDir, 'handlers'))).sort()).toEqual(kinds.map(kind => `${kind}.js`))
      execFileSync(process.execPath, ['--experimental-vm-modules', '--input-type=module', '-e', `
        import assert from 'node:assert/strict';
        import { readFile } from 'node:fs/promises';
        import { SourceTextModule, SyntheticModule, createContext } from 'node:vm';
        const context = createContext({});
        const column = name => ({
          name,
          primaryKey() { return this },
          notNull() { return this }
        });
        const sdk = new SyntheticModule(['table', 'text', 'integer', 'index'], function () {
          this.setExport('table', (name, columns, extras) => {
            extras?.(columns);
            return { name, columns };
          });
          this.setExport('text', column);
          this.setExport('integer', column);
          this.setExport('index', () => ({ on() { return {} } }));
        }, { context });
        const schema = new SourceTextModule(await readFile(process.argv[1] + '/schema.js', 'utf8'), { context });
        await schema.link(name => {
          assert.equal(name, 'sdk/db', 'schema-only imports must not load the runtime SDK');
          return sdk;
        });
        await schema.evaluate();
        assert.equal(schema.namespace.sessions.name, 'sessions');
        assert.equal(schema.namespace.sessions.columns.key.name, 'key');
      `, outDir], { timeout: 30_000 })
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  }, 60_000)

  it('requires explicit updates for opaque predicates and skips discovery when they are provided', async () => {
    const root = await mkdtemp(join(tmpdir(), 'puregram-discovery-'))

    try {
      const entry = join(root, 'bot.ts')
      const outDir = join(root, 'tgcloud')

      await writeFile(entry, `
        import { createBot } from ${botImport}
        const tg = createBot()
        tg.onUpdate(update => update.kind === 'message', () => {})
        export default tg
      `)
      await expect(build({ entry, root })).rejects.toThrow(Error)
      await build({ entry, root, updates: ['message'] })
      const previous = await readFile(join(outDir, 'lib/bot.js'), 'utf8')

      await writeFile(entry, `import { createBot } from ${botImport}; export default createBot()`)
      await expect(build({ entry, root })).rejects.toThrow(Error)
      expect(await readFile(join(outDir, 'lib/bot.js'), 'utf8')).toBe(previous)

      await writeFile(entry, `import { createBot } from ${botImport}; throw new Error('top-level execution'); export default createBot()`)
      await build({ entry, root, updates: ['message'] })
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  }, 60_000)

  it('discovers endpoints for a Mini App backend and links any sdk name the bundle imports', async () => {
    const root = await mkdtemp(join(tmpdir(), 'puregram-discovery-'))

    try {
      const entry = join(root, 'bot.ts')

      await writeFile(entry, `
        import { createBot } from ${botImport}
        import { EndpointError, futureCapability } from 'sdk'
        import database from 'sdk/db'
        const tg = createBot()
        tg.endpoint('getProfile', () => { if (!futureCapability || !database) throw new EndpointError('unreachable') })
        export default tg
      `)
      const result = await build({ entry, root })

      expect(result.updates).toEqual([])
      expect(result.endpoints).toEqual(['getProfile'])
      expect(await readdir(join(root, 'tgcloud/endpoints'))).toEqual(['getProfile.js'])
      await expect(readdir(join(root, 'tgcloud/handlers'))).rejects.toMatchObject({ code: 'ENOENT' })

      await writeFile(entry, `
        import { createBot } from ${botImport}
        const tg = createBot()
        tg.endpoint('getProfile', () => null)
        tg.onUpdate(update => update.kind === 'message', () => {})
        export default tg
      `)
      await expect(build({ entry, root })).rejects.toThrow(/opaque/)
      await expect(build({ entry, root, updates: ['message'], endpoints: ['1bad'] })).rejects.toThrow(/Invalid endpoint/)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  }, 60_000)

  it('blocks runtime API, database, and HTTP discovery calls even when the application catches errors', async () => {
    const root = await mkdtemp(join(tmpdir(), 'puregram-discovery-'))

    try {
      const entry = join(root, 'bot.ts')

      for (const operation of ['await tg.api.getMe()', 'await db.get("SELECT 1")', 'await fetch("https://example.com")']) {
        await writeFile(entry, `
          import { createBot } from ${botImport}
          import { db, fetch } from 'sdk'
          const tg = createBot()
          try { ${operation} } catch {}
          tg.onMessage(() => {})
          export default tg
        `)
        await expect(build({ entry, root })).rejects.toThrow(Error)
      }
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  }, 60_000)
})
