/**
 * Flag Parser for Persona Manual Overrides
 * 
 * Handles parsing and processing of persona-related flags and commands
 */

import type {
  ParsedFlags,
  FlagValidationResult,
  ActivationInstructions
} from '../types/context.js';

interface FlagPatterns {
  persona: RegExp;
  shortPersona: RegExp;
  with: RegExp;
  focus: RegExp;
  comprehensive: RegExp;
  singlePersona: RegExp;
  noCollaboration: RegExp;
  learn: RegExp;
  noLearn: RegExp;
}

interface CommandSuggestions {
  [command: string]: string[];
}

class PersonaFlagParser {
  private availablePersonas: string[];
  private flagPatterns: FlagPatterns;

  constructor() {
    this.availablePersonas = [
      'architect', 'frontend', 'backend', 'security', 'performance',
      'analyzer', 'qa', 'refactorer', 'devops', 'mentor', 'scribe'
    ];
    
    this.flagPatterns = {
      // Direct persona flags
      persona: /--persona-([a-z]+)/gi,
      shortPersona: /--([a-z]+)/gi,
      
      // With collaboration flags
      with: /--with-([a-z]+)/gi,
      
      // Focus flags
      focus: /--focus\s+([a-z,\s]+)/gi,
      
      // Mode flags
      comprehensive: /--comprehensive|--all|--multi-persona/gi,
      singlePersona: /--single|--single-persona/gi,
      
      // Collaboration control
      noCollaboration: /--no-collab|--no-collaboration|--solo/gi,
      
      // Learning flags
      learn: /--learn|--adaptive/gi,
      noLearn: /--no-learn|--static/gi
    };
  }

  /**
   * Parse user input for persona-related flags and commands
   */
  parseInput(userInput: string): ParsedFlags {
    const originalInput = userInput;
    let cleanedInput = userInput;
    
    const parseResult: ParsedFlags = {
      originalInput,
      cleanedInput: '',
      hasFlags: false,
      personas: {
        manual: [],
        with: [],
        focus: []
      },
      modes: {
        comprehensive: false,
        singlePersona: false,
        noCollaboration: false,
        learn: null // null = use config, true/false = override
      },
      focusAreas: [],
      confidence: {
        override: null,
        threshold: null
      }
    };

    // Parse persona flags
    parseResult.personas.manual = this.extractPersonaFlags(userInput, 'persona');
    parseResult.personas.with = this.extractPersonaFlags(userInput, 'with');
    
    // Parse focus areas
    const focusMatch = userInput.match(this.flagPatterns.focus);
    if (focusMatch) {
      parseResult.focusAreas = focusMatch[0]
        .replace(/--focus\s+/gi, '')
        .split(',')
        .map(area => area.trim().toLowerCase())
        .filter(area => area.length > 0);
      parseResult.hasFlags = true;
    }

    // Parse mode flags
    parseResult.modes.comprehensive = this.flagPatterns.comprehensive.test(userInput);
    parseResult.modes.singlePersona = this.flagPatterns.singlePersona.test(userInput);
    parseResult.modes.noCollaboration = this.flagPatterns.noCollaboration.test(userInput);
    
    // Parse learning flags
    if (this.flagPatterns.learn.test(userInput)) {
      parseResult.modes.learn = true;
    } else if (this.flagPatterns.noLearn.test(userInput)) {
      parseResult.modes.learn = false;
    }

    // Check if any flags were found
    parseResult.hasFlags = parseResult.hasFlags || 
      parseResult.personas.manual.length > 0 ||
      parseResult.personas.with.length > 0 ||
      Object.values(parseResult.modes).some(mode => mode === true);

    // Clean input by removing all flags
    cleanedInput = this.removeFlags(userInput);
    parseResult.cleanedInput = cleanedInput.trim();

    return parseResult;
  }

  /**
   * Extract persona names from specific flag types
   */
  private extractPersonaFlags(input: string, flagType: keyof FlagPatterns): string[] {
    const personas: string[] = [];
    const pattern = this.flagPatterns[flagType];
    let match: RegExpExecArray | null;

    // Reset regex lastIndex to avoid issues with global flags
    pattern.lastIndex = 0;

    while ((match = pattern.exec(input)) !== null) {
      const personaName = match[1].toLowerCase();
      if (this.availablePersonas.includes(personaName)) {
        if (!personas.includes(personaName)) {
          personas.push(personaName);
        }
      }
    }

    return personas;
  }

  /**
   * Remove all persona-related flags from input
   */
  private removeFlags(input: string): string {
    let cleaned = input;

    // Remove all flag patterns
    for (const [, pattern] of Object.entries(this.flagPatterns)) {
      cleaned = cleaned.replace(pattern, '');
    }

    // Clean up extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    return cleaned;
  }

  /**
   * Validate parsed flags for conflicts and issues
   */
  validateFlags(parseResult: ParsedFlags): FlagValidationResult {
    const validation: FlagValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: []
    };

    // Check for conflicting modes
    if (parseResult.modes.comprehensive && parseResult.modes.singlePersona) {
      validation.errors.push('Cannot use --comprehensive and --single-persona flags together');
      validation.isValid = false;
    }

