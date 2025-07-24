import { Router, Request, Response } from 'express';
import { MakeUploadMiddleware } from '../factories/middlewares/upload-middleware.make';
import { MakeUploadOrdersController } from '../factories/controllers/upload-orders-controller.make';
import { MakeSearchOrdersController } from '../factories/controllers/search-orders-controller.make';
import { UploadOrdersValidation } from '../../presentation/validations/upload-orders.validation';
import { SearchOrdersValidation } from '../../presentation/validations/search-orders.validation';
import { adaptExpressRoute } from '../../infra/adapters/http-express.adpter';

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
    try {
      UploadOrdersValidation.validate(req);
      return uploadOrdersAdapter(req, res);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro de validação',
      });
    }
  },
);

ordersRouter.get('/search', (req: Request, res: Response, next) => {
  try {
    SearchOrdersValidation.validate(req);
    return searchOrdersAdapter(req, res);
  } catch (error) {
    console.error('Search route error:', error);
    return res.status(400).json({
      message: error instanceof Error ? error.message : 'Erro de validação',
    });
  }
});

export { ordersRouter };
