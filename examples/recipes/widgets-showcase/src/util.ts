import type { WidgetQueryUpdate } from 'puregram'

export const commandArgs = (message: { text?: string | undefined, match?: RegExpMatchArray | undefined }) =>
  message.text?.slice(message.match?.[0].length ?? 0).trim() ?? ''

export const chatMessageKey = (chatId: number, messageId: number) => `${chatId}:${messageId}`

export const messageKey = (query: WidgetQueryUpdate) =>
  query.inlineMessageId ?? chatMessageKey(query.chat?.id ?? 0, query.raw.message_id ?? 0)
