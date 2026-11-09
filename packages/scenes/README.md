<div align='center'>
  <img src='https://i.imgur.com/ZzjmE8i.png' />
</div>

<br />

<div align='center'>
  <a href='https://github.com/puregram/puregram'><b><code>puregram</code></b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#typescript-usage'><b>typescript usage</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='#methods--getters'><b>methods & getters</b></a>
  <span>&nbsp;•&nbsp;</span>
  <a href='https://t.me/pureforum'><b>telegram forum</b></a>
</div>

## @puregram/scenes

_simple implementation of middleware-based scene management for `puregram` package_

### introduction

`@puregram/scenes` helps you organize step-by-step handlers — think signup wizards, multi-question forms, anything where the bot has to ask, the user has to answer, and the bot has to remember "where we are in the conversation". one plugin install, a `StepScene` per flow, and you're done

state is persisted between updates by `@puregram/session`, so a user staying mid-form across a bot restart works out of the box if your session backend is persistent

### example

```ts
import { Telegram } from 'puregram'
import { session } from '@puregram/session'
import { scenes, StepScene } from '@puregram/scenes'

const signup = new StepScene('signup', [
  (message) => {
    if (message.scene.step.firstTime || !message.hasText()) {
      return message.send("what's your name?")
    }

    message.scene.state.firstName = message.text

    return message.scene.step.next()
  },

  (message) => {
    if (message.scene.step.firstTime || !message.hasText()) {
      return message.send('how old are you?')
    }

    message.scene.state.age = Number.parseInt(message.text, 10)

    return message.scene.step.next()
  },

  async (message) => {
    const { firstName, age } = message.scene.state

    await message.send(`you are ${firstName}, ${age} years old!`)

    // last step — calling next() leaves the scene
    return message.scene.step.next()
  }
])

const telegram = Telegram.fromToken(process.env.TOKEN!)
  .extend(session())
  .extend(scenes({ scenes: [signup] }))

telegram.onMessage((message) => {
  if (message.text === '/signup') {
    return message.scene.enter('signup')
  }
})

await telegram.startPolling()
```

### installation

```sh
$ yarn add @puregram/scenes
$ npm i -S @puregram/scenes
```

`@puregram/scenes` requires `@puregram/session` — install both. they're listed as peer-deps and the plugin's `dependsOn: ['session']` will throw `PluginMissingDep` at start time if you forget

---

## how it works

three pieces:

- **`StepScene`** — a named, ordered list of step handlers. each handler can read+write `scene.state`, advance with `scene.step.next()`, jump with `scene.step.go(id)`, or bail out with `scene.leave()`. the same handler is invoked for every update that lands while you're sitting on its step
- **`scenes({ scenes: [...] })`** — the plugin install. registers a high-priority `onUpdate` middleware that:
  - attaches `update.scene` (a `SceneContext`) to every update
  - if the user has an active scene, dispatches the update into the current step instead of letting it flow to your normal handlers
  - exposes `telegram.scenes` for runtime registry mutation (`add` / `has` / `remove` / `all`)
- **the session-backed state** — `update.session.__scene` is where `{ current, state, stepId, firstTime }` actually lives. you don't normally touch it directly; `update.scene.*` is the api. but it's useful to know when you want to inspect another user's scene status (see [advanced patterns](#advanced))

active-scene dispatch is **opt-out**: any update from a user with an active scene goes to that scene by default. provide `passthrough` to whitelist updates that should escape (e.g. global `/help` and `/cancel`)

bot api 10.4 `widget_query` and `shared_widget_query` also receive `scene`. inline/shared queries are keyed by their sender; session defaults keep these chatless conversations separate from the same user's chat-scoped sessions.

---

<a name='typescript-usage'></a>
## typescript usage

`@puregram/scenes` already attaches `scene: SceneContext<SceneState>` to every update kind via codegen. with no extra type setup, `message.scene.state` is `SceneState` (an empty user-augmentable interface).

scope a step scene to a specific update kind by passing it as the second generic — handler args narrow accordingly:

```ts
import type { MessageUpdate } from '@puregram/api'
import { StepScene } from '@puregram/scenes'

new StepScene<{ firstName: string, age: number }, MessageUpdate>('signup', [
  (message) => {
    // message is MessageUpdate — message.text, message.send(...), message.hasText() all available
    // message.scene.state is { firstName, age }
  }
])
```

