/**
 * # Claude Buddy Persona System
 * 
 * The Persona System is the core intelligence layer of Claude Buddy, providing
 * an innovative 11-persona intelligent coordination system for specialized AI assistance.
 * 
 * ## Overview
 * 
 * This system automatically activates domain experts based on context analysis,
 * enabling sophisticated multi-expert collaboration for comprehensive code assistance.
 * 
 * ## Key Features
 * 
 * - **11 Specialized Personas**: Technical specialists, process experts, and knowledge specialists
 * - **Auto-Activation Engine**: Context-driven persona selection with multi-factor scoring
 * - **Learning System**: Adaptive pattern recognition and user preference learning  
 * - **Collaboration Patterns**: Coordinated multi-persona workflows
 * - **Performance Analytics**: Usage tracking and effectiveness monitoring
 * 
 * ## Architecture
 * 
 * The system consists of four main components:
 * 
 * - {@link PersonaManager} - Central coordination and persona lifecycle management
 * - {@link PersonaActivationEngine} - Context detection and persona recommendation  
 * - {@link PersonaLearningEngine} - Pattern learning and adaptive improvement
 * - {@link PersonaFlagParser} - Command-line flag parsing and validation
 * 
 * ## Usage Example
 * 
 * ```typescript
 * // Initialize the persona system
 * const personaSystem = new PersonaSystem();
 * await personaSystem.initialize();
 * 
 * // Process user input with automatic persona activation
 * const result = await personaSystem.processUserInput(
 *   "Review this code for security vulnerabilities", 
 *   { files: ["auth.ts"], command: "review" }
 * );
 * 
 * // Generate persona-aware prompt
 * const prompt = personaSystem.generatePrompt(result.activePersonas, userInput);
 * ```
 * 
 * @module PersonaSystem
 * @author Claude Buddy Contributors
 * @since 1.0.0
 */

import PersonaManager from './persona-manager.js';
import PersonaFlagParser from './flag-parser.js';
import PersonaLearningEngine from './learning-engine.js';
import { PersonaActivationEngine } from './auto-activation.js';

import type {
  ProcessingResult,
  PersonaSystemOptions,
  PersonaSystemHelp,
  SystemAnalytics,
  PersonaFeedback
} from '../types/api.js';

import type {
  PersonaActivationResult,
  ActivePersona,
  GeneratedPrompt
} from '../types/personas.js';

import type {
  InputContext,
  ParsedFlags,
  FlagValidationResult,
  LearningRecommendations,
  ActivationInstructions
} from '../types/context.js';

/**
 * ## PersonaSystem
 * 
 * Main coordinating class for the entire persona system. Provides a unified interface
 * for persona activation, learning, and collaboration management.
 * 
 * ### Responsibilities
 * 
 * - **Initialization**: Sets up all persona system components
 * - **Input Processing**: Analyzes user input and activates appropriate personas
 * - **Flag Parsing**: Handles manual persona overrides and configuration flags
 * - **Learning Integration**: Records usage patterns and adapts behavior
 * - **Analytics**: Provides performance metrics and usage insights
 * 
 * ### Usage Patterns
 * 
 * #### Basic Usage
 * ```typescript
 * const system = new PersonaSystem();
 * await system.initialize();
 * const result = await system.processUserInput("analyze security issues");
 * ```
 * 
 * #### Manual Persona Selection
 * ```typescript
 * const result = await system.processUserInput(
 *   "help with performance --persona-security --persona-performance"
 * );
 * ```
 * 
 * #### Learning and Feedback
 * ```typescript
 * await system.provideFeedback({
 *   personas: ["security", "performance"],
 *   rating: 5,
 *   comments: "Excellent analysis"
 * });
 * ```
 * 
 * @category Core
 * @public
 */
export class PersonaSystem {
  /** @internal Core persona management component */
  private manager: PersonaManager;
  
  /** @internal Flag parsing and validation component */
  private flagParser: PersonaFlagParser;
  
  /** @internal Learning and adaptation component */
  private learningEngine: PersonaLearningEngine;
  
  /** @internal System initialization state */
  private isInitialized: boolean = false;
  
  /** @internal System configuration data */
  private config: unknown = null;

  constructor(configDir?: string) {
    this.manager = new PersonaManager(configDir);
    this.flagParser = new PersonaFlagParser();
    this.learningEngine = new PersonaLearningEngine();
  }

  /**
   * Initialize the complete persona system.
   * 
   * Sets up all persona system components including:
   * - Persona manager with 11 specialized personas
   * - Auto-activation engine with context detection
   * - Learning engine with pattern recognition
   * 
   * Must be called before using any other persona system functionality.
   * 
   * @returns Promise resolving to true if initialization succeeds, false otherwise
   * 
   * @example
   * ```typescript
   * const personaSystem = new PersonaSystem();
   * const success = await personaSystem.initialize();
   * if (success) {
   *   console.log("Persona system ready!");
   * }
   * ```
   * 
   * @category Core
   * @public
   */
  async initialize(): Promise<boolean> {
    try {
      // Initialize all components
      await Promise.all([
        this.manager.initialize(),
        this.learningEngine.initialize()
      ]);

      this.isInitialized = true;
      console.log('Persona system fully initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize persona system:', error);
      return false;
    }
  }

