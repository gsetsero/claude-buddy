TITLE: Running ESLint on a JavaScript File
DESCRIPTION: This command executes ESLint on a specified JavaScript file or directory. `npx` is used to run the `eslint` command from the local `node_modules/.bin` directory, avoiding the need for global installation.
SOURCE: https://github.com/eslint/eslint/blob/main/README.md#_snippet_1

LANGUAGE: shell
CODE:
```
npx eslint yourfile.js
```

----------------------------------------

TITLE: ASI Pitfall: Unexpected Return Statement in JavaScript
DESCRIPTION: This code demonstrates a common pitfall of Automatic Semicolon Insertion (ASI). Despite appearing to return an object literal, JavaScript's ASI will insert a semicolon after `return`, effectively making the object literal unreachable. This can lead to unexpected behavior and is protected by rules like `no-unreachable`.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/semi.md#_snippet_1

LANGUAGE: js
CODE:
```
return
{
    name: "ESLint"
};
```

----------------------------------------

TITLE: Initial Example: Ambiguous Assignment in Conditional - JavaScript
DESCRIPTION: This snippet illustrates a common programming error where an assignment operator (`=`) is mistakenly used instead of a comparison operator (`==` or `===`) within an `if` statement's condition. This leads to the variable `user.jobTitle` being unintentionally modified and the condition evaluating to the assigned value, which can cause unexpected behavior.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/no-cond-assign.md#_snippet_0

LANGUAGE: JavaScript
CODE:
```
// Check the user's job title
if (user.jobTitle = "manager") {
    // user.jobTitle is now incorrect
}
```

----------------------------------------

TITLE: Configuring Basic ESLint Rules in JavaScript
DESCRIPTION: This snippet demonstrates how to define basic ESLint rules within an `eslint.config.js` file. It shows how to set rule severity (e.g., 'off', 'error') and provide options for specific rules, such as `prefer-const`.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/configure/rules.md#_snippet_7

LANGUAGE: JavaScript
CODE:
```
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		rules: {
			eqeqeq: "off",
			"no-unused-vars": "error",
			"prefer-const": ["error", { ignoreReadBeforeAssign: true }],
		},
	},
]);
```

----------------------------------------

TITLE: Installing ESLint JavaScript Plugin
DESCRIPTION: This command installs the @eslint/js package as a development dependency using npm. This package provides the core JavaScript-specific configurations for ESLint, enabling the use of 'recommended' and 'all' rule sets.
SOURCE: https://github.com/eslint/eslint/blob/main/packages/js/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
npm install @eslint/js -D
```

----------------------------------------

TITLE: Disallowing Type-Unsafe Equality Operators (Default)
DESCRIPTION: This snippet demonstrates incorrect usage of equality operators (`==`, `!=`) which perform type coercion, violating the `eqeqeq` rule's default setting. These operations can lead to unexpected behavior due to JavaScript's Abstract Equality Comparison Algorithm.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/eqeqeq.md#_snippet_0

LANGUAGE: javascript
CODE:
```
/*eslint eqeqeq: "error"*/

if (x == 42) { }

if ("" == text) { }

