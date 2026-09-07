import type { TelegramInputRichBlock } from '@puregram/api'

import {
  DEFAULT_MAP_HEIGHT, DEFAULT_MAP_WIDTH, DEFAULT_MAP_ZOOM,
  MAX_MAP_RATIO, MAX_MAP_SIZE, MAX_MAP_ZOOM, TABLE_CELL_VALIGN
} from '../constants'
import { type RichContent, emitBlocks, emitText } from '../emit'
import { RichError } from '../error'
import { type RichMediaKind, type RichMediaSource, inferMediaKind } from '../media'
import { type RichNode, makeNode } from '../node'

/** section heading, level 1-6 */
export function heading (level: 1 | 2 | 3 | 4 | 5 | 6, content: RichContent) {
  return makeNode('block', () => ({ type: 'heading', text: emitText(content), size: level }))
}

/** `heading(1, content)` */
export const h1 = (content: RichContent) => heading(1, content)
/** `heading(2, content)` */
export const h2 = (content: RichContent) => heading(2, content)
/** `heading(3, content)` */
export const h3 = (content: RichContent) => heading(3, content)
/** `heading(4, content)` */
export const h4 = (content: RichContent) => heading(4, content)
/** `heading(5, content)` */
export const h5 = (content: RichContent) => heading(5, content)
/** `heading(6, content)` */
export const h6 = (content: RichContent) => heading(6, content)

/** paragraph block */
export function paragraph (content: RichContent) {
  return makeNode('block', () => ({ type: 'paragraph', text: emitText(content) }))
}

/** preformatted code block, optionally tagged with a language */
export function codeBlock (codeText: string, language = '') {
  return makeNode('block', () => ({ type: 'pre', text: codeText, ...(language ? { language } : {}) }))
}

/** block quotation, optionally crediting a source */
export function blockquote (content: RichContent, credit?: RichContent) {
  return makeNode('block', () => ({
    type: 'blockquote',
    blocks: emitBlocks(content),
    ...(credit === undefined ? {} : { credit: emitText(credit) })
  }))
}

/** collapsed-by-default block quotation, optionally crediting a source */
export function expandableBlockquote (content: RichContent, credit?: RichContent) {
  return makeNode('block', () => ({
    type: 'expandable_blockquote',
    text: emitText(content),
    ...(credit === undefined ? {} : { credit: emitText(credit) })
  }))
}

/** horizontal divider */
export function divider () {
  return makeNode('block', () => ({ type: 'divider' }))
}

/** unordered list */
export function list (items: RichContent[]) {
  return makeNode('block', () => ({ type: 'list', items: items.map(item => ({ blocks: emitBlocks(item) })) }))
}

/** the label style of an ordered list — letters, roman numerals, or decimal numbers */
export type OrderedListType = 'a' | 'A' | 'i' | 'I' | '1'

/** ordered list */
export function orderedList (items: RichContent[], options: { start?: number, type?: OrderedListType } = {}) {
  const start = options.start ?? 1
  const type = options.type ?? '1'

  return makeNode('block', () => ({
    type: 'list',
    items: items.map((item, i) => ({ blocks: emitBlocks(item), value: start + i, type }))
  }))
}

/** collapsible block */
export function details (summary: RichContent, body: RichContent, options: { open?: boolean } = {}) {
  return makeNode('block', () => ({
    type: 'details',
    summary: emitText(summary),
    blocks: emitBlocks(body),
    ...(options.open ? { is_open: true as const } : {})
  }))
}

/** block-level LaTeX formula (raw latex) */
export function mathBlock (latex: string) {
  return makeNode('block', () => ({ type: 'mathematical_expression', expression: latex }))
}

/** footer block */
export function footer (content: RichContent) {
  return makeNode('block', () => ({ type: 'footer', text: emitText(content) }))
}

/** pull quote, optionally crediting a source */
export function pullQuote (content: RichContent, cite?: RichContent) {
  return makeNode('block', () => ({
    type: 'pullquote',
    text: emitText(content),
    ...(cite === undefined ? {} : { credit: emitText(cite) })
  }))
}

/** checkbox list */
export function taskList (items: { text: RichContent, done?: boolean }[]) {
  return makeNode('block', () => ({
    type: 'list',
    items: items.map(i => ({
      blocks: emitBlocks(i.text),
      has_checkbox: true,
      ...(i.done ? { is_checked: true as const } : {})
    }))
  }))
}

/** thinking placeholder (draft-only block — `sendRichMessageDraft`) */
export function thinking (content: RichContent) {
  return makeNode('block', () => ({ type: 'thinking', text: emitText(content) }))
}

export type MediaType = RichMediaKind

export interface MediaOptions {
  type?: MediaType
  caption?: RichContent
  credit?: RichContent
  spoiler?: boolean
}

function blockCaption (options: Pick<MediaOptions, 'caption' | 'credit'>) {
  if (options.caption === undefined) {
    if (options.credit !== undefined) {
      throw new RichError('a credit requires a caption')
    }

    return {}
  }

  return {
    caption: {
      text: emitText(options.caption),
      ...(options.credit === undefined ? {} : { credit: emitText(options.credit) })
    }
  }
}

