import { SERVICE_EVENT_ORDER, UPDATE_CLASSES, type TelegramUpdate, type Update } from '@puregram/api'

type UpdateClass = new (raw: unknown, tg: unknown, update: TelegramUpdate) => Update

const updateClasses = UPDATE_CLASSES as unknown as Record<keyof typeof UPDATE_CLASSES, UpdateClass>

export const SERVICE_EVENT_PARENTS: readonly string[] = [
  'message', 'edited_message', 'channel_post', 'edited_channel_post'
]

export class UnsupportedUpdate {
  readonly kind = 'unknown' as const
  constructor (
    public readonly raw: unknown,
    public readonly rawKey: string,
    public readonly update: Record<string, unknown>
  ) {}

  get updateId () {
    return typeof this.update.update_id === 'number' ? this.update.update_id : undefined
  }
}

export function buildUpdate (rawUpdate: Record<string, unknown>, tg: unknown) {
  let primaryKey: string | undefined

  for (const k of Object.keys(rawUpdate)) {
    if (k !== 'update_id') {
      primaryKey = k
      break
    }
  }

  if (primaryKey === undefined) {
    return new UnsupportedUpdate(rawUpdate, 'none', rawUpdate)
  }

  if (!Object.hasOwn(updateClasses, primaryKey)) {
    return new UnsupportedUpdate(rawUpdate[primaryKey], primaryKey, rawUpdate)
  }

  let kind = primaryKey as keyof typeof updateClasses

  const payload = rawUpdate[primaryKey] as Record<string, unknown>
  const originalUpdate = rawUpdate as unknown as TelegramUpdate

  if (SERVICE_EVENT_PARENTS.includes(primaryKey)) {
    for (const field of SERVICE_EVENT_ORDER) {
      if (payload[field] !== undefined) {
        kind = field
        break
      }
    }
  }

  return new updateClasses[kind](payload, tg, originalUpdate)
}
