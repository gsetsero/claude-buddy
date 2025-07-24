/**
 * Auto-Activation Context Detection Engine
 * 
 * Intelligent persona selection based on multi-factor analysis:
 * - Keyword matching (30%)
 * - Context analysis (40%) 
 * - File patterns (20%)
 * - User history (10%)
 */

import { promises as fs } from 'fs';
import path from 'path';

import type {
  DetectionResults,
  PersonaRecommendation
} from '../types/personas.js';

import type {
  InputContext
} from '../types/context.js';

interface PersonaConfig {
  auto_activation?: {
    keywords?: string[];
    confidence_weight?: number;
    file_patterns?: string[];
  };
}

interface Config {
  personas: Record<string, PersonaConfig>;
  auto_activation?: {
    global_confidence_threshold?: number;
    multi_persona_limit?: number;
  };
}

interface ProjectAnalysis {
  type: string;
  frameworks: string[];
  features: string[];
  complexity: number;
}

interface FilePatterns {
  frontend: number;
  backend: number;
  config: number;
  test: number;
  docs: number;
}

interface SessionContext {
  activePersonas: string[];
  filePatterns: FilePatterns;
  projectType: string | null;
  recentCommands: RecentCommand[];
  frameworks?: string[];
  features?: string[];
}

interface RecentCommand {
  input: string;
  personas: string[];
  timestamp: number;
}

interface Analysis {
  userInput: string;
  keywords: string[];
  context: unknown;
  files: string[];
  command: string;
}

interface PersonaScoreBreakdown {
  keyword_matching: number;
  context_analysis: number;
  file_patterns: number;
  user_history: number;
}

interface PersonaScore {
  total: number;
  breakdown: PersonaScoreBreakdown;
}

interface UserHistoryData {
  usageCount: number;
  successfulUsage: number;
  lastUsed: number;
  contexts: unknown[];
}

interface Weights {
  keyword_matching: number;
  context_analysis: number;
  file_patterns: number;
  user_history: number;
}

/**
 * Persona Auto-Activation Engine
 * 
 * Intelligent persona selection engine that analyzes context to automatically
 * activate the most appropriate personas for a given task. Uses multi-factor
 * scoring algorithm with keyword matching, context analysis, file patterns,
 * and user history.
 * 
 * @category Auto-Activation
 * @public
 */
class PersonaActivationEngine {
  private config: Config | null = null;
  private userHistory: Map<string, UserHistoryData> = new Map();
  private sessionContext: SessionContext;
  private configPath: string;
  private weights: Weights;

  constructor(configPath?: string) {
    this.sessionContext = {
      activePersonas: [],
      filePatterns: {
        frontend: 0,
        backend: 0,
        config: 0,
        test: 0,
        docs: 0
      },
      projectType: null,
      recentCommands: [],
    };
    
    this.configPath = configPath || path.join(__dirname, 'config', 'personas-config.json');
    this.weights = {
      keyword_matching: 0.3,
      context_analysis: 0.4,
      file_patterns: 0.2,
      user_history: 0.1
    };
  }

  /**
   * Initialize the persona system with configuration
   */
  async initialize(): Promise<boolean> {
    try {
      const configContent = await fs.readFile(this.configPath, 'utf8');
      this.config = JSON.parse(configContent);
      
      // Load user history if exists
      await this.loadUserHistory();
      
      // Analyze project context
      await this.analyzeProjectContext();
      
      console.log('Persona activation engine initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize persona activation engine:', error);
      return false;
    }
  }

