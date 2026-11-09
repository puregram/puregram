/// AUTO-GENERATED FILE — do not edit by hand
/// Bot API 10.4
/// source: https://core.telegram.org/bots/api
/// generated at: 2026-11-09T13:32:34.299Z
/// see scripts/emit.ts in @puregram/api

import type { TelegramInlineQueryResultArticle, TelegramInlineQueryResultAudio, TelegramInlineQueryResultCachedAudio, TelegramInlineQueryResultCachedDocument, TelegramInlineQueryResultCachedGif, TelegramInlineQueryResultCachedMpeg4Gif, TelegramInlineQueryResultCachedPhoto, TelegramInlineQueryResultCachedSticker, TelegramInlineQueryResultCachedVideo, TelegramInlineQueryResultCachedVoice, TelegramInlineQueryResultContact, TelegramInlineQueryResultDocument, TelegramInlineQueryResultGame, TelegramInlineQueryResultGif, TelegramInlineQueryResultLocation, TelegramInlineQueryResultMpeg4Gif, TelegramInlineQueryResultPhoto, TelegramInlineQueryResultVenue, TelegramInlineQueryResultVideo, TelegramInlineQueryResultVoice, TelegramInputMediaAnimation, TelegramInputMediaAudio, TelegramInputMediaDocument, TelegramInputMediaLink, TelegramInputMediaLivePhoto, TelegramInputMediaLocation, TelegramInputMediaPhoto, TelegramInputMediaSticker, TelegramInputMediaVenue, TelegramInputMediaVideo, TelegramInputMediaVoiceNote, TelegramInputPaidMediaLivePhoto, TelegramInputPaidMediaPhoto, TelegramInputPaidMediaVideo, TelegramInputProfilePhotoAnimated, TelegramInputProfilePhotoStatic, TelegramInputStoryContentPhoto, TelegramInputStoryContentVideo } from "./types";
export class InputMedia {
    /**
     * Represents an animation file (GIF or H.264/MPEG-4 AVC video without sound) to be sent.
     */
    static animation(params: Omit<TelegramInputMediaAnimation, "type">): TelegramInputMediaAnimation {
        return {
            type: "animation",
            ...params
        };
    }
    /**
     * Represents an audio file to be treated as music to be sent.
     */
    static audio(params: Omit<TelegramInputMediaAudio, "type">): TelegramInputMediaAudio {
        return {
            type: "audio",
            ...params
        };
    }
    /**
     * Represents a general file to be sent.
     */
    static document(params: Omit<TelegramInputMediaDocument, "type">): TelegramInputMediaDocument {
        return {
            type: "document",
            ...params
        };
    }
    /**
     * Represents an HTTP link to be sent.
     */
    static link(params: Omit<TelegramInputMediaLink, "type">): TelegramInputMediaLink {
        return {
            type: "link",
            ...params
        };
    }
    /**
     * Represents a live photo to be sent.
     */
    static livePhoto(params: Omit<TelegramInputMediaLivePhoto, "type">): TelegramInputMediaLivePhoto {
        return {
            type: "live_photo",
            ...params
        };
    }
    /**
     * Represents a location to be sent.
     */
    static location(params: Omit<TelegramInputMediaLocation, "type">): TelegramInputMediaLocation {
        return {
            type: "location",
            ...params
        };
    }
    /**
     * Represents a photo to be sent.
     */
    static photo(params: Omit<TelegramInputMediaPhoto, "type">): TelegramInputMediaPhoto {
        return {
            type: "photo",
            ...params
        };
    }
    /**
     * Represents a sticker file to be sent.
     */
    static sticker(params: Omit<TelegramInputMediaSticker, "type">): TelegramInputMediaSticker {
        return {
            type: "sticker",
            ...params
        };
    }
    /**
     * Represents a venue to be sent.
     */
    static venue(params: Omit<TelegramInputMediaVenue, "type">): TelegramInputMediaVenue {
        return {
            type: "venue",
            ...params
        };
    }
    /**
     * Represents a video to be sent.
     */
    static video(params: Omit<TelegramInputMediaVideo, "type">): TelegramInputMediaVideo {
        return {
            type: "video",
            ...params
        };
    }
    /**
     * Represents a voice message file to be sent.
     */
    static voiceNote(params: Omit<TelegramInputMediaVoiceNote, "type">): TelegramInputMediaVoiceNote {
        return {
            type: "voice_note",
            ...params
        };
    }
}

