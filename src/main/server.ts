import express, { Express } from 'express';
import { Server } from 'http';
import { corsMiddleware } from './middlewares/cors';
import { MakeDatabaseConnection } from './factories/infra/database-connection.make';
import { Environment } from './config/environment';
import { setupRoutes } from './routes/setup.route';
import { errorHandler } from './middlewares/error-handler';

let app: Express;
let server: Server;

async function connectDatabase() {
  console.log('Connecting to MongoDB...');
  await MakeDatabaseConnection.create().connect();
  console.log('MongoDB connected successfully');
}

async function startServer() {
  await connectDatabase();

  app = express();
  app.use(corsMiddleware);
  app.use(express.json());
  setupRoutes(app);
  app.use(errorHandler);

  server = app.listen(Environment.PORT, () => {
    console.log(`Server running on port ${Environment.PORT}`);
    console.log(`Environment: ${Environment.NODE_ENV}`);
    console.log(`Healthcheck: /healthcheck`);
    console.log(`API Documentation: /api-docs`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export { app, server };
