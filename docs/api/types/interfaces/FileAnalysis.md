[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [types](../README.md) / FileAnalysis

# Interface: FileAnalysis

Defined in: [types/context.ts:20](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L20)

Project file analysis results

## Properties

### totalFiles

> **totalFiles**: `number`

Defined in: [types/context.ts:21](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L21)

***

### codeFiles

> **codeFiles**: `number`

Defined in: [types/context.ts:22](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L22)

***

### testFiles

> **testFiles**: `number`

Defined in: [types/context.ts:23](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L23)

***

### configFiles

> **configFiles**: `number`

Defined in: [types/context.ts:24](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L24)

***

### documentationFiles

> **documentationFiles**: `number`

Defined in: [types/context.ts:25](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L25)

***

### extensions

> **extensions**: `Record`\<`string`, `number`\>

Defined in: [types/context.ts:26](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L26)

***

### directories

> **directories**: `string`[]

Defined in: [types/context.ts:27](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L27)

***

### complexity

> **complexity**: `"simple"` \| `"medium"` \| `"large"` \| `"complex"`

Defined in: [types/context.ts:28](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/context.ts#L28)
