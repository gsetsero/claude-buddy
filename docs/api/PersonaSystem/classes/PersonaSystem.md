[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [PersonaSystem](../README.md) / PersonaSystem

# Class: PersonaSystem

Defined in: [personas/index.ts:120](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L120)

## PersonaSystem

Main coordinating class for the entire persona system. Provides a unified interface
for persona activation, learning, and collaboration management.

### Responsibilities

- **Initialization**: Sets up all persona system components
- **Input Processing**: Analyzes user input and activates appropriate personas
- **Flag Parsing**: Handles manual persona overrides and configuration flags
- **Learning Integration**: Records usage patterns and adapts behavior
- **Analytics**: Provides performance metrics and usage insights

### Usage Patterns

#### Basic Usage
```typescript
const system = new PersonaSystem();
await system.initialize();
const result = await system.processUserInput("analyze security issues");
```

#### Manual Persona Selection
```typescript
const result = await system.processUserInput(
  "help with performance --persona-security --persona-performance"
);
```

#### Learning and Feedback
```typescript
await system.provideFeedback({
  personas: ["security", "performance"],
  rating: 5,
  comments: "Excellent analysis"
});
```

## Constructors

### Constructor

> **new PersonaSystem**(`configDir?`): `PersonaSystem`

Defined in: [personas/index.ts:136](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L136)

#### Parameters

##### configDir?

`string`

#### Returns

`PersonaSystem`

## Properties

### manager

> `private` **manager**: [`PersonaManager`](PersonaManager.md)

Defined in: [personas/index.ts:122](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L122)

Core persona management component

***

### flagParser

> `private` **flagParser**: [`PersonaFlagParser`](PersonaFlagParser.md)

Defined in: [personas/index.ts:125](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L125)

Flag parsing and validation component

***

### learningEngine

> `private` **learningEngine**: [`PersonaLearningEngine`](PersonaLearningEngine.md)

Defined in: [personas/index.ts:128](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L128)

Learning and adaptation component

***

### isInitialized

> `private` **isInitialized**: `boolean` = `false`

Defined in: [personas/index.ts:131](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L131)

System initialization state

***

### config

> `private` **config**: `unknown` = `null`

Defined in: [personas/index.ts:134](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L134)

System configuration data

## Methods

### Core

#### initialize()

> **initialize**(): `Promise`\<`boolean`\>

Defined in: [personas/index.ts:166](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L166)

Initialize the complete persona system.

Sets up all persona system components including:
- Persona manager with 11 specialized personas
- Auto-activation engine with context detection
- Learning engine with pattern recognition

Must be called before using any other persona system functionality.

##### Returns

`Promise`\<`boolean`\>

Promise resolving to true if initialization succeeds, false otherwise

##### Example

```typescript
const personaSystem = new PersonaSystem();
const success = await personaSystem.initialize();
if (success) {
  console.log("Persona system ready!");
}
```

***

#### processInput()

> **processInput**(`userInput`, `context`): `Promise`\<[`ProcessingResult`](../interfaces/ProcessingResult.md)\>

Defined in: [personas/index.ts:214](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L214)

Process user input and activate appropriate personas.

This is the main entry point for persona system functionality. It:
1. Parses command-line flags for manual persona overrides
2. Validates flag combinations and constraints
3. Applies learning recommendations from previous usage
4. Activates personas through auto-detection or manual selection
5. Records interaction for future learning

##### Parameters

###### userInput

`string`

The user's input string, potentially with persona flags

###### context

`Partial`\<[`InputContext`](../../types/interfaces/InputContext.md)\> = `{}`

Additional context including files, command type, project info

##### Returns

`Promise`\<[`ProcessingResult`](../interfaces/ProcessingResult.md)\>

Promise resolving to processing result with activated personas and prompts

##### Example

```typescript
// Automatic activation based on context
const result = await system.processInput(
  "Review this code for security issues",
  { files: ["auth.ts"], command: "review" }
);

// Manual persona override
const result = await system.processInput(
  "Help with performance --persona-security --persona-performance"
);
```

### Other

#### handleManualActivation()

> `private` **handleManualActivation**(`flagResult`, `context`): `Promise`\<[`PersonaActivationResult`](../../types/interfaces/PersonaActivationResult.md)\>

Defined in: [personas/index.ts:290](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L290)

Handle manual persona activation via flags

##### Parameters

###### flagResult

[`ParsedFlags`](../../types/interfaces/ParsedFlags.md)

###### context

[`InputContext`](../../types/interfaces/InputContext.md)

##### Returns

`Promise`\<[`PersonaActivationResult`](../../types/interfaces/PersonaActivationResult.md)\>

***

#### handleAutoActivation()

> `private` **handleAutoActivation**(`cleanedInput`, `context`): `Promise`\<[`PersonaActivationResult`](../../types/interfaces/PersonaActivationResult.md)\>

Defined in: [personas/index.ts:311](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L311)

Handle automatic persona activation

##### Parameters

###### cleanedInput

`string`

###### context

[`InputContext`](../../types/interfaces/InputContext.md)

##### Returns

`Promise`\<[`PersonaActivationResult`](../../types/interfaces/PersonaActivationResult.md)\>

***

#### recordActivationForLearning()

> `private` **recordActivationForLearning**(`personaResult`, `context`): `void`

Defined in: [personas/index.ts:321](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L321)

Record activation data for learning improvement

##### Parameters

###### personaResult

[`PersonaActivationResult`](../../types/interfaces/PersonaActivationResult.md)

###### context

[`InputContext`](../../types/interfaces/InputContext.md)

##### Returns

`void`

***

#### generateEnhancedPrompt()

> `private` **generateEnhancedPrompt**(`personaResult`, `context`): [`GeneratedPrompt`](../../types/interfaces/GeneratedPrompt.md)

Defined in: [personas/index.ts:343](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L343)

Generate enhanced prompt combining persona content with system integration

##### Parameters

###### personaResult

[`PersonaActivationResult`](../../types/interfaces/PersonaActivationResult.md)

###### context

[`InputContext`](../../types/interfaces/InputContext.md)

##### Returns

[`GeneratedPrompt`](../../types/interfaces/GeneratedPrompt.md)

***

#### provideFeedback()

> **provideFeedback**(`feedback`): `void`

Defined in: [personas/index.ts:388](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L388)

Provide feedback on persona performance for learning

##### Parameters

###### feedback

[`PersonaFeedback`](../../types/interfaces/PersonaFeedback.md)

##### Returns

`void`

***

#### getAnalytics()

> **getAnalytics**(): [`SystemAnalytics`](../interfaces/SystemAnalytics.md)

Defined in: [personas/index.ts:399](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L399)

Get system analytics and performance metrics

##### Returns

[`SystemAnalytics`](../interfaces/SystemAnalytics.md)

***

#### getHelp()

> **getHelp**(): [`PersonaSystemHelp`](../interfaces/PersonaSystemHelp.md)

Defined in: [personas/index.ts:414](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L414)

Get help information for persona system usage

##### Returns

[`PersonaSystemHelp`](../interfaces/PersonaSystemHelp.md)

***

#### reset()

> **reset**(): `Promise`\<`void`\>

Defined in: [personas/index.ts:437](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L437)

Reset system state (useful for new sessions)

##### Returns

`Promise`\<`void`\>

***

#### isReady()

> **isReady**(): `boolean`

Defined in: [personas/index.ts:445](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L445)

Check if persona system is available and ready

##### Returns

`boolean`

***

#### getActivePersonas()

> **getActivePersonas**(): [`ActivePersona`](../../types/interfaces/ActivePersona.md)[]

Defined in: [personas/index.ts:454](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L454)

Get current active personas

##### Returns

[`ActivePersona`](../../types/interfaces/ActivePersona.md)[]

***

#### isPersonaActive()

> **isPersonaActive**(`personaName`): `boolean`

Defined in: [personas/index.ts:461](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L461)

Check if specific persona is currently active

##### Parameters

###### personaName

`string`

##### Returns

`boolean`

***

#### getCommandRecommendations()

> **getCommandRecommendations**(`command`): `string`[]

Defined in: [personas/index.ts:468](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L468)

Get persona-specific recommendations for a command

##### Parameters

###### command

`string`

##### Returns

`string`[]

***

#### createEmptyPrompt()

> `private` **createEmptyPrompt**(): [`GeneratedPrompt`](../../types/interfaces/GeneratedPrompt.md)

Defined in: [personas/index.ts:473](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L473)

##### Returns

[`GeneratedPrompt`](../../types/interfaces/GeneratedPrompt.md)

***

#### createEmptyFlags()

> `private` **createEmptyFlags**(): [`ParsedFlags`](../../types/interfaces/ParsedFlags.md)

Defined in: [personas/index.ts:481](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L481)

##### Returns

[`ParsedFlags`](../../types/interfaces/ParsedFlags.md)

***

#### createEmptyValidation()

> `private` **createEmptyValidation**(): [`FlagValidationResult`](../../types/interfaces/FlagValidationResult.md)

Defined in: [personas/index.ts:505](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/index.ts#L505)

##### Returns

[`FlagValidationResult`](../../types/interfaces/FlagValidationResult.md)
