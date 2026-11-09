import { isTtlStorage, type KVStorage, MemoryStorage } from '@puregram/storage'
import { createPlugin, type TelegramCore } from 'puregram/runtime'

import { wrap } from './proxy'
import { expireSession, readSession, type TtlData, writeSession } from './ttl'
import type { AnyUpdate, SessionContext, SessionOptions, StorageKeyDescriptor } from './types'

interface KeyResolvable {
  from?: { id?: number | string }
  senderChat?: { id?: number | string }
  chat?: { id?: number | string }
  chatId?: number | string
  messageThreadId?: number | string
}

const defaultGetStorageKey = (update: AnyUpdate) => {
  const u = update as KeyResolvable
  const chatId = u.chat?.id ?? u.chatId
  const fromId = u.from?.id

  if (chatId === undefined && fromId === undefined) {
    return undefined
  }

  const descriptor: StorageKeyDescriptor = {}

  if (typeof chatId === 'number') {
    descriptor.chat = chatId
  } else if (typeof chatId === 'string') {
    descriptor.key = chatId
  }

  if (typeof fromId === 'number') {
    descriptor.user = fromId
  }

  return descriptor
}

const normalizeKey = (raw: string | StorageKeyDescriptor) => {
  if (typeof raw === 'string') {
    return raw
  }

  const parts: string[] = []

  if (raw.user !== undefined) {
    parts.push(`user:${raw.user}`)
  }

  if (raw.chat !== undefined) {
    parts.push(`chat:${raw.chat}`)
  }

  if (raw.thread !== undefined) {
    parts.push(`thread:${raw.thread}`)
  }

  if (raw.key !== undefined) {
    parts.push(`key:${raw.key}`)
  }

  return parts.join(':')
}

const resolveKey = (
  update: AnyUpdate,
  resolver: (update: AnyUpdate) => string | StorageKeyDescriptor | undefined
) => {
  const result = resolver(update)

  if (result === undefined) {
    return undefined
  }

  if (typeof result === 'string') {
    return result.length === 0 ? undefined : result
  }

  const normalized = normalizeKey(result)

  return normalized.length === 0 ? undefined : normalized
}

export interface SessionExtension {
  get: (key: string) => Promise<unknown>
  set: (key: string, value: unknown) => Promise<void>
  delete: (key: string) => Promise<void>
  has: (key: string) => Promise<boolean>
}

export function session (options: SessionOptions = {}) {
  const storage: KVStorage<unknown> = options.storage ?? new MemoryStorage<unknown>()
  const getStorageKey = options.getStorageKey ?? defaultGetStorageKey
  const initial = options.initial ?? (() => ({}))
  // lazy mode skips storage.get until update.session is touched; off by default so
  // downstream plugins (scenes) keep their sync `u.session.x = y` access pattern
  const lazy = options.lazy ?? false

  return createPlugin({
    name: 'session',
    install: (tg: TelegramCore) => {
      tg.useHook('onUpdate', async (update, next) => {
        const key = resolveKey(update, getStorageKey)

        if (key === undefined) {
          await next()

          return
        }

        let ttlMap = new Map<string, TtlData>()
        let changed = false
        let touched = false
        let loaded = false
        let stored: unknown
        let sessionData: Record<string, unknown> | undefined
        let proxy: SessionContext | undefined

        const onChange = () => {
          changed = true
        }

        const $forceUpdate = async () => {
          if (sessionData === undefined) {
            return
          }

          expireSession(sessionData, ttlMap)

          if (Object.keys(sessionData).length !== 0) {
            await storage.set(key, writeSession(sessionData, ttlMap))
            changed = false

            return
          }

          await storage.delete(key)
          changed = false
        }

        const load = async () => {
          if (loaded) {
            return proxy as SessionContext
          }

          loaded = true
          stored = await storage.get(key)
          const decoded = readSession(stored)

          ttlMap = decoded.ttlMap
          sessionData = decoded.value !== undefined
            ? decoded.value as Record<string, unknown>
            : initial(update) as Record<string, unknown>
          changed = expireSession(sessionData, ttlMap)

          proxy = wrap(sessionData, $forceUpdate, ttlMap, onChange) as SessionContext

          return proxy
        }

        if (!lazy) {
          await load()
        }

        Object.defineProperty(update, 'session', {
          get: () => {
            touched = true

            if (proxy !== undefined) {
              return proxy
            }

            // lazy first-access — return a thenable that resolves to the proxy
            const pending = load()

            return {
              then: pending.then.bind(pending),
              catch: pending.catch.bind(pending),
              finally: pending.finally.bind(pending)
            }
          },
          enumerable: true,
          configurable: false
        })

        await next()

        if (!touched && lazy) {
          return
        }

        // ensure lazy load resolved before deciding whether to flush/touch
        await load()

        if (changed || stored === undefined) {
          await $forceUpdate()
        } else if (isTtlStorage(storage)) {
          await storage.touch(key)
        }
      }, { priority: 'high' })

      const get = async (key: string) => {
        const stored = await storage.get(key)
        const decoded = readSession(stored)

        if (expireSession(decoded.value, decoded.ttlMap)) {
          if (typeof decoded.value === 'object' && decoded.value !== null && Object.keys(decoded.value).length === 0) {
            await storage.delete(key)

            return undefined
          }

          await storage.set(key, writeSession(decoded.value, decoded.ttlMap))
        }

        return decoded.value
      }

      const ext: SessionExtension = {
        get,
        set: (key: string, value: unknown) => storage.set(key, writeSession(value, new Map())),
        delete: (key: string) => storage.delete(key),
        has: async (key: string) => {
          await get(key)

          return storage.has(key)
        }
      }

      return ext
    }
  })
}
