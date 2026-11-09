import { defineWidget, html, js, json, queryData } from '@puregram/widgets'
import type { Modify, Telegram, User, WidgetQueryUpdate } from 'puregram'

import { chatMessageKey, messageKey } from '../util'

import { baseStyle } from './style'

type Mark = 'x' | 'o'

export interface Player {
  i: number
  n: string
  w: number
}

export interface TttState {
  r: number
  b: string
  x: Player | null
  o: Player | null
  w: number[] | null
}

const BOT_ID = 0
const EMPTY_BOARD = '.........'
const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

const Move = queryData('move')
const Rematch = queryData('rematch')

export const Ttt = defineWidget({
  chat: json<TttState>(),
  html: html`<style>${baseStyle}
:root{--x:var(--accent);--o:#ff9500}
@media (prefers-color-scheme:dark){:root{--o:#ffb340}}
.seats{display:flex;align-items:center;gap:8px}
.seat{flex:1;min-width:0;display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:12px;background:var(--track);transition:box-shadow .25s}
.seat.turn{box-shadow:inset 0 0 0 2px var(--accent)}
.who{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;font-weight:600}
.score{font-size:15px;font-weight:700;color:var(--hint)}
.mini{position:relative;flex:none;width:16px;height:16px;font-size:4px}
.board{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:264px;margin:14px auto 0}
.cell{position:relative;aspect-ratio:1;border-radius:16px;background:var(--track);font-size:13px}
.cell i,.mini i{position:absolute;top:22%;left:22%;right:22%;bottom:22%;transform:scale(0);transition:transform .3s cubic-bezier(.3,1.5,.5,1)}
.mini i{top:0;left:0;right:0;bottom:0}
.x i,.o i{transform:none}
.o i{box-sizing:border-box;border-radius:50%;border:.55em solid var(--o)}
.x i::before,.x i::after{content:'';position:absolute;top:-10%;left:50%;width:.6em;height:120%;margin-left:-.3em;border-radius:.3em;background:var(--x);transform:rotate(45deg)}
.x i::after{transform:rotate(-45deg)}
.cell.win{background:var(--accent)}
.cell.win i{--x:var(--on-accent);--o:var(--on-accent)}
.over .cell:not(.win) i{--x:var(--hint);--o:var(--hint)}
#status{margin-top:14px;text-align:center;font-size:16px;font-weight:600}
#again{margin-top:12px;display:none}
.over~#again{display:block}
</style>
<div class="seats"><div class="seat" id="seat-x"><span class="mini x"><i></i></span><span class="who"></span><span class="score"></span></div><div class="seat" id="seat-o"><span class="mini o"><i></i></span><span class="who"></span><span class="score"></span></div></div>
<div class="board" id="board">${EMPTY_BOARD.split('').map(() => html`<button class="cell"><i></i></button>`)}</div>
<div id="status">…</div>
<button class="primary" id="again">rematch</button>
<div class="foot" id="msg"></div>
<script>
const TW = window.TelegramWidget
const $ = (id) => document.getElementById(id)
const MOVE = ${js(Move.prefix)} + ':'
const REMATCH = ${js(Rematch.encode('new'))}
const BOT_ID = ${js(BOT_ID)}
const cells = [...document.querySelectorAll('.cell')]
const me = TW && TW.viewer ? TW.viewer.id : null
let game = null
let busy = false

const parse = (text) => { try { return JSON.parse(text) } catch { return null } }
const toMove = (board) => board.split('x').length > board.split('o').length ? 'o' : 'x'

function apply (next) {
  if (!next || typeof next.b !== 'string' || (game && next.r < game.r)) return
  game = next
  draw()
}

function status (over, mark) {
  if (game.w) {
    const winner = game[game.b[game.w[0]]]
    return winner.i === me ? 'you win! 🎉' : winner.n + ' wins'
  }
  if (over) return 'a draw'
  const seat = game[mark]
  const other = game[mark === 'x' ? 'o' : 'x']
  if (!seat) return other && other.i === me ? 'waiting for someone to join…' : 'tap a cell to play ' + mark.toUpperCase()
  if (seat.i === me) return 'your turn'
  return seat.i === BOT_ID ? 'thinking…' : seat.n + '’s turn'
}

function draw () {
  if (!game) return
  const over = Boolean(game.w) || !game.b.includes('.')
  const mark = toMove(game.b)
  cells.forEach((cell, i) => {
    const filled = game.b[i] !== '.'
    cell.className = 'cell' + (filled ? ' ' + game.b[i] : '') + (game.w && game.w.includes(i) ? ' win' : '')
    cell.disabled = !me || over || filled
  })
  $('board').classList.toggle('over', over)
  for (const seat of ['x', 'o']) {
    const player = game[seat]
    const el = $('seat-' + seat)
    el.classList.toggle('turn', !over && mark === seat)
    el.querySelector('.who').textContent = player ? (player.i === me ? 'you' : player.n) : 'open seat'
    el.querySelector('.score').textContent = player ? player.w : ''
  }
  $('status').textContent = status(over, mark)
}

function send (data) {
  if (busy || !TW) return
  busy = true
  $('msg').textContent = ''
  TW.request(data).then((answer) => {
    const next = parse(answer.result)
    if (next) apply(next)
    else $('msg').textContent = answer.result || ''
  }, (error) => {
    $('msg').textContent = error.code === 'NOT_ALLOWED' ? 'this copy is read-only' : 'not sent (' + error.code + '), try again'
  }).finally(() => { busy = false })
}

cells.forEach((cell, i) => { cell.onclick = () => send(MOVE + i) })
$('again').onclick = () => send(REMATCH)
if (TW) {
  TW.onEvent('chatDataChanged', () => apply(parse(TW.chatData)))
  apply(parse(TW.chatData))
}
if (!game) $('status').textContent = TW && TW.isForward ? 'a copy of a game' : 'tic-tac-toe'
</script>`
})