if (obj.getStuff() != undefined) { }
```

----------------------------------------

TITLE: Initializing ESLint Configuration with npm
DESCRIPTION: This command initializes ESLint in your project, guiding you through a series of questions to set up your `eslint.config.js` file. It requires a `package.json` file to be present before execution.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/getting-started.md#_snippet_0

LANGUAGE: Shell
CODE:
```
npm init @eslint/config@latest
```

----------------------------------------

TITLE: Defining ESLint Rules in eslint.config.js
DESCRIPTION: This JavaScript configuration snippet demonstrates how to define ESLint rules within an `eslint.config.js` file. It uses `defineConfig` to specify rules like `prefer-const` and `no-constant-binary-expression` for JavaScript files, setting their error levels to 'warn' and 'error' respectively.
SOURCE: https://github.com/eslint/eslint/blob/main/README.md#_snippet_3

LANGUAGE: js
CODE:
```
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
		rules: {
			"prefer-const": "warn",
			"no-constant-binary-expression": "error"
		}
	}
]);
```

----------------------------------------

TITLE: Retrying Asynchronous Operations with Delays in JavaScript
DESCRIPTION: This function illustrates how a loop can be used to retry an asynchronous operation up to 10 times. It introduces a delay between retries using `setTimeout` wrapped in a `Promise`, returning 'succeeded!' on success or 'failed!' after all attempts.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/no-await-in-loop.md#_snippet_7

LANGUAGE: javascript
CODE:
```
async function retryUpTo10Times() {
    for (let i = 0; i < 10; i++) {
        const wasSuccessful = await tryToDoSomething();
        if (wasSuccessful)
            return 'succeeded!';
        // wait to try again.
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return 'failed!';
}
```

----------------------------------------

TITLE: Disallowing Deprecated Buffer Constructor Usage in Node.js (Incorrect)
DESCRIPTION: This snippet demonstrates incorrect usage of the `Buffer()` constructor, which is deprecated due to security vulnerabilities. It shows direct calls to `new Buffer()` and `Buffer()` with various arguments, including user input, which can lead to remote memory disclosure and denial of service. This usage is disallowed by the `no-buffer-constructor` ESLint rule.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/no-buffer-constructor.md#_snippet_0

LANGUAGE: JavaScript
CODE:
```
/* eslint no-buffer-constructor: error */

new Buffer(5);
new Buffer([1, 2, 3]);

Buffer(5);
Buffer([1, 2, 3]);

new Buffer(res.body.amount);
new Buffer(res.body.values);
```

----------------------------------------

TITLE: Autofixing Lint Problems with ESLint (JavaScript)
DESCRIPTION: This example illustrates how to use the ESLint API to automatically fix linting problems in files. It creates an ESLint instance with the `fix: true` option, lints the specified files, and then uses `ESLint.outputFixes` to apply the fixes directly to the files. Finally, it formats and outputs the results, showing any remaining issues.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/integrate/nodejs-api.md#_snippet_1

LANGUAGE: JavaScript
CODE:
```
const { ESLint } = require("eslint");

(async function main() {
	// 1. Create an instance with the `fix` option.
	const eslint = new ESLint({ fix: true });

	// 2. Lint files. This doesn't modify target files.
	const results = await eslint.lintFiles(["lib/**/*.js"]);

	// 3. Modify the files with the fixed code.
	await ESLint.outputFixes(results);

	// 4. Format the results.
	const formatter = await eslint.loadFormatter("stylish");
	const resultText = formatter.format(results);

	// 5. Output it.
	console.log(resultText);
})().catch(error => {
	process.exitCode = 1;
	console.error(error);
});
```

----------------------------------------

TITLE: Configuring no-restricted-syntax with Object Selectors and Custom Messages (JSON)
DESCRIPTION: This configuration snippet illustrates a more advanced usage of the `no-restricted-syntax` rule, where each restricted syntax element is defined as an object. This allows for the inclusion of a custom error message alongside the AST selector, providing more informative feedback.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/no-restricted-syntax.md#_snippet_1

LANGUAGE: json
CODE:
```
{
    "rules": {
        "no-restricted-syntax": [
            "error",
            {
                "selector": "FunctionExpression",
                "message": "Function expressions are not allowed."
            },
            {
                "selector": "CallExpression[callee.name='setTimeout'][arguments.length!=2]",
                "message": "setTimeout must always be invoked with two arguments."
            }
        ]
    }
}
```

----------------------------------------

TITLE: Defining a Custom ESLint Processor Plugin in JavaScript
DESCRIPTION: This snippet defines the structure of an ESLint plugin that includes a custom processor. It specifies the `meta` information for the plugin and the processor, and implements the `preprocess` method to extract code blocks for linting and the `postprocess` method to aggregate and adjust lint messages. It also shows how to enable autofixing and how to export the plugin for both ESM and CommonJS.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/extend/custom-processors.md#_snippet_0

LANGUAGE: JavaScript
CODE:
```
const plugin = {
	meta: {
		name: "eslint-plugin-example",
		version: "1.2.3",
	},
	processors: {
		"processor-name": {
			meta: {
				name: "eslint-processor-name",
				version: "1.2.3",
			},
			// takes text of the file and filename
			preprocess(text, filename) {
				// here, you can strip out any non-JS content
				// and split into multiple strings to lint

				return [
					// return an array of code blocks to lint
					{ text: code1, filename: "0.js" },
					{ text: code2, filename: "1.js" },
				];
			},

			// takes a Message[][] and filename
			postprocess(messages, filename) {
				// `messages` argument contains two-dimensional array of Message objects
				// where each top-level array item contains array of lint messages related
				// to the text that was returned in array from preprocess() method

				// you need to return a one-dimensional array of the messages you want to keep
				return [].concat(...messages);
			},

			supportsAutofix: true, // (optional, defaults to false)
		},
	},
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;
```

----------------------------------------

TITLE: Disabling a Specific ESLint Rule on a Specific Line (JavaScript)
DESCRIPTION: This snippet provides examples of disabling a single ESLint rule (e.g., no-alert) on a specific line. This is achieved using // eslint-disable-line <rule>, // eslint-disable-next-line <rule>, /* eslint-disable-line <rule> */, or /* eslint-disable-next-line <rule> */.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/configure/rules.md#_snippet_18

LANGUAGE: JavaScript
CODE:
```
alert("foo"); // eslint-disable-line no-alert

// eslint-disable-next-line no-alert
alert("foo");

alert("foo"); /* eslint-disable-line no-alert */

/* eslint-disable-next-line no-alert */
alert("foo");
```

----------------------------------------

TITLE: Demonstrating Race Condition in Asynchronous JavaScript
DESCRIPTION: This snippet illustrates a common race condition bug in asynchronous JavaScript where `totalLength` is updated non-atomically. The `totalLength += await getPageLength(pageNum);` operation reads `totalLength`, awaits a promise, and then writes back, potentially losing updates if `totalLength` is modified by another concurrent operation during the `await` period.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/require-atomic-updates.md#_snippet_0

LANGUAGE: javascript
CODE:
```
let totalLength = 0;

async function addLengthOfSinglePage(pageNum) {
  totalLength += await getPageLength(pageNum);
}

Promise.all([addLengthOfSinglePage(1), addLengthOfSinglePage(2)]).then(() => {
  console.log('The combined length of both pages is', totalLength);
});
```

----------------------------------------

TITLE: Configuring Git for Consistent Line Endings (Gitattributes)
DESCRIPTION: This `.gitattributes` configuration line ensures that all `.js` files are treated as text and their line endings are normalized to LF (`\n`) upon commit, preventing Git from automatically converting them to CRLF on Windows checkouts. This helps maintain consistency with ESLint's `linebreak-style` rule set to `unix`.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/linebreak-style.md#_snippet_4

LANGUAGE: text
CODE:
```
*.js text eol=lf
```

----------------------------------------

TITLE: Main ESLint Integration Function (JavaScript)
DESCRIPTION: This is the primary entry point for the ESLint integration, orchestrating the creation of an ESLint instance with a predefined configuration, linting the specified files, and outputting the results. It demonstrates how to combine helper functions for a complete linting workflow.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/integrate/integration-tutorial.md#_snippet_7

LANGUAGE: JavaScript
CODE:
```
// Put previous functions all together
async function lintFiles(filePaths) {
	// The ESLint configuration. Alternatively, you could load the configuration
	// from an eslint.config.js file or just use the default config.
	const overrideConfig = {
		languageOptions: {
			ecmaVersion: 2018,
			sourceType: "commonjs",
		},
		rules: {
			"no-console": "error",
			"no-unused-vars": "warn",
		},
	};

	const eslint = createESLintInstance(overrideConfig);
	const results = await lintAndFix(eslint, filePaths);
	return outputLintingResults(results);
}

// Export integration
module.exports = { lintFiles };
```

----------------------------------------

TITLE: Extending Multiple Configs in Flat Config
DESCRIPTION: Shows how to use multiple configurations in a flat config file (`eslint.config.js`) by importing modules like `@eslint/js` for recommended rules, local custom configs, and npm package configs. Custom rules are applied within an object in the exported array.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/configure/migration-guide.md#_snippet_21

LANGUAGE: javascript
CODE:
```
// eslint.config.js

import js from "@eslint/js";
import customConfig from "./custom-config.js";
import myConfig from "eslint-config-my-config";

export default [
	js.configs.recommended,
	customConfig,
	myConfig,
	{
		rules: {
			semi: ["warn", "always"]
		},
		// ...other config
	}
];
```

----------------------------------------

TITLE: Concurrent Await with Promise.all() for Performance - JavaScript
DESCRIPTION: This snippet illustrates the recommended approach for concurrent asynchronous operations. It collects all promises from `doAsyncWork` calls into an array, then uses `Promise.all()` to wait for all of them to complete simultaneously, significantly improving execution speed by enabling parallel processing.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/no-await-in-loop.md#_snippet_1

LANGUAGE: JavaScript
CODE:
```
async function foo(things) {
  const promises = [];
  for (const thing of things) {
    // Good: all asynchronous operations are immediately started.
    promises.push(doAsyncWork(thing));
  }
  // Now that all the asynchronous operations are running, here we wait until they all complete.
  const results = await Promise.all(promises);
  return results;
}
```

----------------------------------------

TITLE: Creating ESLint Configuration File
DESCRIPTION: Creates an empty `eslint.config.js` file in the project root. This file will serve as the central configuration point for ESLint, where rules, plugins, and extends will be defined.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/getting-started.md#_snippet_8

LANGUAGE: shell
CODE:
```
touch eslint.config.js
```

----------------------------------------

TITLE: Applying Recommended ESLint Config Object (JavaScript)
DESCRIPTION: This snippet demonstrates how to apply a predefined ESLint configuration object, specifically `js.configs.recommended`, and then add custom rule overrides. It shows combining a recommended JavaScript configuration with a specific rule adjustment for `no-unused-vars`.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/configure/combine-configs.md#_snippet_0

LANGUAGE: js
CODE:
```
// eslint.config.js
import js from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
	js.configs.recommended,
	{
		rules: {
			"no-unused-vars": "warn",
		},
	},
]);
```

----------------------------------------

TITLE: Defining Object Literals with ES6 Shorthand in JavaScript
DESCRIPTION: Demonstrates the concise ES6 shorthand syntax for defining object properties and methods. Properties with matching variable names are simplified, and methods omit the 'function' keyword.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/object-shorthand.md#_snippet_1

LANGUAGE: JavaScript
CODE:
```
// properties
const foo = {x, y, z};

