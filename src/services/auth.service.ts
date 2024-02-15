import { v4 as uuidv4 } from 'uuid';
import { User } from 'project_midnight';
import prisma from '../client.js';

import { registerSchema } from '../zodSchemas/user/index.js';
import { userLoginSchema } from '../zodSchemas/auth/index.js';

import { emailService } from './email.service.js';
import { userService } from './user.service.js';

const register = async (email: string, password: string) => {
  const activationToken = uuidv4().slice(0, 6);

  registerSchema.parse((await userService.findByEmail(email)) || {});

  const createdUser: Omit<User, 'refreshToken'> = await prisma.user.create({
    data: {
      activationToken,

      email: email as string,
      password: password as string,

      spotifyOAUTH: null,
      yandexOAUTH: null,
      vkOAUTH: null,
    },
  });

  await emailService.sendActivationEmail(email, activationToken);

  return userService.normalize(createdUser);
};

const activate = async (activationToken: string) => {
  const user = await prisma.user.findUnique({ where: { activationToken } });

  userLoginSchema.parse(user || {});

  await prisma.user.update({
    where: { activationToken },
    data: { activationToken: null },
  });

  return user;
};

const login = async () => {};

export const authService = {
  register,
  activate,
  login,
};