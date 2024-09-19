import { z } from 'zod';

export const deleteSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, {
      message: 'Enter email',
    })
    .email({
      message: 'No users found',
    }),
});
