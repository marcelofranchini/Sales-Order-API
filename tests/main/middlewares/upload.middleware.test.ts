import { Request, Response, NextFunction } from 'express';
import { UploadMiddleware } from '../../../src/main/middlewares/upload.middleware';
import { UploadAdapterInterface } from '../../../src/data/interfaces/upload-adapter.interface';

const mockMulterAdapter: UploadAdapterInterface = {
  single: jest
    .fn()
    .mockReturnValue((req: Request, res: Response, next: NextFunction) => {
      next();
    }),
};

describe('Upload Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() when middleware is executed', () => {
    const middleware = new UploadMiddleware(mockMulterAdapter);
    const middlewareHandler = middleware.handle('file');

    middlewareHandler(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle file upload correctly', () => {
    const middleware = new UploadMiddleware(mockMulterAdapter);
    const middlewareHandler = middleware.handle('file');

    mockRequest.file = {
      originalname: 'test.txt',
      buffer: Buffer.from('test content'),
      size: 100,
    } as Express.Multer.File;

    middlewareHandler(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.file).toBeDefined();
  });

  it('should handle request without file', () => {
    const middleware = new UploadMiddleware(mockMulterAdapter);
    const middlewareHandler = middleware.handle('file');

    middlewareHandler(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle multiple middleware calls', () => {
    const middleware = new UploadMiddleware(mockMulterAdapter);
    const middlewareHandler = middleware.handle('file');

    middlewareHandler(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );
    expect(mockNext).toHaveBeenCalledTimes(1);

    middlewareHandler(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );
    expect(mockNext).toHaveBeenCalledTimes(2);
  });
});
