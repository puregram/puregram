import { defineWidget, html, js, json, queryData, WIDGET_LIMITS } from '@puregram/widgets'
import { InlineQueryResult, type Telegram, type User } from 'puregram'

import { commandArgs, messageKey } from '../util'

import { baseStyle } from './style'

export interface EventSpec {
  title: string
  at: number
}

type Answer = 'g' | 'm'

export interface RsvpState {
  r: number
  g: string[]
  gn: number
  m: string[]
  mn: number
}

export const USAGE = '/countdown 2026-12-31T23:59Z new year party'

const MAX_TITLE = 80
const MAX_NAME = 24
const LISTED = 12
const DATE = /^(\d{4}-\d{2}-\d{2})(?:T(\d{2}:\d{2}(?::\d{2})?))?(Z|[+-]\d{2}:?\d{2})?$/i

const Rsvp = queryData('rsvp')

export const Countdown = defineWidget({
  chat: json<RsvpState>(),
  html: (event: EventSpec) => html`<style>${baseStyle}
#when{margin-top:3px}
.tiles{display:flex;gap:8px;margin:14px 0}
.tile{flex:1;padding:10px 0 8px;border-radius:14px;background:var(--track);text-align:center}
.tile b{display:block;font-size:26px;line-height:1.1;font-weight:700;animation:drop .3s ease-out}
@keyframes drop{from{transform:translateY(-35%)}}
.tile span{font-size:11px;color:var(--hint)}
#live{display:none;margin:14px 0;padding:14px 0;border-radius:14px;background:var(--track);text-align:center;font-size:17px;font-weight:650}
.past .tiles{display:none}
.past #live{display:block}
.rsvp{display:flex;gap:8px}
.rsvp button{flex:1;padding:10px 0;border-radius:12px;background:var(--track);font-weight:600}
.rsvp button.on{background:var(--accent);color:var(--on-accent)}
.rsvp small{margin-left:6px;font-size:13px;font-weight:500}
#names{margin-top:10px;font-size:14px;line-height:1.45}
#names div{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
</style>
<div class="kicker">countdown</div>
<h3>${event.title}</h3>
<div class="hint" id="when"></div>
<div id="clock"><div class="tiles">${['days', 'hours', 'min', 'sec'].map(unit => html`<div class="tile"><b>00</b><span>${unit}</span></div>`)}</div><div id="live"></div></div>
<div class="rsvp"><button data-a="g">going<small></small></button><button data-a="m">maybe<small></small></button></div>
<div id="names">${[['g', 'going'], ['m', 'maybe']].map(([answer, label]) => html`<div id="names-${answer}"><b>${label}:</b> <span></span><span class="hint"></span></div>`)}</div>
<div class="foot" id="msg"></div>
<script>
const TW = window.TelegramWidget
const $ = (id) => document.getElementById(id)
const AT = ${js(event.at)}
const RSVP = ${js(Rsvp.prefix)} + ':'
const digits = [...document.querySelectorAll('.tile b')]
const buttons = [...document.querySelectorAll('.rsvp button')]
let rsvp = { r: 0, g: [], gn: 0, m: [], mn: 0 }
let mine = ''
let busy = false
let timer = null
try { mine = localStorage.getItem('rsvp') || '' } catch {}

const parse = (text) => { try { return JSON.parse(text) } catch { return null } }

function ago (ms) {
  const minutes = Math.floor(ms / 60000)
  if (minutes < 60) return minutes + ' min'
  if (minutes < 2880) return Math.floor(minutes / 60) + ' h'
  return Math.floor(minutes / 1440) + ' days'
}

function tick () {
  const left = AT - Date.now()
  $('clock').classList.toggle('past', left <= 0)
  if (left <= 0) {
    $('live').textContent = left > -3600000 ? '🎉 it’s happening now' : '🎉 started ' + ago(-left) + ' ago'
    return
  }
  const seconds = Math.floor(left / 1000)
  const parts = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60]
  parts.forEach((part, i) => {
    const text = String(part).padStart(2, '0')
    if (digits[i].textContent === text) return
    digits[i].textContent = text
    digits[i].style.animation = 'none'
    requestAnimationFrame(() => { digits[i].style.animation = '' })
  })
}

function apply (next) {
  if (!next || !Array.isArray(next.g) || next.r < rsvp.r) return
  rsvp = next
  draw()
}

function drawGuests (answer, total) {
  const row = $('names-' + answer)
  const [names, more] = row.querySelectorAll('span')
  row.style.display = total ? '' : 'none'
  names.textContent = rsvp[answer].join(', ')
  more.textContent = total > rsvp[answer].length ? ' +' + (total - rsvp[answer].length) : ''
}

function draw () {
  buttons.forEach((button) => {
    const answer = button.dataset.a
    button.classList.toggle('on', answer === mine)
    button.querySelector('small').textContent = rsvp[answer + 'n'] || ''
    button.disabled = !TW || !TW.viewer || TW.isPreview
  })
  drawGuests('g', rsvp.gn)
  drawGuests('m', rsvp.mn)
}

function answer (choice) {
  if (busy) return
  busy = true
  $('msg').textContent = ''
  TW.request(RSVP + choice).then((reply) => {
    const next = parse(reply.result)
    if (!next) { $('msg').textContent = reply.result || ''; return }
    mine = next.v
    try { localStorage.setItem('rsvp', mine) } catch {}
    apply(next)
    draw()
  }, (error) => {
    $('msg').textContent = error.code === 'NOT_ALLOWED' ? 'open the original message to answer' : 'not sent (' + error.code + '), try again'
  }).finally(() => { busy = false })
}

function start () {
  tick()
  timer = timer || setInterval(tick, 1000)
}

function stop () {
  clearInterval(timer)
  timer = null
}

$('when').textContent = new Date(AT).toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
buttons.forEach((button) => { button.onclick = () => answer(button.dataset.a) })
if (TW) {
  TW.onEvent('chatDataChanged', () => apply(parse(TW.chatData)))
  TW.onEvent('activated', start)
  TW.onEvent('deactivated', stop)
  apply(parse(TW.chatData))
}
draw()
if (!TW || TW.isActive !== false) start()
else tick()
</script>`
})