  /**
   * Analyze project context to understand technology stack and structure
   */
  private async analyzeProjectContext(): Promise<void> {
    try {
      const projectRoot = process.cwd();
      const packageJsonPath = path.join(projectRoot, 'package.json');
      const pyprojectPath = path.join(projectRoot, 'pyproject.toml');
      const cargoPath = path.join(projectRoot, 'Cargo.toml');
      const gemfilePath = path.join(projectRoot, 'Gemfile');
      
      // Detect project type and frameworks
      const projectAnalysis: ProjectAnalysis = {
        type: 'unknown',
        frameworks: [],
        features: [],
        complexity: 0.5
      };

      // Analyze package.json for JavaScript/TypeScript projects
      if (await this.fileExists(packageJsonPath)) {
        const packageContent = await fs.readFile(packageJsonPath, 'utf8');
        const packageJson = JSON.parse(packageContent);
        
        projectAnalysis.type = 'javascript';
        
        // Detect frontend frameworks
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        if (deps.react) projectAnalysis.frameworks.push('react');
        if (deps.vue) projectAnalysis.frameworks.push('vue');
        if (deps['@angular/core']) projectAnalysis.frameworks.push('angular');
        if (deps.express) projectAnalysis.frameworks.push('express');
        if (deps.next) projectAnalysis.frameworks.push('next');
        
        // Detect features
        if (deps.typescript) projectAnalysis.features.push('typescript');
        if (deps.jest || deps.mocha) projectAnalysis.features.push('testing');
        if (deps.docker || deps.dockerfile) projectAnalysis.features.push('containerization');
      }

      // Analyze Python projects
      if (await this.fileExists(pyprojectPath)) {
        projectAnalysis.type = 'python';
        // Could parse pyproject.toml for dependencies
      }

      // Analyze Rust projects
      if (await this.fileExists(cargoPath)) {
        projectAnalysis.type = 'rust';
      }

      // Analyze Ruby projects
      if (await this.fileExists(gemfilePath)) {
        projectAnalysis.type = 'ruby';
      }

      // Detect file patterns
      await this.detectFilePatterns();

      this.sessionContext.projectType = projectAnalysis.type;
      this.sessionContext.frameworks = projectAnalysis.frameworks;
      this.sessionContext.features = projectAnalysis.features;
      
    } catch (error) {
      console.error('Error analyzing project context:', error);
    }
  }

  /**
   * Detect file patterns in the current project
   */
  private async detectFilePatterns(): Promise<void> {
    try {
      const patterns: FilePatterns = {
        frontend: 0,
        backend: 0,
        config: 0,
        test: 0,
        docs: 0
      };

      // Sample some files to understand project structure
      const files = await this.getProjectFiles();
      
      for (const file of files.slice(0, 100)) { // Limit to avoid performance issues
        const ext = path.extname(file).toLowerCase();
        const basename = path.basename(file).toLowerCase();
        
        // Frontend patterns
        if (['.jsx', '.tsx', '.vue', '.css', '.scss', '.sass', '.html'].includes(ext)) {
          patterns.frontend++;
        }
        
        // Backend patterns
        if (['.py', '.js', '.ts', '.go', '.java', '.rb', '.php'].includes(ext) && 
            (file.includes('/api/') || file.includes('/server/') || file.includes('/backend/'))) {
          patterns.backend++;
        }
        
        // Config patterns
        if (basename.includes('config') || basename.includes('.env') || 
            ['.yml', '.yaml', '.json', '.toml'].includes(ext)) {
          patterns.config++;
        }
        
        // Test patterns
        if (basename.includes('test') || basename.includes('spec') || 
            file.includes('/tests/') || file.includes('/__tests__/')) {
          patterns.test++;
        }
        
        // Documentation patterns
        if (['.md', '.rst', '.txt'].includes(ext) || file.includes('/docs/')) {
          patterns.docs++;
        }
      }

      this.sessionContext.filePatterns = patterns;
    } catch (error) {
      console.error('Error detecting file patterns:', error);
    }
  }

  /**
   * Get project files recursively (with reasonable limits)
   */
  private async getProjectFiles(): Promise<string[]> {
    const files: string[] = [];
    const maxFiles = 500;
    const ignoreDirs = ['node_modules', '.git', 'dist', 'build', '__pycache__', '.venv'];
    
    const walkDir = async (dir: string, depth = 0): Promise<void> => {
      if (depth > 5 || files.length >= maxFiles) return;
      
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          if (files.length >= maxFiles) break;
          
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            if (!ignoreDirs.some(ignore => entry.name.includes(ignore))) {
              await walkDir(fullPath, depth + 1);
            }
          } else {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Ignore permission errors, etc.
      }
    };

