import prisma from '../client.js';

const getUserPlaylists = async (userId: string) => {
  const savedPlaylist = await prisma.playlist.findUnique({
    where: { userIdSavedTracks: userId },
    include: { tracks: true },
  });

  const favouritePlaylist = await prisma.playlist.findUnique({
    where: { userIdFavouriteTracks: userId },
    include: { tracks: true },
  });

  return { savedPlaylist, favouritePlaylist };
};

export const playlistService = {
  getUserPlaylists,
};
