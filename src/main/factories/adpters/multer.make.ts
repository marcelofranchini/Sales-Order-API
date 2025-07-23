import { MulterUploadAdapter } from '@/infra/adapters/multer-config.adpter';

export class MakeMulterAdapter {
  static create(): MulterUploadAdapter {
    const healthcheckUseCase = new MulterUploadAdapter();
    return healthcheckUseCase;
  }
}
