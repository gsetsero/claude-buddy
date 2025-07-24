/**
 * Persona Manager - Central coordination for persona system
 * 
 * Manages persona selection, activation, collaboration, and integration
 * with Claude Buddy's command system.
 */

import { promises as fs } from 'fs';
import path from 'path';
import PersonaActivationEngine from './auto-activation.js';

import type {
  PersonaConfig,
  ActivePersona,
  CollaborationPattern,
  ValidationStep,
  CollaborationPlan,
  DetectionResults,
  PersonaActivationResult,
  SessionMemory,
  PersonaInteraction,
  PersonaFeedback,
  PersonaManagerAnalytics,
  GeneratedPrompt,
  SuccessfulPattern,
  FeedbackRecord,
  ActivationHistory,
  PersonaContext,
  ActivationReason
} from '../types/personas.js';

import type {
  InputContext
} from '../types/context.js';

/**
 * Parsed persona with runtime state
 * @category Persona Management
 */
export interface ParsedPersona extends PersonaConfig {
  name: string;
  content: string;
  isActive: boolean;
  activationReason: string | null;
  confidence: number;
  reasoning?: string;
}

interface CollaborationMatrixEntry {
  description: string;
  synergy: 'positive' | 'neutral' | 'negative';
  leadPersona: string;
}

class PersonaManager {
  private configDir: string;
  private specialistsDir: string;
  private activationEngine: PersonaActivationEngine;
  
  private config: any = null;
  public personas: Map<string, ParsedPersona> = new Map();
  public activePersonas: ParsedPersona[] = [];
  private sessionMemory: SessionMemory = {
    interactions: [],
    preferences: {},
    successfulPatterns: [],
    feedbackHistory: [],
    activationHistory: []
  };
  
  private collaborationMatrix: Map<string, CollaborationMatrixEntry> = new Map();

  constructor(configDir?: string) {
    this.configDir = configDir || path.join(__dirname, 'config');
    this.specialistsDir = path.join(__dirname, 'specialists');
    this.activationEngine = new PersonaActivationEngine();
  }

  /**
   * Initialize the persona manager with all components.
   * 
   * Sets up activation engine, loads configuration and persona definitions,
   * and initializes collaboration matrix for multi-persona workflows.
   * 
   * @returns Promise resolving to true if initialization succeeds, false otherwise
   * 
   * @example
   * ```typescript
   * const manager = new PersonaManager();
   * const success = await manager.initialize();
   * if (success) {
   *   console.log(`Loaded ${manager.personas.size} personas`);
   * }
   * ```
   * 
   * @category Core
   * @public
   */
  async initialize(): Promise<boolean> {
    try {
      // Initialize activation engine
      await this.activationEngine.initialize();
      
      // Load configuration
      await this.loadConfiguration();
      
      // Load persona definitions
      await this.loadPersonaDefinitions();
      
      // Initialize collaboration matrix
      this.initializeCollaborationMatrix();
      
      console.log(`Persona manager initialized with ${this.personas.size} personas`);
      return true;
    } catch (error) {
      console.error('Failed to initialize persona manager:', error);
      return false;
    }
  }

  /**
   * Load persona configuration
   */
  private async loadConfiguration(): Promise<void> {
    const configPath = path.join(this.configDir, 'personas-config.json');
    const configContent = await fs.readFile(configPath, 'utf8');
    this.config = JSON.parse(configContent);
  }

  /**
   * Load all persona definitions from markdown files
   */
  private async loadPersonaDefinitions(): Promise<void> {
    const files = await fs.readdir(this.specialistsDir);
    
    for (const file of files) {
      if (path.extname(file) === '.md') {
        const personaName = path.basename(file, '.md');
        const personaPath = path.join(this.specialistsDir, file);
        const personaContent = await fs.readFile(personaPath, 'utf8');
        
        // Parse persona markdown content
        const persona = this.parsePersonaDefinition(personaName, personaContent);
        this.personas.set(personaName, persona);
      }
    }
  }

