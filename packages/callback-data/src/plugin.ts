import { createPlugin, type TelegramCore } from 'puregram/runtime'

/** any callback-data schema, narrowed to just the slug pair the plugin actually inspects */
export interface AnyCallbackData {
  readonly slug: string
  readonly rawSlug: string
}

export interface CallbackDataExtension {
  /** add another schema after install. throws if its slug collides with an already-registered one */
  register: (schema: AnyCallbackData) => void
  /** all registered schemas, keyed by slug hash */
  readonly all: ReadonlyMap<string, AnyCallbackData>
}

/**
 * optional plugin that catches slug collisions across multiple `defineCallbackData`
 * schemas at install time. without it, two schemas with the same 6-char slug hash
 * just silently match each other's payloads
 *
 * @example
 * ```ts
 * const Ban = defineCallbackData('ban').number('user_id')
 * const Kick = defineCallbackData('kick').number('user_id')
 *
 * const tg = Telegram.fromToken(TOKEN)
 *   .extend(callbackData([Ban, Kick]))
 * ```
 */
export function callbackData (schemas: readonly AnyCallbackData[] = []) {
  return createPlugin({
    name: 'callbackData',
    install: (_tg: TelegramCore) => {
      const all = new Map<string, AnyCallbackData>()

      const register = (schema: AnyCallbackData) => {
        const existing = all.get(schema.slug)

        if (existing !== undefined && existing !== schema) {
          throw new Error(
            `callback-data slug collision: "${schema.rawSlug}" and "${existing.rawSlug}" hash to "${schema.slug}"`
          )
        }

        all.set(schema.slug, schema)
      }

      for (const schema of schemas) {
        register(schema)
      }

      const ext: CallbackDataExtension = {
        register,
        all
      }

      return ext
    }
  })
}
