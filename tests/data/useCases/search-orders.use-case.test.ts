import { SearchOrdersUseCaseImpl } from '../../../src/data/useCases/search-orders.use-case';
import { OrderRepository } from '../../../src/domain/repositories/order-repository.interface';
import { OrderAggregationService } from '../../../src/domain/services/order-aggregation.service.interface';
import { UserDto } from '../../../src/presentation/dto/order.dto';
import { OrderDocument } from '../../../src/domain/repositories/order-repository.interface';

describe('SearchOrdersUseCaseImpl', () => {
  let searchOrdersUseCase: SearchOrdersUseCaseImpl;
  let mockOrderRepository: jest.Mocked<OrderRepository>;
  let mockOrderAggregationService: jest.Mocked<OrderAggregationService>;

  beforeEach(() => {
    mockOrderRepository = {
      find: jest.fn(),
      countDocuments: jest.fn(),
      insertMany: jest.fn(),
      dropIndex: jest.fn(),
    };

    mockOrderAggregationService = {
      groupAndSum: jest.fn(),
    };

    searchOrdersUseCase = new SearchOrdersUseCaseImpl(
      mockOrderRepository,
      mockOrderAggregationService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should search orders with valid parameters', async () => {
      const mockQuery = { user_id: '1', page: '1' };
      const mockDocuments: OrderDocument[] = [
        { user_id: 1, name: 'Test User' } as OrderDocument,
      ];
      const mockGroupedData: UserDto[] = [
        {
          user_id: 1,
          name: 'Test User',
          orders: [],
        },
      ];

      mockOrderRepository.countDocuments.mockResolvedValue(10);
      mockOrderRepository.find.mockResolvedValue(mockDocuments);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      const result = await searchOrdersUseCase.execute(mockQuery);

      expect(mockOrderRepository.countDocuments).toHaveBeenCalledWith({
        user_id: 1,
      });
      expect(mockOrderRepository.find).toHaveBeenCalledWith(
        { user_id: 1 },
        { skip: 0, limit: 100 },
      );
      expect(mockOrderAggregationService.groupAndSum).toHaveBeenCalledWith(
        mockDocuments,
      );
      expect(result).toEqual(mockGroupedData);
    });

    it('should throw error for invalid parameters', async () => {
      const mockQuery = { invalid_param: 'value' };

      await expect(searchOrdersUseCase.execute(mockQuery)).rejects.toThrow(
        'Parâmetro(s) não permitido(s): invalid_param',
      );
    });

    it('should throw error for invalid order_id format', async () => {
      const mockQuery = { order_id: 'abc' };

      await expect(searchOrdersUseCase.execute(mockQuery)).rejects.toThrow(
        'order_id deve ser um número inteiro',
      );
    });

    it('should throw error for invalid user_id format', async () => {
      const mockQuery = { user_id: 'abc' };

      await expect(searchOrdersUseCase.execute(mockQuery)).rejects.toThrow(
        'user_id deve ser um número inteiro',
      );
    });

    it('should handle date filtering correctly', async () => {
      const mockQuery = { start: '2024-01-01', end: '2024-01-31' };
      const mockDocuments: OrderDocument[] = [];
      const mockGroupedData: UserDto[] = [];

      mockOrderRepository.countDocuments.mockResolvedValue(0);
      mockOrderRepository.find.mockResolvedValue(mockDocuments);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      await searchOrdersUseCase.execute(mockQuery);

      expect(mockOrderRepository.countDocuments).toHaveBeenCalledWith({
        date: { $gte: '2024-01-01', $lte: '2024-01-31' },
      });
    });

    it('should handle date filtering with only start date', async () => {
      const mockQuery = { start: '2024-01-01' };
      const mockDocuments: OrderDocument[] = [];
      const mockGroupedData: UserDto[] = [];

      mockOrderRepository.countDocuments.mockResolvedValue(0);
      mockOrderRepository.find.mockResolvedValue(mockDocuments);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      await searchOrdersUseCase.execute(mockQuery);

      const today = new Date().toISOString().slice(0, 10);
      expect(mockOrderRepository.countDocuments).toHaveBeenCalledWith({
        date: { $gte: '2024-01-01', $lte: today },
      });
    });

    it('should handle date filtering with only end date', async () => {
      const mockQuery = { end: '2024-01-31' };
      const mockDocuments: OrderDocument[] = [];
      const mockGroupedData: UserDto[] = [];

      mockOrderRepository.countDocuments.mockResolvedValue(0);
      mockOrderRepository.find.mockResolvedValue(mockDocuments);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      await searchOrdersUseCase.execute(mockQuery);

      expect(mockOrderRepository.countDocuments).toHaveBeenCalledWith({
        date: { $gte: '0000-01-01', $lte: '2024-01-31' },
      });
    });

    it('should throw error for invalid date format', async () => {
      const mockQuery = { start: '2024/01/01', end: '2024/01/31' };

      await expect(searchOrdersUseCase.execute(mockQuery)).rejects.toThrow(
        'Datas devem estar no formato YYYY-MM-DD',
      );
    });

    it('should swap dates when start is greater than end', async () => {
      const mockQuery = { start: '2024-01-31', end: '2024-01-01' };
      const mockDocuments: OrderDocument[] = [];
      const mockGroupedData: UserDto[] = [];

      mockOrderRepository.countDocuments.mockResolvedValue(0);
      mockOrderRepository.find.mockResolvedValue(mockDocuments);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      await searchOrdersUseCase.execute(mockQuery);

      expect(mockOrderRepository.countDocuments).toHaveBeenCalledWith({
        date: { $gte: '2024-01-01', $lte: '2024-01-31' },
      });
    });

    it('should not apply date filter when order_id is provided', async () => {
      const mockQuery = {
        order_id: '1',
        start: '2024-01-01',
        end: '2024-01-31',
      };
      const mockDocuments: OrderDocument[] = [];
      const mockGroupedData: UserDto[] = [];

      mockOrderRepository.countDocuments.mockResolvedValue(0);
      mockOrderRepository.find.mockResolvedValue(mockDocuments);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      await searchOrdersUseCase.execute(mockQuery);

      expect(mockOrderRepository.countDocuments).toHaveBeenCalledWith({
        order_id: 1,
      });
    });

    it('should not apply date filter when user_id is provided', async () => {
      const mockQuery = {
        user_id: '1',
        start: '2024-01-01',
        end: '2024-01-31',
      };
      const mockDocuments: OrderDocument[] = [];
      const mockGroupedData: UserDto[] = [];

      mockOrderRepository.countDocuments.mockResolvedValue(0);
      mockOrderRepository.find.mockResolvedValue(mockDocuments);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      await searchOrdersUseCase.execute(mockQuery);

      expect(mockOrderRepository.countDocuments).toHaveBeenCalledWith({
        user_id: 1,
      });
    });

    it('should handle pagination correctly', async () => {
      const mockQuery = { page: '3' };
      const mockDocuments: OrderDocument[] = [];
      const mockGroupedData: UserDto[] = [];

      mockOrderRepository.countDocuments.mockResolvedValue(250);
      mockOrderRepository.find.mockResolvedValue(mockDocuments);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      await searchOrdersUseCase.execute(mockQuery);

      expect(mockOrderRepository.find).toHaveBeenCalledWith(
        {},
        { skip: 200, limit: 100 },
      );
    });

    it('should handle all parameter to return all results', async () => {
      const mockQuery = { all: 'true' };
      const mockDocuments: OrderDocument[] = [];
      const mockGroupedData: UserDto[] = [];

      mockOrderRepository.countDocuments.mockResolvedValue(0);
      mockOrderRepository.find.mockResolvedValue(mockDocuments);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      await searchOrdersUseCase.execute(mockQuery);

      expect(mockOrderRepository.find).toHaveBeenCalledWith({});
    });

    it('should handle empty query', async () => {
      const mockQuery = {};
      const mockDocuments: OrderDocument[] = [];
      const mockGroupedData: UserDto[] = [];

      mockOrderRepository.countDocuments.mockResolvedValue(0);
      mockOrderRepository.find.mockResolvedValue(mockDocuments);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      await searchOrdersUseCase.execute(mockQuery);

      expect(mockOrderRepository.countDocuments).toHaveBeenCalledWith({});
      expect(mockOrderRepository.find).toHaveBeenCalledWith(
        {},
        { skip: 0, limit: 100 },
      );
    });
  });
});
