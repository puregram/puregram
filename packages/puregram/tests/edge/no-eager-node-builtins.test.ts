import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const register = fileURLToPath(new URL('./register-trap.mjs', import.meta.url))
const entry = fileURLToPath(new URL('../../src/index.ts', import.meta.url))
const streamEntry = fileURLToPath(new URL('../../../stream/src/index.ts', import.meta.url))

describe('edge readiness', () => {
  // the entry must load on runtimes without a filesystem or http server
  // (cloudflare workers, deno deploy, ...). node:fs / node:http belong behind
  // lazy `await import(...)` in the few methods that need them — never on the
  // import graph. a child node process imports the entry under a resolution hook
  // that throws if either is pulled in eagerly
  it('importing the entry pulls in no eager node:fs / node:http', () => {
    const result = execFileSync(process.execPath, [
      '--import', 'tsx',
      '--import', register,
      '--input-type=module',
      '--eval', `
        const { Telegram } = await import(${JSON.stringify(entry)});
        const tg = Telegram.fromToken('X');
        tg.onMessage(() => {});
        process.stdout.write(JSON.stringify(tg.resolveAllowedUpdates('auto')));
      `
    ], { encoding: 'utf8', stdio: 'pipe' })

    expect(JSON.parse(result)).toEqual(['message'])
  })

  it('loads stream adapters and decodes utf-8 without Node byte primitives', () => {
    const result = execFileSync(process.execPath, [
      '--import', 'tsx',
      '--import', register,
      '--input-type=module',
      '--eval', `
        globalThis.Buffer = undefined;
        const { fromBytes } = await import(${JSON.stringify(streamEntry)});
        async function* source() {
          yield new Uint8Array([0xe2, 0x82]);
          yield new Uint8Array([0xac]);
        }
        let text = '';
        for await (const chunk of fromBytes(source())) text += chunk;
        process.stdout.write(text);
      `
    ], { encoding: 'utf8', stdio: 'pipe' })

    expect(result).toBe('€')
  })
})
