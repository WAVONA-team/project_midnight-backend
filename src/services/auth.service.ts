import { v4 as uuidv4 } from 'uuid';
import { User } from 'project_midnight';
import prisma from '../client.js';

import { registerSchema } from '../zodSchemas/user/index.js';
import {
  userLoginSchema,
  resetUserSchema,
  resetVerifyUserSchema,
  resendUserSchema,
} from '../zodSchemas/auth/index.js';

import { emailService } from './email.service.js';
import { userService } from './user.service.js';

const register = async (email: string, password: string) => {
  const activationToken = uuidv4().slice(0, 6);

  registerSchema.parse((await userService.findByEmail(email)) || {});

  const createdUser: Omit<User, 'refreshToken'> = await prisma.user.create({
    data: {
      activationToken,

      email,
      password,

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

  return user as User;
};

const reset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  resetUserSchema.parse(user || {});

  const resetToken = uuidv4().slice(0, 6);

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { resetToken },
  });

  await emailService.sendResetEmail(email, resetToken);

  return userService.normalize(updatedUser);
};

const resetVerify = async (resetToken: string) => {
  const user = await prisma.user.findUnique({ where: { resetToken } });

  resetVerifyUserSchema.parse(user || {});

  return userService.normalize(user as User);
};

const resetActivate = async (resetToken: string, newPassword: string) => {
  const updatedUser = await prisma.user.update({
    where: { resetToken },
    data: {
      password: newPassword,
      resetToken: null,
    },
  });

  await emailService.sendSuccessResetEmail(updatedUser.email);

  return userService.normalize(updatedUser);
};

const login = async () => {};

const deleteUser = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  resetVerifyUserSchema.parse(user || {});

  await prisma.user.delete({ where: { email } });
};

const resend = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  resendUserSchema.parse(user || {});

  await emailService.sendActivationEmail(
    email,
    user?.activationToken as string,
  );

  return user?.activationToken;
};

const deleteResetToken = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  resendUserSchema.parse(user || {});

  await prisma.user.update({ where: { email }, data: { resetToken: null } });

  return user?.activationToken;
};

const resendResetToken = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  resendUserSchema.parse(user || {});

  await emailService.sendResetEmail(email, user?.resetToken as string);

  return user?.resetToken;
};

export const authService = {
  register,
  activate,
  login,
  reset,
  resetVerify,
  resetActivate,
  deleteUser,
  resend,
  deleteResetToken,
  resendResetToken,
};
