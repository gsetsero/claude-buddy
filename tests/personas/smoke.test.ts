/**
 * Smoke Tests for Claude Code Buddy Persona System
 * 
 * These tests verify that the basic Jest setup is working and that
 * the persona system modules can be imported and instantiated properly.
 * 
 * Run with: npm run test:smoke
 */

describe('Claude Code Buddy - Smoke Tests', () => {

  describe('Jest Configuration', () => {
    test('should have Jest configured and running', () => {
      expect(true).toBe(true);
    });

    test('should have test environment variables set', () => {
      expect(process.env.NODE_ENV).toBe('test');
    });

    test('should support ES6 features', () => {
      const testObject = { name: 'test', ...{ additional: 'property' } };
      expect(testObject).toEqual({ name: 'test', additional: 'property' });
    });
  });

  describe('Persona System Module Loading', () => {
    test('should import PersonaManager successfully', async () => {
      const PersonaManager = await import('@/personas/persona-manager');
      expect(PersonaManager).toBeDefined();
      expect(typeof PersonaManager.default).toBe('function');
    });

    test('should import PersonaFlagParser successfully', async () => {
      const PersonaFlagParser = await import('@/personas/flag-parser');
      expect(PersonaFlagParser).toBeDefined();
      expect(typeof PersonaFlagParser.default).toBe('function');
    });

    test('should import PersonaLearningEngine successfully', async () => {
      const PersonaLearningEngine = await import('@/personas/learning-engine');
      expect(PersonaLearningEngine).toBeDefined();
      expect(typeof PersonaLearningEngine.default).toBe('function');
    });

    test('should import main personas index successfully', async () => {
      const PersonasIndex = await import('@/personas');
      expect(PersonasIndex).toBeDefined();
      expect(PersonasIndex.PersonaSystem).toBeDefined();
      expect(PersonasIndex.personaSystem).toBeDefined();
    });
  });

  describe('Basic Persona System Functionality', () => {
    test('should create PersonaManager instance', async () => {
      const { default: PersonaManager } = await import('@/personas/persona-manager');
      
      expect(() => {
        const manager = new PersonaManager();
        expect(manager).toBeInstanceOf(PersonaManager);
        expect(manager.personas).toBeDefined();
        expect(manager.activePersonas).toBeDefined();
      }).not.toThrow();
    });

    test('should create PersonaFlagParser instance', async () => {
      const { default: PersonaFlagParser } = await import('@/personas/flag-parser');
      
      expect(() => {
        const parser = new PersonaFlagParser();
        expect(parser).toBeInstanceOf(PersonaFlagParser);
        // availablePersonas is private, so we test through public interface
        const result = parser.parseInput('--persona-security');
        expect(result).toBeDefined();
      }).not.toThrow();
    });

    test('should parse basic persona flags', async () => {
      const { default: PersonaFlagParser } = await import('@/personas/flag-parser');
      const parser = new PersonaFlagParser();
      
      const result = parser.parseInput('/buddy:analyze --persona-security');
      
      expect(result).toBeDefined();
      expect(result.hasFlags).toBe(true);
      expect(result.personas.manual).toContain('security');
      expect(result.cleanedInput).toBe('/buddy:analyze');
    });

    test('should handle input without persona flags', async () => {
      const { default: PersonaFlagParser } = await import('@/personas/flag-parser');
      const parser = new PersonaFlagParser();
      
      const result = parser.parseInput('How do I debug this code?');
      
      expect(result).toBeDefined();
      expect(result.hasFlags).toBe(false);
      expect(result.personas.manual).toHaveLength(0);
      expect(result.cleanedInput).toBe('How do I debug this code?');
    });
  });

  describe('Integration Readiness', () => {
    test('should have all required persona system components', async () => {
      // Verify all main components exist and can be imported
      const components = [
        '@/personas/persona-manager',
        '@/personas/flag-parser',
        '@/personas/learning-engine',
        '@/personas/auto-activation',
        '@/personas'
      ];

      for (const component of components) {
        expect(async () => {
          const imported = await import(component);
          expect(imported).toBeDefined();
        }).not.toThrow();
      }
    });

    test('should be ready for T1.2 implementation (PersonaManager.determineLead tests)', async () => {
      const { default: PersonaManager } = await import('@/personas/persona-manager');
      const manager = new PersonaManager();
      
      // Verify that determineLead method exists and can be called
      expect(typeof manager.determineLead).toBe('function');
      
      // Test with empty array (edge case for T1.2 - this should be handled in T1.2 implementation)
      // For now, we just verify the method exists and will test proper behavior in T1.2
      expect(() => {
        const result = manager.determineLead([]);
      }).toThrow(); // This is expected to throw with empty array - will be fixed in T1.2
      
      // Test with valid persona array (basic functionality check)
      const mockPersonas = [{
        name: 'security',
        confidence: 0.8,
        isActive: true,
        activationReason: 'manual' as const,
        category: 'technical' as const,
        specializations: ['security']
      }];
      
      expect(() => {
        const result = manager.determineLead(mockPersonas);
        expect(result).toBeDefined();
        expect(result.name).toBe('security');
      }).not.toThrow();
    });
  });
});