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

describe('Healthcheck Route', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(corsMiddleware);
    setupRoutes(app);
  });

  describe('GET /healthcheck', () => {
    it('should return health status with correct structure', async () => {
      const response = await request(app)
        .get('/healthcheck')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: expect.stringMatching(/^(OK|FAIL)$/),
        db: expect.stringMatching(/^(OK|FAIL)$/),
        app: expect.any(String),
        version: expect.any(String),
        environment: expect.any(String),
        timestamp: expect.any(String),
      });
    });

    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent').expect(404);
    });

    it('should handle POST request to healthcheck (should return 404)', async () => {
      const response = await request(app).post('/healthcheck').expect(404);
    });
  });
});