type GameQuery = Modify<WidgetQueryUpdate, { payload: string }>

const opponent = (mark: Mark) => mark === 'x' ? 'o' : 'x'
const toMove = (board: string) => board.split('x').length > board.split('o').length ? 'o' : 'x'
const place = (board: string, cell: number, mark: Mark) => board.slice(0, cell) + mark + board.slice(cell + 1)
const winLine = (board: string) =>
  LINES.find(([a = 0, b = 0, c = 0]) => board[a] !== '.' && board[a] === board[b] && board[a] === board[c]) ?? null
const isOver = (game: TttState) => game.w !== null || !game.b.includes('.')
const emptyCells = (board: string) => [...board].flatMap((mark, cell) => mark === '.' ? [cell] : [])

function score (board: string, mark: Mark): number {
  if (winLine(board) !== null) {
    return -1
  }

  const moves = emptyCells(board)

  if (moves.length === 0) {
    return 0
  }

  return Math.max(...moves.map(cell => -score(place(board, cell, mark), opponent(mark))))
}

function botMove (board: string, mark: Mark) {
  const moves = emptyCells(board).map(cell => ({ cell, value: -score(place(board, cell, mark), opponent(mark)) }))
  const best = Math.max(...moves.map(move => move.value))
  const choices = moves.filter(move => move.value === best)

  return choices[Math.floor(Math.random() * choices.length)]?.cell ?? 0
}

const player = (user: User) => ({ i: user.id, n: user.firstName.slice(0, 24), w: 0 })

function playBot (game: TttState) {
  const mark = toMove(game.b)

  if (!isOver(game) && game[mark]?.i === BOT_ID) {
    game.b = place(game.b, botMove(game.b, mark), mark)
  }
}

function settle (game: TttState) {
  game.w = winLine(game.b)

  const winner = game.w === null ? null : game[game.b[game.w[0] ?? 0] as Mark]

  if (winner) {
    winner.w += 1
  }

  game.r += 1
}

function move (game: TttState, user: User, cell: number) {
  if (isOver(game)) {
    return 'the game is over: tap rematch'
  }

  if (!Number.isInteger(cell) || game.b[cell] !== '.') {
    return 'that cell is taken'
  }

  const mark = toMove(game.b)
  const seat = game[mark]

  if (seat === null) {
    if (game[opponent(mark)]?.i === user.id) {
      return 'waiting for someone to join'
    }

    game[mark] = player(user)
  } else if (seat.i !== user.id) {
    const playing = game.x?.i === user.id || game.o?.i === user.id

    return playing ? `${seat.n}’s turn` : 'two players are already playing'
  }

  game.b = place(game.b, cell, mark)
  playBot(game)
  settle(game)

  return undefined
}

function rematch (game: TttState, user: User) {
  if (!isOver(game)) {
    return 'finish this game first'
  }

  if (game.x?.i !== user.id && game.o?.i !== user.id) {
    return 'only the players can start a rematch'
  }

  Object.assign(game, { b: EMPTY_BOARD, x: game.o, o: game.x })
  playBot(game)
  settle(game)

  return undefined
}

export function registerTtt (tg: Telegram) {
  const games = new Map<string, TttState>()

  tg.command('ttt', async (message) => {
    const solo = message.chat.type === 'private' ? message.from : undefined
    const game: TttState = {
      r: 0,
      b: EMPTY_BOARD,
      x: solo === undefined ? null : player(solo),
      o: solo === undefined ? null : { i: BOT_ID, n: 'bot', w: 0 },
      w: null
    }

    const sent = await message.sendWidget(Ttt, { allowQueries: true, chat: game })

    games.set(chatMessageKey(message.chat.id, sent.message_id), game)
  })

  const handle = (act: (game: TttState, query: GameQuery) => string | undefined) => async (query: GameQuery) => {
    if (query.type.type !== 'data') {
      return query.answer({ data: 'unsupported query type' })
    }

    const game = games.get(messageKey(query))

    if (game === undefined) {
      return query.answer({ data: 'this game has ended: send /ttt for a new one' })
    }

    const next = structuredClone(game)
    const refusal = act(next, query)

    if (refusal !== undefined) {
      return query.answer({ data: refusal })
    }

    await Ttt.editState(query, query, { chat: next })
    games.set(messageKey(query), next)
    await query.answer({ data: Ttt.chatCodec.encode(next) })
  }

  tg.onWidgetQuery(Move.filter, handle((game, query) => move(game, query.from, Number(query.payload))))
  tg.onWidgetQuery(Rematch.filter, handle((game, query) => rematch(game, query.from)))
}
