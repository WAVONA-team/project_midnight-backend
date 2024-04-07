import { z } from 'zod';

export const createTrackSchema = z.object({
  userId: z.string().trim().min(1, {
    message: 'Введите id пользователя',
  }),
  title: z.string().trim().min(1, {
    message: 'Введите название трека',
  }),
  url: z.string().trim().min(1, {
    message: 'Введите ссылку на трек',
  }),
  urlId: z.string().trim().min(1, {
    message: 'Введите id ссылки',
  }),
  imgUrl: z.string().trim().min(1, {
    message: 'Введите ссылку на изображение трека',
  }),
  author: z.string().trim().min(1, {
    message: 'Введите автора трека',
  }),
  source: z.string().trim().min(1, {
    message: 'Введите источник трека',
  }),
  duration: z.string().trim().min(1, {
    message: 'Введите продолжительность трека',
  }),
});

export const getTrackInfoSchema = z.object({
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
