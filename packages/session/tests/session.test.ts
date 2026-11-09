import { setImmediate as immediate } from 'node:timers/promises'

import { type KVStorage, MemoryStorage, type TtlStorage } from '@puregram/storage'
import { Telegram } from 'puregram'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { session } from '../src/session'
import { ttl } from '../src/ttl'
import type { SessionContext } from '../src/types'

// MemoryStorage doesn't implement TtlStorage, so the "touch instead of flush" test
// uses this minimal subclass to verify session calls touch when isTtlStorage(storage)
class TouchableMemoryStorage<V = unknown> extends MemoryStorage<V> implements TtlStorage<V> {
  readonly touched: string[] = []

  touch (key: string) {
    this.touched.push(key)

    return Promise.resolve()
  }
}

// declare-merge custom test kinds so tg.on('probe', h) typechecks without per-call casts
// (each interface uses index signature first to keep member-ordering happy.)
interface ProbeUpdate {
  [key: string]: unknown
  kind: 'probe'
}

interface OrphanUpdate {
  kind: 'orphan'
  x: number
}

interface ReadonlyKindUpdate {
  kind: 'readonly'
  from?: { id: number }
}

interface PriorityUpdate {
  kind: 'priority'
  from?: { id: number }
  senderChat?: { id: number }
  chat?: { id: number }
}

interface AnyKindUpdate {
  kind: 'any'
  from?: { id: number }
}

interface SeedUpdate {
  kind: 'seed'
  from?: { id: number }
}

interface IdempotentUpdate {
  kind: 'idempotent'
  from?: { id: number }
}

declare module '@puregram/api' {
  interface UpdateKindMap {
    probe: ProbeUpdate
    orphan: OrphanUpdate
    readonly: ReadonlyKindUpdate
    priority: PriorityUpdate
    any: AnyKindUpdate
    seed: SeedUpdate
    idempotent: IdempotentUpdate
  }
}

const STUB_BOT = { id: 1, is_bot: true as const, first_name: 'bot', username: 'testbot' }

const makeTg = (storage = new MemoryStorage()) =>
  new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(session({ storage }))

describe('session() — install shape', () => {
  it('returns { get, set, delete } under tg.session', async () => {
    const t = makeTg()

    await t.start()

    expect(typeof t.session.get).toBe('function')
    expect(typeof t.session.set).toBe('function')
    expect(typeof t.session.delete).toBe('function')

    await t.shutdown()
  })

  it('tg.session.set/get round-trips through the configured storage', async () => {
    const storage = new MemoryStorage()
    const t = makeTg(storage)

    await t.start()
    await t.session.set('user:1', { counter: 0 })

    expect(await t.session.get('user:1')).toEqual({ counter: 0 })
    expect(await storage.get('user:1')).toEqual({ counter: 0 })

    await t.shutdown()
  })

  it('tg.session.delete removes the entry', async () => {
    const t = makeTg()

    await t.start()
    await t.session.set('k', 1)
    await t.session.delete('k')

    expect(await t.session.get('k')).toBeUndefined()

    await t.shutdown()
  })
})

