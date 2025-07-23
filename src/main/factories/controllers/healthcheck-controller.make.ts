import { HealthcheckController } from '@/presentation/controllers/healthcheck.controller';
import { MakeHealthcheckUseCase } from '@/main/factories/useCases/healthcheck-use-case.make';

export class MakeHealthcheckController {
  static create(): HealthcheckController {
    const healthcheckUseCase = MakeHealthcheckUseCase.create();
    return new HealthcheckController(healthcheckUseCase);
  }
}
