import { z } from 'zod';

export const authSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, {
      message: 'Email is required',
    })
    .email({
      message: 'Invalid email address',
    }),
  password: z
    .string()
    .trim()
    .min(1, {
      message: 'Password is required',
    })
    .min(6, {
      message: 'Password should be more than 6 characters',
    }),
});
