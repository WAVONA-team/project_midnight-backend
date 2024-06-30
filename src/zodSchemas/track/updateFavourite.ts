import { z } from 'zod';

export const updateFavouriteTrackSchema = z.object({
  trackId: z.string().trim().min(1, {
    message: 'Введите id трека',
  }),
  userId: z.string().trim().min(1, {
    message: 'Введите id пользователя',
  }),
});
