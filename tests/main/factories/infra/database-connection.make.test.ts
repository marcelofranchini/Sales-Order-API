import { MakeDatabaseConnection } from '@/main/factories/infra/database-connection.make';
import { DatabaseConnectionInterface } from '@/domain/contracts/database-connection.interface';

jest.mock('@/infra/db/mongoose/mongo-connection', () => ({
  MongoConnection: {
    getInstance: jest.fn(),
  },
}));

describe('MakeDatabaseConnection', () => {
  let mockMongoConnection: jest.Mocked<DatabaseConnectionInterface>;

  beforeEach(() => {
    mockMongoConnection = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      isConnected: jest.fn(),
    };

    const { MongoConnection } = require('@/infra/db/mongoose/mongo-connection');
    MongoConnection.getInstance.mockReturnValue(mockMongoConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a database connection instance', () => {
      const result = MakeDatabaseConnection.create();

      expect(result).toBe(mockMongoConnection);
      expect(result).toHaveProperty('connect');
      expect(result).toHaveProperty('disconnect');
      expect(result).toHaveProperty('isConnected');
    });

    it('should return the same instance when called multiple times', () => {
      const instance1 = MakeDatabaseConnection.create();
      const instance2 = MakeDatabaseConnection.create();

      expect(instance1).toBe(instance2);
    });

    it('should implement DatabaseConnectionInterface', () => {
      const connection = MakeDatabaseConnection.create();

      expect(typeof connection.connect).toBe('function');
      expect(typeof connection.disconnect).toBe('function');
      expect(typeof connection.isConnected).toBe('function');
    });
  });
});
