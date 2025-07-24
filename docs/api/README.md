# Claude Buddy API Documentation

Welcome to the Claude Buddy API documentation! This comprehensive guide provides detailed information about the TypeScript interfaces, classes, and functions that make up the Claude Buddy persona system.

## 🎯 Quick Navigation

### Core Components
- **[PersonaSystem](PersonaSystem/classes/PersonaSystem.md)** - Main coordinating class for the entire persona system
- **[PersonaManager](PersonaSystem/classes/PersonaManager.md)** - Central coordination and persona lifecycle management
- **[PersonaActivationEngine](PersonaSystem/classes/PersonaActivationEngine.md)** - Context detection and persona recommendation
- **[PersonaLearningEngine](PersonaSystem/classes/PersonaLearningEngine.md)** - Pattern learning and adaptive improvement
- **[PersonaFlagParser](PersonaSystem/classes/PersonaFlagParser.md)** - Command-line flag parsing and validation

### Type Definitions
- **[Persona Types](types/README.md)** - Core persona system types and interfaces
- **[Processing Results](PersonaSystem/interfaces/ProcessingResult.md)** - Main API response structure
- **[System Analytics](PersonaSystem/interfaces/SystemAnalytics.md)** - Performance metrics and usage insights

## 🚀 Getting Started

### Basic Usage

```typescript
import { PersonaSystem } from 'claude-buddy';

// Initialize the persona system
const personaSystem = new PersonaSystem();
await personaSystem.initialize();

// Process user input with automatic persona activation
const result = await personaSystem.processInput(
  "Review this code for security vulnerabilities", 
  { files: ["auth.ts"], command: "review" }
);

// Access the activated personas
console.log('Active personas:', result.personas?.activePersonas?.map(p => p.name));

// Use the generated prompt
console.log('System prompt:', result.prompt?.systemPrompt);
```

### Manual Persona Control

```typescript
// Explicit persona selection with flags
const result = await personaSystem.processInput(
  "Optimize this function --persona-security --persona-performance"
);

// Focus-driven analysis
const result = await personaSystem.processInput(
  "Help with my API --focus security,performance,quality"
);

// Comprehensive multi-persona analysis
const result = await personaSystem.processInput(
  "Review my entire codebase --comprehensive --learn"
);
```

### Analytics and Feedback

```typescript
// Get system analytics
const analytics = personaSystem.getAnalytics();
console.log('Usage stats:', analytics.personaManager);
console.log('Learning effectiveness:', analytics.learning.learningEffectiveness);

// Provide feedback for learning improvement
personaSystem.provideFeedback({
  personas: ["security", "performance"],
  rating: 5,
  comments: "Excellent analysis of security vulnerabilities"
});
```

## 📊 Core Concepts

### Persona System Architecture

The Claude Buddy persona system is built around four main components:

1. **PersonaSystem** - The main API entry point that coordinates all other components
2. **PersonaManager** - Manages the 11 specialized personas and their lifecycle
3. **PersonaActivationEngine** - Uses multi-factor analysis to select appropriate personas
4. **PersonaLearningEngine** - Learns from usage patterns to improve future recommendations

### Auto-Activation Algorithm

The system uses a sophisticated scoring algorithm that considers:
- **Keyword matching (30%)** - Direct keyword matches in user input
- **Context analysis (40%)** - Project structure, files, and technical indicators  
- **File patterns (20%)** - File types and project organization patterns
- **User history (10%)** - Previous successful persona activations

### Collaboration Patterns

Personas can work together using different strategies:
- `single_persona` - One expert handles the task
- `multi_persona` - Multiple experts collaborate
- `comprehensive` - Full team analysis with all relevant experts
- `focus_driven` - Targeted analysis based on specified focus areas

## 🎭 Available Personas

