// fixture-scoped id counters, kept separate from actor identity so payloads stay deterministic
let nextUserId = 1_000_000
let nextChatId = 2_000_000
let nextMessageId = 0
let nextUpdateId = 0
let nextCallbackQueryId = 0
let nextInlineQueryId = 0
let nextWidgetQueryId = 0

export function nextFixtureUserId () {
  nextUserId += 1

  return nextUserId
}

export function nextFixtureChatId () {
  nextChatId += 1

  return nextChatId
}

export function nextFixtureMessageId () {
  nextMessageId += 1

  return nextMessageId
}

export function nextFixtureUpdateId () {
  nextUpdateId += 1

  return nextUpdateId
}

export function nextFixtureCallbackQueryId () {
  nextCallbackQueryId += 1

  return 'cbq_fx_' + nextCallbackQueryId
}

export function nextFixtureInlineQueryId () {
  nextInlineQueryId += 1

  return 'iq_fx_' + nextInlineQueryId
}

export function nextFixtureWidgetQueryId () {
  nextWidgetQueryId += 1

  return 'wq_fx_' + nextWidgetQueryId
}

export function resetFixtureCounters () {
  nextUserId = 1_000_000
  nextChatId = 2_000_000
  nextMessageId = 0
  nextUpdateId = 0
  nextCallbackQueryId = 0
  nextInlineQueryId = 0
  nextWidgetQueryId = 0
}
