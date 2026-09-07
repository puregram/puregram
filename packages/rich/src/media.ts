/**
 * an opaque media envelope — structurally matches puregram's `MediaSource.*` return values.
 * rich passes it through untouched; the client resolves it (upload / file_id / url) at send time
 */
export interface RichMediaInput {
  type: string
  value: unknown
}

/** anything a media builder accepts as its source — an http(s) url string or a `MediaSource.*` envelope */
export type RichMediaSource = string | RichMediaInput

/** the kind of media a builder emits — mirrors the `InputMedia*` discriminators */
export type RichMediaKind = 'photo' | 'video' | 'audio' | 'animation' | 'voice_note' | 'document'

const VIDEO_EXTENSIONS = ['mp4', 'mov', 'webm', 'gif']
const AUDIO_EXTENSIONS = ['mp3', 'ogg', 'oga', 'm4a', 'wav']
const DOCUMENT_EXTENSIONS = [
  'zip', 'rar', '7z', 'tar', 'gz', 'tgz', 'bz2', 'xz',
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'rtf', 'epub',
  'txt', 'csv', 'tsv', 'json', 'xml', 'yaml', 'yml', 'md', 'log',
  'apk', 'exe', 'dmg', 'iso', 'deb', 'rpm'
]

/** media kind by url extension — a block must pick its type before telegram sees the file */
export function inferMediaKind (url: string) {
  const path = url.replace(/[?#].*$/, '').replace(/^[a-z][a-z0-9+.-]*:\/\/[^/]*/i, '')
  const ext = (/\.([a-z0-9]+)$/i.exec(path)?.[1] ?? '').toLowerCase()

  if (VIDEO_EXTENSIONS.includes(ext)) {
    return 'video'
  }

  if (AUDIO_EXTENSIONS.includes(ext)) {
    return 'audio'
  }

  if (DOCUMENT_EXTENSIONS.includes(ext)) {
    return 'document'
  }

  return 'photo'
}
