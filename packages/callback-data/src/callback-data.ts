import { md5 } from '@noble/hashes/legacy.js'
import type { Filter, TelegramInlineKeyboardButton } from '@puregram/api'
import { defineFilter } from '@puregram/api'
import { Buffer } from 'buffer/index.js'
import { attach } from 'puregram/runtime'

import { conditionsPass, type ConditionalObject, type ValidateConditions } from './conditions'
import { packBody, unpackBody } from './encoder'
import { CallbackDataInvalid, CallbackDataTooLong } from './errors'
import type { Accepted, DetermineStateKey, FieldOptions, FieldSpec, Simplify } from './types'

const TELEGRAM_PAYLOAD_LIMIT = 64
const DEFAULT_SLUG_LENGTH = 6
const CALLBACK_KIND = 'callback_query' as const

export interface CallbackDataOptions {
  /** chars of the md5 slug hash to retain (default 6); shorter = more byte budget, higher collision risk */
  slugLength?: number
}

interface InternalState {
  rawSlug: string
  slug: string
  slugLength: number
  fields: readonly FieldSpec[]
  conditions: readonly Record<string, unknown>[]
}

/** sugar input for `.button({ text, ...state })` — text plus the state fields */
export type ButtonInput<State> = { text: string } & State

/**
 * opaque schema record produced by `defineCallbackData`. NOT a filter directly —
 * the dispatch-ready filter lives at `.filter`. (a callable schema-as-filter
 * intersection breaks `Filter<unknown, Mod>` inference at the dispatch site,
 * so the filter is a separate property)
 */
export interface CallbackData<
  State extends Record<string, Accepted> = Record<never, never>,
  Narrowed extends State = State
> {
  /** dispatch-ready filter — pass to `tg.onCallbackQuery(BanPayload.filter, h)` */
  readonly filter: Filter<unknown, { payload: Narrowed }>

  /** truncated md5 hash of the original slug; the wire prefix every packed payload starts with */
  readonly slug: string
  /** the original slug string passed to `defineCallbackData` */
  readonly rawSlug: string
  /** field schema in declaration order */
  readonly fields: readonly FieldSpec[]

  /** add a `string` field (utf-16 code units, max 127 long after pack) */
  string: <Key extends string, O extends FieldOptions<string>>(
    key: Key,
    options?: O
  ) => CallbackData<Simplify<State & DetermineStateKey<string, Key, O>>>

  /** add a `number` field (signed safe integer, zigzag-varint encoded) */
  number: <Key extends string, O extends FieldOptions<number>>(
    key: Key,
    options?: O
  ) => CallbackData<Simplify<State & DetermineStateKey<number, Key, O>>>

  /** add a `boolean` field (encoded into the header bitmap, 0 body bytes) */
  boolean: <Key extends string, O extends FieldOptions<boolean>>(
    key: Key,
    options?: O
  ) => CallbackData<Simplify<State & DetermineStateKey<boolean, Key, O>>>

  /**
   * add a literal-union field. encodes as `ceil(log2(values.length))` bits in
   * the header — much smaller than a string for known value sets
   */
  literal: <Key extends string, V extends readonly string[], O extends FieldOptions<V[number]>>(
    key: Key,
    values: V,
    options?: O
  ) => CallbackData<Simplify<State & DetermineStateKey<V[number], Key, O>>>

  /** narrow the filter further with declarative per-field conditions */
  with: <C extends ConditionalObject<State>>(
    conditions: C
  ) => CallbackData<State, Simplify<Narrowed & ValidateConditions<C, State>>>

  /** serialize a state object to a callback_data string; throws on invalid values or 64-byte overflow */
  pack: (state: State) => string

  /** parse a callback_data string. returns `null` if it doesn't match this schema */
  unpack: (data: string) => State | null

  /** true iff `data` matches this schema (and all `.with()` conditions) */
  validate: (data: string) => boolean

  /** convenience: produce a `TelegramInlineKeyboardButton` with text + packed callback_data */
  button: (input: ButtonInput<State>) => TelegramInlineKeyboardButton

  /** unpack `data`, merge `partial`, re-pack. throws if `data` doesn't belong to this schema */
  repack: (data: string, partial: Partial<State>) => string
}

