import { z } from 'zod';

export const resetSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, {
      message: 'Enter email',
    })
    .email({
      message: 'Incorrect format. Example: example@domain.com',
    }),
});

export const resetUserSchema = z.object({
  id: z.string().trim().min(1, { message: 'User not found' }),
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
    message: 'Invalid reset code',
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
    message: 'User not found',
  });

export const verifyResetTokenSchema = z.object({
  resetToken: z
    .string()
    .trim()
    .refine((data) => data.length, {
      message: 'Enter reset token',
    })
    .refine((data) => data.length === 6, {
      message: 'Token length must be 6 characters',
    }),
});

export const setPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(1, {
        message: 'Enter new password',
      })
      .min(6, {
        message: 'The new password must be at least 6 characters long',
      }),
    confirmationPassword: z
      .string()
      .trim()
      .min(1, {
        message: 'Enter password to confirm',
      })
      .min(6, {
        message: 'The password for confirmation must be at least 6 characters long',
      }),
    resetToken: z
      .string()
      .trim()
      .min(1, {
        message: 'Enter reset token',
      })
      .min(6, {
        message: 'The reset token must be at least 6 characters long.',
      }),
  })
  .refine(
    ({ newPassword, confirmationPassword }) =>
      newPassword === confirmationPassword,
    {
      message: 'The passwords do not match',
      path: ['formErrors'],
    },
  );
