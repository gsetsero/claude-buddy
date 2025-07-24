/**
 * Jest Test Setup for Claude Code Buddy
 * 
 * Global test configuration and environment setup.
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.__TEST_ENV__ = 'true';

// Global test timeout
jest.setTimeout(10000);

// Suppress console logs during tests unless explicitly enabled
if (!process.env.JEST_VERBOSE) {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'info').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  // Keep console.error for debugging
}