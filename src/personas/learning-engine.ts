/**
 * Learning Engine for Persona System
 * 
 * Implements context memory, pattern recognition, and adaptive improvements
 * for the persona activation and collaboration system.
 */

import { promises as fs } from 'fs';
import path from 'path';

import type {
  PersonaFeedback,
  LearningAnalytics,
  FeedbackRecord
} from '../types/personas.js';

import type {
  LearningRecommendations,
  LearningAdaptation,
  InputContext
} from '../types/context.js';

/**
 * Activation data for learning system
 * @category Learning Engine
 */
export interface ActivationData {
  userInput: string;
  command?: string | undefined;
  personas: string[];
  collaborationPattern?: string | undefined;
  confidence?: number | number[] | undefined;
  activationType: 'manual' | 'automatic';
  projectType?: string | undefined;
  filePatterns?: string[] | undefined;
  learningRecommendations?: LearningRecommendations | undefined;
}

interface InteractionRecord {
  sessionId: string;
  timestamp: number;
  type: 'activation';
  context: CapturedContext;
  userInput: string;
  command?: string;
  personas: string[];
  collaborationPattern?: string;
  confidence?: number | number[];
  activationType: 'manual' | 'automatic';
  projectType?: string;
  filePatterns?: string[];
  learningRecommendations?: LearningRecommendations;
}


interface CapturedContext {
  projectType?: string | undefined;
  filePatterns?: Record<string, number> | undefined;
  commandType?: string | undefined;
  userInput: string;
  activatedPersonas: string[];
  collaborationPattern?: string | undefined;
  confidence?: number | number[] | undefined;
}

interface SessionPattern {
  count: number;
  successCount: number;
  contexts: CapturedContext[];
  lastUsed: number;
  confidence: number;
}

interface SessionMemory {
  interactions: (InteractionRecord | FeedbackRecord)[];
  patterns: Map<string, SessionPattern>;
  feedback: FeedbackRecord[];
  adaptations: LearningAdaptation[];
  contextHistory: CapturedContext[];
}

interface SuccessfulPattern {
  pattern: string;
  context: CapturedContext;
  personas: string[];
  rating: number;
  comments: string;
  timestamp: number;
  reinforcementCount: number;
  averageRating: number;
  lastReinforced?: number;
}

interface FailedPattern {
  pattern: string;
  context: CapturedContext;
  personas: string[];
  rating: number;
  issues: string;
  timestamp: number;
}

interface AdaptationHistory {
  sessionId: string;
  duration: number;
  interactions: number;
  feedback: number;
  patterns: number;
  timestamp: number;
}

interface PersistentMemory {
  successfulPatterns: SuccessfulPattern[];
  failedPatterns: FailedPattern[];
  userPreferences: Record<string, unknown>;
  projectPatterns: Record<string, unknown>;
  adaptationHistory: AdaptationHistory[];
  performanceMetrics: Record<string, unknown>;
}

interface LearningConfig {
  maxSessionInteractions: number;
  maxPersistentPatterns: number;
  learningRate: number;
  confidenceThreshold: number;
  patternExpiryDays: number;
  adaptationEnabled: boolean;
}

interface PatternAdaptation {
  type: 'add_persona';
  persona: string;
  reason: string;
}

interface SystemRecommendation {
  type: 'improvement' | 'diversity';
  message: string;
  priority: 'low' | 'medium' | 'high';
}

interface TopPattern {
  pattern: string;
  usage: number;
  rating: number;
  personas: string[];
}

class PersonaLearningEngine {
  private dataDir: string;
  private memoryFile: string;
  private analyticsFile: string;
  
  private sessionMemory: SessionMemory;
  private persistentMemory: PersistentMemory;
  private config: LearningConfig;
  
  private sessionId!: string;
  private sessionStartTime!: number;

  constructor(dataDir?: string) {
    this.dataDir = dataDir || path.join(__dirname, '..', '.claude-buddy');
    this.memoryFile = path.join(this.dataDir, 'persona-memory.json');
    this.analyticsFile = path.join(this.dataDir, 'persona-analytics.json');
    
    // In-memory storage for current session
    this.sessionMemory = {
      interactions: [],
      patterns: new Map(),
      feedback: [],
      adaptations: [],
      contextHistory: []
    };
    
    // Persistent learning data
    this.persistentMemory = {
      successfulPatterns: [],
      failedPatterns: [],
      userPreferences: {},
      projectPatterns: {},
      adaptationHistory: [],
      performanceMetrics: {}
    };

    // Learning configuration
    this.config = {
      maxSessionInteractions: 100,
      maxPersistentPatterns: 500,
      learningRate: 0.1,
      confidenceThreshold: 0.8,
      patternExpiryDays: 30,
      adaptationEnabled: true
    };
  }

  /**
   * Initialize learning engine and load persistent data
   */
  async initialize(): Promise<boolean> {
    try {
      // Ensure data directory exists
      await fs.mkdir(this.dataDir, { recursive: true });
      
      // Load persistent memory
      await this.loadPersistentMemory();
      
      // Initialize session tracking
      this.sessionId = this.generateSessionId();
      this.sessionStartTime = Date.now();
      
      console.log('Learning engine initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize learning engine:', error);
      return false;
    }
  }

  /**
   * Load persistent memory from storage
   */
  private async loadPersistentMemory(): Promise<void> {
    try {
      const memoryContent = await fs.readFile(this.memoryFile, 'utf8');
      this.persistentMemory = JSON.parse(memoryContent);
      
      // Clean expired patterns
      this.cleanExpiredPatterns();
    } catch (error) {
      // File doesn't exist yet, use defaults
      console.log('No existing memory file found, starting with empty memory');
    }
  }

  /**
   * Save persistent memory to storage
   */
  private async savePersistentMemory(): Promise<void> {
    try {
      const memoryData = {
        ...this.persistentMemory,
        lastUpdated: Date.now(),
        version: '1.0.0'
      };
      
      await fs.writeFile(this.memoryFile, JSON.stringify(memoryData, null, 2));
    } catch (error) {
      console.error('Failed to save persistent memory:', error);
    }
  }

  /**
   * Record persona activation and context for learning improvement.
   * 
   * This method captures activation patterns, user context, and persona
   * selections to improve future recommendations through machine learning.
   * 
   * @param activationData - Complete activation context and results
   * 
   * @example
   * ```typescript
   * learningEngine.recordActivation({
   *   userInput: "Review security vulnerabilities",
   *   personas: ["security", "backend"],
   *   activationType: "automatic",
   *   confidence: [0.85, 0.72],
   *   projectType: "web-app",
   *   filePatterns: ["*.ts", "*.js"]
   * });
   * ```
   * 
   * @category Learning Engine
   * @public
   */
  recordActivation(activationData: ActivationData): void {
    const interaction: InteractionRecord = {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      type: 'activation',
      context: this.captureContext(activationData),
      ...activationData
    };

    this.sessionMemory.interactions.push(interaction);
    
    // Learn from activation patterns
    this.updateActivationPatterns(interaction);
    
    // Trim session memory if needed
    if (this.sessionMemory.interactions.length > this.config.maxSessionInteractions) {
      this.sessionMemory.interactions = this.sessionMemory.interactions.slice(-this.config.maxSessionInteractions);
    }
  }

  /**
   * Record user feedback for learning improvement
   */
  recordFeedback(feedbackData: PersonaFeedback): void {
    const feedback: any = {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      type: 'feedback',
      personas: feedbackData.personas,
      rating: feedbackData.rating,
      comments: feedbackData.comments || '',
      context: feedbackData.context || {}
    };

    this.sessionMemory.feedback.push(feedback);
    this.sessionMemory.interactions.push(feedback);
    
    // Learn from feedback patterns
    this.learnFromFeedback(feedback);
    
    // Update success/failure patterns
    this.updatePatternSuccessRates(feedback);
  }

