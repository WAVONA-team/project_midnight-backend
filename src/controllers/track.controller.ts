/* eslint-disable indent */
import { type Request, type Response } from 'express';
import { trackService } from '../services/track.service.js';
import {
  createTrackSchema,
  getTrackInfoSchema,
  unsupportedTrackSchema,
  unauthorizedSpotifySchema,
  updateTrackOrderSchema,
  deleteFromSavedTrackSchema,
  checkTrackSchema,
} from '../zodSchemas/track/index.js';
import { userService } from '../services/user.service.js';
import { musicServicesService } from '../services/musicServices.service.js';

const create = async (req: Request, res: Response) => {
  createTrackSchema.parse(req.body);

  res.send(await trackService.createTrack(req.body));
};

const getInfo = async (req: Request, res: Response) => {
  getTrackInfoSchema.parse(req.body);

  const { url, userId, duration } = req.body;

  switch (true) {
    case url.includes('youtube') || url.includes('youtu.be'): {
      return res.send(
        await trackService.getOembedTrackInfo(
          `https://www.youtube.com/oembed?url=${url}&format=json`,
          userId,
          duration,
        ),
      );
    }

    case url.includes('soundcloud'): {
      return res.send(
        await trackService.getOembedTrackInfo(
          `https://soundcloud.com/oembed?url=${url}&format=json`,
          userId,
          duration,
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
          user?.id as string,
          url,
        ),
      );
    }

    default: {
      return unsupportedTrackSchema.parse('');
    }
  }
};

const updateOrder = async (req: Request, res: Response) => {
  updateTrackOrderSchema.parse(req.params);

  const { trackId } = req.params;

  res.send(await trackService.updateOrder(trackId));
};

const deleteFromSaved = async (req: Request, res: Response) => {
  deleteFromSavedTrackSchema.parse(req.params);

  const { trackId } = req.params;

  res.send(await trackService.deleteFromSaved(trackId));
};

const checkTrack = async (req: Request, res: Response) => {
  checkTrackSchema.parse(req.params);

  const { trackId, userId } = req.params;

  const track = await trackService.checkTrack(trackId, userId);

  res.send(track || 404);
};

export const trackController = {
  create,
  getInfo,
  updateOrder,
  deleteFromSaved,
  checkTrack,
};
