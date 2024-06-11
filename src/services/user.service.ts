import { User, NormalizedUser } from 'project_midnight';
import prisma from '../client.js';
import 'express-async-errors';
import { checkExistingUser } from '../zodSchemas/user/index.js';
import { type Track } from '@prisma/client';

const normalize = ({
  id,
  email,
  createdAt,
  updatedAt,
  spotifyOAUTH,
  spotifyRefresh,
  yandexOAUTH,
  vkOAUTH,
  appleOAUTH,
  tracks,
  playlists,
}: User): NormalizedUser => ({
  id,
  email,
  createdAt,
  updatedAt,
  spotifyOAUTH,
  spotifyRefresh,
  yandexOAUTH,
  vkOAUTH,
  appleOAUTH,
  tracks,
  playlists,
});

const findByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const getById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      tracks: true,
      playlists: true,
      searchHistory: true,
    },
  });
};

const removeSpotify = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  checkExistingUser.parse(user?.id || '');

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      spotifyOAUTH: null,
      spotifyRefresh: null,
    },
  });
};

const getTracks = async (
  userId: string,
  query: string = '',
  sortType: keyof Track = 'updatedAt',
  order: 'asc' | 'desc' = 'desc',
  isFavourite: string = 'false',
) => {
  return await prisma.track.findMany({
    where: {
      userIdTracks: userId,
      AND: [
        {
          OR: [
            {
              title: { contains: query, mode: 'insensitive' },
            },
            {
              author: { contains: query, mode: 'insensitive' },
            },
          ],
        },
        ...(isFavourite === 'true' ? [{ isFavourite: true }] : []),
      ],
    },
    orderBy: {
      [sortType]: order,
    },
  });
};

export const userService = {
  normalize,
  findByEmail,
  getById,
  removeSpotify,
  getTracks,
};
