import { Widget, WidgetQueryUpdate } from '@puregram/api'
import { ApiError } from 'puregram'
import { describe, expect, it, vi } from 'vitest'

import { defineWidget, html, json, raw, text, WidgetStateTooLargeError, WidgetTooLargeError } from '../src'

const notModified = () => new ApiError({
  ok: false,
  error_code: 400,
  description: 'Bad Request: message is not modified: specified new message content and reply markup are exactly the same'
})

const fakeApi = () => {
  const api = {
    sendWidget: vi.fn((_params: Record<string, unknown>) => Promise.resolve({ message_id: 1 })),
    sendSharedWidget: vi.fn((_params: Record<string, unknown>) => Promise.resolve({ message_id: 2 })),
    editMessageWidgetData: vi.fn((_params: Record<string, unknown>) => Promise.resolve(true as const)),
    editSharedWidgetData: vi.fn((_params: Record<string, unknown>) => Promise.resolve(true as const))
  }

  return { api, holder: { api } as never }
}

const Counter = defineWidget({
  html: html`<div id="n"></div>`,
  chat: json<{ count: number }>(),
  public: text()
})

describe('defineWidget.content', () => {
  it('encodes state and maps the flags', () => {
    expect(Counter.content({
      chat: { count: 0 },
      public: 'hello',
      allowQueries: true,
      shared: true,
      caption: 'counter'
    })).toEqual({
      html: '<div id="n"></div>',
      chat_data: '{"count":0}',
      public_data: 'hello',
      allow_queries: true,
      is_shared: true,
      caption: 'counter'
    })
  })

  it('omits absent state and clears null state', () => {
    expect(Counter.content({ public: null })).toEqual({ html: '<div id="n"></div>', public_data: '' })
  })

  it('refuses html that exceeds the size limit', () => {
    const widget = defineWidget({ html: raw('a'.repeat(40_000)) })

    expect(() => widget.content()).toThrow(WidgetTooLargeError)
  })

  it('refuses oversized state', () => {
    expect(() => Counter.content({ public: 'x'.repeat(1025) })).toThrow(WidgetStateTooLargeError)
  })
})

describe('defineWidget.sendShared', () => {
  it('sends the shared widget with its own chat state', async () => {
    const { api, holder } = fakeApi()

    await Counter.sendShared(holder, 42, '5145498338187018804', { chat: { count: 1 }, caption: 'vote' })

    expect(api.sendSharedWidget).toHaveBeenCalledWith({
      chat_id: 42,
      widget_id: '5145498338187018804',
      chat_data: '{"count":1}',
      caption: 'vote'
    })
  })
})

describe('defineWidget.content', () => {
  it('builds InputWidgetMessageContent', () => {
    expect(Counter.content({ chat: { count: 2 }, allowQueries: true, width: 300, caption: 'tap', parse_mode: 'HTML' })).toEqual({
      html: '<div id="n"></div>',
      chat_data: '{"count":2}',
      allow_queries: true,
      width: 300,
      caption: 'tap',
      parse_mode: 'HTML'
    })
  })
})

describe('defineWidget.sharedContent', () => {
  it('builds InputSharedWidgetMessageContent with message-local state', () => {
    expect(Counter.sharedContent('123', { chat: { count: 7 }, caption: 'shared' })).toEqual({
      widget_id: '123', chat_data: '{"count":7}', caption: 'shared'
    })
    expect(Counter.sharedContent('123', { chat: null })).toEqual({ widget_id: '123', chat_data: '' })
  })
})

describe('defineWidget.editState', () => {
  it('targets chat_id + message_id and returns true on a change', async () => {
    const { api, holder } = fakeApi()

    await expect(Counter.editState(holder, { chat_id: 42, message_id: 7 }, { chat: { count: 3 } })).resolves.toBe(true)
    expect(api.editMessageWidgetData).toHaveBeenCalledWith({ chat_id: 42, message_id: 7, chat_data: '{"count":3}' })
  })

  it('targets inline_message_id', async () => {
    const { api, holder } = fakeApi()

    await Counter.editState(holder, { inline_message_id: 'AAA' }, { public: null })

    expect(api.editMessageWidgetData).toHaveBeenCalledWith({ inline_message_id: 'AAA', public_data: '' })
  })

  it('routes a widget query like its editWidgetData', async () => {
    const { api, holder } = fakeApi()
    const from = { id: 1, is_bot: false, first_name: 'ann' }
    const base = { id: 'q', from, chat_instance: 'ci', type: { type: 'data' as const }, data: 'tap' }
    const inChat = new WidgetQueryUpdate({ ...base, chat: { id: 42, type: 'private' }, message_id: 9 }, holder)
    const inline = new WidgetQueryUpdate({ ...base, inline_message_id: 'BBB' }, holder)

    await Counter.editState(holder, inChat, { chat: { count: 1 } })
    await Counter.editState(holder, inline, { chat: { count: 1 } })

    expect(api.editMessageWidgetData.mock.calls.map(([params]) => params)).toEqual([
      { chat_id: 42, message_id: 9, chat_data: '{"count":1}' },
      { inline_message_id: 'BBB', chat_data: '{"count":1}' }
    ])
    expect(() => Counter.editState(holder, new WidgetQueryUpdate(base, holder), {})).toThrow(TypeError)
  })

  it('returns false on "message is not modified"', async () => {
    const { api, holder } = fakeApi()

    api.editMessageWidgetData.mockRejectedValueOnce(notModified())

    await expect(Counter.editState(holder, { chat_id: 1, message_id: 1 }, { chat: { count: 0 } })).resolves.toBe(false)
  })

  it('rethrows every other error', async () => {
    const { api, holder } = fakeApi()
    const error = new ApiError({ ok: false, error_code: 400, description: 'Bad Request: message to edit not found' })

    api.editMessageWidgetData.mockRejectedValueOnce(error)

    await expect(Counter.editState(holder, { chat_id: 1, message_id: 1 }, {})).rejects.toBe(error)
  })
})

