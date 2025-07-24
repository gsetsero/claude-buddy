[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [PersonaSystem](../README.md) / ProcessingResult

# Interface: ProcessingResult

Defined in: [types/api.ts:36](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L36)

Main processing result from PersonaSystem

## Properties

### success

> **success**: `boolean`

Defined in: [types/api.ts:37](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L37)

***

### personas?

> `optional` **personas**: [`PersonaActivationResult`](../../types/interfaces/PersonaActivationResult.md)

Defined in: [types/api.ts:38](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L38)

***

### context

> **context**: [`InputContext`](../../types/interfaces/InputContext.md)

Defined in: [types/api.ts:39](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L39)

***

### prompt

> **prompt**: [`GeneratedPrompt`](../../types/interfaces/GeneratedPrompt.md)

Defined in: [types/api.ts:40](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L40)

***

### flags

> **flags**: [`ParsedFlags`](../../types/interfaces/ParsedFlags.md)

Defined in: [types/api.ts:41](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L41)

***

### validation

> **validation**: [`FlagValidationResult`](../../types/interfaces/FlagValidationResult.md)

Defined in: [types/api.ts:42](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L42)

***

### learning?

> `optional` **learning**: [`LearningRecommendations`](../../types/interfaces/LearningRecommendations.md)

Defined in: [types/api.ts:43](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L43)

***

### error?

> `optional` **error**: `string`

Defined in: [types/api.ts:44](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L44)

***

### details?

> `optional` **details**: `string`

Defined in: [types/api.ts:45](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/api.ts#L45)
