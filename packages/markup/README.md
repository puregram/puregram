<div align='center'>
  <img src='https://i.imgur.com/ZzjmE8i.png' />
</div>

<br />

<div align='center'>
  <a href='https://github.com/puregram/puregram'><b><code>puregram</code></b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#available-builders'><b>builders</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#parsers'><b>parsers</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='https://t.me/pureforum'><b>telegram forum</b></a>
</div>

## @puregram/markup

_simple yet powerful markup system for `puregram` package_

### introduction

you all know how you need to provide `parse_mode` every time you send a message with a markdown or html, right? it might get a little boring after the first few hundred times, so i present to you `@puregram/markup`!

instead of stringly-typed concatenation (`HTML.bold('a') + ' ' + HTML.italic('b')`), `@puregram/markup` builds the **`entities` array directly**. no `parse_mode`. no escaping bugs. composable, chainable, taggable as templates, supports html and markdown when you want to paste them in. one plugin install and the rest is just imports. **epic!!!**

### example

```ts
import { Telegram } from 'puregram'
import { markup, format, bold, italic, code } from '@puregram/markup'

const telegram = Telegram.fromToken(process.env.TOKEN!)
  .extend(markup()) // it's a plugin, make sure to plug-it-in :badum_tss:

telegram.onMessage((message) => {
  return message.send(
    format`hey! this ${bold('message')} is ${italic('formatted')} without ${code('parse_mode')}!`
  )
})

await telegram.startPolling()
```

`.extend(markup())` is what hooks the entity-unwrapping into every outgoing api call — without it, your `Formatted` instances would arrive at telegram as `[object Object]`

### installation

```sh
$ yarn add @puregram/markup
$ npm i -S @puregram/markup
```

---

## usage

_almost_ every builder works in two interchangeable forms — pick whichever reads best at the call site:

```ts
// template strings
bold`foo ${italic`bar`}`

// parentheses
bold(italic('bar'))
```

there's literally no distinction between the two for nested calls, **but** if you want to embed markup inside a template string you **have** to use the tagged-template form on both sides — interpolating a `Formatted` value inside a plain backtick string is a footgun:

```ts
// ✅ works
bold`foo ${italic`bar`}`
bold`${italic`bar`}`
bold(italic('bar'))

// ❌ does not work
bold(`foo ${italic('bar')}`)   // template string concat coerces italic('bar') to "[object Object]"
bold(`${italic('foo')}`)
```

modifiers also chain — every modifier exposes every other modifier as a property, so you can stack them without nesting:

```ts
bold.italic('all together')
bold.italic.underline('all three')
bold.italic.underline`tagged form too`
```

chain order is preserved (outermost first), which matters for renderers that care — telegram doesn't, but it's nice to know

**heads up — chaining vs. what telegram actually renders.** at the type level **every** modifier chains to every other modifier — `code.bold(...)`, `pre.italic(...)`, `expandableBlockquote.spoiler(...)` all compile and produce both entities on the wire. but telegram clients have rules that override a few of those combinations:

| chain | what happens |
|---|---|
| text styles within text styles (`bold.italic`, `underline.strikethrough`, `spoiler.bold`, …) | ✅ compounds correctly |
| anything within `blockquote` / `expandableBlockquote` (e.g. `blockquote.bold`) | ✅ inner styles render fine inside the quote |
| anything within `code` (e.g. `code.bold`, `code.italic`) | ❌ inner styles get **dropped** — code renders as monospace plain text on every client |
| `code` within anything (`bold.code`) | ⚠️ renders as monospace; outer style is ignored too |
| nested `blockquote` inside `blockquote` | ⚠️ telegram flattens to a single quote — only one wins |

tldr: stack text styles freely; treat `code` (and `pre`) as a leaf — anything you wrap with or inside them renders as plain monospace

---

<a name='available-builders'></a>
## available builders

### `format(strings, ...rest)`

formats the template and strips the **first** pack of indentation off all lines (works like `stripIndent`):

```ts
format`
  hello!
  those two spaces at the start get stripped
    but those additional two spaces stay
`
```

![`format` result](assets/format.png)

### `formatDedent(strings, ...rest)`

like `format` but strips **every** leading whitespace prefix it can — works like `stripIndents`:

```ts
formatDedent`
  hello!
  those two spaces strip
    these extra two strip too
                      and these eighteen also
`
```

![`formatDedent` result](assets/format-dedent.png)

### `bold(text)`

```ts
bold('hey!')
bold`hey!`
bold.italic('chained')
```

![`bold` result](assets/bold.png)

### `italic(text)`

```ts
italic('hey!')
italic`hey!`
```

![`italic` result](assets/italic.png)

### `code(text)`

```ts
code('const x = 5')
code`const x = 5`
```

