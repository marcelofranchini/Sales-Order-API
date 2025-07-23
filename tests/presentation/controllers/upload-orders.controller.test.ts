import { UploadOrdersController } from '@/presentation/controllers/upload-orders.controller';
import { UploadOrdersUseCase } from '@/domain/useCases/upload-orders.usecase.interface';
import { HttpRequest } from '@/presentation/dto/http.dto';

describe('UploadOrdersController', () => {
  let uploadOrdersController: UploadOrdersController;
  let mockUploadOrdersUseCase: jest.Mocked<UploadOrdersUseCase>;

  beforeEach(() => {
    mockUploadOrdersUseCase = {
      execute: jest.fn(),
    };

    uploadOrdersController = new UploadOrdersController(mockUploadOrdersUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should return 200 status when upload is successful', async () => {
      const mockFile = {
        originalname: 'test.txt',
        buffer: Buffer.from('test content'),
        size: 100,
      };

      const mockRequest = {
        file: mockFile as Express.Multer.File,
      };

      const mockResult = {
        message: 'Arquivo TXT processado e salvo no MongoDB com sucesso',
        fileName: 'test.txt',
        fileSize: 100,
        lines: 1,
        savedOrders: 1,
        skippedOrders: 0,
        data: [],
      };

      mockUploadOrdersUseCase.execute.mockResolvedValue(mockResult);

      const result = await uploadOrdersController.handle(mockRequest as HttpRequest);

      expect(mockUploadOrdersUseCase.execute).toHaveBeenCalledWith(mockFile);
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(mockResult);
    });

    it('should return 400 status when no file is provided', async () => {
      const mockRequest = {
        file: undefined,
      };

      const error = new Error('Nenhum arquivo foi enviado');
      mockUploadOrdersUseCase.execute.mockRejectedValue(error);

      const result = await uploadOrdersController.handle(mockRequest as HttpRequest);

      expect(result.statusCode).toBe(400);
      expect(result.body).toEqual({
        error: 'Nenhum arquivo foi enviado',
      });
    });

    it('should return 400 status for invalid file type', async () => {
      const mockRequest = {
        file: {
          originalname: 'test.pdf',
          buffer: Buffer.from('test content'),
          size: 100,
        } as Express.Multer.File,
      };

      const error = new Error('Apenas arquivos TXT são permitidos');
      mockUploadOrdersUseCase.execute.mockRejectedValue(error);

      const result = await uploadOrdersController.handle(mockRequest as HttpRequest);

      expect(result.statusCode).toBe(400);
      expect(result.body).toEqual({
        error: 'Apenas arquivos TXT são permitidos',
      });
    });

    it('should return 500 status for unexpected errors', async () => {
      const mockRequest = {
        file: {
          originalname: 'test.txt',
          buffer: Buffer.from('test content'),
          size: 100,
        } as Express.Multer.File,
      };

      const error = new Error('Database connection failed');
      mockUploadOrdersUseCase.execute.mockRejectedValue(error);

      const result = await uploadOrdersController.handle(mockRequest as HttpRequest);

      expect(result.statusCode).toBe(500);
      expect(result.body).toEqual({
        error: 'Internal server error',
      });
    });

    it('should handle null file', async () => {
      const mockRequest = {
        file: null as any,
      };

      const error = new Error('Nenhum arquivo foi enviado');
      mockUploadOrdersUseCase.execute.mockRejectedValue(error);

      const result = await uploadOrdersController.handle(mockRequest as HttpRequest);

      expect(result.statusCode).toBe(400);
      expect(result.body).toEqual({
        error: 'Nenhum arquivo foi enviado',
      });
    });

    it('should handle large file upload', async () => {
      const mockFile = {
        originalname: 'large.txt',
        buffer: Buffer.from('large content'),
        size: 1024000,
      };

      const mockRequest = {
        file: mockFile as Express.Multer.File,
      };

      const mockResult = {
        message: 'Arquivo TXT processado e salvo no MongoDB com sucesso',
        fileName: 'large.txt',
        fileSize: 1024000,
        lines: 1000,
        savedOrders: 1000,
        skippedOrders: 0,
        data: [],
      };

      mockUploadOrdersUseCase.execute.mockResolvedValue(mockResult);

      const result = await uploadOrdersController.handle(mockRequest as HttpRequest);

      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(mockResult);
    });

    it('should handle file with special characters in name', async () => {
      const mockFile = {
        originalname: 'test-file_123.txt',
        buffer: Buffer.from('test content'),
        size: 100,
      };

      const mockRequest = {
        file: mockFile as Express.Multer.File,
      };

      const mockResult = {
        message: 'Arquivo TXT processado e salvo no MongoDB com sucesso',
        fileName: 'test-file_123.txt',
        fileSize: 100,
        lines: 1,
        savedOrders: 1,
        skippedOrders: 0,
        data: [],
      };

      mockUploadOrdersUseCase.execute.mockResolvedValue(mockResult);

      const result = await uploadOrdersController.handle(mockRequest as HttpRequest);

      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(mockResult);
    });
  });
}); 