import { z } from 'zod';

export const authSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .trim()
    .email({
      message: 'Invalid email address',
    }),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .trim()
    .min(6, {
      message: 'Password should be more than 6 characters',
    }),
});
