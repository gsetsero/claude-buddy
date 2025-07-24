/**
 * Main API type definitions
 */

import { 
  PersonaActivationResult, 
  PersonaFeedback, 
  SystemAnalytics, 
  ActivePersona,
  GeneratedPrompt 
} from './personas.js';

import { 
  InputContext, 
  ParsedFlags, 
  FlagValidationResult, 
  LearningRecommendations 
} from './context.js';

// Re-export imported types for easy access
export type { 
  PersonaActivationResult, 
  PersonaFeedback, 
  SystemAnalytics, 
  ActivePersona,
  GeneratedPrompt,
  InputContext, 
  ParsedFlags, 
  FlagValidationResult, 
  LearningRecommendations 
};

/**
 * Main processing result from PersonaSystem
 */
export interface ProcessingResult {
  success: boolean;
  personas?: PersonaActivationResult;
  context: InputContext;
  prompt: GeneratedPrompt;
  flags: ParsedFlags;
  validation: FlagValidationResult;
  learning?: LearningRecommendations;
  error?: string;
  details?: string;
}

/**
 * Persona system initialization options
 */
export interface PersonaSystemOptions {
  configDir?: string;
  enableLearning?: boolean;
  enableCaching?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * Error types that can occur in the persona system
 */
export interface PersonaSystemError extends Error {
  code: string;
  context?: Record<string, unknown>;
  recoverable: boolean;
}

/**
 * Event types emitted by the persona system
 */
export type PersonaSystemEvent = 
  | 'persona_activated'
  | 'persona_deactivated'
  | 'collaboration_planned'
  | 'error_occurred'
  | 'learning_updated'
  | 'config_reloaded';

/**
 * Event data for persona system events
 */
export interface PersonaSystemEventData {
  event: PersonaSystemEvent;
  timestamp: string;
  data: Record<string, unknown>;
}

/**
 * Help information for persona system
 */
export interface PersonaSystemHelp {
  flagHelp: string;
  availablePersonas: string[];
  commands: string[];
  examples: string[];
}

/**
 * Performance metrics for persona operations
 */
export interface PerformanceMetrics {
  processingTime: number;
  personaLoadTime: number;
  flagParsingTime: number;
  collaborationPlanningTime: number;
  memoryUsage: number;
  cacheHitRate?: number;
}

/**
 * Debugging information
 */
export interface DebugInfo {
  version: string;
  config: Record<string, unknown>;
  state: Record<string, unknown>;
  performance: PerformanceMetrics;
  errors: PersonaSystemError[];
}

/**
 * Export types for external usage
 */
export interface PersonaSystemExports {
  // Main classes
  PersonaSystem: typeof import('../personas/index.js').PersonaSystem;
  PersonaManager: typeof import('../personas/persona-manager.js').default;
  PersonaFlagParser: typeof import('../personas/flag-parser.js').default;
  PersonaLearningEngine: typeof import('../personas/learning-engine.js').default;
  
  // Singleton instance
  personaSystem: import('../personas/index.js').PersonaSystem;
  
  // Type exports
  types: {
    ProcessingResult: ProcessingResult;
    PersonaActivationResult: PersonaActivationResult;
    InputContext: InputContext;
    ParsedFlags: ParsedFlags;
    ActivePersona: ActivePersona;
    PersonaFeedback: PersonaFeedback;
    SystemAnalytics: SystemAnalytics;
  };
}

/**
 * Command recommendation for specific use cases
 */
export interface CommandRecommendation {
  command: string;
  description: string;
  suggestedFlags: string[];
  useCase: string;
  priority: 'low' | 'medium' | 'high';
}

/**
 * Persona usage statistics
 */
export interface PersonaUsageStats {
  totalActivations: number;
  successfulActivations: number;
  averageConfidence: number;
  mostUsedPersonas: Array<{ name: string; count: number }>;
  collaborationPatterns: Array<{ pattern: string; count: number }>;
  timeRange: {
    start: string;
    end: string;
  };
}

/**
 * System status information
 */
export interface SystemStatus {
  initialized: boolean;
  healthy: boolean;
  version: string;
  uptime: number;
  personasLoaded: number;
  activePersonas: number;
  lastError?: PersonaSystemError;
  configValid: boolean;
}

/**
 * Batch processing request
 */
export interface BatchProcessingRequest {
  inputs: Array<{
    id: string;
    userInput: string;
    context?: Partial<InputContext>;
  }>;
  options?: {
    parallel?: boolean;
    maxConcurrency?: number;
    failFast?: boolean;
  };
}

/**
 * Batch processing result
 */
export interface BatchProcessingResult {
  results: Array<{
    id: string;
    success: boolean;
    result?: ProcessingResult;
    error?: PersonaSystemError;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
    totalTime: number;
    averageTime: number;
  };
}