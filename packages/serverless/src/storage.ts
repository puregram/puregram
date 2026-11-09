import { db } from 'sdk'

import type { TtlStorage } from '@puregram/storage'

import { storageColumns, validateTableName } from './storage-columns'

export interface TelegramDatabase {
  get: (query: string, params?: Record<string, unknown>) => Promise<unknown>
  run: (query: string, params?: Record<string, unknown>) => Promise<unknown>
}

export interface TelegramStorageOptions {
  table: string
  db?: TelegramDatabase
  ttlMs?: number
  sweepIntervalMs?: number
}

const { key: keyColumn, value: valueColumn, expiresAt: expiryColumn } = storageColumns

export class TelegramStorage<V = unknown> implements TtlStorage<V> {
  private readonly db: TelegramDatabase
  private readonly table: string
  private readonly ttlMs: number
  private readonly sweepIntervalMs: number
  private nextSweepAt = 0

  constructor (options: TelegramStorageOptions) {
    validateTableName(options.table)

    this.ttlMs = options.ttlMs ?? 0
    this.sweepIntervalMs = options.sweepIntervalMs ?? 60_000

    if (!Number.isFinite(this.ttlMs) || this.ttlMs < 0) {
      throw new TypeError('ttlMs must be a finite non-negative number')
    }

    if (!Number.isFinite(this.sweepIntervalMs) || this.sweepIntervalMs < 0) {
      throw new TypeError('sweepIntervalMs must be a finite non-negative number')
    }

    this.db = options.db ?? db
    this.table = `"${options.table}"`
  }

  async get (key: string) {
    const row = await this.readRow(key, true)

    if (row === undefined) {
      return undefined
    }

    const value = row[valueColumn]

    if (typeof value !== 'string') {
      throw new TypeError('storage table must have a text value column')
    }

    const envelope = JSON.parse(value) as { value?: V }

    return envelope.value
  }

  async set (key: string, value: V) {
    if (typeof value === 'function' || typeof value === 'symbol') {
      throw new TypeError('storage values must be JSON serializable or undefined')
    }

    const serialized = JSON.stringify({ value })
    const now = Date.now()

    await this.db.run(
      `INSERT INTO ${this.table} (${keyColumn}, ${valueColumn}, ${expiryColumn}) VALUES (:key, :value, :expires_at) ` +
      `ON CONFLICT(${keyColumn}) DO UPDATE SET ${valueColumn} = excluded.${valueColumn}, ${expiryColumn} = excluded.${expiryColumn}`,
      { ':key': key, ':value': serialized, ':expires_at': this.ttlMs > 0 ? now + this.ttlMs : null }
    )
    await this.sweep(now)
  }

  async delete (key: string) {
    await this.db.run(`DELETE FROM ${this.table} WHERE ${keyColumn} = :key`, { ':key': key })
    await this.sweep(Date.now())
  }

  async has (key: string) {
    return await this.readRow(key, false) !== undefined
  }

  async touch (key: string) {
    if (this.ttlMs === 0) {
      return
    }

    const now = Date.now()

    await this.db.run(
      `UPDATE ${this.table} SET ${expiryColumn} = :expires_at WHERE ${keyColumn} = :key ` +
      `AND (${expiryColumn} IS NULL OR ${expiryColumn} > :now)`,
      { ':key': key, ':expires_at': now + this.ttlMs, ':now': now }
    )
    await this.sweep(now)
  }

  private async readRow (key: string, includeValue: boolean) {
    const row = await this.db.get(
      `SELECT ${includeValue ? `${valueColumn}, ` : ''}${expiryColumn} FROM ${this.table} WHERE ${keyColumn} = :key`,
      { ':key': key }
    )

    if (row === null || row === undefined) {
      return undefined
    }

    if (typeof row !== 'object' || !(expiryColumn in row)) {
      throw new TypeError('storage table must have an expires_at column; migrate the kvTable schema first')
    }

    const expiresAt = (row as Record<string, unknown>)[expiryColumn]

    if (expiresAt !== null && (typeof expiresAt !== 'number' || !Number.isFinite(expiresAt))) {
      throw new TypeError('storage expires_at must be an integer timestamp or null')
    }

    const now = Date.now()

    if (expiresAt !== null && expiresAt <= now) {
      await this.db.run(
        `DELETE FROM ${this.table} WHERE ${keyColumn} = :key AND ${expiryColumn} <= :now`,
        { ':key': key, ':now': now }
      )

      return undefined
    }

    return row as Record<string, unknown>
  }

  private async sweep (now: number) {
    if (this.sweepIntervalMs === 0 || now < this.nextSweepAt) {
      return
    }

    this.nextSweepAt = now + this.sweepIntervalMs

    await this.db.run(
      `DELETE FROM ${this.table} WHERE ${keyColumn} IN (` +
      `SELECT ${keyColumn} FROM ${this.table} WHERE ${expiryColumn} <= :now ORDER BY ${expiryColumn} LIMIT 100)`,
      { ':now': now }
    )
  }
}
