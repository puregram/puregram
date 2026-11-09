import { createHash } from 'node:crypto'
import { runInNewContext } from 'node:vm'
import { deflateSync, inflateSync } from 'node:zlib'

import { deflate } from 'pako'
import { describe, expect, it, vi } from 'vitest'

import { html, js, raw, WIDGET_LIMITS, WidgetHtml, WidgetHtmlContextError, WidgetTooLargeError } from '../src'

let pool = ''

for (let index = 0; pool.length < 20_000; index += 1) {
  pool += createHash('sha256').update(String(index)).digest('hex')
}

const ofCompressedSize = (target: number) => {
  for (let length = target; length < pool.length; length += 1) {
    const candidate = raw(pool.slice(0, length))

    if (candidate.compressedBytes === target) {
      return candidate
    }
  }

  throw new Error(`no prefix compresses to ${target} bytes`)
}

describe('html', () => {
  it('escapes interpolated text', () => {
    const name = '<script>alert("x")</script> & co'

    expect(html`<b>${name}</b>`.source).toBe('<b>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; co</b>')
  })

  it('escapes quotes for attribute context', () => {
    const value = '" onclick=\'steal()\' data-x="'

    expect(html`<div title="${value}" class='${value}'></div>`.source).toBe(
      '<div title="&quot; onclick=&#39;steal()&#39; data-x=&quot;" class=\'&quot; onclick=&#39;steal()&#39; data-x=&quot;\'></div>'
    )
  })

  it('passes raw() and nested WidgetHtml through unescaped', () => {
    const inner = html`<i>${'<b>'}</i>`
    const outer = html`<p>${inner}${raw('<hr>')}</p>`

    expect(outer).toBeInstanceOf(WidgetHtml)
    expect(outer.source).toBe('<p><i>&lt;b&gt;</i><hr></p>')
  })

  it('stringifies numbers and booleans, drops null and undefined, joins arrays', () => {
    const items = ['a', '<b>', html`<br>`]

    expect(html`${1}|${true}|${false}|${null}|${undefined}|${items}|${[[2, 3]]}`.source)
      .toBe('1|true|false|||a&lt;b&gt;<br>|23')
  })

  it('counts utf-8 bytes', () => {
    expect(html`${'привет'}`.bytes).toBe(12)
  })

  it('caches compressedBytes', () => {
    const widget = html`<div>${'x'.repeat(100)}</div>`

    expect(widget.compressedBytes).toBe(deflateSync(widget.source, { level: 9 }).length)
    expect(widget.compressedBytes).toBe(widget.compressedBytes)
    expect(widget.compressedBytes).toBe(deflate(widget.source, { level: 9 }).length)
  })

  it('measures an RFC1950 zlib stream, not gzip or raw deflate', () => {
    const source = '<h3>привет</h3>'
    const compressed = deflate(source, { level: 9 })

    expect(inflateSync(compressed).toString('utf8')).toBe(source)
    expect(raw(source).compressedBytes).toBe(compressed.byteLength)
    expect([...compressed.slice(0, 2)]).toEqual([0x78, 0xda])
  })

  it('checks HTML without a Buffer global', () => {
    vi.stubGlobal('Buffer', undefined)

    try {
      expect(html`<b>${'я'}</b>`.check().ok).toBe(true)
    } finally {
      vi.unstubAllGlobals()
    }
  })
})

const scriptBody = (widget: WidgetHtml) => /<script[^>]*>([\s\S]*?)<\/script>/i.exec(widget.source)?.[1] ?? ''

