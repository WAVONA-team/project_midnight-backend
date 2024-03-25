/* eslint-disable indent */
import axios from 'axios';
import prisma from '../client.js';
import {
  checkExistingTrackSchema,
  trackParsingError,
  unsupportedTrackSchema,
} from '../zodSchemas/track/index.js';

type OembedTrack = {
  title: string;
  author_name: string;
  thumbnail_url: string;
  provider_name: string;
};

type SpotifyTrack = {
  name: string;
  artists: SpotifyArtists[];
  album: ThumbnailUrl;
  id: string;
  external_urls: Record<'spotify', string>;
};

type SpotifyArtists = {
  name: string;
};

type ThumbnailUrl = {
  images: Record<'url', string>[];
};

type SpotifyRefresh = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

const getYoutubeId = (url: string) => {
  const regex =
    /(?:youtube(?:-nocookie)?\.com\/(?:[^\\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  return url.match(regex)?.[1] || null;
};

const getSoundCloudTrackId = (url: string) => {
  const regex = /(?:soundcloud\.com\/\S+\/)([^/?]+)/;

  return url.match(regex)?.[1] || null;
};

const getSpotifyTrackId = (url: string) => {
  const regex = /(?:spotify\.com\/track\/)([a-zA-Z0-9]+)/;

  return url.match(regex)?.[1] || null;
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

const checkExistingTrack = async (urlId: string, userId: string) => {
  const track = await prisma.track.findUnique({
    where: { userId, urlId },
  });

  const error = checkExistingTrackSchema.parse(track?.id || '');

  return error;
};

const getOembedTrackInfo = async (
  url: string,
  urlId: string,
  userId: string,
) => {
  return axios
    .get<OembedTrack>(url)
    .then(async (res) => {
      const { title, author_name, thumbnail_url, provider_name } = res.data;

      return await prisma.track.create({
        data: {
          title,
          url,
          urlId,
          imgUrl: thumbnail_url,
          author: author_name,
          userId,
          source: provider_name,
        },
      });
    })
    .catch(() => trackParsingError.parse(''));
};

const getSpotifyTrackInfo = async (
  url: string,
  accessToken: string,
  userId: string,
) => {
  console.log(url);

  return axios
    .get<SpotifyTrack>(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(async (res) => {
      const { name, artists, album, id, external_urls } = res.data;

      return await prisma.track.create({
        data: {
          title: name,
          url: external_urls.spotify,
          urlId: id,
          imgUrl: album.images[0].url,
          author: artists[0].name,
          userId,
          source: 'Spotify',
        },
      });
    })
    .catch(() => trackParsingError.parse(''));
};

const createTrack = async (url: string, userId: string) => {
  switch (true) {
    case url.includes('youtube') || url.includes('youtu.be'): {
      const urlId = getYoutubeId(url) || '';

      await checkExistingTrack(urlId, userId);

      return getOembedTrackInfo(
        `https://www.youtube.com/oembed?url=${url}&format=json`,
        urlId,
        userId,
      );
    }

    case url.includes('soundcloud'): {
      const urlId = getSoundCloudTrackId(url) || '';

      await checkExistingTrack(urlId, userId);

      return getOembedTrackInfo(
        `https://soundcloud.com/oembed?format=json&url=${url}`,
        urlId,
        userId,
      );
    }

    case url.includes('spotify'): {
      const urlId = getSpotifyTrackId(url) || '';

      await checkExistingTrack(urlId, userId);

      const user = await prisma.user.findUnique({ where: { id: userId } });

      await spotifyRefresh(user?.spotifyRefresh as string, userId);

      return getSpotifyTrackInfo(
        `https://api.spotify.com/v1/tracks/${urlId}`,
        user?.spotifyOAUTH as string,
        userId,
      );
    }

    default: {
      return unsupportedTrackSchema.parse('');
    }
  }
};

export const trackService = {
  createTrack,
};
