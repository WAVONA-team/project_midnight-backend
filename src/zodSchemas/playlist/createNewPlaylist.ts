import { z } from 'zod';

export const createNewPlaylistSchema = z.object({
  name: z.string().trim().min(1, {
    message: 'Введите имя плейлиста',
  }),
  userId: z.string().trim().min(1, {
    message: 'Введите id пользователя',
  }),
});