describe('session() — onUpdate middleware', () => {
  it('attaches update.session and persists writes after next()', async () => {
    const storage = new MemoryStorage()
    const t = makeTg(storage)

    await t.start()

    t.defineUpdate('probe')
    t.on('probe', (u: any) => {
      u.session.counter = ((u.session.counter as number | undefined) ?? 0) + 1
    })

    t.emit('probe', { from: { id: 7 } })
    await new Promise(resolve => setImmediate(resolve))

    expect(await storage.get('user:7')).toEqual({ counter: 1 })

    t.emit('probe', { from: { id: 7 } })
    await new Promise(resolve => setImmediate(resolve))

    expect(await storage.get('user:7')).toEqual({ counter: 2 })

    await t.shutdown()
  })

  it('skips updates whose getStorageKey returns undefined (no session attached)', async () => {
    const storage = new MemoryStorage()
    const setSpy = vi.spyOn(storage, 'set')

    const t = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(session({ storage }))

    await t.start()

    t.defineUpdate('orphan')

    let received: any

    t.on('orphan', (u: any) => {
      received = u
    })

    t.emit('orphan', { x: 1 })
    await new Promise(resolve => setImmediate(resolve))

    expect(received.session).toBeUndefined()
    expect(setSpy).not.toHaveBeenCalled()

    await t.shutdown()
  })

  it('does not flush when nothing changed; calls touch on TtlStorage backends', async () => {
    const storage = new TouchableMemoryStorage()

    await storage.set('user:7', { existing: true })

    const setSpy = vi.spyOn(storage, 'set')
    const touchSpy = vi.spyOn(storage, 'touch')

    const t = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(session({ storage }))

    await t.start()

    t.defineUpdate('readonly')
    t.on('readonly', (u: any) => {
      const _read = u.session.existing as boolean

      return _read
    })

    setSpy.mockClear()
    t.emit('readonly', { from: { id: 7 } })
    await new Promise(resolve => setImmediate(resolve))

    expect(setSpy).not.toHaveBeenCalled()
    expect(touchSpy).toHaveBeenCalledWith('user:7')

    await t.shutdown()
  })

  it('does not flush or touch when nothing changed on a plain KVStorage backend', async () => {
    const storage = new MemoryStorage()

    await storage.set('user:7', { existing: true })

    const setSpy = vi.spyOn(storage, 'set')

    const t = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(session({ storage }))

    await t.start()

    t.defineUpdate('readonly')
    t.on('readonly', (u: any) => {
      const _read = u.session.existing as boolean

      return _read
    })

    setSpy.mockClear()
    t.emit('readonly', { from: { id: 7 } })
    await new Promise(resolve => setImmediate(resolve))

    expect(setSpy).not.toHaveBeenCalled()

    await t.shutdown()
  })

  it('default getStorageKey: composite user + chat segments', async () => {
    const storage = new MemoryStorage()
    const t = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(session({ storage }))

    await t.start()

    t.defineUpdate('priority')
    t.on('priority', (u: any) => {
      u.session.hit = true
    })

    t.emit('priority', { from: { id: 1 }, chat: { id: 3 } })
    await new Promise(resolve => setImmediate(resolve))

    expect(await storage.get('user:1:chat:3')).toEqual({ hit: true })

    t.emit('priority', { chat: { id: 3 } })
    await new Promise(resolve => setImmediate(resolve))

    expect(await storage.get('chat:3')).toEqual({ hit: true })

    t.emit('priority', { from: { id: 9 } })
    await new Promise(resolve => setImmediate(resolve))

    expect(await storage.get('user:9')).toEqual({ hit: true })

    await t.shutdown()
  })

  it('user-supplied getStorageKey overrides the default', async () => {
    const storage = new MemoryStorage()
    const t = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(session({
      storage,
      getStorageKey: () => 'global'
    }))

    await t.start()

    t.defineUpdate('any')
    t.on('any', (u: any) => {
      u.session.shared = true
    })

    t.emit('any', { from: { id: 1 } })
    await new Promise(resolve => setImmediate(resolve))

    expect(await storage.get('global')).toEqual({ shared: true })
    expect(await storage.get('user:1')).toBeUndefined()

    await t.shutdown()
  })

  it('initial(update) seeds the session when storage is empty', async () => {
    const storage = new MemoryStorage()
    const t = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(session({
      storage,
      initial: () => ({ counter: 100 })
    }))

    await t.start()

    t.defineUpdate('seed')
    t.on('seed', (u: any) => {
      u.session.counter = (u.session.counter as number) + 1
    })

    t.emit('seed', { from: { id: 9 } })
    await new Promise(resolve => setImmediate(resolve))

    expect(await storage.get('user:9')).toEqual({ counter: 101 })

    await t.shutdown()
  })

  it('exposes $forceUpdate on the proxy', async () => {
    const storage = new MemoryStorage()
    const t = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(session({ storage }))

    await t.start()

    t.defineUpdate('idempotent')

    let firstSession: unknown

    t.on('idempotent', (u: any) => {
      firstSession = u.session
    })

    t.emit('idempotent', { from: { id: 1 } })
    await new Promise(resolve => setImmediate(resolve))

    expect(typeof (firstSession as any).$forceUpdate).toBe('function')

    await t.shutdown()
  })
})

interface LazyNoTouchUpdate {
  kind: 'lazy-no-touch'
  from?: { id: number }
}

interface LazyReadUpdate {
  kind: 'lazy-read'
  from?: { id: number }
}

interface LazyMutateUpdate {
  kind: 'lazy-mutate'
  from?: { id: number }
}

interface ThreadUpdate {
  kind: 'thread'
  from?: { id: number }
  chatId?: number
  messageThreadId?: number
}

interface CustomKeyUpdate {
  kind: 'custom-key'
  from?: { id: number }
  chatId?: number
}

declare module '@puregram/api' {
  interface UpdateKindMap {
    'lazy-no-touch': LazyNoTouchUpdate
    'lazy-read': LazyReadUpdate
    'lazy-mutate': LazyMutateUpdate
    thread: ThreadUpdate
    'custom-key': CustomKeyUpdate
  }
}

