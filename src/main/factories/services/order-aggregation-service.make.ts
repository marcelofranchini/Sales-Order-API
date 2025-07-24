import { OrderAggregationService } from '../../../domain/services/order-aggregation.service.interface';
import { OrderAggregationServiceImpl } from '../../../data/services/order-aggregation.service';

export class MakeOrderAggregationService {
  static create(): OrderAggregationService {
    return new OrderAggregationServiceImpl();
  }
}
