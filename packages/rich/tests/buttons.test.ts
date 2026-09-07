import type { TelegramInputRichBlock } from '@puregram/api'
import { describe, expect, it } from 'vitest'

import { button, buttonRow } from '../src/builders/button'
import { bold, code, customEmoji, paragraph } from '../src/builders'
import { RichError } from '../src/error'
import { parseHtml } from '../src/parsers/html'
import { serializeBlocks } from '../src/serializers'

describe('button', () => {
  it('emits an inline button node', () => {
    expect(button('open', { url: 'https://t.me' }).emit()).toEqual({
      type: 'button',
      button: { text: 'open', url: 'https://t.me' }
    })
  })

  it('takes only the label nodes telegram allows', () => {
    expect(button(customEmoji('5100', '👍'), { callbackData: 'go' }).emit()).toEqual({
      type: 'button',
      button: { text: { type: 'custom_emoji', custom_emoji_id: '5100', alternative_text: '👍' }, callback_data: 'go' }
    })
    expect(() => button(bold('open'), { callbackData: 'go' }).emit()).toThrow(RichError)
    expect(() => button(['a ', code('b')], { callbackData: 'go' }).emit()).toThrow(RichError)
  })

  it('allows the link style only on a callback button', () => {
    expect(button('x', { callbackData: 'y', style: 'link' }).emit()).toMatchObject({
      button: { style: 'link', callback_data: 'y' }
    })
    expect(() => button('x', { url: 'https://t.me', style: 'link' }).emit()).toThrow(RichError)
  })

  it('carries the style before the action', () => {
    expect(button('x', { style: 'success', callbackData: 'y' }).emit()).toEqual({
      type: 'button',
      button: { text: 'x', style: 'success', callback_data: 'y' }
    })
  })

  it('maps every action to its wire field', () => {
    const cases = [
      [{ url: 'https://t.me' }, { url: 'https://t.me' }],
      [{ callbackData: 'cb' }, { callback_data: 'cb' }],
      [{ webApp: 'https://telegram.org' }, { web_app: { url: 'https://telegram.org' } }],
      [{ loginUrl: 'https://t.me' }, { login_url: { url: 'https://t.me' } }],
      [{ switchInlineQuery: 'q' }, { switch_inline_query: 'q' }],
      [{ switchInlineQueryCurrentChat: 'q' }, { switch_inline_query_current_chat: 'q' }],
      [{ copyText: 'copy me' }, { copy_text: { text: 'copy me' } }],
      [{ disabled: true }, { disabled: {} }]
    ] as const

    for (const [options, expected] of cases) {
      expect(button('x', options).emit()).toEqual({ type: 'button', button: { text: 'x', ...expected } })
    }
  })

  it('accepts an empty switch inline query', () => {
    expect(button('x', { switchInlineQuery: '' }).emit()).toEqual({
      type: 'button',
      button: { text: 'x', switch_inline_query: '' }
    })
  })

  it('expands the login url and chosen chat option objects', () => {
    expect(button('x', {
      loginUrl: { url: 'https://t.me', forwardText: 'go', botUsername: 'bot', requestWriteAccess: true }
    }).emit()).toEqual({
      type: 'button',
      button: {
        text: 'x',
        login_url: { url: 'https://t.me', forward_text: 'go', bot_username: 'bot', request_write_access: true }
      }
    })

    expect(button('x', {
      switchInlineQueryChosenChat: { query: 'q', allowUserChats: true, allowChannelChats: false }
    }).emit()).toEqual({
      type: 'button',
      button: {
        text: 'x',
        switch_inline_query_chosen_chat: { query: 'q', allow_user_chats: true, allow_channel_chats: false }
      }
    })
  })

  it('rejects zero and multiple actions', () => {
    expect(() => button('x', {}).emit()).toThrow(RichError)
    expect(() => button('x', { style: 'link' }).emit()).toThrow(RichError)
    expect(() => button('x', { url: 'https://t.me', callbackData: 'cb' }).emit()).toThrow(RichError)
    expect(() => button('x', { disabled: false }).emit()).toThrow(RichError)
  })
})

