---
title: plugins & .extend
description: how puregram plugins work — runtime + type extension via tg.extend(), namespacing, dependsOn, and writing your own
---

# plugins & `.extend`

a **plugin** is a self-contained piece of behavior that attaches to `tg` under its own namespace. [`@puregram/session`](/plugins/session), [`@puregram/scenes`](/plugins/scenes), [`@puregram/flow`](/plugins/flow/), [`@puregram/markup`](/plugins/markup/) — every official satellite is a plugin. the api is `tg.extend(plugin)`, it's chainable, and each call narrows the type of `tg` so you never need `declare module 'puregram'` augmentations

```ts
import { Telegram } from 'puregram'
import { session } from '@puregram/session'

const tg = Telegram.fromToken(process.env.TOKEN!)
  .extend(session())

// session is now installed and typed
tg.onMessage(async (message) => {
  message.session.counter = (message.session.counter ?? 0) + 1
  await message.send(`you sent ${message.session.counter} messages`)
})
```

## how `.extend` works

`.extend(plugin)` queues the plugin synchronously and returns a narrowed `Telegram<Ext>` where `Ext` picks up the plugin's namespace. installs are awaited on `tg.start()` (called implicitly by `startPolling()` / `startWebhook()`) in dependency-resolved order. async installs are fine — `install` may return a `Promise`

the returned value of `install(tg)` gets keyed under `plugin.name` and assigned onto `tg`. every update handler sees the same narrowed type automatically — `message.session` is typed inside `withSession.onMessage(...)` without any extra ceremony

plugins compose:

```ts
import { session } from '@puregram/session'
import { scenes } from '@puregram/scenes'
import { flow } from '@puregram/flow'

const tg = Telegram.fromToken(TOKEN)
  .extend(session())
  .extend(scenes())
  .extend(flow())

// tg.session, tg.scenes, tg.flow — all typed
```

::: tip .extend must be called before start
once polling or a webhook starts, the plugin list is frozen. calling `.extend(plugin)` after `startPolling()` throws. queue all plugins before the first `start()`
:::

## writing a plugin

`createPlugin` is a thin factory that gives you the typed spec:

```ts
import { createPlugin } from 'puregram/runtime'

const greeter = createPlugin({
  name: 'greeter',
  install: tg => ({
    hello: async (chatId: number) => tg.send(chatId, 'hi!')
  })
})

const tg = Telegram.fromToken(process.env.TOKEN!).extend(greeter)

await tg.greeter.hello(100) // typed!
```

the `install` function receives a client and returns the value exposed as `tg.<plugin.name>`. its default target is the portable `TelegramCore`, so a plugin using only core operations can be installed on either the Node or serverless client

transport-specific plugins should opt in explicitly with `install: (tg: Telegram) => ...` and a type-only `Telegram` import. that keeps Node-only operations from appearing compatible with a serverless bot. import portable helpers from `puregram/runtime`; importing the Node barrel can pull unavailable builtins into a bundle. portable imports alone do not make timers or process-local state survive invocation boundaries — see [serverless compatibility](/guide/deployment/serverless#plugin-compatibility)

## `dependsOn`

declare hard dependencies by name so the installer resolves install order topologically:

```ts
const analytics = createPlugin({
  name: 'analytics',
  dependsOn: ['session'],
  install: tg => ({
    track: (event: string) => {
      // tg.session is guaranteed to be installed here
    }
  })
})
```

the installer throws:
- `PluginConflict` — two plugins share the same `name`
- `PluginMissingDep` — a declared dep isn't registered
- `PluginCycle` — the dependency graph has a cycle

for soft deps (adapt-if-present), use `tg.has('session')` — it doesn't widen the type, just checks at runtime

## what plugins can and can't do

| | supported |
| --- | --- |
| extend `tg` with new methods | yes — returned from `install` |
| extend update classes with per-update helpers | yes — via hooks (e.g. `tg.useHook('onUpdate', ...)`) |
| `declare module 'puregram'` augmentation | **no** — the `.extend` return type handles narrowing |
| install order control | via `dependsOn` |
| async setup / teardown | `install` may be `async`; use `tg.useHook('onShutdown', ...)` for teardown |

## lifecycle hooks inside a plugin

plugins can tap into the bot's lifecycle via `useHook`:

```ts
const myPlugin = createPlugin({
  name: 'my-plugin',
  install: (tg) => {
    tg.useHook('onInit', async () => {
      // called once, after all plugins install and before dispatch starts
    })

    tg.useHook('onShutdown', async () => {
      // called on tg.shutdown()
    })

    return { /* plugin surface */ }
  }
})
```

## see also

- [custom updates](/guide/concepts/custom-updates) — emit non-telegram events through the same dispatch pipeline
- [the Telegram client](/guide/concepts/the-telegram-client) — construction, lifecycle, and options
