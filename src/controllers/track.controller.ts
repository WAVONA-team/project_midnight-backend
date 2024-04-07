/* eslint-disable indent */
import { type Request, type Response } from 'express';
import { trackService } from '../services/track.service.js';
import {
  createTrackSchema,
  getTrackInfoSchema,
  unsupportedTrackSchema,
  unauthorizedSpotifySchema,
} from '../zodSchemas/track/index.js';
import { userService } from '../services/user.service.js';
import { musicServicesService } from '../services/musicServices.service.js';

const create = async (req: Request, res: Response) => {
  createTrackSchema.parse(req.body);

  res.send(await trackService.createTrack(req.body));
};

const getInfo = async (req: Request, res: Response) => {
  getTrackInfoSchema.parse(req.body);

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
      const urlId = trackService.getTrackId(url) || '';

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
