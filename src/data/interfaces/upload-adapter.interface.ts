import { RequestHandler } from 'express';

export interface UploadAdapterInterface {
  single(fieldName: string): RequestHandler;
}
