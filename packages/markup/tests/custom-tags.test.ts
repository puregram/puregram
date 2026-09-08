import { describe, it, expect, afterEach } from 'vitest'

import { format } from '../src/compose'
import { MarkupParseError } from '../src/error'
import { Formatted } from '../src/formatted'
import { validateAndMerge, invokeHandler, scanCustomTags, countTagSiblings, indexOfSpan, MAX_DEPTH, parseHtmlInternal, type TagHandler, type TagInfo } from '../src/parsers/custom-tags'
import { html, htmlb, __resetHtmlRegistryForTests } from '../src/parsers/html'

const noop: TagHandler = content => content

describe('validateAndMerge', () => {
  it('merges valid entries into the registry', () => {
    const registry = new Map<string, TagHandler>()

    validateAndMerge(registry, { h1: noop, callout: noop })

    expect(registry.size).toBe(2)
    expect(registry.get('h1')).toBe(noop)
    expect(registry.get('callout')).toBe(noop)
  })

  it('overwrites an existing entry on second call', () => {
    const registry = new Map<string, TagHandler>()
    const first: TagHandler = c => c
    const second: TagHandler = c => c

    validateAndMerge(registry, { h1: first })
    validateAndMerge(registry, { h1: second })

    expect(registry.get('h1')).toBe(second)
  })

  it('throws MarkupParseError when name collides with a built-in canonical', () => {
    const registry = new Map<string, TagHandler>()

    expect(() => validateAndMerge(registry, { b: noop })).toThrow(MarkupParseError)
    expect(() => validateAndMerge(registry, { b: noop })).toThrow(/cannot redefine built-in tag <b>/)
  })

  it('throws when name collides with a built-in alias (strong → b)', () => {
    const registry = new Map<string, TagHandler>()

    expect(() => validateAndMerge(registry, { strong: noop })).toThrow(MarkupParseError)
  })

  it('throws when name is the spoiler-via-class span', () => {
    const registry = new Map<string, TagHandler>()

    expect(() => validateAndMerge(registry, { span: noop })).toThrow(MarkupParseError)
  })

  it('throws on uppercase name', () => {
    const registry = new Map<string, TagHandler>()

    expect(() => validateAndMerge(registry, { H1: noop })).toThrow(MarkupParseError)
    expect(() => validateAndMerge(registry, { H1: noop })).toThrow(/invalid custom-tag name/)
  })

  it('throws on name starting with a digit', () => {
    const registry = new Map<string, TagHandler>()

    expect(() => validateAndMerge(registry, { '1tag': noop })).toThrow(MarkupParseError)
  })

  it('throws on name with disallowed characters', () => {
    const registry = new Map<string, TagHandler>()

    expect(() => validateAndMerge(registry, { h_1: noop })).toThrow(MarkupParseError)
    expect(() => validateAndMerge(registry, { 'h:1': noop })).toThrow(MarkupParseError)
  })

  it('accepts names with hyphens and digits (canonical custom tag form)', () => {
    const registry = new Map<string, TagHandler>()

    validateAndMerge(registry, { 'my-h1': noop, 'h1-section': noop })

    expect(registry.size).toBe(2)
  })

  it('throws TypeError when handler is not a function', () => {
    const registry = new Map<string, TagHandler>()

    expect(() => validateAndMerge(registry, { h1: 'not a fn' as unknown as TagHandler }))
      .toThrow(TypeError)
  })

  it('throws TypeError (not MarkupParseError) when handler is non-function AND name is a built-in', () => {
    const registry = new Map<string, TagHandler>()

    expect(() => validateAndMerge(registry, { b: 42 as unknown as TagHandler }))
      .toThrow(TypeError)
    expect(() => validateAndMerge(registry, { b: 42 as unknown as TagHandler }))
      .not.toThrow(MarkupParseError)
  })
})

const blankInfo = (tag = 'h1') => ({
  tag,
  attrs: {},
  parent: null,
  ancestors: [],
  index: 0,
  siblingCount: 1
})

