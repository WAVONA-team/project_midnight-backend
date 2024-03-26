import { z } from 'zod';

export const incorrectAppSchema = z.string().min(1, {
  message: 'Неккоректный тип приложения',
});
