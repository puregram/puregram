import { SERVICE_EVENT_ORDER, UPDATE_CLASSES } from '@puregram/api'

/* eslint-disable @typescript-eslint/no-explicit-any -- raw class refs differ per kind; widening is intentional */
type UpdateClass = new (raw: any, tg: any) => any
/* eslint-enable @typescript-eslint/no-explicit-any */

const updateClasses: Record<string, UpdateClass> = UPDATE_CLASSES

export const SERVICE_EVENT_PARENTS: readonly string[] = [
  'message', 'edited_message', 'channel_post', 'edited_channel_post'
]

export class UnsupportedUpdate {
  readonly kind = 'unknown' as const
  constructor (
    public readonly raw: unknown,
    public readonly rawKey: string,
    _tg: unknown
  ) {}
}

export function buildUpdate (rawUpdate: Record<string, unknown>, tg: unknown) {
  let primaryKey: string | undefined

  for (const k of Object.keys(rawUpdate)) {
    if (k !== 'update_id') {
      primaryKey = k; break
    }
  }

  if (primaryKey === undefined) {
    return new UnsupportedUpdate(rawUpdate, 'none', tg) as never
  }

  const cls = Object.hasOwn(updateClasses, primaryKey) ? updateClasses[primaryKey] : undefined

  if (!cls) {
    return new UnsupportedUpdate(rawUpdate[primaryKey], primaryKey, tg) as never
  }

  const payload = rawUpdate[primaryKey] as Record<string, unknown>

  if (SERVICE_EVENT_PARENTS.includes(primaryKey)) {
    for (const field of SERVICE_EVENT_ORDER) {
      if (field in payload && payload[field] !== undefined) {
        const serviceCls = updateClasses[field]

        if (serviceCls) {
          // eslint-disable-next-line new-cap, @typescript-eslint/no-unsafe-return -- runtime class lookup
          return new serviceCls(payload, tg)
        }
      }
    }
  }

  // eslint-disable-next-line new-cap, @typescript-eslint/no-unsafe-return -- runtime class lookup
  return new cls(payload, tg)
}