    await walkDir(process.cwd());
    return files;
  }

  /**
   * Detect and recommend appropriate personas based on multi-factor analysis.
   * 
   * Uses a sophisticated scoring algorithm that analyzes:
   * - Keyword matching (30% weight) - Direct matches in user input
   * - Context analysis (40% weight) - Project structure and technical indicators
   * - File patterns (20% weight) - File types and project organization
   * - User history (10% weight) - Previous successful activations
   * 
   * @param userInput - The user's input string to analyze
   * @param options - Additional context including files, command type, project info
   * @returns Promise resolving to detection results with persona recommendations
   * 
   * @example
   * ```typescript
   * const results = await activationEngine.detectPersonas(
   *   "Review this authentication code for vulnerabilities",
   *   {
   *     files: ["auth.ts", "middleware/security.ts"],
   *     command: "review",
   *     projectType: "web-app"
   *   }
   * );
   * 
   * console.log('Recommended personas:');
   * results.recommendations.forEach(rec => {
   *   console.log(`${rec.persona}: ${rec.confidence.toFixed(2)} confidence`);
   *   console.log(`Reasoning: ${rec.reasoning}`);
   * });
   * ```
   * 
   * @category Auto-Activation
   * @public
   */
  async detectPersonas(userInput: string, options: Partial<InputContext> = {}): Promise<DetectionResults> {
    if (!this.config) {
      await this.initialize();
    }

    if (!this.config) {
      throw new Error('Failed to initialize configuration');
    }

    const analysis: Analysis = {
      userInput: userInput.toLowerCase(),
      keywords: this.extractKeywords(userInput),
      context: options || {},
      files: options.files || [],
      command: options.command || ''
    };

    const personaScores: Record<string, PersonaScore> = {};
    
    // Initialize all personas with base scores
    for (const [personaName] of Object.entries(this.config.personas)) {
      personaScores[personaName] = {
        total: 0,
        breakdown: {
          keyword_matching: 0,
          context_analysis: 0,
          file_patterns: 0,
          user_history: 0
        }
      };
    }

    // Calculate scores for each factor
    this.calculateKeywordScores(analysis, personaScores);
    this.calculateContextScores(analysis, personaScores);
    this.calculateFilePatternScores(analysis, personaScores);
    this.calculateUserHistoryScores(analysis, personaScores);

    // Calculate final weighted scores
    for (const personaName of Object.keys(personaScores)) {
      const breakdown = personaScores[personaName].breakdown;
      personaScores[personaName].total = 
        breakdown.keyword_matching * this.weights.keyword_matching +
        breakdown.context_analysis * this.weights.context_analysis +
        breakdown.file_patterns * this.weights.file_patterns +
        breakdown.user_history * this.weights.user_history;
    }

    // Filter and rank personas above threshold
    const threshold = this.config.auto_activation?.global_confidence_threshold || 0.7;
    const recommendations: PersonaRecommendation[] = Object.entries(personaScores)
      .filter(([_, score]) => score.total >= threshold)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, this.config.auto_activation?.multi_persona_limit || 3)
      .map(([name, score]) => ({
        persona: name,
        confidence: Math.round(score.total * 100) / 100,
        breakdown: score.breakdown,
        reasoning: this.generateReasoning(name, score, analysis)
      }));

    // Update session context
    this.sessionContext.recentCommands.push({
      input: userInput,
      personas: recommendations.map(r => r.persona),
      timestamp: Date.now()
    });

    // Keep only recent commands
    if (this.sessionContext.recentCommands.length > 10) {
      this.sessionContext.recentCommands = this.sessionContext.recentCommands.slice(-10);
    }

    return {
      recommendations,
      sessionContext: this.sessionContext,
      analysisDetails: analysis
    };
  }

  /**
   * Calculate keyword matching scores
   */
  private calculateKeywordScores(analysis: Analysis, personaScores: Record<string, PersonaScore>): void {
    if (!this.config) return;

    for (const [personaName, personaConfig] of Object.entries(this.config.personas)) {
      const keywords = personaConfig.auto_activation?.keywords || [];
      let matches = 0;
      const totalKeywords = keywords.length;

      for (const keyword of keywords) {
        if (analysis.userInput.includes(keyword.toLowerCase())) {
          matches++;
        }
      }

      if (totalKeywords > 0) {
        const baseScore = matches / totalKeywords;
        const confidenceWeight = personaConfig.auto_activation?.confidence_weight || 1.0;
        personaScores[personaName].breakdown.keyword_matching = baseScore * confidenceWeight;
      }
    }
  }

  /**
   * Calculate context analysis scores
   */
  private calculateContextScores(analysis: Analysis, personaScores: Record<string, PersonaScore>): void {
    if (!this.config) return;

    for (const [personaName] of Object.entries(this.config.personas)) {
      let contextScore = 0;

      // Command-specific scoring
      if (analysis.command) {
        const commandMappings: Record<string, string[]> = {
          'commit': ['scribe', 'security'],
          'review': ['security', 'analyzer', 'qa', 'performance'],
          'docs': ['scribe', 'mentor'],
          'brainstorm': ['architect', 'frontend', 'backend'],
          'analyze': ['analyzer', 'security', 'performance'],
          'improve': ['refactorer', 'performance', 'security']
        };

        if (commandMappings[analysis.command]?.includes(personaName)) {
          contextScore += 0.5;
        }
      }

      // Project type alignment
      if (this.sessionContext.projectType) {
        const typeAlignments: Record<string, string[]> = {
          'javascript': ['frontend', 'backend'],
          'python': ['backend', 'analyzer'],
          'rust': ['performance', 'backend'],
          'ruby': ['backend', 'refactorer']
        };

        if (typeAlignments[this.sessionContext.projectType]?.includes(personaName)) {
          contextScore += 0.3;
        }
      }

      // Framework alignment
      for (const framework of this.sessionContext.frameworks || []) {
        if (framework === 'react' && personaName === 'frontend') contextScore += 0.2;
        if (framework === 'express' && personaName === 'backend') contextScore += 0.2;
      }

      personaScores[personaName].breakdown.context_analysis = Math.min(contextScore, 1.0);
    }
  }

  /**
   * Calculate file pattern scores
   */
  private calculateFilePatternScores(analysis: Analysis, personaScores: Record<string, PersonaScore>): void {
    if (!this.config) return;

    for (const [personaName, personaConfig] of Object.entries(this.config.personas)) {
      const filePatterns = personaConfig.auto_activation?.file_patterns || [];
      let patternScore = 0;

      // Check files in current context
      for (const file of analysis.files) {
        for (const pattern of filePatterns) {
          if (this.matchesPattern(file, pattern)) {
            patternScore += 0.2;
          }
        }
      }

      // Check overall project file patterns
      const patterns = this.sessionContext.filePatterns;
      if (patterns) {
        if (personaName === 'frontend' && patterns.frontend > 10) patternScore += 0.3;
        if (personaName === 'backend' && patterns.backend > 10) patternScore += 0.3;
        if (personaName === 'devops' && patterns.config > 5) patternScore += 0.3;
        if (personaName === 'qa' && patterns.test > 5) patternScore += 0.3;
        if (personaName === 'scribe' && patterns.docs > 3) patternScore += 0.3;
      }

      personaScores[personaName].breakdown.file_patterns = Math.min(patternScore, 1.0);
    }
  }

  /**
   * Calculate user history scores
   */
  private calculateUserHistoryScores(_analysis: Analysis, personaScores: Record<string, PersonaScore>): void {
    if (!this.config) return;

    // Simple user history scoring based on recent successful activations
    const recentPersonas = this.sessionContext.recentCommands
      .slice(-5)
      .flatMap(cmd => cmd.personas);

    const personaCounts: Record<string, number> = {};
    for (const persona of recentPersonas) {
      personaCounts[persona] = (personaCounts[persona] || 0) + 1;
    }

    const maxCount = Math.max(...Object.values(personaCounts), 1);
    
    for (const [personaName] of Object.entries(this.config.personas)) {
      const count = personaCounts[personaName] || 0;
      personaScores[personaName].breakdown.user_history = count / maxCount * 0.5;
    }
  }

  /**
   * Generate human-readable reasoning for persona recommendation
   */
  private generateReasoning(personaName: string, score: PersonaScore, _analysis: Analysis): string {
    const reasons: string[] = [];
    
    if (score.breakdown.keyword_matching > 0.3) {
      reasons.push(`Strong keyword alignment with ${personaName} domain`);
    }
    
    if (score.breakdown.context_analysis > 0.3) {
      reasons.push(`Project context matches ${personaName} expertise`);
    }
    
    if (score.breakdown.file_patterns > 0.3) {
      reasons.push(`File patterns indicate ${personaName} relevance`);
    }
    
    if (score.breakdown.user_history > 0.2) {
      reasons.push(`Recent usage history favors ${personaName}`);
    }

    return reasons.length > 0 ? reasons.join('; ') : `General alignment with ${personaName} capabilities`;
  }

  /**
   * Extract keywords from user input
   */
  private extractKeywords(input: string): string[] {
    // Simple keyword extraction - could be enhanced with NLP
    const words = input.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    return [...new Set(words)];
  }

  /**
   * Check if file matches pattern
   */
  private matchesPattern(file: string, pattern: string): boolean {
    // Simple pattern matching - could use glob library for more complex patterns
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(file);
    }
    return file.includes(pattern);
  }

  /**
   * Check if file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Load user history from storage
   */
  private async loadUserHistory(): Promise<void> {
    try {
      const historyPath = path.join(__dirname, '..', '.claude-buddy', 'persona-history.json');
      const historyContent = await fs.readFile(historyPath, 'utf8');
      const history = JSON.parse(historyContent);
      
      for (const [persona, data] of Object.entries(history)) {
        this.userHistory.set(persona, data as UserHistoryData);
      }
    } catch (error) {
      // No history file exists yet, that's okay
    }
  }

  /**
   * Save user history to storage
   */
  private async saveUserHistory(): Promise<void> {
    try {
      const historyPath = path.join(__dirname, '..', '.claude-buddy', 'persona-history.json');
      const historyDir = path.dirname(historyPath);
      
      // Ensure directory exists
      await fs.mkdir(historyDir, { recursive: true });
      
      const historyObj: Record<string, UserHistoryData> = {};
      for (const [persona, data] of this.userHistory.entries()) {
        historyObj[persona] = data;
      }
      
      await fs.writeFile(historyPath, JSON.stringify(historyObj, null, 2));
    } catch (error) {
      console.error('Failed to save persona history:', error);
    }
  }

  /**
   * Record successful persona usage for learning
   */
  recordPersonaUsage(personas: string[], userFeedback: 'positive' | 'negative' | 'neutral' = 'positive'): void {
    const timestamp = Date.now();
    
    for (const persona of personas) {
      if (!this.userHistory.has(persona)) {
        this.userHistory.set(persona, {
          usageCount: 0,
          successfulUsage: 0,
          lastUsed: timestamp,
          contexts: []
        });
      }

      const history = this.userHistory.get(persona)!;
      history.usageCount++;
      history.lastUsed = timestamp;
      
      if (userFeedback === 'positive') {
        history.successfulUsage++;
      }

      this.userHistory.set(persona, history);
    }

    // Save updated history
    void this.saveUserHistory();
  }
}

// Export both named and default for flexibility
export { PersonaActivationEngine };
export default PersonaActivationEngine;