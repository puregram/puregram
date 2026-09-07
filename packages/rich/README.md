## @puregram/rich

_native rich-message authoring for `puregram` — builders, safe templates, dialect parsers_

### introduction

telegram's **rich messages** are structured content — headings, lists, code blocks, tables, media, formulas. the bot api accepts them as native `blocks` or as a raw markdown/html string parsed server-side. `@puregram/rich` authors the native form: builders and template tags emit `TelegramInputRichBlock[]` directly, so what you send is exactly what telegram renders.

interpolation is safe by construction — `${…}` values are spliced into the block tree as values, never concatenated into the source string. a user-supplied `'**not bold**'` stays literal text.

### quick start

```ts
import { rich } from '@puregram/rich'

// inside a message handler
await message.sendRich(rich.md`
  # ${title}

  ${rich.bold('status:')} ${status}

  ${rich.list(items)}
`)
```

### installation

```sh
$ yarn add @puregram/rich
$ npm i -S @puregram/rich
```

---

## parse tags

`rich.md` / `rich.markdown` / `rich.html` **parse** their input into native blocks. three call forms:

```ts
rich.md`# ${title}`               // tagged template — parses, splices ${…} safely
rich.md('# from a string')        // string call — parses the string
rich.md([rich.h1('from data')])   // builder array — emits directly, no parsing
```

markdown templates are **dedented** (common leading indentation stripped) so you can write at the natural indent level of your code; html templates are not.

the accepted grammar is the rich dialect telegram itself parses: headings, fenced code (` ```lang ` and ` ```math `), `$…$` / `$$…$$` formulas, dividers, quotes, bullet / ordered / task lists, gfm tables, footnotes, lone `![](url)` media lines, `**bold**` `*italic*` `~~strike~~` `||spoiler||` `==marked==` `` `code` `` inline runs, links, `tg://` emoji/time images, backslash escapes, numeric entities.

### interpolation

| interpolated value | what happens |
|---|---|
| `string` | spliced as literal text — never parsed as syntax |
| `number` | stringified |
| inline builder | spliced into the surrounding text |
| block builder | spliced as its own block(s) — surrounding paragraph prose splits around it; throws inside headings, cells, and other inline-only slots |
| blocks `Rich` fragment | spliced at block level |
| `array` | each item spliced in order |
| `null` / `undefined` / `false` | nothing |

block splicing works in both dialects: `${rich.list(items)}` becomes its own block wherever it lands, and prose around it stays in paragraphs. html templates can also express block structure with plain tags (`<hr/>`, `<pre>`, …).

```ts
const evil = '**not bold** <b>nope</b>'

rich.md`hello ${evil}`.blocks
// → [{ type: 'paragraph', text: ['hello ', '**not bold** <b>nope</b>'] }]
```

### strict and lenient parsing

by default a source string that breaks the grammar throws `RichParseError` with the offending `position` — an unclosed `**`, an unknown `&entity;`, media in the middle of a paragraph. `.lenient` degrades unsupported constructs to literal text instead:

```ts
rich.md.lenient('**oops').blocks
// → [{ type: 'paragraph', text: '**oops' }]
```

`.lenient` exists on every parse tag and takes the string or template form.

---

## composing without a template

`rich(…)` itself composes content — builders, strings, arrays, blocks `Rich` fragments — into a blocks envelope. runs of inline content coalesce into paragraphs:

```ts
rich(['hi ', rich.bold('there')]).blocks
// → [{ type: 'paragraph', text: ['hi ', { type: 'bold', text: 'there' }] }]

rich([
  rich.h1(title),
  rich.list(items.map(i => i.text)),
  rich.codeBlock(snippet, 'ts')
])
```

`rich` also works as a **compose template tag** — no parsing at all: literal text stays literal (no markdown/html tokens apply), interpolated values splice like everywhere else, blank lines separate paragraphs, and the skeleton dedents:

```ts
rich`
  **not markdown** — this renders literally

  status: ${rich.bold('live')}

  ${rich.list(items)}
`
```

---

## inline builders

