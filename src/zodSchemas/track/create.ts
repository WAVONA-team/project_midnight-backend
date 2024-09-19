import { z } from 'zod';

export const createTrackSchema = z.object({
  userId: z.string().trim().min(1, {
    message: 'Please enter the user ID',
  }),
  title: z.string().trim().min(1, {
    message: 'Please enter the track title',
  }),
  url: z.string().trim().min(1, {
    message: 'Please enter the track URL',
  }),
  urlId: z.string().trim().min(1, {
    message: 'Please enter the URL ID',
  }),
  imgUrl: z.string().trim().min(1, {
    message: 'Please enter the image URL for the track',
  }),
  author: z.string().trim().min(1, {
    message: 'Please enter the track author',
  }),
  source: z.string().trim().min(1, {
    message: 'Please enter the track source',
  }),
  duration: z.string().trim().min(1, {
    message: 'Please enter the track duration',
  }),
});

export const getTrackInfoSchema = z.object({
  url: z.string().trim().min(1, {
    message: 'Please enter the track URL',
  }),
  duration: z.string().trim().min(1, {
    message: 'Please enter the track duration',
  }),
  userId: z.string().trim().min(1, {
    message: 'User is not authorized',
  }),
});

export const checkExistingTrackSchema = z.string().trim().max(0, {
  message: 'This track already exists',
});

export const trackParsingError = z.string().trim().min(1, {
  message: 'Incorrect format. Please check your input',
});

export const unsupportedTrackSchema = z.string().trim().min(1, {
  message: 'Unfortunately, this source is not supported at the moment',
});

export const unauthorizedSpotifySchema = z.string().trim().min(1, {
  message: 'Spotify authorization is required for this operation',
});
