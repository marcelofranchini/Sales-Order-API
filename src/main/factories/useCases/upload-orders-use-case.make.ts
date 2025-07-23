import { UploadOrdersUseCase } from '@/domain/useCases/upload-orders.usecase.interface';
import { UploadOrdersUseCaseImpl } from '@/data/useCases/upload-orders.use-case';
import { MakeOrderRepository } from '@/main/factories/repositories/order-repository.make';
import { MakeOrderAggregationService } from '@/main/factories/services/order-aggregation-service.make';

export class MakeUploadOrdersUseCase {
  static create(): UploadOrdersUseCase {
    return new UploadOrdersUseCaseImpl(
      MakeOrderRepository.create(),
      MakeOrderAggregationService.create(),
    );
  }
}
