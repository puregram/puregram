import { createBot } from './bot'

const token = process.env.BOT_TOKEN

if (token === undefined || token === '') {
  console.error('set BOT_TOKEN= in .env')
  process.exit(1)
}

const { tg, commands } = createBot({ token, testDc: process.env.TEST_DC === '1' })

await tg.start()
await tg.api.setMyCommands({ commands })

console.log(`[widgets-showcase] logged in as @${tg.bot.username ?? '<unknown>'}${tg.options.useTestDc ? ' (test dc)' : ''}`)

await tg.startPolling({
  sequentializeBy: raw => raw.shared_widget_query?.widget_id ?? raw.widget_query?.widget_id ?? (
    raw.widget_query === undefined ? undefined : `${raw.widget_query.chat?.id}:${raw.widget_query.message_id}`
  )
})
