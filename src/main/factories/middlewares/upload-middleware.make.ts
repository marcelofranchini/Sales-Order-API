import { UploadMiddleware } from '@/main/middlewares/upload.middleware';
import { MakeMulterAdapter } from '@/main/factories/adpters/multer.make';

export class MakeUploadMiddleware {
  static create(): UploadMiddleware {
    const multerAdapter = MakeMulterAdapter.create();
    return new UploadMiddleware(multerAdapter);
  }
}
