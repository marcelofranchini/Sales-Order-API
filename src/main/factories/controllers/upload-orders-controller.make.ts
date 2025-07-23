import { UploadOrdersController } from '@/presentation/controllers/upload-orders.controller';
import { MakeUploadOrdersUseCase } from '@/main/factories/useCases/upload-orders-use-case.make';

export class MakeUploadOrdersController {
  static create(): UploadOrdersController {
    return new UploadOrdersController(MakeUploadOrdersUseCase.create());
  }
}
