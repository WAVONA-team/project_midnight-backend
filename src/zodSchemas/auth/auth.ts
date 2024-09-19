import { z } from 'zod';

export const authSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, {
      message: 'Enter email',
    })
    .email({
      message: 'Incorrect format. Example: example@domain.com',
    }),
  password: z
    .string()
    .trim()
    .min(1, {
      message: 'Enter password',
    })
    .min(6, {
      message: 'The password must be at least 6 characters long',
    }),
});
