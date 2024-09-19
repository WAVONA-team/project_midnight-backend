import { z } from 'zod';
import bcrypt from 'bcrypt';

export const loginSchema = z
  .object({
    email: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine(
    async ({ password, confirmPassword }) =>
      await bcrypt.compare(confirmPassword, password),
    {
      message: 'Incorrect password!',
      path: ['password'],
    },
  );

export const userLoginSchema = z.object({
  id: z.string().trim().min(1, {
    message: 'User not found or invalid activation code',
  }),
});
