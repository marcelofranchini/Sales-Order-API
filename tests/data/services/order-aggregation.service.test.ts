import { OrderAggregationServiceImpl } from '@/data/services/order-aggregation.service';

describe('OrderAggregationService', () => {
  it('groups all products from the same order', () => {
    const mockOrders = [
      {
        user_id: 1,
        name: 'User A',
        order_id: 1,
        product_id: 1,
        product_value: '10.00',
        date: '2024-01-01',
      },
      {
        user_id: 1,
        name: 'User A',
        order_id: 1,
        product_id: 2,
        product_value: '20.00',
        date: '2024-01-01',
      },
      {
        user_id: 1,
        name: 'User A',
        order_id: 2,
        product_id: 3,
        product_value: '15.00',
        date: '2024-01-02',
      },
      {
        user_id: 2,
        name: 'User B',
        order_id: 3,
        product_id: 4,
        product_value: '25.00',
        date: '2024-01-03',
      },
    ];

    const service = new OrderAggregationServiceImpl();
    const result = service.groupAndSum(mockOrders);

    expect(result.length).toBe(2); // Two users
    const userA = result.find((user) => user.user_id === 1);
    const userB = result.find((user) => user.user_id === 2);

    expect(userA).toBeDefined();
    expect(userA!.name).toBe('User A');
    expect(userA!.orders.length).toBe(2); // Two orders for user 1

    const order1 = userA!.orders.find((order) => order.order_id === 1);
    const order2 = userA!.orders.find((order) => order.order_id === 2);

    expect(order1).toBeDefined();
    expect(order1!.products.length).toBe(2);
    expect(order1!.total).toBe('30.00');

    expect(order2).toBeDefined();
    expect(order2!.products.length).toBe(1);
    expect(order2!.total).toBe('15.00');

    expect(userB).toBeDefined();
    expect(userB!.name).toBe('User B');
    expect(userB!.orders.length).toBe(1);

    const order3 = userB!.orders[0];
    expect(order3.order_id).toBe(3);
    expect(order3.products.length).toBe(1);
    expect(order3.total).toBe('25.00');
  });
}); 