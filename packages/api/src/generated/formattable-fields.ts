/// AUTO-GENERATED FILE — do not edit by hand
/// Bot API 10.3
/// source: https://corefork.telegram.org/bots/api
/// generated at: 2026-08-25T14:25:05.655Z
/// see scripts/emit.ts in @puregram/api

export const FORMATTABLE_FIELDS = {
    "answerGuestQuery": [
        {
            path: ["result", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "message_text"],
            textKey: "message_text",
            entitiesKey: "entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "blocks", "*", "animation", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "blocks", "*", "audio", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "blocks", "*", "document", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "blocks", "*", "photo", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "blocks", "*", "video", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "blocks", "*", "voice_note", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "media", "*", "media", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        }
    ],
    "answerInlineQuery": [
        {
            path: ["results", "*", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["results", "*", "input_message_content", "message_text"],
            textKey: "message_text",
            entitiesKey: "entities"
        },
        {
            path: ["results", "*", "input_message_content", "rich_message", "blocks", "*", "animation", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["results", "*", "input_message_content", "rich_message", "blocks", "*", "audio", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["results", "*", "input_message_content", "rich_message", "blocks", "*", "document", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["results", "*", "input_message_content", "rich_message", "blocks", "*", "photo", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["results", "*", "input_message_content", "rich_message", "blocks", "*", "video", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["results", "*", "input_message_content", "rich_message", "blocks", "*", "voice_note", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["results", "*", "input_message_content", "rich_message", "media", "*", "media", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        }
    ],
    "answerWebAppQuery": [
        {
            path: ["result", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "message_text"],
            textKey: "message_text",
            entitiesKey: "entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "blocks", "*", "animation", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "blocks", "*", "audio", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "blocks", "*", "document", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "blocks", "*", "photo", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "blocks", "*", "video", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "blocks", "*", "voice_note", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "media", "*", "media", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        }
    ],
    "copyMessage": [
        {
            path: ["caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "editEphemeralMessageCaption": [
        {
            path: ["caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        }
    ],
    "editEphemeralMessageMedia": [
        {
            path: ["media", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        }
    ],
    "editEphemeralMessageText": [
        {
            path: ["text"],
            textKey: "text",
            entitiesKey: "entities"
        },
        {
            path: ["rich_message", "blocks", "*", "animation", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "audio", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "document", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "photo", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "video", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "voice_note", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "media", "*", "media", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        }
    ],
    "editMessageCaption": [
        {
            path: ["caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        }
    ],
    "editMessageChecklist": [
        {
            path: ["checklist", "title"],
            textKey: "title",
            entitiesKey: "title_entities"
        },
        {
            path: ["checklist", "tasks", "*", "text"],
            textKey: "text",
            entitiesKey: "text_entities"
        }
    ],
    "editMessageMedia": [
        {
            path: ["media", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        }
    ],
    "editMessageText": [
        {
            path: ["text"],
            textKey: "text",
            entitiesKey: "entities"
        },
        {
            path: ["rich_message", "blocks", "*", "animation", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "audio", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "document", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "photo", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "video", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "voice_note", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "media", "*", "media", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        }
    ],
    "editStory": [
        {
            path: ["caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        }
    ],
    "giftPremiumSubscription": [
        {
            path: ["text"],
            textKey: "text",
            entitiesKey: "text_entities"
        }
    ],
    "postStory": [
        {
            path: ["caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        }
    ],
    "savePreparedInlineMessage": [
        {
            path: ["result", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "message_text"],
            textKey: "message_text",
            entitiesKey: "entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "blocks", "*", "animation", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "blocks", "*", "audio", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "blocks", "*", "document", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "blocks", "*", "photo", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "blocks", "*", "video", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "blocks", "*", "voice_note", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["result", "input_message_content", "rich_message", "media", "*", "media", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        }
    ],
    "sendAnimation": [
        {
            path: ["caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendAudio": [
        {
            path: ["caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendChecklist": [
        {
            path: ["checklist", "title"],
            textKey: "title",
            entitiesKey: "title_entities"
        },
        {
            path: ["checklist", "tasks", "*", "text"],
            textKey: "text",
            entitiesKey: "text_entities"
        },
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendContact": [
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendDice": [
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendDocument": [
        {
            path: ["caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendGame": [
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendGift": [
        {
            path: ["text"],
            textKey: "text",
            entitiesKey: "text_entities"
        }
    ],
    "sendInvoice": [
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendLivePhoto": [
        {
            path: ["caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendLocation": [
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendMediaGroup": [
        {
            path: ["media", "*", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendMessage": [
        {
            path: ["text"],
            textKey: "text",
            entitiesKey: "entities"
        },
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendMessageDraft": [
        {
            path: ["text"],
            textKey: "text",
            entitiesKey: "entities"
        }
    ],
    "sendPaidMedia": [
        {
            path: ["caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendPhoto": [
        {
            path: ["caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendPoll": [
        {
            path: ["question"],
            textKey: "question",
            entitiesKey: "question_entities"
        },
        {
            path: ["explanation"],
            textKey: "explanation",
            entitiesKey: "explanation_entities"
        },
        {
            path: ["description"],
            textKey: "description",
            entitiesKey: "description_entities"
        },
        {
            path: ["options", "*", "text"],
            textKey: "text",
            entitiesKey: "text_entities"
        },
        {
            path: ["options", "*", "media", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["explanation_media", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["media", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendRichMessage": [
        {
            path: ["rich_message", "blocks", "*", "animation", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "audio", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "document", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "photo", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "video", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "voice_note", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "media", "*", "media", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendRichMessageDraft": [
        {
            path: ["rich_message", "blocks", "*", "animation", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "audio", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "document", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "photo", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "video", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "blocks", "*", "voice_note", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["rich_message", "media", "*", "media", "caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        }
    ],
    "sendSticker": [
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendVenue": [
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendVideo": [
        {
            path: ["caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendVideoNote": [
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ],
    "sendVoice": [
        {
            path: ["caption"],
            textKey: "caption",
            entitiesKey: "caption_entities"
        },
        {
            path: ["reply_parameters", "quote"],
            textKey: "quote",
            entitiesKey: "quote_entities"
        }
    ]
} as const;