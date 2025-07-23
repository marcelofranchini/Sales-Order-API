import { Request } from 'express';

export class UploadOrdersValidation {
  static validate(req: Request): void {
    const file = req.file;
    if (!file) {
      throw new Error('Nenhum arquivo foi enviado');
    }
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'txt') {
      throw new Error('Apenas arquivos TXT são permitidos');
    }
  }
}
