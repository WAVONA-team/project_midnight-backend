import { z } from 'zod';

export const createNewPlaylistSchema = z.object({
  name: z.string().trim().min(1, {
    message: 'Enter the playlist name',
  }),
  userId: z.string().trim().min(1, {
    message: 'Enter user id',
  }),
});
