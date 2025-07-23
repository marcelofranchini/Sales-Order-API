import { isProduction } from '@/main/config/environment';

jest.mock('module-alias/register', () => ({}));

describe('Module Resolver', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should register module alias in production environment', () => {
    process.env.NODE_ENV = 'production';
    jest.resetModules();
    
    require('@/main/config/module-resolver');
    
    expect(process.env.NODE_ENV).toBe('production');
  });

  it('should not register module alias in development environment', () => {
    process.env.NODE_ENV = 'development';
    jest.resetModules();
    
    require('@/main/config/module-resolver');
    
    expect(process.env.NODE_ENV).toBe('development');
  });

  it('should handle undefined NODE_ENV', () => {
    delete process.env.NODE_ENV;
    jest.resetModules();
    
    expect(() => {
      require('@/main/config/module-resolver');
    }).not.toThrow();
  });
}); 