describe('session() — lazy loading', () => {
  it('handler that does not touch session fires 0 get and 0 set', async () => {
    const storage = new MemoryStorage()
    const getSpy = vi.spyOn(storage, 'get')
    const setSpy = vi.spyOn(storage, 'set')

    const t = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(session({ storage, lazy: true }))

    await t.start()

    t.defineUpdate('lazy-no-touch')
    t.on('lazy-no-touch', () => {
      // never accesses update.session
    })

    getSpy.mockClear()
    setSpy.mockClear()

    t.emit('lazy-no-touch', { from: { id: 1 } })
    await new Promise(resolve => setImmediate(resolve))

    expect(getSpy).not.toHaveBeenCalled()
    expect(setSpy).not.toHaveBeenCalled()

    await t.shutdown()
  })

  it('handler that only reads session fires 1 get and 0 set', async () => {
    const storage = new MemoryStorage()

    await storage.set('user:1', { existing: true })

    const getSpy = vi.spyOn(storage, 'get')
    const setSpy = vi.spyOn(storage, 'set')

    const t = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(session({ storage, lazy: true }))

    await t.start()

    t.defineUpdate('lazy-read')
    t.on('lazy-read', async (u: any) => {
      const s = await u.session
      const _read = s.existing as boolean

      return _read
    })

    getSpy.mockClear()
    setSpy.mockClear()

    t.emit('lazy-read', { from: { id: 1 } })
    await new Promise(resolve => setImmediate(resolve))

    expect(getSpy).toHaveBeenCalledTimes(1)
    expect(setSpy).not.toHaveBeenCalled()

    await t.shutdown()
  })

  it('handler that mutates session fires 1 get and 1 set', async () => {
    const storage = new MemoryStorage()
    const getSpy = vi.spyOn(storage, 'get')
    const setSpy = vi.spyOn(storage, 'set')

    const t = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(session({ storage, lazy: true }))

    await t.start()

    t.defineUpdate('lazy-mutate')
    t.on('lazy-mutate', async (u: any) => {
      const s = await u.session

      s.counter = 1
    })

    getSpy.mockClear()
    setSpy.mockClear()

    t.emit('lazy-mutate', { from: { id: 1 } })
    await new Promise(resolve => setImmediate(resolve))

    expect(getSpy).toHaveBeenCalledTimes(1)
    expect(setSpy).toHaveBeenCalledTimes(1)

    await t.shutdown()
  })
})

describe('session() — composite keys', () => {
  it('thread-aware keying via update.messageThreadId', async () => {
    const storage = new MemoryStorage()
    const t = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(session({
      storage,
      getStorageKey: (u: any) => ({
        chat: u.chatId as number | undefined,
        user: u.from?.id as number | undefined,
        thread: u.messageThreadId as number | undefined
      })
    }))

    await t.start()

    t.defineUpdate('thread')
    t.on('thread', async (u: any) => {
      const s = await u.session

      s.hit = true
    })

    t.emit('thread', { from: { id: 5 }, chatId: 100, messageThreadId: 7 })
    await new Promise(resolve => setImmediate(resolve))

    expect(await storage.get('user:5:chat:100:thread:7')).toEqual({ hit: true })

    await t.shutdown()
  })

  it('custom `key` segment lands at the end of the composite key', async () => {
    const storage = new MemoryStorage()
    const t = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(session({
      storage,
      getStorageKey: (u: any) => ({
        user: u.from?.id as number | undefined,
        key: 'workflow:a'
      })
    }))

    await t.start()

    t.defineUpdate('custom-key')
    t.on('custom-key', async (u: any) => {
      const s = await u.session

      s.hit = true
    })

    t.emit('custom-key', { from: { id: 5 } })
    await new Promise(resolve => setImmediate(resolve))

    expect(await storage.get('user:5:key:workflow:a')).toEqual({ hit: true })

    await t.shutdown()
  })

  it('plain-string getStorageKey return is used verbatim', async () => {
    const storage = new MemoryStorage()
    const t = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(session({
      storage,
      getStorageKey: () => 'singleton'
    }))

    await t.start()

    t.defineUpdate('custom-key')
    t.on('custom-key', async (u: any) => {
      const s = await u.session

      s.hit = true
    })

    t.emit('custom-key', {})
    await new Promise(resolve => setImmediate(resolve))

    expect(await storage.get('singleton')).toEqual({ hit: true })

    await t.shutdown()
  })
})

