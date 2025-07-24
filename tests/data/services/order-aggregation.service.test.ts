import { OrderAggregationServiceImpl } from '../../../src/data/services/order-aggregation.service';
import { OrderDocument } from '../../../src/domain/repositories/order-repository.interface';
import { UserDto } from '../../../src/presentation/dto/order.dto';

describe('OrderAggregationServiceImpl', () => {
  let orderAggregationService: OrderAggregationServiceImpl;

  beforeEach(() => {
    orderAggregationService = new OrderAggregationServiceImpl();
  });

  describe('groupAndSum', () => {
    it('should group orders by user and aggregate data correctly', () => {
      const mockOrders: OrderDocument[] = [
        {
          user_id: 1,
          name: 'John Doe',
          order_id: 1,
          total: '100.00',
          date: '2024-01-01',
          products: [{ product_id: 1, value: '100.00' }],
        },
        {
          user_id: 1,
          name: 'John Doe',
          order_id: 2,
          total: '200.00',
          date: '2024-01-02',
          products: [{ product_id: 2, value: '200.00' }],
        },
        {
          user_id: 2,
          name: 'Jane Smith',
          order_id: 3,
          total: '150.00',
          date: '2024-01-01',
          products: [{ product_id: 3, value: '150.00' }],
        },
      ];

      const result = orderAggregationService.groupAndSum(mockOrders);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        user_id: 1,
        name: 'John Doe',
        orders: [
          {
            order_id: 1,
            total: '100.00',
            date: '2024-01-01',
            products: [{ product_id: 1, value: '100.00' }],
          },
          {
            order_id: 2,
            total: '200.00',
            date: '2024-01-02',
            products: [{ product_id: 2, value: '200.00' }],
          },
        ],
      });
      expect(result[1]).toEqual({
        user_id: 2,
        name: 'Jane Smith',
        orders: [
          {
            order_id: 3,
            total: '150.00',
            date: '2024-01-01',
            products: [{ product_id: 3, value: '150.00' }],
          },
        ],
      });
    });

    it('should handle empty orders array', () => {
      const mockOrders: OrderDocument[] = [];

      const result = orderAggregationService.groupAndSum(mockOrders);

      expect(result).toHaveLength(0);
    });

    it('should handle single order', () => {
      const mockOrders: OrderDocument[] = [
        {
          user_id: 1,
          name: 'John Doe',
          order_id: 1,
          total: '100.00',
          date: '2024-01-01',
          products: [{ product_id: 1, value: '100.00' }],
        },
      ];

      const result = orderAggregationService.groupAndSum(mockOrders);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        user_id: 1,
        name: 'John Doe',
        orders: [
          {
            order_id: 1,
            total: '100.00',
            date: '2024-01-01',
            products: [{ product_id: 1, value: '100.00' }],
          },
        ],
      });
    });
  });
});
