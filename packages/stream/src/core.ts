import type { TelegramMessage } from '@puregram/api'

import {
  DEFAULT_EDIT_INTERVAL_MS, DEFAULT_MAX_EDIT_BACKOFF,
  DRAFT_ID_MAX, DRAFT_SAFETY_MS, DRAFT_TTL_MS, MAX_CHUNK, MAX_RICH_CHUNK
} from './constants'
import { parseLenient, parseStrict, type ParseMode } from './formatted'

/** the per-call options forwarded to bot-api methods. mirrors `SendMessageParams` minus what the plugin owns */
export interface StreamForwardOptions {
  message_thread_id?: number
  reply_parameters?: unknown
  link_preview_options?: unknown
  disable_notification?: boolean
  protect_content?: boolean
  reply_markup?: unknown
}

/** entity shape used by all hooks — matches the on-the-wire `TelegramMessageEntity` but without the strict literal */
export interface StreamEntity {
  type: string
  offset: number
  length: number
}

/** hook callback shapes — `onPiece` is per-source-yield, `onDraftFinalized` is per terminal `sendMessage` */
export interface StreamCallbacks {
  onPiece?: (piece: { text: string, entities?: readonly StreamEntity[] }, draftId: number) => void
  onDraftFinalized?: (msg: TelegramMessage) => void
  onError?: (err: unknown) => void | Promise<void>
}

/** rich-message dialect — exactly one of these is written into `rich_message` */
export type RichDialect = 'markdown' | 'html'

/**
 * the stop channel shared between a run and whatever watches `stopped_message_generation`.
 * the run registers every draft id it puts on the wire; the watcher flips `stopped` and calls
 * `onStop` when telegram reports the user pressed the button for one of them
 */
export interface StreamStopController {
  chatId: number
  draftIds: Set<number>
  stopped: boolean
  onStop?: () => void
}

/** full options for `runStream`; aggregates the call-site shape into a single struct */
export interface RunStreamOptions extends StreamForwardOptions, StreamCallbacks {
  chatId: number
  source: AsyncIterable<string>
  parseMode?: ParseMode
  rich?: boolean | RichDialect
  editIntervalMs?: number
  maxEditBackoff?: number
  thinkingPlaceholder?: boolean
  canStop?: boolean
  keepOnStop?: boolean
  stop?: StreamStopController
  draftIdOffset: number
  signal?: AbortSignal
}

/** result accounting returned by `tg.stream` and `update.stream` */
export interface StreamResult {
  messages: TelegramMessage[]
  drafts: number
  pieces: number
  bytes: number
  skipped: number
  aborted: boolean
  stopped: boolean
}

/** minimal tg-api surface this core leans on — keeps the state machine testable without a `Telegram` instance */
export interface StreamApi {
  sendMessage: (params: Record<string, unknown>) => Promise<TelegramMessage>
  sendMessageDraft: (params: Record<string, unknown>) => Promise<unknown>
}

const sleep = (ms: number) =>
  ms <= 0 ? Promise.resolve() : new Promise<void>(resolve => setTimeout(resolve, ms))

function normalizeDraftId (offset: number, counter: number) {
  // draft_id must be a non-zero positive 32-bit int; folding 0 up to 1 would alias two offsets
  // onto one id, and the stop watcher identifies a run by the ids it owns
  return ((offset + counter) >>> 0) % (DRAFT_ID_MAX - 1) + 1
}

interface SendPayload {
  text: string
  entities?: readonly { type: string, offset: number, length: number }[]
  fallbackParseMode?: ParseMode
}

/** per-run strategy: which rollover cap to use and how to turn a payload into wire content fields */
interface StreamMode {
  rich: boolean
  maxChunk: number
  body: (payload: SendPayload) => Record<string, unknown>
}

function resolveMode (rich: boolean | RichDialect | undefined) {
  if (rich === undefined || rich === false) {
    return {
      rich: false,
      maxChunk: MAX_CHUNK,
      body: (payload: SendPayload) => {
        const fields: Record<string, unknown> = { text: payload.text }

        if (payload.entities && payload.entities.length > 0) {
          fields.entities = payload.entities
        } else if (payload.fallbackParseMode !== undefined) {
          fields.parse_mode = payload.fallbackParseMode
        }

        return fields
      }
    }
  }

  const dialect: RichDialect = rich === true ? 'markdown' : rich

  return {
    rich: true,
    maxChunk: MAX_RICH_CHUNK,
    body: (payload: SendPayload) => ({ rich_message: { [dialect]: payload.text } })
  }
}

