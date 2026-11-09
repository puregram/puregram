import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

import ts from 'typescript'
import { expect, it } from 'vitest'

it('infers widget state types and rejects invalid state across client, message and thread sends', async () => {
  const root = await mkdtemp(join(resolve('tests'), '.widget-types-'))
  const file = join(root, 'consumer.ts')
  const prelude = `
import type { MessageUpdate } from '@puregram/api'
import type { Telegram } from 'puregram'
import { defineWidget, html, json, text } from '../../src'
declare const tg: Telegram
declare const message: MessageUpdate
declare const thread: NonNullable<MessageUpdate['thread']>
const Counter = defineWidget({ html: html\`<b>counter</b>\`, chat: json<{ count: number }>(), public: text() })
const Template = defineWidget({ html: (title: string) => html\`<b>\${title}</b>\`, chat: json<{ count: number }>() })
`
  const valid = [
    "tg.sendWidget(42, Counter, { chat: { count: 1 }, public: 'hello' })",
    "message.sendWidget(Counter, { chat: { count: 1 }, public: null, caption: 'counter' })",
    'message.replyWithWidget(Counter, { chat: { count: 1 } })',
    'thread.sendWidget(Counter, { chat: { count: 1 } })',
    "message.sendWidget(Template.render('hello'), { chat: { count: 1 } })",
    "message.sendWidget('<b>raw</b>', { public_data: 'raw' })"
  ]
  const invalid = [
    "tg.sendWidget(42, Counter, { chat: { count: 'wrong' } })",
    "message.sendWidget(Counter, { chat: { count: 'wrong' } })",
    'message.replyWithWidget(Counter, { public: 1 })',
    'thread.sendWidget(Counter, { chat: { other: 1 } })',
    "message.sendWidget('<b>raw</b>', { chat: { count: 1 } })",
    'message.sendWidget(Template, { chat: { count: 1 } })'
  ]

  try {
    const source = prelude + valid.join('\n') + '\n' + invalid.join('\n') + '\n'

    await writeFile(file, source)
    const program = ts.createProgram([file], {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      strict: true,
      exactOptionalPropertyTypes: true,
      skipLibCheck: true,
      noEmit: true
    })
    const diagnostics = ts.getPreEmitDiagnostics(program)
    const lines = diagnostics.map(d => d.file?.getLineAndCharacterOfPosition(d.start ?? 0).line)
    const firstInvalidLine = (prelude + valid.join('\n') + '\n').split('\n').length - 1

    expect(lines, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: path => path,
      getCurrentDirectory: () => root,
      getNewLine: () => '\n'
    })).toEqual(invalid.map((_, index) => firstInvalidLine + index))
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}, 30_000)
