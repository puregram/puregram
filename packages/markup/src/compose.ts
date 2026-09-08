/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion, local-rules/no-redundant-return-type */
import { type Entity, Formatted } from './formatted'
import { interpolate, type Piece } from './interpolate'

type Interp =
  | string
  | number
  | Formatted
  | { text: string, entities?: readonly Entity[] }
  | null
  | undefined
  | false

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

function buildPieces (
  strings: TemplateStringsArray,
  rest: readonly Interp[],
  transformLiteral: (s: string, isFirst: boolean, isLast: boolean) => string
) {
  const pieces: Piece[] = []

  for (let i = 0; i < strings.length; i++) {
    const isFirst = i === 0
    const isLast = i === strings.length - 1
    const literal = transformLiteral(strings[i] ?? '', isFirst, isLast)

    if (literal !== '') {
      pieces.push({ kind: 'text', value: literal })
    }

    if (i < rest.length) {
      pieces.push(pieceFromInterp(rest[i]))
    }
  }

  return pieces
}

const RE_SPECIALS = /[.*+?^${}()|[\]\\]/g

function escapeForRegExp (s: string) {
  return s.replace(RE_SPECIALS, '\\$&')
}

function detectFirstIndent (strings: TemplateStringsArray) {
  const first = strings[0] ?? ''

  if (!first.startsWith('\n')) {
    return null
  }

  const m = first.match(/^\n([ \t]+)/)

  return m === null ? '' : m[1] ?? ''
}

function applyFirstIndentStrip (s: string, indent: string, isFirst: boolean, isLast: boolean) {
  let out = s

  if (isFirst && out.startsWith('\n')) {
    out = out.slice(1)

    if (indent !== '' && out.startsWith(indent)) {
      out = out.slice(indent.length)
    }
  }

  if (indent !== '') {
    out = out.replace(new RegExp(`\\n${escapeForRegExp(indent)}`, 'g'), '\n')
  }

  if (isLast) {
    out = out.replace(/\n[ \t]*$/, '')
  }

  return out
}

function applyDedentAll (s: string, isFirst: boolean, isLast: boolean) {
  let out = s

  if (isFirst && out.startsWith('\n')) {
    out = out.slice(1)
  }

  out = out.replace(/\n[ \t]+/g, '\n')

  if (isFirst) {
    out = out.replace(/^[ \t]+/, '')
  }

  if (isLast) {
    out = out.replace(/\n[ \t]*$/, '')
  }

  return out
}

export function format (strings: TemplateStringsArray, ...rest: readonly Interp[]) {
  const indent = detectFirstIndent(strings)
  const transform = indent === null
    ? (s: string) => s
    : (s: string, isFirst: boolean, isLast: boolean) => applyFirstIndentStrip(s, indent, isFirst, isLast)

  const pieces = buildPieces(strings, rest, transform)
  const { text, entities } = interpolate(pieces)

  return new Formatted(text, entities)
}

export function formatDedent (strings: TemplateStringsArray, ...rest: readonly Interp[]) {
  const pieces = buildPieces(strings, rest, applyDedentAll)
  const { text, entities } = interpolate(pieces)

  return new Formatted(text, entities)
}
