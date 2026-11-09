import { hasText, kind, MessageUpdate, type TelegramLike, type TelegramMessage } from '@puregram/api'
import type { TelegramCore } from 'puregram/runtime'
import type { Telegram } from 'puregram'

declare function expectType<T> (value: T): void

declare const node: Telegram
declare const portable: TelegramCore
declare const portableClient: TelegramLike
declare const payload: TelegramMessage

const nodeMessage = new MessageUpdate(payload, node)
const portableMessage = new MessageUpdate(payload, portableClient)

expectType<Promise<Uint8Array | null>>(nodeMessage.download())
expectType<Promise<Uint8Array | null>>(portableMessage.download())
expectType<Promise<Buffer>>(node.download('file'))
expectType<Promise<Uint8Array>>(portableClient.download('file'))

if (nodeMessage.hasMessageThreadId()) {
  expectType<Promise<Uint8Array>>(nodeMessage.thread.tg.download('file'))
}

if (portableMessage.hasMessageThreadId()) {
  expectType<Promise<Uint8Array>>(portableMessage.thread.tg.download('file'))
}

node.onMessage(async (message) => {
  const bytes = await message.download()

  expectType<Uint8Array | null>(bytes)
  // @ts-expect-error
  bytes?.equals(Buffer.from('bytes'))
  expectType<Promise<Uint8Array>>(message.tg.download('file'))
  const direct = await node.download('file')

  direct.equals(Buffer.from('bytes'))
})

node.onMessage(hasText, async (message) => {
  expectType<string>(message.text)
  expectType<Promise<Uint8Array | null>>(message.download())
})

node.onUpdate(kind.message.and(hasText), async (message) => {
  expectType<string>(message.text)
  expectType<Promise<Uint8Array | null>>(message.download())
  expectType<Promise<Buffer>>(node.download('file'))
})

node.onUpdate((update) => {
  if (update.is('message')) {
    expectType<Promise<Uint8Array | null>>(update.download())
  }
})

node.command('file', (message) => {
  expectType<Promise<Uint8Array | null>>(message.download())
})

node.use(kind.message, (message) => {
  expectType<Promise<Uint8Array | null>>(message.download())
})

node.callbackQuery('file', (query) => {
  expectType<Promise<Uint8Array>>(query.tg.download('file'))
})

portable.callbackQuery('file', (query) => {
  expectType<Promise<Uint8Array>>(query.tg.download('file'))
})

portable.onMessage(async (message) => {
  const bytes = await message.download()

  expectType<Uint8Array | null>(bytes)
  // @ts-expect-error
  bytes?.equals(new Uint8Array())
  // @ts-expect-error
  expectType<Promise<Buffer>>(message.tg.download('file'))
})

portable.onUpdate(kind.message.and(hasText), async (message) => {
  expectType<string>(message.text)
  const bytes = await message.download()

  // @ts-expect-error
  bytes?.readUInt32LE(0)
})

portable.onUpdate((update) => {
  if (update.is('message')) {
    // @ts-expect-error
    expectType<Promise<Buffer | null>>(update.download())
  }
})
