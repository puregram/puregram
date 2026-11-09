import { widgets } from '@puregram/widgets'
import { Telegram } from 'puregram'

import { countdownArticle, parseCountdown, registerCountdown, USAGE as COUNTDOWN_USAGE } from './widgets/countdown'
import { registerHabit } from './widgets/habit'
import { parsePoll, pollArticle, registerPoll, USAGE as POLL_USAGE } from './widgets/poll'
import { registerTicker } from './widgets/ticker'
import { registerTtt } from './widgets/ttt'

interface BotConfig {
  token: string
  testDc: boolean
}

const COMMANDS = [
  { command: 'ticker', description: 'live TON / BTC / ETH prices' },
  { command: 'poll', description: 'a live poll: /poll question | option | option' },
  { command: 'ttt', description: 'tic-tac-toe: with a friend in a group, with me in private' },
  { command: 'habit', description: 'a streak tracker: /habit <name>' },
  { command: 'countdown', description: 'an event countdown with rsvp: /countdown <date> <title>' }
]

const MENU = [
  'telegram widgets, made with puregram:',
  '',
  ...COMMANDS.map(({ command, description }) => `/${command} — ${description}`),
  '',
  `examples:\n${POLL_USAGE}\n${COUNTDOWN_USAGE}\n/habit drink water`,
  '',
  'production: private chats only; widget messages are protected and cannot be forwarded or copied',
  'test DC only: inline polls and countdowns, groups and forwards'
].join('\n')

const SAMPLE_POLL = { question: 'tabs or spaces?', options: ['tabs', 'spaces', 'whatever the formatter says'] }

function inlineResults (text: string) {
  const now = new Date()
  const poll = text === '' ? SAMPLE_POLL : /^poll\s/i.test(text) ? parsePoll(text.slice(5)) : undefined
  const event = text === ''
    ? { title: 'new year', at: Date.UTC(now.getUTCFullYear() + 1, 0, 1) }
    : /^countdown\s/i.test(text) ? parseCountdown(text.slice(10)) : undefined

  return [
    ...poll === undefined ? [] : [pollArticle(poll)],
    ...event === undefined ? [] : [countdownArticle(event)]
  ]
}

export function createBot ({ token, testDc }: BotConfig) {
  const tg = Telegram.fromToken(token, {
    useTestDc: testDc,
    allowedUpdates: 'auto'
  }).extend(widgets({ autoAnswer: true }))

  tg.catch((error) => {
    console.error('handler failed:', error)
  })

  tg.command('start', message => message.send(MENU))

  tg.use(async (update, next) => {
    if (!testDc && update.is('message') && update.chat.type !== 'private') {
      await update.send('widgets are available only in private chats in production')

      return
    }

    return next()
  })

  registerTicker(tg)
  registerPoll(tg)
  registerTtt(tg)
  registerHabit(tg)
  registerCountdown(tg)

  if (testDc) {
    tg.onInlineQuery(query => query.answer(inlineResults(query.query.trim()), { cache_time: 0, is_personal: true }))
  }

  return { tg, commands: COMMANDS }
}
