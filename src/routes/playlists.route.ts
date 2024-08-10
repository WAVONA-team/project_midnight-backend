import express from 'express';
import { authMiddleware } from '../middlewares/index.js';
import { playlistsController } from '../controllers/playlists.controller.js';

export const playlistsRouter = express.Router();

playlistsRouter.get('/:userId', authMiddleware, playlistsController.getAll);
playlistsRouter.post('/new', authMiddleware, playlistsController.createNewPlaylist);
