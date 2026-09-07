import { describe, expect, it } from 'vitest'

import { parseHtml } from '../../src/parsers/html'
import { parseMarkdown } from '../../src/parsers/markdown'

// ~32k chars: the pre-index parsers took seconds here (quadratic, 4x per doubling),
// so a generous ci-safe budget still fails loudly on a rescan regression
const STRESS_LENGTH = 32768
const BUDGET_MS = 1500

function timed<T> (run: () => T) {
  const startedAt = performance.now()
  const value = run()

  return { value, elapsed: performance.now() - startedAt }
}

describe('parser performance regressions', () => {
  it('parses repeated unclosed inline tags leniently in linear time', () => {
    const source = '<u>a'.repeat(STRESS_LENGTH / 4)
    const { value, elapsed } = timed(() => parseHtml(source, { lenient: true }))

    expect(elapsed).toBeLessThan(BUDGET_MS)
    expect(value).toEqual([{ type: 'paragraph', text: source }])
  })

  it('parses repeated unclosed inline tags in markdown leniently in linear time', () => {
    const source = '<u>a'.repeat(STRESS_LENGTH / 4)
    const { value, elapsed } = timed(() => parseMarkdown(source, { lenient: true }))

    expect(elapsed).toBeLessThan(BUDGET_MS)
    expect(value).toEqual([{ type: 'paragraph', text: source }])
  })

  it('parses a document of block-level html lines in linear time', () => {
    const count = Math.floor(STRESS_LENGTH / 9)
    const source = '<p>x</p>\n'.repeat(count)
    const { value, elapsed } = timed(() => parseMarkdown(source))

    expect(elapsed).toBeLessThan(BUDGET_MS)
    expect(value).toHaveLength(count)
    expect(value[0]).toEqual({ type: 'paragraph', text: 'x' })
    expect(value[count - 1]).toEqual({ type: 'paragraph', text: 'x' })
  })

  it('parses unclosed block-level html lines leniently in linear time', () => {
    const count = Math.floor(STRESS_LENGTH / 5)
    const source = '<p>x\n'.repeat(count)
    const { value, elapsed } = timed(() => parseMarkdown(source, { lenient: true }))

    expect(elapsed).toBeLessThan(BUDGET_MS)
    expect(value).toHaveLength(count)
    expect(value[0]).toEqual({ type: 'paragraph', text: '<p>x' })
  })

  it('trims trailing whitespace of entity-heavy text in linear time', () => {
    const count = Math.floor((STRESS_LENGTH - 9) / 5)
    const source = `<p>a${'&#32;'.repeat(count)}b</p>`
    const { value, elapsed } = timed(() => parseHtml(source))

    expect(elapsed).toBeLessThan(BUDGET_MS)
    expect(value).toEqual([{ type: 'paragraph', text: `a${' '.repeat(count)}b` }])
  })

  it('parses bracket runs leniently in linear time', () => {
    const image = '!['.repeat(STRESS_LENGTH / 2)
    const link = '['.repeat(STRESS_LENGTH)

    const images = timed(() => parseMarkdown(image, { lenient: true }))
    const links = timed(() => parseMarkdown(link, { lenient: true }))

    expect(images.elapsed).toBeLessThan(BUDGET_MS)
    expect(links.elapsed).toBeLessThan(BUDGET_MS)
    expect(images.value).toEqual([{ type: 'paragraph', text: image }])
    expect(links.value).toEqual([{ type: 'paragraph', text: link }])
  })
})
