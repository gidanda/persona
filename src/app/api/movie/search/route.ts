import { NextResponse } from "next/server";

import { hasTmdbApiKey, searchTmdbMovies } from "@/features/profile/utils/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!hasTmdbApiKey()) {
    return NextResponse.json(
      { items: [], message: "TMDb API key is not configured." },
      { status: 503 },
    );
  }

  if (!query) {
    return NextResponse.json({ items: [] });
  }

  try {
    const items = await searchTmdbMovies(query);

    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { items: [], message: "Movie search failed." },
      { status: 500 },
    );
  }
}