describe('invokeHandler', () => {
  it('returns the handler result when handler succeeds', () => {
    const handler: TagHandler = content => content
    const result = invokeHandler(handler, new Formatted('hi', []), blankInfo())

    expect(result).toBeInstanceOf(Formatted)
    expect(result.text).toBe('hi')
  })

  it('rethrows MarkupParseError unchanged', () => {
    const original = new MarkupParseError('inner failure', 5, 'src')
    const handler: TagHandler = () => {
      throw original
    }

    expect(() => invokeHandler(handler, new Formatted('', []), blankInfo()))
      .toThrow(original)
  })

  it('wraps non-MarkupParseError thrown values with cause', () => {
    const original = new Error('boom')
    const handler: TagHandler = () => {
      throw original
    }

    let caught: unknown

    try {
      invokeHandler(handler, new Formatted('', []), blankInfo('callout'))
    } catch (err) {
      caught = err
    }

    expect(caught).toBeInstanceOf(MarkupParseError)
    expect((caught as MarkupParseError).message).toContain('custom-tag <callout> handler threw: boom')
    expect((caught as { cause: unknown }).cause).toBe(original)
  })

  it('wraps non-Error thrown values (string)', () => {
    const handler: TagHandler = () => {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal, no-throw-literal
      throw 'string-error'
    }

    expect(() => invokeHandler(handler, new Formatted('', []), blankInfo()))
      .toThrow(/custom-tag <h1> handler threw: string-error/)
  })

  it('throws MarkupParseError when depth would exceed MAX_DEPTH', () => {
    let calls = 0
    const handler: TagHandler = (content, info) => {
      calls += 1

      if (calls < MAX_DEPTH + 5) {
        return invokeHandler(handler, content, info)
      }

      return content
    }

    expect(() => invokeHandler(handler, new Formatted('x', []), blankInfo()))
      .toThrow(/custom-tag expansion depth exceeded \(32\); possible cycle in <h1>/)
  })

  it('decrements depth on success so subsequent invocations start fresh', () => {
    const handler: TagHandler = content => content

    expect(() => {
      for (let i = 0; i < MAX_DEPTH + 5; i++) {
        invokeHandler(handler, new Formatted(String(i), []), blankInfo())
      }
    }).not.toThrow()
  })

  it('decrements depth on throw so a subsequent invocation works', () => {
    const thrower: TagHandler = () => {
      throw new Error('boom')
    }
    const ok: TagHandler = content => content

    for (let i = 0; i < 5; i++) {
      try {
        invokeHandler(thrower, new Formatted('x', []), blankInfo())
      } catch {
        // intentional
      }
    }

    const out = invokeHandler(ok, new Formatted('post', []), blankInfo())

    expect(out.text).toBe('post')
  })
})

const reg = (...names: string[]) => {
  const m = new Map<string, TagHandler>()

  for (const n of names) {
    m.set(n, noop)
  }

  return m
}

