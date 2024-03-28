import axios from 'axios';
import prisma from '../client.js';

type SpotifyRefresh = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

const spotifyRefresh = async (refreshToken: string, userId: string) => {
  return axios
    .post<SpotifyRefresh>(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
        },
      },
    )
    .then(async (res) => {
      const { access_token } = res.data;

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          spotifyOAUTH: access_token,
        },
      });
    });
};

export const musicServicesService = {
  spotifyRefresh,
};
