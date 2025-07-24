[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [types](../README.md) / BatchProcessingResult

# Interface: BatchProcessingResult

Defined in: [types/api.ts:204](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L204)

Batch processing result

## Properties

### results

> **results**: `object`[]

Defined in: [types/api.ts:205](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L205)

#### id

> **id**: `string`

#### success

> **success**: `boolean`

#### result?

> `optional` **result**: [`ProcessingResult`](../../PersonaSystem/interfaces/ProcessingResult.md)

#### error?

> `optional` **error**: [`PersonaSystemError`](PersonaSystemError.md)

***

### summary

> **summary**: `object`

Defined in: [types/api.ts:211](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L211)

#### total

> **total**: `number`

#### successful

> **successful**: `number`

#### failed

> **failed**: `number`

#### totalTime

> **totalTime**: `number`

#### averageTime

> **averageTime**: `number`