describe('scanCustomTags', () => {
  it('returns no spans when registry is empty', () => {
    expect(scanCustomTags('<h1>x</h1>', new Map())).toEqual([])
  })

  it('returns no spans when source has no custom tags', () => {
    expect(scanCustomTags('<b>plain</b>text', reg('h1'))).toEqual([])
  })

  it('finds a single custom-tag span', () => {
    const spans = scanCustomTags('<h1>title</h1>', reg('h1'))

    expect(spans).toHaveLength(1)
    expect(spans[0]).toMatchObject({
      tag: 'h1',
      attrs: {},
      openStart: 0,
      contentStart: 4,
      closeStart: 9,
      closeEnd: 14,
      selfClosing: false
    })
  })

  it('parses attrs on the open tag', () => {
    const spans = scanCustomTags('<callout type="warn">x</callout>', reg('callout'))

    expect(spans).toHaveLength(1)
    expect(spans[0].tag).toBe('callout')
    expect(spans[0].attrs).toEqual({ type: 'warn' })
  })

  it('handles boolean attrs (no value)', () => {
    const spans = scanCustomTags('<callout warn>x</callout>', reg('callout'))

    expect(spans[0].attrs).toEqual({ warn: '' })
  })

  it('finds matching close past nested same-name custom tags', () => {
    const src = '<h1>outer<h1>inner</h1>tail</h1>'
    const spans = scanCustomTags(src, reg('h1'))

    // only the outer is a top-level span; the inner h1 is inside outer's content
    expect(spans).toHaveLength(1)
    expect(spans[0].openStart).toBe(0)
    expect(spans[0].contentStart).toBe(4)
    // close tag position varies depending on byte offsets — assert relative to known string positions
    expect(src.slice(spans[0].closeStart, spans[0].closeEnd)).toBe('</h1>')
    expect(spans[0].closeEnd).toBe(src.length)
  })

  it('returns spans in document order for sibling custom tags', () => {
    const spans = scanCustomTags('<h1>a</h1><h1>b</h1>', reg('h1'))

    expect(spans).toHaveLength(2)
    expect(spans[0].openStart).toBe(0)
    expect(spans[1].openStart).toBe(10)
  })

  it('treats self-closing custom tags', () => {
    const src = '<icon name="bell"/>after'
    const spans = scanCustomTags(src, reg('icon'))

    expect(spans).toHaveLength(1)
    expect(spans[0].selfClosing).toBe(true)
    expect(spans[0].attrs).toEqual({ name: 'bell' })
    expect(spans[0].contentStart).toBe(spans[0].closeStart)
    expect(spans[0].closeEnd).toBe('<icon name="bell"/>'.length)
  })

  it('throws on unclosed custom tag', () => {
    expect(() => scanCustomTags('<h1>oops', reg('h1'))).toThrow(MarkupParseError)
    expect(() => scanCustomTags('<h1>oops', reg('h1'))).toThrow(/unclosed custom tag <h1>/)
  })

  it('skips built-in tags entirely (does not see them as spans)', () => {
    const spans = scanCustomTags('<b><h1>x</h1></b>', reg('h1'))

    // <h1> is a top-level custom-tag span — not nested inside another custom tag
    // (the surrounding <b> is built-in, doesn't shield)
    expect(spans).toHaveLength(1)
    expect(spans[0].tag).toBe('h1')
  })

  it('skips sentinel-laden segments (sentinels never start a tag)', () => {
    // sentinels are SOH () — not '<' — so the scanner naturally ignores them
    const src = '0<h1>x</h1>'
    const spans = scanCustomTags(src, reg('h1'))

    expect(spans).toHaveLength(1)
    expect(spans[0].openStart).toBe(3)
  })

  it('treats lowercase canonical: <H1> matches registered "h1"', () => {
    const spans = scanCustomTags('<H1>x</H1>', reg('h1'))

    expect(spans).toHaveLength(1)
    expect(spans[0].tag).toBe('h1')
  })
})

describe('countTagSiblings', () => {
  it('counts open tags at the top level', () => {
    expect(countTagSiblings('<b>x</b><i>y</i>')).toBe(2)
  })

  it('does not count text nodes', () => {
    expect(countTagSiblings('text<b>x</b>more text<i>y</i>tail')).toBe(2)
  })

  it('does not count nested tags', () => {
    expect(countTagSiblings('<b><i>nested</i></b>')).toBe(1)
  })

  it('does not count close tags', () => {
    expect(countTagSiblings('</b>')).toBe(0)
  })

  it('counts a self-closing tag once', () => {
    expect(countTagSiblings('<icon/>')).toBe(1)
  })

  it('counts mixed built-in + (would-be) custom names equally — count is name-agnostic', () => {
    expect(countTagSiblings('<b>x</b><h1>y</h1><i>z</i>')).toBe(3)
  })

  it('returns 0 on empty source', () => {
    expect(countTagSiblings('')).toBe(0)
  })

  it('returns 0 on text-only source', () => {
    expect(countTagSiblings('plain text')).toBe(0)
  })
})

