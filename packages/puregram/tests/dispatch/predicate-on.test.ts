import type { CallbackQueryUpdate, MessageUpdate } from '@puregram/api'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'

import { CustomUpdate } from '../../src/dispatch/custom-updates'
import type { AnyUpdate, UpdateHandler } from '../../src/dispatch/on'
import { Telegram } from '../../src/telegram'

const STUB_BOT = { id: 1, is_bot: true, first_name: 'stub', username: 'stubbot' } as any

const messageUpdate = (text?: string) => ({
  kind: 'message',
  raw: { message_id: 1, date: 0, chat: { id: 100, type: 'private' }, text }
})

describe('tg.on predicate form', () => {
  it('fires the handler when a predicate returns truthy', async () => {
    const tg = new Telegram({ token: 'X', bot: STUB_BOT })
    const trace: string[] = []

    tg.onUpdate(
      update => update.kind === 'message',
      (update) => {
        trace.push(update.kind)
      }
    )

    await (tg as any).dispatch(messageUpdate('hi'))
    await (tg as any).dispatch({ kind: 'callback_query', raw: { id: '1' } })

    expect(trace).toEqual(['message'])
  })

  it('skips the handler when the predicate returns falsy', async () => {
    const tg = new Telegram({ token: 'X', bot: STUB_BOT })
    const handler = vi.fn()

    tg.onUpdate(() => false, handler)
    await (tg as any).dispatch(messageUpdate('hi'))

    expect(handler).not.toHaveBeenCalled()
  })

  it('predicate sees a CustomUpdate dispatched via tg.emit', async () => {
    const tg = new Telegram({ token: 'X', bot: STUB_BOT })
    const seen: AnyUpdate[] = []

    tg.defineUpdate('jobs')
    tg.onUpdate(
      update => update.kind === 'jobs',
      (update) => {
        seen.push(update)
      }
    )
    await tg.start()
    tg.emit('jobs', { jobId: 'a' })

    await new Promise(resolve => setImmediate(resolve))
    expect(seen).toHaveLength(1)
    expect(seen[0]).toBeInstanceOf(CustomUpdate)
    expect((seen[0] as CustomUpdate).kind).toBe('jobs')
  })

  it('routes predicate throws through onDispatchError', async () => {
    const tg = new Telegram({ token: 'X', bot: STUB_BOT })
    const errors: string[] = []

    tg.useHook('onDispatchError', (err) => {
      errors.push(err.message)
    })

    tg.onUpdate(() => {
      throw new Error('predicate boom')
    }, vi.fn())

    const callback = tg.getWebhookCallback()
    const noopRes = {
      writeHead: () => undefined,
      end: () => undefined
    } as any
    const req: any = { method: 'POST', headers: {} }

    req[Symbol.asyncIterator] = function * () {
      yield Buffer.from(JSON.stringify({
        update_id: 1,
        message: { message_id: 1, date: 0, chat: { id: 100, type: 'private' }, text: 'hi' }
      }))
    }

    await callback(req, noopRes)
    await new Promise(resolve => setImmediate(resolve))
    await new Promise(resolve => setImmediate(resolve))

    expect(errors).toEqual(['predicate boom'])
  })

  it('predicate handler does not receive updates from a kind handler path', async () => {
    const tg = new Telegram({ token: 'X', bot: STUB_BOT })
    const predicateSeen = vi.fn()
    const kindSeen = vi.fn()

    tg.onCallbackQuery(kindSeen)
    tg.onUpdate(
      update => update.kind === 'message',
      predicateSeen
    )

    await (tg as any).dispatch({ kind: 'callback_query', raw: { id: '1' } })
    expect(kindSeen).toHaveBeenCalledOnce()
    expect(predicateSeen).not.toHaveBeenCalled()
  })

  it('priority option places handlers in the correct group', async () => {
    const tg = new Telegram({ token: 'X', bot: STUB_BOT })
    const trace: string[] = []

    tg.onMessage(
      async (_u, next) => {
        trace.push('low')
        await next()
      },
      { priority: 'low' }
    )
    tg.onMessage(
      async (_u, next) => {
        trace.push('normal')
        await next()
      }
    )
    tg.onUpdate(
      u => u.kind === 'message',
      async (_u, next) => {
        trace.push('high')
        await next()
      },
      { priority: 'high' }
    )

    await (tg as any).dispatch(messageUpdate('hi'))
    expect(trace).toEqual(['high', 'normal', 'low'])
  })
})

describe('tg.on predicate types', () => {
  it('type-guard variant narrows handler arg', () => {
    const tg = new Telegram({ token: 'X', bot: STUB_BOT })
    const isMessage = (update: AnyUpdate): update is MessageUpdate => update.kind === 'message'

    tg.onUpdate(isMessage, (update) => {
      expectTypeOf(update).toEqualTypeOf<MessageUpdate>()
    })
  })

  it('plain-boolean variant keeps handler arg as AnyUpdate', () => {
    const tg = new Telegram({ token: 'X', bot: STUB_BOT })

    tg.onUpdate(
      (update): boolean => update.kind === 'message',
      (update) => {
        expectTypeOf(update).toEqualTypeOf<AnyUpdate>()
      }
    )
  })

  it('OnOptions.priority accepts only the literal union', () => {
    const tg = new Telegram({ token: 'X', bot: STUB_BOT })

    tg.onMessage(() => undefined, { priority: 'high' })
    tg.onMessage(() => undefined, { priority: 'normal' })
    tg.onMessage(() => undefined, { priority: 'low' })
    tg.onMessage(() => undefined, {})
    tg.onMessage(() => undefined)

    // @ts-expect-error — priority must be one of the literals
    tg.onMessage(() => undefined, { priority: 'urgent' })
  })

  it('non-existent per-kind dispatcher is a compile error', () => {
    const tg = new Telegram({ token: 'X', bot: STUB_BOT })

    // type-only check — never actually invoked, vitest just compiles the body.
    // pulling the method through a typed alias gates on the property existing
    function _typeCheck () {
      // @ts-expect-error — onNotARealKind is not a codegen'd dispatcher method
      const fn: (h: () => void) => unknown = tg.onNotARealKind.bind(tg)

      void fn
    }

    void _typeCheck
  })

  it('narrowed handler arg supports per-kind shortcuts', () => {
    const tg = new Telegram({ token: 'X', bot: STUB_BOT })
    const isCallbackQuery = (update: AnyUpdate): update is CallbackQueryUpdate =>
      update.kind === 'callback_query'

    tg.onUpdate(isCallbackQuery, (update) => {
      expectTypeOf(update).toEqualTypeOf<CallbackQueryUpdate>()
      // eslint-disable-next-line @typescript-eslint/unbound-method -- type-only check
      expectTypeOf(update.answer).toBeFunction()
    })
  })

  it('UpdateHandler<MessageUpdate> aligns with the type-guard form', () => {
    const handler: UpdateHandler<MessageUpdate> = (update) => {
      expectTypeOf(update).toEqualTypeOf<MessageUpdate>()
    }
    const tg = new Telegram({ token: 'X', bot: STUB_BOT })
    const isMessage = (update: AnyUpdate): update is MessageUpdate => update.kind === 'message'

    tg.onUpdate(isMessage, handler)
  })
})
