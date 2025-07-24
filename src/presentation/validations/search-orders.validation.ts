import { Request } from 'express';

export class SearchOrdersValidation {
  static validate(req: Request): void {
    const allowedParams = [
      'order_id',
      'user_id',
      'start',
      'end',
      'page',
      'all',
    ];
    const queryKeys = Object.keys(req.query);
    const invalidParams = queryKeys.filter((k) => !allowedParams.includes(k));
    if (invalidParams.length > 0) {
      const error = new Error(
        `Parâmetro(s) não permitido(s): ${invalidParams.join(', ')}`,
      );
      (error as any).statusCode = 400;
      throw error;
    }
    if (req.query.order_id && !/^[0-9]+$/.test(String(req.query.order_id))) {
      const error = new Error('order_id deve ser um número inteiro');
      (error as any).statusCode = 400;
      throw error;
    }
    if (req.query.user_id && !/^[0-9]+$/.test(String(req.query.user_id))) {
      const error = new Error('user_id deve ser um número inteiro');
      (error as any).statusCode = 400;
      throw error;
    }
    if (req.query.start && String(req.query.start).length !== 10) {
      const error = new Error('Data inicial deve estar no formato YYYY-MM-DD');
      (error as any).statusCode = 400;
      throw error;
    }
    if (req.query.end && String(req.query.end).length !== 10) {
      const error = new Error('Data final deve estar no formato YYYY-MM-DD');
      (error as any).statusCode = 400;
      throw error;
    }
  }
}