// methods
const bar = {
    a() {},
    b() {}
};
```

----------------------------------------

TITLE: Configuring ESLint with Recommended Rules for JavaScript
DESCRIPTION: This configuration snippet demonstrates how to apply the ESLint team's recommended rules to JavaScript files using the @eslint/js plugin. It imports the necessary modules and defines a configuration object that targets .js files, registers the 'js' plugin, and extends 'js/recommended'.
SOURCE: https://github.com/eslint/eslint/blob/main/packages/js/README.md#_snippet_1

LANGUAGE: JavaScript
CODE:
```
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
	// apply recommended rules to JS files
	{
		name: "your-project/recommended-rules",
		files: ["**/*.js"],
		plugins: {
			js,
		},
		extends: ["js/recommended"],
	},

	// apply recommended rules to JS files with an override
	{
		name: "your-project/recommended-rules-with-override",
		files: ["**/*.js"],
		plugins: {
			js,
		},
		extends: ["js/recommended"],
		rules: {
			"no-unused-vars": "warn",
		},
	},

	// apply all rules to JS files
	{
		name: "your-project/all-rules",
		files: ["**/*.js"],
		plugins: {
			js,
		},
		extends: ["js/all"],
		rules: {
			"no-unused-vars": "warn",
		},
	}
]);
```

----------------------------------------

TITLE: Rebasing Local Branch with Upstream Main - Shell
DESCRIPTION: These commands are used to rebase the current local branch on top of the latest `main` branch from the `upstream` remote. `git fetch upstream` updates the local copy of the `upstream` remote, and `git rebase upstream/main` reapplies local commits on top of the fetched `main` branch.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/contribute/pull-requests.md#_snippet_9

LANGUAGE: Shell
CODE:
```
git fetch upstream
git rebase upstream/main
```

----------------------------------------

TITLE: Installing and Configuring ESLint via npm
DESCRIPTION: This command initializes and configures ESLint in a project. It guides the user through a series of questions to set up the initial ESLint configuration file and install necessary dependencies.
SOURCE: https://github.com/eslint/eslint/blob/main/README.md#_snippet_0

LANGUAGE: shell
CODE:
```
npm init @eslint/config@latest
```

----------------------------------------

TITLE: Updating Code and Pushing Changes - Shell
DESCRIPTION: These commands are used to update an existing pull request. `git add -A` stages all changes, `git commit` creates a new commit, and `git push origin issue1234` pushes these new commits to the remote branch associated with the pull request.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/contribute/pull-requests.md#_snippet_8

LANGUAGE: Shell
CODE:
```
git add -A
git commit
git push origin issue1234
```

----------------------------------------

TITLE: Example Prompts for ESLint with GitHub Copilot (Text)
DESCRIPTION: These are example natural language prompts that can be used with GitHub Copilot's agent mode to interact with the configured ESLint MCP server. They demonstrate how to request linting, error explanations, and automatic fixes for files.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/mcp.md#_snippet_3

LANGUAGE: text
CODE:
```
Lint the current file and explain any issues found