  /**
   * Parse persona definition from markdown content
   */
  private parsePersonaDefinition(name: string, content: string): ParsedPersona {
    const config = this.config.personas?.[name] || {};
    
    return {
      name,
      content,
      category: config.category || 'unknown',
      description: config.description || '',
      specializations: config.specializations || [],
      auto_activation: config.auto_activation || {},
      compatible_with: config.compatible_with || [],
      priority_hierarchy: config.priority_hierarchy || [],
      isActive: false,
      activationReason: null,
      confidence: 0
    };
  }

  /**
   * Initialize collaboration patterns between personas
   */
  private initializeCollaborationMatrix(): void {
    const patterns = this.config.collaboration_patterns || {};
    
    for (const [pattern, description] of Object.entries(patterns)) {
      const [persona1, persona2] = pattern.split('_');
      if (persona1 && persona2) {
        this.collaborationMatrix.set(`${persona1}-${persona2}`, {
          description: String(description),
          synergy: 'positive',
          leadPersona: persona1
        });
        // Add reverse mapping
        this.collaborationMatrix.set(`${persona2}-${persona1}`, {
          description: String(description),
          synergy: 'positive',
          leadPersona: persona1
        });
      }
    }
  }

  /**
   * Select appropriate personas for a given context.
   * 
   * This is the main persona selection method that handles both manual and automatic
   * persona activation. It first checks for manual overrides in the user input,
   * then falls back to automatic detection via the activation engine.
   * 
   * @param userInput - The user's input string, may contain persona flags
   * @param context - Additional context for persona selection
   * @returns Promise resolving to persona activation result
   * 
   * @example
   * ```typescript
   * // Automatic selection
   * const result = await manager.selectPersonas(
   *   "Review this security vulnerability",
   *   { files: ["auth.ts"], command: "review" }
   * );
   * 
   * // Manual override
   * const result = await manager.selectPersonas(
   *   "Help me --persona-security --persona-architect"
   * );
   * ```
   * 
   * @category Core
   * @public
   */
  async selectPersonas(userInput: string, context: Partial<InputContext> = {}): Promise<PersonaActivationResult> {
    // Check for manual overrides first
    const manualOverrides = this.parseManualOverrides(userInput);
    if (manualOverrides.length > 0) {
      return this.activateManualPersonas(manualOverrides, userInput, context);
    }

    // Use automatic detection
    const detectionResults = await this.activationEngine.detectPersonas(userInput, context);
    
    if (detectionResults.recommendations.length === 0) {
      return {
        activePersonas: [],
        reasoning: 'No personas met confidence threshold',
        detectionResults,
        fallbackMode: true
      };
    }

    // Activate recommended personas
    return this.activateRecommendedPersonas(detectionResults, userInput, context);
  }

  /**
   * Parse manual persona overrides from user input
   */
  private parseManualOverrides(userInput: string): string[] {
    const overrides: string[] = [];
    const input = userInput.toLowerCase();
    
    // Look for --persona-[name] flags
    for (const personaName of this.personas.keys()) {
      if (input.includes(`--persona-${personaName}`) || input.includes(`--${personaName}`)) {
        overrides.push(personaName);
      }
    }

    return overrides;
  }

  /**
   * Activate manually specified personas
   */
  activateManualPersonas(
    personaNames: string[], 
    userInput: string, 
    context: Partial<InputContext>
  ): PersonaActivationResult {
    const activePersonas: ActivePersona[] = [];
    
    for (const name of personaNames) {
      const persona = this.personas.get(name);
      if (persona) {
        persona.isActive = true;
        persona.activationReason = 'manual_override';
        persona.confidence = 1.0;
        
        activePersonas.push({
          name: persona.name,
          confidence: persona.confidence,
          activationReason: 'manual',
          reasoning: 'Manually activated by user',
          category: persona.category,
          specializations: persona.specializations
        });
      }
    }

    this.activePersonas = activePersonas.map(ap => {
      const persona = this.personas.get(ap.name)!;
      return { ...persona, ...ap };
    });
    
    // Record usage
    this.recordInteraction({
      input: userInput,
      personas: activePersonas.map(p => p.name),
      activationType: 'manual',
      context: context || {}
    });

    return {
      activePersonas,
      reasoning: `Manually activated: ${personaNames.join(', ')}`,
      detectionResults: null,
      manualMode: true,
      collaboration: this.planCollaboration(activePersonas)
    };
  }

