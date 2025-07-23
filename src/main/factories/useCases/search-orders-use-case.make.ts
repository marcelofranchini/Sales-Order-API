import { SearchOrdersUseCase } from '@/domain/useCases/search-orders.usecase.interface';
import { SearchOrdersUseCaseImpl } from '@/data/useCases/search-orders.use-case';
import { MakeOrderRepository } from '@/main/factories/repositories/order-repository.make';
import { MakeOrderAggregationService } from '@/main/factories/services/order-aggregation-service.make';

export class MakeSearchOrdersUseCase {
  static create(): SearchOrdersUseCase {
    return new SearchOrdersUseCaseImpl(
      MakeOrderRepository.create(),
      MakeOrderAggregationService.create(),
    );
  }
}
