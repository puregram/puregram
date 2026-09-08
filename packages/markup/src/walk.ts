/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { type Entity, Formatted } from './formatted'

export interface FormattableSlot {
  readonly path: readonly string[]
  readonly textKey: string
  readonly entitiesKey: string
}

export type FormattableFields = Readonly<Record<string, readonly FormattableSlot[]>>

interface RawFormattable {
  text: string
  entities?: readonly Entity[]
}

function asFormattable (value: unknown) {
  if (value instanceof Formatted) {
    return value
  }

  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Partial<RawFormattable>

  if (typeof candidate.text !== 'string') {
    return null
  }

  if (candidate.entities !== undefined && !Array.isArray(candidate.entities)) {
    return null
  }

  for (const key of Object.keys(candidate)) {
    if (key !== 'text' && key !== 'entities') {
      return null
    }
  }

  return Formatted.from(candidate as RawFormattable)
}

function applyAtLeaf (parent: Record<string, unknown>, slot: FormattableSlot) {
  const formatted = asFormattable(parent[slot.textKey])

  if (formatted === null) {
    return parent
  }

  const keepCallerEntities = formatted.entities.length === 0 && parent[slot.entitiesKey] !== undefined

  return {
    ...parent,
    [slot.textKey]: formatted.text,
    ...(keepCallerEntities ? {} : { [slot.entitiesKey]: [...formatted.entities] })
  }
}

function walkPath (node: unknown, path: readonly string[], slot: FormattableSlot): unknown {
  if (typeof node !== 'object' || node === null) {
    return node
  }

  const head = path[0] as string

  if (path.length === 1) {
    return applyAtLeaf(node as Record<string, unknown>, slot)
  }

  const tail = path.slice(1)

  if (head === '*') {
    if (!Array.isArray(node)) {
      return walkPath(node, tail, slot)
    }

    const items = node as unknown[]
    let out: unknown[] | undefined

    for (let i = 0; i < items.length; i++) {
      const next = walkPath(items[i], tail, slot)

      if (next !== items[i]) {
        out ??= items.slice()
        out[i] = next
      }
    }

    return out ?? items
  }

  const record = node as Record<string, unknown>
  const next = walkPath(record[head], tail, slot)

  return next === record[head] ? record : { ...record, [head]: next }
}

/**
 * returns `params` with every `Formatted` (or `{ text, entities }` shape) at a known formattable
 * slot replaced by its plain text + sibling entities array. objects on an unchanged path keep
 * their identity, so the caller's own params tree is never rewritten.
 * descriptor comes from `@puregram/api`'s codegenned `FORMATTABLE_FIELDS`
 */
export function unwrapFormatted (
  method: string,
  params: Record<string, unknown> | undefined,
  fields: FormattableFields
) {
  if (params === undefined) {
    return params
  }

  const slots = fields[method]

  if (slots === undefined) {
    return params
  }

  let out = params

  for (const slot of slots) {
    out = walkPath(out, slot.path, slot) as Record<string, unknown>
  }

  return out
}