describe('indexOfSpan', () => {
  it('returns 0 for the first sibling', () => {
    expect(indexOfSpan('<h1>x</h1><h1>y</h1>', 0)).toBe(0)
  })

  it('returns 1 for the second sibling when first is built-in', () => {
    expect(indexOfSpan('<b>x</b><h1>y</h1>', '<b>x</b>'.length)).toBe(1)
  })

  it('counts text nodes as zero contribution to index', () => {
    const src = 'text<b>a</b>more<h1>b</h1>'

    expect(indexOfSpan(src, src.indexOf('<h1>'))).toBe(1)
  })

  it('does not count tags nested inside earlier siblings', () => {
    const src = '<b><i>deep</i></b><h1>x</h1>'

    expect(indexOfSpan(src, src.indexOf('<h1>'))).toBe(1)
  })
})

describe('preprocessCustomTags + parseHtml integration', () => {
  it('expands a single custom tag', () => {
    const registry = new Map<string, TagHandler>()

    registry.set('h1', (content) => {
      return new Formatted(`# ${content.text}`, [
        { type: 'bold', offset: 0, length: 2 + content.text.length }
      ])
    })

    const out = parseHtmlInternal('<h1>hi</h1>', registry)

    expect(out.text).toBe('# hi')
    expect(out.entities).toEqual([{ type: 'bold', offset: 0, length: 4 }])
  })

  it('passes Formatted{"", []} for empty content', () => {
    const seen: Formatted[] = []
    const registry = new Map<string, TagHandler>()

    registry.set('h1', (content) => {
      seen.push(content)

      return new Formatted('out', [])
    })

    parseHtmlInternal('<h1></h1>', registry)
    parseHtmlInternal('<h1/>', registry)

    expect(seen).toHaveLength(2)
    expect(seen[0].text).toBe('')
    expect(seen[0].entities).toEqual([])
    expect(seen[1].text).toBe('')
    expect(seen[1].entities).toEqual([])
  })

  it('passes attrs to info.attrs', () => {
    let captured: TagInfo | undefined
    const registry = new Map<string, TagHandler>()

    registry.set('callout', (content, info) => {
      captured = info

      return content
    })

    parseHtmlInternal('<callout type="warn" expand>x</callout>', registry)

    expect(captured?.attrs).toEqual({ type: 'warn', expand: '' })
  })

  it('preserves built-in entities from inner content', () => {
    const registry = new Map<string, TagHandler>()

    registry.set('h1', content => content)

    const out = parseHtmlInternal('<h1>foo <b>bar</b></h1>', registry)

    expect(out.text).toBe('foo bar')
    expect(out.entities).toEqual([{ type: 'bold', offset: 4, length: 3 }])
  })

  it('threads parent and ancestors', () => {
    const captured: TagInfo[] = []
    const registry = new Map<string, TagHandler>()
    const note: TagHandler = (content, info) => {
      captured.push(info)

      return content
    }

    registry.set('outer', note)
    registry.set('mid', note)
    registry.set('inner', note)

    parseHtmlInternal('<outer><mid><inner>x</inner></mid></outer>', registry)

    expect(captured.map(c => c.tag)).toEqual(['inner', 'mid', 'outer'])
    expect(captured[0]).toMatchObject({ parent: 'mid', ancestors: ['outer', 'mid'] })
    expect(captured[1]).toMatchObject({ parent: 'outer', ancestors: ['outer'] })
    expect(captured[2]).toMatchObject({ parent: null, ancestors: [] })
  })

  it('threads index and siblingCount, ignoring text and counting built-ins', () => {
    const captured: TagInfo[] = []
    const registry = new Map<string, TagHandler>()

    registry.set('li', (content, info) => {
      captured.push(info)

      return content
    })

    parseHtmlInternal('<li>a</li>noise<b>x</b>tail<li>b</li>', registry)

    expect(captured).toHaveLength(2)
    expect(captured[0]).toMatchObject({ index: 0, siblingCount: 3 })
    expect(captured[1]).toMatchObject({ index: 2, siblingCount: 3 })
  })

  it('zero-overhead path: empty registry yields the same output as parseHtml', () => {
    const out = parseHtmlInternal('<b>plain</b>', new Map())

    expect(out.text).toBe('plain')
    expect(out.entities).toEqual([{ type: 'bold', offset: 0, length: 5 }])
  })

  it('throws MarkupParseError on cyclic custom tag', () => {
    const registry = new Map<string, TagHandler>()

    registry.set('h1', () => {
      return parseHtmlInternal('<h1>x</h1>', registry)
    })

    expect(() => parseHtmlInternal('<h1>start</h1>', registry))
      .toThrow(/custom-tag expansion depth exceeded/)
  })

  it('terminates legitimate data-driven nesting', () => {
    const registry = new Map<string, TagHandler>()

    registry.set('node', content => content)

    let src = 'leaf'

    for (let i = 0; i < 10; i++) {
      src = `<node>${src}</node>`
    }

    const out = parseHtmlInternal(src, registry)

    expect(out.text).toBe('leaf')
  })
})

