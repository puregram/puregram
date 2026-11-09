/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { runStream, type StreamApi } from '../src/core'

function makeMockApi () {
  const drafts: Record<string, unknown>[] = []
  const messages: Record<string, unknown>[] = []
  const api: StreamApi = {
    sendMessageDraft: vi.fn(async (params: Record<string, unknown>) => {
      drafts.push(params)

      return true
    }),
    sendMessage: vi.fn(async (params: Record<string, unknown>) => {
      messages.push(params)

      return {
        message_id: messages.length,
        date: 0,
        chat: { id: params.chat_id, type: 'private' as const }
      } as never
    })
  }

  return { api, drafts, messages }
}

async function * fromArray (items: readonly string[], delays?: readonly number[]) {
  for (let i = 0; i < items.length; i += 1) {
    if (delays && delays[i]) {
      await new Promise(resolve => setTimeout(resolve, delays[i]))
    }

    yield items[i]!
  }
}

describe('runStream — core state machine', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('coalesces drafts under a soft edit floor and finalizes with sendMessage', async () => {
    const { api, drafts, messages } = makeMockApi()

    const result = await runStream(api, {
      chatId: 1,
      source: fromArray(['hello', ' ', 'world']),
      draftIdOffset: 100,
      editIntervalMs: 5,
      thinkingPlaceholder: false
    })

    expect(messages).toHaveLength(1)
    expect(messages[0]!.text).toBe('hello world')
    expect(messages[0]!.chat_id).toBe(1)
    expect(drafts.length).toBeGreaterThanOrEqual(1)
    expect(result.pieces).toBe(3)
    expect(result.bytes).toBe('hello world'.length)
    expect(result.messages).toHaveLength(1)
    expect(result.aborted).toBe(false)
  })

  it('emits a thinking placeholder when enabled', async () => {
    const { api, drafts } = makeMockApi()

    await runStream(api, {
      chatId: 1,
      source: fromArray(['a']),
      draftIdOffset: 10,
      editIntervalMs: 0,
      thinkingPlaceholder: true
    })

    expect(drafts[0]).toMatchObject({ text: '', draft_id: 11 })
  })

  it('rolls over to a fresh draft after 4096 chars and finalizes each window separately', async () => {
    const { api, messages } = makeMockApi()

    const big = 'a'.repeat(4096)
    const tail = 'b'.repeat(100)

    await runStream(api, {
      chatId: 1,
      source: fromArray([big, tail]),
      draftIdOffset: 0,
      editIntervalMs: 0,
      thinkingPlaceholder: false
    })

    expect(messages).toHaveLength(2)
    expect((messages[0]!.text as string).length).toBe(4096)
    expect(messages[1]!.text).toBe(tail)
  })

  it('honors an AbortSignal and reports aborted=true', async () => {
    const { api } = makeMockApi()

    const controller = new AbortController()

    let counter = 0

    async function * source () {
      while (true) {
        if (controller.signal.aborted) {
          return
        }

        counter += 1

        if (counter === 3) {
          controller.abort()
        }

        yield 'x'

        await new Promise(resolve => setTimeout(resolve, 1))
      }
    }

    const result = await runStream(api, {
      chatId: 1,
      source: source(),
      draftIdOffset: 0,
      editIntervalMs: 0,
      thinkingPlaceholder: false,
      signal: controller.signal
    })

    expect(result.aborted).toBe(true)
  })

  it('propagates source errors via onError + rethrow after finalizing', async () => {
    const { api, messages } = makeMockApi()

    const boom = new Error('boom')

    async function * source () {
      yield 'partial'
      throw boom
    }

    const onError = vi.fn()

    await expect(runStream(api, {
      chatId: 1,
      source: source(),
      draftIdOffset: 0,
      editIntervalMs: 0,
      thinkingPlaceholder: false,
      onError
    })).rejects.toBe(boom)

    expect(onError).toHaveBeenCalledWith(boom)
    expect(messages).toHaveLength(1)
    expect(messages[0]!.text).toBe('partial')
  })

  it('invokes onPiece on every source yield with the draft id', async () => {
    const { api } = makeMockApi()

    const onPiece = vi.fn()

    await runStream(api, {
      chatId: 1,
      source: fromArray(['a', 'b']),
      draftIdOffset: 42,
      editIntervalMs: 0,
      thinkingPlaceholder: false,
      onPiece
    })

    expect(onPiece).toHaveBeenCalledTimes(2)
    expect(onPiece.mock.calls[0]![0]).toEqual({ text: 'a' })
    expect(onPiece.mock.calls[0]![1]).toBe(43)
  })

  it('invokes onDraftFinalized for each sendMessage', async () => {
    const { api } = makeMockApi()

    const onDraftFinalized = vi.fn()

    await runStream(api, {
      chatId: 1,
      source: fromArray(['a'.repeat(4096), 'tail']),
      draftIdOffset: 0,
      editIntervalMs: 0,
      thinkingPlaceholder: false,
      onDraftFinalized
    })

    expect(onDraftFinalized).toHaveBeenCalledTimes(2)
  })

  it('forwards reply_markup only to the terminal sendMessage', async () => {
    const { api, drafts, messages } = makeMockApi()

    await runStream(api, {
      chatId: 1,
      source: fromArray(['hi']),
      draftIdOffset: 7,
      editIntervalMs: 0,
      thinkingPlaceholder: false,
      reply_markup: { inline_keyboard: [] }
    })

    for (const draft of drafts) {
      expect(draft.reply_markup).toBeUndefined()
    }

    expect(messages[0]!.reply_markup).toEqual({ inline_keyboard: [] })
  })
})

