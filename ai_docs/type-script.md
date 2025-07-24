TITLE: TypeScript Compiler API Core Functions
DESCRIPTION: This entry groups fundamental functions used within the TypeScript Compiler API for program creation, diagnostics, and file handling. It covers essential building blocks for custom compiler tools.
SOURCE: https://github.com/microsoft/typescript/blob/main/__wiki__/Using-the-Compiler-API.md#_snippet_5

LANGUAGE: APIDOC
CODE:
```
ts.createProgram(fileNames: string[], options: ts.CompilerOptions, host?: CompilerHost): Program
  - Creates a Program instance, representing the entire compilation.
  - Parameters:
    - fileNames: An array of root file names to compile.
    - options: Compiler options.
    - host: Optional compiler host; if not provided, a default host is created.
  - Returns: A Program object.

ts.getPreEmitDiagnostics(program: Program, cancellationToken?: CancellationToken): Diagnostic[]
  - Gets diagnostics for the program before emitting files. Includes syntax, semantic, and other errors.
  - Parameters:
    - program: The Program instance.
    - cancellationToken: Optional token to cancel the operation.
  - Returns: An array of Diagnostic objects.

ts.flattenDiagnosticMessageText(diag: string | DiagnosticMessageChain, newLine: string): string
  - Formats a diagnostic message chain into a single string.
  - Parameters:
    - diag: The diagnostic message text or chain.
    - newLine: The newline character to use for formatting.
  - Returns: A formatted string.

ts.getLineAndCharacterOfPosition(sourceFile: SourceFile, position: number): LineAndCharacter
  - Gets the line and character position for a given character offset in a SourceFile.
  - Parameters:
    - sourceFile: The SourceFile object.
    - position: The character offset.
  - Returns: An object with line and character properties.

ts.createCompilerHost(options?: CompilerOptions, setParentNodes?: boolean): CompilerHost
  - Creates a default CompilerHost that uses the file system to read files and check directories.
  - Parameters:
    - options: Compiler options.
    - setParentNodes: Whether to set parent nodes on the AST.
  - Returns: A CompilerHost instance.

CompilerHost.writeFile(fileName: string, data: string, writeByteOrderMark?: boolean, onError?: (message: string) => void, sourceFiles?: SourceFile[]): void
  - Method on CompilerHost to write output files. Can be overridden for custom behavior (e.g., in-memory writing).

CompilerHost.readFile(fileName: string): string | undefined
  - Method on CompilerHost to read file content. Can be overridden.

ts.transpileModule(input: string, compilerOptions: TranspileOptions): TranspileOutput
  - Transpiles a single TypeScript module string to JavaScript.
  - Parameters:
    - input: The TypeScript code as a string.
    - compilerOptions: Options for transpilation.
  - Returns: An object containing the transpiled output and diagnostics.
```

----------------------------------------

TITLE: Example TypeScript Class for Documentation
DESCRIPTION: This is an example of a TypeScript class with JSDoc comments for the class itself and its constructor parameters. This input demonstrates the structure expected by the documentation generator script.
SOURCE: https://github.com/microsoft/typescript/blob/main/__wiki__/Using-the-Compiler-API.md#_snippet_15

LANGUAGE: typescript
CODE:
```
/**
 * Documentation for C
 */
class C {
    /**
     * constructor documentation
     * @param a my parameter documentation
     * @param b another parameter documentation
     */
    constructor(a: string, b: C) { }
}

```

----------------------------------------

TITLE: TypeScript Type Checker API Overview
DESCRIPTION: Provides an overview of TypeScript's Type Checker APIs, which are used to retrieve and reason about the types of syntax tree nodes. It explains the concepts of Symbols and Types and lists common methods for type analysis.
SOURCE: https://github.com/microsoft/typescript/blob/main/__wiki__/Using-the-Compiler-API.md#_snippet_12

LANGUAGE: APIDOC
CODE:
```
TypeChecker APIs:

Purpose: Provides methods for retrieving and reasoning about the types of syntax tree nodes within a TypeScript program.

Key Concepts:
- Symbol: Describes how the type system views a declared entity (e.g., class, function, variable). It contains information about the entity's declaration.
- Type: Describes the backing type that entities may be declared as. Often has a backing Symbol pointing to its declaration(s).

Retrieving the Type Checker:
- The type checker can be retrieved from a program object: `program.getTypeChecker()`

Commonly Used APIs:
- `getSymbolAtLocation(node)`:
  - Description: Retrieves the Symbol associated with a given AST node.
  - Parameters:
    - node: The AST node to inspect.
  - Returns: The Symbol associated with the node, or undefined.

- `getTypeAtLocation(node)`:
  - Description: Retrieves the Type associated with a given AST node.
  - Parameters:
    - node: The AST node to inspect.
  - Returns: The Type associated with the node, or undefined.

- `getTypeOfSymbolAtLocation(symbol, node)`:
  - Description: Retrieves the Type associated with a symbol at a specific AST node's context.
  - Parameters:
    - symbol: The Symbol to get the type for.
    - node: The AST node providing context.
  - Returns: The Type of the symbol at the given location.

- `typeToString(type)`:
  - Description: Prints a type to a human-readable string.
  - Parameters:
    - type: The Type object to convert to a string.
  - Returns: A string representation of the type.

Note on Symbols:
- TypeScript's `Symbol` is a type system concept, distinct from JavaScript's runtime primitive `Symbol` used for unique identifiers.
```

