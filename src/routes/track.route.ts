import express from 'express';
import { authMiddleware } from '../middlewares/index.js';
import { trackController } from '../controllers/track.controller.js';

export const trackRouter = express.Router();

trackRouter.post('/new', authMiddleware, trackController.create);
trackRouter.post('/get-info', trackController.getInfo);
