/* eslint-disable indent */
import { type Request, type Response } from 'express';
import { userService } from '../services/user.service.js';
import { NormalizedUser } from 'project_midnight';
import {
  removeAppSchema,
  incorrectAppSchema,
} from '../zodSchemas/user/index.js';

const getAll = async (_req: Request, res: Response) => {
  const users: NormalizedUser[] = await userService.getAll();

  res.send(users);
};

const removeApp = async (req: Request, res: Response) => {
  removeAppSchema.parse(req.body);

  const { provider, userId } = req.body;

  switch (provider) {
    case 'Spotify': {
      await userService.removeSpotify(userId);

      return res.send(200);
    }

    default: {
      return incorrectAppSchema.parse('');
    }
  }
};

export const userController = {
  getAll,
  removeApp,
};
