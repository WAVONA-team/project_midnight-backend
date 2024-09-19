import { z } from 'zod';

export const updateTrackOrderSchema = z.object({
  trackId: z.string().trim().min(1, {
    message: 'Please enter the track ID',
  }),
});
