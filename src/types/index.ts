/**
 * Main type exports for Claude Code Buddy
 * 
 * This file provides all public type definitions that external consumers
 * might need when using Claude Code Buddy with TypeScript.
 */

// Core Persona System Types
export type {
  PersonaCategory,
  ActivationReason,
  CollaborationStrategy,
  AutoActivationConfig,
  PersonaConfig,
  ActivePersona,
  CollaborationPattern,
  ValidationStep,
  CollaborationPlan,
  DetectionResults,
  PersonaRecommendation,
  PersonaActivationResult,
  SessionMemory,
  PersonaInteraction,
  PersonaFeedback,
  SystemAnalytics,
  PersonaManagerAnalytics,
  LearningAnalytics,
  SystemHealth,
  GeneratedPrompt,
  PersonaContext,
  ActivePersonaInfo
} from './personas.js';

// Configuration Types
export type {
  BuddyConfig,
  ActivationConfig,
  ValidationChainConfig,
  HookConfig,
  HookMatcher,
  HooksConfig,
  LearningConfig,
  AutoActivationEngineConfig,
  PerformanceConfig,
  LoggingConfig,
  SecurityConfig,
  SystemConfig,
  ConfigValidationResult,
  ConfigSource
} from './config.js';

// Context and Analysis Types
export type {
  GitInformation,
  FileAnalysis,
  ProjectStructure,
  TechnologyStack,
  SecurityIndicators,
  PerformanceIndicators,
  QualityIndicators,
  ProjectAnalysisContext,
  ProjectComplexity,
  ContextRecommendation,
  InputContext,
  ParsedFlags,
  LearningRecommendations,
  LearningAdaptation,
  FlagValidationResult,
  ActivationInstructions
} from './context.js';

// API Types
export type {
  ProcessingResult,
  PersonaSystemOptions,
  PersonaSystemError,
  PersonaSystemEvent,
  PersonaSystemEventData,
  PersonaSystemHelp,
  PerformanceMetrics,
  DebugInfo,
  PersonaSystemExports,
  CommandRecommendation,
  PersonaUsageStats,
  SystemStatus,
  BatchProcessingRequest,
  BatchProcessingResult
} from './api.js';

/**
 * Common utility types
 */

/**
 * Make all properties in T optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make specific properties required in a partial type
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Extract function return type, handling promises
 */
export type ExtractReturnType<T> = T extends (...args: any[]) => Promise<infer R>
  ? R
  : T extends (...args: any[]) => infer R
  ? R
  : never;

/**
 * Create a union type from an object's values
 */
export type ValueOf<T> = T[keyof T];

/**
 * Create a type-safe event emitter interface
 */
export interface TypedEventEmitter<T extends Record<string, any[]>> {
  on<K extends keyof T>(event: K, listener: (...args: T[K]) => void): this;
  off<K extends keyof T>(event: K, listener: (...args: T[K]) => void): this;
  emit<K extends keyof T>(event: K, ...args: T[K]): boolean;
}

/**
 * Promise-based result type with error handling
 */
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Configuration with defaults
 */
export type ConfigWithDefaults<T> = T & {
  __defaults: boolean;
  __source: string;
};

/**
 * Branded types for type safety
 */
export type PersonaName = string & { __brand: 'PersonaName' };
export type ConfidenceScore = number & { __brand: 'ConfidenceScore' };
export type TimestampMs = number & { __brand: 'TimestampMs' };

/**
 * Helper functions for branded types
 */
export const createPersonaName = (name: string): PersonaName => name as PersonaName;
export const createConfidenceScore = (score: number): ConfidenceScore => {
  if (score < 0 || score > 1) {
    throw new Error('Confidence score must be between 0 and 1');
  }
  return score as ConfidenceScore;
};
export const createTimestamp = (): TimestampMs => Date.now() as TimestampMs;

/**
 * Type guards for runtime type checking
 */
export const isPersonaActivationResult = (obj: unknown): obj is import('./personas.js').PersonaActivationResult => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'activePersonas' in obj &&
    'reasoning' in obj &&
    'collaboration' in obj
  );
};

export const isProcessingResult = (obj: unknown): obj is import('./api.js').ProcessingResult => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'success' in obj &&
    'context' in obj &&
    'prompt' in obj &&
    'flags' in obj &&
    'validation' in obj
  );
};

export const isPersonaSystemError = (obj: unknown): obj is import('./api.js').PersonaSystemError => {
  return (
    obj instanceof Error &&
    'code' in obj &&
    'recoverable' in obj
  );
};

/**
 * Constants for common values
 */
export const PERSONA_CATEGORIES = ['technical', 'process', 'knowledge'] as const;
export const ACTIVATION_REASONS = ['manual', 'automatic'] as const;
export const COLLABORATION_STRATEGIES = [
  'single_persona',
  'multi_persona', 
  'comprehensive',
  'isolated',
  'collaborative',
  'manual_selection',
  'focus_driven'
] as const;

/**
 * Version information
 */
export interface Version {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  build?: string;
}

export const VERSION: Version = {
  major: 1,
  minor: 0,
  patch: 0
};