describe('session() — persistent field ttl', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  const serializedStorage = (): KVStorage<unknown> => {
    const rows = new Map<string, string>()

    return {
      get: (key) => {
        const value = rows.get(key)

        return Promise.resolve(value === undefined ? undefined : JSON.parse(value) as unknown)
      },
      set: (key, value) => {
        rows.set(key, JSON.stringify(value))

        return Promise.resolve()
      },
      delete: (key) => {
        rows.delete(key)

        return Promise.resolve()
      },
      has: key => Promise.resolve(rows.has(key))
    }
  }

  const invoke = async (storage: KVStorage<unknown>, handler: (data: SessionContext) => void) => {
    const tg = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(session({ storage }))
    let failure: unknown

    tg.catch(error => { failure = error })
    await tg.start()
    tg.defineUpdate('probe')
    tg.on('probe', update => handler(update.session as SessionContext))
    tg.emit('probe', { from: { id: 7 } })
    await immediate()
    await tg.shutdown()

    if (failure !== undefined) {
      throw failure
    }
  }

  it('expires serialized fields on cold reload without colliding with user metadata or nested names', async () => {
    let now = 1_000

    vi.spyOn(Date, 'now').mockImplementation(() => now)
    const storage = serializedStorage()
    const legacy = {
      __ttl: { token: 'user metadata' },
      data: { version: 1, ttl: 'user data' },
      left: { token: 'left' },
      right: { token: 'right' },
      'left.token': 'literal'
    }

    await storage.set('user:7', legacy)
    await invoke(storage, (data) => {
      ;(data.left as Record<string, unknown>).token = ttl('short', 1_000)
      ;(data.right as Record<string, unknown>).token = ttl('long', 3_000)
    })
    now = 2_000
    let observed: unknown

    await invoke(storage, (data) => {
      observed = JSON.parse(JSON.stringify(data))
    })
    expect(observed).toEqual({ ...legacy, left: {}, right: { token: 'long' } })
    const tg = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(session({ storage }))

    await tg.start()

    now = 4_000
    expect(await tg.session.get('user:7')).toEqual({ ...legacy, left: {}, right: {} })
    expect(await storage.get('user:7')).toEqual({ ...legacy, left: {}, right: {} })
    await tg.shutdown()
  })

  it('renews saved field deadlines on reassignment and removes expired fields through direct access', async () => {
    let now = 1_000

    vi.spyOn(Date, 'now').mockImplementation(() => now)
    const storage = serializedStorage()

    await invoke(storage, (data) => {
      data.token = ttl('first', 1_000)
    })
    now = 1_500
    await invoke(storage, (data) => {
      data.token = 'second'
    })
    const tg = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(session({ storage }))

    await tg.start()

    now = 2_000
    expect(await tg.session.get('user:7')).toEqual({ token: 'second' })
    now = 2_500
    expect(await tg.session.has('user:7')).toBe(false)
    expect(await tg.session.get('user:7')).toBeUndefined()
    expect(await storage.has('user:7')).toBe(false)
    await tg.shutdown()
  })

  it('clears persisted ttl on zero assignment or deletion without expiring replacement fields', async () => {
    let now = 1_000

    vi.spyOn(Date, 'now').mockImplementation(() => now)
    const storage = serializedStorage()

    await invoke(storage, (data) => {
      data.cleared = ttl('old', 1_000)
      data.deleted = ttl('old', 1_000)
      data.parent = { child: 'old' }
      ;(data.parent as Record<string, unknown>).child = ttl('old', 1_000)
    })
    now = 1_500
    await invoke(storage, (data) => {
      data.cleared = ttl('permanent', 0)
      delete data.deleted
      data.deleted = 'permanent'
      data.parent = { child: 'permanent' }
    })
    now = 5_000
    const tg = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(session({ storage }))

    await tg.start()

    expect(await tg.session.get('user:7')).toEqual({
      cleared: 'permanent',
      deleted: 'permanent',
      parent: { child: 'permanent' }
    })
    await tg.shutdown()
  })

  it('does not retain the first invocation proxy when memory-backed nested fields acquire ttl later', async () => {
    let now = 1_000

    vi.spyOn(Date, 'now').mockImplementation(() => now)
    const storage = new MemoryStorage()

    await invoke(storage, (data) => {
      data.profile = { token: 'original' }
      ;(data.profile as Record<string, unknown>).token = 'accessed'
    })
    await invoke(storage, (data) => {
      ;(data.profile as Record<string, unknown>).token = ttl('expiring', 1_000)
    })
    now = 2_000
    const tg = new Telegram({ token: 'TEST', bot: STUB_BOT }).extend(session({ storage }))

    await tg.start()

    expect(await tg.session.get('user:7')).toEqual({ profile: {} })
    await tg.shutdown()
  })
})
