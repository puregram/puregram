import type { Plugin } from './plugin'

export class PluginConflict extends Error {
  constructor (name: string) {
    super(`plugin conflict: '${name}' is already installed`); this.name = 'PluginConflict'
  }
}
export class PluginCycle extends Error {
  constructor (cycle: string[]) {
    super(`plugin dependency cycle: ${cycle.join(' -> ')}`); this.name = 'PluginCycle'
  }
}
export class PluginMissingDep extends Error {
  constructor (plugin: string, dep: string) {
    super(`plugin '${plugin}' depends on '${dep}', but '${dep}' is not registered`)
    this.name = 'PluginMissingDep'
  }
}

export function resolveInstallOrder<P extends Pick<Plugin, 'name' | 'dependsOn'>> (plugins: P[]) {
  const byName = new Map<string, P>()

  for (const p of plugins) {
    if (byName.has(p.name)) {
      throw new PluginConflict(p.name)
    }

    byName.set(p.name, p)
  }

  const visited = new Set<string>()
  const onStack = new Set<string>()
  const order: P[] = []

  const visit = (name: string, path: string[]): void => {
    if (visited.has(name)) {
      return
    }

    if (onStack.has(name)) {
      throw new PluginCycle([...path, name])
    }

    onStack.add(name)
    const plugin = byName.get(name)

    if (!plugin) {
      return
    }

    for (const dep of plugin.dependsOn ?? []) {
      if (!byName.has(dep)) {
        throw new PluginMissingDep(name, dep)
      }

      visit(dep, [...path, name])
    }

    onStack.delete(name)
    visited.add(name)
    order.push(plugin)
  }

  for (const p of plugins) {
    visit(p.name, [])
  }

  return order
}
