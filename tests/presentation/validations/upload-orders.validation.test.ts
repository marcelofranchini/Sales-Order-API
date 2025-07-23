import { UploadOrdersValidation } from '@/presentation/validations/upload-orders.validation';
import { Request } from 'express';

describe('UploadOrdersValidation', () => {
  let mockRequest: Partial<Request>;

  beforeEach(() => {
    mockRequest = {
      file: undefined,
    };
  });

  describe('validate', () => {
    it('should pass validation with valid TXT file', () => {
      mockRequest.file = {
        originalname: 'test.txt',
        buffer: Buffer.from('test content'),
        size: 100,
      } as Express.Multer.File;

      expect(() => {
        UploadOrdersValidation.validate(mockRequest as Request);
      }).not.toThrow();
    });

    it('should throw error when no file is provided', () => {
      mockRequest.file = undefined;

      expect(() => {
        UploadOrdersValidation.validate(mockRequest as Request);
      }).toThrow('Nenhum arquivo foi enviado');
    });

    it('should throw error when file is null', () => {
      mockRequest.file = null as any;

      expect(() => {
        UploadOrdersValidation.validate(mockRequest as Request);
      }).toThrow('Nenhum arquivo foi enviado');
    });

    it('should throw error for non-TXT file extension', () => {
      mockRequest.file = {
        originalname: 'test.pdf',
        buffer: Buffer.from('test content'),
        size: 100,
      } as Express.Multer.File;

      expect(() => {
        UploadOrdersValidation.validate(mockRequest as Request);
      }).toThrow('Apenas arquivos TXT são permitidos');
    });

    it('should pass validation with uppercase TXT extension (converted to lowercase)', () => {
      mockRequest.file = {
        originalname: 'test.TXT',
        buffer: Buffer.from('test content'),
        size: 100,
      } as Express.Multer.File;

      expect(() => {
        UploadOrdersValidation.validate(mockRequest as Request);
      }).not.toThrow();
    });

    it('should pass validation with lowercase txt extension', () => {
      mockRequest.file = {
        originalname: 'test.txt',
        buffer: Buffer.from('test content'),
        size: 100,
      } as Express.Multer.File;

      expect(() => {
        UploadOrdersValidation.validate(mockRequest as Request);
      }).not.toThrow();
    });

    it('should pass validation with file containing dots in name', () => {
      mockRequest.file = {
        originalname: 'test.file.txt',
        buffer: Buffer.from('test content'),
        size: 100,
      } as Express.Multer.File;

      expect(() => {
        UploadOrdersValidation.validate(mockRequest as Request);
      }).not.toThrow();
    });

    it('should throw error for file without extension', () => {
      mockRequest.file = {
        originalname: 'testfile',
        buffer: Buffer.from('test content'),
        size: 100,
      } as Express.Multer.File;

      expect(() => {
        UploadOrdersValidation.validate(mockRequest as Request);
      }).toThrow('Apenas arquivos TXT são permitidos');
    });

    it('should throw error for file with empty extension', () => {
      mockRequest.file = {
        originalname: 'testfile.',
        buffer: Buffer.from('test content'),
        size: 100,
      } as Express.Multer.File;

      expect(() => {
        UploadOrdersValidation.validate(mockRequest as Request);
      }).toThrow('Apenas arquivos TXT são permitidos');
    });

    it('should pass validation with special characters in filename', () => {
      mockRequest.file = {
        originalname: 'test-file_123.txt',
        buffer: Buffer.from('test content'),
        size: 100,
      } as Express.Multer.File;

      expect(() => {
        UploadOrdersValidation.validate(mockRequest as Request);
      }).not.toThrow();
    });
  });
}); 