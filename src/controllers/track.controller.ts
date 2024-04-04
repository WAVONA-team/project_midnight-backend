/* eslint-disable indent */
import { type Request, type Response } from 'express';
import { trackService } from '../services/track.service.js';
import {
  createTrackSchema,
  unsupportedTrackSchema,
  unauthorizedSpotifySchema,
} from '../zodSchemas/track/index.js';
import { userService } from '../services/user.service.js';
import { musicServicesService } from '../services/musicServices.service.js';

const create = async (req: Request, res: Response) => {
  createTrackSchema.parse(req.body);

  const { url, userId } = req.body;

  switch (true) {
    case url.includes('youtube') || url.includes('youtu.be'): {
      const urlId = trackService.getYoutubeId(url) || '';

      await trackService.checkExistingTrack(urlId, userId);

      return res.send(
        await trackService.createOembedTrack(
          `https://www.youtube.com/oembed?url=${url}&format=json`,
          urlId,
          userId,
        ),
      );
    }

    case url.includes('soundcloud'): {
      const urlId = trackService.getSoundCloudTrackId(url) || '';

      await trackService.checkExistingTrack(urlId, userId);

      return res.send(
        await trackService.createOembedTrack(
          `https://soundcloud.com/oembed?url=${url}&format=json`,
          urlId,
          userId,
        ),
      );
    }

    case url.includes('spotify'): {
      const urlId = trackService.getSpotifyTrackId(url) || '';

      await trackService.checkExistingTrack(urlId, userId);

      const user = await userService.getById(userId);

      await musicServicesService
        .spotifyRefresh(user?.spotifyRefresh as string, userId)
        .catch(() => unauthorizedSpotifySchema.parse(''));

      return res.send(
        await trackService.createSpotifyTrack(
          `https://api.spotify.com/v1/tracks/${urlId}`,
          user?.spotifyOAUTH as string,
          userId,
        ),
      );
    }

    default: {
      return unsupportedTrackSchema.parse('');
    }
  }
};

const getInfo = async (req: Request, res: Response) => {
  createTrackSchema.parse(req.body);

  const { url, userId } = req.body;

  switch (true) {
    case url.includes('youtube') || url.includes('youtu.be'): {
      return res.send(
        await trackService.getOembedTrackInfo(
          `https://www.youtube.com/oembed?url=${url}&format=json`,
        ),
      );
    }

    case url.includes('soundcloud'): {
      return res.send(
        await trackService.getOembedTrackInfo(
          `https://soundcloud.com/oembed?url=${url}&format=json`,
        ),
      );
    }

    case url.includes('spotify'): {
      const urlId = trackService.getSpotifyTrackId(url) || '';

      const user = await userService.getById(userId);

      await musicServicesService
        .spotifyRefresh(user?.spotifyRefresh as string, user?.id as string)
        .catch(() => unauthorizedSpotifySchema.parse(''));

      return res.send(
        await trackService.getSpotifyTrackInfo(
          `https://api.spotify.com/v1/tracks/${urlId}`,
          user?.spotifyOAUTH as string,
        ),
      );
    }

    default: {
      return unsupportedTrackSchema.parse('');
    }
  }
};

export const trackController = {
  create,
  getInfo,
};
