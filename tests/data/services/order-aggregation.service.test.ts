import { OrderAggregationServiceImpl } from '@/data/services/order-aggregation.service';
import { OrderDocument } from '@/domain/repositories/order-repository.interface';
import { UserDto } from '@/presentation/dto/order.dto';

describe('OrderAggregationServiceImpl', () => {
  let orderAggregationService: OrderAggregationServiceImpl;

  beforeEach(() => {
    orderAggregationService = new OrderAggregationServiceImpl();
  });

  describe('groupAndSum', () => {
    it('should group orders by user and sum product values', () => {
      const mockOrders: OrderDocument[] = [
        {
          user_id: 1,
          name: 'João Silva',
          order_id: 1001,
          product_id: 101,
          product_value: '10.50',
          date: '2024-01-01',
        } as OrderDocument,
        {
          user_id: 1,
          name: 'João Silva',
          order_id: 1001,
          product_id: 102,
          product_value: '15.75',
          date: '2024-01-01',
        } as OrderDocument,
        {
          user_id: 1,
          name: 'João Silva',
          order_id: 1002,
          product_id: 103,
          product_value: '25.00',
          date: '2024-01-02',
        } as OrderDocument,
        {
          user_id: 2,
          name: 'Maria Santos',
          order_id: 2001,
          product_id: 201,
          product_value: '30.00',
          date: '2024-01-01',
        } as OrderDocument,
      ];

      const result = orderAggregationService.groupAndSum(mockOrders);

      expect(result).toHaveLength(2);
      
      const user1 = result.find(u => u.user_id === 1);
      expect(user1).toBeDefined();
      expect(user1?.name).toBe('João Silva');
      expect(user1?.orders).toHaveLength(2);
      
      const order1 = user1?.orders.find(o => o.order_id === 1001);
      expect(order1).toBeDefined();
      expect(order1?.total).toBe('26.25');
      expect(order1?.products).toHaveLength(2);
      
      const order2 = user1?.orders.find(o => o.order_id === 1002);
      expect(order2).toBeDefined();
      expect(order2?.total).toBe('25.00');
      expect(order2?.products).toHaveLength(1);
      
      const user2 = result.find(u => u.user_id === 2);
      expect(user2).toBeDefined();
      expect(user2?.name).toBe('Maria Santos');
      expect(user2?.orders).toHaveLength(1);
      expect(user2?.orders[0].total).toBe('30.00');
    });

    it('should handle empty orders array', () => {
      const result = orderAggregationService.groupAndSum([]);
      expect(result).toEqual([]);
    });

    it('should handle single order with single product', () => {
      const mockOrders: OrderDocument[] = [
        {
          user_id: 1,
          name: 'Test User',
          order_id: 1001,
          product_id: 101,
          product_value: '50.00',
          date: '2024-01-01',
        } as OrderDocument,
      ];

      const result = orderAggregationService.groupAndSum(mockOrders);

      expect(result).toHaveLength(1);
      expect(result[0].user_id).toBe(1);
      expect(result[0].name).toBe('Test User');
      expect(result[0].orders).toHaveLength(1);
      expect(result[0].orders[0].order_id).toBe(1001);
      expect(result[0].orders[0].total).toBe('50.00');
      expect(result[0].orders[0].products).toHaveLength(1);
    });

    it('should handle multiple products in same order', () => {
      const mockOrders: OrderDocument[] = [
        {
          user_id: 1,
          name: 'Test User',
          order_id: 1001,
          product_id: 101,
          product_value: '10.00',
          date: '2024-01-01',
        } as OrderDocument,
        {
          user_id: 1,
          name: 'Test User',
          order_id: 1001,
          product_id: 102,
          product_value: '20.00',
          date: '2024-01-01',
        } as OrderDocument,
        {
          user_id: 1,
          name: 'Test User',
          order_id: 1001,
          product_id: 103,
          product_value: '30.00',
          date: '2024-01-01',
        } as OrderDocument,
      ];

      const result = orderAggregationService.groupAndSum(mockOrders);

      expect(result).toHaveLength(1);
      expect(result[0].orders).toHaveLength(1);
      expect(result[0].orders[0].total).toBe('60.00');
      expect(result[0].orders[0].products).toHaveLength(3);
    });

    it('should handle decimal precision correctly', () => {
      const mockOrders: OrderDocument[] = [
        {
          user_id: 1,
          name: 'Test User',
          order_id: 1001,
          product_id: 101,
          product_value: '10.555',
          date: '2024-01-01',
        } as OrderDocument,
        {
          user_id: 1,
          name: 'Test User',
          order_id: 1001,
          product_id: 102,
          product_value: '20.444',
          date: '2024-01-01',
        } as OrderDocument,
      ];

      const result = orderAggregationService.groupAndSum(mockOrders);

      expect(result[0].orders[0].total).toBe('30.99');
    });
  });
}); 