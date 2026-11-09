export const WIDGET_LIMITS = {
  htmlBytes: 32768,
  compressedHtmlBytes: 4096,
  compressedHtmlWarnBytes: 3800,
  stateBytes: 1024,
  queryDataBytes: 64,
  cacheTimeMin: 5,
  cacheTimeMax: 3600
} as const

const encoder = new TextEncoder()

export const utf8Length = (value: string) => encoder.encode(value).byteLength
