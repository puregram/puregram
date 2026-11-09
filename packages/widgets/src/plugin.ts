import { SharedWidgetQueryUpdate, WidgetQueryUpdate } from '@puregram/api'
import { createPlugin, type TelegramCore } from 'puregram/runtime'

export interface WidgetsOptions {
  autoAnswer?: boolean | { data?: string }
}

export function widgets (options: WidgetsOptions = {}) {
  const { autoAnswer = false } = options

  return createPlugin({
    name: 'widgets',
    install: (tg: TelegramCore) => {
      if (autoAnswer === false) {
        return {}
      }

      const fallback = autoAnswer === true ? {} : autoAnswer

      tg.use(async (update, next) => {
        if (!(update instanceof WidgetQueryUpdate || update instanceof SharedWidgetQueryUpdate)) {
          return next()
        }

        const original = update.answer.bind(update)
        let answered = false

        update.answer = (params = {}) => {
          answered = true

          return original(params)
        }

        try {
          await next()
        } finally {
          if (!answered) {
            await original(fallback).catch(() => {})
          }
        }
      }, { priority: 'high' })

      return {}
    }
  })
}
