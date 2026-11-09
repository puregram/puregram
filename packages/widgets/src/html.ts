import { deflate } from 'pako'
import { Tokenizer, TokenizerMode } from 'parse5'

import { WidgetHtmlContextError, WidgetTooLargeError } from './errors'
import { utf8Length, WIDGET_LIMITS } from './limits'

export type WidgetHtmlProblemKind =
  | 'html_too_large'
  | 'html_invalid'
  | 'compressed_too_large'
  | 'compressed_near_limit'
  | 'external_resource'

export interface WidgetHtmlProblem {
  kind: WidgetHtmlProblemKind
  severity: 'error' | 'warning'
  message: string
}

export interface WidgetHtmlCheck {
  ok: boolean
  bytes: number
  compressedBytes: number
  problems: WidgetHtmlProblem[]
}

const ESCAPES: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

const EXTERNAL_RESOURCES: readonly (readonly [RegExp, string])[] = [
  [/\bsrc\s*=\s*["']?\s*(?:https?:)?\/\//i, 'a remote src= is never loaded'],
  [/<link\b[^>]*\brel\s*=\s*["']?stylesheet/i, '<link rel=stylesheet> is never loaded, inline the css'],
  [/@import\b/i, '@import is outside the widget profile'],
  [/\burl\(\s*["']?\s*(?:https?:)?\/\//i, 'a remote css url() is never loaded']
]

export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ESCAPES[char] ?? char)

export class WidgetHtml {
  readonly source: string
  private compressed: number | undefined

  constructor (source: string) {
    this.source = source
  }

  get bytes () {
    return utf8Length(this.source)
  }

  get compressedBytes () {
    this.compressed ??= deflate(this.source, { level: 9 }).length

    return this.compressed
  }

  check () {
    const bytes = this.bytes
    const compressedBytes = this.compressedBytes
    const problems: WidgetHtmlProblem[] = []

    if (bytes === 0 || this.source.includes('\0')) {
      problems.push({
        kind: 'html_invalid',
        severity: 'error',
        message: 'html must be non-empty and contain no NUL characters'
      })
    }

    if (bytes > WIDGET_LIMITS.htmlBytes) {
      problems.push({
        kind: 'html_too_large',
        severity: 'error',
        message: `html is ${bytes} bytes, max is ${WIDGET_LIMITS.htmlBytes}`
      })
    }

    if (compressedBytes > WIDGET_LIMITS.compressedHtmlBytes) {
      problems.push({
        kind: 'compressed_too_large',
        severity: 'error',
        message: `html compresses to ${compressedBytes} bytes, max is ${WIDGET_LIMITS.compressedHtmlBytes}`
      })
    } else if (compressedBytes > WIDGET_LIMITS.compressedHtmlWarnBytes) {
      problems.push({
        kind: 'compressed_near_limit',
        severity: 'warning',
        message: `html compresses to ${compressedBytes} bytes, aim for ${WIDGET_LIMITS.compressedHtmlWarnBytes}`
      })
    }

    for (const [pattern, message] of EXTERNAL_RESOURCES) {
      const match = pattern.exec(this.source)

      if (match !== null) {
        problems.push({ kind: 'external_resource', severity: 'warning', message: `${message}: ${match[0]}` })
      }
    }

    const result: WidgetHtmlCheck = {
      ok: problems.every(problem => problem.severity !== 'error'),
      bytes,
      compressedBytes,
      problems
    }

    return result
  }

  assertFits () {
    const check = this.check()

    if (!check.ok) {
      throw new WidgetTooLargeError(check)
    }

    return this
  }

  toString () {
    return this.source
  }
}

export class WidgetJs {
  readonly source: string

  constructor (source: string) {
    this.source = source
  }
}

export type HtmlValue = string | number | boolean | null | undefined | WidgetHtml | WidgetJs | readonly HtmlValue[]

export type HtmlContext = 'markup' | 'script' | 'style'

interface ScanState {
  context: HtmlContext
  tokenizer: Tokenizer
}

const TRUSTED = new WeakSet<WidgetHtml>()

const JS_ESCAPES: Readonly<Record<string, string>> = {
  '<': '\\u003c',
  '>': '\\u003e',
  '&': '\\u0026',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029'
}

function createScanState () {
  const ignore = () => {}
  const state: ScanState = {
    context: 'markup',
    tokenizer: new Tokenizer({}, {
      onStartTag ({ tagName }) {
        switch (tagName) {
          case 'script':
            state.context = 'script'
            state.tokenizer.state = TokenizerMode.SCRIPT_DATA
            break
          case 'style':
            state.context = 'style'
            state.tokenizer.state = TokenizerMode.RAWTEXT
            break
          case 'title':
          case 'textarea':
            state.tokenizer.state = TokenizerMode.RCDATA
            break
          case 'xmp':
          case 'iframe':
          case 'noembed':
          case 'noframes':
          case 'noscript':
            state.tokenizer.state = TokenizerMode.RAWTEXT
            break
          case 'plaintext':
            state.tokenizer.state = TokenizerMode.PLAINTEXT
            break
        }
      },
      onEndTag () {
        state.context = 'markup'
      },
      onComment: ignore,
      onDoctype: ignore,
      onEof: ignore,
      onCharacter: ignore,
      onNullCharacter: ignore,
      onWhitespaceCharacter: ignore
    })
  }

  return state
}

function renderValue (value: HtmlValue, context: HtmlContext) {
  if (value instanceof WidgetJs) {
    if (context !== 'script') {
      throw new WidgetHtmlContextError(context, 'js() values only belong inside <script>')
    }

    return value.source
  }

  if (value instanceof WidgetHtml && TRUSTED.has(value)) {
    return value.source
  }

  if (context === 'script') {
    throw new WidgetHtmlContextError(
      context,
      value instanceof WidgetHtml
        ? 'html`` cannot be nested inside <script>, use js(value) for data or raw() for trusted code'
        : 'a plain value cannot be interpolated inside <script>, wrap it in js(value)'
    )
  }

  if (context === 'style') {
    throw new WidgetHtmlContextError(context, 'only raw() can be interpolated inside <style>')
  }

  if (value === null || value === undefined) {
    return ''
  }

  if (value instanceof WidgetHtml) {
    return value.source
  }

  return escapeHtml(String(value))
}

function render (value: HtmlValue, state: ScanState): string {
  if (Array.isArray(value)) {
    return (value as readonly HtmlValue[]).map(item => render(item, state)).join('')
  }

  const source = renderValue(value, state.context)

  state.tokenizer.write(source, false)

  return source
}

export function js (value: unknown) {
  const json = JSON.stringify(value) as string | undefined

  if (json === undefined) {
    throw new TypeError('js() takes a JSON-serializable value')
  }

  return new WidgetJs(json.replace(/[<>&\u2028\u2029]/g, char => JS_ESCAPES[char] ?? char))
}

export function raw (source: string) {
  const trusted = new WidgetHtml(source)

  TRUSTED.add(trusted)

  return trusted
}

export function html (strings: TemplateStringsArray, ...values: HtmlValue[]) {
  let source = strings[0] ?? ''

  if (values.length === 0) {
    return new WidgetHtml(source)
  }

  const state = createScanState()

  state.tokenizer.write(source, false)

  for (let index = 0; index < values.length; index += 1) {
    const next = strings[index + 1] ?? ''

    source += render(values[index], state) + next
    state.tokenizer.write(next, false)
  }

  return new WidgetHtml(source)
}
