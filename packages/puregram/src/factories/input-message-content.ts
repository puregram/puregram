import type {
  Formattable,
  RichLike,
  TelegramInputContactMessageContent,
  TelegramInputInvoiceMessageContent,
  TelegramInputLocationMessageContent,
  TelegramInputRichMessage,
  TelegramInputRichMessageContent,
  TelegramInputSharedWidgetMessageContent,
  TelegramInputTextMessageContent,
  TelegramInputVenueMessageContent,
  TelegramInputWidgetMessageContent
} from '@puregram/api'

import { type Camelize, unCamelize } from './camelize'

type TextExtras = Camelize<Omit<TelegramInputTextMessageContent, 'message_text'>>
type LocationExtras = Camelize<Omit<TelegramInputLocationMessageContent, 'latitude' | 'longitude'>>
type VenueExtras = Camelize<Omit<TelegramInputVenueMessageContent, 'latitude' | 'longitude' | 'title' | 'address'>>
type ContactExtras = Camelize<Omit<TelegramInputContactMessageContent, 'phone_number' | 'first_name'>>
type InvoiceParams = Camelize<TelegramInputInvoiceMessageContent>
type RichExtras = Camelize<Omit<TelegramInputRichMessage, 'html' | 'markdown'>>
type WidgetExtras = Camelize<Omit<TelegramInputWidgetMessageContent, 'html'>>
type SharedWidgetExtras = Camelize<Omit<TelegramInputSharedWidgetMessageContent, 'widget_id'>>

function richBody (body: { html: string } | { markdown: string }, extras: RichExtras) {
  return { rich_message: { ...body, ...unCamelize(extras) } } as unknown as TelegramInputRichMessageContent
}

const richMarkdown = (markdown: string, extras: RichExtras = {} as RichExtras) => richBody({ markdown }, extras)
const richHtml = (html: string, extras: RichExtras = {} as RichExtras) => richBody({ html }, extras)

/**
 * static factories for `InputMessageContent` payloads used by `InlineQueryResult*`
 *
 * unlike the other Input* families, the variants share no `type` discriminator
 * field — bot api disambiguates structurally (text vs latitude/longitude vs
 * phone_number vs payload). hand-crafted because the codegen pattern can't
 * encode the heterogeneous shape
 *
 * @example
 * ```ts
 * InlineQueryResult.article({
 *   id: '1', title: 't',
 *   content: InputMessageContent.text('hi', { parseMode: 'HTML' })
 * })
 * InlineQueryResult.article({
 *   id: '2', title: 'pin',
 *   content: InputMessageContent.location(55.75, 37.61)
 * })
 * ```
 */
export class InputMessageContent {
  /** rich-message body — pass a `Rich`, or build a dialect string via `.md` / `.markdown` / `.html` */
  static rich = Object.assign(
    (content: RichLike) =>
      ({ rich_message: content.toInputRichMessage() }) as unknown as TelegramInputRichMessageContent,
    {
      /** markdown rich body */
      markdown: richMarkdown,
      /** markdown rich body (alias) */
      md: richMarkdown,
      /** html rich body */
      html: richHtml
    }
  )

  /** text message body */
  static text (text: string | Formattable, params: TextExtras = {} as TextExtras) {
    return { message_text: text, ...unCamelize(params) }
  }

  /** location message body */
  static location (latitude: number, longitude: number, params: LocationExtras = {} as LocationExtras) {
    return { latitude, longitude, ...unCamelize(params) }
  }

  /** venue message body */
  static venue (
    latitude: number,
    longitude: number,
    title: string,
    address: string,
    params: VenueExtras = {} as VenueExtras
  ) {
    return { latitude, longitude, title, address, ...unCamelize(params) }
  }

  /** contact message body */
  static contact (phoneNumber: string, firstName: string, params: ContactExtras = {} as ContactExtras) {
    return { phone_number: phoneNumber, first_name: firstName, ...unCamelize(params) }
  }

  /** invoice message body — too many required fields for a positional form, takes the full param object */
  static invoice (params: InvoiceParams) {
    return unCamelize(params) as unknown as TelegramInputInvoiceMessageContent
  }

  static widget (html: string, params: WidgetExtras = {} as WidgetExtras) {
    return { html, ...unCamelize(params) }
  }

  static sharedWidget (widgetId: string, params: SharedWidgetExtras = {} as SharedWidgetExtras) {
    return { widget_id: widgetId, ...unCamelize(params) }
  }
}
