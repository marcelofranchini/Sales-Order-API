import { Request, Response } from 'express';
import { ControllerInterface } from '@/presentation/interfaces/controller.interface';
import { HttpRequest } from '@/presentation/dto/http.dto';

type ValidationFn = (req: Request) => void;

export function adaptExpressRoute(
  controller: ControllerInterface,
  validate?: ValidationFn,
) {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      if (validate) {
        validate(req);
      }

      const httpRequest: HttpRequest = {
        body: req.body,
        params: req.params,
        query: req.query as Record<string, unknown>,
        headers: req.headers as Record<string, string>,
        file: req.file,
        files: req.files as Express.Multer.File[],
        statusCode: res.status,
      };

      const httpResponse = await controller.handle(httpRequest);
      res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (error: any) {
      console.error('Route adapter error:', error);

      const status = error?.statusCode ?? 500;
      const message = error?.message ?? 'Internal server error';

      res.status(status).json({ error: message });
    }
  };
}
