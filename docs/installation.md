# Installation Guide

This guide covers the installation and setup of Claude Buddy with its intelligent persona system.

## Prerequisites

Before installing Claude Buddy, ensure you have:

### Required Software
- **Node.js 18+**: [Download from nodejs.org](https://nodejs.org/)
- **UV (Astral Python Package Manager)**: [Install from astral.sh](https://astral.sh/uv)
- **Git**: [Download from git-scm.com](https://git-scm.com/)
- **Claude Code**: [Install from claude.ai/code](https://claude.ai/code)

### System Compatibility
- macOS 10.15+
- Linux (Ubuntu 18.04+, CentOS 7+)
- Windows 10+ (with WSL recommended)

## Installation Methods

### Method 1: Global Installation (Recommended)

Install Claude Buddy globally for use across all projects:

```bash
# Install via npm
npm install -g claude-buddy

# Run installation
claude-buddy --global
```

This installs configuration in `~/.claude/` and makes it available to all projects.

### Method 2: Project-Specific Installation

Install for a specific project only:

```bash
# Navigate to your project
cd your-project

# Install locally
npx claude-buddy --project
```

This creates a `.claude/` directory in your project with project-specific configuration.

### Method 3: Interactive Installation

Use the interactive installer to choose your preferred mode:

```bash
npx claude-buddy
```

The installer will prompt you to select:
- Installation mode (global vs project)
- Feature preferences
- Configuration options

### Method 4: Install from Local Source

If you're installing from source code or the package isn't published to NPM yet:

#### Option A: Direct Installation from Local Path
```bash
# Navigate to the claude-buddy directory
cd /path/to/claude-buddy

# Install globally from local source
npm install -g .

# Run installation
claude-buddy --global
```

#### Option B: Install Dependencies and Link
```bash
# Navigate to the claude-buddy directory
cd /path/to/claude-buddy

# Install package dependencies
npm install

# Create global symlink
npm link

# Run installation
claude-buddy --global
```

#### Option C: Run Directly with Node
```bash
# Navigate to the claude-buddy directory
cd /path/to/claude-buddy

# Run installer directly
node install.js --global
```

**Note**: Replace `/path/to/claude-buddy` with the actual path to your local clone of the repository.

### Method 5: Smart Backup Options (Project Mode Only)

When installing in project mode, you can control the backup behavior:

#### Smart Backup Enabled (Default)
```bash
claude-buddy --project
# or explicitly
claude-buddy --project --smart-backup true
```
- Automatically skips backup if project is in a git repository
- Reduces installation time and disk usage
- Git already provides version control for `.claude` folder

#### Smart Backup Disabled (Force Backup)
```bash
claude-buddy --project --smart-backup false
```
- Always creates backup regardless of git status
- Useful for projects not in git or when extra safety is desired
- Creates timestamped backup folder

## Installation Process

The installer performs these steps:

### 1. System Requirements Check
- Verifies Node.js, Python, and Git versions
- Checks for Claude Code installation
- Validates system compatibility

### 2. Directory Structure Creation
```
~/.claude/ (or .claude/)
├── commands/
├── hooks/
├── buddy-backup-[timestamp]/
└── CLAUDE_BUDDY.md
```

### 3. Configuration Backup
- Backs up existing Claude Code configuration
- Creates timestamped backup directory
- Preserves custom settings

### 4. Component Installation
- **Slash Commands**: AI-powered development commands with persona intelligence
- **Persona System**: 12 domain expert specialists with auto-activation
- **Safety Hooks**: File protection and command validation
- **Configuration**: Default settings and persona preferences

### 5. Integration Setup
- Updates `hooks.json` for Claude Code integration
- Configures `buddy-config.json` with persona and safety defaults
- Sets up persona system with auto-activation intelligence
- Initializes learning engine for adaptive behavior
- Sets up logging and audit trails

## Verification

After installation, verify everything works:

### 1. Restart Claude Code
Close and restart Claude Code to load new configuration.

### 2. Test Slash Commands with Persona Intelligence
```
/buddy:commit
```
Should show the commit assistant with automatic scribe persona activation.

```
/buddy:analyze
```
Should demonstrate intelligent persona selection based on project context.

### 3. Test Safety Hooks
Try creating a file named `.env` - should be blocked by file protection.

### 4. Check Configuration
Verify files exist:
- `~/.claude/buddy-config.json` (includes persona settings)
- `~/.claude/hooks.json`
- `~/.claude/commands/buddy/commit.md`
- `~/.claude/commands/buddy/analyze.md` (new persona-aware command)
- Persona configuration files in the system

## Post-Installation Setup

### Persona System Verification

Test the intelligent persona system:

```bash
# Test auto-activation with security context
/buddy:analyze --focus security

# Test manual persona control
/buddy:improve --persona-refactorer --with-performance

# Test collaborative intelligence
/buddy:architect --comprehensive
```

### Optional Formatters
Install code formatters for auto-formatting features:

```bash
# Python formatting
pip install black

# JavaScript/TypeScript formatting
npm install -g prettier

# Go formatting (if applicable)
# gofmt is included with Go installation
```

### Git Configuration
Ensure Git is properly configured:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Claude Code Authentication
Verify Claude Code is authenticated:

```bash
claude --version
```

### Persona System Configuration

Customize persona behavior in `~/.claude/buddy-config.json`:

```json
{
  "personas": {
    "enabled": true,
    "auto_activation": {
      "enabled": true,
      "confidence_threshold": 0.7,
      "max_active_personas": 3
    },
    "preferences": {
      "preferred_personas": ["security", "performance"],
      "domain_preferences": {
        "security": "always",
        "performance": "auto"
      }
    }
  }
}
```

**Configuration Options:**
- `confidence_threshold`: Minimum confidence for auto-activation (0.0-1.0)
- `max_active_personas`: Maximum personas active simultaneously
- `preferred_personas`: Always consider these personas
- `domain_preferences`: Control activation behavior per domain

## Troubleshooting

### Common Issues

#### "404 Not Found" when installing from NPM
```bash
# Error: npm error 404 Not Found - GET https://registry.npmjs.org/claude-buddy
# This means the package isn't published to NPM yet

# Solution: Install from local source instead
cd /path/to/claude-buddy
npm install -g .
```

#### "Command not found: claude-buddy"
```bash
# Check npm global path
npm list -g --depth=0

# Reinstall globally (if published)
npm install -g claude-buddy

# Or install from source
cd /path/to/claude-buddy && npm install -g .
```

#### "Permission denied" during installation
```bash
# Use sudo (macOS/Linux)
sudo npm install -g claude-buddy

# Or fix npm permissions
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

#### "UV not found"
```bash
# macOS with Homebrew
brew install uv

# Linux/Windows with curl
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows with PowerShell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# With pip
pip install uv
```

#### Claude Code not detected
```bash
# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version
```

### Hook Installation Issues

If hooks aren't working:

1. **Check permissions**:
   ```bash
   chmod +x ~/.claude/hooks/*.py
   ```

2. **Verify Python path**:
   ```bash
   which uv
   ```

3. **Test hook manually**:
   ```bash
   echo '{"tool_name":"Write","tool_input":{"file_path":".env"}}' | uv run --no-project python ~/.claude/hooks/file-guard.py
   ```

### Configuration Issues

If configuration seems corrupted:

1. **Reset to defaults**:
   ```bash
   claude-buddy --global --force
   ```

2. **Manual cleanup**:
   ```bash
   rm -rf ~/.claude/buddy-*
   claude-buddy --global
   ```

3. **Check logs**:
   ```bash
   cat ~/.claude-buddy/protection.log
   ```

### Persona System Issues

If personas aren't working correctly:

1. **Test persona activation**:
   ```bash
   /buddy:analyze --persona-security --debug
   ```

2. **Check persona configuration**:
   ```bash
   cat ~/.claude/buddy-config.json | grep -A 10 "personas"
   ```

3. **Verify persona files**:
   ```bash
   ls -la ~/.claude/commands/buddy/
   ```

4. **Reset persona learning**:
   ```bash
   rm -f ~/.claude-buddy/persona-memory.json
   ```

## Uninstallation

To remove Claude Buddy:

### Remove Package
```bash
npm uninstall -g claude-buddy
```

### Clean Configuration
```bash
# Remove buddy-specific files
rm ~/.claude/buddy-config.json
rm -rf ~/.claude/hooks/
rm -rf ~/.claude/commands/

# Remove persona system data
rm -rf ~/.claude-buddy/persona-*
rm -rf ~/.claude-buddy/learning-*

# Restore from backup if needed
cp -r ~/.claude/buddy-backup-[latest]/* ~/.claude/
```

### Reset Hooks
Edit `~/.claude/hooks.json` and remove Claude Buddy entries.

## Advanced Installation

### Custom Installation Directory

For advanced users who want to customize the installation:

```bash
# Set custom Claude directory
export CLAUDE_CONFIG_DIR="/custom/path"
claude-buddy --global
```

### Development Installation

For contributing to Claude Buddy:

```bash
# Clone repository
git clone https://github.com/claude-buddy/claude-buddy.git
cd claude-buddy

# Install dependencies
npm install

# Link for development
npm link

# Install in development mode
claude-buddy --dev
```

### Enterprise Installation

For enterprise deployments with shared configurations:

```bash
# Install with enterprise profile
claude-buddy --global --enterprise

# Use shared configuration
export CLAUDE_BUDDY_CONFIG="/shared/config.json"
```

## Next Steps

After successful installation:

1. **Read the [Usage Guide](usage.md)** for detailed command and persona documentation
2. **Customize persona preferences** in `buddy-config.json`
3. **Experiment with persona system** using different commands and contexts
4. **Join our community** for support and updates
5. **Try the example workflows** with persona intelligence

## Support

If you encounter issues:

- Check the [Troubleshooting Guide](troubleshooting.md)
- Search [GitHub Issues](https://github.com/claude-buddy/claude-buddy/issues)
- Join our [Discord Community](https://discord.gg/claude-buddy)
- Email support: support@claude-buddy.dev