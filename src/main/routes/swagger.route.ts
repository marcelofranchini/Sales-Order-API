import { Router } from 'express';
import swaggerSpec from '../config/swagger';

const swaggerRouter = Router();

swaggerRouter.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

export { swaggerRouter };
