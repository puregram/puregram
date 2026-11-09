import { createHash } from 'node:crypto'
import { lstat, mkdir, mkdtemp, readFile, realpath, rename, rm, rmdir, writeFile } from 'node:fs/promises'
import { basename, dirname, join, relative, resolve, sep } from 'node:path'

interface Manifest {
  version: 1
  files: Record<string, string>
}

async function stat (path: string) {
  try {
    return await lstat(path)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined
    }

    throw error
  }
}

async function canonicalPath (path: string): Promise<string> {
  try {
    return await realpath(path)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error
    }

    return join(await canonicalPath(dirname(path)), basename(path))
  }
}

async function checkPath (root: string, path: string) {
  const parts = relative(root, path).split(sep)
  let current = root

  for (let i = 0; i <= parts.length; i++) {
    const info = await stat(current)

    if (info?.isSymbolicLink()) {
      throw new Error(`Refusing to modify a symlink in generated output: ${current}`)
    }

    if (info !== undefined && i < parts.length && !info.isDirectory()) {
      throw new Error(`Expected an output directory at ${current}. Move this unmanaged file out of the way.`)
    }

    if (i < parts.length) {
      current = join(current, parts[i]!)
    }
  }
}

export async function publishOutput (outDir: string, files: Map<string, Uint8Array>, inputs: ReadonlySet<string>) {
  if (dirname(outDir) === outDir) {
    throw new Error('The filesystem root cannot be used as the output directory.')
  }

  const manifestPath = join(dirname(outDir), `.${basename(outDir)}.puregram-serverless.json`)
  const canonicalManifest = await canonicalPath(manifestPath)

  const outputInfo = await stat(outDir)

  if (outputInfo !== undefined && (!outputInfo.isDirectory() || outputInfo.isSymbolicLink())) {
    throw new Error(`The output must be a real directory, not a file or symlink: ${outDir}`)
  }

  const manifestInfo = await stat(manifestPath)

  if (manifestInfo !== undefined && (!manifestInfo.isFile() || manifestInfo.isSymbolicLink())) {
    throw new Error(`The build ownership manifest must be a regular file: ${manifestPath}`)
  }

  let previous: Manifest = { version: 1, files: {} }

  if (manifestInfo !== undefined) {
    const parsed: unknown = JSON.parse(await readFile(manifestPath, 'utf8'))

    if (parsed === null || typeof parsed !== 'object' || !('version' in parsed) || parsed.version !== 1 || !('files' in parsed) || parsed.files === null || typeof parsed.files !== 'object' || Array.isArray(parsed.files)) {
      throw new Error(`Invalid build ownership manifest: ${manifestPath}. Restore the original manifest or use a new output directory.`)
    }

    for (const [path, hash] of Object.entries(parsed.files)) {
      if (!/^(?:lib\/bot\.js|schema\.js|handlers\/[a-z][a-z0-9_]*\.js|endpoints\/[A-Za-z_][A-Za-z0-9_]*\.js)$/.test(path) || typeof hash !== 'string' || !/^[a-f0-9]{64}$/.test(hash)) {
        throw new Error(`Invalid generated file entry in ${manifestPath}: ${path}`)
      }
    }

    previous = parsed as Manifest
  }

  const targets = new Set([...Object.keys(previous.files), ...files.keys()])

  for (const path of targets) {
    const target = await canonicalPath(resolve(outDir, path))

    if (inputs.has(target)) {
      throw new Error(`Source dependency ${target} overlaps generated output. Keep sources outside ${outDir}.`)
    }
  }

  if (inputs.has(canonicalManifest)) {
    throw new Error(`Source dependency ${canonicalManifest} overlaps the build ownership manifest.`)
  }

  for (const path of targets) {
    const target = resolve(outDir, path)

    await checkPath(outDir, target)
    const info = await stat(target)

    if (info === undefined) {
      continue
    }

    if (!info.isFile()) {
      throw new Error(`Refusing to replace a non-file output: ${target}`)
    }

    const expected = previous.files[path]

    if (expected === undefined) {
      throw new Error(`Refusing to overwrite unmanaged file ${target}. Move it out of the way before building.`)
    }

    const contents = await readFile(target)

    if (createHash('sha256').update(contents).digest('hex') !== expected) {
      throw new Error(`Generated file ${target} was modified outside the builder. Preserve your changes elsewhere and delete it before rebuilding.`)
    }

    if (path === 'schema.js' && !files.has(path)) {
      files.set(path, contents)
    }
  }

  const next: Manifest = { version: 1, files: {} }

  for (const [path, contents] of files) {
    next.files[path] = createHash('sha256').update(contents).digest('hex')
  }

  const manifest = `${JSON.stringify(next, null, 2)}\n`

  await mkdir(dirname(outDir), { recursive: true })
  const transaction = await mkdtemp(join(dirname(outDir), `.${basename(outDir)}.puregram-build-`))
  const staging = join(transaction, 'next')
  const backup = join(transaction, 'previous')
  const backedUp: string[] = []
  const installed: string[] = []
  const createdDirectories: string[] = []
  let preserveBackup = false
  let failure: unknown

  async function ensureDirectory (path: string): Promise<void> {
    if (await stat(path) !== undefined) {
      return
    }

    await ensureDirectory(dirname(path))
    await mkdir(path)
    createdDirectories.push(path)
  }

  try {
    await mkdir(staging)
    await mkdir(backup)

    for (const [path, contents] of files) {
      const target = join(staging, path)

      await mkdir(dirname(target), { recursive: true })
      await writeFile(target, contents, { flag: 'wx' })
    }

    await writeFile(join(transaction, 'manifest.json'), manifest, { flag: 'wx' })

    await ensureDirectory(outDir)

    for (const path of targets) {
      const target = join(outDir, path)

      if (await stat(target) !== undefined) {
        const saved = join(backup, path)

        await mkdir(dirname(saved), { recursive: true })
        await rename(target, saved)
        backedUp.push(path)
      }
    }

    for (const path of files.keys()) {
      const target = join(outDir, path)

      await ensureDirectory(dirname(target))
      await rename(join(staging, path), target)
      installed.push(path)
    }

    await rename(join(transaction, 'manifest.json'), manifestPath)
  } catch (error) {
    failure = error

    try {
      for (const path of installed.reverse()) {
        await rm(join(outDir, path), { force: true })
      }

      for (const path of backedUp.reverse()) {
        await rename(join(backup, path), join(outDir, path))
      }

      for (const path of createdDirectories.reverse()) {
        try {
          await rmdir(path)
        } catch (cleanupError) {
          if ((cleanupError as NodeJS.ErrnoException).code !== 'ENOTEMPTY') {
            throw cleanupError
          }
        }
      }
    } catch (rollbackError) {
      preserveBackup = true
      failure = new AggregateError([error, rollbackError], `Output installation and rollback failed. The previous output is preserved at ${backup}.`)
    }
  }

  if (!preserveBackup) {
    try {
      await rm(transaction, { recursive: true, force: true })
    } catch (error) {
      failure = failure === undefined
        ? error
        : new AggregateError([failure, error], 'Build failed and temporary output cleanup also failed.')
    }
  }

  if (failure !== undefined) {
    throw failure
  }

  return manifestPath
}