  /**
   * Capture relevant context for learning
   */
  private captureContext(activationData: ActivationData): CapturedContext {
    return {
      projectType: activationData.projectType,
      filePatterns: this.normalizeFilePatterns(activationData.filePatterns),
      commandType: activationData.command,
      userInput: this.sanitizeUserInput(activationData.userInput),
      activatedPersonas: activationData.personas || [],
      collaborationPattern: activationData.collaborationPattern,
      confidence: activationData.confidence
    };
  }

  /**
   * Normalize file patterns for consistent processing
   */
  private normalizeFilePatterns(filePatterns?: string[]): Record<string, number> {
    if (!filePatterns) return {};
    
    const normalized: Record<string, number> = {
      frontend: 0,
      backend: 0,
      test: 0,
      config: 0,
      docs: 0
    };

    for (const pattern of filePatterns) {
      if (/\.(jsx?|tsx?|vue|svelte)$/i.test(pattern)) normalized.frontend++;
      if (/\.(py|java|php|rb|go|rs)$/i.test(pattern)) normalized.backend++;
      if (/\.(test|spec)\./i.test(pattern)) normalized.test++;
      if (/\.(json|yaml|yml|toml|ini)$/i.test(pattern)) normalized.config++;
      if (/\.(md|txt|rst)$/i.test(pattern)) normalized.docs++;
    }

    return normalized;
  }

  /**
   * Update activation patterns based on successful interactions
   */
  private updateActivationPatterns(interaction: InteractionRecord): void {
    const patternKey = this.generatePatternKey(interaction);
    
    if (!this.sessionMemory.patterns.has(patternKey)) {
      this.sessionMemory.patterns.set(patternKey, {
        count: 0,
        successCount: 0,
        contexts: [],
        lastUsed: Date.now(),
        confidence: 0
      });
    }

    const pattern = this.sessionMemory.patterns.get(patternKey)!;
    pattern.count++;
    pattern.lastUsed = Date.now();
    pattern.contexts.push(interaction.context);
    
    // Limit context history per pattern
    if (pattern.contexts.length > 10) {
      pattern.contexts = pattern.contexts.slice(-10);
    }
  }

  /**
   * Learn from user feedback to improve future activations
   */
  private learnFromFeedback(feedback: FeedbackRecord): void {
    const relatedInteractions = this.findRelatedInteractions(feedback);
    
    for (const interaction of relatedInteractions) {
      if (interaction.type === 'activation') {
        const patternKey = this.generatePatternKey(interaction);
        const pattern = this.sessionMemory.patterns.get(patternKey);
        
        if (pattern) {
          // Update success rate based on feedback
          if (feedback.rating >= 4) {
            pattern.successCount++;
            this.reinforceSuccessfulPattern(patternKey, interaction, feedback);
          } else if (feedback.rating <= 2) {
            this.recordFailedPattern(patternKey, interaction, feedback);
          }
          
          // Update confidence score
          pattern.confidence = pattern.successCount / pattern.count;
        }
      }
    }
  }

  /**
   * Find interactions related to feedback
   */
  private findRelatedInteractions(feedback: FeedbackRecord): InteractionRecord[] {
    const timeWindow = 5 * 60 * 1000; // 5 minutes
    const feedbackTime = feedback.timestamp;
    
    return this.sessionMemory.interactions.filter((interaction): interaction is InteractionRecord => {
      return Math.abs(interaction.timestamp - feedbackTime) <= timeWindow &&
             interaction.type === 'activation';
    });
  }

  /**
   * Reinforce successful activation patterns
   */
  private reinforceSuccessfulPattern(patternKey: string, interaction: InteractionRecord, feedback: FeedbackRecord): void {
    const successPattern: SuccessfulPattern = {
      pattern: patternKey,
      context: interaction.context,
      personas: interaction.personas,
      rating: feedback.rating,
      comments: feedback.comments || '',
      timestamp: Date.now(),
      reinforcementCount: 1,
      averageRating: feedback.rating
    };

    // Check if pattern already exists
    const existingPattern = this.persistentMemory.successfulPatterns.find(
      p => p.pattern === patternKey
    );

    if (existingPattern) {
      existingPattern.reinforcementCount++;
      existingPattern.lastReinforced = Date.now();
      existingPattern.averageRating = (existingPattern.averageRating + feedback.rating) / 2;
    } else {
      this.persistentMemory.successfulPatterns.push(successPattern);
    }

    // Trim if we have too many patterns
    if (this.persistentMemory.successfulPatterns.length > this.config.maxPersistentPatterns) {
      this.persistentMemory.successfulPatterns.sort((a, b) => b.reinforcementCount - a.reinforcementCount);
      this.persistentMemory.successfulPatterns = this.persistentMemory.successfulPatterns.slice(0, this.config.maxPersistentPatterns);
    }
  }

