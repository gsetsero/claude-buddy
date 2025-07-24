TITLE: PreToolUseContext Example
DESCRIPTION: Example demonstrating how to use the PreToolUseContext to inspect tool execution details and conditionally approve or block tools based on input parameters.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_3

LANGUAGE: python
CODE:
```
from cchooks import create_context
from cchooks.contexts import PreToolUseContext

context = create_context()
if isinstance(context, PreToolUseContext):
    tool_name = context.tool_name
    tool_input = context.tool_input

    if tool_name == "Write" and "password" in tool_input.get("file_path", ""):
        context.output.simple_block("Refusing to write to password file")
    else:
        context.output.simple_approve()
```

----------------------------------------

TITLE: Hook Example: Notification Handler
DESCRIPTION: An example of a notification handler hook. It receives a message and acknowledges its receipt, with a placeholder comment for sending a desktop notification.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_23

LANGUAGE: python
CODE:
```
#!/usr/bin/env python3
"""Example notification handler."""

from cchooks import create_context
from cchooks.contexts import NotificationContext

def main():
    context = create_context()

    if isinstance(context, NotificationContext):
        message = context.message

        # Some logic to send Desktop Notification

        context.output.acknowledge("Desktop Notification Sent!")

if __name__ == "__main__":
    main()
```

----------------------------------------

TITLE: Hook Example: Post-Processing
DESCRIPTION: An example of a post-tool use hook that logs tool usage details, including the tool name, input, and response, to a file named 'tool_usage.log'.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_22

LANGUAGE: python
CODE:
```
#!/usr/bin/env python3
"""Example post-tool use hook for logging."""

import json
from cchooks import create_context
from cchooks.contexts import PostToolUseContext

def main():
    context = create_context()

    if isinstance(context, PostToolUseContext):
        # Log tool usage
        log_entry = {
            "tool": context.tool_name,
            "input": context.tool_input,
            "response": context.tool_response
        }

        with open("tool_usage.log", "a") as f:
            json.dump(log_entry, f)
            f.write("\n")

        context.output.exit_success("Logged successfully")

if __name__ == "__main__":
    main()
```

----------------------------------------

TITLE: Basic Hook Example: Pre-ToolUse
DESCRIPTION: An example of a pre-tool use hook that checks for dangerous file operations. It blocks operations targeting 'config/' directories and allows others.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_20

LANGUAGE: python
CODE:
```
#!/usr/bin/env python3
"""Example hook for blocking dangerous file writes."""

import sys
from cchooks import create_context
from cchooks.contexts import PreToolUseContext

def main():
    try:
        context = create_context()
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

    if isinstance(context, PreToolUseContext):
        # Check for dangerous file operations
        if (context.tool_name == "Write" and
            "config/" in context.tool_input.get("file_path", "")):
            context.output.exit_block("Config files are protected")
        else:
            context.output.exit_success()

if __name__ == "__main__":
    main()
```

----------------------------------------

TITLE: Hook Example: JSON Output Mode
DESCRIPTION: Demonstrates using JSON output for advanced control in a pre-tool use hook. It specifically blocks the 'rm -rf /' command and approves others.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_21

LANGUAGE: python
CODE:
```
#!/usr/bin/env python3
"""Example using JSON output for advanced control."""

from cchooks import create_context
from cchooks.contexts import PreToolUseContext

def main():
    context = create_context()

    if isinstance(context, PreToolUseContext):
        tool_name = context.tool_name
        tool_input = context.tool_input

        if tool_name == "Bash":
            command = tool_input.get("command", "")
            if "rm -rf /" in command:
                context.output.block("Dangerous command detected")
            else:
                context.output.approve("Command looks safe")

if __name__ == "__main__":
    main()
```

----------------------------------------

TITLE: PostToolUseContext Python Example
DESCRIPTION: Handles feedback or blocking after tool execution. It provides access to the tool's name, input, and response, and offers methods to accept, challenge, ignore, or halt the process.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_5

LANGUAGE: python
CODE:
```
from cchooks.contexts import PostToolUseContext

if isinstance(context, PostToolUseContext):
    tool_name = context.tool_name
    tool_input = context.tool_input
    tool_response = context.tool_response

    if tool_response.get("success") == False:
        context.output.simple_block("Tool execution failed")
```

----------------------------------------

TITLE: PreCompactContext Python Example
DESCRIPTION: Runs before transcript compaction, allowing custom instructions. It identifies the trigger type (manual or auto) and processes custom instructions if provided.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_9

