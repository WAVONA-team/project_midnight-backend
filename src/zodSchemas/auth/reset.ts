import { z } from 'zod';

export const resetSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, {
      message: 'Email is required',
    })
    .email({
      message: 'Invalid email address',
    }),
});

export const resetUserSchema = z
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
    message: 'User does not exists!',
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
    message: 'Wrong reset code!',
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
    message: 'User does not exist!',
  });

export const verifyResetTokenSchema = z.object({
  resetToken: z
    .string()
    .trim()
    .refine((data) => data.length, {
      message: 'Reset token is required',
    })
    .refine((data) => data.length === 6, {
      message: 'Reset token must be 6 characters',
    }),
});

export const setPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(1, {
        message: 'New password is required',
      })
      .min(6, {
        message: 'New password should be more than 6 characters',
      }),
    confirmationPassword: z
      .string()
      .trim()
      .min(1, {
        message: 'Confirmation password is required',
      })
      .min(6, {
        message: 'Confirmation password should be more than 6 characters',
      }),
    resetToken: z
      .string()
      .trim()
      .min(1, {
        message: 'Reset token is required',
      })
      .min(6, {
        message: 'Reset token should be 6 characters length',
      }),
  })
  .refine(
    ({ newPassword, confirmationPassword }) =>
      newPassword === confirmationPassword,
    {
      message: 'Passwords did not match!',
      path: ['formErrors'],
    },
  );
