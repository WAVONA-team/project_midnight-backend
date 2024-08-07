/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
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

  const { savedPlaylist, favouritePlaylist } = await userService.getTracks(
    userId,
    (query || '') as string,
    (sortType || 'createdAt') as keyof Track,
    (order || 'desc') as 'asc' | 'desc',
  );

  const normalizedPage =
    +(page as unknown as number) <= 0 ? 1 : +(page as unknown as number);

  if (
    isFavourite
      ? favouritePlaylist?.tracks.length! <= PAGE_SIZE
      : savedPlaylist?.tracks.length! <= PAGE_SIZE
  ) {
    return res
      .setHeader(
        'x-total-count',
        isFavourite
          ? favouritePlaylist?.tracks.length!
          : savedPlaylist?.tracks.length!,
      )
      .send(isFavourite ? favouritePlaylist : savedPlaylist);
  }

  const prepairedFavouritePlaylist = {
    ...favouritePlaylist,
    tracks: favouritePlaylist?.tracks.slice(
      (normalizedPage - 1) * PAGE_SIZE,
      normalizedPage * PAGE_SIZE,
    ),
  };

  const prepairedSavedPlaylist = {
    ...savedPlaylist,
    tracks: savedPlaylist?.tracks.slice(
      (normalizedPage - 1) * PAGE_SIZE,
      normalizedPage * PAGE_SIZE,
    ),
  };

  res
    .setHeader(
      'x-total-count',
      isFavourite
        ? favouritePlaylist?.tracks.length!
        : savedPlaylist?.tracks.length!,
    )
    .send(isFavourite ? prepairedFavouritePlaylist : prepairedSavedPlaylist);
};

const removeSearchHistory = async (req: Request, res: Response) => {
  getSearchHistorySchema.parse(req.params);

  const { userId } = req.params;

  await userService.removeSearchHistory(userId);

  res.sendStatus(204);
};

export const userController = {
  removeApp,
  getSearchHistory,
  getTracks,
  removeSearchHistory,
};
