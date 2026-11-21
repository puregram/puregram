import {
  hasCaptionEntities, hasEntities, hasMessage, hasPhoto, hasPinnedMessage, hasQuestionEntities,
  type CallbackQueryUpdate, type MessageEntities, type MessageEntity, type MessageUpdate, type Photo,
  type TelegramInaccessibleMessage, type TelegramMessage, type TelegramMessageId, type TelegramUpdate, type UpdateKindMap
} from '@puregram/api'
import type { CollectedMediaGroup, FlowExtension } from '@puregram/flow'
import { AttachmentType, InputMedia, MediaSource, type ApiResponseError, type Telegram } from 'puregram'

declare function expectType<T> (value: T): void

declare const tg: Telegram

declare const incoming: MessageUpdate
declare const callback: CallbackQueryUpdate
declare const inaccessible: TelegramInaccessibleMessage

const reply = await incoming.reply('working')

expectType<number>(reply.id)
expectType<TelegramMessage>(reply.raw)
expectType<Promise<MessageUpdate | true>>(reply.edit('done'))
expectType<Promise<true>>(reply.delete())
expectType<Promise<MessageUpdate>>(tg.send(100, 'working'))
expectType<Promise<MessageUpdate>>(tg.sendPhoto(100, MediaSource.fileId('photo')))
expectType<Promise<MessageUpdate>>(tg.sendMedia(100, InputMedia.photo('photo')))
expectType<Promise<MessageUpdate[]>>(tg.sendMediaGroup(100, [InputMedia.photo('photo'), InputMedia.photo('other')]))
expectType<Promise<MessageUpdate | true>>(callback.edit('done'))
expectType<Promise<MessageUpdate>>(callback.send('ephemeral', { ephemeral: true }))
expectType<Promise<MessageUpdate>>(tg.sendWidget(100, '<b>raw</b>'))
expectType<Promise<MessageUpdate>>(tg.sendSharedWidget(100, 'shared'))
expectType<Promise<MessageUpdate>>(incoming.thread!.replyWithWidget('<b>raw</b>'))
expectType<Promise<TelegramMessage>>(tg.api.sendWidget({ chat_id: 100, html: '<b>raw</b>' }))
expectType<Promise<TelegramMessage>>(tg.api.sendMessage({ chat_id: 100, text: 'raw' }))
expectType<number | undefined>(incoming.updateId)
expectType<TelegramUpdate | undefined>(incoming.update)
expectType<Promise<MessageUpdate>>(incoming.forward(200))
expectType<Promise<TelegramMessageId>>(incoming.copy(200))
expectType<Promise<true>>(tg.sendChatAction(100, 'typing'))
expectType<Promise<TelegramMessageId[]>>(tg.copyMany(100, 200, [7, 8]))
expectType<Promise<TelegramMessageId[]>>(tg.forwardMany(100, 200, [7, 8]))
expectType<Promise<true>>(tg.deleteMany(100, [7, 8]))

declare const suppress: boolean

const photo = InputMedia.photo('photo')
const unsuppressed = await tg.sendMedia(100, photo, { suppress: false })
const suppressed = await tg.sendMedia(100, photo, { suppress: true })
const conditional = await tg.sendMedia(100, photo, { suppress })

expectType<MessageUpdate>(unsuppressed)
// @ts-expect-error
expectType<ApiResponseError>(unsuppressed)
expectType<MessageUpdate | ApiResponseError>(suppressed)
expectType<typeof suppressed>(incoming)
// @ts-expect-error
expectType<MessageUpdate>(suppressed)
expectType<MessageUpdate | ApiResponseError>(conditional)
expectType<typeof conditional>(incoming)
// @ts-expect-error
expectType<MessageUpdate>(conditional)

if (callback.hasAccessibleMessage()) {
  expectType<Promise<MessageUpdate>>(callback.message.reply('reply'))
}

if (callback.hasMessage()) {
  expectType<MessageUpdate | TelegramInaccessibleMessage>(callback.message)
  expectType<typeof callback.message>(inaccessible)
  expectType<typeof callback.message>(incoming)
}

if (incoming.hasPinnedMessage()) {
  expectType<MessageUpdate | TelegramInaccessibleMessage>(incoming.pinnedMessage)
  expectType<typeof incoming.pinnedMessage>(inaccessible)
  expectType<typeof incoming.pinnedMessage>(incoming)
}

tg.onCallbackQuery(hasMessage, (query) => {
  expectType<MessageUpdate | TelegramInaccessibleMessage>(query.message)
  expectType<typeof query.message>(inaccessible)
  expectType<typeof query.message>(incoming)
})

tg.onMessage(hasPinnedMessage, (message) => {
  expectType<MessageUpdate | TelegramInaccessibleMessage>(message.pinnedMessage)
  expectType<typeof message.pinnedMessage>(inaccessible)
  expectType<typeof message.pinnedMessage>(incoming)
})

if (incoming.hasAttachmentType(AttachmentType.Photo)) {
  expectType<Photo>(incoming.attachment)
  expectType<string>(incoming.attachment.biggest.fileId)
}

if (incoming.hasEntities()) {
  expectType<string | undefined>(incoming.entities.only('pre').where({ language: 'js' }).first?.language)
}

if (incoming.hasCaptionEntities()) {
  expectType<MessageEntities>(incoming.captionEntities)
}

tg.onMessage(hasEntities, (message) => {
  expectType<MessageEntities>(message.entities.only('pre'))

  if (message.entities.first) {
    expectType<MessageEntity[]>(message.entities.with(0, message.entities.first))
  }
})

tg.onMessage(hasCaptionEntities, (message) => {
  expectType<MessageEntities>(message.captionEntities.where({ type: 'code' }))
})

tg.onPoll(hasQuestionEntities, (poll) => {
  expectType<MessageEntities>(poll.questionEntities)
})

tg.onMessage(hasPhoto, (message) => {
  expectType<Photo>(message.photo)
  expectType<string>(message.photo.biggest.fileId)
})

declare const flow: FlowExtension

expectType<Promise<CollectedMediaGroup>>(flow.collectMediaGroup(incoming))
expectType<Promise<CollectedMediaGroup>>(incoming.flow.collectMediaGroup())

declare const messageFamily: UpdateKindMap[
  'channel_post' | 'edited_channel_post' | 'business_message' | 'edited_business_message' | 'new_chat_members'
]
declare const widget: UpdateKindMap['widget_query']
declare const sharedWidget: UpdateKindMap['shared_widget_query']

expectType<Promise<CollectedMediaGroup>>(flow.collectMediaGroup(messageFamily))
expectType<Promise<CollectedMediaGroup>>(messageFamily.flow.collectMediaGroup())
expectType<Promise<MessageUpdate | null>>(widget.flow.waitFor('message'))
expectType<Promise<MessageUpdate | null>>(sharedWidget.flow.waitFor('message'))
expectType<Promise<MessageUpdate | null>>(callback.flow.waitFor('message'))

// @ts-expect-error
flow.collectMediaGroup(widget)
// @ts-expect-error
widget.flow.collectMediaGroup()
// @ts-expect-error
flow.collectMediaGroup(sharedWidget)
// @ts-expect-error
sharedWidget.flow.collectMediaGroup()
// @ts-expect-error
flow.collectMediaGroup(callback)
// @ts-expect-error
callback.flow.collectMediaGroup()
