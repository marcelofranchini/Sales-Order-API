import { Request, Response, NextFunction } from 'express';
import { UploadAdapterInterface } from '@/data/interfaces/upload-adapter.interface';
import { UploadMiddlewareInterface } from '@/main/interfaces/upload-middleware.interface';

export class UploadMiddleware implements UploadMiddlewareInterface {
  constructor(private multerAdapter: UploadAdapterInterface) {}

  handle = (fieldName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const multerMiddleware = this.multerAdapter.single(fieldName);
      multerMiddleware(req, res, (err: unknown) => {
        if (err && typeof err === 'object' && 'message' in err) {
          return res
            .status(400)
            .json({ error: (err as { message: string }).message });
        }
        if (err) {
          return res.status(400).json({ error: 'Erro desconhecido' });
        }
        next();
      });
    };
  };
}
