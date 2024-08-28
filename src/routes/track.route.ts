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
  '/check-favourite-track/:userId/:trackId',
  authMiddleware,
  trackController.checkFavouriteTrack,
);
trackRouter.get(
  '/check-saved-track/:userId/:trackId',
  authMiddleware,
  trackController.checkSavedTrack,
);
trackRouter.post('/resolve', authMiddleware, trackController.resolve);
trackRouter.patch('/update-favourite', authMiddleware, trackController.updateFavourite);
trackRouter.patch('/update-saved', authMiddleware, trackController.updateSaved);
