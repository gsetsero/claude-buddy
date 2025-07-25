module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    // Disable rules that are too strict for this project
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    
    // Allow console.log for CLI tools
    'no-console': 'off',
    
    // Allow empty functions (common in CLI tools)
    '@typescript-eslint/no-empty-function': 'warn',
    
    // Allow require() for compatibility
    '@typescript-eslint/no-var-requires': 'warn',
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'tests/',
    '*.js',
    'jest.config.js',
    'jest-resolver.js',
    '.eslintrc.js',
    'scripts/*.js'
  ],
};