----------------------------------------

TITLE: Create and Use an Incremental Program Watcher
DESCRIPTION: This example demonstrates how to use the TypeScript compiler API to create a file watcher that leverages builder programs for incremental recompilation. It shows how to find a tsconfig.json, set up a watch compiler host, customize program creation and post-creation hooks, and handle diagnostic reporting.
SOURCE: https://github.com/microsoft/typescript/blob/main/__wiki__/Using-the-Compiler-API.md#_snippet_8

LANGUAGE: typescript
CODE:
```
import ts = require("typescript");

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: path => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine
};

function watchMain() {
  const configPath = ts.findConfigFile(
    /*searchPath*/ "./",
    ts.sys.fileExists,
    "tsconfig.json"
  );
  if (!configPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.");
  }

  // TypeScript can use several different program creation "strategies":
  //  * ts.createEmitAndSemanticDiagnosticsBuilderProgram,
  //  * ts.createSemanticDiagnosticsBuilderProgram
  //  * ts.createAbstractBuilder
  // The first two produce "builder programs". These use an incremental strategy
  // to only re-check and emit files whose contents may have changed, or whose
  // dependencies may have changes which may impact change the result of prior
  // type-check and emit.
  // The last uses an ordinary program which does a full type check after every
  // change.
  // Between `createEmitAndSemanticDiagnosticsBuilderProgram` and
  // `createSemanticDiagnosticsBuilderProgram`, the only difference is emit.
  // For pure type-checking scenarios, or when another tool/process handles emit,
  // using `createSemanticDiagnosticsBuilderProgram` may be more desirable.
  const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

  // Note that there is another overload for `createWatchCompilerHost` that takes
  // a set of root files.
  const host = ts.createWatchCompilerHost(
    configPath,
    {},
    ts.sys,
    createProgram,
    reportDiagnostic,
    reportWatchStatusChanged
  );

  // You can technically override any given hook on the host, though you probably
  // don't need to.
  // Note that we're assuming `origCreateProgram` and `origPostProgramCreate`
  // doesn't use `this` at all.
  const origCreateProgram = host.createProgram;
  host.createProgram = (rootNames: ReadonlyArray<string>, options, host, oldProgram) => {
    console.log("** We're about to create the program! **");
    return origCreateProgram(rootNames, options, host, oldProgram);
  };
  const origPostProgramCreate = host.afterProgramCreate;

  host.afterProgramCreate = program => {
    console.log("** We finished making the program! **");
    origPostProgramCreate!(program);
  };

  // `createWatchProgram` creates an initial program, watches files, and updates
  // the program over time.
  ts.createWatchProgram(host);
}

function reportDiagnostic(diagnostic: ts.Diagnostic) {
  console.error("Error", diagnostic.code, ":", ts.flattenDiagnosticMessageText( diagnostic.messageText, formatHost.getNewLine()));
}

/**
 * Prints a diagnostic every time the watch status changes.
 * This is mainly for messages like "Starting compilation" or "Compilation completed".
 */
function reportWatchStatusChanged(diagnostic: ts.Diagnostic) {
  console.info(ts.formatDiagnostic(diagnostic, formatHost));
}

watchMain();

```

----------------------------------------

TITLE: Example JSON Output from Doc Generator
DESCRIPTION: This JSON structure represents the output generated by the TypeScript documentation tool. It details class information, including documentation, type, constructors, parameters, and their types, as parsed from the input TypeScript code.
SOURCE: https://github.com/microsoft/typescript/blob/main/__wiki__/Using-the-Compiler-API.md#_snippet_16

LANGUAGE: json
CODE:
```
[
    {
        "name": "C",
        "documentation": "Documentation for C ",
        "type": "typeof C",
        "constructors": [
            {
                "parameters": [
                    {
                        "name": "a",
                        "documentation": "my parameter documentation",
                        "type": "string"
                    },
                    {
                        "name": "b",
                        "documentation": "another parameter documentation",
                        "type": "C"
                    }
                ],
                "returnType": "C",
                "documentation": "constructor documentation"
            }
        ]
    }
]

```

----------------------------------------

TITLE: Install Node.js Declaration Files
DESCRIPTION: Installs the TypeScript declaration files for Node.js, which are necessary for using Node.js APIs in TypeScript projects and examples.
SOURCE: https://github.com/microsoft/typescript/blob/main/__wiki__/Using-the-Compiler-API.md#_snippet_1

LANGUAGE: sh
CODE:
```
npm install -D @types/node
```

----------------------------------------

TITLE: Promise.try Usage Examples
DESCRIPTION: Demonstrates the usage of the Promise.try static method for executing a function and returning a Promise.
SOURCE: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/bluebirdStaticThis.errors.txt#_snippet_4

