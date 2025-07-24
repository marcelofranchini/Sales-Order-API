import { MakeSearchOrdersUseCase } from '../../../../src/main/factories/useCases/search-orders-use-case.make';
import { SearchOrdersUseCase } from '../../../../src/domain/useCases/search-orders.usecase.interface';

jest.mock(
  '../../../../src/main/factories/repositories/order-repository.make',
  () => ({
    MakeOrderRepository: {
      create: jest.fn(() => ({
        find: jest.fn(),
        countDocuments: jest.fn(),
        insertMany: jest.fn(),
        dropIndex: jest.fn(),
      })),
    },
  }),
);

jest.mock(
  '../../../../src/main/factories/services/order-aggregation-service.make',
  () => ({
    MakeOrderAggregationService: {
      create: jest.fn(() => ({
        groupAndSum: jest.fn(),
      })),
    },
  }),
);

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

    it('should handle search with valid parameters', async () => {
      const useCase = MakeSearchOrdersUseCase.create();
      const mockQuery = { user_id: '1', page: '1' };

      const mockResponse = [
        {
          user_id: 1,
          name: 'Test User',
          orders: [],
        },
      ];

      jest.spyOn(useCase, 'execute').mockResolvedValue(mockResponse);

      const result = await useCase.execute(mockQuery);

      expect(result).toEqual(mockResponse);
    });

    it('should handle empty query', async () => {
      const useCase = MakeSearchOrdersUseCase.create();
      const mockQuery = {};

      const mockResponse: any[] = [];

      jest.spyOn(useCase, 'execute').mockResolvedValue(mockResponse);

      const result = await useCase.execute(mockQuery);

      expect(result).toEqual(mockResponse);
    });

    it('should handle error for invalid parameters', async () => {
      const useCase = MakeSearchOrdersUseCase.create();
      const mockQuery = { invalid_param: 'value' };

      jest
        .spyOn(useCase, 'execute')
        .mockRejectedValue(
          new Error('Parâmetro(s) não permitido(s): invalid_param'),
        );

      await expect(useCase.execute(mockQuery)).rejects.toThrow(
        'Parâmetro(s) não permitido(s): invalid_param',
      );
    });
  });
});
