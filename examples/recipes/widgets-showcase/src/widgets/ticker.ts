import { defineWidget, html, js, json, queryData } from '@puregram/widgets'
import type { Modify, SharedWidgetQueryUpdate, Telegram, WidgetQueryUpdate } from 'puregram'

import { baseStyle } from './style'

const COINS = [
  { id: 'the-open-network', symbol: 'TON', name: 'Toncoin' },
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' }
] as const

const PRICES_URL = 'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&include_24hr_change=true&ids=' +
  COINS.map(coin => coin.id).join(',')

const FETCH_EVERY_MS = 60_000
const CLIENT_CACHE_SECONDS = 20
const HISTORY_POINTS = 30
const LEVELS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'

export interface Quote {
  p: number
  d: number
  lo: number
  hi: number
  h: string
}

export interface TickerState {
  r: number
  t: number
  c: Quote[]
}

const Refresh = queryData('tick')

export const Ticker = defineWidget({
  public: json<TickerState>(),
  html: html`<style>${baseStyle}
.tabs{position:relative;display:flex;padding:3px;border-radius:11px;background:var(--track)}
.tabs i{position:absolute;top:3px;bottom:3px;left:3px;width:calc((100% - 6px) / 3);border-radius:8px;background:var(--tg-theme-bg-color);box-shadow:0 1px 3px rgba(0,0,0,.14);transition:transform .35s cubic-bezier(.3,.8,.25,1)}
.tabs button{position:relative;flex:1;padding:6px 0;font-size:14px;font-weight:600;color:var(--hint)}
.tabs button.on{color:var(--tg-theme-text-color)}
.head{display:flex;justify-content:space-between;align-items:center;margin-top:14px}
#refresh{padding:4px 2px 4px 12px;color:var(--tg-theme-link-color);font-size:13px}
.row{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:2px}
#price{font-size:30px;font-weight:700;letter-spacing:-.5px;transition:color .6s}
#price.bump{color:var(--accent);transition:none}
#change{padding:3px 8px;border-radius:8px;font-size:14px;font-weight:600;white-space:nowrap}
.period{margin-top:3px;font-size:11px;text-align:right}
.up{color:var(--up)}
.down{color:var(--down)}
#change.up{background:var(--up-bg)}
#change.down{background:var(--down-bg)}
svg{display:block;width:100%;height:auto;margin-top:12px;overflow:visible;transform-origin:50% 100%;animation:grow .4s cubic-bezier(.3,.8,.25,1)}
@keyframes grow{from{transform:scaleY(.15)}}
.range{display:flex;justify-content:space-between;margin-top:6px}
</style>
<div class="tabs"><i id="pill"></i>${COINS.map(coin => html`<button>${coin.symbol}</button>`)}</div>
<div class="head"><span class="hint" id="name"></span><button id="refresh">↻ refresh</button></div>
<div class="row"><div id="price">…</div><div><div id="change"></div><div class="hint period">24h</div></div></div>
<svg id="chart" viewBox="0 0 300 76"><defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".3"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs><path id="area" fill="url(#fade)"/><path id="line" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><circle id="dot" r="4" fill="currentColor"/></svg>
<div class="range hint"><span id="low"></span><span id="high"></span></div>
<div class="foot" id="msg"></div>
<script>
const TW = window.TelegramWidget
const $ = (id) => document.getElementById(id)
const NAMES = ${js(COINS.map(coin => coin.name))}
const LEVELS = ${js(LEVELS)}
const REFRESH = ${js(Refresh.encode('now'))}
const tabs = [...document.querySelectorAll('.tabs button')]
let state = null
let coin = 0
let note = ''
try { coin = Number(localStorage.getItem('coin')) || 0 } catch {}

const parse = (text) => { try { return JSON.parse(text) } catch { return null } }
const money = (value) => '$' + value.toLocaleString('en-US', { minimumFractionDigits: value < 10 ? 4 : 2, maximumFractionDigits: value < 10 ? 4 : 2 })

function apply (next) {
  if (!next || !Array.isArray(next.c) || (state && next.r < state.r)) return
  const before = state && state.c[coin].p
  state = next
  draw()
  if (before !== null && before !== state.c[coin].p) {
    $('price').classList.add('bump')
    setTimeout(() => $('price').classList.remove('bump'), 200)
  }
}

function drawChart (quote) {
  const levels = [...quote.h].map((char) => LEVELS.indexOf(char))
  const trend = levels.length > 1 && levels[levels.length - 1] < levels[0] ? 'down' : 'up'
  const step = 296 / Math.max(levels.length - 1, 1)
  const points = levels.map((level, i) => [2 + i * step, 6 + (1 - level / 63) * 62])
  const line = points.length > 1 ? 'M' + points.map((point) => point[0].toFixed(1) + ',' + point[1].toFixed(1)).join('L') : ''
  $('chart').setAttribute('class', trend)
  $('line').setAttribute('d', line)
  $('area').setAttribute('d', line && line + 'L298,76L2,76Z')
  const last = points[points.length - 1] || [-10, -10]
  $('dot').setAttribute('cx', last[0])
  $('dot').setAttribute('cy', last[1])
  $('low').textContent = levels.length > 1 ? 'low ' + money(quote.lo) : 'collecting history…'
  $('high').textContent = levels.length > 1 ? 'high ' + money(quote.hi) : ''
}

function draw () {
  tabs.forEach((tab, i) => tab.classList.toggle('on', i === coin))
  $('pill').style.transform = 'translateX(' + coin * 100 + '%)'
  $('name').textContent = NAMES[coin]
  if (!state) return
  const quote = state.c[coin]
  $('price').textContent = money(quote.p)
  $('change').textContent = (quote.d < 0 ? '▼ ' : '▲ ') + Math.abs(quote.d).toFixed(2) + '%'
  $('change').className = quote.d < 0 ? 'down' : 'up'
  drawChart(quote)
  tick()
}

function tick () {
  if (note) return
  if (!state) { $('msg').textContent = 'waiting for prices…'; return }
  const seconds = Math.max(0, Math.round(Date.now() / 1000 - state.t))
  $('msg').textContent = 'updated ' + (seconds < 60 ? seconds + ' s' : Math.round(seconds / 60) + ' min') + ' ago · last 30 min'
}

function say (text) {
  note = text
  $('msg').textContent = text
  setTimeout(() => { note = ''; tick() }, 2500)
}

tabs.forEach((tab, i) => {
  tab.onclick = () => {
    if (i === coin) return
    coin = i
    try { localStorage.setItem('coin', String(i)) } catch {}
    draw()
    $('chart').style.animation = 'none'
    requestAnimationFrame(() => { $('chart').style.animation = '' })
  }
})

$('refresh').onclick = () => {
  if (!TW) return
  TW.request(REFRESH).then(
    (answer) => { apply(parse(answer.result)); say('up to date') },
    (error) => say(error.code === 'NOT_ALLOWED' ? 'prices update live every minute' : 'refresh failed: ' + error.code)
  )
}

if (TW) {
  TW.onEvent('publicDataChanged', () => apply(parse(TW.publicData)))
  TW.watchPublicData()
  apply(parse(TW.publicData))
}
draw()
setInterval(tick, 1000)
</script>`
})

