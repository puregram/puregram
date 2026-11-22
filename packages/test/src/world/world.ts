import { TestChat } from '../actors/chat'
import { defaultBotIdentity } from '../actors/identity'
import type { TestUser } from '../actors/user'

import { FileStore } from './files'

export class World {
  readonly bot = defaultBotIdentity()
  updateIdCounter = 0
  readonly users: TestUser[] = []
  readonly chats: TestChat[] = []
  readonly files = new FileStore()
  readonly blockedUsers = new Set<number>()

  nextUpdateId () {
    this.updateIdCounter += 1

    return this.updateIdCounter
  }

  findChat (id: number | string) {
    const numeric = typeof id === 'string' ? Number(id) : id

    return this.chats.find(c => c.id === numeric)
  }

  findOrCreatePrivate (id: number) {
    let chat = this.findChat(id)

    if (chat === undefined) {
      chat = new TestChat({ id, type: 'private' })
      this.chats.push(chat)
    }

    return chat
  }
}
