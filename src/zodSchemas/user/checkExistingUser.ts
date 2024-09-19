import { z } from 'zod';

export const checkExistingUser = z.string().min(1, {
  message: 'A user with this ID does not exist',
});
