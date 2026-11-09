import { makeModifier, type Modifier } from './chain'

/** **bold** */
export const bold: Modifier = makeModifier(['bold'])
/** _italic_ */
export const italic: Modifier = makeModifier(['italic'])
/** underlined */
export const underline: Modifier = makeModifier(['underline'])
/** ~strikethrough~ */
export const strikethrough: Modifier = makeModifier(['strikethrough'])
/** spoiler */
export const spoiler: Modifier = makeModifier(['spoiler'])
/** > blockquote */
export const blockquote: Modifier = makeModifier(['blockquote'])
/** > expandable blockquote */
export const expandableBlockquote: Modifier = makeModifier(['expandableBlockquote'])
/** `code` */
export const code: Modifier = makeModifier(['code'])

export const tonAddress: Modifier = makeModifier(['tonAddress'])
export const bankCardNumber: Modifier = makeModifier(['bankCardNumber'])
