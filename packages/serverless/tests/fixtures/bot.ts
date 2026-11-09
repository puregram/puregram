import type { MessageUpdate } from '@puregram/api'
import { callbackData, defineCallbackData } from '@puregram/callback-data'
import { bold, markup } from '@puregram/markup'
import { rateLimit } from '@puregram/rate-limit'
import { scenes, StepScene } from '@puregram/scenes'
import { createBot, EndpointError } from '@puregram/serverless'
import { TelegramStorage } from '@puregram/serverless/storage'
import { session } from '@puregram/session'
import { parseDeepLink, WebApp } from '@puregram/utils'
import { InlineKeyboard } from 'puregram/keyboards'
import { MediaSource } from 'puregram/runtime'

const Ack = defineCallbackData('serverless-ack').number('value')
const signup = new StepScene<Record<string, unknown>, MessageUpdate>('cold-scene', [
  async (message) => {
    if (message.scene.step.firstTime) {
      await message.send('scene:question')

      return
    }

    await message.send(`scene:${message.text}`)
    await message.scene.step.next()
  }
])
const tg = createBot({ debug: true })
  .extend(markup())
  .extend(session({ storage: new TelegramStorage({ table: 'sessions' }) }))
  .extend(scenes({ scenes: [signup] }))
  .extend(rateLimit({ storage: new TelegramStorage({ table: 'rate_limits' }) }))
  .extend(callbackData([Ack]))

tg.useHook('onRequestIntercept', async (ctx, next) => {
  if (ctx.url !== undefined || ctx.init !== undefined || ctx.response !== undefined) {
    throw new Error('serverless unexpectedly supplied HTTP state')
  }

  await next()
})

tg.useHook('onResponseIntercept', async (ctx, next) => {
  if (ctx.params.text === 'intercept') {
    ctx.json = { ok: true, result: { message_id: 99 } }
  }

  await next()
})

tg.onRawUpdate(async (raw) => {
  if (raw.update_id === 90) {
    throw new Error('raw handler failed')
  }

  await tg.api.call('recordUpdate', { update_id: raw.update_id })
})

tg.onMessage(async (message) => {
  if (message.text === '/scene') {
    await message.scene.enter('cold-scene')

    return
  }

  if (message.text === 'limited') {
    const retryAfter = await tg.rateLimit.check(message, { limit: 1, window: 60 })

    await message.send(retryAfter === null ? 'allowed' : 'limited')

    return
  }

  if (message.text?.startsWith('webapp:')) {
    const valid = WebApp.validate({ initData: message.text.slice(7), token: 'fixture-token' })

    await message.send(valid ? 'verified' : 'invalid')

    return
  }

  if (message.text === 'fail') {
    throw new Error('message handler failed')
  }

  if (message.text === 'api-error') {
    await message.send('reject')

    return
  }

  if (message.text === 'intercept') {
    const result = await message.send('intercept')

    if (result.message_id !== 99) {
      throw new Error('response interceptor replacement was ignored')
    }

    return
  }

  if (message.text === 'suppress') {
    const result = await tg.api.sendMessage({ chat_id: message.chat.id, text: 'reject', suppress: true })

    if (!('error_code' in result) || result.error_code !== 429) {
      throw new Error('API error was not preserved')
    }

    await message.send(String(result.parameters?.retry_after))

    return
  }

  if (message.text === 'upload') {
    await tg.api.call('sendDocument', {
      chat_id: message.chat.id,
      document: MediaSource.bytes(new Uint8Array([0, 1, 2, 3, 4]).subarray(1, 4), { filename: 'a.bin' })
    })

    return
  }

  if (message.text === 'fetch-upload' || message.text === 'fetch-missing') {
    const url = message.text === 'fetch-upload' ? 'https://example.com/cat.png' : 'https://example.com/missing.png'

    await tg.api.call('sendPhoto', {
      chat_id: message.chat.id,
      photo: MediaSource.url(url, { forceUpload: true, filename: 'cat.png' })
    })

    return
  }

  if (message.text === 'keyboard') {
    const base = InlineKeyboard.from({ inline_keyboard: [[{ text: 'a', callback_data: 'a' }], [{ text: 'b', callback_data: 'b' }]] })

    base.clone().delete('a')
    await message.send('keyboard', { reply_markup: base })

    return
  }

  if (message.text?.startsWith('deeplink:')) {
    await message.send(JSON.stringify(parseDeepLink(message.text.slice(9))))

    return
  }

  const previous = message.session.previous as string | undefined

  message.session.previous = message.text
  await message.send(bold(previous ?? 'first'), {
    reply_markup: InlineKeyboard.keyboard([
      [Ack.button({ text: 'ok', value: 7 })]
    ])
  })
})

tg.onCallbackQuery(Ack.filter, async (query) => {
  await query.answer({ text: `acknowledged:${query.payload.value}` })
})

tg.endpoint('echo', (input, ctx) => ({ ...input, user: ctx.initData.user?.id }))

tg.endpoint('refuse', () => {
  throw new EndpointError('refused', { code: 'NOPE' })
})

export default tg
