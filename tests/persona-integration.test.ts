/**
 * Persona Integration Test - Verify TypeScript migration didn't break Claude hooks integration
 */

describe('Persona Integration with Claude Hooks', () => {
  test('PersonaSystem can be imported and instantiated', async () => {
    const { PersonaSystem, personaSystem } = await import('@/personas');
    
    // Verify the class exists
    expect(PersonaSystem).toBeDefined();
    expect(typeof PersonaSystem).toBe('function');
    
    // Verify the singleton instance exists
    expect(personaSystem).toBeDefined();
    expect(personaSystem).toBeInstanceOf(PersonaSystem);
  });

  test('PersonaSystem processInput method is available and functional', async () => {
    const { personaSystem } = await import('@/personas');
    
    // Verify processInput method exists
    expect(typeof personaSystem.processInput).toBe('function');
    
    // Test basic processInput functionality (without full initialization)
    const result = await personaSystem.processInput('/buddy:analyze --persona-security');
    
    // Should return a processing result object
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    
    // Should have expected properties for Claude hooks integration
    expect(result).toHaveProperty('prompt');
    expect(result).toHaveProperty('personas');
    expect(result).toHaveProperty('success');
  });

  test('PersonaSystem can handle buddy commands for Claude hooks', async () => {
    const { personaSystem } = await import('@/personas');
    
    // Test various buddy command patterns that Claude hooks would send
    const testInputs = [
      '/buddy:analyze --persona-security',
      '/buddy:improve --comprehensive',
      '/buddy:review --with-qa',
      '/buddy:architect --focus security,performance'
    ];
    
    for (const input of testInputs) {
      const result = await personaSystem.processInput(input);
      
      // Should process without throwing errors
      expect(result).toBeDefined();
      expect(typeof result.prompt).toBe('object');
      expect(result.personas).toBeDefined();
      expect(typeof result.success).toBe('boolean');
    }
  });

  test('PersonaSystem flag parser works correctly', async () => {
    const { PersonaSystem } = await import('@/personas');
    const system = new PersonaSystem();
    
    // Verify getHelp method exists (used by Claude hooks)
    expect(typeof system.getHelp).toBe('function');
    
    const help = system.getHelp();
    expect(help).toBeDefined();
    expect(help.availablePersonas).toBeDefined();
    expect(help.examples).toBeDefined();
    expect(Array.isArray(help.examples)).toBe(true);
  });

  test('All persona system components are accessible', async () => {
    const PersonaModule = await import('@/personas');
    
    // Verify all exports that Claude hooks integration might need
    expect(PersonaModule.PersonaSystem).toBeDefined();
    expect(PersonaModule.personaSystem).toBeDefined();
    expect(PersonaModule.PersonaManager).toBeDefined();
    expect(PersonaModule.PersonaFlagParser).toBeDefined();
    expect(PersonaModule.PersonaLearningEngine).toBeDefined();
  });
});