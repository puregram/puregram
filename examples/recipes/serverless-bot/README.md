# serverless bot

formatting, callback buttons, and database-backed sessions on [telegram serverless](https://core.telegram.org/bots/serverless)

**experimental:** verified on the hosted runtime. enable serverless for your bot in BotFather before logging in. `tgcloud run` runs in the cloud, not offline

## build

from the repository root:

```sh
yarn install
yarn build
yarn workspace puregram-example-serverless-bot build
```

this bundles `src/bot.ts` and `schema.js` into `tgcloud/`, the folder `tgcloud` deploys. update kinds are inferred from the bot's handlers; adding a handler does not require editing a second list. automatic discovery evaluates trusted module initialization without starting the bot or installing plugins. use explicit `--updates` if subscriptions depend on runtime initialization

## link, deploy, and migrate

from this recipe's directory:

```sh
yarn tgcloud login
yarn tgcloud push
yarn tgcloud migrate
```

login uses the **serverless CLI access token** from BotFather, not the bot API token. review the migration before applying it: `kvTable('sessions')` defines the storage columns and expiry index. constructing `TelegramStorage` does not create tables

after editing the recipe, `yarn deploy` rebuilds and pushes. migrate when the schema changes. the bot stores the previous message per user/chat and replies with an acknowledge button. the example leaves whole-session expiry disabled; set `ttlMs` on the store to expire inactive sessions

## try a local change without publishing

```sh
yarn tgcloud run handlers/message '{ chat: { id: 1 }, from: { id: 1, is_bot: false, first_name: "test" }, text: "hello" }'
```

this executes your local modules on Telegram's platform; with a fake chat id the final `sendMessage` fails with `chat not found`. payload-only runs get synthetic `update_id: 0`; real delivery keeps the original id. add `debug: true` to `createBot` for API request summaries in the captured console output

`tgcloud/`, `.tgcloud/`, and `.tgcloud.puregram-serverless.json` stay out of version control. the ownership manifest protects hand-edited generated files, and rebuilds preserve unrelated files and CLI login state

state survives invocations, but simultaneous writes to the same session remain last-write-wins. there is no exactly-once delivery claim. see the [serverless guide](https://puregram.cool/guide/deployment/serverless) for runtime boundaries and hosted verification requirements
