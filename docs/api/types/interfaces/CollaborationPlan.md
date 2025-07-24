[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [types](../README.md) / CollaborationPlan

# Interface: CollaborationPlan

Defined in: [types/personas.ts:82](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L82)

Collaboration plan for multiple personas

## Properties

### strategy

> **strategy**: [`CollaborationStrategy`](../type-aliases/CollaborationStrategy.md)

Defined in: [types/personas.ts:83](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L83)

***

### leadPersona

> **leadPersona**: `null` \| `string`

Defined in: [types/personas.ts:84](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L84)

***

### consultingPersonas?

> `optional` **consultingPersonas**: `string`[]

Defined in: [types/personas.ts:85](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L85)

***

### collaborationPatterns?

> `optional` **collaborationPatterns**: [`CollaborationPattern`](CollaborationPattern.md)[]

Defined in: [types/personas.ts:86](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L86)

***

### validationChain?

> `optional` **validationChain**: [`ValidationStep`](ValidationStep.md)[]

Defined in: [types/personas.ts:87](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L87)
