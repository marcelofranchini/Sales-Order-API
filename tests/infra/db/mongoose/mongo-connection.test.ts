import { MongoConnection } from '../../../../src/infra/db/mongoose/mongo-connection';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
}));

describe('MongoConnection', () => {
  let mongoConnection: MongoConnection;

  beforeEach(() => {
    jest.clearAllMocks();
    (MongoConnection as any).instance = undefined;
    mongoConnection = MongoConnection.getInstance();
  });

  describe('getInstance', () => {
    it('should return the same instance (singleton)', () => {
      const instance1 = MongoConnection.getInstance();
      const instance2 = MongoConnection.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('connect', () => {
    it('should connect to MongoDB successfully', async () => {
      const mockConnect = require('mongoose').connect;
      mockConnect.mockResolvedValue(undefined);

      await mongoConnection.connect();

      expect(mockConnect).toHaveBeenCalledWith(expect.any(String));
    });

    it('should throw error when connection fails', async () => {
      const mockConnect = require('mongoose').connect;
      const error = new Error('Connection failed');
      mockConnect.mockRejectedValue(error);

      await expect(mongoConnection.connect()).rejects.toThrow(
        'Connection failed',
      );
    });

    it('should not connect if already connected', async () => {
      const mockConnect = require('mongoose').connect;
      mockConnect.mockResolvedValue(undefined);

      await mongoConnection.connect();
      await mongoConnection.connect();

      expect(mockConnect).toHaveBeenCalledTimes(1);
    });
  });

  describe('disconnect', () => {
    it('should disconnect from MongoDB successfully', async () => {
      const mockConnect = require('mongoose').connect;
      const mockDisconnect = require('mongoose').disconnect;
      mockConnect.mockResolvedValue(undefined);
      mockDisconnect.mockResolvedValue(undefined);

      await mongoConnection.connect();
      await mongoConnection.disconnect();

      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should throw error when disconnection fails', async () => {
      const mockConnect = require('mongoose').connect;
      const mockDisconnect = require('mongoose').disconnect;
      mockConnect.mockResolvedValue(undefined);
      mockDisconnect.mockRejectedValue(new Error('Disconnection failed'));

      await mongoConnection.connect();
      await expect(mongoConnection.disconnect()).rejects.toThrow(
        'Disconnection failed',
      );
    });

    it('should not disconnect if not connected', async () => {
      const mockDisconnect = require('mongoose').disconnect;

      await mongoConnection.disconnect();

      expect(mockDisconnect).not.toHaveBeenCalled();
    });
  });

  describe('isConnected', () => {
    it('should return true when connected', async () => {
      const mockConnect = require('mongoose').connect;
      mockConnect.mockResolvedValue(undefined);

      await mongoConnection.connect();
      const result = mongoConnection.isConnected();

      expect(result).toBe(true);
    });

    it('should return false when not connected', () => {
      const result = mongoConnection.isConnected();

      expect(result).toBe(false);
    });
  });
});
