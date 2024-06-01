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
import { type Track } from '@prisma/client';

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
    user?.searchHistory.sort((a, b) => +b.updatedAt - +a.updatedAt).slice(0, 5),
  );
};

const getTracks = async (req: Request, res: Response) => {
  const PAGE_SIZE = 10;

  getTrackSchemaQuery.parse(req.query);
  getTrackSchemaParams.parse(req.params);

  const { page, query, sortType } = req.query;
  const { userId } = req.params;

  const tracks = await userService.getTracks(
    userId,
    query as string,
    sortType as keyof Track,
  );

  const normalizedPage =
    +(page as unknown as number) <= 0 ? 1 : +(page as unknown as number);

  if (tracks.length <= PAGE_SIZE) {
    res.setHeader('x-total-count', tracks.length).send(tracks);

    return;
  }

  res
    .setHeader('x-total-count', tracks.length)
    .send(
      tracks.slice(
        (normalizedPage - 1) * PAGE_SIZE,
        normalizedPage * PAGE_SIZE,
      ),
    );
};

export const userController = {
  removeApp,
  getSearchHistory,
  getTracks,
};
