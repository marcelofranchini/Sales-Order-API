import { Express } from 'express';
import { healthcheckRouter } from './healthcheck.route';
import { swaggerRouter } from './swagger.route';
import { ordersRouter } from './orders.route';

export const setupRoutes = (app: Express): void => {
  app.use('/api-docs', swaggerRouter);
  app.use('/healthcheck', healthcheckRouter);
  app.use('/order', ordersRouter);
};