LANGUAGE: APIDOC
CODE:
```
Promise.try:
  Promise.try(Promise, () => { return foo; })
    - Executes a function synchronously and returns a Promise that resolves with the function's return value.

  Promise.try(Promise, () => { return foo; }, arr)
    - Executes a function with provided arguments and returns a Promise.

  Promise.try(Promise, () => { return foo; }, arr, x)
    - Executes a function with provided arguments and returns a Promise.
```

----------------------------------------

TITLE: Intl.Locale Constructor and Methods
DESCRIPTION: Demonstrates the Intl.Locale constructor for creating locale objects and accessing their properties. Includes examples of creating a Locale object and using resolvedOptions.
SOURCE: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/es2020IntlAPIs.errors.txt#_snippet_4

LANGUAGE: APIDOC
CODE:
```
new Intl.Locale(tag?: string, options?: LocaleOptions)
  Creates a new Locale object.
  Parameters:
    tag: A string representing a BCP 47 language tag.
    options: An object with properties to customize the locale.

  resolvedOptions(): ResolvedLocaleOptions
    Returns an object with the canonicalized locale properties.

Example Usage:
// Creating a Locale object
const locale = new Intl.Locale('en-US');
console.log(locale.language); // "en"
console.log(locale.region);   // "US"

// Using resolvedOptions
const localesArg = ["es-ES", new Intl.Locale("en-US")];
console.log((new Intl.DisplayNames(localesArg, {type: 'language'})).resolvedOptions().locale); // "es-ES"
```

----------------------------------------

TITLE: Create and Print TypeScript AST
DESCRIPTION: Demonstrates using TypeScript's factory functions to create AST nodes for a factorial function and then using the printer API to convert the AST into a string representation. This showcases programmatic code generation.
SOURCE: https://github.com/microsoft/typescript/blob/main/__wiki__/Using-the-Compiler-API.md#_snippet_11

LANGUAGE: ts
CODE:
```
import ts = require("typescript");

function makeFactorialFunction() {
  const functionName = ts.factory.createIdentifier("factorial");
  const paramName = ts.factory.createIdentifier("n");
  const parameter = ts.factory.createParameterDeclaration(
    /*decorators*/ undefined,
    /*modifiers*/ undefined,
    /*dotDotDotToken*/ undefined,
    paramName
  );

  const condition = ts.factory.createBinaryExpression(paramName, ts.SyntaxKind.LessThanEqualsToken, ts.factory.createNumericLiteral(1));
  const ifBody = ts.factory.createBlock([ts.factory.createReturnStatement(ts.factory.createNumericLiteral(1))], /*multiline*/ true);

  const decrementedArg = ts.factory.createBinaryExpression(paramName, ts.SyntaxKind.MinusToken, ts.factory.createNumericLiteral(1));
  const recurse = ts.factory.createBinaryExpression(paramName, ts.SyntaxKind.AsteriskToken, ts.factory.createCallExpression(functionName, /*typeArgs*/ undefined, [decrementedArg]));
  const statements = [ts.factory.createIfStatement(condition, ifBody), ts.factory.createReturnStatement(recurse)];

  return ts.factory.createFunctionDeclaration(
    /*decorators*/ undefined,
    /*modifiers*/ [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
    /*asteriskToken*/ undefined,
    functionName,
    /*typeParameters*/ undefined,
    [parameter],
    /*returnType*/ ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    ts.factory.createBlock(statements, /*multiline*/ true)
  );
}

const resultFile = ts.createSourceFile("someFileName.ts", "", ts.ScriptTarget.Latest, /*setParentNodes*/ false, ts.ScriptKind.TS);
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

const result = printer.printNode(ts.EmitHint.Unspecified, makeFactorialFunction(), resultFile);
console.log(result);
```

----------------------------------------

TITLE: Intl DisplayNames API
DESCRIPTION: Demonstrates the Intl.DisplayNames API for getting human-readable names for locales, regions, scripts, and languages. Includes examples of creating DisplayNames instances and using the 'of' method.
SOURCE: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/es2020IntlAPIs.errors.txt#_snippet_2

LANGUAGE: APIDOC
CODE:
```
Intl.DisplayNames(locales?: string | string[], options?: DisplayNamesOptions)
  Provides human-readable names for BCP 47 language tags.
  Parameters:
    locales: A string with a BCP 47 language tag, or an array of such tags.
    options: An object with properties like 'type' (e.g., 'region', 'language', 'script', 'currency') and 'style'.

  of(code: string): string | undefined
    Returns the display name for a given code.
    Parameters:
      code: The code (e.g., 'US', 'en', 'Latn') to look up.

Example Usage:
const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'region' });
console.log(regionNamesInEnglish.of('US')); // Expected: "United States"

const regionNamesInTraditionalChinese = new Intl.DisplayNames(['zh-Hant'], { type: 'region' });
console.log(regionNamesInTraditionalChinese.of('US')); // Expected: "美國"

// Example with type 'language'
console.log((new Intl.DisplayNames(undefined, {type: 'language'})).of('en-GB')); // Expected: "British English"
```