  /**
   * Record failed activation patterns to avoid in future
   */
  private recordFailedPattern(patternKey: string, interaction: InteractionRecord, feedback: FeedbackRecord): void {
    const failedPattern: FailedPattern = {
      pattern: patternKey,
      context: interaction.context,
      personas: interaction.personas,
      rating: feedback.rating,
      issues: feedback.comments || '',
      timestamp: Date.now()
    };

    this.persistentMemory.failedPatterns.push(failedPattern);

    // Trim if we have too many failed patterns
    if (this.persistentMemory.failedPatterns.length > this.config.maxPersistentPatterns / 2) {
      this.persistentMemory.failedPatterns = this.persistentMemory.failedPatterns.slice(-250);
    }
  }

  /**
   * Generate pattern key for learning
   */
  private generatePatternKey(interaction: InteractionRecord): string {
    const context = interaction.context;
    const key = [
      context.projectType || 'unknown',
      context.commandType || 'unknown',
      (context.activatedPersonas || []).sort().join(','),
      this.categorizeFilePatterns(context.filePatterns)
    ].join('|');

    return key;
  }

  /**
   * Categorize file patterns for pattern matching
   */
  private categorizeFilePatterns(filePatterns?: Record<string, number>): string {
    if (!filePatterns) return 'none';
    
    const categories: string[] = [];
    if (filePatterns.frontend > 10) categories.push('frontend');
    if (filePatterns.backend > 10) categories.push('backend');
    if (filePatterns.test > 5) categories.push('test');
    if (filePatterns.config > 5) categories.push('config');
    if (filePatterns.docs > 3) categories.push('docs');
    
    return categories.length > 0 ? categories.sort().join(',') : 'general';
  }

  /**
   * Get activation recommendations based on learned patterns
   */
  getActivationRecommendations(context: Partial<InputContext>): LearningRecommendations {
    const recommendations: LearningRecommendations = {
      personas: [],
      confidence: 0,
      reasoning: [],
      patterns: [],
      adaptations: []
    };

    // Find matching successful patterns
    const matchingPatterns = this.findMatchingPatterns(context);
    
    if (matchingPatterns.length > 0) {
      // Sort by reinforcement count and confidence
      matchingPatterns.sort((a, b) => {
        return (b.reinforcementCount * b.averageRating) - (a.reinforcementCount * a.averageRating);
      });

      const bestPattern = matchingPatterns[0];
      recommendations.personas = bestPattern.personas || [];
      recommendations.confidence = bestPattern.averageRating / 5; // Convert to 0-1 scale
      recommendations.reasoning.push(`Learned pattern: ${bestPattern.reinforcementCount} successful uses`);
      recommendations.patterns.push(bestPattern.pattern);
      
      // Check for adaptations
      const adaptations = this.suggestAdaptations(context, bestPattern);
      recommendations.adaptations = adaptations;
    }

    // Check for anti-patterns (failed patterns to avoid)
    const antiPatterns = this.findAntiPatterns(context);
    if (antiPatterns.length > 0) {
      recommendations.reasoning.push(`Avoiding ${antiPatterns.length} known unsuccessful patterns`);
    }

    return recommendations;
  }

  /**
   * Find successful patterns matching current context
   */
  private findMatchingPatterns(context: Partial<InputContext>): SuccessfulPattern[] {
    return this.persistentMemory.successfulPatterns.filter(pattern => {
      return this.contextMatches(pattern.context, context);
    });
  }

