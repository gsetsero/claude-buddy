[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [PersonaSystem](../README.md) / ParsedPersona

# Interface: ParsedPersona

Defined in: [personas/persona-manager.ts:40](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L40)

Parsed persona with runtime state

## Extends

- [`PersonaConfig`](../../types/interfaces/PersonaConfig.md)

## Properties

### name

> **name**: `string`

Defined in: [personas/persona-manager.ts:41](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L41)

***

### content

> **content**: `string`

Defined in: [personas/persona-manager.ts:42](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L42)

***

### isActive

> **isActive**: `boolean`

Defined in: [personas/persona-manager.ts:43](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L43)

***

### activationReason

> **activationReason**: `null` \| `string`

Defined in: [personas/persona-manager.ts:44](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L44)

***

### confidence

> **confidence**: `number`

Defined in: [personas/persona-manager.ts:45](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L45)

***

### reasoning?

> `optional` **reasoning**: `string`

Defined in: [personas/persona-manager.ts:46](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L46)

***

### category

> **category**: [`PersonaCategory`](../../types/type-aliases/PersonaCategory.md)

Defined in: [types/personas.ts:40](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L40)

#### Inherited from

[`PersonaConfig`](../../types/interfaces/PersonaConfig.md).[`category`](../../types/interfaces/PersonaConfig.md#category)

***

### description

> **description**: `string`

Defined in: [types/personas.ts:41](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L41)

#### Inherited from

[`PersonaConfig`](../../types/interfaces/PersonaConfig.md).[`description`](../../types/interfaces/PersonaConfig.md#description)

***

### specializations

> **specializations**: `string`[]

Defined in: [types/personas.ts:42](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L42)

#### Inherited from

[`PersonaConfig`](../../types/interfaces/PersonaConfig.md).[`specializations`](../../types/interfaces/PersonaConfig.md#specializations)

***

### auto\_activation

> **auto\_activation**: [`AutoActivationConfig`](../../types/interfaces/AutoActivationConfig.md)

Defined in: [types/personas.ts:43](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L43)

#### Inherited from

[`PersonaConfig`](../../types/interfaces/PersonaConfig.md).[`auto_activation`](../../types/interfaces/PersonaConfig.md#auto_activation)

***

### compatible\_with

> **compatible\_with**: `string`[]

Defined in: [types/personas.ts:44](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L44)

#### Inherited from

[`PersonaConfig`](../../types/interfaces/PersonaConfig.md).[`compatible_with`](../../types/interfaces/PersonaConfig.md#compatible_with)

***

### priority\_hierarchy

> **priority\_hierarchy**: `string`[]

Defined in: [types/personas.ts:45](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/personas.ts#L45)

#### Inherited from

[`PersonaConfig`](../../types/interfaces/PersonaConfig.md).[`priority_hierarchy`](../../types/interfaces/PersonaConfig.md#priority_hierarchy)
