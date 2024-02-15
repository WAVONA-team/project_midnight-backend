import { z } from 'zod';

export const registerSchema = z
  .object({
    id: z.string().optional(),
    activationToken: z.string().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    spotifyOAUTH: z.string().optional().nullable(),
    yandexOAUTH: z.string().optional().nullable(),
    vkOAUTH: z.string().optional().nullable(),
  })
  .refine((data) => !data.id, {
    message: 'User already exist!',
  });
