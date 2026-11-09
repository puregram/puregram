import { flow } from '@puregram/flow'
import { markup } from '@puregram/markup'
import { rateLimit, rateLimitFilter, rateLimitMiddleware } from '@puregram/rate-limit'
import { scenes } from '@puregram/scenes'
import type { ServerlessBot } from '@puregram/serverless'
import { session } from '@puregram/session'
import { stream } from '@puregram/stream'
import { throttler } from '@puregram/throttler'
import type { Telegram } from 'puregram'
import { createPlugin, type Plugin } from 'puregram/runtime'

declare const portable: ServerlessBot
declare const node: Telegram

const plugin: Plugin<'custom', { enabled: boolean }> = createPlugin({
  name: 'custom',
  install: (tg) => {
    tg.useHook('onInit', (_ctx, next) => next())

    return { enabled: true }
  }
})

portable.extend(plugin).extend(markup()).extend(session()).extend(scenes()).extend(rateLimit())
node.extend(plugin).extend(markup()).extend(session()).extend(scenes()).extend(rateLimit())
rateLimitFilter(portable, { limit: 1, window: 60 })
rateLimitMiddleware(portable, { limit: 1, window: 60 })
rateLimitFilter(node, { limit: 1, window: 60 })
rateLimitMiddleware(node, { limit: 1, window: 60 })

node.extend(flow()).extend(throttler()).extend(stream())

// @ts-expect-error
portable.extend(flow())
// @ts-expect-error
portable.extend(throttler())
// @ts-expect-error
portable.extend(stream())

createPlugin({
  name: 'portable-default',
  install: (tg) => {
    // @ts-expect-error
    tg.stopPolling()

    return {}
  }
})