describe('buttonRow', () => {
  it('unwraps button nodes into a row block', () => {
    expect(buttonRow([button('a', { url: 'https://t.me' }), button('b', { callbackData: 'b' })]).emit()).toEqual({
      type: 'buttons',
      buttons: [
        { text: 'a', url: 'https://t.me' },
        { text: 'b', callback_data: 'b' }
      ]
    })
  })

  it('includes the alignment only when given', () => {
    expect(buttonRow([button('a', { callbackData: 'a' })], { align: 'center' }).emit()).toMatchObject({ align: 'center' })
    expect(buttonRow([button('a', { callbackData: 'a' })]).emit()).not.toHaveProperty('align')
  })

  it('rejects an empty row, an oversized row and non-button content', () => {
    expect(() => buttonRow([]).emit()).toThrow(RichError)

    const nine = Array.from({ length: 9 }, (_, i) => button(String(i), { callbackData: String(i) }))

    expect(() => buttonRow(nine).emit()).toThrow(RichError)
    expect(() => buttonRow([bold('a')]).emit()).toThrow(RichError)
    expect(() => buttonRow([paragraph('a')]).emit()).toThrow(RichError)
    expect(() => buttonRow([null as never]).emit()).toThrow(RichError)
    expect(() => buttonRow([undefined as never]).emit()).toThrow(RichError)
  })
})

const inlineButton: TelegramInputRichBlock[] = [
  {
    type: 'paragraph',
    text: ['press ', { type: 'button', button: { text: 'me', style: 'success', callback_data: 'cb' } }]
  }
]

describe('button serialization', () => {
  it('renders an inline button in both dialects', () => {
    expect(serializeBlocks(inlineButton, 'html'))
      .toBe('<p>press <tg-button type="callback_data" style="success" data="cb">me</tg-button></p>')
    expect(serializeBlocks(inlineButton, 'markdown'))
      .toBe('press <tg-button type="callback_data" style="success" data="cb">me</tg-button>')
  })

  it('renders a row with its alignment', () => {
    const blocks: TelegramInputRichBlock[] = [{
      type: 'buttons',
      align: 'right',
      buttons: [{ text: 'a', url: 'https://t.me' }, { text: 'b', disabled: {} }]
    }]

    const expected = '<tg-button-row align="right">' +
      '<tg-button type="url" url="https://t.me">a</tg-button>' +
      '<tg-button type="disabled">b</tg-button>' +
      '</tg-button-row>'

    expect(serializeBlocks(blocks, 'html')).toBe(expected)
    expect(serializeBlocks(blocks, 'markdown')).toBe(expected)
  })

  it('renders every action form', () => {
    const blocks: TelegramInputRichBlock[] = [{
      type: 'buttons',
      buttons: [
        { text: 'a', web_app: { url: 'https://telegram.org' } },
        { text: 'b', login_url: { url: 'https://t.me', forward_text: 'go', request_write_access: true } },
        { text: 'c', switch_inline_query: 'q' },
        { text: 'd', switch_inline_query_current_chat: '' },
        {
          text: 'e',
          switch_inline_query_chosen_chat: { query: 'q', allow_user_chats: true, allow_channel_chats: true }
        },
        { text: 'f', copy_text: { text: 'copy' } }
      ]
    }]

    expect(serializeBlocks(blocks, 'html')).toBe(
      '<tg-button-row>' +
      '<tg-button type="web_app" url="https://telegram.org">a</tg-button>' +
      '<tg-button type="login_url" url="https://t.me" forward-text="go" request-write-access>b</tg-button>' +
      '<tg-button type="switch_inline_query" query="q">c</tg-button>' +
      '<tg-button type="switch_inline_query_current_chat" query="">d</tg-button>' +
      '<tg-button type="switch_inline_query_chosen_chat" query="q" allow-user-chats allow-channel-chats>e</tg-button>' +
      '<tg-button type="copy_text" text="copy">f</tg-button>' +
      '</tg-button-row>'
    )
  })

  it('keeps a piped payload inside a markdown table cell', () => {
    const blocks: TelegramInputRichBlock[] = [{
      type: 'table',
      cells: [[
        { text: { type: 'button', button: { text: 'ok', callback_data: 'a|b' } }, align: 'left', valign: 'middle' },
        { text: 'second', align: 'left', valign: 'middle' }
      ]]
    }]

    const markdown = serializeBlocks(blocks, 'markdown')

    expect(markdown).toContain('data="a&#124;b"')
    expect(parseHtml(markdown.split('\n')[0]!.replace(/^\| | \|$/g, '').split(' | ')[0]!))
      .toEqual([{ type: 'paragraph', text: { type: 'button', button: { text: 'ok', callback_data: 'a|b' } } }])
  })

  it('keeps a blank line inside a markdown button value from ending the tag', () => {
    const blocks: TelegramInputRichBlock[] = [
      { type: 'paragraph', text: { type: 'button', button: { text: 'ok', callback_data: 'a\n\nb' } } }
    ]

    const markdown = serializeBlocks(blocks, 'markdown')

    expect(markdown).toContain('data="a&#10;&#10;b"')
    expect(parseHtml(markdown)).toEqual([
      { type: 'paragraph', text: { type: 'button', button: { text: 'ok', callback_data: 'a\n\nb' } } }
    ])
  })

  it('refuses a login_url bot_username, which no dialect attribute carries', () => {
    const blocks: TelegramInputRichBlock[] = [{
      type: 'buttons',
      buttons: [{ text: 'a', login_url: { url: 'https://t.me', bot_username: 'bot' } }]
    }]

    expect(() => serializeBlocks(blocks, 'html')).toThrow(RichError)
  })

  it('refuses a button with no action', () => {
    const blocks: TelegramInputRichBlock[] = [{ type: 'buttons', buttons: [{ text: 'a' }] }]

    expect(() => serializeBlocks(blocks, 'html')).toThrow(RichError)
  })
})

