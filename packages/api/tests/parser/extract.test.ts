import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, it, expect } from 'vitest'

import { extractFromHtml } from '../../scripts/lib/parser/normalize'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('extractFromHtml', () => {
  it('extracts methods from core fixture', async () => {
    const html = await readFile(resolve(__dirname, '../fixtures/core-snippet.html'), 'utf8')
    const { methods, objects } = extractFromHtml(html)

    const getMe = methods.find(m => m.name === 'getMe')

    expect(getMe).toBeDefined()
    expect(getMe!.arguments).toEqual([])
    expect(getMe!.returnType).toEqual({ kind: 'reference', name: 'User' })

    const sendMessage = methods.find(m => m.name === 'sendMessage')

    expect(sendMessage).toBeDefined()
    const chatIdArg = sendMessage!.arguments.find(a => a.name === 'chat_id')

    expect(chatIdArg!.required).toBe(true)
    expect(chatIdArg!.type).toEqual({
      kind: 'union',
      of: [{ kind: 'integer' }, { kind: 'string' }]
    })

    const message = objects.find(o => o.name === 'Message')

    expect(message).toBeDefined()
    expect(message!.kind).toBe('object')

    if (message!.kind === 'object') {
      const from = message.fields.find(f => f.name === 'from')

      expect(from!.required).toBe(false)
    }
  })

  it('classifies no-field objects by their subtype <ul>: list -> union, none -> empty object', () => {
    const html = `
      <h4>ChatMember</h4>
      <p>This object contains information about one member of a chat. Currently, the following 6 types of chat members are supported:</p>
      <ul>
        <li><a href="#chatmemberowner">ChatMemberOwner</a></li>
        <li><a href="#chatmemberadministrator">ChatMemberAdministrator</a></li>
        <li><a href="#chatmembermember">ChatMemberMember</a></li>
      </ul>
      <h4>VideoChatStarted</h4>
      <p>This object represents a service message about a video chat started in the chat. Currently holds no information.</p>
      <h4>CallbackGame</h4>
      <p>A placeholder, currently holds no information. Use <a href="https://t.me/botfather">@BotFather</a> to set up your game.</p>
    `

    const { objects } = extractFromHtml(html)

    const chatMember = objects.find(o => o.name === 'ChatMember')

    expect(chatMember!.kind).toBe('union')

    if (chatMember!.kind === 'union') {
      expect(chatMember.members).toEqual([
        { kind: 'reference', name: 'ChatMemberOwner' },
        { kind: 'reference', name: 'ChatMemberAdministrator' },
        { kind: 'reference', name: 'ChatMemberMember' }
      ])
    }

    // no subtype list -> genuinely empty object, not a union (the prose <a> to @BotFather is ignored)
    expect(objects.find(o => o.name === 'VideoChatStarted')!.kind).toBe('object')
    expect(objects.find(o => o.name === 'CallbackGame')!.kind).toBe('object')
  })

  it('dedupes duplicated table rows, keeping the first position and the latest row content', () => {
    const html = `
      <h4>ReplyParameters</h4>
      <p>Describes reply parameters for the message that is being sent.</p>
      <table class="table">
      <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
      <tr><td>message_id</td><td>Integer</td><td><em>Optional</em>. Identifier of the message that will be replied to.</td></tr>
      <tr><td>allow_sending_without_reply</td><td>Boolean</td><td><em>Optional</em>. Stale wording.</td></tr>
      <tr><td>ephemeral_message_id</td><td>Integer</td><td><em>Optional</em>. Identifier of the incoming ephemeral message.</td></tr>
      <tr><td>allow_sending_without_reply</td><td>Boolean</td><td><em>Optional</em>. Updated wording mentioning ephemeral messages.</td></tr>
      </tbody>
      </table>
    `

    const { objects } = extractFromHtml(html)
    const replyParameters = objects.find(o => o.name === 'ReplyParameters')

    expect(replyParameters!.kind).toBe('object')

    if (replyParameters!.kind === 'object') {
      expect(replyParameters.fields.map(f => f.name)).toEqual(['message_id', 'allow_sending_without_reply', 'ephemeral_message_id'])
      expect(replyParameters.fields[1]!.description).toContain('Updated wording')
    }
  })

  it('forces known docs-bug fields optional via override', () => {
    const html = `
      <h4>Message</h4>
      <p>This object represents a message.</p>
      <table class="table">
      <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
      <tr><td>message_id</td><td>Integer</td><td>Unique message identifier inside this chat.</td></tr>
      <tr><td>ephemeral_message_id</td><td>Integer</td><td>For ephemeral messages, identifier of the ephemeral message inside this chat.</td></tr>
      </tbody>
      </table>
    `

    const { objects } = extractFromHtml(html)
    const message = objects.find(o => o.name === 'Message')

    expect(message!.kind).toBe('object')

    if (message!.kind === 'object') {
      expect(message.fields.find(f => f.name === 'message_id')!.required).toBe(true)
      expect(message.fields.find(f => f.name === 'ephemeral_message_id')!.required).toBe(false)
    }
  })

  it('enumerates single-char quoted values and never captures the word "one" from "one of"', () => {
    const html = `
      <h4>InputRichBlockListItem</h4>
      <p>An item of a list to be sent.</p>
      <table class="table">
      <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
      <tr><td>type</td><td>String</td><td>Optional. For ordered lists, the type of the item label; must be one of \u201ca\u201d for lowercase letters, \u201cA\u201d for uppercase letters, \u201ci\u201d for lowercase Roman numerals, \u201cI\u201d for uppercase Roman numerals, or \u201c1\u201d for decimal numbers</td></tr>
      <tr><td>status</td><td>String</td><td>The status, must be one of the supported values</td></tr>
      </tbody>
      </table>
    `

    const { objects } = extractFromHtml(html)
    const item = objects.find(o => o.name === 'InputRichBlockListItem')

    expect(item!.kind).toBe('object')

    if (item!.kind === 'object') {
      expect(item.fields.find(f => f.name === 'type')!.type).toEqual({ kind: 'string', enumeration: ['a', 'A', 'i', 'I', '1'] })
      expect(item.fields.find(f => f.name === 'status')!.type).toEqual({ kind: 'string' })
    }
  })
})