----------------------------------------

TITLE: TypeScript WrappedDictionary Methods API
DESCRIPTION: Details the methods available for manipulating dictionaries (objects), providing functional programming paradigms for object iteration and transformation.
SOURCE: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/underscoreTest1.errors.txt#_snippet_29

LANGUAGE: APIDOC
CODE:
```
WrappedDictionary<T> Methods:

each(iterator: Iterator_<T, void>, context?: any): void;
  - Iterates over the dictionary's values, executing an iterator for each.
forEach(iterator: Iterator_<T, void>, context?: any): void;
  - Alias for each().

map<U>(iterator: Iterator_<T, U>, context?: any): U[];
  - Creates a new array by mapping each value in the dictionary to the result of the iterator.
collect<U>(iterator: Iterator_<T, U>, context?: any): U[];
  - Alias for map().

reduce(iterator: Reducer<T, T>, initialValue?: T, context?: any): T;
reduce<U>(iterator: Reducer<T, U>, initialValue: U, context?: any): U;
  - Reduces the dictionary's values to a single value, by iterating from left to right.
foldl(iterator: Reducer<T, T>, initialValue?: T, context?: any): T;
foldl<U>(iterator: Reducer<T, U>, initialValue: U, context?: any): U;
  - Alias for reduce().
inject(iterator: Reducer<T, T>, initialValue?: T, context?: any): T;
inject<U>(iterator: Reducer<T, U>, initialValue: U, context?: any): U;
  - Alias for reduce().

reduceRight(iterator: Reducer<T, T>, initialValue?: T, context?: any): T;
reduceRight<U>(iterator: Reducer<T, U>, initialValue: U, context?: any): U;
  - Reduces the dictionary's values to a single value, by iterating from right to left.
foldr(iterator: Reducer<T, T>, initialValue?: T, context?: any): T;
foldr<U>(iterator: Reducer<T, U>, initialValue: U, context?: any): U;
  - Alias for reduceRight().

find(iterator: Iterator_<T, boolean>, context?: any): T;
  - Returns the first value in the dictionary that satisfies the truth test.
detect(iterator: Iterator_<T, boolean>, context?: any): T;
  - Alias for find().

filter(iterator: Iterator_<T, boolean>, context?: any): T[];
  - Creates a new dictionary with all values that satisfy the truth test.
select(iterator: Iterator_<T, boolean>, context?: any): T[];
  - Alias for filter().

where(properties: Object): T[];
  - Creates a new dictionary with all values that match the properties object.
findWhere(properties: Object): T;
  - Returns the first value in the dictionary that matches the properties object.

reject(iterator: Iterator_<T, boolean>, context?: any): T[];
  - Creates a new dictionary with all values that do not satisfy the truth test.

every(iterator?: Iterator_<T, boolean>, context?: any): boolean;
  - Checks if all values in the dictionary pass the truth test.
all(iterator?: Iterator_<T, boolean>, context?: any): boolean;
  - Alias for every().

some(iterator?: Iterator_<T, boolean>, context?: any): boolean;
  - Checks if any value in the dictionary passes the truth test.
any(iterator?: Iterator_<T, boolean>, context?: any): boolean;
  - Alias for some().

contains(value: T): boolean;
  - Checks if the dictionary contains a specific value.
include(value: T): boolean;
  - Alias for contains().

invoke(methodName: string, ...args: any[]): any[];
  - Invokes a method named methodName on each value in the dictionary.

```

----------------------------------------

TITLE: Puppeteer API Definitions
DESCRIPTION: Provides the API documentation for the Puppeteer library, including its namespace, the Keyboard interface, and the connect function. This defines the structure and usage of these components.
SOURCE: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/jsdocReferenceGlobalTypeInCommonJs.errors.txt#_snippet_1

LANGUAGE: APIDOC
CODE:
```
Puppeteer Namespace:
  export as namespace Puppeteer;

Keyboard Interface:
  interface Keyboard {
    key: string
  }

Connect Function:
  export function connect(name: string): void;
    - Connects to a browser instance.
    - Parameters:
      - name: The name or identifier for the connection.
```

----------------------------------------

TITLE: TypeScript WrappedArray Methods API
DESCRIPTION: Details the methods available for manipulating arrays, providing functional programming paradigms. These methods extend standard JavaScript Array functionality.
SOURCE: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/underscoreTest1.errors.txt#_snippet_28

