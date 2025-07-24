import { OrderAggregationService } from '../../domain/services/order-aggregation.service.interface';
import { OrderDocument } from '../../domain/repositories/order-repository.interface';
import {
  UserDto,
  OrderDto,
  ProductDto,
} from '../../presentation/dto/order.dto';

export class OrderAggregationServiceImpl implements OrderAggregationService {
  groupAndSum(orders: OrderDocument[]): UserDto[] {
    const userMap = new Map<number, UserDto>();

    orders.forEach((order) => {
      const userId = order.user_id as number;
      const userName = order.name as string;
      const orderId = order.order_id as number;
      const productId = order.product_id as number;
      const productValue = order.product_value as string;
      const date = order.date as string;

      if (!userMap.has(userId)) {
        userMap.set(userId, {
          user_id: userId,
          name: userName,
          orders: [],
        });
      }

      const user = userMap.get(userId)!;

      let existingOrder = user.orders.find((o) => o.order_id === orderId);

      if (!existingOrder) {
        existingOrder = {
          order_id: orderId,
          total: '0',
          date: date,
          products: [],
        };
        user.orders.push(existingOrder);
      }

      const product: ProductDto = {
        product_id: productId,
        value: productValue,
      };

      existingOrder.products.push(product);

      const total = existingOrder.products.reduce((sum, product) => {
        const value = parseFloat(product.value) || 0;
        return sum + value;
      }, 0);

      existingOrder.total = total.toFixed(2);
    });

    return Array.from(userMap.values());
  }
}