type TickerQuery = Modify<WidgetQueryUpdate, { payload: string }> | Modify<SharedWidgetQueryUpdate, { payload: string }>

interface CoinGeckoPrices {
  [id: string]: { usd?: number, usd_24h_change?: number } | undefined
}

function quantize (history: number[]) {
  const lo = Math.min(...history)
  const hi = Math.max(...history)
  const span = hi - lo
  const h = history.map(value => LEVELS[span === 0 ? 32 : Math.round((value - lo) / span * 63)]).join('')

  return { lo, hi, h }
}

async function fetchPrices () {
  const response = await fetch(PRICES_URL, { signal: AbortSignal.timeout(10_000) })

  if (!response.ok) {
    throw new Error(`coingecko answered ${response.status}`)
  }

  const prices = await response.json() as CoinGeckoPrices

  return COINS.map((coin) => {
    const price = prices[coin.id]

    if (price?.usd === undefined) {
      throw new Error(`coingecko has no price for ${coin.id}`)
    }

    return { price: price.usd, change: price.usd_24h_change ?? 0 }
  })
}

export function registerTicker (tg: Telegram) {
  const history: number[][] = COINS.map(() => [])
  let state: TickerState | undefined
  let widgetId: string | undefined

  async function update () {
    const prices = await fetchPrices()
    const quotes = prices.map(({ price, change }, i) => {
      const points = [...history[i] ?? [], price].slice(-HISTORY_POINTS)

      history[i] = points

      return { p: price, d: Math.round(change * 100) / 100, ...quantize(points) }
    })

    const next = { r: (state?.r ?? 0) + 1, t: Math.floor(Date.now() / 1000), c: quotes }

    if (widgetId !== undefined) {
      await Ticker.editShared(tg, widgetId, next)
    }

    state = next
  }

  const loop = () => {
    update()
      .catch((error: unknown) => {
        console.error('ticker update failed:', error)
      })
      .finally(() => setTimeout(loop, FETCH_EVERY_MS))
  }

  loop()

  tg.command('ticker', async (message) => {
    if (state === undefined) {
      return message.send('prices are still loading, try again in a few seconds')
    }

    if (widgetId !== undefined) {
      return Ticker.sendShared(tg, message.chat.id, widgetId)
    }

    const sent = await Ticker.send(tg, message.chat.id, { shared: true, allowQueries: true, public: state })

    widgetId = sent.widget?.id
    console.log('ticker: created shared widget', widgetId)

    if (widgetId !== undefined) {
      await Ticker.editShared(tg, widgetId, state, { cacheTime: CLIENT_CACHE_SECONDS })
    }
  })

  const refresh = (query: TickerQuery) =>
    query.answer(state === undefined ? {} : { data: Ticker.publicCodec.encode(state) })

  tg.onWidgetQuery(Refresh.filter, refresh)
  tg.onSharedWidgetQuery(Refresh.filter, refresh)
}
