import { User, NormalizedUser } from 'project_midnight';
import prisma from '../client.js';
import 'express-async-errors';
import { checkExistingUser } from '../zodSchemas/user/index.js';

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

const getTracks = async (userId: string, query: string) => {
  return await prisma.track.findMany({
    where: {
      userIdTracks: userId,
      OR: [
        {
          title: { contains: query, mode: 'insensitive' },
        },
        {
          author: { contains: query, mode: 'insensitive' },
        },
      ],
    },
    orderBy: {
      updatedAt: 'asc',
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
