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
  yandexOAUTH,
  vkOAUTH,
  appleOAUTH,
  tracks,
  playlists,
});

const getAll = async () => {
  const users = await prisma.user.findMany({
    include: { tracks: true, playlists: true },
  });

  return users.map((user) => normalize(user));
};

const findByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
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

export const userService = {
  normalize,
  getAll,
  findByEmail,
  removeSpotify,
};
