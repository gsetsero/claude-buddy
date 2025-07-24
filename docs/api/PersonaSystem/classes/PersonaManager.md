[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [PersonaSystem](../README.md) / PersonaManager

# Class: PersonaManager

Defined in: [personas/persona-manager.ts:55](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L55)

## Constructors

### Constructor

> **new PersonaManager**(`configDir?`): `PersonaManager`

Defined in: [personas/persona-manager.ts:73](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L73)

#### Parameters

##### configDir?

`string`

#### Returns

`PersonaManager`

## Properties

### configDir

> `private` **configDir**: `string`

Defined in: [personas/persona-manager.ts:56](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L56)

***

### specialistsDir

> `private` **specialistsDir**: `string`

Defined in: [personas/persona-manager.ts:57](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L57)

***

### activationEngine

> `private` **activationEngine**: [`PersonaActivationEngine`](PersonaActivationEngine.md)

Defined in: [personas/persona-manager.ts:58](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L58)

***

### config

> `private` **config**: `any` = `null`

Defined in: [personas/persona-manager.ts:60](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L60)

***

### personas

> **personas**: `Map`\<`string`, [`ParsedPersona`](../interfaces/ParsedPersona.md)\>

Defined in: [personas/persona-manager.ts:61](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L61)

***

### activePersonas

> **activePersonas**: [`ParsedPersona`](../interfaces/ParsedPersona.md)[] = `[]`

Defined in: [personas/persona-manager.ts:62](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L62)

***

### sessionMemory

> `private` **sessionMemory**: [`SessionMemory`](../../types/interfaces/SessionMemory.md)

Defined in: [personas/persona-manager.ts:63](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L63)

***

### collaborationMatrix

> `private` **collaborationMatrix**: `Map`\<`string`, `CollaborationMatrixEntry`\>

Defined in: [personas/persona-manager.ts:71](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L71)

## Methods

### Core

#### initialize()

> **initialize**(): `Promise`\<`boolean`\>

Defined in: [personas/persona-manager.ts:99](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L99)

Initialize the persona manager with all components.

Sets up activation engine, loads configuration and persona definitions,
and initializes collaboration matrix for multi-persona workflows.

##### Returns

`Promise`\<`boolean`\>

Promise resolving to true if initialization succeeds, false otherwise

##### Example

```typescript
const manager = new PersonaManager();
const success = await manager.initialize();
if (success) {
  console.log(`Loaded ${manager.personas.size} personas`);
}
```

***

#### selectPersonas()

> **selectPersonas**(`userInput`, `context`): `Promise`\<[`PersonaActivationResult`](../../types/interfaces/PersonaActivationResult.md)\>

Defined in: [personas/persona-manager.ts:222](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L222)

Select appropriate personas for a given context.

This is the main persona selection method that handles both manual and automatic
persona activation. It first checks for manual overrides in the user input,
then falls back to automatic detection via the activation engine.

##### Parameters

###### userInput

`string`

The user's input string, may contain persona flags

###### context

`Partial`\<[`InputContext`](../../types/interfaces/InputContext.md)\> = `{}`

Additional context for persona selection

##### Returns

`Promise`\<[`PersonaActivationResult`](../../types/interfaces/PersonaActivationResult.md)\>

Promise resolving to persona activation result

##### Example

```typescript
// Automatic selection
const result = await manager.selectPersonas(
  "Review this security vulnerability",
  { files: ["auth.ts"], command: "review" }
);

// Manual override
const result = await manager.selectPersonas(
  "Help me --persona-security --persona-architect"
);
```

***

#### generatePersonaPrompt()

> **generatePersonaPrompt**(`activePersonas`, `userInput`, `context`): [`GeneratedPrompt`](../../types/interfaces/GeneratedPrompt.md)

Defined in: [personas/persona-manager.ts:529](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L529)

Generate persona-aware prompt for Claude Code.

Creates a system prompt that incorporates active persona content and
collaboration instructions. Handles both single-persona and multi-persona
collaboration modes with appropriate context integration.

##### Parameters

###### activePersonas

[`ActivePersona`](../../types/interfaces/ActivePersona.md)[]

Currently active personas

###### userInput

`string`

The user's original input

###### context

`Partial`\<[`InputContext`](../../types/interfaces/InputContext.md)\> = `{}`

Additional context for prompt generation

##### Returns

[`GeneratedPrompt`](../../types/interfaces/GeneratedPrompt.md)

Generated prompt with persona content and collaboration plan

##### Example

```typescript
const prompt = manager.generatePersonaPrompt(
  [{ name: "security", confidence: 0.9, ... }],
  "Review this code",
  { files: ["auth.ts"] }
);

console.log(prompt.systemPrompt); // Contains persona instructions
```

### Other

#### loadConfiguration()

> `private` **loadConfiguration**(): `Promise`\<`void`\>

Defined in: [personas/persona-manager.ts:124](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L124)

Load persona configuration

##### Returns

`Promise`\<`void`\>

***

#### loadPersonaDefinitions()

> `private` **loadPersonaDefinitions**(): `Promise`\<`void`\>

Defined in: [personas/persona-manager.ts:133](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L133)

Load all persona definitions from markdown files

##### Returns

`Promise`\<`void`\>

***

#### parsePersonaDefinition()

> `private` **parsePersonaDefinition**(`name`, `content`): [`ParsedPersona`](../interfaces/ParsedPersona.md)

Defined in: [personas/persona-manager.ts:152](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L152)

Parse persona definition from markdown content

##### Parameters

###### name

`string`

###### content

`string`

##### Returns

[`ParsedPersona`](../interfaces/ParsedPersona.md)

***

#### initializeCollaborationMatrix()

> `private` **initializeCollaborationMatrix**(): `void`

Defined in: [personas/persona-manager.ts:173](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L173)

Initialize collaboration patterns between personas

##### Returns

`void`

***

#### parseManualOverrides()

> `private` **parseManualOverrides**(`userInput`): `string`[]

Defined in: [personas/persona-manager.ts:248](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L248)

Parse manual persona overrides from user input

##### Parameters

###### userInput

`string`

##### Returns

`string`[]

***

#### activateManualPersonas()

> **activateManualPersonas**(`personaNames`, `userInput`, `context`): `Promise`\<[`PersonaActivationResult`](../../types/interfaces/PersonaActivationResult.md)\>

Defined in: [personas/persona-manager.ts:265](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L265)

Activate manually specified personas

##### Parameters

###### personaNames

`string`[]

###### userInput

`string`

###### context

`Partial`\<[`InputContext`](../../types/interfaces/InputContext.md)\>

##### Returns

`Promise`\<[`PersonaActivationResult`](../../types/interfaces/PersonaActivationResult.md)\>

***

#### activateRecommendedPersonas()

> `private` **activateRecommendedPersonas**(`detectionResults`, `userInput`, `context`): `Promise`\<[`PersonaActivationResult`](../../types/interfaces/PersonaActivationResult.md)\>

Defined in: [personas/persona-manager.ts:315](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L315)

Activate recommended personas from detection engine

##### Parameters

###### detectionResults

[`DetectionResults`](../../types/interfaces/DetectionResults.md)

###### userInput

`string`

###### context

`Partial`\<[`InputContext`](../../types/interfaces/InputContext.md)\>

##### Returns

`Promise`\<[`PersonaActivationResult`](../../types/interfaces/PersonaActivationResult.md)\>

***

#### planCollaboration()

> **planCollaboration**(`activePersonas`): [`CollaborationPlan`](../../types/interfaces/CollaborationPlan.md)

Defined in: [personas/persona-manager.ts:367](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L367)

Plan collaboration between active personas

##### Parameters

###### activePersonas

[`ActivePersona`](../../types/interfaces/ActivePersona.md)[]

##### Returns

[`CollaborationPlan`](../../types/interfaces/CollaborationPlan.md)

***

#### determineLead()

> **determineLead**(`activePersonas`): [`ActivePersona`](../../types/interfaces/ActivePersona.md)

Defined in: [personas/persona-manager.ts:412](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L412)

Determine lead persona based on confidence and domain rules

##### Parameters

###### activePersonas

[`ActivePersona`](../../types/interfaces/ActivePersona.md)[]

##### Returns

[`ActivePersona`](../../types/interfaces/ActivePersona.md)

***

#### getCollaborationPattern()

> `private` **getCollaborationPattern**(`persona1`, `persona2`): `undefined` \| `CollaborationMatrixEntry`

Defined in: [personas/persona-manager.ts:442](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L442)

Get collaboration pattern between two personas

##### Parameters

###### persona1

`string`

###### persona2

`string`

##### Returns

`undefined` \| `CollaborationMatrixEntry`

***

#### planValidationChain()

> `private` **planValidationChain**(`activePersonas`): [`ValidationStep`](../../types/interfaces/ValidationStep.md)[]

Defined in: [personas/persona-manager.ts:451](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L451)

Plan validation chain based on active personas

##### Parameters

###### activePersonas

[`ActivePersona`](../../types/interfaces/ActivePersona.md)[]

##### Returns

[`ValidationStep`](../../types/interfaces/ValidationStep.md)[]

***

#### generateActivationSummary()

> `private` **generateActivationSummary**(`activePersonas`): `string`

Defined in: [personas/persona-manager.ts:489](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L489)

Generate human-readable activation summary

##### Parameters

###### activePersonas

[`ActivePersona`](../../types/interfaces/ActivePersona.md)[]

##### Returns

`string`

***

#### recordInteraction()

> `private` **recordInteraction**(`interaction`): `void`

Defined in: [personas/persona-manager.ts:597](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L597)

Record interaction for learning and improvement

##### Parameters

###### interaction

`Partial`\<[`PersonaInteraction`](../../types/interfaces/PersonaInteraction.md)\>

##### Returns

`void`

***

#### getSessionId()

> `private` **getSessionId**(): `string`

Defined in: [personas/persona-manager.ts:621](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L621)

Get current session ID (simple implementation)

##### Returns

`string`

***

#### reset()

> **reset**(): `void`

Defined in: [personas/persona-manager.ts:748](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L748)

Reset active personas (for new conversation/session)

##### Returns

`void`

***

#### getActivePersonas()

> **getActivePersonas**(): [`ActivePersona`](../../types/interfaces/ActivePersona.md)[]

Defined in: [personas/persona-manager.ts:760](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L760)

Get current active personas

##### Returns

[`ActivePersona`](../../types/interfaces/ActivePersona.md)[]

***

#### isPersonaActive()

> **isPersonaActive**(`personaName`): `boolean`

Defined in: [personas/persona-manager.ts:774](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L774)

Check if specific persona is active

##### Parameters

###### personaName

`string`

##### Returns

`boolean`

### Analytics

#### getAnalytics()

> **getAnalytics**(): [`PersonaManagerAnalytics`](../../types/interfaces/PersonaManagerAnalytics.md)

Defined in: [personas/persona-manager.ts:698](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L698)

Get analytics and insights about persona usage.

Provides comprehensive statistics about persona activation patterns,
collaboration effectiveness, confidence levels, and successful patterns.
Used for monitoring system performance and optimization insights.

##### Returns

[`PersonaManagerAnalytics`](../../types/interfaces/PersonaManagerAnalytics.md)

Analytics object with usage statistics and insights

##### Example

```typescript
const analytics = manager.getAnalytics();
console.log(`Total interactions: ${analytics.totalInteractions}`);
console.log(`Average confidence: ${analytics.averageConfidence}`);
console.log(`Top persona: ${Object.keys(analytics.personaUsage)[0]}`);
```

### Learning

#### provideFeedback()

> **provideFeedback**(`feedback`): `void`

Defined in: [personas/persona-manager.ts:648](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/persona-manager.ts#L648)

Provide feedback on persona performance for learning and improvement.

Records feedback in session memory and updates the activation engine
with performance data. Positive feedback (rating >= 4) creates successful
patterns for future learning and recommendation improvements.

##### Parameters

###### feedback

[`PersonaFeedback`](../../types/interfaces/PersonaFeedback.md)

Feedback object with personas, rating, and optional comments

##### Returns

`void`

##### Example

```typescript
manager.provideFeedback({
  personas: ["security", "architect"],
  rating: 5,
  comments: "Excellent security analysis and architecture recommendations",
  context: { command: "review" }
});
```
