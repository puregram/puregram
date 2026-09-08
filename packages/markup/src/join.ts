/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion, local-rules/no-redundant-return-type */
import { type Entity, Formatted } from './formatted'
import { interpolate, type Piece } from './interpolate'

type Joinable =
  | string
  | number
  | Formatted
  | { text: string, entities?: readonly Entity[] }
  | null
  | undefined
  | false

function pieceFromJoinable (value: Joinable): Piece {
  if (value === null || value === undefined || value === false) {
    return { kind: 'skip' }
  }

  if (typeof value === 'string') {
    return { kind: 'text', value }
  }

  if (typeof value !== 'object') {
    return { kind: 'text', value: String(value) }
  }

  return { kind: 'formatted', value: Formatted.from(value) }
}

/**
 * merge an array of strings/numbers/Formatted into one Formatted, separated by `separator`.
 * `null` / `undefined` / `false` parts are dropped silently
 */
export function join (parts: readonly Joinable[], separator: Joinable = '') {
  const filtered = parts.filter(
    p => p !== null && p !== undefined && p !== false
  )
  const sepPiece = pieceFromJoinable(separator)
  const pieces: Piece[] = []

  for (let i = 0; i < filtered.length; i++) {
    if (i > 0) {
      pieces.push(sepPiece)
    }

    pieces.push(pieceFromJoinable(filtered[i] as Joinable))
  }

  const { text, entities } = interpolate(pieces)

  return new Formatted(text, entities)
}

/** alias for {@link join} */
export const joinWithEntities = join
