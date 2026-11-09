#!/usr/bin/env node

import { spawnSync } from 'node:child_process'

const checks = [
  { repository: 'puregram/puregram', workflow: 'bot-api-watch.yml', ref: 'v3' },
  { repository: 'puregram/skills', workflow: 'docs-catalogue.yml', ref: 'lord' }
]

for (const check of checks) {
  const result = spawnSync('gh', [
    'workflow', 'run', check.workflow, '--repo', check.repository, '--ref', check.ref
  ], {
    encoding: 'utf8', timeout: 30_000, maxBuffer: 1024 * 1024,
    env: { ...process.env, GH_PROMPT_DISABLED: '1' }
  })
  const timestamp = new Date().toISOString()
  if (result.error || result.status !== 0) {
    process.stderr.write(`[${timestamp}] failed ${check.repository}/${check.workflow}: ${result.error?.message || result.stderr || 'gh exited with ' + result.status}\n`)
    process.exitCode = 1
  } else {
    process.stdout.write(`[${timestamp}] dispatched ${check.repository}/${check.workflow}\n${result.stdout}`)
  }
}
