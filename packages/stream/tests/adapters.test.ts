/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/brace-style */
import { EventEmitter } from 'node:events'

import { describe, expect, it } from 'vitest'

import {
  fromAnthropic, fromBytes, fromEventEmitter, fromLangChain, fromOllama,
  fromOpenAI, fromSSE, fromTextStream, fromVercelAI
} from '../src/adapters'

async function collect (source: AsyncIterable<string>) {
  const out: string[] = []

  for await (const chunk of source) {
    out.push(chunk)
  }

  return out
}

describe('adapters — named entry points', () => {
  it('fromOpenAI extracts choices[0].delta.content', async () => {
    async function * src () {
      yield { choices: [{ delta: { content: 'a' } }] }
      yield { choices: [{ delta: { content: 'b' } }] }
      yield { choices: [{ delta: {} }] }
    }

    expect(await collect(fromOpenAI(src()))).toEqual(['a', 'b'])
  })

  it('fromAnthropic extracts content_block_delta.delta.text', async () => {
    async function * src () {
      yield { type: 'message_start' }
      yield { type: 'content_block_delta', delta: { type: 'text_delta', text: 'hi' } }
      yield { type: 'content_block_delta', delta: { type: 'text_delta', text: '!' } }
    }

    expect(await collect(fromAnthropic(src()))).toEqual(['hi', '!'])
  })

  it('fromVercelAI surfaces .textStream', async () => {
    async function * inner () { yield 'x'; yield 'y' }

    expect(await collect(fromVercelAI({ textStream: inner() }))).toEqual(['x', 'y'])
  })

  it('fromOllama extracts message.content', async () => {
    async function * src () {
      yield { message: { content: 'foo' } }
      yield { message: { content: '' } }
      yield { message: { content: 'bar' } }
    }

    expect(await collect(fromOllama(src()))).toEqual(['foo', 'bar'])
  })

  it('fromLangChain handles strings and content objects and multimodal arrays', async () => {
    async function * src () {
      yield 'a'
      yield { content: 'b' }
      yield { content: [{ type: 'text', text: 'c' }, { type: 'image' }] }
    }

    expect(await collect(fromLangChain(src()))).toEqual(['a', 'b', 'c'])
  })

  it('fromTextStream drains a web ReadableStream', async () => {
    const stream = new ReadableStream<string>({
      start (controller) {
        controller.enqueue('foo')
        controller.enqueue('bar')
        controller.close()
      }
    })

    expect(await collect(fromTextStream(stream))).toEqual(['foo', 'bar'])
  })

  it('fromBytes decodes utf-8 chunks', async () => {
    async function * src () {
      yield new TextEncoder().encode('hello ')
      yield new TextEncoder().encode('world')
    }

    expect(await collect(fromBytes(src()))).toEqual(['hello ', 'world'])
  })

  it('fromBytes preserves a BOM, split multibyte characters and truncated final input', async () => {
    const bytes = new Uint8Array([0, 0xef, 0xbb, 0xbf, 0xe2, 0x82, 0xac, 0xe2, 0x82, 0])

    async function * src () {
      yield bytes.subarray(1, 2)
      yield bytes.subarray(2, 5)
      yield bytes.subarray(5, 8)
      yield bytes.subarray(8, 9)
    }

    expect((await collect(fromBytes(src()))).join('')).toBe('\ufeff€\ufffd')
  })

  it('fromBytes retains Node encoding semantics outside utf-8', async () => {
    async function * src () {
      yield new Uint8Array([0x41])
      yield new Uint8Array([0, 0x42, 0, 0x43])
    }

    expect((await collect(fromBytes(src(), 'utf16le'))).join('')).toBe('AB')
  })

  it('fromEventEmitter drains until end', async () => {
    const ee = new EventEmitter()
    const promise = collect(fromEventEmitter(ee))

    setTimeout(() => {
      ee.emit('text', 'one')
      ee.emit('text', 'two')
      ee.emit('end')
    }, 1)

    expect(await promise).toEqual(['one', 'two'])
  })

  it('fromEventEmitter rejects on error', async () => {
    const ee = new EventEmitter()
    const promise = collect(fromEventEmitter(ee))

    setTimeout(() => {
      ee.emit('text', 'partial')
      ee.emit('error', new Error('boom'))
    }, 1)

    await expect(promise).rejects.toThrow(/boom/)
  })
})

describe('adapters — server-sent events', () => {
  async function * bytes (text: string, cuts: readonly number[]) {
    const encoded = new TextEncoder().encode(text)
    let start = 0

    for (const cut of [...cuts, encoded.length]) {
      yield encoded.slice(start, cut)
      start = cut
    }
  }

  it('parses events split across chunk, line, crlf, and utf-8 boundaries', async () => {
    const body = [
      ': keep-alive',
      'event: content_block_delta',
      'data: {"type":"content_block_delta","delta":{"text":"при"}}',
      '',
      'data: {"type":"content_block_delta",',
      'data:"delta":{"text":"вет"}}',
      '',
      'data: {"type":"message_stop"}',
      '',
      'data: {"type":"content_block_delta","delta":{"text":"unterminated"}}'
    ].join('\r\n')
    const encoded = new TextEncoder().encode(body)
    const cuts = Array.from({ length: encoded.length - 1 }, (_, index) => index + 1)

    expect(await collect(fromAnthropic(fromSSE(bytes(body, cuts))))).toEqual(['при', 'вет'])
  })

  it('skips the [DONE] sentinel', async () => {
    const events: unknown[] = []

    for await (const event of fromSSE(bytes('data: {"a":1}\n\ndata: [DONE]\n\n', [7]))) {
      events.push(event)
    }

    expect(events).toEqual([{ a: 1 }])
  })
})
