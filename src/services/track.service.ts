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

const createTrack = async ({
  userId,
  title,
  url,
  urlId,
  imgUrl,
  author,
  source,
  duration,
}: Track) => {
  await checkExistingTrack(urlId, userId);

  const newTrack = {
    userId,
    title,
    url,
    urlId,
    imgUrl,
    author,
    source,
    duration,
  };

  return await prisma.track.create({
    data: newTrack,
  });
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
    where: { userId, urlId },
  });

  return checkExistingTrackSchema.parse(track?.id || '');
};

const getOembedTrackInfo = async (oembedUrl: string) => {
  return await axios
    .get<OembedTrack>(oembedUrl)
    .then((res) => {
      const { title, author_name, thumbnail_url, provider_name } = res.data;

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

const getSpotifyTrackInfo = async (url: string, accessToken: string) => {
  return await axios
    .get<SpotifyTrack>(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(async (res) => {
      const { name, artists, album, external_urls, id } = res.data;

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
