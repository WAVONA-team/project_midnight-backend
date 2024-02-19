import { z } from 'zod';

export const activateSchema = z.object({
  activationToken: z
    .string({
      required_error: 'Activation token is required',
    })
    .trim(),
});
