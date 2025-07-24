[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [types](../README.md) / PersonaUsageStats

# Interface: PersonaUsageStats

Defined in: [types/api.ts:159](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L159)

Persona usage statistics

## Properties

### totalActivations

> **totalActivations**: `number`

Defined in: [types/api.ts:160](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L160)

***

### successfulActivations

> **successfulActivations**: `number`

Defined in: [types/api.ts:161](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L161)

***

### averageConfidence

> **averageConfidence**: `number`

Defined in: [types/api.ts:162](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L162)

***

### mostUsedPersonas

> **mostUsedPersonas**: `object`[]

Defined in: [types/api.ts:163](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L163)

#### name

> **name**: `string`

#### count

> **count**: `number`

***

### collaborationPatterns

> **collaborationPatterns**: `object`[]

Defined in: [types/api.ts:164](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L164)

#### pattern

> **pattern**: `string`

#### count

> **count**: `number`

***

### timeRange

> **timeRange**: `object`

Defined in: [types/api.ts:165](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L165)

#### start

> **start**: `string`

#### end

> **end**: `string`
