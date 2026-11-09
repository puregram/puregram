import type { CustomUpdate, Update } from '@puregram/api'

import type { SceneInterface } from './scenes/scene'

/**
 * user-augmentable scene state. widen the typed surface of `update.scene.state`
 * by declaration-merging fields:
 *
 * @example
 * ```ts
 * declare module '@puregram/scenes' {
 *   interface SceneState {
 *     step: number
 *     answers: string[]
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface -- user-augmentable
export interface SceneState {}

export type AnyUpdate = Update | CustomUpdate

export interface SceneOptions {
  /** initial scene set; runtime additions go through `tg.scenes.add(scene)` */
  scenes?: SceneInterface[]
  /**
   * how to derive the storage key per update — defaults to
   * `from.id ?? senderChat.id ?? chat.id`. undefined → no scene attached
   */
  getStorageKey?: (update: AnyUpdate) => string | undefined
  /**
   * bypass scene reentry for selected updates — when this returns true for a user
   * with an active scene, the update flows to subsequent middleware as if no scene
   * were active. `update.scene` stays attached so handlers can still call
   * `update.scene.leave()`. handy for global commands like `/whoami`, `/help`
   */
  passthrough?: (update: AnyUpdate) => boolean
}
