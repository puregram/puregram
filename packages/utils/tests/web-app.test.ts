import { Buffer } from 'node:buffer'
import crypto from 'node:crypto'
import { URLSearchParams } from 'node:url'

import { describe, expect, it, vi } from 'vitest'

import { WebApp } from '../src/web-app'

const TEST_TOKEN = '1234567890:ABCDEFghijklmnopqrstuvwxyz'

function signInitData (token: string, fields: Record<string, string>) {
  const key = crypto.createHmac('sha256', 'WebAppData').update(token).digest()
  const dataCheckString = Object.keys(fields)
    .filter(k => k !== 'hash')
    .sort()
    .map(k => `${k}=${fields[k] ?? ''}`)
    .join('\n')
  const hash = crypto.createHmac('sha256', key).update(dataCheckString).digest('hex')
  const params = new URLSearchParams({ ...fields, hash })

  return params.toString()
}

describe('WebApp.generateSecretKey', () => {
  it('returns a 32-byte buffer (HMAC-SHA256)', () => {
    const key = WebApp.generateSecretKey(TEST_TOKEN)

    expect(Buffer.isBuffer(key)).toBe(true)
    expect(key.length).toBe(32)
  })

  it('matches Node HMAC for UTF-8 tokens and SHA-256 block boundaries', () => {
    const tokens = [
      TEST_TOKEN, '', 'Привет/世界', '\u0000\u007f\u0080\u07ff\u0800\uffff',
      'a\ud800b\udc00c', '\ud83d\ude00',
      ...[55, 56, 63, 64, 65].map(length => 'a'.repeat(length))
    ]

    for (const token of tokens) {
      const expected = crypto.createHmac('sha256', 'WebAppData').update(token).digest('hex')

      expect(WebApp.generateSecretKey(token).toString('hex')).toBe(expected)
    }
  })
})

describe('WebApp.parseInitData', () => {
  it('parses query-string fields into a flat object', () => {
    expect(WebApp.parseInitData('a=1&b=hello%20world&c=')).toEqual({ a: '1', b: 'hello world', c: '' })
  })

  it('matches native form parsing and signed bytes for malformed UTF-8 and query boundaries', () => {
    const queries = [
      '?a=1&a=2&b&=value&&x=a=b+c%2Bd',
      '__proto__=first&constructor=second&__proto__=last',
      '%EF%BB%BFkey=%EF%BB%BFvalue',
      'x=%E1%80&y=%F0%90%80',
      'x=%C0%AF%ED%A0%80%F4%90%80%80',
      'x=%GG%2%&y=%%41%41%',
      'x=%E1%41%80&y=%F0%90%41%80',
      'surrogate=a\ud800b\udc00c&unicode=世界\ud83d\ude00',
      'x=%ð&y=%ÿ&z=%\ud800',
      '?hash=old&signature=a%2Bb&hash=new',
      '??x=1&&empty=&bare',
      ''
    ]
    const key = WebApp.generateSecretKey(TEST_TOKEN)

    for (const query of queries) {
      const expected = Object.fromEntries(new URLSearchParams(query))
      const dataCheckString = Object.keys(expected).filter(k => k !== 'hash').sort()
        .map(k => `${k}=${expected[k]}`).join('\n')
      const expectedHash = crypto.createHmac('sha256', key).update(dataCheckString).digest('hex')

      expect(WebApp.parseInitData(query)).toEqual(expected)
      expect(WebApp.generateInitDataHash(query, key)).toBe(expectedHash)
    }
  })
})

describe('WebApp.generateInitDataHash', () => {
  it('matches Node for binary key views, long keys, Unicode, and signed signature fields', () => {
    const fields = {
      user: '{"id":42,"first_name":"世界\\ud83d\\ude00"}',
      signature: 'signed+value/with=padding',
      binary: '\u0000\u007f\u0080\u07ff\u0800\uffff',
      surrogate: 'a\ud800b\udc00c',
      auth_date: '1700000000'
    }
    const params = new URLSearchParams({ ...fields, hash: 'ignored' })
    const parsed = Object.fromEntries(params)
    const dataCheckString = Object.keys(parsed).filter(k => k !== 'hash').sort()
      .map(k => `${k}=${parsed[k]}`).join('\n')
    const backing = Buffer.from(Array.from({ length: 260 }, (_, i) => i & 0xff))

    for (const length of [0, 32, 63, 64, 65, 256]) {
      const key = backing.subarray(2, length + 2)
      const expected = crypto.createHmac('sha256', key).update(dataCheckString).digest('hex')

      expect(WebApp.generateInitDataHash(params.toString(), key)).toBe(expected)
      expect(WebApp.generateInitDataHash(params.toString(), new Uint8Array(key))).toBe(expected)
    }
  })
})

