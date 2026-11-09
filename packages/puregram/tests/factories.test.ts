import { describe, it, expect } from 'vitest'

import {
  BotCommands,
  ChatAdministratorRights,
  ChatPermissions,
  InlineQueryResult,
  InputMedia,
  InputMessageContent,
  InputPollOption,
  InputSticker,
  Invoice,
  LabeledPrice,
  LinkPreview,
  MediaGroup,
  MediaSource,
  MenuButton,
  Reaction,
  ReplyParameters,
  ShippingOption
} from '../src'

describe('InputMedia', () => {
  it('photo factory takes positional media', () => {
    const r = InputMedia.photo('attach://x')

    expect(r).toEqual({ type: 'photo', media: 'attach://x' })
  })

  it('photo factory accepts caption in params', () => {
    const r = InputMedia.photo('attach://x', { caption: 'hi' })

    expect(r).toEqual({ type: 'photo', media: 'attach://x', caption: 'hi' })
  })

  it('photo factory accepts a MediaInput envelope', () => {
    const m = MediaSource.fileId('cat')
    const r = InputMedia.photo(m)

    expect(r.type).toBe('photo')
    expect(r.media).toBe(m as unknown as string)
  })

  it('sticker synthetic variant', () => {
    const m = MediaSource.fileId('cat')
    const r = InputMedia.sticker(m)

    expect(r.type).toBe('sticker')
    expect(r.media).toBe(m)
  })

  it('videoNote and voice synthetic variants', () => {
    expect(InputMedia.videoNote('attach://vn').type).toBe('video_note')
    expect(InputMedia.voice('attach://v').type).toBe('voice')
  })
})

describe('InlineQueryResult', () => {
  it('article translates content → input_message_content on the wire', () => {
    const r = InlineQueryResult.article({
      id: '1',
      title: 't',
      content: InputMessageContent.text('hi')
    })

    expect(r.type).toBe('article')
    expect(r.input_message_content).toEqual({ message_text: 'hi' })
  })

  it('article translates replyMarkup → reply_markup on the wire', () => {
    const r = InlineQueryResult.article({
      id: '1',
      title: 't',
      content: InputMessageContent.text('hi'),
      replyMarkup: { inline_keyboard: [[{ text: 'go', callback_data: 'g' }]] }
    })

    expect(r.reply_markup).toEqual({ inline_keyboard: [[{ text: 'go', callback_data: 'g' }]] })
  })

  it('article translates thumbnail.url/width/height → flat thumbnail_* fields', () => {
    const r = InlineQueryResult.article({
      id: '1',
      title: 't',
      content: InputMessageContent.text('hi'),
      thumbnail: { url: 'https://x/i.png', width: 100, height: 100 }
    })

    expect(r.thumbnail_url).toBe('https://x/i.png')
    expect(r.thumbnail_width).toBe(100)
    expect(r.thumbnail_height).toBe(100)
  })

  it('gif translates thumbnail.mimeType → thumbnail_mime_type', () => {
    const r = InlineQueryResult.gif({
      id: '1',
      gif_url: 'https://x/g.gif',
      thumbnail: { url: 'https://x/t.jpg', mimeType: 'video/mp4' }
    })

    expect(r.thumbnail_url).toBe('https://x/t.jpg')
    expect(r.thumbnail_mime_type).toBe('video/mp4')
  })

  it('cached variants translate content/replyMarkup the same way', () => {
    const r = InlineQueryResult.cached.audio({
      id: '1',
      audio_file_id: 'fid',
      content: InputMessageContent.text('caption'),
      replyMarkup: { inline_keyboard: [] }
    })

    expect(r).toEqual({
      type: 'audio',
      id: '1',
      audio_file_id: 'fid',
      input_message_content: { message_text: 'caption' },
      reply_markup: { inline_keyboard: [] }
    })
  })

  it('builds a results button', () => {
    const r = InlineQueryResult.button('open', { start_parameter: 'go' })

    expect(r).toEqual({ text: 'open', start_parameter: 'go' })
  })
})

