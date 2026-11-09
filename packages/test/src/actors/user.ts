import type { TelegramWidgetQueryType } from '@puregram/api'
import type { Telegram } from 'puregram'

import { MembershipRequired } from '../errors'
import type { World } from '../world/world'

import type { ChatMembership } from './chat'
import { TestChat } from './chat'
import { allocateUserId } from './identity'
import type { ActorMediaInput } from './media-input'
import { resolveMedia } from './media-input'
import { TestMessage } from './message'
import { TestUserInChat, TestUserOnMessage } from './scopes'

export interface CreateUserOptions {
  id?: number
  first_name?: string
  last_name?: string
  username?: string
  language_code?: string
}

type MediaField =
  | 'photo'
  | 'document'
  | 'video'
  | 'audio'
  | 'voice'
  | 'animation'
  | 'video_note'
  | 'sticker'

interface MediaOpts {
  caption?: string
}

interface LatLon {
  latitude: number
  longitude: number
}

interface Venue extends LatLon {
  title: string
  address: string
}

interface Contact {
  phone_number: string
  first_name: string
  last_name?: string
}

interface Poll {
  question: string
  options: string[]
}

interface MediaGroupItem {
  type: 'photo' | 'video'
  media: ActorMediaInput
  caption?: string
}

export class TestUser {
  readonly id: number
  readonly is_bot = false
  readonly first_name: string
  readonly last_name: string | undefined
  readonly username: string | undefined
  language_code: string | undefined
  readonly pmChat: TestChat

  private readonly world: World
  private readonly inject: (raw: Record<string, unknown>) => Promise<void>
  private readonly strictMembership: boolean

  constructor (init: {
    tg: Telegram
    world: World
    inject: (raw: Record<string, unknown>) => Promise<void>
    options: CreateUserOptions
    strictMembership?: boolean
  }) {
    this.world = init.world
    this.inject = init.inject
    this.strictMembership = init.strictMembership ?? false
    this.id = init.options.id ?? allocateUserId()
    this.first_name = init.options.first_name ?? `User${this.id}`
    this.last_name = init.options.last_name
    this.username = init.options.username
    this.language_code = init.options.language_code
    this.pmChat = new TestChat({ id: this.id, type: 'private' })
  }

  get chat () {
    return this.pmChat
  }

  toRaw () {
    const base: Record<string, unknown> = {
      id: this.id,
      is_bot: this.is_bot,
      first_name: this.first_name
    }

    if (this.last_name !== undefined) {
      base.last_name = this.last_name
    }

    if (this.username !== undefined) {
      base.username = this.username
    }

    if (this.language_code !== undefined) {
      base.language_code = this.language_code
    }

    return base
  }

  in (chat: TestChat) {
    return new TestUserInChat(this, chat)
  }

  on (msg: TestMessage) {
    return new TestUserOnMessage(this, msg)
  }

  block () {
    this.world.blockedUsers.add(this.id)
  }

  unblock () {
    this.world.blockedUsers.delete(this.id)
  }

  setLanguage (code: string) {
    this.language_code = code
  }

  async startBot (payload?: string) {
    const text = payload === undefined ? '/start' : `/start ${payload}`

    return this.sendMessage(text)
  }

  async sendMessage (text: string): Promise<TestMessage>
  async sendMessage (chat: TestChat, text: string): Promise<TestMessage>
  async sendMessage (a: string | TestChat, b?: string): Promise<TestMessage> {
    const chat = typeof a === 'string' ? this.pmChat : a
    const text = typeof a === 'string' ? a : (b as string)

    this.ensureCanPost(chat)

    const messageId = chat.nextMessageId()
    const msg = new TestMessage({
      chat,
      from: this,
      message_id: messageId,
      date: Math.floor(Date.now() / 1000)
    })

    msg.text = text
    chat.appendMessage(msg)

    await this.inject({
      update_id: this.world.nextUpdateId(),
      message: msg.toRaw()
    })

    return msg
  }

