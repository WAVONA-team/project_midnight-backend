/* eslint-disable indent */
import { type Request, type Response } from 'express';
import { userService } from '../services/user.service.js';
import { User } from 'project_midnight';
import {
  removeAppSchema,
  incorrectAppSchema,
  getSearchHistorySchema,
  checkExistingUser,
  getTrackSchemaQuery,
  getTrackSchemaParams,
} from '../zodSchemas/user/index.js';

const removeApp = async (req: Request, res: Response) => {
  removeAppSchema.parse(req.body);

  const { provider, userId } = req.body;

  switch (provider) {
    case 'Spotify': {
      await userService.removeSpotify(userId);

      const user = await userService.getById(userId);

      return res.send(userService.normalize(user as User));
    }

    default: {
      return incorrectAppSchema.parse('');
    }
  }
};

const getSearchHistory = async (req: Request, res: Response) => {
  getSearchHistorySchema.parse(req.params);

  const { userId } = req.params;

  const user = await userService.getById(userId);

  if (!user) {
    checkExistingUser.parse('');
  }

  res.send(
    user?.searchHistory
      .sort((a, b) => +b.updatedAt - +a.updatedAt)
      .slice(0, 5),
  );
};

const getTracks = async (req: Request, res: Response) => {
  getTrackSchemaQuery.parse(req.query);
  getTrackSchemaParams.parse(req.params);

  const { page } = req.query;
  const { userId } = req.params;

  const tracks = await userService.getTracks(userId);

  const normalizedPage =
    +(page as unknown as number) <= 0 ? 1 : +(page as unknown as number);

  res
    .setHeader('x-total-count', tracks.length)
    .send(tracks.slice((normalizedPage - 1) * 10, normalizedPage * 10));
};

export const userController = {
  removeApp,
  getSearchHistory,
  getTracks,
};
