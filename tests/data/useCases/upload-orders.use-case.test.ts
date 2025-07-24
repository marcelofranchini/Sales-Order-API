import { UploadOrdersUseCaseImpl } from '../../../src/data/useCases/upload-orders.use-case';
import { OrderRepository } from '../../../src/domain/repositories/order-repository.interface';
import { OrderAggregationService } from '../../../src/domain/services/order-aggregation.service.interface';
import {
  UploadOrdersResponseDto,
  UserDto,
} from '../../../src/presentation/dto/order.dto';

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
      const userId = '0000000001';
      const name = 'João Silva'.padEnd(45, ' ');
      const orderId = '0000000001';
      const productId = '0000000001';
      const productValue = '100.00'.padEnd(12, ' ');
      const date = '20240101';
      const line = `${userId}${name}${orderId}${productId}${productValue}${date}`;
      expect(line.length).toBe(95);
      const mockFile = {
        originalname: 'test.txt',
        buffer: Buffer.from(line + '\n'),
        size: 100,
      } as Express.Multer.File;

      const mockGroupedData: UserDto[] = [
        {
          user_id: 1,
          name: 'João Silva',
          orders: [],
        },
      ];

      mockOrderRepository.insertMany.mockResolvedValue([{ _id: '1' }] as any[]);
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
      const userId = '0000000001';
      const name = 'João Silva'.padEnd(45, ' ');
      const orderId = '0000000001';
      const productId = '0000000001';
      const productValue = '100.00'.padEnd(12, ' ');
      const date = '20240101';
      const line = `${userId}${name}${orderId}${productId}${productValue}${date}`;
      expect(line.length).toBe(95);
      const mockFile = {
        originalname: 'test.txt',
        buffer: Buffer.from(line + '\n\n\n'),
        size: 100,
      } as Express.Multer.File;

      const mockGroupedData: UserDto[] = [];

      mockOrderRepository.insertMany.mockResolvedValue([{ _id: '1' }] as any[]);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      const result = await uploadOrdersUseCase.execute(mockFile);

      expect(result.lines).toBe(1);
    });

    it('should handle duplicate key errors', async () => {
      const userId = '0000000001';
      const name = 'João Silva'.padEnd(45, ' ');
      const orderId = '0000000001';
      const productId = '0000000001';
      const productValue = '100.00'.padEnd(12, ' ');
      const date = '20240101';
      const line = `${userId}${name}${orderId}${productId}${productValue}${date}`;
      expect(line.length).toBe(95);
      const mockFile = {
        originalname: 'test.txt',
        buffer: Buffer.from(line + '\n'),
        size: 100,
      } as Express.Multer.File;

      const mockGroupedData: UserDto[] = [];

      const duplicateError = new Error('Duplicate key');
      (duplicateError as any).code = 11000;
      mockOrderRepository.insertMany.mockRejectedValue(duplicateError);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      const result = await uploadOrdersUseCase.execute(mockFile);

      expect(result.savedOrders).toBe(0);
      expect(result.skippedOrders).toBe(1);
    });

    it('should handle other insertion errors', async () => {
      const userId = '0000000001';
      const name = 'João Silva'.padEnd(45, ' ');
      const orderId = '0000000001';
      const productId = '0000000001';
      const productValue = '100.00'.padEnd(12, ' ');
      const date = '20240101';
      const line = `${userId}${name}${orderId}${productId}${productValue}${date}`;
      expect(line.length).toBe(95);
      const mockFile = {
        originalname: 'test.txt',
        buffer: Buffer.from(line + '\n'),
        size: 100,
      } as Express.Multer.File;

      const mockGroupedData: UserDto[] = [];

      const otherError = new Error('Other error');
      (otherError as any).code = 500;
      mockOrderRepository.insertMany.mockRejectedValue(otherError);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      const result = await uploadOrdersUseCase.execute(mockFile);

      expect(result.savedOrders).toBe(0);
      expect(result.skippedOrders).toBe(1);
    });

    it('should process multiple lines correctly', async () => {
      const userId1 = '0000000001';
      const name1 = 'João Silva'.padEnd(45, ' ');
      const orderId1 = '0000000001';
      const productId1 = '0000000001';
      const productValue1 = '100.00'.padEnd(12, ' ');
      const date1 = '20240101';
      const line1 = `${userId1}${name1}${orderId1}${productId1}${productValue1}${date1}`;
      expect(line1.length).toBe(95);
      const userId2 = '0000000002';
      const name2 = 'Maria Santos'.padEnd(45, ' ');
      const orderId2 = '0000000002';
      const productId2 = '0000000002';
      const productValue2 = '200.00'.padEnd(12, ' ');
      const date2 = '20240102';
      const line2 = `${userId2}${name2}${orderId2}${productId2}${productValue2}${date2}`;
      expect(line2.length).toBe(95);
      const mockFile = {
        originalname: 'test.txt',
        buffer: Buffer.from(line1 + '\n' + line2 + '\n'),
        size: 200,
      } as Express.Multer.File;

      const mockGroupedData: UserDto[] = [];

      mockOrderRepository.insertMany.mockResolvedValue([
        { _id: '1' },
        { _id: '2' },
      ] as any[]);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      const result = await uploadOrdersUseCase.execute(mockFile);

      expect(result.lines).toBe(2);
      expect(result.savedOrders).toBe(2);
    });

    it('should handle large files with batching', async () => {
      const lines: string[] = [];
      for (let i = 0; i < 3000; i++) {
        const userId = String(i + 1).padStart(10, '0');
        const name = `User Test ${i}`.padEnd(45, ' ');
        const orderId = String(i + 1).padStart(10, '0');
        const productId = String(i + 1).padStart(10, '0');
        const value = String(100 + i).padEnd(12, ' ');
        const date = '20240101';
        const line = `${userId}${name}${orderId}${productId}${value}${date}`;
        expect(line.length).toBe(95);
        lines.push(line);
      }

      const mockFile = {
        originalname: 'large.txt',
        buffer: Buffer.from(lines.join('\n')),
        size: 300000,
      } as Express.Multer.File;

      const mockGroupedData: UserDto[] = [];

      mockOrderRepository.insertMany.mockResolvedValue([{ _id: '1' }] as any[]);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      const result = await uploadOrdersUseCase.execute(mockFile);

      expect(result.lines).toBe(3000);
      expect(result.savedOrders).toBeGreaterThan(0);
    });

    it('should parse line data correctly', async () => {
      const userId = '0000000001';
      const name = 'João Silva'.padEnd(45, ' ');
      const orderId = '0000000001';
      const productId = '0000000001';
      const productValue = '100.00'.padEnd(12, ' ');
      const date = '20240101';
      const line = `${userId}${name}${orderId}${productId}${productValue}${date}`;
      expect(line.length).toBe(95);
      const mockFile = {
        originalname: 'test.txt',
        buffer: Buffer.from(line + '\n'),
        size: 100,
      } as Express.Multer.File;

      const mockGroupedData: UserDto[] = [];

      mockOrderRepository.insertMany.mockResolvedValue([{ _id: '1' }] as any[]);
      mockOrderAggregationService.groupAndSum.mockReturnValue(mockGroupedData);

      await uploadOrdersUseCase.execute(mockFile);

      expect(mockOrderRepository.insertMany).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            user_id: 1,
            name: 'João Silva',
            order_id: 1,
            product_id: 1,
            product_value: '100.00',
            date: '2024-01-01',
          }),
        ]),
        expect.objectContaining({
          ordered: false,
        }),
      );
    });
  });
});