describe('WebApp.validate', () => {
  const fields = { auth_date: '1700000000', user: '{"id":42,"first_name":"Alice"}' }

  it('returns true for a correctly signed initData (token form)', () => {
    const initData = signInitData(TEST_TOKEN, fields)

    expect(WebApp.validate({ initData, token: TEST_TOKEN })).toBe(true)
  })

  it('returns true for a correctly signed initData (key form)', () => {
    const initData = signInitData(TEST_TOKEN, fields)
    const key = WebApp.generateSecretKey(TEST_TOKEN)

    expect(WebApp.validate({ initData, key })).toBe(true)
  })

  it('returns false when the hash is forged', () => {
    const initData = signInitData(TEST_TOKEN, fields)
    const tampered = initData.replace(/hash=[a-f0-9]+$/, 'hash=' + 'f'.repeat(64))

    expect(WebApp.validate({ initData: tampered, token: TEST_TOKEN })).toBe(false)
  })

  it('rejects malformed hashes and mismatches at either end without normalizing case', () => {
    const params = new URLSearchParams(signInitData(TEST_TOKEN, fields))
    const hash = params.get('hash')!
    const invalid = [
      '', hash.slice(1), hash + '0', hash.toUpperCase(), 'z'.repeat(64),
      (hash[0] === '0' ? '1' : '0') + hash.slice(1),
      hash.slice(0, -1) + (hash[63] === '0' ? '1' : '0')
    ]

    for (const forged of invalid) {
      params.set('hash', forged)

      expect(WebApp.validate({ initData: params.toString(), token: TEST_TOKEN })).toBe(false)
    }
  })

  it('authenticates the signature field and honors an explicitly supplied key', () => {
    const initData = signInitData(TEST_TOKEN, { ...fields, signature: 'telegram-signature' })
    const key = WebApp.generateSecretKey(TEST_TOKEN)

    expect(WebApp.validate({ initData, key, token: 'wrong-token' })).toBe(true)
    expect(WebApp.validate({
      initData: initData.replace('telegram-signature', 'forged-signature'), key
    })).toBe(false)
  })

  it('returns false when payload is altered after signing', () => {
    const initData = signInitData(TEST_TOKEN, fields)
    const altered = initData.replace('auth_date=1700000000', 'auth_date=1700000001')

    expect(WebApp.validate({ initData: altered, token: TEST_TOKEN })).toBe(false)
  })

  it('throws when neither key nor token is provided', () => {
    expect(() => WebApp.validate({ initData: 'hash=x' })).toThrow(TypeError)
  })

  it('throws when initData has no hash field', () => {
    expect(() => WebApp.validate({ initData: 'auth_date=1', token: TEST_TOKEN })).toThrow(TypeError)
  })

  it('throws on invalid hash when throwError is true', () => {
    const initData = signInitData(TEST_TOKEN, fields).replace(/hash=[a-f0-9]+$/, 'hash=' + 'f'.repeat(64))

    expect(() => WebApp.validate({ initData, token: TEST_TOKEN, throwError: true })).toThrow(Error)
  })
})

describe('WebApp portable runtime', () => {
  it('loads and validates synchronously without Node or WebCrypto globals', async () => {
    const token = TEST_TOKEN + '\ud800'
    const initData = signInitData(token, { auth_date: '1700000000', user: '世界\ud83d\ude00' })
    const expectedKey = crypto.createHmac('sha256', 'WebAppData').update(token).digest()

    vi.resetModules()
    vi.stubGlobal('Buffer', undefined)
    vi.stubGlobal('TextEncoder', undefined)
    vi.stubGlobal('TextDecoder', undefined)
    vi.stubGlobal('crypto', undefined)
    vi.stubGlobal('atob', undefined)
    vi.stubGlobal('btoa', undefined)
    vi.stubGlobal('URLSearchParams', undefined)
    vi.stubGlobal('URL', undefined)

    try {
      const { WebApp: PortableWebApp } = await import('../src/web-app')
      const key = PortableWebApp.generateSecretKey(token)

      expect(key.toString('hex')).toBe(expectedKey.toString('hex'))
      expect(key.equals(PortableWebApp.generateSecretKey(token))).toBe(true)
      expect(PortableWebApp.validate({ initData, key })).toBe(true)
      expect(PortableWebApp.validate({ initData, token })).toBe(true)
      expect(PortableWebApp.validate({ initData, token: 'wrong-token' })).toBe(false)
      expect(PortableWebApp.parseInitData('?x=%E1%80&bom=%EF%BB%BF&x=%F0%90%80'))
        .toEqual({ x: '\ufffd', bom: '\ufeff' })
    } finally {
      vi.unstubAllGlobals()
      vi.resetModules()
    }
  })
})