LANGUAGE: APIDOC
CODE:
```
WrappedArray<T> Methods:

all(iterator?: Iterator_<T, boolean>, context?: any): boolean;
  - Checks if all elements in the collection pass the truth test.

some(iterator?: Iterator_<T, boolean>, context?: any): boolean;
  - Checks if any element in the collection passes the truth test.

any(iterator?: Iterator_<T, boolean>, context?: any): boolean;
  - Alias for some().

contains(value: T): boolean;
  - Checks if the collection contains a specific value.

include(value: T): boolean;
  - Alias for contains().

invoke(methodName: string, ...args: any[]): any[];
  - Invokes a method named methodName on each element of the collection.

pluck(propertyName: string): any[];
  - Extracts the property named propertyName from each element in the collection.

max(iterator?: Iterator_<T, any>, context?: any): T;
  - Finds the maximum element in the collection, optionally using an iterator.

min(iterator?: Iterator_<T, any>, context?: any): T;
  - Finds the minimum element in the collection, optionally using an iterator.

sortBy(iterator: Iterator_<T, any>, context?: any): T[];
  - Sorts the collection by the results of running each element through an iterator.
sortBy(propertyName: string): T[];
  - Sorts the collection by the specified property name.

groupBy(iterator?: Iterator_<T, any>, context?: any): Dictionary<T[]>;
  - Groups elements into a dictionary based on the result of an iterator.
groupBy(propertyName: string): Dictionary<T[]>;
  - Groups elements into a dictionary based on the specified property name.

countBy(iterator?: Iterator_<T, any>, context?: any): Dictionary<number>;
  - Counts elements in the collection by the result of an iterator.
countBy(propertyName: string): Dictionary<number>;
  - Counts elements in the collection by the specified property name.

shuffle(): T[];
  - Shuffles the elements in the collection.

toSArray(): T[];
  - Converts the collection to a plain JavaScript array.

size(): number;
  - Returns the size of the collection.

first(): T;
  - Returns the first element of the collection.
first(count: number): T[];
  - Returns the first 'count' elements of the collection.

head(): T;
  - Alias for first().
head(count: number): T[];
  - Alias for first(count).

take(): T;
  - Alias for first().
take(count: number): T[];
  - Alias for first(count).

initial(): T;
  - Returns all but the last element of the collection.
initial(count: number): T[];
  - Returns all but the last 'count' elements of the collection.

last(): T;
  - Returns the last element of the collection.
last(count: number): T[];
  - Returns the last 'count' elements of the collection.

rest(index?: number): T[];
  - Returns the elements of the collection from the specified index onwards.

compact(): T[];
  - Removes all falsy values from the collection.

flatten<U>(shallow?: boolean): U[];
  - Flattens the collection into a single level, optionally shallowly.

without(...values: T[]): T[];
  - Creates a new collection excluding all given values.

union(...arrays: T[][]): T[];
  - Creates a new collection with unique values from all provided arrays.

intersection(...arrays: T[][]): T[];
  - Creates a new collection with values common to all provided arrays.

difference(...others: T[][]): T[];
  - Creates a new collection with values in the first array but not in any of the others.

uniq(isSorted?: boolean): T[];
  - Creates a new collection with unique elements.
uniq<U>(isSorted: boolean, iterator: Iterator_<T, U>, context?: any): U[];
  - Creates a new collection with unique elements, using an iterator for comparison.

unique(isSorted?: boolean): T[];
  - Alias for uniq().
unique<U>(isSorted: boolean, iterator: Iterator_<T, U>, context?: any): U[];
  - Alias for uniq(isSorted, iterator).

zip(...arrays: any[][]): any[][];
  - Zips together multiple collections into an array of arrays.

object(): any;
  - Creates an object from a list of key-value pairs.
object(values: any[]): any;
  - Creates an object from a list of keys and a list of values.

indexOf(value: T, isSorted?: boolean): number;
  - Returns the index at which a given value is found in the collection, or -1 if it is not present.

lastIndexOf(value: T, fromIndex?: number): number;
  - Returns the index at which a given value is found in the collection, starting from the end.

sortedIndex(obj: T, propertyName: string): number;
  - Uses a binary search to determine the index at which to insert an object into a sorted array.
sortedIndex(obj: T, iterator?: Iterator_<T, any>, context?: any): number;
  - Uses a binary search to determine the index at which to insert an object into a sorted array, using an iterator.

// Standard Array Methods:
concat(...items: T[]): T[];
  - Concatenates two or more arrays.
join(separator?: string): string;
  - Joins all elements of an array into a string.
pop(): T;
  - Removes the last element from an array and returns that element.
push(...items: T[]): number;
  - Adds one or more elements to the end of an array.
reverse(): T[];
  - Reverses the order of the elements in an array.
shift(): T;
  - Removes the first element from an array and returns that element.
slice(start: number, end?: number): T[];
  - Returns a shallow copy of a portion of an array into a new array object.
sort(compareFn?: (a: T, b: T) => number): T[];
  - Sorts the elements of an array in place.
splice(start: number): T[];
  - Removes elements from an array and/or adds new elements.
splice(start: number, deleteCount: number, ...items: T[]): T[];
  - Removes elements from an array and/or adds new elements.
unshift(...items: T[]): number;
  - Adds one or more elements to the beginning of an array.
```

----------------------------------------

TITLE: Compile and Run TypeScript Doc Generator
DESCRIPTION: This shell command sequence shows how to compile the TypeScript documentation generator using `tsc` and then execute it with `node`, passing a target TypeScript file as an argument. This is the command-line interface for using the script.
SOURCE: https://github.com/microsoft/typescript/blob/main/__wiki__/Using-the-Compiler-API.md#_snippet_14

