import { index, integer, table, text } from 'sdk/db'

import { storageColumns, validateTableName } from './storage-columns'

export interface TelegramKvColumn {
  primaryKey: () => this
  notNull: () => this
}

export interface TelegramKvTable {
  key: TelegramKvColumn
  value: TelegramKvColumn
  expiresAt: TelegramKvColumn
  strict: () => this
  withoutRowid: () => this
  constraint: (sql: string, name?: string) => this
  deprecated: (reason: string) => this
}

export function kvTable (name: string) {
  validateTableName(name)

  const definition: TelegramKvTable = table(name, {
    key: text(storageColumns.key).primaryKey(),
    value: text(storageColumns.value).notNull(),
    expiresAt: integer(storageColumns.expiresAt)
  }, columns => ({
    expiresAt: index(`${name}_expires_at_idx`).on(columns.expiresAt)
  }))

  return definition
}