LANGUAGE: python
CODE:
```
from cchooks.contexts import PreCompactContext

if isinstance(context, PreCompactContext):
    trigger = context.trigger  # "manual" or "auto"
    instructions = context.custom_instructions

    if trigger == "manual" and instructions:
        process_custom_instructions(instructions)

    context.output.acknowledge("Compaction ready")
```

----------------------------------------

TITLE: NotificationContext Python Example
DESCRIPTION: Processes notifications without decision control capabilities. It allows access to the notification message and provides methods to acknowledge or exit.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_6

LANGUAGE: python
CODE:
```
from cchooks.contexts import NotificationContext

if isinstance(context, NotificationContext):
    message = context.message
    log_notification(message)
    context.output.simple_success("Notification processed")
```

----------------------------------------

TITLE: SubagentStopContext Python Example
DESCRIPTION: Controls subagent stopping behavior when a subagent wants to stop. It is similar to StopContext but specifically for subagents.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_8

LANGUAGE: python
CODE:
```
from cchooks.contexts import SubagentStopContext

if isinstance(context, SubagentStopContext):
    # Similar to StopContext but for subagents
    context.output.simple_approve()
```

----------------------------------------

TITLE: BaseHookOutput Methods
DESCRIPTION: Abstract base class for all hook outputs, offering methods to control the Claude Code execution flow, such as continuing, stopping, or exiting with specific statuses.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_2

LANGUAGE: APIDOC
CODE:
```
BaseHookOutput:
  Abstract base class for all hook outputs.

  Methods:
    _continue_flow(suppress_output: bool = False) -> dict - JSON response to continue processing
    _stop_flow(stop_reason: str, suppress_output: bool = False) -> dict - JSON response to stop processing
    _success(message: Optional[str] = None) -> NoReturn - Exit with success (code 0)
    _error(message: str, exit_code: int = 1) -> NoReturn - Exit with non-blocking error (code 1)
    _block(reason: str) -> NoReturn - Exit with blocking error (code 2)
```

----------------------------------------

TITLE: StopContext Python Example
DESCRIPTION: Controls Claude's stopping behavior when it intends to stop. It checks if a stop hook is active and provides methods to allow or prevent stopping.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_7

LANGUAGE: python
CODE:
```
from cchooks.contexts import StopContext

if isinstance(context, StopContext):
    if context.stop_hook_active:
        # Already handled by stop hook
        context.output.simple_approve()
    else:
        # Allow Claude to stop
        context.output.simple_approve()
```

----------------------------------------

TITLE: Quick Start: Block .env file writes
DESCRIPTION: A basic example demonstrating how to create a Claude Code hook that blocks write operations to .env files using the cchooks library.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/README.md#_snippet_1

LANGUAGE: python
CODE:
```
#!/usr/bin/env python3
from cchooks import create_context

c = create_context()

# Block writes to .env files
if c.tool_name == "Write" and ".env" in c.tool_input.get("file_path", ""):
    c.output.exit_block("Nope! .env files are protected")
else:
    c.output.exit_success()
```

----------------------------------------

TITLE: PreToolUseContext Properties and Output Methods
DESCRIPTION: Context for hooks running before tool execution, allowing approval or blocking. It provides tool-specific details and specialized output methods for controlling execution flow.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_4

LANGUAGE: APIDOC
CODE:
```
PreToolUseContext:
  Context for hooks running before tool execution.

  Properties:
    tool_name: ToolName - Name of the tool being executed
    tool_input: Dict[str, Any] - Parameters being passed to the tool

  Output Methods:
    approve(reason: str = "", suppress_output: bool = False) - Approve tool execution
    block(reason: str, suppress_output: bool = False) - Block tool execution
    defer(suppress_output: bool = False) - Defer to Claude's permission system
    halt(reason: str, suppress_output: bool = False) - Stop all processing immediately
    exit_success(message: Optional[str] = None) -> NoReturn - Exit 0 (success)
    exit_non_block(message: str) -> NoReturn - Exit 1 (non-blocking error)
    exit_block(reason: str) -> NoReturn - Exit 2 (blocking error)
```

----------------------------------------

TITLE: CCHooks Type Definitions
DESCRIPTION: Defines the possible literal values for hook event types and tool names within the cchooks system.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_10

LANGUAGE: APIDOC
CODE:
```
HookEventType:
  Possible values: "PreToolUse", "PostToolUse", "Notification", "Stop", "SubagentStop", "PreCompact"

ToolName:
  Possible values: "Task", "Bash", "Glob", "Grep", "Read", "Edit", "MultiEdit", "Write", "WebFetch", "WebSearch"
```

----------------------------------------

