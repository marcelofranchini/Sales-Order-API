import { UploadOrdersController } from '../../../src/presentation/controllers/upload-orders.controller';
import { UploadOrdersUseCase } from '../../../src/domain/useCases/upload-orders.usecase.interface';
import { HttpRequest } from '../../../src/presentation/dto/http.dto';

describe('UploadOrdersController', () => {
  let uploadOrdersController: UploadOrdersController;
  let mockUploadOrdersUseCase: jest.Mocked<UploadOrdersUseCase>;

  beforeEach(() => {
    mockUploadOrdersUseCase = {
      execute: jest.fn(),
    };

    uploadOrdersController = new UploadOrdersController(
      mockUploadOrdersUseCase,
    );
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
      } as Express.Multer.File;

      const mockRequest = {
        file: mockFile,
        statusCode: jest.fn(),
      };

      const mockResult = {
        message: 'Arquivo TXT processado e salvo no MongoDB com sucesso',
        fileName: 'test.txt',
        fileSize: 100,
        lines: 10,
        data: [],
        savedOrders: 5,
        skippedOrders: 0,
      };

      mockUploadOrdersUseCase.execute.mockResolvedValue(mockResult);

      const result = await uploadOrdersController.handle(
        mockRequest as HttpRequest,
      );

      expect(mockUploadOrdersUseCase.execute).toHaveBeenCalledWith(mockFile);
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(mockResult);
    });

    it('should return 400 status when no file is provided', async () => {
      const mockRequest = {
        file: undefined,
        statusCode: jest.fn(),
      };

      const error = new Error('Nenhum arquivo foi enviado');
      mockUploadOrdersUseCase.execute.mockRejectedValue(error);

      const result = await uploadOrdersController.handle(
        mockRequest as HttpRequest,
      );

      expect(result.statusCode).toBe(400);
      expect(result.body).toEqual({
        error: 'Nenhum arquivo foi enviado',
      });
    });

    it('should return 400 status when file type is invalid', async () => {
      const mockFile = {
        originalname: 'test.pdf',
        buffer: Buffer.from('test content'),
        size: 100,
      } as Express.Multer.File;

      const mockRequest = {
        file: mockFile,
        statusCode: jest.fn(),
      };

      const error = new Error('Apenas arquivos TXT são permitidos');
      mockUploadOrdersUseCase.execute.mockRejectedValue(error);

      const result = await uploadOrdersController.handle(
        mockRequest as HttpRequest,
      );

      expect(result.statusCode).toBe(400);
      expect(result.body).toEqual({
        error: 'Apenas arquivos TXT são permitidos',
      });
    });

    it('should return 500 status for unexpected errors', async () => {
      const mockFile = {
        originalname: 'test.txt',
        buffer: Buffer.from('test content'),
        size: 100,
      } as Express.Multer.File;

      const mockRequest = {
        file: mockFile,
        statusCode: jest.fn(),
      };

      const error = new Error('Database connection failed');
      mockUploadOrdersUseCase.execute.mockRejectedValue(error);

      const result = await uploadOrdersController.handle(
        mockRequest as HttpRequest,
      );

      expect(result.statusCode).toBe(500);
      expect(result.body).toEqual({
        error: 'Internal server error',
      });
    });

    it('should handle null file', async () => {
      const mockRequest = {
        file: null as any,
        statusCode: jest.fn(),
      };

      const error = new Error('Nenhum arquivo foi enviado');
      mockUploadOrdersUseCase.execute.mockRejectedValue(error);

      const result = await uploadOrdersController.handle(
        mockRequest as HttpRequest,
      );

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
      } as Express.Multer.File;

      const mockRequest = {
        file: mockFile,
        statusCode: jest.fn(),
      };

      const mockResult = {
        message: 'Arquivo TXT processado e salvo no MongoDB com sucesso',
        fileName: 'large.txt',
        fileSize: 1024000,
        lines: 1000,
        data: [],
        savedOrders: 1000,
        skippedOrders: 50,
      };

      mockUploadOrdersUseCase.execute.mockResolvedValue(mockResult);

      const result = await uploadOrdersController.handle(
        mockRequest as HttpRequest,
      );

      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(mockResult);
    });
  });
});
