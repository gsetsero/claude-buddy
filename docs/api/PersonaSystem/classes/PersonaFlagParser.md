[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [PersonaSystem](../README.md) / PersonaFlagParser

# Class: PersonaFlagParser

Defined in: [personas/flag-parser.ts:29](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/flag-parser.ts#L29)

## Constructors

### Constructor

> **new PersonaFlagParser**(): `PersonaFlagParser`

Defined in: [personas/flag-parser.ts:33](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/flag-parser.ts#L33)

#### Returns

`PersonaFlagParser`

## Properties

### availablePersonas

> `private` **availablePersonas**: `string`[]

Defined in: [personas/flag-parser.ts:30](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/flag-parser.ts#L30)

***

### flagPatterns

> `private` **flagPatterns**: `FlagPatterns`

Defined in: [personas/flag-parser.ts:31](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/flag-parser.ts#L31)

## Methods

### parseInput()

> **parseInput**(`userInput`): [`ParsedFlags`](../../types/interfaces/ParsedFlags.md)

Defined in: [personas/flag-parser.ts:66](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/flag-parser.ts#L66)

Parse user input for persona-related flags and commands

#### Parameters

##### userInput

`string`

#### Returns

[`ParsedFlags`](../../types/interfaces/ParsedFlags.md)

***

### extractPersonaFlags()

> `private` **extractPersonaFlags**(`input`, `flagType`): `string`[]

Defined in: [personas/flag-parser.ts:135](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/flag-parser.ts#L135)

Extract persona names from specific flag types

#### Parameters

##### input

`string`

##### flagType

keyof `FlagPatterns`

#### Returns

`string`[]

***

### removeFlags()

> `private` **removeFlags**(`input`): `string`

Defined in: [personas/flag-parser.ts:158](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/flag-parser.ts#L158)

Remove all persona-related flags from input

#### Parameters

##### input

`string`

#### Returns

`string`

***

### validateFlags()

> **validateFlags**(`parseResult`): [`FlagValidationResult`](../../types/interfaces/FlagValidationResult.md)

Defined in: [personas/flag-parser.ts:175](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/flag-parser.ts#L175)

Validate parsed flags for conflicts and issues

#### Parameters

##### parseResult

[`ParsedFlags`](../../types/interfaces/ParsedFlags.md)

#### Returns

[`FlagValidationResult`](../../types/interfaces/FlagValidationResult.md)

***

### generateActivationInstructions()

> **generateActivationInstructions**(`parseResult`, `validation`): [`ActivationInstructions`](../../types/interfaces/ActivationInstructions.md)

Defined in: [personas/flag-parser.ts:221](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/flag-parser.ts#L221)

Generate persona activation instructions based on parsed flags

#### Parameters

##### parseResult

[`ParsedFlags`](../../types/interfaces/ParsedFlags.md)

##### validation

[`FlagValidationResult`](../../types/interfaces/FlagValidationResult.md)

#### Returns

[`ActivationInstructions`](../../types/interfaces/ActivationInstructions.md)

***

### generateHelpText()

> **generateHelpText**(): `string`

Defined in: [personas/flag-parser.ts:287](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/flag-parser.ts#L287)

Generate help text for available persona flags

#### Returns

`string`

***

### hasPersonaFlags()

> **hasPersonaFlags**(`input`): `boolean`

Defined in: [personas/flag-parser.ts:321](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/flag-parser.ts#L321)

Quick flag detection - fast check if input contains persona flags

#### Parameters

##### input

`string`

#### Returns

`boolean`

***

### extractCommand()

> **extractCommand**(`input`): `null` \| `string`

Defined in: [personas/flag-parser.ts:328](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/flag-parser.ts#L328)

Extract command name from input (for context-aware flag parsing)

#### Parameters

##### input

`string`

#### Returns

`null` \| `string`

***

### getCommandSuggestions()

> **getCommandSuggestions**(`command`): `string`[]

Defined in: [personas/flag-parser.ts:336](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/flag-parser.ts#L336)

Get command-specific flag suggestions

#### Parameters

##### command

`string`

#### Returns

`string`[]
