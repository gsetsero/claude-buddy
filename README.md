# Claude Buddy

🔮 **Your intelligent AI development companion with domain expertise**

Claude Buddy supercharges Claude Code with intelligent workflows, domain-specific personas, safety features, and automation tools. Unlike external CLI tools, it integrates natively with Claude Code using slash commands and hooks for a seamless development experience powered by specialized AI experts.

[![npm version](https://badge.fury.io/js/claude-buddy.svg)](https://badge.fury.io/js/claude-buddy)
[![npm downloads](https://img.shields.io/npm/dm/claude-buddy.svg)](https://www.npmjs.com/package/claude-buddy)
[![CI](https://github.com/gsetsero/claude-buddy/actions/workflows/ci.yml/badge.svg)](https://github.com/gsetsero/claude-buddy/actions/workflows/ci.yml)
[![Publish](https://github.com/gsetsero/claude-buddy/actions/workflows/publish.yml/badge.svg)](https://github.com/gsetsero/claude-buddy/actions/workflows/publish.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](package.json)

## ✨ Features

### 🎭 **Intelligent Persona System**
- **11 Domain Experts**: Specialized AI personas for architecture, frontend, backend, security, performance, and more
- **Auto-Activation**: Context-aware persona selection based on project analysis and user intent
- **Manual Control**: Fine-grained persona control with `--persona-{name}` and `--with-{name}` flags
- **Collaborative Intelligence**: Multi-persona coordination for comprehensive solutions
- **Adaptive Learning**: System improves through usage patterns and feedback

### 🪝 **Intelligent Safety Hooks**
- **File Protection**: Automatically blocks writes to sensitive files (.env, keys, secrets)
- **Command Validation**: Prevents dangerous bash commands (rm -rf, sudo operations)
- **Auto-formatting**: Formats code files after writing (Python, JavaScript, TypeScript, etc.)

### ⚡ **AI-Powered Slash Commands with Persona Intelligence**
- **`/buddy:analyze`** - Multi-dimensional analysis with automatic expert activation
- **`/buddy:improve`** - Systematic enhancement with quality, performance, and security focus
- **`/buddy:architect`** - System architecture design with domain expertise
- **`/buddy:commit`** - Professional commit messages with scribe and security personas
- **`/buddy:review`** - Comprehensive multi-persona code review
- **`/buddy:changelog`** - Create human-readable changelogs from git history
- **`/buddy:readme`** - Generate professional README files
- **`/buddy:docs`** - Create technical documentation
- **`/buddy:brainstorm`** - AI-powered feature ideation and improvements

### 🔒 **Security-First Design**
- Real-time protection against accidental data exposure
- Audit trail for all file operations and commands
- Configurable protection rules and whitelists
- No external API calls - everything runs locally

### 🎯 **Developer Experience**
- Zero-configuration slash commands with intelligent persona activation
- Native Claude Code integration with seamless AI expert coordination
- Home and project-based installation modes
- Comprehensive logging and debugging with persona analytics
- Context-aware assistance that learns and adapts to your workflow

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- UV (Astral Python Package Manager)
- Git
- [Claude Code](https://claude.ai/code) installed and configured

### Installation

#### One-Command Setup (Fastest)
```bash
# Install and configure globally in one command
npx claude-buddy --global
```

#### Global Installation (Recommended for frequent use)
```bash
npm install -g claude-buddy
claude-buddy --global
```

#### Project-Specific Installation
```bash
cd your-project
npx claude-buddy --project
```

**Smart Backup (Project Mode):** By default, the installer skips backup if your project is in git, since git already provides version control for the `.claude` folder. Use `--smart-backup false` to force backup creation.

#### Interactive Installation
```bash
npx claude-buddy
# Follow the interactive prompts to choose installation mode
```

#### From Source (Development)
If you're contributing or installing from source:

```bash
# Clone and install
git clone https://github.com/gsetsero/claude-buddy.git
cd claude-buddy
npm install

# Option 1: Install globally from source
npm install -g .
claude-buddy --global

# Option 2: Link for development
npm link
claude-buddy --global

# Option 3: Run directly
node install.js --global

# Project mode with smart backup control
node install.js --project                    # Smart backup enabled (default)
node install.js --project --smart-backup false  # Force backup even in git repos
```

### Verification
After installation, restart Claude Code and try:
```
/buddy:commit
```

## 📖 Usage

### 🎭 Persona System

Claude Buddy features an intelligent persona system with 11 domain experts that automatically activate based on context or can be manually controlled.

#### Available Personas
- **🏗️ Architect**: Systems design, scalability, architecture patterns
- **🎨 Frontend**: UI/UX, accessibility, responsive design, performance
- **⚙️ Backend**: APIs, databases, server reliability, data integrity
- **🛡️ Security**: Threat modeling, vulnerabilities, compliance
- **⚡ Performance**: Optimization, bottlenecks, efficiency
- **🔍 Analyzer**: Root cause analysis, systematic investigation
- **🧪 QA**: Quality assurance, testing, validation
- **🔧 Refactorer**: Code quality, technical debt, maintainability
- **🚀 DevOps**: Infrastructure, deployment, observability
- **👨‍🏫 Mentor**: Knowledge transfer, education, guidance
- **✍️ Scribe**: Professional writing, documentation

#### Automatic Activation
```bash
# Context-aware persona activation
/buddy:analyze                    # Auto-detects and activates relevant experts
/buddy:review                     # Multi-persona security, QA, and performance review
/buddy:improve                    # Quality, performance, and architecture enhancement
```

#### Manual Control
```bash
# Direct persona activation
/buddy:analyze --persona-security --persona-performance

# Collaborative activation
/buddy:improve --persona-refactorer --with-performance --with-security

# Focus-driven analysis
/buddy:review --focus security,performance,quality

# Comprehensive analysis
/buddy:architect --comprehensive --learn
```

#### Learning & Adaptation
The system learns from your usage patterns and feedback to improve persona activation accuracy over time.

### Slash Commands

#### `/buddy:commit` - AI-Powered Commits
```bash
/buddy:commit                    # Default mode (recommended) - press Enter for defaults
/buddy:commit --yes              # Auto-yes mode - fully automated
/buddy:commit --interactive      # Interactive mode - explicit choices required
```
- Analyzes git changes and generates conventional commit messages
- Three interaction modes: default (with sensible defaults), auto-yes (fully automated), interactive (classic)
- Automatic staging, committing, and pushing with user control
- Clean commit messages without AI tool references

#### `/buddy:changelog` - Intelligent Changelog Generation  
```
/buddy:changelog
```
- Creates human-readable changelogs from commit history
- Generates daily, weekly, and monthly summaries
- Filters trivial changes, focuses on user impact

#### `/buddy:review` - Comprehensive Code Review
```
/buddy:review
```
- Security vulnerability assessment
- Code quality and performance analysis
- Best practices validation
- Actionable improvement recommendations

#### `/buddy:readme` - Professional Documentation
```
/buddy:readme
```
- Auto-detects project type and technologies
- Generates comprehensive README with examples
- Includes installation and usage instructions

#### `/buddy:docs` - Technical Documentation
```
/buddy:docs
```
- Creates architectural documentation
- API reference generation
- Deployment and troubleshooting guides

#### `/buddy:analyze` - Multi-Dimensional Analysis
```bash
/buddy:analyze                           # Automatic persona activation
/buddy:analyze --persona-security        # Security-focused analysis
/buddy:analyze --focus performance,quality # Focus on specific areas
```
- Intelligent context detection and expert activation
- Security, performance, quality, and architecture analysis
- Evidence-based findings with actionable recommendations
- Multi-persona collaboration for comprehensive insights

#### `/buddy:improve` - Systematic Code Enhancement  
```bash
/buddy:improve                           # Auto-detect improvement opportunities
/buddy:improve --persona-refactorer      # Code quality focus
/buddy:improve --comprehensive           # Full multi-persona enhancement
```
- Quality, performance, and security improvements
- Technical debt reduction and maintainability enhancement
- Collaborative persona approach for holistic improvements
- Evidence-based optimization with validation

#### `/buddy:architect` - System Architecture Design
```bash
/buddy:architect                         # Architecture analysis and design
/buddy:architect --with-security         # Security-aware architecture
/buddy:architect --focus scalability     # Scalability-focused design
```
- System design with architectural expertise
- Performance and security architecture integration  
- Scalability planning and technology selection
- Architecture decision records and implementation guidance

#### `/buddy:brainstorm` - Feature Ideation
```
/buddy:brainstorm
```
- AI-powered improvement suggestions
- Feature gap analysis
- Technology recommendations
- Innovation opportunities

### Safety Hooks

Safety hooks work automatically in the background:

#### File Protection
```
Claude: I'll write your API key to config.env
🛡️ File Protection: Access blocked - Environment files contain secrets
```

#### Command Validation
```
Claude: I'll run rm -rf / to clean up
🚫 Dangerous Command Blocked: Recursive deletion from root directory
```

#### Auto-formatting
```
Claude: *writes Python file*
✨ Auto-formatted with black
```

## ⚙️ Configuration

### Installation Modes

#### Home Mode (`~/.claude/`)
Global configuration applied to all projects:
```bash
claude-buddy --global
```

#### Project Mode (`.claude/`)
Project-specific configuration:
```bash
claude-buddy --project
```

### Configuration Files

#### `buddy-config.json` - Main Settings
```json
{
  "features": {
    "auto_commit": true,
    "safety_hooks": true,
    "auto_formatting": true,
    "personas": true
  },
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
  },
  "file_protection": {
    "enabled": true,
    "additional_patterns": ["*.secret"],
    "whitelist_patterns": ["test.env"]
  },
  "command_validation": {
    "enabled": true,
    "block_dangerous": true,
    "warn_performance": true
  }
}
```

#### `hooks.json` - Hook Configuration
Automatically configured during installation. Advanced users can customize hook behavior.

### Customization Examples

#### Add Custom Protected Files
```json
{
  "file_protection": {
    "additional_patterns": [
      "*.key",
      "secrets/*",
      "credentials.json"
    ]
  }
}
```

#### Whitelist Safe Commands
```json
{
  "command_validation": {
    "whitelist_patterns": [
      "rm -rf node_modules",
      "rm -rf dist"
    ]
  }
}
```

#### Configure Auto-formatting
```json
{
  "auto_formatting": {
    "extensions": [".py", ".js", ".ts"],
    "exclude_patterns": ["generated/", "vendor/"]
  }
}
```

## 🔍 Monitoring & Logs

Activity logs are stored in `.claude-buddy/`:

- **`protection.log`** - File protection events
- **`commands.log`** - Command validation events  
- **`formatting.log`** - Auto-formatting activities

Example log entry:
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "file_path": ".env",
  "action": "Write",
  "blocked": true,
  "tool": "file-guard"
}
```

## 🛠️ Development

### Project Structure
```
claude-code-int/
├── src/
│   ├── slash-commands/     # Slash command implementations (installed to commands/)
│   ├── hooks/             # Safety hook scripts
│   ├── config/            # Default configurations
│   └── templates/         # Prompt templates
├── docs/                  # Documentation
├── tests/                 # Test suites
└── install.js            # Installation script
```

### Local Development
```bash
git clone https://github.com/claude-buddy/claude-buddy.git
cd claude-buddy
npm install
node install.js --dev
```

### Running Tests
```bash
npm test
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 🔒 Security

Claude Buddy takes security seriously:

- **Local Processing**: All analysis runs locally, no external API calls
- **Audit Trail**: Comprehensive logging of all operations
- **Permission System**: Granular control over hook behavior
- **Safe Defaults**: Conservative security settings out of the box

Report security vulnerabilities to: security@claude-buddy.dev

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Claude Code](https://claude.ai/code) - The amazing AI coding platform
- [Anthropic](https://anthropic.com) - For creating Claude
- Open source formatters and linters integrated

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/claude-buddy/claude-buddy/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/claude-buddy/claude-buddy/discussions)
- 📧 **Email**: support@claude-buddy.dev
- 📖 **Docs**: [Full Documentation](https://docs.claude-buddy.dev)

## 🗺️ Roadmap

- [ ] **v1.1**: Plugin system for custom hooks
- [ ] **v1.2**: Team collaboration features
- [ ] **v1.3**: Advanced analytics dashboard
- [ ] **v2.0**: AI model fine-tuning for project-specific behavior

---

**Made with ❤️ for the Claude Code community**

*Transform your development workflow with AI-powered assistance that actually understands your code.*