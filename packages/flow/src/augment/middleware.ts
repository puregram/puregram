import type { UpdateKindMap } from '@puregram/api'
import { attach, type Middleware } from 'puregram/runtime'

import type {
  FlowExtension,
  WaitForCallbackQueryOptions,
  WaitForCommandOptions
} from '../flow'
import type { Filter, WaitForOptions } from '../wait-for/types'

import { EXTRACTORS, isMediaGroupKind, type ExtractedScope, type MediaGroupMessage } from './extractors'
import type {
  AugmentedWaitForCallbackQueryOptions,
  AugmentedWaitForCommandOptions,
  AugmentedWaitForMatch,
  AugmentedWaitForOptions,
  MessageFlowExtension,
  UpdateFlowExtension
} from './types'

interface KindRaw {
  kind: string
  raw: unknown
}

type FlowApi = Pick<FlowExtension, keyof MessageFlowExtension>

// auto-fills chat (and default sender filter) from the source so handlers don't have
// to thread chat/user ids through prompt/waitFor calls
export function createAugmentMiddleware (flow: FlowApi) {
  const middleware: Middleware<unknown> = async (update, next) => {
    if (typeof update !== 'object' || update === null) {
      await next()

      return
    }

    const candidate = update as Partial<KindRaw>
    const kind = candidate.kind

    if (typeof kind !== 'string') {
      await next()

      return
    }

    const extractor = EXTRACTORS[kind]

    if (!extractor) {
      await next()

      return
    }

    const scope = extractor(candidate as KindRaw)

    const ext: Partial<MessageFlowExtension> = createUpdateFlowExtension(flow, scope)

    if (isMediaGroupKind(kind)) {
      ext.collectMediaGroup = options => flow.collectMediaGroup(update as MediaGroupMessage, options)
    }

    attach(update, 'flow', ext)

    await next()
  }

  return middleware
}

function createUpdateFlowExtension (flow: FlowApi, scope: ExtractedScope) {
  return {
    prompt: (text, options = {}) => {
      const { chat, from, ...rest } = options
      const chatId = chat ?? scope.chat

      if (chatId === undefined) {
        throw new Error('update.flow.prompt: no chat available on this update')
      }

      // explicit `from` (including `undefined`) wins; absent key falls back to `scope.from`
      // — prompt is sender-pinned by default; "anyone in chat" needs `{ from: undefined }`
      const resolvedFrom = 'from' in options ? from : scope.from

      return resolvedFrom === undefined
        ? flow.prompt(chatId, text, rest)
        : flow.prompt(chatId, text, { ...rest, from: resolvedFrom })
    },

    waitFor: <K extends keyof UpdateKindMap> (kind: K, options: AugmentedWaitForOptions<K> = {}) => {
      const { match: explicit, filter, ...rest } = options
      const match: AugmentedWaitForMatch = explicit ?? defaultMatch(scope)

      const scoped = wrapFilter<K>(match, scope, filter)

      const passthrough: WaitForOptions<K> = scoped !== undefined
        ? { ...rest, filter: scoped }
        : rest

      return flow.waitFor(kind, passthrough)
    },

    waitForCallbackQuery: (predicate, options: AugmentedWaitForCallbackQueryOptions = {}) => {
      const { match: explicit, filter, ...rest } = options
      const match: AugmentedWaitForMatch = explicit ?? defaultMatch(scope)
      const scoped = wrapFilter<'callback_query'>(match, scope, filter)
      const passthrough: WaitForCallbackQueryOptions = scoped !== undefined
        ? { ...rest, filter: scoped }
        : rest

      return flow.waitForCallbackQuery(predicate, passthrough)
    },

    waitForCommand: (name, options: AugmentedWaitForCommandOptions = {}) => {
      const { match: explicit, filter, ...rest } = options
      const match: AugmentedWaitForMatch = explicit ?? defaultMatch(scope)
      const scoped = wrapFilter<'message'>(match, scope, filter)
      const passthrough: WaitForCommandOptions = scoped !== undefined
        ? { ...rest, filter: scoped }
        : rest

      return flow.waitForCommand(name, passthrough)
    },

    waitForAny: flow.waitForAny
  } satisfies UpdateFlowExtension
}

function defaultMatch (scope: ExtractedScope) {
  if (scope.chat === undefined) {
    return scope.from === undefined ? 'none' as const : 'from' as const
  }

  if (scope.from === undefined) {
    return 'chat' as const
  }

  return 'chat+from' as const
}

function wrapFilter<K extends keyof UpdateKindMap> (
  match: AugmentedWaitForMatch,
  scope: ExtractedScope,
  userFilter: Filter<UpdateKindMap[K]> | undefined
) {
  if (match === 'none') {
    return userFilter
  }

  const scoped: Filter<UpdateKindMap[K]> = (candidate) => {
    const candKindRaw = candidate as unknown as KindRaw
    const ext = EXTRACTORS[candKindRaw.kind]

    if (!ext) {
      return false
    }

    const candScope = ext(candKindRaw)

    if (match !== 'from' && candScope.chat !== scope.chat) {
      return false
    }

    if ((match === 'chat+from' || match === 'from') && candScope.from !== scope.from) {
      return false
    }

    return userFilter ? userFilter(candidate) : true
  }

  return scoped
}
