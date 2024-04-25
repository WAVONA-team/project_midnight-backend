import { z } from 'zod';

export const deleteFromSavedTrackSchema = z.object({
  trackId: z.string().trim().min(1, {
    message: 'Введите id трека',
  }),
});