describe('html in <script> and <style>', () => {
  it('round-trips a js() value as javascript', () => {
    const widget = html`<script>${js("O'Brien & co")}</script>`

    expect(widget.source).toBe('<script>"O\'Brien \\u0026 co"</script>')
    expect(runInNewContext(scriptBody(widget))).toBe("O'Brien & co")
  })

  it('round-trips any json value', () => {
    const value = { name: 'a\u2028b\u2029c', list: [1, true, null, '<>&'], nested: { x: 1.5 } }
    const widget = html`<script>${js(value)}</script>`

    expect(scriptBody(widget)).not.toMatch(/[<>&\u2028\u2029]/)
    expect(runInNewContext(`(${scriptBody(widget)})`)).toEqual(value)
  })

  it('keeps a </script> inside a js() value from breaking out', () => {
    const widget = html`<script>const s = ${js('</script><img src=x onerror=alert(1)>')}</script>`

    expect(widget.source.match(/<\/script/gi)).toHaveLength(1)
    expect(runInNewContext(`${scriptBody(widget)}; s`)).toBe('</script><img src=x onerror=alert(1)>')
  })

  it('refuses plain values and nested html inside <script>', () => {
    expect(() => html`<script>const n = '${"O'Brien"}'</script>`).toThrow(WidgetHtmlContextError)
    expect(() => html`<script>${1}</script>`).toThrow(/js\(value\)/)
    expect(() => html`<script>${null}</script>`).toThrow(WidgetHtmlContextError)
    expect(() => html`<script>${html`<b></b>`}</script>`).toThrow(WidgetHtmlContextError)
    expect(() => html`<script>${[js(1), 2]}</script>`).toThrow(WidgetHtmlContextError)

    try {
      html`<script>${'x'}</script>`
    } catch (error) {
      expect(error).toMatchObject({ name: 'WidgetHtmlContextError', context: 'script' })
    }
  })

  it('passes raw() through inside <script> and <style>', () => {
    expect(html`<script>${raw('go()')}</script><style>${raw('b{color:red}')}</style>`.source)
      .toBe('<script>go()</script><style>b{color:red}</style>')
    expect(html`<script>${[js(1), raw(';'), js(2)]}</script>`.source).toBe('<script>1;2</script>')
  })

  it('refuses everything but raw() inside <style>', () => {
    expect(() => html`<style>b{color:${'red'}}</style>`).toThrow(WidgetHtmlContextError)
    expect(() => html`<style>${js('red')}</style>`).toThrow(WidgetHtmlContextError)
    expect(() => html`<style>${html`b{}`}</style>`).toThrow(WidgetHtmlContextError)
  })

  it('refuses js() outside <script>', () => {
    expect(() => html`<p>${js('x')}</p>`).toThrow(WidgetHtmlContextError)
    expect(() => html`<p title="${js('x')}"></p>`).toThrow(WidgetHtmlContextError)
    expect(() => html`<style></style>${js('x')}`).toThrow(WidgetHtmlContextError)
  })

  it('tracks the context across static parts', () => {
    const widget = html`<p>${'<a>'}</p><script>
const a = ${js(1)}
const b = ${js(2)}
</script><p>${'<b>'}</p><script type="module">${js('<c>')}</script>${'<d>'}`

    expect(widget.source).toBe(
      '<p>&lt;a&gt;</p><script>\nconst a = 1\nconst b = 2\n</script><p>&lt;b&gt;</p>' +
      '<script type="module">"\\u003cc\\u003e"</script>&lt;d&gt;'
    )
  })

  it('matches tags case-insensitively', () => {
    expect(() => html`<SCRIPT>${'x'}</SCRIPT>`).toThrow(WidgetHtmlContextError)
    expect(() => html`<Style>${'x'}</sTyLe>`).toThrow(WidgetHtmlContextError)
    expect(html`<ScRiPt>${js(1)}</sCrIpT>${'<'}`.source).toBe('<ScRiPt>1</sCrIpT>&lt;')
  })

  it('leaves attribute context alone, including the attributes of <script> itself', () => {
    expect(html`<div data-x="${"a'b"}" title='${'"<'}'></div>`.source)
      .toBe('<div data-x="a&#39;b" title=\'&quot;&lt;\'></div>')
    expect(html`<script data-x="${"a'b"}">${js(1)}</script>`.source).toBe('<script data-x="a&#39;b">1</script>')
  })

  it('does not take <scripts> or <styled> for script or style', () => {
    expect(html`<scripts>${'<'}</scripts><styled>${'<'}</styled>`.source).toBe('<scripts>&lt;</scripts><styled>&lt;</styled>')
  })

  it('refuses values JSON cannot represent', () => {
    expect(() => js(undefined)).toThrow(TypeError)
    expect(() => js(() => 1)).toThrow(TypeError)
  })
})

