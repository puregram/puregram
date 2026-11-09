export const PROXY_SYM = Symbol('proxy')
export const TTL_SYM = Symbol('ttl')

export interface TtlData {
  t: number
  at: number
}

export interface TtlWrapped<T> {
  [TTL_SYM]: true
  value: T
  t: number
}

/**
 * marks a value to expire `t` ms after it was last set (lazy — checked on read)
 * `t === 0` clears any existing ttl for the key on assignment
 */
export function ttl<T> (value: T, t = 30_000): T {
  if (!Number.isFinite(t) || t < 0) {
    throw new RangeError('ttl duration must be a finite non-negative number')
  }

  return {
    [TTL_SYM]: true,
    value,
    t
  } as unknown as T
}

const SESSION_RECORD = '@puregram/session'

type StoredSession = [typeof SESSION_RECORD, 1, unknown, [string, TtlData][]]

const isStoredSession = (value: unknown): value is StoredSession => (
  Array.isArray(value) && value.length === 4 && value[0] === SESSION_RECORD && value[1] === 1 &&
  Array.isArray(value[3]) && value[3].every((entry: unknown) => {
    if (!Array.isArray(entry) || entry.length !== 2 || typeof entry[0] !== 'string' ||
      typeof entry[1] !== 'object' || entry[1] === null) {
      return false
    }

    const data = entry[1] as Partial<TtlData>

    if (typeof data.t !== 'number' || !Number.isFinite(data.t) || data.t <= 0 ||
      typeof data.at !== 'number' || !Number.isFinite(data.at)) {
      return false
    }

    try {
      const path: unknown = JSON.parse(entry[0])

      return Array.isArray(path) && path.length > 0 && path.every(part => typeof part === 'string')
    } catch {
      return false
    }
  })
)

export function readSession (stored: unknown) {
  return isStoredSession(stored)
    ? { value: stored[2], ttlMap: new Map<string, TtlData>(stored[3].map(([key, data]) => [key, { ...data }])) }
    : { value: stored, ttlMap: new Map<string, TtlData>() }
}

export function writeSession (value: unknown, ttlMap: Map<string, TtlData>) {
  if (ttlMap.size === 0 && !isStoredSession(value)) {
    return value
  }

  return [SESSION_RECORD, 1, value, Array.from(ttlMap, ([key, data]) => [key, { ...data }])]
}

export function expireSession (value: unknown, ttlMap: Map<string, TtlData>) {
  const now = Date.now()
  let changed = false

  for (const [encodedPath, data] of ttlMap) {
    const path = JSON.parse(encodedPath) as string[]
    let target = value

    for (let index = 0; index < path.length - 1; index++) {
      const part = path[index]

      target = part !== undefined && typeof target === 'object' && target !== null && Object.prototype.hasOwnProperty.call(target, part)
        ? (target as Record<string, unknown>)[part]
        : undefined
    }

    const key = path[path.length - 1]

    if (key === undefined || typeof target !== 'object' || target === null || !Object.prototype.hasOwnProperty.call(target, key)) {
      ttlMap.delete(encodedPath)
      changed = true
    } else if (now - data.at >= data.t) {
      delete (target as Record<string, unknown>)[key]
      ttlMap.delete(encodedPath)
      changed = true
    }
  }

  return changed
}