  async replyTo (target: TestMessage, text: string) {
    const chat = target.chat

    this.ensureCanPost(chat)

    const msg = new TestMessage({
      chat,
      from: this,
      message_id: chat.nextMessageId(),
      date: Math.floor(Date.now() / 1000)
    })

    msg.text = text
    chat.appendMessage(msg)

    const raw = msg.toRaw()

    raw.reply_to_message = target.toRaw()

    await this.inject({
      update_id: this.world.nextUpdateId(),
      message: raw
    })

    return msg
  }

  async sendPhoto (media: ActorMediaInput, opts?: MediaOpts): Promise<TestMessage>
  async sendPhoto (chat: TestChat, media: ActorMediaInput, opts?: MediaOpts): Promise<TestMessage>
  async sendPhoto (
    a: ActorMediaInput | TestChat,
    b?: ActorMediaInput | MediaOpts,
    c?: MediaOpts
  ): Promise<TestMessage> {
    if (a instanceof TestChat) {
      return this.sendMedia(a, 'photo', b as ActorMediaInput, c)
    }

    return this.sendMedia(this.pmChat, 'photo', a, b as MediaOpts | undefined)
  }

  async sendDocument (media: ActorMediaInput, opts?: MediaOpts): Promise<TestMessage>
  async sendDocument (chat: TestChat, media: ActorMediaInput, opts?: MediaOpts): Promise<TestMessage>
  async sendDocument (
    a: ActorMediaInput | TestChat,
    b?: ActorMediaInput | MediaOpts,
    c?: MediaOpts
  ): Promise<TestMessage> {
    if (a instanceof TestChat) {
      return this.sendMedia(a, 'document', b as ActorMediaInput, c)
    }

    return this.sendMedia(this.pmChat, 'document', a, b as MediaOpts | undefined)
  }

  async sendVideo (media: ActorMediaInput, opts?: MediaOpts): Promise<TestMessage>
  async sendVideo (chat: TestChat, media: ActorMediaInput, opts?: MediaOpts): Promise<TestMessage>
  async sendVideo (
    a: ActorMediaInput | TestChat,
    b?: ActorMediaInput | MediaOpts,
    c?: MediaOpts
  ): Promise<TestMessage> {
    if (a instanceof TestChat) {
      return this.sendMedia(a, 'video', b as ActorMediaInput, c)
    }

    return this.sendMedia(this.pmChat, 'video', a, b as MediaOpts | undefined)
  }

  async sendAudio (media: ActorMediaInput, opts?: MediaOpts): Promise<TestMessage>
  async sendAudio (chat: TestChat, media: ActorMediaInput, opts?: MediaOpts): Promise<TestMessage>
  async sendAudio (
    a: ActorMediaInput | TestChat,
    b?: ActorMediaInput | MediaOpts,
    c?: MediaOpts
  ): Promise<TestMessage> {
    if (a instanceof TestChat) {
      return this.sendMedia(a, 'audio', b as ActorMediaInput, c)
    }

    return this.sendMedia(this.pmChat, 'audio', a, b as MediaOpts | undefined)
  }

  async sendVoice (media: ActorMediaInput, opts?: MediaOpts): Promise<TestMessage>
  async sendVoice (chat: TestChat, media: ActorMediaInput, opts?: MediaOpts): Promise<TestMessage>
  async sendVoice (
    a: ActorMediaInput | TestChat,
    b?: ActorMediaInput | MediaOpts,
    c?: MediaOpts
  ): Promise<TestMessage> {
    if (a instanceof TestChat) {
      return this.sendMedia(a, 'voice', b as ActorMediaInput, c)
    }

    return this.sendMedia(this.pmChat, 'voice', a, b as MediaOpts | undefined)
  }

  async sendAnimation (media: ActorMediaInput, opts?: MediaOpts): Promise<TestMessage>
  async sendAnimation (chat: TestChat, media: ActorMediaInput, opts?: MediaOpts): Promise<TestMessage>
  async sendAnimation (
    a: ActorMediaInput | TestChat,
    b?: ActorMediaInput | MediaOpts,
    c?: MediaOpts
  ): Promise<TestMessage> {
    if (a instanceof TestChat) {
      return this.sendMedia(a, 'animation', b as ActorMediaInput, c)
    }

    return this.sendMedia(this.pmChat, 'animation', a, b as MediaOpts | undefined)
  }