LANGUAGE: shell
CODE:
```
tsc docGenerator.ts --m commonjs
node docGenerator.js test.ts
```

----------------------------------------

TITLE: TypeScript AST Traversal Linter Example
DESCRIPTION: This example demonstrates traversing a TypeScript Abstract Syntax Tree (AST) using the `forEachChild` function to implement a minimal linter. It checks for curly braces around loop/if/else bodies and enforces strict equality operators (`===`/`!==`). It requires the `typescript` package and `fs` for file reading.
SOURCE: https://github.com/microsoft/typescript/blob/main/__wiki__/Using-the-Compiler-API.md#_snippet_7

LANGUAGE: typescript
CODE:
```
import { readFileSync } from "fs";
import * as ts from "typescript";

export function delint(sourceFile: ts.SourceFile) {
  delintNode(sourceFile);

  function delintNode(node: ts.Node) {
    switch (node.kind) {
      case ts.SyntaxKind.ForStatement:
      case ts.SyntaxKind.ForInStatement:
      case ts.SyntaxKind.WhileStatement:
      case ts.SyntaxKind.DoStatement:
        if ((node as ts.IterationStatement).statement.kind !== ts.SyntaxKind.Block) {
          report(
            node,
            'A looping statement\'s contents should be wrapped in a block body.'
          );
        }
        break;

      case ts.SyntaxKind.IfStatement:
        const ifStatement = node as ts.IfStatement;
        if (ifStatement.thenStatement.kind !== ts.SyntaxKind.Block) {
          report(ifStatement.thenStatement, 'An if statement\'s contents should be wrapped in a block body.');
        }
        if (
          ifStatement.elseStatement &&
          ifStatement.elseStatement.kind !== ts.SyntaxKind.Block &&
          ifStatement.elseStatement.kind !== ts.SyntaxKind.IfStatement
        ) {
          report(
            ifStatement.elseStatement,
            'An else statement\'s contents should be wrapped in a block body.'
          );
        }
        break;

      case ts.SyntaxKind.BinaryExpression:
        const op = (node as ts.BinaryExpression).operatorToken.kind;
        if (op === ts.SyntaxKind.EqualsEqualsToken || op === ts.SyntaxKind.ExclamationEqualsToken) {
          report(node, 'Use \'===\' and \'!==\'.');
        }
        break;
    }

    ts.forEachChild(node, delintNode);
  }

  function report(node: ts.Node, message: string) {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    console.log(`${sourceFile.fileName} (${line + 1},${character + 1}): ${message}`);
  }
}

const fileNames = process.argv.slice(2);
fileNames.forEach(fileName => {
  // Parse a file
  const sourceFile = ts.createSourceFile(
    fileName,
    readFileSync(fileName).toString(),
    ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
  );

  // delint it
  delint(sourceFile);
});

```

----------------------------------------

TITLE: Compile TypeScript String to JavaScript
DESCRIPTION: Demonstrates how to create a TypeScript Program and compile code using the Compiler API. It utilizes `createCompilerHost` for default file system interactions and `createTypeChecker` to retrieve diagnostics.
SOURCE: https://github.com/microsoft/typescript/blob/main/__wiki__/Using-the-Compiler-API-(TypeScript-1.4).md#_snippet_1

LANGUAGE: typescript
CODE:
```
/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/typescript/typescript.d.ts" />

import ts = require("typescript");

export function compile(filenames: string[], options: ts.CompilerOptions): void {
    var host = ts.createCompilerHost(options);
    var program = ts.createProgram(filenames, options, host);
    var checker = ts.createTypeChecker(program, /*produceDiagnostics*/ true);
    var result = checker.emitFiles();

    var allDiagnostics = program.getDiagnostics()
        .concat(checker.getDiagnostics())
        .concat(result.diagnostics);

    allDiagnostics.forEach(diagnostic => {
        var lineChar = diagnostic.file.getLineAndCharacterFromPosition(diagnostic.start);
        console.log(`${diagnostic.file.filename} (${lineChar.line},${lineChar.character}): ${diagnostic.messageText}`);
    });

    console.log(`Process exiting with code '${result.emitResultStatus}'.`);
    process.exit(result.emitResultStatus);
}

compile(process.argv.slice(2), { noEmitOnError: true, noImplicitAny: true,
                                 target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS });
```

----------------------------------------

TITLE: API Call Simulation with Generic Functions
DESCRIPTION: Shows how to create a generic `callApi` function that wraps other functions (simulating API calls) using variadic tuples. It demonstrates passing functions like `getUser` and `getOrgUser` to this generic wrapper.
SOURCE: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/variadicTuples1.errors.txt#_snippet_23

LANGUAGE: typescript
CODE:
```
// Repro from #39607

declare function getUser(id: string, options?: { x?: string }): string;

declare function getOrgUser(id: string, orgId: number, options?: { y?: number, z?: boolean }): void;

function callApi<T extends unknown[] = [], U = void>(method: (...args: [...T, object]) => U) {
    return (...args: [...T]) => method(...args, {});
}

callApi(getUser);
callApi(getOrgUser);
```

