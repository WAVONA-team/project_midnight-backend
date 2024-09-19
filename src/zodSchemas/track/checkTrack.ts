import { z } from 'zod';

export const checkTrackSchema = z.object({
  trackId: z.string().trim().min(1, {
    message: 'Please enter the track ID',
  }),
  userId: z.string().trim().min(1, {
    message: 'Please enter the user ID',
  }),
});
