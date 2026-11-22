import { describe, expect, it } from 'vitest'

import { bold } from '../src/builders'
import { rich } from '../src/namespace'

const SENTINEL = /\u0001\d+\u0001/

function json (value: unknown) {
  return JSON.stringify(value)
}

describe('interpolation into the 10.3 shapes', () => {
  it('expands a document src and caption', () => {
    const message = rich.html`<figure><tg-document src="${'https://x.test/d.zip'}"></tg-document><figcaption>${bold('files')}</figcaption></figure>`

    expect(json(message.blocks)).not.toMatch(SENTINEL)
    expect(message.blocks).toEqual([{
      type: 'document',
      document: { type: 'document', media: 'https://x.test/d.zip' },
      caption: { text: { type: 'bold', text: 'files' } }
    }])
  })

  it('expands an expandable blockquote body and credit', () => {
    const message = rich.html`<blockquote expandable>hi ${bold('world')}${rich.h2('heading')}<cite>${'sage'}</cite></blockquote>`

    expect(json(message.blocks)).not.toMatch(SENTINEL)
    expect(message.blocks).toEqual([{
      type: 'expandable_blockquote',
      blocks: [
        { type: 'paragraph', text: ['hi ', { type: 'bold', text: 'world' }] },
        { type: 'heading', text: 'heading', size: 2 }
      ],
      credit: 'sage'
    }])
  })

  it('expands a button row label and every string action', () => {
    const message = rich.html`<tg-button-row><tg-button type="url" url="${'https://t.me'}">go ${bold('now')}</tg-button><tg-button type="callback_data" data="${'cb:1'}">cb</tg-button></tg-button-row>`

    expect(json(message.blocks)).not.toMatch(SENTINEL)
    expect(message.blocks).toEqual([{
      type: 'buttons',
      buttons: [
        { text: ['go ', { type: 'bold', text: 'now' }], url: 'https://t.me' },
        { text: 'cb', callback_data: 'cb:1' }
      ]
    }])
  })

  it('expands an inline button inside a paragraph', () => {
    const message = rich.html`<p>press <tg-button type="callback_data" data="${'cb:2'}">${bold('me')}</tg-button></p>`

    expect(json(message.blocks)).not.toMatch(SENTINEL)
    expect(message.blocks).toEqual([{
      type: 'paragraph',
      text: [
        'press ',
        { type: 'button', button: { text: { type: 'bold', text: 'me' }, callback_data: 'cb:2' } }
      ]
    }])
  })

  it('expands the nested web_app, login_url and copy_text actions', () => {
    const message = rich.html`<tg-button-row><tg-button type="web_app" url="${'https://a.test'}">a</tg-button><tg-button type="login_url" url="${'https://b.test'}" forward-text="${'go'}">b</tg-button><tg-button type="copy_text" text="${'copy me'}">c</tg-button></tg-button-row>`

    expect(json(message.blocks)).not.toMatch(SENTINEL)
    expect(message.blocks).toEqual([{
      type: 'buttons',
      buttons: [
        { text: 'a', web_app: { url: 'https://a.test' } },
        { text: 'b', login_url: { url: 'https://b.test', forward_text: 'go' } },
        { text: 'c', copy_text: { text: 'copy me' } }
      ]
    }])
  })

  it('expands a compact table cell', () => {
    const message = rich.html`<table compact><tr><td>${bold('x')}</td></tr></table>`

    expect(json(message.blocks)).not.toMatch(SENTINEL)
    expect(message.blocks).toMatchObject([{ type: 'table', is_compact: true }])
  })
})
