import { Request, Response } from 'express';
import { errorHandler } from '../../../src/main/middlewares/error-handler';

describe('errorHandler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle generic errors', () => {
    const error = new Error('Test error');

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      message: 'Test error',
    });
  });

  it('should handle errors with custom status code', () => {
    const error = new Error('Validation error');
    (error as any).statusCode = 400;

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Bad Request',
      message: 'Validation error',
    });
  });

  it('should handle errors without message', () => {
    const error = new Error();

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
    });
  });

  it('should handle non-Error objects', () => {
    const error = 'String error';

    errorHandler(
      error as any,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
    });
  });

  it('should handle null errors', () => {
    const error = null;

    errorHandler(
      error as any,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
    });
  });

  it('should handle undefined errors', () => {
    const error = undefined;

    errorHandler(
      error as any,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
    });
  });

  it('should handle 404 errors', () => {
    const error = new Error('Not found');
    (error as any).statusCode = 404;

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Not Found',
      message: 'Not found',
    });
  });

  it('should handle 403 errors', () => {
    const error = new Error('Forbidden');
    (error as any).statusCode = 403;

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Forbidden',
      message: 'Forbidden',
    });
  });
});
