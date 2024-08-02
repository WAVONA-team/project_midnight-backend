import express from 'express';
import { authMiddleware } from '../middlewares/index.js';
import { trackController } from '../controllers/track.controller.js';

export const trackRouter = express.Router();

trackRouter.post('/new', authMiddleware, trackController.create);
trackRouter.post('/get-info', authMiddleware, trackController.getInfo);
trackRouter.get(
  '/update-history-order/:trackId',
  authMiddleware,
  trackController.updateOrder,
);
trackRouter.delete(
  '/delete-from-saved/:userId/:trackId',
  authMiddleware,
  trackController.deleteFromSaved,
);
trackRouter.get(
  '/check-track/:userId/:trackId',
  authMiddleware,
  trackController.checkTrack,
);
trackRouter.post('/resolve', authMiddleware, trackController.resolve);
trackRouter.patch('/update-favourite', authMiddleware, trackController.updateFavourite);