  async sendVideoNote (media: ActorMediaInput): Promise<TestMessage>
  async sendVideoNote (chat: TestChat, media: ActorMediaInput): Promise<TestMessage>
  async sendVideoNote (a: ActorMediaInput | TestChat, b?: ActorMediaInput): Promise<TestMessage> {
    if (a instanceof TestChat) {
      return this.sendMedia(a, 'video_note', b as ActorMediaInput)
    }

    return this.sendMedia(this.pmChat, 'video_note', a)
  }

  async sendSticker (media: ActorMediaInput): Promise<TestMessage>
  async sendSticker (chat: TestChat, media: ActorMediaInput): Promise<TestMessage>
  async sendSticker (a: ActorMediaInput | TestChat, b?: ActorMediaInput): Promise<TestMessage> {
    if (a instanceof TestChat) {
      return this.sendMedia(a, 'sticker', b as ActorMediaInput)
    }

    return this.sendMedia(this.pmChat, 'sticker', a)
  }

  async sendLocation (latLon: LatLon): Promise<TestMessage>
  async sendLocation (chat: TestChat, latLon: LatLon): Promise<TestMessage>
  async sendLocation (a: TestChat | LatLon, b?: LatLon): Promise<TestMessage> {
    const chat = a instanceof TestChat ? a : this.pmChat
    const latLon = a instanceof TestChat ? (b as LatLon) : a

    return this.sendSimple(chat, (raw) => {
      raw.location = { latitude: latLon.latitude, longitude: latLon.longitude }
    })
  }

  async sendVenue (venue: Venue): Promise<TestMessage>
  async sendVenue (chat: TestChat, venue: Venue): Promise<TestMessage>
  async sendVenue (a: TestChat | Venue, b?: Venue): Promise<TestMessage> {
    const chat = a instanceof TestChat ? a : this.pmChat
    const venue = a instanceof TestChat ? (b as Venue) : a

    return this.sendSimple(chat, (raw) => {
      raw.location = { latitude: venue.latitude, longitude: venue.longitude }
      raw.venue = {
        location: { latitude: venue.latitude, longitude: venue.longitude },
        title: venue.title,
        address: venue.address
      }
    })
  }

  async sendContact (contact: Contact): Promise<TestMessage>
  async sendContact (chat: TestChat, contact: Contact): Promise<TestMessage>
  async sendContact (a: TestChat | Contact, b?: Contact): Promise<TestMessage> {
    const chat = a instanceof TestChat ? a : this.pmChat
    const contact = a instanceof TestChat ? (b as Contact) : a

    return this.sendSimple(chat, (raw) => {
      const payload: Record<string, unknown> = {
        phone_number: contact.phone_number,
        first_name: contact.first_name
      }

      if (contact.last_name !== undefined) {
        payload.last_name = contact.last_name
      }

      raw.contact = payload
    })
  }

  async sendPoll (poll: Poll): Promise<TestMessage>
  async sendPoll (chat: TestChat, poll: Poll): Promise<TestMessage>
  async sendPoll (a: TestChat | Poll, b?: Poll): Promise<TestMessage> {
    const chat = a instanceof TestChat ? a : this.pmChat
    const poll = a instanceof TestChat ? (b as Poll) : a
    const pollId = 'poll_' + this.world.nextUpdateId()

    return this.sendSimple(chat, (raw) => {
      raw.poll = {
        id: pollId,
        question: poll.question,
        options: poll.options.map(text => ({ text, voter_count: 0 })),
        total_voter_count: 0,
        is_closed: false,
        is_anonymous: true,
        type: 'regular',
        allows_multiple_answers: false
      }
    })
  }

