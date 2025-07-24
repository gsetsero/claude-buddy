# Task Runner Documentation for Claude Buddy

This document provides guidance on using the Task runner for Claude Buddy development. Task is a modern alternative to Make, providing a simpler and more intuitive way to define and run project tasks.

## Prerequisites

### Installing Task

Before using the Taskfile, you need to install Task on your system:

**macOS (using Homebrew):**
```bash
brew install go-task
```

**Linux/macOS (using install script):**
```bash
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b ~/.local/bin
```

**Windows (using Scoop):**
```bash
scoop install task
```

**Verify installation:**
```bash
task --version
```

## Quick Start

```bash
# View all available tasks
task --list

# Setup development environment
task setup

# Start development mode
task dev

# Run tests
task test

# Build for production
task build
```

## Available Tasks

### Common Workflows

#### `task setup`
Initialize development environment:
- Installs npm dependencies
- Displays version information
- Prepares the project for development

```bash
task setup
```

#### `task dev`
Start development mode:
- Starts file watcher (requires nodemon)
- Monitors changes in source files
- Shows when files are ready for testing

```bash
task dev
```

#### `task test`
Run all tests:
- Tests the installation process
- Verifies install.js functionality

```bash
task test
```

#### `task build`
Build for production:
- Cleans previous builds
- Copies necessary files to dist directory
- Prepares for npm publishing

```bash
task build
```

#### `task lint`
Check and fix code style:
- Runs ESLint with auto-fix
- Reports linting issues

```bash
task lint
```

### Utilities

#### `task clean`
Clean build artifacts:
- Removes dist directory
- Deletes log files
- Cleans build output

```bash
task clean
```

#### `task analyze`
Analyze project structure:
- Shows version information
- Displays file counts by type
- Provides project metrics

```bash
task analyze
```

#### `task security:audit`
Check for vulnerabilities:
- Runs npm security audit
- Reports security issues at moderate level and above

```bash
task security:audit
```

### Publishing

#### `task version:patch`
Bump patch version:
- Increments patch version (1.0.0 → 1.0.1)
- Creates git commit
- Tags the release

```bash
task version:patch
```

#### `task publish:dry`
Test publish process:
- Builds the project
- Runs tests
- Simulates npm publish without actually publishing

```bash
task publish:dry
```

#### `task publish`
Publish to npm:
- Builds the project
- Runs tests
- Prompts for confirmation
- Publishes to npm registry

```bash
task publish
```

### Help

#### `task help`
Show detailed help:
- Displays common workflows
- Lists utility commands
- Shows publishing commands

```bash
task help
```

## Task Dependencies

Some tasks automatically run dependencies:
- `task build` runs clean:build first
- `task setup` runs install first
- `task publish` runs build and test first
- `task publish:dry` runs build and test first

## Environment Variables

The Taskfile sets these environment variables:
- `NODE_ENV=development`
- `FORCE_COLOR=1` (for colored output)

## Common Workflows

### Initial Setup
```bash
git clone <repository>
cd claude-buddy
task setup
```

### Development Workflow
```bash
task dev
```

### Before Committing
```bash
task lint
task test
task build
```

### Release Workflow
```bash
task test
task build
task version:patch
task publish
```

### Maintenance Workflow
```bash
task security:audit
task analyze
```

## Troubleshooting

### Task not found
Make sure Task is installed and in your PATH:
```bash
which task
task --version
```

### Permission errors
Some tasks require appropriate permissions:
```bash
# If you get permission errors
chmod +x install.js
```

### Missing dependencies
Install development tools as suggested:
```bash
npm install -g nodemon      # For file watching
npm install -g eslint       # For linting
```

### Build failures
Clean and rebuild:
```bash
task clean
task build
```

## Tips and Best Practices

1. **Use task aliases**: Create shell aliases for common tasks
   ```bash
   alias tb="task build"
   alias tt="task test"
   alias td="task dev"
   ```

2. **Check task descriptions**: Use `task --list` to see all available tasks with descriptions

3. **Dry run publishing**: Always use `task publish:dry` before actual publishing

4. **Regular maintenance**: Run these periodically:
   ```bash
   task security:audit
   task analyze
   ```

5. **Clean builds**: When in doubt, clean and rebuild:
   ```bash
   task clean build
   ```

## Additional Resources

- [Task Documentation](https://taskfile.dev)
- [Task GitHub Repository](https://github.com/go-task/task)
- [Claude Buddy Repository](https://github.com/anthropics/claude-buddy)