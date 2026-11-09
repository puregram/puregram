import { defineWidget, html, js, json, queryData } from '@puregram/widgets'
import type { Telegram } from 'puregram'

import { commandArgs } from '../util'

import { baseStyle } from './style'

export interface HabitState {
  r: number
  d: number
  m: string
}

const DAYS = 84
const MASK = (1n << BigInt(DAYS)) - 1n
const MAX_OFFSET_MINUTES = 14 * 60
const MAX_NAME = 48

const Done = queryData('done')

export const Habit = defineWidget({
  chat: json<HabitState>(),
  html: (name: string) => html`<style>${baseStyle}
h3{margin-top:2px}
.months,.grid{display:grid;grid-template-columns:repeat(12,1fr);gap:4px}
.months{margin-top:12px;height:15px;font-size:11px;color:var(--hint);white-space:nowrap}
.grid{grid-template-rows:repeat(7,1fr);grid-auto-flow:column}
.grid i{aspect-ratio:1;border-radius:5px;background:var(--track);transition:background-color .3s}
.grid i.on{background:var(--accent)}
.grid i.today.on{animation:pop .35s cubic-bezier(.3,1.5,.5,1)}
@keyframes pop{from{transform:scale(1.6)}}
.grid i.today{box-shadow:0 0 0 1.5px var(--tg-theme-text-color)}
.grid i.future{background:none;box-shadow:inset 0 0 0 1px var(--track)}
.stats{display:flex;gap:8px;margin:14px 0 12px}
.stats div{flex:1;padding:8px 10px;border-radius:12px;background:var(--track)}
.stats b{display:block;font-size:20px;font-weight:700}
.stats span{font-size:12px;color:var(--hint)}
#done.on{background:var(--up-bg);color:var(--up)}
</style>
<div class="kicker">habit</div>
<h3>${name}</h3>
<div class="months" id="months">${Array.from({ length: DAYS / 7 }, () => html`<span></span>`)}</div>
<div class="grid" id="grid">${Array.from({ length: DAYS }, () => html`<i></i>`)}</div>
<div class="stats"><div><b id="streak">0</b><span>day streak</span></div><div><b id="best">0</b><span>best streak</span></div><div><b id="total">0</b><span>days done</span></div></div>
<button class="primary" id="done">mark today done</button>
<div class="foot" id="msg"></div>
<script>
const TW = window.TelegramWidget
const $ = (id) => document.getElementById(id)
const DAYS = ${js(DAYS)}
const DONE = ${js(Done.prefix)} + ':'
const cells = [...document.querySelectorAll('.grid i')]
const months = [...document.querySelectorAll('.months span')]
let habit = { r: 0, d: 0, m: '0' }
let busy = false

const parse = (text) => { try { return JSON.parse(text) } catch { return null } }
const offset = () => new Date().getTimezoneOffset()
const today = () => Math.floor((Date.now() / 60000 - offset()) / 1440)

function apply (next) {
  if (!next || typeof next.m !== 'string' || next.r < habit.r) return
  habit = next
  draw()
}

function draw () {
  const now = today()
  const bits = BigInt('0x' + habit.m)
  const done = (day) => habit.d - day >= 0 && habit.d - day < DAYS && ((bits >> BigInt(habit.d - day)) & 1n) === 1n
  const first = now - (now + 3) % 7 - DAYS + 7
  let best = 0
  let run = 0
  let total = 0
  cells.forEach((cell, i) => {
    const day = first + i
    const on = day <= now && done(day)
    cell.className = (on ? 'on' : '') + (day === now ? ' today' : '') + (day > now ? ' future' : '')
    run = on ? run + 1 : 0
    best = Math.max(best, run)
    total += on ? 1 : 0
  })
  let streak = 0
  for (let day = done(now) ? now : now - 1; done(day); day -= 1) streak += 1
  months.forEach((label, week) => {
    const monday = new Date((first + week * 7) * 86400000)
    const starts = monday.getUTCDate() <= 7 || (week === 0 && monday.getUTCDate() < 22)
    label.textContent = starts ? monday.toLocaleString(undefined, { month: 'short', timeZone: 'UTC' }) : ''
  })
  $('streak').textContent = streak
  $('best').textContent = best
  $('total').textContent = total
  $('done').classList.toggle('on', done(now))
  $('done').textContent = done(now) ? '✓ done today' : 'mark today done'
}

$('done').onclick = () => {
  if (busy || !TW) return
  busy = true
  $('msg').textContent = ''
  TW.request(DONE + [offset(), habit.d, habit.r, habit.m].join(':')).then((answer) => {
    const next = parse(answer.result)
    if (!next) { $('msg').textContent = answer.result || ''; return }
    apply(next)
    $('msg').textContent = $('done').classList.contains('on') ? 'nice! tap again to undo' : 'unmarked'
  }, (error) => {
    $('msg').textContent = error.code === 'NOT_ALLOWED' ? 'open the original message to track this habit' : 'not saved (' + error.code + '), try again'
  }).finally(() => { busy = false })
}

if (TW) {
  TW.onEvent('chatDataChanged', () => apply(parse(TW.chatData)))
  apply(parse(TW.chatData))
}
draw()
</script>`
})

function parseDone (payload: string) {
  const [offset, day, revision, mask = ''] = payload.split(':')
  const [minutes = NaN, d = NaN, r = NaN] = [offset, day, revision].map(Number)

  if (![minutes, d, r].every(Number.isInteger) || Math.abs(minutes) > MAX_OFFSET_MINUTES || !/^[0-9a-f]{1,21}$/.test(mask)) {
    return undefined
  }

  return { offset: minutes, habit: { r, d, m: mask } }
}

function toggleToday (habit: HabitState, offset: number) {
  const today = Math.floor((Date.now() / 60_000 - offset) / 1440)
  const shift = Math.max(0, Math.min(today - habit.d, DAYS))
  const back = Math.max(0, habit.d - today)
  let bits = BigInt(`0x${habit.m}`) << BigInt(shift)

  if (back < DAYS) {
    bits ^= 1n << BigInt(back)
  }

  return { r: habit.r + 1, d: Math.max(habit.d, today), m: (bits & MASK).toString(16) }
}

export function registerHabit (tg: Telegram) {
  tg.command('habit', async (message) => {
    const name = commandArgs(message).slice(0, MAX_NAME)

    if (message.chat.type !== 'private') {
      return message.send('habits are personal: send /habit in a private chat with me')
    }

    if (name.length === 0) {
      return message.send('usage: /habit <name>, e.g. /habit read 20 pages')
    }

    await Habit.render(name).send(tg, message.chat.id, { allowQueries: true, chat: { r: 0, d: 0, m: '0' } })
  })

  tg.onWidgetQuery(Done.filter, async (query) => {
    const parsed = parseDone(query.payload)

    if (parsed === undefined) {
      return query.answer({ data: 'could not read the habit, try again' })
    }

    const habit = toggleToday(parsed.habit, parsed.offset)

    await Habit.editState(query, query, { chat: habit })
    await query.answer({ data: Habit.chatCodec.encode(habit) })
  })
}
