import request from 'supertest';
import express, { Express } from 'express';
import { setupRoutes } from '@/main/routes/setup.route';
import { corsMiddleware } from '@/main/middlewares/cors';

jest.mock('@/main/factories/useCases/upload-orders-use-case.make', () => ({
  MakeUploadOrdersUseCase: {
    create: jest.fn(() => ({
      execute: jest.fn().mockResolvedValue({
        message: 'Arquivo TXT processado e salvo no MongoDB com sucesso',
        fileName: 'test.txt',
        fileSize: 100,
        lines: 1,
        savedOrders: 1,
        skippedOrders: 0,
        data: [],
      }),
    })),
  },
}));

jest.mock('@/main/factories/useCases/search-orders-use-case.make', () => ({
  MakeSearchOrdersUseCase: {
    create: jest.fn(() => ({
      execute: jest.fn().mockResolvedValue([]),
    })),
  },
}));

describe('Orders Integration Tests', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(corsMiddleware);
    setupRoutes(app);
  });

  describe('POST /order/upload', () => {
    it('should upload TXT file successfully', async () => {
      const response = await request(app)
        .post('/order/upload')
        .attach('file', Buffer.from('test content'), 'test.txt');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('fileName', 'test.txt');
    });

    it('should return error when no file is sent', async () => {
      const response = await request(app).post('/order/upload');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return error when sending non-TXT file', async () => {
      const response = await request(app)
        .post('/order/upload')
        .attach('file', Buffer.from('test content'), 'test.pdf');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should handle large file upload', async () => {
      const largeContent = 'test content\n'.repeat(100);
      const response = await request(app)
        .post('/order/upload')
        .attach('file', Buffer.from(largeContent), 'large.txt');

      expect(response.status).toBe(200);
      expect(response.body.lines).toBe(1);
    });
  });

  describe('GET /order/search', () => {
    it('should search orders with valid parameters', async () => {
      const response = await request(app)
        .get('/order/search')
        .query({ user_id: '1', page: '1' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should handle empty query parameters', async () => {
      const response = await request(app).get('/order/search');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return error for invalid parameters', async () => {
      const response = await request(app)
        .get('/order/search')
        .query({ invalid_param: 'value' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should handle date filtering', async () => {
      const response = await request(app)
        .get('/order/search')
        .query({ start: '2024-01-01', end: '2024-01-31' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should handle pagination', async () => {
      const response = await request(app)
        .get('/order/search')
        .query({ page: '2' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should handle all parameter', async () => {
      const response = await request(app)
        .get('/order/search')
        .query({ all: 'true' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
}); 