describe('InputMessageContent', () => {
  it('text wraps message_text', () => {
    expect(InputMessageContent.text('hi', { parse_mode: 'HTML' }))
      .toEqual({ message_text: 'hi', parse_mode: 'HTML' })
  })

  it('location wraps lat/lng', () => {
    expect(InputMessageContent.location(55, 37, { horizontal_accuracy: 5 }))
      .toEqual({ latitude: 55, longitude: 37, horizontal_accuracy: 5 })
  })

  it('venue takes positional lat/lng/title/address', () => {
    expect(InputMessageContent.venue(55.75, 37.61, 'Red Square', 'Moscow', { foursquare_id: 'x' }))
      .toEqual({
        latitude: 55.75, longitude: 37.61, title: 'Red Square', address: 'Moscow', foursquare_id: 'x'
      })
  })

  it('contact takes positional phoneNumber/firstName', () => {
    expect(InputMessageContent.contact('+10000000000', 'Demo', { last_name: 'User' }))
      .toEqual({ phone_number: '+10000000000', first_name: 'Demo', last_name: 'User' })
  })
})

describe('ReplyParameters', () => {
  it('to references a same-chat message', () => {
    expect(ReplyParameters.to(42)).toEqual({ message_id: 42 })
  })

  it('cross targets a different chat', () => {
    expect(ReplyParameters.cross(-100, 42, { allow_sending_without_reply: true }))
      .toEqual({ message_id: 42, chat_id: -100, allow_sending_without_reply: true })
  })

  it('quote attaches a quote excerpt', () => {
    expect(ReplyParameters.quote(7, 'why?')).toEqual({ message_id: 7, quote: 'why?' })
  })
})

describe('LinkPreview', () => {
  it('disabled produces is_disabled', () => {
    expect(LinkPreview.disabled()).toEqual({ is_disabled: true })
  })

  it('large prefers large media', () => {
    expect(LinkPreview.large('https://x'))
      .toEqual({ url: 'https://x', prefer_large_media: true })
  })

  it('small prefers small media', () => {
    expect(LinkPreview.small('https://x', { show_above_text: true }))
      .toEqual({ url: 'https://x', prefer_small_media: true, show_above_text: true })
  })
})

describe('Reaction', () => {
  it('emoji wraps an emoji', () => {
    expect(Reaction.emoji('👍')).toEqual({ type: 'emoji', emoji: '👍' })
  })

  it('customEmoji wraps an id', () => {
    expect(Reaction.customEmoji('abc')).toEqual({ type: 'custom_emoji', custom_emoji_id: 'abc' })
  })

  it('paid emits paid type', () => {
    expect(Reaction.paid()).toEqual({ type: 'paid' })
  })
})

describe('ChatPermissions', () => {
  it('allowAll fills every permission with true', () => {
    const r = ChatPermissions.allowAll()

    expect(r.can_send_messages).toBe(true)
    expect(r.can_pin_messages).toBe(true)
    expect(r.can_manage_topics).toBe(true)
  })

  it('denyAll fills every permission with false', () => {
    const r = ChatPermissions.denyAll()

    expect(r.can_send_messages).toBe(false)
    expect(r.can_pin_messages).toBe(false)
  })

  it('overrides are applied last', () => {
    const r = ChatPermissions.denyAll({ can_send_messages: true })

    expect(r.can_send_messages).toBe(true)
    expect(r.can_pin_messages).toBe(false)
  })
})

describe('ChatAdministratorRights', () => {
  it('allowAll includes optional channel/group fields', () => {
    const r = ChatAdministratorRights.allowAll()

    expect(r.can_manage_chat).toBe(true)
    expect(r.is_anonymous).toBe(true)
    expect(r.can_pin_messages).toBe(true)
  })

  it('denyAll omits optional fields', () => {
    const r = ChatAdministratorRights.denyAll()

    expect(r.can_manage_chat).toBe(false)
    expect(r.is_anonymous).toBe(false)
    expect(r.can_pin_messages).toBeUndefined()
  })
})