  /**
   * Process user input and activate appropriate personas.
   * 
   * This is the main entry point for persona system functionality. It:
   * 1. Parses command-line flags for manual persona overrides
   * 2. Validates flag combinations and constraints
   * 3. Applies learning recommendations from previous usage
   * 4. Activates personas through auto-detection or manual selection
   * 5. Records interaction for future learning
   * 
   * @param userInput - The user's input string, potentially with persona flags
   * @param context - Additional context including files, command type, project info
   * @returns Promise resolving to processing result with activated personas and prompts
   * 
   * @example
   * ```typescript
   * // Automatic activation based on context
   * const result = await system.processInput(
   *   "Review this code for security issues",
   *   { files: ["auth.ts"], command: "review" }
   * );
   * 
   * // Manual persona override
   * const result = await system.processInput(
   *   "Help with performance --persona-security --persona-performance"
   * );
   * ```
   * 
   * @category Core
   * @public
   */
  async processInput(
    userInput: string, 
    context: Partial<InputContext> = {}
  ): Promise<ProcessingResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Parse flags and clean input
      const flagResult = this.flagParser.parseInput(userInput);
      const validation = this.flagParser.validateFlags(flagResult);
      
      if (!validation.isValid) {
        return {
          success: false,
          context: context as InputContext,
          prompt: this.createEmptyPrompt(),
          flags: flagResult,
          validation,
          error: 'Invalid flags detected'
        };
      }

      // Get learning recommendations
      const learningRecommendations = this.learningEngine.getActivationRecommendations(context);

      // Enhanced context with learning insights
      const enhancedContext: InputContext = {
        cwd: context.cwd || process.cwd(),
        cleanedInput: flagResult.cleanedInput,
        flags: flagResult,
        learning: learningRecommendations,
        command: this.flagParser.extractCommand(userInput) || undefined,
        ...context
      };

      // Select personas based on flags or auto-activation
      let personaResult: PersonaActivationResult;
      if (flagResult.hasFlags) {
        personaResult = this.handleManualActivation(flagResult, enhancedContext);
      } else {
        personaResult = await this.handleAutoActivation(flagResult.cleanedInput, enhancedContext);
      }

      // Record activation for learning
      this.recordActivationForLearning(personaResult, enhancedContext);

