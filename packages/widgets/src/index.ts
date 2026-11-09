export { codec, json, text } from './codec'
export type { StateCodec } from './codec'

export {
  WidgetHtmlContextError,
  WidgetQueryDataTooLargeError,
  WidgetStateTooLargeError,
  WidgetTooLargeError
} from './errors'

export { escapeHtml, html, js, raw, WidgetHtml, WidgetJs } from './html'
export type { HtmlContext, HtmlValue, WidgetHtmlCheck, WidgetHtmlProblem, WidgetHtmlProblemKind } from './html'

export { WIDGET_LIMITS } from './limits'

export { widgets } from './plugin'
export type { WidgetsOptions } from './plugin'

export { queryData } from './query-data'
export type { QueryData } from './query-data'

export { defineWidget } from './widget'
export type {
  DecodedWidgetState,
  WidgetApi,
  WidgetContentOptions,
  WidgetDefinition,
  WidgetDefinitionOptions,
  WidgetEditSharedOptions,
  WidgetMessageRef,
  WidgetSendSharedOptions,
  WidgetSharedContentOptions,
  WidgetSource,
  WidgetState,
  WidgetStateMethods,
  WidgetTemplate,
  WidgetTemplateOptions
} from './widget'