TITLE: Define Pre-ToolUse Decision Types
DESCRIPTION: Defines the literal types for pre-tool use decisions, specifying allowed values for approving or blocking tool execution.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_11

LANGUAGE: python
CODE:
```
from cchooks.types import PreToolUseDecision, PostToolUseDecision, StopDecision

# Possible values:
PreToolUseDecision = Literal["approve", "block"]
PostToolUseDecision = Literal["block"]
StopDecision = Literal["block"]
```

----------------------------------------

TITLE: Notification Hook Input Example (JSON)
DESCRIPTION: Provides the JSON structure for the Notification hook. This hook receives a message detailing the notification event, such as user permission requests or idle prompts.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/what-is-cc-hook.md#_snippet_4

LANGUAGE: json
CODE:
```
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "hook_event_name": "Notification",
  "message": "Task completed successfully"
}
```

----------------------------------------

TITLE: BaseHookContext Properties and Methods
DESCRIPTION: Abstract base class for all hook contexts, providing common functionality and properties like session ID, transcript path, hook event name, and an output handler.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_1

LANGUAGE: APIDOC
CODE:
```
BaseHookContext:
  Abstract base class for all hook contexts.

  Properties:
    session_id: str - Unique session identifier
    transcript_path: str - Path to transcript file
    hook_event_name: str - Type of hook event
    output: BaseHookOutput - Output handler for this context type

  Methods:
    from_stdin(stdin: TextIO = sys.stdin) -> BaseHookContext - Create context from stdin JSON
```

----------------------------------------

TITLE: PreCompact Hook Input Example (JSON)
DESCRIPTION: Illustrates the JSON input for the PreCompact hook. It includes the trigger type ('manual' or 'auto') and any custom instructions provided by the user for the compact operation.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/what-is-cc-hook.md#_snippet_6

LANGUAGE: json
CODE:
```
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "hook_event_name": "PreCompact",
  "trigger": "manual",
  "custom_instructions": ""
}
```

----------------------------------------

TITLE: PreToolUse Hook Input Example (JSON)
DESCRIPTION: Shows the JSON input structure for the PreToolUse hook. It includes common fields and event-specific data like the tool name and its input parameters, which vary based on the tool being used.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/what-is-cc-hook.md#_snippet_2

LANGUAGE: json
CODE:
```
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "hook_event_name": "PreToolUse",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.txt",
    "content": "file content"
  }
}
```

----------------------------------------

TITLE: Read JSON from Stdin
DESCRIPTION: Reads and parses JSON data from standard input. Includes built-in validation to ensure the input is valid JSON.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_17

LANGUAGE: python
CODE:
```
from cchooks.utils import read_json_from_stdin

data = read_json_from_stdin()
print(f"Hook type: {data['hook_event_name']}")
```

----------------------------------------

TITLE: SubagentStop: Control subagent workflows
DESCRIPTION: A SubagentStop hook example that allows subagents to complete their tasks by simply approving their execution flow.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/README.md#_snippet_6

LANGUAGE: python
CODE:
```
from cchooks import create_context
c = create_context()
c.output.simple_approve()  # Let subagents complete
```

----------------------------------------

TITLE: PostToolUse Hook Input Example (JSON)
DESCRIPTION: Details the JSON input for the PostToolUse hook. This structure contains common session information, the tool name, its input, and the tool's response, indicating success or failure.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/what-is-cc-hook.md#_snippet_3

LANGUAGE: json
CODE:
```
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "hook_event_name": "PostToolUse",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.txt",
    "content": "file content"
  },
  "tool_response": {
    "filePath": "/path/to/file.txt",
    "success": true
  }
}
```

----------------------------------------

TITLE: Stop and SubagentStop Hook Input Example (JSON)
DESCRIPTION: Shows the JSON input for Stop and SubagentStop hooks. It includes a flag `stop_hook_active` to prevent infinite loops if a stop hook is already processing.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/what-is-cc-hook.md#_snippet_5

LANGUAGE: json
CODE:
```
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "hook_event_name": "Stop",
  "stop_hook_active": true
}
```

----------------------------------------

TITLE: Define Pre-Compact Trigger Types
DESCRIPTION: Defines the literal types for pre-compact triggers, specifying allowed values for manual or automatic triggers.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_12

LANGUAGE: python
CODE:
```
from cchooks.types import PreCompactTrigger

# Possible values:
PreCompactTrigger = Literal["manual", "auto"]
```

----------------------------------------

TITLE: ParseError Exception
DESCRIPTION: An exception raised specifically when there is a failure during the JSON parsing process within the cchooks library.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_15

LANGUAGE: python
CODE:
```
# Raised when JSON parsing fails.
```

