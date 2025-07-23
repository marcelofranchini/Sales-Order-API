import { Environment, isDevelopment, isProduction } from '@/main/config/environment';

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
      process.env.MONGODB_URI = 'mongodb://test:27017/test';
      process.env.PORT = '3001';
      process.env.NODE_ENV = 'test';
      process.env.npm_package_name = 'Test App';
      process.env.npm_package_version = '2.0.0';

      jest.resetModules();
      const { Environment } = require('@/main/config/environment');

      expect(Environment.MONGODB_URI).toBe('mongodb://test:27017/test');
      expect(Environment.PORT).toBe(3001);
      expect(Environment.NODE_ENV).toBe('test');
      expect(Environment.APP_NAME).toBe('Test App');
      expect(Environment.APP_VERSION).toBe('2.0.0');
    });

    it('should use default values when environment variables are not set', () => {
      delete process.env.MONGODB_URI;
      delete process.env.PORT;
      delete process.env.NODE_ENV;
      delete process.env.npm_package_name;
      delete process.env.npm_package_version;

      jest.resetModules();
      const { Environment } = require('@/main/config/environment');

      expect(Environment.MONGODB_URI).toBe('mongodb://localhost:27017/sales');
      expect(Environment.PORT).toBe(3000);
      expect(Environment.NODE_ENV).toBe('dev');
      expect(Environment.APP_NAME).toBe('Sales Order API');
      expect(Environment.APP_VERSION).toBe('1.0.0');
    });

    it('should parse PORT as integer', () => {
      process.env.PORT = '8080';

      jest.resetModules();
      const { Environment } = require('@/main/config/environment');

      expect(Environment.PORT).toBe(8080);
      expect(typeof Environment.PORT).toBe('number');
    });
  });

  describe('Environment helpers', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it('should return true for isDevelopment when NODE_ENV is dev', () => {
      process.env.NODE_ENV = 'dev';
      jest.resetModules();
      const { isDevelopment } = require('@/main/config/environment');

      expect(isDevelopment).toBe(true);
    });

    it('should return false for isDevelopment when NODE_ENV is not dev', () => {
      process.env.NODE_ENV = 'prd';
      jest.resetModules();
      const { isDevelopment } = require('@/main/config/environment');

      expect(isDevelopment).toBe(false);
    });

    it('should return true for isProduction when NODE_ENV is prd', () => {
      process.env.NODE_ENV = 'prd';
      jest.resetModules();
      const { isProduction } = require('@/main/config/environment');

      expect(isProduction).toBe(true);
    });

    it('should return false for isProduction when NODE_ENV is not prd', () => {
      process.env.NODE_ENV = 'dev';
      jest.resetModules();
      const { isProduction } = require('@/main/config/environment');

      expect(isProduction).toBe(false);
    });
  });
});
