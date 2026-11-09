import { PROXY_SYM, TTL_SYM, type TtlData, type TtlWrapped } from './ttl'

// eslint-disable-next-line local-rules/no-redundant-return-type -- type predicate is needed for narrowing
const isPlainObject = (object: unknown): object is Record<string, unknown> => (
  Object.prototype.toString.call(object) === '[object Object]'
)

// proxiable = plain objects + arrays. excluded on purpose: class instances (serialization
// round-trip + #private fields), builtins like Date/Map/Set/RegExp/Promise (internal slots bypass Proxy traps)
// eslint-disable-next-line local-rules/no-redundant-return-type -- type predicate needed for narrowing
const isProxiable = (value: unknown): value is Record<string, unknown> => (
  isPlainObject(value) || Array.isArray(value)
)

// eslint-disable-next-line local-rules/no-redundant-return-type -- type predicate is needed for narrowing
const isTtlWrapped = (value: unknown): value is TtlWrapped<unknown> => (
  typeof value === 'object' && value !== null && (value as { [TTL_SYM]?: unknown })[TTL_SYM] === true
)

const isProxied = (value: unknown) => (
  typeof value === 'object' && value !== null && (value as { [PROXY_SYM]?: unknown })[PROXY_SYM] === true
)

export type ForceUpdate = () => Promise<void>
export type OnChange = () => void

/**
 * wraps `value` in a transparent proxy that:
 *   - records writes (calls `onChange()`)
 *   - records ttl entries when the assigned value is `ttl(...)`
 *   - re-proxies nested objects lazily on first access
 *   - exposes `$forceUpdate` as a magic key returning the supplied closure
 *   - exposes `PROXY_SYM` so re-wrapping is a no-op
 */
export function wrap (
  value: Record<string, unknown>,
  $forceUpdate: ForceUpdate,
  ttlMap: Map<string, TtlData>,
  onChange: OnChange
) {
  if (typeof value !== 'object' || value === null) {
    return value
  }

  if (isProxied(value)) {
    return value
  }

  const proxies = new WeakMap<object, Map<string, Record<string, unknown>>>()
  const targets = new WeakMap<object, Record<string, unknown>>()

  const proxify = (target: Record<string, unknown>, path: string[] = []): Record<string, unknown> => {
    const encodedParent = JSON.stringify(path)
    let cached = proxies.get(target)
    const existing = cached?.get(encodedParent)

    if (existing !== undefined) {
      return existing
    }

    const clearChildren = (encodedPath: string) => {
      const prefix = `${encodedPath.slice(0, -1)},`

      for (const candidate of ttlMap.keys()) {
        if (candidate.startsWith(prefix)) {
          ttlMap.delete(candidate)
        }
      }
    }

    const expire = (t: Record<string, unknown>, key: string) => {
      if (ttlMap.size === 0) {
        return
      }

      const encodedPath = JSON.stringify([...path, key])
      const entry = ttlMap.get(encodedPath)

      if (entry !== undefined && Date.now() - entry.at >= entry.t) {
        delete t[key]
        ttlMap.delete(encodedPath)
        clearChildren(encodedPath)
        onChange()
      }
    }

    const proxy = new Proxy(target, {
      get (t, key) {
        if (key === PROXY_SYM) {
          return true
        }

        if (key === '$forceUpdate') {
          return $forceUpdate
        }

        if (typeof key === 'symbol') {
          return Reflect.get(t, key) as unknown
        }

        expire(t, key)

        const value = t[key]

        return isProxiable(value) && !isProxied(value)
          ? proxify(value, [...path, key])
          : value
      },

      has (t, key) {
        if (typeof key === 'string') {
          expire(t, key)
        }

        return Reflect.has(t, key)
      },

      ownKeys (t) {
        for (const key of Object.keys(t)) {
          expire(t, key)
        }

        return Reflect.ownKeys(t)
      },

      set (t, key, val: unknown) {
        if (typeof key === 'symbol') {
          return false
        }

        onChange()

        const wrapped = isTtlWrapped(val) ? val : undefined

        if (wrapped !== undefined || ttlMap.size !== 0) {
          const encodedPath = JSON.stringify([...path, key])

          clearChildren(encodedPath)

          if (wrapped !== undefined) {
            if (wrapped.t === 0) {
              ttlMap.delete(encodedPath)
            } else {
              ttlMap.set(encodedPath, { t: wrapped.t, at: Date.now() })
            }
          } else {
            const entry = ttlMap.get(encodedPath)

            if (entry !== undefined) {
              entry.at = Date.now()
            }
          }
        }

        if (wrapped !== undefined) {
          val = wrapped.value
        }

        if (typeof val === 'object' && val !== null) {
          val = targets.get(val) ?? val
        }

        t[key] = val

        return true
      },

      deleteProperty (t, key) {
        if (typeof key === 'symbol') {
          return false
        }

        const encodedPath = JSON.stringify([...path, key])

        onChange()
        delete t[key]
        ttlMap.delete(encodedPath)
        clearChildren(encodedPath)

        return true
      }
    })

    if (cached === undefined) {
      cached = new Map()
      proxies.set(target, cached)
    }

    cached.set(encodedParent, proxy)
    targets.set(proxy, target)

    return proxy
  }

  return proxify(value)
}