export function parseCountdown (text: string) {
  const [when = '', ...words] = text.trim().split(/\s+/)
  const title = words.join(' ').slice(0, MAX_TITLE)
  const match = DATE.exec(when)

  if (match === null || title.length === 0) {
    return undefined
  }

  const [, day, time = '00:00', zone = 'Z'] = match
  const at = Date.parse(`${day}T${time}${zone.replace(/^([+-]\d{2})(\d{2})$/, '$1:$2')}`)

  return Number.isNaN(at) ? undefined : { title, at }
}

const emptyRsvp = () => ({ r: 0, g: [], gn: 0, m: [], mn: 0 })

export function countdownArticle (event: EventSpec) {
  return InlineQueryResult.article({
    id: 'countdown',
    title: `⏳ ${event.title}`,
    description: new Date(event.at).toUTCString(),
    content: Countdown.render(event).content({ allowQueries: true, chat: emptyRsvp() })
  })
}

interface Guest {
  answer: Answer
  name: string
}

interface Guests {
  r: number
  answers: Map<number, Guest>
}

function rsvpState (guests: Guests, vote: Answer | '') {
  const names = (answer: Answer) =>
    [...guests.answers.values()].flatMap(guest => guest.answer === answer ? [guest.name] : [])

  const going = names('g')
  const maybe = names('m')
  const state: RsvpState = {
    r: guests.r,
    g: going.slice(0, LISTED),
    gn: going.length,
    m: maybe.slice(0, LISTED),
    mn: maybe.length
  }

  const answer = { ...state, v: vote }
  let data = JSON.stringify(answer)

  while (Buffer.byteLength(data) > WIDGET_LIMITS.stateBytes) {
    (state.g.length >= state.m.length ? state.g : state.m).pop()
    data = JSON.stringify(answer)
  }

  return { state, data }
}

function answerFor (guests: Guests, user: User, answer: Answer) {
  if (guests.answers.get(user.id)?.answer === answer) {
    guests.answers.delete(user.id)
  } else {
    guests.answers.set(user.id, { answer, name: user.firstName.slice(0, MAX_NAME) })
  }

  guests.r += 1
}

export function registerCountdown (tg: Telegram) {
  const events = new Map<string, Guests>()

  tg.command('countdown', async (message) => {
    const event = parseCountdown(commandArgs(message))

    if (event === undefined) {
      return message.send(`usage: ${USAGE}\na date without a zone is utc`)
    }

    await message.sendWidget(Countdown.render(event), { allowQueries: true, chat: emptyRsvp() })
  })

  tg.onWidgetQuery(Rsvp.filter, async (query) => {
    if (query.type.type !== 'data') {
      return query.answer({ data: 'unsupported query type' })
    }

    if (query.payload !== 'g' && query.payload !== 'm') {
      return query.answer({ data: 'unknown answer' })
    }

    const key = messageKey(query)
    const previous = events.get(key)
    const guests = { r: previous?.r ?? 0, answers: new Map(previous?.answers) }

    answerFor(guests, query.from, query.payload)

    const { state, data } = rsvpState(guests, guests.answers.get(query.from.id)?.answer ?? '')

    await Countdown.editState(query, query, { chat: state })
    events.set(key, guests)

    await query.answer({ data })
  })
}