if you want different update kinds across steps (callback query in step 1, message in step 2), pass `MessageUpdate | CallbackQueryUpdate` as `U` and narrow inside each step with `update.is('message')`:

```ts
import type { CallbackQueryUpdate, MessageUpdate } from '@puregram/api'

new StepScene<MyState, MessageUpdate | CallbackQueryUpdate>('mixed', [
  (update) => {
    if (update.is('callback_query')) {
      // typed as CallbackQueryUpdate
      return update.answer({ text: 'pick a button below' })
    }

    // typed as MessageUpdate
    return update.send('please tap a button')
  }
])
```

want a global default `SceneState` shape? declare-merge it once:

```ts
declare module '@puregram/scenes' {
  interface SceneState {
    firstName: string
    age: number
  }
}
```

---

<a name='methods--getters'></a>
## list of methods & getters

### `update.scene`

attached to every update by the plugin. returns a `SceneContext` (a `StepSceneContext`-flavored one inside step bodies)

#### `current`

_returns_: `SceneInterface | undefined`

the active scene resolved from `session.__scene.current`, or `undefined`

#### `state`

_returns_: `SceneState` (or whatever generic `S` you supplied)

per-scene user state. lives at `session.__scene.state`. mutate freely — flushed when the handler chain returns

#### `enter(slug, options?)`

_returns_: `Promise<void>`

enter the scene named `slug`, optionally seeding initial `state`

```ts
await message.scene.enter('signup')
await message.scene.enter('signup', { state: { firstName: '' } })
await message.scene.enter('signup', { silent: true }) // skip enterHandler
```

#### `leave(options?)`

_returns_: `Promise<void>`

leave the current scene. `cancelled: true` surfaces inside the scene's `leaveHandler` via `scene.cancelled` — useful for distinguishing graceful finish vs. user-aborted

```ts
await message.scene.leave()
await message.scene.leave({ cancelled: true })
await message.scene.leave({ silent: true }) // skip leaveHandler
```

#### `reenter()`

_returns_: `Promise<void>`

re-runs the current scene's enterHandler. useful when input was invalid and you want to start over

```ts
await message.scene.reenter()
```

#### `reset()`

_returns_: `void`

drops `session.__scene` synchronously. no `leaveHandler` fires. mostly internal — prefer `leave()`

#### `cancelled`

_returns_: `boolean`

`true` inside `leaveHandler` when leave was called with `{ cancelled: true }`. lets you customize the goodbye message

#### `lastAction`

_returns_: `LastAction` (`'None' | 'Enter' | 'Leave'`)

what the last navigation was. introspectable for debugging and for `passthrough` predicates

### `update.scene.step` (inside a StepScene only)

`StepSceneContext` — adds step-aware navigation on top of `scene.*`

#### `firstTime`

_returns_: `boolean`

true on the first dispatch into this step (e.g. immediately after `enter` / `next` / `go`). use it to decide between sending the prompt vs. consuming user input

```ts
if (message.scene.step.firstTime || !message.hasText()) {
  return message.send("what's your name?")
}
```

#### `stepId`

_returns_: `number`

current step index (0-based)

#### `current`

_returns_: `StepSceneHandler | undefined`

the handler bound to the current step. `undefined` when `stepId` is past the last step (calling `next()` from the last step leaves the scene)

#### `go(stepId, options?)`

_returns_: `Promise<void>`

jump to a specific step by index. `{ silent: true }` skips re-running the handler — useful when you want to advance state but already replied this turn

```ts
await message.scene.step.go(0)
await message.scene.step.go(2, { silent: true })
```

#### `next(options?)`

_returns_: `Promise<void>`

shorthand for `go(stepId + 1)`. calling from the last step leaves the scene cleanly

```ts
await message.scene.step.next()
```

#### `previous(options?)`

_returns_: `Promise<void>`

shorthand for `go(stepId - 1)`. doesn't underflow — going past 0 leaves the scene

#### `reenter()`

_returns_: `Promise<void>`

re-runs the current step. handy when validation failed:

```ts
if (!Number.isInteger(parsed)) {
  await message.send('please send a number')

  return message.scene.step.reenter()
}
```

### `telegram.scenes`

runtime registry, exposed via the plugin's install return:

```ts
telegram.scenes.add(scene)         // add a SceneInterface at runtime
telegram.scenes.has('signup')      // boolean
telegram.scenes.remove('signup')   // returns boolean (true if removed)
telegram.scenes.all()              // every registered scene
```

