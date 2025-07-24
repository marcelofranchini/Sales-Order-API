import { HealthCheckUseCaseInterface } from '../../domain/useCases/healthcheck.usecase.interface';
import { ControllerInterface } from '../interfaces/controller.interface';
import { HealthStatusInterface } from '../../domain/contracts/healthcheck-status.interface';
import { Environment } from '../../main/config/environment';
import { HealthCheckResponse } from '../dto/http.dto';

export class HealthcheckController implements ControllerInterface {
  constructor(
    private readonly healthcheckUseCase: HealthCheckUseCaseInterface,
  ) {}

  async handle(): Promise<HealthCheckResponse> {
    try {
      const healthResult: HealthStatusInterface =
        await this.healthcheckUseCase.execute();
      return {
        statusCode: 200,
        body: {
          ...healthResult,
          timestamp: new Date().toISOString(),
          app: Environment.APP_NAME,
          version: Environment.APP_VERSION,
          environment: Environment.NODE_ENV,
        },
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: {
          status: 'FAIL',
          db: 'FAIL',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }
}
