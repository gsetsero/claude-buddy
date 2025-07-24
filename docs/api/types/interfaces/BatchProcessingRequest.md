[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [types](../README.md) / BatchProcessingRequest

# Interface: BatchProcessingRequest

Defined in: [types/api.ts:188](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L188)

Batch processing request

## Properties

### inputs

> **inputs**: `object`[]

Defined in: [types/api.ts:189](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L189)

#### id

> **id**: `string`

#### userInput

> **userInput**: `string`

#### context?

> `optional` **context**: `Partial`\<[`InputContext`](InputContext.md)\>

***

### options?

> `optional` **options**: `object`

Defined in: [types/api.ts:194](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L194)

#### parallel?

> `optional` **parallel**: `boolean`

#### maxConcurrency?

> `optional` **maxConcurrency**: `number`

#### failFast?

> `optional` **failFast**: `boolean`
