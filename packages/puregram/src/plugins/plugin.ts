import type { TelegramCore } from '../core'

export interface Plugin<N extends string = string, Ext = unknown, Target = TelegramCore> {
  readonly name: N
  readonly dependsOn?: readonly string[]
  install: (tg: Target) => Ext | Promise<Ext>
}

export function createPlugin<N extends string, Ext, Target = TelegramCore> (spec: Plugin<N, Ext, Target>) {
  return spec
}
