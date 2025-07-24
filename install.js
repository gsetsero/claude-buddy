#!/usr/bin/env node

/**
 * Claude Buddy Installation Script
 * 
 * This script installs Claude Buddy slash commands and hooks into
 * Claude Code configuration directories, supporting both home and project modes.
 */

const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');

const program = new Command();

// Package information
const PACKAGE_NAME = 'claude-buddy';
const VERSION = '1.0.0';

// Installation modes
const INSTALL_MODES = {
  HOME: 'home',
  PROJECT: 'project'
};

// Default configurations
const HOME_CLAUDE_DIR = path.join(os.homedir(), '.claude');
const PROJECT_CLAUDE_DIR = path.join(process.cwd(), '.claude');

class ClaudeCodeBuddyInstaller {
  constructor() {
    this.mode = null;
    this.claudeDir = null;
    this.installDir = null;
    this.backupDir = null;
    this.smartBackup = true;
  }

  /**
   * Initialize the installer with the specified mode
   */
  async initialize(mode, smartBackup = true) {
    this.mode = mode;
    this.smartBackup = smartBackup;
    this.claudeDir = mode === INSTALL_MODES.HOME ? HOME_CLAUDE_DIR : PROJECT_CLAUDE_DIR;
    this.installDir = path.join(__dirname);
    this.backupDir = path.join(this.claudeDir, 'buddy-backup');

    console.log(chalk.blue.bold(`\n🔮 Claude Buddy Installer v${VERSION}`));
    console.log(chalk.gray(`Installing in ${mode} mode...`));
    console.log(chalk.gray(`Target directory: ${this.claudeDir}`));
    if (mode === INSTALL_MODES.PROJECT && smartBackup) {
      console.log(chalk.gray(`Smart backup: ${smartBackup ? 'enabled (skip backup if in git)' : 'disabled'}`));
    }
    console.log();
  }

  /**
   * Check system requirements and dependencies
   */
  async checkRequirements() {
    console.log(chalk.blue('🔧 Checking system requirements...'));
    
    const requirements = [];

    // Check Node.js version
    const nodeVersion = process.version;
    const nodeVersionNumber = parseInt(nodeVersion.slice(1).split('.')[0]);
    if (nodeVersionNumber >= 18) {
      console.log(chalk.green(`✓ Node.js ${nodeVersion}`));
    } else {
      console.log(chalk.red(`✗ Node.js ${nodeVersion} (requires >= 18.0.0)`));
      requirements.push('Node.js >= 18.0.0');
    }

    // Check UV (Astral Python Package Manager)
    try {
      const { execSync } = require('child_process');
      // Try common installation paths for uv
      const uvPaths = [
        'uv',
        path.join(os.homedir(), '.local', 'bin', 'uv'),
        '/usr/local/bin/uv',
        '/opt/homebrew/bin/uv'
      ];
      
      let uvVersion = null;
      for (const uvPath of uvPaths) {
        try {
          uvVersion = execSync(`${uvPath} --version`, { encoding: 'utf8' }).trim();
          break;
        } catch (e) {
          continue;
        }
      }
      
      if (uvVersion) {
        console.log(chalk.green(`✓ ${uvVersion}`));
      } else {
        throw new Error('UV not found in any common location');
      }
    } catch (error) {
      console.log(chalk.red('✗ UV not found'));
      requirements.push('UV (Astral Python Package Manager)');
    }

    // Check Git
    try {
      const { execSync } = require('child_process');
      const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
      console.log(chalk.green(`✓ ${gitVersion}`));
    } catch (error) {
      console.log(chalk.red('✗ Git not found'));
      requirements.push('Git');
    }

    // Check Claude Code
    const claudeCodeInstalled = await this.checkClaudeCode();
    if (claudeCodeInstalled) {
      console.log(chalk.green('✓ Claude Code detected'));
    } else {
      console.log(chalk.yellow('⚠ Claude Code not detected (make sure it\'s installed and accessible)'));
    }

    if (requirements.length > 0) {
      console.log(chalk.red(`\n❌ Missing requirements: ${requirements.join(', ')}`));
      console.log(chalk.yellow('Please install the missing dependencies and try again.'));
      process.exit(1);
    }

    console.log(chalk.green('✅ All requirements satisfied\n'));
  }

