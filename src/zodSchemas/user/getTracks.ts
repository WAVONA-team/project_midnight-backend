import { z } from 'zod';

export const getTrackSchemaQuery = z.object({
  page: z.string().trim().min(1, {
    message: 'Please enter the required page',
  }),
});

export const getTrackSchemaParams = z.object({
  userId: z.string().trim().min(1, {
    message: 'Please enter the user ID',
  }),
});