describe('InputPollOption', () => {
  it('text wraps the option text', () => {
    expect(InputPollOption.text('first')).toEqual({ text: 'first' })
  })

  it('maps friendly extras onto bot-api fields', () => {
    expect(InputPollOption.text('first', { parseMode: 'HTML' }))
      .toEqual({ text: 'first', text_parse_mode: 'HTML' })

    const entities = [{ type: 'bold' as const, offset: 0, length: 5 }]

    expect(InputPollOption.text('first', { entities }))
      .toEqual({ text: 'first', text_entities: entities })
  })
})

describe('InputSticker', () => {
  it('static fills format=static', () => {
    expect(InputSticker.static('attach://cat.webp', ['🐱']))
      .toEqual({ sticker: 'attach://cat.webp', format: 'static', emoji_list: ['🐱'] })
  })

  it('animated fills format=animated and accepts keywords', () => {
    expect(InputSticker.animated('attach://x', ['x'], { keywords: ['k'] }))
      .toEqual({ sticker: 'attach://x', format: 'animated', emoji_list: ['x'], keywords: ['k'] })
  })

  it('video fills format=video', () => {
    expect(InputSticker.video('attach://x', ['x']).format).toBe('video')
  })
})

describe('LabeledPrice', () => {
  it('of wraps label and amount', () => {
    expect(LabeledPrice.of('apple', 145)).toEqual({ label: 'apple', amount: 145 })
  })
})

describe('ShippingOption', () => {
  it('of assembles id/title/prices', () => {
    expect(ShippingOption.of('s', 'Standard', [LabeledPrice.of('ship', 500)]))
      .toEqual({ id: 's', title: 'Standard', prices: [{ label: 'ship', amount: 500 }] })
  })
})

describe('BotCommands', () => {
  it('command builds a single entry', () => {
    expect(BotCommands.command('start', 'start the bot'))
      .toEqual({ command: 'start', description: 'start the bot' })
  })

  it('scope.default returns default type', () => {
    expect(BotCommands.scope.default()).toEqual({ type: 'default' })
  })

  it('scope.chat targets a chat id', () => {
    expect(BotCommands.scope.chat(123)).toEqual({ type: 'chat', chat_id: 123 })
  })

  it('scope.chatMember targets a user in a chat', () => {
    expect(BotCommands.scope.chatMember(1, 2))
      .toEqual({ type: 'chat_member', chat_id: 1, user_id: 2 })
  })
})

describe('MediaGroup', () => {
  it('photos applies caption to first item by default', () => {
    const r = MediaGroup.photos(['a', 'b', 'c'], { caption: 'hello' })

    expect(r).toEqual([
      { type: 'photo', media: 'a', caption: 'hello' },
      { type: 'photo', media: 'b' },
      { type: 'photo', media: 'c' }
    ])
  })

  it('photos respects captionIndex', () => {
    const r = MediaGroup.photos(['a', 'b', 'c'], { caption: 'mid', captionIndex: 1 })

    expect(r[0]).toEqual({ type: 'photo', media: 'a' })
    expect(r[1]).toEqual({ type: 'photo', media: 'b', caption: 'mid' })
    expect(r[2]).toEqual({ type: 'photo', media: 'c' })
  })

  it('photos with no caption attaches none', () => {
    const r = MediaGroup.photos(['a', 'b'])

    expect(r).toEqual([
      { type: 'photo', media: 'a' },
      { type: 'photo', media: 'b' }
    ])
  })

  it('videos/documents/audios pick the right type', () => {
    expect(MediaGroup.videos(['x']).every(i => i.type === 'video')).toBe(true)
    expect(MediaGroup.documents(['x']).every(i => i.type === 'document')).toBe(true)
    expect(MediaGroup.audios(['x']).every(i => i.type === 'audio')).toBe(true)
  })

  it('accepts MediaInput envelopes alongside strings', () => {
    const m = MediaSource.fileId('cat')
    const r = MediaGroup.photos([m, 'attach://x'], { caption: 'mixed' })

    expect(r[0]?.media).toBe(m as unknown as string)
    expect(r[0]?.caption).toBe('mixed')
    expect(r[1]?.media).toBe('attach://x')
  })
})

