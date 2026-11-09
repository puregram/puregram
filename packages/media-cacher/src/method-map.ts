import { MediaSourceType } from 'puregram/runtime'

export type AllowedMediaMethod =
  | 'sendPhoto' | 'sendVideo' | 'sendAnimation' | 'sendVideoNote'
  | 'sendAudio' | 'sendDocument' | 'sendSticker'

/** maps each cacheable upload method to the param/result key carrying its media */
export const MEDIA_METHOD_TO_KEY_MAP: Readonly<Record<AllowedMediaMethod, string>> = {
  sendPhoto: 'photo',
  sendVideo: 'video',
  sendAnimation: 'animation',
  sendVideoNote: 'video_note',
  sendAudio: 'audio',
  sendDocument: 'document',
  sendSticker: 'sticker'
}

/** only path/url media is worth caching: fileId is already cached, others are typically one-off */
export const ALLOWED_MEDIA_TYPES: readonly MediaSourceType[] = [MediaSourceType.Path, MediaSourceType.Url]