  /**
   * Find anti-patterns (failed patterns) to avoid
   */
  private findAntiPatterns(context: Partial<InputContext>): FailedPattern[] {
    return this.persistentMemory.failedPatterns.filter(pattern => {
      return this.contextMatches(pattern.context, context);
    });
  }

  /**
   * Check if contexts match for pattern recognition
   */
  private contextMatches(patternContext: CapturedContext, currentContext: Partial<InputContext>): boolean {
    // Simple context matching - could be enhanced with fuzzy matching
    const projectTypeMatch = patternContext.projectType === currentContext.projectType;
    const commandMatch = patternContext.commandType === currentContext.command;
    
    // File pattern similarity
    const normalizedCurrentFiles = this.normalizeFilePatterns(currentContext.files);
    const filePatternSimilarity = this.calculateFilePatternSimilarity(
      patternContext.filePatterns, 
      normalizedCurrentFiles
    );

    return projectTypeMatch && commandMatch && filePatternSimilarity > 0.7;
  }

  /**
   * Calculate similarity between file patterns
   */
  private calculateFilePatternSimilarity(pattern1?: Record<string, number>, pattern2?: Record<string, number>): number {
    if (!pattern1 || !pattern2) return 0;
    
    const keys = ['frontend', 'backend', 'test', 'config', 'docs'];
    let similarity = 0;
    
    for (const key of keys) {
      const val1 = pattern1[key] || 0;
      const val2 = pattern2[key] || 0;
      const maxVal = Math.max(val1, val2, 1); // Avoid division by zero
      similarity += 1 - Math.abs(val1 - val2) / maxVal;
    }
    
    return similarity / keys.length;
  }

  /**
   * Suggest adaptations based on learned patterns and current context
   */
  private suggestAdaptations(context: Partial<InputContext>, bestPattern: SuccessfulPattern): LearningAdaptation[] {
    const adaptations: LearningAdaptation[] = [];
    
    // Suggest additional personas based on context differences
    const normalizedCurrentFiles = this.normalizeFilePatterns(context.files);
    if (normalizedCurrentFiles && bestPattern.context.filePatterns) {
      const contextFiles = normalizedCurrentFiles;
      const patternFiles = bestPattern.context.filePatterns;
      
      // Suggest frontend persona if more frontend files than pattern
      if (contextFiles.frontend > patternFiles.frontend + 5) {
        adaptations.push({
          type: 'persona_selection',
          reason: 'More frontend files detected than in learned pattern',
          impact: 0.3,
          confidence: 0.7
        });
      }
      
      // Suggest security persona if security-related files detected
      if (contextFiles.config > patternFiles.config + 3) {
        adaptations.push({
          type: 'persona_selection',
          reason: 'Additional configuration files may need security review',
          impact: 0.4,
          confidence: 0.8
        });
      }
    }
    
    return adaptations;
  }

  /**
   * Clean expired patterns from memory
   */
  private cleanExpiredPatterns(): void {
    const expiryTime = Date.now() - (this.config.patternExpiryDays * 24 * 60 * 60 * 1000);
    
    this.persistentMemory.successfulPatterns = this.persistentMemory.successfulPatterns.filter(
      pattern => pattern.timestamp > expiryTime
    );
    
    this.persistentMemory.failedPatterns = this.persistentMemory.failedPatterns.filter(
      pattern => pattern.timestamp > expiryTime
    );
  }

  /**
   * Update pattern success rates based on feedback
   */
  private updatePatternSuccessRates(feedback: FeedbackRecord): void {
    // This is handled in learnFromFeedback, but could be expanded
    // for more sophisticated success rate calculations
  }

