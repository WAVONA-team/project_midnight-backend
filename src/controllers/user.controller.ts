import { type Request, type Response } from 'express';
import { userService } from '../services/user.service.js';
import { User } from 'project_midnight';

const getAll = async (_req: Request, res: Response) => {
  const users: Omit<User, 'refreshToken'>[] = await userService.getAll();

  res.send(users.map(userService.normalize));
};

export const userController = {
  getAll,
};