function buildSendParams (
  chatId: number,
  payload: SendPayload,
  opts: StreamForwardOptions,
  mode: StreamMode,
  isTerminal: boolean
) {
  const params: Record<string, unknown> = {
    chat_id: chatId,
    ...mode.body(payload)
  }

  if (opts.message_thread_id !== undefined) {
    params.message_thread_id = opts.message_thread_id
  }

  if (opts.reply_parameters !== undefined) {
    params.reply_parameters = opts.reply_parameters
  }

  // rich messages own their link handling — sendRichMessage has no link_preview_options
  if (!mode.rich && opts.link_preview_options !== undefined) {
    params.link_preview_options = opts.link_preview_options
  }

  if (opts.disable_notification !== undefined) {
    params.disable_notification = opts.disable_notification
  }

  if (opts.protect_content !== undefined) {
    params.protect_content = opts.protect_content
  }

  if (isTerminal && opts.reply_markup !== undefined) {
    params.reply_markup = opts.reply_markup
  }

  return params
}

interface DraftSlot {
  id: number
  text: string
  finalized: boolean
}

/**
 * pull/push state machine. drains `opts.source` into per-draft text windows, ships intermediate
 * `sendMessageDraft` previews under a soft edit interval, and finalizes each window via `sendMessage`
 */