  /**
   * Activate recommended personas from detection engine
   */
  private activateRecommendedPersonas(
    detectionResults: DetectionResults, 
    userInput: string, 
    context: Partial<InputContext>
  ): PersonaActivationResult {
    const activePersonas: ActivePersona[] = [];
    
    for (const recommendation of detectionResults.recommendations) {
      const persona = this.personas.get(recommendation.persona);
      if (persona) {
        persona.isActive = true;
        persona.activationReason = 'automatic';
        persona.confidence = recommendation.confidence;
        persona.reasoning = recommendation.reasoning;
        
        activePersonas.push({
          name: persona.name,
          confidence: recommendation.confidence,
          activationReason: 'automatic',
          reasoning: recommendation.reasoning,
          category: persona.category,
          specializations: persona.specializations
        });
      }
    }

    this.activePersonas = activePersonas.map(ap => {
      const persona = this.personas.get(ap.name)!;
      return { ...persona, ...ap };
    });

    // Record usage
    this.recordInteraction({
      input: userInput,
      personas: activePersonas.map(p => p.name),
      activationType: 'automatic',
      confidence: detectionResults.recommendations.map(r => r.confidence),
      context: context || {}
    });

    return {
      activePersonas,
      reasoning: this.generateActivationSummary(activePersonas),
      detectionResults,
      automaticMode: true,
      collaboration: this.planCollaboration(activePersonas)
    };
  }

  /**
   * Plan collaboration between active personas
   */
  planCollaboration(activePersonas: ActivePersona[]): CollaborationPlan {
    if (activePersonas.length <= 1) {
      return {
        strategy: 'single_persona',
        leadPersona: activePersonas[0]?.name || null,
        consultingPersonas: [],
        collaborationPatterns: [],
        validationChain: []
      };
    }

    // Determine lead persona (highest confidence or specific rules)
    const leadPersona = this.determineLead(activePersonas);
    
    // Find collaboration patterns
    const collaborationPatterns: CollaborationPattern[] = [];
    for (let i = 0; i < activePersonas.length; i++) {
      for (let j = i + 1; j < activePersonas.length; j++) {
        const pattern = this.getCollaborationPattern(
          activePersonas[i].name, 
          activePersonas[j].name
        );
        if (pattern) {
          collaborationPatterns.push({
            personas: [activePersonas[i].name, activePersonas[j].name],
            description: pattern.description,
            synergy: pattern.synergy,
            leadPersona: pattern.leadPersona
          });
        }
      }
    }

    return {
      strategy: 'multi_persona',
      leadPersona: leadPersona.name,
      consultingPersonas: activePersonas.filter(p => p !== leadPersona).map(p => p.name),
      collaborationPatterns,
      validationChain: this.planValidationChain(activePersonas)
    };
  }

  /**
   * Determine lead persona based on confidence and domain rules
   */
  determineLead(activePersonas: ActivePersona[]): ActivePersona {
    if (activePersonas.length === 0) {
      throw new Error('Cannot determine lead persona from empty array');
    }

    // Priority rules for lead persona
    const leadPriority: Record<string, number> = {
      'security': 10,    // Security always leads when involved
      'architect': 9,    // Architecture has high priority for system changes
      'analyzer': 8,     // Analysis leads for investigation tasks
      'qa': 7,          // Quality assurance for testing contexts
      'performance': 6,  // Performance for optimization tasks
      'backend': 5,
      'frontend': 5,
      'devops': 5,
      'refactorer': 4,
      'mentor': 3,
      'scribe': 2
    };

    return activePersonas.reduce((lead, current) => {
      const leadScore = (leadPriority[lead.name] || 0) + (lead.confidence * 2);
      const currentScore = (leadPriority[current.name] || 0) + (current.confidence * 2);
      return currentScore > leadScore ? current : lead;
    });
  }

