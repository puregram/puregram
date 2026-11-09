import { mkdir, mkdtemp, readFile, rename, rm, stat, symlink, writeFile } from 'node:fs/promises'
import type * as FileSystem from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it, vi } from 'vitest'

import { publishOutput } from '../src/build-output'

vi.mock('node:fs/promises', async (importOriginal) => {
  const original = await importOriginal<typeof FileSystem>()

  return { ...original, rename: vi.fn(original.rename) }
})

describe('serverless output ownership', () => {
  it('restores owned files and the manifest when installation fails without replacing the project root', async () => {
    const parent = await mkdtemp(join(tmpdir(), 'puregram-publication-'))
    const renameFile = vi.mocked(rename)
    const original = await vi.importActual<typeof FileSystem>('node:fs/promises')

    try {
      const root = join(parent, 'project')
      const previousFiles = new Map([
        ['lib/bot.js', new TextEncoder().encode('previous bot')],
        ['handlers/callback_query.js', new TextEncoder().encode('previous callback')]
      ])
      const manifest = await publishOutput(root, previousFiles, new Set())
      const previousManifest = await readFile(manifest, 'utf8')
      const rootInode = (await stat(root)).ino

      await writeFile(join(root, 'manual.txt'), 'leave alone')
      renameFile.mockImplementation(async (from, to) => {
        if (String(from).endsWith('/next/handlers/message.js')) {
          throw Object.assign(new Error('installation failed'), { code: 'EIO' })
        }

        await original.rename(from, to)
      })

      await expect(publishOutput(root, new Map([
        ['lib/bot.js', new TextEncoder().encode('next bot')],
        ['handlers/message.js', new TextEncoder().encode('next message')]
      ]), new Set())).rejects.toMatchObject({ code: 'EIO' })

      expect(await readFile(join(root, 'lib/bot.js'), 'utf8')).toBe('previous bot')
      expect(await readFile(join(root, 'handlers/callback_query.js'), 'utf8')).toBe('previous callback')
      await expect(readFile(join(root, 'handlers/message.js'))).rejects.toMatchObject({ code: 'ENOENT' })
      expect(await readFile(manifest, 'utf8')).toBe(previousManifest)
      expect(await readFile(join(root, 'manual.txt'), 'utf8')).toBe('leave alone')
      expect((await stat(root)).ino).toBe(rootInode)
    } finally {
      renameFile.mockImplementation(original.rename)
      await rm(parent, { recursive: true, force: true })
    }
  })

  it('protects source collisions, unmanaged outputs, and symlinked output paths inside a project root', async () => {
    const parent = await mkdtemp(join(tmpdir(), 'puregram-publication-'))

    try {
      const root = join(parent, 'project')
      const source = join(root, 'lib/bot.js')
      const contents = new Map([['lib/bot.js', new TextEncoder().encode('generated')]])

      await mkdir(join(root, 'lib'), { recursive: true })
      await writeFile(source, 'source')
      await expect(publishOutput(root, contents, new Set([source]))).rejects.toThrow(Error)
      await expect(publishOutput(root, contents, new Set())).rejects.toThrow(Error)
      expect(await readFile(source, 'utf8')).toBe('source')

      await rm(source)
      const external = join(parent, 'external.js')

      await writeFile(external, 'external')
      await symlink(external, source)
      await expect(publishOutput(root, contents, new Set())).rejects.toThrow(Error)
      expect(await readFile(external, 'utf8')).toBe('external')
    } finally {
      await rm(parent, { recursive: true, force: true })
    }
  })
})
