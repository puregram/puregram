import { FORMATTABLE_FIELDS } from '@puregram/api'
import { createPlugin, type TelegramCore } from 'puregram/runtime'

import { unwrapFormatted, type FormattableFields } from './walk'

const FIELDS = FORMATTABLE_FIELDS as FormattableFields

export function markup () {
  return createPlugin({
    name: 'markup',
    install: (tg: TelegramCore) => {
      tg.useHook('onBeforeRequest', (ctx, next) => {
        ctx.params = unwrapFormatted(ctx.method, ctx.params, FIELDS)

        return next()
      })

      return {}
    }
  })
}
