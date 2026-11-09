import type { TelegramWidgetQueryType } from '@puregram/api'

import type { TestChat } from './chat'
import type { ActorMediaInput } from './media-input'
import type { TestMessage } from './message'
import type { TestUser } from './user'

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

export class TestUserInChat {
  constructor (private readonly user: TestUser, private readonly chat: TestChat) {}

  sendMessage (text: string) {
    return this.user.sendMessage(this.chat, text)
  }

  sendPhoto (media: ActorMediaInput, opts?: MediaOpts) {
    return opts !== undefined
      ? this.user.sendPhoto(this.chat, media, opts)
      : this.user.sendPhoto(this.chat, media)
  }

  sendDocument (media: ActorMediaInput, opts?: MediaOpts) {
    return opts !== undefined
      ? this.user.sendDocument(this.chat, media, opts)
      : this.user.sendDocument(this.chat, media)
  }

  sendVideo (media: ActorMediaInput, opts?: MediaOpts) {
    return opts !== undefined
      ? this.user.sendVideo(this.chat, media, opts)
      : this.user.sendVideo(this.chat, media)
  }

  sendAudio (media: ActorMediaInput, opts?: MediaOpts) {
    return opts !== undefined
      ? this.user.sendAudio(this.chat, media, opts)
      : this.user.sendAudio(this.chat, media)
  }

  sendVoice (media: ActorMediaInput, opts?: MediaOpts) {
    return opts !== undefined
      ? this.user.sendVoice(this.chat, media, opts)
      : this.user.sendVoice(this.chat, media)
  }

  sendAnimation (media: ActorMediaInput, opts?: MediaOpts) {
    return opts !== undefined
      ? this.user.sendAnimation(this.chat, media, opts)
      : this.user.sendAnimation(this.chat, media)
  }

  sendVideoNote (media: ActorMediaInput) {
    return this.user.sendVideoNote(this.chat, media)
  }

  sendSticker (media: ActorMediaInput) {
    return this.user.sendSticker(this.chat, media)
  }

  sendLocation (latLon: LatLon) {
    return this.user.sendLocation(this.chat, latLon)
  }

  sendVenue (venue: Venue) {
    return this.user.sendVenue(this.chat, venue)
  }

  sendContact (contact: Contact) {
    return this.user.sendContact(this.chat, contact)
  }

  sendPoll (poll: Poll) {
    return this.user.sendPoll(this.chat, poll)
  }

  sendDice (emoji?: string) {
    return emoji !== undefined
      ? this.user.sendDice(this.chat, emoji)
      : this.user.sendDice(this.chat)
  }

  sendMediaGroup (items: MediaGroupItem[]) {
    return this.user.sendMediaGroup(this.chat, items)
  }

  join () {
    return this.user.join(this.chat)
  }

  leave () {
    return this.user.leave(this.chat)
  }
}

export class TestUserOnMessage {
  constructor (private readonly user: TestUser, private readonly message: TestMessage) {}

  sendWidgetQuery (data: string, options?: { type?: TelegramWidgetQueryType, widget_id?: string }) {
    return this.user.sendWidgetQuery(data, this.message, options)
  }

  react (emojis: string | readonly string[]) {
    return this.user.react(emojis, this.message)
  }

  reply (text: string) {
    return this.user.replyTo(this.message, text)
  }

  click (callbackData: string) {
    return this.user.click(callbackData, this.message)
  }

  clickByText (buttonText: string) {
    return this.user.clickByText(buttonText, this.message)
  }
}
