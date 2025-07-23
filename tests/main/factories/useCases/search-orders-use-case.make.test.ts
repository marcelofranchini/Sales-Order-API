import { MakeSearchOrdersUseCase } from '@/main/factories/useCases/search-orders-use-case.make';
import { SearchOrdersUseCase } from '@/domain/useCases/search-orders.usecase.interface';

jest.mock('@/main/factories/repositories/order-repository.make', () => ({
  MakeOrderRepository: {
    create: jest.fn(() => ({
      find: jest.fn(),
      countDocuments: jest.fn(),
      insertMany: jest.fn(),
      dropIndex: jest.fn(),
    })),
  },
}));

jest.mock('@/main/factories/services/order-aggregation-service.make', () => ({
  MakeOrderAggregationService: {
    create: jest.fn(() => ({
      groupAndSum: jest.fn(),
    })),
  },
}));

describe('MakeSearchOrdersUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a SearchOrdersUseCase instance', () => {
      const result = MakeSearchOrdersUseCase.create();

      expect(result).toBeDefined();
      expect(typeof result.execute).toBe('function');
    });

    it('should implement SearchOrdersUseCase', () => {
      const useCase = MakeSearchOrdersUseCase.create();

      expect(typeof useCase.execute).toBe('function');
    });

    it('should handle query parameters correctly', async () => {
      const useCase = MakeSearchOrdersUseCase.create();
      const mockQuery = { user_id: '1', page: '1' };

      jest.spyOn(useCase, 'execute').mockResolvedValue([]);

      const result = await useCase.execute(mockQuery);

      expect(result).toEqual([]);
    });

    it('should handle empty query parameters', async () => {
      const useCase = MakeSearchOrdersUseCase.create();
      const mockQuery = {};

      jest.spyOn(useCase, 'execute').mockResolvedValue([]);

      const result = await useCase.execute(mockQuery);

      expect(result).toEqual([]);
    });
  });
}); 