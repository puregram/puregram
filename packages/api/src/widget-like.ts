import type { SendWidgetParams } from './generated/methods'
import type { TelegramInputWidgetMessageContent } from './generated/types'

export interface WidgetOptions<C = unknown, P = unknown> {
  chat?: C | null | undefined
  public?: P | null | undefined
  allowQueries?: boolean
  shared?: boolean
}

export interface WidgetLike<C = unknown, P = unknown> {
  content: (options?: WidgetOptions<C, P> & Omit<SendWidgetParams, 'chat_id' | 'html'>) => TelegramInputWidgetMessageContent
}

export type WidgetInput = string | WidgetLike<never, never>

export type WidgetSendOptions<W extends WidgetInput> = W extends WidgetLike<infer C, infer P>
  ? Omit<SendWidgetParams, 'chat_id' | 'html' | 'chat_data' | 'public_data' | 'allow_queries' | 'is_shared'> & WidgetOptions<C, P>
  : Omit<SendWidgetParams, 'chat_id' | 'html'>

export function widgetSendParams (widget: WidgetInput, params?: object) {
  return typeof widget === 'string'
    ? { ...params, html: widget }
    : widget.content(params as WidgetOptions<never, never>)
}