describe('button parsing', () => {
  it('round-trips an inline button', () => {
    expect(parseHtml('<p>press <tg-button type="callback_data" style="success" data="cb">me</tg-button></p>'))
      .toEqual(inlineButton)
  })

  it('round-trips a row', () => {
    const source = '<tg-button-row align="left">' +
      '<tg-button type="url" url="https://t.me">a</tg-button>' +
      '<tg-button type="disabled">b</tg-button>' +
      '</tg-button-row>'

    expect(parseHtml(source)).toEqual([{
      type: 'buttons',
      align: 'left',
      buttons: [{ text: 'a', url: 'https://t.me' }, { text: 'b', disabled: {} }]
    }])
  })

  it('parses every action form', () => {
    const source = '<tg-button-row>' +
      '<tg-button type="web_app" url="https://telegram.org">a</tg-button>' +
      '<tg-button type="login_url" url="https://t.me" forward-text="go" request-write-access>b</tg-button>' +
      '<tg-button type="switch_inline_query" query="q">c</tg-button>' +
      '<tg-button type="switch_inline_query_current_chat">d</tg-button>' +
      '<tg-button type="switch_inline_query_chosen_chat" query="q" allow-user-chats allow-bot-chats>e</tg-button>' +
      '<tg-button type="copy_text" text="copy">f</tg-button>' +
      '</tg-button-row>'

    expect(parseHtml(source)).toEqual([{
      type: 'buttons',
      buttons: [
        { text: 'a', web_app: { url: 'https://telegram.org' } },
        { text: 'b', login_url: { url: 'https://t.me', forward_text: 'go', request_write_access: true } },
        { text: 'c', switch_inline_query: 'q' },
        { text: 'd', switch_inline_query_current_chat: '' },
        { text: 'e', switch_inline_query_chosen_chat: { query: 'q', allow_user_chats: true, allow_bot_chats: true } },
        { text: 'f', copy_text: { text: 'copy' } }
      ]
    }])
  })

  it('trims the label and keeps nested formatting', () => {
    expect(parseHtml('<tg-button-row><tg-button type="callback_data" data="cb"> <b>hi</b> </tg-button></tg-button-row>'))
      .toEqual([{
        type: 'buttons',
        buttons: [{ text: { type: 'bold', text: 'hi' }, callback_data: 'cb' }]
      }])
  })

  it('drops an unknown style', () => {
    expect(parseHtml('<tg-button-row><tg-button type="disabled" style="neon">a</tg-button></tg-button-row>'))
      .toEqual([{ type: 'buttons', buttons: [{ text: 'a', disabled: {} }] }])
  })

  it('rejects a missing type, a missing url and a missing copy text', () => {
    expect(() => parseHtml('<tg-button>a</tg-button>')).toThrow(/known type/)
    expect(() => parseHtml('<tg-button type="url">a</tg-button>')).toThrow(/url attribute/)
    expect(() => parseHtml('<tg-button type="copy_text">a</tg-button>')).toThrow(/text attribute/)
    expect(() => parseHtml('<tg-button type="callback_data">a</tg-button>')).toThrow(/data attribute/)
  })

  it('keeps a malformed button literal in lenient mode', () => {
    expect(parseHtml('<tg-button type="url">a</tg-button>', { lenient: true }))
      .toEqual([{ type: 'paragraph', text: '<tg-button type="url">a</tg-button>' }])
  })

  it('rejects foreign content inside a row', () => {
    expect(() => parseHtml('<tg-button-row><b>a</b></tg-button-row>')).toThrow(/tg-button-row/)
  })
})
