/* eslint-disable indent */
import axios from 'axios';
import { Track } from 'project_midnight';
import prisma from '../client.js';
import {
  checkExistingTrackSchema,
  trackParsingError,
  unsupportedTrackSchema,
} from '../zodSchemas/track/index.js';
import { SpotifyTrack, OembedTrack } from '../types/track/index.js';

type TrackToCreate = {
  userId: string;
  title: string;
  url: string;
  urlId: string;
  imgUrl: string;
  author: string;
  source: string;
  duration: string;
};

const createTrack = async ({
  userId,
  title,
  url,
  urlId,
  imgUrl,
  author,
  source,
  duration,
}: TrackToCreate) => {
  await checkExistingTrack(urlId, userId);

  const newTrack = await prisma.track.create({
    data: {
      userIdTracks: userId,
      userIdSearchHistory: userId,
      title,
      url,
      urlId,
      imgUrl,
      author,
      source,
      duration,
    },
  });

  return newTrack;
};

const getTrackId = (url: string) => {
  switch (true) {
    case url.includes('youtube') || url.includes('youtu.be'): {
      const regex =
        /(?:youtube(?:-nocookie)?\.com\/(?:[^\\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

      return url.match(regex)?.[1] || null;
    }

    case url.includes('soundcloud'): {
      const regex = /(?:soundcloud\.com\/\S+\/)([^/?]+)/;

      return url.match(regex)?.[1] || null;
    }

    case url.includes('spotify'): {
      const regex = /(?:spotify\.com\/track\/)([a-zA-Z0-9]+)/;

      return url.match(regex)?.[1] || null;
    }

    default: {
      return unsupportedTrackSchema.parse('');
    }
  }
};

const checkExistingTrack = async (urlId: string, userId: string) => {
  const track = await prisma.track.findUnique({
    where: { userIdTracks: userId, urlId },
  });

  return checkExistingTrackSchema.parse(track?.id || '');
};

const createSearchHistory = async (userId: string, newTrack: Track) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { searchHistory: true },
  });

  user?.searchHistory.unshift(newTrack);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      searchHistory: {
        set: user?.searchHistory,
      },
    },
  });
};

const getOembedTrackInfo = async (
  oembedUrl: string,
  url: string,
  userId: string,
) => {
  return await axios
    .get<OembedTrack>(oembedUrl)
    .then(async (res) => {
      const { title, author_name, thumbnail_url, provider_name } = res.data;

      const newTrack = await prisma.track.create({
        data: {
          userIdTracks: userId,
          userIdSearchHistory: userId,
          title,
          url: oembedUrl.split('&')[0].split('url=')[1],
          urlId: getTrackId(url) as string,
          imgUrl: thumbnail_url,
          author: author_name,
          source: provider_name,
          duration: '',
        },
      });

      await createSearchHistory(userId, newTrack);

      return {
        title,
        author: author_name,
        imgUrl: thumbnail_url,
        source: provider_name,
        url: oembedUrl.split('&')[0].split('url=')[1],
      };
    })
    .catch(() => trackParsingError.parse(''));
};

const getSpotifyTrackInfo = async (
  url: string,
  accessToken: string,
  userId: string,
) => {
  return await axios
    .get<SpotifyTrack>(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(async (res) => {
      const { name, artists, album, external_urls, id } = res.data;

      const newTrack = await prisma.track.create({
        data: {
          userIdTracks: userId,
          userIdSearchHistory: userId,
          title: name,
          url: external_urls.spotify,
          urlId: id,
          imgUrl: album.images[0].url,
          author: artists[0].name,
          source: 'Spotify',
          duration: '',
        },
      });

      await createSearchHistory(userId, newTrack);

      return {
        title: name,
        author: artists[0].name,
        imgUrl: album.images[0].url,
        source: 'Spotify',
        url: external_urls.spotify,
        urlId: id,
      };
    })
    .catch(() => trackParsingError.parse(''));
};

export const trackService = {
  createTrack,
  checkExistingTrack,
  getOembedTrackInfo,
  getSpotifyTrackInfo,
  getTrackId,
};
