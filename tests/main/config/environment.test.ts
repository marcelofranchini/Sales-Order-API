import { Environment, EnvironmentUtils } from '@/main/config/environment';

describe('Environment', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Environment variables', () => {
    it('should load environment variables correctly', () => {
      process.env.MONGO_DB = 'mongodb://test:27017/test';
      process.env.PORT = '3001';
      process.env.NODE_ENV = 'test';
      process.env.APP_NAME = 'Test App';
      process.env.APP_VERSION = '2.0.0';

      jest.resetModules();
      const { Environment } = require('@/main/config/environment');

      expect(Environment.MONGO_DB).toBe('mongodb://test:27017/test');
      expect(Environment.PORT).toBe(3001);
      expect(Environment.NODE_ENV).toBe('test');
      expect(Environment.APP_NAME).toBe('Test App');
      expect(Environment.APP_VERSION).toBe('2.0.0');
    });

    it('should use default values when environment variables are not set', () => {
      delete process.env.MONGO_DB;
      delete process.env.PORT;
      delete process.env.NODE_ENV;
      delete process.env.APP_NAME;
      delete process.env.APP_VERSION;

      expect(() => {
        jest.resetModules();
        require('@/main/config/environment');
      }).toThrow('MONGO_DB environment variable is not defined');
    });

    it('should parse PORT as integer', () => {
      process.env.PORT = '8080';

      jest.resetModules();
      const { Environment } = require('@/main/config/environment');

      expect(Environment.PORT).toBe(8080);
      expect(typeof Environment.PORT).toBe('number');
    });
  });

  describe('EnvironmentUtils', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it('should return true for isDevelopment when NODE_ENV is dev', () => {
      process.env.NODE_ENV = 'dev';
      jest.resetModules();
      const { EnvironmentUtils } = require('@/main/config/environment');

      expect(EnvironmentUtils.isDevelopment()).toBe(true);
    });

    it('should return false for isDevelopment when NODE_ENV is not dev', () => {
      process.env.NODE_ENV = 'prd';
      jest.resetModules();
      const { EnvironmentUtils } = require('@/main/config/environment');

      expect(EnvironmentUtils.isDevelopment()).toBe(false);
    });

    it('should return true for isProduction when NODE_ENV is prd', () => {
      process.env.NODE_ENV = 'prd';
      jest.resetModules();
      const { EnvironmentUtils } = require('@/main/config/environment');

      expect(EnvironmentUtils.isProduction()).toBe(true);
    });

    it('should return false for isProduction when NODE_ENV is not prd', () => {
      process.env.NODE_ENV = 'dev';
      jest.resetModules();
      const { EnvironmentUtils } = require('@/main/config/environment');

      expect(EnvironmentUtils.isProduction()).toBe(false);
    });
  });
});