describe('MenuButton', () => {
  it('default returns default type', () => {
    expect(MenuButton.default()).toEqual({ type: 'default' })
  })

  it('commands returns commands type', () => {
    expect(MenuButton.commands()).toEqual({ type: 'commands' })
  })

  it('webApp wraps text + url', () => {
    expect(MenuButton.webApp('open', 'https://example.com'))
      .toEqual({ type: 'web_app', text: 'open', web_app: { url: 'https://example.com' } })
  })
})

describe('Invoice', () => {
  it('fiat builds a snake_case body and camel→snake the optional fields', () => {
    const body = Invoice.fiat({
      title: 'Coffee',
      description: 'a good cup',
      payload: 'order_42',
      providerToken: 'PROVIDER',
      currency: 'EUR',
      prices: [LabeledPrice.of('cup', 500)],
      isFlexible: true,
      maxTipAmount: 100,
      photoUrl: 'https://x/p.png'
    })

    expect(body).toEqual({
      title: 'Coffee',
      description: 'a good cup',
      payload: 'order_42',
      provider_token: 'PROVIDER',
      currency: 'EUR',
      prices: [{ label: 'cup', amount: 500 }],
      is_flexible: true,
      max_tip_amount: 100,
      photo_url: 'https://x/p.png'
    })
  })

  it('stars pins currency to XTR and sends an empty provider token', () => {
    const body = Invoice.stars({
      title: 'Pro plan',
      description: 'monthly',
      payload: 'sub_pro',
      prices: [LabeledPrice.of('1 month', 250)],
      subscriptionPeriod: 2592000
    })

    expect(body).toEqual({
      title: 'Pro plan',
      description: 'monthly',
      payload: 'sub_pro',
      prices: [{ label: '1 month', amount: 250 }],
      subscription_period: 2592000,
      currency: 'XTR',
      provider_token: ''
    })
  })

  it('stars without a subscription period omits it', () => {
    const body = Invoice.stars({
      title: 'Tip',
      description: 'thanks',
      payload: 'tip_1',
      prices: [LabeledPrice.of('tip', 50)]
    })

    expect(body).toEqual({
      title: 'Tip',
      description: 'thanks',
      payload: 'tip_1',
      prices: [{ label: 'tip', amount: 50 }],
      currency: 'XTR',
      provider_token: ''
    })
  })
})

describe('Bot API 10.4 content factories', () => {
  it('builds widget content with official camelCase extras', () => {
    expect(InputMessageContent.widget('<b>hello</b>', {
      width: 240,
      height: 120,
      publicData: '{"count":1}',
      chatData: '{}',
      allowQueries: true,
      isShared: true,
      showCaptionAboveMedia: true
    })).toEqual({
      html: '<b>hello</b>',
      width: 240,
      height: 120,
      public_data: '{"count":1}',
      chat_data: '{}',
      allow_queries: true,
      is_shared: true,
      show_caption_above_media: true
    })
  })

  it('builds shared widget content with string identifiers', () => {
    expect(InputMessageContent.sharedWidget('9007199254740993', {
      chatData: '{}',
      caption: 'hello',
      parseMode: 'HTML'
    })).toEqual({
      widget_id: '9007199254740993',
      chat_data: '{}',
      caption: 'hello',
      parse_mode: 'HTML'
    })
  })

  it('preserves rich quote text in all reply factories', () => {
    const quoteRichTexts = [{ type: 'bold' as const, text: 'hello' }]

    expect(ReplyParameters.quote(1, 'hello', { quoteRichTexts })).toEqual({
      message_id: 1, quote: 'hello', quote_rich_texts: quoteRichTexts
    })
    expect(ReplyParameters.to(1, { quoteRichTexts })).toEqual({
      message_id: 1, quote_rich_texts: quoteRichTexts
    })
    expect(ReplyParameters.cross(2, 1, { quoteRichTexts })).toEqual({
      chat_id: 2, message_id: 1, quote_rich_texts: quoteRichTexts
    })
  })
})
