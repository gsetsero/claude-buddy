[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [types](../README.md) / RequireFields

# Type Alias: RequireFields\<T, K\>

> **RequireFields**\<`T`, `K`\> = `T` & `Required`\<`Pick`\<`T`, `K`\>\>

Defined in: [types/index.ts:104](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/index.ts#L104)

Make specific properties required in a partial type

## Type Parameters

### T

`T`

### K

`K` *extends* keyof `T`
