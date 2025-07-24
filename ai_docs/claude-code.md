TITLE: Install Claude Code globally
DESCRIPTION: This command installs the Claude Code agentic coding tool globally on your system using npm, making it accessible from any directory in your terminal. This is the first step to getting started with Claude Code.
SOURCE: https://github.com/anthropics/claude-code/blob/main/README.md#_snippet_0

LANGUAGE: sh
CODE:
```
npm install -g @anthropic-ai/claude-code
```

----------------------------------------

TITLE: Install Python SDK for Claude Code
DESCRIPTION: Instructions to install the newly released Python SDK for Claude Code using pip, enabling programmatic interaction with the service.
SOURCE: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#_snippet_1

LANGUAGE: Python
CODE:
```
pip install claude-code-sdk
```

----------------------------------------

TITLE: Import TypeScript SDK for Claude Code
DESCRIPTION: Instructions to import the newly released TypeScript SDK for Claude Code, enabling programmatic interaction with the service.
SOURCE: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#_snippet_0

LANGUAGE: TypeScript
CODE:
```
import @anthropic-ai/claude-code
```

----------------------------------------

TITLE: Stream JSON Output in Print Mode
DESCRIPTION: The print mode (`-p`) now supports streaming output in JSON format via the `--output-format=stream-json` argument, useful for programmatic consumption of Claude's output.
SOURCE: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#_snippet_7

LANGUAGE: CLI
CODE:
```
claude -p --output-format=stream-json
```

----------------------------------------

TITLE: APIDOC: CLI --print JSON Output Structure
DESCRIPTION: Documentation for the breaking change in the `--print` CLI command's JSON output, which now returns nested message objects for improved forwards-compatibility and metadata inclusion.
SOURCE: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#_snippet_4

LANGUAGE: APIDOC
CODE:
```
CLI Command: --print
Output Format: JSON
Structure Change: Output now returns nested message objects.
  Example (Conceptual):
  {
    "messages": [
      {
        "id": "msg_abc",
        "content": "...",
        "metadata": {}
      }
    ]
  }
  (Previously: Flat message objects)
```

----------------------------------------

TITLE: APIDOC: Bedrock ARN Format for Anthropic Models
DESCRIPTION: Documentation for the updated format of Bedrock ARNs when used with `ANTHROPIC_MODEL` or `ANTHROPIC_SMALL_FAST_MODEL` environment variables, specifying that unescaped slashes (`/`) should be used instead of escaped ones (`%2F`).
SOURCE: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#_snippet_3

LANGUAGE: APIDOC
CODE:
```
Parameter: ANTHROPIC_MODEL | ANTHROPIC_SMALL_FAST_MODEL
  Type: string (Bedrock ARN)
  Description: The Amazon Resource Name (ARN) for the Bedrock model.
  Format Update: Should use unescaped slashes (e.g., /) instead of escaped slashes (e.g., %2F).
```

----------------------------------------

TITLE: Manage Approved Tools with Slash Command
DESCRIPTION: A new `/approved-tools` command has been added for managing tool permissions, providing a convenient way to control which tools Claude can use.
SOURCE: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#_snippet_15

LANGUAGE: CLI
CODE:
```
/approved-tools
```

----------------------------------------

TITLE: Toggle Automatic Conversation Compaction
DESCRIPTION: Automatic conversation compaction, which allows for infinite conversation length, can now be toggled on or off using the `/config` command.
SOURCE: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#_snippet_12

LANGUAGE: CLI
CODE:
```
/config
```

----------------------------------------

TITLE: Configure Claude with Multiple Values
DESCRIPTION: The `claude config add` and `claude config remove` commands now accept multiple values separated by commas or spaces, simplifying the process of adding or removing configuration settings.
SOURCE: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#_snippet_9

LANGUAGE: CLI
CODE:
```
claude config add <value1>,<value2>
claude config remove <value1> <value2>
```

----------------------------------------

TITLE: Import Files in CLAUDE.md
DESCRIPTION: Syntax for importing other Markdown files into a CLAUDE.md file, allowing modular organization of documentation or project context.
SOURCE: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#_snippet_2

LANGUAGE: Markdown
CODE:
```
@path/to/file.md
```

----------------------------------------

TITLE: Resume Conversations with Claude CLI
DESCRIPTION: Users can now resume previous conversations using the `claude --continue` or `claude --resume` commands, allowing them to pick up where they left off.
SOURCE: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#_snippet_5

LANGUAGE: CLI
CODE:
```
claude --continue
claude --resume
```

----------------------------------------

TITLE: Enable MCP Debug Mode
DESCRIPTION: Users can run Claude with the `--mcp-debug` flag to get more detailed information about MCP server errors, aiding in troubleshooting and development.
SOURCE: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#_snippet_14

LANGUAGE: CLI
CODE:
```
claude --mcp-debug
```

----------------------------------------

TITLE: Interactive MCP Server Setup Wizard
DESCRIPTION: An interactive setup wizard for adding MCP servers is now available by running `claude mcp add`, guiding users through the configuration process step-by-step.
SOURCE: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#_snippet_13

LANGUAGE: CLI
CODE:
```
claude mcp add
```

----------------------------------------

TITLE: Import MCP Servers from Desktop or JSON
DESCRIPTION: MCP servers can now be imported from Claude Desktop using `claude mcp add-from-claude-desktop` or added directly as JSON strings with `claude mcp add-json <n> <json>`, providing flexible server setup options.
SOURCE: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#_snippet_10

LANGUAGE: CLI
CODE:
```
claude mcp add-from-claude-desktop
claude mcp add-json <n> <json>
```

----------------------------------------

TITLE: Run One-Off MCP Servers via CLI
DESCRIPTION: The `claude --mcp-config` command allows users to run one-off MCP (Multi-Cloud Platform) servers by specifying a configuration file path, enabling flexible server management.
SOURCE: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#_snippet_6

LANGUAGE: CLI
CODE:
```
claude --mcp-config <path-to-file>
```

----------------------------------------

TITLE: Enable Vim Bindings for Text Input
DESCRIPTION: Vim-style key bindings for text input can now be enabled using the `/vim` command, offering a familiar editing experience for Vim users.
SOURCE: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#_snippet_11

LANGUAGE: CLI
CODE:
```
/vim
```

----------------------------------------

TITLE: View Release Notes with Slash Command
DESCRIPTION: Users can now view release notes at any time directly within the application using the `/release-notes` command.
SOURCE: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#_snippet_8

LANGUAGE: CLI
CODE:
```
/release-notes
```