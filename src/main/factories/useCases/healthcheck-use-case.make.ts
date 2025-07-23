import { HealthCheckUseCase } from '@/data/useCases/healthcheck.use-case';
import { MakeDatabaseConnection } from '@/main/factories/infra/database-connection.make';

export class MakeHealthcheckUseCase {
  static create() {
    const databaseConnection = MakeDatabaseConnection.create();
    return new HealthCheckUseCase(databaseConnection);
  }
}
