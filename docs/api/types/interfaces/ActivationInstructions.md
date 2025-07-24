[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [types](../README.md) / ActivationInstructions

# Interface: ActivationInstructions

Defined in: [types/context.ts:211](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L211)

Activation instructions for persona manager

## Properties

### mode

> **mode**: `"manual"` \| `"automatic"` \| `"error"`

Defined in: [types/context.ts:212](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L212)

***

### strategy

> **strategy**: `string`

Defined in: [types/context.ts:213](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L213)

***

### personas

> **personas**: `object`

Defined in: [types/context.ts:214](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L214)

#### required

> **required**: `string`[]

#### preferred

> **preferred**: `string`[]

#### focus

> **focus**: `string`[]

***

### collaboration

> **collaboration**: `object`

Defined in: [types/context.ts:219](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L219)

#### enabled

> **enabled**: `boolean`

#### comprehensive

> **comprehensive**: `boolean`

#### singleLeader

> **singleLeader**: `boolean`

***

### learning

> **learning**: `object`

Defined in: [types/context.ts:224](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L224)

#### enabled

> **enabled**: `null` \| `boolean`

#### adaptive

> **adaptive**: `boolean`

***

### validation

> **validation**: [`FlagValidationResult`](FlagValidationResult.md)

Defined in: [types/context.ts:228](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L228)

***

### errors?

> `optional` **errors**: `string`[]

Defined in: [types/context.ts:229](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L229)

***

### fallback?

> `optional` **fallback**: `string`

Defined in: [types/context.ts:230](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L230)
