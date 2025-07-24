[**claude-buddy v1.0.0**](../../README.md)

***

[claude-buddy](../../modules.md) / [types](../README.md) / ExtractReturnType

# Type Alias: ExtractReturnType\<T\>

> **ExtractReturnType**\<`T`\> = `T` *extends* (...`args`) => `Promise`\<infer R\> ? `R` : `T` *extends* (...`args`) => infer R ? `R` : `never`

Defined in: [types/index.ts:109](https://github.com/gsetsero/assistant-integration/blob/911ddf7680199ad668404c191ed66335473fdc65/claude-buddy/src/types/index.ts#L109)

Extract function return type, handling promises

## Type Parameters

### T

`T`
