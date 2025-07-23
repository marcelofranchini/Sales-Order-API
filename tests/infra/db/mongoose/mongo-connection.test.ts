import { MongoConnection } from '@/infra/db/mongoose/mongo-connection';
import mongoose from 'mongoose';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  connection: {
    readyState: 1,
  },
  ConnectionStates: {
    disconnected: 0,
    connected: 1,
    connecting: 2,
    disconnecting: 3,
  },
}));

describe('MongoConnection', () => {
  let mongoConnection: MongoConnection;

  beforeEach(() => {
    jest.clearAllMocks();
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
      const mockConnect = mongoose.connect as jest.MockedFunction<
        typeof mongoose.connect
      >;
      mockConnect.mockResolvedValue(mongoose);

      await mongoConnection.connect();

      expect(mockConnect).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        }),
      );
    });

    it('should throw error when connection fails', async () => {
      const mockConnect = mongoose.connect as jest.MockedFunction<
        typeof mongoose.connect
      >;
      const error = new Error('Connection failed');
      mockConnect.mockRejectedValue(error);

      await expect(mongoConnection.connect()).rejects.toThrow(
        'Connection failed',
      );
    });
  });

  describe('disconnect', () => {
    it('should disconnect from MongoDB successfully', async () => {
      const mockDisconnect = mongoose.disconnect as jest.MockedFunction<
        typeof mongoose.disconnect
      >;
      mockDisconnect.mockResolvedValue(undefined);

      await mongoConnection.disconnect();

      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should throw error when disconnection fails', async () => {
      const mockDisconnect = mongoose.disconnect as jest.MockedFunction<
        typeof mongoose.disconnect
      >;
      const error = new Error('Disconnection failed');
      mockDisconnect.mockRejectedValue(error);

      await expect(mongoConnection.disconnect()).rejects.toThrow(
        'Disconnection failed',
      );
    });
  });

  describe('isConnected', () => {
    it('should return true when database is connected', () => {
      Object.defineProperty(mongoose.connection, 'readyState', {
        value: 1,
        writable: true,
      });

      const result = mongoConnection.isConnected();

      expect(result).toBe(true);
    });

    it('should return false when database is not connected', () => {
      Object.defineProperty(mongoose.connection, 'readyState', {
        value: 0,
        writable: true,
      });

      const result = mongoConnection.isConnected();

      expect(result).toBe(false);
    });

    it('should return false when database is connecting', () => {
      Object.defineProperty(mongoose.connection, 'readyState', {
        value: 2,
        writable: true,
      });

      const result = mongoConnection.isConnected();

      expect(result).toBe(false);
    });

    it('should return false when database is disconnecting', () => {
      Object.defineProperty(mongoose.connection, 'readyState', {
        value: 3,
        writable: true,
      });

      const result = mongoConnection.isConnected();

      expect(result).toBe(false);
    });
  });
});
