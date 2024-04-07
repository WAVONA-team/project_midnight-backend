import { z } from 'zod';

export const getSearchHistorySchema = z.object({
  userId: z.string().min(1, {
    message: 'Введите id пользователя',
  })
});
