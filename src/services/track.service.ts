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

const createOembedTrack = async (
  url: string,
  urlId: string,
  userId: string,
) => {
  return await getOembedTrackInfo(url).then(
    // @ts-expect-error: "Must be object, but ts thinks that this is could be also string"
    async ({ title, imgUrl, author, source }) =>
      await prisma.track.create({
        data: {
          title,
          url,
          urlId,
          imgUrl,
          author,
          userId,
          source,
        },
      }),
  );
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

const createSpotifyTrack = async (
  url: string,
  accessToken: string,
  userId: string,
) => {
  return await getSpotifyTrackInfo(url, accessToken).then(
    // @ts-expect-error: "Must be object, but ts thinks that this is could be also string"
    async ({ title, url, urlId, imgUrl, author }) => {
      return await prisma.track.create({
        data: {
          title,
          url,
          urlId,
          imgUrl,
          author,
          userId,
          source: 'Spotify',
        },
      });
    },
  );
};

export const trackService = {
  getYoutubeId,
  checkExistingTrack,
  getOembedTrackInfo,
  createOembedTrack,
  getSoundCloudTrackId,
  getSpotifyTrackId,
  getSpotifyTrackInfo,
  createSpotifyTrack,
};
