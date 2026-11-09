import { execFileSync } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import { build } from 'esbuild'
import { it } from 'vitest'

it('keeps SQL storage expiry, sliding touch, and bounded sweeping consistent', async () => {
  const root = await mkdtemp(join(tmpdir(), 'puregram-storage-'))

  try {
    const outfile = join(root, 'storage.js')

    await build({
      entryPoints: [resolve('src/storage.ts')],
      outfile,
      bundle: true,
      format: 'esm',
      platform: 'neutral',
      external: ['sdk', 'sdk/db']
    })
    execFileSync(process.execPath, ['--experimental-vm-modules', '--input-type=module', '-e', `
      import assert from 'node:assert/strict';
      import { readFile } from 'node:fs/promises';
      import { DatabaseSync } from 'node:sqlite';
      import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';
      const database = new DatabaseSync(':memory:');
      database.exec('CREATE TABLE sessions (key TEXT PRIMARY KEY, value TEXT NOT NULL, expires_at INTEGER); CREATE INDEX sessions_expires_at_idx ON sessions(expires_at)');
      const db = {
        async get(sql, params) { return database.prepare(sql).get(params ?? {}) ?? null; },
        async run(sql, params) { return database.prepare(sql).run(params ?? {}); }
      };
      let now = 1000;
      const context = createContext({ Date: class extends Date { static now() { return now; } } });
      const sdk = new SyntheticModule(['db'], function () { this.setExport('db', db); }, { context });
      const schema = new SyntheticModule(['index', 'integer', 'table', 'text'], function () {
        for (const name of ['index', 'integer', 'table', 'text']) this.setExport(name, () => { throw new Error('unexpected schema execution'); });
      }, { context });
      const module = new SourceTextModule(await readFile(process.argv[1], 'utf8'), { context });
      await module.link(name => name === 'sdk' ? sdk : name === 'sdk/db' ? schema : Promise.reject(new Error(name)));
      await module.evaluate();
      const { TelegramStorage } = module.namespace;
      const persistent = new TelegramStorage({ table: 'sessions', sweepIntervalMs: 0 });
      database.prepare('INSERT INTO sessions VALUES (?, ?, NULL)').run('legacy', JSON.stringify({ value: { count: 7 } }));
      assert.equal((await persistent.get('legacy')).count, 7);
      await persistent.set('undefined', undefined);
      assert.equal(await persistent.has('undefined'), true);
      assert.equal(await persistent.get('undefined'), undefined);
      await persistent.touch('legacy');
      now = 100000;
      assert.equal((await persistent.get('legacy')).count, 7);
      const storage = new TelegramStorage({ table: 'sessions', ttlMs: 1000, sweepIntervalMs: 0 });
      await storage.set('live', { count: 1 });
      now += 500;
      await storage.touch('live');
      now += 500;
      assert.equal(await storage.has('live'), true);
      now += 500;
      assert.equal(await storage.get('live'), undefined);
      assert.equal(database.prepare('SELECT count(*) AS n FROM sessions WHERE key = ?').get('live').n, 0);
      await storage.set('expired', 1);
      now += 1000;
      await storage.touch('expired');
      assert.equal(await storage.has('expired'), false);
      await storage.touch('missing');
      assert.equal(await storage.has('missing'), false);
      await storage.set('cold', 'old');
      now += 1000;
      assert.equal(await new TelegramStorage({ table: 'sessions' }).get('cold'), undefined);
      const insert = database.prepare('INSERT INTO sessions VALUES (?, ?, ?)');
      for (let i = 0; i < 205; i++) insert.run('stale:' + i, '{"value":0}', now - 1);
      const sweeping = new TelegramStorage({ table: 'sessions' });
      const count = () => database.prepare("SELECT count(*) AS n FROM sessions WHERE key LIKE 'stale:%'").get().n;
      await sweeping.set('fresh', 1);
      assert.equal(count(), 105);
      await sweeping.set('fresh', 2);
      assert.equal(count(), 105);
      now += 60000;
      await sweeping.delete('absent');
      assert.equal(count(), 5);
      assert.equal(await sweeping.get('fresh'), 2);
      assert.equal((await sweeping.get('legacy')).count, 7);
      database.close();
    `, outfile], { timeout: 30_000 })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