describe('runStream — rich mode', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('finalizes with rich_message markdown and no text/entities', async () => {
    const { api, messages } = makeMockApi()

    await runStream(api, {
      chatId: 1,
      source: fromArray(['# hi', ' there']),
      draftIdOffset: 1,
      editIntervalMs: 0,
      thinkingPlaceholder: false,
      rich: 'markdown'
    })

    expect(messages).toHaveLength(1)
    expect(messages[0]!.rich_message).toEqual({ markdown: '# hi there' })
    expect(messages[0]!.text).toBeUndefined()
    expect(messages[0]!.entities).toBeUndefined()
  })

  it('rich: true defaults to the markdown dialect', async () => {
    const { api, messages } = makeMockApi()

    await runStream(api, {
      chatId: 1,
      source: fromArray(['x']),
      draftIdOffset: 1,
      editIntervalMs: 0,
      thinkingPlaceholder: false,
      rich: true
    })

    expect(messages[0]!.rich_message).toEqual({ markdown: 'x' })
  })

  it('html dialect routes to rich_message.html', async () => {
    const { api, messages } = makeMockApi()

    await runStream(api, {
      chatId: 1,
      source: fromArray(['<b>hi</b>']),
      draftIdOffset: 1,
      editIntervalMs: 0,
      thinkingPlaceholder: false,
      rich: 'html'
    })

    expect(messages[0]!.rich_message).toEqual({ html: '<b>hi</b>' })
  })

  it('drafts carry rich_message, never text', async () => {
    const { api, drafts } = makeMockApi()

    await runStream(api, {
      chatId: 1,
      source: fromArray(['hello', ' world']),
      draftIdOffset: 1,
      editIntervalMs: 5,
      thinkingPlaceholder: false,
      rich: 'markdown'
    })

    expect(drafts.length).toBeGreaterThanOrEqual(1)

    for (const draft of drafts) {
      expect(draft.text).toBeUndefined()
      expect((draft.rich_message as { markdown?: string }).markdown).toBeDefined()
    }
  })

  it('does not roll over at the 4096 text cap', async () => {
    const { api, messages } = makeMockApi()

    await runStream(api, {
      chatId: 1,
      source: fromArray(['a'.repeat(5000)]),
      draftIdOffset: 0,
      editIntervalMs: 0,
      thinkingPlaceholder: false,
      rich: 'markdown'
    })

    expect(messages).toHaveLength(1)
    expect((messages[0]!.rich_message as { markdown: string }).markdown.length).toBe(5000)
  })

  it('rolls over after 32768 chars', async () => {
    const { api, messages } = makeMockApi()

    await runStream(api, {
      chatId: 1,
      source: fromArray(['a'.repeat(32768), 'b'.repeat(50)]),
      draftIdOffset: 0,
      editIntervalMs: 0,
      thinkingPlaceholder: false,
      rich: 'markdown'
    })

    expect(messages).toHaveLength(2)
    expect((messages[0]!.rich_message as { markdown: string }).markdown.length).toBe(32768)
    expect((messages[1]!.rich_message as { markdown: string }).markdown).toBe('b'.repeat(50))
  })

  it('drops link_preview_options in rich mode', async () => {
    const { api, messages } = makeMockApi()

    await runStream(api, {
      chatId: 1,
      source: fromArray(['hi']),
      draftIdOffset: 0,
      editIntervalMs: 0,
      thinkingPlaceholder: false,
      rich: 'markdown',
      link_preview_options: { is_disabled: true }
    })

    expect(messages[0]!.link_preview_options).toBeUndefined()
    expect(messages[0]!.rich_message).toEqual({ markdown: 'hi' })
  })

  it('still forwards reply_parameters in rich mode', async () => {
    const { api, messages } = makeMockApi()

    await runStream(api, {
      chatId: 1,
      source: fromArray(['hi']),
      draftIdOffset: 0,
      editIntervalMs: 0,
      thinkingPlaceholder: false,
      rich: 'markdown',
      reply_parameters: { message_id: 99 }
    })

    expect(messages[0]!.reply_parameters).toEqual({ message_id: 99 })
  })

  it('emits an empty rich_message thinking placeholder', async () => {
    const { api, drafts } = makeMockApi()

    await runStream(api, {
      chatId: 1,
      source: fromArray(['a']),
      draftIdOffset: 10,
      editIntervalMs: 0,
      thinkingPlaceholder: true,
      rich: 'markdown'
    })

    expect(drafts[0]).toMatchObject({ rich_message: { markdown: '' }, draft_id: 11 })
  })

  it('throws when rich and parseMode are both set', async () => {
    const { api } = makeMockApi()

    await expect(runStream(api, {
      chatId: 1,
      source: fromArray(['hi']),
      draftIdOffset: 0,
      thinkingPlaceholder: false,
      rich: 'markdown',
      parseMode: 'HTML'
    })).rejects.toThrow(/mutually exclusive/)
  })
})

describe('runStream — runtimes without timers', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('sends a due draft on the next piece instead of sleeping, then finalizes the full text', async () => {
    let now = 10_000
    const gates = Array.from({ length: 4 }, () => Promise.withResolvers<void>())

    vi.spyOn(Date, 'now').mockImplementation(() => now)
    vi.stubGlobal('setTimeout', undefined)

    async function * pieces () {
      for (const [index, piece] of ['a', 'b', 'c'].entries()) {
        await gates[index]!.promise
        yield piece
      }

      await gates[3]!.promise
    }

    const { api, drafts, messages } = makeMockApi()
    const run = runStream(api, {
      chatId: 1,
      source: pieces(),
      draftIdOffset: 1,
      editIntervalMs: 1000,
      thinkingPlaceholder: true
    })

    for (const [index, at] of [10_100, 11_200, 11_300, 11_400].entries()) {
      await new Promise(resolve => setImmediate(resolve))
      now = at
      gates[index]!.resolve()
    }

    const result = await run

    expect(drafts.map(draft => draft.text)).toEqual(['', 'ab'])
    expect(messages.map(message => message.text)).toEqual(['abc'])
    expect(result.skipped).toBe(0)
  })
})
