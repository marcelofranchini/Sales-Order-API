import { HealthcheckController } from '../../../src/presentation/controllers/healthcheck.controller';
import { HealthCheckUseCaseInterface } from '../../../src/domain/useCases/healthcheck.usecase.interface';
import { HealthStatusInterface } from '../../../src/domain/contracts/healthcheck-status.interface';

describe('HealthcheckController', () => {
  let healthcheckController: HealthcheckController;
  let mockHealthcheckUseCase: jest.Mocked<HealthCheckUseCaseInterface>;

  beforeEach(() => {
    mockHealthcheckUseCase = {
      execute: jest.fn(),
    };

    healthcheckController = new HealthcheckController(mockHealthcheckUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should return 200 status when healthcheck is OK', async () => {
      const mockHealthResult: HealthStatusInterface = {
        status: 'OK',
        db: 'OK',
        timestamp: '2024-01-01T00:00:00.000Z',
      };

      mockHealthcheckUseCase.execute.mockResolvedValue(mockHealthResult);

      const result = await healthcheckController.handle();

      expect(mockHealthcheckUseCase.execute).toHaveBeenCalled();
      expect(result.statusCode).toBe(200);
      expect(result.body.status).toBe('OK');
      expect(result.body.db).toBe('OK');
      expect(result.body).toHaveProperty('timestamp');
      expect(result.body).toHaveProperty('app');
      expect(result.body).toHaveProperty('version');
      expect(result.body).toHaveProperty('environment');
    });

    it('should return 500 status when healthcheck fails', async () => {
      const error = new Error('Database connection failed');
      mockHealthcheckUseCase.execute.mockRejectedValue(error);

      const result = await healthcheckController.handle();

      expect(mockHealthcheckUseCase.execute).toHaveBeenCalled();
      expect(result.statusCode).toBe(500);
      expect(result.body).toHaveProperty('error');
    });
  });
});
