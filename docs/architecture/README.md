# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for Claude Code Buddy. ADRs document the significant architectural decisions made during the development of the project, including context, options considered, and rationale.

## ADR Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [ADR-001](./ADR-001-typescript-migration.md) | TypeScript Migration for Enhanced Type Safety | Accepted | 2024-07-22 |
| [ADR-002](./ADR-002-persona-system-architecture.md) | 11-Persona Intelligent System Architecture | Accepted | 2024-07-22 |
| [ADR-003](./ADR-003-uv-python-package-management.md) | UV for Python Package Management | Accepted | 2024-07-22 |
| [ADR-004](./ADR-004-hook-system-security.md) | Security-First Hook System Design | Accepted | 2024-07-22 |

## ADR Format

Each ADR follows this structure:

- **Status**: Proposed, Accepted, Deprecated, or Superseded
- **Context**: The situation that led to this decision
- **Decision**: What was decided
- **Consequences**: The positive and negative outcomes expected
- **Implementation**: How the decision was executed
- **Related ADRs**: Links to related architectural decisions

## Creating New ADRs

When making significant architectural decisions:

1. Copy the [ADR template](./ADR-template.md)
2. Fill in the sections with relevant information
3. Number it sequentially (ADR-XXX)
4. Update this index
5. Get team review before marking as "Accepted"

## Architecture Principles

### Core Design Principles

1. **Security First**: All components prioritize security and safe code execution
2. **Type Safety**: Comprehensive TypeScript usage with strict type checking
3. **Modularity**: Clear separation of concerns with well-defined interfaces
4. **Performance**: Efficient persona activation and minimal overhead
5. **Extensibility**: Easy to add new personas and extend functionality
6. **User Experience**: Intuitive workflows and helpful error messages

### System Components

- **Persona System**: Core intelligence layer with 11 specialized personas
- **Hook System**: File protection, validation, and automation
- **Testing Infrastructure**: Comprehensive test coverage with Jest
- **Documentation**: API docs, troubleshooting, and user guides
- **Installation System**: Cross-platform setup and configuration

## References

- [Claude Code Buddy Project Plan](../../PLAN.md)
- [API Documentation](../api/README.md)
- [Installation Guide](../installation.md)