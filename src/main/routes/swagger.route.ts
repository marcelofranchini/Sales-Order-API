import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../config/swagger';

const swaggerRouter = Router();

swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export { swaggerRouter };