----------------------------------------

TITLE: Create Hook Context
DESCRIPTION: Factory function to automatically detect the hook type from JSON input and return the appropriate specialized context. It can read from standard input or a custom file stream.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_0

LANGUAGE: python
CODE:
```
from cchooks import create_context

# Read from stdin automatically
context = create_context()

# Or use custom stdin
with open('input.json') as f:
    context = create_context(stdin=f)
```

----------------------------------------

TITLE: InvalidHookTypeError Exception
DESCRIPTION: An exception raised when an attempt is made to process or create a hook with an unrecognized or invalid hook type.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_16

LANGUAGE: python
CODE:
```
# Raised when an invalid hook type is encountered.
```

----------------------------------------

TITLE: cchooks API: Output Control Methods
DESCRIPTION: Documentation for the `c.output` object, detailing methods for controlling Claude's behavior via exit codes or JSON responses. This includes approving, blocking, deferring, and preventing actions.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/README.md#_snippet_9

LANGUAGE: APIDOC
CODE:
```
c.output Object: Controls Claude's response and execution flow.

Simple Mode (Exit Codes):
  - `c.output.exit_success()`: Approves the current operation. Returns exit code 0.
  - `c.output.exit_block(reason: str)`: Blocks the current operation with a specified reason. Returns exit code 2.

Advanced Mode (JSON Control):
  - `c.output.approve(reason: str = "")`: Approves the operation, optionally with a reason. Claude proceeds.
  - `c.output.block(reason: str)`: Blocks the operation with a specific reason. Claude stops and reports the reason.
  - `c.output.defer()`: Defers the decision or action, allowing Claude to re-evaluate or seek further input.
  - `c.output.prevent(prompt: str)`: Prevents Claude from stopping the task and provides a prompt to encourage further work.
  - `c.output.allow()`: Allows Claude to proceed with its current action, typically used in conjunction with checks like `stop_hook_active`.
  - `c.output.simple_approve()`: A simplified approval, often used for subagent workflows.

Related Properties:
  - `c.stop_hook_active`: Boolean indicating if a Stop Hook has already activated Claude's termination sequence. Crucial for Stop and SubagentStop hooks.
  - `c.tool_name`: String representing the name of the tool Claude is attempting to use (e.g., "Write", "Bash").
  - `c.tool_input`: Dictionary containing the input parameters for the tool.
  - `c.tool_response`: Dictionary containing the output or result from a tool execution (for PostToolUse hooks).
  - `c.message`: String containing notification messages (for Notification hooks).
  - `c.custom_instructions`: String containing custom instructions provided by the user (for PreCompact hooks).

Usage Context:
  Hooks are executed based on their type (PreToolUse, PostToolUse, Notification, Stop, SubagentStop, PreCompact).
  The `create_context()` function initializes the hook context object `c`.
```

----------------------------------------

TITLE: CCHooksError Base Exception
DESCRIPTION: The base exception class for all errors originating from the cchooks library. It serves as a common ancestor for more specific exception types.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_13

LANGUAGE: python
CODE:
```
# Base exception for all cchooks errors.
```

----------------------------------------

TITLE: Safe Type Accessors
DESCRIPTION: Provides utility functions for safely accessing data from dictionaries, with default values for missing keys. Supports string, boolean, and dictionary types.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_19

LANGUAGE: python
CODE:
```
# - safe_get_str(data: Dict[str, Any], key: str, default: str = "") -> str
# - safe_get_bool(data: Dict[str, Any], key: str, default: bool = False) -> bool
# - safe_get_dict(data: Dict[str, Any], key: str, default: Dict[str, Any] | None = None) -> Dict[str, Any]
```

----------------------------------------

TITLE: Install cchooks
DESCRIPTION: Installs the cchooks library using pip or uv. This is the first step to start building Claude Code hooks.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
pip install cchooks
```

LANGUAGE: bash
CODE:
```
uv add cchooks
```

----------------------------------------

TITLE: Claude Code Hook Usage Pattern
DESCRIPTION: Example Python code demonstrating how to create a Claude Code hook context and handle specific hook types like `PreToolUseContext`. It shows conditional logic based on tool name and input.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/CLAUDE.md#_snippet_5

LANGUAGE: python
CODE:
```
from cchooks import create_context
from cchooks.contexts import PreToolUseContext

# Read from stdin automatically
c = create_context()

# Type-specific handling
if isinstance(c, PreToolUseContext):
    if c.tool_name == "Write" and "password" in c.tool_input.get("file_path", ""):
        c.output.simple_block("Refusing to write to password file")
    else:
        c.output.simple_approve()
