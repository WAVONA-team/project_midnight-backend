import { z } from 'zod';

export const activateSchema = z.object({
  activationToken: z
    .string()
    .trim()
    .refine(data => data.length, {
      message: 'Enter activation code',
    }),
});
