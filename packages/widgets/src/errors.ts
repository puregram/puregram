import type { HtmlContext, WidgetHtmlCheck } from './html'

export class WidgetTooLargeError extends Error {
  readonly check: WidgetHtmlCheck

  constructor (check: WidgetHtmlCheck) {
    const reasons = check.problems
      .filter(problem => problem.severity === 'error')
      .map(problem => problem.message)

    super(`widget html does not fit: ${reasons.join('; ')}`)
    this.name = 'WidgetTooLargeError'
    this.check = check
  }
}

export class WidgetStateTooLargeError extends Error {
  readonly bytes: number
  readonly limit: number

  constructor (bytes: number, limit: number) {
    super(`widget state is ${bytes} bytes, max is ${limit}`)
    this.name = 'WidgetStateTooLargeError'
    this.bytes = bytes
    this.limit = limit
  }
}

export class WidgetQueryDataTooLargeError extends Error {
  readonly data: string
  readonly bytes: number

  constructor (data: string, bytes: number, limit: number) {
    super(`widget query data is ${bytes} bytes, max is ${limit}`)
    this.name = 'WidgetQueryDataTooLargeError'
    this.data = data
    this.bytes = bytes
  }
}

export class WidgetHtmlContextError extends Error {
  readonly context: HtmlContext

  constructor (context: HtmlContext, message: string) {
    super(message)
    this.name = 'WidgetHtmlContextError'
    this.context = context
  }
}
