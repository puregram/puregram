import { MemoryStorage } from '@puregram/storage'
import { describe, expect, it, vi } from 'vitest'

import { CollectedMediaGroup, flow } from '../../src'
import type { PersistedFlow } from '../../src/persistent/types'
import { makeTg } from '../helpers/make-tg'
import { makeUpdate } from '../helpers/make-update'
import { waitUntil } from '../helpers/wait-until'

describe('@puregram/flow — e2e', () => {
  it('waitFor resolves on the next matching update from polling', async () => {
    const { tg, mock } = await makeTg(t => t.extend(flow()))

    let pulls = 0

    mock.expect('getUpdates', () => {
      pulls++

      if (pulls === 1) {
        return {
          ok: true,
          result: [
            { update_id: 1, message: { message_id: 1, date: 0, chat: { id: 100, type: 'private' }, text: 'hello' } }
          ]
        }
      }

      return { ok: true, result: [] }
    })

    await tg.start()

    const startPromise = tg.startPolling()
    const matched = await tg.flow.waitFor('message')

    tg.stopPolling()
    await startPromise

    expect(matched?.kind).toBe('message')
    expect(matched?.raw.text).toBe('hello')

    await mock.stop()
  })

  it('prompt sends + waits for the user reply', async () => {
    const { tg, mock } = await makeTg(t => t.extend(flow()))

    mock.expect('sendMessage', params => ({
      ok: true,
      result: { message_id: 99, date: 0, chat: { id: params.chat_id, type: 'private' }, text: params.text }
    }))

    let pulls = 0

    mock.expect('getUpdates', () => {
      pulls++

      if (pulls === 1) {
        return {
          ok: true,
          result: [
            {
              update_id: 1,
              message: {
                message_id: 2,
                date: 0,
                from: { id: 7, is_bot: false, first_name: 'a' },
                chat: { id: 100, type: 'private' },
                text: 'alice'
              }
            }
          ]
        }
      }

      return { ok: true, result: [] }
    })

    await tg.start()

    const startPromise = tg.startPolling()
    const reply = await tg.flow.prompt(100, 'name?', { from: 7 })

    tg.stopPolling()
    await startPromise

    expect(reply?.raw.text).toBe('alice')

    await mock.stop()
  })

  it('message.flow.collectMediaGroup assembles every message in the album', async () => {
    const { tg, mock } = await makeTg(t => t.extend(flow({ mediaGroupWindow: 100 })))

    let pulls = 0

    mock.expect('getUpdates', () => {
      pulls++

      if (pulls === 1) {
        return {
          ok: true,
          result: [
            {
              update_id: 1,
              message: {
                message_id: 1,
                date: 0,
                chat: { id: 100, type: 'private' },
                text: 'a',
                media_group_id: 'album-1'
              }
            },
            {
              update_id: 2,
              message: {
                message_id: 2,
                date: 0,
                chat: { id: 100, type: 'private' },
                text: 'b',
                media_group_id: 'album-1'
              }
            },
            {
              update_id: 3,
              message: {
                message_id: 3,
                date: 0,
                chat: { id: 100, type: 'private' },
                text: 'c',
                media_group_id: 'album-1'
              }
            }
          ]
        }
      }

      return { ok: true, result: [] }
    })

    const state: { assembled?: CollectedMediaGroup, copied?: Record<string, unknown> } = {}

    mock.expect('copyMessages', (params) => {
      state.copied = params

      return { ok: true, result: [{ message_id: 40 }, { message_id: 41 }, { message_id: 42 }] }
    })
    const seenMessageIds: number[] = []

    // every album message reaches `tg.on('message')` (no suppression). only the
    // first handler invocation actually proceeds with the assembled album to
    // avoid acting N times per group
    tg.on('message', async (message) => {
      seenMessageIds.push(message.raw.message_id)

      if (message.mediaGroupId === undefined) {
        return
      }

      const group = await message.flow.collectMediaGroup()

      if (group[0] !== message) {
        return
      }

      await group.copy(200)
      state.assembled = group
    })

    await tg.start()

    const polling = tg.startPolling()

    await waitUntil(() => state.assembled !== undefined)

    tg.stopPolling()
    await polling
    await tg.shutdown()

    expect(seenMessageIds).toEqual([1, 2, 3])
    expect(state.assembled).toBeInstanceOf(CollectedMediaGroup)
    expect(state.assembled?.map(message => message.id)).toEqual([1, 2, 3])
    expect(state.copied).toEqual({ chat_id: 200, from_chat_id: 100, message_ids: [1, 2, 3] })

    await mock.stop()
  })

  it('collectMediaGroup resolves immediately with [message] when no media_group_id is set', async () => {
    const { tg, mock } = await makeTg(t => t.extend(flow()))
    let pulls = 0

    mock.expect('getUpdates', () => {
      if (pulls++ > 0) {
        return { ok: true, result: [] }
      }

      return {
        ok: true,
        result: [
          { update_id: 1, message: { message_id: 1, date: 0, chat: { id: 100, type: 'private' }, text: 'plain' } }
        ]
      }
    })

    const state: { resolved?: CollectedMediaGroup, deleted?: Record<string, unknown> } = {}

    mock.expect('deleteMessages', (params) => {
      state.deleted = params

      return { ok: true, result: true }
    })

    tg.on('message', async (message) => {
      const group = await message.flow.collectMediaGroup()

      await group.delete()
      state.resolved = group
    })

    await tg.start()

    const polling = tg.startPolling()

    await waitUntil(() => state.resolved !== undefined)

    tg.stopPolling()
    await polling
    await tg.shutdown()

    expect(state.resolved).toBeInstanceOf(CollectedMediaGroup)
    expect(state.resolved?.map(message => message.text)).toEqual(['plain'])
    expect(state.deleted).toEqual({ chat_id: 100, message_ids: [1] })

    await mock.stop()
  })

  it('prompt resolves when called from inside a tg.on handler (no polling deadlock)', async () => {
    const { tg, mock } = await makeTg(t => t.extend(flow()))

    mock.expect('sendMessage', params => ({
      ok: true,
      result: { message_id: 99, date: 0, chat: { id: params.chat_id, type: 'private' }, text: params.text }
    }))

    let pulls = 0

    mock.expect('getUpdates', () => {
      pulls++

      if (pulls === 1) {
        return {
          ok: true,
          result: [
            { update_id: 1, message: { message_id: 1, date: 0, chat: { id: 100, type: 'private' }, text: '/ask' } }
          ]
        }
      }

      if (pulls === 2) {
        return {
          ok: true,
          result: [
            { update_id: 2, message: { message_id: 2, date: 0, chat: { id: 100, type: 'private' }, text: 'alice' } }
          ]
        }
      }

      return { ok: true, result: [] }
    })

    let resolvedReply: any = null

    tg.on('message', async (msg) => {
      if (msg.raw.text !== '/ask') {
        return
      }

      // awaited prompt from inside a handler — must not deadlock
      resolvedReply = await tg.flow.prompt(msg.raw.chat.id, 'name?')
    })

    await tg.start()

    tg.startPolling().catch(() => {})

    await waitUntil(() => resolvedReply !== null)

    tg.stopPolling()

    expect(resolvedReply).not.toBeNull()
    expect(resolvedReply.raw.text).toBe('alice')

    await mock.stop()
  })

  it('update.flow.prompt auto-fills chat + sender from the source message', async () => {
    const { tg, mock } = await makeTg(t => t.extend(flow()))

    mock.expect('sendMessage', params => ({
      ok: true,
      result: { message_id: 99, date: 0, chat: { id: params.chat_id, type: 'private' }, text: params.text }
    }))

    let pulls = 0

    mock.expect('getUpdates', () => {
      pulls++

      if (pulls === 1) {
        return {
          ok: true,
          result: [
            {
              update_id: 1,
              message: {
                message_id: 1,
                date: 0,
                from: { id: 7, is_bot: false, first_name: 'a' },
                chat: { id: 100, type: 'private' },
                text: '/ask'
              }
            }
          ]
        }
      }

      // intentionally include a second message from a different sender — it must
      // NOT match the prompt because the augment middleware pinned `from: 7`
      if (pulls === 2) {
        return {
          ok: true,
          result: [
            {
              update_id: 2,
              message: {
                message_id: 2,
                date: 0,
                from: { id: 8, is_bot: false, first_name: 'b' },
                chat: { id: 100, type: 'private' },
                text: 'wrong sender'
              }
            }
          ]
        }
      }

      if (pulls === 3) {
        return {
          ok: true,
          result: [
            {
              update_id: 3,
              message: {
                message_id: 3,
                date: 0,
                from: { id: 7, is_bot: false, first_name: 'a' },
                chat: { id: 100, type: 'private' },
                text: 'alice'
              }
            }
          ]
        }
      }

      return { ok: true, result: [] }
    })

    let resolvedReply: any = null

    tg.on('message', async (msg) => {
      if (msg.raw.text !== '/ask') {
        return
      }

      resolvedReply = await msg.flow.prompt('name?')
    })

    await tg.start()

    tg.startPolling().catch(() => {})

    await waitUntil(() => resolvedReply !== null)

    tg.stopPolling()

    expect(resolvedReply).not.toBeNull()
    expect(resolvedReply.raw.text).toBe('alice')
    expect(resolvedReply.raw.from.id).toBe(7)

    await mock.stop()
  })

  it('update.flow.waitFor scopes by chat (match: "chat") and matches a callback_query in same chat', async () => {
    const { tg, mock } = await makeTg(t => t.extend(flow()))

    let pulls = 0

    mock.expect('getUpdates', () => {
      pulls++

      if (pulls === 1) {
        return {
          ok: true,
          result: [
            {
              update_id: 1,
              message: {
                message_id: 1,
                date: 0,
                from: { id: 7, is_bot: false, first_name: 'a' },
                chat: { id: 100, type: 'private' },
                text: '/wait'
              }
            }
          ]
        }
      }

      // callback_query from a different chat — must not match
      if (pulls === 2) {
        return {
          ok: true,
          result: [
            {
              update_id: 2,
              callback_query: {
                id: 'cq-other',
                from: { id: 9, is_bot: false, first_name: 'c' },
                message: { message_id: 1, date: 0, chat: { id: 999, type: 'private' } },
                chat_instance: 'inst',
                data: 'red'
              }
            }
          ]
        }
      }

      if (pulls === 3) {
        return {
          ok: true,
          result: [
            {
              update_id: 3,
              callback_query: {
                id: 'cq-match',
                from: { id: 8, is_bot: false, first_name: 'b' },
                message: { message_id: 1, date: 0, chat: { id: 100, type: 'private' } },
                chat_instance: 'inst',
                data: 'blue'
              }
            }
          ]
        }
      }

      return { ok: true, result: [] }
    })

    let resolvedCq: any = null

    tg.on('message', async (msg) => {
      if (msg.raw.text !== '/wait') {
        return
      }

      resolvedCq = await msg.flow.waitFor('callback_query', { match: 'chat' })
    })

    await tg.start()

    tg.startPolling().catch(() => {})

    await waitUntil(() => resolvedCq !== null)

    tg.stopPolling()

    expect(resolvedCq).not.toBeNull()
    expect(resolvedCq.raw.id).toBe('cq-match')
    expect(resolvedCq.raw.data).toBe('blue')

    await mock.stop()
  })

  it('waitFor("message") still resolves on a plain (non-album) message', async () => {
    const { tg, mock } = await makeTg(t => t.extend(flow({ mediaGroupWindow: 100 })))

    let pulls = 0

    mock.expect('getUpdates', () => {
      pulls++

      if (pulls === 1) {
        return {
          ok: true,
          result: [
            { update_id: 1, message: { message_id: 1, date: 0, chat: { id: 100, type: 'private' }, text: 'plain' } }
          ]
        }
      }

      return { ok: true, result: [] }
    })

    await tg.start()

    const startPromise = tg.startPolling()
    const matched = await tg.flow.waitFor('message')

    tg.stopPolling()
    await startPromise

    expect(matched?.raw.text).toBe('plain')

    await mock.stop()
  })
})