/** factory — defines a callback-data schema. chain `.string`/`.number`/`.boolean`/`.literal` to declare fields */
export function defineCallbackData (
  slug: string,
  options: CallbackDataOptions = {}
) {
  const slugLength = options.slugLength ?? DEFAULT_SLUG_LENGTH

  if (!Number.isInteger(slugLength) || slugLength < 1 || slugLength > 22) {
    throw new RangeError('slugLength must be an integer in [1, 22]')
  }

  const digest = md5(Buffer.from(slug, 'utf8'))
  const slugHash = Buffer.from(digest.buffer, digest.byteOffset, digest.byteLength)
    .toString('base64').replace(/\+/g, '-').replace(/\//g, '_').slice(0, slugLength)

  return makeCallbackData<Record<never, never>, Record<never, never>>({
    rawSlug: slug,
    slug: slugHash,
    slugLength,
    fields: [],
    conditions: []
  })
}

/** v2-shaped class re-export. `CallbackDataBuilder.create('foo')` is an alias for `defineCallbackData('foo')` */
export class CallbackDataBuilder {
  static create (slug: string, options: CallbackDataOptions = {}) {
    return defineCallbackData(slug, options)
  }
}

function makeCallbackData<
  State extends Record<string, Accepted>,
  Narrowed extends State
> (internal: InternalState): CallbackData<State, Narrowed> {
  const { slug, rawSlug, fields, conditions } = internal

  const filter = defineFilter<unknown, { payload: Narrowed }>(
    `callbackData(${rawSlug})`,
    (u) => {
      const raw = (u as { raw?: { data?: unknown } }).raw

      if (raw === undefined || typeof raw.data !== 'string') {
        return false
      }

      const data = raw.data

      if (data.slice(0, slug.length) !== slug) {
        return false
      }

      const payload = unpackBody(fields, data.slice(slug.length))

      if (payload === null) {
        return false
      }

      if (!conditionsPass(conditions, payload)) {
        return false
      }

      attach(u as object, 'payload', payload)

      return true
    },
    { kinds: [CALLBACK_KIND] }
  )

  function pack (state: State) {
    const codes = packBody(fields, state as Record<string, unknown>)
    let body = ''
    let byteLen = slug.length
    let highSurrogate = false

    for (const code of codes) {
      body += String.fromCharCode(code)
      byteLen += code < 0x80
        ? 1
        : code < 0x800
          ? 2
          : highSurrogate && code >= 0xdc00 && code <= 0xdfff ? 1 : 3
      highSurrogate = code >= 0xd800 && code <= 0xdbff
    }

    const out = slug + body

    if (byteLen > TELEGRAM_PAYLOAD_LIMIT) {
      throw new CallbackDataTooLong(out, byteLen)
    }

    return out
  }

  function unpack (data: string) {
    if (data.slice(0, slug.length) !== slug) {
      return null
    }

    return unpackBody(fields, data.slice(slug.length)) as State | null
  }

  function validate (data: string) {
    const result = unpack(data)

    if (result === null) {
      return false
    }

    return conditionsPass(conditions, result as unknown as Record<string, unknown>)
  }

  function button (input: ButtonInput<State>) {
    const { text, ...rest } = input as ButtonInput<State> & Record<string, Accepted>

    return {
      text,
      callback_data: pack(rest as unknown as State)
    }
  }

  function repack (data: string, partial: Partial<State>): string {
    const current = unpack(data)

    if (current === null) {
      throw new CallbackDataInvalid('<root>', 'repack source did not match this schema')
    }

    return pack({ ...current, ...partial } as State)
  }

  function withConditions<C extends ConditionalObject<State>> (
    conds: C
  ) {
    return makeCallbackData<State, Simplify<Narrowed & ValidateConditions<C, State>>>({
      ...internal,
      conditions: [...conditions, conds as Record<string, unknown>]
    })
  }

  function addField (newField: FieldSpec) {
    return makeCallbackData<Record<string, Accepted>, Record<string, Accepted>>({
      ...internal,
      fields: [...fields, newField],
      conditions: []
    })
  }

  function addString<K extends string, O extends FieldOptions<string>> (key: K, opts?: O) {
    return addField(buildFieldSpec(key, 'string', opts)) as unknown as
      CallbackData<Simplify<State & DetermineStateKey<string, K, O>>>
  }

  function addNumber<K extends string, O extends FieldOptions<number>> (key: K, opts?: O) {
    return addField(buildFieldSpec(key, 'number', opts)) as unknown as
      CallbackData<Simplify<State & DetermineStateKey<number, K, O>>>
  }

  function addBoolean<K extends string, O extends FieldOptions<boolean>> (key: K, opts?: O) {
    return addField(buildFieldSpec(key, 'boolean', opts)) as unknown as
      CallbackData<Simplify<State & DetermineStateKey<boolean, K, O>>>
  }

  function addLiteral<K extends string, V extends readonly string[], O extends FieldOptions<V[number]>> (
    key: K,
    values: V,
    opts?: O
  ) {
    if (values.length === 0) {
      throw new RangeError('literal field requires at least one value')
    }

    const spec: FieldSpec = {
      ...buildFieldSpec(key, 'literal', opts),
      values: [...values],
      // single-value literals are zero-bit (only one valid index)
      bits: values.length === 1 ? 0 : Math.ceil(Math.log2(values.length))
    }

    return addField(spec) as unknown as
      CallbackData<Simplify<State & DetermineStateKey<V[number], K, O>>>
  }

  const inspect = () => ({
    slug,
    rawSlug,
    fields: fields.map(f => ({ key: f.key, type: f.type, optional: f.optional })),
    conditions: conditions.length
  })

  const out = {
    filter,
    slug,
    rawSlug,
    fields: Object.freeze(fields.map(f => Object.freeze({ ...f }))),
    string: addString,
    number: addNumber,
    boolean: addBoolean,
    literal: addLiteral,
    with: withConditions,
    pack,
    unpack,
    validate,
    button,
    repack
  }

  Object.defineProperty(out, Symbol.for('nodejs.util.inspect.custom'), {
    value: inspect,
    enumerable: false
  })

  return out as unknown as CallbackData<State, Narrowed>
}

function buildFieldSpec (
  key: string,
  type: FieldSpec['type'],
  opts: { optional?: boolean, default?: Accepted } | undefined
) {
  if (opts?.optional === true && opts?.default !== undefined) {
    throw new RangeError(`field "${key}": optional and default are mutually exclusive`)
  }

  const spec: FieldSpec = {
    key,
    type,
    optional: opts?.optional ?? false
  }

  if (opts?.default !== undefined) {
    spec.default = opts.default
  }

  return spec
}
