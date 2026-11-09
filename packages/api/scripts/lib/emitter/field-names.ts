// snake → camel by default; this map renames ergonomic outliers (e.g. `message_id` → `id`
// so `update.id` matches what users reach for)
const FIELD_NAME_OVERRIDES: Record<string, string> = {
  message_id: 'id'
}

export function getterNameFor (snakeField: string, fields: readonly { name: string }[]) {
  const alias = FIELD_NAME_OVERRIDES[snakeField]

  return alias === undefined || fields.some(field => field.name === alias) ? camelCase(snakeField) : alias
}

export function camelCase (snake: string) {
  return snake.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}
