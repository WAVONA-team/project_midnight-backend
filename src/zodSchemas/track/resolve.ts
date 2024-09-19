import { z } from 'zod';

export const resolveTrackSchema = z.object({
  url: z.string().trim().min(1, {
    message: 'Please enter the track URL',
  }),
});
