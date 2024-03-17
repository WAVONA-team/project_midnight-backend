import { z } from 'zod';

export const deleteSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, {
      message: 'Email is required',
    })
    .email({
      message: 'User does not exist',
    }),
});
