import type { CallbackQueryUpdate, MessageUpdate, UpdateKindMap } from '@puregram/api'

import type {
  CollectMediaGroupOptions,
  WaitForCallbackQueryOptions,
  WaitForCommandOptions
} from '../flow'
import type { PromptOptions } from '../prompt'
import type {
  AnyWaiterSpec,
  WaitForAnyOptions,
  WaitForAnyResult,
  WaitForAnyValueOf
} from '../wait-for/any'
import type { WaitForOptions } from '../wait-for/types'

export type AugmentedWaitForMatch = 'none' | 'chat' | 'from' | 'chat+from'

export interface AugmentedPromptOptions extends Omit<PromptOptions, 'from'> {
  /** override the auto-derived chat (defaults to extractor's output) */
  chat?: number | string
  /** override the auto-derived from (undefined leaves the underlying prompt unscoped by user) */
  from?: number
}

export interface AugmentedWaitForOptions<K extends keyof UpdateKindMap> extends WaitForOptions<K> {
  /**
   * how strictly the next update is matched against the source — default
   * `'chat+from'` when both extracted, `'chat'` or `'from'` when only one extracted, `'none'` otherwise
   */
  match?: AugmentedWaitForMatch
}

/** sugar version of `WaitForCallbackQueryOptions` with the augment auto-scope knob */
export interface AugmentedWaitForCallbackQueryOptions extends WaitForCallbackQueryOptions {
  match?: AugmentedWaitForMatch
}

/** sugar version of `WaitForCommandOptions` with the augment auto-scope knob */
export interface AugmentedWaitForCommandOptions extends WaitForCommandOptions {
  match?: AugmentedWaitForMatch
}

export interface UpdateFlowExtension {
  prompt: (text: string, options?: AugmentedPromptOptions) => Promise<MessageUpdate | null>
  waitFor: <K extends keyof UpdateKindMap> (
    kind: K,
    options?: AugmentedWaitForOptions<K>
  ) => Promise<UpdateKindMap[K] | null>
  /** auto-scoped sugar over `flow.waitForCallbackQuery` — defaults to same chat + same sender */
  waitForCallbackQuery: (
    predicate?: (q: CallbackQueryUpdate) => boolean,
    options?: AugmentedWaitForCallbackQueryOptions
  ) => Promise<CallbackQueryUpdate | null>
  /** auto-scoped sugar over `flow.waitForCommand` */
  waitForCommand: (
    name: string | RegExp,
    options?: AugmentedWaitForCommandOptions
  ) => Promise<MessageUpdate | null>
  /**
   * race a list of waiter specs; first match wins, losers are cancelled.
   * specs are passed through verbatim — auto-scope is NOT applied to children,
   * use `update.flow.waitFor`/`waitForCallbackQuery`/`waitForCommand` to build
   * scoped waiters separately if you want that
   */
  waitForAny: <S extends readonly AnyWaiterSpec[]> (
    specs: S,
    options?: WaitForAnyOptions
  ) => Promise<WaitForAnyResult<WaitForAnyValueOf<S[number]>>>
  /**
   * collect every message sharing a `media_group_id` with this update into one array.
   * meaningful on message-payload updates; non-message updates resolve immediately with
   * `[source]` cast as MessageUpdate
   */
  collectMediaGroup: (options?: CollectMediaGroupOptions) => Promise<MessageUpdate[]>
}
