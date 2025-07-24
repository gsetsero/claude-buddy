/**
 * Basic TypeScript test to verify Jest setup
 */

describe('TypeScript Migration Test', () => {
  test('TypeScript features work', () => {
    // Test basic TypeScript features
    const result: number = 2 + 2;
    expect(result).toBe(4);

    // Test ES6 features
    const obj = { name: 'test', ...{ value: 42 } };
    expect(obj).toEqual({ name: 'test', value: 42 });

    // Test async/await (syntax)
    const asyncTest = async () => 'success';
    expect(typeof asyncTest).toBe('function');
  });

  test('Jest environment is working', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(typeof expect).toBe('function');
    expect(typeof describe).toBe('function');
    expect(typeof test).toBe('function');
  });
});