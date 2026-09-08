/** thrown by `html` / `htmlb` / `md` parsers on malformed input; carries source-coordinate offset */
export class MarkupParseError extends Error {
  constructor (
    message: string,
    readonly offset: number,
    readonly source: string,
    options?: { cause?: unknown }
  ) {
    super(`${message} at offset ${offset}`, options)
    this.name = 'MarkupParseError'
  }

  get position () {
    return this.offset
  }
}
