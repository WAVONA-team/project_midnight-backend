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

const generateVerifyCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const normalizeEmail = (email: string) => email.toLowerCase();

const register = async (email: string, password: string) => {
  const activationToken = generateVerifyCode();

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

  await prisma.playlist.createMany({
    data: [
      { name: 'Сохраненные треки', userIdSavedTracks: user?.id },
      { name: 'Избранные треки', userIdFavouriteTracks: user?.id },
    ],
  });

  await prisma.user.update({
    where: { activationToken },
    data: { activationToken: null },
  });

  return user as User;
};

const reset = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
  });

  resetUserSchema.parse({ id: user?.id || '' });

  const resetToken = generateVerifyCode();
  const updatedUser = await prisma.user.update({
    where: { email: normalizeEmail(email) },
    data: { resetToken },
  });

  await emailService.sendResetEmail(normalizeEmail(email), resetToken);

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

const deleteUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
  });

  resetVerifyUserSchema.parse(user || {});

  await prisma.playlist.deleteMany({
    where: {
      OR: [
        { userIdFavouriteTracks: user?.id },
        { userIdSavedTracks: user?.id },
      ],
    },
  });

  await prisma.user.delete({ where: { email: normalizeEmail(email) } });
};

const resend = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
  });

  resendUserSchema.parse(user || {});

  await emailService.sendActivationEmail(
    normalizeEmail(email),
    user?.activationToken as string,
  );

  return user?.activationToken;
};

const deleteResetToken = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
  });

  resendUserSchema.parse(user || {});

  await prisma.user.update({
    where: { email: normalizeEmail(email) },
    data: { resetToken: null },
  });

  return user?.activationToken;
};

const resendResetToken = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
  });

  resendUserSchema.parse(user || {});

  await emailService.sendResetEmail(
    normalizeEmail(email),
    user?.resetToken as string,
  );

  return user?.resetToken;
};

export const authService = {
  register,
  activate,
  reset,
  resetVerify,
  resetActivate,
  deleteUser,
  resend,
  deleteResetToken,
  resendResetToken,
};
