import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const DRY_RUN = process.env.DRY_RUN === '1'

const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', ...opts }).trim()

const workspaces = run('yarn', ['workspaces', 'list', '--no-private', '--json'])
  .split('\n')
  .map(line => JSON.parse(line))
  .map(({ location }) => {
    const manifest = JSON.parse(readFileSync(join(location, 'package.json'), 'utf8'))
    const deps = { ...manifest.dependencies, ...manifest.peerDependencies, ...manifest.optionalDependencies }

    return { location, name: manifest.name, version: manifest.version, deps: Object.keys(deps) }
  })

const byName = new Map(workspaces.map(ws => [ws.name, ws]))
const ordered = []
const visited = new Set()

const visit = (ws) => {
  if (visited.has(ws.name)) {
    return
  }

  visited.add(ws.name)

  for (const dep of ws.deps) {
    if (byName.has(dep)) {
      visit(byName.get(dep))
    }
  }

  ordered.push(ws)
}

workspaces.forEach(visit)

function isPublished (name, version) {
  const result = spawnSync('npm', ['view', `${name}@${version}`, 'version'], { encoding: 'utf8' })

  if (result.status === 0) {
    return result.stdout.trim() === version
  }

  if (result.stderr.includes('E404')) {
    return false
  }

  throw new Error(`npm view ${name}@${version} failed:\n${result.stderr}`)
}

const pending = ordered.filter(ws => !isPublished(ws.name, ws.version))

if (pending.length === 0) {
  console.log('every public workspace is already on npm')
  process.exit(0)
}

const outDir = mkdtempSync(join(tmpdir(), 'puregram-publish-'))

for (const { location, name, version } of pending) {
  const tarball = join(outDir, `${name.replace('@', '').replace('/', '-')}-${version}.tgz`)

  console.log(`\n=== ${name}@${version}`)

  run('yarn', ['pack', '--out', tarball], { cwd: location, stdio: ['ignore', 'pipe', 'inherit'] })

  const args = ['publish', tarball, '--access', 'public']

  if (DRY_RUN) {
    args.push('--dry-run')
  }

  execFileSync('npm', args, { stdio: 'inherit' })
}
