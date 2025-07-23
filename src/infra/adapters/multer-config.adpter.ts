import multer, { Multer } from 'multer';
import { RequestHandler } from 'express';
import { UploadAdapterInterface } from '../../data/interfaces/upload-adapter.interface';

export class MulterUploadAdapter implements UploadAdapterInterface {
  private readonly multerInstance: Multer;

  constructor() {
    this.multerInstance = multer({ storage: multer.memoryStorage() });
  }

  single(fieldName: string): RequestHandler {
    return this.multerInstance.single(fieldName);
  }
}