```

----------------------------------------

TITLE: MCP Tool Naming Convention
DESCRIPTION: Defines the standard naming pattern for MCP tools, which follows a `mcp__<server>__<tool>` format. Examples illustrate how to name tools for different servers like Memory, Filesystem, and GitHub.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/what-is-cc-hook.md#_snippet_15

LANGUAGE: APIDOC
CODE:
```
MCPToolNaming:
  Pattern: "mcp__<server>__<tool>"
  Description: "Defines the naming convention for MCP tools, specifying the server and the tool's function."
  Examples:
    - "mcp__memory__create_entities": Memory server's entity creation tool.
    - "mcp__filesystem__read_file": Filesystem server's file reading tool.
    - "mcp__github__search_repositories": GitHub server's repository search tool.

ParameterDetails:
  server: The name of the MCP server hosting the tool (e.g., memory, filesystem, github).
  tool: A descriptive name for the tool's functionality (e.g., create_entities, read_file, search_repositories).
```

----------------------------------------

TITLE: Validate Required Fields
DESCRIPTION: Validates that a given dictionary contains all the fields specified in a list of required field names. Raises a `KeyError` if any required field is missing.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_18

LANGUAGE: python
CODE:
```
from cchooks.utils import validate_required_fields

data = {"name": "test", "value": 42}
validate_required_fields(data, ["name", "value"])  # OK
validate_required_fields(data, ["name", "missing"])  # Raises KeyError
```

----------------------------------------

TITLE: Handle Hook Validation Errors
DESCRIPTION: Demonstrates how to catch and handle `HookValidationError`, which is raised when hook input validation fails. It shows a typical pattern for exiting gracefully upon validation failure.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/api-reference.md#_snippet_14

LANGUAGE: python
CODE:
```
try:
    context = create_context()
except HookValidationError as e:
    print(f"Validation error: {e}")
    sys.exit(1)
```

----------------------------------------

TITLE: PreToolUse: Block dangerous commands
DESCRIPTION: Example of a PreToolUse hook that intercepts and blocks potentially dangerous bash commands like 'rm -rf' before they are executed by Claude.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/README.md#_snippet_2

LANGUAGE: python
CODE:
```
#!/usr/bin/env python3
from cchooks import create_context

c = create_context()

# Block rm -rf commands
if c.tool_name == "Bash" and "rm -rf" in c.tool_input.get("command", ""):
    c.output.exit_block("You should not execute this command: System protection: rm -rf blocked")
else:
    c.output.exit_success()
```

----------------------------------------

TITLE: Notification: Send desktop alerts
DESCRIPTION: An example of a Notification hook that sends desktop notifications using 'notify-send' when specific messages, like those containing 'permission', are received from Claude.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/README.md#_snippet_4

LANGUAGE: python
CODE:
```
#!/usr/bin/env python3
import os
from cchooks import create_context

c = create_context()

if "permission" in c.message.lower():
    os.system(f'notify-send "Claude" "{c.message}"')

```

----------------------------------------

TITLE: Claude Code Hook Input/Output Patterns
DESCRIPTION: Describes the communication patterns between a Claude Code hook and the Claude Code environment. Covers simple exit code-based responses and advanced JSON output for decisions.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/CLAUDE.md#_snippet_6

LANGUAGE: APIDOC
CODE:
```
Claude Code Hook Interaction Patterns:

Simple Mode (Exit Codes):
  - `exit 0`: Indicates success or approval of an action.
  - `exit 1`: Signals a non-blocking error, allowing Claude to continue.
  - `exit 2`: Indicates a blocking error, halting the process.

Advanced Mode (JSON):
  - Utilizes context-specific output methods provided by the library.
  - Each context offers specialized decision methods (e.g., approve, block, provide feedback).
  - JSON output typically includes fields like `continue`, `decision`, and `reason` for structured responses.
```

----------------------------------------

TITLE: Claude Code Hook Execution Details
DESCRIPTION: Details the execution environment and behavior of Claude Code hooks. This includes timeout limits, parallelization, input/output handling, and progress reporting.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/what-is-cc-hook.md#_snippet_14

LANGUAGE: APIDOC
CODE:
```
ClaudeCodeHookExecution:
  Timeout: 60-second execution limit by default, configurable per command.
    - A timeout for an individual command does not affect other commands.
  Parallelization: All matching hooks run in parallel.
  Environment:
    - Runs in the current directory with Claude Code's environment variables.
    - Input is provided via JSON on stdin.
  Output:
    - PreToolUse/PostToolUse/Stop hooks: Progress shown in transcript (Ctrl-R).
    - Notification hooks: Logged to debug only (`--debug`).

