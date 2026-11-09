import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { join, posix } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm'

const root = process.argv[2]
const database = new DatabaseSync(':memory:')
database.exec('CREATE TABLE sessions (key TEXT PRIMARY KEY, value TEXT NOT NULL, expires_at INTEGER)')
database.exec('CREATE TABLE rate_limits (key TEXT PRIMARY KEY, value TEXT NOT NULL, expires_at INTEGER)')
const calls = []
const logs = []

class BotApiError extends Error {
  constructor () {
    super('flood wait')
    this.code = 429
    this.description = 'flood wait'
    this.method = 'sendMessage'
    this.parameters = { retry_after: 7 }
  }
}

class InputFile {
  constructor (source, filename, options) {
    this.source = source
    this.filename = filename
    this.type = options?.type
  }
}

class EndpointError extends Error {
  constructor (description, parameters) {
    super(description)
    this.name = 'EndpointError'
    this.description = description
    this.parameters = parameters
  }
}

class FormData {}

async function fetch (url) {
  if (url !== 'https://example.com/cat.png') {
    return { ok: false, status: 404, headers: { get: () => null }, body: (async function * () {})() }
  }

  return {
    ok: true,
    status: 200,
    headers: { get: name => name === 'content-type' ? 'image/png' : null },
    body: (async function * () {
      yield new Uint8Array([137, 80])
      yield new Uint8Array([78, 71])
    })()
  }
}

const api = new Proxy({}, {
  get (_, method) {
    return async (params) => {
      if (method === 'getMe') return { id: 123, is_bot: true, first_name: 'test', username: 'test_bot' }
      if (params?.text === 'reject') throw new BotApiError()
      calls.push({ method, params })
      if (method === 'sendMessage') return { message_id: 1, date: 0, chat: { id: params.chat_id, type: 'private' }, text: params.text }
      return true
    }
  }
})

const db = {
  async get (sql, params) {
    return database.prepare(sql).get(params ?? {}) ?? null
  },
  async run (sql, params) {
    const result = database.prepare(sql).run(params ?? {})
    return { rowsAffected: result.changes, lastInsertRowid: result.lastInsertRowid, rows: [] }
  }
}

async function load () {
  const context = createContext({
    console: { ...console, debug: (...args) => logs.push(args) },
    TextEncoder,
    TextDecoder,
    crypto: globalThis.crypto
  })
  const modules = new Map()
  const sdk = new SyntheticModule(['api', 'db', 'fetch', 'InputFile', 'BotApiError', 'EndpointError', 'FormData'], function () {
    this.setExport('api', api)
    this.setExport('db', db)
    this.setExport('fetch', fetch)
    this.setExport('InputFile', InputFile)
    this.setExport('BotApiError', BotApiError)
    this.setExport('EndpointError', EndpointError)
    this.setExport('FormData', FormData)
  }, { context })
  modules.set('sdk', sdk)

  async function resolve (specifier, referencing) {
    const name = specifier.startsWith('.')
      ? posix.join(posix.dirname(referencing.identifier), specifier).replace(/\.js$/, '')
      : specifier
    if (modules.has(name)) return modules.get(name)
    assert.match(name, /^(lib\/bot|handlers\/(message|callback_query)|endpoints\/(echo|refuse))$/)
    const module = new SourceTextModule(await readFile(join(root, `${name}.js`), 'utf8'), { context, identifier: name })
    modules.set(name, module)
    await module.link(resolve)
    return module
  }

  const loaded = {}

  for (const [key, name] of Object.entries({ message: 'handlers/message', callback: 'handlers/callback_query', echo: 'endpoints/echo', refuse: 'endpoints/refuse' })) {
    const module = await resolve(name)
    await module.evaluate()
    loaded[key] = module.namespace.default
  }

  return loaded
}

function update (id, text) {
  return {
    update_id: id,
    message: {
      message_id: id,
      date: 0,
      from: { id: 7, is_bot: false, first_name: 'user' },
      chat: { id: 7, type: 'private' },
      text
    }
  }
}