describe('WidgetHtml.check', () => {
  it.each(['', '\0', '<b>hello\0</b>'])('rejects invalid HTML %j', (source) => {
    expect(raw(source).check()).toMatchObject({ ok: false, problems: [{ kind: 'html_invalid', severity: 'error' }] })
  })

  it('accepts the source limit and rejects one byte more', () => {
    const fits = raw('a'.repeat(WIDGET_LIMITS.htmlBytes)).check()
    const over = raw('a'.repeat(WIDGET_LIMITS.htmlBytes + 1)).check()

    expect(fits.ok).toBe(true)
    expect(over.ok).toBe(false)
    expect(over.problems.map(problem => problem.kind)).toEqual(['html_too_large'])
  })

  it('uses the official 4096-byte compressed limit', () => {
    expect(WIDGET_LIMITS.compressedHtmlBytes).toBe(4096)
  })

  it('accepts the compressed limit and rejects one byte more', () => {
    const atLimit = ofCompressedSize(WIDGET_LIMITS.compressedHtmlBytes)
    const overLimit = ofCompressedSize(WIDGET_LIMITS.compressedHtmlBytes + 1)

    expect(atLimit.compressedBytes).toBe(WIDGET_LIMITS.compressedHtmlBytes)
    expect(atLimit.check().ok).toBe(true)
    expect(atLimit.check().problems.map(problem => problem.kind)).toEqual(['compressed_near_limit'])

    expect(overLimit.compressedBytes).toBe(WIDGET_LIMITS.compressedHtmlBytes + 1)
    expect(overLimit.check().ok).toBe(false)
    expect(overLimit.check().problems.map(problem => problem.kind)).toEqual(['compressed_too_large'])
  })

  it('warns above the 3800-byte target', () => {
    const below = ofCompressedSize(WIDGET_LIMITS.compressedHtmlWarnBytes)
    const above = ofCompressedSize(WIDGET_LIMITS.compressedHtmlWarnBytes + 1)

    expect(below.check().problems).toEqual([])
    expect(above.check()).toMatchObject({ ok: true, problems: [{ kind: 'compressed_near_limit', severity: 'warning' }] })
  })

  it('flags remote resources as warnings', () => {
    const check = raw(
      '<img src="https://x.y/a.png"><link rel="stylesheet" href="https://x.y/a.css">' +
      '<style>@import url(https://x.y/b.css);.a{background:url(//x.y/c.png)}</style>'
    ).check()

    expect(check.ok).toBe(true)
    expect(check.problems.map(problem => problem.kind)).toEqual([
      'external_resource', 'external_resource', 'external_resource', 'external_resource'
    ])
  })

  it('does not flag links or data: urls', () => {
    const check = raw('<a href="https://t.me/x">x</a><img src="data:image/png;base64,AA"><b style="background:url(#g)"></b>')
      .check()

    expect(check.problems).toEqual([])
  })

  it('assertFits throws a typed error carrying the check', () => {
    const widget = raw('a'.repeat(WIDGET_LIMITS.htmlBytes + 1))

    expect(() => widget.assertFits()).toThrow(WidgetTooLargeError)

    try {
      widget.assertFits()
    } catch (error) {
      expect((error as WidgetTooLargeError).check.bytes).toBe(WIDGET_LIMITS.htmlBytes + 1)
    }

    expect(raw('<b>ok</b>').assertFits().source).toBe('<b>ok</b>')
  })
})
