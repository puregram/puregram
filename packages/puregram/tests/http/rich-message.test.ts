import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Readable } from 'node:stream'

import { describe, it, expect, vi } from 'vitest'

import { runRequest } from '../../src/api/lifecycle'
import { HookRegistry } from '../../src/dispatch/hooks'
import type { HttpClient } from '../../src/http/client'
import { rewriteRichMessage } from '../../src/http/multipart'
import { MediaSource } from '../../src/media-source'
import { ReplySlot, replyAls } from '../../src/transport/webhook/reply'

const baseDeps = (httpClient: HttpClient) => ({
  options: {
    token: 'TEST',
    httpClient: undefined,
    apiBaseUrl: 'https://api.telegram.org/bot',
    apiTimeout: 5000,
    apiWait: 1000,
    apiRetryLimit: 0,
    apiHeaders: {},
    useTestDc: false,
    useLocal: false,
    allowedUpdates: []
  },
  hooks: new HookRegistry(),
  httpClient
})

const capturingClient = () => {
  const captured: { url: string, init: RequestInit }[] = []
  const httpClient: HttpClient = {
    request: vi.fn((input: { url: string, init: RequestInit }) => {
      captured.push(input)

      return Promise.resolve({ status: 200, json: () => Promise.resolve({ ok: true, result: true }) })
    })
  }

  return { captured, httpClient }
}

async function readParts (init: RequestInit) {
  const chunks: Buffer[] = []

  for await (const chunk of init.body as Readable) {
    chunks.push(Buffer.from(chunk as Uint8Array))
  }

  const raw = chunks.map(c => c.toString('latin1')).join('')
  const headers = init.headers as Record<string, string>
  const contentType = headers['Content-Type'] ?? headers['content-type']
  const boundary = /boundary=(.+)$/.exec(contentType)![1]

  return raw.split(`--${boundary}`).slice(1, -1).map((part) => {
    const [head, ...rest] = part.split('\r\n\r\n')

    return {
      name: /name="([^"]+)"/.exec(head)![1],
      filename: /filename="([^"]+)"/.exec(head)?.[1],
      body: rest.join('\r\n\r\n').replace(/\r\n$/, '')
    }
  })
}

describe('rewriteRichMessage', () => {
  it('substitutes file_id and url envelopes as raw strings without collecting files', async () => {
    const params = {
      chat_id: 1,
      rich_message: {
        blocks: [
          { type: 'photo', photo: { type: 'photo', media: MediaSource.fileId('abc') } },
          {
            type: 'blockquote',
            blocks: [{ type: 'video', video: { type: 'video', media: MediaSource.url('https://x/y.mp4') } }]
          }
        ]
      }
    }

    const { params: out, files } = await rewriteRichMessage(params)

    expect(files.size).toBe(0)
    expect(out.rich_message).toEqual({
      blocks: [
        { type: 'photo', photo: { type: 'photo', media: 'abc' } },
        {
          type: 'blockquote',
          blocks: [{ type: 'video', video: { type: 'video', media: 'https://x/y.mp4' } }]
        }
      ]
    })
  })

  it('unwraps RichLike before rewriting', async () => {
    const rich = { toInputRichMessage: () => ({ html: '<b>hi</b>' }) }

    const { params, files } = await rewriteRichMessage({ chat_id: 1, rich_message: rich })

    expect(files.size).toBe(0)
    expect(params.rich_message).toEqual({ html: '<b>hi</b>' })
  })

  it('returns the same params reference when rich_message is absent', async () => {
    const params = { chat_id: 1, text: 'hi' }

    const { params: out, files } = await rewriteRichMessage(params)

    expect(out).toBe(params)
    expect(files.size).toBe(0)
  })

  it('does not mistake rich text url nodes for media envelopes', async () => {
    const params = {
      chat_id: 1,
      rich_message: {
        blocks: [{ type: 'paragraph', text: { type: 'url', text: 'link', url: 'https://x' } }]
      }
    }

    const { params: out, files } = await rewriteRichMessage(params)

    expect(out).toBe(params)
    expect(files.size).toBe(0)
  })
})

