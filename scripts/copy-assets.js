#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

/**
 * Cross-platform asset copying script for build process
 * Replaces Unix-specific mkdir and cp commands with Node.js fs-extra
 */

async function copyAssets() {
  try {
    console.log('Copying assets for distribution...');
    
    // Ensure dist directory exists
    await fs.ensureDir('dist');
    
    // Copy slash-commands
    await fs.ensureDir('dist/slash-commands');
    await fs.copy('src/slash-commands', 'dist/slash-commands');
    console.log('✓ Copied slash-commands');
    
    // Copy hooks
    await fs.copy('src/hooks', 'dist/hooks');
    console.log('✓ Copied hooks');
    
    // Copy config
    await fs.copy('src/config', 'dist/config');
    console.log('✓ Copied config');
    
    // Copy personas/specialists
    await fs.ensureDir('dist/personas/specialists');
    await fs.copy('src/personas/specialists', 'dist/personas/specialists');
    console.log('✓ Copied personas/specialists');
    
    console.log('Asset copying completed successfully!');
  } catch (error) {
    console.error('Error copying assets:', error.message);
    process.exit(1);
  }
}

// Run the script
copyAssets();