Lint and fix #file:index.js
```

----------------------------------------

TITLE: Basic ESLint Configuration for JavaScript
DESCRIPTION: Defines a basic ESLint configuration for JavaScript files using the new flat config format. It extends the recommended JavaScript rules and sets specific rules for `no-unused-vars` and `no-undef` to warnings, providing a starting point for linting.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/getting-started.md#_snippet_9

LANGUAGE: javascript
CODE:
```
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
	{
		files: ["**/*.js"],
		plugins: {
			js,
		},
		extends: ["js/recommended"],
		rules: {
			"no-unused-vars": "warn",
			"no-undef": "warn",
		},
	},
]);
```

----------------------------------------

TITLE: Running ESLint with General Options and Files
DESCRIPTION: This snippet demonstrates the general syntax for running ESLint using `npx`, allowing for various command-line options and specifying files, directories, or glob patterns to lint.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/command-line-interface.md#_snippet_0

LANGUAGE: Shell
CODE:
```
npx eslint [options] [file|dir|glob]*
```

----------------------------------------

TITLE: Using an ESLint Shareable Config in JavaScript
DESCRIPTION: This JavaScript snippet illustrates how to use a shareable ESLint configuration within an `eslint.config.js` file. It imports `defineConfig` and the custom shareable config, then extends it for JavaScript files, applying the shared rules.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/extend/shareable-configs.md#_snippet_2

LANGUAGE: javascript
CODE:
```
// eslint.config.js
import { defineConfig } from "eslint/config";
import myconfig from "eslint-config-myconfig";

export default defineConfig([
	{
		files: ["**/*.js"],
		extends: [myconfig],
	},
]);
```

----------------------------------------

TITLE: Correct Atomic Property Assignment in Async JavaScript
DESCRIPTION: This snippet shows the correct way to handle property assignments in async functions to avoid race conditions, adhering to the `require-atomic-updates` rule. By storing the awaited value in a temporary variable (`tmp`) and re-checking the object's state (`obj.done`) before the final assignment, it ensures the operation is atomic.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/require-atomic-updates.md#_snippet_6

LANGUAGE: JavaScript
CODE:
```
/* eslint require-atomic-updates: error */

async function foo(obj) {
    if (!obj.done) {
        const tmp = await getSomething();
        if (!obj.done) {
            obj.something = tmp;
        }
    }
}
```

----------------------------------------

TITLE: Disallowing Type-Unsafe Equality with 'always' Option
DESCRIPTION: This snippet illustrates code that is considered incorrect when the `eqeqeq` rule is configured with the `always` option. It shows various comparisons using `==` or `!=` that should instead use strict equality (`===`, `!==`) as enforced by this setting.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/eqeqeq.md#_snippet_1

LANGUAGE: javascript
CODE:
```
/*eslint eqeqeq: ["error", "always"]*/

a == b
foo == true
bananas != 1
value == undefined
typeof foo == 'undefined'
'hello' != 'world'
0 == 0
true == true
foo == null
```

----------------------------------------

TITLE: Configuring ESLint Plugins in Flat Config (eslint.config.js)
DESCRIPTION: This JavaScript snippet illustrates how to configure plugins in the new flat config format (`eslint.config.js`). It imports the `eslint-plugin-jsdoc` module directly and assigns it to a property within the `plugins` object of a configuration entry, then defines rules.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/configure/migration-guide.md#_snippet_2

LANGUAGE: JavaScript
CODE:
```
// eslint.config.js

import jsdoc from "eslint-plugin-jsdoc";

export default [
	{
		files: ["**/*.js"],
		plugins: {
			jsdoc: jsdoc
		},
		rules: {
			"jsdoc/require-description": "error",
			"jsdoc/check-values": "error"
		}
	}
];
```

----------------------------------------

TITLE: Recommended Usage of `@eslint/js` for `eslint:recommended` and `eslint:all` in ESLint Flat Config
DESCRIPTION: This JavaScript snippet demonstrates the correct way to include `eslint:recommended` and `eslint:all` configurations in ESLint v9.0.0 flat config. It requires importing `js` from `@eslint/js` and then referencing `js.configs.recommended` and `js.configs.all`.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/migrate-to-9.0.0.md#_snippet_13

LANGUAGE: js
CODE:
```
// eslint.config.js
import js from "@eslint/js";

export default [js.configs.recommended, js.configs.all];
```

----------------------------------------

TITLE: Migrating Linter Configuration to Flat Config Format - JavaScript
DESCRIPTION: This example illustrates the required change in configuration format for the `Linter#verify()` method in ESLint v9.0.0. It contrasts the old `eslintrc` format, which used `parserOptions`, with the new `flat config` format, which now uses `languageOptions` for similar settings.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/migrate-to-9.0.0.md#_snippet_21

LANGUAGE: JavaScript
CODE:
```
// eslintrc config format
linter.verify(code, {
	parserOptions: {
		ecmaVersion: 6,
	},
});

// flat config format
linter.verify(code, {
	languageOptions: {
		ecmaVersion: 6,
	},
});
```

----------------------------------------

TITLE: Defining ESLint Rules with ES Module Syntax
DESCRIPTION: This snippet demonstrates how to configure ESLint rules in `eslint.config.js` using ES module syntax. It utilizes the `defineConfig()` helper from `eslint/config` to export an array of configuration objects, enabling the `semi` and `prefer-const` rules for all processed files. This format is suitable for projects with `"type":"module"` in their `package.json`.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/configure/configuration-files.md#_snippet_0

LANGUAGE: js
CODE:
```
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		rules: {
			semi: "error",
			"prefer-const": "error"
		}
	}
]);
```

----------------------------------------

TITLE: Centralizing Environment Variable Access with a Config File in JavaScript
DESCRIPTION: This snippet illustrates the recommended approach for accessing environment variables by centralizing them through a configuration file. This practice avoids direct `process.env` usage, reducing global dependencies and improving maintainability and scalability of the application.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/no-process-env.md#_snippet_1

LANGUAGE: javascript
CODE:
```
/*eslint no-process-env: "error"*/

var config = require("./config");

if(config.env === "development") {
    //...
}
```

----------------------------------------

TITLE: Installing ESLint Packages
DESCRIPTION: Installs the core ESLint package and the recommended JavaScript configuration package as development dependencies. This is the first step to integrate ESLint into a project, ensuring it's available for linting tasks.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/getting-started.md#_snippet_7

LANGUAGE: npm
CODE:
```
npm install eslint@latest @eslint/js@latest --save-dev
```

LANGUAGE: yarn
CODE:
```
yarn add eslint@latest @eslint/js@latest --dev
```

LANGUAGE: pnpm
CODE:
```
pnpm install eslint@latest @eslint/js@latest --save-dev
```

----------------------------------------