describe('html.define / html.with', () => {
  afterEach(() => {
    __resetHtmlRegistryForTests()
  })

  it('html.define mutates the global registry and returns the same callable', () => {
    const ret = html.define({ h1: c => new Formatted(`H1:${c.text}`, []) })

    expect(ret).toBe(html)

    const out = html`<h1>x</h1>`

    expect(out.text).toBe('H1:x')
  })

  it('html.define is chainable', () => {
    html
      .define({ h1: c => new Formatted(`H:${c.text}`, []) })
      .define({ note: c => new Formatted(`N:${c.text}`, []) })

    expect((html`<h1>a</h1>`).text).toBe('H:a')
    expect((html`<note>b</note>`).text).toBe('N:b')
  })

  it('htmlb shares the registry with html', () => {
    html.define({ h1: c => new Formatted(`H1:${c.text}`, []) })

    const a = html`<h1>x</h1>`
    const b = htmlb`<h1>x</h1>`

    expect(a.text).toBe('H1:x')
    expect(b.text).toBe('H1:x')
  })

  it('html.with returns a fresh callable with isolated registry', () => {
    const fancy = html.with({ h1: c => new Formatted(`F:${c.text}`, []) })

    expect((fancy`<h1>x</h1>`).text).toBe('F:x')
    expect(() => html`<h1>x</h1>`).toThrow(/unknown tag <h1>/)
  })

  it('html.with snapshot does not see later html.define', () => {
    const isolated = html.with({})

    html.define({ h1: () => new Formatted('global', []) })

    expect((html`<h1>x</h1>`).text).toBe('global')
    expect(() => isolated`<h1>x</h1>`).toThrow()
  })

  it('with-cloned callable supports .define on itself without affecting the original', () => {
    const a = html.with({})
    const b = a.with({})

    a.define({ taga: () => new Formatted('A', []) })
    b.define({ tagb: () => new Formatted('B', []) })

    expect((a`<taga>x</taga>`).text).toBe('A')
    expect((b`<tagb>x</tagb>`).text).toBe('B')

    expect(() => a`<tagb>x</tagb>`).toThrow()
    expect(() => b`<taga>x</taga>`).toThrow()
  })

  it('html() function-call form still works alongside define', () => {
    html.define({ h1: c => new Formatted(`H:${c.text}`, []) })

    expect(html('<h1>foo</h1>').text).toBe('H:foo')
    expect(html('<b>plain</b>').text).toBe('plain')
  })
})

