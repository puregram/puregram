import { defineFilter, type Filter, SharedWidgetQueryUpdate, WidgetQueryUpdate } from '@puregram/api'
import { attach } from 'puregram/runtime'

import { WidgetQueryDataTooLargeError } from './errors'
import { utf8Length, WIDGET_LIMITS } from './limits'

export interface QueryData {
  readonly prefix: string
  readonly filter: Filter<unknown, { payload: string }>
  encode: (payload: string) => string
}

export function queryData (prefix: string): QueryData {
  if (prefix === '' || prefix.includes(':')) {
    throw new TypeError(`query data prefix must be non-empty and contain no ':', got "${prefix}"`)
  }

  const head = `${prefix}:`

  const filter = defineFilter<unknown, { payload: string }>(
    `queryData(${prefix})`,
    (update) => {
      if (!(update instanceof WidgetQueryUpdate || update instanceof SharedWidgetQueryUpdate)) {
        return false
      }

      if (!update.data.startsWith(head)) {
        return false
      }

      attach(update, 'payload', update.data.slice(head.length))

      return true
    },
    { kinds: ['widget_query', 'shared_widget_query'] }
  )

  return {
    prefix,
    filter,
    encode: (payload) => {
      const data = head + payload
      const bytes = utf8Length(data)

      if (bytes > WIDGET_LIMITS.queryDataBytes) {
        throw new WidgetQueryDataTooLargeError(data, bytes, WIDGET_LIMITS.queryDataBytes)
      }

      return data
    }
  }
}
