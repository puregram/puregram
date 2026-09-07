/** default zoom for `map(...)` blocks when the caller does not pass one; telegram allows 0-24 */
export const DEFAULT_MAP_ZOOM = 15

/** default `map(...)` block size; width + height must not exceed 10000 in total, ratio at most 20 */
export const DEFAULT_MAP_WIDTH = 900
export const DEFAULT_MAP_HEIGHT = 450

/** telegram's map bounds — zoom 0-24, width + height at most 10000, side ratio at most 20 */
export const MAX_MAP_ZOOM = 24
export const MAX_MAP_SIZE = 10000
export const MAX_MAP_RATIO = 20

/** vertical alignment applied to every emitted table cell — the field is required by the bot api */
export const TABLE_CELL_VALIGN = 'middle' as const

/** telegram's per-row cap for `buttonRow(...)` blocks */
export const MAX_BUTTON_ROW_BUTTONS = 8

/** telegram's documented rich-message source cap — exported for reference, not enforced client-side */
export const MAX_RICH_SOURCE_LENGTH = 32768

/**
 * parse-input bound — 4× telegram's message cap, so syntax/escape overhead can never cause a
 * false rejection while pathological lenient-parse input (worst case O(n²)) stays capped
 */
export const MAX_RICH_PARSE_LENGTH = 4 * MAX_RICH_SOURCE_LENGTH

/** parser recursion bound — keeps adversarial nesting off the js stack; telegram itself allows 16 levels */
export const MAX_NESTING_DEPTH = 128
