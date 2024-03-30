import { z } from 'zod';

export const createTrackSchema = z.object({
  url: z.string().trim().min(1, {
    message: 'Введите ссылку на трек',
  }),
  userId: z.string().trim().min(1, {
    message: 'Пользователь не авторизован',
  }),
});

export const checkExistingTrackSchema = z.string().trim().max(0, {
  message: 'Такой трек уже существует',
});

export const trackParsingError = z.string().trim().min(1, {
  message: 'Некорректный формат. Проверьте правильность ввода',
});

export const unsupportedTrackSchema = z.string().trim().min(1, {
  message: 'К сожалению, на данный момент этот источник не поддерживается',
});

export const unauthorizedSpotifySchema = z.string().trim().min(1, {
  message: 'Для выполнения этой операции необходима авторизация в spotify',
});
