import { Request, Response, NextFunction } from 'express';
import { UploadAdapterInterface } from '../../data/interfaces/upload-adapter.interface';
import { UploadMiddlewareInterface } from '../interfaces/upload-middleware.interface';

export class UploadMiddleware implements UploadMiddlewareInterface {
  constructor(private readonly uploadAdapter: UploadAdapterInterface) {}

  handle(fieldName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      this.uploadAdapter.single(fieldName)(req, res, next);
    };
  }
}
