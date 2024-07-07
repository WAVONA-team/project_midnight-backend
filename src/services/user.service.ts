import { User, NormalizedUser } from 'project_midnight';
import prisma from '../client.js';
import 'express-async-errors';
import { checkExistingUser } from '../zodSchemas/user/index.js';
import { type Track } from '@prisma/client';
import { playlistService } from 'src/services/playlist.service.js';

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
  sortType: keyof Track = 'createdAt',
  order: 'asc' | 'desc' = 'desc',
) => {
  const savedPlaylist = await prisma.playlist.findUnique({
    where: { userIdSavedTracks: userId },
    include: {
      tracks: {
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { author: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: {
          [sortType]: order,
        },
      },
    },
  });

  const favouritePlaylist = await prisma.playlist.findUnique({
    where: { userIdFavouriteTracks: userId },
    include: {
      tracks: {
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { author: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: {
          [sortType]: order,
        },
      },
    },
  });

  return {
    savedTracks: savedPlaylist?.tracks || [],
    favouriteTracks: favouritePlaylist?.tracks || [],
  };
};

export const userService = {
  normalize,
  findByEmail,
  getById,
  removeSpotify,
  getTracks,
};
