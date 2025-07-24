import { Router } from 'express';
import { MakeUploadMiddleware } from '../../main/factories/middlewares/upload-middleware.make';
import { MakeUploadOrdersController } from '../../main/factories/controllers/upload-orders-controller.make';
import { MakeSearchOrdersController } from '../../main/factories/controllers/search-orders-controller.make';
import { UploadOrdersValidation } from '../../presentation/validations/upload-orders.validation';
import { SearchOrdersValidation } from '../../presentation/validations/search-orders.validation';
import { adaptExpressRoute } from '../../infra/adapters/http-express.adpter';

const ordersRouter = Router();

const uploadMiddleware = MakeUploadMiddleware.create().handle('file');

ordersRouter.post(
  '/upload',
  uploadMiddleware,
  adaptExpressRoute(
    MakeUploadOrdersController.create(),
    UploadOrdersValidation.validate,
  ),
);

ordersRouter.get(
  '/search',
  adaptExpressRoute(
    MakeSearchOrdersController.create(),
    SearchOrdersValidation.validate,
  ),
);

export { ordersRouter };