  /**
   * Check if Claude Code is installed and accessible
   */
  async checkClaudeCode() {
    try {
      const { execSync } = require('child_process');
      execSync('claude --version', { encoding: 'utf8', stdio: 'pipe' });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if current directory is in a git repository
   */
  async isInGitRepository() {
    try {
      const { execSync } = require('child_process');
      execSync('git rev-parse --git-dir', { encoding: 'utf8', stdio: 'pipe', cwd: process.cwd() });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Create necessary directories
   */
  async createDirectories() {
    console.log(chalk.blue('📁 Creating directory structure...'));

    const directories = [
      this.claudeDir,
      path.join(this.claudeDir, 'commands'),
      path.join(this.claudeDir, 'hooks'),
      path.join(this.claudeDir, 'personas'),
      path.join(this.claudeDir, 'personas', 'config'),
      path.join(this.claudeDir, 'personas', 'specialists'),
      path.join(this.claudeDir, 'personas', 'data')
    ];

    // Create data directory for learning engine
    const dataDir = path.join(process.cwd(), '.claude-buddy');
    directories.push(dataDir);

    for (const dir of directories) {
      await fs.ensureDir(dir);
      console.log(chalk.green(`✓ ${path.relative(process.cwd(), dir)}`));
    }

    console.log(chalk.green('✅ Directory structure created\n'));
  }

  /**
   * Backup existing configuration
   */
  async backupExistingConfig() {
    console.log(chalk.blue('💾 Backing up existing configuration...'));

    // Smart backup logic: skip backup for project mode if in git and smart backup is enabled
    if (this.mode === INSTALL_MODES.PROJECT && this.smartBackup) {
      const isInGit = await this.isInGitRepository();
      if (isInGit) {
        console.log(chalk.cyan('🧠 Smart backup: Skipping backup (project is in git repository)'));
        console.log(chalk.gray('   Git already provides version control for .claude configuration\n'));
        return;
      }
    }

    const filesToBackup = [
      { src: path.join(this.claudeDir, 'config.json'), dst: 'config.json' },
      { src: path.join(this.claudeDir, 'hooks.json'), dst: 'hooks.json' },
      { src: path.join(this.claudeDir, 'commands'), dst: 'commands' }
    ];

    let backupCreated = false;

    for (const file of filesToBackup) {
      if (await fs.pathExists(file.src)) {
        // Create backup directory only when we have something to backup
        if (!backupCreated) {
          await fs.ensureDir(this.backupDir);
        }
        
        const backupPath = path.join(this.backupDir, file.dst);
        await fs.copy(file.src, backupPath);
        console.log(chalk.yellow(`📦 Backed up ${file.dst}`));
        backupCreated = true;
      }
    }

    if (backupCreated) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const timestampedBackup = path.join(this.claudeDir, `buddy-backup-${timestamp}`);
      await fs.move(this.backupDir, timestampedBackup);
      console.log(chalk.green(`✅ Backup created: ${path.relative(process.cwd(), timestampedBackup)}\n`));
    } else {
      console.log(chalk.gray('No existing configuration to backup\n'));
    }
  }

  /**
   * Install slash commands
   */
  async installSlashCommands() {
    console.log(chalk.blue('⚡ Installing slash commands...'));

    const sourceDir = path.join(this.installDir, 'src', 'slash-commands');
    const targetDir = path.join(this.claudeDir, 'commands');
    const namespaceDir = path.join(targetDir, 'buddy');

    // Create namespace directory
    await fs.ensureDir(namespaceDir);

    const slashCommands = await fs.readdir(sourceDir);

    for (const command of slashCommands) {
      if (command.endsWith('.md')) {
        const sourcePath = path.join(sourceDir, command);
        const targetPath = path.join(namespaceDir, command);
        
        await fs.copy(sourcePath, targetPath);
        console.log(chalk.green(`✓ /buddy:${command.replace('.md', '')}`));
      }
    }

    console.log(chalk.green('✅ Slash commands installed in buddy namespace\n'));
  }

  /**
   * Install and configure hooks
   */
  async installHooks() {
    console.log(chalk.blue('🪝 Installing safety hooks...'));

    // Copy hook scripts
    const sourceDir = path.join(this.installDir, 'src', 'hooks');
    const targetDir = path.join(this.claudeDir, 'hooks');

    const hookFiles = await fs.readdir(sourceDir);

    for (const hookFile of hookFiles) {
      if (hookFile.endsWith('.py')) {
        const sourcePath = path.join(sourceDir, hookFile);
        const targetPath = path.join(targetDir, hookFile);
        
        await fs.copy(sourcePath, targetPath);
        
        // Make hook scripts executable
        try {
          await fs.chmod(targetPath, '755');
        } catch (error) {
          // chmod might not be available on all systems
        }
        
        console.log(chalk.green(`✓ ${hookFile}`));
      }
    }

    // Install hook configuration
    await this.installHookConfig();

    console.log(chalk.green('✅ Safety hooks installed\n'));
  }

  /**
   * Install hook configuration
   */
  async installHookConfig() {
    const sourceConfigPath = path.join(this.installDir, 'src', 'config', 'hooks-config.json');
    const targetConfigPath = path.join(this.claudeDir, 'hooks.json');

    // Read source configuration
    const hooksConfig = await fs.readJson(sourceConfigPath);

    // Replace template variables with actual paths
    const configStr = JSON.stringify(hooksConfig, null, 2)
      .replace(/{{INSTALL_DIR}}/g, this.claudeDir);

    const processedConfig = JSON.parse(configStr);

    // Merge with existing hooks.json if it exists
    let finalConfig = processedConfig;
    if (await fs.pathExists(targetConfigPath)) {
      try {
        const existingConfig = await fs.readJson(targetConfigPath);
        finalConfig = this.mergeHookConfigs(existingConfig, processedConfig);
        console.log(chalk.yellow('📝 Merged with existing hooks configuration'));
      } catch (error) {
        console.log(chalk.yellow('⚠ Could not merge existing hooks configuration, using new configuration'));
      }
    }

    await fs.writeJson(targetConfigPath, finalConfig, { spaces: 2 });
    console.log(chalk.green('✓ hooks.json configured'));
  }

  /**
   * Merge hook configurations
   */
  mergeHookConfigs(existing, newConfig) {
    const merged = { ...existing };

    for (const [eventType, hooks] of Object.entries(newConfig.hooks)) {
      if (!merged.hooks) merged.hooks = {};
      if (!merged.hooks[eventType]) merged.hooks[eventType] = [];

      // Add new hooks that don't already exist
      for (const hook of hooks) {
        const existingHook = merged.hooks[eventType].find(h => 
          h.matcher === hook.matcher && 
          h.hooks.some(hh => hh.command.includes('claude-buddy'))
        );

        if (!existingHook) {
          merged.hooks[eventType].push(hook);
        }
      }
    }

    return merged;
  }

  /**
   * Install persona system
   */
  async installPersonaSystem() {
    console.log(chalk.blue('🎭 Installing persona system...'));

    // Install core persona system files
    const coreFiles = [
      'index.js',
      'persona-manager.js',
      'auto-activation.js',
      'flag-parser.js',
      'learning-engine.js'
    ];

    const sourceDir = path.join(this.installDir, 'src', 'personas');
    const targetDir = path.join(this.claudeDir, 'personas');

    for (const file of coreFiles) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      
      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, targetPath);
        console.log(chalk.green(`✓ ${file}`));
      }
    }

    // Install persona configuration
    const configSourcePath = path.join(sourceDir, 'config', 'personas-config.json');
    const configTargetPath = path.join(targetDir, 'config', 'personas-config.json');
    
    if (await fs.pathExists(configSourcePath)) {
      await fs.copy(configSourcePath, configTargetPath);
      console.log(chalk.green('✓ personas-config.json'));
    }

    // Install persona specialists
    const specialistsSourceDir = path.join(sourceDir, 'specialists');
    const specialistsTargetDir = path.join(targetDir, 'specialists');

    if (await fs.pathExists(specialistsSourceDir)) {
      const specialists = await fs.readdir(specialistsSourceDir);
      
      for (const specialist of specialists) {
        if (specialist.endsWith('.md')) {
          const sourcePath = path.join(specialistsSourceDir, specialist);
          const targetPath = path.join(specialistsTargetDir, specialist);
          
          await fs.copy(sourcePath, targetPath);
          console.log(chalk.green(`✓ ${specialist.replace('.md', '')} persona`));
        }
      }
    }

    // Create package.json for persona system dependencies
    const personaPackageJson = {
      name: 'claude-buddy-personas',
      version: '1.0.0',
      private: true,
      main: 'index.js',
      dependencies: {
        'fs-extra': '^11.1.0'
      }
    };

    await fs.writeJson(path.join(targetDir, 'package.json'), personaPackageJson, { spaces: 2 });
    console.log(chalk.green('✓ package.json created'));

    // Initialize persona system data directory
    const dataDir = path.join(process.cwd(), '.claude-buddy');
    await fs.ensureDir(dataDir);
    
    // Create initial learning data structure
    const initialLearningData = {
      version: '1.0.0',
      initialized: new Date().toISOString(),
      successfulPatterns: [],
      failedPatterns: [],
      userPreferences: {},
      projectPatterns: {},
      adaptationHistory: [],
      performanceMetrics: {}
    };

    const memoryFilePath = path.join(dataDir, 'persona-memory.json');
    if (!(await fs.pathExists(memoryFilePath))) {
      await fs.writeJson(memoryFilePath, initialLearningData, { spaces: 2 });
      console.log(chalk.green('✓ Learning engine initialized'));
    }

    console.log(chalk.green('✅ Persona system installed with 11 domain experts\n'));
  }

