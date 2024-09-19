import { z } from 'zod';

export const removeAppSchema = z.object({
  provider: z.string().trim().min(1, {
    message: 'Please enter the service',
  }),
  userId: z.string().trim().min(1, {
    message: 'Please enter the user ID for removal',
  }),
});