TITLE: Accessing SourceCode Object in ESLint Rule (JavaScript)
DESCRIPTION: This snippet demonstrates how to retrieve the `SourceCode` object within an ESLint custom rule's `create` method. The `SourceCode` object, accessed via `context.sourceCode`, provides an interface for interacting with the source code being linted. It is the recommended way to get source code information, replacing the deprecated `context.getSourceCode()` method.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/extend/custom-rules.md#_snippet_16

LANGUAGE: JavaScript
CODE:
```
module.exports = {
	create: function (context) {
		var sourceCode = context.sourceCode;

		// ...
	},
};
```

----------------------------------------

TITLE: Adding and Committing Changes - Shell
DESCRIPTION: These commands stage all modified and new files (`git add -A`) and then open a text editor to write a commit message (`git commit`). This process saves the current state of your changes to the local branch, preparing them for potential push and pull request submission.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/contribute/pull-requests.md#_snippet_1

LANGUAGE: shell
CODE:
```
git add -A
git commit
```

----------------------------------------

TITLE: Creating a New Branch for an Issue - Shell
DESCRIPTION: This command creates a new Git branch in your local repository, named `issue1234`, and switches to it. It's used to isolate development work for a specific issue or feature, preventing conflicts with other work and ensuring a clean history for the pull request.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/contribute/pull-requests.md#_snippet_0

LANGUAGE: shell
CODE:
```
git checkout -b issue1234
```

----------------------------------------

TITLE: Extending ESLint with Airbnb Base Config
DESCRIPTION: This JSON snippet shows how to configure ESLint to extend the `airbnb-base` shareable configuration in a `.eslintrc` file. By using `extends`, ESLint automatically applies the rules defined in the `eslint-config-airbnb-base` package.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/migrating-from-jscs.md#_snippet_6

LANGUAGE: json
CODE:
```
{
	"extends": "airbnb-base"
}
```

----------------------------------------

TITLE: Deprecated `eslint:recommended` and `eslint:all` String Usage in ESLint Flat Config (v8.x)
DESCRIPTION: This JavaScript snippet illustrates the deprecated method of including `"eslint:recommended"` and `"eslint:all"` directly as strings in an ESLint v8.x flat configuration array. This approach is no longer supported in ESLint v9.0.0 and will result in an error.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/migrate-to-9.0.0.md#_snippet_12

LANGUAGE: js
CODE:
```
// eslint.config.js
export default ["eslint:recommended", "eslint:all"];
```

----------------------------------------

TITLE: Configuring ESLint Processors in Flat Config (JavaScript)
DESCRIPTION: This snippet demonstrates multiple valid ways to configure processors in a flat configuration file (eslint.config.js). It shows referencing a processor by name from a plugin, embedding the processor object directly, and using the processor object without explicitly listing the plugin in the current config object.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/configure/migration-guide.md#_snippet_8

LANGUAGE: javascript
CODE:
```
import somePlugin from "eslint-plugin-someplugin";

export default [
	{
		plugins: { somePlugin },
		processor: "somePlugin/someProcessor",
	},
	{
		plugins: { somePlugin },
		// We can embed the processor object in the config directly
		processor: somePlugin.processors.someProcessor,
	},
	{
		// We don't need the plugin to be present in the config to use the processor directly
		processor: somePlugin.processors.someProcessor,
	},
];
```

----------------------------------------

TITLE: Correct Code Examples for ESLint `require-atomic-updates` Rule
DESCRIPTION: These examples illustrate code patterns that adhere to the `require-atomic-updates` rule. They either re-read the variable after the `await`/`yield` (e.g., `await something + result`), use a temporary variable to store the awaited value before updating (e.g., `const tmp = ...; result += tmp;`), or operate on local variables which are not subject to external modification during pauses.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/require-atomic-updates.md#_snippet_4

LANGUAGE: javascript
CODE:
```
/* eslint require-atomic-updates: error */

let result;

async function foobar() {
    result = await something + result;
}

async function baz() {
    const tmp = doSomething(await somethingElse);
    result += tmp;
}

async function qux() {
    if (!result) {
        const tmp = await initialize();
        if (!result) {
            result = tmp;
        }
    }
}

async function quux() {
    let localVariable = 0;
    localVariable += await something;
}

function* generator() {
    result = (yield) + result;
}
```

----------------------------------------

TITLE: Instantiating ESLint Class (JavaScript)
DESCRIPTION: This snippet shows the basic syntax for creating a new instance of the `ESLint` class. The constructor accepts an optional `options` object, which can be used to configure various aspects of ESLint's behavior, such as file enumeration, ignoring patterns, and more. If no options are provided, default values are used.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/integrate/nodejs-api.md#_snippet_3

LANGUAGE: JavaScript
CODE:
```
const eslint = new ESLint(options);
```

----------------------------------------

TITLE: Applying Conditional Configs in Flat Config
DESCRIPTION: Demonstrates how to apply a configuration object conditionally to specific files in a flat config. This example uses the spread operator to merge a custom test config and applies it only to files matching the `**/*.test.js` glob pattern.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/configure/migration-guide.md#_snippet_22

LANGUAGE: javascript
CODE:
```
// eslint.config.js

import js from "@eslint/js";
import customTestConfig from "./custom-test-config.js";

export default [
	js.configs.recommended,
	{
		...customTestConfig,
		files: ["**/*.test.js"]
	}
];
```

----------------------------------------

TITLE: Glob-Based Configuration with Multiple Patterns in Flat Config (JavaScript)
DESCRIPTION: This snippet demonstrates how to apply different ESLint configurations to specific file glob patterns within a flat configuration file (eslint.config.js). It shows how to define separate configuration objects for `src` and `test` directories, similar to `overrides` in eslintrc but as distinct array elements.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/configure/migration-guide.md#_snippet_13

LANGUAGE: javascript
CODE:
```
import js from "@eslint/js";

export default [
	js.configs.recommended, // Recommended config applied to all files
	// File-pattern specific overrides
	{
		files: ["src/**/*", "test/**/*"],
		rules: {
			semi: ["warn", "always"],
		},
	},
	{
		files: ["test/**/*"],
		rules: {
			"no-console": "off",
		},
	},
	// ...other configurations
];
```

----------------------------------------

