import { describe, expect, it } from 'vitest'

import { ttl } from '../src/ttl'

describe('ttl()', () => {
  it('rejects negative and non-finite expiry durations', () => {
    expect(() => ttl('value', -1)).toThrow(RangeError)
    expect(() => ttl('value', Number.POSITIVE_INFINITY)).toThrow(RangeError)
  })
})
