# Claude Buddy Troubleshooting Guide

This comprehensive guide helps you diagnose and resolve common issues with Claude Buddy.

## Table of Contents

- [Quick Diagnosis](#quick-diagnosis)
- [Installation Issues](#installation-issues)
- [Persona System Issues](#persona-system-issues)
- [Hook System Issues](#hook-system-issues)
- [Performance Issues](#performance-issues)
- [Debug Mode](#debug-mode)
- [Common Error Messages](#common-error-messages)
- [Advanced Troubleshooting](#advanced-troubleshooting)
- [Getting Help](#getting-help)

## Quick Diagnosis

### System Health Check

Run this command to get a quick system status:

```bash
# Check if Claude Buddy is properly installed
claude-buddy --version

# Check UV installation
uv --version

# Check TypeScript compilation
npm run type-check

# Run smoke tests
npm run test:smoke
```

### Common Quick Fixes

1. **Restart Claude Code**: Close and reopen Claude Code
2. **Clear package cache**: `npm run build && npm install`
3. **Reinstall globally**: `npm run install-global`
4. **Check UV installation**: `uv --version`

## Installation Issues

### UV Not Found Error

**Symptoms**: `uv: command not found` or similar UV-related errors

**Diagnosis**:
```bash
# Check if UV is installed
which uv
uv --version
```

**Solutions**:

1. **Install UV**:
   ```bash
   # macOS/Linux
   curl -LsSf https://astral.sh/uv/install.sh | sh
   
   # Windows (PowerShell)
   powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
   
   # Using pip
   pip install uv
   ```

2. **Add UV to PATH**:
   ```bash
   # Add to your shell profile (.bashrc, .zshrc, etc.)
   export PATH="$HOME/.cargo/bin:$PATH"
   ```

3. **Verify installation**:
   ```bash
   uv --version
   # Should output: uv 0.1.x (or later)
   ```

### Node.js Version Issues

**Symptoms**: `Error: Node.js version 18.0.0 or higher is required`

**Solutions**:

1. **Update Node.js**:
   ```bash
   # Using nvm
   nvm install 18
   nvm use 18
   
   # Using n
   n latest
   ```

2. **Verify version**:
   ```bash
   node --version
   # Should be >= 18.0.0
   ```

### Permission Errors

**Symptoms**: `EACCES` or permission denied errors

**Solutions**:

1. **Fix npm permissions**:
   ```bash
   # Change npm global directory
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   
   # Add to PATH
   export PATH=~/.npm-global/bin:$PATH
   ```

2. **Use sudo for global install** (not recommended):
   ```bash
   sudo npm install -g claude-buddy
   ```

3. **Install locally instead**:
   ```bash
   npm install claude-buddy
   npx claude-buddy --project
   ```

## Persona System Issues

### Personas Not Loading

**Symptoms**: `No personas available` or empty persona list

**Diagnosis**:
```bash
# Check persona configuration
ls src/personas/specialists/
cat src/config/personas-config.json

# Use persona analytics for detailed diagnosis
npm run build
node -e "
const { personaSystem } = require('./dist/personas/index.js');
personaSystem.initialize().then(() => {
  const analytics = personaSystem.getAnalytics();
  console.log('System Health:', analytics.systemHealth);
  console.log('Available Personas:', analytics.systemHealth.availablePersonas);
});
"
```

**Solutions**:

1. **Verify persona files**:
   ```bash
   # Check if all 11 persona files exist
   ls src/personas/specialists/*.md | wc -l
   # Should output: 11
   ```

2. **Check configuration syntax**:
   ```bash
   # Validate JSON configuration
   uv run --no-project python -m json.tool src/config/personas-config.json
   ```

3. **Reinitialize persona system**:
   ```bash
   npm run build
   node -e "
   const { PersonaSystem } = require('./dist/personas/index.js');
   const system = new PersonaSystem();
   system.initialize().then(success => console.log('Init:', success));
   "
   ```

### Auto-Activation Not Working

**Symptoms**: Wrong personas activated or no auto-activation

**Debug Steps**:

1. **Persona Analytics Diagnostic**:
   ```bash
   # Get comprehensive activation analysis
   npm run build
   node -e "
   const { personaSystem } = require('./dist/personas/index.js');
   
   async function analyzeActivation() {
     await personaSystem.initialize();
     
     // Test activation with debug
     const result = await personaSystem.processInput(
       'Review security vulnerabilities',
       { files: ['auth.ts'], debug: true }
     );
     
     console.log('=== Activation Analysis ===');
     console.log('Success:', result.success);
     console.log('Active Personas:', result.personas?.activePersonas?.map(p => p.name));
     console.log('Confidence Scores:', result.personas?.activePersonas?.map(p => p.confidence));
     
     if (result.personas?.detectionResults) {
       console.log('Detection Results:');
       result.personas.detectionResults.recommendations.forEach(rec => {
         console.log(\`- \${rec.persona}: \${rec.confidence.toFixed(2)} (\${rec.reasoning})\`);
       });
     }
     
     // Get usage analytics
     const analytics = personaSystem.getAnalytics();
     console.log('\\n=== Usage Analytics ===');
     console.log('Total Interactions:', analytics.personaManager.totalInteractions);
     console.log('Average Confidence:', analytics.personaManager.averageConfidence);
     console.log('Learning Effectiveness:', analytics.learning.learningEffectiveness);
   }
   
   analyzeActivation().catch(console.error);
   "
   ```

2. **Check activation engine**:
   ```bash
   # Enable debug logging
   DEBUG=persona:activation npm run test:personas
   ```

3. **Test manual activation**:
   ```bash
   # Try manual persona flags
   claude-code --persona-security "review this code"
   ```

4. **Verify configuration**:
   ```javascript
   // Check persona auto-activation config
   const config = require('./src/config/personas-config.json');
   console.log(config.personas.security.auto_activation);
   ```

**Solutions**:

1. **Update activation keywords**:
   ```json
   {
     "personas": {
       "security": {
         "auto_activation": {
           "keywords": ["security", "vulnerability", "auth", "crypto"],
           "confidence_threshold": 0.7
         }
       }
     }
   }
   ```

2. **Reset learning data**:
   ```bash
   # Clear session memory
   rm -rf ~/.claude-buddy/sessions/
   ```

### Collaboration Issues

**Symptoms**: Personas not working together effectively

**Solutions**:

1. **Check collaboration matrix**:
   ```javascript
   // Verify collaboration patterns
   const manager = new PersonaManager();
   await manager.initialize();
   console.log(manager.collaborationMatrix);
   ```

2. **Test multi-persona activation**:
   ```bash
   claude-code --persona-security --persona-performance "optimize this code"
   ```

## Hook System Issues

### Hooks Not Executing

**Symptoms**: File protection or command validation not working

**Diagnosis**:
```bash
# Check hook configuration
cat src/config/hooks-config.json

# Test individual hook
uv run --no-project python hooks/file-guard.py --test
```

**Solutions**:

1. **Verify UV execution**:
   ```bash
   # Test UV Python execution
   uv run --no-project python -c "print('UV working')"
   ```

2. **Check hook permissions**:
   ```bash
   # Ensure hooks are executable
   chmod +x hooks/*.py
   ```

3. **Test hook manually**:
   ```bash
   # Run file guard directly
   uv run --no-project python hooks/file-guard.py "test-file.txt"
   ```

### File Guard False Positives

**Symptoms**: Legitimate files being blocked from modification

**Solutions**:

1. **Check protection patterns**:
   ```python
   # In hooks/file-guard.py
   PROTECTED_PATTERNS = [
       r'\.env$',           # Adjust patterns as needed
       r'\.env\.',
       r'keys?\.json$',
   ]
   ```

2. **Add file exceptions**:
   ```python
   # Add to file-guard.py
   EXCEPTION_PATTERNS = [
       r'test\.env$',       # Allow test environment files
       r'\.env\.example$',  # Allow example files
   ]
   ```

### Command Validation Issues

**Symptoms**: Valid commands being blocked

**Solutions**:

1. **Update command allowlist**:
   ```python
   # In hooks/command-validator.py
   ALLOWED_COMMANDS = [
       'git', 'npm', 'yarn', 'node', 'python', 'pip',
       'your-custom-command'  # Add your command
   ]
   ```

2. **Test command validation**:
   ```bash
   uv run --no-project python hooks/command-validator.py "your-command"
   ```

## Performance Issues

### Slow Persona Activation

**Symptoms**: Long delays before persona responses

**Diagnosis**:
```bash
# Profile persona activation
time npm run test:personas

# Check memory usage
ps aux | grep node

# Use persona analytics for performance analysis
npm run build
node -e "
const { personaSystem } = require('./dist/personas/index.js');

async function profilePerformance() {
  await personaSystem.initialize();
  
  console.log('=== Performance Profiling ===');
  const testInputs = [
    'Review security issues',
    'Optimize performance', 
    'Design architecture',
    'Fix bugs'
  ];
  
  for (const input of testInputs) {
    const start = Date.now();
    const result = await personaSystem.processInput(input);
    const duration = Date.now() - start;
    
    console.log(\`Input: \"\${input}\"\`);
    console.log(\`Duration: \${duration}ms\`);
    console.log(\`Personas: \${result.personas?.activePersonas?.map(p => p.name).join(', ') || 'none'}\`);
    console.log('---');
  }
  
  // Get overall analytics
  const analytics = personaSystem.getAnalytics();
  console.log('System Health:', analytics.systemHealth);
  console.log('Learning Effectiveness:', analytics.learning.learningEffectiveness);
}

profilePerformance().catch(console.error);
"
```

**Solutions**:

1. **Enable caching**:
   ```javascript
   // In PersonaSystem
   const system = new PersonaSystem({ 
     enableCaching: true,
     cacheTimeout: 5000 
   });
   ```

2. **Reduce confidence threshold**:
   ```json
   {
     "auto_activation": {
       "confidence_threshold": 0.6  // Lower = faster activation
     }
   }
   ```

3. **Monitor learning patterns**:
   ```bash
   # Check if learning system needs cleanup
   node -e "
   const { personaSystem } = require('./dist/personas/index.js');
   personaSystem.initialize().then(() => {
     const analytics = personaSystem.getAnalytics();
     console.log('Session interactions:', analytics.learning.sessionStats.interactions);
     console.log('Persistent patterns:', analytics.learning.persistentStats.successfulPatterns);
     if (analytics.learning.sessionStats.interactions > 1000) {
       console.log('RECOMMENDATION: Consider resetting session memory');
     }
   });
   "
   ```

### High Memory Usage

**Solutions**:

1. **Clear session memory**:
   ```javascript
   // Reset persona system periodically
   await personaSystem.reset();
   ```

2. **Limit interaction history**:
   ```javascript
   // In PersonaManager
   if (this.sessionMemory.interactions.length > 50) {
     this.sessionMemory.interactions = 
       this.sessionMemory.interactions.slice(-50);
   }
   ```

## Debug Mode

### Enable Debug Logging

```bash
# Enable all debug logs
DEBUG=* npm run dev

# Enable specific modules
DEBUG=persona:* npm run dev
DEBUG=hooks:* npm run dev
DEBUG=activation:* npm run dev
```

### Verbose Testing

```bash
# Run tests with detailed output
npm run test -- --verbose
npm run test:personas -- --verbose

# Debug specific test
npm run test:debug -- --grep "persona activation"
```

### System Information

```bash
# Collect system info for bug reports
node -e "
console.log('Node:', process.version);
console.log('Platform:', process.platform);
console.log('Arch:', process.arch);
console.log('Memory:', Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB');
"

uv --version
npm list claude-buddy
```

## Common Error Messages

### `TypeError: Cannot read property 'personas' of undefined`

**Cause**: Persona configuration not loaded
**Solution**: 
```bash
# Rebuild and ensure config exists
npm run build
ls src/config/personas-config.json
```

### `Error: spawn uv ENOENT`

**Cause**: UV not installed or not in PATH
**Solution**: Install UV and add to PATH (see UV installation above)

### `Failed to initialize persona system`

**Cause**: Configuration or file loading errors
**Solution**: 
```bash
# Check all required files
npm run test:smoke
# Fix any missing files or configuration errors
```

### `Hook execution timeout`

**Cause**: Hook taking too long to execute
**Solution**: 
```json
{
  "timeout": 10000,  // Increase timeout in hooks-config.json
}
```

## Advanced Troubleshooting

### Generate Diagnostic Report

```bash
# Create comprehensive diagnostic report
npm run build
node -e "
const { PersonaSystem } = require('./dist/personas/index.js');
const system = new PersonaSystem();

async function diagnose() {
  console.log('=== Claude Buddy Diagnostic Report ===');
  console.log('Date:', new Date().toISOString());
  console.log('Version:', require('./package.json').version);
  
  try {
    const success = await system.initialize();
    console.log('Initialization:', success ? 'SUCCESS' : 'FAILED');
    
    if (success) {
      const analytics = system.getAnalytics();
      console.log('Available personas:', analytics.systemHealth.availablePersonas);
      console.log('System ready:', system.isReady());
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

diagnose();
"
```

### Profile Performance

```bash
# Profile persona activation performance
node --prof -e "
const { PersonaSystem } = require('./dist/personas/index.js');
const system = new PersonaSystem();

async function profile() {
  await system.initialize();
  
  // Test activation speed
  const start = Date.now();
  await system.processInput('review security issues');
  const end = Date.now();
  
  console.log('Activation time:', end - start, 'ms');
}

profile();
"
```

### Memory Leak Detection

```bash
# Monitor memory usage over time
node --expose-gc -e "
const { PersonaSystem } = require('./dist/personas/index.js');
const system = new PersonaSystem();

async function memoryTest() {
  await system.initialize();
  
  for (let i = 0; i < 100; i++) {
    await system.processInput('test input ' + i);
    
    if (i % 10 === 0) {
      global.gc();
      const usage = process.memoryUsage();
      console.log('Iteration', i, 'Memory:', Math.round(usage.heapUsed / 1024 / 1024) + 'MB');
    }
  }
}

memoryTest();
"
```

## Getting Help

### Before Reporting Issues

1. **Search existing issues**: Check GitHub issues for similar problems
2. **Run diagnostic tests**: Use the commands in this guide
3. **Collect system information**: Node version, OS, Claude Buddy version
4. **Create minimal reproduction**: Simplest case that shows the problem

### What to Include in Bug Reports

```bash
# System information
node --version
uv --version
npm list claude-buddy

# Diagnostic output
npm run test:smoke 2>&1

# Error logs (if any)
DEBUG=* npm run dev 2>&1 | head -50
```

### Community Resources

- **GitHub Issues**: [claude-buddy/issues](https://github.com/claude-buddy/claude-buddy/issues)
- **Documentation**: [Project README](../README.md)
- **API Reference**: [API Documentation](./api/README.md)
- **Architecture**: [Architecture Decision Records](./architecture/README.md)

### Emergency Recovery

If Claude Buddy is completely broken:

```bash
# Complete reset
npm uninstall -g claude-buddy
rm -rf ~/.claude-buddy/
rm -rf node_modules/
npm cache clean --force

# Clean reinstall
npm install
npm run build
npm run install-global
```