  /**
   * Sanitize user input for safe storage
   */
  private sanitizeUserInput(userInput: string): string {
    if (!userInput) return '';
    
    // Remove sensitive information patterns
    return userInput
      .replace(/--?[a-zA-Z-]+=["']?[^"'\s]*["']?/g, '[FLAG]') // Remove flags with values
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]') // Remove emails
      .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP]') // Remove IP addresses
      .substring(0, 200); // Limit length
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get comprehensive learning analytics and performance insights.
   * 
   * Provides detailed metrics about learning system performance, including
   * session statistics, persistent learning data, effectiveness scores,
   * top performing patterns, and system optimization recommendations.
   * 
   * @returns Complete learning analytics with performance metrics
   * 
   * @example
   * ```typescript
   * const analytics = learningEngine.getAnalytics();
   * 
   * console.log('Session interactions:', analytics.sessionStats.interactions);
   * console.log('Learning effectiveness:', analytics.learningEffectiveness);
   * console.log('Top patterns:', analytics.topPatterns.slice(0, 3));
   * 
   * // Act on recommendations
   * analytics.recommendations.forEach(rec => {
   *   if (rec.priority === 'high') {
   *     console.log('Priority recommendation:', rec.message);
   *   }
   * });
   * ```
   * 
   * @category Learning Engine
   * @public
   */
  getAnalytics(): LearningAnalytics {
    return {
      sessionStats: {
        interactions: this.sessionMemory.interactions.length,
        feedback: this.sessionMemory.feedback.length,
        patterns: this.sessionMemory.patterns.size,
        sessionDuration: Date.now() - this.sessionStartTime
      },
      persistentStats: {
        successfulPatterns: this.persistentMemory.successfulPatterns.length,
        failedPatterns: this.persistentMemory.failedPatterns.length,
        totalLearningEvents: this.persistentMemory.adaptationHistory.length
      },
      learningEffectiveness: this.calculateLearningEffectiveness(),
      topPatterns: this.getTopPatterns(),
      recommendations: this.getSystemRecommendations()
    };
  }

  /**
   * Calculate learning effectiveness metrics
   */
  private calculateLearningEffectiveness(): number {
    const recentFeedback = this.sessionMemory.feedback.filter(
      f => f.timestamp > Date.now() - (7 * 24 * 60 * 60 * 1000) // Last 7 days
    );

    if (recentFeedback.length === 0) return 0;

    const averageRating = recentFeedback.reduce((sum, f) => sum + f.rating, 0) / recentFeedback.length;
    return averageRating / 5; // Convert to 0-1 scale
  }

  /**
   * Get top performing patterns
   */
  private getTopPatterns(): TopPattern[] {
    return this.persistentMemory.successfulPatterns
      .sort((a, b) => (b.reinforcementCount * b.averageRating) - (a.reinforcementCount * a.averageRating))
      .slice(0, 10)
      .map(pattern => ({
        pattern: pattern.pattern,
        usage: pattern.reinforcementCount,
        rating: pattern.averageRating,
        personas: pattern.personas
      }));
  }

  /**
   * Get system recommendations for improvement
   */
  private getSystemRecommendations(): SystemRecommendation[] {
    const recommendations: SystemRecommendation[] = [];
    
    // Check if learning is effective
    const effectiveness = this.calculateLearningEffectiveness();
    if (effectiveness < 0.6) {
      recommendations.push({
        type: 'improvement',
        message: 'Learning effectiveness is low. Consider providing more feedback.',
        priority: 'medium'
      });
    }

    // Check for pattern diversity
    const uniquePatterns = new Set(this.persistentMemory.successfulPatterns.map(p => p.pattern));
    if (uniquePatterns.size < 5) {
      recommendations.push({
        type: 'diversity',
        message: 'Limited pattern diversity detected. Try using different commands and contexts.',
        priority: 'low'
      });
    }

    return recommendations;
  }

  /**
   * End session and save learning data
   */
  async endSession(): Promise<void> {
    // Save session data to persistent memory
    this.persistentMemory.adaptationHistory.push({
      sessionId: this.sessionId,
      duration: Date.now() - this.sessionStartTime,
      interactions: this.sessionMemory.interactions.length,
      feedback: this.sessionMemory.feedback.length,
      patterns: this.sessionMemory.patterns.size,
      timestamp: Date.now()
    });

    // Save to storage
    await this.savePersistentMemory();
    
    // Clear session memory
    this.sessionMemory = {
      interactions: [],
      patterns: new Map(),
      feedback: [],
      adaptations: [],
      contextHistory: []
    };
  }
}

export default PersonaLearningEngine;