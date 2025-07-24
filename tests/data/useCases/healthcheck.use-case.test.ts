import { HealthCheckUseCase } from '../../../src/data/useCases/healthcheck.use-case';
import { DatabaseConnectionInterface } from '../../../src/domain/contracts/database-connection.interface';
import { HealthStatusInterface } from '../../../src/domain/contracts/healthcheck-status.interface';

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
      expect(result.status).toBe('OK');
      expect(result.db).toBe('OK');
      expect(result).toHaveProperty('timestamp');
    });

    it('should return FAIL status when database is not connected', async () => {
      mockDatabaseConnection.isConnected.mockReturnValue(false);

      const result = await healthCheckUseCase.execute();

      expect(mockDatabaseConnection.isConnected).toHaveBeenCalled();
      expect(result.status).toBe('FAIL');
      expect(result.db).toBe('FAIL');
      expect(result).toHaveProperty('timestamp');
    });

    it('should handle database connection errors', async () => {
      mockDatabaseConnection.isConnected.mockImplementation(() => {
        throw new Error('Database connection error');
      });

      const result = await healthCheckUseCase.execute();

      expect(mockDatabaseConnection.isConnected).toHaveBeenCalled();
      expect(result.status).toBe('FAIL');
      expect(result.db).toBe('FAIL');
      expect(result).toHaveProperty('timestamp');
    });

    it('should return consistent timestamp format', async () => {
      mockDatabaseConnection.isConnected.mockReturnValue(true);

      const result = await healthCheckUseCase.execute();

      expect(result.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });

    it('should handle multiple consecutive calls', async () => {
      mockDatabaseConnection.isConnected.mockReturnValue(true);

      const result1 = await healthCheckUseCase.execute();
      await new Promise((resolve) => setTimeout(resolve, 10));
      const result2 = await healthCheckUseCase.execute();

      expect(result1.status).toBe('OK');
      expect(result2.status).toBe('OK');
      expect(result1.timestamp).not.toBe(result2.timestamp);
    });
  });
});