export class InputPaidMedia {
    /**
     * The paid media to send is a live photo.
     */
    static livePhoto(params: Omit<TelegramInputPaidMediaLivePhoto, "type">): TelegramInputPaidMediaLivePhoto {
        return {
            type: "live_photo",
            ...params
        };
    }
    /**
     * The paid media to send is a photo.
     */
    static photo(params: Omit<TelegramInputPaidMediaPhoto, "type">): TelegramInputPaidMediaPhoto {
        return {
            type: "photo",
            ...params
        };
    }
    /**
     * The paid media to send is a video.
     */
    static video(params: Omit<TelegramInputPaidMediaVideo, "type">): TelegramInputPaidMediaVideo {
        return {
            type: "video",
            ...params
        };
    }
}

export class InputProfilePhoto {
    /**
     * An animated profile photo in the MPEG4 format.
     */
    static animated(params: Omit<TelegramInputProfilePhotoAnimated, "type">): TelegramInputProfilePhotoAnimated {
        return {
            type: "animated",
            ...params
        };
    }
    /**
     * A static profile photo in the .JPG format.
     */
    static static(params: Omit<TelegramInputProfilePhotoStatic, "type">): TelegramInputProfilePhotoStatic {
        return {
            type: "static",
            ...params
        };
    }
}

export class InputStoryContent {
    /**
     * Describes a photo to post as a story.
     */
    static photo(params: Omit<TelegramInputStoryContentPhoto, "type">): TelegramInputStoryContentPhoto {
        return {
            type: "photo",
            ...params
        };
    }
    /**
     * Describes a video to post as a story.
     */
    static video(params: Omit<TelegramInputStoryContentVideo, "type">): TelegramInputStoryContentVideo {
        return {
            type: "video",
            ...params
        };
    }
}

export class InlineQueryResult {
    /**
     * Represents a link to an article or web page.
     */
    static article(params: Omit<TelegramInlineQueryResultArticle, "type">): TelegramInlineQueryResultArticle {
        return {
            type: "article",
            ...params
        };
    }
    /**
     * Represents a link to an MP3 audio file. By default, this audio file will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the audio.
     */
    static audio(params: Omit<TelegramInlineQueryResultAudio, "type">): TelegramInlineQueryResultAudio {
        return {
            type: "audio",
            ...params
        };
    }
    /**
     * Represents a contact with a phone number. By default, this contact will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the contact.
     */
    static contact(params: Omit<TelegramInlineQueryResultContact, "type">): TelegramInlineQueryResultContact {
        return {
            type: "contact",
            ...params
        };
    }
    /**
     * Represents a link to a file. By default, this file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the file. Currently, only .PDF and .ZIP files can be sent using this method.
     */
    static document(params: Omit<TelegramInlineQueryResultDocument, "type">): TelegramInlineQueryResultDocument {
        return {
            type: "document",
            ...params
        };
    }
    /**
     * Represents a Game.
     */
    static game(params: Omit<TelegramInlineQueryResultGame, "type">): TelegramInlineQueryResultGame {
        return {
            type: "game",
            ...params
        };
    }
    /**
     * Represents a link to an animated GIF file. By default, this animated GIF file will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation.
     */
    static gif(params: Omit<TelegramInlineQueryResultGif, "type">): TelegramInlineQueryResultGif {
        return {
            type: "gif",
            ...params
        };
    }
    /**
     * Represents a location on a map. By default, the location will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the location.
     */
    static location(params: Omit<TelegramInlineQueryResultLocation, "type">): TelegramInlineQueryResultLocation {
        return {
            type: "location",
            ...params
        };
    }
    /**
     * Represents a link to a video animation (H.264/MPEG-4 AVC video without sound). By default, this animated MPEG-4 file will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation.
     */
    static mpeg4Gif(params: Omit<TelegramInlineQueryResultMpeg4Gif, "type">): TelegramInlineQueryResultMpeg4Gif {
        return {
            type: "mpeg4_gif",
            ...params
        };
    }
    /**
     * Represents a link to a photo. By default, this photo will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the photo.
     */
    static photo(params: Omit<TelegramInlineQueryResultPhoto, "type">): TelegramInlineQueryResultPhoto {
        return {
            type: "photo",
            ...params
        };
    }
    /**
     * Represents a venue. By default, the venue will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the venue.
     */
    static venue(params: Omit<TelegramInlineQueryResultVenue, "type">): TelegramInlineQueryResultVenue {
        return {
            type: "venue",
            ...params
        };
    }
    /**
     * Represents a link to a page containing an embedded video player or a video file. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the video.
     */
    static video(params: Omit<TelegramInlineQueryResultVideo, "type">): TelegramInlineQueryResultVideo {
        return {
            type: "video",
            ...params
        };
    }
    /**
     * Represents a link to a voice recording in an .OGG container encoded with OPUS. By default, this voice recording will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the the voice message.
     */
    static voice(params: Omit<TelegramInlineQueryResultVoice, "type">): TelegramInlineQueryResultVoice {
        return {
            type: "voice",
            ...params
        };
    }
}

