import { type Request, type Response } from 'express';
import { userService } from '../services/user.service.js';
import { NormalizedUser } from 'project_midnight';

const getAll = async (_req: Request, res: Response) => {
  const users: NormalizedUser[] = await userService.getAll();

  res.send(users);
};

export const userController = {
  getAll,
};
