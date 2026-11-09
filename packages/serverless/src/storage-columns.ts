export const storageColumns = {
  key: 'key',
  value: 'value',
  expiresAt: 'expires_at'
} as const

export function validateTableName (name: string) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new TypeError('storage table must be a SQL identifier')
  }
}
