import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { Countdown } from './widgets/countdown'
import { Habit } from './widgets/habit'
import { Poll } from './widgets/poll'
import { Ticker } from './widgets/ticker'
import { Ttt } from './widgets/ttt'

const outDir = process.argv[2]

const samples = {
  ticker: Ticker.html,
  poll: Poll.render({
    question: 'where do we go for lunch on friday?',
    options: ['the ramen place', 'pizza <again>', 'tacos & co', 'salad bar', 'whatever is closest']
  }).html,
  ttt: Ttt.html,
  habit: Habit.render('read 20 pages').html,
  countdown: Countdown.render({ title: 'new year party 🎄', at: Date.UTC(2027, 0, 1) }).html
}

if (outDir !== undefined) {
  mkdirSync(outDir, { recursive: true })
}

for (const [name, widgetHtml] of Object.entries(samples)) {
  const { ok, bytes, compressedBytes, problems } = widgetHtml.check()

  console.log(`${name.padEnd(10)} ${ok ? 'ok ' : 'BAD'} ${bytes} B, ${compressedBytes} B compressed`)

  for (const problem of problems) {
    console.log(`  ${problem.severity}: ${problem.message}`)
  }

  if (outDir !== undefined) {
    writeFileSync(join(outDir, `${name}.html`), widgetHtml.source)
  }
}