HookExecutionDetails:
  - Timeout: The maximum execution time for a single hook command.
  - Parallelization: Indicates if multiple hooks execute concurrently.
  - Environment: Describes the runtime context for hooks.
  - Input: Specifies the data format received by hooks.
  - Output: Details how hook execution status and results are reported.
```

----------------------------------------

TITLE: Install Dependencies with Make and UV
DESCRIPTION: Shows how to install project dependencies using `make setup` or `uv sync`. This ensures all necessary libraries are available for development.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/CLAUDE.md#_snippet_0

LANGUAGE: bash
CODE:
```
# Install dependencies
make setup

# Or with uv directly
uv sync
```

----------------------------------------

TITLE: Code Quality Checks and Formatting with Make
DESCRIPTION: Covers commands for checking code quality, linting, type checking, and formatting using `make` targets that invoke tools like `ruff` and `mypy`. Includes commands for auto-fixing issues.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/CLAUDE.md#_snippet_2

LANGUAGE: bash
CODE:
```
# Check all code quality
make check

# Run individual checks
make lint          # ruff check
make type-check    # mypy
make format-check  # ruff format --check

# Auto-fix issues
make lint-fix      # ruff check --fix
make format        # ruff format
```

----------------------------------------

TITLE: Development Setup
DESCRIPTION: Instructions for setting up the development environment for the cchooks project. This involves cloning the repository and using 'make help' to view available development commands.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/README.md#_snippet_14

LANGUAGE: bash
CODE:
```
git clone https://github.com/GowayLee/cchooks.git
cd cchooks
make help # See detailed dev commands
```

----------------------------------------

TITLE: Run Tests with Make and Pytest
DESCRIPTION: Demonstrates running tests with coverage, faster tests without coverage, and executing specific test files or single tests using `make` and `pytest`.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/CLAUDE.md#_snippet_1

LANGUAGE: bash
CODE:
```
# Run all tests with coverage
make test

# Run tests without coverage (faster)
make test-quick

# Run specific test file
uv run pytest tests/contexts/test_pre_tool_use.py -v

# Run single test
uv run pytest tests/contexts/test_pre_tool_use.py::test_pre_tool_use_approve -v
```

----------------------------------------

TITLE: Common Hook Input Structure (TypeScript)
DESCRIPTION: Illustrates the common fields provided to hooks via stdin. This includes session identification and the path to the conversation transcript, alongside event-specific data.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/what-is-cc-hook.md#_snippet_1

LANGUAGE: typescript
CODE:
```
{
  // Common fields
  session_id: string
  transcript_path: string  // Path to conversation JSON

  // Event-specific fields
  hook_event_name: string
  ...
}
```

----------------------------------------

TITLE: Development Utilities with Make
DESCRIPTION: Utility commands for development, including installing the package in development mode, viewing the dependency tree, and updating the lockfile.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/CLAUDE.md#_snippet_4

LANGUAGE: bash
CODE:
```
# Install in development mode
make install-dev

# Show dependency tree
make deps-tree

# Update lockfile
make lock
```

----------------------------------------

TITLE: PostToolUse: Auto-format Python files
DESCRIPTION: Demonstrates a PostToolUse hook that automatically formats Python files using the 'black' formatter after they have been written by Claude.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/README.md#_snippet_3

LANGUAGE: python
CODE:
```
#!/usr/bin/env python3
import subprocess
from cchooks import create_context

c = create_context()

if c.tool_name == "Write" and c.tool_input.get("file_path", "").endswith(".py"):
    file_path = c.tool_input["file_path"]
    subprocess.run(["black", file_path])
    print(f"Auto-formatted: {file_path}")
```

----------------------------------------

TITLE: Build and Distribute Package with Make
DESCRIPTION: Provides `make` commands for building the Python package, cleaning build artifacts, and performing release checks. Essential for preparing the library for distribution.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/CLAUDE.md#_snippet_3

LANGUAGE: bash
CODE:
```
# Build package
make build

# Clean build artifacts
make clean

# Full release preparation
make release-check
```

----------------------------------------

TITLE: Permission Logger
DESCRIPTION: This hook logs all permission requests, specifically write requests, to a JSON Lines file located at /tmp/permission-log.jsonl. Each log entry includes a timestamp, the file path, and the action requested.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/README.md#_snippet_13

LANGUAGE: python
CODE:
```
#!/usr/bin/env python3
import json
import datetime
from cchooks import create_context

c = create_context()

