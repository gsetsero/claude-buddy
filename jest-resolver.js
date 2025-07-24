/**
 * Custom Jest resolver to map .js imports to .ts files
 */

const { resolve } = require('path');
const { existsSync } = require('fs');

module.exports = (request, options) => {
  // If the request is for a .js file in our src directory, try to resolve to .ts
  if (request.endsWith('.js') && request.startsWith('./') || request.startsWith('../')) {
    const tsRequest = request.replace(/\.js$/, '.ts');
    const tsPath = resolve(options.basedir, tsRequest);
    
    if (existsSync(tsPath)) {
      return tsPath;
    }
  }
  
  // Fall back to default resolution
  return options.defaultResolver(request, options);
};