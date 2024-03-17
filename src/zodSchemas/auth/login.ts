import { z } from 'zod';
import bcrypt from 'bcrypt';

export const loginSchema = z
  .object({
    email: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine(
    async ({ password, confirmPassword }) =>
      await bcrypt.compare(confirmPassword, password),
    {
      message: 'Неправильный пароль!',
      path: ['password'],
    },
  );

export const userLoginSchema = z
  .object({
    id: z.string().optional(),
    activationToken: z.string().optional().nullable(),
    resetToken: z.string().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    spotifyOAUTH: z.string().optional().nullable(),
    yandexOAUTH: z.string().optional().nullable(),
    vkOAUTH: z.string().optional().nullable(),
    appleOAUTH: z.string().optional().nullable(),
  })
  .refine((data) => data.id, {
    message: 'Пользователь не найден или неправильный код активации',
  });
