import { z } from 'zod';

export const activateSchema = z.object({
  activationToken: z
    .string({
      invalid_type_error: 'Activation token must be a string',
      required_error: 'Activation token is required',
    })
    .trim(),
});
