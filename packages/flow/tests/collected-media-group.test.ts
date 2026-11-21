import { BusinessMessageUpdate, MessageUpdate, type TelegramLike, type TelegramMessageId } from '@puregram/api'
import { describe, expect, it, vi } from 'vitest'

import { CollectedMediaGroup } from '../src'

function setup () {
  const result: TelegramMessageId[] = [{ message_id: 101 }, { message_id: 103 }]
  const api = {
    forwardMessages: vi.fn().mockResolvedValue(result),
    copyMessages: vi.fn().mockResolvedValue(result),
    deleteMessages: vi.fn().mockResolvedValue(true),
    deleteBusinessMessages: vi.fn().mockResolvedValue(true)
  }
  const tg = { api } as unknown as TelegramLike
  const message = (id: number, chat = -100) => new MessageUpdate({
    message_id: id,
    date: 0,
    chat: { id: chat, type: 'supergroup', title: 'source' },
    media_group_id: 'album'
  }, tg)

  const business = (id: number, connection: string) => new BusinessMessageUpdate({
    ...message(id).raw,
    business_connection_id: connection
  }, tg)

  return { api, result, message, business }
}

describe('CollectedMediaGroup', () => {
  it('preserves array behavior without creating albums for map and filter', () => {
    const { message } = setup()
    const first = message(30)
    const second = message(10)
    const album = new CollectedMediaGroup(first, second)

    expect(album).toBeInstanceOf(Array)
    expect(album.contexts).toBe(album)
    expect(album.length).toBe(2)
    expect(album[0]).toBe(first)
    expect([...album]).toEqual([first, second])
    expect(album.map(item => item.raw.message_id)).toEqual([30, 10])
    expect(album.map(item => item.raw.message_id)).not.toBeInstanceOf(CollectedMediaGroup)
    expect(album.filter(item => item === second)).toEqual([second])
    expect(album.filter(() => true)).not.toBeInstanceOf(CollectedMediaGroup)
  })

  it('forwards once from the actual source to the destination with sorted ids and raw results', async () => {
    const { api, result, message } = setup()
    const album = new CollectedMediaGroup(message(30), message(2), message(10), message(2))
    const options = { message_thread_id: 77, disable_notification: true, protect_content: true }

    expect(await album.forward('@destination', options)).toBe(result)
    expect(api.forwardMessages).toHaveBeenCalledTimes(1)
    expect(api.forwardMessages).toHaveBeenCalledWith({
      ...options,
      chat_id: '@destination',
      from_chat_id: -100,
      message_ids: [2, 10, 30]
    })
    expect(album.map(item => item.raw.message_id)).toEqual([30, 2, 10, 2])
    expect(api.copyMessages).not.toHaveBeenCalled()
    expect(api.deleteMessages).not.toHaveBeenCalled()
  })

  it('copies once with destination options and returns raw message ids', async () => {
    const { api, result, message } = setup()
    const album = new CollectedMediaGroup(message(30), message(2), message(30))
    const options = { direct_messages_topic_id: 88, remove_caption: true, disable_notification: true }

    expect(await album.copy(500, options)).toBe(result)
    expect(api.copyMessages).toHaveBeenCalledTimes(1)
    expect(api.copyMessages).toHaveBeenCalledWith({
      ...options,
      chat_id: 500,
      from_chat_id: -100,
      message_ids: [2, 30]
    })
  })

  it('deletes once in the source chat and returns true', async () => {
    const { api, message } = setup()
    const album = new CollectedMediaGroup(message(30), message(2), message(2))

    expect(await album.delete()).toBe(true)
    expect(api.deleteMessages).toHaveBeenCalledTimes(1)
    expect(api.deleteMessages).toHaveBeenCalledWith({ chat_id: -100, message_ids: [2, 30] })
  })

  it('deletes business messages on the source connection and refuses to copy or forward them', async () => {
    const { api, business } = setup()
    const album = new CollectedMediaGroup(business(30, 'bc'), business(2, 'bc'), business(2, 'bc'))

    await expect(album.forward(500)).rejects.toThrow(TypeError)
    await expect(album.copy(500)).rejects.toThrow(TypeError)

    for (const method of Object.values(api)) {
      expect(method).not.toHaveBeenCalled()
    }

    await expect(album.delete()).resolves.toBe(true)
    expect(api.deleteBusinessMessages).toHaveBeenCalledTimes(1)
    expect(api.deleteBusinessMessages).toHaveBeenCalledWith({ business_connection_id: 'bc', message_ids: [2, 30] })
    expect(api.deleteMessages).not.toHaveBeenCalled()
  })

  it.each(['business', 'ordinary'] as const)('rejects mixing a business album with another %s source', async (kind) => {
    const { api, business, message } = setup()
    const album = new CollectedMediaGroup(business(1, 'first'), kind === 'ordinary' ? message(2) : business(2, 'second'))

    await expect(album.delete()).rejects.toThrow(TypeError)
    await expect(album.copy(500)).rejects.toThrow(TypeError)
    await expect(album.forward(500)).rejects.toThrow(TypeError)

    for (const method of Object.values(api)) {
      expect(method).not.toHaveBeenCalled()
    }
  })

  it.each(['empty', 'mixed chats', 'mixed clients'] as const)('rejects %s before any API call', async (kind) => {
    const { api, message } = setup()
    const other = setup()
    const album = kind === 'empty'
      ? new CollectedMediaGroup()
      : new CollectedMediaGroup(message(1), kind === 'mixed chats' ? message(2, -200) : other.message(2))

    await expect(album.forward(500)).rejects.toThrow(TypeError)
    await expect(album.copy(500)).rejects.toThrow(TypeError)
    await expect(album.delete()).rejects.toThrow(TypeError)

    for (const method of [...Object.values(api), ...Object.values(other.api)]) {
      expect(method).not.toHaveBeenCalled()
    }
  })

  it('validates the current contents after mutation', async () => {
    const { api, message } = setup()
    const album = new CollectedMediaGroup(message(1))

    album.push(message(2, -200))

    await expect(album.delete()).rejects.toThrow(TypeError)
    expect(api.deleteMessages).not.toHaveBeenCalled()
  })

  it('propagates API failures without a fallback result', async () => {
    const { api, message } = setup()
    const error = new Error('telegram rejected album')
    const album = new CollectedMediaGroup(message(1))

    api.copyMessages.mockRejectedValueOnce(error)

    await expect(album.copy(500)).rejects.toBe(error)
    expect(api.copyMessages).toHaveBeenCalledTimes(1)
  })
})
