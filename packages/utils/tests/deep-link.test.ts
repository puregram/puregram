import { describe, expect, it } from 'vitest'

import { deepLink } from '../src/deep-link'

describe('deepLink.start', () => {
  it('returns just the base url when no payload is supplied', () => {
    expect(deepLink.start({ bot: 'my_bot' })).toBe('https://t.me/my_bot')
  })

  it('renders a start payload', () => {
    expect(deepLink.start({ bot: 'my_bot', payload: 'ref_42' })).toBe('https://t.me/my_bot?start=ref_42')
  })

  it('accepts the full base64url charset and 64-char length', () => {
    const payload = 'A'.repeat(64)

    expect(deepLink.start({ bot: 'my_bot', payload })).toBe(`https://t.me/my_bot?start=${payload}`)
    expect(deepLink.start({ bot: 'my_bot', payload: 'aZ-_09' })).toBe('https://t.me/my_bot?start=aZ-_09')
  })

  it('throws on payload with reserved chars', () => {
    expect(() => deepLink.start({ bot: 'my_bot', payload: 'user@id 42' })).toThrow(/payload/)
  })

  it('throws on empty payload', () => {
    expect(() => deepLink.start({ bot: 'my_bot', payload: '' })).toThrow(/payload/)
  })

  it('throws on payload over 64 chars', () => {
    expect(() => deepLink.start({ bot: 'my_bot', payload: 'a'.repeat(65) })).toThrow(/payload/)
  })

  it('throws on invalid bot username', () => {
    expect(() => deepLink.start({ bot: 'no' })).toThrow(/username/)
    expect(() => deepLink.start({ bot: '1starts_with_digit' })).toThrow(/username/)
  })
})

describe('deepLink.topic', () => {
  it('opens a private bot topic by its message thread id', () => {
    expect(deepLink.topic({ bot: 'my_bot', messageThreadId: 42 })).toBe('https://t.me/my_bot/42')
  })

  it('validates the bot username', () => {
    expect(() => deepLink.topic({ bot: 'no', messageThreadId: 42 })).toThrow(/username/)
  })

  it.each([0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])('rejects invalid thread id %s', messageThreadId => {
    expect(() => deepLink.topic({ bot: 'my_bot', messageThreadId })).toThrow(/messageThreadId/)
  })
})

describe('deepLink.startGroup', () => {
  it('renders without payload or admin', () => {
    expect(deepLink.startGroup({ bot: 'my_bot' })).toBe('https://t.me/my_bot?startgroup')
  })

  it('renders with payload only', () => {
    expect(deepLink.startGroup({ bot: 'my_bot', payload: 'invite' }))
      .toBe('https://t.me/my_bot?startgroup=invite')
  })

  it('renders with payload and admin rights', () => {
    expect(deepLink.startGroup({
      bot: 'my_bot',
      payload: 'invite',
      admin: ['post_messages', 'edit_messages']
    })).toBe('https://t.me/my_bot?startgroup=invite&admin=post_messages+edit_messages')
  })

  it('renders with admin rights only', () => {
    expect(deepLink.startGroup({
      bot: 'my_bot',
      admin: ['change_info']
    })).toBe('https://t.me/my_bot?startgroup&admin=change_info')
  })

  it('throws on unknown admin right', () => {
    expect(() => deepLink.startGroup({
      bot: 'my_bot',
      admin: ['post_messages', 'invalid_right' as never]
    })).toThrow(/admin right/)
  })

  it('throws on empty admin array', () => {
    expect(() => deepLink.startGroup({ bot: 'my_bot', admin: [] })).toThrow(/admin/)
  })
})

describe('deepLink.startChannel', () => {
  it('renders with admin rights', () => {
    expect(deepLink.startChannel({
      bot: 'my_bot',
      admin: ['post_messages']
    })).toBe('https://t.me/my_bot?startchannel&admin=post_messages')
  })

  it('joins multiple admin rights with +', () => {
    expect(deepLink.startChannel({
      bot: 'my_bot',
      admin: ['post_messages', 'edit_messages', 'delete_messages']
    })).toBe('https://t.me/my_bot?startchannel&admin=post_messages+edit_messages+delete_messages')
  })

  it('throws on missing admin (spec requires it for channels)', () => {
    expect(() => deepLink.startChannel({ bot: 'my_bot', admin: [] })).toThrow(/admin/)
  })

  it('throws on unknown admin right', () => {
    expect(() => deepLink.startChannel({
      bot: 'my_bot',
      admin: ['bogus' as never]
    })).toThrow(/admin right/)
  })
})