TITLE: Adding Descriptions to ESLint Directive Comments - JavaScript
DESCRIPTION: This snippet illustrates how to append a descriptive comment to an ESLint directive, such as `eslint-disable-next-line`. Introduced in ESLint v7.0.0, this feature allows developers to provide context for why a specific rule is being disabled or configured by adding text after `--` surrounded by whitespace. This enhances code readability and maintainability by co-locating explanations with the directive.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/migrating-to-7.0.0.md#_snippet_1

LANGUAGE: JavaScript
CODE:
```
// eslint-disable-next-line a-rule, another-rule -- those are buggy!!
```

----------------------------------------

TITLE: Configuring Custom Parser in Flat Config (JavaScript)
DESCRIPTION: This snippet illustrates how to import and assign a custom parser, like @babel/eslint-parser, to the `languageOptions.parser` property within a flat configuration object in eslint.config.js. This modern approach uses module imports for parsers.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/configure/migration-guide.md#_snippet_4

LANGUAGE: javascript
CODE:
```
import babelParser from "@babel/eslint-parser";

export default [
	{
		// ...other config
		languageOptions: {
			parser: babelParser,
		},
		// ...other config
	},
];
```

----------------------------------------

TITLE: Configuring Plugin Rules in ESLint Configuration File (JavaScript)
DESCRIPTION: This code shows how to configure rules provided by an ESLint plugin within an `eslint.config.js` file. It involves importing the plugin and then referencing its rules using the `plugin-namespace/rule-id` format.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/configure/rules.md#_snippet_10

LANGUAGE: JavaScript
CODE:
```
// eslint.config.js
import example from "eslint-plugin-example";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		plugins: {
			example,
		},
		rules: {
			"example/rule1": "warn",
		},
	},
]);
```

----------------------------------------

TITLE: Configuring ESLint Overrides for Additional File Types (YAML)
DESCRIPTION: This YAML configuration demonstrates how ESLint's `overrides` property can be used to lint files with extensions other than `.js`, such as `.ts`. It shows extending a base configuration (`my-config-js`) and then applying a specific configuration (`my-config-ts`) for TypeScript files matched by the `*.ts` pattern. This allows for automatic linting of specified file types without needing the `--ext` CLI option.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/migrating-to-7.0.0.md#_snippet_0

LANGUAGE: YAML
CODE:
```
# .eslintrc.yml
extends: my-config-js
overrides:
    - files: "*.ts"
      extends: my-config-ts
```

----------------------------------------

TITLE: Disabling ESLint Rules in Configuration File (JavaScript)
DESCRIPTION: This snippet demonstrates how to disable ESLint rules for a group of files using a configuration file (eslint.config.js). It uses the files key within a subsequent config object to apply no-unused-expressions: "off" to test files.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/configure/rules.md#_snippet_22

LANGUAGE: JavaScript
CODE:
```
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		rules: {
			"no-unused-expressions": "error"
		}
	},
	{
		files: ["*-test.js", "*.spec.js"],
		rules: {
			"no-unused-expressions": "off"
		}
	}
]);
```

----------------------------------------

TITLE: Forcing Push After Rebase - Shell
DESCRIPTION: This command performs a forced push to the `origin` remote for the `issue1234` branch. It is necessary after a rebase operation to overwrite the remote branch's history with the new, rebased history.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/contribute/pull-requests.md#_snippet_10

LANGUAGE: Shell
CODE:
```
git push origin issue1234 -f
```

----------------------------------------

TITLE: Using a Shareable Configuration Package in ESLint
DESCRIPTION: This JavaScript snippet demonstrates how to integrate a shareable configuration package, `eslint-config-example`, into your `eslint.config.js` file. It imports the configuration and includes it in the `extends` array, allowing you to apply shared rules while also defining custom rules like `no-unused-vars`.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/configure/configuration-files.md#_snippet_22

LANGUAGE: js
CODE:
```
// eslint.config.js
import exampleConfig from "eslint-config-example";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.js"],
		extends: [exampleConfig],
		rules: {
			"no-unused-vars": "warn"
		}
	}
]);
```

----------------------------------------

TITLE: Incorrect String Escaping in RegExp Constructor - JavaScript
DESCRIPTION: This example illustrates a common mistake when using the RegExp constructor: forgetting to double-escape backslashes in the string argument. This leads to a completely different regular expression than intended, demonstrating a pitfall that regex literals avoid.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/prefer-regex-literals.md#_snippet_1

LANGUAGE: JavaScript
CODE:
```
new RegExp("^\d\.$");

// equivalent to /^d.$/, matches "d1", "d2", "da", "db" ...
```

----------------------------------------

TITLE: Disabling Specific ESLint Rules in a Block (JavaScript)
DESCRIPTION: This example shows how to disable specific ESLint rules (e.g., no-alert, no-console) within a code block. The rules are listed after /* eslint-disable and re-enabled with /* eslint-enable followed by the same rule names.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/configure/rules.md#_snippet_13

LANGUAGE: JavaScript
CODE:
```
/* eslint-disable no-alert, no-console */

alert("foo");
console.log("bar");

/* eslint-enable no-alert, no-console */
```

----------------------------------------

TITLE: Translating eslintrc Configs with FlatCompat
DESCRIPTION: Illustrates how to use the `FlatCompat` utility from `@eslint/eslintrc` to convert an existing eslintrc-formatted shareable config (e.g., `eslint-config-my-config`) into the flat config format. It requires importing `FlatCompat`, `path`, and `fileURLToPath` for proper directory resolution.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/configure/migration-guide.md#_snippet_23

LANGUAGE: javascript
CODE:
```
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname
});

export default [
	// mimic ESLintRC-style extends
	...compat.extends("eslint-config-my-config")
];
```

----------------------------------------

TITLE: Linting Files with ESLint (JavaScript)
DESCRIPTION: This snippet demonstrates the basic usage of the ESLint class to lint files. It initializes an ESLint instance, lints a set of JavaScript files, loads the 'stylish' formatter, and then outputs the formatted linting results to the console. This is a fundamental example for integrating ESLint into Node.js applications.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/integrate/nodejs-api.md#_snippet_0

LANGUAGE: JavaScript
CODE:
```
const { ESLint } = require("eslint");

