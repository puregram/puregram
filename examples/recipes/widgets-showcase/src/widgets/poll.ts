import { defineWidget, html, js, json, queryData } from '@puregram/widgets'
import { InlineQueryResult, type Modify, type SharedWidgetQueryUpdate, type Telegram, type WidgetQueryUpdate } from 'puregram'

import { commandArgs } from '../util'

import { baseStyle } from './style'

const MAX_OPTIONS = 8
const MAX_QUESTION = 200
const MAX_OPTION = 60

export interface PollSpec {
  question: string
  options: string[]
}

export interface PollTally {
  r: number
  c: number[]
}

export const USAGE = '/poll question | option | option …'

const Vote = queryData('vote')

export const Poll = defineWidget({
  public: json<PollTally>(),
  html: (poll: PollSpec) => html`<style>${baseStyle}
#meta{margin:3px 0 8px}
.opt{display:block;width:100%;padding:9px 0 11px;text-align:left}
.top{display:flex;align-items:center;gap:10px}
.check{position:relative;flex:none;width:18px;height:18px;box-sizing:border-box;border-radius:50%;border:1.5px solid var(--hint);transition:background-color .25s,border-color .25s}
.check::after{content:'';position:absolute;left:5px;top:2px;width:4px;height:8px;border:solid var(--on-accent);border-width:0 2px 2px 0;transform:rotate(45deg) scale(0);transition:transform .25s cubic-bezier(.3,1.6,.5,1)}
.label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:15px}
.pct{font-size:14px;font-weight:600;color:var(--hint)}
.track{height:6px;margin:8px 0 0 28px;border-radius:3px;background:var(--track)}
.fill{width:0;height:100%;border-radius:3px;background:var(--hint);transition:width .6s cubic-bezier(.2,.8,.2,1),background-color .25s}
.me .check{background:var(--accent);border-color:var(--accent)}
.me .check::after{transform:rotate(45deg) scale(1)}
.me .fill{background:var(--accent)}
.me .pct{color:var(--accent)}
.wait .check{border-color:var(--accent);animation:pulse .8s ease-in-out infinite alternate}
@keyframes pulse{to{transform:scale(.75)}}
</style>
<h3>${poll.question}</h3>
<div class="hint" id="meta"></div>
${poll.options.map(option => html`<button class="opt"><div class="top"><span class="check"></span><span class="label">${option}</span><span class="pct"></span></div><div class="track"><div class="fill"></div></div></button>`)}
<div class="foot" id="msg"></div>
<script>
const TW = window.TelegramWidget
const $ = (id) => document.getElementById(id)
const VOTE = ${js(Vote.prefix)} + ':'
const buttons = [...document.querySelectorAll('.opt')]
const canVote = Boolean(TW && TW.viewer && !TW.isPreview)
let tally = null
let mine = -1
let busy = false
try { mine = Number(localStorage.getItem('vote') ?? -1) } catch {}

const parse = (text) => { try { return JSON.parse(text) } catch { return null } }

function apply (next) {
  if (!next || !Array.isArray(next.c) || (tally && next.r < tally.r)) return
  tally = next
  draw()
}

function draw () {
  const counts = buttons.map((_, i) => (tally && tally.c[i]) || 0)
  const total = counts.reduce((sum, count) => sum + count, 0)
  buttons.forEach((button, i) => {
    const percent = total ? Math.round(counts[i] / total * 100) : 0
    button.classList.toggle('me', i === mine)
    button.querySelector('.pct').textContent = percent + '%'
    button.querySelector('.fill').style.width = percent + '%'
    button.disabled = !canVote
  })
  $('meta').textContent = (total === 1 ? '1 vote' : total + ' votes') + ' · live results'
}

function vote (i) {
  if (busy) return
  busy = true
  buttons[i].classList.add('wait')
  $('msg').textContent = ''
  TW.request(VOTE + i).then((answer) => {
    const result = parse(answer.result)
    if (!result) { $('msg').textContent = answer.result || 'this poll is closed'; return }
    mine = result.v
    try { localStorage.setItem('vote', String(mine)) } catch {}
    apply(result)
    draw()
    $('msg').textContent = mine < 0 ? 'vote retracted' : 'tap your choice again to retract'
  }, (error) => {
    $('msg').textContent = error.code === 'NOT_ALLOWED' ? 'open the original message to vote' : 'vote not sent (' + error.code + '), try again'
  }).finally(() => {
    busy = false
    buttons[i].classList.remove('wait')
  })
}

buttons.forEach((button, i) => { button.onclick = () => vote(i) })
if (TW) {
  TW.onEvent('publicDataChanged', () => apply(parse(TW.publicData)))
  if (!TW.isPreview) TW.watchPublicData()
  apply(parse(TW.publicData))
}
if (!canVote) $('msg').textContent = TW && TW.isPreview ? 'results update live for everyone' : 'results are live; voting happens in the original message'
draw()
</script>`
})

export function parsePoll (text: string) {
  const [question = '', ...options] = text.split('|').map(part => part.trim())
  const filled = options.filter(option => option.length > 0)

  if (question.length === 0 || filled.length < 2 || filled.length > MAX_OPTIONS) {
    return undefined
  }

  return { question: question.slice(0, MAX_QUESTION), options: filled.map(option => option.slice(0, MAX_OPTION)) }
}

const emptyTally = () => ({ r: 0, c: [] })

export function pollArticle (poll: PollSpec) {
  return InlineQueryResult.article({
    id: 'poll',
    title: `📊 ${poll.question}`,
    description: poll.options.join(' · '),
    content: Poll.render(poll).content({ shared: true, allowQueries: true, public: emptyTally() })
  })
}

type VoteQuery = Modify<WidgetQueryUpdate, { payload: string }> | Modify<SharedWidgetQueryUpdate, { payload: string }>

interface PollVotes {
  tally: PollTally
  voters: Map<number, number>
}

export function registerPoll (tg: Telegram) {
  const polls = new Map<string, PollVotes>()

  tg.command('poll', async (message) => {
    const poll = parsePoll(commandArgs(message))

    if (poll === undefined) {
      return message.send(`usage: ${USAGE}\n2 to ${MAX_OPTIONS} options`)
    }

    await Poll.render(poll).send(tg, message.chat.id, { shared: true, allowQueries: true, public: emptyTally() })
  })

  const vote = async (query: VoteQuery) => {
    const choice = Number(query.payload)

    if (query.widgetId === undefined || !Number.isInteger(choice) || choice < 0 || choice >= MAX_OPTIONS) {
      return query.answer({ data: 'this poll is closed' })
    }

    const poll: PollVotes = polls.get(query.widgetId) ?? { tally: emptyTally(), voters: new Map() }
    const tally = { r: poll.tally.r, c: [...poll.tally.c] }
    const voters = new Map(poll.voters)
    const previous = voters.get(query.from.id)

    if (previous !== undefined) {
      tally.c[previous] = (tally.c[previous] ?? 1) - 1
      voters.delete(query.from.id)
    }

    if (previous !== choice) {
      while (tally.c.length <= choice) {
        tally.c.push(0)
      }

      tally.c[choice] = (tally.c[choice] ?? 0) + 1
      voters.set(query.from.id, choice)
    }

    tally.r += 1

    await Poll.editShared(query, query.widgetId, tally)
    polls.set(query.widgetId, { tally, voters })
    await query.answer({ data: JSON.stringify({ ...tally, v: voters.get(query.from.id) ?? -1 }) })
  }

  tg.onWidgetQuery(Vote.filter, vote)
  tg.onSharedWidgetQuery(Vote.filter, vote)
}
