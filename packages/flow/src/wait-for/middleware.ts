import type { UpdateKindMap } from '@puregram/api'
import type { Telegram } from 'puregram'
import type { Middleware } from 'puregram/runtime'

import type { WaiterRegistry } from './registry'

interface KindLike {
  kind: string
}

interface ChatLike {
  chat?: { id?: number | string }
}

// eslint-disable-next-line local-rules/no-redundant-return-type -- type predicate is needed for narrowing
function hasKind (value: unknown): value is KindLike {
  return typeof value === 'object' && value !== null && typeof (value as KindLike).kind === 'string'
}

// eslint-disable-next-line local-rules/no-redundant-return-type -- Middleware<unknown> documents the contract
export function createWaitForMiddleware (registry: WaiterRegistry, tg?: Telegram): Middleware<unknown> {
  return async (update, next) => {
    if (!hasKind(update)) {
      await next()

      return
    }

    const kind = update.kind as keyof UpdateKindMap
    const matched = registry.matchOrPeek(kind, update as UpdateKindMap[typeof kind])

    if (matched.outcome === 'none') {
      await next()

      return
    }

    if (matched.outcome === 'rejected') {
      // validate-string feedback: echo to the chat the update came from, leave the waiter armed
      if (matched.feedback !== undefined && tg !== undefined) {
        const chatId = (update as ChatLike).chat?.id

        if (chatId !== undefined) {
          await tg.send(chatId, matched.feedback)
        }
      }

      await next()

      return
    }

    matched.waiter.resolve(update as UpdateKindMap[typeof kind])

    if (!matched.waiter.consume) {
      await next()
    }

    // consume === true → do not call next(); short-circuits user handlers + 'low' chain
  }
}
