import { UploadOrdersUseCaseImpl } from '../../../data/useCases/upload-orders.use-case';
import { MakeOrderRepository } from '../repositories/order-repository.make';
import { MakeOrderAggregationService } from '../services/order-aggregation-service.make';

export class MakeUploadOrdersUseCase {
  static create(): UploadOrdersUseCaseImpl {
    return new UploadOrdersUseCaseImpl(
      MakeOrderRepository.create(),
      MakeOrderAggregationService.create(),
    );
  }
}
