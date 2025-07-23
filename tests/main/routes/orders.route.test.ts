import request from 'supertest';
import express, { Express } from 'express';
import { setupRoutes } from '@/main/routes/setup.route';
import { corsMiddleware } from '@/main/middlewares/cors';

jest.mock('@/main/factories/useCases/upload-orders-use-case.make', () => ({
  MakeUploadOrdersUseCase: {
    create: () => ({
      execute: jest.fn(async (file) => ({
        message: 'File processed',
        fileName: file.originalname,
        fileSize: file.size,
        lines: 1,
        data: [],
        savedOrders: 1,
        skippedOrders: 0,
      })),
    }),
  },
}));

jest.mock('@/main/factories/useCases/search-orders-use-case.make', () => ({
  MakeSearchOrdersUseCase: {
    create: () => ({
      execute: jest.fn(async (query) => ([{
        user_id: 1,
        name: 'User Test',
        orders: [
          {
            order_id: 1,
            total: '10.00',
            date: '2024-01-01',
            products: [
              { product_id: 1, value: '10.00' },
            ],
          },
        ],
      }]))
    }),
  },
}));

describe('Orders Route', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(corsMiddleware);
    setupRoutes(app);
  });

  describe('POST /order/upload', () => {
    it('should return success when uploading TXT file', async () => {
      const fileContent = '0000000001User Test                                   00000000010000000001000000001020240101';
      const fileBuffer = Buffer.from(fileContent);
      
      const response = await request(app)
        .post('/order/upload')
        .attach('file', fileBuffer, 'test.txt');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('fileName');
      expect(response.body).toHaveProperty('fileSize');
      expect(response.body).toHaveProperty('lines');
      expect(response.body).toHaveProperty('data');
    });

    it('should return error when no file is sent', async () => {
      const response = await request(app).post('/order/upload');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return error when sending non-TXT file', async () => {
      const fileContent = 'fake-pdf-content';
      const fileBuffer = Buffer.from(fileContent);
      
      const response = await request(app)
        .post('/order/upload')
        .attach('file', fileBuffer, 'test.pdf');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /order/search', () => {
    it('should return grouped orders', async () => {
      const response = await request(app).get('/order/search?user_id=1');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('user_id');
      expect(response.body[0]).toHaveProperty('orders');
    });

    it('should return error for invalid parameter', async () => {
      const response = await request(app).get('/order/search?foo=bar');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return error for invalid user_id', async () => {
      const response = await request(app).get('/order/search?user_id=abc');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });
}); 