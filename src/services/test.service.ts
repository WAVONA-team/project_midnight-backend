import prisma from '../client.js';

export const getAll = async () => {
  return await prisma.test.findMany();
};
