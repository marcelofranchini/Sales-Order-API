import request from 'supertest';
import express, { Express } from 'express';
import { setupRoutes } from '../../../src/main/routes/setup.route';
import { corsMiddleware } from '../../../src/main/middlewares/cors';

jest.mock('../../../src/main/factories/infra/database-connection.make', () => ({
  MakeDatabaseConnection: {
    create: jest.fn(() => ({
      connect: jest.fn().mockResolvedValue(true),
      disconnect: jest.fn().mockResolvedValue(true),
      isConnected: jest.fn().mockReturnValue(true),
    })),
  },
}));

describe('Healthcheck Integration Tests', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(corsMiddleware);
    setupRoutes(app);
  });

  describe('GET /healthcheck', () => {
    it('should return health status when database is connected', async () => {
      const response = await request(app).get('/healthcheck');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('app');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('db');
    });

    it('should return error when database is not connected', async () => {
      const {
        MakeDatabaseConnection,
      } = require('../../../src/main/factories/infra/database-connection.make');
      MakeDatabaseConnection.create.mockReturnValue({
        connect: jest.fn().mockResolvedValue(false),
        disconnect: jest.fn().mockResolvedValue(true),
        isConnected: jest.fn().mockReturnValue(false),
      });

      const response = await request(app).get('/healthcheck');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('db');
    });

    it('should handle database connection error', async () => {
      const {
        MakeDatabaseConnection,
      } = require('../../../src/main/factories/infra/database-connection.make');
      MakeDatabaseConnection.create.mockReturnValue({
        connect: jest.fn().mockRejectedValue(new Error('Connection failed')),
        disconnect: jest.fn().mockResolvedValue(true),
        isConnected: jest.fn().mockReturnValue(false),
      });

      const response = await request(app).get('/healthcheck');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('db');
    });

    it('should return correct response structure', async () => {
      const response = await request(app).get('/healthcheck');

      expect(response.body).toMatchObject({
        status: expect.any(String),
        timestamp: expect.any(String),
        app: expect.any(String),
        version: expect.any(String),
        environment: expect.any(String),
        db: expect.any(String),
      });
    });

    it('should handle multiple requests', async () => {
      const response1 = await request(app).get('/healthcheck');
      const response2 = await request(app).get('/healthcheck');

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response1.body).toHaveProperty('status');
      expect(response2.body).toHaveProperty('status');
    });
  });
});
