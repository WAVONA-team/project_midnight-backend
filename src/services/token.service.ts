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
      refreshToken: newToken,
    },
  });
};

const getByToken = async (refreshToken: string) => {
  return prisma.token.findUnique({ where: { refreshToken } });
};

export const tokenService = {
  save,
  getByToken,
};
