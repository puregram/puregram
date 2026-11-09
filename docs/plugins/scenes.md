---
title: '@puregram/scenes'
description: step-by-step wizard scenes backed by session — multi-question forms, onboarding flows, and staged conversations
---

# `@puregram/scenes`

multi-step handlers — signup wizards, onboarding flows, anything where the bot asks, the user answers, and the bot has to remember where in the conversation it is. one plugin install, a `StepScene` per flow, and you're done

state survives bot restarts when your session backend is persistent

## when to use

reach for `@puregram/scenes` when a flow spans multiple messages and needs to remember "which step" the user is on — a form that collects name + age + email, a settings wizard, a multi-question quiz. for single-message interactions or simple reply-and-done handlers, plain `onMessage` is cleaner

## install

::: code-group

```sh [yarn]
yarn add @puregram/session @puregram/scenes
```

```sh [npm]
npm i -S @puregram/session @puregram/scenes
```

```sh [pnpm]
pnpm add @puregram/session @puregram/scenes
```

:::

`@puregram/scenes` depends on [`@puregram/session`](/plugins/session) — install both. `dependsOn: ['session']` will throw `PluginMissingDep` at start if you forget

## quick start

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

## core api

### how scene dispatch works

the plugin registers a high-priority `onUpdate` hook that:

1. attaches `update.scene` (a `SceneContext`) to every update
2. if the user has an active scene, dispatches the update into the current step instead of flowing through to your normal handlers
3. exposes `tg.scenes` for runtime registry mutation

