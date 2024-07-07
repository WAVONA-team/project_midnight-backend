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

  const {
    page,
    query,
    sortType,
    order,
    isFavourite: isFavouriteString,
  } = req.query;
  const { userId } = req.params;
  const isFavourite = isFavouriteString === 'true';

  const { savedTracks, favouriteTracks } = await userService.getTracks(
    userId,
    (query || '') as string,
    (sortType || 'createdAt') as keyof Track,
    (order || 'desc') as 'asc' | 'desc',
  );

  const normalizedPage =
    +(page as unknown as number) <= 0 ? 1 : +(page as unknown as number);

  if (
    isFavourite
      ? favouriteTracks.length <= PAGE_SIZE
      : savedTracks.length <= PAGE_SIZE
  ) {
    return res
      .setHeader(
        'x-total-count',
        isFavourite ? favouriteTracks.length : savedTracks.length,
      )
      .send(isFavourite ? favouriteTracks : savedTracks);
  }

  const prepairedFavouriteTracks = favouriteTracks.slice(
    (normalizedPage - 1) * PAGE_SIZE,
    normalizedPage * PAGE_SIZE,
  );

  const prepairedSavedTracks = savedTracks.slice(
    (normalizedPage - 1) * PAGE_SIZE,
    normalizedPage * PAGE_SIZE,
  );

  res
    .setHeader(
      'x-total-count',
      isFavourite ? favouriteTracks.length : savedTracks.length,
    )
    .send(isFavourite ? prepairedFavouriteTracks : prepairedSavedTracks);
};

export const userController = {
  removeApp,
  getSearchHistory,
  getTracks,
};
