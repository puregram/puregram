import { describe, expect, it } from 'vitest'

import { TelegramCore } from '../../src/core'
import { createPlugin } from '../../src/plugins/plugin'
import { Telegram } from '../../src/telegram'

const bot = { id: 1, is_bot: true, first_name: 'test', username: 'test_bot' }

class RuntimeBot extends TelegramCore {
  constructor () {
    super({ bot })
  }

  protected callApi () {
    return Promise.reject(new Error('unexpected API call'))
  }

  protected reportDispatchError (error: Error) {
    throw error
  }
}

describe('createPlugin', () => {
  it('installs a default-target plugin on both portable and Node bots', async () => {
    const plugin = createPlugin({
      name: 'counter',
      install: (tg) => {
        let count = 0

        tg.useHook('onUpdate', async (_update, next) => {
          count++
          await next()
        })

        return { read: () => count }
      }
    })
    const portable = new RuntimeBot().extend(plugin)
    const node = new Telegram({ token: 'X', bot }).extend(plugin)

    for (const tg of [portable, node]) {
      tg.defineUpdate('tick')
      await tg.start()
      await tg.emit('tick', {})
      await tg.emit('tick', {})

      expect(tg.counter.read()).toBe(2)
      await tg.shutdown()
    }
  })

  it('installs mixed target dependencies before their consumers', async () => {
    const order: string[] = []
    const transport = createPlugin({
      name: 'transport',
      dependsOn: ['portable'],
      install: (tg: Telegram) => {
        expect(tg.has('portable')).toBe(true)
        order.push('transport')

        return { stop: () => tg.stopPolling() }
      }
    })
    const portable = createPlugin({
      name: 'portable',
      install: () => {
        order.push('portable')

        return {}
      }
    })
    const tg = new Telegram({ token: 'X', bot }).extend(transport).extend(portable)

    await tg.start()

    expect(order).toEqual(['portable', 'transport'])
    tg.transport.stop()
    await tg.shutdown()
  })
})

describe('plugin install timing', () => {
  it('installs pending plugins before the first api call, without start()', async () => {
    let installed = false
    const plugin = createPlugin({
      name: 'recorder',
      install: () => {
        installed = true

        return {}
      }
    })

    class ApiBot extends TelegramCore {
      constructor () {
        super({ bot })
      }

      protected callApi (method: string) {
        return Promise.resolve(method)
      }

      protected reportDispatchError (error: Error) {
        throw error
      }
    }

    const tg = new ApiBot().extend(plugin)

    expect(installed).toBe(false)

    await tg.api.sendMessage({ chat_id: 1, text: 'hi' })

    expect(installed).toBe(true)
    expect(tg.has('recorder')).toBe(true)
  })
})