  /**
   * Get collaboration pattern between two personas
   */
  private getCollaborationPattern(persona1: string, persona2: string): CollaborationMatrixEntry | undefined {
    const key1 = `${persona1}-${persona2}`;
    const key2 = `${persona2}-${persona1}`;
    return this.collaborationMatrix.get(key1) || this.collaborationMatrix.get(key2);
  }

  /**
   * Plan validation chain based on active personas
   */
  private planValidationChain(activePersonas: ActivePersona[]): ValidationStep[] {
    const validationConfig = this.config.validation_chain || {};
    const activeNames = activePersonas.map(p => p.name);
    const validationSteps: ValidationStep[] = [];

    // Security validation
    if (validationConfig.security_validation?.some((p: string) => activeNames.includes(p))) {
      validationSteps.push({
        type: 'security',
        personas: validationConfig.security_validation.filter((p: string) => activeNames.includes(p)),
        description: 'Security review and threat assessment'
      });
    }

    // Quality validation
    if (validationConfig.quality_validation?.some((p: string) => activeNames.includes(p))) {
      validationSteps.push({
        type: 'quality',
        personas: validationConfig.quality_validation.filter((p: string) => activeNames.includes(p)),
        description: 'Code quality and maintainability review'
      });
    }

    // Performance validation
    if (validationConfig.performance_validation?.some((p: string) => activeNames.includes(p))) {
      validationSteps.push({
        type: 'performance',
        personas: validationConfig.performance_validation.filter((p: string) => activeNames.includes(p)),
        description: 'Performance impact assessment'
      });
    }

    return validationSteps;
  }

  /**
   * Generate human-readable activation summary
   */
  private generateActivationSummary(activePersonas: ActivePersona[]): string {
    if (activePersonas.length === 0) return 'No personas activated';
    
    if (activePersonas.length === 1) {
      const persona = activePersonas[0];
      return `Activated ${persona.name} persona (${Math.round(persona.confidence * 100)}% confidence): ${persona.reasoning}`;
    }

    const lead = this.determineLead(activePersonas);
    const supporting = activePersonas.filter(p => p !== lead);
    
    return `Multi-persona activation: ${lead.name} leading (${Math.round(lead.confidence * 100)}%), supported by ${supporting.map(p => p.name).join(', ')}`;
  }

