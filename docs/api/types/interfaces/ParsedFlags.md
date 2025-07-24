[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [types](../README.md) / ParsedFlags

# Interface: ParsedFlags

Defined in: [types/context.ts:155](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L155)

Parsed flag information

## Properties

### originalInput

> **originalInput**: `string`

Defined in: [types/context.ts:156](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L156)

***

### cleanedInput

> **cleanedInput**: `string`

Defined in: [types/context.ts:157](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L157)

***

### hasFlags

> **hasFlags**: `boolean`

Defined in: [types/context.ts:158](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L158)

***

### personas

> **personas**: `object`

Defined in: [types/context.ts:159](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L159)

#### manual

> **manual**: `string`[]

#### with

> **with**: `string`[]

#### focus

> **focus**: `string`[]

***

### modes

> **modes**: `object`

Defined in: [types/context.ts:164](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L164)

#### comprehensive

> **comprehensive**: `boolean`

#### singlePersona

> **singlePersona**: `boolean`

#### noCollaboration

> **noCollaboration**: `boolean`

#### learn

> **learn**: `null` \| `boolean`

***

### focusAreas

> **focusAreas**: `string`[]

Defined in: [types/context.ts:170](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L170)

***

### confidence

> **confidence**: `object`

Defined in: [types/context.ts:171](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L171)

#### override

> **override**: `null` \| `number`

#### threshold

> **threshold**: `null` \| `number`
