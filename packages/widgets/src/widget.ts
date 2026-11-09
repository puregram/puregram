import type {
  ApiMethods,
  EditSharedWidgetDataParams,
  SendSharedWidgetParams,
  TelegramInputSharedWidgetMessageContent,
  TelegramInputWidgetMessageContent,
  TelegramMessage,
  TelegramWidget,
  WidgetLike
} from '@puregram/api'
import { Widget, WidgetQueryUpdate } from '@puregram/api'

import { json, type StateCodec } from './codec'
import type { WidgetHtml } from './html'
import { WIDGET_LIMITS } from './limits'

export interface WidgetApi {
  readonly api: Pick<
    ApiMethods,
    'sendWidget' | 'sendSharedWidget' | 'editMessageWidgetData' | 'editSharedWidgetData'
  >
}

export interface WidgetDefinitionOptions<C, P> {
  html: WidgetHtml
  chat?: StateCodec<C>
  public?: StateCodec<P>
}

export interface WidgetTemplateOptions<C, P, A> {
  html: (args: A) => WidgetHtml
  chat?: StateCodec<C>
  public?: StateCodec<P>
}

export interface WidgetState<C, P> {
  chat?: C | null | undefined
  public?: P | null | undefined
}

type ManagedParams = 'html' | 'chat_data' | 'public_data' | 'allow_queries' | 'is_shared'

export interface WidgetContentOptions<C, P>
  extends WidgetState<C, P>, Omit<TelegramInputWidgetMessageContent, ManagedParams> {
  allowQueries?: boolean
  shared?: boolean
}

export interface WidgetSendSharedOptions<C> extends Omit<SendSharedWidgetParams, 'chat_id' | 'widget_id' | 'chat_data'> {
  chat?: C | null | undefined
}

export interface WidgetSharedContentOptions<C>
  extends Omit<TelegramInputSharedWidgetMessageContent, 'widget_id' | 'chat_data'> {
  chat?: C | null | undefined
}

export interface WidgetEditSharedOptions {
  cacheTime?: number
}

export type WidgetMessageRef =
  | { chat_id: number | string, message_id: number }
  | { inline_message_id: string }
  | WidgetQueryUpdate

export interface WidgetSource {
  readonly widget?: Widget | TelegramWidget | undefined
}

export interface DecodedWidgetState<C, P> {
  chat: C | null
  public: P | null
}

export interface WidgetStateMethods<C = unknown, P = unknown> {
  readonly chatCodec: StateCodec<C>
  readonly publicCodec: StateCodec<P>
  sendShared: (
    holder: WidgetApi,
    chatId: number | string,
    widgetId: string,
    options?: WidgetSendSharedOptions<C>
  ) => Promise<TelegramMessage>
  sharedContent: (widgetId: string, options?: WidgetSharedContentOptions<C>) => TelegramInputSharedWidgetMessageContent
  editState: (holder: WidgetApi, target: WidgetMessageRef, state: WidgetState<C, P>) => Promise<boolean>
  editShared: (
    holder: WidgetApi,
    widgetId: string,
    value: P | null,
    options?: WidgetEditSharedOptions
  ) => Promise<true>
  decode: (source: WidgetSource) => DecodedWidgetState<C, P>
}

export interface WidgetDefinition<C = unknown, P = unknown> extends WidgetStateMethods<C, P>, WidgetLike<C, P> {
  readonly html: WidgetHtml
  content: (options?: WidgetContentOptions<C, P>) => TelegramInputWidgetMessageContent
}

export interface WidgetTemplate<C = unknown, P = unknown, A = never> extends WidgetStateMethods<C, P> {
  render: (args: A) => WidgetDefinition<C, P>
}

const NOT_MODIFIED = /message is not modified/i

async function unlessNotModified (call: Promise<true>) {
  try {
    await call

    return true
  } catch (error) {
    if (error instanceof Error && NOT_MODIFIED.test(error.message)) {
      return false
    }

    throw error
  }
}

function resolveRef (target: WidgetMessageRef) {
  if (!(target instanceof WidgetQueryUpdate)) {
    return target
  }

  const raw = target.raw

  if (raw.inline_message_id !== undefined) {
    return { inline_message_id: raw.inline_message_id }
  }

  if (raw.chat !== undefined && raw.message_id !== undefined) {
    return { chat_id: raw.chat.id, message_id: raw.message_id }
  }

  throw new TypeError('widget query carries neither chat + message_id nor inline_message_id')
}

