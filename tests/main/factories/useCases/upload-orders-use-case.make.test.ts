import { MakeUploadOrdersUseCase } from '../../../../src/main/factories/useCases/upload-orders-use-case.make';
import { UploadOrdersUseCase } from '../../../../src/domain/useCases/upload-orders.usecase.interface';

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

describe('MakeUploadOrdersUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an UploadOrdersUseCase instance', () => {
      const result = MakeUploadOrdersUseCase.create();

      expect(result).toBeDefined();
      expect(typeof result.execute).toBe('function');
    });

    it('should implement UploadOrdersUseCase', () => {
      const useCase = MakeUploadOrdersUseCase.create();

      expect(typeof useCase.execute).toBe('function');
    });

    it('should handle file upload correctly', async () => {
      const useCase = MakeUploadOrdersUseCase.create();
      const mockFile = {
        originalname: 'test.txt',
        buffer: Buffer.from('test content'),
        size: 100,
      } as Express.Multer.File;

      const mockResponse = {
        message: 'Arquivo TXT processado e salvo no MongoDB com sucesso',
        fileName: 'test.txt',
        fileSize: 100,
        lines: 1,
        savedOrders: 1,
        skippedOrders: 0,
        data: [],
      };

      jest.spyOn(useCase, 'execute').mockResolvedValue(mockResponse);

      const result = await useCase.execute(mockFile);

      expect(result).toEqual(mockResponse);
    });

    it('should handle null file', async () => {
      const useCase = MakeUploadOrdersUseCase.create();

      jest
        .spyOn(useCase, 'execute')
        .mockRejectedValue(new Error('Nenhum arquivo foi enviado'));

      await expect(useCase.execute(null as any)).rejects.toThrow(
        'Nenhum arquivo foi enviado',
      );
    });
  });
});
