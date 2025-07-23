import { OrderAggregationService } from '@/domain/services/order-aggregation.service.interface';
import { OrderDocument } from '@/domain/repositories/order-repository.interface';
import { UserDto } from '@/presentation/dto/order.dto';

export class OrderAggregationServiceImpl implements OrderAggregationService {
  groupAndSum(orders: OrderDocument[]): UserDto[] {
    const userMap: Map<number, UserDto> = new Map();
    for (const doc of orders) {
      const userKey = doc.user_id as number;
      if (!userMap.has(userKey)) {
        userMap.set(userKey, {
          user_id: doc.user_id as number,
          name: doc.name as string,
          orders: [],
        });
      }
      const user = userMap.get(userKey)!;
      let order = user.orders.find((o) => o.order_id === doc.order_id);
      if (!order) {
        order = {
          order_id: doc.order_id as number,
          total: '0.00',
          date: doc.date as string,
          products: [],
        };
        user.orders.push(order);
      }
      order.products.push({
        product_id: doc.product_id as number,
        value: doc.product_value as string,
      });
      order.total = (
        parseFloat(order.total) + parseFloat(doc.product_value as string)
      ).toFixed(2);
    }
    return Array.from(userMap.values());
  }
}
