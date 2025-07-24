import { HealthStatusInterface } from '../contracts/healthcheck-status.interface';

export interface HealthCheckUseCaseInterface {
  execute(): Promise<HealthStatusInterface>;
}
