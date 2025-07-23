import { DatabaseConnectionInterface } from '@/domain/contracts/database-connection.interface';
import { HealthStatusInterface } from '@/domain/contracts/healthcheck-status.interface';
import { HealthCheckUseCaseInterface } from '@/domain/useCases/healthcheck.usecase.interface';

export class HealthCheckUseCase implements HealthCheckUseCaseInterface {
  constructor(private readonly mongoConnection: DatabaseConnectionInterface) {}

  async execute(): Promise<HealthStatusInterface> {
    if (!this.mongoConnection) {
      throw new Error('Database connection not available');
    }

    const connected = this.mongoConnection.isConnected();

    if (!connected) {
      throw new Error('MongoDB connection failed');
    }

    return { status: 'OK', db: 'OK' };
  }
}
