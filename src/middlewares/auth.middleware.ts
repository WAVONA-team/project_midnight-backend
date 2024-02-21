import { type Request, type Response, type NextFunction } from 'express';
import { jwtService } from '../services/jwt.service.js';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers['authorization'] || '';
  const [, token] = authorization.split(' ');

  if (!authorization || !token) {
    return res.sendStatus(401);
  }

  const userData = jwtService.verify(token);

  if (!userData) {
    return res.sendStatus(401);
  }

  next();
};
