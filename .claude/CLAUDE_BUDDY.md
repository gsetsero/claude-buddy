# Claude Buddy

🔮 **Your intelligent AI development companion with domain expertise**

## Installed Features

### 🎭 **Intelligent Persona System**
- **11 Domain Experts**: Architecture, frontend, backend, security, performance, and more
- **Auto-Activation**: Context-aware persona selection based on project analysis
- **Manual Control**: Fine-grained persona control with `--persona-{name}` flags
- **Collaborative Intelligence**: Multi-persona coordination for comprehensive solutions
- **Adaptive Learning**: System improves through usage patterns and feedback

### 🪝 Safety Hooks
- **File Protection**: Blocks writes to sensitive files (.env, keys, secrets)
- **Command Validation**: Prevents dangerous bash commands (rm -rf, etc.)
- **Auto-formatting**: Formats code files after writing

### ⚡ Slash Commands with Persona Intelligence
- `/buddy:analyze` - Multi-dimensional analysis with automatic expert activation
- `/buddy:improve` - Systematic enhancement with quality, performance, and security focus
- `/buddy:architect` - System architecture design with domain expertise
- `/buddy:commit` - AI-powered conventional commits with scribe persona
- `/buddy:review` - Comprehensive multi-persona code review
- `/buddy:changelog` - Generate intelligent changelogs
- `/buddy:readme` - Generate professional README files
- `/buddy:docs` - Create technical documentation
- `/buddy:brainstorm` - AI-powered feature ideation

## Available Personas

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

## Configuration

Configuration files:
- `buddy-config.json` - Main Claude Buddy settings including persona preferences
- `hooks.json` - Hook configuration for Claude Code
- `personas/config/personas-config.json` - Persona system configuration

## Usage Examples

### Automatic Persona Activation
```
/buddy:analyze                    # Auto-detects and activates relevant experts
/buddy:review                     # Multi-persona security, QA, and performance review
/buddy:improve                    # Quality, performance, and architecture enhancement
```

### Manual Persona Control
```
/buddy:analyze --persona-security --persona-performance
/buddy:improve --persona-refactorer --with-performance --with-security
/buddy:review --focus security,performance,quality
/buddy:architect --comprehensive --learn
```

Safety hooks and persona intelligence work automatically in the background.

## Learning & Adaptation

The persona system learns from your usage patterns and feedback to improve activation accuracy over time. Learning data is stored in `.claude-buddy/persona-memory.json`.

## Logs

Activity logs are stored in:
- `.claude-buddy/protection.log` - File protection events
- `.claude-buddy/commands.log` - Command validation events
- `.claude-buddy/formatting.log` - Auto-formatting events
- `.claude-buddy/persona-analytics.json` - Persona system analytics

## Support

For issues or questions, visit: https://github.com/claude-buddy/claude-buddy

---

Installed on: 2025-07-25T22:49:59.622Z
Mode: project
Version: 1.0.11
Persona System: Enabled with 11 domain experts
