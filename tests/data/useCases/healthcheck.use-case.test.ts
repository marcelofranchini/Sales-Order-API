import { HealthCheckUseCase } from '@/data/useCases/healthcheck.use-case';
import { DatabaseConnectionInterface } from '@/domain/contracts/database-connection.interface';
import { HealthStatusInterface } from '@/domain/contracts/healthcheck-status.interface';

describe('HealthCheckUseCase', () => {
  let healthCheckUseCase: HealthCheckUseCase;
  let mockDatabaseConnection: jest.Mocked<DatabaseConnectionInterface>;

  beforeEach(() => {
    mockDatabaseConnection = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      isConnected: jest.fn(),
    };

    healthCheckUseCase = new HealthCheckUseCase(mockDatabaseConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return OK status when database is connected', async () => {
      mockDatabaseConnection.isConnected.mockReturnValue(true);

      const result = await healthCheckUseCase.execute();

      expect(mockDatabaseConnection.isConnected).toHaveBeenCalled();
      expect(result).toEqual({
        status: 'OK',
        db: 'OK',
      });
    });

    it('should throw error when database is not connected', async () => {
      mockDatabaseConnection.isConnected.mockReturnValue(false);

      await expect(healthCheckUseCase.execute()).rejects.toThrow(
        'MongoDB connection failed',
      );

      expect(mockDatabaseConnection.isConnected).toHaveBeenCalled();
    });

    it('should implement HealthCheckUseCaseInterface', () => {
      expect(typeof healthCheckUseCase.execute).toBe('function');
    });

    it('should return HealthStatusInterface structure', async () => {
      mockDatabaseConnection.isConnected.mockReturnValue(true);

      const result = await healthCheckUseCase.execute();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('db');
      expect(typeof result.status).toBe('string');
      expect(typeof result.db).toBe('string');
    });

    it('should handle database connection errors', async () => {
      mockDatabaseConnection.isConnected.mockImplementation(() => {
        throw new Error('Database connection error');
      });

      await expect(healthCheckUseCase.execute()).rejects.toThrow(
        'Database connection error',
      );
    });
  });
});
