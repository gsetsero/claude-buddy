[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [PersonaSystem](../README.md) / PersonaLearningEngine

# Class: PersonaLearningEngine

Defined in: [personas/learning-engine.ts:149](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L149)

## Constructors

### Constructor

> **new PersonaLearningEngine**(`dataDir?`): `PersonaLearningEngine`

Defined in: [personas/learning-engine.ts:161](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L161)

#### Parameters

##### dataDir?

`string`

#### Returns

`PersonaLearningEngine`

## Properties

### dataDir

> `private` **dataDir**: `string`

Defined in: [personas/learning-engine.ts:150](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L150)

***

### memoryFile

> `private` **memoryFile**: `string`

Defined in: [personas/learning-engine.ts:151](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L151)

***

### analyticsFile

> `private` **analyticsFile**: `string`

Defined in: [personas/learning-engine.ts:152](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L152)

***

### sessionMemory

> `private` **sessionMemory**: `SessionMemory`

Defined in: [personas/learning-engine.ts:154](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L154)

***

### persistentMemory

> `private` **persistentMemory**: `PersistentMemory`

Defined in: [personas/learning-engine.ts:155](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L155)

***

### config

> `private` **config**: `LearningConfig`

Defined in: [personas/learning-engine.ts:156](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L156)

***

### sessionId

> `private` **sessionId**: `string`

Defined in: [personas/learning-engine.ts:158](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L158)

***

### sessionStartTime

> `private` **sessionStartTime**: `number`

Defined in: [personas/learning-engine.ts:159](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L159)

## Methods

### Learning Engine

#### recordActivation()

> **recordActivation**(`activationData`): `void`

Defined in: [personas/learning-engine.ts:275](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L275)

Record persona activation and context for learning improvement.

This method captures activation patterns, user context, and persona
selections to improve future recommendations through machine learning.

##### Parameters

###### activationData

[`ActivationData`](../interfaces/ActivationData.md)

Complete activation context and results

##### Returns

`void`

##### Example

```typescript
learningEngine.recordActivation({
  userInput: "Review security vulnerabilities",
  personas: ["security", "backend"],
  activationType: "automatic",
  confidence: [0.85, 0.72],
  projectType: "web-app",
  filePatterns: ["*.ts", "*.js"]
});
```

***

#### getAnalytics()

> **getAnalytics**(): [`LearningAnalytics`](../../types/interfaces/LearningAnalytics.md)

Defined in: [personas/learning-engine.ts:717](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L717)

Get comprehensive learning analytics and performance insights.

Provides detailed metrics about learning system performance, including
session statistics, persistent learning data, effectiveness scores,
top performing patterns, and system optimization recommendations.

##### Returns

[`LearningAnalytics`](../../types/interfaces/LearningAnalytics.md)

Complete learning analytics with performance metrics

##### Example

```typescript
const analytics = learningEngine.getAnalytics();

console.log('Session interactions:', analytics.sessionStats.interactions);
console.log('Learning effectiveness:', analytics.learningEffectiveness);
console.log('Top patterns:', analytics.topPatterns.slice(0, 3));

// Act on recommendations
analytics.recommendations.forEach(rec => {
  if (rec.priority === 'high') {
    console.log('Priority recommendation:', rec.message);
  }
});
```

### Other

#### initialize()

> **initialize**(): `Promise`\<`boolean`\>

Defined in: [personas/learning-engine.ts:199](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L199)

Initialize learning engine and load persistent data

##### Returns

`Promise`\<`boolean`\>

***

#### loadPersistentMemory()

> `private` **loadPersistentMemory**(): `Promise`\<`void`\>

Defined in: [personas/learning-engine.ts:222](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L222)

Load persistent memory from storage

##### Returns

`Promise`\<`void`\>

***

#### savePersistentMemory()

> `private` **savePersistentMemory**(): `Promise`\<`void`\>

Defined in: [personas/learning-engine.ts:238](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L238)

Save persistent memory to storage

##### Returns

`Promise`\<`void`\>

***

#### recordFeedback()

> **recordFeedback**(`feedbackData`): `void`

Defined in: [personas/learning-engine.ts:298](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L298)

Record user feedback for learning improvement

##### Parameters

###### feedbackData

[`PersonaFeedback`](../../types/interfaces/PersonaFeedback.md)

##### Returns

`void`

***

#### captureContext()

> `private` **captureContext**(`activationData`): `CapturedContext`

Defined in: [personas/learning-engine.ts:322](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L322)

Capture relevant context for learning

##### Parameters

###### activationData

[`ActivationData`](../interfaces/ActivationData.md)

##### Returns

`CapturedContext`

***

#### normalizeFilePatterns()

> `private` **normalizeFilePatterns**(`filePatterns?`): `Record`\<`string`, `number`\>

Defined in: [personas/learning-engine.ts:337](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L337)

Normalize file patterns for consistent processing

##### Parameters

###### filePatterns?

`string`[]

##### Returns

`Record`\<`string`, `number`\>

***

#### updateActivationPatterns()

> `private` **updateActivationPatterns**(`interaction`): `void`

Defined in: [personas/learning-engine.ts:362](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L362)

Update activation patterns based on successful interactions

##### Parameters

###### interaction

`InteractionRecord`

##### Returns

`void`

***

#### learnFromFeedback()

> `private` **learnFromFeedback**(`feedback`): `void`

Defined in: [personas/learning-engine.ts:389](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L389)

Learn from user feedback to improve future activations

##### Parameters

###### feedback

`FeedbackRecord`

##### Returns

`void`

***

#### findRelatedInteractions()

> `private` **findRelatedInteractions**(`feedback`): `InteractionRecord`[]

Defined in: [personas/learning-engine.ts:416](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L416)

Find interactions related to feedback

##### Parameters

###### feedback

`FeedbackRecord`

##### Returns

`InteractionRecord`[]

***

#### reinforceSuccessfulPattern()

> `private` **reinforceSuccessfulPattern**(`patternKey`, `interaction`, `feedback`): `void`

Defined in: [personas/learning-engine.ts:429](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L429)

Reinforce successful activation patterns

##### Parameters

###### patternKey

`string`

###### interaction

`InteractionRecord`

###### feedback

`FeedbackRecord`

##### Returns

`void`

***

#### recordFailedPattern()

> `private` **recordFailedPattern**(`patternKey`, `interaction`, `feedback`): `void`

Defined in: [personas/learning-engine.ts:464](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L464)

Record failed activation patterns to avoid in future

##### Parameters

###### patternKey

`string`

###### interaction

`InteractionRecord`

###### feedback

`FeedbackRecord`

##### Returns

`void`

***

#### generatePatternKey()

> `private` **generatePatternKey**(`interaction`): `string`

Defined in: [personas/learning-engine.ts:485](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L485)

Generate pattern key for learning

##### Parameters

###### interaction

`InteractionRecord`

##### Returns

`string`

***

#### categorizeFilePatterns()

> `private` **categorizeFilePatterns**(`filePatterns?`): `string`

Defined in: [personas/learning-engine.ts:500](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L500)

Categorize file patterns for pattern matching

##### Parameters

###### filePatterns?

`Record`\<`string`, `number`\>

##### Returns

`string`

***

#### getActivationRecommendations()

> **getActivationRecommendations**(`context`): [`LearningRecommendations`](../../types/interfaces/LearningRecommendations.md)

Defined in: [personas/learning-engine.ts:516](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L516)

Get activation recommendations based on learned patterns

##### Parameters

###### context

`Partial`\<[`InputContext`](../../types/interfaces/InputContext.md)\>

##### Returns

[`LearningRecommendations`](../../types/interfaces/LearningRecommendations.md)

***

#### findMatchingPatterns()

> `private` **findMatchingPatterns**(`context`): `SuccessfulPattern`[]

Defined in: [personas/learning-engine.ts:557](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L557)

Find successful patterns matching current context

##### Parameters

###### context

`Partial`\<[`InputContext`](../../types/interfaces/InputContext.md)\>

##### Returns

`SuccessfulPattern`[]

***

#### findAntiPatterns()

> `private` **findAntiPatterns**(`context`): `FailedPattern`[]

Defined in: [personas/learning-engine.ts:566](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L566)

Find anti-patterns (failed patterns) to avoid

##### Parameters

###### context

`Partial`\<[`InputContext`](../../types/interfaces/InputContext.md)\>

##### Returns

`FailedPattern`[]

***

#### contextMatches()

> `private` **contextMatches**(`patternContext`, `currentContext`): `boolean`

Defined in: [personas/learning-engine.ts:575](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L575)

Check if contexts match for pattern recognition

##### Parameters

###### patternContext

`CapturedContext`

###### currentContext

`Partial`\<[`InputContext`](../../types/interfaces/InputContext.md)\>

##### Returns

`boolean`

***

#### calculateFilePatternSimilarity()

> `private` **calculateFilePatternSimilarity**(`pattern1?`, `pattern2?`): `number`

Defined in: [personas/learning-engine.ts:593](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L593)

Calculate similarity between file patterns

##### Parameters

###### pattern1?

`Record`\<`string`, `number`\>

###### pattern2?

`Record`\<`string`, `number`\>

##### Returns

`number`

***

#### suggestAdaptations()

> `private` **suggestAdaptations**(`context`, `bestPattern`): [`LearningAdaptation`](../../types/interfaces/LearningAdaptation.md)[]

Defined in: [personas/learning-engine.ts:612](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L612)

Suggest adaptations based on learned patterns and current context

##### Parameters

###### context

`Partial`\<[`InputContext`](../../types/interfaces/InputContext.md)\>

###### bestPattern

`SuccessfulPattern`

##### Returns

[`LearningAdaptation`](../../types/interfaces/LearningAdaptation.md)[]

***

#### cleanExpiredPatterns()

> `private` **cleanExpiredPatterns**(): `void`

Defined in: [personas/learning-engine.ts:648](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L648)

Clean expired patterns from memory

##### Returns

`void`

***

#### updatePatternSuccessRates()

> `private` **updatePatternSuccessRates**(`feedback`): `void`

Defined in: [personas/learning-engine.ts:663](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L663)

Update pattern success rates based on feedback

##### Parameters

###### feedback

`FeedbackRecord`

##### Returns

`void`

***

#### sanitizeUserInput()

> `private` **sanitizeUserInput**(`userInput`): `string`

Defined in: [personas/learning-engine.ts:671](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L671)

Sanitize user input for safe storage

##### Parameters

###### userInput

`string`

##### Returns

`string`

***

#### generateSessionId()

> `private` **generateSessionId**(): `string`

Defined in: [personas/learning-engine.ts:685](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L685)

Generate unique session ID

##### Returns

`string`

***

#### calculateLearningEffectiveness()

> `private` **calculateLearningEffectiveness**(): `number`

Defined in: [personas/learning-engine.ts:739](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L739)

Calculate learning effectiveness metrics

##### Returns

`number`

***

#### getTopPatterns()

> `private` **getTopPatterns**(): `TopPattern`[]

Defined in: [personas/learning-engine.ts:753](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L753)

Get top performing patterns

##### Returns

`TopPattern`[]

***

#### getSystemRecommendations()

> `private` **getSystemRecommendations**(): `SystemRecommendation`[]

Defined in: [personas/learning-engine.ts:768](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L768)

Get system recommendations for improvement

##### Returns

`SystemRecommendation`[]

***

#### endSession()

> **endSession**(): `Promise`\<`void`\>

Defined in: [personas/learning-engine.ts:797](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/personas/learning-engine.ts#L797)

End session and save learning data

##### Returns

`Promise`\<`void`\>
