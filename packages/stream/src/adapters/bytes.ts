/** adapter for an `AsyncIterable<Uint8Array>` — decodes to strings, defaults to utf-8 */
export async function * fromBytes (
  source: AsyncIterable<Uint8Array>,
  encoding: BufferEncoding = 'utf-8'
): AsyncIterable<string> {
  if (encoding !== 'utf8' && encoding !== 'utf-8') {
    const decoderModule = await import('node:string_decoder')
    const decoder = new decoderModule.StringDecoder(encoding)

    for await (const chunk of source) {
      const text = decoder.write(chunk)

      if (text.length > 0) {
        yield text
      }
    }

    const tail = decoder.end()

    if (tail.length > 0) {
      yield tail
    }

    return
  }

  const decoder = new TextDecoder('utf-8', { ignoreBOM: true })

  for await (const chunk of source) {
    const text = decoder.decode(chunk, { stream: true })

    if (text.length > 0) {
      yield text
    }
  }

  const tail = decoder.decode()

  if (tail.length > 0) {
    yield tail
  }
}