  /**
   * Generate persona-aware prompt for Claude Code.
   * 
   * Creates a system prompt that incorporates active persona content and
   * collaboration instructions. Handles both single-persona and multi-persona
   * collaboration modes with appropriate context integration.
   * 
   * @param activePersonas - Currently active personas
   * @param userInput - The user's original input
   * @param context - Additional context for prompt generation
   * @returns Generated prompt with persona content and collaboration plan
   * 
   * @example
   * ```typescript
   * const prompt = manager.generatePersonaPrompt(
   *   [{ name: "security", confidence: 0.9, ... }],
   *   "Review this code",
   *   { files: ["auth.ts"] }
   * );
   * 
   * console.log(prompt.systemPrompt); // Contains persona instructions
   * ```
   * 
   * @category Core
   * @public
   */
  generatePersonaPrompt(
    activePersonas: ActivePersona[], 
    userInput: string, 
    context: Partial<InputContext> = {}
  ): GeneratedPrompt {
    if (activePersonas.length === 0) {
      return {
        systemPrompt: '',
        personaContext: null,
        collaboration: null
      };
    }

    let systemPrompt = '';
    
    if (activePersonas.length === 1) {
      // Single persona mode
      const persona = activePersonas[0];
      const personaContent = this.personas.get(persona.name)?.content || '';
      systemPrompt = `You are now operating as the **${persona.name} persona** for Claude Buddy.\n\n${personaContent}`;
    } else {
      // Multi-persona collaboration mode
      const collaboration = this.planCollaboration(activePersonas);
      const lead = activePersonas.find(p => p.name === collaboration.leadPersona);
      const supporting = activePersonas.filter(p => p.name !== collaboration.leadPersona);

      if (lead) {
        const leadContent = this.personas.get(lead.name)?.content || '';
        systemPrompt = `You are operating in **multi-persona collaboration mode** for Claude Buddy.\n\n`;
        systemPrompt += `**Lead Persona: ${lead.name}**\n${leadContent}\n\n`;
        systemPrompt += `**Supporting Personas:**\n`;
        
        for (const persona of supporting) {
          const personaConfig = this.personas.get(persona.name);
          systemPrompt += `- **${persona.name}**: Focus on ${personaConfig?.description || 'specialized tasks'}\n`;
        }

        systemPrompt += `\n**Collaboration Strategy:**\n`;
        systemPrompt += `- ${lead.name} leads the response and decision-making\n`;
        systemPrompt += `- Supporting personas provide specialized input and validation\n`;
        
        if (collaboration.collaborationPatterns && collaboration.collaborationPatterns.length > 0) {
          systemPrompt += `- Known collaboration patterns: ${collaboration.collaborationPatterns.map(p => p.description).join('; ')}\n`;
        }
      }
    }

    const personaContext: PersonaContext = {
      active: activePersonas.map(p => ({
        name: p.name,
        confidence: p.confidence,
        role: p.name === this.determineLead(activePersonas).name ? 'lead' : 'supporting'
      })),
      collaboration: this.planCollaboration(activePersonas)
    };

    return {
      systemPrompt,
      personaContext,
      collaboration: this.planCollaboration(activePersonas),
      userInput,
      context
    };
  }

  /**
   * Record interaction for learning and improvement
   */
  private recordInteraction(interaction: Partial<PersonaInteraction>): void {
    const fullInteraction: PersonaInteraction = {
      input: interaction.input || '',
      personas: interaction.personas || [],
      activationType: interaction.activationType || 'automatic',
      confidence: Array.isArray(interaction.confidence) ? interaction.confidence : (interaction.confidence ? [interaction.confidence] : []),
      context: interaction.context || {},
      timestamp: new Date().toISOString()
    };
    
    this.sessionMemory.interactions.push(fullInteraction);
    
    // Keep only recent interactions
    if (this.sessionMemory.interactions.length > 100) {
      this.sessionMemory.interactions = this.sessionMemory.interactions.slice(-100);
    }

    // Update activation engine
    this.activationEngine.recordPersonaUsage(fullInteraction.personas);
  }

  /**
   * Get current session ID (simple implementation)
   */
  private getSessionId(): string {
    // In a real implementation, this would be more sophisticated
    return Date.now().toString();
  }

  /**
   * Provide feedback on persona performance for learning and improvement.
   * 
   * Records feedback in session memory and updates the activation engine
   * with performance data. Positive feedback (rating >= 4) creates successful
   * patterns for future learning and recommendation improvements.
   * 
   * @param feedback - Feedback object with personas, rating, and optional comments
   * 
   * @example
   * ```typescript
   * manager.provideFeedback({
   *   personas: ["security", "architect"],
   *   rating: 5,
   *   comments: "Excellent security analysis and architecture recommendations",
   *   context: { command: "review" }
   * });
   * ```
   * 
   * @category Learning
   * @public
   */
  provideFeedback(feedback: PersonaFeedback): void {
    const { personas, rating, comments, context } = feedback;
    
    // Record feedback in session memory
    const feedbackRecord: FeedbackRecord = {
      type: 'feedback',
      personas,
      rating,
      comments: comments || '',
      context: context || {},
      timestamp: Date.now()
    };
    
    this.sessionMemory.feedbackHistory.push(feedbackRecord);

    // Update activation engine with feedback
    const feedbackType = rating >= 4 ? 'positive' : rating <= 2 ? 'negative' : 'neutral';
    this.activationEngine.recordPersonaUsage(personas, feedbackType);

    // Learn from successful patterns
    if (rating >= 4) {
      const successfulPattern: SuccessfulPattern = {
        personas,
        context,
        timestamp: Date.now()
      };
      this.sessionMemory.successfulPatterns.push(successfulPattern);
    }
  }

