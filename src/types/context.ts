/**
 * Context and analysis type definitions
 */

/**
 * Git repository information
 */
export interface GitInformation {
  isRepo: boolean;
  branch?: string;
  commitCount?: number;
  lastCommit?: string;
  hasChanges?: boolean;
  remoteUrl?: string;
}

/**
 * Project file analysis results
 */
export interface FileAnalysis {
  totalFiles: number;
  codeFiles: number;
  testFiles: number;
  configFiles: number;
  documentationFiles: number;
  extensions: Record<string, number>;
  directories: string[];
  complexity: 'simple' | 'medium' | 'large' | 'complex';
}

/**
 * Project structure analysis
 */
export interface ProjectStructure {
  hasTests: boolean;
  hasDocumentation: boolean;
  hasCI: boolean;
  hasContainerization: boolean;
  hasConfig: boolean;
  layered: boolean;
  monorepo: boolean;
  frameworks: string[];
  buildTools: string[];
}

/**
 * Technology detection results
 */
export interface TechnologyStack {
  frontend: string[];
  backend: string[];
  database: string[];
  testing: string[];
  deployment: string[];
  security: string[];
  primaryLanguage: string;
  packageManager?: string;
}

/**
 * Security indicators in project
 */
export interface SecurityIndicators {
  hasAuth: boolean;
  hasEncryption: boolean;
  hasSecurityConfig: boolean;
  hasSecrets: boolean;
  vulnerablePatterns: string[];
  securityFrameworks: string[];
}

/**
 * Performance indicators
 */
export interface PerformanceIndicators {
  hasCaching: boolean;
  hasOptimization: boolean;
  hasMonitoring: boolean;
  hasLoadTesting: boolean;
  bundleOptimization: boolean;
  performanceTools: string[];
}

/**
 * Quality indicators
 */
export interface QualityIndicators {
  hasLinting: boolean;
  hasFormatting: boolean;
  hasTypeChecking: boolean;
  hasCodeCoverage: boolean;
  hasDocumentation: boolean;
  qualityTools: string[];
  codeQualityScore?: number;
}

/**
 * Complete project analysis context
 */
export interface ProjectAnalysisContext {
  cwd: string;
  projectType: string;
  technologyStack: TechnologyStack;
  projectStructure: ProjectStructure;
  fileAnalysis: FileAnalysis;
  gitInfo: GitInformation;
  securityIndicators: SecurityIndicators;
  performanceIndicators: PerformanceIndicators;
  qualityIndicators: QualityIndicators;
  complexity: ProjectComplexity;
  recommendations: ContextRecommendation[];
  timestamp: string;
}

/**
 * Project complexity assessment
 */
export interface ProjectComplexity {
  fileCount: number;
  directoryDepth: number;
  estimatedLOC: number;
  complexity: 'simple' | 'medium' | 'large' | 'complex';
  factors: string[];
}

/**
 * Context-based recommendations
 */
export interface ContextRecommendation {
  persona: string;
  priority: 'low' | 'medium' | 'high';
  reason: string;
  confidence: number;
}

/**
 * User input context for persona processing
 */
export interface InputContext {
  cwd: string;
  cleanedInput: string;
  flags?: ParsedFlags;
  learning?: LearningRecommendations;
  command?: string;
  projectType?: string;
  files?: string[];
  gitInfo?: GitInformation;
  timestamp?: string;
  projectAnalysis?: ProjectAnalysisContext;
}

/**
 * Parsed flag information
 */
export interface ParsedFlags {
  originalInput: string;
  cleanedInput: string;
  hasFlags: boolean;
  personas: {
    manual: string[];
    with: string[];
    focus: string[];
  };
  modes: {
    comprehensive: boolean;
    singlePersona: boolean;
    noCollaboration: boolean;
    learn: boolean | null;
  };
  focusAreas: string[];
  confidence: {
    override: number | null;
    threshold: number | null;
  };
}

/**
 * Learning recommendations
 */
export interface LearningRecommendations {
  personas: string[];
  reasoning: string[];
  adaptations: LearningAdaptation[];
  confidence: number;
  patterns: string[];
}

/**
 * Individual learning adaptation
 */
export interface LearningAdaptation {
  type: 'persona_selection' | 'collaboration' | 'confidence_threshold';
  reason: string;
  impact: number;
  confidence: number;
}

/**
 * Flag validation result
 */
export interface FlagValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

/**
 * Activation instructions for persona manager
 */
export interface ActivationInstructions {
  mode: 'manual' | 'automatic' | 'error';
  strategy: string;
  personas: {
    required: string[];
    preferred: string[];
    focus: string[];
  };
  collaboration: {
    enabled: boolean;
    comprehensive: boolean;
    singleLeader: boolean;
  };
  learning: {
    enabled: boolean | null;
    adaptive: boolean;
  };
  validation: FlagValidationResult;
  errors?: string[];
  fallback?: string;
}