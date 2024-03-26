import { z } from 'zod';

export const checkExistingUser = z.string().min(1, {
  message: 'Пользователя с таким id не существует',
});
