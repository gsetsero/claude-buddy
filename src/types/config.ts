/**
 * Configuration type definitions
 */

import { PersonaConfig, CollaborationPattern, ValidationStep } from './personas.js';

/**
 * Main buddy configuration interface
 */
export interface BuddyConfig {
  personas: Record<string, PersonaConfig>;
  activation: ActivationConfig;
  collaboration_matrix?: Record<string, CollaborationPattern>;
  validation_chain?: ValidationChainConfig;
}

/**
 * Activation configuration settings
 */
export interface ActivationConfig {
  confidence_threshold: number;
  max_active_personas: number;
  collaboration_enabled: boolean;
}

/**
 * Validation chain configuration
 */
export interface ValidationChainConfig {
  security_validation?: string[];
  quality_validation?: string[];
  performance_validation?: string[];
}

/**
 * Hook configuration interface
 */
export interface HookConfig {
  type: 'command';
  command: string;
  description: string;
  enabled: boolean;
  timeout: number;
}

/**
 * Hook matcher configuration
 */
export interface HookMatcher {
  matcher: string;
  hooks: HookConfig[];
}

/**
 * Complete hooks configuration
 */
export interface HooksConfig {
  hooks: {
    PreToolUse?: HookMatcher[];
    PostToolUse?: HookMatcher[];
    UserPromptSubmit?: HookMatcher[];
    Notification?: HookMatcher[];
    Stop?: HookMatcher[];
    SubagentStop?: HookMatcher[];
    PreCompact?: HookMatcher[];
  };
}

/**
 * Learning engine configuration
 */
export interface LearningConfig {
  enabled: boolean;
  adaptationRate: number;
  memoryRetention: number;
  feedbackWeight: number;
  patternThreshold: number;
}

/**
 * Auto-activation engine configuration
 */
export interface AutoActivationEngineConfig {
  keywordWeight: number;
  contextWeight: number;
  filePatternWeight: number;
  historyWeight: number;
  confidenceThreshold: number;
}

/**
 * Performance configuration settings
 */
export interface PerformanceConfig {
  cacheEnabled: boolean;
  cacheTTL: number;
  maxCacheSize: number;
  lazyLoading: boolean;
  batchSize: number;
}

/**
 * Logging configuration
 */
export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  enableFileLogging: boolean;
  logDirectory: string;
  maxLogSize: number;
  logRotation: boolean;
}

/**
 * Security configuration
 */
export interface SecurityConfig {
  enableValidation: boolean;
  allowedFileTypes: string[];
  blockedPatterns: string[];
  maxInputLength: number;
  sanitizeInput: boolean;
}

/**
 * Complete system configuration
 */
export interface SystemConfig {
  buddy: BuddyConfig;
  hooks?: HooksConfig;
  learning?: LearningConfig;
  autoActivation?: AutoActivationEngineConfig;
  performance?: PerformanceConfig;
  logging?: LoggingConfig;
  security?: SecurityConfig;
}

/**
 * Configuration validation result
 */
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

/**
 * Configuration source information
 */
export interface ConfigSource {
  path: string;
  type: 'file' | 'environment' | 'default';
  lastModified?: Date;
  checksum?: string;
}