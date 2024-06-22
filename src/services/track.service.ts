/* eslint-disable indent */
import axios from 'axios';
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

type ParsedTrack = {
  title: string;
  author_name: string;
  imgUrl: string;
  source: string;
  url: string;
  duration: string;
};

const normalizeTitle = (title: string) => title.normalize('NFKC');

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
  await checkExistingTrack(urlId, imgUrl);

  return await prisma.track.create({
    data: {
      userIdTracks: userId,
      userIdSearchHistory: null,
      title: normalizeTitle(title),
      url,
      urlId,
      imgUrl,
      author,
      source,
      duration,
    },
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
  const track = await prisma.track.findFirst({
    where: { userIdTracks: userId, urlId },
  });

  return checkExistingTrackSchema.parse(track?.id || '');
};

const createSearchHistory = async (
  userId: string,
  parsedTrack: ParsedTrack,
) => {
  const { title, url, imgUrl, author_name, source, duration } = parsedTrack;

  const track = await prisma.track.findFirst({
    where: {
      userIdSearchHistory: userId,
      urlId: getTrackId(url) as string,
    },
  });

  if (track) {
    await prisma.track.update({
      where: { id: track.id },
      data: { updatedAt: new Date() },
    });

    return track;
  }

  return await prisma.track.create({
    data: {
      userIdTracks: null,
      userIdSearchHistory: userId,
      title: normalizeTitle(title),
      url,
      urlId: getTrackId(url) as string,
      imgUrl,
      author: author_name,
      source,
      duration,
    },
  });
};

const formatSpotifyTime = (milliseconds: number) => {
  const totalSeconds = milliseconds / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  let formattedTime = '';

  if (hours > 0) {
    formattedTime += hours.toString().padStart(2, '0') + ':';
  }

  formattedTime +=
    minutes.toString().padStart(2, '0') +
    ':' +
    seconds.toString().padStart(2, '0');

  return formattedTime;
};

const getOembedTrackInfo = async (
  oembedUrl: string,
  userId: string,
  duration: string,
) => {
  return await axios
    .get<OembedTrack>(oembedUrl)
    .then(async (res) => {
      const { title, author_name, thumbnail_url, provider_name } = res.data;

      return await createSearchHistory(userId, {
        title,
        author_name,
        imgUrl: thumbnail_url,
        source: provider_name,
        url: oembedUrl.split('&')[0].split('url=')[1],
        duration,
      }).then((res) => res);
    })
    .catch((e) => {
      console.log(e);
      trackParsingError.parse('');
    });
};

const getSpotifyTrackInfo = async (
  url: string,
  accessToken: string,
  userId: string,
  originalUrl: string,
) => {
  return await axios
    .get<SpotifyTrack>(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(async (res) => {
      const { name, artists, album, uri, id, duration_ms } = res.data;

      const duration = formatSpotifyTime(duration_ms);

      await createSearchHistory(userId, {
        title: name,
        author_name: artists[0].name,
        imgUrl: album.images[0].url,
        source: 'Spotify',
        url: originalUrl,
        duration,
      });

      return {
        title: name,
        author: artists[0].name,
        imgUrl: album.images[0].url,
        source: 'Spotify',
        url: uri,
        urlId: id,
        duration,
      };
    })
    .catch(() => trackParsingError.parse(''));
};

const updateOrder = async (trackId: string) => {
  return await prisma.track.update({
    where: { id: trackId },
    data: { updatedAt: new Date() },
  });
};

const deleteFromSaved = async (trackId: string) => {
  return await prisma.track.update({
    where: { id: trackId },
    data: { userIdTracks: null },
  });
};

const checkTrack = async (trackId: string, userId: string) => {
  return await prisma.track.findUnique({
    where: { id: trackId, userIdTracks: userId },
  });
};

export const trackService = {
  createTrack,
  checkExistingTrack,
  getOembedTrackInfo,
  getSpotifyTrackInfo,
  getTrackId,
  updateOrder,
  deleteFromSaved,
  checkTrack,
};
