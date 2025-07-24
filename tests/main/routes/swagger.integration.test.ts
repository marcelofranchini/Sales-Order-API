import request from 'supertest';
import express, { Express } from 'express';
import { setupRoutes } from '../../../src/main/routes/setup.route';
import { corsMiddleware } from '../../../src/main/middlewares/cors';

jest.mock(
  '../../../src/main/factories/useCases/healthcheck-use-case.make',
  () => ({
    MakeHealthcheckUseCase: {
      create: jest.fn(() => ({
        execute: jest.fn().mockResolvedValue({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: 1000,
          database: 'connected',
        }),
      })),
    },
  }),
);

jest.mock(
  '../../../src/main/factories/controllers/healthcheck-controller.make',
  () => ({
    MakeHealthcheckController: {
      create: jest.fn(() => ({
        handle: jest.fn().mockResolvedValue({
          statusCode: 200,
          body: {
            status: 'OK',
            timestamp: new Date().toISOString(),
            app: 'salesorder-api',
            version: '1.0.0',
            environment: 'dev',
            db: 'OK',
          },
        }),
      })),
    },
  }),
);

describe('Swagger Integration Tests', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(corsMiddleware);
    setupRoutes(app);
  });

  describe('GET /api-docs', () => {
    it('should serve swagger documentation', async () => {
      const response = await request(app).get('/api-docs/');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
    });

    it('should return HTML content', async () => {
      const response = await request(app).get('/api-docs/');

      expect(response.text).toContain('<!DOCTYPE html>');
      expect(response.text).toContain('swagger-ui');
    });
  });
});
