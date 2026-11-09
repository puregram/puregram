/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion, local-rules/no-redundant-return-type */
import { type Entity, Formatted } from '../formatted'
import { interpolate, type Piece } from '../interpolate'

export type ModifierName =
  | 'bold' | 'italic' | 'underline' | 'strikethrough'
  | 'spoiler' | 'blockquote' | 'expandableBlockquote' | 'code'
  | 'tonAddress' | 'bankCardNumber'

export const MODIFIER_NAMES: ReadonlySet<ModifierName> = new Set<ModifierName>([
  'bold', 'italic', 'underline', 'strikethrough',
  'spoiler', 'blockquote', 'expandableBlockquote', 'code',
  'tonAddress', 'bankCardNumber'
])

const TYPE_MAP: Readonly<Record<ModifierName, Entity['type']>> = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  strikethrough: 'strikethrough',
  spoiler: 'spoiler',
  blockquote: 'blockquote',
  expandableBlockquote: 'expandable_blockquote',
  code: 'code',
  tonAddress: 'ton_address',
  bankCardNumber: 'bank_card_number'
}

type Interp =
  | string
  | number
  | Formatted
  | { text: string, entities?: readonly Entity[] }
  | null
  | undefined
  | false

export interface ModifierFn {
  (text: string): Formatted
  (formatted: Formatted | { text: string, entities?: readonly Entity[] }): Formatted
  (strings: TemplateStringsArray, ...rest: readonly Interp[]): Formatted
}

export type Modifier = ModifierFn & { readonly [K in ModifierName]: Modifier }

function pieceFromInterp (value: Interp): Piece {
  if (value === null || value === undefined || value === false) {
    return { kind: 'skip' }
  }

  if (typeof value === 'string') {
    return { kind: 'text', value }
  }

  if (typeof value === 'number') {
    return { kind: 'text', value: String(value) }
  }

  return { kind: 'formatted', value: Formatted.from(value) }
}

function applyChain (chain: readonly ModifierName[], inner: Formatted) {
  const wrap: Entity[] = chain.map(name => ({
    type: TYPE_MAP[name],
    offset: 0,
    length: inner.text.length
  }))

  return new Formatted(inner.text, [...wrap, ...inner.entities])
}

function isTemplateStringsArray (value: unknown): value is TemplateStringsArray {
  return Array.isArray(value) && Array.isArray((value as unknown as { raw?: unknown }).raw)
}

function applyToArgs (chain: readonly ModifierName[], args: readonly unknown[]) {
  if (args.length === 0) {
    throw new TypeError('modifier called with no arguments')
  }

  const first = args[0]

  if (typeof first === 'string') {
    return applyChain(chain, new Formatted(first))
  }

  if (first instanceof Formatted) {
    return applyChain(chain, first)
  }

  if (isTemplateStringsArray(first)) {
    const strings = first
    const rest = args.slice(1) as readonly Interp[]
    const pieces: Piece[] = []

    for (let i = 0; i < strings.length; i++) {
      const literal = strings[i] ?? ''

      if (literal !== '') {
        pieces.push({ kind: 'text', value: literal })
      }

      if (i < rest.length) {
        pieces.push(pieceFromInterp(rest[i] as Interp))
      }
    }

    const { text, entities } = interpolate(pieces)

    return applyChain(chain, new Formatted(text, entities))
  }

  if (typeof first === 'object' && first !== null && 'text' in (first)) {
    return applyChain(chain, Formatted.from(first as { text: string, entities?: readonly Entity[] }))
  }

  throw new TypeError('modifier called with unsupported argument type')
}

export function makeModifier (chain: readonly ModifierName[]): Modifier {
  const fn = (...args: readonly unknown[]) => applyToArgs(chain, args)

  return new Proxy(fn, {
    get (target, prop, receiver) {
      if (typeof prop === 'string' && MODIFIER_NAMES.has(prop as ModifierName)) {
        return makeModifier([...chain, prop as ModifierName])
      }

      return Reflect.get(target, prop, receiver) as unknown
    }
  }) as unknown as Modifier
}
