import type { TelegramEphemeralMessageParameters, TelegramReplyParameters } from './generated/types'

interface EphemeralMessageLike {
  ephemeral_message_id?: number
  receiver_user?: { id: number }
  from?: { id: number, is_bot: boolean }
  chat?: { id: number | string }
}

// on an incoming ephemeral command `receiver_user` is the BOT (it received the command),
// while `from` is the human; on the bot's own sent messages it is the inverse — the
// ephemeral counterparty is always the non-bot side
function nonBotParty (raw: EphemeralMessageLike) {
  if (raw.from !== undefined && !raw.from.is_bot) {
    return raw.from.id
  }

  return raw.receiver_user?.id
}

interface EphemeralSendOverrides {
  ephemeral_message_parameters?: TelegramEphemeralMessageParameters
  reply_parameters?: TelegramReplyParameters
  /** pass `false` to skip ephemeral auto-injection and send a regular message */
  ephemeral?: boolean
}

/**
 * ephemeral auto-injection for send-family shortcuts: an incoming ephemeral message can only
 * be answered ephemerally (within 15s, authorized by `reply_parameters.ephemeral_message_id`),
 * so sends from such a context fill `ephemeral_message_parameters` + the ephemeral reply anchor.
 * explicit call-site values win field by field; `ephemeral: false` opts out; non-ephemeral
 * contexts contribute nothing. the flag itself never reaches the wire — `undefined` drops at
 * serialization, shadowing the value the params spread carried
 */
export function ephemeralSendParams (raw: EphemeralMessageLike, params: EphemeralSendOverrides) {
  const scrub = 'ephemeral' in params ? { ephemeral: undefined } : {}

  if (raw.ephemeral_message_id == null) {
    if (params.ephemeral === true) {
      throw new TypeError('ephemeral: true needs an ephemeral context — this message carries no ephemeral_message_id')
    }

    return scrub
  }

  if (params.ephemeral === false) {
    return scrub
  }

  const receiver = params.ephemeral_message_parameters?.receiver_user_id ?? nonBotParty(raw)

  return {
    ...scrub,
    ...(receiver === undefined
      ? {}
      : {
          ephemeral_message_parameters: {
            receiver_user_id: receiver,
            ...params.ephemeral_message_parameters
          }
        }),
    reply_parameters: { ephemeral_message_id: raw.ephemeral_message_id, ...params.reply_parameters }
  }
}

/**
 * the target triple the `editEphemeralMessage*` / `deleteEphemeralMessage` twins require;
 * `undefined` when the wrapped message is not ephemeral (or lacks a resolvable receiver)
 */
export function ephemeralTarget (raw: EphemeralMessageLike) {
  if (raw.ephemeral_message_id == null || raw.chat === undefined) {
    return undefined
  }

  const receiver = nonBotParty(raw)

  if (receiver === undefined) {
    return undefined
  }

  return {
    chat_id: raw.chat.id,
    receiver_user_id: receiver,
    ephemeral_message_id: raw.ephemeral_message_id
  }
}

export function callbackEphemeralParams (queryId: string, params: EphemeralSendOverrides) {
  const scrub = 'ephemeral' in params ? { ephemeral: undefined } : {}
  const parameters = params.ephemeral_message_parameters ?? (params.ephemeral === true ? {} : undefined)

  return parameters !== undefined
    ? {
        ...scrub,
        ephemeral_message_parameters: { ...parameters, callback_query_id: parameters.callback_query_id ?? queryId }
      }
    : scrub
}
