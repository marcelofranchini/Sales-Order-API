module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/main/server.ts',
    '!src/**/index.ts',
    '!src/main/config/swagger.ts',
    '!src/main/routes/swagger.route.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@/infra/(.*)$': '<rootDir>/src/infra/$1',
    '^@/application/(.*)$': '<rootDir>/src/application/$1',
    '^@/presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^@/main/(.*)$': '<rootDir>/src/main/$1',
    '^@/shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@/tests/(.*)$': '<rootDir>/tests/$1'
  },
  testTimeout: 10000,
  moduleFileExtensions: ['ts', 'js', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
}; 