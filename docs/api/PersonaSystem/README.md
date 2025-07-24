[**claude-buddy v1.0.0**](../README.md)

***

[claude-buddy](../modules.md) / PersonaSystem

# PersonaSystem

# Claude Buddy Persona System

The Persona System is the core intelligence layer of Claude Buddy, providing
an innovative 11-persona intelligent coordination system for specialized AI assistance.

## Overview

This system automatically activates domain experts based on context analysis,
enabling sophisticated multi-expert collaboration for comprehensive code assistance.

## Key Features

- **11 Specialized Personas**: Technical specialists, process experts, and knowledge specialists
- **Auto-Activation Engine**: Context-driven persona selection with multi-factor scoring
- **Learning System**: Adaptive pattern recognition and user preference learning  
- **Collaboration Patterns**: Coordinated multi-persona workflows
- **Performance Analytics**: Usage tracking and effectiveness monitoring

## Architecture

The system consists of four main components:

- [PersonaManager](classes/PersonaManager.md) - Central coordination and persona lifecycle management
- [PersonaActivationEngine](classes/PersonaActivationEngine.md) - Context detection and persona recommendation  
- [PersonaLearningEngine](classes/PersonaLearningEngine.md) - Pattern learning and adaptive improvement
- [PersonaFlagParser](classes/PersonaFlagParser.md) - Command-line flag parsing and validation

## Usage Example

```typescript
// Initialize the persona system
const personaSystem = new PersonaSystem();
await personaSystem.initialize();

// Process user input with automatic persona activation
const result = await personaSystem.processUserInput(
  "Review this code for security vulnerabilities", 
  { files: ["auth.ts"], command: "review" }
);

// Generate persona-aware prompt
const prompt = personaSystem.generatePrompt(result.activePersonas, userInput);
```

## Author

Claude Buddy Contributors

## Since

1.0.0

## Classes

### Core

- [PersonaSystem](classes/PersonaSystem.md)

### Auto-Activation

- [PersonaActivationEngine](classes/PersonaActivationEngine.md)

### Other

- [PersonaFlagParser](classes/PersonaFlagParser.md)
- [PersonaLearningEngine](classes/PersonaLearningEngine.md)
- [PersonaManager](classes/PersonaManager.md)

## Interfaces

### Persona Management

- [ParsedPersona](interfaces/ParsedPersona.md)

### Learning Engine

- [ActivationData](interfaces/ActivationData.md)

### Other

- [ProcessingResult](interfaces/ProcessingResult.md)
- [PersonaSystemOptions](interfaces/PersonaSystemOptions.md)
- [PersonaSystemHelp](interfaces/PersonaSystemHelp.md)
- [SystemAnalytics](interfaces/SystemAnalytics.md)

## Variables

- [personaSystem](variables/personaSystem.md)

## References

### default

Renames and re-exports [PersonaSystem](classes/PersonaSystem.md)
