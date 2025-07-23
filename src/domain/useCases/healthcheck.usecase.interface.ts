import { HealthStatusInterface } from '@/domain/contracts/healthcheck-status.interface';

export interface HealthCheckUseCaseInterface {
  execute(): Promise<HealthStatusInterface>;
}
