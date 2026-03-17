import { env } from "@/lib/env";

type TmdbMovie = {
  id: number;
  title: string;
  release_date?: string;
  poster_path?: string | null;
};

type TmdbSearchResponse = {
  results?: TmdbMovie[];
};

type MovieSearchItem = {
  externalId: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  deeplinkUrl: string | null;
};

export function hasTmdbApiKey() {
  return Boolean(env.TMDB_API_KEY);
}

export async function searchTmdbMovies(query: string): Promise<MovieSearchItem[]> {
  if (!env.TMDB_API_KEY) {
    throw new Error("TMDb API key is not configured.");
  }

  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const params = new URLSearchParams({
    api_key: env.TMDB_API_KEY,
    query: normalizedQuery,
    include_adult: "false",
    language: "ja-JP",
    page: "1",
  });
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`TMDb search failed with ${response.status}.`);
  }

  const data = (await response.json()) as TmdbSearchResponse;

  return (data.results ?? []).slice(0, 5).map((item) => ({
    externalId: String(item.id),
    title: item.title,
    subtitle: item.release_date ? item.release_date.slice(0, 4) : "",
    imageUrl: item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : null,
    deeplinkUrl: `https://www.themoviedb.org/movie/${item.id}`,
  }));
}
