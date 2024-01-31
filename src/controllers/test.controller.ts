import { type Request, type Response } from 'express';
import * as testService from '../services/test.service.js';

export const get = (_req: Request, res: Response) => {
  const result = testService.getAll();

  result
    .then(test => res.send(test));
};
