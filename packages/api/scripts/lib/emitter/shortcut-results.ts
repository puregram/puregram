import ts from 'typescript'

import type { SchemaTypeRef } from '../schema-types'

import { typeRefToTs } from './ts-factory'

export function hasMessageResult (ref: SchemaTypeRef): boolean {
  if (ref.kind === 'reference') {
    return ref.name === 'Message'
  }

  if (ref.kind === 'array') {
    return hasMessageResult(ref.of)
  }

  return ref.kind === 'union' && ref.of.some(hasMessageResult)
}

export function shortcutResultType (ref: SchemaTypeRef): ts.TypeNode {
  if (ref.kind === 'reference' && ref.name === 'Message') {
    return ts.factory.createTypeReferenceNode('MessageUpdate')
  }

  if (ref.kind === 'array') {
    return ts.factory.createArrayTypeNode(shortcutResultType(ref.of))
  }

  if (ref.kind === 'union') {
    return ts.factory.createUnionTypeNode(ref.of.map(shortcutResultType))
  }

  return typeRefToTs(ref)
}

export function wrapShortcutResult (call: ts.Expression, wrapsMessage = true) {
  if (!wrapsMessage) {
    return call
  }

  return ts.factory.createCallExpression(
    ts.factory.createPropertyAccessExpression(call, 'then'),
    undefined,
    [ts.factory.createArrowFunction(
      undefined,
      undefined,
      [ts.factory.createParameterDeclaration(undefined, undefined, 'result')],
      undefined,
      ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      ts.factory.createCallExpression(ts.factory.createIdentifier('wrapMessageResult'), undefined, [
        ts.factory.createIdentifier('result'),
        ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'tg')
      ])
    )]
  )
}
