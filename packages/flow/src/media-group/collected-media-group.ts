import type { CopyMessagesParams, ForwardMessagesParams } from '@puregram/api'

import { isMediaGroupKind, type MediaGroupMessage } from '../augment/extractors'

export class CollectedMediaGroup extends Array<MediaGroupMessage> {
  static get [Symbol.species] () {
    return Array
  }

  get contexts () {
    return this
  }

  async forward (
    toChat: number | string,
    params: Omit<ForwardMessagesParams, 'chat_id' | 'from_chat_id' | 'message_ids'> = {}
  ) {
    const { first, messageIds } = this.source('forward')

    return first.tg.api.forwardMessages({
      ...params,
      chat_id: toChat,
      from_chat_id: first.raw.chat.id,
      message_ids: messageIds
    })
  }

  async copy (
    toChat: number | string,
    params: Omit<CopyMessagesParams, 'chat_id' | 'from_chat_id' | 'message_ids'> = {}
  ) {
    const { first, messageIds } = this.source('copy')

    return first.tg.api.copyMessages({
      ...params,
      chat_id: toChat,
      from_chat_id: first.raw.chat.id,
      message_ids: messageIds
    })
  }

  async delete () {
    const { first, messageIds } = this.source('delete')
    const connection = first.raw.business_connection_id

    if (connection !== undefined) {
      return first.tg.api.deleteBusinessMessages({ business_connection_id: connection, message_ids: messageIds })
    }

    return first.tg.api.deleteMessages({ chat_id: first.raw.chat.id, message_ids: messageIds })
  }

  private source (operation: 'forward' | 'copy' | 'delete') {
    const first = this[0]

    if (first === undefined) {
      throw new TypeError('Cannot operate on an empty collected media group')
    }

    const ids = new Set<number>()

    for (const message of this) {
      if (!isMediaGroupKind(message.kind)) {
        throw new TypeError('Collected media group requires message updates')
      }

      const connection = message.raw.business_connection_id

      if ((message.kind === 'business_message' || message.kind === 'edited_business_message') && connection === undefined) {
        throw new TypeError('Missing business connection on collected business message')
      }

      if (message.tg !== first.tg ||
        message.raw.chat.id !== first.raw.chat.id ||
        connection !== first.raw.business_connection_id) {
        throw new TypeError('Collected media group messages must share a client, chat and business connection')
      }

      ids.add(message.raw.message_id)
    }

    if (operation !== 'delete' && first.raw.business_connection_id !== undefined) {
      throw new TypeError(`Cannot ${operation} a collected business media group`)
    }

    return { first, messageIds: [...ids].sort((a, b) => a - b) }
  }
}
