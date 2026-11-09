import * as cheerio from 'cheerio'

import { buildUpdateKinds } from '../emitter/updates-config'
import type { Schema } from '../schema-types'

import { extractFromHtml } from './normalize'

export function parseCore (html: string) {
  const { methods, objects } = extractFromHtml(html)
  const version = parseVersion(html)
  const recentChanges = parseRecentChanges(html)

  const fragment = {
    methods: methods.sort((a, b) => a.name.localeCompare(b.name)),
    objects: objects.sort((a, b) => a.name.localeCompare(b.name)),
    version,
    recentChanges
  }

  buildUpdateKinds({ ...fragment, source: { core: '', fetchedAt: '' } } satisfies Schema)

  return fragment
}

function parseVersion (html: string) {
  const text = cheerio.load(html).root().text()
  const match = text.match(/Bot API\s+(\d+)\.(\d+)(?:\.(\d+))?/i)

  if (!match) {
    throw new Error('could not detect bot-api version in core html')
  }

  return { major: Number(match[1]), minor: Number(match[2]), patch: match[3] ? Number(match[3]) : 0 }
}

function parseRecentChanges (html: string) {
  const $ = cheerio.load(html)
  const text = $('h4, p').map((_, element) => $(element).text()).get().join('\n')
  const match = text.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})\b/)

  if (!match) {
    throw new Error('could not detect bot-api release date in core html')
  }

  const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(match[1]!)

  return { year: Number(match[3]), month: monthIndex + 1, day: Number(match[2]) }
}
