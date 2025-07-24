import { Router } from 'express';
import { adaptExpressRoute } from '../../infra/adapters/http-express.adpter';
import { MakeHealthcheckController } from '../factories/controllers/healthcheck-controller.make';

const healthcheckRouter = Router();
const healthcheckController = MakeHealthcheckController.create();

healthcheckRouter.get('/', adaptExpressRoute(healthcheckController));

export { healthcheckRouter };
