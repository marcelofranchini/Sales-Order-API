import { Request, Response, NextFunction } from 'express';

export interface UploadMiddlewareInterface {
  handle(
    fieldName: string,
  ): (req: Request, res: Response, next: NextFunction) => void;
}
