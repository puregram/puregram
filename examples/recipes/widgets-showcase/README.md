# widgets showcase bot recipe

five telegram widgets (bot api 10.4) built with puregram and [`@puregram/widgets`](../../../packages/widgets/README.md): a live crypto ticker, a live poll, tic-tac-toe, a habit tracker and an event countdown. each widget is one file in `src/widgets/` holding its html, its state types and the bot side that drives it

| command | widget | chats |
|---|---|---|
| `/ticker` | TON / BTC / ETH prices with a sparkline, shared and live | private; groups on test DC |
| `/poll question \| a \| b \| c` | a poll with animated bars | private; groups, inline and live forwards on test DC |
| `/ttt` | tic-tac-toe against the bot, or two members in a group | private; groups on test DC |
| `/habit <name>` | a 12-week streak heatmap with a "done today" button | private |
| `/countdown <date> <title>` | a ticking countdown with going / maybe rsvp | private; groups and inline on test DC |

`/start` lists them. on the test DC only, inline mode (`@yourbot poll lunch? | pizza | sushi` or `@yourbot countdown 2026-12-31 new year`) answers with the same poll and countdown widgets; an empty inline query shows a sample of each. production does not register an inline handler

## prerequisites

- a bot token; the bot uses the regular `https://api.telegram.org/bot` endpoint, not the retired beta path
- **production** accepts widgets only in the bot's private chat. every widget is automatically protected and cannot be forwarded. `/ticker`, `/poll`, `/ttt` (against the bot), `/habit` and `/countdown` work there
- the **test environment** supports groups, inline mode, forwards and `shared_widget_query`. enable inline mode in the test @BotFather with `/setinline`, use a test-dc bot token and `TEST_DC=1`. widgets cannot be posted directly in channels or copied in either environment. see [official availability](https://core.telegram.org/bots/widgets#availability)
- the bot fetches prices from coingecko's free api (no key), once a minute

## run

```sh
yarn install                                  # from the repo root
yarn workspace @puregram/widgets build        # the example imports the built package
cd examples/recipes/widgets-showcase
cp .env.example .env                          # BOT_TOKEN=..., TEST_DC=1 for a test-dc bot
yarn dev
```

`yarn sizes` prints every widget's size against the server's limits (`.check()`); `yarn sizes <dir>` also writes each widget's html there, ready for telegram's [widget sandbox](https://github.com/TelegramMessenger/widget-sandbox) (`pnpm tsx packages/core/scripts/sandbox-node.ts <dir>/poll.html --width 360`)

## how a widget works

the html never changes after sending; the bot changes only the state, and the widget redraws on `chatDataChanged` / `publicDataChanged`. a tap calls `TelegramWidget.request(data)`, which reaches the bot as a `widget_query` (or `shared_widget_query` from a forwarded copy of a shared widget). the bot edits the state with `editState` / `editShared` and answers the query with `query.answer({ data })`, which the widget gets back as `result`

every widget here follows the same four rules:

- **one prefix per query kind**, built with `queryData('vote')`: the widget sends `vote:2`, the bot registers `tg.onWidgetQuery(Vote.filter, ...)` and reads `query.payload`. the prefix reaches the widget's script through `js(Vote.prefix)`, so the two sides can't drift
- **the answer carries the new state** as json, so the tapping user sees the result at once; everyone else gets it through the state change event
- **every state has a revision `r`** the bot raises on each edit: the widget ignores a state older than the one it drew, whatever order the answer, the change event and a poll arrive in
- **`widgets({ autoAnswer: true })`** answers whatever a handler didn't, so no tap waits 15 s for a `TIMEOUT`

`html` escapes every value for the context it lands in: text and attributes are entity-escaped (a poll option `pizza <again>` renders as text), values inside `<script>` must go through `js(value)`, inside `<style>` only `raw()` is allowed (the shared `src/widgets/style.ts`). widgets whose html depends on the message (the poll's question, the habit's name, the event's date) are templates: `defineWidget({ html: (poll: PollSpec) => html`...` })`, sent with `message.sendWidget(Poll.render(poll), options)` and edited with `Poll.editShared(...)` without rendering anything

## the widgets

run `yarn sizes` for the sample HTML's current sizes (limit: 32768 utf-8 bytes and 4096 bytes of RFC1950 zlib at level 9; `check()` warns above 3800). the API receives plain HTML, not compressed bytes. near the compressed limit, [use Python's zlib count as Telegram recommends](https://core.telegram.org/bots/widgets#counting-the-size)

### `/ticker` (`src/widgets/ticker.ts`)

| | |
|---|---|
| html | static: three tabs, the price card, an svg sparkline, the 64-character alphabet the history is quantized with |
| public_data | `{ r, t, c: [{ p, d, lo, hi, h } × 3] }`: price, 24 h change %, the window's low and high, and `h`, the last 30 prices as one character each (64 levels between low and high), about 300 bytes |
| chat_data | none |
| queries | `tick:now` → answers with the current public_data json (the "↻ refresh" link); works from forwarded copies too |

the bot fetches coingecko every 60 s (a self-rescheduling timer, so a slow request never overlaps the next), keeps 30 points per coin and `editShared`s the one shared ticker object. the first `/ticker` creates it with `message.sendWidget(Ticker, { shared: true, ... })` and sets the clients' polling period by resending the current public state with `editShared(id, state, { cacheTime: 20 })`; every later `/ticker` sends the same object with `sendShared`. the widget calls `watchPublicData()` to follow it while on screen. switching tabs is client-side only (and remembered in `localStorage`)

### `/poll` (`src/widgets/poll.ts`)

| | |
|---|---|
| html | template: the question and options, escaped at send time |
| public_data | `{ r, c: [count, …] }`, one object for the poll's every message and forward |
| chat_data | none |
| queries | `vote:<i>` → moves the voter's vote to option `i`, or retracts it when `i` is their current vote. answers `{ r, c, v }`, `v` being the voter's choice (`-1` after a retraction) |

sent shared, so a forward is the same poll: a vote from a forwarded copy arrives as `shared_widget_query` and lands in the same tally (the handler is registered for both kinds). the bot keeps a `voters` map per `widget_id`, one vote per user. the bot never stores the question: the html has it, and an inline poll's `widget_id` only becomes known at its first vote, so the tally is created then. the voter's own choice lives in the answer and in `localStorage`; the shared state holds only counts. in an inline preview or a copy that may not ask, the poll draws read-only

### `/ttt` (`src/widgets/ttt.ts`)

| | |
|---|---|
| html | static: the board, the two seats, the rematch button |
| chat_data | `{ r, b: 'x.o......', x: { i, n, w }, o: { i, n, w }, w: [winning line] \| null }`: board, players (id, first name, wins), the winning cells |
| public_data | none |
| queries | `move:<cell>` places the mover's mark; `rematch:new` clears the board and swaps sides (the other player opens) |

whose turn it is follows from the board (x moves when both have placed equally), so it isn't stored. in a group the first two people to tap take x and o (`from.first_name` goes into `chat_data`); the bot checks every move: the right player, a free cell, the game not over, and refuses with a short text the widget shows. the widget compares `TelegramWidget.viewer.id` with the seats to say "your turn" or "Bob's turn". in private the bot plays the other side with a full minimax (instant, so the same answer carries the bot's reply move), picking at random among equally good moves. the games live in a map keyed by chat and message id

### `/habit` (`src/widgets/habit.ts`)

| | |
|---|---|
| html | template: the habit's name |
| chat_data | `{ r, d, m }`: `m` is an 84-bit day bitmap in hex (bit 0 = day `d`), `d` the user's local day number of the last write |
| public_data | none |
| queries | `done:<utc offset>:<d>:<r>:<m>` → toggles today, answers the new chat_data |

the bot can't know the user's time zone, so the widget sends `getTimezoneOffset()` and the bot computes the user's today from it, shifts the bitmap to it and flips the bit. the widget also sends the state it shows, so the bot keeps nothing for this widget and it survives restarts: fine for a private chat, where the only person who could forge it is its owner. streaks, the heatmap and the month labels are computed client-side from the bitmap and the viewer's clock

### `/countdown` (`src/widgets/countdown.ts`)

| | |
|---|---|
| html | template: the title and the timestamp (shown in each viewer's own locale and time zone) |
| chat_data | `{ r, g: [names], gn, m: [names], mn }`: up to 12 first names per answer plus the totals, trimmed until it fits 1024 bytes; the widget shows "+N" for the rest |
| public_data | none |
| queries | `rsvp:g` / `rsvp:m` → sets the answer, or clears it when it's the current one; answers the new chat_data plus `v`, the user's answer |

the clock ticks client-side with `setInterval` and stops on `deactivated` (restarts on `activated`). a date without a zone (`2026-12-31`, `2026-12-31T21:00`) is read as utc. the bot keeps the answers per message (`chat:message` or `inline_message_id`), so an inline countdown works the same way

## what this recipe leaves out

- **storage and concurrency.** polls, games and rsvps live in memory, not a durable database. the habit widget deliberately trusts its owner's submitted state and is not suitable for rewards or access control. production applications must validate queries against authoritative state, serialize mutations per message and coalesce shared-state edits to at most one per second. swap the maps for [`@puregram/storage`](../../../packages/storage) to persist them
- **the wallet.** `request(data, { wallet: true })` and `wallet.sendTransaction` aren't used here

## see also

- [`@puregram/widgets`](../../../packages/widgets/README.md)
- [telegram's widget sandbox](https://github.com/TelegramMessenger/widget-sandbox): the sdk, the profile of what renders, the harness
- [official widget guide](https://core.telegram.org/bots/widgets)