describe('deepLink.startApp', () => {
  it('renders main mini-app without payload or mode', () => {
    expect(deepLink.startApp({ bot: 'my_bot' })).toBe('https://t.me/my_bot?startapp')
  })

  it('renders main mini-app with payload', () => {
    expect(deepLink.startApp({ bot: 'my_bot', payload: 'page_42' }))
      .toBe('https://t.me/my_bot?startapp=page_42')
  })

  it('renders main mini-app with mode only', () => {
    expect(deepLink.startApp({ bot: 'my_bot', mode: 'fullscreen' }))
      .toBe('https://t.me/my_bot?startapp&mode=fullscreen')
  })

  it('renders main mini-app with payload + mode', () => {
    expect(deepLink.startApp({ bot: 'my_bot', payload: 'page_42', mode: 'compact' }))
      .toBe('https://t.me/my_bot?startapp=page_42&mode=compact')
  })

  it('renders named mini-app', () => {
    expect(deepLink.startApp({ bot: 'my_bot', app: 'tictactoe' }))
      .toBe('https://t.me/my_bot/tictactoe?startapp')
  })

  it('renders named mini-app with payload + mode', () => {
    expect(deepLink.startApp({
      bot: 'my_bot',
      app: 'tictactoe',
      payload: 'room_7',
      mode: 'fullscreen'
    })).toBe('https://t.me/my_bot/tictactoe?startapp=room_7&mode=fullscreen')
  })

  it('throws on invalid mini-app short name', () => {
    expect(() => deepLink.startApp({ bot: 'my_bot', app: '1bad' })).toThrow(/app short name/)
  })
})

describe('deepLink.startAttach', () => {
  it('renders without payload or choose', () => {
    expect(deepLink.startAttach({ bot: 'my_bot' })).toBe('https://t.me/my_bot?startattach')
  })

  it('renders with payload only', () => {
    expect(deepLink.startAttach({ bot: 'my_bot', payload: 'p' }))
      .toBe('https://t.me/my_bot?startattach=p')
  })

  it('renders with choose only', () => {
    expect(deepLink.startAttach({ bot: 'my_bot', choose: ['users', 'groups'] }))
      .toBe('https://t.me/my_bot?startattach&choose=users+groups')
  })

  it('renders with payload + choose', () => {
    expect(deepLink.startAttach({
      bot: 'my_bot',
      payload: 'p',
      choose: ['users', 'bots', 'groups', 'channels']
    })).toBe('https://t.me/my_bot?startattach=p&choose=users+bots+groups+channels')
  })

  it('throws on unknown choose target', () => {
    expect(() => deepLink.startAttach({
      bot: 'my_bot',
      choose: ['users', 'admins' as never]
    })).toThrow(/choose target/)
  })

  it('throws on empty choose array', () => {
    expect(() => deepLink.startAttach({ bot: 'my_bot', choose: [] })).toThrow(/choose/)
  })
})

describe('deepLink.attachInChat', () => {
  it('renders with a username target', () => {
    expect(deepLink.attachInChat({
      chat: { username: 'durov' },
      bot: 'my_bot'
    })).toBe('https://t.me/durov?attach=my_bot')
  })

  it('renders with a username target + payload', () => {
    expect(deepLink.attachInChat({
      chat: { username: 'durov' },
      bot: 'my_bot',
      payload: 'p'
    })).toBe('https://t.me/durov?attach=my_bot&startattach=p')
  })

  it('renders with a phone target', () => {
    expect(deepLink.attachInChat({
      chat: { phone: '5551234567' },
      bot: 'my_bot'
    })).toBe('https://t.me/+5551234567?attach=my_bot')
  })

  it('renders with a phone target + payload', () => {
    expect(deepLink.attachInChat({
      chat: { phone: '5551234567' },
      bot: 'my_bot',
      payload: 'p'
    })).toBe('https://t.me/+5551234567?attach=my_bot&startattach=p')
  })

  it('throws when phone contains non-digits', () => {
    expect(() => deepLink.attachInChat({
      chat: { phone: '+555-1234567' },
      bot: 'my_bot'
    })).toThrow(/phone/)
  })

  it('throws on invalid chat username', () => {
    expect(() => deepLink.attachInChat({
      chat: { username: 'no' },
      bot: 'my_bot'
    })).toThrow(/username/)
  })
})

describe('deepLink.game', () => {
  it('renders a game short name', () => {
    expect(deepLink.game({ bot: 'my_bot', name: 'tetris' }))
      .toBe('https://t.me/my_bot?game=tetris')
  })

  it('throws on invalid game short name', () => {
    expect(() => deepLink.game({ bot: 'my_bot', name: '1bad' })).toThrow(/game short name/)
  })
})

describe('deepLink.share', () => {
  it('renders a url-only share link', () => {
    expect(deepLink.share({ url: 'https://example.com' }))
      .toBe('https://t.me/share?url=https%3A%2F%2Fexample.com')
  })

  it('renders a url + text share link', () => {
    expect(deepLink.share({ url: 'https://example.com', text: 'check this out!' }))
      .toBe('https://t.me/share?url=https%3A%2F%2Fexample.com&text=check%20this%20out!')
  })

  it('throws on empty url', () => {
    expect(() => deepLink.share({ url: '' })).toThrow(/url/)
  })
})

describe('deepLink.videoChat', () => {
  it('renders a plain videochat link', () => {
    expect(deepLink.videoChat({ username: 'mychannel' }))
      .toBe('https://t.me/mychannel?videochat')
  })

  it('renders a videochat link with invite hash', () => {
    expect(deepLink.videoChat({ username: 'mychannel', hash: 'abc123' }))
      .toBe('https://t.me/mychannel?videochat=abc123')
  })

  it('renders a livestream link when live is true', () => {
    expect(deepLink.videoChat({ username: 'mychannel', live: true }))
      .toBe('https://t.me/mychannel?livestream')
  })

  it('renders a livestream link with invite hash', () => {
    expect(deepLink.videoChat({ username: 'mychannel', hash: 'abc123', live: true }))
      .toBe('https://t.me/mychannel?livestream=abc123')
  })
})
