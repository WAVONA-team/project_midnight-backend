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

const createTrack = async (url: string, userId: string) => {
  switch (true) {
    case url.includes('youtube') || url.includes('youtu.be'): {
      const urlId = getYoutubeId(url) || '';
      const track = await prisma.track.findUnique({
        where: { userId, urlId },
      });

      checkExistingTrackSchema.parse(track?.id || '');

      return axios
        .get<OembedTrack>(
          `https://www.youtube.com/oembed?url=${url}&format=json`,
        )
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
    }

    default: {
      return unsupportedTrackSchema.parse('');
    }
  }
};

export const trackService = {
  createTrack,
};
