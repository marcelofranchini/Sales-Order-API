import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof Error) {
    const statusCode = (err as any).statusCode || 500;
    const errorMessage = err.message || 'An unexpected error occurred';

    if (statusCode === 400) {
      return res
        .status(400)
        .json({ error: 'Bad Request', message: errorMessage });
    } else if (statusCode === 404) {
      return res
        .status(404)
        .json({ error: 'Not Found', message: errorMessage });
    } else if (statusCode === 403) {
      return res
        .status(403)
        .json({ error: 'Forbidden', message: errorMessage });
    } else {
      return res
        .status(500)
        .json({ error: 'Internal server error', message: errorMessage });
    }
  }

  return res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred',
  });
}
