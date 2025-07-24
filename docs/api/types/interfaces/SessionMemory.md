[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [types](../README.md) / SessionMemory

# Interface: SessionMemory

Defined in: [types/personas.ts:130](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L130)

Session memory for learning and adaptation

## Properties

### interactions

> **interactions**: [`PersonaInteraction`](PersonaInteraction.md)[]

Defined in: [types/personas.ts:131](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L131)

***

### preferences

> **preferences**: `Record`\<`string`, `unknown`\>

Defined in: [types/personas.ts:132](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L132)

***

### successfulPatterns

> **successfulPatterns**: `SuccessfulPattern`[]

Defined in: [types/personas.ts:133](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L133)

***

### feedbackHistory

> **feedbackHistory**: `FeedbackRecord`[]

Defined in: [types/personas.ts:134](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L134)

***

### activationHistory

> **activationHistory**: `ActivationHistory`[]

Defined in: [types/personas.ts:135](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L135)

***

### lastAnalysis?

> `optional` **lastAnalysis**: `Date`

Defined in: [types/personas.ts:136](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L136)
