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

describe('Healthcheck Route - Simple Test', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(corsMiddleware);
    setupRoutes(app);
  });

  it('should return 200 and health status', async () => {
    const response = await request(app)
      .get('/healthcheck')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('db');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('app');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('environment');
  });

  it('should handle CORS preflight request', async () => {
    await request(app).options('/healthcheck').expect(204);
  });
});
