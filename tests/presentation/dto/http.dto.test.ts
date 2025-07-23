import { HttpRequest, HttpResponse, HealthCheckRequest, HealthCheckResponse } from '@/presentation/dto/http.dto';

describe('HTTP DTOs', () => {
  describe('HttpRequest', () => {
    it('should have correct structure', () => {
      const request: HttpRequest = {
        statusCode: jest.fn(),
        body: { test: 'value' },
        params: { id: '1' },
        query: { page: '1' },
        headers: { 'content-type': 'application/json' },
        file: undefined,
        files: [],
      };

      expect(request).toHaveProperty('statusCode');
      expect(request).toHaveProperty('body');
      expect(request).toHaveProperty('params');
      expect(request).toHaveProperty('query');
      expect(request).toHaveProperty('headers');
      expect(request).toHaveProperty('file');
      expect(request).toHaveProperty('files');
    });

    it('should allow optional properties', () => {
      const request: HttpRequest = {
        statusCode: jest.fn(),
      };

      expect(request).toBeDefined();
      expect(typeof request.statusCode).toBe('function');
    });

    it('should handle file property', () => {
      const mockFile = {
        originalname: 'test.txt',
        buffer: Buffer.from('test'),
        size: 100,
      } as Express.Multer.File;

      const request: HttpRequest = {
        statusCode: jest.fn(),
        file: mockFile,
      };

      expect(request.file).toBe(mockFile);
    });
  });

  describe('HttpResponse', () => {
    it('should have correct structure', () => {
      const response: HttpResponse = {
        statusCode: 200,
        body: { message: 'success' },
      };

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'success' });
    });

    it('should support generic types', () => {
      const response: HttpResponse<string> = {
        statusCode: 200,
        body: 'test string',
      };

      expect(response.statusCode).toBe(200);
      expect(response.body).toBe('test string');
    });

    it('should support complex body types', () => {
      const complexBody = {
        data: [{ id: 1, name: 'test' }],
        count: 1,
      };

      const response: HttpResponse<typeof complexBody> = {
        statusCode: 200,
        body: complexBody,
      };

      expect(response.body).toEqual(complexBody);
    });
  });

  describe('HealthCheckRequest', () => {
    it('should have correct structure', () => {
      const request: HealthCheckRequest = {
        headers: { 'user-agent': 'test' },
      };

      expect(request).toHaveProperty('headers');
      expect(request.body).toBeUndefined();
      expect(request.params).toBeUndefined();
      expect(request.query).toBeUndefined();
    });

    it('should not allow body, params, or query', () => {
      const request: HealthCheckRequest = {
        headers: {},
      };

      expect(request.body).toBeUndefined();
      expect(request.params).toBeUndefined();
      expect(request.query).toBeUndefined();
    });
  });

  describe('HealthCheckResponse', () => {
    it('should have correct structure', () => {
      const response: HealthCheckResponse = {
        statusCode: 200,
        body: {
          status: 'OK',
          db: 'OK',
        },
      };

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('db');
    });

    it('should allow 500 status code', () => {
      const response: HealthCheckResponse = {
        statusCode: 500,
        body: {
          status: 'FAIL',
          db: 'FAIL',
        },
      };

      expect(response.statusCode).toBe(500);
    });

    it('should allow 503 status code', () => {
      const response: HealthCheckResponse = {
        statusCode: 503,
        body: {
          status: 'FAIL',
          db: 'FAIL',
        },
      };

      expect(response.statusCode).toBe(503);
    });
  });
}); 