| builder | emits |
|---|---|
| `rich.bold(x)` / `rich.italic(x)` / `rich.underline(x)` / `rich.strikethrough(x)` / `rich.spoiler(x)` / `rich.code(x)` / `rich.marked(x)` / `rich.subscript(x)` / `rich.superscript(x)` | `{ type, text }` |
| `rich.link(text, url)` | `{ type: 'url', text, url }` |
| `rich.mentionUser(text, userId, options?)` | `{ type: 'text_mention', text, user }` — a real user object, works without a username. `options`: `{ firstName?, lastName?, username?, isBot? }` |
| `rich.math(latex)` | `{ type: 'mathematical_expression', expression }` |
| `rich.customEmoji(id, alt)` | `{ type: 'custom_emoji', … }` |
| `rich.time(label, unix, format?)` | `{ type: 'date_time', … }` |
| `rich.reference(text, name)` | `{ type: 'anchor_link', … }` — links to an `anchor(name)` |
| `rich.anchor(name)` | `{ type: 'anchor', name }` |
| `rich.footnoteRef(id, label?)` | `{ type: 'reference_link', … }` — pairs with `footnote(id, …)` |
| `rich.button(label, options)` | `{ type: 'button', button }` — an interactive button inside the text run; see [buttons](#buttons) |

content args (`x`, `text`) accept `RichContent` — strings, numbers, nested inline builders, arrays.

---

## block builders

| builder | notes |
|---|---|
| `rich.heading(level, content)` | `level` is `1`–`6`; `rich.h1(content)`…`rich.h6(content)` are aliases |
| `rich.paragraph(content)` | plain paragraph |
| `rich.codeBlock(code, language?)` | preformatted; `code` is a raw string |
| `rich.blockquote(content, credit?)` | nested blocks, optional credit line |
| `rich.expandableBlockquote(content, credit?)` | collapsed-by-default quote; inline text, not nested blocks |
| `rich.divider()` | horizontal rule |
| `rich.list(items)` | unordered list; each item becomes its own block list |
| `rich.orderedList(items, { start?, type? })` | `start` seeds numbering; `type` picks the label style: `'a' \| 'A' \| 'i' \| 'I' \| '1'` |
| `rich.taskList(items)` | `items` is `{ text, done? }[]` — checkbox list |
| `rich.details(summary, body, { open? })` | collapsible block |
| `rich.mathBlock(latex)` | block-level formula |
| `rich.footer(content)` | footer block |
| `rich.pullQuote(content, cite?)` | pull quote, optional credit |
| `rich.thinking(content)` | "thinking…" placeholder — **draft-only**, legal in `sendRichMessageDraft` and never in a persisted message |
| `rich.media(src, { type?, caption?, credit?, spoiler? })` | media block; `type` picks the kind, otherwise inferred from the extension of the url **path** (query and fragment are ignored) — document-ish extensions (`pdf`, `zip`, `docx`, `csv`, …) infer `document`, anything unrecognized falls back to `photo` |
| `rich.photo(src, opts?)` / `rich.video(src, opts?)` / `rich.audio(src, opts?)` / `rich.animation(src, opts?)` | `media` with the kind fixed |
| `rich.voiceNote(src, opts?)` | voice note (no spoiler) |
| `rich.document(src, opts?)` | general file (no spoiler) |
| `rich.map(lat, long, { zoom?, width?, height?, caption?, credit? })` | static map; defaults `zoom: 15`, `900×450`. `zoom` is 0–24, the sides must sum to at most 10000 and differ by at most 20× — outside that throws `RichError` |
| `rich.collage(items, { caption?, credit? })` / `rich.slideshow(items, { caption?, credit? })` | groups of media blocks |
| `rich.table(rows, { header?, align?, bordered?, striped?, compact?, caption? })` | rows of inline cells; the first row is the header unless `header: false`; `align` is per-column; `compact` gives the cells smaller indents |
| `rich.footnote(id, definition)` | the text behind a `footnoteRef(id)` marker |
| `rich.buttonRow(buttons, { align? })` | a row of 1–8 `rich.button(…)` nodes — see [buttons](#buttons) |

captions everywhere take `{ caption, credit }` — a `credit` without a `caption` throws `RichError`. `spoiler` applies to photo / video / animation only.

### media sources

`src` is an http(s) url string **or** a puregram `MediaSource.*` envelope — `MediaSource.path`, `.buffer`, `.stream`, `.fileId`, `.url`. envelopes travel through the block untouched and resolve at send time in puregram core: `fileId`/`url` substitute as plain strings, `path`/`buffer`/`stream` upload via multipart.

```ts
import { MediaSource } from 'puregram'

rich([
  rich.photo(MediaSource.path('./chart.png'), { caption: 'q3 numbers' }),
  rich.video('https://cdn.example.com/clip.mp4', { spoiler: true })
])
```

**aliases:** `h1`–`h6` (`heading`), `quote` (`blockquote`), `expandableQuote` (`expandableBlockquote`), `pre` (`codeBlock`), `hr` (`divider`), `strike` (`strikethrough`), `sub` / `sup` (`subscript` / `superscript`), `mention` (`mentionUser`), `emoji` (`customEmoji`), `fn` / `fnRef` (`footnote` / `footnoteRef`).

### buttons

`rich.button(label, options)` is **inline** — it renders inside the surrounding text run. `options` must carry exactly one action; none or several throws `RichError`:

| option | action |
|---|---|
| `url` | open a link |
| `callbackData` | send a callback query back to the bot |
| `webApp` | url string — open a web app |
| `loginUrl` | url string, or `{ url, forwardText?, botUsername?, requestWriteAccess? }` |
| `switchInlineQuery` | pick a chat, then open inline mode there with the query |
| `switchInlineQueryCurrentChat` | open inline mode in the current chat |
| `switchInlineQueryChosenChat` | `{ query?, allowUserChats?, allowBotChats?, allowGroupChats?, allowChannelChats? }` |
| `copyText` | copy the string to the clipboard |
| `disabled: true` | rendered but inert |

`style` sits alongside the action and picks the accent: `'danger' | 'success' | 'primary' | 'link'`. telegram allows `'link'` on callback buttons only, and a label may hold nothing but plain text, `rich.customEmoji(…)` and `rich.time(…)` — anything else throws `RichError`.

`rich.buttonRow(buttons, { align? })` is a **block** holding 1–8 buttons, aligned `'left' | 'center' | 'right'`. an empty row, more than 8 buttons, or a node that isn't a `rich.button(…)` throws `RichError`.

```ts
rich([
  rich.paragraph(['read the ', rich.button('docs', { url: 'https://puregram.cool' })]),
  rich.buttonRow([
    rich.button('yes', { callbackData: 'vote:yes', style: 'success' }),
    rich.button('no', { callbackData: 'vote:no', style: 'danger' })
  ], { align: 'center' })
])
```

### dialect forms

both dialects spell the newer constructs with the same html tags — markdown has no native syntax for buttons or collapsed quotes, and the markdown parser hands html fragments to the html parser:

| construct | html | markdown |
|---|---|---|
| `button` | `<tg-button type="…">label</tg-button>` | the same tag |
| `buttonRow` | `<tg-button-row align="…">…</tg-button-row>` | the same tag |
| `document` | `<tg-document src="…"></tg-document>` | `![](url "caption")` |
| `expandableBlockquote` | `<blockquote expandable>` — the parser also accepts `collapsed` | the same tag |
| `table({ compact })` | `<table compact>` | accepted as html; dropped by `.toMarkdown()` — gfm tables carry no flags |

a `<tg-button>` names its action through `type` plus one value attribute: `url=` (`url`, `web_app`, `login_url`), `data=` (`callback_data`), `query=` (the three `switch_inline_query*` types), `text=` (`copy_text`); `type="disabled"` takes none. `style=` is optional, and the boolean extras are bare attributes — `request-write-access`, `allow-user-chats`, `allow-bot-chats`, `allow-group-chats`, `allow-channel-chats`, plus `forward-text="…"`. a `loginUrl.botUsername` has no dialect attribute at all, so serializing that button throws `RichError` — send it as native blocks.

---

## composition helpers

### `rich.join(items, separator?)`

joins an array of content with a separator (default `''`). any block item makes the result a block list, and an inline separator between two blocks becomes its own paragraph:

```ts
rich.md`tags: ${rich.join(tags.map(t => rich.code(t)), ', ')}`
```

### `rich.br()`

hard line break inside inline content.

---

## raw passthrough

`rich.raw.md` / `rich.raw.markdown` / `rich.raw.html` skip parsing entirely — the string travels as a raw dialect payload and telegram parses it server-side. use it for pre-authored or LLM-generated strings already in the rich grammar:

```ts
rich.raw.md('# raw **stuff**').toInputRichMessage()
// → { markdown: '# raw **stuff**' }
```

a raw string can reference uploads through `tg://…?id=` links backed by `media` entries:

```ts
rich.raw.md('![](tg://photo?id=m1)', {
  media: [{ id: 'm1', media: { type: 'photo', media: 'https://x.test/a.jpg' } }]
})
```

raw envelopes expose no `.blocks` and cannot be composed into a blocks envelope or spliced into a template — parse them or use builders instead.

---

## the `Rich` envelope

every composition, parse, or raw call returns a `Rich`:

```ts
class Rich {
  readonly dialect: 'blocks' | 'markdown' | 'html'
  readonly content: TelegramInputRichBlock[] | string
  readonly media?: TelegramInputRichMessageMedia[]

  get blocks(): TelegramInputRichBlock[] | undefined  // undefined for raw envelopes

  rtl(value?: boolean): this                // mark right-to-left
  noEntityDetection(value?: boolean): this  // disable auto link/mention detection

  toMarkdown(): string                      // serialize blocks → rich-markdown source
  toHtml(): string                          // serialize blocks → rich-html source

  toInputRichMessage(): TelegramInputRichMessage
  // → { blocks } | { markdown } | { html }, plus media?, is_rtl?, skip_entity_detection?

  toJSON(): TelegramInputRichMessage
}
```

```ts
const r = rich.md`# hello`

r.toInputRichMessage()
// → { blocks: [{ type: 'heading', text: 'hello', size: 1 }] }

r.rtl().noEntityDetection().toInputRichMessage()
// → { blocks: […], is_rtl: true, skip_entity_detection: true }

r.toMarkdown()
// → '# hello'
```

`.toMarkdown()` / `.toHtml()` are for interop and debugging — they round-trip a blocks envelope into dialect source. a raw envelope only serializes to its own dialect; cross-dialect throws `RichError`, as does serializing blocks whose media are unresolved `MediaSource` envelopes (urls only).

---

## sending

per-update shortcuts fill `chat_id` and `message_id` automatically:

```ts
import { rich } from '@puregram/rich'

// inside a message handler
await message.sendRich(rich.html`
  <h1>${title}</h1>
  <p>sent by ${rich.mentionUser(authorName, authorId)}</p>
  <hr/>
  <pre><code class="language-ts">${snippet}</code></pre>
`)

// reply to the incoming message
await message.replyWithRich(rich.md`# ${heading}`)

// edit the bot's own message to rich content
await message.editRich(rich.md`# updated`)
```

a `Rich` value can also be passed directly to `telegram.api.sendRichMessage` — `rich_message` accepts `TelegramInputRichMessage | RichLike` and `Rich` implements `RichLike`:

```ts
await telegram.api.sendRichMessage({
  chat_id,
  rich_message: rich.md`# ${title}`
})
```

`.toInputRichMessage()` is still available as a low-level escape hatch when you need the raw shape.

### inline queries

`InputMessageContent.rich(richObject)` in core accepts a `Rich` directly — use it to send structured rich content as the body of an inline-query result:

```ts
import { rich } from '@puregram/rich'
import { InlineQueryResult, InputMessageContent } from 'puregram'

telegram.on('inline_query', async (query) => {
  await query.answer([
    InlineQueryResult.article({
      id: '1',
      title: 'rich result',
      content: InputMessageContent.rich(rich.md`
        # ${query.query}

        what is **up**
      `)
    })
  ])
})
```

the callable form auto-unwraps the `Rich` envelope (calls `.toInputRichMessage()` and wraps in `{ rich_message: … }`). the `.md` / `.markdown` / `.html` sub-forms build from a raw dialect string.

---

## errors

- `RichError` — misuse: a block builder inside inline content, a `credit` without a `caption`, a raw envelope composed into blocks, cross-dialect serialization.
- `RichParseError extends RichError` — a source string breaks the grammar in strict mode; carries `.position` (offset into `.source`).

```ts
import { RichParseError, rich } from '@puregram/rich'

try {
  rich.md('**oops')
} catch (error) {
  if (error instanceof RichParseError) {
    console.error(error.message, error.position)
  }
}
```

---

## custom nodes

`makeNode(level, emit)` builds a node any builder position accepts — `level` is `'inline' | 'block'`, `emit` returns the native structure:

```ts
import { type RichContent, emitText, makeNode } from '@puregram/rich'

const shout = (content: RichContent) =>
  makeNode('inline', () => ({ type: 'bold', text: { type: 'underline', text: emitText(content) } }))

rich.md`really ${shout('loud')}`
```

`emitText(content)` resolves content into `TelegramRichText`; `emitBlocks(content)` resolves it into a block list, coalescing inline runs into paragraphs.

---

## typescript

```ts
import {
  rich,             // the namespace — callable, tags, raw, builders
  Rich,             // the envelope class
  RichError, RichParseError,
  makeNode, isRichNode,
  emitText, emitBlocks,
  parseMarkdown, parseHtml,   // (source, { lenient? }) → TelegramInputRichBlock[]
  serializeBlocks             // (blocks, 'markdown' | 'html') → string
} from '@puregram/rich'

import type {
  RichContent,      // string | number | RichNode | Rich | null | undefined | false | RichContent[]
  RichNode,         // { level: 'inline' | 'block', emit(): RichEmit }
  RichEmit,         // TelegramRichText | TelegramInputRichBlock | TelegramInputRichBlock[]
  Dialect,          // 'markdown' | 'html'
  RichParseTag,     // the type of rich.md / rich.html
  RawOptions,       // { media?: TelegramInputRichMessageMedia[] }
  RichMediaSource,  // string | RichMediaInput (a MediaSource.* envelope)
  RichMediaKind     // 'photo' | 'video' | 'audio' | 'animation' | 'voice_note' | 'document'
} from '@puregram/rich'
```

---

## migrating from 3.1

- template tags and builders now emit native `blocks` — `.content` is a `TelegramInputRichBlock[]` and `toInputRichMessage()` produces `{ blocks }` instead of `{ markdown }` / `{ html }`.
- the string call form `rich.md('…')` now **parses**; raw string passthrough moved to `rich.raw.md('…')` / `rich.raw.html('…')`.
- dialect rendering is replaced by the `.toMarkdown()` / `.toHtml()` serializers.
- media builders accept `MediaSource.*` envelopes in addition to urls.