export class InlineQueryResultCached {
    /**
     * Represents a link to an MP3 audio file stored on the Telegram servers. By default, this audio file will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the audio.
     */
    static audio(params: Omit<TelegramInlineQueryResultCachedAudio, "type">): TelegramInlineQueryResultCachedAudio {
        return {
            type: "audio",
            ...params
        };
    }
    /**
     * Represents a link to a file stored on the Telegram servers. By default, this file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the file.
     */
    static document(params: Omit<TelegramInlineQueryResultCachedDocument, "type">): TelegramInlineQueryResultCachedDocument {
        return {
            type: "document",
            ...params
        };
    }
    /**
     * Represents a link to an animated GIF file stored on the Telegram servers. By default, this animated GIF file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with specified content instead of the animation.
     */
    static gif(params: Omit<TelegramInlineQueryResultCachedGif, "type">): TelegramInlineQueryResultCachedGif {
        return {
            type: "gif",
            ...params
        };
    }
    /**
     * Represents a link to a video animation (H.264/MPEG-4 AVC video without sound) stored on the Telegram servers. By default, this animated MPEG-4 file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation.
     */
    static mpeg4Gif(params: Omit<TelegramInlineQueryResultCachedMpeg4Gif, "type">): TelegramInlineQueryResultCachedMpeg4Gif {
        return {
            type: "mpeg4_gif",
            ...params
        };
    }
    /**
     * Represents a link to a photo stored on the Telegram servers. By default, this photo will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the photo.
     */
    static photo(params: Omit<TelegramInlineQueryResultCachedPhoto, "type">): TelegramInlineQueryResultCachedPhoto {
        return {
            type: "photo",
            ...params
        };
    }
    /**
     * Represents a link to a sticker stored on the Telegram servers. By default, this sticker will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the sticker.
     */
    static sticker(params: Omit<TelegramInlineQueryResultCachedSticker, "type">): TelegramInlineQueryResultCachedSticker {
        return {
            type: "sticker",
            ...params
        };
    }
    /**
     * Represents a link to a video file stored on the Telegram servers. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the video.
     */
    static video(params: Omit<TelegramInlineQueryResultCachedVideo, "type">): TelegramInlineQueryResultCachedVideo {
        return {
            type: "video",
            ...params
        };
    }
    /**
     * Represents a link to a voice message stored on the Telegram servers. By default, this voice message will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the voice message.
     */
    static voice(params: Omit<TelegramInlineQueryResultCachedVoice, "type">): TelegramInlineQueryResultCachedVoice {
        return {
            type: "voice",
            ...params
        };
    }
}