function assertCacheTime (cacheTime: number) {
  const { cacheTimeMin } = WIDGET_LIMITS

  if (!Number.isInteger(cacheTime) || cacheTime < cacheTimeMin) {
    throw new RangeError(`cache_time must be an integer at least ${cacheTimeMin}, got ${cacheTime}`)
  }
}

function flags (allowQueries: boolean | undefined, shared: boolean | undefined) {
  const params: { allow_queries?: boolean, is_shared?: boolean } = {}

  if (allowQueries !== undefined) {
    params.allow_queries = allowQueries
  }

  if (shared !== undefined) {
    params.is_shared = shared
  }

  return params
}

function stateParams<C, P> (methods: WidgetStateMethods<C, P>, state: WidgetState<C, P>) {
  const params: { chat_data?: string, public_data?: string } = {}

  if (state.chat !== undefined) {
    params.chat_data = methods.chatCodec.encode(state.chat)
  }

  if (state.public !== undefined) {
    params.public_data = methods.publicCodec.encode(state.public)
  }

  return params
}

function stateMethods<C, P> (chatCodec: StateCodec<C>, publicCodec: StateCodec<P>) {
  const methods: WidgetStateMethods<C, P> = {
    chatCodec,
    publicCodec,

    sendShared: (holder, chatId, widgetId, sendOptions = {}) => {
      const { chat, ...rest } = sendOptions

      return holder.api.sendSharedWidget({
        ...rest,
        chat_id: chatId,
        widget_id: widgetId,
        ...stateParams(methods, { chat })
      })
    },

    sharedContent: (widgetId, contentOptions = {}) => {
      const { chat, ...rest } = contentOptions

      return { ...rest, widget_id: widgetId, ...stateParams(methods, { chat }) }
    },

    editState: (holder, target, state) =>
      unlessNotModified(holder.api.editMessageWidgetData({ ...resolveRef(target), ...stateParams(methods, state) })),

    editShared: (holder, widgetId, value, editOptions = {}) => {
      const params: EditSharedWidgetDataParams = { widget_id: widgetId, public_data: publicCodec.encode(value) }

      if (editOptions.cacheTime !== undefined) {
        assertCacheTime(editOptions.cacheTime)
        params.cache_time = editOptions.cacheTime
      }

      return holder.api.editSharedWidgetData(params)
    },

    decode: (source) => {
      const widget = source.widget
      const raw = widget instanceof Widget ? widget.raw : widget

      return {
        chat: chatCodec.decode(raw?.chat_data),
        public: publicCodec.decode(raw?.public_data)
      }
    }
  }

  return methods
}

function bindHtml<C, P> (html: WidgetHtml, methods: WidgetStateMethods<C, P>) {
  let fits = false

  const ensureFits = () => {
    if (!fits) {
      html.assertFits()
      fits = true
    }
  }

  const definition: WidgetDefinition<C, P> = {
    ...methods,
    html,

    content: (contentOptions = {}) => {
      ensureFits()

      const { chat, public: publicValue, allowQueries, shared, ...rest } = contentOptions
      const content: TelegramInputWidgetMessageContent = {
        html: html.source,
        ...rest,
        ...stateParams(methods, { chat, public: publicValue }),
        ...flags(allowQueries, shared)
      }

      return content
    }
  }

  return definition
}

export function defineWidget<C = unknown, P = unknown> (options: WidgetDefinitionOptions<C, P>): WidgetDefinition<C, P>
export function defineWidget<C = unknown, P = unknown, A = never> (
  options: WidgetTemplateOptions<C, P, A>
): WidgetTemplate<C, P, A>
export function defineWidget<C, P, A> (options: WidgetDefinitionOptions<C, P> | WidgetTemplateOptions<C, P, A>) {
  const { html } = options
  const methods = stateMethods(options.chat ?? json<C>(), options.public ?? json<P>())

  if (typeof html === 'function') {
    const template: WidgetTemplate<C, P, A> = {
      ...methods,
      render: args => bindHtml(html(args), methods)
    }

    return template
  }

  return bindHtml(html, methods)
}
