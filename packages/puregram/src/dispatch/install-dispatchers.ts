import type {
  Filter,
  OnOptions,
  Priority,
  UPDATE_KINDS as UPDATE_KINDS_TYPE,
  UpdateHandler
} from '@puregram/api'
import { UPDATE_KINDS } from '@puregram/api'

import type { Dispatcher } from './on'

export function installDispatchers (
  target: object, dispatcher: Dispatcher, debug?: (template: string, ...args: unknown[]) => void
) {
  for (const kind of UPDATE_KINDS) {
    const methodName = dispatcherMethodName(kind)

    Object.defineProperty(target, methodName, {
      value: function (
        this: object,
        first: UpdateHandler<unknown> | Filter<unknown, unknown>,
        second?: UpdateHandler<unknown> | OnOptions,
        third?: OnOptions
      ) {
        // overload routing — filter form → predicate dispatch + handler; handler form → bare-kind dispatch
        if (typeof second === 'function') {
          const filter = first as Filter<unknown, unknown>
          const handler = second
          const priority = third?.priority ?? 'normal'

          warnOnKindMismatch(filter, kind, methodName, debug)

          dispatcher.add({
            type: 'predicate',
            predicate: filter,
            handler: handler as UpdateHandler,
            priority
          })

          return this
        }

        const handler = first as UpdateHandler<unknown>
        const priority: Priority = (second)?.priority ?? 'normal'

        dispatcher.on(kind, handler as UpdateHandler, priority)

        return this
      },
      writable: true,
      configurable: true,
      enumerable: false
    })
  }
}

// `message` → `onMessage`, `chat_member` → `onChatMember`. must mirror `emit-dispatch.ts` codegen exactly
export function dispatcherMethodName (kindName: typeof UPDATE_KINDS_TYPE[number]) {
  const camel = kindName
    .split('_')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')

  return `on${camel}`
}

// non-fatal sanity check — filter with `kinds: ['message_reaction']` installed via `tg.onMessage(...)` can never match.
// surfaced via debug logger (`PUREGRAM_DEBUG=puregram:dispatch`)
function warnOnKindMismatch (
  filter: Filter<unknown, unknown>, kind: string, methodName: string,
  debug?: (template: string, ...args: unknown[]) => void
) {
  const filterKinds = filter.kinds

  if (filterKinds && !filterKinds.includes(kind)) {
    debug?.(
      'filter %o registered on tg.%s but its kinds metadata is %o — handler will never match',
      filter.name,
      methodName,
      filterKinds
    )
  }
}