try {
  let handlers = await load()
  let raw = update(1, 'hello')
  await handlers.message(raw.message, { update: raw })
  let sent = calls.find(call => call.method === 'sendMessage').params
  assert.equal(sent.text, 'first')
  assert.deepEqual(JSON.parse(JSON.stringify(sent.entities)), [{ type: 'bold', offset: 0, length: 5 }])
  const callbackData = sent.reply_markup.inline_keyboard[0][0].callback_data

  handlers = await load()
  raw = update(2, 'again')
  await handlers.message(raw.message, { update: raw })
  sent = calls.filter(call => call.method === 'sendMessage').at(-1).params
  assert.equal(sent.text, 'hello')
  assert.deepEqual(calls.filter(call => call.method === 'recordUpdate').map(call => call.params.update_id), [1, 2])

  const callback = { update_id: 3, callback_query: { id: 'q1', from: raw.message.from, chat_instance: 'chat', data: callbackData } }
  await handlers.callback(callback.callback_query, { update: callback })
  assert.deepEqual(JSON.parse(JSON.stringify(calls.at(-1))), {
    method: 'answerCallbackQuery', params: { callback_query_id: 'q1', text: 'acknowledged:7' }
  })

  raw = update(4, 'suppress')
  await handlers.message(raw.message, { update: raw })
  assert.equal(calls.at(-1).params.text, '7')

  raw = update(5, 'api-error')
  await assert.rejects(handlers.message(raw.message, { update: raw }), error => error.code === 429 && error.parameters.retry_after === 7)
  raw = update(6, 'fail')
  await assert.rejects(handlers.message(raw.message, { update: raw }), /message handler failed/)
  raw = update(90, 'raw-fail')
  await assert.rejects(handlers.message(raw.message, { update: raw }), /raw handler failed/)
  raw = update(91, 'local')
  await handlers.message(raw.message)
  assert.equal(calls.filter(call => call.method === 'recordUpdate').at(-1).params.update_id, 0)

  const future = { update_id: 92, future_update: { value: true } }
  await handlers.message(future.future_update, { update: future })
  assert.equal(calls.at(-1).method, 'recordUpdate')
  assert.equal(calls.at(-1).params.update_id, 92)

  raw = update(93, 'intercept')
  await handlers.message(raw.message, { update: raw })

  raw = update(7, 'upload')
  await handlers.message(raw.message, { update: raw })
  const document = calls.at(-1).params.document
  assert.ok(document instanceof InputFile)
  assert.deepEqual(Array.from(document.source), [1, 2, 3])
  assert.equal(document.filename, 'a.bin')

  raw = update(100, 'fetch-upload')
  await handlers.message(raw.message, { update: raw })
  const photo = calls.at(-1).params.photo
  assert.ok(photo instanceof InputFile)
  assert.deepEqual(Array.from(photo.source), [137, 80, 78, 71])
  assert.equal(photo.filename, 'cat.png')
  assert.equal(photo.type, 'image/png')
  raw = update(101, 'fetch-missing')
  await assert.rejects(handlers.message(raw.message, { update: raw }), /HTTP 404/)

  raw = update(102, 'keyboard')
  await handlers.message(raw.message, { update: raw })
  assert.deepEqual(JSON.parse(JSON.stringify(calls.at(-1).params.reply_markup)), {
    inline_keyboard: [[{ text: 'a', callback_data: 'a' }], [{ text: 'b', callback_data: 'b' }]]
  })

  raw = update(103, 'deeplink:t.me/my_bot?start=a%20b+c')
  await handlers.message(raw.message, { update: raw })
  assert.equal(calls.at(-1).params.text, '{"type":"bot-start","bot":"my_bot","payload":"a b c"}')

  assert.deepEqual(JSON.parse(JSON.stringify(await handlers.echo({ value: 1 }, { initData: { user: { id: 5, first_name: 'u' }, auth_date: 1, hash: 'h' } }))), { value: 1, user: 5 })
  await assert.rejects(handlers.refuse({}, { initData: { auth_date: 1, hash: 'h' } }), error =>
    error instanceof EndpointError && error.description === 'refused' && error.parameters.code === 'NOPE')

  raw = update(94, '/scene')
  await handlers.message(raw.message, { update: raw })
  assert.equal(calls.at(-1).params.text, 'scene:question')
  handlers = await load()
  raw = update(95, 'answer')
  await handlers.message(raw.message, { update: raw })
  assert.equal(calls.at(-1).params.text, 'scene:answer')

  raw = update(96, 'limited')
  await handlers.message(raw.message, { update: raw })
  assert.equal(calls.at(-1).params.text, 'allowed')
  handlers = await load()
  raw = update(97, 'limited')
  await handlers.message(raw.message, { update: raw })
  assert.equal(calls.at(-1).params.text, 'limited')

  const key = createHmac('sha256', 'WebAppData').update('fixture-token').digest()
  const hash = createHmac('sha256', key).update('auth_date=1').digest('hex')
  raw = update(98, `webapp:auth_date=1&hash=${hash}`)
  await handlers.message(raw.message, { update: raw })
  assert.equal(calls.at(-1).params.text, 'verified')
  raw = update(99, `webapp:auth_date=2&hash=${hash}`)
  await handlers.message(raw.message, { update: raw })
  assert.equal(calls.at(-1).params.text, 'invalid')

  assert.ok(logs.some(args => args[0] === '-> sendMessage'))
  assert.ok(logs.some(args => args[0] === '<- sendMessage ok=false error_code=429 description=flood wait'))

  console.log('sandbox integration passed: dispatch, formatting, keyboard, cold-start sessions, callbacks, raw IDs, errors, uploads')
} finally {
  database.close()
}
