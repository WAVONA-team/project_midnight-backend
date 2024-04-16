import { z } from 'zod';

export const getTrackSchemaQuery = z.object({
  page: z.string().trim().min(1, {
    message: 'Введите необходимую страницу',
  }),
});

export const getTrackSchemaParams = z.object({
  userId: z.string().trim().min(1, {
    message: 'Введите id пользователя',
  }),
});