| Persona | Category | Specialization |
|---------|----------|----------------|
| **Architect** | Technical | Systems design, scalability, architecture patterns |
| **Frontend** | Technical | UI/UX, accessibility, responsive design |
| **Backend** | Technical | APIs, databases, server reliability |
| **Security** | Technical | Threat modeling, vulnerabilities, compliance |
| **Performance** | Technical | Optimization, bottlenecks, efficiency |
| **DevOps** | Technical | Infrastructure, deployment, observability |
| **Analyzer** | Process | Root cause analysis, systematic investigation |
| **QA** | Process | Quality assurance, testing, validation |
| **Refactorer** | Process | Code quality, technical debt, maintainability |
| **Mentor** | Knowledge | Knowledge transfer, education, guidance |
| **Scribe** | Knowledge | Professional writing, documentation |

## 🔍 Common Use Cases

### Code Review and Analysis
```typescript
// Security-focused code review
const result = await personaSystem.processInput(
  "Review this authentication code",
  { files: ["auth.ts", "middleware/security.ts"] }
);

// Performance optimization
const result = await personaSystem.processInput(
  "Optimize this database query --persona-performance --persona-backend"
);
```

### Architecture and Design
```typescript
// System architecture design
const result = await personaSystem.processInput(
  "Design a scalable microservices architecture --persona-architect --with-security"
);

// Frontend architecture
const result = await personaSystem.processInput(
  "Help with React component architecture --persona-frontend --persona-architect"
);
```

### Quality Improvement
```typescript
// Comprehensive quality analysis
const result = await personaSystem.processInput(
  "Improve code quality across the project --comprehensive"
);

// Technical debt assessment
const result = await personaSystem.processInput(
  "Identify technical debt --persona-refactorer --persona-analyzer"
);
```

## 📚 Advanced Features

### Learning and Adaptation
The system continuously learns from usage patterns and feedback to improve persona selection accuracy over time.

### Context-Aware Recommendations
Project analysis includes technology stack detection, file pattern recognition, and complexity assessment to provide contextual persona recommendations.

### Performance Analytics
Comprehensive metrics tracking including activation accuracy, response times, user satisfaction, and collaboration effectiveness.

## 🛠️ Error Handling

The API provides comprehensive error handling with detailed error messages and recovery suggestions:

```typescript
const result = await personaSystem.processInput("invalid input");
if (!result.success) {
  console.log('Error:', result.error);
  console.log('Details:', result.details);
  console.log('Validation issues:', result.validation?.errors);
}
```

## 📖 API Reference

### Core Classes
- [PersonaSystem](PersonaSystem/classes/PersonaSystem.md) - Main API entry point
- [PersonaManager](PersonaSystem/classes/PersonaManager.md) - Persona lifecycle management
- [PersonaActivationEngine](PersonaSystem/classes/PersonaActivationEngine.md) - Auto-activation logic
- [PersonaLearningEngine](PersonaSystem/classes/PersonaLearningEngine.md) - Learning and adaptation
- [PersonaFlagParser](PersonaSystem/classes/PersonaFlagParser.md) - Flag parsing and validation

### Key Interfaces
- [ProcessingResult](PersonaSystem/interfaces/ProcessingResult.md) - Main API response
- [PersonaActivationResult](types/interfaces/PersonaActivationResult.md) - Persona activation details
- [SystemAnalytics](PersonaSystem/interfaces/SystemAnalytics.md) - System performance metrics
- [PersonaSystemOptions](PersonaSystem/interfaces/PersonaSystemOptions.md) - Configuration options

### Type Definitions
- [Core Types](types/README.md) - Complete type reference
- [Persona Types](types/interfaces/PersonaConfig.md) - Persona configuration types
- [Context Types](types/interfaces/InputContext.md) - Input context and analysis types

## 🔗 Related Documentation

- [Installation Guide](../../installation.md) - Setup and installation instructions
- [Architecture ADRs](../architecture/README.md) - Architectural decision records
- [Troubleshooting Guide](../troubleshooting.md) - Common issues and solutions
- [Persona Analytics](../persona-analytics.md) - Performance monitoring and debugging

## 💡 Need Help?

- **GitHub Issues**: [Report bugs or request features](https://github.com/claude-buddy/claude-buddy/issues)
- **Troubleshooting**: [Common issues and solutions](../troubleshooting.md)
- **Architecture Docs**: [System design and decisions](../architecture/README.md)

---

*This documentation is automatically generated from TypeScript definitions and maintained alongside the codebase.*