----------------------------------------

TITLE: Incremental Build with TypeScript Language Service
DESCRIPTION: This snippet demonstrates creating a TypeScript Language Service to perform incremental builds. It sets up a LanguageServiceHost to manage file versions and snapshots, watches files for changes using Node.js's fs module, and emits only the updated output files, logging any errors encountered during the process.
SOURCE: https://github.com/microsoft/typescript/blob/main/__wiki__/Using-the-Compiler-API.md#_snippet_9

LANGUAGE: typescript
CODE:
```
import * as fs from "fs";
import * as ts from "typescript";

function watch(rootFileNames: string[], options: ts.CompilerOptions) {
  const files: ts.MapLike<{ version: number }> = {};

  // initialize the list of files
  rootFileNames.forEach(fileName => {
    files[fileName] = { version: 0 };
  });

  // Create the language service host to allow the LS to communicate with the host
  const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => rootFileNames,
    getScriptVersion: fileName =>
      files[fileName] && files[fileName].version.toString(),
    getScriptSnapshot: fileName => {
      if (!fs.existsSync(fileName)) {
        return undefined;
      }

      return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
    },
    getCurrentDirectory: () => process.cwd(),
    getCompilationSettings: () => options,
    getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    directoryExists: ts.sys.directoryExists,
    getDirectories: ts.sys.getDirectories,
  };

  // Create the language service files
  const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

  // Now let's watch the files
  rootFileNames.forEach(fileName => {
    // First time around, emit all files
    emitFile(fileName);

    // Add a watch on the file to handle next change
    fs.watchFile(fileName, { persistent: true, interval: 250 }, (curr, prev) => {
      // Check timestamp
      if (+curr.mtime <= +prev.mtime) {
        return;
      }

      // Update the version to signal a change in the file
      files[fileName].version++;

      // write the changes to disk
      emitFile(fileName);
    });
  });

  function emitFile(fileName: string) {
    let output = services.getEmitOutput(fileName);

    if (!output.emitSkipped) {
      console.log(`Emitting ${fileName}`);
    } else {
      console.log(`Emitting ${fileName} failed`);
      logErrors(fileName);
    }

    output.outputFiles.forEach(o => {
      fs.writeFileSync(o.name, o.text, "utf8");
    });
  }

  function logErrors(fileName: string) {
    let allDiagnostics = services
      .getCompilerOptionsDiagnostics()
      .concat(services.getSyntacticDiagnostics(fileName))
      .concat(services.getSemanticDiagnostics(fileName));

    allDiagnostics.forEach(diagnostic => {
      let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
      if (diagnostic.file) {
        let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
          diagnostic.start! 
        );
        console.log(`  Error ${diagnostic.file.fileName} (${line + 1},${character +1}): ${message}`);
      } else {
        console.log(`  Error: ${message}`);
      }
    });
  }
}

// Initialize files constituting the program as all .ts files in the current directory
const currentDirectoryFiles = fs
  .readdirSync(process.cwd())
  .filter(fileName => fileName.length >= 3 && fileName.substr(fileName.length - 3, 3) === ".ts");

// Start the watcher
watch(currentDirectoryFiles, { module: ts.ModuleKind.CommonJS });

```

----------------------------------------

TITLE: Intl Formatting: DateTimeFormat and NumberFormat
DESCRIPTION: Demonstrates locale-aware formatting of dates and numbers using Intl.DateTimeFormat and Intl.NumberFormat. Shows how to create formatters for specific locales and use them to format date and count variables.
SOURCE: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/es2020IntlAPIs.errors.txt#_snippet_0

LANGUAGE: APIDOC
CODE:
```
Intl.DateTimeFormat(locales?: string | string[], options?: DateTimeFormatOptions)
  Formats dates according to locale-specific conventions.
  Parameters:
    locales: A string with a BCP 47 language tag, or an array of such tags.
    options: An object with properties to control formatting.

Intl.NumberFormat(locales?: string | string[], options?: NumberFormatOptions)
  Formats numbers according to locale-specific conventions.
  Parameters:
    locales: A string with a BCP 47 language tag, or an array of such tags.
    options: An object with properties to control formatting.

Example Usage:
const count = 26254.39;
const date = new Date("2012-05-24");

function log(locale: string) {
  console.log(
    `${new Intl.DateTimeFormat(locale).format(date)} ${new Intl.NumberFormat(locale).format(count)}`
  );
}

log("en-US"); // Expected: 5/24/2012 26,254.39
log("de-DE"); // Expected: 24.5.2012 26.254,39
```

----------------------------------------

TITLE: Intl RelativeTimeFormat
DESCRIPTION: Provides examples for using Intl.RelativeTimeFormat to format relative time differences, such as 'in 3 quarters' or '1 day ago'. Demonstrates different styles and numeric options.
SOURCE: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/es2020IntlAPIs.errors.txt#_snippet_1

