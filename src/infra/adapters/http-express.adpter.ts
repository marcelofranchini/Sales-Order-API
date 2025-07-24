import { Request, Response } from 'express';
import { ControllerInterface } from '../../presentation/interfaces/controller.interface';
import { HttpRequest, HttpResponse } from '../../presentation/dto/http.dto';

export function adaptExpressRoute(controller: ControllerInterface) {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const httpRequest: HttpRequest = {
        body: req.body,
        params: req.params,
        query: req.query as Record<string, unknown>,
        headers: req.headers as Record<string, string>,
        file: req.file,
        files: req.files as Express.Multer.File[],
        statusCode: res.status,
      };

      const httpResponse: HttpResponse = await controller.handle(httpRequest);

      res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (error) {
      console.error('Route adapter error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
