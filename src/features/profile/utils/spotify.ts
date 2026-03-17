import { env } from "@/lib/env";

type SpotifyTokenResponse = {
  access_token: string;
  expires_in: number;
};

type SpotifyTrackItem = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  external_urls?: {
    spotify?: string;
  };
};

type SpotifySearchResponse = {
  tracks?: {
    items: SpotifyTrackItem[];
  };
};

type MusicSearchItem = {
  externalId: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  deeplinkUrl: string | null;
};

let cachedToken: { value: string; expiresAt: number } | null = null;

export function hasSpotifyCredentials() {
  return Boolean(env.SPOTIFY_CLIENT_ID && env.SPOTIFY_CLIENT_SECRET);
}

async function getSpotifyAccessToken() {
  if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET) {
    throw new Error("Spotify credentials are not configured.");
  }

  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const credentials = Buffer.from(
    `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Spotify token request failed with ${response.status}.`);
  }

  const data = (await response.json()) as SpotifyTokenResponse;
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + Math.max((data.expires_in - 60) * 1000, 30_000),
  };

  return data.access_token;
}

export async function searchSpotifyTracks(query: string): Promise<MusicSearchItem[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const token = await getSpotifyAccessToken();
  const params = new URLSearchParams({
    q: normalizedQuery,
    type: "track",
    limit: "5",
    market: "JP",
  });
  const response = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Spotify search failed with ${response.status}.`);
  }

  const data = (await response.json()) as SpotifySearchResponse;

  return (data.tracks?.items ?? []).map((item) => ({
    externalId: item.id,
    title: item.name,
    subtitle: [item.artists.map((artist) => artist.name).join(", "), item.album.name]
      .filter(Boolean)
      .join(" · "),
    imageUrl: item.album.images[0]?.url ?? null,
    deeplinkUrl: item.external_urls?.spotify ?? null,
  }));
}
