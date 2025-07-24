[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [types](../README.md) / TypedEventEmitter

# Interface: TypedEventEmitter\<T\>

Defined in: [types/index.ts:123](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/index.ts#L123)

Create a type-safe event emitter interface

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `any`[]\>

## Methods

### on()

> **on**\<`K`\>(`event`, `listener`): `this`

Defined in: [types/index.ts:124](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/index.ts#L124)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### listener

(...`args`) => `void`

#### Returns

`this`

***

### off()

> **off**\<`K`\>(`event`, `listener`): `this`

Defined in: [types/index.ts:125](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/index.ts#L125)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### listener

(...`args`) => `void`

#### Returns

`this`

***

### emit()

> **emit**\<`K`\>(`event`, ...`args`): `boolean`

Defined in: [types/index.ts:126](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/index.ts#L126)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### args

...`T`\[`K`\]

#### Returns

`boolean`