![`code` result](assets/code.png)

**note**: `code` *technically* chains (`code.bold(...)` typechecks and emits a `bold` entity) but telegram drops everything inside a `code` span on the wire — the result is monospace plain text. treat `code` as a leaf modifier

### `underline(text)`

```ts
underline('hey!')
```

![`underline` result](assets/underline.png)

### `strikethrough(text)`

```ts
strikethrough('hey!')
```

![`strikethrough` result](assets/strikethrough.png)

### `spoiler(text)`

```ts
spoiler('hey!')
```

![`spoiler` result](assets/spoiler.png)

### `blockquote(text)` / `expandableBlockquote(text)`

```ts
blockquote`first line
second line`

expandableBlockquote`one line
two lines
three lines (telegram needs >3 lines for the expand UI)
four lines
five lines`
```

![`blockquote` + `expandableBlockquote` result](assets/blockquote.png)

### `link(text, url)` / `link(url)`

```ts
// eager: text + url positionally
link('puregram on github', 'https://github.com/puregram/puregram')

// curried, tagged-template — useful when you want to embed a wrapped piece in a template
link('https://core.telegram.org/bots/api')`bot api docs`

// curried, parens form — same shape as above
link('https://t.me/pureforum')('the forum')
```

![`link` result](assets/link.png)

### `pre(text, language?)`

```ts
pre('console.log("hi")', 'js')   // 2-arg eager form (with language)
pre`unhighlighted block`         // tagged-template, no language
pre()`also unhighlighted`        // curried, no language
```

![`pre` result](assets/pre.png)

**note**: curried-with-language is intentionally not supported — use the 2-arg eager form when you need a `language` highlight

**note**: same monospace-leaf rule as `code` — `pre` content is rendered verbatim, any inner formatting is stripped by telegram clients

### `mentionUser(text, userId)`

generates a `text_mention` entity that links to a user by id, even if you don't have a `username`:

```ts
mentionUser('dude', 398859857)
```

![`mentionUser` result](assets/mention-user.png)

### `mentionBot(text, botId)`

same as `mentionUser` but synthesises `is_bot: true` on the user payload, so the resulting mention follows bot-mention semantics:

```ts
mentionBot('robodude', telegram.bot.id)
```

![`mentionBot` result](assets/mention-bot.png)

### `textMention(text, user)`

if you already have a full bot-api `User` object, pass it through verbatim:

```ts
textMention('dude', { id: 398859857, is_bot: false, first_name: 'dude' })
```

![`textMention` result](assets/text-mention.png)

### `customEmoji(text, customEmojiId)`

```ts
customEmoji('😁', '5448765217123141')
```

![`customEmoji` result](assets/custom-emoji.png)

### `time(text, when, format?)` / `time(when, format?)`

attaches a `date_time` entity that telegram clients render in the recipient's locale + timezone. accepts a unix timestamp (seconds) or a `Date`:

```ts
time('see you', new Date(), { dateStyle: 'short', timeStyle: 'short' })

// curried form:
time(new Date(), { relative: true })`see you`
```

![`time` result](assets/time.png)

#### `TimeFormat`

`TimeFormat` is a structured wrapper around telegram's underlying `date_time_format` wire string (the cryptic `r|w?[dD]?[tT]?` pattern). every field maps to one flag character:

| field | flag | meaning | example |
|---|---|---|---|
| `relative: true` | `r` | renders relative to "now" — "in 3 minutes", "5 hours ago". **mutually exclusive** with every other flag | `in 5 minutes` |
| `weekday: true` | `w` | prepend the day of the week in the recipient's locale | `Monday` |
| `dateStyle: 'short'` | `d` | short-form date | `17.03.22` |
| `dateStyle: 'long'` | `D` | long-form date | `March 17, 2022` |
| `timeStyle: 'short'` | `t` | short-form time | `22:45` |
| `timeStyle: 'long'` | `T` | long-form time | `22:45:00` |

flag order is fixed by telegram's parser — `w` first, then `d`/`D`, then `t`/`T`. you don't have to think about it; the structured form composes them automatically. throws `RangeError` if you set `relative: true` alongside any other flag

#### legal combinations

