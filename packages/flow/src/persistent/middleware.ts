import type { UpdateKindMap } from '@puregram/api'
import { isTtlStorage, type KVStorage } from '@puregram/storage'
import type { Telegram } from 'puregram'
import type { Middleware } from 'puregram/runtime'

import { FlowHandlerMissing } from '../errors'

import { persistentPrompt, persistentWaitFor } from './dispatch'
import type { HandlerRegistry } from './handlers'
import { bumpAttempts, deleteRecord, isExpired, readRecord } from './persist'
import { buildKey } from './storage-keys'
import type { FlowHandleContext, PersistedFlow } from './types'

interface KindLike {
  kind: string
}
interface ChatLike {
  chat?: { id?: number | string }
}
interface FromLike {
  from?: { id?: number | string }
}

// eslint-disable-next-line local-rules/no-redundant-return-type -- type predicate is needed for narrowing
function hasKind (value: unknown): value is KindLike {
  return typeof value === 'object' && value !== null && typeof (value as KindLike).kind === 'string'
}

export interface MiddlewareDeps {
  storage: KVStorage<PersistedFlow>
  handlers: HandlerRegistry
  tg: Telegram
  defaultTtl: number | undefined
  /** time source — overridable for tests */
  now?: () => number
}

// eslint-disable-next-line local-rules/no-redundant-return-type -- Middleware<unknown> documents the contract
export function createPersistentMiddleware (deps: MiddlewareDeps): Middleware<unknown> {
  const now = deps.now ?? (() => Date.now())

  return async (update, next) => {
    if (!hasKind(update)) {
      await next()

      return
    }

    const kind = update.kind as keyof UpdateKindMap
    const chatRaw = (update as ChatLike).chat?.id

    if (typeof chatRaw !== 'number') {
      await next()

      return
    }

    const fromRaw = (update as FromLike).from?.id
    const fromIdNum = typeof fromRaw === 'number' ? fromRaw : undefined

    // try the keyed-by-fromId record first; fall back to unscoped (fromId=undefined)
    let record = await readRecord(deps.storage, chatRaw, fromIdNum, kind)
    let recordFromId: number | undefined = fromIdNum

    if (record === undefined && fromIdNum !== undefined) {
      record = await readRecord(deps.storage, chatRaw, undefined, kind)
      recordFromId = undefined
    }

    if (record === undefined) {
      await next()

      return
    }

    const typedUpdate = update as UpdateKindMap[typeof kind]

    if (isExpired(record, now())) {
      await deleteRecord(deps.storage, chatRaw, recordFromId, kind)

      const cfg = deps.handlers.get(record.id)

      if (cfg?.onTimeout !== undefined) {
        const ctx = makeContext(deps, record, recordFromId, typedUpdate)

        await cfg.onTimeout(ctx)
      }

      await next()

      return
    }

    const cfg = deps.handlers.get(record.id)

    if (cfg === undefined) {
      throw new FlowHandlerMissing(record.id)
    }

    if (cfg.filter !== undefined && !cfg.filter(typedUpdate)) {
      // filter mismatch: leave the record open, this update simply isn't ours
      await next()

      return
    }

    if (cfg.validate !== undefined) {
      const result = cfg.validate(typedUpdate)

      if (result !== true) {
        if (typeof result === 'string') {
          await deps.tg.send(chatRaw, result)
        }

        await bumpAttempts(deps.storage, record)

        if (isTtlStorage(deps.storage)) {
          await deps.storage.touch(buildKey(chatRaw, recordFromId, kind))
        }

        // consume — don't propagate the rejected answer to user handlers
        return
      }
    }

    const value = cfg.transform !== undefined
      ? cfg.transform(typedUpdate)
      : typedUpdate

    await deleteRecord(deps.storage, chatRaw, recordFromId, kind)

    const ctx = makeContext(deps, record, recordFromId, typedUpdate)

    await cfg.onAnswer(value, ctx)

    // persistent path always consumes
  }
}

function makeContext (
  deps: MiddlewareDeps,
  record: PersistedFlow,
  recordFromId: number | undefined,
  update: UpdateKindMap[keyof UpdateKindMap]
) {
  const ctx: FlowHandleContext = {
    id: record.id,
    chatId: record.chatId,
    fromId: recordFromId,
    payload: record.payload,
    update,
    open: async (id, openOptions = {}) => {
      const persistDeps = {
        storage: deps.storage,
        handlers: deps.handlers,
        defaultTtl: deps.defaultTtl
      }

      if (openOptions.text !== undefined) {
        const promptOpts: Parameters<typeof persistentPrompt>[4] = { id }

        if (openOptions.payload !== undefined) {
          promptOpts.payload = openOptions.payload
        }

        if (openOptions.ttl !== undefined) {
          promptOpts.ttl = openOptions.ttl
        }

        if (openOptions.kind !== undefined) {
          promptOpts.kind = openOptions.kind
        }

        if (recordFromId !== undefined) {
          promptOpts.from = recordFromId
        }

        if (openOptions.reply_markup !== undefined) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          promptOpts.reply_markup = openOptions.reply_markup
        }

        await persistentPrompt(deps.tg, persistDeps, record.chatId, openOptions.text, promptOpts)

        return
      }

      const waitForOpts: Parameters<typeof persistentWaitFor>[2] = { id }

      if (openOptions.payload !== undefined) {
        waitForOpts.payload = openOptions.payload
      }

      if (openOptions.ttl !== undefined) {
        waitForOpts.ttl = openOptions.ttl
      }

      waitForOpts.chatId = record.chatId

      if (recordFromId !== undefined) {
        waitForOpts.fromId = recordFromId
      }

      await persistentWaitFor(persistDeps, openOptions.kind ?? 'message', waitForOpts)
    },
    close: async () => {
      await deleteRecord(deps.storage, record.chatId, recordFromId, record.kind)
    },
    send: deps.tg.send.bind(deps.tg)
  }

  return ctx
}