  /**
   * Install buddy configuration
   */
  async installBuddyConfig() {
    console.log(chalk.blue('⚙️ Installing Claude Buddy configuration...'));

    const sourceConfigPath = path.join(this.installDir, 'src', 'config', 'buddy-config.json');
    const targetConfigPath = path.join(this.claudeDir, 'buddy-config.json');

    // Read source configuration
    const buddyConfig = await fs.readJson(sourceConfigPath);
    
    // Set installation mode
    buddyConfig.mode = this.mode;

    // Check if config already exists
    if (await fs.pathExists(targetConfigPath)) {
      const { updateConfig } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'updateConfig',
          message: 'Claude Buddy configuration already exists. Update it?',
          default: true
        }
      ]);

      if (updateConfig) {
        // Merge configurations
        try {
          const existingConfig = await fs.readJson(targetConfigPath);
          const mergedConfig = { ...buddyConfig, ...existingConfig };
          mergedConfig.mode = this.mode; // Ensure mode is updated
          await fs.writeJson(targetConfigPath, mergedConfig, { spaces: 2 });
          console.log(chalk.green('✓ Configuration updated'));
        } catch (error) {
          await fs.writeJson(targetConfigPath, buddyConfig, { spaces: 2 });
          console.log(chalk.green('✓ Configuration installed (existing config was invalid)'));
        }
      } else {
        console.log(chalk.gray('Configuration installation skipped'));
      }
    } else {
      await fs.writeJson(targetConfigPath, buddyConfig, { spaces: 2 });
      console.log(chalk.green('✓ Configuration installed'));
    }

    console.log(chalk.green('✅ Claude Buddy configuration ready\n'));
  }

  /**
   * Create README and documentation
   */
  async createDocumentation() {
    console.log(chalk.blue('📚 Creating documentation...'));

    const readmePath = path.join(this.claudeDir, 'CLAUDE_BUDDY.md');
    const readme = this.generateReadme();

    await fs.writeFile(readmePath, readme);
    console.log(chalk.green('✓ CLAUDE_BUDDY.md created'));

    console.log(chalk.green('✅ Documentation created\n'));
  }

  /**
   * Generate README content
   */
  generateReadme() {
    return `# Claude Buddy

🔮 **Your intelligent AI development companion with domain expertise**

## Installed Features

### 🎭 **Intelligent Persona System**
- **11 Domain Experts**: Architecture, frontend, backend, security, performance, and more
- **Auto-Activation**: Context-aware persona selection based on project analysis
- **Manual Control**: Fine-grained persona control with \`--persona-{name}\` flags
- **Collaborative Intelligence**: Multi-persona coordination for comprehensive solutions
- **Adaptive Learning**: System improves through usage patterns and feedback

### 🪝 Safety Hooks
- **File Protection**: Blocks writes to sensitive files (.env, keys, secrets)
- **Command Validation**: Prevents dangerous bash commands (rm -rf, etc.)
- **Auto-formatting**: Formats code files after writing

### ⚡ Slash Commands with Persona Intelligence
- \`/buddy:analyze\` - Multi-dimensional analysis with automatic expert activation
- \`/buddy:improve\` - Systematic enhancement with quality, performance, and security focus
- \`/buddy:architect\` - System architecture design with domain expertise
- \`/buddy:commit\` - AI-powered conventional commits with scribe persona
- \`/buddy:review\` - Comprehensive multi-persona code review
- \`/buddy:changelog\` - Generate intelligent changelogs
- \`/buddy:readme\` - Generate professional README files
- \`/buddy:docs\` - Create technical documentation
- \`/buddy:brainstorm\` - AI-powered feature ideation

## Available Personas

- **🏗️ Architect**: Systems design, scalability, architecture patterns
- **🎨 Frontend**: UI/UX, accessibility, responsive design, performance
- **⚙️ Backend**: APIs, databases, server reliability, data integrity
- **🛡️ Security**: Threat modeling, vulnerabilities, compliance
- **⚡ Performance**: Optimization, bottlenecks, efficiency
- **🔍 Analyzer**: Root cause analysis, systematic investigation
- **🧪 QA**: Quality assurance, testing, validation
- **🔧 Refactorer**: Code quality, technical debt, maintainability
- **🚀 DevOps**: Infrastructure, deployment, observability
- **👨‍🏫 Mentor**: Knowledge transfer, education, guidance
- **✍️ Scribe**: Professional writing, documentation

## Configuration

Configuration files:
- \`buddy-config.json\` - Main Claude Buddy settings including persona preferences
- \`hooks.json\` - Hook configuration for Claude Code
- \`personas/config/personas-config.json\` - Persona system configuration

## Usage Examples

### Automatic Persona Activation
\`\`\`
/buddy:analyze                    # Auto-detects and activates relevant experts
/buddy:review                     # Multi-persona security, QA, and performance review
/buddy:improve                    # Quality, performance, and architecture enhancement
\`\`\`

### Manual Persona Control
\`\`\`
/buddy:analyze --persona-security --persona-performance
/buddy:improve --persona-refactorer --with-performance --with-security
/buddy:review --focus security,performance,quality
/buddy:architect --comprehensive --learn
\`\`\`

Safety hooks and persona intelligence work automatically in the background.

## Learning & Adaptation

The persona system learns from your usage patterns and feedback to improve activation accuracy over time. Learning data is stored in \`.claude-buddy/persona-memory.json\`.

## Logs

Activity logs are stored in:
- \`.claude-buddy/protection.log\` - File protection events
- \`.claude-buddy/commands.log\` - Command validation events
- \`.claude-buddy/formatting.log\` - Auto-formatting events
- \`.claude-buddy/persona-analytics.json\` - Persona system analytics

## Support

For issues or questions, visit: https://github.com/claude-buddy/claude-buddy

---

Installed on: ${new Date().toISOString()}
Mode: ${this.mode}
Version: ${VERSION}
Persona System: Enabled with 11 domain experts
`;
  }

  /**
   * Show installation summary
   */
  showSummary() {
    console.log(chalk.blue.bold('🎉 Installation Complete!\n'));

    console.log(chalk.green('✅ Claude Buddy with Persona System is now installed and ready to use.\n'));

    console.log(chalk.blue.bold('🎭 Persona System:'));
    console.log(chalk.white('• 11 domain expert personas with auto-activation intelligence'));
    console.log(chalk.white('• Context-aware persona selection and collaboration'));
    console.log(chalk.white('• Manual override controls with --persona-{name} flags'));
    console.log(chalk.white('• Adaptive learning for improved accuracy over time\n'));

    console.log(chalk.blue.bold('Available Commands:'));
    console.log(chalk.white('• /buddy:analyze     - Multi-dimensional analysis with expert activation'));
    console.log(chalk.white('• /buddy:improve     - Systematic enhancement with persona collaboration'));
    console.log(chalk.white('• /buddy:architect   - Architecture design with domain expertise'));
    console.log(chalk.white('• /buddy:commit      - AI-powered git commits with scribe persona'));
    console.log(chalk.white('• /buddy:review      - Multi-persona code review and security analysis'));
    console.log(chalk.white('• /buddy:changelog   - Generate intelligent changelogs'));
    console.log(chalk.white('• /buddy:readme      - Generate professional READMEs'));
    console.log(chalk.white('• /buddy:docs        - Create technical documentation'));
    console.log(chalk.white('• /buddy:brainstorm  - AI-powered feature ideas\n'));

    console.log(chalk.blue.bold('Persona Examples:'));
    console.log(chalk.white('• /buddy:analyze --persona-security --persona-performance'));
    console.log(chalk.white('• /buddy:improve --comprehensive --learn'));
    console.log(chalk.white('• /buddy:architect --with-security --focus scalability\n'));

    console.log(chalk.blue.bold('Safety Features:'));
    console.log(chalk.white('• File protection for sensitive files'));
    console.log(chalk.white('• Command validation for dangerous operations'));
    console.log(chalk.white('• Auto-formatting for code files\n'));

    console.log(chalk.blue.bold('Next Steps:'));
    console.log(chalk.white('1. Restart Claude Code if it\'s currently running'));
    console.log(chalk.white('2. Try running /buddy:analyze to see persona intelligence in action'));
    console.log(chalk.white('3. Customize persona preferences in buddy-config.json'));
    console.log(chalk.white('4. Use --persona-{name} flags for manual control\n'));

    console.log(chalk.gray(`Installation mode: ${this.mode}`));
    console.log(chalk.gray(`Configuration directory: ${this.claudeDir}`));
    console.log(chalk.gray(`Persona system: 11 domain experts installed`));
    console.log(chalk.gray(`Documentation: ${path.join(this.claudeDir, 'CLAUDE_BUDDY.md')}\n`));
  }

  /**
   * Main installation process
   */
  async install(mode, smartBackup = true) {
    try {
      await this.initialize(mode, smartBackup);
      await this.checkRequirements();
      await this.createDirectories();
      await this.backupExistingConfig();
      await this.installSlashCommands();
      await this.installPersonaSystem();
      await this.installHooks();
      await this.installBuddyConfig();
      await this.createDocumentation();
      this.showSummary();
    } catch (error) {
      console.error(chalk.red(`\n❌ Installation failed: ${error.message}`));
      if (error.stack) {
        console.error(chalk.gray(error.stack));
      }
      process.exit(1);
    }
  }
}