---

## options

`scenes(options?)`:

| option | type | description |
|---|---|---|
| `scenes` | `SceneInterface[]` | initial scene set. shortcut equivalent to calling `telegram.scenes.add(...)` for each at install time |
| `getStorageKey` | `(update) => string \| undefined` | how to derive the per-update storage key. default: `from.id ?? senderChat.id ?? chat.id`. return `undefined` to skip scene attachment for that update |
| `passthrough` | `(update) => boolean` | when this returns `true` for an update from a user with an active scene, the update flows through to subsequent middleware as if no scene were active. `update.scene` stays attached so handlers can still call `update.scene.leave()`. perfect for global `/help`, `/cancel`, `/whoami` |

```ts
scenes({
  scenes: [signup, password, settings],
  passthrough: (update) =>
    'text' in update && (update.text === '/cancel' || update.text === '/help')
})
```

`StepScene` also accepts `enterHandler` / `leaveHandler` / `beforeStep` / `afterStep` hooks:

```ts
new StepScene<MyState, MessageUpdate>('wizard', {
  enterHandler: message => message.send('welcome to the wizard!'),
  leaveHandler: (message) => (
    message.scene.cancelled
      ? message.send('cancelled')
      : message.send('done!')
  ),
  beforeStep: async (message) => {
    if (message.text === '/cancel') {
      await message.scene.leave({ cancelled: true })
    }
  },
  steps: [
    message => message.send('step 1'),
    message => message.send('step 2')
  ]
})
```

> `beforeStep` runs before each step body — calling `scene.leave()` or `step.next()` from inside `beforeStep` short-circuits the body, which makes it the natural place for global `/cancel` handling
> 
> `afterStep` runs after each body, only when the step didn't navigate or leave

---

<a name='advanced'></a>
## advanced patterns

### inspecting another user's scene state

scene state lives on the session, so `telegram.session.get(String(userId))` gives you the raw payload, including `__scene`:

```ts
const raw = await telegram.session.get(String(userId)) as Record<string, unknown> ?? {}

console.log(raw.__scene?.current, raw.__scene?.stepId)
```

### force-priming a user into a scene

you can write the `__scene` shape directly to a target user's session entry — they'll resume into that scene on their **next** message:

```ts
async function primeScene (userId: number, slug: string, initialState: object = {}) {
  const key = String(userId)
  const stored = (await telegram.session.get(key)) as Record<string, unknown> ?? {}

  stored.__scene = {
    current: slug,
    state: initialState,
    stepId: 0,
    firstTime: true
  }

  await telegram.session.set(key, stored)

  // optional: send the first prompt yourself — enterHandler can't run without an Update
  await telegram.send(userId, "hey! quick form — what's your name?")
}
```

caveat: the scene's `enterHandler` won't fire from outside (no `Update` to bind a `SceneContext` to). once the user sends anything, the scenes plugin sees `__scene` populated and dispatches into step 0 normally

### force-leaving another user's scene

```ts
async function dropScene (userId: number) {
  const key = String(userId)
  const stored = (await telegram.session.get(key)) as Record<string, unknown> ?? {}

  delete stored.__scene
  await telegram.session.set(key, stored)
}
```

---

## exported types

```ts
import type {
  AnyUpdate,                   // wrapped update union (bot-api + custom)
  LastAction,                  // 'None' | 'Enter' | 'Leave'
  SceneContextEnterOptions,    // options arg of update.scene.enter()
  SceneContextLeaveOptions,    // options arg of update.scene.leave()
  SceneContextOptions,         // construction shape of SceneContext
  SceneHandlerPayload,         // payload a scene handler receives
  SceneInterface,              // contract of any registered scene
  SceneOptions,                // options accepted by scenes(...)
  ScenePayload,                // structural shape of `update` inside scene context
  SceneSessionState,           // shape persisted at session.__scene
  SceneState,                  // user-augmentable per-scene state
  ScenesExtension,             // shape of `telegram.scenes`
  StepContext,                 // payload a StepScene step receives
  StepContextGoOptions,        // options arg of step.go() / next() / previous()
  StepContextOptions,          // construction shape of StepSceneContext
  StepSceneHandler,            // (payload: StepContext) => unknown
  StepSceneOptions             // options object accepted by `new StepScene(slug, opts)`
} from '@puregram/scenes'
```