active-scene dispatch is **opt-out**: any update from a user with an active scene goes into that scene. use [`passthrough`](#options) to exempt specific updates (e.g. global `/help`, `/cancel`)

### `update.scene`

the per-update scene controller

#### `enter(slug, options?)`

enter the scene named `slug`. optionally seed initial state or skip the `enterHandler`:

```ts
await message.scene.enter('signup')
await message.scene.enter('signup', { state: { firstName: '' } })
await message.scene.enter('signup', { silent: true })
```

#### `leave(options?)`

leave the current scene. `cancelled: true` surfaces inside `leaveHandler` via `scene.cancelled` — useful for distinguishing graceful finish from abort:

```ts
await message.scene.leave()
await message.scene.leave({ cancelled: true })
await message.scene.leave({ silent: true })
```

#### `reenter()`

re-runs the current scene's `enterHandler`. use when input was invalid and you want to restart the step

#### `reset()`

drops `session.__scene` synchronously — no `leaveHandler` fires. mostly internal; prefer `leave()`

#### `current`

the active `SceneInterface`, resolved from `session.__scene.current`, or `undefined`

#### `state`

per-scene user state. lives at `session.__scene.state`. mutate freely — flushed automatically when the handler chain returns

#### `cancelled`

`true` inside `leaveHandler` when `leave({ cancelled: true })` was called

#### `lastAction`

`LastAction.None | LastAction.Enter | LastAction.Leave` — what the last navigation was

### `update.scene.step` (inside a `StepScene` only)

`StepSceneContext` — adds step-aware navigation on top of `scene.*`

#### `firstTime`

`true` on the first dispatch into this step (immediately after `enter` / `next` / `go`). the standard guard — send the prompt on first time, consume input otherwise:

```ts
if (message.scene.step.firstTime || !message.hasText()) {
  return message.send("what's your name?")
}
```

#### `stepId`

current step index (0-based)

#### `go(stepId, options?)`

jump to a specific step by index. `{ silent: true }` skips re-running the handler — useful when you want to advance without replying a second time this turn

#### `next(options?)`

shorthand for `go(stepId + 1)`. calling from the last step leaves the scene cleanly

#### `previous(options?)`

shorthand for `go(stepId - 1)`. going past 0 leaves the scene

#### `reenter()`

re-runs the current step. handy when validation failed:

```ts
if (!Number.isInteger(parsed)) {
  await message.send('please send a number')

  return message.scene.step.reenter()
}
```

### `tg.scenes`

runtime registry, exposed by the plugin's install return:

```ts
tg.scenes.add(scene)
tg.scenes.has('signup')
tg.scenes.remove('signup')
tg.scenes.all()
```

## options

`scenes(options?)`:

| option | type | default | description |
|---|---|---|---|
| `scenes` | `SceneInterface[]` | `[]` | initial scene set. equivalent to calling `tg.scenes.add(scene)` for each at install time |
| `getStorageKey` | `(update) => string \| undefined` | `from.id ?? senderChat.id ?? chat.id` | how to derive the per-update storage key. `undefined` → no scene attached for that update |
| `passthrough` | `(update) => boolean` | `() => false` | when this returns `true` for an update from a user with an active scene, the update flows through to subsequent handlers. `update.scene` stays attached so handlers can still call `update.scene.leave()` |

### `StepScene` options

`new StepScene(slug, steps[])` or `new StepScene(slug, options)`:

| option | type | description |
|---|---|---|
| `steps` | `StepSceneHandler[]` | required — the ordered step handlers |
| `enterHandler` | `StepSceneHandler` | fires when the scene is entered |
| `leaveHandler` | `StepSceneHandler` | fires when the scene is left. `scene.cancelled` is set here when leave was called with `{ cancelled: true }` |
| `beforeStep` | `StepSceneHandler` | runs before every step body — calling `scene.leave()` or `step.next()` from inside skips the body. natural place for global `/cancel` handling |
| `afterStep` | `StepSceneHandler` | runs after every step body, only when the step didn't navigate or leave |

```ts
new StepScene<MyState, MessageUpdate>('wizard', {
  enterHandler: message => message.send('welcome!'),
  leaveHandler: message => (
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

::: tip passthrough for global commands
`passthrough` is the right escape hatch for commands that should work even when a scene is active. return `true` from it and the update flows through normally — `update.scene` is still attached so a handler can still call `leave()` if needed
:::

## errors

| error | when |
|---|---|
| `PluginMissingDep` (from core) | `session` plugin was not installed before `scenes` |
| `Error: 'there is no active scene to enter'` | `scene.reenter()` was called when no scene was active |

## typescript

`@puregram/scenes` attaches `scene: SceneContext<SceneState>` to every update kind via codegen. `update.scene.state` is the empty `SceneState` interface by default

bot api 10.4 widget queries support scenes. message widget queries keep the user's chat-scoped session, while inline/shared-widget queries use a sender-only session because no chat is available.

scope a step scene to a specific update kind by passing it as the second generic:

```ts
import type { MessageUpdate } from '@puregram/api'
import { StepScene } from '@puregram/scenes'

new StepScene<{ firstName: string, age: number }, MessageUpdate>('signup', [
  (message) => {
    // message is MessageUpdate — .text, .send(), .hasText() all available
    // message.scene.state is { firstName: string, age: number }
  }
])
```

for mixed update kinds across steps, pass a union and narrow inside each step:

```ts
import type { CallbackQueryUpdate, MessageUpdate } from '@puregram/api'

new StepScene<MyState, MessageUpdate | CallbackQueryUpdate>('mixed', [
  (update) => {
    if (update.is('callback_query')) {
      return update.answer({ text: 'button pressed' })
    }

    return update.send('tap a button')
  }
])
```

declare-merge `SceneState` to widen `update.scene.state` globally:

```ts
declare module '@puregram/scenes' {
  interface SceneState {
    firstName: string
    age: number
  }
}
```

## exported types

```ts
import type {
  AnyUpdate,
  LastAction,
  SceneContextEnterOptions,
  SceneContextLeaveOptions,
  SceneContextOptions,
  SceneHandlerPayload,
  SceneInterface,
  SceneOptions,
  ScenePayload,
  SceneSessionState,
  SceneState,
  ScenesExtension,
  StepContext,
  StepContextGoOptions,
  StepContextOptions,
  StepSceneHandler,
  StepSceneOptions
} from '@puregram/scenes'
```

## see also

- [session plugin](/plugins/session) — the required backing store for scene state
- [flow plugin](/plugins/flow/) — waiters and prompts for lighter-weight async flows
- [plugins & .extend](/guide/concepts/plugins) — how `.extend(plugin)` works
