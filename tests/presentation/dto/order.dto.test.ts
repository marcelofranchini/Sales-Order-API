import { ProductDto, OrderDto, UserDto, UploadOrdersResponseDto } from '@/presentation/dto/order.dto';

describe('Order DTOs', () => {
  describe('ProductDto', () => {
    it('should have correct structure', () => {
      const product: ProductDto = {
        product_id: 1,
        value: '100.00',
      };

      expect(product.product_id).toBe(1);
      expect(product.value).toBe('100.00');
    });

    it('should support different product IDs', () => {
      const product: ProductDto = {
        product_id: 999,
        value: '50.50',
      };

      expect(product.product_id).toBe(999);
      expect(product.value).toBe('50.50');
    });
  });

  describe('OrderDto', () => {
    it('should have correct structure', () => {
      const order: OrderDto = {
        order_id: 1,
        total: '150.00',
        date: '2024-01-01',
        products: [
          { product_id: 1, value: '100.00' },
          { product_id: 2, value: '50.00' },
        ],
      };

      expect(order.order_id).toBe(1);
      expect(order.total).toBe('150.00');
      expect(order.date).toBe('2024-01-01');
      expect(order.products).toHaveLength(2);
    });

    it('should support empty products array', () => {
      const order: OrderDto = {
        order_id: 1,
        total: '0.00',
        date: '2024-01-01',
        products: [],
      };

      expect(order.products).toHaveLength(0);
    });

    it('should support multiple products', () => {
      const order: OrderDto = {
        order_id: 1,
        total: '300.00',
        date: '2024-01-01',
        products: [
          { product_id: 1, value: '100.00' },
          { product_id: 2, value: '100.00' },
          { product_id: 3, value: '100.00' },
        ],
      };

      expect(order.products).toHaveLength(3);
    });
  });

  describe('UserDto', () => {
    it('should have correct structure', () => {
      const user: UserDto = {
        user_id: 1,
        name: 'John Doe',
        orders: [
          {
            order_id: 1,
            total: '150.00',
            date: '2024-01-01',
            products: [{ product_id: 1, value: '150.00' }],
          },
        ],
      };

      expect(user.user_id).toBe(1);
      expect(user.name).toBe('John Doe');
      expect(user.orders).toHaveLength(1);
    });

    it('should support empty orders array', () => {
      const user: UserDto = {
        user_id: 1,
        name: 'John Doe',
        orders: [],
      };

      expect(user.orders).toHaveLength(0);
    });

    it('should support multiple orders', () => {
      const user: UserDto = {
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
      };

      expect(user.orders).toHaveLength(2);
    });
  });

  describe('UploadOrdersResponseDto', () => {
    it('should have correct structure', () => {
      const response: UploadOrdersResponseDto = {
        message: 'Arquivo TXT processado e salvo no MongoDB com sucesso',
        fileName: 'test.txt',
        fileSize: 100,
        lines: 10,
        data: [
          {
            user_id: 1,
            name: 'John Doe',
            orders: [
              {
                order_id: 1,
                total: '150.00',
                date: '2024-01-01',
                products: [{ product_id: 1, value: '150.00' }],
              },
            ],
          },
        ],
        savedOrders: 5,
        skippedOrders: 0,
      };

      expect(response.message).toBe('Arquivo TXT processado e salvo no MongoDB com sucesso');
      expect(response.fileName).toBe('test.txt');
      expect(response.fileSize).toBe(100);
      expect(response.lines).toBe(10);
      expect(response.data).toHaveLength(1);
      expect(response.savedOrders).toBe(5);
      expect(response.skippedOrders).toBe(0);
    });

    it('should support empty data array', () => {
      const response: UploadOrdersResponseDto = {
        message: 'Arquivo TXT processado e salvo no MongoDB com sucesso',
        fileName: 'test.txt',
        fileSize: 100,
        lines: 0,
        data: [],
        savedOrders: 0,
        skippedOrders: 0,
      };

      expect(response.data).toHaveLength(0);
      expect(response.savedOrders).toBe(0);
      expect(response.skippedOrders).toBe(0);
    });

    it('should support large file sizes', () => {
      const response: UploadOrdersResponseDto = {
        message: 'Arquivo TXT processado e salvo no MongoDB com sucesso',
        fileName: 'large.txt',
        fileSize: 1024000,
        lines: 1000,
        data: [],
        savedOrders: 1000,
        skippedOrders: 50,
      };

      expect(response.fileSize).toBe(1024000);
      expect(response.lines).toBe(1000);
      expect(response.savedOrders).toBe(1000);
      expect(response.skippedOrders).toBe(50);
    });
  });
}); 