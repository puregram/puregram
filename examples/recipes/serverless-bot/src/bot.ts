import { bold, format, markup } from '@puregram/markup'
import { createBot } from '@puregram/serverless'
import { TelegramStorage } from '@puregram/serverless/storage'
import { session } from '@puregram/session'
import { InlineKeyboard } from 'puregram/keyboards'

declare module '@puregram/session' {
  interface SessionData {
    lastText?: string
  }
}

const tg = createBot()
  .extend(markup())
  .extend(session({ storage: new TelegramStorage({ table: 'sessions' }) }))

tg.onMessage(async (message) => {
  const previous = message.session.lastText ?? '(none)'

  message.session.lastText = message.text ?? '(no text)'

  await message.send(format`${bold('previous message:')} ${previous}`, {
    reply_markup: InlineKeyboard.keyboard([
      [InlineKeyboard.textButton({ text: 'acknowledge', payload: 'ack' })]
    ])
  })
})

tg.callbackQuery('ack', async (query) => {
  await query.answer({ text: 'got it!' })
})

export default tg
