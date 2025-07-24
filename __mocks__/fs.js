/**
 * Mock File System for Claude Code Buddy Tests
 * 
 * Provides a safe, controlled file system mock for testing the persona system
 * without touching the actual file system.
 */

const path = require('path');

// In-memory file system storage
let mockFileSystem = new Map();
let mockDirectories = new Set();

// Default mock files for persona system
const defaultMockFiles = {
  'src/personas/config/personas-config.json': JSON.stringify({
    personas: {
      security: {
        category: 'technical',
        description: 'Security threat modeling specialist',
        specializations: ['vulnerability-assessment', 'threat-modeling'],
        auto_activation: {
          keywords: ['security', 'vulnerability', 'auth'],
          file_patterns: ['.env', 'auth.js', 'security.js'],
          confidence_threshold: 0.8
        },
        compatible_with: ['backend', 'devops'],
        priority_hierarchy: ['security', 'compliance', 'performance']
      },
      analyzer: {
        category: 'process',
        description: 'Root cause analysis specialist',
        specializations: ['debugging', 'investigation'],
        auto_activation: {
          keywords: ['debug', 'analyze', 'investigate'],
          file_patterns: ['*.log', 'error.js'],
          confidence_threshold: 0.7
        },
        compatible_with: ['qa', 'performance'],
        priority_hierarchy: ['evidence', 'thoroughness', 'accuracy']
      }
    },
    activation: {
      confidence_threshold: 0.7,
      max_active_personas: 3,
      collaboration_enabled: true
    }
  }),
  
  'src/personas/specialists/security.md': `# Security Persona - Mock Version

You are a security specialist focused on threat modeling and vulnerability assessment.

## Expertise
- OWASP Top 10
- Authentication and authorization  
- Secure coding practices

## Approach
- Security by default
- Defense in depth
- Zero trust architecture`,

  'src/personas/specialists/analyzer.md': `# Analyzer Persona - Mock Version

You are a systematic investigator focused on root cause analysis.

## Methodology
- Evidence-based investigation
- 5 Whys technique
- Systematic debugging

## Tools
- Log analysis
- Pattern recognition
- Hypothesis testing`
};

// Initialize with default files
function initializeDefaultFiles() {
  mockFileSystem.clear();
  mockDirectories.clear();
  
  Object.entries(defaultMockFiles).forEach(([filePath, content]) => {
    mockFileSystem.set(filePath, content);
    
    // Add parent directories
    let dir = path.dirname(filePath);
    while (dir && dir !== '.' && dir !== '/') {
      mockDirectories.add(dir);
      dir = path.dirname(dir);
    }
  });
}

// Initialize with default files on load
initializeDefaultFiles();

// File system mock implementation
const fs = jest.createMockFromModule('fs');

// Sync methods
fs.readFileSync = jest.fn((filePath, encoding) => {
  const content = mockFileSystem.get(filePath);
  if (content === undefined) {
    const error = new Error(`ENOENT: no such file or directory, open '${filePath}'`);
    error.code = 'ENOENT';
    error.errno = -2;
    error.path = filePath;
    throw error;
  }
  return encoding ? content : Buffer.from(content);
});

fs.writeFileSync = jest.fn((filePath, data) => {
  mockFileSystem.set(filePath, data.toString());
  
  // Add parent directory
  const dir = path.dirname(filePath);
  if (dir && dir !== '.') {
    mockDirectories.add(dir);
  }
});

fs.existsSync = jest.fn((filePath) => {
  return mockFileSystem.has(filePath) || mockDirectories.has(filePath);
});

fs.readdirSync = jest.fn((dirPath) => {
  const entries = [];
  
  // Find files in this directory
  for (const filePath of mockFileSystem.keys()) {
    if (path.dirname(filePath) === dirPath) {
      entries.push(path.basename(filePath));
    }
  }
  
  // Find subdirectories in this directory
  for (const dir of mockDirectories) {
    if (path.dirname(dir) === dirPath) {
      entries.push(path.basename(dir));
    }
  }
  
  return entries;
});

fs.statSync = jest.fn((filePath) => {
  if (!mockFileSystem.has(filePath) && !mockDirectories.has(filePath)) {
    const error = new Error(`ENOENT: no such file or directory, stat '${filePath}'`);
    error.code = 'ENOENT';
    error.errno = -2;
    error.path = filePath;
    throw error;
  }
  
  const isDirectory = mockDirectories.has(filePath);
  const isFile = mockFileSystem.has(filePath);
  
  return {
    isDirectory: () => isDirectory,
    isFile: () => isFile,
    size: isFile ? mockFileSystem.get(filePath).length : 0,
    mtime: new Date(),
    ctime: new Date(),
    atime: new Date()
  };
});

fs.mkdirSync = jest.fn((dirPath, options) => {
  mockDirectories.add(dirPath);
  
  if (options?.recursive) {
    let currentPath = dirPath;
    while (currentPath && currentPath !== '.' && currentPath !== '/') {
      mockDirectories.add(currentPath);
      currentPath = path.dirname(currentPath);
    }
  }
});

// Async methods (promisified versions)
const { promisify } = require('util');

fs.readFile = promisify((filePath, encoding, callback) => {
  if (typeof encoding === 'function') {
    callback = encoding;
    encoding = null;
  }
  
  try {
    const result = fs.readFileSync(filePath, encoding);
    callback(null, result);
  } catch (error) {
    callback(error);
  }
});

fs.writeFile = promisify((filePath, data, callback) => {
  try {
    fs.writeFileSync(filePath, data);
    callback(null);
  } catch (error) {
    callback(error);
  }
});

fs.readdir = promisify((dirPath, callback) => {
  try {
    const result = fs.readdirSync(dirPath);
    callback(null, result);
  } catch (error) {
    callback(error);
  }
});

fs.stat = promisify((filePath, callback) => {
  try {
    const result = fs.statSync(filePath);
    callback(null, result);
  } catch (error) {
    callback(error);
  }
});

fs.mkdir = promisify((dirPath, options, callback) => {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  
  try {
    fs.mkdirSync(dirPath, options);
    callback(null);
  } catch (error) {
    callback(error);
  }
});

// Promise-based API
fs.promises = {
  readFile: promisify(fs.readFile),
  writeFile: promisify(fs.writeFile),
  readdir: promisify(fs.readdir),
  stat: promisify(fs.stat),
  mkdir: promisify(fs.mkdir)
};

// Mock utility functions
fs.__setMockFiles = (newMockFiles) => {
  mockFileSystem.clear();
  mockDirectories.clear();
  
  Object.entries(newMockFiles).forEach(([filePath, content]) => {
    mockFileSystem.set(filePath, content);
    
    // Add parent directories
    let dir = path.dirname(filePath);
    while (dir && dir !== '.' && dir !== '/') {
      mockDirectories.add(dir);
      dir = path.dirname(dir);
    }
  });
};

fs.__addMockFile = (filePath, content) => {
  mockFileSystem.set(filePath, content);
  
  // Add parent directory
  const dir = path.dirname(filePath);
  if (dir && dir !== '.') {
    mockDirectories.add(dir);
  }
};

fs.__removeMockFile = (filePath) => {
  mockFileSystem.delete(filePath);
};

fs.__getMockFile = (filePath) => {
  return mockFileSystem.get(filePath);
};

fs.__getAllMockFiles = () => {
  return Object.fromEntries(mockFileSystem);
};

fs.__resetToDefaults = () => {
  initializeDefaultFiles();
};

fs.__clearAll = () => {
  mockFileSystem.clear();
  mockDirectories.clear();
};

module.exports = fs;