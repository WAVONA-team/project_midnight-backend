import { z } from 'zod';

export const resetSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, {
      message: 'Введите email',
    })
    .email({
      message: 'Неверный формат. Пример: example@domain.com',
    }),
});

export const resetUserSchema = z.object({
  id: z.string().trim().min(1, { message: 'Пользователь не найден' }),
});

export const resetVerifyUserSchema = z
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
  .refine(({ id }) => !!id, {
    message: 'Неверный код для сброса',
  });

export const resendUserSchema = z
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
  .refine(({ id }) => !!id, {
    message: 'Пользователь не найден',
  });

export const verifyResetTokenSchema = z.object({
  resetToken: z
    .string()
    .trim()
    .refine((data) => data.length, {
      message: 'Введите токен для сброса',
    })
    .refine((data) => data.length === 6, {
      message: 'Длина токена должна быть 6 символов',
    }),
});

export const setPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(1, {
        message: 'Введите новый пароль',
      })
      .min(6, {
        message: 'Новый пароль должен быть не менее 6-ти символов',
      }),
    confirmationPassword: z
      .string()
      .trim()
      .min(1, {
        message: 'Введите пароль для подтверждения',
      })
      .min(6, {
        message: 'Пароль для подтверждения должен быть не менее 6-ти символов',
      }),
    resetToken: z
      .string()
      .trim()
      .min(1, {
        message: 'Введите токен для сброса',
      })
      .min(6, {
        message: 'Токен для сброса должен быть не менее 6-ти символов',
      }),
  })
  .refine(
    ({ newPassword, confirmationPassword }) =>
      newPassword === confirmationPassword,
    {
      message: 'Пароли не совпадают',
      path: ['formErrors'],
    },
  );
