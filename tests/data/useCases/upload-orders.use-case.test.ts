import { UploadOrdersUseCaseImpl } from '@/data/useCases/upload-orders.use-case';
import { OrderRepository } from '@/domain/repositories/order-repository.interface';
import { OrderAggregationService } from '@/domain/services/order-aggregation.service.interface';
import { UploadOrdersResponseDto } from '@/presentation/dto/order.dto';
import { UserDto } from '@/presentation/dto/order.dto';

describe('UploadOrdersUseCaseImpl', () => {
  let uploadOrdersUseCase: UploadOrdersUseCaseImpl;
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

    uploadOrdersUseCase = new UploadOrdersUseCaseImpl(
      mockOrderRepository,
      mockOrderAggregationService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should process TXT file successfully', async () => {
      const mockFile = {
        originalname: 'test.txt',
        buffer: Buffer.from('0000000001User Test                                   00000000010000000001000000001020240101\n'),
        size: 100,
      } as Express.Multer.File;

      const mockGroupedData: UserDto[] = [
        {
          user_id: 1,
          name: 'User Test',
          orders: [],
        },
      ];

      mockOrderRepository.dropIndex.mockResolvedValue(undefined);
      mockOrderRepository.insertMany.mockResolvedValue([{ _id: '1' }]);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      const result = await uploadOrdersUseCase.execute(mockFile);

      expect(result).toEqual({
        message: 'Arquivo TXT processado e salvo no MongoDB com sucesso',
        fileName: 'test.txt',
        fileSize: 100,
        lines: 1,
        savedOrders: 1,
        skippedOrders: 0,
        data: mockGroupedData,
      });
    });

    it('should throw error when no file is provided', async () => {
      await expect(uploadOrdersUseCase.execute(null as any)).rejects.toThrow(
        'Nenhum arquivo foi enviado',
      );
    });

    it('should throw error for non-TXT files', async () => {
      const mockFile = {
        originalname: 'test.pdf',
        buffer: Buffer.from('test content'),
        size: 100,
      } as Express.Multer.File;

      await expect(uploadOrdersUseCase.execute(mockFile)).rejects.toThrow(
        'Apenas arquivos TXT são permitidos',
      );
    });

    it('should handle empty lines in file', async () => {
      const mockFile = {
        originalname: 'test.txt',
        buffer: Buffer.from('0000000001User Test                                   00000000010000000001000000001020240101\n\n\n'),
        size: 100,
      } as Express.Multer.File;

      const mockGroupedData: UserDto[] = [];

      mockOrderRepository.dropIndex.mockResolvedValue(undefined);
      mockOrderRepository.insertMany.mockResolvedValue([{ _id: '1' }]);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      const result = await uploadOrdersUseCase.execute(mockFile);

      expect(result.lines).toBe(1);
    });

    it('should handle index drop error gracefully', async () => {
      const mockFile = {
        originalname: 'test.txt',
        buffer: Buffer.from('0000000001User Test                                   00000000010000000001000000001020240101\n'),
        size: 100,
      } as Express.Multer.File;

      const mockGroupedData: UserDto[] = [];

      const indexError = new Error('Index not found');
      (indexError as any).codeName = 'IndexNotFound';
      mockOrderRepository.dropIndex.mockRejectedValue(indexError);
      mockOrderRepository.insertMany.mockResolvedValue([{ _id: '1' }]);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      const result = await uploadOrdersUseCase.execute(mockFile);

      expect(result.savedOrders).toBe(1);
    });

    it('should handle duplicate key errors', async () => {
      const mockFile = {
        originalname: 'test.txt',
        buffer: Buffer.from('0000000001User Test                                   00000000010000000001000000001020240101\n'),
        size: 100,
      } as Express.Multer.File;

      const mockGroupedData: UserDto[] = [];

      mockOrderRepository.dropIndex.mockResolvedValue(undefined);
      
      const duplicateError = new Error('Duplicate key');
      (duplicateError as any).code = 11000;
      mockOrderRepository.insertMany.mockRejectedValue(duplicateError);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      const result = await uploadOrdersUseCase.execute(mockFile);

      expect(result.savedOrders).toBe(0);
      expect(result.skippedOrders).toBe(1);
    });

    it('should handle other insertion errors', async () => {
      const mockFile = {
        originalname: 'test.txt',
        buffer: Buffer.from('0000000001User Test                                   00000000010000000001000000001020240101\n'),
        size: 100,
      } as Express.Multer.File;

      const mockGroupedData: UserDto[] = [];

      mockOrderRepository.dropIndex.mockResolvedValue(undefined);
      
      const otherError = new Error('Other error');
      (otherError as any).code = 500;
      mockOrderRepository.insertMany.mockRejectedValue(otherError);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      const result = await uploadOrdersUseCase.execute(mockFile);

      expect(result.savedOrders).toBe(0);
      expect(result.skippedOrders).toBe(1);
    });

    it('should process multiple lines correctly', async () => {
      const mockFile = {
        originalname: 'test.txt',
        buffer: Buffer.from(
          '0000000001User Test                                   00000000010000000001000000001020240101\n' +
          '0000000002User Test 2                                 00000000020000000002000000002020240102\n'
        ),
        size: 200,
      } as Express.Multer.File;

      const mockGroupedData: UserDto[] = [];

      mockOrderRepository.dropIndex.mockResolvedValue(undefined);
      mockOrderRepository.insertMany.mockResolvedValue([{ _id: '1' }, { _id: '2' }]);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      const result = await uploadOrdersUseCase.execute(mockFile);

      expect(result.lines).toBe(2);
      expect(result.savedOrders).toBe(2);
    });

    it('should handle large files with batching', async () => {
      const lines = [];
      for (let i = 0; i < 3000; i++) {
        lines.push(`0000000001User Test ${i.toString().padStart(10)}00000000010000000001000000001020240101`);
      }
      
      const mockFile = {
        originalname: 'large.txt',
        buffer: Buffer.from(lines.join('\n')),
        size: 300000,
      } as Express.Multer.File;

      const mockGroupedData: UserDto[] = [];

      mockOrderRepository.dropIndex.mockResolvedValue(undefined);
      mockOrderRepository.insertMany.mockResolvedValue(Array(3000).fill({ _id: '1' }));
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      const result = await uploadOrdersUseCase.execute(mockFile);

      expect(result.lines).toBe(3000);
      expect(result.savedOrders).toBeGreaterThan(0);
    });

    it('should parse line data correctly', async () => {
      const mockFile = {
        originalname: 'test.txt',
        buffer: Buffer.from('0000000001João Silva                                 00000000010000000001000000001020240101\n'),
        size: 100,
      } as Express.Multer.File;

      const mockGroupedData: UserDto[] = [];

      mockOrderRepository.dropIndex.mockResolvedValue(undefined);
      mockOrderRepository.insertMany.mockResolvedValue([{ _id: '1' }]);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      await uploadOrdersUseCase.execute(mockFile);

      expect(mockOrderRepository.insertMany).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            user_id: 1,
            name: expect.any(String),
            order_id: expect.any(Number),
            product_id: expect.any(Number),
            product_value: expect.any(String),
            date: expect.any(String),
          }),
        ]),
        expect.objectContaining({
          ordered: false,
        }),
      );
    });
  });
}); 