  async sendDice (emoji?: string): Promise<TestMessage>
  async sendDice (chat: TestChat, emoji?: string): Promise<TestMessage>
  async sendDice (a?: TestChat | string, b?: string): Promise<TestMessage> {
    const chat = a instanceof TestChat ? a : this.pmChat
    const emoji = a instanceof TestChat ? b : a

    return this.sendSimple(chat, (raw) => {
      raw.dice = { emoji: emoji ?? '🎲', value: 1 }
    })
  }

  async sendMediaGroup (items: MediaGroupItem[]): Promise<TestMessage[]>
  async sendMediaGroup (chat: TestChat, items: MediaGroupItem[]): Promise<TestMessage[]>
  async sendMediaGroup (
    a: TestChat | MediaGroupItem[],
    b?: MediaGroupItem[]
  ): Promise<TestMessage[]> {
    const chat = Array.isArray(a) ? this.pmChat : a
    const items = Array.isArray(a) ? a : (b as MediaGroupItem[])
    const out: TestMessage[] = []

    for (const item of items) {
      const opts = item.caption !== undefined ? { caption: item.caption } : undefined
      const msg = await this.sendMedia(chat, item.type, item.media, opts)

      out.push(msg)
    }

    return out
  }

  async join (chat: TestChat) {
    await this.changeMembership(chat, 'member')
  }

  async leave (chat: TestChat) {
    await this.changeMembership(chat, 'left')
  }

  async pinMessage (msg: TestMessage) {
    msg.chat.pinTop(msg)

    const carrier = new TestMessage({
      chat: msg.chat,
      from: this,
      message_id: msg.chat.nextMessageId(),
      date: Math.floor(Date.now() / 1000)
    })

    const carrierRaw = carrier.toRaw()

    carrierRaw.pinned_message = msg.toRaw()

    await this.inject({
      update_id: this.world.nextUpdateId(),
      message: carrierRaw
    })
  }

  async react (emojis: string | readonly string[], msg: TestMessage) {
    const list = typeof emojis === 'string' ? [emojis] : emojis
    const change = msg.applyReaction(this.id, list)

    await this.inject({
      update_id: this.world.nextUpdateId(),
      message_reaction: {
        chat: msg.chat.toRaw(),
        message_id: msg.message_id,
        user: this.toRaw(),
        date: Math.floor(Date.now() / 1000),
        old_reaction: change.old.map(e => ({ type: 'emoji', emoji: e })),
        new_reaction: change.new.map(e => ({ type: 'emoji', emoji: e }))
      }
    })
  }

  async click (callbackData: string, msg: TestMessage) {
    await this.inject({
      update_id: this.world.nextUpdateId(),
      callback_query: {
        id: 'cbq_' + this.world.nextUpdateId(),
        from: this.toRaw(),
        message: msg.toRaw(),
        chat_instance: 'inst_' + msg.chat.id,
        data: callbackData
      }
    })
  }

  async clickByText (buttonText: string, msg: TestMessage) {
    const markup = msg.replyMarkup as
      | { inline_keyboard?: { text?: string, callback_data?: string }[][] }
      | undefined
    const rows = markup?.inline_keyboard ?? []

    for (const row of rows) {
      for (const button of row) {
        if (button.text === buttonText && typeof button.callback_data === 'string') {
          await this.click(button.callback_data, msg)

          return
        }
      }
    }

    throw new Error(`clickByText: no button with text "${buttonText}" on message ${msg.message_id}`)
  }

  async sendWidgetQuery (
    data: string,
    message: TestMessage,
    options: { type?: TelegramWidgetQueryType, widget_id?: string } = {}
  ) {
    await this.inject({
      update_id: this.world.nextUpdateId(),
      widget_query: {
        id: 'wq_' + this.world.nextUpdateId(),
        from: this.toRaw(),
        chat: message.chat.toRaw(),
        message_id: message.message_id,
        chat_instance: 'inst_' + message.chat.id,
        type: options.type ?? { type: 'data' },
        data,
        ...(options.widget_id === undefined ? {} : { widget_id: options.widget_id })
      }
    })
  }