  /**
   * Get analytics and insights about persona usage.
   * 
   * Provides comprehensive statistics about persona activation patterns,
   * collaboration effectiveness, confidence levels, and successful patterns.
   * Used for monitoring system performance and optimization insights.
   * 
   * @returns Analytics object with usage statistics and insights
   * 
   * @example
   * ```typescript
   * const analytics = manager.getAnalytics();
   * console.log(`Total interactions: ${analytics.totalInteractions}`);
   * console.log(`Average confidence: ${analytics.averageConfidence}`);
   * console.log(`Top persona: ${Object.keys(analytics.personaUsage)[0]}`);
   * ```
   * 
   * @category Analytics
   * @public
   */
  getAnalytics(): PersonaManagerAnalytics {
    const interactions = this.sessionMemory.interactions;
    const analytics: PersonaManagerAnalytics = {
      totalInteractions: interactions.length,
      personaUsage: {},
      collaborationPatterns: {},
      averageConfidence: 0,
      successfulPatterns: this.sessionMemory.successfulPatterns.length
    };

    // Calculate persona usage statistics
    for (const interaction of interactions) {
      if (interaction.personas) {
        for (const persona of interaction.personas) {
          if (!analytics.personaUsage[persona]) {
            analytics.personaUsage[persona] = { count: 0, totalConfidence: 0 };
          }
          analytics.personaUsage[persona].count++;
          
          if (interaction.confidence && interaction.confidence.length > 0) {
            const confidence = interaction.confidence[0];
            analytics.personaUsage[persona].totalConfidence += confidence;
          }
        }

        // Track collaboration patterns
        if (interaction.personas.length > 1) {
          const pattern = interaction.personas.sort().join('-');
          analytics.collaborationPatterns[pattern] = 
            (analytics.collaborationPatterns[pattern] || 0) + 1;
        }
      }
    }

    // Calculate average confidence
    const confidenceSum = interactions
      .filter(i => i.confidence && i.confidence.length > 0)
      .reduce((sum, i) => {
        const confidence = i.confidence[0];
        return sum + confidence;
      }, 0);
    const confidenceCount = interactions.filter(i => i.confidence && i.confidence.length > 0).length;
    analytics.averageConfidence = confidenceCount > 0 ? confidenceSum / confidenceCount : 0;

    return analytics;
  }

  /**
   * Reset active personas (for new conversation/session)
   */
  reset(): void {
    this.activePersonas.forEach(persona => {
      persona.isActive = false;
      persona.activationReason = null;
      persona.confidence = 0;
    });
    this.activePersonas = [];
  }

  /**
   * Get current active personas
   */
  getActivePersonas(): ActivePersona[] {
    return this.activePersonas.map(p => ({
      name: p.name,
      confidence: p.confidence,
      activationReason: (p.activationReason === 'manual_override' ? 'manual' : 'automatic') as ActivationReason,
      reasoning: p.reasoning,
      category: p.category,
      specializations: p.specializations
    }));
  }

  /**
   * Check if specific persona is active
   */
  isPersonaActive(personaName: string): boolean {
    return this.activePersonas.some(p => p.name === personaName);
  }
}

export default PersonaManager;