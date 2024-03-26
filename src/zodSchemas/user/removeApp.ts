import { z } from 'zod';

export const removeAppSchema = z.object({
  provider: z.string().trim().min(1, {
    message: 'Введите сервис',
  }),
  userId: z.string().trim().min(1, {
    message: 'Введите id пользователя для удаления',
  }),
});