    // Check for collaboration conflicts
    if (parseResult.modes.noCollaboration && parseResult.personas.with.length > 0) {
      validation.warnings.push('--no-collaboration flag conflicts with --with-* flags');
    }

    // Check for empty focus areas
    if (parseResult.focusAreas.includes('')) {
      validation.warnings.push('Empty focus areas detected, will be ignored');
    }

    // Check for unknown focus areas
    const validFocusAreas = ['security', 'performance', 'quality', 'architecture', 'frontend', 'backend', 'testing', 'documentation'];
    const unknownFocusAreas = parseResult.focusAreas.filter(area => !validFocusAreas.includes(area));
    if (unknownFocusAreas.length > 0) {
      validation.warnings.push(`Unknown focus areas: ${unknownFocusAreas.join(', ')}`);
    }

    // Suggest improvements
    if (parseResult.personas.manual.length > 3) {
      validation.suggestions.push('Consider using --comprehensive instead of manually specifying many personas');
    }

    if (parseResult.personas.manual.length === 0 && parseResult.modes.singlePersona) {
      validation.suggestions.push('--single-persona is more effective when combined with a specific --persona-* flag');
    }

    return validation;
  }

  /**
   * Generate persona activation instructions based on parsed flags
   */
  generateActivationInstructions(parseResult: ParsedFlags, validation: FlagValidationResult): ActivationInstructions {
    if (!validation.isValid) {
      return {
        mode: 'error',
        strategy: 'error',
        personas: {
          required: [],
          preferred: [],
          focus: []
        },
        collaboration: {
          enabled: false,
          comprehensive: false,
          singleLeader: false
        },
        learning: {
          enabled: null,
          adaptive: false
        },
        validation,
        errors: validation.errors,
        fallback: 'automatic'
      };
    }

    const instructions: ActivationInstructions = {
      mode: 'manual',
      strategy: 'default',
      personas: {
        required: parseResult.personas.manual,
        preferred: parseResult.personas.with,
        focus: parseResult.focusAreas
      },
      collaboration: {
        enabled: !parseResult.modes.noCollaboration,
        comprehensive: parseResult.modes.comprehensive,
        singleLeader: parseResult.modes.singlePersona
      },
      learning: {
        enabled: parseResult.modes.learn,
        adaptive: parseResult.modes.learn === true
      },
      validation: validation
    };

    // Determine strategy based on flags
    if (parseResult.modes.comprehensive) {
      instructions.strategy = 'comprehensive';
    } else if (parseResult.modes.singlePersona) {
      instructions.strategy = 'single_leader';
    } else if (parseResult.modes.noCollaboration) {
      instructions.strategy = 'isolated';
    } else if (parseResult.personas.with.length > 0) {
      instructions.strategy = 'collaborative';
    } else if (parseResult.personas.manual.length > 0) {
      instructions.strategy = 'manual_selection';
    } else {
      instructions.strategy = 'focus_driven';
    }

    return instructions;
  }

  /**
   * Generate help text for available persona flags
   */
  generateHelpText(): string {
    const help = `
# Persona Flag Reference

## Manual Persona Selection
${this.availablePersonas.map(persona => `- \`--persona-${persona}\`: Activate ${persona} persona`).join('\n')}

## Collaboration Flags
${this.availablePersonas.map(persona => `- \`--with-${persona}\`: Include ${persona} as supporting expert`).join('\n')}

## Focus Areas
- \`--focus security,performance\`: Focus on specific areas (comma-separated)
- Available focus areas: security, performance, quality, architecture, frontend, backend, testing, documentation

## Mode Flags
- \`--comprehensive\`: Activate all relevant personas
- \`--single-persona\`: Use single persona leadership
- \`--no-collaboration\`: Disable persona collaboration
- \`--learn\`: Enable adaptive learning
- \`--no-learn\`: Disable learning for this session

## Example Usage
\`\`\`
/buddy:analyze --persona-security --with-backend --focus security,performance
/buddy:improve --comprehensive --learn
/buddy:architect --persona-architect --with-performance --with-security
\`\`\`
`;
    return help;
  }

  /**
   * Quick flag detection - fast check if input contains persona flags
   */
  hasPersonaFlags(input: string): boolean {
    return /--persona-|--with-|--focus|--comprehensive|--single|--no-collab/i.test(input);
  }

  /**
   * Extract command name from input (for context-aware flag parsing)
   */
  extractCommand(input: string): string | null {
    const commandMatch = input.match(/^\/buddy:([a-z]+)/i);
    return commandMatch ? commandMatch[1].toLowerCase() : null;
  }

  /**
   * Get command-specific flag suggestions
   */
  getCommandSuggestions(command: string): string[] {
    const suggestions: CommandSuggestions = {
      'analyze': ['--persona-analyzer', '--persona-security', '--focus security,performance'],
      'improve': ['--persona-refactorer', '--persona-performance', '--comprehensive'],
      'review': ['--persona-security', '--persona-qa', '--with-analyzer'],
      'architect': ['--persona-architect', '--with-performance', '--with-security'],
      'commit': ['--persona-scribe', '--persona-security'],
      'docs': ['--persona-scribe', '--persona-mentor'],
      'brainstorm': ['--comprehensive', '--with-architect']
    };

    return suggestions[command] || ['--comprehensive', '--persona-analyzer'];
  }
}

export default PersonaFlagParser;