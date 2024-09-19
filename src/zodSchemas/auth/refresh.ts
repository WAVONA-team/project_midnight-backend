import { z } from 'zod';

export const refreshSchema = z
  .object({
    userId: z.string().trim(),
    token: z.string().trim(),
  })
  .refine(({ token }) => !!token, {
    message: 'Unauthorized token',
  })
  .refine(({ userId }) => !!userId, {
    message: 'Unauthorized user',
  });
