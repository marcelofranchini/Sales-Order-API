import { Express } from 'express';
import { healthcheckRouter } from '@/main/routes/healthcheck.route';
import { swaggerRouter } from '@/main/routes/swagger.route';
import { ordersRouter } from '@/main/routes/orders.route';

export const setupRoutes = (app: Express): void => {
  app.use('/api-docs', swaggerRouter);
  app.use('/healthcheck', healthcheckRouter);
  app.use('/order', ordersRouter);
};
