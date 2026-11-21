import { MessageEntity } from '../generated/structures'
import type { TelegramMessageEntity } from '../generated/types'

type EntityType = TelegramMessageEntity['type']
type EntityTypes = EntityType | readonly EntityType[]
type EntityProperties = {
  [Key in keyof TelegramMessageEntity]?: TelegramMessageEntity[Key] | readonly TelegramMessageEntity[Key][]
}

export class MessageEntities extends Array<MessageEntity> {
  constructor (raw: readonly TelegramMessageEntity[] | number = 0) {
    super(typeof raw === 'number' ? raw : raw.length)

    if (typeof raw !== 'number') {
      raw.forEach((entity, index) => {
        this[index] = new MessageEntity(entity)
      })
    }
  }

  static get [Symbol.species] () {
    return Array
  }

  get first () {
    return this.at(0)
  }

  get last () {
    return this.at(-1)
  }

  has (types: EntityTypes) {
    return this.some(entity => matchesValue(entity.type, types))
  }

  only (types: EntityTypes) {
    return this.select(entity => matchesValue(entity.type, types))
  }

  except (types: EntityTypes) {
    return this.select(entity => !matchesValue(entity.type, types))
  }

  where (properties: EntityProperties) {
    const keys = Object.keys(properties) as (keyof TelegramMessageEntity)[]

    return this.select(entity => keys.every(key =>
      key in entity.raw && matchesValue(entity.raw[key], properties[key])
    ))
  }

  without (properties: EntityProperties) {
    const keys = Object.keys(properties) as (keyof TelegramMessageEntity)[]

    return this.select(entity => keys.every(key =>
      !(key in entity.raw) || !matchesValue(entity.raw[key], properties[key])
    ))
  }

  atOffset (offset: number) {
    return this.select(entity => entity.offset === offset)
  }

  isEmpty () {
    return this.length === 0
  }

  toJSON () {
    return this.map(entity => entity.raw)
  }

  private select (predicate: (entity: MessageEntity) => boolean) {
    const entities = new MessageEntities()

    this.forEach((entity) => {
      if (predicate(entity)) {
        entities.push(entity)
      }
    })

    return entities
  }
}

function matchesValue (value: unknown, expected: unknown) {
  return Array.isArray(expected) ? expected.includes(value) : value === expected
}
