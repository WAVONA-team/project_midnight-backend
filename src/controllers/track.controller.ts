import { type Request, type Response } from 'express';
import { trackService } from '../services/track.service.js';
import { createTrackSchema } from '../zodSchemas/track/index.js';

const create = async (req: Request, res: Response) => {
  createTrackSchema.parse(req.body);

  const { url, userId } = req.body;

  res.send(await trackService.createTrack(url, userId));
};

export const trackController = {
  create,
};
