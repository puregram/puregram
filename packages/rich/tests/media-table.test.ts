import { describe, expect, it } from 'vitest'

import {
  animation, audio, collage, document, map, media, photo, slideshow, table, video, voiceNote
} from '../src/builders/block'
import { bold } from '../src/builders/inline'
import { DEFAULT_MAP_HEIGHT, DEFAULT_MAP_WIDTH, DEFAULT_MAP_ZOOM, TABLE_CELL_VALIGN } from '../src/constants'

describe('media blocks', () => {
  it('emits a per-kind media block', () => {
    expect(photo('https://x/p.jpg').emit()).toEqual({
      type: 'photo',
      photo: { type: 'photo', media: 'https://x/p.jpg' }
    })
    expect(video('https://x/v.mp4').emit()).toEqual({
      type: 'video',
      video: { type: 'video', media: 'https://x/v.mp4' }
    })
    expect(audio('https://x/a.mp3').emit()).toEqual({
      type: 'audio',
      audio: { type: 'audio', media: 'https://x/a.mp3' }
    })
    expect(animation('https://x/g.gif').emit()).toEqual({
      type: 'animation',
      animation: { type: 'animation', media: 'https://x/g.gif' }
    })
    expect(voiceNote('https://x/n.ogg').emit()).toEqual({
      type: 'voice_note',
      voice_note: { type: 'voice_note', media: 'https://x/n.ogg' }
    })
    expect(document('https://x/d.zip').emit()).toEqual({
      type: 'document',
      document: { type: 'document', media: 'https://x/d.zip' }
    })
  })

  it('media() infers the kind from the url extension', () => {
    expect(media('https://x/v.mp4').emit()).toMatchObject({ type: 'video' })
    expect(media('https://x/a.mp3').emit()).toMatchObject({ type: 'audio' })
    expect(media('https://x/p.jpg').emit()).toMatchObject({ type: 'photo' })
    expect(media('https://x/d.zip').emit()).toMatchObject({ type: 'document' })
    expect(media('https://x/r.pdf').emit()).toMatchObject({ type: 'document' })
    expect(media('https://x/file').emit()).toMatchObject({ type: 'photo' })
  })

  it('media() ignores extensions outside the url path', () => {
    expect(media('https://x/photo?src=report.pdf').emit()).toMatchObject({ type: 'photo' })
    expect(media('https://x/img?w=1&name=a.mp3').emit()).toMatchObject({ type: 'photo' })
    expect(media('http://example.zip').emit()).toMatchObject({ type: 'photo' })
    expect(media('https://x/a.jpeg?x=y#z.mp4').emit()).toMatchObject({ type: 'photo' })
    expect(media('https://x/clip.mp4?token=b.pdf').emit()).toMatchObject({ type: 'video' })
  })

  it('media() defaults an envelope source to photo', () => {
    expect(media({ type: 'path', value: '/x.bin' }).emit()).toMatchObject({ type: 'photo' })
  })

  it('spoiler lands only on photo / video / animation', () => {
    expect(photo('https://x/p.jpg', { spoiler: true }).emit()).toEqual({
      type: 'photo',
      photo: { type: 'photo', media: 'https://x/p.jpg', has_spoiler: true }
    })
    expect(video('https://x/v.mp4', { spoiler: true }).emit()).toMatchObject({
      video: { has_spoiler: true }
    })
    expect(animation('https://x/g.gif', { spoiler: true }).emit()).toMatchObject({
      animation: { has_spoiler: true }
    })
    expect(audio('https://x/a.mp3', { spoiler: true }).emit()).toEqual({
      type: 'audio',
      audio: { type: 'audio', media: 'https://x/a.mp3' }
    })
    expect(media('https://x/n.ogg', { type: 'voice_note', spoiler: true }).emit()).toEqual({
      type: 'voice_note',
      voice_note: { type: 'voice_note', media: 'https://x/n.ogg' }
    })
  })

  it('caption and credit form a block caption', () => {
    expect(photo('https://x/p.jpg', { caption: 'cap', credit: bold('me') }).emit()).toEqual({
      type: 'photo',
      photo: { type: 'photo', media: 'https://x/p.jpg' },
      caption: { text: 'cap', credit: { type: 'bold', text: 'me' } }
    })
  })

  it('passes a MediaSource envelope through untouched', () => {
    const src = { type: 'path', value: '/x.jpg' }
    const emitted = photo(src).emit() as { photo: { media: unknown } }

    expect(emitted.photo.media).toBe(src)
  })
})

