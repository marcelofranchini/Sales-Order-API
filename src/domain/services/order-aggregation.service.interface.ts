import { OrderDocument } from '../repositories/order-repository.interface';
import { UserDto } from '../../presentation/dto/order.dto';

export interface OrderAggregationService {
  groupAndSum(orders: OrderDocument[]): UserDto[];
}
