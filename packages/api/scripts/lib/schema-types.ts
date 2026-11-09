export interface SchemaVersion {
  major: number
  minor: number
  patch: number
}

export interface SchemaRecentChanges {
  year: number
  month: number
  day: number
}

export type SchemaTypeRef =
  | { kind: 'integer', min?: number, max?: number, default?: number }
  | { kind: 'string', enumeration?: string[], default?: string, open?: boolean }
  | { kind: 'bool', default?: boolean }
  | { kind: 'float' }
  | { kind: 'true' }
  | { kind: 'reference', name: string, isInternal?: boolean }
  | { kind: 'array', of: SchemaTypeRef }
  | { kind: 'union', of: SchemaTypeRef[] }

export interface SchemaField {
  name: string
  description: string
  required: boolean
  type: SchemaTypeRef
}

export type SchemaObject =
  | {
      kind: 'object'
      name: string
      description: string
      documentationLink?: string
      fields: SchemaField[]
    }
  | {
      kind: 'union'
      name: string
      description: string
      documentationLink?: string
      members: SchemaTypeRef[]
    }
  | {
      kind: 'enum'
      name: string
      description: string
      documentationLink?: string
      values: string[]
    }

export interface SchemaMethod {
  name: string
  description: string
  documentationLink?: string
  multipartOnly: boolean
  arguments: SchemaField[]
  returnType: SchemaTypeRef
}

export interface Schema {
  version: SchemaVersion
  recentChanges: SchemaRecentChanges
  source: {
    core: string
    fetchedAt: string
  }
  methods: SchemaMethod[]
  objects: SchemaObject[]
}