LANGUAGE: APIDOC
CODE:
```
Intl.RelativeTimeFormat(locales?: string | string[], options?: RelativeTimeFormatOptions)
  Formats relative time differences.
  Parameters:
    locales: A string with a BCP 47 language tag, or an array of such tags.
    options: An object with properties like 'style' (e.g., 'narrow', 'short', 'long') and 'numeric' (e.g., 'always', 'auto').

  format(value: number, unit: RelativeTimeUnit)
    Formats the given value and unit.
    Parameters:
      value: The numeric value representing the time difference.
      unit: The unit of time (e.g., 'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second').

Example Usage:
const rtf1 = new Intl.RelativeTimeFormat('en', { style: 'narrow' });
console.log(rtf1.format(3, 'quarter')); // Expected: "in 3 qtrs."
console.log(rtf1.format(-1, 'day'));     // Expected: "1 day ago"

const rtf2 = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
console.log(rtf2.format(2, 'day'));      // Expected: "pasado mañana"
```

----------------------------------------

TITLE: Minimal TypeScript Compiler Program
DESCRIPTION: A basic TypeScript compiler implementation that takes a list of file names and compiler options, creates a Program, emits JavaScript, and reports diagnostics. It demonstrates the core `ts.createProgram` and `program.emit` workflow.
SOURCE: https://github.com/microsoft/typescript/blob/main/__wiki__/Using-the-Compiler-API.md#_snippet_2

LANGUAGE: typescript
CODE:
```
import * as ts from "typescript";

function compile(fileNames: string[], options: ts.CompilerOptions): void {
  let program = ts.createProgram(fileNames, options);
  let emitResult = program.emit();

  let allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      let { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!); 
      let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
      console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    } else {
      console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    }
  });

  let exitCode = emitResult.emitSkipped ? 1 : 0;
  console.log(`Process exiting with code '${exitCode}'.`);
  process.exit(exitCode);
}

compile(process.argv.slice(2), {
  noEmitOnError: true,
  noImplicitAny: true,
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS
});
```

----------------------------------------

TITLE: Generate TypeScript Class Documentation with Type Checker
DESCRIPTION: This TypeScript code demonstrates how to use the `typescript` package to walk an Abstract Syntax Tree (AST), leverage the type checker for symbol and type information, and extract JSDoc comments. It serializes exported classes, their constructors, and parameters into a JSON file.
SOURCE: https://github.com/microsoft/typescript/blob/main/__wiki__/Using-the-Compiler-API.md#_snippet_13

LANGUAGE: typescript
CODE:
```
import * as ts from "typescript";
import * as fs from "fs";

interface DocEntry {
  name?: string;
  fileName?: string;
  documentation?: string;
  type?: string;
  constructors?: DocEntry[];
  parameters?: DocEntry[];
  returnType?: string;
}

/** Generate documentation for all classes in a set of .ts files */
function generateDocumentation(
  fileNames: string[],
  options: ts.CompilerOptions
): void {
  // Build a program using the set of root file names in fileNames
  let program = ts.createProgram(fileNames, options);

  // Get the checker, we will use it to find more about classes
  let checker = program.getTypeChecker();
  let output: DocEntry[] = [];

  // Visit every sourceFile in the program
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      // Walk the tree to search for classes
      ts.forEachChild(sourceFile, visit);
    }
  }

  // print out the doc
  fs.writeFileSync("classes.json", JSON.stringify(output, undefined, 4));

  return;

  /** visit nodes finding exported classes */
  function visit(node: ts.Node) {
    // Only consider exported nodes
    if (!isNodeExported(node)) {
      return;
    }

    if (ts.isClassDeclaration(node) && node.name) {
      // This is a top level class, get its symbol
      let symbol = checker.getSymbolAtLocation(node.name);
      if (symbol) {
        output.push(serializeClass(symbol));
      }
      // No need to walk any further, class expressions/inner declarations
      // cannot be exported
    } else if (ts.isModuleDeclaration(node)) {
      // This is a namespace, visit its children
      ts.forEachChild(node, visit);
    }
  }

  /** Serialize a symbol into a json object */
  function serializeSymbol(symbol: ts.Symbol): DocEntry {
    return {
      name: symbol.getName(),
      documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
      type: checker.typeToString(
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
      )
    };
  }

  /** Serialize a class symbol information */
  function serializeClass(symbol: ts.Symbol) {
    let details = serializeSymbol(symbol);

    // Get the construct signatures
    let constructorType = checker.getTypeOfSymbolAtLocation(
      symbol,
      symbol.valueDeclaration!
    );
    details.constructors = constructorType
      .getConstructSignatures()
      .map(serializeSignature);
    return details;
  }

  /** Serialize a signature (call or construct) */
  function serializeSignature(signature: ts.Signature) {
    return {
      parameters: signature.parameters.map(serializeSymbol),
      returnType: checker.typeToString(signature.getReturnType()),
      documentation: ts.displayPartsToString(signature.getDocumentationComment(checker))
    };
  }

  /** True if this is visible outside this file, false otherwise */
  function isNodeExported(node: ts.Node): boolean {
    return (
      (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0 ||
      (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    );
  }
}

generateDocumentation(process.argv.slice(2), {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS
});

```