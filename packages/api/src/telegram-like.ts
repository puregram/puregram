import type { Readable } from 'node:stream'

import type { ApiMethods } from './generated/api-methods'
import type { SendChatActionParams } from './generated/methods'
import type { TelegramPhotoSize, TelegramUser } from './generated/types'

/** timing options for an action controller */
export interface ActionControllerOptions {
  /**
   * interval between `sendChatAction` calls, in milliseconds
   * @default 5000
   */
  interval?: number

  /**
   * initial delay before the first `sendChatAction` call, in milliseconds
   * @default 0
   */
  wait?: number

  /**
   * stop the loop after this many milliseconds; `0` disables the timeout
   * @default 0
   */
  timeout?: number
}

/** action controller options plus any extra `sendChatAction` params (e.g. `message_thread_id`) */
export type ActionControllerParams = ActionControllerOptions & Omit<SendChatActionParams, 'chat_id' | 'action'>

/** structural shape of the controller returned by `createActionController` */
export interface ActionControllerLike {
  /** the chat action being sent — mutable while the loop runs */
  action: SendChatActionParams['action']
  /** interval between calls, in milliseconds */
  interval: number
  /** initial delay before the first call, in milliseconds */
  wait: number
  /** timeout in milliseconds; `0` disables it */
  timeout: number
  /** whether the loop is currently running */
  readonly started: boolean
  /** start the `sendChatAction(action)` loop until `stop()` is called */
  start: () => void
  /** stop the loop */
  stop: () => void
}

/**
 * structural target for `tg.download(...)` — matches what update-class extras
 * produce. the public `DownloadTarget` in `puregram` is wider (adds
 * `MediaSourceFileId` and `Photo`)
 */
export type DownloadableLike =
  | string
  | { file_id: string, file_path?: string | undefined }
  | { fileId: string, filePath?: string | undefined }
  | TelegramPhotoSize[]

export interface TelegramLike {
  readonly api: {
    [K in keyof ApiMethods]: ApiMethods[K] extends (...args: infer A) => infer R
      ? (...args: A) => R
      : never
  } & {
    call: (method: string, params?: Record<string, unknown>) => Promise<unknown>
  }

  /** the bot's own identity — resolved via `getMe` (or the `bot` option) before dispatch starts */
  readonly bot: TelegramUser

  download: (target: DownloadableLike) => Promise<Uint8Array>
  downloadStream: (target: DownloadableLike) => Promise<Readable>
  downloadIterable: (target: DownloadableLike) => Promise<AsyncIterable<Uint8Array>>
  downloadToFile: (path: string, target: DownloadableLike) => Promise<void>
  getFileURL: (target: DownloadableLike) => Promise<string>

  createActionController: (chatId: number | string, action: SendChatActionParams['action'], options?: ActionControllerParams) => ActionControllerLike
  withChatAction: <T>(chatId: number | string, action: SendChatActionParams['action'], fn: () => Promise<T> | T, options?: ActionControllerParams) => Promise<T>
}
