import { fromBytes } from './bytes'

/** adapter for raw `text/event-stream` bytes — yields each event's `data` as JSON, skipping openai's `[DONE]` */
export async function * fromSSE<T = unknown> (source: AsyncIterable<Uint8Array>): AsyncIterable<T> {
  let buffer = ''
  let data: string[] = []

  function * dispatch () {
    const payload = data.join('\n')

    data = []

    if (payload.length > 0 && payload !== '[DONE]') {
      yield JSON.parse(payload) as T
    }
  }

  function * consume (final: boolean) {
    while (true) {
      const end = buffer.search(/[\r\n]/)

      if (end === -1 || (!final && buffer[end] === '\r' && end === buffer.length - 1)) {
        return
      }

      const line = buffer.slice(0, end)

      buffer = buffer.slice(buffer.startsWith('\r\n', end) ? end + 2 : end + 1)

      if (line.length === 0) {
        yield * dispatch()
      } else if (line.startsWith('data:')) {
        data.push(line.slice(line.startsWith('data: ') ? 6 : 5))
      }
    }
  }

  for await (const text of fromBytes(source)) {
    buffer += text
    yield * consume(false)
  }

  yield * consume(true)
}
