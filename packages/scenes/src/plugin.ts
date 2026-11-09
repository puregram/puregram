import { createPlugin, type TelegramCore } from 'puregram/runtime'

import { SceneContext, type ScenePayload } from './contexts/scene'
import { SceneManager } from './manager'
import type { SceneInterface } from './scenes/scene'
import type { AnyUpdate, SceneOptions } from './types'

interface KeyResolvable {
  from?: { id?: number | string }
  senderChat?: { id?: number | string }
  chat?: { id?: number | string }
}

const defaultGetStorageKey = (update: AnyUpdate) => {
  const u = update as KeyResolvable
  const fromId = u.from?.id

  if (fromId !== undefined) {
    return String(fromId)
  }

  const senderChatId = u.senderChat?.id

  if (senderChatId !== undefined) {
    return String(senderChatId)
  }

  const chatId = u.chat?.id

  if (chatId !== undefined) {
    return String(chatId)
  }

  return undefined
}

/** runtime scene registry exposed as `tg.scenes`. mirrors the manager surface; SceneManager stays package-private */
export interface ScenesExtension {
  add: (scene: SceneInterface) => void
  has: (slug: string) => boolean
  remove: (slug: string) => boolean
  all: () => SceneInterface[]
}

export function scenes (options: SceneOptions = {}) {
  const manager = new SceneManager(options.scenes !== undefined ? { scenes: options.scenes } : {})
  const getStorageKey = options.getStorageKey ?? defaultGetStorageKey
  const passthrough = options.passthrough ?? (() => false)

  return createPlugin({
    name: 'scenes',
    dependsOn: ['session'],
    install: (tg: TelegramCore) => {
      tg.useHook('onUpdate', async (update, next) => {
        const key = getStorageKey(update)

        if (key === undefined) {
          await next()

          return
        }

        // session middleware ran first via `dependsOn` — `update.session` is already attached
        const payload = update as unknown as ScenePayload
        const ctx = new SceneContext({ payload, manager })

        Object.defineProperty(update, 'scene', {
          value: ctx,
          enumerable: true,
          configurable: false
        })

        // active scene owns the update unless `passthrough` exempts it (e.g. global /whoami commands)
        if (ctx.current !== undefined && !passthrough(update)) {
          await ctx.reenter()

          return
        }

        await next()
      }, { priority: 'high' })

      const ext: ScenesExtension = {
        add: (scene) => {
          manager.add(scene)
        },
        has: slug => manager.has(slug),
        remove: slug => manager.remove(slug),
        all: () => manager.all()
      }

      return ext
    }
  })
}
