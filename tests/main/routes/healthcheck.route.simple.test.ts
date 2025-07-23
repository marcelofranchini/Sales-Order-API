import request from 'supertest';
import express, { Express } from 'express';
import { setupRoutes } from '@/main/routes/setup.route';
import { corsMiddleware } from '@/main/middlewares/cors';

jest.mock('@/main/factories/infra/database-connection.make', () => ({
  MakeDatabaseConnection: {
    create: jest.fn(() => ({
      connect: jest.fn(),
      disconnect: jest.fn(),
      isConnected: jest.fn(() => true),
    })),
  },
}));

describe('Healthcheck Route Simple', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(corsMiddleware);
    setupRoutes(app);
  });

  describe('GET /healthcheck', () => {
    it('should return 200 status', async () => {
      const response = await request(app).get('/healthcheck');
      expect(response.status).toBe(200);
    });

    it('should return JSON response', async () => {
      const response = await request(app).get('/healthcheck');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('should have required properties', async () => {
      const response = await request(app).get('/healthcheck');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('db');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
