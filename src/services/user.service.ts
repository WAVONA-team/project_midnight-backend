import { User } from 'project_midnight';
import prisma from '../client.js';
import 'express-async-errors';


const normalize = ({
  id,
  email,
  createdAt,
  updatedAt,
}: Omit<User, 'refreshToken'>) => ({
  id,
  email,
  createdAt,
  updatedAt,
});

const getAll = async () => {
  return await prisma.user.findMany();
};

const findByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const userService = {
  normalize,
  getAll,
  findByEmail,
};
