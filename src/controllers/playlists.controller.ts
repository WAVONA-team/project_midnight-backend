import { type Request, type Response } from 'express';
import { Playlist } from 'project_midnight';
import { playlistService } from '../services/playlist.service.js';
import {
  getTrackSchemaParams,
  getTrackSchemaQuery,
} from '../zodSchemas/user/index.js';
import { createNewPlaylistSchema } from '../zodSchemas/playlist/index.js';

const getAll = async (req: Request, res: Response) => {
  const PAGE_SIZE = 10;

  getTrackSchemaQuery.parse(req.query);
  getTrackSchemaParams.parse(req.params);

  const { page, query, sortType, order } = req.query;
  const { userId } = req.params;

  const customPlaylists = await playlistService.getAll(
    userId,
    (query || '') as string,
    (sortType || 'createdAt') as keyof Playlist,
    (order || 'desc') as 'asc' | 'desc',
  );

  const normalizedPage =
    +(page as unknown as number) <= 0 ? 1 : +(page as unknown as number);

  if (customPlaylists.length! <= PAGE_SIZE) {
    return res
      .setHeader('x-total-count', customPlaylists.length)
      .send(customPlaylists);
  }

  res
    .setHeader('x-total-count', customPlaylists.length)
    .send(
      customPlaylists.slice(
        (normalizedPage - 1) * PAGE_SIZE,
        normalizedPage * PAGE_SIZE,
      ),
    );
};

const createNewPlaylist = async (req: Request, res: Response) => {
  createNewPlaylistSchema.parse(req.body);

  const { name, userId } = req.body;
  const createdPlaylist = await playlistService.createNew(name, userId);

  res.send(createdPlaylist);
};

export const playlistsController = {
  getAll,
  createNewPlaylist,
};
