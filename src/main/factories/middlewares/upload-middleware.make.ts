import { UploadMiddleware } from '../../middlewares/upload.middleware';
import { MakeMulterAdapter } from '../adpters/multer.make';

export class MakeUploadMiddleware {
  static create(): UploadMiddleware {
    return new UploadMiddleware(MakeMulterAdapter.create());
  }
}
