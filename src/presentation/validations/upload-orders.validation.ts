import { Request } from 'express';

export class UploadOrdersValidation {
  static validate(req: Request): void {
    const file = req.file;
    if (!file) {
      const error = new Error('Nenhum arquivo foi enviado');
      (error as any).statusCode = 400;
      throw error;
    }
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'txt') {
      const error = new Error('Apenas arquivos TXT são permitidos');
      (error as any).statusCode = 400;
      throw error;
    }
  }
}
