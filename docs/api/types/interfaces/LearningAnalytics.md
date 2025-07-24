[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [types](../README.md) / LearningAnalytics

# Interface: LearningAnalytics

Defined in: [types/personas.ts:218](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L218)

Learning engine analytics

## Properties

### sessionStats

> **sessionStats**: `object`

Defined in: [types/personas.ts:219](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L219)

#### interactions

> **interactions**: `number`

#### feedback

> **feedback**: `number`

#### patterns

> **patterns**: `number`

#### sessionDuration

> **sessionDuration**: `number`

***

### persistentStats

> **persistentStats**: `object`

Defined in: [types/personas.ts:225](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L225)

#### successfulPatterns

> **successfulPatterns**: `number`

#### failedPatterns

> **failedPatterns**: `number`

#### totalLearningEvents

> **totalLearningEvents**: `number`

***

### learningEffectiveness

> **learningEffectiveness**: `number`

Defined in: [types/personas.ts:230](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L230)

***

### topPatterns

> **topPatterns**: `object`[]

Defined in: [types/personas.ts:231](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L231)

#### pattern

> **pattern**: `string`

#### usage

> **usage**: `number`

#### rating

> **rating**: `number`

#### personas

> **personas**: `string`[]

***

### recommendations

> **recommendations**: `object`[]

Defined in: [types/personas.ts:237](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L237)

#### type

> **type**: `string`

#### message

> **message**: `string`

#### priority

> **priority**: `string`
