import { Request, Response } from 'express';
import { ControllerInterface } from '@/presentation/interfaces/controller.interface';
import { HttpRequest, HttpResponse } from '@/presentation/dto/http.dto';

export function adaptExpressRoute<TRequest extends HttpRequest = HttpRequest>(
  controller: ControllerInterface<TRequest>,
) {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const httpRequest = {
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers,
        file: req.file,
        files: req.files,
      } as unknown as TRequest;

      const httpResponse: HttpResponse = await controller.handle(httpRequest);

      const statusCode = Number(httpResponse.statusCode) || 200;
      res.status(statusCode).json(httpResponse.body);
    } catch (error) {
      console.error('Route adapter error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
