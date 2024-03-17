import { z } from 'zod';

export const deleteSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, {
      message: 'Введите email',
    })
    .email({
      message: 'Пользователь не найден',
    }),
});