| `TimeFormat` | wire flag | example output |
|---|---|---|
| _omitted_ or `{}` | _empty_ | just the unix instant — telegram client picks a sensible default |
| `{ relative: true }` | `r` | `in 5 minutes` |
| `{ weekday: true }` | `w` | `Monday` |
| `{ dateStyle: 'short' }` | `d` | `17.03.22` |
| `{ dateStyle: 'long' }` | `D` | `March 17, 2022` |
| `{ timeStyle: 'short' }` | `t` | `22:45` |
| `{ timeStyle: 'long' }` | `T` | `22:45:00` |
| `{ weekday: true, dateStyle: 'short' }` | `wd` | `Monday, 17.03.22` |
| `{ weekday: true, timeStyle: 'short' }` | `wt` | `Monday, 22:45` |
| `{ dateStyle: 'short', timeStyle: 'short' }` | `dt` | `17.03.22, 22:45` |
| `{ dateStyle: 'long', timeStyle: 'long' }` | `DT` | `March 17, 2022, 22:45:00` |
| `{ weekday: true, dateStyle: 'long', timeStyle: 'short' }` | `wDt` | `Monday, March 17, 2022, 22:45` |

mix and match `weekday`/`dateStyle`/`timeStyle` freely. `relative` stands alone

### `join(items, separator)` / `joinWithEntities(parts, separator)`

`Array.prototype.join` for `Formatted` values — preserves entities across pieces:

```ts
const items = ['alpha', 'beta', 'gamma']

format`pick: ${join(items.map(s => bold(s)), ', ')}`
```

![`join` result](assets/join.png)

`joinWithEntities` is the lower-level form that accepts pre-built `Formatted` parts directly

---

<a name='parsers'></a>
## parsers

if you've already got an html or markdown string from somewhere — a database, a config file, a llm — paste it in. each parser produces the same `Formatted` shape every builder does, so the result drops into `message.send(...)` with `markup()` installed and no `parse_mode` needed

### `html` / `htmlb`

parses telegram's html flavor. supports both function-call and tagged-template forms (interpolated values are escaped automatically):

```ts
import { html } from '@puregram/markup'

await message.send(html`
  hello, <b>${userName}</b>!
  <i>italic</i> · <u>underline</u> · <s>strike</s> · <tg-spoiler>secret</tg-spoiler>
  <code>inline</code> · <a href="https://x.com">link</a>
  <blockquote>quoted line</blockquote>
  <blockquote expandable>line 1
  line 2
  line 3
  line 4 — needs >3 lines for the expand UI</blockquote>
`)
```

![`html` result](assets/html.png)

`htmlb` is the same thing but with `<br>` for explicit newlines (regular `html` collapses whitespace). pick `htmlb` when your html arrives without the conventional `\n` newline-as-significant model:

```ts
htmlb`
  first line <br>
  second line <br>
  <b>third line, <br>
  still bold across breaks</b>
`
```

![`htmlb` result](assets/htmlb.png)

#### custom html tags

extend the parser with your own tags. the handler receives the inner `Formatted` content + a `TagInfo` describing where it sat in the source:

```ts
import { html, Formatted } from '@puregram/markup'

html.define({
  upper: content => new Formatted(content.text.toUpperCase(), content.entities)
})

html`shouting: <upper>quietly</upper>`
// → "shouting: QUIETLY"
```

_isn't this sick af???_

`html.define(...)` mutates the global `html`/`htmlb` registry — any later `html`-tagged template anywhere sees the new tag

when you want a scoped registry that doesn't bleed, use `html.with(...)`:

```ts
const fancy = html.with({
  h1: c => new Formatted(`H1: ${c.text}`, c.entities)
})

fancy`<h1>title</h1>`   // works — scoped to `fancy`
html`<h1>title</h1>`    // throws — `h1` isn't in the global registry
```

### `md` / `markdown`

