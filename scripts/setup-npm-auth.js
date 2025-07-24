#!/usr/bin/env node

/**
 * NPM Authentication Setup Script
 * 
 * This script configures npm authentication using the NPM_TOKEN environment variable.
 * It supports loading NPM_TOKEN from:
 * 1. Environment variables (NPM_TOKEN=xxx)
 * 2. .env file (NPM_TOKEN=xxx)
 * 3. .env.local file (NPM_TOKEN=xxx)
 * 
 * If NPM_TOKEN is not found, it falls back to existing npm authentication.
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env files
function loadEnvFiles() {
  const envFiles = ['.env.local', '.env'];
  
  for (const envFile of envFiles) {
    const envPath = path.join(process.cwd(), envFile);
    if (fs.existsSync(envPath)) {
      try {
        require('dotenv').config({ path: envPath });
        console.log(`📄 Loaded environment variables from ${envFile}`);
      } catch (error) {
        console.warn(`⚠️  Warning: Could not load ${envFile}:`, error.message);
      }
    }
  }
}

function setupNpmAuth() {
  // Load .env files first
  loadEnvFiles();
  
  const npmToken = process.env.NPM_TOKEN;
  
  if (!npmToken) {
    console.log('ℹ️  NPM_TOKEN not found in environment variables or .env files');
    console.log('ℹ️  Using existing npm authentication (if any)');
    console.log('ℹ️  To use token authentication:');
    console.log('   • Set NPM_TOKEN environment variable: export NPM_TOKEN=your_token');
    console.log('   • Or add NPM_TOKEN=your_token to .env file');
    return;
  }

  const npmrcPath = path.join(process.cwd(), '.npmrc');
  const npmrcContent = `//registry.npmjs.org/:_authToken=${npmToken}\n`;

  try {
    fs.writeFileSync(npmrcPath, npmrcContent);
    console.log('✅ NPM authentication configured successfully');
    console.log('✅ Using token-based authentication for npm publish');
  } catch (error) {
    console.error('❌ Failed to write .npmrc file:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupNpmAuth();