export type SpotifyTrack = {
  name: string;
  artists: SpotifyArtists[];
  album: ThumbnailUrl;
  id: string;
  uri: string;
  duration_ms: number;
};

type SpotifyArtists = {
  name: string;
};

type ThumbnailUrl = {
  images: Record<'url', string>[];
};
