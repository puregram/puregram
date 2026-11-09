import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { wrap } from '../src/proxy'
import { ttl } from '../src/ttl'

describe('wrap()', () => {
  it('reads and writes pass through to the underlying object', () => {
    // proxy operates on the passed-in target directly — mutations flow through to `data`
    // (no defensive copy: lets storage.set(key, data) save the actually-mutated state.)
    const onChange = vi.fn()
    const $forceUpdate = vi.fn()
    const data: Record<string, unknown> = { a: 1 }
    const proxy = wrap(data, $forceUpdate, new Map(), onChange)

    expect(proxy.a).toBe(1)

    proxy.b = 2

    expect(proxy.b).toBe(2)
    expect(data.b).toBe(2)
  })

  it('writes flip onChange', () => {
    const onChange = vi.fn()
    const proxy = wrap({}, vi.fn(), new Map(), onChange)

    proxy.x = 1

    expect(onChange).toHaveBeenCalled()
  })

  it('deletes flip onChange and remove the key', () => {
    const onChange = vi.fn()
    const proxy = wrap({ x: 1 }, vi.fn(), new Map(), onChange)

    onChange.mockClear()

    delete proxy.x

    expect(onChange).toHaveBeenCalled()
    expect(proxy.x).toBeUndefined()
  })

  it('detects nested writes through recursive proxying', () => {
    const onChange = vi.fn()
    const data: Record<string, unknown> = { user: { name: 'a' } }
    const proxy = wrap(data, vi.fn(), new Map(), onChange) as Record<string, Record<string, unknown>>

    proxy.user.name = 'b'

    expect(onChange).toHaveBeenCalled()
    expect(data.user).toEqual({ name: 'b' })
  })

  it('$forceUpdate magic key returns the supplied closure', () => {
    const $forceUpdate = vi.fn().mockResolvedValue(true)
    const proxy = wrap({}, $forceUpdate, new Map(), vi.fn())

    expect(proxy.$forceUpdate).toBe($forceUpdate)
  })

  describe('ttl expiry', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('removes expired fields from reads, membership, and enumeration at the deadline', () => {
      const onChange = vi.fn()
      const proxy = wrap({}, vi.fn(), new Map(), onChange)

      proxy.token = ttl('secret', 1_000)
      expect(proxy.token).toBe('secret')
      onChange.mockClear()
      vi.advanceTimersByTime(1_000)

      expect('token' in proxy).toBe(false)
      expect(Object.keys(proxy)).toEqual([])
      expect(proxy.token).toBeUndefined()
      expect(onChange).toHaveBeenCalled()
    })

    it('refreshes a field deadline on ordinary reassignment', () => {
      const proxy = wrap({}, vi.fn(), new Map(), vi.fn())

      proxy.token = ttl('first', 1_000)
      vi.advanceTimersByTime(500)
      proxy.token = 'second'
      vi.advanceTimersByTime(500)

      expect(proxy.token).toBe('second')
      vi.advanceTimersByTime(500)
      expect(proxy.token).toBeUndefined()
    })

    it('clears a field deadline with ttl(value, 0)', () => {
      const proxy = wrap({}, vi.fn(), new Map(), vi.fn())

      proxy.token = ttl('old', 1_000)
      proxy.token = ttl('new', 0)
      vi.advanceTimersByTime(2_000)

      expect(proxy.token).toBe('new')
    })
  })

  it('returns the original value unchanged for non-objects', () => {
    const wrapped = wrap('hello' as unknown as Record<string, unknown>, vi.fn(), new Map(), vi.fn())

    expect(wrapped).toBe('hello')
  })

  it('does not double-proxy already-proxied values', () => {
    const proxy = wrap({ a: 1 }, vi.fn(), new Map(), vi.fn())
    const reproxy = wrap(proxy, vi.fn(), new Map(), vi.fn())

    expect(reproxy).toBe(proxy)
  })

  describe('array support', () => {
    it('detects writes when assigning an index on a nested array', () => {
      const onChange = vi.fn()
      const proxy = wrap({ tags: ['a', 'b'] }, vi.fn(), new Map(), onChange) as { tags: string[] }

      onChange.mockClear()

      proxy.tags[0] = 'z'

      expect(onChange).toHaveBeenCalled()
      expect(proxy.tags[0]).toBe('z')
    })

    it('detects pushes on a nested array', () => {
      const onChange = vi.fn()
      const proxy = wrap({ tags: ['a'] }, vi.fn(), new Map(), onChange) as { tags: string[] }

      onChange.mockClear()

      proxy.tags.push('b')

      expect(onChange).toHaveBeenCalled()
      expect(proxy.tags).toEqual(['a', 'b'])
    })

    it('detects splices on a nested array', () => {
      const onChange = vi.fn()
      const proxy = wrap({ tags: ['a', 'b', 'c'] }, vi.fn(), new Map(), onChange) as { tags: string[] }

      onChange.mockClear()

      proxy.tags.splice(1, 1)

      expect(onChange).toHaveBeenCalled()
      expect(proxy.tags).toEqual(['a', 'c'])
    })

    it('detects writes inside objects nested inside arrays', () => {
      const onChange = vi.fn()
      const proxy = wrap({ users: [{ name: 'a' }] }, vi.fn(), new Map(), onChange) as { users: { name: string }[] }

      onChange.mockClear()

      proxy.users[0].name = 'b'

      expect(onChange).toHaveBeenCalled()
      expect(proxy.users[0].name).toBe('b')
    })

    it('detects pushes after deletes (array not stale-proxied)', () => {
      const onChange = vi.fn()
      const proxy = wrap({ tags: ['a'] }, vi.fn(), new Map(), onChange) as { tags: string[] }

      onChange.mockClear()

      proxy.tags.pop()
      proxy.tags.push('z')

      expect(onChange).toHaveBeenCalled()
      expect(proxy.tags).toEqual(['z'])
    })
  })
})
