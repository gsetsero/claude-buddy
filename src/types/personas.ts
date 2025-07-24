/**
 * Type definitions for the Persona System
 */

/**
 * Persona categories
 */
export type PersonaCategory = 'technical' | 'process' | 'knowledge';

/**
 * Persona activation reasons
 */
export type ActivationReason = 'manual' | 'automatic';

/**
 * Collaboration strategies
 */
export type CollaborationStrategy = 
  | 'single_persona' 
  | 'multi_persona' 
  | 'comprehensive'
  | 'isolated'
  | 'collaborative'
  | 'manual_selection'
  | 'focus_driven';

/**
 * Auto-activation configuration for a persona
 */
export interface AutoActivationConfig {
  keywords: string[];
  file_patterns: string[];
  confidence_threshold: number;
}

/**
 * Core persona configuration interface
 */
export interface PersonaConfig {
  category: PersonaCategory;
  description: string;
  specializations: string[];
  auto_activation: AutoActivationConfig;
  compatible_with: string[];
  priority_hierarchy: string[];
}

/**
 * Active persona instance with runtime state
 */
export interface ActivePersona {
  name: string;
  confidence: number;
  activationReason: ActivationReason;
  reasoning?: string;
  category: PersonaCategory;
  specializations: string[];
}

/**
 * Collaboration pattern between personas
 */
export interface CollaborationPattern {
  personas: string[];
  description: string;
  synergy: 'positive' | 'neutral' | 'negative';
  leadPersona: string;
}

/**
 * Validation step in persona validation chain
 */
export interface ValidationStep {
  type: 'security' | 'quality' | 'performance';
  personas: string[];
  description: string;
}

/**
 * Collaboration plan for multiple personas
 */
export interface CollaborationPlan {
  strategy: CollaborationStrategy;
  leadPersona: string | null;
  consultingPersonas?: string[];
  collaborationPatterns?: CollaborationPattern[];
  validationChain?: ValidationStep[];
}

/**
 * Detection results from auto-activation engine
 */
export interface DetectionResults {
  recommendations: PersonaRecommendation[];
  sessionContext: unknown;
  analysisDetails: unknown;
}

/**
 * Individual persona recommendation
 */
export interface PersonaRecommendation {
  persona: string;
  confidence: number;
  reasoning: string;
  breakdown: {
    keyword_matching: number;
    context_analysis: number;
    file_patterns: number;
    user_history: number;
  };
}

/**
 * Result of persona activation process
 */
export interface PersonaActivationResult {
  activePersonas: ActivePersona[];
  reasoning: string;
  detectionResults?: DetectionResults | null;
  manualMode?: boolean;
  automaticMode?: boolean;
  fallbackMode?: boolean;
  collaboration?: CollaborationPlan;
}

/**
 * Session memory for learning and adaptation
 */
export interface SessionMemory {
  interactions: PersonaInteraction[];
  preferences: Record<string, unknown>;
  successfulPatterns: SuccessfulPattern[];
  feedbackHistory: FeedbackRecord[];
  activationHistory: ActivationHistory[];
  lastAnalysis?: Date;
}

/**
 * Individual persona interaction record
 */
export interface PersonaInteraction {
  input: string;
  personas: string[];
  activationType: ActivationReason;
  confidence: number[];
  context: Record<string, unknown>;
  timestamp?: string;
}

/**
 * Persona feedback for learning system
 */
export interface PersonaFeedback {
  personas: string[];
  rating: number;
  comments?: string;
  effectiveness?: number;
  timestamp?: string;
  context?: Record<string, unknown>;
}

/**
 * Successful pattern record for learning
 */
export interface SuccessfulPattern {
  personas: string[];
  context: unknown;
  timestamp: number;
}

/**
 * Feedback record for session memory
 */
export interface FeedbackRecord {
  type: 'feedback';
  personas: string[];
  rating: number;
  comments?: string;
  context: unknown;
  timestamp: number;
}

/**
 * Activation history record
 */
export interface ActivationHistory {
  timestamp: number;
  personas: string[];
  activationType: ActivationReason;
  confidence: number[];
  input: string;
}

/**
 * System analytics data
 */
export interface SystemAnalytics {
  personaManager: PersonaManagerAnalytics;
  learning: LearningAnalytics;
  systemHealth: SystemHealth;
}

/**
 * Persona manager specific analytics
 */
export interface PersonaManagerAnalytics {
  totalInteractions: number;
  personaUsage: Record<string, { count: number; totalConfidence: number }>;
  collaborationPatterns: Record<string, number>;
  averageConfidence: number;
  successfulPatterns: number;
}

/**
 * Learning engine analytics
 */
export interface LearningAnalytics {
  sessionStats: {
    interactions: number;
    feedback: number;
    patterns: number;
    sessionDuration: number;
  };
  persistentStats: {
    successfulPatterns: number;
    failedPatterns: number;
    totalLearningEvents: number;
  };
  learningEffectiveness: number;
  topPatterns: {
    pattern: string;
    usage: number;
    rating: number;
    personas: string[];
  }[];
  recommendations: {
    type: string;
    message: string;
    priority: string;
  }[];
}

/**
 * System health information
 */
export interface SystemHealth {
  initialized: boolean;
  availablePersonas: number;
  activePersonas: number;
  lastUpdate?: string;
}

/**
 * Generated prompt information
 */
export interface GeneratedPrompt {
  systemPrompt: string;
  personaContext: PersonaContext | null;
  collaboration?: CollaborationPlan | null;
  learningIntegration?: unknown;
  flagIntegration?: unknown;
  userInput?: string;
  context?: unknown;
}

/**
 * Persona context in generated prompts
 */
export interface PersonaContext {
  active: ActivePersonaInfo[];
  collaboration: CollaborationPlan;
}

/**
 * Active persona information for contexts
 */
export interface ActivePersonaInfo {
  name: string;
  confidence: number;
  role: 'lead' | 'supporting';
}