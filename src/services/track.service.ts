/* eslint-disable indent */
import axios from 'axios';
import prisma from '../client.js';
import {
  checkExistingTrackSchema,
  trackParsingError,
} from '../zodSchemas/track/index.js';
import { SpotifyTrack, OembedTrack } from '../types/track/index.js';

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

export const trackService = {
  getYoutubeId,
  checkExistingTrack,
  getOembedTrackInfo,
  getSoundCloudTrackId,
  getSpotifyTrackId,
  getSpotifyTrackInfo,
};