describe('runRequest — rich_message', () => {
  it('sends file_id/url substitutions as plain json, no multipart', async () => {
    const { captured, httpClient } = capturingClient()

    await runRequest(baseDeps(httpClient), 'sendRichMessage', {
      chat_id: 1,
      rich_message: {
        blocks: [{ type: 'photo', photo: { type: 'photo', media: MediaSource.fileId('abc') } }]
      }
    })

    expect(captured).toHaveLength(1)
    expect(captured[0].init.method).toBe('GET')

    const query = new URL(captured[0].url).searchParams

    expect(JSON.parse(query.get('rich_message')!)).toEqual({
      blocks: [{ type: 'photo', photo: { type: 'photo', media: 'abc' } }]
    })
  })

  it('uploads buffer and path envelopes from blocks and media[] via multipart', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'puregram-rich-'))
    const filePath = join(dir, 'clip.mp4')

    await writeFile(filePath, 'vid-bytes')

    const { captured, httpClient } = capturingClient()

    await runRequest(baseDeps(httpClient), 'sendRichMessage', {
      chat_id: 1,
      rich_message: {
        blocks: [
          {
            type: 'photo',
            photo: { type: 'photo', media: MediaSource.buffer(Buffer.from('img-bytes'), { filename: 'pic.png' }) }
          }
        ],
        media: [{
          id: 'vid1',
          media: {
            type: 'video',
            media: MediaSource.path(filePath),
            thumbnail: MediaSource.buffer(Buffer.from('thumb-bytes'), { filename: 'thumb.jpg' })
          }
        }]
      }
    })

    expect(captured).toHaveLength(1)
    expect(captured[0].init.method).toBe('POST')

    const parts = await readParts(captured[0].init)
    const richPart = parts.find(p => p.name === 'rich_message')

    expect(richPart).toBeDefined()

    const rich = JSON.parse(richPart!.body) as {
      blocks: [{ photo: { media: string } }]
      media: [{ media: { media: string, thumbnail: string } }]
    }

    const photoRef = rich.blocks[0].photo.media
    const videoRef = rich.media[0].media.media
    const thumbRef = rich.media[0].media.thumbnail

    expect(photoRef).toMatch(/^attach:\/\/[0-9a-f]{16}$/)
    expect(videoRef).toMatch(/^attach:\/\/[0-9a-f]{16}$/)
    expect(thumbRef).toMatch(/^attach:\/\/[0-9a-f]{16}$/)

    const photoPart = parts.find(p => p.name === photoRef.slice('attach://'.length))
    const videoPart = parts.find(p => p.name === videoRef.slice('attach://'.length))
    const thumbPart = parts.find(p => p.name === thumbRef.slice('attach://'.length))

    expect(photoPart).toMatchObject({ filename: 'pic.png', body: 'img-bytes' })
    expect(videoPart).toMatchObject({ filename: 'clip.mp4', body: 'vid-bytes' })
    expect(thumbPart).toMatchObject({ filename: 'thumb.jpg', body: 'thumb-bytes' })

    const chatPart = parts.find(p => p.name === 'chat_id')

    expect(chatPart?.body).toBe('1')
  })

  it('claims the webhook reply slot with rewritten params when no upload is needed', async () => {
    const { captured, httpClient } = capturingClient()
    const slot = new ReplySlot()

    await replyAls.run(slot, () =>
      runRequest(baseDeps(httpClient), 'sendRichMessageDraft', {
        chat_id: 1,
        rich_message: {
          blocks: [{ type: 'photo', photo: { type: 'photo', media: MediaSource.fileId('abc') } }]
        }
      }))

    expect(captured).toHaveLength(0)
    expect(slot.consumed).toBe(true)
    expect(slot.payload?.params.rich_message).toEqual({
      blocks: [{ type: 'photo', photo: { type: 'photo', media: 'abc' } }]
    })
  })

  it('lets a request hook rewrite params before the webhook reply is claimed', async () => {
    const { httpClient } = capturingClient()
    const deps = baseDeps(httpClient)
    const slot = new ReplySlot()

    deps.hooks.add('onBeforeRequest', (ctx, next) => {
      ctx.params = { ...ctx.params, text: 'rewritten' }

      return next()
    })

    await replyAls.run(slot, () => runRequest(deps, 'sendMessageDraft', { chat_id: 1, text: 'original' }))

    expect(slot.consumed).toBe(true)
    expect(slot.payload?.params.text).toBe('rewritten')
  })

  it('skips the webhook reply slot when the rich message carries uploads', async () => {
    const { captured, httpClient } = capturingClient()
    const slot = new ReplySlot()

    await replyAls.run(slot, () =>
      runRequest(baseDeps(httpClient), 'sendRichMessageDraft', {
        chat_id: 1,
        rich_message: {
          blocks: [
            {
              type: 'photo',
              photo: { type: 'photo', media: MediaSource.buffer(Buffer.from('img'), { filename: 'a.png' }) }
            }
          ]
        }
      }))

    expect(slot.consumed).toBe(false)
    expect(captured).toHaveLength(1)
    expect(captured[0].init.method).toBe('POST')
  })
})

describe('rewriteRichMessage — hostile shapes', () => {
  it('rejects circular rich_message objects instead of exhausting memory', async () => {
    const cyclic: Record<string, unknown> = { blocks: [] }

    cyclic.self = cyclic

    await expect(rewriteRichMessage({ rich_message: cyclic })).rejects.toThrow('circular')
  })

  it('accepts the same object reused in two acyclic positions', async () => {
    const caption = { text: 'shared' }
    const message = {
      blocks: [
        { type: 'photo', photo: { type: 'photo', media: 'https://x.test/a.jpg' }, caption },
        { type: 'video', video: { type: 'video', media: 'https://x.test/a.mp4' }, caption }
      ]
    }

    const { params } = await rewriteRichMessage({ rich_message: message })

    expect(params.rich_message).toBe(message)
  })
})
