import { UploadOrdersController } from '../../../presentation/controllers/upload-orders.controller';
import { MakeUploadOrdersUseCase } from '../useCases/upload-orders-use-case.make';

export class MakeUploadOrdersController {
  static create(): UploadOrdersController {
    return new UploadOrdersController(MakeUploadOrdersUseCase.create());
  }
}
