import type { TelegramResponseParameters } from '@puregram/api'

export interface TelegramErrorOptions {
  error_code: number
  description: string
  cause?: unknown
}

export class TelegramError extends Error {
  readonly code: number
  readonly cause?: unknown

  constructor (options: TelegramErrorOptions) {
    super(options.description)
    this.code = options.error_code

    if (options.cause !== undefined) {
      this.cause = options.cause
    }

    this.name = this.constructor.name
    Error.captureStackTrace?.(this, this.constructor)
  }

  toJSON () {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      cause: this.cause
    }
  }
}

export interface ApiResponseError {
  ok: false
  error_code: number
  description: string
  parameters?: TelegramResponseParameters
}

export class ApiError extends TelegramError {
  readonly parameters?: TelegramResponseParameters

  constructor (response: ApiResponseError) {
    super({ error_code: response.error_code, description: response.description })

    if (response.parameters !== undefined) {
      this.parameters = response.parameters
    }
  }
}