describe('map', () => {
  it('fills the default zoom and size', () => {
    expect(map(41.9, 12.5).emit()).toEqual({
      type: 'map',
      location: { latitude: 41.9, longitude: 12.5 },
      zoom: DEFAULT_MAP_ZOOM,
      width: DEFAULT_MAP_WIDTH,
      height: DEFAULT_MAP_HEIGHT
    })
  })

  it('honours explicit overrides and a caption', () => {
    expect(map(41.9, 12.5, { zoom: 3, width: 100, height: 50, caption: 'c' }).emit()).toEqual({
      type: 'map',
      location: { latitude: 41.9, longitude: 12.5 },
      zoom: 3,
      width: 100,
      height: 50,
      caption: { text: 'c' }
    })
  })
})

describe('collage / slideshow', () => {
  it('wraps the children blocks', () => {
    expect(collage([photo('https://x/p.jpg'), video('https://x/v.mp4')]).emit()).toEqual({
      type: 'collage',
      blocks: [
        { type: 'photo', photo: { type: 'photo', media: 'https://x/p.jpg' } },
        { type: 'video', video: { type: 'video', media: 'https://x/v.mp4' } }
      ]
    })
  })

  it('slideshow carries a caption', () => {
    expect(slideshow([photo('https://x/p.jpg')], { caption: 's' }).emit()).toEqual({
      type: 'slideshow',
      blocks: [{ type: 'photo', photo: { type: 'photo', media: 'https://x/p.jpg' } }],
      caption: { text: 's' }
    })
  })
})

describe('table', () => {
  it('marks the first row as header with align fallback and the valign constant', () => {
    expect(table([['H'], ['a']]).emit()).toEqual({
      type: 'table',
      cells: [
        [{ text: 'H', is_header: true, align: 'left', valign: TABLE_CELL_VALIGN }],
        [{ text: 'a', align: 'left', valign: TABLE_CELL_VALIGN }]
      ]
    })
  })

  it('header: false leaves every row plain', () => {
    expect(table([['a']], { header: false }).emit()).toEqual({
      type: 'table',
      cells: [[{ text: 'a', align: 'left', valign: TABLE_CELL_VALIGN }]]
    })
  })

  it('applies per-column align and omits text on empty cells', () => {
    expect(table([['a', '']], { header: false, align: ['center', 'right'] }).emit()).toEqual({
      type: 'table',
      cells: [[
        { text: 'a', align: 'center', valign: TABLE_CELL_VALIGN },
        { align: 'right', valign: TABLE_CELL_VALIGN }
      ]]
    })
  })

  it('carries bordered / striped flags and the caption text', () => {
    expect(table([['a']], { header: false, bordered: true, striped: true, caption: 'cap' }).emit()).toEqual({
      type: 'table',
      cells: [[{ text: 'a', align: 'left', valign: TABLE_CELL_VALIGN }]],
      is_bordered: true,
      is_striped: true,
      caption: 'cap'
    })
  })

  it('carries the compact flag', () => {
    expect(table([['a']], { header: false, compact: true }).emit()).toEqual({
      type: 'table',
      cells: [[{ text: 'a', align: 'left', valign: TABLE_CELL_VALIGN }]],
      is_compact: true
    })
  })
})
