import { HealthCheckUseCaseInterface } from '@/domain/useCases/healthcheck.usecase.interface';
import { ControllerInterface } from '@/presentation/interfaces/controller.interface';

import { Environment } from '@/main/config/environment';
import { HealthCheckResponse } from '@/presentation/dto/http.dto';

export class HealthcheckController implements ControllerInterface {
  constructor(
    private readonly healthcheckUseCase: HealthCheckUseCaseInterface,
  ) {}

  async handle(): Promise<HealthCheckResponse> {
    try {
      const health = await this.healthcheckUseCase.execute();
      const statusCode: HealthCheckResponse['statusCode'] =
        health.status === 'OK' ? 200 : 503;

      return {
        statusCode,
        body: {
          ...health,
          db: 'OK',
          timestamp: new Date().toISOString(),
          app: process.env.npm_package_name || 'app',
          version: process.env.npm_package_version || 'unknown',
          environment: Environment.NODE_ENV,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';

      return {
        statusCode: 500,
        body: {
          status: 'FAIL',
          db: 'FAIL',
          error: errorMessage,
          timestamp: new Date().toISOString(),
          app: Environment.APP_NAME,
          version: Environment.APP_VERSION,
          environment: Environment.NODE_ENV,
        },
      };
    }
  }
}
