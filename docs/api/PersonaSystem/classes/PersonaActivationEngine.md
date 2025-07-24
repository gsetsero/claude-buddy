[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [PersonaSystem](../README.md) / PersonaActivationEngine

# Class: PersonaActivationEngine

Defined in: [personas/auto-activation.ts:114](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L114)

Persona Auto-Activation Engine

Intelligent persona selection engine that analyzes context to automatically
activate the most appropriate personas for a given task. Uses multi-factor
scoring algorithm with keyword matching, context analysis, file patterns,
and user history.

## Constructors

### Constructor

> **new PersonaActivationEngine**(`configPath?`): `PersonaActivationEngine`

Defined in: [personas/auto-activation.ts:121](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L121)

#### Parameters

##### configPath?

`string`

#### Returns

`PersonaActivationEngine`

## Properties

### config

> `private` **config**: `null` \| `Config` = `null`

Defined in: [personas/auto-activation.ts:115](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L115)

***

### userHistory

> `private` **userHistory**: `Map`\<`string`, `UserHistoryData`\>

Defined in: [personas/auto-activation.ts:116](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L116)

***

### sessionContext

> `private` **sessionContext**: `SessionContext`

Defined in: [personas/auto-activation.ts:117](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L117)

***

### configPath

> `private` **configPath**: `string`

Defined in: [personas/auto-activation.ts:118](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L118)

***

### weights

> `private` **weights**: `Weights`

Defined in: [personas/auto-activation.ts:119](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L119)

## Methods

### Auto-Activation

#### detectPersonas()

> **detectPersonas**(`userInput`, `options`): `Promise`\<[`DetectionResults`](../../types/interfaces/DetectionResults.md)\>

Defined in: [personas/auto-activation.ts:359](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L359)

Detect and recommend appropriate personas based on multi-factor analysis.

Uses a sophisticated scoring algorithm that analyzes:
- Keyword matching (30% weight) - Direct matches in user input
- Context analysis (40% weight) - Project structure and technical indicators
- File patterns (20% weight) - File types and project organization
- User history (10% weight) - Previous successful activations

##### Parameters

###### userInput

`string`

The user's input string to analyze

###### options

`Partial`\<[`InputContext`](../../types/interfaces/InputContext.md)\> = `{}`

Additional context including files, command type, project info

##### Returns

`Promise`\<[`DetectionResults`](../../types/interfaces/DetectionResults.md)\>

Promise resolving to detection results with persona recommendations

##### Example

```typescript
const results = await activationEngine.detectPersonas(
  "Review this authentication code for vulnerabilities",
  {
    files: ["auth.ts", "middleware/security.ts"],
    command: "review",
    projectType: "web-app"
  }
);

console.log('Recommended personas:');
results.recommendations.forEach(rec => {
  console.log(`${rec.persona}: ${rec.confidence.toFixed(2)} confidence`);
  console.log(`Reasoning: ${rec.reasoning}`);
});
```

### Other

#### initialize()

> **initialize**(): `Promise`\<`boolean`\>

Defined in: [personas/auto-activation.ts:147](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L147)

Initialize the persona system with configuration

##### Returns

`Promise`\<`boolean`\>

***

#### analyzeProjectContext()

> `private` **analyzeProjectContext**(): `Promise`\<`void`\>

Defined in: [personas/auto-activation.ts:169](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L169)

Analyze project context to understand technology stack and structure

##### Returns

`Promise`\<`void`\>

***

#### detectFilePatterns()

> `private` **detectFilePatterns**(): `Promise`\<`void`\>

Defined in: [personas/auto-activation.ts:237](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L237)

Detect file patterns in the current project

##### Returns

`Promise`\<`void`\>

***

#### getProjectFiles()

> `private` **getProjectFiles**(): `Promise`\<`string`[]\>

Defined in: [personas/auto-activation.ts:292](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L292)

Get project files recursively (with reasonable limits)

##### Returns

`Promise`\<`string`[]\>

***

#### calculateKeywordScores()

> `private` **calculateKeywordScores**(`analysis`, `personaScores`): `Promise`\<`void`\>

Defined in: [personas/auto-activation.ts:442](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L442)

Calculate keyword matching scores

##### Parameters

###### analysis

`Analysis`

###### personaScores

`Record`\<`string`, `PersonaScore`\>

##### Returns

`Promise`\<`void`\>

***

#### calculateContextScores()

> `private` **calculateContextScores**(`analysis`, `personaScores`): `Promise`\<`void`\>

Defined in: [personas/auto-activation.ts:467](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L467)

Calculate context analysis scores

##### Parameters

###### analysis

`Analysis`

###### personaScores

`Record`\<`string`, `PersonaScore`\>

##### Returns

`Promise`\<`void`\>

***

#### calculateFilePatternScores()

> `private` **calculateFilePatternScores**(`analysis`, `personaScores`): `Promise`\<`void`\>

Defined in: [personas/auto-activation.ts:516](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L516)

Calculate file pattern scores

##### Parameters

###### analysis

`Analysis`

###### personaScores

`Record`\<`string`, `PersonaScore`\>

##### Returns

`Promise`\<`void`\>

***

#### calculateUserHistoryScores()

> `private` **calculateUserHistoryScores**(`analysis`, `personaScores`): `Promise`\<`void`\>

Defined in: [personas/auto-activation.ts:549](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L549)

Calculate user history scores

##### Parameters

###### analysis

`Analysis`

###### personaScores

`Record`\<`string`, `PersonaScore`\>

##### Returns

`Promise`\<`void`\>

***

#### generateReasoning()

> `private` **generateReasoning**(`personaName`, `score`, `analysis`): `string`

Defined in: [personas/auto-activation.ts:573](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L573)

Generate human-readable reasoning for persona recommendation

##### Parameters

###### personaName

`string`

###### score

`PersonaScore`

###### analysis

`Analysis`

##### Returns

`string`

***

#### extractKeywords()

> `private` **extractKeywords**(`input`): `string`[]

Defined in: [personas/auto-activation.ts:598](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L598)

Extract keywords from user input

##### Parameters

###### input

`string`

##### Returns

`string`[]

***

#### matchesPattern()

> `private` **matchesPattern**(`file`, `pattern`): `boolean`

Defined in: [personas/auto-activation.ts:611](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L611)

Check if file matches pattern

##### Parameters

###### file

`string`

###### pattern

`string`

##### Returns

`boolean`

***

#### fileExists()

> `private` **fileExists**(`filePath`): `Promise`\<`boolean`\>

Defined in: [personas/auto-activation.ts:623](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L623)

Check if file exists

##### Parameters

###### filePath

`string`

##### Returns

`Promise`\<`boolean`\>

***

#### loadUserHistory()

> `private` **loadUserHistory**(): `Promise`\<`void`\>

Defined in: [personas/auto-activation.ts:635](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L635)

Load user history from storage

##### Returns

`Promise`\<`void`\>

***

#### saveUserHistory()

> `private` **saveUserHistory**(): `Promise`\<`void`\>

Defined in: [personas/auto-activation.ts:652](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L652)

Save user history to storage

##### Returns

`Promise`\<`void`\>

***

#### recordPersonaUsage()

> **recordPersonaUsage**(`personas`, `userFeedback`): `void`

Defined in: [personas/auto-activation.ts:674](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/auto-activation.ts#L674)

Record successful persona usage for learning

##### Parameters

###### personas

`string`[]

###### userFeedback

`"positive"` | `"neutral"` | `"negative"`

##### Returns

`void`
