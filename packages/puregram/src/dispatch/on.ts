import type { AnyUpdate, Priority, UpdateHandler } from '@puregram/api'
import { isFilter, SERVICE_EVENT_ORDER, UPDATE_KINDS } from '@puregram/api'

import { SERVICE_EVENT_PARENTS } from './update-builder'

export type { AnyUpdate, OnOptions, Priority, UpdateHandler } from '@puregram/api'

/**
 * predicate signature for `tg.onUpdate(predicate, handler, options?)`. type-guard
 * variant narrows the handler arg; plain-boolean keeps it as `AnyUpdate`.
 * `Promise<boolean>` works too — dispatcher awaits before invoking
 */
export type UpdatePredicate<T extends AnyUpdate = AnyUpdate> =
  | ((update: AnyUpdate) => update is T)
  | ((update: AnyUpdate) => boolean)
  | ((update: AnyUpdate) => Promise<boolean>)

const PRIORITY_RANK: Record<Priority, number> = {
  high: 0,
  normal: 1,
  low: 2
}

const UPDATE_FIELDS = new Set<string>(UPDATE_KINDS)
const SERVICE_KINDS = new Set<string>(SERVICE_EVENT_ORDER)

interface KindEntry {
  type: 'kind'
  kind: string
  handler: UpdateHandler
  priority: Priority
  seq: number
}

interface PredicateEntry {
  type: 'predicate'
  predicate: (update: AnyUpdate) => boolean | Promise<boolean>
  handler: UpdateHandler
  priority: Priority
  seq: number
}

export type DispatchEntry = KindEntry | PredicateEntry

export type DispatchEntryInput =
  | Omit<KindEntry, 'seq'>
  | Omit<PredicateEntry, 'seq'>

export class Dispatcher {
  private readonly entries: DispatchEntry[] = []
  private nextSeq = 0

  add (entry: DispatchEntryInput) {
    const seq = this.nextSeq++

    this.entries.push({ ...entry, seq } as DispatchEntry)
  }

  on (kind: string, handler: UpdateHandler, priority: Priority = 'normal') {
    this.add({ type: 'kind', kind, handler, priority })
  }

  off (kind: string, handler: UpdateHandler) {
    const idx = this.entries.findIndex(
      e => e.type === 'kind' && e.kind === kind && e.handler === handler
    )

    if (idx >= 0) {
      this.entries.splice(idx, 1)
    }
  }

  async runUserHandlers (update: AnyUpdate) {
    if (this.entries.length === 0) {
      return
    }

    // snapshot so registration changes during dispatch don't shift the cursor
    const snapshot = this.entries.slice()
    const matched: DispatchEntry[] = []

    for (const entry of snapshot) {
      if (entry.type === 'kind') {
        if (entry.kind === update.kind) {
          matched.push(entry)
        }

        continue
      }

      // kinds-metadata fast-path — `defineFilter` filters carry an optional `kinds` hint.
      // skip predicate eval for kinds outside that list; bare predicates fall through
      const hint = (entry.predicate as { kinds?: readonly string[] }).kinds

      if (hint !== undefined && !hint.includes(update.kind)) {
        continue
      }

      // sync predicates stay on the hot path; only thenable returners pay the await cost
      const result = entry.predicate(update)

      if (typeof result === 'object' && result !== null && 'then' in result) {
        if (await result) {
          matched.push(entry)
        }
      } else if (result) {
        matched.push(entry)
      }
    }

    if (matched.length === 0) {
      return
    }

    matched.sort((a, b) => {
      const rank = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]

      if (rank !== 0) {
        return rank
      }

      return a.seq - b.seq
    })

    let i = 0

    const next = async (): Promise<void> => {
      if (i >= matched.length) {
        return
      }

      const entry = matched[i++]

      if (entry === undefined) {
        return
      }

      await entry.handler(update, next)
    }

    await next()
  }

  has (kind: string) {
    return this.entries.some(e => e.type === 'kind' && e.kind === kind)
  }

  // for allowedUpdates: 'auto' — the explicit kinds the bot handles, plus whether any opaque
  // (non-filter) predicate exists, which forces a fall back to telegram's default subscription
  collectAllowedKinds () {
    const kinds = new Set<string>()
    let opaque = false

    const addKind = (kind: string) => {
      if (SERVICE_KINDS.has(kind)) {
        for (const parent of SERVICE_EVENT_PARENTS) {
          kinds.add(parent)
        }
      } else if (UPDATE_FIELDS.has(kind)) {
        kinds.add(kind)
      } else {
        opaque = true
      }
    }

    for (const entry of this.entries) {
      if (entry.type === 'kind') {
        addKind(entry.kind)

        continue
      }

      if (isFilter(entry.predicate) && entry.predicate.kinds) {
        for (const kind of entry.predicate.kinds) {
          addKind(kind)
        }

        continue
      }

      opaque = true
    }

    return { kinds, opaque }
  }
}
