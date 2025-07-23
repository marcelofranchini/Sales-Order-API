import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '@/main/middlewares/error-handler';

describe('Error Handler Middleware', () => {
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

  it('should handle Error with 400 status', () => {
    const error = new Error('Validation failed');
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Validation failed',
    });
  });

  it('should handle unknown error with 500 status', () => {
    const error = 'Unknown error';
    
    errorHandler(error as any, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error',
    });
  });
}); 