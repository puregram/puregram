declare module 'sdk' {
  import type { TelegramFile, TelegramResponseParameters } from '@puregram/api'

  export class InputFile {
    constructor (source: Uint8Array | ArrayBuffer, filename: string, options?: { type?: string })
    readonly source: Uint8Array | ArrayBuffer
    readonly filename: string
    readonly type: string | undefined
    readonly size: number
    withName (filename: string): InputFile
  }

  export class BotApiError extends Error {
    readonly code: number
    readonly description: string
    readonly method: string
    readonly parameters?: TelegramResponseParameters
  }

  export class EndpointError extends Error {
    constructor (description: string, parameters?: Record<string, unknown>)
    readonly description: string
    readonly parameters: Record<string, unknown> | undefined
  }

  export class FormData {
    append (name: string, value: string | InputFile): void
    set (name: string, value: string | InputFile): void
    get (name: string): string | InputFile | null
    getAll (name: string): (string | InputFile)[]
    has (name: string): boolean
    delete (name: string): void
    entries (): IterableIterator<[string, string | InputFile]>
    keys (): IterableIterator<string>
    values (): IterableIterator<string | InputFile>
    forEach (callback: (value: string | InputFile, name: string) => void): void
  }

  export interface FileStream {
    file: Omit<TelegramFile, 'file_path'>
    body: AsyncIterable<Uint8Array>
    bodyUsed: boolean
    bytes: () => Promise<Uint8Array>
  }

  type FileTarget = string | { file_id: string }

  export const api: Record<string, (params?: Record<string, unknown>) => Promise<unknown>> & {
    getFileContent: (target: FileTarget) => Promise<Uint8Array>
    getFileStream: (target: FileTarget) => Promise<FileStream>
  }

  export interface RunResult {
    rowsAffected: number
    lastInsertRowid: number
    rows: Record<string, unknown>[]
  }

  type Query = string | object
  type QueryParams = Record<string, unknown> | unknown[]

  export const db: {
    get: (query: Query, params?: QueryParams) => Promise<Record<string, unknown> | null>
    all: (query: Query, params?: QueryParams) => Promise<Record<string, unknown>[]>
    values: (query: Query, params?: QueryParams) => Promise<unknown[][]>
    run: (query: Query, params?: QueryParams) => Promise<RunResult>
  }

  export interface FetchHeaders {
    get (name: string): string | null
    has (name: string): boolean
    keys (): IterableIterator<string>
    entries (): IterableIterator<[string, string]>
  }

  export interface FetchResponse {
    readonly status: number
    readonly statusText: string
    readonly ok: boolean
    readonly url: string
    readonly headers: FetchHeaders
    readonly body: AsyncIterable<Uint8Array>
    json: () => Promise<unknown>
    text: () => Promise<string>
  }

  const fetchBodyBrand: unique symbol

  export interface FetchBody {
    readonly [fetchBodyBrand]: true
  }

  export interface FetchInit {
    method?: string
    headers?: Record<string, string>
    body?: string | Uint8Array | InputFile | FormData | FetchBody
  }

  export const fetch: ((url: string, init?: FetchInit) => Promise<FetchResponse>) & {
    body: {
      json: (value: unknown) => FetchBody
      form: (value: Record<string, string | number | boolean>) => FetchBody
      text: (value: string) => FetchBody
    }
  }
}

declare module 'sdk/api' {
  export { api, BotApiError, InputFile } from 'sdk'
}

declare module 'sdk/fetch' {
  import { fetch } from 'sdk'

  export { fetch, FormData, InputFile } from 'sdk'
  export default fetch
}

declare module 'sdk/db' {
  export interface Column {
    primaryKey: () => this
    notNull: () => this
  }

  export interface Index {
    on: (...columns: Column[]) => this
  }

  export interface Table {
    strict: () => this
    withoutRowid: () => this
    constraint: (sql: string, name?: string) => this
    deprecated: (reason: string) => this
  }

  export function text (name: string): Column
  export function integer (name: string): Column
  export function index (name: string): Index
  export function table<C extends Record<string, Column>> (
    name: string,
    columns: C,
    extras?: (columns: C) => Record<string, Index>
  ): C & Table

  export { db } from 'sdk'
}