(async function main() {
	// 1. Create an instance.
	const eslint = new ESLint();

	// 2. Lint files.
	const results = await eslint.lintFiles(["lib/**/*.js"]);

	// 3. Format the results.
	const formatter = await eslint.loadFormatter("stylish");
	const resultText = formatter.format(results);

	// 4. Output it.
	console.log(resultText);
})().catch(error => {
	process.exitCode = 1;
	console.error(error);
});
```

----------------------------------------

TITLE: Enforcing Console Calls with `no-restricted-syntax` Rule (JSON)
DESCRIPTION: Provides a JSON configuration for ESLint rules, demonstrating how to disable `no-console` and instead use `no-restricted-syntax` to specifically disallow calls to `console` methods other than `log`, `warn`, `error`, `info`, or `trace`. This allows for fine-grained control over `console` usage.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/no-console.md#_snippet_6

LANGUAGE: json
CODE:
```
{
    "rules": {
        "no-console": "off",
        "no-restricted-syntax": [
            "error",
            {
                "selector": "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
                "message": "Unexpected property on console object was called"
            }
        ]
    }
}
```

----------------------------------------

TITLE: Enabling JSX Parsing in ESLint Configuration (JavaScript)
DESCRIPTION: This configuration example shows how to enable JSX syntax parsing within ESLint's default parser. By setting 'jsx: true' under 'languageOptions.parserOptions.ecmaFeatures', ESLint can correctly interpret JSX syntax, although it does not provide React-specific semantics.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/configure/language-options.md#_snippet_1

LANGUAGE: JavaScript
CODE:
```
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			}
		}
	}
]);
```

----------------------------------------

TITLE: Applying Rules to Specific Directories with `files` in ESLint
DESCRIPTION: This configuration demonstrates how to limit rule application to files within a specific directory. The `semi` rule is applied only to JavaScript files located within the `src` directory, ensuring that rules are scoped to relevant parts of the codebase.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/configure/configuration-files.md#_snippet_4

LANGUAGE: javascript
CODE:
```
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["src/**/*.js"],
		rules: {
			semi: "error"
		}
	}
]);
```

----------------------------------------

TITLE: Configuring `no-unused-vars` Rule Options (JSON)
DESCRIPTION: This JSON snippet provides a comprehensive example of how to configure the `no-unused-vars` ESLint rule using an object. It demonstrates setting options such as `vars` (e.g., 'all'), `args` (e.g., 'after-used'), `caughtErrors`, `ignoreRestSiblings`, and `reportUsedIgnorePattern` to customize the rule's behavior.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/no-unused-vars.md#_snippet_4

LANGUAGE: json
CODE:
```
{
    "rules": {
        "no-unused-vars": ["error", {
            "vars": "all",
            "args": "after-used",
            "caughtErrors": "all",
            "ignoreRestSiblings": false,
            "reportUsedIgnorePattern": false
        }]
    }
}
```

----------------------------------------

TITLE: Using Spread Syntax for Variadic Functions - JavaScript
DESCRIPTION: This snippet shows the modern ES2015+ approach to calling variadic functions using the spread syntax. It provides a more concise and readable alternative to `apply()`.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/prefer-spread.md#_snippet_1

LANGUAGE: javascript
CODE:
```
const args = [1, 2, 3, 4];
Math.max(...args);
```

----------------------------------------

TITLE: Configuring ESLint Feature Flags in VS Code Editor Settings
DESCRIPTION: This JSON snippet demonstrates how to enable ESLint feature flags within the VS Code ESLint Extension for editor-wide linting. Flags are specified as an array of strings in the `eslint.options` setting within your `settings.json` file.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/pages/flags.md#_snippet_3

LANGUAGE: JSON
CODE:
```
{
	"eslint.options": { "flags": ["flag_one", "flag_two"] }
}
```

----------------------------------------

TITLE: ESLint Configuration for Browser Environments
DESCRIPTION: This `eslint.config.js` example demonstrates how to configure ESLint for code running in a browser environment. It imports browser global variables and extends the recommended JavaScript rules, ensuring browser-specific linting.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/getting-started.md#_snippet_3

LANGUAGE: JavaScript
CODE:
```
import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
	{ files: ["**/*.js"], languageOptions: { globals: globals.browser } },
	{ files: ["**/*.js"], plugins: { js }, extends: ["js/recommended"] }
]);
```

----------------------------------------

TITLE: Identifying Undeclared Variables in JavaScript
DESCRIPTION: This snippet demonstrates incorrect code for the `no-undef` ESLint rule, where `someFunction` and `a` are used without being declared. This will result in `ReferenceError` warnings from ESLint, highlighting potential issues with undeclared variables or implicit globals.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/no-undef.md#_snippet_0

LANGUAGE: JavaScript
CODE:
```
/*eslint no-undef: "error"*/

const foo = someFunction();
const bar = a + 1;
```

----------------------------------------

TITLE: Running ESLint with Auto-Fix Option
DESCRIPTION: This command runs ESLint on `example.js` and attempts to automatically fix any fixable linting issues identified by the custom plugin. The `--fix` flag instructs ESLint to modify the source file directly to resolve problems.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/extend/custom-rule-tutorial.md#_snippet_24

LANGUAGE: Shell
CODE:
```
npx eslint example.js --fix
```

----------------------------------------

TITLE: ASI Pitfall: Missing Semicolon Leading to Runtime Error in JavaScript
DESCRIPTION: This example illustrates another Automatic Semicolon Insertion (ASI) pitfall where a semicolon is *not* inserted after the first line `var globalCounter = { }`. This omission causes a runtime error because the empty object `globalCounter` is immediately followed by a function call `(...)`, leading to an attempt to call an object as a function. The `no-unexpected-multiline` rule can prevent such issues.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/rules/semi.md#_snippet_3

LANGUAGE: js
CODE:
```
var globalCounter = { }

