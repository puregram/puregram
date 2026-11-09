import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, it, expect } from 'vitest'

import { parseCore } from '../../scripts/lib/parser/core'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('parseCore', () => {
  it('parses core fixture into schema fragment', async () => {
    const html = await readFile(resolve(__dirname, '../fixtures/core-snippet.html'), 'utf8')
    const fragment = parseCore(html)

    expect(fragment.methods.find(m => m.name === 'sendMessage')).toBeDefined()
    expect(fragment.objects.find(o => o.name === 'User')).toBeDefined()
  })

  it('reads release metadata through markup and rejects missing dates', () => {
    const html = '<h4>November 9, 2026</h4><p><strong>Bot API <em>10.4</em></strong></p><h4>Update</h4><table><tbody><tr><td>update_id</td><td>Integer</td><td>Identifier</td></tr></tbody></table>'
    const schema = parseCore(html)

    expect(schema.version).toEqual({ major: 10, minor: 4, patch: 0 })
    expect(schema.recentChanges).toEqual({ year: 2026, month: 11, day: 9 })
    expect(() => parseCore(html.replace('November 9, 2026', ''))).toThrow('release date')
  })

  it('refuses to silently drop an update field with an unsupported payload union', () => {
    const html = '<p>Bot API 10.4</p><h4>November 9, 2026</h4><h4>Update</h4><table><tbody><tr><td>callback_query</td><td>CallbackQuery or InlineCallbackQuery</td><td>Optional. Query</td></tr></tbody></table>'

    expect(() => parseCore(html)).toThrow('Update.callback_query')
  })
})
