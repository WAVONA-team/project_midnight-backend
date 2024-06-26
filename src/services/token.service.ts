import prisma from '../client.js';

const save = async (userId: string, newToken: string) => {
  const token = await prisma.token.findUnique({ where: { userId } });

  if (!token) {
    return await prisma.token.create({
      data: {
        userId,
        refreshToken: newToken,
      },
    });
  }

  await prisma.token.update({
    where: {
      userId,
    },
    data: {
      refreshToken: {
        set: newToken,
      },
    },
  });
};

const getByToken = async (refreshToken: string) => {
  return await prisma.token.findUnique({ where: { refreshToken } });
};

const remove = async (userId: string) => {
  return await prisma.token.delete({ where: { userId } });
};

export const tokenService = {
  save,
  getByToken,
  remove,
};
