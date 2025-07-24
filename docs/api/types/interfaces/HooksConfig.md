[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [types](../README.md) / HooksConfig

# Interface: HooksConfig

Defined in: [types/config.ts:57](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/config.ts#L57)

Complete hooks configuration

## Properties

### hooks

> **hooks**: `object`

Defined in: [types/config.ts:58](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/config.ts#L58)

#### PreToolUse?

> `optional` **PreToolUse**: [`HookMatcher`](HookMatcher.md)[]

#### PostToolUse?

> `optional` **PostToolUse**: [`HookMatcher`](HookMatcher.md)[]

#### UserPromptSubmit?

> `optional` **UserPromptSubmit**: [`HookMatcher`](HookMatcher.md)[]

#### Notification?

> `optional` **Notification**: [`HookMatcher`](HookMatcher.md)[]

#### Stop?

> `optional` **Stop**: [`HookMatcher`](HookMatcher.md)[]

#### SubagentStop?

> `optional` **SubagentStop**: [`HookMatcher`](HookMatcher.md)[]

#### PreCompact?

> `optional` **PreCompact**: [`HookMatcher`](HookMatcher.md)[]
