import { readFile, readdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, it, expect } from 'vitest'

import type { Schema } from '../scripts/lib/schema-types'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('schema checkpoint', () => {
  it('has at least one schema/<version>.json', async () => {
    const schemaDir = resolve(__dirname, '..', 'schema')
    const files = await readdir(schemaDir)
    const versionFiles = files.filter(f => /^\d+\.\d+\.json$/.test(f))

    expect(versionFiles.length).toBeGreaterThan(0)
  })

  it('latest checkpoint contains canonical methods and objects', async () => {
    const schemaDir = resolve(__dirname, '..', 'schema')
    const files = await readdir(schemaDir)
    const versionFiles = files.filter(f => /^\d+\.\d+\.json$/.test(f)).sort()
    const latest = versionFiles[versionFiles.length - 1]

    const raw = await readFile(resolve(schemaDir, latest), 'utf8')
    const schema = JSON.parse(raw) as Schema

    for (const expected of ['getMe', 'sendMessage', 'getUpdates', 'forwardMessage', 'sendPhoto', 'editMessageText', 'deleteMessage']) {
      expect(schema.methods.find(m => m.name === expected), `missing method ${expected}`).toBeDefined()
    }

    for (const expected of ['User', 'Chat', 'Message', 'Update', 'CallbackQuery', 'InlineKeyboardMarkup']) {
      expect(schema.objects.find(o => o.name === expected), `missing object ${expected}`).toBeDefined()
    }

    const sendMessage = schema.methods.find(m => m.name === 'sendMessage')!

    expect(sendMessage.arguments.find(a => a.name === 'chat_id')).toBeDefined()
    expect(sendMessage.arguments.find(a => a.name === 'text')).toBeDefined()

    const update = schema.objects.find(o => o.name === 'Update')!

    expect(update.kind).toBe('object')

    if (update.kind === 'object') {
      expect(update.fields.find(f => f.name === 'callback_query')?.type).toEqual({ kind: 'reference', name: 'CallbackQuery' })
      expect(update.fields.find(f => f.name === 'widget_query')?.type).toEqual({ kind: 'reference', name: 'WidgetQuery' })
      expect(update.fields.find(f => f.name === 'shared_widget_query')?.type).toEqual({ kind: 'reference', name: 'SharedWidgetQuery' })
    }

    expect(sendMessage.arguments.find(a => a.name === 'chat_id')?.required).toBe(false)
    expect(schema.objects.some(o => o.name === 'AreaPosition')).toBe(true)
    expect(schema.objects.some(o => o.name === 'StoryAreaPosition')).toBe(false)
  })
})
