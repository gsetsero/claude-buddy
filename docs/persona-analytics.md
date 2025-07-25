# Persona Analytics and Debugging Guide

This guide covers monitoring, analyzing, and debugging the Claude Code Buddy persona system for optimal performance and user experience.

## Table of Contents

- [Analytics Overview](#analytics-overview)
- [Performance Monitoring](#performance-monitoring)
- [Activation Debugging](#activation-debugging)
- [Learning System Analytics](#learning-system-analytics)
- [Collaboration Analysis](#collaboration-analysis)
- [User Experience Metrics](#user-experience-metrics)
- [Debugging Workflows](#debugging-workflows)
- [Optimization Strategies](#optimization-strategies)

## Analytics Overview

### System Health Dashboard

Access real-time system analytics:

```typescript
import { personaSystem } from './src/personas/index.js';

// Get comprehensive analytics
const analytics = personaSystem.getAnalytics();

console.log('System Health:', {
  initialized: analytics.systemHealth.initialized,
  availablePersonas: analytics.systemHealth.availablePersonas,
  activePersonas: analytics.systemHealth.activePersonas,
  totalInteractions: analytics.personaManager.totalInteractions,
  averageConfidence: analytics.personaManager.averageConfidence,
  learningEffectiveness: analytics.learning.learningEffectiveness
});
```

### Key Performance Indicators (KPIs)

Monitor these essential metrics:

1. **Activation Accuracy**: Percentage of correct persona activations
2. **Response Time**: Time from input to persona activation
3. **User Satisfaction**: Feedback ratings and effectiveness scores
4. **Learning Rate**: How quickly the system adapts to user patterns
5. **Collaboration Success**: Multi-persona workflow effectiveness

## Performance Monitoring

### Activation Performance Tracking

```typescript
// Monitor activation timing
class ActivationProfiler {
  private timings: Map<string, number[]> = new Map();

  async profileActivation(input: string, context: any) {
    const start = performance.now();
    
    const result = await personaSystem.processInput(input, context);
    
    const duration = performance.now() - start;
    const personas = result.personas?.activePersonas?.map(p => p.name) || [];
    
    // Track timing by persona combination
    const key = personas.sort().join('-') || 'none';
    if (!this.timings.has(key)) {
      this.timings.set(key, []);
    }
    this.timings.get(key)!.push(duration);
    
    return { result, duration, personas };
  }

  getAverageTimings() {
    const averages = new Map<string, number>();
    for (const [key, times] of this.timings) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      averages.set(key, Math.round(avg * 100) / 100);
    }
    return averages;
  }
}

// Usage
const profiler = new ActivationProfiler();
const { result, duration, personas } = await profiler.profileActivation(
  "Review this security vulnerability",
  { files: ["auth.ts"] }
);
console.log(`Activated ${personas.join(', ')} in ${duration}ms`);
```

### Memory Usage Monitoring

```typescript
// Monitor persona system memory usage
function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
    external: Math.round(usage.external / 1024 / 1024),
    rss: Math.round(usage.rss / 1024 / 1024)
  };
}

// Track memory over session
setInterval(() => {
  const memory = getMemoryUsage();
  const analytics = personaSystem.getAnalytics();
  
  console.log('Memory Usage:', {
    ...memory,
    interactions: analytics.personaManager.totalInteractions,
    activePersonas: analytics.systemHealth.activePersonas
  });
}, 60000); // Every minute
```

## Activation Debugging

### Detailed Activation Analysis

```typescript
// Debug persona activation decisions
async function debugActivation(input: string, context: any) {
  console.log('=== Persona Activation Debug ===');
  console.log('Input:', input);
  console.log('Context:', JSON.stringify(context, null, 2));
  
  // Process with debug info
  const result = await personaSystem.processInput(input, context);
  
  if (result.personas?.detectionResults) {
    console.log('\nDetection Results:');
    for (const rec of result.personas.detectionResults.recommendations) {
      console.log(`${rec.persona}: ${rec.confidence.toFixed(2)} confidence`);
      console.log(`  Reasoning: ${rec.reasoning}`);
      console.log(`  Breakdown:`, {
        keywords: rec.breakdown.keyword_matching.toFixed(2),
        context: rec.breakdown.context_analysis.toFixed(2),
        files: rec.breakdown.file_patterns.toFixed(2),
        history: rec.breakdown.user_history.toFixed(2)
      });
    }
  }
  
  console.log('\nActivated Personas:');
  result.personas?.activePersonas?.forEach(p => {
    console.log(`- ${p.name}: ${p.confidence.toFixed(2)} (${p.activationReason})`);
    if (p.reasoning) console.log(`  ${p.reasoning}`);
  });
  
  if (result.personas?.collaboration) {
    console.log('\nCollaboration Plan:');
    console.log(`Strategy: ${result.personas.collaboration.strategy}`);
    console.log(`Lead: ${result.personas.collaboration.leadPersona}`);
    if (result.personas.collaboration.consultingPersonas?.length) {
      console.log(`Supporting: ${result.personas.collaboration.consultingPersonas.join(', ')}`);
    }
  }
  
  return result;
}

// Example usage
await debugActivation(
  "Help me optimize this database query for better performance",
  { 
    files: ["models/user.ts", "queries/search.sql"],
    command: "optimize",
    projectType: "web-app"
  }
);
```

### Activation Pattern Analysis

```typescript
// Analyze activation patterns over time
class ActivationAnalyzer {
  analyzePatterns(analytics: SystemAnalytics) {
    const { personaUsage, collaborationPatterns } = analytics.personaManager;
    
    // Most used personas
    const sortedUsage = Object.entries(personaUsage)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 5);
    
    console.log('Top 5 Most Used Personas:');
    sortedUsage.forEach(([persona, stats], index) => {
      const avgConfidence = stats.totalConfidence / stats.count;
      console.log(`${index + 1}. ${persona}: ${stats.count} times (avg confidence: ${avgConfidence.toFixed(2)})`);
    });
    
    // Most effective collaborations
    const sortedCollabs = Object.entries(collaborationPatterns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    console.log('\nTop 3 Collaboration Patterns:');
    sortedCollabs.forEach(([pattern, count], index) => {
      console.log(`${index + 1}. ${pattern}: ${count} times`);
    });
    
    return { sortedUsage, sortedCollabs };
  }
  
  identifyIssues(analytics: SystemAnalytics) {
    const issues: string[] = [];
    
    // Low confidence warnings
    if (analytics.personaManager.averageConfidence < 0.7) {
      issues.push(`Low average confidence: ${analytics.personaManager.averageConfidence.toFixed(2)}`);
    }
    
    // Unused personas
    const { personaUsage } = analytics.personaManager;
    const unusedPersonas = ['security', 'performance', 'frontend', 'backend', 'devops', 'architect', 'qa', 'refactorer', 'analyzer', 'mentor', 'scribe', 'po']
      .filter(persona => !personaUsage[persona] || personaUsage[persona].count === 0);
    
    if (unusedPersonas.length > 0) {
      issues.push(`Unused personas: ${unusedPersonas.join(', ')}`);
    }
    
    // Low learning effectiveness
    if (analytics.learning.learningEffectiveness < 0.5) {
      issues.push(`Low learning effectiveness: ${analytics.learning.learningEffectiveness.toFixed(2)}`);
    }
    
    return issues;
  }
}

// Usage
const analyzer = new ActivationAnalyzer();
const analytics = personaSystem.getAnalytics();
analyzer.analyzePatterns(analytics);
const issues = analyzer.identifyIssues(analytics);
if (issues.length > 0) {
  console.log('\nPotential Issues:', issues);
}
```

## Learning System Analytics

### Learning Effectiveness Tracking

```typescript
// Monitor learning system performance
function analyzeLearningEffectiveness() {
  const analytics = personaSystem.getAnalytics();
  const learning = analytics.learning;
  
  console.log('Learning System Analytics:');
  console.log('Session Stats:', {
    interactions: learning.sessionStats.interactions,
    feedback: learning.sessionStats.feedback,
    patterns: learning.sessionStats.patterns,
    duration: `${Math.round(learning.sessionStats.sessionDuration / 60)}min`
  });
  
  console.log('Persistent Stats:', {
    successfulPatterns: learning.persistentStats.successfulPatterns,
    failedPatterns: learning.persistentStats.failedPatterns,
    totalEvents: learning.persistentStats.totalLearningEvents,
    successRate: `${Math.round((learning.persistentStats.successfulPatterns / learning.persistentStats.totalLearningEvents) * 100)}%`
  });
  
  console.log('Learning Effectiveness:', learning.learningEffectiveness);
  
  console.log('Top Patterns:');
  learning.topPatterns.forEach((pattern, index) => {
    console.log(`${index + 1}. ${pattern.pattern} (${pattern.personas.join(', ')})`);
    console.log(`   Usage: ${pattern.usage}, Rating: ${pattern.rating.toFixed(1)}`);
  });
  
  console.log('Recommendations:');
  learning.recommendations.forEach(rec => {
    console.log(`- [${rec.priority}] ${rec.type}: ${rec.message}`);
  });
}
```

### User Preference Analysis

```typescript
// Analyze user preferences and patterns
function analyzeUserPreferences() {
  const analytics = personaSystem.getAnalytics();
  
  // Analyze feedback patterns
  const feedbackData = analytics.learning.topPatterns
    .filter(p => p.rating >= 4.0)
    .sort((a, b) => b.rating - a.rating);
  
  console.log('User Preferences (High-Rated Patterns):');
  feedbackData.slice(0, 5).forEach((pattern, index) => {
    console.log(`${index + 1}. ${pattern.personas.join(' + ')}`);
    console.log(`   Pattern: ${pattern.pattern}`);
    console.log(`   Rating: ${pattern.rating.toFixed(1)}/5.0`);
    console.log(`   Usage: ${pattern.usage} times`);
  });
  
  // Identify preferred persona combinations
  const preferredCombos = analytics.personaManager.collaborationPatterns;
  const sortedCombos = Object.entries(preferredCombos)
    .filter(([combo]) => combo.includes('-')) // Multi-persona combinations
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);
  
  console.log('\nPreferred Collaboration Combinations:');
  sortedCombos.forEach(([combo, count], index) => {
    console.log(`${index + 1}. ${combo.replace('-', ' + ')}: ${count} times`);
  });
}
```

## Collaboration Analysis

### Multi-Persona Workflow Analysis

```typescript
// Analyze collaboration effectiveness
function analyzeCollaboration() {
  const analytics = personaSystem.getAnalytics();
  
  // Collaboration vs single persona usage
  const totalInteractions = analytics.personaManager.totalInteractions;
  const collaborations = Object.values(analytics.personaManager.collaborationPatterns)
    .reduce((sum, count) => sum + count, 0);
  const collaborationRate = (collaborations / totalInteractions) * 100;
  
  console.log('Collaboration Analytics:');
  console.log(`Collaboration Rate: ${collaborationRate.toFixed(1)}%`);
  console.log(`Single Persona: ${(100 - collaborationRate).toFixed(1)}%`);
  
  // Most effective persona pairs
  const personaPairs = Object.entries(analytics.personaManager.collaborationPatterns)
    .filter(([combo]) => combo.split('-').length === 2)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);
  
  console.log('\nMost Effective Persona Pairs:');
  personaPairs.forEach(([pair, count], index) => {
    const [p1, p2] = pair.split('-');
    console.log(`${index + 1}. ${p1} + ${p2}: ${count} collaborations`);
  });
  
  // Complex collaboration patterns (3+ personas)
  const complexPatterns = Object.entries(analytics.personaManager.collaborationPatterns)
    .filter(([combo]) => combo.split('-').length >= 3)
    .sort(([,a], [,b]) => b - a);
  
  if (complexPatterns.length > 0) {
    console.log('\nComplex Collaboration Patterns:');
    complexPatterns.slice(0, 3).forEach(([pattern, count], index) => {
      const personas = pattern.split('-');
      console.log(`${index + 1}. ${personas.join(' + ')}: ${count} times`);
    });
  }
}
```

## User Experience Metrics

### Response Quality Tracking

```typescript
// Track user satisfaction and response quality
function trackResponseQuality() {
  const analytics = personaSystem.getAnalytics();
  
  // Calculate satisfaction metrics
  const topPatterns = analytics.learning.topPatterns;
  const totalRatings = topPatterns.reduce((sum, p) => sum + p.usage, 0);
  const weightedRating = topPatterns.reduce((sum, p) => sum + (p.rating * p.usage), 0) / totalRatings;
  
  console.log('User Experience Metrics:');
  console.log(`Average Rating: ${weightedRating.toFixed(2)}/5.0`);
  console.log(`Total Rated Interactions: ${totalRatings}`);
  
  // Quality distribution
  const ratingDistribution = {
    excellent: topPatterns.filter(p => p.rating >= 4.5).length,
    good: topPatterns.filter(p => p.rating >= 3.5 && p.rating < 4.5).length,
    average: topPatterns.filter(p => p.rating >= 2.5 && p.rating < 3.5).length,
    poor: topPatterns.filter(p => p.rating < 2.5).length
  };
  
  console.log('Quality Distribution:', ratingDistribution);
  
  // Identify improvement areas
  const lowRatedPatterns = topPatterns
    .filter(p => p.rating < 3.0)
    .sort((a, b) => a.rating - b.rating)
    .slice(0, 3);
  
  if (lowRatedPatterns.length > 0) {
    console.log('\nLow-Rated Patterns (Need Improvement):');
    lowRatedPatterns.forEach((pattern, index) => {
      console.log(`${index + 1}. ${pattern.personas.join(' + ')}: ${pattern.rating.toFixed(1)}/5.0`);
      console.log(`   Pattern: ${pattern.pattern}`);
    });
  }
}
```

## Debugging Workflows

### Step-by-Step Debugging Process

```typescript
// Comprehensive debugging workflow
async function debugPersonaIssue(input: string, expectedPersonas: string[]) {
  console.log('=== Persona System Debug Workflow ===');
  
  // Step 1: System Health Check
  console.log('1. System Health Check');
  const isReady = personaSystem.isReady();
  console.log(`   System Ready: ${isReady}`);
  
  if (!isReady) {
    console.log('   ❌ System not ready - initializing...');
    await personaSystem.initialize();
  }
  
  // Step 2: Input Analysis
  console.log('\n2. Input Analysis');
  console.log(`   Input: "${input}"`);
  console.log(`   Expected Personas: ${expectedPersonas.join(', ')}`);
  
  // Step 3: Manual Flag Detection
  console.log('\n3. Manual Flag Detection');
  const hasManualFlags = input.includes('--persona-');
  console.log(`   Manual Flags Detected: ${hasManualFlags}`);
  
  // Step 4: Context Preparation
  console.log('\n4. Context Preparation');
  const context = {
    cwd: process.cwd(),
    timestamp: new Date().toISOString(),
    debug: true
  };
  console.log(`   Context: ${JSON.stringify(context, null, 2)}`);
  
  // Step 5: Activation Process
  console.log('\n5. Activation Process');
  const result = await debugActivation(input, context);
  
  // Step 6: Result Validation
  console.log('\n6. Result Validation');
  const actualPersonas = result.personas?.activePersonas?.map(p => p.name) || [];
  const matches = expectedPersonas.filter(p => actualPersonas.includes(p));
  const missing = expectedPersonas.filter(p => !actualPersonas.includes(p));
  const unexpected = actualPersonas.filter(p => !expectedPersonas.includes(p));
  
  console.log(`   Expected: ${expectedPersonas.join(', ')}`);
  console.log(`   Actual: ${actualPersonas.join(', ')}`);
  console.log(`   Matches: ${matches.join(', ')}`);
  if (missing.length > 0) console.log(`   ❌ Missing: ${missing.join(', ')}`);
  if (unexpected.length > 0) console.log(`   ⚠️  Unexpected: ${unexpected.join(', ')}`);
  
  // Step 7: Recommendations
  console.log('\n7. Debug Recommendations');
  if (missing.length > 0) {
    console.log('   - Check persona auto-activation keywords');
    console.log('   - Verify confidence thresholds');
    console.log('   - Review context detection logic');
  }
  if (unexpected.length > 0) {
    console.log('   - Review keyword overlaps between personas');
    console.log('   - Check for overly broad activation patterns');
  }
  if (actualPersonas.length === 0) {
    console.log('   - Verify persona system initialization');
    console.log('   - Check for configuration errors');
    console.log('   - Review confidence threshold settings');
  }
  
  return { matches: matches.length, missing: missing.length, unexpected: unexpected.length };
}

// Example usage
await debugPersonaIssue(
  "Review this authentication code for security vulnerabilities",
  ["security", "backend"]
);
```

### Performance Bottleneck Identification

```typescript
// Identify performance bottlenecks
async function identifyBottlenecks() {
  console.log('=== Performance Bottleneck Analysis ===');
  
  const testInputs = [
    "Fix this security issue",
    "Optimize performance of this function", 
    "Review frontend accessibility",
    "Help with backend API design",
    "Set up CI/CD pipeline"
  ];
  
  const results = [];
  
  for (const input of testInputs) {
    const start = performance.now();
    
    // Time persona activation
    const activationStart = performance.now();
    const result = await personaSystem.processInput(input);
    const activationTime = performance.now() - activationStart;
    
    // Time prompt generation
    const promptStart = performance.now();
    const personas = result.personas?.activePersonas || [];
    if (personas.length > 0) {
      // Simulate prompt generation timing
      await new Promise(resolve => setTimeout(resolve, 1));
    }
    const promptTime = performance.now() - promptStart;
    
    const totalTime = performance.now() - start;
    
    results.push({
      input,
      personas: personas.map(p => p.name),
      activationTime: Math.round(activationTime * 100) / 100,
      promptTime: Math.round(promptTime * 100) / 100,
      totalTime: Math.round(totalTime * 100) / 100
    });
  }
  
  // Analyze results
  const avgActivation = results.reduce((sum, r) => sum + r.activationTime, 0) / results.length;
  const avgTotal = results.reduce((sum, r) => sum + r.totalTime, 0) / results.length;
  const slowest = results.sort((a, b) => b.totalTime - a.totalTime)[0];
  
  console.log('Performance Analysis:');
  console.log(`Average Activation Time: ${avgActivation.toFixed(2)}ms`);
  console.log(`Average Total Time: ${avgTotal.toFixed(2)}ms`);
  console.log(`Slowest Case: "${slowest.input}" (${slowest.totalTime}ms)`);
  
  // Identify bottlenecks
  if (avgActivation > 100) {
    console.log('⚠️  Activation time bottleneck detected');
  }
  if (avgTotal > 200) {
    console.log('⚠️  Overall performance bottleneck detected');
  }
  
  return results;
}
```

## Optimization Strategies

### Performance Optimization

```typescript
// Optimize persona system performance
class PersonaOptimizer {
  // Cache frequently used patterns
  private activationCache = new Map<string, any>();
  
  async optimizeActivation(input: string, context: any) {
    const cacheKey = this.generateCacheKey(input, context);
    
    // Check cache first
    if (this.activationCache.has(cacheKey)) {
      return this.activationCache.get(cacheKey);
    }
    
    // Process normally
    const result = await personaSystem.processInput(input, context);
    
    // Cache successful results
    if (result.success && result.personas?.activePersonas?.length > 0) {
      this.activationCache.set(cacheKey, result);
      
      // Limit cache size
      if (this.activationCache.size > 100) {
        const firstKey = this.activationCache.keys().next().value;
        this.activationCache.delete(firstKey);
      }
    }
    
    return result;
  }
  
  private generateCacheKey(input: string, context: any): string {
    const contextKey = JSON.stringify({
      files: context.files || [],
      command: context.command,
      projectType: context.projectType
    });
    return `${input}:${contextKey}`;
  }
  
  // Optimize confidence thresholds based on usage
  optimizeThresholds(analytics: SystemAnalytics) {
    const { personaUsage, averageConfidence } = analytics.personaManager;
    
    console.log('Threshold Optimization Recommendations:');
    
    // Lower threshold for underused personas with high confidence
    Object.entries(personaUsage).forEach(([persona, stats]) => {
      const avgConfidence = stats.totalConfidence / stats.count;
      
      if (stats.count < 5 && avgConfidence > 0.8) {
        console.log(`- Lower threshold for ${persona} (low usage, high confidence)`);
      }
      
      if (stats.count > 20 && avgConfidence < 0.6) {
        console.log(`- Raise threshold for ${persona} (high usage, low confidence)`);
      }
    });
  }
}
```

### Learning System Optimization

```typescript
// Optimize learning system based on analytics
function optimizeLearning(analytics: SystemAnalytics) {
  const learning = analytics.learning;
  
  console.log('Learning System Optimization:');
  
  // Adjust learning rate based on effectiveness
  if (learning.learningEffectiveness < 0.5) {
    console.log('- Increase learning rate (low effectiveness)');
    console.log('- Collect more user feedback');
    console.log('- Review pattern recognition algorithms');
  }
  
  // Focus on successful patterns
  const successfulPatterns = learning.topPatterns.filter(p => p.rating >= 4.0);
  if (successfulPatterns.length > 0) {
    console.log('- Reinforce successful patterns:');
    successfulPatterns.slice(0, 3).forEach(pattern => {
      console.log(`  * ${pattern.personas.join(' + ')}: ${pattern.rating.toFixed(1)}/5.0`);
    });
  }
  
  // Address failed patterns
  const failedPatterns = learning.topPatterns.filter(p => p.rating < 2.5);
  if (failedPatterns.length > 0) {
    console.log('- Review failed patterns:');
    failedPatterns.forEach(pattern => {
      console.log(`  * ${pattern.personas.join(' + ')}: ${pattern.rating.toFixed(1)}/5.0`);
    });
  }
}
```

This comprehensive analytics and debugging guide provides tools and workflows for monitoring, analyzing, and optimizing the Claude Code Buddy persona system for maximum effectiveness and user satisfaction.