export async function runStream (api: StreamApi, opts: RunStreamOptions) {
  if (opts.rich && opts.parseMode !== undefined) {
    throw new Error('[@puregram/stream] `rich` and `parseMode` are mutually exclusive — rich messages carry their own dialect')
  }

  const mode = resolveMode(opts.rich)
  const editInterval = opts.editIntervalMs ?? DEFAULT_EDIT_INTERVAL_MS
  const maxBackoff = opts.maxEditBackoff ?? DEFAULT_MAX_EDIT_BACKOFF
  const wantThinking = opts.thinkingPlaceholder ?? true
  const stop = opts.stop
  const timers = typeof setTimeout === 'function'
  const draftFields: Record<string, unknown> = {
    ...(opts.canStop === undefined ? {} : { can_stop: opts.canStop }),
    ...(opts.keepOnStop === undefined ? {} : { keep_on_stop: opts.keepOnStop })
  }

  const result: StreamResult = {
    messages: [], drafts: 0, pieces: 0, bytes: 0, skipped: 0, aborted: false, stopped: false
  }
  const slots: DraftSlot[] = [{ id: normalizeDraftId(opts.draftIdOffset, 0), text: '', finalized: false }]
  const completed: DraftSlot[] = []

  let pulling = true
  let pullErr: unknown
  let dirty = false
  let lastDraftTs = 0
  let driftSleep = 0
  let wakeResolve: (() => void) | undefined

  const wake = () => {
    wakeResolve?.()
    wakeResolve = undefined
  }

  const waitForWake = (ready: () => boolean) => new Promise<void>((resolve) => {
    if (ready()) {
      resolve()

      return
    }

    wakeResolve = resolve
  })

  let cancelResolve: (() => void) | undefined
  const cancelled = new Promise<void>((resolve) => {
    cancelResolve = resolve
  })
  const cancel = () => {
    cancelResolve?.()
    cancelResolve = undefined
    wake()
  }

  if (stop !== undefined) {
    stop.onStop = cancel
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- noUncheckedIndexedAccess
  const currentSlot = () => slots[slots.length - 1] as DraftSlot

  const pumpSource = async () => {
    const iterator = opts.source[Symbol.asyncIterator]()

    opts.signal?.addEventListener('abort', cancel, { once: true })

    try {
      while (true) {
        if (stop?.stopped === true || opts.signal?.aborted) {
          break
        }

        // a stalled source leaves next() pending forever, wedging the run past abort and stop
        const step = await Promise.race([iterator.next(), cancelled.then(() => undefined)])

        if (step === undefined || step.done === true) {
          break
        }

        const chunk = step.value

        if (chunk.length === 0) {
          continue
        }

        result.pieces += 1
        result.bytes += chunk.length

        let remaining = chunk

        while (remaining.length > 0) {
          const slot = currentSlot()
          const room = mode.maxChunk - slot.text.length

          if (remaining.length <= room) {
            slot.text += remaining; remaining = ''
          } else {
            slot.text += remaining.slice(0, room)
            slot.finalized = true
            completed.push(slot)
            slots.push({ id: normalizeDraftId(opts.draftIdOffset, slots.length), text: '', finalized: false })
            remaining = remaining.slice(room)
          }
        }

        opts.onPiece?.({ text: chunk }, currentSlot().id)
        dirty = true
        wake()
      }
    } catch (err) {
      pullErr = err
    } finally {
      opts.signal?.removeEventListener('abort', cancel)
      pulling = false
      wake()

      // never awaited: a generator parked inside its own await cannot process return()
      Promise.resolve(iterator.return?.()).catch(() => {})
    }
  }

  const pumpPromise = pumpSource()

  if (wantThinking) {
    try {
      stop?.draftIds.add(currentSlot().id)

      await api.sendMessageDraft({
        chat_id: opts.chatId,
        draft_id: currentSlot().id,
        ...mode.body({ text: '' }),
        ...draftFields,
        ...(opts.message_thread_id !== undefined ? { message_thread_id: opts.message_thread_id } : {})
      })

      result.drafts += 1
      lastDraftTs = Date.now()
    } catch (err) {
      // failed thinking placeholder shouldn't kill the stream — next draft tick retries
      await opts.onError?.(err)
    }
  }

  while (true) {
    if (opts.signal?.aborted) {
      result.aborted = true; break
    }

    if (stop?.stopped === true && opts.keepOnStop !== true) {
      result.stopped = true; break
    }

    // ttl-protected forced finalize — gated on first draft going out so a delayed source
    // paired with `thinkingPlaceholder: false` doesn't trip on the first tick
    const now = Date.now()
    const sinceDraft = lastDraftTs === 0 ? 0 : now - lastDraftTs
    const ttlThreshold = DRAFT_TTL_MS - DRAFT_SAFETY_MS

    if (lastDraftTs !== 0 && sinceDraft >= ttlThreshold && !currentSlot().finalized && currentSlot().text.length > 0) {
      // promote current to completed so it goes out before the preview expires
      currentSlot().finalized = true
      completed.push(currentSlot())
      slots.push({ id: normalizeDraftId(opts.draftIdOffset, slots.length), text: '', finalized: false })
      dirty = false
    }

    while (completed.length > 0) {
      // guarded by the loop condition
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const slot = completed.shift()!

      const payload = await parseStrict(slot.text, opts.parseMode).catch(async (err) => {
        await opts.onError?.(err)

        return { text: slot.text }
      })

      const sent = await api.sendMessage(buildSendParams(opts.chatId, payload, opts, mode, true))

      result.messages.push(sent)
      opts.onDraftFinalized?.(sent)
    }

    if (stop?.stopped === true) {
      result.stopped = true; break
    }

    if (!pulling && !dirty && completed.length === 0) {
      break
    }

    if (dirty) {
      const delta = editInterval - (Date.now() - lastDraftTs)

      if (delta > 0) {
        if (!timers) {
          if (pulling) {
            await waitForWake(() => stop?.stopped === true || opts.signal?.aborted === true)
          } else {
            dirty = false
          }

          continue
        }

        driftSleep = Math.min(driftSleep + delta, maxBackoff)

        if (driftSleep >= maxBackoff && lastDraftTs !== 0) {
          // stalled — drop this tick, the next yield overwrites it
          result.skipped += 1
          dirty = false
          driftSleep = 0

          continue
        }

        await sleep(delta); continue
      }

      driftSleep = 0
      dirty = false

      const slot = currentSlot()
      const text = slot.text

      if (text.length === 0) {
        continue
      }

      const payload = await parseLenient(text, opts.parseMode)
      const draftParams: Record<string, unknown> = {
        chat_id: opts.chatId,
        draft_id: slot.id,
        ...mode.body(payload),
        ...draftFields
      }

      if (opts.message_thread_id !== undefined) {
        draftParams.message_thread_id = opts.message_thread_id
      }

      try {
        stop?.draftIds.add(slot.id)

        await api.sendMessageDraft(draftParams)
        result.drafts += 1
        lastDraftTs = Date.now()
      } catch (err) {
        result.skipped += 1
        await opts.onError?.(err)
      }

      continue
    }

    await waitForWake(() =>
      !pulling || completed.length > 0 || dirty || stop?.stopped === true || opts.signal?.aborted === true)
  }

  const tail = currentSlot()

  if (tail.text.length > 0 && (!result.stopped || opts.keepOnStop === true)) {
    const payload = await parseStrict(tail.text, opts.parseMode).catch(async (err) => {
      await opts.onError?.(err)

      return { text: tail.text }
    })

    try {
      const sent = await api.sendMessage(buildSendParams(opts.chatId, payload, opts, mode, true))

      result.messages.push(sent)
      opts.onDraftFinalized?.(sent)
    } catch (err) {
      await opts.onError?.(err)
      throw err
    }
  }

  await pumpPromise

  if (pullErr !== undefined && !result.aborted) {
    await opts.onError?.(pullErr); throw pullErr
  }

  return result
}