/**
 * Interactive installation mode selection
 */
async function selectInstallationMode() {
  console.log(chalk.blue.bold(`\n🔮 Claude Buddy Installer v${VERSION}`));
  console.log(chalk.gray('Choose your installation mode:\n'));

  const { mode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'Installation mode:',
      choices: [
        {
          name: '🏠 Home Mode - Global configuration for all projects',
          value: INSTALL_MODES.HOME,
          short: 'Home'
        },
        {
          name: '📁 Project Mode - Project-specific configuration',
          value: INSTALL_MODES.PROJECT,
          short: 'Project'
        }
      ]
    }
  ]);

  let smartBackup = true;

  // Ask about smart backup only for project mode
  if (mode === INSTALL_MODES.PROJECT) {
    const { enableSmartBackup } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'enableSmartBackup',
        message: 'Enable smart backup? (Skip backup if project is in git repository)',
        default: true
      }
    ]);
    smartBackup = enableSmartBackup;
  }

  return { mode, smartBackup };
}

/**
 * Command line interface setup
 */
program
  .name(PACKAGE_NAME)
  .description('Claude Code Buddy installation script')
  .version(VERSION)
  .addHelpText('after', `
Examples:
  $ claude-buddy --global                    # Global installation
  $ claude-buddy --project                   # Project installation with smart backup
  $ claude-buddy --project --smart-backup false  # Project installation with forced backup
  $ claude-buddy                             # Interactive installation

Smart Backup (Project Mode Only):
  When smart backup is enabled (default), the installer will skip creating
  backup files if the project is already in a git repository, since git
  provides version control for the .claude configuration.
`);

program
  .option('--global', 'Install in home mode (global configuration)')
  .option('--project', 'Install in project mode (project-specific configuration)')
  .option('--smart-backup [value]', 'Smart backup mode - skip backup if project is in git (default: true)', 'true')
  .option('--dev', 'Development mode installation');

program.parse();

/**
 * Main execution
 */
async function main() {
  const options = program.opts();
  const installer = new ClaudeCodeBuddyInstaller();

  let mode;
  let smartBackup = true;

  if (options.global) {
    mode = INSTALL_MODES.HOME;
    // Smart backup not applicable for global mode
  } else if (options.project) {
    mode = INSTALL_MODES.PROJECT;
    // Parse smart backup option (defaults to true)
    smartBackup = options.smartBackup === 'false' ? false : true;
  } else {
    const result = await selectInstallationMode();
    mode = result.mode;
    smartBackup = result.smartBackup;
  }

  await installer.install(mode, smartBackup);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red(`Fatal error: ${error.message}`));
    process.exit(1);
  });
}

module.exports = { ClaudeCodeBuddyInstaller, INSTALL_MODES };