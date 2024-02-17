import { type NextFunction, type Request, type Response } from 'express';
import { ZodError } from 'zod';

export const zodMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(400).send({
      formErrors: err.flatten().formErrors[0] || '',
      fieldErrors: Object.entries(err.flatten().fieldErrors).map(
        ([key, value]) => ({
          name: key,
          message: value![0],
        }),
      ),
    });
  }

  if (err instanceof Error) {
    const error = err as Error & { statusCode?: number };

    return res.status(error.statusCode ?? 400).send({
      message: err.message,
    });
  }

  res.status(500).send({
    message: 'Internal server error',
  });
};
