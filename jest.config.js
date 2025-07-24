/**
 * Jest Configuration for Claude Code Buddy
 * 
 * Configured for testing the persona system with TypeScript support,
 * proper path mapping, coverage reporting, and environment setup.
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Test file patterns - support both JS and TS
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.test.ts',
    '**/tests/**/*.spec.js',
    '**/tests/**/*.spec.ts',
    '**/__tests__/**/*.js',
    '**/__tests__/**/*.ts'
  ],

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/'
  ],

  // Module path mapping for clean imports - point to TypeScript files
  moduleNameMapper: {
    // Persona system modules - now pointing to TypeScript files
    '^@/personas$': '<rootDir>/src/personas/index.ts',
    '^@/personas/(.*)$': '<rootDir>/src/personas/$1.ts',
    
    // Configuration modules
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
    
    // Hooks modules
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    
    // Slash commands
    '^@/slash-commands/(.*)$': '<rootDir>/src/slash-commands/$1',
    
    // Root src mapping (least specific)
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // Treat .ts files as ES modules and resolve .js imports to .ts
  extensionsToTreatAsEsm: ['.ts'],
  
  // Custom resolver to handle .js to .ts mapping
  resolver: '<rootDir>/jest-resolver.js',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

  // Coverage configuration - include TypeScript files
  collectCoverage: false, // Enable only when needed
  collectCoverageFrom: [
    'src/personas/**/*.{js,ts}',
    'src/config/**/*.{js,ts}',
    'src/hooks/**/*.{js,ts}',
    '!src/**/*.md',
    '!src/**/node_modules/**',
    '!src/**/__tests__/**',
    '!src/**/tests/**',
    '!src/**/*.d.ts'
  ],
  
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov'
  ],

  // Coverage thresholds (aspirational - will be enforced gradually)
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    },
    './src/personas/': {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },

  // Module file extensions - add TypeScript support
  moduleFileExtensions: [
    'ts',
    'js',
    'json',
    'node'
  ],

  // Transform configuration - add TypeScript support
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        target: 'ES2022',
        module: 'ES2022',
        moduleResolution: 'node',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: false,
        strict: false,
        noImplicitAny: false,
        strictNullChecks: false,
        strictFunctionTypes: false,
        strictBindCallApply: false,
        strictPropertyInitialization: false,
        noImplicitReturns: false,
        noFallthroughCasesInSwitch: false,
        noImplicitThis: false,
        noUnusedLocals: false,
        noUnusedParameters: false,
        resolveJsonModule: true
      }
    }]
  },

  // Global variables available in tests
  globals: {
    __TEST_ENV__: true
  },

  // Test timeout
  testTimeout: 10000,

  // Verbose output for debugging
  verbose: false,

  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,

  // Error handling
  errorOnDeprecated: true,

  // Test result processor
  testResultsProcessor: undefined,


  // Roots for module resolution
  roots: [
    '<rootDir>/src',
    '<rootDir>/tests'
  ],

  // Module directories
  moduleDirectories: [
    'node_modules',
    '<rootDir>/src',
    '<rootDir>/tests'
  ],

  // Mock configuration
  // Automatically mock file system operations for safety
  automock: false,
  
  // Manual mocks directory is automatically detected in node_modules and <rootDir>
  // Jest will look for __mocks__ directories automatically

  // Watch plugins for better development experience
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ].filter(plugin => {
    try {
      require.resolve(plugin);
      return true;
    } catch {
      return false;
    }
  }),

  // Notify mode for watch
  notify: false,

  // Display individual test results
  displayName: {
    name: 'Claude Code Buddy',
    color: 'blue'
  },

  // Reporters
  reporters: [
    'default',
    // Add additional reporters as needed
    // ['jest-html-reporters', {
    //   publicPath: './coverage',
    //   filename: 'test-report.html'
    // }]
  ],

  // Snapshot settings
  updateSnapshot: false,

  // Force exit after tests complete
  forceExit: false,

  // Detect leaks
  detectLeaks: false,

  // Max worker processes
  maxWorkers: '50%',

  // Cache directory
  cacheDirectory: '<rootDir>/node_modules/.cache/jest',

  // Preset - use ts-jest for TypeScript support
  preset: 'ts-jest'
};