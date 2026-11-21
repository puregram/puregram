import type {
  Animation,
  Audio,
  Contact,
  Document,
  LivePhoto,
  Location,
  Poll,
  Sticker,
  Story,
  Venue,
  Video,
  VideoNote,
  Voice
} from '../generated/structures'

import type { Photo } from './photo'

export type MessageAttachment =
  | Animation
  | Audio
  | Contact
  | Document
  | LivePhoto
  | Location
  | Photo
  | Poll
  | Sticker
  | Story
  | Venue
  | Video
  | VideoNote
  | Voice

export type MessageAttachmentOf<T extends MessageAttachment['attachmentType']> =
  Extract<MessageAttachment, { attachmentType: `${T}` }>