(function () {
    var n = 0
    globalCounter.increment = function () {
        return ++n
    }
})()
```

----------------------------------------

TITLE: Importing and Configuring ESLint Instance (JavaScript)
DESCRIPTION: This JavaScript snippet demonstrates how to import the `ESLint` class from the `eslint` package and create a new instance. It defines a `createESLintInstance` function that takes an `overrideConfig` object to customize ESLint's behavior, enabling `fix: true` and `overrideConfigFile: true`.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/integrate/integration-tutorial.md#_snippet_1

LANGUAGE: javascript
CODE:
```
// example-eslint-integration.js

const { ESLint } = require("eslint");

// Create an instance of ESLint with the configuration passed to the function
function createESLintInstance(overrideConfig) {
	return new ESLint({
		overrideConfigFile: true,
		overrideConfig,
		fix: true,
	});
}
```

----------------------------------------

TITLE: Disabling Inline ESLint Configuration Comments in JavaScript
DESCRIPTION: This snippet demonstrates how to disable all inline configuration comments in ESLint using the `noInlineConfig` setting within `linterOptions` in `eslint.config.js`. This prevents rules from being overridden or disabled directly within source files. It also shows an example of setting a rule like `no-unused-expressions` to 'error'.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/configure/rules.md#_snippet_23

LANGUAGE: JavaScript
CODE:
```
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		linterOptions: {
			noInlineConfig: true,
		},
		rules: {
			"no-unused-expressions": "error",
		},
	},
]);
```

----------------------------------------

TITLE: Setting Parser Options with --parser-options in ESLint
DESCRIPTION: These examples demonstrate how to use the `--parser-options` option to pass specific settings to the ESLint parser. This is crucial for enabling support for newer ECMAScript features, such as `ecmaVersion:7` for the exponentiation operator (`**`), which would otherwise cause parsing errors with older versions like `ecmaVersion:6`.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/command-line-interface.md#_snippet_16

LANGUAGE: Shell
CODE:
```
echo '3 ** 4' | npx eslint --stdin --parser-options ecmaVersion:6
```

LANGUAGE: Shell
CODE:
```
echo '3 ** 4' | npx eslint --stdin --parser-options ecmaVersion:7
```

----------------------------------------

TITLE: ESLint Command Line Interface Options
DESCRIPTION: This snippet provides a comprehensive list of command-line options for ESLint, categorized by their functionality. It details how to configure ESLint, specify rules and plugins, fix problems, ignore files, handle warnings, manage output, control caching, and suppress violations, along with other miscellaneous utilities.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/use/command-line-interface.md#_snippet_8

LANGUAGE: txt
CODE:
```
eslint [options] file.js [file.js] [dir]

Basic configuration:
  --no-config-lookup              Disable look up for eslint.config.js
  -c, --config path::String       Use this configuration instead of eslint.config.js, eslint.config.mjs, or
                                  eslint.config.cjs
  --inspect-config                Open the config inspector with the current configuration
  --ext [String]                  Specify additional file extensions to lint
  --global [String]               Define global variables
  --parser String                 Specify the parser to be used
  --parser-options Object         Specify parser options

Specify Rules and Plugins:
  --plugin [String]               Specify plugins
  --rule Object                   Specify rules

Fix Problems:
  --fix                           Automatically fix problems
  --fix-dry-run                   Automatically fix problems without saving the changes to the file system
  --fix-type Array                Specify the types of fixes to apply (directive, problem, suggestion, layout)

Ignore Files:
  --no-ignore                     Disable use of ignore files and patterns
  --ignore-pattern [String]       Patterns of files to ignore

Use stdin:
  --stdin                         Lint code provided on <STDIN> - default: false
  --stdin-filename String         Specify filename to process STDIN as

Handle Warnings:
  --quiet                         Report errors only - default: false
  --max-warnings Int              Number of warnings to trigger nonzero exit code - default: -1

Output:
  -o, --output-file path::String  Specify file to write report to
  -f, --format String             Use a specific output format - default: stylish
  --color, --no-color             Force enabling/disabling of color

Inline configuration comments:
  --no-inline-config              Prevent comments from changing config or rules
  --report-unused-disable-directives  Adds reported errors for unused eslint-disable and eslint-enable directives
  --report-unused-disable-directives-severity String  Chooses severity level for reporting unused eslint-disable and
                                                      eslint-enable directives - either: off, warn, error, 0, 1, or 2
  --report-unused-inline-configs String  Adds reported errors for unused eslint inline config comments - either: off, warn, error, 0, 1, or 2

Caching:
  --cache                         Only check changed files - default: false
  --cache-file path::String       Path to the cache file. Deprecated: use --cache-location - default: .eslintcache
  --cache-location path::String   Path to the cache file or directory
  --cache-strategy String         Strategy to use for detecting changed files in the cache - either: metadata or
                                  content - default: metadata

Suppressing Violations:
  --suppress-all                  Suppress all violations - default: false
  --suppress-rule [String]        Suppress specific rules
  --suppressions-location path::String  Specify the location of the suppressions file
  --prune-suppressions            Prune unused suppressions - default: false

Miscellaneous:
  --init                          Run config initialization wizard - default: false
  --env-info                      Output execution environment information - default: false
  --no-error-on-unmatched-pattern  Prevent errors when pattern is unmatched
  --exit-on-fatal-error           Exit with exit code 2 in case of fatal error - default: false
  --no-warn-ignored               Suppress warnings when the file list includes ignored files
  --pass-on-no-patterns           Exit with exit code 0 in case no file patterns are passed
  --debug                         Output debugging information
  -h, --help                      Show help
  -v, --version                   Output the version number
  --print-config path::String     Print the configuration for the given file
  --stats                         Add statistics to the lint report - default: false
  --flag [String]                 Enable a feature flag
  --mcp                           Start the ESLint MCP server
```

----------------------------------------

TITLE: Rebasing Local Branch onto Upstream Main - Shell
DESCRIPTION: These commands update your local `upstream` remote tracking branch (`git fetch upstream`) and then reapply your local commits on top of the latest `main` branch from the upstream repository (`git rebase upstream/main`). This process synchronizes your branch with the project's main codebase, minimizing merge conflicts before submitting a pull request.
SOURCE: https://github.com/eslint/eslint/blob/main/docs/src/contribute/pull-requests.md#_snippet_4

LANGUAGE: shell
CODE:
```
git fetch upstream
git rebase upstream/main
```