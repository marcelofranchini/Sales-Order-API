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
          product_id: 1,
          product_value: '100.00',
          date: '2024-01-01',
        },
        {
          user_id: 1,
          name: 'John Doe',
          order_id: 1,
          product_id: 2,
          product_value: '50.00',
          date: '2024-01-01',
        },
        {
          user_id: 1,
          name: 'John Doe',
          order_id: 2,
          product_id: 3,
          product_value: '200.00',
          date: '2024-01-02',
        },
        {
          user_id: 2,
          name: 'Jane Smith',
          order_id: 3,
          product_id: 4,
          product_value: '150.00',
          date: '2024-01-01',
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
            total: '150.00',
            date: '2024-01-01',
            products: [
              { product_id: 1, value: '100.00' },
              { product_id: 2, value: '50.00' },
            ],
          },
          {
            order_id: 2,
            total: '200.00',
            date: '2024-01-02',
            products: [{ product_id: 3, value: '200.00' }],
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
            products: [{ product_id: 4, value: '150.00' }],
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
          product_id: 1,
          product_value: '100.00',
          date: '2024-01-01',
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

    it('should calculate totals correctly with multiple products', () => {
      const mockOrders: OrderDocument[] = [
        {
          user_id: 1,
          name: 'John Doe',
          order_id: 1,
          product_id: 1,
          product_value: '100.50',
          date: '2024-01-01',
        },
        {
          user_id: 1,
          name: 'John Doe',
          order_id: 1,
          product_id: 2,
          product_value: '75.25',
          date: '2024-01-01',
        },
        {
          user_id: 1,
          name: 'John Doe',
          order_id: 1,
          product_id: 3,
          product_value: '25.00',
          date: '2024-01-01',
        },
      ];

      const result = orderAggregationService.groupAndSum(mockOrders);

      expect(result).toHaveLength(1);
      expect(result[0].orders[0].total).toBe('200.75');
      expect(result[0].orders[0].products).toHaveLength(3);
    });
  });
});
