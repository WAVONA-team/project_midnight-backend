import { Playlist } from 'project_midnight';
import prisma from '../client.js';

const getUserPlaylists = async (userId: string) => {
  const savedPlaylist = await prisma.playlist.findUnique({
    where: { userIdSavedTracks: userId },
    include: { tracks: true },
  });

  const favouritePlaylist = await prisma.playlist.findUnique({
    where: { userIdFavouriteTracks: userId },
    include: { tracks: true },
  });

  return { savedPlaylist, favouritePlaylist };
};

const getAll = async (
  userId: string,
  query: string,
  sortType: keyof Playlist,
  order: 'asc' | 'desc',
) => {
  return await prisma.playlist.findMany({
    where: {
      userIdCustomPlaylists: userId,
      name: { contains: query, mode: 'insensitive' },
    },
    orderBy: {
      [sortType]: order,
    },
    include: { tracks: true },
  });
};

const createNew = async (name: string, userId: string) => {
  return await prisma.playlist.create({
    data: { name, userIdCustomPlaylists: userId },
  });
};

export const playlistService = {
  getUserPlaylists,
  getAll,
  createNew,
};
