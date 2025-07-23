import cors from 'cors';

jest.mock('cors', () => jest.fn());

describe('CORS Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create cors middleware with correct configuration', () => {
    const mockCorsMiddleware = jest.fn();
    (cors as jest.MockedFunction<typeof cors>).mockReturnValue(mockCorsMiddleware);

    require('@/main/middlewares/cors');

    expect(cors).toHaveBeenCalledWith({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
  });

  it('should export corsMiddleware function', () => {
    const { corsMiddleware } = require('@/main/middlewares/cors');
    expect(typeof corsMiddleware).toBe('function');
  });

  it('should handle CORS configuration', () => {
    const mockCorsMiddleware = jest.fn();
    (cors as jest.MockedFunction<typeof cors>).mockReturnValue(mockCorsMiddleware);

    const { corsMiddleware } = require('@/main/middlewares/cors');
    
    expect(corsMiddleware).toBeDefined();
    expect(typeof corsMiddleware).toBe('function');
  });

  it('should allow all origins', () => {
    (cors as jest.MockedFunction<typeof cors>).mockImplementation((options: any) => {
      expect(options.origin).toBe('*');
      return jest.fn();
    });

    require('@/main/middlewares/cors');
  });

  it('should allow correct HTTP methods', () => {
    (cors as jest.MockedFunction<typeof cors>).mockImplementation((options: any) => {
      expect(options.methods).toEqual(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
      return jest.fn();
    });

    require('@/main/middlewares/cors');
  });

  it('should allow correct headers', () => {
    (cors as jest.MockedFunction<typeof cors>).mockImplementation((options: any) => {
      expect(options.allowedHeaders).toEqual(['Content-Type', 'Authorization']);
      return jest.fn();
    });

    require('@/main/middlewares/cors');
  });
}); 