import { SearchOrdersController } from '../../../src/presentation/controllers/search-orders.controller';
import { SearchOrdersUseCase } from '../../../src/domain/useCases/search-orders.usecase.interface';
import { HttpRequest } from '../../../src/presentation/dto/http.dto';
import { UserDto } from '../../../src/presentation/dto/order.dto';

describe('SearchOrdersController', () => {
  let searchOrdersController: SearchOrdersController;
  let mockSearchOrdersUseCase: jest.Mocked<SearchOrdersUseCase>;

  beforeEach(() => {
    mockSearchOrdersUseCase = {
      execute: jest.fn(),
    };

    searchOrdersController = new SearchOrdersController(
      mockSearchOrdersUseCase,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should return 200 status when search is successful', async () => {
      const mockRequest = {
        query: { user_id: '1', page: '1' },
        statusCode: jest.fn(),
      };

      const mockResult: UserDto[] = [
        {
          user_id: 1,
          name: 'Test User',
          orders: [],
        },
      ];

      mockSearchOrdersUseCase.execute.mockResolvedValue(mockResult);

      const result = await searchOrdersController.handle(
        mockRequest as HttpRequest,
      );

      expect(mockSearchOrdersUseCase.execute).toHaveBeenCalledWith({
        user_id: '1',
        page: '1',
      });
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(mockResult);
    });

    it('should handle empty query parameters', async () => {
      const mockRequest = {
        query: {},
        statusCode: jest.fn(),
      };

      const mockResult: UserDto[] = [];

      mockSearchOrdersUseCase.execute.mockResolvedValue(mockResult);

      const result = await searchOrdersController.handle(
        mockRequest as HttpRequest,
      );

      expect(mockSearchOrdersUseCase.execute).toHaveBeenCalledWith({});
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(mockResult);
    });

    it('should handle multiple query parameters', async () => {
      const mockRequest = {
        query: {
          user_id: '1',
          order_id: '100',
          start: '2024-01-01',
          end: '2024-01-31',
          page: '2',
        },
        statusCode: jest.fn(),
      };

      const mockResult: UserDto[] = [
        {
          user_id: 1,
          name: 'Test User',
          orders: [],
        },
      ];

      mockSearchOrdersUseCase.execute.mockResolvedValue(mockResult);

      const result = await searchOrdersController.handle(
        mockRequest as HttpRequest,
      );

      expect(mockSearchOrdersUseCase.execute).toHaveBeenCalledWith({
        user_id: '1',
        order_id: '100',
        start: '2024-01-01',
        end: '2024-01-31',
        page: '2',
      });
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(mockResult);
    });

    it('should return 400 status when use case throws error', async () => {
      const mockRequest = {
        query: { invalid_param: 'value' },
        statusCode: jest.fn(),
      };

      const error = new Error('Parâmetro(s) não permitido(s): invalid_param');
      mockSearchOrdersUseCase.execute.mockRejectedValue(error);

      const result = await searchOrdersController.handle(
        mockRequest as HttpRequest,
      );

      expect(result.statusCode).toBe(400);
      expect(result.body).toEqual({
        error: 'Parâmetro(s) não permitido(s): invalid_param',
      });
    });

    it('should return 500 status for unexpected errors', async () => {
      const mockRequest = {
        query: { user_id: '1' },
        statusCode: jest.fn(),
      };

      const error = new Error('Database connection failed');
      mockSearchOrdersUseCase.execute.mockRejectedValue(error);

      const result = await searchOrdersController.handle(
        mockRequest as HttpRequest,
      );

      expect(result.statusCode).toBe(500);
      expect(result.body).toEqual({
        error: 'Internal server error',
      });
    });

    it('should handle null query parameters', async () => {
      const mockRequest = {
        query: null as any,
        statusCode: jest.fn(),
      };

      const mockResult: UserDto[] = [];

      mockSearchOrdersUseCase.execute.mockResolvedValue(mockResult);

      const result = await searchOrdersController.handle(
        mockRequest as HttpRequest,
      );

      expect(mockSearchOrdersUseCase.execute).toHaveBeenCalledWith({});
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(mockResult);
    });

    it('should handle undefined query parameters', async () => {
      const mockRequest = {
        query: undefined as any,
        statusCode: jest.fn(),
      };

      const mockResult: UserDto[] = [];

      mockSearchOrdersUseCase.execute.mockResolvedValue(mockResult);

      const result = await searchOrdersController.handle(
        mockRequest as HttpRequest,
      );

      expect(mockSearchOrdersUseCase.execute).toHaveBeenCalledWith({});
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(mockResult);
    });
  });
});