if c.tool_name == "Write":
    log_entry = {
        "timestamp": datetime.datetime.now().isoformat(),
        "file": c.tool_input.get("file_path"),
        "action": "write_requested"
    }

    with open("/tmp/permission-log.jsonl", "a") as f:
        f.write(json.dumps(log_entry) + "\n")

    c.output.exit_success()
```

----------------------------------------

TITLE: PreCompact: Add custom instructions
DESCRIPTION: Demonstrates a PreCompact hook that allows for the inclusion of custom instructions, potentially influencing transcript compaction rules.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/README.md#_snippet_7

LANGUAGE: python
CODE:
```
from cchooks import create_context

c = create_context()

if c.custom_instructions:
    print(f"Using custom compaction: {c.custom_instructions}")
```

----------------------------------------

TITLE: Configure MCP Tool Hooks
DESCRIPTION: Defines how to target specific MCP tools or entire MCP servers using a JSON configuration. It specifies actions to be taken before or after tool usage based on pattern matching.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/what-is-cc-hook.md#_snippet_12

LANGUAGE: json
CODE:
```
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__memory__.*",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Memory operation initiated' >> ~/mcp-operations.log"
          }
        ]
      },
      {
        "matcher": "mcp__.*__write.*",
        "hooks": [
          {
            "type": "command",
            "command": "/home/user/scripts/validate-mcp-write.py"
          }
        ]
      }
    ]
  }
}
```

----------------------------------------

TITLE: Auto-linter Hook with Ruff
DESCRIPTION: This hook automatically lints Python files after they are written using the 'ruff' linter. It executes 'ruff check' on the modified file and reports success or displays linting issues found.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/README.md#_snippet_11

LANGUAGE: python
CODE:
```
#!/usr/bin/env python3
import subprocess
from cchooks import create_context

c = create_context()

if c.tool_name == "Write" and c.tool_input.get("file_path", "").endswith(".py"):
    file_path = c.tool_input["file_path"]

    # Run ruff linter
    result = subprocess.run(["ruff", "check", file_path], capture_output=True)

    if result.returncode == 0:
        print(f"✅ {file_path} passed linting")
    else:
        print(f"⚠️  {file_path} has issues:")
        print(result.stdout.decode())

    c.output.exit_success()
```

----------------------------------------

TITLE: Configure Claude Code Hooks Structure (JSON)
DESCRIPTION: Defines the structure for configuring Claude Code hooks. It organizes hooks by event names and uses matchers to specify when hooks should run, supporting simple strings and regex for tool name matching.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/what-is-cc-hook.md#_snippet_0

LANGUAGE: json
CODE:
```
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolPattern",
        "hooks": [
          {
            "type": "command",
            "command": "your-command-here"
          }
        ]
      }
    ]
  }
}
```

----------------------------------------

TITLE: PreToolUse Hook Decision Control
DESCRIPTION: JSON structure for PreToolUse hooks to control tool call execution, allowing approval, blocking, or deferring to the default permission flow.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/what-is-cc-hook.md#_snippet_8

LANGUAGE: json
CODE:
```
{
  "decision": "approve" | "block" | undefined,
  "reason": "Explanation for decision"
}
```

----------------------------------------

TITLE: Common JSON Fields for Hook Output
DESCRIPTION: Optional JSON fields that can be included in hook stdout for controlling Claude's execution flow and output visibility.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/what-is-cc-hook.md#_snippet_7

LANGUAGE: json
CODE:
```
{
  "continue": true, // Whether Claude should continue after hook execution (default: true)
  "stopReason": "string", // Message shown when continue is false
  "suppressOutput": true // Hide stdout from transcript mode (default: false)
}
```

----------------------------------------

TITLE: PostToolUse Hook Decision Control
DESCRIPTION: JSON structure for PostToolUse hooks to control Claude's response after a tool has executed, enabling blocking with an explanation.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/what-is-cc-hook.md#_snippet_9

LANGUAGE: json
CODE:
```
{
  "decision": "block" | undefined,
  "reason": "Explanation for decision"
}
```

----------------------------------------

TITLE: Claude Code Debugging Commands
DESCRIPTION: Provides commands and methods for debugging Claude Code hook execution. This includes enabling verbose logging and inspecting hook execution flow.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/what-is-cc-hook.md#_snippet_13

LANGUAGE: bash
CODE:
```
claude --debug
```

----------------------------------------

TITLE: Stop: Control task termination
DESCRIPTION: Illustrates a Stop hook that manages Claude's task termination. It checks `stop_hook_active` to prevent premature stopping and can prompt Claude to continue working.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/README.md#_snippet_5

LANGUAGE: python
CODE:
```
#!/usr/bin/env python3
from cchooks import create_context