describe('defineWidget.editShared', () => {
  it('encodes public state and passes cache_time', async () => {
    const { api, holder } = fakeApi()

    await expect(Counter.editShared(holder, 'w1', 'tally', { cacheTime: 30 })).resolves.toBe(true)
    expect(api.editSharedWidgetData).toHaveBeenCalledWith({ widget_id: 'w1', public_data: 'tally', cache_time: 30 })
  })

  it('passes cacheTime through, including values the server clamps', async () => {
    const { api, holder } = fakeApi()

    await Counter.editShared(holder, 'w1', 'same', { cacheTime: 5 })
    await Counter.editShared(holder, 'w1', 'same', { cacheTime: 3600 })
    await Counter.editShared(holder, 'w1', 'same', { cacheTime: 3601 })

    expect(api.editSharedWidgetData).toHaveBeenLastCalledWith({
      widget_id: 'w1', public_data: 'same', cache_time: 3601
    })
  })

  it.each([4, 30.5, Number.NaN])('rejects cacheTime %s', (cacheTime) => {
    const { api, holder } = fakeApi()

    expect(() => Counter.editShared(holder, 'w1', 'x', { cacheTime })).toThrow(RangeError)
    expect(api.editSharedWidgetData).not.toHaveBeenCalled()
  })

  it('always supplies required public_data and clears it with null', async () => {
    const { api, holder } = fakeApi()

    await Counter.editShared(holder, 'w1', null)

    expect(api.editSharedWidgetData).toHaveBeenCalledWith({ widget_id: 'w1', public_data: '' })
  })
})

describe('defineWidget.decode', () => {
  it('reads raw and structured widgets', () => {
    const payload = { html: '<b></b>', chat_data: '{"count":5}', public_data: 'p' }

    expect(Counter.decode({ widget: payload })).toEqual({ chat: { count: 5 }, public: 'p' })
    expect(Counter.decode({ widget: new Widget(payload) })).toEqual({ chat: { count: 5 }, public: 'p' })
  })

  it('returns nulls when the state or the widget is missing', () => {
    expect(Counter.decode({ widget: { html: '' } })).toEqual({ chat: null, public: null })
    expect(Counter.decode({})).toEqual({ chat: null, public: null })
  })
})

describe('defineWidget with an html template', () => {
  const Poll = defineWidget({
    html: (question: string) => html`<h3>${question}</h3>`,
    public: json<number[]>()
  })

  it('renders escaped html and state per call', () => {
    expect(Poll.render('a < b?').content({ public: [0, 0], shared: true })).toEqual({
      html: '<h3>a &lt; b?</h3>',
      public_data: '[0,0]',
      is_shared: true
    })
    expect(Poll.render('tea?').content()).toEqual({ html: '<h3>tea?</h3>' })
  })

  it('edits and decodes state without rendering', async () => {
    const { api, holder } = fakeApi()

    await Poll.editShared(holder, '7', [1, 2])
    await Poll.editState(holder, { chat_id: 1, message_id: 2 }, { public: [3] })

    expect(api.editSharedWidgetData).toHaveBeenCalledWith({ widget_id: '7', public_data: '[1,2]' })
    expect(api.editMessageWidgetData).toHaveBeenCalledWith({ chat_id: 1, message_id: 2, public_data: '[3]' })
    expect(Poll.decode({ widget: { html: '', public_data: '[4]' } })).toEqual({ chat: null, public: [4] })
  })

  it('checks each rendered html against the size limit', () => {
    const Big = defineWidget({ html: (size: number) => raw('a'.repeat(size)) })

    expect(() => Big.render(40_000).content()).toThrow(WidgetTooLargeError)
  })
})
