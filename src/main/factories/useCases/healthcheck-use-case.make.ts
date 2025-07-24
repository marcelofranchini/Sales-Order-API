import { HealthCheckUseCase } from '../../../data/useCases/healthcheck.use-case';
import { MakeDatabaseConnection } from '../infra/database-connection.make';

export class MakeHealthcheckUseCase {
  static create(): HealthCheckUseCase {
    return new HealthCheckUseCase(MakeDatabaseConnection.create());
  }
}
