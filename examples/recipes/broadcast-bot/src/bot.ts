import { MemoryStorage } from '@puregram/storage'
import { throttler } from '@puregram/throttler'
import { Telegram, type MessageUpdate } from 'puregram'

import { broadcast } from './broadcast'
import { SubscriberStore } from './subscribers'

interface BotConfig {
  token: string
  adminUserId: number
}

export function createBot ({ token, adminUserId }: BotConfig) {
  const subscribers = new SubscriberStore(new MemoryStorage<unknown>())

  const telegram = Telegram.fromToken(token, {
    // reactive backstop — if the throttler misses a slot and we hit 429, sleep + retry
    retryOnFloodWait: { max: 3, maxWaitMs: 30_000 }
  }).extend(
    // proactive — keep us under telegram's 30/sec global limit
    throttler({
      globalPerSec: 28,
      perChatPerSec: 1,
      perGroupPerMin: 20
    })
  )

  telegram.onMessage(async (message, next) => {
    const fromId = message.from?.id

    if (fromId === undefined) {
      return next()
    }

    // every interacting user joins the subscriber list. cheap, idempotent
    await subscribers.add(fromId)

    if (message.text === '/start') {
      return message.send(
        'subscribed!\n\n'
        + `your user id: ${fromId}\n\n`
        + 'the admin will use this bot to broadcast announcements. send /stop to opt out at any time'
      )
    }

    if (message.text === '/stop') {
      await subscribers.remove(fromId)

      return message.send('unsubscribed — you won\'t receive future broadcasts')
    }

    if (message.text === '/stats' && fromId === adminUserId) {
      return message.send(`subscribers: ${await subscribers.size()}`)
    }

    if (message.text === '/broadcast') {
      return handleBroadcast(message, fromId, adminUserId, subscribers, telegram)
    }

    return next()
  })

  return { telegram, subscribers }
}

async function handleBroadcast (
  message: MessageUpdate,
  fromId: number,
  adminUserId: number,
  subscribers: SubscriberStore,
  telegram: Telegram
) {
  if (fromId !== adminUserId) {
    return message.send('not authorized')
  }

  const replyTo = message.raw.reply_to_message

  if (replyTo === undefined) {
    return message.send('reply to the message you want to broadcast, then send /broadcast')
  }

  const total = await subscribers.size()

  if (total === 0) {
    return message.send('no subscribers to broadcast to yet')
  }

  const progressMessage = await message.send(`broadcasting to ${total} subscribers...`)

  await broadcast({
    telegram,
    subscribers,
    source: { chatId: message.chatId!, messageId: replyTo.message_id },
    onProgress: async ({ sent, removed, failed, total }) => {
      const done = sent + removed + failed

      if (done === 0 || done === total) {
        return
      }

      try {
        await telegram.api.editMessageText({
          chat_id: progressMessage.chat.id,
          message_id: progressMessage.id,
          text: `broadcasting... ${done}/${total} (sent ${sent}, pruned ${removed}, failed ${failed})`
        })
      } catch {
        // edit can race when bursts land between throttler slots — non-fatal
      }
    }
  }).then((final) => {
    return telegram.api.editMessageText({
      chat_id: progressMessage.chat.id,
      message_id: progressMessage.id,
      text:
        `✓ broadcast complete\n\n`
        + `sent: ${final.sent}/${final.total}\n`
        + `pruned (blocked / deleted): ${final.removed}\n`
        + `failed (transient): ${final.failed}`
    })
  })
}
