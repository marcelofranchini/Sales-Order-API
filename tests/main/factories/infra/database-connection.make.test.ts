import { MakeDatabaseConnection } from '../../../../src/main/factories/infra/database-connection.make';
import { DatabaseConnectionInterface } from '../../../../src/domain/contracts/database-connection.interface';

jest.mock('../../../../src/infra/db/mongoose/mongo-connection', () => ({
  MongoConnection: {
    getInstance: jest.fn(() => ({
      connect: jest.fn().mockResolvedValue(true),
      disconnect: jest.fn().mockResolvedValue(true),
      isConnected: jest.fn().mockReturnValue(true),
    })),
  },
}));

describe('MakeDatabaseConnection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a DatabaseConnection instance', () => {
      const result = MakeDatabaseConnection.create();

      expect(result).toBeDefined();
      expect(typeof result.connect).toBe('function');
      expect(typeof result.disconnect).toBe('function');
      expect(typeof result.isConnected).toBe('function');
    });

    it('should implement DatabaseConnectionInterface', () => {
      const connection = MakeDatabaseConnection.create();

      expect(connection).toHaveProperty('connect');
      expect(connection).toHaveProperty('disconnect');
      expect(connection).toHaveProperty('isConnected');
    });

    it('should create MongoConnection with correct configuration', () => {
      const {
        MongoConnection,
      } = require('../../../../src/infra/db/mongoose/mongo-connection');

      MakeDatabaseConnection.create();

      expect(MongoConnection.getInstance).toHaveBeenCalled();
    });
  });
});