c = create_context()

if not c.stop_hook_active: # Claude has not been activated by other Stop Hook
    c.output.prevent("Hey Claude, you should try to do more works!") # Prevent from stopping, and prompt Claude
else:
    c.output.allow()  # Allow stop
```

----------------------------------------

TITLE: Python: Validate Bash Command with Regex
DESCRIPTION: A Python script that validates bash commands using predefined regex rules, providing feedback via stderr and exiting with code 2 for blocking issues.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/what-is-cc-hook.md#_snippet_11

LANGUAGE: python
CODE:
```
#!/usr/bin/env python3
import json
import re
import sys

# Define validation rules as a list of (regex pattern, message) tuples
VALIDATION_RULES = [
    (
        r"\bgrep\b(?!.*\|)",
        "Use 'rg' (ripgrep) instead of 'grep' for better performance and features",
    ),
    (
        r"\bfind\s+\S+\s+-name\b",
        "Use 'rg --files | rg pattern' or 'rg --files -g pattern' instead of 'find -name' for better performance",
    ),
]


def validate_command(command: str) -> list[str]:
    issues = []
    for pattern, message in VALIDATION_RULES:
        if re.search(pattern, command):
            issues.append(message)
    return issues


try:
    input_data = json.load(sys.stdin)
except json.JSONDecodeError as e:
    print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
    sys.exit(1)

tool_name = input_data.get("tool_name", "")
tool_input = input_data.get("tool_input", {})
command = tool_input.get("command", "")

if tool_name != "Bash" or not command:
    sys.exit(1)

# Validate the command
issues = validate_command(command)

if issues:
    for message in issues:
        print(f"• {message}", file=sys.stderr)
    # Exit code 2 blocks tool call and shows stderr to Claude
    sys.exit(2)

```

----------------------------------------

TITLE: Stop/SubagentStop Hook Decision Control
DESCRIPTION: JSON structure for Stop and SubagentStop hooks to control Claude's continuation, allowing blocking of stoppage with a required reason.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/docs/what-is-cc-hook.md#_snippet_10

LANGUAGE: json
CODE:
```
{
  "decision": "block" | undefined,
  "reason": "Must be provided when Claude is blocked from stopping"
}
```

----------------------------------------

TITLE: Block Writes to Sensitive Files
DESCRIPTION: This hook prevents writing to files identified as sensitive. It checks the file path against a predefined list of sensitive file names and blocks the operation if a match is found, ensuring critical files are protected.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/README.md#_snippet_10

LANGUAGE: python
CODE:
```
file_path = c.tool_input.get("file_path", "")
if any(sensitive in file_path for sensitive in SENSITIVE_FILES):
    c.output.exit_block(f"Protected file: {file_path}")
else:
    c.output.exit_success()
```

----------------------------------------

TITLE: Git-aware Auto-commit
DESCRIPTION: This hook automatically commits Python file changes to Git if the file is within a specified project path. It stages the file and creates a commit message indicating the updated file.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/README.md#_snippet_12

LANGUAGE: python
CODE:
```
#!/usr/bin/env python3
import subprocess
from cchooks import create_context

c = create_context()

if c.tool_name == "Write":
    file_path = c.tool_input.get("file_path", "")

    # Skip non-git files
    if not file_path.startswith("/my-project/"):
        c.output.exit_success()

    # Auto-commit Python changes
    if file_path.endswith(".py"):
        try:
            subprocess.run(["git", "add", file_path], check=True)
            subprocess.run([
                "git", "commit", "-m",
                f"auto: update {file_path.split('/')[-1]}"
            ], check=True)
            print(f"📁 Committed: {file_path}")
        except subprocess.CalledProcessError:
            print("Git commit failed - probably no changes")

    c.output.exit_success()
```

----------------------------------------

TITLE: Production: Multi-tool Security Guard
DESCRIPTION: A robust security hook that blocks dangerous bash commands and operations involving sensitive files across multiple tool uses.
SOURCE: https://github.com/gowaylee/cchooks/blob/main/README.md#_snippet_8

LANGUAGE: python
CODE:
```
#!/usr/bin/env python3
from cchooks import create_context

DANGEROUS_COMMANDS = {"rm -rf", "sudo", "format", "fdisk"}
SENSITIVE_FILES = {".env", "secrets.json", "id_rsa"}

c = create_context()

# Block dangerous Bash commands
if c.tool_name == "Bash":
    command = c.tool_input.get("command", "")
    if any(danger in command for danger in DANGEROUS_COMMANDS):
        c.output.exit_block("Security: Dangerous command blocked")
    else:
        c.output.exit_success()

```