parses markdown v2 (telegram's flavor). same call/tagged-template duality:

```ts
import { md } from '@puregram/markup'

await message.send(md`
  *bold* _italic_ __underline__ ~strike~ ||spoiler||
  [link](https://x.com), [tg user mention](tg://user?id=${message.from?.id ?? 0})
  \`code\`, then a fenced block:
  \`\`\`js
  console.log('hello')
  \`\`\`
  > regular quote
  > continues here
  >> expandable line 1
  >> expandable line 2
`)
```

![`md` result](assets/md.png)

`markdown` is just an alias of `md` for spell-it-out preference. interpolated values are auto-escaped, so user input in `tg://user?id=${userId}` and similar can't break the syntax

delimiters follow telegram's MarkdownV2 exactly — `*bold*`, `_italic_`, `__underline__`, `~strike~`, `||spoiler||`. the doubled `**bold**` / `~~strike~~` spellings are also accepted as a convenience, but note telegram itself renders those as plain text, so never hand them to `parse_mode: 'MarkdownV2'`

---

## codec — hydrate, serialize, parse permissively

`Formatted` is a two-way pipe. you can hydrate one from any incoming message, walk it back into html or markdown source, and parse foreign markup permissively when you don't trust the input

### `Formatted.fromMessage(msg)`

hydrates a `Formatted` from a `MessageUpdate` (or any `{text, entities, caption, caption_entities}` shape). picks `text`+`entities` when present, otherwise falls back to `caption`+`caption_entities`:

```ts
tg.command('quote', async (message) => {
  const reply = message.replyToMessage

  if (reply == null) {
    return
  }

  // preserves the user's original formatting — bold stays bold, links stay clickable
  const original = Formatted.fromMessage(reply)

  await message.send(format`
    you said:
    ${original}
  `)
})
```

round-trip safe — `Formatted.fromMessage(msg).toPayload()` reproduces the original `{text, entities}` pair byte-for-byte. `toPayload()` returns the plain bot-api shape if you'd rather work with that directly than with the `Formatted` instance

### `formatted.toHtml()` / `formatted.toMarkdown()`

serializes a `Formatted` back into html or markdown v2 source. round-trips: `html\`<b>hi</b>\`.toHtml()` returns `<b>hi</b>` (modulo nesting order — both `<i><b>x</b></i>` and `<b><i>x</i></b>` parse to the same entity set). properly escapes specials, emits nested tags for nested entities, handles non-rectangular entities (text_link with url, custom_emoji with id, pre with language, text_mention with user)

```ts
const f = format`${bold('build:')} ${italic('passing')}`

console.log(f.toHtml())       // "<b>build:</b> <i>passing</i>"
console.log(f.toMarkdown())   // "**build:** _passing_"
```

also available as standalone `toHtml(source)` / `toMarkdown(source)` if you'd rather operate on raw `{text, entities}` pairs without wrapping in `Formatted` first

useful for logging messages in a readable form, persisting drafts to a database, or exporting outside telegram

### `md.lenient(input)` / `html.lenient(input)` / `htmlb.lenient(input)`

strict parsing throws `MarkupParseError` on malformed input — great for catching bugs in code you wrote, terrible for llm-generated markdown that breaks every other token. the lenient variants swallow parse errors and return a plain-text `Formatted` instead:

```ts
const broken = '**unclosed bold and [a link with no url'

md(broken)         // throws MarkupParseError
md.lenient(broken) // returns Formatted { text: broken, entities: [] } — no throw
```

well-formed input parses identically to the strict form. `html.lenient` and `htmlb.lenient` mirror the same shape for html parsing

api choice — `md.lenient(input)` was picked over `md(input, { onError: 'plain' })` because the tagged-template form already eats the second-argument slot for interpolations. a separate method keeps the call site obvious at a glance and avoids the "did you mean the strict form?" footgun

---

## hand-rolling a `Formatted` value

every builder ultimately produces a `Formatted` — text + an array of bot-api entities. you can build one yourself when none of the conveniences fit:

```ts
import { Formatted } from '@puregram/markup'

const f = new Formatted('hello world', [
  { type: 'bold', offset: 0, length: 5 },
  { type: 'italic', offset: 6, length: 5 }
])

await message.send(f)
```

useful for porting code that already produces a `{ text, entities[] }` shape from somewhere else

the constructor copies the array and drops zero-length entities, so later mutations of your array can't corrupt the value and telegram never sees an entity it silently discards

---

## errors

`MarkupParseError` is thrown by `html`, `htmlb`, `md` and the custom-tag handlers when input doesn't parse. carries the source position + the offending source so you can build helpful diagnostics:

```ts
import { md, MarkupParseError } from '@puregram/markup'

try {
  md`broken **bold`
} catch (error) {
  if (error instanceof MarkupParseError) {
    console.error(error.message, 'at offset', error.position)
  }
}
```

strict parsing also refuses input telegram itself would mangle or that would corrupt an interpolation:

| input | why |
| --- | --- |
| `&#x110000;`, `&#xD800;`, `&#1;` | outside the unicode scalar range, or a control character |
| `U+0001` anywhere in the source | reserved as the interpolation delimiter — a literal one could forge a slot |
| nesting past 32 levels, in markdown or custom tags | recursion bound; the lenient variants degrade instead of overflowing the stack |
| a custom-tag handler returning anything but a `Formatted` / `{ text, entities? }` | otherwise the message carries the string `"undefined"` |

`time('x', new Date('nope'))` throws `RangeError` for the same reason — `unix_time` must be a finite number or telegram answers 400

---

## typescript usage

```ts
import type {
  Entity,           // single bot-api MessageEntity shape
  HtmlCallable,     // type of `html` and `htmlb`
  Modifier,         // type of `bold`, `italic`, etc — chainable callable
  ModifierName,     // 'bold' | 'italic' | 'underline' | …
  TagDefinitions,   // Record<string, TagHandler> for html.define / html.with
  TagHandler,       // (content: Formatted, info: TagInfo) => Formatted
  TagInfo,          // metadata passed to a TagHandler (tag, attrs, parent, …)
  TimeFormat        // shape of the time() format options
} from '@puregram/markup'
```