describe('custom-tag end-to-end scenarios', () => {
  afterEach(() => {
    __resetHtmlRegistryForTests()
  })

  it('numbered list pattern: ul + li with index', () => {
    html.define({
      ul: content => content,
      li: (content, { index, siblingCount }) =>
        format`${index + 1}. ${content}${index === siblingCount - 1 ? '' : '\n'}`
    })

    const out = html`<ul><li>first</li><li>second</li><li>third</li></ul>`

    expect(out.text).toBe('1. first\n2. second\n3. third')
  })

  it('callout pattern with attrs branching', () => {
    html.define({
      callout: (content, { attrs }) =>
        attrs.type === 'warn'
          ? html`⚠ <b>${content}</b>`
          : html`ℹ <i>${content}</i>`
    })

    const warn = html`<callout type="warn">careful</callout>`
    const info = html`<callout type="info">heads up</callout>`

    expect(warn.text).toBe('⚠ careful')
    expect(warn.entities).toEqual([{ type: 'bold', offset: 2, length: 7 }])

    expect(info.text).toBe('ℹ heads up')
    expect(info.entities).toEqual([{ type: 'italic', offset: 2, length: 8 }])
  })

  it('preserves entities from interpolations into the handler', () => {
    html.define({ h1: c => html`<b>${c}</b>` })

    const out = html`<h1>${html`<i>x</i>`}</h1>`

    expect(out.text).toBe('x')
    const types = out.entities.map(e => e.type).sort()

    expect(types).toEqual(['bold', 'italic'])
  })

  it('htmlb: <br> inside custom-tag content becomes \\n', () => {
    htmlb.define({ block: c => c })

    const out = htmlb`<block>line one<br>line two</block>`

    expect(out.text).toBe('line one\nline two')
  })

  it('cyclic definition throws MarkupParseError with depth message', () => {
    html.define({ loop: c => html`<loop>${c}</loop>` })

    expect(() => html`<loop>x</loop>`).toThrow(MarkupParseError)
    expect(() => html`<loop>x</loop>`).toThrow(/expansion depth exceeded \(32\); possible cycle in <loop>/)
  })

  it('mutual cycle (a ↔ b) throws', () => {
    html.define({
      'a-tag': c => html`<b-tag>${c}</b-tag>`,
      'b-tag': c => html`<a-tag>${c}</a-tag>`
    })

    expect(() => html`<a-tag>x</a-tag>`).toThrow(/expansion depth exceeded/)
  })

  it('legitimate intentional nested-list expansion terminates correctly', () => {
    html.define({
      group: c => html`(${c})`
    })

    const out = html`<group><group><group>x</group></group></group>`

    expect(out.text).toBe('(((x)))')
  })

  it('handler-thrown error is wrapped with cause', () => {
    const original = new Error('handler logic failed')

    html.define({
      broken: () => {
        throw original
      }
    })

    let caught: unknown

    try {
      html`<broken>x</broken>`
    } catch (err) {
      caught = err
    }

    expect(caught).toBeInstanceOf(MarkupParseError)
    expect((caught as MarkupParseError).message).toContain('custom-tag <broken> handler threw: handler logic failed')
    expect((caught as { cause: unknown }).cause).toBe(original)
  })

  it('built-in tags inside custom tag work, custom tags inside built-in work', () => {
    html.define({ h1: c => html`<u>${c}</u>` })

    const out1 = html`<h1>foo <b>bar</b></h1>`

    expect(out1.text).toBe('foo bar')

    const types1 = out1.entities.map(e => e.type).sort()

    expect(types1).toEqual(['bold', 'underline'])

    const out2 = html`<b><h1>nested</h1></b>`

    expect(out2.text).toBe('nested')

    const types2 = out2.entities.map(e => e.type).sort()

    expect(types2).toEqual(['bold', 'underline'])
  })

  it('text-content custom tag receives Formatted with .text accessible', () => {
    let captured = ''

    html.define({
      raw: (c) => {
        captured = c.text

        return c
      }
    })

    html`<raw>some text content</raw>`

    expect(captured).toBe('some text content')
  })

  it('sentinel-laden interpolation passing through a custom tag is literal', () => {
    html.define({ h1: c => c })

    const out = html`<h1>${'</h1>'}</h1>`

    expect(out.text).toBe('</h1>')
  })

  it('htmlb.with preserves <br> handling on the cloned callable', () => {
    const scoped = htmlb.with({ block: c => c })

    const out = scoped`<block>line one<br>line two</block>`

    expect(out.text).toBe('line one\nline two')
  })

  it('handler may emit a different custom tag without triggering depth limit', () => {
    html.define({
      outer: content => html`<inner>${content}</inner>`,
      inner: content => html`<b>${content}</b>`
    })

    const out = html`<outer>x</outer>`

    expect(out.text).toBe('x')
    expect(out.entities).toEqual([{ type: 'bold', offset: 0, length: 1 }])
  })

  it('strips structural whitespace inside a custom-tag parent (jsx-style)', () => {
    html.define({
      ul: content => content,
      li: (content, { index, siblingCount }) =>
        format`${index + 1}. ${content}${index === siblingCount - 1 ? '' : '\n'}`
    })

    // multi-line readable source should produce single newlines between items, not double.
    // (the leading '\n' is parseHtml preserving the template literal's first newline —
    // pre-existing behavior unrelated to custom tags)
    const out = html`
      <ul>
        <li>first</li>
        <li>second</li>
        <li>third</li>
      </ul>
    `

    expect(out.text).toBe('\n1. first\n2. second\n3. third')
  })

  it('preserves whitespace between custom-tag siblings at top level', () => {
    html.define({
      callout: content => html`ℹ ${content}`
    })

    // top-level: source whitespace is the user's literal intent, not structural
    const out = html`<callout>x</callout>
<callout>y</callout>`

    expect(out.text).toBe('ℹ x\nℹ y')
  })

  it('preserves text between custom-tag siblings inside a custom parent', () => {
    html.define({
      wrapper: content => content,
      item: content => format`[${content}]`
    })

    // text content with non-whitespace is preserved; surrounding whitespace stripping
    // only applies to pure-whitespace runs
    const out = html`<wrapper>intro<item>a</item> middle <item>b</item>tail</wrapper>`

    expect(out.text).toBe('intro[a] middle [b]tail')
  })

  it('flattens sentinel chars in attribute values before invoking handler', () => {
    // regression: when an attribute value comes from an interpolation, parseAttrs
    // captures the raw sentinel chars. without resolution the handler would see
    // literal control chars and propagate them into a nested html`` call,
    // surfacing as garbage like '[ 0 :  1 ]' in the final output
    html.define({
      badge: (_content, { attrs }) => html`[${attrs.label ?? '?'}: <b>${attrs.value ?? '0'}</b>]`
    })

    const label = 'health'
    const value = '100'
    const out = html`<badge label="${label}" value="${value}" />`

    expect(out.text).toBe('[health: 100]')
    expect(out.entities).toEqual([{ type: 'bold', offset: 9, length: 3 }])
  })
})

describe('custom tag guards', () => {
  it('rejects a handler result that is not a Formatted', () => {
    const bad = html.with({ bad: () => 'plain' as never })

    expect(() => bad('<bad>x</bad>')).toThrow(MarkupParseError)
    expect(() => html.with({ nil: () => undefined as never })('<nil>x</nil>')).toThrow(MarkupParseError)
    expect(bad.lenient('<bad>x</bad>').text).toBe('<bad>x</bad>')
  })

  it('bounds source nesting instead of overflowing the stack', () => {
    const deep = html.with({ up: (c: Formatted) => c })
    const source = `${'<up>'.repeat(2000)}x${'</up>'.repeat(2000)}`

    expect(() => deep(source)).toThrow(MarkupParseError)
    expect(deep.lenient(source).text).toBe(source)
  })
})
