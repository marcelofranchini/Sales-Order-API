import { Router, Request, Response } from 'express';
import { MakeUploadMiddleware } from '@/main/factories/middlewares/upload-middleware.make';
import { MakeUploadOrdersController } from '@/main/factories/controllers/upload-orders-controller.make';
import { MakeSearchOrdersController } from '@/main/factories/controllers/search-orders-controller.make';
import { UploadOrdersValidation } from '@/presentation/validations/upload-orders.validation';
import { SearchOrdersValidation } from '@/presentation/validations/search-orders.validation';
import { adaptExpressRoute } from '@/infra/adapters/http-express.adpter';

const ordersRouter = Router();
const uploadMiddleware = MakeUploadMiddleware.create().handle('file');
const uploadOrdersController = MakeUploadOrdersController.create();
const searchOrdersController = MakeSearchOrdersController.create();

const uploadOrdersAdapter = adaptExpressRoute(uploadOrdersController);
const searchOrdersAdapter = adaptExpressRoute(searchOrdersController);

ordersRouter.post(
  '/upload',
  uploadMiddleware,
  (req: Request, res: Response, next) => {
    UploadOrdersValidation.validate(req);
    return uploadOrdersAdapter(req, res);
  },
);

ordersRouter.get('/search', (req: Request, res: Response, next) => {
  SearchOrdersValidation.validate(req);
  return searchOrdersAdapter(req, res);
});

export { ordersRouter };