describe('persistent flow e2e', () => {
  it('ephemeral and persistent waiters coexist on the same Telegram', async () => {
    const storage = new MemoryStorage<PersistedFlow>()
    const { tg, mock } = await makeTg(t => t.extend(flow({ storage })))

    await tg.start()

    ;(tg as { send: unknown }).send = vi.fn().mockResolvedValue({ message_id: 1 })

    const onPersistent = vi.fn()

    tg.flow.handle('persistent', { onAnswer: onPersistent })

    await tg.flow.prompt(100, 'persistent', { id: 'persistent', from: 9 })

    expect(await storage.has('100:9:message')).toBe(true)

    // an unrelated chat triggers an ephemeral prompt — different (chat, user, kind) triple
    const ephemeral = tg.flow.prompt(200, 'ephemeral')

    await new Promise(resolve => setImmediate(resolve))

    const dispatch = (tg as unknown as { dispatch: (u: unknown) => Promise<void> }).dispatch.bind(tg)

    await dispatch(makeUpdate('message', { chat: { id: 200 }, text: 'hi' }))

    const ephemResult = await ephemeral

    // ephemeral path returns the raw matched update; chat is on the synthetic update body
    expect((ephemResult as { chat: { id: number } }).chat.id).toBe(200)

    // and the persistent record is still open
    expect(await storage.has('100:9:message')).toBe(true)

    await tg.shutdown()
    await mock.stop()
  })
})
