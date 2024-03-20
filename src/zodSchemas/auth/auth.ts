import { z } from 'zod';

export const authSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, {
      message: 'Введите email',
    })
    .email({
      message: 'Неверный формат. Пример: example@domain.com',
    }),
  password: z
    .string()
    .trim()
    .min(1, {
      message: 'Введите пароль',
    })
    .min(6, {
      message: 'Пароль должен быть не менее 6-ти символов',
    }),
});
