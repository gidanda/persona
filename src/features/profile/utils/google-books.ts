import { env } from "@/lib/env";

type GoogleBookVolume = {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    infoLink?: string;
  };
};

type GoogleBooksResponse = {
  items?: GoogleBookVolume[];
};

type BookSearchItem = {
  externalId: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  deeplinkUrl: string | null;
};

export async function searchGoogleBooks(query: string): Promise<BookSearchItem[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const params = new URLSearchParams({
    q: normalizedQuery,
    maxResults: "5",
    langRestrict: "ja",
    printType: "books",
  });

  if (env.GOOGLE_BOOKS_API_KEY) {
    params.set("key", env.GOOGLE_BOOKS_API_KEY);
  }

  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Google Books search failed with ${response.status}.`);
  }

  const data = (await response.json()) as GoogleBooksResponse;

  return (data.items ?? []).map((item) => ({
    externalId: item.id,
    title: item.volumeInfo?.title ?? "Untitled",
    subtitle: item.volumeInfo?.authors?.join(", ") ?? "",
    imageUrl:
      item.volumeInfo?.imageLinks?.thumbnail?.replace("http://", "https://") ??
      item.volumeInfo?.imageLinks?.smallThumbnail?.replace("http://", "https://") ??
      null,
    deeplinkUrl: item.volumeInfo?.infoLink ?? null,
  }));
}