function mediaNode (kind: RichMediaKind | undefined, src: RichMediaSource, options: MediaOptions) {
  return makeNode('block', () => {
    const type = kind ?? (typeof src === 'string' ? inferMediaKind(src) : 'photo')
    const spoiler = options.spoiler && (type === 'photo' || type === 'video' || type === 'animation')

    // InputMedia `media` is typed as a string, but MediaSource envelopes intentionally travel
    // through it — the client rewrites them (upload / file_id / url) before the request leaves
    const mediaValue = src as string

    // the per-kind media key ({ photo }, { video }, …) can't be expressed against the closed union
    const block = {
      type,
      [type]: { type, media: mediaValue, ...(spoiler ? { has_spoiler: true } : {}) },
      ...blockCaption(options)
    } as unknown as TelegramInputRichBlock

    return block
  })
}

/** media block by url or MediaSource (photo / video / audio / animation / voice note) */
export function media (src: RichMediaSource, options: MediaOptions = {}) {
  return mediaNode(options.type, src, options)
}

/** photo media block */
export function photo (src: RichMediaSource, options: Omit<MediaOptions, 'type'> = {}) {
  return mediaNode('photo', src, options)
}

/** video media block */
export function video (src: RichMediaSource, options: Omit<MediaOptions, 'type'> = {}) {
  return mediaNode('video', src, options)
}

/** audio media block */
export function audio (src: RichMediaSource, options: Omit<MediaOptions, 'type'> = {}) {
  return mediaNode('audio', src, options)
}

/** animation media block */
export function animation (src: RichMediaSource, options: Omit<MediaOptions, 'type'> = {}) {
  return mediaNode('animation', src, options)
}

/** voice note media block */
export function voiceNote (src: RichMediaSource, options: Omit<MediaOptions, 'type' | 'spoiler'> = {}) {
  return mediaNode('voice_note', src, options)
}

/** general file media block */
export function document (src: RichMediaSource, options: Omit<MediaOptions, 'type' | 'spoiler'> = {}) {
  return mediaNode('document', src, options)
}

export interface MapOptions {
  zoom?: number
  width?: number
  height?: number
  caption?: RichContent
  credit?: RichContent
}

/** location map */
export function map (latitude: number, longitude: number, options: MapOptions = {}) {
  return makeNode('block', () => {
    const zoom = options.zoom ?? DEFAULT_MAP_ZOOM
    const width = options.width ?? DEFAULT_MAP_WIDTH
    const height = options.height ?? DEFAULT_MAP_HEIGHT

    if (!Number.isInteger(zoom) || zoom < 0 || zoom > MAX_MAP_ZOOM) {
      throw new RichError(`a map zoom must be an integer between 0 and ${MAX_MAP_ZOOM}, got ${zoom}`)
    }

    if (width <= 0 || height <= 0 || width + height > MAX_MAP_SIZE) {
      throw new RichError(`a map width and height must be positive and sum to at most ${MAX_MAP_SIZE}`)
    }

    const ratio = width > height ? width / height : height / width

    if (ratio > MAX_MAP_RATIO) {
      throw new RichError(`a map side ratio must be at most ${MAX_MAP_RATIO}, got ${ratio}`)
    }

    return { type: 'map', location: { latitude, longitude }, zoom, width, height, ...blockCaption(options) }
  })
}

function mediaGroup (type: 'collage' | 'slideshow', items: readonly RichNode[], options: { caption?: RichContent, credit?: RichContent }) {
  return makeNode('block', () => ({ type, blocks: emitBlocks(items as RichContent[]), ...blockCaption(options) }))
}

/** photo/video collage */
export function collage (items: readonly RichNode[], options: { caption?: RichContent, credit?: RichContent } = {}) {
  return mediaGroup('collage', items, options)
}

/** photo/video slideshow */
export function slideshow (items: readonly RichNode[], options: { caption?: RichContent, credit?: RichContent } = {}) {
  return mediaGroup('slideshow', items, options)
}

export type Align = 'left' | 'center' | 'right'

export interface TableOptions {
  header?: boolean
  align?: Align[]
  bordered?: boolean
  striped?: boolean
  compact?: boolean
  caption?: RichContent
}

/** table of inline cells (the first row is the header unless `header: false`) */
export function table (rows: RichContent[][], options: TableOptions = {}) {
  const header = options.header ?? true

  return makeNode('block', () => ({
    type: 'table',
    cells: rows.map((r, ri) => r.map((c, ci) => {
      const text = emitText(c)

      return {
        ...(text === '' ? {} : { text }),
        ...(header && ri === 0 ? { is_header: true as const } : {}),
        align: options.align?.[ci] ?? 'left',
        valign: TABLE_CELL_VALIGN
      }
    })),
    ...(options.bordered ? { is_bordered: true as const } : {}),
    ...(options.striped ? { is_striped: true as const } : {}),
    ...(options.compact ? { is_compact: true as const } : {}),
    ...(options.caption === undefined ? {} : { caption: emitText(options.caption) })
  }))
}

/** footnote definition — the text behind a `footnoteRef(id)` marker (usually placed at the end) */
export function footnote (id: string, definition: RichContent) {
  return makeNode('block', () => ({ type: 'paragraph', text: { type: 'reference', text: emitText(definition), name: id } }))
}

/** alias for `blockquote` */
export const quote = blockquote
/** alias for `codeBlock` */
export const pre = codeBlock
/** alias for `divider` */
export const hr = divider
/** alias for `footnote` */
export const fn = footnote
/** alias for `expandableBlockquote` */
export const expandableQuote = expandableBlockquote
