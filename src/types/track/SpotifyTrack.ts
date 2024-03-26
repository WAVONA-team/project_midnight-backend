export type SpotifyTrack = {
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