      // Generate complete response
      return {
        success: true,
        personas: personaResult,
        context: enhancedContext,
        prompt: this.generateEnhancedPrompt(personaResult, enhancedContext),
        flags: flagResult,
        validation: validation,
        learning: learningRecommendations
      };

    } catch (error) {
      console.error('Error processing persona input:', error);
      return {
        success: false,
        context: context as InputContext,
        prompt: this.createEmptyPrompt(),
        flags: this.createEmptyFlags(),
        validation: this.createEmptyValidation(),
        error: 'Failed to process persona activation',
        details: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Handle manual persona activation via flags
   */
  private handleManualActivation(
    flagResult: ParsedFlags, 
    context: InputContext
  ): PersonaActivationResult {
    const instructions = this.flagParser.generateActivationInstructions(
      flagResult, 
      this.flagParser.validateFlags(flagResult)
    );

    // Use manual override in persona manager
    const manualPersonas = [
      ...instructions.personas.required,
      ...instructions.personas.preferred
    ];

    return this.manager.activateManualPersonas(manualPersonas, context.cleanedInput, context);
  }

  /**
   * Handle automatic persona activation
   */
  private async handleAutoActivation(
    cleanedInput: string, 
    context: InputContext
  ): Promise<PersonaActivationResult> {
    return await this.manager.selectPersonas(cleanedInput, context);
  }

  /**
   * Record activation data for learning improvement
   */
  private recordActivationForLearning(
    personaResult: PersonaActivationResult, 
    context: InputContext
  ): void {
    const activationData = {
      userInput: context.cleanedInput,
      command: context.command,
      personas: personaResult.activePersonas?.map(p => p.name) || [],
      collaborationPattern: personaResult.collaboration?.strategy,
      confidence: personaResult.activePersonas?.map(p => p.confidence) || [],
      activationType: personaResult.manualMode ? 'manual' as const : 'automatic' as const,
      projectType: context.projectType,
      filePatterns: context.files || [],
      learningRecommendations: context.learning
    };

    this.learningEngine.recordActivation(activationData);
  }

  /**
   * Generate enhanced prompt combining persona content with system integration
   */
  private generateEnhancedPrompt(
    personaResult: PersonaActivationResult, 
    context: InputContext
  ): GeneratedPrompt {
    const basePrompt = this.manager.generatePersonaPrompt(
      personaResult.activePersonas, 
      context.cleanedInput, 
      context
    );

    // Add learning insights if available
    let enhancedPrompt = basePrompt.systemPrompt;
    
    if (context.learning && context.learning.reasoning.length > 0) {
      enhancedPrompt += `\n\n**Learning Insights:**\n`;
      enhancedPrompt += context.learning.reasoning.map(reason => `- ${reason}`).join('\n');
    }

    if (context.learning && context.learning.adaptations.length > 0) {
      enhancedPrompt += `\n\n**Recommended Adaptations:**\n`;
      enhancedPrompt += context.learning.adaptations.map(adaptation => 
        `- ${adaptation.type}: ${adaptation.reason}`).join('\n');
    }

    // Add flag information if manual activation
    if (personaResult.manualMode && context.flags?.hasFlags) {
      enhancedPrompt += `\n\n**Manual Activation Context:**\n`;
      enhancedPrompt += `User explicitly requested persona activation with specific flags.\n`;
      
      if (context.flags.focusAreas.length > 0) {
        enhancedPrompt += `Focus areas: ${context.flags.focusAreas.join(', ')}\n`;
      }
    }

    return {
      ...basePrompt,
      systemPrompt: enhancedPrompt,
      learningIntegration: context.learning,
      flagIntegration: context.flags
    };
  }

  /**
   * Provide feedback on persona performance for learning
   */
  provideFeedback(feedback: PersonaFeedback): void {
    // Record in learning engine
    this.learningEngine.recordFeedback(feedback);
    
    // Also record in persona manager for immediate improvements
    this.manager.provideFeedback(feedback);
  }

  /**
   * Get system analytics and performance metrics
   */
  getAnalytics(): SystemAnalytics {
    return {
      personaManager: this.manager.getAnalytics(),
      learning: this.learningEngine.getAnalytics(),
      systemHealth: {
        initialized: this.isInitialized,
        availablePersonas: this.manager.personas?.size || 0,
        activePersonas: this.manager.activePersonas?.length || 0
      }
    };
  }

  /**
   * Get help information for persona system usage
   */
  getHelp(): PersonaSystemHelp {
    return {
      flagHelp: this.flagParser.generateHelpText(),
      availablePersonas: Array.from(this.manager.personas?.keys() || []),
      commands: [
        '/buddy:analyze - Multi-dimensional analysis with persona intelligence',
        '/buddy:improve - Systematic improvement with expert collaboration',
        '/buddy:architect - Architecture design with domain expertise',
        '/buddy:review - Comprehensive review with security, QA, and performance focus',
        '/buddy:commit - Professional commits with scribe and security personas'
      ],
      examples: [
        '/buddy:analyze --persona-security --focus security,performance',
        '/buddy:improve --comprehensive --learn',
        '/buddy:architect --with-performance --with-security',
        '/buddy:review --persona-security --persona-qa'
      ]
    };
  }

  /**
   * Reset system state (useful for new sessions)
   */
  async reset(): Promise<void> {
    this.manager.reset();
    await this.learningEngine.endSession();
  }

  /**
   * Check if persona system is available and ready
   */
  isReady(): boolean {
    return this.isInitialized && 
           this.manager.personas && 
           this.manager.personas.size > 0;
  }

  /**
   * Get current active personas
   */
  getActivePersonas(): ActivePersona[] {
    return this.manager.getActivePersonas();
  }

  /**
   * Check if specific persona is currently active
   */
  isPersonaActive(personaName: string): boolean {
    return this.manager.isPersonaActive(personaName);
  }

  /**
   * Get persona-specific recommendations for a command
   */
  getCommandRecommendations(command: string): string[] {
    return this.flagParser.getCommandSuggestions(command);
  }

  // Helper methods for creating empty objects
  private createEmptyPrompt(): GeneratedPrompt {
    return {
      systemPrompt: '',
      personaContext: null,
      collaboration: null
    };
  }

  private createEmptyFlags(): ParsedFlags {
    return {
      originalInput: '',
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
        learn: null
      },
      focusAreas: [],
      confidence: {
        override: null,
        threshold: null
      }
    };
  }

  private createEmptyValidation(): FlagValidationResult {
    return {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: []
    };
  }
}

// Export singleton instance
export const personaSystem = new PersonaSystem();

// Export all classes and types
export { PersonaManager, PersonaFlagParser, PersonaLearningEngine, PersonaActivationEngine };
export type { PersonaSystemOptions, ProcessingResult, PersonaSystemHelp, SystemAnalytics };

// Export additional types referenced in API docs
export type { ParsedPersona } from './persona-manager.js';
export type { ActivationData } from './learning-engine.js';

// Default export for convenience
export default PersonaSystem;