  async sendSharedWidgetQuery (
    widgetId: string,
    data: string,
    options: { type?: TelegramWidgetQueryType } = {}
  ) {
    await this.inject({
      update_id: this.world.nextUpdateId(),
      shared_widget_query: {
        id: 'swq_' + this.world.nextUpdateId(),
        from: this.toRaw(),
        widget_id: widgetId,
        type: options.type ?? { type: 'data' },
        data
      }
    })
  }

  async sendInlineQuery (query: string, opts?: { offset?: string }): Promise<void>
  async sendInlineQuery (query: string, chat: TestChat, opts?: { offset?: string }): Promise<void>
  async sendInlineQuery (
    query: string,
    b?: TestChat | { offset?: string },
    c?: { offset?: string }
  ): Promise<void> {
    const opts = (b instanceof TestChat ? c : b) ?? {}

    await this.inject({
      update_id: this.world.nextUpdateId(),
      inline_query: {
        id: 'iq_' + this.world.nextUpdateId(),
        from: this.toRaw(),
        query,
        offset: opts.offset ?? ''
      }
    })
  }

  async chooseInlineResult (resultId: string, query: string, opts?: { inline_message_id?: string }) {
    const inner: Record<string, unknown> = {
      result_id: resultId,
      from: this.toRaw(),
      query
    }

    if (opts?.inline_message_id !== undefined) {
      inner.inline_message_id = opts.inline_message_id
    }

    await this.inject({
      update_id: this.world.nextUpdateId(),
      chosen_inline_result: inner
    })
  }

  private ensureCanPost (chat: TestChat) {
    if (chat.type === 'private') {
      return
    }

    const membership = chat.membershipOf(this)

    if (membership.status === 'left') {
      if (this.strictMembership) {
        throw new MembershipRequired(
          `user ${this.id} cannot send to chat ${chat.id} without joining (strict mode)`
        )
      }

      chat.setMembership(this.id, { status: 'member', since: Math.floor(Date.now() / 1000) })
    }
  }

  private async sendMedia (
    chat: TestChat,
    field: MediaField,
    media: ActorMediaInput,
    opts?: MediaOpts
  ) {
    this.ensureCanPost(chat)

    const handle = resolveMedia(this.world, media)
    const msg = new TestMessage({
      chat,
      from: this,
      message_id: chat.nextMessageId(),
      date: Math.floor(Date.now() / 1000)
    })

    if (opts?.caption !== undefined) {
      msg.caption = opts.caption
    }

    chat.appendMessage(msg)

    const raw = msg.toRaw()

    if (field === 'photo') {
      raw.photo = [{
        file_id: handle.file_id,
        file_unique_id: handle.file_unique_id,
        width: 100,
        height: 100
      }]
    } else {
      raw[field] = { file_id: handle.file_id, file_unique_id: handle.file_unique_id }
    }

    await this.inject({
      update_id: this.world.nextUpdateId(),
      message: raw
    })

    return msg
  }

  private async sendSimple (
    chat: TestChat,
    decorate: (raw: Record<string, unknown>) => void
  ) {
    this.ensureCanPost(chat)

    const msg = new TestMessage({
      chat,
      from: this,
      message_id: chat.nextMessageId(),
      date: Math.floor(Date.now() / 1000)
    })

    chat.appendMessage(msg)

    const raw = msg.toRaw()

    decorate(raw)

    await this.inject({
      update_id: this.world.nextUpdateId(),
      message: raw
    })

    return msg
  }

  private async changeMembership (chat: TestChat, newStatus: ChatMembership['status']) {
    const old = chat.membershipOf(this)
    const updated: ChatMembership = { status: newStatus, since: Math.floor(Date.now() / 1000) }

    chat.setMembership(this.id, updated)

    await this.inject({
      update_id: this.world.nextUpdateId(),
      chat_member: {
        chat: chat.toRaw(),
        from: this.toRaw(),
        date: Math.floor(Date.now() / 1000),
        old_chat_member: { user: this.toRaw(), status: old.status },
        new_chat_member: { user: this.toRaw(), status: newStatus }
      }
    })
  }
}
