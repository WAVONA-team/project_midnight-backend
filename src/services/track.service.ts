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

const getYoutubeId = (url: string) => {
  const regex =
    /(?:youtube(?:-nocookie)?\.com\/(?:[^\\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  return url.match(regex)?.[1] || null;
};

const getSoundCloudTrackId = (url: string) => {
  const regex = /(?:soundcloud\.com\/\S+\/)([^/?]+)/;

  return url.match(regex)?.[1] || null;
};

const checkExistingTrack = async (urlId: string, userId: string) => {
  const track = await prisma.track.findUnique({
    where: { userId, urlId },
  });

  const error = checkExistingTrackSchema.parse(track?.id || '');

  return error;
};

const makeTrackRequest = async (url: string, urlId: string, userId: string) => {
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

const createTrack = async (url: string, userId: string) => {
  switch (true) {
    case url.includes('youtube') || url.includes('youtu.be'): {
      const urlId = getYoutubeId(url) || '';

      await checkExistingTrack(urlId, userId);

      return makeTrackRequest(
        `https://www.youtube.com/oembed?url=${url}&format=json`,
        urlId,
        userId,
      );
    }

    case url.includes('soundcloud'): {
      const urlId = getSoundCloudTrackId(url) || '';

      await checkExistingTrack(urlId, userId);

      return makeTrackRequest(
        `https://soundcloud.com/oembed?format=json&url=${url}`,
        urlId,
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
