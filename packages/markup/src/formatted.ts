import type { TelegramMessageEntity } from '@puregram/api'

import { toHtml as toHtmlImpl } from './serializers/html'
import { toMarkdown as toMarkdownImpl } from './serializers/markdown'

// `type` mirrors `TelegramMessageEntity['type']` so `Formatted` values flow into
// bot-api method args without a cast
export interface Entity {
  type: TelegramMessageEntity['type']
  offset: number
  length: number
  url?: string
  user?: { id: number, is_bot: boolean, first_name: string, last_name?: string, username?: string }
  language?: string
  custom_emoji_id?: string
  unix_time?: number
  date_time_format?: string
}

// covers both `MessageEntity` instances (with camelCase getters) and raw bot-api snake_case payloads
interface RawEntity {
  type: TelegramMessageEntity['type']
  offset: number
  length: number
  url?: string
  user?: { id: number, is_bot: boolean, first_name: string, last_name?: string, username?: string }
  language?: string
  custom_emoji_id?: string
  customEmojiId?: string
  unix_time?: number
  unixTime?: number
  date_time_format?: string
  dateTimeFormat?: string
}

// wrapper-class entities have explicit `| undefined` on optional fields which breaks under
// `exactOptionalPropertyTypes`; values get normalized via `normalizeEntity`
interface LooseEntity {
  type: TelegramMessageEntity['type']
  offset: number
  length: number
  url?: string | undefined
  user?: unknown
  language?: string | undefined
  custom_emoji_id?: string | undefined
  customEmojiId?: string | undefined
  unix_time?: number | undefined
  unixTime?: number | undefined
  date_time_format?: string | undefined
  dateTimeFormat?: string | undefined
}

/**
 * shape that {@link Formatted.fromMessage} accepts. covers `MessageUpdate` /
 * `Message` wrappers (which carry the raw payload under `.raw`) and any plain
 * `{text, entities, …}` object. wrapper-class instances get unwrapped to their
 * `.raw` payload, which sidesteps the wrapper getters returning nested wrappers
 * (e.g. `MessageEntity.user` returning a `User` instance instead of the raw shape)
 */
export interface MessageLike {
  text?: string | undefined
  entities?: readonly LooseEntity[] | null | undefined
  caption?: string | undefined
  caption_entities?: readonly LooseEntity[] | null | undefined
  raw?: {
    text?: string | undefined
    entities?: readonly LooseEntity[] | null | undefined
    caption?: string | undefined
    caption_entities?: readonly LooseEntity[] | null | undefined
  } | undefined
}

function normalizeEntity (e: LooseEntity) {
  const out: Entity = { type: e.type, offset: e.offset, length: e.length }

  if (e.url !== undefined) {
    out.url = e.url
  }

  if (e.user !== undefined && e.user !== null) {
    // accept raw `TelegramUser` shape or a wrapper-class instance — pick raw when present
    const u = e.user as { raw?: unknown } & Record<string, unknown>
    const picked = u.raw && typeof u.raw === 'object' ? u.raw : u

    if (picked) {
      out.user = picked as NonNullable<Entity['user']>
    }
  }

  if (e.language !== undefined) {
    out.language = e.language
  }

  const customEmojiId = e.custom_emoji_id ?? (e as RawEntity).customEmojiId

  if (customEmojiId !== undefined) {
    out.custom_emoji_id = customEmojiId
  }

  const unixTime = e.unix_time ?? (e as RawEntity).unixTime

  if (unixTime !== undefined) {
    out.unix_time = unixTime
  }

  const dateTimeFormat = e.date_time_format ?? (e as RawEntity).dateTimeFormat

  if (dateTimeFormat !== undefined) {
    out.date_time_format = dateTimeFormat
  }

  return out
}

/** plain `{text, entities}` payload — the shape every telegram method expects on the wire */
export interface FormattedPayload {
  text: string
  entities: Entity[]
}

/** entity-based formatted text — pair of plain text + a list of bot-api message entities */
export class Formatted {
  readonly text: string
  readonly entities: readonly Entity[]

  constructor (text: string, entities: readonly Entity[] = []) {
    const owned: Entity[] = []

    for (const entity of entities) {
      if (entity.length > 0) {
        owned.push(entity.user === undefined ? { ...entity } : { ...entity, user: { ...entity.user } })
      }
    }

    this.text = text
    this.entities = owned
  }

  /** wraps a raw `{text, entities}` shape or returns the same `Formatted` instance unchanged */
  static from (source: Formatted | { text: string, entities?: readonly Entity[] }) {
    if (source instanceof Formatted) {
      return source
    }

    return new Formatted(source.text, source.entities ?? [])
  }

  /**
   * hydrates a `Formatted` from a `MessageUpdate` (or any `{text, entities, caption, caption_entities}` object).
   * picks `text`+`entities` when present, otherwise falls back to `caption`+`caption_entities`.
   * round-trip safe — `Formatted.fromMessage(msg).toPayload()` reproduces the original `{text, entities}` pair
   */
  static fromMessage (source: MessageLike) {
    // unwrap MessageUpdate / Message so we read raw bot-api shape directly —
    // wrapper getters re-wrap nested objects and trip both types and serializer
    const data = source.raw && typeof source.raw === 'object' ? source.raw : source
    const hasText = typeof data.text === 'string'
    const rawText = hasText ? data.text : data.caption
    const rawEntities = hasText ? data.entities : data.caption_entities
    const text = rawText ?? ''
    const entities = rawEntities == null ? [] : Array.from(rawEntities, normalizeEntity)

    return new Formatted(text, entities)
  }

  /** returns the plain `{text, entities}` payload — useful for forwarding to bot-api methods directly */
  toPayload () {
    const payload: FormattedPayload = { text: this.text, entities: this.entities.map(e => ({ ...e })) }

    return payload
  }

  /** serializes the formatted text back into telegram html source */
  toHtml () {
    return toHtmlImpl(this)
  }

  /** serializes the formatted text back into telegram markdown v2 source */
  toMarkdown () {
    return toMarkdownImpl(this)
  }

  toString () {
    return this.text
  }
}
