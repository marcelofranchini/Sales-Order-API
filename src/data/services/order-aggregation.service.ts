import { OrderAggregationService } from '../../domain/services/order-aggregation.service.interface';
import { OrderDocument } from '../../domain/repositories/order-repository.interface';
import { UserDto } from '../../presentation/dto/order.dto';

export class OrderAggregationServiceImpl implements OrderAggregationService {
  groupAndSum(orders: OrderDocument[]): UserDto[] {
    const userMap = new Map<number, UserDto>();

    orders.forEach((order) => {
      const userId = order.user_id as number;
      const userName = order.name as string;

      if (!userMap.has(userId)) {
        userMap.set(userId, {
          user_id: userId,
          name: userName,
          orders: [],
        });
      }

      const user = userMap.get(userId)!;
      user.orders.push({
        order_id: order.order_id as number,
        total: order.total as string,
        date: order.date as string,
        products: order.products as any[],
      });
    });

    return Array.from(userMap.values());
  }
}
