import { SearchOrdersUseCaseImpl } from '../../../data/useCases/search-orders.use-case';
import { MakeOrderRepository } from '../repositories/order-repository.make';
import { MakeOrderAggregationService } from '../services/order-aggregation-service.make';

export class MakeSearchOrdersUseCase {
  static create(): SearchOrdersUseCaseImpl {
    const orderRepository = MakeOrderRepository.create();
    const orderAggregationService = MakeOrderAggregationService.create();
    return new SearchOrdersUseCaseImpl(
      orderRepository,
      orderAggregationService,
    );
  }
}
